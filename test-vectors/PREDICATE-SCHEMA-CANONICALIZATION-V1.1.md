---
id: PREDICATE-SCHEMA-CANONICALIZATION-V1.1
title: Predicate Schema Canonicalization v1.1 Draft Vectors
version: "1.1"
status: Draft
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
related_documents:
  - PREDICATE-SCHEMA-CANONICALIZATION-V1
  - VE-CLAIM-REFERENCE-SEMANTICS
  - RFC-007
  - ADR-007
supersedes: null
superseded_by: null
---

# Predicate Schema Canonicalization v1.1 Draft Vectors

## Status and scope

This Draft package tests only the v1.1 candidate additions: optional
subject_domain, source-level subject_domain_ref expansion, and
ExternalSubjectReference in subject_constraints. Approved v1.0 and its vector
package remain authoritative and unchanged.

The vectors test canonical Predicate Schema bytes C. C is not a PSCID, does not
allocate a v1.1 representation_profile code or PSCID suite, and does not define
Claim-body wire encoding. CAD/unit semantics remain outside this bounded
portable subset.

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

## Identity and adoption boundary

These Draft vectors establish candidate canonical bytes only. They do not
allocate a v1.1 representation-profile code, PSCID suite, PSCID-next value, or
predicate identity. Historical v1.0 vectors and PSCID-1 remain unchanged.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.1 | 2026-08-30 | Draft vectors for optional subject_domain, source-reference convergence, the fourth subject-constraint member, and exact v1.0 replay. |
