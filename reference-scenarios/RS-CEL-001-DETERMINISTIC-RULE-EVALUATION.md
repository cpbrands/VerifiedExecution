---
id: RS-CEL-001
title: Deterministic Rule Evaluation from Eligible Claims
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
  - LYNX-PARTICIPANT-LEVEL-SETTLEMENT-PREDICATE-SCHEMA
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
  - ADR-RULE-001-002
  - ADR-010
related_documents:
  - RS-LYNX-001-SUCCESSFUL-LYNX-INTERBANK-SETTLEMENT
  - RS-LYNX-002
  - RS-CLM-001
  - RS-VERIFY-001
supersedes: null
superseded_by: null
---

# RS-CEL-001 — Deterministic Rule Evaluation from Eligible Claims

## 1. Authority and objective

This document is **non-normative evidence**. It exercises authoritative
[VE-CEL-1 Draft v0.2](../specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md)
end to end using retained repository fixtures. It is a Reference Scenario,
not a second conformance specification, Rule language authority, Predicate
Schema, verification profile, or source of new semantics.

The scenario asks whether independent implementations given the same Action,
explicit immutable eligible-Claim multiset, Rule, and VE-CEL profile construct
the same two bindings and return the same Evaluate outcome regardless of host
Claim input order:

```text
Canonical Action
  -> validated Action semantics
  -> VE-CEL action projection

conforming Claim.body
  + applicable Verify = PASS
  + explicit immutable host selection
  -> eligible Claim multiset
  -> VE-CEL Claim projection
  -> ascending (SHA-256(B), B) order

action + claims + Rule
  -> CEL Boolean
  -> Evaluate outcome
```

The Claim fixtures use deterministic test-only keys. They do not establish a
live payment, settlement evidence, participant identity, or production trust.
The architectural boundary remains:

```text
verified authorship != proposition truth != authorization
```

## 2. Exact authoritative Action fixture

The scenario reuses Action A1 from the Lynx Action Schema and RS-LYNX-001. Its
exact occurrence and content identities are:

```text
action_id =
  h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f'

action_digest =
  h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'

schema_digest =
  h'e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554'
```

Its schema-defined semantic fields are exactly:

```text
amount_minor = 1000000
source_account = {
  servicing_agent_canadian_sort_code: "000100001",
  account_id: "0012345"
}
destination_account = {
  servicing_agent_canadian_sort_code: "000200002",
  account_id: "VENDOR-0001"
}
```

The complete canonical Action is 358 octets. Its exact bytes remain the
authoritative RS-LYNX-001 vector:

```text
a368696e7374616e6365a169616374696f6e5f69645820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f6873656d616e746963a2666669656c6473a36c616d6f756e745f6d696e6f721a000f42406e736f757263655f6163636f756e74a26a6163636f756e745f696467303031323334357822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f6465693030303130303030317364657374696e6174696f6e5f6163636f756e74a26a6163636f756e745f69646b56454e444f522d303030317822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f6465693030303230303030326d736368656d615f6469676573745820e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d3725546d616374696f6e5f64696765737458205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

After Action validation and digest recomputation, both implementations produce
this exact CEL-native projection. Each identity is raw `bytes`, the amount is
a CEL `int`, and all text is exact already-normalized `string` data:

```text
action = {
  "action_id":
    b"\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x7b\x7c\x7d\x7e\x7f",
  "action_digest":
    b"\x5f\xa3\x77\x5f\x8a\x28\x8e\x97\x62\xe0\x21\xba\x8f\xb0\x83\x02\xfb\xb3\x54\x7b\xc1\x5d\x97\x69\xc9\x7b\xbc\xbb\xeb\x33\x0b\x0c",
  "schema_digest":
    b"\xe1\xbd\x2f\x78\x49\xa9\xd0\x81\x08\xc6\x20\xe3\x0d\xed\xe0\x90\x45\xdf\x60\x49\xe0\x90\x9e\x7a\xba\xf2\x2e\x6d\x9d\x37\x25\x54",
  "fields": {
    "amount_minor": 1000000,
    "source_account": {
      "servicing_agent_canadian_sort_code": "000100001",
      "account_id": "0012345"
    },
    "destination_account": {
      "servicing_agent_canadian_sort_code": "000200002",
      "account_id": "VENDOR-0001"
    }
  }
}
```

## 3. Exact Claim fixtures

The base eligible multiset contains three Claim occurrences and three distinct
canonical bodies. `L-A` is the exact RS-LYNX-002 and RS-VERIFY-001 fixture.
`C1` is the exact RS-CLM-001 and reusable verification-profile P1 fixture.
`L-B` changes only the valid normalized issuer of `L-A` to another test-only
Sending Participant and is independently signed under an explicitly
applicable scenario VerificationContext.

All three verification fixtures use the authoritative profile identifier and
external AAD:

```text
profile = urn:ve:verify:claim-body:cose-sign1-ed25519:1
external_aad = VE-KERNEL-CLAIM-V1
```

For exact reproducibility only, they use the repository's deterministic
test-only Ed25519 material:

```text
private seed =
  9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60
