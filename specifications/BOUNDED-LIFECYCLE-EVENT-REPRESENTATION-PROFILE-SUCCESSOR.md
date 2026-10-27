---
id: BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE-SUCCESSOR
title: Successor Bounded Lifecycle Event Representation Profile
version: "0.2-draft.1"
status: Draft
document_type: Candidate Specification
category: Representation
author: Verified Execution
created: 2026-10-26
updated: 2026-10-26
depends_on:
  - BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE-SUCCESSOR
  - EVENT-SEMANTIC-FIELD-CONTRACT
  - ADR-ENC-001
  - VE-001
  - VE-002
  - VE-003
  - VE-004
  - VE-006
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE-SUCCESSOR
  - LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA-SUCCESSOR
  - LYNX-UG2026-ACTION-OWNER-SOURCE-ANNEX
related_documents:
  - BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE
  - RS-EVENT-002
  - SPECIFICATION-GOVERNANCE
supersedes: null
superseded_by: null
---

# Successor Bounded Lifecycle Event Representation Profile

**DRAFT PROPOSAL — NOT REVIEW/APPROVED OR INTEROPERABILITY-CLEARED.**

R-NEXT is a preparation handle. The document ID/version and representation
selector below identify this Draft proposal, not permanent allocations or
Approved authority. A bounded Draft target needs a separately authorized exact
first-publication and agreeing-context selection.
This full draft derives from the exact historical representation publication
at `bc080e6037bdd3129d5132d90d9253ed85f59c1b`. It changes the explicit
successor binding, material/carriage reporting and disjoint history-domain
rules, not the old selector or historical artifacts. Its own publication
SourceKey and agreeing context belong in a separate external selection record,
never its own resulting body; without that record they remain unbound.
No canonical bytes, semantic digests, tests, reviewer results or conformance
are asserted.

## 1. Authority and applicability

This is the full companion proposal to the P-NEXT semantic Draft.
Capitalized requirement keywords have the BCP 14 meanings of exact
SRM-L1/RFC 2119 and SRM-L2/RFC 8174 bodies selected in A-ANNEX; imported sources
retain their own conventions. Requirements constrain explicit use of an
eventually selected Draft, not Approved VE-001/VE-002 or Accepted ADR-ENC-001.

**Inherited constraints:** the seven facts, established-input boundary, field
domains, exact equality, interval time, explanation, uncertainty, sequence and
projection rules of P; Action-owned meaning/encoding; native Event occurrence
representation; and VE-CBOR-1 restrictions. **Proposed changes:** separate
selector/publication and successor selections, explicit material roles,
disjoint bounded/foreign variants and separate carriage/interpretation claims.
Retained O/T/Z/L/M constructions and closed record mappings remain defined
below, not inferred from an experiment or runtime.

The only supported Action family is the exact bounded Lynx successor pair
in §2.2, over all its admitted values, not just a scenario payment.
Another owner is unsupported by this bounded representation, not invalid under
VE-001 generally. Extending the owner domain needs a separately versioned,
reviewed representation closure.

There is no Event digest, signature, new primitive, universal trust/clock
service, registry, Policy evaluator, Receipt encoding or positive generalized
foreign interpreter. Serialization never authenticates an Event or append.
Historical experiment counts and old review records are not successor evidence.
The semantic and representation documents remain proposed Drafts.

## 2. Identity, allocation and immutable closure

### 2.1 Provisional local selector

The exact representation selector is the following closed CBOR map. Quoted keys
and constants in this document are literal ASCII CBOR text strings unless a
mapping is explicitly specified; notation is not JSON input syntax.

```text
{
  "authority": "https://github.com/cpbrands/VerifiedExecution",
  "profile": "BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE",
  "revision": "0.2-draft.1"
}
```

This is a **proposed, non-final, profile-local selector**, not a numeric
allocation. The continued authority/profile namespace and new revision need
owner acceptance before use; the distinct document ID above names this
successor source, not a second wire profile field. No repository reservation or
collision audit for these new document proposals is claimed. Existing PSCID,
Rule/Claim/Execution-Right names, tags and allocations are not reused.
No VE-xxx, global code, media type, CBOR tag or permanent selector is allocated.

Explicit governing context MUST select both this selector and the exact first
published document bytes. The selector alone is insufficient. The package
carries that publication's SourceKey (§2.3), which MUST equal the independently
selected SourceKey and verify against retained bytes. No negotiation, fallback,
latest-branch selection or inference from payload is allowed. Any later
byte-affecting or semantic change needs a new representation revision and
publication; the historical `0.1-draft.1` and any adopted successor selector
MUST NOT be retargeted. Proposed `0.2-draft.1` binds this reviewed successor,
not a new spelling for the original. Editorial document version
alone cannot authorize retargeting. A later approval needs normal governance;
this Draft does not promise stable compatibility or permanent assignment.

### 2.2 Governing sources

P means the exact independently selected publication of the companion
[successor semantic draft](BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE-SUCCESSOR.md), with proposed
Type revision `0.3-draft.1`. Before support, the authorized governing context
MUST establish its complete immutable SourceKey and actual first-defining
publication; the filename/revision is not a selected key. No guessed P key is
invented here. P has no import of this R publication.

The fixed core snapshot and twelve exact key records are reproduced in P §2.1
at `56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f`, with original section extents.
Required fixed imports recurse under their owners. That snapshot is not
globally advanced to a successor commit, nor does matching metadata prove
closure. Fixed VE-001/VE-002 remain Approved, ADR-ENC-001 and occurrence
decisions retain their Accepted scope, other imports keep their declared maturity.

The three candidate Action roots are observed at
`40cdd56163755c9b060f0a2c04409de78bfaa651` of
`https://github.com/cpbrands/VerifiedExecution`:

| Exact path | Observed Git blob | Previously measured file SHA-256 |
|---|---|---|
| `specifications/VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE-SUCCESSOR.md` | `89d9597f85b8a70ae7a19e3e649a0d71e0478bad` | `d171b3e9bb56a3b2aaa2a9709d31ea129aedd38a5966b6168a42a03c6704ea10` |
| `specifications/LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA-SUCCESSOR.md` | `52cbae89a28de8acee0a5a2c8c75afd159894ff9` | `e0845a030444a3a2133b20f2615afa952fa5408519256433a39f265c323bafdc` |
| `specifications/LYNX-UG2026-ACTION-OWNER-SOURCE-ANNEX.md` | `5183740b9e761b404a8380252f3fc1fbd206d4f2` | `c241e19a918e6c2b97e936a564cfdc2e91379d22e3f2baee4bfa8dc32666ec55` |

