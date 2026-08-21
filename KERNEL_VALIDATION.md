# KERNEL_VALIDATION.md

**Project:** Verified Execution\
**Document:** Kernel Validation Record\
**Version:** 0.16\
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


------------------------------------------------------------------------

## 25. Specification Comparison: VE-004 v0.1 vs. Canonical Commit Requirements

### Result

**GAP CONFIRMED — VE-004 v0.1 is insufficient for portable canonical-commit verification.**

VE-004 v0.1 correctly establishes that Receipt is immutable, portable,
derived from authoritative Event history, and never authoritative
history itself.

However, its required fields are limited to:

```text
receipt_id
receipt_version
action_id
lifecycle_version
final_state
created_at
```

and its execution-related references are optional.

A conforming v0.1 Receipt therefore need not bind:

- authoritative execution outcome distinct from Lifecycle state;
- predecessor state;
- successor state;
- authoritative commit reference;
- independently established execution authority or proof mechanism;
- uncertainty semantics sufficient to prevent uncertain execution from
  advancing canonical state.

### Decision

The gap is semantically material.

RFC-003 and ADR-003 are justified.

VE-004 SHOULD be revised to v0.2 and accompanied by a changelog entry.

### Governance note

The inspected VE-004 artifact identifies itself as `Status: Draft`.
If repository governance treats Draft specifications as non-approved,
the formal RFC/ADR requirement may not be strictly mandatory.
Nevertheless, because the change is semantic, security-relevant, and
affects a Core Primitive Specification, the full change-control sequence
is recommended and has been prepared.

------------------------------------------------------------------------

## 26. Pressure Test: Canonical Action Scoping Without `Scope` or Domain Ontology

### Question

Can canonical Action scoping be defined strongly enough that two
independent implementations always agree about which Claims, Rules,
Trust Context authorities, and execution authorities apply, without
introducing `Scope` or a domain ontology as a semantic primitive?

### Result

**PASS, subject to explicit canonical-schema and predicate requirements.**

Neither a universal `Scope` object nor a VE-owned domain ontology is
required.

Interoperability requires an Action to carry or resolve to an explicit
schema contract and requires applicability predicates to operate
deterministically over the canonical representation defined by that
schema.

### Required inputs

For applicability decisions, two conforming implementations require the
same:

```text
Action bytes / canonical Action value
Action schema identifier + version or digest
Applicability predicate identifier / bytes
Predicate semantics version
Relevant Trust Context
```

Given those inputs, applicability MUST be deterministic.

### Action schema, not domain ontology

VE does not need to know what a bank account, repository, patient,
message, or cloud instance means globally.

A domain or application may define an Action schema such as:

```text
schema_id: bank.transfer.v1
fields:
    source_account
    destination_account
    amount
    currency
```

The schema defines:

- field names and types;
- canonical encoding;
- normalization rules where required;
- comparison semantics used by applicability predicates.

VE requires the schema contract to be identifiable and deterministic.
VE does not own the ontology represented by the schema.

### Applicability predicate

A Claim or governance binding may carry or reference a deterministic
predicate:

```text
applies(Action) -> true | false
```

Example:

```text
action.schema == "bank.transfer.v1"
AND
action.source_account.namespace == "bank-b"
```

`Scope` is therefore a useful descriptive word, but no distinct semantic
primitive is necessary.

### No hidden equivalence

Two textual identifiers MUST NOT be assumed equivalent merely because a
human considers them equivalent.

For example:

```text
bank://account/123
BANK://ACCOUNT/123
account-123
```

are equivalent only if the referenced Action schema defines a
normalization or identity rule that makes them equivalent.

If no such rule exists, implementations MUST NOT guess.

### Unknown schema or unsupported predicate

Fail-closed behavior is required.

If an implementation cannot resolve the required schema, canonicalize
the relevant Action fields, or execute the applicability predicate
according to the specified semantics, it MUST NOT treat the binding as
applicable merely by approximation.

### External state prohibited from pure applicability matching

The applicability predicate that selects a Claim, Rule, Trust Context
authority, or execution authority SHOULD be a pure deterministic
function of declared canonical inputs.

Dynamic facts such as:

- current time;
- account balance;
- revocation status;
- historical counts;

belong in Claims or other explicitly supplied verification/evaluation
inputs rather than hidden environment lookups during scope matching.

This prevents two implementations from selecting different governance
because their ambient state differs.

### Schema evolution

Action schema changes require explicit schema identity/version changes
or a canonical compatibility mechanism.

An applicability binding MUST be evaluated against the schema semantics
it identifies, not whichever schema version an implementation happens
to prefer.

### Multi-domain Actions

An Action may contain fields governed by multiple domain schemas or
substructures.

Applicability predicates may address those canonical substructures
without forcing VE to collapse them into a single `Resource`.

### Interoperability condition

For the applicability layer:

```text
Same canonical Action
+ same schema semantics
+ same applicability predicate
+ same predicate semantics
= same applicability result
```

This is sufficient for independent implementations to agree on which
candidate bindings apply.

Agreement about whether the resulting Claims verify or whether the
Action is authorized remains the responsibility of `Verify` and
`Evaluate`.

### Candidate normative invariant

> **Canonical Applicability Invariant:** Any binding whose applicability
> affects Rule selection, Claim selection, Trust Context authority, or
> execution authority MUST be evaluated as a deterministic predicate over
> explicitly identified canonical inputs. A conforming implementation
> MUST NOT infer undeclared domain equivalence or rely on hidden ambient
> state when determining applicability.

### Candidate protocol requirement

> **Action Schema Requirement:** Action data used in applicability
> decisions MUST be interpreted under an explicitly identified schema or
> canonicalization contract sufficient for independent implementations
> to produce the same field values and comparison results.

### Primitive decision

`Scope`: **not justified as a primitive.**

Domain ontology: **not required by VE.**

Action schema / canonicalization contract: **required protocol
mechanism, not semantic primitive.**

------------------------------------------------------------------------

## 27. New Validated Architectural Findings

### KV-F26 — VE-004 v0.1 Has a Canonical-Commit Gap

The existing Receipt specification does not normatively carry all
information required for portable canonical-commit verification.

**Status:** PASS.

### KV-F27 — Canonical Scoping Does Not Require `Scope`

Applicability can be represented as deterministic predicates over
canonical Action data.

**Status:** PASS.

### KV-F28 — VE Does Not Require a Domain Ontology

Domain semantics can remain external schema contracts identified by
version or digest.

**Status:** PASS.

### KV-F29 — Action Schema Identity Is Required for Applicability

Action fields used in governance or authority selection require an
explicit deterministic schema/canonicalization contract.

**Status:** PASS.

### KV-F30 — Applicability Must Fail Closed

Unknown schema, unsupported predicate semantics, or ambiguous
canonicalization MUST NOT be approximated as applicable.

**Status:** PASS.

### KV-F31 — Applicability Must Not Depend on Hidden Ambient State

Dynamic facts affecting authorization belong in explicit Claims or
evaluation inputs rather than implicit scope matching.

**Status:** PASS.

------------------------------------------------------------------------

## 28. Updated Validation Backlog

### HYP-013 — Action schema protocol object

What is the minimum interoperable protocol representation for an Action
schema identifier, version/digest, canonical encoding rules, and
applicability predicate semantics?

Can this be added as protocol machinery without altering the semantic
definition of Action?

**Status:** NEXT PRESSURE TEST CANDIDATE.

### HYP-014 — General non-self-authorization invariant

Can the repeated Rule, Trust Context, and Receipt independence findings
be collapsed into one normative invariant:

> No object or assertion may establish the authority required to
> establish itself.

Does that statement remain correct under delegation, threshold
authority, bootstrap roots, and recursive proof systems?

**Status:** OPEN.



------------------------------------------------------------------------

## 29. Pressure Test: Minimum Interoperable Action Schema Mechanism

### Question

What is the minimum interoperable `Action Schema` mechanism—schema
identifier, version/digest, canonical encoding, field semantics, and
applicability predicate language—such that two independent VE
implementations deterministically agree on applicability without VE
becoming a universal ontology or general-purpose programming language?

### Result

**PASS — a small content-addressed schema contract plus a deliberately
restricted selector language is sufficient.**

No new semantic primitive is justified.

The minimum protocol mechanism has five parts:

1. **Schema identity**
2. **Canonical Action encoding**
3. **Structural field contract**
4. **Deterministic field comparison semantics**
5. **Restricted applicability selector**

### 29.1 Schema identity

Every Action used in applicability decisions MUST identify the schema
under which its fields are interpreted.

The normative schema identity SHOULD be content-addressed:

```text
schema_digest = H(canonical_schema_descriptor)
```

A human-readable `schema_id` and semantic `version` MAY exist for
operational clarity, but neither is sufficient for protocol identity
without the digest.

Recommended model:

```text
schema_ref:
    id: "bank.transfer"
    version: "1"
    digest: "..."
```

The digest is the authoritative identity of the schema contract.

This prevents two implementations from silently using different schema
definitions that share the same human-readable name or version.

### 29.2 Canonical Action encoding

An Action participating in applicability matching MUST have one
deterministic canonical byte representation under its schema.

The protocol MUST define or identify a canonical encoding profile.

Canonicalization MUST NOT depend on:

- implementation language;
- map/object insertion order;
- locale;
- floating-point approximation;
- ambient timezone;
- platform-specific Unicode behavior;
- undeclared normalization.

The exact serialization format is protocol machinery, not a semantic
primitive.

### 29.3 Structural field contract

The Action schema SHOULD define only what deterministic interpretation
requires:

- field path / name;
- required vs. optional;
- structural type;
- canonical representation;
- permitted normalization profile, if any;
- comparison semantics identifier, if non-default.

The schema MUST NOT attempt to define the full real-world ontology of
the domain.

Example:

```text
field: source_account
type: string
normalization: none
comparison: exact_bytes
```

A banking specification may document what `source_account` means, but VE
does not need a universal semantic theory of bank accounts.

### 29.4 Restricted normalization

A schema MUST NOT embed arbitrary normalization code.

Any normalization used for applicability matching MUST reference a
finite protocol-defined normalization profile.

Examples might include:

```text
none
utf8_nfc
ascii_lowercase
canonical_decimal
canonical_timestamp
```

The initial protocol SHOULD prefer `none` unless normalization is
strictly necessary.

Unknown normalization profiles MUST fail closed.

### 29.5 Applicability selector

Applicability MUST NOT use a general-purpose programming language.

The selector language SHOULD be a small declarative data structure over
canonical Action fields.

Minimum candidate operators:

```text
all
any
not
exists
eq
in
lt
lte
gt
gte
prefix
```

Operators MUST have protocol-defined deterministic semantics.

No operator may:

- invoke external services;
- read ambient state;
- execute user-supplied code;
- recurse without a protocol-defined finite bound;
- perform unbounded iteration;
- mutate state;
- inspect Claims;
- perform cryptographic verification;
- call `Evaluate`;
- interpret arbitrary domain semantics.

### 29.6 Selector is candidate selection, not policy

This distinction is normative in spirit:

> Applicability answers only whether a binding is a candidate for the
> canonical Action.

It does not answer whether the Action is authorized.

Example:

```text
selector:
    all:
      - eq: [action.schema_ref.digest, "..."]
      - prefix: [action.source_account, "bank-b://"]
```

This may select a Rule or authority Claim.

Whether a transfer is permitted because the amount is below a limit,
the delegation remains valid, or a human approved it belongs in:

```text
Claims + Rule + Verify + Evaluate
```

not in selector semantics.

This prevents the applicability mechanism from becoming a second policy
language.

