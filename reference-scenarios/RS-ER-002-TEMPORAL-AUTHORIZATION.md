---
id: RS-ER-002-TEMPORAL-AUTHORIZATION
title: Execution Right Temporal Authorization
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-03
updated: 2026-09-03
depends_on: []
related_documents:
  - GAP-ANALYSIS-RS-ER-002
  - RS-ER-001-INDEPENDENT-EXECUTOR
  - VE-001
supersedes: null
superseded_by: null
---

# RS-ER-002 — Execution Right Temporal Authorization

## Status and authority boundary

This is non-normative evidence. It creates no temporal field, revocation
mechanism, identifier, status authority, RFC, ADR, primitive, or specification
change. Candidate terms below test architecture; they are not wire syntax or
conformance requirements.

## Question

When VE authorizes an exact Action at `T1` and a separate executor receives the
right at `T2`, does enforceability depend on the authorization inputs as they
existed at issuance or on their current state at execution?

The analysis separates three things:

```text
historical authorization decision
current acceptance of the authorization attester
current protected-resource state
```

Conflating them would force an executor either to re-run VE policy or to treat
an old signature as timeless authority.

## Models tested

### Model A — Snapshot authorization

VE authorization at `T1` is an immutable historical fact. Later changes to
Rules, Claims, delegation, policy, or credentials do not retroactively change
what VE decided. Unless Action semantics or another explicitly governed
validity condition limits execution, the right remains usable.

### Model B — Live authorization

At `T2`, the executor re-establishes that the original policy, Claims,
delegations, and authority remain current. This requires current policy state
or an online authority and duplicates VE evaluation at the protected boundary.

### Model C — Explicit validity contract

Authorization is a snapshot by default, while Action, right, or verification
semantics may introduce additional validity or revocation dependencies. This
model is acceptable only if each additional layer survives removability; its
flexibility alone is not evidence for a core field.

## Baseline

At 10:00, VE authorizes this canonical Action:

```text
transfer CAD 500 from account X to recipient Y
```

It emits right `R`. Nothing changes before `R` is presented at 14:00.

**Result:** executable, assuming the Action and right validate, the signer is
currently recognized by verifier-local trust configuration, and the protected
resource can conformantly perform the transition. Mere delay does not reverse
the completed authorization decision.

## Policy change

At `T1`, policy permits transfers up to CAD 1,000 and VE authorizes CAD 500. One
hour later, policy changes to CAD 100.

Requiring the executor to apply the new policy would require the Rule set,
current policy version, input selection, and evaluation semantics. Rules would
travel indirectly through a live lookup, contradicting the independent
executor boundary.

**Result:** the earlier authorization remains an authorization snapshot. The
new policy controls issuance of later rights. It does not retroactively alter
the historical decision unless a separately governed validity mechanism was
part of the original authorization contract.

## Claim and delegation revocation

At `T1`, Claim `C` establishes Agent A's delegation and VE issues `R`. At `T2`,
that delegation is revoked.

The revocation prevents new decisions from relying on `C`. It does not change
the fact that `R` was validly issued under inputs accepted at `T1`. Making the
executor consult current Claim or delegation state would turn it into another
VE evaluator and prevent independent offline enforcement.

**Result:** underlying Claim or delegation revocation does not inherently
invalidate previously issued rights.

## Issuer credential compromise

Credential status is distinct from the underlying authorization inputs.

### Credential valid and uncompromised at issuance

If the boundary later removes the credential or signer from its local trusted
issuers, a subsequently presented artifact is not accepted under current local
trust policy. The historical authorization decision remains unchanged; current
acceptance of its attester has changed.

### Credential already compromised at issuance, discovered later

Without a trusted issuance time and historical credential-validation model,
the executor cannot prove that an artifact predates compromise. The smallest
safe model again applies current verifier-local trust policy. It may reject all
artifacts under the removed credential.

This scenario does not require RFC-011 to solve PKI revocation or historical
credential validity.

## Stolen right after one year

