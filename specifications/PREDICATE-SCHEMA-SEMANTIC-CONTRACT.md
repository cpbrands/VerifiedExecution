---
id: PREDICATE-SCHEMA-SEMANTIC-CONTRACT
title: Predicate Schema Semantic Contract
version: "1.2"
status: Approved
document_type: Specification
category: Claim Semantics
author: Verified Execution Editorial Board
created: 2026-08-28
updated: 2026-09-02
depends_on: []
related_documents:
  - CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - VE-CLAIM-REFERENCE-SEMANTICS
  - ADR-VERIFY-002
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - RFC-005
  - RFC-010
  - ADR-010
supersedes: null
superseded_by: null
---

# Predicate Schema Semantic Contract

## Status and authority boundary

This Approved v1.2 revision adds only the cross-predicate value-comparison
semantics authorized by Accepted RFC-010 and ADR-010. It does not accept
RFC-005, create a VE primitive, add a Claim-body field, define a universal
quantity ontology, or introduce generic conversion or arithmetic.

Approved v1.1 remains historically authoritative and immutable. This revision does not alter
the semantics of a v1.1-valid Predicate Schema that omits the new optional
comparison extension. The coordinated Approved v1.2 Canonical Representation
Profile preserves that schema's normalized content and canonical bytes.

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

## v1.0 machine-behavior freeze and v1.1 approved boundary

Machine-affecting behavior of Approved v1.0 is immutable. An editorial
correction preserves v1.0 meaning only when no conforming implementation can
change an admission outcome, reference-resolution result, normalized semantic
content, canonical structure, canonical ordering, or canonical VE-CBOR-1
bytes. Any machine-affecting change requires the normal Approved-specification
change process and a new semantic version.

For the v1.0 Predicate Schema canonicalization closure, this contract owns
only the semantic source model, field-specific reference resolution,
exact-normalization rule, and fail-closed behavior consumed by the Approved
`PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR` v1.0 and
`PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE` v1.0. It does not encode
CBOR; those consumers apply `ADR-ENC-001` v0.1.

The related Claim, Event, and verification documents define their own semantic
boundaries. They neither supply a FieldForm, alter v1.0 reference expansion,
nor add a canonical map member, ordering rule, or VE-CBOR-1 byte rule to the
canonicalization closure. They are therefore informative boundary references,
not machine-affecting dependencies of this v1.0 contract.

Approved v1.1 supplies the semantic portion of the permanent v1.1 closure. The
separately Approved Canonical Representation Profile v1.1 and DIGEST-001 v0.2
define its portable representation and PSCID binding. This Approved v1.2
revision defines new semantic content only; the coordinated Approved Canonical
Representation Profile v1.2 defines canonical bytes and Approved DIGEST-001
v0.3 defines content identity. This contract does not encode CBOR, construct a
digest, or alter the v1.1 closure.

## 1. Purpose

A Predicate Schema exists only to make these Claim-body fields semantically interpretable:

```text
issuer_ref
value
subject_reference
assertion_time?
observation_time?
```

This specification defines the minimum semantics that independent
implementations must agree on. Approved v1.0 uses those semantics for its
bounded canonical representation; the v1.1 additions are represented by the
coordinated Approved v1.1 profile and DIGEST-001 v0.2 identity construction.

## 2. Terminology

**Predicate Schema**

An immutable, proposition-specific semantic descriptor selected by `Claim.body.predicate`. It is a non-primitive normative abstraction, not a VE kernel primitive, Event, Claim, identity provider, registry, or trust authority.

**Issuer-domain semantic content**

The field-specific semantic content that defines an issuer identifier domain and equality within that domain. A Predicate Schema MUST provide it through exactly one authoritative source: inline `issuer_domain` XOR `issuer_domain_ref`, whose value is its immutable semantic-content identity. It is not a new named normative object, a generic semantic-contract layer, or a VE identity system.

**Immutable composition reference**

A field-specific reference used to compose immutable shared field semantics.
Existing v1.0 field references denote immutable semantic-content identity. A
field-specific reference explicitly defined as source-level composition requires
no portable semantic-fragment identity. Neither form is a generic
`semantic_contract_ref` or a Claim-body field.

**Subject-domain semantic content**

