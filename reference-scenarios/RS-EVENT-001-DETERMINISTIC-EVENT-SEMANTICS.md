---
id: RS-EVENT-001
title: Deterministic Event Semantics Across Success, Known Failure, and Uncertain Outcome
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-22
updated: 2026-09-22
depends_on:
  - EVENT-SEMANTIC-FIELD-CONTRACT
  - VE-001
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
  - VE-CBOR-1-RULE-REPRESENTATION-AND-CONTENT-IDENTITY
related_documents:
  - RS-002
  - RS-003
  - RS-LYNX-001-SUCCESSFUL-LYNX-INTERBANK-SETTLEMENT
  - RS-RULE-001
  - GAP-ANALYSIS-RS-RULE-001-CANONICAL-RULE-CONTENT-IDENTITY
supersedes: null
superseded_by: null
---

# RS-EVENT-001 — Deterministic Event Semantics Across Success, Known Failure, and Uncertain Outcome

## 1. Authority, question, and limits

This document is **non-normative evidence** against the Draft v0.1
[Event Semantic Field Contract](../specifications/EVENT-SEMANTIC-FIELD-CONTRACT.md).
It does not amend Approved VE-002, allocate an Event type, define an Event wire
format, create an Event-type registry, or make the scenario fixtures normative.

The scenario asks whether two independent implementations given the same
Action occurrence, immutable Event-type contracts, admitted evidence, protected
environment decisions, and delivered Event records agree on:

1. the authoritative per-Action Event order;
2. the VE-003 Lifecycle projection;
3. rejection versus unsupported interpretation;
4. the boundary between Event semantics and protected-environment assignment.

The tested architecture is:

```text
Action occurrence
  + admitted observations/evidence
  + protected-environment append decisions
  + immutable Event-type semantic contracts
  -> authoritative per-Action Event stream
  -> VE-003 projection
  -> optional VE-004 Receipt derivation after terminal resolution
```

The scenario deliberately does **not** define canonical Event bytes,
cryptography, distributed consensus, leader election, locking, a global
registry, a new reference union, or a seventh primitive. It records unresolved
dependencies for later Gap Analysis instead of resolving them here.

## 2. Exact consequential Action

The one consequential Action is the exact Lynx settlement Action occurrence
already used by RS-LYNX-001:

```text
action_id =
  h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f'

action_digest =
  h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'

schema_digest =
  h'e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554'
```

Its bounded intent is the existing test-only CAD 10,000 Lynx participant-level
settlement instruction. This scenario does not assert that a live payment was
submitted or settled. Success, known failure, and unresolved outcome are three
separate counterfactual replays of this one Action occurrence. They are never
three simultaneous authoritative histories.

`action_id` and `action_digest` remain distinct. Nothing in this scenario adds
Event, Rule, Policy, Receipt, evidence, or sequence material to the Action or
to an Execution Right.

## 3. Exact abstract fixture conventions

This scenario tests the semantic layer before Event representation exists.
Notation in this section defines exact abstract test inputs, not wire encoding.

### 3.1 Event occurrence identifiers

`H32(n)` means the unique 32-octet big-endian encoding of the positive integer
`n`, left-padded with zero octets. Each use is therefore an exact VE-002
`event_id`. For example:

```text
H32(1) =
  h'0000000000000000000000000000000000000000000000000000000000000001'
```

The symbols `E01` through `E24` name Event occurrences by these exact values.
They do not make `event_id` an integer or allocate an Event wire map.

### 3.2 Complete Event-type identifiers

For this scenario only, the notation:

```text
ET(authority, local_name, version)
```

denotes one complete abstract `event_type` value. Equality requires equality
of all three components. It is not a proposed universal identifier syntax.

Two test authorities exist:

```text
A = "rs-event-001.example/authority-A"
B = "rs-event-001.example/authority-B"
```

Thus these are unequal complete identifiers despite their shared local name:

```text
ET(A, "EXECUTION_COMPLETED", 1)
ET(B, "EXECUTION_COMPLETED", 1)
```

No deployment preference chooses between them. The complete stored identifier
selects the contract.

### 3.3 Occurrence time

The scenario-local time dependency `TIME-A-1` defines an abstract UTC instant
with whole-second precision and chronological equality/order. `T(n)` denotes
`2026-11-17T15:00:` followed by the two-decimal-digit second `n` and `Z`.
The notation does not allocate timestamp bytes. Every Authority A Event-type
contract below immutably imports exactly `TIME-A-1`.

