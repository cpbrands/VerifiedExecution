---
id: DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
title: DIGEST-001 Predicate Schema Content Identity
version: "0.2"
status: Draft
document_type: Candidate Specification
category: Representation
author: Verified Execution Editorial Board
created: 2026-08-28
updated: 2026-08-30
depends_on:
  - ADR-ENC-001
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
  - RFC-008
  - ADR-008
related_documents:
  - OPEN-DECISIONS
  - RFC-005
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# DIGEST-001 — Predicate Schema Content Identity

## Status and authority boundary

This is a Draft candidate representation specification. It defines a
Predicate-Schema-specific candidate construction for deriving portable content
identity from canonical Predicate Schema bytes. It does not resolve
`DIGEST-001` in the Open Decision Register, amend an Approved specification,
or adopt Draft RFC-005.

The construction applies only after the Predicate Schema Canonical
Representation Profile has accepted a schema as profile-valid and produced its
deterministic VE-CBOR-1 canonical bytes. It does not reopen Predicate Schema
semantics, field grammar, canonical serialization, Claim semantics,
verification, Trust Context, Rule/Evaluate, Action, or Event semantics.

## 1. Objective and identity boundary

This Draft defines only this transformation:

~~~text
profile-valid Predicate Schema
        -> deterministic canonical bytes
        -> PSCID-1 framed digest input
        -> SHA-256 digest
        -> Predicate Schema content identity
~~~

It preserves PSCID-1 exactly and adds only a provisional vNext-candidate
suite/profile construction for the separately frozen external-subject v1.1
candidate closure. That candidate is evidence for a later governed approval;
it is not an Approved assignment, a portable-conformance target, or a change
to any existing PSCID-1 identity.

The identity is for immutable **Predicate Schema semantic content**. It is not
a document identity, publisher identity, alias, version label, retrieval URL,
schema occurrence identity, signature identity, signer identity, or authority
assertion.

Within the PSCID-1 suite and its bound representation profile:

~~~text
same canonical Predicate Schema bytes
        -> same Predicate Schema content identity
~~~

No equality is inferred between identities produced under different identity
suites or representation-profile bindings, even when their source schemas or
canonical bytes appear alike.

## 2. Architectural decision

### Verdict

**C. DIGEST-SUITE FRAMING REQUIRED.**

Raw `digest(canonical_bytes)` is insufficient because canonical bytes alone do
not state which Predicate Schema representation profile or digest construction
is being claimed. A raw textual prefix followed by variable-length fields would
add concatenation ambiguity. A small fixed, canonically encoded frame removes
both ambiguities without introducing a generic VE object hierarchy. `VEPSCID1`
is reserved exclusively for Predicate Schema content identity; a future VE
object class MUST use a distinct construction and domain token.

The minimum candidate is one Predicate-Schema-specific identity suite,
**PSCID-1**, whose suite byte selects the hash algorithm and the complete
framing construction. The identity carries that suite byte so that a verifier
does not need mutable external context to choose an algorithm or framing rule.

## 3. PSCID-1 suite definition

PSCID-1 is the one suite defined by this Draft:

| Element | Exact PSCID-1 value |
|---|---|
| Suite byte | `h'01'` |
| Digest algorithm | SHA-256 as specified by NIST FIPS 180-4 |
| Digest output | The algorithm's 32 output octets, in algorithm output order, treated as an opaque byte string |
| Frame encoding | One definite-length VE-CBOR-1 array with exactly four elements |
| Representation-profile code | CBOR byte string `h'01'`, denoting the immutable Predicate Schema Canonicalization v1.0 closure specified in Section 6 |

The suite byte is not a generic VE digest registry, a Claim field, a new VE
primitive, or a universal content-identity type. PSCID suite `h'01'` is
permanently assigned to the complete construction in this Draft: the
`VEPSCID1` magic, the four-element frame structure, exact CBOR element
types/order, representation-profile binding mechanism, SHA-256, identity
layout, and 32-octet digest output. An unknown suite byte is unsupported and
MUST fail closed; it MUST NOT be guessed, treated as PSCID-1, or selected by a
retrieval URL, repository version, or publisher.

Suite assignments are specification-local, immutable, append-only, and never
reassigned. They require no online registry, mutable lookup, or namespace
authority. A future construction that changes any identity-affecting part of
PSCID-1 MUST use a new suite byte.

