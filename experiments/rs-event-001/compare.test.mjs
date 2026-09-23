// Shared plumbing only: literal fixture expansion, process invocation, assertions.
// Neither implementation imports this file or receives case IDs / oracle data.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";

const directory = new URL("./", import.meta.url);
const root = new URL("../../", directory);
const fixtures = JSON.parse(readFileSync(new URL("fixtures.json", directory)));
const expectedBytes = readFileSync(new URL("expected.json", directory));
const oracle = JSON.parse(expectedBytes);
const python = readFileSync(new URL("append-first.py", directory), "utf8");
const javascript = readFileSync(new URL("history-first.mjs", directory), "utf8");
const baseline = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

function identity(label) {
  return label === null ? null : BigInt(fixtures.records[label].number).toString(16).padStart(64, "0");
}
function type(value) { return [fixtures.authorities[value[0]], value[1], value[2]]; }
function references(names) { return names.map(name => structuredClone(fixtures.references[name])); }

function expand(c) {
  // No semantic decisions: all memberships, predecessor choices, availability,
  // record mutations and admitted evidence are supplied by the fixture rows.
  const records = Object.fromEntries(Object.entries(fixtures.records).map(([label, row]) => {
    const event = {event_id: identity(label), action_id: fixtures.action.action_id,
      event_type: type(row.type), occurred_at: `2026-11-17T15:00:${row.second}Z`, spec_version: ["VE-002", "0.2"]};
    if (Object.hasOwn(row, "sequence")) event.sequence = row.sequence;
    if (row.references) event.references = row.references;
    Object.assign(event, c.recordChanges?.[label]);
    if (event.references) event.references = references(event.references);
    return [label, event];
  }));
  const fixed = {}, presented = {};
  for (const row of fixtures.contracts) {
    if (c.missing.includes(row.material)) continue;
    const definition = {...row, type: type(row.type), references: row.references === null ? null : references(row.references)};
    fixed[row.material] = definition;
    presented[row.material] = {...structuredClone(definition), ...c.presentedContractChanges?.[row.material]};
  }
  const available = ["TIME-A-1", "TIME-B-1", "VE-003", "RULE-CONTRACT"].filter(name => !c.missing.includes(name));
  return {
    action: structuredClone(fixtures.action),
    identifiers: fixtures.contracts.map(row => ({type: type(row.type), material: row.material})),
    fixed, presented, available,
    times: Object.fromEntries(Object.entries(fixtures.timeDomains).filter(([name]) => available.includes(name))),
    membership: c.history.map(identity),
    delivery: (c.delivery ?? c.history).map(label => structuredClone(records[label])),
    proposals: c.proposals.map(([label, predecessor, admitted]) => ({
      event: structuredClone(records[label]),
      assignment: c.unselected?.includes(label) ? null : {event_id: identity(label), predecessor: identity(predecessor), sequence: records[label].sequence},
      evidenceAdmitted: admitted, timeEstablished: true
    })),
    observation: c.observation ?? null,
    offeredReceipt: c.offeredReceipt ?? null,
    unselectedLaterDefinition: c.unselectedLaterDefinition ?? null
  };
}

function expected(c) {
  const e = oracle.cases.find(row => row.id === c.id);
  assert.ok(e?.source, "every oracle row has an independent source derivation");
  return {order: e.order.map(identity), state: e.state, rejected: e.rejected.map(identity),
    unsupported: e.unsupported.map(identity), partial: e.unsupported.length > 0, invalid: false};
}

function append(input, code = python) {
  const child = spawnSync(process.env.PYTHON ?? "python3", ["-B", "-c", code], {
    input: JSON.stringify(input), encoding: "utf8", timeout: 10000, maxBuffer: 1024 * 1024
  });
  assert.equal(child.error, undefined, `Python invocation: ${child.error}`);
  assert.equal(child.status, 0, child.stderr);
  return JSON.parse(child.stdout);
}

