---
id: GAP-ANALYSIS-PREDICATE-INTEGER-CANONICAL-KEY-CONFLICT
title: Predicate Integer Canonical-Key Conflict Analysis
version: "0.1"
status: Draft
document_type: Gap Analysis
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-10
updated: 2026-09-10
depends_on: []
related_documents: []
supersedes: null
superseded_by: null
---

# Predicate Integer Canonical-Key Conflict Analysis

## 1. Authority and result

This is **non-normative conflict analysis**, not a specification, erratum or
normative resolution. Recommendations require separate governed approval.
Neither this document nor implementation tests changes an Approved rule.

Main and branch parent: `9230e9ba714940f7f9b908e23156c618fbf23794`.

Branch: `reconcile/predicate-integer-key-conflict-analysis-2026-09-10`.

**Finding A: minimum / maximum are authoritative canonical member names;
the conflicting DIGEST-001 anchors, v1.2 vectors and validator serialization
are wrong.** Both sides contain Approved normative requirements. Existing
ownership identifies the canonical representation, but the conflicting
Approved conformance constraints remain unresolved on main pending correction.

The supplied byte lengths were reversed:

| Path | C bytes | Frame bytes | PSCID |
|---|---:|---:|---|
| Anchor/validator: lower_bound / upper_bound | 358 | 375 | `032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010` |
| Canonical profile §5.2: minimum / maximum | 350 | 367 | `039a4774bb744ee566229aac22caa89af19b2b72d0f72df7d9cf62bc5281f96603` |

The same conceptual Predicate Schema has different canonical bytes and PSCIDs.
This is not a hash collision or merely editorial spelling.

**VE-CBOR-1 Claim Body Schema v0.2 remains blocked** until the Predicate
canonical representation / PSCID inconsistency is resolved and merged to
authoritative main. The existing Claim Draft is untouched.

## 2. Governing sources and ownership

| Exact source / title | Version and status | Normative scope and relevant sections |
|---|---|---|
| [Predicate Schema Semantic Contract](../specifications/PREDICATE-SCHEMA-SEMANTIC-CONTRACT.md) | 1.2 Approved | §§3–5 own Predicate meaning, field semantics and equality; explicitly a semantic model, not a serialized record shape. Neither literal bound-key vocabulary is selected here. |
| [Predicate Schema Field-Semantic Representation Grammar](../specifications/PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR.md) | 1.0 Approved | §7 describes IntegerForm lower_bound / upper_bound and mathematical bound validity. These are grammar descriptors, not the canonical node-map definition. |
| [Predicate Schema Canonical Representation Profile](../specifications/PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE.md) | 1.2 Approved | §§2–5 own normalized structures, exact closed maps and VE-CBOR-1 bytes; §5.2 defines minimum / maximum as the “exact shape.” The opening freeze says normative vectors do not alter its rules. |
| [DIGEST-001 Predicate Schema Content Identity](../specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md) | 0.3 Approved | §§4,6.5–6.6 consume C and define framing/PSCID. §10.4 anchors A/D are Approved conformance constraints, not informative examples. |
| [Predicate canonicalization v1 vectors](../test-vectors/PREDICATE-SCHEMA-CANONICALIZATION-V1.md) | 1.0 Approved | Normative V1-B/V1-F use minimum / maximum, with normalized structures and exact bytes. |
| [Predicate canonicalization v1.1 vectors](../test-vectors/PREDICATE-SCHEMA-CANONICALIZATION-V1.1.md) | 1.1 Approved | Normative external-subject preservation evidence; exercised Boolean/Text cases do not select bounded-Integer keys. |
| [Predicate canonicalization v1.2 vectors](../test-vectors/PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE.md) | 1.2 Approved despite filename | Normative comparison fixtures, diagnostics and suite03 anchors; bounded-Integer A2/A3 diagnostics and anchors A/D are affected. |

The semantic grammar and canonical profile describe different layers. The
grammar's RecordField uses name/presence/form; the canonical map instead uses
field names as keys and presence/grammar members. Sequence element_grammar
similarly becomes canonical element. A conceptual descriptor label is not
automatically a canonical tstr.

