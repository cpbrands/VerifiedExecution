---
id: ADR-012
title: Predicate Integer Canonical-Key Conformance Correction
version: "0.1"
status: Accepted
document_type: ADR
category: Representation
author: Verified Execution Editorial Board
created: 2026-09-11
updated: 2026-09-11
depends_on:
  - SPECIFICATION-GOVERNANCE
  - RFC-012
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - ADR-008
related_documents:
  - GAP-ANALYSIS-PREDICATE-INTEGER-CANONICAL-KEY-CONFLICT
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE
  - OPEN-DECISIONS
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
supersedes: null
superseded_by: null
---

# ADR-012 — Predicate Integer Canonical-Key Conformance Correction

## 1. Status and authority boundary

**Status:** Accepted
**Related RFC:** RFC-012 — Predicate Integer Canonical-Key Conformance
Correction
**Decision:** A. RETAIN `minimum` / `maximum` AND CORRECT NONCONFORMING
CONFORMANCE MATERIAL.

This Accepted ADR is authoritative at its declared decision scope. It records
the governance decision authorizing the later coordinated correction. It does
not itself revise DIGEST-001, the Predicate Schema
Canonical Representation Profile, conformance vectors, validators, CHANGELOG,
OPEN_DECISIONS, or any Claim representation.

The governance layers remain distinct:

~~~text
RFC-012
    -> proposal, evidence, rationale, and alternatives

accepted ADR-012
    -> architectural and governance decision

coordinated governed revisions
    -> actual DIGEST, conformance-vector, validator, and support-file changes
~~~

Acceptance authorizes the later coordinated correction, but implementation
must occur through the governed revisions identified below. This ADR alone
does not permit an implementation to emit new expected values or reinterpret
any Approved artifact.

## 2. Context

The Approved Predicate Schema Field-Semantic Representation Grammar v1.0
describes conceptual Integer bounds as:

~~~text
lower_bound
upper_bound
~~~

The Approved Predicate Schema Canonical Representation Profile v1.2 owns the
serialized Predicate Schema representation. Its Section 5.2 defines the exact
canonical Integer-node members as:

~~~text
minimum
maximum
~~~

These names occupy different layers. Conceptual grammar vocabulary does not
automatically become canonical serialized field vocabulary.

Approved DIGEST-001 v0.3 binds PSCID suite/profile `h'03'/h'03'` to the
Predicate Schema v1.2 byte-producing closure. It consumes the canonical bytes
`C` produced by that closure. DIGEST-001 expressly excludes itself,
conformance vectors, and validators from the byte-producing closure and does
not independently own or redefine Predicate Schema serialization.

Despite that dependency direction, affected DIGEST-001 anchors, the Approved
v1.2 conformance-vector artifact, and its Python and Node validators serialize
bounded Integer nodes with `lower_bound` / `upper_bound`. They therefore
produce a different canonical byte string and PSCID from the representation
required by the canonical profile.

For the anchor-A scale-2 CAD fixture, independent reconstruction gives:

| Path | Canonical `C` | DIGEST frame | PSCID |
|---|---:|---:|---|
| Conforming `minimum` / `maximum` path | 350 octets | 367 octets | `039a4774bb744ee566229aac22caa89af19b2b72d0f72df7d9cf62bc5281f96603` |
| Published `lower_bound` / `upper_bound` path | 358 octets | 375 octets | `032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010` |

The difference changes identity while leaving the conceptual interval and
Predicate meaning unchanged. Self-consistent validators reproduce the
published error but cannot make it conforming.

## 3. Decision

**A. RETAIN `minimum` / `maximum` AND CORRECT NONCONFORMING CONFORMANCE
MATERIAL.**

This Accepted ADR establishes the following decision.

### 3.1 Canonical representation ownership

`minimum` and `maximum` remain the authoritative canonical serialized members
for bounded Integer nodes under the Predicate Schema Canonical Representation
Profile v1.2.

`lower_bound` and `upper_bound` remain conceptual Field-Semantic
Representation Grammar names only. A source adapter may consume those
conceptual names, but the canonical serializer must emit the exact canonical
members owned by the representation profile.

DIGEST-001 consumes the exact canonical bytes produced by the profile closure.
It defines PSCID framing and identity derivation from `C`; it does not define
an alternate Predicate Schema byte representation.

### 3.2 Conformance correction

The affected DIGEST-001 anchors and explanations, governed conformance
vectors, and Python and Node validator behavior are nonconforming where they
serialize or expect `lower_bound` / `upper_bound` as canonical Integer-node
members. They must be corrected to consume or emit `minimum` / `maximum`.

