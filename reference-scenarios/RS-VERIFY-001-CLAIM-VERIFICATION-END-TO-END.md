---
id: RS-VERIFY-001
title: Claim Verification Across Authorship, Evidence, and Authorization Boundaries
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA
  - ADR-VERIFY-002
related_documents:
  - RS-LYNX-002
  - GAP-ANALYSIS-RS-LYNX-002-SETTLEMENT-PREDICATE-CLAIM
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
supersedes: null
superseded_by: null
---

# RS-VERIFY-001 — Claim Verification Across Authorship, Evidence, and Authorization Boundaries

## 1. Authority and objective

This document is **non-normative evidence**. It pressure-tests the Draft v0.1
[Claim Body Ed25519 COSE Sign1 Verification Profile](../specifications/CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE.md)
by applying it to the exact canonical Claim body from
[RS-LYNX-002](RS-LYNX-002-SETTLEMENT-PREDICATE-CLAIM.md). It does not modify
Claim, Predicate, Action, verification, evidence, trust, authorization,
Rule/Evaluate, Event, or Receipt semantics. It creates no specification,
evidence-authentication profile, registry, identifier allocation,
canonicalization system, or new primitive.

The scenario asks whether the reusable profile can cryptographically bind one
portable Claim body to a recognized semantic issuer while preserving the
separate owners of factual evidence and authorization:

```text
canonical Claim
    -> cryptographically verified Claim
    != factually true Claim
    != authorized decision
```

The fixture is not evidence of a live Lynx payment. No test key or identifier
in this scenario belongs to a real Lynx Participant, Payments Canada, Swift,
or a production system.

## 2. Exact reused Claim fixture

Current authoritative main retains the exact RS-LYNX-002 semantic Claim:

```text
Claim.body = {
  subject_reference: ActionOccurrenceReference {
    action_id:
      h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f',
    action_digest:
      h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'
  },
  issuer_ref: "lynx-sending-participant-A",
  predicate:
    h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82',
  value: true
}
```

The subject is the exact Action occurrence pair:

```text
action_id != action_digest
```

The canonical Claim body is exactly 206 octets:

```text
a46576616c7565f569707265646963617465582103308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f826a6973737565725f726566781a6c796e782d73656e64696e672d7061727469636970616e742d41717375626a6563745f7265666572656e6365837819416374696f6e4f6363757272656e63655265666572656e63655820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f58205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

Its diagnostic SHA-256 remains:

```text
507b4be06e4ee9e4b5e1d827c53f6adc8be086e41819135ee8f8b65dffe55300
```

That digest is neither Claim identity nor signed semantic content. The
signature covers the 206 body octets themselves.

## 3. Exact profile construction

The profile identifier is exactly:

```text
urn:ve:verify:claim-body:cose-sign1-ed25519:1
```

The construction is unchanged from the profile:

- canonical untagged detached `COSE_Sign1`;
- protected header bytes `h'a10127'`, encoding the closed map `{1: -8}`;
- empty unprotected map `{}`;
- `payload = null`;
- raw 64-octet Ed25519 signature; and
- exact canonical Claim-body bytes supplied as the detached payload.

The external AAD is the exact 18-octet UTF-8 value:

```text
VE-KERNEL-CLAIM-V1
```

The exact `Sig_structure` is:

```text
[
  "Signature1",
  h'a10127',
  h'56452d4b45524e454c2d434c41494d2d5631',
  h'<exact 206-byte canonical Claim.body>'
]
```

Its canonical encoding is exactly 243 octets:

```text
846a5369676e61747572653143a101275256452d4b45524e454c2d434c41494d2d563158cea46576616c7565f569707265646963617465582103308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f826a6973737565725f726566781a6c796e782d73656e64696e672d7061727469636970616e742d41717375626a6563745f7265666572656e6365837819416374696f6e4f6363757272656e63655265666572656e63655820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f58205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

## 4. Deterministic test-only issuer key and artifact