### 29.7 No hidden external state

Selectors MUST be pure deterministic functions over explicit canonical
inputs.

The following do not belong in selectors:

```text
current_time()
current_balance()
is_revoked()
count_prior_actions()
fetch_registry()
```

Those values, when relevant, must be represented through explicit
Claims or other protocol-defined evaluation inputs.

### 29.8 Failure semantics

Applicability MUST fail closed.

If an implementation cannot:

- resolve the identified schema;
- verify the schema digest;
- apply the required canonical encoding;
- understand a required normalization profile;
- understand a selector operator;
- deterministically interpret a referenced field;

it MUST NOT treat the selector as matched.

An implementation MAY return a protocol error distinct from
`selector = false`, but it MUST NOT approximate.

### 29.9 Schema resolution

VE does not require a centralized schema registry.

A schema may be:

- embedded;
- bundled;
- fetched from a domain-defined resolver;
- referenced by content-addressed storage;
- included in an execution profile.

Regardless of transport, the resolved descriptor MUST match the
declared digest before use.

### 29.10 Schema evolution

A semantic schema change produces a new schema digest.

Human-readable version labels MAY aid governance, but content identity
is controlled by the digest.

A selector bound to schema digest `D1` MUST NOT silently apply to `D2`
unless the selector or protocol explicitly permits both.

### 29.11 Cross-schema selectors

The minimal model SHOULD NOT define automatic semantic compatibility
between schemas.

If one authority binding intentionally applies to several schemas, it
must identify them explicitly, for example:

```text
schema_digest in {D1, D2, D3}
```

VE MUST NOT infer that `bank.transfer.v1` and `bank.transfer.v2` are
equivalent because their names are similar.

### 29.12 Why a digest is stronger than version alone

Version identifiers are governance labels.

A digest is a content commitment.

Two teams can accidentally or maliciously publish different schema
content under the same:

```text
id = "bank.transfer"
version = "1"
```

but they cannot produce the same secure digest for materially different
canonical descriptors under the selected hash function.

Therefore:

> human-readable schema ID/version is metadata; schema digest is
> protocol identity.

### 29.13 Minimal object boundary

The resulting protocol stack is:

```text
Action
  |
  +-- schema_ref
        |
        +-- id          (optional operational label)
        +-- version     (optional operational label)
        +-- digest      (normative identity)
  |
  +-- canonical fields
        |
        v
restricted selector
        |
        v
candidate binding(s)
        |
        v
Verify / Evaluate
```

`Action Schema` is protocol machinery.

`Selector` is protocol machinery.

Neither is promoted to the semantic kernel.

### 29.14 Architectural conclusion

The minimum interoperable mechanism is:

> **A content-addressed Action schema that deterministically defines
> canonical field representation, combined with a deliberately
> non-Turing-complete selector language restricted to pure structural
> predicates over canonical Action data.**

The protocol SHOULD make applicability less expressive than Rule
evaluation by design.

This preserves deterministic scoping without creating:

- a VE domain ontology;
- a second policy language;
- user-supplied executable code;
- hidden environmental dependencies.

------------------------------------------------------------------------

## 30. New Validated Architectural Findings

### KV-F32 — Schema Digest Is the Normative Schema Identity

Human-readable schema ID and version may exist, but interoperability
requires a content commitment to the exact schema contract.

**Status:** PASS.

### KV-F33 — Canonical Encoding Is Security-Relevant Protocol Machinery

Action canonicalization is required for deterministic authority and Rule
selection but does not justify a new semantic primitive.

**Status:** PASS.

### KV-F34 — Field Semantics Must Remain Structural

VE needs deterministic field representation and comparison semantics,
not a universal ontology of the represented domain.

**Status:** PASS.

### KV-F35 — Applicability Must Be Weaker Than Rule Evaluation

Applicability selectors should perform only pure structural matching over
canonical Action data. Dynamic authorization semantics remain in
Claims/Rules/Verify/Evaluate.

**Status:** PASS.

### KV-F36 — Arbitrary Selector Code Is Rejected

Selectors must not permit user-supplied general-purpose code, external
calls, hidden state, or unbounded computation.

**Status:** PASS.

### KV-F37 — Schema Resolution Does Not Require a Central Registry

Schemas may be transported through multiple mechanisms provided the
resolved descriptor matches the declared content digest.

**Status:** PASS.

### KV-F38 — Schema Evolution Is Explicit

A semantic schema change changes the schema digest. Compatibility MUST
NOT be inferred from names or version labels.

**Status:** PASS.

------------------------------------------------------------------------

## 31. Updated Validation Backlog

### HYP-015 — Minimal selector operator set

Is the candidate structural operator set:

```text
all, any, not, exists, eq, in, lt, lte, gt, gte, prefix
```

sufficient for cross-domain applicability without introducing regex,
arbitrary expressions, functions, or domain-specific operators?

**Status:** NEXT PRESSURE TEST CANDIDATE.

### HYP-016 — Canonical Action digest

Should every Action itself carry a canonical digest derived from its
schema digest plus canonical Action bytes, so that Claims, Rules,
Receipts, and execution evidence can bind the exact Action without
depending only on an implementation-assigned `action_id`?

**Status:** OPEN — HIGH PRIORITY.

### HYP-017 — Schema descriptor format

What is the minimum canonical schema-descriptor format needed to express
field paths, structural types, requiredness, normalization profile, and
comparison semantics without turning the descriptor into a second schema
language ecosystem?

**Status:** OPEN.

------------------------------------------------------------------------


------------------------------------------------------------------------

## 32. Pressure Test: Minimum Selector Operator Set

### Question

What is the smallest selector operator set that can express legitimate
cross-domain authority scopes while making it structurally difficult for
applicability to evolve into a second policy language?

### Result

**PASS — the selector can be reduced to three comparison forms with
implicit conjunction:**

```text
eq
in
prefix
```

A selector is a finite set of field constraints. All constraints in one
selector are implicitly ANDed.

No separate `all` operator is required.

Example:

```text
selector:
    action.schema_ref.digest:
        eq: D1
    action.source_account:
        prefix: "bank-b://"
    action.currency:
        in: ["CAD", "USD"]
```

means:

```text
schema_digest == D1
AND
source_account starts with "bank-b://"
AND
currency is one of {"CAD", "USD"}
```

### 32.1 Why `eq` is required

Exact matching is the fundamental routing operation.

Examples:

```text
action.schema_ref.digest == D1
action.type == "communication.deliver"
action.target == "person-X"
action.repository.owner == "VerifiedExecution"
```

Without `eq`, even basic authority scoping is impossible.

### 32.2 Why `in` is required

`in` permits a finite enumerated set without introducing general OR.

Examples:

```text
schema_digest in {D1, D2, D3}
region in {"ca-central-1", "us-east-1"}
currency in {"CAD", "USD"}
```

This supports explicit compatibility and multi-value routing while
remaining finite and structural.

`in` MUST mean exact membership under the field's canonical comparison
semantics.

### 32.3 Why `prefix` is required

Hierarchical namespaces are common across execution domains:

```text
bank-b://accounts/*
github://VerifiedExecution/*
aws://account/123/*
person://X/attention/*
```

`prefix` allows deterministic subtree / namespace routing without regex,
glob, or arbitrary pattern languages.

`prefix` MUST operate only on canonical field representations whose
schema explicitly permits prefix comparison.

### 32.4 Why conjunction should be implicit

A selector normally needs to narrow by several independent structural
dimensions:

```text
schema = D1
AND
account namespace = bank-b
AND
region = ca-central-1
```

Instead of adding an `all` operator, the selector container itself
defines conjunction.

This removes one operator while preserving necessary expressiveness.

### 32.5 Why `any` / OR is rejected

General OR increases expression complexity and encourages policy-like
logic.

Instead of:

```text
owner = A OR region = B
```

define two independent bindings:

```text
Binding 1 selector:
    owner = A

Binding 2 selector:
    region = B
```

Each binding is independently auditable and independently authoritative.

This makes alternatives explicit at the binding layer rather than hiding
them inside selector logic.

### 32.6 Why `not` is rejected

Negation creates broad residual scopes:

```text
NOT jurisdiction = X
NOT action.type = Y
```

Such selectors are difficult to reason about and behave like policy
exclusions rather than routing.

If an authority applies to a finite positive domain, that domain should
be stated positively.

Negative authorization conditions belong in Rules.

### 32.7 Why `exists` is rejected

Field existence does not require a dedicated operator.

Referencing a field in a selector implicitly requires the field to be
present and canonically interpretable.

If the field is absent:

```text
selector does not match
```

This eliminates another operator.

### 32.8 Why numeric comparisons are rejected

The following operators are removed from applicability:

```text
lt
lte
gt
gte
```

Examples such as:

```text
amount < 1000
time < expiry
risk_score >= 80
```

are policy conditions, not structural routing.

They belong in Claims + Rule + Verify + Evaluate.

Allowing thresholds in selectors would create a second authorization
language.

### 32.9 Why regex / glob / arbitrary matching is rejected

Regex and general glob syntax are substantially more expressive than
necessary and introduce:

- engine-version differences;
- Unicode and locale ambiguity;
- catastrophic backtracking risk;
- hidden pattern-language complexity;
- difficult auditability.

Hierarchical matching should use canonical `prefix`.

Finite alternatives should use `in`.

Exact values should use `eq`.

### 32.10 Why functions and arithmetic are rejected

Selectors MUST NOT support:

```text
add
subtract
multiply
divide
length
contains
substring
date arithmetic
custom functions
user-defined functions
```

These operations are not necessary for authority routing and create
policy/computation semantics.

### 32.11 No nested boolean language

The minimal selector is not an expression tree.

It is a flat finite map of canonical field paths to one constraint each.

Conceptually:

```text
Selector = {
    field_1: Constraint,
    field_2: Constraint,
    ...
}
```

with:

```text
Constraint = EQ(value)
           | IN(finite_set)
           | PREFIX(value)
```

All entries are conjunctive.

No nested selectors.

No recursion.

No arbitrary boolean composition.

### 32.12 Alternatives use multiple bindings

If one authority applies to multiple structurally different domains, the
protocol should represent multiple bindings.

Example:

```text
Binding A:
    authority = E
    selector:
        schema_digest eq D1
        region eq "ca-central-1"

Binding B:
    authority = E
    selector:
        schema_digest eq D2
        tenant prefix "org-x/"
```

This is more verbose than OR, but intentionally so.

It improves:

- auditability;
- revocation precision;
- independent versioning;
- authority reasoning;
- implementation simplicity.

### 32.13 Selector complexity bounds

A conforming protocol SHOULD impose finite limits on:

- selector byte size;
- number of field constraints;
- maximum `in` set size;
- maximum prefix length;
- canonical field-path depth.

These are denial-of-service and implementation-consistency protections,
not semantic features.

### 32.14 Field-path semantics

Field paths referenced by selectors MUST be defined by the Action schema.

Selectors MUST NOT dynamically discover fields or introspect arbitrary
nested objects.

A missing field causes non-match.

An unknown field path or unsupported comparison mode MUST fail closed.

### 32.15 Separation from Rule

The boundary is now sharp:

```text
Selector:
    Which binding is structurally applicable?

Rule:
    Given applicable Claims and conditions, is the Action authorized?
```

Selectors may answer:

```text
this is a bank.transfer.v1 Action
from the bank-b namespace
in region ca-central-1
```

Selectors may not answer:

```text
the amount is safe
the delegation is valid
the transfer is within daily limits
the user approved it
the current time is allowed
```

The first set is routing.

The second set is governance.

### 32.16 Minimal grammar

