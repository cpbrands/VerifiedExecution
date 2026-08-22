---
id: DOC-001
title: Document Metadata Specification
version: 1.0
status: Draft
document_type: Documentation Standard
category: Documentation
author: Verified Execution Editorial Board
created: null
updated: 2026-08-22
depends_on:
  - SPECIFICATION-GOVERNANCE
related_documents:
  - METADATA-NORMALIZATION
recovery_note: Original creation date not established from the document.
supersedes: null
superseded_by: null
---

# DOC-001 — Document Metadata Specification

## Purpose

Every Markdown document in the VE repository begins with one machine-readable YAML front-matter block describing identity, version, status, relationships, and lifecycle.

## Required fields

- `id`
- `title`
- `version`
- `status`
- `document_type`
- `category`
- `author`
- `created`
- `updated`
- `depends_on`
- `supersedes`
- `superseded_by`

`related_documents` and `recovery_note` are optional.

When an original date cannot be established, `created` MUST be `null` and `recovery_note` MUST explain why. A date MUST NOT be invented to satisfy tooling.

## Identifier rules

Identifiers are unique and stable. Renaming a file or title does not change its identifier. Superseded identifiers remain reserved.

## Status vocabulary

Allowed values are:

`Draft`, `Proposed`, `Review`, `Accepted`, `Approved`, `Active`, `Deprecated`, `Superseded`, `Withdrawn`, `Archived`, and `Historical`.

Document maturity or validation activity belongs in separate metadata, not a composite status string.

## Relationship rules

- Every dependency must resolve to an existing identifier.
- `supersedes` and `superseded_by` must be reciprocal when both documents exist.
- Informative relationships belong in `related_documents`, not `depends_on`.
- Non-normative validation documents MUST NOT be normative dependencies of specifications or conformance claims.

## Validation

Repository checks SHALL reject:

- missing or multiple front-matter blocks;
- duplicate identifiers;
- placeholder dates;
- unknown statuses;
- unresolved dependencies;
- duplicated document bodies.

## Migration

Metadata-only normalization does not change document semantics and must be committed separately from semantic revisions. See `METADATA_NORMALIZATION.md`.
