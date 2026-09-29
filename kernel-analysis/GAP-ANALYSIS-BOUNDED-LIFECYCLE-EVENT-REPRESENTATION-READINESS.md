---
id: GAP-ANALYSIS-BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-READINESS
title: Post-Experiment Gap Analysis for Bounded Lifecycle Event Representation Readiness
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Analysis
author: Verified Execution Editorial Board
created: 2026-09-29
updated: 2026-09-29
depends_on:
  - BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
  - RS-EVENT-002
  - RS-EVENT-002-EXECUTABLE-COMPARISON
  - GAP-ANALYSIS-RS-EVENT-002-BOUNDED-REPRESENTATION-READINESS
  - BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE
  - BOUNDED-EVENT-REPRESENTATION-EXPERIMENT
related_documents:
  - EVENT-SEMANTIC-FIELD-CONTRACT
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
  - ADR-ENC-001
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Post-Experiment Bounded Lifecycle Event Representation Readiness

## 1. Authority and decision

This is a new **Draft, non-normative Gap Analysis**. It follows the repository's
source-ledger, evidence-disposition, gap/owner and next-artifact conventions.
It does not revise or supersede either historical RS-EVENT analysis. Their
then-current findings remain historical facts; later evidence changes the
present assessment, not the meaning of their pinned sources.

The exact fetched main and branch base is
`fc74ab5f9dafeada157314e119af645e6d91287b` in `cpbrands/VerifiedExecution`.
PRs #100 and #101 are merged. Their deleted remote branches are not reproduction
dependencies: retained immutable commits, paths and verified material are.
No remote advancement was present when this analysis was prepared.

**Disposition:** a bounded representation contract now exists in writing, and
two differently structured same-author codecs support its selected mappings by
bidirectional cross-decoding, canonical-byte agreement and adversarial tests.
Neither full-domain conformance nor general portability, authentication, fresh
Lifecycle admission/projection evidence, deployment readiness or representation
approval follows. Both profiles remain Draft; imported Drafts remain Draft.

**Exactly one next artifact is selected:** a **Bounded Lifecycle Event
Representation Security and Threat Assessment**, non-normative and Draft.
It is not created here. It is the smallest consolidated artifact that can
close the largest remaining author-controlled assurance gap before more code,
allocation or promotion. Independent-team replication and owner/deployment
duties remain separate gates; a security assessment cannot substitute for them.

## 2. Immutable source and evidence ledger

All paths in this table resolve at the exact main commit above. Links are
navigation only; they do not select mutable HEAD. Both fingerprints were
verified from actual Git object bytes, not copied from version labels.

| Source / role | Git blob | SHA-256 of file bytes |
|---|---|---|
| [Semantic profile, Draft v0.2](../specifications/BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE.md): established-input semantics | `a8a88e94be403be9ffc0efd01986a5db9446757e` | `dfd184858a0a925c8da37c67a2ddd6c69e89f7ed064446779ed2122950e98c2b` |
| [RS-EVENT-002, Draft v0.3](../reference-scenarios/RS-EVENT-002-BOUNDED-LIFECYCLE-PROFILE-V02.md): 87 written cases | `860c6430f7127ca89ed03f3f8b8963789a0b236e` | `efb03a4ff5d4e105b0bac5be99a23f6e23ef777368ac0ee95d6239004e98ee20` |
| [Semantic comparison report, Draft v0.2](../experiments/rs-event-002/REPORT.md): bounded execution evidence | `126faa91264362bc7291eabe0c602eafc269ddcb` | `b019c89a550750835a016f22b4e7a120ede0c77ff1e80d5cb203a6f543b369e3` |
| [Prior readiness analysis, Draft v0.2](GAP-ANALYSIS-RS-EVENT-002-BOUNDED-REPRESENTATION-READINESS.md): original completion criteria | `683a95c3b3f2b711f57de2dda82cf685cfd24d9b` | `ab81d3c165f46c4945b4f1536d3d5203d496b60b6c1648ee4a64375815a737a0` |
| [Representation profile, Draft v0.1](../specifications/BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE.md): proposed byte contract | `6893d9caaf10a91b7d5c4ea5c5a7cf1022bbbc73` | `8217fe6e6890dba182ebc8dcc2d4f9deeed824b71b3fddcfc31b0cf7458ce56e` |
| [Representation report, Draft v0.1](../experiments/bounded-event-representation/REPORT.md): current results, correction and retained incidents | `5bb7959ad8ecf059e3ca5a639ee9cf63a60049de` | `56205ebe87f64d92260d463b540662dcb590d71154cf7f8dde1e19c2ab6df0f7` |
| [Specification Governance, Active v1.0](../SPECIFICATION_GOVERNANCE.md): authority and maturity | `cd406061dfcdbaf091e0e9c2d8c5ed65f23aaf05` | `0e4f0180cd97ae2357379f9b5bdc8eb75afe3971a45945884c73e9cb72e0d24f` |

