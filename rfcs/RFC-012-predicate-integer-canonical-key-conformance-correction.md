---
id: RFC-012
title: Predicate Integer Canonical-Key Conformance Correction
version: "0.1"
status: Proposed
document_type: RFC
category: Representation
author: Verified Execution Editorial Board
created: 2026-09-11
updated: 2026-09-11
depends_on:
  - SPECIFICATION-GOVERNANCE
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - RFC-008
  - ADR-008
related_documents:
  - GAP-ANALYSIS-PREDICATE-INTEGER-CANONICAL-KEY-CONFLICT
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE
  - RFC-010
  - ADR-010
  - OPEN-DECISIONS
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
supersedes: null
superseded_by: null
---

# RFC-012 — Predicate Integer Canonical-Key Conformance Correction

## 1. Status and authority boundary

**Status:** Proposed

This RFC proposes a narrow governed correction to Approved DIGEST-001 v0.3,
the Approved Predicate Schema Canonicalization v1.2 conformance vectors, and
their derived Python and Node validators. It is a proposal, not current
authority. Repository inclusion, review, or merge does not itself change an
Approved specification, canonical byte, PSCID, conformance result, or
validator.

The proposal reaffirms the ownership already expressed by the Approved
Predicate Schema Canonical Representation Profile v1.2:

~~~text
conceptual Integer bounds
    -> canonical serialized members "minimum" / "maximum"
    -> canonical Predicate Schema bytes C
    -> DIGEST-001 suite/profile h'03'/h'03' framing
    -> PSCID
~~~

The Field-Semantic Representation Grammar v1.0 may continue to describe the
conceptual Integer limits as `lower_bound` and `upper_bound`. Semantic
concept labels and canonical serialized member names need not be identical.
That difference is not the defect addressed here.

This RFC does not authorize the correction. If accepted, a corresponding ADR
and the governed revisions identified below are still required before any
normative or conformance material changes.

## 2. Context and problem statement

The Approved Predicate Schema Canonical Representation Profile v1.2 §5.2
defines an Integer node with this exact canonical shape:

~~~text
{
  "form": "integer",
  "minimum"?: Bound,
  "maximum"?: Bound,
  "scale"?: non-negative CBOR integer,
  "allowed_values"?: [integer, ...]
}
~~~

Approved DIGEST-001 v0.3 §§6.5–6.6 bind PSCID suite/profile `h'03'/h'03'`
to the Approved v1.2 byte-producing canonicalization closure. DIGEST-001
explicitly excludes itself, vectors, and validators from that byte-producing
closure and consumes the canonical bytes `C` produced by it.

Despite that dependency direction, DIGEST-001 anchors A and D, the Approved
v1.2 conformance-vector artifact, and both current validators derive bounded
Integer canonical maps containing:

~~~text
"lower_bound"
"upper_bound"
~~~

Those names come from the conceptual Field-Semantic Representation Grammar,
but the current implementations emit them as serialized canonical members.
They therefore conflict with the exact representation owned by the canonical
profile.

For the ordered scale-2 CAD fixture used by anchor A, independent Python and
Node reconstruction establishes:

| Path | Canonical `C` | DIGEST frame | PSCID |
|---|---:|---:|---|
| Authoritative canonical profile: `minimum` / `maximum` | 350 octets | 367 octets | `039a4774bb744ee566229aac22caa89af19b2b72d0f72df7d9cf62bc5281f96603` |
| Conflicting published implementation: `lower_bound` / `upper_bound` | 358 octets | 375 octets | `032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010` |

The eight-octet difference is completely accounted for by the two longer
encoded text-string keys. Predicate meaning is unchanged, but canonical
content and its PSCID differ.

The current validators accept and emit the conflicting lower/upper member
names, reproduce the published anchor, reject the corresponding
minimum/maximum source as an unknown field, and still pass their own suites.
The implementation and its expected outputs share the same error. Passing
validators therefore do not establish conformance to the canonical profile.

The merged non-normative conflict analysis found no actual Claim,
Rule/Evaluate input, or Reference Scenario embedding either anchor-A PSCID.
That repository search does not establish whether an external deployment has
used the nonconforming output.

## 3. Proposed decision

Adopt **Option A: retain `minimum` / `maximum` as the authoritative
canonical Integer-node serialized keys and correct the conflicting downstream
conformance material.**

