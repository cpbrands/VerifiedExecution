---
id: ADR-011
title: Execution Right Core
version: "0.1"
status: Proposed
document_type: ADR
category: Authorization
author: Verified Execution Editorial Board
created: 2026-09-03
updated: 2026-09-03
depends_on:
  - RFC-011
  - VE-001
related_documents:
  - RS-ER-001-INDEPENDENT-EXECUTOR
  - GAP-ANALYSIS-RS-ER-001
  - RS-ER-002-TEMPORAL-AUTHORIZATION
  - GAP-ANALYSIS-RS-ER-002
  - ADR-ENC-001
  - ADR-VERIFY-002
supersedes: null
superseded_by: null
---

# ADR-011 — Execution Right Core

## 1. Status and scope

**Status:** Proposed
**Related RFC:** RFC-011 — Execution Right Core
**Decision:** A. ACCEPT RFC-011 EXECUTION RIGHT CORE ARCHITECTURE.

This Proposed ADR records the architectural decision supported by RS-ER-001,
RS-ER-002, and RFC-011. It does not approve RFC-011, create or approve an
Execution Right specification, modify VE-001, select a verification profile, or
define a wire representation.

## 2. Context

An independent executor needs a portable artifact from which it can determine
whether one exact canonical Action occurrence and its exact semantic content
were authorized. Enforcement must not require the executor to:

- re-run VE Rules;
- revalidate the Claims or delegation used at issuance;
- reconstruct the policy evaluation;
- consult a VE policy database; or
- call VE online.

RS-ER-001 demonstrates the need for exact occurrence/content binding and
authenticated enforceability. RS-ER-002 demonstrates that authorization is a
durable historical snapshot while present acceptance of its attester remains a
current verifier-local decision.

## 3. Decision

**A. ACCEPT RFC-011 EXECUTION RIGHT CORE ARCHITECTURE.**

The decision has four parts.

### 3.1 Semantic payload

Execution Right semantic payload is exactly:

```text
(action_id, action_digest)
```

`action_id` binds the exact Action occurrence. `action_digest` binds the exact
semantic Action content. Neither alone is sufficient: occurrence-only binding
permits content substitution, while content-only binding permits reuse across
distinct occurrences with identical content.

The canonical Action remains separate. The right does not duplicate or contain
Action content. `action_id` remains governed by VE-001; this ADR neither
redefines it nor adopts the shared `OccurrenceId` convention.

### 3.2 Authenticated artifact

A usable Execution Right is an authenticated, object/domain-separated
representation of the semantic Action pair.

Authentication is artifact machinery, not additional Execution Right semantic
meaning. The representation must prevent an authenticated Claim, Action,
Receipt, authorization record, or arbitrary signed object from being relabeled
and accepted as an Execution Right.

Exact structure, framing, profile, protected headers, and byte layout are not
decided here.

### 3.3 Attester trust

Enforceability requires current verifier-local recognition of the authenticated
attester as authorized to issue Execution Rights in the applicable context.
Verifier-local configuration may scope that recognition by context, including
an Action schema or protected boundary, without adding `issuer_ref`, `audience`,
or `resource_ref` to the right.

```text
cryptographically valid signature
!= authorized Execution Right issuer

authorization-result attester
!= Root Authority
```

The right conveys derived enforceability resulting from VE authorization. It
does not create underlying legitimacy or authority, and recognized attester
authority is not global.

### 3.4 Durable authorization snapshot

An Execution Right records an immutable authorization decision for the exact
Action pair under the authoritative inputs accepted by VE at issuance. Later
Rule, Claim, delegation, or policy changes do not retroactively invalidate that
historical authorization decision and are not re-evaluated at execution.

At presentation time, current verifier-local trust still applies:

```text
historical authorization
!= present artifact acceptance
```

This snapshot rule introduces no live policy-revalidation dependency and no
permanent trust in the attester.

## 4. Consequences

### 4.1 Replay, state commitment, and uncertainty

```text
authorization replay
!= duplicate canonical state commitment

right validity
!= retry safety
```

An `UNCERTAIN` execution outcome does not mutate, consume, revoke, or invalidate
the Execution Right. Continued right validity does not establish that another
attempt is safe. Atomic commitment, idempotency, duplicate-transition
prevention, and retry safety remain responsibilities of the authoritative
execution/state domain.

### 4.2 Execution-time constraints

Execution-time constraints that affect whether the protected transition may
occur belong in canonical Action semantics. Material changes to canonical
temporal constraints therefore may change `action_digest`. Temporal facts that
do not affect the protected transition are not moved into Action semantics by
this decision.

### 4.3 Independent execution

The architectural direction permits an executor to decide enforceability from:

- the canonical Action;
- the Execution Right artifact;
- applicable VE specifications and profiles;
- verifier-local trust configuration; and
- a conforming Adapter/protected-resource implementation.

No issuance Claims, issuance Rules, evaluation transcript, hidden policy
database, online VE callback, or human interpretation is required.

## 5. Explicit non-decisions

ADR-011 does not decide:

- concrete Execution Right structure;
- field encoding or VE-CBOR-1 map layout;
- exact object/domain framing;
- a verification profile or COSE, JWS, MAC, or signature selection;
- verification-profile dispatch representation;
- authenticated-coverage construction;
- protected-header construction;
- external associated data;
- parsing rules;
- unknown-field, extension, or ignorable-field processing;
- version negotiation;
- concrete fail-closed processing or public error codes; or
- conformance vectors.

Those are future normative specification/profile concerns. Accepted
ADR-ENC-001 already governs VE-CBOR-1 where canonical bytes affect identity,
digest, signature, or reproducibility; ADR-011 does not duplicate or broaden
that decision.

ADR-VERIFY-002 remains Claim-specific and profile-limited. Only its general
principles are analogous: semantic content is separate from verification
machinery, profile dispatch is explicit, verification does not equal trust,
verification-affecting parameters are protected, and object/domain separation
prevents relabeling. Claim syntax, `issuer_ref`, Claim COSE profiles, external
associated data, and Claim framing are not inherited.

## 6. Explicit rejections

The decision rejects the following as core Execution Right fields or semantics:

- `execution_profile`;
- `resource_ref`;
- `executor_ref`;
- `issuer_ref`;
- `audience`;
- universal expiry, `issued_at`, or `valid_until`;
- universal per-right revocation;
- Execution Right identifier or content digest;
- mutable, consumable, spent, or replay-lifecycle state;
- policy transcript or Claim/Rule provenance; and
- duplicate Action content.

It also rejects new generic primitives named or equivalent to `SignedArtifact`,
`AuthenticatedArtifact`, `VerificationEnvelope`, `TrustContext`, `Capability`,
`Grant`, `Token`, `AuthorizationSnapshot`, `StatusAuthority`, `Executor`, or
`ExecutionConstraint`, unless future independent evidence justifies one through
governance.

These rejections do not prohibit deployment-specific signer trust removal,
resource refusal, denylists, or separately governed status mechanisms. They
reject universal core semantics, not local enforcement capabilities.

## 7. Interoperability dependency

Portable Action canonicalization and `action_digest` interoperability remain
unresolved under VE-001. This does not invalidate the ADR-011 architectural
decision, but it blocks completion of a portable Execution Right specification
until the governing Action byte-producing and digest dependencies are resolved.
ADR-011 introduces no generic digest abstraction to conceal that dependency.

## 8. Security and failure implications

Verification and profile selection must not permit substitution that changes
enforceability. A malformed, unauthenticated, ambiguously interpreted, or
otherwise non-conforming artifact cannot establish enforceability.

ADR-011 does not decide dispatch, bootstrap, hint handling, parser selection,
unknown-field or extension behavior, ignorable metadata, version negotiation,
concrete failure processing, or a public error-code taxonomy. Future governed
specification/profile work defines those rules.

## 9. Alternatives considered

| Alternative | Decision |
|---|---|
| `action_id` only | Rejected: permits semantic-content substitution. |
| `action_digest` only | Rejected: permits reuse across distinct occurrences. |
| Duplicate the Action | Rejected: creates conflicting canonical sources. |
| Live Rule/Claim/policy re-evaluation | Rejected: duplicates authorization and prevents independent offline enforcement. |
| Universal temporal, revocation, identity, audience, or lifecycle fields | Rejected: not justified by current evidence. |
| Resource, executor, or Adapter mechanics in the right | Rejected: Action semantics and protected-resource integration already own those concerns. |
| Generic signed-artifact or trust-context primitive | Rejected: shared cryptographic properties do not justify a new architectural object. |

## 10. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Intent, derived authorization, artifact verification, protected execution, and authoritative outcome remain separate. |
| New primitive burden | Pass. Execution Right is an existing architectural role; no adjacent primitive is introduced. |
| Necessity/removability | Pass. Both Action bindings, authentication, domain separation, attester recognition, and snapshot semantics are necessary; every additional tested core field is removable. |
| Twenty-year durability | Pass. The decision is independent of algorithms, transports, vendors, registries, online services, and clock technology. |
| Independent implementability | Pass in architectural direction. Portable implementation remains contingent on Action-digest interoperability and future concrete representation/profile rules. |
| Reduced conceptual complexity | Pass. The decision avoids duplicating Action, policy, trust, identity, execution, or lifecycle models. |

## 11. Future normative boundary

After RFC-011 and ADR-011 complete governance, future specification/profile work
may define:

- concrete structure and field encoding;
- VE-CBOR-1 layout;
- object/domain framing;
- verification-profile definition;
- profile dispatch representation;
- authenticated-coverage construction;
- protected headers and external associated data;
- parsing rules;
- unknown-field and extension processing;
- concrete fail-closed processing; and
- conformance vectors.

That work remains blocked from claiming complete portability until VE-001 Action
canonicalization and `action_digest` interoperability are resolved.

## 12. Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-03 | Initial Proposed ADR recording the four-part Execution Right core architecture from RS-ER-001, RS-ER-002, and RFC-011. |