public key =
  d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a
```

This material is never a production credential. The scenario VerificationContext
supplies an applicable issuer/key binding for each positive verification.

### 3.1 L-A — Lynx settlement Claim from participant A

```text
subject_reference = {
  action_id:
    h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f',
  action_digest:
    h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'
}
issuer_ref = "lynx-sending-participant-A"
predicate =
  h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82'
value = true
```

`B(L-A)` is the exact 206-octet canonical Claim body:

```text
a46576616c7565f569707265646963617465582103308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f826a6973737565725f726566781a6c796e782d73656e64696e672d7061727469636970616e742d41717375626a6563745f7265666572656e6365837819416374696f6e4f6363757272656e63655265666572656e63655820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f58205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

```text
D(L-A) = SHA-256(B(L-A))
       = 507b4be06e4ee9e4b5e1d827c53f6adc8be086e41819135ee8f8b65dffe55300
Verify(L-A) = PASS
```

Its exact canonical detached `COSE_Sign1` verification artifact is:

```text
8443a10127a0f6584006f2dd9ebe7b2a8a2fb82648a59fd8f4643a33ff6aee158ca392411f05d5ef26372569b97bb1179eb52bab6efc92e7e71e540879448337bb17c303dea1c0ed02
```

### 3.2 L-B — same Predicate and subject, different issuer

```text
subject_reference = {
  action_id:
    h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f',
  action_digest:
    h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c'
}
issuer_ref = "lynx-sending-participant-B"
predicate =
  h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82'
value = true
```

`B(L-B)` is the exact 206-octet canonical Claim body:

```text
a46576616c7565f569707265646963617465582103308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f826a6973737565725f726566781a6c796e782d73656e64696e672d7061727469636970616e742d42717375626a6563745f7265666572656e6365837819416374696f6e4f6363757272656e63655265666572656e63655820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f58205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

```text
D(L-B) = SHA-256(B(L-B))
       = 25f275a2c7b9c57c87973da3e9712a9923f57a17234a23fb361bbc6a89bbf9a7
Verify(L-B) = PASS
```

The deterministic test-only signature and canonical artifact are:

```text
signature =
  h'9ba8e64a99769d2002f4ee7db37ba962d04fd6ca8ae9ab85db5978dc958b9b3ef25cefa6f71645898df36c0756ed53c300f3ac0454343534c9957715067ffe0a'

artifact =
  h'8443a10127a0f658409ba8e64a99769d2002f4ee7db37ba962d04fd6ca8ae9ab85db5978dc958b9b3ef25cefa6f71645898df36c0756ed53c300f3ac0454343534c9957715067ffe0a'
