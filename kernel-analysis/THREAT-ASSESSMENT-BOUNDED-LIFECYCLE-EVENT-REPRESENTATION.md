---
id: THREAT-ASSESSMENT-BOUNDED-LIFECYCLE-EVENT-REPRESENTATION
title: Bounded Lifecycle Event Representation Security and Threat Assessment
version: "0.1"
status: Draft
document_type: Threat Assessment
category: Non-normative Analysis
author: Verified Execution Editorial Board
created: 2026-09-29
updated: 2026-09-29
depends_on:
  - GAP-ANALYSIS-BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-READINESS
  - BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE
  - BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
  - BOUNDED-EVENT-REPRESENTATION-EXPERIMENT
related_documents:
  - RS-EVENT-002
  - RS-EVENT-002-EXECUTABLE-COMPARISON
  - EVENT-SEMANTIC-FIELD-CONTRACT
  - ADR-ENC-001
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-006
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Bounded Lifecycle Event Representation Security and Threat Assessment

## 1. Status, decision and evidence boundary

**Draft v0.1; non-normative, same-author source assessment, not an independent
security certification.** This is the artifact selected by the merged
[readiness analysis](GAP-ANALYSIS-BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-READINESS.md).
Its author is the repository editorial/representation workstream. Independent
security review and owner risk acceptance have not occurred in this document;
the named owners below are responsible roles, not fabricated approvals.

The fetched main and branch base are exactly
`c2d7d01fcae2a1a787447e7e816208072981af48`; no advancement was present.
The scope is the pinned representation Draft v0.1, semantic Draft v0.2,
bounded Lynx UG2026 Action domain and exactly seven Lifecycle Event kinds:
ACTION_CREATED, VALIDATION_STARTED, VALIDATION_SUCCEEDED,
AUTHORIZATION_GRANTED, EXECUTION_STARTED, EXECUTION_COMPLETED,
EXECUTION_FAILED. No other owner or transition becomes supported here.

**Conclusion:** explicit canonicality, exact-value and immutable-source controls
have bounded same-author support. Abstract-profile approval remains gated on the
representation mapping, canonicality, full-domain preservation, failure-contract
clarity, immutable owner/dependency availability, security analysis of the
abstract representation and independent-implementability evidence. The strongest
outstanding author-controlled implementation-assurance risks are end-to-end
resource containment and hostile-input/failure-path evidence. Environment and
interpreter trust, temporary storage, crash residue, operational confidentiality,
logging, retention, backups and recovery are separate deployment gates requiring
their owners. Abstract-profile approval is not recommended on the current record,
but T06/T11/T12 or an unanswered operational-owner request block that approval
only if it demonstrates a general defect in the mapping, failure contract, domain
preservation, canonicality, dependency completeness or independent implementability.
No demonstrated conflict with Approved semantics, necessary new primitive or
duplicated execution authority is found. No RFC/ADR is required for this analysis.

This assessment inspects text, source, committed vectors and historical results.
It runs no codecs, attacks, resource probes or experiment tests. An inspected
control is not a newly reproduced result; an open attack hypothesis is not a
confirmed exploitable defect. The file-backed subprocess transport is an
**experiment-specific implementation**, never a normative Event requirement.

## 2. Pinned evidence and trace conventions

All table paths resolve at the exact base above; links are navigation, not
instructions to select mutable HEAD. Fingerprints are of exact file bytes.

| Evidence | Git blob | SHA-256 |
|---|---|---|
| [Readiness analysis](GAP-ANALYSIS-BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-READINESS.md) | `02daa0256f785927851550b1486ebec0ee825fe4` | `117e8ed2c27dac94c69b6238bbfcea956ed4a65e966c7608f4bb1825344298f2` |
| [Representation profile](../specifications/BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE.md), R below | `6893d9caaf10a91b7d5c4ea5c5a7cf1022bbbc73` | `8217fe6e6890dba182ebc8dcc2d4f9deeed824b71b3fddcfc31b0cf7458ce56e` |
| [Semantic profile](../specifications/BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE.md), P below | `a8a88e94be403be9ffc0efd01986a5db9446757e` | `dfd184858a0a925c8da37c67a2ddd6c69e89f7ed064446779ed2122950e98c2b` |
| [RS-EVENT-002](../reference-scenarios/RS-EVENT-002-BOUNDED-LIFECYCLE-PROFILE-V02.md), Draft v0.3 | `860c6430f7127ca89ed03f3f8b8963789a0b236e` | `efb03a4ff5d4e105b0bac5be99a23f6e23ef777368ac0ee95d6239004e98ee20` |
| [Semantic experiment report](../experiments/rs-event-002/REPORT.md) | `126faa91264362bc7291eabe0c602eafc269ddcb` | `b019c89a550750835a016f22b4e7a120ede0c77ff1e80d5cb203a6f543b369e3` |
| [Representation experiment report](../experiments/bounded-event-representation/REPORT.md), E below | `5bb7959ad8ecf059e3ca5a639ee9cf63a60049de` | `56205ebe87f64d92260d463b540662dcb590d71154cf7f8dde1e19c2ab6df0f7` |
| [Transport and comparator](../experiments/bounded-event-representation/compare.mjs) | `69ef99fc309d8b4d68132cbcf3c80f2ce40548be` | `6f4b3e6d96bef168b1ec0b622fcb112d226d01857ed5f887e07d150e4f5ecc2e` |

