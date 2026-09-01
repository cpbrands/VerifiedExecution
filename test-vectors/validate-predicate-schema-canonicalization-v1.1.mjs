#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const FIELD_FORMS = new Set(["boolean", "integer", "text", "bytes", "record", "sequence"]);
const SUBJECT_FORMS = new Set([
  "ActionContentReference",
  "ActionOccurrenceReference",
  "EventReference",
  "ExternalSubjectReference",
]);

const ISSUER_DOMAIN = { identifier: { form: "text" }, equality: "canonical" };
const SUBJECT_DOMAIN = { identifier: { form: "text" }, equality: "canonical" };
const VALUE_SEMANTICS = { value: { form: "boolean" } };

const C_A = "a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e";
const C_C = "a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e";
const C_WITH_DOMAIN = "a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e";
const SUBJECT_CONSTRAINTS_KEY = "737375626a6563745f636f6e" + "73747261696e7473";
const D_VALUES = "846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365";
const E_VALUES = "82781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365";
const EXPECTED = new Map([
  ["V1.1-A", C_A],
  ["V1.1-B", C_A],
  ["V1.1-C", C_C],
  ["V1.1-D", `${C_WITH_DOMAIN}${SUBJECT_CONSTRAINTS_KEY}${D_VALUES}`],
  ["V1.1-E", `${C_WITH_DOMAIN}${SUBJECT_CONSTRAINTS_KEY}${E_VALUES}`],
]);

// These h'02' values are permanent assignments for the Approved v1.1 closure.
// This test independently verifies the corresponding fixed construction.
const CANDIDATE_SUITE = 0x02;
const CANDIDATE_PROFILE = 0x02;
const MAGIC = Buffer.from("VEPSCID1", "ascii");
const IDENTITY_ANCHORS = new Map([
  ["A", {
    canonical: C_A,
    frame: "84485645505343494431410241025897a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e",
    digest: "038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f",
    identity: "02038df64019001d19588a6d0d7910148b4f416baf34a4283258f7c0243538107f",
  }],
  ["C", {
    canonical: C_C,
    frame: "8448564550534349443141024102585ea26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e",
    digest: "1f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d",
    identity: "021f2ba2e17d8589cfc976e7284f869b47349902b21d15222bed967aae1779f03d",
  }],
  ["D", {
    canonical: `${C_WITH_DOMAIN}${SUBJECT_CONSTRAINTS_KEY}${D_VALUES}`,
    frame: "8448564550534349443141024102590107a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e7473846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365",
    digest: "0d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc",
    identity: "020d4c08b338d10559a20ebe123fe0b54d34d5dc581cde3e30319619ffa6a2d2cc",
  }],
]);

const v1Document = readFileSync(new URL("./PREDICATE-SCHEMA-CANONICALIZATION-V1.md", import.meta.url), "utf8");
const v1ASection = v1Document.split("### V1-A")[1].split("### V1-B")[0];
const V1_A = v1ASection.match(/\n([0-9a-f]{100,})\n/)?.[1];
assert.ok(V1_A, "Approved v1.0 V1-A anchor is present");

const REFERENCES = {
  "fixture://subject-domain/text": SUBJECT_DOMAIN,
  "fixture://subject-domain/cycle-a": { subject_domain_ref: "fixture://subject-domain/cycle-b" },
  "fixture://subject-domain/cycle-b": { subject_domain_ref: "fixture://subject-domain/cycle-a" },
};

function fail(code) { throw new Error(code); }

function head(major, length) {
  if (length < 24) return Buffer.from([(major << 5) | length]);
  if (length <= 0xff) return Buffer.from([(major << 5) | 24, length]);
  if (length <= 0xffff) return Buffer.from([(major << 5) | 25, length >> 8, length & 0xff]);
  fail("encoder-length");
}

function encode(value) {
  if (typeof value === "string") {
    const text = Buffer.from(value, "utf8");
    return Buffer.concat([head(3, text.length), text]);
  }
  if (typeof value === "boolean") return Buffer.from([value ? 0xf5 : 0xf4]);
  if (Array.isArray(value)) return Buffer.concat([head(4, value.length), ...value.map(encode)]);
  if (value && typeof value === "object") {
    const entries = Object.entries(value).map(([key, item]) => ({ key: encode(key), item: encode(item) }));
    entries.sort((left, right) => Buffer.compare(left.key, right.key));
    return Buffer.concat([head(5, entries.length), ...entries.flatMap(({ key, item }) => [key, item])]);
  }
  fail("encoder-type");
}

