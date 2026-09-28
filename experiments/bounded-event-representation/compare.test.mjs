import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync,readdirSync,statSync,fstatSync,ftruncateSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fixtures,validateCases,governingContext,expand,invoke,positive,exactSemantics,checkedOutput,fileBackedProcess} from './compare.mjs';
import {dir,pins,historical,verify,profileBinding} from './source-loader.mjs';
import {patched} from './negative-plumbing.mjs';
import {mutations,once,sourceFor} from './mutants.mjs';
import {cbor,parse} from './codec-a.mjs';

const literals=JSON.parse(readFileSync(new URL('negative-vectors.json',dir))).literal;
const packageVectors=JSON.parse(readFileSync(new URL('package-negative-vectors.json',dir)));
validateCases(fixtures.positive);validateCases(literals,'negative');validateCases(packageVectors.patches,'packageNegative');
const authority=governingContext(),encoded=new Map();
function baseline(id){
  if(!encoded.has(id))encoded.set(id,positive(fixtures.positive.find(c=>c.id===id),authority));
  return encoded.get(id);
}
const negatives=new Map(literals.map(c=>[c.id,c]));
function negative(id){
  if(!negatives.has(id)){
    const c=packageVectors.patches.find(c=>c.id===id);assert.ok(c);
    negatives.set(id,{...c,type:'package',hex:patched(Buffer.from(baseline(packageVectors.base),'hex'),c).toString('hex')});
  }return negatives.get(id);
}
for(const c of fixtures.positive)test(`representation positive ${c.id}`,()=>{baseline(c.id);});
for(const c of [...literals,...packageVectors.patches])test(`representation negative ${c.id}`,()=>{
  const v=negative(c.id);
  for(const language of ['A','B'])assert.deepEqual(invoke(language,{op:'decode',type:v.type,hex:v.hex},authority),{ok:false,error:v.error},`${language}/${c.id}`);
});
test('representation Python arbitrary integers ignore the interpreter decimal-digit limit',()=>{
  const c=fixtures.positive.find(c=>c.id==='integer-chunked-magnitude'),value=expand(c.value,authority);
  assert.equal(value.$integer.slice(1).length,9865);assert.equal(value.$integer[0],'-');
  const encodedA=invoke('A',{op:'encode',type:'integer',value},authority);assert.equal(encodedA.ok,true);assert.equal(encodedA.value.length/2,4104);
  const decodedB=invoke('B',{op:'decode',type:'integer',hex:encodedA.value},authority);assert.deepEqual(decodedB,{ok:true,value});
  const encodedB=invoke('B',{op:'encode',type:'integer',value:decodedB.value},authority);assert.deepEqual(encodedB,encodedA);
  for(const boundary of ['0','-1']){
    const semantic={$integer:boundary},a=invoke('A',{op:'encode',type:'integer',value:semantic},authority),b=invoke('B',{op:'encode',type:'integer',value:semantic},authority);
    assert.deepEqual(b,a);assert.deepEqual(invoke('B',{op:'decode',type:'integer',hex:a.value},authority),{ok:true,value:semantic});
  }
  const invalid={$integer:'1'.repeat(5000)+'x'};
  assert.deepEqual(invoke('B',{op:'encode',type:'integer',value:invalid},authority),{ok:false,error:'domain/integer'});
  const runtime=spawnSync(process.env.PYTHON??'python3',['-c','import json,sys; print(json.dumps({"version":list(sys.version_info[:3]),"limit":sys.get_int_max_str_digits() if hasattr(sys,"get_int_max_str_digits") else None}))'],{encoding:'utf8'});
  assert.equal(runtime.status,0);const info=JSON.parse(runtime.stdout);
  if(info.limit!==null&&info.limit>0&&value.$integer.length>info.limit){
    const legacyParse=once(sourceFor('B'),'return decimal_to_integer(s)','return int(s)');
    const legacyRender=once(sourceFor('B'),"return {'$integer':integer_to_decimal(n)}","return {'$integer':str(n)}");
    assert.throws(()=>invoke('B',{op:'encode',type:'integer',value},authority,legacyParse),/runner\/subprocess/);
    assert.throws(()=>invoke('B',{op:'decode',type:'integer',hex:encodedA.value},authority,legacyRender),/runner\/subprocess/);
  }
});
test('representation extra Context member is the only defect',()=>{
  const vector=literals.find(c=>c.id==='extra-context-field');assert.ok(vector?.without_extra_hex);
  for(const language of ['A','B']){
    const valid=invoke(language,{op:'decode',type:'context',hex:vector.without_extra_hex},authority);assert.equal(valid.ok,true,`${language}: ${valid.error}`);
    assert.deepEqual(invoke(language,{op:'encode',type:'context',value:valid.value},authority),{ok:true,value:vector.without_extra_hex});
    assert.deepEqual(invoke(language,{op:'decode',type:'context',hex:vector.hex},authority),{ok:false,error:'structure/record-fields'});
  }
});
test('representation Text substitution decodes but fails independent intended-value binding',()=>{
  const d=baseline('text-decomposed'),c=baseline('text-composed');assert.notEqual(d,c);
  for(const language of ['A','B'])for(const [hex,recovered,original]of [[d,'e\u0301','\u00e9'],[c,'\u00e9','e\u0301']]){
    const r=invoke(language,{op:'decode',type:'text',hex},authority);assert.deepEqual(r,{ok:true,value:recovered});
    assert.deepEqual([...r.value].map(x=>x.codePointAt(0)),[...recovered].map(x=>x.codePointAt(0)));
    assert.throws(()=>exactSemantics(r.value,original),/^Error: semantic-mismatch\/text-codepoints$/);
  }
});
for(const m of mutations)test(`representation mutant ${m.id}`,()=>{
  const source=m.source();
  if(m.mode==='accept-invalid'){
    const v=negative(m.witness);
    assert.deepEqual(invoke(m.language,{op:'decode',type:v.type,hex:v.hex},authority),{ok:false,error:v.error});
    const r=invoke(m.language,{op:'decode',type:v.type,hex:v.hex},authority,source);
    assert.equal(r.ok,true,`intended guard bypass must accept ${m.witness}, not crash or fail elsewhere: ${r.error}`);
  }else{
    const c=fixtures.positive.find(c=>c.id===m.witness);assert.ok(c);const hex=baseline(c.id),value=expand(c.value,authority);
    if(m.mode==='wrong-text-bytes'){
      const r=invoke(m.language,{op:'encode',type:c.type,value},authority,source);assert.equal(r.ok,true);
      assert.equal(r.value,baseline('text-composed'));assert.notEqual(r.value,hex,'NFC collision detected by independent anchor');
    }else if(m.mode==='wrong-text-value'){
      const r=invoke(m.language,{op:'decode',type:c.type,hex},authority,source);assert.deepEqual(r,{ok:true,value:'\u00e9'});
      assert.throws(()=>exactSemantics(r.value,value),/semantic-mismatch\/text-codepoints/);
    }else if(m.mode==='wrong-integer-value'){
      const r=invoke(m.language,{op:'decode',type:c.type,hex},authority,source);assert.equal(r.ok,true);
      assert.throws(()=>exactSemantics(r.value,value),/semantic-mismatch\/integer/);
    }else if(m.mode==='wrong-rational-value'){
      const r=invoke(m.language,{op:'decode',type:c.type,hex},authority,source);assert.equal(r.ok,true,r.error);
      assert.deepEqual(r.value.earliest.slice(6),[{$integer:'0'},{$integer:'1'}]);
      assert.deepEqual(r.value.latest.slice(6),[{$integer:'0'},{$integer:'1'}]);
      assert.throws(()=>exactSemantics(r.value,value),/semantic-mismatch\/integer/);
    }else{
      assert.equal(m.mode,'noncanonical-map-bytes');const r=invoke(m.language,{op:'encode',type:c.type,value},authority,source);assert.equal(r.ok,true);assert.notEqual(r.value,hex);
      assert.deepEqual(invoke(m.language==='A'?'B':'A',{op:'decode',type:c.type,hex:r.value},authority),{ok:false,error:'canonical/map-order'});
    }
  }
});
test('representation mutant normalization-equivalent semantic comparator',()=>{
  // The actual comparison function is mutated. The shared collection preparation
  // is identity here because the witness is a scalar Text, not a collection.
  const source=once(exactSemantics.toString(),"if(typeof x==='string'&&typeof y==='string'&&x!==y)","if(typeof x==='string'&&typeof y==='string'&&x.normalize('NFC')===y.normalize('NFC'))return;\n    if(typeof x==='string'&&typeof y==='string'&&x!==y)");
  const faulty=Function('assert','normalized',`return (${source});`)(assert,x=>x);
  assert.throws(()=>exactSemantics('e\u0301','\u00e9'),/semantic-mismatch\/text-codepoints/);
  assert.doesNotThrow(()=>faulty('e\u0301','\u00e9'),'mutant incorrectly permits substitution');
});
for(const [name,change]of [
  ['missing',a=>a.slice(1)],['duplicate',a=>[a[0],...a]],['extra',a=>[...a,{id:'invented'}]],
  ['skipped',a=>a.map((x,i)=>i?x:{...x,skip:true})],['reordered',a=>a.toReversed()]
])test(`representation runner rejects ${name} cases`,()=>assert.throws(()=>validateCases(change(fixtures.positive)),/fixture\//));
for(const [name,r]of [
  ['process failure',{status:1,stdout:'',stderr:'controlled failure'}],
  ['timeout',{status:null,error:Error('timeout'),stdout:''}],
  ['non-JSON',{status:0,stdout:'not JSON'}],['null',{status:0,stdout:'null'}],
  ['missing result',{status:0,stdout:'{"ok":true}'}],['extra result',{status:0,stdout:'{"ok":true,"value":"00","extra":0}'}],
  ['non-Boolean status',{status:0,stdout:'{"ok":"yes","value":"00"}'}],['non-Text reason',{status:0,stdout:'{"ok":false,"error":null}'}]
])test(`representation runner rejects ${name}`,()=>assert.throws(()=>checkedOutput(r),/runner\//));
test('representation runner rejects unknown and recursive fixture references',()=>{
  assert.throws(()=>expand({$ref:'not-defined'},authority),/unknown\/cyclic ref/);
  const key=Object.keys(fixtures.definitions)[0];assert.throws(()=>expand({$ref:key},authority,new Set([key])),/unknown\/cyclic ref/);
  assert.throws(()=>expand({$publication:true,override:'other'},authority),/malformed fixture macro/);
});
test('representation runner rejects semantic disagreements without coercion',()=>{
  for(const [a,b]of [[true,1],[null,[]],[{$integer:'1'},{$integer:'2'}],[{$bytes:'00'},{$bytes:'01'}],['e\u0301','\u00e9'],[[1],[1,2]]])assert.throws(()=>exactSemantics(a,b),/semantic-mismatch/);
});
for(const [fault,reason]of [['codec-failure',/controlled-codec-failure/],['bytes',/canonical-byte-mismatch/],['semantic',/semantic-mismatch\/text-codepoints/],['reencoding',/canonical-reencoding-mismatch/],['output-type',/string/]])test(`representation runner detects injected ${fault}`,()=>{
  const c=fixtures.positive.find(c=>c.id==='text-decomposed');let encodes=0;
  const stub=(language,r)=>{
    if(r.op==='decode')return {ok:true,value:fault==='semantic'?'\u00e9':'e\u0301'};
    encodes++;
    if(fault==='codec-failure')return {ok:false,error:'controlled-codec-failure'};
    if(fault==='output-type')return {ok:true,value:42};
    return {ok:true,value:(fault==='bytes'&&language==='B')||(fault==='reencoding'&&encodes>2)?'42c3a9':'4365cc81'};
  };
  assert.throws(()=>positive(c,authority,stub),reason);
});
test('representation provenance pins exact historical bytes and rejects tampering',()=>{
  const bytes=historical(pins.representation);assert.ok(bytes.length);const bad=Buffer.from(bytes);bad[0]^=1;
  assert.throws(()=>verify(pins.representation,bad),/provenance\/sha256/);
  assert.throws(()=>verify({...pins.representation,blob:'0'.repeat(40)},bytes),/provenance\/git-blob/);
  assert.throws(()=>profileBinding({...pins.representation,commit:'0'.repeat(40)}),/provenance\/representation-binding/);
  assert.throws(()=>historical({...pins.representation,path:'missing-profile.md'}),/provenance\/missing-history/);
});
test('representation missing history fails even with identical mutable working-tree bytes',()=>{
  const temp=mkdtempSync(join(tmpdir(),'event-repr-history-'));
  try{
    assert.equal(spawnSync('git',['init','-q',temp]).status,0);
    const path=join(temp,pins.representation.path);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,historical(pins.representation));
    assert.throws(()=>historical(pins.representation,temp),/provenance\/missing-history:.*no HEAD fallback/);
  }finally{rmSync(temp,{recursive:true,force:true});}
});
test('representation opaque retention does not confer owner-semantic set equality',()=>{
  const owned=parse(Buffer.from(baseline('owned-extension-byte-retention'),'hex'));
  const hex=cbor(['set',[owned,[]]]).toString('hex');
  for(const language of ['A','B'])assert.deepEqual(invoke(language,{op:'decode',type:'extension',hex},authority),{ok:false,error:'unsupported/owner-set-equality'});
});
test('representation unknown owner is unsupported, not self-authenticated by material',()=>{
  const owned=parse(Buffer.from(baseline('owned-action-byte-retention'),'hex'));
  owned.set('owner',['repository',parse(Buffer.from(baseline('source-key-anchor'),'hex'))]);
  const hex=cbor(owned).toString('hex');
  for(const language of ['A','B'])assert.deepEqual(invoke(language,{op:'decode',type:'owned',hex},authority),{ok:false,error:'unsupported/owner-definition'});
});
test('representation authoritative history order is independent of delivery order',()=>{
  assert.equal(baseline('history-delivery-permutation'),baseline('package-established-input-carriage'));
});
test('representation missing establishment canonicalizes to unavailable only before encoding',()=>{
  const c=fixtures.positive.find(c=>c.id==='package-established-input-carriage');
  const value=expand(c.value,authority),d=value.decision_inputs[0],removed=d.assessment_establishments.pop();
  const expected=structuredClone(value);expected.decision_inputs[0].assessment_establishments.push({assessment:removed.assessment,establishment:{status:'unavailable',material:[]}});
  let bytes;
  for(const language of ['A','B']){
    const r=invoke(language,{op:'encode',type:'package',value},authority);assert.equal(r.ok,true,r.error);
    if(bytes)assert.equal(r.value,bytes);bytes=r.value;
    const decoded=invoke(language,{op:'decode',type:'package',hex:bytes},authority);assert.equal(decoded.ok,true,decoded.error);exactSemantics(decoded.value,expected);
  }
  const root=parse(Buffer.from(bytes,'hex')),inputs=root.get('decision_inputs')[0];
  inputs.set('assessment_establishments',[]);
  const hex=cbor(root).toString('hex');
  for(const language of ['A','B'])assert.deepEqual(invoke(language,{op:'decode',type:'package',hex},authority),{ok:false,error:'binding/establishment-subjects'});
});

// Transport controls are not additional semantic vectors or codec mutations.
const pythonCommand=process.env.PYTHON??'python3';
const inputProbe="const fs=require('node:fs'),crypto=require('node:crypto');const b=fs.readFileSync(0);console.log(JSON.stringify({ok:true,value:{bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex'),eof:fs.readSync(0,Buffer.alloc(1),0,1,null),regular:fs.fstatSync(0).isFile()}}));";
const pythonProbe="import sys,os,stat,hashlib,json\nb=sys.stdin.buffer.read()\nprint(json.dumps({'ok':True,'value':{'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'eof':len(sys.stdin.buffer.read(1)),'regular':stat.S_ISREG(os.fstat(0).st_mode)}}))";
function transportControl(command,args,input,mutate=()=>{}){
  const root=mkdtempSync(join(tmpdir(),'ve-transport-control-'));let fd;
  try{
    const r=fileBackedProcess(command,args,input,'control',{tempRoot:root,launch:(c,a,options)=>{
      fd=options.stdio[0];assert.equal(typeof fd,'number');assert.ok(fstatSync(fd).isFile());
      assert.equal(Object.hasOwn(options,'input'),false);assert.equal(options.timeout,120000);
      const dirs=readdirSync(root);assert.equal(dirs.length,1);
      if(process.platform!=='win32'){
        assert.equal(statSync(join(root,dirs[0])).mode&0o777,0o700);
        assert.equal(fstatSync(fd).mode&0o777,0o600);
      }
      mutate(fd,options);return spawnSync(c,a,options);
    }});
    assert.deepEqual(readdirSync(root),[],'temporary input residue');
    if(fd!==undefined)assert.throws(()=>fstatSync(fd),{code:'EBADF'});
    if(r.pid)assert.throws(()=>process.kill(r.pid,0),{code:'ESRCH'},'child must be reaped');
    assert.equal(r.diagnostics.executable,command);assert.equal(r.diagnostics.codec,'control');
    assert.equal(r.diagnostics.inputBytes,Buffer.byteLength(input));
    assert.ok(Number.isFinite(r.diagnostics.elapsedMs)&&r.diagnostics.elapsedMs>=0);
    return r;
  }finally{rmSync(root,{recursive:true,force:true});}
}
const transportInput=()=>JSON.stringify({authority,request:{op:'decode',type:'u64',hex:'20'}});
function assertExactInput(r,input){
  assert.deepEqual(checkedOutput(r),{ok:true,value:{bytes:Buffer.byteLength(input),sha256:createHash('sha256').update(input).digest('hex'),eof:0,regular:true}},'transport/exact-input-and-EOF');
}
test('representation transport exact large input and ordinary-file EOF in both languages',()=>{
  const input=transportInput();assert.ok(Buffer.byteLength(input)>11_000_000);
  for(const [command,args]of [[process.execPath,['-e',inputProbe]],[pythonCommand,['-B','-c',pythonProbe]]])assertExactInput(transportControl(command,args,input),input);
});
test('representation transport truncated delivery is detected independently',()=>{
  const input=transportInput();
  const r=transportControl(process.execPath,['-e',inputProbe],input,fd=>ftruncateSync(fd,Buffer.byteLength(input)-1));
  assert.equal(r.status,0);assert.throws(()=>assertExactInput(r,input),/transport\/exact-input-and-EOF/);
});
test('representation transport drains large stdout and stderr with exact byte diagnostics',()=>{
  const code="const fs=require('node:fs');fs.readFileSync(0);for(let i=0;i<48;i++){fs.writeSync(1,Buffer.alloc(65536,111));fs.writeSync(2,Buffer.alloc(65536,101));}";
  const r=transportControl(process.execPath,['-e',code],transportInput());assert.equal(r.status,0);
  assert.equal(r.stdout,'o'.repeat(3145728));assert.equal(r.stderr,'e'.repeat(3145728));
  assert.equal(r.diagnostics.stdoutBytes,3145728);assert.equal(r.diagnostics.stderrBytes,3145728);
});
test('representation transport actual Node and Python codec paths use files and clean decoder rejection',()=>{
  const before=readdirSync(tmpdir()).filter(x=>x.startsWith('ve-event-stdin-')).sort();
  for(const language of ['A','B']){
    const guard=language==='A'?"\nif(!(await import('node:fs')).fstatSync(0).isFile())throw Error('transport/not-file');":"\nimport os,stat\nassert stat.S_ISREG(os.fstat(0).st_mode), 'transport/not-file'\n";
    const source=sourceFor(language)+guard;
    assert.deepEqual(invoke(language,{op:'encode',type:'text',value:'e\u0301'},authority,source),{ok:true,value:'4365cc81'});
    assert.deepEqual(invoke(language,{op:'decode',type:'u64',hex:'20'},authority,source),{ok:false,error:'domain/uint64'});
  }
  assert.deepEqual(readdirSync(tmpdir()).filter(x=>x.startsWith('ve-event-stdin-')).sort(),before);
  const r=transportControl(process.execPath,['-e',"console.log(JSON.stringify({ok:false,error:'domain/uint64'}))"],'rejection-input');
  assert.deepEqual(checkedOutput(r),{ok:false,error:'domain/uint64'});
});
test('representation transport process failure cleans and reports metadata without material',()=>{
  const secret='SENSITIVE-TRANSPORT-SENTINEL';
  const r=transportControl(process.execPath,['-e',"const b=require('node:fs').readFileSync(0);process.stdout.write(b);process.stderr.write(b);process.exitCode=7;"],secret);
  assert.equal(r.diagnostics.status,7);assert.equal(r.diagnostics.signal,null);assert.equal(r.diagnostics.errorCode,null);
  assert.equal(r.diagnostics.stdoutBytes,secret.length);assert.equal(r.diagnostics.stderrBytes,secret.length);
  assert.throws(()=>checkedOutput(r),e=>e.message.startsWith('runner/subprocess:')&&!e.message.includes(secret)&&e.message.includes('"pid":')&&e.message.includes('"elapsedMs":'));
});
test('representation transport thrown launch error cleans and redacts exception text',()=>{
  const r=transportControl(process.execPath,[],'private-input',()=>{throw Object.assign(Error('private-input'),{code:'CONTROLLED_THROW'});});
  assert.equal(r.diagnostics.errorCode,'CONTROLLED_THROW');assert.equal(r.diagnostics.pid,null);
  assert.throws(()=>checkedOutput(r),e=>e.message.includes('CONTROLLED_THROW')&&!e.message.includes('private-input'));
});
test('representation transport spawn and malformed-output failures clean and carry diagnostics',()=>{
  const r=transportControl(join(tmpdir(),'ve-no-such-executable','absent'),[],'private-input');
  assert.equal(r.diagnostics.errorCode,'ENOENT');assert.throws(()=>checkedOutput(r),/runner\/subprocess/);
  const bad=transportControl(process.execPath,['-e',"process.stdout.write('private-malformed-output')"],'private-input');
  assert.throws(()=>checkedOutput(bad),e=>e.message.startsWith('runner/malformed-output:')&&!e.message.includes('private-malformed-output')&&e.message.includes('"stdoutBytes":24'));
});
test('representation transport real unchanged timeout terminates reaps and cleans',()=>{
  const r=transportControl(process.execPath,['-e',"require('node:fs').readFileSync(0);setTimeout(()=>{},130000);"],'timeout-input');
  assert.equal(r.diagnostics.errorCode,'ETIMEDOUT');assert.equal(r.diagnostics.status,null);assert.equal(r.diagnostics.signal,'SIGTERM');
  assert.ok(r.diagnostics.elapsedMs>=120000,'unchanged 120-second deadline');
  assert.throws(()=>checkedOutput(r),/runner\/subprocess/);
});
