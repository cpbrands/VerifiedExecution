---
id: RFC-013
title: Canonical Rule Semantic Boundary
version: "0.1"
status: Proposed
document_type: RFC
category: Semantics
author: Verified Execution Editorial Board
created: 2026-09-12
updated: 2026-09-12
depends_on:
  - SPECIFICATION-GOVERNANCE
  - FOUNDING-PRINCIPLES
  - ADR-RULE-001-002
  - VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT
related_documents:
  - RS-CEL-001
  - GAP-ANALYSIS-RS-CEL-001-DETERMINISTIC-RULE-EVALUATION
  - ADR-ENC-001
  - DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY
  - OPEN-DECISIONS
  - SPECIFICATION-TASKS
supersedes: null
superseded_by: null
---

# RFC-013 — Canonical Rule Semantic Boundary

## 1. Status and authority boundary

**Status:** Proposed

This RFC proposes a narrow correction to the semantic boundary of the
existing kernel primitive `Rule`. It is not authoritative unless accepted
through repository governance and followed by an Accepted ADR. It does not
modify Accepted ADR-RULE-001/002, VE-CEL-1 Draft v0.2, Rule or Evaluate
semantics, any canonical representation, or any content-identity
construction.

The decision requested is:

> Which independent semantic distinctions must the kernel primitive `Rule`
> preserve, and which distinctions are already transitively fixed by the
> exact versioned evaluation profile?

No CBOR member encoding, content-digest frame, hash suite, profile code,
registry, or concrete semantic-profile identifier allocation is decided here.
Those are later profile-governance and representation tasks. Canonical Rule
representation may proceed only after this semantic boundary is accepted and
the selected language family has an immutable semantic-profile allocation.

## 2. Context

The authority and evidence used by this proposal are:

| Source | Role in this RFC |
|---|---|
| [Founding Principles](../FOUNDING_PRINCIPLES.md) and [Specification Governance](../SPECIFICATION_GOVERNANCE.md) | Require independently implementable semantics, minimum conceptual complexity, and an inspectable RFC/ADR trail for this correction. |
| [ADR-RULE-001/002](../adrs/ADR-RULE-001-002-VE-CEL-1.md) | Accepted authority for the current seven-field Rule sketch, exact-source identity, deterministic inputs, and Evaluate outcomes. |
| [VE-CEL-1 Draft v0.2](../specifications/VE-CEL-1-RULE-EVALUATE-INPUT-CONTRACT.md) | Draft candidate for the evaluation closure exercised here. Its mutable document version is not an immutable semantic-profile identifier. |
| [RS-CEL-001](../reference-scenarios/RS-CEL-001-DETERMINISTIC-RULE-EVALUATION.md) | Non-normative evidence that the VE-CEL profile evaluates deterministically, but it supplies only exact source rather than a complete seven-field Rule. |
| [RS-CEL-001 Gap Analysis](../kernel-analysis/GAP-ANALYSIS-RS-CEL-001-DETERMINISTIC-RULE-EVALUATION.md) | Non-normative analysis that correctly closes input/evaluation portability and identifies exact Rule content as the next work, but understates the field-semantic gap found during construction. |
| [ADR-ENC-001](../adrs/ADR-ENC-001-VE-CBOR-1.md) | Accepted future encoding owner once Rule semantics are closed; it does not decide the semantic fields. |
| [DIGEST-001](../specifications/DIGEST-001-PREDICATE-SCHEMA-CONTENT-IDENTITY.md) | Approved evidence for object-specific exact-content identity and domain separation; its Predicate-specific construction is not Rule authority. |
| [Open Decision Register](../OPEN_DECISIONS.md) and [Specification Tasks](../SPECIFICATION_TASKS.md) | Record Rule representation/execution as resolved at the abstract ADR scope and leave exact schemas and Rule interoperability work outstanding. |

No standalone normative Rule semantic-contract specification currently defines
the missing field meanings. The focused construction and governance analyses
that exposed the omission are observations, not authority; this RFC is the
governed proposal arising from them.

Accepted ADR-RULE-001/002 selects VE-CEL-1 for portable deterministic Rule
execution and requires a canonical Rule object containing at least:

~~~text
id
version
language
source
input_contract
output_contract
semantics_version
~~~

It also fixes the following important semantics:

- `language = VE-CEL-1` for the current portable Rule family;
- the Rule carries its exact CEL source text;
- source is valid UTF-8 and already Unicode NFC;
- whitespace and comment changes may change Rule content identity even when
  behavior is equivalent;
- the complete Rule is encoded using VE-CBOR-1; and
- its future content digest binds exact source and execution semantics.

VE-CEL-1 Draft v0.2 subsequently demonstrates the complete bounded evaluation
profile used by RS-CEL-001. Its current text fixes the CEL release, allowed language subset,
exact `action` and `claims` bindings, Action and Claim projection, Claim
ordering, Predicate-sensitive access restrictions, resource limits, Boolean
result requirement, and mapping to the four Evaluate outcomes. It also limits
exact NFC Rule source to 16,384 UTF-8 octets.

That closure is complete as a candidate, but the label `0.2` is the version of
a mutable Draft document. Current governance permits a Draft to change
substantially and does not make its version label a permanent machine-semantic
identifier. An immutable semantic-profile allocation is therefore still
required before canonical Rule representation can bind that closure.

RS-CEL-001 demonstrates deterministic evaluation under that closure. Its Gap
Analysis correctly concludes that Rule input construction and evaluation are
closed for the current Draft scope and that exact artifact identity, rather
than semantic equivalence, is required.

An attempted canonical Rule representation then exposed a semantic
incompleteness not visible at the earlier abstract-architecture stage. Current
authority does not define independently implementable meanings, types,
namespaces, syntax, relationships, or fixture values for `id`, `version`,
`input_contract`, `output_contract`, and `semantics_version`. Two teams cannot
construct the complete seven-field RS-CEL-001 Rule without coordinating
choices outside the repository.

This does not make ADR-RULE-001/002 wrong. Its exact-source, deterministic
profile, and content-binding direction remains sound. Its seven-field object
boundary is insufficiently closed for independent implementation.

## 3. Problem statement

A canonical Rule must allow independent implementations to determine:

1. exactly which policy artifact is being evaluated;
2. exactly which evaluation semantics interpret that artifact;
3. whether two Rule artifacts are the same exact Rule content; and
4. which interpretation must be reproduced during later replay or audit.

The current seven names do not meet that test. Five names identify possible
distinctions without deciding what those distinctions mean. In particular:

- `id` might mean a catalog handle, logical policy family, global identifier,
  human name, or content identity;
- `version` might mean a policy revision, deployment release, object-format
  version, or revision within an `id` lineage;
- `input_contract` might be an inline schema, a named profile, a reference, or
  a duplicate of the VE-CEL binding contract;
- `output_contract` might describe CEL's Boolean result or Evaluate's four
  semantic outcomes; and
- `semantics_version` might version Rule, VE-CEL, Evaluate, the object schema,
  or the input/output contracts.

Choosing among those meanings changes what Rule content means. It is not a
CBOR-label or serialization-only choice.

## 4. Requirements for an accepted boundary

Any accepted Rule boundary must:

1. preserve the exact Rule source artifact;
2. bind an exact, immutable evaluation-profile interpretation;
3. preserve deterministic Evaluate interoperability;
4. make a change to source or evaluation semantics a change of Rule content;
5. permit future canonical bytes and content identity without hidden context;
6. avoid semantic-equivalence normalization of source;
7. avoid making deployment naming or release workflow kernel semantics;
8. avoid duplicating semantics already fixed by a versioned evaluation
   profile;
9. remain independently implementable without a registry or bilateral
   convention;
10. require every semantic-profile identifier to resolve permanently to one
    historically available immutable authority anchor; and
11. introduce no new primitive.

Kernel Rule content need not carry a field merely to support:

- policy catalog lookup;
- human-readable naming;
- organizational namespaces;
- release management or rollout state;
- authorship or approval;
- Rule verification;
- active/inactive or effective-date state;
- Rule-set composition; or
- execution or authorization provenance.

Those concerns may associate external metadata with an exact Rule content
identity without becoming part of Rule semantics.