```

The scenario VerificationContext explicitly binds issuer B to the test public
key for this Predicate and Action context. This fixture demonstrates portable
input mechanics; it does not assert participant B's proposition is true.

### 3.3 C1 — different-Predicate bank Claim

```text
subject_reference = {
  action_digest:
    h'202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f'
}
issuer_ref = "bank-A"
predicate =
  h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2'
value = true
```

`B(C1)` is the exact 147-octet canonical Claim body:

```text
a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e63658276416374696f6e436f6e74656e745265666572656e63655820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

```text
D(C1) = SHA-256(B(C1))
      = 8bd3f23fa3ba3dd7a5169a520b8fe62c3242efe399e50b510c8dcd94e92b7d91
Verify(C1) = PASS
```

Its exact canonical detached verification artifact is:

```text
8443a10127a0f65840183536f0b2c580a35ab39ff34fe6f4ef7fa9fcfb081c87b2da6299c270b9f58cefb4ea33a447737cac648f703b6eac470affe3a69f48a9209572006b8d01ed08
```

## 4. Eligibility boundary

All three base occurrences enter because each independently satisfies all
three VE-CEL eligibility conditions:

| Claim | Conforming exact body | Applicable Verify | Explicit immutable host selection | Eligible |
|---|---|---|---|---|
| L-A | yes | `PASS` | selected | yes |
| L-B | yes | `PASS` | selected | yes |
| C1 | yes | `PASS` | selected | yes |

VE-CEL performs none of those verification operations. It receives the exact
immutable selected multiset only after those gates close.

`L-A-bad` reuses the otherwise satisfying L-A body but flips the final artifact
octet from `02` to `03`. Under the applicable Claim verification profile its
outcome is `AUTHENTICATION_FAILED`. It is not eligible, never enters the
multiset, is never projected, and is never visible to the Rule. The Rule source
does not determine or override that exclusion.

## 5. Exact Claim projection

Each eligible body becomes exactly one four-member CEL map. Verification
profile, artifact, key, ordering digest, evidence, time, and host metadata are
absent:

```text
L-A -> {
  "subject_reference": {
    "action_id": b"\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x7b\x7c\x7d\x7e\x7f",
    "action_digest": b"\x5f\xa3\x77\x5f\x8a\x28\x8e\x97\x62\xe0\x21\xba\x8f\xb0\x83\x02\xfb\xb3\x54\x7b\xc1\x5d\x97\x69\xc9\x7b\xbc\xbb\xeb\x33\x0b\x0c"
  },
  "issuer_ref": "lynx-sending-participant-A",
  "predicate": b"\x03\x30\x8b\xb6\x70\xd8\x5b\x24\x31\xc9\x1c\xc0\xfe\x2f\x38\xe1\x06\x78\xe4\x8c\x6a\xe2\x3f\x9b\xe3\xdb\x21\xd5\xc4\x91\xce\x5f\x82",
  "value": true
}

L-B -> same exact subject_reference, predicate, and value as L-A, with:
  "issuer_ref": "lynx-sending-participant-B"

C1 -> {
  "subject_reference": {
    "action_digest": b"\x20\x21\x22\x23\x24\x25\x26\x27\x28\x29\x2a\x2b\x2c\x2d\x2e\x2f\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3a\x3b\x3c\x3d\x3e\x3f"
  },
  "issuer_ref": "bank-A",
  "predicate": b"\x03\xcf\xd1\x1f\xb2\x76\x84\xb5\x1c\xa1\x91\xd1\xc1\xa3\x9b\x11\xf6\x21\x80\xc6\xc2\xe9\xd4\xfc\xac\x7b\xf2\xda\xbb\x54\x2d\xe3\xf2",
  "value": true
}
```

## 6. Deterministic ordering

VE-CEL forms `(D, B)` for every eligible occurrence and sorts ascending by
unsigned octets. The distinct digest prefixes already determine this fixture:

```text
L-B: 25f275a2...
L-A: 507b4be0...
C1:  8bd3f23f...
```

