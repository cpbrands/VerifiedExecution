---
id: VE-OCCURRENCE-ID-V0.1
title: VE Occurrence Identifier v0.1 Conformance Vectors
version: "0.1"
status: Draft
document_type: Conformance Vector
category: Conformance
author: Verified Execution Editorial Board
created: 2026-08-30
updated: 2026-08-30
depends_on:
  - VE-002
  - ADR-ENC-001
related_documents:
  - RFC-009
  - ADR-009
  - VE-CLAIM-REFERENCE-SEMANTICS
supersedes: null
superseded_by: null
---

# VE Occurrence Identifier v0.1 Conformance Vectors

## 1. Scope

These Draft vectors validate only the proposed OccurrenceId scalar convention
and VE-002's Event adoption candidate. They do not validate an Event map,
Event payload, provenance, Event ordering, Action identity, Claim wire
representation, receipt identity, or external-subject semantics.

An accepted value is exactly one VE-CBOR-1 definite-length byte string with a
32-octet payload, encoded as `h'58 20' || payload`. Equality compares exactly
the 32 payload octets.

## 2. Accepted vectors

| ID | Input | Expected result |
|---|---|---|
| A1 | Canonical byte string whose payload is 32 `00` octets. | Accepted; all-zero payload is valid opaque data. |
| A2 | Canonical byte string whose payload is 32 nonzero `a5` octets. | Accepted. |
| A3 | The A2 value presented twice. | Accepted; the values are equal. |
| A4 | A2 compared with a value whose final payload octet is `a4`. | Accepted inputs; the values are unequal. |

The exact canonical encodings are generated and asserted by the independent
Node and Python validators. The canonical prefix is always `5820`.

## 3. Abstract-value and representation failures

R1 and R2 carry byte-string payloads that are invalid abstract OccurrenceIds
because their widths are not 32 octets. R3 through R8 are serialized-form
failures: their values are wrong-type, non-canonical, tagged, indefinite, or
not exactly one scalar. A decoder MUST fail closed for either class.

## 4. Rejected vectors

| ID | Input form | Required failure |
|---|---|---|
| R1 | Definite byte string with 31-octet payload (`581f`). | Invalid length. |
| R2 | Definite byte string with 33-octet payload (`5821`). | Invalid length. |
| R3 | Text string with a 32-octet UTF-8 payload (`7820`). | Wrong CBOR type. |
| R4 | Integer (`00`). | Wrong CBOR type. |
| R5 | Indefinite-length byte string (`5f ... ff`). | Indefinite length. |
| R6 | Tagged canonical byte string (`c0 5820 ...`). | Tag forbidden. |
| R7 | 32-octet byte string using a non-shortest length encoding (`590020`). | Non-canonical length. |
| R8 | Valid canonical value followed by one additional byte. | Trailing bytes. |

## 5. EventReference scenario checks

| Scenario | Required result |
|---|---|
| A | Same `event_id` means the same referenced Event occurrence. |
| B | Identical Event content with different `event_id` values means distinct Event occurrences. |
| C | Repeated transport carrying the same `event_id` refers to the same occurrence. |
| D | Malformed or non-canonical Event ID representation is rejected. |
| E | Valid payloads differing by one octet identify distinct Event occurrences. |
| F | The same raw 32 octets in `action_id` and `event_id` establish no cross-kind identity. |

Scenario F is a semantic scope rule; it does not require another wire form.

## 6. Validator requirements

`validate-ve-occurrence-id-v0.1.mjs` and
`validate-ve-occurrence-id-v0.1.py` independently implement the scalar parser
and equality checks. Each must accept A1–A4, reject R1–R8 fail closed, require
canonical `5820` encoding, and reject trailing bytes. Neither validator uses a
general Event decoder or an external CBOR library.