## 5. Existing semantic invariants

All options evaluated below must preserve:

~~~text
Rule content identity = exact artifact identity
Rule content identity != mathematical or behavioral equivalence
Rule content identity != Rule legitimacy
Rule evaluation result != authorization decision != Execution Right issuance
~~~

Consequently:

- identical retained Rule semantics produce identical future content identity;
- different valid source artifacts produce different future content identity,
  except for a cryptographic collision;
- the same source under different evaluation semantics produces different
  future content identity;
- whitespace, comment, parenthesis, and line-ending differences remain
  identity-significant when both sources are valid;
- source is not normalized into a preferred CEL form; and
- no theorem prover, AST normalizer, pretty-printer, algebraic simplifier, or
  commutative-expression sorter participates in Rule identity.

## 6. Option A — preserve all seven fields

Option A retains the Accepted list and would have to assign at least these
new explicit meanings:

| Field | Candidate meaning required by Option A |
|---|---|
| `id` | Identifier for a logical Rule family in a defined namespace. |
| `version` | Policy revision within the lineage selected by `id`. |
| `language` | Rule language or evaluation-profile family. |
| `source` | Exact Rule source artifact. |
| `input_contract` | Identifier for the complete Rule input environment. |
| `output_contract` | Identifier for the raw Rule and/or Evaluate result contract. |
| `semantics_version` | Immutable semantic-profile identifier for one complete Rule/Evaluate closure. |

These are candidate meanings, not existing authority. Making them portable
would additionally require:

- an `id` namespace and comparison rule;
- version syntax and lineage semantics;
- a decision about whether source changes require a version change;
- input-contract identifier syntax, authority, and version behavior;
- output-contract identifier syntax, authority, and version behavior; and
- a precise definition of the semantic layer selected by
  `semantics_version`.

No tested kernel operation requires an `id` lineage or deployment release
version. Exact content identity already answers exact cross-system equality
and replay. A catalog may index that content under an external name without
changing it.

For the candidate closure demonstrated by VE-CEL-1 Draft v0.2,
`input_contract` cannot vary independently: the profile fixes the two
bindings, projections, ordering, permitted operations, and resource limits.
`output_contract` likewise cannot vary independently: the profile fixes a
Boolean CEL result and the four Evaluate outcomes. A variation in either would
require a different semantic-profile allocation, not a field-level choice
inside the same profile.

Option A is therefore implementable only after adding several semantic
namespaces and carries duplicate profile information in every Rule. It has
the lowest textual migration from ADR-RULE-001/002 but the highest semantic
and policy-management burden.

## 7. Option B — language, semantics version, and source

Option B retains exactly:

~~~text
Rule {
  language,
  semantics_version,
  source
}
~~~

The retained fields have these proposed meanings:

### 7.1 `language`

`language` identifies the Rule evaluation language/profile family. For the
current portable family its exact semantic value is `VE-CEL-1`.

`language` does not by itself select a moving "latest" profile. It preserves
the independent distinction between CEL-based Rule artifacts and any future
Rule language/profile family.

### 7.2 `semantics_version`

`semantics_version` is an immutable semantic-profile identifier within the
family named by `language`. The pair:

~~~text
(language, semantics_version)
~~~

MUST identify exactly one complete interpretation-affecting evaluation
closure. An allocated pair MUST NOT be retargeted, and its meaning MUST never
change.

For a VE-CEL-1 allocation, the complete closure transitively fixes at least:

- the underlying CEL language/specification release and immutable revision;
- Rule source interpretation;
- permitted syntax, operators, functions, and macros;
- the `action` and `claims` binding semantics;
- Action projection;
- Claim projection;
- the eligible-Claim input contract;
- deterministic Claim ordering;
- FieldForm conversion;
- subject-reference projection;
- Predicate-sensitive guard and profile semantics;
- Integer mapping;
- structural and resource limits;
- missing, unknown, and error behavior;
- the Boolean final-result requirement; and
- Evaluate outcome mapping.

These values are owned transitively by the immutable profile binding. They are
not repeated in each Rule.

