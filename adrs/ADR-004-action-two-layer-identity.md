# ADR-004 --- Separate Action Content Identity From Action Occurrence Identity

**Status:** Accepted\
**Date:** 2026-08-20\
**Related RFC:** RFC-004 v0.2 --- Two-Layer Action Identity and Semantic
Payload Boundary\
**Affects:** VE-001 Action Specification

## 1. Context

VE-001 v0.1 correctly defines `action_id` as historical Action identity
and permits identical semantic requests to exist as distinct Action
occurrences. RFC-004 v0.2 adds the requirement for deterministic
cryptographic identity of exact Action semantics.

The architecture must therefore distinguish:

``` text
what exactly is proposed
```

from:

``` text
which occurrence of that proposal is referenced
```

RFC-004 v0.2 also determined that this does not justify a mandatory
third Action identity such as `instance_digest`. The required security
property is cryptographic binding between occurrence identity and
semantic content identity wherever an authoritative artifact depends on
that association.

## 2. Decision

Verified Execution SHALL distinguish two Action identities:

``` text
action_digest = deterministic cryptographic identity of exact semantic Action content
action_id     = immutable identifier of the historical Action occurrence
```

These identities MUST NOT be conflated.

### 2.1 Semantic content identity

Every authoritative Action MUST have an `action_digest` derived from:

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

The applicable protocol specification MUST define canonical encoding,
framing, domain separation, and digest-suite representation.

`action_digest` answers:

> **What exactly is being proposed?**

Changing schema identity or any semantically material Action field MUST
change `action_digest`.

### 2.2 Occurrence identity

Every authoritative Action MUST have an immutable `action_id`.

`action_id` answers:

> **Which historical occurrence of that proposal is this?**

Two Action occurrences MAY share the same `action_digest` while having
different `action_id` values.

Therefore:

``` text
same action_digest != same Action occurrence
```

### 2.3 Occurrence/content binding invariant

Any authoritative artifact whose semantics depend on a particular Action
occurrence carrying particular semantic content MUST cryptographically
bind at least:

``` text
(action_id, action_digest)
```

If an applicable protocol defines additional authoritative Instance
Envelope fields, it MUST specify which fields participate in that
artifact's cryptographic binding.

### 2.4 No mandatory third identity

VE SHALL NOT require a universal `instance_digest`.

A protocol MAY derive a compact commitment:

``` text
instance_commitment =
    H(
        domain_separator
        ||
        action_id
        ||
        action_digest
        ||
        canonical_bound_instance_fields
    )
```

Such a commitment is protocol machinery, not a new primitive or
universally required Action identity.

## 3. Action Structure

An Action SHALL be modeled logically as:

``` text
Action
├── Instance Envelope
│   └── action_id
└── Semantic Payload
    ├── schema_digest
    └── schema-defined semantic fields
```

Semantic Payload expresses the proposed consequential effect.

Instance Envelope contains occurrence-level information.

Occurrence metadata MUST NOT enter Semantic Payload merely to force
unique `action_digest` values.

## 4. Semantic Payload Classification Rule

A field MUST be canonical Semantic Payload when changing it can change:

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

This rule does not permit an Action to choose its own Rule, Trust
Context, or authority.

## 5. Instance Envelope Classification

Occurrence-level fields MAY include:

``` text
action_id
instance_created_at
correlation_id
parent / causation reference
instance_nonce
envelope_version
non-authoritative routing hints
```

Protocols defining such fields MUST classify them as:

``` text
bound authoritative fields
unbound / non-authoritative fields
local implementation metadata
```

Not every Instance Envelope field is automatically bound.

A field whose mutation could alter interpretation, provenance, replay
behavior, or authoritative history relied upon by an artifact MUST
participate in that artifact's cryptographic binding.

## 6. Reclassification of VE-001 v0.1 Fields

-   **`action_id`** --- retain as immutable occurrence identity; remove
    from semantic content identity.
-   **`created_at`** --- occurrence-level when evidentiary. Execution
    timing constraints belong explicitly in Semantic Payload.
-   **`initiator`** --- remove as universally required semantic content.
    Normally Claim/provenance information; semantic only when
    represented identity changes the requested effect.
-   **`authority_context`** --- remove as universally required semantic
    content. Authority is independently established through Claims,
    Trust Context, Rule applicability, and verification.
-   **`scope`** --- remove as a universal semantic Action field.
    Applicability is computed over canonical schema-defined Action
    fields.
-   **`target`, `operation`, `arguments`** --- retain effect-relevant
    semantics but make exact representation Action-Schema-defined rather
    than a universal VE ontology.
-   **`spec_version`** --- separate schema semantics from
    envelope/protocol versioning. Normative semantic schema identity is
    `schema_digest`.

## 7. Schema Identity

Every authoritative Action MUST identify the exact schema contract under
which Semantic Payload is interpreted.

The normative schema identity is:

``` text
schema_digest
```