If an Action contains no temporal constraint and the executor still recognizes
the issuing signer, the copied right remains enforceable under snapshot
semantics. That is an intentional consequence, not a hidden inference.

Where long-lived use is unacceptable, the authority creates an Action whose
semantic execution constraints contain the appropriate time boundary, or the
protected domain changes its local acceptance policy. The scenario does not
prove a universal right-specific expiry field.

## Deliberately durable offline authorization

An organization authorizes a disaster-recovery Action for use months later
while disconnected. The executor has the Action, right, governing
specifications, and provisioned trust material, but no network.

A universal short expiry or mandatory online revocation lookup would make this
legitimate case impossible. Snapshot semantics permit it while still allowing
the Action to state domain-specific activation or completion constraints.

**Result:** VE must permit durable offline authorization.

## Emergency revocation

An operator later decides that every outstanding durable right is dangerous.
Universal immediate revocation would require a current status authority,
revocation feed, resource-local denylist, or continuously updated trust state.
That is a real deployment capability but not an inherent property of every
Execution Right.

VE core does not promise universal retroactive revocation of already-issued
rights. A protected resource can refuse execution, update local issuer trust,
or use a separately governed deployment mechanism. This pressure test chooses
none of those mechanisms.

## Action-time constraint

The canonical Action states:

```text
execute before 17:00 UTC
```

Presentation at 18:00 fails because the exact authorized Action contains an
unsatisfied execution constraint. The right still records the historical
authorization; it does not authorize an executor to ignore Action semantics.

This demonstrates that effect-changing execution-time validity normally belongs
in Action semantic content.

This applies to `execute_before`, `execute_after`, and `effective_at` constraints
when they change whether execution is valid. Because those constraints are
canonical semantic Action content, changing the temporal constraint changes the
bounded Action semantics and therefore may change `action_digest`. In
particular, `execute transfer before T1` and `execute transfer before T2` are
different canonical bounded Actions when the two deadlines impose different
semantic limits. A textual time change that leaves canonical Action semantics
unchanged does not by itself imply different canonical bytes or a different
digest.

## Authorization-time constraint

Suppose the authority says, "this authorization is valid for ten minutes,"
while claiming that the Action itself has no time semantics. The time limit
changes whether the protected transition may occur. Under VE-001's semantic
payload classification, a legitimate authority can distinguish the executions
because of that constraint; it therefore belongs in the canonical Action.

Representing the limit only in the right would create two Actions with
identical semantic identity but different permitted transitions. That would
make the Action schema under-specified.

No irreducible authorization-age condition survives once effect-changing
constraints are correctly classified as Action semantics.

## TOCTOU separation

Between `T1` and `T2`, two kinds of change can occur:

1. **Authorization-context change:** policy, Claims, or delegation change.
   Snapshot semantics do not re-run those inputs for an issued right.
2. **Protected-resource state change:** balance, capacity, lock state, target
   state, or another execution invariant changes. The authoritative execution
   or state domain validates and commits against its current state.

RS-QTY-002 already places atomic state invariants with the authoritative state
owner. Resource-state change is not evidence for re-running VE authorization.

Authorization replay is not duplicate canonical state commitment. Presenting
the same valid authorization artifact again does not itself authorize multiple
committed state transitions. The authoritative execution/state domain owns
atomic commitment, idempotency, and duplicate-transition prevention.

An `UNCERTAIN` execution outcome does not mutate, consume, revoke, or implicitly
invalidate the Execution Right. Right validity is not retry safety: only the
authoritative execution/outcome state establishes whether another attempt is
safe.

## Snapshot definition

The surviving definition is:

> An Execution Right is immutable evidence that the exact Action was authorized
> under the authoritative inputs accepted by VE at issuance time.

Later Rule, Claim, delegation, or policy changes do not retroactively alter that
fact. This is consistent with immutable evidence and deterministic historical
audit: the decision can be reconstructed as a past event without pretending
that present policy governed the past.

