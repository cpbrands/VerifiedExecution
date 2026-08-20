# RFC-003 — Authoritative Commit Evidence in Receipts

**Status:** Proposed  
**Date:** 2026-08-19  
**Affects:** VE-004 Receipt Specification  
**Proposed target version:** VE-004 v0.2  
**Related validation findings:** KV-F14 through KV-F25

---

## 1. Summary

This RFC proposes strengthening VE-004 so that a Receipt can portably represent not merely the terminal Lifecycle resolution of an Action, but—when the execution domain establishes it—the authoritative fact that a specific Action was accepted against a specific predecessor state and produced, or was accepted as, a specific successor state.

The change preserves the foundational rule that a Receipt summarizes authoritative history and never creates or replaces authoritative history.

No new semantic kernel primitive is introduced.

---

## 2. Problem

VE-004 v0.1 requires:

- `receipt_id`
- `receipt_version`
- `action_id`
- `lifecycle_version`
- `final_state`
- `created_at`

and permits optional terminal, Adapter, and external references.

This is insufficient to prove canonical commit of a state transition.

A conforming v0.1 Receipt may say that an Action reached `COMPLETED`, yet omit:

- the exact predecessor state against which execution committed;
- the accepted successor state, or data sufficient to derive it;
- the authoritative execution authority or proof mechanism;
- the execution-domain commit reference;
- a distinction between authorization, attempted execution, authoritative acceptance, and uncertainty.

This becomes security-critical for trust-transition Actions because multiple Actions may be independently authorized against the same predecessor state while only one becomes the canonical successor.

---

## 3. Validated Requirements

The following requirements were established by kernel validation:

1. Authorization MUST NOT imply execution or commitment.
2. A Receipt MAY carry authoritative commit evidence but MUST NOT create canonicality merely by asserting it.
3. Canonical trust history MUST advance only from authoritative, verifiable commit evidence.
4. Commit evidence MUST bind the exact Action and exact predecessor state.
5. Commit evidence MUST bind the accepted successor state or sufficient deterministic information to derive it.
6. Uncertain execution MUST NOT advance canonical trust history.
7. The authority or proof mechanism establishing commitment MUST derive independently of the Receipt itself.
8. Execution authority MAY be represented through verified Claims applicable to canonical Action scope.
9. A `Resource` primitive is not required for this purpose.

---

## 4. Proposed Changes

### 4.1 Preserve existing Receipt semantics

A Receipt remains:

> An immutable, portable representation of the terminal resolution of an Action, derived from authoritative Event history.

Receipts remain derived and non-authoritative.

### 4.2 Add explicit execution outcome semantics

VE-004 SHOULD distinguish the Action's semantic terminal Lifecycle state from the execution fact summarized by the Receipt.

Introduce required field:

- `execution_outcome`

Minimum values:

- `COMMITTED`
- `NOT_COMMITTED`
- `UNCERTAIN`
- `NOT_APPLICABLE`

`execution_outcome` does not replace `final_state`.

### 4.3 Add state-transition bindings when applicable

For an Action whose authoritative execution semantics include a state transition, a Receipt with `execution_outcome = COMMITTED` MUST bind:

- `predecessor_state`
- `successor_state`

Each MAY be a canonical identifier, digest, or structured commitment defined by the execution profile.

If successor state is deterministically derivable from other authoritative data, a conforming execution profile MAY permit an explicit derivation reference instead of duplicating the full successor commitment.

### 4.4 Add authoritative commit reference

For `execution_outcome = COMMITTED`, the Receipt MUST include or verifiably reference an authoritative commit artifact sufficient to distinguish the accepted transition from a merely attempted, competing, or stale transition.

Introduce:

- `commit_reference`

The interpretation of `commit_reference` is execution-domain specific.

### 4.5 Add execution authority / proof reference

A Receipt that claims authoritative commit MUST identify or reference the authority or verification mechanism under which that commit fact can be established.

Introduce:

- `execution_authority_reference`

This field MUST NOT be interpreted as self-authenticating. Its authority MUST be established independently through the applicable verification context.

### 4.6 Preserve uncertainty

If authoritative execution outcome cannot be established, `execution_outcome` MUST be `UNCERTAIN`.

A Receipt with `execution_outcome = UNCERTAIN` MUST NOT be used to advance canonical state history.

### 4.7 Canonical Action binding

Receipt linkage MUST bind the exact Action identity under the applicable Action canonicalization rules.

`action_id` remains required. Future Action specifications may define stronger digest binding.

---

## 5. Non-Goals

This RFC does not:

- introduce `Commit` as a semantic kernel primitive;
- make Receipt authoritative history;
- define a universal consensus protocol;
- define a universal Resource ontology;
- require VE to decide which institutions are authoritative;
- define domain-specific state formats;
- collapse Receipt into Claim or Event.

---

## 6. Security Properties

### 6.1 Non-self-authorization

A Receipt or commit proof MUST NOT establish, directly or indirectly, the authority required to trust its own issuer or proof mechanism.

### 6.2 Predecessor binding

A commit claim MUST bind the predecessor state against which acceptance occurred.

This prevents stale authorized transitions from being replayed against later state.

### 6.3 Canonicality

A Receipt may summarize canonical commit only when authoritative history or authoritative execution evidence establishes that commit.

### 6.4 Uncertainty

Absence of an error, timeout, submission, or authorization is insufficient evidence of commit.

---

## 7. Compatibility

VE-004 v0.2 is semantically stricter than v0.1.

A v0.1 Receipt remains interpretable as a v0.1 Receipt but MUST NOT automatically be treated as proof of canonical commit under v0.2 unless the required authoritative information is independently available from referenced history.

---

## 8. Alternatives Considered

### A. Add `Commit` as a sixth kernel primitive

Rejected. Commitment is an execution-domain fact, not required to express authorization.

### B. Treat `final_state = COMPLETED` as proof of canonical commit

Rejected. Semantic completion and authoritative external acceptance are not universally identical.

### C. Keep all commit data only in Event history

Rejected as the sole mechanism. VE-004 exists to provide portable verification without requiring every verifier to inspect complete originating history.

### D. Restore `Resource` and bind execution authority to Resource

Rejected. Execution authority can be scoped over canonical Action data through verified Claims.

---

## 9. Architectural Decision Test

1. **Founding principles:** Preserves external authority and non-self-authorization.
2. **New primitive:** None.
3. **Removability:** The added Receipt bindings are necessary for portable canonical-commit verification.
4. **Twenty-year test:** State-transition evidence and independent authority remain implementation-neutral.
5. **Independent implementation:** Required fields and semantics are explicit.
6. **Conceptual complexity:** Reduces ambiguity between authorization, completion, and authoritative commit.

---

## 10. Proposed Disposition

**ACCEPT** and revise VE-004 from v0.1 to v0.2.

