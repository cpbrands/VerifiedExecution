---
id: EXTERNAL-SUBJECT-INTEGRATION-V0.1
title: External Subject Cross-Artifact Integration Draft Vectors
version: "0.1"
status: Draft
document_type: Conformance Vector
category: Conformance
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - VE-CLAIM-REFERENCE-SEMANTICS
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - RFC-007
  - ADR-007
related_documents:
  - PREDICATE-SCHEMA-CANONICALIZATION-V1.1
  - CLAIM-REFERENCE-SEMANTICS-V0.2
supersedes: null
superseded_by: null
---

# External Subject Cross-Artifact Integration Draft Vectors

## Status and scope

This Draft package tests the comparability boundary shared by Claim Reference
Semantics, Predicate Schema semantic interpretation, and candidate
canonicalization. It does not define Claim wire encoding, a portable
semantic-fragment identity, a registry, a resolver, or identity bridging.

The examples use offline-provisioned fixture material. A source reference is
only composition notation; it is not an equality key or portable identifier.
CAD/unit semantics remain outside these vectors.

## Common fixture domains

~~~text
DomainText = {
  identifier: { form: text },
  equality: canonical
}

DomainVendorOnly = {
  identifier: {
    form: text,
    allowed_values: [ "vendor-042" ]
  },
  equality: canonical
}
~~~

## Integration cases

### I-A — Cross-predicate identical domain

~~~text
Predicate A:
  subject_domain = inline DomainText

Predicate B:
  subject_domain_ref = fixture://domains/text-copy
  fixture://domains/text-copy -> DomainText

Claim A subject = ExternalSubjectReference { identifier: "vendor-042" }
Claim B subject = ExternalSubjectReference { identifier: "vendor-042" }
~~~

Result: the two subjects are comparable. Both applicable domains resolve,
normalize, and have identical canonical semantic content. This conclusion does
not depend on Predicate A and Predicate B having the same source form.

### I-B — Different domains with identical identifier bytes

~~~text
Predicate A subject_domain = DomainText
Predicate B subject_domain = DomainVendorOnly

Claim A subject = ExternalSubjectReference { identifier: "vendor-042" }
Claim B subject = ExternalSubjectReference { identifier: "vendor-042" }
~~~

Result: not equal by default. Both identifiers may be domain-valid, but the
domains have different normalized semantic content. No cross-domain equality is
inferred from equal bytes.

### I-C — Source-reference location is irrelevant

~~~text
Predicate A subject_domain_ref = offline://procurement/domain-copy
Predicate B subject_domain_ref = offline://compliance/domain-copy

both references resolve offline to exactly DomainText
both claims use ExternalSubjectReference { identifier: "vendor-042" }
~~~

Result: comparability may hold because the expanded and normalized subject-domain
semantic content is identical. It does not hold because the source locations
match; they do not.

### I-D — Omitted as environment-dependent

No fixture asserts that one identical subject_domain_ref string resolves to two
different values over time. That would require mutable source context and would
not be a safe or deterministic vector. The required conclusion is already
covered: source-reference equality alone has no semantic significance, while
resolved and normalized semantic content determines comparability.

## Failure boundary

Each case fails closed when required domain material is malformed, unresolved,
cyclic, unsupported, or unavailable. Cross-domain relationships, when needed,
remain ordinary verified Claims governed by their own Predicate Schemas; this
artifact introduces no IdentityLink, SameAs, Entity, or generic identity graph.

## Identity and adoption boundary

These integration cases do not allocate PSCID-next values, a representation
profile, or a PSCID suite. Predicate Schema canonical bytes are not by
themselves Claim bytes, Claim identity, trust, verification, provenance, or
authorization.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-30 | Draft cross-artifact comparability vectors for external subjects. |
