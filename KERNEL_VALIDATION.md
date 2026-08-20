# KERNEL_VALIDATION.md

**Project:** Verified Execution\
**Document:** Kernel Validation Record\
**Version:** 0.5\
**Status:** Draft / Active Validation\
**Date:** 2026-08-19

------------------------------------------------------------------------

## 1. Purpose

This document records pressure tests, findings, rejected additions, open
hypotheses, and architectural consequences discovered while validating
the Verified Execution kernel.

It is not an authoritative specification. A finding recorded here does
not modify an approved specification by itself.

Any normative change to an approved specification MUST follow the
project change-control process:

1.  RFC describing the proposed change.
2.  Architecture Decision Record documenting the decision and reasoning.
3.  Specification revision with a version increment.
4.  Changelog entry describing the semantic impact.

The development cadence remains:

> Kernel Specification → Reference Scenario → Gap Analysis → RFC if
> needed → Next Specification

The objective is to discover the smallest architecture that can express
legitimate execution across domains without importing domain-specific
concepts into the kernel.

------------------------------------------------------------------------

## 2. Architectural Decision Test

Every proposed kernel concept is tested against the following questions:

1.  Is it consistent with the Founding Principles?
2.  Does it introduce a new architectural primitive? If so, the burden
    of proof is very high.
3.  Can it be removed while preserving the architecture's expressive
    power?
4.  Will the concept still make sense in twenty years?
5.  Can two independent engineering teams implement it from the written
    specification and interoperate?
6.  Does it reduce total conceptual complexity?

A concept that does not survive these tests SHOULD NOT enter the kernel.

------------------------------------------------------------------------

## 3. Current Validation Status

**Assessment:** FUNCTIONALLY COHERENT, UNDER ACTIVE REDUCTION\
**Confidence:** MODERATE\
**Normative status:** No findings in this document modify approved
specifications until change control is completed.

Earlier reference-scenario validation established:

-   RS-001 through RS-004 can be represented without adding
    scenario-specific primitives.
-   A single semantic Action may involve multiple Adapter-level
    execution steps.
-   Operational uncertainty or partial progress does not by itself
    justify an `INDETERMINATE` semantic lifecycle state.
-   Authorized target-local recovery may remain within the original
    Action when already contained by that Action's semantics.
-   A later independently chosen compensating correction is a new
    Action.
-   Historical truth and receipts remain coherent under these
    distinctions.

### Previous open hypothesis

**HYP-001 --- Explicit Action completion predicate**

An Action may require an explicit completion predicate so that execution
infrastructure can determine when the semantic Action has completed
despite multi-step operational mechanics.

**Status:** OPEN. RFC not yet required.

------------------------------------------------------------------------

## 4. Kernel Reduction Under Test

The current reduced semantic model under pressure test is:

-   `Action`
-   `Claim`
-   `Rule`
-   `Verify`
-   `Evaluate`

The following concepts are currently **not justified as kernel
primitives**:

-   Actor
-   Resource
-   Permission
-   Policy
-   Evidence
-   State
-   Identity
-   Authority
-   Delegation
-   Human
-   AI
-   Trust Context

This does not mean these concepts are unimportant. They may exist as
Action data, Claim semantics, Rule content, protocol objects,
implementation mechanisms, domain models, or environmental context
without becoming kernel primitives.

`Rule` remains a candidate primitive and has not yet survived final
elimination testing.

------------------------------------------------------------------------

## 5. Semantic Separation: Verify vs. Evaluate

A critical separation has emerged.

### Verify

`Verify` establishes whether a Claim is valid under a specified
verification method and the applicable trust basis.

Conceptually:

``` text
Verify(Claim, TrustContext)
    → established / not established
```

Verification may include, as required by the verification mechanism:

-   integrity verification;
-   issuer authentication;
-   credential validity;
-   proof or signature validation;
-   chain validation;
-   scope anchoring.

`Verify` MUST NOT be interpreted merely as "the signature is
mathematically correct."

### Evaluate

`Evaluate` determines whether a proposed Action satisfies an applicable
Rule given established Claims.

Conceptually:

``` text
Evaluate(Action, EstablishedClaims, Rule)
    → decision
```

`Verify` concerns whether assertions can be established.

`Evaluate` concerns whether established assertions are sufficient under
governance.

This separation is currently considered foundational to avoiding
circular authority reasoning.

------------------------------------------------------------------------

## 6. Pressure Test: Communication vs. Financial Execution

### Question

Can:

``` text
send Cristi a message
```

and:

``` text
transfer $100 from Cristi's account
```

be represented using the same kernel semantics without special-casing
communication?

### Result

**PASS --- no communication-specific primitive required.**

A communication request can be represented as an Action. Sender
identity, human status, provenance, delegation, relationship, urgency,
temporal validity, and prior activity can be represented through Claims.
Rules can determine which conditions are required. `Verify` establishes
relevant Claims; `Evaluate` determines whether the Action satisfies the
governing Rule.

Communication exposed no irreducible semantic requirement absent from
financial, cloud, or other execution domains.

### General problems surfaced

The pressure test exposed two cross-domain concerns:

1.  **History-dependent authorization** --- e.g. daily spending limits
    or interruption-rate limits.
