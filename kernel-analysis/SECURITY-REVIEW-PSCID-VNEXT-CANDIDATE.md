---
id: SECURITY-REVIEW-PSCID-VNEXT-CANDIDATE
title: PSCID vNext Candidate Construction Security Review
version: "0.1"
status: Draft
document_type: Security Review
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - RFC-008
  - ADR-008
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - ADR-ENC-001
related_documents:
  - PREDICATE-SCHEMA-CANONICALIZATION-V1.1
supersedes: null
superseded_by: null
---

# PSCID vNext Candidate Construction Security Review

## Scope and review boundary

This is a narrow, non-normative security review of the provisional PSCID vNext
construction in the `DIGEST-001` Draft. It reviews framing, code binding, and
the corresponding candidate vectors. It does **not** approve a suite, assign a
permanent code, approve any Draft, alter PSCID-1, or constitute a proof of
SHA-256 security.

The reviewed candidate is:

~~~ini
NEW_SUITE   = h'02'  // provisional candidate only
NEW_PROFILE = h'02'  // provisional candidate only

frame = VE-CBOR-1([
  bstr h'5645505343494431',
  bstr h'02',
  bstr h'02',
  bstr C
])

digest   = SHA-256(frame)
identity = h'02' || digest
~~~

`C` is produced only by the candidate-frozen closure:

~~~text
Predicate Schema Semantic Contract v1.1 Draft
Predicate Schema Canonical Representation Profile v1.1 Draft
Predicate Schema Field-Semantic Representation Grammar v1.0 Approved
ADR-ENC-001 / VE-CBOR-1 v0.1 Accepted
~~~

Claim Reference Semantics v0.2 is an external semantic dependency; RFC-007 and
ADR-007 are architectural authority; RFC-008 and ADR-008 are governance
authority; and vectors/validators are evidence. None is canonicalized into
`C` merely because it participates in the candidate's interpretation or
review.

## Independent review result

**Result: PASS FOR INDEPENDENT AUDIT.** No construction defect was found in
the reviewed candidate. This finding is limited to the exact candidate source,
anchors, and tests named here. Any byte-affecting change to the candidate
closure invalidates this result and requires regenerated anchors and review.

| Review topic | Finding |
|---|---|
| Domain separation | Pass. The fixed ASCII `VEPSCID1` byte string is inside the framed SHA-256 preimage and is Predicate-Schema-specific. |
| CBOR framing ambiguity | Pass. VE-CBOR-1 encodes one definite-length array of exactly four byte strings; length-prefixing removes concatenation ambiguity. |
| Suite/profile binding | Pass. Both candidate bytes occur in the carried construction and inside the hashed frame. |
| Prefix parsing | Pass. Identity is exactly 33 octets; byte 0 selects the suite, then the immutable suite definition supplies the profile, frame, and hash. |
| Downgrade and relabel resistance | Pass. Candidate Anchor C shares legacy `C` but cannot verify as PSCID-1. N1 relabels its digest under the known carried `h'01'` path, and N3 explicitly applies the PSCID-1 closure; both reject with `identity-mismatch`. N2 rejects a candidate-suite profile substitution with `identity-mismatch`. |
| Frame substitution resistance | Pass. N5 changes only the framed candidate profile while retaining the original candidate identity; the supplied frame then rejects with `identity-mismatch`. |
| Cross-suite equality | Pass. Equality is exact 33-byte equality only. Equal `C` values under PSCID-1 and the candidate remain different identities. |
| Historical verification | Pass. A carried suite selects its retained immutable suite/profile closure; latest-profile interpretation and silent substitution are excluded. |
| Candidate-code ambiguity | Pass for candidate use. The local table audit finds only assigned `h'01'`; `h'02'` is unused and explicitly non-authoritative. |
| Migration behavior | Pass. A changed construction uses a distinct suite; old identities are retained and never relabeled, rehashed, or migrated automatically. |

## Cryptographic assumptions and limits

