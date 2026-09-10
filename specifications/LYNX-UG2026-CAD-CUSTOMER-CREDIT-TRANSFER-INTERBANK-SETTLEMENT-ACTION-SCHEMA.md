---
id: LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA
title: Lynx UG2026 CAD Customer Credit Transfer Interbank Settlement Action Schema
version: "0.1"
status: Draft
document_type: Specification
category: Action Schema
author: Verified Execution Editorial Board
created: 2026-09-08
updated: 2026-09-08
depends_on:
  - VE-001
  - VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE
  - ADR-ENC-001
related_documents:
  - RS-002
  - RS-003
  - RS-ACT-001-VE001-PORTABILITY-INTEROPERABILITY
  - GAP-ANALYSIS-RS-ACT-001
supersedes: null
superseded_by: null
---

# Lynx UG2026 CAD Customer Credit Transfer Interbank Settlement Action Schema

## 1. Status and authority boundary

This is a subordinate normative **Draft v0.1** Action schema under the
Approved VE-001 Action Specification and the Draft VE-001 Action Canonical
Representation and Content Identity Profile. Its normative language applies
only to implementations claiming conformance with this Draft. It is not
Approved, allocates no `VE-xxx` identifier, and creates no kernel primitive,
generic Action-schema layer, Lynx execution profile, `pacs.008` serialization
specification, or `PaymentRail` primitive.

```text
INTENT != AUTHORITY != EXECUTION != EVIDENCE
```

This schema owns the exact intended Lynx interbank-settlement instruction,
its semantic fields, account-address and amount semantics, schema-fixed charge
semantics, successful-completion meaning, and canonical descriptor. It does
not own execution authorization, Execution Rights, runtime routing,
`InterbankSettlementDate`, `LocalInstrument`, UPM/LSM choice, intermediaries,
message identifiers, timestamps, UETR or correlation, transport, result
observation, Event creation, Lifecycle state, Receipt construction,
retry/idempotency, or uncertain-outcome resolution.

## 2. Exact Action and completion meaning

The Action means:

> Request settlement through Payments Canada Lynx of one domestic
> Canadian-dollar interbank payment obligation for a single customer
> credit-transfer instruction, for the exact interbank settlement amount and
> exact source and destination customer-account addresses represented by the
> Action.

The requested effect is participant-level Lynx interbank settlement. The
bounded successful-fulfillment proposition is:

> The authoritative Lynx execution domain establishes that the exact CAD Lynx
> Payment Obligation represented by the Action was Settled between the sending
> and receiving Lynx participants through entries to their Lynx accounts.

This completion proposition does not assert that a source-customer debit
occurred, a beneficiary account was credited, the creditor received the full
amount, the end-to-end customer payment completed, or that message submission,
SWIFT acceptance, queue admission, or UPM/LSM processing alone fulfilled the
Action. The schema defines what successful fulfillment means; it does not
define what evidence is sufficient to prove fulfillment.

## 3. Pinned external semantic source

This version incorporates the following exact Payments Canada profile:

| Property | Pinned value |
|---|---|
| Authority | Payments Canada / Canadian Payments Association |
| Collection | `Lynx_Final_CoreMessages_UG2026` |
| Usage guideline | `Lynx_FIToFICustomerCreditTransferV08_pacs.008.001.08` |
| ISO 20022 message | `pacs.008.001.08` |
| Business service | `paymentsca.lynx.04` |
| Document date | 23 March 2026 |
| Release | Published UG2026 target for November 2026 |

As of 8 September 2026, this is published future-release material and is not
the production-effective Lynx profile. The March 2026 Companion v1.5 is
informative support. The pinned usage guideline prevails if the companion
conflicts with it.

The usage-guideline PDF SHA-256
`79845052b61789f29758f0671b0fba5923f4260dd046c738b3c7f5041a3bdb7c`
and companion PDF SHA-256
`b0d21d4225d8ce18bf2fe098bae9169bbdcb8a2b0da0e239848d7b68feca5f66`
are provenance only. They are not descriptor members because PDF serialization
bytes are not Action semantics. The exact authority, collection, guideline,
date, release, message and business-service identifiers disambiguate the
edition, and this schema restates every imported rule that affects admission,
normalization, meaning, or completion. No generic external-standard reference
primitive is introduced.

## 4. Exact semantic field set

The normalized semantic map contains exactly three top-level members:

```text
{
  amount_minor,
  source_account: {
    servicing_agent_canadian_sort_code,
    account_id
  },
  destination_account: {
    servicing_agent_canadian_sort_code,
    account_id
  }
}
```

All three top-level members and both members of each account map are required.
Absence and `null` are rejected. There are no defaults. Unknown members are
rejected at both levels. No `currency`, `domain_id`, `operation`,
`local_instrument`, `settlement_date`, `charge_bearer`, `charges`,
`payment_rail`, `beneficiary`, or `transfer_reference` member exists.

### 4.1 `amount_minor`

`amount_minor` is the CAD `InterbankSettlementAmount` of the requested Lynx
Payment Obligation, expressed in Canadian cents. It MUST be an unsigned integer
from `1` through `99999999999999` inclusive. One unit is exactly CAD 0.01;
the scale is exactly two decimal places. Zero, negative values, floating point,
decimal text, and values above the maximum are rejected.

