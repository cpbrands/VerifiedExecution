import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const fail = (code) => { throw new Error(code); };

function head(major, value) {
  if (!Number.isSafeInteger(value) || value < 0) fail("encoder-length");
  if (value < 24) return Buffer.from([(major << 5) | value]);
  if (value < 256) return Buffer.from([(major << 5) | 24, value]);
  if (value < 65536) return Buffer.from([(major << 5) | 25, value >> 8, value & 0xff]);
  if (value < 4294967296) {
    const out = Buffer.alloc(5);
    out[0] = (major << 5) | 26;
    out.writeUInt32BE(value, 1);
    return out;
  }
  fail("encoder-length");
}

function encode(value) {
  if (Buffer.isBuffer(value)) return Buffer.concat([head(2, value.length), value]);
  if (typeof value === "boolean") return Buffer.from([value ? 0xf5 : 0xf4]);
  if (Number.isSafeInteger(value)) {
    if (value >= 0) return head(0, value);
    return head(1, -1 - value);
  }
  if (typeof value === "string") {
    const data = Buffer.from(value, "utf8");
    if (data.toString("utf8").normalize("NFC") !== value) fail("text-nfc");
    return Buffer.concat([head(3, data.length), data]);
  }
  if (Array.isArray(value)) return Buffer.concat([head(4, value.length), ...value.map(encode)]);
  if (value && typeof value === "object") {
    const entries = Object.entries(value).map(([key, item]) => [encode(key), encode(item)]);
    entries.sort((left, right) => Buffer.compare(left[0], right[0]));
    return Buffer.concat([head(5, entries.length), ...entries.flat()]);
  }
  fail("encoder-type");
}

const exactKeys = (value, allowed, required = allowed) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("closed-map");
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail("unknown-field");
  for (const key of required) if (!Object.hasOwn(value, key)) fail("missing-field");
};

function normalizeBound(bound) {
  exactKeys(bound, ["value", "inclusive"]);
  if (!Number.isSafeInteger(bound.value) || typeof bound.inclusive !== "boolean") fail("bound");
  return { value: bound.value, inclusive: bound.inclusive };
}