These values reuse the completed DPU-1 publication readbacks/measurements;
no new measurement is performed. They identify candidate bodies, not an
authorized agreeing context or independent publisher authentication. Before
support, the legitimate Action owners and governing context MUST independently
select agreeing exact A-ANNEX/A-CANON/A-SCHEMA bindings for these bodies.
The schema's canonical/annex selections and context MUST agree. Preserve the
annex → canonical → schema → external-context arrangement without self-pin or
future-peer cycles. A matching filename or package does not select its own rules.

A-ANNEX contains the sixteen already Founder-selected Action interpretation
keys and scoped responsibilities. Their precise external authority, edition,
document and body-fingerprint strings are retained. For R's own scalar-to-octet
mapping, E02's numeric RFC 3629 §3 rule and C-N3's scalar/encoding definitions
must agree for every Unicode scalar value, including those unassigned in 6.2.
This direct T responsibility neither imports 6.2 assignment/NFC into T nor
globally reinterprets fixed ADR-ENC-001. An uncovered conflict blocks support.
Native Action text separately uses the selected schema's exact repertoire/NFC
contract. No newer library database selects either responsibility.

E01 supplies the selected CBOR definitions; SRM-L1/SRM-L2 supply this source's
requirement-language role.

For this representation's source-material verification only, C-H1 is the
same whole exact FIPS PUB 180-4, August 2015 body selected in A-ANNEX.
SHA-256 uses its §§2–3, 4.1.2, 4.2.2, 5.1.1, 5.2.1, 5.3.3 and 6.2.
The SHA-1 role used solely for the existing 20-octet Git blob identifier
uses §§2–3, 4.1.1, 4.2.1, 5.1.1, 5.2.1, 5.3.1 and 6.1.
Equivalent computation strategies must implement the selected mathematical
function; no host extension or algorithm-name default replaces it.
This is no SHA-1 Action/Event digest selection, global suite allocation,
cryptographic security-strength certification or publisher authentication.
Other FIPS algorithms, validation procedures and security-strength references
are not additional computation inputs to these two expressly selected roles.

Let B be the exact raw publication body and n its number of octets. The
SourceKey/EditionKey sha256 is SHA-256(B), without text decoding, line-ending
conversion, BOM stripping, Unicode normalization or a transport wrapper.
For a repository SourceKey, the Git blob preimage is exactly:

    ASCII("blob ") || ASCII(decimal(n)) || one zero octet || B

decimal(n) is the shortest base-ten nonnegative integer spelling using only
ASCII digits, with no sign, separators or leading zero except the sole digit
0 for n=0. The selected blob value is the 20 raw output octets of SHA-1 of
that complete preimage, not SHA-1(B). This paragraph completely restates the
blob preimage for this verifier responsibility; it does not import a generic
Git transport, commit parser, trust policy or another Action field.

Every such actual input must be in its selected function's domain.
For these octet-aligned roles, require:

    0 <= n < 2^61
    n + digits10(n) + 6 < 2^61       (repository blob check only)

digits10(0)=1. The second inequality includes the complete blob prefix; checking
only n is insufficient near the boundary. The responsible source/context
selector MUST establish each expected publication's actual length and domain
argument before claiming verified source support. No truncation, length wrap,
chunk-hash substitution or unselected hash extension is permitted.

An out-of-domain obligation blocks that source-verification/support claim,
not intrinsic O carriage and not a new semantic admission result.
Resource-limited unfinished hashing is processing incomplete, not a proved
domain failure. Unknown expected keys, unavailable selected bodies, known
mismatch and unfinished computation remain distinct. An unavailable body is
not verified, and a length check alone establishes neither body identity nor
authenticity. No hash is defined over all packages or all finite O values.

Matching body/blob digests do not establish commit/path binding, owner adoption,
publisher identity or execution authority. Retained Git history or an
independently established immutable commit/path manifest MUST separately
establish the selected repository/commit/path/blob/body association. Such a
manifest must be accepted under the legitimate source/context authority,
independently of the untrusted package; no new universal manifest wire schema
or service is introduced. Choosing the retained-history route carries its
own exact verification obligations and is not certified by this paragraph.
The planned bounded review may use the manifest route once actually
established; this draft does not assert that any current observation is already
that trusted manifest. Source-verifier implementation correctness and
authentication remain unproved.

The direct Action selections do not replace fixed core imports. If an operative
fixed dependency demands an incompatible historical source, stop for explicit
owner/governance resolution rather than choosing import order.
Old S06/S11 and old P/R remain historical owners of their own contracts,
not aliases for these candidates.

The existing RS-EVENT-002 scenario, gap analyses and implementation reports
are informative pressure/evidence history only. No historical Action/schema
digest, fixture slot, case count or old oracle is inherited as a successor value.
The shared local ledger records proposed role assignments and open claims,
not an extra normative definition source or complete serialized Materials set.

### 2.3 Exact material carriage, not trust or object identity

The following records are local packaging structures only. `T`, `O`, `L` and
`M` are defined in §3. Every listed key is required; there are no extra keys.

| Record | Exact members and types |
|---|---|
| SourceKey | `"repository"`: constant `"https://github.com/cpbrands/VerifiedExecution"`; `"commit"`: bstr(20) raw Git commit ID; `"path"`: T; `"blob"`: bstr(20) raw Git blob ID; `"sha256"`: bstr(32) of exact file bytes |
| SourceMaterial | `"key"`: SourceKey; `"body"`: M(O) |
| EditionKey | `"authority"`: T; `"edition"`: T; `"document"`: T; `"sha256"`: bstr(32) of exact external bytes |
| EditionMaterial | `"key"`: EditionKey; `"body"`: M(O) |
| Materials | `"repository"`: set of SourceMaterial; `"external"`: set of EditionMaterial |

`M(O)=[]` means required material is unavailable, not empty material;
`[O(empty)]` is present empty bytes and must still match its pin. Paths are
exact repository-relative names, not traversal paths or instructions to fetch.
Git blob verification uses the actual Git blob framing in addition to file
SHA-256. The commit/path binding MUST be verified from retained Git history or
an independently established immutable commit/path manifest; merely receiving
matching blob and SHA-256 values from a sender does not establish the binding.
No fallback to a current working tree is permitted.

For fixed repository dependencies the expected keys derive from the selected
commits/paths, never from the package. Package Materials contains exactly the
selected P, this R publication, the agreed Action roots and all operative
recursive definition/governance imports required for this package scope.
SRM-L1/SRM-L2 are required for this source's language convention. S08 is
included through the explicit normative dependencies of S03/S07.
S08's declared Authority and §§5,7 make the fixed Founding Principles source
S17 an operative package-governance constraint in this selected closure.
Its whole exact body is therefore required package SourceMaterial, with the
existing expected fixed-snapshot key:

- repository: `https://github.com/cpbrands/VerifiedExecution`
- commit: `56cdbbb34c10b603ce349b9b6ca0f6a48c2cc22f`
- path: `FOUNDING_PRINCIPLES.md`
- blob: `dc52b0e91c96ec55ffc19a38c7670cef7796d9a6`
- file SHA-256: `49b286a2c2dd3f2f16d593c23c6351bf956e59e2e69c995920118cb4f5133cbc`

The retained original manifest records 6482 octets for that body. The values
are carried forward, not newly measured or independently authenticated.
S17 does not become an Action semantic member or a mandatory copy inside every
ActionInline/OwnedOctets closure solely through this package-governance edge.
Those positions still follow their own operative owners. S18's allocation/
authority index and S19's metadata rules apply when their repository,
allocation or publication-conformance claims are made; they are not additional
Event/Action byte functions and do not enter every definition set by title.
Their exclusion from this direct definition role does not waive applicable
governance or publication duties, nor allow stale index prose to override a
selected source's actual authority. Any other operative edge must still be
followed. Including S08 and S17 does not certify full recursive closure.

E03 is required wherever the selected Lynx interpretation edge applies; its
exact pinned PDF is definition material, not a descriptor member or proof of
settlement.

Each edge MUST identify the referring source/section, required responsibility,
selection authority, exact target and closure role. Follow operative references,
not every bibliography item. Explicit normative metadata dependencies may not
be silently dropped, and an empty list cannot erase normative prose.
Informative navigation, provenance and tests do not become definition inputs
merely by appearing in a packet. Exclusion from definition carriage does not
waive a separately applicable test or authority obligation.

Package Materials, ActionInline.definitions and every OwnedOctets.definitions
are separate exact closures. Include an Action source in an owned proof only
if that proof owner's operative contract requires it. The package inherits
necessary Action definition imports, but the Action does not automatically
inherit every Event/core source. Reuse the same selected key where appropriate.
Within each Materials value, duplicate keys and conflicting bodies or
alternative pins for one selected source are rejected. Repeated references in
the graph visit a selected key once; a logical cycle does not solve a self-pin
or future-publication hash cycle. Conflict is never resolved by import order.

Unknown expected keys are selection gaps, not unavailable-body markers.
Only after a complete required key set is established can its known missing
bodies be carried as unavailable M(O) values. Such markers preserve diagnostics;
they do not close unknown graph edges or certify successful interpretation.
No unresolved required key permits a complete closure claim. Exact external
authority/edition/document strings retain the responsible owner's selections;
a sender cannot choose an equally named body, current edition or host database.

**Carriage versus interpretation.** Missing required inline material prevents
the original envelope from claiming complete self-contained carriage. A
consumer MUST NOT silently hydrate from a cache, another carrier position or a
locator and then describe that material as originally carried. A separately
disclosed interpretation MAY use independently retained exact assets, with
their provenance and additional-input status recorded outside the unchanged
received package. The semantic decision still depends on actual selected
contracts, A/H/C/S and independently established results, not solely on which
carrier position had an unavailable marker. Missing actual required knowledge
or establishment still blocks the affected claim. This is no new wire mode,
field, default or alternative canonical encoding.

Adding material later changes the package availability/input snapshot and
requires a separately identified derivation; preserve the original bytes and
outcome. A known conflicting present body remains a defect even if another
copy is unavailable. Across repeated positions, all present copies of one key
MUST agree. Present-plus-unavailable is not by itself two conflicting bodies;
each original position retains its own carriage status. No duplicated semantic
Action/context/assessment copy is authenticated by these material checks.

These hashes identify source bytes for provenance, not Event, Policy or
semantic-fragment identity. They confer no approval, authentication or execution
authority. This document does not embed its own resulting commit/hash: governing
context supplies that immutable publication pin after publication. The document
does not hash a package that contains itself, and Event identity remains the
existing occurrence ID. There is no circular Event/profile content-identity rule.
Offline exact material is sufficient; live network access is not required.

## 3. Proposed reversible scalar and collection mappings

### 3.1 VE-CBOR-1 carrier discipline

Each package is exactly one complete VE-CBOR-1 item, with no prefix, suffix or
trailing item. Definite lengths, shortest arguments, bytewise lexicographic
ordering of encoded text map keys and duplicate-key rejection are mandatory.
All actual CBOR text items remain valid UTF-8/NFC; schema keys/enums here are
ASCII. Floating point, tags, indefinite items and undefined/simple values other
than Boolean/null where explicitly allowed are forbidden. Parsers MUST detect
duplicate keys before a host map can discard them. Noncanonical input MUST be
rejected, not normalized and accepted as if its original bytes were canonical.

The functions below are local encoding notation, not new VE types or fields.
Every value is finite and acyclic. No host word size, string size or fixed
numeric precision defines semantic admission. The small fixed carrier chunks
avoid even the direct CBOR length/integer ceilings becoming domain restrictions.

### 3.2 O: arbitrary finite octets; T: exact Text

`O(b)` is a CBOR bstr containing b if its length is at most 4096 octets.
Otherwise it is the two-element array `[bstr(first 4096 octets), O(remainder)]`.
In the latter form the remainder is nonempty. A decoder MUST reject another
chunk size, empty remainder, array for a total length at most 4096, or any
other structure. Chunking is by octets; a UTF-8 sequence may straddle chunks.
Concatenation, followed by validation, recovers the original finite octets.
This permits arbitrary finite length without an unbounded CBOR length argument;
4096 is a carrier partition size, not a semantic maximum.

`T(s) = O(UTF8(s))`. Validate shortest scalar-value UTF-8 after concatenation:
reject overlong encodings, surrogates, out-of-range scalars and incomplete
sequences. Do not normalize, fold, trim, strip a BOM code point or alter line
endings. For P's Text fields s is nonempty; an empty value is invalid there.
For explicitly unconstrained opaque-extension text (§8), empty is allowed.

Semantic `U+00E9` and `U+0065 U+0301` encode differently and recover unchanged.
Their UTF-8 bytes are inside bstr, **not** non-NFC CBOR tstr. This therefore
does not relax ADR-ENC-001 rule 7. Action-owned text is an exception to T:
it remains in the Action owner's canonical item and keeps that owner's NFC,
repertoire and length restrictions. No Event text rule retargets Action bytes.

### 3.3 Z: arbitrary mathematical integers

