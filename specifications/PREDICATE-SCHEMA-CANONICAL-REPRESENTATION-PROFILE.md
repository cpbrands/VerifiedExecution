---
id: PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
title: Predicate Schema Canonical Representation Profile
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
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
related_documents:
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CLAIM-REFERENCE-SEMANTICS
  - RFC-005
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# Predicate Schema Canonical Representation Profile

## Status and authority boundary

This is a Draft candidate representation profile. It applies the accepted
`VE-CBOR-1` mechanics in ADR-ENC-001 to the normalized semantic content
defined by the Predicate Schema semantic specifications. It does not amend
Claim semantics, Predicate Schema semantics, verification, Trust Context,
Rule/Evaluate, or Action/Event ownership.

This profile is a candidate **VE-CBOR-1 Predicate Schema Profile**. It does
not create a second canonicalization system, a new VE primitive, a Claim-body
field, a universal identity ontology, or a generic semantic-contract layer.

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

This profile does not define Claim verification, trust, signer/key binding,
delegation, revocation, Rule applicability, Rule evaluation, Action identity,
Event identity, a CBOR-to-CEL mapping, or a digest suite.

## 1. Objective

The intended portable invariant is:

```text
same normalized Predicate Schema semantic content
        ↓
same VE-CBOR-1 canonical bytes
        ↓
same portable predicate content identity
```

This Draft defines the canonicalization pipeline, outer map structure, and
accepted VE-CBOR-1 mechanics necessary for that invariant. It does not yet
define a complete portable grammar for every issuer-domain, equality, value,
or time semantic fragment. Therefore, it cannot yet claim complete portable
Predicate Schema bytes or a portable predicate-identity envelope.

## 2. Relationship to VE-CBOR-1

ADR-ENC-001 selects `VE-CBOR-1` for byte-sensitive VE Kernel Protocol v0.1
objects. A Predicate Schema whose semantic-content identity is used
portably is byte-sensitive. This profile therefore reuses `VE-CBOR-1` rather
than defining another encoding family.

For a profile-valid normalized Predicate Schema, the encoding rules are:

- RFC 8949 Core Deterministic Encoding;
- definite-length items only;
- shortest valid CBOR integer and length encodings;
- text-string map keys only;
- map keys ordered by bytewise lexicographic order of their deterministic
  CBOR encodings;
- valid UTF-8 text in Unicode NFC, with non-NFC input rejected rather than
  normalized;
- duplicate map keys rejected;
- no floating-point values; and
- no CBOR semantic tags unless a future VE-CBOR profile explicitly
  standardizes them.

These are representation mechanics. They do not create a universal VE value,
time, issuer, namespace, or subject-reference ontology.

## 3. Canonicalization pipeline

The exact conceptual pipeline is:

```text
Predicate Schema source form
        ↓
resolve field-specific references
        ↓
normalize semantic content
        ↓
canonical semantic Predicate Schema
        ↓
VE-CBOR-1 encoding
        ↓
canonical bytes
        ↓
separately governed digest suite
        ↓
predicate content identity
```

An implementation MUST resolve every required field-specific reference before
encoding. An unavailable, unsupported, invalid, cyclic, or otherwise
unresolvable required reference makes semantic interpretation and
canonicalization unavailable. It MUST NOT be replaced with a fallback,
partially normalized, guessed, alias-based, or network-dependent value.

The pipeline is semantic before it is representational. `VE-CBOR-1` encodes
canonical normalized content; it does not decide which source-level fragment
or reference is semantically correct.

## 4. Normalized Predicate Schema model

The semantic model implemented by this profile is:

```text
PredicateSchema {
  issuer_domain
  value_semantics
  subject_constraints?
  time_semantics?
}
```

After resolution and normalization, the canonical representation has this
outer conceptual form:

```text
NormalizedPredicateSchema := {
  "issuer_domain": NormalizedIssuerDomain,
  "value_semantics": NormalizedValueSemantics,
  "subject_constraints"?: NormalizedSubjectConstraints,
  "time_semantics"?: NormalizedTimeSemantics
}
```

