---
id: GAP-ANALYSIS-RS-VERIFY-001-CLAIM-VERIFICATION
title: Gap Analysis for RS-VERIFY-001 Claim Verification
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Analysis
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - RS-VERIFY-001
  - CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - ADR-VERIFY-002
related_documents:
  - GAP-ANALYSIS-RS-LYNX-002-SETTLEMENT-PREDICATE-CLAIM
  - LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS
  - LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - VE-014
  - VE-002
  - VE-004
supersedes: null
superseded_by: null
---

# Gap Analysis for RS-VERIFY-001 Claim Verification

## 1. Authority and bounded question

This document is **non-normative analysis**. It classifies evidence from the
non-normative
[RS-VERIFY-001](../reference-scenarios/RS-VERIFY-001-CLAIM-VERIFICATION-END-TO-END.md)
against current repository authority. It does not modify Claim semantics,
define an evidence-authentication profile, change verification or authorization
rules, create an RFC or ADR, or introduce a primitive.

The bounded question is:

> After RS-VERIFY-001, what is the smallest remaining blocker between a
> cryptographically authentic Claim and a consequential authorization decision
> that can safely rely on it?

The answer must not collapse authorship, factual truth, evidence provenance,
correlation, freshness, Rule evaluation, and authorization into one operation.

## 2. Authority and evidence ledger

| Source | Role in this analysis |
|---|---|
| [Claim Body Schema v0.2](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md) | Draft representation authority for the closed Claim body and its canonical bytes. |
| [Claim Body Ed25519 COSE Sign1 Verification Profile](../specifications/CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE.md) | Draft authority for exact-body authorship verification, the profile-local `VerificationContext` query, and deterministic failure behavior. |
| [ADR-VERIFY-002](../adrs/ADR-VERIFY-002-CLAIM-VERIFICATION-ENVELOPE.md) | Accepted architecture separating semantic Claim body, profile-dispatched verification, and external `VerificationContext`. |
| [Lynx settlement Predicate Schema](../specifications/LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA.md) | Draft authority for the exact occurrence subject, bounded issuer domain, proposition, and value semantics used by the scenario. |
| [Lynx domain-fact closure](LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS.md) | Non-normative evidence about PCRN, sender-side correlation, issuer choice, and candidate settlement surfaces. |
| [RS-LYNX-002 Gap Analysis](GAP-ANALYSIS-RS-LYNX-002-SETTLEMENT-PREDICATE-CLAIM.md) | Prior non-normative classification of the bounded correlation path and the then-open Claim-verification dependency. |
| [VE-CEL-1 Rule/Evaluate Input Contract](../specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md) | Draft downstream owner for CEL-visible established Claims and Rule evaluation. |
| [VE-002](../specifications/VE-002-event-specification.md) and [VE-004](../specifications/VE-004-receipt-specification.md) | Existing downstream owners for authoritative history and terminal-resolution summaries. |
| [VE-014](../specifications/VE-014-execution-right-specification.md) | Draft owner for upstream authorization of an exact Action pair; it is not Claim authorship or settlement evidence. |
| [RS-VERIFY-001](../reference-scenarios/RS-VERIFY-001-CLAIM-VERIFICATION-END-TO-END.md) | Non-normative reproducibility, boundary, and attack-classification evidence. |

Passing vectors and repository validators are evidence. They do not replace
the governing documents.

## 3. What RS-VERIFY-001 proves

Within its bounded fixtures, RS-VERIFY-001 demonstrates that:

1. independent implementations reproduce the exact 206-octet canonical
   `Claim.body` and its diagnostic SHA-256;
2. independent implementations reproduce the exact 243-octet COSE
   `Sig_structure`, 64-octet signature, and 73-octet detached artifact;
3. a supplied local `VerificationContext` can bind the semantic issuer,
   Predicate, verification profile, local applicability context, and permitted
   verification key without putting a key identifier in Claim semantics;
4. successful verification establishes that a permitted key for the recognized
   semantic issuer signed the exact canonical Claim body;
5. wrong body, issuer applicability, key, profile, protected structure,
   signature, and Ed25519 edge cases have deterministic outcomes;
6. the same authorship profile works for two different governed Claim domains;
7. a cryptographically authentic Claim may still assert a false proposition;
8. a cryptographically authentic Claim may rely on fake or unauthenticated
   evidence;
9. authentic evidence for another Action occurrence may be transplanted while
   verification of the signed Claim still passes;
