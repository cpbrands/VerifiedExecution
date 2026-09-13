---
id: GAP-ANALYSIS-RS-CEL-001-DETERMINISTIC-RULE-EVALUATION
title: Gap Analysis for RS-CEL-001 Deterministic Rule Evaluation
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Analysis
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - RS-CEL-001
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - ADR-RULE-001-002
  - ADR-010
related_documents:
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
  - VE-001
  - VE-014
  - ADR-011
  - VE-002
  - VE-003
  - VE-004
supersedes: null
superseded_by: null
---

# Gap Analysis for RS-CEL-001 Deterministic Rule Evaluation

## 1. Authority and bounded question

This document is **non-normative analysis**. It classifies evidence from the
non-normative
[RS-CEL-001](../reference-scenarios/RS-CEL-001-DETERMINISTIC-RULE-EVALUATION.md)
against current repository authority. It does not modify Rule, Evaluate,
Action, Claim, verification, authorization, Event, Lifecycle, or Receipt
semantics; define a new identifier or result artifact; create an RFC or ADR;
or introduce a primitive.

The bounded question is:

> After VE-CEL-1 Draft v0.2 and RS-CEL-001, does deterministic Rule evaluation
> expose an unresolved semantic or architectural gap, and what is the smallest
> remaining portable representation work?

Passing vectors and validators are evidence. They do not replace governing
specifications and Accepted decisions.

## 2. Authority chain

| Source | Current authority and role |
|---|---|
| [VE-000](../specifications/VE-000-verified-execution-core-specification.md) | Draft core architecture separating policy, authorization, execution, Event history, Lifecycle, and Receipt evidence. |
| [ADR-RULE-001/002](../adrs/ADR-RULE-001-002-VE-CEL-1.md) | Accepted Rule/Evaluate architecture. It requires a canonical Rule object containing exact source and execution-contract fields, a VE-CBOR-1 content digest, immutable explicit inputs, deterministic execution, and the four Evaluate outcomes. |
| [VE-CEL-1 Draft v0.2](../specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md) | Draft authority for the pinned CEL subset, exact Action and eligible-Claim projections, deterministic ordering, resource limits, and outcome mapping. |
| [ADR-010](../adrs/ADR-010-cross-predicate-value-comparison-semantics.md) | Accepted owner of semantic cross-Predicate comparison. VE-CEL-1 may expose a narrower profile without redefining Predicate semantics. |
| [Claim Body Schema Draft v0.2](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md) | Draft representation authority for the four-field canonical Claim body consumed by VE-CEL-1. |
| [Claim Body verification profile Draft v0.1](../specifications/CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE.md) | Draft owner of exact-body cryptographic verification and the external `VerificationContext` interface. |
| [VE-001](../specifications/VE-001-action-specification.md) and its [portable representation profile](../specifications/VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE.md) | Action semantics and the occurrence/content identities projected into the Rule environment. |
| [ADR-011](../adrs/ADR-011-execution-right-core.md) and [VE-014](../specifications/VE-014-execution-right-specification.md) | Accepted architecture and Draft representation for a durable authorization snapshot bound exactly to `(action_id, action_digest)`, without issuance Rule, Claim, or policy provenance. |
| [VE-002](../specifications/VE-002-event-specification.md) | Approved owner of authoritative historical Events, including policy-evaluation and authorization event families when such facts are recorded. |
| [VE-003](../specifications/VE-003-lifecycle.md) | Draft owner of deterministic lifecycle projection, replay, legal transitions, terminality, and retry boundaries. |
| [VE-004](../specifications/VE-004-receipt-specification.md) | Draft owner of portable terminal-resolution summaries derived from authoritative history and execution evidence. |
| [RS-CEL-001](../reference-scenarios/RS-CEL-001-DETERMINISTIC-RULE-EVALUATION.md) | Non-normative evidence for deterministic construction and evaluation from one exact Rule and one explicit eligible multiset. |

No source grants a Reference Scenario or this analysis normative authority.

## 3. Classification summary

