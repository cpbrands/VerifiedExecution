---
id: RFC-011
title: Execution Right Core
version: "0.1"
status: Accepted
document_type: RFC
category: Authorization
author: Verified Execution Editorial Board
created: 2026-09-03
updated: 2026-09-03
depends_on:
  - SPECIFICATION-GOVERNANCE
  - VE-001
related_documents:
  - RS-ER-001-INDEPENDENT-EXECUTOR
  - GAP-ANALYSIS-RS-ER-001
  - RS-ER-002-TEMPORAL-AUTHORIZATION
  - GAP-ANALYSIS-RS-ER-002
  - ADR-ENC-001
  - ADR-VERIFY-002
  - VE-005
  - VE-006
supersedes: null
superseded_by: null
---

# RFC-011 — Execution Right Core

## 1. Status and narrow scope

**Status:** Accepted

This Accepted RFC records the minimum semantic contract by which an independent
executor can determine whether an authentic authorization applies to one exact
Action. It formalizes the Execution Right role already present in VE
architecture; it does not approve an Execution Right specification, select a
wire encoding or cryptographic mechanism, create an ADR, or modify VE-001 or
another Approved specification.

The accepted decision is:

> Minimum Execution Right semantics consist of exact Action occurrence/content
> binding. An enforceable artifact is an authenticated, domain-separated,
> substitution-resistant representation of that exact semantic pair, accepted
> under current verifier-local issuer authority.

The logical minimum is:

```text
ExecutionRightSemantics {
  action_id
  action_digest
}
```

Verification machinery establishes authentic enforceability; it is not
additional Execution Right semantic meaning. This semantic contract does not
select the final flat or body-envelope representation.

## 2. Context

VE architecture refers to Execution Rights accepted by protected systems and
places protected execution behind an Execution Boundary. VE-001 defines a
canonical Action and its two-layer identity. RS-ER-001 nevertheless finds no
normative definition of the minimum portable Execution Right structure,
authenticated coverage, verification-profile binding, issuer-recognition
boundary, or fail-closed verification process.

A separate executor that alone can invoke a protected resource must answer:

> Does this authorization permit execution of this exact Action?

It must answer without re-running VE Rules, consulting hidden VE policy,
receiving broad standing authority, inferring absent constraints, or depending
on Adapter-specific authorization semantics.

## 3. Motivation

Naming an Execution Right role is insufficient for independent
implementation. Without a governed minimum, one executor could accept a right
bound only to an occurrence identifier, another could treat a content digest
as an occurrence identifier, and another could accept a signature that does
not cover verification-profile selection. Those implementations would reach
different enforceability decisions for identical inputs.

The smallest portable contract must prevent Action substitution, occurrence
substitution, cross-object relabeling, verification-profile substitution, and
acceptance of an unauthorized signer without duplicating Action meaning or
turning the right into an audit transcript or mutable capability object.

## 4. Goals and non-goals

### 4.1 Goals

This RFC proposes semantics sufficient to:

- bind authorization to one Action occurrence and its exact semantic content;
- establish that the authorization artifact is authentic;
- establish through verifier-local authoritative configuration that the signer
  is authorized to issue Execution Rights in the applicable context;
- make verification-profile selection substitution-resistant;
- distinguish Execution Rights from other authenticated VE objects;
- make malformed, unsupported, mismatched, and unauthorized inputs fail closed;
  and
- permit two independent executors to reach the same enforceability result.

### 4.2 Non-goals

This RFC does not define:

- an `execution_profile`, `resource_ref`, `executor_ref`, or Adapter identifier;
- API endpoints, protocol mappings, transport, or target authentication;
- Rule, Claim, Predicate Schema, evaluation-transcript, explanation, or policy
  provenance in an Execution Right;
- single-use, replay lifecycle, mutable, consumable, revocable, or spent-right
  state;
- universal `issued_at`, `valid_until`, revocation lookup, right identity,
  audience, or live policy revalidation;
