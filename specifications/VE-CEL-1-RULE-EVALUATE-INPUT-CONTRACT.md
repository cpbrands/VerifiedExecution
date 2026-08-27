---
id: VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
title: VE-CEL-1 Rule Evaluate Input Contract
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Specification
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-27
depends_on:
  - VE-001
  - ADR-ENC-001
  - ADR-RULE-001-002
  - ADR-VERIFY-002
  - VE-CLAIM-REFERENCE-SEMANTICS
related_documents:
  - SPECIFICATION-TASKS
  - PRESSURE-TEST-VERIFIED-CLAIM-RULE-EVALUATE-INPUT-MAPPING
supersedes: null
superseded_by: null
---

# VE-CEL-1 Rule/Evaluate Input Contract

## Status and authority boundary

This is a Draft candidate, engine-specific binding/profile specification. Its
requirements describe a candidate contract for `VE-CEL-1`; they do not amend
an Approved Action specification, accepted ADR, Claim semantics, Claim
verification, Trust Context, Rule semantics, or CEL itself.

The accepted ADR-RULE-001/002 decision requires `Evaluate` to expose only the
immutable `action` and `claims` bindings, and to order verified Claims
deterministically whenever they are represented as a list. It also records the
precise CBOR-to-CEL type mapping and verified-Claim input work as outstanding.

ADR-VERIFY-002 establishes `Claim { body, verification { profile, artifact } }`
and requires verification material not to alter Claim semantics. Draft Canonical
Claim Reference Semantics supplies the candidate meanings of the three
currently legal subject-reference forms. This contract does not elevate either
Draft dependency to Approved authority.

## 1. Purpose

This candidate defines the minimum deterministic `VE-CEL-1` input view for:

```text
Evaluate(Action, established Claim.body collection, Rule)
```

Its purpose is to let independent implementations construct the same CEL input
values from the same explicit evaluation inputs, without re-running
verification, selecting preferred evidence, or adding a new Claim or Fact
abstraction.

## 2. Scope

This candidate owns only the engine-specific input view presented to a
`VE-CEL-1` Rule. It does not define:

- Claim meaning, issuer semantics, or complete Claim-body schema;
- Claim verification, Trust Context, signer/key handling, or verification
  artifacts;
- Action semantics, Action schema fields, or Action canonical encoding;
- CEL language semantics, extensions, resource limits, or the VE-CEL-1
  feature allowlist; or
- a portable Claim identity, `claim_id`, `claim_digest`, `ClaimReference`,
  `Fact`, or generic reference ontology.

## 3. Terminology

**Established Claim**

A Claim that Verify has established as usable under the applicable Trust
Context. Establishment is complete before CEL input construction begins.

**Input collection**

The explicit immutable collection of already-established Claims supplied to a
particular Evaluate invocation.

**Binding view**

The CEL-visible value of an existing VE semantic value. A binding view does not
create a new VE object or change the source value's semantic meaning.

**Representation-derived sort key**

A deterministic key used only to order a CEL list. It is not a Claim semantic
identity or a new Claim field.

## 4. Candidate input namespace

The only top-level CEL bindings are:

```text
action
claims
```

No additional top-level binding is valid in this candidate. In particular,
`facts`, `trusted_claims`, `observations`, `authorities`, and `evidence` are
rejected as aliases or convenience namespaces.

This preserves the accepted Rule ADR's two-binding boundary. A Rule receives
neither a hidden authority object nor a verification service through its input
namespace.

## 5. Action binding view

The candidate `action` binding preserves the Approved VE-001 distinction
between Action occurrence and semantic content without flattening
schema-defined fields into the top-level CEL namespace:

```text
action = {
  action_id: Action.instance_envelope.action_id,
  action_digest: Action.action_digest,
  payload: Action.semantic_payload
}
```

The binding view has these consequences:

- `action.action_id` is the historical Action-occurrence identity grounded in
  Approved VE-001 semantics.
