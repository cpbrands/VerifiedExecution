# VE-001 — Action Specification

**Version:** 0.1  
**Status:** Draft  
**Category:** Core Primitive Specification  
**Identifier:** VE-001  
**Depends on:** VE-000  
**Project:** Verified Execution

---

## Abstract

This specification defines the **Action**, the canonical representation of a request to produce a governed consequential external side effect.

An Action is the fundamental unit of intent in Verified Execution.

It expresses **what is being requested**, **by whom or what**, **under which authority context**, and **against which target**, but it does not itself imply authorization, successful execution, legitimacy, or outcome.

All governed execution requests MUST be converted into a canonical Action before external execution is attempted.

This specification defines:

- Action semantics,
- Action identity,
- Action boundaries,
- required semantic fields,
- canonicalization rules,
- immutability requirements,
- relationships,
- duplicate handling,
- retry implications,
- validation requirements,
- privacy considerations,
- conformance criteria,
- and open questions.

---

# 1. Purpose

The purpose of the Action primitive is to provide one stable representation for consequential execution intent regardless of:

- AI model,
- model provider,
- agent framework,
- transport protocol,
- programming language,
- external system,
- or application domain.

Without a canonical Action, downstream policy, authorization, evidence, audit, and verification mechanisms would depend upon vendor-specific representations.

Verified Execution therefore establishes the Action as the authoritative representation of governed intent.

---

# 2. Scope

VE-001 defines the semantics of an Action.

It does not define:

- Event serialization,
- lifecycle transition rules,
- policy languages,
- authorization protocols,
- Adapter interfaces,
- Receipt formats,
- cryptographic signatures,
- execution transport protocols.

Those concerns are defined elsewhere.

VE-001 defines the object those systems operate upon.

---

# 3. Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative when capitalized.

Their interpretation follows VE-000.

---

# 4. Definition

An **Action** is:

> **The canonical, immutable representation of a request to produce one governed consequential change in an external system or environment.**

Three properties are essential.

An Action represents:

1. **Intent**
2. **A defined execution target**
3. **A bounded requested effect**

An Action does not represent:

- permission,
- policy satisfaction,
- execution,
- success,
- correctness,
- legitimacy.

Those properties are determined elsewhere in the lifecycle.

---

# 5. Intent Is Not Execution

The existence of an Action MUST NOT imply that execution occurred.

The following are distinct:

```text
ACTION EXISTS
      ≠
ACTION AUTHORIZED
      ≠
ACTION EXECUTED
      ≠
ACTION SUCCEEDED
```

An Action MAY exist permanently without ever being executed.

For example:

```text
Action:
Transfer $100,000

Outcome:
REJECTED
```

The Action remains historically meaningful even though no transfer occurred.

---

# 6. What Constitutes an Action

An Action SHOULD represent the smallest **semantically meaningful governed side effect** for which independent authorization, lifecycle tracking, and evidence are useful.

This definition deliberately avoids equating an Action with:

- one HTTP request,
- one function call,
- one model tool call,
- one database statement,
- one workflow step.

Those are implementation mechanics.

An Action is a semantic unit.

---

# 7. Action Boundary

Determining where one Action ends and another begins is fundamental.

The default rule is:

> **If two requested effects can be independently authorized, independently fail, independently produce consequences, or require distinct evidence, they SHOULD be separate Actions.**

Examples:

```text
Send one email
→ one Action

Transfer money to one beneficiary
→ one Action

Delete one customer account
→ one Action
```

By contrast:

```text
Generate email body
→ not necessarily an Action

Calculate tax amount
→ not necessarily an Action

Rank candidate responses
→ not necessarily an Action
```

unless those operations themselves cause governed external consequences.

---

# 8. Consequentiality

Verified Execution does not define one universal list of consequential Actions.

A deployment MUST define its governed execution scope.

A requested operation SHOULD be treated as consequential when it can materially alter:

- persistent external state,
- financial state,
- legal state,
- security state,
- organizational state,
- human communication,
- physical systems,
- permissions,
- or externally observable behavior.

