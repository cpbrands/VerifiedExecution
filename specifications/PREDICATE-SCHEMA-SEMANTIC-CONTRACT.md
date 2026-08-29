---
id: PREDICATE-SCHEMA-SEMANTIC-CONTRACT
title: Predicate Schema Semantic Contract
version: "1.0"
status: Approved
document_type: Specification
category: Claim Semantics
author: Verified Execution Editorial Board
created: 2026-08-28
updated: 2026-08-28
depends_on: []
related_documents:
  - CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - VE-CLAIM-REFERENCE-SEMANTICS
  - ADR-VERIFY-002
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - RFC-005
supersedes: null
superseded_by: null
---

# Predicate Schema Semantic Contract

## Status and authority boundary

This Approved v1.0 specification defines the minimum semantic content of an
immutable Predicate Schema. It does not amend an Approved specification, accept
RFC-005, create a VE primitive, or add a Claim-body field.

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

This document is semantic only. It does not define CBOR encoding, digest algorithms, wire forms, CEL binding, verification mechanics, trust policy, a VE-hosted registry, a universal value taxonomy, or a universal time ontology.

Predicate identity remains:

```text
Claim.body.predicate
    = immutable Predicate Schema semantic-content identity
```

## v1.0 machine-behavior freeze and dependency closure

Machine-affecting behavior of this Approved v1.0 contract is immutable. An
editorial correction preserves v1.0 meaning only when no conforming
implementation can change an admission outcome, reference-resolution result,
normalized semantic content, canonical structure, canonical ordering, or
canonical VE-CBOR-1 bytes. Any machine-affecting change requires the normal
Approved-specification change process and a new semantic version.

For the Predicate Schema canonicalization closure, this contract owns only the
semantic source model, field-specific reference resolution, exact-normalization
rule, and fail-closed behavior consumed by the Approved
`PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR` v1.0 and
`PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE` v1.0. It does not encode
CBOR; those consumers apply `ADR-ENC-001` v0.1.

The related Claim, Event, and verification documents define their own semantic
boundaries. They neither supply a FieldForm, alter v1.0 reference expansion,
nor add a canonical map member, ordering rule, or VE-CBOR-1 byte rule to the
canonicalization closure. They are therefore informative boundary references,
not machine-affecting dependencies of this v1.0 contract.

## 1. Purpose

A Predicate Schema exists only to make these Claim-body fields semantically interpretable:

```text
issuer_ref
value
subject_reference
assertion_time?
observation_time?
```

This specification defines the minimum semantics that independent implementations
must agree on for the Approved v1.0 representation profile to produce canonical
Predicate Schema bytes and for a separately governed digest suite to produce
portable content identity.

## 2. Terminology

**Predicate Schema**

An immutable, proposition-specific semantic descriptor selected by `Claim.body.predicate`. It is a non-primitive normative abstraction, not a VE kernel primitive, Event, Claim, identity provider, registry, or trust authority.

**Issuer-domain semantic content**

The field-specific semantic content that defines an issuer identifier domain and equality within that domain. A Predicate Schema MUST provide it through exactly one authoritative source: inline `issuer_domain` XOR `issuer_domain_ref`, whose value is its immutable semantic-content identity. It is not a new named normative object, a generic semantic-contract layer, or a VE identity system.

**Immutable composition reference**

A field-specific reference to the semantic-content identity of immutable shared field semantics. It is not a generic `semantic_contract_ref` or a Claim-body field.

## 3. Minimal Predicate Schema model

The minimum conceptual model is:

```text
PredicateSchema {
  issuer_domain,
  value_semantics,
  subject_constraints?,
  time_semantics?
}
```

This is a semantic model, not a serialized record shape. `issuer_domain` and `value_semantics` are required because removing either makes a Claim-body field ambiguous. `subject_constraints` and `time_semantics` are optional only because their absence has the explicit meanings defined below.

| Element | Minimum obligation |
|---|---|
| `issuer_domain` | MUST provide exactly one authoritative source: inline issuer-domain semantics XOR `issuer_domain_ref`, an immutable issuer-domain semantic-content identity. |
| `value_semantics` | MUST provide exactly one authoritative source: inline value semantics XOR `value_semantics_ref`, an immutable value-semantics semantic-content identity. |
| `subject_constraints` | MAY constrain the legal Claim subject union. Its absence means no restriction beyond that union. |
| `time_semantics` | MAY define Claim-time semantics. When present, it MUST provide exactly one authoritative source: inline time semantics XOR `time_semantics_ref`. Its absence means both Claim time fields are forbidden. |