2.  **Concurrent Actions competing for constrained state** ---
    e.g. simultaneous transfers or simultaneous requests for attention.

These are general execution-model concerns and MUST NOT be solved
through communication-specific primitives.

------------------------------------------------------------------------

## 7. Pressure Test: Resource as a Primitive

### Question

Does the Execution Boundary need to understand a `Resource` as a
semantic primitive?

### Result

**PASS FOR ELIMINATION --- `Resource` is not currently justified as a
kernel primitive.**

A proposed Action can contain the identifiers, targets, parameters,
namespaces, capabilities, or affected objects necessary for Claims and
Rules to refer to the proposed execution.

Examples:

``` text
Action:
    type: bank.transfer
    source_account: account-X
    destination_account: account-Y
    amount: 100 CAD
```

``` text
Action:
    type: communication.request_interrupt
    target: person-X
    payload_hash: ...
```

The kernel need not possess a universal ontology for "resource."

### Rationale

`Resource` had been carrying several separable meanings:

-   thing affected;
-   locus of authority;
-   state-bearing object;
-   Rule attachment point;
-   protected capability.

No expressive power has yet been identified that requires these meanings
to be collapsed into one kernel primitive.

Multi-target Actions further weaken a single-Resource abstraction.

### Architectural consequence

Previous language such as:

> The Resource defines which authorities it recognizes.

is insufficiently precise for the reduced model.

The unresolved problem becomes:

> How is the Rule governing a proposed Action authoritatively
> established?

------------------------------------------------------------------------

## 8. Pressure Test: Rule Applicability as a Claim

### Question

Can Rule applicability itself be represented as a Claim without causing
infinite regress?

Example:

``` text
Claim:
    Rule R governs Action A
```

### Result

**PASS, subject to a bootstrap constraint.**

Rule applicability MAY be represented by a Claim, but the authority of
that Claim cannot be established by an unbounded sequence of ordinary
Rules and Claims.

The verification chain MUST terminate in a non-derived trust commitment
recognized by the Execution Boundary's verification environment.

### Finding

A Rule cannot be considered applicable merely because the Rule, the
actor, or an untrusted Claim says that it is applicable.

Otherwise an attacker could supply an `ALLOW` Rule and use that Rule to
establish its own authority.

### Security finding: non-self-authorization

Candidate normative invariant:

> **No Rule may establish, directly or indirectly, its own authority to
> govern an Action. Rule applicability MUST derive from Claims verified
> against a Trust Context selected independently of that Rule.**

Related bootstrap invariant:

> **Every verification chain used to establish governance MUST terminate
> in a trust root recognized by the applicable Trust Context.**

**Status:** VALIDATED FINDING; NOT YET NORMATIVE.

These statements SHOULD remain in kernel validation until the Trust
Context and trust-evolution pressure tests are complete. Promotion into
an approved specification requires the project change-control process.

------------------------------------------------------------------------

## 9. Bootstrap Authority vs. Derived Authority

The Rule-applicability test exposed two distinct authority layers.

### Bootstrap authority

Defines the non-derived roots recognized by an Execution Boundary for a
relevant scope.

It answers:

> Which roots does this boundary begin by recognizing?

### Derived authority

Represents authority relationships established from those roots,
including:

-   control;
-   delegation;
-   approval;
-   organizational authority;
-   provenance;
-   permissions;
-   constraints;
-   subordinate authority.

Derived authority can be expressed through Claims and verified chains.

Bootstrap authority cannot be recursively derived forever from ordinary
Claims without hiding the base case.

### Finding

Verified Execution MUST consume bootstrap authority rather than
manufacture it.

------------------------------------------------------------------------

## 10. Pressure Test: Trusted Setup / Trust Context

### Question

Can trusted setup remain outside the kernel, or is bootstrap trust
sufficiently fundamental to interoperability that it must become a
kernel primitive?

### Result

**PASS FOR EXCLUSION FROM THE SEMANTIC KERNEL, WITH AN EXPLICIT-PROTOCOL
REQUIREMENT.**

The actual roots trusted by different Execution Boundaries MUST be
allowed to differ. Global agreement on trusted authorities would
improperly turn Verified Execution into an authority.

However, leaving the trust basis implicit or entirely
implementation-private would damage:

-   reproducibility;
-   interoperability;
-   auditability;
-   governance;
-   debugging;
-   portability.

### Terminology

`Trust Context` is preferred over `Trusted Setup`.

A Trust Context represents the bounded trust assumptions against which
verification occurs, including as applicable:

-   recognized trust roots;
-   authority scopes;
-   verification parameters;
-   credential-chain requirements;
-   relevant trust-context version or identifier.

### Current classification

`Trust Context` is **not justified as a semantic kernel primitive**.

It is currently classified as **required protocol context** supplied to
`Verify`.

Conceptually:

``` text
Trust Context T
       |
       v
Verify(Claim, T)
       |
       v
Established Claim
       |
       v
Evaluate(Action, Claims, Rule)
```

### Interoperability requirement

Two conforming implementations are not required to trust the same roots.

They SHOULD, however, reach the same result when given:

-   the same Action;
-   the same Claims and proofs;
-   the same Rule;
-   the same Trust Context;
-   the same relevant deterministic inputs.

### Trust Context independence

