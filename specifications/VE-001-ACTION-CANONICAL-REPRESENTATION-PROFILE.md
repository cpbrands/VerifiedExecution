---
id: VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
title: VE-001 Action Canonical Representation and Content Identity Profile
version: "0.1"
status: Draft
document_type: Specification
category: Representation
author: Verified Execution Editorial Board
created: 2026-09-05
updated: 2026-09-05
depends_on:
  - VE-001
  - ADR-ENC-001
related_documents:
  - VE-014
  - RFC-004
  - ADR-004
  - RFC-011
  - ADR-011
  - GAP-ANALYSIS-RS-ER-003
supersedes: null
superseded_by: null
---

# VE-001 Action Canonical Representation and Content Identity Profile

## 1. Status and authority boundary

This is a subordinate normative **Draft** profile under VE-001. Its normative
language applies only to implementations claiming conformance with this Draft;
it is not Approved and does not yet establish stable compatibility.

VE-001 owns:

- the Action semantic model;
- `action_id` occurrence-identity meaning and semantic equality;
- `action_digest` formula and semantic-content meaning;
- the distinction between the Instance Envelope and Semantic Payload; and
- classification of content as semantic, occurrence-specific, transport, or
  local metadata.

This profile supplies only the concrete representation and content-identity
mechanics expressly delegated by VE-001: canonical bytes, framing, domain
separation, digest-suite selection, primitive encoding, and a profile-defined
`action_id` generation format. It does not change VE-001 semantics or define a
new Action field.

This document creates no `ActionProfile`, `ContentIdentity`, `DigestRef`,
`HashRef`, `SemanticDigest`, generic serialization profile, generic digest
profile, universal identifier wrapper, registry, resolver, or architectural
primitive. It does not adopt the shared `OccurrenceId` convention.

## 2. Profile identity and closure

The profile is named:

```text
VE-001 Action Canonical Representation Profile v0.1
```

Its byte-producing closure is exactly:

```text
VE-001 Action Specification v0.2
VE-001 Action Canonical Representation Profile v0.1
ADR-ENC-001 / VE-CBOR-1 v0.1
SHA-256
applicable governed Action schema
```

The integer `1` appearing in the frames below is the local frame version for
this profile. It is not a global representation-profile code or digest-suite
code. This Draft allocates no numeric codepoint. SHA-256 is fixed by this
profile, so no algorithm negotiation or suite discriminator is needed inside
its values.

An implementation MUST NOT interpret values under this profile unless the
applicable protocol or governing context selects this exact profile and
closure. Raw values from different profiles are not cross-profile equal merely
because their bytes happen to match.

## 3. Imported semantic structure

VE-001 defines the logical Action structure:

```text
Action
├── Instance Envelope
│   └── action_id
└── Semantic Payload
    ├── schema_digest
    └── schema-defined semantic fields
```

This profile represents the minimum portable subset of that structure. It does
not add optional occurrence metadata. A future profile may represent additional
VE-001-authorized Instance Envelope fields, but such a profile must preserve
their VE-001 classification and binding rules.

The applicable governed Action schema owns field names, field meanings,
admission, normalization, and the distinction between absent and present
semantic values. Before this profile is applied, the schema MUST produce:

1. one complete canonical schema descriptor as a VE-CBOR-1 data item; and
2. one normalized map containing exactly the schema-defined semantic fields.

The descriptor MUST commit to every schema rule capable of changing admitted
semantic content or its normalized representation. Human-readable schema names
or versions are not substitutes for `schema_digest`.

This profile does not define a universal schema language. A governed Action
schema defines its own descriptor and field grammar while using the profile's
fixed framing and digest mechanics.

## 4. Canonical schema identity

Let `S` be the exact canonical VE-CBOR-1 data item that is the governed
schema's complete canonical descriptor.

The schema frame is:

```text
SchemaIdentityFrame = [
  "VE-ACTION-SCHEMA",
  1,
  S
]
```

Let `SF` be the exact VE-CBOR-1 encoding of that frame. This profile defines:

```text
schema_digest = SHA-256(SF)
```

The canonical `schema_digest` value is a CBOR byte string containing exactly
the 32 raw SHA-256 output octets. No hexadecimal text, base encoding, tag, URI,
or wrapper is permitted.

