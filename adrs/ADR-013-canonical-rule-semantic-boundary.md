---
id: ADR-013
title: Canonical Rule Semantic Boundary
version: "0.1"
status: Proposed
document_type: Architectural Decision Record
category: Semantics
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - SPECIFICATION-GOVERNANCE
  - RFC-013
  - ADR-RULE-001-002
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
related_documents:
  - RS-CEL-001
  - GAP-ANALYSIS-RS-CEL-001-DETERMINISTIC-RULE-EVALUATION
  - ADR-ENC-001
  - OPEN-DECISIONS
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# ADR-013 — Canonical Rule Semantic Boundary

## 1. Status and authority boundary

**Status:** Proposed

**Related RFC:** RFC-013 — Canonical Rule Semantic Boundary

**Decision:** Adopt the three-field canonical Rule semantic boundary and the
immutable semantic-profile invariant described below.

This Proposed ADR is non-authoritative. It records the decision requested by
RFC-013 for governance review; it does not change Accepted ADR-RULE-001/002,
VE-CEL-1 Draft v0.2, Rule or Evaluate semantics, any canonical
representation, or any content-identity construction. The partial
supersession described in Section 11 takes effect only when ADR-013 itself is
changed from `Proposed` to `Accepted` through the repository's governed
process and that Accepted transition is merged into authoritative `main`.
RFC-013 has an independent governance status; changing either document's
status does not change the other document's status.

A merged ADR whose status remains `Proposed` is non-authoritative. Successful
validation, audit, review, or merge of this Proposed document does not
constitute architectural acceptance.

This candidate does not:

- allocate an immutable VE-CEL semantic profile;
- choose the wire type or syntax of `semantics_version`;
- decide a Rule CBOR representation or digest construction;
- add a Rule signature, registry, or new primitive;
- modify RFC-013, ADR-RULE-001/002, VE-CEL-1, `CHANGELOG.md`, or any Gap
  Analysis; or
- authorize canonical Rule representation or content-identity work to resume.

## 2. Context

Accepted ADR-RULE-001/002 selects `VE-CEL-1` for portable deterministic Rule
execution. It requires a canonical Rule object containing at least:

~~~text
id
version
language
source
input_contract
output_contract
semantics_version
~~~

It also establishes durable decisions that remain sound: Rule is a kernel
primitive, evaluation is deterministic and side-effect free, source is exact
UTF-8 NFC text, Evaluate supplies the immutable `action` and `claims`
bindings, verified Claims have deterministic ordering, the result is Boolean,
and Evaluate maps that result and failures to defined outcomes.

VE-CEL-1 Draft v0.2 supplies candidate detail for one bounded evaluation
closure. It pins CEL semantics, the permitted language subset, bindings,
projections, Claim eligibility and ordering, FieldForm conversion,
Predicate-sensitive access rules, structural limits, Boolean final results,
and Evaluate outcome mapping.

The seven-field Rule boundary nevertheless leaves `id`, `version`,
`input_contract`, `output_contract`, and `semantics_version` without complete,
independently implementable kernel meanings. RFC-013 establishes that four of
those fields preserve no demonstrated independent Rule semantic distinction,
while `semantics_version` is necessary only under a strict immutable-profile
invariant.

The architectural question is therefore not how to encode seven undefined
fields. It is which minimum semantic distinctions must exist before an exact
Rule representation and content identity can be specified.

## 3. Decision

The decision has two inseparable parts.

### 3.1 Canonical Rule semantic boundary

The canonical Rule semantic boundary is exactly:

~~~text
Rule {
  language,
  semantics_version,
  source
}
~~~

The fields preserve three independent distinctions:

| Field | Semantic distinction |
|---|---|
| `language` | The evaluation-profile family that interprets the Rule source. |
| `semantics_version` | One immutable, complete semantic closure within that family. |
| `source` | The exact admitted Rule source artifact. |

The following are not kernel Rule semantic fields:

- `id`;
- `version`;
- `input_contract`; and
- `output_contract`.

No replacement kernel field or primitive is introduced for any removed field.

### 3.2 Immutable semantic-profile invariant

Every allocated pair:

~~~text
(language, semantics_version)
~~~

