# RFC-004 — Two-Layer Action Identity and Semantic Payload Boundary

**Revision:** 0.2  
**Status:** Accepted  
**Date:** 2026-08-20  
**Accepted:** 2026-08-22  
**Affects:** VE-001 Action Specification  
**Proposed target version:** VE-001 v0.2  
**Related findings:** KV-F46 through KV-F66

---

## 1. Summary

Revise VE-001 so an Action distinguishes:

```text
action_digest = cryptographic identity of canonical semantic content
action_id     = protocol-visible identifier of the historical Action occurrence
```

and so the Action is divided logically into:

```text
Instance Envelope
Semantic Payload
```

The occurrence-to-content relationship MUST be cryptographically bindable.

RFC-004 does **not** require a separate `instance_digest` field or identity. A protocol artifact MAY derive a digest over the bound instance/content tuple when useful, but that digest is protocol machinery rather than a third Action identity.

No new semantic primitive is introduced.

---

## 2. Problem

VE-001 v0.1 correctly separates historical Action identity from payload equality, but:

- `action_id` is the sole normative identity;
- Action hashing is optional;
- occurrence, provenance, governance, and effect fields are all treated as required semantic content;
- `initiator`, `authority_context`, and `scope` are universally semantic;
- there is no normative schema digest;
- there is no interoperable cryptographic content identity;
- the specification does not define how an occurrence is bound to exact semantic content.

This is insufficient for exact binding by Claims, Rules, Receipts, authority declarations, and execution evidence.

---

## 3. Decision Requested

Accept the following architectural distinction:

### 3.1 Semantic content identity

```text
action_digest =
    H(
        domain_separator
        ||
        schema_digest
        ||
        canonical_semantic_payload
    )
```

`action_digest` answers:

> What exactly is being proposed?

### 3.2 Historical occurrence identity

```text
action_id
```

`action_id` answers:

> Which occurrence of that proposal is this?

Two Action occurrences MAY share an `action_digest` while having different `action_id` values.

### 3.3 Occurrence/content binding

Any artifact whose semantics depend on a particular occurrence of particular content MUST cryptographically bind at least the tuple:

```text
(action_id, action_digest)
```

If an applicable protocol defines additional authoritative Instance Envelope fields, that protocol MUST specify which of those fields are included in the binding.

A derived commitment such as:

```text
instance_commitment =
    H(
        domain_separator
        ||
        action_id
        ||
        action_digest
        ||
        canonical_bound_instance_fields
    )
```

MAY be used for compactness or signing.

Such a commitment is not a new Action primitive and need not be a universally stored field.

---

## 4. Semantic Payload Rule

A field MUST be semantic when changing it can change:

- the requested external effect;
- target or destination;
- operation or capability;
- material arguments;
- quantity or amount;
- deterministic applicability of Claims, Rules, Trust Context authority, or execution authority;
- explicit execution constraints;
- completion semantics.

This rule does not authorize the Action to choose its own Rule, Trust Context, or authority.

Applicability-relevant values are semantic only when declared by the applicable Action Schema as canonical Action fields.

---

## 5. Instance Envelope

Occurrence-level fields include at minimum:

```text
action_id
```

and MAY include protocol-defined fields such as:

```text
instance_created_at
correlation_id
parent / causation reference
instance_nonce
envelope_version
non-authoritative routing hints
```

Occurrence fields MUST NOT enter `action_digest` merely to force uniqueness.

Not every envelope field must be cryptographically bound. A protocol MUST explicitly classify envelope fields as:

```text
bound
unbound/non-authoritative
local implementation metadata
```

A field whose mutation could alter the interpretation, provenance, replay behavior, or authoritative history of an Action occurrence MUST be bound by the artifact that relies on it.

---

## 6. Reclassification of VE-001 v0.1 Fields

### `action_id`

Retain as required historical occurrence identity.

Remove from semantic payload.

### `spec_version`

Separate semantic interpretation from envelope/protocol version.

Schema semantics are identified by `schema_digest`.

### `created_at`

Treat as occurrence-level when evidentiary only.

If time constrains requested execution, represent that constraint explicitly in Semantic Payload.

