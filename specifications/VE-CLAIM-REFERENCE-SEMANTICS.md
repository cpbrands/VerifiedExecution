---
id: VE-CLAIM-REFERENCE-SEMANTICS
title: Canonical Claim Reference Semantics
version: "0.2"
status: Draft
document_type: Candidate Specification
category: Specification
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-29
depends_on:
  - VE-001
  - VE-002
  - ADR-VERIFY-002
related_documents:
  - RFC-005
  - PRESSURE-TEST-MINIMUM-CLAIM-STRUCTURE
  - PRESSURE-TEST-MINIMUM-CLAIM-SUBJECT-REFERENCE
  - PRESSURE-TEST-ATTEMPT-BINDING-VIA-EVENT-HISTORY
  - PRESSURE-TEST-ATTEMPT-GROUPING-OWNERSHIP
supersedes: null
superseded_by: null
---

# Canonical Claim Reference Semantics

## Status and authority boundary

This is a Draft candidate specification. Its normative requirements describe
the candidate contract for a future Claim specification; they do not amend an
Approved specification or approve any Draft RFC.

Accepted RFC-007 and ADR-007 authorize the architectural addition in this
Draft v0.2: a fourth, closed external subject form. They do not make this
Draft specification Approved or perform the separate governed vNext
specification revisions needed for portable representation conformance.

This document reuses the Approved VE-001 distinction between Action content
identity and Action occurrence identity. It relies on Draft VE-002 only for
the semantic role of an immutable, globally unique `event_id`. It does not
claim final portable Event-reference conformance until the relevant Event and
encoding work is finalized.

RFC-005 remains Draft and is not a normative dependency of this document.

## 1. Purpose

This specification defines the minimum interoperable semantics of
`Claim.body.subject_reference`, including an external identifier when the
applicable Predicate Schema supplies its semantic domain.

Its purpose is to let independent implementations determine what a Claim is
about without creating a universal reference ontology, a new VE primitive, or
a generic attempt concept.

This specification defines subject-reference meaning. It does not define
canonical byte encoding, identity registries, verification artifacts, Trust
Context, Rule/Evaluate input projection, or complete Claim-body semantics.

## 2. Terminology

**Claim**

An assertion. A Claim is not authoritative execution history.

**Subject reference**

The `Claim.body` value that identifies what a Claim concerns.

**Action content**

The exact semantic content identified by VE-001 `action_digest`.

**Action occurrence**

One historical Action instance identified by VE-001 `action_id` and bound to
its semantic content by `action_digest`.

**Event**

One authoritative historical fact under VE-002. An Event is not a Claim.

**External subject**

A Claim subject identified by `ExternalSubjectReference.identifier`. VE does
not assign that identifier a universal or globally defined meaning. Its form,
normalization, and equality are contextual semantics supplied by the
applicable Predicate Schema `subject_domain`.

**Execution attempt**

An operational interpretation that may occur under an Action occurrence. It
is not identified or modeled by this specification.

## 3. Claim boundary

The Claim shape established by ADR-VERIFY-002 remains:

```text
Claim {
  body,
  verification {
    profile,
    artifact
  }
}
```

`subject_reference` belongs within `Claim.body`. This specification neither
redefines `verification` nor permits verification material to alter the
semantic subject of a Claim.

This specification does not define the complete Claim body. In particular,
it does not define Claim predicate, value, issuer, or timestamp fields beyond
the boundaries stated below.

## 4. Normative subject model

A conforming `Claim.body.subject_reference` MUST be exactly one member of the
following closed union:

```text
Claim.subject_reference :=
  ActionContentReference { action_digest }
  | ActionOccurrenceReference { action_id, action_digest }
  | EventReference { event_id }
  | ExternalSubjectReference { identifier }
```

No member is a new VE object, primitive, or independently hashable reference
value. These are legal Claim-subject forms only.

### 4.1 ActionContentReference

```text
ActionContentReference {
  action_digest
}
```

An `ActionContentReference` MUST refer to the exact semantic Action content
identified by `action_digest` under VE-001.

It MUST NOT identify an Action occurrence. It MUST NOT identify an execution
attempt. Two separately submitted Action occurrences MAY have the same
`action_digest`; an `ActionContentReference` deliberately does not distinguish
them.

