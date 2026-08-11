# VE-003 — Lifecycle Specification

**Version:** 0.1  
**Status:** Draft  
**Category:** Core Primitive Specification  
**Identifier:** VE-003  
**Depends on:** VE-000, VE-001, VE-002  
**Project:** Verified Execution

---

## Abstract

This specification defines the **Lifecycle**, the deterministic transition model governing the evolution of an Action from creation to terminal resolution.

The Lifecycle defines:

- canonical lifecycle states,
- legal state transitions,
- triggering Events,
- terminal conditions,
- replay semantics,
- illegal transition handling,
- and conformance requirements.

The Lifecycle does **not** execute Actions, authorize them, evaluate policy, or store authoritative mutable state.

The Lifecycle is normative.

Events are authoritative history.

Current lifecycle state is a deterministic projection produced by replaying an Action's ordered Event history through the Lifecycle rules.

---

# 1. Purpose

The purpose of the Lifecycle primitive is to ensure that independent Verified Execution implementations can determine, from the same Action and authoritative Event history:

> **What lifecycle state is this Action in, and which state transitions are legally possible next?**

Without deterministic lifecycle semantics:

- identical histories could produce different current states,
- implementations could disagree about legal execution,
- Receipts could become incomparable,
- conformance could not be tested reliably,
- independent verification would be weakened.

The Lifecycle therefore defines the semantic state machine of an Action.

---

# 2. Scope

VE-003 defines:

- canonical lifecycle states,
- canonical lifecycle transition semantics,
- transition legality,
- terminal states,
- replay behavior,
- lifecycle-state derivation,
- handling of unknown and illegal transitions,
- distinction between lifecycle state, operational state, and projection state,
- normative human-readable and machine-readable transition representations.

VE-003 does not define:

- policy semantics,
- identity semantics,
- approval credentials,
- Adapter execution behavior,
- external-system transactional guarantees,
- Receipt serialization,
- cryptographic verification,
- orchestration queues,
- worker scheduling,
- retry backoff algorithms.

Those concerns belong elsewhere.

---

# 3. Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative when capitalized.

Their interpretation follows VE-000.

---

# 4. Definition

A **Lifecycle** is:

> **The deterministic set of legal semantic state transitions governing an Action from authoritative creation to terminal resolution.**

A Lifecycle consists of:

1. States
2. Transition rules
3. Triggering Events
4. Terminal conditions

No additional structure is required by VE-003 v0.1.

---

# 5. Lifecycle Is Not Current State

The Lifecycle is not the current state of an Action.

Formally:

```text
Lifecycle ≠ Current State
```

Instead:

```text
Action
+
Ordered Authoritative Event History
+
Lifecycle Rules
        │
        ▼
Derived Lifecycle State
```

The Lifecycle is stable semantic structure.

The derived state changes as Events accumulate.

---

# 6. Three Meanings of State

Verified Execution distinguishes three meanings of the word `state`.

## 6.1 Lifecycle State

The normative semantic state of an Action under VE-003.

Examples:

```text
CREATED
VALIDATING
READY
AUTHORIZED
EXECUTING
COMPLETED
```

Lifecycle State is part of the standard.

## 6.2 Operational State

Implementation-specific runtime information.

Examples:

```text
queued on worker 7
waiting 30 seconds before retry
network request in flight
adapter connection unavailable
```

Operational State is not part of VE-003 semantics.

## 6.3 Projection State

A cached or indexed representation derived from authoritative Events.

Example:

```text
current_state = EXECUTING
```

Projection State MAY be stored for efficiency.

It MUST NOT become authoritative when inconsistent with Event history.

---

# 7. Canonical States

VE-003 v0.1 defines the following lifecycle states.

```text
CREATED
VALIDATING
READY
WAITING_FOR_APPROVAL
AUTHORIZED
EXECUTING
COMPLETED
FAILED
REJECTED
CANCELLED
EXPIRED
```

No other state is part of the VE-003 v0.1 canonical lifecycle unless introduced by a compatible extension explicitly permitted by a later specification.

