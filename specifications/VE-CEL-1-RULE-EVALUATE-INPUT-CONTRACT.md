---
id: VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
title: VE-CEL-1 Rule Evaluate Input Contract
version: "0.2"
status: Draft
document_type: Candidate Specification
category: Specification
author: Verified Execution Editorial Board
created: 2026-08-27
updated: 2026-09-12
depends_on:
  - VE-001
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - VE-CBOR-1-CLAIM-BODY-SCHEMA
  - VE-CLAIM-REFERENCE-SEMANTICS
  - PREDICATE-SCHEMA-SEMANTIC-CONTRACT
  - PREDICATE-SCHEMA-FIELD-SEMANTIC-REPRESENTATION-GRAMMAR
  - ADR-RULE-001-002
  - ADR-VERIFY-002
related_documents:
  - CLAIM-BODY-ED25519-COSE-SIGN1-VERIFICATION-PROFILE
  - PRESSURE-TEST-VERIFIED-CLAIM-RULE-EVALUATE-INPUT-MAPPING
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# VE-CEL-1 Rule/Evaluate Input Contract

## Status and authority boundary

This Draft v0.2 is the bounded engine-binding specification delegated by
Accepted ADR-RULE-001/002. Its requirements apply only to implementations
claiming conformance with this Draft. It does not amend Approved Action or
Predicate specifications, Accepted Rule/Evaluate architecture, Claim
semantics, verification, VerificationContext, trust, authorization, or CEL.

Accepted ADR-RULE-001/002 fixes exactly two immutable top-level bindings:

```text
action
claims
```

This Draft adds no third binding. It defines the deterministic semantic
projection into those bindings, pins the CEL language snapshot used by the
profile, and implements the accepted requirement that a CEL Claim list be
ordered by content digest in ascending bytewise order.

This Draft creates no `Fact`, `EstablishedClaim`, `claim_id`, semantic
`claim_digest`, generic reference, registry, resolver, verification object, or
new VE primitive. The ordering digest defined below is profile-local mechanics
and is never CEL-visible.

## 1. Normative closure and applicability

The complete closure for this Draft is:

```text
ADR-RULE-001/002 v0.1 (Accepted)
VE-001 Action Specification v0.2 (Approved)
VE-001 Action Canonical Representation Profile v0.1 (Draft)
VE-CBOR-1 Claim Body Schema v0.2 (Draft)
Canonical Claim Reference Semantics v0.2 (Draft)
Predicate Schema Semantic Contract v1.2 (Approved)
Predicate Schema Field-Semantic Representation Grammar v1.0 (Approved)
ADR-VERIFY-002 v0.1 (Accepted)
CEL specification v0.25.2 at the immutable revision in Section 2
this VE-CEL-1 Draft v0.2
```

An implementation MUST be explicitly invoked with this exact profile and with
all applicable governed Action and Predicate Schemas retained locally. It MUST
validate the Action and every selected Claim body under their governing
closures before projection. Unknown, unavailable, unsupported, inconsistent,
or nonconforming governing material makes input construction fail with
`EVALUATION_ERROR`; an implementation MUST NOT guess, retrieve “latest”
material, or partially project an input.

The profile accepts only Claim bodies supported by Claim Body Schema Draft
v0.2. Consequently, every admitted Claim body contains exactly
`subject_reference`, `issuer_ref`, `predicate`, and `value`; the currently
unsupported `assertion_time` and `observation_time` fields are not projected.

## 2. Pinned CEL language authority

VE-CEL-1 uses the official `cel-expr/cel-spec` release snapshot:

| Property | Pinned value |
|---|---|
| Project | Common Expression Language specification |
| Repository | `https://github.com/cel-expr/cel-spec` |
| Release tag | `v0.25.2` |
| Git commit | `cb51b4176013ad19bd00df94be273c322916a620` |
| Language authority | `doc/langdef.md` at that commit |
| Conformance corpus | `tests/` at that commit, restricted by this profile |

The tag and commit MUST identify the same tree. A moving branch, an unversioned
web page, a library's default environment, or a later CEL release is not the
language authority for this profile version.

The pinned CEL language supplies parsing, standard value semantics, ordinary
operator behavior, error and unknown propagation, and the standard macros and
functions that this Draft explicitly permits. This profile deliberately uses
only a closed subset. A conforming implementation MUST parse and type-check the
Rule against that subset before evaluation. Passing one implementation's
parser is not sufficient when the expression is outside the pinned grammar or
this profile.

Rule source MUST be valid UTF-8 and already Unicode NFC. No normalization is
performed by CEL or by this binding. The exact source remains part of the Rule
artifact under ADR-RULE-001/002.

## 3. Exact evaluation environment

The CEL activation is exactly:

```text
action : map<string, dyn>
claims : list<map<string, dyn>>
```

The use of `dyn` is limited to values already validated and projected under a
known governed schema. It permits one list to carry Claims governed by
different Predicate FieldForms. It is not permission for arbitrary JSON,
arbitrary CBOR, host objects, reflection, or unchecked dynamic input.

There are no implicit bindings for time, environment, verification, trust,
authority, evidence, Adapter state, Execution Rights, Events, Receipts,
resources, or host services. Evaluation MUST have no network, filesystem,
clock, randomness, mutable state, environment-variable, or implementation-
specific extension access.

Input construction is a pure function of the validated Action, the explicit
immutable eligible-Claim collection, retained governing schemas, and this
exact profile version.

## 4. Exact `action` binding

After validating the authoritative Action, recomputing its profile-defined
digests, and resolving its governing Action schema, the exact binding is:

```text
action = {
  "action_id":     bytes,
  "action_digest": bytes,
  "schema_digest": bytes,
  "fields":        map<string, dyn>
}
```

The three identities are exact raw 32-octet values mapped to CEL `bytes`, not
hexadecimal or base-encoded text. In particular:

```text
action_id != action_digest
```

`fields` is the recursively projected normalized semantic-field map `F` from
the applicable governed Action schema. It contains no schema digest, Action
identifier, execution metadata, verification material, Execution Right,
Adapter state, evidence, lifecycle state, Receipt, or implementation data. It
exposes Action semantics, not raw canonical-CBOR storage.

### 4.1 Action-field conversion

Each Action schema MUST close admission, normalization, member presence, and
semantic ordering before this profile is applied. Its normalized values use
the Section 7–9 runtime-category rules: Boolean to `bool`; mathematical integer
by Section 8; normalized text to `string`; byte string to `bytes`; closed map
to `map<string, dyn>` recursively; and semantic sequence to `list<dyn>`
recursively while preserving normalized schema-governed order.

An Action schema admitting another category is inapplicable. An absent optional
semantic field is omitted from `action.fields`; it is never replaced by `null`
or a default. Exact normalized field names become CEL string keys. Dot
selection is available only for names that are valid CEL identifiers; bracket
selection using the exact string key remains available otherwise.

### 4.2 Action consistency failures

The following fail before CEL with `EVALUATION_ERROR`: wrong type or width for
an identity; digest recomputation mismatch; an occurrence record inconsistent
with the presented `(action_id, action_digest)` pair; unavailable, unsupported,
or mismatched schema; missing required, unknown, or duplicate fields; an
unsupported runtime category; or an Integer outside Section 8.

The same semantic content with a different valid `action_id` is a distinct
projectable Action occurrence and changes only `action.action_id`.

## 5. Claim eligibility boundary

A Claim enters `claims` if and only if:

1. its exact body conforms to Claim Body Schema Draft v0.2 and its retained
   Predicate Schema;
2. an applicable Claim verification profile successfully verified that exact
   canonical body under the applicable VerificationContext; and
3. the surrounding Evaluate/host context explicitly selected the Claim as
   eligible input for this invocation.

The collection is explicit. VE-CEL-1 MUST NOT verify a Claim, discover an
issuer, select a key or trust root, retrieve a schema, decide evidence truth,
infer freshness, rank verification methods, or choose Claims by perceived
usefulness. Supplying a Claim that fails condition 1 or 2 is
`EVALUATION_ERROR`. A verified Claim not selected under condition 3 is absent
because the host did not select it, not because this binding filtered it.

A successfully verified but factually false Claim, or one backed by
unauthenticated evidence, may enter when explicitly selected: verification
establishes exact-body authorship, not truth.

```text
verified Claim != true Claim != authorization
```

Verification identifiers, artifacts, keys, signer data, diagnostics, and
VerificationContext material are never CEL-visible.

## 6. Exact single-Claim representation

Every eligible Claim contributes exactly:

```text
{
  "subject_reference": SubjectReferenceView,
  "issuer_ref":        IssuerValue,
  "predicate":         bytes,
  "value":             ClaimValue
}
```

All four keys are required and no others are permitted. `predicate` is the
exact 33 raw PSCID octets as CEL `bytes`. `issuer_ref` and `value` are projected
under `issuer_domain.identifier` and `value_semantics.value`. No `claim_id`,
`claim_digest`, verification, evidence, timestamp, default, or `null` member is
added.

### 6.1 Subject-reference views

The four arms map to structurally disjoint closed maps:

```text
ActionContentReference    -> { "action_digest": bytes }
ActionOccurrenceReference -> { "action_id": bytes, "action_digest": bytes }
EventReference            -> { "event_id": bytes }
ExternalSubjectReference  -> { "identifier": ExternalIdentifierValue }
```

Action/Event values are the exact raw 32 octets. The external identifier uses
`subject_domain.identifier`; absence of applicable resolved subject-domain
semantics fails input construction. Shape discriminates the closed union. No
`kind`, `reference_kind`, `Reference`, `EntityReference`, or generic reference
primitive is introduced.

## 7. Recursive FieldForm-to-CEL conversion

`ToCEL(form, value)` below is specification notation, not a Rule-visible
function:

| Governed FieldForm | Required CEL value |
|---|---|
| `boolean` | `bool`; no coercion. |
| `integer` | `int` or `uint` exactly as Section 8. |
| `text` | `string` with the exact already-normalized scalar sequence. |
| `bytes` | `bytes` with the exact octets. |
| `record` | `map<string, dyn>` by Section 9.1. |
| `sequence` | `list<dyn>` by Section 9.2. |

Conversion begins only after all FieldForm bounds, allowed values, scale,
normalization, record closure, sequence cardinality, uniqueness, and ordering
rules pass. It performs no case folding, normalization, rescaling, parsing,
stringification, hex/base64 conversion, defaults, aliases, or unit conversion.

The current closure has no runtime null, float, decimal, timestamp, duration,
protobuf message, or arbitrary-object form. Such a value yields
`EVALUATION_ERROR` before evaluation.

## 8. Mathematical Integer mapping

For admitted mathematical integer `x`:

```text
if -9223372036854775808 <= x <= 9223372036854775807:
    ToCEL(integer, x) = CEL int(x)
else if 9223372036854775808 <= x <= 18446744073709551615:
    ToCEL(integer, x) = CEL uint(x)
else:
    EVALUATION_ERROR before CEL
```