| Probe | Classification | Result |
|---|---|---|
| Rule-input portability | **CLOSED FOR CURRENT DRAFT SCOPE** | Same authoritative Action and explicit immutable eligible multiset produce the same two bindings and ordering. |
| Eligible-Claim selection | **CLOSED** | The Evaluate caller/host explicitly fixes the selected multiset; Verify establishes cryptographic acceptability, not admission policy. |
| Rule identity architecture | **CLOSED** | Accepted ADR-RULE-001/002 already requires an exact canonical Rule object and exact-content digest. |
| Concrete Rule identity representation | **REPRESENTATION GAP** | No current specification closes the complete Rule-object field schema, VE-CBOR-1 bytes, digest framing/algorithm, or vectors. |
| Rule versioning | **CLOSED AT ARCHITECTURAL SCOPE / DEPLOYMENT-SPECIFIC POLICY** | `version` and `semantics_version` are Rule fields; release and policy-management meaning does not require a `RuleVersion` primitive. |
| Evaluate-result semantics | **CLOSED** | The four results and their authorization safety boundary are defined. |
| Portable Evaluate-result artifact | **NOT REQUIRED** | Current authorization architecture may invoke and rely on Evaluate directly; a portable proof artifact is not a prerequisite. |
| Compiled Rule artifact portability | **NOT REQUIRED** | Source and profile are authoritative; compiled programs, checked ASTs, and caches are local machinery. |
| Evaluation occurrence identity | **NOT REQUIRED** | No current consumer requires `evaluation_id` or an attempt object. |
| Execution Right Rule/result binding | **NOT REQUIRED** | An Execution Right proves authorization of the exact Action pair, not the complete reasoning chain. |
| Authorization decision | **CLOSED AS A DISTINCT OWNER** | `SATISFIED` may support but does not compel authorization or issuance. |
| Multiple-Rule composition | **DOWNSTREAM POLICY ORCHESTRATION** | Current Evaluate operates on one Rule; no scenario requires a kernel Rule set. |
| Rule legitimacy/provenance | **DEPLOYMENT-SPECIFIC POLICY PROVISIONING** | Deterministic execution does not make the supplied Rule authorized policy. |
| Rule mutation/TOCTOU | **DOWNSTREAM AUTHORIZATION/ISSUANCE ATOMICITY** | The authority must decide and issue against its accepted policy state; later change does not invalidate the durable right. |
| Claim-set provenance | **NOT REQUIRED** | Actual bodies may be retained for audit; the ordering digest remains non-semantic and is not Claim identity. |
| Evaluation replay determinism | **CLOSED** | Exact Rule, Action, eligible Claims, and profile have no clock, randomness, external lookup, or mutable host input. |
| Event | **DOWNSTREAM / OPTIONAL FOR AUDIT** | Event can record authoritative facts but is not required to make Evaluate portable. |
| Receipt | **DOWNSTREAM / NOT RULE-EVALUATION OUTPUT** | Receipt summarizes terminal Action resolution, not pre-execution policy reasoning. |
| Lifecycle | **NOT BLOCKING** | Existing replay, transition, terminality, commitment, and retry owners remain sufficient. |
| VerificationContext | **UPSTREAM / NOT A RULE-EVALUATE GAP** | It remains outside CEL and participates only before explicit eligible-input selection. |
| Predicate | **CLOSED FOR CURRENT DRAFT SCOPE** | PSCID and Predicate-selected value semantics remain visible; unsupported VE-CEL operations are profile errors, not Predicate gaps. |
| Rule verification | **DEPLOYMENT-SPECIFIC / NOT CURRENTLY JUSTIFIED** | No scenario requires a portable signed-Rule profile. |
| Architecture | **NO ARCHITECTURAL GAP** | Existing primitives and ownership boundaries contain every demonstrated concern. |

## 4. Deterministic Rule input

**RULE INPUT PORTABILITY = CLOSED FOR VE-CEL-1 DRAFT V0.2 SCOPE.**

Input construction is a pure function of:

```text
validated canonical Action
+ explicit immutable eligible-Claim multiset
+ retained governing schemas
+ exact VE-CEL-1 profile version
```

