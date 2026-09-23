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

The scenario analyzes two modeled replay strategies given the same
Action occurrence, immutable Event-type contracts, admitted evidence, protected
environment decisions, and delivered Event records, to derive:

1. the authoritative per-Action Event order;
2. the VE-003 Lifecycle projection;
3. rejection versus unsupported interpretation;
4. the boundary between Event semantics and protected-environment assignment.

These are documented case analyses, not independently executed implementations
or empirical interoperability evidence. No executable scenario harness or
scenario execution results are supplied by this document. Documentation checks
do not execute these cases.

The architecture under analysis is:

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

Each symbol `Enn` used below has `event_id = H32(nn)`.
This notation does not make `event_id` an integer or allocate an Event wire map.

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

`T(n)`, for integer `n` in `0..59`, denotes the exact abstract UTC instant
`2026-11-17T15:00:` followed by the two-decimal-digit second `n` and `Z`.
These 60 instants are the entire bounded fixture time domain; this is not a
general timestamp profile or wire format. Equality is equality of `n`, order is
ascending `n`, and precision is one whole second, with no rounding, coercion,
local-time conversion, or timestamp substitution.

`TIME-A-1` uses that domain and UTC time scale. For each Authority A type,
`occurred_at` asserts the instant the fact in its §4 row occurred: creation of
the authoritative Action, validation start or success, policy evaluation
completion or recording, authorization establishment, material execution
start, or target-owned commitment/known failure, respectively. The Boundary
must have admitted evidence establishing that fact's exact instant. Transport
arrival and storage time are not substitutes. The positive fixtures explicitly
stipulate that this evidence supplies the listed instant; they do not validate
a clock service or real Lynx evidence source.

If the fact's time is unavailable, uncertain, outside this bounded domain, or
only approximately known, no conforming candidate can be constructed under
`TIME-A-1`. No null, default, interval, or estimated instant is admitted. This
is distinct from replay without the time contract itself: unavailable contract
material makes interpretation unsupported, not a retroactive rejection of
already authoritative history. Every Authority A contract below immutably
imports exactly this `TIME-A-1` definition.

`TIME-B-1` is a separate, fully specified fixture dependency with the same
60-instant UTC domain, precision, equality, comparison, and no-substitution
rules. Its time question is exclusively when Authority B's isolated simulation
finished. The Boundary must admit Authority B simulator evidence giving that
exact instant. Unavailable, uncertain, approximate, or out-of-domain time
prevents conforming append; unavailable `TIME-B-1` material during replay makes
the Event unsupported. It does not assert target settlement time. T1 supplies
the exact contract and admitted simulation-finish evidence at `T(06)`.

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
| `ET(A,"POLICY_EVALUATED",1)` | the selected policy evaluation completed | no transition | required reference pair in §4.1; actor optional under §4.2; component/payload forbidden | admitted evaluation result |
| `ET(A,"POLICY_RECORDED",1)` | an exact Policy artifact was recorded for traceability | no transition | required singleton reference collection `[P-A]` under §4.1; actor/component/payload forbidden | admitted Policy record |
| `ET(A,"AUTHORIZATION_GRANTED",1)` | execution authorization was established | `READY -> AUTHORIZED` | optional fields forbidden | admitted authorization result |
| `ET(A,"EXECUTION_STARTED",1)` | material execution began | `AUTHORIZED -> EXECUTING` | optional fields forbidden | Boundary invoked the admitted Adapter operation |
| `ET(A,"EXECUTION_COMPLETED",1)` | the bounded external effect was established as committed | `EXECUTING -> COMPLETED` | optional fields forbidden | sufficient target-owned settlement evidence |
| `ET(A,"EXECUTION_FAILED",1)` | execution began and resolved as a known failure | `EXECUTING -> FAILED` | optional fields forbidden | sufficient target-owned rejection evidence |

Unknown distinct top-level extensions are permitted as opaque context by each
fixture contract. They have no truth or Lifecycle effect. A known optional
field, if a contract permits one, must be non-null.

No case appends `RECEIPT_GENERATED`; the original unused, underdefined row is
omitted rather than presented as a complete fixture. V1 concerns an offered
Receipt assertion, not a Receipt-generation Event or a new Receipt profile.

