---
id: PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
title: Predicate Schema Canonical Representation Profile
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
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
related_documents:
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CLAIM-REFERENCE-SEMANTICS
  - RFC-005
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# Predicate Schema Canonical Representation Profile

## Status and authority boundary

This Approved v1.0 representation profile applies the accepted VE-CBOR-1
mechanics in `ADR-ENC-001` v0.1 to normalized Predicate Schema semantic
content. It normatively uses the Approved
`PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR` v1.0 for closed
field-form structures and the Approved `PREDICATE-SCHEMA-SEMANTIC-CONTRACT`
v1.0 for field-specific source composition, reference resolution, and semantic
normalization. It does not amend Claim semantics, verification, Trust Context,
Rule/Evaluate, or Action/Event ownership.

This is the VE-CBOR-1 Predicate Schema Profile v1.0. It creates neither a
second canonicalization system nor a VE primitive, Claim-body field, universal
identity ontology, universal time system, generic semantic-reference layer, or
runtime wrapper.

The accepted Claim envelope remains unchanged:

~~~text
Claim {
  body,
  verification {
    profile,
    artifact
  }
}
~~~

This profile does not define Claim verification, trust, signer/key binding,
delegation, revocation, Rule applicability, Rule evaluation, Action identity,
Event identity, a CBOR-to-CEL mapping, or a digest suite.

## v1.0 machine-behavior freeze and dependency closure

Machine-affecting behavior of this Approved v1.0 profile is immutable. An
editorial correction preserves v1.0 meaning only when no conforming
implementation can change an admission outcome, reference-resolution result,
normalized semantic content, canonical structure, canonical ordering, or
canonical VE-CBOR-1 bytes. Any machine-affecting change requires the normal
Approved-specification change process and a new semantic version.

The v1.0 machine-affecting closure is exactly:

```text
Predicate Schema Canonical Representation Profile v1.0
    -> Predicate Schema Field-Semantic Representation Grammar v1.0
    -> Predicate Schema Semantic Contract v1.0

Predicate Schema Canonical Representation Profile v1.0
    -> ADR-ENC-001 v0.1 (VE-CBOR-1)

Predicate Schema Field-Semantic Representation Grammar v1.0
    -> ADR-ENC-001 v0.1 (VE-CBOR-1)
```

The direction above records machine-affecting ownership. The Semantic Contract
does not itself encode CBOR; the Profile and Grammar apply `ADR-ENC-001` v0.1
at their encoding boundaries. `CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS`,
`VE-CLAIM-REFERENCE-SEMANTICS`, and related Claim documents remain semantic
boundary material. They do not add a field form, normalization step, canonical
map member, ordering rule, or VE-CBOR-1 byte rule to this v1.0 profile.

No mutable branch name, repository URL, or Git revision is a normative part of
this closure. `PREDICATE-SCHEMA-CANONICALIZATION-V1` supplies its normative
conformance vectors; it does not alter this profile's rules.

## 1. Architectural decision

### Verdict

**B. CANONICAL BYTES FULLY DEFINED FOR THE BOUNDED PORTABLE SUBSET; PORTABLE
PREDICATE IDENTITY STILL BLOCKED ON DIGEST/FRAMING.**

For every profile-valid normalized Predicate Schema, two independent
implementations can derive identical canonical bytes without an
implementation-specific representation choice. The merged Field-Semantic
Representation Grammar v1.0 supplies the closed scalar, composite, constraint,
and nesting grammar for that bounded subset.

The broader Predicate Schema Semantic Contract permits semantically meaningful
content that this profile does not yet represent portably. This profile MUST NOT
claim deterministic interoperability for arbitrary issuer normalization
algorithms, unit systems, time domains, or externally interpreted semantic
labels. Predicate Schema semantic validity is distinct from portable-profile
validity. This profile defines canonical Predicate Schema bytes only when the
normalized semantic content lies entirely within the supported portable subset.

This v1.0 portable profile is closed-world. A Predicate Schema is
portable-profile-valid only if every semantic rule affecting interpretation,
validation, normalization, equality, units, time, or canonical value meaning is
represented by the v1.0 closed field-semantic grammar and permitted by this
profile's rules. A semantic distinction that affects interpretation or equality
but is not represented by the profile's normative canonical structure is
unsupported and MUST cause profile validation failure. It MUST NOT be ignored,
discarded, approximated, treated as metadata, or partially serialized.