A candidate Rule MUST NOT be permitted to select the Trust Context used
to prove that Rule's own applicability.

Likewise, an Action or actor MUST NOT be able to replace the boundary's
accepted Trust Context merely by supplying a different one.

The trust basis used for governance verification must be selected or
accepted independently of the candidate Rule whose authority depends on
it.

### Auditability hypothesis

Authorization records may need to bind the decision to an identifier or
digest of the Trust Context used during verification.

Candidate form:

``` text
Action hash
Claim hashes
Rule hash
Trust Context identifier/digest
Verify results
Evaluate result
relevant time/context
```

**Status:** OPEN as to whether this binding is a `MUST` or `SHOULD`.

------------------------------------------------------------------------

## 11. Current Kernel Boundary

The current working architectural boundary is:

### Inside the semantic kernel

``` text
Action
Claim
Rule
Verify
Evaluate
```

### Immediately outside the semantic kernel

``` text
Trust Context
Executor
external state
cryptographic mechanisms
serialization / wire format
domain-specific target and resource models
```

Items outside the semantic kernel may still require protocol
specifications. "Outside the kernel" does not mean "unspecified."

------------------------------------------------------------------------

## 12. Validated Architectural Findings

### KV-F01 --- Communication Generalizes to Execution

Communication access can be represented as an Action governed through
the same Claim/Rule/Verify/Evaluate semantics used for financial and
infrastructure actions.

**Status:** PASS.

### KV-F02 --- Resource Is Not Currently Irreducible

No tested scenario requires `Resource` as a kernel primitive when target
and scope information can be represented within Action data and
referenced by Claims and Rules.

**Status:** CANDIDATE ELIMINATED.

### KV-F03 --- Rule Applicability Requires Independent Authority

A Rule cannot establish its own applicability. Applicability must derive
from independently established authority.

**Status:** PASS; candidate security invariant.

### KV-F04 --- Verification Chains Require a Base Case

Governance verification cannot recurse indefinitely through Claims and
Rules. It must terminate in a non-derived trust commitment.

**Status:** PASS.

### KV-F05 --- Trust Choice and Protocol Semantics Are Distinct

Different Execution Boundaries may recognize different trust roots
without violating protocol interoperability.

**Status:** PASS.

### KV-F06 --- Trust Context Must Be Explicit

The trust basis used by `Verify` cannot remain an invisible
implementation detail if decisions are to be reproducible and auditable.

**Status:** PASS.

### KV-F07 --- Trust Context Is Not Yet a Kernel Primitive

Explicit Trust Context is required for verification but can remain
protocol context rather than a semantic primitive.

**Status:** PASS FOR EXCLUSION.

------------------------------------------------------------------------

## 13. Open Questions / Validation Backlog

### HYP-001 --- Explicit Action completion predicate

Does every Action require a normative completion predicate?

**Status:** OPEN.

### HYP-002 --- History-dependent authorization

Can historical limits and cumulative constraints be represented through
Claims and external state without introducing kernel state semantics?

**Status:** OPEN.

### HYP-003 --- Concurrent Actions

Can multiple individually authorized Actions competing for constrained
external state be handled entirely at execution/commit semantics without
expanding the authorization kernel?

**Status:** OPEN.

### HYP-004 --- Rule as primitive

Can `Rule` itself be eliminated by treating `Evaluate` as execution of
an externally supplied deterministic function identified by hash, or
does naming Rule materially improve interoperability, auditability,
governance, and reproducibility?

**Status:** OPEN.

### HYP-005 --- Trust Context binding

Must every authorization decision cryptographically bind the exact Trust
Context identifier/digest used during verification?

**Status:** OPEN.

### HYP-006 --- Trust evolution

If Trust Context determines recognized roots, who is authorized to
update that Trust Context for:

- revocation;
- key rotation;
- compromise;
- ownership transfer;
- organizational change;
- emergency recovery?

Can trust evolution remain outside the semantic kernel without
introducing a higher-level governance primitive or circular authority?

**Status:** PASS. Trust Context changes can be represented as ordinary
Actions evaluated against the trust state effective immediately before
the transition. Recovery authority must already be recognized by the
prior trust state. A discontinuous replacement is a re-bootstrap, not an
authorized transition.

### HYP-007 --- Immutable trust history

Does VE require a mutable Trust Context object, or can trust be modeled
as an immutable append-only lineage of committed trust-transition
Actions, with current trust state derived deterministically from that
history?

**Status:** PASS, subject to canonical commit/order requirements.

------------------------------------------------------------------------

## 14. Pressure Test: Trust Evolution Without a Higher-Level Primitive

### Question

If Trust Context determines which roots are recognized, who has
authority to change that Trust Context for revocation, key rotation,
compromise, ownership transfer, or emergency recovery?

### Result

**PASS — no higher-level governance primitive required.**

A Trust Context change can itself be represented as an `Action`.

Example:

```text
Action:
    type: trust_context.update
    from: hash(T1)
    to: hash(T2)
```

Claims establish the authority required by the currently effective trust
state. The governing Rule defines the conditions for the transition.
Those Claims are verified against `T1`, and the proposed transition is
then evaluated.

```text
T1
 │
 │ Verify transition Claims against T1
 │
 │ Evaluate transition Action under applicable Rule
 ▼
T2
```

