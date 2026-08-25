---
id: KERNEL-GAP-ANALYSIS-0.2
title: Kernel Gap Analysis — RS-001 through RS-004 Closure
version: "0.2"
status: Draft
document_type: Analysis Record
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-08-24
updated: 2026-08-24
depends_on: []
related_documents:
  - KERNEL-GAP-ANALYSIS-0.1
  - RS-001
  - RS-002
  - RS-003
  - RS-004
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
  - OPEN-DECISIONS
  - ARCHITECTURE-INDEX
  - RFC-005
supersedes: null
superseded_by: null
maturity: Non-normative validation closure
---

# Kernel Gap Analysis v0.2

## Purpose and authority boundary

This record closes the RS-001 through RS-004 kernel-validation cycle. It
preserves the historical observations in
`KERNEL-GAP-ANALYSIS-v0.1.md`, including GAP-001, OBS-002, and OBS-003,
but re-evaluates them against the repository authority available on
2026-08-24.

This is non-normative validation. It does not modify an approved
specification, accept a Draft RFC, or resolve an Open Decision Register
item. The authority order and statuses in `ARCHITECTURE_INDEX.md` control
when sources disagree.

In particular:

- VE-001 is Approved.
- VE-002 through VE-006 are Draft normative specifications.
- RFC-005 is Draft and is not authority for completion semantics.
- Scenarios, pressure tests, and `KERNEL_VALIDATION.md` are evidence,
  not accepted architecture.

## Summary

The four scenarios establish that a completion criterion is necessary to
interpret successful external execution truthfully. They do **not**
establish that every Action needs a new universal field, a new lifecycle
state, a new primitive, or a new authority relationship.

VE-001 already classifies completion semantics as semantic Action
content when they affect the proposed effect. VE-003 supplies the
distinction between `EXECUTING`, `COMPLETED`, and `FAILED`; VE-005 and
VE-006 place target observations and their authoritative interpretation
on opposite sides of the Execution Boundary; and VE-004 distinguishes
terminal lifecycle state from execution outcome. The latter four
specifications remain Draft and require consistency/detail work before
they can serve as stable implementation authority.

## 1. Scenario-by-scenario consolidation

### RS-001 — Send email

| Item | Finding |
|---|---|
| Scenario purpose | Test a successful consequential communication without claiming recipient reading or receipt. |
| Kernel/property tested | Canonical intent, pre-execution authority, authoritative history, adapter isolation, lifecycle replay, and terminal receipt derivation. |
| What happened | The provider accepted submission; the scenario treated that acceptance as the bounded Action effect and recorded `EXECUTION_COMPLETED`. |
| Validated finding | A completion claim must match the bounded Action effect. Provider acceptance may establish submission, but does not establish delivery, reading, or a broader outcome. |
| Gap exposed | The scenario used a completion meaning without identifying a normative schema/profile representation for that criterion. |
| Current authority | VE-001 §7 makes completion semantics semantic Action content. Draft VE-005/VE-006 constrain the Adapter to observations and the Execution Boundary to authoritative Event creation. |
| Current status | **SPECIFICATION GAP** |

No new primitive is indicated. The remaining work is to specify, for an
applicable Action schema or execution profile, the criterion that turns a
provider observation into `EXECUTION_COMPLETED`.

### RS-002 — Bank transfer with successful settlement

| Item | Finding |
|---|---|
| Scenario purpose | Test a high-consequence transfer with approval and settlement semantics. |
| Kernel/property tested | Authorization before execution, approval history, settlement evidence, deterministic terminal resolution, and Receipt derivation. |
| What happened | The bank reported settlement; the Boundary interpreted that observation as satisfying the Action's stated settlement condition and appended `EXECUTION_COMPLETED`. |
| Validated finding | Authorization and request submission are not settlement. A transfer is complete only when the declared settlement condition is established. |
| Gap exposed | The scenario's `completion_predicate` is expressly a hypothesis, not a normative VE-001 field. The exact criterion and required evidence are not yet specified for this Action class. |
| Current authority | VE-001 distinguishes intent from execution and includes completion semantics in Semantic Payload when effect-relevant. Draft VE-003 defines `EXECUTION_COMPLETED → COMPLETED`; Draft VE-004 distinguishes lifecycle terminal state from execution outcome. |
| Current status | **SPECIFICATION GAP** |

