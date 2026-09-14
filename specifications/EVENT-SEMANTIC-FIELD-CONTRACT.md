---
id: EVENT-SEMANTIC-FIELD-CONTRACT
title: Event Semantic Field Contract
version: "0.1"
status: Draft
document_type: Candidate Specification
category: Specification
author: Verified Execution Editorial Board
created: 2026-09-14
updated: 2026-09-22
depends_on:
  - VE-000
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-005
  - VE-006
related_documents:
  - GAP-ANALYSIS-RS-RULE-001-CANONICAL-RULE-CONTENT-IDENTITY
supersedes: null
superseded_by: null
---

# Event Semantic Field Contract

**Version:** Draft v0.1

**Status:** Draft

**Identifier:** `EVENT-SEMANTIC-FIELD-CONTRACT`

## 1. Status and authority

This document is a Draft companion contract for the existing Event primitive
defined by Approved VE-002 v0.2. It is normative only for an implementation
that explicitly claims conformance to this Draft. It is not Approved authority,
does not amend VE-002, and does not make a new Event primitive.

Where this Draft conflicts with Approved VE-002, VE-002 governs and the
conflicting part of this Draft is nonconforming. This document closes a bounded
semantic profile needed before a future canonical Event representation can be
specified. It deliberately defines no CBOR map, field label, wire type, digest,
signature, content identity, or canonical Event bytes.

Any future semantic change to Approved VE-002 requires the repository's full
governance sequence: RFC, Accepted ADR, versioned VE-002 revision,
specification revision history, and repository `CHANGELOG.md` entry. This Draft
does not perform or bypass that sequence.

## 2. Scope

This contract fixes the portable meaning and ownership rules for the existing
VE-002 Event fields:

```text
event_id
action_id
event_type
occurred_at
sequence
spec_version
actor
component
payload
references
```

It also fixes the semantic treatment of absent, null, duplicate, and unknown
top-level members. The contract preserves these existing authorities:

- VE-002 owns Event occurrence identity, Action ownership, immutability,
  append-only history, and per-Action ordering;
- VE-003 owns Lifecycle projection and the lifecycle event vocabulary it
  defines;
- VE-005 owns Adapter observations and target-specific translation;
- VE-006 owns the Boundary's interpretation of observations and append of
  authoritative Events;
- VE-004 owns Receipt semantics and keeps Receipts derived from history;
- VE-001 owns Action occurrence identity and the meaning of `action_id`.

This contract closes the meaning of a semantic Event object. It does not close
the representation of that object. A later representation specification must
consume this semantic closure without changing it.

## 3. Normative language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative for conformance to this Draft when capitalized.

## 4. Minimum portable semantic object

A conforming Event semantic object has exactly one value for every required
field and zero or one value for every optional field:

```text
Event {
  event_id: required Event occurrence identifier
  action_id: required Action occurrence identifier
  event_type: required exact event-type identifier
  occurred_at: required profile-defined occurrence-time value
  sequence: required unsigned 64-bit per-Action ordinal
  spec_version: required VE-002 specification-version reference
  actor: optional profile-defined attribution value
  component: optional profile-defined component value
  payload: optional event-type-defined payload value
  references: optional event-type-defined reference collection
  extensions: zero or more top-level extension members
}
```

`extensions` is notation for otherwise unknown top-level members. It is not a
new field and MUST NOT be serialized as a member named `extensions` merely
because it appears in this abstract notation.

Every required field MUST be present. An optional field is absent unless it is
actually supplied. No field in this top-level contract has a default value.
Explicit null MUST NOT stand for absence, unknown, not applicable, or a
default for a known Event field. A present required or optional known
top-level field whose value is null is nonconforming. A payload profile may
define null inside its own payload value; that does not make the top-level
`payload` value null. An unknown extension value is opaque to a base
interpreter and is not invalidated merely because its structurally valid value
is null.

The abstract object cannot contain two members with the same field name.
Duplicate required, optional, or extension members are nonconforming and MUST
be rejected before semantic interpretation. First-value-wins, last-value-wins,
merging, or normalization is forbidden.

## 5. Field ownership and closure

