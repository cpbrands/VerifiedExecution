---
id: RS-LYNX-002
title: Lynx Settlement Predicate Claim Portability
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - VE-CLAIM-REFERENCE-SEMANTICS
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
related_documents:
  - RS-LYNX-001-SUCCESSFUL-LYNX-INTERBANK-SETTLEMENT
  - LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS
  - ADR-VERIFY-002
supersedes: null
superseded_by: null
---

# RS-LYNX-002 — Lynx Settlement Predicate Claim Portability

## 1. Authority and objective

This document is **non-normative evidence**. It pressure-tests the Draft v0.1
[Lynx Participant-Level Settlement Predicate Schema](../specifications/LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA.md)
with the Draft v0.2
[VE-CBOR-1 Claim Body Schema](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md).
It does not modify Action, Claim, Predicate, evidence, verification, trust,
authorization, Rule/Evaluate, Event, or Receipt semantics. It creates no
specification, RFC, ADR, registry, identifier allocation, verification
profile, canonicalization system, or new primitive.

The question is whether an exact authorized Lynx payment Action occurrence can
be correlated to a settled Lynx Payment Obligation and represented as one
portable canonical Claim body under the new Predicate Schema while the
evidence and verification needed to justify and trust the assertion remain
outside Claim semantics.

```text
portable body != verified Claim != authorization
```

The scenario is a reproducible representation and correlation pressure test,
not evidence of a live payment or an assertion that its fixture identifiers
were issued by Payments Canada, Swift, or a Lynx participant.

## 2. Relationship to RS-LYNX-001

[RS-LYNX-001](RS-LYNX-001-SUCCESSFUL-LYNX-INTERBANK-SETTLEMENT.md)
tested the successful Lynx execution path before this concrete Predicate
Schema and portable Claim body existed. It exposed missing portable assertion
and correlation completion work without claiming a fabricated settlement
proof.

RS-LYNX-002 does not revise that history. It reuses RS-LYNX-001's exact Action
fixture, then exercises the now-governed settlement proposition, occurrence
restriction, PSCID, and Claim-body representation. External settlement
evidence and portable Claim verification remain separate from those completed
semantic and representation layers.

## 3. Reused authoritative Action occurrence

The Action fixture remains unchanged on the authoritative baseline. Its exact
imported canonical `bstr(32)` payloads are:

| Value | Hex payload |
|---|---|
| Action schema digest | `e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554` |
| `action_id` | `606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f` |
| `action_digest` | `5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c` |

The schema digest and `action_digest` are reproduced by the existing Lynx
Action Schema and VE-001 representation profile. The patterned `action_id` is
test-only opaque occurrence identity, not a generation rule and not an
adoption of Event OccurrenceId semantics.

```text
action_id != action_digest
```

The first value selects one historical occurrence. The second binds that
occurrence's semantic Action content.

## 4. Exact Predicate and semantic Claim

The governing Predicate proposition is exactly:

> The Lynx Payment Obligation produced by this exact correlated Action
> occurrence settled in Lynx at participant level.

Its PSCID is the exact canonical `bstr(33)` value:

```text
03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82
```

The scenario's bounded Sending Participant identifier is the neutral,
already-NFC text fixture `"lynx-sending-participant-A"`. It is semantic Claim
content for this test. It is not a public key, Payments Canada identity, BIC,
or entry in a universal Lynx participant registry.

The exact semantic Claim is:

```text
Claim.body = {
  subject_reference: ActionOccurrenceReference {
    action_id:
      h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f',
    action_digest:
      h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'
  },
  issuer_ref: "lynx-sending-participant-A",
  predicate:
    h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82',
  value: true
}
```

No fifth Claim-body field, time field, default, correlation identifier,
evidence value, or verification value is present.

## 5. Concrete external evidence and correlation fixture

The following values are illustrative **external correlation/evidence
values**, not Claim-body fields and not VE identities:

| External value | Test fixture | Existing bounded role |
|---|---|---|
| `InstrId` | `LYNXINSTR0000001` | Sixteen-character instructing-party reference; strongest current rule-level sender-side correlation reference for this bounded route. |
| UETR | `123e4567-e89b-42d3-a456-426614174000` | Valid UUIDv4-form corroborating end-to-end message reference; not ranked above `InstrId`. |
| PCRN | `LVTS000000001TR1` | Sixteen-character Lynx settlement evidence/correlation fixture in the current TSP-005 form; not Claim value or Action identity. |

