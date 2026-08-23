---
id: "VE-002"
title: "Event Specification"
version: "0.1"
status: "Draft"
document_type: "Core Primitive Specification"
category: "Specification"
author: "Verified Execution Editorial Board"
created: 2026-08-10
updated: 2026-08-10
depends_on:
  - VE-000
  - VE-001
related_documents: []
supersedes: null
superseded_by: null
---
# VE-002 — Event Specification

**Version:** 0.1  
**Status:** Draft  
**Category:** Core Primitive Specification  
**Identifier:** VE-002  
**Depends on:** VE-000, VE-001

---

# Abstract

This specification defines the **Event**, the authoritative historical record of Verified Execution.

Events are immutable.

Events are append-only.

Events never represent opinion.

Events never represent projections.

Events represent facts.

The history of an Action consists entirely of Events.

The current state of an Action is always derived from those Events.

---

# 1. Purpose

The Event exists to answer one question:

> **What actually happened?**

Not:

- What should have happened?
- What does the current database row say?
- What does an operator remember?
- What does the UI currently display?

Only:

> **What became historically true?**

---

# 2. Definition

An Event is:

> **An immutable assertion that a semantically meaningful fact became true during the lifecycle of an Action.**

Three words matter.

Immutable.

Assertion.

Fact.

---

# 3. Properties

Every Event possesses five essential properties.

## Identity

Every Event has exactly one immutable identity.

```
event_id
```

---

## Ownership

Every Event belongs to exactly one Action.

```
action_id
```

An Event MUST NOT belong to multiple Actions.

---

## Type

Every Event expresses one semantic event type.

Examples

```
ACTION_CREATED

VALIDATION_STARTED

VALIDATION_SUCCEEDED

POLICY_EVALUATED

APPROVAL_GRANTED

EXECUTION_STARTED

EXECUTION_COMPLETED

RECEIPT_GENERATED
```

---

## Time

Every Event records sufficient ordering information.

Wall-clock timestamps are valuable.

Ordering is required.

---

## Evidence

Every Event contains or references sufficient information to explain:

> Why this Event exists.

---

# 4. Event Identity

Every Event MUST possess a globally unique

```
event_id
```

Identity never changes.

Events are never recycled.

Events are never merged.

---

# 5. Event Immutability

Once committed,

an Event

MUST NOT

be modified.

Not:

its payload.

Not:

its timestamp.

Not:

its type.

Not:

its references.

Corrections create

new Events.

Never edits.

---

# 6. Historical Truth

Events represent historical truth.

Not current truth.

Example

```
EXECUTION_STARTED
```

remains historically true even if

```
EXECUTION_FAILED
```

occurs later.

History accumulates.

It does not replace itself.

---

# 7. Event Ordering

Every Action possesses one authoritative ordered Event stream.

Example

```
E1

ACTION_CREATED

↓

E2

VALIDATION_STARTED

↓

E3

VALIDATION_SUCCEEDED

↓

E4

EXECUTION_STARTED

↓

E5

EXECUTION_COMPLETED

↓

E6

RECEIPT_GENERATED
```

Ordering MUST be deterministic.

Global ordering across all Actions is NOT required.

Per-Action ordering IS required.

---

# 8. Event Stream

The Event stream is authoritative.

Everything else is derived.

Examples

```
Status

Dashboards

Analytics

Compliance Reports

Receipts

Verification
```

All are projections.

The Event stream is truth.

---

# 9. State Reconstruction

Current Action state MUST be derivable exclusively from Events.

Example

```
Events

↓

Projection

↓

Current Status
```

A mutable database column

```
status = COMPLETED
```

is not authoritative.

It is a cache.

---

# 10. Event Categories

VE-002 recognizes several conceptual Event categories.

Lifecycle Events

```
CREATED

VALIDATED

AUTHORIZED

EXECUTING

COMPLETED
```

---

Execution Events

```
API_CALLED

TARGET_ACCEPTED

TARGET_REJECTED
```

---

Authority Events

