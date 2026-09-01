---
id: RFC-010
title: Cross-Predicate Value Comparison Semantics
version: "0.1"
status: Accepted
document_type: RFC
category: Semantics
author: Verified Execution Editorial Board
created: 2026-08-31
updated: 2026-08-31
depends_on:
  - SPECIFICATION-GOVERNANCE
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
related_documents:
  - RS-QTY-001
  - GAP-ANALYSIS-RS-QTY-001
  - RFC-005
  - RFC-008
  - ADR-008
  - OPEN-DECISIONS
supersedes: null
superseded_by: null
---

# RFC-010 — Cross-Predicate Value Comparison Semantics

## 1. Status, accepted decision, and narrow scope

This RFC is Accepted. It records a narrow extension to the existing Predicate
Schema `value_semantics` model so that independent implementations can decide
whether values governed by different predicates inhabit the same comparison
domain and support a requested relation.

The accepted architectural decision is:

> Cross-predicate comparison is permitted only when each value is valid under
> its own Predicate Schema, both schemas permit the requested relation, and
> the normalized structural comparison semantics required for that relation
> are identical.

The comparison semantics remain field semantics inside the existing
`PredicateSchema.value_semantics` abstraction. They are not a separately
addressable semantic object, a new VE primitive, a registry entry, or a
generic content identity.

This RFC decides only the architectural semantic boundary. It does not select
final field names, a final closed representation grammar, CBOR labels, a new
canonicalization profile code, or a new PSCID suite code.

## 2. Context

RS-QTY-001 tests a delegated-payment policy in which one verified Claim states
a CAD-denominated payment amount and another, governed by a different
predicate, states a CAD-denominated limit. Both may use an integer coefficient
and the same scale, yet current Predicate Schema v1.1 does not provide a
portable rule establishing that the two values share an ordered semantic
domain.

The associated gap analysis establishes three distinct questions:

~~~text
representation compatibility
semantic comparability
authority and trust
~~~

Equal scalar forms answer only the first. Identical governed comparison
semantics answer the second. Verification, Trust Context, Rule applicability,
and resource policy answer the third. None implies either of the others.

Approved Predicate Schema v1.1 defines predicate-local value validity and
canonical equality within its supported closure. It does not define the
cross-predicate comparison boundary, ordered-comparison permission, or a
portable unit-bearing comparison domain. Raw integer comparison would
therefore invent missing semantics.

## 3. Motivation

Without a governed cross-predicate comparison contract, implementations must
either reject useful policies such as RS-QTY-001 or invent local rules for
domain labels, scale, ordering, and bounds. Local invention would make the
same verified inputs evaluate differently across implementations and could
permit comparisons across unrelated semantic domains.

The proposal supplies only the semantic information required to determine
whether a relation has meaning. It deliberately leaves authority, conversion,
arithmetic, and universal quantity modeling outside VE.

## 4. Goals and non-goals

### 4.1 Goals

This RFC aims to define the minimum semantic contract needed to:

- establish equality or ordered comparability across different predicates;
- separate comparison-domain meaning from predicate-local admissibility;
- make relation support explicit rather than inferred from scalar form;
- distinguish structural semantic compatibility from authority and trust;
- fail closed whenever comparison preconditions cannot be proved; and
- preserve independent implementation without a registry or semantic label.

### 4.2 Non-goals

This RFC does not define:

- arithmetic, aggregation, ratios, averages, tolerance, or approximate
  equality;
- unit conversion, currency conversion, exchange rates, or pricing authority;
- a universal Quantity, Money, Currency, Unit, or Value Domain model;
- an Entity model, identity provider, registry, resolver, or namespace
  authority;
- a Rule operator language or changes to Rule/Evaluate;
- trust, verification, issuer authority, or authorization;
- final representation mechanics, wire encoding, or PSCID allocation; or
- a generic semantic-fragment identity, digest, or reference architecture.

## 5. Proposed Change

### 5.1 Comparison semantics remain inside `value_semantics`

Predicate-specific `value_semantics` must be able to distinguish:

~~~text
comparison semantics       semantic meaning needed to compare values
admissibility constraints  predicate-local bounds and allowed values
~~~

