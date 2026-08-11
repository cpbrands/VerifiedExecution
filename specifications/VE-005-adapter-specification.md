# VE-005 — Adapter Specification

**Version:** 0.1  
**Status:** Draft  
**Category:** Core Primitive Specification  
**Identifier:** VE-005  
**Depends on:** VE-000, VE-001, VE-002, VE-003, VE-004

---

# Abstract

This specification defines the **Adapter**, the architectural primitive responsible for translating canonical Actions into interactions with external systems while preserving the semantics of the Verified Execution Standard.

The Adapter owns translation.

It does not own meaning.

---

# 1. Purpose

The Adapter isolates canonical execution semantics from implementation-specific protocols.

Without Adapters, every external system would redefine execution semantics.

---

# 2. Definition

An Adapter is:

> **A deterministic translation boundary that maps canonical Actions into target-specific operations and converts target-specific observations into canonical execution observations.**

Adapters translate.

They do not authorize.

---

# 3. Architectural Role

The Adapter belongs to the **Execution Layer**.

It connects canonical semantics to external systems.

---

# 4. Responsibilities

An Adapter MUST:

- translate canonical Actions,
- invoke target systems,
- normalize target observations,
- expose target references,
- preserve canonical semantics.

An Adapter MUST NOT:

- redefine Action meaning,
- redefine Lifecycle,
- append authoritative Events,
- bypass the Execution Boundary.

---

# 5. Ownership

The Adapter owns:

- protocol translation,
- serialization,
- transport,
- target authentication,
- target-specific identifiers.

The Adapter does not own:

- policy,
- identity,
- approval,
- lifecycle legality,
- Action identity,
- Receipt derivation.

---

# 6. Determinism

Given identical:

- Action,
- Adapter configuration,
- target capability,

the Adapter SHOULD produce semantically equivalent requests.

---

# 7. Translation Boundary

```text
Canonical Action
        │
        ▼
    Adapter
        │
        ▼
REST

gRPC

SMTP

SQL

Bitcoin RPC

Vendor SDK
```

Only the Adapter understands target-specific protocols.

---

# 8. External References

Adapters MAY produce:

- request_id
- transaction_hash
- message_id
- deployment_id
- job_id

These references MAY appear in Receipts.

They MUST NOT replace Action identity.

---

# 9. Execution Observations

Adapters produce execution observations.

Examples include:

- request accepted,
- request rejected,
- response received,
- timeout,
- protocol error,
- external identifier assigned.

Observations are not authoritative Events.

---

# 10. Event Authority

Execution observations are interpreted by the Execution Boundary.

Only the Execution Boundary creates authoritative Events.

Adapters never append Event history directly.

---

# 11. Isolation Principle

Target-specific behavior MUST NOT leak into the Semantic Layer.

Replacing one Adapter with another MUST NOT change the semantics of:

- Action
- Lifecycle
- Event
- Receipt

---

# 12. Canonical Adapter Interface

Conceptually:

```text
Action
   │
translate()
   │
invoke()
   │
observe()
   │
Execution Observation
```

The specification defines behavior rather than programming interfaces.

---

# 13. Relationship to Other Core Primitives

## Action

Consumes canonical Actions.

## Lifecycle

Does not determine legal state transitions.

## Event

Produces observations consumed by the Execution Boundary.

## Receipt

Supplies references that MAY appear in Receipts.

## Execution Boundary

Remains subordinate to the Execution Boundary.

---

# 14. Conformance Requirements

A conforming Adapter MUST:

- preserve canonical Action semantics,
- communicate only through the Execution Boundary,
- avoid generating authoritative Events,
- expose target references,
- isolate implementation details.

---

# 15. Architectural Decision Test

## ADT-1

Translation is implementation-specific.

## ADT-2

Translation cannot be reduced to another primitive.

## ADT-3

Removing Adapters leaks vendor semantics into the core model.

## ADT-4

Translation boundaries remain durable across technologies.

## ADT-5

Independent implementations remain possible.

## ADT-6

Adapters reduce conceptual complexity by isolating external systems.

---

# 16. Open Questions

- Adapter composition
- Streaming interactions
- Long-running operations
- Capability discovery
- Batch execution

---

# 17. Foundational Rule

> **The Adapter translates meaning into mechanism without changing the meaning.**

The Adapter owns execution mechanics.

Semantic truth remains defined by the core primitives.
