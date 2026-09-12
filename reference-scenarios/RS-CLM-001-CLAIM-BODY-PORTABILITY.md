---
id: RS-CLM-001
title: Independent Claim Body Portability and Rule Input
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-11
updated: 2026-09-11
depends_on:
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - VE-CLAIM-REFERENCE-SEMANTICS
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - ADR-VERIFY-002
related_documents:
  - PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE
supersedes: null
superseded_by: null
---

# RS-CLM-001 — Independent Claim Body Portability and Rule Input

## 1. Authority and objective

This document is **non-normative evidence**. It pressure-tests the Draft v0.2
[VE-CBOR-1 Claim Body Schema](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md).
It does not modify Claim, Predicate, Action, verification, trust, or
Rule/Evaluate semantics. It defines no Predicate Schema, verification profile,
registry, identifier allocation, canonicalization system, or new primitive.

The question is whether two independent implementations can start with one
semantic Claim and the same governing schema, construct identical portable
Claim-body bytes, recover exactly the four semantic fields, and supply the
decoded body to the existing Rule/Evaluate boundary without exposing
verification material.

## 2. Existing concrete Predicate Schema

The scenario reuses Approved v1.2 Anchor C from the
[corrected Predicate Schema conformance vectors](../test-vectors/PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE.md#approved-identity-anchors).
It is the smallest existing concrete fixture that exercises the required
Claim-body fields:

- canonical Predicate Schema bytes: 94 octets;
- `issuer_domain.identifier`: canonical Text FieldForm;
- `value_semantics.value`: Boolean FieldForm;
- no `subject_constraints`, so every existing closed subject-reference arm is
  permitted; and
- no `time_semantics`, so `assertion_time` and `observation_time` are
  forbidden.

Its canonical bytes are the unchanged Approved v1.1/v1.2 Boolean-schema
anchor:

```text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
```

Approved DIGEST-001 v0.4 binds those bytes under permanent Predicate
representation-profile and PSCID suite `h'03'/h'03'`. The exact PSCID is:

```text
03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2
```

This scenario instantiates that existing schema; it does not give the fixture
a new proposition name or broader domain meaning.

## 3. Exact semantic Claim

The primary subject is an existing `ActionContentReference`. It identifies the
exact semantic Action content represented by the following `action_digest`; it
does not identify an occurrence, attempt, resource, account, or physical
object.

```text
Claim.body = {
  subject_reference: ActionContentReference {
    action_digest:
      h'202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f'
  },
  issuer_ref: "bank-A",
  predicate:
    h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2',
  value: true
}
```

The digest is deterministic test-only material already used by the Claim Body
Schema P1 vector. `issuer_ref` is semantic Claim content governed by the
schema's text identifier form. It is not a verification key or inferred from
one. No `assertion_time` or `observation_time` is present because the bounded
v0.2 closure forbids both under this schema.

## 4. Exact canonical Claim body

The representation is exactly:

```text
{
  "subject_reference": [
    "ActionContentReference",
    h'202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f'
  ],
  "issuer_ref": "bank-A",
  "predicate":
    h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2',
  "value": true
}
```

VE-CBOR-1 emits the map keys in encoded-key order: `value`, `predicate`,
`issuer_ref`, `subject_reference`. The canonical body is 147 octets:

```text
a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e63658276416374696f6e436f6e74656e745265666572656e63655820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

For diagnostics only, not as Claim identity or a new protocol field:

```text
SHA-256(canonical Claim.body) =
8bd3f23fa3ba3dd7a5169a520b8fe62c3242efe399e50b510c8dcd94e92b7d91
```

## 5. Independent reconstruction

Implementation A is Python and Implementation B is JavaScript/Node. They
share semantic inputs and governing documents only. They do not share encoded
bytes, a precomputed map, or the diagnostic digest.

Each implementation independently:

1. validates and recomputes the carried PSCID against the retained Anchor C
   schema bytes under DIGEST-001 v0.4;
2. validates the Action-content arm and its direct `bstr(32)` imported value;
3. validates `"bank-A"` under the issuer Text FieldForm and `true` under the
   Boolean value FieldForm;
4. constructs the closed four-member map;
5. applies VE-CBOR-1; and
6. compares its output with the fixed bytes in Section 4.

Observed result:

```text
python_length = node_length = 147
python_bytes  = node_bytes
python_bytes  = Section 4 bytes
```

## 6. Round-trip and Rule/Evaluate input

Each implementation decodes the 147 octets, validates them against the
governing schema, re-encodes them identically, and recovers exactly:

```text
subject_reference = ActionContentReference {
  action_digest:
    h'202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f'
}
issuer_ref = "bank-A"
predicate =
  h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2'
value = true
```

There is no fifth semantic field, implicit time, default, verification value,
or union discriminator field. Following the existing Draft VE-CEL-1 boundary,
an already-established Claim contributes this decoded semantic `Claim.body`
directly to the explicit immutable `claims` input collection. The four fields
remain visible. `verification.profile` and `verification.artifact` remain
absent from the Rule/Evaluate input.

This scenario defines no Rule expression, selection policy, Claim ordering,
or new CEL conversion rule. It demonstrates only that the now-portable body
supplies the exact existing semantic input that the Draft Rule/Evaluate
contract expects.

## 7. Verification-envelope independence

Accepted ADR-VERIFY-002 defines both
`urn:ve:verify:cose-sign1-detached:1` and
`urn:ve:verify:cose-sign-detached:1` as optional Claim verification profiles.
For both, the detached payload is the exact canonical Claim-body bytes and the
verification envelope remains outside `body`.

The scenario therefore compares these two concrete Claim-envelope shapes with
profile-specific opaque artifact placeholders:

```text
Claim A = {
  body: <the exact 147 octets above>,
  verification: {
    profile: "urn:ve:verify:cose-sign1-detached:1",
    artifact: <COSE_Sign1 artifact A>
  }
}

Claim B = {
  body: <the exact 147 octets above>,
  verification: {
    profile: "urn:ve:verify:cose-sign-detached:1",
    artifact: <COSE_Sign artifact B>
  }
}
```

The scenario does not define, allocate, or complete either verification
profile and does not claim these illustrative artifacts verify. It tests the
representation boundary: changing the profile selector or opaque artifact
cannot change the canonical body bytes. Verification success, issuer-to-key
binding, issuer acceptability, trust, and truth remain outside Claim.body.

## 8. Issuer distinction

The controlled variant changes only `issuer_ref` from `"bank-A"` to
`"bank-B"`. Both values satisfy the same schema FieldForm. The variant remains
147 octets and has these canonical bytes:

```text
a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d42717375626a6563745f7265666572656e63658276416374696f6e436f6e74656e745265666572656e63655820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Diagnostic result:

```text
SHA-256(bank-B canonical body) =
2bd201dafdcc51216544da1c7f2b729ffbdda06669799c1e700a6136e26082c8
```

Exactly one semantic text payload octet differs. The Claims are semantically
distinguishable because `issuer_ref` is Claim semantics under the governing
issuer domain. Neither value identifies a verification key, and equal-looking
keys or signers cannot collapse the issuer distinction.

## 9. Negative pressure tests

Each mutation begins from the otherwise valid primary body and is rejected:

| Test | Mutation | Required and observed reason |
|---|---|---|
| N1 | Replace the predicate with 32 octets. | Malformed PSCID: the direct identity must be `bstr(33)`. |
| N2 | Add `assertion_time` or `observation_time`. | Unsupported time field: the governing schema omits `time_semantics`. |
| N3 | Encode `ActionContentReference` with an extra `action_id`. | Wrong union-arm arity and shape. |
| N4 | Encode `value` as integer `1`. | Integer is incompatible with the governing Boolean FieldForm. |
| N5 | Encode `issuer_ref` as a byte string. | Bytes are incompatible with the governing Text FieldForm. |
| N6 | Add `claim_id`, `verification`, or any unknown body member. | The Claim-body map is closed. |
| N7 | Reorder map members contrary to deterministic encoded-key order. | Noncanonical CBOR is rejected, not repaired. |
| N8 | Use an unknown PSCID suite or mismatch the PSCID and retained schema bytes. | Governing schema applicability fails closed. |
| N9 | Append any byte after the complete map. | Exactly one complete canonical item is required. |
| N10 | Replace the `ActionContentReference` `action_digest` with `bstr(31)` or a text value containing the same displayed octets. | The imported digest must be the direct canonical `bstr(32)` value; wrong width or runtime type is rejected without introducing another identity interpretation. |
| N11 | Encode the Claim-body map with a second `issuer_ref` member. | Duplicate members are rejected before semantic interpretation; neither first-value-wins nor last-value-wins processing or normalization is permitted. |

The tests create no fallback, alias, normalization registry, or alternative
valid representation.

## 10. Findings and boundaries

The scenario establishes the following non-normative evidence:

```text
same semantic Claim
+ same governing Predicate Schema
+ same Claim-body profile
→ identical canonical Claim.body bytes
→ exact semantic round-trip
→ direct existing Rule/Evaluate Claim.body input
```

It also confirms:

- `issuer_ref` is semantic Claim content, not verification-key identity;
- `ActionContentReference` identifies Action content only;
- verification metadata is independent of body bytes;
- absent time fields remain absent and receive no defaults; and
- closed schema-driven representation rejects ambiguous or extra material.

The scenario introduces no `claim_id`, `claim_digest`, verification or trust
semantics, Predicate Schema, generic Evidence or Observation, EntityReference,
Correlation, resource/account identity architecture, timestamp, registry, or
new primitive.

## 11. Gap classification

### A. NO NEW CLAIM-BODY PORTABILITY GAP

The primary and issuer-variant Claims converge independently, round-trip
exactly, and preserve the required Rule/Evaluate and verification-envelope
boundaries. The negative cases fail closed under existing owners. This
scenario finds no consequential ambiguity requiring a Claim Body Schema
revision, architectural decision, or new primitive.

Rule expression semantics, exact CEL type conversion, Claim-collection
ordering, and complete Claim verification profiles remain separately governed
downstream work. Their participation does not make them newly discovered
Claim-body representation gaps.

## 12. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The scenario preserves deterministic explicit inputs and separates assertion, verification, authority, and evaluation. |
| New primitive burden | Pass. No new semantic or representation primitive is introduced. |
| Removability | Pass. Removing this evidence changes no normative architecture. |
| Twenty-year durability | Pass. Exact bytes, immutable profile/suite identity, and closed interpretation remain independently replayable. |
| Independent implementability | Pass. Python and Node converge from semantic inputs and governing artifacts without shared bytes. |
| Total conceptual complexity | Pass. The scenario directly reuses Claim, FieldForm, PSCID, Action content identity, VE-CBOR-1, and Rule/Evaluate boundaries. |

## 13. Governance and cadence

The evidence requires no specification change, RFC, ADR, registry, identifier
allocation, or primitive. The next cadence step after independent audit and
merge is a non-normative Gap Analysis for RS-CLM-001.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-11 | Initial non-normative Claim-body portability Reference Scenario. |
