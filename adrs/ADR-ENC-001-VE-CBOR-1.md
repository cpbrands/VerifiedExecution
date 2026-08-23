---
id: "ADR-ENC-001"
title: "VE Canonical Serialization Profile"
version: "0.1"
status: "Accepted"
document_type: "Architectural Decision Record"
category: "Protocol"
author: "Verified Execution Editorial Board"
created: 2026-08-21
updated: 2026-08-22
depends_on: []
related_documents: []
supersedes: null
superseded_by: null
---
# ADR-ENC-001 — VE Canonical Serialization Profile

**Status:** Accepted — narrow VE Kernel Protocol v0.1 scope  
**Accepted:** 2026-08-22  
**Scope:** This decision applies only to canonical encoding of byte-sensitive VE Kernel Protocol v0.1 objects. It does not by itself define every future VE representation profile.  
**Decision:** Adopt `VE-CBOR-1`, a strict deterministic CBOR profile based on RFC 8949 Core Deterministic Encoding.

## Decision

All VE kernel objects whose identity, digest, signature, or reproducibility depends on their bytes MUST be encoded using `VE-CBOR-1`.

`VE-CBOR-1` requirements:

1. Encoding MUST satisfy RFC 8949 Core Deterministic Encoding requirements.
2. Indefinite-length items MUST NOT be emitted or accepted.
3. Integers and lengths MUST use their shortest valid CBOR encoding.
4. Map keys MUST be sorted by bytewise lexicographic order of their deterministic CBOR encodings.
5. Duplicate map keys MUST NOT be emitted and MUST be rejected.
6. All map keys MUST be text strings.
7. All text strings MUST be valid UTF-8 and Unicode NFC. Non-NFC text MUST be rejected rather than silently normalized.
8. Floating-point values MUST NOT appear in VE Kernel Protocol v0.1 canonical objects.
9. Decision-relevant fractional quantities MUST use exact integer representations with an explicit scale/unit defined by the relevant schema (for example, 0.73 expressed as 7300 basis points where the schema defines basis points).
10. CBOR semantic tags MUST NOT appear in VE Kernel Protocol v0.1 canonical objects unless a later VE profile explicitly standardizes them.
11. Canonical bytes are the bytes over which VE content digests and signatures are computed.
12. A decoder processing a canonical VE object MUST reject a non-conforming encoding rather than re-encode it and treat it as canonical.

## Rationale

VE requires independent implementations to produce identical bytes for the same canonical protocol object. CBOR natively represents byte strings, is compact, has an IETF deterministic encoding foundation, and avoids JSON-specific base64 and number-representation complications.

VE v0.1 intentionally excludes floating point to avoid multiple numeric representations and cross-platform floating-point edge cases. Exact quantities remain representable using integers plus schema-defined scale/unit.

VE does not normatively depend on the current dCBOR Internet-Draft; VE-CBOR-1 borrows useful restrictions such as duplicate-key rejection and NFC text while anchoring its base requirements in RFC 8949.

## Consequences

- Action, Claim, Rule, and content-bound Reference objects can have stable cross-implementation digests.
- All protocol schemas must define exact field/value types.
- Fractional domain values require exact scaled-integer schemas in v0.1.
- Future protocol versions may define additional canonical numeric/tag profiles without changing the semantic kernel.