The proposed next trust state MUST NOT participate in establishing the
authority required to install itself.

### Recovery

Compromise recovery remains coherent if recovery authority was already
recognized by the prior trust state.

```text
T1:
    primary authority = K1
    recovery authority = KR
```

If `K1` is compromised, `KR` may authorize a transition to `K2` only if
that recovery power was already established under `T1`.

If no authority recognized by `T1` remains capable of authorizing a
transition, VE MUST NOT invent replacement authority.

An externally imposed replacement in that situation is a **re-bootstrap**
and MUST be distinguishable from an authority-continuous transition.

### Validated invariants

Candidate normative invariants:

> **Trust Continuity Invariant:** A Trust Context transition MUST be
> authorized relative to the trust state effective immediately before
> that transition.

> **No Prospective Self-Authorization:** A proposed Trust Context MUST
> NOT participate in establishing the authority required to install
> itself.

> **Trust Transition Atomicity:** A Trust Context transition MUST commit
> only against the exact prior trust state for which it was evaluated.

> **Re-bootstrap Distinction:** Installation of a Trust Context without
> an authorization chain from the previously effective trust state MUST
> be distinguishable from an authorized Trust Context transition.

**Status:** VALIDATED FINDINGS; NOT YET NORMATIVE.

------------------------------------------------------------------------

## 15. Pressure Test: Mutable Trust Context vs. Immutable Trust History

### Question

Does VE need a mutable `Trust Context`, or can trust be represented as an
immutable, append-only chain of authorized trust-transition Actions,
where current trust state is the deterministic result of replaying the
accepted history?

### Result

**PASS FOR IMMUTABLE HISTORY. A mutable Trust Context is not required as
a semantic object.**

The stronger model is:

```text
Genesis / Bootstrap T0
        │
        ▼
Committed transition Action A1
        │
        ▼
Derived trust state T1
        │
        ▼
Committed transition Action A2
        │
        ▼
Derived trust state T2
        │
        ▼
...
```

The "current Trust Context" is therefore a **derived view** of the
canonical committed trust-transition history, not necessarily a mutable
authoritative object.

### Why this is stronger

An append-only trust lineage provides:

- explicit authority continuity;
- deterministic reconstruction;
- historical auditability;
- rollback detection;
- revocation and rotation history;
- provenance of every trust-state change;
- reproducibility of past verification context;
- a natural distinction between authorized continuation and re-bootstrap.

### Trust-transition Actions

Rotation:

```text
A1:
    replace root K1 with K2
    previous_trust_state = hash(T1)
```

Revocation:

```text
A2:
    revoke delegated authority KD
    previous_trust_state = hash(T2)
```

Recovery:

```text
A3:
    revoke compromised K2
    establish K3
    previous_trust_state = hash(T3)
```

Each transition is authorized relative to the immediately preceding
derived trust state.

### Current-state derivation

Conceptually:

```text
Tn = Apply(T0, A1, A2, ... An)
```

where only successfully committed, valid trust-transition Actions are
included.

Implementations MAY use snapshots, caches, indexes, or materialized
current-state representations for efficiency. Such mutable
representations are implementation optimizations, not sources of
authority.

The authoritative semantic history remains append-only.

### Critical distinction: ALLOW is not COMMIT

An Action that evaluates to `ALLOW` MUST NOT automatically enter trust
history.

Two conflicting trust transitions may both independently evaluate to
`ALLOW` against the same prior trust state.

Example:

```text
T1 -> T2
T1 -> T3
```

Both may be authorized relative to `T1`.

Only one may become the canonical successor if the protected trust state
requires a single lineage.

Therefore the history MUST contain **committed trust transitions**, not
merely authorized proposals.

This preserves the separation between:

1. authorization; and
2. execution / commit.

### Canonical head requirement

Every trust-transition Action SHOULD bind the exact trust state against
which it was evaluated:

```text
previous_trust_state = hash(Tn)
```

The executor commits the transition only if the current canonical head
still equals that value.

After one transition commits:

```text
Tn -> Tn+1
```

a competing transition based on `Tn` becomes stale and must be
re-evaluated against `Tn+1`.

This is a general execution-concurrency property, not a new trust
primitive.

### Forks

An append-only structure alone does not prevent forks.

```text
        T1
       /  \
     T2    T3
```

VE therefore requires a way to identify the **canonical committed
lineage** for a particular Execution Boundary.

For a single-writer boundary this may be enforced by atomic commit.

For distributed multi-writer systems, ordering or consensus may be
provided by the protected execution environment.

VE SHOULD NOT silently invent a universal consensus mechanism. The
kernel's requirement is only that verification be performed against a
well-defined canonical prior trust state.

### Replay resistance

Old transition Actions cannot be safely replayed merely because their
signatures remain valid.

A transition MUST bind its predecessor state.

A transition authorized for:

```text
previous_trust_state = hash(T1)
```

cannot commit when the canonical state is already `T5`.

This prevents stale trust updates from re-establishing superseded roots.

### Re-bootstrap

A re-bootstrap begins a new trust lineage or epoch rather than pretending
to extend the prior one.

Conceptually:

```text
Lineage 1:
T0 -> T1 -> T2 -> T3

continuity broken

Lineage 2:
T0'
```

