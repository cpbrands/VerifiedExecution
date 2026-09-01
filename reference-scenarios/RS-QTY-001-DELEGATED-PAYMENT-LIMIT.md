---
id: RS-QTY-001
title: Delegated Payment Limit Cross-Predicate Comparison
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Reference Scenario
author: Verified Execution Editorial Board
created: 2026-08-31
updated: 2026-08-31
depends_on:
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
related_documents:
  - GAP-ANALYSIS-RS-QTY-001
  - VE-CLAIM-REFERENCE-SEMANTICS
supersedes: null
superseded_by: null
maturity: Executed as specification-based semantic pressure test
---

# RS-QTY-001 — Delegated Payment Limit Cross-Predicate Comparison

## Authority boundary

This is a non-normative reference scenario. It pressure-tests Approved
Predicate Schema v1.1 without changing an Approved specification, introducing
a primitive, allocating a representation profile or PSCID suite, or defining a
portable Claim wire format.

The scenario assumes authorization, Action occurrence, subject-reference,
issuer-domain, verification, and trust-context questions are already
satisfied. It isolates only whether two verified Claims under different
Predicate Schemas can be compared deterministically as ordered values.

## Scenario

Human H authorizes an AI agent to execute a vendor payment only if:

```text
payment amount <= CAD 50,000
```

The proposed Action is:

```text
Pay Vendor V CAD 48,750
```

Two independently issued, verified Claims are available:

```text
Claim A
predicate = delegated_payment_limit
value     = 5,000,000

Claim B
predicate = payment_amount
value     = 4,875,000
```

The integer coefficients are intended to use decimal scale 2. That shared
representation shape is a test input, not proof that the Claims denote CAD,
belong to the same semantic domain, permit ordering, or come from an authority
recognized by the resource.

## Concerns under test

The replay keeps three concerns separate:

| Concern | Question | Owner |
|---|---|---|
| Representation compatibility | Can both values be validated and normalized into the same deterministic scalar representation? | Predicate Schema representation profile and FieldForm grammar |
| Semantic comparability | Do both values inhabit the same semantic domain, share the same comparison normalization, and permit the requested relation? | Predicate Schema `value_semantics` |
| Authority and trust | May these verified assertions be relied upon for this Action and resource? | Verification, recognized predicates/issuers, Trust Context, Rule, and resource policy |

Integer representation and `scale = 2` address only the first concern. They do
not establish CAD semantics or authority.

## Current v1.1 authority replay

Approved Predicate Schema Semantic Contract v1.1 requires
`value_semantics` to define the permitted value domain and equality. For a
measurement or amount it also requires applicable unit, scale, range, and
signedness. It does not define a cross-predicate compatibility test or require
an explicit ordered-comparison relation.

Approved Canonical Representation Profile v1.1 canonicalizes bounded Integer
forms and exact scale, but its current portable subset rejects explicit or
implied unit-bearing semantics. Absence of unit semantics means dimensionless,
not an unspecified currency. Consequently, the current portable profile cannot
encode CAD-bearing value semantics for this scenario.

Whole normalized `value_semantics` equality also cannot be assumed to be the
cross-predicate rule: the field includes predicate-specific admissibility such
as bounds and allowed values, which may differ without changing the underlying
ordered comparison domain.

## Pressure-test execution

### Q1 — same domain, amount under limit

```text
limit  = CAD 50,000  -> coefficient 5,000,000 at scale 2
amount = CAD 48,750  -> coefficient 4,875,000 at scale 2
```

Expected mathematical relation:

```text
4,875,000 <= 5,000,000 = true
```

Current v1.1 result: **NOT DERIVABLE PORTABLY**. The coefficients have a
compatible shape, but v1.1 supplies neither portable CAD semantics nor an
explicit cross-predicate ordered-comparison compatibility rule. Treating the
values as comparable would infer semantics absent from current authority.

Required result after a narrow extension: **comparable; true**, but only when
both Predicate Schemas establish identical normalized comparison semantics and
explicitly permit ordered comparison.

### Q2 — same domain, amount exceeds limit

```text
limit  = CAD 50,000  -> coefficient 5,000,000 at scale 2
amount = CAD 50,001  -> coefficient 5,000,100 at scale 2
```

