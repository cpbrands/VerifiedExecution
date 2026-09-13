---
id: "ADR-RULE-001-002"
title: "Portable Deterministic Rule Execution"
version: "0.1"
status: "Accepted"
document_type: "Architectural Decision Record"
category: "Protocol"
author: "Verified Execution Editorial Board"
created: 2026-08-21
updated: 2026-09-13
depends_on: []
related_documents:
  - ADR-013
supersedes: null
superseded_by: null
---
# ADR-RULE-001/002 — Portable Deterministic Rule Execution

**Status:** Accepted — narrow VE Kernel Protocol v0.1 scope  
**Accepted:** 2026-08-22  
**Scope:** This decision selects the mandatory portable Rule representation and execution constraints for VE Kernel Protocol v0.1. It does not establish CEL as a universal VE programming model.  
**Decision:** Adopt `VE-CEL-1`, a constrained profile of the Common Expression Language (CEL), as the mandatory portable Rule execution format for v0.1.

## Current authority and partial supersession

Accepted [ADR-013](ADR-013-canonical-rule-semantic-boundary.md) partially
supersedes only this record's seven-field canonical Rule-object boundary and
its direct field implications. The statement below requiring at least `id`,
`version`, `language`, `source`, `input_contract`, `output_contract`, and
`semantics_version` remains as historical decision text; it is no longer the
current canonical Rule semantic boundary.

Current authority defines the boundary as:

```text
Rule {
  language,
  semantics_version,
  source
}
```

`language` identifies the evaluation-profile family; the current family is
`VE-CEL-1`. `semantics_version` identifies one immutable, complete,
historically resolvable evaluation-semantics closure within that family. It is
not a document, policy, Rule-release, or deployment version. `source` is the
exact admitted Rule source artifact: valid UTF-8 text that is already NFC,
rejected rather than normalized when non-NFC, and bounded by the selected
profile's source-size limit. Admitted textual differences remain exact-artifact
distinctions.

`id` is external policy/catalog/organizational metadata, and `version` is
external release/lifecycle metadata. The selected immutable
`(language, semantics_version)` profile transitively owns the input and output
contracts. No immutable VE-CEL `semantics_version` is allocated yet, so
canonical Rule representation and content identity remain blocked.

This reconciliation does not choose a source wire type, an identifier wire
syntax, the first VE-CEL semantic-version value, or a Rule content digest.

All other decisions in this record remain Accepted and authoritative. This
reconciliation does not change Rule as a kernel primitive, deterministic
side-effect-free execution, exactly the immutable `action` and `claims`
bindings, deterministic Claim-list construction, duplicate Claim cardinality,
Evaluate outcomes, Predicate ownership of comparison semantics, or the
absence of an EvaluationResult or EvaluationAttempt primitive.

## Historical decision (partially superseded)

A v0.1 portable Rule MUST identify the language profile `VE-CEL-1` and carry the exact CEL source text as part of the canonical Rule object.

The canonical Rule object MUST include at least:

- `id`
- `version`
- `language` = `VE-CEL-1`
- `source`
- `input_contract`
- `output_contract`
- `semantics_version`

The entire Rule object is encoded using `VE-CBOR-1`; its content digest therefore binds the exact source and execution contract.

## VE-CEL-1 constraints

1. Rule execution MUST be side-effect free.
2. Rule execution MUST have no network, filesystem, environment-variable, clock, randomness, or mutable-host-state access.
3. Host-defined custom functions MUST NOT be available unless a future VE profile standardizes their exact semantics.
4. Decision-relevant time, resource state, exchange rates, risk scores, and other external inputs MUST enter through the explicit Action/verified-Claim input set.
5. Rules MUST evaluate only over immutable inputs supplied by Evaluate.
6. The v0.1 Rule result MUST be Boolean.
7. Only Boolean `true` may support derivation of an authorization Claim.
8. Boolean `false`, indeterminate/missing required input, and evaluation error MUST NOT authorize execution.
9. VE-CEL-1 MUST exclude CEL `double` from decision inputs and rule literals. Fractional quantities use schema-defined scaled integers.
10. VE-CEL-1 MUST exclude host-specific extensions and dynamic behavior whose semantics are not fixed by the profile.
11. A Rule's exact CEL source text MUST be UTF-8 NFC. Whitespace/comment changes produce a different Rule digest even if behavior is equivalent; VE identifies exact artifacts, not semantic equivalence classes.
12. Evaluate MUST expose verified Claims in a deterministic order (content digest bytewise ascending) whenever they are represented as a list.
13. Two conforming VE-CEL-1 evaluators given the same canonical Action, verified Claims, Rule, and semantics version MUST produce the same semantic result.

## Why CEL

CEL is specifically designed for portable policy/expression evaluation. Its language is side-effect-free, terminating/non-Turing-complete, and deterministic for a given evaluation environment. Its specification and canonical AST formats are intended for cross-language interoperability.

For VE v0.1, CEL is a better mandatory format than WebAssembly because VE Rules are governance predicates, not general programs. WebAssembly 3.0 provides a deterministic execution profile, but general Wasm still introduces a larger execution surface, loops/resource metering requirements, ABI design, and potential host imports. A future `VE-WASM-*` Rule profile MAY be standardized if real VE scenarios exceed CEL's expressiveness.

## Input binding

`Evaluate` supplies exactly two top-level immutable bindings:

- `action`: the canonical semantic value of the Action.
- `claims`: the set/list of successfully verified Claims selected for this evaluation.

No other decision-relevant input is implicit.

The precise CBOR-to-CEL type mapping and the normative claim projection are specification work required before v0.1 interoperability testing.

## Output

Evaluate maps the CEL result into the VE evaluation outcome:

- `true` -> SATISFIED
- `false` -> NOT_SATISFIED
- missing/unknown required input -> INDETERMINATE
- CEL/runtime/profile violation -> EVALUATION_ERROR

Only SATISFIED may be used to derive an affirmative authorization Claim.

## Future extension

Wasm 3.0 deterministic-profile execution is reserved as a candidate future Rule profile, not a v0.1 mandatory-to-implement mechanism.
