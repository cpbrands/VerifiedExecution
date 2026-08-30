---
id: RFC-008
title: Predicate Schema Content Identity Suite Governance
version: "0.1"
status: Accepted
document_type: RFC
category: Representation
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - SPECIFICATION-GOVERNANCE
  - ADR-ENC-001
related_documents:
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - RFC-005
  - RFC-007
  - ADR-007
  - OPEN-DECISIONS
supersedes: null
superseded_by: null
---

# RFC-008 — Predicate Schema Content Identity Suite Governance

## 1. Status, accepted decision, and narrow scope

This RFC is Accepted. It records the accepted governance model for **Predicate
Schema Content Identity (PSCID)** suites only. It does not approve a suite, allocate a
representation-profile code or suite code, alter any existing PSCID-1 bytes,
or amend an Approved specification.

The accepted decision is:

> A PSCID suite is one immutable, Predicate-Schema-specific content-identity
> construction. It pins domain-separated framing, one representation profile,
> one hash algorithm, and one identity layout. Changing any pinned element
> requires a new suite; no suite performs algorithm negotiation or mutable
> profile selection.

This RFC governs only:

- suite-defined PSCID construction;
- immutable representation-profile binding;
- hash-algorithm, framing, and identity-layout binding;
- local append-only suite and representation-profile code tables;
- historical verification, unknown-suite failure, and exact equality; and
- security evidence required before a future suite becomes authoritative.

This RFC does **not** define or adopt:

- generic VE-object digests, generic references, or content addressing for
  arbitrary VE objects;
- signatures, signature suites, signature records, transport protocols,
  algorithm negotiation, key management, trust anchors, issuer identity, or
  Claim verification;
- a generic cryptographic-agility registry, generic digest primitive, generic
  `ContentIdentity`, `DigestRef`, `HashRef`, or semantic-fragment identity; or
- a new VE primitive, Claim field, runtime object, or Root Authority role.

RFC-005 remains a separate Draft for generic VE digest, reference, and
signature architecture. This RFC neither accepts, supersedes, nor narrows
RFC-005's generic decision surface.

## 2. Context and problem

Predicate Schema content must be reproducible across independent
implementations without turning PSCID into VE-wide cryptographic
infrastructure. Canonical Predicate Schema bytes alone do not state the
content-identity family, the representation-profile interpretation, the hash
construction, or the resulting identity layout. A bare hash would therefore
permit construction confusion and make historical verification depend on
external, mutable context.

The current `DIGEST-001` Draft identifies the smallest candidate construction:

~~~text
profile-valid Predicate Schema
    -> canonical bytes C
    -> fixed PSCID frame
    -> fixed hash
    -> suite-prefixed PSCID identity
~~~

The remaining issue is not whether to import RFC-005's generic object and
signature model. It is how a Predicate-Schema-specific construction becomes
durably governed before its profile and suite codes are permanently assigned.

## 3. Proposed PSCID suite model

### 3.1 Immutable construction recipe

A PSCID suite is an immutable construction recipe. Each suite pins exactly:

~~~text
domain-separation framing
representation_profile
hash algorithm
identity layout
~~~

The suite code is the construction-version discriminator. Once assigned, a
suite code MUST NOT change meaning, be reassigned, or acquire negotiated
behavior. A change to any identity-affecting pinned element MUST use a new
suite code.

`representation_profile` identifies the exact byte-producing Predicate Schema
canonicalization closure used for the suite. It is not a request for the latest
profile, a document filename, a Git revision, a URL, an implementation label,
or a mutable version string.

### 3.2 Suite-defined cryptographic agility

PSCID cryptographic agility is:

~~~text
new cryptographic construction
    => new immutable PSCID suite
~~~

It is not an algorithm-negotiation mechanism inside an existing suite. A
separate hash-algorithm field inside a PSCID identity is not introduced: the
suite already selects the exact hash construction and is carried in the
identity. Adding a second selector would duplicate the security-relevant choice
and create invalid algorithm/suite combinations.

This model is sufficient because historical identities retain their original
interpretation; a new suite can select a new hash if cryptographic assumptions
change; unknown suites fail closed; and no downgrade or negotiation layer can
reinterpret an existing identity.

