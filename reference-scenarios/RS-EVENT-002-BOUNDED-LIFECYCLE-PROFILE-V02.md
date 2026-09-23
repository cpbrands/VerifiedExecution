---
id: RS-EVENT-002
title: Bounded Lifecycle Profile v0.2 Established-Input Scenarios
version: "0.3"
status: Draft
document_type: Reference Scenario
category: Non-normative Validation
author: Verified Execution Editorial Board
created: 2026-09-23
updated: 2026-09-23
depends_on:
  - BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE
  - EVENT-SEMANTIC-FIELD-CONTRACT
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-006
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
related_documents:
  - RS-EVENT-001
  - RS-EVENT-001-EXECUTABLE-COMPARISON
  - GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# RS-EVENT-002 — Bounded Lifecycle Profile v0.2 Established-Input Scenarios

## 1. Status, assignment and question

This is **one non-normative Reference Scenario and prospective semantic
conformance matrix**, not a conformance certificate. Repository inspection found
`RS-EVENT-001` and no `RS-EVENT-002`; this document assigns the latter identifier
without renumbering an existing scenario or consuming a reserved numeric gap.
No separate index or governance transaction is required for this Draft addition.

The question is whether the reviewed profile determines admission and Lifecycle
projection from complete, identical **established semantic inputs**, including
their independent establishment results. It is not whether source authentication,
arbitrary Policy evaluation, real settlement or clock measurement has been
implemented. Nothing here is an Event serialization or an authentication scheme.

There are **87 separately numbered cases** below; §5.2 separates row counts
from semantic branch obligations and identifies the one intentional duplicate. Shared complete values and
explicit substitutions keep the matrix bounded; no unlisted variations count
as additional cases. These are selected distinguishing pressures, not an
exhaustive state-space enumeration or a mathematically minimal test set.

- This scenario **does not approve the Draft** or its imported Drafts.
- Documented cases are **not executable or independent-conformance evidence**.
- The prior RS-EVENT-001 experiment's 23 cases and 24 detected mutants, from
  same-author implementations, **do not validate this profile**.
- **Representation readiness remains unestablished.** No representation work
  follows from this matrix, and no prior source pin or experiment is revised.

## 2. Immutable source selection

The inspected, freshly fetched `origin/main` was exactly
`162de90510e7d64f6970d7ff0e9df6ee2dbd4d17`; there was no remote advancement.
The reviewed [profile](../specifications/BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE.md)
is selected by that commit and exact path, with both fingerprints verified:

| Item | Exact value |
|---|---|
| Path | `specifications/BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE.md` |
| Publication | Draft v0.2; type revision `0.2-draft.1` |
| Git blob | `a8a88e94be403be9ffc0efd01986a5db9446757e` |
| SHA-256 of file bytes | `dfd184858a0a925c8da37c67a2ddd6c69e89f7ed064446779ed2122950e98c2b` |

These are document-provenance pins, not Event identity, canonical Event bytes
or trust assertions. A reproduction needs the actual pinned commit/path bytes;
a same-titled working file or a version label is insufficient.

`P` below means that exact profile. Its §2 fixes the following sources and
their recursive repository-local imports at
`56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f`. This scenario preserves that
selection rather than silently updating imports to current main:

| Source | Rules used; maturity at the selected snapshot |
|---|---|
| [Event Semantic Field Contract](../specifications/EVENT-SEMANTIC-FIELD-CONTRACT.md) (`EC`) | §§4–9, 12–15: fields, complete type selection, time, order, dependencies; Draft v0.1 |
| [VE-001](../specifications/VE-001-action-specification.md) | Action occurrence/content, binding and ownership; Approved v0.2 |
| [VE-002](../specifications/VE-002-event-specification.md) | §§3–7, 12–15, 18–23: explanation, identity, immutable history and replay; Approved v0.2 |
| [VE-003](../specifications/VE-003-lifecycle.md) | §§8–11, 15–19: existing state meanings and transition table; Draft v0.1 |
| [VE-004](../specifications/VE-004-receipt-specification.md) | §§2–4, 7–8, 11–14: derived Receipts, evidence authority and commit distinction; Draft v0.2 |
| [VE-005](../specifications/VE-005-adapter-specification.md) | §§7–10: observations and material invocation, not authorization; Draft v0.1 |
| [VE-006](../specifications/VE-006-execution-boundary-specification.md) | §§5–18: context, Policy, identity, delegation, approval and append ownership; Draft v0.1 |

The [gap analysis §10.2](../kernel-analysis/GAP-ANALYSIS-RS-EVENT-001-DETERMINISTIC-EVENT-SEMANTICS.md)
and [comparison report](../kernel-analysis/RS-EVENT-001-EXECUTABLE-COMPARISON.md)
are read at the inspected main, as non-normative selection/evidence history.
Relative links are navigation, not mutable source selectors.

The existing Lynx Action schema and Action representation/binding owners are
also supplied at their exact paths in the profile's source snapshot, recursively
including their immutable imports. Their semantic definitions are incorporated
as input material, not replaced by this scenario. Missing material is explicitly
varied in case 75. No new Action schema or portable Policy reference is created.

## 3. Complete shared semantic inputs

### 3.1 Notation and substitution discipline

This section defines finite **semantic values**, not JSON, CBOR, field numbers,
canonical bytes, or a wire format. Named values are document abbreviations that
are expanded before comparison; they are not runtime identifiers or resolvers.
Tables of named members denote records; lists and sets have P §5.3 meanings.
Quoted Text is literal, with no surrounding quotation marks in its value.

Each case is a separate counterfactual, not a mutation of the previous case.
Its baseline supplies the complete history, candidate and established inputs.
The final-value ledger in §4.8 is authoritative for assessment mutations:

- **AUTH**: authoritative assessment set changes; payload assessment set is
  deliberately the original set. This tests copy mismatch, not uncertainty alone.
- **SYNC**: authoritative and payload assessment sets are explicitly the same
  specified resulting set. This does not authenticate either copy.
- **COPY**: payload corruption only; authoritative context, assessments and
  their establishment results remain the specified originals.
- **NONE**: no assessment-set mutation. Envelope, history or establishment
  changes are individually specified instead.

These classes have no implicit propagation. The ledger supplies both final
sets even when equal. Record replacement means exactly the listed members;
all remaining members are the named original value. Set removal/addition means
the exact listed records, with no omitted assessments. No textual interpolation
or inferred basis update is permitted.

`rebuild` is restricted to envelope/history edits in 08–13, 15, 57–59,
70 and 72: construct the selected candidate/head/sequence stated in that row,
then replace **each** assessment's complete binding by B for those values,
and set both authoritative S and payload.assessments to that resulting set.
Payload.action=A and payload.context=C; all literal basis Text is unchanged.
Each resulting exact assessment has its own independent verified establishment
result under §3.4. This does not repair the deliberately wrong binding in
16–23 or 47. No other row uses this operation.

### 3.1.1 Literal Text convention

Every Text constant below is the exact content of its delimited `text` block:
exclude the fence lines and the one line ending immediately before the closing
fence; retain every interior character and line ending (LF). Each block is one
line. Identifiers such as T-VC are document abbreviations for those values,
not Text obtained from Markdown rendering, a table cell or an external range.
Quoted short field names/source names remain literal Text as specified.

A member replacement with a Text constant replaces its whole prior value.
Deletion removes the named member, not an arbitrarily selected substring.
There are no implicit substitutions, whitespace normalization, concatenations
or formatter-dependent expansions. Structured A, B, C and intervals remain
semantic records, never Text serializations. Their values are included inline
where the profile requires them. Source pins select immutable semantic
dependencies; they are not an instruction to extract explanation Text.

### 3.2 The exact Action and its immutable material

`A` is the existing Lynx P1 semantic Action used in RS-LYNX-001 §2, with the
schema's complete semantic descriptor and owner definitions supplied as the
immutable dependency bundle selected in §2 (not as fixture Text extracted
from document sections). This is a
test-only conditional external Action, not a live payment. Its values are:

| Member | Exact semantic value |
|---|---|
| Action occurrence identifier | Ordered octets with hexadecimal notation `606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f` |
| Action content digest | Ordered octets `5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c` |
| Schema digest | Ordered octets `e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554` |
| `amount_minor` | Integer 1000000 |
| Source account | Sort code Text `000100001`; account Text `0012345` |
| Destination account | Sort code Text `000200002`; account Text `VENDOR-0001` |
| Additional bound occurrence fields | Empty: this selected Action instance has only `action_id` |

The octets above are existing **semantic identifier values**, not a new byte
construction. The Action has exactly the existing owner-defined instance,
semantic content and content binding, no Event or Policy fields. All its
schema/material is included in `payload.action` as required by P §5.3, not
replaced with these digest values. The fixture recognizes the existing Action
owner's successful validity/binding result; it does not recompute Action bytes.

CAD, scale, addressing and participant-level settlement are solely this
existing Action schema's meaning. They do not become generic Event unit
semantics. An independent implementer must expand the pinned source material,
not supply a locally equivalent schema. This extra Draft Action dependency is
explicit and is not asserted to be Approved by this scenario.

### 3.3 Context: complete conditions and scoped sources

The exact context `C` has the following members, and no others:

- `sources`, in order: `b` with roles set {boundary}; `v` with {validation};
  `a` with {authorization}; `x` with {execution}; `t` with {time}; `u` with
  {time}. The names are literal local Text, not public identities.
- `conditions`: the following ordered three records, numbered only for the
  profile's zero-based `condition(i)` selector.
- `not_applicable`, in order: delegation with reason T-ND, then approval
  with reason T-NA.
- `execution_terms`: T-EXEC.
- `commit_required`: Boolean true.

| Position/category/evaluator | Exact contract Text value | Exact inputs Text value |
|---|---|---|
| 0 / validation / v | T-VC | T-VI |
| 1 / identity / a | T-IC | T-II |
| 2 / policy / a | T-PC | T-PI |

