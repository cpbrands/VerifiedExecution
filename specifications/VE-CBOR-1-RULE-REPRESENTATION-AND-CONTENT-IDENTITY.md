---
id: VE-CBOR-1-RULE-REPRESENTATION-AND-CONTENT-IDENTITY
title: VE-CBOR-1 Canonical Rule Representation and Content Identity
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Representation
author: Verified Execution Editorial Board
created: 2026-09-13
updated: 2026-09-13
depends_on:
  - ADR-013
  - ADR-RULE-001-002
  - ADR-ENC-001
  - VE-CEL-1-SEMANTIC-PROFILE-001
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
related_documents:
  - RFC-013
  - RS-CEL-001
  - GAP-ANALYSIS-RS-CEL-001-DETERMINISTIC-RULE-EVALUATION
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# VE-CBOR-1 Canonical Rule Representation and Content Identity

## 1. Status and authority boundary

This Draft v0.1 is the bounded representation and content-identity
specification for the existing Rule primitive. Its normative language applies
only to implementations claiming conformance with this Draft. It is not
Approved and does not claim stable compatibility.

Accepted ADR-013 owns the exact Rule semantic boundary:

~~~text
Rule {
  language,
  semantics_version,
  source
}
~~~

This specification supplies only the delegated portable mechanics: field
representations, canonical VE-CBOR-1 bytes, a Rule-specific digest frame,
SHA-256 content binding, and deterministic rejection behavior. It does not
change Rule semantics, VE-CEL evaluation, Claim ordering, Evaluate outcomes,
Rule legitimacy, policy applicability, authorization, or Execution Right.

The following are not Rule semantic fields and MUST NOT appear in the
canonical Rule map:

- `id`;
- `version`;
- `input_contract`;
- `output_contract`;
- author, issuer, approver, timestamp, or trust metadata; and
- Rule occurrence, policy-catalog, release, lifecycle, or deployment metadata.

`rule_digest` is a derived exact-artifact content identity. It is not a fourth
Rule field or a new `RuleIdentity`, `RuleReference`, `RuleReceipt`,
`RuleInstance`, `RuleOccurrence`, or `RuleVersion` primitive.

## 2. Governing closure and profile identity

The representation and content-identity byte-producing closure for this Draft
is exactly:

~~~text
Accepted ADR-013
Accepted ADR-RULE-001/002 as partially superseded by ADR-013
Accepted ADR-ENC-001 / VE-CBOR-1 v0.1
this Draft v0.1
SHA-256
~~~

Semantic-profile conformance and evaluation are later stages. For the current
`(VE-CEL-1, 001)` profile and the R1/R2 evaluation evidence, they additionally
use the Approved VE-CEL-1 Semantic Profile 001 and the VE-CEL-1 Rule/Evaluate
Input Contract Draft v0.2. Neither document supplies generic Rule
representation constraints.

The representation profile is named:

~~~text
VE-CBOR-1 Canonical Rule Representation Profile v0.1
~~~

The integer `1` in the digest frame below is the local frame version for this
profile. It is not a global representation-profile code or digest-suite code.
This Draft allocates no numeric codepoint, registry entry, or negotiation
mechanism. Governing context selects this exact profile and its fixed
SHA-256 construction, following the object-specific pattern already used for
Action content identity.

Repository-wide allocation and collision review found no existing use or
reservation of the fixed Rule-family domain label `VE-RULE-CONTENT`. Predicate
Schema domain tokens and PSCID suite/profile bytes remain Predicate-specific
and are not reused here.

## 3. Exact canonical Rule structure

The canonical Rule object is exactly one closed map:

~~~text
CanonicalRuleV01 := {
  "language": LanguageIdentifier,
  "semantics_version": SemanticsVersionIdentifier,
  "source": RuleSource
}
~~~

All three members are required, non-null CBOR text strings. No additional
member is permitted. The abstract Rule has no default values, and omission is
not represented by `null` or another sentinel.

Under VE-CBOR-1 encoded-key ordering, the members are emitted exactly as:

~~~text
"source"
"language"
"semantics_version"
~~~

The order follows bytewise lexicographic comparison of each key's
deterministic CBOR encoding. Source or application order does not participate.

The profile uses a map because the three accepted fields are independently
named Rule semantic distinctions. Arrays remain reserved here for the fixed
digest frame. A positional Rule array would save no semantic concept and
would make field evolution or diagnostics less explicit.

## 4. Field representations

### 4.1 `language`

`language` is one non-empty CBOR text string. Its decoded Unicode scalar
sequence is the exact abstract evaluation-profile-family identifier; case,
punctuation, and octets are significant. It MUST satisfy VE-CBOR-1 UTF-8 and
NFC requirements and MUST NOT be normalized on input.

For the current authoritative family the value is exactly:

~~~text
VE-CEL-1
~~~

and the canonical data item is:

~~~text
68 56452d43454c2d31
~~~

The value is not a numeric language code. This specification creates no
general language registry.

### 4.2 `semantics_version`

`semantics_version` is one non-empty CBOR text string. Its decoded Unicode
scalar sequence is the exact family-scoped immutable semantic-profile
identifier. Leading zeroes and every identifier character are significant.
It MUST NOT be parsed as an integer, document version, decimal quantity, or
mutable release label.

For the current authoritative profile the abstract identifier is exactly the
three ASCII characters:

~~~text
001
~~~

and the canonical data item is:

~~~text
63 303031
~~~

It is not integer `1` and not the VE-CEL-1 document version `0.2`. A decoder
that converts `001` to `1` changes the Rule and is nonconforming.

This Draft defines only the text representation of an already supplied
abstract identifier. It does not allocate `002` or establish a global syntax
or registry for future semantic profiles.

### 4.3 `source`

`source` is one CBOR text string containing the exact representation-valid
Rule source. Its UTF-8 payload octets are preserved byte-for-byte in canonical
Rule bytes. At the representation layer, the text MUST be valid UTF-8 and
already normalized to Unicode NFC under the generic VE-CBOR-1 requirements.
Non-NFC input MUST be rejected and MUST NOT be normalized on input.

These generic representation requirements do not select a semantic profile
and do not impose a language-specific repertoire, source-size limit, syntax,
or other source-admission rule. Those constraints are owned by the exact
`(language, semantics_version)` profile after that profile resolves.

For `(VE-CEL-1, 001)`, semantic-profile conformance additionally requires:

- scalar values assigned in the Unicode 15.0.0 repertoire frozen by the
  Approved semantic profile;
- no more than 16,384 UTF-8 octets; and
- all other VE-CEL-1 Semantic Profile 001 source constraints.

Whitespace, comments, parentheses, escapes, and line endings in a
representation-valid source remain exact artifact content. An implementation MUST NOT
trim, translate line endings, remove comments, parse and reserialize CEL,
pretty-print, produce an AST identity, or otherwise transform `source`.

VE-CBOR-1 encodes the decoded NFC text as its exact UTF-8 payload. Because
UTF-8 has one encoding for each scalar sequence, successful representation
validation and CBOR text encoding preserve those source octets exactly.

## 5. Canonical Rule bytes and rejection

Let `R` be the exact three-field Rule map after the generic representation
checks above. Define:

~~~text
canonical_rule_bytes = VE-CBOR-1-encode(R)
~~~

A **canonical Rule artifact** is the exact `canonical_rule_bytes` for a Rule
map that satisfies those generic representation requirements. Canonical Rule
artifact validity does not require the selected semantic profile to exist, be
known locally, or be supported. It does not establish semantic-profile
conformance, evaluability, legitimacy, applicability, or authorization.
Canonical artifact identity can therefore precede semantic interpretation.

The encoder and decoder MUST apply RFC 8949 Core Deterministic Encoding and
all stricter VE-CBOR-1 rules: definite lengths, shortest length encodings,
text-string map keys, encoded-key ordering, valid UTF-8/NFC text, duplicate
key rejection, no floating point, no semantic tags, and exactly one complete
data item.

