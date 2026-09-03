---
id: RS-ER-001-INDEPENDENT-EXECUTOR
title: Independent Executor Execution Right
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-02
updated: 2026-09-02
depends_on: []
related_documents:
  - GAP-ANALYSIS-RS-ER-001
  - VE-001
  - VE-006
supersedes: null
superseded_by: null
---

# RS-ER-001 — Independent Executor

## Status and authority boundary

This is non-normative evidence. It does not define an Execution Right,
execution profile, verification profile, wire form, primitive, RFC, or change
to any Approved specification. Normative words quoted from existing documents
retain only their source authority. The candidate notation below is analytical.

## Scenario

An Agent proposes Action `A`. VE verifies the relevant Claims, evaluates the
applicable Rules, and authorizes `A`. A separate executor process is the only
component capable of invoking protected resource `R`.

The executor receives the canonical Action and an Execution Right. It has
already provisioned trust material, but it does not possess the VE Rule set,
the Claims used by VE, or VE's internal policy configuration. It must decide
whether the right permits the exact requested protected transition without
calling VE, re-running policy, or inferring missing constraints.

## Enforcement question

The executor needs to establish three facts:

1. the right is authentic under a verification profile recognized by the
   protected boundary;
2. it binds one Action occurrence and that occurrence's exact semantic content;
3. the canonical Action semantics describe the exact protected transition and
   the conforming execution implementation can perform it.

The right need not explain why VE authorized the Action. Rule identifiers,
Claim identifiers, evaluation transcripts, and policy versions are audit
evidence, not inputs required to enforce an exact authorization.

## Candidate shapes

The following shapes are conceptual and are not proposed field or encoding
definitions.

### Candidate A

```text
ExecutionRight {
  action_id
  action_digest
  verification
}
```

This binds the exact Action occurrence and content. It is sufficient only when
the executor already has a governed, unambiguous way to interpret that Action
as a protected transition and to verify this artifact.

### Candidate B

```text
ExecutionRight {
  action_id
  action_digest
  executor_constraints?
  verification
}
```

Generic executor constraints are not justified. If an executor restriction is
necessary, it belongs to the protected resource or integration contract, or
to content already fixed by the Action. A free-standing optional constraint set
would create two potentially divergent sources of authority.

### Candidate C

```text
ExecutionRight {
  action_id
  action_digest
  verification
}
```

This is the minimum surviving portable candidate. The occurrence/content pair
binds exact intent. `verification` carries the machinery by which the executor
establishes that the recognized authorization authority issued the right. The
names do not prescribe a wire structure.

`execution_profile` is not justified as a core Execution Right field. Action
schema plus canonical semantic Action content, `schema_digest`, and
`action_digest` already determine the protected semantic transition. Invocation
mechanics belong to the Adapter, protected resource, and transport/protocol
integration. The same semantic Action may be executed through multiple
conforming adapters without requiring different Execution Rights.

If identical canonical Action semantics can legitimately produce different
protected semantic transitions, the Action schema is under-specified. An
Execution Right execution-profile selector must not repair that ambiguity.

### Candidate D

```text
ExecutionRight {
  action_id
  action_digest
  resource_ref
  operation
  constraints
  expires_at
  executor_ref
  verification
}
```

This is over-specified. Resource, operation, amount, recipient, and other
enforceable constraints belong in canonical Action content when they change the
requested effect. Repeating them permits disagreement with the Action. Expiry,
executor identity, and single-use state are not universally necessary and may
be defined by the protected resource or integration contract when evidence
requires them.

## Action binding

Binding only `action_id` permits content substitution under the same occurrence
identifier. Binding only `action_digest` permits reuse across distinct Action
occurrences with identical semantic content. The pair
`(action_id, action_digest)` prevents both substitutions and matches VE-001's
existing requirement for authoritative occurrence-dependent artifacts.

Two occurrences may have identical semantic content and distinct `action_id`
values. One occurrence may have multiple execution attempts. Therefore the
pair identifies the authorized occurrence and content; it does not identify an
attempt and does not imply single use.

## Resource and constraint binding

Changing account, amount, recipient, protected resource, operation, or a
material execution constraint changes the requested external effect and must
therefore change canonical Action content under VE-001. Exact Action binding
prevents an executor from changing those values.

An explicit resource field is unnecessary because the Action schema and
canonical semantic content determine the protected transition. Reinterpreting
one Action as a different transition is an Action-schema or
implementation-conformance defect, not evidence for `resource_ref` or
`execution_profile` in the right.

Rules do not travel with the right. VE's permission decision and the executor's
enforcement decision remain distinct:

```text
VE establishes that exact Action A is legitimate to execute
executor establishes that this authentic right permits transition T for A
```

## Executor identity and time

No universal executor identity survives the removability test. A stolen or
forwarded right is controlled through cryptographic possession, a
resource-recognized caller binding, or an integration constraint where
the protected domain requires one. Multiple executors and executor replacement
remain possible without changing core Action identity.

No universal `issued_at`, `not_before`, or `expires_at` survives either. Time
restrictions that change the authorized effect can be fixed in Action content.
A profile may additionally require clock-based enforcement, but core semantics
must not introduce clock skew, online time resolution, or expiry by default.

## Replay, retry, and uncertain outcome

Replaying an authorization artifact is not the same as committing the same
protected transition twice. The right binds one Action occurrence, while the
authoritative resource or execution/state domain owns idempotency, atomic
commit, and duplicate-transition prevention.