The authoritative **18-file representation experiment inventory**, excluding
`REPORT.md`, is
`6103f472047d5edda61c63a80d33557280ad603a41109e0c9d35dc44544d3293`.
Its covered set is every tracked file under
`experiments/bounded-event-representation/` except that report; ignored caches
are not members. Sort repository-relative paths in ascending ASCII order,
form `[path, lowercase SHA-256(exact bytes)]` for each, serialize the array with
`JSON.stringify` without whitespace/newline, and SHA-256 its UTF-8 bytes.
The report is separately pinned above, avoiding a report self-hash. The same
algorithm over **all seven tracked files** under `experiments/rs-event-002/`,
including its report, gives
`3fee8a404febf7ea03afd80a5226b7692f77039c386077c537b436234cfc5d32`.
These are diagnostic inventories, not VE identities or profile allocations.

Historical interpretation still follows each publication's own selection:

- Semantic profile publication at `162de90510e7d64f6970d7ff0e9df6ee2dbd4d17`;
  its normative repository imports resolve recursively at
  `56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f`.
- Semantic experiment pins scenario/profile at
  `cc91ae116959ad6535b3d2b5b5f6ac602e651587`; its **55** pins include an
  intentionally over-inclusive 53-file historical owner bundle, not a claim
  that all 53 are necessary for every Event.
- Representation publication at `bc080e6037bdd3129d5132d90d9253ed85f59c1b`;
  [sources.json](../experiments/bounded-event-representation/sources.json)
  pins **16** repository commit/path/blob/SHA-256 records. These include the
  semantic profile and its historical normative imports, not latest versions.
- [owners.json](../experiments/bounded-event-representation/owners.json) selects
  six external byte editions: RFC 8949, RFC 3629, Lynx UG2026, UnicodeData 6.2,
  UAX44 revision 10 and XML 1.0 Fifth Edition. All six locally retained bodies
  reverified against their recorded SHA-256. Local availability today is not
  durable publication, redistribution permission or authenticated owner origin.

The exact historical Event contract and VE-001/002/003/004/005/006 retain field,
Action, occurrence, Lifecycle, Receipt, observation and Boundary ownership.
Accepted ADR-ENC-001 v0.1 supplies the narrow VE-CBOR-1 rules; neither an
experiment nor this ledger promotes its Draft dependencies. All 55 semantic
pins and all 16 representation pins were verified without executing evaluators
or codecs. No fallback to mutable working-tree bytes was used.

## 3. Evidence disposition, not a new experiment

The following are results recorded by the pinned reports and inspected test
contracts. They are **not rerun results from this analysis**.

