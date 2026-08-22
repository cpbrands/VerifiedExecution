# Verified Execution — Architecture Authority Index

## Purpose

This index identifies the authority and status of the Verified Execution corpus. It prevents experimental findings, proposals, decisions, and specifications from being read as interchangeable sources of normative truth.

The six-primitive architecture remains authoritative unless and until it is revised through the repository's RFC, ADR, and specification-governance process.

## Authority order

1. Founding commitments and specification-governance rules.
2. Approved normative specifications.
3. Accepted architectural decisions awaiting or supporting specification integration.
4. Draft normative specifications.
5. Proposed RFCs and ADRs.
6. Non-normative validation, research, patches, and scenarios.

A lower layer MUST NOT silently override a higher layer.

## Current architecture

The authoritative architectural family is:

- Action
- Event
- Lifecycle
- Execution Boundary
- Adapter
- Receipt

The reduced kernel model — Action, Claim, Rule, Verify, and Evaluate — is non-normative validation work. It MAY inform future proposals, but it does not replace, remove, or redefine the six-primitive family without formal adoption.

## Status map

| Layer | Meaning | Current documents |
| --- | --- | --- |
| Foundational authority | Long-lived governing commitments | FOUNDING_PRINCIPLES.md; SPECIFICATION_GOVERNANCE.md |
| Approved normative | Implementable, authoritative specification material | VE-001 v0.2, subject to its stated dependencies |
| Draft normative | Intended to become normative but not yet approved | VE-000; VE-002 through VE-006; CONFORMANCE.md |
| Accepted decisions awaiting integration | Architectural decisions that guide future specification revisions | RFC-001; ADR-001; ADR-004; ADR-ENC-001; ADR-RULE-001/002; ADR-VERIFY-002 (profile-limited) |
| Proposed decisions | Candidates not yet accepted | RFC-002 and RFC-003 as labelled; future RFC work |
| Non-normative validation | Evidence, experiments, scenarios, and historical inputs | KERNEL_VALIDATION.md; kernel-analysis/; reference-scenarios/; VE Kernel patches |

## Decision and task registers

- OPEN_DECISIONS.md records architectural questions, their authority, and disposition.
- SPECIFICATION_TASKS.md records normative specification work remaining after an architectural decision is accepted.

A specification task is not an open architectural decision unless its completion exposes a contradiction with approved authority.

## Integration rule

Accepted ADRs and RFCs are authoritative at their stated scope, but an approved specification remains the implementable source of truth until it incorporates the decision or explicitly references it as normative.
# Verified Execution — Architecture Authority Index

## Purpose

This index identifies the authority and status of the Verified Execution corpus. It prevents experimental findings, proposals, decisions, and specifications from being read as interchangeable sources of normative truth.

The six-primitive architecture remains authoritative unless and until it is revised through the repository's RFC, ADR, and specification-governance process.

## Authority order

1. Founding commitments and specification-governance rules.
2. Approved normative specifications.
3. Accepted architectural decisions awaiting or supporting specification integration.
4. Draft normative specifications.
5. Proposed RFCs and ADRs.
6. Non-normative validation, research, patches, and scenarios.

A lower layer MUST NOT silently override a higher layer.

## Current architecture

The authoritative architectural family is:

- Action
- Event
- Lifecycle
- Execution Boundary
- Adapter
- Receipt

The reduced kernel model — Action, Claim, Rule, Verify, and Evaluate — is non-normative validation work. It MAY inform future proposals, but it does not replace, remove, or redefine the six-primitive family without formal adoption.

## Status map

| Layer | Meaning | Current documents |
| --- | --- | --- |
| Foundational authority | Long-lived governing commitments | FOUNDING_PRINCIPLES.md; SPECIFICATION_GOVERNANCE.md |
| Approved normative | Implementable, authoritative specification material | VE-001 v0.2, subject to its stated dependencies |
| Draft normative | Intended to become normative but not yet approved | VE-000; VE-002 through VE-006; CONFORMANCE.md |
| Accepted decisions awaiting integration | Architectural decisions that guide future specification revisions | ADR-001; ADR-004; ADR-ENC-001; ADR-RULE-001/002; ADR-VERIFY-002 (profile-limited) |
| Proposed decisions | Candidates not yet accepted | RFC-001 through RFC-003 as labelled; future RFC work |
| Non-normative validation | Evidence, experiments, scenarios, and historical inputs | KERNEL_VALIDATION.md; kernel-analysis/; reference-scenarios/; VE Kernel patches |

## Decision and task registers

- OPEN_DECISIONS.md records architectural questions, their authority, and disposition.
- SPECIFICATION_TASKS.md records normative specification work remaining after an architectural decision is accepted.

A specification task is not an open architectural decision unless its completion exposes a contradiction with approved authority.

## Integration rule

Accepted ADRs and RFCs are authoritative at their stated scope, but an approved specification remains the implementable source of truth until it incorporates the decision or explicitly references it as normative.
