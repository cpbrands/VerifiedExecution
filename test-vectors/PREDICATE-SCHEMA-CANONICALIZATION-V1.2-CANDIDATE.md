---
id: PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE
title: Predicate Schema Canonicalization v1.2 Candidate Vectors
version: "0.1"
status: Draft
document_type: Conformance Vectors
category: Conformance
author: Verified Execution Editorial Board
created: 2026-09-01
updated: 2026-09-01
depends_on:
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - ADR-ENC-001
related_documents:
  - RS-QTY-001
  - GAP-ANALYSIS-RS-QTY-001
  - RFC-010
  - ADR-010
  - PREDICATE-SCHEMA-CANONICALIZATION-V1.1
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - SECURITY-REVIEW-PSCID-V1.2-CANDIDATE
supersedes: null
superseded_by: null
---

# Predicate Schema Canonicalization v1.2 Candidate Vectors

## Status and authority boundary

These vectors are Draft candidate evidence for Draft Predicate Schema
Semantic Contract v1.2 and Draft Canonical Representation Profile v1.2. They
do not approve either specification, allocate a representation-profile or
PSCID suite code, amend DIGEST-001, or reinterpret Approved v1.1 bytes.

The candidate shape under test is exactly:

```text
ValueSemantics {
  value: FieldForm
  comparison?: {
    domain: FieldForm
    ordered: boolean
  }
}
```

Presence of `comparison` supplies equality capability. `ordered: true` also
supplies ordered-comparison capability only for a top-level Integer value form.
The comparison tuple uses the normalized comparison-relevant value form, the
normalized domain FieldForm, and `ordered`. This is a fixed specification rule,
not a projection object, transform language, reference, or second grammar.

## Common fixtures

All accepted schemas use this issuer domain:

```text
issuer_domain = {
  identifier: { form: text }
  equality: canonical
}
```

The structurally disambiguated CAD descriptor is:

```text
domain = {
  form: record
  fields: {
    code: {
      presence: required
      grammar: { form: text, allowed_values: ["CAD"] }
    }
    meaning: {
      presence: required
      grammar: { form: text, allowed_values: ["Canadian dollars"] }
    }
  }
}
```

The text `CAD` alone is not treated as sufficient portable meaning. The full
normalized structure distinguishes Canadian dollars from Customer Account
Debit even though both use `CAD`. These vectors do not assert a VE-wide
currency ontology, registry identity, external truth, or authority.

## Accepted canonicalization vectors

| Vector | Source distinction | Required result |
|---|---|---|
| A1 | Integer value, equality-only `status-code` domain, `ordered: false` | Valid; comparison permits equality only. |
| A2 | Integer coefficient, scale 2, bounds 0..100,000,000, CAD domain, `ordered: true` | Valid; ordered CAD comparison semantics. |
| A3 | Same comparison semantics as A2, bounds 0..10,000,000 | Valid; full canonical schema bytes differ from A2, but normalized comparison tuples are identical. |
| A4 | Integer value, `unordered-integer` domain, `ordered: false` | Valid; ordered relations remain unsupported. |
| A5 | Approved v1.1 minimal Boolean schema with no `comparison` | Valid; exact canonical-byte replay of Approved v1.1 V1.1-C / v1.0 V1-A. |
| A6 | Text value with `ordered: false` | Valid equality-only non-Integer comparison semantics. |

The two independent validators derive these exact canonical-byte diagnostics:

| Vector | Byte length | SHA-256(C), non-identity diagnostic |
|---|---:|---|
| A1 | 214 | `fb614c74738b12459e4704ab24dfe37301d03d1998f1e9df814382fb78179adf` |
| A2 | 358 | `fe3f20b10be766caad7578903a988f45ca43b2cbac45c0500aad3b59ffd06d71` |
| A3 | 358 | `e45f5ac64d78e43124a5b309a81987b81fe4265bb2650acd398955e0ebc12ce3` |
| A4 | 220 | `06374be1dde652ba25c939cc03ff59add1cde4fce2141097b62c124689758d24` |
| A5 | 94 | `95995a2460209edd02218538f85c1863d51ca8b46a456acfa8f734650c55779b` |
| A6 | 211 | `a3dd539677bb78ee4f43d2d1a2ad33de3cfa0143b588f304bd3f6e7e1975d59a` |

These hashes are diagnostics only. They are not Predicate Schema identities,
profile assignments, suite assignments, or proposed PSCIDs. The validators
also emit and compare the complete lower-case canonical hexadecimal bytes.

## Critical v1.1 no-op replay

A5 canonical bytes are exactly:

```text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
```

This is byte-for-byte Approved v1.1 V1.1-C and Approved v1.0 V1-A. The two
validators also directly replay Approved V1.1-A through V1.1-E, including
inline/reference convergence and subject-constraint ordering. Every fixture
retains its exact Approved bytes. The Draft v1.2 profile adds no empty/default
member when `comparison` is absent.

