import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {fixtures,oracle,python,javascript,digest,directory,provenance,historical,verifyBytes,expand,validateSuite,inputFor,invoke,outputShape,compareResult,comparePair} from './compare.mjs';
import {evaluate} from './rule-graph.mjs';
const catalog=provenance();
const samples=new Map(fixtures.cases.map(c=>[c.id,inputFor(c,catalog)]));
const I=n=>n===null?null:n.toString(16).padStart(64,'0');
test('exact fixture/oracle provenance and exhaustive category partition',()=>{
  validateSuite();
  assert.equal(digest(readFileSync(new URL('fixtures.json',directory))),'8593fd1931fa98402922fb6ae4de224fd067c56b9cf0af9a4dc1c31eaa9cd334');
  assert.equal(digest(readFileSync(new URL('oracle.json',directory))),'15cca894f32b03650abe1c4e0046bb37802b9bb77f83b4b2f53aa50b434d350a');
  assert.equal(fixtures.sources[0].commit,'cc91ae116959ad6535b3d2b5b5f6ac602e651587');
  assert.equal(fixtures.sources[0].blob,'860c6430f7127ca89ed03f3f8b8963789a0b236e');
  assert.equal(fixtures.sources[0].sha256,'efb03a4ff5d4e105b0bac5be99a23f6e23ef777368ac0ee95d6239004e98ee20');
  assert.equal(fixtures.sources[1].blob,'a8a88e94be403be9ffc0efd01986a5db9446757e');
  assert.equal(fixtures.sources[1].sha256,'dfd184858a0a925c8da37c67a2ddd6c69e89f7ed064446779ed2122950e98c2b');
  for(const code of [python,javascript]){
    assert.ok(!/oracle|fixtures\.json|compare\.mjs|rs-event-001/.test(code.replace(/^.*(?:oracle|fixture IDs).*$/gm,'')),'evaluator must not import oracle, other evaluator or old semantics');
  }
});
test('every pinned source rejects a changed byte; both fingerprint algorithms are enforced',()=>{
  for(const pin of fixtures.sources){const bytes=historical(pin);verifyBytes(pin,bytes);const changed=Buffer.from(bytes);changed[changed.length-1]^=1;assert.throws(()=>verifyBytes(pin,changed),/pinned blob mismatch/);assert.throws(()=>verifyBytes({...pin,sha256:'0'.repeat(64)},bytes),/pinned SHA-256 mismatch/);}
});
test('missing commit and path fail closed, even if the current checkout has that path',()=>{
  assert.throws(()=>historical({...fixtures.sources[0],commit:'0'.repeat(40)}),/historical source unavailable/);
  assert.throws(()=>historical({...fixtures.sources[0],path:'experiments/rs-event-002/fixtures.json'}),/historical source unavailable/);
  assert.throws(()=>verifyBytes(fixtures.sources[0],historical(fixtures.sources[1])),/pinned blob mismatch/);
});
test('all 39 literal Text blocks are copied exactly, including completed FX and KN',()=>{
  const source=catalog[fixtures.sources[0].path];
  const blocks=[...source.matchAll(/^([A-Z][A-Z0-9-]*):\n```text\n([^\n]+)\n```/gm)];
  assert.equal(blocks.length,39);
  const texts=new Set();
  const visit=v=>{if(typeof v==='string')texts.add(v);else if(v&&typeof v==='object')Object.values(v).forEach(visit);};
  for(const input of samples.values())visit(input);
  for(const [,name,value]of blocks)assert.ok(texts.has(value),`missing or altered literal ${name}`);
});
test('standalone CLI reproduces all cases after module initialization',()=>{
  const r=spawnSync(process.execPath,[fileURLToPath(new URL('compare.mjs',directory))],{encoding:'utf8',timeout:60000});
  assert.equal(r.error,undefined,'CLI process failure');assert.equal(r.status,0,r.stderr);
  assert.deepEqual(JSON.parse(r.stdout),{cases:87,counts:{accept:19,reject:55,unselected:1,unestablished:6,unsupported:6},sourcePins:55});
});

for(const [index,c]of fixtures.cases.entries())test(`RS-EVENT-002 ${c.id}: two evaluators / independently transcribed oracle`,async()=>{
  const input=samples.get(c.id);
  assert.ok(!Object.hasOwn(input,'id')&&!Object.hasOwn(input,'category')&&!Object.hasOwn(input,'expected'));
  const p=await invoke(input),j=evaluate(structuredClone(input));
  comparePair(p,j,oracle.rows[index]);
});

