---
id: "VE-001"
title: "Action Specification"
version: "0.2"
status: "Approved"
document_type: "Core Primitive Specification"
category: "Specification"
author: "Verified Execution Editorial Board"
created: 2026-08-10
updated: 2026-08-20
depends_on: []
related_documents: []
supersedes: null
superseded_by: null
---
# VE-001 --- Action Specification

**Version:** 0.2\
**Status:** Approved\
**Category:** Core Primitive Specification\
**Identifier:** VE-001\
**Project:** Verified Execution\
**Supersedes:** VE-001 v0.1\
**Change authority:** RFC-004 v0.2; ADR-004\
**Normative dependency:** VE Canonical Encoding Profile
(identifier/version to be assigned before cryptographic interoperability
conformance is claimed)

------------------------------------------------------------------------

## Abstract

This specification defines the **Action**, the canonical, immutable
representation of one bounded request to produce a governed
consequential external effect.

An Action preserves two distinct identities:

``` text
action_id     — identity of the historical Action occurrence
action_digest — deterministic cryptographic identity of exact semantic Action content
```

These identities MUST NOT be conflated.

An Action does not imply authorization, execution, legitimacy, success,
or canonical commit.

Any authoritative artifact whose meaning depends on a particular Action
occurrence carrying particular semantic content MUST cryptographically
bind `action_id` to `action_digest`, together with any additional
authoritative occurrence fields on which that artifact relies.

VE-001 does not define a third universal Action identity.

------------------------------------------------------------------------

# 1. Purpose

The Action primitive provides a stable, provider-independent
representation of consequential execution intent.

It separates:

``` text
what is being requested
```

from:

``` text
who proposed it
who may authorize it
whether it is authorized
whether it executed
whether reality changed
```

All governed consequential execution requests MUST become canonical
Actions before external execution is attempted.

------------------------------------------------------------------------

# 2. Definition

An **Action** is:

> **The canonical, immutable representation of one bounded request to
> produce a governed consequential external effect.**

An Action represents semantic intent.

It does not itself represent:

-   permission;
-   authority;
-   Rule applicability;
-   Rule satisfaction;
-   execution;
-   success;
-   legitimacy;
-   canonical commit.

------------------------------------------------------------------------

# 3. Intent Is Not Execution

``` text
ACTION EXISTS
      ≠
ACTION AUTHORIZED
      ≠
ACTION EXECUTED
      ≠
ACTION COMMITTED
```

An Action remains historically meaningful even if it never executes.

------------------------------------------------------------------------

# 4. Action Boundary

An Action SHOULD represent the smallest semantically meaningful governed
effect for which independent authorization, lifecycle tracking, or
execution evidence is useful.

If requested effects can be independently authorized, fail
independently, produce independently meaningful consequences, or require
distinct evidence, they SHOULD be separate Actions.

Action is a semantic unit. It is not necessarily an HTTP request,
function call, model tool call, database statement, or workflow step.

------------------------------------------------------------------------

# 5. Logical Action Structure

Every authoritative Action consists logically of:

``` text
Action
├── Instance Envelope
│   └── action_id
└── Semantic Payload
    ├── schema_digest
    └── schema-defined semantic fields
```

The Semantic Payload answers:

> **What exactly is being proposed?**

The Instance Envelope answers:

> **Which occurrence of that proposal is this?**

Occurrence metadata MUST NOT be inserted into Semantic Payload merely to
force unique content identity.

------------------------------------------------------------------------

# 6. Action Schema

Every Action MUST identify the exact schema contract under which its
Semantic Payload is interpreted.

The normative schema identity is:

``` text
schema_digest
```

Human-readable fields MAY accompany it:

``` text
schema_id
schema_version
```

They are operational labels, not normative schema identity.

`schema_digest` MUST participate in `action_digest`.

A semantic change to a schema MUST change `schema_digest`.

VE-001 does not require a global schema registry and does not introduce
Action Schema as a semantic kernel primitive.

------------------------------------------------------------------------

# 7. Semantic Payload Classification Rule