The coordinated correction must regenerate every affected complete canonical
byte sequence, diagnostic hash, DIGEST frame, and PSCID independently. It must
also replay unaffected evidence to demonstrate that the correction remains
bounded to canonical Integer member names.

### 3.3 Unchanged semantics, profile, and suite

The correction does not change:

- Predicate interval meaning, validity, inclusion, scale, or equality;
- the Predicate Schema Semantic Contract;
- the Field-Semantic Representation Grammar's conceptual vocabulary;
- the Predicate Schema Canonical Representation Profile v1.2 recipe;
- VE-CBOR-1 encoding rules;
- PSCID framing, hash algorithm, identity layout, or collision handling; or
- PSCID representation-profile and suite codes `h'03'/h'03'`.

Correcting downstream evidence to match an unchanged frozen recipe is a
versioned conformance correction. It is not a successor canonical profile or
successor identity suite.

### 3.4 Identity consequence

The conforming anchor-A identity under the existing authoritative closure is:

~~~text
039a4774bb744ee566229aac22caa89af19b2b72d0f72df7d9cf62bc5281f96603
~~~

The published conflicting identity:

~~~text
032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010
~~~

was never conforming for that fixture under the authoritative `h'03'/h'03'`
closure. It is not an alias, legacy-valid identity, alternate canonical form,
or second representation profile. No equality, migration registry,
dual-validity rule, or fallback interpretation is created between the two
values.

## 4. Compatibility consequences

The decision has this compatibility classification:

| Dimension | Consequence |
|---|---|
| Predicate semantic meaning and equality | Unchanged |
| Authoritative canonical representation recipe | Unchanged |
| Correct PSCID construction and meaning | Unchanged |
| PSCID suite/profile `h'03'/h'03'` | Unchanged |
| Affected published anchors, diagnostics, and validator outputs | Corrected |
| Unaffected conformance evidence | Preserved and replayed |

The change is machine-consequential because affected expected bytes, hashes,
and PSCIDs change. It is therefore governed as an Approved-specification
correction rather than treated as unreviewed editorial cleanup.

Repository evidence found no additional tracked Claim, Rule, or Reference
Scenario embedding the conflicting anchor-A identity. That does not prove an
external deployment has never emitted, stored, signed, or relied on it. Such a
deployment may require remediation under its own retained evidence and
authorization rules. This decision does not require universal Claim
reissuance, silently rewrite signed material, or infer equivalence between
distinct PSCIDs.

## 5. Authorized future correction scope

This Accepted ADR authorizes a later coordinated governed change to
exactly these existing paths.

### 5.1 Approved specification

~~~text
specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md
~~~

DIGEST-001 requires a version increment, corrected affected anchors and
explanations, an ADR/RFC reference, and revision history. The exact next
version is selected in the coordinated revision; this ADR does not assign it.

### 5.2 Governed conformance artifact

~~~text
test-vectors/PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE.md
~~~

The Approved v1.2 conformance artifact requires a distinguishable corrected
revision covering affected A2/A3 diagnostics, anchors A/D, and bounded-Integer
regressions. The exact revision label is selected in that governed change.

### 5.3 Derived validators

~~~text
test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.py
test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.mjs
~~~

Both validators must preserve conceptual bound processing while emitting the
exact canonical `minimum` / `maximum` representation and independently
reproducing corrected evidence.

### 5.4 Governance and support

~~~text
CHANGELOG.md
OPEN_DECISIONS.md
~~~

CHANGELOG records the conformance and compatibility correction.
OPEN_DECISIONS updates the PSCID-001 current DIGEST version pointer only when
the corrected DIGEST revision becomes Approved. Neither file becomes a
semantic or representation owner.

No other file is authorized for modification merely by this decision. In
particular, it does not authorize changes to the Semantic Contract,
Field-Semantic Representation Grammar, Canonical Representation Profile,
historical v1.0/v1.1 vectors, Claim Body Schema, Rule/Evaluate specifications,
or ARCHITECTURE_INDEX.

## 6. Governance and sequencing

Accepted RFC-012 remains the approved proposal and rationale for this
decision. This Accepted ADR records the architectural and governance
resolution. Neither artifact implements the correction.

Because DIGEST-001 is Approved and the correction changes conformance-critical
anchors and machine outputs, RFC-012 and ADR-012 acceptance completes the
governance prerequisite. Implementation still requires:

1. a versioned DIGEST-001 revision;
2. a distinguishable governed conformance-artifact revision;
3. coordinated Python and Node validator corrections;
4. a CHANGELOG entry;
5. an OPEN_DECISIONS current-version pointer update when the DIGEST revision
   is Approved; and
6. independent validation before the coordinated correction is merged.

