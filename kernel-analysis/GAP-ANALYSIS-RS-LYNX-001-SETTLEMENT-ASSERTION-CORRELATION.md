---
id: GAP-ANALYSIS-RS-LYNX-001-SETTLEMENT-ASSERTION-CORRELATION
title: RS-LYNX-001 Settlement Assertion and Action Correlation Gap Analysis
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-10
updated: 2026-09-10
depends_on: []
related_documents:
  - RS-LYNX-001-SUCCESSFUL-LYNX-INTERBANK-SETTLEMENT
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
  - VE-014
  - ADR-VERIFY-002
  - ADR-011
  - VE-CLAIM-REFERENCE-SEMANTICS
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
supersedes: null
superseded_by: null
---

# RS-LYNX-001 Settlement Assertion and Action Correlation Gap Analysis

## 1. Authority, baseline, and bounded question

This is explicitly **non-normative analysis**, not a specification, allocation,
architectural decision, or implementation. Recommendations below have no
conformance authority. Committing or merging this evidence would not change
that status. No predicate identifier, profile identifier, wire format, trust
policy, or new primitive is selected here.

The analysis starts from authoritative `origin/main`:

```text
b1acfb2dd6960d90af96509dcec40a016384129a
```

The branch is
`reconcile/gap-analysis-rs-lynx-001-settlement-correlation-2026-09-10`.
Repository convention places Gap Analyses in `kernel-analysis/`.

The source is the merged, non-normative
[RS-LYNX-001](../reference-scenarios/RS-LYNX-001-SUCCESSFUL-LYNX-INTERBANK-SETTLEMENT.md),
especially §§6–10 and 15. Its settlement step is conditional, not a live Lynx
test. Its Action and Execution Right vectors are not evidence that a payment
settled. This analysis neither reruns a payment nor replaces those vectors.

The question is the minimum portable composition establishing that an external
Lynx obligation P settled, under independently acceptable assertion authority,
for the execution associated with exactly `(action_id, action_digest)`, so
the Execution Boundary can justify an Event, Lifecycle can derive completion,
and a Receipt can summarize the established history.

Customer net credit, general evidence infrastructure, multi-attempt design,
and approval of existing Drafts are outside this analysis.

## 2. Executive finding and four finding classes

**D. EXISTING GENERAL CLAIM REPRESENTATION DEPENDENCY BLOCKS LYNX PORTABILITY**

This is a priority finding, not a claim that fixing Claim bytes alone completes
portable Events or Receipts. Several representation and instantiation tasks
remain under existing owners. No missing Approved architectural rule has been
demonstrated for this single-request composition.

The decisive simplification is that ADR-VERIFY-002 already permits a signed
Claim about an Adapter's authenticated observation. Lynx need not itself sign
a VE artifact. A verifier can recognize a participant/Adapter for both the
observation and its Action/request correlation. That recognition is an
explicit external trust decision, not a consequence of signature validity.

Every unresolved finding below uses one of these classes:

| Class | Meaning |
|---|---|
| A — External availability | Operational information or access not established by the public sources inspected; not evidence that the information does not exist |
| B — Instantiation | Existing semantics permit the needed concrete contract, but no applicable instance is supplied |
| C — Representation | A semantic owner exists, but the needed portable encoding, binding, or verification coverage is incomplete |
| D — Normative architecture | An existing normative semantic rule is insufficient or contradictory and needs architectural revision |

No class-D finding is established here. An existing downstream responsibility
is not automatically an unresolved dependency. In particular replay, atomic
commitment, idempotency, duplicate-transition prevention, and retry safety
remain **EXISTING DOWNSTREAM OWNERSHIP BOUNDARY**.

## 3. Source and authority ledger

Repository sources are evaluated at the baseline commit, not mutable future
main. Their status matters independently of their presence in the repository.

| Source | Status at baseline; relevant ownership |
|---|---|
| [VE-001](../specifications/VE-001-action-specification.md), abstract | Approved v0.2; occurrence/content distinction and cryptographic pair binding for authoritative artifacts whose meaning depends on both |
| [Action representation profile](../specifications/VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE.md) and [Lynx Action schema](../specifications/LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA.md) | Draft v0.1; concrete Action bytes and bounded participant-settlement intent, not settled-obligation evidence |
| [VE-002](../specifications/VE-002-event-specification.md), §§3–5, 11–14, 19 | Approved v0.2; Event facts, ownership, immutable history and event_id; not a complete Event cryptographic representation |
| [VE-003](../specifications/VE-003-lifecycle.md), §§10, 15, 27–28 | Draft v0.1; transition legality, evidentiary Events and non-rewriting retry/compensation boundaries |
| [VE-004](../specifications/VE-004-receipt-specification.md), §§8–12, 19–20 | Draft v0.2; terminal summary, independently established commit authority, state and reference bindings |
| [VE-005](../specifications/VE-005-adapter-specification.md), §§8–10; [VE-006](../specifications/VE-006-execution-boundary-specification.md), §§15–18 | Draft v0.1; external references/observations versus sole Boundary Event authority |
| [Claim Reference Semantics](../specifications/VE-CLAIM-REFERENCE-SEMANTICS.md), §§4–10, 12 | Draft v0.2, fourth form authorized by Accepted RFC-007/ADR-007; closed subject alternatives, not complete serialized Claim references |
| [Claim Body Semantic Field Contract](../specifications/CLAIM-BODY-SEMANTIC-FIELD-CONTRACT.md), §§3–9; [predicate reference semantics](../specifications/CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS.md), §§3–10 | Draft v0.1; field meaning and immutable Predicate Schema selection, not complete Claim bytes |
| [Predicate Schema Semantic Contract](../specifications/PREDICATE-SCHEMA-SEMANTIC-CONTRACT.md), §§3–8, 11 | Approved v1.2; issuer/value/subject/time domains and bounded comparison semantics |
| [Predicate grammar](../specifications/PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR.md), §§1–4; [canonical profile](../specifications/PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE.md); [DIGEST-001](../specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md) | Approved grammar v1.0, profile v1.2, digest specification v0.3; bounded schema-content encoding and PSCID, not universal identity or Claim-body serialization |
| [Claim-body encoding Draft](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md), §§4–12, 15–16 | Draft v0.1; explicitly incomplete portable Claim-body representation |
| [ADR-VERIFY-002](../adrs/ADR-VERIFY-002-CLAIM-VERIFICATION-ENVELOPE.md) | Accepted, profile-limited; Claim verification, issuer/key binding, signed Adapter observations and distinct issuer acceptance |
| [RFC-011](../rfcs/RFC-011-EXECUTION-RIGHT-CORE.md); [ADR-011](../adrs/ADR-011-execution-right-core.md), §§3–5 | Accepted; durable authorization snapshot and current authorized-attester recognition |
| [VE-014](../specifications/VE-014-execution-right-specification.md) and its [verification profile](../specifications/VE-014-ED25519-COSE-SIGN1-VERIFICATION-PROFILE.md) | Draft v0.1; Execution Right authentication, not a Claim signing profile or a settlement assertion |
| [Governance](../SPECIFICATION_GOVERNANCE.md), §§2, 5–7, 12–13; [task register](../SPECIFICATION_TASKS.md); [open decisions](../OPEN_DECISIONS.md) | Governing process and recorded completion work; implementation and evidence do not override Approved text |