A profile-valid FieldForm MUST describe at least one possible canonical value.
The profile performs only the finite local consistency checks defined by its
closed grammar; it does not attempt arbitrary nested Record or Sequence schema
satisfiability analysis. At minimum, contradictory or integer-empty bounds,
empty `allowed_values`, allowed-value members outside their base scalar domain,
and sequence cardinality with `min_items > max_items` are invalid.

Portable predicate identity remains blocked only by separately governed digest
suite and identity-framing decisions. This profile does not select a digest
algorithm, digest domain, object-type framing, or predicate-identity envelope.

## 2. Relationship to VE-CBOR-1

ADR-ENC-001 selects VE-CBOR-1 for byte-sensitive VE Kernel Protocol v0.1
objects. A Predicate Schema whose semantic-content identity is used portably is
byte-sensitive. This profile therefore reuses VE-CBOR-1 rather than defining
another encoding family.

Every profile-valid normalized Predicate Schema MUST use:

- RFC 8949 Core Deterministic Encoding;
- definite-length items only;
- shortest valid CBOR integer and length encodings;
- text-string map keys only;
- map keys ordered by bytewise lexicographic order of their deterministic CBOR
  encodings;
- valid UTF-8 text in Unicode NFC, with non-NFC input rejected rather than
  normalized;
- duplicate map keys rejected;
- no floating-point values; and
- no CBOR semantic tags unless a future VE-CBOR profile explicitly
  standardizes them.

Text labels remain preferable to integer labels: `ADR-ENC-001` v0.1 requires
text-string map keys, and no Approved v1.0 Predicate-Schema integer-label
registry exists. These are representation mechanics,
not a universal value, time, issuer, namespace, or subject-reference ontology.

## 3. Canonicalization pipeline

The exact canonicalization pipeline is:

~~~text
Predicate Schema source
        ↓
resolve field-specific references
        ↓
recursively expand exact canonical fragments
        ↓
normalize fully inline semantic content
        ↓
exhaustive portable-subset admission check
        ↓
field-semantic grammar validation
        ↓
VE-CBOR-1 canonical representation
        ↓
canonical bytes
        ↓
separately governed digest/framing
        ↓
predicate identity
~~~

An implementation MUST resolve every required field-specific reference before
encoding. An unavailable, unsupported, invalid, cyclic, or otherwise
unresolvable required reference makes semantic interpretation and
canonicalization unavailable. It MUST NOT be replaced with a fallback,
partially normalized, guessed, alias-based, or network-dependent value.

Canonicalization collapses only exact governed normalization. An inline
semantic fragment F and a field-specific reference resolving to canonical
fragment F MUST produce identical fully inline normalized content and identical
canonical bytes. It MUST NOT infer logical, mathematical, decompositional, or
differently expressed-schema equivalence.

The source-level issuer_domain_ref, value_semantics_ref, and
time_semantics_ref forms are source-composition mechanisms only. They do not
survive in normalized canonical Predicate Schema content. No generic semantic
reference may survive into canonical bytes.

Reference resolution does not make unsupported semantic content portable. After
recursive expansion and normalization, every semantically relevant rule in the
resulting content MUST pass the same exhaustive portable-subset admission check
as inline content. If it does not, the Predicate Schema is non-profile-valid
and MUST NOT be encoded by this profile. Reference identity is not proof that
the referenced semantic content is portable-profile-valid.

## 4. Exact top-level canonical map

The normalized Predicate Schema is exactly one closed CBOR map:

~~~text
NormalizedPredicateSchema := {
  "issuer_domain": IssuerDomain,
  "value_semantics": ValueSemantics,
  "subject_constraints"?: SubjectConstraints
}
~~~

issuer_domain and value_semantics are required; subject_constraints is optional.
An absent optional member MUST be omitted; it MUST NOT be encoded as CBOR null,
an empty map, an empty array, or a sentinel. The top-level map is closed.
Unknown members and duplicate keys are invalid.

The three labels above are the exact UTF-8/NFC text labels. Their emitted order
is determined solely by VE-CBOR-1 deterministic encoded-key ordering. Source
declaration order has no effect on canonical bytes. `time_semantics` is a
semantic-contract source field but is not an encoded member of this v1.0
bounded portable profile; Section 12 defines its required normalization.

