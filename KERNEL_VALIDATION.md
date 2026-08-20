# KERNEL_VALIDATION.md

**Project:** Verified Execution\
**Document:** Kernel Validation Record\
**Version:** 0.3\
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

**Status:** NEXT PRESSURE TEST CANDIDATE.

------------------------------------------------------------------------

## 18. Current Assessment

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
  by itself advance trust history.

No RFC is opened by this document alone.

The most important unresolved issue is now the execution/commit boundary:
what proves that an authorized trust-transition Action became the
canonical committed successor, especially under concurrency or
distributed execution?
# KERNEL_VALIDATION.md

**Project:** Verified Execution\
**Document:** Kernel Validation Record\
**Version:** 0.2\
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

-   revocation;
-   key rotation;
-   compromise;
-   ownership transfer;
-   organizational change;
-   emergency recovery?

Can trust evolution remain outside the semantic kernel without
introducing a higher-level governance primitive or circular authority?

**Status:** NEXT PRESSURE TEST.

------------------------------------------------------------------------

## 14. Current Assessment

The reduced kernel continues to survive cross-domain pressure testing
without requiring domain-specific primitives.

The strongest current candidate semantic kernel is:

``` text
Action + Claim + Rule + Verify + Evaluate
```

The current evidence suggests:

-   `Resource` does not need kernel status.
-   communication does not need special semantics;
-   identity, authority, delegation, human status, AI status,
    provenance, and permissions can be represented through Claims and
    Rules;
-   Rule applicability can be Claim-driven;
-   governance verification must terminate in independently selected
    trust roots;
-   Trust Context is necessary and must be explicit, but is not
    currently justified as a semantic primitive.

No RFC is opened by this document alone.

The next pressure test is trust evolution: whether revocation, key
rotation, compromise, ownership transfer, and emergency recovery can
update Trust Context without creating circular authority or requiring
another semantic primitive.
