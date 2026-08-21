# Pressure Test — Minimum VE Signature Record

**Date:** 2026-08-21  
**Result:** PASS

## Verdict

Replace `signer_reference` with:

```text
verification_material_reference
```

The Signature Record should identify exact cryptographic verification
material, not a person, organization, DID, credential subject, or generic
identity principal.

## Minimum schema

```text
SignatureRecord := {
    signed_object_reference,
    signature_suite,
    verification_material_reference,
    signature_bytes
}
```

where:

```text
signed_object_reference := {
    object_type,
    representation_profile,
    digest_reference
}
```

## Why

The signature layer only needs to answer:

> Which exact verification material validates this signature?

Claims and Trust Context answer:

> Who controls that material?  
> What identity does it represent?  
> Is it delegated?  
> Is it revoked?  
> What authority does it carry?

This keeps VE from becoming an identity provider.

## Discovery identifiers

Values such as `kid`, URI, DID URL, certificate locator, or local alias
may assist retrieval, but are non-authoritative hints.

The resolved material must match the normative content-addressed
verification-material reference.

## Key rotation

Old signatures remain bound to old material; new signatures bind new
material. Claims / Trust Context history determines validity over time.

## Conclusion

```text
SignatureRecord -> verification material

Claims + Trust Context -> meaning and authority of that material
```
