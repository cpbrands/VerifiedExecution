---
id: "RFC-014"
title: "Add Separately Selected Action-owner Successors Without Changing Fixed Core Contracts"
version: "0.1"
status: "Accepted"
document_type: "RFC"
category: "Architecture"
author: "Verified Execution"
created: 2026-10-25
updated: 2026-10-25
depends_on:
  - "SPECIFICATION-GOVERNANCE"
  - "VE-001"
  - "ADR-ENC-001"
related_documents:
  - "ADR-014"
  - "VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE-SUCCESSOR"
  - "LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA-SUCCESSOR"
  - "LYNX-UG2026-ACTION-OWNER-SOURCE-ANNEX"
supersedes: null
superseded_by: null
---

# Add separately selected Action-owner successors without changing fixed core contracts

Identifier: **RFC-014** — allocated by the recorded owner decision; allocation is not a repository-path reservation.  
Status: **Accepted — additive design/governance decision only; not specification approval, integration or publication.**  
Prepared: 25 October 2026, America/Edmonton (26 October UTC).  
Related ADR: [ADR-014](../adrs/ADR-014-action-owner-successors.md), Accepted within the same bounded decision.

Governance-document revision: **0.1**. The Founder, acting in the declared authorized successor-owner capacity, accepted the bounded design on 25 October 2026, America/Edmonton; the coordinator recorded acceptance at 02:40:33 UTC on 26 October. The recording time is not an independently established timestamp of the human message or a publication date. ADR-014 states the accepted decision and its limits. This publication-form preparation adds metadata and reconciles navigation/provenance, not the technical design. Original approval evidence is retained separately; this owner-decision statement is not independent identity verification or certification of complete authority-material closure.

## Context

Approved VE-001 owns the Action primitive, occurrence/content identity and authority distinctions. Its §§6–9 delegate schema semantics and concrete encoding, framing, suite and Unicode treatment. Accepted ADR-ENC-001 fixes the applicable canonical constraints. Delegation does not authorize a subordinate owner to waive either contract.

The current public Draft proposal adds a canonical successor, bounded Lynx schema successor and common source annex. Earlier exact Action-owner publications remain separate. The successor makes its descriptor, standard-definition roles and support obligations explicit; old rendered examples or reviewer outputs cannot select those rules.

