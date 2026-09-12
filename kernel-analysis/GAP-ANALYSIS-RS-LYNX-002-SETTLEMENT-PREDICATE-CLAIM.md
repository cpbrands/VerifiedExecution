---
id: GAP-ANALYSIS-RS-LYNX-002-SETTLEMENT-PREDICATE-CLAIM
title: Gap Analysis for RS-LYNX-002 Settlement Predicate Claim
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Analysis
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - RS-LYNX-002
  - LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - ADR-VERIFY-002
related_documents:
  - LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
  - VE-CLAIM-REFERENCE-SEMANTICS
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - VE-014
  - VE-004
supersedes: null
superseded_by: null
---

# Gap Analysis for RS-LYNX-002 Settlement Predicate Claim

## 1. Authority and bounded question

This document is **non-normative analysis**. It classifies the evidence from
the non-normative
[RS-LYNX-002](../reference-scenarios/RS-LYNX-002-SETTLEMENT-PREDICATE-CLAIM.md)
against the current repository architecture and specifications. It does not
modify a specification or scenario, define a verification or evidence-source
profile, select a key or trust system, create an RFC or ADR, or introduce a
primitive.

The bounded question is:

> After RS-LYNX-002, what is the smallest remaining blocker to a portable,
> independently verifiable Lynx participant-level settlement Claim?

The question distinguishes verification of a participant's exact assertion
from proof that the participant's underlying settlement observation was true.
Those are related gates, but they are not the same gate.

## 2. Authority and evidence ledger

| Source | Role in this analysis |
|---|---|
| [Lynx settlement Predicate Schema](../specifications/LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA.md) | Draft authority for the exact occurrence subject, bounded Sending Participant issuer domain, participant-level settlement proposition, true-only Boolean value, and PSCID. |
| [Claim Body Schema v0.2](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md) | Draft representation authority for the closed four-field body, imported identities, PSCID, schema-driven values, canonical bytes, and rejection rules. |
| [Claim Reference Semantics](../specifications/VE-CLAIM-REFERENCE-SEMANTICS.md) and [VE-001](../specifications/VE-001-action-specification.md) | Owners of `ActionOccurrenceReference` and the distinction between Action occurrence identity and Action content identity. |
| [Lynx Action Schema](../specifications/LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA.md) | Draft authority for the bounded Action semantics and deterministic outbound `pacs.008` mapping used by the scenario. |
| [Lynx domain-fact closure](LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS.md) | Non-normative evidence for PCRN meaning, sender-side issuer selection, existing correlation identifiers, and candidate settlement surfaces. |
| [ADR-VERIFY-002](../adrs/ADR-VERIFY-002-CLAIM-VERIFICATION-ENVELOPE.md) | Accepted architecture separating semantic `body`, profile-dispatched `verification`, and external `VerificationContext`; it also defines optional generic detached COSE profiles. |
| [VE-CEL-1 Rule/Evaluate Input Contract](../specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md) | Draft downstream owner for the CEL-visible Action and established-Claim collection. |
| [VE-002](../specifications/VE-002-event-specification.md), [VE-003](../specifications/VE-003-lifecycle.md), and [VE-004](../specifications/VE-004-receipt-specification.md) | Existing owners for authoritative history, lifecycle projection, and terminal-resolution summaries. |
| [VE-014](../specifications/VE-014-execution-right-specification.md) | Draft owner for portable authorization of the exact Action pair; it is not Claim verification or settlement evidence. |
| [RS-LYNX-002](../reference-scenarios/RS-LYNX-002-SETTLEMENT-PREDICATE-CLAIM.md) | Non-normative reproducibility and pressure-test evidence. |

Passing vectors and repository validators are evidence. They do not replace
the governing documents.

## 3. What RS-LYNX-002 proves

Within its one bounded sender-issued Lynx settlement route, RS-LYNX-002 proves
that:

1. `(action_id, action_digest)` represents one exact Action occurrence and
   its exact semantic content;
2. two occurrences with identical Action content remain distinct when their
   valid `action_id` values differ;
3. the concrete Lynx participant-level settlement Predicate exists and its
   exact PSCID is independently reproducible;
4. two independent implementations produce and round-trip the same canonical
   206-octet `Claim.body` without semantic loss;
