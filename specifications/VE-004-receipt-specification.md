# VE-004 — Receipt Specification

**Version:** 0.1  
**Status:** Draft  
**Category:** Core Primitive Specification  
**Identifier:** VE-004  
**Depends on:** VE-000, VE-001, VE-002, VE-003

---

# Abstract

This specification defines the **Receipt**, the canonical, immutable, and portable representation of the terminal resolution of an Action.

A Receipt summarizes authoritative execution history.

A Receipt does not replace Event history.

A Receipt enables independent inspection, transport, storage, and future verification without requiring access to the originating execution environment.

---

# 1. Purpose

The purpose of the Receipt is to provide a portable representation of the resolved outcome of an Action.

A Receipt enables independent parties to determine:

- which Action resolved,
- under which specification versions,
- to what terminal lifecycle state,
- with which authoritative references.

The Receipt is optimized for verification rather than execution.

---

# 2. Definition

A Receipt is:

> **An immutable, portable representation of the terminal resolution of an Action, derived from authoritative Event history.**

Receipts are derived.

They are never authoritative history.

---

# 3. Architectural Role

The Receipt belongs to the **Semantic Layer**.

It summarizes history.

It does not create history.

---

# 4. Receipt Is Not Evidence

Receipt ≠ Evidence.

A Receipt contributes to Evidence.

Evidence may additionally include:

- Event history
- signatures
- approval records
- policy evaluations
- identity assertions
- cryptographic proofs

The Receipt remains one evidence artifact among many.

---

# 5. Receipt Identity

Every Receipt MUST possess:

- receipt_id
- receipt_version

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

VE-004 v0.1 defines one canonical Receipt per Action.

---

# 7. Generation

A Receipt MAY only be derived after an Action reaches a terminal Lifecycle state.

Terminal states include:

- COMPLETED
- FAILED
- REJECTED
- CANCELLED
- EXPIRED

---

# 8. Canonical Fields

Every Receipt MUST contain:

- receipt_id
- receipt_version
- action_id
- lifecycle_version
- final_state
- created_at

---

# 9. References

A Receipt MAY contain references such as:

- terminal_event_id
- adapter_reference
- external_reference

These references improve traceability.

They never replace authoritative Event history.

---

# 10. Derivation

The canonical derivation is:

```text
Action
+
Authoritative Event History
+
Execution Context
        │
        ▼
     Receipt
```

The reverse relationship is prohibited.

---

# 11. Minimality Principle

A Receipt SHOULD contain the minimum information necessary for independent verification.

Information reconstructable from authoritative history SHOULD NOT be duplicated.

---

# 12. Immutability

Receipts are immutable.

Regenerating a Receipt from identical authoritative history MUST produce semantically equivalent output.

---

# 13. Normative Artifact A — Canonical Receipt Fields

| Field | Required | Description |
|--------|----------|-------------|
| receipt_id | Yes | Receipt identity |
| receipt_version | Yes | Receipt schema version |
| action_id | Yes | Action identity |
| lifecycle_version | Yes | Lifecycle specification version |
| final_state | Yes | Terminal lifecycle state |
| created_at | Yes | Receipt creation timestamp |
| terminal_event_id | Optional | Terminal Event reference |
| adapter_reference | Optional | Adapter-generated reference |
| external_reference | Optional | External system reference |

---

# 14. Normative Artifact B — Canonical JSON

```json
{
  "receipt_version": "0.1",
  "receipt_id": "...",
  "action_id": "...",
  "lifecycle_version": "0.1",
  "final_state": "COMPLETED",
  "created_at": "...",
  "terminal_event_id": "...",
  "adapter_reference": "...",
  "external_reference": "..."
}
```

---

# 15. Normative Artifact C — Canonical Hash Input

Cryptographic specifications SHALL define a canonical serialization order.

Identical Receipts MUST produce identical canonical hash inputs.

---

# 16. Relationship to Other Core Primitives

## Action

A Receipt summarizes one Action.

## Lifecycle

A Receipt records terminal Lifecycle resolution.

## Event

A Receipt is derived from authoritative Event history.

## Adapter

A Receipt MAY include Adapter-generated references.

## Execution Boundary

The Execution Boundary derives canonical Receipts.

---

# 17. Conformance Requirements

A conforming Receipt implementation MUST:

- preserve Action identity,
- preserve Lifecycle version,
- preserve terminal state,
- derive Receipts only from authoritative history,
- maintain immutability.

---

# 18. Architectural Decision Test

## ADT-1

Receipts preserve portable proof.

## ADT-2

Receipts cannot be reduced to Events because they summarize rather than preserve history.

## ADT-3

Removing Receipts forces every verifier to inspect complete Event history.

## ADT-4

Portable proof is independent of implementation technology.

## ADT-5

Receipt semantics are independently implementable.

## ADT-6

Receipts reduce verification complexity.

---

# 19. Open Questions

- Should multiple Receipt classes exist?
- Should partial Receipts be standardized?
- How should cryptographic commitments be represented?
- Should Receipt expiration exist?

---

# 20. Foundational Rule

> **A Receipt summarizes history. It never replaces history.**

Authoritative truth remains the Event history.
