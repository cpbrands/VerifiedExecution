# VE Kernel Protocol v0.1 — VERIFY-002 Resolution Patch

## Resolved structure

Replace provisional `verification_material` with:

```text
verification = {
  profile : tstr,
  artifact : bstr
}
```

VE core defines no crypto-specific key ontology.

### v0.1 profiles

`urn:ve:verify:cose-sign1-detached:1`
- `artifact` = detached `COSE_Sign1`
- payload = canonical `VE-CBOR-1(Claim.body)`
- external AAD = UTF-8 `VE-KERNEL-CLAIM-V1`
- `alg` MUST be protected
- `kid`, if present, MUST be protected

`urn:ve:verify:cose-sign-detached:1`
- same payload/domain-separation rules
- `artifact` = detached `COSE_Sign`

### Key resolution

Keys/verifiers come from `VerificationContext`, not from VE Claim fields. Context may be backed by COSE_Key, JWK/JWKS, X.509/PKIX, enterprise registries, or hardware roots.

### Threshold/group keys

- one aggregate/group signature -> one Sign1 artifact when supported
- multiple independent signatures -> COSE_Sign
- unsupported family -> new verification profile

### Decision status

- VERIFY-002: RESOLVED
- VERIFY-003 key discovery: narrowed to VerificationContext/profile work
- VERIFY-001 mandatory-to-implement algorithms: OPEN
- VERIFY-004 revocation: OPEN
