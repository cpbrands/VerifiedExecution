---
id: PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
title: Predicate Schema Field-Semantic Representation Grammar
version: "1.0"
status: Approved
document_type: Specification
category: Representation
author: Verified Execution Editorial Board
created: 2026-08-28
updated: 2026-08-28
depends_on:
  - ADR-ENC-001
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
related_documents:
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CLAIM-REFERENCE-SEMANTICS
  - RFC-005
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# Predicate Schema Field-Semantic Representation Grammar

## Status and authority boundary

This Approved v1.0 representation artifact defines a small, closed mechanical
grammar for expressing field semantics that Predicate Schema semantics already
require. It applies `ADR-ENC-001` v0.1 canonical-encoding mechanics and the
Approved `PREDICATE-SCHEMA-SEMANTIC-CONTRACT` v1.0 source-composition boundary;
it does not redefine Claim semantics, verification, Trust Context, Rule/Evaluate,
Action, Event, or trust.

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

## v1.0 machine-behavior freeze and dependency closure

Machine-affecting behavior of this Approved v1.0 grammar is immutable. An
editorial correction preserves v1.0 meaning only when no conforming
implementation can change an admission outcome, reference-resolution result,
normalized semantic content, canonical structure, canonical ordering, or
canonical VE-CBOR-1 bytes. Any machine-affecting change requires the normal
Approved-specification change process and a new semantic version.

This grammar's machine-affecting dependencies are
`PREDICATE-SCHEMA-SEMANTIC-CONTRACT` v1.0 for field-specific source composition
and `ADR-ENC-001` v0.1 for VE-CBOR-1 mechanics. The Approved
`PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE` v1.0 applies this grammar;
it is a consumer, not a mutable dependency of the grammar. No mutable branch,
repository URL, or Git revision is normative.

## 1. Architectural decision

### Verdict

**A. CLOSED GRAMMAR SUFFICIENT; EXISTING FIELD REFERENCES HANDLE REUSE.**

One shared closed mechanical grammar is necessary for independent
implementations to parse, validate, normalize, and prepare issuer, value, and
time semantic material for canonical encoding. Separate issuer, value, and time
grammars would duplicate scalar, record, collection, range, and failure
behavior. Allowing each Predicate Schema to invent its own representation would
prevent portable canonicalization.

This conclusion applies to the finite semantic representation subset supported
by the portable Predicate Schema canonical profile, not to every semantically
possible Predicate Schema. Predicate Schema semantic validity is distinct from
portable-profile validity. A semantically meaningful Predicate Schema whose
issuer normalization, unit, time, or other semantics lie outside this closed
subset MAY remain valid at the abstract semantic layer, but it is not
portable-profile-valid.

For this v1.0 grammar, the portable-profile admission rule is closed-world:

```text
portable-profile-valid
    iff
every semantically relevant rule is represented by this grammar
and permitted by the Approved Predicate Schema Canonical Representation Profile v1.0
```

Every semantic rule that affects interpretation, validation, normalization,
equality, units, time, or canonical value meaning MUST be represented by this
v1.0 closed grammar and the v1.0 Profile-defined normalization rules. Any
additional semantic rule makes the Predicate Schema non-profile-valid. It MUST
NOT be ignored, discarded, approximated, preserved as opaque metadata, or
partially serialized during canonicalization.

`issuer_domain_ref`, `value_semantics_ref`, and `time_semantics_ref` are
existing field-specific source-composition mechanisms defined by the Approved
Predicate Schema Semantic Contract v1.0. They are outside this representation
grammar and introduce no generic semantic-reference mechanism. They are valid
only in their named field contexts, resolve to retained immutable semantic
content, and fail closed when unavailable.

They are whole-field source-composition mechanisms only. They do not extend the
portable semantic vocabulary: after resolution, the resulting semantic content
MUST still be within the portable subset. A reference resolving to content
outside that subset makes the Predicate Schema non-profile-valid.

This grammar defines no `semantic_ref`, `field_semantics_ref`, `extension_ref`,
`contract_ref`, `custom_semantics_ref`, `semantic_descriptor`, generic extension
map, registry, or new VE object.

## 2. Representation versus semantics

```text
Predicate Schema semantics
    -> what an issuer, value, subject constraint, or Claim time means

Field-semantic representation grammar
    -> the closed structure used to express that meaning deterministically
       before VE-CBOR-1 encoding
```

The grammar therefore defines portable-profile validity, not the full range of
abstract Predicate Schema semantic validity. The latter may be broader than the
finite vocabulary this Draft can represent portably.