SHA-256 is selected because it is a stable, fixed-length algorithm specified by
the Secure Hash Standard and is broadly available to independent
implementations. The normative dependency is the SHA-256 algorithm definition
in NIST FIPS 180-4, Section 6.2, DOI 10.6028/NIST.FIPS.180-4, not a mutable web
page. SHA-512/256, BLAKE2, BLAKE3, and a multihash-like carrying format are not
selected for PSCID-1. They may only be introduced by a future, separately
governed Predicate Schema identity suite.

## 4. Exact framed preimage

Let `C` be the exact VE-CBOR-1 canonical bytes emitted for one profile-valid
Predicate Schema by the bounded portable Predicate Schema Canonical
Representation Profile.

PSCID-1 defines exactly one frame, before VE-CBOR-1 encoding:

~~~text
PSCID1Frame := [
  h'5645505343494431',  // ASCII bytes "VEPSCID1"
  h'01',                // PSCID-1 suite byte
  h'01',                // bound representation-profile code
  C                     // canonical Predicate Schema bytes as CBOR bstr
]
~~~

The digest preimage is exactly:

~~~text
P = VE-CBOR-1-encode(PSCID1Frame)
~~~

The frame MUST be one definite-length four-element CBOR array. The magic,
suite, and representation-profile values are CBOR byte strings, and `C` is a
CBOR byte string containing the canonical Predicate Schema bytes unchanged.
VE-CBOR-1 ordering, shortest integer encoding, definite lengths,
duplicate-key rejection, and UTF-8/NFC rules apply where applicable.

This small wrapper is justified because several independently meaningful fields
must enter the preimage. It is not a second general canonicalization system:
it is a fixed array encoded using the already selected VE-CBOR-1 mechanism.
Raw variable-length concatenation, an implementation-defined prefix, a
human-readable label, or a map with optional fields is prohibited.

`VEPSCID1` itself supplies Predicate-Schema-specific domain separation; it is a
fixed domain token, not a separately mutable version field. The suite and
representation-profile codes are fixed binary tokens, not document titles, Git
hashes, repository URLs, aliases, or mutable version labels. There is no
separate frame-version or object-type code: both would be redundant with the
fixed PSCID construction and would not reduce ambiguity.

The in-frame suite byte cryptographically binds the digest to the interpretation
selected by the external suite byte. Carrying the suite outside the digest lets a
verifier select the construction before hashing; binding it inside the frame
prevents digest relabeling. Both uses are required.

## 5. Digest and identity bytes

PSCID-1 computes:

~~~text
D = SHA-256(P)

PredicateSchemaContentIdentity = h'01' || D
~~~

`D` is exactly the 32 output octets produced by SHA-256 as defined by NIST
FIPS 180-4, Section 6.2. No integer reinterpretation, endianness
transformation, hexadecimal decoding/re-encoding, truncation, or text form is
permitted.

The normative identity is exactly 33 octets:

~~~text
octet 0       = h'01' (PSCID-1 suite byte)
octets 1..32  = D (SHA-256 output bytes)
~~~

The identity is a byte string, not an integer and not a text value. There is no
byte-order conversion, truncation, rehashing, base encoding, or alternate
digest serialization. The suite byte is carried with the digest result and
selects the complete construction; digest bytes alone are not a PSCID-1
identity.

This Draft defines no normative base16, base32, base64, URI, or other
human-readable display form. A user-interface or transport display MAY render
the normative identity bytes, but such rendering is non-semantic and MUST NOT
create a second identity, a fallback parser, or an algorithm-selection rule.

For conceptual use by `Claim.body.predicate`, this Draft defines the 33-octet
content-identity value only. It does not alter the existing Claim body, add a
Claim field, or define the eventual Claim-body wire representation.

## 6. Immutable representation-profile binding, equality, and collision handling

`representation_profile = h'01'` denotes exactly one immutable
canonicalization definition: **Predicate Schema Canonicalization v1.0**. Its
complete machine-affecting closure is exactly:

- Predicate Schema Canonical Representation Profile v1.0;
- Predicate Schema Field-Semantic Representation Grammar v1.0;
- Predicate Schema Semantic Contract v1.0; and
- ADR-ENC-001 / VE-CBOR-1 v0.1.