Any interpretation-affecting change to that closure MUST allocate a new
`semantics_version`. This includes a change to the underlying CEL semantics,
operator or function allowlist, input projection, Claim ordering, Integer
mapping, Predicate guard semantics, a resource limit that affects conformance
or outcome, error or result mapping, or Boolean/output semantics. A previously
allocated value MUST NOT be redefined.

An editorial correction MAY retain the same `semantics_version` only when it
does not change any conforming Rule's validity, projected environment,
evaluation behavior, resource acceptance, or result. If there is reasonable
doubt whether behavior changes, a new `semantics_version` MUST be allocated.
Ordinary document revision numbering is not semantic identity.

Every allocated pair MUST remain historically resolvable to an immutable
normative authority anchor. An acceptable authority anchor may be an immutable
repository commit or blob, an immutable published specification snapshot, or a
cryptographic content identifier. This RFC does not choose the wire form or
publication mechanism. It requires only that a future implementation or
auditor can determine permanently the exact immutable semantics selected by
the pair, without a registry primitive or bilateral convention.

VE-CEL-1 Draft v0.2 demonstrates the current candidate closure, but its Draft
document label does not allocate a canonical `semantics_version`. In
particular, this RFC does not establish:

~~~text
language = VE-CEL-1
semantics_version = 0.2
~~~

as an immutable binding merely because `0.2` is the Draft's document version.
Before canonical Rule representation can be finalized, follow-up
profile-governance work after ADR acceptance MUST:

1. freeze an exact VE-CEL semantic closure;
2. assign its immutable `semantics_version`;
3. bind that value permanently to the frozen authority anchor; and
4. preserve that anchor for historical resolution.

This RFC deliberately does not allocate the initial value. There is no
negotiation, retargeting, or implicit selection of "latest." A future
`language` family follows the same invariant and may own a different complete
input/output contract without restoring generic `input_contract` or
`output_contract` fields to Rule.

### 7.3 `source`

`source` is the exact CEL source text interpreted under the selected profile.
It must be valid UTF-8, already Unicode NFC, and no more than 16,384 UTF-8
octets under the candidate VE-CEL-1 Draft v0.2 closure. Implementations reject
non-NFC source rather than normalizing it.

The exact admitted text remains content. Spaces, tabs, comments, redundant
parentheses, final newlines, and LF/CRLF differences are preserved when the
selected profile admits both forms. Logical equivalence does not imply Rule
content equality. BOM validity and interpretation are governed by the selected
language/profile parser semantics; a host MUST NOT silently strip or normalize
a BOM outside that closure.

This RFC deliberately does not decide whether the later VE-CBOR-1 profile
represents `source` as `tstr` or validated UTF-8 `bstr`. That is representation
work after the semantic boundary is accepted.

### 7.4 Removed-field disposition

Under Option B:

- `id` becomes optional external policy-catalog or organizational metadata;
- `version` becomes optional external policy-release metadata;
- `input_contract` is fixed transitively by the exact
  `(language, semantics_version)` profile; and
- `output_contract` is fixed transitively by that same profile.

External metadata may point to future Rule content identity. It cannot alter
Rule execution or make two different canonical Rules the same content.

Option B preserves the existing `language`, `source`, and
`semantics_version` vocabulary, avoids a new identifier family, and removes
only distinctions not independently demonstrated by current Rule/Evaluate
semantics.

## 8. Option C — explicit evaluation-profile binding

Option C uses:

~~~text
Rule {
  evaluation_profile,
  source
}
~~~

`evaluation_profile` would identify one immutable closure containing the same
language, input, output, feature, resource, and result semantics described in
Option B. Conceptually:

~~~text
evaluation_profile ~= (language, semantics_version)
~~~

Both forms require the same immutability, allocation, and historical-resolution
rules. Option C does not provide a fundamentally different solution to that
problem.

It would, however:

- replace two Accepted fields with a new one;
- require an exact evaluation-profile identifier syntax or allocation
  convention;
- raise questions about namespace authority and version evolution;
- create greater migration from the Accepted terminology; and
- supply no tested interoperability benefit beyond the exact pair in Option B.

