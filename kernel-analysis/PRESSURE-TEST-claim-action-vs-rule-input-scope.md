---
id: PRESSURE-TEST-CLAIM-ACTION-VS-RULE-INPUT-SCOPE
title: Claim-to-Action Binding versus Verified-Claim-to-Rule-Input Scope
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
  - PRESSURE-TEST-ACTION-EXECUTION-PROFILE-NECESSITY
  - VE-001
supersedes: null
superseded_by: null
---

# Pressure Test — Claim-to-Action Binding versus Rule-Input Scope

## Status and authority boundary

This is non-normative kernel-analysis evidence. It does not create or
modify a Claim specification, Rule/CEL specification, Action Execution
Profile, RFC, ADR, Action primitive, or authority model.

The reduced `Action / Claim / Rule / Verify / Evaluate` model remains
non-normative validation under `ARCHITECTURE_INDEX.md`. This pressure test
uses that model only to examine specification responsibility. It does not
promote the candidate conclusion below to accepted repository authority.

## Question

Are Claim-to-Action binding and verified-Claim-to-Rule-input mapping one
coherent specification responsibility, or should they live separately
with their natural semantic owners?

## Candidate hypothesis under test

The hypothesis being tested is:

```text
Claim specification
  owns:
  - what the Claim is about;
  - Action content versus Action occurrence binding;
  - issuer, provenance, and time semantics.

Rule / Evaluate specification
  owns:
  - deterministic projection of already-established Claims
    into Rule/Evaluate inputs.
```

The hypothesis is not an accepted result. The tests below attempt to
disprove it by asking whether a combined Claim-to-Rule mapping
specification owns any irreducible semantics.

## Common notation

```text
Action A
  action_id       = historical occurrence identity
  action_digest   = exact semantic content identity

Claim C
  subject         = the thing about which C asserts something
  issuer          = who made the assertion
  provenance      = where the assertion came from
  assertion_time  = when the assertion was made
  observation_time = when the asserted observation occurred, if distinct

Verify(C, Trust Context)
  establishes whether C is usable for a decision

Evaluate(Rule, established Claims)
  applies a deterministic Rule to the defined input view
```

The terms are conceptual. They do not define a canonical serialization or
new data type.

## 1. Semantic ownership test

### Claim-to-Action binding

Claim-to-Action binding answers:

> What exact subject, Action content, or Action occurrence does this Claim
> assert something about?

That question is intrinsic to the Claim. A Claim concerning semantic Action
content may support a statement about a class of requested effects. A Claim
concerning one execution occurrence must distinguish that occurrence from
another semantically identical request.

Occurrence-specific binding may therefore require both:

```text
action_id
  +
action_digest
```

or an accepted portable equivalent. `action_id` selects the occurrence;
`action_digest` binds the Claim to the exact semantic Action content that
was accepted for that occurrence. The decision to bind one, both, or a
domain-defined equivalent determines what the Claim means. It belongs with
Claim reference semantics.

### Verified-Claim-to-Rule-input mapping

Rule-input mapping answers a different question:

> Given Claims already established under the applicable verification and
> trust rules, what deterministic value does Rule/Evaluate receive?

This is not a statement about what a Claim asserts. It determines the
input model for evaluation: field names, types, collections, ordering,
missing values, and exposure of Claim references. It belongs with
Rule/Evaluate semantics.

### Result

The two questions have distinct semantic subjects and distinct failure
modes. Binding ambiguity changes a Claim's assertion. Projection ambiguity
changes how an established assertion is evaluated. Neither requires a
combined semantic owner.

## 2. Independent evolution test

The responsibilities can change independently.

| Change | Natural owner | Why it does not require changing the other responsibility |
|---|---|---|
| Add an Action-content binding form | Claim reference semantics | It changes which subject a Claim can describe, not how Rules receive established values. |
| Clarify issuer delegation or provenance source | Claim semantics / Trust Context | It changes verification meaning, not deterministic projection. |
| Distinguish observation time from assertion time | Claim semantics | It changes the fact asserted, even if a Rule later reads either field. |
| Add a typed map or collection to Rule input | Rule/Evaluate semantics | It changes evaluation data shape, not Claim subject identity. |
| Define missing-value handling | Rule/Evaluate semantics | It determines predicate behavior once the established Claim set is known. |
| Expose multiple Claims with one predicate | Rule/Evaluate semantics | It determines deterministic evaluation input, not the meaning of any Claim. |

