# ARCHITECTURE.md

# Verified Execution Architecture

**Status:** Draft  
**Document Type:** Non-Normative Architectural Overview  
**Project:** Verified Execution  
**Authority:** Explanatory only. Approved VE specifications are normative.

> **Every AI action is provably legitimate.**

---

## 1. Purpose

This document provides the high-level architectural map of the Verified Execution Standard.

It explains how the core concepts relate without redefining their normative semantics.

This document exists to help a new engineer understand the system before reading the formal VE specifications.

If this document conflicts with an approved VE specification, the specification is authoritative.

---

## 2. Architectural View Rule

Every architecture diagram in the Verified Execution project MUST identify the architectural view it represents.

Approved view labels are:

- Conceptual View
- Runtime View
- Component View
- Trust Boundary View
- Deployment View
- Sequence View
- Specification View

An unlabeled diagram is considered architecturally ambiguous and SHOULD NOT be used in normative or explanatory material.

This rule exists to prevent confusion between:

- semantic dependency,
- runtime sequence,
- software interaction,
- deployment topology,
- and trust relationships.

---

# 3. Architectural Objective

Verified Execution establishes a controlled boundary between machine intent and consequential external effects.

The fundamental separation is:

```text
INTENT
  │
  ▼
ACTION
  │
  ▼
EXECUTION BOUNDARY
  │
  ▼
CONSEQUENCE
```

The purpose of the architecture is not to control intelligence.

Its purpose is to ensure that consequential intent cannot silently become real-world consequence.

---

# 4. Core Primitives

The Verified Execution Core currently defines six architectural primitives:

```text
Action
Event
Lifecycle
Execution Boundary
Adapter
Receipt
```

These primitives are intentionally minimal.

Concepts such as:

- Evidence
- Policy
- Identity
- Approval
- Authority
- Verification
- Risk

are important architectural concerns but are not currently core primitives.

A new primitive requires formal architectural justification under the project governance process.

---

# 5. Conceptual View

**Architectural View: Conceptual**

This view describes static semantic relationships.

It does not represent runtime order.

```text
                 ┌─────────────┐
                 │   Action    │
                 └──────┬──────┘
                        │
                        │ progresses under
                        ▼
                 ┌─────────────┐
                 │  Lifecycle  │
                 └──────┬──────┘
                        │
                        │ is evidenced through
                        ▼
                 ┌─────────────┐
                 │    Event    │
                 └──────┬──────┘
                        │
                        │ supports derivation of
                        ▼
                 ┌─────────────┐
                 │   Receipt   │
                 └──────┬──────┘
                        │
                        │ contributes to
                        ▼
                    Evidence
                        │
                        │ supports
                        ▼
                  Verification
```

Important distinctions:

- Action expresses intent.
- Lifecycle defines legal progression.
- Events preserve historical facts.
- Receipt summarizes resolved Action history.
- Evidence is derived from authoritative history and related context.
- Verification operates on evidence.

Evidence and Verification are not core primitives in the current architecture.

---

# 6. Runtime View

**Architectural View: Runtime**

This view describes what happens during governed execution.

```text
AI / Human / Service
        │
        │ proposes
        ▼
  Candidate Request
        │
        │ canonicalized
        ▼
      Action
        │
        ▼
Execution Boundary
        │
        ├── validate
        │
        ├── evaluate applicable authority / policy
        │
        ├── record lifecycle Events
        │
        ├── invoke Adapter
        │
        ▼
      Adapter
        │
        ▼
 External System
        │
        ▼
 External Result
        │
        ▼
Execution Boundary
        │
        ├── append resulting Events
        │
        └── derive Receipt when required
        ▼
      Receipt
```

This is execution sequence.

It MUST NOT be interpreted as the conceptual dependency graph.

---

# 7. Component View

**Architectural View: Component**

This view describes software responsibilities and interactions.

