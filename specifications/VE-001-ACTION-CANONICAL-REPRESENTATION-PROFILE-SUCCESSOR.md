---
id: "VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE-SUCCESSOR"
title: "Successor VE-001 Action Canonical Representation and Content Identity Profile"
version: "0.2-draft.2"
status: "Draft"
document_type: "Specification"
category: "Representation"
author: "Verified Execution"
created: 2026-10-25
updated: 2026-10-25
depends_on:
  - "VE-001"
  - "ADR-ENC-001"
  - "LYNX-UG2026-ACTION-OWNER-SOURCE-ANNEX"
related_documents:
  - "VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE"
  - "RFC-014"
  - "ADR-014"
supersedes: null
superseded_by: null
---

# Successor VE-001 Action Canonical Representation and Content Identity Profile

Draft status: **DRAFT — INCOMPLETE; NOT APPROVED OR INTEROPERABILITY-CLEARED.** This revision integrates the accepted RFC-014/ADR-014 additive Class B design and the owner-adopted bounded UTF-8/NFC finding recorded in ADR-014. Governance acceptance is not specification approval. The exact technical baseline, approved descriptor, sixteen expected interpretation-source selections, scoped roles and fixed-import conflict veto are retained. Owner capacity remains a declaration; the accepted provenance basis is not new independent publisher authentication. Actual independently selected successor publication/context bindings, claim-specific recursive closure and implementation/interoperability evidence remain separate obligations. Public availability does not establish a frozen review target, stable compatibility, execution authority or settlement truth. Historical publications and reviewer records remain unchanged.

The clauses below are the owner-designated Draft technical baseline, presented here for discussion. They do not retarget the historical S11 publication. Local file navigation is not an immutable publication selection.

## Draft status and provenance (informative)

The header identifies this document and its Draft revision. Intended repository path: `specifications/VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE-SUCCESSOR.md`. The creation date records preparation of this successor document, not creation of its historical predecessors or external standards; the update date records its latest editorial change. A-CANON is a local role handle for this named document, not a wire value or immutable source key. Identifier/path observations apply to their checked integration base; they are not a registry reservation or an independently governed source selection.

The independently selected successor publication bindings and actual agreeing governing context remain to be established. Header identifiers, filenames and observed branch commits alone do not supply those selections. The sixteen expected interpretation-source keys retain the recorded Founder selection and trust basis. This note and separate preparation records add no normative definition dependency and do not certify complete Materials or role closure. Draft publication, an exactly bound Draft review target and cryptographic interoperability remain distinct assurance states; the Approved-canonical-profile prerequisite is not discharged by publishing this proposal. Independently recorded review gates remain unchanged.

## Governance integration and revision history (informative)

The Founder allocated and accepted [RFC-014, revision 0.1](../rfcs/RFC-014-action-owner-successors.md) and [ADR-014, revision 0.1](../adrs/ADR-014-action-owner-successors.md) for the additive Action-owner design. ADR-014 records the owner-adopted bounded UTF-8/NFC source-text finding. The design is Class B at the additional independently selected contract boundary, not a drop-in replacement, old-selector retargeting or historical digest-equivalence claim.

These links and related-document identifiers provide governance/change trace, not new inputs to S, F, framing, normalization or hashing. A claim to establish this revision's authorized governance relies on the corresponding decision evidence; its necessary exact authority/material bindings remain a separate claim-specific responsibility. Informative citation does not close those roles or make required governance evidence dispensable. Existing operative dependency requirements and the fixed-import conflict veto are unchanged.

Repository links provide navigation, not independently adopted immutable publication/context selections. Neither this revision label nor governance acceptance supplies an agreeing context, complete recursive closure, specification approval or interoperability clearance. Conditional conflict/approval clauses in the technical baseline remain safeguards; the adopted finding addresses this bounded pair, not every future claim.

| Preparation date | Prior revision | This revision | Change |
|---|---|---|---|
| 25 October 2026, America/Edmonton | `0.2-draft.1` | `0.2-draft.2` | Governance references, status/provenance and revision history only; technical clauses, fixed literals and selected source keys preserved. |

This history records preparation of the revision, not a publication date, source fingerprint or emitted-byte result. Creation/update metadata records 25 October, the preparation date, rather than independent evidence of publication. The separate review gates remain unchanged; Phase B remains closed.

