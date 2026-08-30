#!/usr/bin/env python3

WIDTH = 32


def canonical_occurrence_id(payload: bytes) -> bytes:
    if not isinstance(payload, bytes) or len(payload) != WIDTH:
        raise ValueError("OccurrenceId payload must be exactly 32 octets")
    return bytes([0x58, WIDTH]) + payload


class Rejection(Exception):
    def __init__(self, code: str):
        self.code = code
        super().__init__(code)


def reject(code: str):
    raise Rejection(code)


def decode_occurrence_id(encoded: bytes) -> bytes:
    if not isinstance(encoded, bytes) or not encoded:
        reject("missing-value")
    initial = encoded[0]
    if initial & 0xE0 == 0xC0:
        reject("tag-forbidden")
    if initial == 0x5F:
        reject("indefinite-length")
    if initial & 0xE0 != 0x40:
        reject("wrong-cbor-type")
    if initial != 0x58:
        if initial in (0x59, 0x5A, 0x5B):
            reject("noncanonical-length")
        reject("unsupported-byte-string-form")
    if len(encoded) < 2:
        reject("truncated-length")
    if encoded[1] != WIDTH:
        reject("invalid-length")
    encoded_length = 2 + WIDTH
    if len(encoded) < encoded_length:
        reject("truncated-payload")
    if len(encoded) > encoded_length:
        reject("trailing-bytes")
    payload = encoded[2:]
    if canonical_occurrence_id(payload) != encoded:
        reject("noncanonical-encoding")
    return payload


def accepted(name: str, encoded: bytes):
    payload = decode_occurrence_id(encoded)
    if len(payload) != WIDTH:
        raise AssertionError(f"{name}: wrong decoded width")


def rejected(name: str, encoded: bytes, expected: str):
    try:
        decode_occurrence_id(encoded)
    except Rejection as error:
        if error.code == expected:
            return
        raise AssertionError(f"{name}: expected {expected}, got {error.code}") from error
    raise AssertionError(f"{name}: expected rejection")


zero = bytes(WIDTH)
nonzero = bytes([0xA5]) * WIDTH
one_octet_different = bytes([0xA5]) * (WIDTH - 1) + b"\xA4"

# A1–A4
accepted("A1", canonical_occurrence_id(zero))
accepted("A2", canonical_occurrence_id(nonzero))
accepted("A3", canonical_occurrence_id(nonzero))
assert decode_occurrence_id(canonical_occurrence_id(nonzero)) == decode_occurrence_id(canonical_occurrence_id(nonzero)), "A3: equal payloads must compare equal"
assert decode_occurrence_id(canonical_occurrence_id(nonzero)) != decode_occurrence_id(canonical_occurrence_id(one_octet_different)), "A4: distinct payloads must compare unequal"

# R1–R8
rejected("R1", bytes([0x58, 0x1F]) + bytes(31), "invalid-length")
rejected("R2", bytes([0x58, 0x21]) + bytes(33), "invalid-length")
rejected("R3", bytes([0x78, 0x20]) + bytes([0x61]) * 32, "wrong-cbor-type")
rejected("R4", bytes([0x00]), "wrong-cbor-type")
rejected("R5", bytes([0x5F, 0x58, 0x20]) + zero + bytes([0xFF]), "indefinite-length")
rejected("R6", bytes([0xC0]) + canonical_occurrence_id(zero), "tag-forbidden")
rejected("R7", bytes([0x59, 0x00, 0x20]) + zero, "noncanonical-length")
rejected("R8", canonical_occurrence_id(zero) + bytes([0x00]), "trailing-bytes")

print("VE OccurrenceId v0.1 vectors passed: 4 accepted, 8 rejected.")
