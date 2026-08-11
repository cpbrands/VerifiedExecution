# VE-000 — Verified Execution Core Specification

**Version:** 0.1  
**Status:** Draft  
**Category:** Core Specification  
**Identifier:** VE-000  
**Project:** Verified Execution

---

## Abstract

Verified Execution defines an execution architecture for consequential actions initiated by autonomous or AI-assisted systems.

The architecture establishes an **Execution Boundary** between machine intent and external side effects.

An AI system MAY reason, plan, recommend, and propose Actions outside the Execution Boundary. It MUST NOT directly perform a consequential external side effect that the deployment claims is governed by Verified Execution.

Every governed side effect MUST instead be represented as an **Action**, processed according to a defined **Lifecycle**, recorded through immutable **Events**, executed through an **Adapter**, and concluded with a **Receipt** when the Action reaches a receipt-producing terminal outcome.

This specification defines the minimum semantics, invariants, trust assumptions, conformance requirements, and extension rules required for systems claiming compatibility with Verified Execution.

The objective is:

> **Every AI action is provably legitimate.**

Version 0.1 does not claim to fully achieve cryptographic proof of legitimacy. It defines the architectural substrate upon which that property can be built without changing the core execution model.

---

# 1. Status of This Document

This document is an early architectural specification.

It is not yet a stable standard.

Implementations MAY experiment with VE-000 v0.1, but production systems MUST NOT interpret the `0.1` designation as a guarantee of backward compatibility.

The purpose of this version is to establish and pressure-test the minimum conceptual model required for Verified Execution.

Future versions MAY refine schemas, protocols, encoding formats, transport mechanisms, cryptographic representations, and operational requirements.

Future versions SHOULD preserve the core semantics established here unless implementation evidence demonstrates that they are incorrect.

---

# 2. Purpose

The purpose of Verified Execution is to establish a trustworthy boundary between machine-generated intent and consequential execution.

The system is designed to make consequential execution:

- identifiable,
- attributable,
- governable,
- observable,
- reconstructable,
- evidentiary,
- and ultimately independently verifiable.

Verified Execution does not attempt to establish whether an AI system is intelligent, truthful, safe in every respect, or objectively correct.

It establishes whether a specific Action was executed according to the authority, policy, process, and evidence requirements applicable to that Action.

---

# 3. Scope

VE-000 defines six core architectural primitives:

1. **Action**
2. **Event**
3. **Lifecycle**
4. **Execution Boundary**
5. **Adapter**
6. **Receipt**

These primitives define the minimum conceptual architecture of Verified Execution.

This specification also defines:

- system invariants,
- Action identity requirements,
- state reconstruction,
- execution mediation,
- evidence requirements,
- failure semantics,
- trust assumptions,
- security requirements,
- conformance levels,
- and extension rules.

Detailed specifications for each primitive MAY be defined in subsequent VE specifications.

VE-000 remains authoritative where those specifications overlap with core semantics.

---

# 4. Non-Goals

Verified Execution is deliberately narrower than general AI safety or governance.

VE-000 does **not** define:

### 4.1 Model correctness

The system does not determine whether an AI's reasoning is objectively correct.

### 4.2 Moral correctness

The system does not define universal ethics.

### 4.3 Organizational policy

Verified Execution enforces or records applicable policy.

It does not decide what an organization ought to permit.

### 4.4 AI orchestration

The system is not an agent framework, workflow framework, planner, memory system, or model router.

### 4.5 Model internals

The system does not require access to private chain-of-thought or proprietary internal model state.

### 4.6 General observability

Verified Execution is not intended to replace application logging, tracing, metrics, SIEM systems, or infrastructure monitoring.

### 4.7 Universal prevention of harm

A conforming implementation cannot guarantee that every permitted Action is harmless.

It can establish whether execution followed the declared rules and produce evidence describing what occurred.

### 4.8 Blockchain dependence

Verified Execution does not require a blockchain.

Cryptographic verification mechanisms MAY use distributed ledgers in future specifications, but no ledger technology is fundamental to the architecture.

---

# 5. Normative Language

The key words:

**MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL**

are to be interpreted as normative requirements when written in uppercase.

