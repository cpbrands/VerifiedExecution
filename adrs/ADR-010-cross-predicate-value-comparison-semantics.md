---
id: ADR-010
title: Cross-Predicate Value Comparison Semantics
version: "0.1"
status: Accepted
document_type: Architectural Decision Record
category: Architecture
author: Verified Execution Editorial Board
created: 2026-08-31
updated: 2026-08-31
depends_on:
  - SPECIFICATION-GOVERNANCE
  - RFC-010
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
related_documents:
  - RS-QTY-001
  - GAP-ANALYSIS-RS-QTY-001
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - RFC-005
  - RFC-008
  - ADR-008
  - OPEN-DECISIONS
supersedes: null
superseded_by: null
---

# ADR-010 — Cross-Predicate Value Comparison Semantics

## Status and authority boundary

**Status:** Accepted
**Related RFC:** RFC-010 — Cross-Predicate Value Comparison Semantics  
**Decision:** A. ADOPT STRUCTURAL CROSS-PREDICATE VALUE COMPARISON SEMANTICS
INSIDE `value_semantics`.

This Accepted ADR is authoritative at its declared architectural scope. It
changes no Approved specification, chooses no final field name or grammar,
defines no canonical encoding, and allocates no Predicate Schema
representation-profile or PSCID suite code.

RS-QTY-001 and its gap analysis are non-normative evidence. Their Q1–Q9 cases
remain validation evidence, not normative specification text.

## 1. Context

Approved Predicate Schema Semantic Contract v1.1 defines predicate-local value
validity and equality. It does not define when values selected by different
Predicate Schemas share a semantic comparison domain or when ordered relations
are available across those predicates.

RS-QTY-001 demonstrates the gap with a delegated-payment policy: one verified
Claim states an amount and another states a limit. Matching integer forms,
coefficients, scale, or a label such as `CAD` do not by themselves establish
that the values share an ordered domain. Independent implementations must not
invent that missing relationship.

The evidence also demonstrates that whole-`value_semantics` equality is too
strict. Two predicates may use the same comparison domain while imposing
different bounds or allowed values. Comparison meaning must therefore be
separable from predicate-specific admissibility constraints.

Three boundaries must remain distinct:

~~~text
representation compatibility
    != semantic comparability
    != authority and trust
~~~

## 2. Decision question

What is the smallest architectural rule that permits deterministic
cross-predicate equality and ordering without creating a universal quantity
ontology, semantic registry, conversion subsystem, or new VE primitive?

## 3. Decision

**A. ADOPT STRUCTURAL CROSS-PREDICATE VALUE COMPARISON SEMANTICS INSIDE
`value_semantics`.**

VE SHALL support deterministic cross-predicate value comparison through
normalized structural comparison semantics contained within existing
`PredicateSchema.value_semantics`.

Cross-predicate comparison is permitted only when:

1. each value is locally valid under its own Predicate Schema;
2. the invoked comparison capability is explicitly supported; and
3. the normalized structural comparison semantics required for that relation
   are identical.

If any condition fails, the outcome is:

~~~text
NOT COMPARABLE
~~~

`NOT COMPARABLE` is distinct from the comparison result being false. It means
that VE could not establish the semantic preconditions for evaluating the
relation.

This decision creates no kernel primitive. It retains Predicate Schema as the
existing non-primitive normative abstraction that owns Claim value meaning.

## 4. Minimal capability model

The architecture recognizes only the capabilities demonstrated by the
evidence:

- equality comparison; and
- ordered comparison.

Ordered comparison may enable a Rule to use:

~~~text
<  <=  >  >=
~~~

only after the invoked relation is explicitly supported and the comparison
preconditions are satisfied. This decision does not define a generic operator
language and does not introduce arithmetic, aggregation, ratios, tolerance,
approximate equality, or conversion.

Integer representation does not imply ordering. Equal canonical scalar bytes
do not imply semantic comparability.

## 5. Normalized structural semantic equality

Comparability arises from identical normalized structural semantic content,
not from a separately addressable identity. The required content must be
sufficient to define:

- canonical comparison representation and scalar form;
- exact scale and any explicitly governed normalization into that form;
- structural semantic-domain meaning needed to distinguish unrelated domains;
- equality capability and semantics;
- ordered-comparison capability and semantics, when present; and
- every interpretation-affecting rule required by the relation.

This ADR deliberately does not select the final field name, internal field
organization, closed grammar, or canonical representation. Those are governed
specification-design questions.

Comparability is not established by:

- `comparison_domain_id`;
- `unit_id` or `currency_id`;
- external registry identity;
- publisher or namespace identity;
- a semantic-fragment digest or generic content identity;
- a source reference or retrieval location; or
- unrestricted logical or mathematical equivalence.

The comparison semantics remain content inside existing `value_semantics`.
They do not become a `ValueDomain`, Quantity, Money, Currency, Unit, or other
separately addressable architectural object.