The names above are exact top-level text-map labels for this Draft profile.
They are not integer labels and do not create a global field-label registry.
ADR-ENC-001 requires text-string map keys, and current authority establishes
no accepted integer-label registry for Predicate Schema fields.

The conceptual type names `NormalizedIssuerDomain`,
`NormalizedValueSemantics`, `NormalizedSubjectConstraints`, and
`NormalizedTimeSemantics` identify field positions only. They are not VE
objects, reference types, kernel primitives, or new architectural
abstractions.

## 5. Inline/reference normalization

For any field-specific semantic fragment `F`:

```text
Schema A
  issuer_domain = F

Schema B
  issuer_domain_ref = identity(F)
```

When the reference in Schema B resolves to the same canonical semantic
fragment `F`, both schemas MUST normalize to the same
`NormalizedIssuerDomain`. Therefore:

```text
canonical_bytes(Schema A) = canonical_bytes(Schema B)
```

The same rule applies to `value_semantics` and, when present,
`time_semantics`. Inline and reference syntax are source-composition choices,
not representational distinctions. Each reusable semantic field still has
exactly one authoritative source in a source form: inline content XOR its
field-specific reference.

## 6. Transitive expansion decision

This profile selects **recursively normalized inline content** for canonical
Predicate Schema representation.

Before encoding, each required field-specific reference MUST be resolved and
its canonical semantic fragment recursively expanded into the normalized
field position. The resulting canonical representation MUST NOT preserve
source-level `*_ref` syntax or a shared fragment's content identity merely
because that identity was used during resolution.

```text
source reference
        ↓ resolve
canonical semantic fragment
        ↓ recursively normalize
inline canonical Predicate Schema content
        ↓ VE-CBOR-1
canonical bytes
```

Canonicalization collapses only exact governed normalization. An inline
fragment `F` and a reference that resolves to canonical fragment `F` MUST
normalize to identical fully inline semantic content and therefore identical
canonical bytes. The same may apply to a future transformation only when a
governed canonical-normalization rule explicitly defines it.

Canonicalization MUST NOT infer arbitrary logical equivalence, mathematical
equivalence, arbitrary decompositional equivalence, or equivalence between
differently expressed semantic schemas. Predicate identity follows governed
canonical semantic specification content, not unrestricted semantic
equivalence.

A referenced fragment's own content identity is not a member of the final
Predicate Schema canonical content solely by virtue of being a reference.
Its semantic content is. Where recursive content identities depend on one
another, referenced content-addressed dependencies MUST be finite and
acyclic. This remains a content-identity/representation prerequisite, not a
new Claim semantic concept.

## 7. Top-level map and optionality

For a profile-valid normalized Predicate Schema, the top-level CBOR map MUST
contain exactly the following required labels and no source-composition
alternatives:

| Text label | Presence | Canonical value |
|---|---:|---|
| `issuer_domain` | Required | Fully normalized issuer-domain semantic content. |
| `value_semantics` | Required | Fully normalized value semantic content. |
| `subject_constraints` | Optional | Normalized restriction of the existing legal Claim subject union. |
| `time_semantics` | Optional | Fully normalized time semantic content. |

An absent optional top-level field MUST be omitted from the map. It MUST NOT
be represented by CBOR `null`, an empty map, an empty list, or a sentinel
value. Presence and absence remain distinct from every explicitly permitted
semantic value.

The top-level map is closed for this profile version. Unknown top-level
semantic fields are invalid. Duplicate map keys are invalid. Future semantic
evolution requires new Predicate Schema semantic content and, when its
representation changes, an explicitly governed profile revision rather than
an `extensions` map.

## 8. Normalized issuer-domain representation

The normalized `issuer_domain` field represents only these semantic concerns:

```text
NormalizedIssuerDomain := {
  "identifier_domain": IssuerIdentifierDomainForm,
  "equality_rule": IssuerEqualityRuleForm,
  "normalization": IssuerNormalizationForm
}
```