Authority B permanently binds its same-local-name identifier to a different
fact and no Lifecycle transition:

| Complete identifier | Asserted fact | Projection | Dependencies |
|---|---|---|---|
| `ET(B,"EXECUTION_COMPLETED",1)` | Authority B's isolated simulation finished | no transition | exact `TIME-B-1` in §3.3; no VE-003 trigger; actor/component/payload/references forbidden; Boundary-admitted simulation-finish evidence required |

This difference illustrates the contract's existing rule that a local name is
not the semantic identifier. Unknown distinct extensions remain opaque context
under Authority B as under Authority A.

### 4.1 Exact reference ownership for the policy event

The Authority A `POLICY_EVALUATED` fixture permits exactly one ordered pair:

```text
references = [P-A, R1]
```

`P-A` is one fixed opaque Policy-artifact handle supplied by the fixture's
Policy owner and selected by the Boundary. Its admitted abstract reference
domain is the singleton `{P-A}`; equality is identity of that supplied handle,
not string conversion or comparison with another reference kind. The artifact
and its selection are stipulated inputs; this scenario neither executes its
policy nor infers its legitimacy from the reference. VE-002 directly admits
the Policy category, but the repository has no current portable Policy-reference
representation. This handle tests permission ownership only, not cross-system
Policy identity or serialization.

`R1` is the exact Rule content reference under the Draft Rule authority:

```text
R1.rule_digest =
  h'86ec5cc99b17d49f00e0f3f05172164787e39ff28d59ee4575f661273120b247'
```

The event-type contract explicitly permits that Rule reference and imports the
Draft v0.1 canonical Rule representation/content-identity specification. Rule
is not treated as a synonym for Policy and is not attributed directly to
VE-002.

For `POLICY_EVALUATED`, minimum and maximum reference cardinality are both two;
the first member is exactly P-A and the second is exactly R1. Order matters and
duplicates, other handles/digests, and additional members are forbidden.
For `POLICY_RECORDED`, minimum and maximum cardinality are both one, and the
only admitted collection is `[P-A]`; it imports no Rule contract. Both
collections are contextual traceability only. Neither supplies Event order,
evidence of target truth, authorization, or a Lifecycle transition.

### 4.2 Actor domain

Only `POLICY_EVALUATED` permits `actor`: zero or one abstract text value,
exactly the ASCII string `scenario-policy-engine` when present. Equality is
exact character equality; no aliases, normalization, coercion, structured
values, or null are accepted. Absence has no default. The value is contextual
attribution to the fixture policy engine only and confers no authority, trust,
identity proof, or transition. All other fixture types forbid actor.

### 4.3 Common input and authority assumptions

Every Event or candidate has the exact §2 `action_id` and §3.4 `spec_version`.
Fields omitted by the fixture are absent, not null; extensions are absent
unless a case adds one. Event maps have distinct member names. Candidate
mutations occur before append in isolated counterfactual histories, never by
editing retained Events. Nothing here adds an Event field.

Except where a case states otherwise, all exact contract/dependency material
is available, the Boundary has admitted the row's evidence including its time,
and the protected environment supplies the stated unique predecessor and append
position. These are explicit fixture inputs, not results proved by this
scenario. Replays begin at `NONE` with no cached or prevalidated state.
Historical replay inputs have pre-established authoritative membership and
retention support; storage presence alone does not establish membership.
Missing interpretation material does not remove that historical membership.

Evidence conditions are abstract Boundary-admission inputs, not a newly closed
Lynx evidence-authentication profile. Under §6/§15 of the Draft, a missing
required dependency prohibits that Event's semantic effect even when its
projection mapping happens to be known from another source.

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
  action_id: <exact action_id in §2>,
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

### 6.3 Additional exact candidates and sequence-boundary history

These records inherit only the common fields/absence rules in §4.3. They are
not aliases for another Event occurrence.