| Field | Presence and cardinality | Portable semantic meaning | Equality and order relevance | Producer and interpreter | Vocabulary or value owner | Historical truth or context |
|---|---|---|---|---|---|---|
| `event_id` | Required; exactly one; non-null | Identity of one historical Event occurrence, exactly as defined by VE-002 v0.2 | Event identity is exact equality under VE-002; it implies no time or content order | Assigned by the authoritative Event producer; interpreted by history consumers | VE-002 | Historical occurrence identity |
| `action_id` | Required; exactly one; non-null | Ownership/link to exactly one Action occurrence | Exact equality under VE-001; equality with another identifier kind is never inferred | Supplied and checked by the Boundary; used to select the Action stream | VE-001 | Historical ownership/linkage |
| `event_type` | Required; exactly one; non-null | Complete authority-scoped, immutable, version-specific semantic identifier of the fact asserted by the Event | Exact complete-identifier equality; lexical order has no semantic meaning; identical local names under different authorities are unequal identifiers | Chosen by the Boundary only after the uniquely selected definition is resolved; interpreted by that definition and applicable projections | VE-003 for its lifecycle vocabulary; otherwise the immutable Event-type contract selected solely by the complete identifier | Historical assertion kind |
| `occurred_at` | Required; exactly one; non-null | The occurrence-time value required by the resolved event-type profile for the asserted fact | Equality, comparison, precision, and uncertainty are profile-defined; it MUST NOT order the Event stream by itself | Established by the Boundary from admissible evidence; interpreted only through the resolved profile | Event-type profile | Historical timing assertion, with the exact limitations declared by its profile |
| `sequence` | Required; exactly one; non-null | Unsigned 64-bit ordinal in `0..18446744073709551615`, allocated in one Action's authoritative Event stream | Unique within the Action stream; strictly orders that stream; no cross-Action meaning | Allocated only after the Boundary's protected environment establishes one unique authoritative head and append position; interpreted by history replay | This contract under VE-002 ordering | Historical stream order |
| `spec_version` | Required; exactly one; non-null | Reference to the exact VE-002 version governing base Event semantics | Exact specification/version equality; no numeric ordering or compatibility inference | Fixed by the producer; resolved by the interpreter before event-type interpretation | VE-002 version authority | Interpretive historical context fixed at append |
| `actor` | Optional; zero or one; non-null if present | Attribution asserted under the event-type profile for who or what caused the fact | Equality and any internal cardinality are profile-defined; no identity or trust inference | Asserted by the Boundary; interpreted only under the event-type profile | Event-type profile or named subordinate actor profile | Context unless the event-type profile explicitly makes attribution part of the asserted fact |
| `component` | Optional; zero or one; non-null if present | Profile-defined component associated with producing, observing, or effecting the fact | Equality and internal cardinality are profile-defined; no authority inference | Asserted by the Boundary; interpreted only under the event-type profile | Event-type profile or named subordinate component profile | Context unless the event-type profile explicitly makes it part of the asserted fact |
| `payload` | Optional in this base contract; zero or one; non-null if present | Event-type-specific facts or explanation required by the resolved definition | Type, equality, member cardinality, ordering, and constraints are event-type-defined | Constructed by the Boundary from admitted facts; interpreted only under the event-type profile | Event-type profile and any explicitly imported value profiles | Historical assertion content or context exactly as classified by the event-type profile |
| `references` | Optional in this base contract; zero or one collection; non-null if present | Traceability links admitted by the event-type profile | Member equality, duplicate policy, collection order, and cardinality are event-type-defined; never Event-stream order | Constructed by the Boundary; interpreted only under the event-type profile | Event-type profile plus the referenced object's owner | Contextual traceability; references do not create or alter history |
| unknown top-level member | Optional; zero or one for each distinct name; any structurally valid opaque value, including null | Opaque extension outside the base contract | Base Event semantics assigns no equality, ordering, projection, or truth effect | Producer may retain it; a base interpreter ignores it for semantic projection while preserving it when lossless forwarding is claimed | Explicit extension profile, if resolved | Context only to an interpreter that does not resolve the extension |

An event-type profile MAY make `actor`, `component`, `payload`, or `references`
required for that event type. It MUST NOT make any VE-002 required field
optional. It MUST state the exact abstract value domain, cardinality,
constraints, and historical/contextual role of every optional field it uses.

## 6. Event type and vocabulary ownership

`event_type` denotes a fact, not a state assignment, command, observation, UI
label, or mutable status. An event-type definition MUST specify:

1. the fact that becomes historically true;
2. the conditions under which the Execution Boundary may append it;
3. its required and permitted `actor`, `component`, `payload`, and `references`;
4. the occurrence-time semantics it uses;
5. every payload and reference vocabulary it imports;
6. whether and how VE-003 or another projection consumes it;
7. the behavior for unknown payload or extension content.