Snapshot does not mean that every artifact is accepted forever. The Action may
contain validity conditions, and the verifier still applies its current local
trust configuration to the attester. These checks do not require Rule
re-evaluation.

## Issuance time

The minimum Action-pair semantic core contains no trusted issuance timestamp.
The executor therefore cannot inherently establish when the right was issued.
Historical credential validation would require trusted time and additional
profile semantics that this scenario does not justify.

The absence of that feature is deliberate: the executor applies current local
trust to the presented artifact rather than inventing historical trust.

## Revocation without a right identifier

The right has no independent `execution_right_id`. Deployment controls may
target the Action pair, signer, credential, schema, resource, or local policy,
but the scenario does not prove universal per-right revocation.

Adding right identity solely to enable speculative revocation fails the
necessity test. A future concrete lifecycle/reference scenario would be needed.

## Policy-model comparison

| Model | Result |
|---|---|
| P1 — durable snapshot | Preserves offline operation and historical determinism, but does not distinguish current trust in the attester. |
| P2 — live authority | Re-runs or depends on current authorization state; rejects independent offline execution. |
| P3 — snapshot plus verifier-local trust | Survives. Authorization is frozen; artifact acceptance still requires current local trust in its signer/profile. |
| P4 — snapshot plus explicit artifact validity | Adds no core field here. Effect-changing validity is Action semantics; other mechanisms require separate evidence. |

P3 is the smallest complete model. It combines snapshot authorization with
current local acceptance of the authorization attester, without policy
re-evaluation or a universal temporal/revocation subsystem.

## Security tradeoff

| Property | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| Stolen-artifact exposure | Potentially durable | Reduced by live state | Durable unless Action/local trust limits it | Depends on added mechanism |
| Offline availability | Strong | Weak or impossible | Strong with provisioned trust | Strong only for self-contained validity |
| Emergency revocation | Not inherent | Strong | Signer/profile scope through local updates; no universal per-right revocation | Mechanism-dependent |
| Hidden online dependency | None | High | None in core | Possible |
| Determinism | High | Depends on current state | High for identical Action/right/local trust | Mechanism-dependent |
| Replay implications | State domain still owns commit | State domain still owns commit | State domain still owns commit | State domain still owns commit |
| Credential compromise | No current-trust distinction | Live validation | Current verifier-local trust rejects removed signer | Mechanism-dependent |
| Complexity | Lowest but incomplete trust account | Highest | Lowest complete separation | Higher without demonstrated need |

## Primitive attack

No new `Expiry`, `Revocation`, `AuthorizationSnapshot`, `AuthorizationEpoch`,
`IssuedAt`, `ValidUntil`, `RevocationList`, `StatusAuthority`, `RightId`, or
`Audience` primitive survives. Snapshot is the meaning of issued authorization,
not a new object. Action semantic constraints and verifier-local trust cover the
demonstrated cases.

## Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Immutable decisions, current attester trust, and authoritative state commitment remain separate. |
| New primitive burden | Pass. No temporal, revocation, identity, or status primitive is added. |
| Necessity/removability | Pass. Live policy revalidation and right-specific temporal fields are removable when Action constraints and local trust are applied correctly. |
| Twenty-year durability | Pass. Snapshot evidence does not depend on current PKI, network, clock, registry, or policy technology. |
| Independent implementation | Pass architecturally. Identical Action, right, specifications, and local trust yield the same result once the right's representation is specified. |
| Total conceptual complexity | Pass. P3 avoids duplicating Rule evaluation, Action semantics, state commitment, or generic revocation infrastructure. |

## Result

**A. SNAPSHOT SEMANTICS SUFFICE — no new core temporal field.**

The Execution Right records a durable authorization snapshot. Underlying
Rule/Claim changes do not retroactively invalidate it. Current verifier-local
trust still governs whether the executor accepts its attester. Action semantics
carry demonstrated execution-time constraints, and no universal expiry,
revocation lookup, issuance time, audience, or right identity is justified.
