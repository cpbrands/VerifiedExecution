---
id: BOUNDED-EVENT-REPRESENTATION-EXPERIMENT
title: Bounded Lifecycle Event Representation Experiment
version: "0.1"
status: Draft
document_type: Experimental Comparison Report
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-26
updated: 2026-09-28
depends_on:
  - BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE
  - BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
related_documents:
  - ADR-ENC-001
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Bounded Lifecycle Event Representation Experiment

## 1. Scope and evidence status

This is a non-normative, same-author experiment, not independent-team
replication, general Event conformance, Draft approval or a permanent profile
allocation. Its only representation selector is the pinned Draft's
`0.1-draft.1`; semantic type revision remains `0.2-draft.1`.

The two codecs independently implement the proposed scalar/collection and
closed-record mappings, seven Event forms, pinned Lynx Action owner checks,
material provenance and companion-input carriage. Positive tests require both
cross-decoding directions, exact recovered values, independently produced equal
canonical bytes and equal re-encoding. Hand-derived anchors additionally check
against correlated implementation errors. Negative tests assert exact failure
classes, not mere disagreement.

The historical clean-checkout results in §8 establish bounded representation agreement
for the recorded vectors, not completion of every future conformance claim.

### Scope of a successful result

`ok` means success at the requested representation operation, **not** that an
Event was authoritatively admitted. Event-only packages have no fresh-admission
verdict. Companion snapshots carry exact independently supplied assertions,
including failed/unavailable/verified labels; neither a label, copied grant,
Action digest nor material attachment authenticates itself. This experiment
does not implement operational establishment, raw-source authentication, Policy
re-execution, a clock or a new Lifecycle projection engine. It does not reuse
RS-EVENT-002's evaluator, fixtures or oracle as an encoding authority.

Known Action digest, record/domain, source-role and exact payload-copy checks
are performed. These checks are not a claim to discharge all of P's admission
rules or every future representation-profile conformance requirement. Foreign
interpretation and arbitrary owner-defined semantic equality remain outside
scope. Owned values are checked for selected immutable definitions and retained
as exact owner bytes; their bytes do not establish a proof or semantic identity.
An opaque owned value inside a semantic set is unsupported until its owner
supplies the equality/canonical mapping; byte equality is not substituted.

## 2. Immutable provenance and reproduction prerequisites

The representation source is resolved from commit
`bc080e6037bdd3129d5132d90d9253ed85f59c1b`, path
`specifications/BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE.md`, Git blob
`6893d9caaf10a91b7d5c4ea5c5a7cf1022bbbc73`, SHA-256
`8217fe6e6890dba182ebc8dcc2d4f9deeed824b71b3fddcfc31b0cf7458ce56e`.
The runner separately fixes this exact binding; a fixture cannot retarget it.

The semantic source is commit
`162de90510e7d64f6970d7ff0e9df6ee2dbd4d17`, path
`specifications/BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE.md`, Git blob
`a8a88e94be403be9ffc0efd01986a5db9446757e`, SHA-256
`dfd184858a0a925c8da37c67a2ddd6c69e89f7ed064446779ed2122950e98c2b`.
Its repository imports resolve at
`56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f` as required by the representation
publication. `sources.json` records all 16 repository commit/path/blob/SHA-256
bindings, including the recursive declared imports and OccurrenceId ownership.
Related/informative links are not promoted to normative dependencies.

`owners.json` records six external byte editions: RFC 8949, RFC 3629, Lynx
UG2026, UnicodeData 6.2, UAX44 revision 10 and XML 1.0 Fifth Edition. The first
two EditionKeys are prescribed by the Draft; the other edition labels and
fingerprints are this experiment's independently selected exact editions of
the Action owner's named sources. They are not globally allocated identities.
Each codec independently interprets the pinned UnicodeData repertoire. It does
not replace the owner's assigned-character domain with the host Unicode version.

Before an evaluation, the runner reads immutable Git objects using exact
commit/path, checks file SHA-256 and Git blob framing, and verifies every cached
external body. Missing history, mismatched keys/body bytes or unavailable
external material fail closed. There is no working-tree, HEAD, latest-edition
or network-on-decode fallback. Both codecs then independently check carried
keys/body hashes and exact closure against that verified governing context.

Package material is the 16-repository/six-external closure. The Action-specific
closure contains VE-001, its canonical profile, the Lynx schema, ADR-ENC-001 and
the six external editions. Material carriage is not cryptographic authority.