There is no portable semantic metadata channel outside this grammar. An
annotation, metadata map, opaque descriptor, comment, semantic label, or
external interpretation hint MUST NOT affect the meaning of a profile-valid
Predicate Schema. If it does affect meaning, the schema is outside the portable
subset.

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

When absent, `allowed_values` imposes no allowed-values restriction. When
present, it MUST contain at least one member. An empty member set would define
an empty scalar domain and is invalid under the v1.0 bounded portable
profile; it MUST NOT normalize to omission. The member set is in deterministic
canonical-member order, and duplicate canonical members are invalid. Display
labels are non-semantic metadata and MUST NOT affect validation, equality,
canonicalization, or Predicate Schema identity. This constraint replaces a
separate enumeration form.

Allowed values MUST undergo only normalization explicitly defined by the v1.0
portable profile. They MUST validate under their FieldForm, normalize under
those rules, canonicalize, sort deterministically, and reject duplicates after
that normalization. Each member MUST also satisfy the applicable base scalar
domain, including Integer bounds and scale where applicable. A member outside
that base domain makes the Predicate Schema non-profile-valid. No
source-specific or externally interpreted normalization is permitted.

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

Record field identity is the exact UTF-8/NFC text name. `ADR-ENC-001` v0.1
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

Omission of `min_items` means a minimum cardinality of zero. An explicit
`min_items: 0` is semantically equivalent to omission and MUST normalize to the
omitted form before canonical encoding. Omission of `max_items` means an
unbounded maximum; no finite sentinel denotes that state, and every present
`max_items` value remains explicit. Both cardinalities, when present, MUST be
non-negative mathematical integers. If both are present, `min_items <=
max_items` is required; otherwise the Predicate Schema is non-profile-valid.

Cardinality is normalized before VE-CBOR-1 encoding. Therefore, an otherwise
identical source SequenceForm with no cardinality members and one with only
`min_items: 0` produce identical normalized cardinality content. Ordering and
uniqueness remain independent of cardinality.

When `ordering_significant` is `true`, source/normalized element order is
semantic. When it is `false`, source order has no semantic meaning and the
runtime array MUST use deterministic canonical-member ordering: bytewise
lexicographic order of each normalized member's canonical VE-CBOR-1
representation. When `uniqueness` is `true`, duplicate canonical members MUST
fail closed. When it is `false`, multiplicity is preserved.

`ordering_significant: false` together with `uniqueness: false` denotes
**multiset** semantics. Canonicalization MUST normalize every member, derive
its canonical bytes, sort members by the governed canonical byte-order rule,
and preserve every repeated equal member. If `uniqueness` is `true`, repeated
normalized canonical members MUST fail closed.

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

A profile-valid IntegerForm MUST describe a non-empty possible integer domain
before `allowed_values` is applied. For a present lower bound, define
`effective_min` as its `value` when `inclusive` is true and as `value + 1` when
`inclusive` is false. For a present upper bound, define `effective_max` as its
`value` when `inclusive` is true and as `value - 1` when `inclusive` is false.
When both effective bounds exist, `effective_min <= effective_max` is required.
Otherwise the IntegerForm is non-profile-valid.

This rule makes `[1, 1]` valid, makes every equal-endpoint interval with an
exclusive endpoint invalid, and rejects structurally ordered but integer-empty
intervals such as `(1, 2)`. It permits `(1, 2]` and `[1, 2)`, each of which
contains one integer. `min > max` is invalid. Effective-bound calculations use
mathematical integers; an implementation that cannot represent `value + 1` or
`value - 1` safely MUST reject the input rather than wrap, truncate, or use
floating-point arithmetic.

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

For portable-profile normalization, absent scale and `scale: 0`
represent the same semantic case. The canonical normalized form MUST omit scale
when its value is zero; a non-zero scale MUST remain explicit. This mechanical
rule does not supply unit meaning.

For v1.0 portable value semantics, validation MUST use only constraints
expressible by FieldForm, normalization MUST use only v1.0 profile-defined
normalization, and equality MUST be canonical-representation equality after
that validation and normalization. Approximate equality, tolerance-based
equality, case-insensitive semantic equality, domain-specific equivalence,
normalization not defined by this profile, and custom comparison functions make
the Predicate Schema non-profile-valid.

No finite governed unit vocabulary is defined by the v1.0 portable profile.
Accordingly, every unit-bearing semantic form is outside the v1.0 portable
subset. A future governed profile may add a finite portable unit vocabulary, but
this Draft does not anticipate or admit one.