| Evidence | Bounded support | Limit retained |
|---|---|---|
| Semantic comparison: 87/87 | Two differently structured, different-language evaluators agree with a separately transcribed oracle: 19 accept, 55 reject, 6 unsupported, 6 unestablished, 1 unselected. | Same author and common source interpretation; established inputs are supplied. Case 10's unselected label is local test syntax. No raw authentication or general projection proof. |
| Semantic fault/runner evidence | 104/104 mutant tests, 52 families, 102 distinct source mutations; 25 negative-control groups, one positive selector control, provenance regressions; recorded complete suite 302/302. | Deliberately shared witnesses are not extra distinct mutations. Local fixed/presented selectors are not VE registry values. |
| Representation positives | 64 cases require A encode/B decode and B encode/A decode, exact semantic recovery, independently produced identical canonical bytes and canonical re-encoding. Both codec structures are separately written. | Same-author implementation and fixture interpretation; shared provenance, expansion and comparison plumbing; not independent-team conformance. |
| Representation negatives and faults | 67 negatives: 62 rejection, 4 unsupported, 1 processing-incomplete; 43 mutations: 42 codec mutations across 21 families plus one comparison-normalization mutation. Exact expected symptoms, not crashes, count. | Not exhaustive classes or full semantic admission. Patch-generated negatives use A's CBOR utility; that test-generation correlation is disclosed. |
| Independent byte expectations | 18 hand-derived anchors plus Action-owner field/descriptor/digest anchors constrain correlated codec agreement. | The 18 do not cover every complex family or every complete package; two matching implementations can share a mistaken reading. |
| Integrity controls | Closed manifests, historical bytes/blob checks, selector binding, tampering and missing-history/no-HEAD-fallback checks pass in the recorded suites. | A matching source hash does not authenticate a producing authority, make a document Approved or guarantee future access. |
| Current test accounting | 203 original representation tests + 8 transport groups = 211; 302 preceding repository tests + 211 = 513. Original 203 = 64 + 67 + 43 + 1 Text-binding + 20 runner + 2 provenance + 2 correction + 4 boundary tests. | Test groups, subprocess calls, cases and semantic obligations are not interchangeable counts. Documentation Actions does not execute 211 or 513 tests. |

RS-EVENT-002's 87 rows remain 7 mappings, 5 positive controls, 57 isolated
non-acceptances, 10 compound defenses, 7 invariances and 1 intentional duplicate,
with 70 written-rule obligations. This is not 87 independent semantic branches.
The representation experiment does not execute a new admission/projection
engine or prove that every semantic-profile §10 pressure is covered by bytes.
In particular, copied input/status material and a decodable Event-only package
are not independently established Events. A future end-to-end claim needs its
own traced evidence; adding the two experiments' counts does not provide it.

### Transport incident and correction boundary

The report retains pre-merge 505/505, post-merge experiment 203/203 and the
post-merge **504/505** failure at `native-negative-sequence`, plus the earlier
`establishment-failed` timeout and subsequent diagnostic ETIMEDOUTs. Sampled
Python stalls waited on stdin before codec evaluation; sleep affected one
loaded run, not every observed stall. Later passing runs do not erase them.

The corrected transport supplies identical JSON request bytes through private
file-backed stdin from offset zero to ordinary-file EOF. It avoids the pipe
path on which stalls were observed; **the underlying Node/libuv cause remains
unproved**. Normal completion and tested failure paths close/remove material;
safe diagnostics omit request/child-output contents. The production timeout
is still 120000 ms, without retries. The explicit test callback alone injects
500 ms after asserting that default; historical production-duration controls
and newer short controls are separate evidence, not contradictory measurements.

Recorded Node 24.19.0/macOS arm64 runs cover Python 3.9.6 and 3.12.14, default
and serialized scheduling; current short-control validation records 211/211
and 513/513. They support correction reliability on that host, not all-platform
safety or indefinite absence of flakiness. The profiles' original statements
that they themselves supplied no executable evidence remain historically true.

## 4. Completion-criterion classification