The participant-controlled Adapter records the exact Action pair before the
result is known, validates the deterministic Action-to-message mapping, and
retains the identifiers from the admitted outbound `pacs.008`. The scenario
then assumes an authenticated sender settlement surface whose delivery
context associates the returned PCRN with that exact admitted request. It does
not invent a new settlement message or assert that every surface directly
carries both `InstrId` and UETR.

The instantiated chain is:

```text
ActionOccurrenceReference { action_id, action_digest }
    -> Adapter submission state
    -> admitted pacs.008
    -> retained InstrId = LYNXINSTR0000001
    -> corroborating UETR = 123e4567-e89b-42d3-a456-426614174000
    -> authenticated settlement surface for that admitted request
    -> PCRN = LVTS000000001TR1
    -> settlement Claim
```

The authenticated surface determines which exact identifier association is
available. If the surface cannot associate its PCRN with the exact admitted
request without guessing, the Sending Participant must not issue this Claim.
Retaining several identifiers does not create a generic Correlation,
Transaction, Evidence, Settlement, or attempt primitive.

## 6. Canonical Claim-body bytes

The closed Draft v0.2 representation is:

```text
{
  "subject_reference": [
    "ActionOccurrenceReference",
    h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f',
    h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'
  ],
  "issuer_ref": "lynx-sending-participant-A",
  "predicate":
    h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82',
  "value": true
}
```

VE-CBOR-1 emits the map keys in encoded-key order: `value`, `predicate`,
`issuer_ref`, `subject_reference`. The canonical body is exactly 206 octets:

```text
a46576616c7565f569707265646963617465582103308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f826a6973737565725f726566781a6c796e782d73656e64696e672d7061727469636970616e742d41717375626a6563745f7265666572656e6365837819416374696f6e4f6363757272656e63655265666572656e63655820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f58205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

For diagnostics only:

```text
SHA-256(canonical Claim.body) =
507b4be06e4ee9e4b5e1d827c53f6adc8be086e41819135ee8f8b65dffe55300
```

This digest is neither a `claim_digest` nor Claim identity and is not carried
in the Claim.

## 7. Independent construction and round trip

Implementation A is Python and Implementation B is JavaScript/Node. Each
starts from the semantic values in Section 4 and the governing documents. They
do not share encoded bytes, a prebuilt map, or a precomputed diagnostic hash.
Each independently validates the exact Predicate Schema/PSCID association,
constructs the occurrence arm, validates the issuer and true-only value,
sorts encoded map keys, and applies VE-CBOR-1.

Observed result:

```text
python_length = node_length = 206
python_bytes  = node_bytes
python_bytes  = Section 6 bytes
python_sha256 = node_sha256
python_sha256 = 507b4be06e4ee9e4b5e1d827c53f6adc8be086e41819135ee8f8b65dffe55300
```

Both decoders consume exactly one item, validate the closed representation,
recover the semantic occurrence arm, and re-encode the identical 206 octets.
No decoder repairs a noncanonical encoding.

## 8. Verification and Rule/Evaluate boundaries

The Sending Participant may issue the semantic Claim only after authenticated
external evidence supports the exact correlation in Section 5. That issuance
precondition does not place evidence, a signature, a signer, or trust policy in
the Claim body.

No complete portable Claim verification profile is instantiated by this
scenario. Accepted ADR-VERIFY-002 governs the separation and reserves
subordinate profile work, but the scenario does not select a proof format,
trust root, participant key registry, Swift profile, or Payments Canada
profile. Body conformance alone establishes neither authenticity, issuer-key
binding, trust, truth, nor authorization.

After body verification and trust are established by an applicable external
process, decoding exposes exactly these existing semantic inputs:

```text
subject_reference = ActionOccurrenceReference {
  action_id:
    h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f',
  action_digest:
    h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'
}
issuer_ref = "lynx-sending-participant-A"
predicate =
  h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82'
