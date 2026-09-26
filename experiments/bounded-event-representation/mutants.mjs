// Named source mutations and their independently specified witnesses.
// No mutation switch exists inside either baseline implementation.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dir} from './source-loader.mjs';
export function once(source,before,after){assert.equal(source.split(before).length,2,'mutant edit must match exactly once');return source.replace(before,after);}
export const sourceFor=language=>readFileSync(new URL(language==='A'?'codec-a.mjs':'codec-b.py',dir),'utf8');
function bypass(source,language,codes){
  return language==='A'?once(source,'const need=(p,c)=>{if(!p)fail(c);};',`const need=(p,c)=>{if(${JSON.stringify(codes)}.includes(c))return;if(!p)fail(c);};`):once(source,'def require(condition, reason):\n    if not condition:',`def require(condition, reason):\n    if reason in ${JSON.stringify(codes)}:\n        return\n    if not condition:`);
}
const guards=[
 ['signed-magnitude','canonical/integer-magnitude','integer-negative-zero'],
 ['uint64-domain','domain/uint64','native-negative-sequence'],
 ['rational-domain','domain/endpoint','rational-unreduced'],
 ['list-shape','canonical/list-shape','list-flat-shortcut'],
 ['octet-partition','canonical/octet-chunks','text-chunk-shape'],
 ['map-order','canonical/map-order','map-key-order'],
 ['set-uniqueness','canonical/set-order-or-duplicate','set-duplicate'],
 ['field-presence','structure/record-fields','event-forbidden-actor-null'],
 ['type-role-matrix','binding/fact-role','fact-role-matrix'],
 ['selector','unsupported/representation-selector','selector-unknown'],
 ['publication','provenance/publication','publication-substitution'],
 ['extension-collision','domain/extension-collision','extension-known-field-collision'],
 ['action-content-binding','binding/action-digest','action-text-binding']
];
export const mutations=[];
for(const language of ['A','B']){
  for(const [family,code,witness]of guards)mutations.push({id:`${language}-${family}`,language,family,witness,mode:'accept-invalid',source:()=>bypass(sourceFor(language),language,[code])});
  mutations.push({id:`${language}-material-integrity`,language,family:'material-integrity',witness:'historical-owner-bytes-tampered',mode:'accept-invalid',source:()=>bypass(sourceFor(language),language,['provenance/sha256','provenance/git-blob','provenance/historical-bytes'])});
  mutations.push({id:`${language}-map-duplicates`,language,family:'map-duplicates',witness:'duplicate-map-key',mode:'accept-invalid',source:()=>bypass(sourceFor(language),language,['canonical/duplicate-key','canonical/map-order'])});
  mutations.push({id:`${language}-owner-availability`,language,family:'owner-availability',witness:'required-owner-material-unavailable',mode:'accept-invalid',source:()=>language==='A'?once(sourceFor(language),"need(item.body.length===1,'unsupported/owner-material');","if(item.body.length===0)continue;need(item.body.length===1,'unsupported/owner-material');"):once(sourceFor(language),"            require(len(item['body']) == 1, 'unsupported/owner-material')","            if not item['body']:\n                continue\n            require(len(item['body']) == 1, 'unsupported/owner-material')")});
  mutations.push({id:`${language}-normalize-encode`,language,family:'normalize-encode',witness:'text-decomposed',mode:'wrong-text-bytes',source:()=>language==='A'?once(sourceFor(language),'B(scalarText(x)).toString(\'hex\')',"B(scalarText(x).normalize('NFC')).toString('hex')"):once(sourceFor(language),"raw = value.encode('utf-8', errors='strict')\n        except UnicodeError:","raw = unicodedata.normalize('NFC', value).encode('utf-8', errors='strict')\n        except UnicodeError:")});
  mutations.push({id:`${language}-normalize-decode`,language,family:'normalize-decode',witness:'text-decomposed',mode:'wrong-text-value',source:()=>language==='A'?once(sourceFor(language),'return s;}};','return s.normalize(\'NFC\');}};'):once(sourceFor(language),"return unpack_octets(value).decode('utf-8', errors='strict')","return unicodedata.normalize('NFC', unpack_octets(value).decode('utf-8', errors='strict'))")});
  mutations.push({id:`${language}-integer-truncation`,language,family:'integer-truncation',witness:'integer-above-native',mode:'wrong-integer-value',source:()=>language==='A'?once(sourceFor(language),"return{$integer:String(x[0]?-n:n)};","return{$integer:String(BigInt.asIntN(64,x[0]?-n:n))};"):once(sourceFor(language),"return {'$integer':str(n)}\n        magnitude = abs(n)","return {'$integer':str(n % (2**64))}\n        magnitude = abs(n)")});
  mutations.push({id:`${language}-rational-precision-loss`,language,family:'rational-precision-loss',witness:'point-third',mode:'wrong-rational-value',source:()=>language==='A'?once(sourceFor(language),"const endpoint=range(endpointRaw,endpointValid,'domain/endpoint');","const endpoint=range(endpointRaw,endpointValid,'domain/endpoint');const exactEndpointDecode=endpoint.dec.bind(endpoint);endpoint.dec=x=>{const v=exactEndpointDecode(x);v[6]={$integer:'0'};v[7]={$integer:'1'};return v;};"):once(sourceFor(language),"            time_point(result)\n            return result","            time_point(result)\n            result[6:8] = [{'$integer':'0'},{'$integer':'1'}]\n            return result")});
  mutations.push({id:`${language}-canonical-map-bytes`,language,family:'canonical-map-bytes',witness:'point-third',mode:'noncanonical-map-bytes',source:()=>language==='A'?once(sourceFor(language),".sort((a,b)=>Buffer.compare(a[0],b[0]));\n  return join([head(5", ".sort((a,b)=>Buffer.compare(b[0],a[0]));\n  return join([head(5"):once(sourceFor(language),"names = sorted(value, key=lambda k: dump(k))","names = sorted(value, key=lambda k: dump(k), reverse=True)")});
}
