---
id: SPECIFICATION-TASKS
title: Verified Execution Specification Task Register
version: 1.0
status: Active
document_type: Task Register
category: Specification Planning
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - ADR-ENC-001
  - ADR-RULE-001-002
related_documents:
  - OPEN-DECISIONS
  - RFC-005
supersedes: null
superseded_by: null
---

# Verified Execution Specification Task Register

These tasks make accepted decisions independently implementable. They are not architectural forks unless completion exposes a contradiction with approved authority.

## Canonical encoding

- [ ] SPEC-CBOR-001 — Define exact VE-CBOR-1 schemas for Action, Claim, Rule, and Reference.
- [ ] SPEC-CBOR-002 — Assign exact canonical field labels.
- [ ] SPEC-CBOR-003 — Define exact numeric and scaled-integer conventions consistent with the accepted profile.

## Rule execution

- [ ] SPEC-CEL-001 — Pin VE-CEL-1 to a specific CEL semantics release.
- [ ] SPEC-CEL-002 — Define exact Action-to-CEL value mapping.
- [ ] SPEC-CEL-003 — Define exact verified-Claim-to-CEL value mapping.
- [ ] SPEC-CEL-004 — Define the VE-CEL-1 feature and operator allowlist.
- [ ] SPEC-CEL-005 — Define normative Rule resource and cost limits.

## Interoperability

- [ ] SPEC-TEST-001 — Publish cross-language canonicalization and evaluation vectors.

## Relationship to RFC-005

RFC-005 open decisions remain in `OPEN_DECISIONS.md`. When RFC-005 accepts a decision, its remaining mechanical work SHALL move here with new stable task identifiers.