## 5. Canonical field-form node representation

Every grammar node is exactly one closed CBOR map with a required text member
"form". The allowed form values are the exact lower-case text values:

~~~text
"boolean"
"integer"
"text"
"bytes"
"record"
"sequence"
~~~

No other form value is valid. The following dedicated forms do not exist:

~~~text
enum
scaled_integer
ordered_list
unordered_set
~~~

No grammar node may contain semantic_ref, field_semantics_ref, extension_ref,
contract_ref, custom_semantics_ref, semantic_descriptor, a unit reference, a
time-domain reference, or an extension map.

### 5.1 Boolean node

A Boolean node has exactly this map:

~~~text
{ "form": "boolean" }
~~~

When a Boolean value domain needs a closed subset, the node MAY additionally
contain "allowed_values" as specified in Section 6. No other Boolean metadata
is permitted.

### 5.2 Integer node

An Integer node has this exact shape:

~~~text
{
  "form": "integer",
  "minimum"?: Bound,
  "maximum"?: Bound,
  "scale"?: non-negative CBOR integer,
  "allowed_values"?: [integer, ...]
}

Bound := {
  "value": CBOR integer,
  "inclusive": CBOR Boolean
}
~~~

minimum and maximum are independently optional. Their absence means unbounded
in that direction. A bound has exactly one inclusion representation: the
required Boolean inclusive member. No sentinel bound, float, decimal floating
point, source-language number, or implicit conversion is permitted.

A profile-valid Integer node MUST describe a non-empty possible integer domain
before `allowed_values` is applied. For a present minimum, `effective_min` is
its `value` when `inclusive` is true and `value + 1` when `inclusive` is false.
For a present maximum, `effective_max` is its `value` when `inclusive` is true
and `value - 1` when `inclusive` is false. When both effective bounds exist,
`effective_min <= effective_max` is required. If it does not hold, profile
validation MUST fail.

Effective-bound calculations use mathematical integers. An implementation that
cannot calculate `value + 1` or `value - 1` safely MUST reject the input rather
than wrap, truncate, or use floating-point arithmetic. This makes `[1,1]`,
`[1,2]`, `(1,2]`, and `[1,2)` valid; it makes `(1,1]`, `[1,1)`, `(1,1)`,
`(1,2)`, and every `minimum > maximum` form invalid.

scale, when present, applies to the integer coefficient:

~~~text
semantic quantity = coefficient × 10^(-scale)
~~~

It is semantic metadata inside the applicable value_semantics (or future
portable time semantics), not a separate value form or runtime field. Units,
comparability, conversion, and quantity meaning remain inline Predicate Schema
semantic content. This profile creates neither a Unit object nor a unit
reference.

Absent scale and `scale: 0` represent the same semantic case. Before encoding,
`scale: 0` MUST normalize to the omitted form. A non-zero scale MUST remain
explicit, so absent and explicit zero MUST NOT yield different canonical bytes.

### 5.3 Text node

A Text node has exactly this shape:

~~~text
{
  "form": "text",
  "allowed_values"?: [text, ...]
}
~~~

Every text value, including an allowed value, MUST be valid UTF-8 and Unicode
NFC. This profile defines no regex, trimming, case-folding, delimiter rewrite,
locale transformation, executable expression, or general normalization
pipeline.

### 5.4 Bytes node

A Bytes node has exactly this shape:

~~~text
{
  "form": "bytes",
  "allowed_values"?: [bytes, ...]
}
~~~

Byte strings are emitted directly as CBOR byte strings. Text, base64, and other
source aliases are not members of normalized canonical content.

## 6. Allowed-values constraint

allowed_values MAY appear only in a Boolean, Integer, Text, or Bytes node.
Every member MUST satisfy that node's underlying scalar form and any applicable
Integer bounds and scale. When omitted, `allowed_values` imposes no
allowed-values restriction. When present, it MUST contain at least one member;
an empty array is invalid and MUST NOT normalize to omission. The array MUST be
in ascending bytewise lexicographic order of each member's deterministic
VE-CBOR-1 encoding. Duplicate members after normalization explicitly defined by
this v1.0 portable profile are invalid.

