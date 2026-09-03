---
id: RS-QTY-002
title: Cumulative Resource Limit and Concurrent Consumption
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Reference Scenario
author: Verified Execution Editorial Board
created: 2026-09-02
updated: 2026-09-02
depends_on:
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - VE-000
  - VE-003
  - VE-004
  - VE-006
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
related_documents:
  - GAP-ANALYSIS-RS-QTY-002
  - RS-QTY-001
supersedes: null
superseded_by: null
maturity: Executed as specification-based semantic pressure test
---

# RS-QTY-002 — Cumulative Resource Limit and Concurrent Consumption

## Authority boundary

This is non-normative evidence. It creates no RFC, primitive, field, arithmetic
language, reservation object, profile code, or PSCID suite. It does not revise
an Approved specification.

The replay assumes Action representation, external-subject and issuer
semantics, verification, trust eligibility, Predicate Schema v1.2 comparison,
PSCID suite `h'03'`, and deterministic Rule execution are already satisfied.
It isolates cumulative state, arithmetic, and authorization at execution.

## Scenario

Organization O authorizes AI Agent A to acquire at most 2,000 GPU-hours in one
monthly accounting period. An authoritative usage Claim says:

```text
already_consumed = 1,650 GPU-hours
```

The proposed Action requests:

```text
acquire = 500 GPU-hours
```

The intended invariant is:

```text
1,650 + 500 = 2,150
2,150 > 2,000
therefore deny
```

The arithmetic is intuitive. The test is whether VE must perform it.

## Candidate architectures

### A — VE computes cumulative usage

VE evaluates `consumed + proposed <= limit`.

**Attack result: rejected as the minimum architecture.** This requires governed
addition, numeric coercion, overflow behavior, scale reconciliation, domain
algebra, aggregation ownership, and failure rules. Predicate Schema v1.2 fixes
comparison, not arithmetic. Adding those rules would make VE a calculation
engine while still failing to solve concurrent consumption: two evaluations
can both read the same prior state and both authorize.

### B — authority supplies remaining capacity

An authoritative Claim states `remaining_capacity = 350 GPU-hours`; VE applies
the existing ordered comparison `500 <= 350` and denies.

**Attack result: survives only for a state snapshot.** Arithmetic remains with
the usage authority and an ordinary Claim can carry the result. The Claim must
be current, applicable to the resource and accounting period, and eligible
under trust policy. Even then, a reusable snapshot does not serialize competing
Actions. Freshness alone cannot prevent two consumers from using the same 600
GPU-hours.

### C — authority supplies projected cumulative state

A trusted system asserts `projected_usage_after_action = 2,150 GPU-hours`; VE
compares that value with the 2,000 limit.

**Attack result: survives only with narrow bindings.** The assertion must bind
to this Action content or occurrence, the relevant accounting period, and the
state snapshot used for projection. Existing Action subject-reference forms can
bind the Action. Ordinary Claim subject and predicate semantics can describe
the period/resource proposition where their governed schemas do so. No generic
state-reference abstraction is justified. Binding prevents unrelated replay,
but does not atomically reserve the snapshot or stop a competing transition.

### D — resource performs atomic conditional execution

The protected resource atomically reads authoritative usage, applies the
requested delta, and rejects the transition if the cumulative invariant would
be violated.

**Attack result: survives operationally.** The resource owns the mutable state
and commit operation; VE need not own that state or perform the addition. VE
must establish that this Action is authorized only subject to the cumulative
limit and must preserve the result truthfully. The resource may implement the
atomic mechanism, but it may not invent authority or silently replace the
authorized condition. Draft VE-006 already places prerequisite checking and
protected execution at the Execution Boundary. No new Execution Right binding
semantics have been demonstrated as necessary. Existing Action payload
semantics, ordinary Claims, and policy should be exhausted first; a portable
execution-profile convention remains only a future evidence question.

### E — external reservation or capability mechanism

The authority transforms aggregate capacity into scarce, non-overlapping
execution capacity. A request for 500 cannot obtain an adequate right when only
350 remains.

**Attack result: valid external implementation choice, not a VE addition.**
Exclusive allocation makes concurrency explicit and moves aggregation to the
state authority. That authority owns atomic issuance, acceptance, non-reuse,
scope, and uncertain-outcome reconciliation. Its facts may be ordinary Claims.
No VE Reservation, Budget, RemainingCapacity, consumable-right semantics, or
reservation lifecycle is required.

## Q1–Q10

### Q1 — Can v1.2 evaluate `500 <= 350`?

Yes, when both values are locally valid, both schemas explicitly permit ordered
comparison, and their normalized comparison semantics are identical. The result
is false. No new Predicate Schema semantics are needed.

### Q2 — Can v1.2 evaluate `1,650 + 500 <= 2,000`?

No. Approved v1.2 defines equality and Integer-only ordered comparison. It does
not define addition, aggregation, overflow, coercion, or scale reconciliation.

### Q3 — Is addition an authorization primitive?

No. Addition computes a derived fact. Authority determines whether that fact is
eligible evidence and whether the resulting transition is permitted. Making VE
authoritative for the sum would conflate computation with authority and still
would not make state consumption atomic.

### Q4 — Who owns the facts?

The resource-accounting authority owns consumed usage, remaining capacity,
accounting-period membership, and reservation state. Verification establishes
the assertion; Trust Context and policy establish eligibility. VE must not
silently become the usage ledger, clock authority, or reservation issuer.

### Q5 — Can an ordinary Claim represent remaining capacity?

Yes. A Claim under an appropriate Predicate Schema can assert
`remaining_capacity = 350`; no Claim subtype is required. Its applicability,
freshness, issuer eligibility, and comparison semantics remain explicit gates.

