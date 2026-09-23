---
id: BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
title: Bounded Lifecycle Event-Type Semantic Profile
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Specification
author: Verified Execution Editorial Board
created: 2026-09-22
updated: 2026-09-22
depends_on:
  - EVENT-SEMANTIC-FIELD-CONTRACT
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
related_documents:
  - GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS
  - RS-EVENT-001
  - RS-EVENT-001-EXECUTABLE-COMPARISON
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Bounded Lifecycle Event-Type Semantic Profile

**Draft v0.1 — proposed semantic profile; not Approved or representation-ready.**

## 1. Authority, purpose and completeness

This is the single next artifact selected by the merged
[RS-EVENT-001 gap analysis §§10–11](../kernel-analysis/GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS.md).
It proposes reusable meanings for exactly seven existing lifecycle triggers,
not a replacement Lifecycle or a universal Event profile. Capitalized MUST,
MUST NOT, SHOULD and MAY constrain only explicit use of this Draft, subject
to the blockers below. Approved VE-002 takes precedence in any conflict.

**Existing requirements** are attributed to their owners in the source tables.
**Proposed choices** are this Draft's type-identifier convention, restricted
time domain, optional-field exclusions and review examples. They are not
Approved requirements, scenario-derived defaults or permanent global allocations.

The profile specifies exact proposed identifiers, abstract field domains and
transition mappings. It does **not yet close portable producer conformance**:
exact evidence-recognition/retention bindings and trusted occurrence-time
establishment remain unresolved (§10). No implementation may fill those gaps
with an undocumented admission Boolean, local policy or mutable resolver and
claim complete conformance to these type identifiers. Abstract examples with
expressly assumed admissible evidence are conditional examples, not a solution
to those dependencies. Event representation work remains blocked.

The [comparison report](../kernel-analysis/RS-EVENT-001-EXECUTABLE-COMPARISON.md)
establishes 23 matched cases and 24 detected mutants, with same-author Python
and Node implementations. It neither executes this new profile nor establishes
independent-team replication, general conformance or approval. Its source pins,
fixture identifiers, 60-instant time window and evidence assumptions are not
normative imports here.

## 2. Immutable source basis and dependency interpretation

All repository sources used below are the exact path bytes in commit
`56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f` of `cpbrands/VerifiedExecution`.
Relative links aid navigation; the recorded commit, not the current branch,
selects the source revision. Matching a document's version text alone is
insufficient, especially for Drafts with several edits under one version.

| Source and maturity at that commit | Imported responsibility |
|---|---|
| [Event Semantic Field Contract v0.1, Draft](EVENT-SEMANTIC-FIELD-CONTRACT.md), §§4–15 | Required fields, immutable type binding, time/field duties, uint64 sequence, unknown extensions, rejection versus unsupported interpretation |
| [VE-001 v0.2, Approved](VE-001-action-specification.md) | Action occurrence/content distinction and Action ownership; no Event-driven mutation of Action |
| [VE-002 v0.2, Approved](VE-002-event-specification.md), §§2–9, 11–15, 18–24 | Event facts, identity, explanation, immutable per-Action history and replay |
| [VE-003 v0.1, Draft](VE-003-lifecycle.md), §§8–11, 15–19, 29–32 | State meanings, exact legal transitions, projection and terminality; not authorization decisions |
| [VE-004 v0.2, Draft](VE-004-receipt-specification.md), §§2–4, 7–14 | Receipt is derived; terminal state does not by itself establish external commit |
| [VE-005 v0.1, Draft](VE-005-adapter-specification.md), §§5–10 | Translation/observations, not Event authority |
| [VE-006 v0.1, Draft](VE-006-execution-boundary-specification.md), §§5–18 | Boundary admission/append, identity/delegation/policy/approval obligations and deterministic history |

Every repository-local normative import needed to interpret these sources is
likewise resolved at that same commit and its exact path, recursively, including
VE-000 and the existing Action/OccurrenceId owners. This is a source snapshot
rule, not a new digest primitive or package protocol. A future specification
version or changed file is not substituted automatically. Unavailable, ambiguous
or conflicting required material blocks the affected interpretation; no
best-effort dependency omission is allowed. A source pin establishes which
text is meant, not its approval, truth or trustworthiness.

This snapshot does not turn a source's unresolved dependency into a definition.
In particular, concrete authorization, execution-result, evidence-binding and
trusted time-source contracts are not supplied merely by pinning VE-006 or
VE-004. Their closure remains the explicit §10 gate. No `latest`, implicit
deployment-selected domain or placeholder handle completes that closure.

