import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { validateDocumentation } from "../scripts/validate-documentation.mjs";

const header = (id, extra = "") => `---\nid: ${id}\ntitle: Test\nversion: 0.1\nstatus: Draft\ndocument_type: Test\ncategory: Test\nauthor: Verified Execution Editorial Board\ncreated: 2026-08-23\nupdated: 2026-08-23\ndepends_on: []\nrelated_documents: []\nsupersedes: null\nsuperseded_by: null\n${extra}---\n`;

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), "ve-docs-"));
  for (const [name, content] of Object.entries(files)) writeFileSync(join(root, name), content);
  return root;
}
function errorsFor(files) { const root = fixture(files); try { return validateDocumentation(root).errors; } finally { rmSync(root, { recursive: true, force: true }); } }

test("accepts a valid document", () => assert.deepEqual(errorsFor({ "valid.md": `${header("TEST-001")}# Valid\n` }), []));
test("rejects missing metadata", () => assert.match(errorsFor({ "missing.md": "# Missing\n" }).join("\n"), /missing YAML front matter/));
test("rejects an adjacent duplicate metadata block", () => assert.match(errorsFor({ "duplicate.md": `${header("TEST-001")}---\nid: TEST-002\n---\n# Body\n` }).join("\n"), /duplicate YAML/));
test("rejects a duplicate metadata block later in the body", () => assert.match(errorsFor({ "duplicate.md": `${header("TEST-001")}# Body\n\n---\nid: TEST-002\ntitle: Duplicate\n---\n` }).join("\n"), /duplicate YAML/));
test("rejects a malformed duplicate metadata block without an id", () => assert.match(errorsFor({ "duplicate.md": `${header("TEST-001")}# Body\n\n---\ntitle: Duplicate\nstatus: Draft\n---\n` }).join("\n"), /duplicate YAML/));
test("accepts legitimate thematic breaks", () => assert.deepEqual(errorsFor({ "breaks.md": `${header("TEST-001")}# One\n\n---\n\n## Two\n\n---\n\nText\n` }), []));
test("accepts a fenced YAML front-matter example", () => assert.deepEqual(errorsFor({ "example.md": `${header("TEST-001")}# Example\n\n\`\`\`yaml\n---\nid: EXAMPLE-001\ntitle: Example\n---\n\`\`\`\n` }), []));
test("rejects duplicate IDs", () => assert.match(errorsFor({ "a.md": `${header("TEST-001")}# A\n`, "b.md": `${header("TEST-001")}# B\n` }).join("\n"), /duplicate document id/));
test("rejects invalid dates", () => assert.match(errorsFor({ "date.md": `${header("TEST-001").replace("2026-08-23", "YYYY-MM-DD")}# Date\n` }).join("\n"), /invalid created date|unresolved placeholder/));
test("rejects invalid relationship structure", () => assert.match(errorsFor({ "dependency.md": `${header("TEST-001").replace("depends_on: []", "depends_on: TEST-002")}# Dependency\n` }).join("\n"), /depends_on must be a YAML list/));
test("rejects unresolved dependencies", () => assert.match(errorsFor({ "dependency.md": `${header("TEST-001").replace("depends_on: []", "depends_on:\n  - UNKNOWN")}# Dependency\n` }).join("\n"), /unresolved depends_on/));
test("rejects unresolved related documents", () => assert.match(errorsFor({ "related.md": `${header("TEST-001").replace("related_documents: []", "related_documents:\n  - UNKNOWN")}# Related\n` }).join("\n"), /unresolved related_documents/));
test("rejects relationship self-references", () => assert.match(errorsFor({ "self.md": `${header("TEST-001").replace("depends_on: []", "depends_on:\n  - TEST-001")}# Self\n` }).join("\n"), /must not reference itself/));
test("rejects duplicate relationships", () => assert.match(errorsFor({ "duplicate.md": `${header("TEST-001").replace("depends_on: []", "depends_on:\n  - TEST-002\n  - TEST-002")}# Duplicate\n`, "target.md": `${header("TEST-002")}# Target\n` }).join("\n"), /duplicate depends_on/));
test("rejects the same target in multiple relationship fields", () => assert.match(errorsFor({ "duplicate.md": `${header("TEST-001").replace("depends_on: []", "depends_on:\n  - TEST-002").replace("related_documents: []", "related_documents:\n  - TEST-002")}# Duplicate\n`, "target.md": `${header("TEST-002")}# Target\n` }).join("\n"), /relationship TEST-002 is repeated/));
test("rejects invalid scalar relationship types", () => assert.match(errorsFor({ "supersedes.md": `${header("TEST-001").replace("supersedes: null", "supersedes: []")}# Invalid\n` }).join("\n"), /supersedes must be null or a document identifier/));
test("rejects non-reciprocal supersession", () => assert.match(errorsFor({ "new.md": `${header("TEST-002").replace("supersedes: null", "supersedes: TEST-001")}# New\n`, "old.md": `${header("TEST-001")}# Old\n` }).join("\n"), /not reciprocal/));
test("accepts reciprocal supersession", () => assert.deepEqual(errorsFor({ "new.md": `${header("TEST-002").replace("supersedes: null", "supersedes: TEST-001")}# New\n`, "old.md": `${header("TEST-001").replace("superseded_by: null", "superseded_by: TEST-002")}# Old\n` }), []));
test("rejects specification dependencies on non-normative validation", () => assert.match(errorsFor({ "spec.md": `${header("SPEC-001").replace("document_type: Test", "document_type: Specification").replace("category: Test", "category: Specification").replace("depends_on: []", "depends_on:\n  - TEST-001")}# Spec\n`, "test.md": `${header("TEST-001").replace("category: Test", "category: Non-normative Validation")}# Test\n` }).join("\n"), /must not depend on non-normative/));
test("rejects conformance dependencies on non-normative validation", () => assert.match(errorsFor({ "claim.md": `${header("CONFORMANCE").replace("document_type: Test", "document_type: Standard").replace("category: Test", "category: Conformance").replace("depends_on: []", "depends_on:\n  - TEST-001")}# Conformance\n`, "test.md": `${header("TEST-001").replace("category: Test", "category: Non-normative Validation")}# Test\n` }).join("\n"), /must not depend on non-normative/));
test("accepts conformance documents without prohibited dependencies", () => assert.deepEqual(errorsFor({ "claim.md": `${header("CONFORMANCE").replace("document_type: Test", "document_type: Standard").replace("category: Test", "category: Conformance")}# Conformance\n` }), []));
test("allows unrelated categories to depend on non-normative validation", () => assert.deepEqual(errorsFor({ "guide.md": `${header("GUIDE-001").replace("document_type: Test", "document_type: Repository Guide").replace("category: Test", "category: Navigation").replace("depends_on: []", "depends_on:\n  - TEST-001")}# Guide\n`, "test.md": `${header("TEST-001").replace("category: Test", "category: Non-normative Validation")}# Test\n` }), []));
test("rejects broken file links", () => assert.match(errorsFor({ "links.md": `${header("TEST-001")}# Links\n[missing](missing.md)\n` }).join("\n"), /broken relative link/));
test("rejects broken image links", () => assert.match(errorsFor({ "images.md": `${header("TEST-001")}# Images\n![missing](missing.png)\n` }).join("\n"), /broken relative link/));
test("rejects broken anchors", () => assert.match(errorsFor({ "anchors.md": `${header("TEST-001")}# Links\n[missing](#absent)\n` }).join("\n"), /broken heading anchor/));
test("rejects a body duplicated within one document", () => assert.match(errorsFor({ "body.md": `${header("TEST-001")}# Same\nText\n# Same\nText\n` }).join("\n"), /duplicated full body/));
test("rejects identical bodies in two documents", () => assert.match(errorsFor({ "a.md": `${header("TEST-001")}# Same\n`, "b.md": `${header("TEST-002")}# Same\n` }).join("\n"), /identical normalized body/));