---

# 8. State Semantics

## 8.1 CREATED

The Action exists authoritatively but validation has not completed.

## 8.2 VALIDATING

Structural or semantic validation is in progress.

## 8.3 READY

Validation succeeded and the Action is eligible for authorization or approval evaluation.

`READY` does not imply authority to execute.

## 8.4 WAITING_FOR_APPROVAL

The Action requires an approval decision before authorization may be established.

## 8.5 AUTHORIZED

The Action has satisfied the authorization conditions required for execution under the applicable execution context.

`AUTHORIZED` does not imply that external execution has begun.

## 8.6 EXECUTING

At least one material external execution attempt has begun.

This state does not imply success.

## 8.7 COMPLETED

The governed execution resolved successfully according to the applicable Adapter and external target semantics.

`COMPLETED` is terminal.

## 8.8 FAILED

Execution began but resolved as a known failure.

`FAILED` is terminal in VE-003 v0.1.

A later new Action MAY retry or compensate.

## 8.9 REJECTED

The Action failed to satisfy a pre-execution requirement and execution did not begin under this lifecycle.

`REJECTED` is terminal.

## 8.10 CANCELLED

The Action was intentionally terminated before external execution began.

`CANCELLED` is terminal.

## 8.11 EXPIRED

The Action lost execution eligibility because an applicable temporal condition expired before execution began.

`EXPIRED` is terminal.

---

# 9. Terminal States

The following states are terminal:

```text
COMPLETED
FAILED
REJECTED
CANCELLED
EXPIRED
```

Once an Action reaches a terminal state, that Action MUST NOT transition to any other lifecycle state.

A later real-world corrective operation MUST be represented by another Action.

Terminality preserves historical truth.

---

# 10. Normative Artifact A — Canonical State Transition Table

The following table is normative.

It is the authoritative human-readable definition of legal lifecycle transitions in VE-003 v0.1.

| Current State | Triggering Event | Next State | Terminal Result |
|---|---|---|---|
| *(none)* | `ACTION_CREATED` | `CREATED` | No |
| `CREATED` | `VALIDATION_STARTED` | `VALIDATING` | No |
| `CREATED` | `ACTION_CANCELLED` | `CANCELLED` | Yes |
| `VALIDATING` | `VALIDATION_SUCCEEDED` | `READY` | No |
| `VALIDATING` | `VALIDATION_FAILED` | `REJECTED` | Yes |
| `VALIDATING` | `ACTION_CANCELLED` | `CANCELLED` | Yes |
| `READY` | `APPROVAL_REQUESTED` | `WAITING_FOR_APPROVAL` | No |
| `READY` | `AUTHORIZATION_GRANTED` | `AUTHORIZED` | No |
| `READY` | `AUTHORIZATION_DENIED` | `REJECTED` | Yes |
| `READY` | `ACTION_CANCELLED` | `CANCELLED` | Yes |
| `READY` | `ACTION_EXPIRED` | `EXPIRED` | Yes |
| `WAITING_FOR_APPROVAL` | `APPROVAL_GRANTED` | `AUTHORIZED` | No |
| `WAITING_FOR_APPROVAL` | `APPROVAL_DENIED` | `REJECTED` | Yes |
| `WAITING_FOR_APPROVAL` | `ACTION_CANCELLED` | `CANCELLED` | Yes |
| `WAITING_FOR_APPROVAL` | `ACTION_EXPIRED` | `EXPIRED` | Yes |
| `AUTHORIZED` | `EXECUTION_STARTED` | `EXECUTING` | No |
| `AUTHORIZED` | `ACTION_CANCELLED` | `CANCELLED` | Yes |
| `AUTHORIZED` | `AUTHORIZATION_EXPIRED` | `EXPIRED` | Yes |
| `EXECUTING` | `EXECUTION_COMPLETED` | `COMPLETED` | Yes |
| `EXECUTING` | `EXECUTION_FAILED` | `FAILED` | Yes |

