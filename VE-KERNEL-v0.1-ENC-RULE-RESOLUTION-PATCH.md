# VE Kernel Protocol v0.1 — Resolution Patch for ENC-001 and RULE-001/002

## Resolved decisions

### ENC-001 — Canonical serialization

**RESOLVED:** `VE-CBOR-1`

VE Kernel Protocol v0.1 canonical objects use a strict deterministic CBOR profile based on RFC 8949 Core Deterministic Encoding, with duplicate-key rejection, NFC text, text-only map keys, no indefinite lengths, no floating point, and no unregistered semantic tags.

Canonical VE bytes are the sole bytes used for content digests and signatures.

### RULE-001 — Portable Rule representation

**RESOLVED:** `VE-CEL-1`

The mandatory portable v0.1 Rule format is a constrained Common Expression Language profile. The canonical Rule object contains exact CEL source plus the input/output contract and semantics-version identifier.

### RULE-002 — Deterministic Rule execution

**RESOLVED:** `VE-CEL-1` evaluation is side-effect-free and receives no hidden inputs. It has no network/filesystem/clock/randomness/environment access and no unstandardized custom host functions. External reality enters only through the canonical Action and successfully verified Claims.

The v0.1 Rule result is Boolean. Evaluate maps it to the protocol outcome:
- true -> SATISFIED
- false -> NOT_SATISFIED
- missing/unknown required input -> INDETERMINATE
- evaluation/profile error -> EVALUATION_ERROR

Only SATISFIED can support an affirmative authorization Claim.

## Newly exposed specification tasks

These are no longer architectural forks; they are normative specification work:

1. Define the exact VE-CBOR-1 CBOR-to-semantic-value schema.
2. Assign canonical Action/Claim/Rule map fields.
3. Define the exact scaled-integer convention for fractional domain quantities.
4. Pin `VE-CEL-1` to a specific CEL language semantics release.
5. Define the exact Action -> CEL value mapping.
6. Define the exact verified Claim -> CEL value mapping.
7. Define CEL feature/operator allowlist for VE-CEL-1.
8. Define normative evaluation resource limits/cost ceiling.
9. Add cross-language canonical-byte and CEL-evaluation test vectors.