`Z(n) = [negative, O(magnitude)]`, where `negative` is a Boolean, and magnitude
is the shortest unsigned big-endian base-256 expansion of `abs(n)`. Zero has
`negative=false` and empty magnitude; nonzero magnitude has no leading zero.
Negative zero, leading-zero magnitudes, integer/text substitutes and any extra
member are noncanonical and rejected. Both signs and every finite mathematical
integer are representable, including values outside `[-2^64, 2^64-1]`.
All uses of Z use this form, even small numbers; there is no alternative small
integer shortcut. `Nat` means Z restricted to nonnegative values, `Pos` to
positive values. The sign is part of the exact mapping, not permission to use
negative years, denominators, condition indices or sequence.

`U64` instead means the owner's native shortest CBOR unsigned integer from
0 through `18446744073709551615`; only fields explicitly marked U64 use it.
Small fixed calendar components use native unsigned integers at their listed
ranges. Booleans never coerce to integers. Native Action integers remain under
the Action schema. No floating-point conversion is permitted at any stage.

### 3.4 L, sets, records and M

`L([])=[]`; `L([x,...tail])=[R(x),L(tail)]`, with exactly zero or two elements
at each node. R is the mapping assigned to that position. Thus every finite
ordered list is represented without a direct array-length ceiling; no flat
array abbreviation is permitted. Order and multiplicity are preserved.

A semantic set uses L of its members sorted by unsigned bytewise lexicographic
comparison of their **complete canonical encodings**; a proper prefix sorts
first. Input enumeration duplicates collapse only when the semantic owner
defines set equality, before encoding. Encoded duplicate members or non-strict
order are noncanonical and rejected. Distinct assessments with differing
basis/result/binding MUST NOT collapse. Record member order is non-semantic;
fixed records use the exact named text keys below, sorted under VE-CBOR-1.

`M(X)` is `[]` for the absence/unavailability explicitly assigned by its field,
or the one-element array `[R(X)]` for presence. It is not null and does not
introduce an optional member in a semantic record. The containing field fixes
whether absence means unavailable material, no predecessor or no selection;
these meanings cannot be interchanged. A zero/null payload is not an absent one.

## 4. Package and seven Event forms

The canonical package is a closed map with exactly these keys:

| Key | Value |
|---|---|
| `"profile"` | Exact selector map in §2.1 |
| `"publication"` | SourceKey for the independently selected exact representation publication |
| `"materials"` | Materials for §2.3 closure |
| `"event"` | Event below |
| `"decision_inputs"` | M(DecisionInputs) from §7; empty for Event-only carriage |

The envelope keys are representation packaging, not extra Event fields or
evidence. Event-only carriage makes no claim of fresh admission or re-verification.
For identical Event, dependency/material availability and optional input
snapshot, the package has one canonical encoding. Different verification
snapshots are different packages, not different historical Events. No hash or
identity is defined over either package or its bytes.

Event is a closed carrier map. Its `"extensions"` grouping reconstructs
unknown semantic top-level members; it is not a new semantic Event member.
`EventId` below abbreviates the native VE-002 bstr(32), never an O wrapper.
`Type` abbreviates the exact four-key map assigned to event_type below.

| Key | Exact representation / semantic owner |
|---|---|
| `"event_id"` | One native bstr(32), exactly VE-002's `h'58 20'` header plus payload; no O wrapper, tag, text or cross-kind comparison |
| `"action_id"` | One native bstr(32), the selected Action owner's occurrence identifier; equal to payload.action.value.instance.action_id |
| `"event_type"` | `{"authority":T, "profile":T, "revision":T, "kind":T}` containing the full exact P §3 L(K) value |
| `"occurred_at"` | Interval in §5; required, never null/unavailable |
| `"sequence"` | U64; authoritative order is inherited, not chosen by timestamps or encoding order |
| `"spec_version"` | Two-element array `["VE-002","0.2"]`, the exact specification/version pair, not this representation's revision |
| `"payload"` | `{"action":ActionInline, "context":Context, "assessments":Set(Assessment)}` |
| `"extensions"` | L of extension entries from §8; empty when there are no unknown semantic members |

The first seven Event keys are required and non-null for **each** of the seven
kinds. No other carrier map key is allowed. Semantic `actor`, `component` and
`references` are forbidden, even empty/null; an extension cannot disguise them.
For these bounded Types, decode the T components to exactly authority
`https://github.com/cpbrands/VerifiedExecution`, profile
`BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE`, proposed revision
`0.3-draft.1`, and
one K below. These are not the representation selector's profile/revision.
Comparison is exact; no URI, case or Unicode normalization is allowed.

| Exact K (authority/profile/revision remain the full P §3 values) | Prior state | Next state | Type-specific inherited requirement |
|---|---|---|---|
| `ACTION_CREATED` | none | CREATED | Actual authoritative Action admission; Boundary fact |
| `VALIDATION_STARTED` | CREATED | VALIDATING | Actual commencement, not queueing; Boundary fact |
| `VALIDATION_SUCCEEDED` | VALIDATING | READY | Validation fact and satisfied results for every validation condition |
| `AUTHORIZATION_GRANTED` | READY | AUTHORIZED | Boundary fact and satisfied identity/delegation/Policy/approval conditions |
| `EXECUTION_STARTED` | AUTHORIZED | EXECUTING | Material invocation, not preparation; execution fact |
| `EXECUTION_COMPLETED` | EXECUTING | COMPLETED | Established successful resolution; committed result if required by exact Action/context |
| `EXECUTION_FAILED` | EXECUTING | FAILED | Established known failure after execution began, not silence/timeout |

Every row still requires exact fact-bound time, all common P checks and an
independently established head/append position. All other transitions and
post-terminal transitions remain prohibited. Optional negative conditions do
not become required conditions; contradictory definite results still reject.
P, not this table's summary, owns admission and failure precedence.

## 5. Exact time and typed unknowns

Endpoint is an eight-element array in this exact order:

```text
[Pos(year), month, day, hour, minute, second, Nat(numerator), Pos(denominator)]
```

Month is 1..12; day obeys P's proleptic Gregorian calendar; hour 0..23;
minute/second 0..59. Year has no maximum. Numerator is less than denominator;
gcd is one; zero is exactly `0/1`. Sign/range/gcd violations are invalid, not
instructions to reduce, round or repair received values. Integer components
and the unit “fraction of the named ordinary civil second” are explicit under
ADR-ENC-001 rule 9; no CBOR rational tag, float, decimal exponent or epoch
conversion is used. The denominator supplies an exact variable scale.