10. replay of the exact Claim and artifact may still verify; and
11. `Verify = PASS` does not imply `Evaluate = ALLOW` or current execution
    admissibility.

The scenario does not prove a live settlement, authenticate a Lynx operational
surface, establish that evidence applies to an Action occurrence, prove issuer
honesty, define freshness policy, or perform a consequential authorization
decision. Those exclusions are boundaries, not defects in signature
verification.

## 4. Layer results

### 4.1 Claim body

**CLOSED FOR CURRENT DRAFT V0.2 SCOPE.**

RS-VERIFY-001 supplies no evidence that the closed four-field body requires a
`claim_id`, `claim_digest`, evidence member, timestamp, nonce, audience, replay
field, correlation field, key identifier, or authorization field. Adding any
of those would mix operational proof or policy into semantic Claim content
without a demonstrated need.

### 4.2 Claim verification

**CLOSED FOR CURRENT DRAFT V0.1 SCOPE.**

The profile closes the signed bytes, domain separation, COSE grammar, pure
Ed25519 acceptance predicate, issuer/key separation, `VerificationContext`
query, deterministic failure taxonomy, domain-neutral reuse, and explicit
exclusion of freshness and replay admission. No additional generic Claim
verification specification is required before proceeding.

### 4.3 VerificationContext

**CLOSED ABSTRACT INTERFACE / DEPLOYMENT DEPENDENCY ONLY.**

An independent verifier is told the exact inputs on which key applicability
depends: semantic issuer identity, verification profile, Predicate/schema when
applicable, local context, and locally permitted keys. Current authority is
sufficient for two implementations to receive the same supplied context and
make the same profile decision.

How deployments provision, discover, rotate, revoke, store, or govern those
bindings remains local. That does not justify a global VE issuer/key registry,
resolver, or new `VerificationContext` semantic primitive. Nor may
`VerificationContext` be treated as proof that a recognized issuer is honest.

## 5. Evidence authenticity is the critical frontier

The missing factual gate has four distinct questions:

| Question | Required determination |
|---|---|
| Source authenticity | Did the evidence originate through the relevant authoritative Lynx or participant-controlled surface? |
| Evidence integrity | Are the examined bytes/data unchanged from that authenticated source? |
| Evidence applicability | Does the evidence concern the exact payment and `ActionOccurrenceReference` asserted by the Claim? |
| Evidence sufficiency | Does the authenticated, applicable evidence establish the bounded participant-level settlement proposition? |

Claim verification answers none of these. A generic evidence abstraction is
not justified because authentication, provenance, identifiers, and sufficiency
depend on the selected operational surface. A deployment may meet the need
through a controlled Adapter/evidence contract. Portable verification would
require a concrete domain-specific evidence-source profile, but only after the
source contract is closed.

### 5.1 Lynx evidence-surface readiness

| Candidate surface | Current result | Profile readiness |
|---|---|---|
| Sender `xsys.002` | Carries PCRN through a participant channel; the retained authenticated delivery context may support exact sender-side correlation. A standalone, redistributable authenticated package is not closed. | **Potentially useful, authentication mechanics not closed.** |
| Lynx `camt.053` | Can carry PCRN and available transaction references in one report context. Exact portable bytes, provenance proof, optional-reference handling, and acceptance rules are not closed. | **Potentially useful, authentication mechanics not closed.** |
| Lynx Web Client | May display settlement/PCRN to an authorized participant, but the repository does not define an authenticated export or portable verification procedure. | **Deployment-specific; not profile-ready.** |
| Swift-delivered material | Channel provenance may be meaningful inside a deployment, but no exact portable artifact, authenticated byte boundary, or verifier procedure is selected. | **Potentially useful only after an exact surface is selected and closed.** |
| Participant internal record derived from an authoritative surface | Can preserve local provenance and correlation under participant controls, but a database record alone is not independently portable evidence. | **Deployment-specific unless separately attested under a closed contract.** |

The fact that a surface contains PCRN is insufficient. Current repository
evidence does not close any candidate's exact authenticated bytes, provenance
method, identifier association, deterministic acceptance rules, and trust
inputs. Therefore no concrete Lynx evidence-authentication profile is ready to
draft.

## 6. Claim verification versus evidence authentication

The architecture correctly preserves two questions:

```text
Claim verification
    Did recognized issuer X cryptographically issue this exact Claim?

Evidence authentication and validation
    Is the underlying factual evidence authentic, applicable, and sufficient
    for the asserted proposition?
```

