---
id: ROADMAP
title: Verified Execution Capability Roadmap
version: 1.0
status: Active
document_type: Roadmap
category: Strategy
author: Verified Execution Editorial Board
created: null
updated: 2026-08-24
depends_on:
  - ARCHITECTURE-INDEX
  - SPECIFICATION-GOVERNANCE
recovery_note: Original creation date not established from the document.
supersedes: null
superseded_by: null
---

# Verified Execution Capability Roadmap

Progress is organized by validated capability, not by dates or presumed future primitives. Policy, identity, evidence, authority, and compliance are capability domains; their appearance here does not promote them into the semantic kernel.

## Stage 0 — Authority coherence (Complete)

**Outcome:** another engineering team can determine what is authoritative in under five minutes.

- complete authority, decision, task, metadata, and scenario indexes;
- eliminate status contradictions and duplicate documents;
- preserve accepted specifications and explicit experimental boundaries.

## Stage 1 — Independently implementable protocol core

**Outcome:** two implementations produce identical accepted bytes and evaluation results.

- finish VE-CBOR-1 schemas, field labels, numeric conventions, and resource bounds;
- finish VE-CEL-1 semantics pin, value mappings, allowlist, and cost limits;
- publish cross-language test vectors;
- resolve Draft RFC-005 without silently selecting untested limits or algorithms.

## Stage 2 — Semantic execution baseline

**Outcome:** the specification family interoperably represents Action history and protected execution.

- reconcile the six-primitive family with the reduced semantic kernel;
- complete Action, Event, Lifecycle, Execution Boundary, Adapter, and Receipt consistency review;
- validate successful, rejected, uncertain, duplicate, cancelled, and multi-step scenarios.

## Stage 3 — Reference implementation

**Outcome:** one minimal implementation demonstrates specification behavior without redefining it.

- canonical parser and validator;
- Claim verification and Rule evaluation;
- append-only Event history and Lifecycle replay;
- Adapter boundary and Receipt derivation;
- conformance test runner.

## Stage 4 — Authority and approval integration

**Outcome:** deployments consume resource-recognized authority without VE becoming an identity system.

- verification-context profiles;
- delegation and approval Claims;
- revocation semantics;
- constrained Execution Rights accepted by protected systems;
- fail-closed authority selection.

## Stage 5 — Independent verification

**Outcome:** an external verifier can validate relevant execution evidence without privileged platform access.

- Digest Reference and Signature Record;
- portable verification artifacts;
- optional COSE and future profiles;
- commit-evidence profiles;
- transparency and historical-integrity mechanisms where justified.

## Stage 6 — Ecosystem and standardization

**Outcome:** multiple independent implementations interoperate.

- stable conformance suites;
- SDKs and Adapter profiles;
- certification process;
- independent governance;
- standards-body submission when implementation evidence supports it.

## Operating cadence

```text
Specification → Scenario → Gap analysis → RFC if needed → ADR → Versioned revision
```

Implementation starts only when it increases evidence about the specification; it never becomes architecture by accident.