Current v1.1 result: **NOT DERIVABLE PORTABLY** for the same reason as Q1.

Required result after a narrow extension: **comparable; false**.

### Q3 — different currencies

```text
limit  = CAD 50,000
amount = USD 48,750
```

Result: **NOT COMPARABLE**. Matching integer forms and scales do not erase the
semantic-domain mismatch. VE must not obtain exchange rates, select a market
source, or perform currency conversion.

### Q4 — same number, unrelated domain

```text
limit  = CAD 50,000
amount = 50,000 unrelated units
```

Result: **NOT COMPARABLE**. Raw coefficient equality, scale equality, and
canonical-byte equality of the scalar alone do not establish semantic-domain
equality.

### Q5 — same ordered domain, different predicate constraints

```text
delegated_payment_limit admissible range = CAD 0..1,000,000
payment_amount admissible range          = CAD 0..100,000
```

Result under whole-`value_semantics` equality: **INCORRECTLY NOT COMPARABLE**,
because the bounds differ.

Required semantic result: **COMPARABLE** when the values pass their respective
predicate constraints and their normalized comparison semantics are identical.
Predicate-specific bounds and allowed-value restrictions may differ.

This rejects whole-field equality as the minimum compatibility rule.

### Q6 — same conceptual currency, different scale

```text
Predicate A representation: integer, scale 2
Predicate B representation: integer, scale 0
```

Current result: **NOT COMPARABLE**. VE must not silently rescale values.

A future comparison contract may permit comparison only if both schemas bind
to the same governed normalization that produces one canonical comparison
representation. Without that shared rule, the mismatch fails closed.

### Q7 — integer domain without ordering

```text
status_code = integer
```

Result: **NOT ORDER-COMPARABLE**. Integer representation does not imply that
`<`, `<=`, `>`, or `>=` are meaningful. Ordered comparison must be explicitly
permitted by the applicable comparison semantics.

### Q8 — same label, untrusted schema

Two schemas contain the text `"CAD"`, but one belongs to an unrecognized or
untrusted predicate ecosystem.

Semantic result: structural semantic compatibility may be established only if
the complete normalized comparison semantics are identical. The label alone
is insufficient.

Authority result: **NOT AUTHORIZED BY COMPARABILITY**. Even identical
comparison semantics do not establish issuer trust, predicate recognition,
Claim validity, Rule applicability, or resource authorization.

### Q9 — conversion supplied as a verified Claim

A trusted external authority supplies a verified assertion that, for policy X
at time T, USD 48,750 is represented for this evaluation as CAD 66,100.

Result: VE need not learn or execute FX conversion. The external authority owns
the conversion method and evidence. VE verifies and applies the resulting
Claim under ordinary trust and policy rules, then compares the resulting CAD
value only if it and the limit establish the same normalized CAD comparison
semantics.

This supports the boundary:

```text
external authority performs conversion
    -> VE verifies the resulting Claim
    -> VE compares only common-domain values
```

## Scenario scorecard

| Test | Result under current Approved v1.1 | Finding |
|---|---|---|
| Q1 | Not portably derivable | Same shape is insufficient |
| Q2 | Not portably derivable | Ordering contract is absent |
| Q3 | Not comparable | No currency conversion |
| Q4 | Not comparable | Raw numeric equality is insufficient |
| Q5 | Whole-field equality fails | Comparison semantics must be separable from admissibility |
| Q6 | Not comparable absent shared normalization | No silent rescaling |
| Q7 | Not order-comparable | Integer does not imply order semantics |
| Q8 | Compatibility does not establish authority | Trust boundary preserved |
| Q9 | Comparable only after authoritative common-domain assertion | Conversion remains external |

## Scenario verdict

The scenario demonstrates a real but narrow gap. Approved v1.1 can describe
predicate-specific value meaning and deterministic scalar representation, but
does not define portable unit-bearing CAD semantics, an explicit ordered
relation, or the rule by which two different Predicate Schemas establish a
shared ordered comparison domain.

It does not demonstrate a need for Quantity, Money, Currency, Unit,
conversion, exchange-rate, or arithmetic primitives.

The detailed disposition is recorded in `GAP-ANALYSIS-RS-QTY-001`.
