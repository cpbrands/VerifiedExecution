---
id: CHANGELOG
title: Verified Execution Repository Changelog
version: 1.0
status: Active
document_type: Changelog
category: Governance
author: Verified Execution Editorial Board
created: 2026-08-22
updated: 2026-09-02
depends_on:
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Verified Execution Repository Changelog

This changelog records repository-wide semantic, governance, status, and structural changes. Specification-specific changelogs remain authoritative for changes to their specifications.

## 2026-09-02 — Predicate Schema v1.2 comparison semantics and PSCID v0.3 approval

- **Specifications:** Predicate Schema Semantic Contract v1.2, Predicate
  Schema Canonical Representation Profile v1.2, and DIGEST-001 v0.3.
- **Version:** Draft v1.2 → Approved v1.2 for the Semantic Contract and
  Canonical Representation Profile; Draft v0.3 → Approved v0.3 for DIGEST-001.
- **Classification:** Class B — compatible semantic extension.
- **Summary:** Approved optional normalized structural comparison semantics
  inside `PredicateSchema.value_semantics`, including equality capability and
  Integer-only ordered comparison. Comparison is permitted only after local
  validity, explicit capability, and identical normalized comparison semantics;
  otherwise the result is `NOT COMPARABLE`, not false.
- **Affected semantics:** `representation_profile = h'03'` and PSCID suite
  `h'03'` are permanently assigned to the approved v1.2 Predicate Schema
  canonicalization closure. Approved DIGEST-001 v0.3 fixes its framing,
  SHA-256 construction, exact 33-octet identity layout, and anchors.
- **Compatibility:** Valid v1.1 schemas without `comparison` retain identical
  canonical bytes. PSCID-1 `h'01'` and the v1.1 `h'02'` profile/suite remain
  unchanged. This change introduces no `Quantity`, `Money`, `Currency`, `Unit`,
  or `ValueDomain` primitive, cross-domain conversion, generic arithmetic,
  trust inference, historical-identity supersession, or resolution of Draft
  RFC-005 generic digest infrastructure.
- **Authority:** Accepted RFC-010/ADR-010 and RFC-008/ADR-008.

## 2026-08-30 — Predicate Schema v1.1 and PSCID v0.2 approval

- **Specifications:** Predicate Schema Semantic Contract v1.1, Predicate
  Schema Canonical Representation Profile v1.1, and DIGEST-001 v0.2.
- **Version:** Draft v1.1 → Approved v1.1 for the Semantic Contract and
  Canonical Representation Profile; Draft v0.2 → Approved v0.2 for
  DIGEST-001.
- **Classification:** Class B — compatible semantic extension.
- **Summary:** Approved `subject_domain` semantics and
  `ExternalSubjectReference` support within the closed Predicate Schema model,
  the corresponding bounded v1.1 canonical representation profile, and the
  Predicate-Schema-specific PSCID binding.
- **Affected semantics:** `representation_profile = h'02'` and PSCID suite
  `h'02'` are permanently assigned to the approved v1.1 Predicate Schema
  canonicalization closure. Approved DIGEST-001 v0.2 fixes the associated
  framing, SHA-256 construction, exact 33-octet identity layout, and anchors;
  PSCID-1 and the v1.0 closure remain unchanged.
- **Compatibility:** Valid v1.0 Predicate Schemas that use neither
  `subject_domain` nor `ExternalSubjectReference` retain identical canonical
  bytes. The change does not claim Claim-reference wire conformance, solve
  CAD/unit semantics, resolve Draft RFC-005 generic digest infrastructure, or
  introduce a VE Entity model.
- **Authority:** Accepted RFC-007/ADR-007 and RFC-008/ADR-008.

## 2026-08-30 — VE-002 v0.2 approval

- **Specification:** VE-002 Event Specification
- **Version:** Draft v0.2 → Approved v0.2
- **Classification:** Approved specification transition
- **Summary:** VE-002 Event Specification approved with portable `event_id`
  conformance using the accepted VE OccurrenceId representation.