It is not a selector for the latest revision of a Draft, a document title,
filename, Git revision, repository URL, publication timestamp, implementation
label, or mutable version string.

For PSCID-1, that v1.0 closure fixes the bounded portable Predicate Schema
canonicalization definition with all of these identity-affecting
characteristics:

- source field-specific references are resolved, exact canonical fragments are
  recursively expanded, and the result is normalized to fully inline semantic
  content before admission and encoding;
- admitted content uses the closed Predicate Schema top-level structure with
  required `issuer_domain` and `value_semantics`, and optional
  `subject_constraints`; absent optional content is omitted rather than encoded
  as a sentinel;
- field forms are limited to Boolean, Integer, Text, Bytes, Record, and
  Sequence, with the bounded closed constraints and finite acyclic nesting
  defined for the portable subset;
- unsupported issuer validation, normalization, equality, unit, time, or other
  interpretation-affecting semantics fail profile validation rather than being
  partially represented;
- the portable time state is absent `time_semantics`, meaning both Claim time
  fields are forbidden;
- closed maps, NFC UTF-8 text, duplicate-key rejection, no floating-point
  values, no unstandardized CBOR tags, and deterministic CBOR key/member
  ordering are applied through VE-CBOR-1; and
- every profile-valid normalized schema is represented as one VE-CBOR-1
  canonical map whose canonical bytes are `C`.

These frozen semantic characteristics, together with the four approved
documents named above, are the normative meaning of profile code `h'01'` in
PSCID-1. A future revision of any one of those documents MUST NOT alter `h'01'`
or any existing PSCID-1 identity. PSCID-1 therefore incorporates the approved
v1.0 closure above, rather than binding to an evolving Draft by name or by
"latest" interpretation.

Profile-code assignments are specification-local, immutable, append-only, and
never reused. Any interpretation-affecting change to admission, normalization,
grammar, ordering, canonical structure, or VE-CBOR-1 Predicate Schema
representation MUST use a new representation-profile code **and** a new PSCID
suite. It MUST NOT reinterpret `h'01'` or PSCID-1 identities.

The preimage cryptographically binds the fixed representation-profile code.
Thus, the same byte string under a future profile is not silently treated as
PSCID-1 content: a profile change requires a new suite construction and
therefore a different identity space.

Two PSCID-1 identities are equal if and only if their 33 identity octets are
identical. A verifier confirms an identity by recomputing the PSCID-1 frame and
digest from retained profile-valid canonical Predicate Schema material and
comparing all 33 octets. It MUST NOT infer logical, mathematical, or semantic
equivalence from distinct identities.

If two distinct canonical Predicate Schema byte strings are discovered to
produce the same PSCID-1 identity, that is a cryptographic collision. It MUST
NOT be treated as ordinary Predicate Schema equality, aliasing, or an allowed
substitution. Implementations MUST fail the affected identity verification and
surface the collision as an integrity/security failure. This Draft adds no
collision-recovery runtime object or procedure.

### 6.1 Provisional vNext candidate code audit

The two PSCID-local tables currently have one assigned entry each:

| Table | Assigned value | Immutable meaning |
|---|---|---|
| Representation profile | `h'01'` | Predicate Schema Canonicalization v1.0, as bound by PSCID-1 above. |
| PSCID suite | `h'01'` | PSCID-1, as defined in Sections 3–6. |

The next unused value in each table is `h'02'`. Repository code audit at the
time of this Draft found no assigned or competing merged meaning for either
local `h'02'` value and no repository reservation for it. Therefore this Draft
uses:

~~~text
NEW_PROFILE = h'02'  // provisional candidate value only
NEW_SUITE   = h'02'  // provisional candidate value only
~~~

These are not permanent allocations. They acquire permanent meaning only
through final governed approval and merge of the coordinated closure, suite
construction, code-assignment audit, and conformance evidence. Until then,
they MUST NOT be represented as assigned, Accepted, Approved, or portable
conformance codes. A later code conflict invalidates this candidate and
requires a new audit rather than reassignment or reuse of an assigned value.

### 6.2 Provisional vNext representation-profile binding

For this Draft candidate only, `NEW_PROFILE = h'02'` binds exactly this
candidate-frozen byte-producing closure:

- Predicate Schema Semantic Contract **v1.1 Draft**, candidate revision
  `459a7b5308b450e8a07ff88f2ec6d9a0e0e08f04`;
- Predicate Schema Canonical Representation Profile **v1.1 Draft**, candidate
  revision `4c8045be83bb33e60aa13bbeef56cd3fd70d3206`;
- Predicate Schema Field-Semantic Representation Grammar **v1.0 Approved**,
  revision `c58ef61373a304df228b42b8cc459a80e8d47716`; and
- ADR-ENC-001 / VE-CBOR-1 **v0.1 Accepted**, repository revision
  `00b002b27b50cf052beff00b1a9ad0b882bbf069`.

The closure consists solely of the machine-affecting rules that admit,
resolve, expand, normalize, validate, order, and encode the candidate
Predicate Schema bytes `C`. Any byte-affecting change to one of these
candidate revisions invalidates `NEW_PROFILE`, `NEW_SUITE`, and all candidate
anchors; it requires regeneration and independent re-audit.

The following are intentionally outside the byte-producing closure:

| Material | Classification |
|---|---|
| Claim Reference Semantics v0.2 | External semantic dependency: it defines the referenced subject-form meanings, not Predicate Schema bytes. |
| RFC-007 and ADR-007 | External architectural authority for external subject references. |
| RFC-008 and ADR-008 | Governance authority for this local immutable-suite candidate. |
| Conformance vectors and validators | Evidence of this candidate's implementation, not profile content. |

No excluded document becomes part of `C` merely because the candidate closure
uses its terminology or evidence.

### 6.3 Provisional vNext suite construction

The candidate retains the fixed PSCID family token `VEPSCID1` and SHA-256. Let
`C` be exact canonical Predicate Schema bytes produced under the
candidate-frozen `NEW_PROFILE = h'02'` closure in Section 6.2. Its construction
is exactly:

~~~ini
frame = VE-CBOR-1([
  bstr h'5645505343494431',
  bstr h'02',
  bstr h'02',
  bstr C
])

digest   = SHA-256(frame)
identity = h'02' || digest
~~~

The frame is one definite-length VE-CBOR-1 array with exactly four elements.
The magic, suite, profile, and unchanged `C` are CBOR byte strings in that
order. The digest is exactly 32 raw SHA-256 output octets and the candidate
identity is exactly 33 octets: external suite byte `h'02'` followed by that
digest. A parser MUST reject a non-33-octet identity, an unknown suite byte, a
non-four-element frame, a non-byte-string element, an altered magic, a suite
or profile mismatch, or trailing frame material.

The suite byte occurs both in the carried identity and in the hashed frame.
Thus a candidate digest cannot be relabeled as PSCID-1 without recomputation,
and a candidate identity whose canonical bytes happen to equal a v1.0 `C`
remains distinct from the PSCID-1 identity. Candidate equality is exact
33-octet equality within this construction only; no cross-suite semantic
equality, latest-profile interpretation, downgrade substitution, or migration
alias is introduced.

## 7. Offline operation, migration, and downgrade handling

An implementation can recompute and verify a PSCID-1 identity offline using
only:

- retained Predicate Schema source and required immutable semantic fragments;
- the complete approved Predicate Schema Canonicalization v1.0 closure bound
  to representation-profile `h'01'` in Section 6; and
- this PSCID-1 suite definition.

It requires no network, registry, publisher, DNS authority, resolver, Git
history, signature, or retrieval URL. Missing required material makes identity
verification unavailable; it does not permit fallback, alias resolution, or
guessing.

If SHA-256 or PSCID-1 is later deprecated, existing PSCID-1 identities remain
permanently interpretable under PSCID-1. A new immutable suite byte defines the
new algorithm and/or framing for new identities. No old identity is rewritten,
and no verifier may silently recompute an old identity under a new suite. The
same Predicate Schema semantic content MAY have different content identities
under different PSCID suites. Such identities are suite-specific and MUST NOT
be treated as byte-equal or semantically equal across suites solely because
their source content is the same.

The carried suite byte removes algorithm and profile-selection ambiguity. A
policy that accepts or rejects a suite is outside this Draft, but it MUST make
that decision explicitly. An unsupported, deprecated, or disallowed suite must
not be downgraded to PSCID-1 by context or fallback behavior.

## 8. Security and trust boundaries

