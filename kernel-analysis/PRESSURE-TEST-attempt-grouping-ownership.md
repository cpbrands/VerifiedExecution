---
id: PRESSURE-TEST-ATTEMPT-GROUPING-OWNERSHIP
title: Attempt Grouping Ownership
version: "0.1"
status: Draft
document_type: Pressure Test
category: Kernel Analysis
author: Verified Execution Editorial Board
created: 2026-08-26
updated: 2026-08-26
depends_on: []
related_documents:
  - ARCHITECTURE-INDEX
  - VE-002
  - VE-003
  - VE-004
  - PRESSURE-TEST-ATTEMPT-BINDING-VIA-EVENT-HISTORY
supersedes: null
superseded_by: null
---

# Pressure Test — Attempt Grouping Ownership

## Status and authority boundary

This is non-normative kernel-analysis evidence. It neither creates an
attempt identifier, attempt reference, `ExecutionAttempt` primitive, nor
changes Event, Lifecycle, Receipt, Claim, Action, RFC, ADR, or Open
Decision authority.

`ARCHITECTURE_INDEX.md` classifies VE-001 as Approved and VE-002 through
VE-006 as Draft. It classifies pressure tests as non-normative evidence.
Accordingly, this test examines a possible resolution of the grouping
question identified in the earlier attempt-binding pressure test; it does
not make profile delegation, Event grouping, or any other conclusion
current normative authority.

## Question

Should attempt membership be intrinsic to authoritative Event/Lifecycle
history, or should VE core remain agnostic and explicitly delegate Event
grouping to normative execution profiles?

## Test terms

The terms below are analytical only:

```text
Action occurrence
  one historical Action with action_id and action_digest

Event history
  immutable authoritative Events belonging to that Action occurrence

Operational attempt
  one operational try to realize the Action's requested effect

Execution profile
  a future normative, domain or protocol-specific rule set that can
  interpret recognized Events and evidence for a declared purpose
```

An operational attempt is not assumed to be a VE object. An Event reference
identifies an authoritative historical fact; it does not, by itself, name a
set of Events as an attempt.

## Model A — Core-owned grouping

### Hypothesis

Under this model, Event/Lifecycle history would own one canonical relation
that assigns each relevant Event to an attempt grouping for its Action
occurrence.

The smallest imaginable relation is conceptual rather than a proposed
field:

```text
Event E
  belongs to Action A
  is associated with grouping G within A's history
```

`G` would need a stable identity or an equally stable derivation rule. It
would also need rules for when a grouping begins, which observations attach
to it, how it closes, and how concurrent groupings differ. A timestamp or
event order alone cannot supply those rules under overlap.

### What Model A would buy

If every conforming implementation had to derive one universal meaning of
an attempt, the relation would make multi-Event attempt-local claims
portable without identifying a profile. It would directly resolve the
multi-Event ambiguity observed in
`PRESSURE-TEST-attempt-binding-via-event-history.md`.

### Removability attack

Remove the universal relation. Event identity, Action ownership, ordering,
evidence, Lifecycle legality, and Receipt references still remain available.
An implementation can still determine an Action outcome from the Events and
evidence its applicable rules recognize. What is lost is a universal label
for an operational grouping.

The loss is not yet shown to break a core invariant. It only breaks a
profile that requires an attempt-local interpretation and has failed to
specify that interpretation itself.

**Model A result: removable in the cases tested.**

## Model B — Profile-delegated grouping

### Hypothesis

VE core records authoritative Events. A normative execution profile defines
whether, and for its own stated purpose, a set of those Events belongs to
one operational attempt.

```text
authoritative Event history
  + profile identity
  + profile grouping rule
  → deterministic profile-level attempt interpretation, if needed
```

The profile is not free to reinterpret history. It operates only over
immutable Event identities, their Action ownership, their established
evidence, and other permitted authoritative references. Its grouping result
cannot erase Events, invent Event authority, or change a core Lifecycle
transition.

### Reproducibility attack

Two profiles could legitimately group the same Event history differently.
For example, a transport profile may treat a re-sent request after a timeout
as a second attempt, while an idempotency profile may regard it as one
continuing delivery operation. That difference is acceptable only when the
profiles make it explicit and deterministic, and neither produces a
contradictory authoritative Action outcome from the same governing
evidence.

VE-wide reproducibility therefore does not require every consumer to derive
the same attempt boundaries. It requires every consumer applying the same
identified profile, to the same referenced history and evidence, to derive
the same boundaries and any profile-level conclusion. Core outcome
invariants remain derived from authoritative Events and the applicable
governing semantics, rather than from an unlabelled attempt count.

### Delegation boundary

This is a proposed allocation of future specification responsibility, not a
claim that current Draft Event/Lifecycle text has already adopted it.

For profile delegation to be interoperable, future core-facing material
would need to preserve and expose:

- immutable `event_id` values and Action ownership;
- sufficient ordering and Event/evidence references to identify the input
  history without relying on display order;
- the identity of any profile whose grouping-derived conclusion is being
  presented; and
- the rule that a profile-derived grouping neither alters history nor creates
  an authoritative core Event by itself.

The applicable execution profile would need to specify:

- the exact Event and evidence forms it recognizes;
- the deterministic grouping/association rule;
- treatment of observations recorded before a later authoritative Event;
- behavior for retry, overlap, delayed response, and incomplete feedback;
- any attempt-local conclusion it derives; and
- references from a profile-level conclusion to the supporting Events and
  established evidence.

These are specification responsibilities, not a new primitive or authority
model.

**Model B result: sufficient in the cases tested.**

## 1. Cross-domain consistency attack