function normalizeField(form) {
  if (!form || typeof form !== "object" || Array.isArray(form) || typeof form.form !== "string") fail("field-form");
  if (form.form === "boolean") {
    exactKeys(form, ["form", "allowed_values"], ["form"]);
    const result = { form: "boolean" };
    if (Object.hasOwn(form, "allowed_values")) {
      if (!Array.isArray(form.allowed_values) || form.allowed_values.length === 0 || form.allowed_values.some((v) => typeof v !== "boolean")) fail("allowed-values");
      result.allowed_values = [...form.allowed_values].sort((a, b) => Buffer.compare(encode(a), encode(b)));
      if (new Set(result.allowed_values).size !== result.allowed_values.length) fail("allowed-values");
    }
    return result;
  }
  if (form.form === "integer") {
    exactKeys(form, ["form", "scale", "lower_bound", "upper_bound", "allowed_values"], ["form"]);
    const result = { form: "integer" };
    if (Object.hasOwn(form, "scale")) {
      if (!Number.isSafeInteger(form.scale) || form.scale < 0) fail("scale");
      if (form.scale !== 0) result.scale = form.scale;
    }
    if (form.lower_bound) result.lower_bound = normalizeBound(form.lower_bound);
    if (form.upper_bound) result.upper_bound = normalizeBound(form.upper_bound);
    if (result.lower_bound && result.upper_bound) {
      const min = result.lower_bound.value + (result.lower_bound.inclusive ? 0 : 1);
      const max = result.upper_bound.value - (result.upper_bound.inclusive ? 0 : 1);
      if (min > max) fail("empty-domain");
    }
    if (Object.hasOwn(form, "allowed_values")) {
      if (!Array.isArray(form.allowed_values) || form.allowed_values.length === 0 || form.allowed_values.some((v) => !Number.isSafeInteger(v))) fail("allowed-values");
      result.allowed_values = [...form.allowed_values].sort((a, b) => Buffer.compare(encode(a), encode(b)));
      if (new Set(result.allowed_values).size !== result.allowed_values.length) fail("allowed-values");
    }
    return result;
  }
  if (form.form === "text") {
    exactKeys(form, ["form", "allowed_values"], ["form"]);
    const result = { form: "text" };
    if (Object.hasOwn(form, "allowed_values")) {
      if (!Array.isArray(form.allowed_values) || form.allowed_values.length === 0 || form.allowed_values.some((v) => typeof v !== "string" || v.normalize("NFC") !== v)) fail("allowed-values");
      result.allowed_values = [...form.allowed_values].sort((a, b) => Buffer.compare(encode(a), encode(b)));
      if (new Set(result.allowed_values).size !== result.allowed_values.length) fail("allowed-values");
    }
    return result;
  }
  if (form.form === "bytes") {
    exactKeys(form, ["form", "allowed_values"], ["form"]);
    const result = { form: "bytes" };
    if (Object.hasOwn(form, "allowed_values")) {
      if (!Array.isArray(form.allowed_values) || form.allowed_values.length === 0 || form.allowed_values.some((v) => !Buffer.isBuffer(v))) fail("allowed-values");
      result.allowed_values = [...form.allowed_values].sort((a, b) => Buffer.compare(encode(a), encode(b)));
      if (result.allowed_values.some((v, i) => i > 0 && v.equals(result.allowed_values[i - 1]))) fail("allowed-values");
    }
    return result;
  }
  if (form.form === "record") {
    exactKeys(form, ["form", "fields"], ["form", "fields"]);
    if (!form.fields || typeof form.fields !== "object" || Array.isArray(form.fields) || Object.keys(form.fields).length === 0) fail("record");
    const fields = {};
    for (const name of Object.keys(form.fields).sort((a, b) => Buffer.compare(encode(a), encode(b)))) {
      const field = form.fields[name];
      exactKeys(field, ["presence", "grammar"]);
      if (!["required", "optional"].includes(field.presence)) fail("presence");
      fields[name] = { presence: field.presence, grammar: normalizeField(field.grammar) };
    }
    return { form: "record", fields };
  }
  if (form.form === "sequence") {
    exactKeys(form, ["form", "element", "ordering_significant", "uniqueness", "min_items", "max_items"], ["form", "element", "ordering_significant", "uniqueness"]);
    if (typeof form.ordering_significant !== "boolean" || typeof form.uniqueness !== "boolean") fail("sequence");
    const result = { form: "sequence", element: normalizeField(form.element), ordering_significant: form.ordering_significant, uniqueness: form.uniqueness };
    for (const key of ["min_items", "max_items"]) if (Object.hasOwn(form, key)) {
      if (!Number.isSafeInteger(form[key]) || form[key] < 0) fail("sequence");
      if (key !== "min_items" || form[key] !== 0) result[key] = form[key];
    }
    if (Object.hasOwn(result, "min_items") && Object.hasOwn(result, "max_items") && result.min_items > result.max_items) fail("sequence");
    return result;
  }
  fail("field-form");
}

function comparisonRelevantForm(form) {
  if (["boolean", "text", "bytes"].includes(form.form)) {
    const result = { form: form.form };
    if (Object.hasOwn(form, "allowed_values")) result.allowed_values = form.allowed_values;
    return result;
  }
  if (form.form === "integer") {
    const result = { form: "integer" };
    if (Object.hasOwn(form, "scale")) result.scale = form.scale;
    if (Object.hasOwn(form, "allowed_values")) result.allowed_values = form.allowed_values;
    return result;
  }
  if (form.form === "record") {
    const fields = {};
    for (const [name, field] of Object.entries(form.fields)) fields[name] = { presence: field.presence, grammar: comparisonRelevantForm(field.grammar) };
    return { form: "record", fields };
  }
  if (form.form === "sequence") return { form: "sequence", element: comparisonRelevantForm(form.element), ordering_significant: form.ordering_significant, uniqueness: form.uniqueness };
  fail("comparison-form");
}