The labels above are candidate text labels for the field-local semantic map.
They are neither a universal identifier ontology nor a named Issuer Domain
Contract. The field MUST NOT encode trust, verification/key binding, signer
binding, delegation, revocation, authorization, publisher identity, or
namespace authority.

`IssuerIdentifierDomainForm`, `IssuerEqualityRuleForm`, and
`IssuerNormalizationForm` are not yet specified by a closed portable grammar.
Current semantic authority requires their meanings but does not determine
their exact structural forms. This is a representation-grammar blocker, not
permission to treat an identifier as opaque text, execute arbitrary policy,
or use CEL.

Cross-predicate issuer comparison is valid only when both Predicate Schemas
normalize to identical immutable issuer-domain semantic content. Equal-looking
`issuer_ref` values alone are insufficient.

## 9. Normalized value-semantics representation

The normalized `value_semantics` field MUST contain the semantic material
needed to interpret and compare values for its predicate. Its field-local
conceptual structure is:

```text
NormalizedValueSemantics := {
  "domain": ValueDomainForm,
  "equality": ValueEqualityRuleForm,
  "numeric"?: NumericSemanticForm,
  "null_like"?: NullLikeSemanticForm,
  "structured"?: StructuredValueSemanticForm
}
```

The optional members apply only when the predicate's value semantics require
them. This is not a universal VE type system. It is a candidate representation
grammar for the semantic rules that one Predicate Schema actually uses.

Portable representation remains blocked because the current semantic
contracts do not yet define closed structural forms for `ValueDomainForm`,
`ValueEqualityRuleForm`, `NullLikeSemanticForm`, or
`StructuredValueSemanticForm`. An implementation MUST NOT replace them with
arbitrary executable expressions, arbitrary recursive values, or an
unbounded extension map.

### 9.1 Scalar forms

A complete profile requires a finite mechanical scalar vocabulary sufficient
for schema-defined Boolean-like, integer-like, text, byte-string, and
enumerated forms. This vocabulary would be representation machinery, not a
universal VE semantic ontology. The exact allowed scalar forms and their
field-local grammar remain an unresolved dependency.

### 9.2 Structured values

A complete profile also requires a small closed grammar whenever a predicate
permits structured values. That grammar must express, where applicable:

- field identity;
- ordered or unordered collection behavior;
- multiplicity;
- duplicate-member behavior;
- missing-field semantics; and
- value equality.

This is representation machinery needed to instantiate the already-defined
schema-specific semantics. It does not create a generic VE collection/type
ontology or a new kernel primitive.

### 9.3 Numeric values

Floating-point values MUST NOT appear. A fractional quantity MUST use an
exact integer representation, with the governing value semantics defining
its unit, scale, range, signedness where relevant, and equality. Those
semantic parameters belong in the normalized numeric semantic content; they
MUST NOT be inferred from a source language, an implementation default, or a
display format.

The exact canonical grammar for units, scales, ranges, and integer-domain
constraints remains unresolved. It must be specified before independent
implementations can produce complete portable bytes for numeric predicates.

### 9.4 Null-like values

`null_like` describes only a predicate-defined asserted value semantics. It
does not make a missing top-level Predicate Schema field equivalent to CBOR
`null`, and does not create a universal VE null. Its exact canonical form
remains part of the required closed value-semantics grammar.

## 10. Subject-constraint representation

`subject_constraints`, when present, encodes only the allowed subset of the
existing closed Claim subject-reference union:

```text
ActionContentReference
ActionOccurrenceReference
EventReference
```

Its candidate canonical representation is a non-empty array of the exact
text values above, sorted by bytewise lexicographic order of each value's
deterministic VE-CBOR-1 encoding. The array MUST NOT contain a duplicate
member. It MUST NOT encode Action/Event identifier values, identifier wire
forms, subject-reference payloads, an attempt reference, a generic reference,
or a new subject form.