## 6. Predicate-local admissibility boundary

Comparison semantics must be separable from predicate-specific admissibility
constraints.

Two predicates may remain comparable even when they differ in:

- bounds;
- allowed values; and
- predicate proposition meaning;

provided both values are locally valid and the normalized comparison semantics
required for the invoked relation are identical.

Local validation occurs before comparison. Separating the concerns does not
erase or weaken either predicate's admissibility rules; it prevents unrelated
predicate restrictions from being mistaken for comparison-domain meaning.

Issuer semantics, subject semantics, time semantics, verification artifacts,
and resource policy may also differ. They remain governed by their existing
owners and do not define cross-predicate value comparability.

## 7. Scale and normalization

Representation alone does not imply comparability. Integer type does not imply
ordering. A scale mismatch does not authorize implicit rescaling.

Only explicitly governed normalization in both Predicate Schemas may establish
one common canonical comparison representation. The normalization rules needed
for the relation must themselves be included in the identical normalized
comparison semantics.

Missing, unsupported, invalid, unresolved, cyclic, or non-identical
normalization semantics produce `NOT COMPARABLE`. Implementations must not
silently rescale, infer a unit, compare raw integers, or fall back to scalar
canonical-byte ordering.

## 8. Domain and authority boundary

VE does not establish universal external truth for labels such as:

~~~text
CAD  USD  kg  hours
~~~

Resource policy determines which Predicate Schemas, issuers, and assertions
are recognized and trusted. VE determines only whether the relevant normalized
structural comparison semantics are identical and permit the requested
relation.

Semantic comparability does not establish:

- Claim authenticity;
- issuer trust;
- predicate recognition;
- Rule applicability;
- resource authorization; or
- execution legitimacy.

Those remain separate verification, Trust Context, Rule/Evaluate, resource
policy, and Execution Boundary gates. A matching semantic structure does not
make an untrusted Claim authoritative, and trusted Claims do not become
comparable merely because both are trusted.

This boundary avoids a global semantic ontology, identity provider, registry,
resolver, or namespace authority.

## 9. Conversion boundary

VE performs no cross-domain conversion.

When conversion is required, the permitted flow is:

~~~text
external authority or system derives value
    -> ordinary Claim expressed in target comparison semantics
    -> VE verifies that Claim
    -> ordinary trust and policy checks
    -> comparison after common-domain preconditions are established
~~~

The conversion method, rate, pricing source, time basis, and economic
correctness remain external. This decision rejects a `ConversionClaim`,
`FXClaim`, UnitConversion primitive, exchange-rate authority inside VE, and
conversion subsystem.

## 10. Fail-closed consequences

Comparison is unavailable when any required semantic material is missing,
unresolved, unsupported, invalid, cyclic, non-identical, or incompatible, or
when either value fails local validation.

No implementation may recover by raw comparison, label matching, implicit
conversion, silent rescaling, registry lookup, network lookup, partial
normalization, or guessing. Unknown semantic features fail closed.

This rule preserves the security distinction between inability to establish a
relation and a valid relation whose result happens to be false.

## 11. Alternatives

| Alternative | Decision |
|---|---|
| No change | Rejected: current v1.1 cannot portably establish the Q1/Q2 ordered relation and invites implementation-local inference. |
| Whole `value_semantics` equality | Rejected: Q5 shows that differing predicate-local bounds need not change comparison-domain meaning. |
| Quantity, Money, Currency, or Unit abstractions | Rejected: introduce a general ontology and lifecycle far beyond the demonstrated comparison requirement. |
| Opaque comparison-domain identifier | Rejected: requires assignment, resolution, binding, collision control, and authority while hiding the semantics that must match. |
| Generic semantic-fragment identity | Rejected: creates a separately addressable digest/reference abstraction that structural comparison does not require. |
| Externalizing all comparison outside VE | Rejected: independent Rule evaluation still needs a portable decision about whether its invoked relation has semantic meaning. |
| Inferring ordering from numeric representation | Rejected: machine representation does not establish semantic domain or order. |
| Embedding conversion semantics | Rejected: imports arithmetic, external authority, market timing, and rate policy that an ordinary verified target-domain Claim can carry. |

The surviving decision is smaller than every alternative that introduces a
general quantity, unit, money, registry, identity, or conversion system.

## 12. Consequences

### 12.1 Positive consequences

- deterministic cross-predicate comparison;
- fail-closed domain mismatch and unsupported relations;
- no financial or physical-unit ontology;
- no new kernel primitive;
- predicate-local constraints remain intact; and
- the same bounded mechanism can apply beyond money when governed structural
  comparison semantics exist.

### 12.2 Negative consequences

