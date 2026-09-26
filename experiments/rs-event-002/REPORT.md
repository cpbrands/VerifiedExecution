---
id: RS-EVENT-002-EXECUTABLE-COMPARISON
title: RS-EVENT-002 Bounded Established-Input Comparison
version: "0.2"
status: Draft
document_type: Experimental Comparison Report
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-25
updated: 2026-09-26
depends_on:
  - RS-EVENT-002
  - BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
related_documents:
  - EVENT-SEMANTIC-FIELD-CONTRACT
  - VE-002
  - VE-003
  - VE-004
  - VE-006
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# RS-EVENT-002 Bounded Established-Input Comparison

## 1. Result and boundary

The two same-author evaluators agree with the separately transcribed oracle on
**87/87 bounded cases** from [RS-EVENT-002 Draft v0.3](../../reference-scenarios/RS-EVENT-002-BOUNDED-LIFECYCLE-PROFILE-V02.md).
Results: **19 accept, 55 reject, 6 unsupported, 6 unestablished, 1 unselected**.
Case 10's last label is local test terminology for no authoritative successor
selection, not a new profile rejection code. Both proposals remain unappended;
the established EXECUTING history is retained. It is not relabeled as a known
invalid Event to force a four-category report.

This is non-normative experimental evidence, **not independent-team replication
or general conformance**. It does not approve the profile or its Draft imports.
Representation readiness remains unestablished. The earlier RS-EVENT-001
experiment is neither imported as semantic logic nor reinterpreted as evidence
for this profile. Its sources, report and tests remain unchanged.

The inputs are **externally established semantic inputs**, including exact
scoped grants, verification outcomes and historical material. The experiment
does not create real-world fact truth, authenticate raw evidence, implement a
trusted clock, re-evaluate arbitrary Policy Text or prove an operational
Boundary correct. Copying an assessment or its explanation never supplies its
independent establishment result. KN's recorded evaluator defect is retained,
not corrected by a local Policy evaluator.

Base and fetched main at preparation:
`cc91ae116959ad6535b3d2b5b5f6ac602e651587`, with no advancement.
Measured runtimes: Node v24.19.0; Python 3.9.6. No third-party packages.

## 2. Historical provenance and transcription

`fixtures.json` records 55 exact commit/path/blob/SHA-256 pins. The scenario and
profile are selected at the base commit above; the other 53 are the entire
repository-local specifications/ADRs/RFCs snapshot at the profile's declared
import commit `56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f`. This intentionally
over-inclusive owner-material bundle preserves the historical definitions;
it is not a claim that all 53 are necessary for each Event. External standards
and arbitrary owner interpretation remain outside the established-input test.

| Source | Git blob | SHA-256 of exact file bytes |
|---|---|---|
| RS-EVENT-002 Draft v0.3 | `860c6430f7127ca89ed03f3f8b8963789a0b236e` | `efb03a4ff5d4e105b0bac5be99a23f6e23ef777368ac0ee95d6239004e98ee20` |
| Profile Draft v0.2 | `a8a88e94be403be9ffc0efd01986a5db9446757e` | `dfd184858a0a925c8da37c67a2ddd6c69e89f7ed064446779ed2122950e98c2b` |

The runner reads `git --no-replace-objects cat-file blob COMMIT:PATH`, disables
lazy fetching and verifies both fingerprints before evaluation. It never reads
mutable HEAD as a substitute, never accepts a different path with a convenient
version label, and never skips a source assertion. Missing full history is a
reproduction failure, not an unsupported semantic case. By contrast case 75
intentionally removes the actual schema bytes from the evaluator's verified
material catalog after provenance checking; it is not an expected-failure flag.

Fixtures and oracle were transcribed separately before either evaluator ran.
Their pre-execution SHA-256 values, unchanged through implementation, are:

| Artifact | SHA-256 |
|---|---|
| `fixtures.json` | `8593fd1931fa98402922fb6ae4de224fd067c56b9cf0af9a4dc1c31eaa9cd334` |
| `oracle.json` | `15cca894f32b03650abe1c4e0046bb37802b9bb77f83b4b2f53aa50b434d350a` |

The test checks all 39 explicitly delimited literal Text values against their
exact historical source blocks. It does not derive Text from rendered Markdown
or unspecified document ranges. FX and KN are copied whole, including the
observation cutoff and reported strict-comparison defect. Assessment copies
and establishment records are materialized values, not runtime mutation rules.