In summary:

- **MUST / MUST NOT** — required for conformance.
- **SHOULD / SHOULD NOT** — expected unless a documented reason justifies deviation.
- **MAY** — optional.

Lowercase uses of these words are descriptive rather than normative.

---

# 6. Architectural Model

The minimum Verified Execution flow is:

```text
INTELLIGENT SYSTEM
        │
        │ proposes
        ▼
      ACTION
        │
        ▼
┌───────────────────────┐
│  EXECUTION BOUNDARY   │
│                       │
│  validate             │
│  evaluate             │
│  record               │
│  mediate              │
└───────────┬───────────┘
            │
            │ invokes
            ▼
         ADAPTER
            │
            ▼
     EXTERNAL SYSTEM
            │
            │ produces
            ▼
          RESULT
            │
            ▼
         EVENTS
            │
            ▼
         RECEIPT
```

The fundamental separation is:

```text
INTENT ≠ AUTHORITY ≠ EXECUTION ≠ EVIDENCE
```

An Action expresses intent.

The Execution Boundary determines whether execution may proceed under the applicable rules.

The Adapter performs the external interaction.

Events preserve history.

The Receipt represents the durable outcome of the Action.

---

# 7. The Action

## 7.1 Definition

An **Action** is the canonical representation of a request to produce a consequential external side effect.

An Action represents intent.

It does not itself represent permission or successful execution.

---

## 7.2 Action Identity

Every Action MUST have exactly one globally unique `action_id`.

The `action_id` MUST remain immutable for the lifetime of the Action.

Two distinct execution attempts MUST NOT share an `action_id`.

Retry semantics MAY associate multiple execution attempts with one Action only where the Action specification explicitly permits this and preserves attempt history.

---

## 7.3 Minimum Semantic Content

A conforming Action MUST identify, directly or by durable reference:

- the Action identity,
- the initiating actor or agent,
- the authority context under which it acts,
- the intended target,
- the intended operation,
- the operation arguments or payload,
- the creation time,
- and the specification version governing interpretation.

The concrete encoding is intentionally unspecified in VE-000.

---

## 7.4 Canonical Form

An implementation MUST transform governed execution requests into a canonical Action representation before external execution.

Vendor-specific representations such as:

- model tool calls,
- function calls,
- MCP requests,
- framework-specific commands,
- proprietary agent messages,

MUST NOT become the authoritative execution representation.

The canonical Action is authoritative.

---

## 7.5 Action Immutability

The semantic content of an accepted Action MUST NOT be silently modified.

If a material change is required, the implementation MUST either:

1. create a new Action, or
2. record an explicit transformation permitted by a future specification.

An implementation MUST NOT change the meaning of an Action while preserving its identity without producing evidence of that transformation.

---

## 7.6 Consequential Actions

A deployment MUST explicitly define which external effects fall within its Verified Execution boundary.

Any effect represented as governed by Verified Execution MUST NOT bypass the Execution Boundary.

Examples include:

- sending a message,
- modifying persistent data,
- transferring value,
- deploying code,
- changing permissions,
- issuing commands to physical systems,
- entering contractual or legal commitments,
- altering cloud resources.

The exact classification of consequentiality is deployment-specific.

The requirement to mediate declared consequential Actions is not.

---

# 8. The Event

## 8.1 Definition

An **Event** is an immutable statement that a meaningful fact occurred within the lifecycle of an Action.

Events constitute the authoritative historical record.

---

## 8.2 Event Identity

Every Event MUST have a unique `event_id`.

Every Event associated with an Action MUST reference its `action_id`.

---

## 8.3 Event Immutability

Once committed to the authoritative Event history, an Event MUST NOT be modified or deleted as part of normal system operation.

Corrections MUST be represented by additional Events.

The system MUST distinguish between:

```text
historical fact
```

and:

```text
current interpretation
```

A later Event MAY supersede the operational effect of an earlier Event.

It MUST NOT erase the earlier Event's existence.

---

## 8.4 Append-Only History

The authoritative history of an Action MUST be append-only.

Storage technology MAY vary.

Conformance depends on semantics, not the database product used.