The assessed design baseline is the three draft-1 Action-owner sources at [immutable commit 313a2f3](https://github.com/cpbrands/VerifiedExecution/tree/313a2f3eba707aa901dbeba51a327bc32081fcce). This observed repository location is not an independently adopted agreeing context. UGD-1 is the coordinator's local label for the owner-adopted bounded UTF-8/NFC source-text finding restated here and in ADR-014, not an additional allocated publication or byte-function input. The Founder accepted this RFC and ADR-014's additive design/Class B decision; that does not grant Approved status to the Action specifications or waive necessary exact authority evidence.

## Proposed change

Introduce the three sources as **additional, explicitly selected subordinate contracts**, not replacements under old names, selectors or contexts:

- `VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE-SUCCESSOR`, assessed revision `0.2-draft.1`.
- `LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA-SUCCESSOR`, assessed revision `0.2-draft.1`.
- `LYNX-UG2026-ACTION-OWNER-SOURCE-ANNEX`, assessed revision `0.1-draft.1`.

Retain the exact descriptor-local version **2**, native notation, sixteen already-selected interpretation-source keys and their role restrictions. Do not amend VE-001, ADR-ENC-001, historical S06/S11 or Event/Lifecycle semantics. Preserve the separate agreeing-context requirement and conflict veto.

Use the existing dependency order **annex → canonical profile → schema → external agreeing context** when a later authorized binding pass occurs. Do not manufacture self-hashes, future-schema pins in the canonical profile, or authority from branch metadata. This RFC allocates no publication key, governing context, Event Type or representation selector.

## Motivation

Independent implementations need one complete descriptor, exact standard responsibilities and explicit failure/availability boundaries. Making those commitments visible prevents implementation defaults, guessed source editions and old examples from becoming undocumented authority. A new separately identified contract permits that work without rewriting historical meaning.

## Compatibility classification

**Accepted classification: Class B for this additive three-source introduction at VE-001's selection boundary.** Existing valid behavior is preserved by retaining old contracts and their selections, not by asserting that a successor is interchangeable with a predecessor. This accepted classification is limited to that stated scope; it is not a conformance or interoperability certificate.

| Component and source location | Substantive assessment | Compatibility limit |
|---|---|---|
| UTF-8/NFC: canonical §3; schema §§5–6 | UGD-1 finds identical numeric UTF-8 and a genuine scoped Unicode 6.2 NFC application within delegated treatment. No fixed-core change is needed for these text rules. | The bounded finding is already owner-adopted; no global S04 reinterpretation, all-edition equivalence, private-use ban or Event T restriction. |
| SHA-256: canonical §§5–7/13 | Names the selected FIPS 180-4 function and its per-input domain; preserves delegated schema/content framing and raw outputs. Retained structural bounds put the fixed schema frame at ≤21,441 octets and content frame at ≤504. | These are copied bounds, not emitted sizes or tests. No claim of the old function's complete closure/equality, unlimited SHA-256 domain, new generic O cap or security certification. Other schemas/material uses need their own domain argument. |
| Descriptor: schema §7 | One complete version-2 logical S and explicit native mapping resolve successor authority without choosing between historical competing renderings. | Different logical S is not a backward-compatible identity claim. Derive successor digest values only under separate authority; never substitute old values or infer guaranteed hash inequality. |
| Lynx/ISO scope: schema §§2–4/8 | Bounded intent, CAD scale/limits, account branch, mapping/charge constraints and completion proposition are directly stated. ISO tables/base artifacts are not hidden runtime inputs to that fixed predicate. | No blanket E03 closure, complete ISO/Lynx message conformance, production applicability, account facts or settlement evidence follows. Broader message claims need their own exact artifacts. |
| Action structure/identity: canonical §§4/6–10 | Preserves the VE-001 occurrence/content split, native shapes, schema-bound content, contextual comparisons and absence of self-authorization. | No new primitive or occurrence-ID generator; no cross-profile equality or silent change to authoritative identifier uniqueness. |
| Definition/language roles: canonical §§1–2/12; annex | Exact language and normalization/property responsibilities use the recorded selected keys; materials remain outside Action semantic frames. | Sixteen selected keys are not a complete recursive Materials/ActionInline/OwnedOctets certificate or new publisher authentication. Each closure follows its own operative edges. |
| Failure/resource boundaries: canonical §11; schema §9 | Reject malformed originals; missing definitions, unsupported selections and unfinished computation cannot yield successful support claims. | Do not convert resource/availability limits into false external assessments, new semantic outcomes, or altered Event admission/replay. |

All these additions are substantive contract commitments; the whole proposal is **not editorial/Class A**. Similar field grammar or retained frame labels do not establish old/new descriptor or digest equivalence.

If the intended operation changes to replacement of an existing selection, invalidates previously conforming behavior, changes existing meaning or reinterprets fixed core constraints, stop this Class B route and assess **Class C** under Governance §9. That requires affected invariants, migration/compatibility analysis, applicable major-version treatment and the required justification that the existing architecture cannot satisfy the requirement. A new filename alone does not cure such a change. None of that replacement/migration is proposed here.

### Documented compatibility behavior

An old context continues to use its old exact contract. A new context must independently select an agreeing successor pair and definitions. A consumer lacking that selection/support cannot treat the new item as old merely because its shape or raw octets match. Keep the records separately identified; this proposal defines neither mixed-history interpretation nor a translation, re-signing, identifier migration or digest substitution procedure. Adoption by an old deployment is opt-in and requires its own context and evidence decisions.

## Alternatives considered

1. **Keep only the old contracts:** preserves history, but leaves the successor's intended explicit commitments unavailable. Retention remains required, not sufficient for the new target.
2. **Edit/reinterpret old sources as a clarification:** rejected; it would hide changed descriptor/selection responsibilities and presume historical equivalence.
3. **Change fixed core or globally select Unicode 6.2:** unnecessary for this scoped proposal and outside its delegated authority.
4. **Wholesale-import ISO/Unicode facilities or current libraries:** rejected for the fixed predicate; it adds unused or moving responsibilities. Separate broader claims still require their necessary artifacts.
5. **Replace the old contract through a breaking migration:** not selected; needs its own Class C case and migration specification rather than this additive rationale.

## Architectural decision test

1. **Founding consistency:** intent, authorization, execution and evidence remain distinct; serialization creates none of the latter three.
2. **Primitive necessity:** no primitive, registry, resolver, generic schema language or wire wrapper is introduced.
3. **Removability:** an independently selected representation/schema can be replaced through another explicit governed selection without rewriting the Action primitive or old histories.
4. **Durability:** fixed definitions and immutable selection responsibilities avoid dependence on a model, host library or current standards table. This is not a longevity/security guarantee for SHA-256.
5. **Independent implementability:** one S, native mapping and exact roles make the intended contract available; binding, closure and conformance evidence remain necessary for an implementation claim.
6. **Complexity:** reuse three definition sources and already-selected standard bodies rather than a new abstraction or competing normalization algorithm. Explicit role boundaries remove hidden inputs; acquisition/carriage and audit costs remain real and are not justified by copying the whole corpus into every owned object.

## Security impact

Reject duplicate keys, noncanonical originals, malformed UTF-8, non-NFC input and ambiguous selections without repair into acceptance. Keep suite/domain/framing fixed; no truncation, length wrap or substitute chunk hash. Retain the cryptographic collision assumption rather than asserting mathematical collision-freedom.

Hashes identify bytes, not trusted publishers, owner authority, verified account facts or execution. Preserve independent expected-key establishment, provenance limits and source-conflict rejection. Private-use lexical admission is not authorization. External message/evidence obligations remain with their responsible owners. No new security assessment or certification was performed for this RFC.

## Complexity impact

The three publications and role-specific closure obligations add documentation, interpretation and carriage costs. The benefit is deterministic, reviewable responsibility instead of implicit defaults. No fourth normative definition publication is added by this RFC, its ADR, the ledger or UGD-1 merely through informative citation; any later operative governance/interpretation edge must be assessed explicitly.

## Specification impact

The [repository changelog](../CHANGELOG.md) records the assessed predecessor/successor revisions and the subsequent metadata/status integration trace. Fixed core and old sources remain unchanged; `supersedes` is not populated by implication. P-NEXT/R-NEXT remain separate, incomplete Route-B work, not approved by this Action-owner RFC.

RFC acceptance and ADR recording are distinct from any authorized integration operation. Integration still requires correct governance references, applicable revision/history/changelog treatment, preservation of the approved technical literal and checking of affected source bindings. The draft-2 publication preparation records governance/status/navigation integration without changing that literal or the encoding/admission rules. The assessed public Draft revision labels do not authorize overwriting an immutable selected body or preallocate an eventual adoption revision. If integration needs technical changes, return with a versioned content proposal.

## Implementation impact

No implementation, codec or test change is included. Later claim-appropriate work should cover exact descriptor/native mapping, framing/domain calculations, canonical/duplicate rejection, field and Unicode boundaries, selected-definition agreement, missing/conflicting sources, bounded resource outcomes and profile-context mismatch. Test account rules with the fixed category predicate, including permitted private-use behavior; do not use library defaults as an edition selector.

Actual-message/settlement and true-positive authority claims need separate established contracts/evidence, not synthetic verification statuses. These are not prerequisites merely to retain a Draft proposal. No old reviewer oracle is migrated; any successor review engagement requires separate authorization and a new target.

## Open questions and gates

- UGD-1's bounded finding and this RFC's scoped additive design/Class B classification are accepted. Remaining integration, binding and evidence gates do not reopen those recorded decisions.
- RFC-014 and ADR-014 are owner-allocated and accepted. Metadata/status integration and public navigation do not establish independently adopted publication/context bindings or reserve a server-side path.
- Independently adopted successor publication/context bindings and role-specific recursive closure remain incomplete. Previously selected sixteen keys are not reopened merely because those different obligations remain.
- Implementation evidence, any maturity promotion and interoperability clearance remain separate. RFC-004's Approved-canonical-profile prerequisite still applies; RFC acceptance is not profile approval.

## Decision

**Accepted by the Founder acting in the declared authorized successor-owner capacity:** RFC-014 and ADR-014 are allocated and the additive three-source design/Class B classification is accepted with the compatibility limits above. Preserve the already-adopted UGD-1 finding. This decision does not supersede or reinterpret old sources, promote specification lifecycle state, bind a context or authorize source integration/execution.

The design-acceptance decision covers allocation, the scoped design and governance records only. It is not permission for repository operations, publication, merge, new acquisition/hash, byte derivation, reviewer contact, opaque fill or Phase-B release. Subsequent preparation/integration needs its own scope; publication does not certify those other activities or their results. Recursive closure **NOT CLOSED**; Phase B **CLOSED**.

## Source basis

Read retained fixed [Governance §§9–13/21](https://github.com/cpbrands/VerifiedExecution/blob/56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f/SPECIFICATION_GOVERNANCE.md), [VE-001](https://github.com/cpbrands/VerifiedExecution/blob/56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f/specifications/VE-001-action-specification.md) and [ADR-ENC-001](https://github.com/cpbrands/VerifiedExecution/blob/56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f/adrs/ADR-ENC-001-VE-CBOR-1.md); use the retained successor source clauses and prior descriptor/selection/audit records. This is source-based proposal analysis, not fresh independent verification of standard algorithms, full closure or mutable remote state. UGD-1 and earlier approvals retain their own dates, scopes and status.