The UG2026 `CBPR_Amount__1` restriction fixes CAD and `totalDigits = 14`; its
currency-minor-unit rule limits CAD to two fractional digits. The maximum is
therefore CAD 999,999,999,999.99, or `99999999999999` cents.

CAD and scale two are fixed by schema identity; currency is not an Action
field. A non-CAD instruction belongs to a different schema identity.

For every admitted Action, the Adapter MUST construct:

```text
InstructedAmount = amount_minor / 100 CAD
InterbankSettlementAmount = amount_minor / 100 CAD
```

Thus `InstructedAmount = InterbankSettlementAmount`. This deterministic mapping
is not a second Action field, and no currency conversion or exchange rate is
permitted.

### 4.2 Schema-fixed charge semantics

The admitted subset fixes:

```text
ChargeBearer = DEBT
ChargesInformation = absent
InstructedAmount = InterbankSettlementAmount
ExchangeRate = absent
```

`ChargeBearer` is not an Action selector. These rules close the Lynx message
subset used to realize the requested participant-level settlement. They do not
guarantee that the creditor customer's eventual net account credit equals
`amount_minor`. Receiving-institution service or receipt charges are outside
the participant-level Lynx completion proposition, and `amount_minor` never
means beneficiary net credit.

## 5. Regime-qualified account addresses

Both `source_account` and `destination_account` are closed maps with the same
schema-local form:

```text
{
  servicing_agent_canadian_sort_code,
  account_id
}
```

The complete pair is a regime-qualified customer-account address under the
schema-fixed Lynx/CACPA addressing regime. It is not permanent account-object
identity, a generic `AccountReference`, or a deployment-local namespace.

### 5.1 `servicing_agent_canadian_sort_code`

This member is a text string containing exactly nine ASCII digits matching
`0[0-9]{8}`: leading zero, three-digit institution number, then five-digit
transit/branch routing number. The leading zero is preserved. It is text,
never an integer. Spaces, hyphens, trimming, padding, and non-digits are not
permitted. Equality is exact lexical equality. `CACPA` clearing-system
semantics are fixed by schema identity and are not repeated in each Action.

### 5.2 `account_id`

This member is the `Id` value in the selected
`AccountIdentification4Choice/Other/Id` branch. It MUST be valid UTF-8 text of
1 through 34 XML characters. Each character MUST be one Unicode scalar value
whose code point both:

1. matches the XML 1.0 Fifth Edition `Char` production
   (`#x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] |
   [#x10000-#x10FFFF]`); and
2. is assigned in Unicode 6.2.0, where assigned means that its Unicode 6.2.0
   Unicode Character Database `General_Category` is not `Cn`.

The assignment source is the versioned Unicode Character Database 6.2.0
`UnicodeData.txt`, interpreted according to UAX #44 for Unicode 6.2.0.

This is a deliberate schema-local intersection of the pinned Lynx Unicode 6.2
support boundary, XML representability, and `Max34Text`. It may be narrower
than values accepted by another Lynx profile. The length is the number of XML
characters/code points after repertoire validation. Because every admitted
character is a Unicode scalar value, this is also the Unicode-scalar count; it
is not a UTF-8 byte count or UTF-16 code-unit count. A permitted supplementary-
plane character counts as one character.

The value MUST already be NFC. Non-NFC input is rejected rather than
normalized. NFC is evaluated over the Unicode 6.2.0-assigned repertoire. The
Unicode normalization-stability guarantee makes the NFC result identical in
newer conforming Unicode implementations for strings restricted to characters
assigned in Unicode 6.2.0. Equality is exact Unicode scalar-sequence equality.
No trimming, padding, case folding, whitespace normalization, punctuation
rewriting, numeric conversion, leading-zero removal, alias resolution, or
provider normalization is permitted.

Consequently, where the lexical forms satisfy the admitted character and
length rules:

```text
"0012345" != "12345"
"12-345"  != "12345"
" ABC"    != "ABC"
"ABC "    != "ABC"
```

Source and destination addresses are independent. The same `account_id` under
different Canadian Sort Codes denotes different addresses.

The Adapter maps the source sort code to the DebtorAgent CACPA clearing-system
member identification and the source `account_id` to
DebtorAccount/Identification/Other/Id. It maps the destination sort code to the
CreditorAgent CACPA clearing-system member identification and the destination
`account_id` to CreditorAccount/Identification/Other/Id. These deterministic
mappings do not add Action fields.

### 5.3 Deliberately unsupported Lynx alternatives

This schema admits only domestic Canadian endpoints, CACPA member
identification by Canadian Sort Code, `Other/Id` account identification, and
CAD. It rejects IBAN, proxy, BICFI/LEI/name-address agent identification,
`SchemeName`, `Issuer`, account-currency alternatives, non-CAD values, and
open-ended account-addressing unions. Their validity in broader Lynx or ISO
20022 contexts does not place them in this closed Action class.

## 6. Execution-only Lynx material

`InterbankSettlementDate` is execution-derived. At execution time the Adapter
supplies the current valid Lynx settlement-processing date. The same semantic
Action executed on different legitimate Lynx processing days has the same
`action_digest`, unless a separately governed actor-selected time constraint
is part of a different bounded Action.

`LocalInstrument` is also outside semantic content. This Action requests no
urgency, priority, UPM/LSM mechanism, or queueing strategy. Applicable policy
and the Adapter may select any valid Lynx mechanism that satisfies the same
completion proposition. Different valid mechanisms do not change this
Action's `action_digest`; RCM is not admitted where inapplicable.

