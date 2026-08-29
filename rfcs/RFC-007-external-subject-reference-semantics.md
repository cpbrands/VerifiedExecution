---
id: RFC-007
title: External Subject Reference Semantics
version: 0.1
status: Draft
document_type: RFC
category: Claim Semantics
author: Verified Execution Editorial Board
created: 2026-08-29
updated: 2026-08-29
depends_on:
  - SPECIFICATION-GOVERNANCE
  - VE-001
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
related_documents:
  - VE-CLAIM-REFERENCE-SEMANTICS
  - CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
supersedes: null
superseded_by: null
---

# RFC-007 — External Subject Reference Semantics

## 1. Status and decision requested

This RFC is Draft. It proposes a narrowly scoped extension to Claim subject
semantics; it changes no Approved specification, allocates no representation
profile code, and creates no ADR.

The requested decision is whether a future governed Claim model should add one
closed, field-level form for a Claim about an externally defined subject. The
proposal does not create an Entity primitive, an identity provider, a namespace
authority, a registry, a resolver, or Root Authority.

## 2. Problem

The current candidate Claim subject union is:

~~~text
ActionContentReference { action_digest }
| ActionOccurrenceReference { action_id, action_digest }
| EventReference { event_id }
~~~

It cannot directly express an authoritative Claim whose subject is a Human,
Vendor, Organization, Account, Device, AI Agent, cryptographic key, digital
asset, or medical record. These are assertions about externally defined
subjects, not about an Action or Event.

Action-scoped derived Claims remain useful. For example:

~~~text
subject = ActionOccurrenceReference(A)
predicate = destination_vendor_is_approved
value = true
~~~

They are not a general replacement for a reusable assertion such as `Vendor X
is approved`. They must be reissued for each Action, obscure the subject-level
fact, and cannot directly compose an approval, sanction, ownership, and
delegation Claim about the same vendor.

## 3. Boundaries and non-goals

This proposal gives VE no authority to decide who or what a real-world subject
"really is." It only lets a Claim carry an identifier whose interpretation and
equality are fixed by immutable semantics selected by the Claim's Predicate
Schema.

This RFC explicitly does not define:

- a generic Entity model or personhood model;
- universal identity, namespace governance, a subject registry, a global
  resolver, a DID requirement, or a PKI requirement;
- Root Authority, issuer trust, signer/key binding, verification success,
  delegation, revocation, authorization, ownership, or resource authority;
- identity-link primitives, unit or currency semantics, unrelated Rule changes,
  Execution Right changes, Event changes, or Claim-issuer verification changes;
- Claim-body wire encoding, CBOR labels, a digest suite, or a PSCID profile
  code.

## 4. Alternatives considered

### 4.1 Generic `EntityReference`

**Rejected.** The name and model invite VE to define what an Entity is, how
entity classes relate, and which identifier namespace is globally authoritative.
That is identity-provider and ontology creep rather than the minimum needed to
state a Claim about an externally defined subject.

### 4.2 `AuthorityScopedReference`

**Rejected as overbuilt.** A shape such as
`{ authority_context, subject_identifier }` conflates subject equality with
whether an issuer is trusted to assert a Claim. It duplicates VerificationContext
and the resource-recognized Root Authority boundary, while making legitimate
cross-authority reuse difficult.

### 4.3 Reuse or generalization of `issuer_domain`

The existing `issuer_domain` defines the domain and equality of a semantic
Claim issuer. Reusing it directly for a Claim subject would conflate who made
the assertion with what it concerns.

Generalizing it into a universal `IdentifierDomain` is also rejected at this
stage. It adds an architectural abstraction that has no demonstrated semantic
owner beyond two field-specific uses and risks becoming an identity/namespace
framework.

### 4.4 Predicate-defined external subject semantics

**Selected direction.** The applicable Predicate Schema supplies the
field-specific immutable semantics needed for an external subject identifier:

- permitted identifier form;
- normalization required before comparison; and
- deterministic identifier equality.

The subject domain does not supply trust, issuer authority, namespace
governance, registry lookup, personhood, keys, delegation, revocation,
authorization, or ownership semantics.

### 4.5 Competing-model comparison

| Model | Assessment |
|---|---|
| Closed `ExternalSubjectReference` plus Predicate Schema subject-domain semantics | **Preferred.** It supplies the minimum deterministic, portable equality rule without adding an identity model. |
| Raw opaque identifier with raw-byte equality | **Rejected.** It cannot provide portable normalization or equality. |
| Generic VE Entity or subject object | **Rejected.** It is overbuilt and invites identity-model creep. |
| Authority-scoped subject reference | **Rejected as overbuilt.** It conflates subject equality with trust and authority. |
| Action/Event-only subjects | **Rejected as a general solution.** They cannot express reusable Vendor, Human, or other external-subject facts. |

