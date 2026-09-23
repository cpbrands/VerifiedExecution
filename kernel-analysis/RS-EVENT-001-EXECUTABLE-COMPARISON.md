---
id: RS-EVENT-001-EXECUTABLE-COMPARISON
title: RS-EVENT-001 Executable Semantic Replay Comparison
version: "0.2"
status: Draft
document_type: Experimental Comparison Report
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-22
updated: 2026-09-22
depends_on:
  - RS-EVENT-001
  - GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS
  - EVENT-SEMANTIC-FIELD-CONTRACT
related_documents:
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# RS-EVENT-001 Executable Semantic Replay Comparison

## 1. Status and reproducibility

This is **non-normative, bounded experimental evidence**, not a specification,
Draft approval, or general Event conformance certificate. It executes the
23 cases documented in [RS-EVENT-001](../reference-scenarios/RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS.md)
following the [merged Gap Analysis](GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS.md).
The original experiment changed neither source document. Their historical statement that they
supplied no executed comparison remains accurate; this report supplies later,
separately scoped evidence, not a retroactive execution claim.

Base: `9169fc0f1017e2b657691a9c5b001ad82dffe981`. Run date: 2026-09-22
(America/Edmonton). Measured runtimes: Python 3.9.6 and Node v24.19.0.
No third-party packages are required. From the repository root:

```sh
python3 --version
node --version
node --test experiments/rs-event-001/compare.test.mjs
node scripts/validate-documentation.mjs
node --test
git diff --check
```

The runner uses `python3`; set `PYTHON` to another Python 3 executable if needed.
The commands read files and execute in memory; no fixture regeneration, source
editing, bytecode files, or stash operations are involved. Runtime differences
remain visible and should be reported, not used to change the oracle.

The original experiment revision is commit
`83ff96fb301c317f0502827b275bc7f0d7e95b50`, containing these exact file
fingerprints. This table remains historical; the runner correction is recorded
separately below:

| Artifact | SHA-256 |
|---|---|
| [Fixture inputs](../experiments/rs-event-001/fixtures.json) | `510dcddb1781c674b997a55e4af71be2d49a92bfd2f177df72bb34945aabee83` |
| [Source-derived expected results](../experiments/rs-event-001/expected.json) | `b467cc87b9398625f0fb526906d8ff34f8df2c37f91b12240707d347715f4d88` |
| [Python append-first implementation](../experiments/rs-event-001/append-first.py) | `5b2d7b36a993de8634a0300a904f95d663435468df3da12e19f081210c91b139` |
| [Node history-first implementation](../experiments/rs-event-001/history-first.mjs) | `3918bb74cad45e43957ea5f6154edfa7b7451d79b436e8e256be930acc8a8e88` |
| [Comparison runner and fault tests](../experiments/rs-event-001/compare.test.mjs) | `f4c0b3f124ddb671b3ada959dc3ed342757f36010a86696292079c9a0b26b0a8` |

`fixtures.json` pins ten source blobs, including the scenario, Gap Analysis,
[Event contract](../specifications/EVENT-SEMANTIC-FIELD-CONTRACT.md),
[VE-002](../specifications/VE-002-event-specification.md),
[VE-003](../specifications/VE-003-lifecycle.md),
[VE-004](../specifications/VE-004-receipt-specification.md),
[VE-005](../specifications/VE-005-adapter-specification.md),
[VE-006](../specifications/VE-006-execution-boundary-specification.md),
the imported Rule specification and governance. These identify the historical
inputs at the recorded base, not a current-governing-source synchronization
requirement. The original runner incorrectly read mutable working-file bytes.
The corrected runner verifies bytes at the recorded commit as described below.

### 1.1 Historical-source verification correction

The gap-analysis follow-up at `56f755cc73421f472dc176e4f14194d6c7a54b88`
changed the analysis but preserved the experiment. Its 77/78 test result exposed
the original reader's conflation of current files with historical source pins.
The original ten blob pins, fixture `base`, oracle and semantic fixtures remain
unchanged. No source is repinned to the new analysis or latest authority.

