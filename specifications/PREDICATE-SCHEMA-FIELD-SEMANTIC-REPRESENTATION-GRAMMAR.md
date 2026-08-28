---
id: PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
title: Predicate Schema Field-Semantic Representation Grammar
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Representation
author: Verified Execution Editorial Board
created: 2026-08-28
updated: 2026-08-28
depends_on:
  - ADR-ENC-001
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
related_documents:
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CLAIM-REFERENCE-SEMANTICS
  - RFC-005
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# Predicate Schema Field-Semantic Representation Grammar

## Status and authority boundary

This is a Draft candidate representation artifact. It defines a small, closed
mechanical grammar for expressing field semantics that Predicate Schema
semantics already require. It applies those boundaries and ADR-ENC-001
canonical-encoding mechanics; it does not redefine Claim semantics, Predicate
Schema semantics, verification, Trust Context, Rule/Evaluate, Action, Event,
or trust.

This grammar is representation machinery. It does not create a VE primitive, a
Claim-body field, a universal value or identity system, a universal time system,
a generic `SemanticContract`, or a runtime wrapper around `Claim.body.value`.

The accepted Claim envelope remains unchanged:

```text
Claim {
  body,
  verification {
    profile,
    artifact
  }
}
```

## 1. Architectural decision

### Verdict

**A. CLOSED GRAMMAR SUFFICIENT; EXISTING FIELD REFERENCES HANDLE REUSE.**

One shared closed mechanical grammar is necessary for independent
implementations to parse, validate, normalize, and prepare issuer, value, and
time semantic material for canonical encoding. Separate issuer, value, and time
grammars would duplicate scalar, record, collection, range, and failure
behavior. Allowing each Predicate Schema to invent its own representation would
prevent portable canonicalization.

`issuer_domain_ref`, `value_semantics_ref`, and `time_semantics_ref` are
existing field-specific source-composition mechanisms already defined by the
Predicate Schema Semantic Contract. They are outside this representation
grammar and introduce no generic semantic-reference mechanism. They are valid
only in their named field contexts, resolve to retained immutable semantic
content, and fail closed when unavailable.

This grammar defines no `semantic_ref`, `field_semantics_ref`, `extension_ref`,
`contract_ref`, `custom_semantics_ref`, generic extension map, registry, or new
VE object.

## 2. Representation versus semantics

```text
Predicate Schema semantics
    -> what an issuer, value, subject constraint, or Claim time means

Field-semantic representation grammar
    -> the closed structure used to express that meaning deterministically
       before VE-CBOR-1 encoding
```

For example, `integer` is a representation form. It does not establish a
VE-owned ontology of quantities, currencies, accounts, identities, or time. The
applicable Predicate Schema semantics determine whether an integer is an
approval count, an amount in a unit, a sensor reading, or a time coordinate.

## 3. Minimal closed grammar

The grammar describes schema material, not runtime Claim values. Its complete
form set is:

```text
FieldForm :=
    BooleanForm
  | IntegerForm
  | TextForm
  | BytesForm
  | RecordForm
  | SequenceForm

RecordFieldPresence := required | optional
TimeFieldRequirement := forbidden | optional | required
```

Each `FieldForm` is a schema descriptor for a mechanical CBOR value category;
it is not a tagged wrapper that every `Claim.body.value` carries. The applicable
Predicate Schema selects and interprets the form, and a Claim value remains the
value permitted by that schema.

| Form or constraint | Role |
|---|---|
| `boolean` | CBOR `true` or `false`; its proposition-specific meaning remains schema-defined. |
| `integer` | Exact counts, coefficients, bounds, or time coordinates. |
| `text` | UTF-8/NFC text where the applicable field semantics permit text. |
| `bytes` | Opaque binary content without assigning identity meaning. |
| `record` | Closed structured content with named fields. |
| `sequence` | Repeated content with explicit ordering and uniqueness constraints. |
| `allowed_values` | Constraint on a scalar form for a closed vocabulary. |
| integer bounds and scale | Constraints on `integer`; unit and quantity meaning remain in `value_semantics`. |
| record presence | The sole `required`/`optional` expression for a record field. |
| time requirement | The field-local `forbidden`/`optional`/`required` expression for the two Claim time fields. |

The following are rejected:

```text
VEValue
UniversalValue
SemanticValue
TypedValue
any
object
dynamic
arbitrary JSON
arbitrary CBOR
extensions: {}
```

They would create a universal runtime wrapper, admit an unbounded grammar, or
allow a representation to acquire meaning outside governed field semantics.

## 4. Scalar forms and constraints