**W** means established as an explicit rule/argument in the written Draft,
not Approved or mathematically certified. **E** means bounded same-author
empirical support. **U** is still unestablished. **A** identifies the required
owner/reviewer/action. A row can have W and E while U remains open; no aggregate
pass count turns these categories into approval.

### 4.1 Every acceptance criterion from the prior gap analysis §6.2

| Criterion | W: written Draft | E: same-author evidence | U and A: remaining completion duty |
|---|---|---|---|
| 1. Supported domains, seven kinds and owners | Representation §§2–8 enumerate seven full identifiers, exact fields, Lynx-only Action scope and owners. | Complete values for all seven kinds, owner/field boundaries and native Action checks. | Exhaustive scope/owner-closure review; profile maintainer and affected Action owners. Broader Actions are unsupported, not implicitly admitted. |
| 2. Total lossless mapping and compatibility | §§3, 5, 8–9 define O/T/Z/L, range distinctions, exact rationals and an injectivity argument over supported finite structures. | Unicode, large signed integers, rationals, uint64 and chunk boundaries; cross-decoding and relevant mutants. | Independent scrutiny of the full-domain argument and resource behavior; implementer/security reviewer. Finite tests cannot establish all admitted values or unknown-owner meanings. |
| 3. Immutable type/publication/dependency binding | §§2, 4 select exact publication and recursive owner closure independently; no latest fallback or circular self-hash. | Source pins, body/blob/retargeting failures and cached external fingerprints. | Durable, lawful, authentic owner-material publication and restoration; publishers/archivists/owners. Hashes alone close none of these operational duties. |
| 4. Explanation and authority separation | §§6–7 preserve whole Action/context/assessment/basis and independently established companion inputs. | Byte/semantic recovery and binding checks for supplied material. Earlier semantic experiment covers established-result consumption. | General explanatory sufficiency, real authority establishment and new end-to-end admission evidence; Boundary/Policy/target owners and independent implementer. No Policy re-execution is supplied. |
| 5. Unknown extensions | §8 distinguishes intrinsic kinds, owner bytes, noncritical preservation and unsupported required meaning. | Unknown/null/owned retention, collision/duplicate/owner-set boundaries. | Arbitrary owner equality/representation and positive foreign interpretation; each owner. Whole-profile portability over arbitrary extensions remains unclaimed. |
| 6. Two-implementation evidence | §10 requires both cross-decoding directions, semantic equality and canonical-byte equality where claimed. | Two differently structured codecs and source-pinned vectors satisfy that execution pattern for 64 positives; 67 negatives/43 mutations constrain faults. | General conformance, independent-team replication, remaining complex anchors and complete coverage of §10's semantic pressures; independent implementer/reviewer. Self-round-tripping is not substituted. |
| 7. Dependency/status, compatibility and security review | §§9–11 state boundaries, risks, Draft status and escalation duties. | Explicit negative checks and transport cleanup/reliability controls; no demonstrated Approved conflict. | Systematic threat assessment, cross-platform evidence, material/retention disposition and explicit maturity review; security reviewer, owners and governance. This criterion is not closed by green tests. |

### 4.2 Domain and operational subcriteria