Examples MAY include:

- sending communication,
- modifying a database,
- moving funds,
- approving access,
- issuing a purchase order,
- deploying code,
- deleting infrastructure,
- operating machinery.

A deployment MAY govern additional classes of Actions.

---

# 9. Reads and Observations

Pure reads are not automatically Actions under VE-001.

For example:

```text
Read weather data
Read customer record
Query inventory
Retrieve documentation
```

These are ordinarily outside the Action primitive unless the deployment explicitly governs them.

However, a read MAY become consequential where access itself creates a meaningful external effect.

Examples include:

- accessing regulated health records,
- retrieving classified information,
- reading data that triggers billing,
- querying a system where access must itself be authorized and evidenced.

Therefore:

> **Consequentiality depends upon the effect of the operation, not merely whether the operation is syntactically a read or write.**

---

# 10. Action Identity

Every Action MUST have exactly one globally unique identifier.

The canonical field name is:

```text
action_id
```

The identifier MUST:

- be unique within all contexts in which Receipts or Events may later be compared,
- remain immutable,
- never be reassigned,
- never identify a materially different Action.

UUIDv7 is RECOMMENDED for the initial reference implementation.

VE-001 does not require UUIDv7 as a protocol-level invariant.

---

# 11. Action Identity and Semantic Identity

Two Actions MAY request identical effects while remaining distinct Actions.

Example:

```text
Action A
Send "Hello" to alice@example.com

Action B
Send "Hello" to alice@example.com
```

These are not necessarily duplicates.

They may represent two separately requested executions.

Therefore:

```text
same payload ≠ same Action
```

Action identity is historical identity, not content identity.

---

# 12. Required Semantic Fields

Every canonical Action MUST contain or durably reference the following semantic information.

## 12.1 `action_id`

Unique immutable Action identity.

## 12.2 `spec_version`

The version of VE semantics required to interpret the Action.

Example:

```text
VE-001/0.1
```

## 12.3 `created_at`

The time at which the Action entered the canonical execution system.

This field is evidentiary.

It MUST NOT be relied upon as the sole mechanism for causal ordering.

## 12.4 `initiator`

The system or actor that proposed the Action.

Examples:

```text
agent:billing-assistant
model-session:abc123
human:user-482
service:workflow-engine
```

## 12.5 `authority_context`

A durable reference to the authority under which the initiator is attempting to act.

The Action does not determine whether that authority is valid.

It records the claimed or resolved execution context so downstream systems can evaluate it.

## 12.6 `target`

The logical external system or capability to be affected.

Example:

```text
gmail
stripe
github
production-database
warehouse-robot
```

## 12.7 `operation`

The requested semantic operation.

Example:

```text
send_email
transfer_funds
merge_pull_request
delete_record
unlock_door
```

## 12.8 `arguments`

The parameters necessary to describe the requested operation.

Arguments MUST be sufficient for downstream components to understand what effect is being requested.

## 12.9 `scope`

The deployment or protection scope under which the Action is governed.

This MAY reference:

- organization,
- tenant,
- environment,
- project,
- account,
- jurisdiction.

---

# 13. Recommended Fields

A canonical Action SHOULD support the following where relevant.

## 13.1 `correlation_id`

Groups related Actions belonging to one larger business process.

## 13.2 `parent_action_id`

Identifies an Action that caused or delegated creation of this Action.

## 13.3 `request_context`

References contextual evidence relevant to the Action.

## 13.4 `idempotency_key`

Supports safe duplicate suppression where appropriate.

## 13.5 `expires_at`

Defines a time after which execution SHOULD NOT begin without renewed authorization.

## 13.6 `labels`

Non-authoritative metadata for indexing or classification.

Labels MUST NOT silently alter Action semantics.

---

# 14. Minimal Abstract Schema

VE-001 does not yet define a final wire format.

The following schema is illustrative:

```json
{
  "action_id": "01945b8e-....",
  "spec_version": "VE-001/0.1",
  "created_at": "2026-08-10T19:30:00Z",

  "initiator": {
    "type": "agent",
    "id": "billing-agent"
  },

  "authority_context": {
    "organization_id": "org-123",
    "principal_id": "user-456"
  },

  "scope": {
    "environment": "production"
  },

  "target": {
    "type": "email",
    "provider": "gmail"
  },

  "operation": "send_email",

  "arguments": {
    "to": "customer@example.com",
    "subject": "Invoice",
    "body": "..."
  }
}
```

This representation is informative, not final.

Semantics are normative.

Serialization is not.

---

# 15. Canonicalization

Vendor-specific requests MUST be converted into canonical Actions before governed execution.

Examples:

```text
OpenAI tool call
        │
        ▼
Canonical Action

Claude tool use
        │
        ▼
Canonical Action

MCP invocation
        │
        ▼
Canonical Action

Custom agent request
        │
        ▼
Canonical Action
```

Once accepted into the Verified Execution lifecycle, the canonical Action becomes the authoritative representation of requested intent.

---

# 16. Canonicalization Requirements

Canonicalization MUST preserve the semantic meaning of the original request.

A canonicalizer MUST NOT:

- broaden authority,
- silently add operations,
- omit material arguments,
- change target,
- weaken restrictions,
- reinterpret an ambiguous request as a more permissive one.

If canonicalization cannot determine the requested effect unambiguously, the Action SHOULD be rejected or require clarification.

Ambiguity MUST NOT silently resolve in favor of greater authority.

---

# 17. Action Immutability

Once an Action becomes authoritative, its semantic content MUST be immutable.

Fields such as:

- target,
- operation,
- arguments,
- initiator,
- authority context,

MUST NOT be silently mutated.

If semantic intent changes materially, a new Action MUST be created.

Example:

```text
Action A:
Transfer $1,000

later changed to:

Transfer $10,000
```

This MUST NOT remain Action A.

A new Action is required.

---

# 18. Non-Semantic Metadata

Some metadata MAY evolve without creating a new Action if it does not alter requested intent.

Examples might include:

- indexes,
- storage location,
- local processing annotations,
- display metadata.

Such metadata MUST be clearly separated from authoritative Action semantics.

---

# 19. Action Status

A mutable `status` field MUST NOT be part of the authoritative semantic Action.

Status is derived from Event history.

Implementations MAY expose:

```text
current_status
```

as a projection for convenience.

That projection MUST NOT redefine the Action.

---

# 20. Validation

An Action MUST undergo structural validation before execution.

Validation SHOULD determine at minimum:

- required fields exist,
- operation is understood,
- target is resolvable,
- arguments satisfy declared schema,
- specification version is supported.

Structural validation does not establish authorization.

---

# 21. Semantic Validation

A deployment MAY perform semantic validation.

Examples:

```text
amount > 0
recipient has valid format
repository exists
resource identifier is resolvable
```

Validation MUST NOT be confused with policy.

Example:

```text
"amount is a valid decimal"
```

is validation.

```text
"agent may transfer no more than $10,000"
```

is policy or authorization.

The distinction SHOULD remain explicit.

---

# 22. Action Relationships

Actions MAY relate to other Actions.

VE-001 recognizes relationships as metadata, not new primitives.

Common relationships include:

```text
parent
child
caused_by
compensates
retries
supersedes
delegated_from
correlated_with
```

A future specification MAY standardize relationship semantics.

---

# 23. Parent and Child Actions

A high-level Action MAY require several subordinate Actions.

Example:

```text
Action A
Provision employee

    ├── Action B
    │   Create email account
    │
    ├── Action C
    │   Grant repository access
    │
    └── Action D
        Create payroll record
```

If each subordinate operation has independent consequence or authorization requirements, each SHOULD be represented as a separate Action.

The parent Action MUST NOT erase subordinate histories.

---

# 24. Composite Intent

An Action SHOULD NOT become a general-purpose workflow container.

If one requested intent contains several independently consequential effects, implementations SHOULD decompose it.

Example:

```text
"Terminate employee"
```

might imply:

```text
Disable account
Revoke credentials
Cancel payroll
Notify manager
Remove physical access
```

These may require independent Actions.

The high-level business operation MAY remain a parent Action or correlation context.

---

# 25. Atomicity

VE-001 does not guarantee transaction-level atomicity across external systems.

An Action represents semantic intent.

Whether an Adapter or target can execute atomically is target-specific.

Implementations MUST NOT claim atomic execution where the external system cannot provide it.

---

# 26. Idempotency

An Action MAY carry an idempotency key.

The purpose is to reduce duplicate external effects.

Idempotency identity and Action identity are different.

```text
action_id
```

identifies the historical request.

```text
idempotency_key
```

identifies an execution-equivalence class for duplicate suppression.

Two Actions MAY have different `action_id` values but the same `idempotency_key` if the deployment intentionally treats them as equivalent execution attempts.

This behavior MUST be explicit.

---

# 27. Duplicate Detection

Duplicate detection MUST NOT rely solely on payload equality.

Identical content can represent legitimate repeated intent.

Example:

```text
Pay employee $2,000
```

may correctly occur every two weeks.

Content equality alone cannot determine duplication.

---

# 28. Retries

A retry is not automatically a new Action.

VE-001 distinguishes:

```text
Action
```

from:

```text
execution attempt
```

The Action expresses intent.

An Action may require multiple execution attempts because of transient failures.

Attempt semantics are not fully defined in VE-001 v0.1.

However:

- every material attempt MUST remain evidentiary,
- retry behavior MUST NOT erase previous attempts,
- retries MUST NOT silently create duplicate external effects.

Whether attempts become dedicated Events or a future subordinate structure remains an open question.

---

# 29. Expiration

An Action MAY define an expiration time.

If present, execution SHOULD NOT begin after expiration unless the system records renewed authority or creates a replacement Action.

Expiration does not delete the Action.

It affects whether execution remains eligible.

---

# 30. Cancellation

Cancellation does not mutate the Action.

It is a lifecycle event applied to the Action.

A cancelled Action remains historical intent.

---

# 31. Rejection

Rejection does not invalidate the existence of the Action.

It means the requested intent did not satisfy conditions required for execution.

The Action remains part of authoritative history.

---

# 32. Compensation

A previously executed Action MUST NOT be modified to represent reversal.

Compensation requires a new Action.

Example:

```text
Action A
Charge $100

Action B
Refund $100
compensates: Action A
```

This preserves reality rather than rewriting it.

---

# 33. Human-Originated Actions

Verified Execution is not restricted to AI-originated Actions.

A human MAY initiate an Action.

A service MAY initiate an Action.

An AI MAY initiate an Action.

The architecture benefits from one canonical execution model.

Example:

```text
Human
  │
AI
  │
Workflow
  │
Service
  ▼
Action
```

The initiator identity records the difference.

---

# 34. Delegated Actions

An AI may act on behalf of another principal.

The Action SHOULD preserve both:

```text
initiator
```

and:

```text
authority principal
```

Example:

```text
initiator:
travel-agent-ai

authority principal:
employee-123
```

These MUST NOT be collapsed conceptually.

Identity and delegation are defined more fully elsewhere.

---

# 35. Nested AI Systems

One AI system MAY ask another AI system to propose an Action.

Only the system crossing the Execution Boundary requires canonical Action representation at that moment.

Internal reasoning or delegation between models does not automatically require new Actions unless it produces separately governed consequential intent.

This prevents uncontrolled explosion of Action objects.

---

# 36. Action Granularity

Action granularity is one of the central design risks.

Too coarse:

```text
Run the company
```

is not meaningful enough for governance.

Too fine:

```text
write byte
increment counter
serialize field
```

creates meaningless administrative noise.

The correct granularity is:

> **the smallest externally consequential semantic unit that benefits from independent governance and evidence.**

---

# 37. Granularity Test

A proposed Action boundary SHOULD be split if any answer below is yes:

1. Can part of the requested effect succeed while another part fails?
2. Can different authority govern different parts?
3. Would an auditor care which part occurred?
4. Can part be compensated independently?
5. Would different evidence be required?
6. Can an external target execute the parts independently?

If none apply, a single Action MAY be appropriate.

---

# 38. Examples

## 38.1 Send Email

```text
target:
email

operation:
send

arguments:
recipient
subject
body
```

One externally consequential communication.

Valid Action.

---

## 38.2 Generate Email Draft

If the draft exists only in ephemeral internal model memory:

Not necessarily an Action.

If the draft is persisted into the user's mailbox:

It MAY be an Action because external state changed.

---

## 38.3 Transfer Funds

```text
target:
bank-account

operation:
transfer

arguments:
beneficiary
amount
currency
```

Valid Action.

---

## 38.4 Explain Transfer Options

No external state change.

Not ordinarily an Action.

---

## 38.5 Delete Customer

A request that removes a durable external record.

Valid Action.

---

## 38.6 Query Customer

Ordinarily not an Action under the default scope.

MAY be governed where data-access consequences require it.

---

## 38.7 Deploy Application

One deployment creating an externally meaningful production change.

Valid Action.

---

## 38.8 Write 500 Deployment Files

Those file writes SHOULD NOT automatically become 500 Actions if they are implementation mechanics of one governed deployment.

---

# 39. Anti-Examples

The following SHOULD NOT ordinarily be modeled as Actions:

```text
Think about the problem
Summarize a document
Rank alternatives
Generate an internal plan
Calculate a number
Select a token
Perform internal inference
```

unless the operation itself creates a governed external effect.

---

# 40. Action Content and Reasoning

An Action SHOULD describe requested execution intent.

It MUST NOT require private chain-of-thought.

A deployment MAY attach:

- rationale,
- reason code,
- policy-relevant facts,
- model-generated explanation,
- decision summary.

These SHOULD be treated as evidence or context, not hidden internal reasoning requirements.

---

# 41. Sensitive Arguments

Action arguments MAY contain sensitive data.

Implementations MUST NOT assume that complete plaintext payload retention is required for verifiability.

Systems SHOULD support:

- redaction,
- encryption,
- commitments,
- durable references,
- selective disclosure,

where compatible with execution requirements.

Future evidence specifications MAY standardize these mechanisms.

---

# 42. Argument Integrity

If Action arguments are transformed before execution, the transformation MUST be evidentiary if it changes material execution semantics.

Example:

```text
canonical Action amount:
USD 100.00

Adapter sends:
USD 1,000.00
```

This is a violation.

A semantically equivalent encoding transformation is permitted.

Example:

```text
USD 100.00
→
10000 cents
```

provided the Adapter preserves semantic equivalence.

---

# 43. Target Identity

The target MUST be sufficiently specific to establish where the requested consequence is intended to occur.

For high-risk systems, logical names alone MAY be insufficient.

Example:

```text
target: database
```

may be ambiguous.

A stronger target might identify:

```text
service:
customer-db

environment:
production

tenant:
org-123
```

Exact target semantics are deployment-specific.

Ambiguity SHOULD fail closed.

---

# 44. Operation Semantics

Operation names MUST represent semantic intent rather than vendor-specific transport when practical.

Prefer:

```text
send_email
```

over:

```text
POST /gmail/v1/users/me/messages/send
```

The Adapter owns vendor-specific transport.

The Action owns intent.

This separation improves portability.

---

# 45. Provider Independence

A canonical Action SHOULD remain meaningful if the underlying provider changes.

Example:

```text
operation:
send_email
```

may execute through Gmail today and another provider later.

Provider-specific requirements MAY still appear where necessary.

Portability SHOULD be preferred over artificial abstraction.

---

# 46. Action Schema Registry

Future implementations MAY maintain registries defining valid Action types.

Example:

```text
email.send
payment.transfer
github.merge
database.delete
```

VE-001 does not require a global registry.

A registry MUST NOT redefine core Action semantics.

---

# 47. Versioning

Action semantics MUST identify the specification version under which they are interpreted.

Action type definitions SHOULD also be versionable.

