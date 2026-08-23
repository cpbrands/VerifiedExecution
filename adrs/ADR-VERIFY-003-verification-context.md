---
id: ADR-VERIFY-003
title: VerificationContext and Issuer-to-Verifier Binding
version: 0.1
status: Proposed
document_type: Architectural Decision Record
category: Verification
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-22
depends_on:
  - ADR-VERIFY-002
related_documents:
  - RFC-006
supersedes: null
superseded_by: null
---

# ADR-VERIFY-003 — VerificationContext and Issuer-to-Verifier Binding

## Context

ADR-VERIFY-002 defines a Claim verification envelope but intentionally avoids a universal key or identity ontology. A verifier therefore needs context that establishes which verifier or key is valid for the Claim's asserted issuer reference.

## Proposed decision

`VerificationContext` SHALL be the profile-governed input that establishes the binding from `Claim.body.issuer_ref` to an eligible verifier or verification key.

VerificationContext is not embedded in a Claim and is not a new VE semantic primitive. It MUST NOT alter the canonical Claim body or the meaning of a successful verification artifact.

## Scope

This proposal narrows VERIFY-003 to the issuer-to-verifier binding. It does not standardize:

- a global identity system;
- a universal key schema;
- key discovery, rotation, or revocation mechanics;
- policy acceptance of an issuer; or
- the trust source used by a profile.

Those matters remain profile, governance, or future specification work.

## Security requirements

- A verifier MUST NOT infer semantic issuer identity solely from an arbitrary public key.
- The applicable context or profile MUST establish the binding between `issuer_ref` and the verifier or key used.
- Successful cryptographic verification proves provenance and integrity under that context; it does not establish objective truth or policy acceptance.

## Status

Proposed. Adoption requires review with RFC-006 and must not silently revise approved specifications.
