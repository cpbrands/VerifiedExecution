---
id: "VE-014"
title: "Execution Right Specification"
version: "0.1"
status: "Draft"
document_type: "Core Primitive Specification"
category: "Authorization"
author: "Verified Execution Editorial Board"
created: 2026-09-04
updated: 2026-09-04
depends_on:
  - VE-001
  - RFC-011
  - ADR-011
  - ADR-ENC-001
related_documents:
  - RS-ER-001-INDEPENDENT-EXECUTOR
  - GAP-ANALYSIS-RS-ER-001
  - RS-ER-002-TEMPORAL-AUTHORIZATION
  - GAP-ANALYSIS-RS-ER-002
  - ADR-VERIFY-002
supersedes: null
superseded_by: null
---

# VE-014 — Execution Right Specification

**Version:** 0.1
**Status:** Draft
**Category:** Authorization
**Identifier:** VE-014
**Project:** Verified Execution
**Change authority:** RFC-011; ADR-011
**Normative dependencies:** VE-001; ADR-ENC-001 / VE-CBOR-1

------------------------------------------------------------------------

## 1. Purpose and status

This Draft specifies a portable Execution Right artifact through which an
independent executor can establish that one exact Action occurrence with one
exact semantic Action content was authorized, and that the authenticated
attester is presently recognized by that verifier as authorized for the
applicable context.

VE-014 implements the architecture accepted by RFC-011 and ADR-011. It does
not reopen that architecture, create general authority, or require the
executor to re-run Rules, revalidate issuance Claims, reconstruct an issuance
evaluation, or call VE online.

Portable Action canonicalization and `action_digest` interoperability remain
unresolved under VE-001. Consequently, this Draft defines how an Action digest
is carried, authenticated, and compared, but it does not define or invent the
missing portable Action digest algorithm or profile. Complete portable
Execution Right conformance remains blocked on that external normative
dependency and on at least one governed verification profile implementing the
interface in Section 7.

------------------------------------------------------------------------

## 2. Fixed architecture

VE-014 implements these accepted decisions:

1. Execution Right semantic content is exactly `(action_id, action_digest)`.
2. A usable right is an authenticated, object/domain-separated representation
   of that pair.
3. Enforceability requires current verifier-local recognition of the
   authenticated attester as authorized for the applicable context.
4. The right records a durable authorization snapshot. Issuance Rules, Claims,
   delegation, and policy are not re-evaluated at execution.

```text
Action
= requested semantic transition

Execution Right
= authorization for that exact Action

Adapter / protected resource
= execution mechanics and authoritative state commitment
```

------------------------------------------------------------------------

## 3. Semantic content

The complete semantic payload is:

```text
ExecutionRightBody {
  action_id
  action_digest
}
```

`action_id` binds the historical Action occurrence. `action_digest` binds the
exact semantic Action content. Neither field alone is sufficient.

The Action is not embedded in the right. Both fields retain their VE-001
meaning and equality rules. VE-014 does not adopt `OccurrenceId` for
`action_id` and does not define the Action digest algorithm, framing, or
canonicalization profile.

Representation and authentication fields are protocol machinery. They do not
add Execution Right semantic content.

------------------------------------------------------------------------

## 4. VE-CBOR-1 representation

### 4.1 Artifact

A VE-014 v0.1 artifact is exactly this VE-CBOR-1 map:

```text
ExecutionRightArtifact = {
  "body": ExecutionRightBody,
  "verification": ExecutionRightVerification,
  "version": 1
}
```

The body is exactly:

```text
ExecutionRightBody = {
  "action_digest": VE001ActionDigestValue,
  "action_id": VE001ActionIdValue
}
```

`VE001ActionIdValue` and `VE001ActionDigestValue` are imported VE-001 values,
not types defined by VE-014. Their semantic meaning, valid representation,
canonical representation, and equality/comparison rules are governed by
VE-001 and the normative VE-001 representation/profile applicable to the
supplied Action.

Each imported value MUST be embedded directly as the exact canonical
VE-CBOR-1 data item defined for that value by the applicable normative VE-001
representation/profile. VE-014 adds no byte-string wrapper, conversion,
normalization, or alternate encoding. If the applicable VE-001
representation/profile does not define such a canonical data item, a portable
VE-014 artifact cannot be produced or verified under this Draft.

Verification machinery is exactly:

```text
ExecutionRightVerification = {
  "artifact": bstr,
  "profile": tstr
}
```

