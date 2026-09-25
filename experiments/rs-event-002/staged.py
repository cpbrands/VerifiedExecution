"""Non-normative staged admission / sequential projection experiment.
Only a fully expanded established-input value arrives on stdin. No oracle,
fixture identifiers, source-file access, or production authentication.
"""
import sys
import json
import math

KINDS = ('ACTION_CREATED', 'VALIDATION_STARTED', 'VALIDATION_SUCCEEDED',
         'AUTHORIZATION_GRANTED', 'EXECUTION_STARTED', 'EXECUTION_COMPLETED', 'EXECUTION_FAILED')
EDGES = {('NONE', 'ACTION_CREATED'): 'CREATED', ('CREATED', 'VALIDATION_STARTED'): 'VALIDATING',
         ('VALIDATING', 'VALIDATION_SUCCEEDED'): 'READY', ('READY', 'AUTHORIZATION_GRANTED'): 'AUTHORIZED',
         ('AUTHORIZED', 'EXECUTION_STARTED'): 'EXECUTING', ('EXECUTING', 'EXECUTION_COMPLETED'): 'COMPLETED',
         ('EXECUTING', 'EXECUTION_FAILED'): 'FAILED'}


def decode(x):
    if isinstance(x, dict):
        if set(x) == {'integer'}:
            s = x['integer']
            if not isinstance(s, str) or not s or str(int(s)) != s:
                raise ValueError('malformed test integer')
            return int(s)
        return {k: decode(v) for k, v in x.items()}
    return [decode(v) for v in x] if isinstance(x, list) else x


def eq(a, b, key=''):
    if type(a) is not type(b):
        return False
    if isinstance(a, dict):
        return set(a) == set(b) and all(eq(v, b[k], k) for k, v in a.items())
    if isinstance(a, list):
        if key in ('assessments', 'roles'):
            return all(any(eq(x, y) for y in b) for x in a) and all(any(eq(y, x) for x in a) for y in b)
        return len(a) == len(b) and all(eq(x, y) for x, y in zip(a, b))
    return a == b


def text(x):
    return isinstance(x, str) and bool(x) and not any(0xD800 <= ord(c) <= 0xDFFF for c in x)


def record(x, names):
    return isinstance(x, dict) and set(x) == set(names.split())


def context_ok(c):
    if not record(c, 'sources conditions not_applicable execution_terms commit_required'):
        return False
    if type(c['commit_required']) is not bool or not text(c['execution_terms']):
        return False
    if not all(isinstance(c[k], list) for k in ('sources', 'conditions', 'not_applicable')):
        return False
    names = []
    for s in c['sources']:
        if not record(s, 'name roles') or not text(s['name']) or not isinstance(s['roles'], list) or not s['roles']:
            return False
        if any(r not in ('boundary', 'validation', 'authorization', 'execution', 'time') for r in s['roles']):
            return False
        names.append(s['name'])
    if not names or len(set(names)) != len(names):
        return False
    categories = {'validation', 'identity', 'delegation', 'policy', 'approval'}
    present = []
    for i, d in enumerate(c['conditions']):
        if not record(d, 'category contract inputs evaluator') or not all(text(v) for v in d.values()):
            return False
        if d['category'] not in categories or d['evaluator'] not in names or any(eq(d, old) for old in c['conditions'][:i]):
            return False
        role = 'validation' if d['category'] == 'validation' else 'authorization'
        if not any(s['name'] == d['evaluator'] and role in s['roles'] for s in c['sources']):
            return False
        present.append(d['category'])
    absent = []
    for d in c['not_applicable']:
        if not record(d, 'category reason') or not text(d['reason']) or d['category'] not in categories:
            return False
        absent.append(d['category'])
    return (len(set(absent)) == len(absent) and not set(absent).intersection(present)
            and set(absent + present) == categories and {'validation', 'identity'} <= set(present))