A field MUST belong to canonical Semantic Payload when changing it can
change:

-   the requested external effect;
-   target or destination;
-   requested operation or capability;
-   material arguments;
-   quantity or amount;
-   deterministic applicability of Claims, Rules, Trust Context
    authority, or execution authority;
-   an explicit execution constraint;
-   completion semantics.

The governing test is:

> **If two Actions differ only in field X, could a legitimate authority
> distinguish them because the proposed execution, deterministic
> applicability, or completion semantics differ?**

If yes, X is semantic Action content.

This rule does not permit an Action to choose its own governance.

------------------------------------------------------------------------

# 8. Schema-Defined Semantic Fields

A schema MAY define semantic fields such as:

``` text
operation
target
destination
amount
currency
requested capability
arguments
payload commitment
execute_before
execute_after
effective_at
completion semantics
```

This list is illustrative.

VE does not define a universal domain ontology or universal `target`
structure.

Unknown or ambiguous semantics MUST fail closed.

------------------------------------------------------------------------

# 9. Action Digest

Every authoritative Action MUST have a deterministic cryptographic
semantic-content identity:

``` text
action_digest =
    H(
        domain_separator
        ||
        schema_digest
        ||
        canonical_semantic_payload
    )
```

The normative Canonical Encoding Profile MUST define:

-   canonical byte encoding;
-   framing;
-   domain separation;
-   digest-suite representation;
-   primitive value encoding;
-   map/object ordering;
-   Unicode treatment;
-   numeric representation;
-   absent versus null semantics;
-   canonical representation of schema descriptors.

Changing `schema_digest` or any semantic field MUST change
`action_digest`, except with negligible probability under the selected
cryptographic digest.

`action_digest` identifies exact semantic content only.

It MUST NOT be interpreted as:

-   occurrence identity;
-   authorization;
-   replay permission;
-   idempotency identity;
-   execution proof;
-   commit proof.

------------------------------------------------------------------------

# 10. Action ID

Every authoritative Action MUST have exactly one immutable `action_id`.

`action_id` identifies the historical Action occurrence.

It MUST:

-   remain immutable;
-   never be reassigned to a different occurrence;
-   be unique within every context in which authoritative Action
    histories may be compared.

The generation format is protocol/profile-defined.

`action_id` is not semantic-content identity.

------------------------------------------------------------------------

# 11. Same Content, Distinct Occurrences

Two independent Actions MAY have:

``` text
same action_digest
```

while having:

``` text
different action_id
```

Example:

``` text
A1: transfer 100 CAD X -> Y
A2: transfer 100 CAD X -> Y
```

These may represent two independently requested executions.

Therefore:

``` text
same action_digest != same Action occurrence
```

Digest equality MUST NOT by itself imply duplicate suppression,
idempotency, replay, or exactly-once execution.

------------------------------------------------------------------------

# 12. Occurrence/Content Binding

Any authoritative artifact whose semantics depend on a particular Action
occurrence carrying particular semantic content MUST cryptographically
bind at least:

``` text
(action_id, action_digest)
```

Examples include, where occurrence-specific:

``` text
approval Claims
Receipts
execution evidence
commit evidence
signed Action records
```

If the applicable protocol defines additional authoritative Instance
Envelope fields, it MUST state which fields participate in the
artifact's binding.

A protocol MAY derive a compact commitment over these values.

Such a commitment is protocol machinery and MUST NOT be treated as a
third universal Action identity.

------------------------------------------------------------------------

# 13. Instance Envelope

The Instance Envelope MUST contain:

``` text
action_id
```

It MAY contain protocol-defined occurrence fields such as:

``` text
instance_created_at
correlation_id
parent / causation reference
instance_nonce
envelope_version
non-authoritative routing hints
```

Every protocol-defined envelope field MUST be classified as one of:

``` text
bound authoritative
unbound / non-authoritative
local implementation metadata
```

A field whose mutation could alter interpretation, provenance, replay
behavior, or authoritative history relied upon by an artifact MUST
participate in that artifact's cryptographic binding.

Not every envelope field is automatically bound.