- an `ExecutionRightId` or `ExecutionRightDigest`;
- a generic `Capability`, `Grant`, `Token`, `AuthorizationContext`,
  `AuthorizationSnapshot`, `Revocation`, `StatusAuthority`, `TrustContext`,
  `ExecutionConstraint`, `Executor`, `SignedArtifact`, or `ExecutionProfile`;
- a generic digest, signature, key, issuer, registry, or resolver architecture;
  or
- a final encoding, signature algorithm, COSE profile, JWS profile, MAC, or raw
  signature construction.

## 5. Accepted architectural direction

### 5.1 Minimum semantic contract

The complete semantic payload of an Execution Right is:

```text
action_id
action_digest
```

`action_id` and `action_digest` are the semantic binding fields. The required
artifact property is an authenticated, domain-separated,
substitution-resistant representation of that exact pair. Verification
machinery establishes authenticity, enforceability attestation, protected
profile selection, and recognized issuer authority; it does not add Execution
Right semantic meaning.

### 5.2 `action_id`: occurrence binding

`action_id` binds the right to one historical Action occurrence under VE-001.
An executor rejects use of the right for an Action with a different
`action_id`, even when both Actions have identical `action_digest` values.

This RFC does not alter the generation, representation, equality, or lifecycle
semantics of VE-001 `action_id`.

### 5.3 `action_digest`: semantic-content binding

`action_digest` binds the right to the exact semantic content of the authorized
Action. An executor rejects an Action whose semantic content differs from that
bound by the right, including an Action presented with the same `action_id`.

The executor does not blindly trust a digest value carried with an Action. It
validates the presented canonical Action and independently recomputes or
verifies its content identity under the governing VE-001 schema,
canonicalization, and digest rules, then compares that value with the right's
`action_digest`.

This RFC introduces no generic digest or content-identity primitive.

### 5.4 Pair invariant

An Execution Right authorizes exactly the Action identified by:

```text
(action_id, action_digest)
```

Both comparisons use the exact equality rules of their governing Action
specifications. Neither identifier alone is sufficient:

- `action_id` alone permits semantic-content substitution; and
- `action_digest` alone permits reuse across distinct occurrences with
  identical content.

### 5.5 Presented Action remains separate

The canonical Action is not embedded or duplicated in the right. The executor
receives:

```text
canonical Action
+ Execution Right
+ governing VE specifications
+ verifier-local authoritative configuration
```

The right authorizes the Action; it is not an Action container.

## 6. Verification and authenticated coverage

### 6.1 Purpose

Verification establishes that the Execution Right was authentically issued by
an authority recognized to attest VE authorization for the protected boundary.
It establishes authentic enforceability, not the Action's semantic meaning and
not objective truth about execution outcome.

The eventual governed verification construction must define:

- profile selection;
- authenticated artifact syntax and validation;
- exact authenticated bytes or structure;
- verifier/credential selection;
- verifier-local issuer-authority recognition;
- deterministic verification procedure; and
- fail-closed behavior.

### 6.2 Authenticated coverage

Authenticity binds every field or selector that can affect enforceability. At
minimum, authenticated semantics bind:

```text
action_id
action_digest
Execution Right object/domain identity
verification-profile selection
```

The verification-profile selector cannot be freely substitutable outside the
authenticated construction. A later profile may place it inside authenticated
content or may define a construction in which profile selection is itself
cryptographically and domain bound. Either approach must be deterministic and
resistant to profile or algorithm substitution.

Profile dispatch must be unambiguous. If initial dispatch uses a hint that is
not yet authenticated, verification cryptographically reconciles that hint
with the authenticated profile choice; a mismatch fails closed. This bootstrap
property does not require the profile selector to be a semantic-body field.

This RFC does not prescribe protected-header layout, external associated data,
framing bytes, or a specific signature/MAC format.

### 6.3 Object/domain separation

The authenticated construction distinguishes an Execution Right from a Claim,
Action, Receipt, authorization record, or generic signed value. An authentic
object of another type cannot be relabeled and accepted as an Execution Right.

