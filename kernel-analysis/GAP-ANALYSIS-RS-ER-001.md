---
id: GAP-ANALYSIS-RS-ER-001
title: Gap Analysis for RS-ER-001 Independent Executor
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-02
updated: 2026-09-02
depends_on: []
related_documents:
  - RS-ER-001-INDEPENDENT-EXECUTOR
  - VE-001
  - VE-006
supersedes: null
superseded_by: null
---

# Gap Analysis — RS-ER-001 Independent Executor

## Status and authority boundary

This document is non-normative architectural evidence. It changes no Approved
specification and creates no Execution Right, execution profile, verification
profile, field, wire form, primitive, RFC, or ADR. VE-006 remains Draft and is
used as context, not as authority for a new normative requirement.

## Question

Can a separately implemented executor determine, from an Execution Right plus
stable external verification context, whether it may execute one exact
protected transition without re-running VE Rules, consulting hidden policy, or
calling back to VE?

## Existing authority

VE-001 already supplies the necessary two-layer Action binding:

```text
action_id      — historical Action occurrence
action_digest  — exact semantic Action content
```

VE-001 also states that an authoritative artifact depending on a particular
occurrence carrying particular content binds both values. This rules out
action-only and digest-only Execution Right bindings.

The repository discusses Execution Rights and an Execution Boundary, but it
does not define a closed portable Execution Right structure, authenticated
coverage, verification profile behavior, or fail-closed processing for an
independent executor.

## Minimum surviving candidate

The pressure test leaves this conceptual shape:

```text
ExecutionRight {
  action_id
  action_digest
  verification
}
```

This is the minimum semantic contract, not a field or encoding proposal. A
governed design must specify verification rather than copying Claim verification
by analogy.

| Candidate item | Why it survives | Removal result |
|---|---|---|
| `action_id` | Prevents authorization reuse across distinct occurrences with identical content. | T2 and replay-across-occurrence confusion become possible. |
| `action_digest` | Prevents content substitution under an occurrence identifier. | T1, T4, and content substitution become possible. |
| `verification` | Establishes authentic authorization and authenticated coverage under recognized trust context. | Any presenter could manufacture or alter the right. |

Resource, operation, amount, recipient, and material constraints do not survive
as separate core fields because VE-001 places effect-changing information in
canonical Action content. Executor identity, universal expiry, nonce, replay
state, Rule/Claim references, transcripts, and policy versions also fail the
universal removability test.

## Findings

### Action binding

The necessary binding is `(action_id, action_digest)`. It is sufficient to bind
one historical Action occurrence to exact semantic content, but not by itself
to specify how a separate executor verifies authorization.

The executor receives the canonical Action separately; the right is not an
Action container. It validates the Action, recomputes or verifies
`action_digest`, compares it with the right, and compares `Action.action_id`
with `ExecutionRight.action_id`. It must not trust a claimed digest blindly.

### Resource binding

No universal `resource_ref`, operation, or duplicate constraint set is
justified. Action schema, canonical semantic Action content, `schema_digest`,
and `action_digest` determine the protected semantic transition. Invocation
mechanics belong to the Adapter, protected resource, and transport/protocol
integration. The same Action may be executed through multiple conforming
adapters without different rights.

If identical canonical Action semantics can legitimately produce different
protected semantic transitions, the Action schema is under-specified. An
`execution_profile` field must not repair that ambiguity.

### Executor identity

No core executor identity is required. Resource-specific caller binding,
possession requirements, executor class, or environment restrictions belong in
the applicable resource integration or verification profile when necessary.

### Time

No universal issuance or expiry fields are required. Action content owns
effect-changing time restrictions; a resource profile may require additional
clock semantics. Default expiry would add clock dependence without proving a
portable need.

### Replay and retries

The Action occurrence binding prevents reuse for a different occurrence. It
does not and should not make the right single-use. Multiple attempts may target
one canonical transition, while the authoritative resource/state domain owns
atomic commit, idempotency, and duplicate-commit prevention.

### Uncertain outcome

The right carries no lifecycle mutation. When outcome is uncertain, VE
preserves `UNCERTAIN`; only authoritative outcome evidence establishes commit,
non-commit, or whether retry is safe.

### Verification

An independently verifiable authorization attestation is indispensable. The
protected boundary recognizes an issuer/verifier relationship through stable
trust context. This does not make the right a Root Authority and does not imply
that Claim verification syntax is generic. Exact coverage, algorithms,
credentials, profile identifiers, and fail-closed behavior remain specification
work.

Verification is authenticity/enforceability machinery, not additional Action
authorization semantics. Authenticated coverage binds at least `action_id`,
`action_digest`, Execution Right object/domain identity, and
verification-profile selection. The selector cannot be freely substitutable
outside authenticated semantics.

A cryptographically valid signer is not necessarily authorized to issue
Execution Rights. Recognition belongs to the verification profile plus
provisioned trust context, not a new semantic `issuer_ref`. The right does not
become Root Authority.

### Decision provenance

Rule identifiers and digests, Claim identifiers, Predicate Schema identities,
transcripts, explanations, and policy versions are removable from enforcement.
They may belong in Event, Receipt, authorization record, or audit evidence.
Rules do not travel with the right.

## Tampering results

