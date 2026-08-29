---
id: PREDICATE-SCHEMA-CANONICALIZATION-V1
title: Predicate Schema Canonicalization v1.0 Conformance Vectors
version: "1.0"
status: Approved
document_type: Conformance Vector
category: Conformance
author: Verified Execution Editorial Board
created: 2026-08-28
updated: 2026-08-28
depends_on:
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - ADR-ENC-001
related_documents:
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - VE-CLAIM-REFERENCE-SEMANTICS
supersedes: null
superseded_by: null
---

# Predicate Schema Canonicalization v1.0 Conformance Vectors

## 1. Status and scope

This Approved v1.0 artifact is normative conformance evidence for the complete
machine-affecting canonicalization closure:

```text
Predicate Schema Canonical Representation Profile v1.0
    -> Predicate Schema Field-Semantic Representation Grammar v1.0
    -> Predicate Schema Semantic Contract v1.0

Profile v1.0 and Grammar v1.0
    -> ADR-ENC-001 v0.1 (VE-CBOR-1)
```

It tests canonical Predicate Schema bytes `C` and the runtime sequence-value
canonicalization that Profile v1.0 Section 8 derives from a profile-valid
FieldForm. It does not define a digest suite, PSCID framing, a
`representation_profile` code, Claim-body portability, Event instance
semantics, runtime reference infrastructure, verification, trust,
authorization, or any new VE primitive.

An accepted vector is profile-valid only when its semantic input normalizes to
the stated canonical structure and exactly the stated canonical VE-CBOR-1 byte
string. A rejected vector MUST fail for the identified rule; it MUST NOT be
coerced, partly normalized, or encoded under v1.0.

## 2. Notation and canonicalization procedure

All accepted vectors use this common profile-valid issuer-domain semantic input:

```text
I = {
  "issuer_domain": {
    "identifier": { "form": "text" },
    "equality": "canonical"
  }
}
```

For a listed value form `V` and optional closed subject subset `S`, the
normalized semantic representation and canonical structural representation are
respectively:

```text
Normalized(I, V) = {
  "issuer_domain": I.issuer_domain,
  "value_semantics": { "value": V }
}

Normalized(I, V, S) = {
  "issuer_domain": I.issuer_domain,
  "value_semantics": { "value": V },
  "subject_constraints": S
}
```

The displayed normalized map is also the canonical structural representation:
all maps are closed; text labels are UTF-8/NFC; and their emitted order is
VE-CBOR-1 deterministic encoded-key order. `C` is the lower-case hexadecimal
VE-CBOR-1 encoding of that normalized map.

The examples use JSON-like notation for semantic source and normalized content.
`h'...'` denotes a CBOR byte string. Source declaration order never contributes
to `C`.

## 3. Accepted canonical-byte vectors

### V1-A — Minimal Boolean schema

Semantic input:

```text
Normalized(I, { "form": "boolean" })
```

Normalized semantic representation and canonical structural representation:

```text
{
  "issuer_domain": {
    "identifier": { "form": "text" },
    "equality": "canonical"
  },
  "value_semantics": { "value": { "form": "boolean" } }
}
```

Canonical VE-CBOR-1 bytes `C`:

```text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
```

### V1-B — Dimensionless scaled Integer

Semantic input:

```text
Normalized(I, {
  "form": "integer",
  "scale": 2,
  "minimum": { "value": 0, "inclusive": true },
  "maximum": { "value": 1000, "inclusive": false }
})
```

Normalized semantic representation and canonical structural representation are
the map above: it has non-zero scale `2`, effective bounds `0..999`, and no
unit semantics. Its canonical `C` is:

```text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a464666f726d67696e7465676572657363616c6502676d6178696d756da26576616c75651903e869696e636c7573697665f4676d696e696d756da26576616c75650069696e636c7573697665f5
```

### V1-C — Record with required and optional fields

Semantic input, intentionally declaring fields in reverse source order:

```text
Normalized(I, {
  "form": "record",
  "fields": {
    "z": { "presence": "optional", "grammar": { "form": "text" } },
    "a": { "presence": "required", "grammar": { "form": "boolean" } }
  }
})
```