function byteString(bytes) {
  return Buffer.concat([head(2, bytes.length), bytes]);
}

function suiteFrame(canonical, suite, profile) {
  return Buffer.concat([
    Buffer.from([0x84]),
    byteString(MAGIC),
    byteString(Buffer.from([suite])),
    byteString(Buffer.from([profile])),
    byteString(canonical),
  ]);
}

function digest(frame) {
  return createHash("sha256").update(frame).digest();
}

function suiteDefinition(suite) {
  if (suite === 0x01) return { profile: 0x01 };
  if (suite === CANDIDATE_SUITE) return { profile: CANDIDATE_PROFILE };
  fail("unknown-suite");
}

function suiteIdentity(canonical, suite) {
  const { profile } = suiteDefinition(suite);
  return Buffer.concat([Buffer.from([suite]), digest(suiteFrame(canonical, suite, profile))]);
}

function candidateFrame(canonical) {
  return suiteFrame(canonical, CANDIDATE_SUITE, CANDIDATE_PROFILE);
}

function candidateIdentity(canonical) {
  return suiteIdentity(canonical, CANDIDATE_SUITE);
}

function decodeByteString(frame, offset) {
  if (offset >= frame.length || frame[offset] >> 5 !== 2) fail("frame-byte-string");
  const additional = frame[offset] & 0x1f;
  let length;
  let cursor = offset + 1;
  if (additional < 24) length = additional;
  else if (additional === 24 && cursor < frame.length) { length = frame[cursor]; cursor += 1; }
  else if (additional === 25 && cursor + 1 < frame.length) { length = frame.readUInt16BE(cursor); cursor += 2; }
  else fail("frame-length");
  if (cursor + length > frame.length) fail("frame-truncated");
  return { value: frame.subarray(cursor, cursor + length), next: cursor + length };
}

function decodeCandidateFrame(frame) {
  if (frame[0] !== 0x84) fail("frame-shape");
  const values = [];
  let cursor = 1;
  for (let index = 0; index < 4; index += 1) {
    const item = decodeByteString(frame, cursor);
    values.push(item.value);
    cursor = item.next;
  }
  if (cursor !== frame.length) fail("frame-trailing-material");
  return values;
}

function verifyAsSuite(suite, identity, canonical) {
  if (!Buffer.isBuffer(identity) || identity.length !== 33) fail("identity-length");
  const { profile } = suiteDefinition(suite);
  const expected = suiteIdentity(canonical, suite);
  if (!identity.equals(expected)) fail("identity-mismatch");
  const [magic, framedSuite, framedProfile, embeddedCanonical] = decodeCandidateFrame(suiteFrame(canonical, suite, profile));
  if (!magic.equals(MAGIC) || !framedSuite.equals(Buffer.from([suite])) || !framedProfile.equals(Buffer.from([profile])) || !embeddedCanonical.equals(canonical)) fail("frame-binding");
  return true;
}

function verifyIdentity(identity, canonical) {
  if (!Buffer.isBuffer(identity) || identity.length !== 33) fail("identity-length");
  return verifyAsSuite(identity[0], identity, canonical);
}

function verifyFramedIdentity(identity, frame) {
  if (!Buffer.isBuffer(identity) || identity.length !== 33) fail("identity-length");
  const [magic, framedSuite, framedProfile] = decodeCandidateFrame(frame);
  if (!magic.equals(MAGIC) || framedSuite.length !== 1 || framedProfile.length !== 1) fail("frame-binding");
  if (identity[0] !== framedSuite[0]) fail("suite-prefix-mismatch");
  suiteDefinition(framedSuite[0]);
  const expected = Buffer.concat([framedSuite, digest(frame)]);
  if (!identity.equals(expected)) fail("identity-mismatch");
  return true;
}

function legacyPscid1Identity(canonical) {
  return suiteIdentity(canonical, 0x01);
}