| Record | Type | Sequence | Time | References | Admitted fact/evidence when selected |
|---|---|---:|---|---|---|
| E18 | `ET(B,"EXECUTION_COMPLETED",1)` | 70 | `T(06)` | absent | Authority B simulation finished, not settlement |
| E19 | `ET(A,"POLICY_RECORDED",1)` | 40 | `T(03)` | `[P-A]` | Boundary recorded the selected Policy artifact |
| E20 | `ET(A,"EXECUTION_STARTED",1)` | `18446744073709551614` | `T(05)` | absent | Boundary invoked the admitted Adapter operation |
| E21 | `ET(A,"EXECUTION_COMPLETED",1)` | `18446744073709551615` | `T(06)` | absent | sufficient target-owned settlement evidence |
| E22 | `ET(A,"POLICY_RECORDED",1)` | no admissible next ordinal in S2 | `T(08)` | `[P-A]` | Boundary has a Policy recording fact, but cannot append after exhaustion |

E22 is explicitly an append request, not a conforming Event missing a required
field. It cannot acquire a valid sequence; H32(22) is only its proposed ID.

Let `S30 = [E01@10,E02@20,E03@30]`, `S50 = S30 + [E04@40,E05@50]`,
`S60 = S50 + [E06@60]`, and `S = S60 + [E07@70]`.
The complete high-sequence history is:

```text
H = S50 + [E20@18446744073709551614,E21@18446744073709551615]
```

It is a separate counterfactual history of the same Action, not a renumbering
of stored E06/E07. Replay from `NONE` derives, in order, `CREATED`,
`VALIDATING`, `READY`, `READY`, `AUTHORIZED`, `EXECUTING`, `COMPLETED`.
S1 constructs H. S2 starts with H and proposes E22: the otherwise
non-transition-causing Policy record cannot append because no larger uint64
ordinal exists; retained H still projects to `COMPLETED`.
S3 starts with `S50 + [E20@18446744073709551614]` and proposes E21 with its
sequence changed before append to `18446744073709551616`; rejection leaves
that exact prefix and state `EXECUTING`.

### 6.4 Dependency-availability timelines

T3, T4, and R4 are historical-replay cases. At original admission all required
material was available and the Boundary admitted the records. Before a fresh
replay starts, the replay consumer lacks precisely the material listed below,
throughout that replay. It retains the specified membership, has no trusted
checkpoint, and does not receive a cached Lifecycle state as authority.

| Case | Retained history | Missing throughout fresh replay | Derivation from `NONE` |
|---|---|---|---|
| T3 | S | Authority A completion contract only | E01–E06 derive `EXECUTING`; E07 is unsupported and cannot supply the terminal transition |
| T4 | S | `TIME-A-1`, before E01 is interpreted and through E07 | Every Event E01–E07 requires it; all are unsupported; no Event advances the initial `NONE` accumulator and no Lifecycle state is established |
| R4 | `S30 + [E04@40]`, with no E05–E07 in this case | exact Rule representation/content-identity authority imported by `POLICY_EVALUATED` | E01–E03 derive `READY`; E04 is retained but unsupported, including its Rule reference; E04 has no semantic effect; supported-prefix projection stays `READY` |

`NONE` in T4 is the replay algorithm's initial marker, not a new Lifecycle
state or a claim that the Action does not exist. `EXECUTING` in T3 and `READY`
in R4 are explicitly partial projections, not claims of fully interpreted
history. Missing authority is reported as unsupported; it is not silently
treated as a resolved non-transition Event. These cases do not prescribe a
replay API, error code, checkpoint format, or recovery protocol.

## 7. Two modeled replay strategies

P and R are contrasting prose strategies, **not independently executed
implementations**. Their expected results are reasoned from the same explicit
fixtures and cited rules. This comparison can expose missing assumptions but
cannot prove implementation independence or empirical convergence.

### Strategy P — admission-first, then replay

1. For candidate cases, resolve base/type/dependency contracts and check fields,
   evidence, references, identity, and sequence against the supplied prefix.
2. Admit a candidate only with sufficient evidence and the protected
   environment's unique append assignment. Rejection preserves the prefix.
3. For historical cases, use the supplied authoritative membership without
   re-appending delivery records or rejecting historical membership solely
   because interpretation material is now missing.
4. Starting at `NONE`, traverse that membership in ascending sequence order.
   Resolve each Event and all required dependencies before semantic use.