### 3.4 Specification version

Every Event uses the same exact abstract pair:

```text
spec_version = (specification = VE-002, version = 0.2)
```

## 4. Scenario-local immutable Event-type contracts

The following contracts are complete **test fixtures**. They are not
repository Event-type allocations. Every Authority A identifier permanently
selects its listed row, `TIME-A-1`, and every named projection or reference
dependency. Retargeting any row without changing its complete identifier is
forbidden by the Draft under test.

| Complete identifier | Asserted fact | VE-003 v0.1 projection | Optional-field contract | Evidence condition |
|---|---|---|---|---|
| `ET(A,"ACTION_CREATED",1)` | This exact Action occurrence became authoritative | `NONE -> CREATED` | actor/component/payload/references forbidden | authoritative Action admission |
| `ET(A,"VALIDATION_STARTED",1)` | validation began for this Action | `CREATED -> VALIDATING` | optional fields forbidden | Boundary began validation |
| `ET(A,"VALIDATION_SUCCEEDED",1)` | validation succeeded | `VALIDATING -> READY` | optional fields forbidden | admitted validation result |
| `ET(A,"POLICY_EVALUATED",1)` | the selected policy evaluation completed | no transition | exactly the two references in §5.2; actor optional and non-null; other optional fields forbidden | admitted evaluation result |
| `ET(A,"POLICY_RECORDED",1)` | an exact Policy artifact was recorded for traceability | no transition | exactly P-A permitted; Rule references and other optional fields forbidden | admitted Policy record |
| `ET(A,"AUTHORIZATION_GRANTED",1)` | execution authorization was established | `READY -> AUTHORIZED` | optional fields forbidden | admitted authorization result |
| `ET(A,"EXECUTION_STARTED",1)` | material execution began | `AUTHORIZED -> EXECUTING` | optional fields forbidden | Boundary invoked the admitted Adapter operation |
| `ET(A,"EXECUTION_COMPLETED",1)` | the bounded external effect was established as committed | `EXECUTING -> COMPLETED` | optional fields forbidden | sufficient target-owned settlement evidence |
| `ET(A,"EXECUTION_FAILED",1)` | execution began and resolved as a known failure | `EXECUTING -> FAILED` | optional fields forbidden | sufficient target-owned rejection evidence |
| `ET(A,"RECEIPT_GENERATED",1)` | a VE-004 Receipt was derived from terminal history | no transition | one VE-004-owned Receipt reference permitted | Receipt exists after terminal history |

Unknown distinct top-level extensions are permitted as opaque context by each
fixture contract. They have no truth or Lifecycle effect. A known optional
field, if a contract permits one, must be non-null.

Authority B permanently binds its same-local-name identifier to a different
fact and no Lifecycle transition:

| Complete identifier | Asserted fact | Projection | Dependencies |
|---|---|---|---|
| `ET(B,"EXECUTION_COMPLETED",1)` | Authority B's isolated simulation finished | no transition | Authority B's exact `TIME-B-1`; no VE-003 trigger |

This difference is intentional. It proves that a local name is not the
semantic identifier.

### 4.1 Exact reference ownership for the policy event

The Authority A `POLICY_EVALUATED` fixture permits exactly one ordered pair:

```text
references = [P-A, R1]
```

`P-A` denotes the exact scenario-local Policy artifact selected by the
Boundary. VE-002 directly admits the Policy category, but the repository has
no current portable Policy-reference representation; `P-A` is therefore a
bounded scenario fixture, not a reusable Policy identity definition.

`R1` is the exact Rule content reference under the Draft Rule authority:

```text
R1.rule_digest =
  h'86ec5cc99b17d49f00e0f3f05172164787e39ff28d59ee4575f661273120b247'
```

The event-type contract explicitly permits that Rule reference and imports the
Draft v0.1 canonical Rule representation/content-identity specification. Rule
is not treated as a synonym for Policy and is not attributed directly to
VE-002.

## 5. Baseline authoritative success replay

The protected environment has already established each unique predecessor and
append position. The Boundary has admitted the stated evidence. Sequences
contain gaps deliberately.

