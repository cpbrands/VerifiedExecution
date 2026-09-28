import {readFileSync} from 'node:fs';
import {configure,encode,decode,Failure} from './codec-a.mjs';
const {authority,request:r}=JSON.parse(readFileSync(0,'utf8'));
configure(authority);
try {
  if(r.op!=='encode'&&r.op!=='decode')throw Error('invalid process operation');
  if(r.op==='decode'&&(typeof r.hex!=='string'||!/^(?:[0-9a-f]{2})*$/.test(r.hex)))throw Error('invalid process hexadecimal');
  const value=r.op==='encode'?encode(r.type,r.value).toString('hex'):decode(r.type,Buffer.from(r.hex,'hex'));
  console.log(JSON.stringify({ok:true,value}));
}catch(e){if(!(e instanceof Failure))throw e;console.log(JSON.stringify({ok:false,error:e.code}));}