A decoder of a claimed canonical Rule artifact MUST:

1. parse exactly one complete item while detecting duplicate keys;
2. require one map with exactly the three required keys and text values;
3. apply the representation-level UTF-8/NFC and non-empty identifier checks;
4. re-encode the decoded value under this profile; and
5. require byte-for-byte equality with the presented input.

It MUST reject noncanonical equivalent CBOR. It MUST NOT re-encode a
noncanonical input and then treat the original bytes as a canonical artifact.
Unknown fields, missing fields, duplicate fields, `null`, trailing bytes,
indefinite lengths, non-shortest lengths, invalid UTF-8, non-NFC text, tags,
floats, and non-text field values are rejected.

## 6. Representation, content identity, profile resolution, and evaluation

The following validation stages are distinct and occur in this order. They do
not introduce new kernel primitives.

1. **Representation validity** determines whether the three-field object is a
   canonical Rule artifact under this Draft. It applies only the generic Rule
   representation requirements and does not require the selected semantic
   profile to be known or supported.
2. **Content identity** computes `canonical_rule_bytes` and `rule_digest` for
   every representation-valid canonical Rule artifact. The digest identifies
   the exact artifact even when its semantic profile is unresolved or its
   source later fails profile conformance.
3. **Semantic-profile resolution** resolves the exact
   `(language, semantics_version)` pair to one immutable semantic profile when
   that profile is known. Unknown or unallocated pairs remain canonical Rule
   artifacts with valid content identity, but their semantics are unresolved.
4. **Semantic-profile conformance** applies the resolved profile's source
   rules. For `(VE-CEL-1, 001)`, these include the Unicode 15.0.0 assigned
   repertoire, the 16,384-octet source maximum, and the other source and syntax
   constraints frozen by VE-CEL-1 Semantic Profile 001.
5. **Evaluation** is permitted only after successful profile resolution and
   semantic-profile conformance. An unresolved profile, an unsupported
   profile, or a source that fails the resolved profile's requirements MUST
   fail closed under the existing Evaluate semantics with `EVALUATION_ERROR`.

An implementation MUST NOT select a latest, default, or nearby profile. A
profile-specific conformance failure does not retroactively erase the
canonical artifact or its content identity; the digest still identifies the
exact rejected artifact that was presented.

This representation remains usable without amendment for a future
`(VE-CEL-1, 002)` whose Unicode repertoire, source limit, syntax, or other
interpretation-affecting source rules differ. Those requirements belong to
profile `002`. Likewise, a future `VE-OTHER-1` family may define different
source-admission rules while using this same three-field representation.

The stage results are therefore:

| Input | Structurally encodable | Canonical Rule artifact | Rule digest | Profile resolved | Profile conformance | Evaluable |
|---|---|---|---|---|---|---|
| Representation-valid source with an unknown or unallocated pair | Yes | Yes | Yes | No | Not established | No; an attempt yields `EVALUATION_ERROR` |
| Representation-valid source with a resolved profile whose profile-specific rules it violates | Yes | Yes | Yes | Yes | No | No; an attempt yields `EVALUATION_ERROR` |
| Source that violates generic representation requirements | No canonical encoding | No | No | Not reached | Not reached | No |

## 7. Rule content identity

Let `C` be `canonical_rule_bytes`. The exact Rule content frame is:

~~~text
RuleContentFrameV1 = [
  "VE-RULE-CONTENT",
  1,
  C
]
~~~

The first element is the CBOR text string `VE-RULE-CONTENT`. The second is
the unsigned integer `1`. The third is one CBOR byte string containing `C`
unchanged. The frame is exactly one definite-length three-element array.

Let:

~~~text
F = VE-CBOR-1-encode(RuleContentFrameV1)
rule_digest = SHA-256(F)
~~~