| Test | Result under minimum candidate |
|---|---|
| T1 same `action_id`, modified content | Rejected by `action_digest` binding. |
| T2 same `action_digest`, different occurrence | Rejected by `action_id` binding. |
| T3 copied to different resource | A substituted resource cannot conformantly execute a different transition when resource identity is Action content; reinterpretation is a schema/conformance defect. |
| T4 amount/recipient/resource changed | Rejected because requested transition differs from bound Action content. |
| T5 presented for different Action | Rejected by the occurrence/content pair. |
| T6 verification altered | Rejected by fail-closed verification. |
| T7 executor substitutes Action interpretation | Non-conformant execution; exact Action semantics and Adapter/resource conformance govern interpretation. Cryptography cannot make a malicious executor conformant. |

## Independent implementation and offline operation

Specifications must define a closed right structure, Action-pair binding,
authenticated coverage, object/domain separation, verification-profile binding,
issuer trust-context behavior, fail-closed processing, and representation and
canonicalization rules. With those specifications and
pre-provisioned trust material, verification can operate offline. Core
semantics need no hidden VE configuration, database lookup, human
interpretation, policy re-evaluation, registry, resolver, or network callback.

Without that contract, two independent executors can interpret the same Action,
right, and trust context differently. Existing architecture therefore names the
role but does not yet meet portable independent implementability.

Conceptually distinct failures include a malformed right, unsupported
verification profile, verification failure, unrecognized or unauthorized
issuer, Action-occurrence mismatch, Action-content/digest mismatch, and
unsupported or ambiguous Action semantics. This evidence does not standardize
error names; every case fails closed.

## Root Authority and evidence boundary

The right attests derived enforceability after VE authorization; it does not
independently create legitimacy or become Root Authority. The protected
resource still decides which authorization attester and verification context it
recognizes.

Receipt, authorization record, evaluation proof, and Execution Right remain
separate. Only enforcement-essential information crosses the protected boundary
in the right.

## Primitive findings

No evidence supports new `Executor`, `ExecutionConstraint`, `Capability`,
`Token`, `Grant`, `PolicySnapshot`, `DecisionProof`, `AuthorizationContext`,
`SignedArtifact`, or `ExecutionProfile` primitives. A narrow Execution
Right specification can own its structure and verification semantics.

A body wrapper is not a semantic requirement. Flat and wrapped forms may carry
the same Action-pair and verification semantics; later representation work may
select one.

### Field-by-field result

| Item | Decision | Six-part test result |
|---|---|---|
| `action_id` | Keep | Necessary occurrence binding; durable and independently comparable without adding a primitive. |
| `action_digest` | Keep | Necessary semantic-content binding; removal permits substitution. |
| `verification` | Keep | Necessary authenticity/enforceability machinery; exact representation remains profile work. |
| `execution_profile` | Remove | Action semantics own the transition and Adapter/resource integration owns mechanics; the field adds ambiguity and complexity. |
| `issuer_ref` | Remove | Authorized signer recognition belongs to verification profile plus trust context. |
| `executor_ref` | Remove | Not universally necessary; resource-specific caller restrictions remain external. |
| `expires_at` | Remove | Adds universal clock dependence; effect-changing time belongs in Action semantics. |
| `resource_ref` | Remove | Duplicates target/resource identity already required in semantic Action content. |
| body wrapper | Representation question only | Adds no semantic meaning; a later canonical representation may select flat or wrapped form. |

## Architectural Decision Test

| Test | Candidate result |
|---|---|
| Founding Principles consistency | Pass. Exact intent, derived authorization, protected execution, and authoritative outcome remain distinct. |
| No unjustified primitive | Pass. The analysis specifies a missing contract around the already-used Execution Right role and rejects adjacent primitives. |
| Necessity/removability | Pass. `action_id`, `action_digest`, and verification survive; `execution_profile`, issuer/executor/resource references, expiry, and replay state do not. A body wrapper is representation-only. |
| Twenty-year durability | Pass. The model is independent of transport, signature algorithm, resource vendor, clock, and online service. |
| Independent implementability | Current architecture fails; the minimum contract would pass once structure, coverage, profile behavior, and failure rules are governed. |
| Reduced total conceptual complexity | Pass. Exact Action binding avoids duplicated resource/constraint/policy models and keeps audit evidence separate. |

## Classification

The gap is broader than Action binding: VE-001 already supplies the correct
occurrence/content pair. It is not an execution-profile gap because Action
semantics govern the transition and Adapters own invocation mechanics. It is
not solely a trust gap because even a valid signature would leave the right's
closed structure, coverage, and fail-closed behavior undefined.

**D. EXECUTION-RIGHT CORE GAP — the minimum portable Action-pair plus
verification contract is unspecified.**

## Governance finding

An RFC is not drafted in this evidence step. The demonstrated gap is mature
enough to justify a focused RFC with this exact question:

> Define the minimum portable Execution Right contract that cryptographically
> binds `(action_id, action_digest)`, authenticates all
> enforceability-affecting content and verification-profile selection,
> recognizes authorized issuers through provisioned trust context, and fails
> closed.

That architectural objective excludes `execution_profile`, `resource_ref`,
`executor_ref`, expiry, policy reasoning, Rule/Claim provenance, replay
lifecycle, mutable or consumable-right semantics, and Adapter mechanics.

**RFC REQUIRED.**
