---
id: GAP-ANALYSIS-RS-QTY-001
title: Gap Analysis — RS-QTY-001 Cross-Predicate Ordered Comparison
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-08-31
updated: 2026-08-31
depends_on:
  - RS-QTY-001
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
related_documents:
  - RFC-005
  - OPEN-DECISIONS
supersedes: null
superseded_by: null
maturity: Non-normative architectural gap analysis
---

# Gap Analysis — RS-QTY-001 Cross-Predicate Ordered Comparison

## Authority boundary

This analysis is non-normative evidence. It does not revise Predicate Schema
v1.1, define final field names or encodings, approve CAD or unit semantics,
create a primitive, resolve an Open Decision, or create an RFC or ADR.

## Core question

What is the minimum semantic information required for two independently
implemented verifiers to establish that values selected by different Predicate
Schemas belong to the same ordered comparison domain?

RS-QTY-001 distinguishes:

```text
representation compatibility
semantic comparability
authority and trust
```

The first does not imply the second, and neither implies the third.

## Current v1.1 capability

Approved Predicate Schema Semantic Contract v1.1 requires
`value_semantics` to define the permitted value domain and equality. For
amount-like values it requires unit, scale, range, signedness, and equality.
That establishes predicate-local meaning, but it does not define:

- a cross-predicate compatibility rule;
- an explicit ordered-comparison relation;
- which subset of `value_semantics` constitutes the comparison domain; or
- how comparison-domain semantics remain equal when predicate-specific bounds
  and allowed values differ.

Approved Canonical Representation Profile v1.1 can deterministically encode
dimensionless scaled integers. It explicitly rejects unit-bearing values in its
bounded portable subset. It therefore cannot provide portable CAD comparison
semantics for RS-QTY-001.

Current v1.1 safely supports predicate-local validation and canonical equality
within its bounded subset. It does not currently authorize safe portable
cross-predicate ordered comparison for this scenario.

## Candidate attacks

### Candidate A — no change

Claim: existing `value_semantics` is sufficient.

Attack result: **REJECTED**.

The normative text requires predicate-local domain and equality semantics but
does not define ordered relations or a cross-predicate comparability test. CAD
semantics are also outside the current portable profile. Q1 and Q2 cannot be
derived without inventing missing behavior.

### Candidate B — whole `value_semantics` equality

Claim: cross-predicate comparison is permitted only when normalized
`value_semantics_A == value_semantics_B`.

Attack result: **REJECTED**.

Q5 demonstrates the defect. Predicate-specific admissibility bounds and
allowed values may differ while both predicates still use the same semantic
ordered domain. Whole-field equality incorrectly rejects those values.

### Candidate C — scoped value comparison semantics

Claim: `value_semantics` can distinguish the semantic material needed for
comparison from predicate-specific admissibility constraints.

Attack result: **SURVIVES, SUBJECT TO GOVERNED SPECIFICATION**.

The minimum conceptual split is:

```text
value_semantics
  comparison semantics?   // shared-domain meaning and permitted relations
  admissibility           // predicate-specific bounds/allowed values
```

`comparison semantics` is a descriptive placeholder, not a selected field
name or new architectural object. It remains semantic content inside the
existing Predicate Schema `value_semantics` abstraction.

### Candidate D — Quantity, Unit, Currency, or Money abstraction

Attack result: **REJECTED AS UNNECESSARY**.

The scenario needs only an exact common semantic domain, deterministic
normalization, equality, and an explicitly permitted order relation. It does
not require a universal quantity taxonomy, money lifecycle, currency object,
unit registry, exchange-rate model, arithmetic service, or conversion engine.

### Candidate E — opaque comparison-domain identifier

Attack result: **REJECTED**.

An opaque identifier would require assignment, collision avoidance,
resolution, immutable binding, namespace authority, and compatibility rules.
It recreates registry or semantic-fragment identity machinery without
demonstrating that those concepts are necessary.

The result does not prohibit ordinary governed source composition, but the
comparison decision must ultimately depend on identical normalized semantic
content, not matching opaque labels or locations.

### Candidate F — normalized structural comparison semantics

Attack result: **SURVIVES AND IS THE MINIMUM DIRECTION**.

Two Predicate Schemas may establish comparability through identical normalized
structural semantic content that defines only:

- the canonical comparison representation;
- exact scale and normalization needed to reach it;
- semantic domain material sufficient to distinguish CAD, USD, and unrelated
  domains without creating a universal Currency or Unit object;
- equality semantics; and
- the explicitly permitted comparison relation set.

No registry, resolver, publisher namespace, generic semantic-fragment ID,
conversion machinery, or theorem-proving equivalence is required. Structural
identity means exact governed normalized-content identity, not unrestricted
logical equivalence.

## Minimum surviving semantic contract

Final specification language and field names remain open. The minimum contract
demonstrated by this analysis is:

```text
Cross-predicate ordered comparison is permitted only when:

1. each value is valid under its own Predicate Schema;
2. both Predicate Schemas explicitly permit the requested ordered relation;
3. both resolve and normalize their comparison semantics successfully; and
4. the resulting normalized comparison semantics are identical.
```

### Information that must be identical

- canonical comparison representation and scalar form;
- exact scale and any governed normalization into that representation;
- semantic-domain material that distinguishes CAD from USD and unrelated
  domains;
- equality semantics;
- ordering semantics, including the requested relation; and
- any interpretation-affecting comparison rule.

Identity is exact normalized semantic-content identity. A common text label,
raw integer, equal coefficient, equal scale, publisher, or source location is
not enough.

### Information that may differ