A mutable relational database MAY participate in an implementation provided the authoritative Event history satisfies the append-only requirement.

---

## 8.5 Ordering

The system MUST preserve sufficient ordering information to reconstruct the lifecycle of each Action.

A total global ordering across all Actions is NOT REQUIRED by VE-000.

Per-Action causal ordering IS REQUIRED.

---

## 8.6 Event Content

An Event MUST contain or durably reference:

- `event_id`,
- `action_id`,
- event type,
- occurrence time or ordering evidence,
- originating component or authority,
- relevant event data,
- specification version.

Future specifications MAY require cryptographic integrity metadata.

---

# 9. State

## 9.1 State Is a Projection

The current state of an Action MUST be derivable from its Event history.

The authoritative source of historical truth MUST NOT be a mutable `status` field alone.

Implementations MAY maintain cached or indexed state for performance.

Such state MUST be treated as a projection.

If projected state conflicts with authoritative Event history, the Event history prevails.

---

## 9.2 Reconstruction

A conforming implementation MUST be capable of reconstructing the semantically relevant state of an Action from its authoritative Events.

Reconstruction SHOULD NOT require undocumented implementation knowledge.

---

# 10. Lifecycle

## 10.1 Definition

The **Lifecycle** defines the legal progression of an Action from creation to terminal outcome.

The Lifecycle is a semantic state machine.

---

## 10.2 Minimum Lifecycle

VE-000 defines the following conceptual progression:

```text
REQUESTED
    │
    ▼
VALIDATING
    │
    ├──────────────► REJECTED
    │
    ▼
VALIDATED
    │
    ▼
EVALUATING
    │
    ├──────────────► REJECTED
    │
    ├──────────────► WAITING
    │
    ▼
AUTHORIZED
    │
    ▼
EXECUTING
    │
    ├──────────────► FAILED
    │
    ▼
EXECUTED
    │
    ▼
COMPLETED
```

This representation is conceptual.

Individual lifecycle specifications MAY define more precise Events and intermediate states.

---

## 10.3 Legal Transitions

State transitions MUST be caused by recorded Events.

An implementation MUST NOT transition a governed Action through an unrecorded semantic state change.

---

## 10.4 Terminal Outcomes

An Action MUST eventually reach a defined terminal outcome or remain explicitly unresolved.

Terminal outcomes MAY include:

- `COMPLETED`,
- `FAILED`,
- `REJECTED`,
- `CANCELLED`.

Future specifications MAY introduce additional terminal outcomes.

---

## 10.5 No Historical Reversal

Lifecycle progression MUST NOT rewrite history.

A previously executed Action cannot become "unexecuted."

If compensating execution is required, it MUST be represented separately.

For example:

```text
ACTION A
Transfer $100
COMPLETED

ACTION B
Transfer $100 back
COMPLETED
```

Action B may compensate for Action A.

It does not erase Action A.

---

# 11. The Execution Boundary

## 11.1 Definition

The **Execution Boundary** is the controlled architectural boundary through which governed Actions MUST pass before causing external side effects.

It is the central trust boundary of Verified Execution.

---

## 11.2 Core Responsibility

The Execution Boundary MUST mediate the transition from intent to external execution.

At minimum, it MUST ensure that:

1. an Action exists,
2. the Action has valid identity,
3. required lifecycle conditions have been satisfied,
4. execution is recorded,
5. external invocation occurs through a conforming Adapter,
6. execution results are recorded.

---

## 11.3 Exclusivity

For an Action to be claimed as governed by Verified Execution, the external capability required to perform that Action MUST NOT remain simultaneously available to the AI through an uncontrolled path.

For example:

```text
NON-CONFORMING

AI ─────► Gmail API
 │
 └──────► Execution Boundary
```

The existence of the bypass destroys the enforcement property.

A conforming architecture requires:

```text
CONFORMING

AI
 │
 ▼
Execution Boundary
 │
 ▼
Gmail Adapter
 │
 ▼
Gmail API
```

---

## 11.4 Boundary Enforcement

Deployments SHOULD enforce boundary exclusivity through technical controls rather than convention.

Examples MAY include:

- credential isolation,
- capability-scoped tokens,
- network controls,
- API mediation,
- workload identity,
- secret separation.

