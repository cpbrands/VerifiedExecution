---
id: RS-RULE-001
title: Canonical Rule Representation and Content Identity in Evaluation
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-13
updated: 2026-09-13
depends_on:
  - VE-CBOR-1-RULE-REPRESENTATION-AND-CONTENT-IDENTITY
  - VE-CEL-1-SEMANTIC-PROFILE-001
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - ADR-013
  - ADR-RULE-001-002
  - ADR-ENC-001
related_documents:
  - RS-CEL-001
  - GAP-ANALYSIS-RS-CEL-001-DETERMINISTIC-RULE-EVALUATION
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
supersedes: null
superseded_by: null
---

# RS-RULE-001 — Canonical Rule Representation and Content Identity in Evaluation

## 1. Status, authority, and objective

This document is **non-normative evidence** against the Draft v0.1
[canonical Rule representation and content-identity specification](../specifications/VE-CBOR-1-RULE-REPRESENTATION-AND-CONTENT-IDENTITY.md).
It applies that specification to the already-authoritative
[RS-CEL-001](RS-CEL-001-DETERMINISTIC-RULE-EVALUATION.md) flow. It is not a
second Rule, VE-CBOR-1, semantic-profile, content-identity, authorization, or
Execution Right specification.

The scenario asks whether two independent implementations can identify the
exact Rule artifact that is evaluated while preserving every existing owner:

```text
three-field Rule semantic object
  -> generic representation validity
  -> canonical Rule bytes
  -> exact-artifact Rule digest
  -> semantic-profile resolution
  -> semantic-profile conformance
  -> action + eligible claims
  -> Evaluate
```

The tested separation is:

```text
Rule content identity != semantic validity
Rule identity != Rule legitimacy
Evaluate result != authorization decision != Execution Right issuance
```

The Action, Claims, keys, and issuers are deterministic test fixtures. Nothing
in this scenario establishes a live payment, settlement truth, participant
authority, production trust, or permission to execute.

## 2. Exact reused VE flow

The scenario reuses the RS-CEL-001 Action A1 and eligible Claim multiset
without changing their semantics or encodings.

The Action occurrence is:

```text
action_id =
  h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f'

action_digest =
  h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'

schema_digest =
  h'e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554'

amount_minor = 1000000
```

The exact eligible multiset is `{L-A, L-B, C1}`. Each body is conforming,
each applicable Claim verification returns `PASS`, and the Evaluate caller
explicitly selects all three occurrences. Their canonical-body ordering keys
remain:

```text
L-B = 25f275a2c7b9c57c87973da3e9712a9923f57a17234a23fb361bbc6a89bbf9a7
L-A = 507b4be06e4ee9e4b5e1d827c53f6adc8be086e41819135ee8f8b65dffe55300
C1  = 8bd3f23fa3ba3dd7a5169a520b8fe62c3242efe399e50b510c8dcd94e92b7d91
```

VE-CEL therefore projects the same ordered Claim list for every host input
permutation:

```text
[L-B, L-A, C1]
```

The Rule digest is independent of the Action, Claim multiset, Claim order,
verification artifacts, and Evaluate result. It binds only the Rule artifact.

## 3. Step A — receive the Rule semantic object

The semantic object is exactly:

```text
Rule {
  language: "VE-CEL-1",
  semantics_version: "001",
  source: <the exact source below>
}
```

It has no Rule `id`, Rule release `version`, `input_contract`,
`output_contract`, author, issuer, approver, timestamp, trust metadata, or
occurrence identity.

The exact 714-octet UTF-8 source contains nine lines separated by eight LF
octets and has no terminal LF:

```cel
action.fields.amount_minor == 1000000 &&
action.action_id == b"\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x7b\x7c\x7d\x7e\x7f" &&
action.action_digest == b"\x5f\xa3\x77\x5f\x8a\x28\x8e\x97\x62\xe0\x21\xba\x8f\xb0\x83\x02\xfb\xb3\x54\x7b\xc1\x5d\x97\x69\xc9\x7b\xbc\xbb\xeb\x33\x0b\x0c" &&
claims.exists(c,
  c.predicate == b"\x03\x30\x8b\xb6\x70\xd8\x5b\x24\x31\xc9\x1c\xc0\xfe\x2f\x38\xe1\x06\x78\xe4\x8c\x6a\xe2\x3f\x9b\xe3\xdb\x21\xd5\xc4\x91\xce\x5f\x82" &&
  c.issuer_ref == "lynx-sending-participant-A" &&
  c.subject_reference.action_id == action.action_id &&
  c.subject_reference.action_digest == action.action_digest &&
  c.value == true)
```

