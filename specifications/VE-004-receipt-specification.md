---
id: "VE-004"
title: "Receipt Specification"
version: "0.2"
status: "Draft"
document_type: "Core Primitive Specification"
category: "Specification"
author: "Verified Execution Editorial Board"
created: 2026-08-10
updated: 2026-08-20
depends_on:
  - VE-000
  - VE-001
  - VE-002
  - VE-003
related_documents: []
supersedes: null
superseded_by: null
---
# VE-004 — Receipt Specification

**Version:** 0.2  
**Status:** Draft  
**Category:** Core Primitive Specification  
**Identifier:** VE-004  
**Depends on:** VE-000, VE-001, VE-002, VE-003  
**Supersedes:** VE-004 v0.1  
**Change authority:** RFC-003, ADR-003 (pending acceptance)

---

# Abstract

This specification defines the **Receipt**, the canonical, immutable, and portable representation of the terminal resolution of an Action.

A Receipt summarizes authoritative execution history.

A Receipt does not replace Event history and does not create execution truth.

A Receipt enables independent inspection, transport, storage, and future verification without requiring access to the originating execution environment.

When authoritative execution semantics establish that an Action committed a state transition, a Receipt may carry the bindings necessary to portably establish that commit.

---

# 1. Purpose

The purpose of the Receipt is to provide a portable representation of the resolved outcome of an Action.

A Receipt enables independent parties to determine:

- which Action resolved,
- under which specification versions,
- to what terminal Lifecycle state,
- what authoritative execution outcome is established,
- with which authoritative references,
- and, when applicable, against which predecessor state and resulting successor state the Action committed.

The Receipt is optimized for verification rather than execution.

---

# 2. Definition

A Receipt is:

> **An immutable, portable representation of the terminal resolution of an Action, derived from authoritative Event history and, when applicable, authoritative execution evidence.**

Receipts are derived.

They are never authoritative history.

A Receipt MAY represent or carry evidence of authoritative commit.

A Receipt MUST NOT create canonicality merely by asserting that commit occurred.

---

# 3. Architectural Role

The Receipt belongs to the **Semantic Layer**.

It summarizes history.

It does not create history.

Authorization, execution, and authoritative commit are distinct:

```text
Authorization Decision
        │
        ▼
Execution Attempt
        │
        ▼
Authoritative Execution Outcome
        │
        ▼
Receipt
```

An authorization decision is not proof of execution.

An execution attempt is not proof of commitment.

---

# 4. Receipt Is Not Evidence Authority

Receipt ≠ authoritative execution source.

A Receipt contributes to Evidence.

Evidence may additionally include:

- Event history
- signatures
- approval records
- Rule evaluations
- identity assertions
- cryptographic proofs
- ledger inclusion or finality proofs
- database transaction references
- platform attestations
- hardware attestations

The Receipt remains one evidence artifact among many.

---

# 5. Receipt Identity

Every Receipt MUST possess:

- `receipt_id`
- `receipt_version`

Receipt identity is immutable.

Corrections create new Receipts.

Existing Receipts are never modified.

---

# 6. Ownership

Each Receipt belongs to exactly one Action.

```text
Action
   │
   ▼
Receipt
```

VE-004 v0.2 defines one canonical Receipt per Action terminal resolution.

---

# 7. Generation

A Receipt MAY only be derived after an Action reaches a terminal Lifecycle state.

Terminal states are defined by the applicable Lifecycle specification.

A terminal Lifecycle state MUST NOT by itself be interpreted as authoritative external commit.

---

# 8. Execution Outcome

Every Receipt MUST contain `execution_outcome`.

`execution_outcome` describes what authoritative execution truth is established by the history and evidence from which the Receipt is derived.

Canonical values:

- `COMMITTED`
- `NOT_COMMITTED`
- `UNCERTAIN`
- `NOT_APPLICABLE`

## 8.1 COMMITTED

`COMMITTED` means the authoritative execution domain establishes that the Action was accepted according to that domain's commit semantics.

## 8.2 NOT_COMMITTED

`NOT_COMMITTED` means the authoritative execution domain establishes that the Action did not become accepted state.

## 8.3 UNCERTAIN

`UNCERTAIN` means available authoritative history or evidence is insufficient to establish whether commit occurred.