The exact mechanism is implementation-specific.

---

## 11.5 Neutrality

The Execution Boundary MUST NOT define an organization's substantive policy.

It MAY execute or delegate policy evaluation.

Policy is an input into legitimacy.

The boundary is the mediator.

---

# 12. The Adapter

## 12.1 Definition

An **Adapter** is the component responsible for translating a canonical Action into the interface required by an external target system and translating the resulting response back into canonical execution evidence.

---

## 12.2 Adapter Responsibility

An Adapter MAY:

- validate target-specific parameters,
- translate canonical requests,
- invoke external APIs,
- handle target-specific protocol details,
- normalize responses,
- surface target-generated identifiers,
- report execution failure.

---

## 12.3 Adapter Prohibitions

An Adapter MUST NOT independently redefine:

- Action identity,
- organizational policy,
- authorization semantics,
- lifecycle semantics,
- or Receipt semantics.

An Adapter MUST NOT become a hidden second Execution Boundary.

---

## 12.4 Credential Handling

Adapters SHOULD receive only the minimum authority necessary to perform permitted operations.

AI systems SHOULD NOT directly possess the credentials used by protected Adapters.

---

## 12.5 Deterministic Interface

Given the same canonical Action and equivalent external state, an Adapter SHOULD interpret the Action consistently.

External systems themselves MAY introduce nondeterminism.

The Adapter MUST expose rather than conceal material differences in external results.

---

# 13. The Receipt

## 13.1 Definition

A **Receipt** is a durable evidence artifact representing the resolved outcome of an Action.

A Receipt is not merely a formatted log.

It is the canonical evidence summary of the Action's execution history.

---

## 13.2 Receipt Requirements

A Receipt MUST identify or durably reference:

- the Action,
- relevant lifecycle Events,
- execution outcome,
- target system,
- operation performed,
- execution time,
- relevant external result identifiers,
- evidence integrity information available at that specification version.

---

## 13.3 Receipt Integrity

A Receipt MUST NOT claim an outcome inconsistent with the authoritative Event history.

The Receipt is derived from history.

It does not replace history.

---

## 13.4 Receipt Uniqueness

For a given terminal resolution of an Action, the implementation MUST expose one canonical Receipt identity.

Equivalent serialized copies MAY exist.

Conflicting canonical Receipts for the same terminal Action MUST NOT exist.

---

## 13.5 Failure Receipts

A failed, rejected, or cancelled Action MAY produce a Receipt.

Future specifications SHOULD define when non-success terminal states require Receipts.

The long-term architecture SHOULD favor evidence for consequential non-execution as well as execution.

---

# 14. Evidence

Evidence is not introduced as a seventh core primitive.

Evidence is the durable information produced by the interaction of Actions, Events, lifecycle transitions, external results, and Receipts.

This distinction is deliberate.

Creating an additional primitive is unnecessary unless future requirements demonstrate that evidence requires semantics not expressible through the existing architecture.

Evidence MAY include:

- Event histories,
- identity assertions,
- policy results,
- approval records,
- timestamps,
- target-system identifiers,
- hashes,
- signatures,
- transparency records,
- Receipt data.

---

# 15. Legitimacy

## 15.1 Definition

Within Verified Execution, **legitimacy** means that an Action satisfied the declared conditions required for execution.

Legitimacy is not synonymous with:

- correctness,
- desirability,
- morality,
- safety,
- optimality.

An Action may be legitimate and still produce an undesirable result.

---

## 15.2 Legitimacy Conditions

The long-term legitimacy determination may include:

```text
Identity
+
Authority
+
Policy
+
Required Approval
+
Execution Integrity
+
Evidence Integrity
```

VE-000 does not yet standardize all of these mechanisms.

It establishes the lifecycle in which they operate.

---

## 15.3 No Self-Attestation

The requesting AI MUST NOT be treated as sufficient authority to declare its own Action legitimate.

The Execution Boundary MUST establish legitimacy independently of the model's assertion that execution is permitted.

---

# 16. Identity and Authority

Identity and authority are distinct.

Identity answers:

> **Who or what is acting?**

Authority answers:

> **What is it permitted to do, and on whose behalf?**

An implementation claiming authorization guarantees MUST preserve this distinction.

Future specifications will define portable identity and delegation semantics.

VE-000 requires only that execution evidence be capable of attributing an Action to an execution context.

---

# 17. Policy

Policy is not a core execution primitive.

Policy is a source of constraints applied to Actions at the Execution Boundary.

This distinction avoids coupling the universal execution model to any specific policy language or engine.

A future policy specification MAY define outcomes such as:

```text
ALLOW
DENY
REVIEW
```

but those values do not alter the underlying definition of Action, Event, Adapter, Receipt, or Execution Boundary.

---

# 18. Human Authority

Human approval does not require a separate architectural primitive.

Human authorization is represented through lifecycle Events and associated evidence.

For example:

```text
ACTION_REQUESTED

POLICY_EVALUATED

APPROVAL_REQUIRED

APPROVAL_GRANTED

EXECUTION_STARTED
```

This preserves the principle that human intervention is part of the execution history rather than an undocumented process outside it.

---

# 19. Core Invariants

A conforming implementation MUST preserve the following invariants.

### INV-001 — Action Identity

Every Action has exactly one immutable identity.

### INV-002 — Event Immutability

Committed Events are never silently mutated.

### INV-003 — Append-Only History

Historical correction occurs by addition, not deletion or rewriting.

### INV-004 — State Derivation

Authoritative Action state is derivable from Events.

### INV-005 — Execution Mediation

Every governed consequential Action crosses the Execution Boundary before external execution.

### INV-006 — No Protected Bypass

An AI cannot retain an uncontrolled execution path for a capability claimed to be protected by Verified Execution.

### INV-007 — Adapter Isolation

External target invocation occurs through an Adapter or an interface conforming to Adapter semantics.

### INV-008 — Receipt Consistency

A canonical Receipt cannot contradict authoritative Event history.

### INV-009 — Historical Execution

Executed Actions remain historically executed even if later compensated.

### INV-010 — Model Independence

Core execution semantics do not depend upon a specific AI model or model provider.

### INV-011 — Specification Authority

Implementation behavior claiming conformance must be explainable in terms of the applicable specification.

### INV-012 — Explicit Failure

Material execution failure must become visible in the Action history.

---

# 20. Failure Semantics

Failure is part of execution.

It MUST NOT be treated as an exceptional absence of evidence.

If an Adapter attempts external execution and the result is uncertain, the system MUST NOT falsely classify the Action as successfully executed or definitely unexecuted.

The system SHOULD represent uncertainty explicitly.

Examples include:

- timeout after request submission,
- external API acknowledged but response lost,
- network partition,
- ambiguous target result.

Future lifecycle specifications SHOULD define explicit indeterminate execution states.

Until then, implementations MUST preserve sufficient evidence to distinguish:

```text
known success

known failure

unknown outcome
```

This distinction is critical for consequential actions such as payments or destructive operations.

---

# 21. Idempotency and Retries

Retries can create duplicate real-world effects.

Therefore, implementations MUST treat execution retries as security-relevant behavior.

Adapters SHOULD support target-system idempotency mechanisms where available.

A retry MUST NOT be represented as if the original execution attempt never occurred.

Every material attempt MUST remain reconstructable.

Future specifications will define canonical attempt semantics.

---

# 22. Time

Wall-clock timestamps alone are insufficient to establish causal truth.

Implementations MUST preserve per-Action ordering independently of assumptions about perfectly synchronized clocks.

Timestamps SHOULD be recorded where available.

Future specifications MAY define trusted timestamping mechanisms.

---

# 23. Trust Model

Verified Execution does not eliminate trust.

It reduces, isolates, and makes trust assumptions explicit.

VE-000 assumes that a deployment may need to trust some combination of:

- its Execution Boundary implementation,
- credential infrastructure,
- storage system,
- external target systems,
- identity provider,
- host environment.

Future versions SHOULD progressively replace unnecessary trust assumptions with verifiable evidence.

The long-term objective is:

> **A verifier should need to trust as little of the execution operator as technically possible.**

---

# 24. Threat Model