Therefore all six host permutations produce the exact same binding order:

| Host input | Exact VE-CEL `claims` order |
|---|---|
| `[L-A, L-B, C1]` | `[L-B, L-A, C1]` |
| `[L-A, C1, L-B]` | `[L-B, L-A, C1]` |
| `[L-B, L-A, C1]` | `[L-B, L-A, C1]` |
| `[L-B, C1, L-A]` | `[L-B, L-A, C1]` |
| `[C1, L-A, L-B]` | `[L-B, L-A, C1]` |
| `[C1, L-B, L-A]` | `[L-B, L-A, C1]` |

No host order remains in the CEL activation. The digest is ordering-only and
is not a projected Claim field or Claim identity.

As a cardinality extension, the selected multiset `[L-A, L-A, L-B, C1]`
always produces `[L-B, L-A, L-A, C1]`. Both byte-identical L-A occurrences
remain. VE-CEL does not deduplicate them.

## 7. Exact Rule

The Rule expresses one bounded policy: the presented A1 Action is acceptable
only if its amount and occurrence identities match and there exists a Claim
under the concrete Lynx participant-level settlement Predicate, from test
issuer A, for that exact Action occurrence, with the Predicate's only admitted
value `true`.

The exact CEL source is:

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

The Predicate-sensitive issuer and value reads occur after an exact 33-octet
literal PSCID guard for the same comprehension variable in the same maximal
`&&` chain. The Rule uses no cross-Predicate value operation and returns a CEL
Boolean.

## 8. Positive evaluation

The positive path supplies exact A1 and the explicitly selected multiset
`{L-A, L-B, C1}`. Both independent builders construct the Section 2 `action`
map and Section 6 ordered list `[L-B, L-A, C1]`. The Rule examines all three
eligible Claims without allowing host order to affect them. L-A satisfies the
literal-guarded issuer, occurrence, and value conditions.

```text
CEL result = true
Evaluate outcome = SATISFIED
```

CEL-C++ through `cel-expr-python 0.1.3` and the independent `cel-python 0.5.0`
both parsed, checked, and evaluated the exact source and activation to `true`.
Library names are validation evidence; VE-CEL's pinned CEL snapshot remains
the language authority.

## 9. Policy-negative evaluation

The policy-negative input changes exactly one legitimate host selection: L-A
is not selected for this invocation. L-B and C1 remain conforming, successfully
verified, and explicitly selected. They sort to `[L-B, C1]`. The Rule remains
valid and executes normally, but no Claim from the required issuer A remains.

```text
CEL result = false
Evaluate outcome = NOT_SATISFIED
```

Both CEL engines returned `false`. This is a policy outcome, not malformed
input, a verification failure, `INDETERMINATE`, or `EVALUATION_ERROR`.

## 10. Verification-boundary case

Replace the selected L-A occurrence with `L-A-bad`, whose body is unchanged but
whose final signature octet is mutated. Verification returns
`AUTHENTICATION_FAILED`; therefore L-A-bad never enters the eligible multiset.
The remaining eligible Claims are exactly L-B and C1, ordered `[L-B, C1]`.

```text
Verify(L-A-bad) = AUTHENTICATION_FAILED
L-A-bad in CEL claims = no
CEL result from remaining eligible Claims = false
Evaluate outcome = NOT_SATISFIED
```

VE-CEL does not translate the verification failure into an evaluation error.
Successful Verify is a pre-Evaluate eligibility gate, and the Rule cannot see
or recover the excluded body.

## 11. Host-order attack

An attacker supplies `[C1, L-A, L-B]`, placing C1 first and satisfying L-A in
the middle, rather than `[L-B, L-A, C1]`. The builder recomputes each ordering
key and emits the same exact ordered list `[L-B, L-A, C1]`. The complete
activation and result remain byte/value-equivalent to the positive case:

```text
ordered claims unchanged = yes
CEL result = true
Evaluate outcome = SATISFIED
```