When `subject_constraints` is absent, no additional restriction is applied
beyond the closed subject-reference union. The legal union and equality of
its members remain owned by Claim Reference Semantics. This profile only
encodes the subset allowed by one Predicate Schema.

`EventReference` semantics remain provisional while VE-002 remains Draft.
This profile neither elevates VE-002 nor defines the Event identifier wire
representation.

## 11. Time-semantics representation

When present, `time_semantics` must provide the complete proposition-specific
meaning of both Claim time fields. Its field-local conceptual form is:

```text
NormalizedTimeSemantics := {
  "assertion_time": TimeFieldRequirement,
  "observation_time": TimeFieldRequirement,
  "interpretation": TimeInterpretationForm,
  "time_domain": TimeDomainForm
}

TimeFieldRequirement := "forbidden" | "optional" | "required"
```

When `time_semantics` is absent, both Claim time fields are forbidden.
A Claim containing either `assertion_time` or `observation_time` under such a
Predicate Schema is semantically invalid; the field is not ignored.

This profile does not yet define a portable grammar for `TimeInterpretationForm`
or `TimeDomainForm`. In particular, epoch, precision, range, UTC handling,
and leap-second semantics are not silently supplied by this profile. They may
be represented through a field-specific semantic fragment once a governed
closed representation grammar defines it. That reuse does not create a
universal VE time ontology or a named Time Domain Contract.

## 12. Closed grammar and unknown features

The complete Predicate Schema representation MUST use a finite, closed,
versioned grammar. Unknown semantic constructs are invalid and MUST fail
closed. They MUST NOT be ignored, preserved as opaque extension data, mapped
to a default, or passed to an executable policy engine.

This Draft defines the outer grammar and a subject-constraint form, but the
field-local issuer-domain, equality, value, structured-value, and time
grammars remain incomplete. Therefore an implementation cannot claim a
profile-valid portable canonical Predicate Schema solely from this Draft.

Representation-profile evolution MUST occur through an explicitly identified
new or revised profile. It MUST NOT occur through an open-ended:

```text
extensions: {}
```

## 13. VE-CBOR-1 encoding rules

For every profile-valid normalized Predicate Schema:

```text
predicate_schema_canonical_bytes =
  VE-CBOR-1 encode(NormalizedPredicateSchema)
```

Map ordering MUST use ADR-ENC-001 deterministic encoded-key ordering. Source
order, lexical source order, and implementation iteration order are not
permitted substitutes. Duplicate keys MUST be rejected, not accepted and
re-encoded. Text values and labels MUST be valid UTF-8 and Unicode NFC;
non-NFC input MUST be rejected, not normalized during decoding. Floating
point values are forbidden.

CBOR semantic tags are forbidden unless a future applicable VE-CBOR profile
explicitly standardizes them. This profile introduces no semantic tag.
Unsupported representation features MUST fail closed.

## 14. Non-self-reference and excluded material

The canonical Predicate Schema representation MUST exclude:

- its own content identity or digest;
- aliases and display names;
- publisher or organization identity;
- documentation, comments, examples, and retrieval URLs;
- creation and modification timestamps;
- predecessor or successor metadata; and
- other non-semantic discovery, provenance, or succession material.

The exclusion prevents a Predicate Schema's content identity from becoming
self-referential, mutable through publication metadata, or dependent on a
network resolver. It does not exclude a resolved field-specific semantic
fragment merely because that fragment was obtained through content-addressed
resolution.

## 15. Digest suite and predicate identity envelope

This profile defines canonical bytes only. It does not select a digest suite,
digest framing, object-type identifier, representation-profile identifier,
or a wire envelope for predicate identity.

`DIGEST-001` remains open, and RFC-005 remains Draft. A digest suite MUST NOT
be silently assumed to be SHA-256 or any other algorithm. Until separately
governed digest construction is available, this Draft's predicate identity
remains the semantic-content identity defined by Claim Predicate Schema
Reference Semantics, not a newly standardized `digest_suite + digest_bytes`
wire object.

