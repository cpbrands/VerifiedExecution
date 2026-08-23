---
id: "PRESSURE-TEST-SIGNATURE-RECORD-VS-ENVELOPE"
title: "VE Signature Record vs Transport Envelope Pressure Test"
version: "0.1"
status: "Active"
document_type: "Pressure Test"
category: "Non-normative Validation"
author: "Verified Execution Editorial Board"
created: 2026-08-21
updated: 2026-08-21
depends_on: []
related_documents: []
supersedes: null
superseded_by: null
---
# Pressure Test — VE Signature Record vs. Transport Envelope

**Date:** 2026-08-21  
**Result:** PASS

## Verdict

VE should standardize:

1. exact Signature Binding Frame bytes;
2. Digest Reference semantics;
3. a minimal canonical VE Signature Record.

VE should not require COSE, JWS, CMS, or another external envelope as
the sole representation of a VE signature.

## Why signed bytes alone are insufficient

Portable verification also needs:

```text
signature suite
signature bytes
signer/key reference
Digest Reference
record version
```

If these live only in transport-specific envelopes, independent VE
implementations require envelope-specific adapters before verification.

## Why mandatory COSE is too strong

RFC 9052 signatures authenticate a COSE Sig_structure containing
context, protected headers, external AAD, and payload.

COSE therefore adds authenticated semantics beyond packaging.

VE should not make those semantics part of the definition of a VE
signature unless an explicit future VE signature suite chooses to.

RFC 9052 also deliberately leaves digest structures to application
protocols, supporting VE defining its own Digest Reference.

## Minimal VE Signature Record

Candidate:

```text
{
  record_version,
  object_type,
  representation_profile,
  digest_reference,
  signature_suite,
  signer_reference,
  signature_bytes
}
```

The signature authenticates the VE Signature Binding Frame.

The record does not establish approval or signer authority.

## Transport

The canonical record may be carried bare, inside COSE, inside HTTP,
inside databases, or inside other protocols.

Transport wrapping does not alter inner VE signature semantics.

## Multi-party semantics

Multiple signatures are multiple Signature Records.

Threshold approval or delegation semantics remain Claims/Rules/Evaluate,
not signature-envelope semantics.

## Conclusion

Standardize the cryptographic core and its portable result.

Keep transport envelopes removable.