`profile` is a non-empty, Unicode-NFC namespaced identifier for a governed
Execution Right verification profile. Profile-identifier equality is exact
Unicode scalar/code-point equality after VE-CBOR-1 NFC validation. Case
folding, locale-sensitive comparison, and implementation-defined normalization
MUST NOT be applied. Concrete VE-014 verification-profile identifiers are
assigned by future governed VE-014 profile specifications. Deployment-local
names MAY exist locally but MUST NOT be presented as having interoperable
VE-014 meaning unless defined by such a governed profile specification. An
unknown but unambiguous governed identifier is `UNSUPPORTED`.

`artifact` is the non-empty opaque byte string interpreted only by that
profile.

The complete input MUST contain exactly one VE-CBOR-1 data item. The artifact,
its nested maps, strings, integers, lengths, and byte strings MUST satisfy
ADR-ENC-001 / VE-CBOR-1.

### 4.2 Authentication frame

The exact authenticated input is the VE-CBOR-1 encoding of:

```text
ExecutionRightAuthenticationFrame = [
  "VE-EXECUTION-RIGHT",
  1,
  profile,
  ExecutionRightBody
]
```

The literal first array member is the Unicode/ASCII text string
`VE-EXECUTION-RIGHT`. It is part of the authenticated input. Array order and
all values are significant.

This frame authenticates:

- the VE-014 object/domain label;
- artifact version `1`;
- the verification-profile selector;
- the exact imported canonical VE-001 representation of `action_id`; and
- the exact imported canonical VE-001 representation of `action_digest`.

The verification artifact is not included within the bytes it authenticates.
The selected profile MUST define how its `artifact` authenticates the exact
frame bytes and how a successful verification identifies the authenticated
attester.

------------------------------------------------------------------------

## 5. Object and profile substitution resistance

An implementation MUST authenticate the exact frame in Section 4.2. It MUST
NOT authenticate the body alone or omit the object label, version, or profile
selector.

The authenticated literal `VE-EXECUTION-RIGHT` prevents a Claim, Action,
Receipt, Event, authorization record, or arbitrary authenticated object from
being accepted as an Execution Right through relabeling or same-byte
reinterpretation. The fixed VE-CBOR-1 array shape and literal prevent framing
collision with a differently framed object.

The outer `version` and `verification.profile` values are initial dispatch
inputs. Their identical values in the authenticated frame bind dispatch to
authentication. Implementations MUST construct the frame from the parsed
outer values and body, and MUST NOT permit the selected profile to authenticate
a different version, selector, body, or object domain. This prevents
cross-profile and dispatch substitution without making dispatch metadata part
of the semantic payload.

------------------------------------------------------------------------

## 6. Parsing and extensions

A v0.1 parser MUST:

1. consume exactly one complete data item and reject trailing data;
2. require canonical VE-CBOR-1 and reject rather than normalize or re-encode a
   noncanonical input;
3. require the exact three top-level fields and their exact types;
4. require the exact two body fields and their exact canonical types under the
   applicable normative VE-001 representation/profile;
5. require the exact two verification fields and their exact types;
6. reject duplicate map keys;
7. reject every unknown or additional field at every map level;
8. reject unsupported versions, including every value other than integer `1`;
9. reject an empty or unsupported `verification.profile`;
10. reject an empty verification `artifact` and any `action_id` or
    `action_digest` representation invalid under the applicable normative
    VE-001 representation/profile; and
11. reject any representation for which dispatch or interpretation is
    ambiguous.

VE-014 v0.1 has no ignorable or unauthenticated extension fields. Extension is
possible only through a future governed artifact version or verification
profile whose complete interpretation and authenticated coverage are defined.
An unknown version or profile fails closed; it is not interpreted using v0.1
rules.

------------------------------------------------------------------------

## 7. Verification profiles and local authority

A governed VE-014 verification profile MUST define:

- the exact syntax and permitted contents of `verification.artifact`;
- how the artifact authenticates the exact Section 4.2 frame bytes;
- algorithm interpretation and verifier/credential selection;
- how successful authentication identifies one attester;
- deterministic verification and profile-specific failure behavior; and
- any profile-specific external inputs without changing Execution Right
  semantic content.

A VE-014 verification profile MAY define authentication mechanics. It MUST NOT
redefine `action_id` semantics, `action_digest` semantics, Action
canonicalization, Action digest calculation, temporal semantics, replay
semantics, or the Execution Right semantic-payload shape. It may consume the
canonical representations defined by the applicable normative VE-001
representation/profile; it MUST NOT define or replace those representations.

