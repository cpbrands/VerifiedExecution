---
id: README
title: Verified Execution Repository Guide
version: 1.0
status: Active
document_type: Repository Guide
category: Navigation
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - ARCHITECTURE-INDEX
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Verified Execution

> **Intelligence may propose. Legitimacy determines what may act.**

Verified Execution is an open specification project for governing consequential execution initiated by AI systems, humans, and services.

It defines an **Execution Boundary** between proposed intent and protected external effects. The boundary validates an Action, applies independently established authority and rules, records authoritative history, mediates execution, and produces inspectable evidence of the result.

The canonical repository is [`cpbrands/VerifiedExecution`](https://github.com/cpbrands/VerifiedExecution).

## What Verified Execution is

Verified Execution defines interoperable semantics and protocol machinery for answering:

> Was this particular consequential Action legitimate under the applicable authority, and what actually happened when execution was attempted?

VE is not an AI model, identity provider, workflow engine, universal policy authority, or replacement for external systems. Resources and protected systems remain authoritative for the authorities they recognize and for the state transitions they accept.

## Current authority

The currently authoritative architectural family contains:

- **Action** — a bounded request for a governed consequential effect.
- **Event** — an immutable historical fact about an Action.
- **Lifecycle** — deterministic rules for deriving an Action's semantic state.
- **Execution Boundary** — the mandatory control point before protected execution.
- **Adapter** — the translation and invocation boundary for an external system.
- **Receipt** — a portable representation of an Action's resolved outcome.

The reduced model `Action / Claim / Rule / Verify / Evaluate` remains non-normative kernel-validation work unless formally adopted through RFC, ADR, specification revision, and changelog.

Read [ARCHITECTURE_INDEX.md](ARCHITECTURE_INDEX.md) before interpreting any specification, proposal, patch, or validation record.

## Repository map

| Path | Purpose | Authority |
|---|---|---|
| `FOUNDING_PRINCIPLES.md` | Long-lived architectural commitments | Foundational |
| `SPECIFICATION_GOVERNANCE.md` | Change control and decision process | Foundational |
| `ARCHITECTURE_INDEX.md` | Canonical authority and status map | Active governance |
| `OPEN_DECISIONS.md` | Architectural decision register | Active governance |
| `SPECIFICATION_TASKS.md` | Implementability work after decisions | Active planning |
| `specifications/` | VE normative specifications | Per-document status |
| `standards/` | Supporting standards such as DOC-001 | Per-document status |
| `rfcs/` | Proposed architectural or protocol changes | Per-document status |
| `adrs/` | Accepted or proposed decisions and rationale | Per-document status |
| `reference-scenarios/` | Scenario-based validation inputs | Non-normative unless explicitly adopted |
| `kernel-analysis/` | Pressure tests, gap analysis, historical patches | Non-normative |
| `implementation/` | Future implementation material | Non-normative |

## Development cadence

```text
Kernel Specification
        ↓
Reference Scenario
        ↓
Gap Analysis
        ↓
RFC if needed
        ↓
ADR
        ↓
Specification revision + version increment + changelog
```

Approved specifications are not edited informally. A semantic change requires the governance trail defined in `SPECIFICATION_GOVERNANCE.md`.

## Current phase

VE is in specification and protocol-validation work. Current priorities are:

1. complete VE-CBOR-1 and VE-CEL-1 specification tasks;
2. define canonical representation, digest framing, and portable Signature Record semantics through Draft RFC-005;
3. keep COSE as an optional profile rather than the sole VE signature representation;
4. validate the architecture through substantive reference scenarios;
5. begin implementation only when two independent implementations can plausibly interoperate from the written specifications.

## Contributing

Every significant proposal must pass the Architectural Decision Test in `SPECIFICATION_GOVERNANCE.md`. In particular, a proposal must reduce total conceptual complexity, remain implementation-independent, and avoid creating a new primitive without exceptional justification.

## Status and license

This repository contains draft and approved specification material. Each document's metadata determines its status. No implementation may claim conformance beyond the requirements of approved normative documents and completed mandatory profiles.

Licensing must be finalized before the first public standard release.
