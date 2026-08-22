---
id: RS-INDEX
title: Verified Execution Reference Scenario Index
version: 1.0
status: Active
document_type: Scenario Index
category: Validation
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - ARCHITECTURE-INDEX
supersedes: null
superseded_by: null
---

# Reference Scenario Index

Reference scenarios pressure-test specifications. They are non-normative unless an approved specification explicitly adopts their required behavior.

| ID | File | Maturity | Purpose |
|---|---|---|---|
| RS-001 | `RS-001-send-email.md` | Substantive | Communication execution and lifecycle baseline |
| RS-002 | `RS-002-bank-transfer.md` | Substantive | Financial execution and successful settlement |
| RS-003 | `RS-003-bank-transfer-uncertain-outcome.md` | Substantive | Submission, uncertainty, and non-equivalence of authorization and commit |
| RS-004 | `RS-004-software-deployment.md` | Substantive | Multi-step execution and recovery boundary |
| RS-005 | `RS-005-robotic-arm-command.md` | Placeholder | Physical-system execution; requires full scenario specification |
| RS-006 | — | Reserved | Not assigned |
| RS-007 | `RS-007-rejected-action.md` | Placeholder | Rejection semantics |
| RS-008 | `RS-008-timeout-after-submission.md` | Placeholder | Timeout and uncertain external outcome |
| RS-009 | `RS-009-duplicate-request.md` | Placeholder | Content equality, occurrence identity, idempotency, and replay |
| RS-010 | `RS-010-cancel-before-execution.md` | Placeholder | Cancellation before protected execution |
| RS-011–014 | — | Reserved | Not assigned |
| RS-015 | `RS-015-update-medical-record.md` | Placeholder | Protected record mutation and authority |

## Maturity definitions

- **Placeholder:** title or minimal prompt only; no validation claim may depend on it.
- **Draft:** contains a complete scenario but has not completed gap analysis.
- **Substantive:** contains actors, authority, action, execution path, outcomes, and findings sufficient for current pressure testing.
- **Validated:** completed scenario plus linked gap analysis with disposition.
- **Normative:** explicitly incorporated into an approved conformance specification.

## Numbering rule

IDs are stable and MUST NOT be silently renumbered. A retired scenario remains listed as Withdrawn or Superseded. Reserved gaps may be filled only by a new, documented assignment.
