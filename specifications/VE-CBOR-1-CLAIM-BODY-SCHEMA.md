---
id: VE-CBOR-1-CLAIM-BODY-SCHEMA
title: VE-CBOR-1 Claim Body Schema
version: "0.2"
status: Draft
document_type: Candidate Specification
category: Representation
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-09-11
depends_on:
  - ADR-ENC-001
  - ADR-VERIFY-002
  - VE-001
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - VE-002
  - VE-CLAIM-REFERENCE-SEMANTICS
  - CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
related_documents:
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - RFC-005
supersedes: null
superseded_by: null
---

# VE-CBOR-1 Claim Body Schema

## Status and authority boundary

This Draft v0.2 is a bounded representation specification for existing Claim
semantics. It defines portable canonical bytes only for Claims whose governing
Predicate Schema is valid under an Approved Predicate canonical representation
profile supported by Approved DIGEST-001 v0.4 and whose runtime fields fit the
closed FieldForm subset below.

It does not change Claim, Predicate, Action, Event, verification, trust, or
Rule/Evaluate semantics. It creates no Claim identifier, Claim digest, generic
reference, registry, resolver, or new VE primitive. The Claim envelope remains:

```text
Claim {
  body,
  verification {
    profile,
    artifact
  }
}
```

This specification concerns `body` only. Verification data is neither encoded
in nor made visible through the body.

## 1. Governing closure and applicability

The imported representation closure is:

| Imported value | Governing representation |
|---|---|
| `action_id` | `VE001ActionIdValue`: exactly one canonical CBOR `bstr(32)` under the Draft VE-001 Action canonical-representation profile. |
| `action_digest` | `VE001ActionDigestValue`: exactly one canonical CBOR `bstr(32)` under that profile. |
| `event_id` | exactly one canonical CBOR `bstr(32)` under Approved VE-002 v0.2. |
| `predicate` | the exact 33 identity octets defined by Approved DIGEST-001 v0.4, encoded directly as one canonical CBOR `bstr(33)`. |
| issuer, external-subject, and asserted values | runtime values admitted by the applicable normalized Predicate Schema `FieldForm`, represented as specified in Section 4. |

This Draft supports the immutable Predicate representation/PSCID suite pairs
defined by DIGEST-001 v0.4: `h'01'/h'01'`, `h'02'/h'02'`, and
`h'03'/h'03'`. For the current v1.2 closure, the pair is exactly
`h'03'/h'03'`; canonical Integer-node keys are `minimum` and `maximum`.
Conceptual grammar names `lower_bound` and `upper_bound` are not serialized
keys. This Draft does not define a second PSCID construction or reinterpret an
identity from another suite.

An encoder or decoder MUST be given the retained normalized Predicate Schema
and canonical schema bytes that correspond to `predicate`. It MUST validate
the schema through the profile selected by the carried PSCID suite, recompute
the PSCID under DIGEST-001 v0.4, and require exact 33-octet equality. Missing,
unknown, unsupported, mismatched, or unavailable governing schema material
makes this Claim-body profile inapplicable. There is no encoded Claim-body
version member, discovery algorithm, latest-version rule, registry lookup, or
fallback. Governing context explicitly invokes Draft v0.2.

## 2. Exact Claim-body structure

A supported Claim body is exactly this closed map:

```text
ClaimBodyV02 := {
  "subject_reference": SubjectReferenceV02,
  "issuer_ref": IssuerRefValue,
  "predicate": PredicateSchemaContentIdentity,
  "value": ClaimValue
}
```

All four members are required. No other top-level member is permitted. In
VE-CBOR-1 deterministic encoded-key order they are emitted as:

```text
"value"
"predicate"
"issuer_ref"
"subject_reference"
```

The semantic Claim fields `assertion_time` and `observation_time` remain
abstractly optional. Every Predicate canonical profile currently supported by
this Draft admits only absent `time_semantics`, which means both fields are
forbidden. Their presence with any value, including CBOR `null`, is invalid.
This is a bounded profile rule, not a claim that future Claims can never carry
time.

## 3. Closed subject-reference representation