A future concrete evidence-source contract could feed a trusted Adapter or,
if independent portability is justified, a domain-specific profile. Depending
on the selected source, its result might support issuance of another Claim or
later Event/Receipt content. The current evidence does not justify choosing
such packaging, adding evidence to `Verify`, or creating a generic `Evidence`
primitive.

## 7. Issuer honesty and false signed Claims

`recognized issuer` is not equivalent to `truthful issuer`.

A recognized participant can sign a false Claim and correctly receive
`Verify = PASS`. If authenticated evidence is available, evidence validation
must reject or fail to establish the proposition. Trust and issuer-governance
policy may separately disallow or penalize the issuer. Rule/Evaluate may deny
use of a Claim whose evidence or issuer policy is insufficient. External audit
and accountability may address dishonest issuance after the fact. Where no
evidence is available, runtime verification can establish authorship but cannot
manufacture factual truth.

`VerificationContext` selects permitted verification keys. It must not be
expanded into an oracle for honesty, factual truth, or settlement provenance.

## 8. Evidence-to-Claim binding

For the bounded route, a trusted participant-controlled Adapter may establish
the relationship procedurally by retaining:

```text
ActionOccurrenceReference
    -> submission state
    -> admitted pacs.008
    -> retained sender-side identifiers
    -> authenticated settlement surface
    -> PCRN
    -> issued settlement Claim
```

That is sufficient inside a governed deployment and does not require a generic
Correlation primitive or cryptographic evidence member inside `Claim.body`.

Portable independent rejection of the transplant attack requires a selected
evidence surface whose authenticated data deterministically associates the
settlement result with identifiers traceable to the exact occurrence. Whether
the eventual mechanism directly covers `Claim.body`, supplies an
Adapter-verifiable source record, or supports a separately issued Claim cannot
be decided before those domain facts are closed. It need not automatically
bind every one of evidence, Claim body, Predicate, issuer, and occurrence in a
single new envelope.

## 9. Replay and freshness

**DOWNSTREAM DEPLOYMENT / RULE-EVALUATE POLICY; NO CURRENT GAP.**

Exact replay correctly produces `Verify = PASS` because the authorship proof
and body are unchanged. Freshness, duplicate admission, idempotency, and
current authorization are separate policy or state questions. No current VE
scenario demonstrates a generic need for Claim timestamps, nonces, expiry,
audience, challenges, mutable Claims, or replay tokens. Replay therefore does
not reopen Claim semantics, the verification profile, or architecture.

## 10. Rule/Evaluate frontier

Rule/Evaluate can consume an established Claim abstractly through the existing
four semantic fields and can still deny after verification succeeds. Exact CEL
conversion, collection ordering, verified/unverified eligibility, and
issuer/Predicate applicability remain **RULE/EVALUATE DEPENDENCIES**.

They are downstream work, but not the smallest current blocker to safely
relying on the factual basis of the Lynx settlement Claim. Defining conversion
cannot authenticate settlement evidence or detect a transplanted source.

## 11. Event and Receipt frontier

Event and Receipt remain downstream owners for history and terminal-resolution
summaries. A future Receipt might package an Action occurrence, authorization
outcome, established Claims, result, or evidence references, and an Event might
record relevant facts. RS-VERIFY-001 does not demonstrate a present portable
packaging requirement. Beginning either representation now would not close the
evidence-source authenticity and applicability boundary.

Classification: **EVENT/RECEIPT DEPENDENCY, NOT CURRENT BLOCKER.**

## 12. Execution Right relationship

Execution Right remains upstream authorization for an exact Action pair. The
settlement Claim's `ActionOccurrenceReference` already carries the occurrence
and content identities needed for semantic correlation. Claim.body and its
verification artifact do not need a new link to an Execution Right.
Authorization history, current admission, execution, and durable outcome
belong to their existing owners.

Classification: **CLOSED UPSTREAM BOUNDARY; NO RELINK REQUIRED.**

## 13. Attack matrix