| Item / source | W | E | U / responsible action |
|---|---|---|---|
| Seven Lifecycle types: semantic §4, representation §4 | ACTION_CREATED, VALIDATION_STARTED, VALIDATION_SUCCEEDED, AUTHORIZATION_GRANTED, EXECUTION_STARTED, EXECUTION_COMPLETED, EXECUTION_FAILED preserve existing transitions. | All seven semantic mappings and complete representation values. | Broader approval/cancellation/Policy histories and fresh byte-to-admission/projection integration; type/Boundary owners and implementers. No approval duty is waived. |
| Arbitrary integers: representation §3.3 | Signed minimal magnitude with unique zero; positive years, indices and uint64 retain their distinct owner domains. | Beyond-native-range, 9865-digit and 4104-byte witnesses; Python decimal-limit correction, exact signs and re-encoding. | Every magnitude, cost bounds and all resource failures; implementation/security review. No host limit becomes a semantic maximum. |
| Rational time: §5 | Exact reduced components, zero 0/1, positive denominator; inclusive point/interval, unknown/unavailable/malformed distinctions; sequence still orders history. | Thirds, large coprime components and precision-loss faults; semantic interval-conflict cases. | CPU/memory bounds for conversion/gcd/cross-products; security reviewer. Measurement, calibration and fact-bound authority remain time/fact owners' work. |
| Event Text: §3.2 | Exact scalar-sequence UTF-8 in octets; no NFC normalization, trimming or BOM removal. | Distinct composed/decomposed positives; normalization encoder/decoder/comparator mutations and intended-value mismatch. | General injectivity review and adversarial size/split testing, not a new text rule; independent implementer/security reviewer. |
| Action Text and digest: §6.1 | Existing Lynx Action's NFC/repertoire/length and native digest rules remain separate from Event Text. | Owner Unicode 6.2 data, account boundaries, schema/descriptor and Action digest mismatch tests. | Authentic occurrence/content authority binding and other Action owners; VE-001/Action/Boundary owners. A correct digest authenticates neither sender nor fact. |
| Inline explanation: §§6–7 | Retain complete inputs, terms, evaluator/version, results and rationale; copied content does not establish authority. | FX/KN-style material is carried; prior semantic outcomes retain uncertain facts and erroneous reported Policy calculations. | General natural-language sufficiency, confidentiality and archival recovery; domain owners/operator/reviewer. No parser proves the explanation true. |
| Canonical agreement and bidirectional decoding: §§9–10 | One encoding for a fixed supported value/closure/snapshot; owner-byte retention is not cross-owner semantic identity. | Both directions and independent encoding agree on all 64 positive fixtures. | Exhaustive correctness/independent-team confirmation; separate implementer. The package defines no Event content digest. |
| Platforms and runtimes | Node 20+/Python 3.9+ are reproduction prerequisites, not platform conformance certificates. | Recorded Node 24.19/macOS arm64, Python 3.9.6/3.12.14 and scheduling variants. | Other OS/architectures/runtime releases, filesystem permissions and process behavior; implementers/platform operators. Documentation-only Linux CI is not a codec portability run. |
| Material access and publication: §2 | Offline exact bytes suffice; unavailable/conflicting closure fails closed. Publication supplied externally avoids a circular profile hash. | 16 historical pins and six cache bodies verify; 55 older semantic pins reproduce their historical bundle. | Licenses/redistribution, authenticity, archival durability and new recipient acquisition; external publishers/archivists. URLs are hints, not immutable availability guarantees. |
| Selectors: §2.1 | Provisional local 0.1-draft.1 plus exact publication; semantic type revision 0.2-draft.1 is separate; neither may be retargeted. | Bound selector/pin rejection. | Permanent adoption/publication review and allocation-collision review if later requested; governance. No numeric registry, tag, media type, VE-xxx or PSCID allocation is currently needed or granted. |
| Foreign/opaque values: §§7–8 | Exact opaque bytes can be retained; required unavailable interpretation is unsupported. Owner-defined set equality cannot be inferred from byte equality. | Boundary/rejection/retention tests only; known imported/local ordering. | Positive foreign types, other identifier shapes, generalized partial replay and arbitrary owner semantics; respective owners. They block broader claims, not bounded study. |

## 5. Outstanding risk register and ownership

These are missing assurance or operational contracts, **not asserted exploitable
defects**. A security review must determine severity and reproducibility rather
than assume them. Existing controls are evidence to assess, not reasons to omit
an attack surface. Except where stated, these block deployment/security or
complete-portability claims, not continued bounded Draft analysis.