The selected model has the lowest total conceptual complexity: one closed Claim
subject form and predicate-selected field semantics, without a generic identity
or authority abstraction.

## 5. Proposed closed subject form

The provisional term **ExternalSubjectReference** is the least misleading
candidate considered here. It means a reference to a subject defined outside
VE; it does not imply network retrieval, a universal entity, or a universal
identity claim. `EntityReference`, `IdentityReference`, and `GenericReference`
are rejected for those implications.

The proposed future closed union is:

~~~text
Claim.subject_reference :=
  ActionContentReference { action_digest }
  | ActionOccurrenceReference { action_id, action_digest }
  | EventReference { event_id }
  | ExternalSubjectReference { identifier }
~~~

`ExternalSubjectReference` is a field/reference form, not a VE object or
architectural primitive. It carries only `identifier`. A `domain_ref`, issuer,
authority, resource, trust context, or verification material is deliberately
absent because the applicable Predicate Schema already fixes the identifier's
subject-domain semantics.

The existing Action and Event forms retain their VE-defined identity semantics.
Subject-domain semantics apply only to `ExternalSubjectReference`; they MUST
NOT redefine Action content, Action occurrence, or Event identity.

## 6. Proposed Predicate Schema addition

This RFC proposes testing the following minimum field-specific addition in a
future Predicate Schema version:

~~~text
PredicateSchema {
  issuer_domain,
  value_semantics,
  subject_domain?,
  subject_constraints?,
  time_semantics?
}
~~~

`subject_domain` is present only when a Predicate Schema permits
`ExternalSubjectReference`. It has exactly one authoritative semantic source:
inline subject-domain content XOR a field-specific source-reuse reference
written here as `subject_domain_ref`. The reference notation follows the
existing field-specific reuse pattern only at the semantic/source-composition
level. This RFC does not define a portable subject-domain fragment identity,
its wire form, or a portable fragment content-identity format.

`subject_domain` defines only identifier form, normalization, and equality. It
does not define trust, authority, verification, delegation, ownership,
personhood, provenance, registry membership, or any other identity-provider
function.

The rules are explicit:

~~~text
ExternalSubjectReference used + subject_domain absent
    => invalid

subject_domain present
    != every Claim must use ExternalSubjectReference
~~~

`ActionContentReference`, `ActionOccurrenceReference`, and `EventReference`
remain legal whenever `subject_constraints` permits them. `subject_domain`
exists only to interpret the external form when that form is used.
`subject_constraints` answers which union members may be used;
`subject_domain` answers only how an external identifier is interpreted and
compared. The two concerns MUST NOT be conflated.

## 7. Equality and comparability

For two ExternalSubjectReferences under the same Predicate Schema, equality is:

~~~text
identifier equality after normalization
under the exact immutable subject-domain semantics
selected by that Predicate Schema
~~~

The following conditions fail closed: an unresolved subject-domain dependency,
a cyclic subject-domain dependency, an unsupported subject-domain semantic
rule, a malformed external identifier, or unavailable required subject-domain
semantics. A display name, URL with unspecified meaning, prose convention,
online lookup, or implementation-specific normalization is never sufficient.

Cross-predicate subject comparability exists only when both applicable
subject-domain semantics resolve, normalize, and result in identical canonical
subject-domain semantic content. This permits the same Vendor X to be the
subject of `approved`, `sanctioned`, and `owns-account` Claims without creating
universal subject equality. This rule does not assume that a portable
subject-domain content identifier already exists.

Two references from different subject domains are not automatically
comparable. For example, Procurement's Vendor ID `123` and Compliance's LEI
`549300...` are not equal merely because they may refer to the same company.
When a policy needs that relationship, a future ordinary verified Claim may
assert it under a Predicate Schema defining that relationship. No
`IdentityLink` primitive is required or introduced by this RFC.

Whole-field subject-domain reuse may conceptually follow the existing
field-specific semantic/source-reuse pattern. Portable representation of
reusable subject-domain fragments, if required for future conformance, is a
separate representation-level dependency and is not solved by RFC-007.

## 8. Offline operation and Root Authority

An independent implementation can validate equality offline from provisioned
immutable Predicate Schema and subject-domain material. It requires no network,
publisher, DNS, registry, resolver, or identity provider.

Subject-domain semantics do not establish whether any issuer may make a Claim.
VerificationContext and the resource-recognized Trust Context determine whether
the Claim was established and whether its issuer is acceptable for the
governing decision. VE therefore consumes authority; it does not become the
subject's or the resource's Root Authority.