------------------------------------------------------------------------

# 14. Time

A timestamp that merely records when an Action occurrence was created or
accepted belongs in the Instance Envelope, for example:

``` text
instance_created_at
```

A time value that constrains requested execution belongs in Semantic
Payload, for example:

``` text
execute_before
execute_after
effective_at
```

A single field MUST NOT ambiguously serve both roles.

------------------------------------------------------------------------

# 15. Initiator and Proposer Identity

Initiator/proposer identity is not universally required semantic Action
content.

The same proposed effect may originate from different actors while
retaining the same `action_digest`.

Initiator identity, delegation, and authority normally belong in Claims,
provenance, or independently verifiable context.

If represented identity changes the requested effect---for example,
publishing a statement explicitly as legal entity X---the Action Schema
MUST include the relevant represented identity in Semantic Payload.

------------------------------------------------------------------------

# 16. Authority Context

An Action MUST NOT establish its own authority by embedding an
authoritative `authority_context`.

Authority is established independently through verified Claims, Trust
Context, Rule applicability, Verify, and Evaluate.

An Action MAY carry non-authoritative authority or routing hints.

Such hints MUST NOT become authoritative merely because they are
present.

------------------------------------------------------------------------

# 17. Scope and Applicability

VE-001 defines no universal semantic `scope` field.

Applicability of Claims, Rules, Trust Context authority, and execution
authority is determined through protocol-defined deterministic selectors
over canonical schema-defined Action fields.

Tenant, environment, project, jurisdiction, account, or similar values
MAY appear in Semantic Payload when the Action Schema declares them
effect- or applicability-relevant.

They are not universal Action primitives.

------------------------------------------------------------------------

# 18. Operation, Target, and Arguments

Operation, target, destination, capability, and argument structures are
schema-defined Semantic Payload.

VE-001 does not impose a universal representation for these concepts.

Operation names SHOULD represent semantic intent rather than vendor
transport when practical.

Provider independence SHOULD be preferred over artificial abstraction.

------------------------------------------------------------------------

# 19. Claims and Governance References

Claims are independent of Action semantic content.

A Claim MAY bind:

``` text
action_digest
```

when it concerns exact semantic content.

A Claim whose semantics concern one particular occurrence MUST bind:

``` text
(action_id, action_digest)
```

Rule, selector, Trust Context, or execution-authority references carried
with an Action are non-authoritative unless independently established.

An Action MUST NOT choose the Rule or authority under which it is
accepted.

------------------------------------------------------------------------

# 20. Immutability

Once an Action becomes authoritative:

-   Semantic Payload MUST be immutable.
-   `schema_digest` MUST be immutable.
-   `action_digest` MUST be immutable.
-   `action_id` MUST be immutable.
-   authoritative bound Instance Envelope fields MUST be immutable for
    the history/artifacts that rely upon them.

A material semantic change requires a new Action.

------------------------------------------------------------------------

# 21. Non-Canonical Metadata

Purely local implementation or display metadata MAY evolve without
creating a new Action.

Examples:

``` text
database row ID
UI label
storage path
cache key
worker assignment
local processing status
log formatting
```

Such values MUST NOT affect `action_digest`.

------------------------------------------------------------------------

# 22. Lifecycle Status

Mutable lifecycle status MUST NOT be authoritative Action content.

Lifecycle state is derived from authoritative Event history.

Cached projections MAY exist but MUST NOT redefine the Action.

------------------------------------------------------------------------

# 23. Structural Validation

Before governed execution, an Action MUST be structurally validated.

Validation MUST establish at minimum:

-   the schema contract is available;
-   the resolved schema matches `schema_digest`;
-   required semantic fields exist;
-   semantic values conform to the schema;
-   canonicalization succeeds under the required Canonical Encoding
    Profile;
-   `action_digest` verifies;
-   required occurrence fields exist;
-   Action semantics are supported.

Structural validation does not establish authorization.

------------------------------------------------------------------------

# 24. Semantic Validation

A deployment MAY validate domain semantics such as:

``` text
amount is a valid positive decimal
recipient has valid syntax
identifier format is valid
```

Semantic validation MUST NOT be confused with authorization.

Permission, delegation validity, authority, thresholds, and
time-dependent governance belong in Claims, Rules, Verify, and Evaluate
unless the Action Schema explicitly defines a value as part of Action
semantic validity.

------------------------------------------------------------------------

# 25. Canonicalization

Vendor-specific requests MUST be converted into canonical Actions before
governed execution.

Canonicalization MUST preserve semantic meaning and MUST NOT:

-   broaden authority;
-   silently add operations;
-   omit material arguments;
-   change target or destination;
-   weaken explicit constraints;
-   resolve ambiguity toward more permissive execution.

If semantics cannot be determined unambiguously, execution MUST fail
closed.

Canonicalization is security-relevant protocol machinery and part of the
trusted computing base.

------------------------------------------------------------------------

# 26. Canonical Encoding Dependency

VE-001 defines **what** must be canonicalized and **what identity
properties must result**.

It does not define the byte-level serialization algorithm.

Byte-level canonical encoding MUST be defined by a separate normative VE
Canonical Encoding Profile.

A conforming implementation MUST identify and implement the profile
required by the applicable VE protocol version.

Two implementations MUST NOT claim cryptographic Action interoperability
unless they use the same normative canonicalization profile, schema
contract, digest framing, and digest suite.

The encoding profile is protocol machinery, not a semantic primitive.

------------------------------------------------------------------------

# 27. Schema Resolution

Schemas MAY be resolved through multiple mechanisms, including local
configuration, packaged descriptors, content-addressed storage, or
registries.

Resolution mechanism is non-authoritative.

The resolved schema descriptor MUST match the declared `schema_digest`.

Human-readable schema names or versions MUST NOT substitute for digest
verification.

------------------------------------------------------------------------

# 28. Action Relationships

Relationships such as:

``` text
parent
child
caused_by
compensates
retries
supersedes
correlated_with
```

are not new primitives.

If a relationship is observational, it belongs in occurrence metadata or
Event history.

If it is a necessary condition of the proposed execution, the relevant
commitment belongs in Semantic Payload.

------------------------------------------------------------------------

# 29. Compensation

Compensation MUST create a new Action.

The original Action MUST remain unchanged.

Example:

``` text
Action A: transfer X -> Y
Action B: transfer Y -> X
```

B may compensate for A, but B does not erase or mutate A.

------------------------------------------------------------------------

# 30. Idempotency

Idempotency identity is distinct from:

``` text
action_id
action_digest
```

An execution profile MAY define an idempotency key or equivalence class.

Same `action_digest` MUST NOT automatically imply one execution.

------------------------------------------------------------------------

# 31. Retries and Attempts

A retry is not automatically a new Action.

One Action occurrence MAY have multiple execution attempts.

A new semantic request requires a new Action.

Attempt semantics remain execution/lifecycle concerns unless later
specification work establishes otherwise.

------------------------------------------------------------------------

# 32. Sensitive Payloads

Semantic Payload may contain sensitive information.

Schemas and execution profiles SHOULD support commitments, encryption,
durable references, redaction, or selective disclosure where compatible
with execution semantics.

Any commitment or reference that materially determines the requested
effect MUST participate in canonical Semantic Payload.

------------------------------------------------------------------------

# 33. Argument Integrity

Execution machinery MUST preserve the semantics identified by
`action_digest`.

A semantically material transformation between canonical Action and
executed request is prohibited unless represented as a new authorized
Action or explicitly standardized semantic transformation.

Equivalent transport encoding is permitted.

------------------------------------------------------------------------

# 34. Acceptance Point

A deployment MUST define the deterministic point at which a candidate
request becomes an authoritative Action occurrence.

Before that point, a request may be a:

``` text
proposal
draft
candidate
incoming request
```

After acceptance:

``` text
action_id
schema_digest
semantic payload
action_digest
```

are authoritative and immutable.

Malformed requests rejected before Action creation MAY be logged outside
the Action lifecycle.

