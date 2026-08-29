---
id: DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
title: DIGEST-001 Predicate Schema Content Identity
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Representation
author: Verified Execution Editorial Board
created: 2026-08-28
updated: 2026-08-29
depends_on:
  - ADR-ENC-001
  - PREDICATE-SCHEMA-CANONICAL-REPRESENTATION-PROFILE
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - CLAIM-PREDICATE-SCHEMA-REFERENCE-SEMANTICS
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

Remaining dependencies are cross-language PSCID-1 vectors, independent
cryptographic review, and normal Draft review before any approval or register
disposition. The single next artifact is a **PSCID-1 cross-language identity
test-vector package** containing canonical bytes, framed preimages, identities,
and required failure cases.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-29 | Bound representation-profile `h'01'` to the approved Predicate Schema Canonicalization v1.0 closure. |
| 0.1 | 2026-08-28 | Initial Draft defining the candidate PSCID-1 framed SHA-256 construction for Predicate Schema content identity. |