Authorization, submission, timeout, or absence of an error MUST NOT be promoted to `COMMITTED`.

An `UNCERTAIN` Receipt MUST NOT advance canonical state history.

## 8.4 NOT_APPLICABLE

`NOT_APPLICABLE` means the Action's resolution does not have a meaningful external commit fact under the applicable execution profile.

---

# 9. Canonical Fields

Every Receipt MUST contain:

- `receipt_id`
- `receipt_version`
- `action_id`
- `lifecycle_version`
- `final_state`
- `execution_outcome`
- `created_at`

A Receipt with `execution_outcome = COMMITTED` MUST additionally contain or verifiably reference:

- `commit_reference`
- `execution_authority_reference`

For an Action whose authoritative execution semantics include a state transition, a `COMMITTED` Receipt MUST additionally contain or verifiably reference:

- `predecessor_state`
- `successor_state`

An applicable execution profile MAY permit `successor_state` to be represented by a deterministic derivation reference when the successor commitment can be independently reconstructed.

---

# 10. References

A Receipt MAY contain references such as:

- `terminal_event_id`
- `adapter_reference`
- `external_reference`
- `commit_reference`
- `execution_authority_reference`
- `predecessor_state`
- `successor_state`

References improve traceability and verification.

They never replace authoritative Event history or authoritative execution truth.

---

# 11. Commit Evidence

A Receipt MAY summarize an authoritative commit fact only when that fact is established by authoritative history or an authoritative proof mechanism recognized for the applicable Action scope.

A Receipt or commit proof MUST NOT establish, directly or indirectly, the authority required to trust its own issuer or proof mechanism.

Execution authority MUST derive independently from the Receipt.

Execution authority MAY be:

- a recognized executor or platform authority;
- a quorum;
- a ledger finality mechanism;
- a hardware attestation mechanism;
- another independently recognized proof mechanism.

VE-004 does not define which authorities an execution environment must trust.

---

# 12. State-Transition Binding

For a state-transition Action with `execution_outcome = COMMITTED`, the Receipt MUST bind the exact predecessor state against which acceptance occurred.

The Receipt MUST also bind the accepted successor state or sufficient deterministic information to derive the successor commitment.

A stale transition authorized against a previous state MUST NOT be represented as committed against a later state.

---

# 13. Canonical Commit

A Receipt does not make a transition canonical.

Canonicality originates in the authoritative execution domain.

A Receipt may represent canonical commit only when authoritative history or authoritative execution evidence establishes that the Action was accepted according to the domain's canonical commit semantics.

If competing Actions were authorized against the same predecessor state, only the Action established as accepted by the authoritative execution domain may be represented as the committed successor.

---

# 14. Derivation

The canonical derivation is:

```text
Action
+
Authoritative Event History
+
Execution Context
+
Authoritative Execution Evidence, when applicable
        │
        ▼
     Receipt
```

The reverse relationship is prohibited.

A Receipt MUST NOT be used as the sole reason that the history or execution event it summarizes is considered authoritative.

---

# 15. Minimality Principle

A Receipt SHOULD contain the minimum information necessary for independent verification.

Information reconstructable from authoritative history MAY be represented by canonical references or commitments instead of duplicated verbatim.

Minimality MUST NOT omit information required to distinguish authorization, attempted execution, authoritative commit, non-commit, or uncertainty.

---

# 16. Immutability

Receipts are immutable.

Regenerating a Receipt from identical authoritative history and identical applicable execution evidence MUST produce semantically equivalent output.

---

# 17. Normative Artifact A — Canonical Receipt Fields

| Field | Required | Description |
|---|---|---|
| `receipt_id` | Yes | Receipt identity |
| `receipt_version` | Yes | Receipt schema version |
| `action_id` | Yes | Action identity |
| `lifecycle_version` | Yes | Lifecycle specification version |
| `final_state` | Yes | Terminal Lifecycle state |
| `execution_outcome` | Yes | `COMMITTED`, `NOT_COMMITTED`, `UNCERTAIN`, or `NOT_APPLICABLE` |
| `created_at` | Yes | Receipt creation timestamp |
| `terminal_event_id` | Optional | Terminal Event reference |
| `adapter_reference` | Optional | Adapter-generated reference |
| `external_reference` | Optional | External-system reference |
| `commit_reference` | Conditional | Required for `COMMITTED`; authoritative execution commit reference |
| `execution_authority_reference` | Conditional | Required for `COMMITTED`; reference to independently established authority or proof mechanism |
| `predecessor_state` | Conditional | Required for committed state-transition Actions |
| `successor_state` | Conditional | Required for committed state-transition Actions unless deterministic derivation is explicitly permitted |

