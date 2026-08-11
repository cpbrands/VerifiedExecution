# SPECIFICATION_GOVERNANCE.md

# Verified Execution Specification Governance

**Status:** Active  
**Applies to:** All normative Verified Execution specifications, RFCs, ADRs, conformance rules, and architectural governance artifacts  
**Authority:** Founding Principles + approved Core Specification hierarchy

## 1. Purpose

This document defines how Verified Execution specifications are proposed, reviewed, approved, changed, versioned, deprecated, and superseded.

Its purpose is to preserve architectural coherence over time.

Verified Execution is intended to outlive any one implementation, programming language, company, model provider, or infrastructure stack. That requires a governance process in which specifications remain authoritative and architectural changes remain explicit, reviewable, and historically reconstructable.

This document exists to prevent silent architectural drift.

## 2. Governing Principle

Approved specifications are authoritative.

Implementation does not silently redefine architecture.

A change to an approved specification is itself an architectural event and MUST leave a durable governance trail.

Every approved specification change requires:

1. an RFC describing the proposed change,
2. an Architecture Decision Record documenting the reasoning,
3. a revised specification with a version increment,
4. a changelog entry describing the semantic impact.

No approved specification may be changed informally.

## 3. Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative when capitalized.

- **MUST / MUST NOT** — required for conformance with this governance process.
- **SHOULD / SHOULD NOT** — expected unless a documented reason justifies deviation.
- **MAY** — optional.

## 4. Scope

This governance process applies to:

- VE core specifications,
- subordinate VE specifications,
- normative protocol specifications,
- conformance requirements,
- architectural invariants,
- security model specifications,
- formal lifecycle semantics,
- specification versioning rules,
- introduction or removal of architectural primitives.

Purely editorial changes may use a reduced process only when they demonstrably do not alter meaning. If there is reasonable doubt whether a change alters semantics, it MUST be treated as semantic until reviewed.

## 5. Source of Authority

```text
FOUNDING_PRINCIPLES.md
        │
        ▼
SPECIFICATION_GOVERNANCE.md
        │
        ▼
VE-000 Core Specification
        │
        ▼
Subordinate VE Specifications
        │
        ▼
RFCs / ADRs
        │
        ▼
Reference Architecture
        │
        ▼
Reference Implementation
```

Where documents conflict:

1. approved higher-level normative documents take precedence,
2. newer approved versions supersede older versions only where explicitly stated,
3. implementation behavior never overrides an approved specification by accident.

If an implementation conflicts with a specification, either the implementation is wrong or the specification must be formally changed.

## 6. Specification Lifecycle

Every normative specification MUST have one lifecycle state.

### Draft
Under active development. MAY change substantially and MUST NOT claim stable compatibility.

### Review
Structurally complete enough for formal review. SHOULD have resolved foundational ambiguities and MUST identify known risks and open questions.

### Approved
Authoritative for its declared version. Semantic changes MUST follow this governance process.

### Deprecated
Historically valid but no longer recommended for new implementations. MUST identify replacement and migration implications where applicable.

### Superseded
Explicitly replaced by a later approved specification. Historical versions MUST remain accessible.

## 7. Architectural Decision Test

Every significant proposal MUST answer:

1. Is it consistent with the Founding Principles?
2. Does it introduce a new architectural primitive? If yes, the burden of proof is exceptionally high.
3. Can it be removed while preserving the architecture? If yes, it is probably not fundamental.
4. Will it still make sense in twenty years?
5. Can another engineering team implement it independently from the specification?
6. **Does it reduce the total conceptual complexity of the system? If not, it does not belong.**

# 7A. Architectural Maturity

Not every architectural idea deserves immediate inclusion in the Core Specification.

Verified Execution distinguishes between observations, hypotheses, invariants, and axioms.

This prevents promising ideas from becoming permanent architecture before they have earned that status.

## 7A.1 Observation

An Observation is a fact discovered during analysis, implementation, review, or specification work.

Observations describe what appears to be true.

They do not explain why.

Observations MUST NOT become normative architecture by themselves.

Example:

> The first four core primitives appear to describe semantic meaning, while the remaining two interact directly with external execution.

---

## 7A.2 Hypothesis

A Hypothesis proposes an explanation for one or more observations.

Hypotheses SHOULD possess explanatory power.

They SHOULD make predictions.

They remain subject to active attempts at refutation.

Hypotheses MUST NOT be promoted directly into VE-000.

Example:

> The Semantic Layer defines what is true. The Execution Layer determines how those truths are realized without changing their meaning.

---

## 7A.3 Invariant

An Invariant is a hypothesis that has repeatedly survived review, specification development, implementation experience, and deliberate attempts at refutation.

An Invariant describes a property expected to remain true across all conforming implementations.

Before becoming an Invariant, a hypothesis SHOULD demonstrate:

- explanatory value,
- predictive value,
- stability across multiple domains,
- consistency with the Founding Principles,
- consistency with all approved specifications,
- resistance to credible counterexamples.

---

## 7A.4 Axiom

An Axiom is a foundational architectural principle accepted into the Core Specification.

An Axiom represents one of the smallest possible set of assumptions required to understand the standard.

Every normative statement in VE-000 SHOULD either define a core primitive or state an architectural axiom.

Axiom status carries the highest burden of proof.

Changing an Axiom is presumed to be a breaking architectural change unless demonstrated otherwise.

---

## 7A.5 Promotion Criteria

Architectural ideas progress through the following maturity model.

```text
Observation
        │
        ▼
Hypothesis
        │
        ▼
Invariant
        │
        ▼
Axiom
```

Promotion is never automatic.

Each transition requires explicit review.

---

## 7A.6 Burden of Proof

The burden of proof increases at each maturity level.

Observation requires evidence.

Hypothesis requires explanation.

Invariant requires repeated survival under scrutiny.

Axiom requires long-term architectural necessity.

The preferred architectural principle is not the newest.

It is the one that has survived the greatest number of credible attempts to prove it wrong.

---

## 7A.7 Principle of Architectural Humility

Verified Execution prefers delayed certainty over premature certainty.

Elegant ideas are not accepted because they are elegant.

They are accepted because they continue to explain the architecture after repeated attempts to invalidate them.

Architectural maturity is earned through sustained scrutiny, not confidence.

## 8. Complexity Budget

Complexity is a permanent cost.

Every new primitive, component, protocol, service, state, message type, abstraction, database, or dependency MUST justify its existence.

The justification MUST explain why it removes greater complexity elsewhere or is necessary to preserve a system invariant.

Convenience, novelty, or current implementation fashion are insufficient.

## 9. Change Classification

### Class A — Clarification
Changes expression without changing semantics.

Requires:
- RFC,
- ADR,
- version increment,
- changelog entry.

### Class B — Compatible Semantic Extension
Adds semantics while preserving existing valid behavior.

Requires:
- RFC,
- ADR,
- version increment,
- changelog entry,
- documented compatibility behavior.

### Class C — Breaking Semantic Change
Changes existing meaning or invalidates previously conforming behavior.

Requires:
- RFC,
- ADR,
- affected invariants,
- migration impact,
- major version treatment once formal semantic versioning applies,
- changelog entry,
- compatibility analysis,
- explicit proof that the existing architecture cannot satisfy the requirement.

## 10. RFC Process

An RFC proposes a change before an authoritative specification is modified.

Every RFC MUST include:

- Identifier
- Title
- Status
- Context
- Proposed Change
- Motivation
- Alternatives Considered
- Architectural Decision Test
- Compatibility Classification
- Security Impact
- Complexity Impact
- Specification Impact
- Implementation Impact
- Open Questions
- Decision

RFC statuses SHOULD include:

```text
Draft
Review
Accepted
Rejected
Withdrawn
Superseded
```

## 11. Architecture Decision Records

An RFC asks:

> Should we change this?

An ADR records:

> We decided this, for these reasons.

Every accepted specification-changing RFC MUST produce or reference an ADR.

An ADR MUST include:

- Identifier
- Title
- Status
- Context
- Decision
- Alternatives
- Consequences
- Affected Specifications
- Related RFC
- Date

Accepted ADRs MUST remain historically accessible even when superseded.

## 12. Specification Revision Process

After an RFC is accepted and its ADR recorded:

1. revise the affected specification,
2. increment its version,
3. update revision history,
4. add the semantic change to CHANGELOG.md,
5. update conformance tests where applicable.

The revised specification MUST reference the RFC and ADR.

## 13. Changelog Requirements

Every semantic specification change MUST have a changelog entry including, where applicable:

- Date
- Specification
- Old Version
- New Version
- Change Classification
- Summary
- Affected Semantics
- Compatibility Impact
- RFC
- ADR

## 14. Primitive Governance

The current core contains six architectural primitives:

```text
Action
Event
Lifecycle
Execution Boundary
Adapter
Receipt
```

A concept MUST NOT become a primitive merely because it is important.

A proposal for a new primitive MUST demonstrate that:

1. it has independent semantics,
2. existing primitives cannot represent it coherently,
3. treating it as a capability, relationship, Event, constraint, or derived artifact creates greater complexity,
4. it remains meaningful independent of current technology,
5. introducing it reduces total conceptual complexity.

Default assumption:

> No new primitive is required.

## 15. Invariant Governance

Any proposal affecting a system invariant MUST identify whether that invariant is:

```text
Preserved
Refined
Replaced
Removed
```

Replacing or removing an invariant is presumptively a breaking change.

## 16. Approval Standard

A specification SHOULD be Approved only when:

- terminology is internally consistent,
- normative requirements are explicit,
- invariants are identified,
- non-goals are defined,
- failure semantics are addressed,
- security considerations are documented,
- open questions are explicit,
- independent implementation appears possible,
- contradictions with higher-level specifications are resolved.

## 17. Evidence Before Stability

A specification SHOULD NOT become stable `1.0` merely because the document appears complete.

Where behavior depends on implementation reality, stability SHOULD require evidence such as:

- a conforming reference implementation,
- representative use cases,
- failure-mode testing,
- interoperability exercises,
- conformance tests,
- security review.

## 18. Conformance Governance

Normative specifications SHOULD define machine-testable conformance requirements where practical.

Reference implementation behavior MUST NOT become an undocumented conformance requirement.

If interoperability depends on behavior absent from the specification, the specification is incomplete and SHOULD be amended through this governance process.

## 19. Reference Implementation Relationship

The reference implementation exists to validate specifications and expose ambiguity.

Its discovery loop SHOULD be:

```text
Observation
    ↓
RFC
    ↓
ADR
    ↓
Specification Revision
```

Never:

```text
Implementation Changed
    ↓
Specification Quietly Updated
```

## 20. Experimental Work

Experiments MAY intentionally violate current specifications.

Such work MUST be clearly marked experimental and non-conforming.

Experimental results MAY motivate an RFC but MUST NOT silently alter canonical architecture.

## 21. Editorial Changes

Pure editorial changes MAY use a reduced process only if they demonstrably do not alter semantic meaning.

If interpretation could change, the full RFC process MUST be used.

When uncertain, classify upward.

## 22. Emergency Security Changes

Urgency MAY shorten review time.

Urgency MUST NOT erase the governance trail.

An emergency semantic change still requires:

- RFC,
- ADR,
- version increment,
- changelog entry.

## 23. Deprecation and Supersession

Deprecation MUST identify why the element is deprecated, what replaces it, and migration guidance where applicable.

A superseding specification MUST explicitly identify what it supersedes.

Historical specifications MUST remain accessible.

## 24. Repository Structure

Recommended canonical structure:

```text
verified-execution-specs/

SPECIFICATION_GOVERNANCE.md
CHANGELOG.md

/specs
/rfcs
/adrs
/templates
```

Recommended naming:

```text
/specs/VE-000-core.md
/specs/VE-001-action.md
/rfcs/RFC-001-evidence-role.md
/adrs/ADR-001-evidence-role.md
```

## 25. Required Templates

The repository SHOULD include templates for:

```text
Specification
RFC
ADR
Changelog Entry
```

Templates reduce procedural ambiguity but do not replace substantive reasoning.

## 26. First Governance Application

The first expected use of this process is:

```text
RFC-001
Clarify the Architectural Role of Evidence
```

The observation is:

> Evidence is not a seventh architectural primitive. Evidence is derived from immutable Action history, associated context, and Receipt representation.

Because VE-000 already substantially reflects this model, RFC-001 should determine whether a formal clarification is necessary rather than assume one.

No approved specification SHOULD be modified until that RFC is decided.

## 27. Governance Invariant

> **No semantic change to the Verified Execution standard occurs without an inspectable record of what changed, why it changed, and what consequences followed.**

This mirrors the architecture itself: consequential changes require durable evidence.

## 28. Final Rule

The standard should evolve.

It should not drift.

Change is permitted.

Silent change is not.

Every accepted semantic change to an Approved specification must be reconstructable from:

```text
RFC
 │
 ▼
ADR
 │
 ▼
VERSIONED SPECIFICATION
 │
 ▼
CHANGELOG
```

That is the governance model for Verified Execution.