If accepted, the coordinated correction will:

1. preserve Predicate Schema semantic meaning and equality;
2. preserve the Field-Semantic Representation Grammar's conceptual
   `lower_bound` / `upper_bound` vocabulary;
3. leave the Predicate Schema Canonical Representation Profile v1.2 byte
   recipe unchanged;
4. leave PSCID representation-profile and suite codes `h'03'/h'03'`
   unchanged;
5. correct affected DIGEST-001 anchors and explanations to consume the
   canonical profile's bytes;
6. correct affected diagnostics and anchors in the Approved v1.2 conformance
   artifact;
7. correct the Python and Node validators so their canonical output uses
   `minimum` / `maximum`;
8. add bounded-Integer regression coverage linking the current validators to
   the Approved v1.0 minimum/maximum evidence;
9. record the conformance and compatibility impact in CHANGELOG;
10. update the current DIGEST version pointer for PSCID-001 in OPEN_DECISIONS
    when the corrected DIGEST revision becomes Approved; and
11. independently replay affected bytes and PSCIDs before approval.

The correction must preserve unaffected evidence. Current v1.2 A1, A4, A5,
A6 and PSCID anchors B and C do not contain bounded Integer members and are
not changed merely by this key correction. A2 and A3 canonical-byte
diagnostics, PSCID anchors A and D, and corresponding derived validator bytes
and expectations are affected.

The nonconforming published PSCID:

~~~text
032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010
~~~

was never conforming for anchor A under the authoritative `h'03'/h'03'`
canonical closure. It is an erroneous conformance expectation reproduced by
the current validators. It is not an alternate valid PSCID, historical
canonical identity, or second representation profile.

The correct PSCID for that fixture under the already-authoritative closure is:

~~~text
039a4774bb744ee566229aac22caa89af19b2b72d0f72df7d9cf62bc5281f96603
~~~

No alias, equivalence rule, migration registry, or dual-validity rule is
introduced between these values.

## 4. Motivation

A fixed canonical profile is useful only if all downstream identity material
consumes its exact bytes. Leaving the contradiction in place permits two
implementations to follow different Approved conformance statements and derive
different identities for the same conceptual Predicate Schema.

The narrow correction restores the intended dependency:

~~~text
one semantic Predicate Schema
    -> one profile-governed canonical representation
    -> one suite-governed PSCID
~~~

It does so without changing semantic bounds, representation ownership,
cryptographic framing, suite allocation, or the kernel primitive set.

## 5. Goals and non-goals

### 5.1 Goals

This proposal aims to:

- restore agreement between the canonical profile, DIGEST-001 anchors,
  conformance evidence, and validators;
- retain exact canonical member names `minimum` and `maximum`;
- retain current Predicate interval semantics;
- retain the immutable `h'03'/h'03'` construction;
- preserve historical Approved artifacts where they are unaffected;
- document compatibility consequences of nonconforming implementation output;
  and
- unblock Claim Body Schema v0.2 only after the correction is governed,
  merged, and verified on authoritative main.

### 5.2 Non-goals

This RFC does not propose:

- changing the Predicate Schema Semantic Contract;
- changing the Field-Semantic Representation Grammar;
- changing the Predicate Schema Canonical Representation Profile;
- renaming conceptual grammar fields;
- modifying Predicate comparison semantics;
- changing PSCID framing, hash algorithm, identity layout, suite code, or
  representation-profile code;
- legitimizing or aliasing the nonconforming PSCID;
- universal schema migration or automatic Claim rewriting;
- a content-identity, alias, registry, resolver, or compatibility primitive;
- a new VE-xxx allocation; or
- resuming or modifying the VE-CBOR-1 Claim Body Schema in this workstream.

## 6. Authority and immutable-suite consequences

The proposed correction changes conformance statements and outputs, not the
canonical recipe bound to `h'03'`.

DIGEST-001 v0.3 defines `C` by reference to its frozen byte-producing
closure. The canonical profile in that closure has always specified
`minimum` / `maximum`. Correcting a derived anchor to match that unchanged
recipe does not assign a new meaning to `h'03'`, change its canonicalization
profile, or change the PSCID construction.

Accordingly, Option A requires no new representation-profile code or PSCID
suite code. Any future proposal that instead changes admission,
normalization, canonical structure, ordering, framing, algorithm, or identity
layout crosses the immutable-suite boundary and must use the applicable
successor-profile/suite governance. This RFC does not authorize such a change.

