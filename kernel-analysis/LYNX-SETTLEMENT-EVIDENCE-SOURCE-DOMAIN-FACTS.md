---
id: LYNX-SETTLEMENT-EVIDENCE-SOURCE-DOMAIN-FACTS
title: Lynx Settlement Evidence-Source Domain-Fact Closure
version: "0.1"
status: Draft
document_type: Kernel Analysis
category: Non-normative Analysis
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - GAP-ANALYSIS-RS-VERIFY-001-CLAIM-VERIFICATION
  - LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS
  - LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA
  - CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
related_documents:
  - RS-VERIFY-001
  - RS-LYNX-002
  - GAP-ANALYSIS-RS-LYNX-002-SETTLEMENT-PREDICATE-CLAIM
  - ADR-VERIFY-002
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
supersedes: null
superseded_by: null
---

# Lynx Settlement Evidence-Source Domain-Fact Closure

## 1. Authority and bounded question

This document is **non-normative analysis**. It records current external
domain facts and the limits of the public evidence available for selecting a
portable Lynx settlement evidence-authentication profile. It does not define
an evidence format, verification profile, trust policy, correlation primitive,
RFC, ADR, or change to any specification.

The bounded question is:

> Is there a specific Lynx settlement evidence surface whose semantics,
> representation, provenance, authentication method, trust model, and
> payment/Action correlation are sufficiently closed to support a portable VE
> evidence-authentication profile?

**Answer: no.** Current authority closes settlement meaning and identifies
useful operational surfaces, but does not publicly close an exact persistent
authenticated object, its verifier procedure and trust inputs, and its
portable association to the exact Action occurrence.

The analysis reviewed current materials on 2026-09-12. The selected Action
route targets the published UG2026 core-message release for November 2026;
that future-release target is not represented as already operational.

## 2. Source and authority ledger