5. `issuer_ref` is semantic Claim content and a different valid issuer value
   changes the semantic body and canonical bytes;
6. Boolean `true` is sufficient for the deliberately narrow proposition that
   the correlated obligation settled in Lynx at participant level;
7. `InstrId`, UETR, PCRN, Adapter state, and settlement-source material remain
   outside Claim semantics;
8. existing Adapter state can retain the Action-to-submission-to-settlement
   association without a generic Correlation primitive;
9. evidence/authentication and correlation failures remain distinguishable
   from Claim-body and Predicate failures; and
10. after verification and trust establishment, Rule/Evaluate receives exactly
    `subject_reference`, `issuer_ref`, `predicate`, and `value`.

The scenario does not prove a live Lynx settlement, establish a portable
settlement-source artifact, instantiate a complete Claim verification
profile, provision an issuer-to-key binding, or prove that every Lynx
participant must accept this Claim.

## 4. Previously open layers

| Layer | Classification | Result |
|---|---|---|
| Action occurrence identity | **CLOSED** | Existing `ActionOccurrenceReference { action_id, action_digest }` is sufficient. A new occurrence or attempt identifier is not required. |
| Adapter correlation | **CLOSED FOR THIS BOUNDED ROUTE** | Retained Adapter state plus the admitted request, sender-side identifiers, authenticated settlement surface, and PCRN can preserve the exact association. |
| Predicate semantics | **CLOSED FOR THIS PROPOSITION** | Exact occurrence, Sending Participant issuer domain, true-only value, and bounded settlement proposition are sufficient. |
| Claim body | **CLOSED FOR CURRENT DRAFT V0.2 SCOPE** | The exact four-field map, canonical bytes, and rejection behavior are reproducible. No fifth field is required. |
| Evidence-source authenticity | **EVIDENCE/AUTHENTICATION DEPENDENCY** | The participant must authenticate and correlate the settlement source before issuing the Claim; no single portable source contract is selected. |
| Claim cryptographic verification | **VERIFICATION DEPENDENCY** | The Claim body is ready for coverage, but RS-LYNX-002 does not instantiate one fully pinned verification construction and vectors. |
| Issuer recognition | **VERIFICATIONCONTEXT DEPENDENCY** | The verifier needs a provisioned binding from the semantic Sending Participant `issuer_ref` to an acceptable verifier/key. |
| Rule/Evaluate | **RULE/EVALUATE DEPENDENCY** | Exact CEL conversion and collection ordering remain downstream; they do not block body or verification-profile construction. |
| Event and Receipt | **EVENT/RECEIPT DEPENDENCY, NOT CURRENT BLOCKER** | They remain possible historical and summary owners, but this scenario does not require their representation to verify the Claim. |
| Time | **DECLARED DRAFT LIMITATION** | Claim-body time remains forbidden in the current bounded profile and is unnecessary for this historical proposition. |
| Architecture | **NO ARCHITECTURAL GAP** | Existing owners can contain every observed requirement. |

No new Claim field, `claim_id`, `claim_digest`, evidence member, timestamp,
Correlation object, attempt identity, or registry is justified.

## 5. Evidence-source authenticity

Evidence authenticity asks:

> Did the settlement observation genuinely come through an authoritative
> Lynx-related source, and did that source associate the PCRN with this exact
> admitted payment?

The repository identifies several candidate surfaces but does not make them
interchangeable:

| Candidate surface | Settlement evidence | Source can be authenticated | Portable evidence artifact | Exact occurrence correlation | Profile-ready conclusion |
|---|---|---|---|---|---|
| Lynx Web Client view | May expose settlement/PCRN to an authorized participant | Controlled session is plausible; exact controls are not specified here | No governed signed export is established | Depends on the displayed/exported association and retained Adapter state | Insufficient public closure to select a portable profile. |
| Sender `xsys.002` settlement notification | Carries sender-side PCRN after settlement | Delivered through the participant's Swift/Lynx channel | Standalone post-session verification package is not established | Requires the authenticated delivery context to associate the notification with the exact outbound request | Suitable for a deployment Adapter contract; portable profile inputs remain unclosed. |
| Receiver forwarded payment/header | Carries settlement-associated PCRN on the receiver route | Delivery context can be authenticated | Isolated copied body/header is not established as portable proof | Does not automatically establish the sender's private Action association | Not the preferred source for this bounded sender-issued Claim. |
| Lynx `camt.053` report | Can carry PCRN and available transaction references in one transaction block | Participant-channel provenance can be authenticated | A redistributable signed report package is not established | Potentially strong when the report supplies a retained `InstrId` or UETR association; optional references must not be guessed | Promising evidence source, but current authority does not close a portable profile. |
| Participant internal record derived from a settlement surface | Records the participant's observation and retained correlation | Integrity depends on participant controls and retained source provenance | A database row alone is not independently portable | Can preserve the exact join if correctly populated | Deployment-specific Adapter/evidence contract unless separately attested. |
| Participant-signed VE Claim | Records the participant's assertion | Yes, under a concrete Claim verification profile and issuer-bound context | Yes | The subject preserves the exact Action occurrence asserted | Portable Claim provenance, but not independent proof of underlying Lynx truth. |