T-VC:
```text
Validation condition version 1, evaluated by v: validate the supplied exact Action occurrence, content and schema binding using the independently established Action-owner result, and check its semantic fields under the complete supplied Lynx UG2026 schema. The semantic record has exactly amount_minor, source_account and destination_account; each account has exactly servicing_agent_canadian_sort_code and account_id. All five leaf values are required and non-null; unknown members are forbidden. amount_minor is an integer from 1 through 99999999999999 inclusive, measured in Canadian cents, one unit CAD 0.01. Each sort code is exactly nine ASCII digits matching 0[0-9]{8}, with the leading zero retained and no spaces, hyphens, padding or transformations. Each account_id has 1 through 34 Unicode scalar values, each in XML 1.0 Fifth Edition's Char repertoire (U+0009, U+000A, U+000D, U+0020..U+D7FF, U+E000..U+FFFD, U+10000..U+10FFFF) and assigned in Unicode 6.2.0 (General_Category not Cn in that edition's UnicodeData, under UAX #44). It is already NFC on that repertoire; no normalization, trimming, padding, case folding, punctuation rewriting, numeric conversion, aliasing or leading-zero removal occurs. Equality is exact scalar-sequence equality. Both independent account pairs must be supplied, using domestic CACPA sort-code identification and Other/Id account identification, not IBAN, proxy, BICFI, LEI, name-address, SchemeName, Issuer or account-currency alternatives. The schema fixes CAD, DEBT charges, absent ChargesInformation, equal instructed and interbank-settlement amounts, and absent exchange rate; no additional currency, charge, exchange or routing field is admitted. The underlying Action owner has independently established the exact occurrence/content/schema binding and availability of all its immutable definitions. A satisfied result requires that binding result and every listed semantic admission check to succeed; unsatisfied records a definite failed check; unknown records incomplete establishment. This is a condition over supplied owner results and semantic values, not a new implementation of Action hashing or encoding.
```

T-VI:
```text
Validation inputs version 1: action_id is the ordered octets 606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f; action_digest is 5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c; schema_digest is e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554. There are no additional bound occurrence fields. amount_minor is integer 1000000; source servicing_agent_canadian_sort_code is Text 000100001 and account_id is Text 0012345; destination servicing_agent_canadian_sort_code is Text 000200002 and account_id is Text VENDOR-0001. The independent Action-owner binding result is verified for these exact values and the complete immutable schema/owner definitions supplied with the Action. All three semantic fields and both members of both account records are present, with no null or extra member. The integer is in range, both sort codes contain nine ASCII digits, and both account identifiers are admitted already-NFC ASCII within the stated length range. No conversion or normalization is performed.
```

T-IC:
```text
Identity condition version 1, evaluated by a: the independently authenticated principal must be directly recognized by the resource for the exact Action occurrence, content, accounts and target recorded in this condition's inputs. No delegation is used. Satisfied means both direct recognition and that exact scope are independently established; unsatisfied means a definite failure; unknown means establishment is incomplete.
```

T-II:
```text
Identity inputs version 1: the independently established principal is test-principal-1. The resource recognizes test-principal-1 directly for action_id 606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f, action_digest 5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c, schema_digest e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554, integer amount_minor 1000000, source Text sort code 000100001/account 0012345, destination Text sort code 000200002/account VENDOR-0001, in the Lynx participant-level settlement target. Recognition is for this occurrence and content only; it grants nothing for another occurrence, account or target.
```

T-PC:
```text
Policy condition version 1, evaluated by a: for the supplied Lynx Action, permit only amount_minor at most 1000000, source sort code 000100001 with account 0012345, and destination sort code 000200002 with account VENDOR-0001. Integers compare mathematically; these already-valid Text values compare exactly without transformations. Satisfied means every restriction holds, unsatisfied means at least one fails, and unknown means evaluation is not established. This is the complete applicable Policy; no additional Policy or human-approval condition applies in this test context.
```

T-PI:
```text
Policy inputs version 1: amount_minor is integer 1000000; source sort code is Text 000100001 and account is Text 0012345; destination sort code is Text 000200002 and account is Text VENDOR-0001.
```

T-ND:
```text
The independently recognized principal acts directly for its own authorized scope for this Action; no delegation is invoked.
```

T-NA:
```text
The complete applicable Policy requires no separate human approval for this exact Action.
```

T-EXEC:
```text
Execution terms version 1: the target is the Lynx participant-level settlement domain for the supplied UG2026 Action. Material invocation means the Adapter actually submitted this exact instruction to that domain, not scheduling it. Completion means that the represented CAD 10000.00 Payment Obligation settled through entries in the sending and receiving participants' Lynx accounts. It does not mean customer-account debit or credit, beneficiary net receipt, message acceptance or queueing. Completion requires independently established target commit. Known failure means the materially invoked attempt was definitively rejected and terminated by that target; timeout or absent response does not establish failure. FAILED alone supplies no commit classification.
```

These literal conditions define this scenario's proposed test context, not a
replacement normative schema. The full structured owner material remains part
of A's supplied semantic dependency bundle; the explicit independent owner
binding result is consumed, not recomputed. The historical import of that
bundle is not an extraction rule for any of the Text constants above.

These are **scenario-specific complete authoritative inputs**, not new
normative identity/Policy/target rules. In each baseline the independently
recognized Boundary establishes C's provenance, applicability and completeness
for exact A and the selected history/head, including the direct-principal and
no-approval facts. The fixture is at P's established-result interface, not at
raw proof or Policy re-evaluation. An actual deployment with another applicable
Policy or a required approval path has different inputs and cannot reuse C.

### 3.4 Establishment results are independent inputs

Each baseline supplies, separately from the Event and its payload:

1. A `verified` result for exact C, scoped to A and the exact H below. Its
   recognized Boundary provenance and complete conditions/grants are given
   by §3.3, not inferred from a copied context.
2. For each exact assessment, `verified`, scoped to its entire binding, source,
   role, statement, result and basis. `b` is recognized for admission,
   validation commencement and authorization; `v` for exact schema validation;
   `a` for conditions 1 and 2; `x` for actual invocation and the selected
   target's outcome/commit; `t` and `u` for that exact fact's UTC interval.
   Neither an Adapter label nor a Receipt is the recognizing authority.
3. Historical grant and verification material remains available, bound to those
   exact values, under the owners' unchanged contracts. The input is the
   already-established result and scope, not an unspecified `admitted` bit.
   There is no raw signature, key-selection, trust-bootstrap or clock algorithm
   to choose inside this scenario. Such mechanisms cannot be manufactured by
   a test implementation from the payload.

These are explicit counterfactual premises, not claims that real target facts
were authenticated. Mutations to establishment results below are changes to
these authoritative inputs. A valid-looking copy with missing independent
results has `unavailable`, never an implicit `verified`. A result authenticating
an assessment for a different binding does not authenticate the candidate.

### 3.5 Time, type, Event and assessment expansion

`I(n)` for n in 1..255 is the opaque ordered sequence of 31 zero octets and
one octet whose value is n. This fully specifies test Event IDs, not their wire
encoding or generation requirement. `I(250)` is unused in baseline history.

`L(K)` is exactly the four-component abstract identifier:
authority Text `https://github.com/cpbrands/VerifiedExecution`, profile Text
`BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE`, revision Text `0.2-draft.1`,
kind Text K. It selects only the pinned publication, never the old experiment.

`q(s)` is endpoint (2026, 11, 17, 15, 0, s, 0, 1). `Q` has earliest q(0)
and latest q(1). Every baseline Event and its time assessment use **this same
closed interval**. This models bounded uncertainty, not seven simultaneous
point facts or a claim about clock precision. Endpoint and interval equality,
inclusive bounds and rational comparison are exactly P §5.2.

For candidate `E`, `B(E)` contains A's exact occurrence/content and empty
additional bound fields; E's full type and Event ID; exact prior head (NONE
or the last listed Event ID), E's selected sequence, and the entire exact C.

Every assessment has exactly six members: binding, source, role, statement,
result and basis. The baseline basis values are the literal constants in
§3.7: fact F1–F7 for E1–E7 respectively, condition(0)=K0,
condition(1)=K1, condition(2)=K2, time=TT and commit=MC.
No record's basis is generated from Markdown, another field's display form or
a generic instruction to describe a contrary observation.

The seven Events have exactly these fields: event_id I(n), action_id A's
identifier, event_type L(K), occurred_at Q, sequence 10n, spec_version the pair
(VE-002, 0.2), and payload with action A, context C and assessments S(E).
All other top-level members are absent. S(E) contains one fact assessment
from the source/role below, result established; one time assessment from t,
role time, result Q; and only the additional assessments listed below.
All condition assessments come from their exact evaluator with the appropriate
validation/authorization role. The completion commit comes from x/execution.

| n / K | Semantic fact explained by the corresponding literal basis | Additional S(E) |
|---|---|---|
| 1 / ACTION_CREATED | Fact: this exact Action occurrence became authoritative. Observation: b admitted the complete immutable A into authoritative history. | None |
| 2 / VALIDATION_STARTED | Fact: validation of this exact Action began. Observation: b observed the applicable structural/semantic validation actually commence, not enter a queue. | None |
| 3 / VALIDATION_SUCCEEDED | Fact: applicable validation of this exact Action succeeded. Observation: v completed all supplied Action/schema checks successfully. | condition(0) satisfied |
| 4 / AUTHORIZATION_GRANTED | Fact: execution authorization for this exact Action/context was established. Observation: b established satisfied identity and Policy conditions and the independently justified delegation/approval inapplicability recorded in C. | condition(1) satisfied; condition(2) satisfied |
| 5 / EXECUTION_STARTED | Fact: a material external execution attempt began. Observation: x establishes actual Adapter invocation of this exact settlement instruction in the selected target domain. | None |
| 6 / EXECUTION_COMPLETED | Fact: governed execution resolved successfully. Observation: x establishes the represented obligation settled under the exact execution terms after invocation. | commit committed |
| 7 / EXECUTION_FAILED | Fact: execution began and resolved as a known failure. Observation: x establishes the materially invoked attempt was definitively rejected and terminated by the target; it is not a timeout or pre-execution denial. | None; do not infer a commit result |

