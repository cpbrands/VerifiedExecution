#!/usr/bin/env node

import assert from "node:assert/strict";
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

console.log("PASS Node.js: 5 accepted, 8 rejected");
