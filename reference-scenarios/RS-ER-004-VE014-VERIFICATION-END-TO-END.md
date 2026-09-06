---
id: RS-ER-004-VE014-VERIFICATION-END-TO-END
title: Independent Executor Verifies and Enforces a Portable Execution Right
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-06
updated: 2026-09-06
depends_on:
  - VE-014
  - VE-014-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
related_documents:
  - RS-ACT-001-VE001-PORTABILITY-INTEROPERABILITY
  - RS-ER-003-VE014-INDEPENDENT-EXECUTOR
  - RFC-011
  - ADR-011
supersedes: null
superseded_by: null
---

# RS-ER-004 — Independent Executor Verifies and Enforces a Portable Execution Right

## 1. Authority and objective

This document is **non-normative evidence**. It pressure-tests the Draft
VE-014 Ed25519 COSE Sign1 Verification Profile v0.1 end to end. It does not
modify or supplement VE-014, VE-001, either subordinate profile, RFC-011,
ADR-011, or any other normative artifact.

All keys, values, configuration, and processing steps below are scenario
scaffolding. This scenario allocates no VE identifier, verification-profile
identifier, schema identifier, attester identity, or registry entry.

The tested composition is:

```text
governed Action semantics
→ VE-001 canonical Action representation
→ action_id + action_digest
→ VE-014 ExecutionRightBody
→ exact VE-014 authenticated frame
→ Ed25519 / COSE_Sign1 profile artifact
→ cryptographic authentication
→ authenticated_attester
→ verifier-local attester authorization
→ action_id and action_digest comparison
→ independent executor decision
```

The question is whether portable Action identity and portable Execution Right
authentication compose without treating authentication as authority.

## 2. Actors and responsibility boundaries

The scenario has three distinct actors:

1. **Authorization Service / Boundary** — authorizes the exact Action and signs
   its Execution Right with scenario key `K_authorized`.
2. **Independent Executor** — receives the Action and right, verifies the
   artifact, applies its current local attester-authorization configuration,
   compares the Action pair, and determines whether local admission checks
   permit a call to the Adapter.
3. **Protected Resource Adapter** — performs the constrained operation and
   reports the authoritative protected-system result.

The Authorization Service does not execute the Action. Signature validity does
not cause the executor to trust the signer:

```text
authentication
!= attester authorization
!= execution
!= authoritative outcome
```

The profile owns cryptographic authentication and attester extraction only.
VE-014 and verifier-local configuration own attester authorization and Action
comparison. Local lifecycle/resource policy owns admission, and the protected
resource owns the committed outcome.

## 3. Reused Action fixture and exact Action pair

The Action uses the complete scenario-local schema and normalized values from
RS-ACT-001, which remains non-normative fixture evidence:

```text
amount_minor   = 50000
currency       = "CAD"
recipient      = "Café-Y"
source_account = "account-X"
```

RS-ACT-001 defines all four fields as required, no defaults, rejection of
unknown fields, and explicit NFC normalization for `recipient` and
`source_account`. This scenario reuses its bytes and digests without changing
or silently recomputing their semantics.

Canonical schema descriptor bytes:

```text
a5646e616d657576652e746573742e62616e6b2d7472616e73666572666669656c6473a46863757272656e6379a36474797065647473747267616c6c6f7765648163434144687265717569726564f569726563697069656e74a364747970656474737472687265717569726564f56d6e6f726d616c697a6174696f6e634e46436c616d6f756e745f6d696e6f72a264747970656475696e74687265717569726564f56e736f757263655f6163636f756e74a364747970656474737472687265717569726564f56d6e6f726d616c697a6174696f6e634e46436776657273696f6e016864656661756c7473646e6f6e656e756e6b6e6f776e5f6669656c64736672656a656374
```

`schema_digest` payload:

```text
d83e3b0d3af3011167f53b019f3303cdf5ac18d39df82ed071e5cb6f8a84e8d8
```

The exact Action pair is:

```text
action_id     = h'202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f'
action_digest = h'4281d2fa76069a5e1b7e7909b671b8ee9f772689f9f3ef0467153a98d804f77b'
```

