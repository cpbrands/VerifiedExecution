---
id: RS-EVENT-002
title: Bounded Lifecycle Profile v0.2 Established-Input Scenarios
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-23
updated: 2026-09-23
depends_on:
  - BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
  - EVENT-SEMANTIC-FIELD-CONTRACT
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-006
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
related_documents:
  - RS-EVENT-001
  - RS-EVENT-001-EXECUTABLE-COMPARISON
  - GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# RS-EVENT-002 — Bounded Lifecycle Profile v0.2 Established-Input Scenarios

## 1. Status, assignment and question

This is **one non-normative Reference Scenario and prospective semantic
conformance matrix**, not a conformance certificate. Repository inspection found
`RS-EVENT-001` and no `RS-EVENT-002`; this document assigns the latter identifier
without renumbering an existing scenario or consuming a reserved numeric gap.
No separate index or governance transaction is required for this Draft addition.

The question is whether the reviewed profile determines admission and Lifecycle
projection from complete, identical **established semantic inputs**, including
their independent establishment results. It is not whether source authentication,
arbitrary Policy evaluation, real settlement or clock measurement has been
implemented. Nothing here is an Event serialization or an authentication scheme.

There are **77 separately numbered cases** below. Shared complete values and
explicit substitutions keep the matrix bounded; no unlisted variations count
as additional cases. These are selected distinguishing pressures, not an
exhaustive state-space enumeration or a mathematically minimal test set.

- This scenario **does not approve the Draft** or its imported Drafts.
- Documented cases are **not executable or independent-conformance evidence**.
- The prior RS-EVENT-001 experiment's 23 cases and 24 detected mutants, from
  same-author implementations, **do not validate this profile**.
- **Representation readiness remains unestablished.** No representation work
  follows from this matrix, and no prior source pin or experiment is revised.

## 2. Immutable source selection

The inspected, freshly fetched `origin/main` was exactly
`162de90510e7d64f6970d7ff0e9df6ee2dbd4d17`; there was no remote advancement.
The reviewed [profile](../specifications/BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE.md)
is selected by that commit and exact path, with both fingerprints verified:

| Item | Exact value |
|---|---|
| Path | `specifications/BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE.md` |
| Publication | Draft v0.2; type revision `0.2-draft.1` |
| Git blob | `a8a88e94be403be9ffc0efd01986a5db9446757e` |
| SHA-256 of file bytes | `dfd184858a0a925c8da37c67a2ddd6c69e89f7ed064446779ed2122950e98c2b` |

These are document-provenance pins, not Event identity, canonical Event bytes
or trust assertions. A reproduction needs the actual pinned commit/path bytes;
a same-titled working file or a version label is insufficient.

`P` below means that exact profile. Its §2 fixes the following sources and
their recursive repository-local imports at
`56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f`. This scenario preserves that
selection rather than silently updating imports to current main:

| Source | Rules used; maturity at the selected snapshot |
|---|---|
| [Event Semantic Field Contract](../specifications/EVENT-SEMANTIC-FIELD-CONTRACT.md) (`EC`) | §§4–9, 12–15: fields, complete type selection, time, order, dependencies; Draft v0.1 |
| [VE-001](../specifications/VE-001-action-specification.md) | Action occurrence/content, binding and ownership; Approved v0.2 |
| [VE-002](../specifications/VE-002-event-specification.md) | §§3–7, 12–15, 18–23: explanation, identity, immutable history and replay; Approved v0.2 |
| [VE-003](../specifications/VE-003-lifecycle.md) | §§8–11, 15–19: existing state meanings and transition table; Draft v0.1 |
| [VE-004](../specifications/VE-004-receipt-specification.md) | §§2–4, 7–8, 11–14: derived Receipts, evidence authority and commit distinction; Draft v0.2 |
| [VE-005](../specifications/VE-005-adapter-specification.md) | §§7–10: observations and material invocation, not authorization; Draft v0.1 |
| [VE-006](../specifications/VE-006-execution-boundary-specification.md) | §§5–18: context, Policy, identity, delegation, approval and append ownership; Draft v0.1 |

The [gap analysis §10.2](../kernel-analysis/GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS.md)
and [comparison report](../kernel-analysis/RS-EVENT-001-EXECUTABLE-COMPARISON.md)
are read at the inspected main, as non-normative selection/evidence history.
Relative links are navigation, not mutable source selectors.

The existing Lynx Action schema and Action representation/binding owners are
also supplied at their exact paths in the profile's source snapshot, recursively
including their immutable imports. Their semantic definitions are incorporated
as input material, not replaced by this scenario. Missing material is explicitly
varied in case 75. No new Action schema or portable Policy reference is created.

## 3. Complete shared semantic inputs

### 3.1 Notation and substitution discipline

This section defines finite **semantic values**, not JSON, CBOR, field numbers,
canonical bytes, or a wire format. Named values are document abbreviations that
are expanded before comparison; they are not runtime identifiers or resolvers.
Tables of named members denote records; lists and sets have P §5.3 meanings.
Quoted Text is literal, with no surrounding quotation marks in its value.

Every case starts from its named baseline and changes **only** the listed
inputs. All other values, absence, dependencies, membership, scope grants and
establishment results are exactly the baseline. There are no implementation
defaults. A row saying `rebuild` explicitly regenerates all derived bindings,
assessment text substitutions and payload copies from the changed inputs;
otherwise those values remain unchanged. Cases are separate counterfactual
worlds: incompatible terminal Events are never simultaneously asserted as valid
history. No later case inherits a mutation from an earlier one.

### 3.2 The exact Action and its immutable material