Representation inventory: **18 tracked files**, all paths under
`experiments/bounded-event-representation/` excluding `REPORT.md`:
`6103f472047d5edda61c63a80d33557280ad603a41109e0c9d35dc44544d3293`.
Semantic inventory: **all seven tracked files**, including its report, under
`experiments/rs-event-002/`:
`3fee8a404febf7ea03afd80a5226b7692f77039c386077c537b436234cfc5d32`.
For each inventory, sort repository-relative paths in ASCII order, form an
array of `[path, lowercase SHA-256(exact bytes)]`, serialize by `JSON.stringify`
without added whitespace/newline, then SHA-256 the UTF-8 bytes. These are
diagnostic inventories, not Event identities. Untracked owner caches are excluded.

The [source manifest](../experiments/bounded-event-representation/sources.json)
pins 16 repository commit/path/blob/SHA-256 records: R's first publication at
`bc080e6037bdd3129d5132d90d9253ed85f59c1b`, P at
`162de90510e7d64f6970d7ff0e9df6ee2dbd4d17`, and governing imports at
`56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f`. Those imports include the Event
contract, VE-001/002/003/004/005/006, Action owners, OccurrenceId and governance.
The [owner manifest](../experiments/bounded-event-representation/owners.json)
pins six external editions: RFC 8949, RFC 3629, Lynx UG2026, UnicodeData 6.2,
UAX44 revision 10 and XML 1.0 Fifth Edition. Exact retained bodies were rehashed;
this does not establish publisher authenticity or redistribution rights.
The semantic fixture manifest's 55 historical pins were also reverified.

Code traces below refer to this inventory, chiefly:

- [A](../experiments/bounded-event-representation/codec-a.mjs): `parse`,
  `text`, `integer`, `record`, `set`, `checkMaterials`, `validate`.
- [B](../experiments/bounded-event-representation/codec-b.py): `load`,
  `convert`, decimal conversion helpers, `material_check`, `inspect_value`.
- [Loader](../experiments/bounded-event-representation/source-loader.mjs):
  `profileBinding`, `historical`, `verify`, `catalog`, `hydrate`.
- [Process A](../experiments/bounded-event-representation/process-a.mjs) and
  [Process B](../experiments/bounded-event-representation/process-b.py), and
  [tests](../experiments/bounded-event-representation/compare.test.mjs).
- [Literal negatives](../experiments/bounded-event-representation/negative-vectors.json),
  [package patches](../experiments/bounded-event-representation/package-negative-vectors.json),
  [manifest](../experiments/bounded-event-representation/case-manifest.json) and
  [mutations](../experiments/bounded-event-representation/mutants.mjs).

### What prior execution establishes, and does not

E records 64 positives with both cross-decoding directions and independently
produced canonical bytes; 67 negatives (62 rejection, 4 unsupported, 1 processing
incomplete); 43 mutations (42 codec mutations plus one comparator mutation);
20 runner/fixture groups and other provenance/boundary controls. E's accounting
is 203 original experiment tests plus 8 transport groups = 211; 302 preceding
repository tests plus 211 = 513. The **18 hand-derived anchors do not cover
every complex family**. Shared fixture/authority/comparison plumbing and A-based
negative patch construction create correlation even though the two codecs are
differently structured and use different languages. Both are same-author.

The separate semantic experiment records 87/87: 19 accept, 55 reject,
6 unsupported, 6 unestablished, 1 unselected; 104 mutant tests / 52 families /
102 distinct mutations, 25 negative-control groups and one selector positive.
These supplied-established-input results are not new byte-to-admission evidence.

E retains pre-merge 505/505, post-merge experiment 203/203, the **504/505**
`native-negative-sequence` timeout, the earlier `establishment-failed` timeout
and further diagnostic stalls. Sampled stalls waited for stdin before codec
work. The file-backed correction avoids that observed pipe path; it does not
prove the underlying Node/libuv cause. Later passes do not erase failures.
The production timeout remains 120000 ms; the explicit test-only callback
observes that value before injecting 500 ms. Recorded short-control and
211/513 passes concern Node 24.19/macOS arm64, with Python 3.9.6/3.12.14 in
the transport evidence. They are not cross-platform or indefinite reliability.

## 3. Threat model and assessment method

### Assets and required properties

| Asset | Property being protected |
|---|---|
| Exact Event, Action, time and extension values | Lossless recovery; owner distinctions; no silent normalization, truncation or kind coercion |
| Canonical package and historical interpretation | Unique encoding under fixed closure; immutability; no repair-and-accept, retargeting or latest fallback |
| Authoritative Action/fact/context/history inputs | Exact binding and separation of carried assertions from independently established authority; no fresh-admission inference from decoding |
| Inline explanations and authority material | Confidentiality, interpretability, appropriate access/retention and recoverability; no false claim that redacted material is complete |
| Operator host, reviewer and recipient | Bounded operational resource use, safe presentation, no execution from data, explicit failure and cleanup behavior |
| Reproducible evidence | Retained sources, honest failure records, independent expected results, disclosed implementation/authorship limits |

### Boundaries, adversaries and assumptions

1. Untrusted package bytes cross into a parser; recovered values cross into
   owner-domain checks; only then can established-input semantic evaluation
   occur in its separate owner. No early diagnostic parse is acceptance.