Conceptually:

```text
selector := constraint*

constraint :=
    field_path eq canonical_value
  | field_path in finite_set<canonical_value>
  | field_path prefix canonical_prefix
```

with all constraints conjunctive.

This grammar is deliberately not Turing-complete and is not intended to
grow toward general expression evaluation.

### 32.17 Architectural conclusion

The smallest selector mechanism currently justified is:

> **A flat conjunctive set of exact-match, finite-membership, and
> canonical-prefix constraints over explicitly declared Action fields.**

No:

```text
all
any
not
exists
lt
lte
gt
gte
regex
glob
functions
arithmetic
external state
nested boolean expressions
```

is required.

This makes selector semantics resemble routing tables rather than policy
programs.

------------------------------------------------------------------------

## 33. New Validated Architectural Findings

### KV-F39 — Three Constraint Forms Are Sufficient

The tested cross-domain authority scopes can be represented with `eq`,
`in`, and `prefix` plus implicit conjunction.

**Status:** PASS.

### KV-F40 — Conjunction Is Structural, Not an Operator

The selector container itself defines AND semantics; no `all` operator is
required.

**Status:** PASS.

### KV-F41 — Disjunction Belongs at the Binding Layer

Alternative scopes should be represented as multiple bindings rather than
an `any` / OR selector operator.

**Status:** PASS.

### KV-F42 — Negation Is Rejected

Negative selector logic is unnecessary for routing and risks converting
applicability into policy.

**Status:** PASS.

### KV-F43 — Numeric and Temporal Comparisons Are Rejected

Threshold conditions belong in Rules and explicit Claims, not selector
matching.

**Status:** PASS.

### KV-F44 — Field Presence Is Implicit

Referencing a field requires that field to exist and be canonically
interpretable; a separate `exists` operator is unnecessary.

**Status:** PASS.

### KV-F45 — Selector Is Flat and Non-Recursive

Nested boolean expression trees are not justified and are rejected from
the minimum mechanism.

**Status:** PASS.

------------------------------------------------------------------------

## 34. Updated Validation Backlog

### HYP-016 — Canonical Action digest

Should every Action itself carry a canonical digest derived from its
schema digest plus canonical Action bytes, so that Claims, Rules,
Receipts, and execution evidence can bind the exact Action without
depending only on an implementation-assigned `action_id`?

**Status:** NEXT PRESSURE TEST CANDIDATE — HIGH PRIORITY.

### HYP-017 — Schema descriptor format

What is the minimum canonical schema-descriptor format needed to express
field paths, structural types, requiredness, normalization profile, and
comparison semantics without turning the descriptor into a second schema
language ecosystem?

**Status:** OPEN.

### HYP-018 — Selector binding identity

Should each applicability binding itself have a canonical digest so that
Claims, Rules, and authority delegations can refer to the exact selector
contract without copying selector bytes?

**Status:** OPEN.

------------------------------------------------------------------------

------------------------------------------------------------------------

## 35. Pressure Test: Canonical Action Digest vs. Action ID

### Question

Should every Action have a canonical cryptographic digest derived from
its schema digest plus canonical Action bytes, making the Action content
addressable? If so, does `action_id` become merely metadata rather than
identity?

### Result

**PASS FOR A REQUIRED CANONICAL ACTION DIGEST.**

**REJECT the conclusion that `action_id` becomes merely metadata.**

The correct model is **dual identity**:

```text
action_digest = identity of the exact Action content
action_id     = identity of the Action execution instance
```

These solve different problems and MUST NOT be conflated.

### 35.1 Canonical Action digest

Every Action used in authorization, authority binding, Receipt binding,
or execution evidence SHOULD have a canonical digest derived from:

```text
action_digest = H(schema_digest || canonical_action_bytes)
```

The exact framing and domain separation MUST be protocol-defined.

The digest binds the exact schema contract and the exact canonical Action
content.

### 35.2 Why schema digest must participate

Hashing canonical Action bytes without binding the schema is
insufficient because identical bytes can have different meanings under
different schemas.

Therefore schema identity MUST participate in Action content identity.

### 35.3 Why `action_id` still matters

Two Action instances can have identical semantic content while remaining
distinct execution occurrences.

Example:

```text
A1: transfer 100 CAD from X to Y
A2: transfer 100 CAD from X to Y
```

If their schema and semantic payload are identical:

```text
digest(A1) == digest(A2)
```

Yet A1 and A2 may have different authorization history, execution
attempts, Lifecycle history, Receipts, cancellation state, external
commit references, and audit positions.

### 35.4 Content identity vs. occurrence identity

The protocol therefore needs both:

```text
Action Content Identity  -> action_digest
Action Instance Identity -> action_id
```

`action_digest` answers:

> Exactly what was proposed?

`action_id` answers:

> Which execution instance are we talking about?

### 35.5 `action_id` is not semantic content

Changing only `action_id` while preserving the same schema and semantic
payload SHOULD preserve the same `action_digest`.

`action_id` SHOULD NOT determine the semantic meaning of the Action.

### 35.6 Semantic payload boundary

A candidate representation is:

```text
Action Envelope:
    action_id
    schema_ref
    action_payload
```

with:

```text
action_digest =
    H(schema_ref.digest || canonical(action_payload))
```

Every field whose value changes the proposed execution semantics or
applicability semantics MUST be included in `action_payload`.

Pure occurrence metadata SHOULD remain outside that payload.

The exact boundary requires normative definition.

### 35.7 Timestamps, nonces, and correlation identifiers

A timestamp, nonce, retry counter, or correlation ID MUST NOT be added to
semantic content merely to force digest uniqueness.

If the value changes Action meaning or admissibility, it belongs in the
semantic payload and therefore the digest.

If it only distinguishes execution occurrences, it belongs in the
instance envelope associated with `action_id`.

### 35.8 Claims may bind content or instance

Some Claims should bind exact content:

```text
Human H approves action_digest D
```

Other Claims may intentionally bind a specific execution occurrence:

```text
Human H approves action_id A1
```

The protocol must distinguish these semantics.

An approval intended to authorize exact Action content SHOULD bind the
digest, not merely an opaque identifier.

### 35.9 Receipts should bind both

A strong Receipt SHOULD identify:

```text
action_id
action_digest
```

This provides both occurrence identity and exact content identity.

### 35.10 Execution evidence should bind content

Commit evidence SHOULD bind `action_digest`, directly or through an
authoritative mapping from `action_id`.

This reduces substitution risk between an execution instance and
different Action content.

### 35.11 Digest equality is not idempotency

Implementations MAY use the digest for equivalence detection, caching, or
deduplication assistance.

They MUST NOT assume:

```text
same action_digest => same execution instance
```

or:

```text
same action_digest => execute only once
```

unless an execution profile explicitly defines that behavior.

Replay prevention and exactly-once semantics remain separate concerns.

### 35.12 Hash agility

The digest representation SHOULD identify its hash suite or algorithm.

A single hash algorithm SHOULD NOT be permanently implicit in the
architecture.

### 35.13 Architectural conclusion

The Action should become **content-addressable**, but not
**content-identified exclusively**.

Candidate invariant:

> **An Action MUST have a deterministic cryptographic content identity,
> and an execution instance MUST remain separately identifiable.**

------------------------------------------------------------------------

## 36. New Validated Architectural Findings

### KV-F46 — Canonical Action Digest Is Required

The exact semantic Action content should have a deterministic digest
derived from the schema digest and canonical Action payload.

**Status:** PASS.

### KV-F47 — Schema Identity Must Be Bound Into Action Digest

Canonical Action bytes without schema identity are insufficient for
stable semantic content identity.

**Status:** PASS.

### KV-F48 — Action ID Remains Distinct

`action_id` identifies the execution instance and does not collapse into
mere metadata.

**Status:** PASS.

### KV-F49 — Digest Is Content Identity, Not Occurrence Identity

Identical Action content may legitimately produce multiple independent
Action instances with the same digest.

**Status:** PASS.

### KV-F50 — Receipts Should Bind ID and Digest

Portable resolution evidence should identify both the execution instance
and the exact Action content.

**Status:** PASS.

### KV-F51 — Digest Equality Does Not Imply Idempotency

Replay prevention, deduplication, and exactly-once semantics remain
execution/profile concerns.

**Status:** PASS.

### KV-F52 — Semantic Payload Boundary Must Be Explicit

The protocol must distinguish semantic Action fields included in the
digest from instance-level envelope metadata.

**Status:** PASS.

------------------------------------------------------------------------

## 37. Updated Validation Backlog

### HYP-019 — Action envelope vs. semantic payload

What exact fields belong in the Action envelope versus the canonical
semantic payload?

Should `action_id`, timestamps, correlation identifiers, provenance
references, and schema metadata sit outside the hashed semantic payload,
and which of them—if any—must nevertheless be cryptographically bound to
the instance?

**Status:** NEXT PRESSURE TEST CANDIDATE.

### HYP-020 — Receipt Action digest requirement

Should VE-004 v0.2 require `action_digest` in addition to `action_id`,
rather than leaving stronger Action binding to a future Action
specification?

**Status:** OPEN; compare with RFC-003 before accepting VE-004 v0.2.

### HYP-021 — Digest suite

What minimum digest-suite representation provides algorithm agility
without unnecessary cryptographic negotiation complexity?

**Status:** OPEN.

------------------------------------------------------------------------


------------------------------------------------------------------------

## 38. Pressure Test: Action Envelope vs. Canonical Semantic Payload

### Question

What belongs in the Action envelope versus the canonical semantic payload,
and which occurrence fields must be cryptographically bound to the
content/occurrence relationship?

### Result

**PASS — separate semantic content identity from occurrence identity, but
do not require a third universal Action identity.**

The Action is modeled logically as:

```text
Action
├── Instance Envelope
│   └── action_id
└── Semantic Payload
    ├── schema_digest
    └── schema-defined semantic fields
```

The required identities are:

```text
action_id     = historical Action occurrence identity
action_digest = deterministic semantic content identity
```

with:

```text
action_digest =
    H(
        domain_separator
        ||
        schema_digest
        ||
        canonical_semantic_payload
    )
```

Any authoritative artifact whose meaning depends on one particular Action
occurrence carrying particular semantic content MUST cryptographically
bind at least:

```text
(action_id, action_digest)
```

A protocol MAY derive a compact commitment over this tuple plus additional
bound occurrence fields, but such a commitment is protocol machinery and
is **not** a third universal Action identity.

### 38.1 Semantic payload inclusion rule

A field MUST be part of canonical Semantic Payload if changing it can
change:

- the requested external effect;
- target or destination;
- quantity, capability, method, or operation;
- deterministic applicability of Claims, Rules, Trust Context authority,
  or execution authority;
- completion semantics;
- an explicit constraint that is part of the proposal.

The test is:

> If two Actions differ only in field X, could a legitimate authority
> distinguish them because the proposed execution, deterministic
> applicability, or completion semantics differ?

If yes, X is semantic Action content.

### 38.2 Occurrence fields

Occurrence-level fields MAY include:

```text
action_id
instance_created_at
correlation_id
parent / causation reference
instance_nonce
envelope_version
non-authoritative routing hints
```

Protocols defining such fields MUST classify them as:

```text
bound authoritative
unbound / non-authoritative
local implementation metadata
```

Not every occurrence field is automatically bound.

A field whose mutation could alter interpretation, provenance, replay
behavior, or authoritative history relied upon by an artifact MUST
participate in that artifact's cryptographic binding.

### 38.3 Timing and nonces

Timing and nonce fields are classified by purpose.

If a value changes the proposed execution semantics, it belongs in
Semantic Payload and affects `action_digest`.

