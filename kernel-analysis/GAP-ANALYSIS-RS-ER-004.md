---
id: GAP-ANALYSIS-RS-ER-004
title: Gap Analysis for RS-ER-004 VE-014 Verification End to End
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-07
updated: 2026-09-07
depends_on: []
related_documents:
  - RS-ER-004-VE014-VERIFICATION-END-TO-END
  - VE-014
  - VE-014-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
  - VE-001
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - RFC-011
  - ADR-011
  - RS-ACT-001-VE001-PORTABILITY-INTEROPERABILITY
  - GAP-ANALYSIS-RS-ACT-001
  - RS-ER-003-VE014-INDEPENDENT-EXECUTOR
  - GAP-ANALYSIS-RS-ER-003
supersedes: null
superseded_by: null
---

# Gap Analysis for RS-ER-004 VE-014 Verification End to End

## 1. Authority and scope

This document is **non-normative analysis**. It evaluates the evidence in
RS-ER-004 against the current specifications and accepted architectural
decisions. It does not modify VE-001, VE-014, either subordinate profile,
RFC-011, ADR-011, lifecycle or execution semantics, or any other normative
artifact. It allocates no identifier and establishes no conformance authority.

The gap test is narrow: can two implementations follow all currently
applicable normative rules, receive the same governing inputs, and still reach
consequentially incompatible results? A named subsystem, environmental input,
or assigned ownership boundary is not by itself a dependency or gap.

## 2. Authoritative basis

The analysis reads RS-ER-004 together with:

- VE-001 and its Draft Action Canonical Representation and Content Identity
  Profile;
- VE-014 and its Draft Ed25519 COSE Sign1 Verification Profile;
- Accepted RFC-011 and ADR-011;
- RS-ACT-001 and its gap analysis;
- RS-ER-003 and its gap analysis;
- VE-002 Event, VE-003 Lifecycle, VE-004 Receipt, VE-005 Adapter, and VE-006
  Execution Boundary responsibilities; and
- the Founding Principles, architecture map, and specification-governance
  rules.

RS-ER-004 remains evidence only. Normative conclusions below derive from those
governing artifacts, not from the scenario itself.

The authoritative repository state for this final analysis is
`bb7ba58edd5bd9930045c83d61ee7e12bacd3609`, the merge commit for PR #57.
That merge incorporates correction commit
`dd209c881bb2b984c63a6954058e8472cf86278a` into authoritative `main`.

## 3. What RS-ER-004 demonstrated

RS-ER-004 independently composed this chain:

```text
VE-001 Action occurrence and content identity
+ VE-014 ExecutionRightBody
+ exact VE-014 authenticated frame
+ governed Ed25519 COSE_Sign1 verification profile
+ recovered authenticated_attester
+ current verifier-local attester authorization
+ Action-pair comparison
+ protected execution admission
```

The scenario demonstrated that:

- canonical `action_id` and `action_digest` values from the VE-001 profile can
  be embedded directly in the VE-014 body without conversion;
- the profile authenticates the exact domain, version, profile selector, and
  Action pair;
- successful verification recovers the exact raw public-key bytes as
  `authenticated_attester`;
- cryptographic authentication is distinct from verifier-local authorization;
- an attacker-generated valid signature authenticates its attacker key but
  fails local authorization;
- removal of local authorization leaves the artifact cryptographically
  authentic while making it unenforceable;
- wrong occurrence and wrong semantic content remain distinguishable as
  `ACTION_ID_MISMATCH` and `ACTION_DIGEST_MISMATCH`;
- malformed representation, unsupported dispatch, authentication failure,
  authorization failure, and Action mismatch remain separate stages;
- the authorization decision remains a durable snapshot while present
  attester recognition remains current; and
- repeated presentation does not decide protected-state commitment, retry
  safety, or lifecycle admission.

This is evidence that the current Drafts compose. It is not an approval or a
new normative rule.

## 4. Historical normative gap and current profile completeness

RS-ER-004 successfully exposed one real normative interoperability gap. Before
PR #57, the verification profile simultaneously classified an unambiguous,
well-formed unsupported protected algorithm, including `alg = -7`, as
`UNSUPPORTED` and included the unqualified phrase `algorithm substitution`
under `AUTHENTICATION_FAILED`. Two conforming implementations could therefore
reject the same artifact with different normative outcomes. That difference
was consequential because consumers may react differently to unsupported
capability and failed authentication.

