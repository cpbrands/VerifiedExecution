---
id: VE-CEL-1-SEMANTIC-PROFILE-001
title: VE-CEL-1 Immutable Semantic Profile 001
version: "1.0"
status: Approved
document_type: Semantic Profile Specification
category: Specification
author: Verified Execution Editorial Board
created: 2026-09-13
updated: 2026-09-13
depends_on:
  - ADR-013
  - ADR-RULE-001-002
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - VE-001
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CLAIM-REFERENCE-SEMANTICS
  - CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - VE-002
  - ADR-VERIFY-002
  - ADR-010
  - ADR-ENC-001
related_documents:
  - RFC-013
  - SPECIFICATION-TASKS
  - RS-CEL-001
  - GAP-ANALYSIS-RS-CEL-001-DETERMINISTIC-RULE-EVALUATION
supersedes: null
superseded_by: null
---

# VE-CEL-1 Immutable Semantic Profile 001

## 1. Status and authority boundary

**Status:** Approved v1.0

**Language family:** `VE-CEL-1`

**Allocated semantics version:** `001`

**Governing decision:** Accepted ADR-013

This specification allocates the first immutable semantic profile for the
`VE-CEL-1` language family. It gives the pair:

```text
(VE-CEL-1, 001)
```

one permanent, complete, historically resolvable meaning. The allocation
becomes authoritative when this Approved artifact is merged into
authoritative `main`. Its meaning is the exact closure in Sections 3–6 and
MUST NOT be inferred from a mutable branch, a current file at the same path,
the word "latest", or a document version alone.

This specification implements the allocation work delegated by Accepted
ADR-013. It does not change Rule semantics, Rule/Evaluate behavior, VE-CEL-1
Draft v0.2, or any dependency named in the manifest. It does not define a Rule
wire representation, Rule content identity, or a Rule digest construction.

## 2. Allocation and identifier

The exact abstract `semantics_version` value allocated here is the
three-character ASCII token:

```text
001
```

The value is family-scoped. Only the pair `(VE-CEL-1, 001)` has the meaning
defined here. `001` is not a document version, VE-CEL release number, policy
version, deployment version, or claim that Draft v0.2 is itself an immutable
semantic identifier.

`001` is the smallest clear repository-style ordinal that is distinct from
the mutable Draft label `0.2` and leaves document lifecycle visibly separate
from semantic identity. Repository-wide collision and reservation review found
no prior `VE-CEL-1` semantic-profile allocation. This allocation creates no
registry and establishes no general syntax for future families or versions.
Each future allocation remains governed specification work.

This document fixes the abstract value only. It does not decide whether a
future Rule representation encodes `language` or `semantics_version` as CBOR
text, bytes, integers, labels, or another representation.

## 3. Immutable authority anchor

The repository-native authority root for this allocation is the exact Git
commit:

```text
8a794a0bfc64b28697be4b4a8f517fe0c1f86b09
```

Every repository dependency in Section 4 is identified by all of:

1. its repository-relative historical path;
2. its exact Git blob object identifier at that commit;
3. SHA-256 of its exact file bytes; and
4. its exact byte length.

The path is descriptive. The blob, SHA-256, length, and authority-root commit
are the immutable resolution data. A resolver MUST recover the object from the
recorded commit or another byte-identical historical store and MUST verify the
recorded identifiers before using it. A file currently present at the same
path is not a substitute unless its exact bytes match.

The external CEL authority is independently pinned by exact source-repository
commit and file hash in Section 5. RFC 8949 is identified by its immutable RFC
publication number and the SHA-256 of the canonical RFC Editor text artifact.

The mapping in this Approved specification is the permanent allocation record.
After publication, the artifact's own immutable Git blob and containing commit
provide the durable identifier-to-manifest authority. No runtime service,
registry, mutable URL, or mutable configuration participates.

## 4. Frozen repository dependency manifest

The following 17 exact repository artifacts are the complete
interpretation-affecting repository closure for `(VE-CEL-1, 001)`.

