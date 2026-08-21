# Pressure Test — Streaming Profile-1 Verification

**Date:** 2026-08-20  
**Result:** PASS

## Verdict

VE Canonical Representation Profile 1 can be canonicality-checked,
resource-checked, and cryptographically hashed in a single forward pass
without materializing the entire object.

The verifier requires bounded working state determined by Profile-1
limits.

## Streaming verifier

```text
input
  |
  +-- resource counters
  +-- strict CBOR/Profile-1 parser
  +-- canonicality validator
  +-- hash state
  +-- optional schema callbacks
```

## Duplicate keys

Because canonical map keys must be strictly increasing in deterministic
encoded-byte order, duplicate keys are adjacent.

A verifier only needs the previous encoded key for each currently open
map.

No global set/hash table of all map keys is required.

Worst-case key memory is bounded by:

```text
MAX_DEPTH × MAX_MAP_KEY_BYTES
```

## Hashing

Digest computation is streaming and requires fixed-size hash state.

No canonical re-encoding pass is required because verification operates
on the original bytes.

## Resource limits

Definite-length CBOR headers allow the verifier to reject oversized
strings, arrays, and maps before materializing their contents.

Depth and total-byte limits are incrementally enforceable.

## Text

UTF-8 validity can be checked incrementally.

Only map keys need bounded buffering for ordering comparison.

## Integer / Decimal

Bignum rules can be validated from length, leading bytes, and bounded
streaming numeric state.

Decimal canonicality can be checked without materializing the full
coefficient by computing divisibility/modulo state while reading bignum
bytes.

## Higher semantic layers

Representation verification is distinct from semantic validation.

A schema or Rule may require retaining selected values, but Profile-1
canonicality itself does not require a full object tree.

## Failure safety

Partially parsed data must not produce authoritative effects.

Authoritative consumption occurs only after the relevant object passes
canonicality and required validation.

## Conclusion

Profile 1 is compatible with streaming Execution Boundaries and
constrained gateways.

The architecture no longer has a whole-object materialization
dependency.