// Runner controls fail through the actual comparison/validation functions.
const controls=[
  ['missing case',f=>f.cases.pop()],
  ['duplicate case',f=>f.cases[1]=f.cases[0]],
  ['extra case',f=>f.cases.push(f.cases[0])],
  ['unknown category',f=>f.cases[0].category='other'],
  ['skip marker',f=>f.cases[0].skip=true],
  ['missing fixture reference',f=>f.cases[0].input={$ref:'absent'}],
  ['cyclic fixture reference',f=>{f.definitions.cycle={$ref:'cycle'};f.cases[0].input={$ref:'cycle'};}],
  ['malformed input',f=>f.cases[0].input={history:[]}]
];
for(const [name,change]of controls)test(`runner control: ${name}`,()=>{const f=structuredClone(fixtures);change(f);assert.throws(()=>validateSuite(f,oracle));});
test('runner control: missing/duplicate/extra oracle cases',()=>{
  for(const alter of [o=>o.rows.pop(),o=>o.rows[1]=o.rows[0],o=>o.rows.push(o.rows[0])]){const o=structuredClone(oracle);alter(o);assert.throws(()=>validateSuite(fixtures,o));}
});
test('runner control: valid-shaped wrong outcome and wrong obligation are rejected',()=>{
  const actual=evaluate(samples.get('06'));
  assert.throws(()=>compareResult({...actual,state:'FAILED'},oracle.rows[5]),/oracle mismatch/);
  assert.throws(()=>compareResult({...actual,obligations:['wrong']},oracle.rows[5]),/oracle obligation/);
});
test('runner control: evaluator disagreement fails even when each satisfies the oracle summary',()=>{
  const a=evaluate(samples.get('06')),b={...a,obligations:[...a.obligations,'unexpected-extra-reason']};
  compareResult(a,oracle.rows[5]);compareResult(b,oracle.rows[5]);
  assert.throws(()=>comparePair(a,b,oracle.rows[5]),/evaluator disagreement 06/);
});
test('runner control: subprocess nonzero, missing executable, malformed output and skipped output',async()=>{
  await assert.rejects(()=>invoke({},'raise RuntimeError("control")'),/subprocess failed/);
  await assert.rejects(()=>invoke({},python,'/nonexistent-rs-event-002-python'),/subprocess failed/);
  await assert.rejects(()=>invoke({},'print("not-json")'),/malformed evaluator output/);
  await assert.rejects(()=>invoke({},'print("{}")'));
});

// Mutants alter admission/projection code in memory, never the fixtures or
// oracle. Each witness specifies the exact unsafe/incorrect semantic symptom.
// A crash, unchanged result, missing obligation, or malformed output fails.
const faults=[];
function fault(name,witnesses,py,js){faults.push({name,witnesses,py,js});}
const witness=(id,classification,state,obligation,complete=true)=>({id,classification,state,obligation,complete});
const accept=(id,state='COMPLETED')=>witness(id,'accept',state,'admit');
const replace=(code,edits)=>{for(const [before,after]of edits){assert.equal(code.split(before).length-1,1,`unique mutation site: ${before}`);code=code.replace(before,after);}return code;};

for(const [i,kind,from,to]of [[1,'ACTION_CREATED','NONE','CREATED'],[2,'VALIDATION_STARTED','CREATED','VALIDATING'],[3,'VALIDATION_SUCCEEDED','VALIDATING','READY'],[4,'AUTHORIZATION_GRANTED','READY','AUTHORIZED'],[5,'EXECUTION_STARTED','AUTHORIZED','EXECUTING'],[6,'EXECUTION_COMPLETED','EXECUTING','COMPLETED'],[7,'EXECUTION_FAILED','EXECUTING','FAILED']]){
  const wrong=to==='FAILED'?'COMPLETED':'FAILED';
  fault(`mapping-${kind}`,[accept(String(i).padStart(2,'0'),wrong)],[[`('${from}', '${kind}'): '${to}'`,`('${from}', '${kind}'): '${wrong}'`]],[[`['${kind}', '${from}', '${to}']`,`['${kind}', '${from}', '${wrong}']`]]);
}
fault('binding',Array.from({length:8},(_,i)=>accept(String(i+16))).concat(accept('47')),
  [["if not eq(a['binding'], B):","if False:"]],[["require(equal(a.binding,binding),'binding');","require(true,'binding');"]]);
