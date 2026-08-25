---
id: PRESSURE-TEST-ACTION-EXECUTION-PROFILE-NECESSITY
title: Action Execution Profile Necessity
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
  - KERNEL-GAP-ANALYSIS-0.2
  - KERNEL-VALIDATION
  - RS-005-PHYSICAL-IRREVERSIBILITY
  - VE-001
supersedes: null
superseded_by: null
---

# Pressure Test — Action Execution Profile Necessity

## Status and authority boundary

This is non-normative kernel-analysis evidence. It does not create an
Action Execution Profile, approve the reduced `Action / Claim / Rule /
Verify / Evaluate` model, or alter the current Action, Event, Lifecycle,
Execution Boundary, Adapter, or Receipt specification family.

`ARCHITECTURE_INDEX.md` classifies VE-001 as Approved; VE-002 through
VE-006 as Draft; RFC-005 as Draft; and kernel analysis and reference
scenarios as non-normative. The analysis below therefore tests whether a
new architectural abstraction is necessary. It does not treat Draft or
non-normative material as accepted authority.

## Question

Can completion propositions, failure propositions, recognized
observations, and evidence bindings be expressed through existing
`Action`, `Claim`, `Rule`, `Verify`, and `Evaluate` semantics, with an
Action schema supplying domain-specific meaning?

Or does independent implementation require a new domain-independent
Action Execution Profile contract?

## Test notation

The following notation is conceptual. It is not a proposed canonical
serialization, grammar, new primitive, or new normative interface.

```text
Action A
  has semantic identity (action_id, action_digest)

Claim C
  asserts an observation about A, from a named issuer and source

Verify(C, Trust Context)
  establishes whether C is usable for the applicable decision

Evaluate(completion_rule, verified Claims)
  establishes whether A's declared completion proposition holds

Evaluate(failure_rule, verified Claims)
  establishes whether A's declared failure proposition holds
```

The test is not whether every implementation may invent arbitrary
meanings. The test is whether a domain Action schema and ordinary
profile-level specifications can supply those meanings without adding a
new domain-independent execution construct.

## Attack 1 — Removability

### Assumption

Assume that there is no generic Action Execution Profile.

### Reproduction of RS-005

The robotic insertion scenario can be expressed as follows:

| Need | Existing semantic machinery | Domain-specific detail |
|---|---|---|
| Requested effect | Action | cartridge, valve, target depth, safety constraints |
| Completion proposition | Rule evaluated over verified Claims | latch closed, depth at least 30 mm, safe fixture, final PLC cycle |
| Failure proposition | Rule evaluated over verified Claims | force trip, stopped-before-target, latch not closed |
| Observation provenance | Claim plus Trust Context and Verify | approved PLC, fixture sensor, robot controller, operator source |
| Decision input | Evaluate | all required verified Claims present and consistent |
| Authoritative history | Event / Lifecycle under the current VE family | recording of what the execution authority determines |
| Portable result | Receipt | terminal Event references, Action identity, and evidence references |

No row requires an additional generic object that owns completion,
failure, observation admissibility, or evidence bindings. Those are
already separable concerns: Action supplies the meaning at issue; Claims
supply assertions; Verify and Trust Context establish usability; Rules
express propositions; Evaluate produces the proposition result; and the
existing execution family records the authoritative historical result.

### Removability result

Removing a proposed generic Action Execution Profile does not prevent
RS-005 from being represented. The remaining missing work is precise
schema/profile definition, not a missing architectural role.

**Result: removable.**

## Attack 2 — Duplication across domains

Three domains can use the same machinery while retaining different
meanings.

| Domain | Completion proposition | Failure proposition | Recognized observations / evidence |
|---|---|---|---|
| Robotic insertion | cartridge latched at required depth under the cell-safety condition | force/safety stop and target not reached | PLC sequence, fixture, depth, force, interlock Claims |
| Bank transfer | declared settlement condition is established | rejection, reversal before settlement, or a verified non-settlement result | bank settlement, ledger, rejection, and clearing Claims |
| Message/email send | the bounded provider-submission effect is established | provider rejection or a verified failed submission | provider acceptance/rejection and delivery-service Claims |

Each domain specifies its own external effect. None needs the same
completion predicate, failure predicate, observation vocabulary, issuer,
or evidence threshold. Yet all can use the same sequence:

```text
Action meaning
  → verified observation Claims
  → Rule evaluation
  → authoritative Event / Lifecycle result
  → Receipt derived from that history and its evidence
```

A generic profile that prescribed a common completion or failure language
would either duplicate Rule or impose domain meaning where the Action
schema already owns it. Different domains may remain interoperable by
sharing Action-reference and Claim-binding conventions, without sharing
a new outcome-semantics abstraction.

**Result: no incompatible protocol behavior is demonstrated by the
absence of a generic Action Execution Profile.**

## Attack 3 — Observation admissibility

The admissibility question is: which asserted observations may count as
evidence for a particular Action decision?

It can be represented as:

```text
Claim
  + issuer and provenance assertions
  + Trust Context
  + Verify
  + Rule applicability
```

The applicable schema/profile can specify, for example, that an insertion
completion rule accepts a verified PLC Claim and a verified fixture-sensor
Claim, but not an unverified controller message. That is an evidence and
governance rule. It does not require an additional generic admissibility
structure.

This conclusion does not assign Event authority to a Claim or Adapter.
Under the current VE family, the Execution Boundary remains responsible
for deciding what becomes authoritative history. Claim verification
supplies decision evidence; it does not silently replace that authority.

