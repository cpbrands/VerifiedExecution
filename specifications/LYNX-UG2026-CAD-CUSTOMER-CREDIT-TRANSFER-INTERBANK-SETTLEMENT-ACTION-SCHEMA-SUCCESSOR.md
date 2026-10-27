---
id: "LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA-SUCCESSOR"
title: "Successor Lynx UG2026 CAD Customer Credit Transfer Interbank Settlement Action Schema"
version: "0.2-draft.2"
status: "Draft"
document_type: "Specification"
category: "Action Schema"
author: "Verified Execution"
created: 2026-10-25
updated: 2026-10-25
depends_on:
  - "VE-001"
  - "ADR-ENC-001"
  - "VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE-SUCCESSOR"
  - "LYNX-UG2026-ACTION-OWNER-SOURCE-ANNEX"
related_documents:
  - "LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA"
  - "RFC-014"
  - "ADR-014"
supersedes: null
superseded_by: null
---

# Successor Lynx UG2026 CAD Customer Credit Transfer Interbank Settlement Action Schema

Draft status: **DRAFT — INCOMPLETE; NOT APPROVED OR INTEROPERABILITY-CLEARED.** This revision integrates the accepted RFC-014/ADR-014 additive Class B design and the owner-adopted bounded UTF-8/NFC finding recorded in ADR-014. Governance acceptance is not specification approval. The exact technical baseline, approved descriptor, sixteen expected interpretation-source selections, scoped roles and fixed-import conflict veto are retained. Owner capacity remains a declaration; the accepted provenance basis is not new independent publisher authentication. Actual independently selected successor publication/context bindings, claim-specific recursive closure and implementation/interoperability evidence remain separate obligations. Public availability does not establish a frozen review target, stable compatibility, execution authority or settlement truth. Historical publications and reviewer records remain unchanged.

The Draft requirements below apply only within this schema's declared scope. The recorded Founder Draft designation and local preparation approval are not Approved/stable VE status or execution permission.

## Draft status and provenance (informative)

The header identifies this document and its Draft revision. Intended repository path: `specifications/LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA-SUCCESSOR.md`. The creation date records preparation of this successor document, not creation of its historical predecessors or external standards; the update date records its latest editorial change. A-SCHEMA is a local role handle for this named document, not a wire value or immutable source key. Identifier/path observations apply to their checked integration base; they are not a registry reservation or an independently governed source selection.

The independently selected successor publication bindings and actual agreeing governing context remain to be established. Header identifiers, filenames and observed branch commits alone do not supply those selections. The sixteen expected interpretation-source keys retain the recorded Founder selection and trust basis. This note and separate preparation records add no normative definition dependency and do not certify complete Materials or role closure. Draft publication, an exactly bound Draft review target and cryptographic interoperability remain distinct assurance states; the Approved-canonical-profile prerequisite is not discharged by publishing this proposal. Independently recorded review gates remain unchanged.

## Governance integration and revision history (informative)

The Founder allocated and accepted [RFC-014, revision 0.1](../rfcs/RFC-014-action-owner-successors.md) and [ADR-014, revision 0.1](../adrs/ADR-014-action-owner-successors.md) for the additive Action-owner design. ADR-014 records the owner-adopted bounded UTF-8/NFC source-text finding. The design is Class B at the additional independently selected contract boundary, not a drop-in replacement, old-selector retargeting or historical digest-equivalence claim.

These links and related-document identifiers provide governance/change trace, not new inputs to S, F, framing, normalization or hashing. A claim to establish this revision's authorized governance relies on the corresponding decision evidence; its necessary exact authority/material bindings remain a separate claim-specific responsibility. Informative citation does not close those roles or make required governance evidence dispensable. Existing operative dependency requirements and the fixed-import conflict veto are unchanged.

Repository links provide navigation, not independently adopted immutable publication/context selections. Neither this revision label nor governance acceptance supplies an agreeing context, complete recursive closure, specification approval or interoperability clearance. Conditional conflict/approval clauses in the technical baseline remain safeguards; the adopted finding addresses this bounded pair, not every future claim.

| Preparation date | Prior revision | This revision | Change |
|---|---|---|---|
| 25 October 2026, America/Edmonton | `0.2-draft.1` | `0.2-draft.2` | Governance references, status/provenance and revision history only; technical clauses, fixed literals and selected source keys preserved. |

This history records preparation of the revision, not a publication date, source fingerprint or emitted-byte result. Creation/update metadata records 25 October, the preparation date, rather than independent evidence of publication. The separate review gates remain unchanged; Phase B remains closed.

## 1. Scope, authority and governing selection

VE-001 owns the Action primitive and occurrence/content identity semantics. This subordinate schema owns the bounded intended instruction, its exact semantic field/amount/address meanings, admission, normalization/equality, fixed mapping/charge constraints, completion proposition and complete descriptor.

It does not own execution authorization, Execution Rights, raw-evidence verification, routing/transport mechanisms, Event creation, Lifecycle transitions, Receipt truth, retries or uncertain-outcome resolution. It creates no new VE primitive, generic schema language, PaymentRail object or pacs.008 serialization specification.

The exact fixed VE-001 and Accepted encoding sources are selected by the common Source Annex. The applicable governing context and authorized schema-owner binding MUST identify the exact successor canonical-profile publication used by this schema. Their selections MUST agree. An old S11 publication, same-name file, local handle, latest branch or payload-supplied choice MUST NOT silently fill that selection.

The canonical owner supplies native representation, schema/content framing, digest construction and occurrence-ID representation. §7 states the compatibility constraints this schema requires; it does not override that owner's authority. A mismatch blocks the pairing.

Normative language follows the selected canonical profile's §1 convention and its exact RFC 2119/RFC 8174 selections. Imported publications retain their own language conventions. Requirements below are the owner-designated Draft baseline. The sixteen expected interpretation-source keys are selected by the recorded Founder decision independently of future untrusted package choices; this does not confer Approved/stable status, new publisher authentication or actual successor/context bindings.