## 1. Scope, authority and normative language

Capitalized requirement keywords in these successor sources use the BCP 14 meanings of the exact selected RFC 2119 and RFC 8174 bodies listed in the common Source Annex. Ordinary-case words retain ordinary meanings; normative requirements are not limited to sentences using capitalized keywords. These are Draft conformance requirements within the declared scope, not Approved/stable adoption or execution authority.

Imported sources retain their own declared language conventions. This clause does not retroactively impose RFC 8174 on every historical import or change a source's maturity. The exact RFC bodies, lengths and fingerprints in the common Source Annex are now Founder-selected expected interpretation keys for this Draft on the recorded provenance basis, independently of future untrusted package values. This owner decision does not independently authenticate the publishers, change imported maturity, bind the successor publications/context or certify full closure; those separate obligations remain applicable before the affected support claim.

VE-001 owns the Action semantic model, occurrence identity and semantic equality, the distinction between Instance Envelope and Semantic Payload, the action_digest meaning/formula and the classification of semantic, occurrence-specific, transport and local content.

This profile supplies only the concrete encoding, framing, domain separation, digest-suite selection, primitive representation and action_id format delegated by VE-001. It does not change those semantic responsibilities or define a new Action field.

No ActionProfile, generic digest wrapper, universal identity primitive, schema language, global suite codepoint, registry or resolver is introduced. Selecting a bstr(32) action_id does not adopt the shared OccurrenceId convention.

The fixed owner/encoding sources are VE-001 and ADR-ENC-001 at the exact keys in the common Source Annex. Neither their maturity nor their semantics is upgraded by selection here. A conflicting fixed import MUST NOT be replaced by precedence, a current branch, a same-version filename or an inferred payload rule.

## 2. Governing selection and interpretation closure

A governing protocol or context MUST independently select this exact canonical-profile publication and the applicable governed schema. The schema owner's exact canonical-profile selection and the governing context MUST agree. A local handle, document title, payload, digest spelling or matching version label is insufficient.

The required interpretation/byte-producing closure consists of:

- this exact canonical-profile publication and its selected common Source Annex;
- the fixed VE-001 and ADR-ENC-001 sources and their operative recursive imports;
- the exact E01 and E02 definitions in the annex, with their explicitly scoped operative responsibilities;
- the required source-language definitions, including SRM-L1/SRM-L2 with their Founder-selected expected interpretation keys in the annex; the declared selection is independent of future untrusted package choices, not new publisher authentication;
- C-H1, the exact SHA-256 definition selected in §5; and
- the applicable independently selected schema, together with its exact role-scoped recursive definitions.

This profile retains an applicable-schema selection contract. It MUST NOT embed a future schema pin whose publication in turn needs to select this profile. The schema can select the already-established canonical publication; governing context then selects the applicable schema. A publication MUST NOT embed its own resulting hash.

Expected source/edition keys and selection authority MUST be independently established. A sender MUST NOT choose an alternative closure or silently omit an operative dependency. Conflicting selections or unavailable required definitions prevent the affected support/interpretation claim; a library default, heuristic or latest edition is not a substitute.

The Source Annex lists direct selected entries and responsibility rules, not a certified complete transitive graph. Required recursive edges remain obligations even when a source's metadata has an empty depends_on list.

Equal raw octets from different profiles or contexts MUST NOT be inferred to have equal cross-profile meaning. No old Type, selector or publication is an alias for a successor.

## 3. Canonical encoding and text discipline

Canonical bytes MUST satisfy the selected VE-CBOR-1 constraints and RFC 8949 Core Deterministic Encoding, including:

- definite lengths only and shortest integer/length arguments;
- text-string map keys, ordered by unsigned bytewise lexicographic comparison of their deterministic CBOR encodings;
- rejection of duplicate keys before a host map can discard them;
- valid scalar-value UTF-8 native text that already satisfies the selected NFC rule;
- no floating-point values or semantic tags under this contract; and
- exact integer quantities with schema-defined scale/unit where applicable.

A decoder MUST reject a noncanonical original, not re-encode it and treat that original as canonical. It MUST process exactly one complete data item without trailing bytes. This rule does not make a logical map's presentation order semantic; array order remains significant.

