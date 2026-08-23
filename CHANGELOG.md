---
id: CHANGELOG
title: Verified Execution Repository Changelog
version: 1.0
status: Active
document_type: Changelog
category: Governance
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Verified Execution Repository Changelog

This changelog records repository-wide semantic, governance, status, and structural changes. Specification-specific changelogs remain authoritative for changes to their specifications.

## 2026-08-22 — Authority and repository alignment

### Governance

- Added the Architecture Authority Index.
- Added the Open Decision Register.
- Separated architectural decisions from remaining specification tasks.
- Confirmed the six-primitive specification family as authoritative pending formal revision.
- Classified the reduced `Action / Claim / Rule / Verify / Evaluate` model as non-normative validation work.

### Decisions

- Corrected RFC-004 to Accepted, consistent with ADR-004 and approved VE-001 v0.2.
- Accepted ADR-ENC-001 at the narrow decision scope selecting VE-CBOR-1.
- Accepted ADR-RULE-001/002 at the narrow decision scope selecting VE-CEL-1.
- Limited ADR-VERIFY-002 to optional COSE verification profiles; COSE is not the sole VE signature representation.
- Recovered ADR-001 as the decision record corresponding to accepted RFC-001.

### Repository alignment

- Updated README topology and replaced the obsolete Gateway term with Execution Boundary.
- Added the Reference Scenario Index.
- Aligned Architecture, Roadmap, and Conformance with the authority index.
- Removed `KERNEL_VALIDATION` as a normative conformance dependency.
- Relocated root-level resolution patches to `kernel-analysis/patches/` as historical non-normative records.
- Removed empty implementation roadmap placeholders and the duplicate `implementation/ADRs/` placeholder.
- Began DOC-001 metadata normalization and added a migration register.

### Protocol work

- Added Draft RFC-005 to define the scope and acceptance gates for Canonical Representation Profile 1, typed digest framing, Digest Reference, ObjectReference, Signature Record, verification-material references, and optional COSE profiles.
- RFC-005 deliberately leaves exact resource bounds, mandatory algorithm suites, and certain object schemas open pending evidence.

### Reconciliation branch work

- Removed duplicated obsolete bodies from ADR-ENC-001, ADR-RULE-001/002, and ADR-VERIFY-002, preserving their accepted scoped bodies.
- Added proposed ADR-VERIFY-003 to narrow VerificationContext to issuer-to-verifier binding.
- Added proposed RFC-006 to reconcile the non-normative semantic-kernel model with the execution-history layer without changing approved specifications.

## Historical specification changes

- VE-001 v0.2 introduced two-layer Action identity under RFC-004 and ADR-004.
- VE-004 v0.2 remains proposed/draft under RFC-003 and ADR-003.

See `specifications/VE-001-CHANGELOG.md` and `specifications/VE-004-CHANGELOG.md` for specification-level detail.
