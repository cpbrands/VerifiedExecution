---
id: GAP-ANALYSIS-RS-CLM-001-CLAIM-BODY-PORTABILITY
title: Gap Analysis for RS-CLM-001 Claim Body Portability
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Analysis
author: Verified Execution Editorial Board
created: 2026-09-11
updated: 2026-09-11
depends_on:
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - RS-CLM-001
related_documents:
  - VE-CLAIM-REFERENCE-SEMANTICS
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - ADR-VERIFY-002
  - GAP-ANALYSIS-RS-LYNX-001-SETTLEMENT-ASSERTION-CORRELATION
supersedes: null
superseded_by: null
---

# Gap Analysis for RS-CLM-001 Claim Body Portability

## 1. Authority and question

This document is **non-normative analysis**. It records what the Draft v0.2
[VE-CBOR-1 Claim Body Schema](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md)
and non-normative
[RS-CLM-001](../reference-scenarios/RS-CLM-001-CLAIM-BODY-PORTABILITY.md)
establish. It does not amend a specification, create an RFC or ADR, define a
Predicate Schema, select a verification profile, or introduce a primitive.

The bounded question is:

> Does VE-CBOR-1 Claim Body Schema Draft v0.2, as exercised by RS-CLM-001,
> provide a sufficiently closed portable representation for `Claim.body` at
> its declared scope?

It is not whether every possible Claim, verified Claim, domain assertion,
Rule/Evaluate binding, Event, Receipt, or evidence flow is complete.

## 2. Authorities and evidence

| Source | Status and role in this analysis |
|---|---|
| [Claim Body Schema v0.2](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md) | Draft representation authority at its declared bounded scope: exact body map, subject union, imported identities, schema-driven values, canonical bytes, and rejection rules. |
| [RS-CLM-001](../reference-scenarios/RS-CLM-001-CLAIM-BODY-PORTABILITY.md) | Non-normative evidence for independent construction, round trip, Rule/Evaluate handoff, issuer distinction, envelope independence, and rejection behavior. |
| [Claim Body Semantic Field Contract](../specifications/CLAIM-BODY-SEMANTIC-FIELD-CONTRACT.md) and [Claim Predicate Schema Reference Semantics](../specifications/CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS.md) | Draft semantic owners for the existing body fields and immutable Predicate Schema selection. |
| [Claim Reference Semantics v0.2](../specifications/VE-CLAIM-REFERENCE-SEMANTICS.md) | Draft semantic owner for the four closed subject-reference alternatives. |
| [Predicate Schema Canonical Representation Profile v1.2](../specifications/PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE.md), [Field-Semantic Grammar](../specifications/PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR.md), and [DIGEST-001 v0.4](../specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md) | Approved bounded Predicate Schema representation, FieldForm closure, and PSCID constructions. |
| [ADR-VERIFY-002](../adrs/ADR-VERIFY-002-CLAIM-VERIFICATION-ENVELOPE.md) | Accepted separation of semantic `body` from profile-dispatched `verification`. |
| [VE-CEL-1 Rule/Evaluate Input Contract](../specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md) | Draft downstream binding contract; it consumes established semantic bodies but retains CEL conversion and collection-order work. |
| [RS-LYNX-001 Gap Analysis](GAP-ANALYSIS-RS-LYNX-001-SETTLEMENT-ASSERTION-CORRELATION.md) | Non-normative prior evidence that shared Claim-body representation was upstream of concrete Lynx assertion work. |

Passing vectors and validators are evidence. They do not replace the governing
Draft or Approved text.

## 3. What RS-CLM-001 proves

RS-CLM-001 establishes, within one valid Approved Predicate Schema and one
subject-reference arm, that two independent implementations can:

1. start from the same semantic four-field Claim body and retained governing
   schema;
2. recompute and validate the carried Anchor C PSCID under DIGEST-001 v0.4;
3. directly embed the existing `ActionContentReference` digest value;
4. independently produce the same 147 canonical octets;
5. decode, schema-validate, and re-encode those octets without semantic loss;
6. recover exactly `subject_reference`, `issuer_ref`, `predicate`, and `value`
   for the existing Rule/Evaluate input boundary;
7. preserve `issuer_ref` as semantic body content, demonstrated by distinct
   bytes for otherwise identical `"bank-A"` and `"bank-B"` bodies;
8. carry identical body bytes under different external verification-envelope
   shapes; and
9. reject the tested wrong PSCID, unsupported time, malformed union, wrong
   FieldForm, unknown member, noncanonical order, trailing data, malformed
   `action_digest`, and duplicate-member cases.

The diagnostic SHA-256 of the positive body is reproducibility evidence only.
It is not `claim_digest`, Claim identity, a sort key, or a protocol field.