VE-003 owns the lifecycle event types and transition meanings it defines. A
domain or execution profile MAY define additional Event types. The complete
`event_type` value is the permanent semantic identifier for the asserted fact.
It MUST:

1. be authority-scoped so that unrelated authorities cannot collide merely by
   choosing the same local type name;
2. be immutable and version-specific;
3. select exactly one complete Event-type contract;
4. immutably identify every transitive subordinate semantic dependency needed
   to interpret the Event; and
5. remain historically resolvable without retargeting.

The identifier determines selection. Deployment configuration MAY provide
locally retained contract and dependency material, but it MUST NOT independently
choose, reinterpret, alias, or retarget the meaning of an `event_type`.
Resolution MAY therefore be entirely local and offline. This contract requires
neither a global Event-type registry nor a network resolver, negotiation layer,
new Event field, or new primitive.

The exact Event-type contract and every required transitive dependency MUST be
retained with sufficient immutable authority binding for historical replay. A
different definition presented under an already allocated identifier is an
attempted profile retarget and MUST be rejected as nonconforming, never treated
as an update. If an identifier cannot provide one immutable and unambiguous
semantic binding, Events using it cannot claim portable conformance.

An implementation MUST NOT infer an event type from `payload`, `actor`,
`component`, observations, a Receipt, current state, a local-name convention,
or mutable deployment configuration. The same local type name used by two
authorities denotes two distinct complete identifiers and MUST NOT create an
ambiguous shared meaning.

Unknown event types do not invalidate already recorded history merely because
an interpreter cannot project them. An interpreter that cannot resolve the
governing type MUST retain the Event when retention is in scope, MUST NOT let it
advance a Lifecycle or establish a domain fact, and MUST report the type as
unsupported rather than guess. The same result applies when the exact
Event-type contract or any required transitive dependency is unavailable during
historical replay: the Event remains retained historical data, but its unresolved
semantics MUST NOT affect Lifecycle or establish the unresolved domain fact.

## 7. Occurrence-time semantics

`occurred_at` answers only the time question defined by the resolved event
type. It is not universally any one of:

- Action creation time;
- observation arrival time;
- Adapter transmission time;
- target-system commit time;
- database insertion time;
- signature time;
- Receipt generation time.

The event-type profile MUST name which fact's time is asserted and MUST define
the abstract time domain, time scale or clock authority, precision, comparison
rules, and treatment of unavailable or uncertain time. A producer MUST NOT
substitute another available timestamp without the profile permitting that
substitution.

The value is immutable after append. It does not establish freshness, replay
admission, causal order, or total order. Those conclusions require their
existing owners. Per-Action Event order comes from `sequence`, even when two
Events have equal occurrence-time values or when their occurrence-time values
cannot be compared.

This contract introduces no universal clock, timestamp wire representation, or
global time authority. A profile that cannot close its occurrence-time domain
cannot claim portable Event conformance.

## 8. Sequence semantics

`sequence` is an unsigned 64-bit integer assigned within exactly one Action's
authoritative Event stream. Its exact semantic domain is:

```text
0..18446744073709551615
```

Its rules are:

- no two Events in the same Action stream may have the same `sequence`;
- later append order MUST have a greater `sequence` than earlier append order;
- gaps are permitted and have no implied missing-Event meaning;
- the initial value is not fixed by this contract;
- contiguity is not required;
- values in different Action streams are incomparable;
- a tie within one Action stream is a producer conformance failure and MUST NOT
  be resolved using time, `event_id`, arrival order, or storage order;
- the maximum value is valid when it is otherwise the unique next value;
- after the maximum value has been assigned, no greater value remains and the
  next authoritative append MUST fail closed;
- values MUST NOT wrap, reset, be reused, be truncated, or be silently widened;
- changing a sequence value after append is forbidden.

`sequence` orders authoritative history. It does not prove causation, wall-clock
order, target-system order, authorization order, or a globally serialized
execution. A concrete representation profile MUST canonically encode this
already-fixed range without narrowing, widening, or otherwise changing it.

Before an Event becomes authoritative, the Execution Boundary's protected
environment MUST establish one unique authoritative predecessor or head and one
unique append position in that Action's stream. Concurrent append proposals,
competing heads, or unresolved forks are not multiple authoritative histories.
Until the protected environment establishes one authoritative order, none of
the competing candidates may be treated as a conforming authoritative Event.

This contract does not define distributed consensus, leader election, locking,
atomic-storage mechanics, or another serialization algorithm. Those are
implementation or protected-environment mechanisms used to satisfy VE-002's
existing requirement for one deterministic per-Action stream.