The optional field-specific semantic content that interprets an
`ExternalSubjectReference.identifier`. It defines only identifier form,
normalization, and equality. It is supplied through exactly one source when
present: inline `subject_domain` XOR source-level `subject_domain_ref`.
`subject_domain_ref` is composition notation only; it does not establish a
portable semantic-fragment identity, `SubjectDomainID`, generic
`ContentIdentity`, `DigestRef`, or `HashRef`.

**Comparison semantics**

Optional normalized structural semantic content inside `value_semantics` that
establishes cross-predicate equality and, when explicitly enabled, ordering.
It is not a `ValueDomain`, Quantity, Money, Currency, Unit, separately
addressable object, registry entry, reference target, or semantic-fragment
identity.

## 3. Minimal Predicate Schema model

The minimum conceptual model is:

```text
PredicateSchema {
  issuer_domain,
  value_semantics,
  subject_domain?,
  subject_constraints?,
  time_semantics?
}
```

This is a semantic model, not a serialized record shape. `issuer_domain` and `value_semantics` are required because removing either makes a Claim-body field ambiguous. `subject_constraints` and `time_semantics` are optional only because their absence has the explicit meanings defined below.

| Element | Minimum obligation |
|---|---|
| `issuer_domain` | MUST provide exactly one authoritative source: inline issuer-domain semantics XOR `issuer_domain_ref`, an immutable issuer-domain semantic-content identity. |
| `value_semantics` | MUST provide exactly one authoritative source: inline value semantics XOR `value_semantics_ref`, an immutable value-semantics semantic-content identity. |
| `subject_domain` | MAY define external identifier form, normalization, and equality. When present, it MUST provide exactly one authoritative source: inline subject-domain semantics XOR source-level `subject_domain_ref`. Its absence makes an `ExternalSubjectReference` Claim invalid. |
| `subject_constraints` | MAY constrain the legal Claim subject union. Its absence means no restriction beyond that union, subject to the external-subject validity rule. |
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

### 5.1 Optional cross-predicate comparison semantics

`value_semantics` MAY contain one optional inline `comparison` member. The
field name is fixed for v1.2 after pressure-testing
`comparison_semantics`, a second representation grammar, whole-field equality,
and external identifiers. The smallest semantic shape is:

```text
ValueSemantics {
  value: FieldForm
  comparison?: {
    domain: FieldForm
    ordered: boolean
  }
}
```

`comparison` is inline normalized structural content within
`value_semantics`. It MUST NOT be supplied through `comparison_ref`,
`comparison_domain_id`, `unit_id`, `currency_id`, a generic semantic reference,
or a registry or resolver. It is not independently addressable and has no
identity separate from the Predicate Schema containing it.

The `domain` FieldForm is inline structural semantic descriptor material in
this position; it is not a runtime schema for the Claim value. Its entire
normalized closed structure contributes to comparison-domain equality. VE
assigns no universal external ontology to descriptor text. Portable meaning
MUST NOT depend on undocumented publisher-private interpretation. A bare label
such as `"CAD"` is insufficient whenever it could mean Canadian dollars in one
schema and Customer Account Debit in another. The normalized descriptor MUST
then contain enough semantic material to distinguish those meanings. The
distinction comes from semantic structure, not publisher identity, trust, a
namespace, registry, resolver, or authority.

The `domain` member reuses the existing finite, acyclic FieldForm grammar only
as closed structural semantic material. It MUST be valid under that grammar.
It creates no second value-representation grammar, universal ontology, domain
registry, namespace authority, or runtime value field.

Presence of `comparison` explicitly supports semantic equality comparison.
Equality-only comparison is available for Boolean, Integer, Text, Bytes,
Record, and Sequence forms through normalized canonical semantic equality,
provided both runtime values validate locally and comparison semantics match.
Record and Sequence equality recursively includes their complete
comparison-relevant structure.

`ordered: true` additionally supports `<`, `<=`, `>`, and `>=` after all
comparison preconditions succeed, but is valid only when the top-level
comparison-relevant value form is IntegerForm. A schema using `ordered: true`
with Boolean, Text, Bytes, Record, or Sequence is invalid. This contract
defines no lexicographic, bytewise, canonical-CBOR, locale, or
implementation-specific ordering. `ordered: false` is equality-only. Broader
ordered forms require future governed evidence. Integer representation alone
does not imply ordering, and this contract defines no generic operator or
arithmetic language.

### 5.2 Comparison-relevant value form and predicate-local admissibility

The **normalized comparison-relevant value form** is existing normalized
FieldForm semantic material after removing only fields explicitly classified
here as predicate-local admissibility constraints. It is a fixed specification
rule, not an object, transform language, reusable abstraction, identifier,
reference, or second grammar.