Both Integer descriptions preserve the same interval mathematics: lower and
upper limits, inclusive/exclusive endpoints, and non-empty domains. No
contradictory Predicate meaning or arithmetic was found.

The actual ownership chain is:

1. Semantic Contract: Predicate semantic model.
2. Field-Semantic Grammar: admissible forms and constraints.
3. Canonical Representation Profile using VE-CBOR-1: exact normalized maps,
   encoded keys, ordering and C.
4. DIGEST-001: framing and content identity of C.
5. Vectors/validators: conformance constraints/evidence, not an alternate recipe.

DIGEST-001 §6.5 explicitly excludes “DIGEST-001 itself, vectors, validators,
and the security review” from its byte-producing closure. Section6.6 begins:
“Let C be canonical bytes from the Section 6.5 closure.” Section4 likewise
imports C unchanged. Section6.5 says the v1.2 extension adds only optional
value_semantics.comparison. No override authorizes anchor A to rename Integer
members. The canonical profile references DIGEST for identity, not node maps.

This dependency direction determines ownership. It does not downgrade an
erroneous Approved numerical anchor into informative material.

## 3. Repository-wide vocabulary and identity search

Locations refer to the audited base. Searches covered all tracked files.
Ordinary prose uses of minimum/maximum were distinguished from field names.

| Exact path / base lines | Vocabulary | Classification |
|---|---|---|
| specifications/PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE.md:323–324 and §5.2 prose | minimum / maximum | Authoritative literal canonical keys and explanations. |
| specifications/PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR.md:324–325 | lower_bound / upper_bound | Authoritative conceptual IntegerForm descriptors. |
| test-vectors/PREDICATE-SCHEMA-CANONICALIZATION-V1.md:126–127 | minimum / maximum | Normative V1-B normalized shape, also represented in its hex bytes. |
| Same v1 file:192–193 | minimum | Normative V1-F absent/zero-scale equivalence, also in its bytes. |
| test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.py:75,82–88,229,296,298 | lower_bound / upper_bound | Accepted source, emitted normalized map, fixture factory, comparison helpers. minimum/maximum at87–88 are local arithmetic variables, not wire keys. |
| test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.mjs:66,72–76,201,254–255 | lower_bound / upper_bound | Corresponding source/serialization and comparison behavior. |
| specifications/LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA.md:375–376 | minimum / maximum | Unrelated Action-schema descriptor; not a Predicate Integer definition or correction target. |
| DIGEST-001 §10.4 and v1.2 anchor tables | Bounds not literally spelled in anchor A table | Wrong vocabulary is established by reconstruction, lengths/hash and implementation; not by pretending the table contains a full map. |

No other current authoritative Integer-node key definition was found. Generic
numeric prose, unrelated Action descriptors and local arithmetic variable names
are not competing assignments.

Before adding this analysis, the old anchor-A PSCID occurs in exactly four
tracked files: DIGEST-001, the v1.2 vector Markdown, and its Python/Node
validators. The §5.2-derived PSCID occurs in none. The old anchor-D identity
also occurs in those four files. No extra occurrence of either A identity was
found in Claim examples, Rule/Evaluate, scenarios or external-subject fixtures.

## 4. Independent reconstruction

The semantic fixture is v1.2 A2 / DIGEST anchor A: ordered Integer comparison,
scale2, inclusive bounds0 and100000000, canonical issuer-domain equality, and
structural comparison domain CAD / Canadian dollars. No subject/time fields.

The anchor table is not a self-contained serialized descriptor: it lists
coverage, lengths, digest and identity. Its referenced A2 supplies the semantic
fixture. The anchor-path map below reconstructs its identity; the table does
not itself literally instruct lower_bound/upper_bound serialization.

Two fresh in-memory encoders, Python and Node, independently constructed this
fixture and encoded definite shortest-width CBOR with encoded-key-byte sorting.
Both framed C as a byte string and used SHA-256. They ran before repository
validators. Neither imported validator code, serialized output or precomputed
digest. Node deliberately used different map insertion order.

Complete anchor-path normalized map:

~~~json
{
  "issuer_domain": {
    "equality": "canonical",
    "identifier": {
      "form": "text"
    }
  },
  "value_semantics": {
    "comparison": {
      "domain": {
        "fields": {
          "code": {
            "grammar": {
              "allowed_values": [
                "CAD"
              ],
              "form": "text"
            },
            "presence": "required"
          },
          "meaning": {
            "grammar": {
              "allowed_values": [
                "Canadian dollars"
              ],
              "form": "text"
            },
            "presence": "required"
          }
        },
        "form": "record"
      },
      "ordered": true
    },
    "value": {
      "form": "integer",
      "lower_bound": {
        "inclusive": true,
        "value": 0
      },
      "scale": 2,
      "upper_bound": {
        "inclusive": true,
        "value": 100000000
      }
    }
  }
}
~~~

The §5.2 map is exactly this structure with only the value-node member names
lower_bound → minimum and upper_bound → maximum. Values, scale, inclusion,
comparison semantics and issuer-domain material do not change.

| Key | Canonical tstr hex |
|---|---|
| minimum | 676d696e696d756d |
| maximum | 676d6178696d756d |
| lower_bound | 6b6c6f7765725f626f756e64 |
| upper_bound | 6b75707065725f626f756e64 |

Each longer spelling adds four octets. Canonical map order is also different:
maximum precedes minimum; lower_bound precedes upper_bound.

Existing DIGEST-001 §6.6 framing is used without modification:

~~~text
frame = VE-CBOR-1([bstr h'5645505343494431', bstr h'03', bstr h'03', bstr C])
identity = h'03' || SHA-256(frame)
~~~

| Independent implementation | Anchor path | §5.2 path |
|---|---|---|
| Python, fresh encoder + hashlib | C358; frame375; 032ff55e…df010 | C350; frame367; 039a4774…96603 |
| Node, fresh encoder + node:crypto | Exact C/frame/hash agreement | Exact C/frame/hash agreement |

Appendix A records full C, frame and PSCID, not just abbreviated hashes.
PSCID hashes the frame, distinct from vector diagnostics hashing C alone.
Changing the member name changes canonical Predicate Schema content and PSCID,
even though mathematical Predicate meaning is unchanged.

## 5. Validator behavior and escape mechanism

The [Python v1.2 validator](../test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.py)
and [Node v1.2 validator](../test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.mjs)
both accept and emit lower_bound/upper_bound, then compare against anchors
derived from that serialization.

After independent reconstruction, direct probes against both gave:

| Test | Python | Node |
|---|---|---|
| Existing suite | Pass | Pass |
| A2 with lower_bound / upper_bound | Accept; C358; published anchor PSCID | Same |
| Same fixture using minimum / maximum | Reject: unknown-field | Same |

Accepting conceptual lower/upper source labels is not necessarily wrong.
Emitting them as canonical map keys, instead of §5.2 keys, is the defect.
A source adapter and a canonical serializer have different responsibilities.

The v1.1 Python/Node validators exercise Boolean values and plain Text subject
domains; their restricted normalizer does not implement bounded Integer
canonicalization. They endorse neither spelling. No standalone v1.0 validator
exists in the repository. The v1.2 preservation checks cover Boolean and
external-subject cases, not normative V1-B/V1-F bounded-Integer fixtures.
This missing coverage allows self-consistent validators to pass.

The serializer predates the anchor, so evidence does not establish that the
validator was written from that later anchor. Source-grammar labels leaking
into wire output is the supported implementation-path explanation, not a
claim about an author's intent.

## 6. Historical reconstruction and other governing records

| Commit | Observed evidence |
|---|---|
| bdee799 | Initial grammar Draft describes lower_bound/upper_bound. |
| 6b32941 | Completed canonical Draft defines minimum/maximum. |
| c58ef61373a304df228b42b8cc459a80e8d47716 | v1.0 freeze approves grammar/profile and adds min/max normative vectors. Earliest authoritative bound-to-wire evidence. |
| 27e909e | v1.1 approval retains canonical keys; external-subject extension is not a rename. |
| 06ecffcca4a5f1c83503ee2ede10456706955ae2 | Comparison Draft1.2 introduces lower/upper validators and A2/A3 diagnostics. Canonical §5.2 is unchanged. |
| 682fb436d73c18a8cd86acf45eeacbfd6f9d636e | A–D PSCID anchors added after that serializer. |
| 801a06bd6e44c501975b6554134dfed5f0107c1f | Coordinated v1.2 / DIGEST0.3 approval promotes conflicting conformance evidence, with no recorded bound-key rename. |

