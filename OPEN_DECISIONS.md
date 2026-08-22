# Verified Execution — Open Decision Register

## Purpose

This register distinguishes unresolved architectural questions from accepted decisions and from remaining normative specification tasks.

| Identifier | Question | State | Authority | Dependency / next evidence | Disposition |
| --- | --- | --- | --- | --- | --- |
| ENC-001 | What canonical serialization profile applies to byte-sensitive VE kernel objects? | Resolved | ADR-ENC-001-VE-CBOR-1 (Accepted; narrow v0.1 scope) | SPEC-CBOR-001 through SPEC-CBOR-003 | VE-CBOR-1 selected; exact schemas remain tasks. |
| RULE-001 | What portable Rule representation is mandatory for v0.1? | Resolved | ADR-RULE-001-002-VE-CEL-1 (Accepted; narrow v0.1 scope) | SPEC-CEL-001 through SPEC-CEL-004 | VE-CEL-1 selected. |
| RULE-002 | How is Rule execution made deterministic? | Resolved | ADR-RULE-001-002-VE-CEL-1 (Accepted; narrow v0.1 scope) | SPEC-CEL-002 through SPEC-CEL-005 | Side-effect-free VE-CEL-1 with explicit inputs selected. |
| VERIFY-001 | Which verification algorithms/profiles are mandatory to implement? | Open | None | Profile interoperability evidence; future RFC-005 | No mandatory algorithm suite selected. |
| VERIFY-002 | What is the status of detached COSE verification? | Resolved — profile-limited | ADR-VERIFY-002 (Accepted; profile-limited) | Native VE signature framing and record work; future RFC-005 | COSE is optional; it is not the sole VE signature representation. |
| VERIFY-003 | How are verifiers and key material resolved? | Narrowed | ADR-VERIFY-002 | VerificationContext and profile specification work | Kept outside Claim fields and universal key ontology. |
| VERIFY-004 | How is revocation represented and evaluated? | Open | None | Scenario and verification-profile evidence | No architectural selection yet. |
| SIG-001 | What native VE signature-binding frame and minimum Signature Record are required? | Open | KERNEL_VALIDATION.md and signature pressure tests are non-normative evidence | Future RFC-005 | Must reconcile typed framing, object references, and optional profiles. |

## Rules

- An item marked **Resolved** MUST link to an accepted ADR or approved specification.
- A **Narrowed** item is not a settled architectural choice; it records scope that has been excluded from the core.
- Remaining implementability work MUST be listed in SPECIFICATION_TASKS.md rather than duplicated here.
- A new finding MUST NOT alter an accepted decision without an RFC/ADR disposition.