fault('fact-required',[accept('24'),accept('86','FAILED')],[["if 'established' not in facts:","if False:"]],[["require(values('fact').includes('established'),'fact-missing','unestablished');","require(true,'fact-missing','unestablished');"]]);
fault('refuted',[witness('26','unestablished','EXECUTING','fact-missing'),witness('78','unestablished','CREATED','fact-missing'),witness('79','unestablished','AUTHORIZED','fact-missing')],[["if 'refuted' in facts:","if False:"]],[["require(!values('fact').includes('refuted'),'fact-refuted');","require(true,'fact-refuted');"]]);
fault('unknown-is-negative',[witness('34','reject','EXECUTING','fact-refuted')],[["if 'refuted' in facts:","if 'refuted' in facts or 'unknown' in facts:"]],[["require(!values('fact').includes('refuted'),'fact-refuted');","require(!values('fact').some(v=>v==='refuted'||v==='unknown'),'fact-refuted');"]]);
// Context and assessment sites are independently identified using surrounding text.
const failedPy=[["        if p['status'] == 'failed':\n            add('reject', 'establishment-failed')","        if p['status'] == 'failed':\n            pass"],["            if p['status'] == 'failed':\n                add('reject', 'establishment-failed')","            if False:\n                add('reject', 'establishment-failed')"]];
const failedJS=[["require(p.status!=='failed','establishment-failed');","require(true,'establishment-failed');"],["require(w.status!=='failed','establishment-failed');","require(true,'establishment-failed');"]];
fault('failed-establishment',[accept('28'),accept('54','AUTHORIZED'),accept('55','AUTHORIZED'),accept('56','AUTHORIZED')],failedPy,failedJS);
const absentPy=[["elif p['status'] != 'verified':","elif False:"],["if not matches or any(p['status'] == 'unavailable' for p in matches):","if False:"]];
const absentJS=[["require(p.status==='verified'||p.status==='failed','establishment-unavailable','unsupported');","require(true,'establishment-unavailable','unsupported');"],["require(witnesses.length>0&&!witnesses.some(w=>w.status==='unavailable'),'establishment-unavailable','unsupported');","require(true,'establishment-unavailable','unsupported');"]];
fault('unavailable-establishment',[accept('27'),accept('53','AUTHORIZED'),witness('73','accept','COMPLETED','replay')],absentPy,absentJS);
fault('scope-authority',[accept('29'),accept('84')],failedPy.concat([
  ["if a['role'] != needed or not any(s['name'] == a['source'] and a['role'] in s['roles'] for s in C['sources']):","if False:"],
  ["if not eq(p['grant'], {'source': a['source'], 'role': a['role'], 'statement': a['statement'], 'binding': a['binding']}):","if False:"]
]),failedJS.concat([
  ["require(a.role===role && ctx.sources.some(s=>s.name===a.source&&s.roles.includes(a.role)) && (!condition||condition.evaluator===a.source),'authority');","require(true,'authority');"],
  ["require(equal(w.grant,{source:a.source,role:a.role,statement:a.statement,binding:a.binding}),'authority');","require(true,'authority');"]
]));
fault('condition-required',[accept('31','READY')],[["if 'satisfied' not in rs:","if False:"]],[["require(rs.includes('satisfied'),'condition-missing','unestablished');","require(true,'condition-missing','unestablished');"]]);
fault('condition-denied',[witness('32','unestablished','READY','condition-missing')],[["if 'unsatisfied' in rs:","if False:"]],[["require(!rs.includes('unsatisfied'),'condition-denied');","require(true,'condition-denied');"]]);
fault('optional-becomes-required',[witness('87','reject','CREATED','condition-denied')],[["if c['category'] not in required_categories:","if c['category'] not in (['policy'] if kind == 'VALIDATION_STARTED' else required_categories):"]],[["if(!demanded.includes(condition.category))return;","if(!(kind==='VALIDATION_STARTED'?['policy']:demanded).includes(condition.category))return;"]]);
fault('contradiction',[accept('85','VALIDATING')],[["if a['statement'] != 'time' and any(not eq(r, definite[0]) for r in definite[1:]):","if False:"]],[["require(a.statement==='time'||new Set(definite.map(v=>signature(v))).size<=1,'contradiction');","require(true,'contradiction');"]]);
fault('commit-required',[accept('35')],[["if 'committed' not in rs:","if False:"]],[["require(rs.includes('committed'),'commit-missing','unestablished');","require(true,'commit-missing','unestablished');"]]);
fault('commit-denied',[witness('36','unestablished','EXECUTING','commit-missing')],[["if any(r in ('not_committed', 'not_applicable') for r in rs):","if False:"]],[["require(!rs.some(r=>r==='not_committed'||r==='not_applicable'),'commit-denied');","require(true,'commit-denied');"]]);
fault('time-required',[accept('41'),accept('42')],[["if not times:","if False:"]],[["require(bounds.length>0,'time-missing','unestablished');","require(true,'time-missing','unestablished');"]]);
fault('time-disagreement',[accept('39'),accept('40')],[["if any(not eq(r, times[0]) for r in times[1:]):","if False:"],["if any(not eq(r, e['occurred_at']) for r in times):","if False:"]],[["require(new Set(bounds.map(v=>signature(v))).size<=1,'time-conflict');","require(true,'time-conflict');"],["require(bounds.every(t=>equal(t,e.occurred_at)),'time-event');","require(true,'time-event');"]]);
fault('time-event',[accept('49')],[["if any(not eq(r, e['occurred_at']) for r in times):","if False:"]],[["require(bounds.every(t=>equal(t,e.occurred_at)),'time-event');","require(true,'time-event');"]]);
fault('time-domain',['43','44','45','46','48'].map(id=>accept(id)),[["if not interval(e['occurred_at']):","if False:"],["if any(not interval(r) for r in times):","if False:"]],[["require(boundDomain(e.occurred_at),'time-domain');","require(true,'time-domain');"],["require(bounds.every(boundDomain),'time-domain');","require(true,'time-domain');"]]);
fault('time-equal-corroboration',[witness('38','reject','EXECUTING','time-conflict'),witness('83','reject','EXECUTING','time-conflict')],[["if any(not eq(r, times[0]) for r in times[1:]):","if len(times) > 1:"]],[["require(new Set(bounds.map(v=>signature(v))).size<=1,'time-conflict');","require(bounds.length<=1,'time-conflict');"]]);
fault('point-time',[witness('82','reject','EXECUTING','time-domain')],[["a[6]*b[7] <= b[6]*a[7]","a[6]*b[7] < b[6]*a[7]"]],[["v.earliest[6]*v.latest[7] <= v.latest[6]*v.earliest[7]","v.earliest[6]*v.latest[7] < v.latest[6]*v.earliest[7]"]]);
fault('sequence-domain',['58','59','13'].map(id=>accept(id,id==='58'?'CREATED':'COMPLETED')),[["if type(e['sequence']) is not int or not 0 <= e['sequence'] <= 18446744073709551615:","if False:"]],[["require(typeof e.sequence==='bigint'&&e.sequence>=0n&&e.sequence<=18446744073709551615n,'sequence-domain');","require(true,'sequence-domain');"]]);
fault('integer-narrowing',[witness('12','reject','AUTHORIZED','sequence-domain')],[["return int(s)","return int(float(s))"]],[["return BigInt(v.integer);","return BigInt(Number(v.integer));"]]);
fault('zero-sequence',[witness('70','reject',null,'sequence-domain')],[["not 0 <= e['sequence'] <= 18446744073709551615","not 1 <= e['sequence'] <= 18446744073709551615"]],[["e.sequence>=0n","e.sequence>=1n"]]);
fault('sequence-order',[accept('11')],[["if ordinal is not None and e['sequence'] <= ordinal:","if False:"]],[["require(previous.ordinal===null || e.sequence>previous.ordinal,'sequence-order');","require(true,'sequence-order');"]]);
fault('occurrence-reuse',[accept('15')],[["if e['event_id'] in used:","if False:"]],[["require(!previous.ids.includes(e.event_id),'id-reuse');","require(true,'id-reuse');"]]);
fault('occurrence-width',[accept('57')],[["if not isinstance(e['event_id'], str) or len(e['event_id']) != 64 or any(c not in '0123456789abcdef' for c in e['event_id']):","if False:"]],[["require(typeof e.event_id==='string'&&/^[0-9a-f]{64}$/.test(e.event_id),'event-id');","require(true,'event-id');"]]);
fault('forbidden-fields',['61','62','63'].map(id=>accept(id)),[["if any(k in e for k in ('actor', 'component', 'references')):","if False:"]],[["require(!['actor','component','references'].some(k=>Object.hasOwn(e,k)),'forbidden');","require(true,'forbidden');"]]);
fault('duplicate-field',[accept('67')],[["if len(e) != len(pairs):","if False:"]],[["require(Object.keys(e).length===bundle.event.length,'duplicate-field');","require(true,'duplicate-field');"]]);
fault('unknown-extension-null',[witness('66','reject','EXECUTING','forbidden')],[["if any(k in e for k in ('actor', 'component', 'references')):","if any(k in e for k in ('actor', 'component', 'references')) or any(v is None for v in e.values()):"]],[["!['actor','component','references'].some(k=>Object.hasOwn(e,k))","!['actor','component','references'].some(k=>Object.hasOwn(e,k)) && !Object.values(e).includes(null)"]]);
fault('set-order',[witness('80','reject','EXECUTING','payload-copy')],[["if key in ('assessments', 'roles'):","if key == 'roles':"]],[["label === 'assessments' || label === 'roles'","label === 'roles'"]]);
fault('duplicate-assessment',[witness('81','reject','EXECUTING','payload-copy')],[["if key in ('assessments', 'roles'):","if key == 'roles':"]],[["label === 'assessments' || label === 'roles'","label === 'roles'"]]);
fault('retargeting',[accept('74')],[["if not historical and env['fixed_profile'] != env['presented_profile']:","if False:"]],[["require(historical || universe.presented_profile===universe.fixed_profile,'retargeting');","require(true,'retargeting');"]]);
fault('invalidity-precedence',[witness('76','unsupported','EXECUTING','establishment-unavailable')],[["for category in ('reject', 'unsupported', 'unestablished'):","for category in ('unsupported', 'reject', 'unestablished'):"]],[["const rank=['reject','unsupported','unestablished'];","const rank=['unsupported','reject','unestablished'];"]]);
fault('availability-precedence',[witness('77','unestablished','EXECUTING','fact-missing')],[["for category in ('reject', 'unsupported', 'unestablished'):","for category in ('reject', 'unestablished', 'unsupported'):"]],[["const rank=['reject','unsupported','unestablished'];","const rank=['reject','unestablished','unsupported'];"]]);