Intermediary and reimbursement agents, routing, priority, transport, message
identifiers, timestamps, UETR, correlation identifiers, processing date, and
evidence identifiers are likewise execution or evidence material. This schema
is not a `pacs.008` serialization specification.

## 7. Exact `CanonicalSchemaDescriptor`

The following map is the complete and exact descriptor. It is one fixed
VE-CBOR-1-representable data item, not an instance of a generic schema
language. Every member name and value below is literal and normative for this
Draft.

```json
{
  "name": "ve.action.lynx-ug2026.domestic-cad-customer-credit-transfer-interbank-settlement",
  "version": 1,
  "action_class": "one_domestic_cad_customer_credit_transfer_interbank_settlement",
  "external_profile": {
    "authority": "Payments Canada / Canadian Payments Association",
    "collection": "Lynx_Final_CoreMessages_UG2026",
    "usage_guideline": "Lynx_FIToFICustomerCreditTransferV08_pacs.008.001.08",
    "iso_message": "pacs.008.001.08",
    "business_service": "paymentsca.lynx.04",
    "document_date": "2026-03-23",
    "release": "November 2026"
  },
  "completion": {
    "effect": "exact_cad_lynx_payment_obligation_settled_between_sending_and_receiving_participants_through_entries_to_their_lynx_accounts",
    "scope": "participant_level_lynx_interbank_settlement",
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
    "clearing_system": "CACPA",
    "account_identification_branch": "AccountIdentification4Choice/Other/Id",
    "instructed_amount": "equals_amount_minor_divided_by_100_cad",
    "interbank_settlement_amount": "equals_amount_minor_divided_by_100_cad",
    "charge_bearer": "DEBT",
    "charges_information": "absent",
    "exchange_rate": "absent",
    "beneficiary_net_credit": "not_guaranteed"
  },
  "account_address_v1": {
    "type": "map",
    "required_members": [
      "servicing_agent_canadian_sort_code",
      "account_id"
    ],
    "unknown_members": "reject",
    "servicing_agent_canadian_sort_code": {
      "type": "tstr",
      "length": 9,
      "pattern": "0[0-9]{8}",
      "character_set": "ASCII_digits",
      "leading_zero": "preserve",
      "normalization": "identity",
      "equality": "exact_unicode_scalar_sequence",
      "spaces": "reject",
      "hyphens": "reject",
      "trimming": "none",
      "padding": "none"
    },
    "account_id": {
      "type": "tstr",
      "minimum_length": 1,
      "maximum_length": 34,
      "length_unit": "xml_characters_equivalently_unicode_scalar_values_after_repertoire_validation",
      "xml_character_model": "XML_1_0_Fifth_Edition_Char_production",
      "unicode_version": "6.2.0",
      "unicode_assignment_source": "Unicode_Character_Database_6_2_0_UnicodeData_txt",
      "unicode_assignment_test": "UCD_6_2_0_General_Category_not_Cn",
      "admitted_repertoire": "intersection_of_XML_1_0_Fifth_Edition_Char_and_Unicode_6_2_0_assigned_scalars",
      "profile_path": "AccountIdentification4Choice/Other/Id",
      "normalization": "already_NFC_required_over_Unicode_6_2_0_assigned_repertoire",
      "non_nfc": "reject",
      "equality": "exact_unicode_scalar_sequence",
      "case_folding": "none",
      "trimming": "none",
      "padding": "none",
      "punctuation_rewriting": "none",
      "numeric_conversion": "none",
      "leading_zero_removal": "none",
      "alias_resolution": "none"
    },
    "semantics": "lynx_cacpa_servicing_agent_plus_other_id_address_not_permanent_account_identity"
  },
  "fields": {
    "amount_minor": {
      "type": "uint",
      "required": true,
      "null": "reject",
      "minimum": 1,
      "maximum": 99999999999999,
      "meaning": "cad_interbank_settlement_amount_in_cents",
      "currency": "CAD",
      "scale": 2,
      "normalization": "identity",
      "equality": "integer"
    },
    "source_account": {
      "type": "account_address_v1",
      "required": true,
      "null": "reject",
      "servicing_agent_role": "DebtorAgent",
      "customer_account_role": "DebtorAccount"
    },
    "destination_account": {
      "type": "account_address_v1",
      "required": true,
      "null": "reject",
      "servicing_agent_role": "CreditorAgent",
      "customer_account_role": "CreditorAccount"
    }
  },
  "cross_field_rules": [
    "source_and_destination_addresses_are_independent",
    "same_account_id_under_different_canadian_sort_codes_denotes_different_addresses"
  ],
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
  "defaults": "none",
  "unknown_fields": "reject",
  "normalized_members": [
    "amount_minor",
    "source_account",
    "destination_account"
  ]
}
```

Canonical descriptor bytes `S` under VE-CBOR-1:

```text
ad646e616d65785076652e616374696f6e2e6c796e782d7567323032362e646f6d65737469632d6361642d637573746f6d65722d6372656469742d7472616e736665722d696e74657262616e6b2d736574746c656d656e74666669656c6473a36c616d6f756e745f6d696e6f72aa646e756c6c6672656a65637464747970656475696e74657363616c6502676d6178696d756d1b00005af3107a3fff676d65616e696e6778286361645f696e74657262616e6b5f736574746c656d656e745f616d6f756e745f696e5f63656e7473676d696e696d756d016863757272656e63796343414468657175616c69747967696e7465676572687265717569726564f56d6e6f726d616c697a6174696f6e686964656e746974796e736f757263655f6163636f756e74a5646e756c6c6672656a6563746474797065726163636f756e745f616464726573735f7631687265717569726564f574736572766963696e675f6167656e745f726f6c656b446562746f724167656e7475637573746f6d65725f6163636f756e745f726f6c656d446562746f724163636f756e747364657374696e6174696f6e5f6163636f756e74a5646e756c6c6672656a6563746474797065726163636f756e745f616464726573735f7631687265717569726564f574736572766963696e675f6167656e745f726f6c656d4372656469746f724167656e7475637573746f6d65725f6163636f756e745f726f6c656f4372656469746f724163636f756e746776657273696f6e016864656661756c7473646e6f6e656a636f6d706c6574696f6ea36573636f7065782b7061727469636970616e745f6c6576656c5f6c796e785f696e74657262616e6b5f736574746c656d656e7466656666656374787b65786163745f6361645f6c796e785f7061796d656e745f6f626c69676174696f6e5f736574746c65645f6265747765656e5f73656e64696e675f616e645f726563656976696e675f7061727469636970616e74735f7468726f7567685f656e74726965735f746f5f74686569725f6c796e785f6163636f756e74736f6e6f745f65737461626c69736865648875736f757263655f637573746f6d65725f6465626974781a62656e65666963696172795f6163636f756e745f637265646974782167756172616e746565645f62656e65666963696172795f6e65745f6372656469747824636f6d706c6574655f656e645f746f5f656e645f637573746f6d65725f7061796d656e74726d6573736167655f7375626d697373696f6e7073776966745f616363657074616e63656f71756575655f61646d697373696f6e781b75706d5f6f725f6c736d5f70726f63657373696e675f616c6f6e656c616374696f6e5f636c617373783e6f6e655f646f6d65737469635f6361645f637573746f6d65725f6372656469745f7472616e736665725f696e74657262616e6b5f736574746c656d656e746e756e6b6e6f776e5f6669656c64736672656a6563746f66697865645f73656d616e74696373ac6863757272656e6379634341446d6368617267655f62656172657264444542546d65786368616e67655f7261746566616273656e746e656e64706f696e745f73636f706571646f6d65737469635f63616e616469616e6f636c656172696e675f73797374656d654341435041706d696e6f725f756e69745f7363616c650271696e73747275637465645f616d6f756e747826657175616c735f616d6f756e745f6d696e6f725f646976696465645f62795f3130305f636164717472616e73616374696f6e5f636f756e740173636861726765735f696e666f726d6174696f6e66616273656e747662656e65666963696172795f6e65745f6372656469746e6e6f745f67756172616e74656564781b696e74657262616e6b5f736574746c656d656e745f616d6f756e747826657175616c735f616d6f756e745f6d696e6f725f646976696465645f62795f3130305f636164781d6163636f756e745f6964656e74696669636174696f6e5f6272616e636878254163636f756e744964656e74696669636174696f6e3443686f6963652f4f746865722f49647065787465726e616c5f70726f66696c65a76772656c656173656d4e6f76656d626572203230323669617574686f72697479782f5061796d656e74732043616e616461202f2043616e616469616e205061796d656e7473204173736f63696174696f6e6a636f6c6c656374696f6e781e4c796e785f46696e616c5f436f72654d657373616765735f5547323032366b69736f5f6d6573736167656f706163732e3030382e3030312e30386d646f63756d656e745f646174656a323032362d30332d32336f75736167655f67756964656c696e6578344c796e785f4649546f4649437573746f6d65724372656469745472616e736665725630385f706163732e3030382e3030312e303870627573696e6573735f73657276696365727061796d656e747363612e6c796e782e30347163726f73735f6669656c645f72756c6573827830736f757263655f616e645f64657374696e6174696f6e5f6164647265737365735f6172655f696e646570656e64656e74784f73616d655f6163636f756e745f69645f756e6465725f646966666572656e745f63616e616469616e5f736f72745f636f6465735f64656e6f7465735f646966666572656e745f616464726573736573726163636f756e745f616464726573735f7631a66474797065636d61706973656d616e74696373784f6c796e785f63616370615f736572766963696e675f6167656e745f706c75735f6f746865725f69645f616464726573735f6e6f745f7065726d616e656e745f6163636f756e745f6964656e746974796a6163636f756e745f6964b464747970656474737472676e6f6e5f6e66636672656a6563746770616464696e67646e6f6e6568657175616c697479781d65786163745f756e69636f64655f7363616c61725f73657175656e6365687472696d6d696e67646e6f6e656b6c656e6774685f756e6974784d786d6c5f636861726163746572735f6571756976616c656e746c795f756e69636f64655f7363616c61725f76616c7565735f61667465725f7265706572746f6972655f76616c69646174696f6e6c636173655f666f6c64696e67646e6f6e656c70726f66696c655f7061746878254163636f756e744964656e74696669636174696f6e3443686f6963652f4f746865722f49646d6e6f726d616c697a6174696f6e783b616c72656164795f4e46435f72657175697265645f6f7665725f556e69636f64655f365f325f305f61737369676e65645f7265706572746f6972656e6d6178696d756d5f6c656e67746818226e6d696e696d756d5f6c656e677468016f756e69636f64655f76657273696f6e65362e322e3070616c6961735f7265736f6c7574696f6e646e6f6e65726e756d657269635f636f6e76657273696f6e646e6f6e657361646d69747465645f7265706572746f697265784d696e74657273656374696f6e5f6f665f584d4c5f315f305f46696674685f45646974696f6e5f436861725f616e645f556e69636f64655f365f325f305f61737369676e65645f7363616c61727373786d6c5f6368617261637465725f6d6f64656c7825584d4c5f315f305f46696674685f45646974696f6e5f436861725f70726f64756374696f6e746c656164696e675f7a65726f5f72656d6f76616c646e6f6e657570756e6374756174696f6e5f726577726974696e67646e6f6e6577756e69636f64655f61737369676e6d656e745f7465737478215543445f365f325f305f47656e6572616c5f43617465676f72795f6e6f745f436e7819756e69636f64655f61737369676e6d656e745f736f757263657830556e69636f64655f4368617261637465725f44617461626173655f365f325f305f556e69636f6465446174615f7478746f756e6b6e6f776e5f6d656d626572736672656a6563747072657175697265645f6d656d62657273827822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f64656a6163636f756e745f69647822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f6465ab64747970656474737472666c656e67746809667370616365736672656a6563746768797068656e736672656a6563746770616464696e67646e6f6e65677061747465726e69305b302d395d7b387d68657175616c697479781d65786163745f756e69636f64655f7363616c61725f73657175656e6365687472696d6d696e67646e6f6e656c6c656164696e675f7a65726f6870726573657276656d6368617261637465725f7365746c41534349495f6469676974736d6e6f726d616c697a6174696f6e686964656e74697479726e6f726d616c697a65645f6d656d62657273836c616d6f756e745f6d696e6f726e736f757263655f6163636f756e747364657374696e6174696f6e5f6163636f756e747820756e737570706f727465645f616464726573735f616c7465726e6174697665738a644942414e6570726f7879781a42494346495f6167656e745f6964656e74696669636174696f6e78184c45495f6167656e745f6964656e74696669636174696f6e78216e616d655f616464726573735f6167656e745f6964656e74696669636174696f6e6a536368656d654e616d6566497373756572781d6163636f756e745f63757272656e63795f616c7465726e617469766573676e6f6e5f43414478246f70656e5f656e6465645f6163636f756e745f61646472657373696e675f756e696f6e73
```

