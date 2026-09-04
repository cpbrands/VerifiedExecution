---
id: ARCHITECTURE-INDEX
title: Verified Execution Architecture Authority Index
version: 1.1
status: Active
document_type: Governance Index
category: Architecture
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-09-04
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

## Specification identifier allocation

This index is the repository authority for the current allocation state of
`VE-xxx` specification identifiers. Identifier allocation is bookkeeping only:
it does not create an architectural primitive, establish specification
semantics, or make a specification normative.

Allocation states are:

- **Provisional/reserved** — held for the named future specification family but
  not allocated or instantiated.
- **Allocated** — assigned to the named specification, although its file may not
  yet exist.
- **Instantiated** — a matching specification artifact exists. Instantiation
  does not imply approval, architectural authority, or protocol completeness.

A specification artifact may claim a `VE-xxx` identifier only when this index
already reserves or allocates that identifier for the same named
specification, or when the same governed change atomically records the matching
allocation in this index and introduces the specification artifact. Draft
RFCs, non-normative analysis, and incidental future-reference text do not
allocate identifiers or override this table.

| Identifier | Name | Allocation state | Basis |
|---|---|---|---|
| `VE-007` | Policy | Provisional/reserved | Draft VE-000 future specification family |
| `VE-008` | Identity and Delegation | Provisional/reserved | Draft VE-000 future specification family |
| `VE-009` | Human Authorization | Provisional/reserved | Draft VE-000 future specification family |
| `VE-010` | Evidence Integrity | Provisional/reserved | Draft VE-000 future specification family |
| `VE-011` | Verification | Provisional/reserved | Draft VE-000 future specification family |
| `VE-012` | Security Model | Provisional/reserved | Draft VE-000 future specification family |
| `VE-013` | Conformance | Provisional/reserved | Draft VE-006 future specification association |
| `VE-014` | Execution Right | Allocated; not yet instantiated | Accepted RFC-011 and ADR-011; specification file not yet created |

Historical references in Draft RFC-005 and non-normative kernel evidence that
use `VE-007` for representation work are stale and non-allocating. This
identifier correction does not invalidate their substantive analysis.

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
- `METADATA_NORMALIZATION.md` records the completed DOC-001 normalization.
- `CHANGELOG.md` records repository-wide changes.