Out-of-order transport or delivery does not change authoritative history. Once
the unique authoritative stream has been established and validated, replay
order comes from `sequence`, not delivery, arrival, storage, reference, Event
identifier, or timestamp order.

## 9. Specification-version interpretation

`spec_version` identifies the VE-002 version whose base Event rules govern the
Event. It is not an application release, Event-type version, Lifecycle version,
payload version, schema hash, or compatibility range. For this companion
contract, the governing base is VE-002 v0.2.

At this semantic layer the value is the exact pair:

```text
(specification = VE-002, version = 0.2)
```

Text such as `0.2 (VE-002)` may illustrate that pair, but this Draft allocates
no canonical text or CBOR representation for it. A future wire profile MUST
encode the pair unambiguously and MUST NOT turn a mutable implementation
version into Event authority.

An interpreter MUST resolve `spec_version` before applying Event rules. An
unknown version is unsupported, not malformed solely because it is unknown.
Compatibility MUST be established by normative authority; it MUST NOT be
inferred from numeric comparison or a shared major-version prefix.

Event-type and payload profiles have their own exact version authority. They
MUST NOT overload `spec_version` with a second meaning. The applicable
event-type definition is selected solely by the complete authority-scoped,
immutable, version-specific `event_type` identifier. Deployment configuration
may supply the exact retained resolution material; it does not select meaning.
Neither event-type authority nor version may be changed by silently changing
the VE-002 version field.

## 10. Actor and component boundaries

`actor` is an attribution value. `component` is a system-component attribution
value. Neither field by itself proves identity, authentication, authorization,
trust, causation, correctness, or legitimacy.

The event-type profile MUST define every admitted actor or component value
form. A value may be an existing profile-defined identifier, structured value,
or role label. This contract does not define a universal Actor, Component,
Identity, Principal, Agent, Service, or Registry primitive.

Absence means only that the Event does not supply that attribution under the
applicable profile. It does not mean anonymous, unknown, system actor, or the
Execution Boundary. No default is permitted. If an event type requires
attribution to establish its fact, its profile MUST require the field and state
the supporting evidence condition.

The Execution Boundary remains the authoritative Event producer even when
`actor` names a human, agent, service, policy engine, or Adapter and even when
`component` names the Adapter or target system.

## 11. Payload ownership and validation

There is no universal Event payload schema. The resolved event-type profile
owns the payload's abstract shape and meaning. It MUST define:

- whether payload is forbidden, optional, or required;
- every allowed member or variant;
- required, optional, null, absence, and default rules;
- scalar and collection domains;
- equality, ordering, duplicate, and cardinality rules;
- whether each value is part of the historical assertion or explanatory
  context;
- the evidence condition under which the Boundary may assert it;
- unknown-member and extension behavior.

A payload is not self-authenticating. A field named `verified`, `signed`,
`approved`, `committed`, `final`, or similar has no authority unless its
event-type contract gives it exact semantics and the Boundary has the required
evidence. Adapter observations may inform payload construction but remain
observations. A payload MUST NOT turn the Adapter into Event authority.

A Receipt embedded in or referenced by a payload remains a Receipt derived
from authoritative history; it cannot make the Event true. A Claim remains a
Claim and does not become an Event merely because it is included in payload.

## 12. Reference semantics

`references` provides traceability without changing history. VE-002 admits the
following semantic categories:

- a previous or related Event, identified under VE-002 Event identity;
- an external identifier, interpreted only by an explicit domain profile;
- a Receipt, interpreted under VE-004;
- a Policy artifact, interpreted by its owning authority;
- an Approval artifact, interpreted by its owning authority.

VE-002 directly names Policy, not Rule, in this reference list. A Rule
reference is permitted only when the applicable Event-type contract explicitly
allows it and defines its meaning under the appropriate Rule authority. It is
not admitted merely by treating Rule as a synonym for Policy.

This list names semantic categories, not wire union tags or new reference
primitives. An event-type profile MUST select the categories it permits and
define each member's exact existing identifier or value contract. It MUST also
define minimum and maximum cardinality, whether duplicates are allowed, and
whether member order is significant. In the absence of those rules,
`references` is not portable and MUST NOT be emitted by an implementation
claiming full event-type conformance.

Reference order never supplies the authoritative Event-stream order. A
reference does not prove the existence, authenticity, legitimacy, current
state, or content of its target merely by naming it. A reference to another
Event does not merge streams or transfer Action ownership. Cross-kind equality
is never inferred.

