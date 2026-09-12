---
id: LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA
title: Lynx Participant-Level Settlement Predicate Schema
version: "0.1"
status: Draft
document_type: Specification
category: Predicate Schema
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CLAIM-REFERENCE-SEMANTICS
  - VE-001
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
related_documents:
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
  - LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS
supersedes: null
superseded_by: null
---

# Lynx Participant-Level Settlement Predicate Schema

## 1. Status and authority boundary

This is a subordinate normative **Draft v0.1** Predicate Schema under the
Approved Predicate Schema Semantic Contract v1.2, Approved Field-Semantic
Representation Grammar v1.0, Approved Predicate Schema Canonical
Representation Profile v1.2, and Approved DIGEST-001 v0.4. Its normative
language applies only to implementations claiming conformance with this Draft.
It is not Approved, allocates no `VE-xxx` identifier, and creates no kernel
primitive, generic settlement object, evidence object, correlation object,
registry, identity system, or verification profile.

This specification owns only the exact Predicate proposition, its permitted
subject-reference arm, its issuer domain, its value semantics, its equality
semantics, its absent time semantics, and the resulting canonical Predicate
Schema content and PSCID. It does not own Action construction, Lynx message
construction, payment execution, settlement-system behavior, evidence
transport, Claim verification, trust, authorization, or Rule evaluation.

```text
Claim semantics != verification != trust != authorization
```

The non-normative
[Lynx settlement Predicate domain-fact analysis](../kernel-analysis/LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS.md)
records the evidence used to bound this Draft. That analysis is not normative
authority and is not part of Predicate Schema content identity.

## 2. Exact semantic proposition

For a conforming Claim whose value is `true`, this Predicate means exactly:

> The Lynx Payment Obligation produced by this exact correlated Action
> occurrence settled in Lynx at participant level.

The proposition is a historical participant-level Lynx settlement fact. It
does **not** assert that:

- a source customer account debit completed;
- a beneficiary account was credited;
- the beneficiary received funds;
- an end-to-end customer payment completed;
- no later return occurred;
- customer-level economic completion is irreversible; or
- settlement occurred outside Lynx.

A later return is a separate operation and does not rewrite the historical
participant-level settlement fact.

## 3. Subject semantics

The only permitted Claim subject-reference arm is:

```text
ActionOccurrenceReference {
  action_id,
  action_digest
}
```

The canonical Claim-body representation is the existing closed union arm:

```text
[
  "ActionOccurrenceReference",
  VE001ActionIdValue,
  VE001ActionDigestValue
]
```

`VE001ActionIdValue` and `VE001ActionDigestValue` are imported directly from
the Draft VE-001 Action canonical-representation profile as canonical
`bstr(32)` values. There is no wrapper, conversion, alternate encoding, or
hidden normalization.

```text
action_id != action_digest
```

`action_id` selects the exact Action occurrence. `action_digest` binds the
semantic content of that occurrence. Identical Action semantic content can be
used in more than one occurrence, so `ActionContentReference` alone is not
sufficient for this Predicate. No Lynx message identifier, PCRN, UETR,
`InstrId`, or attempt identifier is added to the Claim subject.

## 4. Issuer domain

The semantic issuer for this deliberately bounded Predicate is:

> the Sending Lynx Participant for the payment produced by the referenced
> Action occurrence.

This is a sender-issued settlement Claim for a sender-controlled
Action/Adapter route. It does not assert that the Sending Participant is the
only entity capable of making settlement assertions across the Lynx domain.

The normalized issuer-domain representation is exactly:

```text
{
  "equality": "canonical",
  "identifier": {
    "form": "text"
  }
}
```

The runtime `issuer_ref` is one valid UTF-8/NFC CBOR text string. Non-NFC input
is rejected rather than normalized. Equality is exact canonical
representation equality after validation. This Draft defines no case folding,
trimming, locale-sensitive comparison, BIC interpretation, hidden lookup,
participant registry, key-derived issuer identifier, or fallback identifier.

The governing VerificationContext binds the exact issuer identifier to the
accepted authenticator and decides whether that issuer is recognized for this
Predicate and Action context. That external binding does not become Claim-body
content and does not make authentication equivalent to authorization.

## 5. Value and comparison semantics

