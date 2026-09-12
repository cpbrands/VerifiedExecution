---
id: CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
title: Claim Body Ed25519 COSE Sign1 Verification Profile
version: "0.1"
status: Draft
document_type: Specification
category: Verification
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - ADR-VERIFY-002
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
related_documents:
  - CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - VE-014-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
supersedes: null
superseded_by: null
---

# Claim Body Ed25519 COSE Sign1 Verification Profile

## 1. Status, purpose, and authority boundary

This is a subordinate normative **Draft v0.1** verification profile under
ADR-VERIFY-002. Its normative language applies only to implementations
claiming conformance with this Draft. It is not Approved and does not establish
stable compatibility.

This profile answers only:

> Did a verifier recognized by the supplied local VerificationContext
> establish that the recognized semantic issuer cryptographically issued this
> exact canonical Claim.body?

Successful verification means only that:

1. the artifact is valid under this profile;
2. its Ed25519 signature covers the exact canonical VE-CBOR-1 Claim.body
   bytes;
3. the successful verification key is permitted by VerificationContext for
   the Claim's semantic `issuer_ref` under this profile; and
4. every fixed algorithm and profile requirement is satisfied.

It does not establish that the proposition is true, underlying evidence is
authentic, the issuer behaved honestly, the Claim is fresh, the Claim is
applicable to a Rule, an Action was authorized, an external outcome occurred,
or the verification key is the semantic issuer identity.

```text
Claim semantics
!= verification
!= evidence truth
!= trust policy
!= authorization
```

The profile is independent of any Predicate domain. It applies whenever the
Claim body conforms to VE-CBOR-1 Claim Body Schema v0.2 and the supplied
VerificationContext recognizes the semantic issuer and a permitted Ed25519
verification key. No domain field, evidence format, operational identifier,
domain-party model, or external-system logic is defined here.

## 2. Profile identifier and fixed suite

The exact governed profile identifier is:

```text
urn:ve:verify:claim-body:cose-sign1-ed25519:1
```

It is valid NFC text. Equality is exact Unicode scalar/code-point equality.
No case folding, alias, URI resolution, registry lookup, or
implementation-defined normalization is permitted.

This profile fixes one suite:

- signature construction: detached-payload `COSE_Sign1`;
- COSE algorithm: EdDSA (`alg = -8`);
- curve and signature algorithm: Ed25519;
- candidate public-key representation supplied by VerificationContext:
  exactly 32 raw Ed25519 public-key octets; and
- signature representation: exactly 64 raw Ed25519 signature octets.

There is no algorithm negotiation or agility inside v1. The COSE EdDSA
identifier does not permit another curve under this profile. COSE EdDSA and
pure EdDSA are governed by RFC 9053 Section 2.2. Ed25519 encoding, signing, and
verification are governed by RFC 8032 Sections 5.1.6 and 5.1.7, subject to the
stricter acceptance predicate in Section 6.1.

## 3. Exact signed bytes

The detached payload is exactly the already-established portable byte string:

```text
claim_body_canonical_bytes = VE-CBOR-1(Claim.body)
```

It is the complete exact canonical Claim.body byte sequence admitted by
VE-CBOR-1 Claim Body Schema v0.2. It is not the Claim envelope, a digest, a
semantic reserialization, a profile-specific frame, or a body containing
`Claim.verification`.

Before profile verification, the verifier MUST validate the retained
Predicate Schema and Claim body as required by VE-CBOR-1 Claim Body Schema
v0.2, consume exactly one complete body item, re-encode it through that
governed schema, and require byte-for-byte equality with the supplied body
bytes. A noncanonical, trailing, schema-mismatched, or otherwise rejected body
MUST NOT be repaired, normalized, or substituted before signature
verification.

The COSE `external_aad` is exactly the 18 UTF-8 octets:

```text
VE-KERNEL-CLAIM-V1
```

Hexadecimal:

```text
56452d4b45524e454c2d434c41494d2d5631
```

The exact RFC 9052 `Sig_structure` is:

```text
Sig_structure = [
  "Signature1",
  h'a10127',
  h'56452d4b45524e454c2d434c41494d2d5631',
  claim_body_canonical_bytes
]
```

The signature is Ed25519 over the canonical CBOR encoding of that exact
four-member `Sig_structure`. The detached body is not stored again in the
artifact. The external AAD supplies the domain separation required by
ADR-VERIFY-002; no new domain primitive or alternate frame is introduced.

## 4. Exact artifact representation and closed grammar

`Claim.verification` retains the exact ADR-VERIFY-002 envelope:

```text
verification = {
  profile : "urn:ve:verify:claim-body:cose-sign1-ed25519:1",
  artifact : bstr
}
```

`artifact` is opaque envelope bytes containing exactly one canonical,
untagged, detached-payload `COSE_Sign1` data item:

```text
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

The protected byte string is the exact canonical encoding of the closed COSE
header map `{ 1: -8 }`, where label `1` is `alg` and `-8` is EdDSA. The
unprotected map is empty. The payload is CBOR `null`, denoting the detached
payload. A COSE tag is forbidden.

No `kid`, critical header, certificate, public key, key reference, issuer
copy, external-AAD copy, algorithm copy, or unknown protected or unprotected
header is permitted. Duplicate headers, duplicate map labels, tags,
indefinite-length items, non-shortest encodings, leading bytes, trailing
bytes, and any alternate representation are rejected. Key material MUST NOT
be embedded in the verification envelope.

## 5. VerificationContext and issuer/key binding

`issuer_ref` remains semantic Claim-body content under its Predicate Schema.
It is not a public key, `kid`, certificate subject, DID, account, organization,
or global VE key identifier.

```text
issuer_ref != verification-key identity
```

For this profile, the verifier-supplied local VerificationContext MUST be able
to determine, for the exact combination of:

- the Claim's schema-interpreted semantic `issuer_ref`;
- the Claim's exact `predicate` and retained Predicate Schema;
- this exact verification profile; and
- any verifier-local applicability or trust/delegation context supplied to
  the verification operation,

whether the issuer is recognized and which finite set of exact 32-octet raw
Ed25519 public keys, if any, is currently permitted to verify that issuer for
this use. A returned candidate is eligible only when the context establishes
the issuer-to-key binding and profile applicability; possession of key bytes
alone never establishes that relationship.

The context MAY be backed by COSE_Key, JWK/JWKS, X.509/PKIX, enterprise
configuration, hardware roots, or another local system, but those forms are
not embedded in the Claim and are not defined by this profile. Key discovery,
rotation, revocation, delegation, organizational PKI, and trust-management
operations remain context or deployment concerns.

The context returns only keys already permitted for the exact query. An
unrecognized issuer, an absent binding, and a known relationship whose use for
this issuer/profile is not permitted all produce no permitted candidate. The
context MAY retain a more specific local diagnostic reason, but this profile
reports `NO_APPLICABLE_VERIFIER` for each case.

This equivalence is required because the artifact carries neither `kid` nor
key material. The verifier MUST NOT discover which non-permitted key might
have created a signature by testing keys that the context did not return.
A permitted candidate whose signature check fails remains distinguishable as
`AUTHENTICATION_FAILED`.

It MUST NOT infer semantic issuer identity solely from a public key, reinterpret
`issuer_ref` as key identity, or supply a key merely because it verifies the
signature. This profile creates no key registry and defines no key lifecycle.

## 6. Deterministic verification procedure

A conforming verifier MUST perform these steps in order:

1. Validate the exact Claim.body bytes independently under VE-CBOR-1 Claim
   Body Schema v0.2 and its retained applicable Predicate Schema. On failure,
   return `BODY_NOT_CONFORMING`; do not attempt to repair the body.
2. Dispatch on exact `verification.profile`. If it is not the Section 2
   identifier, return `UNSUPPORTED` without interpreting its artifact as this
   profile.
3. Decode `verification.artifact` as exactly one canonical VE-CBOR-1 data item
   and require the closed four-member COSE structure, widths, empty
   unprotected map, detached `null` payload, and absence of a tag. Decode the
   protected byte string canonically far enough to distinguish one exact
   unambiguous `alg` selection from malformed or extra header content.
4. If that sole protected header is an unambiguous algorithm other than
   `alg = -8`, return `UNSUPPORTED`. Otherwise require exact protected bytes
   `h'a10127'`; any extra, unknown, duplicate, or malformed protected content
   is `MALFORMED`.
5. Ask VerificationContext for candidate keys permitted for the exact semantic
   issuer, Predicate, profile, and supplied local applicability context. Fail
   closed when recognition or a permitted binding cannot be established.
6. Use the exact validated Claim.body input bytes as the detached payload and
   reconstruct the exact Section 3 `Sig_structure` with the fixed external
   AAD. Do not reserialize a merely equivalent semantic object.
7. Apply Section 6.1 independently to every permitted candidate key. Do not
   attempt a key that the context did not permit for this issuer/profile.
8. Return `PASS` with the exact semantic `issuer_ref` and the nonempty set of
   permitted key byte strings for which verification succeeded. If none
   succeeds, return `AUTHENTICATION_FAILED`.

Body conformance does not replace signature verification. Signature
verification does not replace body conformance or issuer/key permission.

### 6.1 Exact Ed25519 acceptance predicate

For each permitted candidate, let the public-key encoding be `A_bytes`. Split
the 64-octet signature into `R_bytes || S_bytes`. The verifier MUST accept that
candidate only when all of the following hold:

1. `A_bytes` is exactly 32 octets and is the canonical RFC 8032 compressed
   encoding of one successfully decoded Edwards25519 point `A`.
2. `A` is not the identity, is not low-order, is in the prime-order subgroup,
   and has no nontrivial torsion component.
3. `R_bytes` is exactly 32 octets and is the canonical RFC 8032 compressed
   encoding of one successfully decoded Edwards25519 point `R`.
4. `R` is not the identity, is not low-order, is in the prime-order subgroup,
   and has no nontrivial torsion component.
5. `S_bytes`, interpreted as a little-endian integer `S`, satisfies
   `0 <= S < L`, where `L` is the Ed25519 prime-subgroup order. An out-of-range
   scalar MUST NOT be reduced modulo `L`.
6. With `M` equal to the exact canonical `Sig_structure` bytes and
   `k = SHA-512(R_bytes || A_bytes || M) mod L`, the uncofactored equation
   holds exactly:

   ```text
   [S]B = R + [k]A
   ```

Canonical point encoding requires decoded `y < p`, where `p = 2^255 - 19`,
successful recovery of the encoded `x`, rejection when `x = 0` but the sign
bit is one, and byte-identical re-encoding. This profile does not adopt
ZIP-215 acceptance semantics. Noncanonical points, low-order points,
nontrivial torsion components, cofactored-only acceptance, and `S >= L` are
rejected.

An implementation MUST NOT delegate the acceptance boundary to unspecified
library-default behavior. Individual and batch verification MUST have the
same acceptance set. This is the same limited Ed25519 acceptance machinery
used by the Draft VE-014 Ed25519 COSE Sign1 profile, applied here only to this
Claim-specific signature input and externally supplied permitted keys.

## 7. Verification result and failure semantics

`PASS` establishes only:

```text
cryptographic authorship and exact-body binding
under the supplied VerificationContext
```

It returns the semantic `issuer_ref` already present in the Claim and the
matching permitted public-key bytes as profile-local verification detail. The
key detail does not become Claim semantics or a semantic identity.

Failures are deterministic at these existing architectural layers:

| Result | Conditions |
|---|---|
| `BODY_NOT_CONFORMING` | Claim.body is unavailable, noncanonical, has trailing bytes, fails its applicable representation/schema, or is a validly signed alternate representation that VE-CBOR-1 Claim Body Schema v0.2 rejects. |
| `UNSUPPORTED` | The verification profile is unknown, or the exact profile is selected but a well-formed protected header unambiguously selects a disallowed algorithm. |
| `MALFORMED` | Artifact decoding fails; the COSE structure, widths, or canonical encoding is wrong; payload is embedded or otherwise differs from required `null`; a tag, `kid`, critical, unknown, duplicate, or unprotected header is present; protected bytes are malformed; or any leading/trailing bytes or ambiguity exists. |
| `NO_APPLICABLE_VERIFIER` | VerificationContext does not recognize the semantic issuer or supplies no permitted candidate for the issuer, Predicate, profile, and local context. This includes an absent or expressly non-permitted issuer/key binding; a local diagnostic MAY preserve that subreason without testing the key. |
| `AUTHENTICATION_FAILED` | At least one key is permitted but none satisfies the exact Ed25519 acceptance predicate and signature equation over the reconstructed exact body bytes; this includes a wrong key, signature mutation, or body substitution. |

An exact alternative `alg` is `UNSUPPORTED`; a malformed or ambiguous
protected map is `MALFORMED`. A structurally wrong signature width is
`MALFORMED`; a correctly sized signature that fails point, scalar, or equation
checks is `AUTHENTICATION_FAILED`. A non-`null` COSE payload is a malformed
detached-profile artifact, not a second source of body bytes.

No failure result establishes proposition falsity, evidence invalidity, Rule
inapplicability, authorization denial, or occurrence/nonoccurrence of an
external outcome. Those conclusions belong to their governing layers.

## 8. Replay, freshness, and downstream boundaries

This profile defines no timestamp, nonce, challenge, audience, transaction
context, replay identifier, issuance time, expiry, or freshness test. Claim
Body Schema v0.2 forbids the currently unsupported Claim time fields, and this
profile MUST NOT smuggle them into verification metadata.

Application-specific freshness and replay requirements belong in explicitly
modeled Claim semantics when governed, Rule/Evaluate, VerificationContext, or
deployment policy. A previously valid signature remains a valid signature over
the same immutable body; whether that Claim is currently usable is a separate
decision.

A `PASS` makes the Claim eligible to be supplied as a verified Claim input
under existing architecture. It does not satisfy a Rule, perform Evaluate,
authorize an Action, or establish a trust-policy decision.

Evidence authentication separately asks whether evidence supporting the Claim
was authentic and factually sufficient. This profile never consumes or
authenticates external evidence. A recognized issuer can validly sign a false
or poorly supported proposition; cryptographic Claim verification can still
`PASS` while evidence or factual validation fails elsewhere.

## 9. Positive conformance vector P1

All hexadecimal values are lowercase and contain no whitespace when used as
bytes. The private seed is test-only and MUST NOT be used in production.

Profile identifier:

```text
urn:ve:verify:claim-body:cose-sign1-ed25519:1
```

Test Ed25519 private seed:

```text
9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60
```

Public key:

```text
d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a
```

The semantic body is VE-CBOR-1 Claim Body Schema v0.2 vector P1: an
`ActionContentReference`, issuer text `bank-A`, Predicate `P03-C`, and Boolean
value `true`.

Exact canonical Claim.body bytes, 147 octets:

```text
a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e63658276416374696f6e436f6e74656e745265666572656e63655820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Protected-header bytes:

```text
a10127
```

Exact canonical `Sig_structure` bytes, 184 octets:

```text
846a5369676e61747572653143a101275256452d4b45524e454c2d434c41494d2d56315893a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e63658276416374696f6e436f6e74656e745265666572656e63655820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Signature bytes:

```text
183536f0b2c580a35ab39ff34fe6f4ef7fa9fcfb081c87b2da6299c270b9f58cefb4ea33a447737cac648f703b6eac470affe3a69f48a9209572006b8d01ed08
```

Exact canonical untagged `COSE_Sign1` bytes and exact
`verification.artifact` payload, 73 octets:

```text
8443a10127a0f65840183536f0b2c580a35ab39ff34fe6f4ef7fa9fcfb081c87b2da6299c270b9f58cefb4ea33a447737cac648f703b6eac470affe3a69f48a9209572006b8d01ed08
```

VerificationContext mapping:

```text
predicate P03-C semantic issuer "bank-A"
+ exact profile identifier
+ supplied local applicability context
-> permitted candidate key
   h'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a'
```

Expected result:

```text
verification = PASS
verified_issuer_ref = "bank-A"
matching_permitted_keys = [
  h'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a'
]
```

Independent Python and Node.js constructions using their separate Ed25519
implementations MUST reproduce the exact public key, `Sig_structure`,
signature, and artifact above.

## 10. Domain-neutral reuse vector P2

The same profile, key, external AAD, headers, context procedure, and algorithm
are applied without modification to VE-CBOR-1 Claim Body Schema v0.2 vector
P4: an `ExternalSubjectReference` for `account-X`, issuer `bank-A`, Predicate
`P02-A`, and Boolean value `true`.

Exact canonical Claim.body bytes, 126 octets:

```text
a46576616c7565f569707265646963617465582102038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f6a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e636582781845787465726e616c5375626a6563745265666572656e6365696163636f756e742d58
```

Exact signature:

```text
df461bdfd36695f35042a891b8171f884873ede7d60ef4a6eeb2298a9038e13eb51aab49f98a3868d494b6d80ed8029980b953158c1995043da59800ad2cdd04
```

Exact artifact:

```text
8443a10127a0f65840df461bdfd36695f35042a891b8171f884873ede7d60ef4a6eeb2298a9038e13eb51aab49f98a3868d494b6d80ed8029980b953158c1995043da59800ad2cdd04
```

With a VerificationContext mapping for the P2 Predicate issuer domain, the
expected result is `PASS`. This proves that profile mechanics depend on the
exact canonical body and local issuer/key binding, not a particular Predicate,
subject-reference arm, or proposition.

## 11. Negative and boundary vectors

Unless stated otherwise, each mutation starts from P1 and changes only the
named input:

| ID | Mutation | Expected result |
|---|---|---|
| N1 | In P1's canonical Claim.body, change only the final `action_digest` octet from `h'3f'` to `h'3e'`, preserving its 147-octet canonical representation, the P03-C Predicate, issuer `bank-A`, and the P1 VerificationContext; the resulting diagnostic SHA-256 is `339848a3e566fb32b13ab73119eb3224950a165bed9e5710b746b85efe43d2bd`; retain the P1 artifact unchanged. | `AUTHENTICATION_FAILED` |
| N2 | Supply the different conforming canonical P2 body with the P1 artifact unchanged. For this vector, VerificationContext explicitly permits the P1 Ed25519 key for P2's issuer `bank-A`, Predicate P02-A and retained schema, this exact profile, and the supplied local applicability context. | `AUTHENTICATION_FAILED` |
| N3 | Flip the final signature bit. | `AUTHENTICATION_FAILED` |
| N4 | Context permits a different valid 32-octet Ed25519 public key for the exact issuer/profile. | `AUTHENTICATION_FAILED` |
| N5 | Make the P1 key known but permitted only for a different semantic `issuer_ref`; do not return or test it for the asserted issuer. | `NO_APPLICABLE_VERIFIER` |
| N6 | Use a syntactically valid `issuer_ref` that VerificationContext does not recognize. | `NO_APPLICABLE_VERIFIER` |
| N7 | Replace protected bytes `a10127` with canonical `{1: -7}` bytes `a10126`. | `UNSUPPORTED` |
| N8 | Truncate the COSE object, change its array length, or append one octet. | `MALFORMED` |
| N9 | Add a protected header or alter the exact protected bytes while retaining `alg = -8`. | `MALFORMED` |
| N10 | Embed P1 body bytes as the COSE payload instead of `null`, whether equal or unequal. | `MALFORMED` |
| N11 | Replace the profile identifier with `urn:ve:verify:claim-body:unknown:1`. | `UNSUPPORTED` |
| N12 | Sign a noncanonical or trailing alternate encoding of the semantic body and present those bytes. | `BODY_NOT_CONFORMING`, before signature use |
| N13 | Keep P1 cryptographically valid while an independent test oracle records that its proposition is false. | Profile `PASS`; factual validation fails elsewhere |
| N14 | Keep P1 cryptographically valid while its supporting external evidence is deliberately unauthenticated. | Profile `PASS`; evidence authentication fails elsewhere |
| N15 | Add `kid`, a critical header, an unprotected header, a COSE tag, or embedded key material. | `MALFORMED` |
| N16 | Encode the COSE array or a member with an indefinite or non-shortest form. | `MALFORMED` |

The Ed25519 edge-case probes from the Draft VE-014 Ed25519 COSE Sign1 profile
also apply with the P1 message: `S + L`, noncanonical `A` or `R`, identity or
low-order `A` or `R`, and torsion-bearing `A` or `R` all produce
`AUTHENTICATION_FAILED`. They MUST NOT be accepted through library-default,
cofactored, or ZIP-215 behavior.

N5 and N6 prove that a valid body and signature cannot manufacture an issuer
binding. N5 deliberately does not reveal or test the non-permitted key; a
context-local diagnostic may distinguish binding denial from N6's unrecognized
issuer without changing the profile result. N13 and N14 are required positive
cryptographic checks: rejecting
them at this layer would falsely conflate authorship with factual or evidence
validation.

## 12. Security and architecture pressure tests

| Question | Result |
|---|---|
| Does verification prove proposition truth? | **No.** It proves exact-body authorship under local context. |
| Does it authenticate external evidence? | **No.** Evidence profiles and deployment controls remain separate. |
| Is the public key the semantic issuer? | **No.** VerificationContext supplies the binding. |
| Is key material carried in the artifact? | **No.** ADR-VERIFY-002 forbids it here. |
| Is a VE key registry required? | **No.** |
| Are JWK, COSE_Key, or certificate semantics duplicated? | **No.** They may back the external context only. |
| Is freshness or replay owned here? | **No.** |
| Is Rule applicability or authorization decided here? | **No.** |
| Is the profile domain-specific? | **No.** Both body vectors use unchanged mechanics across different subject and Predicate forms. |
| Can noncanonical or trailing body bytes be signed into acceptability? | **No.** Body validation precedes signature use. |
| Can profile or algorithm substitution pass? | **No.** Exact dispatch and protected bytes are required. |

## 13. Architectural Decision Test

1. **Founding Principles consistency — PASS.** Exact assertion provenance is
   inspectable while verification, evidence, trust, evaluation, authorization,
   and outcome remain separate.
2. **New primitive burden — PASS.** The existing Claim envelope, canonical body,
   profile dispatch, COSE construction, and VerificationContext are reused; no
   primitive, registry, or identity kind is introduced.
3. **Removability — PASS.** A deployment may remove or replace this optional
   subordinate profile without changing Claim, Predicate, Action, Event,
   evidence, or Rule semantics.
4. **Twenty-year durability — PASS at Draft scope.** Exact bytes, fixed
   algorithm, closed artifact grammar, versioned identifier, and retained
   context make historical interpretation reproducible without a live global
   service.
5. **Independent implementability — PASS.** The canonical-body input,
   `Sig_structure`, strict Ed25519 acceptance predicate, context contract,
   failures, and cross-language vectors are explicit.
6. **Reduced conceptual complexity — PASS.** One fixed suite and external
   issuer/key binding avoid a second signature framework, embedded identity
   system, algorithm negotiation, or evidence-specific cryptography.

## 14. Governance result

This Draft is wholly subordinate to the verification-profile authority
delegated by accepted ADR-VERIFY-002. It changes no Approved specification,
Claim field, Predicate meaning, primitive, or architecture.

```text
Claim Body Schema revision required: NO
RFC required: NO
ADR required: NO
top-level VE-xxx allocation required: NO
```

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial domain-neutral Claim-body Ed25519 detached COSE_Sign1 verification profile, VerificationContext issuer/key binding contract, failure behavior, and cross-language vectors. |
