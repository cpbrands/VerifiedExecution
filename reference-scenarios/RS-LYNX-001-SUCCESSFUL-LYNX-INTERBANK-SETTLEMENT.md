---
id: RS-LYNX-001-SUCCESSFUL-LYNX-INTERBANK-SETTLEMENT
title: Successful Lynx UG2026 CAD Customer Credit Transfer Interbank Settlement
version: "0.1"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-10
updated: 2026-09-10
depends_on:
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - VE-014
  - VE-014-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
related_documents:
  - VE-001
  - ADR-011
  - RFC-011
  - RS-002
  - RS-003
  - RS-ER-004-VE014-VERIFICATION-END-TO-END
  - KERNEL-GAP-ANALYSIS-0.2
supersedes: null
superseded_by: null
---

# RS-LYNX-001 — Successful Lynx UG2026 CAD Customer Credit Transfer Interbank Settlement

## 1. Authority, question, and honest simulation boundary

This is **non-normative execution evidence**: a specification-based simulation
and a reproducible local Action/Execution Right test, not evidence of a live
payment. It creates no conformance rule, evidence format, Event subtype,
specification, RFC, ADR, or VE identifier allocation. Source specifications,
including their Draft status and scope, retain authority.

The baseline is authoritative main
`c7e33b6183a46169c0cd6441432be61b08aedb0c`, after PR #59.
The [Lynx Action schema](../specifications/LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA.md)
is merged **Draft v0.1**, not Approved. Its UG2026 target is the published
November 2026 release, not production-effective on the scenario's creation
date. The following future-release success case does not assert that the
example addresses are assigned, accessible, or operational.

The question is whether existing VE concepts carry this chain without changing
intent or manufacturing evidence:

```text
authorized actor's exact intent
→ canonical Lynx Action
→ Execution Right for its occurrence/content pair
→ Execution Boundary
→ Lynx Adapter
→ Lynx execution domain
→ participant-level settlement
→ interpreted authoritative observation / Event history
→ Lifecycle and Receipt, where their evidence prerequisites are established
```

The actor intends settlement of exactly CAD 10,000.00 of the represented Lynx
Payment Obligation between sending and receiving Lynx participants, through
entries to their Lynx accounts. This is **not** proof of source-customer debit,
destination-customer credit, beneficiary net receipt, end-to-end customer
payment completion, SWIFT acceptance, acknowledgement, or queue admission.

There are two distinct test layers:

1. **Concrete local replay:** canonical bytes, digests, signatures, occurrence
   and content binding, and execution-only variation are actually tested.
2. **Conditional external success:** assume the exact obligation really settles.
   Examine what would allow the Boundary and an independent recipient to know
   that. No authentic Lynx response, participant credentials, or settlement
   evidence is supplied. The conditional Event/Receipt discussion is not a
   fabricated portable proof of settlement.

## 2. Exact intent and occurrence

Reuse schema P1 without any semantic change:

```json
{
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
```

All account identifiers here are literal strings, including leading zeros.
The schema's closed maps, nine ASCII-digit sort codes, XML/Unicode-6.2
repertoire, scalar-count limit, and already-NFC requirement apply unchanged.
P1's ASCII account strings satisfy that repertoire; no normalization is
performed. Addresses are regime-qualified lexical addresses, not permanent
account-object identities.

The only semantic fields are those above. CAD, scale two, CACPA, Other/Id,
DEBT, equal instructed/interbank amounts, and the bounded settlement effect
are schema-fixed. Date, LocalInstrument, routing, message/evidence identifiers,
customer names, and transport are not extra Action fields.

| Value | Exact hex payload, represented as canonical `bstr(32)` |
|---|---|
| `schema_digest` | `e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554` |
| `action_id` | `606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f` |
| `action_digest` | `5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c` |

The Action ID is a deterministic **test-only** opaque 32-octet value. Its
convenient byte pattern is not a production generation requirement and does
not adopt shared OccurrenceId semantics.

```text
action_digest = what exact instruction?
action_id = which historical occurrence?
```

The exact `CanonicalSchemaDescriptor` comes from schema §7 on the pinned
commit, not from a scenario-local schema. The
[VE-001 representation profile](../specifications/VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE.md)
§§4–8 supplies the construction:

```text
S = the descriptor data item, not an extra bstr wrapper
schema_digest = SHA-256(VE-CBOR-1(["VE-ACTION-SCHEMA", 1, S]))
F = the three-member semantic map above
action_digest = SHA-256(VE-CBOR-1(["VE-ACTION-CONTENT", 1, schema_digest, F]))
CanonicalAction = {
  "action_digest": action_digest,
  "instance": {"action_id": action_id},
  "semantic": {"fields": F, "schema_digest": schema_digest}
}
```

Complete canonical Action bytes (358 octets):

```text
a368696e7374616e6365a169616374696f6e5f69645820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f6873656d616e746963a2666669656c6473a36c616d6f756e745f6d696e6f721a000f42406e736f757263655f6163636f756e74a26a6163636f756e745f696467303031323334357822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f6465693030303130303030317364657374696e6174696f6e5f6163636f756e74a26a6163636f756e745f69646b56454e444f522d303030317822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f6465693030303230303030326d736368656d615f6469676573745820e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d3725546d616374696f6e5f64696765737458205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

## 3. Preconditions and authority at issuance

The simulation selects an authorized human actor and an authorization service
that accepts that actor's exact P1 intent. Any required Claims, Rule evaluation,
delegation, and human approval are satisfied at issuance in the scenario-local
context. These are assumptions about this test deployment, not new universal
Claim formats or a reimplementation of Verify/Evaluate.

The three independent questions are:

| Layer | Successful-case assumption or tested fact | What it does not establish |
|---|---|---|
| Action validity | Exact governed descriptor, admitted P1 values, canonical representation, recomputed digests | Authority, real account availability, settlement |
| Execution authorization | Issuance accepts the pair; current Boundary recognizes the exact authenticated test key for this schema/resource context | Lynx admission, commit, customer credit |
| Operational admissibility | A configured participant path, valid processing day/window, eligible mechanism, sufficient operational resources, and admitted message construction exist | Historical issuance policy re-evaluation or changed Action semantics |

No assertion is made that the raw test key has real-world banking authority.
The simulation's local authorization configuration recognizes it only for
this test, supplied schema, and protected Lynx Adapter boundary. Current
resource refusal or unavailable operational inputs can still block execution.

## 4. Concrete Execution Right

Existing [VE-014](../specifications/VE-014-execution-right-specification.md)
and its [Ed25519 / COSE_Sign1 profile](../specifications/VE-014-ED25519-COSE-SIGN1-VERIFICATION-PROFILE.md)
are sufficient for a concrete authorization vector. No Lynx-specific right
field is needed.

```text
profile = "urn:ve:verify:execution-right:cose-sign1-ed25519:1"
ExecutionRightBody = {
  "action_digest": h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c',
  "action_id": h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f'
}
frame = ["VE-EXECUTION-RIGHT", 1, profile, ExecutionRightBody]
protected = h'a10127'
COSE_Sign1 = [protected, {}, null, signature]
Sig_structure = ["Signature1", protected, h'', VE-CBOR-1(frame)]
profile_artifact = VE-CBOR-1([public_key, COSE_Sign1])
outer_artifact = VE-CBOR-1({
  "body": ExecutionRightBody,
  "verification": {"artifact": profile_artifact, "profile": profile},
  "version": 1
})
```

The profile artifact is embedded as the specified byte string; the imported
Action values are embedded directly, without conversion or hidden normalization.

The seed below is the publicly known deterministic Ed25519 test seed, used
only to make this simulation reproducible. Never use it for production:

```text
seed = 9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60
public_key = d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a
signature = 1dd13d8226a6e568dd298ac880b1feac62f957b80712a521bfaab370b603a9cc4faf407b1845f649ccd8ddcdabe3ca2722800c03fcd45eaf19e8ce900a76c70c
```

Canonical authentication-frame bytes (166 octets):

```text
847256452d455845435554494f4e2d524947485401783275726e3a76653a7665726966793a657865637574696f6e2d72696768743a636f73652d7369676e312d656432353531393a31a269616374696f6e5f69645820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f6d616374696f6e5f64696765737458205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