### Q6 — Can a Claim be bound narrowly enough?

An ordinary Claim can use existing Action content/occurrence subject references
to bind a derived assertion to an Action. Predicate and subject semantics can
state the accounting period and resource snapshot when those meanings are
governed. This can prevent broad replay, but a snapshot identifier alone does
not acquire an exclusive right to change that state. No generic `StateVersion`
primitive is demonstrated.

### Q7 — What does concurrency do?

Claims alone do not solve it. Two evaluations can correctly compare 400 <= 600
against the same valid Claim and both authorize. Only a serialized atomic state
transition or mutually exclusive reservation prevents overrun.

### Q8 — Arithmetic or atomic state transition?

The required behavior is atomic state commitment by the authoritative state
owner. This is not a missing VE semantic. Arithmetic can be performed by the
authoritative resource or accounting service, while addition in VE could not
prevent a time-of-check/time-of-use race.

### Q9 — May the resource enforce the invariant atomically?

Yes. The resource or Execution Boundary can atomically enforce
`current_state + requested_delta <= limit` while VE verifies that this exact
constraint is authorized. Existing execution architecture already places
protected commit with the authoritative execution domain. No conditional-right
or consumable-capacity addition has been shown necessary.

### Q10 — Can the policy be reduced to remaining executable capacity?

Yes for a single decision: the authority aggregates first, issues the resulting
capacity fact, and VE performs only comparison. For concurrent execution, the
authoritative state owner must serialize commitment; a reusable Claim is
authorization input, not a state lock.

## Mandatory concurrency replay

```text
limit     = 2,000
consumed  = 1,400
remaining = 600
Action X  = 400
Action Y  = 400
```

| Design | Result |
|---|---|
| Sequential evaluation with refreshed authoritative state | X may commit; Y sees 200 remaining and is denied. No overrun if refresh follows authoritative commit. |
| Concurrent evaluation against one snapshot | X and Y each pass `400 <= 600`; this is an authorization race. If the execution domain also commits both without serialization, the state-commit race reaches 2,200. |
| Stale remaining-capacity Claim | Reuse can authorize after capacity was consumed. Freshness metadata narrows but does not serialize use. |
| Atomic resource enforcement | One transition commits first; the other observes insufficient capacity and fails. No overrun. |
| Exclusive reservations | At most 600 can be reserved. Both 400 reservations cannot succeed. No overrun if issuance, consumption, expiry, and release are atomic. |

The decisive distinction is not the inability to calculate 1,400 + 400. VE may
authorize both Actions from valid immutable inputs; the authoritative execution
domain must serialize the shared state transition. VE need not own that pool.

## Mandatory uncertainty replay

VE authorizes 300 GPU-hours and submission occurs, but the execution outcome is
uncertain. Current VE principles prohibit treating this as either committed or
not committed without authoritative evidence. Capacity therefore must not be
blindly reissued, yet uncertainty also cannot be declared consumption by VE.

The authoritative state owner later establishes whether capacity committed,
remains held, or was released. VE preserves `UNCERTAIN` and awaits authoritative
reconciliation. It does not infer a `reserved -> consumed -> released`
lifecycle. A timeout or missing acknowledgment must not cause VE to infer
release, matching existing uncertain-settlement architecture.

If 400 GPU-hours were requested or operationally reserved but only 250 were
committed, VE does not infer that 150 is reusable. The state authority
establishes the final committed and releasable state.

## Strongest reduction question

If an authority always supplies exact remaining executable capacity, VE can
make every isolated numeric authorization decision in this scenario with v1.2
comparison. It still cannot safely authorize concurrent consumers from a
reusable Claim, nor decide whether uncertain execution consumed capacity.
Therefore the reduction removes arithmetic from VE. Reusable facts alone do not
guarantee global invariants; invariant preservation remains the responsibility
of the authoritative state-transition domain.

## Separation result

```text
external computation determines capacity facts
recognized authority establishes eligible facts
VE evaluates authorization
Execution Right / authorized execution crosses the boundary
authoritative execution domain atomically checks and commits protected state
authoritative observation / Event / Claim / Receipt records the outcome
```

This preserves:

```text
INTENT != AUTHORITY != EXECUTION != EVIDENCE
```

The alternative—VE computes, owns aggregate state, authorizes, and executes—
combines four responsibilities and still requires an atomic commit mechanism.

## Cross-resource replay

For a global pool with 600 remaining, an AWS Action for 400 and an Azure Action
for 400 cannot be safely serialized by either independent resource alone. A
shared external state authority may atomically serialize the global pool and
issue ordinary Claims or evidence recognized under existing authority rules.
That authority remains external to VE.

## Settlement analogy

VE may authorize a bank transfer but does not decide whether the bank ledger
committed it. Likewise, VE may authorize capacity consumption but does not own
the authoritative capacity ledger. Replay prevention and duplicate commit
belong to that execution domain's idempotency and commit semantics; an immutable
authorization artifact need not mutate after presentation.

## Scenario verdict

**A. EXISTING VE ARCHITECTURE SUFFICES.**

Cumulative-limit authorization requires neither VE arithmetic nor a new VE
semantic primitive. An authoritative external system may compute
`remaining_capacity = 350`; existing Claim, verification, Rule, and Predicate
Schema v1.2 comparison semantics can consume that fact. The authoritative
resource or shared state authority atomically serializes, checks, and commits
the capacity state. A future evidence cycle may ask whether resource/execution
profiles benefit from a portable atomic-precondition convention, but this
scenario establishes no present gap and justifies no RFC.