### `initiator`

Remove as universally required semantic Action content.

Initiator/proposer identity is normally Claim/provenance information.

If represented identity changes the requested effect, the Action Schema includes that identity in Semantic Payload.

### `authority_context`

Remove as universally required semantic Action content.

Authority is established independently through verified Claims and Trust Context.

Action-carried authority references are non-authoritative hints unless independently established.

### `target`, `operation`, `arguments`

Retain their effect-relevant semantics, but make their exact structure Action-Schema-defined rather than a universal VE ontology.

### `scope`

Remove as a universal semantic field.

Applicability is computed deterministically over canonical schema-defined Action fields.

---

## 7. Action Schema Reference

Every Action MUST identify the exact schema contract under which its Semantic Payload is interpreted.

The normative schema identity is:

```text
schema_digest
```

Human-readable schema identifier and version MAY accompany it.

`schema_digest` MUST participate in `action_digest`.

This requirement does not make Action Schema a new kernel primitive or require a global registry.

---

## 8. Canonical Encoding Dependency

RFC-004 establishes the identity model but does not select the canonical encoding or digest suite.

VE-001 v0.2 MUST NOT claim independently interoperable digest computation until a normative canonical encoding, framing/domain-separation rule, and digest-suite representation are specified.

Therefore acceptance of RFC-004 authorizes the architectural revision, while final VE-001 v0.2 conformance language remains dependent on that protocol work.

---

## 9. Security Properties

### Semantic mutation resistance

Changing semantic content or schema identity changes `action_digest`.

### Distinct repeated occurrence

Identical semantic content can occur more than once without collapsing histories.

### Occurrence/content substitution resistance

Artifacts that rely on a particular occurrence MUST bind `action_id` together with `action_digest`.

### Non-self-authorization

Action-carried Rule, Trust Context, authority, or selector hints do not become authoritative by inclusion.

### No digest overloading

`action_digest` does not imply idempotency, replay suppression, authorization, execution, or commit.

---

## 10. Alternatives Considered

### Keep `action_id` as sole identity

Rejected. It does not cryptographically identify exact semantic content.

### Use `action_digest` as sole Action identity

Rejected. It collapses distinct repeated occurrences of identical content.

### Require a universal `instance_digest`

Rejected as an architectural requirement. The necessary security property is cryptographic binding of occurrence to content. A separate stored digest is one implementation mechanism and fails the removability test as a mandatory Action identity.

### Hash one monolithic Action object

Rejected. It destroys useful semantic-content equivalence and encourages occurrence metadata to pollute content identity.

### Keep universal `initiator`, `authority_context`, and `scope`

Rejected. They over-specify Action and blur Action semantics with provenance, authority, and applicability.

---

## 11. Architectural Decision Test

1. **Founding principles:** strengthens precise intent representation and external authority separation.
2. **New primitive:** none.
3. **Removability:** `action_digest` is necessary for exact content binding; a separate `instance_digest` is deliberately not required because the architecture survives without it.
4. **Twenty-year test:** content identity vs. occurrence identity is domain-independent.
5. **Independent implementation:** the semantic classification rule and required occurrence/content binding are deterministic once canonical encoding is standardized.
6. **Complexity:** removes overloaded universal fields and avoids introducing an unnecessary third Action identity.

---

## 12. Compatibility

A VE-001 v0.1 Action MUST NOT be assigned a v0.2 `action_digest` by inference alone.

Migration requires a declared profile that classifies each v0.1 field as:

```text
semantic payload
bound instance-envelope field
external Claim/context
non-authoritative metadata
```

---

## 13. Non-Goals

RFC-004 does not:

- introduce `Actor`, `Resource`, `Scope`, `ActionSchema`, or `Instance` as semantic primitives;
- define a universal domain ontology;
- define a policy language;
- select final canonical encoding;
- select a final digest suite;
- define global replay or idempotency semantics;
- require a universal `instance_digest`.

---

## 14. Proposed Disposition

**ACCEPT** this revised RFC and proceed to ADR-004.

The ADR should record the two required identities (`action_id`, `action_digest`) and the occurrence/content binding invariant without elevating a derived instance commitment into a third Action identity.
# RFC-004 — Two-Layer Action Identity and Semantic Payload Boundary