5. Apply the exact VE-003 mapping of supported Events; record unsupported
   Events without deriving their facts or transitions. Report any partial
   projection as partial, never as complete-history success.

### Strategy R — history-oriented analysis

1. Separate pre-established authoritative membership, new append candidates,
   and delivery copies. Merely being stored grants no authority.
2. Validate the identities and unique increasing sequence of the authoritative
   order. Resolve contracts lazily per Event rather than eagerly per candidate.
3. For candidate cases, check the same admission obligations as P, including
   field domains, null rules, references, evidence, and protected selection;
   a candidate is not a historical member until those obligations are met.
4. Starting at `NONE`, fold supported transition-causing Events through VE-003
   in sequence order. Retain unsupported members with an explicit unsupported
   result and no semantic effect; distinguish a partial projection.
5. Keep identical delivery copies separate from Event occurrence membership;
   never deduplicate distinct occurrences by equal payload.

Neither strategy may use a local-name switch, deployment-selected meaning,
arrival order, timestamp, current resolver contents, or cached state to choose
authority. Both receive the same authoritative assignments as external inputs;
agreement on those supplied assignments is not a demonstrated serialization
mechanism. The strategies' differing organization is not evidence that two
engineering teams implemented them independently.

## 8. Adversarial comparison matrix

Classification terms are exact for this scenario:

- **deterministic** — the cited rules and explicit fixture inputs determine
  the stated semantic result in this documented analysis, not a measured run;
- **protected environment** — the choice is an externally supplied assignment
  prerequisite rather than a meaning inferred by Event replay;
- **ambiguous** — the current authorities permit consequentially different
  semantic outcomes for the same supplied inputs;
- **unsupported** — history may be retained, but missing immutable authority
  prevents interpretation or projection.

History symbols and records are defined in §§5–6. Every mutation is isolated;
it does not alter another case. Unless the matrix specifies delivery disorder,
delivery follows the stated sequence order. Additional exact case inputs are:

- T2 supplies E07 after S60, but presents a replacement contract mapping the
  unchanged A completion identifier to known failure/`FAILED`. The original
  binding is available for comparison; the replacement is rejected, not used.
- O1–O3 supply E07 and E17 as competing proposals after S60. In O1 neither
  proposal's evidence is admitted and no next occurrence is selected. In O2
  the Boundary admits only completion evidence and the protected environment
  selects E07; in O3 it admits only failure evidence and selects E17. Selection
  alone never proves either contradictory fact; the unselected proposal is
  neither admitted evidence nor an authoritative Event.
- D2 delivers `[E01,E02,E03,E04,E04,E05,E06,E07]` with both E04 copies
  field-identical and with authoritative membership fixed to S. No wire bytes
  are stipulated. D1 similarly supplies S as membership independently of its
  stated delivery order.
- N1 constructs from the beginning a separate candidate history whose E04 has
  `actor = null`. After E04 is rejected, the protected environment assigns
  E05@50 after E03@30, then E06@60 and E07@70; their evidence is independently
  admitted. No previously committed E04 is deleted. N2 uses S with only
  E04's added unknown `future_code = null`. N3 replays that retained N2 history
  under the same historical contracts; later software's hypothetical non-null
  `future_code` definition belongs to a different, unselected authority.
- R2 supplies S50 and E06 with only `references = [P-A]` added, and no E07.
  R3 supplies S30 and E19 with its references replaced by `[R1]`, with no
  subsequent candidates. R1 is baseline S; R4 has the timeline in §6.4.
- V1 supplies S60 and E07 with target-owned completion evidence absent;
  an unadmitted Receipt assertion claiming completion is the sole offered
  justification. It is not itself established as a valid derived Receipt.
  All other candidate fields are unchanged.