The source order of allowed values has no semantic meaning and MUST NOT affect
canonical bytes. A closed vocabulary is represented only by this constraint; no
separate enumeration form exists. Allowed values MUST validate under the
FieldForm, undergo only this v1.0 profile-defined normalization, canonicalize,
sort deterministically, and reject duplicates after that normalization. No
source-specific or externally interpreted normalization is permitted.

## 7. Record node and field ordering

A Record node has exactly this shape:

~~~text
{
  "form": "record",
  "fields": {
    <NFC text field name>: RecordField,
    ...
  }
}

RecordField := {
  "presence": "required" | "optional",
  "grammar": FieldForm
}
~~~

fields is a CBOR map, not an array of descriptors. Its key is the one canonical
representation of the NFC text field name, so a second name member would be
redundant. VE-CBOR-1 map-key ordering provides deterministic field ordering;
source declaration order has no effect on canonical bytes.

The fields map and every RecordField map are closed. Field names and map keys
MUST be unique. A runtime record MUST contain every required field, MAY omit an
optional field, and MUST reject unknown or duplicate fields. This is the sole
representation of record-field presence.

## 8. Sequence node and non-semantic ordering

A Sequence node has exactly this shape:

~~~text
{
  "form": "sequence",
  "element": FieldForm,
  "ordering_significant": CBOR Boolean,
  "uniqueness": CBOR Boolean,
  "min_items"?: non-negative CBOR integer,
  "max_items"?: non-negative CBOR integer
}
~~~

ordering_significant and uniqueness are always encoded. They have no default
value and therefore no omitted/default ambiguity.

Omission of `min_items` means a minimum cardinality of zero. An explicit
`min_items: 0` is semantically equivalent to omission and MUST normalize to the
omitted form before VE-CBOR-1 encoding. Omission of `max_items` means an
unbounded maximum. No finite sentinel denotes an unbounded maximum, so every
present `max_items` remains explicit. Both cardinalities, when present, MUST be
non-negative mathematical integers. When both are present, `min_items <=
max_items` is required; otherwise profile validation MUST fail.

Cardinality normalization occurs before canonical encoding. Therefore, an
otherwise identical source sequence with no cardinality members and one with
only `min_items: 0` produces identical normalized sequence content. Cardinality
does not alter the independent meanings of `ordering_significant` or
`uniqueness`.

When ordering_significant is true, normalized element order is semantic. When
it is false, source order has no semantic meaning and the runtime array MUST be
sorted by ascending bytewise lexicographic order of each normalized member's
deterministic VE-CBOR-1 representation. When uniqueness is true, duplicate
canonical members MUST fail closed. When it is false, multiplicity is preserved,
including repeated byte-identical members.

`ordering_significant: false` and `uniqueness: false` explicitly denote a
**multiset**. Canonicalization MUST normalize members, derive each member's
canonical bytes, sort by the governed canonical byte-order rule, and preserve
every repeated equal member. When `uniqueness` is true, duplicate normalized
canonical members MUST fail closed.

The sequence node is the sole representation of collection ordering,
uniqueness, and multiplicity. It replaces separate ordered-list and
unordered-set forms.

## 9. Issuer-domain canonical representation

issuer_domain has exactly this closed map:

~~~text
IssuerDomain := {
  "identifier": FieldForm,
  "equality": "canonical"
}
~~~

identifier describes the normalized issuer identifier with the closed
field-form grammar. This map is complete only when there are no additional
issuer-domain semantic validation, normalization, or equality rules beyond
those explicitly permitted by this profile. In the v1.0 portable subset,
validation uses only constraints expressible by that FieldForm; the only
admitted normalization is profile-governed representation handling; and
equality is deterministic canonical-representation equality after validation
and that normalization:

~~~text
validate
    -> profile-governed normalization
    -> canonical representation
    -> equality by canonical representation
~~~

UTF-8/NFC text handling is portable because ADR-ENC-001 already governs it:
text MUST be valid UTF-8 in NFC and non-NFC input is rejected. Arbitrary
case-folding, trimming, delimiter rewriting, locale transformation, or custom
normalization is not portable-profile-valid unless a future profile pins the
exact algorithm, Unicode/version dependency, and normalization semantics. This
profile does not introduce such a vocabulary.

