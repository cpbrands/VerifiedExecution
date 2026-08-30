#!/usr/bin/env python3

from pathlib import Path

FIELD_FORMS = {"boolean", "integer", "text", "bytes", "record", "sequence"}
SUBJECT_FORMS = {
    "ActionContentReference",
    "ActionOccurrenceReference",
    "EventReference",
    "ExternalSubjectReference",
}

ISSUER_DOMAIN = {"identifier": {"form": "text"}, "equality": "canonical"}
SUBJECT_DOMAIN = {"identifier": {"form": "text"}, "equality": "canonical"}
VALUE_SEMANTICS = {"value": {"form": "boolean"}}

C_A = "a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e"
C_C = "a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e"
C_WITH_DOMAIN = "a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e"
SUBJECT_CONSTRAINTS_KEY = "737375626a6563745f636f6e" + "73747261696e7473"
D_VALUES = "846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365"
E_VALUES = "82781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365"
EXPECTED = {
    "V1.1-A": C_A,
    "V1.1-B": C_A,
    "V1.1-C": C_C,
    "V1.1-D": C_WITH_DOMAIN + SUBJECT_CONSTRAINTS_KEY + D_VALUES,
    "V1.1-E": C_WITH_DOMAIN + SUBJECT_CONSTRAINTS_KEY + E_VALUES,
}

V1_DOCUMENT = Path(__file__).with_name("PREDICATE-SCHEMA-CANONICALIZATION-V1.md").read_text()
V1_A_SECTION = V1_DOCUMENT.split("### V1-A", 1)[1].split("### V1-B", 1)[0]
V1_A = next(
    line.strip()
    for line in V1_A_SECTION.splitlines()
    if len(line.strip()) >= 100 and set(line.strip()) <= set("0123456789abcdef")
)

REFERENCES = {
    "fixture://subject-domain/text": SUBJECT_DOMAIN,
    "fixture://subject-domain/cycle-a": {"subject_domain_ref": "fixture://subject-domain/cycle-b"},
    "fixture://subject-domain/cycle-b": {"subject_domain_ref": "fixture://subject-domain/cycle-a"},
}

def fail(code):
    raise ValueError(code)

def head(major, length):
    if length < 24:
        return bytes([(major << 5) | length])
    if length <= 255:
        return bytes([(major << 5) | 24, length])
    fail("encoder-length")

def encode(value):
    if isinstance(value, str):
        data = value.encode("utf-8")
        return head(3, len(data)) + data
    if isinstance(value, bool):
        return bytes([0xf5 if value else 0xf4])
    if isinstance(value, list):
        return head(4, len(value)) + b"".join(encode(item) for item in value)
    if isinstance(value, dict):
        entries = sorted(((encode(key), encode(item)) for key, item in value.items()), key=lambda pair: pair[0])
        return head(5, len(entries)) + b"".join(key + item for key, item in entries)
    fail("encoder-type")

def exact_keys(value, keys):
    return isinstance(value, dict) and set(value.keys()) == set(keys)

def normalize_field_form(form):
    if not exact_keys(form, ["form"]) or form["form"] not in FIELD_FORMS:
        fail("profile-grammar-validation")
    return {"form": form["form"]}

def resolve_subject_domain(reference, seen=None):
    seen = set() if seen is None else set(seen)
    if reference in seen:
        fail("reference-expansion-cycle")
    if reference not in REFERENCES:
        fail("reference-resolution")
    source = REFERENCES[reference]
    if "subject_domain_ref" in source:
        seen.add(reference)
        return resolve_subject_domain(source["subject_domain_ref"], seen)
    return source

def normalize_subject_domain(domain):
    if not exact_keys(domain, ["identifier", "equality"]):
        fail("bounded-subset-admission")
    if domain["equality"] != "canonical":
        fail("bounded-subset-admission")
    return {"identifier": normalize_field_form(domain["identifier"]), "equality": "canonical"}

def normalize_constraints(values):
    if not isinstance(values, list) or not values or any(value not in SUBJECT_FORMS for value in values):
        fail("bounded-subset-admission")
    normalized = sorted(values, key=encode)
    if any(left == right for left, right in zip(normalized, normalized[1:])):
        fail("bounded-subset-admission")
    return normalized

def normalize(source):
    if "subject_domain" in source and "subject_domain_ref" in source:
        fail("source-admission")
    result = {"issuer_domain": ISSUER_DOMAIN, "value_semantics": VALUE_SEMANTICS}
    if "subject_domain" in source or "subject_domain_ref" in source:
        domain = source["subject_domain"] if "subject_domain" in source else resolve_subject_domain(source["subject_domain_ref"])
        result["subject_domain"] = normalize_subject_domain(domain)
    if "subject_constraints" in source:
        result["subject_constraints"] = normalize_constraints(source["subject_constraints"])
    return result

ACCEPTED = {
    "V1.1-A": {"subject_domain": SUBJECT_DOMAIN},
    "V1.1-B": {"subject_domain_ref": "fixture://subject-domain/text"},
    "V1.1-C": {},
    "V1.1-D": {"subject_domain": SUBJECT_DOMAIN, "subject_constraints": ["ActionOccurrenceReference", "ExternalSubjectReference", "ActionContentReference", "EventReference"]},
    "V1.1-E": {"subject_domain": SUBJECT_DOMAIN, "subject_constraints": ["ActionOccurrenceReference", "ExternalSubjectReference"]},
}
REJECTED = {
    "R1": ({"subject_domain": SUBJECT_DOMAIN, "subject_domain_ref": "fixture://subject-domain/text"}, "source-admission"),
    "R2": ({"subject_domain_ref": "fixture://subject-domain/unavailable"}, "reference-resolution"),
    "R3": ({"subject_domain_ref": "fixture://subject-domain/cycle-a"}, "reference-expansion-cycle"),
    "R4": ({"subject_domain": {"equality": "canonical"}}, "bounded-subset-admission"),
    "R5": ({"subject_domain": {"identifier": {"form": "text"}, "equality": "casefold"}}, "bounded-subset-admission"),
    "R6": ({"subject_domain": {"identifier": {"form": "text"}, "equality": "canonical", "normalization": "nfc"}}, "bounded-subset-admission"),
    "R7": ({"subject_domain": {"identifier": {"form": "decimal"}, "equality": "canonical"}}, "profile-grammar-validation"),
    "R8": ({"subject_domain": SUBJECT_DOMAIN, "subject_constraints": ["UnknownSubjectReference"]}, "bounded-subset-admission"),
}

for name, source in ACCEPTED.items():
    actual = encode(normalize(source)).hex()
    assert actual == EXPECTED[name], f"{name}: {actual}"
    print(f"PASS {name} {actual}")

assert EXPECTED["V1.1-A"] == EXPECTED["V1.1-B"]
assert EXPECTED["V1.1-C"] == V1_A

for name, (source, expected) in REJECTED.items():
    try:
        normalize(source)
    except ValueError as error:
        assert str(error) == expected, f"{name}: {error}"
    else:
        raise AssertionError(f"{name}: accepted")
    print(f"PASS {name} rejects at {expected}")

print("PASS Python: 5 accepted, 8 rejected")