---

# 18. Normative Artifact B — Canonical JSON

```json
{
  "receipt_version": "0.2",
  "receipt_id": "...",
  "action_id": "...",
  "lifecycle_version": "...",
  "final_state": "COMPLETED",
  "execution_outcome": "COMMITTED",
  "created_at": "...",
  "terminal_event_id": "...",
  "adapter_reference": "...",
  "external_reference": "...",
  "commit_reference": "...",
  "execution_authority_reference": "...",
  "predecessor_state": "...",
  "successor_state": "..."
}
```

Fields not applicable to a Receipt SHOULD be omitted rather than populated with ambiguous sentinel values unless a future serialization specification requires otherwise.

---

# 19. Normative Artifact C — Canonical Hash Input

Cryptographic specifications SHALL define a canonical serialization order.

Identical Receipts MUST produce identical canonical hash inputs.

Any state commitments, Action identifiers, authority references, proof references, or execution references participating in verification MUST have deterministic representation under the applicable specification or execution profile.

---

# 20. Relationship to Other Core Primitives

## Action

A Receipt summarizes one Action.

Receipt linkage MUST preserve exact Action identity under the applicable Action canonicalization rules.

## Lifecycle

A Receipt records terminal Lifecycle resolution.

Lifecycle terminal state and execution outcome are distinct.

## Event

A Receipt is derived from authoritative Event history.

## Adapter

A Receipt MAY include Adapter-generated references.

An Adapter reference is not automatically authoritative commit evidence.

## Execution Boundary

The Execution Boundary derives canonical Receipts from authoritative history and applicable execution evidence.

The Execution Boundary MUST NOT manufacture execution authority.

---

# 21. Conformance Requirements

A conforming Receipt implementation MUST:

- preserve Action identity;
- preserve Lifecycle version;
- preserve terminal state;
- preserve explicit execution outcome;
- derive Receipts only from authoritative history and applicable authoritative execution evidence;
- maintain immutability;
- represent uncertainty explicitly when commit cannot be established;
- never infer commit solely from authorization, submission, timeout, or absence of error;
- for committed state-transition Actions, bind the exact predecessor state;
- for committed state-transition Actions, bind the successor state or permitted deterministic derivation;
- for committed Actions, bind an authoritative commit reference;
- for committed Actions, identify or reference the independently established execution authority or proof mechanism;
- never treat the Receipt as the source of the authority required to establish its own execution claims.

---

# 22. Architectural Decision Test

## ADT-1

Receipts preserve portable proof.

## ADT-2

Receipts cannot be reduced to Events because they summarize rather than preserve history.

## ADT-3

Removing Receipts forces every verifier to inspect complete Event and execution-evidence history.

## ADT-4

Portable commit evidence is independent of implementation technology.

## ADT-5

Receipt semantics are independently implementable when applicable execution profiles define their commit references and state commitments.

## ADT-6

Receipts reduce verification complexity while preserving the distinction between authorization and authoritative execution truth.

---

# 23. Compatibility With v0.1

VE-004 v0.1 Receipts remain valid as v0.1 artifacts.

A v0.1 Receipt MUST NOT automatically be interpreted as v0.2 proof of canonical commit unless the additional v0.2 requirements are independently established from authoritative referenced history or evidence.

---

# 24. Open Questions

- Should multiple Receipt classes exist?
- Should partial Receipts be standardized?
- Should Receipt expiration exist?
- Should Action specifications require a canonical Action digest in addition to `action_id`?
- Should Trust Context or derived trust-state digest be bound directly into Receipt?
- Should execution profiles define a common state-commitment interface?

---

# 25. Foundational Rules

> **A Receipt summarizes history. It never replaces history.**

> **A Receipt may carry proof that reality changed. It never makes reality changed by saying so.**

Authoritative truth remains in authoritative Event history and the applicable execution domain.

