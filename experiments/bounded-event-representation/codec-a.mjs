// Independent implementation A: typed combinators over a strict CBOR tree.
// Local process values use {$bytes: lowercase hex} and {$integer: decimal}.
// These tags are experiment syntax, never VE wire or semantic definitions.
import {createHash} from 'node:crypto';
export class Failure extends Error { constructor(code){super(code);this.code=code;} }
const fail=c=>{throw new Failure(c);};
const need=(p,c)=>{if(!p)fail(c);};
const B=Buffer.from, join=xs=>Buffer.concat(xs);
const eq=(a,b)=>Buffer.compare(a,b)===0;
const LIMIT=64*1024*1024;
function head(m,n){
  n=BigInt(n);need(n>=0n&&n<=0xffffffffffffffffn,'domain/native-integer');
  if(n<24n)return B([m*32+Number(n)]);
  const size=n<=255n?1:n<=65535n?2:n<=0xffffffffn?4:8;
  const b=Buffer.alloc(size+1);b[0]=m*32+({1:24,2:25,4:26,8:27}[size]);
  for(let i=size;i>0;i--){b[i]=Number(n&255n);n>>=8n;}return b;
}
function scalarText(s){
  need(typeof s==='string','domain/text');
  for(let i=0;i<s.length;i++){
    const c=s.charCodeAt(i);
    if(c>=0xd800&&c<=0xdbff){const d=s.charCodeAt(++i);need(d>=0xdc00&&d<=0xdfff,'domain/text-scalar');}
    else need(c<0xdc00||c>0xdfff,'domain/text-scalar');
  }return s;
}
export function cbor(x){
  if(x===null)return B([0xf6]);
  if(typeof x==='boolean')return B([x?0xf5:0xf4]);
  if(typeof x==='bigint')return x>=0n?head(0,x):head(1,-1n-x);
  if(Buffer.isBuffer(x))return join([head(2,x.length),x]);
  if(typeof x==='string'){
    scalarText(x);need(x.normalize('NFC')===x,'canonical/native-text-nfc');
    const b=B(x);return join([head(3,b.length),b]);
  }
  if(Array.isArray(x))return join([head(4,x.length),...x.map(cbor)]);
  need(x instanceof Map,'structure/cbor-value');
  const entries=[...x].map(([k,v])=>{need(typeof k==='string','structure/map-key');return[cbor(k),cbor(v)];}).sort((a,b)=>Buffer.compare(a[0],b[0]));
  return join([head(5,entries.length),...entries.flat()]);
}
export function parse(bytes){
  need(Buffer.isBuffer(bytes),'structure/bytes');need(bytes.length<=LIMIT,'processing-incomplete/resource-limit');
  let at=0,nodes=0;
  function read(depth=0){
    need(depth<=2048&&++nodes<=1000000,'processing-incomplete/resource-limit');
    need(at<bytes.length,'encoding/truncated');const h=bytes[at++],m=h>>5,a=h&31;
    if(m===7){if(h===0xf4)return false;if(h===0xf5)return true;if(h===0xf6)return null;fail('encoding/forbidden-simple');}
    need(m<=5,'encoding/forbidden-tag');need(a<28,'encoding/indefinite-or-reserved');
    let n=BigInt(a);
    if(a>=24){const size=1<<(a-24);need(at+size<=bytes.length,'encoding/truncated');n=0n;for(let i=0;i<size;i++)n=(n<<8n)|BigInt(bytes[at++]);need(n>=([24n,256n,65536n,4294967296n][a-24]),'canonical/nonminimal-argument');}
    if(m===0)return n;if(m===1)return -1n-n;
    need(n<=BigInt(LIMIT),'processing-incomplete/resource-limit');const len=Number(n);
    if(m===2||m===3){need(at+len<=bytes.length,'encoding/truncated');const b=bytes.subarray(at,at+len);at+=len;if(m===2)return B(b);
      let s;try{s=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(b);}catch{fail('encoding/utf8');}need(s.normalize('NFC')===s,'canonical/native-text-nfc');return s;}
    if(m===4){const values=[];for(let i=0;i<len;i++)values.push(read(depth+1));return values;}
    const map=new Map();let previous=null;
    for(let i=0;i<len;i++){const start=at,k=read(depth+1),encoded=bytes.subarray(start,at);need(typeof k==='string','structure/map-key');need(!map.has(k),'canonical/duplicate-key');need(previous===null||Buffer.compare(previous,encoded)<0,'canonical/map-order');previous=encoded;map.set(k,read(depth+1));}return map;
  }
  let value;try{value=read();}catch(e){if(e instanceof RangeError)fail('processing-incomplete/resource-limit');throw e;}
  need(at===bytes.length,'encoding/trailing');return value;
}
const octets={
  enc(x){need(x&&Object.keys(x).length===1&&typeof x.$bytes==='string'&&/^(?:[0-9a-f]{2})*$/.test(x.$bytes),'domain/octets');const b=B(x.$bytes,'hex');let p=b.length<=4096?0:Math.floor((b.length-1)/4096)*4096;let t=b.subarray(p);while(p){p-=4096;t=[b.subarray(p,p+4096),t];}return t;},
  dec(x){const out=[];while(Array.isArray(x)){need(x.length===2&&Buffer.isBuffer(x[0])&&x[0].length===4096,'canonical/octet-chunks');out.push(x[0]);x=x[1];}need(Buffer.isBuffer(x)&&x.length<=4096&&(out.length===0||x.length>0),'canonical/octet-chunks');out.push(x);return{$bytes:join(out).toString('hex')};}
};
const text={enc(x){return octets.enc({$bytes:B(scalarText(x)).toString('hex')});},dec(x){let s;try{s=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(B(octets.dec(x).$bytes,'hex'));}catch(e){if(e instanceof Failure)throw e;fail('encoding/utf8');}return s;}};
const integer={
  enc(x){need(x&&Object.keys(x).length===1&&typeof x.$integer==='string'&&/^(0|-?[1-9][0-9]*)$/.test(x.$integer),'domain/integer');const n=BigInt(x.$integer),v=n<0n?-n:n;let h=v===0n?'':v.toString(16);if(h.length%2)h='0'+h;return[n<0n,octets.enc({$bytes:h})];},
  dec(x){need(Array.isArray(x)&&x.length===2&&typeof x[0]==='boolean','canonical/integer-form');const h=octets.dec(x[1]).$bytes;need(!h.startsWith('00')&&!(x[0]&&h===''),'canonical/integer-magnitude');const n=h===''?0n:BigInt('0x'+h);return{$integer:String(x[0]?-n:n)};}
};
const range=(codec,predicate,code)=>({enc(x){need(predicate(x),code);return codec.enc(x);},dec(x){const v=codec.dec(x);need(predicate(v),code);return v;}});
const nat=range(integer,x=>x&&typeof x.$integer==='string'&&/^(0|[1-9][0-9]*)$/.test(x.$integer),'domain/nonnegative');
const pos=range(nat,x=>x.$integer!=='0','domain/positive');
const nativeInteger={enc(x){integer.enc(x);return BigInt(x.$integer);},dec(x){need(typeof x==='bigint','domain/native-integer');return{$integer:String(x)};}};
const u64=range(nativeInteger,x=>x&&typeof x.$integer==='string'&&/^(0|[1-9][0-9]*)$/.test(x.$integer)&&BigInt(x.$integer)<=0xffffffffffffffffn,'domain/uint64');
const boolean={enc(x){need(typeof x==='boolean','domain/boolean');return x;},dec(x){return this.enc(x);}};
const enumeration=values=>({enc(x){need(values.includes(x),'domain/enum');return x;},dec(x){return this.enc(x);}});
const sizedBytes=n=>({enc(x){const b=octets.enc(x);need(Buffer.isBuffer(b)&&b.length===n,'domain/octet-width');return b;},dec(x){need(Buffer.isBuffer(x)&&x.length===n,'domain/octet-width');return{$bytes:x.toString('hex')};}});
const record=fields=>({
  enc(x){need(x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).sort().join('\0')===Object.keys(fields).sort().join('\0'),'structure/record-fields');return new Map(Object.entries(fields).map(([k,t])=>[k,t.enc(x[k])]));},
  dec(x){need(x instanceof Map&&[...x.keys()].sort().join('\0')===Object.keys(fields).sort().join('\0'),'structure/record-fields');return Object.fromEntries(Object.entries(fields).map(([k,t])=>[k,t.dec(x.get(k))]));}
});
const tuple=types=>({enc(x){need(Array.isArray(x)&&x.length===types.length,'structure/tuple');return types.map((t,i)=>t.enc(x[i]));},dec(x){need(Array.isArray(x)&&x.length===types.length,'structure/tuple');return types.map((t,i)=>t.dec(x[i]));}});
const list=t=>({enc(x){need(Array.isArray(x),'structure/list');let out=[];for(let i=x.length-1;i>=0;i--)out=[t.enc(x[i]),out];return out;},dec(x){const out=[];while(Array.isArray(x)&&x.length===2){out.push(t.dec(x[0]));x=x[1];}need(Array.isArray(x)&&x.length===0,'canonical/list-shape');return out;}});
const optional=t=>({enc(x){need(Array.isArray(x)&&x.length<=1,'structure/optional');return x.map(v=>t.enc(v));},dec(x){need(Array.isArray(x)&&x.length<=1,'structure/optional');return x.map(v=>t.dec(v));}});
const set=t=>({enc(x){need(Array.isArray(x),'structure/set');const pairs=x.map(v=>{const tree=t.enc(v);return[cbor(tree),tree];}).sort((a,b)=>Buffer.compare(a[0],b[0]));return list({enc:v=>v}).enc(pairs.filter((v,i)=>!i||!eq(v[0],pairs[i-1][0])).map(v=>v[1]));},dec(x){const nodes=list({dec:v=>v}).dec(x);let prev=null;return nodes.map(v=>{const b=cbor(v);need(prev===null||Buffer.compare(prev,b)<0,'canonical/set-order-or-duplicate');prev=b;return t.dec(v);});}});
const nonempty=range(text,x=>typeof x==='string'&&x.length>0,'domain/nonempty-text');
const small=(lo,hi)=>range(nativeInteger,x=>x&&typeof x.$integer==='string'&&/^(0|[1-9][0-9]*)$/.test(x.$integer)&&BigInt(x.$integer)>=BigInt(lo)&&BigInt(x.$integer)<=BigInt(hi),'domain/calendar-component');
const endpointRaw=tuple([pos,small(1,12),small(1,31),small(0,23),small(0,59),small(0,59),nat,pos]);
function endpointValid(x){
  if(!Array.isArray(x)||x.length!==8)return false;
  endpointRaw.enc(x);const [y,m,d,,,,n,q]=x.map(v=>BigInt(v.$integer));
  const leap=y%4n===0n&&(y%100n!==0n||y%400n===0n),days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
  let a=n,b=q;while(b){[a,b]=[b,a%b];}return d<=BigInt(days[Number(m)-1])&&n<q&&a===1n;
}
const endpoint=range(endpointRaw,endpointValid,'domain/endpoint');
const cmpEnd=(a,b)=>{const x=a.map(v=>BigInt(v.$integer)),y=b.map(v=>BigInt(v.$integer));for(let i=0;i<6;i++)if(x[i]!==y[i])return x[i]<y[i]?-1:1;const n=x[6]*y[7]-y[6]*x[7];return n===0n?0:n<0n?-1:1;};
const interval=range(record({earliest:endpoint,latest:endpoint}),x=>x&&cmpEnd(x.earliest,x.latest)<=0,'domain/interval');
const roles=enumeration(['boundary','validation','authorization','execution','time']);
const categories=enumeration(['validation','identity','delegation','policy','approval']);
const status=enumeration(['verified','failed','unavailable']);
const constant=x=>enumeration([x]);
const kinds=['ACTION_CREATED','VALIDATION_STARTED','VALIDATION_SUCCEEDED','AUTHORIZATION_GRANTED','EXECUTION_STARTED','EXECUTION_COMPLETED','EXECUTION_FAILED'];
const type=record({authority:nonempty,profile:nonempty,revision:nonempty,kind:nonempty});
const boundedType=range(type,x=>x&&x.authority==='https://github.com/cpbrands/VerifiedExecution'&&x.profile==='BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE'&&x.revision==='0.2-draft.1'&&kinds.includes(x.kind),'binding/event-type');
const sourceKey=record({repository:constant('https://github.com/cpbrands/VerifiedExecution'),commit:sizedBytes(20),path:nonempty,blob:sizedBytes(20),sha256:sizedBytes(32)});
const editionKey=record({authority:nonempty,edition:nonempty,document:nonempty,sha256:sizedBytes(32)});
const materials=record({repository:set(record({key:sourceKey,body:optional(octets)})),external:set(record({key:editionKey,body:optional(octets)}))});
const owner={enc(x){need(Array.isArray(x)&&x.length===2,'structure/owner');return tuple([constant(x[0]),x[0]==='repository'?sourceKey:x[0]==='external'?editionKey:fail('unsupported/owner-kind')]).enc(x);},dec(x){need(Array.isArray(x)&&x.length===2,'structure/owner');return tuple([constant(x[0]),x[0]==='repository'?sourceKey:x[0]==='external'?editionKey:fail('unsupported/owner-kind')]).dec(x);}};
const owned=record({owner,bytes:octets,definitions:materials});
const establishment=record({status,material:list(owned)});
const contextRaw=record({sources:list(record({name:nonempty,roles:set(roles)})),conditions:list(record({category:categories,contract:nonempty,inputs:nonempty,evaluator:nonempty})),not_applicable:list(record({category:categories,reason:nonempty})),execution_terms:nonempty,commit_required:boolean});
function validContext(x){
  contextRaw.enc(x);const names=x.sources.map(s=>s.name);
  need(names.length>0&&new Set(names).size===names.length&&x.sources.every(s=>s.roles.length>0),'domain/sources');
  const conditions=x.conditions.map(c=>cbor(contextRaw.enc({...x,conditions:[c]})).toString('hex'));
  need(new Set(conditions).size===conditions.length,'domain/duplicate-condition');
  for(const category of ['validation','identity','delegation','policy','approval']){
    const cs=x.conditions.filter(c=>c.category===category),ns=x.not_applicable.filter(n=>n.category===category);
    need((cs.length>0&&ns.length===0)||(cs.length===0&&ns.length===1&&!['validation','identity'].includes(category)),'domain/category-coverage');
    for(const c of cs)need(x.sources.some(s=>s.name===c.evaluator&&s.roles.includes(category==='validation'?'validation':'authorization')),'binding/condition-authority');
  }return true;
}
const context=range(contextRaw,validContext,'domain/context');
const binding=record({action_id:sizedBytes(32),action_digest:sizedBytes(32),bound_instance_fields:record({}),event_type:boundedType,event_id:sizedBytes(32),prior_head:optional(sizedBytes(32)),sequence:u64,context});
function statementCodec(x){need(Array.isArray(x)&&x.length>0,'structure/statement');const k=x[0];return k==='condition'?tuple([constant(k),nat]):['fact','commit','time'].includes(k)?tuple([constant(k)]):fail('domain/statement');}
const statement={enc:x=>statementCodec(x).enc(x),dec:x=>statementCodec(x).dec(x)};
const timeResult={enc(x){need(Array.isArray(x),'structure/time-result');return (x[0]==='bound'?tuple([constant('bound'),interval]):tuple([constant('unknown')])).enc(x);},dec(x){need(Array.isArray(x),'structure/time-result');return (x[0]==='bound'?tuple([constant('bound'),interval]):tuple([constant('unknown')])).dec(x);}};
const resultFor=s=>s==='fact'?enumeration(['established','refuted','unknown']):s==='condition'?enumeration(['satisfied','unsatisfied','unknown']):s==='commit'?enumeration(['committed','not_committed','unknown','not_applicable']):timeResult;
const assessment={
  enc(x){return record({binding,source:nonempty,role:roles,statement,result:resultFor(x.statement[0]),basis:nonempty}).enc(x);},
  dec(x){need(x instanceof Map,'structure/record-fields');const s=statement.dec(x.get('statement'));return record({binding,source:nonempty,role:roles,statement,result:resultFor(s[0]),basis:nonempty}).dec(x);}
};
const native={enc(x){if(x===null||typeof x==='boolean'||typeof x==='string')return x;if(Array.isArray(x))return x.map(v=>this.enc(v));need(x&&typeof x==='object','domain/native');if(Object.hasOwn(x,'$integer'))return nativeInteger.enc(x);if(Object.hasOwn(x,'$bytes')){octets.enc(x);return B(x.$bytes,'hex');}return new Map(Object.entries(x).map(([k,v])=>[k,this.enc(v)]));},dec(x){if(x instanceof Map)return Object.fromEntries([...x].map(([k,v])=>[k,this.dec(v)]));if(Buffer.isBuffer(x))return{$bytes:x.toString('hex')};if(typeof x==='bigint')return{$integer:String(x)};if(Array.isArray(x))return x.map(v=>this.dec(v));return x;}};
const account=record({servicing_agent_canadian_sort_code:range(native,x=>typeof x==='string'&&/^0[0-9]{8}$/.test(x),'domain/sort-code'),account_id:range(native,x=>typeof x==='string'&&[...x].length>=1&&[...x].length<=34&&x.normalize('NFC')===x,'domain/account-id')});
const fields=record({amount_minor:range(u64,x=>x&&BigInt(x.$integer)>=1n&&BigInt(x.$integer)<=99999999999999n,'domain/amount'),source_account:account,destination_account:account});
const action=record({action_digest:sizedBytes(32),instance:record({action_id:sizedBytes(32)}),semantic:record({fields,schema_digest:sizedBytes(32)})});
const actionInline=record({value:action,schema:optional(native),definitions:materials});
const extension={
  enc(x){need(Array.isArray(x)&&x.length>=1,'structure/extension');return this.for(x[0]).enc(x);},
  dec(x){need(Array.isArray(x)&&x.length>=1,'structure/extension');return this.for(x[0]).dec(x);},
  for(k){const values={null:null,boolean,integer,text,octets,list:list(this),set:set(this),record:named(this),owned};need(Object.hasOwn(values,k),'unsupported/extension-constructor');return tuple(k==='null'?[constant(k)]:[constant(k),values[k]]);}
};
function named(t){return{
  enc(x){need(Array.isArray(x)&&x.every(p=>Array.isArray(p)&&p.length===2),'structure/named-record');const entries=x.map(([n,v])=>[cbor(text.enc(n)),n,v]).sort((a,b)=>Buffer.compare(a[0],b[0]));for(let i=1;i<entries.length;i++)need(!eq(entries[i-1][0],entries[i][0]),'canonical/duplicate-name');return list(tuple([text,t])).enc(entries.map(e=>e.slice(1)));},
  dec(x){const entries=list(tuple([text,t])).dec(x);let p=null;for(const [n]of entries){const b=cbor(text.enc(n));need(p===null||Buffer.compare(p,b)<0,'canonical/name-order-or-duplicate');p=b;}return entries;}
};}
const event=record({event_id:sizedBytes(32),action_id:sizedBytes(32),event_type:boundedType,occurred_at:interval,sequence:u64,spec_version:tuple([constant('VE-002'),constant('0.2')]),payload:record({action:actionInline,context,assessments:set(assessment)}),extensions:range(named(extension),x=>Array.isArray(x)&&x.every(([n])=>!['event_id','action_id','event_type','occurred_at','sequence','spec_version','payload','actor','component','references'].includes(n)),'domain/extension-collision')});
const commonInputs={action:actionInline,context,assessments:set(assessment),action_establishment:establishment,context_establishment:establishment,assessment_establishments:set(record({assessment,establishment}))};
const historyRecord={enc(x){return this.for(x).enc(x);},dec(x){return this.for(x).dec(x);},for(x){need(Array.isArray(x)&&x.length===2,'structure/history-record');return tuple([constant(x[0]),x[0]==='bounded'?event:x[0]==='foreign'?record({event_id:sizedBytes(32),action_id:sizedBytes(32),sequence:u64,type,content:owned}):fail('unsupported/history-record')]);}};
const history=record({members:list(record({record:historyRecord,membership:establishment,inputs:optional(record(commonInputs))})),head:optional(sizedBytes(32)),establishment,selection:optional(record({prior_head:optional(sizedBytes(32)),sequence:u64,event_id:sizedBytes(32)}))});
const decisionInputs=record({...commonInputs,history});
const nativeText={enc(x){need(typeof x==='string','domain/native-text');return scalarText(x);},dec(x){need(typeof x==='string','domain/native-text');return x;}};
const selector=range(record({authority:nativeText,profile:nativeText,revision:nativeText}),x=>x&&x.authority==='https://github.com/cpbrands/VerifiedExecution'&&x.profile==='BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE'&&x.revision==='0.1-draft.1','unsupported/representation-selector');
const packageType=record({profile:selector,publication:sourceKey,materials,event,decision_inputs:optional(decisionInputs)});
const registry={native,octets,text,integer,nat,pos,u64,endpoint,interval,boundedType,extension,context,binding,assessment,sourceKey,editionKey,materials,owned,establishment,actionInline,event,history,decisionInputs,package:packageType};
let authority=null;
export function configure(expected){
  authority={...expected,assignedRanges:[]};let first=null;
  for(const line of expected.unicodeData.split('\n')){
    if(!line)continue;const [hex,name,generalCategory]=line.split(';');const cp=parseInt(hex,16);
    if(generalCategory==='Cn')continue;
    if(name.endsWith(', First>'))first=cp;
    else if(name.endsWith(', Last>')){need(first!==null,'provenance/ucd-range');authority.assignedRanges.push([first,cp]);first=null;}
    else authority.assignedRanges.push([cp,cp]);
  }need(first===null,'provenance/ucd-range');
}
const hash=b=>createHash('sha256').update(b).digest('hex');
const same=(t,a,b)=>eq(cbor(t.enc(a)),cbor(t.enc(b)));
function checkMaterials(value,selection){
  need(authority!==null,'provenance/absent-context');
  const actual=[];
  for(const kind of ['repository','external'])for(const item of value[kind]){
    const keyCodec=kind==='repository'?sourceKey:editionKey;
    const expected=authority[kind].find(e=>same(keyCodec,e.key,item.key));
    need(expected!==undefined,'provenance/key-mismatch');
    const token=kind+':'+item.key.sha256.$bytes+':'+(kind==='repository'?item.key.path:item.key.document);
    need(!actual.includes(token),'provenance/duplicate-key');actual.push(token);
    need(item.body.length===1,'unsupported/owner-material');
    const raw=B(item.body[0].$bytes,'hex');need(hash(raw)===item.key.sha256.$bytes,'provenance/sha256');
    if(kind==='repository')need(createHash('sha1').update(`blob ${raw.length}\0`).update(raw).digest('hex')===item.key.blob.$bytes,'provenance/git-blob');
    need(item.body[0].$bytes===expected.body,'provenance/historical-bytes');
  }
  const wanted=selection.map(e=>e.kind+':'+e.key.sha256.$bytes+':'+(e.kind==='repository'?e.key.path:e.key.document));
  need(actual.sort().join('\0')===wanted.sort().join('\0'),'provenance/closure');
}
function actionChecks(a){
  need(authority!==null,'provenance/absent-context');
  checkMaterials(a.definitions,authority.actionClosure);
  need(a.schema.length===1,'unsupported/schema-material');
  need(same(native,a.schema[0],authority.descriptor),'binding/schema-descriptor');
  const sd=hash(cbor(['VE-ACTION-SCHEMA',1n,native.enc(a.schema[0])]));
  need(sd===a.value.semantic.schema_digest.$bytes,'binding/schema-digest');
  need(hash(cbor(['VE-ACTION-CONTENT',1n,B(sd,'hex'),fields.enc(a.value.semantic.fields)]))===a.value.action_digest.$bytes,'binding/action-digest');
  for(const name of ['source_account','destination_account'])for(const ch of a.value.semantic.fields[name].account_id){
    const n=ch.codePointAt(0);
    need(n===9||n===10||n===13||(n>=32&&n<=0xd7ff)||(n>=0xe000&&n<=0xfffd)||(n>=0x10000&&n<=0x10ffff),'domain/xml-character');
    need(authority.assignedRanges.some(([lo,hi])=>lo<=n&&n<=hi),'domain/unicode-6.2');
  }
}
function ownedChecks(v){
  need(authority!==null,'provenance/absent-context');
  const kc=v.owner[0]==='repository'?sourceKey:editionKey;
  const chosen=authority.ownerClosures.find(e=>e.kind===v.owner[0]&&same(kc,e.key,v.owner[1]));
  need(chosen!==undefined,'unsupported/owner-definition');checkMaterials(v.definitions,chosen.closure);
}
function extChecks(v){
  if(v[0]==='owned')ownedChecks(v[1]);
  // This experiment supplies no owner-semantic equality implementation. Opaque
  // retention is supported, but cannot establish semantic set membership.
  const opaque=x=>x[0]==='owned'||(['list','set'].includes(x[0])&&x[1].some(opaque))||(x[0]==='record'&&x[1].some(([,y])=>opaque(y)));
  if(v[0]==='set')need(!v[1].some(opaque),'unsupported/owner-set-equality');
  if(v[0]==='list'||v[0]==='set')v[1].forEach(extChecks);
  if(v[0]==='record')v[1].forEach(([,x])=>extChecks(x));
}
function eventChecks(e){
  actionChecks(e.payload.action);
  need(e.action_id.$bytes===e.payload.action.value.instance.action_id.$bytes,'binding/action-occurrence');
  for(const a of e.payload.assessments){
    need(a.binding.action_id.$bytes===e.action_id.$bytes&&a.binding.action_digest.$bytes===e.payload.action.value.action_digest.$bytes&&a.binding.event_id.$bytes===e.event_id.$bytes&&same(boundedType,a.binding.event_type,e.event_type)&&same(u64,a.binding.sequence,e.sequence)&&same(context,a.binding.context,e.payload.context),'binding/assessment');
    const src=e.payload.context.sources.find(s=>s.name===a.source);
    need(src&&src.roles.includes(a.role),'binding/source-role');
    const s=a.statement[0];
    if(s==='condition'){
      const n=BigInt(a.statement[1].$integer);need(n<BigInt(e.payload.context.conditions.length),'binding/condition-index');
      const c=e.payload.context.conditions[Number(n)];need(c.evaluator===a.source&&a.role===(c.category==='validation'?'validation':'authorization'),'binding/condition-scope');
    }
    if(s==='time')need(a.role==='time','binding/time-role');
    if(s==='commit')need(a.role==='execution','binding/commit-role');
    if(s==='fact')need(a.role===(e.event_type.kind==='VALIDATION_SUCCEEDED'?'validation':e.event_type.kind.startsWith('EXECUTION_')?'execution':'boundary'),'binding/fact-role');
  }
  e.extensions.forEach(([,v])=>extChecks(v));
}
function inputsChecks(d){
  actionChecks(d.action);
  for(const s of [d.action_establishment,d.context_establishment,...d.assessment_establishments.map(e=>e.establishment)])s.material.forEach(ownedChecks);
  const expected=d.assessments.map(a=>cbor(assessment.enc(a)).toString('hex')).sort();
  const entries=d.assessment_establishments.map(e=>cbor(assessment.enc(e.assessment)).toString('hex')).sort();
  need(new Set(entries).size===entries.length&&entries.join('\0')===[...new Set(expected)].join('\0'),'binding/establishment-subjects');
}
function historyChecks(h){
  let last=-1n;const ids=new Set();
  for(const m of h.members){const e=m.record[1],n=BigInt(e.sequence.$integer);need(n>last&&!ids.has(e.event_id.$bytes),'binding/history-order');last=n;ids.add(e.event_id.$bytes);
    if(m.record[0]==='bounded')eventChecks(e);else ownedChecks(e.content);
    m.membership.material.forEach(ownedChecks);m.inputs.forEach(inputsChecks);
  }
  need(h.head.length===(h.members.length?1:0)&&(!h.members.length||h.head[0].$bytes===h.members.at(-1).record[1].event_id.$bytes),'binding/history-head');
  h.establishment.material.forEach(ownedChecks);
}
function validate(type,v){
  if(type==='actionInline')actionChecks(v);
  if(type==='owned')ownedChecks(v);
  if(type==='event')eventChecks(v);
  if(type==='extension')extChecks(v);
  if(type==='history')historyChecks(v);
  if(type==='decisionInputs'){inputsChecks(v);historyChecks(v.history);}
  if(type==='package'){
    need(authority!==null,'provenance/absent-context');need(same(sourceKey,v.publication,authority.publication),'provenance/publication');
    checkMaterials(v.materials,authority.packageClosure);eventChecks(v.event);
    for(const d of v.decision_inputs){
      inputsChecks(d);historyChecks(d.history);
      need(same(actionInline,d.action,v.event.payload.action)&&same(context,d.context,v.event.payload.context)&&same(set(assessment),d.assessments,v.event.payload.assessments),'binding/payload-copy');
      for(const a of d.assessments)need(same(optional(sizedBytes(32)),a.binding.prior_head,d.history.head),'binding/prior-head');
    }
  }
}
function preparedInputs(v){
  const entries=[...v.assessment_establishments],keys=entries.map(e=>cbor(assessment.enc(e.assessment)).toString('hex'));
  need(new Set(keys).size===keys.length,'binding/establishment-subjects');
  for(const a of v.assessments){const k=cbor(assessment.enc(a)).toString('hex');if(!keys.includes(k)){keys.push(k);entries.push({assessment:a,establishment:{status:'unavailable',material:[]}});}}
  return {...v,assessment_establishments:entries,...(Object.hasOwn(v,'history')?{history:preparedHistory(v.history)}:{})};
}
function preparedHistory(h){return {...h,members:h.members.map(m=>({...m,inputs:m.inputs.map(preparedInputs)})).sort((a,b)=>{const x=BigInt(a.record[1].sequence.$integer),y=BigInt(b.record[1].sequence.$integer);return x<y?-1:x>y?1:0;})};}
export function encode(type,value){
  try{
  need(Object.hasOwn(registry,type),'unsupported/test-type');
  if(type==='package')value={...value,decision_inputs:value.decision_inputs.map(preparedInputs)};
  if(type==='decisionInputs')value=preparedInputs(value);
  if(type==='history')value=preparedHistory(value);
  const tree=registry[type].enc(value);validate(type,value);return cbor(tree);
  }catch(e){if(e instanceof RangeError)fail('processing-incomplete/resource-limit');throw e;}
}
export function decode(type,bytes){try{need(Object.hasOwn(registry,type),'unsupported/test-type');const v=registry[type].dec(parse(bytes));validate(type,v);return v;}catch(e){if(e instanceof RangeError)fail('processing-incomplete/resource-limit');throw e;}}
