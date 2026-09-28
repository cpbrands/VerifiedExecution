// Process/provenance plumbing only, not codec mappings or expected-byte logic.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
export const dir=new URL('./',import.meta.url),root=new URL('../../',dir);
export const pins=JSON.parse(readFileSync(new URL('sources.json',dir),'utf8'));
export const editions=JSON.parse(readFileSync(new URL('owners.json',dir),'utf8')).editions;
export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function check(p,message){if(!p)throw Error(`provenance/${message}`);}
export function profileBinding(p=pins.representation){
  const fixed={commit:'bc080e6037bdd3129d5132d90d9253ed85f59c1b',path:'specifications/BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE.md',blob:'6893d9caaf10a91b7d5c4ea5c5a7cf1022bbbc73',sha256:'8217fe6e6890dba182ebc8dcc2d4f9deeed824b71b3fddcfc31b0cf7458ce56e'};
  check(Object.keys(p).sort().join(',')===Object.keys(fixed).sort().join(',')&&Object.keys(fixed).every(k=>p[k]===fixed[k]),'representation-binding');
}
export function verify(pin,bytes){
  check(sha(bytes)===pin.sha256,`sha256: ${pin.path??pin.document}`);
  if(pin.blob)check(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')===pin.blob,`git-blob: ${pin.path}`);
  return bytes;
}
export function historical(pin,cwd=root){
  check(/^[0-9a-f]{40}$/.test(pin.commit),'commit-syntax');
  check(typeof pin.path==='string'&&!pin.path.startsWith('/')&&!pin.path.split('/').includes('..'),'path-syntax');
  const r=spawnSync('git',['--no-replace-objects','cat-file','blob',`${pin.commit}:${pin.path}`],{cwd,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},timeout:10000,maxBuffer:8*1024*1024});
  check(!r.error&&r.status===0,`missing-history: ${pin.commit}:${pin.path}; full history required, no HEAD fallback`);
  return verify(pin,r.stdout);
}
export function catalog(cwd=root){
  profileBinding();
  const repository=[pins.representation,pins.semantic,...pins.imports].map(pin=>({pin,bytes:historical(pin,cwd)}));
  const external=editions.map(pin=>{
    const file=new URL(`.cache/${pin.sha256}`,dir);
    check(existsSync(file),`owner-unavailable: ${pin.document}; run source-loader.mjs --hydrate`);
    return {pin,bytes:verify(pin,readFileSync(file))};
  });
  return {repository,external};
}
async function hydrate(){
  // Network locations are acquisition hints only. Every use rechecks fixed bytes.
  mkdirSync(new URL('.cache/',dir),{recursive:true});
  for(const pin of editions){
    check(/^[0-9a-f]{64}$/.test(pin.sha256),'external-fingerprint-syntax');
    const file=new URL(`.cache/${pin.sha256}`,dir);
    if(existsSync(file)){verify(pin,readFileSync(file));continue;}
    const response=await fetch(pin.url,{signal:AbortSignal.timeout(30000)});
    check(response.ok,`owner-download: ${pin.document}`);
    const bytes=Buffer.from(await response.arrayBuffer());verify(pin,bytes);
    writeFileSync(file,bytes,{flag:'wx'});
  }
  const c=catalog();console.log(JSON.stringify({repositoryPins:c.repository.length,externalPins:c.external.length}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  if(process.argv[2]!=='--hydrate')throw Error('usage: node source-loader.mjs --hydrate');
  await hydrate();
}