Any extra issuer-domain semantic rule MUST fail profile validation before
canonical encoding. Therefore, plain NFC Text issuer semantics and
checksum-constrained Text issuer semantics cannot collapse to the same canonical
bytes: the latter is not profile-valid today. The same rule excludes email-form,
URI-form, account-number, DID-specific, locale-dependent, custom-identity, and
external identity-resolution semantics until a future governed profile
represents them.

This profile neither invents semantic equality nor defines a universal identity
ontology. It MUST NOT encode trust, signer/key material, delegation, revocation,
authorization, publisher identity, or namespace authority.

## 10. Value-semantics canonical representation

value_semantics has exactly this closed map:

~~~text
ValueSemantics := {
  "value": FieldForm
}
~~~

The nested form and its constraints carry the predicate-defined permitted value
domain, scalar vocabulary, numeric scale/range, record structure, and collection
behavior. Value meaning remains Predicate Schema semantics; this map does not
establish a VE-global value type system.

This map is canonical only when all value validation, normalization, equality,
dimensionality, and collection semantics are fully represented by permitted
FieldForm constraints and this v1.0 profile's rules. Validation may use only
those constraints; normalization may use only this v1.0 profile-defined normalization;
and equality is canonical-representation equality after that validation and
normalization. Any additional semantic equality rule, including approximate,
tolerance-based, case-insensitive, domain-specific, custom, or unsupported
normalized equivalence, MUST cause profile validation failure.

There is no profile-level unit field, Unit object, unit reference, or unit
registry. Unit meaning remains inside `value_semantics` and, at source
composition, its existing `value_semantics_ref`. This v1.0 profile defines no
finite governed unit vocabulary. Therefore, every explicit unit-bearing value
semantic form is outside the v1.0 portable subset. Free-form labels such as
`USD` or `metre` are not portable semantic identity under this profile.

For a v1.0 profile-valid numeric value, absence of unit semantics means
**dimensionless**. It MUST NOT mean that a unit exists but is unspecified,
inferred externally, implied by an alias, name, or documentation, or deferred
to another system. Any such semantic claim MUST cause profile validation failure.

The merged grammar defines no general null form. Accordingly, this profile
defines no universal null_like member and does not create one. An absent field
remains distinct from an explicit predicate-permitted null-like value. CBOR null
can never substitute for absence. Because the v1.0 portable FieldForm set
does not represent a null-like asserted value, a Predicate Schema that assigns
such a value semantic meaning is outside the v1.0 portable subset.

## 11. Subject-constraint canonical representation

When present, subject_constraints is a non-empty CBOR array containing one or
more of these exact UTF-8/NFC text values:

~~~text
"ActionContentReference"
"ActionOccurrenceReference"
"EventReference"
~~~

The members MUST be sorted by ascending bytewise lexicographic order of their
deterministic VE-CBOR-1 encodings and MUST NOT repeat. The array encodes only
the allowed subset of the existing closed Claim subject-reference union. It
MUST NOT encode Action/Event identifier values, identifier wire forms,
subject-reference payloads, attempt grouping, a generic reference, or a new
subject type. Any additional subject semantic constraint not represented by this
closed subset is outside this v1.0 portable profile and MUST fail validation.

**Event dependency: non-blocking for Predicate Schema canonical bytes.**
This profile encodes only the semantic name EventReference, not an Event
instance or its identifier. Draft VE-002 and future Event representation work
remain relevant to portable Claim/reference bytes, not to canonical Predicate
Schema bytes under this profile.

## 12. Time-semantics portable boundary

The v1.0 bounded portable profile admits exactly one canonical time state:
`time_semantics` is omitted. It means both Claim time fields are forbidden, and
a Claim containing either `assertion_time` or `observation_time` is semantically
invalid under that Predicate Schema; the field is not ignored.

A source form explicitly stating both `assertion_time: forbidden` and
`observation_time: forbidden` MUST normalize to the single canonical absent
`time_semantics` form before encoding. It MUST NOT produce different canonical
bytes from an already absent source field.