The scenario reuses the profile's P1/P2 deterministic test-only Ed25519 key.
Reuse avoids inventing a second cryptographic fixture and demonstrates that
the profile is independent of the Claim's domain. The private seed is public
test material and is unsafe for production:

```text
private seed =
9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60

public key =
d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a
```

The exact Ed25519 signature over the 243-byte `Sig_structure` is:

```text
06f2dd9ebe7b2a8a2fb82648a59fd8f4643a33ff6aee158ca392411f05d5ef26372569b97bb1179eb52bab6efc92e7e71e540879448337bb17c303dea1c0ed02
```

The canonical detached untagged `COSE_Sign1` and exact
`Claim.verification.artifact` value are 73 octets:

```text
8443a10127a0f6584006f2dd9ebe7b2a8a2fb82648a59fd8f4643a33ff6aee158ca392411f05d5ef26372569b97bb1179eb52bab6efc92e7e71e540879448337bb17c303dea1c0ed02
```

The complete verification envelope is therefore:

```text
Claim.verification = {
  profile: "urn:ve:verify:claim-body:cose-sign1-ed25519:1",
  artifact:
    h'8443a10127a0f6584006f2dd9ebe7b2a8a2fb82648a59fd8f4643a33ff6aee158ca392411f05d5ef26372569b97bb1179eb52bab6efc92e7e71e540879448337bb17c303dea1c0ed02'
}
```

The signature, artifact, public key, and external evidence are not Claim
semantic content.

## 5. Explicit local VerificationContext

The scenario supplies this local context entry:

```text
semantic issuer = "lynx-sending-participant-A"
predicate =
  h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82'
retained Predicate Schema =
  LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA Draft v0.1
profile = "urn:ve:verify:claim-body:cose-sign1-ed25519:1"
local applicability context =
  this bounded participant-level Lynx settlement Claim use
permitted verifier =
  h'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a'
```

For that exact query, VerificationContext returns the one permitted raw
32-octet key. The key does not define or equal the issuer:

```text
issuer_ref != verification-key identity
```

The context locally permits that key to authenticate Claims issued under the
semantic issuer identifier. It is not a global VE key registry, Lynx
participant registry, certificate policy, or assertion that the test key is
operationally controlled by any real organization.

## 6. Independent construction and positive verification

Implementation A uses Python and Implementation B uses JavaScript/Node. Each
starts from the semantic Claim, profile constants, and test seed. They do not
share prebuilt body, `Sig_structure`, signature, or artifact bytes. Each
independently constructs canonical CBOR and uses its own Ed25519 library.

Observed convergence:

```text
python_body_length = node_body_length = 206
python_body_bytes  = node_body_bytes  = Section 2 bytes
python_body_sha256 = node_body_sha256
python_body_sha256 =
  507b4be06e4ee9e4b5e1d827c53f6adc8be086e41819135ee8f8b65dffe55300

python_sig_structure_length = node_sig_structure_length = 243
python_sig_structure_bytes  = node_sig_structure_bytes = Section 3 bytes
python_public_key            = node_public_key = Section 4 key
python_signature             = node_signature = Section 4 signature
python_artifact_length       = node_artifact_length = 73
python_artifact_bytes        = node_artifact_bytes = Section 4 artifact
```

The exact Verify procedure produces:

1. Claim-body validation: `PASS`;
2. exact profile dispatch: `PASS`;
3. artifact parse and closed-grammar validation: `PASS`;
4. VerificationContext issuer/Predicate/profile lookup: one permitted key;
5. exact 243-byte `Sig_structure` reconstruction: `PASS`;
6. strict Ed25519 verification: `PASS`.

Final result:

```text
verification = PASS
verified_issuer_ref = "lynx-sending-participant-A"
matching_permitted_keys = [
  h'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a'
]
```

`PASS` establishes:

> The recognized semantic issuer cryptographically issued this exact
> canonical Claim.body under the supplied VerificationContext.