VE-CEL-1 closes Action projection, Claim projection, Predicate identity,
recursive FieldForm conversion, integer mapping, missing-member behavior,
content-digest ordering with canonical-body tie-break, duplicate cardinality,
issuer distinction, closed feature validation, and structural resource limits.
RS-CEL-001 supplies independent evidence that all six permutations of the same
three-occurrence multiset produce `[L-B, L-A, C1]`, while the duplicate
extension produces `[L-B, L-A, L-A, C1]`.

The scenario exposes no contradiction that reopens these mechanics.

## 5. Eligible-Claim selection ownership

VE-CEL-1 defines three independent eligibility conditions:

1. the body and governing Predicate Schema conform;
2. an applicable verification profile returns successful verification for the
   exact body under the applicable `VerificationContext`; and
3. the surrounding Evaluate/host context explicitly selects the Claim for the
   invocation.

The ownership boundary is therefore:

```text
Verify
  -> determines exact-body cryptographic acceptability

Evaluate caller / host
  -> applies its trust, evidence, policy, and invocation rules
  -> supplies one explicit immutable selected multiset

Evaluate
  -> validates and deterministically evaluates exactly that supplied input
```

All successfully verified Claims need not enter every evaluation. A host may
legitimately omit one when its surrounding policy does not select it. A host
may not supply a Claim that fails body conformance or applicable verification
and still claim VE-CEL-1 conformance. Two evaluations receiving different
explicit eligible multisets have different Evaluate inputs; their differing
results are not a portability failure.

Portable comparison requires the caller to fix and convey the eligible
multiset as invocation input. It does not require `EligibleClaim`,
`ClaimSelection`, or another primitive.

## 6. Rule identity and exact representation

Accepted ADR-RULE-001/002 already fixes the architectural answer. A portable
Rule carries exact NFC CEL source in a canonical Rule object containing at
least:

```text
id
version
language = VE-CEL-1
source
input_contract
output_contract
semantics_version
```

The whole object is encoded using VE-CBOR-1, and its content digest binds the
exact source and execution contract. Whitespace or comment changes create a
different Rule digest even if CEL behavior is extensionally equivalent.
Accordingly, exact-artifact identity—not semantic-equivalence identity—is the
accepted model.

No current specification, however, closes the exact field types and presence
rules for that full Rule object, its canonical VE-CBOR-1 structure, its digest
frame and algorithm, or positive/rejection vectors. RS-CEL-001 supplies exact
source directly and therefore proves source-level evaluation portability, but
does not fill that missing wire-level closure.

The result is deliberately split:

```text
Rule identity architecture = CLOSED
portable canonical Rule-object/content-digest representation = GAP
```

This is an existing delegated **REPRESENTATION GAP**, not evidence for a new
`RuleIdentity` primitive and not an architectural gap. A later representation
specification must implement the Accepted decision rather than invent
`rule_digest` by analogy or define semantic equivalence classes.

## 7. Rule versioning

Rule `version` and `semantics_version` already belong inside the canonical Rule
object, while `language` selects VE-CEL-1 and the VE-CEL profile fixes the CEL
language snapshot. These values are content whose exact meaning and
representation must be closed by the Rule-object specification.

Kernel-level semantic version negotiation, a global version registry, and a
separate `RuleVersion` object are not demonstrated. Policy owners may assign
and provision Rule versions under their own release practices. Because exact
Rule content is separately bound, version labels need not pretend that two
different objects are identical.

Classification: **CLOSED AT ARCHITECTURAL SCOPE; CONCRETE FIELD
REPRESENTATION REMAINS PART OF THE RULE REPRESENTATION GAP; POLICY RELEASE
MANAGEMENT IS DEPLOYMENT-SPECIFIC.**

## 8. Evaluate-result semantics and representation

The semantic outcomes are closed:

```text
CEL true                       -> SATISFIED
CEL false                      -> NOT_SATISFIED
missing/unknown required input -> INDETERMINATE
CEL/runtime/profile violation  -> EVALUATION_ERROR
```

Only `SATISFIED` may support an affirmative authorization step. It does not
itself authorize execution. The other three results must not authorize.

These outcomes are return values from Evaluate. Current architecture permits
an authorization component to invoke Evaluate directly, receive its result,
and make a distinct authorization decision. It may also independently repeat
evaluation from the exact inputs. No current boundary requires a serialized,
signed, content-addressed, or occurrence-addressed Evaluate-result artifact.

