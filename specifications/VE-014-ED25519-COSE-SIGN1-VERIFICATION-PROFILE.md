---
id: VE-014-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
title: VE-014 Ed25519 COSE Sign1 Verification Profile
version: "0.1"
status: Draft
document_type: Specification
category: Verification
author: Verified Execution Editorial Board
created: 2026-09-05
updated: 2026-09-05
depends_on:
  - VE-014
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - ADR-ENC-001
related_documents:
  - RFC-011
  - ADR-011
  - ADR-VERIFY-002
  - RS-ER-003-VE014-INDEPENDENT-EXECUTOR
  - GAP-ANALYSIS-RS-ER-003
  - GAP-ANALYSIS-RS-ACT-001
supersedes: null
superseded_by: null
---

# VE-014 Ed25519 COSE Sign1 Verification Profile

## 1. Status and authority boundary

This is a subordinate normative **Draft v0.1** verification profile under
VE-014. Its normative language applies only to implementations claiming
conformance with this Draft. It is not Approved and does not establish stable
compatibility.

This profile defines only:

- one authentication algorithm and procedure;
- the exact `verification.artifact` representation;
- authenticated-attester extraction; and
- deterministic profile verification mechanics.

It does not redefine the Execution Right semantic payload, imported VE-001
values, Action canonicalization, verifier-local attester authorization,
applicable-context semantics, temporal authorization, replay, `UNCERTAIN`,
executor authority, issuance inputs, or lifecycle semantics.

```text
authentication
!= attester authorization
```

Successful profile verification proves only that the exact VE-014 frame was
authenticated by the private key corresponding to one profile-local public
key. VE-014 separately requires current verifier-local recognition of that
authenticated attester as authorized for the applicable context before the
right is enforceable.

## 2. Profile identifier and fixed suite

The exact governed profile identifier is:

```text
urn:ve:verify:execution-right:cose-sign1-ed25519:1
```

It is valid NFC text. Equality is the exact Unicode scalar/code-point equality
required by VE-014. No case folding, alias, URI resolution, registry lookup, or
implementation-defined normalization is permitted.

This profile fixes one suite:

- signature construction: detached-payload `COSE_Sign1`;
- COSE algorithm: EdDSA (`alg = -8`);
- curve and signature algorithm: Ed25519;
- public-key representation: exactly 32 raw Ed25519 public-key octets; and
- signature representation: exactly 64 raw Ed25519 signature octets.

COSE EdDSA and its use of pure EdDSA are governed by RFC 9053 Section 2.2.
Ed25519 encoding, signing, and verification are governed by RFC 8032 Sections
5.1.6 and 5.1.7, subject to the stricter acceptance predicate in Section 5.1
of this profile. RFC 8032 alone does not close every edge-case acceptance
choice needed for deterministic cross-implementation verification.

There is no algorithm negotiation. The broader COSE EdDSA identifier does not
permit another curve under this profile. ES256 was considered but rejected for
v0.1 because its public-key representation and validation rules are more
complex and its signatures require additional care to ensure deterministic
signing. Ed25519 provides deterministic signing, fixed-width keys and
signatures, broad independent implementation support, and no certificate or
registry dependency.

COSE is reused only as this profile's signature container and signature-input
construction. ADR-VERIFY-002 remains Claim-specific; no Claim body,
`issuer_ref`, Claim verification profile, certificate binding, or generic COSE
profile is imported.

## 3. Inputs and exact artifact grammar

Profile verification receives:

1. the parsed VE-014 artifact version and `ExecutionRightBody`;
2. the exact profile identifier above; and
3. `verification.artifact`, a byte string containing exactly one canonical
   VE-CBOR-1 data item defined below.

The decoded profile artifact is exactly:

```text
Ed25519CoseSign1Artifact = [
  public_key,
  cose_sign1
]

public_key = bstr .size 32

cose_sign1 = [
  protected,
  unprotected,
  payload,
  signature
]

protected   = h'a10127'
unprotected = {}
payload     = null
signature   = bstr .size 64
```

`protected` is the serialized COSE protected-header map `{ 1: -8 }`, where
integer label `1` is `alg` and `-8` is EdDSA. It MUST be the exact three-byte
value `h'a10127'`. The unprotected map MUST be empty. The COSE payload MUST be
`null`, denoting detached payload. No COSE tag, `kid`, critical header,
certificate, embedded chain, or other protected or unprotected header is
permitted.