## 7. Compatibility classification

This proposal preserves:

| Dimension | Option A impact |
|---|---|
| Predicate semantic meaning | Unchanged |
| Predicate semantic equality | Unchanged |
| Normatively defined canonical profile bytes | Unchanged |
| Correct PSCID formula and meaning | Unchanged |
| PSCID suite/profile `h'03'/h'03'` | Unchanged |
| Published affected diagnostics and anchors | Corrected |
| Nonconforming validator output | Corrected |

The correction is machine-consequential because affected expected hashes,
PSCID values, and validator outputs change. It therefore is not treated as
purely editorial even though the authoritative canonical recipe is unchanged.

The wrong-path PSCID has no conforming status to preserve. An implementation
or deployment that emitted, stored, or signed material using it may require
deployment-specific remediation consistent with its own retained artifacts
and authorization rules. Repository evidence does not show that such material
exists, so this RFC does not claim universal reissuance is required.

A signed Claim is never silently rewritten. No equivalence is inferred between
the two PSCIDs. Correct material is produced and verified through the ordinary
governed representation and authentication processes.

## 8. Alternatives considered

### 8.1 Option A — preserve minimum / maximum

**Proposed.** This option follows the existing representation owner, corrects
downstream conformance material, preserves the frozen recipe, and adds no
identity or migration mechanism.

### 8.2 Option B — change canonical keys to lower_bound / upper_bound

Rejected. This would change bounded-Integer canonical bytes approved in v1.0
and retained by v1.1/v1.2. It would require a successor canonical profile,
new representation-profile code, new PSCID suite, new anchors, and broader
migration analysis. It also lacks evidence of an intentional canonical rename.

### 8.3 Treat both encodings as valid

Rejected. Dual validity defeats canonicalization, gives one conceptual schema
multiple canonical contents, and requires prohibited alias/equivalence
machinery.

### 8.4 Treat validators or the published anchor as overriding authority

Rejected. DIGEST-001 expressly consumes the canonical closure and excludes
itself, vectors, and validators from the byte-producing recipe.
Implementation behavior cannot silently redefine an Approved specification.

### 8.5 Leave the contradiction unresolved

Rejected. Independent implementations can derive consequentially different
PSCID values while citing different Approved conformance statements.

## 9. Security impact

The correction reduces identity-confusion and substitution risk by restoring
one deterministic canonical representation. It prevents a validator-generated
nonconforming identity from being treated as an alternate valid identity.

No new cryptographic algorithm, downgrade rule, collision rule, trust
mechanism, network lookup, registry, or resolver is introduced. Exact PSCID
byte equality and existing collision handling remain unchanged.

## 10. Complexity impact

The proposal removes accidental dual behavior. It adds no runtime object,
field, service, identifier family, alias table, negotiation mechanism, or
primitive. The implementation correction is local to canonicalization and
conformance evidence.

One RFC and one corresponding ADR are sufficient for this coordinated issue.
Multiple architectural decisions would duplicate governance without reducing
risk.

## 11. Specification and artifact impact

This RFC proposes the following exact future correction scope. It does not
modify these files itself.

### 11.1 Approved specification requiring revision

~~~text
specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md
~~~

DIGEST-001 requires a governed version increment, corrected affected anchors,
revision history, and references to the accepted RFC/ADR. A next minor
revision such as v0.4 is plausible from repository progression, but this
Proposed RFC does not make that version authoritative.

### 11.2 Governed conformance artifact requiring revision

~~~text
test-vectors/PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE.md
~~~

This is Approved Conformance Vectors v1.2, category Conformance; it is governed
normative conformance evidence, not a Specification. It requires a
distinguishable corrected revision for A2/A3 diagnostics, anchors A/D, and
bounded-Integer regression evidence. The exact corrected revision label is
selected through the coordinated governance change.

### 11.3 Derived validator corrections

~~~text
test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.py
test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.mjs
~~~

Both implementations must consume conceptual bounds while emitting the exact
canonical `minimum` / `maximum` structure, update affected expected values,
and independently converge.

### 11.4 Governance and support updates

~~~text
CHANGELOG.md
OPEN_DECISIONS.md
~~~