```text
PORTABLE EVALUATION RESULT REPRESENTATION = NOT REQUIRED FOR CURRENT ARCHITECTURE
```

If a future cross-system workflow requires portable proof that a particular
authority evaluated a particular input, that workflow must first demonstrate
its exact consumer and trust requirements. RS-CEL-001 does not do so.

## 9. Compilation artifacts and evaluation occurrences

Two systems may independently parse, validate, type-check, and compile the
same exact Rule source under the pinned VE-CEL-1 profile and obtain the same
semantic result. The normative measurement surface is the pinned parsed
expression before checking/optimization, not a private compiled object.

Therefore bytecode, checked-AST serialization, optimizer output, cache keys,
and compiled CEL objects remain implementation-local.

```text
COMPILATION ARTIFACT PORTABILITY = NOT REQUIRED
```

Likewise, RS-CEL-001 demonstrates no consumer that requires identity for an
individual evaluation execution. Audit may record an Event, source Rule,
inputs, and result without promoting an execution attempt to a new primitive.
Retries of pure evaluation are not execution retries.

```text
EVALUATION OCCURRENCE IDENTITY = NOT REQUIRED
```

No `EvaluationAttempt`, `evaluation_id`, or `attempt_id` is justified.

## 10. Execution Right and authorization decision

ADR-011 and VE-014 fix Execution Right semantic content as exactly:

```text
(action_id, action_digest)
```

An Execution Right records a durable authorization snapshot for that exact
Action pair. It intentionally excludes issuance Claims, Rules, policy
versions, evaluation transcripts, and reasoning. The executor must not rerun
the issuance Rule or reconstruct issuance policy.

The core proposition remains:

> An Execution Right proves authority to execute the exact Action occurrence
> and content pair; it does not prove the complete reasoning chain by which
> authority decided to grant that right.

Adding Rule identity, Claim bodies/digests, or an Evaluate result to VE-014
would couple execution legitimacy to policy-engine internals and contradict
the accepted minimal snapshot boundary. Audit provenance may be retained in
Event history or deployment evidence without changing the right.

The decision sequence is:

```text
Evaluate result
!= authorization decision
!= Execution Right issuance
```

A Rule may return `SATISFIED` while additional authoritative policy denies
issuance. That is legitimate. `SATISFIED` is necessary only where the selected
authorization procedure says it is; it is never sufficient merely by being
returned.

Classification: **EXECUTION RIGHT BINDING = NOT REQUIRED; AUTHORIZATION
DECISION SEPARATION = CLOSED.**

## 11. Multiple Rules and Rule legitimacy

VE-CEL-1 evaluates one supplied Rule at a time. An authority may invoke more
than one Rule and combine their outcomes under an external policy procedure.
No current scenario fixes universal conjunction, disjunction, precedence,
quorum, short-circuit, or conflict semantics for multiple Rules.

This is **DOWNSTREAM POLICY ORCHESTRATION**, not a missing kernel Rule-set
primitive. `PolicySet`, `RuleSet`, and `DecisionGraph` would add semantics not
required by RS-CEL-001.

Deterministic evaluation also does not establish that a Rule is legitimate.
The authority or policy-provisioning environment selects which exact Rule is
authorized for an invocation. Authenticating exchanged policy could become a
future subordinate capability, but no present scenario requires a signed Rule
artifact or global policy trust model.

Classification: **RULE LEGITIMACY/PROVENANCE = DEPLOYMENT-SPECIFIC POLICY
PROVISIONING; PORTABLE RULE VERIFICATION = NOT CURRENTLY JUSTIFIED.**

## 12. Rule mutation and authorization atomicity

Consider:

```text
Rule R evaluates Action A -> SATISFIED
policy configuration changes to R2
an authority decides whether to issue a right for A
```

The authority must make the decision and issue any right against the
authoritative inputs and policy state it accepts for that issuance operation.
It must not trust an unbound mutable cache or an unauthenticated report of an
earlier result. That is authorization/issuance transaction integrity, owned by
the policy engine and Root Authority boundary.

