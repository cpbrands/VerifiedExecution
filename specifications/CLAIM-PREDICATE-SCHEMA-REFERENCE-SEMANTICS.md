---
id: CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
title: Claim Predicate Schema Reference Semantics
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Claim Semantics
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-27
depends_on:
  - CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
  - ADR-VERIFY-002
related_documents:
  - VE-CLAIM-REFERENCE-SEMANTICS
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - RFC-005
  - PRESSURE-TEST-CLAIM-SEMANTIC-CONTEXT-SELECTION
supersedes: null
superseded_by: null
---

# Claim Predicate Schema Reference Semantics

## Status and authority boundary

This is a Draft candidate specification. It defines candidate semantic
requirements for the relationship between `Claim.body.predicate` and a
Predicate Schema. It does not amend an Approved specification, accept
RFC-005, create a VE primitive, or add a Claim-body field.

This specification is semantic only. It does not define CBOR labels, map
shapes, string syntax, byte widths, digest algorithms, digest wire layout,
canonical bytes, CEL variables, verification artifacts, Trust Context, key
selection, trust policy, or a VE-hosted registry.

The accepted Claim envelope remains unchanged:

```text
Claim {
  body,
  verification {
    profile,
    artifact
  }
}
```

`verification` remains governed by ADR-VERIFY-002 and MUST NOT alter Claim
semantics. RFC-005 remains Draft, non-normative to this specification, and
non-blocking for the semantic decisions below.

## 1. Purpose

This specification defines the minimum semantic requirements by which the
value in `Claim.body.predicate` identifies exactly one immutable Predicate
Schema:

```text
Claim.body.predicate
        ↓
Predicate Schema semantic content identity
        ↓
one immutable Predicate Schema
        ↓
one semantic interpretation of Claim.body
```

It defines predicate identity, immutable schema selection, resolution,
offline provisioning, shared issuer-domain contracts, and the boundary between
semantic identity and future representation work. It does not define the full
contents of a Predicate Schema; that is the role of the next artifact,
Predicate Schema Semantic Contract.

## 2. Terminology

**Predicate identity**

The immutable semantic content identity of a Predicate Schema. It is the
semantic value carried by `Claim.body.predicate`.

**Predicate Schema**

An immutable semantic descriptor that defines the proposition-specific
interpretation of Claim-body fields identified by the Claim Body Semantic
Field Contract. It is a non-primitive normative abstraction, not a VE object,
identity provider, publisher authority, or trust authority.

**Canonical semantic content**

The complete set of semantics of a Predicate Schema that can affect
interpretation of a Claim body. It excludes non-semantic metadata. A future
representation profile will define deterministic bytes for this content.

**Content identity**

The immutable identity obtained from a Predicate Schema's canonical semantic
content. A future representation profile may instantiate it with a digest or
another content-verifiable construction. This specification defines neither
that construction nor its wire form.

**Issuer-domain contract**

An immutable semantic contract that defines an issuer identifier domain and
the equality rule within that domain. It does not establish trust, signer
identity, key binding, or authorization.

## 3. Predicate identity model

### 3.1 Verdict

**A. CONTENT-ADDRESSED PREDICATE SCHEMA IDENTITY SUFFICIENT.**

Predicate identity is the immutable semantic content identity of its Predicate
Schema:

```text
predicate identity
    = Predicate Schema semantic content identity
```

The Claim's `predicate` selects that schema by this immutable content
identity. The following invariant therefore applies:

```text
same predicate identity
        ↓
same canonical semantic schema content
        ↓
same Predicate Schema
        ↓
same Claim-body semantic interpretation
```

No namespace, publisher, resolver, human-readable name, explicit version
label, or separate immutable binding contributes to predicate semantic
identity.

### 3.2 Why content identity is sufficient

Content identity provides collision-resistant identity, immutable binding,
offline resolution, long-term auditability, and independent implementation
without a central registry. An implementation can obtain candidate schema
material from any source, canonicalize its semantic content through the
applicable future representation profile, compute its content identity, and
compare it with `Claim.body.predicate`.

```text
candidate schema material
        ↓
canonicalize semantic content
        ↓
compute content identity
        ↓
compare with Claim.body.predicate
```

Schema material matches the predicate only when the computed identity equals
the Claim's predicate identity. No trusted namespace resolver is required for
this semantic integrity check.

## 4. Aliases, namespaces, publishers, and version labels

Human-readable values such as `bank.balance.v1` MAY be retained as aliases,
discovery labels, distribution metadata, or tooling metadata. They MUST NOT
define Claim semantics or predicate semantic identity.