| ID | Case | Authoritative order | Replay/projection result | Governing rule/owner | Deterministic | Protected environment | Ambiguous | Unsupported |
|---|---|---|---|---|---|---|---|---|
| B1 | Normal success replay | `S` | `COMPLETED`; Receipt derivation now permitted | VE-002 order; exact type contracts; VE-003 | YES | append positions already supplied | NO | NO |
| B2 | Known-failure replay | `S60 < E17@70` | `FAILED` | target evidence -> Boundary; exact failure contract; VE-003 | YES | append position already supplied | NO | NO |
| B3 | Uncertain Adapter observation | `S60` | `EXECUTING`; no terminal Event or Receipt | VE-005 observation; VE-006 authority; VE-004 terminal rule | YES | no terminal append selected | NO | NO |
| T1 | Authority B uses local name `EXECUTION_COMPLETED` at 70 | `S60 < E18@70` | Authority B fact retained; no VE-003 transition; state `EXECUTING` | complete identifier equality and Authority B contract | YES | append position supplied | NO | NO |
| T2 | Authority A completion identifier is presented with altered failure semantics | `S60`; candidate excluded | reject retargeting; state `EXECUTING` | immutable identifier binding; Draft N19 | YES | no meaning choice permitted | NO | NO |
| T3 | Exact historical Authority A completion contract unavailable during replay | retained order `S` | stop semantic projection at E07 as unsupported; no `COMPLETED` fact derived; last safely derived state `EXECUTING` | Draft §§6,15; N20 | YES | NO | NO | YES |
| T4 | `TIME-A-1` unavailable before fresh replay starts and throughout E01–E07 (§6.4) | retained order `S` | all seven Events unsupported; accumulator remains `NONE`; no Lifecycle state established | Draft §§6,15 transitive dependency binding; N21 | YES | NO | NO | YES |
| O1 | Completion and failure candidates both claim next position 70; no selected successor to E06 | authoritative order remains `S60` | both remain proposals; state `EXECUTING` | unique-head/append-position precondition; N23 | YES | YES: selection remains pending | NO | NO |
| O2 | Protected environment selects completion candidate | `S60 < E07@70` | `COMPLETED`; unselected failure candidate is not history | VE-006 append authority plus protected-environment selection | YES | YES: exact selected occurrence supplied | NO | NO |
| O3 | Protected environment selects failure candidate | `S60 < E17@70` | `FAILED`; unselected completion candidate is not history | VE-006 append authority plus protected-environment selection | YES | YES: exact selected occurrence supplied | NO | NO |
| D1 | Authoritative members delivered `E07,E03,E01,E06,E02,E05,E04` | reconstruct `S` | `COMPLETED` | sequence orders validated authoritative history; delivery is irrelevant | YES | authoritative membership pre-established | NO | NO |
| D2 | E04 delivery record appears twice, field-identical | reconstruct `S` with one E04 occurrence | `COMPLETED`; second delivery cannot create another Event; acknowledgement is transport freedom (§8.1) | VE-002 occurrence identity; duplicate delivery is not a new append | YES for history/projection | authoritative membership pre-established | NO | NO |
| S1 | Exact H in §6.3 appends E20 at `2^64-2`, then E21 at `2^64-1` | `H = S50 < E20@(2^64-2) < E21@(2^64-1)` | accept maximum; `AUTHORIZED -> EXECUTING -> COMPLETED` after S50 | Draft §8/P9; VE-003 transitions | YES | YES: positions supplied | NO | NO |
| S2 | E22 Policy-recording append request follows H | H unchanged | fail closed for exhaustion; no E22 Event appended; `COMPLETED` retained | Draft §8 exhaustion rule; N22 | YES | no greater position exists | NO | NO |
| S3 | E21 sequence mutated to `2^64` after `S50 < E20@(2^64-2)` | `S50 < E20@(2^64-2)` unchanged | reject as nonconforming; `EXECUTING`; no truncation/widening/wrap | fixed semantic domain; Draft §15 | YES | NO | NO | NO |
| N1 | E04 carries known optional `actor = null` before append | `S30 < E05@50 < E06@60 < E07@70` | E04 rejected; independently admitted later Events derive `COMPLETED` | top-level null rule; N3; permitted sequence gap | YES | later positions explicitly supplied | NO | NO |
| N2 | E04 carries distinct unknown extension `future_code = null` | `S` | accept opaque extension; `COMPLETED`; no projection effect | base unknown-member rule; P3 | YES | NO | NO | NO |
| N3 | Later software recognizes `future_code` as a non-null known field | historical order remains `S` | old null remains opaque under recorded VE-002/type authority; `COMPLETED` | historical extension collision rule; P11 | YES | NO | NO | NO |
| R1 | E04 contains exact `[P-A,R1]` references permitted by its contract | `S` | references retained; no transition; final `COMPLETED` | VE-002 Policy category plus explicit Rule-authority import | YES | NO | NO | NO |
| R2 | E06 carries `[P-A]` although its type forbids references | S50 unchanged; E06 excluded | reject as nonconforming; `AUTHORIZED` | exact Event-type optional-field contract; Draft §§5,12,15 | YES | NO | NO | NO |
| R3 | E19 `POLICY_RECORDED` receives `[R1]` instead of `[P-A]` | S30 unchanged; E19 excluded | reject; Rule is not admitted as Policy; `READY` | VE-002 reference list and Draft §12 Rule authority boundary | YES | NO | NO | NO |
| R4 | E04's required Rule authority unavailable throughout fresh replay (§6.4) | retained `S30 < E04@40` | E04 unsupported with no semantic effect; supported prefix derives `READY`; whole-history interpretation remains incomplete | Draft §§6,15; required reference dependency unavailable; N13/N21 | YES | NO | NO | YES |
| V1 | Receipt assertion alone is offered as proof that completion occurred | order remains `S60` | reject completion append; state `EXECUTING` | VE-004 Receipt is derived and cannot create truth | YES | NO | NO | NO |

