# RFC-001 — Clarify the Architectural Role of Evidence

**RFC Identifier:** RFC-001

**Status:** Accepted

**Author:** Verified Execution Editorial Board

**Type:** Architecture

**Created:** YYYY-MM-DD

**Supersedes:** None

---

# Summary

Clarify the architectural role of Evidence within the Verified Execution Standard.

Evidence SHALL NOT become a new core primitive.

Instead, Evidence SHALL be defined as a derived architectural concern composed from authoritative artifacts produced by the existing primitives.

---

# Motivation

Early architectural discussions treated Evidence as a possible seventh primitive.

Further analysis showed that this unnecessarily increased conceptual complexity.

Evidence does not introduce independent semantics.

Instead, Evidence is derived from:

- Action
- Event history
- Receipt
- Identity assertions
- Policy evaluations
- Approval records
- Cryptographic artifacts
- External references

Promoting Evidence to a primitive would duplicate responsibilities already owned elsewhere.

---

# Proposal

The standard SHALL retain six core primitives:

- Action
- Event
- Lifecycle
- Receipt
- Adapter
- Execution Boundary

Evidence SHALL be defined as:

> Information derived from authoritative execution artifacts that supports inspection, verification, audit, or compliance.

Evidence SHALL remain an architectural concern rather than a primitive.

---

# Rationale

This proposal:

- preserves minimality,
- reduces conceptual complexity,
- keeps primitive ownership clear,
- prevents semantic duplication,
- improves long-term extensibility.

---

# Alternatives Considered

## Alternative A

Introduce Evidence as a seventh primitive.

Rejected.

Reason:

Evidence owns no independent lifecycle or semantics.

---

## Alternative B

Merge Evidence into Receipt.

Rejected.

Reason:

Receipts summarize execution.

Evidence includes considerably more than Receipts.

---

## Alternative C

Treat Evidence as a derived architectural concern.

Accepted.

---

# Compatibility

No breaking changes.

No primitive definitions change.

Only architectural clarification.

---

# Impact

Affected specifications:

- VE-000
- VE-004
- VE-006
- ARCHITECTURE.md

Future specifications:

- VE-010 Evidence
- VE-011 Verification

---

# Decision

Accepted.

Evidence remains a derived architectural concern.

Primitive count remains six.

---

# Related ADR

ADR-001 — Architectural Role of Evidence
