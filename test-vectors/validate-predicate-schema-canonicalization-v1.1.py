#!/usr/bin/env python3

import hashlib
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

# These h'02' values are permanent assignments for the Approved v1.1 closure.
# This test independently verifies the corresponding fixed construction.
CANDIDATE_SUITE = 0x02
CANDIDATE_PROFILE = 0x02
MAGIC = b"VEPSCID1"
IDENTITY_ANCHORS = {
    "A": {
        "canonical": C_A,
        "frame": "84485645505343494431410241025897a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e",
        "digest": "038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f",
        "identity": "02038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f",
    },
    "C": {
        "canonical": C_C,
        "frame": "8448564550534349443141024102585ea26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e",
        "digest": "1f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d",
        "identity": "021f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d",
    },
    "D": {
        "canonical": C_WITH_DOMAIN + SUBJECT_CONSTRAINTS_KEY + D_VALUES,
        "frame": "8448564550534349443141024102590107a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e7473846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365",
        "digest": "0d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc",
        "identity": "020d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc",
    },
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
    if length <= 65535:
        return bytes([(major << 5) | 25, length >> 8, length & 0xff])
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

def byte_string(value):
    return head(2, len(value)) + value

def suite_frame(canonical, suite, profile):
    return b"".join((
        bytes([0x84]),
        byte_string(MAGIC),
        byte_string(bytes([suite])),
        byte_string(bytes([profile])),
        byte_string(canonical),
    ))

def digest(frame):
    return hashlib.sha256(frame).digest()

def suite_definition(suite):
    if suite == 0x01:
        return {"profile": 0x01}
    if suite == CANDIDATE_SUITE:
        return {"profile": CANDIDATE_PROFILE}
    fail("unknown-suite")

def suite_identity(canonical, suite):
    profile = suite_definition(suite)["profile"]
    return bytes([suite]) + digest(suite_frame(canonical, suite, profile))

def candidate_frame(canonical):
    return suite_frame(canonical, CANDIDATE_SUITE, CANDIDATE_PROFILE)

def candidate_identity(canonical):
    return suite_identity(canonical, CANDIDATE_SUITE)

def decode_byte_string(frame, offset):
    if offset >= len(frame) or frame[offset] >> 5 != 2:
        fail("frame-byte-string")
    additional = frame[offset] & 0x1f
    cursor = offset + 1
    if additional < 24:
        length = additional
    elif additional == 24 and cursor < len(frame):
        length = frame[cursor]
        cursor += 1
    elif additional == 25 and cursor + 1 < len(frame):
        length = int.from_bytes(frame[cursor:cursor + 2], "big")
        cursor += 2
    else:
        fail("frame-length")
    if cursor + length > len(frame):
        fail("frame-truncated")
    return frame[cursor:cursor + length], cursor + length

def decode_candidate_frame(frame):
    if not frame or frame[0] != 0x84:
        fail("frame-shape")
    values = []
    cursor = 1
    for _ in range(4):
        value, cursor = decode_byte_string(frame, cursor)
        values.append(value)
    if cursor != len(frame):
        fail("frame-trailing-material")
    return values

def verify_as_suite(suite, identity, canonical):
    if len(identity) != 33:
        fail("identity-length")
    profile = suite_definition(suite)["profile"]
    if identity != suite_identity(canonical, suite):
        fail("identity-mismatch")
    magic, framed_suite, framed_profile, embedded_canonical = decode_candidate_frame(suite_frame(canonical, suite, profile))
    if magic != MAGIC or framed_suite != bytes([suite]) or framed_profile != bytes([profile]) or embedded_canonical != canonical:
        fail("frame-binding")
    return True

def verify_identity(identity, canonical):
    if len(identity) != 33:
        fail("identity-length")
    return verify_as_suite(identity[0], identity, canonical)

def verify_framed_identity(identity, frame):
    if len(identity) != 33:
        fail("identity-length")
    magic, framed_suite, framed_profile, _ = decode_candidate_frame(frame)
    if magic != MAGIC or len(framed_suite) != 1 or len(framed_profile) != 1:
        fail("frame-binding")
    if identity[0] != framed_suite[0]:
        fail("suite-prefix-mismatch")
    suite_definition(framed_suite[0])
    expected = framed_suite + digest(frame)
    if identity != expected:
        fail("identity-mismatch")
    return True

def legacy_pscid1_identity(canonical):
    return suite_identity(canonical, 0x01)

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

for name, anchor in IDENTITY_ANCHORS.items():
    canonical = bytes.fromhex(anchor["canonical"])
    frame = candidate_frame(canonical)
    actual_digest = digest(frame)
    actual_identity = candidate_identity(canonical)
    assert frame.hex() == anchor["frame"], f"Anchor {name}: frame"
    assert actual_digest.hex() == anchor["digest"], f"Anchor {name}: digest"
    assert actual_identity.hex() == anchor["identity"], f"Anchor {name}: identity"
    magic, suite, profile, embedded_canonical = decode_candidate_frame(frame)
    assert magic == b"VEPSCID1", f"Anchor {name}: magic"
    assert suite == bytes([CANDIDATE_SUITE]), f"Anchor {name}: suite"
    assert profile == bytes([CANDIDATE_PROFILE]), f"Anchor {name}: profile"
    assert embedded_canonical == canonical, f"Anchor {name}: canonical embedding"
    assert verify_identity(actual_identity, canonical), f"Anchor {name}: verification"
    print(f"PASS anchor {name}: C={len(canonical)}, frame={len(frame)}, identity={len(actual_identity)}")

anchor_c = IDENTITY_ANCHORS["C"]
candidate_c = bytes.fromhex(anchor_c["canonical"])
candidate_identity_c = bytes.fromhex(anchor_c["identity"])
legacy_identity_c = legacy_pscid1_identity(candidate_c)
PSCID1_ANCHOR_C = bytes.fromhex("01634b3118ec88e36cf5eab44b86092e88f309fe918a99db460222fbd76946b80a")
assert candidate_c.hex() == V1_A
assert legacy_identity_c == PSCID1_ANCHOR_C
assert candidate_identity_c != legacy_identity_c

suite_relabel = bytearray(candidate_identity_c)
suite_relabel[0] = 0x01
assert bytes(suite_relabel) != legacy_identity_c, "N1 relabeled candidate differs from the actual PSCID-1 identity"
try:
    verify_identity(bytes(suite_relabel), candidate_c)
except ValueError as error:
    assert str(error) == "identity-mismatch", f"N1: {error}"
else:
    raise AssertionError("N1: accepted")

profile_relabel = bytes([CANDIDATE_SUITE]) + digest(suite_frame(candidate_c, CANDIDATE_SUITE, 0x01))
try:
    verify_identity(profile_relabel, candidate_c)
except ValueError as error:
    assert str(error) == "identity-mismatch", f"N2: {error}"
else:
    raise AssertionError("N2: accepted")

try:
    verify_as_suite(0x01, candidate_identity_c, candidate_c)
except ValueError as error:
    assert str(error) == "identity-mismatch", f"N3: {error}"
else:
    raise AssertionError("N3: accepted")

try:
    verify_identity(bytes([0x03]) + candidate_identity_c[1:], candidate_c)
except ValueError as error:
    assert str(error) == "unknown-suite", f"N4: {error}"
else:
    raise AssertionError("N4: accepted")

substituted_frame = suite_frame(candidate_c, CANDIDATE_SUITE, 0x01)
assert digest(substituted_frame) != candidate_identity_c[1:], "N5: tampered frame digest differs without identity recomputation"
try:
    verify_framed_identity(candidate_identity_c, substituted_frame)
except ValueError as error:
    assert str(error) == "identity-mismatch", f"N5: {error}"
else:
    raise AssertionError("N5: accepted")

print("PASS Python: 5 accepted, 8 rejected, 3 identity anchors, 5 confusion cases")
