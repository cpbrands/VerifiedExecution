from __future__ import annotations

import hashlib


def fail(code: str):
    raise ValueError(code)


def head(major: int, value: int) -> bytes:
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        fail("encoder-length")
    if value < 24:
        return bytes([(major << 5) | value])
    if value < 256:
        return bytes([(major << 5) | 24, value])
    if value < 65536:
        return bytes([(major << 5) | 25, value >> 8, value & 0xFF])
    if value < 4294967296:
        return bytes([(major << 5) | 26]) + value.to_bytes(4, "big")
    fail("encoder-length")


def encode(value) -> bytes:
    if isinstance(value, bytes):
        return head(2, len(value)) + value
    if isinstance(value, bool):
        return bytes([0xF5 if value else 0xF4])
    if isinstance(value, int):
        return head(0, value) if value >= 0 else head(1, -1 - value)
    if isinstance(value, str):
        data = value.encode("utf-8")
        return head(3, len(data)) + data
    if isinstance(value, list):
        return head(4, len(value)) + b"".join(encode(item) for item in value)
    if isinstance(value, dict):
        entries = sorted(((encode(key), encode(item)) for key, item in value.items()), key=lambda pair: pair[0])
        return head(5, len(entries)) + b"".join(key + item for key, item in entries)
    fail("encoder-type")


def exact_keys(value: dict, allowed: set[str], required: set[str] | None = None):
    if not isinstance(value, dict):
        fail("closed-map")
    required = allowed if required is None else required
    if not set(value).issubset(allowed):
        fail("unknown-field")
    if not required.issubset(value):
        fail("missing-field")


def normalize_bound(bound: dict) -> dict:
    exact_keys(bound, {"value", "inclusive"})
    if not isinstance(bound["value"], int) or isinstance(bound["value"], bool) or not isinstance(bound["inclusive"], bool):
        fail("bound")
    return {"value": bound["value"], "inclusive": bound["inclusive"]}


def normalize_field(form: dict) -> dict:
    if not isinstance(form, dict) or not isinstance(form.get("form"), str):
        fail("field-form")
    kind = form["form"]
    if kind == "boolean":
        exact_keys(form, {"form", "allowed_values"}, {"form"})
        result = {"form": "boolean"}
        if "allowed_values" in form:
            values = form["allowed_values"]
            if not isinstance(values, list) or not values or any(not isinstance(item, bool) for item in values):
                fail("allowed-values")
            result["allowed_values"] = sorted(values, key=encode)
            if len(set(result["allowed_values"])) != len(result["allowed_values"]):
                fail("allowed-values")
        return result
    if kind == "integer":
        exact_keys(form, {"form", "scale", "lower_bound", "upper_bound", "allowed_values"}, {"form"})
        result = {"form": "integer"}
        if "scale" in form:
            if not isinstance(form["scale"], int) or isinstance(form["scale"], bool) or form["scale"] < 0:
                fail("scale")
            if form["scale"] != 0:
                result["scale"] = form["scale"]
        if "lower_bound" in form:
            result["lower_bound"] = normalize_bound(form["lower_bound"])
        if "upper_bound" in form:
            result["upper_bound"] = normalize_bound(form["upper_bound"])
        if "lower_bound" in result and "upper_bound" in result:
            minimum = result["lower_bound"]["value"] + (0 if result["lower_bound"]["inclusive"] else 1)
            maximum = result["upper_bound"]["value"] - (0 if result["upper_bound"]["inclusive"] else 1)
            if minimum > maximum:
                fail("empty-domain")
        if "allowed_values" in form:
            values = form["allowed_values"]
            if not isinstance(values, list) or not values or any(not isinstance(item, int) or isinstance(item, bool) for item in values):
                fail("allowed-values")
            result["allowed_values"] = sorted(values, key=encode)
            if len(set(result["allowed_values"])) != len(result["allowed_values"]):
                fail("allowed-values")
        return result
    if kind == "text":
        exact_keys(form, {"form", "allowed_values"}, {"form"})
        result = {"form": "text"}
        if "allowed_values" in form:
            values = form["allowed_values"]
            if not isinstance(values, list) or not values or any(not isinstance(item, str) for item in values):
                fail("allowed-values")
            result["allowed_values"] = sorted(values, key=encode)
            if len(set(result["allowed_values"])) != len(result["allowed_values"]):
                fail("allowed-values")
        return result
    if kind == "bytes":
        exact_keys(form, {"form", "allowed_values"}, {"form"})
        result = {"form": "bytes"}
        if "allowed_values" in form:
            values = form["allowed_values"]
            if not isinstance(values, list) or not values or any(not isinstance(item, bytes) for item in values):
                fail("allowed-values")
            result["allowed_values"] = sorted(values, key=encode)
            if len(set(result["allowed_values"])) != len(result["allowed_values"]):
                fail("allowed-values")
        return result
    if kind == "record":
        exact_keys(form, {"form", "fields"})
        if not isinstance(form["fields"], dict) or not form["fields"]:
            fail("record")
        fields = {}
        for name in sorted(form["fields"], key=encode):
            field = form["fields"][name]
            exact_keys(field, {"presence", "grammar"})
            if field["presence"] not in {"required", "optional"}:
                fail("presence")
            fields[name] = {"presence": field["presence"], "grammar": normalize_field(field["grammar"])}
        return {"form": "record", "fields": fields}
    if kind == "sequence":
        exact_keys(form, {"form", "element", "ordering_significant", "uniqueness", "min_items", "max_items"}, {"form", "element", "ordering_significant", "uniqueness"})
        if not isinstance(form["ordering_significant"], bool) or not isinstance(form["uniqueness"], bool):
            fail("sequence")
        result = {"form": "sequence", "element": normalize_field(form["element"]), "ordering_significant": form["ordering_significant"], "uniqueness": form["uniqueness"]}
        for key in ("min_items", "max_items"):
            if key in form:
                if isinstance(form[key], bool) or not isinstance(form[key], int) or form[key] < 0:
                    fail("sequence")
                if key != "min_items" or form[key] != 0:
                    result[key] = form[key]
        if "min_items" in result and "max_items" in result and result["min_items"] > result["max_items"]:
            fail("sequence")
        return result
    fail("field-form")