It does **not** establish that Lynx settled the payment, the PCRN is authentic,
the evidence belongs to this payment, the issuer is honest, the Claim is
fresh, a Rule evaluates true, or authorization is granted.

## 7. External evidence remains separate

RS-LYNX-002's illustrative evidence and correlation values remain scenario
context only:

```text
InstrId = LYNXINSTR0000001
UETR    = 123e4567-e89b-42d3-a456-426614174000
PCRN    = LVTS000000001TR1
```

They are absent from Claim.body, the `Sig_structure`, the COSE artifact, and
the signed semantic content. The scenario retains two independent questions:

| Question | Owner |
|---|---|
| Did the recognized semantic issuer sign this exact Claim? | Claim verification profile + supplied VerificationContext |
| Was settlement evidence authentic and correctly correlated? | Evidence/authentication + Adapter/correlation |

The first question can pass while the second fails.

### 7.1 False-Claim pressure test

Keep the exact conforming body, recognized issuer binding, and valid artifact,
but let an independent factual oracle establish that the payment did not
settle or that the asserted settlement evidence is false or unauthenticated.

```text
Claim verification = PASS
evidence/factual validation = FAIL / NOT ESTABLISHED
```

This is not a verification-profile defect. A signature establishes
authorship and exact-body binding, not objective truth.

### 7.2 Evidence-transplant pressure test

Keep the Claim body and valid signature for Action occurrence A, but supply
settlement evidence that actually belongs to payment or occurrence B.

```text
Claim cryptographic verification = PASS
Adapter/evidence correlation = FAIL
```

The failure is not a signature, Predicate, or Claim-body failure. The artifact
authenticates what the issuer asserted; Adapter/evidence correlation decides
whether the evidence supports the referenced occurrence.

## 8. Issuer, key, body, and profile pressure tests

Each case starts from the positive fixture and changes only the named input.
The results use the profile's existing deterministic failure taxonomy.

| ID | Mutation | Owner | Required and observed result |
|---|---|---|---|
| N1 | Replace the permitted public key with a different valid raw Ed25519 key while keeping the original signature. | Verification profile | `AUTHENTICATION_FAILED`; a permitted candidate exists but the signature equation fails. |
| N2 | Change `issuer_ref` to syntactically valid `"lynx-sending-participant-B"`, re-encode the conforming body, and provide no context entry for that issuer. | VerificationContext | `NO_APPLICABLE_VERIFIER`; no key is inferred from the signature. |
| N3 | Keep the test key known to the context but permit it only for another semantic issuer, so it is not returned for issuer A. | VerificationContext | `NO_APPLICABLE_VERIFIER`; the non-permitted key is not tested. |
| N4 | Replace the valid `action_id` with another canonical `bstr(32)` after signing while retaining all other body values and the original artifact. | Verification profile | `AUTHENTICATION_FAILED`; the changed but conforming body reconstructs a different `Sig_structure`. |
| N5 | Replace the profile identifier with `urn:ve:verify:claim-body:unknown:1`. | Verification profile dispatch | `UNSUPPORTED`; the artifact is not interpreted as this profile. |
| N6 | Replace protected bytes `a10127` with canonical `{1: -7}` bytes `a10126`. | Verification profile dispatch | `UNSUPPORTED`; a well-formed sole header selects a disallowed algorithm. |
| N7 | Alter the protected map while retaining `alg = -8`, such as by adding an unknown header. | Verification profile | `MALFORMED`; exact protected bytes and closed headers are required. |
| N8 | Embed the 206 body octets as the COSE payload instead of using `null`. | Verification profile | `MALFORMED`; this profile is detached only. |
| N9 | Flip one signature bit without changing its 64-octet width. | Verification profile | `AUTHENTICATION_FAILED`. |
| N10 | Truncate the COSE array, change its array length, add a tag, or append trailing bytes. | Verification profile | `MALFORMED`. |
| N11 | Supply a noncanonical, schema-invalid, or trailing Claim body, even if an alternate byte sequence was signed. | Claim body | `BODY_NOT_CONFORMING` before profile verification. |