---

# 11. Exhaustiveness Rule

The canonical transition table is exhaustive.

Any state transition not explicitly listed in Section 10 is illegal under VE-003 v0.1.

This includes, for example:

```text
COMPLETED → EXECUTING
REJECTED → AUTHORIZED
FAILED → EXECUTING
CANCELLED → READY
EXPIRED → AUTHORIZED
CREATED → EXECUTING
READY → COMPLETED
```

A conforming implementation MUST reject an illegal transition as authoritative lifecycle history.

---

# 12. Normative Artifact B — Canonical Lifecycle Diagram

**Architectural View: Conceptual State Machine**

The following diagram is normative and expresses the same legal transitions as the canonical transition table.

```text
                                  ACTION_CREATED
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │   CREATED   │
                                 └──────┬──────┘
                                        │
                               VALIDATION_STARTED
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │ VALIDATING  │
                                 └──────┬──────┘
                         ┌──────────────┼──────────────┐
                         │              │              │
              VALIDATION_SUCCEEDED      │       VALIDATION_FAILED
                         │              │              │
                         ▼              │              ▼
                   ┌──────────┐         │       ┌──────────┐
                   │  READY   │         │       │ REJECTED │
                   └────┬─────┘         │       └──────────┘
                        │               │
           ┌────────────┼────────────┐  │
           │            │            │  │
APPROVAL_REQUESTED  AUTHORIZATION_   │  │
                    GRANTED           │  │
           │            │            │  │
           ▼            ▼            │  │
┌──────────────────┐ ┌────────────┐   │  │
│ WAITING_FOR_     │ │ AUTHORIZED │   │  │
│ APPROVAL         │ └──────┬─────┘   │  │
└───────┬──────────┘        │         │  │
        │                   │         │  │
  ┌─────┴──────┐     EXECUTION_STARTED│  │
  │            │            │         │  │
APPROVAL_  APPROVAL_         ▼         │  │
GRANTED    DENIED      ┌────────────┐   │  │
  │            │       │ EXECUTING  │   │  │
  │            ▼       └─────┬──────┘   │  │
  │      ┌──────────┐    ┌───┴────┐     │  │
  │      │ REJECTED │    │        │     │  │
  │      └──────────┘ EXECUTION_ EXECUTION_
  │                   COMPLETED  FAILED │  │
  │                       │        │     │  │
  └──────────────►┌────────────┐ ┌────────┐│
                  │ AUTHORIZED │ │ FAILED ││
                  └────────────┘ └────────┘│
                                           │
                             cancellation / expiration
                             from permitted pre-execution
                             states only
```

For avoidance of ambiguity, the state transition table in Section 10 takes precedence if visual rendering of this diagram is unclear.

---

# 13. Normative Artifact C — Canonical Machine-Readable Lifecycle Definition

VE-003 v0.1 defines the following machine-readable transition model.

The semantics are normative.

YAML is the canonical publication encoding for v0.1, but future specifications MAY define a serialization-neutral schema.

```yaml
ve_lifecycle:
  specification: "VE-003"
  version: "0.1"

  initial:
    event: ACTION_CREATED
    state: CREATED

  states:
    CREATED:
      terminal: false
      transitions:
        VALIDATION_STARTED: VALIDATING
        ACTION_CANCELLED: CANCELLED

    VALIDATING:
      terminal: false
      transitions:
        VALIDATION_SUCCEEDED: READY
        VALIDATION_FAILED: REJECTED
        ACTION_CANCELLED: CANCELLED

    READY:
      terminal: false
      transitions:
        APPROVAL_REQUESTED: WAITING_FOR_APPROVAL
        AUTHORIZATION_GRANTED: AUTHORIZED
        AUTHORIZATION_DENIED: REJECTED
        ACTION_CANCELLED: CANCELLED
        ACTION_EXPIRED: EXPIRED

    WAITING_FOR_APPROVAL:
      terminal: false
      transitions:
        APPROVAL_GRANTED: AUTHORIZED
        APPROVAL_DENIED: REJECTED
        ACTION_CANCELLED: CANCELLED
        ACTION_EXPIRED: EXPIRED

    AUTHORIZED:
      terminal: false
      transitions:
        EXECUTION_STARTED: EXECUTING
        ACTION_CANCELLED: CANCELLED
        AUTHORIZATION_EXPIRED: EXPIRED

    EXECUTING:
      terminal: false
      transitions:
        EXECUTION_COMPLETED: COMPLETED
        EXECUTION_FAILED: FAILED

    COMPLETED:
      terminal: true
      transitions: {}

    FAILED:
      terminal: true
      transitions: {}

    REJECTED:
      terminal: true
      transitions: {}

    CANCELLED:
      terminal: true
      transitions: {}

    EXPIRED:
      terminal: true
      transitions: {}
```