No current authoritative evidence selects one source as the universal
portable settlement proof or exposes the complete verification inputs needed
to standardize it. Therefore this analysis must not invent a Swift, Payments
Canada, XML-signature, report-export, or Web Client evidence format.

The present missing work is split:

- authenticating and retaining the chosen operational source is a
  **deployment-specific Adapter/evidence contract** for the bounded route;
- a future portable evidence artifact, if demanded and supported by an exact
  source contract, would be a **concrete evidence-source profile**; and
- neither is missing generic VE architecture.

## 6. Claim verification

Claim verification asks a different question:

> Did a recognized Sending Participant cryptographically issue this exact
> canonical Claim body under an accepted verification procedure?

The layers remain:

```text
Claim.body
    exact semantic bytes

Claim.verification.artifact
    proof binding those exact bytes

Claim.verification.profile
    artifact, covered-data, algorithm, and verification rules

VerificationContext
    issuer_ref-to-verifier/key recognition and applicability
```

ADR-VERIFY-002 already authorizes the minimal profile-dispatched envelope and
generic detached COSE forms. Its `urn:ve:verify:cose-sign1-detached:1` rules
can cover this canonical body without changing Claim semantics. The
VE-014-specific Ed25519/COSE profile cannot be reused directly because its
object domain, authenticated frame, artifact model, and attester recovery are
Execution-Right-specific.

The repository does not yet provide one subordinate Claim profile that pins,
for this portable conformance path, the complete construction and acceptance
set needed for reproducible end-to-end vectors: exact covered-data framing,
algorithm and key representation/selection mechanics, strict verification
behavior, authenticated signer result, dispatch and failure semantics, and
the interface to `VerificationContext`. The generic ADR profile is applicable
architecture, not an already-instantiated RS-LYNX-002 verification fixture.

[Open Decisions](../OPEN_DECISIONS.md) consistently leaves mandatory algorithms/profiles open and
issuer-key discovery, rotation, and revocation as profile work. The next
profile may therefore be optional and concrete without choosing one mandatory
algorithm for every VE Claim or claiming to close all key lifecycle policy.

The smallest remaining portable artifact work is therefore a **concrete
Claim verification profile** under ADR-VERIFY-002. It must not prove objective
settlement truth, embed the evidence source, or turn the signing key into
`issuer_ref`.

## 7. Issuer recognition and trust

The body value:

```text
issuer_ref = "lynx-sending-participant-A"
```

identifies the asserted semantic issuer under the Predicate Schema. It is not
a verification key, certificate subject, BIC, DID, or global registry entry.

`VerificationContext` must supply or resolve a verifier/key already bound to
that exact semantic issuer for the applicable Predicate, Action route, and
verification profile. Deployment configuration, enterprise PKI, COSE keys,
JWK/JWKS, X.509/PKIX, hardware roots, or another profile-defined source may
back that context. Trust Context/Evaluate separately determines whether that
recognized issuer is acceptable for a Rule or decision.

```text
issuer_ref != verification-key identity
authentication != issuer recognition != trust != authorization
```

This is a **VERIFICATIONCONTEXT DEPENDENCY**, not a Claim-body or Predicate
gap. Nothing in the evidence requires a new global participant or key
registry.

## 8. Correlation authenticity

A malicious or faulty issuer can construct a structurally valid body over the
correct Action pair while borrowing a PCRN or evidence record from another
payment. Canonical Claim bytes and a valid signature cannot detect that lie by
themselves.