| Exact historical path | Role in the closure | Git blob SHA | File SHA-256 | Bytes |
|---|---|---|---|---:|
| `specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md` | Primary VE-CEL syntax, environment, projection, ordering, guard, limit, failure, and outcome rules | `5861bb86877d50cfa2273763d6518504dc92d5c1` | `d2833a7ffc290ae78aa3154a21319311cd7e3904522c22105b7380082675b00b` | 45258 |
| `adrs/ADR-RULE-001-002-VE-CEL-1.md` | Accepted deterministic Rule/Evaluate architecture and two-binding/outcome decisions | `053a29fd68d38b75933422ed8e5ecaf046d3b395` | `d96186ad6b50c6ca1f84c4ac9d64e5113f84e972dfb1e8f6a663e2db81311b8b` | 6529 |
| `adrs/ADR-013-canonical-rule-semantic-boundary.md` | Accepted immutable-profile invariant and Rule semantic boundary | `46a634a5dd5d0318f4d2ea1855f92cb0c6e7e630` | `1a0e11bc40792915c64d189e4c6914fadeb13415ba7ddd7d171e25d22a30dc9c` | 23792 |
| `specifications/VE-001-action-specification.md` | Action semantic value and occurrence/content distinction used by projection | `4ad588fba3475fbeb83d4c0958e4d9f75e56fd89` | `ee4e37f43be4e2f630636f79cbaa39f1d688107477bd5d9bcb03e628985bd2b5` | 28868 |
| `specifications/VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE.md` | Action canonical bytes and identity inputs used by validation and input-size measurement | `fc3ae376e02339d67a8760a747ad55116b80a10f` | `9b79efcb630513212b3397ca60c74a66f32bd7aeb8877139e87c5a910a843ed3` | 22466 |
| `specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md` | Exact Claim.body closure, canonical bytes, four fields, and four subject arms | `8a2dcc33544949ef8530f61906b2589634e5cc72` | `ace51ffc9b36e5f0d6365205b0b0ade86b47e778cb1c987ffb3fee006b085689` | 18686 |
| `specifications/VE-CLAIM-REFERENCE-SEMANTICS.md` | Action, Event, and external subject-reference meanings and distinctions | `ce5738d534ded3d0cef5918b62b5b6301729323c` | `038d81db1067702a08a9c6ac602ef34b7f64faa59b7550cdb1fd351a18ea0ef8` | 19312 |
| `specifications/CLAIM-BODY-SEMANTIC-FIELD-CONTRACT.md` | Claim issuer, Predicate, value, and subject semantic field ownership | `2365e7e8f67c2e0bb1d70928eb550219c1ea11cc` | `29dcd194fca7b61e488dfc8b8fbdef08ec7a6ba9b1611b9aeb1e2a5bd98f1f9c` | 12937 |
| `specifications/CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS.md` | PSCID-to-governing-Predicate resolution and applicability semantics | `410f2c9e56f10d454c337621f4cc7e3f1202cabc` | `8b38c8a08c2e475cfedddb89c7c6e174623296ed382654cbcd6fc5c1ad8cf960` | 16164 |
| `specifications/PREDICATE-SCHEMA-SEMANTIC-CONTRACT.md` | Predicate, issuer, subject, value, comparison, and FieldForm semantics | `e4498f92632d6c060b2706e308d72c5fff73673f` | `8512b5cf7a48974996b7d8a5a61bd21a98e845e74beb17edc8498a0fae8e33bc` | 38452 |
| `specifications/PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR.md` | Closed recursive FieldForm representation grammar and bounds | `bd8c8cf17b8d4a2cb2c8d9b6939ac8085d81918e` | `d5ed0cd1880e328bc2cc24d940ac966ab5f24940ecdfd0f3ed434779fd5c5b64` | 32058 |
| `specifications/PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE.md` | Canonical Predicate bytes and comparison-relevant profile closure | `495e8f50ab1cbdea134c1ff2a1d6f10fd0a236b4` | `cf84a6c02f264a2297a2d62297fec4e87e7964dbb9f666d3dc0790ec9def69ad` | 45143 |
| `specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md` | Exact PSCID resolution, suite/profile `03/03`, and retained Predicate identity | `e1bacdfd613ce66b293c5387db8f8e90f28ee312` | `a19637ec8beb9927b92127919719a802c5a113574adda18801e549b1074661e6` | 36462 |
| `specifications/VE-002-event-specification.md` | Event identity semantics used by the EventReference projection arm | `b7ee2bafd8e2483e506961e5dabfe778939aa38f` | `fa8f6fd2b7d497b775de1df84b9d478824bd3c31f68b7d1992713508628c7fee` | 11448 |
| `adrs/ADR-VERIFY-002-CLAIM-VERIFICATION-ENVELOPE.md` | Applicable successful verification as the pre-Evaluate eligibility boundary | `b2568175176e5221b4ec1b31489fc7ff225053f2` | `08750dbeba52a7f67bb8b3358569bafdded2b10fa4923af25e88f4e630ec786a` | 4574 |
| `adrs/ADR-010-cross-predicate-value-comparison-semantics.md` | Predicate ownership of cross-Predicate comparability and profile restriction boundary | `5f82d3666d771ca9a30f51e3b46074d65dd4df08` | `b1006cdf2a4bc19574964985e1178ba7456927d7d759222c6d520df049d97d46` | 16637 |
| `adrs/ADR-ENC-001-VE-CBOR-1.md` | VE-CBOR-1 deterministic byte rules used by canonical Action and Claim inputs | `f346e33317f5c53b4685ab816a02c8ffefeb4f22` | `d76f23a622e92ad23e6cd68c150a65a618925c037bb8004b9a0159ea8e15e48f` | 3253 |