PSCID-1 relies on the collision resistance, second-preimage resistance, and
preimage resistance expected of SHA-256. Its intended collision-security level
is approximately 128 bits; its intended preimage and second-preimage security
level is approximately 256 bits, subject to the algorithm's cryptanalytic
security. These are cryptographic integrity goals, not authorization claims.

Predicate Schema content identity establishes neither trust nor authority:

~~~text
content identity != trust
content identity != provenance
content identity != publisher authority
content identity != signature verification
content identity != authorization
~~~

Verification, Trust Context, signer/key binding, delegation, revocation, and
Rule/Evaluate remain outside this construction.

## 9. RFC-005 and VE-001 boundaries

The relationship to RFC-005 is **B. CONCEPTUAL ALIGNMENT ONLY**. RFC-005 is
Draft and remains non-normative here. PSCID-1 does not import RFC-005's
`DigestReference`, `ObjectReference`, profile registries, or signature framing.

This construction is Predicate-Schema-specific. It does not establish a
reusable VE digest-construction principle and does not modify VE-001
`schema_digest`, create `schema_reference`, or introduce a generic
`ContentIdentity`, `DigestRef`, `HashRef`, or `SemanticDigest` primitive. A
future VE-001 change requires its own normal governance after any applicable
RFC/ADR decision.

## 10. Test-vector requirements

### 10.1 Normative PSCID-1 anchor vector

This vector uses one profile-valid normalized Predicate Schema with a plain NFC
Text issuer identifier, canonical issuer equality, a Boolean value form, no
subject constraints, and absent time semantics. Its canonical structure is:

~~~text
{
  "issuer_domain": {
    "equality": "canonical",
    "identifier": { "form": "text" }
  },
  "value_semantics": {
    "value": { "form": "boolean" }
  }
}
~~~

The following hexadecimal strings are test-vector presentation only. The
normative canonical bytes and identity remain byte strings.

| Value | Exact hexadecimal bytes |
|---|---|
| Canonical Predicate Schema bytes `C` | `a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e` |
| Four-element framed preimage `P` | `8448564550534349443141014101585ea26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e` |
| `D = SHA-256(P)` | `634b3118ec88e36cf5eab44b86092e88f309fe918a99db460222fbd76946b80a` |
| `h'01' || D` | `01634b3118ec88e36cf5eab44b86092e88f309fe918a99db460222fbd76946b80a` |

The vector proves exactly:

~~~text
C
  -> VE-CBOR-1([bstr h'5645505343494431', bstr h'01', bstr h'01', bstr C])
  -> SHA-256(P)
  -> h'01' || D
~~~

An implementation MUST obtain the same 94-octet `C`, 110-octet `P`, 32-octet
digest, and 33-octet identity. Any mismatch is a failure of PSCID-1
implementation or of the profile-validity/canonicalization prerequisites.

### 10.2 Further cross-language vectors

Future cross-language PSCID-1 vectors MUST provide the exact canonical Predicate
Schema bytes, the exact four-element framed preimage bytes, and the resulting
33-octet identity for at least:

- a minimal supported Predicate Schema;
- nested Record and Sequence forms;
- inline/reference exact-normalization equivalence;
- `scale: 0` normalization to omission;
- unordered-sequence and multiset normalization;
- different canonical Schema bytes producing different PSCID-1 identities;
- identical canonical Schema bytes producing the same PSCID-1 identity;
- the same canonical Schema bytes under a future suite producing a different
  identity namespace;
- the same canonical Schema bytes under a future suite with a different
  representation-profile code producing a different digest, while that code
  under PSCID-1 fails as unsupported;
- relabeling a PSCID-1 digest as a future suite failing verification because the
  suite is included in the hashed frame;
- a semantic change to the representation profile failing if it attempts to
  reuse profile code `h'01'` or suite byte `h'01'`; and
- malformed, noncanonical, unsupported, unavailable, and cyclic source inputs
  failing before digest computation.

Vectors are also required before this Draft can be considered for approval.

### 10.3 Provisional vNext candidate identity anchors

The following anchors are Draft evidence for the Section 6.2 candidate only.
They use `NEW_SUITE = h'02'` and `NEW_PROFILE = h'02'`; neither byte is a
permanent assignment. Each `C` is independently produced by the Node.js and
Python candidate canonicalization paths before that path constructs the frame.