The VE-001 representation profile remains the sole owner of framing and
digest construction:

```text
SchemaIdentityFrame = [
  "VE-ACTION-SCHEMA",
  1,
  S
]

schema_digest = SHA-256(VE-CBOR-1(SchemaIdentityFrame))
```

Canonical `SchemaIdentityFrame` bytes:

```text
837056452d414354494f4e2d534348454d4101ad646e616d65785076652e616374696f6e2e6c796e782d7567323032362e646f6d65737469632d6361642d637573746f6d65722d6372656469742d7472616e736665722d696e74657262616e6b2d736574746c656d656e74666669656c6473a36c616d6f756e745f6d696e6f72aa646e756c6c6672656a65637464747970656475696e74657363616c6502676d6178696d756d1b00005af3107a3fff676d65616e696e6778286361645f696e74657262616e6b5f736574746c656d656e745f616d6f756e745f696e5f63656e7473676d696e696d756d016863757272656e63796343414468657175616c69747967696e7465676572687265717569726564f56d6e6f726d616c697a6174696f6e686964656e746974796e736f757263655f6163636f756e74a5646e756c6c6672656a6563746474797065726163636f756e745f616464726573735f7631687265717569726564f574736572766963696e675f6167656e745f726f6c656b446562746f724167656e7475637573746f6d65725f6163636f756e745f726f6c656d446562746f724163636f756e747364657374696e6174696f6e5f6163636f756e74a5646e756c6c6672656a6563746474797065726163636f756e745f616464726573735f7631687265717569726564f574736572766963696e675f6167656e745f726f6c656d4372656469746f724167656e7475637573746f6d65725f6163636f756e745f726f6c656f4372656469746f724163636f756e746776657273696f6e016864656661756c7473646e6f6e656a636f6d706c6574696f6ea36573636f7065782b7061727469636970616e745f6c6576656c5f6c796e785f696e74657262616e6b5f736574746c656d656e7466656666656374787b65786163745f6361645f6c796e785f7061796d656e745f6f626c69676174696f6e5f736574746c65645f6265747765656e5f73656e64696e675f616e645f726563656976696e675f7061727469636970616e74735f7468726f7567685f656e74726965735f746f5f74686569725f6c796e785f6163636f756e74736f6e6f745f65737461626c69736865648875736f757263655f637573746f6d65725f6465626974781a62656e65666963696172795f6163636f756e745f637265646974782167756172616e746565645f62656e65666963696172795f6e65745f6372656469747824636f6d706c6574655f656e645f746f5f656e645f637573746f6d65725f7061796d656e74726d6573736167655f7375626d697373696f6e7073776966745f616363657074616e63656f71756575655f61646d697373696f6e781b75706d5f6f725f6c736d5f70726f63657373696e675f616c6f6e656c616374696f6e5f636c617373783e6f6e655f646f6d65737469635f6361645f637573746f6d65725f6372656469745f7472616e736665725f696e74657262616e6b5f736574746c656d656e746e756e6b6e6f776e5f6669656c64736672656a6563746f66697865645f73656d616e74696373ac6863757272656e6379634341446d6368617267655f62656172657264444542546d65786368616e67655f7261746566616273656e746e656e64706f696e745f73636f706571646f6d65737469635f63616e616469616e6f636c656172696e675f73797374656d654341435041706d696e6f725f756e69745f7363616c650271696e73747275637465645f616d6f756e747826657175616c735f616d6f756e745f6d696e6f725f646976696465645f62795f3130305f636164717472616e73616374696f6e5f636f756e740173636861726765735f696e666f726d6174696f6e66616273656e747662656e65666963696172795f6e65745f6372656469746e6e6f745f67756172616e74656564781b696e74657262616e6b5f736574746c656d656e745f616d6f756e747826657175616c735f616d6f756e745f6d696e6f725f646976696465645f62795f3130305f636164781d6163636f756e745f6964656e74696669636174696f6e5f6272616e636878254163636f756e744964656e74696669636174696f6e3443686f6963652f4f746865722f49647065787465726e616c5f70726f66696c65a76772656c656173656d4e6f76656d626572203230323669617574686f72697479782f5061796d656e74732043616e616461202f2043616e616469616e205061796d656e7473204173736f63696174696f6e6a636f6c6c656374696f6e781e4c796e785f46696e616c5f436f72654d657373616765735f5547323032366b69736f5f6d6573736167656f706163732e3030382e3030312e30386d646f63756d656e745f646174656a323032362d30332d32336f75736167655f67756964656c696e6578344c796e785f4649546f4649437573746f6d65724372656469745472616e736665725630385f706163732e3030382e3030312e303870627573696e6573735f73657276696365727061796d656e747363612e6c796e782e30347163726f73735f6669656c645f72756c6573827830736f757263655f616e645f64657374696e6174696f6e5f6164647265737365735f6172655f696e646570656e64656e74784f73616d655f6163636f756e745f69645f756e6465725f646966666572656e745f63616e616469616e5f736f72745f636f6465735f64656e6f7465735f646966666572656e745f616464726573736573726163636f756e745f616464726573735f7631a66474797065636d61706973656d616e74696373784f6c796e785f63616370615f736572766963696e675f6167656e745f706c75735f6f746865725f69645f616464726573735f6e6f745f7065726d616e656e745f6163636f756e745f6964656e746974796a6163636f756e745f6964b464747970656474737472676e6f6e5f6e66636672656a6563746770616464696e67646e6f6e6568657175616c697479781d65786163745f756e69636f64655f7363616c61725f73657175656e6365687472696d6d696e67646e6f6e656b6c656e6774685f756e6974784d786d6c5f636861726163746572735f6571756976616c656e746c795f756e69636f64655f7363616c61725f76616c7565735f61667465725f7265706572746f6972655f76616c69646174696f6e6c636173655f666f6c64696e67646e6f6e656c70726f66696c655f7061746878254163636f756e744964656e74696669636174696f6e3443686f6963652f4f746865722f49646d6e6f726d616c697a6174696f6e783b616c72656164795f4e46435f72657175697265645f6f7665725f556e69636f64655f365f325f305f61737369676e65645f7265706572746f6972656e6d6178696d756d5f6c656e67746818226e6d696e696d756d5f6c656e677468016f756e69636f64655f76657273696f6e65362e322e3070616c6961735f7265736f6c7574696f6e646e6f6e65726e756d657269635f636f6e76657273696f6e646e6f6e657361646d69747465645f7265706572746f697265784d696e74657273656374696f6e5f6f665f584d4c5f315f305f46696674685f45646974696f6e5f436861725f616e645f556e69636f64655f365f325f305f61737369676e65645f7363616c61727373786d6c5f6368617261637465725f6d6f64656c7825584d4c5f315f305f46696674685f45646974696f6e5f436861725f70726f64756374696f6e746c656164696e675f7a65726f5f72656d6f76616c646e6f6e657570756e6374756174696f6e5f726577726974696e67646e6f6e6577756e69636f64655f61737369676e6d656e745f7465737478215543445f365f325f305f47656e6572616c5f43617465676f72795f6e6f745f436e7819756e69636f64655f61737369676e6d656e745f736f757263657830556e69636f64655f4368617261637465725f44617461626173655f365f325f305f556e69636f6465446174615f7478746f756e6b6e6f776e5f6d656d626572736672656a6563747072657175697265645f6d656d62657273827822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f64656a6163636f756e745f69647822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f6465ab64747970656474737472666c656e67746809667370616365736672656a6563746768797068656e736672656a6563746770616464696e67646e6f6e65677061747465726e69305b302d395d7b387d68657175616c697479781d65786163745f756e69636f64655f7363616c61725f73657175656e6365687472696d6d696e67646e6f6e656c6c656164696e675f7a65726f6870726573657276656d6368617261637465725f7365746c41534349495f6469676974736d6e6f726d616c697a6174696f6e686964656e74697479726e6f726d616c697a65645f6d656d62657273836c616d6f756e745f6d696e6f726e736f757263655f6163636f756e747364657374696e6174696f6e5f6163636f756e747820756e737570706f727465645f616464726573735f616c7465726e6174697665738a644942414e6570726f7879781a42494346495f6167656e745f6964656e74696669636174696f6e78184c45495f6167656e745f6964656e74696669636174696f6e78216e616d655f616464726573735f6167656e745f6964656e74696669636174696f6e6a536368656d654e616d6566497373756572781d6163636f756e745f63757272656e63795f616c7465726e617469766573676e6f6e5f43414478246f70656e5f656e6465645f6163636f756e745f61646472657373696e675f756e696f6e73
```