**Revision:** 0.2  
**Status:** Proposed  
**Date:** 2026-08-20  
**Affects:** VE-001 Action Specification  
**Proposed target version:** VE-001 v0.2  
**Related findings:** KV-F46 through KV-F66

---

## 1. Summary

Revise VE-001 so an Action distinguishes:

```text
action_digest = cryptographic identity of canonical semantic content
action_id     = protocol-visible identifier of the historical Action occurrence
```

and so the Action is divided logically into:

```text
Instance Envelope
Semantic Payload
```

The occurrence-to-content relationship MUST be cryptographically bindable.

RFC-004 does **not** require a separate `instance_digest` field or identity. A protocol artifact MAY derive a digest over the bound instance/content tuple when useful, but that digest is protocol machinery rather than a third Action identity.

No new semantic primitive is introduced.

---

## 2. Problem

VE-001 v0.1 correctly separates historical Action identity from payload equality, but:

- `action_id` is the sole normative identity;
- Action hashing is optional;
- occurrence, provenance, governance, and effect fields are all treated as required semantic content;
- `initiator`, `authority_context`, and `scope` are universally semantic;
- there is no normative schema digest;
- there is no interoperable cryptographic content identity;
- the specification does not define how an occurrence is bound to exact semantic content.

This is insufficient for exact binding by Claims, Rules, Receipts, authority declarations, and execution evidence.

---

## 3. Decision Requested

Accept the following architectural distinction:

### 3.1 Semantic content identity

```text
action_digest =
    H(
        domain_separator
        ||
        schema_digest
        ||
        canonical_semantic_payload
    )
```

`action_digest` answers:

> What exactly is being proposed?

### 3.2 Historical occurrence identity

```text
action_id
```

`action_id` answers:

> Which occurrence of that proposal is this?

Two Action occurrences MAY share an `action_digest` while having different `action_id` values.

### 3.3 Occurrence/content binding

Any artifact whose semantics depend on a particular occurrence of particular content MUST cryptographically bind at least the tuple:

```text
(action_id, action_digest)
```

If an applicable protocol defines additional authoritative Instance Envelope fields, that protocol MUST specify which of those fields are included in the binding.

A derived commitment such as:

```text
instance_commitment =
    H(
        domain_separator
        ||
        action_id
        ||
        action_digest
        ||
        canonical_bound_instance_fields
    )
```

MAY be used for compactness or signing.

Such a commitment is not a new Action primitive and need not be a universally stored field.

---

## 4. Semantic Payload Rule

A field MUST be semantic when changing it can change:

- the requested external effect;
- target or destination;
- operation or capability;
- material arguments;
- quantity or amount;
- deterministic applicability of Claims, Rules, Trust Context authority, or execution authority;
- explicit execution constraints;
- completion semantics.

This rule does not authorize the Action to choose its own Rule, Trust Context, or authority.

Applicability-relevant values are semantic only when declared by the applicable Action Schema as canonical Action fields.

---

## 5. Instance Envelope

Occurrence-level fields include at minimum:

```text
action_id
```

and MAY include protocol-defined fields such as:

```text
instance_created_at
correlation_id
parent / causation reference
instance_nonce
envelope_version
non-authoritative routing hints
```

Occurrence fields MUST NOT enter `action_digest` merely to force uniqueness.

Not every envelope field must be cryptographically bound. A protocol MUST explicitly classify envelope fields as:

```text
bound
unbound/non-authoritative
local implementation metadata
```

A field whose mutation could alter the interpretation, provenance, replay behavior, or authoritative history of an Action occurrence MUST be bound by the artifact that relies on it.

---

## 6. Reclassification of VE-001 v0.1 Fields

### `action_id`

Retain as required historical occurrence identity.

Remove from semantic payload.

### `spec_version`

Separate semantic interpretation from envelope/protocol version.

Schema semantics are identified by `schema_digest`.

### `created_at`

Treat as occurrence-level when evidentiary only.

If time constrains requested execution, represent that constraint explicitly in Semantic Payload.

### `initiator`