No separate Claim selector, Claim Profile, universal `VEValue`, universal Time Profile, or generic semantic-contract wrapper is required.

## 4. Issuer-domain semantics

Every Predicate Schema MUST define the semantic domain in which `issuer_ref` is interpreted and compared. It MUST provide exactly one authoritative source: inline `issuer_domain` XOR `issuer_domain_ref`, whose value is immutable issuer-domain semantic-content identity. Both forms simultaneously are invalid unless a future governed rule explicitly defines deterministic equivalence.

Issuer-domain semantic content defines only:

- the allowed issuer identifier domain;
- issuer identifier equality within that domain;
- all semantic normalization necessary to apply that domain and equality rule consistently; and
- cross-predicate comparability for Predicate Schemas that use the same immutable issuer-domain semantic-content identity.

It MUST NOT define trust, verification keys, signer binding, verification success, delegation, revocation, authorization, or issuer ranking. Byte-level issuer identifier representation remains future representation-profile work.

Two equal-looking `issuer_ref` values in Claims under different Predicate Schemas MUST NOT be considered semantically equal unless both schemas use the same immutable issuer-domain semantic-content identity. No Claim-body field is added.

The issuer-domain content may be reused without becoming a separate architectural abstraction. It does not make every reusable semantic fragment a VE object or create a generic contract layer.

## 5. Value semantics

`value_semantics` MUST define the permitted value domain and semantic equality for the predicate. It MUST define every property needed to determine whether two permitted values mean the same thing. VE defines no universal semantic type taxonomy.

`value_semantics` MUST provide exactly one authoritative source: inline value semantics XOR `value_semantics_ref`, or an equivalent field-specific reference whose value is immutable semantic-content identity. Both forms simultaneously are invalid unless a future governed rule explicitly defines deterministic equivalence. Reuse does not create a named Value Contract.

| Value case | Minimum schema obligation |
|---|---|
| Boolean-like state | Define permitted states and equality. |
| Integer-like count | Define range, signedness where relevant, and equality. |
| Text or bytes | Define permitted content and equality. |
| Enumerated state | Define its closed vocabulary and equality. |
| Measurement or amount | Define unit, scale, range, signedness where relevant, and equality. |

For money, temperature, percentage, count, or duration, the schema MUST define applicable unit, scale, range, and equality. It MUST NOT rely on an unstated conversion. This specification introduces no universal decimal or floating-point semantics. A predicate that permits another numeric form must define its equality and representation constraints through its schema and a future representation profile.

The schema MUST state whether a null-like asserted `value` is permitted and what it means. There is no universal VE null:

```text
absent Claim-body field
    != present Claim-body field with a null-like asserted value
```

A schema MAY define structured values. It MUST define relevant structure, field meaning, ordering significance, multiplicity, duplicate-member behavior, field identity, missing-field semantics, and equality. Terms such as record, list, set, tuple, and map remain proposition-specific semantics, not universal VE types.

## 6. Subject and time semantics

Claim Reference Semantics owns the legal closed subject union:

```text
ActionContentReference { action_digest }
| ActionOccurrenceReference { action_id, action_digest }
| EventReference { event_id }
```

When `subject_constraints` is absent, the Predicate Schema imposes no restriction beyond the existing closed Claim subject-reference union. When present, it MUST define permitted forms and any proposition-specific constraints, such as permitting only an Action occurrence. It MUST NOT add a new subject form, redefine equality, introduce an attempt reference, or redefine Action/Event identity or representation. Each Claim has exactly one `subject_reference`.

When `time_semantics` is absent, both `assertion_time` and `observation_time` are forbidden for Claims under that Predicate Schema. A Claim containing either field is semantically invalid; the field is not ignored. When `time_semantics` is present, the Predicate Schema MUST provide exactly one authoritative source: inline time semantics XOR `time_semantics_ref`, an immutable time-semantics semantic-content identity. It MUST define whether each field is optional or required, its proposition-specific meaning, and any applicable immutable time-domain semantic content. The two fields remain distinct from each other, verification time, Event time, and Receipt time.

