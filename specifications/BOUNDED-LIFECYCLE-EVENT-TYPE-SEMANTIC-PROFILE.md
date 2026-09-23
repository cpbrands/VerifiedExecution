---
id: BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
title: Bounded Lifecycle Event-Type Semantic Profile
version: "0.2"
status: Draft
document_type: Candidate Specification
category: Specification
author: Verified Execution Editorial Board
created: 2026-09-22
updated: 2026-09-23
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

**Draft v0.2 — proposed established-input semantic profile; not Approved.**

## 1. Authority, purpose and completeness

This is the single next artifact selected by the merged
[RS-EVENT-001 gap analysis §§10–11](../kernel-analysis/GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS.md).
It proposes reusable meanings for exactly seven existing lifecycle triggers,
not a replacement Lifecycle or a universal Event profile. Capitalized MUST,
MUST NOT, SHOULD and MAY constrain only explicit use of this Draft, subject
to the blockers below. Approved VE-002 takes precedence in any conflict.

**Existing requirements** are attributed to their owners in the source tables.
**Proposed choices** are this Draft's type identifiers, established-input
interface, inline explanation payload, bounded-time values and review examples.
They are not Approved requirements, scenario-derived defaults or permanent
global allocations.

This revision proposes complete processing rules **at an explicit established-
input boundary** (§4.1): authenticated, scope-authorized assessments, a frozen
execution context and an owner-established occurrence-time bound. It specifies
what those inputs assert and bind, not how a trust system authenticates sources,
how a Policy engine evaluates arbitrary policies, or how a clock measures time.
Raw observations, an undocumented admission Boolean, or a producer's assertion
that its own inputs are authoritative do not satisfy that interface. Missing
inputs have specified fail-closed results; they are not permission to choose
local semantics. Operational adapters to this interface and independent
conformance evidence remain unproved. Representation work is not authorized
by this Draft (§10).

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
The additional semantic dependency is the closed input/payload/time contract
in §§4.1–5 of this exact profile publication. It consumes established decisions,
not raw vendor messages or an unspecified plug-in result. The exact Action and
its schema/representation/occurrence-binding contracts remain dependencies
selected by the Action under VE-001, not selectable by this Event profile.
Their complete immutable material must accompany the Action for interpretation.
No `latest`, deployment alias or profile-local Action digest is substituted.

Context-specific Policy/validation/execution material is retained inline as
the subject and explanation of externally established assessments. It cannot
add a new outcome code, field meaning, transition or time comparison rule to
this profile. Re-evaluating a Policy or authenticating raw proof additionally
needs that owner's exact contract; a consumer lacking it cannot claim that
capability. Processing already-established results has the fixed rules below.
This separates immutable semantic dependencies from variable authoritative
inputs; neither an unavailable required Action contract nor a missing trusted
input can be hidden inside explanatory text.

## 3. Complete proposed type identifiers

The following notation defines an **abstract value**, not a string syntax,
URI retrieval rule, tuple wire format, map layout or Event field addition:

```text
L(K) = (
  authority = "https://github.com/cpbrands/VerifiedExecution",
  profile = "BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE",
  revision = "0.2-draft.1",
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
that first defines `0.2-draft.1` must be retained immutably. Every later semantic
change, including to the input or explanation contract, requires a different
revision component and explicit bindings, even while document status remains
Draft. Reusing these identifiers for completed future contracts would be
retargeting. Editorial version metadata alone cannot authorize retargeting.

The prior `0.1-draft.1` values retain their incomplete historical meanings at
commit `c27a765006e028ddb674621495b245cc28c815ed`; they are not aliases for these
seven values. In particular, adding the payload or interval-time rule to an old
identifier is retargeting. These are proposed Draft identifiers, not production
allocations or approval.

## 4. Seven-kind fact, evidence and projection matrix

Every row inherits §§4.1–8. The time question is when its stated fact became
true, not when evidence arrived or the Event was stored. The evidence column
and §4.1 jointly define admission; legal transition shape alone is not evidence.

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
The exact Action completion contract and context in §4.1 select the subject of
the outcome assessment; an implementation cannot reinterpret a target response
or substitute a newer contract while retaining the same recorded inputs.

### 4.1 Proposed established-input contract

**Existing ownership:** VE-006 §§5, 9–18 establishes execution context, checks
authorization and interprets observations; VE-005 translates, and the target
owns external facts. VE-001 §§12–16 requires occurrence/content cryptographic
binding and independently established authority. **Proposed interface:** the
following finite semantic records make those responsibilities explicit inputs.
They are payload structures, not Evidence, Context, Source or Clock primitives.

The input to admission is `(A, H, C, S)`: exact authoritative Action `A`, its
uniquely established prior history/head and selected append position `H`, a
frozen Boundary-established context `C`, and the complete assessment snapshot
`S` for that candidate at that head. The candidate cannot choose or trim `C`
or `S`. Establishing completeness here means retaining every assessment supplied
to this decision, including contrary/uncertain ones, not omniscience about
unobserved reality. Later observations cannot edit this historical snapshot.

The establishment interface supplies a result for exact `C` and each exact
assessment: `verified`, `failed` or `unavailable`, with the historical scope
and verification material retained. These are results of the independently
recognized owner mechanisms, not fields trusted from the candidate payload.
For `C`, verified establishes its Boundary provenance, applicability, completeness
and grants for `A,H`; for an assessment it establishes authenticity, its complete
binding and the source's authority for the stated role/fact. Verified origin
is not a positive fact/condition result: the separate result can still be
refuted, unsatisfied or unknown. Missing establishment results are unavailable.

Every assessment has one exact binding `B`:

```text
B = (action_id, action_digest, bound_instance_fields,
     full event_type, candidate event_id, prior_head, sequence, context)