The applicable schema MUST supply an exact independently selected contract for every text rule affecting its admitted values or representation. This does not authorize a schema to waive Accepted VE-CBOR-1 constraints.

For the bounded Lynx schema assembled in the companion source, account_id uses its exact Unicode 6.2 NFC/repertoire predicate. All other native schema/Action strings in that bounded grammar are fixed ASCII names/literals or permitted ASCII sort-code digits. The schema selects E04/E05/E06 and C-N2–C-N5 for its explicitly stated responsibilities.

For this bounded successor pair, scalar-value text uses the already selected C-N3 Unicode 6.2 Chapter 3 scalar/encoding definitions, including §§3.8–3.9, with the numeric scalar-to-octet mapping of E02 RFC 3629 §3. The scalar domain is U+0000–U+D7FF and U+E000–U+10FFFF. C-N3 D92 and Tables 3-6/3-7 supply the formal encoding-form and well-formedness definitions. The selected definitions MUST agree on the function and permitted sequences throughout that domain. A disagreement blocks support; neither import order nor a schema override resolves it.

This is an expressly restated numeric UTF-8 responsibility for the successor, not a wholesale import of E02's historical character-assignment standards. E02's identified Unicode 4.0 and historical ISO/IEC 10646 references are not aliases for 6.2 and do not select this schema's repertoire or NFC edition. Under this proposed numeric role their physical bodies are not additional definition inputs. E02 itself is not amended; broader historical-standard conformity needs its own necessary source selections. E02 §4's ABNF remains derived/non-authoritative; RFC 2234 is not newly selected as an algorithm body and no latest replacement is implied.

UTF-8 well-formedness alone does not establish repertoire, length, NFC or other schema admission. Ill-formed input MUST NOT be repaired into admission by U+FFFD substitution, octet removal, surrogate/CESU-8 or overlong acceptance. No implicit leading-BOM removal or other value rewriting is permitted. A literal U+FEFF is evaluated under the existing scalar/schema predicates, not silently removed as a signature.

E02 and C-N3 remain the same required whole selected bodies; responsibility scoping does not substitute excerpts for their bytes. This proposal supplies no waiver of the fixed Accepted/Approved imports and does not redefine their other users. If the proposed scope cannot satisfy those imports, the applicable governance/version path is required before adoption. The static numeric source-text rationale is not an implementation pass or a general equivalence claim for Unicode editions.

A different implementation strategy or newer library MAY be used only if it implements the selected predicate over the admitted domain. Witness agreement and a library's current Unicode database do not select the rule or prove general equivalence.

Non-NFC input MUST NOT be normalized into admission. This scoped application does not globally reinterpret Accepted ADR-ENC-001 for other users. If conformity requires changing Accepted or Approved meaning, normal RFC/ADR/version/changelog governance is required before adoption.

The separate Event representation's T/O/L carriers are not substituted for native Action items. This profile does not normalize arbitrary T scalar sequences, add a 6.2 assignment filter to T, interpret opaque owned bytes or cap all O values.

## 4. Imported Action structure and schema obligations

The represented minimum portable structure is:

```text
Action
  Instance Envelope
    action_id
  Semantic Payload
    schema_digest
    schema-defined semantic fields F
```

The applicable schema owns field names and meanings, admission, normalization, absent-versus-present semantics and its complete descriptor. Before this profile is applied, it MUST supply:

- one complete canonical schema descriptor S as a VE-CBOR-1 data item; and
- one normalized map F containing exactly its schema-defined semantic fields.

S MUST commit to every schema rule capable of changing admitted semantic content or its normalized representation. A name, version, publication pin or material fingerprint does not replace a missing semantic commitment. This profile defines no universal schema grammar.

The schema's fixed notation supplies S; this profile supplies framing and digest mechanics. The selected pair MUST satisfy both contracts. A schema-level compatibility constraint is not authority to override this profile. A mismatch blocks pairing; import order does not resolve it.

F MUST NOT contain schema_digest, action_id, other Instance Envelope data, execution-attempt/lifecycle status, transport/routing metadata, local annotations or content not classified as semantic by VE-001 and the schema. Schema-defined account/address values remain semantic even where operational routing is separately nonsemantic.

## 5. Exact SHA-256 definition and domain

