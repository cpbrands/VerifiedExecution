---
id: "ADR-001"
title: "Architectural Role of Evidence"
version: "0.1"
status: "Accepted"
document_type: "Architectural Decision Record"
category: "Architecture"
author: "Verified Execution Editorial Board"
created: 2026-08-22
updated: 2026-08-22
depends_on: []
related_documents:
  - RFC-001
  - VE-000
  - VE-004
  - VE-006
  - ARCHITECTURE
supersedes: null
superseded_by: null
---
# ADR-001 — Architectural Role of Evidence

**Status:** Accepted  
**Date:** 2026-08-22  
**Related RFC:** RFC-001 — Clarify the Architectural Role of Evidence  
**Affects:** VE-000, VE-004, VE-006, ARCHITECTURE.md

## Context

Evidence was considered as a possible additional core primitive. The existing model already assigns the relevant semantics and lifecycle to Action, Event history, Receipt, identity assertions, policy evaluations, approval records, cryptographic artifacts, and external references.

## Decision

Evidence SHALL NOT be a core primitive.

Evidence is a derived architectural concern: information derived from authoritative execution artifacts that supports inspection, verification, audit, or compliance.

The six core primitives remain:

- Action
- Event
- Lifecycle
- Receipt
- Adapter
- Execution Boundary

## Consequences

- Evidence introduces no independent lifecycle or semantic ownership.
- Receipts remain execution summaries; evidence may include more than receipts.
- Future specifications MAY define evidence and verification views without adding a seventh primitive.

## Status note

This ADR recovers the decision referenced by accepted RFC-001. It records the existing decision without changing the six-primitive architecture.