### 3.3 Suite/profile binding, without premature global uniqueness

A suite MUST immutably pin exactly one `representation_profile` for its
construction. It MUST NOT dynamically select among profiles.

This RFC does not require a global one-to-one relationship between suite codes
and representation-profile codes. A future independently justified
construction MAY pin a representation profile already used by another suite,
for example when the hash construction changes while the byte-producing
closure does not. Such reuse is neither allocated nor required by this RFC.
The necessary invariant is the suite's immutable one-profile binding, not a
stronger global uniqueness rule.

## 4. PSCID-1 preservation

This RFC preserves the existing PSCID-1 candidate construction exactly. It
does not reinterpret the `VEPSCID1` token, suite `h'01'`,
`representation_profile = h'01'`, SHA-256 binding, frame, digest, or identity
layout described by `DIGEST-001`.

`VEPSCID1` is the fixed Predicate Schema content-identity family domain token.
The carried suite byte is the PSCID construction-version discriminator. When
PSCID-1 becomes authoritative through the required future governance process,
its construction is exactly:

~~~ini
frame = VE-CBOR-1([
  bstr h'5645505343494431',
  bstr h'01',
  bstr h'01',
  bstr C
])

digest   = SHA-256(frame)
identity = h'01' || digest
~~~

Here `C` is canonical Predicate Schema bytes under the profile bound by that
suite. The token is not a generic VE-object domain token, a mutable frame
version, or a reference to RFC-005. The suite byte appears both as the carried
identity prefix and inside the frame so that a digest cannot be relabeled as a
different construction.

For PSCID-1, the identity is exactly 33 octets: one carried suite octet followed
by the 32 raw SHA-256 output octets. PSCID-1 equality is exact equality of all
33 octets.

This RFC makes no additional numeric assignment. In particular, it does not
assign a successor to either existing candidate code.

## 5. Byte-producing closure and external boundaries

`representation_profile` is an immutable identifier for the complete
byte-producing Predicate Schema canonicalization closure. For the current
external-subject v1.1 candidate, that closure is:

~~~text
Predicate Schema Semantic Contract v1.1
Predicate Schema Canonical Representation Profile v1.1
Predicate Schema Field-Semantic Representation Grammar v1.0
ADR-ENC-001 / VE-CBOR-1 v0.1
~~~

The closure includes only the rules that accept, resolve, expand, normalize,
validate, order, and encode `C`. A profile code must bind those
machine-affecting rules as a frozen whole before a suite using it becomes
authoritative.

The following remain outside the profile hash and canonicalization closure:

| Material | Boundary |
|---|---|
| Claim Reference Semantics v0.2 | External semantic dependency. It defines subject-reference meaning, not Predicate Schema bytes. |
| RFC-007 and ADR-007 | Architectural authority for the external-subject direction, not byte-producing inputs. |
| Conformance vectors and independent implementations | Evidence that the closure is implemented correctly, not profile content. |
| Trust, verification, issuer authority, and Rule/Evaluate policy | Outside Predicate Schema content identity. |

Claim Reference Semantics v0.2 MUST NOT be incorporated into a PSCID
representation-profile hash merely because Predicate Schema constraints refer
to named subject forms. The profile contains the closed semantic constraint
names and their canonical ordering, not the independent Claim or Event wire
representation.

The current v1.1 closure is candidate-frozen and has cross-language
canonical-byte evidence. This RFC neither approves it nor assigns a permanent
profile or suite code. It authorizes only the governance model under which a
future suite/profile pair may be considered.

## 6. Local append-only code tables

PSCID suite codes are local to Predicate Schema content identity. Predicate
Schema representation-profile codes are likewise local to this identity
family. Neither table is a VE-wide registry or a new architectural primitive.

For both local tables:

- an assigned code MUST have one immutable published meaning;
- a code MUST NOT be reassigned or recycled;
- historical assignments MUST remain available for verification;
- an unknown code MUST fail closed; and
- repository, network, publisher, resolver, or implementation context MUST
  NOT silently supply a replacement meaning.