| Risk / exact outstanding question | Present boundary and completion owner | Effect on readiness / escalation |
|---|---|---|
| R1. Sensitive inline Policy, account, identity, grants, observations and rationale: who can read, copy, retain or restore them? | Semantic §5.3 and VE-002 require sufficient durable explanation. Operator/data owners define access, encryption, lawful retention and recovery; security reviewer evaluates exposure. | Blocks deployment suitability until disposed. Redaction or mutable-pointer replacement cannot silently retain full conformance. Changed Approved duties require governance; access controls alone do not. |
| R2. Temporary input exposure | Transport uses unique directory, POSIX 0700, exclusive/no-follow 0600 file, same descriptor from offset zero; tests cover ordinary cleanup. No proof covers privileged/same-account attackers, backups, swap, crash dumps or every OS ACL model. | Security reviewer/operator must state host threat assumptions and inspect these paths; no new storage primitive follows. |
| R3. Crash recovery/remanence | Finally-based cleanup and surfaced cleanup errors do not execute after power loss/forced parent death; unlink is not forensic secure erasure. | Operator owns crash scavenging/retention policy and encrypted-storage decisions; reviewer requires bounded failure scenarios and evidence. Any proposed recovery code is separate work, not authorized here. |
| R4. Size/CPU amplification | Arbitrary finite integer/Text/list domains, magnitude conversion, gcd/cross-products, set sorting/comparison, full explanation copies and approximately 11 MB repeated authority requests create costs. Current finite successes do not bound hostile work. | Maintainer/security reviewer must map growth and peak allocation/disk/process costs. Operational ceilings must report incomplete processing, not invalid semantics or successful truncation. |
| R5. Parser and pre-parser limits | Codecs have 64 MiB input/item ceilings, one-million-node and 2048-depth guards, plus host-recursion handling. These are implementation limits, not admitted-domain maxima. JSON loading/hex conversion/configuration, encoding and parent request construction can allocate before decoder limits. | Reviewer must follow the complete allocation path, including nested L/O shapes, duplicate detection and failing allocations; no claim of a comprehensive resource sandbox. A guard's existence does not prove end-to-end containment. |
| R6. Timeout, output and process lifecycle | 120000 ms bounds the launched child call, not prior parent serialization/file writes or every host failure; output cap is 256 MiB. Stdin correction avoids observed stalls; root runtime cause is unproved. | Maintainer/platform reviewer owns bounded timeout/disk-full/permission/interruption analysis and unexpected failure diagnostics. Do not weaken timeout or reinterpret runner errors as semantic acceptance. |
| R7. Publication/provenance availability | Hash-verified cache/history exists locally; raw publisher authenticity and enduring distribution are different questions. Required external editions may be unavailable or require permission to redistribute. | Publisher/owner/archivist supplies durable lawful acquisition/restoration evidence. Security assessment records blockers, not an invented registry or assertion that today's URLs always work. |
| R8. Authority laundering | Source/material hashes, copied grants, verified labels and Action digests might be mistaken for operational authority by an integrating application. Written contract explicitly prohibits this. | Boundary/fact/Policy/time owners establish exact subject and scoped results; security reviewer tests trust-boundary assumptions. No new universal authentication architecture is inferred. |
| R9. Parser differentials/retargeting/opaque owners | Shared fixture expansion and same-author interpretation can hide errors; 18 anchors are incomplete. Unknown-owner equality/criticality must not be guessed. | Independent implementer and security reviewer assess canonical confusion, normalization, duplicates, closure substitution and unsupported paths. New owner rules need versioned closure, not silent reuse. |

Independent-team replication, sustained cross-platform operation and imported
Draft maturity are still unestablished. Governance §§7A, 16–18 calls for review,
explicit failure/security treatment and evidence proportionate to stability;
it does not mechanically require an independent team merely to draft a profile.
No unperformed independent-team or operational activity is reclassified as a
written-contract gap just to justify inventing infrastructure.

## 6. Exactly one next artifact