Both an inline and referenced form for the same time semantics are invalid unless a future governed rule explicitly defines deterministic equivalence. Repeated time semantics MAY be reused through `time_semantics_ref`, or an equivalent field-specific reference whose value is immutable semantic-content identity, only when that reuse reduces total complexity. Inline time semantics remain sufficient when reusable identity is not needed. This does not create a named Time Domain Contract.

## 7. Composition model

### Verdict

**D. CONTENT-ADDRESSED FIELD SEMANTICS MAY BE REUSED WITHOUT NEW ARCHITECTURAL ABSTRACTION.**

The required model is minimal inline semantics with optional field-specific immutable reuse:

```text
Predicate Schema
    -> exactly one of issuer_domain inline or issuer_domain_ref
    -> exactly one of value_semantics inline or value_semantics_ref
    -> subject_constraints? (absence: no additional restriction)
    -> time_semantics? exactly one inline or reference form (absence: both Claim time fields forbidden)

Field-specific semantic content
    -> reusable only by immutable semantic-content identity
```

Fully inline schemas may duplicate issuer-domain semantics but cannot explicitly state a shared content identity for cross-predicate equality. Fully composed schemas add unnecessary indirection for every field. Field-specific content identity provides the needed reuse without elevating a fragment into a named architectural abstraction.

Field-specific semantic content MAY be reused by immutable semantic-content identity without becoming a separate architectural abstraction. This specification defines no generic `semantic_contract_ref`, `Value Contract`, `Time Domain Contract`, or `SemanticContract`. An optional shared value, time, or structure component MAY be used only through a field-specific immutable reference whose role is clear from the Predicate Schema.

## 8. Reference resolution, normalization, and semantic-content identity

An inline semantic fragment `F` and a field-specific reference that resolves to canonical semantic fragment `F` are semantically equivalent. The inline and reference forms are alternative authoritative sources for the same field; a Predicate Schema MUST NOT contain both forms for that field unless a future governed rule defines deterministic equivalence for their simultaneous use.

Predicate Schema semantic identity is computed as follows:

```text
resolve required field-specific references
        ↓
normalize semantic content
        ↓
canonical Predicate Schema semantic content
        ↓
predicate semantic-content identity
```

This is a semantic identity rule. Exact byte representation and digest computation remain future representation-profile work.

Two field-specific references `D1` and `D2` are interchangeable only when both resolve to identical canonical semantic content. Mere logical or mathematical equivalence is insufficient. Predicate identity follows governed canonical semantic specification content, not unrestricted equivalence inference; this specification introduces no theorem proving.

If a required field-specific reference cannot be resolved, supported, and validated, semantic interpretation is unavailable. Implementations MUST NOT partially normalize, fall back, or guess.

The following contribute to normalized Predicate Schema semantic content identity when applicable:

- normalized issuer-domain semantics, including its normalization and equality rules;
- normalized value semantics, including numeric, null-like, and structured-value rules;
- subject constraints;
- normalized assertion-time and observation-time semantics; and
- the semantic effect of immutable field-specific composition references.

The following MUST NOT contribute to Predicate Schema semantic content identity:

- the schema's own content identity or digest;
- aliases, display names, or version labels;
- publisher, provenance, signatures, or signer identity;
- documentation, comments, examples, or retrieval URLs;
- repository location;
- creation or modification timestamps; or
- predecessor or successor metadata.

```text
same canonical semantic content
        -> same predicate identity

semantic content change
        -> new predicate identity
```

Predicate identity follows canonical semantic specification content, not unrestricted logical or mathematical equivalence. Two differently expressed semantic schemas remain distinct unless a future governed canonical normalization rule makes their semantic content identical. This specification introduces no theorem proving, equivalence inference, or universal semantic normalization.

## 9. Validity, cycles, and unavailable dependencies

A Predicate Schema is semantically valid only when:

1. `issuer_domain` and `value_semantics` each have exactly one authoritative source, and any present `time_semantics` has exactly one authoritative source;
2. every required transitive semantic dependency is available and supported;
3. its referenced content-addressed semantic dependency graph is finite and acyclic where recursive content identities depend on one another;
4. issuer, value, subject, and time declarations do not contradict one another; and
5. every semantic construct it uses is understood by the implementation.