Older Claim Drafts refer to then-unresolved Event identity, Predicate Schema
identity, and Action representations. Those are not all current blockers:
Approved VE-002 v0.2, Predicate Schema v1.2/DIGEST-001 v0.3, and the merged
Action representation Draft have since supplied their scoped contracts.
Their existence does not silently fill the remaining Claim-side encoding
choices. Nor does this analysis promote any Draft to Approved.

External sources were inspected on 2026-09-10. The
[official message index](https://www.payments.ca/payment-resources/iso-20022/high-value-payment-system-lynx)
publishes UG2026 core messages and UG2025 reporting. The
[core companion, v1.5](https://www.payments.ca/sites/default/files/Lynx_ISO_20022_MessageSpecificationCompanionDocumentForCoreMessages.pdf),
§1, targets November 2026 and identifies additional participant documentation.
UG2026 is the scenario's selected future target, not a claim that it is already
the operational release on the inspection date. The currently published TSP-005
is effective 2025-11-24. Release-specific transport/application compatibility
still needs confirmation before deployment.

## 4. PCRN: established meaning and limits

[Rule 6 §§7–8](https://www.payments.ca/sites/default/files/rule_6_payment_transmission.pdf)
establishes post-settlement PCRN generation, availability to sending and
receiving participants, and forwarding of the originating payment message to
the receiver. Settlement remains final even in the described receiver-side
Swift authentication-failure case. Submission, queuing, and ordinary network
acknowledgement are therefore not interchangeable with that settlement fact.

[Rule 1](https://www.payments.ca/sites/default/files/rule_1_interpretation_-_lynx.pdf)
defines PCRN as Lynx-generated identification of a settled obligation. The
[Payments Canada PCRN explainer](https://www.payments.ca/explainer-lynx-wire-payments-and-payment-confirmation-reference-number)
describes uniqueness and distinguishes institution-specific transaction
references from PCRN. Neither source establishes a cryptographic proof from
knowledge of the string alone.

The following syntax is from [TSP-005 pp.6–7](https://www.payments.ca/sites/default/files/tsp-005_Lynx_MX_payment_message_types_and_formats.pdf):

| Component | Published representation |
|---|---|
| Transport PCRN | 16 characters, illustrated by `LVTS1A2B3C4D9TR1` |
| Positions 1–4 | Fixed `LVTS` |
| Positions 5–13 | Nine-character alphanumeric settlement-generated core |
| Positions 14–16 | `TR1`/`TR2` mechanism indication |

TSP terminology also calls the core the PCRN. This analysis does not invent a
normalization that equates the core, full transport form, Web Client display,
and reporting value. A future concrete contract needs a verified mapping.

| Question | Finding |
|---|---|
| Assignment authority and trigger | Lynx; actual settlement, not request construction |
| Before settlement | No assigned genuine settlement PCRN is established by the cited rules before settlement; a syntactically plausible string proves nothing |
| One obligation and uniqueness | An identification association is documented; universal lifetime non-reuse, wrap/reset behavior and cross-environment scope are not specified in the inspected public material |
| Bare PCRN sufficient everywhere? | Not demonstrated. A schema-local Lynx domain and exact source representation are needed; whether date/participant/message qualifiers are also necessary remains class A, not permission to invent them |
| Post-finality stability | The historical settled fact persists; a formal identifier-retention/reuse guarantee beyond that fact was not found |
| Cancellation and return | A cancelled uncompleted request does not acquire the settlement fact. A later return is not erasure of original settlement |

[Current Rule 10 §14](https://www.payments.ca/sites/default/files/rule_10_finality_and_return.pdf)
requires a return through a new pacs.004 payment message. Its current amendment
history includes 2026-07-27. This supplies a separate return relationship, not
permission to mutate the original settled fact. No reverse-settlement or PCRN
reuse rule is inferred. Cancellation-specific identity handling and retention
remain external questions outside this successful path.

## 5. Concrete settlement surfaces and independent portability

Source classes: A = Lynx system, B = Payments Canada, C = Swift transport,
D = participant-generated, E = customer-facing information. These are origin
categories, not an interchangeable trust ranking. Mixed origin is explicit.

The TSP-005 transport facts are: sender `xsys.002` carries PCRN in
`ThirdPartyToSenderInformation`; the receiver's forwarded payment Request
Header carries it in `ThirdPartyToReceiverInformation`. Swift generates
`xsys.002` with `AuthstnSts=Authorized` after settlement; `xsys.003` is rejection.
Lynx generates end-of-day camt.053 reports, sent from `CPAACA22`; receiving them
is optional. These are not PCRN fields invented inside the pacs.008 body.
[TSP-005 pp.6–9](https://www.payments.ca/sites/default/files/tsp-005_Lynx_MX_payment_message_types_and_formats.pdf).

| Surface | Origin | Authentication/provenance available or unresolved | Can independent B verify an exported artifact without A's undocumented database? |
|---|---|---|---|
| Web Client settlement/PCRN view | A | Controlled participant access; exact session controls, export format and signed export not established here | Not established; a screenshot/string is not independent source authentication |
| Sender settlement notification | C carrying A settlement information | Swift delivery context; retained authentication coverage and standalone verification procedure need participant/Swift documentation | Operational association demonstrated; portable proof after export not established |
| Receiver payment plus transport header | D payment body + A/C settlement information | Authenticated delivery context is distinct from a Lynx-signed payment body | Not established from an isolated body or copied header |
| Lynx camt.053 statement | A, distributed under B identity over C | System report provenance in participant channel; portable signature/verification package not demonstrated | Contains useful joined references; export authenticity still an external question |
| Other participant downloads/reports | A if genuine system export; otherwise D | No additional specific public export/authentication contract established | External unknown; no claim that such exports do not exist |
| Participant settlement database or payment log | D | Local controls and retained source evidence; a database row alone is not portable verification | No, unless a governed authenticated assertion/export is supplied |
| Participant/Adapter-signed VE Claim | D | Exact body signature under issuer-bound VerificationContext, once representation/profile dependencies are closed | Yes for the participant's assertion, conditional on recognized issuer authority; not a Lynx signature |
| Customer advice or forwarded PCRN | E, possibly derived from D | Channel/source varies; customer-facing wording does not create system authority | Not by itself; no automatic upgrade to settlement proof |
| Payments Canada Lynx Sandbox API | B test interface | Published portal requires organization access; technical page returned HTTP 403 | No production settlement evidence established; sandbox is not proof of a real settled obligation |

The last row is supported by the public
[Lynx Sandbox API page](https://developer.payments.ca/lynx-sandbox-api/apis).
The [developer introduction](https://developer.payments.ca/getting-started)
distinguishes sandbox stub data, authenticated API access, and separately
approved production access. This investigation found no public production
Lynx settlement-proof API contract. That is a bounded access finding, not a
claim that no production interface exists. No login, private API, or bank
session was used.

No inspected source establishes a redistributable Lynx COSE/JWS/XML-signed
settlement assertion with its complete independent verification inputs.
Transport signatures or authenticated sessions may exist without furnishing
that package. TSP validation of incoming signed instructions is not evidence
of a post-settlement Lynx signature. Conversely, absence of a public package
does not prohibit the already-authorized participant-signed observation path.

## 6. Settlement-to-payment correlation: a demonstrated reporting join

The Lynx-specific
[camt.053 UG2025 §§5.98.1 and 5.250.10](https://www.payments.ca/sites/default/files/lynx_bank_to_customer_statement_camt.053.pdf)
places PCRN at:

```text
Statement/Entry/EntryDetails/TransactionDetails/References/ClrSysRef
```

The same transaction References block supplies payment references Lynx holds,
including Instruction ID, EndToEnd ID and UETR. Thus a documented system-report
join exists; this is not an invented participant-local correlation. It does
not promise that every optional reference occurs in every report. Exact
participant availability, retained authenticity, and production examples still
matter. The underlying PDF identifies this as Lynx reporting, not an arbitrary
customer-bank camt.053 message.

There are consequently two demonstrated correlation surfaces: payment plus
settlement-associated delivery header, and joined system-report references.
For the sender notification, public TSP-005 establishes the PCRN channel but
does not supply this analysis with the complete original-request-reference
path and cryptographic export contract for xsys.002. That narrower question
remains open. A deployment could use the documented reporting join instead;
it need not invent missing xsys fields.

An important non-equivalence: pacs.008 body `PmtId/ClrSysRef` is **not** the
Lynx PCRN location. Its UG2026 comment says it is not assigned by Lynx and has
no Lynx settlement-processing relevance. Copying that body field as PCRN would
be an implementation error, not a missing VE primitive.
[pacs.008 UG2026 §5.64.5](https://www.payments.ca/sites/default/files/lynx_fi_to_fi_customer_credit_transfer_pacs.008.pdf).

## 7. Outbound reference candidates and exact Action association

The following compact inventory is from
[pacs.008 UG2026 §§5.48.1, 5.64.1–4](https://www.payments.ca/sites/default/files/lynx_fi_to_fi_customer_credit_transfer_pacs.008.pdf).
Persistence is not a universal uniqueness guarantee.

| Candidate | Assigner/scope | Preservation / settlement-side utility |
|---|---|---|
| MsgId | Instructing party; per instructed party and agreed period; message | Present in forwarded message; no universal report echo established |
| InstrId | Instructing party; point-to-point instruction; mandatory in Lynx | Forwarded instruction; reporting reference when held |
| EndToEndId | Initiator; transaction chain | Unchanged end-to-end, but `NOTPROVIDED` permitted; unsafe as sole unique join |
| TxId | First instructing agent; interbank transaction, agreed uniqueness period | Unchanged interbank; optional, not established as compulsory report join |
| UETR | Payment-transaction UUIDv4; mandatory | End-to-end reference; reporting candidate |

[Swift's UETR explanation](https://www.swift.com/ru/node/310011)
attributes generation to payment originators and preservation to intermediaries.
UETR is a transaction reference, not settlement or VE occurrence identity. No
identifier in this table alone proves the Action that caused submission.

The Adapter can retain the actual outbound reference together with the exact
Action pair, message type/version, and applicable participant/channel context.
This describes required evidentiary association, not a prescribed new record
layout. Comparison with settled-result references also needs validation that
the admitted message actually implements the Action's bounded semantic fields.
Matching an amount alone, a reused local MsgId alone, or a customer-supplied
EndToEndId alone is insufficient evidence of this particular execution.

Business Application Header identity, transport Request Header identity, and
payment-body identity are different surfaces. No equivalence between BizMsgIdr,
MsgId, InstrId, UETR and PCRN is assumed. Additional transport IDs can be retained
where an applicable external contract defines their scope and preservation.
Their exact use is class B/C work after the class-A access questions are closed.

VE-005 §8 already permits Adapter references without replacing Action identity.
VE-003 §15 illustrates `EXTERNAL_REQUEST_IDENTIFIER_RECORDED` as an evidentiary
Event, not necessarily a state transition. VE-002 owns immutable history and
VE-006 owns appending it. This supplies an existing semantic home, not an
already-complete serialized request-correlation Event profile.

The Boundary can record M before the result is known. Later evidence appends
history; it does not replace the Action pair or rewrite the earlier association.
Several references can identify different protocol layers of the same request.
Several actual requests require explicit retained associations and downstream
admission; this analysis does not treat their shared Action ID as attempt
identity. Single Action → single admitted request → single settlement is enough
for the present test. No new retry/attempt dependency is demonstrated here.

## 8. Minimum assertion and issuer authority

The minimum external fact is: **Lynx obligation P settled**. It does not by
itself assert beneficiary credit, Action authorization, Action identity, or a
VE terminal Event. Those additional relationships need their existing owners.

| Possible issuer/observer | What can support the proposition | Separate recognition decision |
|---|---|---|
| Lynx / Payments Canada | Authenticated system assertion with established P association | Whether that authority and proof are accepted for this bounded effect |
| Sending participant | Authenticated settlement observation plus its actual outbound record | Whether it is accepted for both observation and request/Action correlation |
| Receiving participant | Authenticated received settlement association | Whether accepted for settlement; sender-side Action correlation is not automatically within its knowledge |
| Participant-controlled Adapter | Controlled observation and submission association retained in its execution context | Whether its semantic issuer and key binding are recognized for these specific assertions |

ADR-VERIFY-002 explicitly separates VerificationContext's issuer-to-verifier
binding from Evaluate/governance acceptance. Existing Trust Context semantics
are an environmental authority input, not a new `TrustContext` object inside
the Claim. A raw public key or successful signature is not a semantic issuer
identity or Root Authority by itself.

Portable evidence can therefore begin at a participant/Adapter-signed Claim.
It proves that the authenticated issuer made the bound assertion. It does not
prove objective truth without trust assumptions, and it does not prove Lynx
signed the observation. This is permitted by ADR-VERIFY-002's Portable claims
section and consistent with inspectable evidence under the Founding Principles:
provenance, asserted meaning and the source of recognition remain explicit.

No existing rule found here requires an independent second observer when one
recognized issuer legitimately covers both correlation and observation. If a
verifier's policy requires direct Lynx attestation or split authorities, that
is a different acceptance condition. The one-Claim route cannot silently meet
that stronger condition.

## 9. Three compositions and the one-Claim minimum

These are analytical semantic sketches, not predicate definitions, wire
formats, or allocated names. `A`, `M`, and `P` below are explanatory variables.

| Model | Existing expression | Result / limitation |
|---|---|---|
| A: one Action-subject Claim | `ActionOccurrenceReference { action_id, action_digest }`; schema-defined assertion/value binds the corresponding settled external P and submission association | Smallest when one recognized issuer covers both facts; semantic expression available, concrete schema and Claim encoding absent |
| B: external-subject settlement plus correlation Claim | `ExternalSubjectReference { identifier }` for settled P with applicable subject_domain; separate Action-occurrence-subject Claim binds the same external P | Useful only when distinct authorities require separate assertions; more joins and cross-schema domain-equality obligations |
| C: Event/external-reference composition | Boundary records outbound M; verified external-subject Claim establishes P; Boundary joins existing history and result | Existing semantic owners; needs concrete reference and Event integrity representation in addition to Claim bytes |

The closed Claim subject union has four alternatives, including
ActionContentReference and EventReference. Model A uses just one alternative.
Model B does not combine Action and external subject into an arbitrary fifth
form. Its external identifier in the correlation value has schema-defined
meaning; equality across schemas cannot be inferred merely from identical
strings. Shared resolved subject-domain semantics are needed where external
subjects are compared. Model C does not turn an external message into an Event
without Boundary interpretation.

The smallest candidate composition is:

```text
existing Action occurrence/content pair
  → Adapter's recorded association to the actual admitted request M
  → authenticated observation linking that request to settled obligation P
  → one signed Claim about that exact Action occurrence and bounded settlement
  → Verify establishes issuer-bound provenance/integrity
  → verifier independently recognizes issuer for observation AND correlation
  → Boundary establishes the fact and appends EXECUTION_COMPLETED
  → existing Lifecycle projection yields COMPLETED
  → Receipt summarizes only the history/commit facts it can actually establish
```

The middle Claim is not shorthand for blind acceptance of the Adapter's local
database. Its semantic proposition includes the asserted correlation; the
recognized issuer takes responsibility for that fact, supported by retained
submission and source observations. Another verifier can authenticate the
same asserted binding once the body/profile are closed. A verifier requiring
independent reconstruction of the external join also needs the authenticated
underlying materials; one signature does not magically supply them.

This choice eliminates a separate correlation Claim only when authority scope
permits it. It eliminates neither provenance, exact external-subject meaning,
nor Action pair binding. No independent Correlation object is needed.

## 10. Predicate Schema capability and its bounded portability

The existing Predicate Schema contracts can assign proposition-specific value
semantics, issuer-domain meaning, allowed subjects, optional time semantics,
and external identifier normalization/equality. Closed records can express
the structured evidence values; a Boolean alone would not supply their
external association. This supports concrete subordinate schema work without
automatically requiring a new architectural concept.

Semantic expressibility is not proof that an unwritten Lynx schema is already
portable-profile-valid. The Approved field grammar is bounded. Every relevant
normalization, validation and interpretation dependency needs to fit its
declared portable subset; unsupported rules cannot be hidden in an annotation,
opaque semantic descriptor, URL, resolver, or ungoverned metadata channel.
The eventual schema needs its own conformance and external-identifier review.
This analysis chooses no concrete predicate name or finished domain contract.

For Model A, `subject_domain` does not redefine Action identity: it concerns
only ExternalSubjectReference. For Model B it is required, resolved, supported,
and consistent with allowed subjects. Issuer-domain semantics do not establish
issuer trust. These distinctions are already present in the current Approved
Predicate Schema contract; neither a new subject variant nor a general identity
registry is necessary for the proposed composition.

## 11. Existing general Claim representation dependency

The Claim-body encoding Draft remains expressly incomplete (§§12, 16). This is
the first shared portable-artifact bottleneck for the selected one-Claim path.
Signing a locally invented body does not close it for independent teams.

Current closure and remaining work are distinct:

| Area | Available now | Remaining concrete work |
|---|---|---|
| Action pair | VE-001 semantics and selected Draft canonical bstr(32) values | Claim-side embedding/discrimination and exact covered body |
| Event subject | Approved event_id representation | Claim reference encoding, not another Event identity decision |
| Predicate identity | Approved bounded schema encoding and PSCID construction | Exact adoption/embedding in the selected complete Claim-body profile |
| Issuer/value/time | Semantic field contracts; Approved bounded field grammar | Runtime Claim-field encoding, validation, omission/presence and applicable domain binding |
| Subject union | Four closed semantic alternatives | Unambiguous canonical serialized discrimination and rejection |
| Profile applicability | Explicit verification dispatch and external context architecture | Exact Claim-body/profile version applicability, without ungoverned guessing or a registry |

The recommendation is to complete a **bounded** portable profile in the existing
`VE-CBOR-1-CLAIM-BODY-SCHEMA.md` Draft, reconciling its stale dependency notes
against the current sources. It need not solve all future domains, a universal
time system, all CEL projection, key discovery, or RFC-005's generic digest
infrastructure. Unsupported cases can remain explicitly outside its scope.
The selected supported subset must nonetheless be complete enough to produce
the same signed Claim-body bytes and interpretation independently.

This is existing cross-cutting representation work (`SPEC-CBOR-001/002/003`),
prioritized by Lynx rather than duplicated as a Lynx-owned Claim envelope.
The Approved Predicate Schema and DIGEST-001 work is reused, not generalized
to Action, Event, or Claim content identity. No Claim digest primitive is
recommended. No broad RFC-005 acceptance is a prerequisite merely for filling
already-owned representations.

### 11.1 Existing Claim-body model and bounded time applicability

The following records existing source contracts, not new Claim semantics.
[Claim Body Semantic Field Contract §§1, 4, 6–9](../specifications/CLAIM-BODY-SEMANTIC-FIELD-CONTRACT.md)
and [VE-CBOR-1 Claim Body Schema §4](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md)
record this six-field abstract body; both documents remain Draft:

| Existing field | Abstract presence | Existing semantic owner / meaning |
|---|---|---|
| `subject_reference` | Required | Claim Reference Semantics owns the closed subject alternatives and their equality. |
| `issuer_ref` | Required | Semantic issuer under the Predicate Schema's issuer domain; not verification-key identity and not a source of trust. |
| `predicate` | Required | Existing immutable Predicate Schema content identity, using current DIGEST-001 / PSCID semantics. |
| `value` | Required | Meaning, validation and equality are Predicate Schema-defined. |
| `assertion_time` | Optional in the abstract contract | Schema-governed assertion time; applicability may forbid it. |
| `observation_time` | Optional in the abstract contract | Schema-governed observation time; applicability may forbid it. |

Current [Claim Reference Semantics v0.2 §§4–6](../specifications/VE-CLAIM-REFERENCE-SEMANTICS.md)
already includes ActionContentReference, ActionOccurrenceReference,
EventReference and ExternalSubjectReference. No fifth alternative or redesign
is proposed. [DIGEST-001 §§5–6](../specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md)
already defines portable Predicate Schema identity; its Claim-side embedding
remains representation work, not a new predicate string or namespace.

Verification information is outside the body in the existing
[ADR-VERIFY-002 envelope](../adrs/ADR-VERIFY-002-CLAIM-VERIFICATION-ENVELOPE.md):

```text
Claim {
  body,
  verification {
    profile,
    artifact
  }
}
```

The narrower current time result is explicit in
[Approved Predicate Schema Canonical Representation Profile v1.2 §12](../specifications/PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE.md#12-time-semantics-portable-boundary):
the supported bounded subset omits `time_semantics`, which means
`assertion_time` is forbidden and `observation_time` is forbidden. A Claim
containing either field is invalid under that Predicate Schema, not a Claim
whose time field can simply be ignored.

Consequently, the first Claim-body completion may stay within that existing
bounded subset and encode only `subject_reference`, `issuer_ref`, `predicate`
and `value` for admitted Claims. It does not need a universal timestamp
representation. This does not remove either time field from abstract Claim
semantics or mean that Claims can never contain time. Future time-supporting
profiles remain possible under normal governance; none is defined here.

The representation work remains mapping supported Predicate field forms to
exact canonical runtime representations: subject-union encoding/discrimination,
nested field/member rejection, Claim-side PSCID embedding, `issuer_ref` and
`value` mappings, presence/null/default behavior, bounded time policy, nested
unknown-field handling, and applicability/version interpretation. Existing
top-level unknown-field rejection and absence-versus-null semantics are not
reopened. Canonical positive and negative/rejection vectors, including
independent Python/Node reconstruction, are recommended completion evidence.
No new Claim-body field or wire form is selected by this analysis.

### 11.2 Independent non-Lynx evidence of the existing dependency

The non-normative
[verified-Claim Rule/Evaluate input-mapping pressure test, Attack 3](PRESSURE-TEST-verified-claim-rule-evaluate-input-mapping.md)
compares bank-balance Claims with the same subject, predicate and value but
different banks. Their existing `issuer_ref` semantics can distinguish them
for Rule evaluation; they are not interchangeable merely because the other
fields match. This is non-Lynx evidence for preserving semantic issuer content,
not a completed bank-balance wire format or a new issuer primitive.

The current Draft
[VE-CEL-1 Rule Evaluate Input Contract §10.2](../specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md#102-critical-dependency-result)
separately identifies complete portable canonical `Claim.body` representation
as its smallest blocking dependency. Its sequence is Claim semantics, then
Claim-body canonical representation, then VE-CEL-1 binding. Thus independent
construction and deterministic Rule/Evaluate interoperability already need
portable Claim bodies outside Lynx. Body completion alone does not finish the
remaining CEL binding or alter the accepted Rule ordering contract.

RS-LYNX-001 did not create this dependency. It independently confirms and
prioritizes a Claim-body portability dependency already exposed by non-Lynx
Claim and Rule/Evaluate work, consistent with the existing specification tasks.
This is not a claim that every VE subsystem is blocked by it.

## 12. Verification reuse and remaining profile work

Accepted ADR-VERIFY-002 already supplies a reusable optional detached COSE
Claim construction: canonical Claim body, Claim-specific domain separation,
protected verification parameters, and an external issuer-to-key binding.
It expressly permits signed observations. Thus **new cryptographic architecture
required = NO** and **a new Lynx-specific cryptographic profile required = NO**
for the selected participant assertion path.

That is not a claim that the repository already contains a complete mandatory
Claim signing suite with every algorithm/key/error convention pinned. The
existing optional profile still needs an applicable concrete interoperable
verification procedure and provisioned context; OPEN_DECISIONS records the
limited closure. Completing that contract is class C, not evidence for a new
signature abstraction. A deployment with an already-shared supported profile
can reuse it; this analysis does not select an algorithm.

The VE-014 Ed25519 profile is **not** directly reusable as the Claim profile.
Its Execution Right frame, raw-key attester model and object domain differ
from ADR-VERIFY-002's semantic issuer binding. Reusing cryptographic techniques
does not permit relabeling an Execution Right signature as Claim verification.
If a direct external Lynx proof is later selected instead, its verification
procedure may require a subordinate profile; that option is not established
or necessary for the one-issuer route.

## 13. Event, Lifecycle, and Receipt consequences

### Event creation

VE-002/006 already own the interpretation and historical commitment. For this
Action's completion to be justified, the Boundary needs the exact Action pair,
evidence of the actual corresponding outbound execution, an authenticated
settlement assertion, valid correlation, and independently acceptable authority
for those facts. These are applications of existing ownership to the scenario,
not new universal Event fields or a new Lynx Event subtype.

A signed Claim is still an assertion. It does not itself append history or
establish Boundary authority. `EXECUTION_COMPLETED` already expresses the
required bounded result. **NO EVENT SEMANTIC GAP** is demonstrated.
Portable Event payload/reference encoding and authenticated coverage remain
class C: VE-002 §19 does not specify full cryptographic integrity, while
VE-001 still requires occurrence/content binding for relevant authoritative
artifacts. Neither copying a digest nor knowing a PCRN satisfies that binding.

### Lifecycle

Given a legitimate transition-causing Event in the existing successful path,
VE-003 derives COMPLETED. Evidence insufficiency is not permission to invent
completion, and no new successful Lifecycle state is needed. Replay admission,
retry safety and duplicate-transition prevention remain downstream ownership.
The known broader uncertainty/retry questions are not newly exposed defects
of this successful one-request case.

ADR-011's durable authorization snapshot remains unchanged. Later Rule/Claim/
policy changes do not retroactively invalidate issuance. Current right-attester
recognition, current evidence-issuer acceptance and resource admission remain
distinct environmental questions. A settlement Claim does not introduce live
revalidation of issuance policy or mutable/consumable right state.

### Receipt

VE-004 can summarize independently established history and commit evidence.
The same admitted settlement assertion and correlation can contribute to its
inputs; they are not automatically a complete COMMITTED Receipt. Its commit
reference, independently established execution-authority reference, exact
Action linkage and deterministic representation remain to be instantiated.
For the state-transition case its predecessor/successor obligations also
remain, including any permitted deterministic successor derivation.

This analysis has not obtained participant state commitments or defined an
applicable derivation contract. It does not waive those obligations, infer
account state from a bare PCRN, or equate terminal state with commit proof.
This is class B/C plus class A for unavailable external state evidence, not a
new Receipt semantic gap. A separate LynxReceipt is not demonstrated as
necessary. Existing Receipt/execution-profile work is the owner.

## 14. Authority-chain matrix

The three closure columns use only the requested statuses. CLOSED means the
particular obligation has an existing owner/contract, not that a Draft is
Approved or a live deployment was tested. PARTIALLY CLOSED means a specified
portion exists. UNINSTANTIATED means the concrete instance/encoding is absent.
EXTERNAL UNKNOWN denotes an unresolved public-access or external-contract
question. No REAL NORMATIVE GAP is established by this analysis.

| Link | Current owner | Semantic closure | Representation closure | External availability |
|---|---|---|---|---|
| Action → outbound request | VE-001, Lynx Action schema, VE-005/006 | CLOSED | UNINSTANTIATED | PARTIALLY CLOSED |
| Outbound request → Lynx obligation | Lynx rules and message/report contracts; Adapter association | CLOSED | PARTIALLY CLOSED | PARTIALLY CLOSED |
| Obligation → PCRN | Rule 1/6, TSP-005 | CLOSED | PARTIALLY CLOSED | PARTIALLY CLOSED |
| PCRN → settled proposition | Rule 6; source authentication, not string possession | CLOSED | PARTIALLY CLOSED | PARTIALLY CLOSED |
| Settlement observation → authenticated Claim | ADR-VERIFY-002 and Claim contracts | CLOSED | UNINSTANTIATED | PARTIALLY CLOSED |
| Claim → recognized issuer | VerificationContext and existing trust/Evaluate governance | CLOSED | PARTIALLY CLOSED | EXTERNAL UNKNOWN |
| External obligation → Action occurrence | Closed Claim subjects, schema-local value, VE-001 pair binding | CLOSED | UNINSTANTIATED | PARTIALLY CLOSED |
| Bound settlement fact → Event | VE-002/006 | CLOSED | UNINSTANTIATED | PARTIALLY CLOSED |
| Event → Lifecycle | VE-003 | CLOSED | CLOSED | CLOSED |
| History/evidence → Receipt | VE-004 and authoritative execution domain | CLOSED | UNINSTANTIATED | EXTERNAL UNKNOWN |

Lifecycle's CLOSED representation entry is the existing state projection, not
a claim that its input Event wire format is complete. Issuer acceptance's
EXTERNAL UNKNOWN entry concerns actual deployment recognition, not absent VE
trust semantics. PCRN's partial entries include cross-surface normalization
and historical scope questions, not doubt about Rule 6's settlement trigger.

## 15. Exhaustive finding inventory and falsification

| Finding | Class | Consequential issue / smallest remedy under existing owner |
|---|---|---|
| Public direct-system export proof not demonstrated | A | Obtain authenticated-export format, covered fields and verifier inputs; alternatively use explicitly recognized participant assertion |
| PCRN scope/reuse and cross-surface form not fully specified here | A | Obtain the exact external identifier contract before freezing a schema-local identifier comparison |
| Production access and release alignment | A | Confirm participant entitlements, current/future message versions and actual reference preservation |
| Concrete Lynx predicate and recognized issuer contract absent | B | Instantiate exact settlement/correlation proposition, value/issuer domain and acceptance configuration |
| Portable Claim body incomplete | C | Complete the existing bounded Claim-body representation Draft, reusing current field owners |
| Concrete Claim verification applicability incomplete | C | Pin supported verification behavior/context under ADR-VERIFY-002; do not copy the Execution Right profile |
| Outbound association and portable Event evidence coverage absent | B/C | Instantiate existing Adapter/Boundary recording and complete appropriate reference/Event representation |
| Portable committed Receipt inputs and coverage absent | A/B/C | Obtain applicable commit/state evidence and complete existing Receipt representation, without self-authorizing proof |

No other incompleteness is implied by naming a subsystem. In particular:

| Attack | Result |
|---|---|
| Another payment has the same amount or EndToEndId | No justified join without the exact scoped request/result association; concrete correlation validation, not new Action semantics |
| Fabricated PCRN has correct syntax | Fails source/issuer evidence; syntax is not settlement authentication |
| Settlement signature is valid but issuer unrecognized | Insufficient authority; existing Verify versus trust separation |
| Adapter signs a false association | Signature proves the assertion, not its truth; verifier trust policy and issuer accountability are explicit, not bypassed |
| Two Claims use identical P text under different domains | No inferred equality; existing subject/value-domain semantics own comparison |
| A customer-facing success message is substituted | It does not establish the bounded participant settlement fact under the selected authority contract |
| Same content, different Action occurrence | Both Action components stay bound; content identity alone cannot select the occurrence |
| Same artifact is replayed | Authenticity can remain while execution admission changes; existing downstream ownership, no new retry token |
| Return follows settlement | Separate external operation does not erase the original history or change its Action digest |
| Claim signature is presented as a complete Event/Receipt | Rejected inference: Boundary history and Receipt-specific evidence/bindings remain necessary |
| Issuer/key rotation or revoked recognition | Requires applicable current verification/recognition context; no universal new identity lifecycle follows from this scenario |

No pair of otherwise conforming implementations with the same complete
governing contracts, authority context and observations was demonstrated to
require contradictory semantic outcomes. Where independent bytes or joins
cannot yet be produced, the missing item is explicitly class A, B or C, not
concealed by that no-architecture-gap finding.

## 16. Minimum artifact ladder and Architectural Decision Tests

The ladder evaluates the next artifact, not just the smallest document by
page count. A Lynx predicate alone cannot supply absent shared Claim bytes.
A Lynx Claim specification could duplicate those mechanics, but duplication
is unnecessary while an existing Claim-body Draft owns that exact work.

| Candidate | Decision as next artifact |
|---|---|
| A. Implementation guidance only | Insufficient for independent portable assertion bytes; useful locally, not the requested closure |
| B. Lynx Predicate Schema | Needed concrete instantiation later; not sufficient before the shared Claim representation is closed |
| C. Lynx-specific Claim/profile | No separate Claim architecture needed; avoid bundling body encoding, trust, Event and Receipt semantics |
| D. External-reference/correlation profile | Existing ownership; standalone profile not yet justified by one issuer's bound assertion; specific encoding still needed where recorded in history |
| E. Existing general Claim canonical representation | Recommended first: complete the bounded existing Draft, rather than create a parallel Lynx Claim body |
| F. Event representation/profile | Real downstream representation work; not a substitute for a portable underlying assertion |
| G. Receipt representation/profile | Real downstream representation work; not a substitute for independently established settlement and history |
| H. Approved specification revision | Not justified: no conflicting or insufficient Approved semantic sentence has been demonstrated |
| I. New architectural primitive | Rejected: existing concepts express the composition; bundling them adds no necessary capability |

The six tests below assess each candidate **as the next standalone remedy**.
Pass does not mean an unwritten normative artifact has passed conformance.
Conditional identifies concrete scope/evidence still needed; Fail rejects its
use as that remedy, not the legitimacy of its existing semantic owner.

| Candidate | Founding Principles | Primitive burden | Removability | Twenty-year durability | Independent implementability | Reduced complexity |
|---|---|---|---|---|---|---|
| A guidance only | Pass | Pass | Fail: portable contract still absent | Conditional: local assumptions | Fail: no common bytes | Fail: private conventions persist |
| B predicate next | Pass | Pass | Pass: concrete proposition needed | Conditional: external version/scope | Fail as sole remedy: Claim bytes absent | Pass if layered after shared work |
| C separate Lynx Claim/profile | Pass if scoped | Pass only without wrapper | Fail: duplicate shared body removable | Conditional: avoid rail-specific envelope | Conditional: would need to close shared work too | Fail if it duplicates/bundles owners |
| D standalone correlation profile | Pass | Pass if field-level | Conditional: may be absorbed into one Claim/history representation | Pass with scoped references | Fail as sole remedy: assertion encoding absent | Conditional: separate document not yet necessary |
| E bounded existing Claim-body completion | Pass | Pass: no primitive | Pass: deterministic signed body is necessary | Pass: explicit versioned field contracts | Pass as achievable scope: exact bytes/rejection/vectors; not already completed | Pass: one shared contract instead of rail-specific copies |
| F Event representation | Pass | Pass | Pass downstream | Pass with explicit coverage | Fail as first sole remedy: assertion remains absent | Pass downstream, not a replacement |
| G Receipt representation | Pass | Pass | Pass downstream | Pass with authority/state bindings | Fail as first sole remedy: evidence remains absent | Pass downstream, not a replacement |
| H Approved semantic revision | Fail: no semantic defect shown | Conditional on proposed change | Fail: existing owners suffice | Fail: needless revision | Fail: no missing rule specified | Fail: unnecessary governance/semantics |
| I new primitive | Fail: unnecessary abstraction | Fail | Fail: removable | Fail: rail-specific bundling | Fail: does not close concrete source/bytes | Fail |

The selected path therefore passes all six at architectural/recommendation
scope. Its future specification still requires independent audit and vectors.
This is not an assertion that a portable Claim implementation exists today.

## 17. Minimum unanswered external questions

These questions are class A and could be answered through participant support
without reopening VE architecture. The first two affect the eventual concrete
Lynx schema. None prevents work on the shared Claim-body representation.

1. What are the precise uniqueness, reuse/reset and environment boundaries of
   the PCRN core and full transport form? Are date or participant qualifiers
   required for durable identification?
2. What exact PCRN form appears in Web Client exports and camt.053 ClrSysRef,
   and what authoritative transformation relates it to the 16-character header?
3. Which original request/message reference fields are carried in the complete
   xsys.002 structure, and what retained authentication binds them to its PCRN?
4. What fields and provenance survive participant export of the receiver's
   Request Header together with the original payment body?
5. Which applicable camt.053 references are guaranteed for a participant's
   actual pacs.008 path, including Instruction ID/UETR retention?
6. Is any export independently signature-verifiable outside the participant
   session, with documented key authority, coverage and redistribution rights?
7. What machine-readable Web Client history/report export is supported, with
   retention and correction rules? No screen scraping is proposed.
8. How does the current TSP-005 transport contract align with the November
   UG2026 release, and which authenticated deployment documents close that?
9. What production API, if any, exposes settlement association and provenance?
   The published Lynx sandbox and inaccessible technical page do not answer it.
10. For the optional Receipt state-transition proof, what independently accepted
    commit/state references or permitted derivation inputs are available?

There is no need to ask whether Lynx has a settlement identifier or whether
TSP-005 exposes PCRN at all: the public sources already answer those questions.
If the deployment insists on direct Lynx-signed portable proof, question 6 is
a gating access issue for that option, not a universal VE requirement.

## 18. Governance and next cadence step

The following records the recommended work, not changes made by this analysis.
Draft completion remains subject to review. If future drafting actually changes
an Approved rule, the normal RFC/ADR/version/changelog process applies; this
document grants no exemption.

| Governance item | Required? | Reason |
|---|---|---|
| VE-001 revision | NO | Preserve semantic pair and cryptographic binding obligation |
| VE-002 revision | NO | Existing Event fact/history owner; full representation is separately uninstantiated |
| VE-003 revision | NO | Successful transition already defined |
| VE-004 revision | NO | Preserve current Receipt/commit/state obligations; fill applicable representation, do not waive them |
| VE-005 revision | NO | External references and observations already permitted |
| VE-006 revision | NO | Boundary interpretation and historical authority already owned |
| VE-014 revision | NO | Execution Right is not settlement evidence; existing semantics unchanged |
| Claim reference semantics revision | NO | Existing closed alternatives suffice; concrete encoding belongs elsewhere |
| Predicate Schema revision | NO | No demonstrated need to change the Approved semantic contract/grammar; concrete schema still needs bounded-profile validation |
| Claim representation work | YES | Complete the existing shared Draft's portable body/field binding and applicability contract |
| New subordinate profile/specification | YES | A concrete governed Lynx assertion Predicate Schema is still needed subsequently; this does not mean a new general Claim artifact is needed first |
| RFC | NO | No Approved semantic change or new architectural decision shown |
| ADR | NO | No new architectural choice requiring one demonstrated |
| VE-xxx allocation | NO | Existing subordinate work, no new top-level specification number |
| New primitive | NO | Existing Claim/Verify/Adapter/Event/Lifecycle/Receipt composition suffices |

The immediate next artifact is completion of the **existing**
`specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md` Draft as a bounded portable
Claim-body canonical representation profile. The YES for new subordinate
specification concerns later Lynx-specific instantiation, not creation of a
second shared representation specification or implementation in this task.

The exact existing artifact and version recommendation are:

| Item | Current artifact / recommendation |
|---|---|
| Path | `specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md` |
| Title | VE-CBOR-1 Claim Body Schema |
| Identifier | `VE-CBOR-1-CLAIM-BODY-SCHEMA` |
| Current status | Draft v0.1 |
| Current role | Candidate representation specification for Claim-body structure and eventual canonical VE-CBOR-1 Claim-body bytes |
| Recommended next drafting target | Draft v0.2: substantive completion of this existing Draft's delegated representation scope |

Draft v0.2 is recommended because the completion would add
interoperability-significant representation rules and vectors. This is a
recommendation for this substantive Draft completion, not a general rule that
every Draft modification requires a version increment. It neither changes the
current Draft v0.1 nor creates a parallel representation profile, new general
Claim specification, Claim primitive, or canonicalization architecture.

The version recommendation does not itself trigger an RFC, ADR, Approved-spec
revision, VE-xxx allocation, new primitive, or CHANGELOG requirement under
Approved-specification change governance. The NO findings above remain
conditional on drafting staying within the existing delegated scope without
conflicting with an Approved specification or Accepted architectural decision.

The future Draft's narrow acceptance questions are exact supported Claim body
bytes, unambiguous closed-subject encoding, governed Predicate Schema reference
embedding, issuer/value/time runtime representations, omission rules, profile
applicability and independently reproducible vectors. It could support a
bounded subset explicitly; no universal identity, time, value, or normalization
system is implied. Existing Claim verification remains its separate owner.

After that shared work, concrete Lynx predicate/issuer/source-correlation
instantiation and appropriate verification, Event and Receipt representation
can be audited under their existing owners. No Claim signature by itself
closes every downstream requirement.

There is no proposed Evidence, Correlation, ExternalTransactionId,
ExecutionAttempt, SettlementProof, Observation, LynxReceipt, PaymentObligation,
ActionReference, generic ContentIdentity, identity/trust primitive, key/profile/
algorithm registry, resolver, negotiation layer, capability, authorization token,
replay token, or mutable right. External domain words and explanatory variable
names are not VE primitives. Existing VerificationContext/Trust Context inputs
are not reified into a new object.

## 19. Cadence result and reproducibility boundary

```text
Kernel specifications and Lynx Action schema
  → merged RS-LYNX-001 successful-path simulation
  → this non-normative Gap Analysis
  → no architectural RFC demonstrated as necessary
  → complete existing bounded Claim-body representation Draft
```

The external source exists operationally; its standalone exported cryptographic
proof is not established. A recognized observer can issue a portable Claim
under existing authority. Correlation is expressible without a new primitive,
but shared Claim bytes and concrete Lynx contracts are not yet supplied.
Event semantics and Lifecycle projection suffice. Complete portable Event and
Receipt evidence still have representation/input work. This is a priority
decision, **not end-to-end portability or workstream closure**.

Validation for this analytical artifact concerns repository documentation,
references, terminology, whitespace and exact scope. No production Lynx access,
new payment, Claim implementation, external signature replay or complete
Receipt construction is claimed. Public PDF text was inspected; attempted PDF
screenshots were unavailable from the retrieval service. No fact is inferred
from uninspected diagram geometry.

Construction checks on 2026-09-10 passed: 121 Markdown documents, 27/27
repository tests, registered document references and local links, terminology
review, tracked diff checking, and explicit new-file whitespace/EOF checking.
The explicit no-index check reports the normal different-file exit status for
a new file, with no whitespace diagnostics. UTF-8 round-trip, LF line endings,
absence of trailing whitespace, and exactly one final newline were checked.
The scope is exactly this new uncommitted analysis; no specification, scenario,
RFC, ADR, index or changelog changed. No commit or PR was created.

**NEXT ARTIFACT = complete the existing VE-CBOR-1 Claim Body Schema Draft as a
bounded portable Claim-body canonical representation profile.**

**RFC REQUIRED = NO.**

## Revision history

- 0.1 — 2026-09-10: Non-normative settlement-source, authority, correlation and
  representation analysis following merged RS-LYNX-001; no normative changes.
