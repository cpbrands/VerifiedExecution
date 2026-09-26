---
id: BOUNDED-EVENT-REPRESENTATION-EXPERIMENT
title: Bounded Lifecycle Event Representation Experiment
version: "0.1"
status: Draft
document_type: Experimental Comparison Report
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-26
updated: 2026-09-26
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

The clean-checkout results in §8 establish bounded representation agreement
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

## 8. Validation record

The complete suite passed **503/503**, with zero skipped, cancelled or failed
tests: the pre-existing 302 tests plus the following 201 new tests.

| New test category | Count | Result |
|---|---:|---|
| Positive vectors | 64 | Both cross-decoding directions, exact semantics, identical canonical bytes and re-encoding; 18 hand-derived byte anchors |
| Encoded negative vectors | 67 | 41 literal and 26 package-patch inputs; exact classifications from both decoders |
| Named mutations | 43 | 42 distinct codec mutations across 21 families, plus one comparison-normalization mutation; 22 families overall |
| Valid Text substitution binding | 1 | Both directions and both decoders; successful decoding, exact intended-Text mismatch |
| Runner/fixture controls | 20 | Five manifest, eight process/output, two fixture/semantic and five injected comparison-failure groups |
| Provenance regressions | 2 | Exact historical body/blob/pin enforcement and missing-history/no-HEAD-fallback |
| Additional boundary/invariance checks | 4 | Opaque owner-set boundary, unknown owner, history delivery invariance and establishment normalization versus decoder rejection |

Of the 67 negative vectors, 62 are representation/domain/binding/provenance
rejections, four are unsupported selections/material/constructor cases and one
is processing incomplete. These distinct classes are not pooled as semantic
invalidity. Negative tests run each input against both decoders; the reported
test count does not count each subprocess as another vector. The mutations use
deliberately shared witnesses across languages; this is disclosed rather than
inflating the number of independent semantic branches.

Validation used a fresh, non-shallow, non-hardlinked full-history clone,
Node 24.19.0 and Python 3.9.6. All six external materials were acquired afresh and their exact
fingerprints verified. The tree was clean before and after the run, aside from
ignored verified source caches. Only this report's result record was completed
after that run; executable code, vectors, controls and pins were unchanged.

The tested 18-file inventory (all tracked files in this experiment except
REPORT.md) has diagnostic SHA-256
`ca657000b7a290791d3aeebd3e404f1fa9490d59c23b3e19dfa18e52c9c5f86a`.
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