The graph of referenced content-addressed semantic dependencies MUST be finite and acyclic where recursive content identities depend on one another, because cycles prevent practical recursive construction of those identities. This is a content-identity and representation prerequisite, not an independent Claim semantic concept. An implementation MUST NOT attempt fixed-point interpretation or invent graph machinery to repair a cycle.

If any required Predicate Schema or transitive issuer-domain, time, value, or other semantic-composition dependency is unavailable, unsupported, or invalid, semantic interpretation is unavailable. An implementation MUST NOT partially interpret the Claim, guess missing semantics, or fall back to aliases, discovery metadata, or mutable external context.

An unsupported semantic feature MUST fail closed unless it is explicitly identified as non-semantic metadata. This specification creates no larger universal error taxonomy.

## 10. Extensibility and authority boundaries

This specification rejects an open-ended semantic `extensions` map. A new semantic rule, domain, or constraint changes Predicate Schema semantic content and therefore produces a new predicate identity. Non-semantic tooling metadata MAY evolve without changing predicate identity when it remains outside the canonical semantic-content boundary.

Predicate Schema defines what a Claim body means. It MUST NOT define:

- authorization logic, Rule expressions, policy, threshold decisions, issuer ranking, Claim selection, conflict resolution, or Rule evaluation;
- signature suites, verifier or key mapping, trusted issuers, revocation, or verification profiles; or
- Action semantics, Action digest, Action occurrence identity, Event semantics, or Event identity.

ADR-VERIFY-002 remains unchanged. Predicate Schema interpretation does not verify a signature, select a verification key, determine issuer trust, or modify `verification.profile` or `verification.artifact`.

## 11. Representation boundary

```text
Predicate Schema Semantic Contract
    -> semantic content

Predicate Schema Canonical Representation Profile v1.0
    -> deterministic canonical encoding for the bounded portable subset

Digest suite/profile
    -> portable instantiation of predicate content identity
```

This specification defines no CBOR labels, canonical bytes, digest algorithm,
digest suite, wire form, or CEL mapping. The Approved v1.0 representation
profile defines deterministic bytes only for its bounded portable subset;
portable content identity remains blocked on separately governed digest framing,
not on a new Claim semantic concept.

## 12. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Claim meaning is explicit, inspectable, and independent of runtime infrastructure. |
| New primitive burden | Pass. Predicate Schema is the only non-primitive normative abstraction; reusable field semantics do not become architectural abstractions. |
| Removability | The four semantic elements cannot be removed without ambiguity; a generic contract layer can be removed without loss. |
| Twenty-year durability | Pass. Immutable composition and closed semantics support offline historical interpretation. |
| Independent implementability | Pass. Implementations can resolve the same acyclic immutable semantic dependency graph. |
| Total conceptual complexity | Pass. Field-specific reuse avoids duplicated issuer equality rules and a universal contract/type system. |

Predicate Schema remains a necessary non-primitive normative abstraction. It is not mere documentation metadata because implementations need it to interpret Claim bodies consistently. It is not a kernel primitive because it owns no independent execution, lifecycle, authorization, or authority semantics.

## 13. Governance and normative home

| Governance question | Result |
|---|---|
| New primitive? | No. |
| New Claim field? | No. |
| New normative abstractions? | No. Predicate Schema remains the existing non-primitive normative abstraction; reused field semantics are not separate architectural abstractions. |
| RFC required? | No. This initial approval freezes existing Draft behavior without changing an Approved specification or the accepted Claim envelope. |
| Approved-specification revision required? | No. No previously Approved specification is revised. |
| Correct normative home? | This Approved standalone Predicate Schema semantic contract v1.0. |

## 14. Next artifact

The next artifact is DIGEST-001, which may define digest-suite and
content-identity framing only after the complete v1.0 canonicalization closure
and its normative vectors are merged. It must remain separate from CEL mapping,
verification mechanics, trust policy, and a global registry.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-08-28 | Approved machine-behavior freeze for Predicate Schema source composition, reference resolution, normalization, and fail-closed semantics used by canonicalization v1.0. |
| 0.1 | 2026-08-28 | Initial Draft defining minimum Predicate Schema semantic content and field-specific immutable composition. |