| Event | `event_id` | `sequence` | `event_type` | `occurred_at` | References | Projection after Event |
|---|---|---:|---|---|---|---|
| E01 | `H32(1)` | 10 | `ET(A,"ACTION_CREATED",1)` | `T(00)` | absent | `CREATED` |
| E02 | `H32(2)` | 20 | `ET(A,"VALIDATION_STARTED",1)` | `T(01)` | absent | `VALIDATING` |
| E03 | `H32(3)` | 30 | `ET(A,"VALIDATION_SUCCEEDED",1)` | `T(02)` | absent | `READY` |
| E04 | `H32(4)` | 40 | `ET(A,"POLICY_EVALUATED",1)` | `T(03)` | `[P-A,R1]` | `READY` |
| E05 | `H32(5)` | 50 | `ET(A,"AUTHORIZATION_GRANTED",1)` | `T(04)` | absent | `AUTHORIZED` |
| E06 | `H32(6)` | 60 | `ET(A,"EXECUTION_STARTED",1)` | `T(05)` | absent | `EXECUTING` |
| E07 | `H32(7)` | 70 | `ET(A,"EXECUTION_COMPLETED",1)` | `T(06)` | absent | `COMPLETED` |

The exact authoritative order is:

```text
E01@10 < E02@20 < E03@30 < E04@40 < E05@50 < E06@60 < E07@70
```

Lifecycle replay returns `COMPLETED`. E04 is historically retained but causes
no transition. A VE-004 Receipt may now be derived from the terminal history;
the Receipt does not make E07 true and is not replay input required to derive
`COMPLETED`.

## 6. Known-failure and uncertain-outcome replays

These are separate counterfactual histories of the same Action fixture.

### 6.1 Known failure

E01–E06 are unchanged. Sufficient target-owned rejection evidence supports:

```text
E17 = {
  event_id: H32(17),
  action_id: <exact Action in §2>,
  event_type: ET(A,"EXECUTION_FAILED",1),
  occurred_at: T(07),
  sequence: 70,
  spec_version: (VE-002, 0.2)
}
```

The authoritative order ends in `E17@70`; replay returns `FAILED`.

### 6.2 Uncertain external outcome

E01–E06 are authoritative. The Adapter then reports only:

```text
request transmitted = true
response available = false
settlement result = unknown
```

That observation is not an authoritative Event and supports neither
`EXECUTION_COMPLETED` nor `EXECUTION_FAILED`. The authoritative order ends at
`E06@60`; replay returns `EXECUTING`. No terminal Receipt is derivable.

## 7. Two independent implementations

The scenario was evaluated by two independently structured implementations:

### Implementation P — append-first

1. Resolve `spec_version` and the complete `event_type` identifier.
2. Validate contract dependencies, fields, evidence, and references.
3. Ask the protected-environment input for the unique head and append
   position.
4. Append only a conforming selected Event.
5. Replay appended Events in sequence order through VE-003.

### Implementation R — history-first

1. Receive the protected environment's authoritative membership set and any
   unselected proposals separately.
2. Validate identities and unique per-Action sequences.
3. Order authoritative members by `sequence`, independent of delivery order.
4. Resolve each complete type lazily during replay.
5. Apply only exact VE-003 mappings from resolved immutable contracts.

Implementation P is candidate/append oriented. Implementation R is
retained-history/replay oriented. Neither may use a local-name switch,
deployment-selected profile, arrival order, timestamp, or current registry
entry to choose meaning.

## 8. Adversarial comparison matrix

Classification terms are exact for this scenario:

- **deterministic** — both implementations derive the same authoritative
  semantic result from the same inputs;
- **protected environment** — the choice is an externally supplied assignment
  prerequisite rather than a meaning inferred by Event replay;
- **ambiguous** — the current authorities permit consequentially different
  semantic outcomes for the same supplied inputs;
- **unsupported** — history may be retained, but missing immutable authority
  prevents interpretation or projection.

`S` denotes the seven-Event success order in §5. `S60` denotes its prefix
through E06. Every mutation is isolated; it does not alter another case.