------------------------------------------------------------------------

# 35. Replay

Replaying identical Action content does not automatically restore
authority.

Replay prevention, freshness, idempotency, and exactly-once execution
remain Rule, Claim, Lifecycle, and execution-profile concerns.

`action_digest` MUST NOT be treated as a universal replay token.

------------------------------------------------------------------------

# 36. Migration From v0.1

A VE-001 v0.1 Action MUST NOT receive a v0.2 `action_digest` by implicit
inference.

A migration profile MUST explicitly classify each legacy field as:

``` text
semantic payload
bound Instance Envelope
external Claim / governance context
unbound non-authoritative metadata
local implementation metadata
```

Only after classification under a declared schema and canonicalization
profile may v0.2 content identity be computed.

------------------------------------------------------------------------

# 37. Conformance Requirements

A conforming VE-001 v0.2 implementation MUST satisfy:

### ACT-C01

Every governed consequential execution request becomes a canonical
Action before execution.

### ACT-C02

Every authoritative Action has one immutable `action_id`.

### ACT-C03

Every authoritative Action has one deterministic `action_digest`.

### ACT-C04

`action_digest` binds the normative `schema_digest` and canonical
Semantic Payload under the required Canonical Encoding Profile.

### ACT-C05

Material Action semantics cannot be silently mutated after acceptance.

### ACT-C06

Occurrence metadata does not pollute semantic content identity merely to
force digest uniqueness.

### ACT-C07

Initiator and authority context are not treated as universal semantic
Action fields.

### ACT-C08

VE-001 defines no universal semantic `scope`.

### ACT-C09

An Action does not select its own governing Rule, Trust Context, or
execution authority.

### ACT-C10

Unknown or ambiguous Action semantics fail closed.

### ACT-C11

Same `action_digest` may correspond to multiple Action occurrences.

### ACT-C12

Digest equality does not imply idempotency, authorization, execution, or
commit.

### ACT-C13

Any authoritative artifact that depends on one occurrence carrying
particular content binds at least `(action_id, action_digest)`.

### ACT-C14

No conforming implementation requires a universal third Action identity.

### ACT-C15

Lifecycle status is not authoritative Action content.

### ACT-C16

Cryptographic interoperability MUST NOT be claimed unless the normative
Canonical Encoding Profile and digest suite are shared.

------------------------------------------------------------------------

# 38. Conformance Tests

## Test 1 --- Identity stability

Attempt to change `action_id` after acceptance.

Expected:

``` text
rejected
```

## Test 2 --- Semantic mutation

Change a semantic value:

``` text
amount = 100
```

to:

``` text
amount = 1000
```

Expected:

``` text
action_digest changes
existing Action cannot be mutated
```

## Test 3 --- Same content, different occurrence

Create two independent Action occurrences with identical schema and
Semantic Payload.

Expected:

``` text
same action_digest
different action_id
```

## Test 4 --- Schema substitution

Use identical payload values under different schema digests.

Expected:

``` text
different action_digest
```

## Test 5 --- Initiator change

Associate identical semantic content with a different initiator Claim.

Expected:

``` text
action_digest unchanged
```

unless represented identity is explicitly part of the Action Schema's
semantic payload.

## Test 6 --- Occurrence-specific approval

Create approval for:

``` text
(action_id = A1, action_digest = D)
```

Attempt to apply it to:

``` text
(action_id = A2, action_digest = D)
```

Expected:

``` text
rejected
```

unless the Claim semantics explicitly authorize more than one
occurrence.

## Test 7 --- Canonical encoding divergence

Encode the same logical payload using a non-normative serialization or
canonicalization profile.

Expected:

``` text
not cryptographically interoperable
```

The implementation MUST NOT claim equality based on locally produced
bytes.

## Test 8 --- Authority hint

Place a candidate Trust Context or Rule reference in the Instance
Envelope.

Expected:

``` text
reference does not become authoritative by inclusion
```

## Test 9 --- Unknown schema

Provide a schema reference whose descriptor cannot be resolved or whose
digest does not match.

Expected:

``` text
no governed execution
```

## Test 10 --- Status projection

Change cached lifecycle status without authoritative Event support.

Expected:

``` text
Action semantics and identity unchanged
```

------------------------------------------------------------------------

# 39. Security Considerations

Security-sensitive areas include:

-   malicious canonicalization;
-   schema substitution;
-   semantic mutation after approval;
-   occurrence/content substitution;
-   digest downgrade;
-   authority confusion;
-   replay;
-   duplicate execution;
-   ambiguous field classification;
-   inconsistent Unicode or numeric encoding;
-   canonicalization-profile mismatch.

Implementations MUST treat schema resolution, canonicalization, digest
computation, and structural validation as part of the trusted computing
base.

------------------------------------------------------------------------

# 40. Architectural Decision Test

### Consistency

**PASS.** Action remains the stable unit of governed execution intent.

### Primitive necessity

**PASS.** No new semantic primitive is introduced.

### Removability

**PASS.** Removing `action_id` collapses distinct repeated occurrences.
Removing `action_digest` removes exact semantic-content identity. A
universal third identity is unnecessary and therefore excluded.

### Twenty-year durability

**PASS.** Content identity and occurrence identity are independent of
current vendors and execution domains.

### Independent implementation

**CONDITIONAL PASS.** Semantic behavior is independently specified here.
Byte-for-byte cryptographic interoperability additionally requires the
normative Canonical Encoding Profile.

### Complexity reduction

**PASS.** The specification removes universal Actor/authority/Scope
assumptions while preserving deterministic semantic identity.

------------------------------------------------------------------------

# 41. Open Questions

## OQ-ACT-001 --- Exact acceptance point

Should VE standardize the exact protocol moment at which `action_id`
becomes authoritative?

## OQ-ACT-002 --- Execution attempts

Should attempts remain Event structures or require future formalization?

The burden for a new primitive remains high.

## OQ-ACT-003 --- Canonical Encoding Profile

Which concrete canonical encoding, framing, domain-separation, and
digest-suite profile should VE standardize?

This is a **normative protocol dependency**, not an unresolved Action
semantic.

## OQ-ACT-004 --- Global operation naming

Should global semantic operation namespaces exist, or should schema
identity alone provide sufficient interpretation?

## OQ-ACT-005 --- Read governance

Should VE standardize consequential reads?

## OQ-ACT-006 --- Parent semantics

Should parent-child relationships have standardized authorization
inheritance?

## OQ-ACT-007 --- Idempotency lifetime

How long does an idempotency key remain authoritative?

## OQ-ACT-008 --- Expiration semantics

Does expiration prohibit execution completely or require
re-authorization?

## OQ-ACT-009 --- Action transformation

Should material semantic transformations always create new Actions?

## OQ-ACT-010 --- Composite Actions

Are correlation and parent-child relationships sufficient without a
Composite Action primitive?

------------------------------------------------------------------------

# 42. Revision History

## v0.2

Implemented RFC-004 v0.2 and ADR-004.

Established:

-   dual Action identity: `action_id` and `action_digest`;
-   schema-digest-bound semantic content identity;
-   Semantic Payload / Instance Envelope separation;
-   occurrence/content binding invariant;
-   no mandatory `instance_digest`;
-   removal of universal semantic `initiator`;
-   removal of universal semantic `authority_context`;
-   removal of universal semantic `scope`;
-   schema-defined effect fields rather than a VE domain ontology;
-   normative dependence on canonical encoding for cryptographic
    interoperability.

## v0.1

Initial formal definition of the Action primitive.

------------------------------------------------------------------------

# 43. Foundational Rule

The Action primitive preserves two questions before consequence begins:

``` text
What exactly is being proposed?
Which occurrence of that proposal is this?
```

Neither answer establishes that the Action may execute or that reality
changed.

``` text
INTENT
  │
  ▼
ACTION
  │
  ▼
EXECUTION BOUNDARY
```

If the meaning or cryptographic identity of an Action cannot be
determined under the required protocol profile, governed execution MUST
NOT proceed.
