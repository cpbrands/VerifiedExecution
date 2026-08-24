---
id: PRESSURE-TEST-SCHEMA-DIGEST-REFERENCE
title: schema_digest vs schema_reference
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

# Pressure Test — `schema_digest` vs `schema_reference`

**Date:** 2026-08-24
**Result:** FAIL for implicit context; PASS for explicit typed reference

## Question

Can VE-001 retain `schema_digest` while VE-007 or enclosing context implicitly supplies `object_type = SCHEMA_DESCRIPTOR` and `representation_profile`, without sacrificing portability?

## Verdict

No.

A portable Action should carry:

```text
schema_reference : ObjectReference
```

where:

```text
ObjectReference := {
    object_type,
    representation_profile,
    digest_reference
}
```

and:

```text
DigestReference := {
    digest_suite,
    digest_bytes
}
```

For an Action schema:

```text
object_type = SCHEMA_DESCRIPTOR
```

## Why `schema_digest` alone fails

A digest result does not fully identify the typed VE object it names unless the verifier also knows:

```text
object_type
representation_profile
digest_suite
```

Field-name context is not portable once the reference is detached, indexed, copied, signed, or moved.

Representation profile cannot safely be inferred from the current protocol version because historical objects may span multiple profiles.

## Why VE-007 cannot fix this implicitly

VE-007 is representation-only.

If VE-007 implicitly supplies object type or profile, it has changed VE-001 semantic meaning rather than merely encoded it.

That violates the VE-007 scope boundary.

## Historical verification

An Action created under one representation profile must remain independently verifiable after later profiles exist.

Therefore the schema reference must carry the profile explicitly.

## Minimality

No additional semantic fields beyond:

```text
object_type
representation_profile
digest_suite
digest_bytes
```

are currently justified for portable schema identity.

## Governance consequence

Changing:

```text
schema_digest
```

to:

```text
schema_reference : ObjectReference
```

is a semantic type change to VE-001 and requires normal change control:

```text
RFC
→ ADR
→ VE-001 version increment
→ changelog
```

VE-007 must remain blocked until that semantic change is accepted.