## 2. Exact intended Action and completion proposition

The Action means:

> Request settlement through Payments Canada Lynx of one domestic Canadian-dollar interbank payment obligation for a single customer credit-transfer instruction, for the exact interbank settlement amount and exact source and destination customer-account addresses represented by the Action.

There is exactly one customer credit-transfer instruction. The fixed endpoint scope is domestic Canadian and the fixed clearing/addressing regime is Lynx/CACPA. These are schema meaning, not instance selectors.

The bounded successful-fulfillment proposition is:

> The authoritative Lynx execution domain establishes that the exact CAD Lynx Payment Obligation represented by the Action was Settled between the sending and receiving Lynx participants through entries to their Lynx accounts.

This is participant-level Lynx interbank settlement. It does not assert source-customer debit, beneficiary account credit, guaranteed net credit, complete end-to-end payment, or fulfillment from message submission, SWIFT acceptance, queue admission or UPM/LSM processing alone.

The schema defines that proposition, not what evidence is sufficient to prove it. Representation validity, a digest or field admission establishes neither authorization nor execution, settlement truth, account existence or external-state commitment.

## 3. Exact external source and scoped incorporation

The exact E03 body is selected in the common Source Annex, retaining:

| Property | Selected meaning identifier |
|---|---|
| Authority | Payments Canada / Canadian Payments Association |
| Collection | Lynx_Final_CoreMessages_UG2026 |
| Usage guideline | Lynx_FIToFICustomerCreditTransferV08_pacs.008.001.08 |
| ISO message | pacs.008.001.08 |
| Business service | paymentsca.lynx.04 |
| Document date | 23 March 2026 |
| Release | November 2026 published UG2026 target |

No current production-effectiveness claim follows. The March 2026 Companion v1.5 remains informative and does not override the selected guideline or supply an undisclosed missing rule.

This schema selects E03 for the responsibilities expressly restated here: bounded intent/completion, fixed CAD amount semantics and limits, the selected customer-account/CACPA branch, and fixed mapping/charge constraints. Those rules, the exact XML/Unicode contracts in §§5–6 and the selected canonical contract determine this schema's predicate and representation inputs.

References within E03 to general ISO currency tables, base-message artifacts, other branches or execution-time validation do not supply extra mutable inputs to that fixed predicate. This is an explicit successor scope choice, not a finding that the old E03 reference graph was closed.

E03 remains required source/interpretation material for its selected role. Its physical PDF fingerprint is provenance, not an Action field or a PDF-body hash inserted into the descriptor/frame.

An uncovered rule needed to determine admission or representation MUST be explicitly restated or selected under an appropriately identified schema before support is claimed. No sender, library or implementation may fill that gap through a current table, guessed edition or heuristic.

## 4. Complete semantic field grammar and fixed payment rules

### 4.1 Closed field maps

F is exactly the native map:

```text
{
  "amount_minor": amount_minor,
  "source_account": {
    "servicing_agent_canadian_sort_code": source_sort_code,
    "account_id": source_account_id
  },
  "destination_account": {
    "servicing_agent_canadian_sort_code": destination_sort_code,
    "account_id": destination_account_id
  }
}
```

All three top-level members and both members in each account map are required. Missing, null or extra members MUST be rejected at both levels. There are no defaults or coercions. A logical map's presentation order is not semantic; canonical native-CBOR ordering on the wire is still required.

No extra currency, domain_id, operation, local_instrument, settlement_date, charge_bearer, charges, payment_rail, beneficiary or transfer_reference selector exists. All other unlisted semantic members are equally prohibited.

### 4.2 amount_minor

amount_minor MUST be a mathematical unsigned integer from 1 through 99,999,999,999,999 inclusive. One unit is exactly CAD 0.01; scale is exactly two decimal places. Zero, negative values, floating-point values, decimal text, Booleans and values above the maximum MUST be rejected.

It denotes the CAD InterbankSettlementAmount of the requested obligation, not beneficiary net credit. CAD and scale two are fixed by schema identity; non-CAD instructions require a different schema identity. No currency conversion or exchange rate is permitted.

For every admitted Action, the Adapter's fixed amount mapping is:

```text
InstructedAmount = amount_minor / 100 CAD, exactly
InterbankSettlementAmount = amount_minor / 100 CAD, exactly
InstructedAmount = InterbankSettlementAmount
```

These are exact scaled-integer semantics, not a requirement to use host binary floating point or a second Action amount field.

### 4.3 Fixed charges

The bounded subset fixes ChargeBearer to DEBT, ChargesInformation to absent and ExchangeRate to absent. ChargeBearer is not an Action selector.

These mapping constraints do not guarantee eventual customer net credit. Receiving-institution service/receipt charges remain outside the participant-level completion proposition.

### 4.4 ISO currency boundary

No additional ISO 4217 edition or live currency-table query is an input to this fixed Action predicate. The constants above are directly specified.

This does not verify wholesale E03/R47/code-table conformance or waive requirements for an actual emitted message. A broader external compatibility/currency-validation claim MUST select its needed authoritative standard/table artifacts under the responsible execution contract. Such execution-time material MUST NOT silently mutate this schema's Action values.

## 5. Regime-qualified customer-account addresses

Each account is a closed two-member map governed by this section. The pair denotes a schema-fixed Lynx/CACPA servicing-agent plus Other/Id customer-account address, not a permanent account-object identity, generic AccountReference or deployment-local namespace.

### 5.1 servicing_agent_canadian_sort_code

The value MUST be native text containing exactly nine ASCII digits and matching the whole-string grammar 0[0-9]{8}: a leading zero, three-digit institution number and five-digit transit/branch routing number.