| Attack | Current rejecting or classifying owner | Missing future owner, if any | New specification required now? |
|---|---|---|---|
| 1. Valid signed false Claim | Claim verification returns authorship `PASS`; evidence validation, trust policy, Rule/Evaluate, or audit determines factual usability. | A portable factual decision needs a closed evidence-source contract. | **No. Domain facts first.** |
| 2. Valid signed Claim backed by fake evidence | Evidence authentication/integrity validation. | Exact Lynx source authenticator and acceptance contract, if portable verification is required. | **No. Domain facts first.** |
| 3. Valid signed Claim backed by authentic evidence for another occurrence | Adapter/evidence applicability and correlation. | A portable evidence-source contract must expose the identifiers needed to test the occurrence association. | **No. Domain facts first.** |
| 4. Authentic evidence but unsigned Claim | Claim verification eligibility/profile. | None; sign under the existing profile or do not treat it as a verified Claim. | **No.** |
| 5. Authentic evidence plus Claim signed by unrecognized key | Existing `VerificationContext` plus Claim profile returns `NO_APPLICABLE_VERIFIER`. | None. | **No.** |
| 6. Authentic evidence plus recognized signature plus stale/replayed Claim | Downstream freshness/admission policy, Rule/Evaluate, or deployment state; authorship remains valid. | None demonstrated generically. | **No.** |
| 7. Verified Claim with wrong Predicate for a Rule | Rule/Evaluate applicability policy. | Exact Rule/CEL eligibility work remains downstream. | **Not this workstream.** |
| 8. Verified Claim from issuer not allowed by policy | Rule/Evaluate or local trust/authorization policy; verification only establishes the recognized signer under its supplied context. | None in Claim verification. | **No.** |
| 9. Valid evidence and authorship but Rule denies | Rule/Evaluate. | None; denial is an ordinary result. | **No.** |
| 10. Participant signs without retaining evidence | Participant evidence governance, audit, and accountability. | A selected evidence-source retention/validation contract if portable proof is required. | **No. Domain facts first.** |
| 11. Adapter lies about evidence correlation | Adapter governance and evidence audit; independently authenticated source data may expose the lie. | Portable detection depends on a closed source and occurrence-association rule. | **No. Domain facts first.** |
| 12. Two implementations receive the same evidence but disagree whether it establishes the proposition | No exact portable evidence-source acceptance contract currently owns the comparison. | Concrete domain-specific evidence-source profile, but only after source facts close. | **Not yet; this is the interoperability frontier.** |

All 12 classifications preserve the distinction between Claim authorship,
evidence truth, correlation, policy, and authorization. The only consequential
cross-implementation frontier shown is row 12, and the inputs needed to specify
it are not yet authoritative.

## 14. Gap taxonomy

| Issue | Classification | Consequence |
|---|---|---|
| Claim.body representation | **CLOSED** | Closed for current Draft v0.2 scope. |
| Claim authorship verification | **CLOSED** | Closed for current Draft v0.1 scope. |
| VerificationContext abstract interface | **CLOSED** | Concrete provisioning is a **DEPLOYMENT DEPENDENCY** only. |
| Lynx evidence source and authenticator | **DOMAIN-SPECIFIC DEPENDENCY** and **EVIDENCE/AUTHENTICATION DEPENDENCY** | Exact source facts must close before a portable profile can be written. |
| Bounded Adapter correlation | **CLOSED FOR THE FIXTURE / DEPLOYMENT DEPENDENCY** | Portable independent transplant rejection awaits evidence-source closure; no generic Correlation gap exists. |
| Issuer honesty | **DEPLOYMENT / GOVERNANCE / RULE-EVALUATE DEPENDENCY** | Recognition does not prove truth. |
| Freshness and replay admission | **DEPLOYMENT / RULE-EVALUATE DEPENDENCY** | No generic missing rule is demonstrated. |
| CEL conversion and Claim eligibility | **RULE/EVALUATE DEPENDENCY** | Downstream, not the current evidence frontier. |
| Event and Receipt packaging | **EVENT/RECEIPT DEPENDENCY, NOT CURRENT BLOCKER** | No immediate interoperability need is shown. |
| Execution Right linkage | **CLOSED UPSTREAM BOUNDARY** | No new Claim link is needed. |
| Kernel architecture | **NO ARCHITECTURAL GAP** | Existing owners are sufficient. |

## 15. Candidate next work

| Candidate | Result |
|---|---|
| A. Concrete Lynx evidence-authentication profile | Correct possible destination, but premature: exact source, bytes, provenance method, identifiers, association, acceptance semantics, and trust inputs are not closed. |
| B. Generic evidence-authentication profile | Rejected. It would generalize before one concrete evidence contract is understood and risks inventing a generic `Evidence` primitive. |
| C. Rule/Evaluate portable Claim conversion or eligibility | Legitimate downstream work, but it cannot establish factual evidence and is not the smallest current blocker. |
| D. VerificationContext profile/schema | Rejected. The abstract query is closed; provisioning remains local. A global registry or resolver is neither required nor justified. |
| E. Receipt representation | Premature. Packaging outcomes does not authenticate the settlement source. |
| F. Event representation | Premature. Recording a fact does not establish its source authenticity or applicability. |
| G. Replay/freshness specification | Rejected for now. No scenario demonstrates a generic cross-domain freshness requirement. |
| H. No specification yet; more authoritative domain evidence required | **Selected.** Close the Lynx evidence-source domain facts before deciding whether or how to specify a concrete profile. |

