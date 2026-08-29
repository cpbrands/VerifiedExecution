---
id: ADR-007
title: External Subject Reference Semantics
version: "0.1"
status: Proposed
document_type: Architectural Decision Record
category: Architecture
author: Verified Execution Editorial Board
created: 2026-08-29
updated: 2026-08-29
depends_on:
  - SPECIFICATION-GOVERNANCE
  - RFC-007
related_documents:
  - VE-CLAIM-REFERENCE-SEMANTICS
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
supersedes: null
superseded_by: null
---

# ADR-007 — External Subject Reference Semantics

## Status and authority boundary

**Status:** Proposed
**Related RFC:** RFC-007 — External Subject Reference Semantics
**Decision requested:** Whether to accept RFC-007's external-subject-reference
architecture.

This Proposed ADR is not authoritative and changes no Approved specification,
canonicalization profile, representation-profile code, or PSCID suite. In
particular, Predicate Schema Canonicalization v1.0,
`representation_profile = h'01'`, and PSCID-1 suite `h'01'` remain immutable.

## 1. Context

The evidence chain is:

```text
Autonomous Vendor Payment reference scenario
    -> current subject union cannot directly express Vendor/Human facts
    -> focused gap analysis: general external-subject capability required
    -> RFC-007
```

The current candidate Claim subject union supports Action content, Action
occurrence, and Event subjects. It cannot directly express a reusable Claim
such as `Vendor X is approved` or `Human H has delegated authority`.

Action-scoped derived Claims remain useful, but were found insufficient as a
general replacement: they must be reissued for each Action, obscure the
subject-level fact, and cannot directly compose reusable Claims about the same
external subject.

## 2. Decision question

Should VE extend the closed Claim subject-reference union with one opaque
external-subject form whose identifier semantics are governed by Predicate
Schema `subject_domain`, while preserving VE-defined Action/Event identities and
avoiding any universal Entity or identity system?

## 3. Decision options

| Option | Semantic correctness | Identity / Root Authority boundary | Portability, independent implementation, and offline operation | Predicate reuse | Conceptual complexity |
|---|---|---|---|---|---|
| A. Closed external form plus `subject_domain` | Satisfies reusable external-subject Claims and deterministic equality. | Preserves separation: subject semantics do not establish authority. | Deterministic from provisioned immutable semantic material. | Reusable when subject-domain semantic content is identical. | **Lowest viable.** One field form and field-specific semantics. |
| B. Keep Action/Event-only subjects | Fails for Vendor, Human, and other external facts. | Preserves boundaries but only by omitting needed capability. | Implementable, but insufficient. | Requires Action-derived duplication. | Lower surface area but higher total duplication and less semantic clarity. |
| C. Generic `EntityReference` / Entity model | Can represent subjects but overreaches the requirement. | Risks identity-provider and ontology creep. | Requires broad global identity semantics. | Broad, but without a demonstrated need. | Overbuilt. |
| D. Authority-scoped subject references | Conflates subject equality with issuer trust and authority. | Violates the intended Root Authority separation. | Requires authority-context behavior unrelated to subject identity. | Makes legitimate reuse harder. | Overbuilt. |
| E. Raw opaque bytes with raw-byte equality | Cannot express governed normalization or equality. | Does not itself change authority, but leaves identity semantics underdefined. | Different implementations can disagree about equivalent identifiers. | Unsafe across predicates. | Superficially small but insufficient. |

## 4. Proposed decision

**A. ACCEPT RFC-007 ARCHITECTURE.**

If this ADR is accepted, VE SHALL add exactly one future closed Claim
field/reference form:

```text
ExternalSubjectReference {
  identifier
}
```

It is Claim field/reference semantics, not a new VE architectural primitive,
object, or universal reference ontology.

This decision rejects:

- a generic Entity primitive or universal identity model;
- a VE identity-provider role, namespace authority, global registry, or global
  resolver;
- authority-scoped identity as the default external-subject form; and
- raw-byte-only identity semantics.

## 5. Closed-union and preservation decision

