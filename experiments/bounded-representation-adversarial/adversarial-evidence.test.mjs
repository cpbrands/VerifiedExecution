import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const budgets=JSON.parse(readFileSync(new URL('budgets.json',import.meta.url)));
const cases=JSON.parse(readFileSync(new URL('cases.json',import.meta.url)));
const results=JSON.parse(readFileSync(new URL('results.json',import.meta.url)));

test('adversarial manifest has unique bounded cases and all threat mappings',()=>{
  const ids=cases.cases.map(c=>c.id);assert.equal(new Set(ids).size,ids.length);
  assert.ok(cases.cases.reduce((sum,c)=>sum+c.repetitions,0)<=budgets.aggregate.attempts);
  assert.ok(cases.cases.every(c=>c.repetitions>=1&&c.repetitions<=budgets.aggregate.repetitionsPerCase));
  for(const threat of ['T03','T04','T05','T06','T11','T12','T13'])assert.ok(cases.cases.some(c=>c.threats.includes(threat)),threat);
});

test('recorded results cover every declared repetition without skips',()=>{
  const expected=cases.cases.flatMap(c=>Array.from({length:c.repetitions},(_,i)=>`${c.id}#${i+1}`));
  assert.deepEqual(results.attempts.map(a=>a.attemptId),expected);
  assert.equal(results.summary.attempts,expected.length);
  assert.equal(results.summary.failure,0);assert.equal(results.summary.inconclusive,0);
});

test('required outcome classes and the isolated calendar control are recorded',()=>{
  const classes=new Set(results.attempts.map(a=>a.outcomeClass));
  for(const value of ['valid-resource-intensive','malformed-carrier-rejection','canonical-field-domain-violation','unsupported-interpretation','resource-unavailable-incomplete','harness-process-failure','authentication-establishment-failure'])assert.ok(classes.has(value),value);
  const year0=results.attempts.find(a=>a.caseId==='calendar-year-zero');
  const year1=results.attempts.find(a=>a.caseId==='calendar-year-one-control');
  assert.deepEqual(year0.actualOutcome,{A:'domain/positive',B:'domain/positive'});
  assert.deepEqual(year1.actualOutcome,{A:'accepted',B:'accepted'});
  assert.equal(year0.classification,'pass');assert.equal(year1.classification,'pass');
});

test('resource outcomes, presentation, and aftermath stay distinct',()=>{
  const incomplete=results.attempts.find(a=>a.caseId==='resource-size-declaration');
  assert.equal(incomplete.evidenceDisposition,'expected-incomplete-processing');
  assert.deepEqual(incomplete.actualOutcome,{A:'processing-incomplete/resource-limit',B:'processing-incomplete/resource-limit'});
  const text=results.attempts.find(a=>a.caseId==='valid-text-controls');assert.equal(text.presentation.view,'code-points-and-digest-only');
  const fd=results.attempts.find(a=>a.caseId==='controlled-fd-cutoff');assert.equal(fd.caseObservations.openedDescriptors,fd.caseObservations.closedDescriptors);
  for(const a of results.attempts){assert.equal(a.aftermath.processGroupSurvived,false);assert.deepEqual(a.aftermath.tempResidueAfterCleanup,[]);assert.equal(a.aftermath.cleanupError,null);assert.ok(a.resources.peakTempBytes<=budgets.perAttempt.fileBytes);}
});
