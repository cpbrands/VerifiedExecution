---
id: "RS-002"
title: "Bank Transfer Successful Settlement"
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
# RS-002 — Bank Transfer (Successful Settlement)

**Status:** Executed as specification-based simulation  
**Scenario Type:** Successful financial settlement  
**Kernel Under Test:** VE-001 through VE-006  
**Implementation:** None  
**Method:** Manual replay against current normative semantics

## Purpose
Validate that the Verified Execution kernel can govern a high-consequence financial action with explicit settlement semantics, human approval, and durable evidence.

## Test Objective
User intent:

> Transfer CAD 10,000 from the Operating Account to the Vendor Account.

Completion means confirmed settlement under the banking system's declared settlement semantics.

## Initial Conditions
- Identity: PASS
- Policy: ALLOW
- Human approval: REQUIRED and GRANTED
- Bank API: AVAILABLE
- Settlement: SUCCESSFUL

## VE-001 — Canonical Action
```yaml
action_id: ACT-RS002-001
spec_version: VE-001/0.1
operation: settle_bank_transfer
arguments:
  amount: 10000
  currency: CAD
  source_account: operating
  destination_account: vendor
  reference: Invoice-2026-117
completion_predicate:
  type: bank_settlement_confirmed
```

`completion_predicate` is a scenario hypothesis, not yet a normative VE-001 field.

**Result: PASS**

## VE-002 — Event History
```text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
APPROVAL_REQUESTED
APPROVAL_GRANTED
EXECUTION_STARTED
EXECUTION_COMPLETED
```

**Result: PASS**

## VE-003 — Lifecycle Replay
```text
CREATED
→ VALIDATING
→ READY
→ WAITING_FOR_APPROVAL
→ AUTHORIZED
→ EXECUTING
→ COMPLETED
```

**Result: PASS**

## VE-005 — Bank Adapter
The Adapter owns target authentication, request serialization, bank API invocation, and target-specific identifiers.

It does not own Action identity, authorization, Lifecycle legality, authoritative Event creation, or Receipt semantics.

## External Observation
```yaml
observation_type: settlement_confirmed
transaction_id: tx-93841
settlement_reference: stl-55219
settled_amount: 10000
currency: CAD
```

This is an Execution Observation, not an authoritative Event.

## VE-006 — Observation Interpretation
The Execution Boundary evaluates the observation against the Action's completion semantics.

Settlement is confirmed, so it appends:

```text
EXECUTION_COMPLETED
```

Lifecycle becomes `COMPLETED`.

**Result: PASS**

## VE-004 — Receipt
```yaml
receipt_id: REC-RS002-001
receipt_version: 0.1
action_id: ACT-RS002-001
lifecycle_version: VE-003/0.1
final_state: COMPLETED
terminal_event_id: E007
external_reference: stl-55219
```

**Result: PASS**

## Reconstruction Test
Given the Action, Event history, and VE-003/0.1, an independent implementation derives `COMPLETED`.

**Result: PASS**

## Primitive Ownership Audit
| Responsibility | Primitive |
|---|---|
| Intent | Action |
| History | Event |
| Legality | Lifecycle |
| Translation | Adapter |
| Authority | Execution Boundary |
| Portable proof | Receipt |

No ownership conflict discovered.

## GAP-001 — Completion Semantics
RS-002 independently reproduces the issue discovered in RS-001.

Different interpretations of `transfer` could produce materially different meanings of `COMPLETED`.

**Hypothesis:** Every canonical Action requires explicit completion semantics defining the externally observable condition under which the Execution Boundary may legitimately append `EXECUTION_COMPLETED`.

**Evidence:** RS-001, RS-002  
**Maturity:** Architectural Hypothesis  
**Status:** OPEN

## Kernel Scorecard
| Test | Result |
|---|---|
| Representability | PASS |
| Ownership | PASS |
| Determinism | PASS |
| No new primitive | PASS |
| Cross-spec consistency | PASS |
| Truthfulness | PASS |
| Reconstruction | PASS |
| Boundary integrity | PASS |
| Human approval branch | PASS |
| Receipt derivation | PASS |

## Overall Verdict
**PASS WITH ARCHITECTURAL HYPOTHESIS STRENGTHENED**

The six-primitives kernel successfully models successful financial settlement without architectural extension.