Local JSON is **test syntax only**, not a VE representation. Decimal integer
tags preserve uint64 and rational components; octet strings use local hex;
member-pair lists preserve the duplicate-member negative case. Interned local
`$ref` definitions only expand a finite data DAG before either evaluator runs.
They are neither Event references nor portable semantic identities. All cases
start from complete values, not the preceding case. Case labels, categories and
the oracle are removed from evaluator inputs. Local Action material slots carry
the pinned owner definitions; they do not add fields to normative Action.

Case 72 deliberately retains J with an unavailable foreign type. Its local
carrier has unused common input slots; neither evaluator interprets those as
foreign-type assessments or manufactures positive J semantics. Both stop at
the unavailable type, retain all membership, and expose only the established
READY prefix. Generalized partial replay remains outside scope.

## 3. Implementation separation and observable contract

`staged.py` decodes exact Python integers, validates in stages, collects failures
by precedence, then folds an authoritative sequence into a projection.
`rule-graph.mjs` decodes BigInt values, accumulates independent constraints and
resolves a cached recursive prefix dependency graph. Its structural equality
uses a private record/list/set fingerprint; Python uses recursive comparison
and explicit set membership. Their calendar, reduced-rational, authority,
contradiction, admission and transition code is separately written. Neither
imports the other, the oracle, the runner or RS-EVENT-001 semantics. Shared
material is limited to data and process/assertion plumbing. Common authorship
and common source interpretation remain correlated-error risks.

No semantic number passes through binary floating point. Interval endpoints
use exact Gregorian fields and cross-multiplied reduced rational fractions.
Time equality does not order history; protected selection and authoritative
sequence do. Source lists remain ordered, role/assessment sets are unordered,
and exact duplicate assessments collapse without dropping contrary records.

For every row the comparator checks classification, complete Lifecycle state
or its absence, retained Event membership, append/non-append, explicitly
established prefix, and required source-derived reason. It additionally checks
both evaluators' entire outputs for equality. Reason names are local obligation
labels, not normative diagnostic spelling. It does not require a speculative
later partial-state trace for cases 72–73. The oracle is never regenerated from
evaluator output.

## 4. Coverage and fault detection

The scenario partition remains: 7 mappings, 5 positive controls, 57 isolated
non-acceptance rows, 10 compound defenses, 7 invariances and 1 intentionally
redundant row. This is 87 rows, not 87 independent semantic algorithms.

There are **52 named mutation/witness families**, each exercised in both
evaluators: **104 semantic-mutant tests**. Set-order and duplicate-collapse
tests use the same faulty ordered-list comparison with different witnesses.
Therefore there are **51 distinct source mutations per evaluator (102 total)**,
not 104 distinct implementations. Each test requires the intended classification,
state, completeness and obligation, valid output shape, and disagreement with
the unchanged oracle. Crashes, unchanged results and malformed output do not
count as detected semantic faults.

The following maps every one of the scenario's 70 written-rule obligations to
fault witnesses. Shared mutants across observationally equivalent branches are
explicit; these are bounded detections, not proof of arbitrary-input coverage.