def endpoint(p):
    if not isinstance(p, list) or len(p) != 8 or any(type(v) is not int for v in p):
        return False
    y, m, d, h, minute, s, n, den = p
    if y < 1 or not 1 <= m <= 12 or not 0 <= h < 24 or not 0 <= minute < 60 or not 0 <= s < 60:
        return False
    days = [31, 29 if y % 4 == 0 and (y % 100 != 0 or y % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return 1 <= d <= days[m-1] and den > 0 and 0 <= n < den and math.gcd(n, den) == 1


def interval(x):
    if not record(x, 'earliest latest') or not endpoint(x['earliest']) or not endpoint(x['latest']):
        return False
    a, b = x['earliest'], x['latest']
    return tuple(a[:6]) < tuple(b[:6]) or (a[:6] == b[:6] and a[6]*b[7] <= b[6]*a[7])


def assessment_ok(a):
    if not record(a, 'binding source role statement result basis') or not text(a['basis']):
        return False
    if not record(a['binding'], 'action_id action_digest bound_instance_fields event_type event_id prior_head sequence context') or not context_ok(a['binding']['context']):
        return False
    s, r = a['statement'], a['result']
    if s == 'fact':
        return r in ('established', 'refuted', 'unknown')
    if s == 'commit':
        return r in ('committed', 'not_committed', 'not_applicable', 'unknown')
    if s == 'time':
        return r == 'unknown' or isinstance(r, dict)  # detailed time domain below
    return (record(s, 'condition') and type(s['condition']) is int and 0 <= s['condition'] < len(a['binding']['context']['conditions'])
            and r in ('satisfied', 'unsatisfied', 'unknown'))


def decision(b, env, state, head, ordinal, used, historical=False):
    failures = {'reject': set(), 'unsupported': set(), 'unestablished': set()}
    def add(category, reason):
        failures[category].add(reason)
    pairs = b['event']
    e = dict(pairs)
    if len(e) != len(pairs):
        add('reject', 'duplicate-field')
    required = ('event_id', 'action_id', 'event_type', 'occurred_at', 'sequence', 'spec_version', 'payload')
    if any(k not in e or e[k] is None for k in required):
        add('reject', 'required-field')
        return finish(failures)
    if any(k in e for k in ('actor', 'component', 'references')):
        add('reject', 'forbidden')
    if not isinstance(e['event_id'], str) or len(e['event_id']) != 64 or any(c not in '0123456789abcdef' for c in e['event_id']):
        add('reject', 'event-id')
    if type(e['sequence']) is not int or not 0 <= e['sequence'] <= 18446744073709551615:
        add('reject', 'sequence-domain')
    if e['event_id'] in used:
        add('reject', 'id-reuse')
    if ordinal is not None and e['sequence'] <= ordinal:
        add('reject', 'sequence-order')
    if e['action_id'] != b['action']['action_id'] or e['spec_version'] != ['VE-002', '0.2']:
        add('reject', 'binding')
    t = e['event_type']
    if not isinstance(t, list) or len(t) != 4 or t[:3] != ['https://github.com/cpbrands/VerifiedExecution', 'BOUNDED-LIFECYCLE-EVENT-TYPE-SEMANTIC-PROFILE', '0.2-draft.1'] or t[3] not in KINDS:
        add('unsupported', 'type-unavailable')
        return finish(failures)
    kind = t[3]
    if not historical and env['fixed_profile'] != env['presented_profile']:
        add('reject', 'retargeting')
    if any(p not in env['material_catalog'] for p in b['action']['material']):
        add('unsupported', 'dependency-unavailable')
    if not interval(e['occurred_at']):
        add('reject', 'time-domain')
    selected = b['selection']
    if selected is None:
        return ('unselected', ['selection'])
    if selected != {'event_id': e['event_id'], 'head': head, 'sequence': e['sequence']}:
        add('reject', 'selection-binding')
    C, S, A, proof = b['context'], b['assessments'], b['action'], b['establishment']
    shape = context_ok(C) and all(assessment_ok(a) for a in S)
    payload = e['payload']
    if (not shape or not record(payload, 'action context assessments') or not context_ok(payload['context'])
            or not isinstance(payload['assessments'], list) or not all(assessment_ok(a) for a in payload['assessments'])):
        add('reject', 'explanation')
    if not eq(payload, {'action': A, 'context': C, 'assessments': S}):
        add('reject', 'payload-copy')
    if not shape:
        return finish(failures)
    for p in (proof['context'], proof['action']):
        if p['status'] == 'failed':
            add('reject', 'establishment-failed')
        elif p['status'] != 'verified':
            add('unsupported', 'establishment-unavailable')
    if not eq(proof['context']['value'], C) or not eq(proof['context']['action'], A) or proof['context']['head'] != selected['head'] or not eq(proof['action']['value'], A):
        add('reject', 'authority')
    B = {'action_id': A['action_id'], 'action_digest': A['action_digest'], 'bound_instance_fields': A['bound_instance_fields'], 'event_type': t, 'event_id': e['event_id'], 'prior_head': head, 'sequence': e['sequence'], 'context': C}
    factrole = 'validation' if kind == 'VALIDATION_SUCCEEDED' else 'execution' if kind.startswith('EXECUTION_') else 'boundary'
    for a in S:
        if not eq(a['binding'], B):
            add('reject', 'binding')
        needed = factrole if a['statement'] == 'fact' else 'time' if a['statement'] == 'time' else 'execution' if a['statement'] == 'commit' else 'validation' if C['conditions'][a['statement']['condition']]['category'] == 'validation' else 'authorization'
        if a['role'] != needed or not any(s['name'] == a['source'] and a['role'] in s['roles'] for s in C['sources']):
            add('reject', 'authority')
        if isinstance(a['statement'], dict) and a['source'] != C['conditions'][a['statement']['condition']]['evaluator']:
            add('reject', 'authority')
        matches = [p for p in proof['assessments'] if eq(p['assessment'], a)]
        if not matches or any(p['status'] == 'unavailable' for p in matches):
            add('unsupported', 'establishment-unavailable')
        for p in matches:
            if p['status'] == 'failed':
                add('reject', 'establishment-failed')
            if not eq(p['grant'], {'source': a['source'], 'role': a['role'], 'statement': a['statement'], 'binding': a['binding']}):
                add('reject', 'authority')
    def results(statement):
        return [a['result'] for a in S if eq(a['statement'], statement)]
    for a in S:
        rs = results(a['statement'])
        definite = [r for r in rs if r != 'unknown']
        if a['statement'] != 'time' and any(not eq(r, definite[0]) for r in definite[1:]):
            add('reject', 'contradiction')
    facts = results('fact')
    if 'refuted' in facts:
        add('reject', 'fact-refuted')
    if 'established' not in facts:
        add('unestablished', 'fact-missing')
    required_categories = ['validation'] if kind == 'VALIDATION_SUCCEEDED' else ['identity', 'delegation', 'policy', 'approval'] if kind == 'AUTHORIZATION_GRANTED' else []
    for i, c in enumerate(C['conditions']):
        if c['category'] not in required_categories:
            continue
        rs = results({'condition': i})
        if 'unsatisfied' in rs:
            add('reject', 'condition-denied')
        if 'satisfied' not in rs:
            add('unestablished', 'condition-missing')
    if kind == 'EXECUTION_COMPLETED' and C['commit_required']:
        rs = results('commit')
        if any(r in ('not_committed', 'not_applicable') for r in rs):
            add('reject', 'commit-denied')
        if 'committed' not in rs:
            add('unestablished', 'commit-missing')
    times = [r for r in results('time') if r != 'unknown']
    if not times:
        add('unestablished', 'time-missing')
    if any(not interval(r) for r in times):
        add('reject', 'time-domain')
    if any(not eq(r, times[0]) for r in times[1:]):
        add('reject', 'time-conflict')
    if any(not eq(r, e['occurred_at']) for r in times):
        add('reject', 'time-event')
    if state in ('COMPLETED', 'FAILED'):
        add('reject', 'terminal')
    elif (state, kind) not in EDGES:
        add('reject', 'transition')
    return finish(failures)


def finish(failures):
    for category in ('reject', 'unsupported', 'unestablished'):
        if failures[category]:
            return category, sorted(failures[category])
    return 'accept', ['admit']


def evaluate(raw):
    env = decode(raw)
    history = sorted(env['history'], key=lambda b: dict(b['event'])['sequence'])
    membership = sorted(env['membership'])
    if sorted(dict(b['event'])['event_id'] for b in history) != membership:
        raise ValueError('malformed fixture: membership/delivery mismatch')
    state, head, ordinal, used = 'NONE', 'NONE', None, []
    for b in history:
        category, reasons = decision(b, env, state, head, ordinal, used, True)
        if category != 'accept':
            return {'classification': category, 'state': None, 'prefix': None if state == 'NONE' else state, 'complete': False, 'retained': membership, 'appended': None, 'obligations': reasons}
        e = dict(b['event'])
        state = EDGES[(state, e['event_type'][3])]
        head, ordinal = e['event_id'], e['sequence']
        used.append(head)
    classification, reasons, appended = 'accept', ['replay'], None
    if env['candidates']:
        selected = [b for b in env['candidates'] if b['selection'] is not None]
        if len(selected) != 1:
            classification, reasons = 'unselected', ['selection']
        else:
            b = selected[0]
            classification, reasons = decision(b, env, state, head, ordinal, used)
            if classification == 'accept':
                e = dict(b['event'])
                state = EDGES[(state, e['event_type'][3])]
                appended = e['event_id']
                membership = sorted(membership + [appended])
    return {'classification': classification, 'state': None if state == 'NONE' else state, 'prefix': None, 'complete': True, 'retained': membership, 'appended': appended, 'obligations': reasons}


if __name__ == '__main__':
    print(json.dumps(evaluate(json.load(sys.stdin)), separators=(',', ':')))
