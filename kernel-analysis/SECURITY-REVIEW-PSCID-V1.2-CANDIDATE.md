---
id: SECURITY-REVIEW-PSCID-V1.2-CANDIDATE
title: Security Review — PSCID v1.2 Candidate
version: "0.1"
status: Draft
document_type: Security Review
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-01
updated: 2026-09-01
depends_on:
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - ADR-ENC-001
  - RFC-008
  - ADR-008
related_documents:
  - PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE
  - SECURITY-REVIEW-PSCID-VNEXT-CANDIDATE
supersedes: null
superseded_by: null
---

# Security Review — PSCID v1.2 Candidate

## Status and scope

This document is **non-normative candidate evidence**. It reviews a possible
PSCID successor for the Draft Predicate Schema v1.2 comparison-semantics
closure. It approves no specification and assigns or reserves no profile or
suite code. It does not prove the security of SHA-256.

The fresh code audit found `h'03'` to be the smallest unused value in each
PSCID-local table. This review uses profile/suite `h'03'/h'03'` only as
provisional test values. Provisional candidate code is not permanent
assignment.

## Reviewed construction and closure

The candidate closure is exactly:

- Predicate Schema Semantic Contract v1.2 Draft;
- Predicate Schema Canonical Representation Profile v1.2 Draft;
- Predicate Schema Field-Semantic Representation Grammar v1.0 Approved; and
- ADR-ENC-001 / VE-CBOR-1 v0.1 Accepted.

Claim Reference, RFC-010, ADR-010, vectors, validators, and this review are not
part of the byte-producing closure.

```ini
frame = VE-CBOR-1([
  bstr h'5645505343494431',
  bstr h'03',
  bstr h'03',
  bstr C
])
digest   = SHA-256(frame)
identity = h'03' || digest
```

## Findings

| Review question | Finding |
|---|---|
| Domain separation | Pass. `VEPSCID1` keeps the construction Predicate-Schema-specific. No generic digest namespace is created. |
| Frame ambiguity | Pass. One definite-length four-element VE-CBOR-1 array fixes element count, type, order, and boundaries. |
| Suite/profile binding | Pass. Both one-octet values occur inside the hashed frame; the suite is also carried externally. |
| Prefix/framed-suite consistency | Pass. Relabeling the external byte cannot validate against the unchanged digest. |
| Downgrade to `h'02'` | Pass. N2 and N3 reject wrong-profile and forced historical-suite verification. |
| Relabeling | Pass. N1 rejects candidate digest bytes carried as suite `h'02'`. |
| Same-C cross-profile behavior | Pass. Anchor C retains exact Approved v1.1 `C`, but the `h'02'` and candidate identities differ. No cross-suite equality exists. |
| Unknown suite | Pass. N4 rejects `h'04'` as `unknown-suite`; no fallback or negotiation occurs. |
| Frame substitution | Pass. N5 rejects checking the candidate identity against substituted canonical content. |
| Comparison-domain mutation | Pass. N7 changes the structural domain from CAD / Canadian dollars to USD / United States dollars, changes canonical `C`, and rejects the unchanged identity. |
| Comparison-ordering mutation | Pass. A separate binding check changes `comparison.ordered` from `true` to `false`, changes canonical `C`, and rejects the unchanged identity. |
| Comparison deletion | Pass. N8 rejects removal of comparison semantics under the original identity. |
| Predicate-local bound mutation | Pass. N9 changes A2's upper bound to A3's while preserving comparison compatibility; full canonical `C` still changes and the original identity is rejected. This proves whole-schema binding, not comparison-semantic incompatibility. |
| Exact identity equality | Pass. Equality remains exact comparison of all 33 identity octets. |
| Historical verification | Pass. PSCID-1 Anchor C and permanent `h'02'` Anchors A/C/D replay exactly. |
| Migration | Pass for candidate audit. Historical suites retain their immutable interpretation; there is no relabel, alias, latest-profile fallback, or cross-suite migration equality. |

## Cryptographic assumptions

The construction inherits SHA-256 collision and second-preimage assumptions.
A collision or second-preimage result is an integrity contradiction and must
fail closed; it is not schema aliasing. This review checks construction and
implementation behavior only. It does not provide a proof of SHA-256 security,
change its normative reference, or establish trust, provenance, verification,
or authorization.

## Independent implementation evidence

The Node.js and Python validators independently implement normalization,
VE-CBOR-1 encoding, framing, SHA-256, identity construction, historical replay,
four candidate anchors, N1–N9, and the separate ordered-flag binding check.
Neither imports or invokes the other. They
agree on:

- Anchor A: 358-octet `C`, 375-octet frame;
- Anchor B: 211-octet `C`, 227-octet frame;
- Anchor C: 94-octet `C`, 110-octet frame;
- Anchor D: 562-octet `C`, 579-octet frame;
- all four fixed digests and identities; and
- the exact `identity-mismatch` / `unknown-suite` failure taxonomy.

## Architectural regression check

The candidate adds no `ValueDomain` primitive, registry, resolver,
semantic-fragment identity, conversion subsystem, generic arithmetic, or
generic digest primitive. It does not alter the Accepted comparison rule:
comparison requires local validity, explicit capability, and identical
normalized structural comparison semantics; otherwise the result is `NOT
COMPARABLE`. Comparability remains separate from trust and authority.

## Candidate conclusion

**A. PSCID v1.2 CANDIDATE SECURITY EVIDENCE IS COMPLETE FOR INDEPENDENT AUDIT.**

This conclusion does not authorize adoption. Permanent assignment would still
require a fresh allocation-race audit, approval of the byte-producing closure,
coordinated DIGEST revision, and the normal RFC-008/ADR-008 governance gate.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-01 | Initial non-normative review of the provisional v1.2 PSCID candidate, anchors, historical replay, N1–N9, and the ordered-flag binding check. |