The gap-analysis audit rejected the attempted interpretation that the specific
dispatch rule merely controlled or overrode the broader phrase. The normative
profile itself had to be unambiguous. Correction commit `dd209c8` removed the
overlapping phrase without changing wire bytes, cryptographic acceptance,
Action binding, authorization semantics, or architecture. PR #57 merged that
correction. The historical classification is:

```text
REAL NORMATIVE GAP — RESOLVED
```

Against current authoritative `main`, the tested profile closes every
verification input exercised by RS-ER-004:

| Concern | Current normative owner and result |
|---|---|
| Profile selection | VE-014 selects by exact governed identifier; unknown unambiguous profiles are `UNSUPPORTED`, ambiguity is `MALFORMED`. |
| Authenticated frame | VE-014 fixes the domain label, version, profile selector, and exact imported body. |
| Detached payload | The profile fixes the detached, untagged COSE_Sign1 construction and exact `Sig_structure`. |
| Protected headers | The profile requires exactly `h'a10127'`; the unprotected map is empty and payload is `null`. |
| Algorithm | The profile narrows COSE `alg = -8` to pure Ed25519 with no negotiation or fallback. |
| Key and signature representation | Raw 32-octet public key and raw 64-octet signature are fixed. |
| Ed25519 acceptance | Canonical decoding, subgroup/torsion checks, `S < L`, and the exact uncofactored equation determine one acceptance set. |
| Attester recovery | Successful verification returns the exact 32 public-key octets. |
| Failure classification | VE-014 and the profile distinguish malformed, unsupported, authentication, authorization, and Action-pair failures. |
| Authorization handoff | VE-014 passes the recovered attester to current verifier-local authorization after authentication. |

No tested verification input lacks a normative owner. The strict Ed25519
predicate specifically removes divergence caused by differing library-default
acceptance of noncanonical, low-order, torsion-bearing, or cofactored cases.

Classification:

```text
NO REMAINING GAP — current VE-014 verification-profile rules are sufficient
```

No profile registry, algorithm registry, resolver, negotiation layer,
namespace authority, or generic verification abstraction is required.

## 5. Authentication and authorization

The attacker-key path proves the intended boundary:

```text
valid attacker signature
-> authentication succeeds
-> authenticated_attester = attacker public key
-> current verifier-local authorization fails
-> ATTESTER_NOT_AUTHORIZED
```

The authorization-removal path proves the temporal form of the same boundary:

```text
unchanged valid artifact
-> authentication succeeds
-> authenticated_attester is unchanged
-> current verifier-local recognition fails
-> ATTESTER_NOT_AUTHORIZED
```

Given the same authenticated key, supplied Action and schema, deployment
configuration, and Adapter/protected-resource boundary, conforming executors
have the same inputs to the local decision. Different deployment
configurations may intentionally produce different authorization results;
that is not protocol-level implementation divergence.

Classification:

```text
A. NO GAP — authentication and verifier-local authorization have distinct,
already-defined owners and an explicit handoff
```

No Attester, Identity, `TrustContext`, key registry, authorization token,
capability, delegation object, or universal authority registry is needed.

## 6. Action binding

VE-001 owns occurrence identity, semantic content identity, and their equality
meaning. Its subordinate profile supplies the concrete canonical
representations and digest mechanics. VE-014 authenticates both imported
values directly:

```text
(action_id, action_digest)
```

The wrong-occurrence and changed-content variants show that neither member can
replace the other. Together they are sufficient for the tested authorization
binding. Multiple operational attempts may pursue one Action occurrence
without creating a new Action identity or changing its content identity.

Classification:

```text
A. NO GAP — the existing Action pair is sufficient
```

No `ActionReference`, generic `ContentIdentity`, Claim-like wrapper,
`attempt_id`, `execution_id`, or execution-attempt primitive is justified.

## 7. Temporal semantics

Accepted ADR-011 and VE-014 define an Execution Right as an immutable durable
authorization snapshot. Execution does not re-evaluate issuance-time Rules,
Claims, delegation, or policy. Current verifier-local recognition of the
authenticated attester remains a separate presentation-time input.

