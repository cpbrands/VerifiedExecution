---
id: PRESSURE-TEST-MINIMUM-CLAIM-STRUCTURE
title: Minimum Claim Structure
version: "0.1"
status: Draft
document_type: Pressure Test
category: Kernel Analysis
author: Verified Execution Editorial Board
created: 2026-08-25
updated: 2026-08-25
depends_on: []
related_documents:
  - ARCHITECTURE-INDEX
  - VE-001
  - PRESSURE-TEST-CLAIM-ACTION-VS-RULE-INPUT-SCOPE
supersedes: null
superseded_by: null
---

# Pressure Test — Minimum Claim Structure

## Status and authority boundary

This is non-normative kernel-analysis evidence. It does not create or
modify a Claim specification, Rule/Evaluate specification, RFC, ADR,
Action primitive, Event model, identity system, or authority model.

The reduced `Action / Claim / Rule / Verify / Evaluate` model remains
non-normative validation under `ARCHITECTURE_INDEX.md`. The candidate
structure below is a pressure-test result, not current protocol authority.
It does not override the Approved Action specification, Draft normative
documents, or the Draft status of RFC-005.

## Question

What is the minimum Claim structure that can bind an assertion either to
Action content or to a specific Action occurrence, while carrying only the
issuer, provenance, and time information needed for independent
verification—without turning Claim into a universal Event, identity, or
provenance container?

## Test model

For this test, a Claim is an assertion. Verification determines whether an
assertion is established in an applicable Trust Context. Rule/Evaluate may
then consume established Claims; Event/Lifecycle/Receipt retain their
separate roles in authoritative execution history and derived outcome
evidence.

The terms and structures in this document are conceptual. They do not
define a canonical serialization or a new primitive.

## 1. Subject/reference attack

One generic, typed `subject_reference` is sufficient for a Claim to state
what it is about. Its referent can be Action content, an Action occurrence,
another Claim, a Receipt, or another VE object. The field must preserve the
kind of subject so that a verifier does not confuse content with an
occurrence.

This does not require a new reference primitive merely because the two
Action forms have different contents. A single field can carry structurally
distinct reference values.

### Action content binding

A Claim about Action content—for example, an approval or a policy
assertion—can use a content reference that identifies the exact semantic
content, such as an `action_digest` or an accepted canonical equivalent.
The Claim is then about the requested effect, not one historical submission
of that effect.

### Action occurrence binding

A Claim about execution observation, result, or telemetry must distinguish
one accepted occurrence from another occurrence with the same semantic
content. The minimum occurrence-specific binding is:

```text
subject_reference = {
  kind: action-occurrence,
  action_id,
  action_digest
}
```

`action_id` selects the historical occurrence. `action_digest` binds the
assertion to the exact semantic content accepted for that occurrence.
Together they follow the Approved VE-001 distinction between occurrence
identity and content identity. Content identity alone cannot identify a
particular repeated execution request.

An interoperable future Claim specification may define a portable canonical
form for this value. That future field-level work is not a reason to create
a new execution or reference primitive here.

## 2. Issuer attack

Issuer is required Claim semantics, represented as an externally resolvable
`issuer_reference`. It is not merely signature or verification metadata.

Removing issuer from the Claim would make independently verified identical
assertion content ambiguous: separate issuers could assert the same
predicate and value, while a verifier could not express which assertion it
was evaluating. A signing key alone is insufficient because key material
may be delegated, rotated, or used on behalf of a distinct issuer. Trust,
delegation, revocation, and multi-issuer evaluation therefore need the
assertion's claimed issuer to be explicit; verification evidence determines
whether that issuer assertion is valid in the applicable Trust Context.

The reference does not make VE an identity provider. VE need not define a
person, organization, DID, account, certificate subject, or identity
registry. It need only preserve an external reference whose resolution and
trust meaning are governed outside the minimal Claim structure.

## 3. Provenance/source attack

Universal provenance or source is rejected from the core Claim. It is not
necessary to identify what was asserted, who asserted it, or the value of
the assertion.

Where source changes the asserted fact, it belongs in a domain-specific
predicate or value. Where it supports verification, it can be carried by
verification evidence, an additional Claim, or an appropriately typed
subject/object reference. A universal source field would turn every Claim
into an unbounded evidence container and would duplicate the role of
verification artifacts.

## 4. Time attack

The relevant times are not interchangeable.

| Time | Disposition | Reason |
|---|---|---|
| `assertion_time` | OPTIONAL | It is the time the issuer made the assertion. It may matter to validity, replay, or policy, but not every Claim requires it. |
| `observation_time` | OPTIONAL | It is a domain fact about when the observed condition occurred. It is distinct from assertion time and is required only when the applicable schema/profile makes it material. |
| `verification_time` | REJECTED FROM CORE CLAIM | It is a verifier-context fact: different verifiers may establish the same Claim at different times. |
| `event_time` | REJECTED FROM CORE CLAIM | It belongs to authoritative Event history, not to an assertion merely because that assertion may later support an Event decision. |