Fact sources/roles: n=1,2,4 use b/boundary; n=3 uses v/validation;
n=5,6,7 use x/execution. E6 and E7 are alternative successors of E5, not
successive Events. Their selected positions are respectively 60 and 70 in
separate worlds; both bind prior head I(5).

### 3.6 Histories, delivery and expected-result vocabulary

`H0` is the empty, independently established authoritative stream for A;
`H1` through `H5` are exactly the ordered prefixes E1 through En.
`H6` is H5 followed by E6; `H7` is H5 followed by E7. Each retained Event
has its own independently established context/assessments and exact predecessor
binding. All dependency and historical verification material is available.
Delivery is that order unless explicitly changed. For each baseline the
protected environment uniquely selects the displayed candidate, predecessor
and sequence before append; no competing selection exists. For E1 the
predecessor is NONE. Selection for an illegal candidate is not a legality proof.

Baseline names P1..P7 mean evaluating En on H(n−1), except P7 uses H5.
They include A, C, S(En), establishment results and selection above, not just
a prior-state label. Recorded histories always retain full Events, not only
cached states. Valid prior projections are H0=NONE (no Lifecycle state),
H1=CREATED, H2=VALIDATING, H3=READY, H4=AUTHORIZED, H5=EXECUTING,
H6=COMPLETED, H7=FAILED.

Matrix results use:

- **Accept / state**: append the selected valid occurrence and derive that
  complete-history projection.
- **Reject / keep state**: definite invalidity; no append, existing valid H
  remains unchanged. A rejection is not a new Lifecycle Event.
- **No accept—unestablished / keep state**: required definite fact/time/result
  missing or unknown; no append, not a known failed execution.
- **No accept—unsupported / keep state**: required material/establishment
  unavailable for the new candidate. Historical state is retained only when
  its own interpretation is fully supplied.
- **No complete projection**: retained authoritative membership has unavailable
  interpretation. Any named supported prefix is partial, not current state.
- **No accept—unselected**: no unique protected successor; P §6 prohibits
  admission but does not name a fourth standardized diagnostic code. This
  phrase describes the reason, not a new profile enum.

Known invalidity takes precedence over unsupported, then unestablished
(P §4.1). A verified negative assessment stays negative. Every changed basis
and every post-mutation establishment result is specified in §4.8; no favorable
rationale is implicitly rewritten and no copied value authenticates itself.

### 3.7 Literal assessment and negative-explanation Text

The binding record and inline context accompany each basis; statements such as
“bound Action” refer to that actual record, not an external locator. Condition
contracts, exact inputs and evaluator identities are retained in each binding's
whole context; the basis supplies the observation/rationale, not another
unspecified copy of those texts.

F1:
```text
Boundary b observed and established actual admission of the complete bound Action occurrence into authoritative history. This is admission itself, not a request or intent to admit.
```

F2:
```text
Boundary b observed applicable structural and semantic validation of the bound Action actually commence. The work began; this is not merely placement in a validation queue.
```

F3:
```text
Validator v completed every applicable Action/schema admission and binding check on the exact bound Action successfully. The independent owner-binding result and all semantic checks in validation condition version 1 are satisfied.
```

F4:
```text
Boundary b established execution authorization for the exact bound Action and context. Evaluator a supplied satisfied identity and Policy conditions; independently established direct-principal and no-approval facts justify the context's two inapplicability entries.
```

F5:
```text
Execution source x established that the Adapter actually invoked the bound Lynx settlement instruction in the participant-level target domain. This is material invocation, not preparation, intent, scheduling or queueing.
```

F6:
```text
Execution source x established successful resolution after actual invocation of the bound instruction: the represented obligation settled through entries in the sending and receiving participants' Lynx accounts under the inline execution terms. No customer-account-credit or Receipt-only conclusion is asserted.
```

F7:
```text
Execution source x established that the materially invoked bound attempt was definitively rejected and terminated by the target. This is a known post-invocation failure, not timeout, silence, pre-execution denial or a commit-status inference.
```

K0:
```text
Validator v applied validation condition version 1 to the exact values retained in the binding context. The independent Action-owner binding check succeeded; integer 1000000 is in range, sort codes 000100001 and 000200002 satisfy the leading-zero nine-ASCII-digit rule, accounts 0012345 and VENDOR-0001 satisfy the admitted already-NFC repertoire and lengths, and every required closed-record check passed.
```

K1:
```text
Evaluator a applied identity condition version 1 to its retained inputs: test-principal-1 is independently recognized directly for this exact occurrence, content, accounts and Lynx resource scope. No delegated principal or inferred global identity is used.
```

K2:
```text
Evaluator a applied the complete Policy condition version 1 to its retained inputs: integer 1000000 is at most 1000000, source 000100001/0012345 and destination 000200002/VENDOR-0001 exactly match. All restrictions hold; this Policy requires no separate human approval.
```

TT:
```text
The named time source independently establishes the bound fact's occurrence within exactly the closed UTC interval in this assessment's result. The fact owner's observations establish both inclusive proleptic-Gregorian endpoints, including the complete rational uncertainty bounds; no tighter bound is asserted. These are occurrence bounds, not arrival, response, signing or append time.
```

MC:
```text
Execution source x independently establishes target commit for the bound instruction: the represented obligation settled in the participants' Lynx accounts under the complete inline execution terms. Commit is not inferred from a Receipt or a Lifecycle state name.
```

FU:
```text
Execution source x has only timeout and no response after invocation of the bound attempt. A definitive target outcome cannot be established; neither known failure nor non-commit is asserted.
```

FX:
```text
Synthetic execution observation reported by source x, acting under its independently established execution grant for this assessment's exact binding: x observed the Adapter actually submit the bound instruction for amount_minor 1000000, source 000100001/0012345 and destination 000200002/VENDOR-0001 to the Action-selected participant-level Lynx settlement domain. The observed Action occurrence is 606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f with content digest 5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c and no additional bound occurrence fields. This observation record closes immediately after that actual submission is observed; it includes no subsequent target-outcome observation. Its established intermediate fact is material invocation, not merely preparation or queueing. Within that bounded observation there is neither authoritative confirmation of settlement entries in both participants' Lynx accounts nor authoritative confirmation of definitive target rejection and termination. The assessed statement is the candidate EXECUTION_COMPLETED fact, with the complete type, Event identifier, prior head, sequence and entire context carried by this assessment's binding; its execution terms require the represented obligation's successful settlement, not submission alone. Result: unknown. Rationale: actual invocation does not establish that terminal settlement fact, and absence of terminal confirmation within this observation does not establish its negation. This is an inconclusive completion assessment from this bounded observation, not an assertion that every other observation at the decision boundary is inconclusive; it does not refute a separate established completion or commit assessment.
```

FR:
```text
Execution source x definitively refutes the asserted successful resolution of the bound attempt. The target's established outcome is not the claimed participant-level successful settlement.
```

KN:
```text
Synthetic owner-reported historical explanation from evaluator a, implementation version a-policy-evaluator/1-strict-bound-defect, for condition(2) under this assessment's exact Action, Event, head and whole-context binding. Applicable contract: complete Policy condition version 1, allowing amount_minor at most 1000000, source sort code 000100001 with account 0012345, and destination sort code 000200002 with account VENDOR-0001, with no additional Policy or human-approval condition. Actual evaluated inputs: integer amount_minor 1000000; Text source sort code 000100001 and account 0012345; Text destination sort code 000200002 and account VENDOR-0001. Reported evaluation: all four account Text comparisons were exact and true, but this implementation incorrectly used strict mathematical comparison 1000000 < 1000000 for the inclusive amount limit; that comparison was false. The evaluator combined that false amount check with the four true account checks and returned unsatisfied. Its reported denial rationale was that the amount failed its strict-limit check at the boundary. This fully stated strict-versus-inclusive implementation defect, not a hidden Policy restriction, explains the denial. The governing Policy instead requires 1000000 <= 1000000, which is true, so all recorded inputs satisfy its actual restrictions. The mistaken comparison and denial are retained as the synthetic evaluator's historical report, not endorsed as correct and not added as a Policy condition. Establishment verifies the exact reported assessment and scoped evaluator authority, not the correctness of that comparison; the profile consumes the recorded unsatisfied outcome and does not silently replace it by independently re-evaluating Policy.
```

MN:
```text
Execution source x independently established that the bound target attempt did not commit under the inline execution terms. This is an authoritative non-commit observation, not an inference from timeout, a Receipt or a FAILED name.
```

TU:
```text
The named time source cannot establish a finite authoritative UTC interval for the bound fact. No producer, arrival or append-time reading is offered as a substitute.
```

TB:
```text
The named time source supplied the exact endpoint values recorded in this assessment's result as its purported UTC occurrence bound for the bound fact. Independent origin establishment does not validate their calendar or rational domains.
```

FB:
```text
Boundary source b asserts successful settlement of the bound attempt while claiming the execution role. Its independently recognized grant remains boundary-only and does not authorize that target-fact assertion.
```

FQ:
```text
Boundary b established that the bound Action was placed in a validation queue but that validation work had not actually commenced. The claimed validation-start fact is refuted.
```

XQ:
```text
Execution source x established preparation and queueing of the bound instruction but no actual Adapter invocation in the target domain. The claimed execution-start fact is refuted.
```

PN:
```text
P-A
```

PD:
```text
digest:0123456789abcdef
```

PU:
```text
https://policy.example/current
```

PB:
```text
Evaluator a reports a favorable Policy result for the exact recorded inputs, but the recorded condition supplies only a name, digest or mutable locator instead of the applicable contract. No actual Policy terms or edition are retained in this basis.
```

MS:
```text
Required Action schema semantic material is unavailable.
```

ME:
```text
The Action-selected execution meaning cannot be interpreted because the required schema material is unavailable.
```

MF:
```text
Boundary b reports admission of the bound occurrence, but the underlying Action schema meaning is unavailable in this interpretation input.
```

MT:
```text
The time source supplied the recorded UTC interval for the claimed admission; missing Action schema material prevents complete interpretation of that fact.
```

## 4. Conformance matrix