A conforming implementation SHOULD be able to derive its lifecycle validator directly from an equivalent representation.

---

# 14. Precedence Between Normative Artifacts

VE-003 contains three normative lifecycle representations:

1. Canonical State Transition Table
2. Canonical Lifecycle Diagram
3. Canonical Machine-Readable Lifecycle Definition

They MUST express equivalent semantics.

If an editorial or rendering inconsistency appears:

1. the transition table governs human semantic interpretation,
2. the machine-readable model governs machine conformance fixtures once validated against the table,
3. the diagram is normative but subordinate in ambiguity resolution.

A discrepancy among these artifacts is a specification defect and MUST be corrected before Approval.

---

# 15. Triggering Events

A lifecycle transition occurs only when an authoritative Event that is defined as transition-causing is appended to the Action's Event history.

Not every Event changes lifecycle state.

Examples of Events that MAY be evidentiary without causing lifecycle change include:

```text
POLICY_EVALUATED
EXTERNAL_REQUEST_IDENTIFIER_RECORDED
SIGNATURE_GENERATED
RECEIPT_GENERATED
```

The existence of an Event does not imply a state transition unless VE-003 or a compatible extension defines one.

---

# 16. Event-to-State Determinism

For every legal transition:

```text
Current Lifecycle State
+
Triggering Event Type
=
Exactly One Next Lifecycle State
```

A canonical transition MUST NOT produce more than one possible next state.

Therefore, VE-003's transition function is deterministic.

---

# 17. State Reconstruction

A conforming implementation MUST be capable of reconstructing lifecycle state from:

```text
Action
+
Ordered authoritative Event stream
+
Applicable Lifecycle version
```

The implementation MUST NOT require a mutable authoritative status record to reconstruct state.

---

# 18. Replay Algorithm

A conforming replay implementation SHALL behave semantically as follows:

```text
state := NONE

for each authoritative Event in causal order:

    if Event causes no lifecycle transition:
        continue

    if state == NONE:
        require Event == ACTION_CREATED
        state := CREATED
        continue

    transition := lifecycle[state][Event.type]

    if transition does not exist:
        fail lifecycle validation

    state := transition

return state
```

This algorithm is illustrative pseudocode.

Its semantics are normative.

---

# 19. Replay Determinism

Given identical:

- Action semantics,
- Event types,
- Event order,
- VE-003 version,

all conforming implementations MUST derive the same lifecycle state or the same invalid-history determination.

This is a core interoperability invariant.

---

# 20. Invalid Histories

An Event stream is lifecycle-invalid if it contains a transition-causing Event that is illegal from the state derived immediately before it.

