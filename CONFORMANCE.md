---
id: CONFORMANCE
title: Verified Execution Conformance Specification
version: 1.0
status: Draft

kind: Standard
domain: Ecosystem
topic: Conformance

depends_on:
  - VE-000
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
  - KERNEL_VALIDATION

author: Verified Execution Editorial Board
---

# CONFORMANCE.md

---

# Purpose

This document defines the requirements an implementation MUST satisfy in order to claim conformance with the Verified Execution Standard.

The purpose of conformance is to ensure that independently developed implementations produce equivalent semantic behavior.

Verified Execution standardizes **behavior**, not technology.

---

# Scope

Conformance applies to:

- implementations
- SDKs
- gateways
- execution boundaries
- adapters
- verification services
- testing tools

Programming language, database, operating system, deployment model, and cloud provider are explicitly out of scope.

---

# Core Principle

A conforming implementation is one that preserves the semantic guarantees of the Verified Execution Standard.

Equivalent behavior is required.

Equivalent implementation is not.

---

# Normative Language

The terms

- MUST
- MUST NOT
- REQUIRED
- SHALL
- SHALL NOT
- SHOULD
- SHOULD NOT
- MAY

are interpreted according to RFC 2119.

---

# General Requirements

A conforming implementation MUST:

- preserve Action immutability;
- preserve Event immutability;
- derive Lifecycle exclusively from Events;
- generate Receipts from authoritative history;
- prohibit Adapter authority over semantic decisions;
- require protected execution through the Execution Boundary.

Failure to satisfy any mandatory requirement invalidates conformance.

---

# Conformance Levels

Verified Execution defines four conformance levels.

---

## Level 0 — Semantic Conformance

Purpose

Semantic understanding.

Requirements

Implementation MUST:

- parse canonical Actions;
- replay Lifecycle;
- validate Event ordering;
- derive Receipts.

Execution is NOT required.

Typical implementations:

- documentation
- educational tools
- validators
- simulators

---

## Level 1 — Execution Conformance

Adds:

- Execution Boundary
- Adapter execution

Implementation MUST:

- execute Actions;
- produce authoritative Events;
- derive Receipts.

Protected execution is required.

---

## Level 2 — Governance Conformance

Adds:

- Policy
- Identity
- Approval

Implementation MUST:

- enforce policy;
- evaluate authority;
- require approvals where appropriate.

---

## Level 3 — Enterprise Conformance

Adds:

- interoperability
- distributed verification
- audit APIs
- cryptographic verification
- compliance reporting

This level targets enterprise deployments.

---

# Reference Scenarios

Reference Scenarios define normative behavior.

Every conforming implementation SHALL correctly execute the applicable scenarios.

Current scenarios:

- RS-001
- RS-002
- RS-003
- RS-004

Future scenarios extend conformance coverage.

---

# Replay Requirement

For every executed Reference Scenario:

An implementation MUST derive:

- identical Lifecycle progression;
- equivalent Event semantics;
- equivalent Receipt semantics.

Internal implementation details may differ.

Semantic results SHALL NOT.

---

# Technology Independence

Conformance SHALL NOT depend upon:

- programming language;
- runtime;
- database;
- message bus;
- cloud provider;
- deployment platform.

Only observable semantic behavior is normative.

---

# Adapter Independence

Different Adapters MAY target:

- SMTP
- Gmail
- Kubernetes
- AWS
- Azure
- Banking APIs

Provided that:

canonical semantic behavior remains equivalent.

---

# Receipt Conformance

A Receipt MUST:

- identify the Action;
- identify terminal resolution;
- reference authoritative history;
- avoid asserting information not established by Events.

Receipts are semantic artifacts.

They are not execution logs.

---

# Lifecycle Conformance

Lifecycle SHALL be derived exclusively from Event history.

Implementations SHALL NOT maintain mutable lifecycle state independently.

Replay MUST always reconstruct the same semantic result.

---

# Event Conformance

Events SHALL:

- remain immutable;
- preserve historical truth;
- never be rewritten.

Implementations MAY append Events.

They SHALL NOT modify historical Events.

---

# Execution Boundary Conformance

Protected execution SHALL occur exclusively through the Execution Boundary.

A conforming implementation MUST prevent protected capabilities from bypassing the Boundary.

---

# Conformance Testing

Conformance SHALL be evaluated through the Verified Execution Technology Compatibility Kit (VE-TCK).

The VE-TCK defines:

- canonical inputs;
- expected Event histories;
- expected Lifecycle replay;
- expected Receipts.

Implementations either pass or fail.

---

# Compliance Claims

An implementation SHALL declare:

Example:

Verified Execution

Conformance Level: 1

VE Version:

0.1

Reference Scenarios Passed:

RS-001

RS-002

RS-003

RS-004

---

# Non-Conformance

Implementations SHALL NOT claim Verified Execution conformance if:

- Lifecycle differs from specification;
- Event semantics differ;
- Receipt semantics differ;
- protected execution bypasses the Execution Boundary;
- mandatory Reference Scenarios fail.

---

# Evolution

New Reference Scenarios extend conformance.

Previously conforming implementations remain conforming unless a specification revision explicitly changes normative behavior.

Breaking semantic changes require:

- RFC
- ADR
- specification revision
- changelog

---

# Guiding Principle

> Implementations may differ in construction.

> They must not differ in meaning.

Conformance exists to guarantee that Verified Execution is a semantic standard rather than an implementation framework.