`A` is the existing Lynx P1 semantic Action used in RS-LYNX-001 §2, with the
schema's complete descriptor and definitions supplied inline in the input
bundle by exact incorporation of its §§3–8 at the source snapshot. This is a
test-only conditional external Action, not a live payment. Its values are:

| Member | Exact semantic value |
|---|---|
| Action occurrence identifier | Ordered octets with hexadecimal notation `606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f` |
| Action content digest | Ordered octets `5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c` |
| Schema digest | Ordered octets `e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554` |
| `amount_minor` | Integer 1000000 |
| Source account | Sort code Text `000100001`; account Text `0012345` |
| Destination account | Sort code Text `000200002`; account Text `VENDOR-0001` |
| Additional bound occurrence fields | Empty: this selected Action instance has only `action_id` |

The octets above are existing **semantic identifier values**, not a new byte
construction. The Action has exactly the existing owner-defined instance,
semantic content and content binding, no Event or Policy fields. All its
schema/material is included in `payload.action` as required by P §5.3, not
replaced with these digest values. The fixture recognizes the existing Action
owner's successful validity/binding result; it does not recompute Action bytes.

CAD, scale, addressing and participant-level settlement are solely this
existing Action schema's meaning. They do not become generic Event unit
semantics. An independent implementer must expand the pinned source material,
not supply a locally equivalent schema. This extra Draft Action dependency is
explicit and is not asserted to be Approved by this scenario.

### 3.3 Context: complete conditions and scoped sources

The exact context `C` has the following members, and no others:

- `sources`, in order: `b` with roles set {boundary}; `v` with {validation};
  `a` with {authorization}; `x` with {execution}; `t` with {time}; `u` with
  {time}. The names are literal local Text, not public identities.
- `conditions`: the following ordered three records, numbered only for the
  profile's zero-based `condition(i)` selector.
- `not_applicable`, in order: delegation, reason “The independently recognized
  principal acts directly for its own authorized scope for this Action; no
  delegation is invoked.”; approval, reason “The complete applicable Policy
  below requires no separate human approval for this exact Action.”
- `execution_terms`: the complete Text in the next paragraph.
- `commit_required`: Boolean true.

| Position/category/evaluator | Complete `contract` Text | Complete `inputs` Text |
|---|---|---|
| 0 / validation / `v` | “Validation contract version 1: apply every admission and binding rule of the exact supplied Action schema and Action owners to the complete supplied A; satisfied means all those rules pass, unsatisfied means at least one fails, unknown means completion cannot be established.” | The literal text of §3.2's complete Action values, followed by the exact incorporated schema/Action-owner semantic material. This is textual expansion, not a locator or digest-only substitute. |
| 1 / identity / `a` | “Identity condition version 1: the independently authenticated principal is the direct principal authorized by the resource for exactly this Action occurrence and content; satisfied means that recognition and exact scope hold, unsatisfied means they do not, unknown means they are not established.” | “The independently established principal is test-principal-1. The resource recognizes test-principal-1 directly for exactly A, not another occurrence, content, account or target. No delegated principal is used.” Expand A's exact values from §3.2 in place of A. |
| 2 / policy / `a` | “Policy condition version 1: for the exact supplied Lynx Action, permit only amount_minor at most 1000000, source sort code 000100001 with account 0012345, and destination sort code 000200002 with account VENDOR-0001. All comparisons are the exact schema-owned comparisons. This Policy requires no additional human approval; no other Policy condition applies in this test context. Satisfied means all three restrictions hold, unsatisfied means one fails, unknown means evaluation is not established.” | “amount_minor is integer 1000000; source sort code is Text 000100001 and account is Text 0012345; destination sort code is Text 000200002 and account is Text VENDOR-0001. The applicable Policy is exactly the preceding version-1 text, not a lookup by its name.” |

`execution_terms` is: “The target is the Lynx participant-level settlement
domain of the supplied UG2026 Action schema. Material invocation means the
Adapter actually submitted this exact settlement instruction to that domain,
not scheduling it. Completion means that the represented CAD 10000.00 Payment
Obligation settled through entries in the sending and receiving participants'
Lynx accounts under the supplied schema. It does not mean customer-account
debit or credit, beneficiary net receipt, message acceptance or queueing.
Completion here requires independently established target commit. A known
failure means that the materially invoked attempt resolved unsuccessfully under
that same target scope; neither timeout nor absent response establishes it.
The failure fixture supplies the target's definitive rejection and termination
of that attempt. A FAILED projection alone supplies no commit classification.”

These are **scenario-specific complete authoritative inputs**, not new
normative identity/Policy/target rules. In each baseline the independently
recognized Boundary establishes C's provenance, applicability and completeness
for exact A and the selected history/head, including the direct-principal and
no-approval facts. The fixture is at P's established-result interface, not at
raw proof or Policy re-evaluation. An actual deployment with another applicable
Policy or a required approval path has different inputs and cannot reuse C.

### 3.4 Establishment results are independent inputs

Each baseline supplies, separately from the Event and its payload:

1. A `verified` result for exact C, scoped to A and the exact H below. Its
   recognized Boundary provenance and complete conditions/grants are given
   by §3.3, not inferred from a copied context.
2. For each exact assessment, `verified`, scoped to its entire binding, source,
   role, statement, result and basis. `b` is recognized for admission,
   validation commencement and authorization; `v` for exact schema validation;
   `a` for conditions 1 and 2; `x` for actual invocation and the selected
   target's outcome/commit; `t` and `u` for that exact fact's UTC interval.
   Neither an Adapter label nor a Receipt is the recognizing authority.