Once issued, the right is the durable authorization snapshot. Later Rule or
policy changes do not retroactively invalidate it, while current attester
acceptance and execution-state admission remain separate.

Classification: **DOWNSTREAM AUTHORIZATION/ISSUANCE ATOMICITY; NO EXECUTION
RIGHT OR LIFECYCLE GAP.**

## 13. Claim-set provenance

The ordering value `D = SHA-256(B)` is profile-local ordering machinery. It is
not Claim identity, evidence, or a reference target. Duplicate canonical
bodies remain separate occurrences in the supplied multiset.

An audit system that needs the evaluated inputs can retain the actual canonical
Claim bodies, their verification evidence where appropriate, the explicit
selection record, and the Rule. RS-CEL-001 does not demonstrate a portable
consumer that cannot function without a `ClaimSet`, `claim_digest`, or
Claim-set digest.

Classification: **CLAIM-SET PROVENANCE = DOWNSTREAM AUDIT CONCERN; NEW
IDENTITY/REPRESENTATION NOT REQUIRED.**

## 14. Evaluation replay determinism

VE-CEL-1 excludes implicit clock, randomness, environment, filesystem,
network, mutable host state, external lookup, and unprofiled host functions.
Decision-relevant external facts must arrive through the Action or selected
Claims. Therefore:

```text
same exact Rule
+ same validated Action
+ same explicit eligible-Claim multiset
+ same VE-CEL-1 profile
-> same Evaluate result
```

This is pure re-evaluation, not replay of execution and not reuse of an
authorization artifact.

```text
EVALUATION REPLAY DETERMINISM = CLOSED
```

## 15. Event, Receipt, and Lifecycle implications

### 15.1 Event

VE-002 already owns authoritative historical Events and includes policy and
authorization event families. An implementation may record that a Rule was
evaluated, an authorization was decided, or a right was issued when those
facts are material to its authoritative history.

RS-CEL-001 does not prove that a new Event schema is required for Evaluate
correctness or portability. Exact evaluation-audit payload closure remains
downstream until a concrete portable consumer requires it.

Classification: **EVENT = DOWNSTREAM / OPTIONAL FOR AUDIT.**

### 15.2 Receipt

VE-004 Receipts summarize terminal Action resolution derived from
authoritative history and execution evidence. They distinguish authorization,
attempt, outcome, and commit. Pre-execution policy reasoning is not a required
Receipt identity field and is not proof of execution.

Classification: **RECEIPT = DOWNSTREAM / NOT REQUIRED FOR RULE-EVALUATION
PORTABILITY.**

### 15.3 Lifecycle

VE-003 owns legal state transitions, event replay, terminal resolution,
commitment boundaries, idempotency implications, duplicate-transition
prevention, and retry safety. A deterministic Rule result can inform a later
authorization Event without becoming lifecycle state of its own.

RS-CEL-001 exposes no missing replay, commitment, retry, or policy-state
binding rule.

```text
LIFECYCLE = NOT BLOCKING
```

## 16. VerificationContext and Predicate implications

Claims reach VE-CEL only after applicable verification and explicit host
selection. Verification artifacts, keys, diagnostics, and
`VerificationContext` data are excluded from the two CEL bindings. No new
portable `VerificationContext` representation is required for deterministic
Rule evaluation.

```text
VERIFICATIONCONTEXT = UPSTREAM / NOT A RULE-EVALUATE GAP
```

Predicate identity remains the exact PSCID carried in every projected Claim.
Predicate schemas continue to own value and comparison semantics. ADR-010
permits governed semantic comparison across different PSCIDs, while VE-CEL-1
Draft v0.2 deliberately does not expose every such operation. An unsupported
cross-Predicate operation returns `EVALUATION_ERROR`; that narrower language
profile is not a Predicate semantic or architectural gap.

Classification: **PREDICATE = CLOSED FOR CURRENT VE-CEL-1 DRAFT V0.2 SCOPE.**

## 17. Attack ownership