The leading zero MUST be preserved. Numeric representation/conversion, spaces, hyphens, non-ASCII digits, extra characters, trimming and padding are not permitted. Equality is exact scalar-sequence equality.

### 5.2 account_id

The value is the Id in AccountIdentification4Choice/Other/Id. It MUST be valid scalar-value UTF-8 text containing 1 through 34 code points. Each code point MUST be in both:

- the XML 1.0 Fifth Edition Char production: U+0009, U+000A, U+000D, U+0020–U+D7FF, U+E000–U+FFFD or U+10000–U+10FFFF; and
- Unicode 6.2.0 General_Category != Cn, using E04 interpreted by E05's relevant ranges, fields and defaults.

Unicode scalar values are U+0000–U+D7FF and U+E000–U+10FFFF. Ill-formed UTF-8 or surrogate code points do not satisfy that domain. The bounded numeric UTF-8 and authority responsibilities are those expressly stated in the selected canonical profile §3; they do not replace this schema's independent repertoire, length and NFC tests. Invalid input is not repaired into admission and no leading U+FEFF is silently stripped.

Length is the scalar/code-point count after repertoire validation, equivalently the XML-character count here. It is not a UTF-8 octet, UTF-16 unit or grapheme count; a permitted supplementary scalar counts once.

The original value MUST already equal its NFC result under §6. A non-NFC original MUST be rejected, not normalized into admission.

Equality is exact scalar-sequence equality. No case folding, trimming, padding, whitespace normalization, punctuation rewriting, numeric conversion, leading-zero removal, alias resolution or provider normalization is permitted.

The literal category test is retained. Co private-use characters receive no additional ban beyond the stated predicates. Any new private-use exclusion would require an express semantic/descriptor decision.

### 5.3 Roles, independence and equality

The source sort code maps to DebtorAgent CACPA clearing-system member identification and its account_id to DebtorAccount/Identification/Other/Id. The destination counterparts map to CreditorAgent and CreditorAccount/Identification/Other/Id. These fixed mappings add no Action fields.

Source and destination values are independent; the roles are not interchangeable. The same account_id under different sort codes denotes different addresses.

No extra source/destination inequality or distinctness test is introduced. Lexical admission of equal-address or same-participant values does not establish that the requested payment can execute, is permitted or can achieve interbank settlement.

Neither lexical admission nor a digest establishes account existence, directory membership, ownership or authorization. Those facts require their own appropriate authoritative contracts and evidence; they MUST NOT become unspecified hidden schema predicates.

### 5.4 Unsupported alternatives

IBAN, proxy, BICFI/LEI/name-address agent identification, SchemeName, Issuer, account-currency alternatives, non-CAD and open-ended addressing unions are outside this Action class and MUST NOT be admitted as alternatives. Their validity in a broader Lynx/ISO context does not extend this closed grammar.

## 6. Exact NFC definition and data responsibilities

NFC for this bounded predicate uses the exact Unicode 6.2.0 basis selected in the Source Annex:

- C-N3: necessary scalar/encoding definitions, canonical decomposition in §3.7, canonical ordering/composition in §3.11 and arithmetic Hangul decomposition/composition in §3.12, with their necessary internal definitions;
- C-N2: the selected UAX #15 revision 37's applicable definition references, version/conformance and exclusion responsibilities;
- E04/E05: UnicodeData 6.2.0 and UAX #44 revision 10's relevant properties, range expansion, fields and defaults;
- C-N4: CompositionExclusions 6.2.0; and
- C-N5: NormalizationCorrections 6.2.0 as a normative version/correction constraint.

SRM-U1, the exact acquired Unicode 6.2 Core Specification Chapter 4 body, is Founder-selected as an expected interpretation-source key for this Draft in the Source Annex. Its limited role is the selected-version UCD/property authority in the opening disclaimer and §4.1, canonical-combining-class discussion in §4.3, and General_Category interpretation in §4.5. It does not supply a new canonical-decomposition algorithm: the selected Chapter 3/E05 contract continues to supply that definition and data interpretation. This is not a blanket import of all Unicode processing.

The recorded coordinator review read physical PDF pages 1–4 and 7–13 (front matter, printed pp.121–123 and126–132), including the complete relevant §§4.1/4.3/4.5 and surrounding qualifications, and visually inspected printed pp.131–132. This is not a claim that the whole chapter/book was read. No uncovered admission- or representation-affecting rule requiring a descriptor change was identified in that bounded assessment.

For this responsibility, the exact selected 6.2 UCD data governs printed property summaries for that version. General_Category MUST use those exact values; the literal test remains General_Category != Cn. Do not replace it with an imprecise assigned-code-point test, a private-use ban, API-specific reclassification or a later data release. Canonical combining-class ordering remains the selected formal normalization rule, not visual glyph reordering. Dynamic alias matching, rendering, segmentation and identifier APIs are not new account predicates.

The body key and length are recorded, and the Founder has separately selected that exact expected interpretation key for this Draft on the recorded provenance basis, independently of future untrusted package choices. The completed local read/impact assessment is not itself the selection authority, an independent review, new publisher authentication or certification of full closure. Any newly necessary operative definition or conflicting rule MUST be resolved explicitly before the affected support claim; current editions, library data, snippets or an unknown-key unavailable marker are not substitutes.

The proposed source role does not introduce extra admission predicates, a private-use ban, casing, segmentation, collation, name lookup, alias normalization or compatibility decomposition. If a needed rule changes admission or representation and is not already committed in the approved descriptor, support remains blocked pending a newly versioned descriptor/source proposal and new approval. A semantic conflict is not resolved by import precedence or an unrecorded extra test.

The formal Chapter 3 definition referenced by the selected annex is not a competing algorithm. NFC is canonical composition of the canonically ordered full canonical decomposition under these selected rules/data, not compatibility decomposition or NFKC.