| Candidate | Dependency-order assessment |
|---|---|
| **Bounded representation security/threat assessment** | **Selected.** Code and bytes now exist; risks R1–R9 are concrete and reviewable with current pins. One narrow report can distinguish spec, implementation and deployment obligations before stabilization without altering semantics. It closes the largest risk-disposition gap controlled by the repository authors. |
| Independent-implementation package or replication request | Valuable, but a reproducible pinned package already exists. A request alone cannot create independent evidence and depends on another implementer; security findings may identify the most important independent targets. Not selected; independent-team evidence remains open. |
| Selector/allocation proposal | Premature. Existing provisional selector plus immutable publication suffices for bounded investigation. Permanent naming does not fix confidentiality, resource behavior or implementation assurance, and must not imply approval. |
| Further codec work | Defer absent a demonstrated defect or specific uncovered obligation. More same-author code may increase coverage but cannot itself close systematic threat analysis or independent authorship. A confirmed bug would justify narrowly scoped correction through its owner. |

The selected artifact may proceed while both profiles remain Draft. Its
responsible author is the repository's representation maintainer; an explicitly
identified security reviewer reviews its reasoning. Independent review must be
described honestly: a same-author self-review is useful analysis, not an
independent security attestation. External publication, trust and retention
decisions require the respective owners; the author cannot declare them solved.

### Acceptance criteria for the selected assessment

These criteria commission only a future **analysis artifact**, not new normative
requirements or permission to implement changes in this PR:

1. Pin the representation/semantic publications, all relied-on owners, both
   experiment inventories and the exact transport. Distinguish reviewed text,
   observed execution and hypotheses; preserve all recorded timeout failures.
2. State assets, entry points, trust boundaries and attacker capabilities:
   untrusted packages/material/status claims, opaque owners, hostile sizes and
   concurrency, local temporary storage and archive readers. Identify explicitly
   which privileged-host risks are in/out of scope and why.
3. Cover every R1–R9 item with a source/code trace, current control, residual
   risk, owner, severity rationale and disposition: supported control, reproducible
   defect, untested hypothesis, required owner decision or out-of-scope claim.
   No blank item is a pass; externally blocked items remain visible.
4. Analyze time/memory/disk growth for integer conversions and rational arithmetic,
   Text/chunk/list depth, sets, duplicate material and pre-parser allocations.
   Locate where each operational limit acts and where it does not. Define bounded,
   non-destructive probe plans and expected failure classes where inspection is
   insufficient; label unexecuted plans unexecuted. Any separately authorized
   execution must record all failures, exact inputs and limits, with no retries
   that conceal them. No unbounded stress exercise or new semantic cap.
5. Assess confidentiality across file permissions, input/output diagnostics,
   cleanup errors, forced termination, disk exhaustion, backup/swap/remanence and
   archival retention. Separate normal unlink evidence from crash recovery and
   secure erasure; require explicit operator decisions, not a claim that 0600
   solves every threat.
6. Assess copied-status trust, publication substitution, canonical/Unicode
   confusion, unknown critical/owned material and owner-set equality. Maintain
   Action-owned NFC/digest versus Event Text distinctions and precise invalid,
   unsupported, unestablished and processing-incomplete boundaries. Evaluate
   embedded NUL; BOM as admitted semantic Text versus a malformed carrier marker;
   newline and carriage-return controls; bidirectional and other display-affecting
   controls; terminal, log and diagnostic injection; malformed UTF-8 and forbidden
   scalar encodings; truncated packages and carrier structures; duplicate,
   missing, extra or misordered structural members where applicable; invalid
   lengths, trailing data, malformed chunks/lists/records, adversarial nesting,
   oversized declarations and resource-exhaustion inputs. Valid Event Text code
   points admitted by the Draft, including permitted controls, must remain exact:
   safe display, logging and diagnostic escaping must not normalize, remove or
   silently rewrite the underlying semantic value. Malformed carrier input must
   reject deterministically without crashes, hangs, partial acceptance, resource
   leaks or diagnostic injection. Assess these risks without selecting a
   mitigation or changing representation semantics in the assessment mandate.