fault('illegal-shortcut',[accept('08','AUTHORIZED')],[["EDGES = {", "EDGES = {('VALIDATING', 'AUTHORIZATION_GRANTED'): 'AUTHORIZED', "]],[["const vocabulary = [", "const vocabulary = [['AUTHORIZATION_GRANTED','VALIDATING','AUTHORIZED'],"]]);
fault('post-terminal',[accept('09','FAILED')],[["EDGES = {", "EDGES = {('COMPLETED', 'EXECUTION_FAILED'): 'FAILED', "],["if state in ('COMPLETED', 'FAILED'):","if False:"]],[["const vocabulary = [", "const vocabulary = [['EXECUTION_FAILED','COMPLETED','FAILED'],"],["if(['COMPLETED','FAILED'].includes(previous.state))require(false,'terminal');","if(false)require(false,'terminal');"]]);
fault('delivery-order',[witness('14','reject',null,'transition',false)],[["history = sorted(env['history'], key=lambda b: dict(b['event'])['sequence'])","history = list(env['history'])"]],[["const ordered=delivery.sort((a,b)=>a.e.sequence<b.e.sequence?-1:a.e.sequence>b.e.sequence?1:0);","const ordered=delivery;"]]);
fault('imported-history-authority',[witness('71','unsupported',null,'dependency-unavailable',false)],[["if any(p not in env['material_catalog'] for p in b['action']['material']):","if b['storage'] != 'local' or any(p not in env['material_catalog'] for p in b['action']['material']):"]],[["require(owner.material.every(p=>Object.hasOwn(universe.material_catalog,p)),'dependency-unavailable','unsupported');","require(bundle.storage==='local' && owner.material.every(p=>Object.hasOwn(universe.material_catalog,p)),'dependency-unavailable','unsupported');"]]);
fault('missing-closure-is-available',[accept('75','CREATED')],absentPy.concat([["if any(p not in env['material_catalog'] for p in b['action']['material']):","if False:"]]),absentJS.concat([["require(owner.material.every(p=>Object.hasOwn(universe.material_catalog,p)),'dependency-unavailable','unsupported');","require(true,'dependency-unavailable','unsupported');"]]));
// An implementation that trusts a producer copy and skips its explanatory
// contract admits all three incomplete-history payloads and the nested extras.
fault('explanation-ignored',['50','51','52','60','65'].map(id=>accept(id,Number(id)<54?'AUTHORIZED':'COMPLETED')),
 [["        add('reject', 'explanation')","        pass"],["if not eq(payload, {'action': A, 'context': C, 'assessments': S}):","if False:"]],
 [["require(inputShape&&payloadShape,'explanation');","require(true,'explanation');"],["require(equal(payload,{action:owner,context:ctx,assessments:assertions}),'payload-copy');","require(true,'payload-copy');"]]);
