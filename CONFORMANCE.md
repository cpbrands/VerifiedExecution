---
id: CONFORMANCE
title: Verified Execution Conformance Specification
version: 0.2
status: Draft
document_type: Standard
category: Conformance
author: Verified Execution Editorial Board
created: null
updated: 2026-08-22
depends_on:
  - VE-000
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
related_documents:
  - RS-INDEX
recovery_note: Original creation date not established from the document.
supersedes: CONFORMANCE-0.1
superseded_by: null
---

# Verified Execution Conformance Specification

## 1. Status

This document is Draft. No implementation may claim complete VE conformance until every mandatory dependency and mandatory protocol profile it uses is Approved and accompanied by normative test vectors.

`KERNEL_VALIDATION.md`, pressure tests, and reference scenarios are evidence inputs, not normative dependencies.

## 2. Conformance principle

VE standardizes observable semantic and protocol behavior, not programming language, storage system, operating system, deployment topology, or cloud provider.

Equivalent implementation is not required. Equivalent accepted inputs, decisions, lifecycle projections, evidence bindings, and failure behavior are required within the claimed profile.

## 3. Conformance claim

A conformance claim MUST identify:

- each specification identifier and version;
- each canonical representation profile;
- each Rule profile;
- each verification/signature profile;
- supported object and scenario profiles;
- any permitted implementation limits;
- the exact conformance-vector release passed.

An implementation MUST NOT claim conformance to an incomplete profile.

## 4. Core requirements

A conforming implementation, within its claimed scope, MUST:

1. preserve Action immutability and two-layer identity requirements;
2. reject non-canonical or out-of-profile representations before authoritative use;
3. preserve Event immutability and append-only history;
4. derive Lifecycle state exclusively from authoritative ordered Events;
5. prevent an Adapter from creating semantic authorization;
6. mediate every claimed protected effect through an Execution Boundary;
7. preserve the distinction among authorization, execution attempt, authoritative commit, uncertainty, and Receipt;
8. fail closed when required authority, verification, Rule inputs, or profile support is absent;
9. prevent a candidate object from authorizing the authority required to trust itself;
10. produce sufficient evidence to reproduce the claimed semantic result.

## 5. Conformance classes

### 5.1 Representation conformance

Parses and validates the claimed canonical profile, including canonicality, resource bounds, object schema, and digest computation. This class is unavailable until the corresponding profile is Approved.

### 5.2 Semantic replay conformance

Validates Actions and Events, replays Lifecycle rules, and derives Receipts without performing external execution.

### 5.3 Execution Boundary conformance

Adds protected execution mediation, Adapter invocation, authoritative Event production, and outcome handling.

### 5.4 Governance conformance

Adds Claim verification and deterministic Rule evaluation using declared profiles. It does not make VE an identity provider or policy authority.

### 5.5 Independent verification conformance

Adds portable Digest References, Signature Records, verification-material references, and applicable commit-evidence verification after those mechanisms are Approved.

## 6. Reference scenarios

Only scenarios marked **Normative** in `reference-scenarios/README.md` are mandatory conformance vectors. Placeholder, Draft, Substantive, and Validated scenarios do not become normative merely by existing.

## 7. Failure semantics

Unsupported profile, invalid canonical encoding, failed verification, missing required input, Rule evaluation error, uncertain external outcome, and invalid Event transition MUST remain distinguishable. None may be silently converted into authorization or success.

## 8. Technology independence

Conformance MUST NOT depend on a particular language, database, message bus, model provider, cloud provider, identity provider, or signature envelope unless the conformance claim explicitly names that optional profile.
