# Pressure Test — VE Cryptographic Framing

**Date:** 2026-08-20  
**Result:** PASS

## Verdict

Use two typed framing layers:

```text
canonical object
    -> VE Hash Frame v1
    -> algorithm-tagged Digest Reference
    -> VE Signature Binding Frame v1
    -> signature
```

## Object Digest Frame

```text
magic[4]                  = "VEH1"
frame_version[1]          = 0x01
purpose[1]                = OBJECT_DIGEST
object_type[2]            = fixed-width identifier
representation_profile[2] = fixed-width identifier
hash_suite[2]             = fixed-width identifier
canonical_object_body     = exactly one Profile-1 canonical CBOR item
```

The header is fixed length.

The body does not need a byte-length prefix because CBOR is
self-delimiting and Profile 1 allows exactly one top-level item with no
trailing bytes.

This preserves one-pass hashing.

## Digest Reference

A digest is not bare bytes.

It carries:

```text
hash_suite
digest_bytes
```

The hash suite is also inside the hash-frame preimage, preventing silent
algorithm relabeling.

## Signature Binding Frame

Sign the Digest Reference rather than streaming the full object into the
signature mechanism again.

Candidate framing:

```text
magic[4]                  = "VES1"
frame_version[1]          = 0x01
purpose[1]                = OBJECT_DIGEST_SIGNATURE
object_type[2]
representation_profile[2]
signature_suite[2]
digest_suite[2]
digest_bytes
```

The signature suite is independent of the digest suite.

## Semantic roles

A bare signature over an Action does not automatically mean approval.

Approval should be represented as a Claim containing the appropriate
Action content/occurrence binding and then signing the Claim.

## Why not COSE as object identity

COSE provides useful precedent for explicit signing contexts and may be
used later as a signature envelope.

VE object digest identity should remain independent of COSE so unsigned
objects have identity, large objects are hashed once, and multiple
signature envelopes/suites can authenticate one Digest Reference.

## Standards basis

RFC 9380's domain-separation analysis requires distinct logical contexts
to map injectively to distinct hash inputs and illustrates why raw
variable-length concatenation is unsafe.

RFC 8949 provides self-delimiting CBOR, enabling a fixed header followed
by one canonical object without a body-length prefix.

RFC 9052 COSE demonstrates explicit signature context separation through
structured signing inputs.

## Conclusion

No raw concatenation.

No implicit object type.

No implicit representation profile.

No eternal implicit hash algorithm.

No rehashing large objects for every signature.

One canonical object identity can be authenticated by multiple signature
suites over time.