3. Historical grant and verification material remains available, bound to those
   exact values, under the owners' unchanged contracts. The input is the
   already-established result and scope, not an unspecified `admitted` bit.
   There is no raw signature, key-selection, trust-bootstrap or clock algorithm
   to choose inside this scenario. Such mechanisms cannot be manufactured by
   a test implementation from the payload.

These are explicit counterfactual premises, not claims that real target facts
were authenticated. Mutations to establishment results below are changes to
these authoritative inputs. A valid-looking copy with missing independent
results has `unavailable`, never an implicit `verified`. A result authenticating
an assessment for a different binding does not authenticate the candidate.

### 3.5 Time, type, Event and assessment expansion

`I(n)` for n in 1..255 is the opaque ordered sequence of 31 zero octets and
one octet whose value is n. This fully specifies test Event IDs, not their wire
encoding or generation requirement. `I(250)` is unused in baseline history.

`L(K)` is exactly the four-component abstract identifier:
authority Text `https://github.com/cpbrands/VerifiedExecution`, profile Text
`BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE`, revision Text `0.2-draft.1`,
kind Text K. It selects only the pinned publication, never the old experiment.

`q(s)` is endpoint (2026, 11, 17, 15, 0, s, 0, 1). `Q` has earliest q(0)
and latest q(1). Every baseline Event and its time assessment use **this same
closed interval**. This models bounded uncertainty, not seven simultaneous
point facts or a claim about clock precision. Endpoint and interval equality,
inclusive bounds and rational comparison are exactly P §5.2.

For candidate `E`, `B(E)` contains A's exact occurrence/content and empty
additional bound fields; E's full type and Event ID; exact prior head (NONE
or the last listed Event ID), E's selected sequence, and the entire exact C.

Every assessment has exactly six members: that binding, source, role,
statement, result, and basis. Unless a case explicitly changes it, its basis
is literal Text constructed as follows, expanding bracketed document symbols
to the exact semantic values/text, not retaining symbolic pointers:

| Statement | Exact basis template |
|---|---|
| fact | “Source [source] in role [role] establishes [the exact fact sentence in the seven-kind table below] for the exact binding record carried by this assessment. The observed facts are [observation in that row]. This is the fact itself, not intent, absence of an error, a Receipt assertion or a different Action.” |
| condition(i) | “Evaluator [source] evaluated [complete condition contract] against [complete condition inputs] for the exact binding record carried by this assessment. Result satisfied: [condition rationale below]. This evaluation is attributed to that scoped evaluator, not to the copied assessment.” |
| time | “Source [source] establishes that the bound fact [exact row fact] occurred within the exact interval carried by this assessment's result, inclusively, on UTC with proleptic Gregorian labels. These are the fact owner's established occurrence observations and bounds, including uncertainty, for the exact binding record carried by this assessment, not arrival, signing or append time; no tighter bound is asserted.” |
| commit | “Source x establishes participant-level target commit for the exact binding record carried by this assessment under [complete execution_terms]. The represented obligation has settled in the participants' Lynx accounts; this is not inferred from a Receipt or Lifecycle name.” |

Condition rationales are respectively: “All schema admission and Action binding
checks on the supplied exact A completed successfully”; “test-principal-1 is
independently recognized directly for precisely this Action/resource scope”;
and “1000000 is at most 1000000 and both exact account pairs match; this exact
Policy calls for no human approval.” Each assessment retains these inputs and
terms, including their version-1 meaning. No expression asks an implementation
to invent the explanation or fetch mutable Policy content.

Templates substitute only the specified literal Text, never an implementation's
serialization of B, C or an interval. Binding and interval records remain exact
inline semantic values alongside the basis. For condition 0, textual source
incorporation means the exact UTF-8-decoded text of the selected source sections
(including headings), in their document order, separated by one line feed;
this is fixture Text content, not a portable Event encoding. The Action values
prefix is the exact value-column text of §3.2 in row order with one line feed
between entries. The owner material order is schema §§3–8, VE-001, then its
Action representation profile; recursively needed owner definitions are supplied
as semantic dependencies under §2, not replaced by a local interpretation.

The seven Events have exactly these fields: event_id I(n), action_id A's
identifier, event_type L(K), occurred_at Q, sequence 10n, spec_version the pair
(VE-002, 0.2), and payload with action A, context C and assessments S(E).
All other top-level members are absent. S(E) contains one fact assessment
from the source/role below, result established; one time assessment from t,
role time, result Q; and only the additional assessments listed below.
All condition assessments come from their exact evaluator with the appropriate
validation/authorization role. The completion commit comes from x/execution.

| n / K | Exact fact and observation substituted in basis | Additional S(E) |
|---|---|---|
| 1 / ACTION_CREATED | Fact: this exact Action occurrence became authoritative. Observation: b admitted the complete immutable A into authoritative history. | None |
| 2 / VALIDATION_STARTED | Fact: validation of this exact Action began. Observation: b observed the applicable structural/semantic validation actually commence, not enter a queue. | None |
| 3 / VALIDATION_SUCCEEDED | Fact: applicable validation of this exact Action succeeded. Observation: v completed all supplied Action/schema checks successfully. | condition(0) satisfied |
| 4 / AUTHORIZATION_GRANTED | Fact: execution authorization for this exact Action/context was established. Observation: b established satisfied identity and Policy conditions and the independently justified delegation/approval inapplicability recorded in C. | condition(1) satisfied; condition(2) satisfied |
| 5 / EXECUTION_STARTED | Fact: a material external execution attempt began. Observation: x establishes actual Adapter invocation of this exact settlement instruction in the selected target domain. | None |
| 6 / EXECUTION_COMPLETED | Fact: governed execution resolved successfully. Observation: x establishes the represented obligation settled under the exact execution terms after invocation. | commit committed |
| 7 / EXECUTION_FAILED | Fact: execution began and resolved as a known failure. Observation: x establishes the materially invoked attempt was definitively rejected and terminated by the target; it is not a timeout or pre-execution denial. | None; do not infer a commit result |