## 3. Complete proposed type identifiers

The following notation defines an **abstract value**, not a string syntax,
URI retrieval rule, tuple wire format, map layout or Event field addition:

```text
L(K) = (
  authority = "https://github.com/cpbrands/VerifiedExecution",
  profile = "BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE",
  revision = "0.1-draft.1",
  kind = K
)
```

Each literal is exact, case-sensitive abstract text. Equality requires all
four components to be equal; there is no aliasing, case folding, Unicode
normalization, URL normalization or same-local-name inference. The authority
literal identifies the repository editorial namespace at publication, not a
network service, issuer of execution authority or universal namespace owner.
It imposes no network access, global registry or live GitHub dependency during
interpretation. Locally retained exact material is valid.

Exactly the seven expansions of `L(K)` in §4 are proposed. A bare `K`, an
RS-EVENT-001 `ET(A,K,1)`, another authority's value, or another revision is not
one of these identifiers. No eighth type is allocated. A local-name switch
cannot select a transition: resolve the complete identifier first.

For this publication, each expansion binds only its §4 row together with all
common rules in this document and the exact §2 source snapshot. The publication
that first defines `0.1-draft.1` must be retained immutably. Later semantic
changes, including resolution of §10 dependencies, require a different
revision component and explicit bindings, even while document status remains
Draft. Reusing these identifiers for completed future contracts would be
retargeting. Editorial version metadata alone cannot authorize retargeting.

These seven are complete **candidate identifier values**, not a claim that
their incomplete producer dependencies are already portable. They are usable
for review/conditional abstract interpretation only until a separately reviewed
revision closes those dependencies. No production type allocation or approval
is inferred from this Draft's existence.

## 4. Seven-kind fact, evidence and projection matrix

Every row inherits §§5–8. The row's time question is exactly when its stated
fact became true, not when evidence arrived or the Event was stored. The
evidence column states necessary admission conditions; §10 identifies what is
still missing to recognize those conditions portably. A transition's legal
shape is not evidence that its fact occurred.

| Complete identifier | Asserted fact / occurrence-time question | Necessary fact-specific evidence | Exact VE-003 v0.1 mapping | Existing source |
|---|---|---|---|---|
| `L(ACTION_CREATED)` | This exact Action occurrence became authoritative | Boundary-established authoritative admission of the exact immutable Action; not merely a proposed request | `NONE → CREATED` | VE-003 §§8.1, 10; Event contract §14 |
| `L(VALIDATION_STARTED)` | Structural/semantic validation of that Action began | Boundary-established actual commencement of applicable Action validation, not queueing or intent to validate | `CREATED → VALIDATING` | VE-003 §§8.2, 10; VE-006 §§5, 7 |
| `L(VALIDATION_SUCCEEDED)` | Applicable validation of that Action succeeded | Completed successful validation against the applicable exact Action/schema rules; absence of an error alone is insufficient | `VALIDATING → READY` | VE-003 §§8.3, 10; VE-001; VE-006 §7 |
| `L(AUTHORIZATION_GRANTED)` | Applicable execution authorization was established | Boundary-established satisfaction of required identity, delegation, policy and approval conditions for this Action/context; a bare Rule result, ready state or actor label is insufficient | `READY → AUTHORIZED` | VE-003 §§8.5, 10, 29–30; VE-006 §§9–12 |
| `L(EXECUTION_STARTED)` | At least one material external execution attempt began | Boundary-admitted evidence of actual material invocation through the Adapter for this Action; authorization, scheduling and intention alone are insufficient | `AUTHORIZED → EXECUTING` | VE-003 §§8.6, 10; VE-005 §§7, 9–10; VE-006 §§14–16 |
| `L(EXECUTION_COMPLETED)` | Governed execution resolved successfully under the applicable Adapter/target semantics | Boundary-admitted authoritative evidence establishing that successful resolution, including target commit when success requires commit; never just submission, timeout, a Receipt assertion or authorization | `EXECUTING → COMPLETED` | VE-003 §§8.7, 10; VE-004 §§7–8, 11–14; VE-006 §§15–16 |
| `L(EXECUTION_FAILED)` | Execution began and resolved as a known failure | Boundary-admitted authoritative known-failure evidence after material execution began; no-response/uncertainty or a pre-execution denial is not known execution failure | `EXECUTING → FAILED` | VE-003 §§8.8–8.9, 10; VE-004 §§7–8; VE-006 §§15–16 |

