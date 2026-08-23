---
id: "ADR-VERIFY-002"
title: "Claim Verification Envelope"
version: "0.1"
status: "Accepted"
document_type: "Architectural Decision Record"
category: "Verification"
author: "Verified Execution Editorial Board"
created: 2026-08-21
updated: 2026-08-22
depends_on: []
related_documents: []
supersedes: null
superseded_by: null
---
# ADR-VERIFY-002 — Claim Verification Envelope

**Status:** Accepted — profile-limited  
**Accepted:** 2026-08-22  
**Scope:** COSE profiles are optional verification profiles. They are not the sole or canonical VE signature representation.  
**Decision:** `Claim.verification` is a minimal profile-dispatched verification envelope. VE does not embed or define a universal key ontology.

## Normative structure

```text
Claim {
  body
  verification
}
```

```text
verification = {
  profile : tstr,
  artifact : bstr
}
```

`body` contains all semantic Claim fields. `verification` MUST NOT alter the semantic assertion.

### profile
A namespaced identifier defining the complete verification procedure and artifact format.

Examples:
- `urn:ve:verify:cose-sign1-detached:1`
- `urn:ve:verify:cose-sign-detached:1`

The profile defines artifact syntax, payload construction, algorithm interpretation, verifier selection, verification procedure, and error semantics.

### artifact
Opaque bytes interpreted only according to `profile`.

VE core MUST NOT define algorithm-, curve-, key-, certificate-, threshold-, group-, or post-quantum-specific fields in `Claim.verification`.

## Optional COSE profiles

For `urn:ve:verify:cose-sign1-detached:1`:

1. `artifact` MUST be a complete detached-payload `COSE_Sign1` object.
2. COSE payload MUST be `nil`.
3. Detached payload MUST be the exact `VE-CBOR-1` canonical encoding of `Claim.body`.
4. COSE `external_aad` MUST equal UTF-8 bytes of `VE-KERNEL-CLAIM-V1`.
5. COSE `alg` MUST be in protected headers.
6. `kid`, if present, MUST be in protected headers.
7. Any header affecting VE verification semantics MUST be protected.
8. Unprotected headers MUST NOT affect VE verification validity or issuer binding.
9. COSE algorithm identifiers use the IANA COSE Algorithms registry.
10. Key material MUST NOT be embedded in the VE verification envelope.
11. Successful signature verification MUST NOT by itself establish Policy acceptance of the issuer.

## Multiple signatures

For `urn:ve:verify:cose-sign-detached:1`, `artifact` is a detached-payload `COSE_Sign` over the same canonical `Claim.body` and same external AAD.

## Threshold/group signatures

If a threshold/group system produces one signature verifiable under a single group public key, VE treats it as one signature when the selected COSE algorithm supports it.

VE MUST NOT model threshold participants, quorum composition, secret-share topology, or the distributed signing protocol.

If a scheme cannot be represented by an existing COSE signing structure/algorithm, it requires a new verification profile, not a change to `Claim.verification`.

## Post-quantum agility

VE does not enumerate PQ algorithms in the Claim schema. COSE algorithm agility handles new algorithms. The IANA COSE registry now includes ML-DSA entries and an Algorithm Key Pair key type.

## VerificationContext

Conceptually:

```text
Verify(Claim, VerificationContext) -> VerificationResult
```

`VerificationContext` is not embedded in the Claim and is not a new VE semantic primitive.

For COSE profiles, it supplies or resolves a verifier/key already bound to `Claim.body.issuer_ref`. The backing system may use COSE_Key, JWK/JWKS, X.509/PKIX, enterprise registries, hardware roots, or other profile-defined sources.

The verifier MUST NOT infer semantic issuer identity solely from an arbitrary public key. The context must establish the binding between `issuer_ref` and the verifier/key.

## Portable claims

A Claim intended for cross-implementation verification MUST carry a portable verification artifact.

A fact learned only through a live authenticated API is not independently portable after that session. An adapter MAY issue a new signed VE Claim describing what it observed.

## Security invariants

- Verification proves provenance/integrity under a verification context; it does not prove objective truth.
- Verification MUST bind to the exact canonical Claim body.
- Verification artifacts MUST be domain-separated from signatures used by other protocols.
- Unsupported profile or algorithm MUST fail verification.
- A verified Claim MUST NOT automatically satisfy a Rule; issuer acceptability remains an Evaluate/governance question.