| ID | Case | Authoritative order | Replay/projection result | Governing rule/owner | Deterministic | Protected environment | Ambiguous | Unsupported |
|---|---|---|---|---|---|---|---|---|
| B1 | Normal success replay | `S` | `COMPLETED`; Receipt derivation now permitted | VE-002 order; exact type contracts; VE-003 | YES | append positions already supplied | NO | NO |
| B2 | Known-failure replay | `S60 < E17@70` | `FAILED` | target evidence -> Boundary; exact failure contract; VE-003 | YES | append position already supplied | NO | NO |
| B3 | Uncertain Adapter observation | `S60` | `EXECUTING`; no terminal Event or Receipt | VE-005 observation; VE-006 authority; VE-004 terminal rule | YES | no terminal append selected | NO | NO |
| T1 | Authority B uses local name `EXECUTION_COMPLETED` at 70 | `S60 < E18@70` | Authority B fact retained; no VE-003 transition; state `EXECUTING` | complete identifier equality and Authority B contract | YES | append position supplied | NO | NO |
| T2 | Authority A completion identifier is presented with altered failure semantics | `S60`; candidate excluded | reject retargeting; state `EXECUTING` | immutable identifier binding; Draft N19 | YES | no meaning choice permitted | NO | NO |
| T3 | Exact historical Authority A completion contract unavailable during replay | retained order `S` | stop semantic projection at E07 as unsupported; no `COMPLETED` fact derived; last safely derived state `EXECUTING` | Draft §§6,15; N20 | YES | NO | NO | YES |
| T4 | `TIME-A-1` unavailable while replaying E07 | retained order `S` | E07 dependency unavailable; no terminal projection; last safely derived state `EXECUTING` | transitive dependency binding; N21 | YES | NO | NO | YES |
| O1 | Completion and failure candidates both claim next position 70; no selected head | authoritative order remains `S60` | both remain proposals; state `EXECUTING` | unique-head/append-position precondition; N23 | YES | YES: selection remains pending | NO | NO |
| O2 | Protected environment selects completion candidate | `S60 < E07@70` | `COMPLETED`; unselected failure candidate is not history | VE-006 append authority plus protected-environment selection | YES | YES: exact selected occurrence supplied | NO | NO |
| O3 | Protected environment selects failure candidate | `S60 < E17@70` | `FAILED`; unselected completion candidate is not history | VE-006 append authority plus protected-environment selection | YES | YES: exact selected occurrence supplied | NO | NO |
| D1 | Authoritative members delivered `E07,E03,E01,E06,E02,E05,E04` | reconstruct `S` | `COMPLETED` | sequence orders validated authoritative history; delivery is irrelevant | YES | authoritative membership pre-established | NO | NO |
| D2 | E04 delivery record appears twice, byte/field identical | reconstruct `S` with one E04 occurrence | `COMPLETED`; second delivery cannot create another Event | VE-002 occurrence identity; duplicate `event_id`/sequence cannot append | YES for history/projection | authoritative membership pre-established | transport acknowledgement unspecified only | NO |
| S1 | Isolated valid stream head is `2^64-2`; unique next Event uses `2^64-1` | `... < E20@(2^64-2) < E21@(2^64-1)` | accept maximum; projection follows E21 contract | fixed uint64 domain; maximum rule | YES | YES: positions supplied | NO | NO |
| S2 | Append proposed after accepted maximum | order remains through `E21@(2^64-1)` | fail closed; no new Event | exhaustion rule; N22 | YES | protected environment reports no greater position | NO | NO |
| S3 | Candidate supplies mathematical value `2^64` | prior order unchanged | reject as nonconforming; no truncation/widening/wrap | fixed semantic domain; §15 | YES | NO | NO | NO |
| N1 | E04 carries known optional `actor = null` | E04 candidate excluded; remaining valid Events retain sequence gap | known optional null rejected; later valid replay still reaches `COMPLETED` | top-level null rule; N3 | YES | NO | NO | NO |
| N2 | E04 carries distinct unknown extension `future_code = null` | `S` | accept opaque extension; `COMPLETED`; no projection effect | base unknown-member rule; P3 | YES | NO | NO | NO |
| N3 | Later software recognizes `future_code` as a non-null known field | historical order remains `S` | old null remains opaque under recorded VE-002/type authority; `COMPLETED` | historical extension collision rule; P11 | YES | NO | NO | NO |
| R1 | E04 contains exact `[P-A,R1]` references permitted by its contract | `S` | references retained; no transition; final `COMPLETED` | VE-002 Policy category plus explicit Rule-authority import | YES | NO | NO | NO |
| R2 | `EXECUTION_STARTED` candidate carries P-A although its type forbids references | candidate excluded; order stops before that candidate | reject as nonconforming | exact Event-type optional-field contract | YES | NO | NO | NO |
| R3 | `ET(A,"POLICY_RECORDED",1)` receives R1 without explicit Rule permission | candidate excluded | reject; Rule is not admitted as Policy | VE-002 reference list and Rule authority boundary | YES | NO | NO | NO |
| R4 | Contract explicitly permits R1 but exact Rule authority material is unavailable | Event retained only where historical retention applies | unsupported; no interpretation of the Rule reference | required reference dependency unavailable; N13/N21 | YES | NO | NO | YES |
| V1 | Receipt assertion alone is offered as proof that completion occurred | order remains `S60` | reject completion append; state `EXECUTING` | VE-004 Receipt is derived and cannot create truth | YES | NO | NO | NO |