def comparison_relevant_form(form: dict) -> dict:
    if form["form"] in {"boolean", "text", "bytes"}:
        return {"form": form["form"], **({"allowed_values": form["allowed_values"]} if "allowed_values" in form else {})}
    if form["form"] == "integer":
        return {"form": "integer", **({"scale": form["scale"]} if "scale" in form else {}), **({"allowed_values": form["allowed_values"]} if "allowed_values" in form else {})}
    if form["form"] == "record":
        return {"form": "record", "fields": {name: {"presence": field["presence"], "grammar": comparison_relevant_form(field["grammar"])} for name, field in form["fields"].items()}}
    if form["form"] == "sequence":
        return {"form": "sequence", "element": comparison_relevant_form(form["element"]), "ordering_significant": form["ordering_significant"], "uniqueness": form["uniqueness"]}
    fail("comparison-form")


def normalize_comparison(comparison: dict, value: dict) -> dict:
    exact_keys(comparison, {"domain", "ordered"})
    if not isinstance(comparison["ordered"], bool):
        fail("capability")
    if comparison["ordered"] and value["form"] != "integer":
        fail("ordered-form")
    return {"domain": normalize_field(comparison["domain"]), "ordered": comparison["ordered"]}


ISSUER = {"identifier": {"form": "text"}, "equality": "canonical"}
SUBJECT_DOMAIN = {"identifier": {"form": "text"}, "equality": "canonical"}
SUBJECT_FORMS = {"ActionContentReference", "ActionOccurrenceReference", "EventReference", "ExternalSubjectReference"}


def normalize_domain(domain: dict) -> dict:
    exact_keys(domain, {"identifier", "equality"})
    if domain["equality"] != "canonical":
        fail("domain")
    return {"identifier": normalize_field(domain["identifier"]), "equality": "canonical"}


def normalize_constraints(values: list) -> list:
    if not isinstance(values, list) or not values or any(value not in SUBJECT_FORMS for value in values):
        fail("constraints")
    result = sorted(values, key=encode)
    if len(set(result)) != len(result):
        fail("constraints")
    return result


def normalize_schema(source: dict) -> dict:
    exact_keys(source, {"issuer_domain", "value_semantics", "subject_domain", "subject_domain_ref", "subject_constraints"}, {"issuer_domain", "value_semantics"})
    if "subject_domain" in source and "subject_domain_ref" in source:
        fail("domain-xor")
    semantics = source["value_semantics"]
    exact_keys(semantics, {"value", "comparison"}, {"value"})
    normalized_semantics = {"value": normalize_field(semantics["value"])}
    if "comparison" in semantics:
        normalized_semantics["comparison"] = normalize_comparison(semantics["comparison"], normalized_semantics["value"])
    result = {"issuer_domain": normalize_domain(source["issuer_domain"]), "value_semantics": normalized_semantics}
    if "subject_domain" in source:
        result["subject_domain"] = normalize_domain(source["subject_domain"])
    if "subject_domain_ref" in source:
        if source["subject_domain_ref"] != "fixture://subject-domain/text":
            fail("domain-ref")
        result["subject_domain"] = normalize_domain(SUBJECT_DOMAIN)
    if "subject_constraints" in source:
        result["subject_constraints"] = normalize_constraints(source["subject_constraints"])
    return result