## 13. Extensions and unknown members

VE-002 requires unknown fields not to invalidate an Event. Therefore a base
interpreter conforming to this contract MUST accept a semantically valid Event
that contains a distinct unknown top-level member, provided the surrounding
transport can expose that member without duplicate-key ambiguity or structural
failure.

For an interpreter that does not resolve the extension:

- the member is opaque context;
- it MUST NOT change Event identity, Action ownership, Event type,
  occurrence time, sequence, Lifecycle projection, or the truth of the Event;
- it MUST NOT supply a missing required base field;
- it MUST NOT override a known field;
- it MUST NOT be interpreted by name guessing;
- its abstract semantic value SHOULD be preserved when semantic-value
  forwarding or archival is claimed.

Semantic-value preservation is not byte-for-byte preservation. Exact source
bytes, canonical re-encoding, and byte-preserving forwarding remain the
responsibility of a future representation profile.

An extension profile MAY assign meaning to an extension only when its
authority and version are explicit and historically resolvable. A governing
event-type profile MAY require a named extension; an interpreter unable to
resolve such a required extension must treat that event type as unsupported.

If later software recognizes an old extension name as a known field, it MUST
NOT retroactively reinterpret a historical Event. Historical interpretation is
governed by that Event's recorded VE-002 version and immutable Event-type
semantic authority. A name collision under later software therefore leaves the
old member governed by its original historical authority; it does not upgrade,
override, or normalize the member into the later field.

This contract does not allocate extension names, namespaces, wire labels,
registries, or canonical ordering. The future Event representation must define
how unknown members are represented and preserved while maintaining VE-002's
forward-compatibility rule.

## 14. Producer and interpreter authority

### 14.1 Producer

The Execution Boundary is the authoritative producer of Events. It MUST:

1. receive an exact Action occurrence and governing context;
2. distinguish authorization, invocation attempt, target observation,
   commitment, known failure, and uncertainty;
3. resolve the applicable Event and event-type contracts;
4. admit only sufficient evidence for the asserted fact;
5. require the protected environment to establish one unique authoritative
   predecessor/head and append position, then allocate the Event occurrence
   identity and per-Action sequence under their governing rules;
6. append the immutable Event to the authoritative Action stream.

An Adapter may report observations and external identifiers. It MUST NOT append
authoritative Events or decide historical truth. A target system remains
authoritative for the external facts it owns; the Boundary remains responsible
for whether admitted evidence supports an Event assertion.

### 14.2 Interpreter

An interpreter MUST first resolve `spec_version`, then `event_type`, then the
event-type-owned field contracts. It MUST distinguish:

- the Event assertion from current derived state;
- source authenticity from evidence sufficiency;
- historical truth from present truth;
- successful authorization from successful execution;
- attempted invocation from committed external effect;
- known failure from uncertain outcome;
- Event validity from Receipt or Claim validity.

Lifecycle projection uses VE-003 and the authoritative per-Action order. A
Receipt remains a downstream projection. A Rule or policy may consume Events
only under its own input contract. None of those consumers may edit history.

## 15. Nonconforming and unsupported input

This semantic contract distinguishes structural/semantic nonconformance from
unsupported authority without allocating a repository-wide failure-code
taxonomy.

An Event is nonconforming and MUST be rejected from authoritative append when:

- a required field is absent or null;
- a known optional top-level field is present with null;
- any top-level member is duplicated;
- `event_id` or `action_id` violates its owning identity contract;
- `sequence` is negative, duplicated within the Action, or does not increase
  with append order;
- `sequence` exceeds `18446744073709551615`, wraps, resets, reuses, truncates,
  or silently widens the fixed domain;
- no unique authoritative predecessor/head and append position have been
  established for a concurrent proposal or competing stream;
- an existing Event-type or subordinate-profile identifier is presented with
  different semantic material;
- the resolved event-type contract is violated;
- a required payload, attribution, or reference is absent;
- a forbidden field or value is supplied under the resolved event type;
- an asserted fact is not supported by evidence sufficient under the profile.

An Event is unsupported for semantic interpretation when:

- its otherwise well-formed `spec_version` is not implemented;
- its complete `event_type` identifier cannot be resolved to the exact
  immutable contract it selects;
- a required event-type, payload, time, actor, component, reference, or
  extension profile is unavailable.

Unsupported input MUST NOT be guessed, normalized into a supported type, or
used to advance Lifecycle. Historical systems MAY retain unsupported Events
for later interpretation if the containing storage/transport contract permits
retention. Malformed or semantically false producer input MUST NOT become an
authoritative Event merely because it can be stored.