## 9. Pressure tests

### 9.1 Autonomous Vendor Payment

Under the proposed form:

~~~text
Vendor approval
  subject   = ExternalSubjectReference(Vendor X identifier)
  predicate = PSCID(vendor-approved Predicate Schema)
  value     = true

Human approval of this payment
  subject   = ActionOccurrenceReference { action_id, action_digest }
  predicate = PSCID(payment-approval Predicate Schema)
  value     = true

Delegated payment limit
  subject   = ExternalSubjectReference(Human H identifier)
  predicate = PSCID(delegated-limit Predicate Schema)
  value     = <schema-defined limit>
~~~

The approval remains occurrence-bound and therefore cannot authorize a
separately created Action with the same content. No external-subject form and
no attempt identity are needed for that Claim.

This RFC does not solve the separate bounded-profile gap for a CAD-denominated
payment limit. Currency, unit, scale, and money-value semantics remain outside
this RFC.

### 9.2 Subject diversity

The same one form can carry opaque identifiers for a Human, Organization,
Vendor, Bank Account, Device, AI Agent, cryptographic key, digital asset, or
medical record. The Predicate Schema's subject domain—not VE—defines what
those identifier bytes or text mean. No VE taxonomy is introduced.

### 9.3 Ambiguity and security attacks

| Attack | Required result |
|---|---|
| Same display name, different identifiers | Not equal unless normalized identifiers are equal under the same domain. |
| Same identifier bytes, different subject domains | Not comparable; no equality inference. |
| Different source forms, same normalized identifier | Equal only when the exact domain defines that normalization. |
| Malformed identifier | Invalid; fail closed. |
| Unresolved subject-domain dependency | Semantic interpretation unavailable; fail closed. |
| Cyclic subject-domain dependency | Semantic interpretation unavailable; fail closed. |
| Unsupported subject-domain semantic rule | Semantic interpretation unavailable; fail closed. |
| Unavailable required subject-domain semantics | Semantic interpretation unavailable; fail closed. |
| Different predicates with different domains | No automatic subject equality. |
| One human represented by multiple schemes | No inference; use an explicitly verified relationship when needed. |

## 10. Canonicalization and PSCID impact

No Approved v1.0 canonicalization rule changes through this RFC.

If adopted, portable support requires a future Predicate Schema canonicalization
version that admits `ExternalSubjectReference` in `subject_constraints` and
defines the corresponding field/reference representation. The future Claim-body
canonicalization work must separately define the identifier's serialized form
and validation boundary.

`representation_profile = h'01'` remains permanently bound to Predicate Schema
Canonicalization v1.0. PSCID-1 and all existing identities remain valid and
interpretable. A machine-affecting new canonicalization version requires a new
representation-profile code and a new PSCID suite; it MUST NOT reinterpret
existing PSCID-1 identities.

## 11. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The form preserves explicit, inspectable Claims without assigning VE real-world identity authority. |
| New primitive burden | Pass. It is one closed Claim field form plus field-specific Predicate Schema semantics, not a primitive or object. |
| Removability | **Architecturally necessary.** Removing it recreates the demonstrated inability to express reusable Claims about non-Action/non-Event subjects. This is evidence of necessity, not a defect in the proposal. |
| Twenty-year durability | Pass. Opaque identifiers and governed equality accommodate new subject types without a VE ontology. |
| Independent implementability | Pass only with retained immutable subject-domain semantics and fail-closed comparison. |
| Total conceptual complexity | Pass. One closed fourth form removes Action-derived duplication without adding identity infrastructure. |

## 12. Governance and acceptance gates

Adoption requires all of the following, none of which this Draft performs:

1. acceptance of this RFC and a corresponding ADR;
2. versioned revisions to the affected Approved Predicate Schema Semantic
   Contract and Canonical Representation Profile, with changelog entries;
3. a new canonicalization profile/version, representation-profile code, and
   PSCID suite; and
4. cross-language canonicalization and Claim-reference conformance vectors.

No Approved specification may be altered informally. The new capability must
remain closed-world and fail closed on unknown subject form or subject-domain
semantics.

## 13. Conclusion

**A. EXTERNAL SUBJECT FORM SHOULD BE ADOPTED.**

The smallest viable capability is one additional closed Claim subject form,
with identifier equality defined by immutable field-specific subject-domain
semantics selected by the Predicate Schema. It avoids a VE Entity primitive,
universal identity infrastructure, authority duplication, and an open generic
reference ontology.

This is a Draft decision request. The next step is review, not a silent change
to Claim semantics, canonicalization, or PSCID-1.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-29 | Initial Draft proposing a closed external Claim subject form. |
