// Bounded non-normative experiment. No imports, files, oracle, or case IDs.
// History-first: build an occurrence index from explicitly supplied membership,
// check candidate extensions as constraints, then lazily interpret the stream.
const CEILING = 18446744073709551615n;

function rank(value) {
  if (typeof value !== "string" || !/^(0|[1-9][0-9]*)$/.test(value)) throw Error("bad local ordinal");
  return BigInt(value);
}

function same(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && same(a[k], b[k]));
}

function arrange(records) {
  // Insertion ordering independent of Python's sort and any fixture order.
  const result = [];
  for (const record of records) {
    const index = result.findIndex(other => rank(other.sequence) > rank(record.sequence));
    result.splice(index < 0 ? result.length : index, 0, record);
  }
  return result;
}

function meaning(record, input) {
  const choices = input.identifiers.filter(binding => same(binding.type, record.event_type));
  if (choices.length !== 1) return {kind: "unsupported"};
  const name = choices[0].material;
  const selected = input.presented[name];
  if (!selected || !input.fixed[name]) return {kind: "unsupported"};
  if (!same(selected, input.fixed[name])) return {kind: "invalid"};
  if (selected.dependencies.some(name => !input.available.includes(name))) return {kind: "unsupported"};
  return {kind: "supported", selected};
}

function inspect(record, input) {
  const required = ["event_id", "action_id", "event_type", "occurred_at", "sequence", "spec_version"];
  if (!required.every(k => Object.hasOwn(record, k) && record[k] !== null)) return {kind: "invalid"};
  if (typeof record.event_id !== "string" || !/^[0-9a-f]{64}$/.test(record.event_id)) return {kind: "invalid"};
  if (record.action_id !== input.action.action_id) return {kind: "invalid"};
  if (!same(record.spec_version, ["VE-002", "0.2"])) return {kind: "unsupported"};
  if (rank(record.sequence) > CEILING) return {kind: "invalid"};
  const resolved = meaning(record, input);
  if (resolved.kind !== "supported") return resolved;
  const contract = resolved.selected;
  const clock = input.times[contract.time];
  const permissibleTimes = Array.from({length: clock.maximumSecond - clock.minimumSecond + 1}, (_, n) =>
    `${clock.date}T${clock.hourMinute}:${String(n + clock.minimumSecond).padStart(2, "0")}Z`);
  if (!permissibleTimes.includes(record.occurred_at)) return {kind: "invalid"};
  for (const key of ["actor", "component", "payload"]) {
    if (!Object.hasOwn(record, key)) continue;
    const permitted = key === "actor" && contract.actor && record[key] === "scenario-policy-engine";
    if (!permitted) return {kind: "invalid"};
  }
  const referenceMatch = contract.references === null ? !Object.hasOwn(record, "references") : same(record.references, contract.references);
  if (!referenceMatch) return {kind: "invalid"};
  return resolved;
}

function coherent(history) {
  return history.every((r, index) => rank(r.sequence) <= CEILING &&
    (index === 0 || rank(history[index - 1].sequence) < rank(r.sequence)) &&
    history.findIndex(other => other.event_id === r.event_id) === index);
}

export function replay(input) {
  const directory = new Map();
  let invalid = false;
  for (const record of input.delivery) {
    if (!input.membership.includes(record.event_id)) continue;
    if (directory.has(record.event_id) && !same(directory.get(record.event_id), record)) invalid = true;
    else directory.set(record.event_id, record);
  }
  let history = arrange([...directory.values()]);
  invalid ||= input.membership.some(id => !directory.has(id)) || !coherent(history);
  const rejected = [];
  if (!invalid) for (const candidate of input.proposals) {
    const event = candidate.event;
    const previous = history.at(-1);
    const saturated = previous !== undefined && rank(previous.sequence) === CEILING;
    if (saturated) { rejected.push(event.event_id); continue; }
    const decision = inspect(event, input);
    const a = candidate.assignment;
    const assignmentMatches = a !== null && a.event_id === event.event_id && a.predecessor === (previous?.event_id ?? null) && a.sequence === event.sequence;
    const factsEstablished = candidate.evidenceAdmitted && candidate.timeEstablished;
    const extension = [...history, event];
    if (decision.kind === "supported" && assignmentMatches && factsEstablished && coherent(extension)) {
      directory.set(event.event_id, event);
      history = arrange([...directory.values()]);
    } else rejected.push(event.event_id);
  }

  // VE-003's bounded relation is encoded separately, not imported from P.
  const relation = [
    [null, "ACTION_CREATED", "CREATED"],
    ["CREATED", "VALIDATION_STARTED", "VALIDATING"],
    ["VALIDATING", "VALIDATION_SUCCEEDED", "READY"],
    ["READY", "AUTHORIZATION_GRANTED", "AUTHORIZED"],
    ["AUTHORIZED", "EXECUTION_STARTED", "EXECUTING"],
    ["EXECUTING", "EXECUTION_COMPLETED", "COMPLETED"],
    ["EXECUTING", "EXECUTION_FAILED", "FAILED"]
  ];
  const unsupported = [];
  let state = null;
  if (!invalid) for (const record of history) {
    const descriptor = inspect(record, input);
    if (descriptor.kind === "unsupported") { unsupported.push(record.event_id); continue; }
    if (descriptor.kind !== "supported") { invalid = true; break; }
    if (descriptor.selected.trigger === null) continue;
    const matches = relation.filter(([before, trigger]) => before === state && trigger === descriptor.selected.trigger);
    if (matches.length !== 1) { invalid = true; break; }
    state = matches[0][2];
  }
  return {order: history.map(r => r.event_id), state, rejected, unsupported, partial: unsupported.length > 0, invalid};
}
