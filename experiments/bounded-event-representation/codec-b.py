"""Independent implementation B: streaming CBOR, explicit domain dispatch.

No imports from implementation A or expected vector outcomes. Local JSON tags
are process syntax only. Python integers are arbitrary precision throughout.
"""
import unicodedata
import hashlib
from math import gcd


class Failure(Exception):
    pass


def require(condition, reason):
    if not condition:
        raise Failure(reason)


def argument(major, n):
    require(type(n) is int and 0 <= n < 2**64, 'domain/native-integer')
    if n < 24:
        return bytes([major * 32 + n])
    for width, additional in [(1, 24), (2, 25), (4, 26), (8, 27)]:
        if n < 2**(8 * width):
            return bytes([major * 32 + additional]) + n.to_bytes(width, 'big')
    raise Failure('domain/native-integer')


def dump(item):
    # Explicit work stack; no recursive length-dependent list/chunk traversal.
    work = [item]
    output = bytearray()
    while work:
        value = work.pop()
        if value is None:
            output.append(246)
        elif type(value) is bool:
            output.append(245 if value else 244)
        elif type(value) is int:
            output.extend(argument(0, value) if value >= 0 else argument(1, -1-value))
        elif type(value) is bytes:
            output.extend(argument(2, len(value)))
            output.extend(value)
        elif type(value) is str:
            try:
                raw = value.encode('utf-8', errors='strict')
            except UnicodeError:
                raise Failure('domain/text-scalar')
            require(unicodedata.normalize('NFC', value) == value, 'canonical/native-text-nfc')
            output.extend(argument(3, len(raw)))
            output.extend(raw)
        elif type(value) is list:
            output.extend(argument(4, len(value)))
            work.extend(reversed(value))
        elif type(value) is dict:
            require(all(type(k) is str for k in value), 'structure/map-key')
            names = sorted(value, key=lambda k: dump(k))
            output.extend(argument(5, len(names)))
            for name in reversed(names):
                work.extend([value[name], name])
        else:
            raise Failure('structure/cbor-value')
    return bytes(output)


def load(raw):
    require(type(raw) is bytes, 'structure/bytes')
    require(len(raw) <= 64*1024*1024, 'processing-incomplete/resource-limit')
    position = 0
    frames = []
    nodes = 0
    result = None
    while True:
        require(position < len(raw), 'encoding/truncated')
        start = position
        h = raw[position]
        position += 1
        nodes += 1
        require(nodes <= 1000000 and len(frames) <= 2048, 'processing-incomplete/resource-limit')
        major, arg = divmod(h, 32)
        container = False
        if major == 7:
            require(h in (244, 245, 246), 'encoding/forbidden-simple')
            value = {244: False, 245: True, 246: None}[h]
        else:
            require(major < 6, 'encoding/forbidden-tag')
            require(arg < 28, 'encoding/indefinite-or-reserved')
            if arg < 24:
                count = arg
            else:
                width = 2**(arg-24)
                require(position + width <= len(raw), 'encoding/truncated')
                count = int.from_bytes(raw[position:position+width], 'big')
                position += width
                require(count >= {24:24, 25:256, 26:65536, 27:4294967296}[arg], 'canonical/nonminimal-argument')
            if major == 0:
                value = count
            elif major == 1:
                value = -1-count
            else:
                require(count <= 64*1024*1024, 'processing-incomplete/resource-limit')
                if major in (2, 3):
                    require(position + count <= len(raw), 'encoding/truncated')
                    value = raw[position:position+count]
                    position += count
                    if major == 3:
                        try:
                            value = value.decode('utf-8', errors='strict')
                        except UnicodeError:
                            raise Failure('encoding/utf8')
                        require(unicodedata.normalize('NFC', value) == value, 'canonical/native-text-nfc')
                else:
                    value = [] if major == 4 else {}
                    if count:
                        frames.append({'start':start, 'kind':major, 'remaining':count if major==4 else count*2,
                                       'value':value, 'key':None, 'previous':None})
                        container = True
        if container:
            continue
        while frames:
            f = frames[-1]
            if f['kind'] == 4:
                f['value'].append(value)
            elif f['remaining'] % 2 == 0:
                require(type(value) is str, 'structure/map-key')
                require(value not in f['value'], 'canonical/duplicate-key')
                key_bytes = raw[start:position]
                require(f['previous'] is None or f['previous'] < key_bytes, 'canonical/map-order')
                f['previous'], f['key'] = key_bytes, value
            else:
                f['value'][f['key']] = value
            f['remaining'] -= 1
            if f['remaining']:
                break
            frames.pop()
            value, start = f['value'], f['start']
        else:
            result = value
            break
    require(position == len(raw), 'encoding/trailing')
    return result