`D` means the result depends on the Draft profile or imported Draft semantics;
it is not an Approved conformance claim. `A+D` additionally tests an explicit
Approved VE-001/VE-002 invariant, but the complete profile-shaped fixture is
still Draft-specific. The source column identifies the exact rule for each
case. No case promotes VE-003/004/006 to Approved.

### 4.1 Seven positive transitions and sequence/legality boundaries

| Case | Complete baseline / authoritative changes; recorded H; Event | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 01 | P1: H0, E1 | Accept / CREATED; authoritative Action admission fact and time established. | P §§4, 4.1, 6; VE-002 §§2–3 / A+D |
| 02 | P2: H1, E2 | Accept / VALIDATING; actual validation commencement. | P §4; VE-003 §10 / D |
| 03 | P3: H2, E3 | Accept / READY; fact and every validation condition established. | P §4.1(2–3) / D |
| 04 | P4: H3, E4 | Accept / AUTHORIZED; complete identity/Policy results and justified inapplicability, not READY alone. | P §4.1(3); VE-006 §§9–12 / D |
| 05 | P5: H4, E5 | Accept / EXECUTING; actual material invocation, not authorization or queueing. | P §4; VE-003 §8.6 / D |
| 06 | P6: H5, E6 | Accept / COMPLETED; exact success and required target commit independently established. | P §4.1(4); VE-004 §§7–8 / D |
| 07 | P7: H5, E7 | Accept / FAILED; known post-invocation failure. No NOT_COMMITTED inference or fabricated commit assessment. | P §§4, 6; VE-004 §8 / D |
| 08 | P4, replace H3 with H2; rebuild E4's B and all inputs for prior I(2), sequence 40 | Reject / keep VALIDATING; protected selection and positive evidence do not permit VALIDATING→AUTHORIZED. | P §6; VE-003 §§10–11 / D |
| 09 | P7, replace H5 with H6; rebuild E7 for prior I(6), sequence 70 | Reject / keep COMPLETED; a later known-failure claim cannot transition a terminal history. | P §6; VE-003 §11 / D |
| 10 | H5; both full P6 and P7 assessment bundles supplied as distinct proposals; no unique successor selected | Neither accepted / keep EXECUTING; both bind I(5), but time or sequence magnitude cannot elect one. No extra authoritative history. | P §6; EC §8 / D |
| 11 | P6, candidate and selection sequence 50; rebuild B, all else unchanged | Reject / keep EXECUTING; sequence collides with E5, even though time/fact are established. | P §6; EC §8 / D |
| 12 | P5, unique selected sequence 18446744073709551615; rebuild B | Accept / EXECUTING; exact uint64 maximum is legal and gaps are allowed. Call this full resulting history Hmax. | P §§5.1, 6; EC §8 / D |
| 13 | Hmax; P6 rebuilt for its exact head with proposed sequence 18446744073709551616 | Reject / keep EXECUTING; above-domain ordinal following exhaustion. **Intentionally redundant** with 59's uint64 upper-bound rejection; not a second demonstrated overflow branch. | P §6; EC §8 / D |
| 14 | Replay H6, no new candidate; independently established membership unchanged; delivery E6,E2,E5,E1,E4,E3 | Accept recorded history / COMPLETED; all bounds equal Q yet authoritative sequence uniquely orders it. Transport and time do not select order. | P §6; EC §§7–8; VE-002 §7 / A+D |
| 15 | P6, change candidate ID to I(5), rebuild B | Reject / keep EXECUTING; distinct completion occurrence reuses E5's immutable occurrence ID, not harmless duplicate delivery. | P §6; VE-002 §§4–5 / A+D |

### 4.2 Exact bindings: authenticated wrong input is still wrong

In 16–23 use P6/H5/E6 and the **SYNC** class: replace the fact
assessment's binding member specified in the row in both authoritative S and
payload.assessments (the exact final sets are in §4.8). The independently
supplied result verifies that altered assessment and scope, not a forged
unchanged one. Time and commit assessments, the candidate envelope,
authoritative C and payload.context stay exact. The fact basis remains F6
except in 19, which explicitly uses F7 so that its rationale describes the
different asserted failure fact rather than introducing a second defect.
All reject and keep EXECUTING; none can be rescued by a matching source name.

| Case | Exact altered binding member | Exact rejection reason | Source / class |
|---|---|---|---|
| 16 | action_id = I(250) | Another occurrence is not A, even with its content digest. | P §4.1; VE-001 §12 / A+D |
| 17 | action_digest = 32 zero octets | Same occurrence label does not bind different content. | P §4.1; VE-001 §12 / A+D |
| 18 | bound_instance_fields additionally contains `foreign_instance` with Text `x` | Not the owner's exact empty additional-field set; producer cannot enlarge occurrence binding. | P §4.1; VE-001 ownership / A+D |
| 19 | full event_type = L(EXECUTION_FAILED); fact basis=F7 | Evidence concerns a different fact, not completion. The failure assessment is internally explained, but is not evidence for this candidate's completion. | P §§3–4.1 / D |
| 20 | candidate event_id = I(250) | Another Event occurrence, even for the same Action/fact. | P §4.1 / D |
| 21 | prior_head = I(4) | Assessment was not for selected authoritative head I(5). | P §§4.1, 6 / D |
| 22 | sequence = 61 | Assessment was not for selected append position 60. | P §§4.1, 6 / D |
| 23 | context = C with its sources list reversed, no other edit | The complete structured context is unequal; lists are ordered even where grants happen to name the same sources. | P §§4.1, 5.3 / D |

### 4.3 Assessment, uncertainty and authority boundaries

| Case | Complete baseline / explicit change | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 24 | P6/H5/E6; remove fact from authoritative S and payload S | No accept—unestablished / keep EXECUTING; time plus commit alone cannot replace the required fact assessment. | P §4.1(2) / D |
| 25 | P7/H5/E7; **AUTH**: authoritative fact becomes unknown with FU; payload deliberately retains original established fact/F7 | **Reject / keep EXECUTING**; exact supplied S differs from payload S. The unknown fact is secondary. This preserves the original frozen-copy reading rather than changing inputs to rescue its former expected result; 86 isolates the synchronized uncertainty case. | P §§4.1, 6; VE-004 §§7–8 / D |
| 26 | P6/H5/E6; SYNC fact refuted with FR | Reject / keep EXECUTING; authentic negative evidence does not establish completion. | P §4.1 / D |
| 27 | P6/H5/E6; payload and C/S copies unchanged, but no independent establishment results for C or assessments; material unavailable | No accept—unsupported / keep EXECUTING; copies do not establish scoped authority. Valid-looking fields cannot authenticate themselves. | P §§4.1, 5.3; VE-001 §§12–16 / A+D |
| 28 | P6/H5/E6; independent verification result for time is failed | Reject / keep EXECUTING; untrusted time is a definite authentication failure, not an established bound or mere missing material. | P §§4.1, 5.2 / D |
| 29 | P6/H5/E6; SYNC fact source b, role execution, basis FB; its exact establishment result is failed for ungranted role; result otherwise unchanged | Reject / keep EXECUTING; b's independently supplied grant has only boundary role, not target-truth authority. | P §4.1(1); VE-006 §§6, 15 / D |
| 30 | P6/H5/E6; retain established fact and add verified same-binding x/execution fact refuted with its contrary basis | Reject / keep EXECUTING; **compound defense**: established cannot override independently disqualifying refuted. This is not an isolated generic-contradiction test (85 is). | P §4.1 / D |
| 31 | P3/H2/E3; remove condition(0) from S and payload | No accept—unestablished / keep VALIDATING; a positive generic fact does not replace all required validation results. | P §4.1(3) / D |
| 32 | P4/H3/E4; SYNC condition(2) result unsatisfied, literal basis KN; exact final sets in §4.8 | Reject / keep READY; recognized origin is not satisfaction. KN records the explicit strict-versus-inclusive evaluator defect; its required-condition denial cannot be silently re-evaluated to success by this profile. | P §4.1(3); VE-006 §11 / D |
| 33 | P4/H3/E4; retain satisfied condition(2), add verified same-evaluator unsatisfied condition(2) with denial basis | Reject / keep READY; **compound defense**: satisfied cannot override the independently disqualifying required-condition denial. Generic contradiction is isolated in 85. | P §4.1 / D |
| 34 | P6/H5/E6; SYNC add fact unknown with literal FX, retaining established fact and commit; exact final sets in §4.8 | Accept / COMPLETED; unknown is retained but does not refute the definite fact. | P §4.1 / D |
| 35 | P6/H5/E6; remove commit assessment | No accept—unestablished / keep EXECUTING; this A requires target commit, not terminal-state inference. | P §4.1(4); VE-004 §§7–8 / D |
| 36 | P6/H5/E6; SYNC commit result not_committed with literal MN; exact final sets in §4.8 | Reject / keep EXECUTING; definite result conflicts with required committed completion. | P §4.1(4) / D |
| 37 | P6/H5/E6; retain committed and add verified not_committed with its non-commit basis | Reject / keep EXECUTING; **compound defense**: committed cannot override independently disqualifying not_committed. Generic contradiction is isolated in 85. | P §4.1 / D |

### 4.4 UTC bounds: exact, fact-bound and not an ordering authority

All use P6/H5/E6. The ledger explicitly gives each final assessment set,
basis and payload copy. In 43–46 and 48 the candidate occurred_at equals the
malformed interval written in the row, and the time basis is TB. In 38–40 the
candidate remains Q. In 41–42 it also remains Q. In 47 only the time binding
changes, with basis TT referring to that changed bound fact. No other basis
or binding changes; B does not contain occurred_at. `q` is defined in §3.5.