Fact sources/roles: n=1,2,4 use b/boundary; n=3 uses v/validation;
n=5,6,7 use x/execution. E6 and E7 are alternative successors of E5, not
successive Events. Their selected positions are respectively 60 and 70 in
separate worlds; both bind prior head I(5).

### 3.6 Histories, delivery and expected-result vocabulary

`H0` is the empty, independently established authoritative stream for A;
`H1` through `H5` are exactly the ordered prefixes E1 through En.
`H6` is H5 followed by E6; `H7` is H5 followed by E7. Each retained Event
has its own independently established context/assessments and exact predecessor
binding. All dependency and historical verification material is available.
Delivery is that order unless explicitly changed. For each baseline the
protected environment uniquely selects the displayed candidate, predecessor
and sequence before append; no competing selection exists. For E1 the
predecessor is NONE. Selection for an illegal candidate is not a legality proof.

Baseline names P1..P7 mean evaluating En on H(n−1), except P7 uses H5.
They include A, C, S(En), establishment results and selection above, not just
a prior-state label. Recorded histories always retain full Events, not only
cached states. Valid prior projections are H0=NONE (no Lifecycle state),
H1=CREATED, H2=VALIDATING, H3=READY, H4=AUTHORIZED, H5=EXECUTING,
H6=COMPLETED, H7=FAILED.

Matrix results use:

- **Accept / state**: append the selected valid occurrence and derive that
  complete-history projection.
- **Reject / keep state**: definite invalidity; no append, existing valid H
  remains unchanged. A rejection is not a new Lifecycle Event.
- **No accept—unestablished / keep state**: required definite fact/time/result
  missing or unknown; no append, not a known failed execution.
- **No accept—unsupported / keep state**: required material/establishment
  unavailable for the new candidate. Historical state is retained only when
  its own interpretation is fully supplied.
- **No complete projection**: retained authoritative membership has unavailable
  interpretation. Any named supported prefix is partial, not current state.
- **No accept—unselected**: no unique protected successor; P §6 prohibits
  admission but does not name a fourth standardized diagnostic code. This
  phrase describes the reason, not a new profile enum.

Known invalidity takes precedence over unsupported, then unestablished
(P §4.1). Where a mutation changes an assessment's result, its independent
verification still establishes the exact supplied, possibly negative result;
it never converts it to positive. Its basis is replaced with the complete
original inputs/attribution followed by the row's stated contrary/uncertain
observation and reason, rather than retaining a false positive rationale.
Where the row deliberately omits or corrupts explanation, do not repair it.

## 4. Conformance matrix

`D` means the result depends on the Draft profile or imported Draft semantics;
it is not an Approved conformance claim. `A+D` additionally tests an explicit
Approved VE-001/VE-002 invariant, but the complete profile-shaped fixture is
still Draft-specific. The source column identifies the exact rule for each
case. No case promotes VE-003/004/006 to Approved.

### 4.1 Seven positive transitions and sequence/legality boundaries

| Case | Complete baseline / authoritative changes; recorded H; Event | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 01 | P1: H0, E1 | Accept / CREATED; authoritative Action admission fact and time established. | P §§4, 4.1, 6; VE-002 §§2–3 / A+D |
| 02 | P2: H1, E2 | Accept / VALIDATING; actual validation commencement. | P §4; VE-003 §10 / D |
| 03 | P3: H2, E3 | Accept / READY; fact and every validation condition established. | P §4.1(2–3) / D |
| 04 | P4: H3, E4 | Accept / AUTHORIZED; complete identity/Policy results and justified inapplicability, not READY alone. | P §4.1(3); VE-006 §§9–12 / D |
| 05 | P5: H4, E5 | Accept / EXECUTING; actual material invocation, not authorization or queueing. | P §4; VE-003 §8.6 / D |
| 06 | P6: H5, E6 | Accept / COMPLETED; exact success and required target commit independently established. | P §4.1(4); VE-004 §§7–8 / D |
| 07 | P7: H5, E7 | Accept / FAILED; known post-invocation failure. No NOT_COMMITTED inference or fabricated commit assessment. | P §§4, 6; VE-004 §8 / D |
| 08 | P4, replace H3 with H2; rebuild E4's B and all inputs for prior I(2), sequence 40 | Reject / keep VALIDATING; protected selection and positive evidence do not permit VALIDATING→AUTHORIZED. | P §6; VE-003 §§10–11 / D |
| 09 | P7, replace H5 with H6; rebuild E7 for prior I(6), sequence 70 | Reject / keep COMPLETED; a later known-failure claim cannot transition a terminal history. | P §6; VE-003 §11 / D |
| 10 | H5; both full P6 and P7 assessment bundles supplied as distinct proposals; no unique successor selected | Neither accepted / keep EXECUTING; both bind I(5), but time or sequence magnitude cannot elect one. No extra authoritative history. | P §6; EC §8 / D |
| 11 | P6, candidate and selection sequence 50; rebuild B, all else unchanged | Reject / keep EXECUTING; sequence collides with E5, even though time/fact are established. | P §6; EC §8 / D |
| 12 | P5, unique selected sequence 18446744073709551615; rebuild B | Accept / EXECUTING; exact uint64 maximum is legal and gaps are allowed. Call this full resulting history Hmax. | P §§5.1, 6; EC §8 / D |
| 13 | Hmax; P6 rebuilt for its exact head with proposed sequence 18446744073709551616 | Reject / keep EXECUTING; exhaustion, no widening or wrap. | P §6; EC §8 / D |
| 14 | Replay H6, no new candidate; independently established membership unchanged; delivery E6,E2,E5,E1,E4,E3 | Accept recorded history / COMPLETED; all bounds equal Q yet authoritative sequence uniquely orders it. Transport and time do not select order. | P §6; EC §§7–8; VE-002 §7 / A+D |
| 15 | P6, change candidate ID to I(5), rebuild B | Reject / keep EXECUTING; distinct completion occurrence reuses E5's immutable occurrence ID, not harmless duplicate delivery. | P §6; VE-002 §§4–5 / A+D |