This RFC requires that property but does not select exact domain-separation
bytes.

## 7. Issuer and verifier-local trust boundary

A cryptographically valid signer is not necessarily an authorized Execution
Right issuer. The accepted model is:

```text
verification establishes signer/credential validity
+ verifier-local authoritative configuration determines whether that signer
  may issue Execution Rights in the applicable context
```

That configuration is environmental verifier input, not Execution Right
semantic content and not a new `TrustContext` primitive. It may provision
supported verification profiles, accepted credentials, and recognized
authorization-result attesters without requiring online resolution.

No universal semantic `issuer_ref` survives the minimum test. The recognized
signer and its authorization arise from verification plus verifier-local
configuration. An authorization-result attester is not Root Authority. Neither
the Execution Right, its signer, VE, nor the executor gains that role; the
protected boundary retains authority to decide which attesters it recognizes.

## 8. Action semantics versus execution mechanics

The separation is:

```text
Action                    requested semantic transition
Execution Right           authorization for that exact Action
Adapter/protected resource execution mechanics
```

VE-001 requires effect-changing target, destination, operation, material
arguments, capability, and explicit execution constraints to be semantic Action
content. `schema_digest`, canonical Action content, and `action_digest` bind
that meaning.

Adapter and protected-resource integration own API selection, field mapping,
serialization, transport, target authentication, and retry mechanics. The same
semantic Action may be executed through multiple conforming adapters without
different Execution Rights.

If identical canonical Action semantics can legitimately produce different
semantic state transitions, the Action schema is under-specified. An
Execution Right `execution_profile` must not preserve or repair that ambiguity.
A cryptographic field cannot make a malicious or non-conforming executor
implement Action semantics correctly.

## 9. Policy and audit-evidence separation

Executor enforcement does not require:

- Rule identifiers or digests;
- Claim identifiers;
- Predicate Schema identities;
- evaluation transcripts;
- explanations;
- policy versions; or
- authorization reasoning.

Those items may be retained in Event, Receipt, authorization-record, or audit
evidence. Rules do not travel with the right, and the executor does not repeat
VE policy evaluation.

## 10. Time, replay, retries, and uncertain outcome

### 10.1 Time

An Execution Right is immutable evidence that the exact Action was authorized
under the authoritative inputs accepted at issuance. Later Rule, Claim,
delegation, or policy changes do not retroactively invalidate that issued
authorization decision.

That historical authorization snapshot is not permanent trust in the
attester. At presentation time, the executor still applies current
verifier-local trust configuration to the authenticated attester and selected
profile.

No universal expiry, `issued_at`, `valid_until`, revocation lookup, right
identity, audience, mutable/consumable state, or live policy revalidation
belongs in the core right. Demonstrated execution-time validity constraints
belong in canonical Action semantics when they change whether the protected
transition may occur. Materially different canonical temporal constraints
produce different bounded Action semantics and may change `action_digest`; a
textual change with no canonical semantic effect does not imply a digest
change. This includes `execute_before`, `execute_after`, and `effective_at`
constraints when they materially bound execution.

### 10.2 Replay and retries

One Execution Right does not mean one network invocation:

```text
execution attempt != protected state transition
```

The right is not inherently single-use. Multiple attempts may present the same
right while pursuing one Action occurrence and one intended canonical state
transition. The authoritative execution/state domain owns atomic commitment,
idempotency, and duplicate-commit prevention.

Authorization replay is not duplicate canonical state commitment. Presenting
the same valid authorization artifact again does not itself authorize multiple
committed state transitions.

### 10.3 Uncertain outcome

An `UNCERTAIN` execution outcome does not mutate, consume, revoke, or implicitly
invalidate the Execution Right. Right validity is not retry safety. VE
preserves `UNCERTAIN` until authoritative execution/outcome state establishes
commitment, non-commitment, or whether another attempt is safe; continued right
validity does not automatically permit retry.