7. Record external-material acquisition, retained editions, restoration and
   distribution-rights uncertainties with named responsible owner roles; do not
   assert legal permission or authenticity from a fingerprint. Identify a bounded
   cross-platform/independent-implementation evidence request, not a new codec or
   allocation proposal, as a residual recommendation only.
8. Deliver a traceable risk register, review/authorship declaration, prioritized
   minimal corrective recommendations and an explicit residual-risk decision.
   A maintainer/reviewer can complete the assessment with documented open risks;
   they cannot label deployment or approval ready while relevant blockers remain.
   A discovered Approved conflict stops the affected proposal for RFC/ADR and
   versioned-spec/changelog governance. Do not silently implement a mitigation.

**Completion evidence:** one reviewed assessment containing the traces,
bounded evidence/plan distinctions, owner decisions or explicit outstanding
requests, and residual-risk disposition for all nine rows. It establishes a
scoped threat model and accountable review result, not security perfection,
general conformance, independent-team replication, authentication, fresh
admission/projection, universal portability, permanent allocation or approval.
Creating that document, running probes, fixing codecs or requesting replication
is not part of the present gap-analysis change.

## 7. Architectural and governance disposition

**No demonstrated Approved-semantic conflict, missing primitive or duplicated
execution authority is identified by this evidence.** Written T/O/Z/L mappings
preserve the full declared finite domain rather than silently narrowing it;
actual CBOR text remains NFC, arbitrary integers use permitted containers and
rationals retain explicit exact components/unit. Accepted ADR-ENC-001 is not
relaxed. Action representation/digests and VE-002 occurrence bytes retain
their owners. These are reviewed compatibility reasons, not exhaustive proof
that either codec implements every value correctly.

The package transports assertions and owner material, not authorization.
Boundary admission and ordering, Adapter observations, target truth, Policy
evaluation, Lifecycle projection and Receipt derivation remain separate. A
decoded verified label never creates another execution authority. Operational
unknowns do not demonstrate that a new Evidence, Clock, Registry or identity
primitive is needed.

**RFC required now: No. ADR required now: No.** This one-document analysis and
the selected non-normative threat assessment amend no Approved meaning,
accepted encoding rule or primitive, and allocate nothing. Governance §§2,
10–13 and 18–21 still apply to any later Approved-semantic change. A byte- or
semantic-affecting change also requires a new immutable profile revision under
the existing Draft contract; no status edit may retarget published identifiers.
Any later permanent selector/publication/adoption proposal needs explicit
governance and collision/ownership review; no numeric code requirement is
invented here, and no existing PSCID/VE allocation table is repurposed.

Independent-team evidence, operational establishment and security review are
not substitutes for one another. The prior gap analysis's representation
drafting gate has been passed as bounded work, while its full preservation,
security/availability and maturity completion duties remain only partially
discharged. The current conclusion is **ready for focused security assessment,
not representation approval or general portable deployment**.

## 8. Verification boundary for this change

Validation is documentation-only: document validation, documentation-validator
tests, diff and strict UTF-8/LF/trailing-whitespace/final-newline hygiene, plus
read-only recomputation of the ledger/inventories and historical/cache pins.
Neither the 211-test experiment nor the 513-test repository suite is run for
this analysis. Quoted executable results remain attributed to the exact pinned
reports. GitHub Actions has the same documentation-only scope, not a new
cross-language or security attestation.

Only this new file is added. Existing specifications, profiles, scenarios,
experiments, source pins, workflows and historical analyses are unchanged.
No changelog or allocation/index change is required for this non-normative
Draft addition. Both pre-existing stashes remain unchanged and unapplied.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-29 | Pin merged semantic/representation evidence and transport incidents, classify completion criteria and owners, and select one bounded security/threat assessment without approval, allocation, code changes or new experiment execution. |
