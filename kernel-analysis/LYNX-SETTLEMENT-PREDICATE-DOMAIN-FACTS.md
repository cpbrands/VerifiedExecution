---
id: LYNX-SETTLEMENT-PREDICATE-DOMAIN-FACTS
title: Lynx Settlement Predicate Domain-Fact Closure
version: "0.1"
status: Draft
document_type: Kernel Analysis
category: Non-normative Analysis
author: Verified Execution Editorial Board
created: 2026-09-11
updated: 2026-09-11
depends_on:
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
related_documents:
  - RS-LYNX-001-SUCCESSFUL-LYNX-INTERBANK-SETTLEMENT
  - GAP-ANALYSIS-RS-LYNX-001-SETTLEMENT-ASSERTION-CORRELATION
  - GAP-ANALYSIS-RS-CLM-001-CLAIM-BODY-PORTABILITY
  - ADR-VERIFY-002
supersedes: null
superseded_by: null
---

# Lynx Settlement Predicate Domain-Fact Closure

## 1. Authority and bounded question

This document is **non-normative analysis**. It records the external domain
facts sufficient to draft one concrete Predicate Schema for the settlement
proposition already bounded by the Draft
[Lynx UG2026 Action Schema](../specifications/LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA.md).
It is not that Predicate Schema, does not allocate a Predicate identifier or
PSCID, and does not change a specification, RFC, ADR, architecture, trust
policy, verification profile, or external payment-system rule.

The four questions are:

1. what PCRN establishes and how it participates in the assertion;
2. which entity is the semantic Claim issuer;
3. what the smallest accurate Claim value means; and
4. how the asserted settled obligation is tied to the exact Action occurrence.

The analysis uses current Payments Canada materials inspected on 2026-09-11.
The repository's Action schema targets the published
`Lynx_Final_CoreMessages_UG2026` pacs.008 guideline dated 2026-03-23 and the
November 2026 release. That future-release selection is suitable for drafting
against the same target; it is not a claim that UG2026 is already operational.

## 2. Source and authority ledger