The future Claim subject-reference union remains closed:

```text
Claim.subject_reference :=
  ActionContentReference { action_digest }
  | ActionOccurrenceReference { action_id, action_digest }
  | EventReference { event_id }
  | ExternalSubjectReference { identifier }
```

`ActionContentReference`, `ActionOccurrenceReference`, and `EventReference`
retain their existing VE-defined identity semantics. `subject_domain` applies
only to `ExternalSubjectReference`; it MUST NOT redefine Action content, Action
occurrence, or Event identity.

An open reference ontology, generic `reference_kind` registry, URI-based
reference ontology, or Entity union is not adopted. Four explicit forms are the
lowest-complexity model that preserves deterministic semantics for the
demonstrated scenarios.

## 6. Subject-domain boundary and constraints

The applicable Predicate Schema supplies optional `subject_domain` semantics
only for the external form:

```text
subject_domain :=
  identifier form
  + normalization
  + equality
```

`subject_domain` MUST NOT define trust, authorization, verification,
delegation, ownership, personhood, provenance, revocation, registry membership,
namespace governance, or Root Authority.

The two Predicate Schema responsibilities remain distinct:

```text
subject_constraints
    = allowed subject-reference forms

subject_domain
    = interpretation and equality of ExternalSubjectReference.identifier
```

`subject_constraints` may permit the existing Action/Event forms alongside the
external form. It does not duplicate external identifier semantics.

Direct reuse of `issuer_domain` is rejected: it interprets a Claim issuer,
whereas `subject_domain` interprets a Claim subject. They are parallel
field-specific semantics, not interchangeable roles. This ADR introduces no
generic `IdentifierDomain` abstraction.

## 7. Equality, comparability, and bridging

Within one applicable subject domain, two external references are equal only
when their identifiers are equal after the exact domain-defined normalization.
Display names, unspecified URI equality, registry lookup, and
implementation-local normalization are insufficient.

Across predicates, two external subjects are comparable only when the
applicable subject-domain semantics resolve, normalize, and result in identical
canonical subject-domain semantic content. This ADR assumes no portable
semantic-fragment content identity.

Identifiers from different subject domains are **not equal by default**, even
when they might concern the same real-world subject. VE MUST NOT infer
universal identity. A future bridge between domains remains an ordinary
verified Claim governed by its Predicate Schema; this ADR does not introduce or
standardize `IdentityLink`, `EntityLink`, `SameAs`, or other bridging
primitive.

## 8. Absence and fail-closed behavior

The absence rule is:

```text
ExternalSubjectReference used + subject_domain absent
    => invalid

subject_domain present
    != ExternalSubjectReference mandatory
```

Existing Action/Event references remain legal whenever
`subject_constraints` permits them.

The following conditions make semantic interpretation unavailable and MUST fail
closed:

- a malformed external identifier;
- an unresolved subject-domain dependency;
- a cyclic subject-domain dependency;
- an unsupported subject-domain semantic rule; or
- unavailable required subject-domain semantics.

## 9. Reuse, Root Authority, and offline operation

Current VE architecture does not define a general portable content identity for
semantic fragments. Whole-field source-level semantic reuse may follow the
existing field-specific reuse pattern, but portable representation of reusable
subject-domain fragments, if required for future conformance, is separate
representation-level work.

This ADR does not introduce `SubjectDomainID`, `SemanticFragmentID`, generic
`ContentIdentity`, or generic `DigestRef`.

Subject identity semantics are distinct from authority to issue a Claim. The
resource-recognized Trust Context remains authoritative for issuer acceptance.
VE consumes that authority; it does not become Root Authority.

Independent implementations MUST be able to interpret and compare subjects
from provisioned immutable semantic material. The architecture requires no VE
registry, central identity service, publisher lookup, or online resolver.

## 10. Autonomous Vendor Payment replay

The decision permits these reusable subject-level Claims:

```text
Vendor X is approved
    -> ExternalSubjectReference(Vendor X identifier)

Human H has delegated authority
    -> ExternalSubjectReference(Human H identifier)
```