This RFC uses only the symbolic names `NEW_SUITE` and `NEW_PROFILE` when
describing future assignments. They are placeholders, not numeric values and
not allocations.

## 7. Equality, historical verification, and migration

PSCID equality is exact identity-byte equality. This RFC does not define
semantic equality across suites, migration aliases, an equivalence table,
fallback identities, automatic upgrade, or rehashing.

Therefore, even when canonical Predicate Schema bytes happen to be equal:

~~~text
C_old == C_new
    != PSCID_old == PSCID_new
~~~

when the suite or profile binding differs.

To verify a historical identity, an implementation MUST:

~~~text
identity suite prefix
    -> select the immutable suite definition
    -> select that suite's immutable representation_profile
    -> canonicalize and verify under that frozen closure
    -> construct the suite's exact frame and hash it
    -> compare the complete carried identity bytes
~~~

Interpreting an identity with a "latest profile" is forbidden. If the carried
suite, its profile, the required frozen material, or the profile-valid source
is unavailable, verification is unavailable and MUST fail closed. A future
algorithm change is handled by a new suite for new identities; it does not
mutate or silently migrate old identities.

## 8. Collision and cryptographic-integrity failure

A detected collision or integrity contradiction involving distinct canonical
Predicate Schema bytes and one PSCID identity is a cryptographic-integrity
failure. It MUST NOT be treated as an ordinary equality, alias, valid
substitution, or a reason to retry under a different suite.

There is no aliasing, rehash fallback, alternate identity, automatic suite
migration, or registry repair procedure. A future change in cryptographic
assumptions is handled by defining a new immutable suite, while retaining the
historical interpretation of identities under the old suite.

## 9. Security evidence before a suite becomes authoritative

A candidate suite and profile pair MUST NOT become authoritative until all of
the following are complete:

1. its entire byte-producing profile closure is frozen under normal governed
   specification change control;
2. the suite construction receives an independent, focused security review;
3. canonical `C` anchors and corresponding frame, digest, and identity anchors
   exist;
4. at least two independent implementations agree on those anchors;
5. downgrade, relabel, code-confusion, unknown-code, and construction-confusion
   negative cases are tested;
6. the exact suite/profile code assignments are independently audited; and
7. repository governance approves the suite and its affected specifications.

The required security review is narrow. It covers domain separation,
unambiguous framing, suite/profile binding, prefix parsing, code confusion,
downgrade and relabel resistance, exact equality, SHA-256 collision and
second-preimage assumptions, historical verification, and migration behavior.
It does not require VE to prove SHA-256 from first principles or invent a new
hash function.

NIST FIPS 180-4 Section 6.2 is the SHA-256 algorithm authority for PSCID-1;
ADR-ENC-001 is the VE-CBOR-1 canonical encoding authority. This focused review
tests their use in PSCID framing rather than replacing either standard.

## 10. Provisional versus permanent assignments

Draft work MAY use provisional candidate values only to construct and test
vectors. Such values are non-authoritative and MUST NOT be represented as
permanent allocations, accepted suite meanings, or conformance targets.

A representation-profile code and PSCID suite code become permanent only in
the coordinated final Approved change that freezes the profile closure,
approves the identity construction, records the assignments, updates required
version histories and changelog entries, and publishes the required vectors.
Until then, no implementation may claim portable conformance by using a
candidate code.

## 11. RFC-005 and Open Decision Register relationship

RFC-005 remains Draft, independent, and non-normative for this RFC. It owns a
broader question: generic VE-object digest framing, typed object references,
signature records, signature suites, and related protocol concerns. This RFC
does not accept RFC-005, reuse its proposed `DigestReference` or
`ObjectReference`, or resolve its generic digest/signature architecture.

The intended Open Decision Register consequence is scoped:

- a PSCID-specific content-identity suite decision can be resolved through this
  RFC, its associated ADR, and the later Approved PSCID specification path;
- the current generic `DIGEST-001` entry, which is linked to RFC-005's initial
  mandatory VE digest suite, may remain open for that broader scope; and
- a future register update should split or mark the entry partially resolved
  rather than claiming that PSCID resolves generic VE digest/signature work.

This RFC does not edit `OPEN_DECISIONS.md`.