`SubjectReferenceV02` is one of four closed, structurally discriminated arrays:

```text
ActionContentReference := [
  "ActionContentReference",
  VE001ActionDigestValue
]

ActionOccurrenceReference := [
  "ActionOccurrenceReference",
  VE001ActionIdValue,
  VE001ActionDigestValue
]

EventReference := [
  "EventReference",
  EventIdValue
]

ExternalSubjectReference := [
  "ExternalSubjectReference",
  ExternalIdentifierValue
]
```

The first array member is representation-only union discrimination. It is not
a new semantic `reference_kind` Claim field. The four tag strings, array
lengths, member order, and member types are exact. Unknown tags, missing or
extra members, a payload from another arm, and a non-array representation are
invalid.

The applicable Predicate Schema MUST permit the selected form through
`subject_constraints`, or impose no restriction beyond the closed union.
`ExternalSubjectReference` additionally requires a present `subject_domain`;
its identifier is represented and validated using
`subject_domain.identifier`. That domain does not reinterpret Action or Event
references. No equality is inferred across union arms or identifier kinds.

## 4. FieldForm runtime representation

`IssuerRefValue` is the normalized runtime value admitted by
`issuer_domain.identifier`. `ClaimValue` is the normalized runtime value
admitted by `value_semantics.value`. `ExternalIdentifierValue` is the
normalized runtime value admitted by `subject_domain.identifier`.

The applicable normalized Predicate Schema selects the form. Runtime values do
not carry a FieldForm wrapper. The complete mapping is:

| FieldForm | Runtime representation and validation |
|---|---|
| `boolean` | one CBOR Boolean; apply any `allowed_values` restriction. |
| `integer` | one mathematical CBOR integer; enforce `minimum`, `maximum`, inclusion, scale semantics, and any `allowed_values` against the coefficient. No float or conversion is permitted. |
| `text` | one valid UTF-8/NFC CBOR text string; non-NFC input is rejected, not normalized; apply any `allowed_values`. |
| `bytes` | one CBOR byte string; apply any `allowed_values`. |
| `record` | one closed CBOR map whose keys are the exact NFC field names. Every required field is present, optional fields may be absent, unknown or duplicate fields are rejected, and each value is recursively represented by its field grammar. |
| `sequence` | one CBOR array whose members recursively satisfy `element`; enforce cardinality and uniqueness. If `ordering_significant` is false, normalize by ascending bytewise order of each member's canonical VE-CBOR-1 bytes while preserving multiplicity when allowed. |

For a sequence with `ordering_significant: true`, input order is semantic and
is preserved. With `ordering_significant: false`, canonical-member sorting is
required. Duplicate normalized members are invalid when `uniqueness: true`.
The profile applies no normalization other than the behavior already defined
by the Approved Field-Semantic Grammar and Predicate canonical profile.

Issuer equality, external-subject equality, and value equality remain owned by
the Predicate Schema. For the supported closure their mechanical comparison is
exact canonical-representation equality after governed validation and
normalization. Equal-looking issuer values under different Predicate Schemas
are not thereby the same semantic issuer.

## 5. Absence, null, and defaults

The policy is closed:

- the four Claim-body members are required and MUST NOT be `null`;
- `assertion_time` and `observation_time` are absent and forbidden;
- an optional record field is represented only by omission;
- omission is distinct from a present value;
- CBOR `null` never represents omission;
- the current bounded FieldForm grammar has no portable null-like runtime
  form, so `null` anywhere in an issuer, external identifier, or value is
  invalid; and
- no Claim-body or runtime-value default is inserted.

Schema normalization such as omitted `scale` for semantic zero and omitted
`min_items` for zero is Predicate Schema normalization, not a Claim-body
runtime default.

## 6. VE-CBOR-1 canonical bytes

After schema selection, validation, and the Section 4 normalization:

```text
claim_body_canonical_bytes = VE-CBOR-1(ClaimBodyV02)
```