Interval is `{"earliest":Endpoint,"latest":Endpoint}` with earliest <= latest.
Compare calendar components then rational components by exact cross products;
both interval endpoints participate in equality. Equal endpoints represent a
point. Unequal touching/overlapping intervals remain unequal and have P's
incomparability for fact ordering; do not intersect or average corroboration.
Negative fractions, denominator zero, nonreduced values, reversed bounds and
leap endpoint label 60 are rejected. No new century/precision restriction exists.

For time assessments only, result is either `["bound",Interval]` or
`["unknown"]`. Unknown is an authentic source's uncertain result if separately
established. Missing assessment, unavailable verification/material, and invalid
interval are different states (§7, §9). They never become an Event occurrence
time value. An established interval need not be a point. Time never replaces
authoritative sequence, proves freshness or establishes a source's authority.

## 6. Inline Action, context, assessments and explanation

### 6.1 Action-owned values and complete material

ActionInline is exactly `{"value":A, "schema":M(S), "definitions":Materials}`.
A is the unmodified native canonical Action map from selected A-CANON §9;
S is the exact complete native CanonicalSchemaDescriptor from A-SCHEMA §7.
The descriptor-local version is 2, with the sole logical literal and its
explicit native mapping unchanged. This wrapper is interpretation material,
not new semantic/instance fields. `schema=[]` reports its original missing
inline descriptor and prevents complete self-contained carriage there.
A separately disclosed interpretation using independently established exact S
has the distinct claim boundary in §2.3; the marker alone cannot change P's
decision for otherwise identical actual inputs and establishment.

A contains exactly `"action_digest"`:bstr(32), `"instance"`:
`{"action_id":bstr(32)}`, and `"semantic"`:
`{"fields":F,"schema_digest":bstr(32)}`. F contains exactly:

| F member | Existing owner rule / native encoding |
|---|---|
| `"amount_minor"` | CBOR unsigned integer 1..99999999999999; CAD cents fixed by schema |
| `"source_account"` | Account map below |
| `"destination_account"` | Account map below |
| Each Account's `"servicing_agent_canadian_sort_code"` | Native tstr matching `0[0-9]{8}`; preserve leading zero |
| Each Account's `"account_id"` | Native tstr, 1..34 scalar/code-point values, XML Fifth Edition Char intersected with exact Unicode 6.2 General_Category != Cn and the selected 6.2 NFC predicate; no rewriting or additional private-use ban |

S is the exact fixed descriptor specified by its owner, not a reconstructed
summary or arbitrary schema language. Independently check schema_digest and
action_digest using the selected successor owner's exact VE-CBOR-1/SHA-256 frames and
in-domain obligations, and all schema admission rules. No equality to historical
schema/Action digest outputs is asserted. Neither Event encoding nor a claimed verified result
bypasses these checks. The occurrence/content **cryptographic authority binding**
remains an independent VE-001 obligation beyond digest recomputation.

Definitions has exactly the selected Action owner/schema recursive key set,
including necessary external material under §2.3. Complete self-contained
carriage requires each required body and S at this position. Compare all
present duplicate bodies/pins with their independently selected expectations
and other present copies; mismatches reject. Missing actual required
interpretation material is unsupported, never guessed semantics or a null
Action. Independently retained material is handled only as the disclosed
additional input in §2.3, not a repair of these received definitions.
Neither a digest/name/locator nor a prior experiment's slots replaces S,
native Action values or the original position's material requirements.
This Action profile has no additional authoritative occurrence fields:
`bound_instance_fields` in Binding is exactly the empty native map `{}`.
Additional instance fields are unsupported owner scope, not silently dropped.

### 6.2 Context and Binding key assignments

All records below are closed and all listed members required. P's semantic
Text uses T; only listed enums use native ASCII tstr.

| Record | Exact keys and value mappings |
|---|---|
| Context | `"sources"`: L(Source); `"conditions"`: L(Condition); `"not_applicable"`: L(NotApplicable); `"execution_terms"`: T; `"commit_required"`: Boolean |
| Source | `"name"`: T; `"roles"`: set of role enums |
| Condition | `"category"`: category enum; `"contract"`: T; `"inputs"`: T; `"evaluator"`: T |
| NotApplicable | `"category"`: category enum; `"reason"`: T |
| Binding | `"action_id"`: bstr(32); `"action_digest"`: bstr(32); `"bound_instance_fields"`: empty map; `"event_type"`: full Type map from §4; `"event_id"`: native VE-002 bstr(32); `"prior_head"`: M(native VE-002 bstr(32)); `"sequence"`: U64; `"context"`: entire Context |

Roles are exactly `boundary`, `validation`, `authorization`, `execution`,
`time`. Categories are exactly `validation`, `identity`, `delegation`, `policy`,
`approval`. Source list is nonempty with distinct names and nonempty role sets.
Keep conditions and not_applicable in their semantic list order. Each category
has conditions or exactly one reason for inapplicability, never both; validation
and identity require conditions. Duplicate condition entries are invalid.
Evaluator names resolve only within this exact context and must have the
required category role. These structural grants do not authenticate themselves.

`prior_head=[]` is P's NONE for an empty stream only; it is not unavailable
history, null or an all-zero identifier. A present head has exactly one value.
Binding context is copied in full, not interned, hashed or inferred from another
field. No omitted-copy default, `$ref`, alias or alternate compact commitment
is defined. All copies must compare under the respective owners' equality.

### 6.3 Assessment and statement/result assignments

Assessment is exactly `{"binding":Binding, "source":T, "role":role,
"statement":Statement, "result":Result, "basis":T}`.

| Statement encoding | Result encoding | Scope |
|---|---|---|
| `["fact"]` | One native tstr: `established`, `refuted`, `unknown` | Binding's exact K fact; required role from P §4.1 |
| `["condition",Nat(i)]` | `satisfied`, `unsatisfied`, `unknown` | Zero-based position in Binding.context.conditions; within list bounds; exact designated evaluator |
| `["commit"]` | `committed`, `not_committed`, `unknown`, `not_applicable` | Exact Action execution terms and target scope |
| `["time"]` | §5 bound/unknown variant | Exact Binding fact's occurrence time |

Cross-statement result substitutions, extra array elements and unknown enum
values are invalid. Source, role and statement scope are separately checked;
a correct role with the wrong recognized fact scope still fails. Assessment
sets preserve contrary and unknown records. Full basis Text includes actual
observation/evaluation, evaluator/version, applicable inputs, rationale and
causal attribution; encoding a nonempty Text does not prove its sufficiency.
Condition contract/input Text must retain its actual governing edition, not a
bare Policy name, digest or mutable locator. The scenario's FX and KN illustrate
complete historical explanations; their particular Text is not a mandatory
value or a template to synthesize from outcome labels.

## 7. Required-input snapshots, establishment and history