2. Independently selected publication/owner material crosses into the codec as
   governing context. Package keys, bodies, locators or copied `verified` values
   cannot select or authenticate that context themselves.
3. Semantic Text crosses into a UI, terminal, log, search/index or downstream
   tool. Safe presentation is a separate boundary from exact semantic equality.
4. Experiment fixture expansion/JSON crosses parent memory, a private file,
   child stdin, child output and test diagnostics. This is not R's wire format.
5. External publication/cache/Git history, local executables/environment and
   filesystem administration are operational trust boundaries.

An input adversary may send arbitrary bytes, valid but extreme finite values,
duplicate/misordered fields, forged selectors/statuses, misleading Text and
unavailable/substituted owner material. An acquisition adversary may deny or
replace downloads; hashes constrain substitution only after expected pins are
independently trusted. A local attacker may have another account, the same
account, or privileged host access: those are different preconditions, not
all defeated by mode 0600. A malicious interpreter or edited trusted checkout
is outside the codec's security boundary, but executable selection/exposure is
assessed as an integration threat. No cryptographic break is assumed.

Bounded Draft experimentation assumes reviewed immutable sources/fixtures,
synthetic non-secret material, controlled local execution and no hostile
multi-tenant service exposure. These are conditions of this recommendation,
not facts about every user or a production risk acceptance. Full-history and
retained external bytes are required. Excluded: production authentication/key
management, clock service, Policy execution, fresh admission/projection,
foreign-owner semantic implementation, cryptographic proofs and forensic
laboratory recovery. Their boundaries and consequences are still assessed.

### Severity, likelihood, confidence and disposition

Severity is **conditional impact**, not a measured vulnerability score:
High = authority/integrity confusion, sensitive-material disclosure or sustained
process/host exhaustion; Medium = bounded interruption or misleading local
presentation; Low = limited nuisance without such loss. Likelihood is
**plausible** when an allowed attacker controls the entry point and source
shows an unbounded/unprotected step; **conditional** when an additional
operational failure/privilege is needed; **unmeasured** when inspection cannot
establish exploitability. No incidence percentages or CVSS score are invented.
Confidence labels: written rule, inspected implementation, prior bounded test,
or untested hypothesis. High impact with unmeasured likelihood remains open.

Dispositions used below: **controlled-bounded** (specified control and selected
tests, residual review remains); **Draft-only** (acceptable only under the
assumptions above); **evidence required**; **operational decision**; **governance
stop**. A threat may have several, since code, specification and deployment
obligations are not interchangeable. No new tests or exploit claims occur here.

Assessment completion means every threat has a trace, residual risk, owner and
decision; it does not mean every risk is resolved. Abstract-profile approval
needs independent review of its mapping, canonicality, full-domain/failure
contract, dependency completeness, abstract security properties and independent
implementability under Governance §§16–18. Implementation assurance needs its
own parser/resource, failure-path, adversarial and platform evidence. Deployment
needs its own threat/risk acceptance and operational-owner dispositions. One
gate class cannot be reported as satisfying either of the others.
Stop affected work if a mitigation would narrow admitted Text/integer/rational/
structural values, normalize them, change canonical bytes, retarget identifiers
or alter Approved semantics. Use versioned profile and applicable RFC/ADR/spec
governance instead; do not encode a mitigation as a hidden conformance rule.

## 4. Threat register

### T01 — Canonical ambiguity and malleability (representation; High/conditional)

- **Preconditions/path:** adversary supplies alternate integer signs/magnitudes,
  unreduced rational pairs, Text shortcuts, wrong O/L shapes, duplicate or
  misordered maps/names/sets, or another package spelling; permissive parser or
  repair step accepts more than one encoding of the same fixed value.
- **Asset/property:** unique bytes, exact equality and interpretation.
- **Current control/evidence:** R §§3–5, 8–9 mandate shortest definite encoding,
  exact keys, unique zero/minimal magnitude, reduced endpoints, strict order and
  no decode repair. A `parse`/combinators and B `load`/`convert` implement checks.
  E's integer/rational, map-order, duplicate, set and list-shortcut negatives and
  mutants support selected branches; 64 positive canonical comparisons help.
- **Residual:** correlated source interpretation, incomplete complex anchors,
  arbitrary combinations and owner-set equality are not exhaustively established.
  Valid input set enumeration collapse before encoding is not permission to
  accept duplicate members in received canonical bytes.
- **Required evidence/owner:** codec maintainer plus independent implementer
  review injectivity and isolate alternate forms for each structure/combination,
  preserving native Action rules. **Disposition:** controlled-bounded; approval
  evidence required. No demonstrated mapping correction or Approved conflict.

### T02 — Exact Text used as presentation or commands (representation/integration; High/conditional)

- **Preconditions/path:** valid attacker Text reaches terminal/log/UI, shell,
  C-style consumer, search or human approval. NUL may truncate a consumer;
  leading/embedded U+FEFF may disappear; CR/LF may forge log boundaries;
  bidi/zero-width/display controls may conceal or reorder visible material;
  terminal escapes or command-like strings may be interpreted rather than shown.
- **Asset/property:** exact values, reviewer understanding and host confidentiality.
- **Current control/evidence:** R §3.2 requires scalar-exact UTF-8 after chunk
  concatenation, no folding/trimming/BOM stripping/line-ending rewrite. A uses
  fatal decoding with `ignoreBOM:true`; B uses strict UTF-8. `text-controls`,
  composed/decomposed and split-scalar positives plus normalization mutants
  support selected preservation. This is not a renderer security test.
