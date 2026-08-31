---
id: RFC-009
title: VE Occurrence Identifier Representation
version: "0.1"
status: Accepted
document_type: RFC
category: Representation
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - SPECIFICATION-GOVERNANCE
  - ADR-ENC-001
related_documents:
  - VE-001
  - VE-002
  - VE-CLAIM-REFERENCE-SEMANTICS
  - RFC-005
supersedes: null
superseded_by: null
---

# RFC-009 — VE Occurrence Identifier Representation

## 1. Status, accepted decision, and narrow scope

This RFC is Accepted. It records the accepted shared **OccurrenceId**
representation convention for VE specifications that explicitly opt in. It is
not a generic VE identity system, a new VE primitive, or an automatic change
to every field named `*_id`.

The accepted representation is:

~~~text
OccurrenceId := exactly 32 opaque octets
~~~

The candidate transaction in this repository applies it only to the Draft
VE-002 `event_id`. VE-001 `action_id` remains governed by VE-001 and does not
adopt this convention through this RFC. Receipt identifiers, external
identifiers, correlation identifiers, and other identifier families are out of
scope unless a future owning specification explicitly opts in.

## 2. Context

VE-002 requires a globally unique, immutable Event identity, but its v0.1
Draft does not define a portable scalar form, exact equality, canonical wire
representation, or malformed-representation rejection. Independent
implementations therefore cannot determine whether two serialized Event
references designate the same Event occurrence without importing unstated
identifier conventions.

The narrow question is how an owning specification can obtain portable
occurrence-reference equality without importing a global identity ontology,
namespace authority, or generator mandate.

## 3. Motivation

VE-002 `event_id` lacks a portable scalar representation and exact conformance
rule. That absence blocks portable `EventReference` semantics even though
VE-002 already assigns Event identity a historical role. The motivation is
narrowly to make that Event occurrence reference reproducible across
implementations; it is not to introduce a universal VE identity architecture.

## 4. Accepted convention

### 4.1 Abstract value and equality

An OccurrenceId is exactly 32 opaque octets.

Two OccurrenceIds are equal if and only if all 32 payload octets are equal in
the same order. There is no text comparison, Unicode normalization, case
folding, URI handling, namespace interpretation, content comparison, or
cross-kind equality inference.

The value is opaque. Its octets do not imply a UUID, content hash, random
value, timestamp, issuer, authority, generator, version, namespace, or text
encoding.

### 4.2 Portable representation

The only portable VE-CBOR-1 representation is a single definite-length byte
string with a 32-octet payload:

~~~text
h'58 20' || payload
~~~

The encoded representation is exactly 34 octets. A conforming decoder accepts
only that canonical representation and rejects:

- a byte string with any other payload length;
- a text string, integer, array, map, or other scalar type;
- an indefinite-length byte string;
- a tagged byte string;
- a non-shortest CBOR length encoding; and
- trailing bytes after the single value.

VE-CBOR-1 already forbids semantic tags and indefinite-length canonical items.
This proposal applies those existing canonical requirements; it does not add a
tag, discriminator, or alternate wrapper.

### 4.3 Assignment remains owned by the opt-in specification

This convention defines representation and equality only. The owning
specification defines the occurrence kind, assignment scope, uniqueness, and
non-reuse obligations. Generation is implementation-defined.

This RFC neither requires randomized generation nor permits inference that an
identifier is a random value, content hash, UUID, time value, issuer value,
globally governed name, or content address.

## 5. VE-002 Event opt-in candidate

VE-002 v0.2 Draft is the sole opt-in candidate in this transaction.

For Event occurrences, no two distinct Events may be assigned the same
`event_id`. The Event identifier is immutable after assignment and must never
be reassigned or recycled. A detected duplicate assignment is a producer
conformance failure; it does not make two Events aliases and does not permit
merging them.

Event occurrence identity remains distinct from Event payload/content equality,
Action occurrence identity, Action content identity, execution-attempt
interpretation, and Event-history grouping. Identical 32-octet payloads in two
different identifier kinds have no cross-kind equality consequence.

## 6. Compatibility Classification

**Class B — Compatible Semantic Extension.**

VE-002 remains Draft. This candidate supplies a portable representation where
no authoritative portable Event identifier representation previously existed.
It preserves the existing Event occurrence role while making its conformance
surface explicit. VE-001 Action identity is unchanged, as are external
identifiers and receipt identifiers. Existing non-normative scenario strings
are not protocol commitments and are not reinterpreted by this RFC.

## 7. Security Impact

The candidate provides deterministic exact equality and requires malformed or
non-canonical representations to fail closed. It makes no cryptographic
security claim, does not require randomness, and does not define a registry,
resolver, or authority. Collisions and duplicate Event assignment remain
producer-conformance concerns under the Event-specific uniqueness and
non-reuse rules; they are not properties a scalar parser can prove.