This replay does not assert PSCID equality under a future suite. It proves only
canonical-byte preservation.

## Q5 comparison-tuple convergence

A2 and A3 have different full canonical Predicate Schema bytes because their
upper bounds differ. Each Claim value still validates under its own full
FieldForm.

The fixed comparison-relevant classification ignores those bounds while
retaining Integer form and scale. A2 and A3 therefore produce identical
normalized comparison tuples:

```text
form    = { form: integer, scale: 2 }
domain  = normalized CAD descriptor FieldForm
ordered = true
```

This proves the accepted Q5 distinction without making whole Predicate Schemas
or whole `value_semantics` equal.

## Rejected vectors

| Vector | Candidate input/use | Required failure |
|---|---|---|
| R1 | Unknown member inside `comparison` | Closed-map admission failure. |
| R2 | `ordered: "yes"` | Unsupported capability value. |
| R3 | Domain RecordForm with no fields | Malformed semantic-domain structure. |
| R4 | `comparison_ref` beside `value` | Unknown/ambiguous comparison material; no reference form exists. |
| R5 | `comparison` at Predicate Schema top level | Misplaced semantic material. |
| R6 | `comparison.domain_id = "CAD"` | Opaque identifier/ref form rejected. |
| R7 | Ordered relation invoked for an Integer schema with no `comparison` | `NOT COMPARABLE`; Integer does not imply ordering. |
| R8 | `comparison.normalization = "rescale"` | Unknown normalization and silent-rescaling attempt rejected. |
| R9 | Boolean plus `ordered: true` | Ordered non-Integer form rejected at admission. |
| R10 | Text plus `ordered: true` | Ordered non-Integer form rejected at admission. |
| R11 | Bytes plus `ordered: true` | Ordered non-Integer form rejected at admission. |
| R12 | Record plus `ordered: true` | Ordered composite form rejected at admission. |
| R13 | Sequence plus `ordered: true` | Ordered composite form rejected at admission. |

Every rejection is fail closed. No rejected form is retained as opaque
metadata, looked up, interpreted by custom code, or normalized partially.

## RS-QTY-001 integration replay

| Case | Candidate result |
|---|---|
| Q1 | A2/A3 tuple match; 4,875,000 <= 5,000,000 is true. |
| Q2 | A2/A3 tuple match; 5,000,100 <= 5,000,000 is false. |
| Q3 | CAD and USD descriptor structures differ: `NOT COMPARABLE`. |
| Q4 | CAD and unrelated descriptor structures differ: `NOT COMPARABLE`. |
| Q5 | A2/A3 remain comparable despite different bounds. |
| Q6 | Scale 2 and scale 0 comparison-relevant forms differ: `NOT COMPARABLE`; no rescaling. |
| Q7 | `ordered: false` or absent `comparison` does not support an ordered relation. |
| Q8 | Matching comparison tuples establish semantics only; trust and eligibility remain external gates. |
| Q9 | An ordinary verified target-domain Claim compares normally after external conversion. |

Q8 has no trust Boolean in Predicate Schema canonical content. Q9 has no
conversion object or operation. The vectors deliberately test those boundaries
rather than encoding authority or conversion into comparison semantics.

The validators also compare two ordered Integer schemas whose domain structures
both contain `code = "CAD"` but whose `meaning` vocabularies are respectively
`"Canadian dollars"` and `"Customer Account Debit"`. Their normalized domains
differ, so the result is `NOT COMPARABLE`. Publisher identity is not included.

## Independent validators

The Node.js validator and Python validator implement separate parsers,
normalizers, internal comparison-relevant-form helpers, deterministic CBOR encoders, accepted and
rejected cases, Q1–Q9 assertions, and the v1.1 replay:

- `validate-predicate-schema-canonicalization-v1.2-candidate.mjs`
- `validate-predicate-schema-canonicalization-v1.2-candidate.py`

Both MUST emit identical A1–A6 lengths, diagnostic hashes, complete canonical
hexadecimal bytes, and final counts:

```text
PASS accepted=6 rejected=13 q=9 legacy=5
```

## Draft PSCID v1.2 candidate evidence

A fresh 2026-09-01 audit of authoritative `origin/main` and all reachable refs
found `h'03'` to be the smallest unused and unreserved value in both PSCID-local
tables. The validators therefore use `representation_profile = h'03'` and
`suite = h'03'` solely as provisional candidate test values.

**Provisional candidate code does not mean permanent assignment or
reservation.** Approved code handling continues to treat the values as unknown
until a future coordinated approval assigns them.

The candidate profile is limited exactly to:

- Predicate Schema Semantic Contract v1.2 Draft;
- Predicate Schema Canonical Representation Profile v1.2 Draft;
- Predicate Schema Field-Semantic Representation Grammar v1.0 Approved; and
- ADR-ENC-001 / VE-CBOR-1 v0.1 Accepted.

Claim Reference, VE-002, RFC-010, ADR-010, DIGEST-001 itself, these vectors and
validators, and the security review are not part of the byte-producing closure.