### 8.1 Duplicate-delivery boundary

D2 has one deliberately limited non-semantic freedom: a transport endpoint may
acknowledge an identical repeated delivery idempotently or report a duplicate.
Neither response may create a second Event, change authoritative membership,
or alter projection. The authoritative result is therefore deterministic even
though this scenario does not standardize transport acknowledgements.

### 8.2 Concurrent-candidate boundary

O1–O3 do not solve coordination. The protected environment supplies either no
selection or one exact selected Event occurrence. Both implementations consume
that fact. They do not elect a leader, compare arrival times, choose the lower
`event_id`, or turn competing proposals into branches of authoritative history.

## 9. Independent result comparison

| Check | Implementation P | Implementation R | Convergence |
|---|---|---|---|
| Baseline success | `COMPLETED` | `COMPLETED` | PASS |
| Known failure | `FAILED` | `FAILED` | PASS |
| Uncertain outcome | `EXECUTING` | `EXECUTING` | PASS |
| Authority collision | distinct identifiers and meanings | distinct identifiers and meanings | PASS |
| Retargeting | reject | reject | PASS |
| Missing contract/dependency | retain as applicable; unsupported | retain as applicable; unsupported | PASS |
| Unresolved concurrent candidates | no authoritative append | no authoritative membership | PASS |
| Out-of-order delivery | sequence reconstruction | sequence reconstruction | PASS |
| Duplicate delivery | one Event occurrence | one authoritative member | PASS |
| Maximum sequence | accept once | accept once | PASS |
| Exhaustion/overflow | fail closed | fail closed | PASS |
| Null/extension collision | exact N1–N3 outcomes | exact N1–N3 outcomes | PASS |
| Policy/Rule references | exact R1–R4 outcomes | exact R1–R4 outcomes | PASS |
| Receipt authority | cannot establish completion | cannot establish completion | PASS |

```text
tested cases = 23
semantic convergence = 23/23 PASS
consequential semantic divergence = none
```

## 10. Governing-owner audit

| Concern | Existing owner | Scenario result |
|---|---|---|
| Event occurrence identity and immutable history | VE-002 | preserved |
| Action ownership | VE-001 | preserved |
| Lifecycle projection | VE-003 | exact transition mappings only |
| Receipt derivation | VE-004 | downstream; cannot create Event truth |
| Target observation | VE-005 | non-authoritative |
| Interpretation and append authority | VE-006 Execution Boundary | preserved |
| Unique head/append position mechanism | protected environment | supplied input; not standardized here |
| Event-type meaning | complete immutable Event-type contract | selected solely by complete identifier |
| Rule content reference | Draft Rule representation/content-identity authority | used only when explicitly imported |
| Policy reference | event-type contract plus Policy owner | bounded fixture exposes missing reusable representation |

No authority is transferred to the Adapter, Receipt, Policy, Rule, delivery
system, timestamp, or current registry state.

## 11. Ambiguities and dependencies for Gap Analysis

The scenario does not resolve the following items.

### GAP-CANDIDATE-1 — concrete lifecycle Event-type profile

The Event contract requires complete authority-scoped, immutable,
version-specific identifiers and historically fixed transitive dependencies.
VE-003 currently publishes lifecycle local names and transition semantics, but
the repository does not yet contain a concrete reusable Event-type profile
that allocates complete identifiers and binds them to those VE-003 triggers.

This scenario can test the rule with explicit non-normative fixtures. It cannot
turn those fixtures into normative allocations. Gap Analysis must determine
whether the next work is an Event-type profile, VE-003 reconciliation, or
another governed specification step.

Classification here: **SPECIFICATION DEPENDENCY; NOT RESOLVED**.

### GAP-CANDIDATE-2 — portable Policy reference

