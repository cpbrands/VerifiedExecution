---
id: OPEN-DECISIONS
title: Verified Execution Open Decision Register
version: 1.2
status: Active
document_type: Decision Register
category: Governance
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-30
depends_on:
  - SPECIFICATION-GOVERNANCE
related_documents:
  - SPECIFICATION-TASKS
  - RFC-005
supersedes: null
superseded_by: null
---

# Verified Execution Open Decision Register

| ID | Question | State | Authority/evidence | Disposition or next evidence |
|---|---|---|---|---|
| ENC-001 | Canonical serialization family | Resolved | ADR-ENC-001 | VE-CBOR-1 selected; exact profile details are specification tasks. |
| PRED-001 | Predicate Schema external-subject semantics | Resolved | Accepted RFC-007/ADR-007; Approved Predicate Schema Semantic Contract v1.1 and Canonical Representation Profile v1.1 | `subject_domain` and the fourth permitted `subject_constraints` member are authoritative for Predicate Schema semantics and bounded canonicalization. Claim Reference v0.2 remains Draft for separate representation-level conformance. |
| PSCID-001 | Predicate-Schema-specific content identity | Resolved | Accepted RFC-008/ADR-008; Approved DIGEST-001 v0.2 | PSCID-1 remains unchanged; permanent profile and suite `h'02'` bind the approved v1.1 Predicate Schema canonicalization closure. Generic digest infrastructure remains open under RFC-005. |
| RULE-001 | Portable v0.1 Rule representation | Resolved | ADR-RULE-001/002 | VE-CEL-1 selected. |
| RULE-002 | Deterministic Rule execution | Resolved | ADR-RULE-001/002 | Explicit immutable inputs; no hidden side effects. |
| VERIFY-001 | Mandatory algorithms/profiles | Open | RFC-005 Draft | Requires interoperability and lifecycle evidence. |
| VERIFY-002 | Claim verification envelope | Resolved — limited | ADR-VERIFY-002 | `Claim.verification` is `{ profile, artifact }`; COSE is optional and not the sole VE signature representation. |
| VERIFY-003 | VerificationContext and issuer-to-verifier binding | Resolved — limited | ADR-VERIFY-002 | Accepted ADR-VERIFY-002 requires VerificationContext to establish the `issuer_ref` to verifier/key binding; key discovery, rotation, and revocation remain profile work. |
| VERIFY-004 | Revocation semantics | Open | Kernel-validation backlog | Requires scenarios and trust-history analysis. |
| SIG-001 | Native signature frame and record | Open | RFC-005 Draft | Resolve through RFC-005 acceptance gates. |
| REP-001 | Exact Profile-1 universal resource bounds | Open | RFC-005 Draft | Benchmarks, constrained-device review, and DoS testing. |
| DIGEST-001 | Initial mandatory digest suite | Open | RFC-005 Draft | Standards and cryptographic-agility review. |
| SIG-002 | Initial mandatory signature suite | Open | RFC-005 Draft | Decide whether a mandatory suite is required for v0.1. |
| REF-001 | ObjectReference identity and reuse | Partially Resolved — Draft RFC-005 | RFC-005 Draft; pressure tests | Draft RFC-005 proposes embedded `ObjectReference` for portable typed VE objects; exact registries and cross-language vectors remain open. |
| VMAT-001 | Verification-material representation | Open | RFC-005 Draft | Content-addressing, embedding, discovery, and rotation tests. |

## Register rules

- Resolved items link to an Accepted ADR or Approved specification.
- A scoped disposition in a Draft RFC MUST identify its Draft authority
  and remains non-authoritative until accepted or incorporated into an
  Approved specification.
- Narrowed items record excluded scope but are not fully resolved.
- Implementability work belongs in `SPECIFICATION_TASKS.md`.
- Non-normative validation cannot change a resolved item without RFC/ADR disposition.
