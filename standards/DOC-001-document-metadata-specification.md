# DOC-001 — Document Metadata Specification

**Document Identifier:** DOC-001  
**Version:** 1.0  
**Status:** Draft  
**Category:** Documentation Standard  
**Applies To:** All normative and non-normative documents within the Verified Execution Standard

---

# Abstract

This specification defines the canonical metadata format for every document within the Verified Execution Standard.

The purpose of the metadata is to provide a consistent, machine-readable description of each document's identity, status, relationships, ownership, and lifecycle.

Every document in the repository SHALL begin with a metadata block conforming to this specification.

---

# 1. Purpose

Document metadata serves five primary objectives:

1. Unique identification.
2. Version management.
3. Dependency tracking.
4. Automated tooling.
5. Long-term maintainability.

Metadata enables both humans and software to understand the role of a document without parsing its body.

---

# 2. Scope

DOC-001 applies to all documents within the repository, including but not limited to:

- VE Specifications
- RFCs
- ADRs
- DOC Specifications
- Governance documents
- Architecture documents
- Manifestos
- Vision documents
- Roadmaps

Markdown source files SHALL include metadata conforming to DOC-001.

---

# 3. Metadata Format

The canonical representation SHALL use YAML Front Matter.

Example:

```yaml
---
id: VE-003

title: Lifecycle Specification

version: 0.1

status: Draft

document_type: Specification

category: Core Primitive

author: Verified Execution Editorial Board

created: 2026-08-11

updated: 2026-08-11

depends_on:
  - VE-000
  - VE-001
  - VE-002

related_documents:
  - RFC-001
  - ADR-001

supersedes: null

superseded_by: null
---
```

---

# 4. Required Fields

Every document SHALL contain the following fields.

| Field | Required | Description |
|---------|----------|-------------|
| id | Yes | Canonical document identifier |
| title | Yes | Human-readable title |
| version | Yes | Document version |
| status | Yes | Lifecycle status |
| document_type | Yes | Type of document |
| created | Yes | Creation date |
| updated | Yes | Last revision date |

---

# 5. Optional Fields

The following fields MAY appear.

| Field | Description |
|--------|-------------|
| category | Logical grouping |
| author | Responsible editor |
| depends_on | Normative dependencies |
| related_documents | Informative references |
| supersedes | Older document |
| superseded_by | Replacement document |
| reviewers | Editorial reviewers |
| approved_by | Approval authority |
| tags | Search keywords |

---

# 6. Identifier Rules

Every identifier SHALL be globally unique within the repository.

Examples:

```text
VE-000

VE-001

RFC-001

ADR-003

DOC-001
```

Identifiers MUST NOT change.

Changing a title SHALL NOT change the identifier.

---

# 7. Status Values

Allowed values are:

```text
Draft

Proposed

Accepted

Approved

Deprecated

Superseded

Archived
```

Specifications and governance documents MAY define additional statuses if necessary.

---

# 8. Document Types

The initial canonical types are:

```text
Specification

RFC

ADR

Governance

Architecture

Vision

Manifesto

Roadmap

Documentation Standard
```

Future document types require governance approval.

---

# 9. Versioning

Versions SHALL follow semantic versioning principles.

Examples:

```text
0.1

0.2

1.0

1.1

2.0
```

Major version increments indicate semantic incompatibility.

Minor version increments indicate backward-compatible semantic additions.

Patch versions MAY be used for editorial corrections.

---

# 10. Dependencies

The `depends_on` field expresses normative dependency.

A document SHALL NOT depend on a document that does not exist.

Circular dependencies SHOULD NOT exist.

Example:

```yaml
depends_on:
  - VE-000
  - VE-001
  - VE-002
```

---

# 11. Related Documents

The `related_documents` field expresses informative relationships.

These references do not imply normative dependency.

Example:

```yaml
related_documents:
  - RFC-002
  - ADR-004
```

---

# 12. Repository Independence

Metadata SHALL remain independent of repository layout.

Moving a document between directories SHALL NOT change its metadata.

Identifiers remain stable regardless of file location.

---

# 13. Machine Readability

Metadata SHALL be sufficient for automated tools to generate:

- navigation
- dependency graphs
- changelogs
- document indexes
- relationship maps
- specification catalogs
- version histories

without parsing document prose.

---

# 14. Editorial Rules

Metadata SHALL accurately describe the document.

Metadata MUST NOT contradict the document body.

If metadata conflicts with document content, the inconsistency SHALL be corrected before approval.

---

# 15. Conformance Requirements

A document conforms to DOC-001 if:

- all required metadata fields exist,
- field names are canonical,
- values are valid,
- identifiers are unique,
- dependencies are resolvable,
- YAML syntax is valid.

---

# 16. Future Extensions

Future versions MAY define additional metadata for:

- digital signatures
- cryptographic hashes
- approval timestamps
- publication channels
- language localization
- implementation maturity
- machine-readable schemas

Extensions MUST remain backward compatible unless accompanied by a major version increment.

---

# 17. Architectural Decision Test

## ADT-1 — Founding Principles

Consistent.

Metadata improves clarity without altering architecture.

---

## ADT-2 — Primitive Necessity

DOC-001 introduces no architectural primitives.

---

## ADT-3 — Removability

Removing standardized metadata significantly reduces repository consistency, automation, and discoverability.

---

## ADT-4 — Durability

Document metadata remains useful regardless of technology, tooling, or repository platform.

---

## ADT-5 — Independent Implementability

Any team can implement DOC-001 independently.

---

## ADT-6 — Complexity Reduction

A single metadata standard replaces multiple inconsistent document headers.

Total conceptual complexity decreases.

---

# 18. Open Questions

## OQ-DOC-001

Should metadata include cryptographic signatures?

## OQ-DOC-002

Should publication history become standardized?

## OQ-DOC-003

Should document maturity become separate from status?

## OQ-DOC-004

Should metadata support multilingual documents?

---

# 19. Revision History

## v1.0

Initial document metadata specification.

Established:

- canonical YAML front matter,
- required metadata fields,
- optional metadata fields,
- identifier rules,
- status values,
- document types,
- dependency tracking,
- repository independence,
- machine-readable requirements.

---

# 20. Foundational Rule

> **Every document should be understandable before its body is read.**

Metadata provides the canonical identity, status, relationships, and lifecycle of every document in the Verified Execution Standard.

The document body explains the content.

The metadata explains the document itself.