The `action_id` is the same already-established scenario occurrence used by
RS-ACT-001. The `action_digest` is the SHA-256 content identity derived there
under the VE-001 portability profile. Content identity remains distinct from
occurrence identity; neither member alone is sufficient.

## 4. Execution Right body and authenticated frame

The exact `ExecutionRightBody` is:

```text
{
  "action_digest": h'4281d2fa76069a5e1b7e7909b671b8ee9f772689f9f3ef0467153a98d804f77b',
  "action_id": h'202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f'
}
```

It has no extra field. Its canonical bytes are:

```text
a269616374696f6e5f69645820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f6d616374696f6e5f64696765737458204281d2fa76069a5e1b7e7909b671b8ee9f772689f9f3ef0467153a98d804f77b
```

The selected profile is exactly:

```text
urn:ve:verify:execution-right:cose-sign1-ed25519:1
```

The authenticated frame is exactly:

```text
[
  "VE-EXECUTION-RIGHT",
  1,
  "urn:ve:verify:execution-right:cose-sign1-ed25519:1",
  ExecutionRightBody
]
```

Canonical authenticated-frame bytes:

```text
847256452d455845435554494f4e2d524947485401783275726e3a76653a7665726966793a657865637574696f6e2d72696768743a636f73652d7369676e312d656432353531393a31a269616374696f6e5f69645820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f6d616374696f6e5f64696765737458204281d2fa76069a5e1b7e7909b671b8ee9f772689f9f3ef0467153a98d804f77b
```

## 5. Scenario-local keys and verifier configuration

The deterministic seeds below are public test material and are unsafe for
production. They create no portable attester identity or authority.

| Name | Test seed | Raw Ed25519 public key |
|---|---|---|
| `K_authorized` | `cd34f8e678be3aee726314c344d069604e7b1f8175aa0779782a12d7517dd555` | `d422fc3c76f49029b6a6570b31807e949c5a7bbdab6414a27ea4ed5ae59167ac` |
| `K_unauthorized` | `b5b0777ef1ad6cae3bcb2c90d08708e3defc0227ff34aaae617a2e89a6039acc` | `78f17c87cc36e42808fe4771cf9dd365166b7c5eecea5a23f38a4b6c19e32b36` |
| `K_attacker` | `1bc9569723e21a1eb858228cfb0ee61e6a9fb0505682107fecf47dda0b2b84ca` | `28b6e261494292197660d400c1d26d69e25fbd043e2c5959f94aaea733e66875` |

At `T1`, the executor's scenario-local configuration recognizes only the exact
raw public key `K_authorized` for the applicable context. That context is
determined from the authenticated attester, supplied Action and schema,
deployment configuration, and Adapter/protected-resource boundary.

`K_unauthorized` and `K_attacker` are not authorized. The configuration is not
a global key registry, VE registry, DID system, certificate PKI, portable
attester identity, or universal namespace.

## 6. Exact Ed25519 / COSE_Sign1 vector

The artifact is an untagged, detached-payload `COSE_Sign1` using pure Ed25519:

```text
protected   = h'a10127'
unprotected = {}
payload     = null
```

The exact `Sig_structure` is:

```text
[
  "Signature1",
  h'a10127',
  h'',
  VE-CBOR-1(ExecutionRightAuthenticationFrame)
]
```

Canonical `Sig_structure` bytes:

```text
846a5369676e61747572653143a101274058a6847256452d455845435554494f4e2d524947485401783275726e3a76653a7665726966793a657865637574696f6e2d72696768743a636f73652d7369676e312d656432353531393a31a269616374696f6e5f69645820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f6d616374696f6e5f64696765737458204281d2fa76069a5e1b7e7909b671b8ee9f772689f9f3ef0467153a98d804f77b
```

Signature by `K_authorized`:

```text
9601a7877a08350ea2dd05c9d3b287173e6470f6c215b000e40af3af334d64b4b0188c77ca3de455cf8d68504ed7a63ecb758b9ed795a8f3388ba7c9b98dcf02
```