Use Node 20 or later and Python 3.9 or later, with Git and **full history**.
Network access is needed only for explicit acquisition if the external cache
is absent; an offline copy of the exact verified cache is sufficient.

```sh
git clone https://github.com/cpbrands/VerifiedExecution.git
cd VerifiedExecution
git checkout <exact-experiment-commit>
node experiments/bounded-event-representation/source-loader.mjs --hydrate
PYTHON=python3 node --test --test-concurrency=1
node scripts/validate-documentation.mjs
git diff --check
```

Serial test-file scheduling avoids competing full-material subprocess copies;
it does not filter cases or skip assertions. The ignored `.cache/<sha256>`
directory contains source bytes, not generated
expected results. Hydration verifies bytes before writing; all uses reverify.
An unavailable download does not permit substituting another edition. For just
the new experiment, run `PYTHON=python3 node --test
experiments/bounded-event-representation/compare.test.mjs`. The comparison CLI
`compare.mjs` runs positive cross-codec cases only, not the full negative/control
suite. Neither command changes existing fixtures, pins, specifications or stashes.

## 3. Independence, fixture syntax and anchors

Implementation A (JavaScript) uses typed compositional codecs over a strict
CBOR tree. Implementation B (Python) uses an explicit-stack byte parser/writer
and separately transcribed dispatch/field definitions. They share no codec
module, field-table generation, UTF-8/integer/rational mapping, ordering or
extension implementation. Neither reads oracle outcomes. Shared plumbing is
limited to verified source acquisition, semantic fixture expansion, subprocess
transport and result comparison. Both were authored in this task; correlated
interpretation errors remain possible.

Fixture JSON is **local process syntax**, not a new VE wire format. Exact
integers use decimal Text tagged `$integer`; octets use lowercase even-length
hex tagged `$bytes`. Lists, records, variants and presence values are typed by
their fixture entry. `$ref` expands only checked local definitions. The other
documented macros in `compare.mjs` insert verified material, a verified owner
key/descriptor, explicit repetition/concatenation or an exact power of two.
They do not add source authority. All expanded values reach each codec
independently; no encoded bytes from one codec are supplied to the other's
encoder as expectations.

Anchors in the vector files were assembled from the profile's item headers,
fixed chunk partition, magnitude bytes and explicit encoded-key ordering,
without calling either codec. They include the two distinct acute-accent Text
values, integer signs and out-of-native-range values, complete Type and actual
SourceKey maps, zero-fraction Endpoint, and octet boundaries. The owner P1
Action field/descriptor/digest anchors come from the pinned Lynx schema. Account
and amount variants replace one exact fragment in the owner's recorded field
bytes and independently hash its prescribed content frame; they are not taken
from a codec's output.

Negative package vectors are explicit structural patches of a baseline that
must first pass both encoders. Their patch driver uses A's public CBOR tree
utility solely to construct test input. B does not import it. This test-input
generation correlation is disclosed; independent literal malformed-byte vectors
and hand anchors do not use that driver.

## 4. Text: three different questions

1. **Encoding validity:** `T(U+0065 U+0301)` is `4365cc81` and `T(U+00E9)` is
   `42c3a9`. Both are valid and canonical, different byte sequences. Both
   decoders recover the exact respective scalar sequences, including all tested
   NUL, BOM, supplementary and cross-chunk scalars. No normalization occurs.
2. **Semantic equality:** substituting either valid encoded value for the other
   still decodes successfully. Comparison with the independently supplied
   original Text must fail `semantic-mismatch/text-codepoints`. A decoder cannot
   infer unbound sender intent. Encoder-normalization, decoder-normalization
   and normalization-equivalent-comparison mutants exercise these distinct faults.
3. **Authoritative binding:** the native Action owner's digest protects its
   actual content. Changing a valid NFC Action account Text without changing
   its established digest fails `binding/action-digest`. Event explanation Text
   does not acquire an invented Event digest. The Action owner already requires
   NFC, so decomposed Action account Text is not silently admitted by T's wider
   domain. No generic hash in this experiment is asserted to confer authority.

Malformed Text vectors cover invalid/overlong UTF-8, surrogates, out-of-range
scalars, truncation and malformed chunks. A non-NFC native CBOR text shortcut
is distinct from the valid non-NFC scalar sequence carried inside T's bstr.
It fails the existing native carrier discipline, not an invented restriction
on semantic Text.

## 5. Coverage and failure meanings