Example:

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
EXECUTION_STARTED
```

This is invalid because:

```text
READY → EXECUTING
```

is not a legal transition.

A conforming implementation MUST NOT silently reinterpret such history as valid.

---

# 21. Unknown Events

An Event type unknown to the applicable Lifecycle specification MUST NOT silently advance lifecycle state.

If the Event is known to VE-002 but not transition-causing under VE-003, it MAY be ignored for lifecycle projection while remaining part of history.

If its semantics cannot be safely determined, the implementation SHOULD surface an explicit compatibility or validation condition rather than guess.

---

# 22. Cancellation Semantics

Cancellation is legal only in the pre-execution states listed in Section 10.

In VE-003 v0.1:

```text
CREATED
VALIDATING
READY
WAITING_FOR_APPROVAL
AUTHORIZED
```

may transition to `CANCELLED`.

`EXECUTING` may not transition to `CANCELLED`.

This decision is deliberate.

Once `EXECUTION_STARTED` becomes authoritative, the external side effect may already be irreversible or indeterminate.

A request to stop ongoing execution MAY be operationally attempted, but VE-003 does not call the original Action `CANCELLED` after execution has begun.

A later corrective effect, if needed, requires another Action.

---

# 23. Expiration Semantics

Expiration applies only before execution begins.

`ACTION_EXPIRED` represents expiration of general Action eligibility.

`AUTHORIZATION_EXPIRED` represents expiration of an authorization condition after the Action has reached `AUTHORIZED`.

Both lead to the terminal state:

```text
EXPIRED
```

Expiration MUST NOT erase prior validation, approval, or authorization Events.

---

# 24. Rejection Semantics

`REJECTED` means a required pre-execution condition definitively prevented execution under the current Action lifecycle.

Examples include:

- structural validation failure,
- authorization denial,
- approval denial.

Rejection is terminal.

A materially revised request requires a new Action.

---

# 25. Failure Semantics

`FAILED` means external execution began and resolved as a known failure.

VE-003 v0.1 deliberately distinguishes:

```text
REJECTED
```

from:

```text
FAILED
```

because:

```text
REJECTED → execution did not begin
FAILED   → execution began
```

This distinction is evidentiary and security-relevant.

---

# 26. Indeterminate Outcomes

VE-000 identifies uncertain external outcomes as a critical problem.

VE-003 v0.1 does **not** introduce an `INDETERMINATE` state.

This is intentional.

The question remains unresolved because introducing such a state affects:

- terminal semantics,
- retry safety,
- Receipt semantics,
- Adapter guarantees,
- reconciliation behavior.

Until formally resolved, an implementation MUST NOT falsely translate an uncertain external outcome into `COMPLETED` or `FAILED`.

An implementation encountering an uncertain external result MUST preserve the relevant Events and surface the Action as lifecycle-unresolved outside any false terminal claim.

This limitation MUST be revisited before VE-003 reaches stable 1.0.

---

# 27. Retry Semantics

`RETRYING` is not a canonical lifecycle state in VE-003 v0.1.

Retries are operational or attempt-level behavior unless they create a semantically new Action.

A retry MUST NOT:

- erase prior execution attempts,
- rewrite lifecycle history,
- silently duplicate external effects.

Because `FAILED` is terminal in v0.1, retrying after a known failed terminal resolution requires a new Action unless a later specification introduces explicit attempt semantics that preserve the current invariants.

---

# 28. Compensation

Compensation never rewinds lifecycle state.

Example:

```text
Action A
COMPLETED
```

followed by:

```text
Action B
compensates: Action A
```

Action A remains `COMPLETED`.

Action B receives its own lifecycle.

This preserves historical truth.

---

# 29. Approval and Authorization

Approval and authorization are distinct concepts.

Approval may be one input to authorization.

The canonical lifecycle therefore permits:

```text
READY
  │
  ├── AUTHORIZATION_GRANTED ──► AUTHORIZED
  │
  └── APPROVAL_REQUESTED ─────► WAITING_FOR_APPROVAL
```

and:

```text
WAITING_FOR_APPROVAL
  │
  └── APPROVAL_GRANTED ────────► AUTHORIZED