The exhaustive classification is:

- comparison-relevant: form discriminator, Integer scale, scalar
  `allowed_values`, Record field identity/name, Record required/optional
  semantics, Record closedness, recursively classified Record child forms,
  Sequence element form, Sequence `ordering_significant`, Sequence
  `uniqueness`, recursively classified Sequence child forms, and all governed
  canonical scalar-normalization rules; and
- predicate-local admissibility only: Integer lower and upper bounds and
  Sequence `min_items` and `max_items`.

No other FieldForm member may be removed. In particular, `allowed_values`
remains comparison-relevant because it may define semantic vocabulary rather
than merely restrict local admission. Predicate-local members still MUST
validate each Claim value before comparison. Ignoring only those members
permits predicates with different bounds or sequence cardinality to share
comparison semantics without weakening either predicate. Predicate proposition
meaning remains outside the normalized comparison-relevant value form.

Scale is retained because it changes the canonical comparison representation.
Absent scale and `scale: 0` first undergo the existing governed normalization
to omission. Any other scale mismatch produces different comparison semantics;
it does not authorize implicit rescaling.

For relation `R`, the normalized structural comparison semantics are exactly:

```text
NormalizedComparisonSemantics {
  form: normalized_comparison_relevant_value_form(value)
  domain: normalize(comparison.domain)
  ordered: comparison.ordered
}
```

The notation above names the fixed result for exposition only; it does not
create a callable transform or separately named reusable abstraction. The
`form` member is not an additional serialized source member. Equality is
intrinsic canonical equality after local validation and governed normalization,
so this model does not duplicate an `equality: canonical` declaration.
Likewise, scale and representation are derived from `value`, so they are not
duplicated inside `comparison`.

### 5.3 Cross-predicate comparison invariant

Cross-predicate comparison is permitted if and only if:

1. each value is valid under its own Predicate Schema;
2. each schema contains `comparison` and explicitly supports the invoked
   capability; and
3. the schemas' normalized structural comparison semantics required for that
   relation are identical.

Otherwise the values are **NOT COMPARABLE**. `NOT COMPARABLE` is distinct from
a supported comparison whose result is false.

Missing, malformed, unknown, unsupported, cyclic, or non-identical comparison
material MUST fail closed. Implementations MUST NOT compare raw integers or
canonical scalar bytes, infer ordering, match labels, silently rescale, perform
conversion, consult a registry or resolver, partially normalize, or guess.

Semantic comparability establishes neither Claim authenticity, issuer trust,
predicate recognition, Rule applicability, resource authorization, nor
execution legitimacy. Those remain separate VE gates. A comparison result
MUST NOT make an otherwise inadmissible Claim eligible.

VE performs no cross-domain conversion. An external system may derive and
issue an ordinary verified Claim already expressed in the target comparison
semantics. VE then verifies and evaluates that Claim normally. This contract
defines no `ConversionClaim`, `FXClaim`, UnitConversion primitive,
exchange-rate source, market authority, or conversion subsystem.

## 6. Subject and time semantics

Claim Reference Semantics owns the legal closed subject union:

```text
ActionContentReference { action_digest }
| ActionOccurrenceReference { action_id, action_digest }
| EventReference { event_id }
| ExternalSubjectReference { identifier }
```

When `subject_constraints` is absent, the Predicate Schema imposes no
restriction beyond this closed Claim subject-reference union. When present, it
MUST define permitted forms and any proposition-specific constraints, such as
permitting only an Action occurrence. Its permitted forms are exactly
`ActionContentReference`, `ActionOccurrenceReference`, `EventReference`, and
`ExternalSubjectReference`; it MUST NOT add a new subject form, redefine
equality, introduce an attempt reference, or redefine Action/Event identity or
representation. Each Claim has exactly one `subject_reference`.

### 6.1 Subject-domain semantics and external-subject validity

`subject_domain` is optional field-specific semantic content. When present,
it MUST have exactly one authoritative source: inline `subject_domain` XOR
source-level `subject_domain_ref`. Both forms simultaneously are invalid. The
reference is source-level composition only; equal reference strings or
locations do not establish equality, a portable semantic-fragment identity, or
a generic `SubjectDomainID`.

Its semantic scope is exactly:

```text
SubjectDomain {
  identifier: FieldForm
  equality: canonical
}
```