fault('extension-supplies-required-payload',[accept('68')],[["    required = ('event_id'","    if 'payload' not in e and 'explanation_copy' in e:\n        e['payload'] = e['explanation_copy']\n    required = ('event_id'"]],[["const nonnull=['event_id'","if(!Object.hasOwn(e,'payload')&&Object.hasOwn(e,'explanation_copy')) e.payload=e.explanation_copy;\n  const nonnull=['event_id'"]]);
fault('null-payload-default',[accept('64')],[["    e = dict(pairs)","    e = dict(pairs)\n    if e.get('payload') is None:\n        e['payload'] = {'action': b['action'], 'context': b['context'], 'assessments': b['assessments']}"]],[["const nonnull=['event_id'","if(e.payload===null)e.payload={action:owner,context:ctx,assessments:assertions};\n  const nonnull=['event_id'"]]);
fault('null-time-default',[accept('69')],[["    e = dict(pairs)","    e = dict(pairs)\n    if e.get('occurred_at') is None:\n        e['occurred_at'] = next(a['result'] for a in b['assessments'] if a['statement'] == 'time')"]],[["const nonnull=['event_id'","if(e.occurred_at===null)e.occurred_at=assertions.find(a=>a.statement==='time').result;\n  const nonnull=['event_id'"]]);
fault('unselected-local-election',[accept('10')],[["        if len(selected) != 1:","        if len(selected) == 0:\n            selected = [env['candidates'][0]]\n            e = dict(selected[0]['event'])\n            selected[0]['selection'] = {'event_id': e['event_id'], 'head': head, 'sequence': e['sequence']}\n        if len(selected) != 1:"]],[["if(picked.length!==1)resolution=", "if(picked.length===0){const b=world.candidates[0],e=Object.fromEntries(b.event);b.selection={event_id:e.event_id,head:past.head,sequence:e.sequence};picked.push(b);}\n    if(picked.length!==1)resolution="]]);
// Treating a retained unknown type as a harmless no-op is an unsafe assertion
// of a complete prefix. No foreign semantic definition is manufactured.
fault('unknown-history-noop',[accept('72','AUTHORIZED')],[["    for b in history:\n        category", "    for b in history:\n        if dict(b['event'])['event_type'][3] == 'POLICY_RECORDED':\n            e = dict(b['event'])\n            head, ordinal = e['event_id'], e['sequence']\n            used.append(head)\n            continue\n        category"]],[["const found=inspect(b,world,prev,true);","if(e.event_type[3]==='POLICY_RECORDED'){const next={...prev,head:e.event_id,ordinal:e.sequence,ids:prev.ids.concat(e.event_id)};cache.set(index,next);return next;}\n    const found=inspect(b,world,prev,true);"]]);

export const mutantManifest=faults.map(({name,witnesses})=>({name,witnesses}));
for(const f of faults)for(const language of ['python','node'])test(`semantic mutant ${language}: ${f.name}`,async()=>{
  const code=replace(language==='python'?python:javascript,language==='python'?f.py:f.js);
  const mutated=language==='node'?(await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)).evaluate:null;
  for(const w of f.witnesses){
    const input=structuredClone(samples.get(w.id));
    const actual=language==='python'?await invoke(input,code):mutated(input);
    outputShape(actual);
    assert.equal(actual.classification,w.classification,`${f.name}/${w.id}: intended classification`);
    assert.equal(actual.state,w.state,`${f.name}/${w.id}: intended state`);
    assert.equal(actual.complete,w.complete,`${f.name}/${w.id}: intended projection completeness`);
    assert.ok(actual.obligations.includes(w.obligation),`${f.name}/${w.id}: intended obligation ${w.obligation}, got ${actual.obligations}`);
    assert.throws(()=>compareResult(actual,oracle.rows[Number(w.id)-1]),undefined,'mutant must violate source oracle');
  }
});