`NONE` is the initial replay accumulator, not a new Lifecycle state. No other
source-state mapping is supplied by these seven identifiers. Their mapping is
the existing VE-003 table subset, not a narrowing or replacement of that table.
Approval-required, cancellation, expiry and validation-rejection paths remain
outside this profile. An applicable approval path cannot be bypassed by claiming
that it is outside scope. Another governed type profile is required for it.

The completion row deliberately does not generalize the scenario's Lynx
settlement fact to every Action. Success and external commit are distinct under
VE-004. Likewise, `FAILED` alone does not prove no external effect or imply
`NOT_COMMITTED`. The applicable immutable execution semantics must determine
those facts. If they are unavailable, do not infer them from the lifecycle name.
The selected target/evidence contract is an unresolved binding, not a free
runtime parameter hidden in `L(EXECUTION_COMPLETED)` or `L(EXECUTION_FAILED)`.

## 5. Proposed field and time domains

### 5.1 Common Event object

All seven types have exactly one non-null value for each of the six VE-002
required fields. The following rules are inherited unless marked proposed:

| Field | Domain, cardinality and equality |
|---|---|
| `event_id` | Exactly one opaque 32-octet occurrence identifier; exact ordered-octet equality and VE-002 non-reuse rules; generation remains implementation-defined |
| `action_id` | Exactly one Action occurrence identifier, valid and equal to the stream owner's identifier under pinned VE-001; no content-digest or cross-kind substitution |
| `event_type` | Exactly one of the seven complete proposed values in §§3–4; equality is full-value equality |
| `occurred_at` | Exactly one value in the proposed restricted civil-time domain below; no implicit conversion or default |
| `sequence` | Exactly one integer in `0..18446744073709551615`, unique in the Action stream and strictly increasing at append; exact mathematical equality/order |
| `spec_version` | Exactly the abstract specification/version pair `(VE-002, 0.2)`; not this profile revision, application version or compatibility range |

**Proposed restriction:** `actor`, `component`, `payload` and `references` are
forbidden for each of these seven types: presence cardinality zero, admitted
value domain empty, and therefore no value-equality, ordering or duplicate
policy to infer. Empty collections, empty objects and explicit null are present
values, not absence. No default actor, component or evidence is supplied.

This is intentionally a minimal projection profile, not a general account of
everything needed to explain execution. VE-002 §§11, 13 recommends optional
explanation/attribution fields; omitting them avoids an invented portable actor
ontology or reference model, but **does not waive VE-002 §3's explanation
requirement**. The exact means by which these minimal records contain or refer
to sufficient historical explanation has not been demonstrated (§10, B3).
The fixture's absent fields are not evidence that the requirement is met.
Where attribution/payload/references are necessary to establish or explain the
fact, this restricted candidate is not usable; revise the profile scope under
new identifiers rather than silently omit required information.

Unknown, distinct top-level extensions remain permitted opaque context under
the Event contract §13, including structurally valid null values. They cannot
provide missing required evidence, replace known fields, create an eighth type
or change projection. Do not turn an unknown field into a hidden evidence or
Policy-reference channel. No extension is required by these proposed types.
Duplicate member names are rejected before interpretation, including unknown
members; later recognition of a name cannot change historical meaning.

### 5.2 Proposed restricted civil-time domain

This is a reviewable **new profile choice**, not the RS-EVENT-001 time window
or an existing universal VE clock. A value is an abstract seven-integer tuple
`(year, month, day, hour, minute, second, nanosecond)` with:

- year `2000..2099`; month `1..12`;
- day `1..days-in-month` under the proleptic Gregorian rule (31 days for
  months 1, 3, 5, 7, 8, 10, 12; 30 for 4, 6, 9, 11; February 29 in years
  divisible by 4 and not 100 unless also divisible by 400, otherwise 28);
- hour `0..23`; minute and second each `0..59`;
- nanosecond `0..999999999`.

The proposed time scale is UTC; each value denotes the named civil second's
start plus the exact indicated fraction of a second. Domain equality is
componentwise mathematical equality; comparison is lexicographic comparison
of those seven integers. Nanosecond resolution is not a promise of clock
accuracy. This bounded century/precision choice makes domain checks explicit
without assuming the scenario's singleton date, whole-second precision or
60-value domain. Its operational suitability is unproved, not an invariant.