Matching First/Last records are expanded under the selected UAX #44 rules. Unlisted General_Category is Cn, unlisted Canonical_Combining_Class is zero and default Decomposition_Mapping is identity. Compatibility-tagged mappings are not canonical decompositions.

Full composition exclusions are C-N4's listed exclusions plus the singleton and non-starter exclusions derived from the selected Chapter 3 and UnicodeData rules. Use corrected 6.2 mappings, not historical erroneous mappings or a second application of the same corrections. No reconstruction of older versions is required.

DerivedNormalizationProps 6.2 may be used as a matching derived implementation/verification table, but its physical body is not required to define this chosen derivational predicate. It is not a competing definition; quick-check tables are not mathematical-predicate inputs.

NormalizationTest concerns separate applicable implementation-conformance obligations; no testing claim follows from this schema. The component-list page is provenance only. NFKC/NFKD admission, case folding, collation, grapheme segmentation, Hangul name generation/general syllable-type properties, stream-safe insertion and stabilized-string transformation are not selected responsibilities.

A newer library or different strategy MAY be used only if it produces the selected predicate on this admitted domain. Neither defaults nor finite witness agreement select an edition or prove general equivalence. Missing definitions MUST NOT be replaced heuristically.

This scoped selection covers bounded account strings and fixed ASCII names/literals/digits, not arbitrary future native-text schemas. Accepted encoding constraints remain binding; required changes to Accepted/Approved meaning need the applicable governance path.

T and opaque owned bodies are not redefined: no 6.2 assignment/NFC filter is added to arbitrary T scalar sequences and no opaque owned octets are interpreted.

## 7. Complete CanonicalSchemaDescriptor S

### 7.1 Authority and exact native mapping

The single JSON-notation map in §7.2 is the entire fixed proposed logical S. It is not a generic schema language or unrestricted JSON input. Every member/value is exact; a sender, payload, implementation or source annex MUST NOT fill, delete or override any member.

Its native interpretation is:

- an object denotes its exact CBOR map with native text keys;
- an array denotes its definite-length native CBOR array in listed order, not an Event L list;
- a string denotes its exact native CBOR text scalar sequence, not T/O or a byte string;
- a listed nonnegative integer denotes that mathematical native unsigned integer, without coercion;
- a Boolean denotes a native Boolean, not an integer or text; and
- duplicate, missing, extra, substituted or unsupported values reject; no defaults exist.

Object display order is not identity; the selected native canonical key order governs its encoding. Array order is part of the fixed data item. The selected canonical profile supplies the precise encoding/framing/hash mechanics and MUST satisfy S's compatibility constraints.

The descriptor-local version 2 is the approved local content value. It is not an allocated publication version, semantic Type revision or representation selector. The historical version-1 map remains separate; no unchanged schema_digest/action_digest claim follows.

### 7.2 Sole descriptor literal

The following is the complete literal. No rendered byte block or example output is an alternative definition.