`schema_digest` payload:

```text
e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554
```

## 8. Normalized semantic map and positive vector P1

P1 requests CAD 10,000.00 of participant-level Lynx interbank settlement.
The addresses are structurally valid example values only.

```text
{
  "amount_minor": 1000000,
  "source_account": {
    "servicing_agent_canadian_sort_code": "000100001",
    "account_id": "0012345"
  },
  "destination_account": {
    "servicing_agent_canadian_sort_code": "000200002",
    "account_id": "VENDOR-0001"
  }
}
```

Canonical normalized-map bytes:

```text
a36c616d6f756e745f6d696e6f721a000f42406e736f757263655f6163636f756e74a26a6163636f756e745f696467303031323334357822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f6465693030303130303030317364657374696e6174696f6e5f6163636f756e74a26a6163636f756e745f69646b56454e444f522d303030317822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f646569303030323030303032
```

The exact content frame is:

```text
ActionContentFrame = [
  "VE-ACTION-CONTENT",
  1,
  h'e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554',
  normalized_semantic_map
]
```

Canonical `ActionContentFrame` bytes:

```text
847156452d414354494f4e2d434f4e54454e54015820e1bd2f7849a9d08108c620e30dede09045df6049e0909e7abaf22e6d9d372554a36c616d6f756e745f6d696e6f721a000f42406e736f757263655f6163636f756e74a26a6163636f756e745f696467303031323334357822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f6465693030303130303030317364657374696e6174696f6e5f6163636f756e74a26a6163636f756e745f69646b56454e444f522d303030317822736572766963696e675f6167656e745f63616e616469616e5f736f72745f636f646569303030323030303032
```