```
APPROVAL_REQUESTED

APPROVAL_GRANTED

APPROVAL_DENIED
```

---

Policy Events

```
POLICY_EVALUATED

RULE_FAILED
```

---

Evidence Events

```
RECEIPT_GENERATED

SIGNATURE_CREATED

HASH_COMPUTED
```

These categories organize understanding.

They are not separate primitives.

---

# 11. Required Fields

Every Event MUST contain

```
event_id

action_id

event_type

occurred_at

sequence

spec_version
```

It SHOULD also contain

```
actor

component

payload

references
```

---

# 12. Payload

The payload contains information specific to the Event.

Example

```
POLICY_EVALUATED

payload

policy

Allow Large Transfer

result

ALLOW
```

Payload semantics belong to Event type definitions.

---

# 13. Actor

An Event SHOULD identify

who

or

what

caused it.

Examples

```
Human

AI Agent

Policy Engine

Execution Boundary

Adapter
```

This supports attribution.

---

# 14. Event Relationships

Events may reference

```
previous Event

external identifier

Receipt

Policy

Approval
```

Relationships improve traceability.

They do not alter history.

---

# 15. Event Schema Evolution

Future Event types MAY introduce additional payload.

Existing semantics MUST remain valid.

Unknown fields MUST NOT invalidate an Event.

---

# 16. Forbidden Events

The following SHOULD NOT exist.

```
STATUS_CHANGED
```

Status is a projection.

Instead

```
EXECUTION_COMPLETED
```

creates new state.

---

Likewise

```
ACTION_UPDATED
```

is usually invalid.

Material Action changes require

a new Action.

---

# 17. Event Naming

Event names SHOULD describe

facts.

Not commands.

Good

```
APPROVAL_GRANTED
```

Poor

```
GRANT_APPROVAL
```

The Event records

what happened.

Not what someone wanted.

---

# 18. Unknown Events

Unknown Event types MUST NOT silently alter projections.

Implementations SHOULD ignore unknown Events safely

or

fail clearly

depending upon deployment policy.

---

# 19. Event Integrity

Future specifications will define cryptographic integrity.

VE-002 requires only

semantic immutability.

Not cryptographic immutability.

---

# 20. Duplicate Events

Two Events with identical payloads

may still be distinct.

Example

```
Retry

↓

EXECUTION_STARTED

Retry

↓

EXECUTION_STARTED
```

History records both.

Payload equality

≠

historical identity.

---

# 21. Event Compression

History MUST NOT be rewritten merely to reduce storage.

Older Events MAY be archived.

They MUST remain recoverable.

Compression MUST preserve semantics.

---

# 22. Replay

Given

Action

+

ordered Events

↓

every conforming implementation SHOULD reconstruct identical semantic state.

Replay is a primary design goal.

---

# 23. Event Retention

Historical Events SHOULD outlive

implementations

frameworks

vendors

and storage engines.

The Event model is intended to survive multiple generations of technology.

---

# 24. Conformance

A conforming implementation MUST satisfy

EVT-C01

Every Event has immutable identity.

EVT-C02

Events are append-only.

EVT-C03

Every Event belongs to exactly one Action.

EVT-C04

Action state is reconstructable.

EVT-C05

History is never rewritten.

EVT-C06

Event ordering is deterministic.

EVT-C07

Corrections create new Events.

EVT-C08

Events describe facts.

Not projections.

---

# 25. Open Questions

Should Events support branching histories?

Should Event signatures be first-class?

How should distributed ordering work?

How should partial failures appear?

Should retries receive dedicated Event types?

Should Event payloads become hash-addressable?

These remain intentionally unresolved.

Implementation experience should answer them.

---

# 26. Foundational Rule

Actions express

intent.

Events preserve

history.

History becomes

evidence.

Evidence enables

verification.

Therefore

the integrity of the entire Verified Execution architecture depends upon preserving Event semantics.

If Events cease to represent immutable historical facts,

the platform loses its ability to establish legitimacy.
