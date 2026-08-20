# RFC-004 — Two-Layer Action Identity and Semantic Payload Boundary

**Status:** Proposed  
**Date:** 2026-08-20  
**Affects:** VE-001 Action Specification  
**Proposed target version:** VE-001 v0.2  
**Related findings:** KV-F46 through KV-F66

## 1. Summary

Revise VE-001 so an Action has distinct content and occurrence identities:

```text
action_digest   = cryptographic identity of canonical semantic content
action_id       = protocol-visible identifier of the Action occurrence
instance_digest = cryptographic binding of that occurrence to action_digest
```

Also divide the Action into:

```text
Instance Envelope
Semantic Payload
```

No new semantic primitive is introduced.

## 2. Problem

VE-001 v0.1 correctly separates historical identity from payload equality, but:

- `action_id` is the sole normative identity;
- Action hashing is optional;
- occurrence, provenance, governance, and effect fields are all treated as required semantic content;
- `initiator`, `authority_context`, and `scope` are universally semantic;
- there is no schema digest;
- there is no cryptographic binding between Action content and Action occurrence.

This is insufficient for exact binding by Claims, Rules, Receipts, authority declarations, and execution evidence.

## 3. Proposed model

```text
action_digest =
  H(schema_digest || canonical_semantic_payload)

instance_digest =
  H(action_digest || canonical_instance_envelope)
```

Exact framing, canonical encoding, domain separation, and digest suite are protocol details to standardize.

## 4. Semantic payload rule

A field MUST be semantic when changing it can change:

- requested external effect;
- target/destination;
- operation/capability;
- material arguments;
- quantity/amount;
- applicability of Claims, Rules, Trust Context authority, or execution authority;
- explicit execution constraints;
- completion semantics.

## 5. Instance envelope

Occurrence-level fields include at minimum:

```text
action_id
```

and may include:

```text
instance_created_at
correlation_id
parent/causation reference
instance_nonce
envelope_version
```

Occurrence fields MUST NOT enter `action_digest` merely to force uniqueness.

## 6. Reclassification of v0.1 fields

- `action_id` → required instance-envelope identity.
- `spec_version` → split between schema semantics and envelope/protocol version.
- `created_at` → occurrence-level unless it constrains requested execution.
- `initiator` → normally Claim/provenance, not universal semantic content.
- `authority_context` → independently established governance context, not universal semantic content.
- `target` → schema-defined semantic payload.
- `operation` → schema-defined semantic payload.
- `arguments` → schema-defined semantic payload.
- `scope` → remove as universal semantic field.

## 7. Action schema reference

Every Action MUST identify an exact schema contract using a normative content digest.

Human-readable schema ID/version MAY exist as metadata.

`schema_ref.digest` MUST participate in `action_digest`.

## 8. Security properties

- Any semantic mutation changes `action_digest`.
- Any bound occurrence mutation changes `instance_digest`.
- Same semantic content MAY have multiple Action occurrences.
- An Action-carried Rule, Trust Context, authority, or selector hint does not become authoritative by inclusion.
- Digest equality does not imply idempotency or replay suppression.

## 9. Non-goals

This RFC does not introduce `Actor`, `Resource`, `Scope`, or `ActionSchema` as semantic primitives and does not define a universal ontology or final canonical wire format.

## 10. Proposed disposition

**ACCEPT** and revise VE-001 from v0.1 to v0.2.