| Source family / count | Cases | Fault witness or equivalence |
|---|---|---|
| Seven mappings / 7 | 01–07 | One wrong-target mutation per type |
| Shortcut and terminal / 2 | 08,09 | Add illegal edge; permit post-terminal edge |
| Unique selection / 1 | 10 | Locally elect first unselected proposal |
| Append ordinal / 1 | 11 | Remove strict predecessor comparison |
| Sequence bounds / 2 | 58,59 | Remove uint64 domain gate; 13 is redundant |
| Maximum/gap and zero / 2 | 12,70 | Lossy integer narrowing; forbid zero |
| Delivery invariance / 1 | 14 | Replay delivery order instead of sequence |
| ID reuse and width / 2 | 15,57 | Disable each respective check |
| Eight binding components / 8 | 16–23 | Same equality-gate mutant, eight distinct inputs |
| Fact absent/refuted/unknown / 3 | 24,26,86 | Disable required-positive gate for 24/86; disable refutation for 26 |
| Establishment missing/failed / 2 | 27,28 | Ignore each establishment status |
| Role/fact scope / 2 | 29,84 | Ignore scope/grant and its failed establishment |
| Required condition missing/denied / 2 | 31,32 | Disable required positive / denial gates separately |
| Optional contradiction/control / 2 | 85,87 | Ignore contradiction; require optional condition |
| Unknown extra / 1 | 34 | Misread unknown as refutation |
| Commit missing/non-commit / 2 | 35,36 | Disable each completion gate |
| Time equal/unequal / 2 | 38,39,40 | Reject equal corroboration; ignore disagreement and Event mismatch |
| Unknown/missing time / 2 | 41,42 | Same missing-established-bound gate, both inputs |
| Five time domains / 5 | 43–46,48 | Disable endpoint/interval validation; all five witnesses |
| Exact Event time / 1 | 49 | Ignore Event/bound inequality; 47 also witnesses generic binding |
| Point/rational time / 2 | 82,83 | Reject zero-width; restrict the rational domain to zero numerator |
| Applicable edition / 1 | 53 | Ignore unavailable context establishment |
| Indirect Policy explanation / 1 | 54–56 | Ignore failed context establishment for all three substitute classes |
| Forbidden fields / 3 | 61–63 | Ignore prohibition, one witness per field |
| Required nulls / 2 | 64,69 | Synthesize missing payload/time from external copies |
| Closed nested/opaque extension / 2 | 65,66 | Ignore explanation shape; reject opaque extension null |
| Duplicate member / 1 | 67 | Ignore repeated member name |
| Missing payload / 1 | 68 | Use unknown extension as required payload |
| Imported known history / 1 | 71 | Deny imported records despite preserved authority |
| Unknown type/history establishment / 2 | 72,73 | Treat unknown J as no-op; ignore unavailable historical establishment |
| Retargeting/missing closure / 2 | 74,75 | Ignore changed type binding; ignore actual missing material and establishment |
| Set order/duplicates / 2 | 80,81 | Same faulty ordered-list equality, distinct inputs |
| Actual commencement/invocation / 0 extra | 78,79 | Refutation mutant; additional type-specific witnesses |

Compound rows are not added to 70. Payload-copy/shape corruption in 50–52/60
has additional explanatory-check mutants. Favorable/negative defenses in
25/30/33/37 remain baseline comparisons, not mislabeled contradiction isolates.
Separate precedence mutants exercise reject-before-unsupported (76) and
unsupported-before-unestablished (77).

The runner has 12 negative-control test groups: missing/duplicate/extra cases,
unknown categories, skip flags, missing/cyclic local references, malformed
inputs, oracle cardinality, wrong outcomes/reasons, evaluator disagreement,
and subprocess failures/malformed or skipped output. Two provenance regression
groups alter every pinned source byte and SHA-256, mismatch source paths, and
request missing commits/paths despite available current checkout files.

The correction adds **13 negative-control groups** and **one positive selector
control**. Ten selector groups cover absent/null/malformed/undeclared fixed
selectors, an unbound declared fixed selector, null/malformed/undeclared
presented selectors, identical arbitrary selectors, and selector swapping.
Three provenance groups reject altered profile pins, altered historical profile
bytes, and an unverified catalog. Errors have name `ExperimentValidationError`,
phase `fixture` or `provenance`, and a specific asserted code:
`SELECTOR_SYNTAX`, `SELECTOR_UNDECLARED`, `FIXED_PROFILE_BINDING`,
`PROFILE_PIN`, `PROFILE_BYTES`, or `UNVERIFIED_PROFILE`. Selector and pin
controls exercise the comparison entry point; validation precedes either
semantic evaluator. Crashes and oracle disagreements cannot satisfy them.

The runner first verifies the recorded profile commit/path and both fingerprints
against its immutable experiment binding, then derives the fixed selector from
the verified Git blob. Local-test selectors are strings matching
`^[a-z0-9]+(?:-[a-z0-9]+)*$`, with the closed domain consisting only of
`a8a88e94be403be9ffc0efd01986a5db9446757e` and
`retargeted-completion-to-failure`. Every `fixed_profile` must equal the former;
every `presented_profile` must independently satisfy syntax and closed-domain
membership. Equality between arbitrary tokens is insufficient. This is test
syntax only, not a VE registry, wire rule or representation-profile allocation.
The positive control proves case 74's declared alternate reaches both evaluators
and remains `reject`, retaining `EXECUTING`, with obligation `retargeting`;
it is not the separate `unselected` outcome of case 10.

The new `nonzero-rational-domain` family changes each evaluator's semantic
endpoint domain from nonnegative proper rational fractions to zero numerator
only. Case 83 consequently produces `reject` / `EXECUTING` / `time-domain`
instead of acceptance. Neither parser nor fixture nor floating-point handling
changes. The existing equal-corroboration mutant still shares case 83 as a
witness, but is a distinct fault; witness reuse is not a new scenario case.
Fixture and oracle bytes, source pins and both baseline evaluators are unchanged.