This construction supplies the canonical representation and digest mechanics
for the VE-001 `schema_digest`; it does not change its meaning. A semantic
schema change requires a changed complete descriptor and therefore, except
with negligible SHA-256 collision probability, a changed `schema_digest`.

## 5. Canonical semantic payload

Let `F` be the normalized map containing exactly the schema-defined semantic
fields. `F` MUST satisfy VE-CBOR-1 and the applicable governed Action schema.

`F` MUST NOT contain:

- `schema_digest`, which is a separate frame member;
- `action_id` or other Instance Envelope data;
- execution-attempt or lifecycle state;
- transport or routing data;
- local annotations or implementation metadata; or
- any field the applicable schema and VE-001 do not classify as semantic.

The canonical semantic-payload bytes are exactly the VE-CBOR-1 encoding of
`F`. Implementations MUST reject a noncanonical input rather than normalize or
re-encode it and treat the original bytes as canonical.

## 6. Action content identity

The exact Action content frame is:

```text
ActionContentFrame = [
  "VE-ACTION-CONTENT",
  1,
  schema_digest,
  F
]
```

Let `AF` be the exact VE-CBOR-1 encoding of that frame. This profile supplies
the concrete realization of VE-001's existing formula:

```text
action_digest = SHA-256(AF)
```

The canonical `action_digest` value is a CBOR byte string containing exactly
the 32 raw SHA-256 output octets. No suite prefix, profile prefix, CBOR tag,
hexadecimal text, base encoding, URI, or additional wrapper is present.

The profile is selected by governing context, and its frame fixes version and
domain. Consequently, raw digest octets are sufficient within this profile.
They MUST NOT be interpreted, negotiated, or compared as a generic digest or
as an identity from another profile.

`action_digest` commits only to `schema_digest` and the normalized semantic
fields `F`. It does not commit to `action_id`, occurrence metadata,
execution-attempt metadata, transport metadata, local annotations, lifecycle
status, authorization, execution, or outcome.

## 7. Action occurrence identifier representation

Under this profile, `action_id` is exactly 32 opaque octets represented as one
CBOR byte string of length 32.

### 7.1 Authority and requirements

VE-001 owns the meaning and semantic equality of `action_id`. It requires each
authoritative Action to have one immutable identifier that is never reassigned
and is unique wherever authoritative Action histories may be compared. VE-001
delegates the concrete generation format and canonical representation to a
protocol or profile.

This profile supplies only that delegated format and representation. It does
not redefine occurrence identity, adopt `OccurrenceId`, establish cross-kind
identity, or make identical bytes in an Event, Receipt, Claim, or other object
semantically equal. It also does not give `action_id` content-derived meaning,
ordering, registry, resolver, namespace-authority, or human-readable semantics.
This profile independently selects a 32-octet opaque representation under
VE-001's delegated `action_id` format authority. This does not cause VE-001
Action identifiers to adopt the shared VE `OccurrenceId` convention or any
semantics owned by specifications that explicitly adopt that convention.
Event identity semantics and shared `OccurrenceId` ownership or generation
rules are not inherited. VE-001's own immutable, unique, and never-reassigned
requirements continue to apply independently.

The fixed-width byte string is a representation rule, not a generation
algorithm. Generators remain responsible for satisfying VE-001's uniqueness,
immutability, and non-reassignment requirements. This profile does not mandate
randomness, hashing, UUIDs, a registry, an authority, or any other generation
method.

### 7.2 Format alternatives and engineering evidence

The profile considered the following opaque representations:

| Alternative | Benefits | Costs and risks | Disposition |
| --- | --- | --- | --- |
| exactly 32 octets (`bstr(32)`) | Fixed-width validation and comparison; very large collision margin for generators that use uniform randomness; matches the width and simple opaque-byte handling already exercised by this profile's digests and by downstream VE-014 embedding | 16 bytes larger than `bstr(16)`; its byte shape coincides with `OccurrenceId` even though its semantics do not | Selected |
| exactly 16 octets (`bstr(16)`) | Smallest fixed-width candidate considered; adequate collision margin for realistic uniformly random generation volumes; simple validation and comparison | Lower long-horizon margin; introduces a second opaque identifier width into the immediate Action/Execution Right path | Not selected |
| bounded variable width | Allows generators to trade size for collision margin | Adds length-dependent validation and comparison cases without adding semantic capability; makes canonical implementations less uniform | Rejected |
| exactly 32 octets with the same wire shape as `OccurrenceId`, but without adopting it | Retains simple 32-octet handling while preserving VE-001 ownership | Requires an explicit warning against inferring cross-kind identity from equal bytes | This is the selected interpretation; it is not `OccurrenceId` adoption |