The outer `verification.artifact` byte string MUST contain the exact canonical
VE-CBOR-1 encoding of `Ed25519CoseSign1Artifact`, with no leading or trailing
bytes. The public key and signature are primitive profile mechanics, not
Execution Right semantic fields.

## 4. Authenticated frame and COSE signature input

The detached payload is exactly the canonical VE-CBOR-1 encoding of the VE-014
authentication frame:

```text
ExecutionRightAuthenticationFrame = [
  "VE-EXECUTION-RIGHT",
  1,
  "urn:ve:verify:execution-right:cose-sign1-ed25519:1",
  ExecutionRightBody
]
```

`ExecutionRightBody` remains exactly:

```text
{
  "action_digest": VE001ActionDigestValue,
  "action_id": VE001ActionIdValue
}
```

The implementation MUST reconstruct this exact frame from the parsed VE-014
version, profile selector, and directly embedded canonical VE-001 values. It
MUST NOT authenticate the body alone, a retyped value, a reduced frame, or an
alternate representation.

The COSE signature input is exactly the RFC 9052 `Sig_structure`:

```text
Sig_structure = [
  "Signature1",
  h'a10127',
  h'',
  VE-CBOR-1(ExecutionRightAuthenticationFrame)
]
```

The third member is empty `external_aad`. Domain and profile separation are
already authenticated inside the exact VE-014 frame. No additional generic
domain primitive is introduced.

The 64-octet signature MUST be an Ed25519 signature over the canonical CBOR
encoding of this exact `Sig_structure`.

## 5. Verification and authenticated-attester output

A conforming verifier MUST:

1. require the exact profile identifier in Section 2;
2. decode `verification.artifact` as exactly one canonical VE-CBOR-1 data item;
3. require the exact closed grammar in Section 3;
4. reconstruct the exact VE-014 frame in Section 4;
5. construct the exact COSE `Sig_structure` in Section 4;
6. validate the public key and signature under the exact acceptance predicate
   in Section 5.1;
7. verify the signature as Ed25519 using that acceptance predicate; and
8. on success, return that exact 32-octet public key as the authenticated
   attester output.

### 5.1 Exact Ed25519 acceptance predicate

Let the public key encoding be `A_bytes`. Split the 64-octet signature into
`R_bytes || S_bytes`. A profile verifier MUST accept only when all of the
following hold:

1. `A_bytes` is exactly 32 octets and is the canonical RFC 8032 compressed
   encoding of one successfully decoded Edwards25519 point `A`.
2. `A` is not the identity, is not low-order, is in the prime-order subgroup,
   and has no nontrivial torsion component.
3. `R_bytes` is exactly 32 octets and is the canonical RFC 8032 compressed
   encoding of one successfully decoded Edwards25519 point `R`.
4. `R` is not the identity, is not low-order, is in the prime-order subgroup,
   and has no nontrivial torsion component.
5. `S_bytes`, interpreted as the RFC 8032 little-endian integer `S`, satisfies
   `0 <= S < L`, where `L` is the Ed25519 prime-subgroup order defined by RFC
   8032. A verifier MUST NOT reduce an out-of-range `S` modulo `L` or accept an
   alternate encoding of the same scalar.
6. With `M` equal to the exact canonical COSE `Sig_structure` bytes in Section
   4 and `k = SHA-512(R_bytes || A_bytes || M) mod L`, the uncofactored
   equation holds exactly:

   ```text
   [S]B = R + [k]A
   ```

Canonical point encoding requires the RFC 8032 decoded `y` coordinate to be
less than `p = 2^255 - 19`, successful recovery of the encoded `x` coordinate,
and rejection when `x = 0` but the encoded sign bit is one. Re-encoding the
decoded point MUST reproduce the original 32 octets exactly.

This profile does not adopt ZIP-215 acceptance semantics. In particular, an
input accepted only through a noncanonical point encoding, a low-order point,
a nontrivial torsion component, or cofactored verification behavior is not
valid under this profile. This is a profile-specific acceptance boundary, not
a judgment about other uses of ZIP-215.

