---
id: PRESSURE-TEST-CLAIM-SEMANTIC-CONTEXT-SELECTION
title: Claim Semantic Context Selection
version: "0.1"
status: Draft
document_type: Pressure Test
category: Kernel Analysis
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-27
depends_on: []
related_documents:
  - ADR-VERIFY-002
  - VE-001
  - VE-002
  - VE-CLAIM-REFERENCE-SEMANTICS
  - CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - RFC-005
supersedes: null
superseded_by: null
---

# Pressure Test — Claim Semantic Context Selection

## Status and authority boundary

This is non-normative kernel-analysis evidence. It does not add a Claim-body
field, change an Approved specification, accept RFC-005, create a profile,
create a new primitive, or establish a canonical representation.

The test preserves the accepted Claim envelope in ADR-VERIFY-002 and the
Draft status of VE-002, Claim Reference Semantics, VE-CBOR-1 Claim Body
Schema, and RFC-005. Its conclusions are candidates for later governed
specification work only.

## Question

What is the minimum immutable, integrity-bound mechanism by which independent
implementations can determine Claim-body semantics for:

```text
subject_reference
issuer_ref
predicate
value
assertion_time?
observation_time?
```

The alternatives tested are:

```text
A. predicate-selected semantics
B. separate content-bound claim_profile_ref
C. existing external context
D. another smaller mechanism
```

## Test model

For this test, a **Predicate Schema** is an immutable, versioned external
semantic descriptor identified by the content-bound `predicate` value. It
defines what that predicate means; it is not a VE-hosted global registry, a
new VE primitive, or an identity provider. The exact predicate
identifier/reference form and its representation are deliberately outside this
test.

The complete predicate identifier MUST be globally unambiguous within the
Claim semantic system, version-specific, integrity/content-bound to exactly
one immutable Predicate Schema, and resolvable by independent
implementations. The identifier MAY incorporate its own namespace. VE does not
require a VE-hosted global predicate registry.

Namespace ambiguity MUST be impossible at the level of the complete predicate
identifier: two unrelated schemas MUST NOT use the same complete identifier
for different meanings. This namespace may be incorporated into the identifier
itself; this test introduces neither `predicate_namespace` nor
`claim_profile_ref`.

The semantic requirement is deterministic resolution:

```text
same predicate identifier -> same immutable, versioned Predicate Schema
```

How an implementation obtains the schema is transport behavior, not Claim
semantics. An implementation MAY use a locally provisioned schema set. Network
retrieval is optional and MUST NOT be required during Verify/Evaluate
execution.

Under the candidate predicate-selected model, a predicate schema defines:

- the value domain and equality;
- numeric unit, scale, and range when relevant;
- null-like and structured-value semantics when allowed;
- permissible semantic issuer domain and issuer equality;
- permissible subject-reference forms and their constraints; and
- whether assertion and observation times are allowed, required, and
  semantically meaningful.

The closed Claim subject union itself remains owned by Claim semantics:

```text
ActionContentReference { action_digest }
ActionOccurrenceReference { action_id, action_digest }
EventReference { event_id }
```

Action and Event profiles own the canonical representation of their identifier
components. A predicate schema may constrain which legal subject forms apply
to its proposition, but it does not define `action_id`, `action_digest`, or
`event_id` wire encoding.

## Attack 1 — Predicate-selected semantics

`predicate` is already Claim-body content and is therefore included in any
canonical Claim-body representation and verification binding. If it identifies
an immutable, versioned predicate schema, it can select the semantic contract
needed to interpret the remaining fields without another Claim field.

For example, `bank.balance.v1` is only an illustrative label. It is sufficient
only when its complete identifier meets every identity and resolution
requirement in the test model. Its immutable Predicate Schema can define that
values are signed integer minor currency units, that issuers are in a specified
financial-authority identifier domain, that the subject is a permitted Action
or Event form, and that observation time is required. A predicate identifier
need not be globally registered by VE to do this; its governing schema is the
relevant semantic contract.

The same model supports independently versioned predicates such as
`bank.balance.v2`. A semantic change creates a new immutable Predicate Schema
identifier rather than silently changing the meaning of a previous Claim.