SHA-256 is exactly the algorithm specified by NIST FIPS 180-4, Section 6.2.
`rule_digest` is exactly the 32 raw SHA-256 output octets, in algorithm output
order. Its canonical scalar representation, when one is needed under this
profile, is a CBOR `bstr(32)`. Hexadecimal in this document is diagnostic only.
No suite prefix, representation-profile prefix, CBOR tag, URI, base encoding,
or wrapper participates.

The fixed family domain, local frame version, embedded canonical Rule bytes,
and governing-profile selection fully determine this Draft construction.
There is no algorithm negotiation or fallback. A future change to the frame,
canonical Rule representation, hash algorithm, or digest layout MUST use a
new governed profile/frame version and MUST NOT reinterpret this construction.

Two `rule_digest` values under this exact profile compare equal only when all
32 payload octets are equal. If distinct canonical Rule byte strings are found
to produce the same digest, implementations MUST treat the condition as a
cryptographic collision and integrity failure, not as Rule equality, aliasing,
or legitimacy.

## 8. Identity invariants

Except for a cryptographic collision:

- the same exact `language`, `semantics_version`, and representation-valid
  `source` produce the same canonical bytes and `rule_digest`;
- a different `language` produces different canonical bytes and digest;
- a different `semantics_version` produces different canonical bytes and
  digest;
- different representation-valid source text produces different canonical
  bytes and digest; and
- logically or extensionally equivalent source text remains different Rule
  content when its representation-valid text differs.

Exact Rule identity is not CEL AST identity, behavioral equivalence, policy
equivalence, or release identity.

## 9. Content identity, legitimacy, and execution boundaries

`rule_digest` establishes only which exact representation-valid canonical Rule
artifact is named. In particular:

~~~text
Rule content identity != semantic validity
~~~

It does not establish:

- whether the selected semantic profile exists or is locally resolvable;
- whether `source` conforms to that profile;
- whether the Rule is evaluable;
- authorship or approval;
- present applicability or currentness;
- Root Authority recognition;
- trust or signature validity;
- proposition truth;
- authorization; or
- execution or outcome.

The preserved boundaries are:

~~~text
Rule identity != Rule legitimacy
Evaluate result != authorization decision != Execution Right issuance
~~~

Execution Right remains exactly:

~~~text
(action_id, action_digest)
~~~

`rule_digest`, Rule source, `semantics_version`, Evaluate result, and policy
metadata MUST NOT be added to Execution Right by this profile.

## 10. R1 canonical interoperability vector

R1 reuses the exact Rule source from authoritative RS-CEL-001. The source has
nine lines separated by eight LF octets and has no terminal LF.

### 10.1 Semantic object

~~~text
language = "VE-CEL-1"
semantics_version = "001"
source =
action.fields.amount_minor == 1000000 &&
action.action_id == b"\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x7b\x7c\x7d\x7e\x7f" &&
action.action_digest == b"\x5f\xa3\x77\x5f\x8a\x28\x8e\x97\x62\xe0\x21\xba\x8f\xb0\x83\x02\xfb\xb3\x54\x7b\xc1\x5d\x97\x69\xc9\x7b\xbc\xbb\xeb\x33\x0b\x0c" &&
claims.exists(c,
  c.predicate == b"\x03\x30\x8b\xb6\x70\xd8\x5b\x24\x31\xc9\x1c\xc0\xfe\x2f\x38\xe1\x06\x78\xe4\x8c\x6a\xe2\x3f\x9b\xe3\xdb\x21\xd5\xc4\x91\xce\x5f\x82" &&
  c.issuer_ref == "lynx-sending-participant-A" &&
  c.subject_reference.action_id == action.action_id &&
  c.subject_reference.action_digest == action.action_digest &&
  c.value == true)
~~~

The exact `source` UTF-8 payload is 714 octets:

~~~text
616374696f6e2e6669656c64732e616d6f756e745f6d696e6f72203d3d20313030303030302026260a616374696f6e2e
616374696f6e5f6964203d3d2062225c7836305c7836315c7836325c7836335c7836345c7836355c7836365c7836375c
7836385c7836395c7836615c7836625c7836635c7836645c7836655c7836665c7837305c7837315c7837325c7837335c
7837345c7837355c7837365c7837375c7837385c7837395c7837615c7837625c7837635c7837645c7837655c78376622
2026260a616374696f6e2e616374696f6e5f646967657374203d3d2062225c7835665c7861335c7837375c7835665c78
38615c7832385c7838655c7839375c7836325c7865305c7832315c7862615c7838665c7862305c7838335c7830325c78
66625c7862335c7835345c7837625c7863315c7835645c7839375c7836395c7863395c7837625c7862635c7862625c78
65625c7833335c7830625c783063222026260a636c61696d732e65786973747328632c0a2020632e7072656469636174
65203d3d2062225c7830335c7833305c7838625c7862365c7837305c7864385c7835625c7832345c7833315c7863395c
7831635c7863305c7866655c7832665c7833385c7865315c7830365c7837385c7865345c7838635c7836615c7865325c
7833665c7839625c7865335c7864625c7832315c7864355c7863345c7839315c7863655c7835665c783832222026260a
2020632e6973737565725f726566203d3d20226c796e782d73656e64696e672d7061727469636970616e742d41222026
260a2020632e7375626a6563745f7265666572656e63652e616374696f6e5f6964203d3d20616374696f6e2e61637469
6f6e5f69642026260a2020632e7375626a6563745f7265666572656e63652e616374696f6e5f646967657374203d3d20
616374696f6e2e616374696f6e5f6469676573742026260a2020632e76616c7565203d3d207472756529
~~~

### 10.2 Diagnostic notation and canonical bytes

~~~text
{
  "source": <the exact 714-octet text above>,
  "language": "VE-CEL-1",
  "semantics_version": "001"
}
~~~

The exact 765-octet canonical Rule CBOR is:

~~~text
a366736f757263657902ca616374696f6e2e6669656c64732e616d6f756e745f6d696e6f72203d3d2031303030303030
2026260a616374696f6e2e616374696f6e5f6964203d3d2062225c7836305c7836315c7836325c7836335c7836345c78
36355c7836365c7836375c7836385c7836395c7836615c7836625c7836635c7836645c7836655c7836665c7837305c78
37315c7837325c7837335c7837345c7837355c7837365c7837375c7837385c7837395c7837615c7837625c7837635c78
37645c7837655c783766222026260a616374696f6e2e616374696f6e5f646967657374203d3d2062225c7835665c7861
335c7837375c7835665c7838615c7832385c7838655c7839375c7836325c7865305c7832315c7862615c7838665c7862
305c7838335c7830325c7866625c7862335c7835345c7837625c7863315c7835645c7839375c7836395c7863395c7837
625c7862635c7862625c7865625c7833335c7830625c783063222026260a636c61696d732e65786973747328632c0a20
20632e707265646963617465203d3d2062225c7830335c7833305c7838625c7862365c7837305c7864385c7835625c78
32345c7833315c7863395c7831635c7863305c7866655c7832665c7833385c7865315c7830365c7837385c7865345c78
38635c7836615c7865325c7833665c7839625c7865335c7864625c7832315c7864355c7863345c7839315c7863655c78
35665c783832222026260a2020632e6973737565725f726566203d3d20226c796e782d73656e64696e672d7061727469
636970616e742d41222026260a2020632e7375626a6563745f7265666572656e63652e616374696f6e5f6964203d3d20
616374696f6e2e616374696f6e5f69642026260a2020632e7375626a6563745f7265666572656e63652e616374696f6e
5f646967657374203d3d20616374696f6e2e616374696f6e5f6469676573742026260a2020632e76616c7565203d3d20
7472756529686c616e67756167656856452d43454c2d317173656d616e746963735f76657273696f6e63303031
~~~

### 10.3 Digest input and result

The exact 786-octet RuleContentFrameV1 bytes `F` are:

~~~text
836f56452d52554c452d434f4e54454e54015902fda366736f757263657902ca616374696f6e2e6669656c64732e616d
6f756e745f6d696e6f72203d3d20313030303030302026260a616374696f6e2e616374696f6e5f6964203d3d2062225c
7836305c7836315c7836325c7836335c7836345c7836355c7836365c7836375c7836385c7836395c7836615c7836625c
7836635c7836645c7836655c7836665c7837305c7837315c7837325c7837335c7837345c7837355c7837365c7837375c
7837385c7837395c7837615c7837625c7837635c7837645c7837655c783766222026260a616374696f6e2e616374696f
6e5f646967657374203d3d2062225c7835665c7861335c7837375c7835665c7838615c7832385c7838655c7839375c78
36325c7865305c7832315c7862615c7838665c7862305c7838335c7830325c7866625c7862335c7835345c7837625c78
63315c7835645c7839375c7836395c7863395c7837625c7862635c7862625c7865625c7833335c7830625c7830632220
26260a636c61696d732e65786973747328632c0a2020632e707265646963617465203d3d2062225c7830335c7833305c
7838625c7862365c7837305c7864385c7835625c7832345c7833315c7863395c7831635c7863305c7866655c7832665c
7833385c7865315c7830365c7837385c7865345c7838635c7836615c7865325c7833665c7839625c7865335c7864625c
7832315c7864355c7863345c7839315c7863655c7835665c783832222026260a2020632e6973737565725f726566203d
3d20226c796e782d73656e64696e672d7061727469636970616e742d41222026260a2020632e7375626a6563745f7265
666572656e63652e616374696f6e5f6964203d3d20616374696f6e2e616374696f6e5f69642026260a2020632e737562
6a6563745f7265666572656e63652e616374696f6e5f646967657374203d3d20616374696f6e2e616374696f6e5f6469
676573742026260a2020632e76616c7565203d3d207472756529686c616e67756167656856452d43454c2d317173656d
616e746963735f76657273696f6e63303031
~~~

The exact R1 Rule digest is:

~~~text
86ec5cc99b17d49f00e0f3f05172164787e39ff28d59ee4575f661273120b247
~~~

## 11. Mutation vectors

| Vector | Mutation | Required result |
|---|---|---|
| R1 | Exact Section 10 Rule. | Canonical/profile-valid; digest `86ec5cc99b17d49f00e0f3f05172164787e39ff28d59ee4575f661273120b247`. |
| R2 | Add one ASCII space before the first `&&`, leaving CEL behavior unchanged. | Canonical/profile-valid different Rule; 766 canonical bytes; digest `c560c729aa75def9b982027ec96e156169e4e46bf2faea9c6dccd3772d0d9b25`. |
| R3 | Change only `semantics_version` from text `001` to text `002`. | Canonical representation and content identity are valid, with distinct digest `9ff8af18f0e64b3f47bb6e086cd8c0a6cc7e0eb5bdc985591319d752eff284e2`; `002` is not allocated here, so semantic-profile resolution fails, semantic conformance is not established, and attempted evaluation yields `EVALUATION_ERROR`. |
| R4 | Change only `language` from `VE-CEL-1` to `VE-CEL-X`. | Canonical representation and content identity are valid, with distinct digest `b0a8d8a7f4429d28398e3c63080148b836a064647b0fa1df65bedadd81aaeafa`; no profile is allocated here, so semantic-profile resolution fails, semantic conformance is not established, and attempted evaluation yields `EVALUATION_ERROR`. |
| R5 | Insert decomposed `e` plus U+0301 where NFC would use U+00E9. | Reject at generic representation validation; do not normalize. No canonical Rule artifact, canonical Rule bytes, or Rule digest exists for the rejected input. |
| R6 | Insert U+1CC00, which is absent from Unicode 15.0.0 `DerivedAge.txt`, under `(VE-CEL-1, 001)`. | The valid UTF-8/NFC text is structurally encodable and has a canonical artifact and digest. Profile `001` resolves, but semantic-profile conformance fails because the scalar was unassigned in its frozen repertoire; it is not evaluable, and an attempt yields `EVALUATION_ERROR`. A newer host assignment does not alter the result. |
| R7 | Present the otherwise equivalent three-member map with `language` before `source`, or use a non-shortest length. | Reject the presented bytes as noncanonical VE-CBOR-1; do not normalize and accept them as the canonical artifact. |
| R8 | Add `id` or any other fourth map member. | Reject as an unknown/additional Rule field. |
| R9 | Present two encoded `source` keys in one map. | Reject the duplicate before semantic interpretation; no first-value-wins or last-value-wins behavior. |
| R10 | Use 16,385 ASCII source octets under `(VE-CEL-1, 001)`. | The representation-valid source has a canonical artifact and digest. Profile `001` resolves, but semantic-profile conformance fails its 16,384-octet limit; it is not evaluable, and an attempt yields `EVALUATION_ERROR`. |