def test_integer(x):
    require(type(x) is dict and list(x) == ['$integer'] and type(x['$integer']) is str, 'domain/integer')
    s = x['$integer']
    require(s == '0' or (s.lstrip('-').isascii() and s.lstrip('-').isdigit() and not s.lstrip('-').startswith('0') and s.count('-') <= 1 and '-' not in s[1:]), 'domain/integer')
    return int(s)


def unpack_octets(tree):
    parts = []
    while type(tree) is list:
        require(len(tree) == 2 and type(tree[0]) is bytes and len(tree[0]) == 4096, 'canonical/octet-chunks')
        parts.append(tree[0])
        tree = tree[1]
    require(type(tree) is bytes and len(tree) <= 4096 and (not parts or len(tree) > 0), 'canonical/octet-chunks')
    parts.append(tree)
    return b''.join(parts)


def pack_octets(raw):
    chunks = [raw[i:i+4096] for i in range(0, len(raw), 4096)]
    if not chunks:
        return b''
    tree = chunks.pop()
    for chunk in reversed(chunks):
        tree = [chunk, tree]
    return tree


def time_point(values):
    require(type(values) is list and len(values) == 8, 'structure/tuple')
    y, m, d, h, minute, second, n, denominator = [test_integer(x) for x in values]
    require(y > 0 and denominator > 0, 'domain/positive')
    require(n >= 0, 'domain/nonnegative')
    require(1 <= m <= 12 and 1 <= d <= 31 and 0 <= h <= 23 and 0 <= minute <= 59 and 0 <= second <= 59, 'domain/calendar-component')
    feb = 29 if y % 4 == 0 and (y % 100 != 0 or y % 400 == 0) else 28
    require(d <= (31,feb,31,30,31,30,31,31,30,31,30,31)[m-1] and n < denominator and gcd(n, denominator) == 1, 'domain/endpoint')


