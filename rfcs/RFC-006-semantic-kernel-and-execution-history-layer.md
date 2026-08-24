---
id: RFC-006
title: Semantic Kernel and Execution-History Layer Relationship
version: 0.1
status: Proposed
document_type: RFC
category: Architecture
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - ARCHITECTURE-INDEX
related_documents:
  - VE-000
  - KERNEL-VALIDATION
  - RFC-005
supersedes: null
superseded_by: null
---

# RFC-006 — Semantic Kernel and Execution-History Layer Relationship

## Status

Proposed. This RFC is a governance and integration proposal. It does not amend an approved specification or promote the reduced kernel model into the normative primitive set.

Repository inclusion or merge does not constitute acceptance of this RFC or its proposed organizational concepts. The layer model becomes authoritative only through explicit acceptance followed by every governed specification revision required to incorporate it.

## Problem

The current specification family defines Action, Event, Lifecycle, Execution Boundary, Adapter, and Receipt. Active non-normative validation also uses the compact vocabulary Action, Claim, Rule, Verify, and Evaluate. Treating the two lists as competing primitive sets creates authority drift and invites silent deletion or renaming.

## Proposed relationship

The models describe different concerns and are proposed for possible organization as two layers:

1. **Proposed semantic kernel:** Action, Claim, Rule, Verify, and Evaluate would describe canonical intent, asserted facts, deterministic rule evaluation, and verification inputs/results.
2. **Proposed execution-history layer:** Event, Lifecycle, Execution Boundary, Adapter, and Receipt would describe legal progression, authoritative history, protected external execution, translation to targets, and inspectable execution outcome.

Action is the shared semantic artifact proposed for possible evaluation and, where legal, execution. Claims, Rules, Verify, and Evaluate do not by themselves authorize or execute an external effect. Events, Lifecycle, Execution Boundary, Adapter, and Receipt do not redefine the semantic content of Action or Claim.

## Non-goals

This RFC does not:

- remove, rename, or replace any approved or draft core primitive;
- declare the reduced kernel an approved normative model;
- amend VE-000 through VE-006;
- settle signature architecture, canonical profile details, or mandatory algorithms; or
- make RFC-005 Accepted.

## Consequences if accepted

If accepted, future specification revisions MAY describe the two layers explicitly and define their interfaces. Any change to primitive ownership, lifecycle legality, conformance, or approved specification text MUST follow the existing RFC, ADR, and specification-governance process.

## Evidence and next steps

KERNEL_VALIDATION.md and kernel-analysis records are non-normative evidence. RFC-005 remains Draft and addresses representation and signature portability independently; it may reference this RFC but is not resolved by it.

## Decision requested

Accept the layer distinction as the integration model for future work, while leaving approved specifications unchanged until governed revisions are proposed and accepted.