## 4. Steps B and C — representation and content identity

Generic representation validation checks only that the closed three-member
map contains the required text fields, each text value is valid UTF-8 and
already NFC, and the exact source is preserved. It performs no CEL parsing,
profile resolution, trimming, normalization, line-ending translation, or
parse/reserialize transformation.

The canonical VE-CBOR-1 map key order is independently derived from the
encoded keys:

```text
1. source
2. language
3. semantics_version
```

Independent builders obtain:

```text
canonical_rule_bytes length = 765
```

Before profile resolution or evaluation, each builder constructs:

```text
RuleContentFrameV1 = [
  "VE-RULE-CONTENT",
  1,
  bstr(canonical_rule_bytes)
]

rule_digest = SHA-256(VE-CBOR-1(RuleContentFrameV1))
```

The result is:

```text
digest-frame length = 786
rule_digest =
  86ec5cc99b17d49f00e0f3f05172164787e39ff28d59ee4575f661273120b247
```

At this point the exact canonical Rule artifact has content identity. No claim
has yet been made about profile existence, source conformance, evaluability,
legitimacy, applicability, or authorization.

## 5. Steps D and E — resolve and validate profile 001

The exact pair:

```text
(VE-CEL-1, 001)
```

resolves to the Approved
[VE-CEL-1 Semantic Profile 001](../specifications/VE-CEL-1-SEMANTIC-PROFILE-001.md).
The implementation then applies the profile-owned source constraints,
including:

- the frozen Unicode 15.0.0 assigned-character repertoire;
- the 16,384-octet source maximum; and
- the pinned VE-CEL source, syntax, profile, and resource rules.

The exact 714-octet R1 source passes semantic-profile conformance.

```text
profile resolution = PASS
profile conformance = PASS
```

These checks occur after construction of canonical artifact identity. They do
not contribute bytes to `canonical_rule_bytes` or the digest frame.

## 6. Steps F and G — construct inputs and Evaluate

VE-CEL receives exactly two immutable top-level bindings:

```text
action
claims
```

The `action` binding carries the exact A1 occurrence and semantic projection.
The `claims` binding is the exact `[L-B, L-A, C1]` projection. Neither binding
contains `rule_digest`, Rule source, `language`, `semantics_version`, policy
metadata, authorization state, or an Execution Right. No third binding named
`rule`, `rule_digest`, `policy`, `authorization`, or `execution_right` exists.

The selected Rule determines which CEL expression is compiled and executed;
its identity is metadata about that exact selected artifact, not data exposed
to the expression.

L-A satisfies the exact literal Predicate guard, issuer, Action occurrence,
and Boolean value conditions. Both independent executions obtain:

```text
CEL Boolean = true
Evaluate outcome = SATISFIED
```

All six permutations of `{L-A, L-B, C1}` first converge to
`[L-B, L-A, C1]` and then return `SATISFIED`. Rule identity remains constant
because it does not depend on host Claim order or any Evaluate input.

## 7. Step H — report which Rule artifact was evaluated

An implementation may report this non-normative diagnostic association:

```text
evaluated_rule_digest =
  86ec5cc99b17d49f00e0f3f05172164787e39ff28d59ee4575f661273120b247
Evaluate outcome = SATISFIED
```

This scenario does not standardize a report, Receipt, Event, or evidence
schema. It does not require that Rule identity be carried in an authorization
decision or Execution Right. Whether a future downstream report or Receipt
records Rule identity remains outside this scenario.

## 8. Exact-artifact mutation — R2

R2 adds one ASCII space immediately before the first `&&` in the R1 source.
No other field or source character changes. The 715-octet source remains valid
under profile `001`; its canonical Rule encoding is 766 octets.

Independent builders obtain:

```text
R2 rule_digest =
  c560c729aa75def9b982027ec96e156169e4e46bf2faea9c6dccd3772d0d9b25

R2 profile resolution = PASS
R2 profile conformance = PASS
R2 CEL Boolean = true
R2 Evaluate outcome = SATISFIED
```

R1 and R2 produce the same logical result but have different canonical bytes
and different Rule digests. Behavioral equivalence does not define Rule
artifact identity.

## 9. Unresolved semantic profile — R3

R3 changes only `semantics_version` from text `001` to text `002`. The source
remains valid UTF-8/NFC representation data. Profile `002` is not allocated by
current authority.

