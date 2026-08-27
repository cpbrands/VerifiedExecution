---
id: VE-CBOR-1-CLAIM-BODY-SCHEMA
title: VE-CBOR-1 Claim Body Schema
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Representation
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-27
depends_on:
  - ADR-ENC-001
  - ADR-VERIFY-002
  - VE-001
  - VE-002
  - VE-CLAIM-REFERENCE-SEMANTICS
related_documents:
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - RFC-005
supersedes: null
superseded_by: null
---

# VE-CBOR-1 Claim Body Schema

## Status and authority boundary

This is a Draft candidate representation artifact. It distinguishes the
accepted deterministic mechanics of `VE-CBOR-1` from the unresolved Claim
semantic and profile choices that determine which concrete values are encoded.
It does not amend an Approved specification, accept a Draft RFC, or define a
new VE primitive.

This specification applies ADR-ENC-001's accepted canonical-encoding rules to
the candidate Claim-body semantics. It preserves the Claim envelope accepted
by ADR-VERIFY-002:

```text
Claim {
  body,
  verification {
    profile,
    artifact
  }
}
```

This document concerns `body` only. It does not define Claim verification,
trust, issuer resolution, Action or Event semantics, Rule/Evaluate behavior,
CEL binding, or a generic VE reference ontology.

VE-002 and Canonical Claim Reference Semantics are Draft. In particular,
`EventReference` conformance remains provisional until the relevant Event and
encoding work reaches its governed maturity. RFC-005 remains Draft and is not
a normative dependency of this document.

## 1. Purpose

This Draft records the local Claim-body field structure and the `VE-CBOR-1`
mechanics that a complete Claim-body profile will use. It does not yet define
enough portable semantic/profile forms to guarantee one byte sequence for
every semantic Claim body across independent implementations.

## 2. Terminology

**Claim body**

The semantic assertion portion of a Claim. It excludes the verification
envelope.

**Canonical bytes**

The exact output of the `VE-CBOR-1` encoder for a Claim body valid under a
complete applicable Claim-body profile.

**Subject reference**

The Claim-body value that identifies the Action content, Action occurrence, or
Event about which the Claim asserts something. Its semantic meaning is defined
by Draft Canonical Claim Reference Semantics.

**Value schema**

The domain/schema contract identified by a Claim predicate that defines the
meaning, allowed structure, units, and scale of `value`.

## 3. Conformance profile

A conforming implementation MUST apply the following `VE-CBOR-1` mechanics
when an applicable Claim-body profile resolves every semantic field to a
concrete representation.

In particular, a conforming encoding MUST use RFC 8949 Core Deterministic
Encoding, definite-length items, shortest valid integer and length encodings,
and map keys sorted by bytewise lexicographic order of their deterministic
CBOR encodings. All text strings MUST be valid UTF-8 and Unicode NFC. A
decoder MUST reject non-NFC text rather than normalize it, duplicate map keys,
indefinite-length items, floating-point values, and unstandardized CBOR
semantic tags.

These are deterministic encoding mechanics. They do not by themselves decide
what an issuer identifier, predicate identifier, timestamp, Action identifier,
Event identifier, or Claim value is.

## 4. Claim-body map schema

The current candidate Claim-body semantic model contains:

| Local field label | Presence | Representation status |
|---|---:|---|
| `subject_reference` | Required | Semantic union known; exact profile encoding unresolved. |
| `issuer_ref` | Required | Semantic content known; portable primitive representation unresolved. |
| `predicate` | Required | Semantic content known; portable identifier representation and namespace unresolved. |
| `value` | Required | Schema/predicate-defined semantic content; portable value representation unresolved. |
| `assertion_time` | Optional | Presence/absence known; value semantics and representation unresolved. |
| `observation_time` | Optional | Presence/absence known; value semantics and representation unresolved. |

The exact field labels above are this Draft's candidate labels. They are text
labels rather than integer labels because ADR-ENC-001 requires text map keys
and no accepted authority establishes a separate Claim field-label registry.
Their scope is only this Claim-body map.

The top-level schema is closed for a versioned Claim-body profile: an
implementation interpreting a particular profile version MUST reject unknown
top-level Claim-body fields for that version. Future evolution occurs through a
new or revised governed schema/profile version, not through extension maps.
This Draft does not yet define profile selection or version negotiation.

When the field representations are defined by an applicable Claim-body
profile, the body map MUST use the deterministic encoded-key order required by
ADR-ENC-001. Field source order, lexical label order, and implementation
iteration order are not permitted substitutes.

## 5. Subject-reference representation boundary

Draft Canonical Claim Reference Semantics defines the following legal semantic
members:

```text
ActionContentReference { action_digest }
ActionOccurrenceReference { action_id, action_digest }
EventReference { event_id }
```

Their semantic membership is known. Their exact profile-level CBOR encoding is
not yet established by current authority.