Namespace or publisher identity likewise MAY assist schema discovery or
provenance. It is not a semantic component of `Claim.body.predicate`, does not
determine what proposition a Claim asserts, and does not create a Predicate
Namespace Authority.

For example:

```text
alias A -> schema identity D
alias B -> schema identity D
```

identifies the same semantic predicate. Distinct aliases do not create
distinct semantic predicate identities. Conversely, reuse of an alias for
different semantic schema content MUST NOT change the interpretation of any
Claim that carries a predicate identity.

Schema publisher or organization identity is distribution/provenance metadata.
It is not part of Claim semantic meaning and is not a condition of predicate
equality. Issuer trust remains outside Predicate Schema identity.

## 5. Versioning and evolution

A semantic schema change MUST produce a different predicate identity:

```text
semantic schema change
        ↓
different canonical semantic content
        ↓
different content identity
        ↓
different predicate identity
```

Semantic changes include changes to any applicable:

- issuer-domain contract or issuer equality rule;
- value domain or value equality rule;
- numeric unit, scale, or range;
- null-like value semantics;
- structured-value semantics;
- allowed or constrained subject-reference forms; or
- assertion-time or observation-time rules.

Changing any immutable semantic composition reference likewise changes
Predicate Schema semantic content and MUST produce a new predicate identity.
This includes referenced issuer-domain, value, time, or other semantic
contracts.

Explicit `v1`, `v2`, or equivalent labels are not required for semantic
correctness. They MAY describe succession in optional tooling metadata but
MUST NOT alter the identity or interpretation of a historical predicate.

## 6. Semantic-content boundary and non-self-reference

A Predicate Schema's canonical semantic content MUST include only information
that can affect Claim interpretation. As applicable, it SHOULD include:

- immutable issuer-domain contract references and issuer equality/domain
  rules;
- value-domain and value-equality rules;
- numeric unit, scale, and range;
- null-like semantics;
- structured-value semantics;
- allowed subject-reference forms and proposition-specific constraints;
- assertion-time and observation-time rules; and
- immutable semantic composition references.

Canonical semantic content MUST exclude:

- its own content identity or digest;
- aliases;
- display names;
- publisher or organization identity;
- documentation text;
- comments;
- retrieval URLs;
- predecessor or successor hints; and
- other non-semantic metadata.

This exclusion is required to prevent content identity from becoming
self-referential or unstable. The next Predicate Schema Semantic Contract must
define this semantic-content boundary precisely before a representation profile
computes portable content identities.

Predicate identity follows canonical semantic specification content, not
unrestricted logical or mathematical equivalence. Two differently expressed
schemas remain distinct semantic predicates unless a future governed
semantic-normalization rule causes them to produce identical canonical semantic
content. This specification introduces no theorem proving, equivalence
inference, or universal semantic normalization.

## 7. Resolution and offline operation

Semantic resolution is satisfied when an implementation has Predicate Schema
material whose canonical semantic content computes to the predicate identity
in the Claim:

```text
predicate content identity D
        ↓
exactly one Predicate Schema semantic content D
```

The transport or retrieval method is outside semantics. Locally provisioned
schema material is sufficient. Verify and Evaluate MUST NOT require live DNS,
HTTP, a registry, a namespace authority, or any other network retrieval at
runtime. Network access MAY be used during optional provisioning.

For a twenty-year audit, interpretation remains possible without the original
publisher, DNS, registry, network, or namespace authority when the Claim and
required content-addressed schema material are retained. Every required shared
semantic contract and its transitive semantic dependencies must be retained as
well.

If the required schema material is unavailable, semantic interpretation is
unavailable. An implementation MUST NOT guess, use an alias or raw label as a
fallback, or substitute different schema material.

The following conditions all produce semantic interpretation unavailable:

| Condition | Required result |
|---|---|
| Unknown predicate content identity | Semantic interpretation unavailable. |
| Required schema material unavailable | Semantic interpretation unavailable. |
| Required transitive issuer-domain, time, value, or semantic-composition contract unavailable | Semantic interpretation unavailable. |
| Computed content identity differs from the Claim predicate | Semantic interpretation unavailable. |
| Required semantic feature unsupported | Semantic interpretation unavailable. |

This specification creates no larger universal error taxonomy.

An implementation MUST NOT partially interpret a Claim when a required
transitive semantic contract is unavailable, and MUST NOT guess its missing
semantics.

## 8. Shared issuer-domain contracts and composition