All six permutations were exercised with the same result.

## 12. Same-Predicate issuer distinction and duplicate preservation

L-A and L-B are both successfully verified eligible Claims under the same
Predicate for the same Action occurrence with value `true`, but their issuers
differ. Both remain visible. VE-CEL does not decide which issuer is truthful,
preferred, or authoritative and does not merge them. The Rule makes the policy
choice explicitly by requiring participant A.

The ordered positions also permit this exact same-Predicate comparison probe:

```cel
claims[0].predicate == b"\x03\x30\x8b\xb6\x70\xd8\x5b\x24\x31\xc9\x1c\xc0\xfe\x2f\x38\xe1\x06\x78\xe4\x8c\x6a\xe2\x3f\x9b\xe3\xdb\x21\xd5\xc4\x91\xce\x5f\x82" &&
claims[1].predicate == b"\x03\x30\x8b\xb6\x70\xd8\x5b\x24\x31\xc9\x1c\xc0\xfe\x2f\x38\xe1\x06\x78\xe4\x8c\x6a\xe2\x3f\x9b\xe3\xdb\x21\xd5\xc4\x91\xce\x5f\x82" &&
claims[0].value == claims[1].value
```

Both terms have earlier guards selecting the same retained Predicate. Both CEL
engines return `true`. This proves only governed same-Predicate value equality;
it does not reconcile issuers or establish either proposition as true.

The duplicate extension likewise preserves both L-A occurrences. The Rule's
Boolean result stays `true`, but the activation cardinality increases from
three to four. Claim transport and deterministic ordering belong to VE-CEL;
issuer choice belongs to the Rule; truth reconciliation is not performed.

## 13. Different-Predicate profile case

L-A and C1 both project the CEL value `true`, but their PSCIDs and governed
semantics differ. With the base ordered list, this exact bounded variant tries
to compare those two values:

```cel
claims[1].predicate == b"\x03\x30\x8b\xb6\x70\xd8\x5b\x24\x31\xc9\x1c\xc0\xfe\x2f\x38\xe1\x06\x78\xe4\x8c\x6a\xe2\x3f\x9b\xe3\xdb\x21\xd5\xc4\x91\xce\x5f\x82" &&
claims[2].predicate == b"\x03\xcf\xd1\x1f\xb2\x76\x84\xb5\x1c\xa1\x91\xd1\xc1\xa3\x9b\x11\xf6\x21\x80\xc6\xc2\xe9\xd4\xfc\xac\x7b\xf2\xda\xbb\x54\x2d\xe3\xf2" &&
claims[1].value == claims[2].value
```

VE-CEL Draft v0.2 rejects this during static profile validation:

```text
Evaluate outcome = EVALUATION_ERROR
```

This is an unsupported cross-Predicate operation in this VE-CEL profile. It
does not declare different PSCIDs inherently `NOT COMPARABLE`, does not issue
a Predicate comparison result, and does not modify ADR-010.

## 14. Literal-guard error case

This exact Rule variant reads a Predicate-sensitive field without the required
literal PSCID guard:

```cel
claims.exists(c, c.value == true)
```

The deterministic pre-evaluation AST rule rejects it before CEL type checking
or evaluation:

```text
Evaluate outcome = EVALUATION_ERROR
```

No second error taxonomy is created; this is the existing VE-CEL profile-error
mapping.

## 15. Outcome ownership

| Stage | Owner and result in this scenario |
|---|---|
| Verify | The Claim verification profile and applicable VerificationContext establish exact-body cryptographic authorship or a defined non-PASS result. They do not establish truth. |
| Eligibility selection | The surrounding Evaluate/host context supplies the explicit immutable subset after conformance and verification. The Rule does not choose eligibility. |
| VE-CEL | VE-CEL validates and projects exactly `action` and `claims`, orders every occurrence, enforces the bounded Rule profile, and executes permitted CEL. |
| Rule | The Rule expresses the policy requiring the exact Action occurrence, concrete Predicate, issuer A, and `true` value. |
| Evaluate | Evaluate owns `SATISFIED`, `NOT_SATISFIED`, `INDETERMINATE`, and `EVALUATION_ERROR`. This scenario exercises the first, second, and fourth. |