In the v1.0 portable subset, absence of unit semantics means
**dimensionless**. It MUST NOT mean that a unit exists but is unspecified,
externally implied, supplied by an alias or name, or deferred to documentation.
Any such semantic claim makes the Predicate Schema non-profile-valid.

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

The broader semantic model may permit a predicate-defined null-like value, but
the v1.0 portable FieldForm subset does not represent one. A Predicate Schema
that gives a null-like asserted value semantic meaning is therefore
non-profile-valid under the v1.0 portable profile.

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
profile-governed normalization
        ↓
canonical representation
        ↓
deterministic canonical-representation equality
```

For the v1.0 portable subset, the identifier MUST be represented through the
closed grammar; validation MUST use only constraints explicitly expressible by
that FieldForm; normalization MUST be profile-governed; and equality is
canonical-representation equality after validation and that normalization. The
grammar supplies no separately programmable equality language.

UTF-8/NFC handling is portable because ADR-ENC-001 already governs it: text MUST
be valid UTF-8 in NFC and non-NFC input is rejected. This Draft MUST NOT define
trimming, case-folding, delimiter rewriting, locale transformation, arbitrary
normalization sequences, executable code, CEL, or regex programs. In
particular, arbitrary case folding is not portable-profile-valid unless a future
profile explicitly pins its exact algorithm, Unicode/version dependency, and
normalization semantics. An issuer-domain semantic form requiring unsupported
normalization is outside the v1.0 portable subset.

The following issuer-domain semantics are not portable-profile-valid unless a
future governed profile explicitly represents them: checksum validation, email
syntax, URI syntax, account-number syntax, DID-specific rules,
locale-dependent rules, case-insensitive comparison, delimiter normalization,
custom identity matching, and external identity-resolution rules. A Text issuer
identifier with any such extra semantic validation is not equivalent to plain
profile-valid Text merely because both serialize as Text.

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

Resolution does not make arbitrary semantic content portable. After expansion,
every semantically relevant rule in the content MUST pass the same exhaustive
portable-subset admission check as inline content. Otherwise the Predicate
Schema is non-profile-valid and MUST NOT proceed to canonical encoding under the
v1.0 portable profile. Reference identity is never proof that referenced
semantic content is portable-profile-valid.

These mechanisms are outside this grammar. This grammar creates no generic
semantic-reference construct, including `semantic_ref`, `field_semantics_ref`,
`extension_ref`, `contract_ref`, `custom_semantics_ref`, or
`semantic_descriptor`.

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

Present time semantics remain semantically possible under the broader Predicate
Schema Semantic Contract, but they are outside the v1.0 portable subset:
their time-domain meaning is not yet expressed by a finite governed portable
vocabulary. The v1.0 portable profile therefore admits only absent
`time_semantics`, under which both `assertion_time` and `observation_time` are
forbidden. It creates no TimeDomain or time-domain reference.

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
    -> bounded portable-subset validation
    -> VE-CBOR-1 canonical bytes
```

No generic semantic-reference object may remain in normalized canonical content.
Canonicalization collapses only exact governed normalization. It MUST NOT infer
logical, mathematical, decompositional, or differently expressed-schema
equivalence.

For the bounded portable subset, a profile-valid FieldForm MUST describe at
least one possible canonical value. Validation performs the finite local
consistency checks defined by this grammar and the applicable profile; it does
not attempt arbitrary nested-schema satisfiability analysis. At minimum, it
rejects contradictory or integer-empty bounds, an empty `allowed_values` set,
an allowed-value member outside its base scalar domain, and sequence cardinality
with `min_items > max_items`.

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
normalizer, and canonicalization input model from this Approved v1.0 grammar.
They must agree
on:

- the finite FieldForm set and CBOR value categories;
- scalar allowed-value validation;
- record field identity, ordering, presence, and closed unknown-field handling;
- sequence ordering, uniqueness, bounds, and multiplicity behavior;
- integer bounds and exact scale relation;
- the v1.0 portable exclusion of present time semantics;
- existing field-specific reference resolution, failure behavior, and
  acyclicity; and
- rejection of unknown constructs and non-conforming input.

This agreement applies only to the supported portable subset. It does not make
arbitrary issuer normalization, unit systems, time domains, or externally
interpreted semantic labels portable merely because they can be stored in source
semantic material.

Exact field-level VE-CBOR-1 map shapes and labels belong to the Approved
Predicate Schema Canonical Representation Profile v1.0. They are not defined
by this grammar.

## 16. Pressure-test examples

These examples test deterministic representation only. They do not create
universal Claim, issuer, value, identity, currency, collection, or time
semantics.