In particular:

- VE-001 defines `action_digest` semantic content identity, but does not
  establish a universal CBOR primitive representation for the digest;
- VE-001 explicitly leaves `action_id` generation format protocol/profile-
  defined; and
- Draft VE-002 defines immutable, globally unique Event identity but does not
  establish a universal Event-ID wire encoding.

This Draft therefore MUST NOT prescribe `action_digest = bstr`,
`action_id = tstr`, or `event_id = tstr`. It also MUST NOT introduce
`event_digest`, `ObjectReference`, `DigestReference`, a generic reference,
attempt reference, or a semantic `reference_kind`.

If a later representation profile needs a discriminator or structural form to
preserve these three semantic alternatives, that is representation machinery.
It must not broaden the legal semantic union or create a generic reference
ontology.

## 6. Issuer and predicate representation

`issuer_ref` is required semantic Claim-body content. ADR-VERIFY-002 requires
the applicable VerificationContext to establish the `issuer_ref`-to-
verifier/key binding. It does not define the portable primitive representation
of `issuer_ref`.

This Draft MUST NOT choose whether `issuer_ref` is a text identifier, bytes,
URI, DID, structured reference, or authority-specific identifier. It does not
create a VE identity system and does not reinterpret an issuer as a signer,
verification key, certificate subject, or VE-managed identity object.

Canonical encoding remains blocked until a Claim semantic/profile contract
constrains the representation of `issuer_ref`.

`predicate` is required semantic Claim-body content. No accepted authority
defines its portable identifier representation or namespace.

This Draft MUST NOT choose a text, integer, structured, or registry-based
predicate form. It does not create a global predicate registry, VE-owned
predicate semantics, integer predicate codes, or schema-independent meaning.
Canonical bytes for `predicate` remain profile-dependent until the applicable
Claim semantic/profile contract defines them.

## 7. Value representation

`value` is schema/predicate-defined semantic content. `VE-CBOR-1` constrains
only the deterministic encoding of the representation that the applicable
schema/profile authorizes. This Draft does not define a universal recursive
Claim value grammar, VE type system, or generic object container.

If an applicable schema/profile authorizes maps, their keys MUST be text
strings and they MUST use the accepted `VE-CBOR-1` ordering and duplicate-key
rules. That restriction follows ADR-ENC-001; it is not a CEL-specific or
independently invented rule.

This Draft does not determine whether arbitrary recursive maps or lists are
required by all Claim domains. Their structure and meaning remain
schema/predicate-specific.

### 7.1 Numeric values

Floating-point numbers MUST NOT appear. A decision-relevant fractional value
MUST be represented as an exact integer in `value`; the applicable
predicate/value schema MUST define the associated scale and unit. For example,
a schema may define `7300` as 0.7300 in a named unit.

This Draft does not add a universal decimal wrapper, scale field, or
numeric-tag convention. Portable equality requires the governing schema/predicate
contract to define one canonical scale and unit representation. Without that
contract, two implementations may encode the same intended decimal quantity
differently.

## 8. Optional timestamp representation

`assertion_time` and `observation_time` remain optional Claim-body fields:

```text
field absent  = corresponding time is not asserted
field present = a corresponding time value is asserted
```

An absent optional field and a field whose value is `null` are distinct
structural conditions. However, this Draft does not universally prohibit a
Claim value from representing null-like semantics. The legality and meaning of
`null` as an asserted `value` belong to the applicable Claim/value schema.

No epoch basis, precision, range, UTC-normalization rule, leap-second policy,
or timestamp primitive representation is established here. Timestamp value
semantics and representation remain unresolved.

## 9. Unknown fields and future compatibility

The Claim-body schema is closed for the particular governed profile version
that interprets it. Unknown top-level fields MUST be rejected rather than
preserved, ignored, or treated as extensions. Future body evolution requires a
new or revised governed schema/profile version.

This Draft does not define profile selection, version negotiation, extension
maps, or encoded subject-reference field handling. A future profile that
defines any of those mechanisms must define their namespace, compatibility,
canonical encoding, and semantic ownership before it is accepted.

For schema-defined structured values, permitted domain-specific members are
determined by the applicable predicate/value schema. This is not an open
extension mechanism for the top-level Claim body.

## 10. Canonical bytes and verification boundary

For a Claim body valid under a complete applicable Claim-body profile:

```text
claim_body_canonical_bytes = VE-CBOR-1 encode(profile-valid Claim.body)
```

This produces deterministic bytes once every semantic field has been resolved
to a concrete representation by that profile. This Draft does not yet define
enough representation semantics to guarantee one portable byte sequence for
every semantic Claim body.

These bytes are the detached payload required by the applicable optional COSE
profiles in ADR-VERIFY-002. This specification does not encode or interpret:

```text
Claim.verification
verification.profile
verification.artifact
```