The machine-readable vectors contain complete packages for all seven kinds,
full Lynx Action values and content/occurrence bindings, contexts, assessment
variants, inline synthetic explanations and exact companion/history snapshots.
Other component vectors isolate opaque extensions, minimum/maximum sequence,
Action amount/account boundaries, all establishment statuses, commit outcomes,
unknown time, proper/point intervals, exact thirds, large coprime fractions,
unbounded-domain integer/year witnesses and 4096-octet partition boundaries.
Known imported/local history has the same representation: origin is not a
new field. Delivery permutation produces identical authoritative sequence bytes.

Negative classes distinguish syntax/canonicality, actual field-domain violations,
known binding/provenance failure, unsupported owner interpretation and processing
incomplete. A configured 64 MiB byte/item-size ceiling, one-million-node ceiling
and 2048 parser-depth ceiling are implementation resource limits, not semantic
maxima; host recursion exhaustion is also processing incomplete. No successful
truncated result or semantic-invalid conclusion follows from exhaustion.

Absent establishment entries are made explicitly unavailable **before encoding**;
received missing entries fail, rather than being repaired by the decoder.
Unknown noncritical intrinsic extensions retain their exact values. Unknown
constructor structure or required unknown ownership does not become a verified
extension through a spelling convention or sender-supplied flag.

These are bounded witnesses, not exhaustive domain enumeration. Structural
reasoning follows the Draft's O/T/Z/L injectivity argument: exact UTF-8 scalar
recovery, fixed octet partition, unique sign/minimal magnitude, exact rational
cross-products, ordered lists and owner-defined set equality. Finite testing
cannot prove general conformance, eliminate implementation resource limits or
establish all external owners' equality and canonicalization rules.

## 6. Fault detection and runner integrity

Named source mutations exercise signed magnitude, uint64, rational reduction
and deliberate fractional precision loss,
list/chunk structure, ordering/duplicates, field presence, type/role binding,
selectors, publication/material provenance, owner availability, extensions,
Action digest binding, integer truncation and canonical output. The same
semantic family is mutated separately in both languages. The comparison-layer
normalization mutant is separate from both codecs. Each test asserts the
specific witness result: wrongly accepted bytes, a particular Text collision,
integer semantic mismatch or peer rejection for canonical map order. A process
crash or unrelated error does not count as detection of the intended fault.

The closed case manifest rejects missing/duplicate/extra/reordered/skipped cases.
Process failure, timeout, malformed/missing/extra output, unknown/cyclic fixture
references and semantic disagreements fail the runner. A provenance regression
creates an empty-history temporary repository with the exact expected working
file and confirms it still fails; another alters one pinned byte and separately
checks Git blob/pin mismatch. Assertions are not skipped on missing dependencies.

## 7. Maturity and exclusions

Neither Draft is promoted. This adds no permanent selector, Event digest,
generic proof/authentication mechanism, foreign-owner semantics, clock service,
kernel primitive or governance amendment. Prior experiments' counts are not
reused as evidence for these bytes. Same-author cross-language agreement is not
independent-team interoperability. Real-world source establishment, trust,
confidentiality/retention policy and operational input production remain with
their existing owners. A full admission/projection integration and independent
review remain separate from successful byte recovery.

## 8. Historical PR #100 validation record

This section records the merged experiment, before the transport-only correction
in §9. Its successful run does not erase the subsequent timeout incidents.

The complete suite passed **505/505**, with zero skipped, cancelled or failed
tests: the pre-existing 302 tests plus the following 203 new tests.

| New test category | Count | Result |
|---|---:|---|
| Positive vectors | 64 | Both cross-decoding directions, exact semantics, identical canonical bytes and re-encoding; 18 hand-derived byte anchors |
| Encoded negative vectors | 67 | 41 literal and 26 package-patch inputs; exact classifications from both decoders |
| Named mutations | 43 | 42 distinct codec mutations across 21 families, plus one comparison-normalization mutation; 22 families overall |
| Valid Text substitution binding | 1 | Both directions and both decoders; successful decoding, exact intended-Text mismatch |
| Runner/fixture controls | 20 | Five manifest, eight process/output, two fixture/semantic and five injected comparison-failure groups |
| Provenance regressions | 2 | Exact historical body/blob/pin enforcement and missing-history/no-HEAD-fallback |
| Focused correction regressions | 2 | Process-limit-independent arbitrary-integer parsing/rendering and a valid Context whose sole defect is the extra `"x"` member |
| Additional boundary/invariance checks | 4 | Opaque owner-set boundary, unknown owner, history delivery invariance and establishment normalization versus decoder rejection |