### 4.2 Exact bindings: authenticated wrong input is still wrong

In 16–23 use P6/H5/E6 and change **only the fact assessment's binding** as
specified. The independently supplied result verifies that altered assessment
and scope, not a forged unchanged one. Time, commit, candidate and C stay exact.
All reject and keep EXECUTING; none can be rescued by a matching source name.

| Case | Exact altered binding member | Exact rejection reason | Source / class |
|---|---|---|---|
| 16 | action_id = I(250) | Another occurrence is not A, even with its content digest. | P §4.1; VE-001 §12 / A+D |
| 17 | action_digest = 32 zero octets | Same occurrence label does not bind different content. | P §4.1; VE-001 §12 / A+D |
| 18 | bound_instance_fields additionally contains `foreign_instance` with Text `x` | Not the owner's exact empty additional-field set; producer cannot enlarge occurrence binding. | P §4.1; VE-001 ownership / A+D |
| 19 | full event_type = L(EXECUTION_FAILED) | Evidence concerns a different fact, not completion. | P §§3–4.1 / D |
| 20 | candidate event_id = I(250) | Another Event occurrence, even for the same Action/fact. | P §4.1 / D |
| 21 | prior_head = I(4) | Assessment was not for selected authoritative head I(5). | P §§4.1, 6 / D |
| 22 | sequence = 61 | Assessment was not for selected append position 60. | P §§4.1, 6 / D |
| 23 | context = C with its sources list reversed, no other edit | The complete structured context is unequal; lists are ordered even where grants happen to name the same sources. | P §§4.1, 5.3 / D |

### 4.3 Assessment, uncertainty and authority boundaries

| Case | Complete baseline / explicit change | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 24 | P6/H5/E6; remove fact from authoritative S and payload S | No accept—unestablished / keep EXECUTING; time plus commit alone cannot replace the required fact assessment. | P §4.1(2) / D |
| 25 | P7/H5/E7; fact result unknown, basis records only timeout/no response after invocation | No accept—unestablished / keep EXECUTING; uncertainty is not a known execution failure or terminal Receipt. | P §§4.1, 6; VE-004 §§7–8 / D |
| 26 | P6/H5/E6; fact refuted, basis records that claimed successful resolution is false | Reject / keep EXECUTING; authentic negative evidence does not establish completion. | P §4.1 / D |
| 27 | P6/H5/E6; payload and C/S copies unchanged, but no independent establishment results for C or assessments; material unavailable | No accept—unsupported / keep EXECUTING; copies do not establish scoped authority. Valid-looking fields cannot authenticate themselves. | P §§4.1, 5.3; VE-001 §§12–16 / A+D |
| 28 | P6/H5/E6; independent verification result for time is failed | Reject / keep EXECUTING; untrusted time is a definite authentication failure, not an established bound or mere missing material. | P §§4.1, 5.2 / D |
| 29 | P6/H5/E6; fact source b, role execution; result otherwise unchanged | Reject / keep EXECUTING; b's independently supplied grant has only boundary role, not target-truth authority. | P §4.1(1); VE-006 §§6, 15 / D |
| 30 | P6/H5/E6; retain established fact and add verified same-binding x/execution fact refuted with its contrary basis | Reject / keep EXECUTING; contradictory definite statements, no newest/majority/source-priority choice. | P §4.1 / D |
| 31 | P3/H2/E3; remove condition(0) from S and payload | No accept—unestablished / keep VALIDATING; a positive generic fact does not replace all required validation results. | P §4.1(3) / D |
| 32 | P4/H3/E4; condition(2) result unsatisfied; basis records evaluator's definite denial of this exact condition/input evaluation | Reject / keep READY; recognized origin is not satisfaction. Even an apparently mistaken denial cannot be silently re-evaluated to success by this profile. | P §4.1(3); VE-006 §11 / D |
| 33 | P4/H3/E4; retain satisfied condition(2), add verified same-evaluator unsatisfied condition(2) with denial basis | Reject / keep READY; exact condition has conflicting definite results. | P §4.1 / D |
| 34 | P6/H5/E6; add verified fact unknown, basis records an additional unresolved observation, retaining established fact and commit | Accept / COMPLETED; unknown is retained but does not refute the definite fact. | P §4.1 / D |
| 35 | P6/H5/E6; remove commit assessment | No accept—unestablished / keep EXECUTING; this A requires target commit, not terminal-state inference. | P §4.1(4); VE-004 §§7–8 / D |
| 36 | P6/H5/E6; commit result not_committed, basis records authoritative non-commit | Reject / keep EXECUTING; definite result conflicts with required committed completion. | P §4.1(4) / D |
| 37 | P6/H5/E6; retain committed and add verified not_committed with its non-commit basis | Reject / keep EXECUTING; contradictory commit assertions cannot be selected or averaged. | P §4.1 / D |