Any protocol representation SHOULD make this discontinuity explicit.

### Interoperability consequence

Two conforming implementations can reconstruct the same current trust
state if they possess:

- the same bootstrap state;
- the same canonical ordered set of committed trust-transition Actions;
- the same deterministic transition semantics.

This is stronger than relying on opaque mutable local configuration.

### Architectural conclusion

`Trust Context` should currently be understood as:

> **A deterministic trust-state view derived from an independently
> selected bootstrap state plus the canonical history of committed,
> authorized trust-transition Actions.**

It remains required protocol context for `Verify`, but its authority does
not depend on a mutable configuration object.

No new semantic primitive is justified.

------------------------------------------------------------------------

## 16. New Validated Architectural Findings

### KV-F08 — Trust Evolution Uses the Existing Kernel

Revocation, rotation, recovery, and ownership transfer can be represented
as Actions evaluated under the currently effective trust state.

**Status:** PASS.

### KV-F09 — Trust State Need Not Be Semantically Mutable

The current trust state can be derived from an immutable history of
committed trust-transition Actions.

**Status:** PASS.

### KV-F10 — Authorized Does Not Mean Committed

Trust history must record committed transitions, not all transitions that
evaluated to `ALLOW`.

**Status:** PASS.

### KV-F11 — Canonical Trust Lineage Is Required

Verification requires an unambiguous prior trust state. Fork prevention
or canonical ordering is an execution/commit responsibility rather than
a new authorization primitive.

**Status:** PASS.

### KV-F12 — Mutable Trust Snapshots Are Optimizations

Implementations may materialize current trust state, but such snapshots
or caches are derived representations and are not the source of
authority.

**Status:** PASS.

### KV-F13 — Re-bootstrap Starts a New Continuity Domain

A discontinuous trust replacement must not be represented as an
authority-continuous transition.

**Status:** PASS.

------------------------------------------------------------------------

## 17. Updated Validation Backlog

### HYP-001 — Explicit Action completion predicate

Does every Action require a normative completion predicate?

**Status:** OPEN.

### HYP-002 — History-dependent authorization

Can historical limits and cumulative constraints be represented through
Claims and external state without introducing kernel state semantics?

**Status:** OPEN.

### HYP-003 — Concurrent Actions / canonical commit

Can multiple individually authorized Actions competing for constrained
external state be handled entirely at execution/commit semantics without
expanding the authorization kernel?

The immutable trust-history test strengthens the importance of this
question.

**Status:** OPEN — HIGH PRIORITY.

### HYP-004 — Rule as primitive

Can `Rule` itself be eliminated by treating `Evaluate` as execution of
an externally supplied deterministic function identified by hash, or
does naming Rule materially improve interoperability, auditability,
governance, and reproducibility?

**Status:** OPEN.

### HYP-005 — Trust Context binding

Must every authorization decision cryptographically bind the exact
derived Trust Context identifier/digest used during verification?

The immutable-history model strengthens the case for binding the
specific derived trust-state hash.

**Status:** OPEN.

### HYP-008 — Trust-history commitment

What protocol artifact establishes that a trust-transition Action was
actually committed to the canonical lineage rather than merely
authorized?

Can existing execution receipts / commit evidence express this without
adding a kernel primitive?

**Status:** PASS WITH RECEIPT CONSTRAINTS. `Commit` is required as an
explicit execution concept, but is not justified as a semantic kernel
primitive. A Receipt may prove commit only when it is an authoritative,
verifiable attestation from the execution domain that binds the Action
to the exact predecessor state and accepted successor state. A Receipt
does not create canonicality by asserting it.

------------------------------------------------------------------------


## 18. Pressure Test: Receipt vs. Commit

### Question

Can existing Receipt semantics prove that a trust-transition Action
became the canonical committed successor, or does the reduced kernel
require an explicit `Commit` / accepted-state-transition primitive?

### Result

**PASS FOR RECEIPT-BASED COMMIT EVIDENCE; REJECT `Commit` AS A NEW
SEMANTIC KERNEL PRIMITIVE.**

`Commit` is necessary as an execution concept because authorization and
execution are not equivalent:

```text
Evaluate(Action, Claims, Rule) -> ALLOW
```

means only that the Action is authorized. It does not establish that the
Action became authoritative external state.

The fact of commitment belongs to the execution domain. The protected
execution system is authoritative for whether the proposed transition
actually became accepted state.

VE therefore does not need a new semantic `Commit` primitive. It needs
an interoperable way to receive and verify **commit evidence**.

### Core distinction

```text
Authorization
    |
    | Evaluate -> ALLOW
    v
Execution attempt
    |
    v
External system accepts or rejects transition
    |
    v
Receipt / execution evidence
```

A Receipt records or carries evidence about what the authoritative
execution system reports happened.

A Receipt is not itself the act of commitment.

### Receipt cannot self-create canonicality

The following is insufficient:

```text
Receipt:
    action = A
    status = committed
```

An arbitrary actor could produce those bytes.

For commit evidence to establish a canonical transition, the Receipt
must be verifiable as originating from, or being anchored in, an
authority recognized for the relevant execution state.

Conceptually:

```text
Receipt C:
    action_hash = H(A)
    predecessor_state = H(Tn)
    outcome = committed
    successor_state = H(Tn+1)
    commit_reference = X
    issuer = CanonicalExecutionAuthority
```

Canonicality comes from the external execution authority and its commit
semantics, not from the Receipt object itself.

### Required binding for trust-transition receipts

For a Receipt to support deterministic trust-history reconstruction, it
must bind, directly or through verifiable referenced evidence, at least:

1. the exact Action committed;
2. the exact predecessor trust state against which the transition
   committed;
3. the execution outcome;
4. the accepted successor state, or sufficient deterministic data to
   derive it;
5. the authority or mechanism establishing that the transition was
   accepted by the canonical execution domain;
6. an identifier, sequence position, transaction reference, or other
   domain mechanism sufficient to distinguish the accepted transition
   from merely attempted or competing transitions.

The exact representation belongs to the Receipt / execution protocol,
not the semantic authorization kernel.

### Competing authorized transitions

Suppose:

```text
A:
    T1 -> T2

B:
    T1 -> T3
```

and:

```text
Evaluate(A) -> ALLOW
Evaluate(B) -> ALLOW
```

If A commits first, the authoritative execution system may produce:

```text
Receipt RA:
    action = H(A)
    predecessor = H(T1)
    outcome = committed
    successor = H(T2)
```

B may then produce:

```text
Receipt RB:
    action = H(B)
    predecessor = H(T1)
    outcome = rejected_stale
    observed_current_state = H(T2)
```

Only `RA` advances canonical trust history.

The authorization results remain historically true: both Actions may
have been authorized when evaluated. The Receipts establish different
execution outcomes.

### Submitted is not committed

This distinction generalizes:

```text
bank transfer submitted != transfer settled
database transaction authorized != transaction committed
write request accepted != canonical state updated
delivery authorized != authoritative channel accepted delivery
```

Therefore `Commit` is not trust-specific. It is an execution-domain fact.

### Uncertain outcomes

If the execution domain cannot establish whether the transition
committed, VE MUST NOT infer canonical commitment from authorization,
submission, timeout behavior, or absence of an error.

An uncertain Receipt cannot advance the canonical trust lineage.

### Does Receipt become a kernel primitive?

No.

The semantic authorization kernel remains:

```text
Action + Claim + Rule + Verify + Evaluate
```

Receipt belongs on the execution/evidence side of the protocol. It is
needed for durable, interoperable evidence of what happened after
authorization, not to express whether an Action was authorized.

### Does `Commit` need explicit specification?

**Yes, as an execution concept. No, as a semantic primitive.**

The protocol needs a normative distinction among at least:

```text
authorized
attempted / submitted
committed / accepted
rejected
uncertain
```

These MUST NOT be collapsed into one generic success state.

The exact execution-state vocabulary should remain aligned with the
existing Lifecycle and Receipt specifications rather than being added
casually to the authorization kernel.

### Architectural conclusion

```text
Action + Claims + Rule
        |
        v
Verify / Evaluate
        |
        v
Authorization Decision
        |
        v
Execution Boundary / Executor
        |
        v
Authoritative External Commit
        |
        v
Receipt / Commit Evidence
        |
        v
Canonical History
```

The authorization kernel determines legitimacy.

The execution domain determines whether reality changed.

Receipt provides verifiable evidence connecting those layers.

------------------------------------------------------------------------

## 19. New Validated Architectural Findings

### KV-F14 — Commit Is Distinct From Authorization

An `ALLOW` decision does not establish that an Action became accepted
external state.

**Status:** PASS.

### KV-F15 — Commit Does Not Require a Kernel Primitive

Commit is an execution-domain fact and does not add expressive power to
the authorization kernel.

**Status:** PASS FOR EXCLUSION.

### KV-F16 — Receipt May Prove Commit but Cannot Create Canonicality

A Receipt may establish canonical commit only when it is verifiably
anchored in an authority or mechanism recognized by the relevant
execution domain.

**Status:** PASS.

### KV-F17 — Canonical Trust History Requires Commit Evidence

A trust-transition Action may enter canonical trust history only after
authoritative commit evidence establishes acceptance against the exact
predecessor state.

**Status:** PASS.

### KV-F18 — Uncertainty Cannot Advance Canonical History

Authorization, submission, timeout, or uncertain execution evidence is
insufficient to advance canonical trust state.

**Status:** PASS.

### KV-F19 — Receipt Must Bind Execution Identity

Commit evidence for state transitions must bind the executed Action and
the relevant predecessor/successor-state relationship strongly enough to
prevent ambiguity, replay, or substitution.

**Status:** PASS.

------------------------------------------------------------------------

## 20. Updated Validation Backlog

### HYP-009 — Receipt sufficiency against approved VE-004

Does the currently approved `VE-004 Receipt` specification already
normatively support the bindings required by KV-F16 through KV-F19,
including authoritative commit outcome, predecessor state, successor
state or deterministic derivation, and canonical execution reference?

**Status:** REQUIRES SPECIFICATION COMPARISON BEFORE RFC.

### HYP-010 — Execution authority binding

How does a conforming implementation determine which executor, ledger,
database, platform, or proof mechanism is authoritative for asserting
that a particular Action committed, without reintroducing `Resource` as
a kernel primitive?