Every row is interpretation-affecting directly or transitively. Retaining the
whole exact artifact lets an implementer resolve the clauses identified by
Section 6 in their original context rather than from copied excerpts.

The dependency classes are:

- **direct interpretation-affecting:** VE-CEL-1, ADR-RULE-001/002, ADR-013,
  VE-001, the VE-001 Action representation profile, the Claim Body Schema,
  Claim Reference Semantics, the Predicate Schema Semantic Contract, the
  Field-Semantic Representation Grammar, and ADR-VERIFY-002;
- **transitive immutable dependency:** the Claim Body Semantic Field Contract,
  Claim Predicate Schema Reference Semantics, Predicate canonical profile,
  DIGEST-001, VE-002 Event identity, ADR-010 comparison semantics, and
  ADR-ENC-001; and
- **non-semantic/governance-only:** the exclusions in Section 7, which are not
  part of the closure.

Temporal statements in the frozen ADRs that correctly said no allocation
existed before this specification are historical governance context, not
evaluation behavior. This newer allocation record controls the current fact
of allocation. Likewise, old future-work language saying Rule representation
was blocked is satisfied at the allocation boundary; it does not change the
frozen evaluation semantics. No other accepted decision in those artifacts is
superseded.

The source commit is an additional integrity and discovery anchor, not a rule
that imports every file in that commit. Files absent from this table do not
enter the semantic closure merely because they share the commit.

## 5. Frozen external authority

### 5.1 CEL language

The underlying CEL language authority remains exactly the pin selected by the
frozen VE-CEL document:

| Property | Immutable value |
|---|---|
| Project | `cel-expr/cel-spec` |
| Release tag | `v0.25.2` |
| Git commit | `cb51b4176013ad19bd00df94be273c322916a620` |
| Language authority | `doc/langdef.md` at that commit |
| `doc/langdef.md` SHA-256 | `46a377cde5a4b0fe1d3023bf7e663d91dfabf6c30868c6b5c2867e057a79ae5b` |
| Conformance corpus | `tests/` in that exact commit, restricted by this VE-CEL profile |

Independent resolution confirmed that tag `v0.25.2` points to the recorded
commit and that the language-authority bytes produce the recorded SHA-256.
The commit, not the tag name or a moving web page, is authoritative.

### 5.2 Canonical CBOR base

ADR-ENC-001's external base is the immutable publication `RFC 8949`,
*Concise Binary Object Representation (CBOR)*, December 2020. SHA-256 of the
canonical RFC Editor `rfc8949.txt` artifact used for this allocation is:

```text
f1164a5b31a39350ad46abe29b83575eb933ca6c45366989c118b6b1058a214a
```

ADR-ENC-001's exact frozen blob remains the authority for VE-CBOR-1's stricter
rules; RFC 8949 does not enlarge the accepted VE subset.