Option C is conceptually compact, but its identifier mechanism adds machinery
that Option B does not need. Option B remains preferred because it reuses
Accepted Rule terminology, preserves the family/version distinction, and
achieves the same semantic closure once the immutable-version rules above are
satisfied.

## 9. Necessity tests

### 9.1 `id`

Removing an internal `id` does not prevent exact Rule equality, exchange,
replay, or audit because future Rule content identity addresses the exact
artifact. Catalog lookup, audit display, and logical policy lineage can use
external metadata associated with that identity. No current scenario requires
the catalog relationship to change Rule evaluation.

### 9.2 `version`

Exact Rule content identity distinguishes every identity-affecting source or
profile change. Rollout, rollback, release labels, and human-readable revision
lineage belong to policy provisioning. No current kernel semantic outcome
depends on an independent Rule release number.

### 9.3 `input_contract`

The candidate VE-CEL-1 Draft v0.2 closure admits no independent Rule-selected
input contract. All Rules under that closure receive exactly `action` and `claims` with one fixed
projection and ordering contract. Allowing the field to vary without changing
the selected profile would permit two Rules claiming the same profile to
expect different environments, defeating deterministic interoperability.

### 9.4 `output_contract`

The candidate VE-CEL-1 Draft v0.2 closure admits no independent Rule-selected
output contract. The Rule's raw result is Boolean, and Evaluate owns the mapping to `SATISFIED`,
`NOT_SATISFIED`, `INDETERMINATE`, and `EVALUATION_ERROR`. A Rule cannot select
authorization semantics by changing an output declaration.

### 9.5 `semantics_version`

An exact immutable semantic-profile binding is necessary. `language =
VE-CEL-1` alone cannot distinguish one frozen closure from a future profile
with different operators, limits, bindings, or result behavior. Retaining
`semantics_version` avoids moving interpretation only when the value is
permanently bound to immutable historically available authority. A mutable
Draft document number does not satisfy this requirement.

## 10. Option comparison

| Criterion | Option A: seven fields | Option B: three fields | Option C: profile + source |
|---|---|---|---|
| Independently implementable | Only after defining five missing meanings and several namespaces | Yes, after the pair invariant is accepted, an immutable profile is allocated, and representation is defined | Yes, after defining and immutably allocating a new profile identifier |
| Semantic redundancy | High for input/output; uncertain for id/version | Low | Lowest field count |
| Namespace machinery required | Rule-family, release, input-contract, output-contract, and semantics-version rules | Existing family plus immutable semantic-profile allocation only | New evaluation-profile identifier convention plus the same immutable allocation rule |
| Twenty-year durability | Weak until every namespace and lineage rule is fixed | Strong once every pair remains permanently bound to an immutable historical authority | Strong under the same historical-resolution invariant, but with a new field convention |
| Content-identity suitability | Binds exact artifact but leaks catalog/release changes into content | Binds every demonstrated interpretation-affecting distinction | Binds every demonstrated interpretation-affecting distinction |
| Policy-management leakage | High | None | None |
| Conceptual complexity | Highest | Low | Lowest object shape, but higher identifier machinery |
| Migration/governance impact | Completes existing fields without removal, but adds extensive semantics | Removes four Accepted fields; reuses three Accepted fields | Replaces five Accepted fields and adds a new field/convention |

Option B offers the lowest total conceptual complexity. Option C has one fewer
field but requires a new profile-identifier mechanism. Option A preserves the
old list but cannot justify the independent kernel value of four fields and
would freeze policy-management machinery into Rule content.

## 11. Proposed decision

Adopt **Option B**.

The canonical Rule semantic boundary becomes exactly:

~~~text
Rule {
  language,
  semantics_version,
  source
}
~~~

Each retained field preserves one necessary distinction:

| Field | Independent semantic distinction |
|---|---|
| `language` | Which Rule evaluation language/profile family interprets the source. |
| `semantics_version` | Which immutable semantics within that family governs interpretation. |
| `source` | Which exact policy source artifact is evaluated. |

Together they are sufficient for two teams to construct a Rule without
coordination only after the selected family has allocated an immutable
semantic profile. For the current workstream the eventual relation is:

~~~text
language = VE-CEL-1
semantics_version = <allocated immutable VE-CEL semantic-profile identifier>
source = the exact NFC CEL source published by RS-CEL-001
~~~

This RFC does not allocate that identifier. VE-CEL-1 Draft v0.2 demonstrates
the candidate semantics but is not canonically selected by the bare document
version `0.2`.

The exact representation and content digest remain subsequent specification
work. That work must bind all three fields, use VE-CBOR-1, preserve Rule-local
domain separation, and refrain from creating semantic-equivalence identity.
It remains blocked until the immutable VE-CEL semantic-profile allocation is
complete.

## 12. External policy metadata boundary

The following are outside canonical Rule content unless a future governed
scenario establishes an independent execution-semantic need:

- policy catalog identifier;
- human-readable name;
- organizational namespace;
- release version or build number;
- deployment revision;
- author or approver;
- active/inactive state; and
- effective dates.

An authority may maintain these values in policy-provisioning or audit records
and bind them to exact Rule content identity. They do not determine what the
Rule computes.

## 13. Rule legitimacy boundary

Rule content answers:

> Which exact Rule artifact and interpretation is this?

It does not establish:

- who authored or approved the Rule;
- whether it is current;
- whether a Root Authority recognizes it;
- whether it is applicable to an Action; or
- whether it should govern an authorization decision.

This RFC adds no signature, `Rule.verification`, author identity, trust
registry, policy registry, or Root Authority approval field. Rule legitimacy
remains policy-provisioning and deployment authority.

## 14. Evaluate and Execution Right boundaries

The proposal changes no Evaluate behavior. The selected VE-CEL profile
continues to own Action projection, Claim eligibility and projection, Claim
ordering, operators, limits, and result mapping.

The separation remains:

~~~text
Rule evaluation result != authorization decision != Execution Right issuance
~~~

Execution Right remains bound exactly to:

~~~text
(action_id, action_digest)
~~~

Rule content identity, Rule metadata, Evaluate result, Claim-set identity, and
policy provenance are not added to the Execution Right body.

## 15. Content-identity consequences

This RFC does not define a digest. A later representation specification must
preserve these identity semantics:

~~~text
same canonical language + semantics_version + source
    -> same Rule content identity

different source or selected evaluation semantics
    -> different Rule content identity, except cryptographic collision
~~~

Logical or mathematical equivalence is irrelevant. No Rule occurrence
identity, Rule reference object, compatibility alias, registry, or collision
recovery identity is introduced.

## 16. Migration and governance impact

If accepted and recorded by an ADR, this decision requires a narrow,
inspectable reconciliation sequence:

1. accept the corresponding ADR establishing both the three-field canonical
   Rule boundary and the immutable semantic-profile invariant;
2. through that new ADR, partially supersede only the seven-field
   canonical-object portion of Accepted ADR-RULE-001/002 while preserving its
   unaffected decisions;
3. reconcile authoritative Rule semantic documentation while preserving
   ADR-RULE-001/002's
   VE-CEL selection, exact-source identity, deterministic-input, side-effect,
   and Evaluate-outcome decisions;
4. add the governance-required `CHANGELOG.md` entry recording the Class C
   breaking semantic change from the seven-field canonical Rule boundary to
   the three-field boundary, the unchanged Rule evaluation behavior, and the
   absence of a standardized portable Rule wire artifact requiring migration;
5. revise VE-CEL-1 through its applicable governance to establish the
   immutable semantic-profile allocation mechanism, freeze one exact closure,
   assign its initial `semantics_version`, bind that value permanently to its
   immutable authority anchor, and preserve historical resolution without
   changing the frozen evaluation behavior;
6. add a superseding non-normative analysis that corrects the RS-CEL-001 Gap
   Analysis conclusion that Rule semantic closure was sufficient for immediate
   representation work; and
7. only after the immutable VE-CEL semantic profile exists, resume the
   canonical Rule representation and Rule-specific
   content-identity specification.

This RFC remains Proposed and non-authoritative. `CHANGELOG.md` MUST NOT be
modified by this RFC-only candidate change. The required changelog entry is a
post-acceptance reconciliation step and occurs only after the corresponding
ADR is accepted.

