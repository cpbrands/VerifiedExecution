// Fixture/oracle/provenance and process plumbing only. No semantic evaluator
// imports this module. Fully expanded inputs have no case labels or oracle data.
import {readFileSync} from 'node:fs';
import {spawn,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
export const directory=new URL('./',import.meta.url), root=new URL('../../',directory);
export const fixtures=JSON.parse(readFileSync(new URL('fixtures.json',directory),'utf8'));
export const oracle=JSON.parse(readFileSync(new URL('oracle.json',directory),'utf8'));
export const python=readFileSync(new URL('staged.py',directory),'utf8');
export const javascript=readFileSync(new URL('rule-graph.mjs',directory),'utf8');
export const digest=b=>createHash('sha256').update(b).digest('hex');
export function historical(pin,cwd=root){
  assert.match(pin.commit,/^[0-9a-f]{40}$/);
  assert.ok(typeof pin.path==='string'&&!pin.path.startsWith('/')&&!pin.path.split('/').includes('..'));
  const r=spawnSync('git',['--no-replace-objects','cat-file','blob',`${pin.commit}:${pin.path}`],{cwd,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},timeout:10000,maxBuffer:4*1024*1024});
  assert.equal(r.error,undefined,'historical source process failure');
  assert.equal(r.status,0,`historical source unavailable: ${pin.commit}:${pin.path}; fetch full recorded history; no HEAD fallback`);
  return r.stdout;
}
export function verifyBytes(pin,bytes){
  assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),pin.blob,`pinned blob mismatch: ${pin.path}`);
  assert.equal(digest(bytes),pin.sha256,`pinned SHA-256 mismatch: ${pin.path}`);
}
export const profilePin=Object.freeze({commit:'cc91ae116959ad6535b3d2b5b5f6ac602e651587',path:'specifications/BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE.md',blob:'a8a88e94be403be9ffc0efd01986a5db9446757e',sha256:'dfd184858a0a925c8da37c67a2ddd6c69e89f7ed064446779ed2122950e98c2b'});
export const alternateSelector='retargeted-completion-to-failure';
const verifiedCatalogs=new WeakMap();
function invalid(phase,code,message){
  const error=new Error(message);error.name='ExperimentValidationError';error.phase=phase;error.code=code;throw error;
}
export function provenance(sources=fixtures.sources,read=historical){
  const pins=sources.filter(p=>p.path===profilePin.path);
  if(pins.length!==1||Object.keys(profilePin).some(k=>pins[0][k]!==profilePin[k]))invalid('provenance','PROFILE_PIN','historical profile pin differs from the experiment binding');
  const catalog={};
  for(const p of sources){
    let bytes;
    try{bytes=read(p);verifyBytes(p,bytes);}catch(error){
      if(p.path===profilePin.path)invalid('provenance','PROFILE_BYTES',`historical profile verification failed: ${error.message}`);
      throw error;
    }
    catalog[p.path]=bytes.toString('utf8');
  }
  // Bind only after historical bytes pass both fingerprints. No HEAD fallback.
  verifiedCatalogs.set(catalog,profilePin.blob);
  return catalog;
}
function selectors(input,catalog){
  const bound=verifiedCatalogs.get(catalog);
  if(!bound)invalid('provenance','UNVERIFIED_PROFILE','verified historical profile required');
  // Closed local-test tokens, not a VE registry or wire/profile allocation.
  for(const key of ['fixed_profile','presented_profile']){
    const value=input[key];
    if(typeof value!=='string'||!(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).test(value))invalid('fixture','SELECTOR_SYNTAX',`${key}: malformed local-test selector`);
    if(value!==bound&&value!==alternateSelector)invalid('fixture','SELECTOR_UNDECLARED',`${key}: undeclared local-test selector`);
  }
  if(input.fixed_profile!==bound)invalid('fixture','FIXED_PROFILE_BINDING','fixed_profile is not bound to the verified historical profile');
}
export function expand(value,definitions=fixtures.definitions,active=new Set()){
  if(value===null||typeof value!=='object')return value;
  if(Object.hasOwn(value,'$ref')){
    assert.equal(Object.keys(value).length,1,'malformed fixture ref');
    const k=value.$ref;assert.ok(typeof k==='string'&&Object.hasOwn(definitions,k),'missing fixture ref');
    assert.ok(!active.has(k),'cyclic fixture ref');
    return expand(definitions[k],definitions,new Set([...active,k]));
  }
  if(Object.hasOwn(value,'integer')){
    assert.deepEqual(Object.keys(value),['integer'],'malformed test integer');
    assert.match(value.integer,/^(0|-?[1-9][0-9]*)$/);
  }
  return Array.isArray(value)?value.map(v=>expand(v,definitions,active)):Object.fromEntries(Object.entries(value).map(([k,v])=>[k,expand(v,definitions,active)]));
}
export function validateSuite(f=fixtures,o=oracle,catalog=provenance(f.sources)){
  assert.equal(f.format,'RS-EVENT-002-local-test-1');
  const ids=Array.from({length:87},(_,i)=>String(i+1).padStart(2,'0'));
  assert.deepEqual(f.cases.map(c=>c.id),ids,'missing, duplicate, skipped, reordered or extra fixture');
  assert.deepEqual(o.rows.map(c=>c[0]),ids,'missing, duplicate or extra oracle');
  for(const c of f.cases){
    assert.deepEqual(Object.keys(c).sort(),['category','id','input']);
    assert.ok(['mapping','control','isolated','compound','invariance','redundant'].includes(c.category),'unknown category');
    const i=expand(c.input,f.definitions);
    selectors(i,catalog);
    assert.deepEqual(Object.keys(i).sort(),['candidates','fixed_profile','history','materials','membership','presented_profile']);
    for(const k of ['candidates','history','materials','membership'])assert.ok(Array.isArray(i[k]),`malformed fixture ${k}`);
    for(const b of [...i.history,...i.candidates]){
      assert.deepEqual(Object.keys(b).sort(),['action','assessments','context','establishment','event','selection','storage']);
      assert.ok(Array.isArray(b.event)&&b.event.every(p=>Array.isArray(p)&&p.length===2&&typeof p[0]==='string'),'malformed Event pair syntax');
      assert.ok(Array.isArray(b.assessments));
      assert.deepEqual(Object.keys(b.establishment).sort(),['action','assessments','context']);
      const statuses=[b.establishment.action.status,b.establishment.context.status,...b.establishment.assessments.map(a=>a.status)];
      assert.ok(statuses.every(s=>['verified','failed','unavailable'].includes(s)),'malformed establishment status');
    }
  }
  assert.deepEqual(Object.fromEntries(['mapping','control','isolated','compound','invariance','redundant'].map(k=>[k,f.cases.filter(c=>c.category===k).length])),{mapping:7,control:5,isolated:57,compound:10,invariance:7,redundant:1});
  for(const row of o.rows){assert.equal(row.length,7);assert.ok(['accept','reject','unsupported','unestablished','unselected'].includes(row[1]));}
}
export function inputFor(c,catalog,definitions=fixtures.definitions){
  const i=expand(c.input,definitions);
  selectors(i,catalog);
  i.material_catalog=Object.fromEntries(i.materials.filter(p=>Object.hasOwn(catalog,p)).map(p=>[p,catalog[p]]));
  delete i.materials;
  return i;
}
export async function invoke(input,code=python,command=process.env.PYTHON??'python3'){
  // Drain both output pipes while supplying the fully expanded input. No
  // retry, result substitution or timeout relaxation is permitted.
  const stdout=await new Promise((resolve,reject)=>{
    const child=spawn(command,['-B','-c',code],{stdio:['pipe','pipe','pipe']});
    const out=[],err=[];let size=0,done=false;
    const finish=(error,value)=>{if(done)return;done=true;clearTimeout(timer);error?reject(error):resolve(value);};
    const stop=message=>{child.kill('SIGKILL');finish(Error(`subprocess failed: ${message}`));};
    const timer=setTimeout(()=>stop('timeout after 15000 ms'),15000);
    child.on('error',error=>finish(Error(`subprocess failed: ${error.code}`)));
    child.stdin.on('error',error=>finish(Error(`subprocess failed: stdin ${error.code}`)));
    for(const [stream,chunks]of [[child.stdout,out],[child.stderr,err]])stream.on('data',chunk=>{
      size+=chunk.length;if(size>4*1024*1024)stop('output limit exceeded');else chunks.push(chunk);
    });
    child.on('close',(status,signal)=>{
      if(status!==0)finish(Error(`subprocess failed: status ${status}, signal ${signal}: ${Buffer.concat(err).toString('utf8')}`));
      else finish(null,Buffer.concat(out).toString('utf8'));
    });
    child.stdin.end(JSON.stringify(input));
  });
  let result;try{result=JSON.parse(stdout);}catch{throw Error('malformed evaluator output');}
  outputShape(result);return result;
}
export function outputShape(x){
  assert.deepEqual(Object.keys(x).sort(),['appended','classification','complete','obligations','prefix','retained','state']);
  assert.ok(['accept','reject','unsupported','unestablished','unselected'].includes(x.classification));
  assert.equal(typeof x.complete,'boolean');
  const states=[null,'CREATED','VALIDATING','READY','AUTHORIZED','EXECUTING','COMPLETED','FAILED'];
  assert.ok(states.includes(x.state)&&states.includes(x.prefix));
  // Output carries opaque test octets, including a mutant's incorrectly
  // admitted 31-octet ID. Width is a semantic check, not a transport check;
  // compareResult still demands the oracle's exact retained/appended IDs.
  const octets=s=>typeof s==='string'&&/^[0-9a-f]+$/.test(s)&&s.length%2===0;
  assert.ok(Array.isArray(x.retained)&&x.retained.every(octets));
  assert.ok(x.appended===null||octets(x.appended));
  assert.ok(Array.isArray(x.obligations)&&x.obligations.length>0&&x.obligations.every(s=>typeof s==='string'&&s.length>0));
}
export function compareResult(actual,row){
  outputShape(actual);
  const [id,classification,state,complete,history,appended,reason]=row;
  const I=n=>n===null?null:n.toString(16).padStart(64,'0');
  const {obligations,...summary}=actual;
  assert.deepEqual(summary,{classification,state,complete,retained:history.map(I).sort(),appended:I(appended),prefix:oracle.partial_prefixes[id]??null},`oracle mismatch ${id}`);
  assert.ok(obligations.includes(reason),`oracle obligation ${id}: ${reason} absent in ${obligations}`);
}
export function comparePair(a,b,row){
  compareResult(a,row);compareResult(b,row);
  assert.deepEqual(a,b,`evaluator disagreement ${row[0]}`);
}
export async function runComparison(f=fixtures,o=oracle){
  const catalog=provenance(f.sources);validateSuite(f,o,catalog);
  const {evaluate}=await import('./rule-graph.mjs');
  const counts={};
  for(const [index,c]of f.cases.entries()){
    try {
      const i=inputFor(c,catalog,f.definitions), a=await invoke(i), b=evaluate(structuredClone(i));
      comparePair(a,b,o.rows[index]);
      counts[a.classification]=(counts[a.classification]??0)+1;
    } catch(error) {throw Error(`case ${c.id}: ${error.message}`,{cause:error});}
  }
  return {cases:87,counts,sourcePins:f.sources.length};
}
// Start child processes after the entry module has finished initialization.
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)setImmediate(()=>{
  runComparison().then(result=>console.log(JSON.stringify(result,null,2))).catch(error=>{
    console.error(error.message);process.exitCode=1;
  });
});