- `action.action_digest` is the deterministic identity of exact semantic
  Action content grounded in Approved VE-001 semantics. Rules may legitimately
  require it when evaluating Claims about Action content or an occurrence
  bound to particular content.
- `action.payload` refers conceptually to VE-001's existing Semantic Payload,
  including `schema_digest` and the schema-defined semantic fields.
- `payload` is a Draft binding-view name, not a new Action field, a normative
  serialized Action field, or a replacement for VE-001's Semantic Payload.
- Optional human-readable `schema_id` and `schema_version`, as well as
  non-semantic Instance Envelope metadata, are not added as independent CEL
  inputs by this candidate.

The exact CEL representation of `action.payload`, including conversion of its
schema-defined values, remains unresolved `SPEC-CEL-002` work. This candidate
does not add an Action field or choose a new Action serialization.

## 6. Claims input collection

`claims` is exactly the explicit immutable input collection supplied to a
particular Evaluate invocation. CEL receives one Claim-body binding view for
every supplied established Claim.

The input boundary MUST NOT perform implicit selection, filtering,
deduplication, ranking, merging, or conflict resolution. In particular, it
MUST NOT select Claims by issuer preference, recency, verification strength,
predicate, “best evidence,” external state, or hidden policy.

Any future selection semantics belong to explicit Rule/Evaluate semantics. The
binding view itself consumes the supplied collection as-is.

### 6.1 Multiplicity and conflicts

Multiplicity is preserved. Two semantically identical Claim bodies supplied
to Evaluate produce two CEL-visible entries unless a future governed
Rule/Evaluate contract explicitly states otherwise.

Conflicting established Claims remain simultaneously visible. The binding
MUST NOT choose one, rank one, merge values, collapse Claims by predicate, or
apply a recency policy. A Rule may evaluate the supplied values according to
its own declared logic.

## 7. Claim-body binding view

For every supplied established Claim, the candidate binding view is the
semantic `Claim.body` only:

```text
claim_view = Claim.body
```

`verification.profile` and `verification.artifact` are not CEL-visible. A
Rule therefore cannot branch on signature transport, algorithm, or artifact
format through this input contract. Verification-method trust remains Verify /
Trust Context work or, where necessary, separately asserted Claim semantics.

The following Claim-body fields remain visible when they are present in the
Claim body:

```text
subject_reference
issuer_ref
predicate
value
assertion_time?
observation_time?
```

This list does not define the complete Claim-body schema. It preserves the
semantic fields supplied by the applicable Claim contract and does not remove,
invent, rename, or reinterpret them.

### 7.1 Optional fields

The current Draft candidate representation of an absent optional Claim-body
field is an omitted key in the CEL-visible Claim-body map. A binding MUST NOT
replace an absent field with `null`, a default timestamp, a host-clock value,
or any synthetic value. `null` is not currently required.

Consequently:

```text
field absent
!=
field present with a value
```

This omission rule remains Draft. Deterministic CEL presence-testing behavior
depends on the eventual pinned VE-CEL semantics release. This candidate does
not select that release or define missing-field expression syntax;
`SPEC-CEL-001` and the engine binding remain dependencies for final portable
conformance.

## 8. Subject-reference binding view

This candidate reuses, and does not redefine, the Draft semantic union:

```text
ActionContentReference { action_digest }
ActionOccurrenceReference { action_id, action_digest }
EventReference { event_id }
```

The CEL-visible representation is the corresponding structurally disjoint map:

```text
ActionContentReference    -> { action_digest }
ActionOccurrenceReference -> { action_id, action_digest }
EventReference            -> { event_id }
```

No `reference_kind`, `GenericReference`, `ObjectReference`, or separate
attempt/grouping reference is introduced. The map shape is binding
representation, not a new Claim semantic ontology. If future representation
work requires a serialized discriminator, that work must not broaden the
legal Claim subject forms.