```

The system responsible for deciding whether approval is required belongs outside VE-003.

VE-003 defines only which lifecycle transitions are legal once the corresponding authoritative Event occurs.

---

# 30. Lifecycle Does Not Decide

The Lifecycle MUST NOT decide:

- whether policy permits execution,
- whether a principal possesses authority,
- whether approval is required,
- whether an Adapter can perform an operation,
- whether execution is desirable.

It answers only:

> **Given the current lifecycle state and an authoritative Event, is this transition legal, and what state results?**

---

# 31. Lifecycle Versioning

Every Action lifecycle projection MUST be interpreted under an identifiable Lifecycle specification version.

An implementation MUST NOT silently replay historical Actions under changed lifecycle semantics if doing so could produce a different state.

Lifecycle semantic changes therefore require explicit version governance.

---

# 32. Extensions

A later specification MAY define additional states or transitions only if:

- the extension is versioned,
- compatibility behavior is explicit,
- core invariants remain satisfied,
- the Architectural Decision Test is passed,
- total conceptual complexity is reduced or required guarantees cannot otherwise be represented.

Extensions MUST NOT silently redefine the meaning of an existing VE-003 v0.1 state.

---

# 33. Forbidden Lifecycle Patterns

The following patterns are prohibited by VE-003 v0.1.

## 33.1 Backward Mutation

```text
COMPLETED → EXECUTING
```

## 33.2 Terminal Resurrection

```text
FAILED → READY
```

## 33.3 Implicit Transition

Changing a mutable status field without a transition-causing Event.

## 33.4 Ambiguous Transition

One Event type producing multiple possible next states from the same current state.

## 33.5 Silent Skip

```text
CREATED → AUTHORIZED
```

without required intermediate lifecycle history.

---

# 34. Conformance Requirements

An implementation conforms to VE-003 v0.1 if it satisfies all of the following.

### LIF-C01 — Deterministic Projection

Identical valid Event histories produce identical lifecycle states.

### LIF-C02 — Exhaustive Transition Enforcement

Transitions absent from the canonical table are rejected as lifecycle-invalid.

### LIF-C03 — Terminal Integrity

Terminal states cannot transition further.

### LIF-C04 — Event-Driven State

Semantic lifecycle state changes occur only through authoritative transition-causing Events.

### LIF-C05 — Replay

Lifecycle state can be reconstructed without relying on mutable authoritative status.

### LIF-C06 — Projection Subordination

Cached projection state cannot override authoritative Event history.

### LIF-C07 — Operational Separation

Implementation-specific operational state does not redefine lifecycle semantics.

### LIF-C08 — Compensation Integrity

Compensation does not modify prior lifecycle history.

### LIF-C09 — Execution Distinction

`REJECTED` and `FAILED` remain semantically distinct based on whether execution began.

### LIF-C10 — No False Resolution

Uncertain external outcomes are not falsely represented as `COMPLETED` or `FAILED`.

---

# 35. Minimum Conformance Test Vectors

## Test 1 — Successful execution

Input:

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
AUTHORIZATION_GRANTED
EXECUTION_STARTED
EXECUTION_COMPLETED
```

Expected state:

```text
COMPLETED
```

## Test 2 — Approval path

Input:

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
APPROVAL_REQUESTED
APPROVAL_GRANTED
EXECUTION_STARTED
EXECUTION_COMPLETED
```

Expected state:

```text
COMPLETED
```

## Test 3 — Validation rejection

Input:

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_FAILED
```

Expected state:

```text
REJECTED
```

## Test 4 — Illegal skip

Input:

```text
ACTION_CREATED
EXECUTION_STARTED
```

Expected:

```text
INVALID LIFECYCLE HISTORY
```

## Test 5 — Terminal resurrection

Input:

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
AUTHORIZATION_DENIED
AUTHORIZATION_GRANTED
```

Expected:

```text
INVALID LIFECYCLE HISTORY
```

## Test 6 — Cancellation before execution

Input:

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
AUTHORIZATION_GRANTED
ACTION_CANCELLED
```

Expected state:

```text
CANCELLED
```

## Test 7 — Cancellation after execution begins

Input:

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
AUTHORIZATION_GRANTED
EXECUTION_STARTED
ACTION_CANCELLED
```

Expected:

```text
INVALID LIFECYCLE HISTORY
```

## Test 8 — Expired authorization

Input:

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
AUTHORIZATION_GRANTED
AUTHORIZATION_EXPIRED
```

