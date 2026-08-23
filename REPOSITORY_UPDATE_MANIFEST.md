---
id: REPOSITORY-UPDATE-2026-08-22
title: Verified Execution Repository Update Manifest
version: 1.0
status: Historical
document_type: Historical Change Manifest
category: Repository Maintenance
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - ARCHITECTURE-INDEX
  - CHANGELOG
supersedes: null
superseded_by: null
---

# Repository Update Manifest

> **Historical, editorial, and non-normative.** This manifest records repository maintenance results. It creates no requirements or acceptance gate and cannot override any specification, RFC, ADR, the Architecture Authority Index, or any changelog.

## Replace

- `README.md`
- `ARCHITECTURE_INDEX.md` — removes duplicated body
- `ARCHITECTURE.md`
- `ROADMAP.md`
- `CONFORMANCE.md`
- `rfcs/RFC-001-evidence-role.md`
- `rfcs/RFC-002-core-specification-consistency.md`

## Add

- `CHANGELOG.md`
- `METADATA_NORMALIZATION.md`
- `reference-scenarios/README.md`
- `rfcs/RFC-005-canonical-representation-digest-and-signature-record.md`
- `implementation/README.md`
- `kernel-analysis/patches/VE-KERNEL-v0.1-ENC-RULE-RESOLUTION-PATCH.md`
- `kernel-analysis/patches/VE-KERNEL-v0.1-VERIFY-002-PATCH.md`

## Delete after relocation

- `/VE-KERNEL-v0.1-ENC-RULE-RESOLUTION-PATCH.md`
- `/VE-KERNEL-v0.1-VERIFY-002-PATCH.md`
- `implementation/roadmap.md`
- `implementation/roadmap-legacy.md`
- `implementation/ADRs/.gitkeep`

The root patches are recoverable from Git history and preserved in cleaned historical form under `kernel-analysis/patches/`.

## Preserve

- `KERNEL_VALIDATION.md` as the current historical validation ledger.
- Existing substantive reference scenarios.
- Approved specification text except through separate governed revisions.
- Placeholder scenarios, but classify them visibly through the index until they are completed or withdrawn.

## Completed metadata migration

DOC-001 metadata normalization and automated documentation validation were completed and merged through PR #2. No separate future metadata migration remains to be performed for this bundle.

## Historical validation results

- [x] Every new or replaced document contains exactly one YAML block.
- [x] No duplicate document body remains.
- [x] README contains `cpbrands/VerifiedExecution` and uses Execution Boundary.
- [x] No normative document depends on `KERNEL_VALIDATION.md`.
- [x] RFC-005 remains Draft.
- [x] COSE is described as optional.
- [x] Root patch files are absent after relocation.
- [x] Empty implementation placeholders are absent.
- [x] All Markdown links resolve.
- [x] Future semantic decisions remain expressly proposed and non-authoritative.