| Value | Result |
|---:|---|
| `-9223372036854775808` | `int` |
| negative in-range value | `int` |
| `0` | `int` |
| `1` through `9223372036854775807` | `int` |
| `9223372036854775808` through `18446744073709551615` | `uint` |
| either out-of-range neighbor | `EVALUATION_ERROR` |

A nonnegative value representable by both types always maps to `int`. There is
no float conversion, saturation, wraparound, modulo reduction, implementation
big integer, or decimal-text fallback. Predicate Integer semantics remain
mathematical; this profile only bounds its CEL-compatible subset.

## 9. Composite values

### 9.1 Record

A validated record becomes `map<string, dyn>`. Each present governed member
appears once under its exact NFC name; required members are present; optional
members may be omitted; unknown, duplicate, null, and defaulted members are
absent; and values convert recursively. Map insertion order has no meaning.

A Rule MUST use `has(record.member)` before reading an optional member on a path
where it may be absent. Access to an absent optional member maps to
`INDETERMINATE`; access to an undeclared member is a static profile violation
and maps to `EVALUATION_ERROR`.

### 9.2 Sequence

A validated sequence becomes `list<dyn>`. Members convert recursively;
multiplicity and emptiness are preserved; and this binding neither adds,
removes, deduplicates, nor sorts members. It preserves the exact normalized
semantic order produced by Claim-body validation.

For `ordering_significant: true`, source semantic order is preserved. For
`false`, Claim Body v0.2 has already established ascending canonical-member-
byte order. A uniqueness violation has already failed validation; duplicates
remain when uniqueness is false.

## 10. Deterministic `claims` list construction

Accepted ADR-RULE-001/002 requires ascending bytewise content-digest order when
Claims use a list. The ADR delegates, and this Draft selects, the exact
subordinate mechanics:

### 10.1 Ordering algorithm

1. obtain `B(c)`, the validated canonical Claim.body bytes;
2. compute `D(c) = SHA-256(B(c))`, exactly 32 raw octets;
3. form `(D(c), B(c))`;
4. sort ascending lexicographically by unsigned octets of `D(c)`;
5. for equal digests, sort ascending lexicographically by unsigned octets of
   complete `B(c)`; and
6. project the ordered bodies through Sections 6–9.

No frame, length prefix, wrapper, hexadecimal conversion, locale, host
comparator, or input-order fallback participates. At the first differing octet
the lower octet sorts first; a proper prefix sorts first.

`D(c)` is invisible profile-local ordering mechanics, not `claim_digest`, a
Claim field, semantic or occurrence identity, a reference target, evidence, or
verification metadata.

Byte-identical bodies have identical tuples and projected values. Every
occurrence remains; their permutation is unobservable but their cardinality is
not. Distinct bodies colliding on the digest are totally ordered by canonical
body bytes.

### 10.2 Critical dependency result

The Claim-body representation dependency recorded by Draft v0.1 is resolved by
Claim Body Schema Draft v0.2. Its canonical body bytes now supply `B(c)` without
a Claim identity or new field. The remaining digest selection, collision
tie-break, and projection mechanics are closed locally by Sections 10.1 and
7–9. No broader representation dependency blocks this Draft v0.2 contract.

## 11. Multiple, duplicate, and conflicting Claims

Every eligible selected Claim is preserved. The binding MUST NOT filter,
merge, deduplicate, rank, prefer, reconcile, or silently discard Claims.
Different issuers remain different; coincident values under different
Predicates remain separate; same-Predicate conflicts remain simultaneously
visible; exact duplicates produce repeated equal entries; and list position
conveys no issuer priority, truth, recency, or verification strength.

## 12. Predicate-aware equality and comparison

CEL operators do not enlarge Predicate semantics. A Claim's `value`,
`issuer_ref`, and external identifier are meaningful only under its retained
Predicate Schema.

### 12.1 Predicate guard

For this section, a **Claim term** `Q` is either the active variable of one
permitted Claim-list comprehension or `claims[N]`, where `N` is a nonnegative
CEL `int` literal. An operation on `Q.value`, `Q.issuer_ref`, or
`Q.subject_reference.identifier` is Predicate-sensitive and MUST occur under a
recognized literal guard for that same `Q`:

```text
Q.predicate == P && guarded_expression
```

`P == Q.predicate` is also valid. `P` MUST be one CEL `bytes` literal containing
exactly 33 octets and MUST select a retained supported Predicate Schema.

The validator applies the following exact syntax rule to the Section 15 parsed
expression before CEL type checking or evaluation:

1. For each Predicate-sensitive access, walk its parsed-expression ancestors
   outward to the nearest `_&&_` call, without crossing a `Comprehension`,
   `_||_`, or `_?_:_` boundary. Absence of such a call is rejection. Continue
   through adjacent `_&&_` parents, without crossing those boundaries, to form
   that access's maximal guard chain; recursively flatten the chain into its
   left-to-right conjunct sequence. Parentheses do not create a node in the
   pinned parsed expression.
2. A guard conjunct is exactly `_==_(Select(Q, "predicate"), P)` or its
   reversed-operand form. `Q` is compared structurally after ignoring only
   `Expr.id`; source aliases, equivalent expressions, and inferred facts are
   not recognized.
3. If the access is in conjunct `j`, an exact guard for the same `Q` MUST be an
   earlier conjunct in that same maximal chain. A guard does not flow into
   another `||` arm, conditional arm, comprehension scope, Claim term, or
   expression outside that chain.
4. The checker resolves `P`, validates the selected member's FieldForm and the
   requested relation under that Predicate, and rejects an unknown,
   unavailable, or inapplicable `P`.