### 5.3 Unicode normalization and assigned repertoire

The Unicode authority for this profile is **Unicode Standard 15.0.0**. The
normalization algorithm is Unicode Standard Annex #15, *Unicode Normalization
Forms*, revision 53, issued for Unicode 15.0.0. The exact versioned UCD files
below freeze the assignment boundary and all data needed for canonical
decomposition, canonical combining classes, composition, optional quick-check
processing, and conformance testing.

Unicode 15.0.0 is selected because its complete UAX revision and required UCD
data are versioned, historically retrievable, and sufficient for every frozen
VE fixture. It is not selected as a moving newest release; later releases do
not alter this allocation.

| Role | Exact versioned authority | SHA-256 | Bytes |
|---|---|---|---:|
| NFC algorithm and stability rules | `https://www.unicode.org/reports/tr15/tr15-53.html` | `0ed23fb393dc79dbb31dc3056f93c5b5da3d3e2ed4f490759fc4abeacbdcc214` | 136410 |
| Canonical decomposition and canonical combining classes | `https://www.unicode.org/Public/15.0.0/ucd/UnicodeData.txt` | `806e9aed65037197f1ec85e12be6e8cd870fc5608b4de0fffd990f689f376a73` | 1913704 |
| Derived normalization properties, including NFC quick-check and full composition exclusion | `https://www.unicode.org/Public/15.0.0/ucd/DerivedNormalizationProps.txt` | `d5687a48c95c7d6e1ec59cb29c0f2e8b052018eb069a4371b7368d0561e12a29` | 837688 |
| NFC conformance vectors | `https://www.unicode.org/Public/15.0.0/ucd/NormalizationTest.txt` | `fb9ac8cc154a80cad6caac9897af55a4e75176af6f4e2bb6edc2bf8b1d57f326` | 2625136 |
| Assigned-character repertoire | `https://www.unicode.org/Public/15.0.0/ucd/DerivedAge.txt` | `7570877e0fa197c45338f7c41a02636da4e14c8dba6a3611a01cd30bf329d5ca` | 130720 |

The versioned URLs are descriptive retrieval locations. The Unicode version,
UAX revision, exact file hashes, and lengths are the immutable authority. A
byte-identical historical store is sufficient; a mutable Unicode alias or a
host library's current data is not.

For every semantic text value whose frozen authority requires valid UTF-8 in
NFC under this profile, each decoded code point MUST first be a Unicode scalar
value and MUST have an assignment entry in the frozen Unicode 15.0.0
`DerivedAge.txt`. A scalar absent from that file is unassigned for this profile
and MUST be rejected. Surrogate code points are not Unicode scalar values and
remain invalid. This assigned-repertoire rule applies to Rule source, Text
FieldForm values, governed normalized Record member names, textual issuer and
reference identifiers, and Action or Claim textual semantic fields. It does
not apply to opaque `bytes`.

After repertoire admission, an implementation MUST determine NFC using UAX
#15 revision 53 and the frozen Unicode 15.0.0 data above. The complete string
MUST already equal its NFC result. A non-NFC string MUST be rejected; it MUST
NOT be normalized and then accepted. An implementation using a direct NFC
algorithm need not use quick-check properties, but any quick-check optimization
MUST use the frozen properties and produce the same decision.

The deterministic admission order is:

1. decode valid UTF-8 and reject any non-scalar value or surrogate;
2. reject every scalar absent from the Unicode 15.0.0 assigned repertoire;
3. compute or verify NFC under UAX #15 revision 53 and the frozen UCD data;
4. reject unless the original scalar sequence is already NFC; and
5. pass the original, unchanged text to the remaining frozen semantic rules.

Unicode normalization stability guarantees identical future NFC results for
strings restricted to characters assigned in the selected version. A later
Unicode implementation MAY be used only when it enforces the Unicode 15.0.0
repertoire boundary and the frozen NFC behavior. It MUST NOT admit a scalar
that was unassigned in Unicode 15.0.0 merely because a newer runtime assigns
it.

## 6. Complete interpretation mapping

The manifest fixes the complete evaluation closure as follows.