DecisionInputs is the following closed **companion snapshot**, not part of the
Event or an authentication result generated by this codec:

| Key | Type |
|---|---|
| `"action"` | ActionInline supplied independently of payload.action |
| `"history"` | History below |
| `"context"` | Independently supplied Context |
| `"assessments"` | Independently supplied set of Assessment |
| `"action_establishment"` | Establishment for this exact ActionInline and its occurrence/content binding |
| `"context_establishment"` | Establishment for exact Action, History and Context |
| `"assessment_establishments"` | Set of `{"assessment":Assessment,"establishment":Establishment}`; one per exact authoritative assessment |

Establishment is `{"status":status,"material":L(OwnedOctets)}`. Status is
exactly `verified`, `failed` or `unavailable`. OwnedOctets is exactly
`{"owner":OwnerKey,"bytes":O,"definitions":Materials}`. OwnerKey is either
`["repository",SourceKey]` or `["external",EditionKey]`; the discriminant
selects the corresponding retained definition and its exact transitive closure.
The independently established owning context, not the package, selects that
definition and expected fingerprints. This does not require operational proof
owners to publish in the VE repository. Its bytes are
unchanged owner-supplied verification material, **not parsed as a new proof
scheme**. Owner validity/equality remains that owner's; unknown ownership is
unsupported re-verification, never verified by byte presence.

The containing position supplies the complete establishment subject; assessment
entries carry the entire exact record, including basis and context. Duplicate
subjects, missing entries or subjects not in the authoritative set are not
silently matched: duplicates/extras are malformed; absent entry is represented
canonically by an entry with unavailable status and empty material. This does
not erase supplied contrary records. This applies before encoding a semantic
snapshot: a decoder rejects a missing required entry rather than inserting one
and accepting noncanonical received bytes. An unavailable marker is not a negative
fact. Complete retained historical material is required before claiming
independent re-verification; a verified label with insufficient material cannot
make that claim.

**Trust boundary:** a received status is only a reported status. To consume it
as an established input, the caller MUST independently establish that exact
subject, status, material and scoped owner result under P/VE-001/VE-006.
For context this includes applicability, completeness and grants for A/H; for
assessment it includes origin, full Binding and source authority for that exact
role/statement/fact. A caller lacking that establishment supplies unavailable,
or failed for a definite failure. Neither the serialized label, a copied grant,
a successful Action hash nor an attachment can authenticate itself. There is
no automatic verification on decode and no default verified status. Different
independently established inputs are different decision inputs.

History is exactly `{"members":L(HistoryMember), "head":M(EventId),
"establishment":Establishment, "selection":M(Selection)}`.
Selection is `{"prior_head":M(EventId),"sequence":U64,"event_id":EventId}`.
It is supplied by the protected environment for this candidate, not selected
from its bytes. Empty selection means no unique authoritative successor yet;
it is not an illegal transition or permission to pick one. Unavailable history
establishment is not empty history; a carried empty head is authoritative NONE
only if independently established for a truly empty stream.

HistoryMember is exactly `{"record":HistoryRecord,
"membership":Establishment,"inputs":M(HistoricalInputs)}`.
HistoricalInputs contains exactly `action`, `context`, `assessments`,
`action_establishment`, `context_establishment`, `assessment_establishments`
with DecisionInputs' mappings; it refers to the complete preceding prefix, not
a recursively embedded second history. Its context establishment is for that
member's original Action/prefix/Context. Empty inputs means historical
verification material unavailable, not successful replay by default.

HistoryRecord is either `["bounded",Event]` or
`["foreign",{"event_id":EventId,"action_id":bstr(32),"sequence":U64,
"type":Type,"content":OwnedOctets}]`.
The variant is determined by the exact complete Type domain of the independently
selected P, not producer preference, installed code or material availability.
A Type inside that seven-value domain MUST use bounded; foreign MUST NOT
carry it. A recoverable bounded Event Type outside that domain, or a foreign
index Type inside it, is a known Stage-4 field/variant-domain violation.
Shape checking alone in Stage 3 does not silently classify an unfamiliar Type.
A distinct complete Type within the supported four-component foreign index
shape can be retained as foreign; that does not assert its semantic validity,
membership, transition or equality with a local Type. Foreign common values are retained
indexing assertions, not proof of their binding to the content: that requires
the exact foreign owner and independent membership establishment. A missing
owner may be represented by unavailable SourceMaterial; preserve content and
report unsupported interpretation. No semantics are inferred from a foreign
local name or a bounded-looking payload. This is an opaque retention facility,
not positive foreign-type conformance or a new common Event wire format.
This indexing form supports foreign identifiers having the same complete
four-component Type shape; other identifier domains need their own owner
mapping and are unsupported by this Draft. It does not narrow their Event
validity or invent their identifiers. Positive interpretation of even a
shape-compatible foreign type remains outside this profile.

Members are encoded in ascending authoritative sequence, with no duplicate
ordinal or occurrence ID; original delivery/storage origin is not an input
to canonical history order. Duplicate assignment, contrary head or illegal
transition is a conformance defect, not aliasing or repair permission. Identical
redelivery does not become another member. Gaps and maximum U64 remain legal;
no wrapping or implied missing Event is introduced. Imported and local known
records with identical exact inputs have identical handling. Missing foreign
semantics or historical establishment blocks a complete projection across
that member; retain history, report only a justified supported prefix, and
do not label it complete. This profile defines no generalized partial replay.

## 8. Unknown extensions and unsupported carriers

The Event's extension list represents its **distinct unknown semantic top-level
members**, not a new semantic `extensions` member. Each entry is the two-element
array `[T(name),ExtensionValue]`, sorted strictly by the canonical encoded
T(name). Names use exact scalar equality, not NFC/case folding. Empty names
are carried using T's empty-text capability; this makes no claim that any
extension owner admits them. Names identical to the six required Event fields,
payload, actor, component or references are collisions and invalid. A semantic
extension literally named `extensions` is unambiguous: it is an entry, never
the carrier grouping. No prefix, URI convention or registration is required.
No namespace gets authority through spelling; old names keep their old meaning.

For otherwise unowned opaque context, ExtensionValue has these **local carrier
constructors**, not new VE semantic types. The named constructor fixes the
source value kind; no Boolean/integer, Text/octet or list/set coercion occurs:

| Constructor | Exact representation |
|---|---|
| null | `["null"]` |
| Boolean | `["boolean",Boolean]` |
| mathematical integer | `["integer",Z]` |
| scalar-sequence text, including empty | `["text",T]` |
| octets | `["octets",O]` |
| ordered list | `["list",L(ExtensionValue)]` |
| finite set | `["set",Set(ExtensionValue)]` |
| named record | `["record",L([T(name),ExtensionValue])]`, unique names in encoded-T order |
| other owner-defined value | `["owned",OwnedOctets]` |