5. An operation involving two Claim terms requires an earlier guard for each.
   Draft v0.2 supports that operation only when the two literal PSCIDs are
   byte-identical. Different literal PSCIDs fail this profile rule even if
   ADR-010 could permit their normalized values to compare.

This is a deliberately narrow VE-CEL-1 syntax/profile restriction, not a new
Predicate semantic rule. Accepted ADR-010 owns VE semantic comparability and
permits values under different PSCIDs to compare when its compatibility
conditions hold. Draft v0.2 exposes no cross-Predicate comparison operation
that performs those checks or conversions.

An unguarded operation, nonliteral/unknown PSCID guard, or operation across
different PSCIDs is a static profile violation yielding `EVALUATION_ERROR`.
It MUST NOT become true or false merely because runtime shapes coincide. For a
potentially ADR-010-compatible cross-Predicate operation, this outcome means
only **unsupported VE-CEL-1 v0.2 profile semantics**; it is not the governing
Predicate result `NOT COMPARABLE`. `NOT COMPARABLE` remains a Predicate-level
result only where the governing Predicate semantics and ADR-010 actually
establish non-comparability.

### 12.2 Permitted relations

After guard and schema validation: Boolean, string, and bytes equality use
ordinary CEL equality. Integer equality and permitted Integer ordering use the
pinned CEL v0.25.2 numeric relation across `int`/`int`, `uint`/`uint`, or
`int`/`uint`; `double` is never present. This is necessary when one governed
Integer domain crosses the Section 8 type boundary and performs no numeric
conversion. Record equality uses recursive CEL map equality under the same
RecordForm; Sequence equality uses recursive
position-sensitive CEL list equality under the same SequenceForm; and list
membership uses that same governed equality. Claim `<`, `<=`, `>`, `>=` are
permitted only for Integer values whose Predicate `comparison` is present with
`ordered: true`.

For Action fields, equality and membership require one declared schema form on
both operands; Integer ordering additionally requires the Action schema to make
numeric order meaningful. String collation, semantic bytes ordering, list/map
ordering, implicit rescaling, any numeric comparison involving `double`, and
every other relation are prohibited and yield `EVALUATION_ERROR`, never silent
falsehood or a change to `NOT COMPARABLE`.

## 13. Closed CEL feature profile

| Feature | Draft v0.2 rule |
|---|---|
| Literals | `bool`, in-range `int`, in-range `uint`, NFC `string`, `bytes`; no `null` or `double`. Unary `-` is permitted only as the pinned CEL syntax forming one in-range negative `int` literal. |
| Variables | Exactly `action`, `claims`, and comprehension variables. |
| Selection | String-key map selection/indexing; list indexing by in-range `int`. |
| Presence | Standard `has(map.field)` for governed optional record members. |
| Logic | `!`, `&&`, `||`, conditional `?:`. |
| Equality | `==`, `!=` under Section 12. |
| Relations | `<`, `<=`, `>`, `>=` only under Section 12. |
| Membership | `in` for governed lists only. |
| Size | Standard `size` on string, bytes, list, or map. |
| List literals | Allowed when all members are allowed literals of one CEL type. |
| Macros | `exists`, `all`, `exists_one`; no nested comprehension. |

Everything else is prohibited: floating point; null; time/duration; protobuf,
optional, or implementation abstract types; arithmetic other than the literal-
forming exception above, and concatenation; map
or message construction; `map`, `filter`, `reduce`, nested/two-variable
comprehensions; regex; locale, normalization, formatting, parsing, encoding,
hashing, cryptography, or time functions; extension libraries; receiver or host
extensions; custom overloads; mutable objects; reflection; and dynamic
protobuf/JSON values.

Permitted macros allow inspection of the semantically unordered Claim
collection without assigning policy meaning to list position. They range only
over `claims` or a governed input Sequence and are bounded by Section 15.

## 14. Missing, unknown, and error mapping

```text
CEL true                       -> SATISFIED
CEL false                      -> NOT_SATISFIED
missing/unknown required input -> INDETERMINATE
CEL/runtime/profile violation  -> EVALUATION_ERROR
```

| Condition | Outcome |
|---|---|
| absent `action` or `claims` binding | `INDETERMINATE` |
| absent optional member read without excluding the missing path | `INDETERMINATE` |
| pinned CEL unknown caused by unavailable required input | `INDETERMINATE` |
| nonconforming Action or selected Claim | `EVALUATION_ERROR` before CEL |
| undeclared field, unknown arm, or wrong type | `EVALUATION_ERROR` |
| out-of-range Integer | `EVALUATION_ERROR` before CEL |
| unsupported/unguarded comparison | `EVALUATION_ERROR` |
| parse, profile, type-check, index, or CEL evaluation error | `EVALUATION_ERROR` |
| prohibited feature/function | `EVALUATION_ERROR` before CEL |
| non-Boolean final value | `EVALUATION_ERROR` |
| resource limit exceeded | `EVALUATION_ERROR` |

No failure authorizes execution. Only `SATISFIED` may support an affirmative
authorization Claim under the surrounding architecture.

## 15. Deterministic resource limits

| Resource | Maximum |
|---|---:|
| Rule source UTF-8 octets | `16384` |
| Parsed-expression nodes | `1024` |
| Parsed-expression depth | `31` |
| Input composite nesting depth | `32` |
| Eligible Claim entries | `256` |
| Members in one Record/map | `256` |
| Members in one Sequence/list | `1024` |
| UTF-8 octets in one string | `65536` |
| Octets in one bytes value | `65536` |
| Canonical Action plus Claim-body input octets | `4194304` |