# Field declarations transcribed independently from the pinned profile. The
# visitor below emits list spines directly rather than composing typed codecs.
FIELDS = {
    'sourceKey':'repository=repo commit=b20 path=nonempty blob=b20 sha256=b32',
    'editionKey':'authority=nonempty edition=nonempty document=nonempty sha256=b32',
    'sourceMaterial':'key=sourceKey body=?octets',
    'editionMaterial':'key=editionKey body=?octets',
    'materials':'repository=%sourceMaterial external=%editionMaterial',
    'owned':'owner=owner bytes=octets definitions=materials',
    'establishment':'status=status material=*owned',
    'source':'name=nonempty roles=%role',
    'condition':'category=category contract=nonempty inputs=nonempty evaluator=nonempty',
    'notApplicable':'category=category reason=nonempty',
    'context':'sources=*source conditions=*condition not_applicable=*notApplicable execution_terms=nonempty commit_required=boolean',
    'type':'authority=nonempty profile=nonempty revision=nonempty kind=nonempty',
    'binding':'action_id=b32 action_digest=b32 bound_instance_fields=empty event_type=boundedType event_id=b32 prior_head=?b32 sequence=u64 context=context',
    'instance':'action_id=b32',
    'account':'servicing_agent_canadian_sort_code=sortCode account_id=accountText',
    'actionFields':'amount_minor=amount source_account=account destination_account=account',
    'semantic':'fields=actionFields schema_digest=b32',
    'action':'action_digest=b32 instance=instance semantic=semantic',
    'actionInline':'value=action schema=?native definitions=materials',
    'payload':'action=actionInline context=context assessments=%assessment',
    'event':'event_id=b32 action_id=b32 event_type=boundedType occurred_at=interval sequence=u64 spec_version=specVersion payload=payload extensions=extensions',
    'assessmentEntry':'assessment=assessment establishment=establishment',
    'historicalInputs':'action=actionInline context=context assessments=%assessment action_establishment=establishment context_establishment=establishment assessment_establishments=%assessmentEntry',
    'decisionInputs':'action=actionInline context=context assessments=%assessment action_establishment=establishment context_establishment=establishment assessment_establishments=%assessmentEntry history=history',
    'selection':'prior_head=?b32 sequence=u64 event_id=b32',
    'history':'members=*historyMember head=?b32 establishment=establishment selection=?selection',
    'historyMember':'record=historyRecord membership=establishment inputs=?historicalInputs',
    'foreign':'event_id=b32 action_id=b32 sequence=u64 type=type content=owned',
    'selector':'authority=nativeText profile=nativeText revision=nativeText',
    'package':'profile=selector publication=sourceKey materials=materials event=event decision_inputs=?decisionInputs',
    'empty':''
}
ENUMS = {
    'role':('boundary','validation','authorization','execution','time'),
    'category':('validation','identity','delegation','policy','approval'),
    'status':('verified','failed','unavailable'),
    'repo':('https://github.com/cpbrands/VerifiedExecution',),
    'representationName':('BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE',),
    'representationRevision':('0.1-draft.1',),
    'factResult':('established','refuted','unknown'),
    'conditionResult':('satisfied','unsatisfied','unknown'),
    'commitResult':('committed','not_committed','unknown','not_applicable')
}


def spine(values):
    result = []
    for item in reversed(values):
        result = [item, result]
    return result


def unspine(tree):
    values = []
    while type(tree) is list and len(tree) == 2:
        values.append(tree[0])
        tree = tree[1]
    require(type(tree) is list and len(tree) == 0, 'canonical/list-shape')
    return values