| Case | Exact time input change | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 38 | SYNC add u/time assessment with identical Q and literal TT, verified for exact B; exact final sets in §4.8 | Accept / COMPLETED; both independent established bounds are identical, no selection needed. | P §4.1(5) / D |
| 39 | Keep t's Q; add verified u bound earliest q(1), latest q(2); candidate remains Q | Reject / keep EXECUTING; touching/overlapping inclusive bounds are unequal. No intersection even though one instant is shared. | P §§4.1(5), 5.2 / D |
| 40 | Keep t's Q; add verified u bound earliest q(2), latest q(3); candidate remains Q | Reject / keep EXECUTING; disjoint bounds conflict too; later source time cannot override. | P §§4.1(5), 5.2 / D |
| 41 | Only time assessment result unknown; candidate still Q; basis says owner cannot establish a finite bound | No accept—unestablished / keep EXECUTING; producer's proposed Q is not evidence. | P §§4.1, 5.2 / D |
| 42 | Remove time assessment; candidate remains Q | No accept—unestablished / keep EXECUTING; missing is not an implicit clock reading. | P §4.1(5) / D |
| 43 | Candidate/time result both point (2026,2,30,15,0,0,0,1) | Reject / keep EXECUTING; day outside Gregorian month domain, even with supplied verification. | P §5.2 / D |
| 44 | Candidate/time result both point (2026,11,17,15,0,0,0,0) | Reject / keep EXECUTING; denominator zero. | P §5.2 / D |
| 45 | Candidate/time result both point (2026,11,17,15,0,0,2,4) | Reject / keep EXECUTING; unreduced fraction is not normalized by the consumer. | P §5.2 / D |
| 46 | Candidate/time result earliest q(2), latest q(1) | Reject / keep EXECUTING; reversed endpoints. | P §5.2 / D |
| 47 | SYNC time B.event_type changed to L(EXECUTION_STARTED); basis TT retains its literal wording about the bound fact | Reject / keep EXECUTING; authentic time for another fact cannot substitute for completion time. | P §§4.1, 5.2 / D |
| 48 | Candidate/time result both point (2026,11,17,15,0,60,0,1) | Reject / keep EXECUTING; leap endpoint label outside this bounded domain. No rounding or clock conversion. | P §5.2 / D |
| 49 | Only candidate occurred_at becomes point q(0); authoritative time remains Q | Reject / keep EXECUTING; narrowing to a contained point is not exact interval equality. | P §4.1(5) / D |

Case 14 demonstrates equal bounds cannot order history; case 10 demonstrates
that even complete time evidence cannot replace protected successor selection.
Case 39 intentionally uses inclusive touching bounds, a sharper boundary than
an arbitrarily wide overlap. Strict separation in case 40 does not cure a
same-fact contradiction. No duration or leap-table inference is involved.

### 4.5 Historical explanation is material, not a favorable label

For 50–56 use P4/H3/E4. Cases 50–52 are explicitly **COPY compound-defense**
tests: deletion loses both a required explanation member and exact-copy
agreement. The resulting payload is the original closed record minus exactly
the specified member; all other Text is unchanged. No substring edit occurs.
Cases 54–56 instead use equal authoritative/payload contexts and the exact
synchronized materialization in §4.8: there is no copy mismatch. Their context
establishment result is failed because the retained Policy contract is
demonstrably only the specified indirect substitute, not complete terms.

| Case | Exact missing/substituted material | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 50 | Delete basis member from payload's condition(2) assessment only | Reject / keep READY; missing required rationale/attribution and not the exact supplied S. | P §5.3; VE-002 §3 / A+D |
| 51 | Delete evaluator member from payload.context.conditions[2] only | Reject / keep READY; required evaluator and exact C lost. | P §§4.1, 5.3; VE-002 §3 / A+D |
| 52 | Delete inputs member from payload.context.conditions[2] only | Reject / keep READY; historical input material and exact C lost, not recoverable from result satisfied. | P §§4.1, 5.3; VE-002 §3 / A+D |
| 53 | Candidate's complete version-1 explanation remains, but the independent historical material establishing which Policy edition applied to this A/H is unavailable; C establishment is unavailable | No accept—unsupported / keep READY; the copied version-1 terms cannot prove they are the applicable historical edition. No local/latest edition may fill the missing establishment dependency. | P §§2, 4.1, 7 / D |
| 54 | SYNC context C54: condition(2).contract=PN; its assessment basis=PB; every embedded C copy equals C54 | Reject / keep READY; bare name is not complete historical Policy terms. Independent context-completeness establishment failed; not a C-copy mismatch. | P §§4.1, 5.3, 7; VE-002 §3 / A+D |
| 55 | SYNC context C55: condition(2).contract=PD; its assessment basis=PB; every embedded C copy equals C55 | Reject / keep READY; digest-only contract omits actual historical terms. Independent context-completeness establishment failed; no hidden full contract survives in basis. | P §§4.1, 5.3, 7; VE-002 §3 / A+D |
| 56 | SYNC context C56: condition(2).contract=PU; its assessment basis=PB; every embedded C copy equals C56 | Reject / keep READY; mutable locator omits retained terms. Independent context-completeness establishment failed; no network resolution or payload mismatch. | P §§4.1, 5.3, 7; VE-002 §3 / A+D |

Case 53 is specifically missing **semantic edition/material**, not the absence
of an invented `evaluator_version` member. P defines evaluator as a scoped
source name and requires complete actual contracts/inputs; it does not allocate
that extra member. Where an evaluator's algorithm/version affects the meaning
of a supplied condition, that exact material belongs in the condition and
retained establishment dependency. Re-performing that evaluator is outside
these tests. Mere deletion of an informational label from otherwise complete,
independently established material is not automatically the case-53 failure.

### 4.6 Closed field domains and permissive opaque top-level context

All use P6/H5/E6 except 58 and 70 as specified. A row changes only the candidate
unless it says otherwise; independent inputs remain exact. For invalid member
collections these are semantic producer proposals, not parser/wire tests.

| Case | Exact input alteration | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 57 | event_id is 31 zero octets; rebuild all B/copies for that exact proposed ID | Reject / keep EXECUTING; not an Event OccurrenceId. | P §5.1; VE-002 §4.1 / A+D |
| 58 | P1/H0/E1; sequence is integer −1; selected position/B also −1; rebuild | Reject / no Lifecycle state; below uint64 domain, with no predecessor and thus no earlier ordering collision. | P §5.1; EC §8 / D |
| 59 | sequence is integer 18446744073709551616; selected position/B also that value; rebuild | Reject / keep EXECUTING; above uint64 domain even without preceding exhaustion. | P §5.1; EC §8 / D |
| 60 | payload.context.commit_required is integer 1, not Boolean true | Reject / keep EXECUTING; no integer-to-Boolean coercion and not exact C. | P §5.3 / D |
| 61 | Add actor with Text b | Reject / keep EXECUTING; forbidden field even when the name is a recognized source. | P §5.1 / D |
| 62 | Add component with non-null Text b | Reject / keep EXECUTING; forbidden component presence alone; no unrelated known-field-null defect. | P §5.1; EC §4 / D |
| 63 | Add references with empty list | Reject / keep EXECUTING; forbidden collection is present even when empty. | P §§5.1, 7 / D |
| 64 | payload is null | Reject / keep EXECUTING; required non-null explanation. | P §5.1; EC §4 / D |
| 65 | Add payload member extension with null | Reject / keep EXECUTING; nested payload is closed, unlike unknown top-level context. | P §5.3 / D |
| 66 | Add distinct unknown top-level member transport_note with null | Accept / COMPLETED; opaque context has no evidence/projection effect and is retained. | P §5.1; EC §13 / D |
| 67 | Supply event_id member twice, both I(6) | Reject / keep EXECUTING; duplicate member names fail even when values agree. No first/last-wins rule. | P §5.1; EC §4 / D |
| 68 | Remove payload; add unknown top-level explanation_copy containing the former complete payload | Reject / keep EXECUTING; unknown extension cannot replace required explanation. | P §§5.1, 5.3 / D |
| 69 | occurred_at is null | Reject / keep EXECUTING; required known field cannot use null for unknown time. | P §5.1; EC §4 / D |
| 70 | P1/H0/E1; sequence, selected position and B all become integer 0; rebuild | Accept / CREATED; minimum in-range initial ordinal, no implicit start-at-one rule. | P §6; EC §8 / D |

### 4.7 Retention, imported/local history and immutable dependencies

| Case | Complete history, candidate and authoritative-material changes | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 71 | P6/H5/E6; E1–E3 and all exact historical dependencies/grants arrive from a lossless offline archive; E4–E5 are local. Membership/verification is independently established for both parts, not inferred from archive origin. | Accept / COMPLETED; imported/local storage origin changes no semantic input or identity. The original explanation remains interpretable. | P §§2, 5.3, 6–7; VE-002 §§21–23 / A+D |
| 72 | Recorded membership H3 followed by foreign Event J: event_id I(80), Action A, sequence 35, time Q, spec_version (VE-002,0.2), full type (authority Text rs-event-002.example, profile Text imported-policy, revision Text 1, kind Text POLICY_RECORDED), payload Text retained-policy-record, other known optionals absent. J's exact governing type/reference contract unavailable. Proposed E4 rebuilt for J as prior head, sequence 40, with its complete independent input bundle. | No accept—unsupported; retain J; **no complete projection**. H3 establishes only a partial READY prefix. J cannot be assumed harmless/non-transition-causing from its local name. This scenario does not allocate or finish that foreign type. | P §§2, 6–7; EC §6 / D |
| 73 | Replay H6 with authoritative membership intact, no new candidate; independent historical verification material/results for E4 now unavailable. All inline copies and other historical inputs retained. | Unsupported E4; **no complete projection**. H3 is only a supported READY prefix; E5/E6 cannot prove a complete successor state across the gap. No deletion, re-admission or today's Policy substitution. | P §§4.1, 5.3, 6 / D |
| 74 | P6/H5/E6; candidate resolver supplies a different profile text under the same L identifier, claiming EXECUTION_COMPLETED maps to FAILED. The pinned publication is available and contradicts it. | Reject / keep EXECUTING; demonstrated retargeting, not a profile update or local choice. | P §§2–3, 6; EC §6 / D |
| 75 | P1/H0/E1; use exact missing-schema materialization M75 in §4.8, including every embedded context and basis; digests retained | No accept—unsupported / no Lifecycle state; candidate cannot use an Action digest or remembered schema name as its missing semantic closure. No existing interpreted history supplies the missing material. | P §§2, 6 / D |
| 76 | P6/H5/E6; time assessment independent verification unavailable, and fact result refuted with its contrary basis | Reject / keep EXECUTING; known invalidity takes precedence over missing time verification. | P §4.1 / D |
| 77 | P6/H5/E6; SYNC fact unknown with literal FX; time assessment independent verification unavailable; exact final sets in §4.8 | No accept—unsupported / keep EXECUTING; unsupported precedes unestablished. Never turn missing evidence into failure or success. | P §4.1 / D |

