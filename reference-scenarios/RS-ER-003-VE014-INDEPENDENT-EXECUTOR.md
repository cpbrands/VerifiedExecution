---
id: RS-ER-003-VE014-INDEPENDENT-EXECUTOR
title: Independent Executor Presents VE-014 Execution Right
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-04
updated: 2026-09-04
depends_on: []
related_documents:
  - VE-014
  - VE-001
  - VE-006
  - RS-ER-001-INDEPENDENT-EXECUTOR
  - RS-ER-002-TEMPORAL-AUTHORIZATION
  - RS-QTY-002
supersedes: null
superseded_by: null
---

# RS-ER-003 — Independent Executor Presents VE-014 Execution Right

## Status and authority boundary

This is non-normative evidence. It tests Draft VE-014 v0.1 and does not modify,
approve, or supplement VE-014, VE-001, RFC-011, ADR-011, or any other normative
artifact. Terms such as `PROFILE-X`, example values, and procedural outcomes
below are scenario scaffolding, not profile allocations, wire fixtures, or
conformance authority.

## Objective

Test whether a separate executor can establish enforceability from only:

- a supplied canonical Action;
- a VE-014 Execution Right artifact;
- governing VE specifications and profiles;
- verifier-local attester-authorization configuration; and
- protected-resource and Adapter context.

The executor does not receive issuance Rules, issuance Claims, the evaluator's
policy state, or general VE authority. It does not call the original evaluator.

## Protected transition

Bank customer Alice requests one transfer of CAD 500 from account X to
recipient Y. The bank ledger is the authoritative protected state domain. Its
transfer Adapter is the only component in this scenario permitted to submit
the transition to that ledger.

There is one canonical Action occurrence `A1` with one schema-governed
semantic payload:

```text
operation = transfer
source = account X
destination = recipient Y
amount = CAD 500
```

VE has already validated and verified the relevant Claims, evaluated the
applicable Rules, decided that `A1` is authorized, and produced right `R1`.
This scenario begins immediately after issuance and does not retest why VE made
that decision.

## Execution Right under test

The semantic body is conceptually:

```text
ExecutionRightBody = {
  action_digest: <VE-001-governed canonical value for A1>,
  action_id: <VE-001-governed canonical value for A1>
}
```

The fields are imported VE-001 values. The scenario does not assign either a
wire type, fabricate canonical bytes, choose an Action digest algorithm, or
define their equality. Their representations and comparisons remain governed
by VE-001 and an applicable normative VE-001 representation/profile.

The VE-014 authentication frame under test is conceptually:

```text
[
  "VE-EXECUTION-RIGHT",
  1,
  "PROFILE-X",
  ExecutionRightBody
]
```

## Hypothetical verification-profile assumption

For this scenario only, hypothetical `PROFILE-X`:

1. recognizes the VE-014 v0.1 verification artifact syntax;
2. authenticates the exact VE-014 frame above; and
3. yields authenticated attester identity `A` in its governed output form.

`PROFILE-X` is not proposed, registered, allocated, standardized, or made
normative. It selects no algorithm and creates no profile specification. It is
only a test double allowing the scenario to exercise VE-014 control flow.

The executor's local authoritative configuration independently says that
attester `A` may issue Execution Rights for the bank-transfer Action schema at
this protected transfer boundary.

## Happy path

The executor performs this conceptual sequence:

```text
receive canonical A1 + R1
-> parse R1 as one closed canonical VE-CBOR-1 object
-> establish VE-014 domain, artifact version 1, and PROFILE-X selector
-> authenticate the exact VE-014 frame
-> obtain authenticated attester A
-> consult verifier-local configuration for A and this context
-> recover the imported action_id and action_digest values
-> validate supplied Action A1
-> compare A1.action_id with the authenticated action_id
-> compute or verify A1.action_digest under the governing VE-001 mechanism
-> compare it with the authenticated action_digest
-> establish enforceability
-> Adapter attempts the protected ledger transition
-> authoritative bank ledger reports the outcome
```

Every prerequisite succeeds. The executor therefore establishes that `R1`
authorizes exact Action occurrence `A1` with its exact semantic content. The
Adapter may attempt the transfer.

The resulting separation remains:

```text
authorization established
!= execution attempted
!= authoritative execution outcome
```

## Negative variants

### Variant A — wrong Action occurrence

`A2` has the same semantic content and therefore may have the same
`action_digest`, but it has a different `action_id`.

```text
R1 + A2 -> ACTION_ID_MISMATCH -> no enforceability
```

This demonstrates why content identity alone cannot bind one authorized
occurrence.

### Variant B — mutated Action content

An input retains `A1.action_id` but changes the amount to CAD 5,000. Its
canonical semantic content and resulting digest differ.

```text
R1 + mutated A1 -> ACTION_DIGEST_MISMATCH -> no enforceability
```

This demonstrates why occurrence identity alone cannot prevent semantic
substitution.

### Variant C — authentic but unauthorized attester

`PROFILE-X` successfully authenticates attester `B`, but the same verifier-local
configuration does not authorize `B` to issue Execution Rights for this bank
transfer context.

```text
valid authentication + locally unauthorized B
-> ATTESTER_NOT_AUTHORIZED
-> no enforceability
```

Cryptographic validity is not issuer authorization.

### Variant D — wrong object/domain

A valid authenticated Claim, Event, Receipt, or arbitrary object is presented
as though it were `R1`. It does not authenticate the exact frame beginning with
`VE-EXECUTION-RIGHT`.

```text
wrong authenticated object/domain -> authentication fails -> no enforceability
```