function exactKeys(value, keys) {
  const actual = Object.keys(value);
  return actual.length === keys.length && actual.every((key) => keys.includes(key));
}

function normalizeFieldForm(form) {
  if (!form || typeof form !== "object" || !exactKeys(form, ["form"]) || !FIELD_FORMS.has(form.form)) {
    fail("profile-grammar-validation");
  }
  return { form: form.form };
}

function resolveSubjectDomain(reference, seen = new Set()) {
  if (seen.has(reference)) fail("reference-expansion-cycle");
  const source = REFERENCES[reference];
  if (!source) fail("reference-resolution");
  if ("subject_domain_ref" in source) return resolveSubjectDomain(source.subject_domain_ref, new Set([...seen, reference]));
  return source;
}

function normalizeSubjectDomain(domain) {
  if (!domain || typeof domain !== "object" || !exactKeys(domain, ["identifier", "equality"])) {
    fail("bounded-subset-admission");
  }
  if (domain.equality !== "canonical") fail("bounded-subset-admission");
  return { identifier: normalizeFieldForm(domain.identifier), equality: "canonical" };
}

function normalizeConstraints(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !SUBJECT_FORMS.has(value))) {
    fail("bounded-subset-admission");
  }
  const normalized = [...values].sort((left, right) => Buffer.compare(encode(left), encode(right)));
  if (normalized.some((value, index) => index > 0 && value === normalized[index - 1])) fail("bounded-subset-admission");
  return normalized;
}

function normalize(source) {
  const hasInlineDomain = Object.hasOwn(source, "subject_domain");
  const hasReferenceDomain = Object.hasOwn(source, "subject_domain_ref");
  if (hasInlineDomain && hasReferenceDomain) fail("source-admission");
  const normalized = { issuer_domain: ISSUER_DOMAIN, value_semantics: VALUE_SEMANTICS };
  if (hasInlineDomain || hasReferenceDomain) {
    normalized.subject_domain = normalizeSubjectDomain(
      hasInlineDomain ? source.subject_domain : resolveSubjectDomain(source.subject_domain_ref),
    );
  }
  if (source.subject_constraints) normalized.subject_constraints = normalizeConstraints(source.subject_constraints);
  return normalized;
}

const ACCEPTED = {
  "V1.1-A": { subject_domain: SUBJECT_DOMAIN },
  "V1.1-B": { subject_domain_ref: "fixture://subject-domain/text" },
  "V1.1-C": {},
  "V1.1-D": { subject_domain: SUBJECT_DOMAIN, subject_constraints: ["ActionOccurrenceReference", "ExternalSubjectReference", "ActionContentReference", "EventReference"] },
  "V1.1-E": { subject_domain: SUBJECT_DOMAIN, subject_constraints: ["ActionOccurrenceReference", "ExternalSubjectReference"] },
};
const REJECTED = {
  R1: [{ subject_domain: SUBJECT_DOMAIN, subject_domain_ref: "fixture://subject-domain/text" }, "source-admission"],
  R2: [{ subject_domain_ref: "fixture://subject-domain/unavailable" }, "reference-resolution"],
  R3: [{ subject_domain_ref: "fixture://subject-domain/cycle-a" }, "reference-expansion-cycle"],
  R4: [{ subject_domain: { equality: "canonical" } }, "bounded-subset-admission"],
  R5: [{ subject_domain: { identifier: { form: "text" }, equality: "casefold" } }, "bounded-subset-admission"],
  R6: [{ subject_domain: { identifier: { form: "text" }, equality: "canonical", normalization: "nfc" } }, "bounded-subset-admission"],
  R7: [{ subject_domain: { identifier: { form: "decimal" }, equality: "canonical" } }, "profile-grammar-validation"],
  R8: [{ subject_domain: SUBJECT_DOMAIN, subject_constraints: ["UnknownSubjectReference"] }, "bounded-subset-admission"],
};

for (const [name, source] of Object.entries(ACCEPTED)) {
  const actual = encode(normalize(source)).toString("hex");
  assert.equal(actual, EXPECTED.get(name), `${name} canonical bytes`);
  console.log(`PASS ${name} ${actual}`);
}
assert.equal(EXPECTED.get("V1.1-A"), EXPECTED.get("V1.1-B"), "inline/reference convergence");
assert.equal(EXPECTED.get("V1.1-C"), V1_A, "v1.0 V1-A replay");