SHA-256 means the function defined by FIPS PUB 180-4, August 2015, selected as C-H1 in the Source Annex. Its operative algorithm responsibilities are §§2–3, §4.1.2, §4.2.2, §§5.1.1–5.2.1, §5.3.3 and §6.2.

The whole exact selected PDF body is definition material. Its bibliography and federal validation provisions are not extra byte-function inputs, and selection is not an implementation-validation or security-certification claim.

For each octet-aligned hash input B:

```text
0 <= len(B) < 2^61 octets
```

Every required hash input MUST satisfy that domain. An implementation MUST NOT truncate the input, wrap its length, substitute separately hashed chunks, select another suite or use an implementation-defined extension beyond that domain.

Before a schema is claimed supported, its owner/context MUST establish an in-domain argument for every required schema/content hash input over its admitted domain. Another schema cannot borrow a finite witness set or this bounded schema's argument as a universal proof.

An out-of-domain obligation prevents the affected support claim. It MUST NOT be disguised as a canonical-CBOR syntax error, an execution decision or an ordinary host-resource limit. No new Event stage or generic error taxonomy is allocated here.

Publication/source verification separately needs an actual hash-input-domain argument, including any Git blob prefix where applicable. No claim is made that the whole package, all finite histories or every O value is hashed or globally bounded by this profile.

## 6. Canonical schema identity

Let S be the exact complete descriptor data item supplied by the independently selected schema. The schema frame is exactly:

```text
SchemaIdentityFrame = [
  "VE-ACTION-SCHEMA",
  1,
  S
]
SF = VE-CBOR-1(SchemaIdentityFrame)
schema_digest = SHA-256(SF)
```

The domain label is native CBOR text; 1 is a native CBOR unsigned integer; S is the descriptor data item, not text, an Event carrier, a file hash or an already encoded bstr.

schema_digest MUST be one native CBOR byte string containing exactly the 32 raw output octets. Hex/base text, tags, URIs, wrappers and suite prefixes are not its representation.

The integer 1 is the local frame value retained by this successor contract, not a global codepoint or an alias to the historical profile. The exact new profile publication still requires independent selection.

This construction supplies the delegated realization of VE-001 schema_digest. A semantic schema change requires a changed complete descriptor and, subject to the selected cryptographic collision assumption, a changed digest. No mathematical collision-freedom or unchanged historical output is asserted.

## 7. Canonical semantic payload and Action content identity

F MUST satisfy the selected schema and VE-CBOR-1. Its exact canonical payload bytes are the native VE-CBOR-1 encoding of F.

The content frame is exactly:

```text
ActionContentFrame = [
  "VE-ACTION-CONTENT",
  1,
  schema_digest,
  F
]
AF = VE-CBOR-1(ActionContentFrame)
action_digest = SHA-256(AF)
```

schema_digest in the frame is its raw 32-octet native bstr value; F is its native map. action_digest MUST likewise be one native CBOR bstr containing exactly 32 raw SHA-256 output octets, without a tag, text encoding, wrapper or suite prefix.

action_digest commits to schema_digest and the semantic fields F. It does not commit to action_id, occurrence metadata, execution-attempt metadata, lifecycle status, transport, local annotations, authorization, execution or outcome. Definition bodies, source fingerprints and package Materials MUST NOT be inserted into either frame as additional fields.

The profile and governing context fix the domain/framing and suite. Raw digest octets MUST NOT be interpreted as a generic cross-profile identity.

## 8. Action occurrence identifier

action_id MUST be exactly 32 opaque octets represented as one native CBOR bstr(32).

VE-001 continues to require an authoritative Action identifier to be immutable, unique wherever authoritative histories may be compared and never reassigned. Generators remain responsible for those duties.

The fixed width is a representation rule, **not a generation algorithm**. This profile does not mandate randomness, hashing, UUIDs, a registry, namespace authority or another generation method. It does not introduce an extra rejection of a particular 32-octet bit pattern.

The selected shape does not give action_id content-derived, ordering, human-readable, registry or resolver meaning. It does not adopt the shared OccurrenceId convention or Event identity/occurrence generation rules. Equal octets in an Event, Receipt, Claim or other kind do not establish cross-kind identity.

Representation validation of bstr(32) does not prove the generator's uniqueness or establish occurrence authority.

## 9. Complete canonical Action item

The canonical Action under this contract is exactly:

```text
CanonicalAction = {
  "action_digest": action_digest,
  "instance": {
    "action_id": action_id
  },
  "semantic": {
    "fields": F,
    "schema_digest": schema_digest
  }
}
```

Every shown member is required. No additional top-level, instance or semantic member is permitted. Missing, null, malformed or wrong-type members do not satisfy the closed structure. The selected schema supplies the exact closed contents and types of F.

The whole Action MUST be encoded as exactly one canonical native VE-CBOR-1 data item. No Event T/O/L encoding, alternate field, inferred default or hidden normalization may be substituted.

## 10. Independent validation and comparison

A conforming representation validator MUST independently establish the exact selected profile/schema and necessary definitions, then verify:

- that the complete expected S is canonical and produces the carried schema_digest;
- that F has the exact declared schema fields, values and normalization;
- that the exact content frame produces the carried action_digest; and
- that action_id has the required representation.

Within this exact selected profile/context, canonical action_id values compare by their 32 payload octets and canonical action_digest values by their 32 output octets, in order. Comparison MUST NOT use source spelling, object identity, diagnostic notation, a repaired noncanonical input or an unselected profile.

VE-001 retains semantic identity/equality authority. Successful representation checks establish neither authorization, trust, execution, outcome, account facts nor canonical external-state commitment.

## 11. Fail-closed requirements and support limits

No successful profile validation may be claimed for:

- anything other than one complete canonical data item, including trailing bytes;
- duplicate, missing, unknown, extra, malformed or wrong-type members;
- indefinite lengths, nonshortest arguments, disallowed tags/floats, invalid UTF-8 or non-NFC native text;
- an invalid/non-normalized F or a forbidden semantic/nonsemantic mixture;
- an incomplete, unselected, unavailable or noncanonical descriptor/necessary definition;
- a schema_digest, action_id or action_digest with the wrong representation, or a digest not equal to the independently recomputed value;
- ambiguous/unsupported profile or frame selection; or
- substitution of another framing rule, domain label, hash function or representation.

Malformed and noncanonical representations MUST be rejected. A missing definition, unsupported selection, out-of-domain hash obligation or unfinished resource-limited computation MUST NOT be converted into a successful representation claim, a fabricated false external assessment or a new semantic outcome. This document defines no generic failure taxonomy or Event decoder-stage assignment.

Finite host resources do not redefine the selected abstract contract. An implementation that cannot finish a permitted computation must not certify its result or call the value semantically invalid solely for that resource reason.

## 12. Interpretation materials and ownership boundaries

Selected definition bodies are required interpretation material, not new Action semantic fields. Physical carriage belongs to the selected enclosing protocol/representation.

ActionInline.definitions, package Materials and each OwnedOctets.definitions remain distinct exact role closures. A profile/schema dependency may occur in more than one role only through the corresponding operative edge; do not copy the whole package into every Action or owned object. Informative links are not silently promoted into normative inputs.

Matching fingerprints establish neither publisher authenticity, source-owner adoption, complete closure nor execution authority. Expected keys and the binding of commit/path/body must be independently established under the responsible source owner.

## 13. Informative bounded-domain argument and evidence limits

For the companion schema's approved local descriptor, a static inventory counts 660 data-item nodes and 15,482 ASCII literal characters, including keys. A conservative bound is:

```text
len(S_encoding) <= 9 * 660 + 15482 = 21422 octets
len(SF) <= 21422 + 19 = 21441 octets
```

For its bounded fields, each account map is at most 196 encoded octets, F at most 450 and AF at most 504. Both required hash uses are within the selected domain under the declared formulas.

These are structural upper bounds, not actual encoded sizes, generated vectors, implementation results or digest values. Re-establish them after any relevant literal/field/framing change. No normative maximum of 21,441 is added to generic descriptors or O.

No historical rendered output, engineering score, “Pass,” no-RFC conclusion, VE-014 integration claim or old oracle expectation is carried as successor evidence. The Founder Draft-target, expected-source and metadata decisions are recorded. The bounded UTF-8/NFC finding and RFC-014/ADR-014's additive design/classification are adopted/accepted within their stated scope. Actual publication/context bindings, remaining claim-specific governance/material roles and implementation/interoperability evidence are still required for the affected claim; publication does not itself certify them.

