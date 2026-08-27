---
id: PRESSURE-TEST-MINIMUM-CLAIM-SUBJECT-REFERENCE
title: Minimum Claim Subject Reference
version: "0.1"
status: Draft
document_type: Pressure Test
category: Kernel Analysis
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-27
depends_on: []
related_documents:
  - ARCHITECTURE-INDEX
  - VE-001
  - VE-002
  - RFC-005
  - PRESSURE-TEST-MINIMUM-CLAIM-STRUCTURE
  - PRESSURE-TEST-ATTEMPT-GROUPING-OWNERSHIP
supersedes: null
superseded_by: null
---

# Pressure Test — Minimum Claim Subject Reference

## Status and authority boundary

This is non-normative kernel-analysis evidence. It does not create a Claim
specification, reference primitive, RFC, ADR, Event model, Action model, or
ObjectReference profile. It does not change Approved VE-001, Draft VE-002,
or the Draft status of RFC-005.

`ARCHITECTURE_INDEX.md` classifies VE-001 as Approved, VE-002 as Draft,
RFC-005 as Draft, and pressure tests as non-normative evidence. The
structures below are therefore candidate field-level semantics for a future
Claim specification. They are not current wire format, protocol authority,
or a decision to accept RFC-005.

## Question

What is the absolute minimum canonical `subject_reference` model that lets a
Claim unambiguously refer to Action content, an Action occurrence, or an
individual Event—without creating a universal Reference ontology or
duplicating Draft RFC-005's ObjectReference work?

## Test notation

The following field names are conceptual. They define neither a new
canonical encoding nor identifier syntax.

```text
ActionContentReference
ActionOccurrenceReference
EventReference
```

They describe distinct legal Claim subjects, not new VE objects, primitives,
or independently hashable reference values.

## Attack 1 — Direct typed forms

Test a small, closed Claim-subject union:

```text
subject_reference := one of {
  ActionContentReference,
  ActionOccurrenceReference,
  EventReference
}
```

This directly answers the question "what does this Claim assert something
about?" without introducing:

```text
GenericReference
UniversalSubjectReference
reference_kind + arbitrary payload ontology
```

The three forms have different semantic jobs. Content identifies an exact
requested effect; occurrence identifies one historical Action carrying that
content; Event identifies one authoritative historical fact. Giving all
three the same open-ended wrapper does not add a shared semantic owner. It
only defers the decoding and validity rules that a Claim specification must
state explicitly.

**Result: direct closed forms preserve the required distinction with fewer
concepts.**

## Attack 2 — Action content reference

Approved VE-001 establishes the semantic role of:

```text
action_digest
```

as the deterministic cryptographic identity of exact semantic Action
content. It is the minimum semantic reference for a Claim that concerns the
requested effect rather than one historical submission of it.

```text
ActionContentReference := {
  action_digest
}
```

This test relies only on VE-001's content-identity semantics. It does not
silently treat Draft RFC-005 as accepted.

RFC-005, if later accepted, proposes a portable typed
`ObjectReference` encoding. That future representation may provide an
accepted portable content-bound reference form for `action_digest` or other
cryptographic objects. It does not change what a Claim is about, decide
which Claim subject types are legal, or replace this pressure test's
content-versus-occurrence distinction.

**Result: currently established Action-content identity is sufficient for
the minimum semantic form; RFC-005 is not blocking.**

## Attack 3 — Action occurrence reference

Approved VE-001 requires an authoritative artifact whose meaning depends on
a particular Action occurrence carrying particular content to bind:

```text
action_id + action_digest
```

The same pair is both necessary and sufficient for the minimum
occurrence-specific Claim subject:

```text
ActionOccurrenceReference := {
  action_id,
  action_digest
}
```

`action_id` selects the historical occurrence. `action_digest` binds that
occurrence to its exact semantic content. A content digest alone cannot
differentiate two independently requested Actions with the same effect;
an occurrence identifier alone does not preserve the content binding that
VE-001 requires for an occurrence-dependent authoritative artifact.

This is not execution-attempt identity. One Action occurrence may have
multiple operational attempts. Attempt grouping is not a universal protocol
semantic, and a Claim needing an authoritative historical anchor can use an
individual Event reference instead. This form neither introduces nor implies
an `attempt_id`, `attempt_reference`, or `ExecutionAttempt` object.

**Result: the two-field occurrence form survives the removability test.**

## Attack 4 — Event reference

Draft VE-002 assigns every Event a globally unique immutable:

```text
event_id
```

and assigns each Event to exactly one Action. For a Claim concerning one
individual authoritative Event, the minimum reference is therefore:

```text
EventReference := {
  event_id
}
```

Adding the Action pair to every Event reference duplicates information that
the referenced Event already owns. A verifier may retrieve or inspect that
association where needed. Adding attempt or Event-grouping fields would add
an interpretation not required to identify one Event.

VE-002 remains Draft, so its exact portable Event-reference encoding must
be specified by the relevant future normative work. That Draft status does
not show that a generic Claim reference wrapper or RFC-005 decision is
needed to determine the minimum semantic form.

**Result: `event_id` is sufficient for an individual Event subject; no
attempt or grouping semantics are added.**

## Attack 5 — One field or open generic wrapper

Compare two models:

```text
Model G
  subject_reference: GenericReference

Model U
  subject_reference: one of {
    ActionContentReference,
    ActionOccurrenceReference,
    EventReference
  }
```

