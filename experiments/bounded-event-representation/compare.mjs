// Shared fixture expansion, process transport and comparison; no codec logic.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {catalog,pins,dir} from './source-loader.mjs';
export const fixtures=JSON.parse(readFileSync(new URL('vectors.json',dir),'utf8'));
const inputVectors=JSON.parse(readFileSync(new URL('input-vectors.json',dir),'utf8'));
assert.ok(Object.keys(inputVectors.definitions).every(k=>!Object.hasOwn(fixtures.definitions,k)),'duplicate fixture definition');
Object.assign(fixtures.definitions,inputVectors.definitions);fixtures.positive.push(...inputVectors.positive);
fixtures.positive.push(...JSON.parse(readFileSync(new URL('anchor-vectors.json',dir),'utf8')).positive);
const manifest=JSON.parse(readFileSync(new URL('case-manifest.json',dir),'utf8'));
export function validateCases(cases,group='positive'){
  assert.ok(Array.isArray(cases),'fixture/cases');
  assert.deepEqual(cases.map(c=>c.id),manifest[group],'fixture/missing-duplicate-extra-or-skipped-case');
  for(const c of cases)assert.ok(c&&typeof c.id==='string'&&!Object.hasOwn(c,'skip'),'fixture/skipped-case');
}
const B=x=>({$bytes:x});
const nativeValues=x=>typeof x==='number'?{$integer:String(x)}:Array.isArray(x)?x.map(nativeValues):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).map(([k,v])=>[k,nativeValues(v)])):x;
export function governingContext(){
  const c=catalog();
  const repository=c.repository.map(({pin:p,bytes})=>({key:{repository:'https://github.com/cpbrands/VerifiedExecution',commit:B(p.commit),path:p.path,blob:B(p.blob),sha256:B(p.sha256)},body:bytes.toString('hex')}));
  const external=c.external.map(({pin:p,bytes})=>({key:{authority:p.authority,edition:p.edition,document:p.document,sha256:B(p.sha256)},body:bytes.toString('hex')}));
  const actionPaths=['specifications/VE-001-action-specification.md','specifications/VE-001-ACTION-CANONICAL-REPRESENTATION-PROFILE.md','specifications/LYNX-UG2026-CAD-CUSTOMER-CREDIT-TRANSFER-INTERBANK-SETTLEMENT-ACTION-SCHEMA.md','adrs/ADR-ENC-001-VE-CBOR-1.md'];
  const entries=[...repository.map(x=>({kind:'repository',key:x.key})),...external.map(x=>({kind:'external',key:x.key}))];
  const actionClosure=entries.filter(x=>x.kind==='external'||actionPaths.includes(x.key.path));
  const schema=c.repository.find(x=>x.pin.path===actionPaths[2]).bytes.toString('utf8');
  const section=schema.split('## 7. Exact `CanonicalSchemaDescriptor`')[1].split('## 8.')[0];
  const blocks=[...section.matchAll(/```json\n([\s\S]*?)\n```/g)];assert.equal(blocks.length,1,'one exact descriptor required');
  const descriptor=nativeValues(JSON.parse(blocks[0][1]));
  return {repository,external,publication:repository.find(x=>x.key.path===pins.representation.path).key,packageClosure:entries,actionClosure,descriptor,
    unicodeData:c.external.find(x=>x.pin.document==='UnicodeData.txt').bytes.toString('utf8'),
    ownerClosures:[{kind:'repository',key:repository.find(x=>x.key.path===actionPaths[1]).key,closure:actionClosure}]};
}
export function materialValue(which,authority){
  const selected=which==='action'?authority.actionClosure:which==='package'?authority.packageClosure:null;
  assert.ok(selected,'unknown material selection');const out={repository:[],external:[]};
  for(const {kind,key}of selected){const item=authority[kind].find(x=>JSON.stringify(x.key)===JSON.stringify(key));assert.ok(item);out[kind].push({key,body:[B(item.body)]});}return out;
}
export function expand(value,authority,active=new Set()){
  if(value===null||typeof value!=='object')return value;
  if(Array.isArray(value))return value.map(v=>expand(v,authority,active));
  const keys=Object.keys(value);
  for(const macro of ['$ref','$publication','$materials','$descriptor','$repeat_octets','$repeat_text','$concat_text','$power_two','$owner_key'])if(Object.hasOwn(value,macro)){
    assert.equal(keys.length,1,'malformed fixture macro');const v=value[macro];
    if(macro==='$ref'){assert.ok(typeof v==='string'&&Object.hasOwn(fixtures.definitions,v)&&!active.has(v),'unknown/cyclic ref');return expand(fixtures.definitions[v],authority,new Set([...active,v]));}
    if(macro==='$publication'){assert.equal(v,true);return authority.publication;}
    if(macro==='$descriptor'){assert.equal(v,true);return authority.descriptor;}
    if(macro==='$materials')return materialValue(v,authority);
    if(macro==='$owner_key'){const keys=authority.repository.filter(e=>e.key.path===v);assert.equal(keys.length,1,'exact owner key required');return keys[0].key;}
    if(macro==='$power_two'){assert.deepEqual(Object.keys(v).sort(),['exponent','negative']);assert.ok(Number.isSafeInteger(v.exponent)&&v.exponent>=0&&v.exponent<=65536);assert.equal(typeof v.negative,'boolean');return {$integer:String((v.negative?-1n:1n)*(2n**BigInt(v.exponent)))};}
    if(macro==='$concat_text'){assert.ok(Array.isArray(v));const parts=v.map(p=>expand(p,authority,active));assert.ok(parts.every(p=>typeof p==='string'));return parts.join('');}
    assert.ok(Array.isArray(v)&&v.length===2&&Number.isSafeInteger(v[1])&&v[1]>=0&&v[1]<=100000);
    assert.equal(typeof v[0],'string');
    if(macro==='$repeat_octets'){assert.match(v[0],/^[0-9a-f]{2}$/);return B(v[0].repeat(v[1]));}
    return v[0].repeat(v[1]);
  }
  return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,expand(v,authority,active)]));
}
export function checkedOutput(r){
  assert.ok(!r.error&&r.status===0,`runner/subprocess: ${r.error?.message??r.stderr}`);
  let out;try{out=JSON.parse(r.stdout);}catch{throw Error('runner/malformed-output');}
  assert.ok(out&&typeof out==='object'&&!Array.isArray(out),'runner/malformed-output');
  assert.equal(typeof out.ok,'boolean','runner/malformed-output');
  assert.deepEqual(Object.keys(out).sort(),out.ok?['ok','value']:['error','ok'],'runner/malformed-output');
  if(!out.ok)assert.equal(typeof out.error,'string','runner/malformed-output');return out;
}
export function invoke(language,request,authority,source=null){
  const command=language==='A'?process.execPath:(process.env.PYTHON??'python3');
  let args=language==='A'?[fileURLToPath(new URL('process-a.mjs',dir))]:['-B',fileURLToPath(new URL('process-b.py',dir))];
  if(source!==null){
    if(language==='A'){
      const wrapper=readFileSync(new URL('process-a.mjs',dir),'utf8').replace("import {configure,encode,decode,Failure} from './codec-a.mjs';",`const {configure,encode,decode,Failure}=await import('data:text/javascript;base64,${Buffer.from(source).toString('base64')}');`);
      args=['--input-type=module','-e',wrapper];
    }else{
      const wrapper=readFileSync(new URL('process-b.py',dir),'utf8').split("message = json.load(sys.stdin)")[1];
      args=['-B','-c',source+'\nimport json,sys\ncodec=sys.modules[__name__]\nmessage=json.load(sys.stdin)'+wrapper];
    }
  }
  const r=spawnSync(command,args,{input:JSON.stringify({authority,request}),encoding:'utf8',timeout:120000,maxBuffer:256*1024*1024});
  return checkedOutput(r);
}
function normalized(value,key=''){
  if(Array.isArray(value)){
    if(value[0]==='set'&&value.length===2&&Array.isArray(value[1]))return ['set',normalized(value[1],'$set')];
    const a=value.map(v=>normalized(v));
    if(key==='members')return a.sort((x,y)=>{const n=BigInt(x.record[1].sequence.$integer),m=BigInt(y.record[1].sequence.$integer);return n<m?-1:n>m?1:0;});
    if(['roles','assessments','assessment_establishments','repository','external','$set'].includes(key))return [...new Map(a.map(v=>[JSON.stringify(v),v])).entries()].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0).map(([,v])=>v);
    if(key==='extensions')return a.sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
    if(value[0]==='record'&&Array.isArray(a[1]))a[1].sort((x,y)=>x[0]<y[0]?-1:x[0]>y[0]?1:0);
    return a;
  }
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,normalized(value[k],k)]));
  return value;
}
export function exactSemantics(actual,expected){
  const a=normalized(actual),e=normalized(expected);
  function equal(x,y){
    if(x&&y&&typeof x==='object'&&typeof y==='object'&&Object.hasOwn(x,'$integer')&&Object.hasOwn(y,'$integer')){assert.equal(x.$integer,y.$integer,'semantic-mismatch/integer');return;}
    if(x&&y&&typeof x==='object'&&typeof y==='object'&&Object.hasOwn(x,'$bytes')&&Object.hasOwn(y,'$bytes')){assert.equal(x.$bytes,y.$bytes,'semantic-mismatch/octets');return;}
    if(typeof x==='string'&&typeof y==='string'&&x!==y)throw Error('semantic-mismatch/text-codepoints');
    if(Array.isArray(x)&&Array.isArray(y)){assert.equal(x.length,y.length,'semantic-mismatch/cardinality');for(let i=0;i<x.length;i++)equal(x[i],y[i]);return;}
    if(x&&y&&typeof x==='object'&&typeof y==='object'){assert.deepEqual(Object.keys(x),Object.keys(y),'semantic-mismatch/fields');for(const k of Object.keys(x))equal(x[k],y[k]);return;}
    assert.deepEqual(x,y,'semantic-mismatch/value');
  }equal(a,e);
}
export function positive(c,authority,run=invoke){
  const value=expand(c.value,authority),encoded={};
  for(const language of ['A','B']){const r=run(language,{op:'encode',type:c.type,value},authority);assert.equal(r.ok,true,`${language}/${c.id}: ${r.error}`);assert.equal(typeof r.value,'string');assert.match(r.value,/^(?:[0-9a-f]{2})+$/);encoded[language]=r.value;}
  assert.equal(encoded.A,encoded.B,`canonical-byte-mismatch/${c.id}`);
  if(c.anchor)assert.equal(encoded.A,c.anchor,`hand-anchor-mismatch/${c.id}`);
  for(const [decoder,encoder]of [['B','A'],['A','B']]){
    const r=run(decoder,{op:'decode',type:c.type,hex:encoded[encoder]},authority);assert.equal(r.ok,true,`${decoder}/${c.id}: ${r.error}`);exactSemantics(r.value,value);
    const re=run(decoder,{op:'encode',type:c.type,value:r.value},authority);assert.equal(re.ok,true,`${decoder}/${c.id}: ${re.error}`);assert.equal(re.value,encoded[encoder],`canonical-reencoding-mismatch/${c.id}`);
  }return encoded.A;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  validateCases(fixtures.positive);
  const a=governingContext();const selected=process.argv[2]?fixtures.positive.filter(c=>c.id===process.argv[2]):fixtures.positive;
  assert.ok(selected.length);for(const c of selected){positive(c,a);console.log(`positive ${c.id}: cross-decode, semantic equality, canonical bytes, re-encoding passed`);}
}