### 4.4 UTC bounds: exact, fact-bound and not an ordering authority

All use P6/H5/E6. When a row changes the established interval, candidate
occurred_at and the time basis change to that exact interval too, unless
explicitly stated otherwise. Other assessments keep their unchanged B; B does
not contain occurred_at. `q` is fully defined in §3.5.

| Case | Exact time input change | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 38 | Add u/time assessment with identical Q and its fully expanded time basis, verified for exact B | Accept / COMPLETED; both independent established bounds are identical, no selection needed. | P §4.1(5) / D |
| 39 | Keep t's Q; add verified u bound earliest q(1), latest q(2); candidate remains Q | Reject / keep EXECUTING; touching/overlapping inclusive bounds are unequal. No intersection even though one instant is shared. | P §§4.1(5), 5.2 / D |
| 40 | Keep t's Q; add verified u bound earliest q(2), latest q(3); candidate remains Q | Reject / keep EXECUTING; disjoint bounds conflict too; later source time cannot override. | P §§4.1(5), 5.2 / D |
| 41 | Only time assessment result unknown; candidate still Q; basis says owner cannot establish a finite bound | No accept—unestablished / keep EXECUTING; producer's proposed Q is not evidence. | P §§4.1, 5.2 / D |
| 42 | Remove time assessment; candidate remains Q | No accept—unestablished / keep EXECUTING; missing is not an implicit clock reading. | P §4.1(5) / D |
| 43 | Candidate/time result both point (2026,2,30,15,0,0,0,1) | Reject / keep EXECUTING; day outside Gregorian month domain, even with supplied verification. | P §5.2 / D |
| 44 | Candidate/time result both point (2026,11,17,15,0,0,0,0) | Reject / keep EXECUTING; denominator zero. | P §5.2 / D |
| 45 | Candidate/time result both point (2026,11,17,15,0,0,2,4) | Reject / keep EXECUTING; unreduced fraction is not normalized by the consumer. | P §5.2 / D |
| 46 | Candidate/time result earliest q(2), latest q(1) | Reject / keep EXECUTING; reversed endpoints. | P §5.2 / D |
| 47 | Time B.event_type changed to L(EXECUTION_STARTED); time basis describes invocation rather than completion | Reject / keep EXECUTING; authentic time for another fact cannot substitute for completion time. | P §§4.1, 5.2 / D |
| 48 | Candidate/time result both point (2026,11,17,15,0,60,0,1) | Reject / keep EXECUTING; leap endpoint label outside this bounded domain. No rounding or clock conversion. | P §5.2 / D |
| 49 | Only candidate occurred_at becomes point q(0); authoritative time remains Q | Reject / keep EXECUTING; narrowing to a contained point is not exact interval equality. | P §4.1(5) / D |

Case 14 demonstrates equal bounds cannot order history; case 10 demonstrates
that even complete time evidence cannot replace protected successor selection.
Case 39 intentionally uses inclusive touching bounds, a sharper boundary than
an arbitrarily wide overlap. Strict separation in case 40 does not cure a
same-fact contradiction. No duration or leap-table inference is involved.

### 4.5 Historical explanation is material, not a favorable label

For 50–56 use P4/H3/E4. A payload-only deletion leaves independent C/S intact
and therefore has both a structural/content mismatch and the stated loss.
A change to authoritative C explicitly rebuilds B and all copies; it does
not receive an implicit new completeness verification.

| Case | Exact missing/substituted material | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 50 | Delete basis member from payload's condition(2) assessment only | Reject / keep READY; missing required rationale/attribution and not the exact supplied S. | P §5.3; VE-002 §3 / A+D |
| 51 | Delete evaluator member from payload.context.conditions[2] only | Reject / keep READY; required evaluator and exact C lost. | P §§4.1, 5.3; VE-002 §3 / A+D |
| 52 | Delete inputs member from payload.context.conditions[2] only | Reject / keep READY; historical input material and exact C lost, not recoverable from result satisfied. | P §§4.1, 5.3; VE-002 §3 / A+D |
| 53 | Candidate's complete version-1 explanation remains, but the independent historical material establishing which Policy edition applied to this A/H is unavailable; C establishment is unavailable | No accept—unsupported / keep READY; the copied version-1 terms cannot prove they are the applicable historical edition. No local/latest edition may fill the missing establishment dependency. | P §§2, 4.1, 7 / D |
| 54 | Payload condition(2).contract alone replaced by Text “P-A” | Reject / keep READY; bare Policy name is neither exact C nor self-contained terms. | P §§4.1, 5.3, 7; VE-002 §3 / A+D |
| 55 | Payload condition(2).contract alone replaced by Text “digest:0123456789abcdef” | Reject / keep READY; a digest is not the required historical Policy material or authority. | P §§4.1, 5.3, 7; VE-002 §3 / A+D |
| 56 | Payload condition(2).contract alone replaced by Text “https://policy.example/current” | Reject / keep READY; a mutable locator cannot replace the immutable inline explanation. No network resolution is attempted. | P §§4.1, 5.3, 7; VE-002 §3 / A+D |

Case 53 is specifically missing **semantic edition/material**, not the absence
of an invented `evaluator_version` member. P defines evaluator as a scoped
source name and requires complete actual contracts/inputs; it does not allocate
that extra member. Where an evaluator's algorithm/version affects the meaning
of a supplied condition, that exact material belongs in the condition and
retained establishment dependency. Re-performing that evaluator is outside
these tests. Mere deletion of an informational label from otherwise complete,
independently established material is not automatically the case-53 failure.