The gap is criterion/evidence detail for a financial schema or profile. It
does not require a financial primitive, a settlement primitive, or a new
Lifecycle state.

### RS-003 — Bank transfer with uncertain outcome

| Item | Finding |
|---|---|
| Scenario purpose | Test truthfulness after transmission when the external outcome cannot be established. |
| Kernel/property tested | Separation of attempt, outcome, Event authority, lifecycle derivation, and receipt truth. |
| What happened | The request was transmitted, but no definitive banking response arrived. The Action remained `EXECUTING`; neither completion nor known failure was asserted. |
| Validated finding | Request transmission, timeout, and absent response do not establish settlement or failure. Operational states such as reconciliation or manual review need not become semantic Lifecycle states. |
| Gap exposed | The scenario validates the need for precise observation/event and evidence requirements for unresolved execution. It does not validate an `INDETERMINATE` Lifecycle state. |
| Current authority | Draft VE-003 §26 prohibits false `COMPLETED` or `FAILED` results for uncertain outcomes and requires preservation of relevant Events. Draft VE-004 defines an explicit `UNCERTAIN` execution outcome while retaining the distinction from lifecycle terminal state. |
| Current status | **SPECIFICATION GAP** |

The present limitation is that these protections are Draft, and the exact
event/evidence profile remains underspecified. The scenario does not show
that the current state model is architecturally inadequate.

### RS-004 — Software deployment

| Item | Finding |
|---|---|
| Scenario purpose | Test multi-step execution, partial progress, automatic recovery, known failure, and later compensation. |
| Kernel/property tested | Semantic-versus-operational boundary, completion truth, authoritative history, compensation, and Adapter isolation. |
| What happened | Intermediate rollout observations remained operational while the Action was `EXECUTING`. A completed rollout became `COMPLETED`; an automatic rollback before the criterion was satisfied became `FAILED`; a later operator rollback was modeled as a new compensating Action. |
| Validated finding | Partial progress need not create semantic state. Recovery contained in the authorized execution may remain implementation mechanics; independently chosen corrective intent is another Action. |
| Gap exposed | The deployment criterion and the observation-to-event evidence threshold are schema/profile detail. No deployment, rollback, recovery, or workflow primitive was required. |
| Current authority | VE-001 §29 requires compensation to be a new Action. Draft VE-003 preserves terminal history and separates compensation from resurrection; Draft VE-005/VE-006 reserve interpretation and Event authority to the Boundary. |
| Current status | **SPECIFICATION GAP** |

The approved Action compensation rule resolves the historical-truth
portion. The remaining detail is the governed definition of rollout
completion and its supporting evidence.

## 2. Cross-scenario findings

### Facts already expressible in current repository authority

The following are supported by the existing architecture, subject to the
document statuses stated above:

| Finding | Existing concept(s) |
|---|---|
| Authorization precedes protected execution. | Execution Boundary; VE-006 Draft. |
| History is authoritative and lifecycle state is derived. | Event and Lifecycle; VE-002/VE-003 Draft. |
| An execution attempt is not a successful result. | VE-001 Approved distinction between intent and execution; VE-003 Draft `EXECUTING`. |
| A target observation is not automatically authoritative history. | Adapter and Execution Boundary; VE-005/VE-006 Draft. |
| A later correction does not rewrite prior truth. | VE-001 Approved compensation rule; VE-003 Draft terminality. |
| Receipt is derived and does not create truth. | VE-004 Draft. |

### Missing specification detail

The scenarios justify detail in these areas:

1. An Action schema or execution profile must define the observable
   condition that constitutes completion for that Action class.
2. The applicable Boundary/profile must define what evidence is enough
   to interpret an Adapter observation as an authoritative terminal
   Event.
3. Event and Receipt profiles need interoperable detail for submission,
   known failure, uncertain outcome, and target references.
4. Retry/idempotency and attempt recording remain profile work. The
   four scenarios constrain them—no erased attempts and no silent
   duplicate effects—but do not yet supply a completed retry scenario.

### Missing architecture

No missing architecture was demonstrated.

In particular, the evidence does not justify:

- an `INDETERMINATE` Lifecycle state;
- a completion primitive;
- a recovery, deployment, settlement, or workflow primitive;
- a new authority relationship between Adapter and Execution Boundary;
- treating operational progress as semantic lifecycle state.

### Execution versus completion

“Execution occurred” and “the intended outcome is complete” are not the
same proposition.