The scenario does **not** prove that every Predicate Schema exists, every
FieldForm combination has domain evidence, every subject arm has separate
end-to-end scenario coverage, any illustrative verification artifact verifies,
or the complete VE-CEL-1 binding is finished. Those are not necessary claims
for the demonstrated generic outer-body format.

## 4. Claim-body representation closure

The Draft's supported body is exactly:

```text
ClaimBodyV02 := {
  "subject_reference": SubjectReferenceV02,
  "issuer_ref": IssuerRefValue,
  "predicate": PredicateSchemaContentIdentity,
  "value": ClaimValue
}
```

The closure is complete at the declared Draft scope:

| Property | Result |
|---|---|
| Structure | Four required members, exact labels, no additional top-level member. |
| Canonical determinism | VE-CBOR-1 deterministic encoding, exact encoded-key order, shortest encodings, NFC text, no tags/floats/indefinite forms, exact single-item consumption, and re-encoding equality. |
| Subject union | Four exact array shapes with fixed tag, length, order, and imported payload form; unknown, ambiguous, missing, extra, or cross-arm payloads reject. |
| Recursive values | Applicable normalized Predicate Schema selects the bounded FieldForm; Record and Sequence recurse, with closed records and schema-owned constraints. |
| Unknown and duplicate members | Rejected at the body and every closed nested map; no first-value-wins, last-value-wins, or silent normalization. |
| Absence, null, defaults | All four body members are required and non-null; optional nested record fields use omission; `null` is not absence; no runtime default is inserted. |
| Predicate identity | Direct canonical `bstr(33)` PSCID embedding; retained schema bytes are revalidated and the PSCID recomputed under the carried supported suite. |
| Implementation independence | Exact positive/rejection vectors and independent Python/Node reconstruction converge. |

**Classification: A. CLOSED FOR CURRENT DRAFT SCOPE.**

That result is bounded by explicit applicability. Missing, unavailable,
unsupported, or mismatched governing schema material makes the profile
inapplicable; it does not license guessing, fallback, or a local alias.

## 5. Subject-reference coverage

RS-CLM-001 directly exercises `ActionContentReference`. That is sufficient to
test the generic body-map composition because the subject value occupies one
closed member and the outer map does not change by arm.

The Draft itself separately closes all four representations and supplies a
positive vector for each:

| Arm | Structural closure |
|---|---|
| `ActionContentReference` | Exact two-member array plus direct imported canonical `action_digest`. |
| `ActionOccurrenceReference` | Exact three-member array plus direct imported canonical `action_id` and `action_digest`. |
| `EventReference` | Exact two-member array plus Approved VE-002 canonical `event_id`. |
| `ExternalSubjectReference` | Exact two-member array; identifier form comes from the required resolved `subject_domain.identifier`. |

Every arm has a distinct tag and arity. The applicable Predicate Schema
controls whether the selected arm is permitted, and only the external arm
requires `subject_domain`. No arm is structurally under-specified within the
bounded closure. Four additional end-to-end scenarios could add domain
evidence, but are not required to close the shared representation design.

## 6. Time-field classification

`assertion_time` and `observation_time` remain abstractly optional Claim
semantics. The Approved Predicate profiles currently supported by the body
Draft admit absent `time_semantics`; under that closure both fields are
forbidden, including when encoded as `null`.

This is a **DECLARED DRAFT LIMITATION**, not a current body-portability blocker.
All admitted bodies have one deterministic answer: the time fields are absent.
The limitation must remain visible and tracked. A future governed Predicate
closure and Claim-body extension may define exact time-domain semantics and
representation. This analysis invents no epoch, precision, zone, leap-second,
clock, or timestamp format.

## 7. Verification boundary

The portable semantic body contains no verification material. ADR-VERIFY-002
keeps the envelope separate:

```text
Claim {
  body,
  verification { profile, artifact }
}
```

The selected profile owns artifact syntax, covered-data construction,
algorithm interpretation, verifier/key selection procedure, verification
procedure, and errors. VerificationContext supplies the issuer-to-verifier/key
binding. Trust, issuer acceptability, truth, eligibility for a particular Rule,
and authorization remain outside canonical body construction.

Therefore:

```text
portable Claim.body semantics
!= verification portability
!= verification result
!= trust or Root Authority
!= Rule/Evaluate eligibility
!= execution authorization
```

Identical body bytes under different verification envelopes demonstrate the
required lack of semantic coupling. A universal Claim verification profile is
not required to close body portability. A deployment seeking independently
portable authenticated Claims still has a **VERIFICATION DEPENDENCY**: it must
use a concrete applicable profile and provisioned verification context. That
dependency belongs to verification, not `Claim.body`.

## 8. Predicate Schema dependency

Claim-body representation can be closed while useful domain Claims continue
to require concrete Predicate Schemas. The body profile supplies the shared
container and schema-driven representation; it does not invent propositions.

