---
id: GAP-ANALYSIS-RS-QTY-002
title: Gap Analysis — RS-QTY-002 Cumulative Resource Limit
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-02
updated: 2026-09-02
depends_on:
  - RS-QTY-002
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - VE-000
  - VE-003
  - VE-004
  - VE-006
related_documents:
  - RS-QTY-001
  - OPEN-DECISIONS
supersedes: null
superseded_by: null
maturity: Non-normative architectural gap analysis
---

# Gap Analysis — RS-QTY-002 Cumulative Resource Limit

## Authority boundary

This analysis is evidence only. It does not alter Predicate Schema v1.2,
Claim, Rule, Event, Execution Boundary, Execution Right, or Receipt semantics.
It defines no RFC, ADR, primitive, field, wire form, profile, or PSCID suite.

## Finding

The natural-language `+` does not prove that VE needs arithmetic. An external
state authority can calculate remaining capacity or projected usage and issue
an ordinary verified Claim. Approved Predicate Schema v1.2 can compare the
result with the proposed amount when local validity, explicit ordered
capability, and identical normalized comparison semantics all hold.

The surviving failure is concurrency:

```text
remaining = 600
X = 400 -> individually allowed
Y = 400 -> individually allowed
X + Y = 800 -> aggregate overrun
```

No snapshot Claim, however accurate when issued, makes its capacity exclusive.
The required external behavior is an atomic state transition or operational
reservation that prevents the same capacity from being committed twice. Its
absence would be a defect in the authoritative state domain, not a VE semantic
gap.

## Candidate disposition

| Candidate | Disposition | Reason |
|---|---|---|
| A. VE computes cumulative usage | Rejected | Requires arithmetic semantics yet does not solve concurrency or state authority. |
| B. Authority supplies remaining capacity | Partially survives | Reduces isolated authorization to existing comparison; stale or concurrent reuse remains unsafe. |
| C. Authority supplies projected state | Partially survives | Action/state/period binding prevents broad replay but not competing commit against one snapshot. |
| D. Resource atomically enforces invariant | Survives | State owner can serialize read-check-write without making VE the ledger; exact governed authorization boundary remains to be specified if portability is required. |
| E. External reservation/capability mechanism | Valid external option | A shared state authority may allocate capacity atomically and issue ordinary evidence; no VE object or lifecycle follows. |

## Gap classification

**A. NO GAP — existing VE authorization semantics plus authoritative external
atomic state enforcement suffice.**

The protected resource may own resource-local capacity and atomically read,
check, and commit it. A shared external state authority may do the same for a
global pool. Both are external authoritative execution domains, not missing VE
objects. Ordinary Claims provide capacity or reservation facts; existing Action
payload semantics and policy should be exhausted for bindings. Arithmetic,
Claim-binding, conditional-right, consumable-right, and Reservation-primitive
gaps are not demonstrated.

## Ownership boundaries

| Concern | Owner |
|---|---|
| Consumed usage and accounting-period membership | Resource-accounting authority |
| Remaining capacity and reservation state | Resource or reservation authority |
| Computation of aggregate/projected facts | External authoritative computation |
| Claim authenticity and eligibility | Verify, Trust Context, recognized issuer/predicate policy |
| Authorization evaluation | Rule/Evaluate and Execution Boundary |
| Atomic serialization and state transition | State-owning resource/authority in the authoritative execution domain |
| Commit, non-commit, and uncertainty evidence | Authoritative execution history and Receipt semantics |

VE must not become the usage ledger, time authority, reservation issuer, or
source of truth merely because it consumes the resulting facts.

## Arithmetic finding

Existing v1.2 permits `500 <= 350` under its comparison preconditions. It does
not permit `1,650 + 500 <= 2,000`: addition, aggregation, coercion, overflow,
and scale reconciliation are outside its contract.

No bounded-arithmetic extension is justified. Addition is removable from VE:
the state authority can produce `remaining_capacity` or
`projected_usage_after_action`. Adding arithmetic would increase conceptual
surface without solving exclusivity, races, or uncertain outcomes.

## Claim and binding finding

An ordinary Claim can state remaining capacity without a subtype. Existing
Action content/occurrence references can bind a projected fact to an Action.
Governed predicate/subject semantics can identify the resource and accounting
period. A narrower binding may eventually be required for a particular state
snapshot, but this scenario does not justify a generic `StateVersion` object.

Binding is not consumption. Even a perfectly bound, fresh Claim can be replayed
concurrently unless the authoritative state transition or reservation is
serialized.

## External reservation finding

When a deployment uses reservations, its external state authority must:

1. scope capacity to resource, period, and authorized use;
2. allocate or test-and-consume it atomically;
3. prevent reuse and over-allocation;
4. bind execution to the allocated capacity;
5. distinguish committed, proven-not-committed, and uncertain outcomes; and
6. release or reissue only under authoritative lifecycle evidence.

This may be implemented by the protected resource or an authority service. The
authority may issue ordinary Claims containing a reservation/reference, amount,
Action binding, pool/resource, and expiry. No `ReservationClaim`, Reservation,
Capacity, or `StateVersion` primitive and no portable reservation lifecycle is
required.

## Execution Right finding

No new Execution Right binding semantics have been demonstrated as necessary.
An immutable authorization artifact need not mutate when presented; replay and
duplicate commit belong to the authoritative execution domain's idempotency and
commit semantics. Existing Action payload semantics, ordinary Claims, and
policy should be exhausted first. Whether a portable execution-profile
convention for atomic commit preconditions is useful remains an evidence
question, not a current architectural gap.

## Concurrency result

| Mechanism | Overrun possible? |
|---|---|
| Sequential evaluations with post-commit refresh | No, if the refresh is authoritative and precedes the next decision. |
| Concurrent evaluations of the same remaining-capacity Claim | Yes. |
| Freshness or state binding without exclusivity | Yes. |
| Atomic resource read-check-write | No. |
| Atomic exclusive reservation and consumption | No. |

Claims alone are not state locks, but VE does not therefore own serialization.
The first two comparisons may both be locally valid—an authorization race—while
the state-commit race is resolved by the authoritative execution domain.

For a global 600-unit pool shared by AWS and Azure, neither independent resource
can safely serialize 400-unit Actions alone. A shared external state authority
can serialize the pool and issue ordinary evidence under existing recognition
and trust rules. It remains external to VE.

## Uncertain-outcome result

After submission of an authorized 300 GPU-hour acquisition, an uncertain
outcome cannot be promoted to either consumption or non-consumption. VE
preserves `UNCERTAIN`; only the authoritative state owner later establishes
whether capacity committed, remains held, or was released. No VE reservation
lifecycle is inferred, and timeout or missing acknowledgment cannot imply
release. This is the existing uncertain-settlement pattern.

If 400 was requested or operationally reserved and 250 committed, VE does not
infer that 150 is reusable. The state authority establishes final committed and
releasable state.

## Primitive attack

| Proposed primitive | Result |
|---|---|
| Arithmetic / Aggregate | No. External computation is sufficient and arithmetic does not serialize state. |
| Counter / Balance / Consumption | No. These are state-authority models, not proven VE primitives. |
| RemainingCapacity / Budget | No. Ordinary predicate-governed Claims can express the facts. |
| Quantity | No. Existing structural comparison semantics suffice for the isolated decision. |
| StateVersion | No. Narrow subject/predicate binding should be exhausted first. |
| Reservation | No. External deployments may reserve operationally; VE needs no Reservation primitive. |

## Architectural Decision Test

| Test | Atomic-consumption/reservation direction |
|---|---|
| Founding Principles consistency | Pass. It preserves intent, authority, execution, and evidence as distinct responsibilities. |
| No unjustified primitive | Pass. No new VE primitive or semantic object is selected. |
| Necessity/removability | External serialization is necessary for the external invariant, but a VE reservation concept is removable. VE-local arithmetic and generic state objects are also removable. |
| Twenty-year durability | Pass. Atomic consume-or-reject and explicit uncertainty do not depend on one currency, unit, database, or vendor. |
| Independent implementability | Pass. The recognized state owner atomically accepts or rejects and supplies authoritative outcome evidence; VE consumes it through existing boundaries. |
| Reduced total conceptual complexity | Pass directionally. One state-owner atomic invariant is smaller than making VE own arithmetic, aggregate state, authorization, and execution. |

## Strongest reduction result

If an authoritative external system supplies a valid current capacity fact and
owns atomic commitment of that capacity, VE can authorize cumulative-resource
Actions using existing semantics without becoming a calculation engine or
state ledger. Reusable facts alone do not guarantee global invariants;
invariant preservation belongs to the authoritative state-transition domain.

This is analogous to settlement: VE authorizes a bank transfer but does not
decide whether the bank ledger committed it. Likewise, VE may authorize
capacity consumption but does not own the authoritative capacity ledger.

## Recommended next evidence

No RFC is justified. Optional future evidence may compare resource-local and
shared-authority implementations and ask whether resource/execution profiles
benefit from a portable convention for atomic commit preconditions. That is not
a present semantic gap.

## Disposition

**A. NO VE GAP FOUND.**

Existing VE authorization, Claim, comparison, execution-boundary, authoritative
commit, and uncertainty semantics suffice. No Approved specification should
change and no RFC should be drafted from RS-QTY-002.