The construction relies on SHA-256 as defined by NIST FIPS 180-4 Section 6.2.
It assumes the usual collision and second-preimage resistance properties of
that algorithm. A discovered collision or integrity contradiction for distinct
canonical `C` values is a fail-closed cryptographic-integrity failure, not an
alias, fallback, or normal Predicate Schema equality result.

This review checks that the candidate uses SHA-256 with an unambiguous framed
preimage. It neither proves SHA-256's security from first principles nor
introduces a VE hash function, algorithm negotiation, generic crypto registry,
or generic digest/reference/signature architecture.

## Evidence examined

The Node.js and Python validators independently canonicalize the accepted
v1.1 fixtures, frame the resulting bytes, compute SHA-256, construct the
candidate identity, and decode the generated frame into exactly four byte
strings. They agree on all three identity anchors:

| Anchor | `C` octets | Frame octets | Identity octets | Finding |
|---|---:|---:|---:|---|
| A / V1.1-A | 151 | 167 | 33 | Frame, SHA-256 digest, and identity agree. |
| C / V1.1-C | 94 | 110 | 33 | Replays Approved v1.0 V1-A `C` but yields a different candidate identity. |
| D / V1.1-D | 263 | 280 | 33 | Exercises the `h'59 0107'` CBOR byte-string length transition. |

The same validators reject the following confusion cases fail closed:

| Case | Fixed test-only verification path | Failure result |
|---|---|---|
| N1 — suite relabel | Relabel candidate Anchor C as carried suite `h'01'`, then dispatch to the retained PSCID-1 construction. | `identity-mismatch` |
| N2 — profile relabel | Carry `h'02'` while hashing a frame with profile `h'01'`, then dispatch to the candidate construction. | `identity-mismatch` |
| N3 — downgrade reinterpretation | Explicitly verify candidate Anchor C against the PSCID-1 closure. | `identity-mismatch` |
| N4 — unknown suite | Carry `h'03'` and dispatch. | `unknown-suite` |
| N5 — frame-field substitution | Substitute only the profile in a candidate frame while retaining its original identity. | `identity-mismatch` |

The fixed test-only verifier recognizes only retained PSCID-1 `h'01'` and the
provisional candidate `h'02'`; it is test evidence, not a generic runtime
suite registry. N1 and N3 therefore exercise the known historical PSCID-1
closure. N4 is the separate unknown-suite case.

No collision vector is fabricated: generating an actual SHA-256 collision is
neither required nor credible for this review. Collision treatment is instead
the explicit fail-closed semantic rule above.

## Code and approval boundary

`h'02'` is a provisional candidate value in both PSCID-local tables. It has no
permanent meaning until the final governed approval and merge records an exact
suite/profile assignment alongside the frozen closure, final vectors, and
required changelog/version updates. Candidate code use is not a conformance
claim, and it provides no authority to reuse, reserve, or later reinterpret an
assigned value.

RFC-008 and ADR-008 require these gates before a new suite becomes
authoritative:

| Gate | Candidate state |
|---|---|
| Candidate byte-producing closure frozen for review | Complete, subject to invalidation by any byte-affecting change. |
| Focused independent construction review | Complete in this non-normative review. |
| Canonical `C`, frame, digest, and identity anchors | Complete for A, C, and D. |
| Two independent implementations | Complete: Node.js and Python agree. |
| Relabel, downgrade, confusion, and unknown-code negatives | Complete: N1, N2, N3, and N5 return `identity-mismatch` on known construction paths; N4 returns `unknown-suite`. |
| Exact code-assignment audit | Complete for candidate availability; no permanent assignment made. |
| Final governance approval and permanent allocation | Intentionally pending; not performed by this review. |

## Conclusion

The candidate construction meets the evidence gates required to proceed to an
independent audit. It remains a Draft-only, non-authoritative candidate. The
review does not authorize final approval, code allocation, implementation
claims of portable conformance, or any change to PSCID-1.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-30 | Initial non-normative security review of the PSCID vNext candidate construction. |