The candidate construction is:

```ini
frame = VE-CBOR-1([
  bstr h'5645505343494431',
  bstr h'03',
  bstr h'03',
  bstr C
])
digest   = SHA-256(frame)
identity = h'03' || digest
```

### Candidate identity anchors

The source definitions of A, B, and C are A2, A6, and A5 above. Anchor D adds
a nested Record value with required scale-2 bounded Integer `amount` and an
optional unordered-unique Text Sequence `tags`; its structural comparison
domain is a Record descriptor containing `PAYMENT` and `settlement record`.
This exercises Record/Sequence normalization and comparison-map ordering.

Both implementations independently normalize each exact source, derive exact
canonical `C`, construct the exact four-element frame, hash it, and compare the
result with these fixed anchors:

| Anchor | Coverage | `C` octets | Frame octets | SHA-256(frame) | Final candidate identity |
|---|---|---:|---:|---|---|
| A | Ordered Integer, structural CAD domain | 358 | 375 | `2ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010` | `032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010` |
| B | Equality-only Text comparison | 211 | 227 | `6c1653e4a2d10b5bb1de6e070406888510cd805633fbcf2ebeb6a7e07d89fa0b` | `036c1653e4a2d10b5bb1de6e070406888510cd805633fbcf2ebeb6a7e07d89fa0b` |
| C | Legacy Boolean schema | 94 | 110 | `cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2` | `03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2` |
| D | Nested Record/Sequence | 562 | 579 | `aa9513dc1e22b93ba4166cd8846e7fc687afd3a81474ae8201395500c541ba17` | `03aa9513dc1e22b93ba4166cd8846e7fc687afd3a81474ae8201395500c541ba17` |

The complete canonical `C` bytes are emitted above for A–C and independently
derived for D by both validators. In every case, the frame bytes are the unique
VE-CBOR-1 encoding of the displayed four-element construction; the fixed frame
length and SHA-256 anchor make any byte change fail validation.

### Same-C cross-profile proof

Anchor C is byte-for-byte identical to Approved v1.1 V1.1-C:

```text
C_v1.1 == C_v1.2
h'02' identity = 021f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d
h'03' candidate identity = 03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2
```

The identities differ solely because the suite/profile bytes in the frame
differ. PSCID equality remains exact 33-octet equality. There is no cross-suite
equivalence.

### Candidate negative cases

| Case | Mutation | Required result |
|---|---|---|
| N1 | Relabel candidate identity externally as `h'02'` | `identity-mismatch` |
| N2 | Candidate suite with representation profile `h'02'` | `identity-mismatch` |
| N3 | Verify candidate identity through permanent `h'02'` suite | `identity-mismatch` |
| N4 | Carry unknown suite `h'04'` | `unknown-suite` |
| N5 | Check candidate identity against substituted frame/C | `identity-mismatch` |
| N6 | Check historical `h'02'` identity under candidate suite | `identity-mismatch` |
| N7 | Change comparison domain from structural CAD semantics to structural USD semantics without changing identity | `identity-mismatch` |
| N8 | Delete comparison semantics without changing identity | `identity-mismatch` |
| N9 | Change a predicate-local upper bound without changing identity | `identity-mismatch` |

The validators separately change `comparison.ordered` from `true` to `false`
under Anchor A and require `identity-mismatch`. Together N7, that ordered-flag
check, N8, and N9 prove that comparison domain, ordering capability, comparison
presence, and predicate-local bounds each affect full canonical Predicate
Schema `C`.

N9 is deliberately not a comparison-incompatibility test. A2 and A3 retain
identical comparison tuples and remain comparison-compatible even though their
different upper bounds produce different full canonical Predicate Schema bytes
and therefore different content identities:

```text
comparison compatibility projection != Predicate Schema content identity
```

The same independent paths replay PSCID-1 Anchor C and permanent `h'02'`
Anchors A/C/D exactly. Historical vectors and Approved v1.1 canonicalization
are not rewritten.

## Governance consequence

The Draft v1.2 profile changes closed admission and can emit new canonical
content when `comparison` is present. Eventual adoption therefore requires a
new immutable representation-profile binding and a new PSCID suite under
Accepted RFC-008/ADR-008, with security review and permanent vectors. The
provisional `h'03'/h'03'` test values are selected only because the fresh audit
found them available; they are not allocated, reserved, or authoritative.

Approved v1.1 profile `h'02'`, suite `h'02'`, and PSCID-1 remain unchanged.
No successor code is permanently selected. In particular, `h'03'` remains
unallocated and unreserved outside this Draft candidate.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-01 | Added provisional `h'03'/h'03'` candidate anchors A–D, same-C cross-profile proof, historical PSCID replay, N1–N9, and the ordered-flag binding check without allocation. |
| 0.1 | 2026-09-01 | Initial Draft candidate vectors for optional structural comparison semantics, Q1–Q9 integration, rejection behavior, and exact v1.1 canonical-byte replay. |