These labels describe responsibilities, not final field names or a selected
wire structure. The minimum comparison semantics include every
interpretation-affecting rule needed for the relation:

- canonical comparison representation and scalar form;
- exact scale and governed normalization into that representation;
- structural semantic-domain meaning sufficient to distinguish CAD, USD, and
  unrelated domains;
- equality semantics;
- an explicit equality-comparison capability;
- an explicit ordered-comparison capability, when ordering is meaningful; and
- any other rule that changes interpretation of the requested comparison.

Predicate-local bounds and allowed values remain validation constraints. They
may differ between predicates without making their otherwise identical
comparison domains different.

### 5.2 Structural, not referential

Comparison compatibility is established by exact governed normalized semantic
content. It is not established by any of the following:

- a `comparison_domain_id`, `unit_id`, or `currency_id`;
- a `ValueDomain` object or reference;
- a generic semantic-fragment digest or content identity;
- a publisher, namespace, registry assignment, URL, or source location; or
- unrestricted logical, mathematical, or theorem-proved equivalence.

The proposed comparison material is not a separately addressable sub-object.
Ordinary source composition may be governed in a future specification, but
any source reference must disappear through resolution and normalization; the
comparison decision depends on normalized structural content, not the source
reference.

### 5.3 Comparison preconditions

For values `A` and `B` governed by Predicate Schemas `PA` and `PB`, a requested
relation is semantically available only when all of the following hold:

1. `A` is valid under `PA`, including `PA`'s local admissibility constraints.
2. `B` is valid under `PB`, including `PB`'s local admissibility constraints.
3. Both schemas explicitly permit the requested relation.
4. All comparison semantics required for that relation resolve and normalize
   successfully.
5. The resulting normalized comparison semantics are identical.

Only then may an implementation apply the relation to the normalized canonical
comparison representations.

### 5.4 Information that may differ

The following may differ without preventing comparison, provided the five
preconditions above hold:

- predicate identity and proposition meaning;
- minimum and maximum admissible values;
- allowed-value restrictions;
- issuer-domain semantics;
- subject-domain and subject-form constraints;
- time semantics;
- Claim issuers and verification artifacts; and
- trust, Rule applicability, and resource policy.

These differences remain effective for validation and policy. Comparison does
not erase them.

## 6. Equality and ordered-comparison capabilities

The semantic model exposes capabilities, not a new operator language.

An equality capability permits exact semantic equality comparison after
validation and normalization. An ordered-comparison capability permits the
relations:

~~~text
<  <=  >  >=
~~~

only when the identical normalized comparison semantics define ordering and
permit the requested relation. Integer representation, equal scale, or equal
canonical bytes alone do not imply ordered comparability.

Rules may use a supported relation only after comparison semantics establish
that capability. This RFC does not revise Rule syntax or Rule/Evaluate
semantics.

## 7. Fail-closed behavior

If any required comparison semantic material is missing, unresolved,
unsupported, invalid, non-identical, cyclic, or incompatible, the result is:

~~~text
NOT COMPARABLE
~~~

`NOT COMPARABLE` is distinct from the requested relation evaluating to false.
It means the semantic preconditions for evaluating that relation were not
established.

An implementation must not respond to failure by:

- comparing raw integers or canonical scalar bytes;
- assuming matching labels denote the same domain;
- silently rescaling values;
- inferring a unit or currency;
- consulting a market, registry, resolver, or network service;
- ignoring unknown comparison semantics; or
- guessing, partially normalizing, or selecting a fallback domain.

## 8. Authority and trust boundary

Structural comparability establishes deterministic meaning only. It does not
establish that a Claim is authentic, trusted, applicable, current, sufficient,
or authorized for execution.

~~~text
Predicate Schema comparison semantics -> meaning of comparison
verification and recognized issuer    -> verified assertion
Trust Context / Rule / resource policy -> authority and applicability
~~~

VE does not establish the external truth of a label such as `CAD`. Trusted
predicates, recognized issuers, and resource policy determine whether Claims
using particular semantics are acceptable. VE establishes only whether the
normalized structural semantics are identical and support the relation.

Two untrusted Predicate Schemas do not gain authority by matching. Likewise,
two authoritative Claims are not comparable unless their comparison semantics
match.

## 9. Conversion boundary

