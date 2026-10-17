#!/usr/bin/env python3
"""Optional JSON-only aggregate refresh. Normal build never needs reference repos.

Usage: python3 prepare_data.py --model /absolute/path/to/therawme/index.html
Reads only the embedded aggregate model, never executes JS or opens raw vote files.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys
sys.dont_write_bytecode = True

ALLOWLIST='P04 P21 P25 P31 P35 P36 P93 P95 P96 P06 P03 P53 P58 P91 P116 P97 P87 P68 P78 P94 P66 P73 P18 P118'.split()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model',type=Path,required=True)
    args=parser.parse_args()
    text=args.model.read_text()
    if text.count('const M = ')!=1:
        raise ValueError('Expected exactly one aggregate model marker')
    remaining=text.split('const M = ',1)[1]
    model,end=json.JSONDecoder().raw_decode(remaining)
    if not remaining[end:].startswith(';'):
        raise ValueError('Unexpected JSON boundary')
    source_questions={q['poll_id']:q for q in model['questions']}
    for question in ALLOWLIST:
        if question not in source_questions:
            raise ValueError('Required question missing: '+question)
    root=Path(__file__).resolve().parent
    data=json.loads((root/'data.json').read_text())
    names=[t['name'] for t in model['tribes']]
    if names!=[t['name'] for t in data['model']['tribes']]:
        raise ValueError('Changed tribe identity/order requires review')
    quiz=next(q for q in model['quizzes'] if q['id']=='raw-mind')
    output=data['model']
    output['tribes']=[{'name':t['name'],'share':t['share']} for t in model['tribes']]
    output['questions']=[{'id':pid,**{k:source_questions[pid][k] for k in ['text','a','b','n']},'pa':[source_questions[pid]['pa'][name] for name in names]} for pid in ALLOWLIST]
    output['policy']['themedIds']=[pid for pid in ALLOWLIST if pid in quiz['themed']]
    output['policy']['maxAnswers']=model['fixed_len']
    output['source']['commit']=subprocess.check_output(['git','-C',str(args.model.parent),'rev-parse','HEAD'],text=True).strip()
    output['source']['embeddedModelSha256']=hashlib.sha256(remaining[:end].encode()).hexdigest()
    from build import validate
    validate(data)
    (root/'data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print('Refreshed aggregate-only fixture: 8 tribes, 24 questions, 192 likelihoods. Review source/model metadata before circulation.')
if __name__=='__main__':
    main()