- **Residual:** NUL, BOM, CR/LF and allowed display controls are valid semantic
  values, not malformed Text. No general safe presentation, log policy or
  downstream escaping contract is implemented. A BOM code point inside T is
  distinct from extraneous carrier-prefix bytes. Valid substituted Text can
  decode; only exact comparison to independently intended Text detects that
  substitution. Event Text has no invented digest; Action Text retains its
  separate NFC/repertoire/digest rules.
- **Required evidence/owner:** presentation/application owner defines escaped,
  clearly labeled display/log views that retain exact underlying values; test
  NUL/BOM/CR/LF/bidi/terminal/control combinations and command-as-data handling.
  Do not print raw attack strings in diagnostic logs. **Disposition:** operational
  decision and adversarial evidence required; controlled-bounded preservation
  only. Banning/stripping/normalizing valid Text is a governance stop, not a fix.

### T03 — Malformed carrier accepted partially or nondeterministically (representation; High/conditional)

- **Preconditions/path:** untrusted input contains invalid/overlong UTF-8,
  surrogate/out-of-range/incomplete scalars, truncated chunks/packages, impossible
  lengths, wrong arity, missing/extra/duplicate members, wrong order, forbidden
  tags/simple values, malformed nesting or trailing bytes. Host containers may
  discard duplicates or expose a prefix as successful decode.
- **Asset/property:** integrity, reliable failure and availability.
- **Current control/evidence:** R §§3, 9; A detects map duplicates before insertion,
  B before assignment; both enforce exhaustion of input and strict UTF-8 after
  O reconstruction. Named `utf8-*`, `bytes-truncated`, `text-chunk-shape`,
  `required-context-fields`, `extra-context-field`, `trailing-item` and package
  negatives have exact historical error oracles; the Context control removes
  only the extra member to demonstrate its isolated defect.
- **Residual:** selected negatives do not cover every truncation point/length/
  nesting combination or all exception paths. An over-budget length declaration
  may return `processing-incomplete/resource-limit` before full malformedness
  can be determined; this is not semantic rejection or acceptance. Crash/timeout
  is runner failure, not a successful negative semantic test.
- **Required evidence/owner:** codec maintainer/security reviewer specify bounded
  fault-isolated malformed vectors, exact rejection within supported budgets,
  explicit incomplete outcomes outside them, and no partial success/leak.
  **Disposition:** controlled-bounded; further adversarial evidence required.

### T04 — Arbitrary-integer/rational computational amplification (representation/codec; High/plausible)

- **Preconditions/path:** admitted large signed magnitudes, years, fractions or
  condition indices drive decimal conversion, magnitude copies, gcd and rational
  cross-products; many values compound costs without violating semantic domains.
- **Asset/property:** CPU/memory availability and exact arithmetic.
- **Current control/evidence:** R §§3.3, 5, 9 prohibit native-range narrowing and
  floats; A uses BigInt; B's decimal helpers avoid process-global digit-limit
  changes. Prior 9865-digit and 4104-byte witnesses and arithmetic mutants show
  exact recovery for those sizes. Child invocation has a timeout, not a proof
  of acceptable complexity for all finite values.
- **Residual:** B's per-digit multiplication and repeated division handle growing
  operands; cost is not constant per digit. Gcd/cross-products and decimal/hex
  copies amplify work; E supplies no hostile-size resource curve or budget.
  No performance ceiling or universal complexity bound is established here.
- **Required evidence/owner:** implementation/security owner measures bounded
  size sweeps, peak memory and cancellation/failure for both signs, near-coprime
  rationals and repeated operands under predeclared operational budgets.
  **Disposition:** Draft-only; high-priority evidence required before unrestricted
  use. Returning incomplete is permissible; integer caps as semantic invalidity,
  float substitution or changed canonical magnitude are governance stops.

### T05 — Text/collection/depth and repeated-material amplification (representation/codec; High/plausible)

- **Preconditions/path:** large valid O/L chains, nested extensions/records, long
  sets with common encoded prefixes or repeated dependency/explanation material
  cause copying, sorting, repeated encoding/hash comparisons and stack growth.
- **Asset/property:** CPU, memory and canonical-result availability.
- **Current control/evidence:** A `parse` and B `load` cap raw bytes/item count
  arguments at 64 MiB, nodes at one million and depth at 2048; recursion/resource
  paths are reported incomplete where handled. R §2.3 visits selected dependency
  keys once for closure; fixed closure prevents sender expansion of authority.
  E exercises O boundaries, a long L and `resource-size-declaration`.
- **Residual:** closure deduplication does not remove copies in legitimate
  Action/context/assessment packages. L length itself induces nesting. A builds
  a recursive tree and re-encodes for comparisons; B's iterative CBOR layer does
  not make every typed conversion/allocation bounded. `checkMaterials`/B's
  material matching scan/encode candidates; sets sort full encodings. No end-to-end
  allocation budget or worst-case combination evidence exists.
- **Required evidence/owner:** codec maintainer and independent reviewer trace
  cost by bytes, nodes, depth, set cardinality/common-prefix size and material
  repetition. Test bounded threshold and combined-pressure cases with no partial
  success. **Disposition:** Draft-only; approval evidence required. 4096 chunks
  are partitions, not semantic size limits; do not change them as an optimization.