**Result:** a content-bound predicate can select the required Claim semantic
context only when its complete identifier is namespace-safe, immutable,
version-specific, and deterministically resolvable.

## Attack 2 — Cross-domain scope

| Domain | Predicate-schema role | Need for separate Claim profile |
|---|---|---|
| Bank balance | Defines monetary value unit/scale, permitted bank-issuer domain, eligible Action/Event subjects, and observation-time meaning. | Not demonstrated. |
| Robotic sensor state | Defines sensor measurement value, calibration/unit convention, permitted sensor issuer domain, Event/Action subject constraints, and measurement time. | Not demonstrated. |
| GitHub authorization/status | Defines status/authorization value vocabulary, GitHub authority-domain issuer semantics, permitted subject form, and assertion-time requirements. | Not demonstrated. |
| Government credential | Defines credential-status value semantics, government-issuer domain, permitted subject form, and issue/observation-time semantics. | Not demonstrated. |

Across these cases, each Claim has one proposition. The predicate schema is
therefore the natural owner of the semantics particular to that proposition.
It can reuse ordinary schema components for common issuer, time, or value
conventions without creating a second Claim-level selector.

## Attack 3 — Issuer and trust boundary

A predicate schema may define the semantic domain in which `issuer_ref` is
interpreted and compared. It MUST NOT decide whether a particular issuer is
trusted, delegated, revoked, or authorized for a particular evaluation.

```text
predicate schema: semantic issuer domain
VerificationContext: issuer_ref-to-verifier/key binding
Trust Context / Evaluate: trust and applicability decision
```

This preserves the accepted ADR-VERIFY-002 distinction between semantic
issuer, verifier/key material, and policy acceptance. Predicate-selected
semantics do not turn a predicate schema into a trust registry.

Identical `issuer_ref` values under different predicates MUST NOT be assumed
to denote the same semantic issuer unless their governing Predicate Schemas
explicitly bind to the same issuer-domain contract. Therefore:

```text
predicate A: issuer_ref = "123"
predicate B: issuer_ref = "123"
```

does not automatically identify the same issuer. Cross-predicate issuer
equality requires a shared declared issuer-domain contract.

## Attack 4 — Value, time, and subject constraints

The predicate schema can define the value contract without a universal VE
value grammar. It can also define whether a present `assertion_time` means the
issuer's assertion time, whether a present `observation_time` is material to
the proposition, and which time profile/representation is required.

It can restrict its Claim to one or more legal members of the existing closed
subject union. Claim Reference Semantics owns the legal forms; the Predicate
Schema only constrains which forms are valid for its proposition. Action and
Event profiles retain ownership of `action_id`, `action_digest`, and `event_id`
representation. This does not transfer identifier wire-format ownership to
Claim or Predicate Schema semantics.

**Result:** no field among value, time, issuer domain, or subject constraint
requires an umbrella Claim profile in the tested cases.

## Attack 5 — Separate `claim_profile_ref`

Consider:

```text
Claim.body {
  claim_profile_ref,
  subject_reference,
  issuer_ref,
  predicate,
  value,
  assertion_time?,
  observation_time?
}
```

For this field to be non-duplicative, it would need to govern semantics that a
predicate schema cannot govern. The tested candidate responsibilities are all
proposition-specific and can be defined by the selected predicate schema.

A separate Claim profile would itself require immutable identity, versioning,
resolution, compatibility rules, content binding, and canonical
representation. It would either repeat the predicate schema's semantic
selection or require a second split of responsibilities not demonstrated by
any scenario.

Removing `claim_profile_ref` while retaining an immutable predicate-selected
schema loses no tested capability. Cross-predicate reuse of common conventions
may use schema composition, shared issuer-domain contracts, and shared
value/time schemas; it does not require a Claim-level profile selector.

**Result:** `claim_profile_ref + predicate` duplicates semantic selection in
the tested model.

## Attack 6 — External-context model

Execution context, Rule context, Trust Context, local configuration, and a
calling protocol may help apply or verify a Claim. They cannot alone select
portable Claim meaning because they may be absent, mutable, local, or
different for two verifiers.