After a timeout, another attempt may present the same right for the same Action
occurrence. A universal single-use rule would incorrectly prevent safe recovery
when the first result is unknown. The right contains no mutable lifecycle flag.

If invocation produces an uncertain result, VE preserves `UNCERTAIN`. Neither
the right nor the executor infers that the transition committed, failed,
released capacity, or may safely be repeated. The authoritative outcome owner
establishes the canonical result and whether a retry is safe.

## Authenticity and authority

The right must be cryptographically verifiable under stable, already
provisioned trust context. The signer is the component or authority recognized
by the protected boundary as competent to attest that VE authorization
completed. That role might be implemented by an Execution Boundary, but it is
not automatically the issuer of Claims, the resource's Root Authority, or a
new source of legitimacy.

The minimum distinction is:

```text
Action legitimacy established through VE evaluation
  !=
attestation that the exact Action was authorized
  !=
resource authority that accepts the resulting protected transition
```

The Claim-specific `verification { profile, artifact }` pattern is useful
evidence, but this scenario does not generalize it automatically or introduce a
generic `SignedArtifact`. Execution Right verification needs its own governed
scope, signature coverage, profile selection, failure behavior, and trust
context rules.

Verification is authenticity and enforceability machinery, not additional
Action authorization semantics. Authenticated coverage must bind at least
`action_id`, `action_digest`, Execution Right object/domain identity, and
verification-profile selection. The selector cannot be freely substitutable
outside authenticated semantics. This evidence selects no representation or
cryptographic mechanism.

A cryptographically valid signer is not necessarily authorized to issue
Execution Rights. Recognition belongs to the verification profile plus
provisioned trust context, not a new core `issuer_ref`. The right does not
become Root Authority.

The executor receives the canonical Action separately; the right is not an
Action container. It validates the Action, recomputes or verifies
`action_digest`, compares it with the right, and compares `Action.action_id`
with `ExecutionRight.action_id`. It must not trust a claimed digest blindly.

A body wrapper is not a semantic requirement. Flat and wrapped forms may
express the same semantics:

```text
ExecutionRight { action_id, action_digest, verification }

ExecutionRight {
  body { action_id, action_digest }
  verification
}
```

Later representation/profile work may select one.

## Tampering matrix

| Case | Required rejection basis |
|---|---|
| T1: same `action_id`, modified content | Recomputed/verified content does not match bound `action_digest`. |
| T2: same `action_digest`, different occurrence | Presented `action_id` does not match the signed binding. |
| T3: right copied to a different resource | A substituted resource cannot conformantly execute a different transition when resource identity is Action content; reinterpretation is a schema/conformance defect. |
| T4: executor changes amount, recipient, or resource | Changed transition differs from bound canonical Action content. |
| T5: right presented for another Action | The occurrence/content pair differs. |
| T6: verification artifact altered | Verification fails closed. |
| T7: executor substitutes a different Action interpretation | Non-conformant execution; exact Action semantics and Adapter/resource conformance govern interpretation. Cryptography cannot make a malicious executor conformant. |

Candidate A resolves the authorization-artifact aspects of T3 and T7 when the
Action schema is complete and the executor is conformant. Candidate D duplicates
Action content and adds unsupported universal constraints.

## Offline and cross-executor test

Offline enforcement is possible when the executor already possesses:

- the canonical Action;
- the Execution Right;
- the governing VE and verification specifications; and
- provisioned verification keys and trust context.

No registry, namespace authority, resolver, or callback to VE is inherently
required. A profile may explicitly require an external service, but that is not
core behavior.

Two independent executors can agree only if specifications define the right's
closed structure, Action-pair binding, authenticated coverage, object/domain
separation, verification-profile binding, issuer trust-context behavior,
fail-closed processing, and representation/canonicalization rules. The
repository does not currently define that portable contract.

Conceptually distinct failures include a malformed right, unsupported
verification profile, verification failure, unrecognized or unauthorized
issuer, Action-occurrence mismatch, Action-content/digest mismatch, and
unsupported or ambiguous Action semantics. This evidence does not standardize
error names; every case fails closed.

## Evidence separation

Receipt, evaluation proof, authorization record, and Execution Right remain
separate. The right crosses the protected boundary. Audit evidence may retain
Rule identifiers and digests, Claim identifiers, Predicate Schema identities,
transcripts, explanations, and policy versions without burdening executor
enforcement or expanding the right into a complete decision record.

## Primitive attack

The scenario does not justify new `Executor`, `ExecutionConstraint`,
`Capability`, `Token`, `Grant`, `PolicySnapshot`, `DecisionProof`, or
`AuthorizationContext`, `SignedArtifact`, or `ExecutionProfile` primitives. It
does demonstrate that the existing term
Execution Right lacks a minimum portable specification. That missing contract
can be specified without elevating each field or profile concern into a new
kernel primitive.

## Scenario result

The minimum surviving conceptual candidate is:

```text
ExecutionRight {
  action_id
  action_digest
  verification
}
```

with exact Action binding, authenticated verification-profile selection, fail-closed
verification, and no duplicated Action constraints, policy reasoning, replay
state, universal clock fields, or universal executor identity.

**Result: D. EXECUTION-RIGHT CORE GAP — the minimum portable Action-pair plus
verification contract is unspecified.**
