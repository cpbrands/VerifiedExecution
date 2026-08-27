---
id: PRESSURE-TEST-VERIFIED-CLAIM-RULE-EVALUATE-INPUT-MAPPING
title: Verified Claim to Rule Evaluate Input Mapping
version: "0.1"
status: Draft
document_type: Pressure Test
category: Kernel Analysis
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-27
depends_on: []
related_documents:
  - ARCHITECTURE-INDEX
  - ADR-RULE-001-002
  - ADR-VERIFY-002
  - VE-CLAIM-REFERENCE-SEMANTICS
  - SPECIFICATION-TASKS
  - PRESSURE-TEST-CLAIM-ACTION-VS-RULE-INPUT-SCOPE
supersedes: null
superseded_by: null
---

# Pressure Test — Verified Claim to Rule/Evaluate Input Mapping

## Status and authority boundary

This is non-normative kernel-analysis evidence. It does not create or modify
a Rule/Evaluate specification, Claim specification, CEL binding, RFC, ADR,
primitive, Open Decision, or canonical representation profile.

The relevant current authority is deliberately narrow:

| Source | Status | Used here for |
|---|---|---|
| ADR-RULE-001/002 | Accepted, VE Kernel Protocol v0.1 scope | `action` and `claims` as the only top-level Evaluate bindings; immutable inputs; deterministic list ordering when applicable. |
| ADR-VERIFY-002 | Accepted, profile-limited | `Claim { body, verification { profile, artifact } }` and the separation between Claim semantics and verification material. |
| Canonical Claim Reference Semantics | Draft | The three legal subject-reference meanings; not a finalized portable encoding. |
| RFC-005 and VE-002 | Draft | No accepted Claim/Event representation or digest decision is inferred from them. |

The reduced `Action / Claim / Rule / Verify / Evaluate` model remains
non-normative validation outside the accepted decisions' declared scopes.
This pressure test therefore tests specification ownership and minimum input
semantics; it does not promote an implementation contract to current
repository authority.

## Question

What is the absolute minimum deterministic mapping from already-verified
Claims into Rule/Evaluate inputs without reintroducing verification logic,
Trust Context, hidden conflict resolution, or a new abstraction layer?

## Starting boundary

```text
Verify(Claim, Trust Context)
  -> establishes whether the Claim is usable under that Trust Context

Evaluate(Action, established Claims, Rule)
  -> applies the Rule to explicit immutable inputs
```

The input boundary begins only after Claims are established. `claims` is the
explicit immutable collection of already-established Claims supplied to one
particular Evaluate invocation. Evaluate receives the semantic `Claim.body`
value of every Claim in that supplied collection.

The input boundary performs no implicit filtering. It MUST NOT select Claims
by issuer preference, recency, verification strength, predicate, “best
evidence,” external state, or hidden policy. Any future selection semantics
MUST be explicit Rule/Evaluate semantics, not behavior hidden inside Claim
input preparation.

The input boundary MUST NOT verify signatures, resolve trust anchors, decide
issuer trust, fetch credentials, invoke an external identity system, or
reinterpret a verification artifact.

## Attack 1 — Whole Claim, direct body input, or normalized tuple

Compare three inputs for every established Claim:

| Model | Input | Result |
|---|---|---|
| A | Full `Claim`, including `verification` | Rejected. It exposes non-semantic verification material to Evaluate. |
| B | The existing semantic `Claim.body` value | Survives. It exposes the assertion without duplicating Claim-body structure. |
| C | A new normalized tuple | Rejected. It repeats Claim-body field selection and would require a second schema to remain synchronized. |

There is no new projection, mapped Claim, `Fact`, or `EstablishedClaim`
abstraction. Each supplied established Claim contributes its existing
semantic `Claim.body` directly to Evaluate. The names below are explanatory
only:

```text
Evaluate input := {
  action: canonical semantic Action,
  claims: the Claim.body values of the explicit immutable collection of
          already-established Claims supplied to this Evaluate invocation
}
```

The input boundary does not construct a new Claim value, preserve verification
envelopes, or add a Claim identity. Engine-specific conversion of these
semantic values remains separate VE-CEL binding work.

## Attack 2 — Verification-envelope visibility

