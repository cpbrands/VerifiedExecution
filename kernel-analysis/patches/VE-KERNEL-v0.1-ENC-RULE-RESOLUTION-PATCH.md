---
id: HIST-PATCH-ENC-RULE-001
title: VE Kernel v0.1 ENC and RULE Resolution Patch
version: 1.0
status: Historical
document_type: Historical Patch
category: Kernel Analysis
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - ADR-ENC-001
  - ADR-RULE-001-002
related_documents:
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# VE Kernel Protocol v0.1 — ENC/RULE Resolution Record

This historical record does not independently modify a specification. Its decisions are authoritative only at the narrow scope accepted by the linked ADRs.

## Accepted selections

- **ENC-001:** VE-CBOR-1 is the canonical representation family for byte-sensitive v0.1 kernel objects.
- **RULE-001:** VE-CEL-1 is the portable Rule representation selected for v0.1.
- **RULE-002:** VE-CEL-1 evaluation is side-effect-free, receives only explicit Action and successfully verified Claim inputs, and produces no affirmative authorization except from `SATISFIED`.

## Remaining work

Exact schemas, map labels, numeric conventions, CEL semantics version, value mappings, operator allowlist, resource limits, and cross-language test vectors remain in `SPECIFICATION_TASKS.md`.

No implementation may claim full profile interoperability until those tasks are completed in normative specifications.