| Source | Status and use |
|---|---|
| [Lynx Rule 1](https://www.payments.ca/sites/default/files/rule_1_interpretation_-_lynx.pdf) | In-force Lynx rule defining PCRN as the Lynx-generated confirmation number identifying a settled Lynx Payment Obligation. |
| [Lynx Rule 6, sections 7-8](https://www.payments.ca/sites/default/files/rule_6_payment_transmission.pdf) | In-force rule establishing post-settlement PCRN generation, availability to both participants, forwarding of the payment message, and finality despite the described receiver-side Swift-authentication failure. |
| [Lynx Rule 14, section 6(a)](https://www.payments.ca/sites/default/files/rule_14_claims_and_compensation.pdf) | In-force rule expressly recognizing the sender transaction reference in the Payment Message `Instruction ID`, with date and amount, as an identifier of the original payment alongside PCRN. |
| [TSP-005, pages 6-9](https://www.payments.ca/sites/default/files/tsp-005_Lynx_MX_payment_message_types_and_formats.pdf) | In-force MX transport procedure defining the 16-character PCRN form and the sender, receiver, and reporting surfaces. |
| [Payments Canada PCRN explainer](https://www.payments.ca/explainer-lynx-wire-payments-and-payment-confirmation-reference-number) | Current official explanatory evidence that PCRN is unique, automatically assigned only after Lynx settlement, and distinct from institution-specific references. It does not supersede the rules. |
| [UG2026 pacs.008](https://www.payments.ca/sites/default/files/lynx_fi_to_fi_customer_credit_transfer_pacs.008.pdf), sections 4.1.4 and 5.64 | Selected future-release message authority for `BizMsgIdr`, `InstrId`, `TxId`, `UETR`, and the non-PCRN `PmtId/ClrSysRef`. |
| [UG2025 camt.053](https://www.payments.ca/sites/default/files/lynx_bank_to_customer_statement_camt.053.pdf), sections 5.98.1 and 5.250.10 | Current reporting evidence: the transaction reference block carries the references Lynx has, including `InstrId`, `EndToEndId`, and `UETR`, and places PCRN in `ClrSysRef`. |
| [VE-001](../specifications/VE-001-action-specification.md) and its [Action representation profile](../specifications/VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE.md) | Owners of Action occurrence/content identity and the exact imported `action_id`/`action_digest` representations. |
| [Predicate Schema Semantic Contract](../specifications/PREDICATE-SCHEMA-SEMANTIC-CONTRACT.md) and [Field-Semantic Grammar](../specifications/PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR.md) | Approved owners of schema-local issuer, value, comparison, subject, time, and bounded FieldForm semantics. |
| [Claim Body Schema v0.2](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md) | Draft representation owner for the closed Claim body and `ActionOccurrenceReference`. |
| [ADR-VERIFY-002](../adrs/ADR-VERIFY-002-CLAIM-VERIFICATION-ENVELOPE.md) | Accepted separation of the semantic issuer from the authenticator and verifier-local recognition. |
| [RS-LYNX-001 Gap Analysis](GAP-ANALYSIS-RS-LYNX-001-SETTLEMENT-ASSERTION-CORRELATION.md) | Prior non-normative evidence and unanswered-question inventory. It does not allocate authority. |

Repository validators, examples, and this analysis are evidence, not external
or specification authority.

## 3. Fact 1: settlement identifier

### 3.1 Meaning, trigger, and finality

The Payment Confirmation Reference Number is generated by Lynx **upon
settlement** to identify the settled Lynx Payment Obligation. A plausible PCRN
string before settlement proves nothing. Under Rule 6, a Lynx Payment
Obligation that settles and receives a PCRN is final and irrevocable in Lynx,
including the rule's case where the associated payment message later fails
Swift authentication at the receiving participant.

This proposition is strictly participant-level Lynx interbank settlement. It
does not establish customer debit, beneficiary credit, beneficiary net amount,
end-to-end completion, message submission, queue admission, or mere Swift
acceptance.

### 3.2 Supported representation facts

Current MX TSP-005 defines the PCRN transported to participants as exactly 16
characters:

```text
positions 1-4   = "LVTS"
positions 5-13  = nine-character alphanumeric Lynx-generated PCRN core
positions 14-16 = "TR1" or "TR2" settlement-mechanism indication
```

TSP-005 states that the sending participant's `xsys.002`
`ThirdPartyToSenderInformation` contains the PCRN and that the receiving
participant's forwarded payment Request Header
`ThirdPartyToReceiverInformation` contains the same 16-character PCRN.
The Lynx reporting guideline places PCRN in the transaction-level camt.053
`ClrSysRef`.

No case folding, trimming, punctuation rewriting, core/full-form aliasing, or
equivalence between a copied PCRN and an institution-specific reference is
authorized. A source contract that consumes a surface must validate that
surface's exact representation. This Predicate Schema need not invent a
cross-surface normalization because PCRN is not part of its Claim value.

### 3.3 Role in the future Predicate Schema

**Decision: PCRN is an external evidence and correlation identifier, not a
semantic Claim value.**

The settled proposition is already selected by the exact Action occurrence.
Copying PCRN into `value` would mix source evidence with the proposition and
would redundantly expose transport/mechanism formatting as Claim semantics.
The PCRN remains essential to the retained evidence chain, where it
demonstrates that Lynx assigned settlement confirmation to the correlated
obligation. Possession of the string alone is not authentication.

**FACT 1: CLOSED.** The fact needed by the schema is closed without placing a
PCRN field in `Claim.body`.

## 4. Fact 2: issuer and source

Four roles remain distinct:

| Role | Selected owner |
|---|---|
| System that settles and assigns PCRN | Payments Canada Lynx. |
| Delivery/reporting source exposing the fact | Swift/Lynx participant channels: sender `xsys.002`, receiver forwarded header, or Lynx camt.053. |
| Semantic Claim issuer | The **sending Lynx participant** that submitted the correlated pacs.008, including a participant-controlled Adapter acting on its behalf. |
| Cryptographic authenticator | The verifier/key selected by the Claim verification profile and bound to that issuer through VerificationContext. |

**Issuer classification: B. SENDING PARTICIPANT.**

The public materials do not establish that Payments Canada/Lynx directly
issues a portable VE Claim. The receiving participant can observe settlement,
but it does not automatically possess the sender-side Action-to-submission
association. The sending participant is the smallest single issuer that can
legitimately cover both its retained submission association and the settlement
notification/report it received.

The future schema's `issuer_domain` should therefore mean: an exact semantic
identifier for the sending Lynx participant responsible for the correlated
submission. Its portable FieldForm can be plain UTF-8/NFC `text` with exact
canonical equality. The identifier is provisioned and bound to the accepted
verification key or verifier by VerificationContext; it is not inferred from
a public key, PCRN, BIC string, customer label, or copied message field. Trust
Context/Evaluate separately decides whether that issuer is accepted for this
predicate and Action context.

This deliberately does not create a participant registry or a global identity
format. A deployment may use a BIC or another controlled identifier as its
provisioned value only when its governing issuer-binding contract gives that
value the stated participant meaning. Different keys may authenticate the same
issuer, and successful authentication alone does not grant issuer authority.

**FACT 2: CLOSED.** One participant issuer domain plus existing
VerificationContext binding is sufficient.

## 5. Fact 3: value semantics

The smallest accurate proposition is:

> The exact Lynx Payment Obligation produced by the correlated submission for
> this Action occurrence was Settled between the sending and receiving Lynx
> participants through entries to their Lynx accounts.

The future schema should use:

```text
value FieldForm = boolean
allowed value   = true only
equality        = exact Boolean equality
```

`false` is not admitted: absence of observed settlement is not proof of a
stable negative proposition. A text PCRN value would conflate evidence with
the fact. A `{ settled, pcrn }` record would carry the same redundancy and
would unnecessarily expose PCRN transport representation in Claim semantics.

The proposition does not assert customer credit, customer debit, beneficiary
receipt, beneficiary net amount, end-to-end payment completion, or present
execution admissibility.

**FACT 3: CLOSED.** Boolean `true` is the minimum sufficient Claim value.

## 6. Fact 4: exact Action correlation

### 6.1 Subject selection

**Decision: use `ActionOccurrenceReference`, not
`ActionContentReference`.**

Two historical submissions can have identical Action semantic content while
only one settles or while they receive different PCRNs. Content identity alone
cannot select the settled occurrence. The future schema should restrict
`subject_constraints` to exactly:

```text
ActionOccurrenceReference {
  action_id,
  action_digest
}
```

Claim Body v0.2 directly imports the canonical VE-001 values. Both components
remain necessary: `action_id` selects the historical occurrence and
`action_digest` binds its exact semantic content; `action_id != action_digest`.
No wrapper, conversion,
attempt identifier, message-reference primitive, or new correlation primitive
is introduced.

### 6.2 Existing-identifier evidence chain

For the selected UG2026 one-transaction pacs.008 path, the sending
participant/Adapter must retain an auditable association:

```text
ActionOccurrenceReference { action_id, action_digest }
    -> Adapter submission state
    -> exact admitted outbound pacs.008
    -> retained sender-side InstrId and UETR
    -> authenticated settlement surface for that payment
    -> PCRN assigned after settlement
    -> settlement Claim
```

The association must be recorded before the result is known. The outbound
message must independently validate against the Action schema's deterministic
mapping; identifier equality cannot substitute for semantic-content checking.
The settlement surface must be received through an authenticated participant
channel and must associate its PCRN with that same outbound payment. If the
available surface cannot make that association, the issuer must not issue the
Claim. This is a source-evidence precondition, not a new Claim field.

The identifier comparison is exact under the governing Lynx message rules:

| Identifier | UG2026 role | Correlation decision |
|---|---|---|
| `InstrId` | Mandatory, instructing-party assigned, point-to-point instruction reference, restricted to 16 characters. | **Strongest rule-level sender-side correlation reference established by current Lynx authority for this bounded route.** Rule 14 expressly recognizes it, with date and amount, as the sender transaction reference identifying the original payment alongside PCRN. Retain it with the Action pair and require exact equality when the authenticated settlement surface supplies it. This does not make `InstrId` universally primary independently of that surface. |
| `UETR` | Mandatory UUIDv4, end-to-end payment-transaction reference. | **Exact corroborating identifier.** Retain it from the exact outbound pacs.008 and require exact equality when the authenticated settlement surface supplies it. Current public authority does not rank it above `InstrId`, state that it uniquely identifies the settled Lynx obligation, guarantee its association with PCRN on every settlement surface, or establish it as a universal primary join. It remains message/evidence identity, not Action identity. |
| `TxId` | Optional, first-instructing-agent assigned, unique only for a pre-agreed period. | May corroborate but cannot be the required sole join. |
| `BizMsgIdr` / `MsgId` | Mandatory message-level identifiers; UG2026 requires equality between BAH `BizMsgIdr` and group-header `MsgId`. | Useful for retained message-envelope association, but not a transaction-level or settlement identifier and not the sole join. |
| `EndToEndId` | Mandatory field but may contain `NOTPROVIDED`; initiator-facing. | Not a reliable sole join for this schema. |
| pacs.008 `PmtId/ClrSysRef` | Not assigned by Lynx; UG2026 says it has no Lynx settlement-processing relevance. | MUST NOT be interpreted as the PCRN. |

Current camt.053 reporting can carry `UETR` and `InstrId` in the same
transaction reference block as the PCRN. Those report references are optional
per transaction and Lynx supplies what it has; therefore a missing report
reference is not normalized or guessed. The receiver path can instead use the
forwarded payment bearing the same 16-character PCRN in its transport header.
The sender `xsys.002` path is admissible only when the retained authenticated
delivery context associates that notification with the exact outbound request.
The authenticated evidence surface determines which exact identifier
association is available; no public rule guarantees both `InstrId` and `UETR`
on every settlement surface. The Adapter may retain and compare multiple
identifiers without creating a generic correlation primitive.

This rule uses existing identifiers and existing Adapter/evidence ownership.
It does not make PCRN, UETR, `InstrId`, `TxId`, or `BizMsgIdr` part of Action
semantic content and does not assert equality among them.

**FACT 4: CLOSED.** The exact Action occurrence can be correlated using
existing identifiers and retained authenticated context; no new primitive is
required.

## 7. Exact future Predicate Schema facts

The following is the complete semantic target for later drafting. It is not a
schema descriptor and assigns no PSCID.

| Property | Closed fact |
|---|---|
| Semantic proposition | The exact Lynx Payment Obligation produced by the correlated submission for the referenced Action occurrence was Settled between the sending and receiving Lynx participants through entries to their Lynx accounts. |
| Subject restriction | Exactly `ActionOccurrenceReference { action_id, action_digest }`; imported VE-001 representations and equality unchanged. |
| `issuer_domain` | Sending Lynx participant responsible for the correlated submission; identifier represented as UTF-8/NFC text, exact canonical equality, with semantic issuer-to-authenticator binding supplied by VerificationContext. |
| `value` | Boolean `true` only; exact equality. PCRN is not the value. |
| Comparison | Equality only. No ordering, threshold, alias, or cross-predicate equivalence. |
| Time | `time_semantics` absent; `assertion_time` and `observation_time` forbidden under Claim Body v0.2. Settlement timing remains source evidence, not Claim-body content. |
| Required external evidence | Authenticated sender settlement notification or system reporting/delivery evidence carrying PCRN and an association to the exact submitted payment; syntax alone is insufficient. |
| Action correlation | Retained `(action_id, action_digest)` to Adapter submission state and the exact admitted outbound pacs.008; retained `InstrId` as the strongest current rule-level sender-side reference and UETR as corroboration; exact comparison of whichever association the authenticated settlement surface supplies; plus PCRN from that surface. No identifier is universally primary independently of the surface, and no identifier substitutes for Action semantic validation. |

Unknown issuer identifiers, unavailable issuer binding, unauthenticated or
uncorrelated PCRN, a mismatched message identifier, an invalid Action pair, or
an evidence surface lacking the required association fails applicability. No
fallback issuer, fuzzy comparison, or guessed join is permitted.

## 8. Adversarial checks

| Attack | Result |
|---|---|
| Syntactically valid PCRN is fabricated | Reject as evidence: no authenticated settlement source or correlated obligation. |
| Institution reference is presented as PCRN | Reject; official guidance distinguishes them. |
| Same Action content, different occurrence | Different `action_id`; content-only substitution cannot satisfy the subject. |
| Same UETR is attached to different Action content | `action_digest` and exact outbound-message validation fail. |
| `PmtId/ClrSysRef` from the outbound pacs.008 is treated as PCRN | Reject; UG2026 expressly says it is not Lynx-assigned and has no Lynx settlement relevance. |
| Customer credit or end-to-end success is inferred | Reject; proposition is participant-level settlement only. |
| Valid signature from an unrecognized key is presented | Authentication does not establish the sending-participant issuer binding or trust. |
| Receiving participant asserts sender-side Action correlation without evidence | Reject as inapplicable; receiver observation alone does not establish the sender's Action association. |
| A report omits UETR or InstrId | Do not guess. Use another authenticated association path or do not issue the Claim. |
| Payment is later returned | Does not erase the historical settlement proposition; return is a separate operation. |

No two conforming implementations given the same Action pair, admitted
outbound message, authenticated source evidence, issuer binding, and governing
context need reach different results on these four facts.

## 9. Governance and readiness

| Item | Result |
|---|---|
| Predicate Schema may now be drafted | **YES**, as a subordinate concrete schema using existing Approved and Draft owners. |
| Approved specification revision | NO. |
| RFC required | NO. |
| ADR required | NO. |
| New primitive | NO. |
| New registry or identity system | NO. |
| New `VE-xxx` allocation | NO. |
| Direct Payments Canada/Lynx VE attestation assumed | NO. |
| Live UG2026 deployment readiness established | NO; release and participant integration remain deployment validation. |

The future Predicate Schema must itself be independently audited and assigned
its PSCID under the existing Predicate canonicalization and DIGEST-001 v0.4
rules. This analysis does not create that authority.

## 10. Architectural Decision Tests

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The proposition, occurrence binding, evidence origin, and issuer-recognition boundary remain explicit and inspectable. |
| Primitive burden | Pass. Existing Action occurrence, Claim, Predicate Schema, issuer binding, and external-evidence concepts suffice. |
| Removability | Pass. PCRN/message evidence can remain outside Claim semantics; removing any invented wrapper or registry does not break the composition. |
| Twenty-year durability | Pass. The Claim states a bounded historical settlement fact while external message editions and evidence profiles remain versioned context. |
| Independent implementability | Pass at schema scope. Two implementations can apply the same subject, issuer, value, and fail-closed applicability rules; live evidence availability remains an explicit deployment precondition. |
| Reduced conceptual complexity | Pass. One true-only occurrence predicate avoids a PCRN-valued record, new correlation object, identity registry, or duplicated verification semantics. |

## 11. Final closure

```text
Settlement identifier fact: CLOSED
Source/issuer fact:         CLOSED — B. SENDING PARTICIPANT
Value-semantics fact:       CLOSED — boolean true only
Action-correlation fact:    CLOSED — ActionOccurrenceReference plus retained existing identifiers

LYNX PREDICATE SCHEMA READY = YES
RFC REQUIRED = NO
```

The next cadence step is to draft the concrete Lynx settlement Predicate
Schema. No schema, RFC, ADR, or normative modification is made here.