```text
┌──────────────────────────┐
│ Requesting System        │
│ AI / Human / Service     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Execution Boundary       │
│                          │
│ - canonicalization       │
│ - orchestration          │
│ - validation             │
│ - lifecycle coordination │
└──────┬─────────┬─────────┘
       │         │
       │         ├──────────────► Policy / Authority Services
       │
       ├────────────────────────► Event Store
       │
       ├────────────────────────► Receipt Derivation
       │
       ▼
┌──────────────────────────┐
│ Adapter                  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ External System          │
└──────────────────────────┘
```

The exact software decomposition is implementation-specific.

The responsibilities are not.

---

# 8. Trust Boundary View

**Architectural View: Trust Boundary**

This is the central architectural boundary of Verified Execution.

```text
UNTRUSTED OR UNPROVEN INTENT

AI
Human
Workflow
Service

────────────────────────────────────

        EXECUTION BOUNDARY

identity context
authority evaluation
policy evaluation
lifecycle enforcement
event creation
execution mediation

────────────────────────────────────

GOVERNED CONSEQUENCE

email sent
money moved
code deployed
record modified
machine actuated
permission changed
```

The critical invariant is:

> A capability claimed to be governed by Verified Execution MUST NOT remain available through an uncontrolled bypass path.

A system that logs governed execution while preserving a direct uncontrolled execution path has observability, not an effective Execution Boundary.

---

# 9. Specification View

**Architectural View: Specification**

This view describes the normative dependency structure of the standard.

```text
FOUNDING_PRINCIPLES.md
          │
          ▼
SPECIFICATION_GOVERNANCE.md
          │
          ▼
       VE-000
 Core Specification
          │
          ├──────────────┐
          ▼              ▼
       VE-001          VE-002
       Action          Event
          │              │
          └──────┬───────┘
                 ▼
              VE-003
             Lifecycle
                 │
                 ▼
              VE-004
              Receipt
                 │
                 ▼
              VE-005
              Adapter
                 │
                 ▼
              VE-006
       Execution Boundary
```

This diagram represents specification dependency.

It does not imply that runtime execution follows the same order.

Later specifications may depend on multiple earlier specifications.

---

# 10. Model vs Runtime

Verified Execution explicitly distinguishes two classes of architecture.

## 10.1 Static Model

The static model defines:

- what an Action is,
- what an Event is,
- what a Lifecycle is,
- what a Receipt is,
- how semantic relationships are defined.

The static model answers:

> **What exists, and what does it mean?**

## 10.2 Dynamic Runtime

The runtime defines:

- when Actions are accepted,
- how lifecycle transitions occur,
- when Events are appended,
- how Adapters are invoked,
- when Receipts are generated.

The runtime answers:

> **What happens, in what order, and under what conditions?**

A static semantic dependency MUST NOT be inferred from runtime sequence.

A runtime call relationship MUST NOT be mistaken for primitive ownership.

This distinction is permanent.

---

# 11. The Role of the Execution Boundary

The Execution Boundary is a core primitive, but it is different in character from Action, Event, Lifecycle, and Receipt.

It is the architectural mediator of execution.

It operates on Actions.

It coordinates Lifecycle progression.

It causes or records Events.

It invokes Adapters.

It enables Receipt derivation.

It does not conceptually sit "before" or "after" Action in a static dependency chain.

It participates in the runtime flow.

---

# 12. The Role of the Adapter

The Adapter isolates target-specific execution mechanics from canonical Action semantics.

```text
Canonical Intent
      │
      ▼
    Action
      │
      ▼
Execution Boundary
      │
      ▼
    Adapter
      │
      ▼
Vendor / External System
```

The Adapter owns translation and target interaction.

It does not own:

- Action identity,
- policy semantics,
- authority semantics,
- lifecycle semantics,
- Receipt semantics.

---

# 13. The Role of Events

Events are the authoritative historical record.

The Event stream answers:

> What became historically true?

Mutable operational state may exist for performance.

It is a projection.

If projected state conflicts with authoritative Event history, the Event history prevails.