## 5. Discrepancies and limits

The initial full comparison agreed with the original oracle on all 87 cases;
no fixture or expected result was adjusted to obtain agreement. Fault-test
development exposed harness defects: an ignored failed-establishment status
fell through as unavailable; an output-shape assertion rejected a mutant's
31-octet ID before semantic comparison; a broad precedence mutation selected
unestablished when its test expected unsupported; and a payload-synthesis
mutation inserted before member-count validation triggered an unrelated
duplicate-member failure. Mutation sites/expectations and the transport-only
output check were corrected, and precedence was split into two targeted faults.
The baseline normative width check and oracle remained intact.

Repeated runs exposed intermittent Python timeouts in synchronous process I/O
on this host, including one test invocation after an initially passing suite.
Moving the CLI past module initialization alone did not eliminate them. The
runner now supplies input and drains both subprocess output streams
asynchronously, with the same 15-second deadline, bounded output, and hard
failure on process/pipe/JSON errors. No retries or fallback results are used.
The standalone-process regression checks all 87 counts. Failed launches were
not counted as semantic success. This plumbing correction changed no evaluator,
fixture or oracle result and is not a claim about an independently diagnosed
OS defect.

Agreement checks the specified interface and explanation structure, not a
general natural-language completeness engine. In 54–56, independent failed
context establishment supplies the semantic defect; recognizing a string that
looks like a URL is not treated as an authority mechanism. Unknown extra facts
in 34 cannot refute established completion; absent required time verification
in 77 remains unsupported. KN is consumed as an authoritative reported result,
not endorsed as a correct inclusive Policy calculation. No new owner semantics
were needed for the 87 source outcomes.

The experiment adds no wire/canonical representation, production verifier,
clock, primitive, governance decision or Draft promotion. Correlated bugs,
uncovered combinations, positive foreign-type semantics, real establishment,
arbitrary Policy interpretation and operational lossless packaging remain
unproved. This report does not change historical sources' statement that those
sources themselves supplied no executable evidence.

## 6. Reproduction and verification

Use Git with **full recorded history**, Node 20 or newer and Python 3.9 or newer.
`PYTHON` may select another Python executable; `node`, `python3` and `git` must
otherwise be on PATH. From this repository root:

```sh
node experiments/rs-event-002/compare.mjs
node --test experiments/rs-event-002/compare.test.mjs
node --test
node scripts/validate-documentation.mjs
git diff --check
git status --short
```

For a separate checkout, clone without `--depth` or `--filter`, fetch the PR
branch, and detach at its **reviewed exact commit** before running those commands:

```sh
git clone https://github.com/cpbrands/VerifiedExecution.git ve-event-002-reproduction
cd ve-event-002-reproduction
git fetch origin experiment/rs-event-002-comparison-2026-09-25
git checkout --detach FETCH_HEAD
git rev-parse HEAD
git rev-parse --is-shallow-repository
```

Verify HEAD against the PR's reviewed SHA rather than silently following a later
branch update. An offline full clone of the committed repository reproduces
the same experiment; no checkout of the historical source tree is required.
The experiment creates no fixture files or Python bytecode. It needs no stashes.

Validation results: 222 experimental tests (87 comparisons, 104 mutant
tests, 25 negative runner controls, 1 positive selector control,
4 fixture/literal/provenance tests, 1 CLI regression); **302 total
repository tests**, preserving all 80 existing tests; **149 Markdown documents**.
The clean full-history clone reproduces the same counts and 87 outcomes, with
a clean working tree. Diff/UTF-8/text-hygiene checks pass. Existing workflows
remain unchanged: GitHub's Documentation integrity job validates documentation
and runs only the **27 documentation-validator tests**, **not** these experiments
or the complete 302-test suite. Exact-head Actions must be checked separately
on the published PR; green documentation CI is not experimental execution.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-09-26 | Bind closed test selectors to verified historical profile provenance; add selector/provenance controls and nonzero-rational-domain mutants. Fixture/oracle bytes and bounded limitations unchanged. |
| 0.1 | 2026-09-25 | Historical-pinned, same-author two-language comparison of all 87 established-input cases, with separate oracle, semantic mutants and reproduction controls; no source or authority changes. |