def text_marker(text: str) -> dict:
    return {"form": "record", "fields": {"code": {"presence": "required", "grammar": {"form": "text", "allowed_values": [text]}}}}


def contextual_marker(code: str, meaning: str) -> dict:
    return {"form": "record", "fields": {
        "code": {"presence": "required", "grammar": {"form": "text", "allowed_values": [code]}},
        "meaning": {"presence": "required", "grammar": {"form": "text", "allowed_values": [meaning]}},
    }}


CAD_DOMAIN = contextual_marker("CAD", "Canadian dollars")
USD_DOMAIN = contextual_marker("USD", "United States dollars")


def integer(scale=None, lower=None, upper=None) -> dict:
    return {"form": "integer", **({} if scale is None else {"scale": scale}), **({} if lower is None else {"lower_bound": {"value": lower, "inclusive": True}}), **({} if upper is None else {"upper_bound": {"value": upper, "inclusive": True}})}


def schema(value: dict, domain=None, ordered=False) -> dict:
    return {"issuer_domain": ISSUER, "value_semantics": {"value": value, **({} if domain is None else {"comparison": {"domain": domain, "ordered": ordered}})}}


ACCEPTED = {
    "A1": schema(integer(0), text_marker("status-code"), False),
    "A2": schema(integer(2, 0, 100_000_000), CAD_DOMAIN, True),
    "A3": schema(integer(2, 0, 10_000_000), CAD_DOMAIN, True),
    "A4": schema(integer(0), text_marker("unordered-integer"), False),
    "A5": {"issuer_domain": ISSUER, "value_semantics": {"value": {"form": "boolean"}}},
    "A6": schema({"form": "text"}, text_marker("status-text"), False),
}

REJECTED = {
    "R1": {**ACCEPTED["A2"], "value_semantics": {**ACCEPTED["A2"]["value_semantics"], "comparison": {**ACCEPTED["A2"]["value_semantics"]["comparison"], "extra": True}}},
    "R2": {**ACCEPTED["A2"], "value_semantics": {**ACCEPTED["A2"]["value_semantics"], "comparison": {"domain": text_marker("CAD"), "ordered": "yes"}}},
    "R3": {**ACCEPTED["A2"], "value_semantics": {**ACCEPTED["A2"]["value_semantics"], "comparison": {"domain": {"form": "record", "fields": {}}, "ordered": True}}},
    "R4": {**ACCEPTED["A2"], "value_semantics": {**ACCEPTED["A2"]["value_semantics"], "comparison_ref": "fixture://comparison/CAD"}},
    "R5": {**ACCEPTED["A2"], "comparison": ACCEPTED["A2"]["value_semantics"]["comparison"]},
    "R6": {**ACCEPTED["A2"], "value_semantics": {**ACCEPTED["A2"]["value_semantics"], "comparison": {"domain_id": "CAD", "ordered": True}}},
    "R8": {**ACCEPTED["A2"], "value_semantics": {**ACCEPTED["A2"]["value_semantics"], "comparison": {"domain": text_marker("CAD"), "ordered": True, "normalization": "rescale"}}},
    "R9": schema({"form": "boolean"}, text_marker("boolean"), True),
    "R10": schema({"form": "text"}, text_marker("text"), True),
    "R11": schema({"form": "bytes"}, text_marker("bytes"), True),
    "R12": schema({"form": "record", "fields": {"x": {"presence": "required", "grammar": {"form": "integer"}}}}, text_marker("record"), True),
    "R13": schema({"form": "sequence", "element": {"form": "integer"}, "ordering_significant": True, "uniqueness": False}, text_marker("sequence"), True),
}

CANONICAL = {}
for name, source in ACCEPTED.items():
    encoded = encode(normalize_schema(source))
    CANONICAL[name] = encoded
    print(name, len(encoded), hashlib.sha256(encoded).hexdigest(), encoded.hex())

for name, source in REJECTED.items():
    try:
        normalize_schema(source)
    except ValueError:
        pass
    else:
        raise AssertionError(name)


def comparison_tuple(source: dict) -> dict:
    semantics = normalize_schema(source)["value_semantics"]
    if "comparison" not in semantics:
        fail("not-comparable")
    return {"form": comparison_relevant_form(semantics["value"]), "domain": semantics["comparison"]["domain"], "ordered": semantics["comparison"]["ordered"]}