The corrected runner loads **all ten** source paths using
`git --no-replace-objects cat-file blob <recorded-base>:<path>` at exactly
`9169fc0f1017e2b657691a9c5b001ad82dffe981`, then recomputes each Git blob hash
from the returned bytes against its original pin. Commit/path lookup preserves
provenance as well as byte integrity; an arbitrary matching blob is insufficient.
Replacement objects are disabled, lazy network fetching is disabled, and missing
history/path or a byte mismatch fails without falling back to HEAD or disk.
The original fixture SHA-256 and exact base are also asserted, preventing a
silent edit to the source-pin map or recorded commit from passing this test.

Corrected runner SHA-256:
`506b92011d83ba03487579308115394f33d38d9ab0924080394f2e2c64e7da57`.
The correction revision is the commit containing that runner fingerprint and
this report revision. The original runner fingerprint above remains available
at the original experiment commit. Both semantic implementations and the
oracle retain their original fingerprints; this correction changes only
provenance checking and adds two integrity regressions.

Reproduction requires Node, Python, Git and a clean checkout with the recorded
base commit's source tree available. A normal full clone followed by checkout
of the reviewed correction revision provides this history. Before running the
commands above, verify availability with:

```sh
git cat-file -e 9169fc0f1017e2b657691a9c5b001ad82dffe981^{commit}
```

For a shallow checkout missing that commit, explicitly fetch it first:

```sh
git fetch origin 9169fc0f1017e2b657691a9c5b001ad82dffe981
```

The tests themselves never fetch or repair source material. A source archive
without Git history is insufficient; a full clone works offline once populated.
One added regression flips a byte in each of the ten historical sources and
requires the same production integrity assertion to reject it. The other
requires missing-commit and missing-path rejection, including a path present
in today's checkout but absent at the recorded base. Neither test edits sources.

Rerunning this corrected harness reproduces the original bounded experiment;
it does not validate changed governing specifications. A current-authority
experiment would need explicitly reviewed new provenance and applicable cases,
not replacement of these historical pins. Same-author and coverage limitations
remain unchanged.

## 2. Inputs, oracle and implementation separation

The JSON is **local fixture syntax, not a VE wire format**. It uses labels,
decimal strings, and hex spellings to transport exact abstract values to test
code. H32 identifiers, authority aliases, T(n) instants and references expand
mechanically from scenario §§2–4. Proposal rows contain the record label,
explicit predecessor and evidence-admission input. Selection is explicitly
absent for unselected proposals. These wrappers are not Event fields.

All histories and cases are isolated. Stored membership is separate from
delivery, which may be disordered or repeated. Historical membership was
established with dependencies available at original admission. For T3/T4/R4,
the named material is unavailable throughout fresh replay, with no checkpoint.
Unavailable type definitions are removed from supplied material; unavailable
time definitions are removed from the time-domain material. Dependency checks
precede semantic effects even if a transition could otherwise be guessed.

Immutable binding and presented material are distinct inputs. T2 supplies the
original binding and an altered presented definition, allowing rejection of
retargeting. N3 carries a later, unselected definition separately; it cannot
change the historical contract. Neither mechanism implements a resolver,
registry, authenticated distribution protocol, or source-proof scheme.

The fixture supplies evidence admission and exact-time establishment as
external facts. No code authenticates Lynx evidence, elects a successor, or
proves that an asserted external fact actually happened. B3's Adapter observation
and V1's offered Receipt cannot substitute for those inputs. S2 is an append
request with a proposed ID but no possible sequence or selected append position,
not a purported conforming Event with an omitted field.

The oracle was written from scenario §§5–6.4 and §8, checked against the Event
contract and VE-003 transition table, **before either implementation was run**.
Each expected row records its derivation. Its fingerprint above was recorded
before execution and remains unchanged. Expected outcomes are not calculated
by either replay implementation. The runner maps human labels to exact IDs
only; it does not derive history, ordering, admission or projection results.

Python eagerly validates candidate fields, binding, dependencies, evidence and
protected assignments before extending a prefix, then replays it. Node builds
an occurrence index from authoritative membership, orders it by insertion,
checks candidate extensions as constraints, and lazily resolves meaning while
folding history. Python uses arbitrary-precision `int` and sorting; Node uses
`BigInt` and insertion ordering. They encode the bounded VE-003 transition
function separately (a keyed transition map versus a relation search).

They share **fixture data and test plumbing only**: no semantic validator,
ordering helper, transition code, dependency checker or oracle-reading code.
Python receives input on stdin; Node receives only a plain input object.
Neither receives case IDs or expected outputs, imports the runner, or reads
fixture/oracle files. This is structural and algorithmic separation, not a
claim of independently authored engineering teams: both were developed in the
same task and share a possible common misunderstanding of the sources.