[CHANGELOG](../CHANGELOG.md) records v1.0 freeze, v1.1 external-subject work and
v1.2 comparison work. The profile's no-op preservation promises contradict an
implicit rename of existing Integer keys. Chronology corroborates ownership;
chronology alone is not authority.

[Accepted RFC-007](../rfcs/RFC-007-external-subject-reference-semantics.md) and
[ADR-007](../adrs/ADR-007-external-subject-reference-semantics.md) govern external
subject references, not Integer-key assignment.
[Accepted RFC-008](../rfcs/RFC-008-predicate-schema-content-identity-suite-governance.md)
and [ADR-008](../adrs/ADR-008-predicate-schema-content-identity-suite-governance.md)
govern immutable local append-only suites.
[Accepted RFC-010](../rfcs/RFC-010-cross-predicate-value-comparison-semantics.md)
and [ADR-010](../adrs/ADR-010-cross-predicate-value-comparison-semantics.md)
govern comparison; ADR-010 §14 does not decide exact field names or encoding.

[OPEN_DECISIONS](../OPEN_DECISIONS.md), [ARCHITECTURE_INDEX](../ARCHITECTURE_INDEX.md),
[KERNEL_VALIDATION](../KERNEL_VALIDATION.md) and
[SPECIFICATION_TASKS](../SPECIFICATION_TASKS.md) establish status, allocation,
validation and workstream context. None overrides the canonical profile.
PSCID-001 marked resolved does not prove its numerical anchors are correct.

## 7. Alternatives and compatibility

### Option A: retain minimum / maximum — recommended

Preserve Semantic Contract, Grammar and canonical profile. Correct conflicting
Approved conformance evidence and derived implementation behavior. Mathematical
meaning, inclusion, scale and comparison semantics remain unchanged.

Affected material includes v1.2 A2/A3 canonical diagnostics, anchors A/D and
other bounded-Integer fixtures. Anchor D currently has PSCID
`03aa9513dc1e22b93ba4166cd8846e7fc687afd3a81474ae8201395500c541ba17`;
its nested bounded Integer also needs independent regeneration. Unbounded
Integer, Text/Boolean anchors B/C and external-subject cases do not change
merely because this serializer is corrected. V1-B/F already contain the right
wire vocabulary and need regression coverage, not historical rewriting.

No implementation can satisfy both conflicting Approved constraints for A.
The independent §5.2 implementation and anchor-following implementation expose
a real interoperability defect, not two fully conforming interchangeable forms.

### Option B: adopt lower_bound / upper_bound as canonical keys

This changes the exact canonical profile and bounded-Integer bytes already
approved in v1.0 and preserved in v1.1. It needs a new canonical-profile version,
new representation-profile code and PSCID suite, coordinated DIGEST revision,
new anchors and conformance/validator updates. Historical v1 vectors and old
suite rules remain accessible, not silently rewritten.

The current03 anchor cannot be justified by retroactively changing its frozen
closure. A successor suite also changes PSCIDs for unchanged C, including
Boolean/Text, because the codes are bound into the digest. Semantic interval
meaning can stay identical while content identity changes. No evidence
supports the extra migration burden or an intended canonical rename.

### Option C: both Approved, no precedence

Both are Approved, but “no precedence” is disproved by their scopes:
canonical §5.2 produces C; DIGEST §6.5 excludes itself and vectors from that
recipe. An RFC/ADR remains necessary to correct Approved requirements, not
to invent missing representation ownership. No broader Predicate architecture
review is justified by this evidence.

### Downstream impact

Repository searches found no additional embedded consumers of these A
identities. They do not prove that external systems have stored none. An
implementation/deployment impact audit is needed before claiming zero migration.

A wrong-path stored PSCID is not silently aliased to the correct one. Correcting
canonical material changes its PSCID and can require ordinary reissuance or
reverification of signed Claims carrying it. No signed body is silently
rewritten. ADR-008/DIGEST exact-byte equality does not confer cross-identity
equivalence; no compatibility registry or resolver is proposed.