### 4.2 ActionOccurrenceReference

```text
ActionOccurrenceReference {
  action_id,
  action_digest
}
```

An `ActionOccurrenceReference` MUST identify one Action occurrence and MUST
bind that occurrence to its exact semantic Action content. `action_id` selects
the historical occurrence; `action_digest` carries the VE-001 content binding.

This form MUST NOT be interpreted as an execution-attempt identity. Multiple
operational attempts MAY occur under one Action occurrence. Attempt-local
interpretation, including profile-specific attempt grouping where needed, is
outside Claim reference semantics.

### 4.3 EventReference

```text
EventReference {
  event_id
}
```

An `EventReference` MUST refer to one authoritative Event through the
immutable, globally unique `event_id` semantics defined by VE-002.

`EventReference` MUST NOT add `event_digest`. It MUST NOT imply attempt
grouping. A Claim that references an Event remains an assertion about that
Event; it MUST NOT thereby become authoritative history.

```text
Claim = assertion
Event = authoritative history
```

### 4.4 ExternalSubjectReference

```text
ExternalSubjectReference {
  identifier
}
```

`ExternalSubjectReference` is the fourth closed Claim-subject form. Its
semantic structure contains `identifier` only. It is not an `Entity`, an
identity-provider record, a generic reference wrapper, or a VE object.

An `ExternalSubjectReference` is usable if and only if all of the following
are true:

1. the applicable Predicate Schema `subject_constraints` permits
   `ExternalSubjectReference`;
2. the applicable Predicate Schema supplies a present, resolved, and supported
   `subject_domain`; and
3. `identifier` satisfies that `subject_domain`.

This specification defines the legal form and this contextual dependency.
The applicable Predicate Schema defines `subject_constraints` and
`subject_domain`. `subject_domain` supplies only identifier form,
normalization, and equality. This specification does not define Predicate
Schema internals, representation, canonicalization, or resolution mechanics.

`subject_domain` applies to interpretation of `ExternalSubjectReference` only;
its presence does not require use of that form. An external subject reference
MUST fail closed if its required `subject_domain` semantics are unavailable,
unresolved, unsupported, or inapplicable. Offline-provisioned semantic
material is sufficient; network resolution is never required by this
specification.

### 4.5 Explicit exclusions

The fourth form does not introduce `reference_kind`, `EntityReference`, an
`Entity` model, global entity identity, a global identifier namespace,
namespace authority, identity provider, registry, resolver, DID requirement,
certificate-subject requirement, key identity, or a Root Authority role.

It also does not introduce a generic `ContentIdentity`, `DigestRef`, or
`HashRef`; a portable semantic-fragment identifier; an `IdentityLink`
primitive; an Observation Claim subtype; or a resource-defined identity
ontology. It does not make subject identity semantics authority to issue
Claims. If identifiers from different authorities need to be bridged, that
bridge remains an ordinary verified Claim rather than an identity-graph
primitive.

## 5. Closed-union constraints and discrimination

The union is closed. This version explicitly rejects these subject forms:

- `ClaimReference`
- `ReceiptReference`
- `RuleReference`
- `TrustContextReference`
- `GenericReference`
- an arbitrary future VE-object subject
- an `EntityReference` or other entity-model subject
- an open-ended extension-tag subject

A future subject type requires governed specification revision. Implementations
MUST accept only the four defined semantic subject-reference forms. An unknown
semantic form is invalid and MUST NOT be interpreted as a generic reference.

Semantic discrimination is by the legal union member. A separate semantic
`reference_kind` member is rejected because the union member already supplies
the subject-reference meaning; adding it does not create a fourth legal form
or a generic reference ontology.

This specification defines no serialized record shape. The semantic model
requires the values stated for each union member, but it does not define exact
encoded map fields, byte-level or map-level extra-field rejection, structural
decoding, canonical encoding tags, or discriminator encoding.

The semantic and representation responsibilities are therefore separate:

| Responsibility | Owner |
|---|---|
| Legal union members, meaning, equality, and invalid semantic forms | This specification |
| Exact field encoding, encoded-field rejection, tags/discriminators if required, and structural decoding rules | A future canonical representation/profile specification |