| Interpretation-affecting behavior | Exact owner in the frozen closure |
|---|---|
| Rule source interpretation and exact UTF-8/NFC artifact | VE-CEL-1 Sections 2 and 15; ADR-RULE-001/002; ADR-013 |
| CEL parsing, standard values, operators, errors, unknowns, functions, and macros | CEL commit in Section 5, narrowed by VE-CEL-1 Sections 2 and 13 |
| Unicode repertoire admission and NFC validity for every governed semantic text value | Unicode 15.0.0, UAX #15 revision 53, and the exact UCD artifacts in Section 5.3 |
| Permitted syntax/operators/functions/macros and literal PSCID guard | VE-CEL-1 Sections 12–13 |
| Exactly two bindings, `action` and `claims` | ADR-RULE-001/002 and VE-CEL-1 Sections 1 and 3 |
| Action admission, identity, canonical bytes, projection, and input-size contribution | VE-001, VE-001 Action Canonical Representation Profile, VE-CEL-1 Sections 4 and 15 |
| Claim.body admission, canonical bytes, exact four-member projection, and subject union | Claim Body Schema, Claim semantic/reference authorities, VE-CEL-1 Sections 5–7 |
| Eligible-Claim input semantics | ADR-VERIFY-002 and VE-CEL-1 Section 5; exact verification algorithm and host selection remain invocation inputs |
| Deterministic Claim ordering and duplicate/conflict preservation | VE-CEL-1 Sections 10–11 |
| FieldForm conversion and composite mapping | Predicate semantic/grammar authorities and VE-CEL-1 Sections 7 and 9 |
| Integer `int`/`uint` mapping and out-of-range behavior | VE-CEL-1 Section 8 |
| Predicate and PSCID applicability | Claim Predicate Reference Semantics, Predicate authorities, DIGEST-001, and VE-CEL-1 Sections 6 and 12 |
| Cross-Predicate profile restriction | ADR-010 and VE-CEL-1 Section 12 |
| Structural and resource acceptance | VE-CEL-1 Section 15 |
| Missing, unknown, profile, runtime, and error mapping | ADR-RULE-001/002 and VE-CEL-1 Section 14 |
| Boolean final-result requirement and Evaluate outcomes | ADR-RULE-001/002 and VE-CEL-1 Sections 14 and 16 |

The exact VE-CEL blob remains the local authority when this mapping is only a
summary. The other frozen artifacts retain authority for the semantic objects
and canonical representations they own. No interpretation-affecting decision
is resolved from mutable current `main`.

## 7. Deliberate exclusions

The following are not semantic-profile dependencies:

- domain-specific Action Schemas and Predicate Schemas, which are explicit
  governed evaluation inputs identified through their existing Action schema
  digest or PSCID;
- a particular Claim cryptographic verification algorithm, artifact, key, or
  VerificationContext, because successful applicable verification and
  explicit host selection are the fixed eligibility interface;
- Rule legitimacy, provenance, approval, applicability, or Root Authority
  policy;
- Claim truth, evidence authenticity, freshness, authorization, execution,
  Event creation, or Receipt creation;
- conformance vectors, Reference Scenarios, implementation libraries, and
  validators, which are validation evidence rather than semantic authority;
- RFC-013, changelogs, task registers, open-decision registers, and repository
  process documents, which are rationale or governance evidence rather than
  evaluation behavior; and
- a compiler artifact, optimized AST, cache, clock, network, filesystem,
  environment variable, runtime registry, deployment default, host Unicode
  version, Python `unicodedata` release, or Node/ICU release.

These exclusions prevent both under-pinning and unrelated over-pinning. A
different domain input does not select a different semantic version; a change
to the profile rules that admit, project, order, or evaluate that input does.

## 8. Permanent lifecycle rule

The identifier `001` is permanently bound to the exact closure above and MUST
never be redefined, retargeted, extended, narrowed, repaired in place, or made
to follow a current document.

Any future VE-CEL change capable of altering Rule validity, the projected
environment, evaluation behavior, resource acceptance, failure mapping, or
final outcome MUST allocate a new `semantics_version`.