The [Rule/Evaluate input contract](../specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md)
does not own Predicate serialization. Schema lookup/recognition can diverge
when identities differ, while Rule semantics themselves remain unchanged.
The [Claim Body Schema Draft](../specifications/VE-CBOR-1-CLAIM-BODY-SCHEMA.md)
is downstream and cannot choose between these Approved constraints. No Claim
or Rule redesign, generic digest abstraction or equality alias follows.

## 8. Governance, versioning and exact future scope

[SPECIFICATION_GOVERNANCE](../SPECIFICATION_GOVERNANCE.md) §§2,9,12 require
RFC, ADR, version increment and CHANGELOG for Approved changes. Section9 even
requires these for Class A clarification. Changing conformance-critical hashes
is not demonstrated meaning-free editing. No Accepted ADR supplies a documented
erratum shortcut.

| Item | Recommended Option A |
|---|---|
| RFC | Required; one coherent conflict/correction proposal. |
| ADR | Required; one coordinated decision documenting ownership and correction. |
| Canonical profile1.2 | No revision/version increment if existing rules remain unchanged. |
| Semantic Contract1.2 / Grammar1.0 | No revision; semantic bounds remain unchanged. |
| DIGEST-0010.3 | Approved revision/version increment required for anchors and explanation. |
| Approved v1.2 conformance vectors | Revision/version increment required for affected diagnostics/anchors. |
| CHANGELOG | Required; document conformance and identity impact. |
| Top-level VE identifier | Not required. |
| New primitive / registry | Not required. |
| Claim Body Schema v0.2 | Blocked until governed correction lands on main. |

A document-version increment and an immutable suite-code change are different.
Option A restores the existing §6.5 recipe rather than changing it. Correcting
erroneous derived anchors alone therefore does not justify a new suite/profile
code. The RFC/ADR needs to demonstrate this explicitly and account for
incompatible implementation outputs; this is not permission to reinterpret03.
If a proposed fix changes frozen admission, normalization, grammar, ordering
or canonical structure, DIGEST §6 / ADR-008 require a new profile code and
suite. Option B necessarily crosses that boundary.

The conformance contradiction is not innocuous editorial cleanup. Review needs
migration/compatibility accounting even though the recommended recipe is
unchanged. Formal change classification and document version numbers belong
to that review and are not allocated here.

**Exact prospective Approved normative correction paths:**

- specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md
- test-vectors/PREDICATE-SCHEMA-CANONICALIZATION-V1.2-CANDIDATE.md

**Derived implementation/test paths:**

- test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.py
- test-vectors/validate-predicate-schema-canonicalization-v1.2-candidate.mjs

**Governance paths:**

- CHANGELOG.md
- One new RFC under rfcs/ and corresponding ADR under adrs/; identifiers and
  filenames are not assigned by this analysis.
- OPEN_DECISIONS.md: refresh its PSCID-001 current-version/status pointer when
  the corrected Approved DIGEST version lands; not a new architectural decision.

No canonical-profile, semantic-contract, grammar, historical v1.0/v1.1 vector,
Claim-body, Rule/Evaluate or architecture-index edit is needed for Option A.
Historical references accurately describing the unchanged0.3 construction do
not automatically require representation revisions.

Minimum next sequence: one RFC → one ADR → coordinated versioned conformance
correction, derived-validator fixes and CHANGELOG → independent Python/Node
portability replay including bounded-Integer regressions and audit → governed
merge → resume Claim-body v0.2. Independent evidence is needed, not a new
generic runtime object or redundant architectural RFCs.

## 9. Architectural Decision Test

| Test | Assessment of recommended path |
|---|---|
| Founding Principles | Pass: restores explicit ownership and deterministic interoperability. |
| Primitive burden | Pass: no new primitive, registry, alias or resolver. |
| Removability | Pass: no new fundamental object; an implementation adapter is removable, but one governed canonical spelling remains necessary. |
| Twenty-year durability | Pass: fixed existing encoding and preserved history do not depend on deployments or libraries. |
| Independent implementability | Pass for resolution: independent encoders converge. The current contradictory anchors do not pass this test. |
| Reduced conceptual complexity | Pass: one recipe instead of aliases or competing consumers. |