Present time semantics remain semantically possible under the broader Semantic
Contract, but epoch, precision, UTC basis, leap-second handling, range, unit,
and proposition-specific interpretation are not yet expressed by a finite
governed portable vocabulary. Such content is outside the v1.0 portable
subset and MUST fail profile validation. This profile creates no TimeDomain,
time-domain reference, or VE Time primitive.

## 13. Finite recursive grammar encoding

Record and Sequence nesting is encoded recursively through the FieldForm nodes
above. Each grammar instance MUST be a finite, acyclic inline tree. Named
recursive types, self-reference, and cyclic grammar graphs are invalid and MUST
fail closed.

The separately governed graph of source field-specific semantic references MUST
also be finite and acyclic where recursive content identities depend on one
another. That is a content-identity/representation prerequisite, not an
attempt, Claim, or kernel concept.

## 14. Unknown content and self-reference exclusions

Every map described by this profile is closed. Unknown labels, unknown form
values, duplicate map keys, unsupported features, and noncanonical encodings
are invalid and MUST fail closed. They MUST NOT be ignored, preserved as opaque
extension data, mapped to a default, or passed to an executable policy engine.

There is no portable semantic metadata channel outside the closed structures in
this profile. Annotations, metadata maps, opaque descriptors, comments,
semantic labels, and external interpretation hints MUST NOT affect the meaning
of a profile-valid Predicate Schema. If any does affect meaning, the schema is
outside the portable subset and MUST fail profile validation.

Canonical Predicate Schema content MUST exclude:

- the predicate's own digest or content identity;
- aliases, display names, publisher identity, and namespace authority;
- comments, examples, documentation, documentation URLs, and retrieval URLs;
- creation/modification timestamps and version labels;
- predecessor/successor or other succession metadata; and
- other non-semantic discovery, provenance, or publication material.

The exclusion prevents self-reference and mutable publication metadata from
altering canonical semantic bytes. It does not exclude a resolved field-specific
semantic fragment merely because the source used content-addressed resolution.

## 15. Canonical bytes, digest suite, and predicate identity

For every profile-valid normalized Predicate Schema:

~~~text
predicate_schema_canonical_bytes =
  VE-CBOR-1 encode(NormalizedPredicateSchema)
~~~

Two independent conforming implementations can derive identical canonical bytes
from the same normalized Predicate Schema when that schema is valid under the
bounded portable profile. Every admitted map structure, label, scalar, array
order, bound representation, optionality rule, and recursive node form is fixed
by this profile and ADR-ENC-001. This claim does not extend to Predicate Schemas
outside the portable subset.

This profile defines canonical bytes, not portable predicate identity.
DIGEST-001 remains open, and RFC-005 remains Draft. A digest suite MUST NOT
be silently assumed to be SHA-256 or any other algorithm. Predicate identity
requires separately governed decisions for the digest algorithm/suite, domain
separation, object-type framing, representation/profile binding, digest-byte
representation, and whether suite identity is carried in the identity envelope
or externally pinned. This profile resolves none of those decisions.

The relationship to RFC-005 is **B. CONCEPTUAL ALIGNMENT ONLY**. RFC-005 may
eventually supply digest framing or a portable typed-reference structure, but
this profile does not import Draft DigestReference, ObjectReference,
representation-profile, or digest-suite rules as normative authority.

## 16. Cross-language test-vector requirements

The normative `PREDICATE-SCHEMA-CANONICALIZATION-V1` vector package satisfies
the v1.0 cross-language canonicalization requirement. It MUST cover at least:

- every scalar form;
- Integer scale, range, and inclusive/exclusive bounds;
- allowed-values ordering and duplicate rejection;
- record-field ordering and required/optional handling;
- ordering-significant sequences;
- ordering-insignificant sequences, including multiset multiplicity
  preservation;
- sequence uniqueness rejection;
- nested record/sequence trees;
- profile-governed issuer validation followed by canonical equality;
- rejection of unsupported issuer normalization and unit semantics;
- subject-constraint ordering;
- normalization of both-forbidden time source content to absent
  `time_semantics`, and rejection of present time semantics; and
- inline/reference exact-normalization equivalence, including unavailable and
  cyclic dependencies.

They MUST also cover local domain and cardinality validity:

| Case | Required result |
|---|---|
| Sequence `min` absent / `max` absent | Profile-valid; `0..unbounded`. |
| Sequence `min: 0` / `max` absent | Profile-valid; normalize `min` away. |
| Sequence `min: 2` / `max` absent | Profile-valid; `2..unbounded`. |
| Sequence `min` absent / `max: 5` | Profile-valid; `0..5`. |
| Sequence `min: 2` / `max: 5` | Profile-valid. |
| Sequence `min: 5` / `max: 5` | Profile-valid; exact cardinality five. |
| Sequence `min: 6` / `max: 5`, negative `min`, or negative `max` | Non-profile-valid. |
| Integer `[1,1]`, `[1,2]`, `(1,2]`, or `[1,2)` | Profile-valid. |
| Integer `(1,1]`, `[1,1)`, `(1,1)`, `(1,2)`, or `minimum > maximum` | Non-profile-valid. |
| `allowed_values` omitted | Profile-valid; unrestricted by that constraint. |
| `allowed_values: [1]` within a valid Integer domain | Profile-valid. |
| `allowed_values: []`, duplicate normalized members, or a member outside Integer bounds | Non-profile-valid. |

The vectors MUST also demonstrate the following v1.0 admission outcomes:

| Case | Required result |
|---|---|
| NFC Text issuer with no additional validation and canonical equality | Profile-valid. |
| Text issuer with checksum, email-form, or case-insensitive semantics | Non-profile-valid. |
| Dimensionless bounded Integer with non-zero scale and canonical equality | Profile-valid. |
| Integer with approximate equality, externally implied unit, or explicit `USD` semantics | Non-profile-valid. |
| `value_semantics_ref` resolving to supported dimensionless bounded Integer semantics | Profile-valid after expansion. |
| `value_semantics_ref` resolving to unsupported unit-bearing semantics | Non-profile-valid after expansion. |
| Present substantive `time_semantics` | Non-profile-valid. |

The vectors are required conformance evidence for this Approved v1.0 profile.
They do not make DIGEST-001, Claim-body portability, Event semantics, runtime
resolution infrastructure, trust, verification, or authorization Approved.

## 17. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Canonical bytes make immutable semantics inspectable without altering authority. |
| New primitive burden | Pass. This is representation machinery for Predicate Schema, not a primitive. |
| Removability | VE-CBOR-1 mechanics, the fixed closed grammar, and normalization boundary are necessary; a second canonicalization system and generic reference layer are removable. |
| Twenty-year durability | Pass, conditional on retaining semantic material, this profile, the grammar, and future identity framing. |
| Independent implementability | Pass for the bounded portable subset. Portable predicate identity remains blocked on digest/framing. |
| Total conceptual complexity | Pass. One fixed VE-CBOR-1 profile avoids a second encoding system and does not create universal value or time ontologies. |

## 18. Governance and normative home

| Governance question | Result |
|---|---|
| New primitive? | No. |
| New Claim field? | No. |
| New runtime abstraction? | No. |
| New semantic abstraction? | No. Predicate Schema semantics remain the authority for meaning. |
| RFC required? | No. This initial approval freezes existing Draft behavior without changing an Approved specification. |
| ADR required? | No. ADR-ENC-001 remains the applicable canonical-encoding authority. |
| Approved-specification revision required? | No. No previously Approved specification is revised. |
| Correct normative home? | This Approved VE-CBOR-1 Predicate Schema representation profile v1.0. |

## 19. Remaining blocker and next action

The field-semantic representation grammar is complete for the bounded portable
subset. Semantic forms outside that subset remain valid abstract Predicate
Schema content but are not canonicalized by this profile. Within the subset, the
only remaining portability blocker for predicate identity is the separately
governed digest suite and identity-framing decision recorded as DIGEST-001.

The next action is to resolve DIGEST-001 through its separate governance path,
defining digest suite and predicate-identity framing. That work may assign a
profile code only after this complete v1.0 closure and its vectors are merged.
It is not to duplicate this profile's canonicalization rules. No RFC or ADR is
created by this approval.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-08-28 | Approved machine-behavior freeze for the bounded portable canonicalization profile; pins Grammar v1.0, Semantic Contract v1.0, and ADR-ENC-001 v0.1, with normative canonicalization vectors. |
| 0.1 | 2026-08-28 | Revised Draft to define canonical bytes only for the bounded portable subset, with exhaustive closed-world admission before encoding. |