Of the 67 negative vectors, 62 are representation/domain/binding/provenance
rejections, four are unsupported selections/material/constructor cases and one
is processing incomplete. These distinct classes are not pooled as semantic
invalidity. Negative tests run each input against both decoders; the reported
test count does not count each subprocess as another vector. The mutations use
deliberately shared witnesses across languages; this is disclosed rather than
inflating the number of independent semantic branches.

Validation used a fresh, non-shallow, non-hardlinked full-history clone,
Node 24.19.0, Python 3.9.6 and Python 3.12.14 with its default 4,300-digit
conversion limit enabled. The focused large-integer regression demonstrates
that the former direct decimal conversions fail in that modern runtime, while
the corrected codec parses and renders the committed 9,865-digit negative
integer, cross-decodes A's 4,104-byte encoding and re-encodes identical bytes
without changing process-global configuration. The corrected Context negative
vector decodes successfully after removing only `"x"` and rejects after adding
only `"x": 0`. All six external materials were acquired afresh and their exact
fingerprints verified. The tree was clean before and after the run, aside from
ignored verified source caches. This focused correction changes only codec B's
decimal conversion, its direct regressions/mutation plumbing, the isolated
Context negative vector and this report. Other executable evidence, artifacts,
controls and every historical pin remain unchanged.

The tested 18-file inventory (all tracked files in this experiment except
REPORT.md) has diagnostic SHA-256
`52d2278706c1d6699de2a5d22556b15f26178fac76cdf025964cdf8ec2b51c76`.
To reproduce it, sort repository-relative paths in ascending ASCII order,
form `[path, lowercase SHA-256 of exact file bytes]` for each, serialize the
array with `JSON.stringify` (no whitespace or trailing newline), then SHA-256
its UTF-8 bytes. This is a test-inventory diagnostic, not a VE content identity
or profile allocation. It permits checking the published execution inputs
without depending on an unpublished pre-result report commit.

Documentation validation passed for **152 Markdown documents**. Base-to-head
diff checks and UTF-8/text-hygiene checks passed for the 19 new files: no leading
BOM, CR, literal NUL, replacement character or bidirectional-control characters.
The embedded semantic BOM/NUL/control fixtures remain intentional and exact.
No pre-existing file was changed. Both pre-existing stashes remained unchanged
and unapplied.

During development, a Python subprocess once hit the unchanged 120-second
timeout; the runner failed rather than skipping it. Its focused reproduction
and the complete clean run passed without weakening the timeout or assertion.
The resolved Text clarification is reflected in §4; no additional profile
ambiguity was resolved by inventing semantics. The coverage/ownership limits
in §§1 and 7 remain explicit, including the absence of fresh admission evidence.

Existing GitHub Actions run documentation validation and documentation-validator
tests only; they do not execute this cross-language experiment or the complete
repository suite. Their eventual success is not substituted for the local
clean-checkout evidence above.

## 9. Shared subprocess transport reliability correction

### Incident evidence retained

The correction starts at merged main
`20728c56f1f8c6fae98b99c7ae9077662c62e334`; the retained PR #100 head is
`5651349db972ade1a89a196cab94c013aad4b6e7`. All 19 merged blobs had been
verified identical. Pre-merge verification passed uninterrupted, 505/505;
post-merge experiment verification passed uninterrupted, 203/203. The
post-merge complete suite nevertheless returned **504/505** when Python 3.12's
`native-negative-sequence` invocation reached the unchanged 120-second limit.
An earlier audit also timed out in `establishment-failed`; its isolated
execution passed in 349 ms. Those failures remain part of the evidence.

The subsequent read-only investigation observed three further ETIMEDOUTs:
two subprocesses (Python and Node) during a 827.965-second loaded run, and a
Python subprocess during a 265.737-second serialized complete-suite run.
Its initial diagnostic collector did not preserve sufficient test counters or
case names to reconstruct those entire runs; they are not claimed as passing
suites. Two sampled Python stalls were in `json.load(sys.stdin)`/read while
the parent waited in synchronous process transport, with empty observed pipe
queues and negligible CPU. This localizes the observed wait before codec
evaluation, but does not distinguish every possible input-delivery/EOF cause.
Timed-out sampled children were terminated and reaped. Host sleep affected the
loaded run's timing, but one observed stall preceded sleep and the serialized
stall occurred while awake. Scheduling contention is therefore not established
as the sole cause. Neither a Python-version-exclusive defect nor a particular
Node/libuv/macOS defect was proved.