The need for references from the Rule input back to Claims does not merge
the responsibilities. A Rule/Evaluate mapping can expose established Claim
references whose meanings are defined by the Claim model.

## 3. Removability test

Assume a combined “Claim-to-Rule mapping” specification exists. Split it
into the following two documents:

```text
Claim Reference Semantics
  - subject reference
  - Action content versus occurrence binding
  - issuer, provenance, and time semantics

Rule/Evaluate Established-Claim Input Mapping
  - input fields and types
  - deterministic collection and ordering rules
  - missing-value and conflict exposure rules
```

All protocol behavior remains expressible after the split:

```text
raw Claim
  ↓ Verify under Trust Context
established Claim with defined subject and provenance
  ↓ deterministic Rule/Evaluate input mapping
Rule result
```

The combined wrapper contributes no independent lifecycle, authority,
identity, verification, or evaluation semantics. It is removable without
loss of behavior.

## 4. Verification-boundary test

The verification boundary must remain explicit:

```text
raw Claim
  ↓
Verify under Trust Context
  ↓
established Claim
  ↓
Rule/Evaluate input projection
```

Rule/Evaluate must not make a raw Claim established, select a trusted
issuer, or redefine the Claim's provenance. Conversely, Claim semantics
need not specify the entire Rule input data model merely because a Rule
may inspect Claim fields.

This separation prevents an input-mapping document from silently becoming
a verification or authority model.

## 5. Conflict-handling test

Consider two established Claims with the same Action occurrence binding
and predicate but conflicting values.

```text
C1: action A completed = true
C2: action A completed = false
```

Claim semantics define what C1 and C2 respectively assert, including their
subjects, issuers, provenance, and times. Verify and Trust Context explain
why each is established for the applicable context.

Rule/Evaluate input mapping must expose the conflict deterministically. It
MUST NOT silently choose C1 or C2 because of unspecified ordering. A Rule
or applicable governance rule may then define how that visible conflict
affects evaluation.

The conflict is therefore not evidence that a combined specification is
needed. It is evidence that deterministic Rule/Evaluate input mapping is
its own responsibility.

## 6. Receipt consequence

A Receipt may reference the established Claims and authoritative Events
that justify a terminal outcome. The Receipt does not need to define Claim
subject semantics or Rule input projection. It carries references to the
artifacts whose meanings are defined elsewhere and remains derived from
authoritative history.

No combined Claim/Rule specification is necessary for that reference
relationship.

## 7. Architectural Decision Test for the combined wrapper

| Test | Result |
|---|---|
| Founding Principles consistency | Existing separation of semantic meaning, verification, evaluation, and authority remains intact. |
| New primitive | The wrapper need not be called a primitive, but it introduces an unnecessary cross-cutting contract. |
| Removability | Passes removal: the two responsibilities remain fully expressible after separation. |
| Twenty-year durability | Separate owners allow Claims and evaluation models to evolve without coupling their unrelated meanings. |
| Independent implementability | Requires two exact specifications, not a combined abstraction. |
| Total conceptual complexity | The wrapper groups adjacent flow steps but does not reduce semantic duplication or ambiguity. |

The combined wrapper fails the necessity and complexity tests.

## Findings

The pressure test supports the following non-normative finding:

```text
Claim-to-Action binding
  and
Verified-Claim-to-Rule-input mapping

are related in execution flow but are not one irreducible
specification responsibility.
```

No Observation Claim subtype, Action Execution Profile, new primitive, new
Lifecycle state, or new authority model is demonstrated.

## First responsibility to specify

The Claim-side responsibility should be specified first: **Canonical Claim
Reference Semantics**.

It must establish what an observation/evidence Claim is about before any
Rule/Evaluate mapping can expose that Claim deterministically. In
particular, the mapping cannot reliably project a subject, issuer,
provenance, or observation time whose Claim-level meaning remains
undefined. Once Claim reference semantics are stable, a Rule/Evaluate
input-mapping specification can define deterministic evaluation behavior
without redefining Claim meaning.

This is a candidate sequencing conclusion only. It does not start a Claim
specification or change current repository authority.

## RFC-005 boundary

RFC-005 remains Draft and non-blocking for this architectural test. It may
later provide an encoding choice for portable structured references, but
it does not decide whether binding and projection share a semantic owner.

## Verdict

PASS FOR SEPARATION

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-25 | Initial pressure test of Claim-to-Action binding and Rule-input mapping scope. |