One RFC and one ADR are sufficient because the problem is one coherent
ownership and conformance correction. No additional architectural decision,
new VE-xxx allocation, or primitive is required.

The VE-CBOR-1 Claim Body Schema v0.2 work remains blocked until the coordinated
correction is merged, independently verified, and authoritative on `main`.
This ADR does not resume or modify that work.

## 7. Consequences

### 7.1 Positive consequences

- one conceptual bounded Integer schema again has one conforming canonical
  representation under the selected profile;
- independent implementations can converge on one PSCID;
- canonical representation ownership remains explicit;
- the immutable `h'03'/h'03'` construction is preserved; and
- no compatibility infrastructure or new runtime object is introduced.

### 7.2 Costs and risks

- affected Approved anchors, diagnostics, and validator expectations require a
  coordinated versioned correction;
- external use of the nonconforming identity, if any, requires
  deployment-specific assessment; and
- the Claim Body Schema workstream remains blocked until the correction lands.

### 7.3 Primitive and allocation boundary

This decision introduces no:

- content-identity or alias primitive;
- compatibility registry, resolver, or translation service;
- migration object or dual-validity mechanism;
- new VE-xxx specification allocation;
- new PSCID suite or representation-profile code; or
- change to the kernel primitive set.

## 8. Rejected alternatives

| Alternative | Decision |
|---|---|
| Change the canonical profile to `lower_bound` / `upper_bound` | Rejected. It would alter previously Approved bounded-Integer canonical bytes and require a successor profile, suite, broader compatibility analysis, and migration treatment without evidence of an intended rename. |
| Treat both spellings and PSCIDs as valid | Rejected. It defeats canonicalization and requires alias or equivalence machinery. |
| Treat the conflicting PSCID as legacy-valid | Rejected. It was never conforming under the authoritative `h'03'/h'03'` closure. |
| Let DIGEST-001, vectors, or validators override the canonical profile | Rejected. They consume or test the byte-producing closure and do not own Predicate Schema serialization. |
| Introduce a successor suite/profile while retaining `minimum` / `maximum` | Rejected. Correcting evidence to match the unchanged recipe does not justify a new identity construction. |
| Leave the contradiction unresolved | Rejected. Implementations can derive consequentially different identities while citing conflicting Approved material. |

## 9. Security implications

Restoring one canonical representation reduces identity-confusion and
substitution risk. A nonconforming validator-generated identity cannot be
treated as an alternate representation of conforming content.

Exact PSCID byte equality, collision handling, signature integrity, Claim
verification, issuer trust, and authorization remain governed by their
existing owners. This decision adds no downgrade path, algorithm negotiation,
network lookup, registry, or trust mechanism.

## 10. Explicit non-decisions

This ADR does not decide or authorize:

- a change to Predicate meaning or comparison semantics;
- a change to canonical admission, normalization, structure, or encoding;
- a successor PSCID profile or suite;
- a universal external-deployment migration procedure;
- a Claim-body field or representation;
- cross-identity equivalence;
- a registry, resolver, alias, or translation mechanism; or
- any new architectural primitive.

## 11. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles | Pass. The decision restores one explicit canonical authority and deterministic independent verification. |
| Primitive burden | Pass. No primitive, registry, resolver, alias, or service is introduced. |
| Removability | Pass. No new architectural object is added; removing the correction would restore consequential ambiguity. |
| Twenty-year durability | Pass. Fixed canonical member names and retained history do not depend on a library, deployment, or online service. |
| Independent implementability | Pass. Independent Python and Node reconstructions converge on the retained canonical recipe and conforming PSCID. |
| Reduced conceptual complexity | Pass. One authoritative representation replaces accidental dual behavior without compatibility machinery. |

## 12. Decision record

The decision requested is:

> Retain `minimum` / `maximum` as the canonical bounded-Integer member names,
> retain `lower_bound` / `upper_bound` as conceptual grammar names, and
> correct the nonconforming DIGEST-001 anchors, governed conformance evidence,
> and derived validators without changing Predicate semantics, the canonical
> profile, or PSCID suite/profile `h'03'/h'03'`. The published
> `032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010`
> identity is not conforming or aliased; the conforming identity is
> `039a4774bb744ee566229aac22caa89af19b2b72d0f72df7d9cf62bc5281f96603`.

This Accepted ADR makes the architectural and governance resolution
authoritative. The resolution is implemented only by the later coordinated
revisions listed in Section 5.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-11 | Initial Proposed ADR recording the Predicate Integer canonical-key conformance correction. |
| 0.1 | 2026-09-11 | Status transitioned from Proposed to Accepted; decision, correction scope, compatibility analysis, and governance rationale unchanged. |