Local results compare exact ordered occurrence IDs, final supported state,
non-appended candidates, unsupported retained members, partial interpretation
and invalid-history indication. `state = null` represents the initial `NONE`
marker, not a new Lifecycle state. Local result keys and flags are not a VE API
or error taxonomy. “Rejected” includes unselected candidates remaining proposals;
it does not assert that every such candidate is structurally malformed.

## 3. Executed results and source mappings

Every row below matched the separately recorded oracle in **both** implementations.
Order symbols have their unchanged scenario meanings: S is E01–E07, S30/S50/S60
are its named prefixes; H is S50 plus E20 and E21 at the uint64 boundary. Exact
ordered ID lists and excluded/unsupported members are in `expected.json`.

| Case | Observed order / supported projection | Admission or interpretation result | Source mapping |
|---|---|---|---|
| B1 | S / `COMPLETED` | all seven admitted and replayed | Scenario §5; VE-003 §10 |
| B2 | S60 + E17 / `FAILED` | failure admitted | Scenario §6.1; VE-003 §10 |
| B3 | S60 / `EXECUTING` | no terminal Event from uncertainty | Scenario §6.2; VE-004 §7 |
| T1 | S60 + E18 / `EXECUTING` | B simulation retained, no lifecycle trigger | Scenario §4; Event §6 |
| T2 | S60 / `EXECUTING` | retargeted E07 excluded | Scenario §8; Event §6 |
| T3 | S / partial `EXECUTING` | E07 unsupported, still retained | Scenario §6.4; Event §§6,15 |
| T4 | S / no state established | all seven unsupported, still retained | Scenario §6.4; Event §§6,15 |
| O1 | S60 / `EXECUTING` | E07/E17 remain proposals | Scenario §8.2; Event §8 |
| O2 | S / `COMPLETED` | selected E07 admitted; E17 excluded | Scenario §8; Event §§8,14 |
| O3 | S60 + E17 / `FAILED` | selected E17 admitted; E07 excluded | Scenario §8; Event §§8,14 |
| D1 | S / `COMPLETED` | delivery disorder does not order history | Scenario §8; Event §8 |
| D2 | S / `COMPLETED` | one E04 occurrence despite two deliveries | Scenario §8.1; VE-002 §§4,20 |
| S1 | H / `COMPLETED` | maximum accepted, exact integer values | Scenario §6.3; Event §8 |
| S2 | H / `COMPLETED` | E22 append blocked by exhaustion | Scenario §6.3; Event §8 |
| S3 | S50 + E20 / `EXECUTING` | E21 at 2^64 excluded | Scenario §6.3; Event §§8,15 |
| N1 | E01,E02,E03,E05,E06,E07 / `COMPLETED` | null-actor E04 excluded; later assignments explicitly bypass it | Scenario §8; Event §4 |
| N2 | S / `COMPLETED` | opaque null extension admitted | Scenario §8; Event §§4,13 |
| N3 | S / `COMPLETED` | later unselected meaning has no effect | Scenario §8; Event §13 |
| R1 | S / `COMPLETED` | exact permitted pair retained | Scenario §4.1; Event §12 |
| R2 | S50 / `AUTHORIZED` | forbidden references exclude E06 | Scenario §8; Event §§5,12 |
| R3 | S30 / `READY` | Rule substituted for Policy excludes E19 | Scenario §8; Event §12 |
| R4 | S30 + E04 / partial `READY` | E04 unsupported; no later Events supplied | Scenario §6.4; Event §§6,15 |
| V1 | S60 / `EXECUTING` | Receipt-only justification cannot admit E07 | Scenario §8; VE-004 §§4,11,14 |

**Executed scenario comparison: 23/23 matched in Python, 23/23 matched in
Node, 23/23 agreed across implementations.** No baseline discrepancy was
observed; no expected result was revised to obtain agreement. This statement
is limited to these exact executable fixtures, not universal convergence.

Three supplemental test groups also passed in both implementations: admitted
evidence without protected selection; delivery of an unadmitted terminal record
without membership; and wrong actor, null time and fractional-time domain
rejections. These are explicitly separate controls, not additional scenario
cases silently included in the 23/23 count.

