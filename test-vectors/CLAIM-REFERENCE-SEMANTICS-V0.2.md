---
id: CLAIM-REFERENCE-SEMANTICS-V0.2
title: Claim Reference Semantics v0.2 Draft Vectors
version: "0.2"
status: Draft
document_type: Conformance Vector
category: Conformance
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - VE-CLAIM-REFERENCE-SEMANTICS
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - RFC-007
  - ADR-007
related_documents:
  - PREDICATE-SCHEMA-CANONICALIZATION-V1.1
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
supersedes: null
superseded_by: null
---

# Claim Reference Semantics v0.2 Draft Vectors

## Status and scope

This Draft artifact tests Claim-reference semantics for the fourth closed
subject form, ExternalSubjectReference. It does not define Claim wire bytes,
canonical Claim.body bytes, a representation-profile code, a PSCID suite, a
VE identity provider, or a generic reference ontology.

The applicable Predicate Schema supplies subject_constraints and subject_domain.
Claim Reference Semantics owns the legal four-form union; the Semantic Contract
owns external-subject validity and contextual equality.

## Common subject domains

The following bounded semantic domains are used only to state the cases:

~~~text
HumanDomain = {
  identifier: { form: text },
  equality: canonical
}

VendorDomain = {
  identifier: {
    form: text,
    allowed_values: [ "vendor-042" ]
  },
  equality: canonical
}
~~~

These examples are semantic fixtures, not Claim wire encodings. CAD/unit
semantics remain outside this artifact.

## Accepted cases

### C-A — Human external subject

~~~text
subject_reference = ExternalSubjectReference {
  identifier: "human:017"
}

subject_constraints permits ExternalSubjectReference
subject_domain = HumanDomain
~~~

Result: valid. The identifier satisfies the applicable domain. The form
establishes neither a VE Entity nor an identity-provider record.

### C-B — Vendor external subject

~~~text
subject_reference = ExternalSubjectReference {
  identifier: "vendor-042"
}

subject_constraints permits ExternalSubjectReference
subject_domain = VendorDomain
~~~

Result: valid. This is the same closed subject mechanism with a different
Predicate-Schema-defined domain.

### C-C — Existing Action occurrence remains valid

~~~text
subject_reference = ActionOccurrenceReference {
  action_id,
  action_digest
}

subject_constraints permits ActionOccurrenceReference
subject_domain may be absent
~~~

Result: valid under existing Action-occurrence semantics. An external subject
domain does not reinterpret Action content, Action occurrence, or Event
references.

## Rejected cases

### C-R1 — External reference without subject domain

~~~text
subject_reference = ExternalSubjectReference { identifier: "human:017" }
subject_constraints permits ExternalSubjectReference
subject_domain absent
~~~

Result: reject. External-subject interpretation is unavailable when its
required subject_domain is absent.

### C-R2 — Malformed identifier for the applicable domain

~~~text
subject_reference = ExternalSubjectReference { identifier: "vendor-041" }
subject_constraints permits ExternalSubjectReference
subject_domain = VendorDomain
~~~

Result: reject. The identifier does not satisfy VendorDomain.

### C-R3 — Unknown subject-reference form

~~~text
subject_reference = ReceiptReference { receipt_id }
~~~

Result: reject. The legal union is closed; ReceiptReference is not a
Claim.subject_reference form.

### C-R4 — Equality asserted across different domains

~~~text
left.identifier  = "vendor-042"
left.domain      = HumanDomain
right.identifier = "vendor-042"
right.domain     = VendorDomain
assert left == right
~~~

Result: reject the equality assertion. Identical identifier bytes under
different subject-domain semantic content do not establish equality by default.

## Boundaries

An ExternalSubjectReference is an assertion subject, not authoritative history,
trust, verification success, authorization, or a Root Authority role. Claim
semantics remain distinct from Event history:

~~~text
Claim = assertion
Event = authoritative history
~~~

No case establishes final Claim wire encoding. VE-002 and Claim-body
representation work remain Draft dependencies for portable Claim encoding.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-08-30 | Draft semantic vectors for the fourth closed Claim subject form. |