If a future representation profile needs an encoding tag to preserve the
four semantic alternatives, that tag is representation machinery. It MUST
NOT broaden the legal subject forms or create a generic reference ontology.

## 6. Identity and conformance requirements

This specification defines semantic equality of subject references, not their
canonical byte representation.

A conforming implementation MUST apply these rules:

1. Two valid `ActionContentReference` values refer to the same Action content
   only when their `action_digest` values are equal under VE-001 content
   identity semantics.
2. Two valid `ActionOccurrenceReference` values refer to the same Action
   occurrence only when both `action_id` and `action_digest` are equal. A
   matching `action_digest` alone MUST NOT be treated as occurrence identity.
3. Two valid `EventReference` values refer to the same Event only when their
   `event_id` values are equal under VE-002 Event identity semantics.
4. References from different union members MUST NOT be treated as equal merely
   because an implementation can resolve them to related repository objects.
5. A conforming implementation MUST validate a subject-reference value against
   exactly one legal union member before relying on it for Claim semantics.
6. This specification MUST NOT be used to infer an Action occurrence from
   Action content, infer an execution attempt from an Action occurrence, or
   infer Event membership from ordering alone.
7. `ExternalSubjectReference.identifier` equality is contextual. It MUST NOT
   be determined by raw identifier-byte equality or treated as universal or
   global identifier equality.
8. Two valid `ExternalSubjectReference` values may be treated as equal only
   when the applicable resolved and supported `subject_domain` semantics
   normalize and compare their identifiers as equal.
9. Across predicates, external subjects are comparable only when the relevant
   `subject_domain` semantics resolve, normalize, and have identical canonical
   semantic content. Identical identifier bytes under different subject
   domains MUST NOT imply equality.
10. If the required `subject_domain` form, normalization, or equality semantics
    are unavailable or unsupported, external-subject equality is unavailable
    and the implementation MUST fail closed. This specification introduces no
    identifier-equivalence mechanism.

These requirements allow independent implementations to agree about whether
two Claims concern the same Action content, the same Action occurrence, or the
same Event, or comparable external subjects under their applicable
`subject_domain`, without defining a universal object-reference format.

## 7. Invalid forms

The following conceptual subject forms are invalid for this version and MUST
be rejected:

| Invalid semantic form | Reason |
|---|---|
| `ActionOccurrenceReference { action_id }` | An occurrence is not bound to its Action content. |
| A form combining `action_digest` and `event_id` | It combines distinct union-member semantics. |
| `EventReference` with `event_digest` semantics | `event_digest` is not a defined Event-reference semantic. |
| `ExternalSubjectReference` without an applicable permitted, resolved, supported `subject_domain` | External identifier interpretation is unavailable. |
| `ExternalSubjectReference` whose identifier is malformed or unsupported for its `subject_domain` | The identifier fails its applicable semantic domain. |
| An external reference carrying a domain or identity-model object | `subject_domain` belongs to the applicable Predicate Schema; generic identity objects are rejected. |
| A `reference_kind` with an arbitrary payload | A generic reference ontology is rejected. |
| A Receipt subject | Receipt subjects are not legal in this version. |

An implementation MUST NOT repair, guess, or coerce an invalid value into a
different union member. A future representation profile defines how those
semantic errors are detected in a serialized value.

## 8. RFC-005 and representation boundary

This specification owns:

- which Claim subject-reference forms are legal;
- the semantic meaning of each legal form;
- the Action-content versus Action-occurrence distinction;
- Event-reference semantics; and
- the contextual external-subject dependency.

RFC-005 and later representation work may, if accepted, own portable
content-reference encoding, digest-reference representation, and
object-reference transport or serialization machinery.

This specification MUST NOT depend normatively on unaccepted RFC-005
conclusions. In particular, it does not select an `ObjectReference` wire
format, object-type registry, representation profile, digest suite, or
serialization profile.

RFC-007 and ADR-007 are Accepted architectural authority for the fourth
closed form. They do not supply a generic reference encoding, a portable
semantic-fragment identity, or a new representation profile in this Draft.