RFC-011 introduces no Execution Right lifecycle state.

## 11. Failure semantics

An executor fails closed for at least these conceptual categories:

- malformed Execution Right;
- unsupported verification profile;
- verification failure;
- unrecognized or unauthorized issuer;
- Action-occurrence mismatch;
- Action-content or digest mismatch; and
- unsupported or ambiguous Action semantics;
- ambiguous parsing, duplicate fields, ignored or trailing data;
- dispatch/profile mismatch; and
- unknown authenticated semantic fields, unless the selected governed
  profile/version explicitly defines their interpretation.

A future specification may expose one general `not enforceable` result while
retaining these distinctions internally for safe processing and diagnostics.
This RFC does not freeze public error-code names or permit fallback, guessing,
partial verification, ignored fields, or ambiguous parsing. Unknown
authenticated semantic fields fail closed unless their interpretation is
explicitly defined by the selected governed profile/version. This durable rule
does not require an independent universal core version field.

## 12. Independent implementability

Two independent executors given the same:

```text
canonical Action
Execution Right
governing VE specifications
verifier-local authoritative configuration
```

can implement the architectural direction independently in principle. The
decision cannot require a hidden VE database, Rule re-evaluation, human
interpretation, or an online callback to VE unless a later explicitly governed
profile makes a particular external dependency part of its contract.

Normative portability remains contingent on a concrete Execution Right
representation and verification profile, interoperable Action-digest
computation, and closed fail-closed parsing and dispatch rules. The future
specification/profile must close those dependencies before two implementations
are required to produce the same enforceability result.

## 13. Representation and verification-profile questions

### 13.1 Flat versus authenticated-body envelope

The following may carry the same semantic payload:

```text
ExecutionRight {
  action_id
  action_digest
  verification
}
```

```text
ExecutionRight {
  body {
    action_id
    action_digest
  }
  verification
}
```

A body wrapper and verification material are representation machinery, not
additional semantic meaning. Later representation work may select the form
that gives the clearest canonicalization, authenticated coverage, and closed
extensibility.

### 13.2 Relationship to ADR-VERIFY-002

Accepted ADR-VERIFY-002 is explicitly Claim-specific and profile-limited. Its
principles—semantic content separated from verification machinery, profile
dispatch, verification not equaling trust, protected verification-affecting
parameters, and object/domain separation—provide useful precedent. Its
`Claim { body, verification }` syntax, `issuer_ref` binding, Claim-specific COSE
profiles, and Claim-specific associated-data/framing rules do not automatically
apply to Execution Rights.

Reuse is appropriate only through an explicit Execution-Right-specific
verification profile or a later governed decision that safely broadens shared
verification machinery while preserving object-specific domain separation.
If broadening ADR-VERIFY-002 is desired, that is a separate governance
consequence; RFC-011 does not broaden it silently.

### 13.3 Canonical representation

Accepted ADR-ENC-001 already governs the encoding family: authenticated
Execution Right representation uses VE-CBOR-1 wherever byte-level signature or
reproducibility requirements apply. RFC-011 does not reopen that decision.

The exact map or envelope structure, labels, object/domain-framing
construction, verification profile, and protected-header layout remain for
subsequent governed specification/profile work.

### 13.4 Action-digest interoperability dependency

RFC-011 relies on portable Action canonicalization and `action_digest`
computation. Approved VE-001 defines the semantic digest requirement but still
lists concrete canonical encoding, framing, domain separation, and digest-suite
selection as a normative protocol dependency. Until that byte-producing
profile is governed, complete cross-implementation executor portability remains
an interoperability dependency. RFC-011 introduces no generic digest
abstraction to conceal it.

## 14. Content and occurrence identity of the right

The current problem is authenticated enforceability, not durable identity or
reference to Execution Rights. No `execution_right_digest` is justified.

No `execution_right_id` is justified either. The Action occurrence already
identifies the subject of the authorization. A later lifecycle or reference
scenario would be required before adding independent right identity.