```

`bound_instance_fields` contains exactly the additional authoritative occurrence
fields required by the Action's owner; `prior_head` is `NONE` for an empty
stream or the exact previous VE-002 Event identifier. `context` is the entire
`C` value, not a hash, name, mutable lookup or producer-selected version.
All Action values compare under their exact owners; all other values compare
structurally under §5.3. Different content with the same `action_id`, the same
content with another occurrence, another head, another fact type or a changed
context does not match. Binding is not satisfied by text describing that tuple.
The external establishment step MUST authenticate the complete assessment
and its scope and satisfy VE-001's cryptographic occurrence/content binding,
including relied-on instance fields. This profile specifies neither a new
proof format nor a weaker substitute for that requirement.

`C` has exactly these members:

| Member | Domain and role |
|---|---|
| `sources` | Nonempty list of `{name, roles}`; names are distinct Text values local to this exact context. `roles` is a nonempty set from `boundary`, `validation`, `authorization`, `execution`, `time`. These are independently established scope-specific grants, not assertions that authenticate their own source. |
| `conditions` | List of `{category, contract, inputs, evaluator}`. Category is exactly `validation`, `identity`, `delegation`, `policy` or `approval`; contract/inputs are Text containing the complete applicable condition and exact decision inputs, not just an identifier or summary; evaluator is one listed source name. List position is the local condition selector, not a Policy identity. |
| `not_applicable` | List of `{category, reason}` for absent condition categories; reason is Text. Each of the five categories occurs either in conditions or exactly once here, never both. Validation and identity MUST have at least one condition; all other emptiness requires an explicit established reason, not silent omission. |
| `execution_terms` | Text retaining the exact Action-selected completion and known-failure conditions, target scope and material-invocation meaning, with all required explanatory definitions inline. It cannot override the Action. |
| `commit_required` | Boolean: whether those completion conditions require authoritative external commit. This is established from the applicable Action execution semantics, not chosen by a Receipt or inferred from a terminal state. |

Each evaluator MUST occur in sources with the required category role; no
unlisted evaluator or role coercion is allowed. The Boundary-established
snapshot includes the identity/delegation/Policy/approval facts needed to
justify both applicability and every not-applicable entry. If those facts
cannot be established, context establishment is unavailable; an empty list or
reason string alone cannot waive a required check.

`C` is a **decision-input snapshot**, not a Policy definition language or a way
for an Action to select its own governance. Its completeness/applicability and
grants must be independently established by the Boundary for exact `A` and `H`.
Changing any part requires new scope-bound assessments. The actual identity,
delegation, Policy, approval and target owners evaluate their own conditions;
this profile consumes their established results and preserves their full
explanation. It does not re-evaluate arbitrary Policy text or infer authority
from a source name. Contract and input Text must retain the actual governing
material and values, including required definitions, rather than `P-A`, a Rule
digest, a URL or “policy passed”. If it cannot be supplied in this self-contained
form, this bounded profile is inapplicable; a different governed profile is
needed. No missing interpretation is delegated to an unknown extension.

An assessment is exactly `{binding, source, role, statement, result, basis}`.
Source is one `C.sources.name`; role must be granted there. Statement is one
of the following closed forms; `basis` is Text retaining the concrete observed
or evaluated inputs, outcome rationale and causal attribution. Authentication
and scope recognition come from independently supplied authoritative inputs,
not from these copied fields. A verifier is supplied either the exact verified
assessment and its scoped grant, a definite verification failure, or unavailable
verification; there is no unscoped `admitted=true` input.

| Statement | Role | Result domain / exact assertion |
|---|---|---|
| `fact` | `boundary` for creation, validation start and authorization; `validation` for validation success; `execution` for execution start/completion/failure | `established`, `refuted`, `unknown`; asserts or denies precisely the selected §4 row for `B`, not generic acceptance or a different outcome. Execution sources must be independently recognized for that target fact; an Adapter label alone is insufficient. |
| `condition(i)` | `validation` for validation conditions; `authorization` for the other categories, from exactly condition i's evaluator | `satisfied`, `unsatisfied`, `unknown`; the exact recorded condition was evaluated against its exact recorded inputs. An unevaluated/missing condition is not satisfied. |
| `commit` | `execution` | `committed`, `not_committed`, `unknown`, `not_applicable`; VE-004's existing distinctions, scoped to the exact Action and execution terms. |
| `time` | `time` | One established time bound under §5.2, or `unknown`; asserts when this exact bound fact occurred, not observation, response, signing or append time. |

Statements `condition(i)` use a zero-based mathematical integer within the
conditions list. `S` is a set (order irrelevant, identical duplicates collapse)
of all assessments at this decision boundary. The profile checks:

1. All bindings equal `B`, all sources/roles match their independent grants,
   and all available authentication and Action-binding checks succeed. The
   source of a `fact`/`time` grant must be recognized for that exact fact scope;
   Boundary ownership cannot confer knowledge of target truth on an observer.
2. There is at least one `fact=established` assessment. Creation means actual
   authoritative Action admission; validation start means actual work began;
   execution start means actual material invocation, not intent or queueing.
3. `VALIDATION_SUCCEEDED` additionally requires `satisfied` for every validation
   condition. `AUTHORIZATION_GRANTED` requires `satisfied` for every identity,
   delegation, Policy and approval condition. Other kinds do not require
   evaluations that have not yet occurred. Unknown extra assessments are still
   retained. A required human-approval path remains governed by VE-003; these
   seven kinds cannot replace its approval-request/grant Events or bypass it.
4. Completion requires a `commit` assessment when `commit_required` is true,
   and that result must be `committed`. A definite `not_committed` or
   `not_applicable` rejects that completion candidate; absent/only unknown is
   unestablished. Otherwise a terminal fact establishes no commit result by
   implication. Failure never implies `not_committed`.
5. At least one established `time` bound is required. Every established bound
   for this fact MUST be identical; no implementation selects, intersects or
   averages them. A second different bound is a conflict even if overlapping.
   The Event's `occurred_at` must equal this bound exactly.

For the same statement, conflicting definite results from recognized sources
(including satisfied/unsatisfied or committed/not_committed) reject the
candidate; no majority, newest-wins or source priority is defined. `unknown`
does not refute a definite result. Any `fact=refuted` rejects that asserted
fact; any required condition `unsatisfied` rejects its success/authorization
candidate. A required definite result absent or only unknown prevents append
as **unestablished**, not a known failure. Raw timeout/no-response is never a
terminal assessment. No negative/unknown result creates an eighth Event type.

Definite malformed values, binding mismatches, failed authentication, ungranted
roles, contradictory context or evidence reject. Required source/contract or
verification material unavailable yields **unsupported**; a recognized source
with only uncertain fact/time yields **unestablished**. All three block append.
If several apply, report known invalidity first, otherwise unsupported before
unestablished; never use unavailable material to erase a known contradiction.
On replay, unsupported verification/semantics means retained but no complete
authoritative projection, not deletion or retrospective admission.

This interface makes identical `A,H,C,S` and establishment results produce the
same admission decision. Different independently established grants, required
conditions or trust results are different authoritative inputs, not permitted
disagreement over identical inputs. Acquiring/verifying these inputs remains
an owner responsibility; implementing this record check is not a claim that
the underlying real-world assertions have thereby been proved.

## 5. Proposed field and time domains

### 5.1 Common Event object

All seven types have exactly one non-null value for each of the six VE-002
required fields. The following rules are inherited unless marked proposed:

| Field | Domain, cardinality and equality |
|---|---|
| `event_id` | Exactly one opaque 32-octet occurrence identifier; exact ordered-octet equality and VE-002 non-reuse rules; generation remains implementation-defined |
| `action_id` | Exactly one Action occurrence identifier, valid and equal to the stream owner's identifier under pinned VE-001; no content-digest or cross-kind substitution |
| `event_type` | Exactly one of the seven complete proposed values in §§3–4; equality is full-value equality |
| `occurred_at` | Exactly one established closed occurrence-time bound below; no implicit conversion, narrowing or default |
| `sequence` | Exactly one integer in `0..18446744073709551615`, unique in the Action stream and strictly increasing at append; exact mathematical equality/order |
| `spec_version` | Exactly the abstract specification/version pair `(VE-002, 0.2)`; not this profile revision, application version or compatibility range |

**Proposed restriction:** `payload` is required exactly once and non-null for
all seven kinds, with the closed shape in §5.3. `actor`, `component` and
`references` remain forbidden (zero cardinality, empty admitted domain).
An empty/null optional member is present, not absent. The justification for
not using separate attribution fields is that source, role and causal
attribution are retained in the required explanation; absence grants no default
identity or authority. No universal actor/component ontology is invented.

This revises the original blanket exclusion, not VE-002. Its §12 expressly
assigns payload meaning to Event types. Required inline explanation supplies
the §3 relationship without a new external evidence reference or storage
locator. A bare six-field record is no longer valid under the new type IDs.

Unknown, distinct top-level extensions remain permitted opaque context under
the Event contract §13, including structurally valid null values. They cannot
provide missing required evidence, replace known fields, create an eighth type
or change projection. Do not turn an unknown field into a hidden evidence or
Policy-reference channel. No extension is required by these proposed types.
Duplicate member names are rejected before interpretation, including unknown
members; later recognition of a name cannot change historical meaning.

### 5.2 Proposed established occurrence-time bound

An endpoint is `(year, month, day, hour, minute, second, numerator, denominator)`:

- year is any positive mathematical integer; month `1..12`;
- day `1..days-in-month` under the proleptic Gregorian rule (31 days for
  months 1, 3, 5, 7, 8, 10, 12; 30 for 4, 6, 9, 11; February 29 in years
  divisible by 4 and not 100 unless also divisible by 400, otherwise 28);
- hour `0..23`; minute and second each `0..59`;
- numerator/denominator are integers with `0 <= numerator < denominator`,
  denominator positive and greatest common divisor one (zero is exactly `0/1`).

The scale is UTC and the calendar proleptic Gregorian. The fraction denotes
the exact fraction after the named ordinary civil second's start. Endpoints
compare by the six calendar components, then by exact rational comparison
(cross multiplication, never binary floating point). Equality uses those same
values. No maximum year or fixed nanosecond precision is imposed: neither
restriction followed from the existing owners, and both would exclude otherwise
establishable facts. Domain-valid labels alone do not prove an actual UTC fact.

`occurred_at` is exactly `{earliest, latest}` with two valid endpoints and
`earliest <= latest`. It asserts that the selected fact occurred within that
closed interval, inclusive. Equality is equality of both endpoints. One bound
is definitely earlier than another only when its latest endpoint is strictly
earlier than the other's earliest; overlapping/touching unequal bounds are
incomparable for fact ordering. Equal endpoints give a point assertion, not
an implicit promise that clocks have infinite accuracy. Precision is expressed
by the supplied interval/fractions, not guessed from timestamp spelling.

Leap-second **endpoint labels** (`second=60`) remain excluded to avoid requiring
a leap-table/label-conversion algorithm in this profile. This does not exclude
facts during a leap second: an authoritative bound with ordinary endpoints on
either side can contain them. Such a bound must be established by its owner;
an interpreter cannot manufacture it by rounding a received label. UTC offsets,
smears, POSIX values and local clock readings require upstream establishment of
the UTC bound, not an implicit conversion here. No durations are calculated.
Unbounded/unknown time cannot yield a required occurrence-time value. This
subset admits bounded uncertainty rather than disguising it as an exact point.

A `time` assessment binds the full `B` and this entire bound. Its scoped source
must independently be recognized to establish time **for that fact**, with its
retained basis stating the observation, UTC basis and uncertainty bound. For a
Boundary fact it may be the Boundary's established time service; for a target
fact it must derive from the recognized fact owner's time evidence. Receipt,
network-arrival and append time are not alternatives. A granted source may
return `unknown`, which blocks append when no established bound exists; an
untrusted/unauthenticated assessment fails under §4.1. A supplied bound not
covering the owner's established interval is a mismatch, not extra precision.

UTC scale/domain/interval semantics are fixed here. Selection and authentication
of the source, measurement/calibration and conversion from its instrument are
external responsibilities whose **result and scope** are explicit inputs.
No new clock, universal trust service or particular measurement technology is
required. A producer cannot establish a bound merely by copying its local
clock. All input establishment and uncertainty must survive in the explanation.

Equal bounds with different sequences are allowed. Time does not select
history order, prove causation/freshness/authorization, or create cross-Action
sequence order. No elapsed-duration arithmetic or leap-table inference occurs.

### 5.3 Required inline explanation and value rules

For every kind, `payload` is exactly:

```text
{ action, context, assessments }
```

`action` is the complete exact `A` under VE-001, including its schema and bound
occurrence fields; context is exact `C`; assessments is exact `S`. Each
assessment's binding and basis are retained, not merely its favorable result.
The enclosing Event supplies the durable explanation link: its immutable
`event_id`, type, Action and stream position must match every assessment binding.
No search by approximate time, external database key, later Rule result or
mutable evidence URL is needed to find this explanation.

All record members defined in §§4.1–5 are required exactly once; no null,
implicit default or unknown nested member is allowed. `NONE` is only the
explicit empty-head variant, never null. Text is a finite nonempty sequence of
Unicode scalar values with exact code-point equality, no folding/normalization;
labels/enums are exactly the literals shown. Text carries explanation, not
an executable plug-in. Structural checking alone does not prove its truth.
Whole contracts, inputs and rationales must be retained rather than only their
names/digests. Their authenticity and applicability are part of established
`C,S`, not proved by their presence in a payload.

Lists are finite and ordered, with exact positionwise equality. Source names
are unique; not-applicable categories are unique; duplicate condition entries
are rejected. Sets are finite, order-insensitive, with exact duplicates
collapsed and memberwise structural equality. Integers are mathematical, not
machine-width or floating-point values except the inherited uint64 bound for
sequence. Booleans are precisely true/false, never integers or text aliases.
Nested records compare by exact named members; member presentation order is
irrelevant. `Action` fields use their existing owner rules rather than these
new Text rules. No serialization or generic value system is introduced.

The copied `C,S` are explanatory historical assertions. They never grant their
own authority. Fresh admission compares them with independently established
inputs; independent re-verification needs the same historical scope and
verification evidence. Packaging, access control and proof storage are outside
this profile, but retaining exact materials and the binding is mandatory.
An archive may relocate them losslessly with the Event; redacting/dropping
required explanation or replacing it with a pointer loses full conformance.
Lack of present access is reported as unsupported, not as erased history or
permission to substitute today's decisions. This preserves VE-002 §§3, 5, 21–23.

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
members, forbidden fields, refuted/contradictory facts, illegal or
post-terminal transitions, sequence collisions and retargeted definitions.
Unavailable required semantic material is unsupported, not a guessed default;
it blocks append. Missing/unknown fact results are unestablished under §4.1,
not a known false fact; they too cannot be promoted to a valid Event.
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

## 7. Policy explanation, references and mixed histories

`POLICY_EVALUATED` and `POLICY_RECORDED` are not members of this profile.
The seven kinds do not inherently need a portable Policy **identifier**:
validation, authorization and execution facts are distinct from Policy
traceability Events (VE-003 §§15, 29–30). This revision reopens the explanation
question and chooses inline Policy condition/input/result material in the
required payload, rather than a reference whose owner identity is undefined.
`references` remains forbidden only within this self-contained subset. A Policy
name, Rule digest or external locator is not an alternative to that material.

VE-006 §§9–12 still requires applicable identity/delegation/policy/approval
conditions, and §11 requires policy evaluation to be inspectable through
authoritative history. Excluding a field or type does not discharge these duties.
An authorization result must cover the exact Action/context and the actual
required approvals; a Rule digest is neither a Policy identifier nor proof of
authorization. The established context lists all applicable conditions or
explicit inapplicability; each required Policy result retains its exact terms,
inputs, evaluator, outcome and basis. Local condition positions address those
inline entries only; they are not portable Policy references. This makes the
decision inspectable without claiming to re-execute a Policy engine or replace
the Policy owner's meaning. Delegation and approval explanations are retained
the same way. Required approval Events still need their own type contract.

A mixed history preserves other types and their own immutable dependencies.
Policy/Rule-bearing types still require their exact owner contracts and
reference collection semantics. If those are missing, mark the affected
members unsupported and the history incompletely interpreted; do not drop them
or treat them as harmless by name. This profile cannot certify a full Boundary
history, approval path or Receipt merely because its seven rows are understood.
If a deployment can provide only external Policy/approval/evidence references,
not these inline inputs, this profile is not applicable there. Extending it
requires a closed owner-specific reference contract and new type identifiers;
it cannot use unknown fields as a shortcut. Deferral of portable reference
syntax is not deferral of authorization, Policy semantics or evidence.

## 8. Source-traceable abstract review examples

These are prose review obligations, not executable fixtures or wire vectors.
For each positive example use unique identities, exact Action ownership,
increasing uint64 positions and the explicit established inputs of §4.1,
including the complete required payload. These are review examples of the new
contract, not experimental evidence or successful raw-source authentication.

| Type | Conditional positive result | Negative / unsupported counterpart | Trace |
|---|---|---|---|
| `L(ACTION_CREATED)` | First admitted Action fact: `NONE → CREATED` | A proposed Action alone is insufficient; missing exact Action contract blocks interpretation | VE-003 §§8.1, 10; Event contract §§14–15 |
| `L(VALIDATION_STARTED)` | Actual start from `CREATED`: `VALIDATING` | Queued validation or transition from `NONE` cannot be admitted | VE-003 §§8.2, 10–11 |
| `L(VALIDATION_SUCCEEDED)` | Established success from `VALIDATING`: `READY` | Missing required validation material is unsupported; known failed validation cannot assert success | VE-003 §§8.3, 10; Event contract §15 |
| `L(AUTHORIZATION_GRANTED)` | Established authorization from `READY`: `AUTHORIZED` | Unresolved required approval or a lone allow-looking Rule result cannot establish authorization | VE-003 §§8.5, 29–30; VE-006 §§9–12 |
| `L(EXECUTION_STARTED)` | Material invocation from `AUTHORIZED`: `EXECUTING` | Scheduling alone or skipping authorization is rejected | VE-003 §§8.6, 10–11; VE-006 §14 |
| `L(EXECUTION_COMPLETED)` | Established domain success from `EXECUTING`: `COMPLETED` | Receipt-only claim or unavailable exact execution contract cannot establish success | VE-003 §8.7; VE-004 §§7, 11, 14; RS-EVENT-001 V1 |
| `L(EXECUTION_FAILED)` | Established known failure from `EXECUTING`: `FAILED` | A timeout alone leaves uncertainty, not a terminal failure; pre-execution denial is not this type | VE-003 §§8.8–8.9; RS-EVENT-001 B2/B3 |

For **each** row, adding `actor`, `component` or `references` (including
null/empty values) fails its restriction; missing/null payload or any required
field and duplicate names fail. A payload containing only `admitted=true`
is invalid, not a small conforming explanation.
A distinct unknown opaque member alone does not invalidate an otherwise valid
Event or influence its projection (Event contract §§4–5, 13).

Additional obligations:

- A success chain uses the first five types followed by completion; a separate
  known-failure chain uses the first five followed by failure. An uncertain
  observation after start leaves `EXECUTING` without a terminal Event/Receipt.
  These are separate histories, not contradictory outcomes in one stream.
- Two otherwise admissible facts may share the point bound whose two endpoints
  are `(2026,9,23,12,0,0,0,1)` with positions 10 and 20; order is 10 then 20,
  and the gap is not missing history. A recognized interval spanning one second
  is also valid. February 30, denominator zero, unreduced `2/4`, reversed
  endpoints or arrival-time substitution is invalid under §5.2.
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

### 8.1 Positive and adversarial input examples

These cases use exact abstract copies, not hashes or wire encodings:

| Input situation | Required result and reason |
|---|---|
| Validation context contains two conditions; the recognized validation source establishes the success fact and supplies satisfied results for both, the exact bound time and complete bases | Admit from VALIDATING to READY if all common checks pass. The actual validators remain outside this table. |
| Same input, but the second condition is unknown or absent | Unestablished; no READY Event. An unsatisfied result instead rejects the claimed success; it does not create a validation-failure Event in this seven-kind profile. |
| Authorization includes identity, delegation and Policy conditions with recognized satisfied assessments, explicit reason for no required approval, scope-bound fact/time and full terms/input/basis material | Admit from READY to AUTHORIZED. The Policy evaluation remains inspectable inside the payload, not merely named. |
| Candidate removes an applicable Policy condition, changes its inputs, or replaces its material with `P-A` | Reject mismatch/incomplete explanation; the producer cannot edit the established context. Missing external context establishment is unsupported, never an implicit allow. |
| Scope-authorized known success and committed assessments bind an Action requiring commit, with recognized time | Admit COMPLETED after EXECUTING. A success result without the required commit assessment is unestablished; authorization or Receipt content cannot supply it. |
| Same evidence copied to another Action occurrence, changed digest, different head, type, Event identifier or context | Reject binding mismatch even if the result text and target response look identical. |
| A recognized source establishes the fact; another recognized source refutes that same bound fact | Reject contradiction regardless of input order. A source with only unknown does not contradict an otherwise complete established result. |
| Source is authentic but lacks the execution role for this fact, or an Adapter claims its name grants that role | Reject. If required verification evidence is unavailable, report unsupported rather than authenticity. |
| Fact and time are established, but the candidate supplies a narrower interval, a different fact's time, or a response-arrival timestamp | Reject mismatch. An established identical non-point bound is allowed; no conversion or point invention is needed. |
| Two recognized time sources give different overlapping bounds for the same fact | Reject conflict; do not choose the narrower one or intersect them. A lone unknown time prevents append as unestablished. |
| Authoritative bound spans an actual leap second with ordinary UTC endpoints | Accept that bound; literal second 60 as an endpoint is rejected. No leap table or leap-label conversion is inferred. |
| Archived Event and all inline explanation plus historical establishment evidence are recovered exactly | Replay under its original bindings. If required material cannot be recovered, retain history and report unsupported; do not fetch a latest Policy or silently reconstruct a new explanation. |

For identical established inputs, field checks and the finite result rules
select exactly one outcome. Given supported history, the seven-row table
selects exactly one next state. Different source trust, a different Policy
decision or a different established time is a changed input, not an alternative
interpretation of the same input. This written argument is not independent-
team replication or an executable conformance result.

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
| Founding Principles | Preserves immutable history, required inline explanation and Boundary ownership; payload content never authenticates itself |
| Primitive burden | No new primitive; input records and time notation specify this Event type's existing payload/time fields only |
| Necessity/removability | Exact type, time and field meaning is necessary; registry, wire encoding and unused fields are removable |
| Twenty-year durability | Immutable publication/source binding and non-retargeting preserve old meaning; historical material must remain available |
| Independent implementability | Identical established inputs select identical outcomes by §§4.1–6; independent implementation and real-source establishment remain to be tested |
| Total conceptual complexity | Bounds one profile before representation rather than adding a universal Policy/clock/reference architecture |

Under [Specification Governance](../SPECIFICATION_GOVERNANCE.md) §§2, 6–7,
16–21, this subordinate Draft may be reviewed without changing Approved
semantics. No RFC/ADR is required merely to propose this existing-field/input
contract; it does not enact an Approved-spec amendment.
There is **no authority here to relax VE-002 §3** or amend any accepted decision.
If closure requires such a change, stop and use RFC + ADR + versioned affected
specification + changelog, rather than declaring this profile complete. No
changelog or other artifact is changed for this Draft-only proposal.

## 10. Decisions, acceptance criteria and remaining gate

The following are **proposed resolutions**, not Approved authority or proof of
deployment readiness. Their scope is established-input semantic processing.

| Prior gap | Proposed resolution / exact boundary |
|---|---|
| B1: evidence binding | §4.1 fixes exact scope, roles, complete context/assessment snapshots, required condition results, contradiction precedence and unavailable/unknown behavior. Existing owners establish authenticity, applicability and real-world truth; this contract does not replace them with a Boolean or re-execute arbitrary policies. |
| B2: trusted time | §5.2 fixes the fact-bound trusted-input interface and UTC interval semantics. Remove the century cap/fixed nanosecond restriction; admit explicit bounded uncertainty; exclude leap endpoint labels without excluding owner-established intervals spanning leaps. No new clock architecture. |
| B3: explanation | §5.3 requires inline Action/context/assessment material linked by exact Event binding and retained with immutable history. Inline Policy terms/inputs/results preserve inspectability; no portable Policy identity or mutable evidence-store lookup is needed in this subset. |
| B4: evidence and maturity | Still open: independent review/implementation of this revision, practical establishment adapters, operational suitability and maturity of imported Drafts. Prior 23-case/24-mutant results do not test these proposed contracts. |

The profile does not claim all deployments can supply these inputs. If an
Action's required immutable schema/binding material is missing, Policy material
cannot be retained inline, trust cannot be established, or fact time cannot be
bounded, the corresponding specified failure applies. This is an explicit
applicability boundary, not silent incomplete conformance. A deployment that
requires portable external references must first close that additional owner
contract; this Draft does not pretend its local input interface does so.

| Gap-analysis §10.2 criterion | Reassessment |
|---|---|
| 1. Seven kinds / immutable dependencies | Proposed semantic closure: seven new exact type values, one pinned source snapshot, this publication's input/time/payload rules, and exact Action-selected dependencies. All variable assessments/context are explicit retained inputs, not type-meaning selectors. |
| 2. Facts / evidence / existing transitions | Proposed contract closed at established-input boundary: seven unchanged mappings plus complete scope/result/admission rules. Authenticating raw sources or independently re-performing their evaluations is not falsely claimed. |
| 3. Time / fields / presence | Proposed contract closed: required explanation, exact value/presence rules, fact-bound UTC intervals and rejection/unsupported/unestablished behavior; unused fields/references forbidden. |
| 4. Identity / sequence / historical failure | Inherited constraints and non-retargeting preserved (§6); no coordination mechanism or authoritative mutable status added. |
| 5. Abstract examples / remaining pressures | Per-kind and adversarial review examples supplied (§8), not executable conformance vectors. |
| 6. Independent meaning | Written decision procedure is determinate for identical established inputs; explanatory owner material cannot change its code/result vocabulary. Independent implementation evidence remains open, rather than inferred from prose or the old experiment. |
| 7. Compatibility / governance | Existing authority/Approved semantics preserved; no Approval, wire claim or new primitive. Any demonstrated conflict follows RFC/ADR and affected-spec revision, not a local override. |

Human review must accept or revise the established-result boundary, inline-only
explanation tradeoff and interval-time choice. No production cryptographic
trust or clock implementation is required merely to review those choices.
However, actual conformance needs the specified owner-established inputs;
calling arbitrary records “authoritative” is not an implementation of that
interface. Imported Draft maturity, independent falsification and approval are
separate gates. **Do not begin Event representation work on the strength of
this proposal alone.** Any later semantic change needs new type identifiers;
neither `0.1-draft.1` nor `0.2-draft.1` may be completed by retargeting.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-09-23 | Proposed scoped established-evidence inputs, fact-bound UTC intervals and required inline historical explanation; new `0.2-draft.1` type identifiers preserve the prior publication. No Approved source, fixture or historical experimental pin changed. |
| 0.1 | 2026-09-22 | Initial Draft of exactly seven existing lifecycle kinds, proposed complete identifiers and time/field rules, immutable existing-source basis, conditional examples, and explicit evidence/time/explanation closure blockers. |