It preserves the occurrence-bound approval:

```text
Human approved this specific Action
    -> ActionOccurrenceReference { action_id, action_digest }
```

CAD/unit semantics remain outside this ADR. The decision does not make a
CAD-denominated payment limit portable under the current bounded Predicate
Schema profile.

External subjects remain opaque identifiers. No VE taxonomy is required for a
Human, Organization, Vendor, Bank Account, Device, AI Agent, cryptographic key,
digital asset, or medical record.

## 11. Consequences and Approved-spec impact

### Positive consequences

- Reusable Claims about external subjects become possible.
- Exact subject equality becomes Predicate-Schema-governed.
- Cross-predicate reuse becomes possible under identical subject-domain
  semantics.
- Existing Action/Event identity remains intact.
- VE gains neither an Entity taxonomy nor an identity-provider role.

### Costs and follow-on work

- `PREDICATE-SCHEMA-SEMANTIC-CONTRACT` v1.0 requires a future governed version
  revision to define `subject_domain` semantics.
- `PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE` v1.0 requires a future
  canonicalization generation to admit the fourth subject form and its
  representation.
- A new representation-profile code, a new PSCID suite, and conformance vectors
  are required.
- Portable representation of reusable subject-domain fragments may require
  future conformance work.

No other Approved specification is necessarily changed by this architectural
decision. `PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR` v1.0,
`ADR-ENC-001` / VE-CBOR-1 v0.1, and all Action/Event specifications remain
unchanged. A future revision to the field-semantic grammar is required only if
the future profile cannot express the adopted subject-domain semantics through
its governed closed grammar; this ADR does not decide that representation
question.

The Draft Claim Reference Semantics specification must be aligned through its
own governed revision before it can carry the fourth legal form. This ADR does
not silently promote that Draft or alter its current three-form union.

## 12. Canonicalization and PSCID immutability

Predicate Schema Canonicalization v1.0, `representation_profile = h'01'`, and
PSCID-1 suite `h'01'` remain immutable forever. This decision MUST NOT
reinterpret any existing Predicate Schema bytes or identity.

Adoption requires a new canonicalization/profile generation, a new
representation-profile code, and a new PSCID suite. Old Predicate Schemas and
PSCID-1 identities remain valid under their existing definitions.

## 13. Primitive test

`ExternalSubjectReference`, `subject_domain`, and `identifier` are not
architectural primitives. They are a closed Claim field/reference form and
field-specific Predicate Schema semantics. They do not create a runtime object,
an identity system, a new authority model, or a generic semantic abstraction.

## 14. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The architecture keeps Claims explicit and preserves external authority boundaries. |
| New primitive burden | Pass. The decision adds no primitive; it adds one closed field/reference form. |
| Removability / necessity | Pass. Removing the form recreates the demonstrated inability to express reusable Claims about non-Action/non-Event subjects. |
| Twenty-year durability | Pass. Opaque identifiers plus governed equality permit new subject classes without a VE ontology. |
| Independent implementability | Pass. Implementations can use provisioned immutable semantics and fail closed. |
| Total conceptual complexity reduction | Pass. One closed form removes Action-derived duplication without identity infrastructure. |

## 15. Governance and acceptance gates

This ADR is Proposed. It becomes authoritative only if accepted through normal
governance. Adoption requires:

1. acceptance of RFC-007 and this ADR;
2. affected Approved-specification revisions with version increments and
   changelog entries;
3. a new canonicalization/profile generation, representation-profile code, and
   PSCID suite; and
4. cross-language canonicalization and Claim-reference conformance vectors.

No Approved specification may be changed informally.

## 16. Decision summary

The proposed decision is **A. ACCEPT RFC-007 ARCHITECTURE**: one closed,
opaque external subject form, interpreted only by Predicate Schema
`subject_domain` semantics, is the minimum architecture that solves the
demonstrated external-subject gap while preserving VE's existing identity and
authority boundaries.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-29 | Initial Proposed ADR for RFC-007 external-subject-reference architecture. |