```json
{
  "name": "ve.action.lynx-ug2026.domestic-cad-customer-credit-transfer-interbank-settlement",
  "version": 2,
  "action_class": "one_domestic_cad_customer_credit_transfer_interbank_settlement",
  "intent": {
    "instruction": "Request settlement through Payments Canada Lynx of one domestic Canadian-dollar interbank payment obligation for a single customer credit-transfer instruction, for the exact interbank settlement amount and exact source and destination customer-account addresses represented by the Action.",
    "transaction_count": 1,
    "endpoint_scope": "domestic_canadian",
    "payment_rail": "Payments_Canada_Lynx",
    "not_a_new_Action_field": "payment_rail_is_fixed_schema_meaning_not_an_instance_selector"
  },
  "external_profile": {
    "authority": "Payments Canada / Canadian Payments Association",
    "collection": "Lynx_Final_CoreMessages_UG2026",
    "usage_guideline": "Lynx_FIToFICustomerCreditTransferV08_pacs.008.001.08",
    "iso_message": "pacs.008.001.08",
    "business_service": "paymentsca.lynx.04",
    "document_date": "2026-03-23",
    "release": "November 2026"
  },
  "external_source_scope": {
    "mode": "explicit_owner_restatement_of_bounded_responsibilities_not_wholesale_message_conformance",
    "selected_responsibilities": [
      "bounded_intended_effect_and_completion_proposition",
      "fixed_CAD_amount_meaning_scale_and_limits",
      "selected_customer_account_and_CACPA_addressing_branch",
      "fixed_Adapter_field_mapping_and_charge_constraints"
    ],
    "fixed_predicate_inputs": "this_descriptor_rules_and_exactly_selected_XML_Unicode_and_canonical_contract_definitions",
    "ISO_4217_role": "historical_source_and_separate_external_compatibility_or_execution_validation_not_a_live_input_to_the_fixed_Action_predicate",
    "ISO_20022_base_role": "message_context_and_separate_full_message_implementation_or_validation_not_an_additional_input_to_the_completely_restated_Action_predicate",
    "latest_standard_or_live_table_substitution": "forbidden_for_Action_admission_or_meaning",
    "uncovered_predicate_affecting_rule": "must_be_expressly_restated_or_selected_in_an_appropriately_identified_schema_before_support_is_claimed",
    "companion_document_role": "informative_no_override_or_hidden_normative_rule",
    "current_production_applicability": "not_established_by_this_schema",
    "full_Lynx_or_ISO_message_conformance": "not_established_by_Action_schema_admission"
  },
  "completion": {
    "proposition": "The authoritative Lynx execution domain establishes that the exact CAD Lynx Payment Obligation represented by the Action was Settled between the sending and receiving Lynx participants through entries to their Lynx accounts.",
    "effect": "exact_cad_lynx_payment_obligation_settled_between_sending_and_receiving_participants_through_entries_to_their_lynx_accounts",
    "scope": "participant_level_lynx_interbank_settlement",
    "evidence_sufficiency": "owned_by_separate_authoritative_execution_and_verification_contracts_not_defined_by_this_schema",
    "not_established": [
      "source_customer_debit",
      "beneficiary_account_credit",
      "guaranteed_beneficiary_net_credit",
      "complete_end_to_end_customer_payment",
      "message_submission",
      "swift_acceptance",
      "queue_admission",
      "upm_or_lsm_processing_alone"
    ]
  },
  "fixed_semantics": {
    "transaction_count": 1,
    "endpoint_scope": "domestic_canadian",
    "currency": "CAD",
    "minor_unit_scale": 2,
    "one_amount_minor_unit": "exactly_CAD_0.01",
    "clearing_system": "CACPA",
    "account_identification_branch": "AccountIdentification4Choice/Other/Id",
    "instructed_amount": "equals_amount_minor_divided_by_100_CAD_exactly",
    "interbank_settlement_amount": "equals_amount_minor_divided_by_100_CAD_exactly",
    "instructed_equals_interbank_settlement_amount": true,
    "currency_conversion": "forbidden",
    "charge_bearer": "DEBT",
    "charge_bearer_instance_selector": "absent",
    "charges_information": "absent",
    "exchange_rate": "absent",
    "beneficiary_net_credit": "not_guaranteed",
    "amount_never_means": "beneficiary_net_credit"
  },
  "semantic_map": {
    "type": "map",
    "required_members": [
      "amount_minor",
      "source_account",
      "destination_account"
    ],
    "absent_member": "reject",
    "null_member": "reject",
    "unknown_members": "reject",
    "defaults": "none",
    "member_presentation_order": "not_semantic_canonical_native_CBOR_order_still_required_on_wire",
    "coercion": "none"
  },
  "account_address_v1": {
    "type": "map",
    "required_members": [
      "servicing_agent_canadian_sort_code",
      "account_id"
    ],
    "absent_member": "reject",
    "null_member": "reject",
    "unknown_members": "reject",
    "defaults": "none",
    "servicing_agent_canadian_sort_code": {
      "type": "tstr",
      "length": 9,
      "length_unit": "ASCII_characters",
      "pattern": "0[0-9]{8}",
      "pattern_match": "entire_string_no_unmatched_prefix_or_suffix",
      "character_set": "ASCII_digits_U+0030_through_U+0039",
      "parts": [
        "leading_zero",
        "three_digit_institution_number",
        "five_digit_transit_or_branch_routing_number"
      ],
      "leading_zero": "preserve",
      "normalization": "identity",
      "equality": "exact_Unicode_scalar_sequence",
      "spaces": "reject",
      "hyphens": "reject",
      "non_digits": "reject",
      "numeric_representation_or_conversion": "reject",
      "trimming": "none",
      "padding": "none"
    },
    "account_id": {
      "type": "tstr",
      "minimum_length": 1,
      "maximum_length": 34,
      "length_unit": "Unicode_scalars_equivalently_XML_characters_after_repertoire_validation",
      "not_length_units": [
        "UTF8_octets",
        "UTF16_code_units",
        "grapheme_clusters"
      ],
      "scalar_definition": "U+0000_through_U+D7FF_or_U+E000_through_U+10FFFF",
      "UTF8_rule": "RFC_3629_scalar_value_UTF8_reject_ill_formed_input",
      "xml_character_model": "XML_1.0_Fifth_Edition_26_November_2008_Char_production",
      "xml_Char_ranges": [
        "U+0009",
        "U+000A",
        "U+000D",
        "U+0020..U+D7FF",
        "U+E000..U+FFFD",
        "U+10000..U+10FFFF"
      ],
      "unicode_version": "6.2.0",
      "unicode_assignment_source": "Unicode_6.2.0_UnicodeData.txt_interpreted_under_UAX44_revision_10",
      "unicode_assignment_test": "General_Category_not_equal_Cn",
      "admitted_repertoire": "intersection_of_the_scalar_set_XML_Char_and_Unicode_6.2.0_assignment_test",
      "supplementary_scalar_count": 1,
      "private_use": "no_additional_Co_exclusion_beyond_the_stated_predicates",
      "profile_path": "AccountIdentification4Choice/Other/Id",
      "normalization": "input_must_already_equal_its_NFC_under_normalization_basis",
      "non_nfc": "reject_original_do_not_normalize_into_admission",
      "equality": "exact_Unicode_scalar_sequence",
      "case_folding": "none",
      "trimming": "none",
      "padding": "none",
      "whitespace_normalization": "none",
      "punctuation_rewriting": "none",
      "numeric_conversion": "none",
      "leading_zero_removal": "none",
      "alias_resolution": "none",
      "provider_normalization": "none"
    },
    "semantics": "regime_qualified_Lynx_CACPA_servicing_agent_plus_Other_Id_customer_account_address",
    "not_denoted": [
      "permanent_account_object_identity",
      "generic_AccountReference",
      "deployment_local_namespace"
    ],
    "existence_or_authorization": "not_established_by_satisfying_the_lexical_schema"
  },
  "normalization_basis": {
    "form": "NFC",
    "version": "Unicode_6.2.0",
    "formal_core": {
      "edition": "The_Unicode_Standard_6.2_Core_Specification_Chapter_3",
      "responsibilities": [
        "necessary_scalar_and_encoding_definitions_including_sections_3.8_and_3.9",
        "canonical_decomposition_in_section_3.7",
        "canonical_ordering_and_composition_in_section_3.11",
        "arithmetic_Hangul_decomposition_and_composition_in_section_3.12"
      ]
    },
    "annex": {
      "edition": "Unicode_6.2.0_UAX15_revision_37",
      "responsibilities": "applicable_normalization_definition_references_version_conformance_and_exclusion_rules",
      "formal_definition_priority": "Chapter_3_is_the_formal_definition_referenced_by_the_selected_annex_not_a_competing_algorithm"
    },
    "UnicodeData": {
      "edition": "Unicode_6.2.0_UnicodeData.txt",
      "interpretation": "Unicode_6.2.0_UAX44_revision_10_relevant_ranges_fields_defaults_and_properties",
      "needed_properties": [
        "General_Category",
        "Canonical_Combining_Class",
        "canonical_Decomposition_Mapping"
      ],
      "range_records": "expand_matching_First_Last_records_under_the_selected_UAX44_rules",
      "unlisted_General_Category": "Cn",
      "unlisted_Canonical_Combining_Class": 0,
      "default_Decomposition_Mapping": "identity",
      "compatibility_tagged_mapping": "not_used_as_a_canonical_decomposition",
      "corrected_version": "use_the_selected_6.2.0_mappings_not_historical_erroneous_mappings"
    },
    "CompositionExclusions": {
      "edition": "Unicode_6.2.0_CompositionExclusions.txt",
      "role": "normative_non_derived_composition_exclusions",
      "full_exclusion_derivation": "listed_exclusions_union_singleton_decompositions_union_non_starter_decompositions_under_selected_Chapter_3_and_UnicodeData"
    },
    "NormalizationCorrections": {
      "edition": "Unicode_6.2.0_NormalizationCorrections.txt",
      "role": "normative_version_and_correction_constraint",
      "application": "do_not_restore_older_erroneous_mappings_or_apply_corrections_twice_to_the_corrected_6.2.0_table",
      "older_version_reconstruction": "not_required"
    },
    "definition_of_NFC": "canonical_composition_of_the_canonically_ordered_full_canonical_decomposition_using_the_selected_rules_and_data",
    "implementation_strategy": "any_strategy_producing_the_selected_predicate_on_the_admitted_domain",
    "newer_library": "not_an_edition_selector_must_implement_the_selected_predicate",
    "finite_witness_agreement": "not_a_definition_or_general_equivalence_proof",
    "DerivedNormalizationProps": {
      "edition_if_used": "Unicode_6.2.0_DerivedNormalizationProps.txt",
      "role": "optional_derived_implementation_or_verification_table_not_a_required_physical_definition_input",
      "authority": "must_agree_with_the_selected_derivational_contract_not_a_competing_definition",
      "quick_check": "not_required_to_define_this_predicate"
    },
    "NormalizationTest_role": "separate_implementation_conformance_test_obligation_not_a_mathematical_predicate_input",
    "component_list_page_role": "provenance_only",
    "not_selected_responsibilities": [
      "NFKC_or_NFKD_admission",
      "case_folding",
      "collation",
      "grapheme_segmentation",
      "Hangul_name_generation",
      "general_Hangul_syllable_type_property",
      "stream_safe_insertion",
      "stabilized_string_transformation"
    ],
    "missing_required_definition": "no_supported_interpretation_by_default_or_heuristic",
    "T_carrier": "not_redefined_no_NFC_or_Unicode_6.2.0_assignment_filter_added",
    "opaque_owned_octets": "not_interpreted_by_this_schema"
  },
  "fields": {
    "amount_minor": {
      "type": "uint",
      "required": true,
      "null": "reject",
      "minimum": 1,
      "maximum": 99999999999999,
      "forbidden_values_or_representations": [
        "zero",
        "negative_integer",
        "float",
        "decimal_text",
        "Boolean",
        "value_above_maximum"
      ],
      "meaning": "CAD_interbank_settlement_amount_in_cents",
      "currency": "CAD",
      "scale": 2,
      "normalization": "identity",
      "equality": "mathematical_integer"
    },
    "source_account": {
      "type": "account_address_v1",
      "required": true,
      "null": "reject",
      "servicing_agent_role": "DebtorAgent",
      "servicing_agent_mapping": "DebtorAgent_CACPA_clearing_system_member_identification",
      "customer_account_role": "DebtorAccount",
      "customer_account_mapping": "DebtorAccount/Identification/Other/Id"
    },
    "destination_account": {
      "type": "account_address_v1",
      "required": true,
      "null": "reject",
      "servicing_agent_role": "CreditorAgent",
      "servicing_agent_mapping": "CreditorAgent_CACPA_clearing_system_member_identification",
      "customer_account_role": "CreditorAccount",
      "customer_account_mapping": "CreditorAccount/Identification/Other/Id"
    }
  },
  "cross_field_rules": [
    "source_and_destination_addresses_are_independent",
    "same_account_id_under_different_Canadian_sort_codes_denotes_different_addresses",
    "no_additional_source_destination_inequality_test_is_introduced",
    "fixed_Adapter_mappings_do_not_create_additional_Action_fields"
  ],
  "semantic_equality": {
    "member_order": "not_semantic",
    "amount": "same_mathematical_integer",
    "source_address": "same_source_sort_code_and_same_source_account_id_by_exact_scalar_sequence",
    "destination_address": "same_destination_sort_code_and_same_destination_account_id_by_exact_scalar_sequence",
    "source_destination_roles": "not_interchangeable",
    "account_text_equivalence": "no_normalization_trimming_case_folding_punctuation_or_leading_zero_aliases",
    "scope": "within_the_same_independently_selected_schema_and_canonical_profile_context",
    "digest_equality": "not_a_redefinition_of_VE001_semantic_or_occurrence_identity"
  },
  "unsupported_address_alternatives": [
    "IBAN",
    "proxy",
    "BICFI_agent_identification",
    "LEI_agent_identification",
    "name_address_agent_identification",
    "SchemeName",
    "Issuer",
    "account_currency_alternatives",
    "non_CAD",
    "open_ended_account_addressing_unions"
  ],
  "forbidden_additional_semantic_members": [
    "currency",
    "domain_id",
    "operation",
    "local_instrument",
    "settlement_date",
    "charge_bearer",
    "charges",
    "payment_rail",
    "beneficiary",
    "transfer_reference"
  ],
  "execution_and_evidence_boundary": {
    "nonsemantic_responsibilities": [
      "execution_authorization",
      "Execution_Rights",
      "InterbankSettlementDate",
      "LocalInstrument",
      "UPM_or_LSM_choice",
      "runtime_routing_other_than_the_fixed_semantic_account_address",
      "intermediary_and_reimbursement_agents",
      "priority",
      "transport",
      "message_identifiers",
      "timestamps",
      "UETR",
      "correlation_identifiers",
      "processing_date",
      "evidence_identifiers",
      "result_observation",
      "Event_creation",
      "Lifecycle_state",
      "Receipt_construction",
      "retry_or_idempotency",
      "uncertain_outcome_resolution"
    ],
    "settlement_date": "Adapter_supplies_current_valid_Lynx_settlement_processing_date_as_execution_material",
    "time_constraints": "no_actor_selected_semantic_time_constraint_in_this_schema",
    "LocalInstrument": "no_actor_selected_urgency_priority_UPM_LSM_or_queueing_strategy",
    "mechanism_selection": "Policy_and_Adapter_may_select_a_valid_Lynx_mechanism_satisfying_the_same_completion_proposition",
    "RCM": "not_admitted_where_inapplicable",
    "external_message_contract": "not_a_complete_pacs.008_serialization_or_message_validation_specification",
    "full_message_claim_requires": [
      "exact_applicable_base_schema",
      "necessary_message_definition_and_usage_rules",
      "mandatory_business_application_header_artifacts",
      "operative_code_lists",
      "applicable_Lynx_restrictions",
      "execution_time_obligations"
    ],
    "instance_values": "not_inserted_into_F_or_S_as_execution_metadata",
    "authorization_execution_or_outcome": "not_established_by_representation_validity_or_digest_equality"
  },
  "canonical_contract_constraints": {
    "ownership": "compatibility_constraints_on_the_independently_selected_canonical_profile_not_a_schema_override_of_that_owner",
    "core_semantics": "exact_selected_Approved_VE001_v0.2",
    "encoding_owner": "exact_selected_Accepted_ADR_ENC_001_VE_CBOR_1_v0.1",
    "base_encoding": "RFC_8949_core_deterministic_CBOR_under_the_selected_VE_CBOR_1_restrictions",
    "text_encoding": "RFC_3629_scalar_value_UTF8",
    "definite_length_only": true,
    "shortest_integer_and_length_arguments": true,
    "map_keys": "native_CBOR_text_strings",
    "map_key_order": "unsigned_bytewise_lexicographic_order_of_deterministic_CBOR_encoded_keys",
    "duplicate_keys": "reject_before_information_loss",
    "floating_point": "forbidden",
    "semantic_tags": "forbidden_for_this_selected_contract",
    "wire_input": "one_complete_canonical_data_item_reject_noncanonical_original_instead_of_reencoding_and_accepting_it",
    "native_text": "valid_UTF8_and_already_NFC_under_the_selected_bounded_basis",
    "F_representation": "native_CBOR_map_of_exactly_the_schema_semantic_fields_not_Event_T_O_or_L_carriers",
    "canonical_Action": {
      "top_level_required_members": [
        "action_digest",
        "instance",
        "semantic"
      ],
      "instance_required_members": [
        "action_id"
      ],
      "semantic_required_members": [
        "fields",
        "schema_digest"
      ],
      "extra_members": "reject_at_each_closed_level",
      "action_id": "32_opaque_octets_as_native_CBOR_bstr_owned_by_canonical_profile_not_content_derived_by_this_schema",
      "schema_digest": "32_raw_SHA256_output_octets_as_native_CBOR_bstr",
      "action_digest": "32_raw_SHA256_output_octets_as_native_CBOR_bstr"
    },
    "digest_definition": {
      "algorithm": "SHA-256",
      "edition": "FIPS_PUB_180-4_August_2015",
      "responsibility": "SHA256_algorithm_and_its_operative_definition_dependencies_not_a_federal_validation_claim",
      "input_domain": "0 <= octet_length < 2^61_for_each_actual_hash_input",
      "schema_frame": "[VE-ACTION-SCHEMA_as_tstr,1_as_uint,S_as_data_item]",
      "content_frame": "[VE-ACTION-CONTENT_as_tstr,1_as_uint,schema_digest_as_bstr,F_as_map]",
      "schema_digest": "SHA256_of_exact_canonical_schema_frame_octets",
      "action_digest": "SHA256_of_exact_canonical_content_frame_octets",
      "output": "32_raw_output_octets_no_text_encoding_suite_prefix_or_tag",
      "frame_exclusions": [
        "action_id",
        "definition_bodies",
        "package_Materials",
        "execution_or_transport_metadata"
      ],
      "out_of_domain": "no_support_claim_no_truncation_length_wrap_chunk_hash_substitute_or_implementation_extension",
      "O_carrier": "no_global_size_restriction_introduced",
      "descriptor_or_other_schema_domain": "must_be_established_for_the_exact_selected_definition_not_inferred_from_finite_witnesses"
    },
    "mismatch": "selected_canonical_profile_must_satisfy_these_constraints_no_precedence_override_or_fallback",
    "exact_publication_binding": "independently_selected_by_governing_context_not_chosen_by_sender_or_inferred_from_instance_values",
    "historical_aliasing": "no_cross_profile_equality_or_old_selector_retargeting_from_equal_raw_octets"
  },
  "descriptor_notation": {
    "scope": "one_fixed_logical_descriptor_not_a_generic_schema_language_or_unrestricted_JSON_input",
    "object": "exact_listed_native_CBOR_map_with_text_keys",
    "array": "definite_length_native_CBOR_array_in_listed_order_not_Event_L",
    "string": "exact_literal_native_CBOR_text_not_T_O_or_byte_string",
    "nonnegative_integer": "that_mathematical_native_CBOR_unsigned_integer_no_numeric_coercion",
    "Boolean": "native_CBOR_Boolean_not_integer_or_text",
    "unsupported_notation_value": "reject",
    "object_presentation_order": "not_identity_use_selected_canonical_key_order",
    "array_order": "part_of_the_fixed_descriptor_data_item",
    "duplicates_missing_extra_or_substituted_values": "reject",
    "defaults": "none",
    "encoding": "the_selected_canonical_contract_constraints",
    "rendered_bytes_examples_or_digest_outputs": "derived_evidence_not_alternative_definitions_of_S"
  },
  "defaults": "none",
  "unknown_fields": "reject",
  "normalized_members": [
    "amount_minor",
    "source_account",
    "destination_account"
  ]
}
```

