#!/usr/bin/env node
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {chmodSync,closeSync,mkdtempSync,mkdirSync,openSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,join,relative} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {fileBackedProcess,fixtures,governingContext,expand,invoke} from '../bounded-event-representation/compare.mjs';
import {historical,pins,verify} from '../bounded-event-representation/source-loader.mjs';

const here=dirname(fileURLToPath(import.meta.url));
const root=join(here,'../..');
const budgets=JSON.parse(readFileSync(join(here,'budgets.json'),'utf8'));
const manifest=JSON.parse(readFileSync(join(here,'cases.json'),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const J=value=>Buffer.byteLength(JSON.stringify(value));
const I=value=>({$integer:String(value)});

function git(...args){return execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();}
function inventory(){
  const paths=git('ls-tree','-r','--name-only',budgets.baseCommit,'--','experiments/bounded-event-representation').split('\n')
    .filter(p=>p&&p!=='experiments/bounded-event-representation/REPORT.md');
  const entries=paths.sort().map(path=>[path,sha(execFileSync('git',['show',`${budgets.baseCommit}:${path}`],{cwd:root}))]);
  return sha(Buffer.from(JSON.stringify(entries)));
}
function sourceCheck(){
  assert.equal(git('rev-parse','origin/main'),budgets.baseCommit,'source drift: origin/main');
  assert.equal(git('merge-base','HEAD','origin/main'),budgets.baseCommit,'source drift: branch base');
  assert.equal(inventory(),budgets.sourceInventorySha256,'source drift: experiment inventory');
}
function fixture(id){const found=fixtures.positive.find(c=>c.id===id);assert.ok(found,`fixture/${id}`);return found;}
function inputBytes(authority,request){return J({authority,request});}

function compareValue(type,value,authority,{decode=true}={}){
  const request={op:'encode',type,value};
  const size=inputBytes(authority,request);
  assert.ok(size<=budgets.perAttempt.inputBytes,'test-safety/input-budget');
  const a=invoke('A',request,authority),b=invoke('B',request,authority);
  assert.equal(a.ok,true,`A/${a.error}`);assert.equal(b.ok,true,`B/${b.error}`);assert.equal(a.value,b.value,'canonical-byte-mismatch');
  if(decode)for(const language of ['A','B']){
    const out=invoke(language,{op:'decode',type,hex:a.value},authority);
    assert.equal(out.ok,true,`${language}/${out.error}`);
  }
  return {inputBytes:size,carrierBytes:a.value.length/2,carrierSha256:sha(Buffer.from(a.value,'hex')),implementations:{A:'accepted',B:'accepted'}};
}
function rejectBoth(type,hex,error,authority){
  const request={op:'decode',type,hex},size=inputBytes(authority,request);
  assert.ok(size<=budgets.perAttempt.inputBytes,'test-safety/input-budget');
  const out={};for(const language of ['A','B']){out[language]=invoke(language,request,authority);assert.deepEqual(out[language],{ok:false,error});}
  return {inputBytes:size,carrierBytes:hex.length/2,carrierSha256:sha(Buffer.from(hex,'hex')),implementations:{A:out.A.error,B:out.B.error}};
}
function safePresentation(text){return {utf8Sha256:sha(Buffer.from(text)),utf8Bytes:Buffer.byteLength(text),scalarCount:[...text].length,codePoints:[...text].slice(0,24).map(c=>`U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`),view:'code-points-and-digest-only'};}
function nested(depth){let value=['null'];for(let i=0;i<depth;i++)value=['list',[value]];return value;}
function findLiteral(id){
  const negative=JSON.parse(readFileSync(join(here,'../bounded-event-representation/negative-vectors.json'),'utf8')).literal;
  const found=negative.find(c=>c.id===id);assert.ok(found);return found;
}
function transportFailure(result,acceptedCodes){
  assert.notEqual(result.status,0);assert.ok(result.diagnostics);assert.ok(acceptedCodes.includes(result.diagnostics.errorCode)||result.signal||result.error);
  const d=result.diagnostics;
  const diagnostics={codec:d.codec,status:d.status,signal:d.signal,errorCode:d.errorCode,elapsedMs:d.elapsedMs,inputBytes:d.inputBytes,stdoutBytes:d.stdoutBytes,stderrBytes:d.stderrBytes};
  return {inputBytes:d.inputBytes,carrierBytes:null,implementations:{harness:d.errorCode??d.signal},diagnostics};
}

function executeCase(id){
  const authority=governingContext();
  let evidence;
  if(id==='small-integer-control')evidence=compareValue('integer',I(1),authority);
  else if(id==='valid-integer-32768-bit')evidence=compareValue('integer',I((2n**32768n)-1n),authority);
  else if(id==='valid-rational-near-coprime'){
    const q=(2n**8192n)-159n,n=q-1n,endpoint=[I(2026),I(9),I(29),I(12),I(0),I(0),I(n),I(q)];evidence=compareValue('endpoint',endpoint,authority);
  }else if(id==='valid-text-controls'){
    const text='prefix\u0000\n\r\t\u001b[31m] fake PASS\\n{"ok":true}\u2028suffix';evidence={...compareValue('text',text,authority),presentation:safePresentation(text)};
  }else if(id==='preparser-valid-text-2mib'){
    const text='e\u0301'.repeat(1024*1024);evidence={...compareValue('text',text,authority),presentation:safePresentation(text)};
  }else if(id==='valid-list-depth-128')evidence=compareValue('extension',nested(128),authority);
  else if(id==='valid-set-common-prefix'){
    const values=Array.from({length:128},(_,i)=>['text','p'.repeat(2048)+String(i).padStart(3,'0')]);evidence=compareValue('extension',['set',values],authority);
  }else if(id==='valid-repeated-material-package'){
    const c=fixture('event-ACTION_CREATED');evidence=compareValue(c.type,expand(c.value,authority),authority,{decode:false});
  }else if(id==='malformed-truncated-bytes'){
    const c=findLiteral('bytes-truncated');evidence=rejectBoth(c.type,c.hex,c.error,authority);
  }else if(id==='malformed-length-declaration')evidence=rejectBoth('octets','59010000','encoding/truncated',authority);
  else if(id==='calendar-year-one-control')evidence=compareValue('endpoint',[I(1),I(1),I(1),I(0),I(0),I(0),I(0),I(1)],authority);
  else if(id==='calendar-year-zero'||id==='rational-unreduced'||id==='unsupported-extension-constructor'||id==='resource-size-declaration'){
    const c=findLiteral(id==='unsupported-extension-constructor'?'extension-unknown-constructor':id);evidence=rejectBoth(c.type,c.hex,c.error,authority);
  }else if(id==='dependency-unavailable'){
    let code='';try{historical({...pins.semantic,commit:'0000000000000000000000000000000000000000'});}catch(error){code=String(error.message).split(': ')[0];}
    assert.equal(code,'provenance/missing-history');evidence={inputBytes:0,carrierBytes:null,implementations:{loader:code}};
  }else if(id==='dependency-substitution'){
    let code='';try{verify(pins.semantic,Buffer.from('substituted bytes'));}catch(error){code=String(error.message).split(': ')[0];}
    assert.equal(code,'provenance/sha256');evidence={inputBytes:18,carrierBytes:null,implementations:{loader:code}};
  }else if(id==='establishment-failed'){
    const c=fixture('establishment-failed');evidence=compareValue(c.type,expand(c.value,authority),authority);evidence.establishmentStatus='failed';
  }else if(id==='diagnostic-injection'){
    const injected='unknown\nPASS fake\r\u001b[31m';const request={op:'encode',type:injected,value:null},out={};
    for(const language of ['A','B']){out[language]=invoke(language,request,authority);assert.deepEqual(out[language],{ok:false,error:'unsupported/test-type'});assert.ok(!JSON.stringify(out[language]).includes('PASS fake'));}
    evidence={inputBytes:inputBytes(authority,request),carrierBytes:null,implementations:{A:out.A.error,B:out.B.error},presentation:safePresentation(injected)};
  }else if(id==='controlled-permission-failure'){
    const blocked=join(process.env.ADVERSARIAL_TEMP_ROOT,'blocked');mkdirSync(blocked,0o500);
    const r=fileBackedProcess(process.execPath,['-e',''], '{}','permission',{tempRoot:blocked});chmodSync(blocked,0o700);evidence=transportFailure(r,['EACCES','EPERM']);
  }else if(id==='controlled-launch-failure'){
    evidence=transportFailure(fileBackedProcess('/definitely/not/a/ve-executable',[], '{}','launch'),['ENOENT']);
  }else if(id==='controlled-write-cutoff'){
    const script='import os,resource,tempfile; resource.setrlimit(resource.RLIMIT_FSIZE,(1024,1024)); f=open(tempfile.mktemp(),"wb"); f.write(b"x"*4096); f.flush(); os.fsync(f.fileno()); f.close()';
    const r=spawnSync(process.env.PYTHON??'python3',['-c',script],{encoding:'buffer',timeout:2000,maxBuffer:65536});assert.notEqual(r.status,0);
    evidence={inputBytes:4096,carrierBytes:null,implementations:{child:r.error?.code??r.signal??`status-${r.status}`},diagnostics:{stdoutBytes:r.stdout?.length??0,stderrBytes:r.stderr?.length??0}};
  }else if(id==='controlled-output-cutoff'){
    const r=spawnSync(process.execPath,['-e',"process.stdout.write('x'.repeat(131072))"],{encoding:'buffer',timeout:2000,maxBuffer:budgets.controlledInnerCutoffs.capturedOutputBytes});assert.equal(r.error?.code,'ENOBUFS');
    evidence={inputBytes:0,carrierBytes:null,implementations:{child:'ENOBUFS'},diagnostics:{capturedOutputLimit:budgets.controlledInnerCutoffs.capturedOutputBytes}};
  }else if(id==='controlled-cleanup-failure'){
    const outer=join(process.env.ADVERSARIAL_TEMP_ROOT,'cleanup');mkdirSync(outer,0o700);let inner;
    try{
      const launch=()=>{chmodSync(outer,0o500);return{status:0,stdout:Buffer.from('{"ok":true,"value":"00"}'),stderr:Buffer.alloc(0)};};
      inner=fileBackedProcess(process.execPath,['-e',''], '{}','cleanup',{launch,tempRoot:outer});
    }finally{chmodSync(outer,0o700);}
    assert.ok(inner.error||inner.diagnostics.errorCode);const observed=readdirSync(outer);rmSync(outer,{recursive:true,force:true});
    evidence={inputBytes:2,carrierBytes:null,implementations:{harness:inner.diagnostics.errorCode},innerResidueCount:observed.length,outerCleanup:'complete'};
  }else if(id==='controlled-parent-interruption'){
    const script="const{spawn}=require('child_process');const c=spawn(process.execPath,['-e','setTimeout(()=>{},2000)']);console.log(c.pid);process.kill(process.pid,'SIGTERM')";
    const r=spawnSync(process.execPath,['-e',script],{encoding:'utf8',timeout:2000,maxBuffer:65536});assert.ok(r.signal||r.status!==0);const pid=Number(String(r.stdout).trim());
    if(Number.isSafeInteger(pid)){try{process.kill(pid,'SIGKILL');}catch{};}
    evidence={inputBytes:0,carrierBytes:null,implementations:{parent:r.signal??`status-${r.status}`},childCleanup:'kill-issued-if-created'};
  }else if(id==='controlled-hostile-child'){
    const script="process.on('SIGTERM',()=>{});setInterval(()=>{},1000)";const r=spawnSync(process.execPath,['-e',script],{encoding:'buffer',timeout:budgets.controlledInnerCutoffs.wallMilliseconds,killSignal:'SIGKILL',maxBuffer:65536});assert.equal(r.error?.code,'ETIMEDOUT');
    evidence={inputBytes:0,carrierBytes:null,implementations:{child:'ETIMEDOUT'},diagnostics:{wallCutoffMilliseconds:budgets.controlledInnerCutoffs.wallMilliseconds}};
  }else if(id==='controlled-fd-cutoff'){
    const fds=[];let code='';try{for(;;)fds.push(openSync('/dev/null','r'));}catch(error){code=error.code;}finally{for(const fd of fds)closeSync(fd);}assert.equal(code,'EMFILE');
    evidence={inputBytes:0,carrierBytes:null,implementations:{worker:code},openedDescriptors:fds.length,closedDescriptors:fds.length};
  }else if(id==='platform-process-limit'){
    evidence={inputBytes:0,carrierBytes:null,implementations:{orchestrator:'serial-child-count-cap'},hardProcessLimit:'reported-by-watchdog'};
  }else throw Error(`unknown case ${id}`);
  return {workerFormat:'bounded-representation-adversarial-worker-1',caseId:id,node:process.version,platform:process.platform,architecture:process.arch,evidence};
}

function attempt(caseInfo,repetition){
  const attemptRoot=mkdtempSync(join(tmpdir(),'ve-adversarial-attempt-'));rmSync(attemptRoot,{recursive:true,force:true});
  const memorySelfTest=caseInfo.id==='controlled-memory-watchdog-cutoff';
  const memoryBudget=memorySelfTest?budgets.controlledInnerCutoffs.memoryBytes:budgets.perAttempt.memoryBytes;
  const python=process.env.PYTHON??'python3';
  const allocationScript=`import time\nblocks=[]\nfor _ in range(${budgets.controlledInnerCutoffs.memoryAllocationBytes}//8388608):\n blocks.append(bytearray(8388608))\n time.sleep(0.01)\ntime.sleep(5)`;
  const memoryScript=`import signal,subprocess,sys\nchild=subprocess.Popen([sys.executable,'-c',${JSON.stringify(allocationScript)}])\ndef stop(signum,frame):\n child.wait()\n raise SystemExit(128+signum)\nsignal.signal(signal.SIGTERM,stop)\nchild.wait()`;
  const command=memorySelfTest?[python,'-c',memoryScript]:[process.execPath,fileURLToPath(import.meta.url),'--case',caseInfo.id];
  const args=[join(here,'watchdog.py'),'--wall-ms',String(budgets.perAttempt.wallMilliseconds),'--cpu-seconds',String(budgets.perAttempt.cpuSeconds),'--memory-bytes',String(memoryBudget),'--file-bytes',String(budgets.perAttempt.fileBytes),'--fd-limit',String(budgets.perAttempt.fileDescriptors),'--output-bytes',String(budgets.perAttempt.capturedOutputBytes),...(memorySelfTest?['--external-memory-only']:[]),'--temp-root',attemptRoot,...command];
  const run=spawnSync(python,args,{cwd:root,encoding:'utf8',timeout:budgets.perAttempt.wallMilliseconds+5000,maxBuffer:2*1024*1024});
  assert.equal(run.status,0,`external-watchdog/${caseInfo.id}`);const observed=JSON.parse(run.stdout);
  const worker=observed.worker;
  const peakRssBytes=observed.memoryMonitor.peakGroupRssBytes;
  const commonFailure=observed.timedOut||observed.outputLimitExceeded||observed.diskLimitExceeded||observed.memoryMeasurementError!==null||observed.launchError!==null||observed.processGroupSurvived||observed.cleanupError!==null||observed.tempResidueAfterCleanup.length>0||observed.stderrBytes>0||!observed.limitsEnforced.aggregateRssMemory;
  const expectedMemoryCutoff=memorySelfTest&&observed.memoryLimitExceeded&&observed.returnCode!==0&&worker===null&&peakRssBytes>memoryBudget;
  const unexpected=commonFailure||(memorySelfTest?!expectedMemoryCutoff:!worker||worker.caseId!==caseInfo.id||observed.memoryLimitExceeded||observed.returnCode!==0||peakRssBytes>budgets.perAttempt.memoryBytes);
  const platformUnsupported=caseInfo.id==='platform-process-limit'&&!observed.limitsEnforced.processes;
  const disposition=unexpected?'inconclusive-environmental':platformUnsupported?'unsupported-platform':caseInfo.id==='resource-size-declaration'?'expected-incomplete-processing':['controlled-write-cutoff','controlled-output-cutoff','controlled-hostile-child','controlled-memory-watchdog-cutoff','controlled-fd-cutoff'].includes(caseInfo.id)?'test-safety-cutoff':'pass';
  const caseObservations=memorySelfTest?{configuredMemoryBytes:memoryBudget,syntheticAllocationBytes:budgets.controlledInnerCutoffs.memoryAllocationBytes,cutoff:'aggregate-rss-memory-limit',monitorSamples:observed.memoryMonitor.samples}:worker?Object.fromEntries(Object.entries(worker.evidence).filter(([key])=>!['inputBytes','carrierBytes','carrierSha256','implementations','presentation'].includes(key))):null;
  const actualOutcome=memorySelfTest?{watchdog:'aggregate-rss-memory-limit'}:worker?.evidence?.implementations??null;
  const record={attemptId:`${caseInfo.id}#${repetition}`,caseId:caseInfo.id,repetition,threats:caseInfo.threats,targetedStage:caseInfo.stage,expectedOutcome:caseInfo.expected,outcomeClass:caseInfo.outcomeClass,actualOutcome,evidenceDisposition:disposition,inputBytes:worker?.evidence?.inputBytes??0,carrierBytes:worker?.evidence?.carrierBytes??null,relevantBytes:worker?.evidence?.carrierSha256?{canonicalSha256:worker.evidence.carrierSha256}:null,presentation:worker?.evidence?.presentation??null,caseObservations,resources:{wallMilliseconds:observed.elapsedMilliseconds,cpuUserSeconds:observed.cpuUserSeconds,cpuSystemSeconds:observed.cpuSystemSeconds,peakRssBytes,peakTempBytes:observed.peakTempBytes,memoryBudgetBytes:memoryBudget,aggregateMemoryWatchdogEnforced:observed.limitsEnforced.aggregateRssMemory,hardAddressSpaceLimitEnforced:observed.limitsEnforced.addressSpace,memoryMonitor:observed.memoryMonitor,limitsEnforced:observed.limitsEnforced,stdoutBytes:observed.stdoutBytes,stderrBytes:observed.stderrBytes},aftermath:{processGroupSurvived:observed.processGroupSurvived,fileDescriptorsBefore:observed.fdCountBefore,fileDescriptorsAfter:observed.fdCountAfter,tempResidueBeforeCleanup:observed.tempResidueBeforeCleanup,tempResidueAfterCleanup:observed.tempResidueAfterCleanup,cleanupError:observed.cleanupError},runtime:{...observed.runtime,node:worker?.node??null,platform:worker?.platform??null,architecture:worker?.architecture??null},classification:unexpected?'inconclusive':'pass'};
  rmSync(attemptRoot,{recursive:true,force:true});
  assert.ok(!unexpected,`stop condition/${caseInfo.id}/${JSON.stringify(observed)}`);return record;
}

function runAll(output){
  sourceCheck();assert.ok(manifest.cases.reduce((sum,c)=>sum+c.repetitions,0)<=budgets.aggregate.attempts);
  const started=performance.now(),attempts=[];
  for(const c of manifest.cases){
    assert.ok(c.repetitions<=budgets.aggregate.repetitionsPerCase);
    for(let repetition=1;repetition<=c.repetitions;repetition++){
      assert.ok(performance.now()-started<budgets.aggregate.wallMilliseconds,'aggregate wall budget');sourceCheck();attempts.push(attempt(c,repetition));
    }
  }
  sourceCheck();assert.ok(performance.now()-started<=budgets.aggregate.wallMilliseconds,'aggregate wall budget');
  const result={format:'bounded-representation-adversarial-results-1',baseCommit:budgets.baseCommit,sourceInventorySha256:budgets.sourceInventorySha256,budgets,cases:manifest.cases,attempts,summary:{attempts:attempts.length,pass:attempts.filter(x=>x.classification==='pass').length,failure:attempts.filter(x=>x.classification==='failure').length,inconclusive:attempts.filter(x=>x.classification==='inconclusive').length,deterministicImplementationDefect:attempts.filter(x=>x.evidenceDisposition==='deterministic-implementation-defect').length,expectedIncomplete:attempts.filter(x=>x.evidenceDisposition==='expected-incomplete-processing').length,testSafetyCutoff:attempts.filter(x=>x.evidenceDisposition==='test-safety-cutoff').length,unsupportedPlatform:attempts.filter(x=>x.evidenceDisposition==='unsupported-platform').length,elapsedMilliseconds:Math.round(performance.now()-started)}};
  writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'w'});console.log(JSON.stringify(result.summary));
}

if(process.argv[2]==='--case')process.stdout.write(JSON.stringify(executeCase(process.argv[3]))+'\n');
else if(import.meta.url===pathToFileURL(process.argv[1]).href){const index=process.argv.indexOf('--output');assert.ok(index>=0&&process.argv[index+1]);runAll(process.argv[index+1]);}
