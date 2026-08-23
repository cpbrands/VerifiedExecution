#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";

const REQUIRED_FIELDS = [
  "id", "title", "version", "status", "document_type", "category", "author",
  "created", "updated", "depends_on", "supersedes", "superseded_by"
];
const ALLOWED_STATUSES = new Set(["Draft", "Proposed", "Review", "Accepted", "Approved", "Active", "Deprecated", "Superseded", "Withdrawn", "Archived", "Historical"]);
const ID_PATTERN = /^[A-Z][A-Z0-9]*(?:[-.][A-Z0-9]+)*$/;
const EXCLUDED_DIRECTORIES = new Set([".git", "node_modules", ".github"]);
const INTENTIONAL_DUPLICATE_BODIES = new Map();
const LIST_RELATIONSHIPS = ["depends_on", "related_documents"];
const SCALAR_RELATIONSHIPS = ["supersedes", "superseded_by"];
const NORMATIVE_DEPENDENCY_CATEGORIES = new Set(["Specification", "Conformance"]);

function filesUnder(root) {
  const result = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRECTORIES.has(entry.name)) result.push(...filesUnder(join(root, entry.name)));
    } else if (entry.isFile() && extname(entry.name) === ".md") result.push(join(root, entry.name));
  }
  return result.sort();
}

function scalar(value) {
  const trimmed = value.trim();
  if (trimmed === "null") return null;
  if (trimmed === "[]") return [];
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    try { return JSON.parse(trimmed); } catch { return trimmed.slice(1, -1); }
  }
  return trimmed;
}

function parseMetadataHeader(header, path, lineOffset = 2) {
  const metadata = {};
  let currentList = null;
  for (const [index, line] of header.split("\n").entries()) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const list = line.match(/^\s+-\s+(.+)$/);
    if (list) {
      if (!currentList || !Array.isArray(metadata[currentList])) return { error: `${path}:${index + lineOffset}: list item without a list field` };
      metadata[currentList].push(scalar(list[1]));
      continue;
    }
    const field = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!field) return { error: `${path}:${index + lineOffset}: malformed YAML field` };
    currentList = field[1];
    if (currentList in metadata) return { error: `${path}:${index + lineOffset}: duplicate YAML field: ${currentList}` };
    metadata[currentList] = field[2] === "" ? [] : scalar(field[2]);
  }
  return { metadata };
}

function hasAdditionalFrontMatter(body, path) {
  const lines = body.split("\n");
  let fence = null;
  for (let start = 0; start < lines.length; start++) {
    const fenceMatch = lines[start].match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === marker) fence = null;
      else if (!fence) fence = marker;
      continue;
    }
    if (fence || lines[start] !== "---") continue;
    for (let end = start + 1; end < lines.length; end++) {
      if (lines[end] !== "---") continue;
      const candidate = lines.slice(start + 1, end).join("\n");
      const parsed = parseMetadataHeader(candidate, path, start + 2);
      const metadataFields = parsed.error ? [] : Object.keys(parsed.metadata).filter(field => REQUIRED_FIELDS.includes(field));
      if (!parsed.error && ("id" in parsed.metadata || metadataFields.length >= 2)) return true;
      break;
    }
  }
  return false;
}

function parseFrontMatter(text, path) {
  if (!text.startsWith("---\n")) return { error: `${path}: missing YAML front matter at byte 0` };
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) return { error: `${path}: malformed YAML front matter` };
  const header = text.slice(4, end);
  const body = text.slice(end + 5);
  const parsed = parseMetadataHeader(header, path);
  if (parsed.error) return parsed;
  if (hasAdditionalFrontMatter(body, path)) return { error: `${path}: duplicate YAML front matter block` };
  return { metadata: parsed.metadata, body };
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function anchor(text) {
  return text.toLowerCase().trim().replace(/[<>]/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function anchors(body) {
  return new Set([...body.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)].map(match => anchor(match[1])));
}

function normalizedBody(body) {
  return body.split("\n").map(line => line.trimEnd()).join("\n").replace(/\n+$/, "");
}

function repeatedWholeBody(body) {
  const lines = normalizedBody(body).split("\n");
  if (lines.length < 4) return false;
  for (let size = 1; size <= Math.floor(lines.length / 2); size++) {
    if (lines.length % size !== 0) continue;
    const chunks = lines.length / size;
    if (chunks < 2) continue;
    const unit = lines.slice(0, size).join("\n");
    if (Array.from({ length: chunks }, (_, i) => lines.slice(i * size, (i + 1) * size).join("\n")).every(value => value === unit)) return true;
  }
  return false;
}

function relativeLinks(path, body, root, errors) {
  const sourceDir = dirname(path);
  for (const match of body.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1].replace(/^<|>$/g, "");
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(target)) continue;
    const [filePart, fragment] = target.split("#", 2);
    const targetPath = filePart ? resolve(sourceDir, filePart) : path;
    const fromRoot = relative(resolve(root), targetPath);
    if (fromRoot === ".." || fromRoot.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) || isAbsolute(fromRoot)) { errors.push(`${path}: link escapes repository: ${target}`); continue; }
    if (!existsSync(targetPath)) { errors.push(`${path}: broken relative link: ${target}`); continue; }
    const realTarget = realpathSync(targetPath);
    const realFromRoot = relative(realpathSync(root), realTarget);
    if (realFromRoot === ".." || realFromRoot.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) || isAbsolute(realFromRoot)) { errors.push(`${path}: link resolves outside repository: ${target}`); continue; }
    if (!statSync(targetPath).isFile()) { errors.push(`${path}: relative link is not a file: ${target}`); continue; }
    if (fragment) {
      const parsed = parseFrontMatter(readFileSync(targetPath, "utf8"), targetPath);
      let decodedFragment;
      try { decodedFragment = decodeURIComponent(fragment).toLowerCase(); } catch { errors.push(`${path}: invalid heading anchor encoding: ${target}`); continue; }
      if (parsed.error || !anchors(parsed.body).has(decodedFragment)) errors.push(`${path}: broken heading anchor: ${target}`);
    }
  }
}