## 8. Complexity Impact

One opt-in shared scalar convention removes repeated per-specification
ambiguity about occurrence identifier width, equality, and canonical encoding.
It adds no kernel primitive, runtime component, generator service, registry,
or universal identity object.

## 9. Specification Impact

The sole current adopter is:

- **VE-002 Event Specification — Draft v0.2 candidate.**

VE-001 Action Specification is unchanged. Any later Action adoption requires
a separate governed VE-001 revision. No other specification silently adopts
OccurrenceId.

## 10. Implementation Impact

An implementation adopting VE-002 v0.2 must parse exactly one 32-octet
VE-CBOR-1 byte string, enforce canonical VE-CBOR-1 representation, compare
the payload octets exactly, reject invalid or non-canonical forms, and satisfy
VE-002's Event-specific uniqueness and non-reuse obligations. It need not use
any particular generation algorithm.

## 11. Non-normative collision rationale

The 32-octet width provides a fixed exact-equality surface without generator
semantics. If an implementation independently chooses uniformly random values,
the birthday-bound approximation is `n(n-1)/2^257`; even at `n = 10^18`, it is
approximately `4.32 × 10^-42`. This calculation is rationale only. It neither
requires random generation nor substitutes for VE-002's absolute non-duplicate
assignment rule.

## 12. Rejected alternatives

| Alternative | Reason for rejection |
|---|---|
| 16-octet opaque value | Gives a materially smaller accidental-collision margin at very large issuance volumes without reducing the conceptual model. |
| Text or URI identifier | Imports normalization, encoding, and namespace questions that opaque exact bytes avoid. |
| UUID semantics | Imposes generator/version semantics that VE does not need. |
| Content hash | Confuses historical occurrence identity with content identity. |
| Tagged or wrapped CBOR form | Adds representation machinery without changing equality. |
| Profile-defined identifier plus wrapper | Retains unspecified identifier semantics while adding a redundant representation layer. |
| Event-only representation rule | Duplicates a small scalar convention that future owning specifications may explicitly reuse. |
| Registry, resolver, or central authority | Adds identity infrastructure unrelated to portable exact equality. |

## 13. Claim-reference boundary

`EventReference { event_id }` remains an individual Event reference. This RFC
does not add attempt identifiers, history-group references, Claim identifiers,
generic references, or Claim semantics. The Draft Claim Reference Semantics
dependency remains explicit: VE-002 Event representation maturity is separate
from Claim semantic admission. With this VE-002 candidate, an Event reference
has a complete candidate dependency surface for scalar type, canonical
representation, exact equality, malformed-representation rejection, and Event
occurrence semantics. No change to `VE-CLAIM-REFERENCE-SEMANTICS` is required.

## 14. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Exact opaque occurrence identity strengthens independently reproducible historical reference without adding authority. |
| New primitive burden | No new primitive: this is a representation convention adopted only by an owning specification. |
| Necessity/removability | Removing the convention reintroduces unstated Event scalar/equality/wire rules; adding broader identity infrastructure is unnecessary. |
| Twenty-year durability | Fixed opaque bytes and exact equality avoid mutable namespaces and generator fashions. |
| Independent implementation | A decoder needs only the 32-octet invariant and existing VE-CBOR-1 rules. |
| Total conceptual complexity | Smaller than UUID, text, wrapper, or generic identity alternatives. |

## 15. Governance and next steps

This RFC is Accepted. ADR-009 remains Proposed. VE-002 v0.2 remains a Draft
opt-in candidate. This status transition does not accept ADR-009 or approve
VE-002. No Approved specification is changed, and no changelog or
`OPEN_DECISIONS.md` entry is required for this isolated RFC status transition.

A future governed owning-specification revision and vectors must carry the
applicable version and changelog governance. This RFC does not allocate an
identity registry, generator code, or cross-kind namespace.

## 16. Open Questions

None for this RFC. Future VE-001 adoption is a separate possible governed
change, not an unresolved question that blocks this proposal.

## 17. Decision

**A. ACCEPT SHARED VE OCCURRENCE-ID REPRESENTATION.**

An exact 32-octet opaque VE-CBOR-1 byte string is sufficient for explicitly
adopting occurrence kinds. VE-002 may use it for Event identity now as a Draft
candidate; VE-001 Action identity remains unchanged.

This Accepted RFC records the occurrence-identifier architecture at its
declared scope. It does not itself approve VE-002 or accept ADR-009.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-30 | Initial Draft proposing a shared opaque OccurrenceId representation; VE-002 is the sole Draft opt-in candidate. |
| 0.1 | 2026-08-30 | Status transitioned from Draft to Accepted; technical contract, scope, and candidate adoption state unchanged. |