### T06 — Limits applied after expensive work (experiment harness; High/plausible)

- **Preconditions/path:** expose the local wrapper/fixture interface to uncontrolled
  requests. JSON parsing, hex decoding, fixture expansion, authority configuration,
  parent `JSON.stringify`/Buffer creation and file writes occur before carrier
  guards or child timeout. Each ordinary request repeats roughly 11 MB of
  authority material; concurrency multiplies memory/disk/process demand.
- **Asset/property:** host availability, failure isolation and honest test evidence.
- **Current control/evidence:** `compare.mjs` validates manifest/macros and derives
  authority through verified catalog bytes; macro repeat/power bounds exist.
  Codecs have T05 guards. `process-a.mjs`/`process-b.py` parse/configure before
  their operation try/catch. Invocation error checks prevent crash-as-acceptance.
- **Residual:** no parent input/allocation/disk/concurrency quota; wrapper JSON is
  not a hardened public protocol. Some pre-operation failures escape structured
  codec errors. B's MemoryError handler covers only the operation block; A's
  RangeError handling is not evidence of recoverable process-wide memory failure.
  The 256 MiB output cap is not a total memory or aggregate concurrency bound.
- **Required evidence/owner:** harness maintainer/operator specify trusted-entry
  assumptions and separately test bounded pre-parser failure/resource paths;
  future service adapters need their own containment. **Disposition:** accepted
  only for controlled Draft experimentation; not a normative-profile defect or
  service-ready interface. No wrapper/fixture syntax becomes a wire requirement.

### T07 — Selector, dependency and historical-source substitution (representation/provenance; High/conditional)

- **Preconditions/path:** sender substitutes same-named publication, commit/path,
  body or edition, exploits missing history to choose HEAD, or induces rollback
  to an older otherwise valid governing selection.
- **Asset/property:** immutable interpretation and independent selection.
- **Current control/evidence:** R §§2, 9 requires externally selected selector plus
  publication and recursive owner closure. Loader `profileBinding` hard-binds
  R; `historical` uses exact commit:path, `--no-replace-objects` and
  `GIT_NO_LAZY_FETCH=1`; `verify` checks SHA-256 and Git blob framing. A/B match
  supplied keys/bodies against independent context. Retargeting, tampering,
  path/substitution and missing-history/no-HEAD-fallback regressions are recorded.
- **Residual:** a hash verifies bytes, not trust in the initially chosen pin.
  Historical validity is not freshness; replay of an intentionally selected old
  publication cannot be detected as forbidden rollback without an external
  version-acceptance decision. No new freshness policy is implied. Fixture pins
  cannot defend against an attacker already editing the trusted test checkout.
- **Required evidence/owner:** governing-context owner protects selection and
  explicitly states permitted versions/replay policy; independent reviewer
  checks closure completeness. **Disposition:** controlled-bounded; operational
  selection/review open. No latest fallback, negotiation or permanent selector
  allocation is authorized. Changing meaning requires a new immutable revision.

### T08 — False semantic recovery of extensions/foreign content (representation; High/conditional)

- **Preconditions/path:** collision with known fields, spelling-based authority,
  intrinsic/owned substitution, coercion, discarded unknown values or opaque-byte
  equality presented as owner-semantic equality; foreign history interpreted as
  a bounded transition without its owner.
- **Asset/property:** extension integrity and truthful scope of interpretation.
- **Current control/evidence:** R §§7–8 has exact name equality/collision rules,
  intrinsic kind tags and owner-bound bytes; unknown required meaning blocks
  interpretation. A `extChecks`/B inspection refuse owned-value semantic sets
  without equality support. Unknown-constructor, field-collision, opaque retention,
  unknown-owner and owner-set-equality controls provide bounded evidence.
- **Residual:** opaque retention is not semantic recovery; positive foreign
  interpretation and generalized partial replay remain unsupported. Unknown
  noncritical preservation does not authorize execution, and there is no sender
  criticality flag. Other foreign identifier shapes are not covered.
- **Required evidence/owner:** each foreign/extension owner supplies immutable
  meaning/equality and lossless mapping before broader claims; independent
  implementer tests retained bytes and explicit unsupported outcomes.
  **Disposition:** controlled-bounded support boundary; not a missing generic
  primitive. Broader interpretation cannot be inferred or silently implemented.

### T09 — Carried authority laundered into execution permission (integration; High/conditional)

- **Preconditions/path:** application treats decoded `verified`, copied assessment,
  explanation, source digest or content digest as authoritative establishment,
  or lets time replace authoritative sequence/selected head.
- **Asset/property:** execution ownership and correct Action/fact/context/history
  binding, distinct from mere reproducible bytes.
- **Current control/evidence:** P and R §§6–9 separate established inputs from
  payload, require exact subjects and retain history selection. A/B check Action
  digests, copied bindings and establishment subjects. E checks carriage only;
  the older semantic experiment consumes independently supplied establishment
  outcomes. Neither experiment authenticates raw sources or reevaluates Policy.
- **Residual:** real establishment, role/fact scope, clock evidence and operational
  admission are external duties. A malicious producer can assert a status; a
  decodable snapshot does not make it true. No fresh byte-to-projection evidence.