Canonical untagged `COSE_Sign1` bytes:

```text
8443a10127a0f658409601a7877a08350ea2dd05c9d3b287173e6470f6c215b000e40af3af334d64b4b0188c77ca3de455cf8d68504ed7a63ecb758b9ed795a8f3388ba7c9b98dcf02
```

Exact outer `verification.artifact` payload bytes:

```text
825820d422fc3c76f49029b6a6570b31807e949c5a7bbdab6414a27ea4ed5ae59167ac8443a10127a0f658409601a7877a08350ea2dd05c9d3b287173e6470f6c215b000e40af3af334d64b4b0188c77ca3de455cf8d68504ed7a63ecb758b9ed795a8f3388ba7c9b98dcf02
```

Expected profile result:

```text
authentication = SUCCESS
authenticated_attester = h'd422fc3c76f49029b6a6570b31807e949c5a7bbdab6414a27ea4ed5ae59167ac'
```

The artifact-carried public key supplies verification material, not trust.

## 7. Happy path

The independent executor performs scenario processing consistent with the
normative ownership boundaries:

1. recognize the exact VE-014 profile selector;
2. validate the profile artifact's closed canonical grammar;
3. reconstruct the exact authenticated frame and `Sig_structure`;
4. apply the profile's strict pure-Ed25519 acceptance predicate;
5. obtain `K_authorized` as `authenticated_attester`;
6. confirm from current verifier-local configuration that this exact key is
   authorized for the applicable context;
7. compare `action_id` with the requested Action occurrence;
8. compare `action_digest` with the requested Action semantic content;
9. apply local replay, lifecycle, resource, and context admission checks;
10. pass the constrained operation to the Adapter; and
11. record the protected resource's successful state transition.

Expected result:

```text
profile authentication = SUCCESS
attester authorization = SUCCESS
Action pair comparison = MATCH
local execution admission = PERMITTED
protected outcome = SUCCESS
```

The profile owns steps 1–5 only. It does not own authorization, Action
comparison, local admission, execution, or authoritative outcome.

## 8. Arbitrary attacker-key test

`K_attacker` signs the same exact `Sig_structure`. Its signature is:

```text
1839ff5a5e2e4962bb8e413b3a297b1fa5495f86a56756c2914bd4fc209df2aeeea5a6363b6dc0d476881bb32e4654737522b2562d096900312bbf5917f61d0e
```

Exact attacker artifact bytes:

```text
82582028b6e261494292197660d400c1d26d69e25fbd043e2c5959f94aaea733e668758443a10127a0f658401839ff5a5e2e4962bb8e413b3a297b1fa5495f86a56756c2914bd4fc209df2aeeea5a6363b6dc0d476881bb32e4654737522b2562d096900312bbf5917f61d0e
```

Expected and observed:

```text
cryptographic authentication = SUCCESS
authenticated_attester = K_attacker
verifier-local authorization = FAIL
final result = ATTESTER_NOT_AUTHORIZED
```

This is the critical composition property:

```text
valid signature != authority
```

## 9. Action-binding mutations

These variants are signed correctly by `K_authorized`, so authentication and
attester authorization succeed before Action comparison:

| Variant | Minimal mutation | Expected result |
|---|---|---|
| Wrong occurrence | Sign a body retaining the expected `action_digest` but replace the final `action_id` octet `3f` with `40`; present it with the original requested Action. | `ACTION_ID_MISMATCH` |
| Mutated semantic content | Sign a body retaining the expected `action_id` but replace the final `action_digest` octet `7b` with `7c`; present it with the original requested Action. | `ACTION_DIGEST_MISMATCH` |

`action_id` alone is never treated as sufficient semantic-content binding.

## 10. Authentication and dispatch mutations

Each case starts from the happy-path artifact and changes only the stated
input unless otherwise specified:

| Variant | Mutation | Expected result and stage |
|---|---|---|
| Signature mutation | Change final signature octet `02` to `03`. | `AUTHENTICATION_FAILED`; attester authorization is not consulted as successful. |
| Wrong public key | Replace `K_authorized` with `K_unauthorized` while retaining the original signature. | `AUTHENTICATION_FAILED`; no authenticated attester is returned. |
| Unsupported profile | Change the VE-014 profile selector to `urn:ve:verify:execution-right:unsupported:1`. | `UNSUPPORTED`; no cryptographic fallback. |
| Algorithm substitution | In an otherwise well-formed profile artifact, replace protected `h'a10127'` (`alg = -8`) with canonical `h'a10126'` (`alg = -7`). | `UNSUPPORTED`; the alternative is unambiguous and the remaining COSE structure is well formed. |

The algorithm-substitution result follows the merged profile taxonomy. An
ambiguous or malformed protected structure would instead be `MALFORMED`.

## 11. Noncanonical and closed-grammar mutations

| Variant | Minimal mutation | Expected result |
|---|---|---|
| Tagged Sign1 | Add COSE tag 18 before the inner `COSE_Sign1`. | `MALFORMED` |
| Indefinite artifact | Encode the outer two-member artifact as an indefinite-length array. | `MALFORMED` |
| Noncanonical protected header | Encode `{1: -8}` noncanonically instead of exact `h'a10127'`. | `MALFORMED` |
| Extra unprotected metadata | Add any unprotected member, including `kid`. | `MALFORMED` |
| Embedded payload | Replace detached `null` with the frame bytes. | `MALFORMED` |
| Trailing bytes | Append one octet after the canonical outer artifact item. | `MALFORMED` |

No alternate representation proceeds to successful authentication.

## 12. Strict Ed25519 edge-case test

Replace the correct 32-octet public key with 32 zero octets while retaining
the exact-width signature and message. The structural widths remain correct,
but the point is low-order and fails the profile's strict Ed25519 predicate:

```text
result = AUTHENTICATION_FAILED
```

This check is performed under the profile predicate, not unspecified library
defaults. The profile's N10–N16 and CCTV probes provide the complete edge-case
closure; this scenario needs only this representative composition test.

## 13. Replay and lifecycle boundary

Presenting the unchanged happy-path right twice produces successful profile
authentication and the same `authenticated_attester` both times. That fact
does not decide whether a second execution is admissible:

```text
cryptographically valid
!= currently admissible for execution

authorization replay
!= duplicate protected-state commitment
```

In this scenario the executor's local lifecycle/resource checks reject a
second transition after the protected resource records the first canonical
commit. A deployment with different governed lifecycle semantics could reach
a different admission decision without changing profile authentication. The
profile defines no replay policy, consumption state, idempotency rule, or
execution-attempt primitive.

## 14. Temporal and authorization-removal tests

The right records the durable authorization snapshot established at issuance.
At execution, the executor does not re-evaluate issuance Rules, Claims,
delegation, or historical policy state. It does apply current verifier-local
recognition of the authenticated attester.

At `T1`, `K_authorized` is recognized and the happy path succeeds. At `T2`,
the executor removes `K_authorized` from its local authorization configuration
and re-presents the exact unchanged artifact:

```text
cryptographic authentication = SUCCESS
authenticated_attester = K_authorized
current verifier-local authorization = FAIL
final result = ATTESTER_NOT_AUTHORIZED
```

Thus artifact authenticity is durable, enforceability depends on current
verifier-local attester recognition, and issuance policy is not re-evaluated.

## 15. Profile applicability and self-contained verification

The governing VE-014 context and the artifact's exact
`verification.profile` field select this profile. Exact identifier comparison
is sufficient. The profile fixes Ed25519 and admits no algorithm negotiation,
fallback, alias, registry lookup, or case normalization.

The artifact-carried raw key makes cryptographic verification self-contained.
It does not make trust self-contained. Authorization comes only from current
verifier-local configuration for the applicable context. No profile registry,
algorithm registry, key registry, DID system, certificate PKI, or universal
attester identity is needed.

## 16. Failure-stage ordering

