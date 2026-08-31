---
id: PREDICATE-SCHEMA-CANONICALIZATION-V1.1
title: Predicate Schema Canonicalization v1.1 Conformance Vectors
version: "1.1"
status: Approved
document_type: Conformance Vector
category: Conformance
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - ADR-ENC-001
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
related_documents:
  - PREDICATE-SCHEMA-CANONICALIZATION-V1
  - VE-CLAIM-REFERENCE-SEMANTICS
  - RFC-007
  - ADR-007
supersedes: null
superseded_by: null
---

# Predicate Schema Canonicalization v1.1 Conformance Vectors

## Status and scope

This Approved package defines conformance evidence for the v1.1 additions:
optional subject_domain, source-level subject_domain_ref expansion, and
ExternalSubjectReference in subject_constraints. Approved v1.0 and its vector
package remain authoritative and unchanged.

The vectors test canonical Predicate Schema bytes C. C is not a PSCID and does
not define Claim-body wire encoding. Approved DIGEST-001 v0.2 permanently
binds the v1.1 closure to representation-profile `h'02'` and PSCID suite
`h'02'`; CAD/unit semantics remain outside this bounded portable subset.

## Common fixture material

All accepted cases use the following fragments unless stated otherwise:

~~~text
issuer_domain = {
  "identifier": { "form": "text" },
  "equality": "canonical"
}

subject_domain = {
  "identifier": { "form": "text" },
  "equality": "canonical"
}

value_semantics = {
  "value": { "form": "boolean" }
}
~~~

C is lower-case hexadecimal deterministic VE-CBOR-1 encoding of the normalized
map. Source declaration order is non-semantic.

For the common issuer I, subject domain D, value semantics V, and optional
constraint array S, the following notation names the complete normalized maps:

~~~text
N(I, V) = {
  "issuer_domain": I,
  "value_semantics": V
}

N(I, D, V) = {
  "issuer_domain": I,
  "subject_domain": D,
  "value_semantics": V
}

N(I, D, V, S) = {
  "issuer_domain": I,
  "subject_domain": D,
  "value_semantics": V,
  "subject_constraints": S
}
~~~

## Accepted canonicalization vectors

### V1.1-A — Minimal inline subject domain

Source form:

~~~text
issuer_domain = inline common fixture
subject_domain = inline common fixture
value_semantics = inline common fixture
~~~

Normalized form:

~~~text
{
  "issuer_domain": {
    "identifier": { "form": "text" },
    "equality": "canonical"
  },
  "subject_domain": {
    "identifier": { "form": "text" },
    "equality": "canonical"
  },
  "value_semantics": { "value": { "form": "boolean" } }
}
~~~

Canonical C_A:

~~~text
a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
~~~

Acceptance rationale: the exact closed SubjectDomain map reuses only the
existing bounded FieldForm grammar and canonical equality.

### V1.1-B — Source-reference convergence

Source form:

~~~text
issuer_domain = inline common fixture
subject_domain_ref = fixture://subject-domain/text
value_semantics = inline common fixture

fixture://subject-domain/text
    -> resolves offline to the V1.1-A subject_domain fragment
~~~

Resolved, expanded, and normalized form: exactly V1.1-A's normalized map.

Canonical C_B:

~~~text
a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
~~~

~~~text
C_B == C_A
~~~

Acceptance rationale: source reuse disappears after expansion. It is neither a
canonical member nor a semantic-fragment identity.

### V1.1-C — Legacy v1.0 replay

Source form: the exact no-new-feature schema from
PREDICATE-SCHEMA-CANONICALIZATION-V1 vector V1-A.

~~~text
issuer_domain = inline common fixture
value_semantics = inline common fixture
~~~

Normalized v1.1 form is exactly v1.0 V1-A's normalized map; no subject_domain
or subject_constraints member is emitted: N(I, V).

Canonical C_C:

~~~text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
~~~

~~~text
Normalized_v1.1 == Normalized_v1.0
C_C == V1-A.C
~~~

Acceptance rationale: optional v1.1 members are absent, so N(I, V) is
byte-for-byte the v1.0 V1-A normalized structure.

### V1.1-D — Four-form subject-constraint sorting