Before issuance, the participant-controlled Adapter and surrounding evidence
boundary must protect and validate:

1. the exact `(action_id, action_digest)` retained before result observation;
2. deterministic Action-to-`pacs.008` mapping and admitted request identity;
3. the sender-side identifiers actually emitted for that request;
4. provenance and integrity of the settlement surface; and
5. the surface-specific association from the returned PCRN to that request.

These are existing implementation and evidence-source obligations. A signed
execution record, Event, Receipt, or Execution Right may contribute evidence
in a deployment, but none is required to create a new semantic link for this
scenario. If the selected source cannot establish the association without
guessing, the participant must not issue the Claim.

Classification: **EVIDENCE/AUTHENTICATION DEPENDENCY plus existing
Adapter-correlation implementation obligation; no architectural gap.**

## 9. Relationship to Execution Right

VE-014 authorizes the exact `(action_id, action_digest)` pair and authenticates
that authorization under an Execution-Right-specific profile. The settlement
Claim uses the same Action pair to identify what its proposition concerns.
This is enough to compare the authorized Action with the asserted occurrence.

An Execution Right proves upstream authorization, not execution, settlement,
Claim issuance, or settlement-source authenticity. Its artifact is neither a
Claim verification artifact nor part of Claim semantics. Adding an Execution
Right identifier or proof to `Claim.body` would duplicate the existing Action
binding and conflate authorization with outcome evidence.

Classification: **CLOSED AS AN UPSTREAM AUTHORIZATION BOUNDARY.** No explicit
Execution Right link is required in the settlement Claim.

## 10. Rule/Evaluate readiness

Once the Claim is verified and established under the applicable context,
Rule/Evaluate can consume its existing four semantic fields. RS-LYNX-002 adds
no hidden fifth input and requires no verification metadata, PCRN, UETR,
`InstrId`, or Adapter record in the CEL-visible body.

VE-CEL-1 still owns exact recursive CBOR-to-CEL conversion, pinned CEL
presence/type behavior, claims-collection representation, deterministic list
ordering, and collision handling. Those items may block a final portable
engine binding, but they do not block construction or independent
cryptographic verification of this Boolean Claim.

Classification: **RULE/EVALUATE DEPENDENCY, DOWNSTREAM AND NON-BLOCKING FOR
THE NEXT PROFILE.**

## 11. Event, Lifecycle, and Receipt

### 11.1 Event

The Claim adequately expresses the participant's bounded settlement
proposition. It does not become authoritative Event history. VE-002 already
provides the semantic owner if a deployment records request admission,
external identifiers, observed settlement, or Claim establishment as Events.
A portable Event representation may later improve cross-system audit, but it
is not needed to understand or verify this Claim.

### 11.2 Lifecycle

VE-003 already owns deterministic state progression from authoritative Event
history. A verified settlement Claim may inform a boundary's event decision;
it does not add a lifecycle state or make a transition authoritative by
itself. No new lifecycle semantics are demonstrated.

### 11.3 Receipt

VE-004 is the existing Draft home for a terminal-resolution summary and may
eventually reference Action identity, authoritative Events, execution
evidence, external references, and commit authority. RS-LYNX-002 does not
provide enough portable evidence-source or Event/Receipt representation detail
to define a Lynx Receipt now. Packaging PCRN, the Claim, and execution outcome
inside a Receipt before those owners are closed would be premature.

Classification: **EVENT/RECEIPT DEPENDENCY FOR BROADER PORTABLE HISTORY, NOT
THE IMMEDIATE CLAIM-VERIFICATION BLOCKER.** Lifecycle ownership is already
present.

## 12. PCRN and evidence retention

PCRN remains external settlement evidence/correlation. A deployment should
retain the authenticated source artifact, its delivery context, the exact
request association, and the PCRN for audit according to its applicable
requirements. That retention need not change the Claim proposition.

A later Event or Receipt profile may carry an exact external reference or an
evidence reference if an independently verifiable source format justifies it.
The current evidence does not select among raw source preservation, a signed
participant record, an Event reference, a Receipt field, or a profile-local
evidence attachment. It therefore does not justify a generic Evidence
primitive or putting PCRN in `Claim.body`.

Classification: **DOMAIN-SPECIFIC EVIDENCE-RETENTION DEPENDENCY; NO CLAIM OR
ARCHITECTURAL GAP.**