This scenario processes failures in the following order because that order is
consistent with existing normative ownership:

```text
profile recognition
→ structural validation
→ cryptographic authentication
→ authenticated-attester extraction
→ verifier-local authorization
→ action_id comparison
→ action_digest comparison
→ replay/lifecycle/resource/context checks
→ execution
```

An earlier failure prevents this scenario from treating a later stage as
successful. This is not a new universal pipeline: VE-014 and the selected
profile govern their own required ordering, while later local execution checks
remain outside the profile.

## 17. UNCERTAIN boundary

If the Adapter submits the operation but the protected-system outcome becomes
uncertain, profile authentication remains unchanged and does not resolve the
outcome:

```text
UNCERTAIN does not mutate, consume, revoke, or invalidate the right
right validity != retry safety
```

Only authoritative execution/outcome state establishes whether another
attempt is safe. No replay token or execution-attempt primitive is required.

## 18. Independent implementation replay

Independent Python and JavaScript implementations began with the abstract
Action pair and scenario-local seed, shared no serialized frame or signature,
and independently derived:

- the exact 93-octet `ExecutionRightBody`;
- the exact 166-octet authenticated frame;
- the exact 185-octet `Sig_structure`;
- the same raw public key and 64-octet deterministic signature;
- the same 73-octet untagged detached `COSE_Sign1`;
- the same 108-octet outer artifact;
- successful strict-profile authentication; and
- the exact `authenticated_attester` bytes.

Node/OpenSSL, Python cryptography/OpenSSL, and PyNaCl/libsodium accept the
happy-path signature. Profile-level prevalidation rejects the representative
low-order-key case consistently even where bare library defaults differ on
other Ed25519 edge cases.

## 19. Primitive-creep pressure test

The scenario requires no new Attester or Identity primitive, `TrustContext`,
`KeyRegistry`, `ProfileRegistry`, `AlgorithmRegistry`,
`VerificationEnvelope`, `SignedArtifact`, `Capability`,
`AuthorizationToken`, `ReplayToken`, or execution-attempt primitive. Raw key
bytes are profile-local verification material, and local authorization remains
environmental configuration rather than a portable registry abstraction.

## 20. Findings and governance

The final classification is:

```text
A. NO NEW VE-014 VERIFICATION-PROFILE GAP
```

Replay and lifecycle are an existing downstream ownership boundary, not a
newly discovered dependency, verification-profile gap, VE-014 gap, or new
architectural gap. Existing architecture already assigns execution
admissibility, atomic commitment, idempotency, duplicate-transition
prevention, and retry safety to the authoritative execution/state domain. The
scenario finds no unresolved replay/lifecycle question and no
authentication/authorization composition gap, verifier-local authorization
representation dependency, profile-applicability gap, VE-014 specification
gap, or new architectural gap.

```text
VE-014 profile revision required: NO
VE-014 revision required: NO
VE-001 revision required: NO
RFC required: NO
ADR required: NO
```

## 21. Architectural Decision Test

1. **Founding Principles consistency — PASS.** Authorization, execution, and
   authoritative outcome remain separate and inspectable.
2. **Primitive burden — PASS.** Existing Action, Execution Right, profile, and
   local configuration concepts suffice.
3. **Removability — PASS.** Replacing this verification profile changes no
   VE-014 payload, attester-authorization, temporal, replay, or outcome
   semantics.
4. **Twenty-year durability — PASS.** VE-014 remains stable while versioned
   subordinate profiles can be replaced as cryptography evolves.
5. **Independent implementability — PASS.** Exact frames, bytes, keys,
   signatures, strict acceptance rules, and failures are independently
   reproducible.
6. **Reduced conceptual complexity — PASS.** One fixed profile plus local
   key authorization avoids registries, PKI, identity systems, negotiation,
   and new lifecycle primitives.

No new primitive or semantic rule is required.

## 22. Cadence implication

The next cadence artifact is the non-normative Gap Analysis for RS-ER-004. It
should verify the no-gap finding and the ordinary replay/lifecycle dependency
before any profile lifecycle change is considered.