There is currently no standalone normative Rule semantic-contract
specification to revise. The future Rule representation specification will be
the first concrete normative embodiment of the accepted boundary.

The merged RS-CEL-001 Gap Analysis remains historically useful and correct on
Rule-input and Evaluate portability. It must not be rewritten as though the
field-semantic defect was never found. Its future correction should record:

~~~text
Rule input/evaluation portability = CLOSED FOR VE-CEL-1 DRAFT V0.2 SCOPE
exact-artifact identity direction = CLOSED
canonical Rule field semantics = GAP DISCOVERED DURING CONSTRUCTION
representation/content identity = BLOCKED UNTIL RFC/ADR RECONCILIATION
~~~

## 17. Compatibility classification

**Classification:** Class C — Breaking Semantic Change.

No canonical Rule bytes or Rule content identities have been approved or
published, so this proposal invalidates no conforming Rule encoding. It does
change an Accepted architectural field list before that list became
independently implementable. Rule evaluation behavior is unchanged.
The absence of a normative wire-artifact migration does not remove the Class C
governance obligation: after RFC and ADR acceptance, the breaking architectural
boundary change MUST be recorded in `CHANGELOG.md`.

Implementations that privately adopted the incomplete seven-field sketch may
need to map catalog and release metadata outside the canonical Rule and select
the exact VE-CEL semantics version explicitly. The repository contains no
evidence sufficient to quantify external adoption, so deployment impact is
unknown.

## 18. Security impact

The immutable profile invariant prevents semantic-profile substitution,
reinterpretation of historical Rule artifacts under changed semantics, replay
ambiguity, and silent retargeting of a semantic version. A deployment MUST NOT
silently substitute another `semantics_version` when evaluating a Rule. Future
exact Rule content identity MUST bind the selected semantic version together
with `language` and exact `source`.

This boundary does not establish Rule authorship, approval, legitimacy,
currency, applicability, or trust. Those remain external policy-provisioning,
Root Authority, and deployment concerns. The proposal adds no key, signature,
trust, registry, or authorization semantics.

## 19. Architectural Decision Tests

### 19.1 Option A

| Test | Result |
|---|---|
| Founding Principles consistency | Partial. Exact source and deterministic interpretation fit; catalog and release fields do not establish a kernel need. |
| Primitive burden | Pass. It adds no primitive, but adds several semantic namespaces. |
| Removability | Fail. `id`, `version`, `input_contract`, and `output_contract` can be removed without changing current evaluation. |
| Twenty-year durability | Weak. Undefined organizational namespaces and release lineages are not durable protocol semantics. |
| Independent implementability | Fail under current authority; possible only after substantial new semantic machinery. |
| Reduced conceptual complexity | Fail. It duplicates profile-owned input/output semantics and embeds policy management. |

### 19.2 Option B

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. It preserves exact deterministic policy interpretation without conflating policy management, authority, or execution. |
| Primitive burden | Pass. It retains Rule and adds no new primitive or registry. |
| Removability | Pass. Removing source loses the policy artifact; removing language or semantics version makes interpretation ambiguous. |
| Twenty-year durability | Pass. Every allocated family/version pair remains permanently bound to historically available immutable semantics, independently of compiler or deployment. |
| Independent implementability | Pass. The invariant is complete: after a language family allocates an immutable profile, two teams resolve the same complete closure from the pair; representation remains correctly gated until then. |
| Reduced conceptual complexity | Pass. Three fields preserve all demonstrated distinctions and remove four unowned ones. |

### 19.3 Option C

| Test | Result |
|---|---|
| Founding Principles consistency | Pass. It can bind exact deterministic interpretation. |
| Primitive burden | Pass, provided the profile identifier remains a field and not a registry primitive. |
| Removability | Pass. Both profile and source are necessary. |
| Twenty-year durability | Conditional. It requires the same immutable historical binding as Option B plus a stable new identifier convention. |
| Independent implementability | Conditional. The new identifier syntax must first be governed and immutably allocated; the field itself does not solve profile mutability. |
| Reduced conceptual complexity | Partial. The object is smallest, but the new identifier mechanism adds avoidable machinery. |