The last row is not a distinct wire-format alternative to `bstr(32)`; the
difference is the necessary authority and semantic-boundary documentation.

Qualitative scoring uses `high`, `medium`, and `low`, where `high` is favorable
except in the final `unnecessary flexibility` column, where `none` is best:

| Candidate | Implementation simplicity | Wire simplicity | Interoperability | Long-term durability | Collision safety | Conceptual independence | Consistency with current VE practice | Unnecessary flexibility |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `bstr(32)` | high | high | high | high | high | high with the explicit non-adoption rule | high | none |
| `bstr(16)` | high | high | high | medium | sufficient | high | medium | none |
| `bstr(16..32)` | low | medium | medium | medium | generation-dependent | high | low | high |

For scale only, the table below applies the birthday approximation
`p ≈ n(n-1) / 2^(b+1)` to an ideal generator choosing uniformly and
independently from a `b`-bit space. These figures are engineering evidence,
not a normative generation requirement:

| generated identifiers (`n`) | 128-bit space | 192-bit space | 256-bit space |
| ---: | ---: | ---: | ---: |
| `10^9` | `1.47 × 10^-21` | `7.97 × 10^-41` | `4.32 × 10^-60` |
| `10^12` | `1.47 × 10^-15` | `7.97 × 10^-35` | `4.32 × 10^-54` |
| `10^15` | `1.47 × 10^-9` | `7.97 × 10^-29` | `4.32 × 10^-48` |

The 128-bit option is sufficient for realistic uniformly random generation;
the extra collision margin of 256 bits is not, by itself, a semantic benefit.
The profile nevertheless selects `bstr(32)` because the additional 16 octets
buy a conservative long-horizon margin while avoiding another fixed opaque
width in the Action-to-VE-014 path. This choice adds no field, primitive,
registry, algorithm negotiation, or semantic rule, and fixed-width validation
remains one exact length check. A future profile may select another format only
under its own governed identity; it cannot change this profile's canonical
representation.

The selected result is **A. KEEP BSTR(32) — NOW JUSTIFIED**. Variable width
solves no demonstrated occurrence-identity or interoperability problem here;
its flexibility would only add canonical-length and implementation cases.

### 7.3 Architectural Decision Test for the selected format

1. **Founding Principles consistency — pass.** The representation preserves
   VE-001 occurrence identity without giving the identifier authority or
   content semantics.
2. **Primitive burden — pass.** It adds no primitive; it is one delegated scalar
   representation.
3. **Removability — pass.** Another governed profile can use another format
   without changing VE-001 semantics or this profile's encoded values.
4. **Twenty-year durability — pass.** A fixed 256-bit opaque space and exact
   byte equality do not depend on a particular generator or infrastructure.
5. **Independent implementability — pass.** Implementations need only enforce
   `bstr(32)`, exact byte comparison, and VE-001's existing lifecycle rules.
6. **Reduced conceptual complexity — pass.** One fixed opaque width is simpler
   than variable-width dispatch and does not import `OccurrenceId` semantics.

## 8. Canonical Action representation

The minimum canonical Action under this profile is exactly:

```text
CanonicalAction = {
  "action_digest": action_digest,
  "instance": {
    "action_id": action_id
  },
  "semantic": {
    "fields": F,
    "schema_digest": schema_digest
  }
}
```

It is encoded as exactly one canonical VE-CBOR-1 data item. No additional
top-level, `instance`, or `semantic` member is permitted in profile v0.1.

On decoding, an implementation MUST independently verify that:

1. the supplied schema descriptor produces the carried `schema_digest`;
2. `F` is valid and normalized under that schema;
3. the content frame produces the carried `action_digest`; and
4. `action_id` has the required representation.