R2 proves that semantic equivalence does not define identity. R3 and R4 prove
that representation and content binding do not depend on local profile
support. R5 proves that generic representation invalidity prevents artifact
identity. R6 and R10 prove that later profile-specific invalidity does not
erase the identity of a representation-valid artifact. R7 through R9 prove
that noncanonical CBOR, extension fields, and duplicate keys cannot silently
produce an accepted canonical Rule artifact.

## 12. Independent implementability requirements

A conforming implementation MUST independently reproduce:

- the exact R1 source octets;
- the exact three-field map and encoded-key order;
- the 765-octet canonical Rule bytes;
- the 786-octet RuleContentFrameV1 bytes;
- the R1 digest;
- the distinct R2, R3, and R4 digests; and
- the R5 through R10 stage-specific rejection outcomes.

Conformance evidence MUST include at least two independently implemented
encoders/validators. One implementation's emitted bytes MUST NOT be used as
the other implementation's expected value.

## 13. Security considerations

The fixed domain and frame prevent raw-hash ambiguity with other VE object
classes. Binding all three fields prevents substitution of source or semantic
profile without a digest change, except by cryptographic collision.

Unknown-profile fail-closed behavior prevents version fallback or mutable
"latest" interpretation. Exact source binding prevents comment, whitespace,
line-ending, and normalization changes from passing as the same Rule.
Closed-map and duplicate-key rejection prevent metadata smuggling and parser
disagreement.

SHA-256 supplies approximately 128-bit collision security and 256-bit
preimage/second-preimage security subject to the algorithm's actual security.
Content identity does not supply authenticity, trust, authorization, or policy
legitimacy.

## 14. Governance and architectural regression

This Draft performs delegated representation work under Accepted ADR-013,
Accepted ADR-ENC-001, and the authoritative immutable semantic profile. It
does not revise an Approved specification, change an Accepted decision,
introduce a primitive, or change architecture.

~~~text
RFC required = NO
ADR required = NO
new primitive = NO
new registry = NO
representation-profile code allocation = NO
digest-suite code allocation = NO
Execution Right change = NO
~~~

| Architectural Decision Test | Result |
|---|---|
| Founding Principles consistency | **PASS.** Exact portable bytes and content identity preserve deterministic semantics and authority separation. |
| Primitive burden | **PASS.** Rule remains the primitive; the digest is derived. |
| Removability | **PASS.** Removing this profile reopens only the delegated Rule representation gap; no unrelated architecture depends on a new abstraction. |
| Twenty-year durability | **PASS.** Fixed VE-CBOR-1 rules, an immutable semantic-profile token, object-specific framing, and SHA-256 are historically reconstructable. |
| Independent implementability | **PASS.** Exact types, ordering, frame, vectors, and failures are defined without mutable state. |
| Reduced conceptual complexity | **PASS.** One coupled representation/digest profile closes the gap without IDs, registries, references, occurrences, or negotiation. |

**Result: 6/6 PASS.**

## 15. Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-13 | Initial Draft defining the generic three-field VE-CBOR-1 Rule representation and object-specific SHA-256 exact-artifact content identity, with `(VE-CEL-1, 001)` as the current resolved-profile interoperability vector and no semantic or architectural change. |