Can this authority be expressed entirely through Claims and Trust
Context scope?

**Status:** PASS. Execution authority can be expressed through Claims
whose applicability is scoped over canonical Action fields and verified
against the applicable Trust Context. `Resource` is not required as a
kernel primitive. The authoritative execution issuer or proof mechanism
must be established independently of the Receipt whose authority it is
used to verify.

------------------------------------------------------------------------


## 21. Pressure Test: Execution Authority Without `Resource`

### Question

Can execution authority — the authority entitled to establish that
reality actually changed — be expressed entirely through Claims and
Trust Context scope without restoring `Resource` as a semantic kernel
primitive?

### Result

**PASS — `Resource` remains unnecessary as a kernel primitive.**

Execution authority can be bound to a canonical predicate over the
proposed Action.

Examples:

```text
Claim:
    issuer: BankRoot
    predicate: authoritative_commit_evidence_issuer
    subject: BankLedgerKey
    scope:
        action.type = "bank.transfer"
        action.source_account.namespace = "bank-b://accounts/*"
```

```text
Claim:
    issuer: GitHubRoot
    predicate: authoritative_commit_evidence_issuer
    subject: GitHubExecutionKey
    scope:
        action.type = "github.repository.write"
        action.repository.owner = "VerifiedExecution"
```

```text
Claim:
    issuer: AttentionRoot
    predicate: authoritative_commit_evidence_issuer
    subject: AttentionGatewayKey
    scope:
        action.type = "communication.deliver"
        action.target = "person-X"
```

No universal `Resource` object is required. The target, namespace,
account, repository, state domain, or protected capability may remain
ordinary structured Action data.

### Required evaluation chain

The authority of commit evidence can be established as:

```text
Bootstrap / derived Trust Context
        |
        v
Verify authority Claim for scope S
        |
        v
Execution authority E established for Actions matching S
        |
        v
Verify Receipt / commit proof from E
        |
        v
Commit fact established for Action A
```

The Receipt cannot establish the authority of its own issuer.

The issuer or proof mechanism must already be authoritative under a Claim
whose authority chain terminates in the applicable Trust Context.

### Scope is not `Resource`

This pressure test requires a stable way to determine whether an
authority Claim applies to a proposed Action.

That does not justify a `Resource` primitive.

A scope may be expressed as a deterministic predicate over canonical
Action fields:

```text
scope(Action) -> true / false
```

Examples may include:

- action type;
- target identifier;
- namespace;
- account identifier;
- repository identifier;
- tenant;
- jurisdiction;
- capability;
- state-domain identifier;
- combinations of the above.

`Resource` would merely package some of these values into a distinguished
object without adding demonstrated expressive power.

### Canonical Action representation is required

Scope matching is safe only if conforming implementations agree on the
Action fields being matched.

For example, these must not accidentally represent different scopes:

```text
bank://account/123
BANK://ACCOUNT/123
account-123
```

if the protocol intends them to identify the same execution domain.

Therefore interoperability requires canonical Action representation,
canonical field semantics, or an explicitly identified canonicalization
procedure for fields used in authority scope matching.

This is a protocol requirement, not evidence for a `Resource` primitive.

### Multi-target Actions

An Action may affect multiple external targets:

```text
Action:
    type: deploy.release
    repository: repo-X
    cloud_account: cloud-Y
    dns_zone: zone-Z
```

Different commit facts may therefore require different execution
authorities.

This does not require a single `Resource` object.

Authority Claims can apply to different predicates over the same Action:

```text
GitHubAuthority -> repository commit evidence
CloudAuthority  -> deployment commit evidence
DNSAuthority    -> DNS commit evidence
```

A Rule or completion predicate can determine which combination of
established commit facts constitutes completion of the overall Action.

This reinforces the earlier finding that forcing a single `Resource`
onto an Action would be artificial.

### Authority may bind a proof mechanism, not an issuer

Some execution domains may not have a single authority that signs a
Receipt.

The Trust Context may instead recognize an authoritative verification
mechanism.

Examples:

```text
Claim:
    mechanism M is authoritative commit proof
    for scope S
```

Possible domain mechanisms include:

- a quorum certificate;
- ledger inclusion/finality proof;
- database transaction identifier plus authenticated state root;
- hardware attestation;
- platform-signed execution receipt.

Therefore "execution authority" means:

> the recognized authority or proof mechanism capable of establishing
> the relevant execution fact for an Action scope.

It is not necessarily a human, organization, executor process, or single
signing key.

### Conflicting execution authorities

If two authorities are both recognized for overlapping scope, the
Trust Context or authority Claims must provide deterministic composition
semantics sufficient to avoid ambiguous commit truth.

Examples may include:

```text
require authority A
require A AND B
require threshold 2-of-3
accept finality proof mechanism M
```

The candidate Receipt MUST NOT choose which authority composition applies
to itself.

This is the same non-self-authorization rule already established for
Rule applicability and Trust Context selection.

### Resource-elimination test

With `Resource`:

```text
Resource R
 -> execution authority E
 -> Receipt
```

Without `Resource`:

```text
Action A
 -> verified authority Claim applicable to canonical scope(A)
 -> execution authority / proof mechanism E
 -> Receipt
```

No tested expressive capability is lost.

