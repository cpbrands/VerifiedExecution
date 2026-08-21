# Pressure Test — Exactly-One-Byte VE CBOR Profile

**Date:** 2026-08-20  
**Result:** PASS

## Verdict

A constrained RFC 8949 CBOR profile can guarantee exactly one legal byte
representation for every value in the current VE canonical data model.

RFC 8949 core deterministic encoding is the base, but VE must add strict
profile rules and reject all alternate encodings.

## Profile 1 candidate

Allowed VE semantic values:

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

Allowed CBOR semantic tags:

```text
2  positive bignum
3  negative bignum
4  decimal fraction
```

Forbidden:

```text
floating point
undefined
arbitrary simple values
indefinite-length items
arbitrary tags
non-text map keys
duplicate map keys
non-preferred integer/length encodings
trailing bytes
invalid UTF-8
```

## Integer

- shortest direct major-type encoding where possible;
- tags 2/3 only outside the direct integer range;
- no leading zero bytes;
- zero never encoded as bignum.

## Decimal

Use tag 4:

```text
[exponent, coefficient]
```

Normalize nonzero values by removing all factors of 10 from the
coefficient and increasing the exponent accordingly.

Canonical zero:

```text
[0, 0]
```

Thus Decimal 1.0, 1.00, 10e-1, and 100e-2 all encode as the same Decimal
value, while Integer 1 remains a different type.

## Text

VE Text is the exact Unicode scalar sequence.

Encode as valid UTF-8 with no representation-layer Unicode
normalization.

Any NFC/case/identifier normalization belongs to the schema before
canonical encoding.

## Map

- text keys only;
- unique keys;
- duplicate-key rejection;
- bytewise lexicographic ordering by deterministic encoded key bytes;
- definite length only.

## Verification

Canonicality applies to the original bytes.

A verifier must not accept noncanonical CBOR, decode it, re-encode it,
and then pretend the original bytes were canonical.

Imported noncanonical data may be transformed into a new canonical VE
object before authoritative acceptance.

## Conclusion

No custom VE binary encoding is currently justified.

The next remaining issues are implementation/resource bounds for large
integers and Decimals and normalization rules for schema-defined
identifiers.
