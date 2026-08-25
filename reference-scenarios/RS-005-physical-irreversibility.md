---
id: RS-005-PHYSICAL-IRREVERSIBILITY
title: Physical Irreversibility and Safety-Interlock Evidence
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Reference Scenario
author: Verified Execution Editorial Board
created: 2026-08-24
updated: 2026-08-24
depends_on: []
related_documents:
  - RS-005
  - KERNEL-GAP-ANALYSIS-0.2
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
maturity: Executed as specification-based simulation
supersedes: null
superseded_by: null
---

# RS-005 — Physical Irreversibility

## Status and authority boundary

This scenario is a non-normative, specification-based simulation. It
does not replace the retained `RS-005-robotic-arm-command.md` placeholder
and does not create a new architectural concept.

It applies the authority classification in
`KERNEL-GAP-ANALYSIS-v0.2.md`:

- VE-001 is Approved and makes completion-relevant meaning semantic
  Action content.
- VE-002 through VE-006 are Draft normative specifications.
- Safety PLC readings, robot-controller telemetry, and this scenario are
  evidence; they are not accepted authority by themselves.

## 1. Governing question

For a robotic-arm command that crosses a defined point of physical
irreversibility, can schema-defined completion criteria plus
authoritative safety/interlock observations distinguish attempted motion,
known completion, known failure, and unavailable post-motion feedback
without adding a lifecycle state, a Commit primitive, a new execution
primitive, a special physical-resource primitive, or another
architectural concept?

## 2. Industrial operation

A six-axis assembly robot presses a keyed actuator cartridge into a
regulated industrial valve body. The commanded operation is bounded as:

> Insert cartridge `C-8821` into valve body `V-204` until the cartridge
> is latched at a measured depth of 30.0 mm and the safety PLC confirms
> the fixture is safe.

The operation is consequential because an incorrectly seated cartridge
can make the valve unsafe for service.

### 2.1 Point of physical irreversibility

At 12.0 mm insertion depth, the cartridge's tamper seal is pierced. The
seal cannot be restored without replacing the cartridge and reworking the
valve body. Crossing this threshold is a physical fact; it is **not** a
Lifecycle state, terminal result, primitive, or commit fact.

### 2.2 Safety/interlock signals

The robot cell exposes these target-specific observations through its
Adapter:

- `light_curtain_clear` — motion-permit interlock is satisfied;
- `fixture_clamped` — valve body is held in the approved fixture;
- `force_limit_trip` — insertion force exceeded the safe threshold;
- `depth_mm` — encoder-derived insertion depth;
- `target_latch_closed` — fixture sensor reports the 30.0 mm latch;
- `safety_plc_sequence` — monotonically ordered cell-controller record.

These are observations. The Execution Boundary, not the Adapter, decides
whether an observation becomes an authoritative Event under the
applicable execution profile.

## 3. Canonical Action and completion criterion

```yaml
action_id: ACT-RS005-001
operation: insert_valve_actuator_cartridge
arguments:
  cartridge_id: C-8821
  valve_body_id: V-204
  target_depth_mm: 30.0
  safety_profile: cell-safe-insert-v1
completion_criteria:
  all_of:
    - target_latch_closed == true
    - depth_mm >= 30.0
    - light_curtain_clear == true
    - fixture_clamped == true
    - safety_plc_sequence confirms final insertion cycle
```

`completion_criteria` is scenario/schema detail, not a newly standardized
universal VE-001 field. It is semantic Action content because changing it
changes the requested external effect and the legitimate meaning of
completion.

The irreversible threshold is also action/profile-relevant context for
evidence interpretation, but it does not itself establish completion.

## 4. Execution Boundary and Adapter roles

Before invocation, the Execution Boundary validates the canonical Action,
checks authorization and applicable approval, confirms the Action is in
`AUTHORIZED`, and confirms the applicable cell-safety profile.

The Adapter then translates the canonical Action into vendor-controller
commands and returns target-specific observations. It does not authorize
motion or append Events.

The Boundary may record profile-specific facts such as
`SAFETY_INTERLOCK_CONFIRMED`, `IRREVERSIBLE_THRESHOLD_REACHED`,
`TARGET_STATE_VERIFIED`, or `POST_MOTION_FEEDBACK_UNAVAILABLE`. These are
descriptive Event names used by this simulation, not proposed canonical
Lifecycle states or new primitives. Only `EXECUTION_STARTED`,
`EXECUTION_COMPLETED`, and `EXECUTION_FAILED` cause the Lifecycle
transitions used below.

