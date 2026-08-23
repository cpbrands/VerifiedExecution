---
id: "VE-004-CHANGELOG"
title: "VE-004 Changelog"
version: "0.2"
status: "Proposed"
document_type: "Specification Changelog"
category: "Specification"
author: "Verified Execution Editorial Board"
created: 2026-08-20
updated: 2026-08-20
depends_on: []
related_documents: []
supersedes: null
superseded_by: null
---
# VE-004 Changelog

## v0.2 — Proposed 2026-08-19

**Change authority:** RFC-003, ADR-003  
**Supersedes:** VE-004 v0.1

### Semantic changes

- Added explicit separation between terminal Lifecycle state and authoritative execution outcome.
- Added required `execution_outcome` with `COMMITTED`, `NOT_COMMITTED`, `UNCERTAIN`, and `NOT_APPLICABLE`.
- Added conditional `commit_reference` requirement for committed Actions.
- Added conditional `execution_authority_reference` requirement for committed Actions.
- Added predecessor-state binding for committed state-transition Actions.
- Added successor-state binding or deterministic derivation for committed state-transition Actions.
- Specified that authorization, submission, timeout, or absence of error is insufficient to establish commit.
- Specified that uncertain execution cannot advance canonical state history.
- Specified that Receipt does not create canonicality.
- Added non-self-authorization requirement for Receipt issuers and commit-proof mechanisms.
- Clarified that execution authority may be an authority, quorum, finality mechanism, or other independently recognized proof mechanism.
- Clarified that Adapter references are not automatically authoritative commit evidence.
- Added compatibility rule preventing v0.1 Receipts from being automatically promoted to v0.2 canonical-commit proofs.

### Primitive impact

No new semantic kernel primitive introduced.

`Commit` remains an execution concept rather than a kernel primitive.

`Resource` remains excluded from the reduced semantic kernel.