| Example | Grammar result |
|---|---|
| A. `issuer_ref` is plain NFC text with no additional issuer-domain rule | `TextForm`; UTF-8/NFC validity is enforced mechanically and equality is canonical-representation equality. |
| B. `value` is a Boolean approval | `BooleanForm`; the Predicate Schema supplies the proposition-specific meaning of `true` and `false`. |
| C. `value` is an exact dimensionless scaled quantity | `IntegerForm` with an exact scale and optional raw-coefficient bounds. No unit semantics are present. |
| D. `value` is a structured record with two required fields | `RecordForm` with two uniquely named `required` descriptors. Unknown or duplicate runtime fields fail closed. |
| E. `value` is an order-insensitive collection of canonical identifiers | `SequenceForm` with `ordering_significant: false` and `uniqueness: true`; members use canonical ordering and duplicate canonical members fail closed. |
| F. `observation_time` is an integer timestamp under schema-defined epoch/scale | Semantically possible, but outside the v1.0 portable subset until a finite governed time vocabulary is specified. |

The local cardinality and integer-domain checks have these outcomes:

| Case | Grammar result |
|---|---|
| Sequence `min` absent, `max` absent | Valid; `0..unbounded`. |
| Sequence `min: 0`, `max` absent | Valid; normalizes to both members absent. |
| Sequence `min: 2`, `max` absent | Valid; `2..unbounded`. |
| Sequence `min` absent, `max: 5` | Valid; `0..5`. |
| Sequence `min: 2`, `max: 5` | Valid. |
| Sequence `min: 5`, `max: 5` | Valid; exact cardinality five. |
| Sequence `min: 6`, `max: 5`, or either negative | Invalid. |
| Integer `[1,1]`, `[1,2]`, `(1,2]`, or `[1,2)` | Valid. |
| Integer `(1,1]`, `[1,1)`, `(1,1)`, `(1,2)`, or `min > max` | Invalid. |
| `allowed_values` omitted | Valid; no allowed-values restriction. |
| `allowed_values: [1]` within a valid Integer domain | Valid. |
| `allowed_values: []`, duplicate normalized members, or member outside Integer bounds | Invalid. |

Examples A--E are portable only where their normalization and unit semantics
are completely expressed by the governed finite profile vocabulary. Reference
resolution alone cannot make an unsupported domain-specific normalization, unit,
or time meaning portable.

## 17. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Deterministic expression makes Claim meaning inspectable without moving authority into representation. |
| Primitive burden | Pass. The grammar is representation machinery, not a primitive. |
| Removability | A shared closed grammar cannot be removed without divergent field encodings. A generic reference mechanism, separate enumeration/scale/collection forms, and universal runtime wrappers can be removed without loss. |
| Twenty-year durability | Pass, conditional on retaining the grammar/profile and immutable field-semantic material. |
| Independent implementability | Pass for the currently supported portable subset. Content outside it remains semantically possible but is not portable-profile-valid. |
| Total conceptual complexity | Pass. One finite grammar plus existing field-specific composition is smaller than separate grammars, a transformation language, or a universal VE type system. |

## 18. Governance and normative home

| Governance question | Result |
|---|---|
| New primitive? | No. |
| New Claim field? | No. |
| New runtime abstraction? | No. Forms describe schema material; they do not wrap Claim values at runtime. |
| New semantic abstraction? | No. Predicate Schema semantics remain the authority for meaning. |
| New representation artifact? | Yes. This is narrowly scoped Approved representation machinery, not an architectural abstraction. |
| RFC required? | No. This initial approval freezes existing Draft behavior without changing an Approved specification. |
| Approved-specification revision required? | No. No previously Approved specification is revised. |
| Correct normative home? | This Approved standalone representation grammar v1.0, reused by Predicate Schema field semantics. |

## 19. Unresolved dependencies and next action

This Approved v1.0 grammar defines the closed grammar for the supported portable
subset; it does not establish portability for every abstract Predicate Schema
semantic form. The paired Canonical Representation Profile MUST enforce this
bounded applicability boundary before encoding. Cross-language vectors remain
required for every admitted form and every fail-closed exclusion.

Within the bounded subset, portable predicate identity remains dependent on
separately governed digest-suite and framing decisions. No further action may
alter Claim or Predicate Schema semantics merely to widen representation scope.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-08-28 | Approved machine-behavior freeze for the closed field-semantic grammar; pins Semantic Contract v1.0 and ADR-ENC-001 v0.1, with normative canonicalization vectors. |
| 0.1 | 2026-08-28 | Draft defining a reduced finite field-semantic grammar, bounded portable scope, and exhaustive closed-world admission rule. |
