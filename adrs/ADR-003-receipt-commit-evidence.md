# ADR-003 — Receipt Carries Commit Evidence Without Creating Commit

**Status:** Proposed  
**Date:** 2026-08-19  
**Related RFC:** RFC-003  
**Affects:** VE-004 Receipt Specification

---

## 1. Context

Kernel validation established that authorization and execution commitment are distinct.

`Evaluate(...) -> ALLOW` establishes that an Action is permitted under the applicable governance semantics. It does not establish that the external system accepted the Action or that canonical state changed.

VE-004 v0.1 correctly defines Receipt as derived from authoritative history and non-authoritative itself, but its required fields are insufficient to portably establish canonical commit of state transitions.

Trust-transition Actions make this distinction mandatory: multiple transitions may be independently authorized against the same predecessor state while only one becomes canonical.

---

## 2. Decision

VE-004 will be revised so that a Receipt can carry authoritative commit evidence without becoming the source of canonicality.

The following decisions are adopted:

1. `Commit` is an explicit execution concept, not a semantic kernel primitive.
2. Receipt remains derived, immutable, portable, and non-authoritative.
3. Receipt MUST distinguish terminal Lifecycle state from execution outcome.
4. For committed state-transition Actions, Receipt MUST bind the exact predecessor state.
5. For committed state-transition Actions, Receipt MUST bind the accepted successor state or a deterministic derivation reference.
6. Receipt MUST include or verifiably reference an authoritative commit reference.
7. Receipt MUST identify or reference the execution authority or proof mechanism used to establish commitment.
8. That authority MUST be established independently of the Receipt.
9. Uncertain execution MUST NOT advance canonical state history.
10. Execution authority may be scoped over canonical Action data through Claims; `Resource` is not restored as a kernel primitive.

---

## 3. Rationale

The architecture must preserve a strict boundary:

```text
Authorization -> Execution -> Authoritative Commit -> Receipt
```

Receipt summarizes the last step; it does not cause it.

This preserves:

- historical truth;
- external authority;
- auditability;
- replay resistance;
- concurrency correctness;
- interoperability.

---

## 4. Consequences

### Positive

- Canonical trust history becomes reconstructable from portable commit evidence.
- Competing authorized transitions can be distinguished from the actually accepted successor.
- Uncertainty cannot silently become success.
- Receipt remains useful without promoting Commit or Resource into the kernel.

### Costs

- Receipt v0.2 carries more normative structure than v0.1.
- Execution profiles must define the semantics of state commitments and commit references.
- Existing v0.1 Receipts cannot automatically serve as v0.2 canonical-commit proofs.

---

## 5. Rejected Alternatives

- Make Receipt itself authoritative.
- Treat `COMPLETED` as universally equivalent to committed.
- Introduce `Commit` as a kernel primitive.
- Restore `Resource` as the attachment point for execution authority.
- Require every verifier to reconstruct full Event history.

---

## 6. Architectural Decision Test

The decision introduces no new semantic primitive, preserves implementation independence, and reduces ambiguity between authorization and real-world state change.