If it merely distinguishes or records an occurrence, it belongs in the
Instance Envelope.

Random occurrence values MUST NOT be inserted into Semantic Payload merely
to force unique `action_digest` values.

### 38.4 Actor / proposer identity

Actor or proposer identity is not universally semantic Action content.

The same proposed effect may originate from different actors while
retaining the same `action_digest`.

Identity becomes semantic only when represented identity changes the
requested external effect itself.

### 38.5 Governance references

An Action-carried Rule, selector, Trust Context, authority, or execution
authority reference cannot establish its own applicability or authority.

Such references are non-authoritative hints unless independently
established.

### 38.6 Receipts and execution evidence

A Receipt or execution artifact concerning a particular Action occurrence
SHOULD bind:

```text
action_id
action_digest
```

plus any additional authoritative occurrence fields on which that
artifact's semantics rely.

No `instance_digest` field is required by the architecture.

### 38.7 Architectural conclusion

The minimum robust model is:

> **Give semantic content one deterministic cryptographic identity, retain
> a separate historical occurrence identity, and require authoritative
> artifacts to bind those identities together whenever their association
> matters.**

This preserves content equivalence without leaving occurrence/content
association cryptographically ambiguous.

------------------------------------------------------------------------

## 39. Corrected Validated Architectural Findings

### KV-F53 — Action Has Two Required Identities

Every authoritative Action requires:

```text
action_id
action_digest
```

for occurrence identity and semantic content identity respectively.

**Status:** PASS.

### KV-F54 — Semantic Payload Is Defined by Effect-Relevance

Any field whose change can change the proposed execution, deterministic
applicability, or completion semantics belongs in canonical Semantic
Payload.

**Status:** PASS.

### KV-F55 — Occurrence and Content Must Be Bindable

Authoritative artifacts whose meaning depends on a particular occurrence
carrying particular content must cryptographically bind
`(action_id, action_digest)`.

**Status:** PASS.

### KV-F56 — A Universal `instance_digest` Is Not Required

A derived occurrence/content commitment may be useful protocol machinery,
but it is removable without loss of architecture and therefore is not a
third universal Action identity.

**Status:** PASS FOR EXCLUSION.

### KV-F57 — Occurrence Metadata Must Not Pollute Content Identity

Pure occurrence fields must not enter Semantic Payload merely to force
digest uniqueness.

**Status:** PASS.

### KV-F58 — Timing and Nonces Are Purpose-Dependent

Timing values and nonces are semantic only when they change the proposal;
otherwise they are occurrence-level fields.

**Status:** PASS.

### KV-F59 — Actor Is Not Automatically Semantic Action Content

Proposer identity remains Claim/provenance information unless represented
identity changes the requested effect.

**Status:** PASS.

### KV-F60 — Governance References Carried by an Action Are Non-Authoritative

Rule, Trust Context, selector, or authority hints cannot establish their
own applicability by inclusion.

**Status:** PASS.

------------------------------------------------------------------------

## 40. Direct Specification Comparison: VE-001 v0.1

### Result

**SUBSTANTIVE GAP CONFIRMED.**

VE-001 v0.1 correctly established Action immutability, historical Action
identity, same-content/different-Action semantics, separation from
idempotency identity, retry-vs-Action distinction, and the future need
for canonical hashing.

The required v0.2 corrections are:

1. add required `action_digest`;
2. retain `action_id` as historical occurrence identity;
3. require cryptographic binding of `(action_id, action_digest)` where an
   authoritative artifact depends on that association;
4. bind `schema_digest` into `action_digest`;
5. move occurrence-only creation time out of Semantic Payload;
6. remove initiator as universally required semantic payload;
7. remove authority context as universally required semantic payload;
8. remove universal `scope`;
9. make effect fields schema-defined rather than a VE domain ontology;
10. make Action hashing normative;
11. do **not** introduce a mandatory `instance_digest`.

### Governance consequence

RFC-004 v0.2 and ADR-004 were justified and accepted.

VE-001 v0.2 implements the corrected dual-identity model.

------------------------------------------------------------------------

## 41. Validated VE-001 Findings

### KV-F61 — VE-001 v0.1 Had an Identity-Layer Gap

The v0.1 specification lacked required canonical content identity and an
explicit occurrence/content binding invariant.

**Status:** PASS.

### KV-F62 — Existing Action ID Semantics Remain Valuable

VE-001 v0.1 historical identity maps cleanly to `action_id` as occurrence
identity.

**Status:** PASS.

### KV-F63 — Initiator Was Over-Specified

Initiator identity should not be universally required semantic Action
content.

**Status:** PASS.

### KV-F64 — Authority Context Was Over-Specified

Authority must be established independently rather than embedded as
universal Action semantics.

**Status:** PASS.

### KV-F65 — Universal Action Scope Was Removed

Applicability selectors over schema-defined canonical Action fields
replace universal semantic `scope`.

**Status:** PASS.

### KV-F66 — Action Hashing Is Normative

Optional hashing is insufficient for interoperable binding across Claims,
Rules, Receipts, and execution evidence.

**Status:** PASS.

------------------------------------------------------------------------

## 42. Pressure Test: Canonical Encoding Placement

### Result

**PASS WITH NORMATIVE EXTERNAL DEPENDENCY.**

Canonical encoding MUST be normative for cryptographic interoperability,
but it does not need to be embedded inside the Action semantic
specification.

VE-001 defines:

```text
what values form semantic identity
which identity properties are required
```

A separate Canonical Encoding Profile defines:

```text
exact bytes
framing
domain separation
primitive representation
ordering
Unicode treatment
numeric representation
null/absence semantics
digest-suite representation
schema-descriptor encoding
```

VE-001 MUST NOT claim complete cryptographic interoperability unless the
same normative profile is pinned.

------------------------------------------------------------------------

## 43. Pressure Test: One Canonical Profile Across VE Object Classes

### Question

Can one canonical encoding profile safely canonicalize Action schemas,
Action payloads, Claims, Rules, Receipts, and Trust Context history, or
do separate object classes require separate canonicalization profiles
over one common canonical data model?

### Result

**PASS FOR ONE SHARED CANONICAL REPRESENTATION LAYER.**

The architecture does **not** require a separate byte-encoding profile
for each protocol object class.

The stronger model is:

```text
Common Canonical Data Model
          |
          v
One Canonical Byte Encoding Profile
          |
          +--> Action Schema descriptor
          +--> Action Semantic Payload
          +--> Claim
          +--> Rule descriptor / Rule artifact reference
          +--> Receipt
          +--> Trust transition record
```

Object-specific specifications still define:

- which fields exist;
- which fields are semantic;
- required/optional fields;
- validation rules;
- object-specific hash domain separator;
- which substructure is included in a given digest.

The shared representation layer defines only how already-determined
canonical values become deterministic bytes.

### 43.1 Why one common data model is desirable

If Action, Claim, Receipt, and Trust history each invent their own
canonical encoding, VE inherits multiple independent disagreement
surfaces:

```text
JSON canonicalization for Actions
CBOR profile for Claims
custom binary Receipt encoding
different Trust-history encoding
```

This increases:

- implementation complexity;
- parser attack surface;
- normalization inconsistencies;
- cross-object signature complexity;
- audit complexity;
- long-term migration cost.

One shared canonical representation layer reduces total conceptual
complexity.

### 43.2 The shared data model must be deliberately small

The canonical data model SHOULD support only deterministic structural
values required by VE objects.

Candidate value classes:

```text
null
boolean
signed / unsigned integer
canonical decimal
text string
byte string
array
map with canonical key rules
```

Time SHOULD be represented through a protocol-defined canonical type or
schema-defined structural representation.

Unrestricted binary floating point SHOULD NOT be part of the canonical
identity model unless a future profile proves deterministic semantics
across implementations.

### 43.3 Object semantics remain outside the encoding layer

The encoding layer MUST NOT know that:

```text
amount means money
issuer means authority
predecessor_state means trust history
```

Those meanings belong to object schemas/specifications.

The encoder only knows:

```text
this is an integer
this is text
this is bytes
this is an array
this is a map
```

This prevents the representation layer from becoming a domain ontology.

### 43.4 Domain separation is mandatory

The same canonical bytes MUST NOT imply the same cryptographic object
across object classes.

Each hashed object class MUST use an explicit domain separator or typed
hash context.

Conceptually:

```text
H("VE:ACTION:v1"  || canonical_bytes)
H("VE:CLAIM:v1"   || canonical_bytes)
H("VE:RECEIPT:v1" || canonical_bytes)
H("VE:RULE:v1"    || canonical_bytes)
```

This prevents cross-type substitution.

Object-specific domain separation does not require object-specific byte
encoding.

### 43.5 Schema descriptor bootstrap

`schema_digest` requires the schema descriptor itself to be canonical.

Therefore the schema descriptor MUST be expressible in the same common
canonical data model.

The descriptor MUST NOT include its own digest inside the bytes over
which that digest is computed unless a future specification defines an
explicit self-reference construction.

Preferred model:

```text
schema_descriptor_body
        |
        v
canonical bytes
        |
        v
schema_digest
```

with the digest carried as a reference **to** the descriptor, not as a
self-hashed field inside the descriptor body.

This terminates the canonicalization bootstrap cleanly.

### 43.6 Claims

Claims may contain signatures, proofs, subject references, or embedded
structured values.

The common model can represent:

```text
structured fields
byte-string proofs
content digests
```

Cryptographic verification semantics remain Claim/Verify concerns.

No Claim-specific serializer is required.

### 43.7 Rules

Rules create the strongest attack because Rule may eventually be
represented as executable deterministic logic.

The common representation layer SHOULD NOT attempt to canonicalize the
semantics of arbitrary source code.

Instead, Rule identity SHOULD bind one of:

```text
a canonical declarative Rule representation
```

or:

```text
a content digest of a separately specified deterministic Rule artifact
format
```

The shared encoder canonicalizes the Rule descriptor/reference.

The Rule artifact format, if executable, is a separate protocol format
with its own deterministic byte identity.

This exception does not justify separate canonical encodings for all VE
objects.

### 43.8 Receipts

Receipts are naturally structured protocol records and fit the common
canonical model.

Receipt specifications determine which fields are required and which are
included in Receipt identity or signatures.

### 43.9 Trust Context history

Trust history is an ordered sequence of committed transition records and
state commitments.

Each transition record can use the same canonical representation layer.

Ordering and canonical-chain semantics belong to the Trust-history
protocol, not to byte serialization.

### 43.10 Object-specific profiles vs. one universal profile

A dangerous design would be:

```text
one profile containing semantic rules for every VE object
```

That would make canonical encoding own object semantics.

The preferred design is:

```text
VE Canonical Representation Profile
    -> common value model
    -> canonical bytes
    -> framing/versioning rules

VE-001
    -> Action fields and digest inputs

Claim specification
    -> Claim fields and digest inputs

VE-004
    -> Receipt fields and digest inputs

Trust protocol
    -> transition fields and chain semantics
```

Therefore "one profile" means one **representation profile**, not one
monolithic object schema.

### 43.11 Extension rule

An object class that cannot be represented safely in the common model
MUST justify an extension explicitly.

The default MUST NOT be:

```text
new object type -> new serializer
```

The burden of proof is on introducing additional representation
machinery.

### 43.12 Versioning

The canonical representation profile MUST be explicitly versioned.

An object digest or signature context MUST identify, directly or through
protocol versioning/domain separation, the representation profile used.

Profile upgrades MUST NOT silently reinterpret historical bytes.

### 43.13 Architectural conclusion