- **Affected semantics:** Event occurrence identity is now portable: an
  `event_id` is exactly 32 opaque octets with exact ordered-octet equality and
  the canonical VE-CBOR-1 `h'58 20' || payload` representation. VE-002 remains
  occurrence-based, not content-addressed.
- **Compatibility:** No VE-001 change, Event digest or content identity,
  registry or resolver, or generator requirement is introduced.
- **Authority:** RFC-009 and ADR-009.

## 2026-08-28 — Predicate Schema canonicalization v1.0 freeze

- Promoted the Predicate Schema Canonical Representation Profile, Field-Semantic
  Representation Grammar, and Semantic Contract from Draft v0.1 to Approved
  v1.0 as one machine-behavior freeze.
- Pinned the closure to those v1.0 specifications and accepted `ADR-ENC-001`
  v0.1; no new VE primitive or Claim field was introduced.
- Added normative Predicate Schema canonicalization vectors for accepted and
  rejected bounded-subset inputs, including reference expansion.
- Did not approve unrelated Draft Claim, Event, RFC, verification, trust, or
  runtime-resolution specifications. DIGEST-001 remains separate and blocked
  until this closure and its vectors are merged.

## 2026-08-24 — Editorial integrity

- Marked the completed authority-coherence stage as complete.
- Archived the completed DOC-001 metadata-normalization register.
- Updated completed migration and placeholder-cleanup references to past tense.
- No architecture, specification, RFC/ADR decision, or normative requirement changed.

## 2026-08-22 — Authority and repository alignment

### Governance

- Added the Architecture Authority Index.
- Added the Open Decision Register.
- Separated architectural decisions from remaining specification tasks.
- Confirmed the six-primitive specification family as authoritative pending formal revision.
- Classified the reduced `Action / Claim / Rule / Verify / Evaluate` model as non-normative validation work.

### Decisions

- Corrected RFC-004 to Accepted, consistent with ADR-004 and approved VE-001 v0.2.
- Accepted ADR-ENC-001 at the narrow decision scope selecting VE-CBOR-1.
- Accepted ADR-RULE-001/002 at the narrow decision scope selecting VE-CEL-1.
- Limited ADR-VERIFY-002 to optional COSE verification profiles; COSE is not the sole VE signature representation.
- Recovered ADR-001 as the decision record corresponding to accepted RFC-001.

### Repository alignment

- Updated README topology and replaced the obsolete Gateway term with Execution Boundary.
- Added the Reference Scenario Index.
- Aligned Architecture, Roadmap, and Conformance with the authority index.
- Removed `KERNEL_VALIDATION` as a normative conformance dependency.
- Relocated root-level resolution patches to `kernel-analysis/patches/` as historical non-normative records.
- Removed empty implementation roadmap placeholders and the duplicate `implementation/ADRs/` placeholder.
- Began DOC-001 metadata normalization and added a migration register.

### Protocol work

- Added Draft RFC-005 to define the scope and acceptance gates for Canonical Representation Profile 1, typed digest framing, Digest Reference, ObjectReference, Signature Record, verification-material references, and optional COSE profiles.
- RFC-005 deliberately leaves exact resource bounds, mandatory algorithm suites, and certain object schemas open pending evidence.

### Reconciliation prerequisites and proposal work

- Recorded the duplicate-body cleanup already present on `main` for ADR-ENC-001, ADR-RULE-001/002, and ADR-VERIFY-002 as prerequisite work, not a change introduced by this proposal branch.
- Recorded VERIFY-003 issuer-to-verifier binding as resolved at the limited scope already accepted by ADR-VERIFY-002.
- Added proposed RFC-006 for future consideration of a semantic-kernel and execution-history organizational model. Repository inclusion does not accept that model or change approved specifications.

## Historical specification changes

- VE-001 v0.2 introduced two-layer Action identity under RFC-004 and ADR-004.
- VE-004 v0.2 remains proposed/draft under RFC-003 and ADR-003.

See `specifications/VE-001-CHANGELOG.md` and `specifications/VE-004-CHANGELOG.md` for specification-level detail.