```text
structurally encodable = YES
canonical Rule artifact = YES
Rule digest =
  9ff8af18f0e64b3f47bb6e086cd8c0a6cc7e0eb5bdc985591319d752eff284e2
semantic profile resolved = NO
profile conformance established = NO
evaluable = NO
attempted Evaluate outcome = EVALUATION_ERROR
```

The implementation does not substitute profile `001`, a mutable latest
profile, or a nearby version. R3 is not asserted to be semantically valid.
Its valid content identity establishes only which representation-valid
artifact was presented.

## 10. Resolved profile with nonconforming source — R6

R6 appends U+1CC00 to the exact R1 source. The resulting text is valid UTF-8
and NFC, so it remains representation-valid and receives canonical bytes and
a Rule digest. The pair remains `(VE-CEL-1, 001)` and resolves successfully.

U+1CC00 was unassigned in the Unicode 15.0.0 repertoire frozen by profile
`001`. Profile conformance therefore fails before parsing or evaluation:

```text
structurally encodable = YES
canonical Rule artifact = YES
Rule digest exists = YES
semantic profile resolved = YES
profile conformance = FAIL
evaluable = NO
attempted Evaluate outcome = EVALUATION_ERROR
```

Semantic rejection does not retroactively erase the exact artifact identity.
The digest can identify which rejected artifact was presented without making
that artifact semantically conforming.

## 11. Noncanonical presented encoding — R7

R7 encodes the same three semantic members as R1 but places `language` before
`source`, violating VE-CBOR-1 encoded-key order. The presented bytes are one
complete, otherwise decodable CBOR map.

```text
presented artifact canonical = NO
presented artifact accepted = NO
accepted canonical Rule bytes for the presented encoding = NO
Rule digest over the presented encoding = NO
```

A decoder may separately recover the semantic values and construct their
canonical encoding. That separately constructed artifact is R1 and receives
the R1 digest; it does not make the rejected R7 bytes canonical and does not
turn those presented bytes into the input to Rule content identity.

## 12. Rule identity is not legitimacy

This scenario assumes an external policy or governance mechanism selected the
Rule. It neither defines nor proves that mechanism. The R1 digest establishes
none of the following:

- who authored or approved the Rule;
- which organization selected it;
- whether a Root Authority recognizes it;
- whether it is current or applicable to A1;
- whether using it is legitimate;
- whether its inputs are factually true; or
- whether it authorizes execution.

```text
Rule identity != Rule legitimacy
```

No signature, issuer, approver, policy catalog, trust context, registry, or
applicability field is added to Rule or its content digest.

## 13. Evaluate is not authorization

The positive flow stops at `SATISFIED`. The result says only that the selected
Rule returned `true` for the exact Evaluate inputs under its resolved profile.

```text
Evaluate result != authorization decision != Execution Right issuance
```

No `EvaluationReceipt`, `RuleEvaluation`, `RuleEvaluationRecord`, `RuleMatch`,
`PolicyDecision`, `RuleExecution`, or `EvaluationAttempt` kernel primitive is
introduced. A local diagnostic may associate a digest and outcome, but this
scenario standardizes no portable result or reporting object.

## 14. Execution Right regression

Execution Right remains exactly:

```text
(action_id, action_digest)
```

`rule_digest`, Rule source, `language`, `semantics_version`, and Evaluate
outcome are not added to it. Rule artifact identity therefore does not modify
the existing authorization snapshot or execution-boundary semantics.

## 15. Independent reconstruction and replay

Two independent harnesses started from the semantic Rule fields and the
RS-CEL-001 semantic Action/Claim fixtures. Neither consumed the other
implementation's serialized Rule output.

The Python implementation independently encoded the Rule map and digest frame
and used the existing RS-CEL-001 CEL execution fixture. The Node implementation
used a separately written encoder, frame builder, projection, and evaluation
check. Both obtained:

```text
R1 source length = 714
R1 canonical Rule length = 765
R1 digest-frame length = 786
R1 digest = 86ec5cc99b17d49f00e0f3f05172164787e39ff28d59ee4575f661273120b247
R1 profile resolution = PASS
R1 profile conformance = PASS
R1 Evaluate outcome = SATISFIED

R2 canonical Rule length = 766
R2 digest = c560c729aa75def9b982027ec96e156169e4e46bf2faea9c6dccd3772d0d9b25
R2 Evaluate outcome = SATISFIED

R3 digest = 9ff8af18f0e64b3f47bb6e086cd8c0a6cc7e0eb5bdc985591319d752eff284e2
R3 profile resolution = FAIL
R3 attempted Evaluate outcome = EVALUATION_ERROR

R6 canonical artifact and digest exist = YES
R6 profile resolution = PASS
R6 profile conformance = FAIL
R6 attempted Evaluate outcome = EVALUATION_ERROR
```

