---
id: GAP-ANALYSIS-RS-ER-003
title: Gap Analysis for RS-ER-003 VE-014 Independent Executor
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-05
updated: 2026-09-05
depends_on: []
related_documents:
  - RS-ER-003-VE014-INDEPENDENT-EXECUTOR
  - VE-001
  - VE-014
  - RFC-011
  - ADR-011
supersedes: null
superseded_by: null
---

# Gap Analysis — RS-ER-003 VE-014 Independent Executor

## Status and authority boundary

This is non-normative gap-analysis evidence. It does not modify VE-001,
VE-014, RFC-011, ADR-011, or any other normative artifact. It does not define
an Action representation, select a digest suite, allocate a verification
profile, or create protocol authority.

The analysis preserves the RS-ER-003 findings:

```text
A. NO NEW VE-014 ARCHITECTURAL GAP
C. VE-001 DEPENDENCY
D. VERIFICATION-PROFILE DEPENDENCY
```

## Question tested

Can a portable VE-014 verification profile be completed independently of a
portable normative VE-001 representation for `action_id` and
`action_digest`?

The answer distinguishes drafting profile syntax from establishing complete
portable interoperability. A profile's authentication algorithm, proof
representation, and attester-extraction procedure can be drafted before the
VE-001 dependency is complete. Its interoperable authenticated bytes and
end-to-end conformance behavior cannot be finalized independently, because
the VE-014 authentication frame directly contains the canonical VE-001 values.

## Dependency graph

```text
VE-001 canonical Action semantics                         [normative]
  -> canonical Action representation                     [unresolved]
  -> action_digest calculation and digest suite          [unresolved]
  -> canonical action_id/action_digest data items         [unresolved]
  -> VE-014 body direct embedding                         [Draft normative rule]
  -> VE-014 authenticated frame                           [Draft normative rule]
  -> governed VE-014 profile authentication              [profile unresolved]
  -> independent executor recovery and comparison         [blocked end to end]
```

The first edge is already architectural and semantic authority. VE-001 v0.2
defines the Action semantic model, the occurrence/content distinction, and the
properties the digest must have. It explicitly delegates byte-level
serialization, framing, domain separation, digest-suite representation, and
primitive encoding to a separate normative VE Canonical Encoding Profile. That
delegation concerns representation and protocol mechanics; it does not transfer
Action occurrence-identity meaning or semantic equality to the profile.

VE-014 v0.1 then imports the resulting VE-001 values without conversion. Its
body and authentication-frame rules are specified, but portable production,
authentication, recovery, recomputation, and comparison remain conditional on
the two unresolved profile layers.

## VE-001 audit

### Already defined

VE-001 defines:

- `action_id` as immutable historical Action-occurrence identity;
- `action_digest` as deterministic identity of exact semantic Action content;
- the two identities as distinct, with neither substituting for the other;
- the digest construction conceptually as a domain-separated hash over
  `schema_digest` and canonical semantic payload;
- which Action content is semantic and therefore participates in the digest;
- occurrence-identity and content-identity meaning, including the semantic
  distinctions that equality does and does not imply; and
- a fail-closed requirement when semantics cannot be determined.

### Not yet defined portably

VE-001 does not define:

- the complete canonical Action byte representation;
- framing and the concrete domain-separation bytes;
- the digest suite and its representation;
- canonical representations for `action_id`, `action_digest`, schema
  descriptors, primitive values, maps, Unicode, numbers, or absence/null;
- an independently executable digest calculation over those bytes; or
- portable fixtures proving that independent implementations compute and
  compare the same values.

VE-001 itself labels this a normative protocol dependency rather than an
unresolved Action semantic. Its interoperability rule forbids a cryptographic
interoperability claim unless the canonicalization profile, schema contract,
digest framing, and digest suite are shared.

The ownership and delegation boundary is:

| Responsibility | Authority |
|---|---|
| Action semantic model | VE-001 owned. |
| Canonical Action bytes | Explicitly delegated to the normative Canonical Encoding Profile. |
| Digest framing and domain separation | Explicitly delegated to that profile. |
| Digest algorithm and suite | Explicitly delegated to the applicable profile. |
| `action_digest` formula and meaning | VE-001 owned. |
| Concrete digest calculation | VE-001 formula applied to profile-defined canonical bytes, framing, and suite. |
| `action_digest` representation | Subordinate-profile representation mechanics consistent with VE-001 meaning. |
| `action_id` generation format | Delegated by VE-001 to the applicable protocol/profile. |
| `action_id` canonical representation | Subordinate-profile representation mechanics. |
| Semantic identity and equality meaning | VE-001 owned. |
| Concrete representation-level comparison | The profile may define deterministic mechanics that preserve and implement VE-001 semantics. |

### Smallest missing normative contract

The minimum missing contract is a narrow subordinate VE-001 Action canonical
representation and content-identity profile. It needs to define only:

1. the closed semantic Action input admitted to canonicalization;
2. its deterministic VE-CBOR-1 representation;
3. the canonical VE-CBOR-1 data item and deterministic representation-level
   comparison mechanics for `action_id`, preserving VE-001 occurrence-identity
   and semantic-equality meaning unchanged;
4. exact digest framing, domain separation, algorithm/suite, and output data
   item for `action_digest`;
5. schema-identity representation and its place in digest calculation;
6. validation, fail-closed behavior, and version/profile selection; and
7. positive, negative, and historical conformance vectors.