Normalized semantic representation and canonical structural representation sort
the `fields` map as `a`, then `z`; `C` is:

```text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a264666f726d667265636f7264666669656c6473a26161a2676772616d6d6172a164666f726d67626f6f6c65616e6870726573656e6365687265717569726564617aa2676772616d6d6172a164666f726d64746578746870726573656e6365686f7074696f6e616c
```

### V1-D — Sequence forms

Each vector below has `element = { "form": "boolean" }`. The shown map is
both the normalized semantic representation and canonical structural
representation.

| Vector | Value form | Canonical `C` |
|---|---|---|
| V1-D1 | `{ "form": "sequence", "element": { "form": "boolean" }, "ordering_significant": true, "uniqueness": false }` | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a464666f726d6873657175656e636567656c656d656e74a164666f726d67626f6f6c65616e6a756e697175656e657373f4746f72646572696e675f7369676e69666963616e74f5` |
| V1-D2 | `{ "form": "sequence", "element": { "form": "boolean" }, "ordering_significant": true, "uniqueness": true }` | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a464666f726d6873657175656e636567656c656d656e74a164666f726d67626f6f6c65616e6a756e697175656e657373f5746f72646572696e675f7369676e69666963616e74f5` |
| V1-D3 | `{ "form": "sequence", "element": { "form": "boolean" }, "ordering_significant": false, "uniqueness": true }` | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a464666f726d6873657175656e636567656c656d656e74a164666f726d67626f6f6c65616e6a756e697175656e657373f5746f72646572696e675f7369676e69666963616e74f4` |
| V1-D4 | `{ "form": "sequence", "element": { "form": "boolean" }, "ordering_significant": false, "uniqueness": false }` | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a464666f726d6873657175656e636567656c656d656e74a164666f726d67626f6f6c65616e6a756e697175656e657373f4746f72646572696e675f7369676e69666963616e74f4` |

### V1-E — Multiset semantics and source-order independence

V1-D4 is the normalized schema for an unordered non-unique sequence. Two source
schemas that declare its `form`, `element`, `ordering_significant`, and
`uniqueness` members in different source orders normalize to the same V1-D4
canonical structure and `C`.

For runtime values governed by that schema, source values `[true, false, true]`
and `[true, true, false]` normalize to the same ordered multiset
`[false, true, true]`, with runtime canonical VE-CBOR-1 bytes `83f4f5f5`.
Multiplicity is preserved. The Predicate Schema itself contains the V1-D4
canonical structure and `C`; it does not encode a runtime Claim value.

### V1-F — `scale: 0` normalizes to omission

The following two semantic inputs normalize to the same canonical structural
representation:

```text
{ "form": "integer", "minimum": { "value": 0, "inclusive": true } }
{ "form": "integer", "scale": 0, "minimum": { "value": 0, "inclusive": true } }
```

Their normalized form omits `scale`. With `Normalized(I, V)`, canonical `C` is:

```text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a264666f726d67696e7465676572676d696e696d756da26576616c75650069696e636c7573697665f5
```

### V1-G — `min_items: 0` normalizes to omission

The following two semantic inputs normalize to the V1-D4 canonical structural
representation:

```text
{ "form": "sequence", "element": { "form": "boolean" }, "ordering_significant": false, "uniqueness": false }
{ "form": "sequence", "element": { "form": "boolean" }, "ordering_significant": false, "uniqueness": false, "min_items": 0 }
```

Both yield V1-D4's `C`:

```text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a464666f726d6873657175656e636567656c656d656e74a164666f726d67626f6f6c65616e6a756e697175656e657373f4746f72646572696e675f7369676e69666963616e74f4
```

### V1-H — Inline/reference exact-normalization equivalence

The following sources both normalize to V1-A's structure and bytes:

```text
inline source:
  issuer_domain = { "identifier": { "form": "text" }, "equality": "canonical" }

reference source:
  issuer_domain_ref = R
  R resolves offline to exactly the inline issuer_domain fragment above
```

`R` is an acquisition reference only. It does not survive normalization; the
normalized semantic representation and canonical structural representation are
exactly V1-A, and the canonical `C` is V1-A's byte string.