- **Required evidence/owner:** Boundary, Policy/fact/time and Action owners define
  and implement establishment at their existing boundaries; integrator tests no
  append on unestablished/unsupported/invalid inputs. **Disposition:** operational
  blocker to use as authority, not an encoding correction or second execution
  authority. No new authentication, clock or Evidence primitive is justified.

### T10 — Inline explanation disclosure and retention conflict (representation/deployment; High/conditional)

- **Preconditions/path:** real account, Policy, identity, grants, observations and
  rationale cross recipients/storage/logs/backups with insufficient access or
  retention policy; copying full material multiplies disclosure.
- **Asset/property:** confidentiality, durable explanation and lawful handling.
- **Current control/evidence:** R §§6, 11 and VE-002/VE-006 keep sufficient durable
  historical explanation and assign confidentiality/retention to owners. Complete
  synthetic material is carried in E. No encryption, access-control or retention
  enforcement is supplied by the representation or experiment.
- **Residual:** minimization can omit unrelated material, not delete required
  explanation while claiming complete conformance. Hashes/bare Policy names/
  mutable locators cannot replace required material. Recovery and deletion goals
  may conflict; no jurisdictional/legal compliance finding is made here.
- **Required evidence/owner:** data/Policy owners and operators specify recipients,
  permitted contents, encryption/access, retention, backup and recovery/deletion
  responsibilities; document incompatibilities. **Disposition:** synthetic-only
  Draft risk tolerance; operational approval required for real data. Altered
  Approved explanation duties or silently redacted canonical values trigger
  governance, not a local security exception.

### T11 — Temporary-file, diagnostics and crash-residue disclosure (experiment harness; High/conditional)

- **Preconditions/path:** other-user/same-user/privileged access, hostile temp root,
  abnormal parent death, failed cleanup, backup/swap/core dump or diagnostic
  disclosure exposes the request or authority material.
- **Asset/property:** local confidentiality, exact input and cleanup integrity.
- **Current control/evidence:** `fileBackedProcess` uses unique private directory,
  chmod 0700, exclusive 0600 open with `O_NOFOLLOW` where available; positional
  writes keep the same read/write descriptor at offset zero for child stdin.
  No child pathname reopen or request-bearing command argument. Nested finally
  closes then removes; cleanup errors fail invocation. Prior eight groups check
  exact bytes/EOF, mode bits on non-Windows, EBADF, ESRCH, clean success/rejection/
  failure/throw/timeout and redacted failure diagnostics.
- **Residual:** inherited stdin is an intended capability; it is not proof that
  arbitrary descendants cannot inherit it, nor a general descriptor audit. The
  child receives a read/write file, not a read-only sandbox. Mode bits do not
  defeat same-account/admin access or prove Windows ACLs. `O_NOFOLLOW` fallback
  and parent-directory trust need platform review. Finally is not crash recovery;
  unlink is not secure erasure. Output buffers retain contents in memory; transport
  errors omit them, but successful values/assertion diagnostics have no general
  confidentiality/display policy. Executable/error-code metadata assumes trusted
  program/environment. Cache creation is not governed by transport file modes.
- **Required evidence/owner:** harness/platform operator reviews temp-root trust,
  descriptor/process inheritance, disk/permission/close/remove failures, forced
  parent death, host encryption, residue retention and safe ownership-checked
  recovery. Separate display views from semantic data. **Disposition:** normal
  paths controlled-bounded; crash, remanence and cross-platform evidence open.
  Do not claim secure deletion or silently make this transport normative.

### T12 — Interpreter/environment selection and timeout containment (experiment harness; High/conditional)

- **Preconditions/path:** hostile launcher environment/PATH, modified executable,
  module search settings or child behavior executes untrusted code, exhausts
  resources, retains descendants or prevents timely completion.
- **Asset/property:** host integrity/availability and trustworthy measurements.
- **Current control/evidence:** `invoke` uses `process.execPath` for A and explicit
  `PYTHON` or `python3` for B, absolute wrapper paths and no shell. Fixture data
  does not select commands, source-injection mutation seams or the timeout.
  Production `spawnSync` receives 120000 ms and 256 MiB output cap; tests separately
  assert the default before injecting 500 ms, then check ETIMEDOUT/SIGTERM,
  reaping, closure and cleanup. Both output pipes are drained in selected tests.
- **Residual:** environment is inherited; executable/package identity and PATH,
  Python startup/module variables, Node startup options and temp location remain
  trusted operational inputs. `-B` only prevents Python bytecode writes, not a
  sandbox. No process-tree containment, resistant-child escalation or aggregate
  FD/process quota is implemented. The observed cooperative timeout test does
  not prove a hard deadline for adversarial children; parent serialization/write
  happens before launch. Stalls remain evidence, not proof of a runtime cause.
- **Required evidence/owner:** operator/harness maintainer pins and controls
  interpreter/environment, documents supported platforms, and authorizes bounded
  lifecycle/resource probes with an external safety watchdog if needed.
  **Disposition:** trusted-local Draft use only; operational/security review open.
  Do not raise timeout, add silent retries or count timeout as codec rejection.

### T13 — Unavailable, unauthentic or overlarge owner publication (provenance/operations; High/conditional)

- **Preconditions/path:** missing history/cache, mutable download replacement,
  denial of publication, excessive download body or lost redistribution rights
  prevents reconstruction; matching bytes are misrepresented as authentic owner
  authorization. Cache access may leak future sensitive owner material.