All limits are checked before evaluation. Exceeding any limit yields
`EVALUATION_ERROR`; a value at the maximum remains admissible if every other
rule passes.

### 15.1 Rule-source and parsed-expression measurement

Rule-source size is the number of octets in the Rule's exact NFC UTF-8
encoding. It is checked before parsing.

Node and depth limits use `cel.expr.ParsedExpr.expr` from the pinned CEL
v0.25.2 syntax model, after standard CEL macro expansion at parse time and
before type-checker rewriting, optimization, or host transformation. Every
reachable `cel.expr.Expr` counts as one node, including the root and every
macro-generated expression. `Expr.id`, `SourceInfo` (including
`SourceInfo.macro_calls`), positions, `CreateStruct.Entry` wrappers, and type or
reference metadata do not count.

Children are exactly: `Select.operand`; a present `Call.target` followed by all
`Call.args`; all `CreateList.elements`; each `CreateStruct.Entry.map_key` when
present followed by its `value`; and, for `Comprehension`, `iter_range`,
`accu_init`, `loop_condition`, `loop_step`, and `result`. Constants and
identifiers have no children. Thus:

```text
Nodes(e) = 1 + sum(Nodes(child))
Depth(e) = 1                                      when e has no children
Depth(e) = 1 + max(Depth(child))                  otherwise
```

The root therefore has depth one. A parser or engine's private checked,
optimized, or lowered AST is not a conforming measurement surface.

### 15.2 Input measurement

Input limits are measured on admitted semantic values before CEL host-object
construction:

- `InputDepth(scalar) = 0`; `InputDepth(empty Record/Sequence) = 1`; otherwise
  `InputDepth(composite) = 1 + max(InputDepth(member))`. Measure the complete
  projected `action` map and the complete projected `claims` list, including
  its Claim maps; the larger value is the input depth.
- Claim count is the number of eligible Claim occurrences before Section 10
  ordering. Byte-identical duplicates count separately.
- Record/map count is the number of present semantic key/value members in each
  projected map, including wrapper, fields, subject-reference, and nested
  maps. Sequence/list count is the number of elements; duplicates count.
- String size is the number of UTF-8 octets in the already-normalized runtime
  string. Bytes size is the number of raw octets.
- Canonical input size is `len(CanonicalAction) + sum(len(B(c)))`, where
  `CanonicalAction` is the complete validated canonical Action representation
  under its governing profile and the sum includes the canonical Claim.body
  bytes for every eligible occurrence before ordering. It includes duplicates
  and no CEL runtime serialization, digest, frame, wrapper, or verification
  artifact.

The only permitted comprehensions range over `claims` or one governed input
Sequence. Because comprehensions may not nest, Claim count is at most `256`,
Sequence count is at most `1024`, and one macro invocation can perform at most
`1024` iterations. Together with source, parsed-expression, depth, composite,
cardinality, scalar-size, canonical-input, and closed-feature bounds, this
makes every admitted evaluation finite without a semantic cost estimator.
VE-CEL-1 v0.2 defines no logical-cost unit, `ValueSize`, implementation cost
estimate, wall-clock budget, or untaken-branch charge.

Smaller deployment admission limits are outside portable VE-CEL-1 and must not
be reported as a different semantic result for an input admitted by this
profile.

## 16. Conformance vectors

Hexadecimal below denotes raw CEL bytes for diagnostics, never CEL strings.

### 16.1 Action projection A1

The authoritative Lynx Action P1 projects to:

```text
action = {
  action_id:     h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f',
  action_digest: h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c',
  schema_digest: h'e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554',
  fields: {
    amount_minor: 1000000,
    source_account: {
      servicing_agent_canadian_sort_code: "000100001",
      account_id: "0012345"
    },
    destination_account: {
      servicing_agent_canadian_sort_code: "000200002",
      account_id: "VENDOR-0001"
    }
  }
}
```

`amount_minor` is `int`; strings remain strings; records are maps. Same content
with another valid ID changes only `action_id`; same ID with inconsistent
content fails before CEL. Supplemental projection-only probes confirm that an
absent optional field stays absent, `h'0001ff'` stays three CEL bytes,
order-significant `[3, 1, 3]` stays that list, and
`{outer: {flag: true}}` stays nested maps. They allocate no Action schema or
representation.

### 16.2 Claim ordering fixtures

Let `A32 = h'000102...1f'`, `D32 = h'202122...3f'`, and
`E32 = h'404142...5f'`. The fixtures below are exact semantic Claim bodies;
their named P-vectors and canonical bytes are defined by Claim Body Schema
Draft v0.2. C2 and C3 change only the stated C1 member before canonical
encoding.

```text
P03_C = h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2'
P02_A = h'02038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f'
P03_D = h'03ef45cac153df5390b7916bab7b0fbd3264c569cb6ffb91b68b3e21cae4b3fd54'
```

| Fixture | Exact semantic body | `len(B(c))` | SHA-256 ordering key |
|---|---|---:|---|
| C1 | P1: `ActionContentReference(D32)`, issuer `"bank-A"`, Predicate `P03_C`, value `true` | `147` | `8bd3f23fa3ba3dd7a5169a520b8fe62c3242efe399e50b510c8dcd94e92b7d91` |
| C2 | C1 with value exactly `false` | `147` | `083f0317a7e10453dcfe64dcc07dabb1e36362744c04d861b4860bf491af030e` |
| C3 | C1 with issuer exactly `"bank-B"` | `147` | `2bd201dafdcc51216544da1c7f2b729ffbdda06669799c1e700a6136e26082c8` |
| C4 | P5: `ActionContentReference(D32)`, issuer `"bank-A"`, Predicate `P03_D`, value `{amount: 50000, tags: ["settled", "priority"]}` | `180` | `1cd57729a64607450af7d02aacafad63b246dc0e2db893559e55c0784a102c22` |
| C5 | RS-LYNX-002: `ActionOccurrenceReference(h'606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f', h'5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c')`, issuer `"lynx-sending-participant-A"`, Predicate `h'03308bb670d85b2431c91cc0fe2f38e10678e48c6ae23f9be3db21d5c491ce5f82'`, value `true` | `206` | `507b4be06e4ee9e4b5e1d827c53f6adc8be086e41819135ee8f8b65dffe55300` |