## 15. Security impact

The proposal establishes these required properties without selecting an
encoding-specific mechanism:

| Attack | Required result |
|---|---|
| Same `action_id`, substituted Action content | Digest validation mismatches; not enforceable. |
| Same `action_digest`, substituted Action occurrence | Occurrence comparison mismatches; not enforceable. |
| Claim, Receipt, Action, or arbitrary signed data relabeled as a right | Object/domain separation rejects it. |
| Verification profile or algorithm substituted | Authenticated profile binding rejects it. |
| Dispatch hint disagrees with authenticated profile | Bootstrap reconciliation fails closed. |
| Cryptographically valid but unauthorized signer | Verifier-local authoritative configuration rejects it. |
| Malformed or non-canonical representation | Parsing/canonical validation fails closed. |
| Unknown verification profile | Verification fails closed. |
| Unknown authenticated semantic field | Selected governed profile/version defines it, or validation fails closed. |
| Trailing or ignored data | Closed representation rejects or authenticates all enforceability-affecting material; no ignored ambiguity. |
| Duplicate fields or ambiguous parsing | Deterministic representation rejects the input. |

The right does not make a malicious executor trustworthy. Correct execution
still depends on a conforming Adapter/resource implementation and authoritative
state-domain enforcement.

## 16. Alternatives considered

| Alternative | Reason for rejection |
|---|---|
| A. `action_id` only | Does not bind exact semantic content and permits content substitution. |
| B. `action_digest` only | Does not bind one occurrence and permits reuse across distinct occurrences. |
| C. Action pair plus `execution_profile` | Duplicates or undermines Action-schema meaning and leaks Adapter mechanics into authorization. |
| D. Duplicate the entire Action in the right | Creates two Action copies and conflicting canonical sources; the executor can receive the Action separately. |
| E. Carry policy transcript | Confuses enforcement with audit and requires the executor to understand policy reasoning. |
| F. Mutable or single-use capability token | Confuses an immutable authorization with attempt and commit lifecycle; breaks legitimate retries after uncertainty. |
| G. Add resource, executor, and expiry fields | Resource/time constraints belong in Action semantics when effect-changing; executor restrictions are resource-specific, not universal. |
| H. Executor re-runs VE policy | Requires Rules, Claims, hidden configuration, and duplicate policy authority at the protected boundary. |

## 17. Compatibility classification

**Class B — Compatible Semantic Extension candidate.**

Repository evidence already assumes protected systems receive execution rights
or requests from an authorized boundary, and VE-001 already requires
authoritative occurrence-dependent artifacts to bind at least
`(action_id, action_digest)`. RFC-011 formalizes those assumptions by adding a
portable minimum and verification boundary.

No existing Execution Right structure or wire representation exists to be
reinterpreted. The proposal does not change Action identity, Adapter ownership,
Claim verification, Rule semantics, Receipt semantics, or current execution
outcome authority. Final compatibility remains subject to the future
specification and representation design.

## 18. Complexity impact

Two semantic bindings plus one required artifact property replace a larger
capability-token design:

```text
occurrence binding
content binding
authenticated, domain-separated enforceability
```

Removing resource, executor, expiry, policy provenance, execution profiles,
right identity, right digest, and lifecycle state prevents duplicated authority
and reduces total conceptual complexity.

## 19. Specification impact

There is no existing Execution Right specification to revise. This Accepted
RFC, together with Accepted ADR-011, authorizes subsequent Draft
specification/profile work. That work requires:

1. a new, narrowly scoped Execution Right specification defining the semantic
   contract and its relationship to VE-001;
2. a separately governed VE-CBOR-1 representation and verification profile
   decision, whether within that specification or a subordinate profile; and
3. conformance vectors for binding, substitution resistance, malformed input,
   issuer recognition, and fail-closed behavior.

VE-001 need not change merely to restate its existing Action-pair invariant.
Any later semantic change to VE-001 or broadening of ADR-VERIFY-002 requires its
own explicit governed scope.

