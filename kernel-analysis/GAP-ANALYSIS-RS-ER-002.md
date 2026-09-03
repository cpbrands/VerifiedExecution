---
id: GAP-ANALYSIS-RS-ER-002
title: Gap Analysis for RS-ER-002 Temporal Authorization
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-03
updated: 2026-09-03
depends_on: []
related_documents:
  - RS-ER-002-TEMPORAL-AUTHORIZATION
  - RS-ER-001-INDEPENDENT-EXECUTOR
  - VE-001
supersedes: null
superseded_by: null
---

# Gap Analysis — RS-ER-002 Temporal Authorization

## Status and authority boundary

This is non-normative gap-analysis evidence. It changes no RFC, ADR, Approved
specification, Action field, Execution Right field, trust model, lifecycle,
encoding, or primitive.

## Tested question

Does portable Execution Right enforcement require a universal temporal field,
live policy/delegation revalidation, trusted issuance time, or core revocation
system?

## Finding

The minimum surviving model is P3:

```text
authorization decision = immutable snapshot at issuance
artifact acceptance     = current verifier-local trust in the attester/profile
protected transition    = current authoritative execution/state-domain commit
```

This preserves offline enforcement without treating an old signature as
unconditional authority and without asking the executor to become a Rule
engine.

## Case results

### Baseline

A valid right presented four hours after issuance remains executable when
nothing relevant changed. Delay alone has no semantic effect.

### Policy change

Later policy controls future authorization decisions. It does not
retroactively change the earlier decision. Live application would require Rule
re-evaluation and hidden/current policy input.

### Claim or delegation revocation

Revoking an underlying Claim or delegation prevents later issuance based on
that authority. It does not inherently invalidate rights already issued from a
valid decision.

### Stolen right

A copied right remains enforceable if its Action has no temporal constraint
and verifier-local trust still accepts the attester. That durable exposure is
the explicit cost of portable offline snapshot authorization. A deployment
that rejects the cost includes an effect-changing time condition in the Action
or changes its local acceptance policy.

### Durable offline authorization

Disaster-recovery execution months later while disconnected is legitimate.
Mandatory short expiry or a live revocation service would incorrectly prevent
it.

### Emergency revocation

Universal immediate revocation of every outstanding right is not a VE core
guarantee. Resource refusal, local trust updates, denylist mechanisms, or status
services may be governed by deployments or later profiles, but none is selected
or elevated here.

### Action time versus authorization time

`execute before T` changes whether the protected transition may occur. VE-001's
classification rule makes that canonical Action content. Calling the same
constraint "authorization expires at T" does not make it irreducibly
right-specific; placing it only in the right would create identical Actions
with different permitted transitions.

No independent core authorization-age field survives.

### TOCTOU

Authorization-context changes do not retroactively alter the snapshot.
Protected-resource state changes remain the authoritative execution/state
owner's responsibility, including atomic validation and commit. Neither case
justifies re-running VE Rules at execution.

## Credential and trust findings

Cryptographic credential status is separate from revocation of the underlying
policy or delegation. Even under snapshot authorization, the executor applies
its current verifier-local trust configuration to the artifact and signer.

- A signer removed after legitimate issuance may cause later presentation to
  be rejected under current local trust.
- A credential discovered to have been compromised at issuance cannot be given
  historical validity without a trusted issuance time and historical credential
  policy.
- The minimum right does not provide trustworthy issuance time, so core
  verification does not claim retrospective credential validation.

This does not require RFC-011 to solve PKI revocation generically.

## Issuance-time finding

Trusted issuance time is not required by the surviving model. Introducing it
solely to distinguish pre-removal artifacts would require a trusted clock,
timestamp authority, and historical validation rules. Current evidence does
not justify that complexity.

## Revocation without right identity

No `execution_right_id` is required. A deployment may restrict an Action pair,
signer, credential, schema, resource, or local acceptance policy. Specific
right revocation is not a universal demonstrated requirement, so speculative
revocation does not justify a new identity.

## P1–P4 comparison

| Model | Finding |
|---|---|
| P1 — durable snapshot | Correct about authorization history but incomplete about current acceptance of the attester. |
| P2 — live authority | Rejected: duplicates evaluation, introduces live dependencies, and defeats offline independence. |
| P3 — snapshot plus verifier-local trust | Selected: smallest separation of immutable authorization and current artifact acceptance. |
| P4 — snapshot plus explicit artifact validity | Not needed in core: demonstrated time constraints are Action semantics; other mechanisms need new evidence. |

## Security tradeoff

P3 accepts durable stolen-artifact exposure when no Action time constraint or
local trust change limits use. In exchange it preserves deterministic offline
verification and avoids hidden policy or revocation services. Emergency
revocation is weaker than P2, but P2's cost is duplicate live authority and
loss of offline operation. Atomic/replay safety remains with the protected
state domain under every model.

## Primitive findings

The pressure test rejects new `Expiry`, `Revocation`,
`AuthorizationSnapshot`, `AuthorizationEpoch`, `IssuedAt`, `ValidUntil`,
`RevocationList`, `StatusAuthority`, `RightId`, and `Audience` primitives.
Snapshot is a property of the authorization decision. Current signer acceptance
is local verification input. Neither is a new kernel object.

## Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass: meaning, authorization history, verification trust, and state commitment remain separate. |
| No unjustified primitive | Pass: no time, revocation, identity, status, or audience primitive survives. |
| Necessity/removability | Pass: Action constraints plus local trust remove every demonstrated need for a right-specific temporal field. |
| Twenty-year durability | Pass: the model is independent of networks, PKI style, clocks, registries, and revocation technology. |
| Independent implementability | Pass at the architectural level: no live policy or Claim lookup is required; concrete right representation remains separate work. |
| Reduced total conceptual complexity | Pass: P3 avoids duplicating Action, Rule/Evaluate, and resource-state responsibilities. |

## Classification

**A. SNAPSHOT SEMANTICS SUFFICE — no new core temporal field.**

No explicit-right-validity, live-revocation, or trusted-issuance-time gap is
demonstrated.

## Exact RFC-011 consequence

RFC-011 should state:

> An Execution Right is immutable evidence that the exact Action was authorized
> under the authoritative inputs accepted at issuance. Later Rule, Claim,
> delegation, or policy changes do not retroactively invalidate that decision.
> The executor still applies current verifier-local trust configuration to the
> authorization attester. Execution-time validity constraints belong in
> canonical Action semantics unless separately governed evidence demonstrates
> an irreducible authorization-artifact requirement.

RFC-011 should retain no universal expiry, revocation lookup, trusted issuance
time, right identity, audience, or mutable/consumable state. It should not imply
that retry is always safe: authoritative execution/outcome state governs retry
and canonical commitment.