## 13. Verification versus evidence

The required separation is:

```text
evidence authenticity
= did an authoritative Lynx-related source supply settlement information
  associated with this admitted payment?

Claim verification
= did a recognized Sending Participant cryptographically issue this exact
  Claim.body under the selected profile?
```

A single specification covering both would either make the Claim profile
depend on one unsettled external source format or overstate a participant
signature as Lynx proof. The smaller composition is:

```text
deployment-specific authenticated evidence contract
    -> justified participant assertion
    -> generic Claim envelope plus concrete verification profile
    -> verifier-local issuer/key recognition
```

If future cross-deployment requirements demand independent verification of
the underlying Lynx source itself, that work should be a separate, exact
evidence-source profile grounded in one authoritative export or message
contract. It must not be silently merged into Claim verification.

## 14. Attack-pressure classification

| Attack | Rejecting owner | Required result |
|---|---|---|
| 1. Valid Claim body with fabricated PCRN in the issuer's retained record | Evidence/authentication | Do not issue the Claim; a plausible PCRN string is not authenticated settlement evidence. |
| 2. Valid PCRN taken from a different payment | Adapter/correlation plus evidence/authentication | The source-to-request association fails; never guess or transplant the join. |
| 3. Authentic settlement evidence associated with the wrong `ActionOccurrenceReference` | Adapter/correlation | The exact retained Action-to-request association fails even though both inputs may be valid separately. |
| 4. Valid Claim signature under an unrecognized key | VerificationContext | Cryptographic processing cannot establish an acceptable signer for the asserted issuer. |
| 5. Valid signature under a recognized key bound to a different issuer | VerificationContext | Reject the issuer/key applicability mismatch; key possession does not rewrite `issuer_ref`. |
| 6. Valid issuer and correctly signed Claim, but unauthenticated settlement source | Evidence/authentication | The signature authenticates an unsupported assertion, not the settlement observation; issuance is unjustified. |
| 7. Authentic evidence and valid signature with wrong Predicate PSCID | Claim body / Predicate applicability | Reject the unsupported, malformed, or schema-mismatched Predicate identity before semantic use. |
| 8. Old valid settlement Claim offered for another current Action occurrence | Rule/Evaluate applicability | The old Claim remains about its original occurrence; exact subject comparison prevents its use for the current occurrence. |
| 9. Identical Action content under a different valid `action_id` | Action-reference applicability / Adapter correlation | The second occurrence does not inherit the first occurrence's settlement evidence. |
| 10. Participant signs and issues without obtaining settlement evidence | Evidence/authentication and issuer conformance | Claim verification may authenticate who asserted it but cannot make it true; the issuer violated the evidence precondition. |

The attacks expose no missing body field or identity primitive. They show why
source authenticity, Claim verification, issuer recognition, and evaluation
must remain separate.

## 15. Complete gap taxonomy

| Area | Classification |
|---|---|
| Action identity | **CLOSED** |
| Adapter correlation | **CLOSED FOR THIS BOUNDED ROUTE** |
| Predicate semantics | **CLOSED FOR THIS PROPOSITION** |
| Claim body | **CLOSED FOR CURRENT DRAFT V0.2 SCOPE** |
| Claim time | **DECLARED DRAFT LIMITATION** |
| Lynx evidence source and retention | **DOMAIN-SPECIFIC DEPENDENCY** and **EVIDENCE/AUTHENTICATION DEPENDENCY** |
| Operational Action-to-settlement association | **CLOSED FOR THIS BOUNDED ROUTE**; preserving the retained association remains an ordinary deployment implementation obligation |
| Portable Claim authentication | **VERIFICATION DEPENDENCY** |
| Semantic issuer-to-key recognition | **VERIFICATIONCONTEXT DEPENDENCY** |
| CEL mapping and Claim collection | **RULE/EVALUATE DEPENDENCY** |
| Portable historical packaging | **EVENT/RECEIPT DEPENDENCY**, downstream |
| Accepted architecture | **NO ARCHITECTURAL GAP** |

## 16. RFC decision

```text
RFC REQUIRED = NO
```

The recommended work neither changes accepted architecture nor revises an
Approved specification. ADR-VERIFY-002 already authorizes subordinate
verification profiles and keeps `VerificationContext` external. No new Claim
field, Predicate meaning, primitive, registry, or VE identifier is required.