### 7.3 Consistency and change discipline

Every schema rule capable of changing admitted semantic content or normalized representation MUST be committed by S. Its named operative editions are bound to exact bodies by the selected Source Annex; a matching edition label is not authority for a body substitution.

Physical PDF/body hashes are not inserted as new semantic fields merely because their material is carried. A new publication pin does not repair a missing semantic commitment.

Any discovered contradiction between prose, selected canonical constraints and this exact literal is a publication/content defect. Implementations MUST NOT resolve it by heuristic precedence, normalization, changing S to match an output or silently adding a predicate. The responsible owner must resolve it explicitly under the content/versioning rules before support is claimed.

A later content change requires a new version and explicit disposition; the approved local baseline MUST NOT be silently overwritten. Actual publication must retain this literal immutably or identify an exactly bound normative annex. A mutable local path is not that binding.

## 8. Execution-only responsibilities and ISO 20022 boundary

InterbankSettlementDate is execution-derived; the Adapter supplies a current valid Lynx settlement-processing date. No actor-selected semantic time constraint is part of this schema. Legitimate changes of execution day do not change the fixed Action content.

The Action requests no urgency, priority, UPM/LSM mechanism or queueing strategy. Policy/Adapter may select a valid Lynx mechanism satisfying the same proposition; RCM is not admitted where inapplicable. Such valid execution choices do not change this Action's semantic content.