Human-readable schema identifiers and version labels MAY accompany it.

`schema_digest` MUST participate in `action_digest`.

This does not introduce `ActionSchema` as a new kernel primitive or
require a global registry.

## 8. Consequences

### Positive

-   Exact Action semantics receive deterministic cryptographic identity.
-   Multiple independent occurrences of identical content remain
    possible.
-   Approvals, Claims, Receipts, and execution evidence can bind exact
    content.
-   Occurrence/content substitution can be prevented without a third
    Action identity.
-   Action is separated more cleanly from provenance, authority, and
    applicability.
-   Universal `initiator`, `authority_context`, and `scope` assumptions
    are removed.

### Costs

-   VE-001 requires semantic revision.
-   Canonical encoding, framing/domain separation, and digest-suite
    specifications are required for byte-for-byte interoperability.
-   VE-001 v0.1 objects require an explicit migration profile.
-   VE-004 Receipt binding semantics require downstream review.

### Non-consequences

The decision does not imply:

``` text
same action_digest => same occurrence
same action_digest => duplicate
same action_digest => idempotent
same action_digest => authorized
same action_digest => executed
same action_digest => committed
```

## 9. Security Properties

### Semantic mutation resistance

Changing any semantically material field or schema identity changes
`action_digest`.

### Repeated occurrence preservation

Identical semantic content may be proposed multiple times without
collapsing histories.

### Occurrence/content substitution resistance

An authoritative artifact that depends on a particular occurrence MUST
bind `action_id` and `action_digest` together.

### Non-self-authorization

An Action cannot establish its governing Rule, Trust Context, or
authority merely by carrying a reference to it.

### Digest non-overloading

`action_digest` proves content identity only. It is not an authorization
token, replay token, idempotency key, execution proof, or commit proof.

## 10. Alternatives Considered

### Keep `action_id` as sole identity

**Rejected.** It does not independently prove exact semantic content.

### Use `action_digest` as sole identity

**Rejected.** It collapses distinct repeated occurrences.

### Require `instance_digest` as a third universal Action identity

**Rejected.** The necessary security property is direct cryptographic
binding of occurrence and content. A mandatory third identity is
removable without architectural loss.

### Hash one monolithic Action object

**Rejected.** It destroys useful content equivalence and contaminates
semantic identity with occurrence/provenance metadata.

### Retain universal `initiator`, `authority_context`, and `scope`

**Rejected.** They conflate Action semantics with provenance, authority,
and applicability.

## 11. Architectural Decision Test

1.  **Founding Principles:** PASS --- strengthens separation of intent,
    authority, execution, and evidence.
2.  **New primitive:** PASS --- none introduced.
3.  **Removability:** PASS --- `action_id` and `action_digest` are
    necessary; universal `instance_digest` is removable and therefore
    excluded.
4.  **Twenty-year test:** PASS --- content identity vs. occurrence
    identity is domain-independent.
5.  **Independent implementation:** CONDITIONAL PASS --- architectural
    semantics are deterministic; byte-level interoperability requires
    canonical encoding and digest-suite specifications.
6.  **Complexity:** PASS --- removes overloaded fields and avoids an
    unnecessary third identity.

## 12. Compatibility and Migration

VE-001 v0.1 Actions MUST NOT receive v0.2 `action_digest` values by
implicit inference.

A migration profile MUST classify each legacy field as:

``` text
semantic payload
bound Instance Envelope
external Claim / governance context
unbound non-authoritative metadata
local implementation metadata
```

Only after classification and canonicalization may v0.2 content identity
be computed.

## 13. Required Follow-On Work

Acceptance of this ADR authorizes revision of VE-001 to v0.2.

Before VE-001 v0.2 can claim full independent cryptographic
interoperability, VE MUST define:

1.  canonical Action Schema representation;
2.  canonical Semantic Payload encoding;
3.  digest framing and domain separation;
4.  digest-suite representation.

After VE-001 v0.2 is adopted, VE-004 Receipt semantics MUST be reviewed
to determine the minimum required binding to:

``` text
action_id
action_digest
```

and any additional Receipt-specific authoritative fields.

## 14. Decision

**ACCEPTED.**

> **Dual Action Identity Invariant:** Every authoritative Action MUST
> have an immutable occurrence identifier (`action_id`) and
> deterministic semantic content identity (`action_digest`).

> **Occurrence/Content Binding Invariant:** Any authoritative artifact
> whose semantics depend upon a particular Action occurrence carrying
> particular semantic content MUST cryptographically bind `action_id` to
> `action_digest`, together with any additional authoritative Instance
> Envelope fields on which that artifact relies.

Verified Execution does **not** adopt `instance_digest` as a mandatory
third Action identity.

## 15. Supersession

This ADR governs the VE-001 v0.2 revision authorized by RFC-004 v0.2.

Any future change to the dual-identity model or occurrence/content
binding invariant requires normal specification governance: RFC, ADR,
specification version increment, and changelog entry.