N2 and N3 preserve `issuer_ref != verification-key identity`. N4 is a
conformance-preserving body-tampering test: the alternate occurrence remains
valid Claim and Predicate structure, but the old signature does not cover its
canonical body. N11 is structurally different: invalid body input never
becomes acceptable merely because it was signed.

## 9. Verification, truth, and authorization matrix

| Case | Signature/authorship | Evidence/factual basis | Resulting boundary |
|---|---|---|---|
| A | Valid | Authentic and correctly correlated | Authorship `PASS`; evidence `PASS` independently. |
| B | Valid | False, unauthenticated, or unsupported | Authorship `PASS`; evidence `FAIL`. |
| C | Invalid | Authentic and correctly correlated | Authorship `FAIL`; evidence may independently `PASS`. |
| D | Invalid | False or unauthenticated | Both fail at their respective owners. |

This matrix is analytical non-normative evidence. It introduces no combined
truth-and-signature state or new verification result.

## 10. Verification does not authorize

The positive Claim can become an eligible verified semantic input, but the
profile does not make a policy decision:

```text
Verify = PASS
does not imply
Evaluate = ALLOW
```

An applicable Rule may still deny use of the Claim based on its own governed
inputs and policy. Rule/Evaluate remains the owner of Claim selection,
applicability, policy judgment, and authorization handoff. No new Rule is
defined by this scenario.

## 11. Replay and freshness

Present the exact previously valid Claim body and artifact again while the
same VerificationContext binding remains applicable:

```text
first presentation  -> PASS
identical replay    -> PASS
```

The profile result remains `PASS` because the same immutable bytes still have
the same valid signature. Replay or freshness admission belongs downstream to
governed Claim semantics when available, VerificationContext, Rule/Evaluate,
or deployment policy. Replay is not an authentication failure, and this
scenario introduces no nonce, timestamp, expiry, replay token, mutable Claim,
or attempt primitive.

## 12. Domain-neutrality check

The Lynx Claim is an end-to-end fixture, not part of the profile mechanics.
Another canonical Claim body under another Predicate and VerificationContext
uses the same:

- profile identifier;
- external AAD;
- COSE grammar;
- exact-canonical-body signed-byte rule;
- Ed25519 acceptance predicate; and
- verification result semantics.

No Lynx identifier, settlement proposition, evidence source, participant
model, PCRN, `InstrId`, or UETR enters the profile. The profile specification's
existing non-Lynx P1/P2 vectors already exercise the same unchanged mechanism.

## 13. Twelve-case attack ownership review

| Attack | Rejecting or deciding owner | Result |
|---|---|---|
| 1. Body changed after signing, while the new body remains conforming | Verification profile | `AUTHENTICATION_FAILED` |
| 2. Signature changed | Verification profile | `AUTHENTICATION_FAILED` |
| 3. Wrong permitted key | Verification profile | `AUTHENTICATION_FAILED` |
| 4. Unrecognized issuer | VerificationContext | `NO_APPLICABLE_VERIFIER` |
| 5. Key permitted for a different issuer only | VerificationContext | `NO_APPLICABLE_VERIFIER` |
| 6. Wrong profile | Verification profile dispatch | `UNSUPPORTED` |
| 7. Malformed COSE artifact | Verification profile | `MALFORMED` |
| 8. Authentic signature over a factually false Claim | None at verification stage; factual validation | Verification `PASS`; factual validation `FAIL` |
| 9. Authentic signature over a Claim backed only by a fake or unauthenticated PCRN | Evidence/authentication | Verification `PASS`; evidence `FAIL` |
| 10. Authentic Claim with settlement evidence from another Action occurrence | Adapter/correlation | Verification may `PASS`; correlation `FAIL` |
| 11. Replay of the exact valid signed Claim | None at verification stage; downstream admission owner | Verification `PASS`; current use decided downstream |
| 12. Valid Claim verification followed by Rule denial | Rule/Evaluate | Verification `PASS`; Evaluate may return `DENY` |