Runtime routing beyond the fixed semantic address, intermediary/reimbursement agents, priority, transport, message IDs, timestamps, UETR, correlation/processing/evidence identifiers and result observation remain execution/evidence material, not added F fields.

pacs.008.001.08 is the exact selected profile context, not by itself a complete base-artifact/code-list selection. No extra base XSD/MDR/code-set publication is an input to recovering/validating this completely restated bounded Action value.

An Adapter claiming actual Lynx-message construction/validation MUST separately select the exact applicable base schema, necessary message-definition/usage rules, mandatory business-application-header artifacts, operative code lists and Lynx restrictions, and meet execution-time obligations. An identifier or XSD alone is insufficient.

Unselected ISO 9362/BIC, ISO 3166/country or unrelated branch rules do not enter this Action predicate merely by sharing E03's body. They may remain necessary for a different actual message field/claim. This schema grants no external execution-validation exemption.

## 9. Validation, equality and support boundaries

A supported interpretation requires the exact independently selected schema/canonical pair, expected complete S and necessary definitions. An implementation MUST verify the closed Action/profile shapes, the exact F grammar/predicate, digest representations/constructions and occurrence-ID representation under the canonical owner.

A logical map's presentation order is irrelevant to semantic content. No other text/integer/address equivalence is introduced. Within the selected pair, amounts compare as mathematical integers and endpoint strings as exact scalar sequences in their source/destination roles. Wire originals still require canonical encoding; reencoding a bad original does not make it admissible.