Expected state:

```text
EXPIRED
```

---

# 36. Architectural Decision Test

## ADT-1 — Founding Principles

The Lifecycle is consistent with immutable history, derived state, and evidence-based trust.

## ADT-2 — Primitive Necessity

Lifecycle is a core primitive because Events alone describe facts but do not define which progressions of facts constitute legal Action evolution.

## ADT-3 — Removability

Removing Lifecycle causes transition legality to become implementation-specific.

The standard would lose deterministic state semantics.

Therefore Lifecycle is fundamental.

## ADT-4 — Durability

State-machine semantics are independent of current AI models, frameworks, vendors, and deployment technology.

## ADT-5 — Independent Implementability

The transition table and machine-readable definition permit independent implementations.

## ADT-6 — Complexity Reduction

One canonical Lifecycle replaces potentially inconsistent state machines across every Adapter, application, and model integration.

It therefore reduces total conceptual complexity.

---

# 37. Open Questions

## OQ-LIF-001 — Indeterminate Execution

Should a canonical `INDETERMINATE` state be introduced for external outcomes that cannot be classified as known success or known failure?

This question is high priority.

## OQ-LIF-002 — Execution Attempts

Should execution attempts remain Event patterns or become a formally specified subordinate construct?

Default assumption: no new primitive.

## OQ-LIF-003 — Retry After Failure

Should a known failed Action ever remain non-terminal to permit retry under the same Action identity?

v0.1 says no.

Implementation evidence is required before changing this.

## OQ-LIF-004 — Cancellation During Execution

Should a future semantic distinction exist between `CANCEL_REQUESTED` and actual external stoppage?

v0.1 keeps this operational rather than lifecycle-level.

## OQ-LIF-005 — Approval Expiration

Should approval expiration and authorization expiration remain separate event semantics?

## OQ-LIF-006 — Multiple Approval Requirements

Can complex approval structures remain non-lifecycle evidence while preserving one `WAITING_FOR_APPROVAL` state?

The default assumption is yes.

## OQ-LIF-007 — Composite Actions

How should parent and child Action lifecycle resolution interact without coupling lifecycle state across Actions?

---

# 38. Criteria for v0.2

VE-003 SHOULD advance to v0.2 only after the reference implementation has exercised:

- successful execution,
- validation rejection,
- authorization denial,
- approval flow,
- cancellation,
- expiration,
- known execution failure,
- uncertain external outcomes,
- retries,
- compensation,
- parent-child Actions.

The implementation MUST specifically test whether the current state set remains sufficient without introducing operational states into the semantic Lifecycle.

---

# 39. Criteria for Approval

VE-003 v0.1 SHOULD NOT move from Draft to Approved until:

1. the transition table, diagram, and machine-readable definition are proven semantically equivalent,
2. VE-001 and VE-002 terminology is consistent,
3. conformance test vectors are machine-executable,
4. indeterminate outcome handling is demonstrated not to create false terminal claims,
5. no canonical state exists solely for implementation convenience.

---

# 40. Revision History

## v0.1 — Initial Draft

Established:

- Lifecycle as a deterministic transition model,
- distinction between Lifecycle and current state,
- Lifecycle State / Operational State / Projection State distinction,
- canonical state set,
- exhaustive transition table,
- formal state diagram,
- machine-readable lifecycle definition,
- replay semantics,
- terminal-state integrity,
- cancellation semantics,
- expiration semantics,
- rejection/failure distinction,
- conformance requirements,
- minimum test vectors,
- unresolved indeterminate-execution question.

---

# 41. Foundational Rule

The Lifecycle exists to preserve one property:

> **The same history must mean the same thing everywhere.**

Given the same:

```text
Action
+
Events
+
Lifecycle Version
```

every conforming implementation must derive the same semantic result.

That is what turns immutable history into interoperable execution semantics.