No text spelling, array encoding, UTC-offset normalization, POSIX epoch,
floating-point value or byte layout is defined. Leap-second labels (`second=60`),
leap smearing, local civil time, intervals and approximate/uncertain values are
not admitted by this proposed subset. Do not round, truncate, clamp or
substitute receipt/arrival/append time to force an observation into it. A fact
whose established time cannot be expressed exactly has no conforming candidate
under this proposed revision; that does not make the real-world fact false.

For every kind, the time belongs to the fact in §4. Boundary-owned fact times
need Boundary evidence; external outcome times need evidence from the owner
of that fact. A Boundary clock reading when a target response arrives is not
the target fact's time. An immutable UTC realization/source-authority and
evidence-to-value rule is still missing (B2); this tuple definition alone is
not a closed portable time contract. Neither a system clock nor deployment
preferences can fill it. No global time service is required or created.

Equal times with different sequences are allowed. Comparison of time values
does not select the history order, prove causation or freshness, establish
authorization, or justify cross-Action sequence comparisons. No elapsed-duration
arithmetic or leap-table inference is defined by this profile.

## 6. Admission and historical replay

For a candidate, the Boundary MUST first resolve the exact base/type material
and every required semantic dependency, check field domains and ownership,
establish the row's fact and time from admissible evidence, and require the
protected environment's unique authoritative predecessor/head and append
position. The row must be legal from the established prior Lifecycle state.
Selection alone does not establish truth; evidence alone does not choose a
successor. No serialization/consensus mechanism is supplied here.

Sequence gaps and an arbitrary initial in-range ordinal are valid. The maximum
ordinal is valid if otherwise the next selected position; exhaustion prevents
further append. No wrapping, resetting, narrowing, widening, reuse or tie-break
by time/identifier/delivery is permitted. Distinct occurrences cannot share
`event_id`; identical payloads do not merge occurrences. Identical repeated
delivery is not a second append. Transport acknowledgement remains outside scope.

Reject malformed known values, null required/known optional fields, duplicate
members, forbidden fields, false/insufficiently supported facts, illegal or
post-terminal transitions, sequence collisions and retargeted definitions.
Unavailable required semantic material is unsupported, not a guessed default;
it blocks append. Unavailable fact evidence cannot be promoted to a valid Event.
An unresolved competing append remains a proposal, not a second history.

Historical replay is distinct from fresh admission. Begin with independently
established authoritative membership, not storage or delivery alone. Resolve
contracts before semantic use; validate per-Action identity/order and apply
the §4 mapping only to supported members under their exact authority. Missing
material does not delete an already authoritative Event, but that Event cannot
establish its unresolved fact or transition. Report partial interpretation as
partial; never label a supported-prefix accumulator complete-history state.
Do not infer that an unresolved member was non-transition-causing. If a later
transition's prior state cannot be established without it, do not assert that
later transition as an authoritative complete projection. This is a safety
boundary, not a new generalized partial-replay algorithm.

Already retained semantic invalidity is a conformance defect, not permission
to edit history. No reordering, deletion or cached mutable status repairs it.
Receipts remain downstream under VE-004. Uncertainty after execution started
does not manufacture either terminal kind; no terminal Receipt is derived from
that nonterminal history. Terminal state alone is not external commit proof.

## 7. Policy references and mixed histories

`POLICY_EVALUATED` and `POLICY_RECORDED` are not members of this profile.
Its selected seven kinds do not inherently name a Policy artifact: validation,
authorization and execution facts are distinct from Policy traceability Events
(VE-003 §§15, 29–30). Therefore portable Policy-reference identity need not be
invented as an Event field dependency for these rows. The prohibition on
`references` is conditional on preserving required explanation (B3), not a
claim that a complete operational history needs no policy material.

VE-006 §§9–12 still requires applicable identity/delegation/policy/approval
conditions, and §11 requires policy evaluation to be inspectable through
authoritative history. Excluding a field or type does not discharge these duties.
An authorization result must cover the exact Action/context and the actual
required approvals; a Rule digest is neither a Policy identifier nor proof of
authorization. No opaque local handle, `P-A` singleton or hidden extension is
introduced to bypass the missing Policy-owner contract.

A mixed history preserves other types and their own immutable dependencies.
Policy/Rule-bearing types still require their exact owner contracts and
reference collection semantics. If those are missing, mark the affected
members unsupported and the history incompletely interpreted; do not drop them
or treat them as harmless by name. This profile cannot certify a full Boundary
history, approval path or Receipt merely because its seven rows are understood.
If an implementation cannot satisfy required policy inspectability and Event
explanation without such material, its conformance remains blocked. Deferral
of portable reference syntax is not deferral of authorization or evidence.