## 9. Issuer and timestamp boundaries

`issuer_ref` is separate Claim-body semantics. A subject reference identifies
what the Claim concerns; an issuer identifies who semantically issued the
Claim. Neither field identifies the signer, a verification key, a DID, a
certificate subject, or a VE-managed identity system.

`assertion_time` and `observation_time`, if a future Claim-body specification
defines them, are separate Claim-body concerns. This specification assigns no
timestamp semantics and does not require either field for subject-reference
validity.

## 10. Attempt, history, and Rule/Evaluate boundaries

This specification introduces no `attempt_id`, `AttemptReference`,
`ExecutionAttempt` primitive, or generic attempt grouping relation.
Profile-specific attempt grouping, where a domain needs it, remains outside
this specification.

This specification ends at `Claim.body.subject_reference`. It does not define
projection of verified Claims into Rule/Evaluate inputs. That is separate
specification work. It also does not redefine Event/Lifecycle history or
Receipt semantics.

## 11. Security considerations

The closed union prevents accidental substitution of an Action-content
reference, Action-occurrence reference, Event reference, and external subject
reference for one another. Implementations MUST reject ambiguous and unknown
forms rather than silently coerce them. They MUST likewise reject an external
identifier when its required domain semantics cannot be applied.

Subject-reference semantics do not establish a Claim's truth, authority, or
issuer acceptability. Those questions remain subject to Claim verification,
Trust Context, and Rule/Evaluate semantics. An `EventReference` identifies an
Event only under the applicable VE-002 authority; it does not independently
authenticate an Event or replace the relevant Event/encoding conformance
rules.

## 12. Future compatibility and open boundaries

Future governed revisions MAY add a new closed subject form only when a
validated need establishes its semantic owner, identity rules, compatibility
effects, and conformance behavior. Such a change MUST NOT be made by treating
an unknown reference as generic.

Final portable-conformance status for `EventReference` remains contingent on
the Draft Event and encoding work. That dependency does not block this
specification's semantic decision about the currently legal Claim subjects.

Portable representation conformance for `ExternalSubjectReference` likewise
requires the separate governed vNext Predicate Schema and representation work.
This Draft neither freezes that work nor allocates a representation-profile
code or PSCID suite.

## 13. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The model preserves explicit, inspectable meaning without conflating assertion and history. |
| New primitive burden | Pass. The four forms are field-level Claim semantics, not primitives or VE objects. |
| Removability | Pass. Removing the closed union, the external form, or either Action identity component reintroduces a validated ambiguity; removing a generic wrapper loses nothing. |
| Twenty-year durability | Pass. Closed forms allow governed extension without prematurely creating a universal ontology. |
| Independent implementability | Pass. Exact forms and equality rules let independent implementations determine the same legal subject and reference equality. |
| Total conceptual complexity | Pass. The model retains only four validated forms and excludes generic references, entity models, attempt identity, and extra digest fields. |

**Result: A. FIELD-LEVEL CLAIM REFERENCE EXTENSION UNDER ACCEPTED RFC-007 / ADR-007.**

This Draft v0.2 does not revise Approved VE-001: it preserves VE-001's
existing identity semantics and applies them in a Claim specification. It also
does not amend accepted ADR-VERIFY-002. Accepted RFC-007 and ADR-007 provide
the governance decision for the fourth form; later Approved-specification
revisions still require their own version increments, changelog changes,
canonicalization profile/code, PSCID suite, and conformance vectors.

## 14. Next artifact

The single next candidate artifact is **Verified-Claim-to-Rule/Evaluate Input
Mapping Semantics**. It should specify deterministic projection of already
established Claim values into Rule/Evaluate inputs without changing Claim
subject-reference, Verify/Trust Context authority, or existing approved
specifications.

## Revision history

| Date | Change |
|---|---|
| 2026-08-29 | Draft v0.2 under Accepted RFC-007 and ADR-007: added `ExternalSubjectReference { identifier }` as the fourth closed form; preserved Action-content, Action-occurrence, and Event forms; made external interpretation and equality contextual on the applicable Predicate Schema `subject_domain`. |
| 2026-08-27 | Initial Draft candidate specification. |
