---
id: CLAIM-BODY-SEMANTIC-FIELD-CONTRACT
title: Claim Body Semantic Field Contract
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Claim Semantics
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-08-27
depends_on:
  - ADR-VERIFY-002
  - VE-001
  - VE-002
  - VE-CLAIM-REFERENCE-SEMANTICS
related_documents:
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - PRESSURE-TEST-CLAIM-SEMANTIC-CONTEXT-SELECTION
supersedes: null
superseded_by: null
---

# Claim Body Semantic Field Contract

## Status and authority boundary

This is a Draft candidate specification. It defines candidate Claim-body field semantics; it does not amend an Approved specification, accept RFC-005, or create a VE primitive.

The accepted Claim envelope remains unchanged:

```text
Claim {
  body,
  verification {
    profile,
    artifact
  }
}
```

This specification concerns only `body`. It defines neither verification artifacts, verifier or key selection, Trust Context, Rule selection, CEL mapping, CBOR field labels, nor canonical wire encoding.

`EventReference` remains provisional because VE-002 is Draft. RFC-005 is not a dependency of this specification.

## 1. Purpose

This specification defines the minimum semantic obligations that independent implementations must agree on before a future representation profile can produce portable canonical Claim-body bytes:

```text
Claim.body {
  subject_reference,
  issuer_ref,
  predicate,
  value,
  assertion_time?,
  observation_time?
}
```

Semantic interpretation follows this model:

```text
Claim.body.predicate
        ↓
immutable, version-specific Predicate Schema
        ↓
semantic interpretation of issuer, value, time, and subject constraints
```

No separate Claim-level semantic selector is required.

## 2. Terminology

**Predicate Schema**

An immutable, version-specific semantic descriptor selected by a complete predicate identifier. It defines the semantic contract of one proposition. It is a non-primitive normative abstraction, not a VE kernel primitive or identity provider.

**Semantic issuer**

The issuer asserted in `issuer_ref`, whose identity is relevant to Claim meaning and evaluation. It is not necessarily a signer or key owner.

**Omission**

The semantic absence of an optional Claim-body field. Omission is not a null-like asserted value.

**Canonical semantic equivalence**

The relation under which two Claim bodies express the same assertion under the same Predicate Schema. It is not a byte-encoding rule and does not create Claim identity.

## 3. Predicate identity and schema selection

### 3.1 Verdict

**A. PREDICATE-SELECTED SEMANTICS SUFFICIENT — NO NEW CLAIM FIELD.**

The complete `predicate` identifier MUST be:

1. globally unambiguous within the Claim semantic system;
2. version-specific;
3. integrity/content-bound to exactly one immutable Predicate Schema; and
4. resolvable by independent implementations.

The predicate identifier MAY embed its own namespace. Namespace ambiguity MUST be impossible at the level of the complete identifier: two unrelated Predicate Schemas MUST NOT use the same complete identifier for different meanings.

VE does not require a VE-hosted global predicate registry, a `predicate_namespace` field, or a separate Claim-level semantic selector.

### 3.2 Deterministic resolution

The semantic requirement is:

```text
same predicate identifier
        ↓
same immutable, version-specific Predicate Schema
```

The Predicate Schema is the meaning of the identifier; it is not encoded in the identifier itself. The schema acquisition mechanism is transport behavior, not Claim semantics. An implementation MAY use a locally provisioned schema set. Network retrieval is optional and MUST NOT be required during Verify/Evaluate execution.

These rules preserve long-term auditability and offline interpretation without requiring a registry, resolver, URI syntax, digest form, or wire encoding in this Draft.

## 4. Predicate Schema obligations

The Predicate Schema selected by `predicate` MUST define, for that predicate:

1. the allowed `value` domain and semantic equality;
2. numeric unit, scale, and allowed range where numeric values are allowed;
3. null-like and structured-value semantics where applicable;
4. the semantic domain and equality rules for `issuer_ref`;
5. which legal Claim subject-reference forms may be used and their proposition-specific constraints; and
6. whether `assertion_time` and `observation_time` are allowed or required, together with their semantic meaning and applicable time-domain/profile requirements.

The Predicate Schema MUST give every present Claim-body field one unambiguous semantic interpretation. It MUST NOT depend on hidden mutable state to decide the meaning of a Claim body.

The Predicate Schema does not own:

- trust decisions;
- verifier or key binding;
- verification success;
- delegation; or
- revocation.

Those concerns remain with Verify, VerificationContext, Trust Context, and Evaluate under their governing specifications.

## 5. Subject-reference boundary

This specification reuses, without redefining, Draft Canonical Claim Reference Semantics:

```text
subject_reference :=
  ActionContentReference { action_digest }
  | ActionOccurrenceReference { action_id, action_digest }
  | EventReference { event_id }
```

Claim Reference Semantics owns the legal structural forms and their equality. A Predicate Schema MAY constrain which of those legal forms is valid for its proposition. It MUST NOT add a new subject form or an execution-attempt reference.

Action and Event profiles retain ownership of `action_id`, `action_digest`, and `event_id` representation. This document does not select their text, bytes, URI, digest, tag, or other wire form.

Action content identity, Action occurrence identity, and Event identity remain distinct. This specification introduces no attempt reference.

## 6. Semantic issuer

`issuer_ref` MUST identify the semantic issuer under the issuer domain defined by the selected Predicate Schema. The schema defines the domain and equality rule, while VerificationContext establishes the binding from `issuer_ref` to a verifier or key and Trust Context/Evaluate decides whether the issuer is trusted or applicable.