For direct reproduction, C1's exact `B(c)` is:

```text
a46576616c7565f569707265646963617465582103cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f26a6973737565725f7265666662616e6b2d41717375626a6563745f7265666572656e63658276416374696f6e436f6e74656e745265666572656e63655820202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
```

Every input permutation of `[C1, C2, C3, C4, C1]` produces:

```text
[C2, C4, C3, C1, C1]
```

The exact final projected `claims` values, in that order, are:

```text
[
  {subject_reference: {action_digest: D32}, issuer_ref: "bank-A",
   predicate: h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2', value: false},
  {subject_reference: {action_digest: D32}, issuer_ref: "bank-A",
   predicate: h'03ef45cac153df5390b7916bab7b0fbd3264c569cb6ffb91b68b3e21cae4b3fd54',
   value: {amount: 50000, tags: ["settled", "priority"]}},
  {subject_reference: {action_digest: D32}, issuer_ref: "bank-B",
   predicate: h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2', value: true},
  {subject_reference: {action_digest: D32}, issuer_ref: "bank-A",
   predicate: h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2', value: true},
  {subject_reference: {action_digest: D32}, issuer_ref: "bank-A",
   predicate: h'03cfd11fb27684b51ca191d1c1a39b11f62180c6c2e9d4fcac7bf2dabb542de3f2', value: true}
]
```

Conflicts, issuer distinction, and both duplicates remain. A comparator-unit
probe with equal synthetic digest keys and distinct body bytes MUST use body
bytes as tie-break. It tests that branch only and does not replace SHA-256 or
claim a real collision.

### 16.3 Subject and FieldForm coverage

Claim Body P1–P5 project respectively: `{action_digest: bytes}` with text/bool;
`{action_id: bytes, action_digest: bytes}`; `{event_id: bytes}`;
`{identifier: "account-X"}` under its subject domain; and Record
`{amount: int(50000), tags: ["settled", "priority"]}`.

Boundary probes map Boolean, normalized Text, raw Bytes,
`-9223372036854775808`, `0`, `9223372036854775807`,
`9223372036854775808`, and `18446744073709551615`; both out-of-range neighbors
fail before CEL.

### 16.4 Representative Rule

With A1 and eligible C1:

```cel
action.fields.amount_minor == 1000000 &&
claims.exists(c,
  c.predicate == b"\x03\xcf\xd1\x1f\xb2\x76\x84\xb5\x1c\xa1\x91\xd1\xc1\xa3\x9b\x11\xf6\x21\x80\xc6\xc2\xe9\xd4\xfc\xac\x7b\xf2\xda\xbb\x54\x2d\xe3\xf2" &&
  c.issuer_ref == "bank-A" &&
  c.subject_reference.action_digest == b"\x20\x21\x22\x23\x24\x25\x26\x27\x28\x29\x2a\x2b\x2c\x2d\x2e\x2f\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3a\x3b\x3c\x3d\x3e\x3f" &&
  c.value == true)
```

Result: `true` -> `SATISFIED`. Replacing bank-A with bank-Z produces `false`
-> `NOT_SATISFIED`. Host input order cannot change activation or result.

The exact source and activation above were parsed, type-checked, and evaluated
without host-expression substitution by both `cel-expr-python 0.1.3`
(CEL-C++) and `cel-python 0.5.0` (independent pure-Python CEL). Both returned
CEL `true`; both returned CEL `false` for the bank-Z mutation. Library names
and versions are conformance evidence only; Section 2 remains language
authority.

### 16.5 Negative vectors

Each vector supplies A1 and C1 unless its exact mutation says otherwise. The
stage is part of the expected result; a harness MUST execute the stated
admission, projection, profile-validation, type-check, or evaluation step and
must not assign an expected result without performing that step.