## 12. Alternatives considered

| Alternative | Decision | Reason |
|---|---|---|
| Accept generic RFC-005 first | Rejected | It would force unrelated object-reference, signature, and protocol decisions into a Predicate-Schema-local need. |
| Raw `hash(C)` | Rejected | It does not bind domain, profile, or construction. |
| Mutable suite with negotiated hash/profile | Rejected | It makes historical verification and downgrade handling depend on mutable context. |
| Add a hash-algorithm field beside the suite prefix | Rejected | It duplicates the suite-selected choice and enables invalid combinations. |
| Generic crypto registry | Rejected | It creates VE-wide infrastructure without a demonstrated PSCID need. |
| New immutable PSCID suite for each construction | Selected | It provides local agility, historical interpretation, and fail-closed behavior with the fewest concepts. |

## 13. Compatibility, specification, and implementation impact

**Compatibility classification:** no current Approved specification changes in
this RFC. A future permanent suite/profile assignment will be part of a
coordinated governed revision and must state its classification and
compatibility behavior separately.

**Specification impact:** this RFC authorizes a future narrow PSCID governance
path only. It does not revise `DIGEST-001`, the Predicate Schema candidate
documents, Claim Reference Semantics, RFC-005, or any Approved v1.0 document.

**Implementation impact:** an implementation that later supports an approved
suite must retain the suite table and the frozen closure needed for historical
verification, construct the exact fixed frame, use the selected hash, compare
complete identity bytes, and fail closed on unknown or unavailable material.
It need not implement generic VE references, signatures, registries, online
resolution, or algorithm negotiation.

**Complexity impact:** one local immutable suite model removes the need for
per-implementation hashing conventions, mutable selectors, a global crypto
registry, and premature adoption of RFC-005's broader protocol surface.

## 14. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. The model makes byte identity explicit and inspectable without changing authority or trust semantics. |
| No unjustified primitive | Pass. A PSCID suite is a local representation construction, not a VE primitive, object, or registry. |
| Removability and locality | Pass. Generic digest/signature infrastructure, negotiation, and a global registry are removable; immutable local framing is necessary to prevent construction ambiguity. |
| Twenty-year durability | Pass. Immutable suite/profile bindings retain historical interpretability while allowing future constructions to be added without rewriting old identities. |
| Independent implementation | Pass. The future approved suite will state exact frame, profile, hash, layout, and failure behavior; no hidden context is required. |
| Reduced conceptual complexity | Pass. Local suite-defined agility is smaller than generic RFC-005 adoption, mutable suites, or negotiated cryptography. |

## 15. Open questions and acceptance gates

This RFC deliberately leaves these matters for the subsequent governed work:

- whether the current v1.1 candidate closure is promoted and frozen;
- which currently unallocated local values, if any, become `NEW_PROFILE` and
  `NEW_SUITE` after the required approval evidence;
- the final cross-language identity vectors and independent security-review
  record for any future authoritative suite.

These are acceptance gates, not authorization to allocate a code in this RFC.
No unresolved question requires accepting or modifying RFC-005.

## 16. Conclusion and next governance step

**A. PSCID SUITE-GOVERNANCE MODEL ACCEPTED.**

The minimum durable decision is a local, immutable PSCID suite that binds one
representation profile, a domain-separated frame, a hash algorithm, and an
identity layout. It preserves PSCID-1 exactly, supports future cryptographic
change through new suites, fails closed on unknown or unavailable material, and
does not generalize into VE-wide digest or signature infrastructure.

This Accepted RFC, together with Accepted ADR-008, makes the PSCID
suite-governance architecture authoritative at its declared scope. It does not
itself revise `DIGEST-001`, approve the current v1.1 closure, or allocate a
representation-profile or PSCID-suite code. A later coordinated specification
revision may allocate a permanent `NEW_PROFILE`/`NEW_SUITE` pair only after the
security and interoperability gates in Section 9 are satisfied.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-30 | Initial Draft proposing local immutable Predicate Schema content-identity suite governance; no code allocation. |
| 0.1 | 2026-08-30 | Status transitioned from Draft to Accepted; decision and scope unchanged. |