It also does not define a semantic `claim_digest`, `claim_id`, or
`ClaimReference`. A future digest operation may operate over canonical bytes
where an applicable approved profile defines one; that is not Claim identity.

## 11. Ordering and duplicate consequence

Once complete canonical Claim-body bytes are defined, they provide a
mechanically available deterministic bytewise comparison. They may then serve
as material for a future governed collision tie-break rule.

This fact does not replace the accepted ADR-RULE-001/002 criterion of
content-digest ordering when Claims are represented as a list. Any replacement
of that criterion with canonical-byte ordering requires governance. Nor does
this specification establish a portable Claim content-digest construction.

Canonicalization does not collapse collection multiplicity. Once bytes are
defined, two identical Claim bodies produce identical bytes, but an input
collection containing:

```text
[X, X]
```

still contains two members at the Rule/Evaluate layer.

## 12. VE-CEL-1 dependency impact

This Draft establishes useful `VE-CBOR-1` mechanics and local Claim-body
structure, but it does not fully unblock portable CEL binding:

| VE-CEL-1 dependency | Effect of this Draft |
|---|---|
| Deterministic CBOR mechanics | Available through ADR-ENC-001. |
| Local Claim-body labels and field membership | Candidate only. |
| Portable Claim-body bytes | Blocked. |
| Claim collision tie-break material | Blocked on complete portable bytes. |
| Subject-reference encoded forms | Blocked on identifier/digest representations. |
| Optional-field value representation | Blocked on Claim/timestamp semantics. |
| CBOR-to-CEL value mapping | Blocked on schema/profile value forms. |
| CEL list ordering | Not changed. |
| Full `SPEC-CEL-003` resolution | Not resolved here. |

`SPEC-CEL-003` remains **PARTIALLY EXPLORED — NOT RESOLVED**. The remaining
work includes Claim semantic/profile representations, followed by the
engine-specific `VE-CEL-1` binding for CEL value types, range behavior,
map/list conversion, omitted-field presence testing, collection form, and any
governed ordering/collision rule.

## 13. Security considerations

Canonical encoding protects against ambiguous field order, duplicate keys,
silent Unicode normalization, float variation, and semantic-tag variation.
The closed top-level schema prevents an implementation from silently accepting
an unreviewed Claim-body extension under a given profile version.

Canonical bytes establish representation integrity, not Claim truth or issuer
acceptability. Verification and Trust Context remain responsible for their own
authority decisions. A conforming encoder or decoder MUST NOT use canonical
bytes as evidence that a Claim is verified, trusted, or applicable to a Rule.

## 14. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Exact bytes make assertions inspectable without altering their semantic authority. |
| New primitive burden | Pass. This is a representation profile for an existing Claim body, not a primitive or Claim identity. |
| Removability | The accepted encoding mechanics are necessary, but the proposed universal field representations are removable and therefore not adopted here. |
| Twenty-year durability | Conditional. Durable Claim bytes require semantic/profile choices to be explicit before encoding is fixed. |
| Independent implementability | Blocked. Issuer, predicate, value, timestamp, and identifier/digest representations are not fully specified. |
| Total conceptual complexity | Pass. The Draft avoids a premature identity system, predicate registry, time system, or value ontology. |

**Verdict: B. BLOCKED ON IDENTIFIER / ISSUER / PREDICATE REPRESENTATION.**

## 15. Governance and normative home

No RFC is required for this Draft correction. It does not revise an Approved
specification, Accepted ADR, Open Decision, or architectural primitive. A
future attempt to change Approved Action semantics, adopt a new global field
registry, replace accepted Rule ordering, or accept RFC-005 conclusions would
require normal governance.

A standalone Draft representation artifact remains an appropriate normative
home for the eventual byte-level profile. It cannot claim complete portable
Claim-body conformance until the semantic/profile field contract is defined.

## 16. Open dependencies and next artifact

The remaining dependencies are:

- portable `issuer_ref` representation without a VE identity system;
- portable `predicate` identifier/namespace representation without a global
  predicate registry;
- schema/profile-defined value and null conventions;
- timestamp semantic forms and representations;
- Action/Event identifier and digest representations used by subject
  references; and
- explicit Claim-body profile selection/version negotiation.

The next artifact is **Claim Body Semantic Field Contract**. It must determine
the minimum portable semantic/profile-bound forms of:

```text
issuer_ref
predicate
value
assertion_time
observation_time
Action/Event identifier representations used by subject_reference
```

It must resolve these semantics before a CBOR profile claims complete portable
Claim-body bytes. It must not create an identity system, predicate registry,
universal timestamp primitive, generic reference ontology, or new Claim
primitive.

## Revision history

| Date | Change |
|---|---|
| 2026-08-27 | Initial Draft candidate; corrected after independent audit to separate VE-CBOR mechanics from unresolved Claim semantic/profile representations. |
