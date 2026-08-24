---
id: PRESSURE-TEST-REFERENCE-MINIMUM
title: Minimum Portable Content-Bound Reference
version: 0.1
status: Draft
document_type: Pressure Test
category: Protocol Reference Semantics
author: Verified Execution Editorial Board
created: 2026-08-23
updated: 2026-08-23
depends_on: []
related_documents:
  - RFC-005
  - VE-001
maturity: Non-normative Validation
supersedes: null
superseded_by: null
---

# Pressure Test — Minimum Portable Content-Bound Reference

## Question

Is:

```text
{digest_suite, digest_bytes}
```

sufficient as a portable content-bound `Reference`, or must a portable
reference also bind object type and representation profile?

## Result

**PASS — distinguish `DigestReference` from `ObjectReference`.**

The minimum portable digest result is:

```text
DigestReference := {
    digest_suite,
    digest_bytes
}
```

The minimum portable content-bound object reference is:

```text
ObjectReference := {
    object_type,
    representation_profile,
    digest_reference
}
```

or equivalently, in flattened form:

```text
{
    object_type,
    representation_profile,
    digest_suite,
    digest_bytes
}
```

These structures serve different purposes and MUST NOT be conflated.

## 1. DigestReference answers only one question

A `DigestReference` answers:

> Which digest result, under which digest suite?

It does not independently answer:

> What VE object class was hashed?

or:

> Under which canonical representation profile was the object encoded?

Those values already participate in the typed VE Hash Frame proposed by
RFC-005.

Therefore they are part of the cryptographic context needed to
reconstruct or independently verify the object identity.

## 2. Cross-object ambiguity

Suppose two digest calculations produce the same byte string under the
same digest suite for different typed preimages:

```text
ACTION_CONTENT under Profile 1
RECEIPT under Profile 1
```

The hash-frame object type makes those preimages distinct.

But a bare:

```text
{digest_suite, digest_bytes}
```

does not carry the object-type context needed to know which typed digest
the reference claims to name.

Collision resistance makes accidental equality negligible, but protocol
interpretation must not rely on a verifier guessing the missing type.

A portable reference must be self-describing enough to reconstruct its
typed verification context.

## 3. Representation-profile ambiguity

The VE Hash Frame binds:

```text
representation_profile
```

because the same semantic object encoded under different representation
profiles may have different canonical bytes and therefore different
cryptographic identities.

A bare DigestReference does not state which profile produced the digest.

If the profile must be supplied out-of-band, the reference is not
portable across:

- historical profile upgrades;
- mixed-profile stores;
- disconnected/offline verification;
- cross-protocol transport;
- long-lived receipts or trust history.

Therefore `representation_profile` belongs in the portable object
reference.

## 4. Why not put object type/profile inside DigestReference?

Because `DigestReference` has a useful smaller meaning:

```text
digest suite + digest bytes
```

It can be reused wherever a protocol needs to refer to a digest result
without asserting what object class it names.

Expanding it would collapse:

```text
digest identity
```

and:

```text
typed VE object identity
```

into one overloaded structure.

The cleaner composition is:

```text
ObjectReference
    |
    +-- object_type
    +-- representation_profile
    +-- DigestReference
```

## 5. Why field context is not sufficient

A field named:

```text
schema_digest
```

might imply:

```text
object_type = SCHEMA_DESCRIPTOR
```

to a human reader.

But portable cryptographic references should not depend on the enclosing
field name to reconstruct their identity context.

That approach fails when the same reference is:

- copied into another object;
- stored independently;
- transported outside its original schema;
- indexed in a content-addressed store;
- signed or attested separately.

The portable reference should carry its own typed context.

## 6. Why protocol-version inference is not sufficient

A protocol version might imply one representation profile today.

But long-lived VE histories may contain objects created under multiple
profiles.

If the profile is omitted from the reference and inferred from current
protocol state, historical verification can become ambiguous.

Therefore the reference must bind the profile explicitly.

## 7. What ObjectReference does not mean

`ObjectReference` does not establish:

- authority;
- trust;
- semantic validity;
- ownership;
- signer identity;
- execution;
- commit.

It says only:

> This digest names an object of this VE cryptographic object class,
> encoded under this representation profile.

## 8. Schema-reference consequence

VE-001 currently uses the field name:

```text
schema_digest
```

The pressure test indicates that a portable canonical representation
should ultimately carry a typed object reference to the schema
descriptor rather than untyped digest bytes.

Conceptually:

```text
schema_reference := ObjectReference {
    object_type = SCHEMA_DESCRIPTOR,
    representation_profile = ...,
    digest_reference = ...
}
```

Whether VE-001 should rename the semantic field from `schema_digest` to
`schema_reference` is a separate normative specification question and
MUST NOT be changed silently by VE-007.

## 9. VE-007 consequence

Once RFC-005 accepts `ObjectReference`, VE-007 can define the exact
VE-CBOR-1 byte representation of that structure.

VE-007 should not decide the semantic need for `object_type` or
`representation_profile`; it should only encode the accepted structure.

## 10. Architectural Decision Test

1. **Consistency:** PASS.
2. **New primitive:** none; `ObjectReference` is protocol reference
   machinery.
3. **Removability:** removing `object_type` or `representation_profile`
   makes portable reconstruction depend on external context.
4. **Twenty-year test:** PASS; typed content-addressed references are
   representation- and algorithm-agile.
5. **Independent implementation:** PASS.
6. **Complexity:** PASS; composition keeps digest identity separate from
   object identity.

## Conclusion

> **`{digest_suite, digest_bytes}` is sufficient for a
> `DigestReference`, but insufficient for a portable content-bound VE
> object reference.**

The minimum portable object reference is:

```text
ObjectReference := {
    object_type,
    representation_profile,
    digest_reference
}
```

No more semantic fields are justified at this layer.