The Claim value FieldForm is Boolean restricted to `true`:

```text
{
  "form": "boolean",
  "allowed_values": [true]
}
```

The value has exactly this meaning:

```text
true = the correlated Lynx Payment Obligation settled in Lynx at participant level
```

`false` is not admitted. Absence of observed settlement is not a stable
negative settlement assertion. PCRN, `InstrId`, UETR, and settlement time are
evidence or correlation material and are not Predicate values.

Comparison supports exact semantic equality only. Ordering and conversion are
not supported. To keep the proposition-specific Boolean meaning inside the
Approved v1.2 closed canonical semantic-content boundary, the comparison
domain is the following inline FieldForm descriptor:

```text
{
  "domain": {
    "form": "record",
    "fields": {
      "proposition": {
        "presence": "required",
        "grammar": {
          "form": "text",
          "allowed_values": [
            "The Lynx Payment Obligation produced by this exact correlated Action occurrence settled in Lynx at participant level."
          ]
        }
      }
    }
  },
  "ordered": false
}
```

This descriptor is schema material, not a runtime Claim value and not a new
Proposition, Settlement, domain, ontology, registry, or namespace primitive.
It ensures that the proposition-specific meaning contributes to canonical
Predicate Schema identity. Equality is available only when the complete
governed comparison tuple matches exactly and both local Claim values validate.
There is no ordering, conversion, equivalence inference, or cross-domain
aliasing.

## 6. Time policy

`time_semantics` is absent. Under the currently supported Claim Body Draft
v0.2 closure, both `assertion_time` and `observation_time` are forbidden. A
Claim containing either field, including with `null`, is invalid for this
Predicate.

Settlement timestamps may remain in source evidence. This Draft defines no
timestamp representation, time zone, clock, ordering rule, or time primitive,
and it does not move settlement time into `value`.

## 7. Complete normalized Predicate Schema

The fully inline normalized Predicate Schema is exactly this closed map:

```text
{
  "issuer_domain": {
    "equality": "canonical",
    "identifier": {
      "form": "text"
    }
  },
  "value_semantics": {
    "value": {
      "form": "boolean",
      "allowed_values": [true]
    },
    "comparison": {
      "domain": {
        "form": "record",
        "fields": {
          "proposition": {
            "presence": "required",
            "grammar": {
              "form": "text",
              "allowed_values": [
                "The Lynx Payment Obligation produced by this exact correlated Action occurrence settled in Lynx at participant level."
              ]
            }
          }
        }
      },
      "ordered": false
    }
  },
  "subject_constraints": [
    "ActionOccurrenceReference"
  ]
}
```

No source reference remains after normalization. `subject_domain` and
`time_semantics` are absent. Every map is closed. Unknown or duplicate members,
unknown subject arms, additional semantic rules, external interpretation
hints, and partially normalized content are invalid.

## 8. Canonical representation and PSCID

The Section 7 map is encoded under the Approved Predicate Schema Canonical
Representation Profile v1.2 and VE-CBOR-1. The canonical Predicate Schema
bytes `C` are exactly 393 octets:

```text
a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a26576616c7565a264666f726d67626f6f6c65616e6e616c6c6f7765645f76616c75657381f56a636f6d70617269736f6ea266646f6d61696ea264666f726d667265636f7264666669656c6473a16b70726f706f736974696f6ea2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c756573817875546865204c796e78205061796d656e74204f626c69676174696f6e2070726f6475636564206279207468697320657861637420636f7272656c6174656420416374696f6e206f6363757272656e636520736574746c656420696e204c796e78206174207061727469636970616e74206c6576656c2e6870726573656e6365687265717569726564676f726465726564f4737375626a6563745f636f6e73747261696e7473817819416374696f6e4f6363757272656e63655265666572656e6365
```

The non-identity diagnostic is:

```text
SHA-256(C) = 7d5cbc7ae1e142d43b266e45566a3a242aad4347e346555f8944b12233d1a733
```

Under Approved DIGEST-001 v0.4, the suite and representation-profile bytes are
both `h'03'`. The exact four-element frame is:

```text
VE-CBOR-1([
  h'5645505343494431',
  h'03',
  h'03',
  h'<C>'
])
```

The encoded frame is exactly 410 octets:

```text
8448564550534349443141034103590189a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a26576616c7565a264666f726d67626f6f6c65616e6e616c6c6f7765645f76616c75657381f56a636f6d70617269736f6ea266646f6d61696ea264666f726d667265636f7264666669656c6473a16b70726f706f736974696f6ea2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c756573817875546865204c796e78205061796d656e74204f626c69676174696f6e2070726f6475636564206279207468697320657861637420636f7272656c6174656420416374696f6e206f6363757272656e636520736574746c656420696e204c796e78206174207061727469636970616e74206c6576656c2e6870726573656e6365687265717569726564676f726465726564f4737375626a6563745f636f6e73747261696e7473817819416374696f6e4f6363757272656e63655265666572656e6365
```

The frame digest and final 33-octet PSCID are:

```text
SHA-256(frame) = 308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82
PSCID             = 03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82
```

The PSCID is a canonical `bstr(33)` in Claim bodies. Hexadecimal is diagnostic
presentation only. Exact 33-octet equality is the only identity rule. No
alias, registry, copied Anchor identity, new suite, or new profile code is
created.

## 9. Evidence and correlation boundary

A conforming issuer may assert `true` only after its applicable evidence and
correlation process establishes this chain:

```text
ActionOccurrenceReference { action_id, action_digest }
    -> Adapter submission state
    -> admitted pacs.008
    -> retained InstrId plus corroborating UETR
    -> authenticated settlement surface
    -> PCRN
    -> settlement Claim
```

For this bounded sender route, `InstrId` is the strongest current rule-level
sender-side correlation reference. It is not universally primary independently
of the evidence surface. UETR is mandatory UUIDv4 corroborating information and
is not ranked above `InstrId`. PCRN is Lynx-generated settlement evidence that
identifies the settled Lynx Payment Obligation. It is not the Claim value.

The authenticated settlement surface determines which exact identifier
association is available. This Draft does not claim that every surface carries
both `InstrId` and UETR. The Adapter may retain multiple existing identifiers
without creating a generic Correlation, Transaction, Settlement, Evidence, or
attempt primitive. If the exact Action occurrence, admitted payment, settlement
surface, and PCRN cannot be correlated without guessing, the Claim MUST NOT be
issued under this Predicate.

Evidence syntax alone does not prove settlement. Evidence acquisition,
authentication, retention, and issuer policy remain outside Predicate Schema
canonical content and PSCID.

## 10. Verification boundary

This Predicate Schema defines the semantic proposition only. It does not
define a Claim verification profile, signature or proof format, trust root,
verifier policy, evidence transport, Lynx authentication mechanism, key
representation, issuer-key binding, or authorization decision.

Portable authenticated Claims remain downstream work. An applicable verifier
must separately authenticate the Claim, recover the asserted issuer, bind that
issuer through its VerificationContext, apply trust and authorization policy,
and only then expose the semantic Claim to Rule/Evaluate. Cryptographic
authentication does not itself establish that the asserted issuer is the
Sending Lynx Participant for the referenced occurrence.

## 11. Positive conformance vector

The positive vector uses test-only imported VE-001 values:

```text
action_id     = 000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
action_digest = 202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
issuer_ref    = "lynx-sending-participant-A"
predicate     = 03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82
value         = true
```

Its semantic Claim body is:

```text
{
  "subject_reference": [
    "ActionOccurrenceReference",
    h'000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
    h'202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f'
  ],
  "issuer_ref": "lynx-sending-participant-A",
  "predicate": h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82',
  "value": true
}
```

Under Claim Body Draft v0.2, its canonical body is exactly 206 octets:

```text
a46576616c7565f569707265646963617465582103308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f826a6973737565725f726566781a6c796e782d73656e64696e672d7061727469636970616e742d41717375626a6563745f7265666572656e6365837819416374696f6e4f6363757272656e63655265666572656e63655820000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f5820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Its diagnostic `SHA-256(body)` is
`06eee6be91fa8fc1ae9eaa0ebb224c75e021823a8f69abea104d7262c308dede`.
That digest is not a Claim identity or Claim semantic field.

Two independent implementations MUST reconstruct the exact Section 8 schema
bytes, frame, PSCID, and this Claim-body vector without sharing serialized
bytes or precomputed intermediate values.

## 12. Rejection and semantic-pressure vectors

Each mutation starts from the otherwise valid Section 11 vector or Section 7
schema, as applicable:

| Vector | Mutation | Required result |
|---|---|---|
| N1 | Replace `ActionOccurrenceReference` with `ActionContentReference`. | Reject: the subject arm violates the exact `subject_constraints`. |
| N2 | Encode `action_id` as text, `bstr(31)`, or `bstr(33)`. | Reject: no conversion, truncation, or padding. |
| N3 | Encode `action_digest` as text, `bstr(31)`, or `bstr(33)`. | Reject: no conversion, truncation, or padding. |
| N4 | Set `value` to `false`. | Reject: `allowed_values` contains only `true`. |
| N5 | Encode `value` as integer `1`, text `"true"`, or any non-Boolean. | Reject: FieldForm mismatch. |
| N6 | Use malformed UTF-8, non-NFC text, bytes, `null`, or another runtime category for `issuer_ref`. | Reject without normalization or fallback. |
| N7 | Add `assertion_time` or `observation_time`, including as `null`. | Reject: both time fields are forbidden. |
| N8 | Carry a different, truncated, unknown-suite, or schema-mismatched PSCID. | Reject before semantic interpretation. |
| N9 | Add an unknown or duplicate member to the top-level schema, `issuer_domain`, `value_semantics`, `comparison`, comparison-domain Record, RecordField, or nested FieldForm. | Reject as closed-map or duplicate-member failure. |
| N10 | Reorder canonical map members, use indefinite length, a non-shortest form, noncanonical allowed-value ordering, a semantic tag, trailing bytes, or another noncanonical schema encoding. | Reject rather than silently normalize. |
| N11 | Treat a customer-account debit, beneficiary credit, beneficiary receipt, generic payment completion, or no-return guarantee as entailed by `true`. | Reject the interpretation as outside this Predicate. |
| N12 | Treat PCRN, `InstrId`, UETR, or another message identifier as the Predicate value, subject, or generic Lynx transaction identity. | Reject the interpretation; those remain external evidence/correlation material. |

These vectors do not define a new identity or failure taxonomy. They exercise
the existing Predicate, VE-CBOR-1, DIGEST-001, VE-001, and Claim-body rules.

## 13. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The exact historical proposition, occurrence binding, issuer role, and external evidence boundary remain explicit and inspectable. |
| Primitive burden | Pass. Existing Predicate Schema, Claim, Action occurrence, FieldForm, VE-CBOR-1, and PSCID owners suffice; no new primitive or registry is introduced. |
| Removability | Pass. PCRN and message correlation remain removable from Claim semantics; removing this concrete schema removes only this proposition's portable identity. |
| Twenty-year durability | Pass at Draft scope. The immutable proposition, canonical bytes, suite/profile binding, and participant-level boundary remain interpretable without a live registry or mutable lookup. |
| Independent implementability | Pass. The complete normalized schema, canonical bytes, frame, PSCID, Claim vector, and fail-closed cases are fixed for independent reconstruction. |
| Reduced conceptual complexity | Pass. One true-only occurrence Predicate avoids a PCRN-valued record, correlation wrapper, settlement object, attempt object, or duplicated verification semantics. |

## 14. Governance and conformance result

This Draft remains inside the concrete Predicate Schema work already permitted
by the Approved Predicate architecture. It does not revise an Approved
specification, change the canonical profile or DIGEST suite, allocate a new
`VE-xxx` identifier, or introduce an architectural primitive.

| Governance question | Result |
|---|---|
| RFC required | NO. |
| ADR required | NO. |
| Approved specification revision | NO. |
| New Predicate/Claim/Action field | NO. |
| New primitive or registry | NO. |
| New PSCID suite/profile | NO; existing `h'03'/h'03'` only. |

Conformance with this Draft requires exact agreement with Sections 2 through
12. Conformance does not establish that a Claim is authentic, trustworthy,
authorized, true, or admissible for execution.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial Draft defining the bounded participant-level Lynx settlement proposition, occurrence-only subject restriction, sender-issued text issuer domain, true-only Boolean value, equality-only proposition descriptor, canonical v1.2 bytes, suite/profile `03/03` PSCID, evidence/verification boundaries, and conformance vectors. |