The semantic meanings of all three forms come from Draft Canonical Claim
Reference Semantics. Their exact CEL field representation remains provisional
until representation work defines encoded forms. `EventReference { event_id }`
has the additional dependency that the relevant VE-002 Event identity and
portable encoding work are Draft.

## 9. Candidate value and numeric mapping

The candidate recognizes existing value categories but does not claim that any
complete portable CBOR-to-CEL mapping is already final:

| Claim or Action value category | Candidate CEL-visible category | Remaining dependency |
|---|---|---|
| Boolean | `bool` candidate | Pinned CEL semantics and exact value mapping. |
| Integer | CEL integer candidate | Exact signedness and range rules. |
| Scaled integer | CEL integer plus schema-defined scale/unit semantics | Exact numeric and scale representation. |
| Text | `string` candidate | Exact CBOR-to-CEL string mapping. |
| Bytes | `bytes` candidate | Exact byte-value mapping. |
| Structured map/object | Candidate CEL map/object | Exact field declarations, map-value rules, and recursive mapping. |
| List | Candidate CEL list | Exact recursive mapping and applicable ordering rules. |

`VE-CEL-1` excludes CEL `double` from decision inputs and Rule literals.
Decision-relevant fractional quantities remain schema-defined scaled integers
under the accepted Rule and canonical-encoding decisions. This candidate does
not add a parallel numeric model.

Portable CEL mapping for bytes, nested maps, lists, integer ranges, scaled
integers, and related CEL behavior remains dependent on `SPEC-CBOR-001`,
`SPEC-CBOR-002`, `SPEC-CBOR-003`, `SPEC-CEL-001`, and `SPEC-CEL-004`. This
candidate does not invent a type system to close those dependencies.

## 10. Claims collection ordering

At the semantic Rule/Evaluate-input level, collection position carries no
priority or ordering meaning unless future Rule semantics explicitly define
one.

CEL list ordering is not universally mandatory. Accepted ADR-RULE-001/002
permits `claims` to be a set/list. Its deterministic ascending bytewise
content-digest order requirement applies only whenever Claims are represented
as a list. The current authority does not define a portable map, set-like, or
other CEL collection representation for Claims.

The following candidate options were tested:

| Option | Result |
|---|---|
| A. List ordered by portable Claim content digest | Required by the accepted ADR only when a list is used, but not yet implementable because the portable Claim-body content-digest construction is unspecified. |
| B. List ordered by canonical Claim-body bytes | A complete canonical Claim-body byte sequence would technically provide a deterministic total order, but adopting it in place of the accepted digest-order criterion would require governance. The bytes are not yet portably defined. |
| C. Map, set-like, or another CEL collection | Not specified by accepted authority. A map needs a stable key and does not inherently preserve duplicate Claim bodies; CEL set-like semantics and a portable alternative collection model are not specified. |
| D. New semantic `claim_digest` field | Rejected. A sort key does not require a Claim semantic identity field. |
| E. Binding remains blocked pending complete Claim-body representation | Survives. |

Multiplicity is separate from collision handling. Two identical Claim-body
values remain two inputs:

```text
[X, X]
```

This rule preserves duplicate cardinality and does not imply deduplication.
It is distinct from the case where two different Claim bodies produce the same
content digest.

### 10.1 Digest collision handling

Two distinct Claim bodies may theoretically collide on a digest. Digest alone
therefore does not define a total ordering of distinct values. If a digest-based
list order is retained, a deterministic secondary comparison is required.
Canonical Claim-body bytes are the natural secondary key once they are
defined.

This does not introduce `claim_id`, `claim_digest`, or `ClaimReference` as
semantic Claim fields. If a secondary bytewise comparison makes the ordering
total, the digest adds no additional ordering semantics; it remains relevant
only because the accepted Rule ADR currently names a content-digest criterion.

### 10.2 Critical dependency result

The smallest blocking dependency is a complete portable canonical
representation of `Claim.body`, not an invented Claim digest or standalone
sort-key concept. The repository does not yet define all of the following:

- a complete Claim-body schema;
- exact canonical field labels;
- canonical field and value types;
- optional-field omission encoding;
- portable subject-reference representation;
- required CBOR-to-CEL mappings; and
- numeric and scaled-integer representation details where applicable.

Once canonical Claim-body bytes exist, they can support a future governed
ordering decision and any required digest computation. This Draft does not
replace the accepted digest-order rule with bytewise ordering.

The dependency sequence is:

```text
Claim semantics
  ↓
VE-CBOR-1 Claim Body Schema / canonical representation
  ↓
VE-CEL-1 binding
```

It is not Claim semantics followed by Claim-digest invention followed by CEL.

## 11. Purity and portability requirements

Candidate CEL input construction is a pure deterministic function of only:

```text
Action
the explicit immutable collection of already-established Claims
Rule
an explicitly identified evaluation context where architecture authorizes one
```

It MUST NOT perform external lookups, consult mutable caches, resolve issuers
from an environment-dependent source, read the current time, depend on
nondeterministic iteration order, or re-execute verification.

Given the same Action, supplied established Claim collection, Rule, applicable
VE-CEL semantics version, and resolved representation dependencies, conforming
implementations MUST construct the same CEL input value. This condition is not
yet independently implementable because the Claim sort key and several exact
CBOR-to-CEL conversion rules remain unspecified.

## 12. SPEC-CEL-003 status

**PARTIALLY EXPLORED — NOT RESOLVED.**

This candidate explores the proposed namespace, direct Claim-body visibility,
preservation of multiplicity and conflict, issuer and verification-envelope
boundaries, and a provisional subject-reference binding view.

Exact portable Claim input mapping remains blocked by canonical Claim-body
representation. The task register is intentionally unchanged until a governed
specification is ready to claim completion.

## 13. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Conditional pass. The candidate keeps inputs explicit and inspectable while separating verification from evaluation. |
| New primitive burden | Pass. It introduces no primitive, Fact, Claim identity, or reference ontology. |
| Removability | Pass for a standalone mapping layer. The behavior belongs in the VE-CEL-1 binding, not a separate cross-cutting abstraction. |
| Twenty-year durability | Conditional pass. Canonical Claim-body representation should avoid freezing implementation artifacts into Claim semantics. |
| Independent implementability | Blocked. Complete Claim-body representation and exact CBOR-to-CEL conversion are unspecified. |
| Total conceptual complexity | Pass. The candidate retains only `action`, `claims`, and existing semantic values. |

**Verdict: D. BROADER REPRESENTATION DEPENDENCIES BLOCK THE CONTRACT.**

The block concerns complete portable Claim-body representation and exact
conversion rules, not a missing architectural primitive or a change to
Approved Rule semantics.

## 14. Governance and compatibility

No RFC is required for this Draft candidate. It does not revise an Approved
specification, accepted ADR, or Open Decision. If later work demonstrates that
the accepted Rule ADR's two-binding model or immutable-input constraints must
change, normal governance applies before such a change can be adopted.

Replacing the accepted digest-order criterion with canonical-byte ordering
would also require governance. This Draft does not make that change.

This candidate neither accepts Draft RFC-005 nor relies on `ObjectReference`,
`DigestReference`, a digest suite, or a portable Claim identity. Future
representation work may supply a sort key without changing Claim semantic
meaning.

## 15. Next artifact

The single next candidate artifact is **VE-CBOR-1 Claim Body Schema**. Its
purpose is to define:

- complete Claim-body structure;
- canonical labels;
- canonical field and value types;
- omission rules; and
- canonical bytes.

It must not casually introduce `claim_id`, `claim_digest`, `ClaimReference`,
or a new Claim primitive. It is not created by this Draft.

## Revision history

| Date | Change |
|---|---|
| 2026-08-27 | Initial Draft candidate; corrected after independent audit to identify broader Claim-body representation dependencies. |