`EXECUTION_STARTED` establishes that a material external attempt began.
`EXECUTION_COMPLETED` is legitimate only when the applicable completion
criterion is established from the relevant observation/evidence. The
criterion is Action/schema-specific; it may be provider acceptance for a
bounded email-submission Action, settlement for a transfer, or declared
rollout health for a deployment.

## 3. Completion-semantics decision

## RFC NOT REQUIRED

A new RFC is not justified by RS-001 through RS-004. The scenarios do
not require a new primitive, authority relationship, canonical state, or
semantic change to an approved primitive.

VE-001 already requires completion semantics to be canonical Semantic
Payload when they affect the proposed effect. The needed work is to make
completion criteria explicit in applicable Action schemas or execution
profiles and to specify the corresponding Boundary observation/evidence
rules. That is ordinary specification clarification/detail under the
existing Action, Event, Lifecycle, Adapter, Execution Boundary, and
Receipt roles.

No Draft RFC, pressure test, or validation hypothesis is treated here as
accepted authority. RFC-005 concerns representation and signature
portability, not completion semantics, and remains Draft.

## 4. Existing concepts and location of further work

No Architectural Decision Test is run because this analysis does not
propose an architectural change.

The existing concepts carrying the required semantics are:

| Need | Existing concept | Further specification location |
|---|---|---|
| Bounded intended effect and completion-relevant meaning | Action; VE-001 Approved | Action schema/profile completion-criterion definition. |
| Attempt and terminal-resolution legality | Lifecycle; VE-003 Draft | Transition/event conformance detail, preserving no-false-resolution rules. |
| Historical facts and evidence references | Event; VE-002 Draft | Event vocabulary and evidence-binding detail. |
| External translation and observations | Adapter; VE-005 Draft | Target-observation profile detail. |
| Authority to interpret observations | Execution Boundary; VE-006 Draft | Observation-to-Event interpretation requirements. |
| Portable resolved-outcome summary | Receipt; VE-004 Draft | Receipt outcome/evidence profile detail. |

Any future proposal for a universal completion field or state must first
show that schema/profile detail cannot express the required behavior
without changing the approved Action semantics. This cycle did not show
that.

## 5. Open gaps after RS-001 through RS-004

| Gap | Source scenario(s) | Classification | Current authority | Required next artifact | Blocking RS-005? |
|---|---|---|---|---|---|
| Completion criterion representation and evidence threshold | RS-001, RS-002, RS-003, RS-004 | Specification gap | VE-001 Approved constrains completion-relevant meaning; VE-003/VE-005/VE-006 Draft constrain lifecycle and observation handling | Governed Action-schema or execution-profile specification detail | No |
| Interoperable terminal and uncertain-outcome evidence | RS-002, RS-003, RS-004 | Specification gap | VE-003 and VE-004 Draft prohibit false terminal/commit claims | Event/Receipt profile detail and Draft consistency review | No |
| Retry/idempotency attempt semantics | RS-002, RS-003 | Still unresolved / insufficient evidence | VE-001 §30–31 and VE-003 §27 constrain behavior | A completed retry/idempotency scenario before a profile is specified | No |
| Partial-progress observation granularity | RS-004 | Specification gap | VE-005/VE-006 Draft separate observations from authoritative Events | Adapter/Boundary observation profile detail | No |

No row is an architectural gap. The table does not add tasks to
`SPECIFICATION_TASKS.md` or change `OPEN_DECISIONS.md`.

## 6. RS-005 gate

RS-005 STATUS:
UNBLOCKED

This analysis completes the RS-001 through RS-004 cycle and makes the
RFC decision explicit: **RFC NOT REQUIRED**. The remaining work is
specification detail, not an unresolved architectural decision that
blocks the next scenario.

RS-005 must not be written by this change. Its single proposed question
is:

> For a robotic-arm command that crosses a defined point of physical
> irreversibility, can a schema-defined completion criterion and
> authoritative safety/interlock observation distinguish attempted
> motion, known completion, known failure, and unavailable post-motion
> feedback without adding a lifecycle state or a new execution primitive?

This question is concrete, tests irreversible execution, does not repeat
the prior communication, settlement, or deployment scenarios, and can
falsify the current assumption that the existing concepts are sufficient.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-08-24 | Formal closure of the RS-001 through RS-004 validation cycle; no architectural change proposed. |