**Result: admissibility is expressible through Claim, Trust Context,
Verify, and Rule applicability.**

## Attack 4 — Completion and failure declaration

Completion and failure can be ordinary propositions over verified Claims.

```text
completion_rule:
  verified(latch_closed)
  AND verified(depth_at_least_target)
  AND verified(final_plc_cycle)

failure_rule:
  verified(force_limit_trip)
  AND verified(stopped_before_target)
```

The domain schema determines which proposition describes the Action's
effect. Rule supplies the predicate form, while Evaluate determines
whether it holds for the verified evidence set. A separate generic
completion/failure predicate layer would repeat Rule and Evaluate unless
it adds independent semantics. This pressure test identifies none.

For an uncertain result such as RS-005 branch D, neither proposition is
established. The outcome remains unresolved rather than being promoted to
completion or known failure. This preserves the no-false-resolution
discipline without a third predicate outcome or new Lifecycle state.

**Result: completion is Rule evaluation; failure is Rule evaluation.**

## Attack 5 — Action binding

An observation Claim must be bound to the exact Action occurrence and
semantic content to which it pertains. VE-001 already defines the
two-layer Action identity:

```text
action_id      — historical occurrence
action_digest  — exact semantic Action content
```

A domain/profile rule can require an observation Claim to reference both
values. This prevents an observation for one request occurrence, or for a
different semantic request, from being used for the Action under
evaluation.

There is a remaining interoperability detail: the exact portable
representation of an Action reference inside a Claim must be specified
for independent implementations. This is a **specification gap**, not a
new execution-profile primitive.

RFC-005 is a relevant Draft encoding dependency only if that later work
chooses its portable `ObjectReference` representation for such references.
RFC-005 does not block the conceptual Action binding test, is not accepted
authority, and does not establish the need for a generic profile.

**Result: Action binding uses existing identity semantics; portable
reference encoding remains specification work.**

## Attack 6 — Receipt

A Receipt need not understand a generic execution-profile contract to
know the meaning of completion or failure. It can bind the result that
the execution authority established:

```text
Receipt references
  - Action identity
  - terminal Event or Events
  - verified evidence / Claim references as applicable
  - the applicable schema and Rule identity where needed for review
```

The Action schema and applicable Rules determine which evidence qualifies
as completion or failure; the Receipt derives from authoritative history
and may carry the relevant references. This keeps Receipt from becoming
an authority for the outcome it reports.

For unresolved feedback, neither a false completion nor a false failure
Receipt is required. The existing no-false-resolution behavior remains
available; exact Receipt serialization and evidence bindings are ordinary
field-level specification work.

**Result: Receipt needs no new generic execution-profile contract.**

## Attack 7 — Architectural decision test

Because the prior attacks leave no indispensable generic role, the
proposed abstraction fails the necessity and complexity tests.

| Test | Result |
|---|---|
| Founding Principles consistency | No conflict is resolved that existing separation of meaning, evidence, and authority does not already address. |
| New primitive | A generic profile would not need to be a primitive, but it would still create a new cross-cutting semantic contract. |
| Removability | It is removable: RS-005 remains reproducible without it. |
| Twenty-year durability | Domain-specific schemas and Rules avoid freezing robotic, financial, and messaging ontology into a shared contract. |
| Independent implementability | Requires exact binding and schema/profile rules, not a generic outcome contract. |
| Total conceptual complexity | A generic profile duplicates Action meaning, Claim admissibility, Rule predicates, and Receipt bindings. |

No demonstrated benefit outweighs that duplication.

## Verdict

### A. NO GENERIC PROFILE REQUIRED

Existing Action / Claim / Rule / Verify / Evaluate semantics are
sufficient; only domain-specific schema/profile specifications are needed.

This is a non-normative pressure-test conclusion. It neither approves the
reduced model nor changes the authority of the current VE specification
family.

## Observed gaps and next artifact

The smallest common artifact now needed for two independent
implementations is not `cell-safe-insert-v1`. That robotic profile would
duplicate a narrower unresolved convention before the convention itself is
specified.

The next artifact is a **Canonical Claim-to-Action Reference and
Verified-Claim-to-Rule-Input Mapping specification**. It is field-level
interoperability detail covering:

- exact binding of an observation/evidence Claim to Action content and/or
  Action occurrence;
- use of `action_id` and `action_digest` where occurrence-specific binding
  is required;
- issuer and provenance representation;
- observation/assertion-time semantics when required;
- deterministic projection of verified Claim values into Rule/Evaluate
  inputs; and
- Receipt references to the established Claims/Events used to justify a
  terminal outcome.

This work does **not** introduce an Observation Claim subtype, an Action
Execution Profile, a new primitive, a new Lifecycle state, or a new
authority model. It specifies the interoperable use of existing Action,
Claim, Rule, Verify/Evaluate, Event, and Receipt semantics directly.

## RFC-005 dependency

No RFC is required by this pressure test. RFC-005 remains Draft. It is
only a potential future encoding dependency for portable structured
references; it is not a dependency for the architectural verdict and does
not authorize a generic Action Execution Profile.

## Architectural gap

No architectural gap is demonstrated.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-25 | Initial pressure test of generic Action Execution Profile necessity. |
| 0.2 | 2026-08-25 | Replace the removable binding-profile wrapper with the narrower field-level interoperability requirement. |