The schema does not redefine VE-001 identity/equality or the canonical owner's profile-level comparison semantics. Missing required definitions block affected support rather than supplying a fabricated rule, failed external assessment or proof of execution.

An authoritative-execution claim requires its own established owner contracts/evidence. Representation validity and exact digest comparison MUST NOT be promoted into authorization, account facts, legitimacy or settlement truth.

## 10. Interpretation material and source-role closure

The exact required bodies and their operative roles are in the common Source Annex. Their bodies remain interpretation material, not Action fields. Package Materials, ActionInline.definitions and each OwnedOctets.definitions stay separate, selected role closures; one does not imply a copy of all the others.

Repeated selected keys are visited once under the responsible closure rules; a conflicting selection MUST NOT be resolved by order. Informative sources are not silently made operative, and an operative source is not omitted merely because unavailable.

Exact fingerprints do not establish publisher authenticity, authorized adoption, complete dependency closure or an authoritative decision. Source bindings and expected keys must be independently established. No current-source or host-default fallback is permitted.

## 11. Informative domain argument and evidence status

The exact literal in §7 has 660 data-item nodes and 15,482 ASCII string characters including keys. Under its native mapping, the conservative structural SF upper bound is 21,441 octets. For the declared field grammar, F <= 450 and AF <= 504 octets. These fit the selected SHA-256 domain.

Those bounds are not emitted byte counts, vectors, digest values, encoder validation or independent conformance results. Changes to the literal, field grammar or framing require a renewed argument.

Old rendered descriptor blocks, examples, digest outputs, interoperability statements, audit “Pass” and reviewer expectations are not successor definitions or evidence. No agreement/disagreement finding about those old renderings is made.

The Founder Draft-target, expected-source and document metadata decisions are recorded. This is an incomplete Draft proposal; its identifiers and repository location are not independently adopted publication/context bindings. The bounded UTF-8/NFC finding and RFC-014/ADR-014's additive design/classification are adopted/accepted within their stated scope. Remaining claim-specific governance/material roles, actual successor/context bindings and implementation/interoperability evidence are still separate obligations. Identifier/path observations apply only to their checked base; they are not a reservation or an independently selected final publication/context binding.

