# RFC-001 — Clarify the Architectural Role of Evidence

**RFC ID:** RFC-001

**Title:** Clarify the Architectural Role of Evidence

**Status:** Draft

**Author:** Verified Execution Project

**Target Specifications:**

- VE-000 Core Specification v0.1

**Related ADR:**

- ADR-001 (Pending)

**Type:**

Class A — Clarification

---

# Abstract

This RFC proposes clarifying the architectural role of **Evidence** within the Verified Execution architecture.

The proposal does **not** introduce new architectural primitives.

The proposal does **not** alter implementation behavior.

The proposal does **not** change any existing invariants.

Instead, it clarifies that Evidence is **derived** from immutable execution history rather than existing as an independent architectural primitive.

---

# Motivation

During development of VE-002 (Event Specification), the relationship between Events, Receipts, and Evidence became clearer.

The original language in VE-000 correctly avoided defining Evidence as a primitive.

However, the dependency between the concepts remained implicit.

Making this dependency explicit improves architectural clarity while preserving the existing model.

---

# Problem Statement

Several sections of VE-000 describe Evidence as an architectural capability.

Although technically correct, this wording may allow future readers to incorrectly infer that Evidence represents another first-class primitive.

That interpretation would unnecessarily increase conceptual complexity.

The architecture already provides all necessary semantics through:

- Action
- Event
- Lifecycle
- Execution Boundary
- Adapter
- Receipt

No seventh primitive is required.

---

# Current Model

The architecture currently establishes:

```text
Action

↓

Event History

↓

Receipt
```

Evidence is discussed throughout the specification but its exact relationship to these concepts is not explicitly defined.

---

# Proposed Clarification

Evidence should be defined as:

> **The durable information derived from immutable Action history, associated execution context, and Receipt representation that supports inspection and eventual independent verification.**

Evidence is therefore an emergent architectural property.

Not a primitive.

---

# Architectural Dependency

The dependency becomes explicit.

```text
Intent

↓

Action

↓

Ordered Event History

↓

Receipt

↓

Evidence

↓

Verification
```

Each layer depends upon the previous layer.

Removing any earlier layer weakens the layers above it.

---

# Why Evidence Is Not a Primitive

The proposal evaluated whether Evidence should become a seventh primitive.

It does not satisfy the requirements established in the Architectural Decision Test.

Evidence has no independent lifecycle.

Evidence has no independent identity.

Evidence has no independent ownership.

Evidence is produced from existing primitives.

Introducing a new primitive would therefore increase conceptual complexity without introducing new semantic capability.

---

# Architectural Decision Test

## ADT-1

Consistent with the Founding Principles?

**Yes.**

The clarification strengthens the principles of immutable history and evidence-based trust.

---

## ADT-2

Introduces a new primitive?

**No.**

Primitive count remains:

```text
6
```

---

## ADT-3

Can the clarification be removed while preserving the architecture?

Yes.

However, removing it would reduce conceptual clarity.

---

## ADT-4

Will this remain meaningful in twenty years?

Yes.

The clarification depends upon enduring architectural semantics rather than current implementation technology.

---

## ADT-5

Can another engineering team independently implement the architecture?

Yes.

Making the dependency graph explicit should improve independent implementation.

---

## ADT-6

Does it reduce conceptual complexity?

Yes.

It removes ambiguity while preserving the existing architecture.

---

# Alternatives Considered

## Alternative A

Introduce Evidence as a seventh primitive.

Rejected.

Reason:

Evidence possesses no independent semantics requiring primitive status.

---

## Alternative B

Leave VE-000 unchanged.

Rejected.

Reason:

The dependency graph remains unnecessarily implicit.

---

## Alternative C

Clarify Evidence as a derived architectural property.

Accepted (proposed).

---

# Security Impact

None.

No trust assumptions change.

No attack surface changes.

No authorization behavior changes.

---

# Compatibility Impact

None.

Existing implementations remain fully compatible.

No migration required.

---

# Specification Impact

VE-000 MAY receive wording updates in a future revision to explicitly describe Evidence as a derived architectural property.

No normative requirements change.

---

# Implementation Impact

None.

Implementations require no behavioral modification.

---

# Complexity Analysis

The clarification removes an implicit ambiguity.

It introduces no additional primitive, protocol, lifecycle, or component.

Net conceptual complexity decreases.

---

# Open Questions

None introduced by this clarification.

---

# Recommendation

Accept this RFC.

Revise VE-000 in the next compatible clarification release to explicitly define Evidence as a derived architectural property.

Do not introduce a new architectural primitive.

---

# Decision

**Pending**
