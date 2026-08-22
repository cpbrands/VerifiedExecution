# Verified Execution — Specification Task Register

## Purpose

This register tracks normative specification work required to make
approved architectural decisions independently implementable.

Items in this register are NOT unresolved architectural decisions.

A specification task MUST be escalated to an architectural decision
only if completing the task exposes a contradiction with an existing
architectural decision, Founding Principle, or approved specification.

## VE Kernel Protocol v0.1

### Canonical Encoding

- [ ] SPEC-CBOR-001 — Define exact VE-CBOR-1 schemas for Action, Claim, Rule, and Reference.
- [ ] SPEC-CBOR-002 — Assign exact canonical field labels.
- [ ] SPEC-CBOR-003 — Define exact scaled-integer conventions.

### Rule Execution

- [ ] SPEC-CEL-001 — Pin VE-CEL-1 to a specific CEL semantics release.
- [ ] SPEC-CEL-002 — Define exact Action → CEL value mapping.
- [ ] SPEC-CEL-003 — Define exact verified Claim → CEL value mapping.
- [ ] SPEC-CEL-004 — Define VE-CEL-1 feature/operator allowlist.
- [ ] SPEC-CEL-005 — Define normative Rule resource limits.

### Interoperability

- [ ] SPEC-TEST-001 — Publish cross-language canonicalization/evaluation test vectors.