This contract completes existing VE-001 architecture. It need not create a
generic content-identity, hash-reference, serialization, or registry primitive.
VE-CBOR-1 may supply deterministic encoding mechanics where applicable, but it
does not supply the missing Action-owned schema, framing, digest suite, or
imported-value contract. Approved DIGEST-001 remains exclusively Predicate-
Schema-specific and is not generalized into Action content identity. VE-001
does not automatically adopt the shared `OccurrenceId` convention for
`action_id`.

## VE-014 verification-profile audit

A future governed VE-014 verification profile owns:

- the exact `verification.artifact` syntax;
- the authentication algorithm and credential interpretation;
- authentication of the exact VE-014 frame;
- authenticated-attester extraction;
- deterministic profile-specific verification behavior; and
- profile-specific external inputs that do not change Execution Right
  semantic content.

It does not own and cannot redefine:

- `action_id` or `action_digest` meaning;
- either imported value's canonical representation or semantic equality;
- Action canonicalization or digest calculation;
- the Execution Right semantic pair; or
- temporal, replay, or outcome semantics.

The profile can be drafted now as an interface and cryptographic construction,
but complete portable vectors would still contain an unresolved body import.
Freezing substitute VE-001 bytes in that profile would violate ownership;
leaving placeholders would make it incomplete. Later VE-001 completion could
then force profile fixtures or authenticated-byte examples to be revised.

## Sequencing test

### Option 1 — VE-014 profile first

The profile could select proof syntax, authentication algorithms, credential
handling, and attester output. It could not independently establish the exact
portable frame bytes because those bytes include directly embedded canonical
VE-001 values. It would therefore remain conditional, omit end-to-end vectors,
or risk importing a provisional representation that VE-001 later changes.

This order does not resolve the independent-executor blocker and creates
avoidable fixture and review churn.

### Option 2 — VE-001 portability first

The subordinate VE-001 profile fixes the Action bytes, digest computation, and
canonical imported values. VE-014 body and frame bytes then become stable
inputs to the verification profile. The first VE-014 profile can consequently
define authenticated coverage and complete end-to-end vectors without
redefining upstream semantics or carrying placeholders.

Nothing architectural is delayed: RFC-011 and ADR-011 are Accepted, VE-014 is
already Draft v0.1, and profile-interface design may continue. This ordering
only places normative finalization in dependency order.

## Architectural Decision Test

| Test | Finding |
|---|---|
| Founding Principles consistency | **Pass.** VE-001 retains ownership of Action identity while VE-014 remains a consumer. |
| New primitive burden | **Pass.** No new primitive or generic registry is needed. |
| Removability | **Pass.** The VE-014 profile remains replaceable without changing Action semantics; the narrow VE-001 profile is removable only with the portability it supplies. |
| Twenty-year durability | **Pass.** Stable ownership and explicit versioned profiles isolate future cryptographic replacement. |
| Independent implementability | **Pass only in upstream-first order.** Independent end-to-end implementation requires canonical VE-001 values before VE-014 profile fixtures can be complete. |
| Reduced total conceptual complexity | **Pass.** One narrow VE-001 profile avoids duplicated Action encoding inside every downstream authentication profile. |

The tests favor VE-001 portability before finalizing the first VE-014
verification profile.

## Governance classification

The missing work is:

```text
1. EXISTING ARCHITECTURE, NORMATIVE COMPLETION ONLY
```

VE-001 already requires a separate normative Canonical Encoding Profile and
defines the representation and protocol responsibilities that profile must
fulfill. VE-001 continues to own `action_id` occurrence-identity semantics,
semantic equality, and `action_digest` meaning. The subordinate profile may
define canonical representations and deterministic representation-level
comparison mechanics only insofar as they preserve and implement those existing
semantics. Drafting that bounded profile does not itself revise Approved VE-001
semantics and does not require a new architectural RFC or ADR.

If implementation work discovers that VE-001's approved semantic rules must
change, that distinct change would require the repository's Approved-
specification path: RFC, ADR, VE-001 version increment, and changelog. The
present evidence does not establish such a need.

The first VE-014 verification profile should likewise be a subordinate
profile specification under VE-014. It does not need or justify a new
top-level `VE-xxx` identifier. Its portable identifier obtains meaning only
from its future governed VE-014 profile specification; no identifier is
allocated by this analysis.

## Primitive-creep result

No `ActionProfile`, `DigestProfile`, `SerializationProfile`, `ContentIdentity`,
`HashRef`, `DigestRef`, `SemanticDigest`, `VerificationRegistry`,
`ProfileRegistry`, or global algorithm registry is required. The actual need
is a narrow, versioned VE-001-owned representation/content-identity profile,
reusing VE-CBOR-1 where applicable, followed by a separate VE-014-owned
authentication profile. A subordinate specification/profile document is
protocol machinery, not a new architectural primitive.

## Final classification and next step

```text
A. VE-001 PORTABILITY IS UPSTREAM
```

VE-014 has no new architectural gap. The two dependencies are separable in
ownership but ordered for complete interoperability: VE-001 supplies stable
canonical values, after which VE-014 authentication can bind and test their
exact embedding.

The exact next cadence step is:

```text
draft subordinate VE-001 representation/profile
```

No RFC or ADR is required before that Draft because this is normative
completion of the architecture VE-001 already mandates. The resulting Draft
must receive its own governance and independent audit before any authority or
portable-conformance claim follows.