## 20. Implementation impact

An eventual conforming executor will need to:

- validate the separately presented canonical Action;
- recompute or verify its `action_digest` under governing Action rules;
- compare both Action identity components exactly with the right;
- verify the complete authenticated construction under a supported profile;
- recognize the issuing signer as authorized through verifier-local
  authoritative configuration;
- reject malformed, unsupported, ambiguous, mismatched, or unauthorized input;
  and
- keep authorization verification separate from Adapter mechanics and
  authoritative state commitment.

No Rule engine, policy database, online VE callback, or mutable right store is
required by the accepted core decision.

## 21. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Exact intent, derived authorization, protected execution, and authoritative outcome remain separate. |
| New primitive burden | Pass. Execution Right is an existing architectural role; no adjacent primitives are created. |
| Necessity/removability | Pass. Removing `action_id` or `action_digest` defeats exact semantic binding; removing authenticated, domain-separated verification defeats enforceability. Every additional tested semantic field is removable. |
| Twenty-year durability | Pass. The semantics are independent of algorithms, transports, vendors, clocks, registries, and online services. |
| Independent implementation | Pass in architectural direction only. Normative portability still depends on concrete representation, verification profile, interoperable Action-digest computation, and fail-closed parsing/dispatch rules. |
| Total conceptual complexity | Pass. It uses the existing Action pair and verifier-local configuration rather than duplicating Action, policy, identity, execution, or lifecycle models. |

Field-level removability is:

| Item | Result |
|---|---|
| `action_id` | Keep: necessary occurrence binding. |
| `action_digest` | Keep: necessary exact semantic-content binding. |
| verification machinery | Required artifact property, not a semantic field: necessary authentic enforceability. |
| `execution_profile` | Remove: Action semantics own meaning; Adapter/resource integration owns mechanics. |
| body wrapper | Representation question only. |
| `issuer_ref` | Remove: signer authorization belongs to verification plus verifier-local authoritative configuration. |
| `executor_ref` | Remove: resource-specific and not universal. |
| expiry fields | Remove: no universal need; semantic time constraints belong in Action. |
| `resource_ref` | Remove: duplicates effect-changing Action content. |

## 22. Open questions

The architectural minimum is accepted as closed. The following representation
and profile questions remain for subsequent governed work:

1. flat versus authenticated-body envelope and exact map structure;
2. exact labels within the governed VE-CBOR-1 representation;
3. exact Execution-Right-specific verification profiles and profile identifiers;
4. exact object/domain-separation construction;
5. protected-header layout and bootstrap dispatch encoding;
6. external error surface while preserving internal failure distinctions; and
7. whether shared verification machinery can be factored without broadening
   Claim-specific ADR-VERIFY-002 semantics.

None of these questions justifies adding semantic fields to the minimum right.

## 23. Decision

**ACCEPT: the Execution Right semantic core is the exact
`(action_id, action_digest)` pair. Enforceability requires an authenticated,
domain-separated representation of that pair and current verifier-local
recognition of an authorized attester.**

The accepted semantic minimum is:

```text
ExecutionRightSemantics {
  action_id
  action_digest
}
```

The temporal model is a durable authorization snapshot: later Rule, Claim,
delegation, or policy changes do not retroactively invalidate the issued
decision, while current verifier-local trust still governs artifact acceptance.
Execution-time validity constraints belong in canonical Action semantics.
Right validity remains distinct from state commitment and retry safety.

This Accepted RFC and Accepted ADR-011 authorize proceeding to Draft
specification/profile work. RFC-011 does not itself approve a normative wire
format, complete portable conformance, resolve VE-001 Action canonicalization
or `action_digest` portability, or modify an Approved specification.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-03 | Initial Proposed RFC defining the Execution Right core architecture. |
| 0.1 | 2026-09-04 | Status transitioned from Proposed to Accepted; architecture, exclusions, and unresolved dependencies unchanged. |