RS-CLM-001 validly reuses Approved Anchor C to prove the generic format. One
valid schema is enough for that claim. It does not imply that every domain
assertion is now expressible or that local labels may substitute for immutable
schema identity.

This matches the earlier RS-LYNX-001 analysis after updating its then-current
dependency state:

```text
shared Claim.body representation       = now closed at Draft v0.2 scope
concrete Lynx settlement proposition   = still absent
concrete issuer/value/domain semantics = still domain work
portable authentication                = still verification work
Action/external correlation evidence   = still domain/evidence work
Event and Receipt representation       = still downstream owner work
```

Concrete Predicate Schema availability is therefore a
**DOMAIN-SPECIFIC DEPENDENCY**, not a generic Claim-body defect.

## 9. Rule/Evaluate result

The existing Rule/Evaluate model consumes an explicit collection of already
established semantic `Claim.body` values. RS-CLM-001 demonstrates lossless
recovery of the four fields and preserves verification metadata outside the
CEL-visible body.

No additional Claim semantic field is needed for that handoff. In particular,
Rule/Evaluate does not require `claim_id`, `claim_digest`, embedded
verification, trust metadata, timestamps, or a correlation primitive merely
to receive this body.

The Draft VE-CEL-1 contract still owns unresolved downstream details:

- exact CBOR-to-CEL conversion for all supported recursive values;
- pinned CEL presence and type behavior;
- final claims-collection representation;
- the accepted list-order criterion and deterministic collision tie-breaking
  if a list is used; and
- completion of the engine-specific binding profile.

Canonical body bytes now satisfy the upstream representation dependency named
by that Draft, but they do not silently revise its accepted digest-order rule
or finish its CEL mapping. These are a **RULE/EVALUATE DEPENDENCY**, not a
reason to add Claim fields and not a failure of body portability.

A repository conflict search finds older statements in that VE-CEL-1 Draft and
the non-normative RS-LYNX-001 Gap Analysis saying that canonical Claim-body
bytes were not yet defined. Those statements accurately recorded their
then-current dependency but are stale after Draft v0.2 merged. They do not
define an alternate body representation or contradict the current v0.2
closure. A future VE-CEL-1 revision should update its dependency accounting
while resolving the still-open CEL conversion and collection-order work.

## 10. Claim identity

No current scenario or authoritative downstream contract demonstrates a need
for canonical Claim identity. Canonical bytes support deterministic transport,
verification coverage, replay, comparison, and possible downstream ordering
mechanics without becoming a semantic identifier.

The absence of `claim_id` and `claim_digest` remains sound:

```text
canonical Claim.body bytes
!= semantic Claim identity
!= occurrence identity
!= verification artifact identity
```

If a future owner needs a content-derived mechanical sort input, that owner
can specify it without adding a semantic field unless evidence separately
requires Claim identity. The RS diagnostic SHA-256 remains non-semantic.

## 11. Cross-domain pressure tests

| Pressure test | Claim-body result | Remaining blocker or owner |
|---|---|---|
| Bank-balance Claim | No body-format blocker for a supported schema; issuer difference is carried semantically and changes bytes. | Concrete bank-balance Predicate Schema and applicable verification/trust are domain and verification dependencies. |
| Action-content Claim | Closed by `ActionContentReference`; RS-CLM-001 reproduces it directly. | Concrete proposition and verification only where the use case requires them. |
| Action-occurrence Claim | Closed by the exact `action_id` plus `action_digest` arm; Draft P2 supplies representation evidence. | No body blocker; application evidence must supply the intended occurrence/content pair. |
| Event Claim | Closed by direct Approved `event_id` embedding; Draft P3 supplies representation evidence. | Event provenance and any Event/Receipt integrity remain with Event, verification, and history owners. |
| External-subject Claim | Closed when a supported Predicate Schema supplies and permits `subject_domain.identifier`; Draft P4 supplies representation evidence. | Concrete domain semantics and retained schema availability; unsupported external domains remain inapplicable. |
| Lynx settlement assertion | Shared body representation no longer blocks the one-Claim composition identified by RS-LYNX-001. | Concrete Lynx settlement Predicate Schema, exact recognized issuer/source contract, applicable Claim verification, Action correlation evidence, and later Event/Receipt representation. |

None of these pressure tests requires a fifth subject arm, generic reference,
Claim identity, embedded verification, time field, or new kernel primitive.

## 12. Finding inventory

