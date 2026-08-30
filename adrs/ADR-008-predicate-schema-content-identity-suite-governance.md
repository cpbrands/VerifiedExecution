---
id: ADR-008
title: Predicate Schema Content Identity Suite Governance
version: "0.1"
status: Accepted
document_type: Architectural Decision Record
category: Architecture
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - SPECIFICATION-GOVERNANCE
  - RFC-008
related_documents:
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - ADR-ENC-001
  - RFC-005
supersedes: null
superseded_by: null
---

# ADR-008 — Predicate Schema Content Identity Suite Governance

## Status and authority boundary

**Status:** Accepted
**Related RFC:** RFC-008 — Predicate Schema Content Identity Suite Governance
**Decision:** A. ACCEPT PSCID SUITE-GOVERNANCE MODEL.

This Accepted ADR is authoritative at its declared architectural scope and
records a narrow decision for Predicate Schema Content Identity (PSCID) only.
It does not accept RFC-008, approve a specification,
allocate a representation-profile or suite code, alter `DIGEST-001`, or change
any existing PSCID-1 bytes or semantics.

RFC-005 remains an independent Draft. This ADR does not decide generic VE
object digests, generic references, signatures, signature suites, transport,
or generic cryptographic negotiation.

## 1. Context

Predicate Schema content identity requires independent implementations to know
which canonicalization closure, framing, hash construction, and identity layout
apply to retained historical identity bytes. A bare hash of canonical bytes is
insufficient: it does not bind the Predicate Schema identity family, the
representation profile, or the digest construction.

The current Draft `DIGEST-001` supplies a narrow PSCID-1 candidate, while
RFC-008 proposes the governance model required before any future suite/profile
assignment becomes authoritative. The decision question is whether PSCID
should use immutable, local construction suites rather than mutable or generic
cryptographic infrastructure.

## 2. Decision question

Should Predicate Schema content identity use a PSCID-specific immutable suite
model in which each suite binds exact framing, one representation profile, one
hash algorithm, and one identity layout, with future construction changes
represented only by new suites?

## 3. Decision options

| Option | Historical interpretation | Security and downgrade behavior | Scope and complexity | Decision |
|---|---|---|---|---|
| A. Local immutable PSCID suites | Frozen reconstruction is possible from carried suite and retained closure. | Exact binding and fail-closed unknown values. | Predicate-Schema-local; no registry or negotiation. | **Selected.** |
| B. Mutable suite definitions | Past bytes acquire new meanings. | Downgrade and relabel ambiguity. | Requires mutable coordination. | Rejected. |
| C. Algorithm negotiation in an existing suite | Depends on runtime policy rather than retained bytes. | Algorithm confusion and fallback surface. | Adds selectors and negotiation rules. | Rejected. |
| D. Generic VE crypto registry | Could centralize selection. | Broader policy and lifecycle surface. | Imports an unproven VE-wide abstraction. | Rejected. |
| E. Accept RFC-005 wholesale | Would also decide generic object and signature protocols. | Does not improve PSCID-local binding. | Imports unrelated unresolved work. | Rejected. |
| F. Cross-suite equivalence or migration aliases | Attempts to equate different constructions. | Weakens exact identity and historical verification. | Requires an equivalence mechanism. | Rejected. |

## 4. Decision

**A. ACCEPT PSCID SUITE-GOVERNANCE MODEL.**

Each PSCID suite is one immutable Predicate-Schema-specific construction recipe
that binds exactly:

~~~text
domain-separated framing
one representation_profile
one hash algorithm
one identity layout
~~~

The suite code is the construction-version discriminator. After assignment, a
suite's meaning MUST NOT change. A change to framing, representation-profile
binding, hash algorithm, identity layout, or another identity-affecting
construction element requires a new suite.

Cryptographic agility is therefore:

~~~text
changed cryptographic construction
    => new immutable PSCID suite
~~~

It is not negotiation inside an existing suite. This decision rejects separate
runtime algorithm negotiation, preferred-algorithm fields, fallback hashes,
mutable suite upgrades, and a generic crypto registry.

## 5. PSCID-1 preservation decision

This decision preserves PSCID-1 exactly as specified by the existing
`DIGEST-001` Draft candidate:

~~~text
domain token              = VEPSCID1
suite                     = h'01'
representation_profile    = h'01'
hash                      = SHA-256
identity layout           = h'01' || SHA-256(frame)
equality                  = exact 33-byte equality
~~~

`VEPSCID1` is the fixed Predicate Schema content-identity family domain token.
It is not a suite number or a token that changes for each future suite. The
carried suite byte is the construction-version discriminator. A future suite
has a distinct immutable construction but does not reinterpret historical
PSCID-1 bytes.

This ADR assigns no new code and assigns no new meaning to `h'01'`.

## 6. Representation-profile and code-table decision

A PSCID suite MUST pin exactly one immutable `representation_profile` for its
construction. A suite MUST NOT dynamically select among profiles, and an
identity MUST NOT be interpreted under a latest-profile rule.

This decision does not require global one-to-one uniqueness between suite and
representation-profile codes. A future separately governed suite may pin a
profile already used by another suite only when that construction genuinely
requires it. The required invariant is immutable binding from a suite to one
profile, not a broader uniqueness mechanism.

Suite codes are local to PSCID. Representation-profile codes are local to
Predicate Schema content identity. For both local tables:

- assignments are append-only;
- an assigned code has one immutable meaning;
- codes are never recycled or reassigned;
- historical assignments remain verifiable indefinitely; and
- unknown values MUST fail closed.

Neither table is a VE Registry primitive, a global authority, a network
service, or a generic protocol registry.

## 7. Equality, historical verification, and failure behavior

PSCID equality is exact identity-byte equality. For PSCID-1, it is exact
equality of the carried 33 bytes. This decision defines no cross-suite semantic
equality, canonical-content equality override, migration alias, automatic
upgrade, fallback identity, or equivalence table.

Thus:

~~~text
same C under different suites
    != same PSCID
~~~

Historical verification proceeds only as follows:

~~~text
carried suite prefix
    -> immutable suite definition
    -> suite-bound immutable representation_profile
    -> canonicalize and verify under that frozen closure
    -> construct the exact frame and hash
    -> compare the complete identity bytes
~~~

Latest-profile interpretation, identity relabeling, silent downgrade, suite
substitution, and unknown-suite fallback are forbidden. Missing suite or
profile material, unavailable canonical source material, or unsupported
construction makes verification unavailable and MUST fail closed.

## 8. Collision and integrity decision

A detected collision or integrity contradiction is a cryptographic-integrity
failure. It MUST NOT be treated as ordinary Predicate Schema equality, an
alias, an alternate identity, an invitation to rehash under another suite, or a
reason to repair an identity through a registry.

A future change to cryptographic assumptions is handled by a new immutable
suite for new identities. It does not mutate or repair historical identities.

## 9. Security and approval gate

A new PSCID suite MUST NOT become authoritative until all of these conditions
are satisfied:

1. the complete byte-producing canonicalization closure is frozen;
2. an independent focused security review covers framing, domain separation,
   suite/profile binding, prefix parsing, downgrade/relabel resistance, code
   confusion, exact equality, collision and second-preimage assumptions,
   historical verification, and migration behavior;
3. canonical `C` anchors and corresponding frame, digest, and identity anchors
   exist;
4. at least two independent implementations produce the same anchors;
5. downgrade, relabel, confusion, and unknown-code negative cases pass;
6. exact suite/profile code assignments receive independent audit; and
7. normal repository governance approves the suite and affected specifications.

Candidate values on a Draft branch may be used for validation only. They are
not permanent assignments, accepted suite meanings, or portable conformance
targets until the final governed approval records them.

This is a review of PSCID's use of standard cryptography and canonical framing;
it does not require VE to prove SHA-256 or invent a hash function.

## 10. Current v1.1 candidate boundary

The current external-subject work provides this candidate byte-producing
closure:

~~~text
Predicate Schema Semantic Contract v1.1
Predicate Schema Canonical Representation Profile v1.1
Predicate Schema Field-Semantic Representation Grammar v1.0
ADR-ENC-001 / VE-CBOR-1 v0.1
~~~

This list is context only. It does not approve that closure or allocate its
profile/suite pair. Claim Reference Semantics v0.2 remains an external semantic
dependency, not a member of the canonical-byte closure. RFC/ADR-007 are
architectural authority, and vectors are conformance evidence; neither becomes
profile-hashed canonical content through this decision.

## 11. RFC-005 and other boundaries

RFC-005 remains Draft and independent. This ADR does not decide or import
generic VE object digests, generic references, signatures, signature suites,
transport, generic cryptographic negotiation, key management, trust anchors,
or Claim verification.

This decision creates no VE primitive, generic content identity, generic hash
or digest reference, generic semantic-fragment identity, generic crypto
registry, or Root Authority role. It does not alter Action, Event, Claim,
Verification, Trust Context, Rule/Evaluate, or issuer identity semantics.

## 12. Consequences and governance sequence

This Accepted ADR is the authoritative architecture decision for a
Predicate-Schema-local suite model. It does not itself revise `DIGEST-001`,
allocate codes, approve the current v1.1 closure, update `OPEN_DECISIONS`, or
modify an Approved specification.

The governance sequence is:

~~~text
RFC-008 Draft proposal
    -> ADR-008 Proposed review
    -> ADR-008 Accepted decision
    -> RFC-008 Accepted status transition
    -> coordinated governed specification revisions, evidence, and only then
       permanent suite/profile allocation
~~~

RFC-008 does not need to become Accepted before this ADR can be reviewed or
accepted. The Accepted ADR is the decision record required before RFC-008 can
become Accepted and before a future specification change proceeds.

## 13. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Identity construction is explicit and inspectable while authority and trust remain outside PSCID. |
| No new primitive | Pass. A PSCID suite is a local representation construction, not a VE primitive, object, or Registry. |
| Locality and removability | Pass. Generic crypto infrastructure, negotiation, aliases, and RFC-005 wholesale adoption are removable; immutable local binding is necessary for unambiguous historical identity. |
| Twenty-year durability | Pass. Frozen suites retain old interpretation and permit a future construction without retroactive rewrite. |
| Independent implementation | Pass. An approved suite will supply exact profile, frame, hash, layout, and failure rules without hidden services. |
| Reduced conceptual complexity | Pass. One local immutable suite model is smaller than negotiation, mutable suites, or generic registry machinery. |

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-30 | Initial Proposed PSCID-only suite-governance decision; no suite or profile allocation. |
| 0.1 | 2026-08-30 | Status transitioned from Proposed to Accepted; decision and scope unchanged. |