## 8. Source-traceable abstract review examples

These are prose review obligations, not executable fixtures or wire vectors.
For each positive example assume unique identities, exact Action ownership,
increasing uint64 positions, all material available, admitted row-specific
fact/time evidence and sufficient inspectable explanation. These assumptions
are deliberately stronger than the presently incomplete B1–B3 contracts.

| Type | Conditional positive result | Negative / unsupported counterpart | Trace |
|---|---|---|---|
| `L(ACTION_CREATED)` | First admitted Action fact: `NONE → CREATED` | A proposed Action alone is insufficient; missing exact Action contract blocks interpretation | VE-003 §§8.1, 10; Event contract §§14–15 |
| `L(VALIDATION_STARTED)` | Actual start from `CREATED`: `VALIDATING` | Queued validation or transition from `NONE` cannot be admitted | VE-003 §§8.2, 10–11 |
| `L(VALIDATION_SUCCEEDED)` | Established success from `VALIDATING`: `READY` | Missing required validation material is unsupported; known failed validation cannot assert success | VE-003 §§8.3, 10; Event contract §15 |
| `L(AUTHORIZATION_GRANTED)` | Established authorization from `READY`: `AUTHORIZED` | Unresolved required approval or a lone allow-looking Rule result cannot establish authorization | VE-003 §§8.5, 29–30; VE-006 §§9–12 |
| `L(EXECUTION_STARTED)` | Material invocation from `AUTHORIZED`: `EXECUTING` | Scheduling alone or skipping authorization is rejected | VE-003 §§8.6, 10–11; VE-006 §14 |
| `L(EXECUTION_COMPLETED)` | Established domain success from `EXECUTING`: `COMPLETED` | Receipt-only claim or unavailable exact execution contract cannot establish success | VE-003 §8.7; VE-004 §§7, 11, 14; RS-EVENT-001 V1 |
| `L(EXECUTION_FAILED)` | Established known failure from `EXECUTING`: `FAILED` | A timeout alone leaves uncertainty, not a terminal failure; pre-execution denial is not this type | VE-003 §§8.8–8.9; RS-EVENT-001 B2/B3 |

For **each** of the seven rows, adding `actor`, `component`, `payload` or
`references` (including null/empty values) fails its proposed field restriction;
missing/null required fields and duplicate names fail the inherited rules.
A distinct unknown opaque member alone does not invalidate an otherwise valid
Event or influence its projection (Event contract §§4–5, 13).

Additional obligations:

- A success chain uses the first five types followed by completion; a separate
  known-failure chain uses the first five followed by failure. An uncertain
  observation after start leaves `EXECUTING` without a terminal Event/Receipt.
  These are separate histories, not contradictory outcomes in one stream.
- Two otherwise admissible consecutive facts may share `(2026,9,22,12,0,0,0)`
  with positions 10 and 20; order is 10 then 20, and the gap is not missing
  history. February 30, nanosecond `1000000000`, an uncertain time interval or
  an attempted arrival-time substitution is invalid under §5.2.
- Sequence tie, overflow and post-maximum append fail; a selected otherwise
  valid next position at `18446744073709551615` succeeds. Opposite transport
  delivery order cannot reverse history (Event contract §8; scenario S1–S3/D1).
- Completion followed by start is an illegal terminal resurrection; two
  unselected completion/failure proposals cannot elect their own winner
  (VE-003 §§9–11; scenario O1–O3).
- Presenting a changed §4 row, changed time rule or different dependency
  snapshot under the same complete identifier is rejected as retargeting.
  Missing exact profile or a required transitive source is unsupported even
  when a local-name transition could be guessed (Event contract §§6, 15).
- An unresolved Policy member in mixed history is retained with its missing
  owner dependency; its absence from §4 does not prove it has no effect or
  justify full-history success (scenario R4; §7 here).

The remaining Event-contract §21 pressures, including real evidence admission,
duplicate-member parser behavior, broader mixed-invalid/unsupported histories,
and nonexistent/mutable/unauthenticated/cross-Action referenced artifacts, are
not executed or proved by these examples. No existing fixture or pin changes.

## 9. Compatibility, security and architectural decision tests

No existing identifier is aliased to the proposed values, no Approved file is
amended, and no existing historical meaning is upgraded. The Draft introduces
no wire labels, serialization, Event digest/signature, new primitive, global
registry, resolver, actor ontology or generic reference object. Execution Right
remains `(action_id, action_digest)`. Adapter observation, Boundary authority,
target truth, authorization and Receipt derivation remain separate.