MUST permanently identify exactly one immutable, historically resolvable,
complete, interpretation-affecting evaluation-semantics closure.

An allocated pair MUST NOT be retargeted, reinterpreted, or made to select a
moving "latest" profile. Every interpretation-affecting change MUST allocate
a new `semantics_version` within the relevant language family.

The pair is part of Rule semantics. Its meaning cannot depend on mutable
deployment configuration, an implementation default, or a bilateral
agreement.

## 4. `language`

`language` identifies an evaluation-profile family. The current family is:

~~~text
VE-CEL-1
~~~

The value does not include a mutable specification document version and does
not by itself select one profile revision. A future language family may define
another complete evaluation closure under the same invariant.

This decision creates no language registry or profile registry. Allocation
and publication remain governed specification work using durable repository
authority.

## 5. `semantics_version`

`semantics_version` is the immutable identifier of one complete semantic
closure inside the family selected by `language`.

It is not:

- a specification document version;
- a policy release number;
- a deployment version; or
- a Rule revision label.

The exact syntax and wire type of `semantics_version` remain downstream
profile-allocation and representation work. Whatever form is selected must
satisfy the immutability and historical-resolution rules in this ADR.

## 6. Complete evaluation closure

The immutable semantic profile transitively fixes every
interpretation-affecting evaluation rule. For `VE-CEL-1`, the complete closure
includes at minimum:

- the underlying CEL semantics and immutable release;
- Rule source interpretation;
- supported syntax, operators, functions, and macros;
- the `action` binding;
- the `claims` binding;
- Action projection;
- Claim projection;
- eligible-Claim input semantics;
- deterministic Claim ordering;
- FieldForm conversion;
- subject-reference projection;
- Integer mapping;
- Predicate-sensitive guard semantics;
- structural and resource limits;
- missing, unknown, and error behavior;
- the Boolean final-result requirement; and
- Evaluate outcome mapping.

The selected immutable profile therefore owns the input and output contracts
transitively. Allowing a Rule-level `input_contract` or `output_contract` to
vary independently would permit the same profile identifier to mean different
evaluation environments or results. Those fields are unnecessary and unsafe
inside canonical Rule semantic content.

## 7. Semantic and editorial change rules

### 7.1 Interpretation-affecting changes

Any change capable of altering a conforming Rule's:

- validity;
- projected evaluation environment;
- evaluation behavior;
- resource acceptance; or
- final result

MUST allocate a new `semantics_version`.

There is no compatible semantic retargeting of an allocated identifier. A
change may be operationally convenient or expected to preserve most results
and still require a new identifier if any conforming behavior can change.

### 7.2 Editorial changes

An existing semantic identifier MAY remain only when a change is demonstrably
editorial and cannot alter any validity, environment, behavior, resource
acceptance, or result listed above.

If there is reasonable doubt, a new `semantics_version` MUST be allocated.
Document revision numbering and semantic-profile identity remain separate.

## 8. Historical resolution

Every allocated `(language, semantics_version)` pair MUST remain permanently
resolvable to an immutable normative authority anchor. Acceptable anchor
classes may include:

- an immutable repository commit or blob;
- an immutable published specification artifact; or
- a cryptographic content reference.

This ADR does not choose the final binding or publication mechanism. It does
establish that a human-readable identifier alone is insufficient unless it is
permanently bound to immutable normative authority.

An implementation or later auditor must be able to recover the exact closure
selected by a historical Rule without consulting mutable "current" state.

## 9. Draft profiles and initial VE-CEL allocation

A mutable Draft document version is not automatically a canonical
`semantics_version`.

Consequently:

~~~text
VE-CEL-1 Draft v0.2
~~~

and the bare value:

~~~text
0.2
~~~

do not currently constitute an accepted immutable semantic-profile
allocation. VE-CEL-1 Draft v0.2 is candidate semantic content only.

This ADR does not allocate the first VE-CEL immutable semantic version. A
governed follow-up after acceptance MUST:

1. select and freeze one exact VE-CEL semantic closure;
2. assign an immutable `semantics_version`;
3. bind the pair permanently to an immutable authority anchor; and
4. preserve that binding for historical resolution.