`verification.profile` and `verification.artifact` determine how Verify
established a Claim. They do not state what the Claim asserts.

Exposing either field to Rules would let evaluation branch on signature or
transport mechanisms rather than on established Claim semantics. No validated
scenario requires that behavior.

**Result: verification-envelope fields remain hidden from Rule/Evaluate.**

## Attack 3 — Issuer visibility

Consider two established Claims with identical subject, predicate, and value:

```text
Bank A: Account X, balance = 100
Bank B: Account X, balance = 100
```

The claims are not interchangeable for a Rule, because `issuer_ref` may be
decision-relevant even after both are established. It is semantic Claim-body
content, not signer, key, or identity-system metadata.

**Result: `issuer_ref` remains visible when present in Claim.body.**

## Attack 4 — Multiple and conflicting Claims

Consider two established Claims:

```text
C1: subject X, predicate P, value A
C2: subject X, predicate P, value B
```

The input boundary MUST expose both supplied semantic Claim bodies. It MUST
NOT pick a “best,” “latest,” or preferred Claim; merge different values; rank
them; or reject the input collection merely because it contains a conflict. A
Rule or another already authorized governance rule may determine the
consequence of the visible conflict.

**Result: conflict handling is explicit Rule/Evaluate behavior, never hidden
mapping behavior.**

## Attack 5 — Ordering

At the semantic Rule/Evaluate-input level, collection order has no semantic
meaning unless future Rule semantics explicitly define otherwise. No Claim
receives priority merely from its position in the collection.

For a VE-CEL binding that represents `claims` as a list, accepted
ADR-RULE-001/002 requires deterministic ascending bytewise ordering by content
digest. The repository does not yet define the portable Claim content-digest
construction needed to implement that list ordering. CEL ordering therefore
remains unresolved binding work. This pressure test does not define the digest
or its canonical encoding, and it does not introduce a `claim_digest` field or
semantic Claim identity.

**Result: deterministic list ordering belongs to VE-CEL binding work, not to
new Claim semantics or an independent mapping abstraction.**

## Attack 6 — Exact duplicates and Claim identity

An exact semantic duplicate has the same semantic Claim body, including the
same subject, issuer, predicate, value, and any semantically present times.
Presence and absence of a timestamp are not interchangeable and therefore do
not make two Claim bodies duplicates.

Multiplicity is preserved unless a future governed Rule/Evaluate contract
explicitly defines otherwise. Two semantically identical `Claim.body` values
MAY both appear in the supplied input collection. The input boundary MUST NOT
coalesce them implicitly.

This conclusion does not require `claim_id`, `claim_digest`, or
`ClaimReference` merely to preserve multiplicity. Rules requiring
distinct-attestation semantics MUST operate only on visible semantic
information or future governed Claim semantics, not hidden verification
artifacts.

**Result: portable Claim identity is not required for direct Rule/Evaluate
input.**

## Attack 7 — Subject-reference handling

The merged Draft Canonical Claim Reference Semantics supplies the semantic
meaning of these forms:

```text
ActionContentReference { action_digest }
ActionOccurrenceReference { action_id, action_digest }
EventReference { event_id }
```

The mapping exposes the already-established `subject_reference` as part of
Claim.body. It does not redefine those forms, add an attempt reference, or
convert an Event subject into attempt/grouping semantics.

## Attack 8 — Timestamps

`assertion_time` and `observation_time` are visible only when they are present
in the established Claim body. Their absence means not asserted or not
semantically material; it MUST NOT be replaced with a default time.

Rules that do not inspect a present timestamp need no special mapping rule.
Rules that do inspect one receive the semantic Claim-body value, not a
verification time, Event time, or host clock value.

## Attack 9 — Namespace and Fact abstraction

Accepted ADR-RULE-001/002 already limits Evaluate to two top-level immutable
bindings:

```text
action
claims
```

No additional `trusted_claims`, `observations`, `authorities`, or `facts`
namespace is necessary. `Fact` would merely rename an established Claim or
its body and would add no ownership, identity, lifecycle, or evaluation
semantics.

**Result: reject a Fact abstraction.**

## Attack 10 — Mapping-spec necessity and ownership

Compare the normative homes:

| Model | Result |
|---|---|
| A. Standalone mapping specification | Rejected. It would add a removable wrapper around Rule/Evaluate input semantics and engine binding. |
| B. Rule/Evaluate semantics plus VE-CEL-1 binding | Survives. They can define their distinct responsibilities without a new mapping object. |
| C. New independent mapping layer | Rejected. Direct established `Claim.body` input needs no intermediate abstraction. |

The ownership split is:

| Owner | Responsibility |
|---|---|
| Rule/Evaluate semantics | Explicit input membership, Claim-body visibility, multiplicity/cardinality semantics, conflict visibility, and any explicit selection semantics. |
| VE-CEL-1 binding | Exact CEL variable/type mapping, list representation, deterministic list ordering, and the required content-digest sort-key construction or dependency. |

The standalone wrapper fails removability: after placing these responsibilities
with Rule/Evaluate semantics and the VE-CEL-1 binding, no independent mapping
abstraction remains.

## Attack 11 — CEL boundary

The semantic input model is `action` plus the `Claim.body` values of the
explicit immutable established-Claim collection supplied to Evaluate. A
VE-CEL-1 contract may later define exact conversion of those values to CEL
types, list representation, ordering, and missing-value behavior.

That CEL work MUST NOT redefine Claim subject meaning, Verify/Trust Context
authority, or canonical representation. This pressure test is not a CEL
binding specification.

## Attack 12 — Hidden state

The mapping depends only on explicit inputs:

```text
Action
the explicit immutable collection of already-established Claims
Rule
an explicitly identified evaluation context where architecture authorizes one
```

It MUST reject hidden mutable caches, implicit “current trusted state,”
nondeterministic issuer preference, external lookups, and verification during
mapping.

## Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Explicit established Claim bodies preserve inspectable decision inputs and keep verification separate. |
| New primitive burden | Pass. No Fact, Claim identity, mapping object, or new primitive is needed. |
| Removability | Pass. A standalone mapping wrapper is removable once the Rule/Evaluate input contract owns its profile behavior. |
| Twenty-year durability | Pass. Claim bodies may evolve while Rule profiles explicitly define their own input conversion. |
| Independent implementability | Conditional pass. `action`, the explicit immutable Claim collection, and a profile-defined list/type contract are sufficient once the unresolved CEL ordering binding is specified. |
| Total conceptual complexity | Pass. Reusing Claim.body avoids a duplicate tuple and keeps only the two accepted top-level bindings. |

## Result

### A. DIRECT ESTABLISHED CLAIM.BODY INPUT IS SUFFICIENT

`claims` is the explicit immutable collection of already-established Claims
supplied to one Evaluate invocation. Evaluate receives every supplied Claim's
existing `Claim.body` value directly. The input boundary performs no implicit
selection, filtering, deduplication, ranking, merging, or conflict resolution.
It preserves multiplicity, exposes conflicts, keeps `issuer_ref` and present
semantic times visible, hides the verification envelope, and adds no Claim
identity or Fact abstraction.

Semantic collection order has no meaning here unless future Rule semantics
explicitly define one. VE-CEL list ordering is separate unresolved binding
work because the portable Claim content-digest construction is not yet
specified.

This does not justify a standalone Verified-Claim-to-Rule/Evaluate Input
Mapping specification. There is no independent mapping layer. The behavior
belongs in Rule/Evaluate semantics and a VE-CEL-1 input-contract binding,
aligned with `SPEC-CEL-003`.

The following remain rejected: `Fact`, a mapped Claim object, `claim_id`,
`claim_digest`, `ClaimReference`, hidden issuer selection, verification-
envelope exposure, and implicit deduplication.

No new primitive is required. No RFC is required for this pressure-test
result. A later normative specification that changes an Approved
specification would require normal governance.

## Next artifact

The single next candidate artifact is a **VE-CEL-1 Rule/Evaluate Input
Contract**, including the `SPEC-CEL-003` verified-Claim-to-CEL mapping. It
must define the Rule/Evaluate semantic input responsibilities and exact
VE-CEL type, list, and ordering behavior without creating a standalone mapping
abstraction or modifying Claim-reference semantics.

## Revision history

| Date | Change |
|---|---|
| 2026-08-27 | Initial non-normative pressure test. |