Relabeling and same-body reinterpretation do not establish a VE-014 right.

### Variant E — unsupported profile

The artifact contains one unambiguous governed profile identifier that the
executor does not support.

```text
unambiguous unsupported profile -> UNSUPPORTED -> no enforceability
```

### Variant F — malformed or ambiguous dispatch

The artifact has an extra field, duplicate key, trailing data, noncanonical
encoding, or content permitting more than one profile interpretation.

```text
closed-grammar or ambiguous-dispatch violation -> MALFORMED
-> no enforceability
```

## Temporal snapshot variants

At `T1`, VE issues `R1`. At `T2`, the Rule, Claim, delegation, or policy used at
issuance changes. At `T3`, the executor receives `A1` and `R1`.

When attester `A` remains authorized by current verifier-local configuration
and all canonical Action execution constraints remain satisfied, the historical
policy change alone does not invalidate `R1`. The executor does not re-run or
reconstruct the issuance decision.

In a separate variant, local configuration no longer authorizes `A` at `T3`:

```text
historical authorization snapshot
+ current rejection of attester A
-> ATTESTER_NOT_AUTHORIZED
-> no enforceability
```

Thus:

```text
historical authorization
!= present artifact acceptance
```

## Replay variant

The same valid `R1` is presented again for `A1`. VE-014 may establish
enforceability again because the right is immutable authorization evidence and
contains no one-time-use state.

Repeated enforceability does not establish that the bank ledger may commit the
transfer twice. The Adapter and authoritative ledger own atomic commitment,
idempotency, and duplicate-transition prevention.

```text
authorization replay
!= duplicate protected-state commitment
```

No nonce, `attempt_id`, right consumption, or mutable replay state is required
in the right.

## Uncertain-outcome variant

`R1` verifies and the Adapter submits the transfer, but the response is lost.
The result becomes `UNCERTAIN`.

`UNCERTAIN` does not consume, mutate, revoke, or invalidate `R1`. Continued
right validity does not prove that retry is safe. Only authoritative bank-ledger
or execution/outcome evidence can establish whether the transition committed
and whether another attempt is safe.

```text
right validity
!= retry safety
```

## Applicable-context pressure test

The local attester-authorization decision uses these inputs:

| Input | Source | Role |
|---|---|---|
| Authenticated attester `A` | `PROFILE-X` verification output | Identifies the proven attester. |
| Supplied canonical Action `A1` | Executor input | Supplies the Action schema and exact requested transition. |
| Attester authorization configuration | Verifier deployment | States whether `A` may issue rights for the applicable Action schema and boundary. |
| Transfer boundary and ledger context | Adapter/protected resource | Identifies the protected execution context in which the decision is being made. |

Given the same four inputs and governed profile behavior, independent executor
implementations can reach the same local authorization result. The right need
not duplicate `audience`, `resource_ref`, `executor_ref`, `scope`, or policy
identity. These facts already come from the supplied Action and the local
protected boundary at which enforcement occurs.

No applicable-context architectural gap is found.

## VE-001 dependency pressure test

This scenario cannot be executed portably end to end today. VE-001 does not yet
supply the normative portable Action representation and `action_digest`
mechanism required to produce, recover, recompute, and compare the imported
values across independent implementations.

That known dependency does not defeat the tested VE-014 semantic or control
flow. It distinguishes:

```text
VE-014 semantic/control-flow sufficiency
!= complete Action + Execution Right wire interoperability
```

The scenario deliberately contains no fabricated digest, canonical Action
bytes, or substitute algorithm.

## Verification-profile dependency pressure test

Portable use also requires at least one governed VE-014 verification profile.
`PROFILE-X` demonstrates the interface but supplies no normative mechanism.
Defining a real profile is ordinary subordinate specification/profile work:
proof syntax, authenticated-frame processing, algorithm interpretation,
attester extraction, and deterministic verification behavior. The scenario
finds no reason for that work to change the accepted semantic pair or add a
kernel primitive.

## Primitive-creep attack

The happy path and all variants require no `right_id`, `audience`,
`executor_ref`, `resource_ref`, `issuer_ref`, status authority, universal
revocation object, retry primitive, execution-attempt primitive, capability,
token, or grant.

The existing division is sufficient:

```text
Action -> requested protected transition
VE-014 right -> authenticated authorization for the exact Action pair
verification profile -> authentication mechanics and attester output
verifier-local configuration -> current attester authorization
Adapter / protected resource -> execution and authoritative state outcome
```

## Gap classification

| Classification | Finding |
|---|---|
| A. NO NEW VE-014 ARCHITECTURAL GAP | **Yes.** The accepted pair, authentication/domain separation, local attester authorization, and durable snapshot semantics cover every scenario variant. |
| B. VE-014 SPECIFICATION GAP | No new defect found in the tested Draft control flow. Concrete vectors remain future validation work. |
| C. VE-001 DEPENDENCY | **Yes.** Portable Action representation and `action_digest` interoperability remain the known blocker. |
| D. VERIFICATION-PROFILE DEPENDENCY | **Yes.** At least one governed VE-014 verification profile is required for portable authentication. |
| E. NEW ARCHITECTURAL GAP | No. No accepted RFC-011/ADR-011 decision proved insufficient. |

## Final result

**A. NO NEW VE-014 ARCHITECTURAL GAP.**

VE-014 itself does not require revision based on this scenario. No new RFC or
ADR is required. The remaining blockers are the already-known VE-001 portable
representation/digest dependency and ordinary governed VE-014 verification
profile work.

This result is evidence only. It does not approve VE-014, allocate `PROFILE-X`,
or claim complete portable conformance.