Both implementations verified that the CEL activation has exactly the keys
`action` and `claims`. Adding the diagnostic Rule digest to local reporting did
not change either activation or evaluation result. All six Claim input
permutations produced the same ordered list and `SATISFIED` result.

## 16. Scenario invariants

| Invariant | Demonstrated result |
|---|---|
| I1. Same exact Rule artifact produces the same `rule_digest`. | **PASS.** Independent R1 encoders converge. |
| I2. Different exact Rule artifacts produce different digests in the tested vectors. | **PASS.** R1, R2, R3, and R6 are distinct. |
| I3. Same behavior does not imply the same Rule identity. | **PASS.** R1 and R2 both return `SATISFIED` but have different digests. |
| I4. Content identity can exist without semantic-profile resolution. | **PASS.** R3 has canonical identity while profile `002` is unresolved. |
| I5. Content identity can exist for a profile-nonconforming artifact. | **PASS.** R6 retains identity after profile-001 rejection. |
| I6. Representation-invalid input has no accepted canonical artifact identity. | **PASS.** R7 presented bytes are rejected rather than normalized into identity. |
| I7. Rule identity does not establish Rule legitimacy. | **PASS.** Selection, approval, and applicability remain external. |
| I8. Rule digest is not a CEL input. | **PASS.** The activation contains only `action` and `claims`. |
| I9. `SATISFIED` does not itself authorize execution. | **PASS.** The flow stops before authorization. |
| I10. Execution Right remains `(action_id, action_digest)`. | **PASS.** No Rule or result field is added. |

**Result: 10/10 PASS.**

## 17. Pressure-case ownership

| Case | Result | Existing owner |
|---|---|---|
| Exact R1 Rule | Canonical identity, profile conformance, and `SATISFIED` | Rule representation profile, semantic profile, VE-CEL |
| Behavior-equivalent R2 Rule | Distinct identity and same `SATISFIED` outcome | Exact-artifact Rule identity |
| Unresolved R3 profile | Identity exists; `EVALUATION_ERROR` | Profile resolution / Evaluate |
| Profile-nonconforming R6 source | Identity exists; `EVALUATION_ERROR` | Semantic-profile conformance / Evaluate |
| Noncanonical R7 encoding | Presented artifact rejected without identity | VE-CBOR-1 / Rule representation profile |
| Rule selection and applicability | Assumed, not established | External policy/governance |
| Claim verification and eligibility | Completed before VE-CEL projection | Claim verification / Evaluate caller |
| Rule result | `SATISFIED`, not authorization | Evaluate |
| Authorization and issuance | Not performed | Existing authorization authority / VE-014 |
| Execution and reporting | Not performed or standardized | Execution Boundary / downstream Event or Receipt work |

No case requires a new primitive or changes ownership.

## 18. Gap probes for subsequent analysis

The following Gap Analysis should ask, without answering them normatively
here:

1. Is the canonical Rule representation independently portable in a complete
   VE flow?
2. Does exact Rule content identity close the gap found after RS-CEL-001?
3. Is profile-independent artifact identity sufficient for unresolved and
   rejected Rule evidence?
4. Is any portable Rule-selection, approval, or applicability artifact now
   justified?
5. Does any authorization record need Rule provenance without changing
   Execution Right?
6. Is a portable Evaluate-result representation required?
7. Is Rule identity justified in a future Event, Receipt, or audit artifact?
8. Is any new primitive, RFC, ADR, or specification revision exposed?

## 19. Findings and governance

The scenario completes the Reference Scenario step for the Draft v0.1 Rule
representation/content-identity specification. It demonstrates the intended
five-layer ordering in a real Evaluate flow and observes no architectural
conflict.

```text
reference scenario only = YES
non-normative = YES
architecture gap observed = NO
new primitive = NO
architecture change = NO
RFC required = NO
ADR required = NO
specification revision required = NO
GAP ANALYSIS READY = YES
```

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-13 | Initial non-normative scenario applying canonical Rule representation and exact-artifact content identity to the RS-CEL-001 evaluation flow, including behavior-equivalent, unresolved-profile, profile-nonconforming, and noncanonical-wire cases. |
