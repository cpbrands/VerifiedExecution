---
id: RS-ACT-001-VE001-PORTABILITY-INTEROPERABILITY
title: Independent Implementations Produce Identical Action Identity
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-05
updated: 2026-09-05
depends_on:
  - VE-001
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - ADR-ENC-001
related_documents:
  - VE-014
  - RS-ER-003-VE014-INDEPENDENT-EXECUTOR
  - GAP-ANALYSIS-RS-ER-003
supersedes: null
superseded_by: null
---

# RS-ACT-001 — Independent Implementations Produce Identical Action Identity

## 1. Authority and purpose

This document is **non-normative evidence**. It pressure-tests the Draft
VE-001 Action Canonical Representation and Content Identity Profile v0.1. It
does not modify VE-001, revise the profile, define an Action schema for use
outside this scenario, allocate a schema or profile identifier, or establish
protocol authority.

The question is whether two independent implementations, given only the same
semantic inputs, governed test schema, and normative profile closure, derive:

```text
same semantics + same profile
→ same canonical bytes
→ same schema_digest and action_digest
```

## 2. Independent-implementation model

Implementation A and Implementation B:

- use different programming languages and CBOR/SHA-256 implementations;
- share no serialized input, precomputed frame, digest, or canonical Action;
- receive the same abstract semantic field values and already-established
  Action occurrence identifier;
- independently apply the test schema's normalization rules; and
- independently implement VE-CBOR-1 and the Draft profile.

Their only common authorities are VE-001, ADR-ENC-001 / VE-CBOR-1, the Draft
profile, and the complete test-only schema below. Neither may copy bytes from
the other.

## 3. Test-only governed Action schema

The scenario uses a CAD 500 bank transfer because it is consequential and
familiar, but does not rely on any unstated financial or generic normalization
rule. The following schema is complete for this test and is not a global
schema, registry entry, or reusable domain allocation.

Semantic inputs are:

```text
amount_minor  = 50000
currency      = "CAD"
recipient     = "Café-Y"
source_account = "account-X"
```

The schema rules are exactly:

- `amount_minor` is a required unsigned integer counting CAD minor units;
- `currency` is required text and admits exactly `"CAD"`;
- `recipient` and `source_account` are required text normalized to Unicode NFC;
- all four fields are required, there are no defaults, and unknown fields are
  rejected; and
- the normalized field map contains exactly those four fields.

Thus a decomposed internal spelling of `Café-Y`, a different local map
insertion order, or an implementation-specific integer width cannot survive
as an alternative canonical representation. NFC normalization is authorized
by this test schema before VE-CBOR-1 encoding; the scenario does not invent a
generic normalization rule.

The complete `CanonicalSchemaDescriptor` in diagnostic form is:

```text
{
  "name": "ve.test.bank-transfer",
  "fields": {
    "amount_minor": { "required": true, "type": "uint" },
    "currency": { "allowed": ["CAD"], "required": true, "type": "tstr" },
    "recipient": { "normalization": "NFC", "required": true, "type": "tstr" },
    "source_account": { "normalization": "NFC", "required": true, "type": "tstr" }
  },
  "version": 1,
  "defaults": "none",
  "unknown_fields": "reject"
}
```

## 4. Schema identity replay

Each implementation independently constructs:

```text
SchemaIdentityFrame = [
  "VE-ACTION-SCHEMA",
  1,
  CanonicalSchemaDescriptor
]
```

and computes:

```text
schema_bytes  = VE-CBOR-1(SchemaIdentityFrame)
schema_digest = SHA-256(schema_bytes)
```

Required and observed:

```text
descriptor_A    == descriptor_B
schema_bytes_A  == schema_bytes_B
schema_digest_A == schema_digest_B
```

## 5. Semantic normalization replay

Implementation A inserts local fields in the order `amount_minor`, `currency`,
`recipient`, `source_account`. Implementation B inserts them in reverse order
and begins with a decomposed internal Unicode spelling of `Café-Y`. Both apply
the schema before encoding.

Required and observed:

```text
normalized_fields_A == normalized_fields_B
```

Both obtain the exact four-field map in Section 3 with NFC `Café-Y`, unsigned
integer `50000`, no omitted required value, no default, and no extra field.

## 6. Action content identity replay

Each implementation independently constructs:

```text
ActionContentFrame = [
  "VE-ACTION-CONTENT",
  1,
  schema_digest,
  normalized_schema_defined_fields
]
```

and computes:

```text
content_bytes = VE-CBOR-1(ActionContentFrame)
action_digest = SHA-256(content_bytes)
```

Required and observed:

```text
content_bytes_A == content_bytes_B
action_digest_A == action_digest_B
```

The frame commits only to VE-001 semantic content. It contains no `action_id`,
`action_digest`, occurrence or attempt metadata, lifecycle state, transport
metadata, or local annotation.

## 7. Occurrence identity replay

Both implementations receive the same already-established `action_id` payload:

```text
202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Under this profile it is one canonical `bstr(32)`. Exact ordered payload-octet
comparison yields:

```text
action_id_A == action_id_B
```

This tests representation, not generation. It assumes no randomness, registry,
shared `OccurrenceId`, or Event semantics. Representation-level equality does
not redefine VE-001 semantic equality, and matching the `OccurrenceId` wire
shape does not adopt cross-kind identity.

## 8. Complete canonical Action replay

Each implementation independently constructs:

```text
{
  "action_digest": action_digest,
  "instance": {
    "action_id": action_id
  },
  "semantic": {
    "fields": normalized_schema_defined_fields,
    "schema_digest": schema_digest
  }
}
```

Required and observed:

```text
canonical_action_bytes_A == canonical_action_bytes_B
```

Semantic-content bytes produce `action_digest`; the resulting digest is then
carried in the complete canonical Action. There is no digest circularity.

## 9. Exact interoperability vectors

### 9.1 Canonical schema descriptor bytes

```text
a5646e616d657576652e746573742e62616e6b2d7472616e73666572666669656c6473a46863757272656e6379a36474797065647473747267616c6c6f7765648163434144687265717569726564f569726563697069656e74a364747970656474737472687265717569726564f56d6e6f726d616c697a6174696f6e634e46436c616d6f756e745f6d696e6f72a264747970656475696e74687265717569726564f56e736f757263655f6163636f756e74a364747970656474737472687265717569726564f56d6e6f726d616c697a6174696f6e634e46436776657273696f6e016864656661756c7473646e6f6e656e756e6b6e6f776e5f6669656c64736672656a656374
```

### 9.2 SchemaIdentityFrame bytes

```text
837056452d414354494f4e2d534348454d4101a5646e616d657576652e746573742e62616e6b2d7472616e73666572666669656c6473a46863757272656e6379a36474797065647473747267616c6c6f7765648163434144687265717569726564f569726563697069656e74a364747970656474737472687265717569726564f56d6e6f726d616c697a6174696f6e634e46436c616d6f756e745f6d696e6f72a264747970656475696e74687265717569726564f56e736f757263655f6163636f756e74a364747970656474737472687265717569726564f56d6e6f726d616c697a6174696f6e634e46436776657273696f6e016864656661756c7473646e6f6e656e756e6b6e6f776e5f6669656c64736672656a656374
```

### 9.3 schema_digest payload

```text
d83e3b0d3af3011167f53b019f3303cdf5ac18d39df82ed071e5cb6f8a84e8d8
```

### 9.4 Normalized semantic-field bytes

```text
a46863757272656e63796343414469726563697069656e7467436166c3a92d596c616d6f756e745f6d696e6f7219c3506e736f757263655f6163636f756e74696163636f756e742d58
```

### 9.5 ActionContentFrame bytes

```text
847156452d414354494f4e2d434f4e54454e54015820d83e3b0d3af3011167f53b019f3303cdf5ac18d39df82ed071e5cb6f8a84e8d8a46863757272656e63796343414469726563697069656e7467436166c3a92d596c616d6f756e745f6d696e6f7219c3506e736f757263655f6163636f756e74696163636f756e742d58
```

### 9.6 action_digest payload

```text
4281d2fa76069a5e1b7e7909b671b8ee9f772689f9f3ef0467153a98d804f77b
```

### 9.7 Canonical action_id data item

```text
5820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

### 9.8 Complete canonical Action bytes

```text
a368696e7374616e6365a169616374696f6e5f69645820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f6873656d616e746963a2666669656c6473a46863757272656e63796343414469726563697069656e7467436166c3a92d596c616d6f756e745f6d696e6f7219c3506e736f757263655f6163636f756e74696163636f756e742d586d736368656d615f6469676573745820d83e3b0d3af3011167f53b019f3303cdf5ac18d39df82ed071e5cb6f8a84e8d86d616374696f6e5f64696765737458204281d2fa76069a5e1b7e7909b671b8ee9f772689f9f3ef0467153a98d804f77b
```

