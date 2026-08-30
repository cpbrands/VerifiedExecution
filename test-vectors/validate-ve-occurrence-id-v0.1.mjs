#!/usr/bin/env node

const WIDTH = 32;

function bytesFromHex(value) {
  if (!/^[0-9a-f]*$/i.test(value) || value.length % 2 !== 0) throw new Error("fixture hex is malformed");
  return Buffer.from(value, "hex");
}

function canonicalOccurrenceId(payload) {
  if (!Buffer.isBuffer(payload) || payload.length !== WIDTH) throw new Error("OccurrenceId payload must be exactly 32 octets");
  return Buffer.concat([Buffer.from([0x58, WIDTH]), payload]);
}

function invalid(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function decodeOccurrenceId(input) {
  if (!Buffer.isBuffer(input) || input.length === 0) invalid("missing-value");
  const initial = input[0];
  if ((initial & 0xe0) === 0xc0) invalid("tag-forbidden");
  if (initial === 0x5f) invalid("indefinite-length");
  if ((initial & 0xe0) !== 0x40) invalid("wrong-cbor-type");
  if (initial !== 0x58) {
    if (initial === 0x59 || initial === 0x5a || initial === 0x5b) invalid("noncanonical-length");
    invalid("unsupported-byte-string-form");
  }
  if (input.length < 2) invalid("truncated-length");
  if (input[1] !== WIDTH) invalid("invalid-length");
  const encodedLength = 2 + WIDTH;
  if (input.length < encodedLength) invalid("truncated-payload");
  if (input.length > encodedLength) invalid("trailing-bytes");
  const payload = input.subarray(2);
  if (!canonicalOccurrenceId(payload).equals(input)) invalid("noncanonical-encoding");
  return payload;
}

function assertAccepted(name, input) {
  const payload = decodeOccurrenceId(input);
  if (payload.length !== WIDTH) throw new Error(`${name}: wrong decoded width`);
}

function assertRejected(name, input, code) {
  try {
    decodeOccurrenceId(input);
  } catch (error) {
    if (error.code === code) return;
    throw new Error(`${name}: expected ${code}, got ${error.code ?? error.message}`);
  }
  throw new Error(`${name}: expected rejection`);
}

const zero = Buffer.alloc(WIDTH, 0x00);
const nonzero = Buffer.alloc(WIDTH, 0xa5);
const oneOctetDifferent = Buffer.concat([Buffer.alloc(WIDTH - 1, 0xa5), Buffer.from([0xa4])]);

// A1–A4
assertAccepted("A1", canonicalOccurrenceId(zero));
assertAccepted("A2", canonicalOccurrenceId(nonzero));
assertAccepted("A3", canonicalOccurrenceId(nonzero));
if (!decodeOccurrenceId(canonicalOccurrenceId(nonzero)).equals(decodeOccurrenceId(canonicalOccurrenceId(nonzero)))) throw new Error("A3: equal payloads must compare equal");
if (decodeOccurrenceId(canonicalOccurrenceId(nonzero)).equals(decodeOccurrenceId(canonicalOccurrenceId(oneOctetDifferent)))) throw new Error("A4: distinct payloads must compare unequal");

// R1–R8
assertRejected("R1", Buffer.concat([Buffer.from([0x58, 0x1f]), Buffer.alloc(31)]), "invalid-length");
assertRejected("R2", Buffer.concat([Buffer.from([0x58, 0x21]), Buffer.alloc(33)]), "invalid-length");
assertRejected("R3", Buffer.concat([Buffer.from([0x78, 0x20]), Buffer.alloc(32, 0x61)]), "wrong-cbor-type");
assertRejected("R4", bytesFromHex("00"), "wrong-cbor-type");
assertRejected("R5", Buffer.concat([Buffer.from([0x5f, 0x58, 0x20]), zero, Buffer.from([0xff])]), "indefinite-length");
assertRejected("R6", Buffer.concat([Buffer.from([0xc0]), canonicalOccurrenceId(zero)]), "tag-forbidden");
assertRejected("R7", Buffer.concat([Buffer.from([0x59, 0x00, 0x20]), zero]), "noncanonical-length");
assertRejected("R8", Buffer.concat([canonicalOccurrenceId(zero), Buffer.from([0x00])]), "trailing-bytes");

console.log("VE OccurrenceId v0.1 vectors passed: 4 accepted, 8 rejected.");