Exact signed `Sig_structure` bytes (185 octets):

```text
846a5369676e61747572653143a101274058a6847256452d455845435554494f4e2d524947485401783275726e3a76653a7665726966793a657865637574696f6e2d72696768743a636f73652d7369676e312d656432353531393a31a269616374696f6e5f69645820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f6d616374696f6e5f64696765737458205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

Detached, untagged COSE_Sign1 bytes (73 octets):

```text
8443a10127a0f658401dd13d8226a6e568dd298ac880b1feac62f957b80712a521bfaab370b603a9cc4faf407b1845f649ccd8ddcdabe3ca2722800c03fcd45eaf19e8ce900a76c70c
```

Complete VE-014 outer-artifact bytes (301 octets):

```text
a364626f6479a269616374696f6e5f69645820606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f6d616374696f6e5f64696765737458205fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c6776657273696f6e016c766572696669636174696f6ea26770726f66696c65783275726e3a76653a7665726966793a657865637574696f6e2d72696768743a636f73652d7369676e312d656432353531393a31686172746966616374586c825820d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a8443a10127a0f658401dd13d8226a6e568dd298ac880b1feac62f957b80712a521bfaab370b603a9cc4faf407b1845f649ccd8ddcdabe3ca2722800c03fcd45eaf19e8ce900a76c70c
```

Independent Python and Node reconstruction produces these same bytes and
signature. Both apply the profile's canonical point decoding, nonidentity,
non-low-order, prime-subgroup/torsion-free checks, `S < L`, and uncofactored
Ed25519 equation before accepting. This is not reliance on unspecified
library-default acceptance. Pure Ed25519 authenticates the exact
`Sig_structure`, not the Action alone.

The result is:

```text
authentication succeeds
authenticated_attester = exact public_key bytes above
current verifier-local authorization recognizes that key
supplied Action is valid and its occurrence/content pair matches
→ this exact right is enforceable in the test context
```

Authentication is distinct from attester authorization. Removing the key from
current recognition would leave its signature authentic but cause
`ATTESTER_NOT_AUTHORIZED`. The right is neither settlement evidence nor
authority created by carrying a key.

## 5. Boundary flow and temporal separation

The Boundary receives the exact canonical Action, right, and applicable
context. Under VE-014 §8 it parses and establishes support, authenticates,
recovers the attester, checks current local authorization, validates the
supplied Action, and compares occurrence and content. The separate earlier
construction-time Action validation does not reorder those verification steps.

The Boundary then checks the applicable execution prerequisites and controls
the Adapter invocation under [VE-006](../specifications/VE-006-execution-boundary-specification.md).
It does not redefine an address, adjust the amount, change the protected
effect, or promote message submission into settlement.

[ADR-011](../adrs/ADR-011-execution-right-core.md) and VE-014 §9 preserve the
durable authorization snapshot. Execution does not re-run issuance Rules,
re-fetch issuance Claims, or reconstruct historical delegation/policy. Current
attester recognition and independent operational admission remain current
inputs. Neither date selection nor a runtime refusal adds expiry, revocation,
audience, or mutable/consumable state to the right.

This Action has no actor-selected execution-time constraint. A materially
different bounded instruction would require the appropriate governed semantic
content, not an unrecorded runtime reinterpretation of P1.

## 6. Action-to-Adapter mapping

[VE-005](../specifications/VE-005-adapter-specification.md) gives the Adapter
translation, serialization, target authentication, and observation ownership;
it gives the Adapter neither authorization nor Event-append authority.

| Source | pacs.008-relevant execution value | Ownership |
|---|---|---|
| Source sort code `000100001` | DebtorAgent clearing member ID under CACPA | Exact Action value; mapping from schema §5.2 |
| Source account `0012345` | DebtorAccount/Identification/Other/Id | Exact lexical Action value |
| Destination sort code `000200002` | CreditorAgent clearing member ID under CACPA | Exact Action value |
| Destination account `VENDOR-0001` | CreditorAccount/Identification/Other/Id | Exact lexical Action value |
| `amount_minor = 1000000` | InterbankSettlementAmount = CAD 10000.00 | Scale-two schema mapping |
| Same amount | InstructedAmount = CAD 10000.00 | Equal, not independently selected |
| Schema | ChargeBearer DEBT; ChargesInformation absent; no FX/ExchangeRate | Fixed semantics |
| Current execution context | Valid InterbankSettlementDate D | Execution-only |
| Applicable strategy/context | Valid UPM or LSM LocalInstrument | Execution-only, subject to eligibility |
| Participant/transport configuration | Message IDs, UETR/correlation, routing, transport, intermediary details where applicable | Adapter/context, not Action identity |

This is a conceptual mapping, not a complete serialized or network-validated
pacs.008. Required message/party data beyond these fields comes from validated
operational records and applicable participant implementation requirements.
The scenario has not tested that complete message. Such records cannot
silently replace the two requested addresses or choose a different protected
effect. If an implementation needs an additional actor-selected semantic
choice to realize P1, it has exposed a further gap, not permission to invent
that choice locally. No such choice is demonstrated by this mapping.

### Execution-only variation

Compare counterfactual configurations, not two actual executions:

```text
baseline:       same Action pair; legitimate day D; eligible UPM
counterfactual: same Action pair; legitimate day D; eligible LSM
counterfactual: same Action pair; another legitimate day D2; eligible UPM
```

D and D2 mean valid processing days for the pinned target release, not asserted
live calendar observations. Every configuration assumes mechanism eligibility
and the same requested completion. Schema §6 explicitly places these choices
outside F. Independent replay rebuilds the same F and obtains the same digest;
the complete Action and right bytes remain unchanged.

`execution strategy != intent`. This experiment does **not** authorize a
second committed transition, assert that a delayed replay is admissible, or
claim all mechanisms are valid under every context.

## 7. Protected external transition and the evidence boundary

In the simulated successful world, the admitted instruction reaches Lynx and
the exact CAD obligation becomes Settled between the sending and receiving
participants through the corresponding transfers/entries to their Lynx
accounts. That is the schema's bounded completion fact.

The external distinction is supported by
[By-law No. 9 §§32–33](https://laws.justice.gc.ca/eng/regulations/SOR-2021-182/page-2.html):
settlement involves the participant-account transfer and corresponding
entries; participant finality follows settlement.
[Lynx Rule 6 §§7–8](https://www.payments.ca/sites/default/files/rule_6_payment_transmission.pdf)
places PCRN generation and availability to participants after settlement.
These sources explain the external fact; they do not define a VE evidence
serialization or Action-binding protocol.

An authentic, correctly correlated participant/system settlement observation
could establish that fact for a suitably authorized Boundary. A naked PCRN
string, a local transaction ID, an unauthenticated assertion, a SWIFT
acknowledgement, or queue admission does not by itself establish it to an
independent VE verifier. A genuine PCRN's settlement significance is not
disputed: the missing part is authentic provenance and binding to **this**
payment, **this** occurrence and **this** content.

The [March 2026 Companion §1.1](https://www.payments.ca/sites/default/files/Lynx_ISO_20022_MessageSpecificationCompanionDocumentForCoreMessages.pdf)
identifies further participant/functional/Y-Copy material as member-only.
Public material was inspected on 2026-09-10; no claim is made that all Lynx
participant interfaces lack sufficient evidence. No private participant
response was available for this test. The precise Lynx-to-VE evidence mapping
is not defined in the current repository.

The conditional successful branch therefore stops short of claiming a
portable settlement proof. No invented `settled=true` field, PCRN fixture,
Claim schema, settlement attester, or signature is used to fill this hole.
The missing concrete criterion is how an independently recognized source's
observation, its correlation to the transmitted instruction, and the exact
Action pair become verifiable together. The next Gap Analysis can decide
whether this is existing profile completion work and where it belongs.

## 8. Event and authoritative-history integration

VE-005 §§9–10 and VE-006 §15 distinguish Adapter observations from Events.
Only the Boundary interprets observations and appends authoritative history.
An `EXECUTION_COMPLETED` Event is semantically available under
[VE-002](../specifications/VE-002-event-specification.md); no
`LYNX_SETTLED` subtype is introduced here.

Conditional on independently established settlement evidence, the minimal
relationship is:

```text
terminal Event.action_id = the exact P1 occurrence above
terminal Event.event_type = EXECUTION_COMPLETED
terminal Event.sequence = 7 in this simulated ordered stream
terminal Event.spec_version = "0.2" (VE-002)
terminal Event.occurred_at = actual settlement-observation history time
Event explanation/references = why the Boundary established P1 settlement
```

A deterministic test-only terminal `event_id` payload may be:

```text
0000000000000000000000000000000000000000000000000000000000000007
```

It is represented as the VE-002 canonical `bstr(32)`. VE-002's Event-only
OccurrenceId adoption does not transfer to Action IDs. This fixture has no
production uniqueness claim. Actual Event timestamps/references are not
fabricated, so this relationship sketch is not a complete Event wire vector.

VE-002 binds Event ownership to `action_id` and permits explanatory payload
and references (§§3, 11–14). VE-001's abstract additionally requires
cryptographic occurrence/content binding for authoritative artifacts whose
meaning depends on both. Merely placing an Action ID in this sketch does not
satisfy that cryptographic requirement. Neither a copied digest nor a copied
PCRN establishes the fact.

The current sources give the semantic ownership, but do not provide this
scenario with a portable Lynx evidence payload, authenticated correlation to
the Action pair, and concrete Event verification coverage. That is a candidate
representation/binding gap, not authority for this scenario to specify one.

## 9. Conditional Lifecycle result

[VE-003 §10](../specifications/VE-003-lifecycle.md) already defines the path:

| Sequence | Existing Event | Derived state |
|---|---|---|
| 1 | ACTION_CREATED | CREATED |
| 2 | VALIDATION_STARTED | VALIDATING |
| 3 | VALIDATION_SUCCEEDED | READY |
| 4 | APPROVAL_REQUESTED | WAITING_FOR_APPROVAL |
| 5 | APPROVAL_GRANTED | AUTHORIZED |
| 6 | EXECUTION_STARTED | EXECUTING |
| 7 | EXECUTION_COMPLETED | COMPLETED |

This selects the scenario's human-approval path. Issuance and right production
follow its accepted authorization; right presentation does not retroactively
repeat that evaluation. Each Event belongs to the same Action occurrence,
has its own immutable identity, and has actual ordering/time information in a
real history.

Given a legitimate authoritative terminal Event, the projection is already
deterministic. No new Lifecycle state or successful-transition rule is needed.
Without the evidence needed to justify that Event, this scenario cannot
honestly claim an observed `COMPLETED` history. That is the upstream evidence
limitation, not a new Lifecycle-state gap. This is not an uncertain-outcome
test or a fabricated terminal `UNCERTAIN` transition.

## 10. What a Receipt could truthfully summarize

[VE-004 §§8–12, 19–20](../specifications/VE-004-receipt-specification.md)
allows a Receipt to summarize authoritative history and independently
established commit evidence. It does not make the settlement true.

After the conditional justified history, a semantic summary could say:

```text
action_id = the exact occurrence
lifecycle_version = "0.1"
final_state = COMPLETED
execution_outcome = COMMITTED
terminal event = sequence 7 of the authoritative history
bounded effect = participant-level P1 settlement, not customer net credit
```

This is **not** a complete conforming Receipt. Required receipt identity,
creation time, commit reference, independently established execution-authority
reference, and the state-transition bindings have not been instantiated.
VE-004 requires exact predecessor/successor binding for a committed
state-transition Action, or a permitted deterministic successor derivation.
No participant account snapshots or permitted Lynx derivation profile are
invented here. An execution authority cannot bootstrap its recognition from
the Receipt itself.

VE-001's Action pair requirement also remains relevant. VE-004's exact Action
linkage and deterministic reference/serialization requirements do not supply
a concrete Lynx proof encoding or a canonical cryptographic binding in this
scenario. Thus portable Receipt construction remains unproven; the normative
obligations are known, but their concrete instantiation is absent. This is a
likely representational gap with VE-004 ownership, not a reason to introduce
a separate `LynxReceipt` primitive.

## 11. Customer outcome, replay, and failure counterfactuals

Participant settlement does not establish that the Vendor/customer account
received exactly `amount_minor`. A later receiving-institution service fee or
customer-account exception does not retroactively change the historical
participant settlement fact. This does not waive or define any institution's
separate legal/customer obligations; it only preserves schema §2's boundary.

Replay, atomic commitment, idempotency, duplicate-transition prevention, and
retry safety remain **existing downstream ownership boundaries** under
VE-014 §9. Continued right validity does not establish retry safety. There is
no mutable right, replay token, execution-attempt primitive, or consumable
authorization. An UNCERTAIN outcome would not consume, mutate, revoke, or
invalidate the right; that fact is not used to invent uncertainty semantics
in this successful case.

| Counterfactual | What fails; what remains unchanged |
|---|---|
| Mutated signature or wrong authentication frame | AUTHENTICATION_FAILED; Action intent unchanged |
| Authentic right for another occurrence | ACTION_ID_MISMATCH after authorization/Action validation |
| Authentic right compared with valid, changed semantic content | ACTION_DIGEST_MISMATCH after earlier checks |
| Exact key no longer recognized | ATTESTER_NOT_AUTHORIZED; authenticity remains |
| Structurally invalid artifact | MALFORMED; no authorization inferred |
| Well-formed unsupported profile/algorithm | UNSUPPORTED, not authentication success |
| Address operationally unavailable | Resource admission fails; schema-valid intent is not rewritten |
| Adapter cannot produce admitted Lynx message | No successful execution claim; not a new VE-014 failure code |
| Lynx rejects or queues the message | Rejection/pending is not participant settlement |
| Authoritative outcome unavailable | No justified completion/COMMITTED claim from mere submission |

The external counterfactuals are reasoning probes, not live bank tests.
Cryptographic invalidity probes are replayed locally as described below.

## 12. Comparison with existing scenarios

[RS-002](RS-002-bank-transfer.md) tests a broader successful bank transfer.
Its bank-reported settlement and hypothetical completion condition do not
unambiguously distinguish the new schema's participant-level effect from
customer-level transfer completion. It is not declared wrong; it is
insufficiently precise for automatic reuse as a test of this exact schema.

[RS-003](RS-003-bank-transfer-uncertain-outcome.md) offers a useful structure
for future uncertainty testing, but inherits RS-002's transfer-intent
ambiguity. No uncertain outcome is imported here. A later Lynx-specific case
can follow successful-path evidence closure.

The earlier [Kernel Gap Analysis v0.2 §1, RS-002](../kernel-analysis/KERNEL-GAP-ANALYSIS-v0.2.md)
already identified criterion/evidence detail, not a settlement primitive, as
the missing work. The merged schema now closes the intended completion
proposition. This scenario isolates the remaining concrete evidence question
instead of treating that historical analysis as proof of a current mapping.

## 13. Invariants and independent replay

| Invariant | Result and limit |
|---|---|
| I1 Same schema + same semantic fields → same action_digest | Python and Node reproduce schema P1 exactly |
| I2 Different action_id → different occurrence, same content possible | Alternate test ID 80..9f changes canonical Action bytes, not action_digest |
| I3 Amount or either address changes → changed digest | All five published D1–D5 mutations reproduced; cryptographic identity assumes SHA-256 collision resistance |
| I4 Valid execution date alone does not change digest | D/D2 context variation leaves F, frame, and digest identical |
| I5 Eligible execution mechanism alone does not change digest | UPM/LSM context variation leaves Action and right bytes identical |
| I6 Participant settlement does not imply guaranteed customer net credit | Follows schema's bounded completion; not a live customer-outcome test |
| I7 Event/Receipt evidence does not redefine intent | Evidence stays outside F and does not change the Action digest |
| I8 Execution Right binds occurrence/content without changing Action | Exact frame/signature verifies; occurrence/content substitution is separately detectable |

### Reproduction contract and recorded execution

Each implementation independently reads the exact descriptor JSON from schema
§7 at the pinned main commit. Neither consumes the other implementation's
serialized bytes or computed digests. Both construct P1 F from its literal
values, sort canonical map keys by encoded length then bytewise order, use
shortest CBOR lengths/integers, validate NFC, and apply the existing
VE-CBOR-1/profile formulas. This restricted fixture replay is not a complete
Lynx repertoire validator or a production CBOR parser.

Python uses its own recursive encoder, hashlib, cryptography Ed25519 signing,
and separate affine Edwards point checks. Node uses a separate recursive
Buffer encoder, node:crypto signing, and BigInt Edwards checks. Temporary
replay harnesses are outside the repository; all inputs, formulas, signed
bytes, and expected outputs needed to recreate the positive test are recorded
here and in the pinned source schema. Neither replay contacts Lynx.

| Rebuilt item | Octets | Result |
|---|---:|---|
| Canonical schema descriptor | 3497 | Equal to source vector and between implementations |
| SchemaIdentityFrame | 3516 | Exact required schema_digest |
| Canonical semantic map | 190 | P1 values, no additions |
| ActionContentFrame | 244 | Exact required action_digest |
| Complete canonical Action | 358 | Byte-for-byte convergence |
| ExecutionRightBody | 93 | Exact imported pair |
| Authentication frame | 166 | Byte-for-byte convergence |
| Sig_structure | 185 | Byte-for-byte convergence |
| Signature | 64 | Identical deterministic signature, strict verification succeeds |
| COSE_Sign1 | 73 | Detached, untagged, protected a10127 |
| Profile artifact | 108 | Raw public key + COSE |
| Outer VE-014 artifact | 301 | Byte-for-byte convergence |

Replayed attacks: map insertion-order variation preserves bytes; all five
schema D1–D5 semantic mutations reproduce their published different hashes;
different occurrence changes Action bytes without changing content identity;
runtime date/mechanism changes do not enter F. All-zero A, S equal to L, and
a bit-mutated signature are rejected by each strict verifier. These selected
probes do not claim a rerun of every profile conformance vector.

Additional local checks preserve signature validity when current key
authorization is removed, return ATTESTER_NOT_AUTHORIZED at that separate
stage, detect occurrence/content mismatch, and reject a reconstructed
wrong-domain frame. These are fixture-level stage checks, not a complete
production artifact-parser implementation.

Recorded construction validation on 2026-09-10: Python 3.12.14 and Node
24.19.0 both pass and their independently generated outputs agree byte for
byte. Documentation validation passes for 120 Markdown documents (119 at the
starting baseline plus this scenario); all 27 repository tests pass.
Tracked-diff checking and an explicit new-file whitespace check pass.
Exactly this one new, uncommitted scenario is in repository scope.

## 14. Architectural Decision Test and governance

| Test | Result |
|---|---|
| Founding Principles | Pass: intent, authorization, external effect, history, and evidence are separated |
| Primitive burden | Pass: no primitive or registry is proposed |
| Removability | Pass: deleting this scenario changes no architecture or conformance rule |
| Twenty-year durability | Pass: pinned commit, target release, fixture-only keys, and conditional claims make historical meaning explicit |
| Independent implementability | Pass for the scenario: exact local vectors are independently replayable; the unimplemented external evidence step is explicitly exposed, not claimed portable |
| Reduced conceptual complexity | Pass: one precise completion proposition isolates a concrete evidence question |

This change is a Reference Scenario only. It does not revise any specification,
RS-002, RS-003, governance file, index, RFC, or ADR. It allocates no VE number.
No conclusion here pre-authorizes a future normative change. The next Gap
Analysis, not this scenario, decides the necessary artifact and governance.

No `LynxPayment`, `PaymentObligation`, `Settlement`, `BankAccount`,
`AccountReference`, `PaymentRail`, `ExecutionAttempt`, `Observation`,
`Evidence`, `PCRN`, `SettlementProof`, `LynxReceipt`,
`ExternalTransactionId`, or `ExternalStandard` architectural primitive is
introduced. Existing external terms retain their ordinary domain meaning;
they do not become VE types. No resolver, registry, new Claim, or generic
identity mechanism is supplied.

## 15. Candidate Gaps Exposed — non-normative

These are pressure-test findings, not normative resolutions or decisions that
a new specification is required.

| Candidate | Classification | Exact open question / current owner |
|---|---|---|
| Authoritative Lynx settlement evidence | External-evidence availability question / needs Gap Analysis; concrete assertion and correlation representation remain uninstantiated. No missing core evidence semantics is demonstrated. | Which authenticated participant/system observation establishes the exact schema completion, and under what independently recognized authority? The schema intentionally excludes evidence; VE-005/006 own observation interpretation |
| Evidence → Action occurrence/content binding | Representation/profile gap with existing semantic owner | How are transmitted instruction, actual settled obligation, and exact Action pair verifiably correlated? VE-001 already requires pair binding; the concrete Lynx mapping is absent |
| VE-002 settlement Event | Existing owner; no Event architecture gap demonstrated | Existing EXECUTION_COMPLETED expresses the fact, but no portable Lynx evidence payload/authenticated binding is instantiated; no new Event subtype demonstrated |
| VE-003 successful transition | No gap / existing owner | EXECUTING + legitimate EXECUTION_COMPLETED → COMPLETED is defined; evidence validity, not the state transition, remains open |
| VE-004 portable COMMITTED Receipt | Representation/profile work with existing semantic owner | Deterministic reference/coverage and predecessor/successor evidence are uninstantiated; existing VE-004 obligations remain, no separate LynxReceipt proposed |
| Adapter needs another semantic Action field | Observation only | The required source/destination/amount mapping closes from P1; full pacs.008 operational admission is not tested, and no missing actor-selected semantic input is demonstrated |
| Execution Right / Boundary integration | No gap exposed by this test | Existing profiles bind/verify the pair and keep current attester authorization separate; no Lynx-specific right needed |
| Customer net credit | No gap in this Action class | Explicitly outside the protected completion proposition |
| Replay / lifecycle / retry safety | Already owned by another existing specification | Existing downstream ownership boundary, not a newly discovered dependency |

The demonstrated limitation is the absence of an instantiated portable
authenticated settlement assertion and its correlation to the exact Action
pair. Existing Claim subject forms, verification architecture, Adapter
references, and authoritative execution history already provide the semantic
owners. Gap Analysis must distinguish unavailable external evidence from
missing concrete representation/profile work; this scenario does not establish
a new evidence-architecture gap or require a new cryptographic verification
profile. No concrete portable Lynx-authenticated settlement artifact/source
has been demonstrated here; this does not prove that none exists.

An instantiated governed assertion expressing the exact settlement proposition
is still needed for this portable composition; existing Claim semantics can
host it. [Claim reference semantics](../specifications/VE-CLAIM-REFERENCE-SEMANTICS.md)
already supports `ActionContentReference`,
`ActionOccurrenceReference { action_id, action_digest }`, and
`ExternalSubjectReference` within its closed union; these are alternatives,
not permission for an arbitrary combined reference wrapper. Portable
correlation of the external settlement result to that Action-occurrence form,
or an equivalent composition already authorized by existing VE semantics,
remains uninstantiated.

[ADR-VERIFY-002](../adrs/ADR-VERIFY-002-CLAIM-VERIFICATION-ENVELOPE.md)
already permits signed Claims about Adapter observations; existing verification
architecture may suffice, while the concrete source/assertion/profile contract
remains for Gap Analysis to determine. VE-005 §8 and VE-003 §15 already permit
Adapter-generated external references and execution-history recording;
portable concrete correlation needs instantiation, not a new owner or
Correlation primitive. Event and Receipt questions remain with their existing
semantic owners, without demonstrating missing Event or Receipt architecture.
A local trusted observation can support a deployment-specific successful
history without closing independent portable evidence verification. Gap
Analysis must determine the smallest subordinate representation/profile work
actually required; the open questions have not been eliminated.

The successful external fact can be stated precisely, and its authorization
path can be replayed. Portable proof of that fact cannot honestly be claimed
from this fixture. The next cadence step is Gap Analysis of the exposed
evidence/binding questions, not an automatic RFC, ADR, or new primitive.

## Revision history

- 0.1 — 2026-09-10: First non-normative Lynx-schema-specific successful-path
  simulation; P1/Execution Right replay and settlement-evidence boundary.
