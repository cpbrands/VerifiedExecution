---
id: PRESSURE-TEST-ATTEMPT-BINDING-VIA-EVENT-HISTORY
title: Attempt Binding through Event History
version: "0.1"
status: Draft
document_type: Pressure Test
category: Kernel Analysis
author: Verified Execution Editorial Board
created: 2026-08-25
updated: 2026-08-25
depends_on: []
related_documents:
  - ARCHITECTURE-INDEX
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - PRESSURE-TEST-MINIMUM-CLAIM-STRUCTURE
supersedes: null
superseded_by: null
---

# Pressure Test — Attempt Binding through Event History

## Status and authority boundary

This is non-normative kernel-analysis evidence. It does not introduce an
attempt identifier, attempt reference, execution-attempt primitive, Claim
subtype, RFC, ADR, or specification change.

The current Action/Event/Lifecycle/Receipt family remains the repository's
normative family at its stated approval and draft statuses. The reduced
`Action / Claim / Rule / Verify / Evaluate` model remains non-normative
validation. This test does not promote Draft details to Approved authority.

## Question

Can attempt-specific execution observations always bind to authoritative
Event/history objects, eliminating the need for any separate execution-
attempt identifier in Claim semantics?

## 1. Identity-layer attack

| Layer | Current role | Does it identify one execution attempt? |
|---|---|---|
| Action content | `action_digest` identifies exact semantic content. | No. |
| Action occurrence | `action_id` identifies the historical Action occurrence. | No. |
| Execution attempt | An operational try to execute one Action occurrence. | Not currently assigned a canonical identity. |
| Event/history | Each Event has an `event_id` and belongs to one Action history. | Identifies an Event, not yet a whole attempt grouping. |

Approved VE-001 requires an occurrence-specific authoritative artifact to
bind at least:

```text
action_id + action_digest
```

That identifies the Action occurrence and its exact semantic content. It
does not identify one individual execution attempt: VE-001 explicitly
permits one Action occurrence to have multiple attempts.

## 2. Event as attempt-anchor attack

An Event reference can anchor a Claim to one authoritative historical fact.
For example, once an authoritative Event exists, a Claim can concern:

```text
EventReference(E1)
  subject to Action occurrence (action_id, action_digest)
```

This works for facts whose meaning is exactly the Event's fact:

| Claim | Event/history binding result |
|---|---|
| “attempt began at T” | Works if an authoritative execution-start Event defines that beginning. |
| “adapter returned timeout” | Works if the timeout is represented or referenced by one authoritative Event. |
| “retry reached terminal failure” | Works if history establishes failure and the Claim refers to decisive Event(s). |
| “sensor observed force X during this attempt” | Not fully resolved: an Event can be referenced, but current authority does not define which collection of Events is one attempt. |

An `event_id` is a reliable historical anchor. It does not define membership
in an attempt that spans multiple Events.

## 3. Pre-Event observation attack

Consider an adapter or sensor observation before the Execution Boundary has
committed an authoritative Event:

```text
Action occurrence A
  ↓
raw Claim C exists
  ↓
authoritative Event E is later committed, if applicable
```

Before E exists, C can bind to the Action occurrence using
`action_id + action_digest`. It may carry domain-specific causal or source
information, and later an Event may reference the established Claim. That
avoids falsely treating a raw observation as authoritative history.

It does not establish that C belongs to one particular attempt when multiple
possible or overlapping attempts exist under the same Action occurrence.
Current authority defines neither a canonical causal link from C to later E
nor the rule by which Event sequences are partitioned into attempts.

This is a specification gap in Event/history association, not proof that a
new identity primitive is needed.

## 4. Multiple-retry attack

Test one Action occurrence with three sequential operational attempts:

```text
Action A = (action_id, action_digest)

attempt 1: execution-start → timeout
attempt 2: execution-start → target rejects
attempt 3: execution-start → known terminal failure
```

Event ordering can retain history and identify every Event. If a profile
defines that an `EXECUTION_STARTED` Event begins an attempt and the next
applicable execution result closes it, implementations can reconstruct the
three groups.