RS-ER-004 exercises both halves without contradiction: the artifact and
attester output remain unchanged, while removal of current local recognition
causes `ATTESTER_NOT_AUTHORIZED`. Execution-validity constraints that alter
the protected transition remain canonical Action semantics rather than
Execution Right lifecycle fields.

Classification:

```text
A. NO GAP — durable snapshot and current attester recognition compose without
live policy re-evaluation
```

No `issued_at`, `expires_at`, `valid_until`, revocation field, mutable validity
state, or authorization-snapshot object is required.

## 8. Replay, lifecycle, commitment, and uncertainty

The governing starting point is:

```text
REPLAY / LIFECYCLE = EXISTING DOWNSTREAM OWNERSHIP BOUNDARY
```

Presenting the same valid artifact more than once can produce the same
successful profile authentication and the same `authenticated_attester`.
Neither fact authorizes a duplicate protected-state transition:

```text
authorization replay
!= duplicate canonical state commitment

right validity
!= retry safety
```

VE-001 permits multiple attempts for one Action occurrence and does not make
its digest a replay or idempotency token. VE-014 and ADR-011 assign atomic
commitment, idempotency, duplicate-transition prevention, and retry safety to
the authoritative execution/state domain. VE-002 supplies authoritative Event
history; VE-003 derives lifecycle state from that history while keeping
operational retry behavior separate; VE-004 represents commit, non-commit, and
`UNCERTAIN` without manufacturing execution truth; VE-005 and VE-006 retain
execution mechanics and mediation responsibilities.

An `UNCERTAIN` result does not mutate, consume, revoke, or invalidate the
right. Continued right validity does not establish that another attempt is
safe. Only authoritative execution/outcome state can do so.

RS-ER-004 requires no universal decision that every second presentation must
be admitted or rejected. Its local rejection after a recorded canonical
commit is one conforming downstream outcome. A differently governed execution
domain may make a different admission decision from different authoritative
state without changing profile authentication or VE-014 semantics.

Classification:

```text
EXISTING DOWNSTREAM OWNERSHIP BOUNDARY — relevant and already assigned;
not a newly discovered dependency, verification-profile gap, VE-014 gap, or
architectural gap
```

The scenario exposes no unresolved replay/lifecycle rule necessary to make the
tested authentication and authorization composition implementable. It does
not justify a `ReplayToken`, nonce primitive, mutable or consumable right,
`ExecutionAttempt`, or `attempt_id`.

## 9. Failure taxonomy and ordering

The composed failure stages remain deterministic:

```text
structure and canonicality validation
-> profile and algorithm support dispatch
-> cryptographic authentication
-> authenticated-attester extraction
-> verifier-local authorization
-> action_id comparison
-> action_digest comparison
-> downstream admission and execution
```

The existing categories cover every tested failure:

| Outcome | Tested condition |
|---|---|
| `MALFORMED` | Noncanonical, ambiguous, structurally invalid, extra, or trailing artifact data. |
| `UNSUPPORTED` | Unambiguous unsupported profile or supported-profile algorithm mismatch. |
| `AUTHENTICATION_FAILED` | Invalid proof, wrong key/frame/signature, or unacceptable exact-width Ed25519 input. |
| `ATTESTER_NOT_AUTHORIZED` | Authentication succeeds but current local authorization rejects the attester. |
| `ACTION_ID_MISMATCH` | The authenticated occurrence differs from the supplied Action. |
| `ACTION_DIGEST_MISMATCH` | The authenticated semantic identity differs from the supplied Action. |

No tested input is left without a category, and no additional portable failure
outcome is required for downstream admission or execution results. Current
authoritative semantics state directly:

- malformed, ambiguous, noncanonical, or structurally invalid protected data
  is `MALFORMED`;
- a well-formed unsupported algorithm, including `alg = -7`, is `UNSUPPORTED`;
- the selected supported `alg = -8` construction followed by authentication
  failure is `AUTHENTICATION_FAILED`;
- valid authentication followed by local attester rejection is
  `ATTESTER_NOT_AUTHORIZED`;
- a wrong Action occurrence is `ACTION_ID_MISMATCH`; and
- wrong semantic content is `ACTION_DIGEST_MISMATCH`.