function normalizeComparison(comparison, value) {
  exactKeys(comparison, ["domain", "ordered"]);
  if (typeof comparison.ordered !== "boolean") fail("capability");
  if (comparison.ordered && value.form !== "integer") fail("ordered-form");
  return { domain: normalizeField(comparison.domain), ordered: comparison.ordered };
}

const ISSUER = { identifier: { form: "text" }, equality: "canonical" };
const SUBJECT_DOMAIN = { identifier: { form: "text" }, equality: "canonical" };
const SUBJECT_FORMS = new Set(["ActionContentReference", "ActionOccurrenceReference", "EventReference", "ExternalSubjectReference"]);

function normalizeDomain(domain) {
  exactKeys(domain, ["identifier", "equality"]);
  if (domain.equality !== "canonical") fail("domain");
  return { identifier: normalizeField(domain.identifier), equality: "canonical" };
}

function normalizeConstraints(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some((v) => !SUBJECT_FORMS.has(v))) fail("constraints");
  const result = [...values].sort((a, b) => Buffer.compare(encode(a), encode(b)));
  if (new Set(result).size !== result.length) fail("constraints");
  return result;
}

function normalizeSchema(source) {
  exactKeys(source, ["issuer_domain", "value_semantics", "subject_domain", "subject_domain_ref", "subject_constraints"], ["issuer_domain", "value_semantics"]);
  if (Object.hasOwn(source, "subject_domain") && Object.hasOwn(source, "subject_domain_ref")) fail("domain-xor");
  exactKeys(source.value_semantics, ["value", "comparison"], ["value"]);
  const value = normalizeField(source.value_semantics.value);
  const valueSemantics = { value };
  if (Object.hasOwn(source.value_semantics, "comparison")) valueSemantics.comparison = normalizeComparison(source.value_semantics.comparison, value);
  const result = { issuer_domain: normalizeDomain(source.issuer_domain), value_semantics: valueSemantics };
  if (source.subject_domain) result.subject_domain = normalizeDomain(source.subject_domain);
  if (source.subject_domain_ref) {
    if (source.subject_domain_ref !== "fixture://subject-domain/text") fail("domain-ref");
    result.subject_domain = normalizeDomain(SUBJECT_DOMAIN);
  }
  if (source.subject_constraints) result.subject_constraints = normalizeConstraints(source.subject_constraints);
  return result;
}

const textMarker = (text) => ({ form: "record", fields: { code: { presence: "required", grammar: { form: "text", allowed_values: [text] } } } });
const contextualMarker = (code, meaning) => ({ form: "record", fields: {
  code: { presence: "required", grammar: { form: "text", allowed_values: [code] } },
  meaning: { presence: "required", grammar: { form: "text", allowed_values: [meaning] } },
} });
const CAD_DOMAIN = contextualMarker("CAD", "Canadian dollars");
const USD_DOMAIN = contextualMarker("USD", "United States dollars");
const integer = (scale, lower, upper) => ({ form: "integer", ...(scale === undefined ? {} : { scale }), ...(lower === undefined ? {} : { lower_bound: { value: lower, inclusive: true } }), ...(upper === undefined ? {} : { upper_bound: { value: upper, inclusive: true } }) });
const schema = (value, domain, ordered) => ({ issuer_domain: ISSUER, value_semantics: { value, ...(domain ? { comparison: { domain, ordered } } : {}) } });

const ACCEPTED = {
  A1: schema(integer(0), textMarker("status-code"), false),
  A2: schema(integer(2, 0, 100000000), CAD_DOMAIN, true),
  A3: schema(integer(2, 0, 10000000), CAD_DOMAIN, true),
  A4: schema(integer(0), textMarker("unordered-integer"), false),
  A5: { issuer_domain: ISSUER, value_semantics: { value: { form: "boolean" } } },
  A6: schema({ form: "text" }, textMarker("status-text"), false),
};