function validateRelationships(document, byId, root, errors) {
  const location = relative(root, document.path);
  const allReferences = new Map();
  for (const field of LIST_RELATIONSHIPS) {
    const references = document.metadata[field];
    if (references === undefined && field === "related_documents") continue;
    if (!Array.isArray(references)) { errors.push(`${location}: ${field} must be a YAML list`); continue; }
    const seen = new Set();
    for (const reference of references) {
      if (typeof reference !== "string" || !ID_PATTERN.test(reference)) { errors.push(`${location}: invalid ${field} identifier: ${reference}`); continue; }
      if (reference === document.metadata.id) errors.push(`${location}: ${field} must not reference itself: ${reference}`);
      if (seen.has(reference)) errors.push(`${location}: duplicate ${field} identifier: ${reference}`);
      seen.add(reference);
      if (allReferences.has(reference)) errors.push(`${location}: relationship ${reference} is repeated in ${allReferences.get(reference)} and ${field}`);
      else allReferences.set(reference, field);
      if (!byId.has(reference)) errors.push(`${location}: unresolved ${field} identifier: ${reference}`);
      if (field === "depends_on" && NORMATIVE_DEPENDENCY_CATEGORIES.has(document.metadata.category) && byId.get(reference)?.metadata.category === "Non-normative Validation") errors.push(`${location}: normative document must not depend on non-normative validation document: ${reference}`);
    }
  }
  for (const field of SCALAR_RELATIONSHIPS) {
    const reference = document.metadata[field];
    if (reference !== null && (typeof reference !== "string" || !ID_PATTERN.test(reference))) { errors.push(`${location}: ${field} must be null or a document identifier`); continue; }
    if (reference === null) continue;
    if (reference === document.metadata.id) errors.push(`${location}: ${field} must not reference itself: ${reference}`);
    if (allReferences.has(reference)) errors.push(`${location}: relationship ${reference} is repeated in ${allReferences.get(reference)} and ${field}`);
    else allReferences.set(reference, field);
    const target = byId.get(reference);
    if (!target) continue;
    const reciprocal = field === "supersedes" ? "superseded_by" : "supersedes";
    if (target.metadata[reciprocal] !== document.metadata.id) errors.push(`${location}: ${field} relationship with ${reference} is not reciprocal`);
  }
}

export function validateDocumentation(root) {
  const errors = [];
  const documents = [];
  const byId = new Map();
  for (const path of filesUnder(root)) {
    const parsed = parseFrontMatter(readFileSync(path, "utf8"), relative(root, path));
    if (parsed.error) { errors.push(parsed.error); continue; }
    const { metadata, body } = parsed;
    for (const field of REQUIRED_FIELDS) if (!(field in metadata)) errors.push(`${relative(root, path)}: missing required metadata field: ${field}`);
    if (!ID_PATTERN.test(metadata.id ?? "")) errors.push(`${relative(root, path)}: invalid document id: ${metadata.id}`);
    if (!ALLOWED_STATUSES.has(metadata.status)) errors.push(`${relative(root, path)}: invalid status: ${metadata.status}`);
    for (const field of ["created", "updated"]) {
      const value = metadata[field];
      if (value === null) {
        if (field === "created" && !metadata.recovery_note) errors.push(`${relative(root, path)}: created: null requires recovery_note`);
      } else if (typeof value !== "string" || !isIsoDate(value)) errors.push(`${relative(root, path)}: invalid ${field} date: ${value}`);
    }
    for (const [field, value] of Object.entries(metadata)) if (typeof value === "string" && value.includes("YYYY-MM-DD")) errors.push(`${relative(root, path)}: unresolved placeholder in ${field}`);
    if (byId.has(metadata.id)) errors.push(`${relative(root, path)}: duplicate document id ${metadata.id} (also ${relative(root, byId.get(metadata.id).path)})`);
    else byId.set(metadata.id, { path, metadata, body });
    documents.push({ path, metadata, body });
  }
  for (const document of documents) {
    validateRelationships(document, byId, root, errors);
    relativeLinks(document.path, document.body, root, errors);
    if (repeatedWholeBody(document.body)) errors.push(`${relative(root, document.path)}: duplicated full body within document`);
  }
  const bodies = new Map();
  for (const document of documents) {
    const digest = createHash("sha256").update(normalizedBody(document.body)).digest("hex");
    const prior = bodies.get(digest);
    if (prior && !INTENTIONAL_DUPLICATE_BODIES.has(`${relative(root, prior.path)}|${relative(root, document.path)}`)) errors.push(`${relative(root, document.path)}: identical normalized body to ${relative(root, prior.path)}`);
    else bodies.set(digest, document);
  }
  return { errors, documents: documents.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = resolve(process.argv[2] ?? process.cwd());
  const result = validateDocumentation(root);
  if (result.errors.length) {
    console.error(`Documentation validation failed (${result.errors.length} error${result.errors.length === 1 ? "" : "s"}):`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else console.log(`Documentation validation passed: ${result.documents} Markdown documents checked.`);
}