Model G still has to define the legal target kinds, their field structures,
and their semantic interpretation. If it permits arbitrary target kinds, a
Claim consumer cannot know whether an unknown value names content,
occurrence, Event, Receipt, or an implementation-local object. If it closes
the permitted kinds, it is merely Model U with an unnecessary wrapper.

Model U gives independent implementations an exhaustive, reviewable set of
legal subjects and rejects all other shapes. The union is contained by the
Claim specification; it is not a repository-wide object-reference ontology.

**Result: one Claim field with a closed typed union is smaller and more
deterministic than a generic reference wrapper.**

## Attack 6 — Extensibility

Current scenarios do not require Claims to subject arbitrary future VE
objects such as another Claim, a Receipt, a Rule, or a Trust Context object.
Adding these forms now would turn a narrow Claim-subject decision into a
premature universal ontology.

If a future scenario demonstrates one of those needs, it can propose a new
closed union member through normal specification governance, including its
identity, authority boundary, and compatibility rules. Until then, unknown
subject shapes MUST be rejected by the future Claim-profile contract rather
than interpreted as an arbitrary reference.

**Result: arbitrary future subject types should not be supported now.**

## Attack 7 — ObjectReference interaction

Draft RFC-005 contributes a candidate representation-layer structure:

```text
ObjectReference := {
  object_type,
  representation_profile,
  digest_reference
}
```

If accepted, that structure can standardize portable typed,
content-bound references for applicable cryptographic objects. It remains an
embedded representation structure, not a new VE object or Claim semantic.

Claim semantics still own:

- which subject forms are legal for Claims;
- the distinction between Action content and Action occurrence;
- the `action_id + action_digest` structure for an occurrence-specific
  assertion; and
- what a Claim asserts about the referenced subject.

RFC-005 and VE-007 representation work must not absorb those Claim
responsibilities. Conversely, Claim Subject Reference Semantics need not
select object-type registries, representation profiles, digest suites, or
the canonical ObjectReference wire encoding.

**Result: Draft RFC-005 is an optional future encoding alignment, not a
blocker for the subject union.**

## Attack 8 — `reference_kind`

The closed forms are self-describing when their canonical record shapes are
strictly decoded:

| Subject form | Required field set |
|---|---|
| `ActionContentReference` | `action_digest` |
| `ActionOccurrenceReference` | `action_id`, `action_digest` |
| `EventReference` | `event_id` |

A decoder can determine the member by the exact accepted field set and MUST
reject unknown, missing, or mixed fields. `action_digest` and `event_id` are
named fields with distinct semantic roles; an Action occurrence has the
only two-field shape. No additional `reference_kind` adds information in
this closed union.

If a future canonical encoding does not preserve distinct closed record
shapes, that encoding may need a minimal union tag. That is an encoding
constraint, not evidence for a universal `reference_kind` ontology. The
current minimum semantic model therefore rejects `reference_kind`.

**Result: `reference_kind` is not required.**

## Attack 9 — Removability

Remove each candidate element:

| Removed element | What fails | Disposition |
|---|---|---|
| `action_digest` from content reference | The exact semantic Action content is no longer identified. | Required. |
| `action_id` from occurrence reference | Same content can be confused across historical Action occurrences. | Required. |
| `action_digest` from occurrence reference | The occurrence-dependent Claim loses VE-001's content binding. | Required. |
| `event_id` from Event reference | No individual authoritative Event is identified. | Required. |
| closed union boundary | Consumers cannot determine which forms are legal. | Required. |
| `GenericReference` wrapper | No tested semantic behavior is lost. | Rejected. |
| `reference_kind` | No tested semantic behavior is lost with strict record shapes. | Rejected. |
| arbitrary subject types | No current scenario fails. | Rejected for now. |
| attempt/grouping member | No individual Event reference needs it. | Rejected. |

Two implementations using the closed shapes can determine exactly whether a
Claim concerns Action content, an Action occurrence, or one Event. No
additional object ontology, wrapper, or attempt semantics survives this
test.

## Minimum candidate model

```text
Claim.subject_reference := one of {
  ActionContentReference {
    action_digest
  },

  ActionOccurrenceReference {
    action_id,
    action_digest
  },

  EventReference {
    event_id
  }
}
```

This is a closed union owned by future Claim semantics. It is not a generic
reference type, a new primitive, or the portable encoding selected by
RFC-005. A future canonical encoding must enforce the indicated closed
shapes and reject ambiguity; it may align its content-bound representation
with an accepted successor to RFC-005 without changing the legal subject
forms.

## Result and next step

No new primitive or architectural gap is demonstrated. An RFC is not
required for this pressure-test result. Normative adoption must follow
normal governance if it changes an Approved specification.

**Canonical Claim Reference Semantics is ready to draft** as the next
candidate specification artifact. Its initial scope should define these
three subject forms, their field-level constraints, Action-content versus
Action-occurrence meaning, Event-reference behavior, exact union decoding,
and compatibility with any future accepted representation profile. It must
not introduce generic references, attempt identity, or arbitrary subject
ontology.

## Revision history

| Date | Change |
|---|---|
| 2026-08-27 | Initial non-normative pressure test. |

## Verdict

**A. CLOSED TYPED SUBJECT UNION SUFFICIENT**
