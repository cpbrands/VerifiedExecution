// Byte-negative construction only. Baseline package bytes must first agree
// across A/B. Replacements are literal CBOR fragments, not codec-generated
// expectations. A's public syntax tree utility is used only by this driver;
// implementation B neither imports it nor consults this test file.
import assert from 'node:assert/strict';
import {parse,cbor} from './codec-a.mjs';
export function patched(bytes,vector){
  const root=parse(bytes);
  if(vector.op==='fact-role'){
    const payload=root.get('event').get('payload'),entries=[];let spine=payload.get('assessments'),found=0;
    while(spine.length){const a=spine[0];if(a.get('statement')[0]==='fact'){a.set('role','authorization');found++;}entries.push(a);spine=spine[1];}
    assert.equal(found,1);entries.sort((a,b)=>Buffer.compare(cbor(a),cbor(b)));let list=[];for(const a of entries.reverse())list=[a,list];payload.set('assessments',list);
  }else if(vector.op.startsWith('source-body-')){
    let spine=root.get('materials').get('repository'),target=null;
    while(spine.length){
      const entry=spine[0];
      if(entry.get('key').get('path').toString('utf8')===vector.source){assert.equal(target,null,'duplicate target');target=entry;}
      spine=spine[1];
    }
    assert.ok(target,'missing negative target');
    if(vector.op==='source-body-absent')target.set('body',[]);
    else {let body=target.get('body')[0];while(Array.isArray(body))body=body[0];assert.ok(Buffer.isBuffer(body)&&body.length);body[0]^=1;}
  }else{
    let parent=root;
    for(const key of vector.path.slice(0,-1)){parent=parent instanceof Map?parent.get(key):parent[key];assert.notEqual(parent,undefined,'missing negative path');}
    const key=vector.path.at(-1),get=()=>parent instanceof Map?parent.get(key):parent[key],put=v=>parent instanceof Map?parent.set(key,v):parent[key]=v;
    if(vector.op==='delete'){assert.ok(parent instanceof Map&&parent.has(key));parent.delete(key);}
    else if(vector.op==='flip'){const value=get();assert.ok(Buffer.isBuffer(value)&&value.length);value[0]^=1;}
    else {assert.equal(vector.op,'put');put(parse(Buffer.from(vector.hex,'hex')));}
  }
  return cbor(root);
}