| Domain | Operational meaning of an attempt | Does one core grouping rule improve the Action outcome? | Result |
|---|---|---|---|
| Robotic-arm retry | A commanded motion cycle, including safety and sensor observations. | No. A safety profile determines whether controller/sensor activity is one cycle; core only needs the authoritative history and outcome evidence. | Profile-specific. |
| Bank-transfer retry | Submission, inquiry, resubmission, or settlement polling may all be operationally called a retry. | No. Idempotency, clearing, and settlement rules determine whether operations are one payment attempt or distinct submissions. | Profile-specific. |
| Message/email delivery retry | A client submission and provider delivery retries can be separate operational layers. | No. A delivery profile determines the layer and boundary; a core grouping would choose one vendor- or protocol-specific view. | Profile-specific. |

“Attempt” does not have one material universal meaning across the three
domains. A core relation would either be so abstract that profiles still
need their own rules, or would embed a preferred operational model in the
kernel. Neither outcome improves the tested Action/Lifecycle semantics.

## 2. Deterministic-history attack

Given the same authoritative Event sequence, a conforming implementation
must preserve the same Event identities, Action ownership, ordering, and
core Lifecycle projection. It does not need to derive one universal attempt
partition where no core outcome depends on that partition.

What must remain invariant is narrower:

```text
same identified profile
  + same permitted Event/evidence references
  → same profile-level grouping and conclusion
```

If a profile needs an attempt boundary, an unspecified local “nearest Event”
heuristic is not sufficient. It would break reproducibility. The profile’s
explicit grouping rule, rather than a universal core label, is the place
that removes that ambiguity.

## 3. Concurrency attack

Consider the same Action occurrence with overlapping activity:

```text
E1: adapter request started
E2: retry request started
E3: observation associated with one request path
E4: first response
E5: second response
```

Ordering cannot decide whether E3 belongs with E1 or E2. A generic core
grouping relation can resolve this only by adding a causal association whose
meaning must still be supplied by the transport, target, or execution
context. A profile can instead require explicit source, external-request,
or Event references and define how these inputs form groups for that
protocol.

Core Event history remains sufficient to preserve every fact and prevent
false Action resolution. The profile handles the additional interpretation
only when needed. No `attempt_id`, `attempt_reference`, or
`ExecutionAttempt` object is demonstrated.

## 4. Retry-semantics attack

Retry boundaries are protocol and profile facts, not yet demonstrated as
universal VE facts. This aligns with Draft VE-003’s treatment of retries as
operational or attempt-level behavior rather than a canonical `RETRYING`
state. It does not rely on that Draft statement as Approved authority; it
tests the same separation against the current authoritative Event and
Lifecycle roles.

An operational retry can be meaningful to an adapter, payment protocol, or
safety profile without becoming a core Action state, a new VE primitive, or
a globally named historical object.

## 5. Lifecycle attack

Lifecycle does not need attempt grouping before it can enforce its existing
critical distinction:

```text
authoritative evidence establishes completion
  → COMPLETED

authoritative evidence establishes known failure
  → FAILED

neither is established
  → no false terminal resolution
```

This projection is based on what authoritative history establishes, not on
how many operational attempts a profile recognizes. An attempt grouping may
help a profile explain its evidence, but no tested transition requires it as
universal Lifecycle input.

## 6. Receipt attack

A Receipt needs the Action identity, the authoritative terminal Event or
Events, and the established evidence that supports the represented result.
It does not need a universal attempt group. Where a profile-level
attempt-local conclusion is relevant, a Receipt can identify the profile
and cite the supporting Events and Claims. It must not state more than those
artifacts establish, and it must not treat a profile label as new
authoritative history.

## 7. Claim-reference consequence

Canonical Claim Reference Semantics can cover:

```text
Action content reference
Action occurrence reference
individual Event/history reference
```

These forms are sufficient for a Claim to identify its subject or anchor an
assertion to an authoritative historical fact. A Claim spanning several
Events can cite the individual Event references relevant to its assertion;
the applicable profile determines any operational grouping needed to
interpret them. It does not need a universal grouped-attempt reference.

This removes only the proposed protocol requirement for a generic grouped
attempt/history reference. It does not declare the exact Claim reference
encoding or mapping rules complete, and it does not change the earlier
pressure-test finding that such field-level work remains to be specified.

## 8. Architectural Decision Test

| Test | Core-owned grouping | Profile-delegated grouping |
|---|---|---|
| Founding Principles consistency | Adds a universal operational interpretation not shown necessary for legitimate execution. | Preserves separation between authoritative history and target/domain mechanics. |
| New primitive burden | A durable relation would likely need a stable group identity or equivalent construct. | No new primitive or universal identity. |
| Removability | Removable without loss of tested core behavior. | Profiles that do not need grouping remain simple; profiles that do define it retain their semantics. |
| Twenty-year durability | Risks encoding today’s retry models as a kernel rule. | Allows future protocols while fixing profile behavior where independently required. |
| Independent implementation | Requires a universal rule with no demonstrated common domain meaning. | Same-profile implementations can reproduce results from named rules and referenced history. |
| Total conceptual complexity | Adds a cross-domain relation plus its lifecycle and concurrency rules. | Keeps the concept only in profiles that need it. |

## Result and next artifact

No new primitive, lifecycle state, execution concept, or architectural gap
is demonstrated. An RFC is not required for this non-normative result. If a
future normative change alters an Approved specification, normal governance
would apply.

The next candidate artifact is **Canonical Claim Reference Semantics**. It
should specify the field-level forms for Action content, Action occurrence,
and individual Event/history references. It should not introduce a generic
attempt reference. A later normative execution profile may specify a
deterministic grouping rule when its own behavior requires one.

## Revision history

| Date | Change |
|---|---|
| 2026-08-26 | Initial non-normative pressure test. |

## Verdict

**B. PROFILE-DELEGATED GROUPING SUFFICIENT**
