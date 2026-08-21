# Pressure Test — VE Canonical Resource Bounds

**Date:** 2026-08-20  
**Result:** PASS

## Verdict

VE requires a universal finite resource envelope at the Canonical
Representation Profile layer.

Resource limits are not Action/Claim/Receipt semantic fields.

Three kinds of limits must remain distinct:

```text
1. Canonical Representation Profile bounds
2. Object-schema semantic bounds
3. Local deployment quotas
```

Only the first two determine protocol validity.

## Required Profile-1 bound classes

Profile 1 should define finite maxima for:

```text
top-level encoded bytes
nesting depth
text-string bytes
byte-string bytes
array elements
map entries
map-key bytes
Integer magnitude
Decimal coefficient magnitude
Decimal exponent magnitude
```

A value exceeding these is out of Profile 1.

## Why implementation-specific validity limits fail

If one implementation declares a canonical 4096-bit Integer invalid
while another accepts it under the same claimed profile, the profile no
longer defines one interoperable acceptance domain.

Full Profile-1 conformance therefore requires support for all in-profile
values through the normative bounds.

## Local quotas

A deployment may still refuse an otherwise valid object because of local
capacity, rate, tenant, or risk constraints.

Such refusal must be represented as a capacity/policy outcome rather
than as malformed or noncanonical encoding.

## Why byte size alone is insufficient

Very small encodings can still create pathological work, especially:

- huge Decimal exponents;
- arbitrary-precision arithmetic;
- deep nesting;
- very high collection counts.

Profile 1 therefore needs structural and numeric complexity bounds in
addition to total bytes.

## Versioning

The resource envelope is part of the representation profile contract.

Different universal bounds require a different profile/version, not
per-message negotiation under the same profile identifier.

## Exact values

This pressure test does not select exact numeric maxima.

Those should follow implementation benchmarks, constrained-device
analysis, cross-language library review, and denial-of-service testing.

## Conclusion

Universal profile bounds preserve interoperable validity.

Schema bounds preserve object-specific semantics.

Local quotas preserve deployment sovereignty.

These layers must not be collapsed.
