# Pressure Test — Minimum VE Canonical Data Model

**Date:** 2026-08-20  
**Result:** PASS

## Minimum model

```text
null
boolean
integer
decimal
text
bytes
array
map<text, value>
```

## Excluded from initial model

```text
generic floating point
generic timestamp
open-ended tagged values
undefined
arbitrary simple values
non-text map keys
```

## Key distinctions

- Absence is structural and differs from explicit `null`.
- Time semantics belong to schemas, not one universal timestamp type.
- Decimal is exact and distinct from binary floating point.
- Generic floating point is excluded from cryptographic identity.
- Byte strings are native; binary data is not forced through base64 text.
- Maps are text-keyed in the current candidate model.

## Standards implication

JSON/JCS provides deterministic JSON but its number model is tied to
IEEE-754 double-precision semantics and non-JSON-native values such as
large exact numbers, precise decimal quantities, binary data, and time
need string/schema conventions.

RFC 8949 CBOR provides native integers, bytes, text, arrays, maps, tags,
and deterministic-encoding requirements.

The strongest current candidate is therefore:

> **A tightly constrained deterministic CBOR profile implementing the
> smaller VE canonical value model.**

The profile should forbid generic floating point, arbitrary tags,
indefinite-length values, non-text map keys, and undefined/simple-value
extensions unless separately justified.

## Next attack

Can deterministic CBOR be constrained strongly enough that each VE
canonical value has exactly one allowed byte representation, including
decimal normalization, map ordering, text treatment, and rejection of
non-profile CBOR?