`action_digest` payload:

```text
5fa3775f8a288e9762e021ba8fb08302fbb3547bc15d9769c97bbcbbeb330b0c
```

Independent Python and Node implementations MUST reproduce these values
without sharing precomputed encodings.

## 9. Equivalence, divergence, and rejection vectors

### 9.1 Authorized equivalence

Only source-map member ordering is discarded before VE-CBOR-1 canonical map
ordering. Different source ordering of the same admitted map MUST reproduce P1
exactly. There is no account-address equivalence through normalization,
trimming, case folding, punctuation removal, or leading-zero removal.

### 9.2 Semantic divergence

Each valid mutation below MUST produce an `action_digest` different from P1:

| Vector | Mutation | Expected digest |
|---|---|---|
| D1 | `amount_minor = 1000001` | `3d79800893a33b823859cb1f49aa3e2aa042a72a59cadf2d676a10f82ade9453` |
| D2 | source sort code = `000100003` | `8d3d95f2fd8d90d6687c20f68bae28cbd94a59ac0b0ce8188757ec5ba16163db` |
| D3 | source `account_id = "0012346"` | `5ae1f4a4d88966a3a1b15bc81423b56d376faf9c1d167b99ed79e79ace1ccb81` |
| D4 | destination sort code = `000200004` | `ebb3f2ddeead59695a7285f9e30c6134d35363d12f7afdbdbfcb68031e013b8e` |
| D5 | destination `account_id = "VENDOR-0002"` | `45ddb674651bb186e72c206d7b143f8f52896b18bac6c1d03c862663c006ff5c` |

Changing any descriptor rule affecting the amount role, CAD scale, charge
semantics, completion proposition, account-address grammar, pinned external
profile edition, or unsupported-alternative policy MUST change
`schema_digest`. Descriptor mutation probes cover each category.

### 9.3 Rejection vectors

| Vector | Input | Required result |
|---|---|---|
| R1 | `amount_minor = 0` | Reject. |
| R2 | Negative `amount_minor` | Reject. |
| R3 | `amount_minor = 100000000000000` | Reject above the normative maximum. |
| R4 | Floating-point or decimal-text amount | Reject. |
| R5 | Missing `amount_minor` | Reject. |
| R6 | Missing `source_account` | Reject. |
| R7 | Missing `destination_account` | Reject. |
| R8 | Sort code with other than nine characters | Reject. |
| R9 | Sort code without leading zero | Reject. |
| R10 | Sort code containing any non-ASCII-digit | Reject. |
| R11 | Empty `account_id` | Reject. |
| R12 | `account_id` longer than 34 characters | Reject. |
| R13 | `null` at either level | Reject. |
| R14 | Unknown top-level member | Reject. |
| R15 | Unknown account-map member | Reject. |
| R16 | IBAN branch | Reject. |
| R17 | Proxy form | Reject. |
| R18 | Explicit `currency` member | Reject. |
| R19 | `domain_id` member | Reject. |
| R20 | Non-NFC `account_id` | Reject; do not normalize. |
| R21 | `account_id` contains XML-illegal U+0000 | Reject. |
| R22 | `account_id` contains U+1F9D0 FACE WITH MONOCLE, assigned after Unicode 6.2 | Reject. |
| R23 | `account_id` contains 35 U+1F600 GRINNING FACE characters | Reject as 35 XML characters, even though each character is otherwise admitted. |