test("fixture/oracle coverage, immutable sources and pre-execution oracle fingerprint", () => {
  assert.equal(createHash("sha256").update(expectedBytes).digest("hex"), "b467cc87b9398625f0fb526906d8ff34f8df2c37f91b12240707d347715f4d88");
  assert.equal(fixtures.cases.length, 23);
  assert.equal(new Set(fixtures.cases.map(c => c.id)).size, 23);
  assert.deepEqual(oracle.cases.map(c => c.id), fixtures.cases.map(c => c.id));
  for (const [path, hash] of Object.entries(fixtures.sources)) {
    const bytes = readFileSync(new URL(path, root));
    assert.equal(createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex"), hash, path);
  }
  assert.ok(!python.includes("expected.json") && !javascript.includes("expected.json"));
  assert.ok(!python.includes("fixtures.json") && !javascript.includes("fixtures.json"));
});

for (const c of fixtures.cases) test(`case ${c.id}: Python / Node / source oracle`, () => {
  const input = expand(c);
  assert.ok(!Object.hasOwn(input, "id") && !Object.hasOwn(input, "expected"));
  const p = append(input);
  const r = baseline.replay(structuredClone(input));
  assert.deepEqual(p, expected(c), `${c.id}: append-first differs from source oracle`);
  assert.deepEqual(r, expected(c), `${c.id}: history-first differs from source oracle`);
  assert.deepEqual(p, r, `${c.id}: cross-implementation discrepancy`);
});

// Supplemental isolation probe: O1 has TWO unmet requirements (selection and
// evidence). This control holds admitted evidence true but removes selection,
// so an implementation cannot pass merely by rejecting on the other condition.
const selectionInput = expand(fixtures.cases.find(c => c.id === "V1"));
selectionInput.proposals[0].evidenceAdmitted = true;
selectionInput.proposals[0].assignment = null;
const selectionExpected = expected(fixtures.cases.find(c => c.id === "V1"));
test("supplemental: admitted evidence alone cannot choose a protected successor", () => {
  assert.deepEqual(append(selectionInput), selectionExpected);
  assert.deepEqual(baseline.replay(structuredClone(selectionInput)), selectionExpected);
});

test("supplemental: metadata and delivery do not create membership or authority", () => {
  const c = fixtures.cases.find(c => c.id === "B3");
  const input = expand({...c, id: "renamed-not-passed"});
  // Storage/delivery of an unadmitted terminal record cannot grant membership.
  input.delivery.push(expand(fixtures.cases.find(x => x.id === "R1")).delivery.at(-1));
  assert.deepEqual(append(input), expected(c));
  assert.deepEqual(baseline.replay(structuredClone(input)), expected(c));
});

test("supplemental: exact unavailable/uncertain time and actor domain fail closed", () => {
  const c = fixtures.cases.find(c => c.id === "R3");
  const start = expand(c);
  // Use the fixture's policy-evaluated contract with its permitted actor domain.
  const policy = expand(fixtures.cases.find(c => c.id === "B1")).proposals[3];
  for (const change of [{actor: "other-engine"}, {occurred_at: null}, {occurred_at: "2026-11-17T15:00:03.5Z"}]) {
    const input = structuredClone(start);
    input.proposals = [structuredClone(policy)];
    Object.assign(input.proposals[0].event, change);
    const wanted = {...expected(c), rejected: [identity("E04")]};
    assert.deepEqual(append(input), wanted);
    assert.deepEqual(baseline.replay(input), wanted);
  }
});

// Each mutation changes real semantic logic in memory. No production fault
// flags, case-ID switches, edited files, or output-only corruptions are used.
// A mutant must return a well-formed divergent result: crashes do not count.
const faults = [
  ["local-name authority collision", "T1",
    'x["type"] == event["event_type"]', 'x["type"][1:] == event["event_type"][1:]',
    'same(binding.type, record.event_type)', 'same(binding.type.slice(1), record.event_type.slice(1))'],
  ["accept retargeted definition", "T2",
    'if definition != fixed:', 'if False:',
    'if (!same(selected, input.fixed[name]))', 'if (false)'],
  ["ignore required dependency", "R4",
    'if any(d not in env["available"] for d in definition["dependencies"]):', 'if False:',
    'if (selected.dependencies.some(name => !input.available.includes(name)))', 'if (false)'],
  ["delivery order as history order", "D1",
    'return sorted(events, key=lambda event: ordinal(event["sequence"]))', 'return list(events)',
    'const index = result.findIndex(other => rank(other.sequence) > rank(record.sequence));', 'const index = -1;'],
  ["round uint64 through binary64", "S1",
    'return int(text)', 'return int(float(text))',
    'return BigInt(value);', 'return BigInt(Number(value));'],
  ["ignore actor null/domain", "N1",
    'if not actor_ok:', 'if False:',
    'if (!permitted)', 'if (false)'],
  ["reject opaque extension null", "N2",
    'status, contract = resolve(event, env)', 'if any(value is None for value in event.values()):\n        return "invalid", None\n    status, contract = resolve(event, env)',
    'const resolved = meaning(record, input);', 'if (Object.values(record).includes(null)) return {kind: "invalid"};\n  const resolved = meaning(record, input);'],
  ["reinterpret historical extension by later definition", "N3",
    'status, contract = resolve(event, env)', 'later = env["unselectedLaterDefinition"]\n    if later and later["field"] in event and event[later["field"]] is None:\n        return "invalid", None\n    status, contract = resolve(event, env)',
    'const resolved = meaning(record, input);', 'const later = input.unselectedLaterDefinition;\n  if (later && Object.hasOwn(record, later.field) && record[later.field] === null) return {kind: "invalid"};\n  const resolved = meaning(record, input);'],
  ["ignore reference permission", "R3",
    'if not references_ok:', 'if False:',
    'if (!referenceMatch)', 'if (false)'],
  ["accept unadmitted Receipt evidence", "V1",
    'status == "supported" and selected and evidence', 'status == "supported" and selected',
    'decision.kind === "supported" && assignmentMatches && factsEstablished && coherent(extension)', 'decision.kind === "supported" && assignmentMatches && coherent(extension)'],
  ["bypass protected selection", null,
    'status == "supported" and selected and evidence', 'status == "supported" and evidence',
    'decision.kind === "supported" && assignmentMatches && factsEstablished && coherent(extension)', 'decision.kind === "supported" && factsEstablished && coherent(extension)'],
  ["wrong terminal projection", "B1",
    '("EXECUTING", "EXECUTION_COMPLETED"): "COMPLETED"', '("EXECUTING", "EXECUTION_COMPLETED"): "FAILED"',
    '["EXECUTING", "EXECUTION_COMPLETED", "COMPLETED"]', '["EXECUTING", "EXECUTION_COMPLETED", "FAILED"]']
];

function replaceOnce(source, before, after) {
  assert.equal(source.split(before).length - 1, 1, `mutation site must be unique: ${before}`);
  return source.replace(before, after);
}
for (const [name, caseId, pBefore, pAfter, rBefore, rAfter] of faults) {
  const c = fixtures.cases.find(c => c.id === caseId);
  const input = c ? expand(c) : selectionInput;
  const wanted = c ? expected(c) : selectionExpected;
  test(`fault detected in Python: ${name}`, () => {
    const result = append(input, replaceOnce(python, pBefore, pAfter));
    assert.notDeepEqual(result, wanted, "semantic mutant escaped detection");
  });
  test(`fault detected in Node: ${name}`, async () => {
    const source = replaceOnce(javascript, rBefore, rAfter);
    const mutant = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
    const result = mutant.replay(structuredClone(input));
    assert.notDeepEqual(result, wanted, "semantic mutant escaped detection");
  });
}
