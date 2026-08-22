---
id: RFC-001
title: Clarify the Architectural Role of Evidence
version: 1.0
status: Accepted
document_type: RFC
category: Architecture
author: Verified Execution Editorial Board
created: null
updated: 2026-08-22
depends_on:
  - VE-000
related_documents:
  - ADR-001
recovery_note: Original creation date was not recorded; placeholder removed during metadata normalization.
supersedes: null
superseded_by: null
---

# RFC-001 — Clarify the Architectural Role of Evidence

## Summary

Evidence SHALL remain a derived architectural concern rather than a seventh core primitive.

## Decision

Evidence is information derived from authoritative execution artifacts and applicable context that supports inspection, verification, audit, or compliance.

Evidence may draw from Actions, Events, Receipts, verified Claims, Rule evaluations, approval records, cryptographic artifacts, and authoritative external references.

Evidence does not own an independent lifecycle or create historical truth. A Receipt is one evidentiary artifact but is not synonymous with all Evidence.

## Rationale

Promoting Evidence to a primitive would duplicate responsibilities already owned by existing artifacts and would increase total conceptual complexity without adding irreducible semantics.

## Alternatives

- **Evidence as a seventh primitive:** rejected; no independent semantic ownership.
- **Evidence merged into Receipt:** rejected; evidence can include more than terminal summaries.
- **Evidence as a derived concern:** accepted.

## Compatibility and impact

No primitive is added or removed. VE-000, VE-004, VE-006, and `ARCHITECTURE.md` must preserve this classification.

## Decision record

See `adrs/ADR-001-architectural-role-of-evidence.md`.