### 9.4 Unicode and length boundary vectors

The following admission results are normative. U+00E9 and U+1F600 were
assigned by Unicode 6.2.0, match the XML 1.0 Fifth Edition `Char` production,
and are stable under NFC.

| Vector | `account_id` | Required result |
|---|---|---|
| U1 | `"A"` | Admit as exactly one XML character. |
| U2 | 34 repetitions of `"A"` | Admit as exactly 34 XML characters. |
| U3 | `"Caf\u00E9"` | Admit; the U+00E9 form is already NFC. |
| U4 | `"Cafe\u0301"` | Reject as non-NFC; do not normalize to U3. |
| U5 | one U+1F600 GRINNING FACE | Admit as one XML character, not two UTF-16 code units or four UTF-8 bytes. |
| U6 | 34 repetitions of U+1F600 | Admit as exactly 34 XML characters. |

This schema creates no new public failure-code taxonomy.

## 10. Account-address and reassignment tests

The original account-reference blocker is closed:

```text
same canonical Action account structure
-> same Canadian servicing-agent address
-> same exact Other/Id lexical address
```

No deployment-local namespace interpretation is permitted, and eternal
account-object identity is not required.

If an external address is reassigned at T2, an Action created at T1 still
means the exact regime-qualified address encoded under this pinned schema. It
does not claim eternal ownership identity. The same semantic instruction at a
later occurrence may have the same `action_digest` and a different
`action_id`. Actual historical execution facts remain in Event and Receipt
history.

## 11. RS-002 and RS-003 compatibility

**RS-002 classification: C. RS-002 is ambiguous and must be separately audited
before reuse.** Its user intent says transfer to a Vendor Account and its
completion phrase refers generally to the banking system's settlement
semantics. It does not establish that participant-level Lynx interbank
settlement, rather than broader customer-level transfer completion, is the
intended bound. This finding does not invalidate this schema; a new
Lynx-specific Reference Scenario may be the cleaner next cadence step.

**RS-003 classification: C, inherited semantic ambiguity.** Its uncertainty
behavior is compatible with the schema boundary: outcome uncertainty remains
outside Action semantics, and no new Action field is required. But RS-003 uses
the same broad customer-transfer wording as RS-002, so it cannot be treated as
a direct instantiation of this narrowed Action class without the same separate
ownership audit. RS-003 is unchanged.

## 12. Descriptor mutation and independent-implementation results

Independent Python and Node implementations reproduce byte-for-byte identical
descriptor bytes, `SchemaIdentityFrame`, `schema_digest`, normalized-map bytes,
`ActionContentFrame`, and `action_digest`.

The map-order equivalence probe converges. D1-D5 all diverge from P1. R1-R23
all reject, and U1-U6 produce the required admission results. Eleven semantic
descriptor probes independently change the amount role, CAD scale, charge
semantics, completion proposition, account-address grammar, Unicode version,
XML repertoire, length/counting rule, NFC requirement, external profile
edition, and unsupported-alternative policy; every probe changes
`schema_digest`. Changing only the explanatory historical release-state prose
does not change the descriptor or `schema_digest`.

## 13. Primitive and governance audit

All Lynx, amount, charge, and account concepts remain schema-local. This Draft
introduces no `Account`, `AccountReference`, `PaymentRail`, `LynxMessage`,
`SettlementMechanism`, charge primitive, date primitive, external-standard
primitive, `ResourceReference`, currency primitive, `Money`,
`EntityReference`, registry, or resolver.

Governance result:

```text
VE-001 revision required: NO
VE-001 profile revision required: NO
VE-006 revision required: NO
VE-002 revision required: NO
VE-003 revision required: NO
VE-004 revision required: NO
RFC required: NO
ADR required: NO
VE-xxx allocation required: NO
ARCHITECTURE_INDEX update required: NO
CHANGELOG update required: NO
new primitive required: NO
```

## 14. Architectural Decision Test

1. **Founding Principles consistency — PASS.** The schema fixes intent and
   completion while authority, execution, history, and evidence retain their
   existing owners.
2. **Primitive burden — PASS.** It is one removable domain schema, not a new
   kernel primitive or generic abstraction.
3. **Removability — PASS.** It can be omitted or replaced without changing
   VE-001 or another Action class.
4. **Twenty-year durability — PASS.** Exact scaled integers and a pinned,
   regime-qualified address preserve historical meaning without asserting
   eternal account ownership or depending on mutable local aliases.
5. **Independent implementability — PASS.** The complete descriptor, closed
   grammar, exact equality, rejections, and vectors produce one result across
   independent implementations.
6. **Reduced conceptual complexity — PASS.** The Action is not `pacs.008`;
   participant settlement is explicit, customer credit is not promised,
   execution strategy is excluded, and source-document hashes remain
   provenance rather than semantic identity.

## 15. Final result

The closed Lynx UG2026 account-address regime removes the former identity
blocker without inventing permanent account-object identity. The exact
three-member semantic map and descriptor distinguish participant-level Lynx
settlement intent from message construction and execution strategy.

```text
A. CORRECTED LYNX ACTION SCHEMA DRAFT IS SOUND
```