The foreign J in case 72 is a fully specified **retained unsupported input**,
not a conforming eighth type. Its payload need not be interpreted to derive
the unavailability outcome. A positive replay of an imported Policy/approval
type would require its complete owner contract; this scenario deliberately
does not invent one. Case 71 is the positive mixed imported/local history of
known types; case 72 tests the additional foreign-type dependency boundary.

### 4.8 Exact final assessment and copy ledger

This ledger, together with the literal blocks, materializes each affected
input. It is a finite value definition, not an implementation or propagation
default. For its named baseline:

- F = the exact baseline fact record; T = its t/time record; M = its commit
  record (P6 only); V = its condition(0) record (P3); U = its condition(1)
  record and W = its condition(2) record (P4).
- S0 denotes the complete unchanged assessment set of that named baseline.
- F[r,b] replaces exactly F.result and F.basis by r and literal b.
  W[r,b] and M[r,b] have the same precise two-member meaning.
- T[r,b] replaces exactly T.result and T.basis. Tu(r) is T with source u,
  result r and basis TT; all other members remain T's exact values.
- F16..F23 replace exactly the binding member in cases 16..23; basis=F6
  except F19 additionally sets basis=F7 as specified by that row.
  F29 replaces source=b, role=execution, basis=FB. T47 changes only the
  binding.event_type to L(EXECUTION_STARTED); basis remains TT.
- Z43..Z46 and Z48 are exactly the malformed intervals specified by those
  rows; a point repeats the complete written endpoint as earliest and latest.
- A set written in braces lists **every** final member. All candidate envelopes,
  histories and C values stay their named baseline unless expressly changed.
  Payload.action remains A except M75. There are no unnamed additional records.

For every SYNC/AUTH row the independent establishment map contains an entry
for **each exact record in the authoritative-set column**, including its
post-mutation binding, source, result and literal basis. Unless the last column
specifies a failure/unavailability, each listed record has a separate verified
result with recognized scope for that exact record; C is independently verified
for the row's exact A/H. In 16–23 and 47 that establishes the *different*
asserted binding/fact, never its equality with the candidate. Payload-only
records have no new establishment entry. Unlisted records have no entry and
cannot borrow an original record's verification. These are explicit input-map
definitions, not a validation rule that returns verified from a copy.

| Case | Class | Complete authoritative S after mutation | Complete payload.assessments after mutation | Other exact input/establishment change |
|---|---|---|---|---|
| 16–23 | SYNC | {F16,T,M} through {F23,T,M}, respectively | The same respective three-record set | Each altered fact is verified for its own exact asserted binding; it mismatches candidate B. |
| 24 | SYNC | {T,M} | {T,M} | No F establishment entry. |
| 25 | AUTH | {F[unknown,FU],T} | {F,T} | Only the new unknown record has authoritative fact establishment; old payload F has none for this decision. |
| 26 | SYNC | {F[refuted,FR],T,M} | {F[refuted,FR],T,M} | Verified negative fact. |
| 27 | NONE | {F,T,M} | {F,T,M} | C and all three exact record establishment results unavailable. |
| 28 | NONE | {F,T,M} | {F,T,M} | T establishment failed; C,F,M verified. |
| 29 | SYNC | {F29,T,M} | {F29,T,M} | F29 establishment failed: b has only boundary grant; C,T,M verified. |
| 30 | SYNC | {F,F[refuted,FR],T,M} | {F,F[refuted,FR],T,M} | Both contrary fact records individually verified. |
| 31 | SYNC | {F,T} | {F,T} | No V establishment entry. |
| 32 | SYNC | {F,T,U,W[unsatisfied,KN]} | {F,T,U,W[unsatisfied,KN]} | Verified exact negative condition including the complete KN strict-bound-defect report, not a verification of correct Policy evaluation. |
| 33 | SYNC | {F,T,U,W,W[unsatisfied,KN]} | {F,T,U,W,W[unsatisfied,KN]} | Both contrary condition records individually verified, including K2 for W and the complete KN report for the negative record. |
| 34 | SYNC | {F,F[unknown,FX],T,M} | {F,F[unknown,FX],T,M} | Definite F6 and bounded FX observations independently verified as exact separate records; FX's cutoff does not truncate S or M. |
| 35 | SYNC | {F,T} | {F,T} | No M establishment entry. |
| 36 | SYNC | {F,T,M[not_committed,MN]} | {F,T,M[not_committed,MN]} | Verified negative commit. |
| 37 | SYNC | {F,T,M,M[not_committed,MN]} | {F,T,M,M[not_committed,MN]} | Both commit records individually verified. |
| 38 | SYNC | {F,T,Tu(Q),M} | {F,T,Tu(Q),M} | u independently recognized for this exact completion's time, not inferred from t. |
| 39 | SYNC | {F,T,Tu([q(1),q(2)]),M} | {F,T,Tu([q(1),q(2)]),M} | All verified; candidate occurred_at=Q. |
| 40 | SYNC | {F,T,Tu([q(2),q(3)]),M} | {F,T,Tu([q(2),q(3)]),M} | All verified; candidate occurred_at=Q. |
| 41 | SYNC | {F,T[unknown,TU],M} | {F,T[unknown,TU],M} | Verified uncertain time; candidate occurred_at=Q. |
| 42 | SYNC | {F,M} | {F,M} | No T establishment entry; candidate occurred_at=Q. |
| 43–46,48 | SYNC | {F,T[Zi,TB],M}, i is the exact case number | The same respective three-record set | Candidate occurred_at=Zi; verification establishes origin, not domain validity. |
| 47 | SYNC | {F,T47,M} | {F,T47,M} | Time established for invocation, not the candidate's completion. |
| 49 | NONE | {F,T,M} | {F,T,M} | Only candidate occurred_at=[q(0),q(0)]. |
| 50 | COPY | {F,T,U,W} | {F,T,U,W without basis member} | Authoritative W still has literal K2; no payload-only record is established. |
| 51 | COPY | {F,T,U,W} | {F,T,U,W} | Only payload.context.conditions[2].evaluator absent; every binding.context still C. |
| 52 | COPY | {F,T,U,W} | {F,T,U,W} | Only payload.context.conditions[2].inputs absent; every binding.context still C with T-PI. |
| 53 | NONE | {F,T,U,W} | {F,T,U,W} | C establishment unavailable; exact assessment establishments retained. |
| 54–56 | SYNC | Si defined immediately below | Si | C=Ci and payload.context=Ci; C establishment failed for missing actual Policy contract; each exact Si record independently authentic and scoped. |
| 60 | COPY | {F,T,M} | {F,T,M} | Only payload.context.commit_required=integer 1; C and every binding.context retain Boolean true. |
| 75 | SYNC | {F75,T75} | {F75,T75} | Exact M75 bundle below; C and both record establishment results unavailable; none failed. |
| 76 | SYNC | {F[refuted,FR],T,M} | {F[refuted,FR],T,M} | T establishment unavailable; C, new negative F and M verified. |
| 77 | SYNC | {F[unknown,FX],T,M} | {F[unknown,FX],T,M} | T establishment unavailable; C, the exact unknown record with completed FX observation, and M verified. M does not replace the missing established fact record. |

For each i=54,55,56, define Ci as C with **only**
conditions[2].contract replaced by PN, PD, PU respectively. T-PI is unchanged:
it contains input values, not a hidden copy of the Policy contract. Define
Fi,Ti,Ui,Wi by replacing the whole binding.context of F,T,U,W respectively
with Ci; Wi additionally replaces basis K2 with PB. Si is exactly
{Fi,Ti,Ui,Wi}. Final payload is {action=A, context=Ci, assessments=Si}.
Thus all five embedded contexts (outer plus four assessment bindings) and the
independent context agree; the Policy rationale copy is explicitly replaced.
No favorable basis elsewhere embeds the missing Policy restrictions.
The failed independent context result records the single completeness fault:
actual applicable contract/edition unavailable in a known name/digest/locator
substitution. It is not a failed raw-authentication test or automatic parsing
of arbitrary Policy Text.

M75 is the following exact unavailable-material experiment, not deletion of an
Action field or insertion of a null:

1. Keep A's occurrence, digest, schema digest, semantic fields and empty bound
   fields, but make the selected schema definition/descriptor dependency
   unavailable in both the independently supplied A material and payload.action
   material. Keep Action-owner contracts available. No history exists in H0.
2. Define C75 as C with conditions[0].contract=MS, conditions[0].inputs=MS
   and execution_terms=ME. The other members retain their exact baseline
   values. They retain identity/Policy inputs, not the missing schema definition.
3. F75 is F with binding.context=C75 and basis=MF; T75 is T with
   binding.context=C75 and basis=MT. These are the complete two-record sets
   shown in the ledger; there is no condition(0) assessment in P1.
4. Independent C=C75; payload.context=C75; payload.assessments={F75,T75}.
   This replaces all three candidate copies of the context (outer plus two
   bindings), including every T-VC/T-VI/T-EXEC copy. The admission and time
   bases are replaced by the complete literals MF/MT, not partially redacted.
   No original schema-derived explanation is retained as an alternative
   resolution source. Recorded digests/identifiers do not restore that material.
5. The independent Action-owner material check, C establishment and both exact
   record establishments are unavailable because the schema cannot be
   interpreted. There is no known false binding or failed verification.
   Missing closure therefore yields unsupported, not a synthetic null-field
   rejection. No fixture may assert complete C establishment for this input.

Rows 34,35,38,41,42 and 77 retain their stated outcomes **only for the explicitly
synchronized sets above**, not for a frozen baseline payload. If instead their
payload were left at S0, each would reject for mismatch. Row 25 intentionally
keeps that mismatch and changes outcome. This distinction is part of the
inputs, not consumer discretion.