- **Asset/property:** reproducibility, provenance, availability and confidentiality.
- **Current control/evidence:** Loader requires exact historical bytes/no HEAD
  fallback; cache body hashes are rechecked. `hydrate` has a 30-second fetch signal,
  checks SHA before exclusive cache write; URLs are hints, not identity. Required
  missing material is unsupported, not guessed. Six retained bodies rehash here.
- **Residual:** acquisition `arrayBuffer` precedes hash validation and has no
  explicit response-byte cap; full cache reads and Git subprocesses have separate
  operational costs (Git timeout 10000 ms / 8 MiB output cap). Cache mkdir/write
  uses default permissions subject to host settings, not 0700/0600 guarantees.
  Current local availability proves neither publisher authenticity, durable
  restoration nor legal distribution. Unknown rights are not asserted infringements.
- **Required evidence/owner:** publishers/archivists provide lawful retained
  editions and restore/acquisition evidence; operator scopes cache exposure and
  download budgets independently of admitted Event domains. **Disposition:**
  provenance controlled-bounded; availability/rights/security owner decisions
  required. No registry, network resolver or automatic fallback is justified.

## 5. Risk disposition and approval gates

| Gate class | Exact assessment | Consequence |
|---|---|---|
| **Abstract-profile approval** | Review the representation mapping, canonicality/injectivity, full-domain preservation, failure-contract clarity, immutable owner/dependency availability and security properties of the abstract representation; obtain evidence of independent implementability. T01–T03/T07–T09 inform these questions, while T13's durable immutable-material concern remains a legitimate representation-completeness issue. | These items block abstract-profile approval on the present record. Same-author codecs and finite vectors do not close them. A harness finding blocks this gate only when it demonstrates a general problem with the mapping, failure contract, domain preservation, canonicality, dependency completeness or independent implementability. |
| **Implementation assurance** | Establish parser/resource behavior, implementation-specific failure handling, executable adversarial outcomes and platform-specific correctness for each claimed implementation. T03–T06 and relevant T11–T13 paths require bounded evidence. | Blocks assurance claims for the affected implementation. T06/T11/T12 do not unconditionally block abstract-profile approval merely because this experiment harness retains implementation risk. A general profile defect discovered through that evidence is escalated to the abstract-profile gate. |
| **Deployment** | Establish environment/interpreter trust, temporary-storage and crash-residue handling, operational confidentiality, safe logging/presentation, retention, backups, recovery, authentication/establishment integration and resource isolation. T02/T09–T13 and named operational owners govern these duties. | Blocks deployment or a deployment-specific risk acceptance, not abstract-profile approval by default. An unanswered owner request remains visible; it changes the profile gate only if it exposes one of the general representation/dependency problems above. |
| **Currently controlled, bounded evidence only** | T01/T03 selected canonical and malformed forms; T07 exact fixed provenance/selector; T08 retention/unsupported boundaries; T11 normal transport paths. | These are not universal parser, profile-security or deployment proofs. |
| **Accepted for bounded Draft investigation only** | Synthetic, reviewed, local inputs with trusted environment: T04–T06 resource costs, T10 material handling, T11–T12 local process/storage assumptions. | Permits only the stated investigation. This document cannot accept a deployment owner's risk or approve the abstract profile. |
| **Requires independent review** | A security reviewer checks threat assumptions and residual classification; a separate implementer tests correlated-codec/anchor gaps. | Same-author source review and differently structured codecs are not independent-team evidence. |

The R1–R9 readiness risks are all disposed, not all resolved: R1 → T10;
R2/R3 → T11; R4 → T04/T05/T06; R5 → T03/T05/T06;
R6 → T12; R7 → T07/T13; R8 → T09; R9 → T01/T02/T07/T08.

Reviewers may accept justified residual operational risks for a precisely stated
deployment; documenting risks alone is not acceptance, and an operational-owner
response is not an unconditional abstract-profile approval gate. A production
trust/clock implementation is not required merely to keep this subordinate profile
Draft. Neither independent-team replication nor any finite vector set proves the
entire unbounded finite domain. Abstract-profile approval requires reasoned coverage,
a full-domain argument and evidence of independent implementability, not an
impossible exhaustive enumeration or a raw test-count threshold.

## 6. Prioritized evidence/remediation plan and one next artifact

1. **Priority 1, author-controlled implementation assurance:** produce a bounded
   resource/failure evidence package for T03–T06 and T11–T13, preceded by
   independent review of this threat model. Isolate decoder costs from fixture/
   JSON/authority/download/transport costs; include the isolated semantic-domain
   rejection control below; use synthetic material and predeclared per-run/
   aggregate budgets. This selected next artifact does not itself close the
   abstract-profile or deployment gates.
2. **Priority 1, abstract-profile assurance:** obtain canonical/full-domain review
   and independent-implementation evidence targeted at unanchored complex families,
   malformed combinations, foreign/opaque boundaries and platform differences.
3. **Priority 1, external/deployment:** request data/publication and launch/storage
   owner dispositions for T02/T07/T09–T13. Lack of response remains an open
   deployment gate, not an implementation default or unconditional abstract-profile
   blocker. Immutable owner-material availability remains separately relevant to
   representation completeness.
4. **Only after evidence identifies a defect:** propose the smallest local fix
   with exact regression. Do not modify code, pins, bytes or timeout here; escalate
   semantic conflicts before fixing them. Allocation/promotion remains later work.