Independent Python and JavaScript implementations reproduced every byte string
and digest above from the diagnostic semantic inputs and schema rules.

## 10. Mandatory divergence attacks

| Attack | Expected and observed result |
|---|---|
| A. Different local map insertion order | Both canonical encoders emit identical VE-CBOR-1 key order and identical bytes. |
| B. Semantically decodable but noncanonical CBOR | Reject the noncanonical input; do not derive or recognize a second valid `action_digest`. |
| C. Change `amount_minor` from `50000` to `50001` | `ActionContentFrame` and `action_digest` change. |
| D. Keep semantics and change `action_id` | `action_digest` remains equal while the Action occurrence differs: content identity is not occurrence identity. |
| E. Keep `action_id` and change semantic content | `action_digest` changes; the pair no longer identifies the Action content expected by VE-014. |
| F. Change any complete schema-descriptor rule | `schema_digest` changes and therefore `action_digest` changes. |
| G. Apply normalization not authorized by the schema | The implementation is non-conforming; its result is not an alternative valid identity under this profile. |

Noncanonical ordering, non-shortest integer encodings, duplicate keys, unknown
fields, wrong widths or types, tags, trailing bytes, and frame/domain/algorithm
substitution are rejected under the Draft profile rather than treated as
distinct valid semantic identities.

## 11. Schema-closure pressure test

Question:

> Can portability be achieved if the governing Action schema does not define
> an exact canonical schema descriptor and exact semantic normalization?

Answer: **No.** This is already an explicit profile precondition, not a new
profile or VE-001 architectural gap. This scenario therefore records:

```text
C. GOVERNING ACTION-SCHEMA CLOSURE DEPENDENCY
```

A deployment lacking that closure cannot claim portability under the profile.

## 12. Profile-applicability pressure test

A and B know that this exact Draft profile applies because the same applicable
protocol or governing context selects its name, version, closure, governed
Action schema, and local frame version. That existing contextual model is
sufficient for this scenario. No registry, portable selector primitive,
top-level `VE-xxx` identifier, or algorithm registry is needed.

## 13. Cross-profile pressure test

Hypothetical Profile Y is introduced only to ask whether this Draft supplies a
cross-profile comparison procedure. It does not. VE-001 remains authoritative
for semantic identity and equality. Values are not declared semantically
unequal merely because their profiles differ, and matching raw bytes do not by
themselves establish cross-profile equality.

## 14. VE-014 handoff

Both implementations obtain the same canonical:

```text
VE001ActionIdValue
VE001ActionDigestValue
```

VE-014 can embed those exact data items directly, with no wrapper, conversion,
alternate encoding, or hidden normalization. This demonstrates resolution of
the previously identified VE-001 portability dependency for this profile and
governed schema closure. It does not define a VE-014 verification profile; that
ordinary downstream dependency remains unresolved.

## 15. Primitive-creep and governance result

The scenario requires no generic `ContentIdentity`, `DigestRef`, `HashRef`,
`ActionProfile` primitive, `SchemaRegistry`, `ProfileRegistry`, normalization
registry, universal Action schema, serialization abstraction, or digest
abstraction.

It requires no VE-001 or profile revision, no RFC, no ADR, and no new top-level
identifier. The test-only schema and hypothetical Profile Y have no authority
outside this evidence.

## 16. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | **Pass.** Independent canonicalization preserves inspectable Action semantics without conflating authorization, execution, or outcome. |
| Primitive burden | **Pass.** No new primitive, registry, or universal schema is required. |
| Removability | **Pass.** The evidence and test schema can be removed without changing VE-001 or the Draft profile. |
| Twenty-year durability | **Pass.** Explicit schema closure and versioned domain frames avoid reliance on language, library, vendor, or registry behavior. |
| Independent implementability | **Pass.** Two independent implementations derive the same descriptor, frames, bytes, and digests. |
| Reduced conceptual complexity | **Pass.** The existing schema/profile/context boundaries suffice without another identity or dispatch abstraction. |

## 17. Final classification

```text
A. NO NEW PORTABILITY-PROFILE GAP
C. GOVERNING ACTION-SCHEMA CLOSURE DEPENDENCY
```

The closure dependency is already stated by the profile and is satisfied by
the explicit test-only schema in this scenario. Profile applicability is
satisfied by existing governing context. The portability profile requires no
revision, VE-001 requires no revision, and no RFC or ADR is required.