Main risks are semantic retargeting, guessed time/evidence, laundering Policy
dependencies through omissions, unknown-field authority, and mistaking legal
projection for a proved external fact. §§2–7 fail closed on these boundaries.
Local provision of text is not authentication or authority to append. Historical
retention/access control, actual protected ordering and evidence-source security
remain obligations of their owners, not solved infrastructure here.

| Architectural Decision Test | Assessment, not an execution certificate |
|---|---|
| Founding Principles | Preserves immutable history, evidence-backed explanation and Boundary ownership; B3 prevents silently weakening explainability |
| Primitive burden | No new primitive; identifier/time notation describes existing fields only |
| Necessity/removability | Exact type, time and field meaning is necessary; registry, wire encoding and unused fields are removable |
| Twenty-year durability | Immutable publication/source binding and non-retargeting preserve old meaning; historical material must remain available |
| Independent implementability | Proposed structural checks and seven mappings are explicit; portable producer evidence/time closure is **not yet established** |
| Total conceptual complexity | Bounds one profile before representation rather than adding a universal Policy/clock/reference architecture |

Under [Specification Governance](../SPECIFICATION_GOVERNANCE.md) §§2, 6–7,
16–21, this initial subordinate Draft may be reviewed without changing Approved
semantics. No RFC/ADR is required merely to publish these choices and blockers.
There is **no authority here to relax VE-002 §3** or amend any accepted decision.
If closure requires such a change, stop and use RFC + ADR + versioned affected
specification + changelog, rather than declaring this profile complete. No
changelog or other artifact is changed for this Draft-only proposal.

## 10. Open decisions and completeness gate

| ID | Unresolved dependency / decision | Required closure; no silent default |
|---|---|---|
| B1 | Exact Action-validation, authorization and target-result evidence recognition and historical binding | Bind immutable owner contracts for recognizing admissible evidence and tying it to the exact Action, fact and context; identify allowed sources, rejection/uncertainty behavior and retained explanation. Abstract `admitted=true` is not a portable evidence contract. No success/commit/known-failure meaning may vary by deployment under one type ID. |
| B2 | UTC realization, trusted time sources and applicability of the proposed century/nanosecond/no-leap-label subset | Fix the exact semantic time authority/dependencies and evidence-to-time rule for each fact; review operational suitability, precision and unavailable-time behavior. Do not silently choose a clock, leap mapping or evidence receipt time. |
| B3 | Sufficiency of minimal Event explanation despite absent attribution/payload/references | Demonstrate how each Event meets VE-002 §3 and how policy evaluation remains inspectable under VE-006 §11. If fields or Policy-bearing types are necessary, revise scope and dependencies with new type identifiers; if Approved semantics would change, escalate through RFC/ADR. An external evidence store with no specified binding is not closure. |
| B4 | Maturity and independent implementation review | Resolve B1–B3, review the pinned Draft dependencies, and test the resulting revised profile with independent implementations. Existing same-author experiment success is neither this profile's test result nor Approval. |

These are explicit semantic/conformance blockers, not optional future
optimizations. Review may change the proposed time or field choices; such
changes cannot reuse `0.1-draft.1` identifiers. No mutable plug-in may complete
their meanings retrospectively. A completed revision must list the resulting
full immutable dependency closure before representation is undertaken.

| Gap-analysis §10.2 criterion | Disposition in this Draft |
|---|---|
| 1. Seven kinds / immutable dependencies | Exact proposed values and pinned existing sources specified (§§2–4); full evidence/time closure still B1–B2 |
| 2. Facts / evidence / existing transitions | Seven-row mapping and necessary evidence conditions specified; portable recognition blocked by B1 |
| 3. Time / fields / presence | Exact proposed abstract domains and absence rules specified (§5); trusted time and explanation justification blocked by B2–B3 |
| 4. Identity / sequence / historical failure | Inherited constraints and non-retargeting preserved (§6); no new coordination mechanism |
| 5. Abstract examples / remaining pressures | Per-kind and shared review examples supplied (§8), not executed conformance vectors |
| 6. Independent meaning | Structural meaning is reviewable without fixture aliases; full producer implementability unproved (B1–B4) |
| 7. Compatibility / governance / unresolved dependencies | Boundaries and conditional escalation explicit (§§9–10); no Approval or representation-readiness claim |

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-22 | Initial Draft of exactly seven existing lifecycle kinds, proposed complete identifiers and time/field rules, immutable existing-source basis, conditional examples, and explicit evidence/time/explanation closure blockers. |