The former unqualified `algorithm substitution` entry under
`AUTHENTICATION_FAILED` is absent. The current profile no longer allows two
conforming implementations to assign different outcomes to canonical
`alg = -7`.

Classification:

```text
HISTORICAL: REAL NORMATIVE GAP — RESOLVED
CURRENT: NO REMAINING GAP — failure ownership, ordering, and classification
are complete for the tested composition
```

## 10. Profile applicability

The exact VE-014 profile selector identifies the governed profile, while the
verifier's applicable context supplies deployment-specific support and
attester authorization. The selector is authenticated in the VE-014 frame;
the profile fixes one algorithm and admits no fallback or negotiation.

Two implementations with the same profile support and governing context do
not need a global registry, resolver, or namespace authority to interpret the
identifier. A verifier that does not support the unambiguous governed
identifier returns `UNSUPPORTED`.

Classification:

```text
A. NO GAP — exact governed selection plus verifier context is sufficient
```

## 11. Conforming-implementation divergence audit

The following candidate divergences were tested against their current owners:

| Candidate | Could two conforming implementations legitimately diverge? | Reason |
|---|---|---|
| Canonical Action bytes or Action digest | No, for the selected Draft profile and a closed governing Action schema. | The VE-001 profile fixes representation, framing, digest suite, and equality mechanics. |
| VE-014 body or authenticated frame | No. | Direct embedding and exact domain/version/profile/body framing are fixed. |
| COSE input or header interpretation | No. | Detached untagged Sign1, protected bytes, empty unprotected map, null payload, and exact `Sig_structure` are fixed. |
| Ed25519 edge-case acceptance | No. | The profile replaces library defaults with one strict acceptance predicate and equal individual/batch acceptance sets. |
| Authenticated-attester output | No. | It is the exact raw 32-octet public key. |
| Malformed, unsupported, and authentication failure | No for the tested cases. | Structure, dispatch, and cryptographic failure ownership are explicit. |
| Current attester authorization | Not with identical environmental inputs; deployments may intentionally differ. | Verifier-local authoritative configuration is an explicit input, not portable right content. |
| Replay or second-transition admission | Not with identical governing downstream history and policy; different domains may intentionally differ. | Commitment, idempotency, and retry safety are downstream state-domain responsibilities. |

After PR #57, independent classification paths converge as follows:

| Input | Current deterministic result |
|---|---|
| Malformed protected structure | `MALFORMED` |
| Well-formed `alg = -7` | `UNSUPPORTED` |
| Well-formed arbitrary unsupported algorithm | `UNSUPPORTED` |
| `alg = -8` with an invalid signature | `AUTHENTICATION_FAILED` |
| Valid authentication with an unauthorized attester | `ATTESTER_NOT_AUTHORIZED` |
| Valid authorized artifact with wrong `action_id` | `ACTION_ID_MISMATCH` |
| Valid authorized artifact with wrong `action_digest` | `ACTION_DIGEST_MISMATCH` |

No remaining consequential case was found in which two implementations can
follow all applicable current normative rules, receive identical governing
inputs, and still legitimately disagree. For every candidate, no unresolved
normative ambiguity, divergent conforming behavior, or further required fix
could be constructed. Governing Action-schema closure remains a precondition
already identified by RS-ACT-001; it is not a new defect exposed here.

The subordinate profiles remain Draft. That lifecycle status limits stable or
Approved conformance claims; it does not lower the independent-implementability
requirement. Independent implementability is **PASS for the tested scope under
the current Draft normative text**.

## 12. Primitive-creep audit

No evidence requires a new `Identity`, Attester, `TrustContext`, `KeyRegistry`,
`ProfileRegistry`, `AlgorithmRegistry`, namespace authority, `VerificationEnvelope`,
`SignedArtifact`, `Capability`, `AuthorizationToken`, `ReplayToken`,
`ExecutionAttempt`, universal `ContentIdentity`, or mutable Execution Right
state.

Each proposed abstraction either duplicates an existing owner, converts an
environmental input into protocol content, or adds state without resolving a
demonstrated interoperability failure.

Classification:

```text
A. NO GAP — no new primitive or registry is justified
```