## 5. Common event and lifecycle rules

The following use current Draft VE-003 transition rules:

```text
AUTHORIZED + EXECUTION_STARTED   → EXECUTING
EXECUTING + EXECUTION_COMPLETED  → COMPLETED
EXECUTING + EXECUTION_FAILED     → FAILED
```

No branch introduces `INDETERMINATE`, `PARTIALLY_COMMITTED`,
`IRREVERSIBLE`, or `PHYSICAL_COMMIT` as a Lifecycle state or primitive.
When feedback is unavailable, the no-false-resolution rule leaves the
Action `EXECUTING` until an authoritative terminal fact is available.

## 6. Execution branches

### A. Command accepted; motion completes; completion evidence available

#### Observations

```text
light_curtain_clear
fixture_clamped
motion_started
depth_mm = 12.0
tamper_seal_pierced
depth_mm = 30.0
target_latch_closed
safety_plc_sequence = final-cycle-confirmed
```

#### Authoritative Events and Lifecycle

```text
ACTION_CREATED
VALIDATION_SUCCEEDED
AUTHORIZATION_GRANTED
SAFETY_INTERLOCK_CONFIRMED
EXECUTION_STARTED                 → EXECUTING
IRREVERSIBLE_THRESHOLD_REACHED
TARGET_STATE_VERIFIED
EXECUTION_COMPLETED               → COMPLETED
```

The non-transition events preserve why completion was legitimate. The
terminal transition is caused only by `EXECUTION_COMPLETED`.

#### Receipt and conclusion

A Receipt may be derived after `COMPLETED`. Under Draft VE-004, it proves
the terminal Lifecycle resolution and, when the applicable profile
recognizes the PLC record as execution evidence, the established
execution outcome. It does not prove future valve reliability or erase
the distinction between motion and completion.

Physical motion occurred, but the Action completed only because the full
completion criteria were established. Crossing the irreversible point
does not require a new architectural concept.

**Branch disposition:** Representable with existing concepts; no new architecture demonstrated.

### B. Command accepted; motion begins; safety interlock stops movement before completion

#### Observations

```text
light_curtain_clear
fixture_clamped
motion_started
depth_mm = 7.0
light_curtain_blocked
safety_controller_stop_acknowledged
```

The irreversible threshold was not crossed.

#### Authoritative Events and Lifecycle

```text
ACTION_CREATED
VALIDATION_SUCCEEDED
AUTHORIZATION_GRANTED
SAFETY_INTERLOCK_CONFIRMED
EXECUTION_STARTED                 → EXECUTING
SAFETY_INTERLOCK_TRIPPED
EXECUTION_FAILED                  → FAILED
```

`FAILED`, rather than `REJECTED`, is correct because material external
execution began. The safety stop is profile-specific evidence for known
failure, not a new state.

#### Receipt and conclusion

A Receipt may be derived after `FAILED`. It proves that the Action
reached known terminal failure under the recorded safety evidence; it
does not claim that no physical motion occurred.

Physical motion does not imply Action completion. No new Lifecycle state,
Commit primitive, or physical-resource primitive is required.

**Branch disposition:** Representable with existing concepts; no new architecture demonstrated.

### C. Irreversible point crossed; completion evidence proves target state

#### Observations

```text
motion_started
depth_mm = 12.0
tamper_seal_pierced
controller_link_lost_after_threshold
independent_safety_plc_sequence = final-cycle-confirmed
target_latch_closed = true
depth_mm = 30.0
```

The controller link is unavailable after the irreversible point, but the
independently recognized safety PLC record and fixture sensors establish
the target state.

#### Authoritative Events and Lifecycle

```text
EXECUTION_STARTED                 → EXECUTING
IRREVERSIBLE_THRESHOLD_REACHED
CONTROLLER_FEEDBACK_UNAVAILABLE
TARGET_STATE_VERIFIED
EXECUTION_COMPLETED               → COMPLETED
```

The Boundary must evaluate the full completion criteria, not infer
success solely from irreversible motion or a lost controller link.

#### Receipt and conclusion

A Receipt may be derived after `COMPLETED`. It proves the terminal result
only to the scope established by the Action criteria and the recognized
PLC/fixture evidence. It does not turn the threshold crossing itself into
a commit primitive.

Physical motion and seal piercing alone do not imply Action completion.
The known target state is what permits `EXECUTION_COMPLETED`.

**Branch disposition:** Representable with existing concepts; no new architecture demonstrated.