The minimum architecture is:

```text
Object Semantics
(Action / Claim / Receipt / Trust / Rule descriptor)
          |
          v
Common Canonical Data Model
          |
          v
Versioned Canonical Byte Encoding
          |
          v
Object-Specific Domain Separation
          |
          v
Digest / Signature / Commitment
```

This yields one reusable **VE Canonical Representation Layer** without
making that layer a semantic primitive or domain ontology.

------------------------------------------------------------------------

## 44. New Validated Architectural Findings

### KV-F67 — One Shared Representation Layer Is Preferred

Action schemas, Action payloads, Claims, Receipts, and Trust-transition
records can share one canonical structural representation layer.

**Status:** PASS.

### KV-F68 — Object Semantics Remain Object-Specific

A shared encoder does not own field meaning, requiredness, governance, or
validation semantics.

**Status:** PASS.

### KV-F69 — Domain Separation Is Required

Object-specific hash/signature domain separation is required even when
objects share one byte encoding.

**Status:** PASS.

### KV-F70 — Schema Descriptor Uses the Same Canonical Layer

Schema descriptors can be canonicalized by the common representation
layer, terminating the `schema_digest` bootstrap without a separate
serializer.

**Status:** PASS.

### KV-F71 — Rule Executable Format Is a Separate Concern

Arbitrary executable Rule artifacts must not force the common VE
representation layer to canonicalize programming-language semantics.

**Status:** PASS.

### KV-F72 — New Serializers Carry a High Burden of Proof

New object classes should use the shared representation layer by default.
A separate canonical encoding requires explicit justification.

**Status:** PASS.

------------------------------------------------------------------------

## 45. Updated Validation Backlog

### HYP-025 — Canonical data model

What exact primitive value model should the VE Canonical Representation
Layer permit?

Candidate:

```text
null
boolean
integer
decimal
text
bytes
array
map
```

How should timestamps, tagged values, and large integers be represented?

**Status:** NEXT PRESSURE TEST CANDIDATE.

### HYP-026 — Canonical encoding choice

Should the first VE Canonical Representation Profile use an existing
deterministic encoding standard or define a minimal VE-specific encoding?

**Status:** OPEN — REQUIRES STANDARDS COMPARISON.

### HYP-027 — Domain-separation registry

What is the minimum interoperable mechanism for assigning object-type
domain separators without creating a centralized semantic registry?

**Status:** OPEN.

### HYP-028 — Rule artifact identity

If Rule remains a primitive, what exact deterministic artifact format or
digest contract identifies executable Rule logic without embedding a
general-purpose language into the canonical representation layer?

**Status:** OPEN.

------------------------------------------------------------------------


------------------------------------------------------------------------

## 46. Pressure Test: Minimum Canonical Data Model

### Question

What is the smallest canonical data model VE actually needs, especially
for integers, decimals, timestamps, text, bytes, arrays, maps,
null/absence, and tagged values, and can enough types be eliminated that
an existing deterministic encoding standard already satisfies the need?

### Result

**PASS — the VE canonical data model can remain very small, and an
existing deterministic CBOR profile is the strongest current candidate.**

The minimum VE canonical data model currently justified is:

```text
boolean
integer
decimal
text
bytes
array
map
null
```

with **no generic floating-point type** and **no generic tagged-value
escape hatch** in the initial profile.

Time is not a primitive canonical data-model type.

Timestamps are represented using a schema-defined canonical structural
representation built from existing primitive types.

Absence is not a value.

An absent field and a field whose value is `null` are distinct.

### 46.1 Boolean

Boolean is irreducible.

Many VE objects require exact binary state without overloading integers
or strings.

Canonical values:

```text
true
false
```

### 46.2 Integer

Integer is irreducible.

It is required for:

- counters;
- sequence positions;
- version components;
- threshold counts;
- enumerated numeric identifiers where specified;
- exact whole quantities.

The canonical model SHOULD support arbitrary-magnitude integers or a
protocol-defined bounded range large enough that implementations do not
silently lose precision.

Binary floating point MUST NOT substitute for integer identity.

### 46.3 Decimal

Exact decimal is justified as a distinct semantic numeric type.

Examples include:

```text
money
rates
quantities
limits
```

Representing decimal values as binary floating point creates rounding and
cross-language identity hazards.

Representing them as ordinary text is possible, but then every schema
must reinvent:

- decimal grammar;
- sign rules;
- exponent rules;
- leading zero rules;
- trailing zero equivalence;
- canonical normalization.

Therefore exact decimal deserves one common canonical representation.

A decimal value SHOULD be represented semantically as:

```text
coefficient × 10^exponent
```

with one canonical normalization rule.

### 46.4 Floating point

A generic IEEE floating-point value type is **rejected from the initial
canonical model**.

Reasons include:

- multiple NaN encodings;
- positive and negative zero;
- precision variation;
- shortest-form choices;
- cross-language conversion differences;
- poor fit for money and exact authorization thresholds.

If a future domain genuinely requires floating-point identity, it must
justify a dedicated profile extension.

### 46.5 Text

Unicode text is irreducible.

However, the canonical representation layer MUST choose one rule:

```text
preserve code points exactly
```

or:

```text
normalize under one specified Unicode normalization form
```

Implementations MUST NOT normalize text opportunistically.

The schema layer determines whether a field permits further semantic
normalization such as ASCII case folding.

### 46.6 Bytes

Byte string is irreducible.

It is required for:

- hashes;
- signatures;
- public keys;
- proofs;
- encrypted payloads;
- opaque binary identifiers.

Encoding binary values as text/base64 merely moves canonicalization into
another convention and should not be required by the canonical data
model.

### 46.7 Array

Ordered array is irreducible.

Order can be semantically meaningful and must be preserved.

An array is:

```text
[value_0, value_1, ...]
```

No automatic sorting is permitted unless an object schema explicitly
defines a set-like field and its canonicalization rule.

### 46.8 Map

Map is irreducible for structured protocol objects.

The common canonical encoding profile MUST define deterministic key
encoding and key ordering.

The initial VE profile SHOULD strongly consider restricting map keys to
canonical text strings rather than arbitrary canonical values.

This materially simplifies:

- field-path selectors;
- schema descriptors;
- implementation;
- human inspection;
- duplicate-key rejection.

Map key uniqueness is mandatory.

### 46.9 Null

`null` is useful but should be used sparingly.

It means:

> this field is explicitly present with no value.

It MUST NOT mean:

```text
field absent
unknown
not applicable
redacted
failed to resolve
```

unless an object specification explicitly assigns such semantics.

Where an optional field is unnecessary, omission SHOULD generally be
preferred to `null`.

### 46.10 Absence

Absence is not a canonical value type.

It is structural non-presence.

Therefore:

```text
{}
```

and:

```text
{"x": null}
```

are distinct canonical objects.

This distinction MUST be preserved.

### 46.11 Timestamp

A universal timestamp primitive is **not justified**.

Time has multiple semantics:

- UTC instant;
- local civil time;
- date;
- duration;
- monotonic time;
- trusted observation time.

Collapsing them into one generic `timestamp` type would hide semantic
differences.

Instead, schemas define exact structural forms.

For a UTC instant, a future common schema convention might use:

```text
{
  "seconds": integer,
  "nanoseconds": integer
}
```

or another explicitly standardized representation.

The canonical data model itself need only encode the integers/map.

### 46.12 Tagged values

A generic open-ended `tag(type, value)` mechanism is **rejected from the
initial VE canonical data model**.

Although tags are powerful, unrestricted tags create a back door through
which every domain can invent new canonical types, undermining the goal
of one small representation layer.

If VE later needs a new semantic canonical type, it should be added
through protocol governance rather than arbitrary per-object tags.

Encoding standards may use internal tags as part of a pinned profile
implementation, but VE object schemas MUST NOT gain open-ended semantic
extensibility merely because the wire format supports tags.

### 46.13 Candidate minimum model

The resulting value grammar is conceptually:

```text
Value :=
    Null
  | Boolean
  | Integer
  | Decimal
  | Text
  | Bytes
  | Array<Value>
  | Map<Text, Value>
```

This is deliberately smaller than the full data model of many generic
serialization formats.

### 46.14 Why JSON/JCS is not the best semantic fit

JSON Canonicalization Scheme provides deterministic JSON serialization,
but its native numeric model is constrained by the JSON/ECMAScript number
ecosystem.

For exact large integers, exact decimals, byte strings, and other
non-JSON-native data, applications must introduce string conventions or
additional schema mappings.

That would push canonical semantics back into every VE object schema.

JCS remains useful for human-facing or JSON-native integrations, but it
is not the strongest candidate for VE's cryptographic canonical layer.

### 46.15 Why deterministic CBOR is a strong candidate

CBOR already has native structural representations for:

- integers;
- byte strings;
- text strings;
- arrays;
- maps;
- tagged values;
- simple values.

RFC 8949 also defines core deterministic encoding requirements that can
serve as the base of a protocol-specific deterministic format.

VE would still need a constrained profile because full CBOR is broader
than VE needs.

A VE profile could:

```text
allow:
    null
    booleans
    integers
    exact decimal representation
    text
    bytes
    arrays
    text-keyed maps

forbid:
    generic floating point
    undefined
    arbitrary simple values
    indefinite-length encoding
    arbitrary semantic tags
    non-text map keys
```

and define one exact deterministic decimal encoding.

### 46.16 Existing standard vs. custom encoding

The current evidence strongly favors:

> **Adopt a constrained deterministic profile of an existing standard
> rather than invent a VE-specific byte encoding.**

This reduces:

- implementation burden;
- parser risk;
- test burden;
- standards work;
- interoperability friction.

A custom format should require evidence that the constrained existing
standard cannot satisfy VE's requirements.

### 46.17 Architectural conclusion

The minimum canonical data model is smaller than CBOR's generic data
model but maps naturally onto it.

Therefore the next standards decision should compare a **VE deterministic
CBOR profile** against any credible alternative rather than designing new
bytes from first principles.

------------------------------------------------------------------------

## 47. New Validated Architectural Findings

### KV-F73 — Eight Canonical Value Classes Are Currently Sufficient

The initial canonical model requires:

```text
null
boolean
integer
decimal
text
bytes
array
map
```

**Status:** PASS.

### KV-F74 — Generic Floating Point Is Excluded

Floating point is not required for the initial VE canonical identity
model and introduces avoidable determinism hazards.

**Status:** PASS FOR EXCLUSION.

### KV-F75 — Absence Is Structural, Not a Value

Absent fields and explicitly null fields are distinct.

**Status:** PASS.

### KV-F76 — Timestamp Is Not a Canonical Primitive

Time semantics are schema-defined structural values rather than one
universal canonical timestamp type.

**Status:** PASS.

### KV-F77 — Open-Ended Tagged Values Are Excluded

The initial canonical data model does not permit arbitrary schema-defined
semantic tags.

**Status:** PASS FOR EXCLUSION.

### KV-F78 — Text-Keyed Maps Are Preferred

Restricting canonical maps to text keys materially reduces complexity and
aligns with Action schemas and selector field paths.

**Status:** PASS AS CURRENT CANDIDATE.

### KV-F79 — Exact Decimal Is Justified

A shared exact-decimal type avoids repeated per-schema string
canonicalization conventions.

**Status:** PASS.

### KV-F80 — Existing Deterministic Encoding Is Preferred

Current evidence favors a constrained deterministic profile of an
existing standard over a new VE-specific wire encoding.

**Status:** PASS.

### KV-F81 — Deterministic CBOR Is the Leading Candidate

RFC 8949 deterministic CBOR maps naturally to the minimum VE data model,
subject to a restrictive VE profile.