**Exactly one next artifact is selected:** a **Bounded Representation
Adversarial Resource and Failure Evidence Package**, non-normative and Draft,
owned by the experiment maintainer with security-review oversight. This is
justified by inspected unbounded/pre-guard paths and partial failure evidence,
not by an invented vulnerability. A selector proposal cannot close these risks;
unspecified additional codec work has no proven target; a replication request
alone cannot supply measurable containment evidence. Independent participation
is welcome but authorship must be disclosed, not promised without participants.

Its minimum acceptance criteria, subject to separate authorization:

- Pin current sources, inventories and controls; trace each proposed case to
  T03–T06/T11–T13. State exact synthetic inputs, targeted stage, expected outcome
  and isolation argument; do not turn resource failure into semantic invalidity.
- Cover malformed finite lengths/truncations within budget, valid extreme
  integers/rationals/Text/list/set/depth and repeated material, plus combinations
  chosen for costly comparisons and pre-parser allocation. Cover exact admitted
  Text controls without executing/rendering them unsafely. Include small valid
  controls so fast early failures cannot masquerade as exercised expensive paths.
- Include one isolated semantic-domain rejection under sufficient resources. The
  selected witness is the existing well-formed canonical carrier value
  `calendar-year-zero`: its endpoint year
  `0` violates P §5.2's pinned rule that year is a positive mathematical integer.
  Its nearby valid control is the same well-formed canonical endpoint with year
  `1` and every other component unchanged. Derive the rejection oracle explicitly
  from P §5.2; do not infer it from codec output. Record domain rejection separately
  from malformed-carrier rejection, unsupported interpretation, resource
  unavailability or incomplete processing, harness/process failure, and
  authentication or establishment failure. Existing implementations may retain
  their existing classifications; this criterion invents no error code or rule.
- Define numeric CPU/wall/memory/disk/process/descriptor and repetition ceilings
  **before** running; a trusted external watchdog protects the test host where
  the harness cannot. Stop on budget exhaustion, unexpected output, retained
  process/material or source drift. No unbounded stress or automatic retries.
- Exercise synthetic write/permission/launch/output/cleanup/parent-interruption
  and hostile-child lifecycle conditions in isolated temporary scope, not live
  user data; verify exact bytes, no partial success, sanitized diagnostics and
  cleanup or explicitly inventoried residue. Record unsupported platform cases.
- Record every attempt, input size, duration, peak resources, return class,
  bytes where relevant, process/FD/material aftermath and runtime/OS. Separate
  deterministic defect, expected incomplete processing, test safety cutoff and
  inconclusive environmental result; retain failures alongside passes.
- Compare both structured implementations where applicable, without editing
  semantic fixtures to force agreement. Require independent review of conclusions,
  exact remediation proposals for demonstrated defects and honest residuals.

This package could establish bounded resource/failure behavior and prioritize
actual implementation corrections. It would not establish general security,
cross-platform portability, operational authentication, fresh Lifecycle
admission/projection, independent-team conformance, permanent selectors or
representation approval. It is **not started by this change**.

## 7. Governance and completion statement

R's exact Text uses UTF-8 inside byte strings, not non-NFC native CBOR text;
signed magnitude/containers and exact rational components do not relax
[Accepted ADR-ENC-001](../adrs/ADR-ENC-001-VE-CBOR-1.md). Approved Action/Event
ownership remains unchanged. No evidence inspected here requires a profile
correction, RFC, ADR or new primitive **now**. Unmeasured security risks alone
do not establish a missing semantic rule or another execution authority.

If later evidence exposes ambiguous mapping/failure behavior, the profile
maintainer must make an explicit versioned correction; no byte/meaning change
may retarget the current selector. Changes to Accepted encoding or Approved
semantics require the repository's RFC/ADR, specification/version and changelog
process. Security is not authority to narrow valid domains or repair received
noncanonical data. Operational quotas produce incomplete processing; safe
presentation produces a view, not replacement semantic content.

This closes the author-controlled **assessment inventory and disposition** task,
not independent review, implementation assurance, deployment risk acceptance or
risk remediation. P and R remain Draft. Both codecs remain same-author; the
transport correction avoids the observed pipe path without proving its root cause.
No general portability, authentication, fresh admission/projection evidence or
representation approval is established. The three gate classes remain separate;
the selected evidence package begins none of them in this change.

## 8. Verification of this document

Validation is documentation-only: 154 Markdown documents, 27 documentation-
validator tests, cited fingerprints/inventories/historical and retained external
pins, diff and UTF-8/LF/trailing-whitespace/final-newline hygiene. Neither the
211-test experiment nor the 513-test repository suite is executed. Prior results
are explicitly historical. Exact-head Actions runs only document validation and
documentation-validator tests, not codecs or security probes.

Only this new document is added. Specifications, profiles, scenarios, experiments,
fixtures, pins, workflows, governance and historical analyses remain unchanged.
Both pre-existing stashes remain unchanged and unapplied. No remediation,
permanent allocation, approval, PR merge or next-artifact execution occurs here.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-29 | Pin merged evidence, assess thirteen representation/integration/harness threats, separate abstract-profile, implementation-assurance and deployment gates, and select one bounded resource/failure evidence package with an isolated semantic-domain control, without implementation or approval. |