`Resource` therefore remains eliminated from the candidate semantic
kernel.

### Candidate normative invariant

> **Execution Authority Independence:** A Receipt or commit proof MUST
> NOT establish, directly or indirectly, the authority of the issuer or
> proof mechanism whose authority is required to establish that Receipt
> or proof. Execution authority MUST derive from independently verified
> Claims applicable to the canonical scope of the Action.

### Candidate interoperability requirement

> **Canonical Scope Requirement:** Any Action fields used to determine
> Rule applicability, Claim applicability, Trust Context scope, or
> execution authority MUST have deterministic semantics and canonical
> representation sufficient for conforming implementations to reach the
> same applicability result.

**Status:** VALIDATED FINDINGS; NOT YET NORMATIVE.

------------------------------------------------------------------------

## 22. New Validated Architectural Findings

### KV-F20 — Execution Authority Can Be Claim-Scoped

The authority entitled to establish commit can be represented through
Claims scoped to canonical Action predicates and verified under the
applicable Trust Context.

**Status:** PASS.

### KV-F21 — Resource Remains Eliminated

Execution-authority selection does not require `Resource` as a semantic
kernel primitive when authority scope can refer directly to canonical
Action data.

**Status:** PASS.

### KV-F22 — Receipt Authority Must Be Independent

A Receipt or commit proof cannot establish the authority required to
trust its own issuer or verification mechanism.

**Status:** PASS.

### KV-F23 — Canonical Scope Is an Interoperability Requirement

Action fields used for authority, Rule, Claim, or Trust Context
applicability require deterministic semantics and canonical
representation.

**Status:** PASS.

### KV-F24 — Execution Authority May Be a Proof Mechanism

Commit truth may be established by an authoritative proof mechanism
rather than a uniquely identified executor or signer.

**Status:** PASS.

### KV-F25 — Multi-Target Actions Do Not Restore Resource

Different execution authorities may establish different commit facts
about one Action without requiring a universal Resource object.

**Status:** PASS.

------------------------------------------------------------------------

## 23. Updated Validation Backlog

### HYP-009 — Receipt sufficiency against approved VE-004

Does the currently approved `VE-004 Receipt` specification already
normatively support the bindings required by KV-F16 through KV-F19,
including authoritative commit outcome, predecessor state, successor
state or deterministic derivation, and canonical execution reference?

**Status:** PENDING DIRECT COMPARISON WITH THE APPROVED VE-004 TEXT.

The approved VE-004 artifact was not available in the accessible file
set during this validation update. No RFC conclusion may be drawn until
the normative specification is directly compared.

### HYP-011 — Canonical Action scoping

What is the minimum canonical representation required for Action fields
used in Rule applicability, Claim applicability, Trust Context scope, and
execution-authority scope?

Can canonical scoping be specified without introducing a new semantic
primitive or domain ontology?

**Status:** OPEN — HIGH PRIORITY.

### HYP-012 — Completion across multiple commit authorities

For an Action spanning several execution domains, can an Action
completion predicate plus independently verified commit evidence
deterministically establish overall completion without adding a
cross-resource transaction primitive?

**Status:** OPEN.

------------------------------------------------------------------------

## 24. Current Assessment

The reduced kernel continues to survive cross-domain pressure testing
without requiring domain-specific primitives.

The strongest current candidate semantic kernel remains:

```text
Action + Claim + Rule + Verify + Evaluate
```

The current evidence suggests:

- `Resource` does not need kernel status;
- communication does not need special semantics;
- identity, authority, delegation, human status, AI status, provenance,
  and permissions can be represented through Claims and Rules;
- Rule applicability can be Claim-driven;
- governance verification must terminate in independently selected trust
  roots;
- Trust Context is necessary and explicit but is not currently justified
  as a semantic primitive;
- Trust Context need not be a semantically mutable object;
- current trust state can be deterministically derived from bootstrap
  state plus canonical committed trust-transition history;
- revocation, rotation, recovery, and ownership transfer can use the
  existing Action/Claim/Rule/Verify/Evaluate machinery;
- mutable trust snapshots may exist for performance but are derived
  implementation state;
- authorization and commit remain separate: an `ALLOW` decision does not
  by itself advance trust history;
- `Commit` is required as an explicit execution concept but is not
  justified as a semantic kernel primitive;
- canonical trust history advances only on authoritative, verifiable
  commit evidence;
- Receipt can carry commit evidence but cannot make itself canonical;
- uncertain execution outcomes cannot advance canonical trust state.

No RFC is opened by this document alone.

The next required validation step is to compare these Receipt
requirements against the approved `VE-004 Receipt` specification. If
VE-004 does not already support authoritative commit binding, changing
it will require the normal RFC + ADR + version increment + changelog
process.

Execution-authority binding has now passed without restoring `Resource`.
Execution authority can derive from independently verified Claims scoped
over canonical Action data, or from an authoritative proof mechanism
recognized by the Trust Context.

The highest-priority remaining protocol question is canonical Action
scoping: conforming implementations must agree on the semantics and
canonical representation of Action fields used to select Rules, Claims,
Trust Context authority, and execution authority.

The approved `VE-004 Receipt` specification still requires direct
comparison before any RFC affecting Receipt semantics is opened.