### D. Irreversible point crossed; post-motion feedback unavailable

#### Observations

```text
motion_started
depth_mm = 12.0
tamper_seal_pierced
communications_lost
no final PLC sequence available
no target_latch_closed reading available
```

#### Authoritative Events and Lifecycle

```text
EXECUTION_STARTED                 → EXECUTING
IRREVERSIBLE_THRESHOLD_REACHED
POST_MOTION_FEEDBACK_UNAVAILABLE
```

No authoritative evidence establishes the target state or a known wrong
terminal state. The Boundary appends neither `EXECUTION_COMPLETED` nor
`EXECUTION_FAILED`; the Action remains `EXECUTING`.

#### Receipt and conclusion

No terminal Receipt is derived under the current Draft VE-004 generation
rule because the Lifecycle is not terminal. A later authoritative PLC
record may support either terminal Event. Until then, absence of feedback
does not authorize a success or failure claim.

Physical motion and threshold crossing do not imply Action completion.
The no-false-resolution rule represents this safely without a new state,
Commit primitive, or physical-resource primitive.

**Branch disposition:** Representable with existing concepts; no new architecture demonstrated.

### E. Irreversible point crossed; authoritative evidence proves wrong terminal state

#### Observations

```text
motion_started
depth_mm = 12.0
tamper_seal_pierced
force_limit_trip
depth_mm = 22.4
safety_plc_sequence = stopped-before-target
target_latch_closed = false
```

#### Authoritative Events and Lifecycle

```text
EXECUTION_STARTED                 → EXECUTING
IRREVERSIBLE_THRESHOLD_REACHED
SAFETY_FORCE_LIMIT_TRIPPED
TARGET_STATE_NOT_REACHED
EXECUTION_FAILED                  → FAILED
```

The cartridge cannot be assumed reversible merely because the requested
target was not reached. That physical consequence is preserved as
evidence, while the Action's declared completion criterion is known not
to have been satisfied.

#### Receipt and conclusion

A Receipt may be derived after `FAILED`. It proves known failure of the
specified insertion outcome and may bind the safety/PLC evidence. It does
not prove that no irreversible physical change occurred.

Physical motion and an irreversible consequence do not equal successful
completion. Existing `FAILED` semantics are sufficient.

**Branch disposition:** Representable with existing concepts; no new architecture demonstrated.

## 7. Pressure-test answers

| Question | Result |
|---|---|
| Does physical motion imply Action completion? | No. `EXECUTION_STARTED` establishes an attempt; only the Action's full completion criteria support `EXECUTION_COMPLETED`. |
| Does crossing the irreversible point require a new architectural concept? | No. It is a profile-specific observed fact and possible evidence input. |
| Is a new Lifecycle state required? | No. `EXECUTING`, `COMPLETED`, and `FAILED` distinguish all five branches without false resolution. |
| Is a Commit primitive required? | No. A recognized external target state/evidence may support an execution outcome or Receipt, but it does not create a kernel primitive. |
| Is a special physical-resource primitive required? | No. The valve body, cartridge, cell, and safety profile remain Action arguments and execution-profile context. |
| Can unavailable feedback be handled safely? | Yes. Branch D remains `EXECUTING` and produces no false terminal Event or terminal Receipt. |

## 8. Observed gaps

| Gap | Classification | Evidence | Required follow-up |
|---|---|---|---|
| Exact canonical representation of physical completion criteria, irreversible thresholds, and safety evidence | SPECIFICATION GAP | All branches | Action-schema/execution-profile detail. |
| Exact vocabulary and binding rules for target-specific safety and motion observations | SPECIFICATION GAP | A–E | Adapter/Execution-Boundary observation profile detail. |
| Exact Receipt evidence bindings for physical actions, including known failure and unresolved feedback | SPECIFICATION GAP | B–E | Event/Receipt profile detail and Draft consistency review. |
| Physical operation cannot be represented by the current concepts | No gap demonstrated | A–E | None. |

No IMPLEMENTATION GAP was demonstrated because this is a manual
specification-based simulation. No ARCHITECTURAL GAP was demonstrated.

## 9. Proposed next cadence step

Record the physical-action completion/evidence detail as input to the
existing governed Action-schema and Adapter/Execution-Boundary profile
work. Do not create an RFC or ADR unless a later scenario demonstrates
that this detail cannot be expressed without an architectural change.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-24 | Initial physical-irreversibility reference scenario. |

## 10. Scenario verdict

PASS — existing architecture sufficient