### 8.1 Duplicate-delivery boundary

D2 has one deliberately limited non-semantic freedom: a transport endpoint may
acknowledge an identical repeated delivery idempotently or report a duplicate.
Neither response may create a second Event, change authoritative membership,
or alter projection. The authoritative result is therefore deterministic even
though this scenario does not standardize transport acknowledgements.

### 8.2 Concurrent-candidate boundary

O1–O3 do not solve coordination. The protected environment supplies either no
selection or one exact selected Event occurrence. Both modeled strategies consume
that assignment alongside the separately specified Boundary evidence admission.
They do not elect a leader, compare arrival times, choose the lower
`event_id`, or turn competing proposals into branches of authoritative history.

## 9. Documented model comparison and evidence limits

The following are expected deductions, not execution logs. Matching entries
are a consistency check on the prose strategies, not proof of independent
implementation. No runner, separate codebases, or empirical run is claimed.

| Check | Strategy P: expected result | Strategy R: expected result | Evidence type |
|---|---|---|---|
| B1 / B2 / B3 | `COMPLETED` / `FAILED` / `EXECUTING` | `COMPLETED` / `FAILED` / `EXECUTING` | rule-derived analysis |
| T1 authority collision | E18 resolved under B; `EXECUTING` | E18 resolved under B; `EXECUTING` | rule-derived analysis |
| T2 retargeting | reject replacement; `EXECUTING` | reject replacement; `EXECUTING` | rule-derived analysis |
| T3 missing completion contract | retain S; partial `EXECUTING`; E07 unsupported | retain S; partial `EXECUTING`; E07 unsupported | rule-derived analysis |
| T4 missing shared time dependency | retain S; all unsupported; no state derived | retain S; all unsupported; no state derived | rule-derived analysis |
| O1 / O2 / O3 | `EXECUTING` / `COMPLETED` / `FAILED` with supplied admission/selection | same three conditional results | analysis conditional on protected inputs |
| D1 / D2 | S reconstructed; `COMPLETED` | S reconstructed; `COMPLETED` | analysis of supplied membership |
| S1 / S2 / S3 | maximum accepted: `COMPLETED`; exhausted: unchanged `COMPLETED`; overflow rejected: `EXECUTING` | same three distinct histories/results | rule-derived analysis |
| N1 / N2 / N3 | null rejected / opaque null / historical interpretation; each stated history derives `COMPLETED` | same admission and historical-interpretation results | rule-derived analysis |
| R1 / R2 / R3 | `COMPLETED` / rejection with `AUTHORIZED` / rejection with `READY` | same three histories/results | rule-derived analysis |
| R4 missing Rule authority | retain S30 + E04; E04 unsupported; partial `READY` | retain S30 + E04; E04 unsupported; partial `READY` | rule-derived analysis |
| V1 Receipt assertion | cannot justify append; `EXECUTING` | cannot justify append; `EXECUTING` | rule-derived analysis |