## 4. Deliberate semantic faults

The runner mutates each implementation's actual semantic code **in memory**,
one fault at a time. It requires a well-formed result that fails oracle equality;
a crash or failed process invocation does not count as successful detection.
No mutation edits repository files or inserts a case-ID switch. Each mutation
site is required to occur exactly once so refactoring cannot silently disable it.

| Deliberate fault | Witness | Detection in Python / Node |
|---|---|---|
| Select by local name instead of complete authority | T1 | detected / detected |
| Accept a retargeted definition | T2 | detected / detected |
| Ignore a required dependency | R4 | detected / detected |
| Use delivery order as history order | D1 | detected / detected |
| Round uint64 through binary64 | S1 | detected / detected |
| Ignore actor null/domain restriction | N1 | detected / detected |
| Reject opaque unknown null | N2 | detected / detected |
| Apply later unselected extension meaning | N3 | detected / detected |
| Ignore reference permissions | R3 | detected / detected |
| Bypass admitted evidence | V1 | detected / detected |
| Bypass protected selection | supplemental isolated control | detected / detected |
| Project completion to failure | B1 | detected / detected |

**24/24 mutants detected**: twelve faults in each implementation. The protected
selection control is separate because O1 has both unadmitted evidence and no
selected successor; merely removing one check there could be masked by the
other. These mutation results show sensitivity to the selected mistakes, not
exhaustive fault coverage or absence of shared bugs.

## 5. Validation and limitations

At the original experiment revision, the standalone executable suite passed
**51/51 tests**: one fixture/source/oracle
integrity test, 23 scenario comparisons, three supplemental groups and 24 mutant
detection tests. Source anchors passed **10/10**. The full `node --test` run
passed **78/78**, comprising these 51 and the existing 27 documentation-validator
tests. Documentation/reference validation separately passed **146 Markdown
documents**. Diff and text hygiene checks passed. With the source-reader
correction, the suite contains those same 51 tests plus two focused integrity
regressions: **53 experimental tests / 80 complete repository tests**. These
extra checks do not increase the 23 scenario cases or 24 semantic mutants.

The unchanged GitHub Documentation Integrity workflow runs documentation
validation and the existing **27 documentation-validator tests only**. Its
exact-head success is repository integration evidence, **not remote execution
of this 51-test comparison**. The comparison results reported above are local
executions against the fingerprinted code and inputs.

Limitations remain material:

- This is one bounded, same-author, two-language experiment, not independent
  engineering-team replication or full conformance with the Draft contract.
- The finite scenario contracts are still test-only. A reusable lifecycle
  Event-type profile and portable Policy-reference contract remain unspecified.
- No real protected concurrency, source authentication, immutable authority
  distribution, external settlement truth, or Receipt construction is tested.
- The scenario's supplied membership and selection are not inferred from
  delivery or proven by the harness. An offline material catalog is not a
  registry or cryptographic proof of its own authority.
- The seven implemented lifecycle transitions cover only these fixtures, not
  the entire VE-003 state machine. General mixed unsupported/invalid histories,
  all event-type domains and every §21 pressure remain outside this result.
- This is not a parser conformance test. JSON fixture objects do not preserve
  duplicate map members; arbitrary malformed input syntax, duplicate-member
  decoding, canonical Event bytes and generalized Policy identity are untested.
- Decimal/hex wrappers, catalog keys, result flags and process messages are
  implementation-local plumbing, not a proposed portable Event representation.

Under [Governance §§16–20](../SPECIFICATION_GOVERNANCE.md), implementation
evidence does not amend normative authority. No new rule, primitive, RFC or ADR
is introduced or required for this experimental report. Approved VE-002 and all
Draft specifications remain unchanged. This experiment narrows the outstanding
evidence limitation for the 23 cases; it does not erase the merged Gap Analysis
or resolve every dependency it records. Event representation readiness is not
certified, and no representation or new normative artifact is begun here.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-09-22 | Preserve original experiment provenance; resolve all ten source pins at their recorded immutable base, assert unchanged fixture provenance, document clean-checkout requirements and add byte-tampering/missing-history regressions. |
| 0.1 | 2026-09-22 | Record bounded Python/Node execution, immutable source/fixture fingerprints, separate source oracle, per-case results, deliberate-fault detection and evidence limitations. |