Later editorial documentation may explain `(VE-CEL-1, 001)` differently only
when it cannot change any such behavior. Historical evaluation MUST continue
to resolve the exact immutable anchors in this specification even after
current VE-CEL documentation advances. If there is reasonable doubt whether a
change is behavior-neutral, it requires a new semantic version.

Historical resolution therefore remains possible without trusting the state
of a branch, current path, package default, or external service.

## 9. Unsupported-profile behavior

A consumer that does not support the exact pair `(VE-CEL-1, 001)` MUST fail
closed. It MUST NOT:

- substitute another semantic version;
- fall back to a current VE-CEL document or implementation default;
- choose a nearest, compatible, or latest version;
- partially apply the closure; or
- silently reinterpret the Rule.

For evaluation under this profile, an unavailable, mismatched, or unsupported
authority anchor is an unsupported/inapplicable profile condition and yields
`EVALUATION_ERROR` before Rule evaluation. It never yields an authorization.

## 10. Rule representation and identity remain separate

This allocation makes the abstract semantic selector independently meaningful.
It does not define the canonical Rule object encoding. In particular, it does
not choose:

- CBOR map keys or field labels;
- text versus bytes representation;
- a Rule digest frame;
- a Rule digest suite/profile;
- Rule occurrence identity; or
- Rule legitimacy or verification.

Execution Right remains exactly `(action_id, action_digest)`. Rule identity,
Rule source, semantic-profile selection, Evaluate result, and policy provenance
are not added to Execution Right.

## 11. RS-CEL-001 semantic replay

RS-CEL-001 is non-normative validation evidence and is not part of the closure.
The exact replay artifact used was:

| Historical path | Git blob SHA | File SHA-256 | Bytes |
|---|---|---|---:|
| `reference-scenarios/RS-CEL-001-DETERMINISTIC-RULE-EVALUATION.md` | `4945037bf5cefcb18f10c1e59e742baafcf86cb7` | `865a4080bc34e75ae82d0b34d5728861a6cfbeee51ac42fcd9ee1c63109e56c7` | 23963 |

Using only the frozen closure plus the scenario's explicit governed domain
inputs and verification/selection facts reproduced:

```text
positive input                 -> SATISFIED
policy-negative input          -> NOT_SATISFIED
verification-failed Claim      -> excluded before Evaluate; NOT_SATISFIED
different-Predicate operation  -> EVALUATION_ERROR
unguarded Predicate value read -> EVALUATION_ERROR
```

All six host-order permutations produced `[L-B, L-A, C1]`; the duplicate
extension produced `[L-B, L-A, L-A, C1]`. The replay confirms that the frozen
closure is sufficient without importing the scenario as authority.

## 12. Independent reconstruction requirements

Two independent readers of this specification MUST agree on:

- `language = VE-CEL-1`;
- `semantics_version = 001`;
- the authority-root commit;
- all 17 repository paths, blobs, SHA-256 values, and byte lengths;
- the CEL commit and language-document hash;
- Unicode 15.0.0, UAX #15 revision 53, all four UCD file hashes and lengths,
  and the assigned-character rejection boundary;
- the Action and Claim projection authorities;
- the Claim ordering algorithm;
- all ten structural limits;
- missing/unknown/error mapping; and
- Boolean Evaluate outcome mapping.

Independent Python and Node readers verified every manifest entry directly
against the recorded historical commit and produced identical inventories.
Representative execution with CEL-C++ through `cel-expr-python 0.1.3` and the
independent `cel-python 0.5.0` produced the RS-CEL-001 positive `true` and
policy-negative `false` results. Engine packages remain evidence only; the
exact CEL source pin in Section 5 is authority.

Independent data-driven Python and Node readers also used the frozen Unicode
files directly rather than either host's Unicode tables. They reproduced the
Unicode 15.0.0 assigned set, passed all 19,074 records in the frozen
`NormalizationTest.txt`, and ran these focused probes:

| Probe | Input and frozen-profile result |
|---|---|
| U1 — assigned NFC | U+00E9 (`LATIN SMALL LETTER E WITH ACUTE`) is assigned in Unicode 15.0.0 and already NFC: accepted. |
| U2 — assigned non-NFC | U+0065 U+0301 is assigned but NFC is U+00E9: rejected without normalization. |
| U3 — later assignment | U+1CC00 is absent from Unicode 15.0.0 `DerivedAge.txt` but assigned by a later host Unicode release: rejected by both frozen-data readers. |
| U4 — official composite edge | Unicode 15.0.0 `NormalizationTest.txt` source U+1E0A U+0323 has NFC U+1E0C U+0307; the NFC result is accepted and the non-NFC source is rejected. |
| U5 — later-runtime stability | A Unicode 17.0 host produced the same U4 NFC result for the admitted Unicode 15.0.0 characters while the profile reader continued to reject U+1CC00. |

All ASCII Action, Claim, Predicate, Rule, issuer, and reference fixtures used
by this profile remain assigned and NFC. Host Unicode versions are diagnostic
only and do not determine any profile decision.

## 13. Mutation and new-version classification

The following table validates ADR-013's allocation rule. It does not add a new
architecture or compatibility category.

| Hypothetical future change | New `semantics_version` required? | Reason |
|---|---|---|
| Different CEL release or commit | YES | Parsing or standard CEL behavior may change. |
| Different eligible-Claim ordering or collision tie-break | YES | The projected environment may change. |
| Different Action projection | YES | Rule-visible input changes. |
| Different Claim or subject-reference projection | YES | Rule-visible input changes. |
| Different Integer mapping | YES | Runtime type or acceptance changes. |
| Different operator/function/macro allowlist or literal guard | YES | Rule validity or behavior changes. |
| Different structural/resource acceptance | YES | The admitted evaluation set changes. |
| Different missing/unknown/error mapping | YES | A final outcome may change. |
| Different Boolean/Evaluate outcome mapping | YES | A final outcome changes. |
| Different Unicode repertoire, UAX revision, or NFC data | YES | Rule or projected-text admission may change. |
| Typo, comment, formatting, or explanation change proven behavior-neutral | NO | Validity, environment, behavior, resource acceptance, and results are unchanged. |

## 14. SPEC-CEL-006 closure

This specification closes all requirements of SPEC-CEL-006, including the
Unicode condition needed to make the first requirement complete:

1. the exact VE-CEL semantic closure is frozen;
2. immutable `semantics_version = 001` is allocated under `VE-CEL-1`;
3. the pair is permanently bound to immutable normative authority; and
4. Unicode normalization and assigned-character semantics are frozen; and
5. exact historical resolution is guaranteed through the manifest and
   external anchors.

```text
SPEC-CEL-006 = CLOSED
RULE REPRESENTATION / CONTENT IDENTITY = UNBLOCKED
```

The task register is not modified by this construction artifact. Its eventual
mechanical completion update may accompany a later shipping change. Unblocked
does not mean performed: Rule representation and content identity remain
outside this task.

## 15. Governance and architectural regression

This specification performs delegated specification/profile allocation under
Accepted ADR-013. It does not revise an Approved specification or accepted
decision, introduce a primitive, or change architecture.

```text
RFC required = NO
ADR required = NO
new primitive = NO
new registry = NO
Rule representation = NOT DEFINED
Rule content identity = NOT DEFINED
Rule digest allocation = NO
Execution Right change = NO
```

| Architectural Decision Test | Result |
|---|---|
| Founding Principles consistency | **PASS.** Exact immutable authority replaces mutable interpretation. |
| Primitive burden | **PASS.** This is a profile allocation for existing Rule/Evaluate semantics, not a primitive. |
| Removability | **PASS.** Removing the allocation reopens historical Rule interpretation; excluded registries and wire machinery remain unnecessary. |
| Twenty-year durability | **PASS.** Commit, blob, byte digest, length, and external immutable-source anchors support durable reconstruction. |
| Independent implementability | **PASS.** The complete manifest, interpretation map, limits, failures, and vectors were reconstructed independently. |
| Reduced conceptual complexity | **PASS.** One static manifest replaces moving-document selection and runtime negotiation. |

**Result: 6/6 PASS.**

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-09-13 | Initial Approved immutable allocation of `(VE-CEL-1, 001)` to the exact historically resolvable VE-CEL evaluation closure, including Unicode 15.0.0 assigned-repertoire and NFC authority. |
