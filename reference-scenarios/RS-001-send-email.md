---
id: "RS-001"
title: "Send Email"
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
# RS-001 --- Send Email

**Status:** Executed as specification-based simulation\
**Scenario Type:** Successful consequential communication\
**Kernel Under Test:** VE-001 through VE-006\
**Implementation:** None\
**Method:** Manual replay against current normative semantics

## Purpose

Validate that the Verified Execution kernel can represent, govern,
execute, reconstruct, and verify a successful consequential AI action.

## Test Objective

User intent:

> Send Alice the signed contract.

The kernel passes only if it can: - represent one canonical Action; -
derive a deterministic Lifecycle; - produce authoritative Events; -
isolate translation inside an Adapter; - preserve authority inside the
Execution Boundary; - derive a Receipt; - reconstruct the final state
from history.

## Initial Conditions

Scenario fixtures:

-   Identity evaluation: PASS
-   Delegation evaluation: PASS
-   Policy evaluation: ALLOW
-   Human approval: NOT REQUIRED
-   Target: Configured email provider

## Consequential Effect

The Action is defined as:

> Submit one email message to the configured provider for delivery.

It explicitly does **not** claim that Alice received or read the email.

## VE-001 --- Canonical Action

``` yaml
action_id: ACT-RS001-001
operation: submit_email_for_delivery
recipient: alice@example.com
subject: Signed Contract
attachment: contract.pdf
```

Result: PASS

## VE-002 --- Event History

``` text
ACTION_CREATED
VALIDATION_STARTED
VALIDATION_SUCCEEDED
AUTHORIZATION_GRANTED
EXECUTION_STARTED
EXECUTION_COMPLETED
```

Result: PASS

## VE-003 --- Lifecycle

``` text
CREATED
↓
VALIDATING
↓
READY
↓
AUTHORIZED
↓
EXECUTING
↓
COMPLETED
```

Result: PASS

## VE-006 --- Execution Boundary

Responsibilities:

-   evaluate prerequisites
-   enforce Lifecycle
-   invoke Adapter
-   interpret observations
-   append authoritative Events
-   derive Receipt

Result: PASS

## VE-005 --- Adapter

Translates canonical Action into provider protocol.

Owns: - transport - serialization - provider authentication

Does not own: - authority - lifecycle - Event creation

## External Observation

``` yaml
observation:
  type: provider_accepted
  external_reference: msg-7F31A2
```

Observation is not an Event.

## VE-004 --- Receipt

``` yaml
receipt_id: REC-RS001-001
action_id: ACT-RS001-001
final_state: COMPLETED
terminal_event: EXECUTION_COMPLETED
external_reference: msg-7F31A2
```

Receipt summarizes history.

## Primitive Ownership Audit

  Responsibility   Primitive
  ---------------- --------------------
  Intent           Action
  History          Event
  Legality         Lifecycle
  Translation      Adapter
  Authority        Execution Boundary
  Portable Proof   Receipt

No ownership conflicts.

## GAP-RS001-001

Observation:

Completion semantics depend on Action semantics.

The Action must define an explicit completion predicate to avoid
different implementations assigning different meanings to COMPLETED.

Classification: Observation

Status: OPEN

## Kernel Scorecard

  Test                     Result
  ------------------------ --------------------
  Representability         PASS
  Ownership                PASS
  Determinism              PASS
  No New Primitive         PASS
  Cross-spec Consistency   PASS
  Truthfulness             PASS (Observation)
  Reconstruction           PASS
  Boundary Integrity       PASS
  Receipt Derivation       PASS

## Verdict

**PASS WITH GAP CANDIDATE**

The kernel successfully represents the scenario without additional
primitives.

Next scenario:

**RS-002 --- Bank Transfer (Successful Settlement)**