The model describes meaning only. Exact canonical encoding for the bounded
portable subset is owned by the separately Approved Predicate Schema Canonical
Representation Profile v1.1. `subject_domain` defines identifier form,
required normalization, and equality. It MUST NOT define authority,
issuer semantics, trust, identity-provider behavior, resolution, registry
membership, namespace authority, resource semantics, provenance, delegation,
authentication, a generic identity model, or Root Authority.

An `ExternalSubjectReference` is semantically valid if and only if:

```text
subject_constraints permits ExternalSubjectReference
AND subject_domain is present
AND subject_domain resolves and normalizes successfully
AND identifier satisfies subject_domain
```

Claim Reference Semantics owns the legal external-reference shape. This
Semantic Contract owns whether a Predicate Schema permits and interprets that
shape. It does not define Claim-side byte representation.

The absence rules are normative:

```text
subject_domain absent + ExternalSubjectReference used
    => invalid

subject_domain present
    != ExternalSubjectReference required
```

When a Predicate Schema provides `subject_domain`, it MUST permit
`ExternalSubjectReference`; if explicit `subject_constraints` excludes that
form, the schema is semantically invalid. A schema may nevertheless permit
Action-content, Action-occurrence, or Event references as well; the presence
of `subject_domain` does not require every Claim to use the external form.
`subject_domain` applies only to external-subject interpretation; it MUST NOT
reinterpret existing Action/Event forms or their equality.

External-subject equality is canonical equality after the required
`subject_domain` normalization. It is not raw identifier-byte equality or
universal identifier equality. Fuzzy matching, alias registries, approximate
identity, network lookup, custom code, programmable normalization, and
case-folding not admitted by the applicable bounded FieldForm/profile behavior
are not equality semantics.

Across predicates, `ExternalSubjectReference` values are comparable only when
the relevant subject-domain semantics resolve, normalize, and have identical
canonical semantic content. Identical identifier bytes, identical source
reference strings or locations, or the same publisher, name, or version alone
are insufficient. Different subject-domain semantics imply no equality by
default. This rule does not introduce arbitrary logical or mathematical
equivalence between domains.

If a governed policy needs to relate identifiers from different domains, that
relationship remains an ordinary verified Claim under its own Predicate Schema;
this contract introduces no `IdentityLink` or identity-graph primitive.

External-subject interpretation MUST fail closed when `subject_domain` is
required but absent, its referenced semantics are unavailable or cyclic, a
semantic requirement is unsupported, the identifier is malformed or has an
unsupported form, required equality or normalization cannot be implemented
under the portable profile, or the subject-reference form is unknown.
Offline-provisioned subject-domain content is sufficient; no network resolver
is required.

### 6.2 Backward compatibility

Every v1.0-valid Predicate Schema remains semantically valid under this v1.1
revision when it does not use `subject_domain` or
`ExternalSubjectReference`. Issuer-domain, value, time, and the three existing
Action/Event subject-form semantics are unchanged. The v1.0 dimensionless-unit
rule, all v1.0 unit/CAD boundaries, and all other v1.0 exclusions remain in
effect. The v1.1 revision adds no interpretation to those schemas and changes
no v1.0 canonicalization outcome.

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
    -> subject_domain? exactly one inline or source-level reference form
       (absence: ExternalSubjectReference is invalid)
    -> subject_constraints? (absence: no additional restriction)
    -> time_semantics? exactly one inline or reference form (absence: both Claim time fields forbidden)

Field-specific semantic content
    -> issuer, value, and time semantics may reuse immutable semantic-content identity
    -> subject-domain semantics may use source-level composition only
