---
id: METADATA-NORMALIZATION
title: DOC-001 Metadata Normalization Register
version: 1.0
status: Historical
document_type: Migration Register
category: Documentation
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-24
depends_on:
  - DOC-001
supersedes: null
superseded_by: null
---

# DOC-001 Metadata Normalization Register

## Rule

Every Markdown document begins with one YAML front-matter block. Duplicate document bodies and duplicate metadata blocks are invalid. Metadata-only changes MUST NOT alter semantics.

## Canonical required fields

```yaml
id: <stable identifier>
title: <title>
version: <document version>
status: <allowed status>
document_type: <type>
category: <category>
author: Verified Execution Editorial Board
created: <known original date or null with recovery note>
updated: <last semantic or editorial update>
depends_on: []
related_documents: []
supersedes: null
superseded_by: null
```

## Allowed statuses

`Draft`, `Proposed`, `Review`, `Accepted`, `Approved`, `Active`, `Deprecated`, `Superseded`, `Withdrawn`, `Archived`, `Historical`.

Composite values such as `Draft / Active Validation` belong in a separate `maturity` or `notes` field, not `status`.

## Immediate corrections

- RFC-001: replace `YYYY-MM-DD` with `created: null`, add `recovery_note`, and preserve Accepted status.
- RFC-002: replace `YYYY-MM-DD` with `created: null`, add `recovery_note`, and preserve Proposed status.
- RFC-004: retain Accepted status and remove the duplicated older Proposed body.
- Architecture Index and both historical patches: remove duplicated bodies.
- All documents in this update package use normalized front matter.

## Repository-wide migration procedure

1. Inventory every Markdown path and assign one stable identifier.
2. Preserve known historical creation dates; never invent them.
3. Use `created: null` plus `recovery_note` when history cannot establish a date.
4. Add metadata without changing body semantics.
5. Validate identifier uniqueness, allowed statuses, dependency targets, and exactly one front-matter block.
6. Commit metadata normalization separately from semantic revisions.

## Completion gate

DOC-001 normalization was completed and validated on 2026-08-22. This
register is retained as the historical record of that migration.

Normalization is complete only when an automated repository check confirms:

- every Markdown file has one valid block;
- every `id` is unique;
- every dependency resolves;
- no placeholder dates remain;
- no duplicated document bodies remain.
