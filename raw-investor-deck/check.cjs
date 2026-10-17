const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const dir=__dirname;const chosen=process.argv.includes('--case')?process.argv[process.argv.indexOf('--case')+1]:'all';
if(!['all','fixture','math','model','navigation','demo','content','explorers','delivery'].includes(chosen))throw new Error('Unknown or missing test case: '+chosen);
function helper(name,global){const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(dir,name),'utf8'),c);return c[global]}
function pure(){
 if(['all','math'].includes(chosen)){const m=helper('calculations.js','RawMath');const data=JSON.parse(fs.readFileSync(path.join(dir,'data.json')));data.funding.forEach((s,i)=>{const r=m.summarizeFunding(s);assert.equal(r.total,s.raise);assert.equal(r.reserve,[5000,10000,10000][i]);assert.equal(r.operatingBudget,[95000,140000,240000][i]);assert.ok(Math.abs(r.averageMonthlyOperatingSpend-[7916.6666667,9333.3333333,13333.3333333][i])<.005)});assert.deepEqual(JSON.parse(JSON.stringify(m.calculateMarket({population:5340000,joinPct:1,payerPct:4,annualSpend:24}))),{members:53400,payers:2136,grossAnnualRevenue:51264});for(const v of ['',' ','abc','Infinity','-1','101'])assert.equal(m.parseMarket({joinPct:v,payerPct:'4',annualSpend:'24'}).ok,false);assert.equal(m.parseMarket({joinPct:'0',payerPct:'0',annualSpend:'0'}).ok,true);assert.equal(m.parseMarket({joinPct:'100',payerPct:'100',annualSpend:'1001'}).ok,false);console.log('PASS math: exact funding, reserve, market and invalid boundaries')}
 if(['all','model'].includes(chosen)){const m=helper('model.js','RawModel');const f={tribes:[{name:'A',share:.5},{name:'B',share:.5}],questions:Array.from({length:24},(_,i)=>({id:'q'+i,text:'Q',a:'A',b:'B',n:40,pa:[.8,.2]})),policy:{themeBonus:0,themedIds:[]}};let p=m.posterior(f,[{questionId:'q0',side:0}]);assert.ok(Math.abs(p[0]-.8)<1e-12);let s=m.initialState(f);assert.equal(s.currentId,'q0');s=m.transition(f,s,{type:'skip'});assert.equal(s.answers.length,0);assert.equal(s.currentId,'q1');let before=JSON.stringify(s);assert.equal(JSON.stringify(m.transition(f,s,{type:'submit'})),before);s=m.initialState(f);for(let i=0;i<5;i++){s=m.transition(f,s,{type:'select',side:i%2});s=m.transition(f,s,{type:'submit'})}assert.equal(s.answers.length,5);assert.equal(s.finished,true);assert.equal(m.transition(f,s,{type:'submit'}).answers.length,5);for(let target of [10,23]){s=m.transition(f,s,{type:'continue',target});while(!s.finished){s=m.transition(f,s,{type:'select',side:0});s=m.transition(f,s,{type:'submit'})}assert.equal(s.answers.length,target)}assert.equal(new Set(s.answers.map(a=>a.questionId)).size,23);s=m.transition(f,s,{type:'reset'});assert.equal(s.answers.length,0);assert.equal(m.posterior(f,s.answers)[0],.5);for(let i=0;i<24;i++)s=m.transition(f,s,{type:'skip'});assert.equal(s.finished,true);assert.equal(s.answers.length,0);console.log('PASS model: independent Bayesian fixture, checkpoints, skips, exhaustion, duplicate protection and reset')}
}
pure();
function fixture(){
 const d=JSON.parse(fs.readFileSync(path.join(dir,'data.json'))),model=d.model;
 const ids='P04 P21 P25 P31 P35 P36 P93 P95 P96 P06 P03 P53 P58 P91 P116 P97 P87 P68 P78 P94 P66 P73 P18 P118'.split(' ');
 assert.equal(require('crypto').createHash('sha256').update(JSON.stringify({tribes:model.tribes,questions:model.questions,policy:model.policy})).digest('hex'),'d5c08a7071bf500fef1acdceb9563387cc4fdbeed7e70a345f3111422e61f542');
 assert.equal(model.tribes.length,8);assert.deepEqual(model.questions.map(q=>q.id),ids);assert.equal(new Set(ids).size,24);assert.equal(model.questions.reduce((n,q)=>n+q.pa.length,0),192);assert.ok(Math.abs(model.tribes.reduce((n,t)=>n+t.share,0)-1)<1e-10);assert.equal(model.source.embeddedModelSha256,'4691cd5ad40faa9f9df61e9e8ebb9fe8c952a9afcdd2ad7ef52b65fe057d3731');
 for(const q of model.questions){assert.deepEqual(Object.keys(q).sort(),['a','b','id','n','pa','text']);assert.equal(q.pa.length,8);assert.ok(q.pa.every(x=>Number.isFinite(x)&&x>0&&x<1));assert.ok(q.n>=30)}
 assert.equal(model.policy.themedIds.length,11);assert.equal(model.policy.themeBonus,.05);
 const m=helper('model.js','RawModel');
 const f={tribes:[{name:'A',share:.5},{name:'B',share:.5}],questions:[{id:'plain',pa:[.8,.2]},{id:'themed',pa:[.79,.21]}],policy:{themeBonus:.05,themedIds:['themed']}};
 assert.equal(m.initialState(f).currentId,'themed');f.policy.themeBonus=0;assert.equal(m.initialState(f).currentId,'plain');
 const a=m.posterior(model,[{questionId:'P04',side:0}]),b=m.posterior(model,[{questionId:'P04',side:1}]);assert.ok(a.some((x,i)=>Math.abs(x-b[i])>.05));
 const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');assert.ok(!/\{\{[^}]+\}\}/.test(html));assert.ok(html.includes('SIL OPEN FONT LICENSE Version 1.1'));assert.ok(!/<(?:script|link)[^>]+(?:src|href)=["']https?:/.test(html));assert.ok(!/<img[^>]+src=["'](?!data:)/.test(html));
 const {execFileSync}=require('child_process');execFileSync('python3',[path.join(dir,'build.py'),'--check']);
 // Prove required-ID validation fails with the missing ID, without changing inputs.
 const validation=execFileSync('python3',['-B','-c',`import sys,json;sys.path.insert(0,${JSON.stringify(dir)});import build;d=json.load(open(${JSON.stringify(path.join(dir,'data.json'))}));d['model']['questions']=[q for q in d['model']['questions'] if q['id']!='P04'];\ntry:build.validate(d)\nexcept ValueError as e:assert 'P04' in str(e);print('expected failure: '+str(e))\nelse:raise AssertionError('missing question accepted')`],{encoding:'utf8'});assert.match(validation,/P04/);
 console.log('PASS fixture: exact 24 IDs, 192 likelihoods, provenance, aggregate schema, theme scoring, changed posterior, portable current build and missing-ID rejection');
}
if(['all','fixture'].includes(chosen))fixture();

async function browserChecks(){
 const cases=['navigation','demo','content','explorers','delivery'];
 if(chosen!=='all'&&!cases.includes(chosen))return;
 const {chromium}=require('playwright');
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();const errors=[],requests=[];
 page.on('pageerror',error=>errors.push(error.message));
 await context.route('**/*',route=>{const request=route.request();if(request.resourceType()==='document'&&request.url().startsWith('http://127.0.0.1:'))return route.continue();requests.push(request.url());return route.abort();});
 const url=process.env.DECK_URL||'http://127.0.0.1:8010/index.html';
 const open=async(hash='opening')=>{await page.goto(url+'#'+hash);await page.locator('[data-chapter]').first().waitFor();};
 const active=()=>page.evaluate(()=>document.querySelector('[data-chapter].active')?.id);
 const present=async()=>{if(await page.getAttribute('body','data-mode')!=='present')await page.click('#mode-toggle');};
 const go=async id=>{await page.evaluate(id=>{location.hash=id},id);await page.waitForTimeout(80);};
 try{
 if(chosen==='all'||chosen==='navigation'){
  await open();assert.equal(await page.getAttribute('body','data-mode'),'read');assert.equal(await page.locator('[data-chapter]').count(),24);
  await open('funding');assert.equal(await active(),'funding');assert.ok(Math.abs(await page.locator('#funding').evaluate(e=>e.getBoundingClientRect().top)-78)<3,'Hash aligns below sticky header');await open('unknown');assert.equal(await active(),'opening');assert.equal(new URL(page.url()).hash,'#opening');
  await present();await page.locator('body').click({position:{x:8,y:100}});await page.keyboard.press('ArrowRight');assert.equal(await active(),'human-need');await page.keyboard.press('End');assert.equal(await active(),'next-conversation');await page.keyboard.press('Home');assert.equal(await active(),'opening');
  await page.click('#menu-toggle');assert.equal(await page.getAttribute('#menu-toggle','aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.getAttribute('#menu-toggle','aria-expanded'),'false');assert.equal(await page.getAttribute('body','data-mode'),'present');assert.equal(await page.evaluate(()=>document.activeElement.id),'menu-toggle');
  await page.click('#menu-toggle');await page.click('#chapter-menu a[href="#funding"]');assert.equal(await active(),'funding');await page.goBack();assert.equal(await active(),'opening');await page.goForward();assert.equal(await active(),'funding');
  await page.keyboard.press('Escape');assert.equal(await page.getAttribute('body','data-mode'),'read');assert.equal(await active(),'funding');
  console.log('PASS navigation: read default, 24 chapters, hashes, Back/Forward, present keys, menu/Escape and mode preservation');
 }
 if(chosen==='all'||chosen==='demo'){
  await open('try-an-answer');await present();
  const starting=await page.locator('#posterior-bars').innerText();
  await page.click('[data-side="0"]');await page.keyboard.press('ArrowRight');assert.equal(await active(),'try-an-answer');
  await page.click('[data-demo="submit"]');assert.match(await page.locator('#demo-progress').innerText(),/^1 \/ 5/);assert.notEqual(await page.locator('#posterior-bars').innerText(),starting);
  await page.evaluate(()=>{document.querySelector('[data-demo="submit"]').click()});assert.match(await page.locator('#demo-progress').innerText(),/^1 \/ 5/);
  for(let i=1;i<5;i++){await page.click(`[data-side="${i%2}"]`);await page.click('[data-demo="submit"]')}
  assert.match(await page.locator('#demo-progress').innerText(),/^5 \/ 5.*RESULT/);await page.click('#mode-toggle');await present();assert.match(await page.locator('#demo-progress').innerText(),/^5 \/ 5/);
  for(const target of [10,23]){await page.click(`[data-demo="continue${target}"]`);let guard=0;while(await page.locator('[data-side="0"]').count()){assert.ok(guard++<25);await page.click('[data-side="0"]');await page.click('[data-demo="submit"]')}assert.match(await page.locator('#demo-progress').innerText(),new RegExp('^'+target+' / '+target));}
  await page.click('[data-demo="reset"]');assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-side')),true);await page.click('[data-demo="skip"]');assert.match(await page.locator('#demo-progress').innerText(),/^0 \/ 5/);await page.click('[data-demo="finish"]');assert.match(await page.locator('#demo-question').innerText(),/0 answered; 1 skipped/);await page.reload();assert.match(await page.locator('#demo-progress').innerText(),/^0 \/ 5/);assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
  console.log('PASS demo: changing posterior, guarded answer keys, duplicate prevention, 5/10/23, skip, early finish, mode state and refresh clearing');
 }
 if(chosen==='all'||chosen==='content'){
  await open();assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('section[data-chapter] > h2, section[data-chapter] h2[id]').count(),24);
  assert.match(await page.locator('#proof-to-earn').innerText(),/Not yet verified/);assert.match(await page.locator('#signal-and-limits details').textContent(),/no held-out cohort/);assert.match(await page.locator('#try-an-answer').textContent(),/not accuracy/);
  await go('product-loop');await page.click('[data-product="2"]');assert.match(await page.locator('#product-description').innerText(),/conversation carries/);await go('return-hypothesis');await page.click('[data-flywheel="4"]');assert.match(await page.locator('#flywheel-copy').innerText(),/Welcome the next person/);assert.equal(await page.locator('#contribution-network line').count(),5);
  assert.ok(await page.locator('.source-item').count()>=9);assert.equal(await page.locator('a[href="undefined"]').count(),0);assert.equal(requests.length,0);assert.equal(errors.length,0);
  console.log('PASS content: semantic headings, evidence limits, product stages, helped-to-helper journey, source appendix and no runtime asset/answer requests');
 }
 if(chosen==='all'||chosen==='explorers'){
  await open('funding');await present();
  for(const [id,total,monthly,months]of [['100k','$100,000','7.9K','12'],['150k','$150,000','9.3K','15'],['250k','$250,000','13.3K','18']]){await page.click(`[data-funding="${id}"]`);const text=await page.locator('#funding-content').innerText();assert.ok(text.includes(total));assert.ok(text.includes(monthly));assert.ok(text.includes(months));}
  await go('decision-gates');assert.match(await page.locator('#gate-scenario').innerText(),/250,000.*15,000/);for(let stage=0;stage<4;stage++){await page.click(`[data-expansion="${stage}"]`);assert.equal(await page.locator('#expansion-content .status').textContent(),'Planned');assert.ok((await page.locator('#expansion-content').innerText()).length>250)}await page.selectOption('#geography','mena');assert.match(await page.locator('#geography-copy').innerText(),/unavailable/);
  await go('market-arithmetic');assert.match(await page.locator('#market-results').innerText(),/51,264/);await page.fill('#joinPct','');assert.match(await page.locator('#market-results').innerText(),/suspended/);assert.doesNotMatch(await page.locator('#market-results').innerText(),/51,264|NaN|Infinity/);await page.fill('#joinPct','101');assert.equal(await page.getAttribute('#joinPct','aria-invalid'),'true');await page.fill('#joinPct','0');assert.match(await page.locator('#market-results').innerText(),/\$0/);await page.fill('#joinPct','1');await page.focus('#annualSpend');await page.keyboard.press('ArrowRight');assert.equal(await active(),'market-arithmetic');await page.click('#market-reset');assert.match(await page.locator('#market-results').innerText(),/51,264/);await page.click('#mode-toggle');await present();assert.match(await page.locator('#market-results').innerText(),/51,264/);
  console.log('PASS explorers: all exact funding scenarios, shared decision gates, four expansion stages, sourced geography, invalid/zero/reset market and input key guard');
 }
 if(chosen==='all'||chosen==='delivery'){
  fs.mkdirSync('/tmp/InvDeck-investor-check',{recursive:true});
  await open();await page.screenshot({path:'/tmp/InvDeck-investor-check/desktop-opening.png'});
  for(const width of [360,768,1440]){await page.setViewportSize({width,height:1000});for(const id of ['opening','product-loop','try-an-answer','product-status','funding','decision-gates','next-conversation']){await go(id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow at '+width+' / '+id);}if(width===360){await go('opening');await page.screenshot({path:'/tmp/InvDeck-investor-check/mobile-opening.png'});await go('funding');await page.screenshot({path:'/tmp/InvDeck-investor-check/mobile-funding.png'});}}
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>{document.documentElement.style.zoom='2'});for(const id of ['opening','try-an-answer','funding','market-arithmetic']){await go(id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow at 200% '+id)}await page.evaluate(()=>{document.documentElement.style.zoom=''});
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);
  await present();await page.evaluate(()=>{document.documentElement.requestFullscreen=()=>Promise.reject(new Error('Denied for verification'))});await page.click('#fullscreen');assert.match(await page.locator('#global-announcement').textContent(),/continue to work/);assert.equal(await page.getAttribute('body','data-mode'),'present');
  await go('funding');const before=await active();const disclosuresBefore=await page.evaluate(()=>[...document.querySelectorAll('details')].map(d=>d.open));await page.emulateMedia({media:'print'});assert.equal(await page.locator('[data-chapter]:visible').count(),24);assert.equal(await page.locator('.print-scenario:visible').count(),3);await page.pdf({path:'/tmp/InvDeck-investor-check/raW-investor-deck.pdf',format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});assert.equal(await active(),before);assert.equal(await page.getAttribute('body','data-mode'),'present');assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('details')].map(d=>d.open)),disclosuresBefore);
  await go('product-loop');await page.screenshot({path:'/tmp/InvDeck-investor-check/desktop-product.png'});await go('product-status');await page.screenshot({path:'/tmp/InvDeck-investor-check/desktop-evidence.png'});await go('funding');await page.screenshot({path:'/tmp/InvDeck-investor-check/desktop-funding.png'});
  assert.equal(requests.length,0);assert.equal(errors.length,0);console.log('PASS delivery: desktop/mobile 360px/768px, 200% zoom, reduced motion, fullscreen denial, all 24 printed chapters, 3 scenarios, preserved screen state and PDF/screenshots');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 }finally{await browser.close()}
}
browserChecks().catch(error=>{console.error(error);process.exitCode=1});
