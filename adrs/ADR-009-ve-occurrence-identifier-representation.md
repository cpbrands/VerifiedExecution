---
id: ADR-009
title: VE Occurrence Identifier Representation
version: "0.1"
status: Accepted
document_type: Architectural Decision Record
category: Architecture
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - SPECIFICATION-GOVERNANCE
  - RFC-009
  - ADR-ENC-001
related_documents:
  - VE-001
  - VE-002
  - VE-CLAIM-REFERENCE-SEMANTICS
supersedes: null
superseded_by: null
---

# ADR-009 — VE Occurrence Identifier Representation

## Status and authority boundary

**Status:** Accepted
**Related RFC:** RFC-009 — VE Occurrence Identifier Representation
**Decision:** A. ADOPT SHARED VE OCCURRENCE-ID CONVENTION.

This Accepted ADR is authoritative at its declared architectural scope. It
records a narrow reusable scalar convention, not a VE-wide identity
architecture. A specification adopts it only through its own governed
revision. The only adoption candidate in this transaction is Draft VE-002
`event_id`; VE-001 `action_id` remains unchanged.

RFC-009 is Accepted. This ADR does not itself approve VE-002 or cause another
specification to adopt OccurrenceId.

## 1. Context

VE-002 assigns each Event an immutable, globally unique historical identity,
but its v0.1 Draft does not define a portable scalar representation, equality,
or canonical-representation rejection rule. A narrow Event identifier
convention is needed for independently reproducible Event references without
creating generic VE identity infrastructure.

## 2. Decision question

How should an owning VE specification obtain portable exact identity for an
occurrence without imposing UUID, text, content-hash, registry, resolver,
authority, or generator semantics on that occurrence?

## 3. Decision

**A. ADOPT SHARED VE OCCURRENCE-ID CONVENTION.**

The convention is:

~~~text
OccurrenceId := exactly 32 opaque octets
~~~

Its portable representation is exactly one canonical VE-CBOR-1 definite-length
byte string:

~~~text
h'58 20' || 32-octet payload
~~~

Equality is exact equality of the 32 payload octets. The value is opaque and
immutable after assignment. The owning specification defines the occurrence
kind, scope, uniqueness, and non-reuse rules. Generation is
implementation-defined.

No cross-kind equality follows from equal raw octets. The convention neither
creates a global identity space nor requires a shared generator.

## 4. VE-002 Event application candidate

VE-002 v0.2 Draft applies this convention to `event_id` only. For Event
occurrences, duplicate assignment is a producer conformance failure; Event
identifiers are immutable, non-recycled, and never aliases.

This does not adopt the convention for `action_id`, Receipt identifiers,
external identifiers, Claim references, execution attempts, history grouping,
or any other identifier family. VE-001 remains the governing authority for
Action identity.

## 5. Rejected alternatives

| Alternative | Decision |
|---|---|
| 16-octet opaque identifier | Rejected: lower collision margin without reducing architecture. |
| Text identifier | Rejected: normalization and namespace semantics become mandatory. |
| UUID form | Rejected: adds version/generator semantics. |
| Content hash | Rejected: conflates occurrence and content identity. |
| Tagged or wrapped representation | Rejected: redundant under VE-CBOR-1 and adds representation surface. |
| Profile-defined identifier plus wrapper | Rejected: preserves unspecified identifier semantics while adding another layer. |
| Event-only solution | Rejected: a reusable scalar convention is smaller than duplicate per-kind rules. |
| Registry/resolver/central authority | Rejected: portable equality does not require identity infrastructure. |

## 6. Boundaries

This decision does not introduce:

- a VE primitive, Entity model, universal reference model, global namespace,
  registry, resolver, central authority, generator contract, version byte, or
  version field;
- UUID, hash, random, text, time, issuer, namespace, or content semantics;
- Action, Receipt, Claim, Rule, execution-attempt, grouping, lifecycle,
  provenance, payload, or Event ordering changes; or
- a new tag, wrapper, encoding profile, or exception to VE-CBOR-1.

## 7. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Preserves immutable historical facts and independently reproducible identity without authority expansion. |
| No unjustified primitive | A shared scalar convention is not a first-class kernel object. |
| Necessity/removability | The small rule removes unstated scalar and equality ambiguity; broader alternatives do not survive removal. |
| Twenty-year durability | Fixed opaque bytes and no mutable lookup survive generator and namespace changes. |
| Independent implementability | Exact payload equality and a canonical 34-octet encoding are sufficient. |
| Reduced total complexity | Avoids all identity-provider, registry, and generic-reference machinery. |

## 8. Consequences and governance

This Accepted ADR authorizes no Approved-specification change. It records the
architecture decision for Accepted RFC-009 and Draft VE-002 v0.2. Each
adopting specification must separately revise its own semantic rules and
conformance materials under normal version and changelog governance.

## 9. Affected Specifications

**Affected specification:**

- **VE-002 Event Specification — Draft v0.2 candidate.** It is the sole
  current explicit adopter of the proposed convention.

**Unchanged:**

- **VE-001 Action Specification.** Its `action_id` remains governed by its
  existing profile-defined rule; any future adoption requires separate
  governance.

No other specification silently adopts OccurrenceId through this ADR.

## 10. Conclusion

**A. ACCEPT SHARED VE OCCURRENCE-ID CONVENTION.**

The selected convention is sufficient for narrow Event adoption while retaining
the distinction between Action occurrence identity, Event occurrence identity,
and all other identity families.

This Accepted ADR does not itself approve VE-002 or expand OccurrenceId
adoption beyond its sole Draft Event candidate.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-30 | Initial Proposed ADR selecting a narrow shared OccurrenceId convention; VE-002 is the sole Draft adoption candidate. |
| 0.1 | 2026-08-30 | Status transitioned from Proposed to Accepted; decision and scope unchanged. |