The encoder and decoder MUST apply RFC 8949 Core Deterministic Encoding,
definite lengths, shortest integer and length encodings, text-string map keys,
encoded-key ordering, valid UTF-8/NFC text, duplicate-key rejection, no
floating point, and no CBOR semantic tags. A decoder MUST consume exactly one
complete item, re-encode the decoded and schema-validated value, and require
byte-for-byte equality with the input. It MUST NOT accept and silently
canonicalize a noncanonical byte sequence.

Unknown members are rejected at every closed map: the Claim body, every
runtime record, and every governed schema structure used for validation.
Trailing bytes and an ambiguous or invalid subject-union arm are rejected.

## 7. Verification and Rule/Evaluate boundaries

These bytes may be supplied as the canonical Claim body to an applicable
verification profile. This specification does not encode or interpret
`verification.profile`, `verification.artifact`, a signer, a key, a trust
decision, or verification success. An identical body can be carried by
different verification envelopes without changing its canonical bytes.

Decoding produces the same semantic Claim-body fields consumed by the Draft
VE-CEL-1 Rule/Evaluate input contract. The union array is converted back to
the corresponding existing semantic subject-reference form; it is not exposed
as a new semantic field. This Draft does not select CEL types, Claim collection
ordering, or a Claim digest. It supplies the previously missing portable body
bytes while leaving engine-specific binding work separate.

## 8. Positive conformance vectors

The vectors use deterministic test-only 32-octet identities. `A32` is
`000102...1f`, `D32` is `202122...3f`, and `E32` is `404142...5f`.
Predicate `P03-C` is Approved v1.2 Anchor C:

```text
03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2
```

Its issuer form is text and value form is Boolean. Predicate `P02-A` is
Approved v1.1 Anchor A:

```text
02038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f
```

It additionally supplies a text `subject_domain` and permits the external
form. Each displayed PSCID is the 33 raw identity octets, not hexadecimal
text. Predicate `P03-D` is Approved v1.2 Anchor D:

```text
03ef45cac153df5390b7916bab7b0fbd3264c569cb6ffb91b68b3e21cae4b3fd54
```

It has a closed record value with required scale-2 bounded Integer `amount`
and optional unordered-unique Text sequence `tags`.

| Vector | Semantic body | Expected canonical bytes (hex) |
|---|---|---|
| P1 | Action content; issuer `bank-A`; predicate `P03-C`; value `true`; digest `D32` | `a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e63658276416374696f6e436f6e74656e745265666572656e63655820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f` |
| P2 | Action occurrence; same issuer/predicate/value; id `A32`; digest `D32` | `a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e6365837819416374696f6e4f6363757272656e63655265666572656e63655820000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f5820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f` |
| P3 | Event; same issuer/predicate/value; event id `E32` | `a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e6365826e4576656e745265666572656e63655820404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f` |
| P4 | External subject `account-X`; issuer `bank-A`; predicate `P02-A`; value `true` | `a46576616c7565f569707265646963617465582102038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f6a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e636582781845787465726e616c5375626a6563745265666572656e6365696163636f756e742d58` |
| P5 | Action content; issuer `bank-A`; predicate `P03-D`; value `{ amount: 50000, tags: ["settled", "priority"] }`; digest `D32` | `a46576616c7565a264746167738267736574746c6564687072696f7269747966616d6f756e7419c35069707265646963617465582103ef45cac153df5390b7916bab7b0fbd3264c569cb6ffb91b68b3e21cae4b3fd546a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e63658276416374696f6e436f6e74656e745265666572656e63655820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f` |

P1 through P4 cover every union arm, direct imported identity embedding, the
two currently relevant PSCID closures, top-level key order, and verification-
envelope independence. P5 covers recursive Record, Integer, Sequence, Text,
optional-field, and order-insensitive sequence normalization.

## 9. Rejection vectors

Each rejection is evaluated against otherwise valid P1 unless stated:

| Vector | Mutation | Required result |
|---|---|---|
| R1 | omit any one required top-level member | reject |
| R2 | add an unknown top-level member | reject |
| R3 | encode a required member as `null` | reject |
| R4 | add `assertion_time` or `observation_time`, including as `null` | reject |
| R5 | unknown subject tag, wrong array length, payload shape inconsistent with the selected arm, or trailing union member | reject |
| R6 | use `bstr(31)`, `bstr(33)`, text, tag, or indefinite bytes for an Action/Event 32-octet value | reject |
| R7 | use a non-33-octet predicate, unknown suite, suite/profile mismatch, or PSCID not matching retained schema bytes | reject |
| R8 | use ExternalSubjectReference without a permitted form and resolved `subject_domain` | reject |
| R9 | make issuer, external identifier, or value disagree with its FieldForm | reject |
| R10 | use non-NFC text | reject without normalization |
| R11 | omit a required nested record member or add an unknown nested member | reject |
| R12 | violate sequence cardinality or uniqueness, or supply noncanonical raw member order for an order-insensitive sequence to a decoder | reject |
| R13 | violate Integer bounds or an `allowed_values` restriction | reject |
| R14 | duplicate any map key, use noncanonical map order, non-shortest encoding, indefinite length, float, or semantic tag | reject |
| R15 | append bytes after the complete Claim body | reject |
| R16 | supply a verification envelope member inside `body` | reject |

No rejection creates an alias, fallback profile, open extension, or
normalization registry.

## 10. Cross-boundary conformance checks

An implementation test suite MUST additionally establish:

1. **Round trip:** each P vector decodes, schema-validates, re-encodes, and
   reproduces identical bytes.
2. **Rule/Evaluate compatibility:** decoding exposes exactly the four semantic
   body fields and never exposes verification data.
3. **Issuer distinction:** two otherwise identical bank-balance-like Claims
   with different `issuer_ref` values produce different bytes; equal-looking
   issuer values under different predicates are not asserted equal across
   issuer domains.
4. **Future occurrence compatibility:** P2 remains a valid ordinary
   `ActionOccurrenceReference`; it introduces no attempt or lifecycle
   reference.
5. **Envelope independence:** changing or removing the external verification
   envelope does not change body bytes.

## 11. Security considerations

Closed maps, exact union discrimination, canonical imported identities, and
schema-driven runtime forms prevent type confusion, unknown-field smuggling,
silent normalization, and alternative byte representations. PSCID verification
prevents applying an unrelated schema merely because a local label looks
similar.

Canonical representation is not authenticity, authority, trust, truth,
applicability to a Rule, execution authorization, or evidence of an outcome.
Those gates remain outside `Claim.body`.

## 12. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The representation is deterministic and keeps assertion, verification, authority, and execution separate. |
| New primitive burden | Pass. It represents the existing Claim body and closed subject union without adding an object or identity kind. |
| Removability | Pass. The profile is a replaceable representation layer; removing it removes portability, not Claim semantics. |
| Twenty-year durability | Pass at Draft scope. Explicit versions, closed forms, exact bytes, and immutable imported suites remain interpretable without registries. |
| Independent implementability | Pass. The full structure, mappings, canonical rules, and rejection behavior are specified and vector-bound. |
| Total conceptual complexity | Pass. Existing FieldForm, VE-CBOR-1, PSCID, Action, Event, and Claim-reference owners are reused directly. |

**Verdict: A. BOUNDED PORTABLE CLAIM-BODY REPRESENTATION COMPLETE AT DRAFT v0.2 SCOPE.**

## 13. Governance and remaining work

This Draft revision stays within representation scope already delegated to this
artifact. It does not revise an Approved specification or require an RFC, ADR,
new VE identifier, registry, or primitive.

Draft v0.2 does not support Claim time fields, arbitrary Predicate semantics,
unrecognized PSCID suites, verification profiles, trust, or engine-specific
CEL conversion. Supporting any of those requires its own governed work. This
Draft does not resume or resolve generic proposals in RFC-005.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-09-11 | Completed the bounded portable Claim-body map, four-arm subject-reference representation, imported Action/Event/PSCID forms, schema-driven issuer/value/external mappings, closed rejection behavior, and portable conformance vectors; time remains forbidden in the supported Predicate closure. |
| 0.1 | 2026-08-27 | Initial Draft candidate; separated VE-CBOR mechanics from then-unresolved Claim semantic/profile representations. |