| Attack | Correct owner and result | Gap exposed? |
|---|---|---|
| A. Rule substitution | The Evaluate caller/policy-provisioning authority must select the authorized exact Rule. Evaluate deterministically runs what it is given. The accepted canonical Rule content digest provides the intended portable exact-artifact binding once its representation is specified. | **Rule representation gap only; no new identity primitive.** |
| B. Claim omission | The explicit caller selection determines the eligible multiset. Omission is legitimate if it is the selected input; dishonestly misreporting the input is a caller/audit-integrity failure. | **No.** |
| C. Claim injection | Body conformance and Verify reject invalid Claims; the caller's trust/admission policy decides whether a successfully verified Claim is selected. | **No.** |
| D. Rule mutation after evaluation | The Root Authority/policy engine owns atomicity between its accepted policy state, decision, and issuance. A later mutation does not change an issued durable right. | **No.** |
| E. Result substitution | An authorization component should invoke Evaluate within its trusted boundary or independently replay the exact inputs. A false report is boundary/integrity failure, not a valid Evaluate result. | **No current portable-result requirement.** |
| F. Stale-result replay | The authorization authority must not treat an old result as a current decision under changed inputs or policy. Execution Right validity depends on the issued right, not a replayed Evaluate return value. | **No.** |
| G. Different VE-CEL profile/version | The canonical Rule carries language and semantics version; VE-CEL invocation is explicit. Unknown or mismatched profile closure fails rather than selecting “latest.” | **Concrete Rule representation remains to be closed.** |
| H. Same behavior, different Rule text | Accepted semantics treat exact textual artifacts as different Rule content; whitespace/comment changes produce another digest. Semantic equivalence does not create identity. | **No.** |

Every attack has an existing semantic owner. The one incomplete portable
mechanism is the already-decided Rule-object representation.

## 18. Ownership matrix

| Responsibility | Existing owner | Classification |
|---|---|---|
| Rule source and execution contract | Rule under Accepted ADR-RULE-001/002 | **CLOSED architecturally; representation gap remains.** |
| Rule legitimacy | Root Authority / policy provisioning | **DEPLOYMENT-SPECIFIC.** |
| Rule exact-content identity | Canonical Rule object/content digest under ADR-RULE-001/002 | **CLOSED architecturally; concrete representation gap.** |
| Rule version fields | Rule object; policy release management | **CLOSED architecturally / DEPLOYMENT-SPECIFIC release policy.** |
| Eligible Claim selection | Evaluate caller/host | **CLOSED.** |
| Claim cryptographic verification | Verify profile + supplied VerificationContext | **CLOSED FOR CURRENT DRAFT SCOPE.** |
| Claim truth/evidence sufficiency | Issuer, evidence/authentication, trust, and selection policy | **DOWNSTREAM / DOMAIN-SPECIFIC.** |
| Deterministic Rule environment | VE-CEL-1 | **CLOSED FOR CURRENT DRAFT SCOPE.** |
| Rule evaluation and four outcomes | Evaluate + VE-CEL-1 | **CLOSED.** |
| Authorization decision | Root Authority / authorization policy | **CLOSED AS DISTINCT RESPONSIBILITY.** |
| Execution Right issuance | Authorized issuer and VE-014 verification/attester rules | **CLOSED FOR CURRENT DRAFT SCOPE.** |
| Protected execution | Execution Boundary + Adapter | **DOWNSTREAM.** |
| Evaluation audit | Event/evidence or deployment audit records | **DOWNSTREAM / OPTIONAL.** |
| Execution audit | Event history + Lifecycle + Receipt | **DOWNSTREAM.** |

No responsibility is semantically or architecturally unowned.

## 19. True gap and non-gaps

The only true remaining gap exposed by comparing the scenario with Accepted
ADR-RULE-001/002 is:

```text
PORTABLE CANONICAL RULE-OBJECT AND CONTENT-DIGEST REPRESENTATION
= REPRESENTATION GAP
```

It requires exact closure for the already-authorized Rule fields, member
presence/types, VE-CBOR-1 structure, identity/digest construction, profile and
version interpretation, unknown-member behavior, and independent vectors.

The analysis finds no:

- Rule-input semantic gap;
- eligible-selection semantic gap;
- Evaluate-outcome semantic gap;
- authorization or Execution Right semantic gap;
- Event, Receipt, or Lifecycle architectural gap;
- need for portable compiled artifacts;
- need for result, evaluation-occurrence, or Claim-set identity; or
- need for Rule semantic-equivalence identity.

## 20. Primitive pressure

RS-CEL-001 does not require:

- `RuleIdentity`;
- `RuleVersion`;
- `EvaluationResult`;
- `EvaluationAttempt`;
- `evaluation_id` or `attempt_id`;
- `PolicySet`, `RuleSet`, or `DecisionGraph`;
- `Decision` or `AuthorizationDecision`;
- `ClaimSet` or Claim-set digest;
- `EvaluationReceipt`; or
- a Rule registry, policy registry, or version registry.

The future Rule representation implements an already-Accepted Rule content
identity decision. It must not repackage that work as a new kernel primitive.

## 21. Governance

No Accepted architecture or Approved specification must change to close the
identified representation work. Accepted ADR-RULE-001/002 already directs
that the canonical Rule object use VE-CBOR-1 and that its content digest bind
the exact source and execution contract.

```text
RFC REQUIRED = NO
ADR REQUIRED = NO
Approved-specification revision required = NO
new primitive required = NO
```

A later Rule-object representation Draft must remain within that delegation.
If construction instead attempts to change the accepted Rule fields,
identity model, input ownership, result mapping, or Execution Right semantics,
it must stop for governance rather than treating this analysis as authority.

## 22. Recommended next development target

The single highest-leverage next target is:

```text
VE-CBOR-1 canonical Rule object and Rule content-identity representation
under Accepted ADR-RULE-001/002
```

That work should close only the existing Rule artifact boundary: exact field
semantics and types, required/optional/default rules, closed canonical
VE-CBOR-1 structure, exact digest construction, applicability/version rules,
positive and rejection vectors, and independent implementation convergence.

It should not add Rule authenticity, global registration, semantic-equivalence
identity, multiple-Rule orchestration, evaluation-result artifacts,
authorization provenance fields, or Execution Right changes without a later
scenario demonstrating those needs.

## 23. Architectural Decision Tests

Applied to the one recommended representation addition:

| Test | Result |
|---|---|
| Founding Principles consistency | **PASS.** Exact portable Rule content preserves deterministic independent evaluation and keeps policy distinct from authorization and execution. |
| Primitive burden | **PASS.** It implements the existing Rule primitive and Accepted content-digest decision; it introduces no new primitive. |
| Removability | **PASS.** Removing portable Rule bytes leaves local evaluation possible but breaks portable exact-Rule reference and exchange, showing the representation has a bounded purpose. All rejected adjacent additions remain removable without breaking RS-CEL-001. |
| Twenty-year durability | **PASS.** Exact canonical content identity and explicit profile/version fields remain meaningful independently of a particular deployment or compiler. |
| Independent implementability | **PASS subject to the next specification.** The missing finite byte/digest rules and vectors are precisely what that specification must close. |
| Reduced conceptual complexity | **PASS.** One direct Rule representation completes an Accepted object instead of adding result, attempt, policy-set, registry, or provenance abstractions. |

**Architectural Decision Tests: 6/6 PASS.**

## 24. Final conclusion

```text
RULE INPUT PORTABILITY
= CLOSED FOR VE-CEL-1 DRAFT V0.2 SCOPE

EVALUATION REPLAY DETERMINISM
= CLOSED

PORTABLE RULE IDENTITY ARCHITECTURE
= CLOSED BY ACCEPTED ADR-RULE-001/002

PORTABLE CANONICAL RULE-OBJECT / CONTENT-DIGEST REPRESENTATION
= GAP

SEMANTIC GAP
= NONE

ARCHITECTURAL GAP
= NONE

RFC REQUIRED
= NO
```

RS-CEL-001 closes deterministic Rule input and evaluation for the current
Draft scope. The next cadence step is the bounded Rule representation Draft,
not a new primitive and not an expansion of Execution Right, Event, Receipt,
or Lifecycle semantics.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial non-normative Gap Analysis for RS-CEL-001, closing deterministic Rule input/evaluation and identifying the existing delegated canonical Rule-object/content-digest representation gap. |