VE-002 names Policy as a reference category, but no current authoritative
portable Policy artifact identity/reference contract is available for P-A.
The scenario-local P-A is sufficient to test permission ownership, not
cross-system Policy reference interoperability.

Classification here: **POLICY-AUTHORITY DEPENDENCY; NOT RESOLVED**.

### DEPENDENCY-3 — historical contract packaging and retrieval

The Draft requires exact historically retained contracts and dependencies but
deliberately does not define a package format, network resolver, registry, or
distribution protocol. Both implementations converge when exact material is
available and fail closed when it is absent. Whether a portable packaging
profile is necessary remains a later Gap Analysis question.

Classification here: **DEPLOYMENT/REPRESENTATION DEPENDENCY; SEMANTIC FAILURE
BEHAVIOR CLOSED**.

### DEPENDENCY-4 — duplicate-delivery acknowledgement

The authoritative Event occurrence and projection are deterministic, but the
transport-level acknowledgement of an identical repeated delivery is not
standardized. That response does not alter Event semantics.

Classification here: **TRANSPORT/DEPLOYMENT DEPENDENCY; NO EVENT-SEMANTIC
DIVERGENCE**.

### DEPENDENCY-5 — protected-environment serialization mechanism

The unique predecessor/head and append position are required inputs. The
mechanism establishing them remains outside this contract. No implementation
may infer a winner while the input is unresolved.

Classification here: **PROTECTED-ENVIRONMENT DEPENDENCY; NO CONSENSUS
PRIMITIVE JUSTIFIED BY THIS SCENARIO**.

No tested input produces a consequentially ambiguous authoritative history or
Lifecycle result once these declared external inputs are held equal.

## 12. Architectural pressure

The scenario introduces no need for:

- a new Event, Branch, Fork, Proposal, Consensus, Leader, Sequence,
  EventReference, PolicyReference, RuleReference, Evidence, or Attempt
  primitive;
- a global Event-type registry or network resolver;
- a global Event order;
- Event canonical bytes, Event digest, signature, or cryptographic profile;
- mutation of VE-002, VE-003, VE-004, or Execution Right;
- treating Receipt, Rule, Policy, or Adapter output as Event authority.

The six Architectural Decision Tests remain pressure-testable:

| Test | Scenario evidence |
|---|---|
| Founding Principles consistency | history stays append-only; state is replayed; observations and derived Receipts do not create truth |
| Primitive burden | every case remains owned by the six primitives plus declared profile/deployment dependencies |
| Removability | Event-type binding and unique stream position cannot be removed without semantic divergence; optional profile details remain removable |
| Twenty-year durability | old meaning depends only on recorded immutable authority, never future names or registry state |
| Independent implementability | P and R converge on all 23 semantic outcomes |
| Reduced conceptual complexity | one complete type identifier and one per-Action sequence suffice; no selector or global order is added |

**Architectural Decision Tests under scenario pressure: 6/6 PASS.**

RFC required by this scenario alone: **NO**.

ADR required by this scenario alone: **NO**.

Any normative response to the recorded candidates must be classified by the
subsequent Gap Analysis; this scenario does not pre-authorize a change.

## 13. Scenario conclusion

The bounded Draft Event contract produces deterministic authoritative history
and replay behavior for success, known failure, unresolved external outcome,
authority collision, retargeting, missing authority material, concurrency,
delivery disorder, sequence exhaustion, null/extension evolution, and
Policy/Rule references.

Two independent implementations converge on all 23 semantic cases when given
the same immutable contracts and protected-environment decisions. No test
requires global order, consensus, a registry, cryptography, a new primitive,
or a change to Approved VE-002.

The scenario nevertheless exposes two concrete specification candidates:

1. no reusable authoritative lifecycle Event-type profile currently allocates
   the complete identifiers required by the Draft; and
2. no portable Policy reference identity/representation currently closes P-A.

Those are recorded for Gap Analysis, not solved here. Historical contract
packaging, duplicate-delivery acknowledgement, and protected-environment
serialization remain declared dependencies with deterministic semantic
failure boundaries.

```text
RS-EVENT-001 scenario execution = PASS WITH RECORDED DEPENDENCIES
EVENT SEMANTIC DIVERGENCE = NONE IN TESTED CASES
GAP ANALYSIS READY = YES
```

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-22 | Initial non-normative two-implementation pressure test of Event semantic binding, ordering, replay, failure, concurrency, delivery, exhaustion, extensions, and references. |
