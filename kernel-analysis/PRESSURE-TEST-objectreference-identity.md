---
id: PRESSURE-TEST-OBJECTREFERENCE-IDENTITY
title: ObjectReference Identity and Recursion
version: 0.1
status: Draft
document_type: Pressure Test
category: Protocol Reference Semantics
author: Verified Execution Editorial Board
created: 2026-08-24
updated: 2026-08-24
depends_on: []
related_documents:
  - RFC-005
  - VE-001
maturity: Non-normative Validation
supersedes: null
superseded_by: null
---

# Pressure Test — Should ObjectReference Be a First-Class Hashable VE Object?

## Question

Does `ObjectReference` need its own cryptographic object type and digest,
or should it remain an embedded canonical structural value?

## Result

**PASS FOR EXCLUSION — `ObjectReference` should remain an embedded
canonical structural value and should not receive its own cryptographic
object type in the initial architecture.**

The minimum structure remains:

```text
ObjectReference := {
    object_type,
    representation_profile,
    digest_reference
}
```

with:

```text
DigestReference := {
    digest_suite,
    digest_bytes
}
```

An ObjectReference identifies another VE cryptographic object. It does
not itself need a second independent identity merely because it can be
serialized canonically.

## 1. Removability test

Assume `ObjectReference` is not hashable as its own VE object.

VE can still:

- include ObjectReference inside Claims;
- include ObjectReference inside Receipts;
- include ObjectReference inside Signature Records;
- store ObjectReference values;
- compare ObjectReference values structurally;
- transmit them canonically;
- sign an enclosing object that contains them;
- commit to them through the digest of an enclosing object.

No existing reference use case disappears.

Therefore a separate `OBJECT_REFERENCE` cryptographic object type is
removable without loss of architecture.

## 2. What first-class identity would add

If ObjectReference received its own object type:

```text
ObjectReference R
    |
    v
Digest(R)
    |
    v
ObjectReference-to-R
```

VE would permit references to references.

That is mechanically possible but introduces:

- an additional object-type registry entry;
- another digestable artifact class;
- another canonical hash-body definition;
- potential chains of indirection;
- questions about whether identity follows the target or the wrapper;
- pressure for reference normalization / dereferencing rules.

None of those are currently required by a validated scenario.

## 3. Recursive reference chains

A first-class reference object makes structures such as this legal:

```text
R1 -> Object A
R2 -> R1
R3 -> R2
R4 -> R3
```

Each object can be cryptographically valid while adding no semantic
information about A.

A verifier then needs policy for:

```text
maximum reference depth
dereference equivalence
reference-chain normalization
cycle detection
```

Those are avoidable protocol concerns.

Keeping ObjectReference embedded prevents the generic protocol from
creating reference-to-reference graphs by default.

## 4. Self-reference

A direct self-reference cannot be constructed naively because an
ObjectReference contains the digest of its target, and a digest of the
reference would depend on its own body.

Special fixed-point/self-hash constructions could theoretically be
defined, but VE has no need for them.

The correct response is not to standardize self-reference machinery.

## 5. Referencing a reference semantically

If a protocol needs to make an assertion about a specific reference
value, the preferred construction is to place the ObjectReference inside
a normal semantic object.

Example:

```text
Claim {
    subject = <ObjectReference value>,
    predicate = "observed"
}
```

The Claim's own digest commits to the exact ObjectReference value.

Therefore:

```text
need to attest/reference a reference
```

does not imply:

```text
ObjectReference needs its own object identity
```

## 6. Structural equality

Two ObjectReference values are equal when all canonical components are
equal:

```text
object_type
representation_profile
digest_suite
digest_bytes
```

This structural equality is sufficient for:

- lookup;
- deduplication;
- comparison;
- indexing;
- inclusion in signed/hashed enclosing objects.

No extra digest is needed merely to compare references efficiently.

Implementations may compute local cache hashes, but those are not VE
protocol identities.

## 7. Content-addressed stores

A content-addressed store can index an ObjectReference using its
canonical bytes or a local implementation hash without promoting that
hash into VE semantics.

The normative target identity remains the ObjectReference's contained
typed digest context.

## 8. SignatureRecord consequence

A SignatureRecord can contain:

```text
signed_object_reference
verification_material_reference
```

as embedded values.

If a future Claim needs to attest a SignatureRecord, the SignatureRecord
itself may separately be considered for first-class object identity.

That decision does not require ObjectReference itself to be hashable.

## 9. Trust-history consequence

Trust-transition records may contain ObjectReference values to prior
objects.

The transition record's own typed digest commits to those references.

Again, no ObjectReference identity is needed.

## 10. Representation consequence

VE-007 should define the exact canonical representation of
ObjectReference as a reusable structural value.

It should not assign:

```text
object_type = OBJECT_REFERENCE
```

to the wrapper itself.

## 11. Future extension rule

A first-class ObjectReference identity MAY be reconsidered only if a
reference scenario demonstrates a requirement that cannot be satisfied
by:

```text
embedded ObjectReference
+
digest/signature of an enclosing semantic object
```

The burden of proof remains high.

## 12. Architectural Decision Test

1. **Consistency:** PASS.
2. **New primitive:** excluding first-class identity avoids a new protocol
   artifact class.
3. **Removability:** first-class ObjectReference identity is removable
   without semantic loss.
4. **Twenty-year test:** embedded typed references remain stable.
5. **Independent implementation:** structural equality and canonical
   representation are sufficient.
6. **Complexity:** exclusion avoids recursive reference graphs and
   dereference policy.

## Conclusion

> **`ObjectReference` should be a reusable embedded canonical value, not
> a first-class hashable VE object.**

It identifies an object; it does not need to become another object that
must itself be identified.

No `OBJECT_REFERENCE` cryptographic object type is justified at this
stage.