Rapid isolated passes, other uninterrupted experiment passes and a later
505/505 diagnostic pass do not invalidate these failures. No semantic, codec,
fixture or canonical-byte defect was demonstrated. This change avoids the
stdin-pipe transport path on which stalls were observed; it does not claim to
identify or repair a proven upstream runtime defect.

### Transport, cleanup and diagnostics

Only `compare.mjs`, its tests and this report change. The identical
`JSON.stringify({authority,request})` request is converted to UTF-8 and written
completely to a uniquely created temporary directory (0700 on POSIX), with an
exclusive/no-follow file open (0600). Positional writes leave the descriptor
at offset zero; the same descriptor is inherited as child stdin, without a
path reopen or a stdin pipe. The child reads ordinary-file EOF. No shell or
request-bearing command argument is introduced. Programs, arguments, codec
logic, JSON output interpretation, semantic assertions, the 256 MiB output
buffer cap and the **120,000 ms timeout** remain unchanged. No retries,
timeout increases, suppression or semantic transformations are added.

A nested `finally` closes the descriptor and removes the private directory
and request after success, decoder rejection, process failure, spawn failure,
thrown launch error and timeout. Cleanup errors fail the invocation rather
than being hidden. The optional launch/root parameters are test seams, not
fixture-selected configuration. Output pipes remain managed by `spawnSync`;
raw output buffers permit exact byte counts before the existing UTF-8/JSON
interpretation. Failed invocation/output checks expose only codec, executable,
PID, status, signal, error code, elapsed milliseconds and input/stdout/stderr
byte counts where available. They do not print requests, authority material,
child output or exception messages containing such material.

The cost is private local temporary storage and file I/O per invocation,
including roughly 11 MB of repeated governing material for ordinary requests.
Normal completion leaves no request file. This is unlinking, not a forensic
secure-erasure guarantee, nor crash recovery after power loss or forced parent
termination. Permissions and behavior were exercised on macOS arm64; the
supported Node/Python runtime range is unchanged, but these runs do not prove
all-platform behavior or indefinite freedom from intermittent failures.

### Added controls and exact accounting

Eight transport test groups add to, rather than replace, all 203 existing
experiment tests:

1. Node and Python consume the full approximately 11 MB request, independently
   report its exact byte count/SHA-256 and observe ordinary-file EOF.
2. Deliberately truncating delivery by one byte causes the exact-input assertion
   to fail even though the probe successfully exits and observes EOF.
3. Both output pipes drain 3,145,728 bytes each, with exact diagnostic counts.
4. Both actual codec paths verify regular-file stdin; unchanged valid encoding
   and decoder rejection exercise cleanup.
5. Nonzero exit cleans up and reports metadata without echoed private material.
6. A thrown launch error cleans up and redacts its private exception message.
7. Missing executable and malformed output clean up and retain safe diagnostics.
8. The control first observes and asserts the unchanged production timeout of
   120,000 ms, then the launch test seam injects a 500 ms test-only deadline.
   A child that remains alive beyond that short deadline receives SIGTERM,
   returns ETIMEDOUT and is reaped; its input file and descriptor are removed.

The controls assert absent temporary entries, closed descriptors (EBADF) and
absent child PIDs (ESRCH), as applicable. The deliberate short timeout is an
expected passing control, not an unexpected suite timeout. The test-only
override is applied only after the production value has been asserted; it does
not configure or weaken production behavior. Production remains fixed at
120,000 ms with no retry, increase or decrease. These groups are not new
semantic vectors or semantic mutants. Counts are
**211 experiment tests** and **513 complete tests** (302 + 203 + 8). The 64
positives, 67 negatives, 43 mutations, binding/runner/provenance tests and
18 hand-derived anchors remain unchanged. The anchors do not cover every
complex encoding family.

### Historical bounded correction-validation record

All attempts below used the same corrected executable bytes in a full-history
checkout, Node 24.19.0 / libuv 1.52.1 on macOS arm64. Python 3.12.14 retained
its default 4,300-digit conversion limit; Python 3.9.6 was `/usr/bin/python3`.
The table records wall durations, rounded to milliseconds. No failed attempt
was discarded or retried. During the matrix, a temporary idle-sleep assertion
kept the host awake without changing saved power settings or test deadlines.

