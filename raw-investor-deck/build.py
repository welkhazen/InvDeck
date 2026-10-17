#!/usr/bin/env python3
"""Build the portable presentation using only files in this directory. Python stdlib."""
import argparse
import base64
import hashlib
import html
import json
import mimetypes
import math
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent

def validate(data):
    model = data['model']
    expected = 'P04 P21 P25 P31 P35 P36 P93 P95 P96 P06 P03 P53 P58 P91 P116 P97 P87 P68 P78 P94 P66 P73 P18 P118'.split()
    actual = [q['id'] for q in model['questions']]
    for question in expected:
        if question not in actual:
            raise ValueError('Required question missing: ' + question)
    if actual != expected or len(model['tribes']) != 8:
        raise ValueError('Unexpected fixture identity/order')
    if not all(set(t) == {'name','share'} and math.isfinite(t['share']) and t['share'] > 0 for t in model['tribes']):
        raise ValueError('Invalid aggregate tribe fields or prior')
    if abs(sum(t['share'] for t in model['tribes']) - 1) > 1e-9:
        raise ValueError('Priors must sum to one')
    for question in model['questions']:
        if set(question) != {'id','text','a','b','n','pa'}:
            raise ValueError('Non-allowlisted question field')
        if len(question['pa']) != 8 or not all(isinstance(n, (int,float)) and 0 < n < 1 for n in question['pa']):
            raise ValueError('Invalid likelihood: ' + question['id'])
    if len(data['chapters']) != 24 or len(set(c['id'] for c in data['chapters'])) != 24:
        raise ValueError('Expected 24 unique chapters')
    for scenario in data['funding']:
        if sum(a['amount'] for a in scenario['allocations']) != scenario['raise']:
            raise ValueError('Funding does not reconcile')

def asset(match):
    name = match.group(1)
    path = ROOT / 'assets' / name
    if path.parent != ROOT / 'assets' or not path.is_file():
        raise ValueError('Unknown asset: ' + name)
    mime = mimetypes.guess_type(name)[0] or ('font/woff2' if name.endswith('.woff2') else 'application/octet-stream')
    return 'data:' + mime + ';base64,' + base64.b64encode(path.read_bytes()).decode()

def funding_print(data):
    parts = []
    for scenario in data['funding']:
        reserve = sum(a['amount'] for a in scenario['allocations'] if a.get('reserve'))
        operating = scenario['raise'] - reserve
        rows = ''.join('<div><dt>' + html.escape(a['label']) + '</dt><dd>$' + format(a['amount'], ',') + '</dd></div>' for a in scenario['allocations'])
        parts.append(f'<article class="print-scenario"><h3>${scenario["raise"]:,} · {scenario["months"]} months</h3><dl>{rows}</dl><p>Total ${scenario["raise"]:,}; reserve ${reserve:,}; operating budget ${operating:,}.<br>${operating:,} / {scenario["months"]} = ${operating/scenario["months"]:,.2f} average monthly operating spend.</p><p>{html.escape(scenario["team"])}</p><ul>' + ''.join('<li>'+html.escape(m)+'</li>' for m in scenario['milestones']) + '</ul></article>')
    return ''.join(parts)

def source_html(data):
    sources = list(data['sources'])
    known = {source['url'] for source in sources}
    for filename in ['research-sources.md', 'evidence-status.md']:
        path = ROOT / filename
        if path.exists():
            for url in re.findall(r'https?://[^\s<>\]\)]+', path.read_text()):
                if url not in known:
                    known.add(url)
                    sources.append({'id':'register-'+str(len(sources)), 'label':'Additional source from '+filename, 'url':url, 'note':'See the evidence register for definition, limitations and access status. This link is not a claim of fresh verification.'})
    return ''.join('<article class="source-item" id="source-'+html.escape(s['id'])+'"><h4>'+html.escape(s['label'])+'</h4><p>'+html.escape(s['note'])+'</p><a href="'+html.escape(s['url'], quote=True)+'">'+html.escape(s['url'])+'</a></article>' for s in sources)

def build():
    data = json.loads((ROOT / 'data.json').read_text())
    validate(data)
    template = (ROOT / 'index.template.html').read_text()
    docs=[]
    for filename in ['evidence-status.md', 'research-sources.md']:
        path=ROOT / filename
        if path.exists():
            docs.append('<details class="evidence-document"><summary>Full register: '+filename+'</summary><pre>'+html.escape(path.read_text())+'</pre></details>')
    replacements = {'styles':(ROOT/'styles.css').read_text(), 'calculations':(ROOT/'calculations.js').read_text(), 'model':(ROOT/'model.js').read_text(), 'deck':(ROOT/'deck.js').read_text(), 'data':json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('\u2028','\\u2028').replace('\u2029','\\u2029'), 'sources':source_html(data), 'printFunding':funding_print(data), 'evidenceDocs':''.join(docs), 'fontLicense':html.escape((ROOT/'assets'/'OFL.txt').read_text())}
    for key,value in replacements.items():
        token='{{'+key+'}}'
        if token not in template:
            raise ValueError('Missing template placeholder: '+token)
        template=template.replace(token,value)
    template=re.sub(r'\{\{asset:([a-zA-Z0-9_.-]+)\}\}',asset,template)
    if re.search(r'\{\{[^}]+\}\}',template):
        raise ValueError('Unresolved template placeholder')
    version=hashlib.sha256(template.encode()).hexdigest()
    return '<!-- raW portable presentation | inputs '+data['version']+' | content sha256 '+version+' -->\n'+template

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true',help='Fail when generated HTML is stale; do not write')
    args=parser.parse_args()
    output=build()
    destination=ROOT/'index.html'
    if args.check:
        if not destination.exists() or destination.read_text()!=output:
            raise SystemExit('FAIL: index.html is missing or stale; run build.py')
        print('PASS: portable HTML is current')
    else:
        destination.write_text(output)
        print(f'Built {destination} ({len(output.encode()):,} bytes); 24 chapters; embedded local assets')
if __name__=='__main__':
    main()