Within a fixed governed profile/suite: one semantic Predicate Schema → one
canonical representation → one PSCID. This does not claim cross-suite equality.

## 10. Validation and limits

Baseline: documentation 121 documents; repository tests 27/27. Independent Python
and Node reconstructions agree on both exact paths, before validator execution.
Current v1.2 validators pass internally while emitting the conflicting path.

Completed analysis validation: documentation, links and references passed for
122 documents; repository tests passed 27/27. Independent Python and Node
reconstruction matched both complete appendix C/frame/PSCID triples. The v1.1
and v1.2 Python/Node validator suites passed, with the v1.2 contradiction
separately demonstrated by the probes above. Vocabulary/PSCID searches,
UTF-8 decoding, LF-only text, single final newline, trailing-whitespace checks
and exact scope checks passed. git diff --check was clean; an additional
no-index whitespace check covered this untracked file (its difference exit
status is not a whitespace failure). Passing tests does not resolve the
normative defect.

Only this new uncommitted analysis file is in scope. No Approved specification,
validator, Claim Draft, RFC, ADR or changelog changes; no commit or PR.
The conflict remains unresolved normatively.

## Appendix A. Exact independent reconstruction bytes

### A1. Anchor/validator path

C — 358 bytes:

~~~text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a26576616c7565a464666f726d67696e7465676572657363616c65026b6c6f7765725f626f756e64a26576616c75650069696e636c7573697665f56b75707065725f626f756e64a26576616c75651a05f5e10069696e636c7573697665f56a636f6d70617269736f6ea266646f6d61696ea264666f726d667265636f7264666669656c6473a264636f6465a2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c75657381634341446870726573656e6365687265717569726564676d65616e696e67a2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c756573817043616e616469616e20646f6c6c6172736870726573656e6365687265717569726564676f726465726564f5
~~~

Frame — 375 bytes:

~~~text
8448564550534349443141034103590166a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a26576616c7565a464666f726d67696e7465676572657363616c65026b6c6f7765725f626f756e64a26576616c75650069696e636c7573697665f56b75707065725f626f756e64a26576616c75651a05f5e10069696e636c7573697665f56a636f6d70617269736f6ea266646f6d61696ea264666f726d667265636f7264666669656c6473a264636f6465a2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c75657381634341446870726573656e6365687265717569726564676d65616e696e67a2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c756573817043616e616469616e20646f6c6c6172736870726573656e6365687265717569726564676f726465726564f5
~~~

PSCID:

~~~text
032ff55e9de79fae803c62de0bfcd14632a19cc007039f7bd2c16fb01bd54df010
~~~

### A2. Canonical profile §5.2 path

C — 350 bytes:

~~~text
a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a26576616c7565a464666f726d67696e7465676572657363616c6502676d6178696d756da26576616c75651a05f5e10069696e636c7573697665f5676d696e696d756da26576616c75650069696e636c7573697665f56a636f6d70617269736f6ea266646f6d61696ea264666f726d667265636f7264666669656c6473a264636f6465a2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c75657381634341446870726573656e6365687265717569726564676d65616e696e67a2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c756573817043616e616469616e20646f6c6c6172736870726573656e6365687265717569726564676f726465726564f5
~~~

Frame — 367 bytes:

~~~text
844856455053434944314103410359015ea26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a26576616c7565a464666f726d67696e7465676572657363616c6502676d6178696d756da26576616c75651a05f5e10069696e636c7573697665f5676d696e696d756da26576616c75650069696e636c7573697665f56a636f6d70617269736f6ea266646f6d61696ea264666f726d667265636f7264666669656c6473a264636f6465a2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c75657381634341446870726573656e6365687265717569726564676d65616e696e67a2676772616d6d6172a264666f726d64746578746e616c6c6f7765645f76616c756573817043616e616469616e20646f6c6c6172736870726573656e6365687265717569726564676f726465726564f5
~~~

PSCID:

~~~text
039a4774bb744ee566229aac22caa89af19b2b72d0f72df7d9cf62bc5281f96603
~~~
