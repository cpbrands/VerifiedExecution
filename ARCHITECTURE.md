# Verified Execution Architecture

> **The high-level technical architecture of the Verified Execution platform.**

---

# Purpose

This document explains how the architectural components of Verified Execution interact.

Unlike the VE specifications, this document is **descriptive rather than normative**.

It introduces no new semantics.

Its purpose is to help engineers understand the system before reading the formal specifications.

When conflicts exist between this document and an approved VE specification, **the specification is authoritative.**

---

# The Core Problem

Artificial intelligence is becoming an execution engine.

Execution changes reality.

Reality-changing actions require legitimacy.

Verified Execution inserts a single architectural boundary between machine intent and consequential execution.

```text
Machine Intent

        │

        ▼

Execution Boundary

        │

        ▼

Real-World Consequence
```

Everything in the architecture exists to make that boundary trustworthy.

---

# Architectural Layers

The platform is intentionally layered.

Each layer depends only on lower layers.

```text
Intent

↓

Action

↓

Execution Boundary

↓

Lifecycle

↓

Event History

↓

Receipt

↓

Evidence

↓

Verification
```

Notice:

Evidence is **derived**.

Verification operates on evidence.

Neither is a core primitive.

---

# Core Primitives

Verified Execution currently defines six architectural primitives.

```text
Action

Event

Lifecycle

Execution Boundary

Adapter

Receipt
```

Every other concept should be expressible using these primitives.

Introducing additional primitives requires formal architectural justification.

---

# Action Flow

The canonical execution flow is:

```text
AI Agent

↓

Action

↓

Execution Boundary

↓

Validation

↓

Policy

↓

Authorization

↓

Execution

↓

Adapter

↓

External System

↓

Event History

↓

Receipt

↓

Evidence

↓

Verification
```

Every governed external effect follows this path.

No protected execution path bypasses the Execution Boundary.

---

# Component Responsibilities

## Action

Represents canonical execution intent.

Does not represent:

- permission
- execution
- success

---

## Execution Boundary

Coordinates execution.

Ensures:

- identity
- policy
- lifecycle
- evidence generation

Acts as the primary trust boundary.

---

## Lifecycle

Defines legal progression.

Does not execute.

Does not authorize.

Defines valid state evolution.

---

## Event

Records immutable historical facts.

Events are:

append-only

immutable

ordered

authoritative

---

## Adapter

Translates canonical Actions into target-specific execution.

Owns transport details.

Does not own policy.

Does not own authorization.

---

## Receipt

Represents canonical evidence summary.

Derived from Event history.

Never replaces Event history.

---

# Dependency Graph

```text
Receipt

depends upon

↓

Events

depends upon

↓

Lifecycle

depends upon

↓

Action

depends upon

↓

Execution Boundary
```

Adapters interact with:

```text
Execution Boundary

↓

External Systems
```

---

# Repository Structure

```text
verified-execution-specs

README

MANIFESTO

VISION

FOUNDING_PRINCIPLES

ROADMAP

SPECIFICATION_GOVERNANCE

ARCHITECTURE

/specs

/rfcs

/adrs

/templates
```

Normative specifications live inside:

```text
/specs
```

Governance artifacts live inside:

```text
/rfcs

/adrs
```

---

# Specification Dependency Graph

```text
README

↓

MANIFESTO

↓

VISION

↓

FOUNDING PRINCIPLES

↓

SPECIFICATION GOVERNANCE

↓

VE-000

↓

VE-001

↓

VE-002

↓

VE-003

↓

VE-004

↓

...
```

Each lower specification depends upon those above it.

The dependency direction never reverses.

---

# Trust Boundary

The most important architectural boundary is:

```text
Intent

──────────────

Execution Boundary

──────────────

Consequence
```

Nothing below this line should occur without:

- identity
- policy
- lifecycle
- immutable history

---

# What Is Not Architecture

Verified Execution intentionally avoids specifying:

- programming languages
- cloud providers
- databases
- message buses
- orchestration frameworks
- cryptographic algorithms
- UI technology
- deployment models

Those belong to implementations.

The architecture should survive changes to all of them.

---

# Architectural Invariants

The following properties should remain true regardless of implementation:

- Every governed consequential effect begins as an Action.
- Every governed Action crosses the Execution Boundary.
- Every lifecycle transition is represented by Events.
- History is append-only.
- State is derived from Event history.
- Receipts summarize history.
- Evidence is derived.
- Verification operates on evidence.
- No protected capability bypasses the Execution Boundary.

---

# Future Growth

Future specifications are expected to define:

- Lifecycle
- Receipt
- Adapter
- Execution Boundary
- Identity
- Policy
- Human Authority
- Verification
- Security
- Conformance

None of those specifications should invalidate the architecture presented here.

They should refine it.

---

# Design Objective

The architecture should remain understandable independently of any implementation.

If a future engineer understands this document, they should already understand the major concepts before reading the formal specifications.

The specifications exist to define the rules.

The architecture exists to explain how the rules fit together.