An implementation MUST NOT delegate the acceptance decision to unspecified
library-default Ed25519 behavior. It MAY use a cryptographic library only when
the library has the same acceptance predicate, or when the implementation
performs the required canonical-encoding, subgroup, scalar, and equation
checks around the library call.

Individual and batch verification MUST have exactly the same acceptance set.
Batch verification MUST NOT accept an artifact that individual verification
under this section would reject. Batching is permitted only when its result is
semantically equivalent to applying this acceptance predicate independently
to every artifact.

The authenticated-attester output is profile-local cryptographic material:

```text
AuthenticatedAttester = Ed25519PublicKeyBytes
```

It is not a DID, account, organization, person, certificate subject, Root
Authority, issuer reference, or generic identity primitive. It says only which
Ed25519 key authenticated this artifact under this profile.

The public key is self-contained verification material, so cryptographic
verification requires no discovery service. A verifier MAY obtain an
equivalent candidate key from local configuration as an implementation check,
but it MUST compare it exactly with the artifact's `public_key`; ambiguity or
disagreement fails closed. No network resolver, VE key registry, certificate
hierarchy, DID system, or first-seen-key authority is defined.

After successful authentication, VE-014—not this profile—uses current local
authoritative configuration to decide whether the exact public-key bytes are
recognized as an attester authorized for the applicable context. Carrying and
authenticating a key does not authorize it.

## 6. Closed grammar and failure mapping

The profile MUST reject:

- a value that is not exactly the two-member profile artifact;
- leading or trailing bytes;
- noncanonical CBOR;
- tags, indefinite-length items, duplicate map keys, or extra members;
- a public key not exactly 32 octets;
- a COSE structure other than the exact four-member array;
- protected bytes other than `h'a10127'`;
- any non-empty unprotected map;
- a payload other than `null`;
- a signature not exactly 64 octets; or
- any ambiguous interpretation.

Failures map to VE-014 as follows:

| Condition | VE-014 result | Owner |
|---|---|---|
| Unknown but unambiguous `verification.profile` | `UNSUPPORTED` | VE-014 dispatch |
| Exact profile selected but protected `alg` is an unambiguous unsupported value | `UNSUPPORTED` | Profile dispatch |
| Malformed/noncanonical artifact, wrong shape or width, extra metadata, trailing bytes, or ambiguity | `MALFORMED` | Profile parsing |
| Correctly sized but noncanonical, undecodable, identity, low-order, torsion-bearing, or non-prime-order `A` or `R`; `S >= L`; invalid signature; wrong key; signature mutation; or reconstructed-frame mismatch | `AUTHENTICATION_FAILED` | Profile authentication |
| Authentication succeeds but the attester is not locally authorized for the applicable context | `ATTESTER_NOT_AUTHORIZED` | VE-014 after profile success |
| Supplied Action occurrence differs | `ACTION_ID_MISMATCH` | VE-014 after authorization recognition |
| Supplied Action semantic content differs | `ACTION_DIGEST_MISMATCH` | VE-014 after authorization recognition |

An exact profile artifact whose protected bytes encode a different algorithm
is `UNSUPPORTED` only when the alternative algorithm is unambiguous and the
rest of the COSE structure is well formed. A malformed or ambiguous protected
structure is `MALFORMED`. No failure establishes enforceability.

Wrong structural key or signature length is `MALFORMED`. Once those widths are
correct, failure of any Ed25519 encoding, point, subgroup, scalar, or equation
check in Section 5.1 is `AUTHENTICATION_FAILED`.

## 7. Temporal, replay, and context boundaries

This profile authenticates an immutable artifact. It does not define
`issued_at`, expiry, `valid_until`, revocation, audience, live Rule or Claim
re-evaluation, right identity, right consumption, replay state, retry state,
execution admission, or protected-state commitment.

```text
authentication success
!= current attester authorization
!= execution permission independent of VE-014 checks
!= authoritative state commitment
```

Authorization replay remains distinct from duplicate canonical state
commitment. An `UNCERTAIN` result does not mutate, consume, revoke, or
invalidate the right, and continued right validity does not establish retry
safety. Applicable-context meaning and authoritative execution/outcome state
remain outside this profile.

## 8. Conformance vectors

All hexadecimal values below are lowercase and contain no whitespace when
used as bytes. The private seed is test material only and MUST NOT be used in
production.

### 8.1 Positive vector P1