- Predicate Schema Semantic Contract normative revision is required;
- Canonical Representation Profile revision is required;
- new semantic and canonicalization conformance vectors are required;
- a future frozen byte-producing closure will require a new immutable
  representation profile and PSCID suite under RFC-008 and ADR-008; and
- `value_semantics` gains additional closed semantic structure.

The added structure is justified because removing it makes the demonstrated
cross-predicate relations unsafe or non-portable. No broader abstraction earns
the same necessity finding.

## 13. Affected Specifications

Likely affected artifacts are:

- `PREDICATE-SCHEMA-SEMANTIC-CONTRACT`;
- `PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE`;
- Predicate Schema canonicalization and semantic-comparison vectors;
- DIGEST/PSCID closure at eventual adoption; and
- `CHANGELOG.md` at eventual Approved-spec adoption.

The expected later Draft candidates are Predicate Schema Semantic Contract
v1.2 and Predicate Schema Canonical Representation Profile v1.2.

The following are not architecturally affected:

- VE-002;
- Claim Reference Semantics;
- Action;
- Event;
- Receipt;
- Adapter; and
- Execution Boundary.

This ADR makes no change to those artifacts or responsibilities.

## 14. Representation and PSCID governance

This Accepted ADR authorizes the architectural direction only. It does not
approve:

- final field names;
- exact semantic grammar;
- canonical encoding;
- a representation-profile code; or
- a PSCID suite code.

The future Canonical Representation Profile revision must define closed
admission, normalization, canonical structure, ordering, and deterministic
VE-CBOR-1 bytes for every supported comparison feature.

Only after that byte-producing closure is frozen and independently verified
may a coordinated adoption allocate new immutable local profile and suite
codes under Accepted RFC-008 and ADR-008. This ADR does not allocate `h'03'`
or assume that `h'03'` will be available. PSCID-1 and all existing profile and
suite assignments remain unchanged.

RFC-005 remains Draft and independent. This decision does not introduce a
generic digest, reference, signature, or semantic-fragment identity.

## 15. Evidence disposition

The decision is supported by:

- RS-QTY-001 — Delegated Payment Limit;
- GAP-ANALYSIS-RS-QTY-001 — Cross-Predicate Ordered Comparison; and
- RFC-010 — Cross-Predicate Value Comparison Semantics.

Q1–Q9 demonstrate same-domain true and false comparisons, cross-domain
rejection, raw-representation insufficiency, differing local constraints,
governed scale normalization, explicit order capability, trust separation,
and external conversion. They remain evidence and do not become normative
conformance rules through this ADR.

## 16. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Explicit deterministic meaning, fail-closed behavior, and separation from authority preserve specification-first design, independent evaluation, and simplicity as security. |
| New primitive burden | No new primitive. Comparison semantics remain within existing Predicate Schema `value_semantics`; Quantity, Money, Currency, Unit, and ValueDomain primitives are rejected. |
| Necessity/removability | Removing the selected semantic contract makes safe Q1–Q9 cross-predicate evaluation unavailable; removing broader ontology, registry, identity, and conversion machinery loses no demonstrated capability. |
| Twenty-year durability | Normalized structural meaning and explicit capabilities do not depend on a currency registry, market provider, publisher, network, or implementation language. |
| Independent implementability | Given a future closed grammar and profile, independent teams can validate locally, normalize semantics, compare them exactly, and either apply the relation or return `NOT COMPARABLE`. |
| Conceptual complexity reduction | One bounded structure inside `value_semantics` replaces the combined complexity of Quantity + Money + Currency + Unit + semantic registry + conversion machinery. |

All six tests pass for the proposed direction. The field grammar and encoding
remain future specification work because architecture should decide the
responsibility before representation fixes its form.

## 17. Governance and next steps

This ADR is Accepted. RFC-010 is Accepted. No specification is revised and no
changelog entry is required by this architecture-only acceptance.

Together, RFC-010 and this ADR authorize preparation of coordinated Predicate
Schema v1.2 Draft candidates. They do not themselves approve those candidates.
Final Approved-spec adoption would require version increments, revision
histories, conformance vectors, security review, a changelog entry, and the
RFC-008/ADR-008 allocation gate.

This acceptance performs no specification edit, profile allocation, or PSCID
suite allocation.

## 18. Conclusion

**A. ADOPT STRUCTURAL CROSS-PREDICATE VALUE COMPARISON SEMANTICS INSIDE
`value_semantics`.**

The proposed decision is the minimum architecture that makes cross-predicate
comparison deterministic while preserving local validation, trust boundaries,
and fail-closed behavior. It deliberately rejects new primitives, universal
domain ontology, conversion, semantic registries, and premature
representation choices.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-31 | Initial Proposed ADR selecting normalized structural cross-predicate comparison semantics within Predicate Schema `value_semantics`. |
| 0.1 | 2026-08-31 | Status transitioned from Proposed to Accepted; decision, exclusions, and representation boundary unchanged. |
