---
id: BOUNDED-REPRESENTATION-ADVERSARIAL-RESOURCE-FAILURE-EVIDENCE
title: Bounded Representation Adversarial Resource and Failure Evidence Package
version: "0.1"
status: Draft
document_type: Experiment Report
category: Non-normative Evidence
author: Verified Execution Editorial Board
created: 2026-09-29
updated: 2026-09-29
depends_on:
  - THREAT-ASSESSMENT-BOUNDED-LIFECYCLE-EVENT-REPRESENTATION
  - BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE
  - BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
  - BOUNDED-EVENT-REPRESENTATION-EXPERIMENT
related_documents:
  - GAP-ANALYSIS-BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-READINESS
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Bounded Representation Adversarial Resource and Failure Evidence Package

## 1. Status, authority and result

This is the bounded resource/failure evidence package selected by §6 of the
[threat assessment](../../kernel-analysis/THREAT-ASSESSMENT-BOUNDED-LIFECYCLE-EVENT-REPRESENTATION.md).
It is **Draft, non-normative, same-author evidence**. It is not independent-team
conformance, general portability, authentication, operational establishment,
deployment approval or approval of either Draft profile. Independent security
review of the conclusions and separate-implementer replication remain required.

The exact branch base and authoritative `origin/main` were
`bdd24a7b9de7132ecc7ce0e9c65d883a7ecf08d2`. The pre-existing representation
experiment inventory, excluding its report, reverified as
`6103f472047d5edda61c63a80d33557280ad603a41109e0c9d35dc44544d3293`.
The existing source loader then verified 16 repository pins and six retained
external editions before any evidence case ran. Every attempt repeated source,
base and inventory checks; there was no fallback to working-tree or current
source bytes.

The final bounded run recorded **30/30 expected attempts**, zero failed evidence
assertions, zero inconclusive environmental results and zero deterministic
implementation defects. One carrier was correctly classified as incomplete due
to a resource guard; five controlled inner operations reached their predeclared
safety cutoffs; one platform capability was recorded unsupported. These are not
semantic invalidity. No result requires a representation/profile correction,
Approved semantic change, RFC, ADR or new primitive.

## 2. Predeclared budgets and isolation

The machine-readable budgets are in [budgets.json](budgets.json). They were fixed
before the final evidence run.

| Scope | Budget |
|---|---:|
| Per-attempt wall time | 20,000 ms |
| Per-attempt CPU | 12 seconds |
| Per-attempt memory | 2,147,483,648 bytes |
| Per-attempt file/temp material | 67,108,864 bytes |
| Per-attempt file descriptors | 64 |
| Per-attempt child processes | 4 |
| Complete request/input | 33,554,432 bytes |
| Captured watchdog output | 1,048,576 bytes |
| Repetitions per case | 2 maximum |
| Attempts | 30 maximum |
| Concurrent attempts | 1 |
| Aggregate wall time | 300,000 ms |
| Controlled inner wall cutoff | 500 ms |
| Controlled inner memory cutoff | 134,217,728 bytes |
| Synthetic self-test allocation | 268,435,456 bytes |
| Controlled inner file cutoff | 1,024 bytes |
| Controlled inner output cutoff | 65,536 bytes |

Each attempt ran as a separate process session under
[watchdog.py](watchdog.py). On the recorded macOS host it enforced CPU,
file-size and descriptor limits and external wall and aggregate-memory cutoffs,
bounded captured output, killed the whole process group on a cutoff, ran one
attempt at a time, inventoried temporary material and recreated an empty
isolation root after cleanup. The manifest code permits at most four
worker/descendant processes and uses synchronous child calls; macOS supplied no
safe per-attempt hard process count limit, so `platform-process-limit` records
that hard capability as unsupported rather than claiming enforcement.

The external memory monitor used `/bin/ps` every 25 ms to sum resident memory
for every member of the isolated process group. A measurement or parsing failure
stops the group and fails the attempt closed. Exceeding the applicable ceiling
sends `SIGTERM` to the group, permits a bounded 250 ms descendant-reaping window,
then sends `SIGKILL` to the same group if it remains. macOS exposes `RLIMIT_AS`
but rejected setting it in a pre-exec child, so hard address-space enforcement
remained unavailable while active aggregate-RSS enforcement was present. The
largest ordinary attempt reached 679,952,384 bytes, below the 2,147,483,648-byte
ceiling.

The separate watchdog self-test used a 134,217,728-byte inner ceiling and a
synthetic descendant that attempted a 268,435,456-byte allocation. The monitor
observed two group members, crossed the inner ceiling at 144,556,032 bytes on
sample six, terminated the group in 482.621 ms and found no surviving group or
residue. That is a resource/safety cutoff, not semantic invalidity. No 2 GiB
destructive allocation was used.

## 3. Evidence contract and classifications

[cases.json](cases.json) records each case ID, T03–T06/T11–T13 mapping, targeted
stage, expected result, outcome class and repetition count. The runner keeps
these outcomes separate:

- valid resource-intensive semantic values;
- malformed carrier rejection;
- well-formed canonical values that violate a field domain;
- unsupported interpretation;
- unavailable resources or incomplete processing;
- harness/process failure; and
- authentication or establishment failure.

[results.json](results.json) is the attempt ledger. For every attempt it records
the exact complete request size, carrier size and SHA-256 where applicable,
targeted stage, expected and actual class, wall and CPU time, peak RSS, hard-limit
availability, runtime/OS, captured-output sizes, process-group state, FD counts,
temporary-material inventory before and after cleanup, case-specific observations
and pass/failure/inconclusive classification. It retains expected failures and
safety cutoffs alongside accepted values.

The final run used Node v24.19.0, Python 3.9.6 and
`macOS-27.0-arm64-arm-64bit`. It completed in 17,203 ms. Maxima were:

| Observation | Maximum |
|---|---:|
| Complete request | 30,104,554 bytes |
| Canonical carrier | 9,484,254 bytes |
| Attempt wall time | 1,133.289 ms |
| Attempt CPU, user + system | 1.581165 s |
| Aggregate process-group peak RSS | 679,952,384 bytes |
| Peak isolated temp material | 30,105,211 bytes |

## 4. Case inventory and actual outcomes

| Case or group | Threats | Actual outcome | Evidence disposition |
|---|---|---|---|
| `small-integer-control` (twice) | T04 | A/B accepted and agreed | pass |
| `valid-integer-32768-bit` | T04/T06 | A/B accepted 4,101-byte carrier | pass |
| `valid-rational-near-coprime` | T04/T05 | A/B accepted exact 8,192-bit rational components | pass |
| `valid-text-controls` | T05/T10/T11/T12 | A/B retained exact Text bytes; report uses code points/digest only | pass |
| `preparser-valid-text-2mib` | T05/T06 | A/B accepted 2 Mi repeated decomposed Text input | pass |
| `valid-list-depth-128` | T05/T06 | A/B accepted nested finite list | pass |
| `valid-set-common-prefix` | T05/T06 | A/B accepted/sorted 128 long-prefix members | pass |
| `valid-repeated-material-package` | T05/T06/T13 | A/B accepted 30,104,554-byte request and agreed on 9,484,254-byte carrier | pass |
| two malformed/truncated carriers | T03/T05 | A/B `encoding/truncated` | pass |
| `calendar-year-one-control` | T03/T04 | A/B accepted | pass |
| `calendar-year-zero` | T03/T04 | A/B `domain/positive` | pass |
| `rational-unreduced` | T03/T04 | A/B `domain/endpoint` | pass |
| unsupported extension | T03/T08 | A/B `unsupported/extension-constructor` | pass |
| over-budget declared length | T03/T05 | A/B `processing-incomplete/resource-limit` | expected incomplete processing |
| unavailable historical source | T07/T13 | `provenance/missing-history`; no HEAD fallback | pass |
| substituted source bytes | T07/T13 | `provenance/sha256` | pass |
| `establishment-failed` | T02/T09 | A/B canonically retained status `failed` | pass; establishment remains failed |
| diagnostic injection | T10/T11/T12 | A/B `unsupported/test-type`; hostile controls not reflected | pass |
| permission failure | T11/T12 | sanitized `EACCES` | pass |
| launch failure | T12 | sanitized `ENOENT` | pass |
| controlled write limit | T06/T11/T12 | child failed at 1,024-byte file bound | test-safety cutoff |
| controlled output limit | T06/T12 | `ENOBUFS` at 65,536 bytes | test-safety cutoff |
| controlled cleanup failure | T11/T12 | inner `EACCES`, one inner residue inventoried, outer cleanup complete | pass |
| controlled parent interruption | T11/T12 | `SIGTERM`, descendant cleanup issued, no surviving process group | pass |
| hostile child | T12 | `ETIMEDOUT` at 500 ms, no surviving process group | test-safety cutoff |
| memory watchdog self-test | T06/T12 | two-member group crossed 128 MiB inner ceiling; whole group terminated with no residue | test-safety cutoff |
| FD exhaustion | T06/T12 | `EMFILE`; 53 opened descriptors and all 53 closed in this run | test-safety cutoff |
| hard process-count capability | T12 | serial cap active; hard platform limit unavailable | unsupported platform |

There were no deterministic defects, unexpected evidence failures or
environmental inconclusives. The five safety cutoffs are deliberate bounded
failure cases, not failed assertions. No case was automatically retried.

## 5. Isolated calendar-domain oracle

The rejection oracle is independent of codec output. The pinned semantic
profile §5.2 defines an endpoint year as a positive mathematical integer. The
existing `calendar-year-zero` bytes are a well-formed canonical endpoint carrier,
but year `0` violates that semantic field domain. Both implementations returned
`domain/positive` under the ordinary 20-second/12-CPU-second/2-GiB attempt budget:

| Case | Complete input | Carrier | Carrier SHA-256 | Wall | Peak RSS | Outcome |
|---|---:|---:|---|---:|---:|---|
| year `0` | 11,165,373 bytes | 16 bytes | `f86e49dfee6ba1fe2e2a5fb2abec34163bdfade3da7ce4fe1495f7009f8b8549` | 287.96 ms | 187,318,272 bytes | A/B `domain/positive` |
| year `1` | 11,165,478 bytes | 17 bytes | `1515f9388807116bb8137c16823d7166fdd722a12a90616167b0137736d85a39` | 409.462 ms | 241,369,088 bytes | A/B accepted |

The values are otherwise identical. Neither attempt approached a safety budget.
The result is semantic-domain rejection, not malformed carrier rejection,
unsupported interpretation, unavailable resources, harness failure or failed
authentication.

## 6. Text, diagnostics and canonical bytes

The Text cases include NUL, line controls, tab, escape, bracketed text that
resembles a pass result and JSON-looking text. The runner never writes that Text
as a terminal/log label. It records UTF-8 SHA-256, byte count, scalar count and
an escaped code-point prefix. A second injection uses the same controls in an
unsupported local test-type name; both codecs return only the fixed
`unsupported/test-type` code. This safe presentation is a view. It neither
normalizes nor replaces the semantic Text, and exact canonical bytes remain the
comparison input.

## 7. Cleanup, residue and retained incidents

No attempt left a live process group, changed the watchdog's FD count, retained
temporary material after cleanup or reported a cleanup error. macOS created an
`xcrun_db` runtime cache inside each isolated `TMPDIR`; the watchdog inventoried
it before cleanup and verified an empty directory afterward. Controlled cases
also observed a permission-test directory and one deliberately stranded inner
transport directory. Both were confined to the attempt root and removed by the
outer cleanup.

Harness qualification preserved these stopped conditions in the development
record rather than converting them into evidence passes:

1. missing pinned external bodies failed closed before the first control;
2. macOS rejected `RLIMIT_AS` in pre-exec; the first published harness retained
   only a peak-RSS postcondition, and review required the active aggregate-RSS
   process-group monitor and controlled cutoff now recorded here;
3. `xcrun_db` was detected as residue, then made an inventoried cleanup input;
4. the first repeated-material candidate was 76,038,201 bytes and stopped before
   codec execution because it exceeded the 32 MiB input budget; the retained
   30,104,554-byte package exercises the same material-copy path within budget;
5. one manifest/literal identifier mismatch stopped the runner; and
6. the first write-limit control failed to flush, so it did not reach the
   intended limit; explicit flush/fsync corrected the control before evidence
   publication.

These are harness-qualification incidents, not representation failures. They
have no fabricated duration/resource records and are not counted among the 30
final attempts.

## 8. Gate disposition and limitations

The three assurance gates remain separate:

- **Abstract-profile approval:** this package found no mapping, field-domain,
  canonicality, injectivity, dependency-completeness or general failure-contract
  defect. Same-author finite evidence does not close this gate.
- **Implementation assurance:** the cases add bounded evidence for these two
  structured implementations on one host. Active aggregate-RSS containment was
  exercised, while hard address-space and process-count platform limits remain
  unsupported; other runtimes, OSes, schedulers and larger valid finite values
  remain untested.
- **Deployment:** this package supplies no real authentication/establishment,
  trust/clock integration, confidentiality policy, crash-remanence guarantee,
  backup/recovery, durable source publication or operational risk acceptance.

Resource ceilings are operational test limits only. They do not narrow the
valid arbitrary integer, rational, Text, list, set or structure domains. Resource
exhaustion remains unavailable/incomplete processing. No Text was normalized,
no canonical byte was changed, no Approved semantic rule was changed and no new
primitive was introduced. No governance escalation is required on this record.

## 9. Reproduction and validation boundary

The targeted evidence command is:

```text
PYTHON=/usr/bin/python3 node experiments/bounded-representation-adversarial/adversarial-evidence.mjs \
  --output experiments/bounded-representation-adversarial/results.json
```

The package test validates manifest closure, every declared repetition, all
seven outcome classes, the year-zero/year-one distinction, incomplete-resource
classification, safe Text presentation, active memory monitoring, the controlled
memory cutoff, FD closure and process/temp aftermath.
Repository documentation validation and its focused test remain separate checks.
The historical 211-test representation matrix and 513-test repository suite are
not rerun merely for repetition; the new package imports the unchanged codecs
and source closure and adds no codec mapping or canonical byte rule.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-09-29 | Add active process-group aggregate-RSS enforcement and its controlled descendant cutoff; align the reported FD count with the regenerated ledger. |
| 0.1 | 2026-09-29 | Add bounded same-author resource/failure evidence with predeclared budgets, isolated A/B controls, external watchdog, calendar-domain oracle and retained controlled failures. |
