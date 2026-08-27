---
id: VE-CLAIM-REFERENCE-SEMANTICS
title: Canonical Claim Reference Semantics
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Specification
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-27
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

This document reuses the Approved VE-001 distinction between Action content
identity and Action occurrence identity. It relies on Draft VE-002 only for
the semantic role of an immutable, globally unique `event_id`. It does not
claim final portable Event-reference conformance until the relevant Event and
encoding work is finalized.

RFC-005 remains Draft and is not a normative dependency of this document.

## 1. Purpose

This specification defines the minimum interoperable semantics of
`Claim.body.subject_reference`.

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
subject_reference :=
  ActionContentReference { action_digest }
  | ActionOccurrenceReference { action_id, action_digest }
  | EventReference { event_id }
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

## 5. Closed-union constraints and discrimination

The union is closed. This version explicitly rejects these subject forms:

- `ClaimReference`
- `ReceiptReference`
- `RuleReference`
- `TrustContextReference`
- `GenericReference`
- an arbitrary future VE-object subject

A future subject type requires governed specification revision. Implementations
MUST accept only the three defined semantic subject-reference forms. An unknown
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
three semantic alternatives, that tag is representation machinery. It MUST
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

These requirements allow independent implementations to agree about whether
two Claims concern the same Action content, the same Action occurrence, or the
same Event without defining a universal object-reference format.

## 7. Invalid forms

The following conceptual subject forms are invalid for this version and MUST
be rejected:

| Invalid semantic form | Reason |
|---|---|
| `ActionOccurrenceReference { action_id }` | An occurrence is not bound to its Action content. |
| A form combining `action_digest` and `event_id` | It combines distinct union-member semantics. |
| `EventReference` with `event_digest` semantics | `event_digest` is not a defined Event-reference semantic. |
| A `reference_kind` with an arbitrary payload | A generic reference ontology is rejected. |
| A Receipt subject | Receipt subjects are not legal in this version. |

An implementation MUST NOT repair, guess, or coerce an invalid value into a
different union member. A future representation profile defines how those
semantic errors are detected in a serialized value.

## 8. RFC-005 and representation boundary

This specification owns:

- which Claim subject-reference forms are legal;
- the semantic meaning of each legal form;
- the Action-content versus Action-occurrence distinction; and
- Event-reference semantics.

RFC-005 and later representation work may, if accepted, own portable
content-reference encoding, digest-reference representation, and
object-reference transport or serialization machinery.

This specification MUST NOT depend normatively on unaccepted RFC-005
conclusions. In particular, it does not select an `ObjectReference` wire
format, object-type registry, representation profile, digest suite, or
serialization profile.

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
reference, Action-occurrence reference, and Event reference for one another.
Implementations MUST reject ambiguous and unknown forms rather than silently
coerce them.

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

## 13. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The model preserves explicit, inspectable meaning without conflating assertion and history. |
| New primitive burden | Pass. The three forms are field-level Claim semantics, not primitives or VE objects. |
| Removability | Pass. Removing the union or either Action identity component reintroduces ambiguity; removing a generic wrapper loses nothing. |
| Twenty-year durability | Pass. Closed forms allow governed extension without prematurely creating a universal ontology. |
| Independent implementability | Pass. Exact forms and equality rules let independent implementations determine the same legal subject and reference equality. |
| Total conceptual complexity | Pass. The model retains only three validated forms and excludes generic references, attempt identity, and extra digest fields. |

**Result: A. PURE SPECIFICATION DETAIL — NO RFC REQUIRED.**

This candidate does not revise Approved VE-001: it applies VE-001's existing
identity semantics to a new Claim specification. It also does not amend
accepted ADR-VERIFY-002. If later drafting demonstrates a change to an
Approved specification, normal governance requires an RFC, ADR, version
increment, and changelog entry before that change can be adopted.

## 14. Next artifact

The single next candidate artifact is **Verified-Claim-to-Rule/Evaluate Input
Mapping Semantics**. It should specify deterministic projection of already
established Claim values into Rule/Evaluate inputs without changing Claim
subject-reference, Verify/Trust Context authority, or existing approved
specifications.

## Revision history

| Date | Change |
|---|---|
| 2026-08-27 | Initial Draft candidate specification. |