An RFC would become necessary only if later evidence proves that the existing
Claim envelope and verification/context separation cannot express a required
portable construction. RS-LYNX-002 supplies no such evidence.

## 17. Next specification comparison

| Candidate | Immediate blocker addressed | Readiness | Priority result |
|---|---|---|---|
| A. Concrete Claim verification profile for sender-issued settlement Claims | Exact portable authentication of the canonical Claim body and signer recovery/context interface | Existing envelope, canonical bytes, and accepted profile delegation make it independently draftable and testable now | **NEXT** |
| B. Concrete authenticated settlement-evidence source profile | Independent source proof and exact request/PCRN association | No single authoritative portable source/export and verification contract is selected; deployment contract remains usable | Later, when one exact source is available and demanded |
| C. Event representation | Portable authoritative history | Not required to verify the participant assertion and insufficiently exercised here | Downstream |
| D. Receipt representation | Portable terminal-resolution summary | Premature without closed source and Event/Receipt inputs | Downstream |
| E. Rule/Evaluate CEL conversion | Portable rule-engine binding | Relevant after established Claims are supplied; not the current verification blocker | Downstream |
| F. Time portability | Claim time representation | Declared unsupported and unnecessary for the bounded Claim | Deferred |
| G. Another Predicate Schema | Another domain proposition | Does not close verification of the now-complete settlement Claim | Lower leverage |

Evidence-source authentication is logically required before honest Claim
issuance, but its exact mechanism can remain an explicit deployment contract
and is not yet sufficiently closed for a portable profile. The Claim
verification profile is separable, independently implementable from the
canonical body and synthetic test keys, and immediately supplies portable
provenance for the participant's assertion. It should therefore be specified
first without claiming to verify Lynx truth.

The recommended next specification is:

> **A subordinate concrete Claim verification profile for canonical
> sender-issued settlement Claims under ADR-VERIFY-002.**

The profile should be Claim-object-specific and reusable rather than
Lynx-specific. RS-LYNX-002 supplies its first bounded settlement pressure test;
it does not justify embedding rail semantics in the cryptographic profile.

It should define only the exact signed/verified bytes and domain separation,
artifact syntax, algorithm and key mechanics, authenticated signer output,
`VerificationContext` interface, dispatch/failure behavior, and deterministic
vectors. It must not define settlement evidence semantics, participant trust,
Rule eligibility, authorization, or a registry.

## 18. Architectural Decision Tests

| Test | Result for the recommended profile |
|---|---|
| Founding Principles consistency | **Pass.** The profile makes assertion provenance inspectable while preserving the distinction among intent, evidence, verification, trust, evaluation, authorization, and outcome. |
| Primitive burden | **Pass.** It is a subordinate profile using the existing Claim envelope, VE-CBOR-1 body, verification dispatch, and external context; no primitive is introduced. |
| Removability | **Pass.** A deployment may omit this optional profile or use another governed profile without changing Claim, Predicate, Action, or evidence semantics. |
| Twenty-year durability | **Pass.** Exact object/domain framing, canonical covered bytes, fixed profile interpretation, and retained verification context can preserve historical interpretation without a live global registry. |
| Independent implementability | **Pass.** The canonical body already converges; a profile can use deterministic fixtures to pin artifact parsing, covered data, algorithm acceptance, signer recovery, and failures without live Lynx access. |
| Reduced conceptual complexity | **Pass.** Reusing the accepted Claim envelope and profile dispatch is smaller than embedding evidence, keys, trust, or PCRN in the body or combining source authentication with Claim authentication. |

## 19. Final conclusion

RS-LYNX-002 closes Action occurrence identity, bounded Adapter correlation,
the settlement Predicate, and portable Claim-body representation. Evidence
source authenticity remains a separate deployment or future source-profile
concern. The smallest currently specifiable blocker to portable independent
verification of the participant-issued Claim is one concrete Claim
verification profile under the existing accepted architecture.

**A. CLAIM/PREDICATE/CORRELATION ARE CLOSED — VERIFICATION PROFILE IS NEXT**

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial non-normative Gap Analysis for RS-LYNX-002, separating bounded correlation and evidence-source authenticity from portable Claim verification and recommending the next subordinate profile. |