| Anchor | `C` octets | Frame octets | SHA-256 digest | 33-octet candidate identity |
|---|---:|---:|---|---|
| A (`V1.1-A`) | 151 | 167 | `038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f` | `02038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f` |
| C (`V1.1-C`) | 94 | 110 | `1f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d` | `021f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d` |
| D (`V1.1-D`) | 263 | 280 | `0d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc` | `020d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc` |

Anchor A exact values:

~~~text
C_A = a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
P_A = 84485645505343494431410241025897a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
D_A = 038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f
I_A = 02038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f
~~~

Anchor C is the explicit cross-suite regression. Its `C_C` is exactly the
Approved v1.0 V1-A canonical bytes and therefore exactly the PSCID-1 anchor's
`C`; its candidate frame, digest, and identity nevertheless differ because the
suite/profile bytes are `h'02'`:

~~~text
C_C = a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
P_C = 8448564550534349443141024102585ea26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e
D_C = 1f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d
I_C = 021f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d
~~~

~~~text
C_v1.0 == C_C
PSCID-1(C_v1.0) != I_C
~~~

Anchor D exercises the CBOR byte-string length transition above 255 octets:

~~~text
C_D = a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e7473846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365
P_D = 8448564550534349443141024102590107a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e7473846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365
D_D = 0d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc
I_D = 020d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc
~~~

Anchor D's frame begins its unchanged `C_D` byte string with `h'59 0107'`:
the definite-length 263-octet CBOR byte-string encoding. It proves that the
frame decoder and both implementations handle the required length transition
without treating it as a different frame shape.

The candidate validators also test these required confusion cases:

| Case | Candidate result |
|---|---|
| N1 — suite relabel | Relabeling a candidate identity as `h'01'` without recomputing its frame is invalid. |
| N2 — profile relabel | A candidate suite frame containing profile `h'01'` does not match the candidate identity. |
| N3 — downgrade reinterpretation | Candidate Anchor C is invalid when verified with the PSCID-1 closure despite equal `C`. |
| N4 — unknown suite | An unassigned carried suite code fails closed. |
| N5 — frame-field substitution | Altering a framed suite, profile, magic, or other frame element without recomputing the identity is invalid. |

## 11. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Identity follows immutable canonical semantic content without changing authority. |
| New primitive burden | Pass. PSCID-1 is a fixed Predicate-Schema representation construction, not a kernel primitive. |
| Removability | Raw hashing and a generic content-identity object are removable; fixed framing is not, because it prevents ambiguity. |
| Twenty-year durability | Pass. Immutable suite bytes preserve historical interpretation and permit governed migration. |
| Independent implementability | Pass. Algorithm, frame, codes, output bytes, and failure behavior are fixed. |
| Total conceptual complexity | Pass. One fixed suite is smaller than generic references, per-object ad hoc hashing, or premature agility. |

## 12. Governance and next action

| Governance question | Result |
|---|---|
| New primitive? | No. |
| New Claim field? | No. |
| New runtime abstraction? | No. |
| New generic normative abstraction? | No. This is a Predicate-Schema-specific Draft representation construction. |
| RFC required now? | No. This Draft does not revise an Approved specification or adopt RFC-005. |
| ADR required now? | No. ADR-ENC-001 remains the canonical-encoding authority. |
| Approved-specification revision required? | No. |
| Correct normative home | This standalone Draft Predicate Schema content-identity specification. |

PSCID-1 remains a Draft construction pending its own normal Draft review. The
Section 6 candidate adds vNext frame, digest, identity, and confusion evidence
without approving either candidate value. RFC-008 and ADR-008 now govern the
candidate-suite process; they do not turn this Draft or its `h'02'` values into
an assignment. Before any permanent allocation, the candidate requires the
independent review, exact code audit, and final coordinated governance decision
specified by those Accepted documents.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-08-30 | Added the provisional `h'02'` profile/suite candidate for the external-subject v1.1 closure and its non-authoritative identity anchors; PSCID-1 unchanged. |
| 0.1 | 2026-08-29 | Bound representation-profile `h'01'` to the approved Predicate Schema Canonicalization v1.0 closure. |
| 0.1 | 2026-08-28 | Initial Draft defining the candidate PSCID-1 framed SHA-256 construction for Predicate Schema content identity. |