A Predicate Schema MUST define the issuer-domain contract under which its
`issuer_ref` values are interpreted and compared. It MAY do so directly or by
referencing an immutable issuer-domain contract by that contract's semantic
content identity.

An issuer-domain contract defines only:

- the issuer identifier domain;
- issuer identifier equality within that domain; and
- canonical semantic comparison across predicates that use the same contract.

It MUST NOT define trust, verifier or key binding, verification success,
delegation, revocation, or authorization policy.

Two equal-looking `issuer_ref` values from different predicates MUST NOT be
treated as semantically equal unless both Predicate Schemas reference the same
immutable issuer-domain contract identity. No Claim-body field is added for
this purpose.

A Predicate Schema MAY compose immutable shared semantic contracts for an
issuer domain, time domain, value type, or common structured type by their
content identities. Composition reduces duplication without introducing a
global type registry, namespace authority, mutable resolver dependency, or a
second Claim-level semantic selector.

## 9. Authority boundaries

Predicate Schema identity and resolution make Claim.body semantically
interpretable. They do not own any of the following:

| Concern | Owner |
|---|---|
| Legal Claim subject-reference union and equality | Claim Reference Semantics |
| Subject forms allowed for one proposition | Predicate Schema |
| `action_id`, `action_digest`, and `event_id` identity/representation | Action and Event semantics/profiles |
| Claim verification artifact and profile | ADR-VERIFY-002 and its verification profile |
| Trust, issuer applicability, Claim selection, conflict handling, and Rule evaluation | Their existing Verify, Trust Context, and Rule/Evaluate authorities |
| Canonical schema bytes, content-identity algorithm, digest suite, and serialized reference form | Future Predicate Schema representation/profile work |

Predicate Schema resolution MUST NOT verify signatures, select trusted keys,
infer a signer from `issuer_ref`, modify `verification.profile`, establish
delegation or revocation, select or deduplicate Claims, rank issuers, resolve
conflicts, or evaluate Rules.

## 10. Representation boundary and RFC-005

This artifact defines the semantic content-identity model:

```text
Claim Predicate Schema Reference Semantics
    -> semantic Predicate Schema content identity and resolution outcome

Future Predicate Schema representation profile
    -> deterministic canonical semantic bytes

Digest suite/profile
    -> portable instantiation of content identity
```

The absence of canonical Predicate Schema representation today is an
implementation and portable-conformance blocker. It is not an architectural
argument against content-addressed predicate identity.

Draft RFC-005's conceptual digest/reference model may eventually provide a
portable representation for this content identity. That relationship is
**B. CONCEPTUAL ALIGNMENT ONLY**. This specification does not import RFC-005,
and does not make an RFC-005 object type, representation profile, digest suite,
or wire structure normative.

## 11. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Claim meaning is explicit, inspectable, and durable without a publisher authority. |
| New primitive burden | Pass. Predicate Schema remains a non-primitive normative abstraction. |
| Removability | Content identity cannot be removed without allowing mutable reinterpretation; aliases and namespaces can be removed without changing Claim meaning. |
| Twenty-year durability | Pass. Retained content-addressed materials avoid dependence on external naming infrastructure. |
| Independent implementability | Pass. Any implementation can verify a candidate schema against the Claim predicate using the future shared representation profile. |
| Total conceptual complexity | Pass. The model removes namespace binding, namespace authority, and trusted resolver abstractions. |

## 12. Governance and normative home

Predicate Schema Reference Semantics is a necessary standalone Draft
specification because independent implementations need a versioned semantic
contract for predicate content identity, resolution outcome, offline behavior,
and schema-composition boundaries. It is narrower than the forthcoming
Predicate Schema Semantic Contract and a representation profile.

| Governance question | Result |
|---|---|
| New primitive? | No. |
| New Claim field? | No. |
| New normative abstraction? | Yes: Predicate Schema and immutable semantic-contract content identity, both non-primitive. |
| RFC required? | No. This Draft does not change approved semantics or the accepted Claim envelope. |
| Approved-specification revision required? | No. Normal governance applies before this Draft becomes authoritative. |
| Correct normative home? | This standalone Draft Claim-semantics specification. |

## 13. Next artifact

The next artifact is **Predicate Schema Semantic Contract**. It must define the
semantic-content boundary precisely, including issuer-domain declarations,
value and time semantics, subject-form constraints, composition, and the
non-self-reference rule. Only after that work can a future representation
profile compute portable content identities.

## Revision history

| Version | Date | Change |
|---|---|
| 0.1 | 2026-08-27 | Initial Draft corrected to content-addressed Predicate Schema identity. |