def convert(kind, value, reading=False):
    if kind == 'nativeText':
        require(type(value) is str, 'domain/native-text')
        return value
    if kind.startswith('?'):
        require(type(value) is list and len(value) <= 1, 'structure/optional')
        return [convert(kind[1:], v, reading) for v in value]
    if kind.startswith(('*','%')):
        if reading:
            items = unspine(value)
            if kind[0] == '%':
                keys = [dump(v) for v in items]
                require(all(a < b for a,b in zip(keys, keys[1:])), 'canonical/set-order-or-duplicate')
            return [convert(kind[1:],v,True) for v in items]
        require(type(value) is list, 'structure/set' if kind[0] == '%' else 'structure/list')
        items = [convert(kind[1:],v) for v in value]
        if kind[0] == '%':
            unique = {dump(v):v for v in items}
            items = [unique[k] for k in sorted(unique)]
        return spine(items)
    if kind in ENUMS:
        require(type(value) is str and value in ENUMS[kind], 'domain/enum')
        return value
    if kind == 'boolean':
        require(type(value) is bool, 'domain/boolean')
        return value
    if kind in ('b20','b32'):
        width = int(kind[1:])
        if reading:
            require(type(value) is bytes and len(value) == width, 'domain/octet-width')
            return {'$bytes':value.hex()}
        raw = unpack_octets(convert('octets',value))
        require(len(raw) == width, 'domain/octet-width')
        return raw
    if kind in ('nonempty','sortCode','accountText'):
        if kind == 'nonempty':
            result = convert('text',value,reading)
            require(bool(result if reading else value), 'domain/nonempty-text')
            return result
        require(type(value) is str, 'domain/text')
        if kind == 'sortCode':
            require(len(value) == 9 and value[0] == '0' and all(c in '0123456789' for c in value), 'domain/sort-code')
        else:
            require(1 <= len(value) <= 34 and unicodedata.normalize('NFC',value) == value, 'domain/account-id')
        return value
    if kind == 'native':
        if reading:
            if type(value) is bytes:
                return {'$bytes':value.hex()}
            if type(value) is int:
                return {'$integer':str(value)}
        else:
            if type(value) is dict and '$integer' in value:
                return test_integer(value)
            if type(value) is dict and '$bytes' in value:
                return unpack_octets(convert('octets',value))
        if type(value) is list:
            return [convert(kind,v,reading) for v in value]
        if type(value) is dict:
            return {k:convert(kind,v,reading) for k,v in value.items()}
        require(value is None or type(value) in (str,bool), 'domain/native')
        return value
    if kind == 'amount':
        result = convert('u64',value,reading)
        require(1 <= test_integer(result if reading else value) <= 99999999999999, 'domain/amount')
        return result
    if kind == 'boundedType':
        result = convert('type',value,reading)
        semantic = result if reading else value
        require(semantic['authority'] == 'https://github.com/cpbrands/VerifiedExecution' and semantic['profile'] == 'BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE' and semantic['revision'] == '0.2-draft.1' and semantic['kind'] in ('ACTION_CREATED','VALIDATION_STARTED','VALIDATION_SUCCEEDED','AUTHORIZATION_GRANTED','EXECUTION_STARTED','EXECUTION_COMPLETED','EXECUTION_FAILED'), 'binding/event-type')
        return result
    if kind == 'specVersion':
        require(value == ['VE-002','0.2'], 'domain/enum')
        return value
    if kind in ('owner','historyRecord'):
        require(type(value) is list and len(value) == 2, 'structure/owner' if kind == 'owner' else 'structure/history-record')
        variants = {'repository':'sourceKey','external':'editionKey'} if kind == 'owner' else {'bounded':'event','foreign':'foreign'}
        require(type(value[0]) is str and value[0] in variants, 'unsupported/owner-kind' if kind == 'owner' else 'unsupported/history-record')
        return [value[0],convert(variants[value[0]],value[1],reading)]
    if kind == 'statement':
        require(type(value) is list and len(value) > 0, 'structure/statement')
        if value[0] == 'condition':
            require(len(value) == 2, 'structure/tuple')
            return ['condition',convert('nat',value[1],reading)]
        require(value in (['fact'],['commit'],['time']), 'domain/statement')
        return value
    if kind == 'timeResult':
        require(type(value) is list, 'structure/time-result')
        if value == ['unknown']:
            return value
        require(len(value) == 2 and value[0] == 'bound', 'structure/tuple')
        return ['bound',convert('interval',value[1],reading)]
    if kind == 'assessment':
        require(type(value) is dict and set(value) == {'binding','source','role','statement','result','basis'}, 'structure/record-fields')
        s = convert('statement',value['statement'],reading)
        return {'binding':convert('binding',value['binding'],reading), 'source':convert('nonempty',value['source'],reading), 'role':convert('role',value['role'],reading), 'statement':s, 'result':convert({'fact':'factResult','condition':'conditionResult','commit':'commitResult','time':'timeResult'}[s[0]],value['result'],reading), 'basis':convert('nonempty',value['basis'],reading)}
    if kind in ('extensions','named'):
        entries = unspine(value) if reading else value
        require(type(entries) is list and all(type(e) is list and len(e) == 2 for e in entries), 'structure/named-record')
        decoded, keyed = [], []
        for name, item in entries:
            converted = convert('text',name,reading)
            semantic_name = converted if reading else name
            if kind == 'extensions':
                require(semantic_name not in ('event_id','action_id','event_type','occurred_at','sequence','spec_version','payload','actor','component','references'), 'domain/extension-collision')
            key = dump(name if reading else converted)
            keyed.append(key)
            decoded.append([converted,convert('extension',item,reading)])
        if reading:
            require(all(a < b for a,b in zip(keyed,keyed[1:])), 'canonical/name-order-or-duplicate')
            return decoded
        require(len(set(keyed)) == len(keyed), 'canonical/duplicate-name')
        return spine([v for _,v in sorted(zip(keyed,decoded),key=lambda p:p[0])])
    if kind == 'extension':
        require(type(value) is list and len(value) > 0, 'structure/extension')
        variants = {'boolean':'boolean','integer':'integer','text':'text','octets':'octets','list':'*extension','set':'%extension','record':'named','owned':'owned'}
        if value[0] == 'null':
            require(len(value) == 1, 'structure/tuple')
            return ['null']
        require(type(value[0]) is str and value[0] in variants, 'unsupported/extension-constructor')
        require(len(value) == 2, 'structure/tuple')
        return [value[0],convert(variants[value[0]],value[1],reading)]
    if kind in FIELDS:
        fields = dict(token.split('=') for token in FIELDS[kind].split())
        require(type(value) is dict and set(value) == set(fields), 'structure/record-fields')
        out = {k:convert(t,value[k],reading) for k,t in fields.items()}
        if kind == 'selector':
            require(out == {'authority':'https://github.com/cpbrands/VerifiedExecution','profile':'BOUNDED-LIFECYCLE-EVENT-REPRESENTATION-PROFILE','revision':'0.1-draft.1'}, 'unsupported/representation-selector')
        if kind == 'context':
            semantic = out if reading else value
            names = [s['name'] for s in semantic['sources']]
            require(len(names) > 0 and len(names) == len(set(names)) and all(s['roles'] for s in semantic['sources']), 'domain/sources')
            seen = set()
            for c in semantic['conditions']:
                sig = tuple(c[k] for k in ('category','contract','inputs','evaluator'))
                require(sig not in seen, 'domain/duplicate-condition')
                seen.add(sig)
                role = 'validation' if c['category'] == 'validation' else 'authorization'
                require(any(s['name']==c['evaluator'] and role in s['roles'] for s in semantic['sources']), 'binding/condition-authority')
            for category in ENUMS['category']:
                cs = sum(c['category']==category for c in semantic['conditions'])
                ns = sum(n['category']==category for n in semantic['not_applicable'])
                require((cs > 0 and ns == 0) or (cs == 0 and ns == 1 and category not in ('validation','identity')), 'domain/category-coverage')
        return out
    if kind == 'octets':
        if reading:
            return {'$bytes':unpack_octets(value).hex()}
        require(type(value) is dict and list(value) == ['$bytes'] and type(value['$bytes']) is str, 'domain/octets')
        h = value['$bytes']
        require(len(h) % 2 == 0 and all(c in '0123456789abcdef' for c in h), 'domain/octets')
        return pack_octets(bytes.fromhex(h))
    if kind == 'text':
        if reading:
            try:
                return unpack_octets(value).decode('utf-8', errors='strict')
            except UnicodeError:
                raise Failure('encoding/utf8')
        require(type(value) is str, 'domain/text')
        try:
            raw = value.encode('utf-8', errors='strict')
        except UnicodeError:
            raise Failure('domain/text-scalar')
        return pack_octets(raw)
    if kind in ('integer','nat','pos'):
        if reading:
            require(type(value) is list and len(value) == 2 and type(value[0]) is bool, 'canonical/integer-form')
            raw = unpack_octets(value[1])
            require(not raw.startswith(b'\x00') and not (value[0] and not raw), 'canonical/integer-magnitude')
            n = int.from_bytes(raw, 'big') * (-1 if value[0] else 1)
        else:
            n = test_integer(value)
        if kind != 'integer':
            require(n >= 0, 'domain/nonnegative')
        if kind == 'pos':
            require(n > 0, 'domain/positive')
        if reading:
            return {'$integer':str(n)}
        magnitude = abs(n)
        return [n < 0, pack_octets(magnitude.to_bytes((magnitude.bit_length()+7)//8, 'big'))]
    if kind == 'u64':
        n = value if reading else test_integer(value)
        require(type(n) is int, 'domain/native-integer')
        require(0 <= n < 2**64, 'domain/uint64')
        return {'$integer':str(n)} if reading else n
    if kind == 'endpoint':
        require(type(value) is list and len(value) == 8, 'structure/tuple')
        if reading:
            result = []
            for i, part in enumerate(value):
                if i in (0, 7):
                    result.append(convert('pos', part, True))
                elif i == 6:
                    result.append(convert('nat', part, True))
                else:
                    require(type(part) is int, 'domain/native-integer')
                    result.append({'$integer':str(part)})
            time_point(result)
            return result
        time_point(value)
        return [convert('pos', value[0]), *[test_integer(v) for v in value[1:6]], convert('nat',value[6]), convert('pos',value[7])]
    if kind == 'interval':
        require(type(value) is dict and set(value) == {'earliest','latest'}, 'structure/record-fields')
        if reading:
            value = {k:convert('endpoint',value[k],True) for k in value}
        for end in value.values():
            time_point(end)
        a, b = ([test_integer(v) for v in value[k]] for k in ('earliest','latest'))
        require(a[:6] < b[:6] or (a[:6] == b[:6] and a[6]*b[7] <= b[6]*a[7]), 'domain/interval')
        return value if reading else {k:convert('endpoint',v) for k,v in value.items()}
    raise Failure('unsupported/test-type')


AUTHORITY = None
ASSIGNED = set()


def configure(context):
    global AUTHORITY, ASSIGNED
    AUTHORITY = context
    ASSIGNED = set()
    records = [line.split(';') for line in context['unicodeData'].splitlines() if line]
    i = 0
    while i < len(records):
        record = records[i]
        first = int(record[0],16)
        if record[1].endswith(', First>'):
            require(i+1 < len(records) and records[i+1][1].endswith(', Last>'), 'provenance/ucd-range')
            last = int(records[i+1][0],16)
            if record[2] != 'Cn':
                ASSIGNED.update(range(first,last+1))
            i += 2
        else:
            if record[2] != 'Cn':
                ASSIGNED.add(first)
            i += 1


def semantic_equal(kind, a, b):
    return dump(convert(kind,a)) == dump(convert(kind,b))


def material_check(actual, required):
    require(AUTHORITY is not None, 'provenance/absent-context')
    signatures = set()
    for group in ('repository','external'):
        for item in actual[group]:
            key_kind = 'sourceKey' if group == 'repository' else 'editionKey'
            matches = [entry for entry in AUTHORITY[group] if semantic_equal(key_kind,entry['key'],item['key'])]
            require(len(matches) == 1, 'provenance/key-mismatch')
            signature = (group,dump(convert(key_kind,item['key'])))
            require(signature not in signatures, 'provenance/duplicate-key')
            signatures.add(signature)
            require(len(item['body']) == 1, 'unsupported/owner-material')
            data = bytes.fromhex(item['body'][0]['$bytes'])
            require(hashlib.sha256(data).hexdigest() == item['key']['sha256']['$bytes'], 'provenance/sha256')
            if group == 'repository':
                framed = b'blob '+str(len(data)).encode('ascii')+b'\x00'+data
                require(hashlib.sha1(framed).hexdigest() == item['key']['blob']['$bytes'], 'provenance/git-blob')
            require(data.hex() == matches[0]['body'], 'provenance/historical-bytes')
    expected = {(x['kind'],dump(convert('sourceKey' if x['kind']=='repository' else 'editionKey',x['key']))) for x in required}
    require(signatures == expected, 'provenance/closure')


def inspect_value(kind, value):
    # Explicit typed work queue; no duck-typed scan of opaque extension records.
    pending = [(kind,value)]
    while pending:
        kind, v = pending.pop()
        if kind == 'package':
            require(AUTHORITY is not None, 'provenance/absent-context')
            require(semantic_equal('sourceKey',v['publication'],AUTHORITY['publication']), 'provenance/publication')
            material_check(v['materials'],AUTHORITY['packageClosure'])
            pending.append(('event',v['event']))
            pending.extend(('decisionInputs',d) for d in v['decision_inputs'])
            for d in v['decision_inputs']:
                payload = v['event']['payload']
                require(semantic_equal('actionInline',d['action'],payload['action']) and semantic_equal('context',d['context'],payload['context']) and semantic_equal('%assessment',d['assessments'],payload['assessments']), 'binding/payload-copy')
                require(all(a['binding']['prior_head']==d['history']['head'] for a in d['assessments']), 'binding/prior-head')
        elif kind == 'actionInline':
            require(AUTHORITY is not None, 'provenance/absent-context')
            material_check(v['definitions'],AUTHORITY['actionClosure'])
            require(len(v['schema']) == 1, 'unsupported/schema-material')
            require(semantic_equal('native',v['schema'][0],AUTHORITY['descriptor']), 'binding/schema-descriptor')
            descriptor = convert('native',v['schema'][0])
            schema_digest = hashlib.sha256(dump(['VE-ACTION-SCHEMA',1,descriptor])).digest()
            a = v['value']
            require(schema_digest.hex() == a['semantic']['schema_digest']['$bytes'], 'binding/schema-digest')
            fields = convert('actionFields',a['semantic']['fields'])
            action_digest = hashlib.sha256(dump(['VE-ACTION-CONTENT',1,schema_digest,fields])).hexdigest()
            require(action_digest == a['action_digest']['$bytes'], 'binding/action-digest')
            for account in (fields['source_account'],fields['destination_account']):
                for ch in account['account_id']:
                    cp = ord(ch)
                    require(cp in (9,10,13) or 0x20<=cp<=0xd7ff or 0xe000<=cp<=0xfffd or 0x10000<=cp<=0x10ffff, 'domain/xml-character')
                    require(cp in ASSIGNED, 'domain/unicode-6.2')
        elif kind == 'owned':
            require(AUTHORITY is not None, 'provenance/absent-context')
            owner_kind, key = v['owner']
            match = [x for x in AUTHORITY['ownerClosures'] if x['kind']==owner_kind and semantic_equal('sourceKey' if owner_kind=='repository' else 'editionKey',x['key'],key)]
            require(len(match)==1, 'unsupported/owner-definition')
            material_check(v['definitions'],match[0]['closure'])
        elif kind == 'extension':
            if v[0] == 'set':
                members = list(v[1])
                while members:
                    member = members.pop()
                    require(member[0] != 'owned', 'unsupported/owner-set-equality')
                    if member[0] in ('list','set'):
                        members.extend(member[1])
                    elif member[0] == 'record':
                        members.extend(x for _,x in member[1])
            if v[0] == 'owned':
                pending.append(('owned',v[1]))
            elif v[0] in ('list','set'):
                pending.extend(('extension',x) for x in v[1])
            elif v[0] == 'record':
                pending.extend(('extension',x) for _,x in v[1])
        elif kind == 'event':
            a, c = v['payload']['action'], v['payload']['context']
            # Owner representation/digest validation precedes assessment binding.
            inspect_value('actionInline',a)
            require(v['action_id']==a['value']['instance']['action_id'], 'binding/action-occurrence')
            for assessment in v['payload']['assessments']:
                b = assessment['binding']
                require(b['action_id']==v['action_id'] and b['action_digest']==a['value']['action_digest'] and b['event_id']==v['event_id'] and semantic_equal('boundedType',b['event_type'],v['event_type']) and b['sequence']==v['sequence'] and semantic_equal('context',b['context'],c), 'binding/assessment')
                s = [x for x in c['sources'] if x['name']==assessment['source']]
                require(len(s)==1 and assessment['role'] in s[0]['roles'], 'binding/source-role')
                statement = assessment['statement'][0]
                role = assessment['role']
                if statement == 'condition':
                    index = test_integer(assessment['statement'][1])
                    require(index < len(c['conditions']), 'binding/condition-index')
                    condition = c['conditions'][index]
                    require(condition['evaluator']==assessment['source'] and role==('validation' if condition['category']=='validation' else 'authorization'), 'binding/condition-scope')
                elif statement == 'fact':
                    k = v['event_type']['kind']
                    required = 'validation' if k=='VALIDATION_SUCCEEDED' else 'execution' if k in ('EXECUTION_STARTED','EXECUTION_COMPLETED','EXECUTION_FAILED') else 'boundary'
                    require(role==required, 'binding/fact-role')
                elif statement == 'time':
                    require(role=='time', 'binding/time-role')
                else:
                    require(role=='execution', 'binding/commit-role')
            pending.extend(('extension',e) for _,e in v['extensions'])
        elif kind in ('decisionInputs','historicalInputs'):
            pending.append(('actionInline',v['action']))
            expected = {dump(convert('assessment',a)) for a in v['assessments']}
            actual = [dump(convert('assessment',e['assessment'])) for e in v['assessment_establishments']]
            require(len(actual)==len(set(actual)) and set(actual)==expected, 'binding/establishment-subjects')
            statuses = [v['action_establishment'],v['context_establishment']]+[e['establishment'] for e in v['assessment_establishments']]
            pending.extend(('owned',m) for s in statuses for m in s['material'])
            if kind=='decisionInputs':
                pending.append(('history',v['history']))
        elif kind == 'history':
            ordinals, ids = [], []
            for member in v['members']:
                tag, record = member['record']
                ordinals.append(test_integer(record['sequence']))
                ids.append(record['event_id'])
                if tag=='bounded':
                    pending.append(('event',record))
                else:
                    pending.append(('owned',record['content']))
                pending.extend(('historicalInputs',i) for i in member['inputs'])
                pending.extend(('owned',m) for m in member['membership']['material'])
            require(all(a<b for a,b in zip(ordinals,ordinals[1:])) and len({x['$bytes'] for x in ids})==len(ids), 'binding/history-order')
            require(v['head']==(ids[-1:] if ids else []), 'binding/history-head')
            pending.extend(('owned',m) for m in v['establishment']['material'])


def prepare_inputs(value):
    entries = list(value['assessment_establishments'])
    by_subject = {dump(convert('assessment',x['assessment'])):x for x in entries}
    require(len(by_subject)==len(entries), 'binding/establishment-subjects')
    for a in value['assessments']:
        key = dump(convert('assessment',a))
        if key not in by_subject:
            entry = {'assessment':a,'establishment':{'status':'unavailable','material':[]}}
            entries.append(entry)
            by_subject[key]=entry
    result = dict(value,assessment_establishments=entries)
    if 'history' in result:
        result['history']=prepare_history(result['history'])
    return result


def prepare_history(value):
    members = [dict(m,inputs=[prepare_inputs(i) for i in m['inputs']]) for m in value['members']]
    members.sort(key=lambda m:test_integer(m['record'][1]['sequence']))
    return dict(value,members=members)


def encode(kind, value):
    if kind == 'package':
        value = dict(value,decision_inputs=[prepare_inputs(i) for i in value['decision_inputs']])
    elif kind == 'decisionInputs':
        value = prepare_inputs(value)
    elif kind == 'history':
        value = prepare_history(value)
    tree = convert(kind, value)
    inspect_value(kind,value)
    return dump(tree)


def decode(kind, raw):
    value = convert(kind, load(raw), True)
    inspect_value(kind,value)
    return value