Profile identifier:

```text
urn:ve:verify:execution-right:cose-sign1-ed25519:1
```

Test Ed25519 private seed:

```text
9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60
```

Public key and expected authenticated-attester output:

```text
d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a
```

`action_id` payload:

```text
000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
```

`action_digest` payload:

```text
202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Canonical `ExecutionRightBody` bytes:

```text
a269616374696f6e5f69645820000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f6d616374696f6e5f6469676573745820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Canonical authenticated-frame bytes:

```text
847256452d455845435554494f4e2d524947485401783275726e3a76653a7665726966793a657865637574696f6e2d72696768743a636f73652d7369676e312d656432353531393a31a269616374696f6e5f69645820000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f6d616374696f6e5f6469676573745820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Protected-header bytes:

```text
a10127
```

Canonical `Sig_structure` bytes:

```text
846a5369676e61747572653143a101274058a6847256452d455845435554494f4e2d524947485401783275726e3a76653a7665726966793a657865637574696f6e2d72696768743a636f73652d7369676e312d656432353531393a31a269616374696f6e5f69645820000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f6d616374696f6e5f6469676573745820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Signature bytes:

```text
7759bdb0146a7a28ffd912d69da9471f510302b6e60878fbbdd0b6482951eb21facd1efc194b606e790670af1d6b8ae71b1e2f3689117a71f3adc5841583cf0d
```

Canonical untagged `COSE_Sign1` bytes:

```text
8443a10127a0f658407759bdb0146a7a28ffd912d69da9471f510302b6e60878fbbdd0b6482951eb21facd1efc194b606e790670af1d6b8ae71b1e2f3689117a71f3adc5841583cf0d
```

Decoded profile artifact:

```text
[
  h'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a',
  [
    h'a10127',
    {},
    null,
    h'7759bdb0146a7a28ffd912d69da9471f510302b6e60878fbbdd0b6482951eb21facd1efc194b606e790670af1d6b8ae71b1e2f3689117a71f3adc5841583cf0d'
  ]
]
```

Exact `verification.artifact` payload bytes:

```text
825820d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a8443a10127a0f658407759bdb0146a7a28ffd912d69da9471f510302b6e60878fbbdd0b6482951eb21facd1efc194b606e790670af1d6b8ae71b1e2f3689117a71f3adc5841583cf0d
```

Expected profile result:

```text
authentication = SUCCESS
authenticated_attester = h'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a'
```

If verifier-local configuration does not authorize that attester for the
applicable context, cryptographic verification still succeeds and VE-014 then
returns `ATTESTER_NOT_AUTHORIZED`.

### 8.2 Negative vectors

Each mutation starts from P1 and changes only the stated input:

| ID | Mutation | Expected result |
|---|---|---|
| N1 | Truncate `verification.artifact` by one octet. | `MALFORMED` |
| N2 | Replace the outer profile with `urn:ve:verify:execution-right:unknown:1` while retaining one unambiguous selector. | `UNSUPPORTED` |
| N3 | Replace protected bytes `a10127` with canonical `{1: -7}` bytes `a10126`. | `UNSUPPORTED` |
| N4 | Flip the final signature octet from `0d` to `0c`. | `AUTHENTICATION_FAILED` |
| N5 | Change the final `action_digest` payload octet from `3f` to `3e`, reconstruct the frame, and retain the P1 signature. | `AUTHENTICATION_FAILED` |
| N6 | Replace the public key with 32 zero octets. | `AUTHENTICATION_FAILED` |
| N7 | Add any protected or unprotected header, including `kid`. | `MALFORMED` |
| N8 | Encode the outer two-member artifact with an indefinite-length array. | `MALFORMED` |
| N9 | Keep P1 cryptographically valid but remove local authorization for the returned key in the applicable context. | Profile `SUCCESS`, then VE-014 `ATTESTER_NOT_AUTHORIZED` |

The following additional mutations close Ed25519 edge-case acceptance. Each
uses the unchanged P1 message `M` and all unchanged P1 fields except the exact
public-key or signature octets stated below. Rejection occurs before or during
the profile acceptance predicate; none is reduced, re-encoded, or repaired.