CHANGELOG records that Predicate semantics, the canonical recipe, and
`h'03'/h'03'` remain unchanged while affected conformance expectations and
validator output are corrected. OPEN_DECISIONS updates only the current
DIGEST version pointer for PSCID-001 after the revised specification becomes
Approved; it does not become a semantic owner.

### 11.5 Explicitly unaffected artifacts

No correction is proposed to:

- specifications/PREDICATE-SCHEMA-SEMANTIC-CONTRACT.md;
- specifications/PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR.md;
- specifications/PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE.md;
- historical v1.0/v1.1 conformance vectors;
- PSCID suite/profile code allocations;
- VE-CBOR-1 Claim Body Schema;
- Rule/Evaluate specifications; or
- ARCHITECTURE_INDEX.md.

## 12. Implementation impact and validation

The Python and Node validators need independent corrections, not a shared
precomputed byte string. Validation for the coordinated correction must
include:

- independent Python and Node canonical reconstruction;
- exact complete `C`, frame, digest, and PSCID comparison;
- A2 and A3 corrected diagnostics;
- anchors A and D corrected end to end;
- unchanged replay of A1, A4, A5, A6 and anchors B/C;
- Approved v1.0 bounded-Integer V1-B/V1-F regression coverage;
- key-order and shortest-length checks under VE-CBOR-1;
- rejection of unknown canonical Integer members; and
- repository documentation, tests, links, and whitespace validation.

Passing the existing validators without these cross-version checks is
insufficient because their implementation and expected values share the same
mistake.

## 13. Governance and sequencing

SPECIFICATION_GOVERNANCE §§2,9,12 require an RFC, ADR, specification version
increment, revision history, CHANGELOG entry, and applicable conformance-test
updates for an Approved-specification change. It provides no narrower erratum
exception.

The proposed sequence is:

1. review and accept this RFC;
2. create and accept one corresponding ADR recording the existing canonical
   ownership boundary and the selected correction;
3. revise DIGEST-001 with a version increment;
4. revise the governed v1.2 conformance-vector artifact;
5. correct both derived validators;
6. update CHANGELOG and the OPEN_DECISIONS current-version pointer;
7. independently reproduce all affected and unaffected regression evidence;
8. merge and verify the coordinated correction on authoritative main; and
9. resume VE-CBOR-1 Claim Body Schema v0.2 work.

Until step 8 is complete, Claim Body Schema v0.2 remains blocked because its
Predicate PSCID embedding cannot safely be finalized while an Approved
repository artifact publishes a conflicting conformance identity.

No new VE-xxx identifier, architectural primitive, registry, alias, or
compatibility mechanism is required.

## 14. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles | Pass. One explicit canonical authority supports durable evidence and independent verification. |
| Primitive burden | Pass. No new primitive, registry, resolver, alias or identity form. |
| Removability | Pass. No new architectural object is introduced; removing the correction would restore consequential ambiguity. |
| Twenty-year durability | Pass. Fixed canonical keys and retained governance do not depend on a library, deployment or online service. |
| Independent implementability | Pass for the proposal. Independent Python and Node reconstructions converge on the proposed existing recipe. |
| Reduced conceptual complexity | Pass. One canonical representation replaces accidental dual behavior without compatibility machinery. |

## 15. Open questions

The architecture and selected canonical keys are not open in this proposal.
The coordinated correction review must still confirm:

1. the exact next DIGEST-001 version number;
2. the exact distinguishable revision label for the Approved v1.2 conformance
   artifact;
3. complete regenerated values for A2, A3, anchors A and D; and
4. whether any known deployment used the nonconforming output and therefore
   needs deployment-specific remediation.

These questions do not reopen Predicate semantics, canonical representation
ownership, suite/profile `h'03'/h'03'`, or the no-alias decision.

## 16. Decision requested

Accept Option A:

> Preserve the existing canonical Predicate Integer members `minimum` and
> `maximum`. Correct DIGEST-001, governed conformance evidence, and derived
> validators to consume that unchanged representation. Preserve PSCID
> suite/profile `h'03'/h'03'`; recognize the published
> `032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010`
> value as nonconforming for anchor A; introduce no alias, primitive, registry,
> or VE-xxx allocation.

Acceptance of this RFC records the approved proposal only. The correction
becomes authoritative through the corresponding accepted ADR and coordinated
governed revisions.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-11 | Initial Proposed RFC selecting Option A for the Predicate Integer canonical-key conformance correction. |