When the exact Event-type contract or a required transitive dependency is
unavailable during replay, retention of the historical Event does not make its
semantics available. The Event MUST NOT affect Lifecycle or establish the
unresolved domain fact until the exact immutable material is available. A
different definition under the same identifier is nonconforming retargeting,
not a substitute for unavailable material.

## 16. Compatibility with current scenarios

This Draft preserves the conclusions of existing reference scenarios without
retrofitting complete Event wire vectors into them.

| Scenario | Compatibility result |
|---|---|
| RS-001 | The listed email lifecycle facts remain event-type assertions whose transition meanings are owned by VE-003. No payload or timestamp is invented. |
| RS-002 | The successful bank-transfer history remains a per-Action ordered stream. Approval, execution, and completion facts remain distinct. |
| RS-003 | Transport uncertainty still cannot be normalized into completion or failure. Observations remain separate from Events. |
| RS-004 | Deployment completion remains an evidence-backed historical assertion; a second deployment remains a separate Action and Event stream. |
| RS-005 | Physical observations remain Adapter evidence. Irreversible motion, known completion, known failure, and unavailable feedback remain distinct; descriptive domain event names require an explicit profile. |
| RS-LYNX-001 | The illustrative `EXECUTION_COMPLETED` Event remains a semantic sketch, not a complete Event representation vector. Its sequence is per-Action and its time/evidence fields require the selected Lynx evidence profile. |
| RS-LYNX-002 | Settlement Claim semantics do not create an Event. InstrId, UETR, PCRN, and Adapter state remain correlation/evidence outside the Claim and require explicit Event-type payload/reference ownership if later recorded. |
| RS-VERIFY-001 | Claim authorship verification remains distinct from Event truth and evidence authenticity. A valid Claim signature does not authorize an Event append. |
| RS-CEL-001 | Rule evaluation remains separate from authoritative history. A Rule result is not an Event unless an event-type profile defines the fact and the Boundary appends it. |
| RS-RULE-001 | Rule content identity remains distinct from Event occurrence identity. No Rule digest is added to Execution Right or Event by default. |

Existing scenarios that show a human-readable `spec_version`, timestamp, or
descriptive event name remain non-normative evidence. They do not allocate a
wire representation or a universal event vocabulary.

## 17. Explicit exclusions

This Draft does not define or require:

- canonical CBOR, map labels, field encodings, a digest, or Event content
  identity;
- a new Event, Actor, Component, Identity, Evidence, Reference, Receipt,
  Attempt, Commit, Correlation, Clock, or Registry primitive;
- a global Event-type, actor, component, payload, or reference registry;
- a universal clock, timestamp format, or global ordering service;
- universal actor, component, payload, evidence, or external-entity schemas;
- a generic global reference union;
- Adapter authority over history;
- timestamp or sequence proof of authorization, causation, freshness, or
  target commitment;
- Receipt authority to create historical truth;
- self-authentication by payload or reference content;
- collapse of Event and Claim;
- normalization of uncertainty into success or failure;
- Rule provenance or evaluation results in Execution Right;
- any change to Execution Right `(action_id, action_digest)`;
- any modification of VE-001 through VE-006 or their existing identities.

## 18. Security considerations

### 18.1 False authority

Actor, component, payload, and references are assertions inside an Event, not
automatic proof. Producers MUST validate the evidence and authority required
by the event-type profile before append.

### 18.2 Observation substitution

An Adapter observation MUST NOT be copied into history as if observation alone
made the asserted fact true. The Boundary must interpret it under the selected
profile. Timeout, disconnect, retry, duplicate response, and absent response
must preserve uncertainty when commitment cannot be established.

### 18.3 Ordering attacks

Duplicate or decreasing per-Action sequence values are producer failures.
Timestamp, arrival order, storage order, reference order, or `event_id` MUST
NOT repair a sequence collision. Cross-Action sequence comparisons are invalid.

### 18.4 Type and extension confusion

Unknown types and required profiles fail closed for projection. Unknown
top-level extensions cannot override core fields or silently affect Lifecycle.
Duplicate member names are rejected before interpretation.

### 18.5 Identity confusion

`event_id` identifies an Event occurrence; `action_id` identifies its owning
Action occurrence. Equality is kind-specific. Neither is a content digest,
actor identity, target transaction identity, Receipt identity, or evidence
identifier.

### 18.6 Mutable interpretation