---

# 14. The Role of Receipts

A Receipt is derived from authoritative Action history.

It is not a replacement for Event history.

Conceptually:

```text
Action
+
Relevant Event History
+
Execution Result References
        │
        ▼
     Receipt
```

A Receipt exists to make the resolved outcome of an Action portable, inspectable, and eventually independently verifiable.

---

# 15. The Role of Evidence

Evidence is not a seventh primitive.

Evidence is the durable information produced or referenced by the execution history that supports inspection and verification.

Potential evidence may include:

- Action semantics,
- Event history,
- identity assertions,
- authority records,
- policy evaluations,
- approval records,
- target-system identifiers,
- timestamps,
- hashes,
- signatures,
- Receipts.

The final architectural wording for Evidence remains subject to RFC-001 and its associated ADR.

---

# 16. Runtime Invariants

Regardless of implementation technology:

1. Every governed consequential effect begins as an Action.
2. Every governed Action crosses the Execution Boundary before protected external execution.
3. Material lifecycle progression is represented by Events.
4. Event history is append-only.
5. Authoritative state is reconstructable from Event history.
6. Protected external invocation occurs through Adapter semantics.
7. Receipts MUST NOT contradict authoritative history.
8. Protected capabilities MUST NOT retain uncontrolled bypass paths.
9. Model choice MUST NOT redefine execution semantics.

---

# 17. Architectural Non-Goals

This architecture does not prescribe:

- programming language,
- database engine,
- cloud provider,
- queue technology,
- container runtime,
- orchestration framework,
- UI framework,
- model vendor,
- cryptographic algorithm,
- deployment topology.

These belong to implementation or later protocol specifications unless their semantics become necessary for interoperability.

---

# 18. Repository Map

Recommended structure:

```text
verified-execution-specs/

README.md
MANIFESTO.md
VISION.md
FOUNDING_PRINCIPLES.md
ROADMAP.md
SPECIFICATION_GOVERNANCE.md
ARCHITECTURE.md
CHANGELOG.md

/specs
    VE-000-core.md
    VE-001-action.md
    VE-002-event.md
    ...

/rfcs
    RFC-001-evidence-role.md
    ...

/adrs
    ADR-001-evidence-role.md
    ...

/templates
    specification.md
    rfc.md
    adr.md
    changelog-entry.md

/diagrams
/security
/examples
```

---

# 19. Reading Order

A new contributor SHOULD read the standard in this order:

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
ARCHITECTURE
  ↓
VE-000
  ↓
subordinate VE specifications
```

The purpose is to move from:

```text
why
↓
principles
↓
governance
↓
architecture
↓
normative semantics
```

---

# 20. Architectural Evolution

This document is explanatory.

It SHOULD evolve when the approved standard evolves.

Once this document is approved as the canonical architectural overview, any semantic architectural change reflected here SHOULD trace back to an approved RFC, ADR, and specification revision where required.

Explanatory improvements that do not alter meaning may follow the governance rules for editorial changes.

---

# 21. Architectural Test

Every proposed architectural addition should answer:

1. Is it consistent with the Founding Principles?
2. Does it introduce a new primitive?
3. Can it be removed while preserving the architecture?
4. Will it remain meaningful in twenty years?
5. Can another team implement it independently?
6. Does it reduce total conceptual complexity?

If not, it should not enter the standard.

---

# 22. Canonical Mental Model

The shortest correct mental model of Verified Execution is:

```text
INTELLIGENCE
     │
     │ proposes
     ▼
   ACTION
     │
     ▼
EXECUTION BOUNDARY
     │
     │ mediates
     ▼
 CONSEQUENCE
```

Around that execution:

```text
Lifecycle defines legal progression.

Events preserve what happened.

Adapters isolate external systems.

Receipts summarize resolved history.

Evidence supports verification.
```

The static model and the dynamic runtime are related but distinct.

That distinction is intentional and must remain explicit.