**Status:** LEADING CANDIDATE; NOT YET NORMATIVE.

------------------------------------------------------------------------

## 48. Updated Validation Backlog

### HYP-029 — Deterministic CBOR profile

Can a tightly constrained RFC 8949 deterministic CBOR profile encode the
entire minimum VE canonical data model with exactly one representation
per VE value, including exact decimal, while forbidding problematic CBOR
features?

**Status:** NEXT PRESSURE TEST CANDIDATE.

### HYP-030 — Decimal canonical form

What exact normalization should define VE decimal identity?

For example, should:

```text
1
1.0
1.00
10e-1
```

map to one semantic Decimal value and one canonical encoding?

**Status:** OPEN — SECURITY RELEVANT.

### HYP-031 — Unicode treatment

Should VE preserve Unicode code points exactly or require one
normalization form before canonical representation?

**Status:** OPEN.

### HYP-032 — Map key restriction

Can every foreseeable VE protocol object use text-keyed maps without
material loss of expressiveness?

**Status:** OPEN; STRONG CURRENT HYPOTHESIS.

------------------------------------------------------------------------


------------------------------------------------------------------------

## 49. Pressure Test: Exactly-One-Byte Deterministic CBOR Profile

### Question

Can a constrained RFC 8949 CBOR profile guarantee exactly one legal
byte representation for every VE canonical value, including Decimal,
Unicode text, map ordering, large integers, and rejection of
out-of-profile CBOR?

### Result

**PASS — but only with a VE acceptance profile stricter than RFC 8949's
core deterministic encoding requirements.**

RFC 8949 provides the correct encoding substrate and deterministic
building blocks. VE must additionally define which CBOR values are in
profile, how VE semantic values map to CBOR, and require decoders to
reject any alternative encoding of an in-profile VE value.

The resulting rule is:

> **For every VE canonical value V, exactly one byte string B is valid
> under VE Canonical Representation Profile 1, and decoding B yields V.**

Any other well-formed CBOR encoding of the same apparent application
value is out of profile and MUST be rejected for cryptographic use.

### 49.1 Base deterministic rules

The VE profile MUST inherit RFC 8949 core deterministic encoding
requirements:

- preferred serialization;
- shortest integer/length/tag arguments;
- no indefinite-length items;
- map keys sorted by bytewise lexicographic order of their deterministic
  encodings.

The VE profile MUST treat these as decoder acceptance requirements, not
merely encoder recommendations.

### 49.2 Decoder strictness

A generic CBOR decoder may accept multiple equivalent or non-preferred
representations.

That is insufficient for VE cryptographic identity.

A conforming VE canonical decoder MUST reject:

- non-preferred integer encodings;
- indefinite-length strings, arrays, or maps;
- out-of-order map keys;
- duplicate map keys;
- invalid UTF-8;
- disallowed simple values;
- disallowed tags;
- disallowed floating-point values;
- bignum encodings that violate VE normalization;
- decimal encodings that violate VE normalization;
- trailing bytes after the single top-level object.

A variation-tolerant decoder MAY be used internally only if the
implementation separately verifies that the original bytes satisfy the
VE profile before accepting them as canonical.

### 49.3 Boolean and null

Only these major-type-7 values are permitted in the initial VE profile:

```text
false
true
null
```

`undefined`, unassigned simple values, floating-point numbers, NaN,
Infinity, and break outside prohibited indefinite-length structures are
out of profile.

### 49.4 Integer canonicalization

For integers within CBOR major types 0 and 1, preferred shortest
serialization is mandatory.

For integers outside the direct 64-bit CBOR integer range, VE MAY use
only RFC 8949 tags:

```text
2 = positive bignum
3 = negative bignum
```

with these additional rules:

1. a value representable by major type 0 or 1 MUST use that direct
   representation and MUST NOT use a bignum tag;
2. a bignum byte string MUST contain no leading zero byte;
3. zero MUST never be represented as a bignum;
4. the byte string MUST use definite length and preferred length
   encoding.

This yields one representation for every permitted Integer value.

### 49.5 Decimal canonicalization

VE Decimal uses RFC 8949 tag 4 only:

```text
tag(4, [exponent, coefficient])
```

representing:

```text
coefficient × 10^exponent
```

The following canonical normalization is required.

For a nonzero coefficient:

```text
while coefficient is divisible by 10:
    coefficient = coefficient / 10
    exponent = exponent + 1
```

For zero:

```text
coefficient = 0
exponent = 0
```

The exponent MUST be a direct CBOR integer using major type 0 or 1.

The coefficient MUST use the canonical VE Integer representation,
including bignum tags 2/3 only when the value is outside the direct CBOR
integer range.

Therefore these Decimal lexical forms, when parsed as VE Decimal values:

```text
1.0
1.00
10e-1
100e-2
```

all normalize to:

```text
tag(4, [0, 1])
```

The VE Integer value `1` remains a different canonical type and is
encoded as integer `1`, not as Decimal.

Tag 5 bigfloat is prohibited.

### 49.6 Text canonicalization

VE Text is defined as an exact sequence of Unicode scalar values.

Canonical encoding is the unique valid UTF-8 encoding of that scalar
sequence.

The canonical representation layer performs **no Unicode normalization**.

Therefore canonically distinct scalar sequences remain distinct even if
they are visually or linguistically equivalent.

If a domain schema requires NFC, case folding, identifier
normalization, or another semantic normalization, that transformation
MUST occur before creation of the VE canonical Text value and MUST be
defined by the schema.

This avoids hidden Unicode-version-dependent equivalence inside the
representation layer.

Invalid UTF-8 is rejected.

### 49.7 Byte strings

VE Bytes maps directly to definite-length CBOR byte string.

No text/base64 alternative is permitted for the same VE Bytes value.

Preferred length encoding is mandatory.

### 49.8 Arrays

VE Array maps to a definite-length CBOR array.

Element order is preserved exactly.

Indefinite-length arrays are prohibited.

No implicit sorting or set semantics exist at the representation layer.

### 49.9 Maps

VE Map is restricted to:

```text
Map<Text, Value>
```

Requirements:

1. keys MUST be VE Text values;
2. keys MUST be unique as exact VE Text values;
3. duplicate encoded keys are invalid;
4. keys MUST be ordered by bytewise lexicographic order of their
   deterministic CBOR encodings, following RFC 8949 core deterministic
   ordering;
5. maps MUST use definite length and preferred length encoding;
6. missing and explicit `null` values remain distinct.

A decoder encountering duplicate keys MUST reject the object.

### 49.10 Tags

The initial VE profile permits only fixed protocol-internal tags needed
to encode the VE data model:

```text
2 = positive bignum
3 = negative bignum
4 = Decimal
```

All other CBOR semantic tags are prohibited in Profile 1 unless a later
VE profile revision explicitly adds them.

Object type identity is provided by VE cryptographic domain separation,
not by arbitrary CBOR tags.

### 49.11 Floating point

All CBOR floating-point encodings are prohibited.

This includes values that happen to be mathematically integral.

A VE Integer or Decimal MUST use its respective canonical representation.

### 49.12 One top-level item

A canonical VE object encoding consists of exactly one top-level CBOR
data item.

Trailing bytes are prohibited.

CBOR sequences are not canonical VE object encodings unless a separate
protocol explicitly defines a sequence container above this profile.

### 49.13 Out-of-profile rejection

VE cryptographic verification MUST operate on canonical bytes.

A decoder MUST NOT:

```text
accept noncanonical CBOR
decode to an application object
re-encode canonically
then treat the original bytes as canonical
```

for signature/digest verification.

The original byte string either satisfies the VE profile or it does not.

An application MAY normalize imported noncanonical CBOR into a **new**
canonical VE object before authoritative acceptance, but that is a
canonicalization transformation, not verification of the original
encoding.

### 49.14 Exactly-one representation argument

For each VE value class:

```text
Null       -> one CBOR simple-value encoding
Boolean    -> one encoding per value
Integer    -> direct preferred integer or uniquely normalized bignum
Decimal    -> tag 4 + uniquely normalized exponent/coefficient pair
Text       -> exact scalar sequence -> unique valid UTF-8
Bytes      -> definite-length preferred byte string
Array      -> definite-length ordered canonical child encodings
Map        -> definite-length, unique text keys, deterministically sorted
```

By induction over arrays and maps, every finite VE canonical value has
exactly one allowed Profile-1 byte representation.

### 49.15 Architectural conclusion

RFC 8949 does not need to be replaced.

VE needs a strict subset/profile that turns RFC 8949's deterministic
building blocks into a **closed canonical language**.

The strongest current candidate is:

> **VE Canonical Representation Profile 1 = RFC 8949 deterministic CBOR
> + a closed VE value model + strict decoder rejection + canonical
> bignum and Decimal normalization.**

No VE-specific binary wire format is justified.

------------------------------------------------------------------------

## 50. New Validated Architectural Findings

### KV-F82 — RFC 8949 Core Determinism Is Necessary but Insufficient

VE requires additional protocol-specific restrictions beyond RFC 8949
core deterministic encoding.

**Status:** PASS.

### KV-F83 — Canonicality Is an Acceptance Property

VE decoders must reject out-of-profile encodings rather than merely
produce canonical output when encoding.

**Status:** PASS.

### KV-F84 — Bignums Can Be Canonicalized Uniquely

Tags 2/3 can support arbitrary-size Integer values if direct integers are
required whenever possible and leading-zero bignums are rejected.

**Status:** PASS.

### KV-F85 — Decimal Has a Unique Normal Form

Tag 4 Decimal values can be made unique by stripping powers of ten from
nonzero coefficients and canonicalizing zero as exponent 0,
coefficient 0.

**Status:** PASS.

### KV-F86 — Text Preserves Exact Unicode Scalar Sequences

The representation layer performs no Unicode normalization; any semantic
normalization belongs to the schema before canonical encoding.

**Status:** PASS.

### KV-F87 — Maps Require Strict Duplicate-Key Rejection

Canonical VE maps use unique text keys and RFC 8949 deterministic
bytewise key ordering.

**Status:** PASS.

### KV-F88 — Profile 1 Uses a Closed Tag Set

Only tags 2, 3, and 4 are permitted for the initial VE value model.

**Status:** PASS AS CURRENT CANDIDATE.

### KV-F89 — Out-of-Profile CBOR Cannot Be Silently Normalized During Verification

Canonical verification applies to the original bytes. Re-encoding a
noncanonical source creates a new canonical representation rather than
validating the original one.

**Status:** PASS.

### KV-F90 — No Custom VE Wire Format Is Justified

A constrained RFC 8949 deterministic CBOR profile can provide a unique
representation for the current VE canonical data model.

**Status:** PASS.

------------------------------------------------------------------------

## 51. Updated Validation Backlog

### HYP-033 — Integer bounds

Should VE Profile 1 support arbitrary-size Integer values using tags 2/3,
or deliberately cap integers to the direct CBOR range to reduce
implementation burden?

**Status:** OPEN.

### HYP-034 — Decimal exponent/coefficient bounds

Should Profile 1 permit arbitrary-size Decimal coefficients and
unbounded exponents, or define resource limits / semantic bounds to
prevent denial-of-service and pathological values?

**Status:** OPEN — SECURITY RELEVANT.

### HYP-035 — Text normalization boundary

Is exact Unicode scalar preservation sufficient for all VE protocol
identifiers, or should identifier schemas be required to define a
specific normalization profile distinct from human-readable text?

**Status:** OPEN.

### HYP-036 — Canonical profile standardization