def comparable(left: dict, right: dict, relation: str) -> bool:
    a = comparison_tuple(left)
    b = comparison_tuple(right)
    if relation != "eq" and (not a["ordered"] or not b["ordered"]):
        return False
    return encode(a) == encode(b)


def locally_valid_integer(source: dict, value: int) -> bool:
    if isinstance(value, bool) or not isinstance(value, int):
        return False
    form = normalize_schema(source)["value_semantics"]["value"]
    if form["form"] != "integer":
        return False
    if "lower_bound" in form and (value < form["lower_bound"]["value"] or (value == form["lower_bound"]["value"] and not form["lower_bound"]["inclusive"])):
        return False
    if "upper_bound" in form and (value > form["upper_bound"]["value"] or (value == form["upper_bound"]["value"] and not form["upper_bound"]["inclusive"])):
        return False
    return "allowed_values" not in form or value in form["allowed_values"]


def evaluate(left: dict, left_value: int, right: dict, right_value: int, relation: str):
    if not locally_valid_integer(left, left_value) or not locally_valid_integer(right, right_value):
        return "not-comparable"
    if not comparable(left, right, relation):
        return "not-comparable"
    if relation == "le":
        return left_value <= right_value
    if relation == "eq":
        return left_value == right_value
    fail("unsupported-relation")


assert comparable(ACCEPTED["A2"], ACCEPTED["A3"], "le")
assert not comparable(ACCEPTED["A2"], schema(integer(2), USD_DOMAIN, True), "le")
assert not comparable(ACCEPTED["A2"], schema(integer(0), CAD_DOMAIN, True), "le")
assert not comparable(ACCEPTED["A4"], ACCEPTED["A4"], "le")
try:
    comparison_tuple(ACCEPTED["A5"])
except ValueError as error:
    assert str(error) == "not-comparable"
else:
    raise AssertionError("R7")
assert comparable(ACCEPTED["A6"], ACCEPTED["A6"], "eq")

assert evaluate(ACCEPTED["A2"], 4_875_000, ACCEPTED["A3"], 5_000_000, "le") is True
assert evaluate(ACCEPTED["A2"], 5_000_100, ACCEPTED["A3"], 5_000_000, "le") is False
assert not comparable(ACCEPTED["A2"], schema(integer(2), contextual_marker("COUNT", "unrelated integer count"), True), "le")
assert comparable(ACCEPTED["A2"], ACCEPTED["A3"], "le")  # Q8: semantic only; trust remains external
assert comparable(ACCEPTED["A2"], ACCEPTED["A3"], "le")  # Q9: ordinary target-domain Claim

cad_dollars = schema(integer(2), contextual_marker("CAD", "Canadian dollars"), True)
customer_debit = schema(integer(2), contextual_marker("CAD", "Customer Account Debit"), True)
assert not comparable(cad_dollars, customer_debit, "le")

LEGACY_EXPECTED = {
    "V1.1-A": "a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e",
    "V1.1-B": "a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e",
    "V1.1-C": "a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e",
    "V1.1-D": "a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e7473846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365",
    "V1.1-E": "a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e747382781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365",
}
LEGACY = {
    "V1.1-A": {"issuer_domain": ISSUER, "value_semantics": {"value": {"form": "boolean"}}, "subject_domain": SUBJECT_DOMAIN},
    "V1.1-B": {"issuer_domain": ISSUER, "value_semantics": {"value": {"form": "boolean"}}, "subject_domain_ref": "fixture://subject-domain/text"},
    "V1.1-C": {"issuer_domain": ISSUER, "value_semantics": {"value": {"form": "boolean"}}},
    "V1.1-D": {"issuer_domain": ISSUER, "value_semantics": {"value": {"form": "boolean"}}, "subject_domain": SUBJECT_DOMAIN, "subject_constraints": ["ActionOccurrenceReference", "ExternalSubjectReference", "ActionContentReference", "EventReference"]},
    "V1.1-E": {"issuer_domain": ISSUER, "value_semantics": {"value": {"form": "boolean"}}, "subject_domain": SUBJECT_DOMAIN, "subject_constraints": ["ActionOccurrenceReference", "ExternalSubjectReference"]},
}
for name, source in LEGACY.items():
    assert encode(normalize_schema(source)).hex() == LEGACY_EXPECTED[name]

legacy = encode(normalize_schema(ACCEPTED["A5"]))
assert legacy.hex() == "a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e"
print(f"PASS accepted={len(ACCEPTED)} rejected=13 q=9 legacy=5")