VE does not perform currency or unit conversion. Conversion remains an
external act. A resource-recognized authority may perform it and issue an
ordinary verified Claim whose value is already expressed in the policy's
comparison domain.

VE may then verify that Claim, apply ordinary trust and policy checks, and
compare it only after the common-domain preconditions in this RFC are met.
The rate, conversion method, pricing source, timing, and economic correctness
remain outside VE.

No conversion result is trusted merely because its value is structurally
comparable.

## 10. RS-QTY-001 Q1–Q9 coverage

| Case | Proposed result |
|---|---|
| Q1 | Comparable; `amount <= limit` may evaluate true only after identical CAD comparison semantics and ordered capability are established. |
| Q2 | Comparable; the same relation may evaluate false under the same semantic preconditions. |
| Q3 | Different currency/domain semantics produce `NOT COMPARABLE`; matching coefficients and scale do not help. |
| Q4 | The same numeric representation in unrelated semantic domains produces `NOT COMPARABLE`; raw numeric equality does not establish domain equality. |
| Q5 | Different predicate-local bounds remain compatible when both values validate and normalized comparison semantics are identical. |
| Q6 | Differently scaled values are comparable only when both schemas define the same governed normalization into one canonical comparison representation; no silent rescaling is permitted. |
| Q7 | Equal integer representation without explicit ordered capability does not authorize `<`, `<=`, `>`, or `>=`. |
| Q8 | Comparability and a matching domain label do not establish trust, applicability, or authorization; those remain resource-policy decisions. |
| Q9 | Conversion is external and must yield an ordinary verified Claim already in the target comparison domain. |

All nine cases are decided without a universal quantity ontology, semantic
registry, or conversion engine.

## 11. Alternatives Considered

| Alternative | Reason for rejection |
|---|---|
| No change | Current v1.1 has no portable cross-predicate or ordered-comparison rule and cannot safely derive one from integer representation. |
| Whole `value_semantics` equality | Incorrectly rejects Q5 when predicate-local bounds differ but comparison-domain meaning is identical. |
| Quantity, Money, Currency, or Unit primitive | Adds an ontology and lifecycle far broader than the demonstrated comparison requirement. |
| Opaque comparison-domain identifier | Requires assignment, resolution, collision control, immutable binding, and authority while hiding the semantics that must actually match. |
| Generic semantic-fragment content identity | Introduces a separately addressable abstraction and digest governance not required for structural comparison. |
| Externalize all comparison | Prevents portable independent implementations from determining whether a Rule relation has defined meaning. |
| Infer ordering from scalar type | Conflates machine representation with semantic order and enables cross-domain comparison errors. |
| Embed conversion semantics | Imports market authority, timing, arithmetic, and policy concerns that ordinary verified Claims can carry without changing VE comparison semantics. |

The surviving direction is normalized structural comparison semantics inside
the existing `value_semantics` field.

## 12. Security Impact

The proposal must resist:

- cross-domain comparison caused by matching coefficients or labels;
- currency or unit label spoofing;
- confusion between semantic comparability and trust;
- representation-profile downgrade or relabeling;
- ambiguous or inferred ordering;
- scale mismatch and silent rescaling;
- conversion smuggling through comparison semantics; and
- unknown semantic material being ignored.

The general security property is:

> Failure to prove every comparison precondition must produce `NOT
> COMPARABLE`; it must never fall through to raw representation comparison.

This property applies equally to inline material and any future governed
source-composition mechanism.

## 13. Compatibility Classification

**Class B — Compatible Semantic Extension candidate.**

The direction adds an optional capability for Predicate Schemas that need
cross-predicate comparison. Existing Predicate Schema v1.1 meanings remain
unchanged. A v1.1 schema that does not use the new capability remains valid
under its v1.1 authority, and this RFC does not claim that its PSCID remains
equal under a future representation profile.

Final compatibility depends on the future governed Semantic Contract and
Canonical Representation Profile revisions and their conformance evidence.

## 14. Specification Impact

If accepted, the likely affected artifacts are:

- Predicate Schema Semantic Contract v1.2 candidate;
- Predicate Schema Canonical Representation Profile v1.2 candidate;
- canonicalization and semantic-comparison conformance vectors;
- DIGEST/PSCID profile closure at eventual adoption; and
- `CHANGELOG.md` at eventual Approved-spec adoption.