Neither optional Claim time can be collapsed into the other. An issuer can
assert today that a sensor observed an event yesterday. Conversely, an
assertion may be made immediately while the observed condition remains
time-unspecified because it is not material to the domain claim.

## 5. Predicate/value attack

`predicate` and `value` are the minimum assertion semantics. The predicate
states what is asserted about the subject; the value supplies the asserted
result in the schema-appropriate type.

A more general canonical statement wrapper has not been shown necessary by
the tested cases. Adding one would group the same subject, issuer,
predicate, value, and optional time information without adding an
independent semantic responsibility. The smaller model is therefore
retained for this result.

## 6. Claim versus Event boundary

Claims and Events must not be conflated.

```text
Claim: "sensor S observed insertion depth X"
Event: authoritative execution history records what is known about an Action
```

A Claim may be verified and used as evidence for an execution decision, but
it does not automatically append authoritative history, change Lifecycle,
or establish an execution outcome. An Event remains the authoritative
historical artifact. This boundary lets multiple verified Claims coexist,
including conflicting Claims, without silently converting any one of them
into execution truth.

## 7. Claim versus identity-system boundary

An `issuer_reference` and a typed `subject_reference` require references,
not a VE identity system. A conforming implementation can resolve those
references through its applicable trust and verification arrangements. VE
does not need to standardize identity registries, identifier namespaces,
credential formats, or subject ownership in order to preserve the Claim's
meaning.

Verification may bind a signature, credential, or other artifact to the
issuer reference. That is verification/trust work, not a reason to move the
identity system into Claim or the VE kernel.

## 8. Action content versus occurrence attack

The distinction is necessary and can be represented inside the one generic
subject field.

| Claim subject | Minimum binding | Example |
|---|---|---|
| Action content | `kind: action-content` plus `action_digest` or accepted canonical equivalent | A policy assertion about a requested transfer amount. |
| Action occurrence | `kind: action-occurrence` plus `action_id` and `action_digest` | A telemetry assertion about one robotic-arm invocation. |

The content form answers “what semantic request?” The occurrence form
answers “which historical request carrying what exact semantic content?”
That structural distinction prevents a Claim about one execution from being
reused as evidence for another occurrence of the same Action content.

## Minimum candidate Claim structure

```text
Claim {
  subject_reference,
  issuer_reference,
  predicate,
  value,
  assertion_time?,
  observation_time?
}
```

| Field | Disposition | Minimum role |
|---|---|---|
| `subject_reference` | REQUIRED | Identifies the typed subject of the assertion, including Action content or an Action occurrence. |
| `issuer_reference` | REQUIRED | Identifies the semantic issuer; verification establishes whether that issuer assertion is trustworthy. |
| `predicate` | REQUIRED | Identifies what is asserted about the subject. |
| `value` | REQUIRED | Carries the schema-appropriate asserted value. |
| `assertion_time` | OPTIONAL | Records when the issuer made the assertion when material. |
| `observation_time` | OPTIONAL | Records when the observed condition occurred when material to the domain. |
| `provenance/source` | REJECTED FROM CORE CLAIM | Use verification evidence, another Claim, references, or domain-defined assertion content. |
| `verification_time` | REJECTED FROM CORE CLAIM | It belongs to verifier context. |
| `event_time` | REJECTED FROM CORE CLAIM | It belongs to authoritative Event history. |

The candidate does not define serialization, identifier syntax, signature
format, Trust Context, Rule input mapping, or receipt derivation. Those
remain separate responsibilities.

## Independent verification result

Independent verification requires that a verifier can identify the subject,
the asserted predicate/value, and the claimed issuer, then evaluate the
available verification material under its Trust Context. Optional assertion
and observation times are available when the applicable semantics require
them. Universal provenance is not required for that operation and must not
be made a substitute for verification evidence.

The structure therefore preserves multiple issuers and conflicting
assertions without making Claim a universal evidence store. Rule/Evaluate
can consume established Claims according to its own future deterministic
input-mapping rules; it does not decide issuer trust or reinterpret the
Claim's subject.

## Architectural result

No new primitive, lifecycle state, Event category, execution concept, or
identity authority is demonstrated. No RFC is required by this pressure
test. RFC-005 remains Draft and non-blocking: any future portable encoding
work for structured references must not be treated as accepted authority.

The single next candidate artifact is **Canonical Claim Reference
Semantics**. Its scope is the field-level, interoperable meaning of typed
subject references, especially the exact Action content and Action
occurrence forms. It must not create an Observation Claim subtype, Action
Execution Profile, new authority model, or new primitive.

## Revision history

| Date | Change |
|---|---|
| 2026-08-25 | Initial non-normative pressure test. |

## Verdict

**A. MINIMUM CLAIM MODEL IDENTIFIED**