| Source | Classification and use |
|---|---|
| [Lynx Rule 1](https://www.payments.ca/sites/default/files/rule_1_interpretation_-_lynx.pdf) | Public in-force normative rule. Defines the PCRN as the Lynx-generated confirmation number identifying a settled Lynx Payment Obligation. |
| [Lynx Rule 6, sections 7-8](https://www.payments.ca/sites/default/files/rule_6_payment_transmission.pdf) | Public in-force normative rule. On settlement, Lynx generates a PCRN and makes it available through the Web Client and TSP-005 routes; the obligation remains final and irrevocable in the rule's receiver-side Swift-authentication-failure case. |
| [Lynx Rule 14, section 6](https://www.payments.ca/sites/default/files/rule_14_claims_and_compensation.pdf) | Public in-force normative rule. For a claim, date and amount plus either PCRN or the sender transaction reference in `InstrId` identify the original payment. This does not make a claim notice a portable settlement proof. |
| [TSP-005](https://www.payments.ca/sites/default/files/tsp-005_Lynx_MX_payment_message_types_and_formats.pdf) | Public in-force normative procedure. Defines the Swift InterAct/Y-copy routes, the 16-character PCRN form, `xsys.002.001.01`, the reporting route, and selected validation behavior. |
| [Payments Canada PCRN explainer](https://www.payments.ca/explainer-lynx-wire-payments-and-payment-confirmation-reference-number) | Public official explanatory material. Confirms that Lynx automatically assigns a unique PCRN only after settlement and distinguishes PCRN from institution-specific references. It does not supersede the rules. |
| [UG2026 pacs.008 specification](https://www.payments.ca/sites/default/files/lynx_fi_to_fi_customer_credit_transfer_pacs.008.pdf) | Public future-release implementation specification dated 2026-03-23. Defines the one-transaction `pacs.008.001.08` route and the `InstrId`, UETR, amount, date, participant, and related fields retained by the Adapter. |
| [UG2026 core-message companion](https://www.payments.ca/sites/default/files/Lynx_ISO_20022_MessageSpecificationCompanionDocumentForCoreMessages.pdf) | Public implementation guideline. States that the Lynx MX Functional Requirements, Participant Requirements, and SwiftNet Partial Y-Copy Companion are also necessary for implementation but available only to Payments Canada Members. It also distinguishes Swift technical headers used for routing and security from the business message. |
| [UG2025 camt.053 specification](https://www.payments.ca/sites/default/files/lynx_bank_to_customer_statement_camt.053.pdf) | Public current reporting implementation specification dated 2025-02-27. Defines `camt.053.001.08`, booked entries, transaction references, and PCRN placement. |
| [Swift InterAct](https://www.swift.com/products/interact) | Public official service description. Establishes XML messaging, CUG control, central validation, delivery status, and copy-service capabilities. It is not a Lynx evidence-profile specification. |
| [Swift ISO 20022 implementation recommendations](https://www2.swift.com/knowledgecentre/rest/v1/publications/stdsmx_rcmdn_impl_iso_20022_msg_best_prac/1.0/stdsmx_rcmdn_impl_iso_20022_msg_best_prac.pdf) | Public official implementation guidance. Describes InterAct Store-and-Forward non-repudiation and message retrieval, including a signature, for 124 days. It does not publish the complete Lynx-specific retained-object contract needed by an independent VE verifier. |
| [Swift Qualified Certificates CPS](https://www.swift.com/swift-resource/17176/download?language=en) | Public official PKI material. Describes SwiftNet PKI, certificate lifecycle, HSM-backed components, and Swift-user scope. It confirms network-specific trust infrastructure rather than a generally provisionable VE trust root. |
| Repository Claim, verification, Predicate, and Action documents | Internal authority for VE semantics and ownership boundaries. They do not define external Lynx or Swift facts. |

The public Lynx rules and TSP are normative for participant operations. The
usage guidelines close message grammar within their declared releases. Swift
service material establishes network capabilities. None of those sources is
promoted into a VE evidence profile by this analysis, and passing examples or
validators would remain evidence rather than authority.

## 3. Decision summary

| Candidate | Classification | Short result |
|---|---|---|
| Sender `xsys.002` | **PARTIAL** | Strong immediate sender-side settlement semantics and PCRN, but the public Lynx corpus does not close a portable retained authenticator, exact signed object, or public mapping from its network request references to the Action's `InstrId`/UETR. |
| Lynx `camt.053` | **PARTIAL** | Strong report-level transaction fields and Payments Canada source identity, but it is an end-of-day account statement, its BAH signature is removed, and no portable authentication package for captured statement bytes is publicly closed. |
| Lynx Web Client | **DEPLOYMENT-SPECIFIC** | Authoritative participant-session visibility of PCRN is useful operationally; no public stable signed export or offline verifier contract is established. |
| Swift-delivered material as a class | **PARTIAL** | Swift supplies authenticated transport and non-repudiation capabilities, but no single Lynx-specific persistent message-plus-authenticator boundary and independent verifier procedure is selected or fully public. |
| Participant internal record | **DEPLOYMENT-SPECIFIC** | Useful retained state, but authenticity depends on participant controls and source provenance; a database record is not independent Lynx proof. |

**Candidate ranking result: E. no portable evidence profile is yet
justified.**

`xsys.002` is the closest semantic event for the bounded sender route.
`camt.053` exposes the clearest public combination of PCRN and original
transaction references. Neither simultaneously closes semantic immediacy,
portable source authentication, exact authenticated bytes, correlation, trust,
and later independent verification.

## 4. Candidate A: sender xsys.002

### 4.1 Semantic event and version

TSP-005 states that Swift generates a Y-Copy Authorization Notification to the
Sending Participant **upon Settlement of the Lynx Payment Obligation**. For the
current Lynx MX procedure the message is:

```text
message type       = xsys.002.001.01
authorization state = AuthstnSts = Authorized
settlement data    = ThirdPartyToSenderInformation contains PCRN
source/delivery    = Swift to the Sending Participant through InterAct Y-copy
```

This is stronger than a submission acknowledgement or queue-admission event.
The word `Authorized` is the copy-service result used after Lynx settlement;
it is not merely verifier-local authorization and must not be generalized
outside this TSP-defined flow.

The public source does not publish a Lynx-specific `xsys.002` usage guideline
or example that closes every element, namespace, technical envelope, or
serialized octet. The generic system message contains request/network
references, but the public Lynx TSP does not state that `InstrId` or UETR is
carried inside `xsys.002`, nor does it state that a particular request
reference equals either business identifier. Their recoverable association is
therefore the participant's retained Swift/Adapter request context, governed
in part by the member-only Partial Y-Copy and participant requirements.

### 4.2 Settlement sufficiency and correlation

Within an authenticated live sender deployment, the following can establish
the bounded participant-level proposition:

```text
retained exact outbound request
  + xsys.002 for that request
  + AuthstnSts = Authorized
  + valid Lynx PCRN in ThirdPartyToSenderInformation
```

The Adapter must retain the exact `(action_id, action_digest)` mapping to the
admitted `pacs.008`, its Swift request/network reference, `InstrId`, UETR,
amount, date, and sending/receiving participants. `InstrId` remains the
strongest current rule-level sender-side correlation reference for this
bounded route; UETR is corroborating. Neither business identifier is publicly
shown as an `xsys.002` field for Lynx, so a verifier must not guess the join.

This evidence establishes Lynx participant-level settlement only. It does not
establish beneficiary credit, customer debit, end-to-end success, absence of a
return, or present execution admissibility.

### 4.3 Authentication and byte boundary

Swift InterAct authenticates and controls the transport context. General Swift
material also describes Store-and-Forward retrieval with a signature that can
be re-verified during a 124-day retrieval period. That is material evidence
that Swift can support non-repudiation; it is not evidence that arbitrary raw
`xsys.002` XML copied from a participant application remains self-verifying.

The public Lynx corpus does not close, for this route:

- the exact retrieved object containing `xsys.002`, technical headers, and
  authentication metadata;
- which exact bytes or digests the Swift signature covers;
- the signature format and complete verification algorithm;
- signer/certificate identity and the Lynx service authorization that must be
  checked;
- historical certificate/status inputs required later;
- export and retention requirements after the Swift retrieval window; or
- whether XML reserialization preserves the covered object.

Raw XML bytes are therefore not a justified authenticated boundary. Parsing
to an XML infoset or extracting selected fields would require a new governed
transformation and would sever any byte signature unless the source contract
explicitly authorizes it. This analysis does not invent XML canonicalization.

### 4.4 Deterministic decision

Two implementations inside the same provisioned participant environment can
process the same authenticated delivery and retained request mapping. Two
independent VE implementations given only captured `xsys.002` XML and the
public documents cannot deterministically decide that the bytes genuinely
came through the Lynx Y-copy service or that they concern the exact Action.

**Result: PARTIAL.** The message is the strongest semantic candidate, but it
is not a publicly closed portable authenticated artifact.

## 5. Candidate B: Lynx camt.053

### 5.1 Semantic event, version, and report character

The current public reporting specification is:

```text
message type       = camt.053.001.08
usage release      = Lynx_Final_ReportingMessages_UG2025
guideline date     = 2025-02-27
message role       = end-of-day bank-to-customer statement
delivery           = Lynx MX CUG, outside the copy service
sender             = Payments Canada BIC CPAACA22
participant use    = optional
```

It is an account/reporting artifact, not the immediate Y-copy settlement
notification. One statement may contain many entries, and consolidated or
individual Lynx accounts may be reported. A transaction entry can nevertheless
be payment-level evidence when the exact entry and its transaction details are
selected without ambiguity.

The guideline fixes entry status to `BOOK`. Its transaction references make
`AcctSvcrRef` and `InstrId` mandatory for each applicable transaction detail;
`ClrSysRef` is populated with the original payment's PCRN. UETR is available
when Lynx has it, and the bounded UG2026 `pacs.008` makes UETR mandatory. The
entry also carries amount, booking/value information, and participant/account
context.

There is a release-boundary fact that a future contract must not hide: the
selected outbound core message is UG2026, while the currently published Lynx
reporting specification is UG2025. The current public sources do not yet prove
that an unchanged UG2025 reporting contract will govern every UG2026 payment.

The conjunction of a booked entry, PCRN, exact `InstrId`, expected amount and
date, participant/account direction, and any available exact UETR is
semantically strong for the bounded proposition. Batching does not erase that
meaning, but it makes the evidence object the exact statement plus the exact
transaction entry, not a detached PCRN string or a free-form extraction.

### 5.2 Authentication and byte boundary

TSP-005 identifies the operational sender and CUG route. The public reporting
guideline requires a Business Application Header but expressly removes its
`Sgntr` element. Consequently, the public XML message has no business-header
self-signature on which a portable profile can rely.

Swift delivery may authenticate the channel and may retain network
authentication/non-repudiation material. The public Lynx documents do not
define an exported statement package that binds the exact XML bytes, Swift
technical headers, source BIC, CUG/service identity, and signature metadata for
verification outside that environment. XML permits multiple byte
serializations of the same data; no public Lynx rule selects canonical XML for
later evidence verification. Reserialization cannot be assumed to preserve
transport authentication.

### 5.3 Correlation and deterministic decision

The public transaction fields are better than `xsys.002` for direct business
correlation:

```text
(action_id, action_digest)
  -> retained admitted pacs.008
  -> exact InstrId + corroborating UETR + amount/date/participants
  -> exact camt.053 booked transaction entry
  -> exact PCRN in ClrSysRef
```

An authenticated entry that matches all expected values can reject a payment-B
transplant into a Claim for Action A. The Adapter must still retain the first
two links; neither the report nor PCRN contains a VE Action pair.

Two implementations can parse and compare the public message grammar, reject
an unsupported version or missing required transaction data, and validate the
PCRN form. They cannot, from captured XML and public facts alone, authenticate
the claimed Payments Canada origin or verify the precise persisted network
proof. Nor does the guideline alone define a VE failure taxonomy for ambiguous
entry selection, absent source proof, or unsupported transport evidence.

**Result: PARTIAL.** `camt.053` has the best public field-level correlation,
but remains report-level evidence without a closed portable authenticator.

## 6. Candidate C: Lynx Web Client

Rule 6 and TSP-005 establish that PCRNs for settled obligations are available
to participants through the Lynx Web Client. That makes the UI an authoritative
operational observation surface for an authenticated participant session.

No reviewed public source establishes:

- an export/download format for this exact result;
- stable field and version semantics for such an export;
- a source signature or MAC on exported bytes;
- a session evidence bundle that can be verified later; or
- a procedure by which an independent implementation authenticates a
  screenshot or copied UI value.

Access control authenticates a session, not a screenshot. A screenshot, copied
PCRN, printout, or locally generated PDF is attributable only through local
controls unless a separate closed attestation contract covers it.

**Result: DEPLOYMENT-SPECIFIC.** Useful operationally; unsuitable as a
portable artifact under current public facts.

## 7. Candidate D: Swift-delivered material as a class

Swift is the network and message-service provider for the examined routes.
InterAct provides CUG control, validation, routing/security headers, delivery
status, and copy processing. SwiftNet PKI and service-specific signing support
authentication, integrity, and non-repudiation. General public guidance says a
participant can retrieve a Store-and-Forward message with its signature for
124 days and re-verify it.

That establishes **authenticated transport and network proof capability**. It
does not by itself select a **portable authenticated artifact**. The latter
would require a profile to pin one exact retrieved object, signature format,
covered data, algorithm, certificate chain/status rules, service/CUG
authorization, time/version interpretation, and historical retention model.
The current public Lynx materials do not provide that complete contract, and
the companion explicitly identifies necessary member-only Partial Y-Copy,
functional, and participant requirements.

The trust model is Swift-network-specific and Payments-Canada-service-specific:
Swift operates the PKI/network layer, Payments Canada operates Lynx and its
service rules, and the participant is provisioned into the relevant CUG and
local interface. Those trust inputs are not equivalent to the existing Claim
`VerificationContext` and must not be converted into a VE global registry.

**Result: PARTIAL.** A participant deployment can authenticate transport; an
independent external verifier lacks a public, exact, durable proof contract.

The receiver-forwarded `pacs.008` is not a better candidate for this bounded
sender-issued Claim. TSP-005 places the same PCRN in the receiver-side Swift
request header, but the receiver does not thereby acquire the sender's private
Action-to-submission mapping. The UG2026 business-header `Sgntr` is removed,
and Rule 6 expressly preserves Lynx finality in its receiver-side Swift
authentication-failure case. The forwarded payment is useful receiver evidence
inside its transport context, not a self-sufficient portable proof for the
sender's exact Action occurrence. **Result: UNSUITABLE for this bounded route.**

## 8. Candidate E: participant internal record

A participant database or Adapter record can retain:

- the exact Action pair;
- the canonical Action and admitted `pacs.008`;
- Swift request/network identifiers;
- `InstrId`, UETR, amount, date, and participant identities;
- the received `xsys.002` or `camt.053` record and PCRN;
- source-verification results and audit metadata; and
- the issued settlement Claim and its verification artifact.

This is the best operational correlation state for the bounded sender route.
It is still derived local state. Database integrity, access control, audit
logs, backups, and retained network evidence are deployment concerns. Another
implementation cannot infer that a row genuinely came from Lynx without the
underlying authenticated provenance or a separately trusted attestation.

**Result: DEPLOYMENT-SPECIFIC.** It is suitable for a controlled Adapter and
audit trail, not as authoritative external evidence by itself.

## 9. Authenticity and sufficiency remain independent

The evidence gate has two independent predicates:

```text
AUTHENTICITY
  This exact artifact came from the claimed source through the applicable
  authenticated service and has not changed.

SUFFICIENCY
  This authentic artifact establishes participant-level Lynx settlement for
  the exact payment correlated to this Action occurrence.
```

A genuinely Swift-delivered message may be a refusal, concern another payment,
use an unsupported version, omit the required settlement data, or be
insufficient for the bounded proposition. Conversely, XML containing a perfect
`Authorized` value, PCRN, and matching identifiers is insufficient when its
source is unauthenticated.

For `xsys.002`, sufficiency requires the exact authenticated request
association plus `Authorized` and PCRN. For `camt.053`, sufficiency requires an
unambiguous booked transaction entry with PCRN and exact retained correlation
fields. Neither predicate can substitute for the other.

## 10. Action correlation and transplant resistance

The bounded correlation chain remains:

```text
ActionOccurrenceReference { action_id, action_digest }
  -> Adapter submission state
  -> exact admitted UG2026 pacs.008
  -> retained InstrId plus corroborating UETR
  -> authenticated, versioned settlement surface
  -> exact surface-specific payment association
  -> PCRN
  -> settlement Claim
```

`action_id != action_digest`. Neither is equal to `InstrId`, UETR, a Swift
request reference, or PCRN. No public rule guarantees that every settlement
surface exposes all of those identifiers. The authenticated surface determines
which association can be checked, and the Adapter may retain multiple exact
identifiers without a generic Correlation primitive.

To reject authentic evidence for payment B presented with a Claim for Action
A, a verifier needs:

1. the expected exact Action pair and retained admitted request;
2. exact expected `InstrId`, UETR, amount/date, and participant facts;
3. authenticated evidence fields or authenticated network association for the
   observed payment; and
4. exact equality at every available governed link, with no guessed fallback.

The `camt.053` path can expose these business fields directly. The `xsys.002`
path depends more heavily on retained request/network association. Today only
a participant-controlled Adapter with its provisioned Swift context is shown
to possess the whole chain. A third-party verifier receiving only a Claim and
raw evidence XML cannot independently reject the transplant.

## 11. Trust, persistence, and later verification

| Later verifier | Current capability |
|---|---|
| Another process in the same participant | Can rely on retained authenticated-message records, local Swift interface results, Adapter mappings, and participant controls when those are governed locally. |
| Another implementation for the same participant | Can reproduce parsing and comparisons if supplied the same versioned messages and local trust/provenance records; portable verification of the source proof is not publicly specified. |
| Auditor with participant access | Can inspect Swift retrieval/audit material and Adapter records subject to the participant's service entitlements, retention, and procedures. This is controlled audit, not a public VE verifier contract. |
| Another VE implementation outside the deployment | Cannot authenticate raw XML or local records from public facts alone. |
| External relying party | Can verify a participant-signed Claim under an applicable trust policy, but that proves participant authorship rather than independent Lynx source truth. |

Material that a deployment would need to retain includes the original
versioned message/envelope, all authentication and delivery metadata, the
Swift signature or verification record where available, certificate and
historical validation inputs, service/CUG identity, exact outbound request and
network references, business identifiers, PCRN, and the Action mapping.
Relying on transient session state or retaining only parsed fields is
insufficient for independent later source verification.

## 12. Version closure

A future profile could not use an implicit `latest`. At minimum it would need
to pin:

| Layer | Required identity |
|---|---|
| Outbound payment | `pacs.008.001.08`, `Lynx_Final_CoreMessages_UG2026`, guideline dated 2026-03-23, November 2026 release target, `head.001.001.02`, and applicable `paymentscanada.lynx` service/subtype. |
| Sender notification candidate | `xsys.002.001.01`, the effective TSP-005 edition, exact Lynx Partial Y-Copy service/profile version, and the governing member requirements. |
| Reporting candidate | `camt.053.001.08`, `Lynx_Final_ReportingMessages_UG2025`, guideline dated 2025-02-27, `head.001.001.02`, and the effective TSP-005/CUG delivery contract. Any UG2026 reporting compatibility must be explicitly established. |
| Authentication | Exact Swift message/envelope and signature format, covered data, algorithm, certificate/trust profile, status/time policy, and retention/export procedure. |
| VE interpretation | A distinct evidence-profile identifier defining extraction, correlation, sufficiency, and failure behavior without changing Lynx semantics. |

The business message versions are known. The Lynx-specific authenticated
artifact and verifier version identities are not publicly closed.

## 13. Deterministic acceptance and rejection pressure test

| Case | `xsys.002` from public facts | `camt.053` from public facts |
|---|---|---|
| Valid authentic settlement evidence | Deterministic only inside the provisioned Swift/Adapter context; no portable proof package is pinned. | Deterministic only inside the provisioned delivery/audit context; captured XML lacks a self-contained authenticator. |
| Malformed evidence | XML/schema and required-field rejection can be defined after exact schema acquisition; no complete public Lynx `xsys.002` profile is supplied. | Public grammar supports structural rejection, but duplicate/serialization and authenticated-envelope handling still need a profile. |
| Evidence from wrong source | Requires exact Swift signer/service/CUG trust validation not closed for a public VE verifier. | Requires exact network provenance and Payments Canada service/sender validation not closed for a captured file. |
| Valid evidence for wrong payment | Rejectable using retained request association; public `xsys.002` does not expose a complete business-field join. | Rejectable by exact transaction-entry fields plus retained Adapter mapping. |
| Valid evidence for wrong Action occurrence | Requires the deployment's Action-to-request mapping. | Requires the deployment's Action-to-`InstrId`/UETR mapping. |
| Missing PCRN | Reject as insufficient for the bounded proposition. | Reject the entry as insufficient for this proposition. |
| Altered evidence | Detectable by live/retrieved Swift authentication only when the exact covered object and verifier material are preserved. Raw copied XML is not enough. | Same; the BAH `Sgntr` is removed, so raw copied XML is not self-authenticating. |
| Unsupported version | Message/schema version can be rejected; service/profile-version rules remain unpinned. | Message/UG version can be rejected; authentication-package version rules remain unpinned. |
| Unauthenticated captured bytes | Reject or return not established; never accept from syntax and plausible identifiers alone. | Reject or return not established; never accept from syntax and plausible identifiers alone. |

This table demonstrates consequential divergence if a profile were written
now. One implementation could accept XML after schema validation and local
source labeling, while another could require a retained Swift signature and
service context. Both choices are plausible under the public material because
the profile inputs and authenticated boundary have not been selected. The
missing rule is external/domain-specific, not a defect in current VE
architecture.

## 14. Participant attestation option

The Sending Participant could issue another domain Claim stating that it
observed a named source, exact references, PCRN, and correlation to an Action
occurrence, then sign that Claim with the existing Claim verification profile.
This is expressible with current Claim architecture if a governed Predicate
Schema for that proposition is later justified. It needs no generic Evidence
primitive.

Such an attestation proves only that the recognized participant made the exact
statement. It duplicates selected source facts and remains dependent on the
participant's honesty, controls, and auditability. It does not let an external
verifier authenticate the underlying Lynx/Swift artifact. The existing bounded
settlement Claim already provides participant-authored assertion semantics, so
adding a second attestation does not close the independent source-truth gap.

**Participant-attestation result: technically expressible, but not a substitute
for portable Lynx source authentication and not a reason to choose candidate
D.** A deployment trust policy may accept it; VE must not silently equate that
policy choice with independent Lynx proof.

## 15. Architecture ownership

| Concern | Existing owner |
|---|---|
| Settlement, PCRN generation, and system result | External Payments Canada Lynx system and Lynx rules. |
| Swift delivery, network authentication, CUG membership, and retrieval | External Swift service plus participant Swift deployment. |
| Action-to-request mapping and exact occurrence correlation | Adapter and retained participant submission state. |
| Semantic settlement assertion | Existing Lynx settlement Predicate and Claim. |
| Claim authorship over exact body | Existing Claim verification profile. |
| Issuer/key recognition and local acceptability | Existing `VerificationContext`; it does not authenticate Lynx evidence. |
| Evidence-source parsing, authentication, extraction, and sufficiency | Future concrete domain-specific profile only if the external source contract becomes closed; otherwise a deployment Adapter/evidence contract. |
| Trust in Payments Canada/Swift/participant source | Deployment/audit policy with externally provisioned trust roots and service entitlements. |
| Claim eligibility and consequential decision | Rule/Evaluate and surrounding policy. |
| Historical recording or terminal summary | Event and Receipt when independently justified downstream. |

No new `Evidence`, Correlation, Identity, TrustContext, registry, resolver,
receipt, event, or attempt primitive is required by these facts.

## 16. Recommendation, blocker, and governance

**Best candidate: E. no portable evidence profile is yet justified.**

**LYNX EVIDENCE PROFILE READY = NO.**

The smallest exact blocker is:

> No public, versioned Lynx source contract selects an exportable persistent
> artifact and closes the exact authenticated byte/data boundary, Swift
> signature/verifier procedure and trust inputs, and durable association from
> that authenticated object to the exact outbound payment and Action
> occurrence.

The blocker has three inseparable concrete parts:

1. source authentication is currently demonstrated as Swift transport and
   network non-repudiation capability, but the exact Lynx-specific retained
   proof package and verification rules are not public or selected;
2. XML business content has no selected canonical authenticated byte boundary,
   and `camt.053` expressly removes the BAH signature; and
3. complete Action correlation remains participant-local unless the retained
   request association and exact evidence fields are carried into the verifier
   contract.

The minimum next investigation is to obtain and audit the applicable Lynx
Partial Y-Copy/participant requirements and an actual supported Swift export or
retrieval package for `xsys.002`, including its full verification inputs and
request association. If that package closes the missing facts, `xsys.002`
should be reconsidered first. Otherwise, inspect the equivalent authenticated
delivery package for `camt.053`. Do not write a profile around raw XML or
assumed session state.

**RFC REQUIRED = NO.** This analytical closure changes no accepted
architecture or Approved specification. A later concrete subordinate profile
could remain within existing verification architecture if the external facts
close. A new primitive, registry, or collapse of Claim authorship with evidence
truth would require separate evidence and governance, but none is recommended.

## 17. Architectural Decision Tests

Applied to the recommendation to defer a profile and keep the work within
existing owners:

| Test | Result |
|---|---|
| 1. Founding Principles consistency | **PASS.** Intent, authority, execution, and evidence remain distinct; unauthenticated syntax is not elevated to proof. |
| 2. Primitive burden | **PASS.** No generic Evidence, Correlation, trust, identity, registry, or attempt primitive is introduced. |
| 3. Removability | **PASS.** The analysis and future source-specific adapter/profile can be removed without changing Action, Claim, Verify, or Evaluate semantics. |
| 4. Twenty-year durability | **PASS.** Stable settlement meaning is separated from versioned ISO messages, network services, certificates, and retention windows. |
| 5. Independent implementability | **PASS for the recommendation.** Independent teams can reach the same `NOT READY` result from the listed missing inputs; a positive profile would currently fail this test. |
| 6. Reduced conceptual complexity | **PASS.** Deferring an underspecified profile is simpler than inventing XML canonicalization, a global trust registry, or a duplicate participant attestation layer. |

**Architectural Decision Tests: 6/6 PASS.**

## 18. Closure result

The domain-fact review closes the present question negatively but precisely:

```text
settlement semantics and PCRN meaning          = CLOSED
candidate message versions and useful fields  = PARTIALLY CLOSED
bounded participant-local correlation          = CLOSED OPERATIONALLY
portable authenticated byte/data boundary      = OPEN
portable source-authentication verifier         = OPEN
portable trust and persistence contract         = OPEN
independent transplant rejection                = OPEN OUTSIDE PARTICIPANT CONTEXT
portable evidence profile                       = NOT READY
architectural gap                               = NONE
RFC required                                    = NO
```

This is domain-fact closure, not profile construction. The next cadence step is
to acquire and audit the exact external authentication/export contract, not to
create a VE evidence profile from unknowns.

## 19. Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial non-normative domain-fact closure for Lynx settlement evidence-source profile readiness. |