Event-type and subordinate profiles used to interpret durable history must be
versioned and historically resolvable. Retargeting an identifier to different
semantics would silently rewrite history and is forbidden.

## 19. Pre-wire testable conformance

The following tests operate on abstract semantic objects. They do not define
CBOR or any other wire representation.

### 19.1 Positive cases

| ID | Case | Required result |
|---|---|---|
| P1 | Minimal Event with all six VE-002 required fields, resolved base/type profiles, unique increasing sequence, and sufficient evidence | accept and append |
| P2 | P1 plus profile-conforming actor, component, payload, and references | accept and append |
| P3 | P1 plus a distinct unknown top-level extension | accept base Event; extension has no core projection effect |
| P4 | Two Events for one Action with equal `occurred_at` but increasing unique sequence | accept; replay by sequence |
| P5 | Two Actions reuse the same numeric sequence values | accept; cross-Action sequences are incomparable |
| P6 | A gap between consecutive sequence values | accept; infer no missing Event solely from the gap |
| P7 | Unknown but structurally well-formed event type retained by an interpreter that cannot resolve it | retain if supported by storage; do not project |
| P8 | Two authorities use the same local type name inside two different complete authority-scoped identifiers | treat as distinct Event types; resolve each identifier only to its own immutable contract |
| P9 | Otherwise-valid next Event uses sequence `18446744073709551615` | accept at the maximum; no later append is possible in that Action stream |
| P10 | Validated authoritative Events arrive out of transport order | reconstruct authoritative order from `sequence`; do not rewrite history from delivery order |
| P11 | Old Event contains an extension name that later software recognizes as a known field | preserve the old historical interpretation under its recorded VE-002 and Event-type authorities; do not reinterpret it as the later field |

### 19.2 Rejection and unsupported cases

| ID | Case | Required result |
|---|---|---|
| N1 | Missing any required field | reject as nonconforming |
| N2 | Null required field | reject as nonconforming |
| N3 | Null known optional top-level field | reject as nonconforming |
| N4 | Duplicate known or extension member | reject before interpretation |
| N5 | Invalid `event_id` or `action_id` under its owner | reject as nonconforming |
| N6 | Negative sequence | reject as nonconforming |
| N7 | Duplicate sequence in one Action stream | reject; do not tie-break |
| N8 | Decreasing sequence at append | reject; do not reorder by time |
| N9 | Unknown well-formed VE-002 version | unsupported; do not infer compatibility |
| N10 | Unknown complete authority-scoped event-type identifier | unsupported for interpretation; do not project |
| N11 | Missing required event-type payload or attribution | reject as nonconforming |
| N12 | Payload or reference violates the event-type profile | reject as nonconforming |
| N13 | Required subordinate profile unavailable | unsupported; do not guess |
| N14 | Unknown extension attempts to override a known field or Lifecycle result | ignore its attempted semantic effect; reject if it duplicates a known member |
| N15 | Adapter observation offered as an Event without Boundary interpretation | reject authoritative append |
| N16 | Timeout or missing response normalized to completed or failed without sufficient evidence | reject the false assertion |
| N17 | Receipt or signed payload offered as self-sufficient truth contrary to its profile | reject the unsupported assertion |
| N18 | Cross-Action sequence comparison used to establish order | reject the interpretation |
| N19 | Existing complete Event-type identifier is presented with different contract material | reject as profile retargeting; never treat as an update |
| N20 | Exact historical Event-type contract is unavailable during replay | retain historical data; unsupported for interpretation; do not project or establish the unresolved fact |
| N21 | Required transitive semantic dependency is unavailable | retain historical data; unsupported for interpretation; do not partially interpret or project |
| N22 | Append is attempted after sequence `18446744073709551615` | fail closed; do not wrap, reset, reuse, truncate, or widen |
| N23 | Concurrent candidates, competing heads, or an unresolved fork lack one unique authoritative predecessor and append position | do not treat any candidate as a conforming authoritative Event until the protected environment establishes one order |
| N24 | Reference target is nonexistent, mutable, unauthenticated, or belongs to another Action | do not infer existence, immutability, authenticity, or transferred ownership; accept or reject only under the exact Event-type reference contract |

### 19.3 Independent-meaning review

Two teams receive the same VE-002 version, event-type profile, subordinate
profiles, Action occurrence, evidence, and prior authoritative stream. They
MUST independently agree on:

- which fields are required;
- whether null, absence, duplicates, and unknown members are admissible;
- which immutable Event-type contract and transitive dependencies the complete
  `event_type` identifier selects;
