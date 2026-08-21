# Pressure Test — Shared Canonical Representation Layer

**Date:** 2026-08-20  
**Result:** PASS

## Question

Can one canonical encoding profile safely canonicalize Action schemas,
Action payloads, Claims, Rules, Receipts, and Trust Context history, or
do different protocol object classes require separate profiles over one
common canonical data model?

## Verdict

Use one shared **VE Canonical Representation Layer** consisting of:

1. a small canonical structural data model;
2. one versioned deterministic byte encoding;
3. object-specific schemas and digest inputs;
4. object-specific domain separation.

Do not create a different serializer for every VE object class.

## Architecture

```text
Object semantics
      |
      v
Common canonical data model
      |
      v
Versioned canonical byte encoding
      |
      v
Object-specific domain separator
      |
      v
Digest / signature / commitment
```

## Why this works

Actions, Claims, Receipts, schema descriptors, and trust-transition
records are structurally representable without embedding their semantic
meaning in the encoder.

The encoder only needs deterministic primitive types and containers.

Object specifications remain responsible for field meaning,
requiredness, validation, and digest scope.

## Rule exception

Executable Rule logic must not force the common representation layer to
canonicalize arbitrary programming-language source code.

A Rule should use either:

- a canonical declarative Rule representation; or
- a digest/reference to a separately specified deterministic Rule
  artifact format.

## Schema bootstrap

`schema_digest` is computed from the canonical schema descriptor body
using the same representation layer.

The descriptor body should not include its own digest in the bytes being
hashed.

## Domain separation

Shared encoding does not mean shared cryptographic type identity.

Each object type requires explicit domain separation, for example:

```text
VE:ACTION
VE:CLAIM
VE:RULE
VE:RECEIPT
VE:TRUST_TRANSITION
VE:SCHEMA
```

## Result

A single shared representation layer reduces conceptual complexity,
implementation variance, parser surface, and long-term migration cost.

Separate encodings should require explicit architectural justification.