| Vector | Exact mutation | Required rejecting stage and outcome |
|---|---|---|
| N1 | mark C1 `verification status = not performed`, then include it in the selected collection | Claim-eligibility validation; `EVALUATION_ERROR` before projection |
| N2 | mark C1 `verification result = failed`, then include it | Claim-eligibility validation; `EVALUATION_ERROR` before projection |
| N3 | select `[C1,C2]` but have the builder emit only C1 because values conflict | binding-construction conformance check detects count/body loss; reject with `EVALUATION_ERROR` |
| N4 | add Claim map member `"verification": true` to projected C1 | exact four-member projection check; `EVALUATION_ERROR` |
| N5 | add top-level activation binding `"evidence": {}` | exact two-binding environment check; `EVALUATION_ERROR` |
| N6 | emit C1 `predicate` as its hexadecimal text instead of 33 raw bytes | projection type check; `EVALUATION_ERROR` |
| N7 | emit A1 `amount_minor = uint(1000000)` instead of required `int(1000000)` | Integer projection check; `EVALUATION_ERROR` |
| N8 | project test integer `18446744073709551616` | Section 8 range check; `EVALUATION_ERROR` before CEL |
| N9 | for a test Action with absent governed optional `note`, emit `"note": ""` | exact semantic-field projection check; `EVALUATION_ERROR` |
| N10 | input `[C1,C2]` emitted as `[C1,C2]` rather than digest order `[C2,C1]` | Section 10 tuple-order check; `EVALUATION_ERROR` |
| N11 | input `[C1,C1]` emitted as `[C1]` | cardinality/duplicate preservation check; `EVALUATION_ERROR` |
| N12 | Rule `claims.exists(c, c.value == true)` | literal-guard profile validation; `EVALUATION_ERROR` before type checking |
| N13 | let X1 be exact Claim Body P4 (`ExternalSubjectReference("account-X")`, issuer `"bank-A"`, Predicate `P02_A`, value `true`; ordering key `c5a52b18fbe2c8ceb258c42d23b8aa789d969b712d27c28c09450b802716dddb`), so `[C1,X1]` is already ordered; Rule `claims[0].predicate == P03_C && claims[1].predicate == P02_A && claims[0].value == claims[1].value`, expanding both names to the exact bytes literals above | different-literal-PSCID profile check; `EVALUATION_ERROR` as unsupported VE-CEL-1 v0.2 semantics, with no `NOT COMPARABLE` Predicate verdict |
| N14 | Rule `claims.exists(c, c.predicate == P03_C && c.value < true)` | selected Predicate permits no ordering; profile validation yields `EVALUATION_ERROR` |
| N15 | test Action omits governed optional `note`; Rule `action.fields.note == "x"` reaches the read without `has` | missing-member mapping; `INDETERMINATE` |
| N16 | Rule `action.fields.undeclared == 1` | retained Action-schema/profile validation; `EVALUATION_ERROR` |
| N17 | Rule `size(claims)` | CEL type check establishes non-Boolean result; `EVALUATION_ERROR` |
| N18 | each exact source in Section 16.6 | closed-feature profile validation; `EVALUATION_ERROR` before evaluation |
| N19 | each over-limit fixture in Section 16.7 | exact pre-evaluation measurement; `EVALUATION_ERROR` |
| N20 | keep A1 `action_id` and fields but replace the final action-digest octet `0c` with `0d` | Action digest recomputation; `EVALUATION_ERROR` before CEL |

Verified false/evidence-unsupported/replayed Claims may pass verification and
enter only if selected; truth, evidence, freshness, Rule consequence, and
authorization remain separate.

### 16.6 Executable closed-feature vectors

The profile validator MUST parse each exact Rule with the pinned parser and
then reject it at the stated profile/type stage. `P03_C` and `P02_A` are exact
33-octet CEL bytes literals from Section 16.2, not identifiers in the actual
source.

| Case | Exact Rule source or generator | Required result |
|---|---|---|
| F1 float | `1.0 == 1.0` | prohibited `double`; `EVALUATION_ERROR` |
| F2 timestamp | `timestamp("2026-09-12T00:00:00Z") == timestamp("2026-09-12T00:00:00Z")` | prohibited time/function; `EVALUATION_ERROR` |
| F3 duration | `duration("1s") == duration("1s")` | prohibited duration/function; `EVALUATION_ERROR` |
| F4 regex | `"abc".matches("a.*")` | prohibited function; `EVALUATION_ERROR` |
| F5 host extension | `host.lookup("x") == true` | prohibited binding/extension; `EVALUATION_ERROR` |
| F6 nested comprehension | `claims.exists(c, claims.exists(d, true))` | nested comprehension; `EVALUATION_ERROR` |
| F7 arithmetic | `1 + 1 == 2` | prohibited arithmetic; `EVALUATION_ERROR` |
| F8 heterogeneous list | `size([true, "x"]) == 2` | heterogeneous literal; `EVALUATION_ERROR` |
| F9 cross-Predicate | exact N13 source | unsupported v0.2 cross-Predicate operation; `EVALUATION_ERROR` |
| F10 non-Boolean result | `size(claims)` | final type is `int`; `EVALUATION_ERROR` |

### 16.7 Executable resource-boundary vectors

The following deterministic generators contain no ellipses. `repeat(x,n)`
means exact concatenation/list repetition `n` times. Implementations MUST
construct, parse where applicable, measure, and check both rows of every pair.

| Resource | Exactly at maximum: accepted | Over maximum: `EVALUATION_ERROR` |
|---|---|---|
| Source octets | `"true" + repeat(" ",16380)`: 16384 UTF-8 octets, result `SATISFIED` | add one U+0020: 16385 octets, reject before parse |
| Parsed nodes | `"size([" + join(repeat("true",1020),",") + "]) == 1020"`: 1024 nodes, depth 4, result `SATISFIED` | use 1021 elements and suffix `1021`: 1025 nodes, reject after parse |
| Parsed depth | define `T0="true"`, `T(n+1)="true ? ("+Tn+") : false"`; T30 has 91 nodes and depth 31, result `SATISFIED` | T31 has 94 nodes and depth 32, reject after parse |
| Input depth | test Action field `probe=V30`, where `V0=true`, `V(n+1)={"x":Vn}`; complete projected action depth is 32 | use V31; depth is 33 |
| Claims | eligible collection `repeat(C1,256)`; count 256 and all duplicates survive | `repeat(C1,257)`; count 257 |
| Record members | test Action `fields={"f000":true,...,"f255":true}` using exactly three-digit decimal suffixes; maximum map has 256 members | append `"f256":true`; 257 members |
| Sequence members / comprehension iterations | test Action governed order-significant `probe=repeat(true,1024)` and Rule `action.fields.probe.all(x, x == true)`; 1024 members/iterations, `SATISFIED` | append one `true`; 1025 members, reject before evaluation |
| String octets | test Action field `probe=repeat("a",65536)`; 65536 UTF-8 octets | append one ASCII `a`; 65537 octets |
| Bytes octets | test Action field `probe=repeat(h'00',65536)`; 65536 raw octets | append one `00`; 65537 octets |
| Canonical input octets | use the exact CI generator below with final byte-string length 65039; complete canonical Action is 4194304 octets and `claims=[]` | use final length 65040; complete canonical Action is 4194305 octets |

