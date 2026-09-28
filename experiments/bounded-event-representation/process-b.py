import json
import sys
from importlib.util import spec_from_file_location, module_from_spec
from pathlib import Path

spec = spec_from_file_location('codec_b',Path(__file__).with_name('codec-b.py'))
codec = module_from_spec(spec)
spec.loader.exec_module(codec)
message = json.load(sys.stdin)
codec.configure(message['authority'])
request = message['request']
try:
    if request['op'] == 'encode':
        value = codec.encode(request['type'],request['value']).hex()
    elif request['op'] == 'decode':
        h = request['hex']
        if type(h) is not str or len(h)%2 or any(c not in '0123456789abcdef' for c in h):
            raise ValueError('invalid process hexadecimal')
        value = codec.decode(request['type'],bytes.fromhex(h))
    else:
        raise ValueError('invalid process operation')
    print(json.dumps({'ok':True,'value':value},ensure_ascii=True))
except codec.Failure as error:
    print(json.dumps({'ok':False,'error':str(error)}))
except (RecursionError, MemoryError):
    print(json.dumps({'ok':False,'error':'processing-incomplete/resource-limit'}))