### V1-I — Closed subject-constraint union

Semantic input, intentionally in noncanonical source order:

```text
Normalized(I, { "form": "boolean" }, [
  "EventReference",
  "ActionOccurrenceReference",
  "ActionContentReference"
])
```

The normalized semantic representation and canonical structural representation
sort the closed symbolic subset in VE-CBOR-1 encoded-text order:

```text
["EventReference", "ActionContentReference", "ActionOccurrenceReference"]
```

Canonical `C`:

```text
a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e7473836e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365
```

The source vector encodes only legal symbolic subject-form names. It does not
approve final Event instance or Event identifier portability.

### V1-J through V1-M — Remaining closed FieldForms

| Vector | Semantic input and normalized/canonical structure | Canonical `C` |
|---|---|---|
| V1-J | `Normalized(I, { "form": "text", "allowed_values": ["b", "aa"] })`; source `["aa", "b"]` normalizes to `["b", "aa"]`. | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a264666f726d64746578746e616c6c6f7765645f76616c756573826162626161` |
| V1-K | `Normalized(I, { "form": "bytes", "allowed_values": [h'00', h'0102'] })`; the shown sequence is its canonical structural order. | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a264666f726d6562797465736e616c6c6f7765645f76616c756573824100420102` |
| V1-L | `Normalized(I, { "form": "integer", "allowed_values": [2, 10] })`; reverse source order normalizes to `[2, 10]`. | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a264666f726d67696e74656765726e616c6c6f7765645f76616c75657382020a` |
| V1-M | `Normalized(I, { "form": "record", "fields": { "items": { "presence": "required", "grammar": { "form": "sequence", "element": { "form": "integer", "scale": 1 }, "ordering_significant": false, "uniqueness": false, "max_items": 3 } } } })`; this is a finite nested record/sequence tree. | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a264666f726d667265636f7264666669656c6473a1656974656d73a2676772616d6d6172a564666f726d6873657175656e636567656c656d656e74a264666f726d67696e7465676572657363616c6501696d61785f6974656d73036a756e697175656e657373f4746f72646572696e675f7369676e69666963616e74f46870726573656e6365687265717569726564` |

### V1-N — Explicit both-forbidden time normalization

The following otherwise identical source forms are both profile-valid:

```text
source A:
  time_semantics omitted

source B:
  time_semantics = {
    assertion_time: forbidden,
    observation_time: forbidden
  }
```

For both sources, the value semantics is the V1-A Boolean form and the
issuer-domain semantic input is `I`. Profile v1.0 Section 12 requires source B
to normalize by omitting `time_semantics`. Therefore both sources have exactly
this normalized semantic representation and canonical structural
representation:

```text
{
  "issuer_domain": {
    "identifier": { "form": "text" },
    "equality": "canonical"
  },
  "value_semantics": { "value": { "form": "boolean" } }
}
```

Both produce V1-A's canonical VE-CBOR-1 bytes:

```text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
```

```text
C_A == C_B
```

### V1-O — Ordered sequence source-order preservation

For V1-D1's `ordering_significant: true`, `uniqueness: false` FieldForm, let
`A = false` and `B = true`. Source order is semantic and is preserved:

```text
source [A, B] -> normalized [false, true] -> canonical bytes 82f4f5
source [B, A] -> normalized [true, false] -> canonical bytes 82f5f4

Normalized([A, B]) != Normalized([B, A])
Bytes([A, B]) != Bytes([B, A])
```

The canonicalizer MUST NOT sort either source array. The same order-preservation
rule applies to V1-D2's ordered/unique FieldForm after uniqueness validation:
`[false, true]` is accepted with bytes `82f4f5`; `[true, true]` fails
uniqueness validation before encoding.

### V1-P — Unordered-unique sequence source-order invariance

For V1-D3's `ordering_significant: false`, `uniqueness: true` FieldForm, let
`A = false` and `B = true`. Profile v1.0 Section 8 sorts by each normalized
member's canonical VE-CBOR-1 bytes (`f4 < f5`):

