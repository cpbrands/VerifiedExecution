---
id: RFC-005
title: Canonical Representation, Digest Framing, and Portable Signature Records
version: 0.1
status: Draft
document_type: RFC
category: Protocol
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-08-24
depends_on:
  - ADR-ENC-001
  - ADR-VERIFY-002
  - VE-001
related_documents:
  - KERNEL-VALIDATION
  - SPECIFICATION-TASKS
  - RFC-006
supersedes: null
superseded_by: null
---

# RFC-005 — Canonical Representation, Digest Framing, and Portable Signature Records

## 1. Status and scope

This RFC is Draft. It defines one coherent decision surface for byte identity and signature portability. It does not yet select exact Profile-1 resource bounds, mandatory digest/signature suites, or the final representation of verification material.

## 2. Problem

VE requires independent implementations to agree on:

1. which bytes represent an object;
2. which object type and representation profile those bytes belong to;
3. how digest algorithms remain explicit and replaceable;
4. what exact bytes a signature authenticates;
5. how a portable signature identifies verification material without becoming an identity system;
6. how COSE and other envelopes remain optional without changing VE signature meaning.

Separate uncoordinated answers create cross-type substitution, concatenation ambiguity, algorithm confusion, rehashing, and transport-dependent semantics.

## 3. Proposed architecture

```text
canonical VE object
    ↓
VE Hash Frame v1
    ↓
Digest Reference
    ↓
VE Signature Binding Frame v1
    ↓
signature suite
    ↓
Signature Record
    ↓
optional transport or verification profile
```

## 4. Canonical Representation Profile 1

Profile 1 SHALL build on VE-CBOR-1 and define:

- exactly one top-level deterministic CBOR item;
- no trailing bytes;
- duplicate-key rejection;
- strictly ordered text map keys;
- definite lengths;
- UTF-8 and Unicode rules;
- permitted numeric representation;
- closed semantic-tag policy;
- universal finite bounds for bytes, depth, collections, keys, and numeric complexity;
- streaming canonicality verification;
- failure before authoritative consumption.

Exact numeric limits remain open pending implementation benchmarks, constrained-device analysis, and denial-of-service testing.

## 5. VE Hash Frame v1

The digest preimage SHALL use a fixed typed header followed by exactly one Profile-1 object:

```text
magic
frame_version
purpose
object_type
representation_profile
digest_suite
canonical_object_body
```

Raw variable-length concatenation is prohibited. Object type, representation profile, and digest suite are cryptographically bound.

## 6. Digest Reference

A Digest Reference contains at least:

```text
digest_suite
digest_bytes
```

Digest bytes without their suite are not a portable VE object reference.

## 7. ObjectReference

Required portable candidate form

```text
ObjectReference := {
  object_type,
  representation_profile,
  digest_reference
}
```

Within this Draft RFC, every portable reference to a VE cryptographic
object MUST use this structure. A bare `DigestReference` identifies only
a digest result; it is not sufficient to identify a typed VE object
across representation profiles.

`ObjectReference` is reusable protocol structure embedded within a
containing VE protocol object. It is not a first-class hashable VE object
and MUST NOT have its own cryptographic object type or independent
digest in the initial architecture.

Structural equality of its canonical components is sufficient for lookup,
deduplication, comparison, indexing, and inclusion in a signed or hashed
enclosing object. An implementation MAY compute local cache hashes, but
those hashes are not VE protocol identities.

This exclusion MAY be reconsidered only if a future reference scenario
demonstrates a requirement that cannot be satisfied by an embedded
`ObjectReference` and the digest or signature of an enclosing semantic
object.

### Draft disposition and remaining work

The Draft RFC proposes that `DigestReference` identifies a digest result,
while `ObjectReference` identifies a portable typed VE object. The
proposal is supported by validation evidence, but remains
non-authoritative until RFC-005 is accepted.

REF-001 remains partially resolved: exact object-type,
representation-profile, and suite identifiers/registries, as well as
cross-language canonicalization and verification vectors, remain open
RFC-005 work.

## 8. VE-001 impact

If RFC-005 is ultimately accepted, the portable schema reference in a
future VE-001 revision MUST change as follows:

``` text
schema_digest
   ↓
schema_reference : ObjectReference
```

For an Action schema, `schema_reference.object_type` MUST identify the
schema-descriptor object class, and `schema_reference` MUST explicitly
carry its representation profile and Digest Reference.

This is a semantic type change to VE-001. It requires normal change
control and a VE-001 v0.3 revision only after RFC-005 is accepted; this
Draft RFC does not modify VE-001.

VE-007 remains Draft and blocked on this accepted semantic contract.
VE-007 MUST NOT encode `schema_digest` by inventing implicit object-type
or representation-profile semantics from a field name, enclosing
context, or current protocol version.

## 9. Signature Binding Frame v1

The signature input SHALL bind:

```text
magic
frame_version
purpose
object_type
representation_profile
signature_suite
digest_suite
digest_bytes
```

The signature suite is independent of the digest suite. A signature authenticates the binding frame, not an ambiguous bare digest.

## 10. Minimum Signature Record

Candidate semantic components:

```text
SignatureRecord := {
  signed_object_reference,
  signature_suite,
  verification_material_reference,
  signature_bytes
}
```

The record establishes neither signer identity nor authority. Claims and the applicable Trust Context establish who controls verification material and what authority, delegation, or revocation semantics apply.

Discovery identifiers such as `kid`, URI, DID URL, or certificate locator are non-authoritative retrieval hints unless independently bound by the applicable profile.

## 11. Optional COSE profiles

COSE_Sign1 and COSE_Sign MAY be registered as optional verification or transport profiles. COSE MUST NOT become the sole VE Signature Record representation.

An optional profile MUST specify whether COSE authenticates the VE Signature Binding Frame or wraps an already complete Signature Record. Transport AAD or headers MUST NOT silently change the meaning of the inner VE signature.

## 12. Streaming and resource safety

Canonicality checking, duplicate-key detection, resource enforcement, and digest computation SHALL be possible in one forward pass with working memory bounded by the profile limits. Partial parsing MUST NOT authorize partial effects.

## 13. Non-goals

RFC-005 does not:

- define identity;
- select resource root authorities;
- define approval semantics;
- make a bare signature authorization;
- standardize every cryptographic algorithm;
- require COSE, JWS, CMS, or another external envelope universally;
- promote Signature Record into a semantic kernel primitive.

## 14. Open decisions

- exact Profile-1 bounds;
- initial mandatory digest suite;
- initial mandatory signature suite, if any;
- exact object-type/profile/suite identifier widths and registries;
- verification-material representation;
- whether embedded verification material is permitted;
- whether ObjectReference and SignatureRecord have their own object identities;
- exact COSE adapter-profile construction.

These remain architectural/protocol decisions, not routine specification tasks, until resolved through this RFC.

## 15. Acceptance gates

RFC-005 MUST NOT advance to Accepted until:

1. two independent prototype implementations produce identical bytes and digests;
2. streaming validation is demonstrated under the selected bounds;
3. malformed, duplicate-key, cross-type, relabeling, and resource-exhaustion vectors are published;
4. at least one native Signature Record and one optional COSE profile interoperate;
5. all open decisions above have explicit dispositions;
6. the Architectural Decision Test is completed;
7. an ADR and target specification/version plan are prepared.