- predicate identity and proposition meaning;
- admissible minimum and maximum values;
- allowed-value restrictions;
- issuer-domain semantics;
- subject-domain and subject-form constraints;
- time semantics;
- verification artifacts and issuers; and
- trust, Rule applicability, and resource policy.

The differing predicate-local constraints still validate before comparison.
They are not erased; they simply do not determine whether two valid values
inhabit the same ordered domain.

## Operator scope

RS-QTY-001 demonstrates the need only for:

```text
equality
ordered comparison: <, <=, >, >=
```

An implementation may apply only relations explicitly permitted by identical
normalized comparison semantics. Integer representation alone permits none of
the ordered relations.

The scenario does not justify addition, subtraction, multiplication, division,
ratios, averages, aggregation, tolerance, approximate equality, unit
conversion, currency conversion, or exchange rates.

## Mismatch and fail-closed behavior

The values are **NOT COMPARABLE** when any required comparison semantic
material is missing, unresolved, unsupported, invalid, non-identical, or does
not permit the requested relation. Implementations must not fall back to raw
integer comparison, compare scalar canonical bytes as a proxy for semantic
order, silently rescale, infer units, consult a market source, or guess.

`NOT COMPARABLE` is not the same as the ordered relation returning false. It is
a failure to establish the relation's semantic preconditions.

## Conversion boundary

VE does not perform unit or currency conversion. A recognized external
authority may perform conversion and issue a verified Claim whose value is
already expressed in the policy's comparison domain. VE then:

```text
verifies the resulting Claim
  -> applies ordinary trust and policy checks
  -> compares only after common-domain semantics are established
```

The conversion method, rate source, pricing authority, timing, and economic
correctness remain external. VE does not learn or standardize FX behavior.

## Authority and trust boundary

Semantic compatibility establishes only that a relation has a deterministic
meaning. It does not establish that either Claim is authentic, trusted,
applicable, current, sufficient, or authorized for execution.

```text
Predicate Schema comparison semantics -> comparison meaning
verification and recognized issuer    -> verified assertion
Trust Context / Rule / resource policy -> authority and applicability
```

Two untrusted schemas do not become authoritative because their normalized
comparison semantics match.

## Q1–Q9 disposition

| Case | Minimum-contract result |
|---|---|
| Q1 | Comparable and `amount <= limit` is true only after identical CAD comparison semantics and ordered permission are established. Current v1.1 cannot derive it portably. |
| Q2 | Comparable and `amount <= limit` is false under the same preconditions. Current v1.1 cannot derive it portably. |
| Q3 | Not comparable; CAD and USD semantic content differ. |
| Q4 | Not comparable; raw numeric equality does not establish domain equality. |
| Q5 | Comparable despite different predicate bounds, after each value validates locally. |
| Q6 | Not comparable unless both schemas define the same governed normalization into one canonical comparison representation. |
| Q7 | Not order-comparable without explicit ordered-relation permission. |
| Q8 | Semantic compatibility does not confer trust or authority. |
| Q9 | VE may consume a trusted resulting common-domain Claim without implementing conversion. |

## Architectural Decision Test

| Test | Candidate C/F result |
|---|---|
| Founding Principles consistency | Pass. Comparison meaning is explicit, inspectable, deterministic, and separate from authority. |
| New primitive burden | Pass. The extension remains semantic material inside existing Predicate Schema `value_semantics`; it adds no kernel primitive. |
| Removability | Pass. Removing the scoped comparison material loses safe cross-predicate ordering; removing Quantity/Money/Unit abstractions loses no tested capability. |
| Twenty-year durability | Pass. Exact normalized semantic content and fail-closed matching do not depend on a registry, network resolver, publisher, or market source. |
| Independent implementability | Pass in principle, provided a governed revision fixes the closed semantic structure, normalization, representation, and relation vocabulary. Current v1.1 does not yet do so. |
| Total conceptual complexity reduction | Pass. One scoped comparison-semantic structure is smaller than whole-field coupling, universal quantity architecture, conversion machinery, or an opaque identifier system. |

Candidates A, B, D, and E fail at least necessity, removability, or independent
implementability. Candidates C and F describe the same surviving direction:
scoped normalized structural comparison semantics inside `value_semantics`.

## Gap classification

**B. REAL GAP — VALUE_SEMANTICS REQUIRES A NARROW CROSS-PREDICATE COMPARISON EXTENSION.**

No new kernel primitive is required. The gap is additional semantics within
the existing non-primitive Predicate Schema abstraction.

## Governance implication

Implementing the surviving direction would change Approved Predicate Schema
v1.1 and its machine-affecting representation. Governance therefore requires:

- an RFC establishing the narrow semantic extension and exclusions;
- an ADR accepting or rejecting that architecture;
- a Predicate Schema specification revision and version increment;
- a coordinated Canonical Representation Profile revision;
- conformance vectors and, if canonical bytes change, a new immutable
  representation-profile code and PSCID suite under existing suite governance;
  and
- a changelog entry at adoption.

The likely next target is **Predicate Schema Semantic Contract v1.2 Draft**,
coordinated with a Canonical Representation Profile v1.2 Draft. The existing
Field-Semantic Representation Grammar may be reusable, but that must be tested
against the eventual closed structure rather than assumed here.

No RFC or ADR is created by this analysis.

## Recommended next action

Independently audit RS-QTY-001 and this gap analysis. If the evidence survives,
draft a focused RFC for scoped cross-predicate comparison semantics inside
`value_semantics`, with explicit exclusions for Quantity, Money, Currency,
Unit, conversion, arithmetic, registry, resolver, and trust semantics.

## Disposition

**SAFE TO DRAFT RFC**, subject to independent audit of these non-normative
artifacts. Do not revise Approved Predicate Schema specifications until the RFC
and ADR governance path is complete.