const REJECTED = {
  R1: { ...ACCEPTED.A2, value_semantics: { ...ACCEPTED.A2.value_semantics, comparison: { ...ACCEPTED.A2.value_semantics.comparison, extra: true } } },
  R2: { ...ACCEPTED.A2, value_semantics: { ...ACCEPTED.A2.value_semantics, comparison: { domain: textMarker("CAD"), ordered: "yes" } } },
  R3: { ...ACCEPTED.A2, value_semantics: { ...ACCEPTED.A2.value_semantics, comparison: { domain: { form: "record", fields: {} }, ordered: true } } },
  R4: { ...ACCEPTED.A2, value_semantics: { ...ACCEPTED.A2.value_semantics, comparison_ref: "fixture://comparison/CAD" } },
  R5: { ...ACCEPTED.A2, comparison: ACCEPTED.A2.value_semantics.comparison },
  R6: { ...ACCEPTED.A2, value_semantics: { ...ACCEPTED.A2.value_semantics, comparison: { domain_id: "CAD", ordered: true } } },
  R8: { ...ACCEPTED.A2, value_semantics: { ...ACCEPTED.A2.value_semantics, comparison: { domain: textMarker("CAD"), ordered: true, normalization: "rescale" } } },
  R9: schema({ form: "boolean" }, textMarker("boolean"), true),
  R10: schema({ form: "text" }, textMarker("text"), true),
  R11: schema({ form: "bytes" }, textMarker("bytes"), true),
  R12: schema({ form: "record", fields: { x: { presence: "required", grammar: { form: "integer" } } } }, textMarker("record"), true),
  R13: schema({ form: "sequence", element: { form: "integer" }, ordering_significant: true, uniqueness: false }, textMarker("sequence"), true),
};

const canonical = {};
for (const [name, source] of Object.entries(ACCEPTED)) {
  const bytes = encode(normalizeSchema(source));
  canonical[name] = bytes;
  console.log(`${name} ${bytes.length} ${createHash("sha256").update(bytes).digest("hex")} ${bytes.toString("hex")}`);
}
for (const [name, source] of Object.entries(REJECTED)) assert.throws(() => normalizeSchema(source), undefined, name);

function comparisonTuple(source) {
  const normalized = normalizeSchema(source);
  const semantics = normalized.value_semantics;
  if (!semantics.comparison) fail("not-comparable");
  return { form: comparisonRelevantForm(semantics.value), domain: semantics.comparison.domain, ordered: semantics.comparison.ordered };
}

function comparable(left, right, relation) {
  const a = comparisonTuple(left);
  const b = comparisonTuple(right);
  if (relation !== "eq" && (!a.ordered || !b.ordered)) return false;
  return encode(a).equals(encode(b));
}

function locallyValidInteger(source, value) {
  if (!Number.isSafeInteger(value)) return false;
  const form = normalizeSchema(source).value_semantics.value;
  if (form.form !== "integer") return false;
  if (Object.hasOwn(form, "lower_bound") && (value < form.lower_bound.value || (value === form.lower_bound.value && !form.lower_bound.inclusive))) return false;
  if (Object.hasOwn(form, "upper_bound") && (value > form.upper_bound.value || (value === form.upper_bound.value && !form.upper_bound.inclusive))) return false;
  return !Object.hasOwn(form, "allowed_values") || form.allowed_values.includes(value);
}

function evaluate(left, leftValue, right, rightValue, relation) {
  if (!locallyValidInteger(left, leftValue) || !locallyValidInteger(right, rightValue)) return "not-comparable";
  if (!comparable(left, right, relation)) return "not-comparable";
  if (relation === "le") return leftValue <= rightValue;
  if (relation === "eq") return leftValue === rightValue;
  fail("unsupported-relation");
}

