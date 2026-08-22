---
id: ARCHITECTURE
title: Verified Execution Architecture Overview
version: 1.0
status: Draft
document_type: Architecture Overview
category: Architecture
author: Verified Execution Editorial Board
created: null
updated: 2026-08-22
depends_on:
  - FOUNDING-PRINCIPLES
  - ARCHITECTURE-INDEX
  - VE-000
related_documents:
  - KERNEL-VALIDATION
recovery_note: Original creation date not established from the document.
supersedes: null
superseded_by: null
---

# Verified Execution Architecture

## 1. Authority

This document is a non-normative map. Approved VE specifications are authoritative. `ARCHITECTURE_INDEX.md` determines the status of every architectural generation.

The current specification family defines six primitives:

```text
Action · Event · Lifecycle · Execution Boundary · Adapter · Receipt
```

Kernel validation is testing:

```text
Action · Claim · Rule · Verify · Evaluate
```

The reduced model is not a silent replacement. It may represent a semantic authorization layer that interacts with, rather than deletes, the execution-history primitives.

## 2. Objective

Verified Execution prevents consequential intent from silently becoming consequence:

```text
Intent
  ↓
Canonical Action
  ↓
Execution Boundary
  ├─ validate representation and schema
  ├─ verify applicable Claims
  ├─ evaluate applicable Rules
  ├─ establish constrained execution legitimacy
  ├─ record authoritative Events
  └─ invoke an Adapter
  ↓
Protected external system
  ↓
Authoritative outcome
  ↓
Events and Receipt
```

Only the protected system or another recognized execution authority establishes whether a real-world transition committed. VE does not manufacture authority by describing it.

## 3. Architectural views

Every diagram MUST identify its view: Conceptual, Runtime, Component, Trust Boundary, Deployment, Sequence, or Specification. A runtime sequence MUST NOT be mistaken for a primitive dependency graph.

## 4. Responsibilities

| Element | Owns | Does not own |
|---|---|---|
| Action | Canonical bounded intent | Authorization, execution, success |
| Claim | An assertion and its verification binding | Objective truth or automatic authority |
| Rule | Portable governance predicate | Hidden environmental access |
| Verify | Establishing a Claim under a verification context | Whether the Claim satisfies governance |
| Evaluate | Determining whether established Claims satisfy a Rule for an Action | External commit |
| Event | Immutable authoritative history | Mutable current state |
| Lifecycle | Legal semantic progression derived from Events | Worker/queue state |
| Execution Boundary | Mandatory mediation of governed effects | Being the resource's root authority |
| Adapter | Translation and external invocation | Semantic authorization |
| Receipt | Portable resolved outcome and, where applicable, commit evidence | Creating canonicality |

## 5. Trust boundary

An agent must not possess a credential that bypasses the Execution Boundary for a protected capability. The protected system accepts only execution rights or requests that the boundary is authorized to present.

The resource defines recognized root authorities. VE consumes and verifies authoritative Claims; it does not become an identity provider or universal authority.

## 6. Cryptographic direction

Accepted narrow decisions select VE-CBOR-1 and VE-CEL-1. Full interoperability remains blocked until their specification tasks and test vectors are complete.

Draft RFC-005 defines the candidate relationship among canonical representation, typed digest framing, Digest Reference, ObjectReference, minimal Signature Record, verification-material references, and optional COSE profiles.

COSE is not the sole VE signature representation.

## 7. Invariants

1. Intent is not permission.
2. Permission is not execution.
3. Execution attempt is not authoritative commit.
4. Receipt summarizes authority; it does not create it.
5. Partially parsed or unverified data cannot produce authoritative effects.
6. Action content identity and Action occurrence identity remain distinct.
7. No candidate object may establish the authority required to trust itself.
8. Implementations may differ internally but must preserve approved semantics.

## 8. Change rule

Validation findings change no approved specification by themselves. Semantic adoption requires RFC, ADR, versioned specification revision, and changelog.