`issuer_ref` is not, unless a governing external contract explicitly binds it:

- a signer identity;
- a key identifier;
- a certificate subject;
- a DID; or
- VE-managed identity.

Identical `issuer_ref` values under different predicates MUST NOT be assumed to denote the same semantic issuer unless their Predicate Schemas explicitly bind to the same issuer-domain contract. For example:

```text
predicate A: issuer_ref = "123"
predicate B: issuer_ref = "123"
```

These values do not automatically denote the same issuer. Cross-predicate issuer equality requires a shared declared issuer-domain contract. This does not require an `issuer_namespace` field or a VE identity registry.

## 7. Value

`value` MUST be interpreted under the selected Predicate Schema. VE does not define a universal `VEValue` grammar. The schema defines allowed values, equality, and all proposition-specific structure.

For a numeric value, the schema MUST define the canonical unit, scale, and allowed range. For example, `1234` cents and `12340` mills are not interchangeable representations without a governing schema conversion rule. No universal VE decimal primitive is introduced.

A Predicate Schema MAY define a null-like asserted value. Such a value is neither universally legal nor universally prohibited by VE. Maps, lists, and other structured values MAY be used only where the schema defines their permitted shape and semantic equality.

## 8. Time and optional fields

`assertion_time`, when present, is the time at which the semantic issuer made the Claim assertion. It is distinct from verification time, Event time, Receipt time, and potentially observation time.

`observation_time`, when present, is the time associated with the underlying condition or observation asserted by the Claim. It is distinct from the time the issuer asserted that condition. It does not create an Observation Claim subtype or make a Claim authoritative Event history.

The selected Predicate Schema determines whether either field is allowed or required, its semantic meaning, and the applicable time domain/profile and representation requirement. This Draft chooses no epoch, precision, UTC treatment, leap-second policy, or universal VE Time Profile.

Optional-field presence is semantic:

```text
field absent != field present with any value
```

An absent field means the issuer did not assert or materialize it. `null` MUST NOT be used as a general stand-in for absence. A present null-like `value` is governed by the Predicate Schema.

## 9. Canonical semantic equivalence and Claim identity

Two Claim bodies are canonically semantically equivalent only if:

1. their complete predicate identifiers are equal and resolve to the same immutable Predicate Schema;
2. their subject references are semantically equal under Claim Reference Semantics and satisfy the schema's subject constraint;
3. their `issuer_ref` values are equal in the schema's issuer domain;
4. their values are equal under the schema, including unit, scale, null-like, and structured-value rules; and
5. their optional-field presence is the same and every present time value is equal under the schema's time semantics.

This semantic equivalence is a prerequisite for a future portable canonical representation. It does not introduce `claim_id`, `claim_digest`, or `ClaimReference`.

## 10. Verification, Rule/Evaluate, and representation boundaries

ADR-VERIFY-002 remains unchanged. `verification.profile` and `verification.artifact` select verification mechanics and do not alter Claim semantics. VerificationContext supplies the appropriate issuer-to-verifier/key binding; it does not choose the Predicate Schema.

Rule/Evaluate consumes established `Claim.body` directly. This document does not select Claims, rank issuers, resolve conflicts, deduplicate inputs, or define CEL mapping.

This is a semantic-field contract. Future representation work owns CBOR labels, encoded field sets, serialized-form rejection, tags, discriminators, and canonical bytes. This Draft defines no CBOR wire encoding.

## 11. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. Proposition meaning is explicit, inspectable, and independently interpretable. |
| New primitive burden | Pass. Predicate Schema is a non-primitive semantic abstraction; Claim structure does not expand. |
| Removability | Predicate Schema is removable only at the cost of semantic ambiguity. A separate Claim-level selector is removable in the tested cases. |
| Twenty-year durability | Pass. Immutable, version-specific predicate identifiers preserve interpretation of historical Claims. |
| Independent implementability | Pass with deterministic Predicate Schema resolution and offline provisioning. |
| Total conceptual complexity | Pass. Predicate-selected semantics avoid a second Claim-level selector while permitting schema composition and shared contracts. |

The result is **A. PREDICATE-SELECTED SEMANTICS SUFFICIENT — NO NEW CLAIM FIELD.**

## 12. Governance and normative home

Predicate Schema is a necessary non-primitive normative abstraction. It does not become a new kernel primitive and does not add a Claim-body field.

No RFC, ADR, or Approved-specification revision is required for this Draft candidate. The accepted ADR-VERIFY-002 envelope already permits semantic fields in `Claim.body`; this Draft does not change its verification boundary. Normal governance applies before this Draft becomes authoritative. A change to an Approved specification would require the RFC, ADR, version-increment, and changelog path defined by Specification Governance.

The correct normative home is a standalone Draft Claim-body field contract: independent implementations need an independently versioned contract for the minimum Claim fields, while Predicate Schemas supply proposition-specific meaning. This Draft remains provisional while it depends on Draft Event and Claim Reference semantics.

## 13. Next artifact

The next artifact is **Claim Predicate Schema Reference Semantics**. It should define the minimum requirements for predicate identifiers, immutable schema binding, versioning, namespace safety, deterministic resolution, offline provisioning, and cross-predicate shared contracts.

It must not create a VE-hosted global registry, a generic reference ontology, a new Claim-body field, or CBOR wire encoding. It must remain separate from RFC-005 representation machinery.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-27 | Initial Draft corrected to the predicate-selected semantic model. |