| ID | Exact mutation | Expected result |
|---|---|---|
| N10 | Replace the P1 signature with `7759bdb0146a7a28ffd912d69da9471f510302b6e60878fbbdd0b6482951eb21e7a1145934ae72c64fa36752fc6469fc1b1e2f3689117a71f3adc5841583cf1d`, whose `S` is the P1 scalar plus `L`. | `AUTHENTICATION_FAILED` |
| N11 | Replace `public_key` with noncanonical point encoding `edffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f`. | `AUTHENTICATION_FAILED` |
| N12 | Replace `R_bytes` with noncanonical point encoding `edffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f`; retain P1 `S_bytes`. | `AUTHENTICATION_FAILED` |
| N13 | Replace `public_key` with the correctly sized low-order encoding `0000000000000000000000000000000000000000000000000000000000000000`. | `AUTHENTICATION_FAILED` |
| N14 | Replace `R_bytes` with the correctly sized low-order encoding `0000000000000000000000000000000000000000000000000000000000000000`; retain P1 `S_bytes`. | `AUTHENTICATION_FAILED` |
| N15 | Replace `public_key` with the torsion-bearing CCTV encoding `10eb7c3acfb2bed3e0d6ab89bf5a3d6afddd1176ce4812e38d9fd485058fdb1f`. | `AUTHENTICATION_FAILED` |
| N16 | Replace `R_bytes` with the torsion-bearing CCTV encoding `36684ea91032ba5b1dbab2d02f4debc74c3327f2b3802e2e4d371aa42b12b56b`; retain P1 `S_bytes`. | `AUTHENTICATION_FAILED` |

N9 confirms that authentication and attester authorization remain separate.
Profile verification does not perform the later Action comparisons; VE-014
retains `ACTION_ID_MISMATCH` and `ACTION_DIGEST_MISMATCH` for those steps.

N10–N16 also serve as profile-level rejection probes for library divergence.
Simple Ed25519 APIs can differ on noncanonical encodings, low-order points,
torsion components, and cofactored equations. Conformance is determined by
Section 5.1, never by an implementation's unspecified library defaults.

## 9. Architecture pressure tests

| Question | Result |
|---|---|
| New primitive required? | **No.** This is subordinate verification machinery. |
| Global key registry required? | **No.** The public key is self-contained and authorization is local. |
| DID system required? | **No.** |
| Certificate PKI required? | **No.** |
| Attester authorization redefined? | **No.** VE-014 retains it. |
| Temporal authorization altered? | **No.** |
| Replay semantics owned here? | **No.** |
| VE-014 payload altered? | **No.** |
| Algorithm negotiation required? | **No.** Ed25519 is fixed. |
| Generic identity introduced? | **No.** The output is profile-local key material. |
| Independent verification reproducible? | **Yes.** P1 supplies every byte, N1-N9 close structural and boundary behavior, and N10-N16 close Ed25519 edge-case acceptance. |
| Profile removable or replaceable? | **Yes.** VE-014 semantics do not change. |

## 10. Architectural Decision Test

1. **Founding Principles consistency — PASS.** Authentication remains
   inspectable and distinct from authorization, execution, and outcome.
2. **New primitive burden — PASS.** No generic envelope, identity, registry,
   capability, token, or trust primitive is introduced.
3. **Removability — PASS.** This profile can be removed or replaced without
   changing VE-014 or VE-001 semantics.
4. **Twenty-year durability — PASS.** The versioned profile fixes every byte
   and algorithm while VE-014 permits a future replacement profile.
5. **Independent implementability — PASS.** RFC-pinned pure Ed25519, the exact
   acceptance predicate, COSE `Sig_structure`, VE-CBOR-1, exact vectors, and
   deterministic failures are fully specified.
6. **Reduced conceptual complexity — PASS.** One fixed suite and raw key avoid
   algorithm negotiation, PKI, DIDs, resolvers, and registries.

## 11. Governance result

This Draft remains entirely subordinate to authority explicitly delegated by
VE-014 Section 7:

```text
VE-014 revision required: NO
RFC required: NO
ADR required: NO
top-level VE-xxx allocation required: NO
```

The profile identifier obtains portable meaning only from this governed
subordinate specification. It is not an entry in a global profile registry.
This Draft does not modify VE-014, VE-001, the VE-001 portability profile,
RFC-011, ADR-011, ADR-VERIFY-002, or ADR-ENC-001.