## 13. Architectural Decision Test

Applied to the result—retain the current composition and add nothing—the six
tests produce:

1. **Founding Principles consistency — PASS.** Intent, authentication,
   authorization, execution, and authoritative outcome remain distinct and
   inspectable.
2. **New primitive burden — PASS.** No additional primitive, registry,
   resolver, token, envelope, or mutable right state is introduced.
3. **Removability — PASS.** The subordinate verification profile remains
   replaceable without changing VE-001 or VE-014 semantics; no unnecessary
   addition needs removal.
4. **Twenty-year durability — PASS.** Stable semantic ownership is separated
   from replaceable versioned representation and cryptographic profiles.
5. **Independent implementability — PASS for the tested scope under the current
   Draft normative text.** PR #57 removed the conflicting failure
   classification, so exact frames, representations, verification rules,
   outputs, categories, and vectors now determine one tested result for each
   input.
6. **Reduced conceptual complexity — PASS.** Removing the ambiguous
   classification improved determinism without adding generic identity, trust,
   verification, replay, or failure-taxonomy architecture.

## 14. Findings and classifications

| Finding | Classification |
|---|---|
| The original profile allowed `alg = -7` to be classified as either `UNSUPPORTED` or `AUTHENTICATION_FAILED`. | **REAL NORMATIVE GAP — RESOLVED** |
| The corrected current verification profile deterministically classifies every tested input. | **NO REMAINING GAP** |
| VE-001 Action identity composes directly with VE-014. | **A. NO GAP** |
| The Ed25519 COSE_Sign1 profile completely defines the tested authentication path. | **A. NO GAP** |
| Authentication and current verifier-local authorization remain distinct and interoperable. | **A. NO GAP** |
| The Action pair detects occurrence and semantic-content substitution. | **A. NO GAP** |
| Durable authorization snapshot semantics remain consistent with current attester recognition. | **A. NO GAP** |
| Replay, lifecycle, atomic commitment, idempotency, duplicate prevention, and retry safety remain downstream. | **EXISTING DOWNSTREAM OWNERSHIP BOUNDARY** |
| Existing failure categories cover all tested failures. | **A. NO GAP** |
| Profile applicability needs no registry, resolver, or negotiation layer. | **A. NO GAP** |
| No hidden conforming-implementation divergence was constructed. | **A. NO GAP** |
| Current architecture requires no further change. | **NO NEW ARCHITECTURAL GAP** |
| No new primitive is justified. | **NO NEW PRIMITIVE REQUIRED** |

RS-ER-004 established one real normative verification-profile gap. That gap is
now resolved on authoritative `main`; the current composition has no remaining
normative gap, architectural gap, or implementation blocker for the tested
scope.

## 15. Governance decision

```text
Historical VE-014 verification-profile correction: YES — completed and merged
Additional VE-014 verification-profile revision required: NO
VE-014 revision required: NO
VE-001 revision required: NO
other existing specification revision required: NO
RFC required: NO
ADR required: NO
new specification required: NO
new primitive required: NO
CHANGELOG required: NO
ARCHITECTURE_INDEX update required: NO
```

No governance artifact should be manufactured merely to continue cadence.
The Draft lifecycle of VE-001, VE-014, and their subordinate profiles proceeds
under existing governance. PR #57 completed the only correction established by
RS-ER-004; current analysis supplies no semantic reason for additional work.

## 16. Final result

RS-ER-004 successfully exposed one verification-profile interoperability
defect. PR #57 normatively corrected it on authoritative `main`. After that
correction, RS-ER-004 exposes no remaining normative or architectural gap.

```text
HISTORICAL FINDING: REAL NORMATIVE GAP — RESOLVED
CURRENT VERIFICATION-PROFILE STATE: NO REMAINING GAP
REPLAY / LIFECYCLE: EXISTING DOWNSTREAM OWNERSHIP BOUNDARY
ARCHITECTURE: NO NEW ARCHITECTURAL GAP
PRIMITIVE PRESSURE: NO NEW PRIMITIVE REQUIRED
```

No RFC, ADR, VE-014 revision, VE-001 revision, new specification, or new
primitive is required. The VE-014 verification-profile cadence can close after
this Gap Analysis passes audit and lands on authoritative `main`.