| Run | Python | File scheduling | Passed/total | Seconds |
|---|---|---|---:|---:|
| Focused transport controls, excluding the then-real timeout | 3.12.14 | Default | 7/7 | 0.829 |
| Experiment 1 | 3.12.14 | Default | 211/211 | 242.354 |
| Experiment 2 | 3.12.14 | Default | 211/211 | 237.847 |
| Experiment 3 | 3.12.14 | Serial | 211/211 | 242.048 |
| Experiment 4 | 3.12.14 | Serial | 211/211 | 237.971 |
| Experiment 5 | 3.9.6 | Default | 211/211 | 250.742 |
| Experiment 6 | 3.9.6 | Serial | 211/211 | 250.449 |
| Complete 1 | 3.12.14 | Default | 513/513 | 242.388 |
| Complete 2 | 3.12.14 | Serial | 513/513 | 264.699 |
| Complete 3 | 3.9.6 | Serial | 513/513 | 279.887 |

For every row, failed, skipped and cancelled counts were zero. The nine matrix
runs had no unexpected timeout, remaining sampled child or temporary-input
residue. Process-tree sampling was once per second; it supplements the focused
descriptor/PID cleanup assertions rather than proving observation of every
short-lived process. Default Node file concurrency was nine on this ten-way
host; there is one experiment test file and four complete-suite test files.
Serial scheduling is `--test-concurrency=1`, not case filtering. Only the
separate seven-test focused command excluded the then-real timeout; all nine
historical matrix runs included it and every original assertion. Those runs
remain evidence for the original production-duration control. The current
control preserves the same timeout, termination, reaping and cleanup assertions
using the short test-only override described above.

Historical exact command forms (with `PYTHON` set to the stated interpreter)
were:

```sh
node --test --test-reporter=tap --test-name-pattern='^representation transport (?!real unchanged timeout)' experiments/bounded-event-representation/compare.test.mjs
node --test --test-reporter=tap experiments/bounded-event-representation/compare.test.mjs
node --test --test-reporter=tap --test-concurrency=1 experiments/bounded-event-representation/compare.test.mjs
node --test --test-reporter=tap
node --test --test-reporter=tap --test-concurrency=1
```

The review-requested test-duration correction was then validated once with
Python 3.12.14 and Node 24.19.0. All eight focused transport controls passed in
1.680 seconds of Node test duration (1.84 seconds wall); the injected timeout
control completed in 506.7 ms. The complete experiment passed 211/211 in
125.236 seconds of Node test duration (125.26 seconds wall). The complete
repository suite passed 513/513 in 125.924 seconds of Node test duration
(125.96 seconds wall), with zero failures, skips, cancellations or timeouts.
No nine-run matrix was repeated. These results confirm the efficient test seam;
they do not replace or weaken the production 120,000 ms invariant.

All 16 historical repository pins and six external fingerprints reverify.
The existing selector binding, tampering rejection and missing-history/no-HEAD-
fallback controls pass in the suites. Codecs, vectors, historical pins,
selectors, source loader, prior experiments, profiles, specifications and
workflows remain byte-identical to the merge base. Using §8's diagnostic
algorithm, which covers every tracked file under
`experiments/bounded-event-representation/` except `REPORT.md`, the inventory
history is:

- PR #101 head `973c2a90df2005f908cabcc29642ae0613bc8ea6`:
  `e3d49d9008fc5f7151427fe8f6919e42962a4e8bf0f335ebdd7f5fc354ac283e`;
- audited pre-metadata-correction head
  `6d0c6260cec60fd7ec2d3cdd831d5946af3f6a08`:
  `6103f472047d5edda61c63a80d33557280ad603a41109e0c9d35dc44544d3293`.

This metadata-only report correction changes no covered file, so its resulting
18-file inventory remains
`6103f472047d5edda61c63a80d33557280ad603a41109e0c9d35dc44544d3293`.
Section 8's different inventory remains the historical PR #100 record.

Documentation validation passed for 152 Markdown documents. The three-file
diff passed `git diff --check` and strict UTF-8, LF, trailing-whitespace and
single-final-newline checks, with no BOM, literal NUL, replacement character or
bidirectional-control characters. Actions still run only documentation validation and documentation-validator
tests, not the complete suite above. Both stashes remain unapplied and the
retained PR #100 branch is unchanged. These reliability checks do not establish
general representation conformance, independent-team replication,
authentication, fresh Lifecycle admission/projection evidence, portable
readiness or approval of either Draft.