Source form intentionally uses noncanonical constraint order:

~~~text
subject_domain = inline common fixture
subject_constraints = [
  "ActionOccurrenceReference",
  "ExternalSubjectReference",
  "ActionContentReference",
  "EventReference"
]
~~~

Normalized constraints:

~~~text
[
  "EventReference",
  "ActionContentReference",
  "ExternalSubjectReference",
  "ActionOccurrenceReference"
]
~~~

The complete normalized semantic form is N(I, D, V, S_D), where S_D is the
displayed four-member array.

Canonical C_D:

~~~text
a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e7473846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365
~~~

Acceptance rationale: the new symbolic member participates in the existing
encoded-byte ordering and duplicate-rejection rule. It adds no identifier or
Claim-payload encoding.

### V1.1-E — Subject domain does not require external use

Source form:

~~~text
subject_domain = inline common fixture
subject_constraints = [
  "ActionOccurrenceReference",
  "ExternalSubjectReference"
]
~~~

Normalized constraints:

~~~text
[
  "ExternalSubjectReference",
  "ActionOccurrenceReference"
]
~~~

The complete normalized semantic form is N(I, D, V, S_E), where S_E is the
displayed two-member array.

Canonical C_E:

~~~text
a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e747382781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365
~~~

Acceptance rationale: subject_domain supplies interpretation when the external
form is used; it neither requires external use nor changes Action occurrence.

## Rejected canonicalization vectors

| Vector | Source form | Failure stage and reason |
|---|---|---|
| R1 | inline subject_domain plus subject_domain_ref | Source admission: both authoritative source forms are present. |
| R2 | subject_domain_ref = fixture://subject-domain/unavailable | Reference resolution: required source cannot resolve. |
| R3 | subject_domain_ref resolves cycle-a -> cycle-b -> cycle-a | Reference expansion: cyclic dependency. |
| R4 | subject_domain = { equality: canonical } | Bounded-subset admission: required identifier is absent. |
| R5 | subject_domain.equality = casefold | Bounded-subset admission: only canonical is admitted. |
| R6 | subject_domain adds normalization = nfc | Bounded-subset admission: unknown semantic member and programmable normalization. |
| R7 | subject_domain.identifier = { form: decimal } | Profile/grammar validation: decimal is not an existing FieldForm. |
| R8 | subject_constraints = [UnknownSubjectReference] | Bounded-subset admission: closed subject union rejects the member. |

All unchanged v1.0 rejection boundaries remain applicable, including unsupported
issuer normalization, units, present substantive time semantics, unsupported
value equality, unknown grammar material, and unavailable/cyclic existing
field-specific references.

## Mechanically pinned ordering

The validators independently derive these deterministic VE-CBOR text-key
encodings:

| Map member | Encoded text key | Order |
|---|---|---|
| issuer_domain | 6d6973737565725f646f6d61696e | 1 |
| subject_domain | 6e7375626a6563745f646f6d61696e | 2 |
| time_semantics | 6e74696d655f73656d616e74696373 | 3 |
| value_semantics | 6f76616c75655f73656d616e74696373 | 4 |
| subject_constraints | 737375626a6563745f636f6e73747261696e7473 | 5 |

time_semantics remains absent in every profile-valid v1.1 vector. Its row
records only its relative VE-CBOR order if a future profile admits it.

Within SubjectDomain, deterministic map order is:

| Member | Encoded text key | Order |
|---|---|---|
| equality | 68657175616c697479 | 1 |
| identifier | 6a6964656e746966696572 | 2 |

The four subject-constraint values sort as EventReference,
ActionContentReference, ExternalSubjectReference, then
ActionOccurrenceReference.

## Independent verification

The [Node.js validator](validate-predicate-schema-canonicalization-v1.1.mjs)
and [Python validator](validate-predicate-schema-canonicalization-v1.1.py) are
independently written deterministic CBOR paths. Neither reads the other’s
output. Each verifies five accepted byte strings and eight rejection stages.

The paths agree exactly on C_A through C_E, including C_B == C_A and C_C ==
v1.0 V1-A's bytes.

## Normative v1.1 identity vectors