for (const [name, [source, expected]] of Object.entries(REJECTED)) {
  try {
    normalize(source);
    assert.fail(`${name} accepted`);
  } catch (error) {
    assert.equal(error.message, expected, name);
  }
  console.log(`PASS ${name} rejects at ${expected}`);
}

for (const [name, anchor] of IDENTITY_ANCHORS) {
  const canonical = Buffer.from(anchor.canonical, "hex");
  const frame = candidateFrame(canonical);
  const actualDigest = digest(frame);
  const actualIdentity = candidateIdentity(canonical);
  assert.equal(frame.toString("hex"), anchor.frame, `Anchor ${name} frame`);
  assert.equal(actualDigest.toString("hex"), anchor.digest, `Anchor ${name} digest`);
  assert.equal(actualIdentity.toString("hex"), anchor.identity, `Anchor ${name} identity`);
  const [magic, suite, profile, embeddedCanonical] = decodeCandidateFrame(frame);
  assert.equal(magic.toString("ascii"), "VEPSCID1", `Anchor ${name} magic`);
  assert.deepEqual(suite, Buffer.from([CANDIDATE_SUITE]), `Anchor ${name} suite`);
  assert.deepEqual(profile, Buffer.from([CANDIDATE_PROFILE]), `Anchor ${name} profile`);
  assert.deepEqual(embeddedCanonical, canonical, `Anchor ${name} canonical embedding`);
  assert.equal(verifyIdentity(actualIdentity, canonical), true, `Anchor ${name} verification`);
  console.log(`PASS anchor ${name}: C=${canonical.length}, frame=${frame.length}, identity=${actualIdentity.length}`);
}

const anchorC = IDENTITY_ANCHORS.get("C");
const candidateC = Buffer.from(anchorC.canonical, "hex");
const candidateIdentityC = Buffer.from(anchorC.identity, "hex");
const legacyIdentityC = legacyPscid1Identity(candidateC);
const PSCID1_ANCHOR_C = Buffer.from("01634b3118ec88e36cf5eab44b86092e88f309fe918a99db460222fbd76946b80a", "hex");
assert.equal(candidateC.toString("hex"), V1_A, "Anchor C replays Approved v1.0 C");
assert.deepEqual(legacyIdentityC, PSCID1_ANCHOR_C, "Anchor C independently derives the historical PSCID-1 identity");
assert.notDeepEqual(candidateIdentityC, legacyIdentityC, "Anchor C has a distinct candidate identity");

const suiteRelabel = Buffer.from(candidateIdentityC);
suiteRelabel[0] = 0x01;
assert.notDeepEqual(suiteRelabel, legacyIdentityC, "N1 relabeled candidate differs from the actual PSCID-1 identity");
assert.throws(() => verifyIdentity(suiteRelabel, candidateC), /identity-mismatch/, "N1 suite relabel under known PSCID-1");

const profileRelabel = Buffer.concat([Buffer.from([CANDIDATE_SUITE]), digest(suiteFrame(candidateC, CANDIDATE_SUITE, 0x01))]);
assert.throws(() => verifyIdentity(profileRelabel, candidateC), /identity-mismatch/, "N2 profile relabel");

assert.throws(() => verifyAsSuite(0x01, candidateIdentityC, candidateC), /identity-mismatch/, "N3 candidate identity is invalid under PSCID-1");
assert.throws(() => verifyIdentity(Buffer.concat([Buffer.from([0x03]), candidateIdentityC.subarray(1)]), candidateC), /unknown-suite/, "N4 unknown suite");

const substitutedFrame = suiteFrame(candidateC, CANDIDATE_SUITE, 0x01);
assert.notDeepEqual(digest(substitutedFrame), candidateIdentityC.subarray(1), "N5 tampered frame digest differs without identity recomputation");
assert.throws(() => verifyFramedIdentity(candidateIdentityC, substitutedFrame), /identity-mismatch/, "N5 frame-field substitution without identity recomputation");

console.log("PASS Node.js: 5 accepted, 8 rejected, 3 identity anchors, 5 confusion cases");