Current authority does not define that grouping rule. It does not specify
which Event types open or close an attempt, how non-terminal observations
attach to one, or how a retry is delimited from a delayed prior observation.
Ordering alone is therefore not sufficient for independent implementations
to derive attempt-local membership.

## 5. Concurrency attack

Now allow two operational attempts to overlap for the same Action occurrence:

```text
A / start E1
A / start E2
observation Cx
timeout E3
target response E4
```

Neither Approved VE-001 nor current Draft Event/Lifecycle documents forbid
overlapping attempts generally. VE-001 leaves attempt semantics an
execution/lifecycle concern and asks whether attempts should remain Event
structures or require future formalization.

If Cx is only bound to A, ordering cannot decide whether it belongs with E1
or E2. If Cx references E1, that identifies a causal anchor, but current
authority does not specify that E1 opens an attempt or how later Events
inherit its association. The same ambiguity applies to E3 and E4.

Concurrency defeats an implicit “nearest Event” interpretation. Such a rule
would be new semantic behavior and cannot be silently inferred from order.

## 6. Retry-semantics attack

The preferred model remains that an attempt is an interpretation of
authoritative Event sequences, not a first-class semantic object:

```text
Claim   = assertion
Event   = authoritative history
Receipt = derived summary of history
```

This test does not show that VE needs an `execution_attempt` object. It
shows that Event/history needs a profile-level association and boundary rule
before attempts can be reconstructed consistently across implementations.

## 7. Claim-binding attack

| Form | Use | Current result |
|---|---|---|
| Action content reference | Claims about exact semantic Action content. | Sufficient. |
| Action occurrence reference | Claims about one historical Action occurrence, binding `action_id + action_digest`. | Sufficient. |
| Event/history reference | Claims about one committed Event or defined history segment. | Sufficient for one Event; segment semantics remain unspecified. |

These forms cover content, occurrence, and individual Event observations.
They do not yet cover every attempt-specific observation because “the
attempt containing this observation” lacks a defined Event/history rule.

The missing rule must not be replaced by `attempt_id`, `attempt_reference`,
or a Claim subtype merely for convenience.

## 8. Lifecycle and Receipt consequence

Lifecycle and Receipt retain their existing roles. Lifecycle can derive
resolution only from authoritative history and must not convert uncertain
observations into false terminal outcomes. A Receipt can summarize terminal
Event(s), established Claims, and references that justify what is known; it
must not manufacture attempt identity or overclaim the evidence.

Where a profile defines attempt segmentation from Event history, Receipt and
Lifecycle need no extra universal attempt field. Where segmentation is not
defined, they can preserve history and unresolved outcomes but cannot make
an interoperable attempt-local claim.

## Exact unresolved dependency

The unresolved dependency is a **profile-level Event/history association and
attempt-boundary rule** specifying:

- which Event or Event pattern opens an operational attempt;
- how pre-Event observations later associate with authoritative history;
- how later observations and Events associate with that attempt;
- how an attempt closes without a false terminal Action outcome;
- how overlapping work, if allowed, is distinguished through explicit
  Event/history references rather than inferred order.

This is not a new primitive proposal. It is the minimum specification work
needed to determine whether Event/history reference is universally enough
for attempt-specific binding.

## Consequence for Canonical Claim Reference Semantics

Canonical Claim Reference Semantics is unblocked for Action content, Action
occurrence, and individual Event references. Its attempt/history reference
portion remains blocked on the Event/history association rule above. It must
not define a universal attempt identity while that rule is unresolved.

## Architectural result

No new primitive, lifecycle state, or architectural gap is demonstrated.
No RFC is required for this pressure test. A future normative change must
follow normal governance if it changes an Approved specification.

## Revision history

| Date | Change |
|---|---|
| 2026-08-25 | Initial non-normative pressure test. |

## Verdict

**C. INCONCLUSIVE — CURRENT EVENT/HISTORY MODEL INSUFFICIENTLY SPECIFIED**