### 4.6 Closed field domains and permissive opaque top-level context

All use P6/H5/E6 except 70 as specified. A row changes only the candidate
unless it says otherwise; independent inputs remain exact. For invalid member
collections these are semantic producer proposals, not parser/wire tests.

| Case | Exact input alteration | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 57 | event_id is 31 zero octets | Reject / keep EXECUTING; not an Event OccurrenceId. | P §5.1; VE-002 §4.1 / A+D |
| 58 | sequence is integer −1; selected position/B also −1 | Reject / keep EXECUTING; below uint64 domain. | P §5.1; EC §8 / D |
| 59 | sequence is integer 18446744073709551616; selected position/B also that value | Reject / keep EXECUTING; above uint64 domain even without preceding exhaustion. | P §5.1; EC §8 / D |
| 60 | payload.context.commit_required is integer 1, not Boolean true | Reject / keep EXECUTING; no integer-to-Boolean coercion and not exact C. | P §5.3 / D |
| 61 | Add actor with Text b | Reject / keep EXECUTING; forbidden field even when the name is a recognized source. | P §5.1 / D |
| 62 | Add component with null | Reject / keep EXECUTING; forbidden presence and null is not absence. | P §5.1; EC §4 / D |
| 63 | Add references with empty list | Reject / keep EXECUTING; forbidden collection is present even when empty. | P §§5.1, 7 / D |
| 64 | payload is null | Reject / keep EXECUTING; required non-null explanation. | P §5.1; EC §4 / D |
| 65 | Add payload member extension with null | Reject / keep EXECUTING; nested payload is closed, unlike unknown top-level context. | P §5.3 / D |
| 66 | Add distinct unknown top-level member transport_note with null | Accept / COMPLETED; opaque context has no evidence/projection effect and is retained. | P §5.1; EC §13 / D |
| 67 | Supply event_id member twice, both I(6) | Reject / keep EXECUTING; duplicate member names fail even when values agree. No first/last-wins rule. | P §5.1; EC §4 / D |
| 68 | Remove payload; add unknown top-level explanation_copy containing the former complete payload | Reject / keep EXECUTING; unknown extension cannot replace required explanation. | P §§5.1, 5.3 / D |
| 69 | occurred_at is null | Reject / keep EXECUTING; required known field cannot use null for unknown time. | P §5.1; EC §4 / D |
| 70 | P1/H0/E1; sequence, selected position and B all become integer 0; rebuild | Accept / CREATED; minimum in-range initial ordinal, no implicit start-at-one rule. | P §6; EC §8 / D |

### 4.7 Retention, imported/local history and immutable dependencies

| Case | Complete history, candidate and authoritative-material changes | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 71 | P6/H5/E6; E1–E3 and all exact historical dependencies/grants arrive from a lossless offline archive; E4–E5 are local. Membership/verification is independently established for both parts, not inferred from archive origin. | Accept / COMPLETED; imported/local storage origin changes no semantic input or identity. The original explanation remains interpretable. | P §§2, 5.3, 6–7; VE-002 §§21–23 / A+D |
| 72 | Recorded membership H3 followed by foreign Event J: event_id I(80), Action A, sequence 35, time Q, spec_version (VE-002,0.2), full type (authority Text rs-event-002.example, profile Text imported-policy, revision Text 1, kind Text POLICY_RECORDED), payload Text retained-policy-record, other known optionals absent. J's exact governing type/reference contract unavailable. Proposed E4 rebuilt for J as prior head, sequence 40, with its complete independent input bundle. | No accept—unsupported; retain J; **no complete projection**. H3 establishes only a partial READY prefix. J cannot be assumed harmless/non-transition-causing from its local name. This scenario does not allocate or finish that foreign type. | P §§2, 6–7; EC §6 / D |
| 73 | Replay H6 with authoritative membership intact, no new candidate; independent historical verification material/results for E4 now unavailable. All inline copies and other historical inputs retained. | Unsupported E4; **no complete projection**. H3 is only a supported READY prefix; E5/E6 cannot prove a complete successor state across the gap. No deletion, re-admission or today's Policy substitution. | P §§4.1, 5.3, 6 / D |
| 74 | P6/H5/E6; candidate resolver supplies a different profile text under the same L identifier, claiming EXECUTION_COMPLETED maps to FAILED. The pinned publication is available and contradicts it. | Reject / keep EXECUTING; demonstrated retargeting, not a profile update or local choice. | P §§2–3, 6; EC §6 / D |
| 75 | P1/H0/E1; exact Action schema semantic material unavailable in the authoritative input bundle and candidate explanation; its identifier/digest and all other available inputs retained | No accept—unsupported / no Lifecycle state; candidate cannot use an Action digest or remembered schema name as its missing semantic closure. No existing interpreted history supplies the missing material. | P §§2, 6 / D |
| 76 | P6/H5/E6; time assessment independent verification unavailable, and fact result refuted with its contrary basis | Reject / keep EXECUTING; known invalidity takes precedence over missing time verification. | P §4.1 / D |
| 77 | P6/H5/E6; fact unknown and its basis records insufficient success evidence; time assessment independent verification unavailable | No accept—unsupported / keep EXECUTING; unsupported precedes unestablished. Never turn missing evidence into failure or success. | P §4.1 / D |