Until that allocation is authoritative, canonical Rule representation and
Rule content identity remain blocked.

## 10. Source and exact-artifact identity

This decision preserves the accepted source semantics:

- `source` is exact valid UTF-8 text;
- the text is already Unicode NFC;
- non-NFC input is rejected rather than normalized;
- the selected evaluation profile defines the maximum source length; and
- admitted whitespace, comments, parentheses, and line-ending differences
  remain artifact-significant.

Logical or mathematical equivalence does not make two source artifacts
identical. No parser normalization, pretty-printing, algebraic reduction, or
semantic-equivalence proof participates in Rule identity.

This ADR does not decide whether the future VE-CBOR-1 Rule representation uses
CBOR `tstr` or validated UTF-8 `bstr` for source.

The architectural identity invariant is:

~~~text
same canonical Rule semantic content
    -> same Rule content identity

different source artifact or semantic-profile selection
    -> different Rule content identity, except cryptographic collision
~~~

Rule identity is exact artifact identity, not behavioral equivalence. The
future representation and digest construction must bind all three retained
fields, but neither is defined here.

## 11. Partial supersession of ADR-RULE-001/002

Upon acceptance, this decision partially supersedes only the canonical
seven-field Rule-object boundary in ADR-RULE-001/002.

Specifically superseded are:

1. the requirement that the canonical Rule object include at least `id`,
   `version`, `language`, `source`, `input_contract`, `output_contract`, and
   `semantics_version`;
2. any implication from that list that `id` or `version` is kernel Rule
   semantic content;
3. any implication that Rule selects `input_contract` or `output_contract`
   independently of its immutable evaluation profile; and
4. any interpretation of `semantics_version` inconsistent with the immutable,
   non-retargetable, historically resolvable complete-profile rule.

Those portions are replaced by the exact three-field boundary and invariant
in Section 3.

The following ADR-RULE-001/002 decisions remain unaffected and authoritative:

- Rule remains a kernel primitive;
- `VE-CEL-1` remains the current portable Rule language/profile family;
- evaluation remains deterministic and side-effect free;
- network, filesystem, environment, clock, randomness, and mutable host state
  remain unavailable;
- decision-relevant external facts enter through explicit immutable inputs;
- Evaluate supplies exactly the `action` and `claims` top-level bindings;
- verified Claims are ordered deterministically when represented as a list;
- the Boolean result and Evaluate outcome mappings remain unchanged;
- `double` and host-specific extensions remain excluded by the applicable
  profile;
- exact source identity and NFC admission remain unchanged;
- future VE-CBOR-1 representation and exact content binding remain required;
  and
- no general Wasm Rule profile is introduced.

This is not a broad supersession of ADR-RULE-001/002. The front-matter
`supersedes` relation remains null in this one-file Proposed candidate because
repository metadata requires reciprocal supersession and the Accepted source
ADR is intentionally not modified in this task. The governed reconciliation
after acceptance must record the partial relationship without erasing the
prior decision's historical authority.

## 12. Externalized fields

### 12.1 `id`

An `id` may exist in an external policy catalog, organizational namespace, or
deployment record. It is not canonical Rule semantic content and cannot alter
what a Rule computes.

### 12.2 `version`

A `version` may exist in an external release, rollout, or lifecycle system. It
is not canonical Rule semantic content and cannot retarget the selected
evaluation semantics.

Two externally distinct policy records with identical canonical Rule semantic
content represent the same kernel Rule artifact. External systems may assign
different organizational roles, labels, currentness, or deployment states to
that artifact without changing its kernel identity.

### 12.3 `input_contract` and `output_contract`

The selected immutable `(language, semantics_version)` pair transitively owns
the complete input and output behavior. These are not independent Rule fields,
external compatibility switches, or negotiable parameters.

## 13. Legitimacy and authority boundary

Rule artifact identity does not establish:

- authorship;
- approval;
- currentness;
- applicability;
- Root Authority recognition; or
- trust.

Those remain external policy provisioning, Root Authority, and deployment
concerns. This decision adds no Rule signature, verification mechanism,
identity primitive, trust registry, or policy registry.

## 14. Evaluate and Execution Right boundaries

The separation remains:

~~~text
Evaluate result != authorization decision != Execution Right issuance
~~~

A Rule yielding `SATISFIED` does not automatically authorize execution. A
Root Authority may approve an Action without evaluating a Rule.

Execution Right remains exactly:

~~~text
(action_id, action_digest)
~~~

Rule identity, Rule source, `semantics_version`, Evaluate result, Claim-set
identity, and policy provenance are not added to Execution Right.

## 15. Compatibility classification

**Classification:** Class C — Breaking Semantic Change.

The Accepted canonical Rule boundary changes from seven fields to three.
Rule evaluation behavior itself is unchanged, and no standardized portable
Rule wire representation or Rule content identity currently requires
migration. The semantic architecture change is nevertheless breaking because
four fields formerly required by an Accepted ADR cease to be canonical Rule
semantic content.

Private implementations of the incomplete seven-field sketch may need to
move catalog and release metadata outside canonical Rule and select a governed
immutable semantic profile. Repository evidence does not quantify external
adoption, so deployment impact remains unknown.

A post-acceptance `CHANGELOG.md` entry is mandatory. It must record the Class C
change, unchanged Rule evaluation behavior, and absence of a standardized
wire artifact requiring migration. `CHANGELOG.md` is not changed by this
Proposed ADR candidate.

## 16. Security consequences

The immutable profile binding prevents:

- semantic-profile substitution;
- silent retargeting;
- reinterpretation of historical Rules;
- replay ambiguity; and
- downgrade substitution.

A component presented with an unsupported `(language, semantics_version)`
pair MUST NOT silently evaluate using another profile, a "closest" version,
or a current default. Unsupported profile handling must fail closed under the
governing representation/evaluation specification.

Future Rule content identity must bind the pair together with exact source.
That binding prevents an attacker or faulty deployment from preserving a Rule
identity while changing the semantics used to interpret it.

This decision does not establish Rule legitimacy, authorship, approval,
currentness, applicability, Root Authority recognition, or trust. Those
remain external concerns even when exact Rule content is known.

## 17. Alternatives rejected

### 17.1 Preserve the seven-field Rule boundary

Rejected. `id`, `version`, `input_contract`, and `output_contract` preserve no
demonstrated independent kernel semantic distinction. Completing them would
introduce policy-catalog namespaces, release lineages, and redundant contract
selection machinery without changing the tested evaluation capability.

### 17.2 Use `evaluation_profile + source`

Rejected. An `evaluation_profile` field would be functionally equivalent to
`(language, semantics_version)` after the immutable-profile invariant is
established, but would introduce a new profile-reference convention and
namespace. The accepted field vocabulary already preserves family and
immutable version as separate necessary distinctions.

## 18. Consequences

### 18.1 Positive consequences

- the canonical Rule boundary becomes independently implementable after an
  immutable profile is allocated;
- redundant policy-management metadata leaves the kernel;
- exact evaluation semantics become durable and replayable;
- future language families can define their own complete immutable evaluation
  profiles;
- exact-source artifact identity remains intact; and
- Rule representation and content identity become possible after the initial
  VE-CEL semantic-profile allocation.

### 18.2 Costs and constraints

- the accepted seven-field text requires a governed partial reconciliation;
- immutable semantic-profile allocation governance becomes mandatory;
- mutable Draft version labels cannot be reused automatically as semantic
  identifiers;
- downstream documentation must record the new boundary; and
- canonical Rule representation remains blocked until the selected profile is
  frozen, allocated, and permanently anchored.

No new primitive, registry, compatibility alias, Rule occurrence identity,
Rule verification profile, or content digest is introduced.

## 19. Affected authority

If accepted, this ADR affects only the Rule-boundary portion of
ADR-RULE-001/002 and the subsequent Rule semantic/profile governance work.

It does not itself revise:

- ADR-RULE-001/002;
- VE-CEL-1 Draft v0.2;
- any Rule representation specification;
- Execution Right;
- Claim, Predicate, Action, Event, Receipt, or Adapter semantics;
- `CHANGELOG.md`;
- `OPEN_DECISIONS.md`; or
- the RS-CEL-001 Gap Analysis.

Those artifacts change, if required, only through the governed follow-up
sequence below.