```text
documented cases = 23
modeled results = derived from stated inputs and cited rules
scenario executions supplied = none
independent implementation convergence = NOT ESTABLISHED
```

All 23 cases now identify their record mutations, initial history, dependency
availability, external admission/selection assumptions, governing rules, and
resulting order/projection. No consequential ambiguity is identified in these
bounded deductions; this is not evidence that implementations cannot diverge.
An implementation comparison remains outstanding. Any ambiguity discovered by
that comparison must be recorded rather than repaired through hidden fixture
or resolver assumptions.

Governance §§16–18 distinguishes approval/stability evidence from a Draft
non-normative scenario. Neither those provisions nor the scenario maturity
conventions require this correction to introduce an executable harness now.
The Event contract §21 recommends independent implementations; this document
does not satisfy that empirical objective. The repository's documentation
validator and Node documentation-validator tests establish documentation
integrity only, not the Event results listed above.

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
distribution protocol. The modeled strategies apply the contract's unsupported
behavior when required material is absent; empirical agreement is not established.
Whether a portable packaging profile is necessary remains a later Gap Analysis
question.

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

The documented cases identify no remaining consequential semantic ambiguity
under their explicit fixture assumptions. The five items above remain open in
their stated profile, implementation, transport, or protected-environment scope;
their absence is not silently filled by normative scenario rules. Executable
interoperability evidence remains unavailable and is a separate limitation.

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
| Independent implementability | explicit model inputs and deductions are supplied; independent implementation evidence remains outstanding |
| Reduced conceptual complexity | one complete type identifier and one per-Action sequence suffice; no selector or global order is added |

These are architectural assessments of the documented model, not six executed
tests. Independent implementability is **not empirically established**; no
blanket proven `6/6 PASS` is claimed.

RFC required by this scenario alone: **NO**.

ADR required by this scenario alone: **NO**.

Any normative response to the recorded candidates must be classified by the
subsequent Gap Analysis; this scenario does not pre-authorize a change.

## 13. Scenario conclusion

The documented analysis derives expected authoritative order, admission, and
replay outcomes for success, known failure, unresolved external outcome,
authority collision, retargeting, missing authority material, concurrency,
delivery disorder, sequence exhaustion, null/extension evolution, and
Policy/Rule references. It supplies 23 cases for two modeled strategies and
explicitly distinguishes unsupported interpretation from derived Lifecycle
state. It does not report scenario execution or independent convergence.

No modeled case requires global order, consensus, a registry, cryptography,
a new primitive, or a change to Approved VE-002. Supplied Boundary admission
and protected ordering decisions are assumptions, not proved mechanisms.

The scenario nevertheless exposes two concrete specification candidates:

1. no reusable authoritative lifecycle Event-type profile currently allocates
   the complete identifiers required by the Draft; and
2. no portable Policy reference identity/representation currently closes P-A.

Those are recorded for Gap Analysis, not solved here. Historical contract
packaging, duplicate-delivery acknowledgement, and protected-environment
serialization remain declared dependencies with deterministic semantic
failure boundaries.

```text
RS-EVENT-001 = DOCUMENTED CASE ANALYSIS WITH RECORDED DEPENDENCIES
EXECUTABLE SCENARIO EVIDENCE = NOT PROVIDED
INDEPENDENT CONVERGENCE = NOT ESTABLISHED
REMAINING SEMANTIC AMBIGUITY = NONE IDENTIFIED UNDER EXPLICIT FIXTURE ASSUMPTIONS
```

This document remains a Draft scenario, not a Validated or normative artifact.
Subsequent review and any later Gap Analysis must carry the empirical-evidence
limitation forward; documentary consistency must not be promoted to measured
interoperability or approval of the Draft contract.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-22 | Review correction: completed bounded fixture contracts and exact replay cases; corrected dependency timelines and transport classification; replaced unsupported independent-execution/convergence claims with explicitly documented model analysis and evidence limitations. |
| 0.1 | 2026-09-22 | Initial non-normative Event scenario; its original independent-execution and convergence claims were unsubstantiated and are withdrawn by the correction above. |