All structures are finite/acyclic; no hidden references or host objects exist.
The intrinsic constructor is mandatory when the source value has that exact
intrinsic kind; `owned` is not an alternate encoding of an intrinsic integer,
Text or collection. Intrinsic equality is kind-preserving structural equality,
using exact code points, octets, integers, list order and named members; set
equality is memberwise. An owner-defined value has its separate owner-bound
meaning, not an inferred equivalence to an intrinsic kind or another owner.
Owned values retain exact original owner bytes and immutable owner definition;
an owner may describe a value not in the intrinsic constructors. Unknown owner
meaning prevents a claim of semantic-value recovery, **not** opaque byte
retention. Only a complete lossless owner mapping permits semantic forwarding
for that value. If an input has neither an intrinsic mapping nor such an owner
mapping, report unsupported carriage; do not declare its otherwise valid Event
semantically invalid, drop the member or stringify it. This is an explicit
carrier-support boundary, not a narrowing of P/VE-002 extension admission.
Whole-profile portability over arbitrary extension owners remains unclaimed.
If an owner-defined member's equality/canonical mapping is unavailable, a
semantic set containing it cannot claim semantic duplicate collapse or canonical
semantic recovery. Opaque preservation of its exact owner-byte record remains
possible, but any semantic-set conformance claim is unsupported until that
owner supplies the required mapping. Byte equality must not silently substitute
for unknown semantic equality.

All seven P types treat unknown top-level extensions as noncritical context;
none requires one. Preserve unknown noncritical entries, including null,
without semantic interpretation and without changing projection. There is no
critical flag for a sender to set. Material required by a resolved owner/type
is critical by that owner's rules: unavailable semantics yields unsupported
interpretation/no authoritative append, never ignoring the requirement. Unknown
constructors or envelope keys are unsupported/malformed **carrier** structure,
not a newly recognized semantic extension. A future type requiring another
extension must select its own immutable contract; it cannot retarget P's types.

## 9. Decoder stages, failure distinctions and canonical claims

1. Parse one VE-CBOR-1 item with lossless integers/octet values and duplicate
   detection; reject truncation, trailing bytes, forbidden tags/floats,
   non-shortest arguments, indefinite items, invalid native text and bad ordering.
2. Match the independently chosen representation selector/publication. Unknown
   selector is unsupported; substitution under a known selector is rejected.
   Do not derive the allowed domain from a field supplied by the candidate.
3. Validate every closed carrier record, constructor, chunk/list shape and set
   order. Reject malformed, ambiguous and noncanonical encodings, including
   duplicate extension names, records or set members; do not repair them.
4. Recover values exactly and check actual field domains, the complete bounded
   Type domain and §7 variant/domain disjointness, selected Action
   representation/digests and immutable closure. A recoverable bounded Type
   outside P's domain or foreign-index Type inside it rejects as a known
   carrier-specific domain violation, not a universal VE-002 invalidity.
   Bad bytes/pins, conflicts or known retargeting reject. Missing actual
   required interpretation definitions are unsupported. Out-of-domain
   source-hash obligations prevent the affected verification/support claim,
   not O carriage or semantic admission by themselves.
5. Distinguish decodable assertions from profile-valid Events and authoritative
   membership. P's semantic procedure applies to the actual independently
   established inputs; §2.3 separately records self-contained carriage and
   any disclosed additional material. A missing inline position alone MUST
   NOT change the procedure on otherwise identical authoritative inputs.
   Known invalidity precedes unsupported, then unestablished. Lack of
   a unique selected append is not made valid by a proposed sequence or time.
   Merely decodable Event-only packages have no fresh-admission verdict.

Absence of a required Event/Context/Assessment member rejects; null is not
absence. Known forbidden members reject even when empty/null. Empty M means
only its assigned packaging distinction. Missing actual required interpretation material or verification
is unsupported; missing inline-only material has §2.3's carriage consequence.
A recognized assessment with only unknown fact/time is
unestablished; malformed intervals are invalid. Partial diagnostic decoding
MUST NOT be reported as successful canonical conformance. Resource exhaustion
or a configured resource ceiling must be reported as processing incomplete,
not as a new semantic domain rule or successful truncated decode.

**Why the mapping is injective:** UTF-8 is reversible for scalar sequences;
fixed O partitioning recovers every octet including arbitrary-length values;
Z's unique sign/minimal magnitude recovers each integer; L preserves every
position; set sorting removes only equality already specified by the owner;
closed record keys and variant arity make component boundaries unambiguous.
The §7 HistoryRecord alternatives are additionally disjoint by complete-Type
domain membership; the foreign variant cannot be a second carrier for a
bounded-domain Event. This reasoning concerns the declared supported carrier,
not positive semantics or canonical semantic equality of unknown foreign owners.
Rational pairs already reduced by P recover exactly, not approximately.
Native Action/Event representations preserve their existing owner distinctions.
Induction over each finite structure gives exact recovery for the supported
domain; two unequal Text/integers/records cannot normalize to one value.

The unique O/L/Z forms, strict set/name ordering, owner-defined Action form and
VE-CBOR-1 rules yield one byte sequence for each complete represented value
under the fixed closure. For an `owned` extension/foreign value this canonical
claim is only about its exact retained owner-byte value until the owner proves
its own canonical semantic mapping; no cross-owner semantic equivalence is
inferred. No Event semantic content identity follows from byte equality.

This construction uses only existing allowed CBOR items; it allocates no tag.
It obeys ADR-ENC-001 rather than relaxing NFC or integer/fraction rules. Any
future choice that changes Accepted canonicalization, native Event/Action bytes
or Approved domains MUST stop for RFC/ADR and affected-specification governance.

## 10. Proposed conformance evidence requirements

The following are **normative requirements for a future claim of conformance
to this Draft**, not an assertion that vectors/code exist. This task creates
neither executable codecs nor a vector package. A later evidence artifact
must pin this exact publication and every used owner, record authorship and
contain full values, bytes and expected results without discretionary defaults.

