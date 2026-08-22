# ADR-RULE-001/002 — Portable Deterministic Rule Execution

**Status:** Proposed for VE Kernel Protocol v0.1  
**Decision:** Adopt `VE-CEL-1`, a constrained profile of the Common Expression Language (CEL), as the mandatory portable Rule execution format for v0.1.

## Decision

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
