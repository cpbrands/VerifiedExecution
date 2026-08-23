---
id: ARCHITECTURE-INDEX
title: Verified Execution Architecture Authority Index
version: 1.0
status: Active
document_type: Governance Index
category: Architecture
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - FOUNDING-PRINCIPLES
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Verified Execution Architecture Authority Index

## Purpose

This index identifies what is authoritative, proposed, experimental, superseded, or incomplete. A lower-authority document MUST NOT silently override a higher-authority document.

## Authority order

1. Founding Principles and Specification Governance.
2. Approved normative specifications.
3. Accepted RFCs and ADRs at their declared scope.
4. Draft normative specifications.
5. Proposed RFCs and ADRs.
6. Non-normative validation, scenarios, pressure tests, and historical patches.

## Current architectural family

The current specification family defines:

- Action
- Event
- Lifecycle
- Execution Boundary
- Adapter
- Receipt

The reduced `Action / Claim / Rule / Verify / Evaluate` model is active non-normative validation. It does not remove or replace any current primitive without the complete governance process.

These models may ultimately describe different architectural layers. Their apparent differences MUST NOT be resolved through silent deletion or renaming.

## Status map

| Authority class | Documents |
|---|---|
| Foundational | `FOUNDING_PRINCIPLES.md`; `SPECIFICATION_GOVERNANCE.md` |
| Approved normative | `VE-001` v0.2, subject to its declared canonical-profile dependency |
| Draft normative | `VE-000`; `VE-002`–`VE-006`; `CONFORMANCE.md`; `DOC-001` |
| Accepted decisions | RFC-001; ADR-001; RFC-004; ADR-004; ADR-ENC-001; ADR-RULE-001/002; ADR-VERIFY-002 at profile-limited scope |
| Draft RFCs | RFC-005 |
| Proposed RFCs and ADRs | RFC-002; RFC-003; ADR-003; RFC-006 |
| Non-normative evidence | `KERNEL_VALIDATION.md`; `kernel-analysis/`; `reference-scenarios/` |
| Historical integration inputs | `kernel-analysis/patches/` |

## Integration rule

An accepted RFC or ADR may guide future work, but an approved specification remains the implementable source of truth until the decision is incorporated or normatively referenced.

## Registers

- `OPEN_DECISIONS.md` tracks architectural questions and dispositions.
- `SPECIFICATION_TASKS.md` tracks implementability work after decisions.
- `reference-scenarios/README.md` identifies scenario maturity and validation coverage.
- `METADATA_NORMALIZATION.md` tracks DOC-001 migration.
- `CHANGELOG.md` records repository-wide changes.