## 16. Evidence-profile readiness test

| Required fact | Current state |
|---|---|
| Exact evidence surface | **OPEN.** Several candidates exist; none is selected as the portable source. |
| Exact authenticated bytes/data | **OPEN.** Channel messages, report blocks, UI data, and internal records expose different boundaries. |
| Provenance/authentication method | **OPEN.** Operational channel trust is plausible but no portable procedure is fixed. |
| Relevant identifiers | **PARTIAL.** PCRN, `InstrId`, UETR, and retained Adapter state are known, but availability differs by surface. |
| Exact link to payment/Action occurrence | **OPEN FOR PORTABLE USE.** The bounded Adapter can retain it procedurally; an independent source rule is not closed. |
| Deterministic acceptance/rejection | **OPEN.** No portable evidence-source taxonomy or sufficiency rule exists. |
| Trust/context requirements | **OPEN FOR THE SOURCE.** Claim `VerificationContext` does not authenticate Lynx evidence. |

Result:

> **NO NEW SPECIFICATION IS YET JUSTIFIED — DOMAIN EVIDENCE CONTRACT MUST BE
> CLOSED FIRST.**

## 17. Governance and primitive pressure

`RFC REQUIRED = NO`.

The recommended next action is non-normative domain-fact closure. Current
evidence requires no change to accepted architecture, Approved specification,
Claim/verification/authorization separation, or existing primitive set. A
later concrete subordinate profile would not automatically require an RFC,
but its governance must be assessed after the source contract is known.

No `Evidence`, `EvidenceEnvelope`, `Correlation`, `TrustContext`, global issuer
or key registry, replay token, authorization token, Claim identity, Event,
Receipt, or ExecutionAttempt primitive is introduced or required by this
analysis.

## 18. Recommended next action

**Perform Lynx evidence-source domain-fact closure first.**

That one bounded non-normative analysis should select and justify the exact
settlement evidence surface; identify the exact authenticated bytes/data,
provenance method, available identifiers, and trust inputs; define the required
association to the exact payment and Action occurrence; and determine whether
deterministic acceptance and rejection can be implemented independently.

Only that evidence can justify or reject a later concrete Lynx
evidence-authentication profile. No specification should be drafted first.

## 19. Architectural Decision Tests

Applied to the recommended Lynx evidence-source domain-fact closure:

| Test | Result |
|---|---|
| 1. Founding Principles consistency | **PASS.** It preserves deterministic boundaries and refuses to equate signature validity with factual truth. |
| 2. Primitive burden | **PASS.** It introduces no primitive and tests whether existing Adapter, Claim, verification, and policy owners suffice. |
| 3. Removability | **PASS.** The non-normative analysis can be removed without changing protocol semantics or persisted artifacts. |
| 4. Twenty-year durability | **PASS.** It seeks durable source/provenance semantics rather than assuming a transient UI, message route, or vendor API. |
| 5. Independent implementability | **PASS AS A GATE.** The work must close exact inputs and outcomes before any profile is considered independently implementable; their present absence is why specification is blocked. |
| 6. Reduced conceptual complexity | **PASS.** One concrete source contract is simpler and more auditable than a premature generic evidence abstraction. |

Result: **6/6 PASS**.

## 20. Final conclusion

**B. CLAIM VERIFICATION IS CLOSED — LYNX EVIDENCE DOMAIN FACTS MUST BE CLOSED BEFORE A PROFILE**

RS-VERIFY-001 closes portable Claim authorship verification for the tested
Draft scopes and demonstrates the boundary that remains. The smallest blocker
to consequential reliance is not another signature, Claim field,
`VerificationContext` schema, Rule conversion, Receipt, Event, or replay
mechanism. It is an exact, authoritative Lynx evidence-source contract from
which independent implementations can determine source authenticity,
integrity, applicability, and sufficiency.

Until those facts are closed, a portable evidence profile would be invented
rather than derived.

## Revision History

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial non-normative Gap Analysis for RS-VERIFY-001, closing Claim verification for current Draft scopes and selecting Lynx evidence-source domain-fact closure as the next action. |