## 20. Required post-acceptance work

The governed follow-up sequence is:

1. transition ADR-013 through its own governed change from `Proposed` to
   `Accepted` and merge that Accepted transition into authoritative `main`;
2. resolve RFC-013's status independently through repository governance; its
   transition may occur separately or in the same governed reconciliation
   only when that change explicitly transitions RFC-013 itself;
3. after ADR-013 is authoritative, reconcile and explicitly record the partial
   supersession of only the
   affected ADR-RULE-001/002 Rule-boundary text;
4. reconcile authoritative Rule semantic documentation while preserving the
   unaffected decisions listed in Section 11;
5. add the required `CHANGELOG.md` entry for the Class C semantic change;
6. freeze one exact VE-CEL semantic closure;
7. allocate its immutable `semantics_version`;
8. bind that identifier permanently to immutable normative authority and
   preserve historical resolution;
9. add a superseding or corrective non-normative analysis recording that the
   RS-CEL-001 Gap Analysis closed Rule input/evaluation portability but that
   canonical Rule field semantics required this governance correction; and
10. only after the immutable VE-CEL semantic profile exists, resume canonical
   Rule representation and Rule content-identity
   specification.

Repository governance may combine reconciliation steps in one pull request
provided every dependency and each document's independent status transition
remain explicit.

No step in that sequence is performed by this one-file Proposed ADR draft.

## 21. RFC disposition

RFC-013 remains Proposed and non-authoritative during this ADR drafting task.
RFC-013 and ADR-013 have independent governance status. Acceptance of ADR-013
does not accept RFC-013, and acceptance of RFC-013 does not accept ADR-013.
Each transition requires an explicit governed repository change to that
document. A single governed change may transition the two documents at the
same time only when it explicitly changes each status.

ADR-013 may reference RFC-013 as its proposal and rationale source regardless
of RFC-013's current status. ADR-013 becomes authoritative only when its own
status is changed from `Proposed` to `Accepted` through repository governance
and that Accepted transition is merged into authoritative `main`. Merely
merging this Proposed candidate, or passing validation, audit, or review, does
not accept it.

This candidate performs no status transition. Until ADR-013 itself becomes
authoritative, the seven-field ADR-RULE-001/002 boundary remains authoritative
and its partial supersession does not take effect. RFC-013's disposition must
be resolved independently under the governance applicable to subsequent
reconciliation and implementation work.

## 22. Architectural Decision Test

| Test | Result |
|---|---|
| Founding Principles consistency | **Pass.** Exact immutable semantics, specification-first change, authority separation, and durable evidence preserve the governing principles. |
| Primitive burden | **Pass.** The decision retains existing Rule and introduces no primitive, registry, or replacement field. |
| Removability | **Pass.** Removing `source` loses the exact policy artifact; removing `language` or `semantics_version` makes interpretation ambiguous. The four excluded fields can be removed without changing evaluation. |
| Twenty-year durability | **Pass.** Permanent immutable authority bindings permit historical interpretation independent of current tools, deployments, or mutable documents. |
| Independent implementability | **Pass.** After allocation, two teams resolve the same complete closure from the same pair and exact source; representation is correctly blocked until that condition is met. |
| Reduced conceptual complexity | **Pass.** Three necessary distinctions replace seven partly undefined fields without new namespace or lifecycle machinery. |

**Result: 6/6 PASS.**

## 23. Conclusion

The minimum sound canonical Rule semantic boundary is:

~~~text
Rule {
  language,
  semantics_version,
  source
}
~~~

Every `(language, semantics_version)` pair permanently selects exactly one
immutable, historically resolvable, complete evaluation-semantics closure.
The pair cannot be retargeted, and any interpretation-affecting change
requires a new `semantics_version`.

This Proposed ADR allocates no semantic version and changes no authority.
Canonical Rule representation and content identity remain blocked until
ADR-013 is authoritative, RFC-013's disposition has been resolved independently
as required by repository governance, and the initial VE-CEL immutable profile
is governed, frozen, allocated, and permanently anchored.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Initial Proposed ADR selecting the three-field Rule semantic boundary and immutable, non-retargetable, historically resolvable evaluation-profile invariant. |