The foreign J in case 72 is a fully specified **retained unsupported input**,
not a conforming eighth type. Its payload need not be interpreted to derive
the unavailability outcome. A positive replay of an imported Policy/approval
type would require its complete owner contract; this scenario deliberately
does not invent one. Case 71 is the positive mixed imported/local history of
known types; case 72 tests the additional foreign-type dependency boundary.

## 5. Pressure-test disposition and remaining decisions

### 5.1 What can be determined without local defaults

For cases 01–77 the profile supplies enough rules to derive the displayed
**acceptance/non-acceptance and complete-projection boundary** from the
specified established inputs. No new semantic ambiguity is identified within
that boundary. The matrix fixes source scopes, whole context, assessment sets,
Action/fact/Event/head bindings, interval equality, explicit absence and
dependency availability rather than leaving an implementation to choose them.
The same inputs therefore do not permit different accepted Lifecycle states.

Three limits must not be silently completed by executable fixtures:

| Issue / affected criterion | What authority already supplies | Smallest compliant treatment |
|---|---|---|
| Authenticating raw material or deciding real fact truth; criteria 2 and 6 | P §4.1 explicitly consumes independent established results and scoped grants, with failure/unavailability rules. It does not implement their owners. | Supply these results as the explicit semantic test inputs above. A later operational test needs the owner's actual contract and evidence, not an `admitted=true` shortcut. No new clock/trust architecture is required for this matrix. |
| Arbitrary owner text, evaluator version or imported Policy type missing; criteria 1, 2 and 6 | P §§2, 4.1, 5.3 and 7 require actual immutable meaning and inline explanation. A source name, version label, digest or URL cannot stand in for missing meaning. | Exercise the specified unsupported/rejection boundary. Do not invent positive foreign-type semantics or an evaluator-version field. If a deployment needs reference-only explanation, close that owner-specific contract and publish new profile identifiers through governance. |
| Exact partial replay output or diagnostic spelling; criteria 5 and 6 | P §6 deliberately supplies a safety boundary, not a generalized partial-replay algorithm; it does not name a standard code for unselected competing proposals. | Compare retained membership, no append, no complete projection and any explicitly established prefix. Do not demand identical speculative later partial states or encode a scenario-local diagnostic as normative. Broader output standardization would need a separately reviewed Draft clarification with identifier revision if meaning changes. |

These are bounded applicability/output limits, not permission to infer unknown
inputs. A test demanding arbitrary Policy re-execution, a positive interpretation
of J, or a standardized full partial-state trace cannot be completed from this
profile alone. That would be an expanded task, not a passing instance of the
matrix. No conflict requiring an Approved semantic change is demonstrated here.

### 5.2 Acceptance-criteria accounting

| Gap-analysis §10.2 criterion | Coverage and honest disposition |
|---|---|
| 1: seven kinds and immutable dependencies | §2 pins exact publication and transitive source selection; 01–07 cover every type; 19, 72, 74–75 prevent name-based substitution and missing-material completion. Source Draft maturity remains explicit. |
| 2: exact facts/evidence and existing transitions | 01–10, 16–37, 76–77 exercise evidence scope, source recognition, contradiction/uncertainty and existing transitions. A fixture's verified input is not evidence that a production verifier is correct. |
| 3: time and field domains | 14, 38–49 and 57–70 cover identical/different intervals, malformed domains, exact fact time, presence, nulls and extensions. No new timestamp or explanation format is defined. |
| 4: history/identity/order/failure | 10–15, 21–22, 58–59, 70–77 preserve protected selection, uint64 bounds, immutable IDs and retained unsupported history. |
| 5: traceable examples | All 77 have explicit sources, complete baselines/deltas and projected outcomes. They are prose cases, not execution or exhaustive §21 coverage. |
| 6: independent meaning | Written-case derivability is supported at the established-input boundary; independent implementations and independent-team results are still absent. No parser, cryptography, concurrency or production clock claim follows. |
| 7: compatibility/governance | Approved ownership remains unchanged. The new profile's identifiers/input interface/inline-only explanation/UTC interval choices still require human acceptance; no approval is granted here. |

### 5.3 Can executable fixtures now be created?

**Yes for these bounded semantic cases**, by expanding the explicit values and
comparing acceptance, retained membership and the stated projection boundary.
That does not require new semantics, wire encoding, real authentication or a
clock service. It must preserve separate independent establishment inputs and
must not read producer copies as authentication. Missing-material cases must
actually remove the designated dependency from the relevant interpretation
input, not replace a check with a hard-coded expected failure.

**No claim is made for a complete general profile conformance suite.** Positive
foreign-type replay, arbitrary Policy evaluation, real-world input establishment,
lossless packaging and generalized partial-history output remain outside this
matrix. A future executable task must retain these boundaries, record its own
source pins and oracle provenance, and disclose authorship/independence. Neither
this document nor the historical experiment supplies that future result.

Policy-reference deferral is justified only for the inline subset. Cases
04 and 50–56 preserve authorization and historical explanation duties;
case 72 keeps mixed-history Policy dependencies visible. Human approval paths
need their existing Events and exact owners; they cannot be bypassed using the
no-approval fixture. There is no new primitive, authority role or Approved
specification amendment, so this non-normative addition requires no RFC/ADR.
A later discovered Approved conflict must instead identify the affected rule
and follow RFC, Accepted ADR and governed specification change procedures.

**Representation readiness remains unestablished.** The next possible evidence
task is implementation of this separately pinned semantic matrix, only when
authorized; it is not begun here. Draft approval, independent-team replication
and representation design are separate decisions.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-23 | Initial non-normative 77-case established-input matrix for the exact pinned lifecycle profile Draft v0.2; no profile, experiment, fixture or workflow changes. |