If an external context identity is included in the signed canonical semantic
preimage, it becomes a content-bound semantic selector. It then recreates a
profile/schema-reference mechanism and is not smaller than predicate-selected
semantics.

**Result:** mutable external context is insufficient; integrity-bound predicate
selection is smaller.

## Attack 7 — `verification.profile`

Accepted ADR-VERIFY-002 defines `verification.profile` as the selector for a
verification procedure and artifact format. It explicitly requires that
verification not alter the semantic assertion. It therefore cannot select
Claim meaning under current authority.

A future combined verification-and-semantic profile is possible only if it is
cryptographically bound to semantic Claim content and if the accepted ADR
boundary is changed through normal governance. This test does not propose that
change.

## Attack 8 — Content binding and canonical-byte consequence

`predicate` is inside Claim body. Its selected immutable schema is therefore
bound by the Claim-body canonical representation and portable verification
artifact. The following consequence is required:

```text
same Claim.body
  -> same predicate identifier
  -> same immutable Predicate Schema
  -> same semantic interpretation
```

A Claim body cannot be reinterpreted under another Predicate Schema without
changing its content-bound predicate value.

Once a predicate schema and referenced Action/Event representation profiles
define the required semantic domains, a later representation profile can
produce:

```text
same semantic Claim.body
  -> same schema-resolved representation
  -> same canonical bytes
```

This test defines neither that representation nor the resolution protocol.

## Architectural Decision Test

| Test | Predicate-selected semantics | Separate `claim_profile_ref` |
|---|---|---|
| Founding Principles consistency | Pass: semantic meaning is explicit and inspectable. | Pass, but adds a second selector. |
| New primitive burden | Pass: Predicate Schema is a non-primitive semantic abstraction; Claim structure does not expand. | Pass as a field, but creates a second profile abstraction. |
| Removability | Predicate Schema is removable only at the cost of semantic ambiguity. | Removable in all tested cases. |
| Twenty-year durability | Pass: predicate versions evolve locally. | Conditional: requires durable profile identity and compatibility rules. |
| Independent implementability | Pass with the immutable predicate schema. | Pass only after additional profile-reference work. |
| Total conceptual complexity | Lower: one content-bound selector. | Higher: duplicates schema selection. |

## Verdict

**A. PREDICATE-SELECTED SEMANTICS SUFFICIENT — NO NEW CLAIM FIELD.**

The predicate identifies an immutable, versioned Predicate Schema. It can own
issuer-domain semantics without owning trust, and can own value, time, and
subject constraints. No separate `claim_profile_ref` is required by the tested
scenarios.

Predicate Schema is a necessary non-primitive normative abstraction. It is
necessary for independent interpretation, removable only at the cost of
ambiguity, does not expand Claim structure, and reduces total complexity
compared with a separate Claim Profile. It does not create a generic Claim
Profile abstraction or a new VE primitive. It requires later governed
specification of how a predicate identifies its immutable schema, without
relying on Draft RFC-005.

## Governance consequence

No RFC, ADR, or Approved-specification revision is required for this
non-normative pressure-test result. A future Draft Claim semantic
specification may describe predicate-selected semantics without changing the
accepted generic Claim envelope in ADR-VERIFY-002.

If a future proposal overloads `verification.profile`, changes the accepted
Claim envelope, or changes an Approved specification, it requires the normal
RFC, ADR, version-increment, and changelog path.

## Effect on the uncommitted field contract

`CLAIM-BODY-SEMANTIC-FIELD-CONTRACT.md` requires correction before it may be
committed. It should remove `claim_profile_ref` as a required Claim-body field,
replace its verdict with predicate-selected semantics, and keep Action/Event
identifier representation with their owning profiles.

## Next artifact

The next artifact is **Claim Predicate Schema Reference Semantics**. It should
define the minimum requirements for predicate identifiers, immutable schema
binding, versioning, namespace safety, deterministic resolution, offline
provisioning, and cross-predicate shared contracts. It must not require a
VE-hosted global registry, generic reference ontology, or a new Claim-body
field, and must remain separate from byte encoding and RFC-005 representation
machinery.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-27 | Initial non-normative comparison of Claim semantic-context models. |