Successful representation validation establishes neither authorization,
execution, outcome, trust, nor canonical external-state commitment.

## 9. Representation-level comparison

This section defines mechanics only. VE-001 retains semantic identity and
equality authority.

Within this exact profile and governing context:

- two canonical `action_id` values compare equal exactly when their 32 payload
  octets are equal in order; and
- two canonical `action_digest` values compare equal exactly when their 32
  SHA-256 output octets are equal in order.

Implementations MUST compare decoded payload octets, not source spelling,
diagnostic notation, object identity, locally re-encoded noncanonical input, or
values interpreted under another profile. Representation equality does not
broaden either value's VE-001 semantic meaning.

## 10. Rejection rules

An implementation claiming conformance with this profile MUST reject:

- input that is not one complete canonical VE-CBOR-1 data item;
- duplicate map keys, unknown fields, additional fields, or trailing bytes;
- indefinite-length encoding, non-shortest integers or lengths, disallowed
  tags, invalid UTF-8, non-NFC text, or floating-point values;
- an absent, extra, malformed, or non-map semantic field collection;
- semantic fields invalid or non-normalized under the applicable schema;
- a schema descriptor that is incomplete, unavailable, or not canonical;
- a carried `schema_digest` that is not a 32-octet byte string or does not
  equal the recomputed value;
- an `action_id` that is not a 32-octet byte string;
- an `action_digest` that is not a 32-octet byte string or does not equal the
  recomputed value;
- an unsupported or ambiguously selected profile/frame version; and
- any attempt to substitute another digest algorithm, framing rule, domain
  label, or representation while claiming this profile.

Every rejection fails closed. This Draft defines no generic error taxonomy.

## 11. Deterministic interoperability vector

This vector uses a test-only Action schema. It is conformance evidence for the
profile mechanics, not a globally allocated schema or domain model.

### 11.1 Schema descriptor

Diagnostic form:

```text
{
  "name": "ve.example.transfer",
  "fields": {
    "amount": "uint",
    "operation": "tstr"
  },
  "version": 1
}
```

Canonical descriptor bytes `S`:

```text
a3646e616d657376652e6578616d706c652e7472616e73666572666669656c6473a266616d6f756e746475696e74696f7065726174696f6e64747374726776657273696f6e01
```

Schema-frame bytes `SF`:

```text
837056452d414354494f4e2d534348454d4101a3646e616d657376652e6578616d706c652e7472616e73666572666669656c6473a266616d6f756e746475696e74696f7065726174696f6e64747374726776657273696f6e01
```

Expected `schema_digest` payload:

```text
4bd318df55808e7105d99cac5bb25d5e16c3f6db0fa90418c4760fc1e2a6bfd1
```

### 11.2 Semantic fields and Action digest

Normalized semantic fields:

```text
{
  "amount": 500,
  "operation": "transfer"
}
```

Canonical semantic-field bytes:

```text
a266616d6f756e741901f4696f7065726174696f6e687472616e73666572
```

Exact Action-content frame bytes `AF`:

```text
847156452d414354494f4e2d434f4e54454e540158204bd318df55808e7105d99cac5bb25d5e16c3f6db0fa90418c4760fc1e2a6bfd1a266616d6f756e741901f4696f7065726174696f6e687472616e73666572
```

Expected `action_digest` payload:

```text
25268e71a4c822af38206ec7545d29f0ae221e841cca1519c550124c26b94a11
```

Canonical `action_digest` data item:

```text
582025268e71a4c822af38206ec7545d29f0ae221e841cca1519c550124c26b94a11
```

### 11.3 Action identifier and complete Action

`action_id` payload:

```text
000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
```

Canonical `action_id` data item:

```text
5820000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
```

Complete canonical Action bytes:

```text
a368696e7374616e6365a169616374696f6e5f69645820000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f6873656d616e746963a2666669656c6473a266616d6f756e741901f4696f7065726174696f6e687472616e736665726d736368656d615f64696765737458204bd318df55808e7105d99cac5bb25d5e16c3f6db0fa90418c4760fc1e2a6bfd16d616374696f6e5f646967657374582025268e71a4c822af38206ec7545d29f0ae221e841cca1519c550124c26b94a11
```