```text
source [A, B] -> normalized [false, true] -> canonical bytes 82f4f5
source [B, A] -> normalized [false, true] -> canonical bytes 82f4f5

Normalized([A, B]) == Normalized([B, A])
Bytes([A, B]) == Bytes([B, A])
```

The duplicate source `[true, true]` fails uniqueness validation before
encoding. This is distinct from V1-D4's unordered non-unique multiset, which
sorts while preserving multiplicity.

## 4. Rejected vectors

| Vector | Invalid semantic source condition | Required result and normative rule |
|---|---|---|
| R1 | Text issuer requires checksum validation. | Reject before encoding: unsupported issuer semantic rule; Profile v1.0 §9. |
| R2 | Issuer equality is case-insensitive. | Reject before encoding: only canonical equality is portable; Profile v1.0 §9. |
| R3 | Value semantics declares explicit unit `USD`. | Reject before encoding: unit-bearing semantics are outside the bounded subset; Profile v1.0 §10. |
| R4 | A numeric unit is implied but unstated. | Reject before encoding: absence means dimensionless, not unspecified unit; Profile v1.0 §10. |
| R5 | Present substantive `time_semantics`. | Reject before encoding: only absent time semantics are portable; Profile v1.0 §12. |
| R6 | Value equality is approximate or tolerance-based. | Reject before encoding: equality must be canonical-representation equality; Profile v1.0 §10. |
| R7 | Scalar `allowed_values: []`. | Reject before encoding: a present list is non-empty; Profile v1.0 §6. |
| R8 | Scalar `allowed_values: ["x", "x"]`. | Reject before encoding: duplicate normalized allowed values are invalid; Profile v1.0 §6. |
| R9 | Boolean `allowed_values: [true, "true"]`, or an Integer allowed value outside effective bounds. | Reject before encoding: every member must satisfy its scalar domain and constraints; Profile v1.0 §6. |
| R10 | Integer bounds `(1, 2)`. | Reject before encoding: effective bounds create an empty integer domain; Profile v1.0 §5.2. |
| R11 | Sequence `min_items: -1`. | Reject before encoding: cardinalities must be non-negative mathematical integers; Profile v1.0 §8. |
| R12 | Sequence `min_items: 6`, `max_items: 5`. | Reject before encoding: minimum cannot exceed maximum; Profile v1.0 §8. |
| R13 | FieldForm uses `form: "decimal"` or an extra grammar field. | Reject before encoding: form and every map are closed; Profile v1.0 §§5 and 14. |
| R14 | A semantic annotation or unknown metadata map affects interpretation. | Reject before encoding: no opaque semantic metadata channel exists; Profile v1.0 §14. |
| R15 | `value_semantics_ref` expands to explicit unit-bearing semantics. | Reject after expansion: referenced content undergoes the same exhaustive admission check; Profile v1.0 §3. |
| R16 | A field-specific reference graph is cyclic. | Reject: recursive dependencies must be finite and acyclic; Semantic Contract v1.0 §9 and Profile v1.0 §13. |
| R17 | A required field-specific reference cannot be resolved offline. | Reject: reference resolution fails closed; Semantic Contract v1.0 §8 and Profile v1.0 §3. |

## 5. Independent verification

The accepted `C` values were generated by two independently written,
deterministic CBOR encoding paths: one in Node.js and one in Python. Each path
implements RFC 8949 deterministic map-key ordering independently, applies the
v1.0 normalization cases above, and produced identical byte strings for all 18
numbered accepted vector cases. For V1-O and V1-P, each path additionally
verified both displayed source arrays and their required equality or inequality.
The two paths also produced the stated rejection outcome for every rejected
vector before CBOR encoding.

Any future conforming implementation MUST reproduce every accepted byte string
and every rejected result. A mismatch is non-conforming to the v1.0 closure.

## 6. Approval boundary

These vectors freeze canonical Predicate Schema byte derivation for the bounded
portable subset only. They do not approve any unrelated Draft, including
Claim-body portability generally, VE-002 Event semantics, runtime resolution
infrastructure, trust, verification, authorization, RFC-005, or DIGEST-001.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-08-28 | Initial Approved canonicalization vectors for the Predicate Schema v1.0 freeze closure. |