value = true
```

Those four fields can enter the existing Rule/Evaluate Claim collection
without a new Rule or hidden fifth input. The verification key and external
correlation evidence remain outside. This handoff does not imply that body
conformance makes the Claim trusted, accepted, selected, or eligible.

## 9. Exact settlement meaning

`value = true` means only that the correlated Lynx Payment Obligation settled
in Lynx at participant level. It does not mean or entail:

- source customer account debit completed;
- beneficiary account credited;
- beneficiary received funds;
- end-to-end customer payment completed;
- no later return occurred;
- settlement occurred outside Lynx; or
- generic payment success.

A later return is a separate operation and does not rewrite this bounded
historical participant-level settlement proposition.

## 10. Issuer-difference pressure test

Change only the syntactically valid test identifier from
`"lynx-sending-participant-A"` to `"lynx-sending-participant-B"`. This is an
encoding and semantic-distinction test, not a claim that the second identifier
is authorized for the exact route.

The variant remains 206 octets, but its canonical bytes differ at the issuer
payload and its diagnostic SHA-256 is:

```text
25f275a2c7b9c57c87973da3e9712a9923f57a17234a23fb361bbc6a89bbf9a7
```

The Predicate PSCID and ActionOccurrenceReference do not change. The semantic
Claim does change because `issuer_ref` is semantic content. No equality or
authorization is inferred between the two issuer strings, and verification-key
identity remains external.

## 11. Occurrence-separation pressure test

Consider a second test-only opaque occurrence identifier:

```text
808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f
```

Keep the same `action_digest`. The second Action therefore has the same
semantic content but is a different historical occurrence. Its Claim body is
also 206 octets, with diagnostic SHA-256:

```text
5011fbde4321f5055c5ff43db368c523c3525e596dcedd3c48f2a42b21aaab18
```

Evidence correlated to the first `action_id` does not establish settlement of
the second. A conforming issuer must not copy the Claim across occurrences.
This is why the Predicate requires `ActionOccurrenceReference`; no Claim
identity or execution-attempt primitive is introduced.

## 12. Negative and evidence-pressure cases

Every mutation starts from the otherwise valid scenario. Parser results and
semantic/evidence results remain assigned to their existing owners:

| Case | Mutation | Owner | Required and observed result |
|---|---|---|---|
| N1 | Replace `ActionOccurrenceReference` with `ActionContentReference`. | Predicate semantics | Reject: the Predicate's exact `subject_constraints` permits only the occurrence arm. |
| N2 | Carry a different syntactically valid `action_id`. | Action-reference applicability / Adapter correlation | The body remains structurally valid and the Predicate still permits the occurrence arm, but it refers to a different occurrence than the Adapter submission/evidence chain. Reject applicability to this settled occurrence; equal content cannot substitute for occurrence identity. No new correlation primitive is required. |
| N3 | Carry a different correctly encoded `bstr(32)` `action_digest`. | Action-pair applicability / Adapter correlation | The body remains structurally valid, but the `(action_id, action_digest)` pair no longer matches the authoritative Action occurrence and retained Adapter state. Reject applicability; Predicate semantics do not independently resolve runtime Action identity. A malformed digest type or width is separately a Claim-body structural failure. |
| N4 | Set `value` to `false`. | Predicate semantics | Reject: the governed Boolean domain permits only `true`. |
| N5 | Encode `value` as integer `1` or text `"true"`. | Claim body | Reject: the runtime value is not a CBOR Boolean admitted by the FieldForm. |
| N6 | Carry a different, malformed, unknown-suite, or schema-mismatched PSCID. | Claim body / Predicate applicability | Reject before semantic use; no alias or fallback Predicate identity exists. |
| N7 | Encode `issuer_ref` as bytes, malformed UTF-8, non-NFC text, or `null`. | Claim body | Reject without conversion, repair, fallback, or normalization. |
| N8 | Add `assertion_time`. | Claim body | Reject: time is forbidden by the bounded Draft v0.2 closure. |
| N9 | Add `observation_time`. | Claim body | Reject for the same reason; `null` is not absence. |
| N10 | Add an unknown or duplicate Claim-body member or use a malformed map. | Claim body | Reject before semantic interpretation; no first-value-wins or last-value-wins behavior. |
| N11 | Use indefinite length, wrong key order, non-shortest encoding, a tag, or trailing bytes. | Claim body | Reject noncanonical input rather than normalize it. |
| N12 | Present settlement evidence associated with a different `InstrId` or PCRN/request association. | Adapter correlation / evidence | Do not issue or accept this semantic Claim; never guess the join. This is not merely a parser failure. |
| N13 | Reuse the same `action_digest` with the second valid `action_id`. | Action-reference applicability / Adapter correlation | The second reference is a structurally and Predicate-valid distinct Action occurrence, but it does not inherit settlement evidence bound to the first occurrence. Settlement of occurrence A does not imply settlement of occurrence B; applicability fails because the retained Adapter/evidence chain identifies a different occurrence. |
| N14 | Present syntactically valid `LVTS000000001TR1` without authenticated settlement context. | Evidence/authentication | Insufficient evidence: PCRN syntax or possession alone does not prove that Lynx generated it for this obligation, that its source is authentic, or that it is associated with this Action occurrence. This failure occurs before or independently of later Claim cryptographic verification: syntactically valid identifier != authenticated settlement evidence != verified Claim != authorization. |

The suite also confirms that Rule/Evaluate receives no verification artifact,
evidence value, PCRN, `InstrId`, or UETR as an implicit Claim-body field.

## 13. Findings and candidate-gap classification

The positive and pressure tests establish:

```text
exact Action occurrence
+ authenticated external correlation evidence
+ governed Predicate Schema
+ Claim Body Draft v0.2
-> deterministic portable semantic Claim body
```

The following classification distinguishes a missing concrete downstream
artifact from a change to existing architecture:

| Area | Finding |
|---|---|
| CLAIM BODY | **NO GAP EXPOSED.** Python and Node converge, round-trip, and fail closed under the existing Draft v0.2 owner. |
| PREDICATE | **NO GAP EXPOSED.** The occurrence-only subject, bounded issuer, true-only value, exact proposition, and PSCID are sufficient. |
| ADAPTER/CORRELATION | **NO ARCHITECTURAL GAP EXPOSED.** Existing Adapter state and authenticated evidence context can retain and compare the existing identifiers. Issuance remains unavailable when the selected surface cannot provide the required association. |
| VERIFICATION | **DOWNSTREAM PROFILE COMPLETION REMAINS.** The repository has accepted Claim-verification architecture but this scenario does not instantiate a portable Claim verification profile. No new verification semantics are required. |
| EVIDENCE/AUTHENTICATION | **CONCRETE SOURCE CONTRACT REMAINS DEPLOYMENT- OR PROFILE-SPECIFIC.** Portable cross-deployment interpretation would require a governed source/profile if pursued; no evidence architecture defect is demonstrated. |
| RULE/EVALUATE | **NO NEW GAP EXPOSED.** The exact four-field semantic handoff is available; Rule definition, Claim selection, CEL conversion, and collection ordering remain with their existing owner. |
| EVENT/RECEIPT | **NOT EXERCISED AND NO GAP CLAIMED.** The Claim body does not manufacture an Event or Receipt. |
| ARCHITECTURAL GAP | **NONE FOUND.** No accepted architecture or Approved specification needs revision for this scenario. |

The next cadence step is a Gap Analysis of these findings. It must decide
whether the remaining verification and evidence-source work merits a concrete
subordinate profile, a deployment contract, or no immediate normative work.
This scenario does not pre-authorize that artifact.

## 14. Architectural Decision Test and governance

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Exact intent occurrence, assertion, evidence, verification, trust, and evaluation remain separated and inspectable. |
| Primitive burden | Pass. Existing Action, Claim, Predicate, Adapter state, FieldForm, PSCID, and VE-CBOR-1 owners suffice. |
| Removability | Pass. Removing this evidence changes no normative architecture or conformance rule. |
| Twenty-year durability | Pass at scenario scope. Exact bytes, immutable PSCID, bounded proposition, and explicit external-evidence assumptions preserve meaning without a live registry. |
| Independent implementability | Pass. Python and Node reconstruct and round-trip the body from semantic inputs; unavailable live settlement evidence is not misrepresented as implemented. |
| Reduced conceptual complexity | Pass. One true-only occurrence Claim avoids a PCRN-valued Claim, correlation wrapper, settlement object, verification-key identity, or Claim identity. |

This one non-normative scenario revises no specification and introduces no
new field, primitive, registry, profile, or VE identifier. The observed
downstream completion work stays inside existing owners.

```text
RFC REQUIRED = NO
```

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial non-normative scenario for the concrete Lynx participant-level settlement Predicate, exact occurrence correlation, portable Claim body, evidence/verification boundary, and pressure tests. |