The boundaries are deliberately not collapsed. In particular, `Verify = PASS`
does not mean the Rule is satisfied, the Claim is true, or execution is
authorized.

## 16. Independent reconstruction

Two isolated harnesses implemented canonical CBOR, SHA-256 ordering, Action
projection, Claim projection, immutable host selection, and outcome mapping.
They shared the semantic fixture descriptions, not serialized intermediate
objects or precomputed builder output.

The Python harness independently reproduced the published L-A and C1 bodies,
ordering keys, signatures, and artifacts, then derived L-B. The Node harness
did the same using its own encoder and cryptographic implementation. Both
obtained:

```text
L-B body length = 206
L-B ordering key =
  25f275a2c7b9c57c87973da3e9712a9923f57a17234a23fb361bbc6a89bbf9a7
L-A ordering key =
  507b4be06e4ee9e4b5e1d827c53f6adc8be086e41819135ee8f8b65dffe55300
C1 ordering key =
  8bd3f23fa3ba3dd7a5169a520b8fe62c3242efe399e50b510c8dcd94e92b7d91
ordered Claims = [L-B, L-A, C1]
positive CEL Boolean = true
positive Evaluate outcome = SATISFIED
policy-negative CEL Boolean = false
policy-negative Evaluate outcome = NOT_SATISFIED
```

All six host permutations converged. The duplicate extension retained four
occurrences. CEL-C++ and `cel-python` independently returned the same positive
and negative Booleans from the exact Rule source and activations.

## 17. Scenario assertions

This scenario establishes only:

1. authoritative canonical Action semantics project deterministically;
2. eligible successfully verified Claims project deterministically;
3. host Claim input order cannot alter the Rule environment;
4. duplicate occurrences and same-Predicate different-issuer Claims remain
   visible rather than being reconciled;
5. a verification failure prevents a Claim from reaching CEL;
6. Rule policy remains distinct from Claim verification and eligibility;
7. identical CEL values under different Predicates do not erase Predicate
   identity or bypass the profile restriction; and
8. independent implementations obtain the same Rule/Evaluate results.

It does **not** establish Claim truth, settlement evidence authenticity,
execution, an Execution Right, participant authorization, settlement, Event,
or Receipt existence.

## 18. Gap probes for subsequent analysis

The later Gap Analysis should ask, without changing architecture here:

1. Can two independent teams build identical Rule input from this scenario?
2. Can they obtain the same Evaluate outcome?
3. Does any missing semantic representation remain?
4. Is eligible-Claim selection sufficiently owned by existing Evaluate
   semantics?
5. Is portable Rule identity or versioning required?
6. Is evaluation-result identity or representation required?
7. Is Rule compilation or validation-artifact portability required?
8. Are Event or Receipt representations now implicated?
9. Does actual Execution Right issuance require a Rule-result binding?
10. Is any new primitive exposed?

## 19. Findings and governance

The scenario is complete using current authoritative fixtures and VE-CEL Draft
v0.2. It exposes no conflict that requires changing VE-CEL, Claim, Predicate,
Action, verification, Rule, or Evaluate semantics. The questions in Section 18
remain inputs to the separate Gap Analysis rather than conclusions smuggled
into this evidence artifact.

```text
reference scenario only = YES
non-normative = YES
new primitive = NO
RFC required = NO
ADR required = NO
specification revision required = NO
GAP ANALYSIS READY = YES
```

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial non-normative scenario exercising deterministic Action and eligible-Claim projection, digest ordering, Rule execution, eligibility, verification, host-order, issuer, duplicate, cross-Predicate, and profile-error boundaries under VE-CEL-1 Draft v0.2. |