A semantic change to an operation MUST NOT silently reuse an incompatible schema version.

---

# 48. Unknown Action Types

An implementation MUST NOT execute an Action whose operation semantics it cannot safely interpret.

Unknown semantics SHOULD fail closed.

---

# 49. Validation Failure

If an Action fails structural validation:

- it MUST NOT execute,
- the failure SHOULD become part of the execution history where an Action identity has already been assigned.

Malformed incoming requests that never become canonical Actions MAY be recorded outside the Action lifecycle.

---

# 50. Acceptance Point

A deployment SHOULD define the exact point at which a request becomes an authoritative Action.

Before that point, a request may be:

```text
proposal
draft
candidate
incoming request
```

After acceptance:

```text
Action
```

The acceptance point MUST be deterministic enough that implementations can determine whether an `action_id` is authoritative.

---

# 51. Pre-Action Requests

Not every AI tool call needs to become an Action.

A gateway MAY receive a candidate request, validate and normalize it, and only then commit the authoritative Action.

However, consequential requests rejected before Action creation MAY still require operational security logs.

VE-001 separates:

```text
execution audit
```

from:

```text
system ingress logging
```

---

# 52. Immutability Boundary

The moment an Action becomes authoritative defines its semantic immutability boundary.

Before acceptance, a candidate request MAY be transformed.

After acceptance, material semantic transformation requires:

- a new Action, or
- an explicitly standardized transformation Event in a future specification.

VE-001 v0.1 RECOMMENDS new Action creation for material changes.

---

# 53. Action Hashing

Implementations MAY compute a cryptographic digest of canonical Action semantics.

Hashing is not yet required for Level 1 conformance.

A future evidence specification is expected to define canonical hashing requirements.

The architecture MUST NOT assume JSON field ordering or one serialization format before canonical encoding is standardized.

---

# 54. Security Considerations

Action construction is security-sensitive.

Relevant risks include:

- argument injection,
- target substitution,
- authority confusion,
- operation ambiguity,
- stale authorization context,
- replay,
- duplicate execution,
- schema downgrade,
- malicious canonicalization.

Implementations SHOULD treat Action parsing and canonicalization as part of the trusted computing base.

---

# 55. Confused Deputy Risk

An Action MUST preserve enough authority context to avoid a system using its own greater privileges on behalf of a less privileged initiator without authorization.

Example:

```text
AI has access to execution service
Execution service has admin credentials
```

The presence of admin credentials MUST NOT imply the AI possesses admin authority.

The Execution Boundary must evaluate the Action under the relevant principal's authority.

---

# 56. Replay Risk

An old Action MUST NOT automatically regain authority merely because its serialized representation is replayed.

Execution eligibility may depend on:

- lifecycle state,
- authorization freshness,
- expiration,
- idempotency,
- nonce,
- policy state.

Replay defense is defined more fully in later specifications.

---

# 57. Conformance Requirements

An implementation conforms to VE-001 v0.1 if it satisfies all of the following.

### ACT-C01

Every governed consequential execution request becomes a canonical Action before execution.

### ACT-C02

Every authoritative Action has one immutable unique `action_id`.

### ACT-C03

Canonical Action semantics include the required fields defined in Section 12.

### ACT-C04

Material Action semantics cannot be silently mutated after acceptance.

### ACT-C05

Current lifecycle status is not authoritative Action content.

### ACT-C06

Vendor-specific execution requests do not replace canonical Action semantics.

### ACT-C07

Unknown or ambiguous Action semantics do not execute by default.

### ACT-C08

Action identity is distinct from payload equality.

### ACT-C09

Compensation does not rewrite original Actions.

### ACT-C10

Action construction does not require access to private model chain-of-thought.

---

# 58. Conformance Tests

A future machine-readable conformance suite SHOULD test at least the following.

## Test 1 — Identity stability

Create Action.

Attempt to change `action_id`.

Expected:

```text
rejected
```

## Test 2 — Semantic mutation

Create Action:

```text
transfer $100
```

Attempt to mutate:

```text
transfer $1,000
```

under same identity.

Expected:

```text
rejected
```

## Test 3 — Same content, different intent

Submit same Action payload twice without shared idempotency semantics.

Expected:

```text
two distinct Actions
```

## Test 4 — Unknown operation

Submit unsupported operation.

Expected:

```text
no execution
```

## Test 5 — Vendor normalization

Submit two provider-specific representations of the same semantic operation.

Expected:

```text
both normalize into valid canonical Action form
```

## Test 6 — Compensation

Execute Action A.

Create compensation.

Expected:

```text
Action B created
Action A unchanged
```

## Test 7 — State projection

Change cached status without Event support.

Expected:

```text
authoritative Action semantics unchanged
```

---

# 59. Architectural Decision Test

VE-001 satisfies the Verified Execution Architectural Decision Test.

### Consistency

The Action primitive is explicitly required by the Founding Principles and VE-000.

### Primitive necessity

Without Action, the system lacks a stable unit for governing execution intent.

### Removability

Removing Action collapses policy, lifecycle, evidence, and execution into vendor-specific requests.

The architecture does not survive coherently.

### Twenty-year durability

The concept of bounded consequential intent is independent of current models and protocols.

### Independent implementation

The semantics in this specification are intended to permit independent implementation.

### Complexity reduction

Action reduces total conceptual complexity by providing one canonical execution object across heterogeneous agents, frameworks, and external systems.

Therefore the primitive is justified.

---

# 60. Open Questions

## OQ-ACT-001 — Exact acceptance point

Should Action identity be assigned immediately upon ingress or only after successful canonicalization?

## OQ-ACT-002 — Execution attempts

Should attempts remain Event substructures or eventually become a formal subordinate entity?

The burden for introducing a new primitive remains high.

## OQ-ACT-003 — Canonical encoding

What serialization supports stable hashing, portability, and implementation simplicity?

## OQ-ACT-004 — Action type naming

Should global semantic operation namespaces exist?

Example:

```text
email.send
payment.transfer
```

## OQ-ACT-005 — Read governance

Should Verified Execution define a standard class for consequential reads?

## OQ-ACT-006 — Parent semantics

Should parent-child relationships have standardized authorization inheritance?

## OQ-ACT-007 — Idempotency lifetime

How long does an idempotency key remain authoritative?

## OQ-ACT-008 — Expiration semantics

Does expiration prohibit execution completely or require re-authorization?

## OQ-ACT-009 — Action transformation

Do we ever need first-class transformation semantics, or should all material changes always create new Actions?

## OQ-ACT-010 — Composite Actions

Is a formal composite Action category necessary, or are correlation and parent-child relationships sufficient?

The default assumption is that no new primitive is required.

---

# 61. Criteria for v0.2

VE-001 SHOULD advance to v0.2 only after the reference implementation has exercised:

- at least three materially different Action categories,
- at least two different external target systems,
- repeated Actions,
- retries,
- cancellation,
- compensation,
- parent-child relationships,
- validation failures,
- and sensitive payload handling.

Implementation evidence SHOULD determine whether the current Action boundary is sufficiently general.

---

# 62. Revision History

## v0.1

Initial formal definition of the Action primitive.

Established:

- semantic Action definition,
- canonicalization,
- Action identity,
- immutability,
- Action boundary,
- consequentiality,
- required fields,
- target and operation semantics,
- relationships,
- compensation,
- idempotency distinction,
- retry implications,
- privacy requirements,
- conformance requirements,
- conformance tests,
- open questions.

---

# 63. Foundational Rule

The Action primitive exists to preserve one distinction:

```text
An intelligent system may want something to happen.

That does not mean it has happened.

That does not mean it may happen.
```

Verified Execution represents that intent explicitly before consequence begins.

The canonical form is:

```text
INTENT
  │
  ▼
ACTION
  │
  ▼
EXECUTION BOUNDARY
```

Everything downstream depends upon the Action retaining a precise, immutable meaning.

If the meaning of an Action cannot be determined, governed execution MUST NOT proceed.