Claim Reference Semantics is not affected. VE-002 is not affected. Rule
syntax is not affected.

The current Approved canonical profile is closed and does not encode this new
comparison material. A future profile must define a closed canonical
representation and exact normalization for every admitted comparison-semantic
feature before portable Predicate Schema bytes can be claimed.

This RFC does not select a successor representation-profile code or PSCID
suite code. Any later allocation must follow Accepted RFC-008 and ADR-008:
freeze the complete byte-producing closure, provide anchors and independent
implementations, pass the security gate, audit code availability, and assign
new immutable append-only values. No `h'03'` or other numeric value is assumed.

## 15. Implementation Impact

An implementation of a future approved revision would need to:

- validate each value under its own Predicate Schema;
- resolve and normalize all comparison-semantic material;
- compare normalized comparison semantics exactly;
- check that the requested relation is explicitly supported;
- apply the relation only to the canonical comparison representations; and
- return `NOT COMPARABLE` whenever any prerequisite fails.

No registry client, network resolver, conversion engine, theorem prover, or
new runtime abstraction is required.

## 16. Complexity Impact

The proposal adds one bounded semantic responsibility within existing
`value_semantics`. It avoids the larger conceptual surface of:

~~~text
Money + Currency + Unit + Quantity + conversion service
~~~

It also avoids a registry, generic semantic reference, content-identity
primitive, and operator language. The minimum retained concepts are the ones
an independent implementation must know to decide whether a relation has
meaning.

## 17. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Deterministic, fail-closed comparison strengthens independent evaluation while keeping trust and execution authority separate. |
| New primitive burden | No new primitive. The capability is semantic content inside the existing Predicate Schema `value_semantics` abstraction. |
| Necessity/removability | Removing the comparison contract leaves Q1–Q9 undecidable or unsafe; removing broader Quantity/registry/conversion machinery preserves the required architecture. |
| Twenty-year durability | Structural normalized meaning and explicit relation capability do not depend on a currency registry, market provider, identifier fashion, or implementation language. |
| Independent implementation | Two teams can validate values, normalize closed comparison semantics, test exact identity, and either apply the permitted relation or return `NOT COMPARABLE`. |
| Total conceptual complexity | One bounded extension is smaller than universal quantity, unit, money, semantic-fragment identity, and conversion abstractions. |

## 18. Governance and sequencing

This RFC is Accepted and authoritative at its declared architectural scope. It
adds no kernel primitive, changes no Approved specification, allocates no
profile or suite code, and does not resolve an Open Decision.

The next governance gate is acceptance of ADR-010, which records the
architectural decision. Only after both RFC and ADR acceptance may a
coordinated Draft specification revision define final semantics and
representation. Approved-spec adoption would then require version increments,
closed conformance evidence, security review, changelog, and RFC-008/ADR-008
identity-allocation governance.

RFC-005 remains Draft and independent. This RFC does not solve or depend on a
generic VE digest, reference, or signature architecture.

## 19. Open Questions

Only the following bounded representation and design questions remain open:

1. What is the exact internal field organization inside `value_semantics`?
2. What closed grammar represents structural semantic-domain meaning?
3. What is the exact declaration form for equality and ordered-comparison
   capabilities?
4. Can comparison constraints reuse existing `FieldForm` structures, or is a
   bounded grammar extension required?

These questions must be resolved before specification and canonical-profile
adoption. They do not reopen whether comparison semantics are structural,
whether they live inside `value_semantics`, whether trust is separate, or
whether conversion remains external.

## 20. Decision

**A. ADOPT STRUCTURAL CROSS-PREDICATE VALUE COMPARISON SEMANTICS INSIDE
`value_semantics`.**

The direction is sufficient and minimal: compare only valid values, require
explicit relation capability, require identical normalized structural
comparison semantics, and fail closed otherwise. It adds no architectural
primitive and does not conflate comparability with authority.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-31 | Initial Draft proposing normalized structural cross-predicate comparison semantics within Predicate Schema `value_semantics`. |
| 0.1 | 2026-08-31 | Status transitioned from Draft to Accepted; architectural direction, exclusions, and representation boundary unchanged. |