VE-014 v0.1 does not select a mandatory cryptographic algorithm or allocate a
verification-profile identifier. Unsupported profiles fail closed.

Cryptographic verification success is not authority to issue Execution
Rights. After successful authentication, the verifier MUST use its current
local authoritative configuration to determine whether the authenticated
attester is authorized to issue Execution Rights in the applicable context.
That local configuration may scope authority by protected boundary, Action
schema, or other local context. It is environmental input, not an `issuer_ref`
field, a VE-global registry, or a `TrustContext` object.

```text
cryptographically valid attester
!= authorized Execution Right issuer

authorization-result attester
!= Root Authority
```

------------------------------------------------------------------------

## 8. Executor verification algorithm

Given a supplied canonical Action, a VE-014 artifact, applicable VE
specifications/profiles, and verifier-local trust configuration, an executor
MUST perform these steps in order:

1. Parse the artifact under Sections 4 and 6. On any parse or canonicality
   failure, fail closed.
2. Require artifact version `1`, establish the authenticated VE-014 domain
   frame, and resolve the named governed verification profile. If the parsed
   artifact permits more than one profile interpretation, classify it as
   `MALFORMED` and fail closed. If its selector is unambiguous but the governed
   version or profile is not supported, classify it as `UNSUPPORTED` and fail
   closed.
3. Apply that profile to authenticate the exact Section 4.2 frame and identify
   the authenticated attester. On failure or domain/profile mismatch, fail
   closed.
4. Determine from current verifier-local authoritative configuration whether
   that attester may issue Execution Rights in the applicable context. If not,
   fail closed.
5. Validate the supplied Action under its governing VE-001 semantics and
   protocol/profile. If validation cannot be completed, fail closed.
6. Compare the supplied Action occurrence identity with the body's
   `action_id` using its governing VE-001 equality. The executor MUST recover
   the exact imported VE-001 value from its directly embedded canonical
   representation without implementation-specific conversion, lossy encoding,
   hidden normalization, or profile-specific guessing. On mismatch, fail
   closed.
7. Recompute or otherwise verify the supplied Action's semantic digest under
   the governing VE-001 canonicalization and digest mechanism. Compare it with
   the body's `action_digest` using that mechanism's exact equality. The same
   exact-recovery rule applies to the imported digest value. On an unavailable
   mechanism or mismatch, fail closed.
8. Establish enforceability only when every preceding step succeeds.

The executor MUST NOT re-run issuance Rules, re-fetch or revalidate issuance
Claims, reconstruct historical delegation or policy, or infer issuer authority
from cryptographic validity alone.

Because VE-001 does not yet define portable Action canonicalization and digest
interoperability, step 7 is not presently portable across independent
implementations absent an additional governing Action protocol/profile.

------------------------------------------------------------------------

## 9. Temporal, replay, and outcome semantics

An Execution Right is an immutable, durable snapshot that the exact Action pair
was authorized under the authoritative inputs accepted at issuance. Later
Rule, Claim, delegation, or policy changes do not retroactively invalidate that
authorization decision and are not re-evaluated by the executor.

Current verifier-local recognition of the authenticated attester still applies
at presentation time:

```text
historical authorization
!= present artifact acceptance
```

VE-014 defines no universal expiry, `issued_at`, `valid_until`, audience,
per-right revocation, right identity, right digest, or mutable/consumable
state. Execution-validity constraints that affect the protected transition
belong in canonical Action semantics. A material change to such constraints
may therefore change `action_digest`.

```text
authorization replay
!= duplicate canonical state commitment

right validity
!= retry safety
```

Presenting the same valid right again does not itself authorize multiple
committed state transitions. Atomic commitment, idempotency,
duplicate-transition prevention, and retry safety belong to the authoritative
execution/state domain.

An `UNCERTAIN` execution outcome does not consume, mutate, revoke, or invalidate
the right. Continued validity does not establish that another attempt is safe;
only authoritative execution/outcome state can establish that.

------------------------------------------------------------------------

## 10. Failure taxonomy

An implementation MUST deterministically classify failure at least as one of:

| Category | Condition |
|---|---|
| `MALFORMED` | Invalid type, shape, canonical encoding, duplicate/unknown field, empty required value, trailing data, ambiguous representation, or artifact content permitting more than one profile dispatch. |
| `UNSUPPORTED` | An unambiguous but unsupported version, verification profile, algorithm, required Action protocol/profile, or Action digest mechanism. |
| `AUTHENTICATION_FAILED` | Verification artifact failure, authenticated-frame mismatch, object/domain mismatch, or profile-substitution failure. |
| `ATTESTER_NOT_AUTHORIZED` | Authentication succeeds, but current verifier-local configuration does not authorize that attester for the applicable context. |
| `ACTION_ID_MISMATCH` | The validated supplied Action occurrence does not equal the authenticated `action_id`. |
| `ACTION_DIGEST_MISMATCH` | The supplied Action's verified/recomputed semantic digest does not equal the authenticated `action_digest`. |

Every category is fail-closed and establishes no enforceability. Public APIs
MAY expose less detail to avoid diagnostic leakage, provided internal behavior
and conformance results remain deterministic.

------------------------------------------------------------------------

## 11. Conformance requirements

A conforming VE-014 v0.1 implementation MUST demonstrate that it:

- accepts a valid right only for the correct validated Action and locally
  authorized attester;
- rejects a wrong `action_id`;
- rejects a wrong `action_digest`;
- rejects malformed, noncanonical, duplicate-field, unknown-field, extra-field,
  and trailing-data inputs;
- rejects a wrong object/domain, unsupported version, unsupported profile,
  ambiguous dispatch, and failed authentication;
- rejects a cryptographically valid artifact from an attester not currently
  authorized by verifier-local configuration;
- treats repeated presentation as repeated authorization evidence, not proof
  of a second canonical state commitment; and
- does not claim complete portable conformance without the governing portable
  VE-001 Action canonicalization/digest mechanism and a governed VE-014
  verification profile.

Future conformance vectors SHOULD cover each case above. Their absence from
this initial Draft does not make its incomplete portability claim complete.

------------------------------------------------------------------------

## 12. Field inventory and necessity

| Field | Classification | Necessity | Authenticated? | Derivable? | Removable? | Consequence if absent |
|---|---|---|---|---|---|---|
| `body.action_id` | Semantic imported from VE-001; directly embedded in its governed canonical representation | Exact Action occurrence binding | Yes | No; supplied Action is independently checked against the recovered value | No | Content-identical distinct occurrences become substitutable. |
| `body.action_digest` | Semantic imported from VE-001; directly embedded in its governed canonical representation | Exact semantic Action-content binding | Yes | Independently recomputed/verified from the supplied Action when its governing mechanism exists | No | Content can be substituted under one occurrence identifier. |
| `version` | Machinery | Selects the closed artifact grammar | Yes | No | No | Parsing and extension interpretation become ambiguous. |
| `verification.profile` | Machinery | Selects the complete authentication procedure | Yes | No | No | Algorithm/artifact interpretation and verifier selection become ambiguous or substitutable. |
| `verification.artifact` | Machinery | Carries the authentication proof | Indirectly: it authenticates rather than being included in its own input | No | No | Authenticity and attester identity cannot be established. |
| `VE-EXECUTION-RIGHT` frame literal | Machinery | Object/domain separation | Yes | Fixed by VE-014 | No | Other authenticated object types may be relabeled or reinterpreted. |

No other field survives the necessity test.

------------------------------------------------------------------------

## 13. Explicit exclusions and primitive audit

VE-014 v0.1 introduces no semantic `issuer_ref`, `resource_ref`, `executor_ref`,
`audience`, `execution_profile`, policy version, Rule or Claim identifier,
evaluation transcript, issuance time, expiry, right identifier, right digest,
revocation state, retry state, or consumable state.

It does not introduce or require a new primitive named or equivalent to
`ExecutionProfile`, `Executor`, `Capability`, `Grant`, `Token`,
`AuthorizationSnapshot`, `Revocation`, `StatusAuthority`, `TrustContext`,
`SignedArtifact`, `AuthenticatedArtifact`, or `VerificationEnvelope`.
Authentication framing and verification fields are local VE-014 protocol
machinery, not reusable architectural objects.

------------------------------------------------------------------------

## 14. Open interoperability dependencies

The following remain unresolved:

1. the portable VE-001 Action canonical representation and `action_digest`
   algorithm/profile;
2. allocation and complete definition of at least one governed VE-014
   verification profile; and
3. conformance vectors exercising the candidate representation and a selected
   verification profile.

These are protocol/profile completion tasks subordinate to RFC-011 and
ADR-011. This Draft discovers no need to reopen the accepted four-part
architecture or add another semantic field.

------------------------------------------------------------------------

## 15. Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-04 | Initial Draft implementing Accepted RFC-011 and ADR-011; portable Action digest and verification-profile completion dependencies remain explicit. |