assert.equal(comparable(ACCEPTED.A2, ACCEPTED.A3, "le"), true, "Q5 differing bounds");
assert.equal(comparable(ACCEPTED.A2, schema(integer(2), USD_DOMAIN, true), "le"), false, "Q3 CAD/USD");
assert.equal(comparable(ACCEPTED.A2, schema(integer(0), CAD_DOMAIN, true), "le"), false, "Q6 scale mismatch");
assert.equal(comparable(ACCEPTED.A4, ACCEPTED.A4, "le"), false, "Q7 ordering unsupported");
assert.throws(() => comparisonTuple(ACCEPTED.A5), /not-comparable/, "R7 implied ordering");
assert.equal(comparable(ACCEPTED.A6, ACCEPTED.A6, "eq"), true, "non-integer equality");

assert.equal(evaluate(ACCEPTED.A2, 4_875_000, ACCEPTED.A3, 5_000_000, "le"), true, "Q1");
assert.equal(evaluate(ACCEPTED.A2, 5_000_100, ACCEPTED.A3, 5_000_000, "le"), false, "Q2");
assert.equal(comparable(ACCEPTED.A2, schema(integer(2), contextualMarker("COUNT", "unrelated integer count"), true), "le"), false, "Q4");
assert.equal(comparable(ACCEPTED.A2, ACCEPTED.A3, "le"), true, "Q8 semantic only; trust remains external");
assert.equal(comparable(ACCEPTED.A2, ACCEPTED.A3, "le"), true, "Q9 target-domain claim");

const cadDollars = schema(integer(2), contextualMarker("CAD", "Canadian dollars"), true);
const customerDebit = schema(integer(2), contextualMarker("CAD", "Customer Account Debit"), true);
assert.equal(comparable(cadDollars, customerDebit, "le"), false, "same label, distinct semantic structure");

const LEGACY_EXPECTED = new Map([
  ["V1.1-A", "a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e"],
  ["V1.1-B", "a36d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e"],
  ["V1.1-C", "a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e"],
  ["V1.1-D", "a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e7473846e4576656e745265666572656e636576416374696f6e436f6e74656e745265666572656e6365781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365"],
  ["V1.1-E", "a46d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746e7375626a6563745f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e737375626a6563745f636f6e73747261696e747382781845787465726e616c5375626a6563745265666572656e63657819416374696f6e4f6363757272656e63655265666572656e6365"],
]);
const LEGACY = {
  "V1.1-A": { issuer_domain: ISSUER, value_semantics: { value: { form: "boolean" } }, subject_domain: SUBJECT_DOMAIN },
  "V1.1-B": { issuer_domain: ISSUER, value_semantics: { value: { form: "boolean" } }, subject_domain_ref: "fixture://subject-domain/text" },
  "V1.1-C": { issuer_domain: ISSUER, value_semantics: { value: { form: "boolean" } } },
  "V1.1-D": { issuer_domain: ISSUER, value_semantics: { value: { form: "boolean" } }, subject_domain: SUBJECT_DOMAIN, subject_constraints: ["ActionOccurrenceReference", "ExternalSubjectReference", "ActionContentReference", "EventReference"] },
  "V1.1-E": { issuer_domain: ISSUER, value_semantics: { value: { form: "boolean" } }, subject_domain: SUBJECT_DOMAIN, subject_constraints: ["ActionOccurrenceReference", "ExternalSubjectReference"] },
};
for (const [name, source] of Object.entries(LEGACY)) assert.equal(encode(normalizeSchema(source)).toString("hex"), LEGACY_EXPECTED.get(name), `${name} direct replay`);

const legacy = encode(normalizeSchema(ACCEPTED.A5));
assert.equal(legacy.toString("hex"), "a26d6973737565725f646f6d61696ea268657175616c6974796963616e6f6e6963616c6a6964656e746966696572a164666f726d64746578746f76616c75655f73656d616e74696373a16576616c7565a164666f726d67626f6f6c65616e", "v1.1 no-op replay");
console.log(`PASS accepted=${Object.keys(ACCEPTED).length} rejected=13 q=9 legacy=5`);