```

Fully inline schemas may duplicate issuer-domain semantics but cannot explicitly state a shared content identity for cross-predicate equality. Fully composed schemas add unnecessary indirection for every field. Field-specific content identity provides the needed reuse without elevating a fragment into a named architectural abstraction.

Field-specific semantic content MAY be reused by immutable semantic-content identity without becoming a separate architectural abstraction. This specification defines no generic `semantic_contract_ref`, `Value Contract`, `Time Domain Contract`, or `SemanticContract`. An optional shared value, time, or structure component MAY be used only through a field-specific immutable reference whose role is clear from the Predicate Schema.

`subject_domain_ref` is narrower: it is source-level composition and its
string or location has no cross-predicate equality significance. An external
subject comparison depends only on resolved and normalized subject-domain
semantic content. This does not create an `IdentifierDomain` generic
primitive, `SubjectDomainID`, a semantic-fragment identifier, or a generic
reference/escape-hatch abstraction.

## 8. Reference resolution, normalization, and semantic-content identity

An inline semantic fragment `F` and a field-specific reference that resolves
to canonical semantic fragment `F` are semantically equivalent. This includes
source-level `subject_domain_ref` after successful resolution; the reference
text is not a portable semantic-fragment identity. The inline and reference
forms are alternative authoritative sources for the same field; a Predicate
Schema MUST NOT contain both forms for that field unless a future governed rule
defines deterministic equivalence for their simultaneous use.

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

This is a semantic identity rule. For the bounded portable subset, the
Approved Predicate Schema Canonical Representation Profile v1.1 defines
canonical byte representation and Approved DIGEST-001 v0.2 defines Predicate
Schema content identity. This Semantic Contract defines neither construction.

Two field-specific references `D1` and `D2` are interchangeable only when both resolve to identical canonical semantic content. Mere logical or mathematical equivalence is insufficient. Predicate identity follows governed canonical semantic specification content, not unrestricted equivalence inference; this specification introduces no theorem proving.

If a required field-specific reference cannot be resolved, supported, and validated, semantic interpretation is unavailable. Implementations MUST NOT partially normalize, fall back, or guess.

The following contribute to normalized Predicate Schema semantic content identity when applicable:

- normalized issuer-domain semantics, including its normalization and equality rules;
- normalized value semantics, including numeric, null-like, and structured-value rules;
- normalized subject-domain semantics, including identifier form, normalization, and equality;
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

1. `issuer_domain` and `value_semantics` each have exactly one authoritative source, and any present `subject_domain` and `time_semantics` each have exactly one authoritative source;
2. every required transitive semantic dependency is available and supported;
3. its referenced semantic dependency graph is finite and acyclic where recursive content identities depend on one another;
4. issuer, value, comparison, subject, and time declarations do not contradict one another; and
5. every semantic construct it uses is understood by the implementation.

The graph of referenced semantic dependencies MUST be finite and acyclic where
recursive content identities depend on one another, because cycles prevent
practical recursive construction of those identities. This is a content-identity
and representation prerequisite, not an independent Claim semantic concept. An
implementation MUST NOT attempt fixed-point interpretation or invent graph
machinery to repair a cycle.

If any required Predicate Schema or transitive issuer-domain, subject-domain,
time, value, or other semantic-composition dependency is unavailable,
unsupported, or invalid, semantic interpretation is unavailable. An
implementation MUST NOT partially interpret the Claim, guess missing
semantics, or fall back to aliases, discovery metadata, network resolution, or
mutable external context.

An unsupported semantic feature MUST fail closed unless it is explicitly identified as non-semantic metadata. This specification creates no larger universal error taxonomy.

When `comparison` is present, its map MUST be closed, its `domain` MUST be a
valid finite FieldForm, and `ordered` MUST be a boolean. An unknown comparison
member, absent required member, opaque identifier or reference, unsupported
capability value, or comparison material outside `value_semantics` is invalid.
If `ordered` is true, the normalized comparison-relevant value form MUST be
IntegerForm; every other form is invalid at schema admission.

## 10. Extensibility and authority boundaries

This specification rejects an open-ended semantic `extensions` map. A new semantic rule, domain, or constraint changes Predicate Schema semantic content and therefore produces a new predicate identity. Non-semantic tooling metadata MAY evolve without changing predicate identity when it remains outside the canonical semantic-content boundary.

Predicate Schema defines what a Claim body means. It MUST NOT define:

- authorization logic, Rule expressions, policy, threshold decisions, issuer ranking, Claim selection, conflict resolution, or Rule evaluation;
- signature suites, verifier or key mapping, trusted issuers, revocation, or verification profiles; or
- Action semantics, Action digest, Action occurrence identity, Event semantics, or Event identity.

Comparison semantics MUST NOT define trust, issuer recognition, Rule
applicability, execution authorization, arithmetic, conversion, a universal
Quantity/Money/Currency/Unit ontology, a ValueDomain object, or a semantic
registry, namespace, resolver, or fragment identity.

`issuer_domain` and `subject_domain` remain distinct field-specific semantics:
the former interprets the Claim issuer and the latter interprets an external
Claim subject. `subject_domain` MUST NOT become an Entity model, universal
subject object, `EntityReference`, identity provider, namespace authority,
registry, resolver, Root Authority, `IdentityLink` primitive, or generic
equivalence service.

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
profile remains unchanged and continues to define deterministic bytes only for
its bounded portable subset. The Approved v1.1 Canonical Representation
Profile and DIGEST-001 v0.2 separately define portable `subject_domain`, the
fourth permitted `subject_constraints` member, profile `h'02'`, and PSCID suite
`h'02'` for the coordinated v1.1 closure. The Approved v1.2 Canonical
Representation Profile defines deterministic bytes for the optional
`comparison` extension, and Approved DIGEST-001 v0.3 permanently binds that
closure to representation profile `h'03'` and PSCID suite `h'03'`.

## 12. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Claim meaning and comparison preconditions are explicit, inspectable, fail closed, and remain separate from authority. |
| New primitive burden | Pass. Comparison content remains inside existing `value_semantics`; it creates no Quantity, Unit, ValueDomain, registry, or other primitive. |
| Removability | Removing the extension loses deterministic Q1–Q9 evaluation; removing a second grammar, duplicate equality/scale fields, ontology, registry, or conversion layer loses no required capability. |
| Twenty-year durability | Pass. Closed normalized structural equality does not depend on a publisher, registry, resolver, market source, or implementation language. |
| Independent implementability | Pass: implementations can validate locally, apply the exhaustive comparison-relevant classification, compare normalized structures, and fail closed. |
| Total conceptual complexity | Pass. One two-member inline map and a fixed FieldForm classification are smaller than Quantity + Money + Currency + Unit + conversion machinery. |

Predicate Schema remains a necessary non-primitive normative abstraction. It is not mere documentation metadata because implementations need it to interpret Claim bodies consistently. It is not a kernel primitive because it owns no independent execution, lifecycle, authorization, or authority semantics.

## 13. Governance and normative home

| Governance question | Result |
|---|---|
| New primitive? | No. |
| New Claim field? | No. |
| New normative abstractions? | No. Predicate Schema remains the existing non-primitive normative abstraction; reused field semantics are not separate architectural abstractions. |
| RFC required? | Complete. Accepted RFC-010 and ADR-010 authorize the v1.2 comparison semantics. |
| Approved-specification revision required? | Complete through this coordinated v1.2 approval. |
| Correct normative home? | This standalone Approved Predicate Schema Semantic Contract v1.2. |

## 14. Future evolution

The coordinated v1.1 representation profile, profile code, PSCID suite, and
conformance vectors remain Approved and unchanged. The v1.2 extension requires
a distinct representation profile because admission and canonical bytes gain
optional comparison content. Under RFC-008/ADR-008, representation profile
`h'03'` and PSCID suite `h'03'` are permanently assigned by the coordinated
v1.2 adoption. Schemas omitting `comparison` preserve their canonical bytes,
but identities remain suite-specific with no cross-suite aliasing. The work
remains separate from CEL mapping,
verification mechanics, trust policy, conversion, and a global registry.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.2 | 2026-09-02 | Status transitioned from Draft to Approved in the coordinated v1.2 adoption; representation profile `h'03'`, PSCID suite `h'03'`, DIGEST-001 v0.3, and v1.2 conformance vectors are approved separately in the same atomic closure. Existing v1.1 semantics and bytes remain unchanged when `comparison` is omitted. |
| 1.2 | 2026-09-01 | Draft candidate under Accepted RFC-010/ADR-010: adds optional inline structural `comparison` semantics inside `value_semantics`, exhaustive comparison-relevant FieldForm classification, equality/Integer-only ordered capability distinction, fail-closed cross-predicate invariant, and no profile or PSCID allocation. Approved v1.1 remains authoritative. |
| 1.1 | 2026-08-30 | Approved coordinated v1.1 revision under Accepted RFC-007/ADR-007 and RFC-008/ADR-008: adds optional `subject_domain`, four-form subject constraints, external-subject validity, and contextual cross-predicate comparability; profile `h'02'`, PSCID suite `h'02'`, and the v1.1 canonicalization conformance vectors are approved separately in the same governed closure. Claim Reference Semantics v0.2 remains Draft. |
| 1.0 | 2026-08-28 | Approved machine-behavior freeze for Predicate Schema source composition, reference resolution, normalization, and fail-closed semantics used by canonicalization v1.0. |
| 0.1 | 2026-08-28 | Initial Draft defining minimum Predicate Schema semantic content and field-specific immutable composition. |