## 20. Alternatives rejected by the proposal

### Preserve seven fields because they are already Accepted

Rejected. Accepted status does not make undefined semantics independently
implementable. Completing unnecessary fields would add protocol meaning not
supported by a scenario.

### Use source alone

Rejected. The same source may have different meaning under another CEL
release, feature profile, input projection, resource model, or output mapping.

### Use `language = VE-CEL-1` without a version

Rejected. A family name cannot distinguish one frozen semantic closure from a
future changed profile and would make replay depend on external "latest"
state.

### Define semantic-equivalence identity

Rejected. Equivalence is expensive, language-version-dependent, and contrary
to the accepted exact-source identity model.

### Introduce RuleVersion, RuleIdentity, RuleReference, Policy, or RuleSet

Rejected. The decision concerns fields of the existing Rule primitive. No new
primitive is necessary.

## 21. Specification and implementation impact

This Proposed RFC authorizes no implementation change. If later accepted with
an ADR, it would authorize the governance reconciliation in Section 16. Rule
representation remains blocked until VE-CEL-1 has an immutable
semantic-profile allocation. Only after that allocation may a subsequent Draft
specification define:

- the exact three-field Rule representation;
- VE-CBOR-1 canonical bytes;
- Rule-specific domain-separated content identity;
- profile applicability and rejection behavior; and
- independent vectors.

It does not authorize:

- a digest suite/profile allocation;
- modifications to VE-CEL-1 evaluation semantics;
- Rule signatures or verification;
- Rule-set composition;
- an EvaluationResult object;
- an AuthorizationDecision object;
- changes to Action, Claim, Predicate, Event, Receipt, or Execution Right;
- CHANGELOG or OPEN_DECISIONS changes before acceptance; or
- canonical Rule representation work before governance reconciliation and an
  immutable selected-profile allocation.

## 22. Open questions and deferred specification work

### 22.1 Closed by this proposal if accepted

- the canonical Rule semantic boundary is `language`, `semantics_version`, and
  `source`;
- `language` identifies an evaluation semantic family;
- `semantics_version` permanently identifies one immutable complete closure
  within that family;
- exact admitted source is identity-significant and is not normalized into a
  semantically equivalent form; and
- `id` and release `version` are external metadata, while input and output
  contracts are transitive profile properties.

### 22.2 Deferred implementation and specification questions

- the exact wire type of each retained field;
- the exact syntax and wire type of `semantics_version`;
- how an immutable profile allocation and authority anchor are encoded and
  published;
- the initial VE-CEL-1 immutable semantic-version value;
- the Rule VE-CBOR-1 representation; and
- Rule-specific content-digest framing and any required allocation.

These questions do not alter the three semantic distinctions or the immutable
profile invariant. They must be resolved through the follow-up sequence in
Section 16 before Rule representation or content identity is finalized.

## 23. Decision request

The requested subsequent ADR decision has two inseparable parts:

> **A. Rule boundary:** Partially supersede the insufficiently closed
> seven-field canonical Rule boundary in ADR-RULE-001/002 with `language`,
> `semantics_version`, and `source`; treat `id` and release `version` as
> external policy metadata; and treat input and output contracts as transitive
> properties of the selected evaluation profile.
>
> **B. Immutable profile invariant:** Require every `(language,
> semantics_version)` pair to identify permanently one historically available,
> immutable, complete evaluation-semantics closure. The pair is not retargetable;
> every interpretation-affecting change requires a new `semantics_version`.

Until this RFC and its corresponding ADR are accepted, the seven-field text
in ADR-RULE-001/002 remains authoritative. After acceptance, canonical Rule
representation and content-identity allocation remain blocked until the
selected language family has a historically resolvable immutable semantic
profile allocation.

## 24. Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-12 | Corrected Proposed RFC after independent audit: separates semantic-profile identity from mutable document versions; adds permanent resolution, allocation, Draft, compatibility, security, migration, and open-question rules. |
| 0.1 | 2026-09-12 | Initial Proposed RFC identifying the seven-field semantic incompleteness, comparing preservation and reduction options, and recommending the three-field Rule boundary. |
