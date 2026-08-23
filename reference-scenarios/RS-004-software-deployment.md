---
id: "RS-004"
title: "Software Deployment"
version: "0.1"
status: "Active"
document_type: "Reference Scenario"
category: "Reference Scenario"
author: "Verified Execution Editorial Board"
created: 2026-08-11
updated: 2026-08-11
depends_on: []
related_documents:
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
maturity: "Executed as specification-based simulation"
supersedes: null
superseded_by: null
---
# RS-004 — Software Deployment

**Status:** Executed as specification-based simulation  
**Scenario Type:** Consequential infrastructure change  
**Kernel Under Test:** VE-001 through VE-006  
**Implementation:** None  
**Method:** Manual replay against current normative semantics

---

# Purpose

Validate that the Verified Execution kernel can govern a multi-step software deployment while preserving semantic truth, immutable history, and primitive ownership.

User intent:

> Deploy release **v2.4.0** of the payments service to production.

---

# 1. Test Objective

The kernel passes only if it can:

- represent the deployment as one canonical Action;
- distinguish semantic intent from implementation mechanics;
- preserve deterministic Lifecycle replay;
- isolate platform-specific execution inside an Adapter;
- authorize execution through the Execution Boundary;
- derive a coherent Receipt;
- correctly model rollback and compensation without introducing new primitives.

---

# 2. Initial Conditions

Scenario fixtures:

- Identity evaluation: PASS
- Policy evaluation: ALLOW
- Human approval: REQUIRED
- Approval outcome: GRANTED
- Target platform: Production deployment platform
- Environment: Production

---

# 3. Consequential Effect

The Action does **not** mean:

- every deployment step succeeded;
- the software is bug free;
- the service will remain healthy forever.

The Action means:

> Release **v2.4.0** becomes the active production release and the deployment platform reports rollout complete under its declared health criteria.

---

# 4. VE-001 — Canonical Action

```yaml
action_id: ACT-RS004-001
spec_version: VE-001/0.1

operation: deploy_release

arguments:
  service: payments-service
  release: v2.4.0
  environment: production

completion_predicate:
  type: rollout_completed
  health_criteria: satisfied
```

`completion_predicate` is a scenario hypothesis, not yet a normative VE-001 field.

Evaluation:

- Immutable Action identity ✔
- One consequential effect ✔
- Vendor-independent semantics ✔

**Result: PASS**

---

# 5. Action Boundary Test

Deployment internally performs many operations:

- upload artifact
- create new instances
- run health checks
- shift traffic
- retire previous instances

These are implementation mechanics.

Unless independently governed, they remain inside one semantic Action.

**Result: PASS**

---

# 6. VE-002 — Event History

```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
APPROVAL_REQUESTED
APPROVAL_GRANTED
EXECUTION_STARTED
EXECUTION_COMPLETED
```

Events preserve historical truth.

**Result: PASS**

---

# 7. VE-003 — Lifecycle Replay

```text
CREATED
→ VALIDATING
→ READY
→ WAITING_FOR_APPROVAL
→ AUTHORIZED
→ EXECUTING
→ COMPLETED
```

Replay is deterministic.

**Result: PASS**

---

# 8. VE-006 — Execution Boundary

The Execution Boundary verifies:

- Action validity
- Identity
- Policy
- Approval
- Lifecycle legality

Only then does it authorize protected execution and invoke the Adapter.

**Result: PASS**

---

# 9. VE-005 — Deployment Adapter

The Adapter translates:

```text
deploy_release(v2.4.0)
```

into deployment-platform operations.

The Adapter owns:

- protocol translation
- deployment API calls
- serialization
- target authentication

The Adapter does **not** own:

- Action semantics
- Lifecycle
- Event authority
- Receipt derivation

---

# 10. Intermediate Observations

During rollout the platform reports:

- artifact uploaded
- new instances created
- 50% traffic shifted
- health checks passing

These are Execution Observations.

They are **not** authoritative Events.

The Lifecycle remains:

```text
EXECUTING
```