## 12. Negative vectors

| Vector | Mutation | Expected result |
|---|---|---|
| N1 | Encode amount `500` non-minimally as `1a000001f4`. | Reject as noncanonical VE-CBOR-1 before hashing. |
| N2 | Encode the same field map with `operation` before `amount`. | Reject as noncanonical VE-CBOR-1; do not normalize and accept the original bytes. |
| N3 | Change the normalized semantic `amount` from `500` to `501`. | Valid different content; expected digest `f3d4347eb0e447f8024df93932403fa199e0ac31f3e6f1c0d42a3073eed8c57e`, not the baseline digest. |
| N4 | Represent `action_id` using 31 octets, text, a tag, or an additional wrapper. | Reject invalid `action_id` representation. |
| N5 | Represent `action_digest` using 31 or 33 octets, text, a tag, or an additional wrapper. | Reject invalid `action_digest` representation. |
| N6 | Append any octet after the complete canonical Action data item. | Reject trailing bytes. |
| N7 | Change the domain label, frame version, schema digest, or digest algorithm while retaining the baseline `action_digest`. | Reject digest mismatch or unsupported profile. |

For N1, the noncanonical Action-content frame is:

```text
847156452d414354494f4e2d434f4e54454e540158204bd318df55808e7105d99cac5bb25d5e16c3f6db0fa90418c4760fc1e2a6bfd1a266616d6f756e741a000001f4696f7065726174696f6e687472616e73666572
```

For N2, the noncanonical Action-content frame is:

```text
847156452d414354494f4e2d434f4e54454e540158204bd318df55808e7105d99cac5bb25d5e16c3f6db0fa90418c4760fc1e2a6bfd1a2696f7065726174696f6e687472616e7366657266616d6f756e741901f4
```

## 13. VE-014 compatibility

Under this profile:

```text
VE001ActionIdValue     = the canonical 32-octet CBOR byte string in Section 7
VE001ActionDigestValue = the canonical 32-octet CBOR byte string in Section 6
```

VE-014 can embed both data items directly in `ExecutionRightBody` with no
wrapper, conversion, alternate encoding, or hidden normalization. Its
authenticated frame therefore binds the exact canonical imported values.

An independent executor supplied with the same governed Action schema and this
profile can validate the Action, recover `action_id`, recompute
`action_digest`, and perform deterministic representation-level comparisons.
VE-014's separate verification-profile dependency remains unresolved and is
not selected here.

## 14. Primitive and governance audit

| Question | Result |
|---|---|
| Changes the VE-001 semantic model? | No. |
| Changes occurrence-identity or semantic-equality meaning? | No. |
| Changes the `action_digest` formula or meaning? | No. It supplies the delegated concrete framing, canonical inputs, and digest suite. |
| Revises Approved VE-001? | No. |
| Requires a new RFC or ADR for this Draft? | No. |
| Allocates a top-level `VE-xxx`, representation-profile, or digest-suite code? | No. |
| Adopts shared `OccurrenceId` or DIGEST-001? | No. |

VE-CBOR-1 supplies applicable deterministic encoding mechanics only.
DIGEST-001 remains specific to Predicate Schema content identity. Neither is
generalized into Action identity.

## 15. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | **Pass.** Canonical, inspectable bytes implement VE-001 without changing Action meaning or authority. |
| New primitive burden | **Pass.** The document is subordinate protocol machinery and adds no architectural primitive. |
| Removability | **Pass.** Another governed profile could replace it without changing VE-001 semantics; removing every such profile removes portable cryptographic interoperability. |
| Twenty-year durability | **Pass.** Explicit domain labels, versioned frames, fixed encoding, and a fixed suite prevent silent reinterpretation while allowing a separately governed successor. |
| Independent implementability | **Pass.** The closed structures, exact framing, concrete suite, representations, rejection rules, and vectors determine identical results. |
| Reduced total conceptual complexity | **Pass.** One VE-001-owned profile prevents downstream artifacts from inventing Action encodings or generic identity wrappers. |

## 16. Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-05 | Initial Draft defining the subordinate VE-001 VE-CBOR-1/SHA-256 Action representation and content-identity profile, without changing VE-001 semantics or allocating a global code. |