| Vector family | Required positive and adversarial coverage |
|---|---|
| Seven kinds | Each complete type and legal transition; illegal shortcut, false commencement/invocation, conflicting successor, post-terminal Event and wrong full type/revision |
| Field/owner boundary | Every assigned key, cardinality and owner; Action occurrence versus content, schema/descriptor/hash mismatch, extra instance data, non-32-octet Event/Action IDs, wrong bindings, role versus exact fact scope |
| Text and explanation | NFC/non-NFC-distinct pairs, supplementary scalars, embedded zero/newlines/BOM, complete FX/KN-style material; invalid UTF-8, normalization collisions, truncation, missing rationale/evaluator/version/inputs, bare Policy name/digest/locator |
| Integers | Zero, both signs, values beyond both direct-CBOR limits, large magnitudes/chunk boundaries; negative zero, leading zeros, truncation/wrap/coercion, negative year/index, U64 zero/max/overflow |
| Rational time | Point and proper intervals, zero and nonzero reduced fractions including thirds, large coprime components, equal corroboration; zero/negative denominator, nonreduced pairs, invalid calendar, reversed/unequal-overlapping bounds, float/precision loss, unknown/unavailable/malformed distinctions |
| Collections and syntax | Empty/nonempty/long L, O lengths 0/4096/4097 and multiple chunks, reordered semantic sets and duplicate enumeration collapse; encoded duplicates, wrong map/set order, missing/extra keys, truncation, trailing item, indefinite/tagged/non-shortest encodings |
| Evidence and authority | Full independent A/H/C/S copies and exact establishment subjects; verified/failed/unavailable, contradictory/unknown assessments, copied-status self-authentication attempt, missing retained owner material and payload/authoritative mismatch |
| History and dependencies | Imported/local known history, delivery permutation, arbitrary initial ordinal and gaps/exhaustion; complete-Type disjointness, bounded-as-foreign collision, unsupported foreign indexing, unavailable foreign owner, historical verification gap, substituted pins and wrongly complete projection |
| Carriage versus interpretation | Present and unavailable copies with identical actual independently established inputs; separate original inline-carriage report, no hidden cache fill, contradictory present bodies reject, new derivations identify changed snapshots; schema and source-hash domain/authority limits remain explicit |
| Extensions and presence | Opaque null/Text/integer/list/set/record/owned values, exact preservation and historical names; absent versus null/forbidden members, name collisions/duplicates, unknown noncritical preservation, unknown owner-required critical material blocking interpretation rather than silently ignored |

At least **two independently structured implementations** must perform A
encode → B decode and B encode → A decode, recover identical semantic values
under the fixed owners, and independently produce identical bytes wherever
canonical encoding is claimed. Both must agree on explicit negative results,
including representation rejection versus unsupported interpretation. One
implementation round-tripping its own bytes is insufficient. Shared plumbing,
libraries, assumptions, authorship and correlated-error limitations must be
disclosed; same-author work is not independent-team conformance.

Finite examples cannot exhaust arbitrary Text/integer/rational domains. Review
must also discharge the full-domain argument in §9 and test adversarial/boundary
families. The 87 semantic cases may guide later work, but require separate byte
fixture provenance and real Action-owner checks, not promotion of the prior
experiment's slots or oracle to an encoding authority. Existing fixtures and
source pins remain unchanged. Independent teams are not required to draft this
document; independent-team claims require actual independent-team evidence.

## 11. Security, unresolved decisions and governance

The proposed choices requiring review are the provisional local selector,
chunk/list forms and their cost, byte Text, signed magnitude, packaging versus
Event identity, scoped external-status interface and supported extension/Action
boundary. These are concrete proposals, not implementation-selectable defaults.
No empirical representation compatibility or cross-decoding result exists yet.

Resource exhaustion risks include deep finite chains, huge integers, gcd/cross-
product costs, set comparisons and duplicated Action/context/explanation data.
Implementations should use bounded working memory/iterative parsing where
possible and explicit operational limits; a limit is not semantic invalidity.
No stack overflow, integer narrowing or timeout may become a successful decode.
Test parser differentials, UTF-8 split boundaries, duplicate handling before map
construction, variant confusion and extension names resembling known fields.

Inline Policy, account, identity, grant and observation material may be sensitive.
Confidentiality, storage encryption, access control and lawful retention remain
operator/owner responsibilities. Dropping/redacting required material or replacing
it with mutable locators loses the corresponding conformance claim. Copied
establishment labels and source hashes never grant trust. Historical availability,
external edition authenticity and operational establishment remain unproved.

Representation completeness remains blocked on independent review, immutable
owner-material availability for the claimed scope, security review and §10's
cross-implementation evidence. Arbitrary foreign types/extension owners and
general Event portability remain outside the completeness claim. Profile and
imported Draft maturity/promotion are separate decisions, not solved by this
document. No new Approved-semantic conflict has been identified in the proposed
bounded mappings; one discovered during review must stop the affected proposal.

Under Specification Governance §§2, 6–7, 9–13 and 16–21, this is a Draft
proposal, not formal Event-level governance acceptance. Proposed treatment is additive at distinct
Type/selector bindings; accepted RFC-014/ADR-014 do not classify or accept this
Event bundle. Final Event-level classification, identifiers, lifecycle and any
RFC/ADR/version/changelog action remain owner decisions. Existing valid
behavior is not replaced or silently migrated. A fixed-core contradiction or
a proposed change to Accepted/Approved meaning stops the affected scope for
the applicable governance process, not an editorial override.
This source grants no permission to change a reviewer gate or historical artifact.

Draft publication alone is not a bound target or support claim. Before claiming
an exactly bound target, establish the agreeing P/R/Action/context bindings in
dependency order; before support, resolve every source/authority obligation
required by the exact claim. A local ledger of unresolved responsibilities is not a
complete serialized Materials manifest. No implementation run, opaque fill,
comparison, independent oracle or Review/Approved promotion is authorized.
**Recursive closure NOT CLOSED. Phase B CLOSED.**

| Architectural Decision Test | Proposed assessment, not evidence of approval |
|---|---|
| Founding consistency | Preserves existing owners, exact history and independent authority |
| Primitive necessity | No new primitive; local codec/package records only |
| Removability | Mapping is needed for carriage; identity/trust/clock frameworks are excluded |
| Durability | Immutable publication/dependencies, exact values and non-retargeting |
| Independent implementability | Explicit mappings/rejections proposed; cross-decoding remains a completion gate |
| Complexity | One bounded profile; native owner reuse and no codec negotiation or parallel identity scheme |

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.2-draft.1 (proposed) | 2026-10-26 | Full local Route-B companion: successor selections, exact role/carriage distinctions, disjoint bounded/foreign domain and selected Action-owner mapping. Draft preparation only; no canonical bytes, execution, formal Event design acceptance or conformance. |
| 0.1 (historical predecessor) | 2026-09-26 | Initial subordinate Draft of exact bounded Event/established-input carriage, lossless ENC-001 mappings, owner closure, rejection boundaries and required cross-implementation evidence. No codec, vector execution, Approved amendment or promotion. |