Is the evidence now sufficient to open an RFC for
`VE Canonical Representation Profile 1`, or should integer/resource
bounds and identifier normalization be pressure-tested first?

**Status:** NEXT GOVERNANCE DECISION CANDIDATE.

------------------------------------------------------------------------


------------------------------------------------------------------------

## 52. Pressure Test: Universal Resource Bounds vs. Implementation Limits

### Question

Should VE canonical identity define universal resource bounds—integer
size, Decimal exponent/coefficient size, nesting depth, collection
length, and total object bytes—or may those limits remain
implementation/profile-specific without breaking interoperability?

### Result

**PASS — VE requires a universal conformance resource envelope at the
Canonical Representation Profile layer, but resource limits are not
semantic identity fields and local implementation quotas must not
silently redefine protocol validity.**

Three classes of limits must be kept distinct:

```text
1. Canonical Representation Profile bounds
2. Object-schema semantic bounds
3. Local operational quotas
```

Only the first two define protocol validity.

The third defines whether a particular deployment is willing or able to
process an otherwise valid object.

### 52.1 Why purely implementation-specific limits fail interoperability

Assume Profile 1 permits an arbitrarily large Integer.

Implementation A supports:

```text
integer magnitude <= 256 bits
```

Implementation B supports:

```text
integer magnitude <= 1,000,000 bits
```

Both receive the same canonical bytes.

If A says:

```text
invalid VE object
```

while B says:

```text
valid VE object
```

then "VE Profile 1 conformance" no longer has one portable acceptance
domain.

The same problem applies to:

- Decimal coefficient size;
- Decimal exponent magnitude;
- nesting depth;
- array/map length;
- text/byte-string length;
- total object size.

Therefore the representation profile needs one **minimum guaranteed
portable domain**.

### 52.2 Why resource bounds do not belong in semantic identity

Resource limits answer:

> Is this value inside the portable processing envelope of this protocol
> profile?

They do not answer:

> What does this value mean?

For example, lowering the maximum canonical object size from 16 MiB to
8 MiB does not change the semantic meaning of a 100-byte Action.

Therefore resource bounds belong to the versioned Canonical
Representation Profile, not to the Action/Claim/Receipt semantic kernel
and not inside object digests as ordinary fields.

The profile identifier is enough to identify which representation
envelope applies.

### 52.3 Universal Profile bounds

VE Canonical Representation Profile 1 SHOULD define finite normative
upper bounds for at least:

```text
maximum top-level encoded bytes
maximum nesting depth
maximum text-string bytes
maximum byte-string bytes
maximum array element count
maximum map entry count
maximum map-key bytes
maximum Integer magnitude / encoded bignum bytes
maximum Decimal coefficient magnitude / encoded bytes
maximum Decimal exponent magnitude
```

A value exceeding a Profile-1 bound is **out of Profile 1**.

This makes portable acceptance deterministic.

### 52.4 Why total object bytes alone are insufficient

A total-byte cap mitigates many memory attacks but does not fully bound
computation.

A small canonical object can contain values that induce pathological
processing.

Example:

```text
Decimal:
    coefficient = 1
    exponent = 10^18
```

The encoded object can be small while downstream decimal expansion or
comparison code performs excessive work.

Likewise, deeply nested small containers can cause stack pressure.

Therefore Profile 1 needs both:

```text
byte-size bounds
structural / numeric complexity bounds
```

### 52.5 Integer bounds

RFC 8949 permits arbitrarily sized bignums through tags 2 and 3, and its
security considerations explicitly warn that arbitrary-precision number
processing can exceed linear effort.

Profile 1 SHOULD therefore cap canonical Integer magnitude.

The bound SHOULD be expressed in representation-neutral terms such as:

```text
maximum magnitude bits
```

or equivalently a maximum canonical bignum byte length.

Within the bound, every conforming implementation MUST support the
value.

Above the bound, the value is out of profile.

### 52.6 Decimal coefficient and exponent bounds

Decimal requires separate bounds.

Coefficient magnitude is bounded for the same reason as Integer.

Exponent magnitude needs an independent bound because:

```text
small coefficient + enormous exponent
```

can be compactly encoded yet operationally pathological.

Therefore Profile 1 SHOULD normatively bound:

```text
abs(decimal_exponent)
decimal_coefficient_magnitude
```

The profile does not need to prescribe application-specific decimal
precision.

An Action schema may impose tighter constraints such as:

```text
currency amount:
    at most 2 fractional decimal places
```

That is a schema semantic rule, not a representation bound.

### 52.7 Nesting depth

Profile 1 MUST define a maximum canonical nesting depth.

RFC 8949 warns that deeply nested input can exhaust decoder stack or
other resources.

All conforming implementations MUST support valid Profile-1 objects up
to that depth.

Schemas SHOULD normally impose much shallower structures.

### 52.8 Collection lengths

Profile 1 SHOULD bound:

```text
array elements
map entries
```

even when total object bytes are bounded.

This limits:

- allocation counts;
- map-key comparison work;
- duplicate-key checking;
- per-element validation overhead.

### 52.9 String and byte-string lengths

Profile 1 SHOULD bound individual Text and Bytes values in addition to
total object bytes.

This gives implementations predictable per-field allocation ceilings
and improves streaming validation.

Object schemas may impose tighter limits.

### 52.10 Local operational quotas

Deployments MAY impose local operational limits for:

- rate limiting;
- memory pressure;
- tenant quotas;
- API request caps;
- risk controls;
- constrained hardware.

But a local quota MUST NOT redefine a Profile-1 canonical value as
malformed or noncanonical.

A compliant implementation encountering a canonical in-profile object
that it refuses solely because of local capacity SHOULD report a
distinct condition such as:

```text
RESOURCE_LIMIT
CAPACITY_EXCEEDED
LOCAL_POLICY_REJECTED
```

rather than:

```text
INVALID_CANONICAL_ENCODING
```

This preserves the distinction between:

```text
protocol invalidity
```

and:

```text
deployment refusal
```

### 52.11 Full-profile conformance

An implementation claiming full support for VE Canonical Representation
Profile 1 MUST be capable of parsing, canonicality-checking, and
representing every Profile-1 value up to the normative Profile-1 bounds.

An implementation with lower hard capabilities MUST NOT advertise full
Profile-1 conformance for interfaces that can receive values above its
supported domain.

It may instead implement a separately identified constrained deployment
profile or gateway limit.

### 52.12 Object-schema bounds

Object schemas MAY and often SHOULD impose tighter semantic bounds.

Examples:

```text
bank.transfer amount:
    Decimal precision <= domain rule

action operation name:
    Text <= 128 bytes

Receipt evidence list:
    Array <= 32 entries
```

These constraints are object semantics / validation rules.

Two implementations using the same schema MUST apply the same
schema-defined limits.

Therefore:

```text
Profile bounds
    define universal representable envelope

Schema bounds
    define valid values for an object type

Local quotas
    define deployment willingness/capacity
```

### 52.13 Hashing and rejected oversized values

A value outside Profile 1 does not have a valid Profile-1 canonical
representation and therefore cannot acquire a Profile-1 object digest.

An in-profile canonical object remains cryptographically identical
regardless of whether a deployment later refuses to process it due to a
local quota.

This distinction prevents local capacity from changing object identity.

### 52.14 Negotiation attack

VE SHOULD NOT allow arbitrary per-message negotiation such as:

```text
"this object uses Profile 1 but with 4x larger integers"
```

while retaining the same profile identifier.

That would destroy the fixed portable domain.

If VE later needs larger bounds, it should use:

```text
new representation profile version
```

or a separately identified extension profile.

Profile identity commits to the bound set.

### 52.15 Exact numerical bounds

This pressure test establishes **where** bounds belong and that they must
exist.

It does not yet justify exact values.

Exact maxima should be chosen only after:

- representative object sizing;
- constrained-device feasibility;
- server-side implementation tests;
- denial-of-service analysis;
- cross-language library capability review.

The values should be generous enough for foreseeable VE objects but
small enough to guarantee predictable validation.

### 52.16 Architectural conclusion

The correct architecture is:

```text
VE Canonical Representation Profile
    |
    +-- canonical value model
    +-- exact byte encoding
    +-- universal finite resource envelope
            |
            v
Object Schema
    |
    +-- tighter semantic/value constraints
            |
            v
Deployment
    |
    +-- local capacity / rate / tenant quotas
```

Only Profile and Schema constraints define interoperable object
validity.

Local quotas define processing availability, not canonical meaning.

------------------------------------------------------------------------

## 53. New Validated Architectural Findings

### KV-F91 — Profile-Level Resource Bounds Are Required

A canonical representation profile needs finite universal processing
bounds to define a portable conformance domain.

**Status:** PASS.

### KV-F92 — Resource Bounds Are Not Semantic Identity Fields

Representation limits belong to the versioned canonical profile rather
than Action/Claim/Receipt semantic payloads.

**Status:** PASS.

### KV-F93 — Total Bytes Alone Are Insufficient

Canonical profile security requires structural and numeric complexity
bounds in addition to total encoded bytes.

**Status:** PASS.

### KV-F94 — Decimal Exponent Requires an Independent Bound

Small encodings can contain extreme decimal exponents that cause
pathological downstream computation.

**Status:** PASS.

### KV-F95 — Local Quotas Must Not Redefine Canonical Validity

A deployment may refuse an otherwise canonical in-profile object for
capacity reasons, but that refusal must remain distinct from protocol
invalidity.

**Status:** PASS.

### KV-F96 — Full Profile Conformance Implies Support Through Profile Bounds

An implementation cannot claim full Profile-1 conformance on an
interface while being structurally incapable of accepting valid values
inside the Profile-1 envelope.

**Status:** PASS.

### KV-F97 — Schema Bounds May Be Tighter

Object schemas may impose deterministic semantic limits inside the
larger representation-profile envelope.

**Status:** PASS.

### KV-F98 — Profile Bounds Are Versioned, Not Negotiated Per Object

A different universal resource envelope requires a separately
identified representation profile/version.

**Status:** PASS.

------------------------------------------------------------------------

## 54. Updated Validation Backlog

### HYP-037 — Profile-1 exact bounds

What exact Profile-1 maxima should VE choose for:

```text
encoded object bytes
nesting depth
text bytes
byte-string bytes
array elements
map entries
map-key bytes
integer magnitude bits
Decimal coefficient bits
Decimal exponent magnitude
```

**Status:** OPEN — REQUIRES IMPLEMENTATION / DOS ANALYSIS.

### HYP-038 — Constrained conformance profiles

Does VE need formally named constrained profiles for embedded or
resource-limited implementations, or is full Profile-1 conformance plus
deployment-level refusal sufficient?

**Status:** OPEN.

### HYP-039 — Streaming verification

Can Profile-1 canonicality, hashing, duplicate-map-key detection, and
resource-bound enforcement be performed in bounded memory for the
largest permitted objects?

**Status:** NEXT PRESSURE TEST CANDIDATE.

### HYP-040 — Canonical Representation RFC readiness

Is the architecture now mature enough to open an RFC establishing
VE Canonical Representation Profile 1 while leaving exact numeric bounds
as an implementation-validation gate before final approval?

**Status:** NEXT GOVERNANCE DECISION CANDIDATE.

------------------------------------------------------------------------


------------------------------------------------------------------------

## 55. Pressure Test: Streaming Canonical Verification in Bounded Memory

### Question

Can VE Canonical Representation Profile 1 canonicality checking, hashing,
duplicate-map-key detection, and resource-bound enforcement be performed
in bounded memory without materializing the full VE object?

### Result

**PASS — Profile-1 verification can be implemented as a bounded-memory
single-pass streaming validator, subject to the finite Profile-1 resource
envelope.**