---

# 11. Successful Completion

The deployment platform reports:

```text
rollout complete
release active
health criteria satisfied
```

Adapter reports:

```yaml
observation_type: rollout_completed
deployment_id: dep-9442
```

The Execution Boundary evaluates the observation against the completion predicate and appends:

```text
EXECUTION_COMPLETED
```

Lifecycle becomes:

```text
EXECUTING
→ COMPLETED
```

**Result: PASS**

---

# 12. VE-004 — Receipt

```yaml
receipt_id: REC-RS004-001
receipt_version: 0.1
action_id: ACT-RS004-001
final_state: COMPLETED
terminal_event_id: EXECUTION_COMPLETED
external_reference: dep-9442
```

The Receipt summarizes terminal resolution.

It does not claim:

- the release contains no bugs;
- future availability is guaranteed.

**Result: PASS**

---

# 13. Rollback Attack

Suppose rollout reaches 60%.

Health checks begin failing.

The deployment platform automatically restores the previous release.

The final external state is:

```text
v2.3.9 active
v2.4.0 inactive
```

Can the Action become `REJECTED`?

No.

Execution already began.

Can it become `COMPLETED`?

No.

The completion predicate failed.

The Execution Boundary appends:

```text
EXECUTION_FAILED
```

Lifecycle:

```text
EXECUTING
→ FAILED
```

---

# 14. Compensation Test

Suppose deployment completed successfully.

Ten minutes later an operator intentionally restores the previous version.

That rollback represents **new intent**.

It is modeled as:

```text
Action A:
Deploy v2.4.0

Action B:
Rollback to v2.3.9

relationship:
compensates Action A
```

Action A remains completed.

History is immutable.

Action B has its own Action, Events, Lifecycle, and Receipt.

**Result: PASS**

---

# 15. Primitive Ownership Audit

| Responsibility | Primitive |
|---|---|
| Deployment intent | Action |
| Historical facts | Event |
| Legal progression | Lifecycle |
| Platform translation | Adapter |
| Execution authority | Execution Boundary |
| Terminal proof | Receipt |

No ownership conflicts discovered.

**Result: PASS**

---

# 16. New Primitive Test

Did this scenario require:

- Deployment
- Rollback
- Workflow
- Recovery

as new core primitives?

No.

Automatic platform recovery remains execution mechanics.

Independent corrective intent becomes a new Action.

**Result: PASS**

---

# 17. GAP-001 Re-evaluation

RS-004 independently confirms the same structural requirement discovered in:

- RS-001
- RS-002
- RS-003

An Action requires explicit completion semantics.

Evidence now spans:

- Communication
- Finance
- Distributed failure
- Software deployment

Maturity:

**Architectural Hypothesis — Strong**

---

# 18. OBS-003 — Recovery Boundary

Observation:

Automatic recovery already included within authorized execution semantics may remain part of the original Action.

Independently chosen corrective execution requires a new Action.

Status:

Observation

---

# 19. Kernel Scorecard

| Test | Result |
|---|---|
| Representability | PASS |
| Primitive ownership | PASS |
| Lifecycle determinism | PASS |
| No new primitive | PASS |
| Completion truthfulness | PASS |
| Compensation semantics | PASS |
| Historical integrity | PASS |
| Adapter isolation | PASS |
| Operational/Semantic separation | PASS |
| Receipt coherence | PASS |
| Boundary integrity | PASS |

---

# 20. Overall Verdict

**PASS WITH TWO ARCHITECTURAL OBSERVATIONS**

The six-primitives kernel successfully models:

- multi-step execution,
- approval,
- operational progress,
- successful completion,
- known failure,
- automatic recovery,
- later compensation.

No new primitive was required.

The strongest architectural hypothesis remains:

> Every canonical Action requires explicit completion semantics defining the externally observable condition that authorizes `EXECUTION_COMPLETED`.

## Next Scenario

**RS-005 — Robotic Arm Command**

Objective:

Validate the kernel against irreversible physical consequences.
