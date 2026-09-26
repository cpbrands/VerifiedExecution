// Independent constraint/dependency evaluator. No imports, oracle, fixture IDs,
// or reuse of the Python admission/projection implementation.
const vocabulary = [
  ['ACTION_CREATED', 'NONE', 'CREATED'], ['VALIDATION_STARTED', 'CREATED', 'VALIDATING'],
  ['VALIDATION_SUCCEEDED', 'VALIDATING', 'READY'], ['AUTHORIZATION_GRANTED', 'READY', 'AUTHORIZED'],
  ['EXECUTION_STARTED', 'AUTHORIZED', 'EXECUTING'], ['EXECUTION_COMPLETED', 'EXECUTING', 'COMPLETED'],
  ['EXECUTION_FAILED', 'EXECUTING', 'FAILED']
];
function native(v) {
  if (v && !Array.isArray(v) && typeof v === 'object') {
    if (Object.keys(v).join() === 'integer') {
      if (typeof v.integer !== 'string' || !/^(0|-?[1-9][0-9]*)$/.test(v.integer)) throw Error('malformed test integer');
      return BigInt(v.integer);
    }
    return Object.fromEntries(Object.entries(v).map(([k,x]) => [k,native(x)]));
  }
  return Array.isArray(v) ? v.map(native) : v;
}
// A private algebraic fingerprint implements record/list/set distinctions;
// it is not an Event representation or identity and never leaves this process.
function signature(v, label='') {
  if (v === null) return 'null';
  if (typeof v === 'bigint') return `integer:${v}`;
  if (Array.isArray(v)) {
    let parts = v.map(x=>signature(x));
    if (label === 'assessments' || label === 'roles') parts = [...new Set(parts)].sort();
    return JSON.stringify(['list',parts]);
  }
  if (typeof v === 'object') return JSON.stringify(Object.keys(v).sort().map(k=>[k,signature(v[k],k)]));
  return JSON.stringify([typeof v,v]);
}
const equal = (a,b) => signature(a) === signature(b);
const keys = (v, names) => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).sort().join('|') === names.split(' ').sort().join('|');
const literal = v => typeof v === 'string' && v.length > 0 && !/[\uD800-\uDFFF]/u.test(v);
const roleNames = ['boundary','validation','authorization','execution','time'];
const categories = ['validation','identity','delegation','policy','approval'];
function contextDomain(c) {
  if (!keys(c,'sources conditions not_applicable execution_terms commit_required') || typeof c.commit_required !== 'boolean' || !literal(c.execution_terms)) return false;
  if (![c.sources,c.conditions,c.not_applicable].every(Array.isArray) || c.sources.length === 0) return false;
  if (!c.sources.every(s=>keys(s,'name roles') && literal(s.name) && Array.isArray(s.roles) && s.roles.length>0 && s.roles.every(r=>roleNames.includes(r)))) return false;
  if (new Set(c.sources.map(s=>s.name)).size !== c.sources.length) return false;
  if (!c.conditions.every(d=>keys(d,'category contract inputs evaluator') && Object.values(d).every(literal) && categories.includes(d.category) && c.sources.some(s=>s.name===d.evaluator && s.roles.includes(d.category==='validation'?'validation':'authorization')))) return false;
  if (new Set(c.conditions.map(d=>signature(d))).size !== c.conditions.length) return false;
  if (!c.not_applicable.every(d=>keys(d,'category reason') && literal(d.reason) && categories.includes(d.category))) return false;
  const seen = new Set(c.conditions.map(d=>d.category)), absent=c.not_applicable.map(d=>d.category);
  return seen.has('identity') && seen.has('validation') && new Set(absent).size===absent.length && absent.every(c=>!seen.has(c)) && categories.every(c=>seen.has(c)||absent.includes(c));
}
function endpointDomain(v) {
  if (!Array.isArray(v) || v.length!==8 || v.some(n=>typeof n!=='bigint')) return false;
  const [y,m,d,h,min,s,n,den]=v;
  const leap=(y%400n===0n)||(y%4n===0n&&y%100n!==0n);
  let max = [4n,6n,9n,11n].includes(m)?30n:31n;
  if (m===2n) max=leap?29n:28n;
  if (!(y>0n && m>=1n && m<=12n && d>=1n && d<=max && h>=0n && h<24n && min>=0n && min<60n && s>=0n && s<60n && den>0n && n>=0n && n<den)) return false;
  let a=n,b=den; while(b!==0n) [a,b]=[b,a%b];
  return a===1n;
}
function boundDomain(v) {
  if (!keys(v,'earliest latest') || !endpointDomain(v.earliest) || !endpointDomain(v.latest)) return false;
  for(let i=0;i<6;i++) if(v.earliest[i]!==v.latest[i]) return v.earliest[i]<v.latest[i];
  return v.earliest[6]*v.latest[7] <= v.latest[6]*v.earliest[7];
}
function assertionDomain(a) {
  if(!keys(a,'binding source role statement result basis') || !literal(a.basis) || !keys(a.binding,'action_id action_digest bound_instance_fields event_type event_id prior_head sequence context') || !contextDomain(a.binding.context)) return false;
  const forms={fact:['established','refuted','unknown'],commit:['committed','not_committed','unknown','not_applicable']};
  if(typeof a.statement==='string' && Object.hasOwn(forms,a.statement)) return forms[a.statement].includes(a.result);
  if(a.statement==='time') return a.result==='unknown'||(a.result!==null&&typeof a.result==='object');
  return keys(a.statement,'condition') && typeof a.statement.condition==='bigint' && a.statement.condition>=0n && a.statement.condition<BigInt(a.binding.context.conditions.length) && ['satisfied','unsatisfied','unknown'].includes(a.result);
}
function inspect(bundle, universe, previous, historical) {
  const obligations=[];
  const require=(holds,code,status='reject')=>{if(!holds)obligations.push({code,status});};
  const choose=()=>{
    const rank=['reject','unsupported','unestablished'];
    const category=rank.find(s=>obligations.some(x=>x.status===s));
    return category?{classification:category,obligations:[...new Set(obligations.filter(x=>x.status===category).map(x=>x.code))].sort()}:{classification:'accept',obligations:['admit']};
  };
  const e=Object.fromEntries(bundle.event), ctx=bundle.context, assertions=bundle.assessments, owner=bundle.action, proof=bundle.establishment;
  require(Object.keys(e).length===bundle.event.length,'duplicate-field');
  const nonnull=['event_id','action_id','event_type','occurred_at','sequence','spec_version','payload'];
  require(nonnull.every(k=>Object.hasOwn(e,k)&&e[k]!==null),'required-field');
  if(!nonnull.every(k=>Object.hasOwn(e,k)&&e[k]!==null)) return choose();
  require(!['actor','component','references'].some(k=>Object.hasOwn(e,k)),'forbidden');
  require(typeof e.event_id==='string'&&/^[0-9a-f]{64}$/.test(e.event_id),'event-id');
  require(typeof e.sequence==='bigint'&&e.sequence>=0n&&e.sequence<=18446744073709551615n,'sequence-domain');
  require(!previous.ids.includes(e.event_id),'id-reuse');
  require(previous.ordinal===null || e.sequence>previous.ordinal,'sequence-order');
  require(e.action_id===owner.action_id && equal(e.spec_version,['VE-002','0.2']),'binding');
  const kind=Array.isArray(e.event_type)?e.event_type[3]:undefined;
  const typeValid=Array.isArray(e.event_type)&&e.event_type.length===4&&equal(e.event_type.slice(0,3),['https://github.com/cpbrands/VerifiedExecution','BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE','0.2-draft.1'])&&vocabulary.some(row=>row[0]===kind);
  require(typeValid,'type-unavailable','unsupported');
  if(!typeValid)return choose();
  require(historical || universe.presented_profile===universe.fixed_profile,'retargeting');
  require(owner.material.every(p=>Object.hasOwn(universe.material_catalog,p)),'dependency-unavailable','unsupported');
  require(boundDomain(e.occurred_at),'time-domain');
  if(bundle.selection===null)return {classification:'unselected',obligations:['selection']};
  require(equal(bundle.selection,{event_id:e.event_id,head:previous.head,sequence:e.sequence}),'selection-binding');
  const inputShape=contextDomain(ctx)&&assertions.every(assertionDomain);
  const payload=e.payload;
  const payloadShape=keys(payload,'action context assessments')&&contextDomain(payload.context)&&Array.isArray(payload.assessments)&&payload.assessments.every(assertionDomain);
  require(inputShape&&payloadShape,'explanation');
  require(equal(payload,{action:owner,context:ctx,assessments:assertions}),'payload-copy');
  if(!inputShape)return choose();
  for(const p of [proof.context,proof.action]) {
    require(p.status!=='failed','establishment-failed');
    require(p.status==='verified'||p.status==='failed','establishment-unavailable','unsupported');
  }
  require(equal(proof.context.value,ctx)&&equal(proof.context.action,owner)&&proof.context.head===bundle.selection.head&&equal(proof.action.value,owner),'authority');
  const binding={action_id:owner.action_id,action_digest:owner.action_digest,bound_instance_fields:owner.bound_instance_fields,event_type:e.event_type,event_id:e.event_id,prior_head:previous.head,sequence:e.sequence,context:ctx};
  const values=statement=>assertions.filter(a=>equal(a.statement,statement)).map(a=>a.result);
  const factRole=kind==='VALIDATION_SUCCEEDED'?'validation':kind.startsWith('EXECUTION_')?'execution':'boundary';
  for(const a of assertions) {
    require(equal(a.binding,binding),'binding');
    const condition=typeof a.statement==='object'?ctx.conditions[Number(a.statement.condition)]:null;
    const role=condition?(condition.category==='validation'?'validation':'authorization'):a.statement==='time'?'time':a.statement==='commit'?'execution':factRole;
    require(a.role===role && ctx.sources.some(s=>s.name===a.source&&s.roles.includes(a.role)) && (!condition||condition.evaluator===a.source),'authority');
    const witnesses=proof.assessments.filter(w=>equal(w.assessment,a));
    require(witnesses.length>0&&!witnesses.some(w=>w.status==='unavailable'),'establishment-unavailable','unsupported');
    for(const w of witnesses){
      require(w.status!=='failed','establishment-failed');
      require(equal(w.grant,{source:a.source,role:a.role,statement:a.statement,binding:a.binding}),'authority');
    }
    const definite=values(a.statement).filter(v=>v!=='unknown');
    require(a.statement==='time'||new Set(definite.map(v=>signature(v))).size<=1,'contradiction');
  }
  require(!values('fact').includes('refuted'),'fact-refuted');
  require(values('fact').includes('established'),'fact-missing','unestablished');
  const demanded=kind==='VALIDATION_SUCCEEDED'?['validation']:kind==='AUTHORIZATION_GRANTED'?['identity','delegation','policy','approval']:[];
  ctx.conditions.forEach((condition,i)=>{
    if(!demanded.includes(condition.category))return;
    const rs=values({condition:BigInt(i)});
    require(!rs.includes('unsatisfied'),'condition-denied');
    require(rs.includes('satisfied'),'condition-missing','unestablished');
  });
  if(kind==='EXECUTION_COMPLETED' && ctx.commit_required){
    const rs=values('commit');
    require(!rs.some(r=>r==='not_committed'||r==='not_applicable'),'commit-denied');
    require(rs.includes('committed'),'commit-missing','unestablished');
  }
  const bounds=values('time').filter(v=>v!=='unknown');
  require(bounds.length>0,'time-missing','unestablished');
  require(bounds.every(boundDomain),'time-domain');
  require(new Set(bounds.map(v=>signature(v))).size<=1,'time-conflict');
  require(bounds.every(t=>equal(t,e.occurred_at)),'time-event');
  if(['COMPLETED','FAILED'].includes(previous.state))require(false,'terminal');
  else require(vocabulary.some(row=>row[0]===kind&&row[1]===previous.state),'transition');
  return choose();
}
export function evaluate(input) {
  const world=native(input), delivery=world.history.map(b=>({b,e:Object.fromEntries(b.event)}));
  const members=[...world.membership].sort();
  if(!equal(delivery.map(x=>x.e.event_id).sort(),members))throw Error('malformed fixture: membership/delivery mismatch');
  // Recursive prefix dependency graph, not an imperative append loop. Each node
  // requires the preceding authoritative projection before it can contribute.
  const ordered=delivery.sort((a,b)=>a.e.sequence<b.e.sequence?-1:a.e.sequence>b.e.sequence?1:0);
  const root={state:'NONE',head:'NONE',ordinal:null,ids:[],blocked:null};
  const cache=new Map([[-1,root]]);
  function prefix(index){
    if(cache.has(index))return cache.get(index);
    const prev=prefix(index-1),{b,e}=ordered[index];
    if(prev.blocked){cache.set(index,prev);return prev;}
    const found=inspect(b,world,prev,true);
    let next;
    if(found.classification!=='accept')next={...prev,blocked:found};
    else next={state:vocabulary.find(row=>row[0]===e.event_type[3]&&row[1]===prev.state)[2],head:e.event_id,ordinal:e.sequence,ids:prev.ids.concat(e.event_id),blocked:null};
    cache.set(index,next);return next;
  }
  const past=prefix(ordered.length-1);
  if(past.blocked)return {...past.blocked,state:null,prefix:past.state==='NONE'?null:past.state,complete:false,retained:members,appended:null};
  let resolution={classification:'accept',obligations:['replay']},state=past.state,appended=null;
  if(world.candidates.length){
    const picked=world.candidates.filter(b=>b.selection!==null);
    if(picked.length!==1)resolution={classification:'unselected',obligations:['selection']};
    else{
      resolution=inspect(picked[0],world,past,false);
      if(resolution.classification==='accept'){
        const event=Object.fromEntries(picked[0].event);
        state=vocabulary.find(row=>row[0]===event.event_type[3]&&row[1]===past.state)[2];
        appended=event.event_id;members.push(appended);members.sort();
      }
    }
  }
  return {...resolution,state:state==='NONE'?null:state,prefix:null,complete:true,retained:members,appended};
}