FX and KN are complete **synthetic scenario inputs**, not reports obtained from
a real observer or evaluator. The FX record's observation cutoff is the stated
material-invocation observation boundary, not a clock reading, transport event,
new Event or cutoff on the complete decision snapshot S. Its candidate binding
in both 34 and 77 is exactly B(E6): A's occurrence/content and empty additional
fields, L(EXECUTION_COMPLETED), I(6), prior head I(5), sequence 60 and the entire
unchanged C. Where present in the ledger, F6 and MC retain their exact baseline
terminal observations in the same decision snapshot, outside FX's bounded
observation record. FX does not deny those observations or treat submission
as settlement. No time interval is inferred from its observation cutoff.

KN names a synthetic implementation version and states its entire relevant
evaluation defect inline; that version is not a missing executable dependency,
new field or additional Policy. In 32/33 the negative record has B(E4),
source a, role authorization, statement condition(2), result unsatisfied and
the exact complete KN basis. In 85/87 it has B(E2) instead; the Action and C
remain the same, but the Event/type/head/sequence binding is that of E2.
Every occurrence of KN or FX in these authoritative sets and their payload
copies means the entire revised literal above, without substitution. Each
independent establishment entry is keyed to that exact resulting six-member
assessment, including the entire revised basis. No former short-basis record
or its establishment result is retained as an alternative or reused. This is
explicit establishment input, not authenticity inferred from either Text.

### 4.9 Additional distinguishing classes

The following are appended, not renumbered. Bracketed intervals are semantic
earliest/latest records, not a time serialization. In 82–83 the unchanged
literal TT describes exactly the new structured interval; it contains no
embedded copy of Q. All new exact assessment establishments are independently
verified except the explicit scope failure in 84.

| Case | Complete baseline / final authoritative and payload inputs | Expected result and projection; exact reason | Source / class |
|---|---|---|---|
| 78 | P2/H1/E2; SYNC S={F[refuted,FQ],T}; payload S={F[refuted,FQ],T}; C unchanged | Reject / keep CREATED; queue placement without actual validation commencement does not establish validation start. | P §4, §4.1(2); VE-003 §10 / D |
| 79 | P5/H4/E5; SYNC S={F[refuted,XQ],T}; payload S={F[refuted,XQ],T}; C unchanged | Reject / keep AUTHORIZED; preparation/queueing without material invocation does not establish execution start. | P §4, §4.1(2); VE-005 §§7–10 / D |
| 80 | P6/H5/E6; NONE, mathematical S={F,T,M} and payload S={F,T,M}; enumerate authoritative members M,F,T and payload members T,M,F; establishments for exact F,T,M unchanged | Accept / COMPLETED; enumeration order cannot change set equality or projection. The enumerations are not ordered semantic lists. | P §§4.1, 5.3 / D |
| 81 | P6/H5/E6; NONE, supply authoritative enumeration F,T,F,M and payload enumeration M,T,F,F; both denote exactly S={F,T,M}; one unchanged establishment per exact record | Accept / COMPLETED; identical duplicate assessments collapse, unlike distinct Event reuse or duplicate record member names. No assessment or contrary result is discarded. | P §§4.1, 5.3 / D |
| 82 | P6/H5/E6; R=[q(0),q(0)]; SYNC S={F,T[R,TT],M}, payload S={F,T[R,TT],M}; candidate occurred_at=R | Accept / COMPLETED; a point bound is valid when independently established, not merely producer narrowing as in 49. | P §§4.1(5), 5.2 / D |
| 83 | P6/H5/E6; R=[(2026,11,17,15,0,0,1,3),(2026,11,17,15,0,0,2,3)]; SYNC S={F,T[R,TT],Tu(R),M}, payload S={F,T[R,TT],Tu(R),M}; candidate occurred_at=R | Accept / COMPLETED; equal inclusive nonzero reduced-rational uncertainty bounds agree exactly. Both time sources independently establish that exact completion interval. | P §§4.1(5), 5.2 / D |
| 84 | P6/H5/E6; NONE S={F,T,M}, payload S={F,T,M}, C unchanged. Independent x/execution fact grant recognizes only EXECUTION_STARTED, not EXECUTION_COMPLETED; F establishment failed for exact fact scope. C,T,M remain verified, including x's separately retained commit grant | Reject / keep EXECUTING; matching source/role and exact B do not supply the missing recognized completion-fact scope. No copied grant can expand it. | P §4.1(1) / D |
| 85 | P2/H1/E2; let W2 be the six-member condition(2) record with B(E2), source a, role authorization, result satisfied, basis K2; W2n differs only by result unsatisfied and basis KN. SYNC S={F,T,W2,W2n}, payload S={F,T,W2,W2n}; all exact records independently verified for E2 | Reject / keep CREATED; generic conflicting definite results for the same optional statement. This kind does not require Policy satisfaction, so neither an unsatisfied required condition nor refuted fact independently masks contradiction. | P §4.1(3) and same-statement conflict rule / D |
| 86 | P7/H5/E7; SYNC S={F[unknown,FU],T}, payload S={F[unknown,FU],T}; C unchanged; both exact records verified | No accept—unestablished / keep EXECUTING; timeout/no response cannot establish known failure. Unlike 25, no payload mismatch exists. | P §§4.1, 6; VE-004 §§7–8 / D |
| 87 | P2/H1/E2; W2n exactly as in 85; SYNC S={F,T,W2n}, payload S={F,T,W2n}; all exact records verified | Accept / VALIDATING; a single negative optional Policy condition neither contradicts another result nor triggers a success/authorization requirement for validation commencement. Positive control for 85. | P §4.1(3) and conflict rule / D |

## 5. Pressure-test disposition and remaining decisions

### 5.1 What can be determined without local defaults

For cases 01–87 the profile supplies enough rules to derive the displayed
**acceptance/non-acceptance and complete-projection boundary** from the
specified established inputs. No new semantic ambiguity is identified within
that boundary. The matrix fixes source scopes, whole context, assessment sets,
Action/fact/Event/head bindings, interval equality, explicit absence and
dependency availability rather than leaving an implementation to choose them.
The same inputs therefore do not permit different accepted Lifecycle states.

The two previously incomplete explanation values are now fully specified.
Re-derivation from the materialized sets closes the following six cases without
changing any expected outcome or adding a case:

| Case | Outcome and projection | Derivation from the completed inputs |
|---|---|---|
| 32 | Reject; keep READY | The sole condition(2) result is unsatisfied with the actual reported KN defect. This required denial is independently sufficient; no contrary condition result or missing explanation is needed. |
| 33 | Reject; keep READY | Complete K2 and KN records report contrary definite results. The required denial is already disqualifying, so this remains a compound defense, not the contradiction isolate. |
| 34 | Accept; COMPLETED | The exact FX observation explains unknown completion from observed invocation only. It does not refute the separate established F6 fact; required time and committed MC remain established. |
| 77 | Unsupported; keep EXECUTING | FX is a complete unknown fact assessment and MC remains committed, but no established fact record exists and required time verification is unavailable. Unsupported takes precedence over unestablished; missing verification creates no terminal fact. |
| 85 | Reject; keep CREATED | K2 and KN are complete, independently established contrary definite condition(2) results for E2. That condition is optional for validation commencement; only the same-statement contradiction disqualifies this otherwise valid input. |
| 87 | Accept; VALIDATING | Complete KN alone reports a negative optional condition, with no contrary condition result. Actual validation commencement and its time remain established; the recorded evaluator defect adds no Policy-satisfaction requirement to this kind. |

In §5.2 the previously unconfirmed four written-rule obligations are now
supported: required-condition unsatisfied (32), unknown-extra invariance (34),
optional definite contradiction (85), and negative optional control (87).
The 70-obligation map is retained after checking each mapped rule against its
explicit input; completing these four explanations does not add four new
obligations. This is written-contract derivation, not experimental confirmation.

Three limits must not be silently completed by executable fixtures:

| Issue / affected criterion | What authority already supplies | Smallest compliant treatment |
|---|---|---|
| Authenticating raw material or deciding real fact truth; criteria 2 and 6 | P §4.1 explicitly consumes independent established results and scoped grants, with failure/unavailability rules. It does not implement their owners. | Supply these results as the explicit semantic test inputs above. A later operational test needs the owner's actual contract and evidence, not an `admitted=true` shortcut. No new clock/trust architecture is required for this matrix. |
| Arbitrary owner text, evaluator version or imported Policy type missing; criteria 1, 2 and 6 | P §§2, 4.1, 5.3 and 7 require actual immutable meaning and inline explanation. A source name, version label, digest or URL cannot stand in for missing meaning. | Exercise the specified unsupported/rejection boundary. Do not invent positive foreign-type semantics or an evaluator-version field. If a deployment needs reference-only explanation, close that owner-specific contract and publish new profile identifiers through governance. |
| Exact partial replay output or diagnostic spelling; criteria 5 and 6 | P §6 deliberately supplies a safety boundary, not a generalized partial-replay algorithm; it does not name a standard code for unselected competing proposals. | Compare retained membership, no append, no complete projection and any explicitly established prefix. Do not demand identical speculative later partial states or encode a scenario-local diagnostic as normative. Broader output standardization would need a separately reviewed Draft clarification with identifier revision if meaning changes. |

These are bounded applicability/output limits, not permission to infer unknown
inputs. A test demanding arbitrary Policy re-execution, a positive interpretation
of J, or a standardized full partial-state trace cannot be completed from this
profile alone. That would be an expanded task, not a passing instance of the
matrix. No conflict requiring an Approved semantic change is demonstrated here.

### 5.2 Coverage accounting: rows are not evidence

The 87 rows are classified disjointly as follows. These counts describe
**documented tests**, not executed or independently demonstrated results.