- the fact asserted by `event_type`;
- the occurrence-time meaning and comparison rules;
- the next admissible per-Action sequence relation;
- the meaning and cardinality of actor, component, payload, and references;
- whether input is conforming, unsupported, or forbidden from append;
- whether one unique authoritative head and append position exist;
- maximum-sequence and exhaustion behavior;
- whether the Event can affect Lifecycle projection.

If they cannot agree, the applicable event-type or subordinate profile is not
closed enough for portable use. The remedy is to close that profile, not to
invent implementation-local meaning or freeze accidental wire choices.

## 20. Architectural Decision Tests

| Test | Result |
|---|---|
| Founding Principles consistency | **PASS.** The contract preserves authoritative history, clear ownership, inspectability, and separation of proposal, authorization, observation, execution, and evidence. |
| Primitive burden | **PASS.** It closes fields on the existing Event primitive and introduces no new primitive, selector field, registry, identity, clock, consensus mechanism, or reference object. |
| Removability | **PASS.** The complete Event-type semantic binding and bounded stream rules are required for portable interpretation; profile-specific actor, component, payload, reference, and time details remain removable when an event type does not require them. |
| Twenty-year durability | **PASS.** Complete Event-type identifiers permanently select immutable contracts and transitive dependencies; exact material is retained for offline replay and mutable deployment guesses cannot rewrite history. |
| Independent implementability | **PASS.** Required fields, identifier-selected profile resolution, fixed sequence range/exhaustion, unique-head precondition, null/absence/default rules, profile duties, authority, and failure behavior are explicit before encoding. |
| Reduced conceptual complexity | **PASS.** One complete `event_type` identifier selects meaning without a second field, registry, negotiation layer, or deployment selector, while varying domain semantics remain in explicit immutable profiles. |

**Architectural Decision Tests: 6/6 PASS.**

No new architectural decision is introduced. RFC required for this Draft:
**NO**. ADR required for this Draft: **NO**. Approval or any change to Approved
VE-002 remains subject to repository governance.

## 21. Next falsification scenario

The single next Reference Scenario should be:

> **RS-EVENT-001 — Deterministic Event Semantics Across Success, Known Failure,
> and Uncertain Outcome**

The scenario should use one existing Action domain and one explicit event-type
profile to construct a per-Action history that includes:

- a normal pre-execution sequence;
- one evidence-backed successful terminal branch;
- one separately replayed known-failure branch;
- one separately replayed uncertain-observation branch with no false terminal
  Event;
- equal occurrence-time values with distinct sequence values;
- a permitted sequence gap;
- actor/component attribution that grants no authority;
- one profile-conforming payload and reference collection;
- one unknown extension with no projection effect;
- two authorities reusing one local type name under distinct complete
  identifiers;
- attempted Event-type retargeting;
- unavailable historical Event-type material and an unavailable transitive
  dependency;
- maximum sequence acceptance and sequence-exhaustion rejection;
- concurrent candidates without a unique authoritative head;
- out-of-order transport delivery;
- later-software collision with an old unknown extension name;
- nonexistent, mutable, unauthenticated, and cross-Action reference cases; and
- unknown type/profile, duplicate member, sequence tie, false commitment, and
  Adapter-authority rejection cases.

Two independent implementations should receive the same abstract inputs and
agree on append admissibility, historical order, Lifecycle projection, and
unsupported behavior. Any consequential divergence would falsify this Draft's
claim that the bounded semantic field contract is closed.

## 22. Conclusion

This Draft closes the bounded semantic ownership required before portable Event
representation work:

```text
Approved VE-002 Event primitive
  -> bounded Event semantic-field contract
  -> RS-EVENT-001 adversarial evidence
  -> Gap Analysis
  -> canonical Event representation only if semantics remain closed
```

Event occurrence identity, Action ownership, immutability, append-only history,
per-Action ordering, state derivation, and authority boundaries remain
unchanged. Variable domain meaning is owned by explicit historically
resolvable event-type and subordinate profiles. No canonical wire format or new
primitive is created.

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-22 | Bound each complete `event_type` identifier permanently to one immutable version-specific contract and its transitive dependencies; fixed the unsigned 64-bit sequence domain, exhaustion, unique-head, concurrency, replay, extension-collision, and reference boundaries following independent review. |
| 0.1 | 2026-09-14 | Initial Draft companion semantic-field contract for Approved VE-002 v0.2; closes field ownership, profile duties, time/sequence semantics, extension behavior, authority, and pre-wire conformance while deferring canonical representation. |