The profile is the owner only when exact Claim authorship, artifact grammar,
algorithm support, or cryptographic binding fails. It does not absorb
VerificationContext, evidence, correlation, or Rule/Evaluate decisions.

## 14. Findings and candidate-gap classification

The scenario establishes:

```text
portable canonical Claim.body
+ profile-dispatched detached artifact
+ local semantic-issuer/key binding
-> independently reproducible cryptographic Claim authorship
```

It does not collapse authorship into evidence truth or authorization.

| Area | Finding |
|---|---|
| CLAIM BODY | **CLOSED FOR THIS SCENARIO.** The exact authoritative 206-byte body validates and remains the signed payload. |
| CLAIM VERIFICATION PROFILE | **CLOSED FOR THIS SCENARIO.** Python and Node converge on the exact signed structure, signature, artifact, positive result, and deterministic failure classes. |
| VERIFICATIONCONTEXT | **VERIFICATIONCONTEXT DEPENDENCY.** The explicit provisioned issuer/Predicate/profile/key binding is sufficient here. Cross-deployment discovery, rotation, revocation, and backing-store mechanics remain local or future profile/deployment work, not a missing Claim field or demonstrated architectural gap. |
| EVIDENCE/AUTHENTICATION | **EVIDENCE/AUTHENTICATION DEPENDENCY.** The Claim profile intentionally does not authenticate Lynx settlement evidence. A concrete portable source contract or profile remains separate if cross-deployment evidence verification is pursued. |
| ADAPTER/CORRELATION | **CLOSED FOR THE BOUNDED FIXTURE; EXTERNAL RESPONSIBILITY PRESERVED.** Evidence transplant is detected by the retained Adapter/evidence chain, not by signature semantics. No generic correlation primitive is required. |
| RULE/EVALUATE | **RULE/EVALUATE DEPENDENCY.** Verified Claim conversion, selection, collection ordering, applicability, and policy decision remain downstream; they do not block authorship verification. |
| EVENT/RECEIPT | **EVENT/RECEIPT DEPENDENCY / NOT EXERCISED.** This scenario creates neither an Event nor a Receipt and demonstrates no architectural gap in either. |
| ARCHITECTURAL GAP | **NONE FOUND.** Existing Claim, profile, VerificationContext, evidence, Adapter, and Rule/Evaluate ownership boundaries are sufficient. |

The next cadence step is a Gap Analysis. It must assess these results without
preselecting an evidence-source profile, VerificationContext deployment
contract, Rule/Evaluate artifact, Event/Receipt work, or no immediate
normative work.

```text
GAP ANALYSIS READY = YES
```

## 15. Architectural Decision Test and governance

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Assertion authorship, evidence truth, policy, authorization, and outcome remain distinct and inspectable. |
| Primitive burden | Pass. Existing Claim, verification envelope/profile, VerificationContext, Predicate, Adapter, and Rule/Evaluate owners suffice. |
| Removability | Pass. Removing this non-normative scenario changes no conformance rule or architecture. |
| Twenty-year durability | Pass at scenario scope. Exact canonical bytes, fixed domain separation, fixed cryptographic suite, and explicit local context preserve reproducibility without a live global registry. |
| Independent implementability | Pass. Python and Node independently construct and verify the exact body, `Sig_structure`, signature, artifact, and failure boundaries. |
| Reduced conceptual complexity | Pass. Reusing one domain-neutral profile and one local issuer/key mapping avoids evidence-specific signature semantics, embedded identity, a registry, or a combined truth/authorship primitive. |

This scenario changes no Approved specification or accepted architecture. A
missing optional evidence-source profile or deployment-specific context
mechanism does not by itself require an RFC.

```text
RFC REQUIRED = NO
```

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial non-normative scenario for reusable Claim-body authorship verification, Lynx Claim reuse, evidence/correlation separation, replay, authorization, and deterministic pressure tests. |