| Finding | Classification | Current owner / consequence |
|---|---|---|
| Four-field body, union, FieldForm mapping, PSCID embedding, canonical bytes, and rejection behavior | **CLOSED** | VE-CBOR-1 Claim Body Schema Draft v0.2 at its declared scope. |
| Time-enabled Claims | **DECLARED DRAFT LIMITATION** | Future Predicate and Claim-body time profile/extension; not required for current admitted bodies. |
| Concrete domain propositions such as Lynx settlement | **DOMAIN-SPECIFIC DEPENDENCY** | A concrete governed Predicate Schema and retained domain contracts. |
| Independently portable authentication of Claim envelopes | **VERIFICATION DEPENDENCY** | Applicable subordinate Claim verification profile and VerificationContext provisioning. |
| Exact CEL conversion and deterministic collection binding | **RULE/EVALUATE DEPENDENCY** | VE-CEL-1 binding completion; no new Claim semantics implied. |
| Event, Receipt, authoritative outcome, and evidence retention | **NEXT SPECIFICATION DEPENDENCY** | Their existing semantic and representation owners; not body members. |
| New architectural primitive or accepted semantic change | **CLOSED: NONE DEMONSTRATED** | No RFC trigger. |

No consequential pair of conforming Claim-body implementations was found that
can accept the same complete governing inputs yet legitimately produce
different body bytes or recovered semantics within the supported closure.

## 13. RFC decision and governance

**RFC REQUIRED = NO.**

The analysis identifies no change to accepted architecture or an Approved
specification. It does not require a Claim identifier, digest, registry,
resolver, universal time model, generic verification object, new reference,
or new VE primitive. Draft extensions, concrete Predicate Schemas, subordinate
verification profiles, and further Reference Scenarios follow their existing
governance unless their actual content later conflicts with Approved or
Accepted authority.

## 14. Recommended next specification

The smallest next specification supported by the present evidence is a
**concrete Predicate Schema for the Lynx settlement assertion** identified by
RS-LYNX-001.

The shared Claim-body bottleneck named by that earlier analysis is now closed
at Draft v0.2 scope. A Lynx-specific Claim envelope would duplicate the shared
body and is rejected. Completing VE-CEL-1 is reusable downstream work, but it
does not supply the missing Lynx proposition, issuer domain, settlement value,
or source/correlation meaning. Event or Receipt representation cannot replace
the assertion that feeds their boundary decision.

The Lynx schema must remain subordinate and domain-specific. Before freezing
it, its construction must establish the exact external settlement identifier,
issuer/source authority contract, value fields, Action-occurrence constraint,
and any required correlation semantics from authoritative domain evidence. If
that evidence is unavailable or falls outside the Approved bounded FieldForm
closure, drafting must stop rather than invent a resolver, registry, or generic
correlation primitive.

This recommendation does not create that schema and does not begin Lynx
implementation work.

## 15. Architectural Decision Tests

The tests apply to the recommended concrete Lynx Predicate Schema as the next
work item, not to a new architectural abstraction:

| Test | Result |
|---|---|
| Founding Principles consistency | **Pass.** An explicit immutable proposition and domain contract make the asserted settlement meaning inspectable without conflating assertion, authority, execution, or evidence. |
| Primitive burden | **Pass.** A concrete Predicate Schema instantiates the existing non-primitive schema mechanism; it adds no kernel concept. |
| Removability | **Pass.** Removing the Lynx schema removes only that domain assertion, not shared Claim or kernel architecture. |
| Twenty-year durability | **Pass, subject to exact domain evidence.** Content-addressed immutable semantics remain interpretable when the schema and external contract material are retained. |
| Independent implementability | **Pass as a drafting target, conditional on closing the named external facts.** Exact FieldForms, subject constraint, issuer/value domains, identifier comparison, and vectors must be sufficient without private Lynx assumptions. |
| Reduced conceptual complexity | **Pass.** One subordinate schema reuses the four-field body, PSCID, closed subject union, and verification boundary instead of creating a Lynx Claim type, identity, or correlation object. |

No proposed architectural work fails these tests because no architectural
change is proposed. If the concrete domain facts cannot be expressed inside
existing owners, that future evidence must be analyzed before broadening scope.

## 16. Conclusion and cadence

RS-CLM-001 provides sufficient independent evidence that the canonical
four-field `Claim.body` representation is closed for the bounded Draft v0.2
scope. The unimplemented time fields remain a deliberate, explicit limitation;
verification, domain schemas, Rule/Evaluate binding, and Event/Receipt evidence
remain separate work rather than hidden body defects.

```text
VE-CBOR-1 Claim Body Schema Draft v0.2
  -> RS-CLM-001 independent portability evidence
  -> this non-normative Gap Analysis
  -> no RFC
  -> concrete Lynx settlement Predicate Schema, subject to domain evidence
```

**B. CLAIM BODY PORTABILITY IS CLOSED, BUT A DECLARED DRAFT LIMITATION SHOULD BE TRACKED.**

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-11 | Initial non-normative Gap Analysis following merged RS-CLM-001; finds bounded Claim-body portability closed, retains the declared time limitation, and recommends the concrete Lynx settlement Predicate Schema as the next specification. |