The relationship to RFC-005 is **B. CONCEPTUAL ALIGNMENT ONLY**. RFC-005 may
eventually supply digest framing or a portable typed-reference structure, but
this profile does not import its Draft `DigestReference`, `ObjectReference`,
representation-profile, or digest-suite rules as normative authority.

## 16. Cross-language test-vector requirements

A complete profile implementation MUST eventually provide cross-language
canonicalization vectors covering at least:

- inline versus reference normalization to identical bytes;
- issuer-domain content and equality-rule encoding;
- scalar and structured value semantics;
- numeric unit, scale, and range;
- explicit null-like semantics and optional-field absence;
- subject-constraint subset ordering;
- time requirements and time-domain semantics; and
- transitive field-specific semantic fragments, including unavailable and
  cyclic dependencies.

These vectors are follow-up interoperability work. This Draft does not create
them or claim that the current representation grammar is complete.

## 17. Long-term audit

Once the closed grammar and digest construction are governed, an
implementation must be able to recompute canonical bytes offline from:

- retained Predicate Schema source semantic material;
- retained transitive semantic fragments required for normalization;
- the pinned Predicate Schema representation profile; and
- the separately governed digest suite and framing, when a portable digest
  identity is required.

Publisher availability, DNS, a registry, a namespace authority, and runtime
network access MUST NOT be required for that audit. Under this incomplete
Draft, the offline process is defined conceptually but cannot yet produce
complete portable bytes for every valid semantic Predicate Schema.

## 18. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Canonical bytes make immutable semantics inspectable without altering authority. |
| New primitive burden | Pass. This is representation machinery for Predicate Schema, not a primitive. |
| Removability | The VE-CBOR-1 mechanics and normalization boundary are necessary; a second canonicalization system and generic contract layer are removable. |
| Twenty-year durability | Conditional. Offline reconstruction is durable when semantic fragments, a closed grammar, and the profile are retained. |
| Independent implementability | Blocked. Complete issuer-domain, equality, value, structured-value, and time grammars are not yet specified. |
| Total conceptual complexity | Pass. One VE-CBOR-1 profile avoids a second encoding system and does not create a universal value or time ontology. |

### Verdict

**B. REPRESENTATION GRAMMAR DEPENDENCIES STILL BLOCK PORTABILITY.**

The semantic model is sufficient. The initial mandatory digest suite is also
open, but the first blocking work is the incomplete closed representation
grammar for field-specific semantic content. This Draft therefore does not
select verdict C or define portable predicate identity bytes prematurely.

## 19. Governance and normative home

| Governance question | Result |
|---|---|
| New primitive? | No. |
| New Claim field? | No. |
| New architectural normative abstraction? | No. This is a representation profile, not a semantic or kernel abstraction. |
| RFC required? | No. This Draft implements existing semantic rules and ADR-ENC-001 mechanics without changing Approved semantics. |
| Approved-specification revision required? | No. Normal governance applies before this Draft becomes authoritative. |
| Correct normative home? | A standalone Draft representation profile under VE-CBOR-1. |

## 20. Unresolved dependencies and next artifact

The remaining blockers are:

- a finite closed grammar for issuer identifier domains, equality rules, and
  required issuer normalization;
- a finite closed grammar for value domains, equality, null-like values,
  structured values, and numeric unit/scale/range semantics;
- a finite closed grammar for time interpretation and time-domain semantics;
- the Draft Event representation work on which `EventReference` portability
  depends; and
- a separately governed digest suite and framing for portable predicate
  identity.

The single next artifact is **Predicate Schema Field-Semantic Representation
Grammar**. It should define the closed, field-local representation grammar for
issuer-domain, equality, value, structured-value, numeric, null-like, and
time semantic fragments. It must remain representation machinery, must not
create a universal VE type system or named reusable contracts, and must not
select a digest suite.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-28 | Initial Draft applying VE-CBOR-1 mechanics to normalized Predicate Schema semantic content. |