A Verified Execution implementation SHOULD assume that one or more participating systems may behave incorrectly or maliciously.

Relevant threats include:

### 24.1 Model compromise

The AI intentionally or accidentally requests unauthorized Actions.

### 24.2 Prompt injection

Untrusted input causes the AI to request harmful execution.

### 24.3 Credential theft

An attacker obtains credentials capable of bypassing the Execution Boundary.

### 24.4 Event tampering

Historical evidence is modified or deleted.

### 24.5 Receipt forgery

Evidence is generated claiming execution states that did not occur.

### 24.6 Adapter compromise

An Adapter performs operations inconsistent with the canonical Action.

### 24.7 Policy bypass

Execution occurs without required policy evaluation.

### 24.8 Approval forgery

Human authorization is falsely asserted.

### 24.9 Replay

A previously authorized Action is executed again without new authorization.

### 24.10 Confused deputy

The system exercises greater authority than the requesting principal legitimately possessed.

### 24.11 Partial failure

Execution occurs externally but internal recording fails, or vice versa.

### 24.12 Insider manipulation

Authorized operators attempt to alter evidence or bypass controls.

VE-000 establishes architecture relevant to these threats but does not claim to fully mitigate all of them.

Detailed mitigations belong in subsequent security specifications.

---

# 25. Security Considerations

Verified Execution is itself security-critical infrastructure.

Therefore:

1. The Execution Boundary SHOULD operate under least privilege.
2. Protected external credentials SHOULD NOT be exposed directly to AI systems.
3. Event integrity SHOULD be independently detectable.
4. Receipt authenticity SHOULD eventually be cryptographically verifiable.
5. Sensitive Action payloads SHOULD support confidentiality protections.
6. Logs and evidence MUST NOT become uncontrolled repositories of secrets.
7. Authorization decisions SHOULD be attributable.
8. Retry behavior MUST be explicit.
9. Administrative override MUST leave evidence.
10. Boundary bypass MUST be treated as a violation of the trust model.

A system that produces excellent evidence but permits easy bypass is not meaningfully secure.

---

# 26. Privacy Considerations

Evidence requirements do not justify unlimited data retention.

Implementations SHOULD minimize sensitive data while preserving verifiability.

Where possible, systems SHOULD retain:

```text
proof of relevant fact
```

rather than:

```text
unnecessary underlying private data
```

Future specifications MAY introduce selective disclosure, commitments, or zero-knowledge techniques.

Privacy and verifiability SHOULD be treated as compatible design objectives rather than inherently opposing ones.

---

# 27. Conformance

VE-000 defines three preliminary conformance levels.

## 27.1 Level 1 — Mediated Execution

A Level 1 implementation MUST satisfy:

- canonical Action creation,
- Execution Boundary mediation,
- Adapter-based execution,
- immutable Event history,
- lifecycle reconstruction,
- Receipt generation for successful governed Actions,
- no uncontrolled bypass for protected capabilities.

This is the minimum reference implementation target.

---

## 27.2 Level 2 — Governed Execution

Level 2 includes Level 1 plus:

- explicit identity,
- policy evaluation,
- authorization evidence,
- human approval where required,
- stronger failure semantics.

Level 2 requirements will be formally defined by later specifications.

---

## 27.3 Level 3 — Verifiable Execution

Level 3 includes Level 2 plus:

- cryptographically verifiable evidence,
- tamper-evident history,
- signed Receipts,
- independent verification.

The cryptographic protocol is intentionally outside VE-000 v0.1.

---

# 28. Extensibility

Extensions MUST preserve core invariants.

An extension MUST NOT redefine the meaning of an existing primitive incompatibly while claiming compatibility with the same specification version.

Extensions MAY introduce:

- new Event types,
- new Adapter types,
- new policy systems,
- new identity schemes,
- new approval mechanisms,
- new evidence formats,
- new cryptographic proofs.

Extensions SHOULD prefer composition over new primitives.

---

# 29. New Primitive Test

Introducing a new architectural primitive is considered a breaking conceptual change.

Any proposal for a new primitive MUST demonstrate that the requirement cannot be represented coherently using the existing primitives.

The proposal MUST answer:

1. Is it consistent with the Founding Principles?
2. Why is a new primitive necessary?
3. Can the capability be expressed by composing existing primitives?
4. Can the proposed primitive be removed while preserving the architecture?
5. Will the abstraction remain meaningful in twenty years?
6. Can another engineering team implement it independently from the specification?
7. **Does it reduce the total conceptual complexity of the system?**

If the answer to the final question is no, the primitive MUST NOT be introduced.

---

# 30. Architectural Decision Test

Every significant architectural proposal SHOULD be evaluated against the following test:

### ADT-1

Is it consistent with the Founding Principles?

### ADT-2

Does it introduce a new architectural primitive?

If yes, the burden of proof is high.

### ADT-3

Can it be removed while preserving the architecture?

If yes, it is probably not fundamental.

### ADT-4

Will it still make sense in twenty years?

### ADT-5

Can another engineering team implement it independently from the specification?

### ADT-6

Does it reduce the total conceptual complexity of the system?

If not, it does not belong.

---

# 31. Complexity Budget

Complexity is treated as a cost borne by every future implementation, auditor, contributor, and operator.

New components MUST justify their existence.

A component SHOULD be introduced only when its presence reduces greater complexity elsewhere or is required to satisfy a system invariant.

Convenience alone is insufficient justification for a foundational component.

---

# 32. Interoperability

The long-term objective is that independently developed Verified Execution implementations can exchange and verify compatible Actions, Events, and Receipts.

VE-000 v0.1 does not define wire formats.

Future specifications SHOULD define canonical portable representations.

Interoperability MUST NOT require proprietary implementation knowledge.

---

# 33. Versioning

Every conforming artifact SHOULD identify the relevant specification version.

Future specification revisions MUST distinguish:

- backward-compatible clarification,
- backward-compatible extension,
- semantic change,
- breaking change.

Core primitive semantics SHOULD change only when implementation evidence demonstrates necessity.

---

# 34. Relationship Between Specification and Implementation

The specification is normative.

The reference implementation is evidentiary.

If the reference implementation contradicts an approved specification:

> **the implementation is wrong unless the specification is formally amended.**

Implementation convenience MUST NOT silently redefine architecture.

---

# 35. Reference Implementation Requirements

The first reference implementation SHOULD intentionally implement only the minimum architecture required for Level 1 conformance.

It SHOULD demonstrate:

```text
AI / simulated agent
        │
        ▼
Canonical Action
        │
        ▼
Execution Boundary
        │
        ▼
Adapter
        │
        ▼
External System
```

with an Event history sufficient to reconstruct:

```text
REQUESTED
VALIDATED
EXECUTION_STARTED
EXECUTED
COMPLETED
RECEIPT_GENERATED
```

Policy engines, distributed ledgers, advanced cryptography, multi-party approval, Kubernetes, and complex distributed infrastructure SHOULD NOT be required for the first implementation.

They do not belong until their necessity is demonstrated.

---

# 36. Example

Consider an AI attempting to send an email.

The AI proposes:

```json
{
  "target": "email",
  "operation": "send",
  "arguments": {
    "to": "customer@example.com",
    "subject": "Invoice",
    "body": "..."
  }
}
```

The execution system creates:

```text
Action A
```

The Event history may become:

```text
E1  ACTION_REQUESTED
E2  ACTION_VALIDATION_STARTED
E3  ACTION_VALIDATED
E4  EXECUTION_STARTED
E5  EXTERNAL_RESULT_RECEIVED
E6  ACTION_COMPLETED
E7  RECEIPT_GENERATED
```

The email Adapter performs the external API interaction.

The AI does not possess a separate direct email execution capability.

A Receipt references:

```text
Action A
Events E1–E7
External message identifier
Outcome
Execution timestamps
Evidence metadata
```

The precise serialization is defined elsewhere.

The architecture is defined here.

---

# 37. What VE-000 Protects

VE-000 protects the **structure of execution**.

It establishes that consequential execution has:

- identity,
- mediation,
- history,
- lifecycle,
- evidence.

Later specifications strengthen what can be proven about each property.

---

# 38. What VE-000 Cannot Yet Prove

VE-000 v0.1 alone cannot prove:

- that an identity was authentic,
- that policy itself was correct,
- that an approver was genuine,
- that stored Events were never tampered with,
- that an Adapter executed exactly the declared request,
- that an external system truthfully reported its result,
- that execution complied with law,
- that an AI's reasoning was correct.

These are explicit limitations.

They are not to be hidden behind the phrase "Verified Execution."

Subsequent specifications must close these gaps systematically.

---

# 39. Future Specification Family

VE-000 is intended to anchor a family of specifications.

The following identifiers are provisional:

```text
VE-000  Core
VE-001  Action
VE-002  Event
VE-003  Lifecycle
VE-004  Receipt
VE-005  Adapter
VE-006  Execution Boundary
VE-007  Policy
VE-008  Identity and Delegation
VE-009  Human Authorization
VE-010  Evidence Integrity
VE-011  Verification
VE-012  Security Model
```

These documents MUST refine rather than contradict VE-000 unless a later revision formally supersedes part of the Core Specification.

---

# 40. Open Questions

The following questions remain intentionally unresolved in v0.1.

### OQ-001 — What precisely constitutes an Action boundary?

When should several low-level API calls represent one Action versus several Actions?

### OQ-002 — How are retries represented?

Are attempts first-class Event sequences within an Action or separate related Actions?

### OQ-003 — What is the minimum canonical Action schema?

Which fields must be portable across all implementations?

### OQ-004 — Which terminal states require Receipts?

Should rejected and failed Actions always produce canonical Receipts?

### OQ-005 — How should uncertain external outcomes be modeled?

A dedicated state may be required.

### OQ-006 — Where does authorization terminate?

What semantic distinction should exist between authorization, policy satisfaction, and approval?

### OQ-007 — How should sensitive evidence be disclosed?

Verifiability must not require unnecessary exposure of private data.

### OQ-008 — What constitutes independent verification?

The verifier's minimum trust assumptions require formal definition.

### OQ-009 — How should Action relationships be represented?

Examples include compensation, delegation, parent-child Actions, and multi-step execution.

### OQ-010 — What exactly is a conforming Execution Boundary?

The deployment security model needs a formal specification.

These questions MUST NOT be prematurely resolved merely to accelerate implementation.

The reference implementation should generate evidence that helps answer them.

---

# 41. Criteria for v0.2

VE-000 SHOULD advance to v0.2 only after:

1. VE-001 through VE-006 have initial drafts.
2. A Level 1 reference implementation exists.
3. At least one real external Adapter has executed governed Actions.
4. Failure and retry behavior have been observed experimentally.
5. The Action lifecycle has been exercised end-to-end.
6. Open questions have been updated using implementation evidence.
7. No core primitive has required replacement.

---

# 42. Criteria for v1.0

VE-000 MUST NOT be designated `1.0` merely because implementation is complete.

A Core Specification v1.0 should require evidence of architectural stability.

At minimum:

- multiple Adapters,
- multiple Action categories,
- at least one independent implementation or meaningful interoperability exercise,
- stable Action/Event/Receipt semantics,
- formal security review,
- formal threat model,
- conformance tests,
- defined backward-compatibility policy,
- resolved foundational open questions.

Version `1.0` means the architecture has earned stability.

---

# 43. Revision History

## v0.1 — Initial Draft

Established:

- Action,
- Event,
- Lifecycle,
- Execution Boundary,
- Adapter,
- Receipt,
- core invariants,
- normative execution mediation,
- preliminary conformance levels,
- threat model,
- security considerations,
- extensibility rules,
- Architectural Decision Test,
- Complexity Budget,
- open questions,
- maturity criteria.

---

# 44. Foundational Statement

Verified Execution is based on one architectural separation:

```text
Intelligence may generate intent.

Intent does not imply authority.

Authority does not imply execution.

Execution does not imply legitimacy.

Legitimacy requires evidence.

Evidence should support verification.
```

The Execution Boundary exists to preserve those distinctions.

A conforming implementation must therefore ensure that consequential machine intent cannot silently become external consequence.

The ultimate standard is:

> **Every AI action is provably legitimate.**

VE-000 establishes the foundation required to make that statement technically meaningful.