| Classification | Cases | Count |
|---|---|---|
| Positive transition mapping | 01–07 | 7 |
| Positive boundary/control | 12,70,82,83,87 | 5 |
| Isolated negative/non-acceptance | 08,09,10,11,15,16,17,18,19,20,21,22,23,24,26,27,28,29,31,32,35,36,39,40,41,42,43,44,45,46,47,48,49,53,54,55,56,57,58,59,61,62,63,64,65,67,68,69,72,73,74,75,78,79,84,85,86 | 57 |
| Compound defense | 25,30,33,37,50–52,60,76–77 | 10 |
| Equivalence/invariance | 14,34,38,66,71,80–81 | 7 |
| Intentionally redundant illustration | 13 (same upper-domain defect as 59, following exhaustion) | 1 |
| **Total** | **01–87** | **87** |

A negative row outside the compound/redundant classes is specified with its
stated fault as an independently sufficient non-acceptance reason and without
a separate deliberately introduced invalidity. This is not a claim that an
implementation must run checks in a particular order or choose a standard
diagnostic spelling. Compound cases explicitly exercise simultaneous defects
or precedence and do not count as isolating their second condition. In
particular 30/33/37 cannot alone prove generic contradiction handling;
85, with control 87, covers that branch. Cases 39/40 and 54–56 are distinct
boundary/substitute equivalence classes of one respective rule, not inflated
claims of different normative algorithms.

The following map counts **70 documented, independently isolated semantic
branch obligations** under its explicitly stated taxonomy. “Isolated” means
the example separates that written rule, not that independent software has
demonstrated it. The number of empirically or independently demonstrated
profile-conformance branches remains **zero**. Compound-only assertions
(copy-corruption defense in 25/50–52/60, favorable-result defenses in
30/33/37, and precedence in 76/77) are supplementary and are not added to
this isolated-branch count.

| Claimed branch or family | Isolating/control case(s) | Count and interpretation |
|---|---|---|
| Seven distinct positive transition mappings | 01–07 | 7: Seven obligations, one per kind; not seven generic acceptance duplicates. |
| Illegal shortcut / post-terminal transition | 08; 09 | 2: Two transition-legality branches. |
| Unique authoritative successor selection | 10 | 1: No selection by proposed ordinal or time. |
| Strictly increasing append ordinal | 11 | 1: In-range equality with predecessor fails. |
| Sequence domain upper/lower bounds | 59; 58 | 2: Two isolated domain failures; 13 is redundant with 59. |
| Sequence boundary and gaps accepted | 12; 70 | 2: Maximum-with-gap and zero initial ordinal are two positive boundaries. |
| Authoritative sequence, not delivery or equal time | 14 | 1: Permutation of one established history; one invariance. |
| Occurrence ID non-reuse / width | 15; 57 | 2: Two distinct checks: valid-width reuse versus malformed width. |
| Exact binding components | 16–23 | 8: Eight independently mutated components: occurrence, content, bound fields, type, Event ID, head, ordinal, whole context. |
| Required fact missing / known refuted / uncertain | 24; 26; 86 | 3: Three result branches; 25 is not the uncertainty isolate. |
| Independent establishment missing / failed | 27; 28 | 2: Two branches, not assertions inferred from copies. |
| Granted role / recognized exact fact scope | 29; 84 | 2: Two scopes; correct role alone does not close fact authority. |
| Required condition missing / unsatisfied | 31; 32 | 2: Two required-condition branches. |
| Optional definite contradiction / negative optional control | 85; 87 | 2: Two branches; no required-condition denial masks 85. |
| Unknown extra assessment does not refute definite fact | 34 | 1: One positive invariance. |
| Required commit missing / definite non-commit | 35; 36 | 2: Two completion-specific branches. |
| Time identical corroboration / unequal corroboration | 38; 39,40 | 2: Two branches; touching and disjoint bounds are documented sub-boundaries of the same unequal-bounds branch, not two independent algorithms. |
| Time unknown / missing | 41; 42 | 2: Two required-time branches. |
| Time endpoint and interval domains | 43; 44; 45; 46; 48 | 5: Five separate checks: calendar, nonzero denominator, reduced rational, non-reversed interval, leap-label exclusion. |
| Time fact binding / exact Event interval equality | 47; 49 | 1: Exact Event interval equality is additional. Case 47 applies the already-counted type-binding check to time evidence; it is not another branch of that generic check. |
| Valid point / valid rational uncertainty | 82; 83 | 2: Two positive time-domain boundaries. |
| Applicable historical edition cannot be inferred from copy | 53 | 1: One independent material-availability branch. |
| Indirect Policy explanation is incomplete | 54–56 | 1: One completeness branch with three distinct substitute classes; no current-context mismatch. |
| Forbidden actor / component / references | 61; 62; 63 | 3: Three empty-domain field checks; 62 uses non-null Text. |
| Required non-null payload / occurrence time | 64; 69 | 2: Two required-field null checks. |
| Closed nested explanation / opaque top-level extension | 65; 66 | 2: Two branches: nested rejection and top-level invariance. |
| Duplicate member name | 67 | 1: Not assessment-set duplicate collapse. |
| Required payload cannot be supplied via unknown field | 68 | 1: One absence branch, separate from payload=null. |
| Lossless imported/local known history | 71 | 1: One provenance-preserving invariance. |
| Unsupported retained type / historical establishment | 72; 73 | 2: Two missing-dependency branches; neither claims generalized partial replay. |
| Immutable type retargeting / missing Action closure | 74; 75 | 2: Two dependency integrity/availability branches. |
| Assessment-set order / exact duplicates | 80; 81 | 2: Two independent set invariances. |
| Actual commencement / invocation rather than queueing | 78; 79 | 0 additional: Two required type-specific adversarial examples of the already-counted fact meanings and refuted-result branch, not new generic rejection algorithms. |

This is bounded coverage, not an assertion that every legal combination,
base-field domain or arbitrary Action/Policy contract has been enumerated.
For example the seven selected kinds are not all Lifecycle kinds; foreign
positive-type replay and real source authentication remain excluded. The
matrix does not need those rules invented to give its own bounded outcomes.

### 5.3 Acceptance-criteria accounting

| Gap-analysis §10.2 criterion | Coverage and honest disposition |
|---|---|
| 1: seven kinds and immutable dependencies | §2 pins exact publication and transitive source selection; 01–07 cover every type; 19, 72, 74–75 prevent name-based substitution and missing-material completion. Source Draft maturity remains explicit. |
| 2: exact facts/evidence and existing transitions | 01–10, 16–37, 76–87 exercise evidence scope, source recognition, contradiction/uncertainty and existing transitions. A fixture's verified input is not evidence that a production verifier is correct. |
| 3: time and field domains | 14, 38–49, 57–70 and 80–83 cover identical/different intervals, malformed domains, exact fact time, presence, nulls and extensions. No new timestamp or explanation format is defined. |
| 4: history/identity/order/failure | 10–15, 21–22, 58–59, 70–77 preserve protected selection, uint64 bounds, immutable IDs and retained unsupported history. |
| 5: traceable examples | All 87 have explicit sources, literal Text and final-value ledgers; the coverage taxonomy distinguishes 76 nonredundant non-compound rows from 10 compound defenses and one redundant row. They are prose cases, not execution or exhaustive §21 coverage. |
| 6: independent meaning | Written-case derivability is supported at the established-input boundary; independent implementations and independent-team results are still absent. No parser, cryptography, concurrency or production clock claim follows. |
| 7: compatibility/governance | Approved ownership remains unchanged. The new profile's identifiers/input interface/inline-only explanation/UTC interval choices still require human acceptance; no approval is granted here. |

### 5.4 Can executable fixtures now be created?

**Yes for direct transcription of these bounded semantic inputs and outcomes**,
using the delimited literal Text, named immutable semantic dependency bundle,
complete final assessment sets and exact independent establishment maps. No
uncompleted FX/KN observation or rationale is left to the transcriber: their
whole literal values, candidate bindings, payload copies and establishment
entries are fixed, including the six-case derivation in §5.1. This bounded
readiness has no outstanding explanation-completion condition. Do
not extract fixture Text from source documents or generate a rationale from
a result label. The document's direct-transcription claim concerns these
conditional established-input cases, not a raw verifier or arbitrary schema
interpreter. Reproduction must preserve the pinned owner's exact material;
a missing local copy is not permission to invent it. Compare
acceptance, retained membership and the stated projection boundary.
That does not require new semantics, wire encoding, real authentication or a
clock service. It must preserve separate independent establishment inputs and
must not read producer copies as authentication. Missing-material cases must
actually remove the designated dependency from the relevant interpretation
input, not replace a check with a hard-coded expected failure.

**No claim is made for a complete general profile conformance suite.** Positive
foreign-type replay, arbitrary Policy evaluation, real-world input establishment,
lossless packaging and generalized partial-history output remain outside this
matrix. A future executable task must retain these boundaries, record its own
source pins and oracle provenance, and disclose authorship/independence. Neither
this document nor the historical experiment supplies that future result.

Policy-reference deferral is justified only for the inline subset. Cases
04 and 50–56 preserve authorization and historical explanation duties;
case 72 keeps mixed-history Policy dependencies visible. Human approval paths
need their existing Events and exact owners; they cannot be bypassed using the
no-approval fixture. There is no new primitive, authority role or Approved
specification amendment, so this non-normative addition requires no RFC/ADR.
A later discovered Approved conflict must instead identify the affected rule
and follow RFC, Accepted ADR and governed specification change procedures.

**Representation readiness remains unestablished.** The next possible evidence
task is implementation of this separately pinned semantic matrix, only when
authorized; it is not begun here. Draft approval, independent-team replication
and representation design are separate decisions.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.3 | 2026-09-23 | Complete synthetic FX invocation-observation cutoff and KN owner-reported evaluator-defect rationale; bind all six affected cases and establishment maps to those exact literals. Re-derive unchanged outcomes; confirm the existing 87-case partition and 70 written-rule obligations without claiming executable conformance. |
| 0.2 | 2026-09-23 | Explicit AUTH/SYNC/COPY materialization and establishment maps; literal explanation values; isolated negative branches; ten appended cases; honest coverage taxonomy. Case 25 now rejects its frozen payload mismatch; 58 uses empty history to isolate the lower domain; no profile or implementation changes. |
| 0.1 | 2026-09-23 | Initial non-normative 77-case established-input matrix for the exact pinned lifecycle profile Draft v0.2; no profile, experiment, fixture or workflow changes. |