| Field form | Permitted runtime category |
|---|---|
| `BooleanForm` | CBOR Boolean |
| `IntegerForm` | CBOR integer |
| `TextForm` | CBOR text string |
| `BytesForm` | CBOR byte string |

A value whose CBOR category does not match the selected `FieldForm` is invalid.
All text values used by the grammar or an applicable form MUST be valid UTF-8
and Unicode NFC. Non-NFC text MUST be rejected, not silently transformed.
Floating-point values are forbidden. Indefinite-length items, duplicate map
keys, and unstandardized CBOR semantic tags are forbidden by ADR-ENC-001.

A closed scalar vocabulary is represented by a scalar form plus an
`allowed_values` constraint:

```text
allowed_values: set of canonical scalar values
```

The member set is in deterministic canonical-member order, and duplicate
canonical members are invalid. Display labels are non-semantic metadata and
MUST NOT affect validation, equality, canonicalization, or Predicate Schema
identity. This constraint replaces a separate enumeration form.

## 5. Records and field identity

An inline `RecordForm` has this conceptual shape:

```text
RecordForm {
  fields: ordered set of RecordField
  unknown_fields: forbidden
}

RecordField {
  name: text
  presence: required | optional
  form: FieldForm
}
```

Record field identity is the exact UTF-8/NFC text name. Current authority
requires text map keys for VE-CBOR-1 and establishes no global integer-label
registry; this grammar does not invent one. The field descriptor set is sorted
by the bytewise lexicographic order of each field name's deterministic
VE-CBOR-1 encoding, and names MUST be unique.

A runtime record MUST contain every `required` field, MAY omit an `optional`
field, MUST reject duplicate map keys, and MUST reject unknown fields. This is
the only representation of record-field presence; no second presence or
multiplicity mode is permitted.

```text
field absent
    != field present with an explicit predicate-permitted null-like value
```

## 6. Sequences, ordering, and multiplicity

One `SequenceForm` expresses both ordered and order-insensitive collections:

```text
SequenceForm {
  element_grammar: FieldForm
  ordering_significant: boolean
  uniqueness: boolean
  min_items?: non-negative integer
  max_items?: non-negative integer
}
```

When `ordering_significant` is `true`, source/normalized element order is
semantic. When it is `false`, source order has no semantic meaning and the
runtime array MUST use deterministic canonical-member ordering: bytewise
lexicographic order of each normalized member's canonical VE-CBOR-1
representation. When `uniqueness` is `true`, duplicate canonical members MUST
fail closed. When it is `false`, multiplicity is preserved.

The sequence constraints are the sole source of collection ordering and
multiplicity behavior. Field semantics may set bounds but MUST NOT introduce a
second conflicting collection mode.

## 7. Numeric grammar

`IntegerForm` uses exact CBOR integers only. No float, decimal floating point,
source-language number, or implicit conversion is permitted.

```text
IntegerForm {
  lower_bound?: Bound
  upper_bound?: Bound
}

Bound {
  value: integer
  inclusive: boolean
}
```

When an exact scale is required, the Claim value remains an integer coefficient
and the applicable `value_semantics` defines the scale and relation:

```text
semantic quantity = coefficient × 10^(-decimal_scale)
```

Scale is schema semantic metadata, not a second runtime value field. Unit,
comparability, conversion, and quantity meaning remain within inline
`value_semantics` or the existing `value_semantics_ref`; this grammar creates no
unit registry or standalone unit semantic object. Both bounds, when present,
apply to the raw integer coefficient. Absence of a lower or upper bound means
unbounded in that direction. No sentinel bound, implicit zero, or omitted
inclusivity rule is permitted.

## 8. Null-like values

There is no universal VE null semantic. `null_like` is predicate-defined
semantic content describing whether an explicitly represented value is allowed
and what it means. Absence of a record field, absence of an optional top-level
Predicate Schema field, and a present null-like asserted value are distinct
conditions.

CBOR `null` MUST NOT substitute for absence. It MAY be a permitted canonical
value only when the applicable Predicate Schema `value_semantics` explicitly
defines its predicate-specific meaning. The grammar supplies no general null
form or default null behavior.

## 9. Issuer-domain representation

An issuer identifier uses only the closed grammar's Boolean, integer, text,
bytes, record, or sequence forms where the applicable issuer-domain semantics
permit them. The grammar defines no universal identity category such as person,
company, account, DID, URI, certificate subject, or email.

Issuer-domain semantics define the permitted identifier domain, the applicable
semantic validation and normalization, and issuer equality. The mechanical
comparison is:

```text
semantic validation
        ↓
applicable semantic normalization
        ↓
canonical representation
        ↓
deterministic canonical-representation equality
```

The grammar does not invent semantic equality or replace the Predicate Schema
semantics that determine normalization and equality rules. Once those rules
produce normalized content, the mechanical equality comparison is deterministic
canonical-representation equality.

The grammar may enforce valid UTF-8 and NFC where text is used. It MUST NOT
define trimming, case-folding pipelines, delimiter rewriting, locale
transformation, arbitrary normalization sequences, executable code, CEL, or
regex programs. Such domain-specific normalization remains in the applicable
issuer-domain semantics, inline or through the existing `issuer_domain_ref`.

Issuer-domain representation MUST NOT encode trust, authorization,
verification keys, signer binding, delegation, revocation, publisher authority,
resolver infrastructure, or VE-managed identity.

## 10. Existing field-specific source composition

The Predicate Schema Semantic Contract already owns the only source-composition
forms relevant here:

```text
issuer_domain_ref
value_semantics_ref
time_semantics_ref
```

Each is legal only in its named semantic field. It MUST resolve offline to
retained, supported immutable semantic content. Resolution failure, unsupported
content, invalid content, or a cyclic dependency makes semantic interpretation
and canonicalization unavailable. No partial interpretation, fallback, alias,
network lookup, mutable registry, or guessing is permitted.

These mechanisms are outside this grammar. This grammar creates no generic
semantic-reference construct, including `semantic_ref`, `field_semantics_ref`,
`extension_ref`, `contract_ref`, or `custom_semantics_ref`.

During Predicate Schema canonicalization, the Canonical Representation Profile
resolves and recursively expands referenced exact canonical fragments. The
source-level reference syntax does not survive in normalized canonical Predicate
Schema content.

## 11. Subject constraints

Subject constraints do not use this field-semantic grammar. The Canonical
Representation Profile owns their closed representation as an allowed subset of:

```text
ActionContentReference
ActionOccurrenceReference
EventReference
```

This grammar neither adds a subject form nor encodes Action/Event identifiers,
attempt grouping, or subject-reference payloads. Claim Reference Semantics
retains ownership of the legal subject-reference union and equality.

## 12. Time requirements and mechanical form

Time requirement is field-local:

```text
TimeFieldRequirement := forbidden | optional | required

TimeSemanticsForm {
  assertion_time: TimeFieldRequirement
  observation_time: TimeFieldRequirement
  time_value: IntegerForm
}
```

`forbidden` is intentionally limited to `assertion_time` and
`observation_time`; record fields use only `required` or `optional`. When time
is represented as a fractional quantity, `time_value` uses `IntegerForm` with
the exact scale defined by the applicable time semantics.

Epoch, precision, UTC basis, leap-second handling, unit, range, and the
proposition-specific interpretation of each Claim time field belong inside
inline `time_semantics` or the existing `time_semantics_ref`. This grammar
creates no VE Time primitive or standalone time-domain semantic object.

If a Predicate Schema omits `time_semantics`, both Claim time fields are
forbidden under the Semantic Contract. A Claim supplying either field is
semantically invalid; the field is not ignored.

## 13. Grammar nesting and canonical input

Grammar nesting is permitted only as a finite, acyclic inline grammar tree.
Named recursive types, self-reference, and cyclic grammar graphs are invalid
and MUST fail closed. Existing field-specific semantic references remain
separately governed and must satisfy the Canonical Representation Profile's
finite and acyclic expansion requirement where recursive content identities
depend on one another.

The grammar produces normalized structures compatible with this established
canonicalization pipeline:

```text
resolve references
    -> recursively expand exact canonical fragments
    -> normalize fully inline semantic content
    -> VE-CBOR-1 canonical bytes
```

No generic semantic-reference object may remain in normalized canonical content.
Canonicalization collapses only exact governed normalization. It MUST NOT infer
logical, mathematical, decompositional, or differently expressed-schema
equivalence.

## 14. Versioning, unknown constructs, and offline audit

The document identifier and version identify this grammar for governance and
implementation. A Predicate Schema does not gain a runtime `grammar_profile`
field. A future governed revision of the applicable representation profile may
adopt this grammar without creating a new Claim field.

Unknown forms, constraints, record fields, time requirements, or semantic
features are invalid and MUST fail closed. They MUST NOT be ignored, silently
coerced, defaulted, executed, or accepted as extension data.

An implementation must be able to validate, normalize, and prepare a Predicate
Schema for canonical encoding offline using only retained Predicate Schema
material, retained immutable field-semantic material, this pinned grammar, the
applicable Predicate Schema representation profile, and separately governed
digest/framing material when identity verification is required. Publisher
availability, DNS, a registry, a namespace authority, a trusted resolver, and
runtime network access are not required. Missing material makes interpretation
unavailable rather than permitting recovery by guessing.

