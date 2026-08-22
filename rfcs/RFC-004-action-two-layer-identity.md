---
id: RFC-004
title: Two-Layer Action Identity and Semantic Payload Boundary
version: 0.2
status: Accepted
document_type: RFC
category: Architecture
author: Verified Execution Editorial Board
created: 2026-08-20
updated: 2026-08-22
depends_on:
  - VE-001
related_documents:
  - ADR-004
  - RFC-005
supersedes: RFC-004-0.1
superseded_by: null
---

# RFC-004 — Two-Layer Action Identity and Semantic Payload Boundary

## Decision

An Action has two distinct identities:

```text
action_digest — deterministic identity of exact semantic Action content
action_id     — identity of the historical Action occurrence
```

They MUST NOT be conflated. Two occurrences MAY share an `action_digest` while retaining different `action_id` values.

## Action structure

```text
Action
├── Instance Envelope
│   └── action_id
└── Semantic Payload
    ├── schema_digest
    └── schema-defined semantic fields
```

A field belongs in Semantic Payload when changing it can change the requested effect, target, operation, material arguments, deterministic applicability, explicit execution constraints, or completion semantics.

Occurrence metadata MUST NOT enter Semantic Payload merely to force uniqueness.

## Binding invariant

Any authoritative artifact whose meaning depends on one historical occurrence carrying particular semantic content MUST cryptographically bind at least:

```text
(action_id, action_digest)
```

Additional authoritative envelope fields relied upon by that artifact MUST also be bound.

VE does not require a universal third `instance_digest`. A protocol MAY derive a compact instance commitment, but it remains protocol machinery.

## Schema identity

Every Action identifies its exact semantic schema using `schema_digest`. Human-readable schema identifiers and versions are optional labels. Schema identity participates in `action_digest`.

## Reclassified v0.1 fields

- `action_id`: occurrence identity, not semantic content.
- evidentiary `created_at`: occurrence-level unless time constrains the requested effect.
- `initiator`: normally provenance/Claim context, not universally semantic.
- `authority_context`: independently established; Action-carried references are not self-authorizing.
- `target`, `operation`, and `arguments`: schema-defined effect semantics, not a universal VE ontology.
- universal `scope`: removed; applicability uses canonical schema-defined fields.

## Security properties

- Semantic mutation or schema change changes `action_digest`.
- Equal digests do not imply the same occurrence, idempotency, replay permission, authorization, execution, or commit.
- Action-carried governance hints do not become authoritative by inclusion.

## Dependencies

RFC-004 settles the identity architecture. Byte-for-byte interoperable digest computation depends on an Approved canonical representation and framing profile. Draft RFC-005 addresses that dependency.

## Disposition

Accepted. Implemented by ADR-004 and VE-001 v0.2. This cleaned record removes the duplicated stale Proposed body without changing semantics.