Remove as universally required semantic Action content.

Initiator/proposer identity is normally Claim/provenance information.

If represented identity changes the requested effect, the Action Schema includes that identity in Semantic Payload.

### `authority_context`

Remove as universally required semantic Action content.

Authority is established independently through verified Claims and Trust Context.

Action-carried authority references are non-authoritative hints unless independently established.

### `target`, `operation`, `arguments`

Retain their effect-relevant semantics, but make their exact structure Action-Schema-defined rather than a universal VE ontology.

### `scope`

Remove as a universal semantic field.

Applicability is computed deterministically over canonical schema-defined Action fields.

---

## 7. Action Schema Reference

Every Action MUST identify the exact schema contract under which its Semantic Payload is interpreted.

The normative schema identity is:

```text
schema_digest
```

Human-readable schema identifier and version MAY accompany it.

`schema_digest` MUST participate in `action_digest`.

This requirement does not make Action Schema a new kernel primitive or require a global registry.

---

## 8. Canonical Encoding Dependency

RFC-004 establishes the identity model but does not select the canonical encoding or digest suite.

VE-001 v0.2 MUST NOT claim independently interoperable digest computation until a normative canonical encoding, framing/domain-separation rule, and digest-suite representation are specified.

Therefore acceptance of RFC-004 authorizes the architectural revision, while final VE-001 v0.2 conformance language remains dependent on that protocol work.

---

## 9. Security Properties

### Semantic mutation resistance

Changing semantic content or schema identity changes `action_digest`.

### Distinct repeated occurrence

Identical semantic content can occur more than once without collapsing histories.

### Occurrence/content substitution resistance

Artifacts that rely on a particular occurrence MUST bind `action_id` together with `action_digest`.

### Non-self-authorization

Action-carried Rule, Trust Context, authority, or selector hints do not become authoritative by inclusion.

### No digest overloading

`action_digest` does not imply idempotency, replay suppression, authorization, execution, or commit.

---

## 10. Alternatives Considered

### Keep `action_id` as sole identity

Rejected. It does not cryptographically identify exact semantic content.

### Use `action_digest` as sole Action identity

Rejected. It collapses distinct repeated occurrences of identical content.

### Require a universal `instance_digest`

Rejected as an architectural requirement. The necessary security property is cryptographic binding of occurrence to content. A separate stored digest is one implementation mechanism and fails the removability test as a mandatory Action identity.

### Hash one monolithic Action object

Rejected. It destroys useful semantic-content equivalence and encourages occurrence metadata to pollute content identity.

### Keep universal `initiator`, `authority_context`, and `scope`

Rejected. They over-specify Action and blur Action semantics with provenance, authority, and applicability.

---

## 11. Architectural Decision Test

1. **Founding principles:** strengthens precise intent representation and external authority separation.
2. **New primitive:** none.
3. **Removability:** `action_digest` is necessary for exact content binding; a separate `instance_digest` is deliberately not required because the architecture survives without it.
4. **Twenty-year test:** content identity vs. occurrence identity is domain-independent.
5. **Independent implementation:** the semantic classification rule and required occurrence/content binding are deterministic once canonical encoding is standardized.
6. **Complexity:** removes overloaded universal fields and avoids introducing an unnecessary third Action identity.

---

## 12. Compatibility

A VE-001 v0.1 Action MUST NOT be assigned a v0.2 `action_digest` by inference alone.

Migration requires a declared profile that classifies each v0.1 field as:

```text
semantic payload
bound instance-envelope field
external Claim/context
non-authoritative metadata
```

---

## 13. Non-Goals

RFC-004 does not:

- introduce `Actor`, `Resource`, `Scope`, `ActionSchema`, or `Instance` as semantic primitives;
- define a universal domain ontology;
- define a policy language;
- select final canonical encoding;
- select a final digest suite;
- define global replay or idempotency semantics;
- require a universal `instance_digest`.

---

## 14. Proposed Disposition

**ACCEPT** this revised RFC and proceed to ADR-004.

The ADR should record the two required identities (`action_id`, `action_digest`) and the occurrence/content binding invariant without elevating a derived instance commitment into a third Action identity.