The verifier does not need to construct the complete application object
before establishing:

- CBOR well-formedness;
- Profile-1 canonicality;
- resource-bound compliance;
- map-key uniqueness and ordering;
- UTF-8 validity;
- allowed-tag compliance;
- Integer / bignum canonicality;
- Decimal canonical normalization;
- cryptographic digest over the canonical bytes.

The required working memory is bounded by Profile-1 limits and is
independent of total object size except for explicitly bounded per-depth
state and bounded map-key buffering.

### 55.1 Streaming architecture

Conceptually:

```text
input bytes
    |
    +--> byte-count / resource limiter
    |
    +--> streaming CBOR parser
    |       |
    |       +--> canonicality checks
    |       +--> depth / collection counters
    |       +--> UTF-8 validation
    |       +--> tag/type validation
    |       +--> map-order / duplicate checks
    |       +--> Integer / Decimal checks
    |
    +--> cryptographic hash state
    |
    +--> optional schema/application callbacks
```

The canonical validator may reject as soon as any Profile-1 rule is
violated.

No complete in-memory object tree is required.

### 55.2 Hashing

Cryptographic hashing is naturally streaming.

Once the protocol has established the exact domain-separation framing,
a hash state can consume canonical bytes incrementally.

Conceptually:

```text
hash.init(domain_separator)
hash.update(canonical_input_chunk_1)
hash.update(canonical_input_chunk_2)
...
digest = hash.final()
```

The hash function requires constant-size working state independent of
object size.

For object identities that hash only a canonical substructure, the
streaming parser can start and stop the appropriate hash context at the
declared structural boundary.

### 55.3 Definite lengths enable early bound enforcement

Profile 1 prohibits indefinite-length strings, arrays, and maps.

Therefore each collection/string header exposes its declared length
before its contents are consumed.

The verifier can reject immediately if a value exceeds:

```text
MAX_TEXT_BYTES
MAX_BYTE_STRING_BYTES
MAX_ARRAY_ELEMENTS
MAX_MAP_ENTRIES
```

without allocating the declared object.

The parser also maintains:

```text
total encoded bytes consumed
current nesting depth
```

and rejects when the Profile-1 maxima are exceeded.

### 55.4 Nesting state

A streaming parser needs one small frame for each currently open array,
map, or tagged structured value.

A frame may contain:

```text
container type
remaining element/pair count
map key/value phase
previous map key, if map
schema-validation state, if applicable
```

Memory is therefore bounded by:

```text
O(MAX_DEPTH × frame_state)
```

plus bounded key storage and parser/hash state.

Because `MAX_DEPTH` is a Profile-1 constant, verifier memory is
protocol-bounded.

### 55.5 Duplicate-map-key detection

RFC 8949 notes that generic streaming decoders may not retain enough
state to notice duplicate map keys.

Profile 1 changes the problem.

Canonical Profile-1 maps require keys to appear in strict bytewise
lexicographic order of their deterministic encodings.

Therefore, for each map, the verifier need retain only the immediately
previous encoded key.

For each incoming key:

```text
current_key_bytes > previous_key_bytes
```

MUST hold.

Then:

```text
current == previous
    -> duplicate -> reject

current < previous
    -> noncanonical ordering -> reject

current > previous
    -> continue
```

Because a deterministically sorted sequence places equal keys adjacent,
a set of all prior keys is unnecessary.

### 55.6 Memory cost of map-key validation

Profile 1 restricts keys to Text.

The verifier may buffer one canonical encoded previous key for each open
map.

Worst-case map-key working memory is bounded by:

```text
MAX_DEPTH × MAX_MAP_KEY_BYTES
```

plus small framing overhead.

An implementation may optimize this further, but Profile-1
interoperability does not depend on the optimization.

### 55.7 UTF-8 validation

Text strings can be validated incrementally.

A UTF-8 validator needs only bounded decoder state across input chunks.

The verifier need not materialize the complete Text value solely to
establish valid UTF-8.

Map keys are the exception because the previous key must be retained for
ordering comparison, but their size is bounded by `MAX_MAP_KEY_BYTES`.

### 55.8 Integer and bignum validation

Direct CBOR integers can be checked immediately from their head and
argument.

For tag-2/tag-3 bignums, canonicality can be checked while streaming the
byte string:

- definite length;
- within `MAX_INTEGER_BITS`;
- no leading zero byte;
- direct integer representation required when the magnitude fits the
  direct CBOR integer range.

The verifier does not need to construct an arbitrary-precision integer
merely to validate canonical representation.

Small values near the direct/bignum boundary may be accumulated in a
fixed-width register for the direct-representation check.

### 55.9 Decimal normalization

VE Decimal canonicality requires:

```text
tag 4
[exponent, coefficient]
```

with:

```text
zero -> exponent 0, coefficient 0

nonzero coefficient -> not divisible by 10
```

The exponent is checked against the Profile-1 exponent bound.

For a direct Integer coefficient, divisibility by 10 is trivial.

For a bignum coefficient, the verifier can compute the coefficient
modulo 10 incrementally from the magnitude bytes.

For a negative tag-3 coefficient, the verifier applies tag-3 numeric
semantics when calculating the mathematical coefficient modulo 10.

Thus Decimal normalization can be validated without materializing the
full arbitrary-precision coefficient.

### 55.10 Map ordering comparison

RFC 8949 core deterministic ordering compares the deterministic encoded
key bytes lexicographically.

Because Profile 1 permits text keys only, a verifier can capture the
encoded key bytes while simultaneously:

- validating its definite-length header;
- enforcing `MAX_MAP_KEY_BYTES`;
- validating UTF-8;
- comparing the completed key with the previous key.

No full map needs to exist in memory.

### 55.11 Schema validation

Canonical representation verification and object-schema validation are
distinct.

Many schema checks can also be streamed.

A schema-aware validator may maintain bounded state such as:

```text
required-field bitset
current field descriptor
array element schema
object-specific counters
```

Text-key canonical ordering may further simplify required-field tracking.

However, an object schema that requires arbitrary cross-field computation
may require retaining selected values.

That does not invalidate streaming **canonical representation**
verification.

Such memory belongs to the higher semantic-validation layer.

### 55.12 Selector evaluation

Profile-1 selectors were deliberately limited to:

```text
eq
in
prefix
```

over declared canonical Action fields.

A streaming schema-aware Action validator can evaluate many selectors as
matching fields arrive and retain only relevant bounded values/state.

Selectors do not require materialization of the entire Action solely for
applicability matching.

### 55.13 Receipt and trust-history verification

Receipts and individual trust-transition records are structured
Profile-1 objects and can be canonicality-checked and hashed as streams.

A trust **history** need not be one giant materialized object.

The higher-level trust protocol can process one committed transition
record at a time:

```text
previous state commitment
        |
        v
next canonical transition record
        |
        v
verify / apply
        |
        v
next state commitment
```

This preserves bounded memory across arbitrarily long histories,
provided each individual record remains within Profile-1 bounds.

### 55.14 What cannot always be streamed with constant memory

The claim is **bounded-memory verification**, not universal O(1)-memory
semantic processing.

Some higher layers may legitimately require memory proportional to
explicitly bounded protocol values.

Examples:

- retaining the previous map key for each nested map;
- holding a signature/proof value for later cryptographic verification;
- object schemas requiring comparison of two distant fields;
- evaluation requiring a set of established Claims;
- execution adapters needing the complete payload.

These do not require materializing the entire canonical object for
representation verification.

The relevant guarantee is:

> Verifier memory has a finite upper bound derived from Profile-1 limits,
> rather than scaling without protocol-defined bound with attacker input.

### 55.15 Single-pass property

Profile-1 canonicality verification can be performed in one forward pass
over the original bytes.

No canonical re-encoding pass is required.

No sorting pass is required because map keys arrive already in canonical
order or the object is rejected.

No duplicate-key hash table is required because strict ordering makes
duplicates adjacent.

No full-object buffering is required for hashing.

### 55.16 Failure atomicity

A streaming verifier MUST NOT expose partially verified object semantics
as authoritative before the complete relevant canonical object has
passed verification.

Implementations may emit tentative parsing callbacks, but downstream
authoritative effects MUST be deferred until canonicality and required
validation complete.

This prevents a late malformed byte sequence from leaving partial
authoritative state.

### 55.17 Architectural conclusion

Profile 1 can support constrained gateways and streaming Execution
Boundaries without weakening canonical identity.

The strongest current implementation model is:

```text
single pass
+
strict canonical decoder
+
streaming hash
+
bounded container stack
+
one previous key per open map
+
finite numeric state
+
profile resource counters
```

The representation layer therefore does not require whole-object
materialization as an architectural assumption.

------------------------------------------------------------------------

## 56. New Validated Architectural Findings

### KV-F99 — Profile-1 Canonicality Is Stream-Verifiable

Canonical representation validity can be established in a single forward
pass without constructing the full object tree.

**Status:** PASS.

### KV-F100 — Canonical Map Ordering Eliminates Global Duplicate-Key State

Strict deterministic key ordering makes equal keys adjacent, so duplicate
detection requires only the previous key for each open map.

**Status:** PASS.

### KV-F101 — Hashing Is Naturally Streaming

Canonical object digests can be computed incrementally over accepted
canonical bytes.

**Status:** PASS.

### KV-F102 — Definite Lengths Enable Pre-Allocation Rejection

Profile bounds for strings and collections can be enforced from CBOR
headers before allocating their contents.

**Status:** PASS.

### KV-F103 — Numeric Canonicality Does Not Require Full Big-Number Materialization

Bignum and Decimal canonical-form checks can be performed with bounded
streaming state.

**Status:** PASS.

### KV-F104 — Streaming Verification Is Bounded, Not Universally Constant-Memory

Memory may scale with Profile-1 bounded depth, map-key size, and selected
higher-layer validation state, but it does not require unbounded
whole-object materialization.

**Status:** PASS.

### KV-F105 — Higher Semantic Validation Remains Separate

Object schemas or Rule evaluation may require retaining selected values;
that does not alter the bounded-memory property of canonical
representation verification.

**Status:** PASS.

### KV-F106 — Partial Parse Must Not Become Partial Authority

Streaming implementations must defer authoritative effects until the
relevant canonical object and required validation have completed.

**Status:** PASS.

------------------------------------------------------------------------

## 57. Updated Validation Backlog

### HYP-037 — Profile-1 exact bounds

What exact Profile-1 maxima should VE choose for encoded bytes, depth,
collections, strings, Integer magnitude, Decimal coefficient, and
Decimal exponent?

**Status:** OPEN — IMPLEMENTATION VALIDATION REQUIRED.

### HYP-041 — Canonical Representation RFC readiness

Do KV-F67 through KV-F106 now provide sufficient architectural evidence
to open RFC-005 for `VE Canonical Representation Profile 1`, with exact
resource-bound numbers remaining an explicit pre-approval validation
gate?

**Status:** NEXT GOVERNANCE DECISION CANDIDATE.

### HYP-042 — Cryptographic streaming framing

What exact domain-separation and framing construction allows object
digests and signatures to be streamed safely without ambiguity across
Action, Claim, Rule descriptor, Receipt, Schema, and Trust-transition
objects?

**Status:** OPEN; SHOULD BE RESOLVED INSIDE / ALONGSIDE RFC-005.

### HYP-043 — Streaming schema descriptor validation

Can the minimum Action Schema descriptor itself be validated and hashed
using the same bounded-memory machinery while supporting all required
field and selector semantics?

**Status:** OPEN.

------------------------------------------------------------------------
