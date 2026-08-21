# VE-001 Changelog

## v0.2 --- 2026-08-20

**Status:** Approved\
**Change authority:** RFC-004 v0.2; ADR-004\
**Supersedes:** VE-001 v0.1

### Semantic changes

-   Added required `action_digest` as deterministic semantic-content
    identity.
-   Retained `action_id` as immutable historical Action-occurrence
    identity.
-   Established the occurrence/content binding invariant: authoritative
    artifacts depending on a particular occurrence/content association
    MUST bind at least `(action_id, action_digest)`.
-   Explicitly rejected a universal `instance_digest` as a third Action
    identity.
-   Split Action logically into Semantic Payload and Instance Envelope.
-   Added normative `schema_digest` participation in `action_digest`.
-   Reclassified evidentiary creation time as occurrence-level
    information.
-   Removed `initiator` as universally required semantic Action content.
-   Removed `authority_context` as universally required semantic Action
    content.
-   Removed universal semantic `scope`.
-   Made operation, target, destination, and arguments schema-defined
    rather than a universal VE ontology.
-   Clarified that Action-carried Rule, Trust Context, selector, and
    authority references are non-authoritative unless independently
    established.
-   Clarified that same `action_digest` may correspond to multiple
    Action occurrences.
-   Clarified that digest equality does not imply duplicate suppression,
    idempotency, replay permission, authorization, execution, or commit.
-   Added explicit migration requirements for v0.1 Actions.

### Interoperability changes

-   Made canonical Action hashing normative.
-   Required `schema_digest` to identify the exact schema contract.
-   Required a normative Canonical Encoding Profile for byte-for-byte
    cryptographic interoperability.
-   Required the profile to define canonical byte encoding, framing,
    domain separation, digest-suite representation, primitive value
    encoding, ordering, Unicode treatment, numeric representation,
    null/absence semantics, and schema-descriptor canonicalization.
-   Prohibited claims of cryptographic interoperability when
    implementations do not share the same normative profile.

### Primitive impact

No new semantic primitive introduced.

`Actor`, `Resource`, `Scope`, `ActionSchema`, `Instance`, and `Commit`
are not introduced as Action primitives.

### Follow-on dependency

VE-004 Receipt semantics must be revisited after adoption of VE-001 v0.2
to determine the minimum required binding to `action_id` and
`action_digest`.