The canonical-input fixture uses the ordinary VE-001 Action representation.
Its complete canonical schema descriptor is the VE-CBOR-1 map:

```text
{
  "name": "VE-CEL-1-CANONICAL-INPUT-LIMIT",
  "closed": true,
  "fields": {
    "payload": {
      "element": {"max_length": 65536, "normalization": "none", "type": "bytes"},
      "max_items": 64,
      "min_items": 64,
      "ordering_significant": true,
      "required": true,
      "type": "sequence"
    }
  }
}
```

This descriptor is local test data for the boundary vector. Its `name` string
is descriptor content, not a governed schema identifier, allocation, registry
entry, or new Action-schema primitive.

Let `Z` be one byte string containing exactly 65536 zero octets and `N(n)` one
byte string containing exactly `n` zero octets. Set `F.payload` to one exact
64-element sequence whose first 63 elements are `Z` and whose final element is
`N(n)`, and set `action_id=h'000102...1f'`; derive both digests and
`CanonicalAction` exactly as the VE-001 profile requires. The descriptor gives
`schema_digest=7f9d2b36fbd0124ba1ebe91479be6e70fcd98a72be404246b33d109b4ba64474`.
For `n=65039`, `action_digest` is
`092b1e8bfa3c648963d6aa9a0859050c23f21eb388f231197f9e47adeb7dadb1`;
for `n=65040`, it is
`254e91373e984eb87d20891599bacba454bf2c7f334ba70039f1187107df7279`.
These values diagnose construction; implementations MUST recompute them.

## 17. Independent implementation requirements

Two independent implementations MUST reconstruct A1, P1–P5, all FieldForms,
Integer boundaries, the five ordering keys, every host-order permutation,
duplicate/conflict behavior, synthetic collision tie-break, representative
Rule outcomes, N1–N20, feature rejections, parsed-expression measurements, and
every resource boundary without sharing projections or precomputed results.
At least one execution path MUST use an officially maintained CEL engine and a
second MUST use an independent CEL engine against the exact Section 16.4
source and activation. Validators and named libraries are evidence, not
authority.

## 18. Security and ownership boundaries

Deterministic projection prevents input order and host types from changing
evaluation. Predicate guards prevent coincident runtime shapes from erasing
issuer, subject, value, or comparison semantics. Closed functions and limits
exclude ambient authority and implementation resource behavior.

This profile does not establish Action authority/executability, Claim truth or
freshness, issuer honesty, evidence authenticity/correlation, an Execution
Right, or execution outcome. Those remain with existing owners.

## 19. Stale dependency resolution

Draft v0.1 correctly recorded that portable Claim.body bytes were then absent.
Claim Body Schema Draft v0.2 now closes the bounded four-field body, four
subject arms, recursive FieldForms, absence rules, and canonical bytes.
Reusable Claim verification Draft v0.1 supplies a portable authorship path,
while artifacts stay outside CEL and evidence truth stays outside input
construction unless expressed through an eligible semantic Claim.

This revision removes the obsolete “Claim-body representation blocks the
contract” conclusion. Unsupported Claim times, schemas, and cross-Predicate CEL
comparison remain outside this bounded profile rather than reopening it.

## 20. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | **Pass.** Explicit immutable deterministic inputs remain separate from verification, truth, authority, and execution. |
| Primitive burden | **Pass.** Existing Action, Claim, Predicate, Verify, Rule, and Evaluate suffice; ordering digest is invisible mechanics. |
| Removability | **Pass.** Removing this engine profile removes CEL portability, not source semantics. |
| Twenty-year durability | **Pass at Draft scope.** Immutable CEL revision, exact mapping, fixed hash, closed features, and limits require no registry. |
| Independent implementability | **Pass.** Projection, sorting, comparison, errors, exact structural bounds, and vectors are finite and reproducible without a hidden engine-cost model. |
| Reduced conceptual complexity | **Pass.** Two direct bindings avoid Fact, Claim identity, verification metadata, and generic comparison services. |

**Verdict: A. BOUNDED VE-CEL-1 RULE/EVALUATE INPUT CONTRACT COMPLETE AT DRAFT v0.2 SCOPE.**

## 21. Governance

This revision implements work delegated by Accepted ADR-RULE-001/002 and
preserves two bindings, immutable inputs, Boolean result mapping, and content-
digest list ordering. It changes no Approved specification or accepted
decision.

```text
RFC required = NO
ADR required = NO
new primitive = NO
Approved-specification revision = NO
```

Changing the bindings, replacing digest ordering, redefining Rule/Evaluate
ownership, or changing Claim/Predicate semantics requires governance and is not
performed here.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2 | 2026-09-12 | Completed bounded Action and eligible-Claim projections, pinned CEL v0.25.2, closed FieldForm/Integer conversion, implemented digest ordering with collision tie-break and duplicate preservation, bounded operators/resources, and added conformance vectors. |
| 0.1 | 2026-08-27 | Initial Draft candidate; deferred completion while portable Claim.body representation and exact engine conversion remained unresolved. |