This section supplies Approved v1.1 identity conformance evidence. `h'02'` is
the permanently assigned representation-profile code and PSCID-suite code for
the immutable v1.1 closure defined by Approved DIGEST-001 v0.2. The
construction is:

~~~ini
frame = VE-CBOR-1([
  bstr h'5645505343494431',
  bstr h'02',
  bstr h'02',
  bstr C
])

digest   = SHA-256(frame)
identity = h'02' || digest
~~~

The two validators independently derive `C`, construct and independently
decode the four-element frame, calculate SHA-256, and compare the exact frame,
digest, and 33-octet identity values below. Neither consumes the other
validator's output.

| Anchor | Canonical input | `C` octets | Frame octets | SHA-256 digest | `h'02'` identity |
|---|---|---:|---:|---|---|
| A | V1.1-A | 151 | 167 | `038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f` | `02038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f` |
| C | V1.1-C | 94 | 110 | `1f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d` | `021f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d` |
| D | V1.1-D | 263 | 280 | `0d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc` | `020d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc` |

Anchor A pins frame `P_A` exactly as:

~~~text
84485645505343494431410241025897a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
~~~

Anchor C pins frame `P_C` exactly as:

~~~text
8448564550534349443141024102585ea26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
~~~

Anchor D pins a 263-octet `C_D`; its exact frame begins
`8448564550534349443141024102590107` and is code-bound in each independent
validator. The `h'59 0107'` byte string is the required definite-length CBOR
transition for 263 unchanged `C_D` octets.

Anchor C proves the cross-suite boundary:

~~~text
C_V1-A == C_V1.1-C
PSCID-1(C_V1-A) != v1.1_identity_C
~~~

For the equal canonical input in Anchor C, both validators also independently
derive the retained PSCID-1 identity:

~~~text
PSCID-1(C_V1-A) = 01634b3118ec88e36cf5eab44b86092e88f309fe918a99db460222fbd76946b80a
~~~

The validators use a fixed suite-aware verifier for the retained `h'01'`
PSCID-1 construction and the permanently assigned `h'02'` v1.1 construction.
They introduce no runtime suite registry. They prove each required confusion
failure exactly:

| Case | Attack and verification path | Required result |
|---|---|---|
| N1 — suite relabel | Relabel `h'02' || v1.1_digest_C` as `h'01' || v1.1_digest_C`, then dispatch on carried `h'01'`. | The known retained PSCID-1 path derives the historical `h'01'` identity above and returns `identity-mismatch`. |
| N2 — profile relabel | Construct `h'02' || SHA-256(frame(h'02', h'01', C))`, then dispatch on carried `h'02'`. | The `h'02'` suite requires profile `h'02'` and returns `identity-mismatch`. |
| N3 — downgrade reinterpretation | Pass v1.1 Anchor C and `C` to explicit PSCID-1 (`h'01'`) verification. | The PSCID-1 construction derives the retained historical identity and returns `identity-mismatch`. |
| N4 — unknown suite | Relabel v1.1 Anchor C with carried suite `h'03'`, then dispatch. | No assigned suite definition exists for `h'03'`; verification fails closed with `unknown-suite`. |
| N5 — frame-field substitution | Change only the `h'02'` frame profile from `h'02'` to `h'01'`; retain the original v1.1 Anchor C identity. | The supplied frame hashes differently from the unchanged identity digest and returns `identity-mismatch`. |

Thus N1 is a rejection by a **known** historical PSCID-1 verification path;
N4 is the separate unknown-suite failure. N5 does not recompute a new identity
for the substituted frame.

## Identity and adoption boundary

These Approved vectors establish canonical and identity conformance evidence
for the permanently assigned v1.1 profile and suite. They do not define a
generic PSCID-next value or predicate-identity abstraction. Historical v1.0
vectors and PSCID-1 remain unchanged.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.1 | 2026-08-30 | Approved the v1.1 package and its permanent `h'02'` profile/suite frame, digest, identity, parsing, and confusion anchors under DIGEST-001 v0.2; PSCID-1 unchanged. |
| 1.1 | 2026-08-30 | Initial Draft vectors for optional subject_domain, source-reference convergence, the fourth subject-constraint member, and exact v1.0 replay. |