## 15. Cross-language implementation requirements

Two independent teams must be able to implement the same parser, validator,
normalizer, and canonicalization input model from this Draft. They must agree
on:

- the finite FieldForm set and CBOR value categories;
- scalar allowed-value validation;
- record field identity, ordering, presence, and closed unknown-field handling;
- sequence ordering, uniqueness, bounds, and multiplicity behavior;
- integer bounds and exact scale relation;
- time-requirement states and existing time-semantics interpretation;
- existing field-specific reference resolution, failure behavior, and
  acyclicity; and
- rejection of unknown constructs and non-conforming input.

Exact field-level VE-CBOR-1 map shapes and labels remain a revision concern of
the existing Predicate Schema Canonical Representation Profile. They are not
defined by this grammar.

## 16. Pressure-test examples

These examples test deterministic representation only. They do not create
universal Claim, issuer, value, identity, currency, collection, or time
semantics.

| Example | Grammar result |
|---|---|
| A. `issuer_ref` is a normalized account identifier text | `TextForm`; UTF-8/NFC is enforced mechanically, while account-specific validation, normalization, and equality remain in the applicable issuer-domain semantics. |
| B. `value` is a Boolean approval | `BooleanForm`; the Predicate Schema supplies the proposition-specific meaning of `true` and `false`. |
| C. `value` is an exact decimal currency-like quantity | `IntegerForm` with an exact scale and optional raw-coefficient bounds. Unit and quantity semantics remain in `value_semantics`; no float or free-form unit name is used. |
| D. `value` is a structured record with two required fields | `RecordForm` with two uniquely named `required` descriptors. Unknown or duplicate runtime fields fail closed. |
| E. `value` is an order-insensitive collection of canonical identifiers | `SequenceForm` with `ordering_significant: false` and `uniqueness: true`; members use canonical ordering and duplicate canonical members fail closed. |
| F. `observation_time` is an integer timestamp under schema-defined epoch/scale | `observation_time: required` and `IntegerForm` with an exact scale where required. Epoch, precision, and related meaning remain in `time_semantics`. |

All examples are representable deterministically. Where an example uses
domain-specific normalization, unit, or time meaning, independent
implementations resolve the same retained field-specific semantic content before
canonicalization.

## 17. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Deterministic expression makes Claim meaning inspectable without moving authority into representation. |
| Primitive burden | Pass. The grammar is representation machinery, not a primitive. |
| Removability | A shared closed grammar cannot be removed without divergent field encodings. A generic reference mechanism, separate enumeration/scale/collection forms, and universal runtime wrappers can be removed without loss. |
| Twenty-year durability | Pass, conditional on retaining the grammar/profile and immutable field-semantic material. |
| Independent implementability | Pass. Domain-specific material resolves through existing field-specific composition rather than hidden code. |
| Total conceptual complexity | Pass. One finite grammar plus existing field-specific composition is smaller than separate grammars, a transformation language, or a universal VE type system. |

## 18. Governance and normative home

| Governance question | Result |
|---|---|
| New primitive? | No. |
| New Claim field? | No. |
| New runtime abstraction? | No. Forms describe schema material; they do not wrap Claim values at runtime. |
| New semantic abstraction? | No. Predicate Schema semantics remain the authority for meaning. |
| New representation artifact? | Yes. This is narrowly scoped Draft representation machinery, not an architectural abstraction. |
| RFC required? | No. This Draft applies existing semantic and encoding decisions without changing Approved semantics. |
| Approved-specification revision required? | No. Normal governance applies before this Draft becomes authoritative. |
| Correct normative home? | A standalone Draft representation grammar reused by Predicate Schema field semantics. |

## 19. Unresolved dependencies and next action

This Draft resolves the field-semantic grammar blocker at the conceptual
structure level. Remaining work is to bind the reduced grammar to exact
VE-CBOR-1 map shapes and labels and to publish cross-language canonicalization
vectors. Portable predicate identity also remains dependent on separately
governed digest-suite and framing decisions.

The correct next action is to revise the existing Draft
**PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE.md** to bind this grammar to
exact VE-CBOR-1 map shapes and labels while preserving recursive normalization
and the separate digest-suite decision. A separately versioned successor is not
warranted because that profile remains Draft. This action must not alter Claim
or Predicate Schema semantics.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-28 | Initial Draft defining a reduced finite field-semantic representation grammar. |
