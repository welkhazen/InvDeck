/* One in-memory state owner. No fetch, storage, tracking or answer serialization. */
(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('deck-data').textContent);
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => '$' + n.toLocaleString('en-US', {maximumFractionDigits: 0});
  const integer = n => n.toLocaleString('en-US', {maximumFractionDigits: 0});
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const validId = id => chapters.some(chapter => chapter.id === id);
  const hashId = () => {
    let id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { /* malformed hash falls back */ }
    return validId(id) ? id : 'opening';
  };
  const state = {
    mode: 'read', chapterId: hashId(), menuOpen: false,
    demo: RawModel.initialState(data.model), fundingId: '100k',
    marketDraft: {joinPct: '1', payerPct: '4', annualSpend: '24'},
    productStep: 0, flywheelStep: 0, expansionStage: 0, milestone: 0, business: 0,
    geography: 'lebanon'
  };
  let menuReturnFocus = null;
  let programmaticScrollUntil = 0;

  function renderNavigation() {
    const index = data.chapters.findIndex(c => c.id === state.chapterId);
    $('chapter-position').textContent = String(index + 1).padStart(2, '0') + ' / 24';
    $('prev-chapter').disabled = index === 0;
    $('next-chapter').disabled = index === chapters.length - 1;
    chapters.forEach(chapter => chapter.classList.toggle('active', chapter.id === state.chapterId));
    document.querySelectorAll('#chapter-list a').forEach(link => {
      if (link.hash === '#' + state.chapterId) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function goTo(id, options = {}) {
    state.chapterId = validId(id) ? id : 'opening';
    renderNavigation();
    const method = options.history === 'replace' ? 'replaceState' : 'pushState';
    if (options.history !== 'none' && location.hash !== '#' + state.chapterId) {
      history[method](null, '', '#' + state.chapterId);
    }
    if (options.scroll !== false) {
      programmaticScrollUntil = Date.now() + 500;
      if (state.mode === 'present') window.scrollTo(0, 0);
      else $(state.chapterId).scrollIntoView({block: 'start', behavior: 'instant'});
    }
  }

  function setMode(mode) {
    state.mode = mode;
    document.body.dataset.mode = mode;
    $('mode-toggle').setAttribute('aria-pressed', String(mode === 'present'));
    $('mode-toggle').innerHTML = mode === 'present' ? 'Read <span aria-hidden="true">←</span>' : 'Present <span aria-hidden="true">→</span>';
    closeMenu(false);
    goTo(state.chapterId, {history: 'replace'});
    $('global-announcement').textContent = mode === 'present' ? 'Presentation mode. Arrow keys navigate when focus is outside controls. Escape returns to reading.' : 'Reading mode. All chapters are available by scrolling.';
  }

  function openMenu() {
    menuReturnFocus = document.activeElement;
    state.menuOpen = true;
    $('chapter-menu').hidden = false;
    $('menu-toggle').setAttribute('aria-expanded', 'true');
    $('menu-close').focus();
  }
  function closeMenu(restore = true) {
    const wasOpen = state.menuOpen;
    state.menuOpen = false;
    $('chapter-menu').hidden = true;
    $('menu-toggle').setAttribute('aria-expanded', 'false');
    if (wasOpen && restore && menuReturnFocus) menuReturnFocus.focus();
  }
  $('chapter-list').innerHTML = data.chapters.map(c => `<li><a href="#${c.id}"><span>${String(c.number).padStart(2, '0')}</span>${escape(c.title)}</a></li>`).join('');
  $('menu-toggle').addEventListener('click', () => state.menuOpen ? closeMenu() : openMenu());
  $('menu-close').addEventListener('click', () => closeMenu());
  $('mode-toggle').addEventListener('click', () => setMode(state.mode === 'read' ? 'present' : 'read'));
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('href') === '#main') return;
    const id = link.getAttribute('href').slice(1);
    if (!validId(id)) return;
    event.preventDefault();
    closeMenu(false);
    goTo(id);
    if (link.closest('#chapter-menu')) $('menu-toggle').focus();
  });
  function adjacent(delta) {
    const index = data.chapters.findIndex(c => c.id === state.chapterId);
    goTo(data.chapters[Math.max(0, Math.min(chapters.length - 1, index + delta))].id);
  }
  $('prev-chapter').addEventListener('click', () => adjacent(-1));
  $('next-chapter').addEventListener('click', () => adjacent(1));
  function followLocation() {
    const id = hashId();
    goTo(id, {history: location.hash === '#' + id ? 'none' : 'replace'});
  }
  window.addEventListener('hashchange', followLocation);
  window.addEventListener('popstate', followLocation);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (state.menuOpen) { event.preventDefault(); closeMenu(); }
      else if (state.mode === 'present') { event.preventDefault(); setMode('read'); }
      return;
    }
    if (state.menuOpen && event.key === 'Tab') {
      const focusable = [...$('chapter-menu').querySelectorAll('button,a')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      return;
    }
    if (state.mode !== 'present' || state.menuOpen || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (event.target.closest('input,textarea,select,button,a,summary,details,[contenteditable],[role="dialog"],[role="slider"]')) return;
    if (['ArrowRight','ArrowDown','PageDown'].includes(event.key)) { event.preventDefault(); adjacent(1); }
    if (['ArrowLeft','ArrowUp','PageUp'].includes(event.key)) { event.preventDefault(); adjacent(-1); }
    if (event.key === 'Home') { event.preventDefault(); goTo('opening'); }
    if (event.key === 'End') { event.preventDefault(); goTo('next-conversation'); }
  });
  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (state.mode !== 'read' || state.menuOpen || Date.now() < programmaticScrollUntil || scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      scrollQueued = false;
      const line = Math.min(200, innerHeight * .25);
      let active = chapters[0];
      for (const chapter of chapters) if (chapter.getBoundingClientRect().top <= line) active = chapter;
      if (active.id !== state.chapterId) goTo(active.id, {history: 'replace', scroll: false});
    });
  }, {passive: true});
  $('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else throw new Error('Unavailable');
    } catch {
      $('global-announcement').textContent = 'Fullscreen is unavailable. Presentation controls continue to work.';
    }
  });
  $('print-deck').addEventListener('click', () => window.print());

  const productSteps = [
    {title:'An answer is enough to begin.', text:'Choose a perspective without building a public persona first. Poll writes and avatar identity exist in code; production behavior is unverified.', scene:'<span class="scene-eyebrow">A LITTLE ABOUT YOU</span><h3 class="scene-question">A quiet evening,<br>or a room full<br>of people?</h3><div class="scene-option selected">A little quiet</div><div class="scene-option">A little company</div>'},
    {title:'Discover a space with context.', text:'Explore interest rooms or a Tribe-result invitation. Test whether answer-led routing improves a simple directory baseline.', scene:'<span class="scene-eyebrow">SOMETHING IN COMMON</span><div class="scene-room"><span>ILLUSTRATIVE ROOM</span><h4>The things we see differently.</h4><p class="small muted">A place to compare perspectives.</p><span>Explore the conversation →</span></div><div class="scene-room"><span>ANOTHER DOORWAY</span><h4>Small everyday discoveries.</h4></div>'},
    {title:'The conversation carries the value.', text:'A room is only useful when another person responds. Message persistence and realtime subscriptions are implemented; reciprocity remains to be measured.', scene:'<span class="scene-eyebrow">ILLUSTRATIVE CONVERSATION</span><div class="scene-message">What made you choose a quiet evening?</div><div class="scene-message reply">Sometimes I want a conversation without a crowd.</div><div class="scene-message">That makes sense. What do you like talking about?</div>'},
    {title:'Give people a reason to return.', text:'The long-term hypothesis is a useful room and a growing contribution habit. Rewards exist in code; reward-independent return needs evidence.', scene:'<span class="scene-eyebrow">THE NEXT VISIT · CONCEPT</span><h3 class="scene-question">Something<br>worth coming<br>back to.</h3><p class="small muted">A conversation to continue.<br>A new person to welcome.</p><div class="scene-option selected">Your place to contribute →</div>'}
  ];
  function renderProduct() {
    const item = productSteps[state.productStep];
    $('product-description').innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    $('product-scene').innerHTML = item.scene;
    document.querySelectorAll('[data-product]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.product === state.productStep)));
  }
  document.querySelectorAll('[data-product]').forEach(b => b.addEventListener('click', () => {state.productStep = +b.dataset.product; renderProduct();}));

  function demoAction(action) {
    state.demo = RawModel.transition(data.model, state.demo, action);
    renderDemo();
  }
  function renderDemo() {
    const demo = state.demo;
    const question = data.model.questions.find(q => q.id === demo.currentId);
    const posterior = RawModel.posterior(data.model, demo.answers);
    const leading = posterior.indexOf(Math.max(...posterior));
    $('demo-progress').textContent = `${demo.answers.length} / ${demo.target} ANSWERED${demo.finished ? ' · RESULT' : ''}`;
    $('demo-id').textContent = question ? `${question.id} · ${question.n} LABELED ANSWERS` : 'PROVISIONAL PATTERN';
    if (demo.finished) {
      const exhausted = !RawModel.nextQuestion(data.model, demo);
      $('demo-question').innerHTML = `<h3>${demo.answers.length ? escape(data.model.tribes[leading].name) + ' leads this pattern.' : 'A question is still a good place to start.'}</h3><p class="small muted">${demo.answers.length} answered; ${demo.skippedIds.length} skipped. ${exhausted ? 'The reviewed question pool is exhausted.' : 'Keep the same answer history if you continue.'} This is model belief, not validated accuracy or a personality assessment.</p>`;
      $('demo-controls').innerHTML = `<div class="demo-actions">${!exhausted && demo.answers.length < 10 ? '<button data-demo="continue10" class="primary-button">Continue to 10</button>' : ''}${!exhausted && demo.answers.length < 23 ? '<button data-demo="continue23">Continue up to 23</button>' : ''}<button data-demo="reset">Restart ↺</button><a class="text-link" href="#from-answer-to-room">After the answer →</a></div>`;
    } else {
      const selected = demo.pendingSide;
      const sideOrder = [...question.id].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 2 ? [1, 0] : [0, 1];
      $('demo-question').innerHTML = `<h3>${escape(question.text)}</h3><div class="answer-buttons" role="group" aria-label="Choose an answer">${sideOrder.map(side => `<button data-side="${side}" aria-pressed="${selected === side}">${escape(side === 0 ? question.a : question.b)}</button>`).join('')}</div>`;
      $('demo-controls').innerHTML = `<div class="demo-actions"><button data-demo="submit" class="primary-button" ${selected === null ? 'disabled' : ''}>${demo.answers.length + 1 === demo.target ? 'See the pattern' : 'Next question'} →</button><button data-demo="skip">Skip</button><button data-demo="finish">Finish early</button><button data-demo="reset" aria-label="Restart local demo">↺</button></div>`;
    }
    $('posterior-bars').innerHTML = data.model.tribes.map((tribe, index) => `<div class="belief-row ${index === leading && demo.answers.length ? 'lead' : ''}"><span>${escape(tribe.name.replace('The ',''))}</span><div class="belief-track" aria-hidden="true"><div class="belief-fill" style="width:${posterior[index] * 100}%"></div></div><span class="belief-value">${(posterior[index] * 100).toFixed(1)}%</span></div>`).join('');
    $('demo-announcement').textContent = demo.finished ? `Result after ${demo.answers.length} answers. Provisional model pattern. All eight probabilities shown.` : `${demo.answers.length} answered. ${question.text}`;
    $('answer-to-room').textContent = demo.answers.length ? `${data.model.tribes[leading].name} · ${demo.answers.length} answers` : 'A shared question.';
    $('print-demo').innerHTML = `<h3>Local demo ${demo.answers.length ? 'summary' : 'not played'}</h3><p>${demo.answers.length} answered; ${demo.skippedIds.length} skipped. ${demo.answers.length ? 'Full probability distribution appears above. ' : 'The initial bars are normalized source priors. '}No answer content is included in the print summary. Model belief is not validated accuracy, compatibility or a diagnosis.</p>`;
  }
  $('try-an-answer').addEventListener('click', event => {
    const side = event.target.closest('[data-side]');
    if (side) {
      state.demo = RawModel.transition(data.model, state.demo, {type:'select', side:+side.dataset.side});
      // Keep selected button in the DOM so native keyboard focus remains stable.
      document.querySelectorAll('[data-side]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.side === state.demo.pendingSide)));
      const submit = document.querySelector('[data-demo="submit"]');
      if (submit) submit.disabled = false;
      return;
    }
    const button = event.target.closest('[data-demo]');
    if (!button) return;
    const type = button.dataset.demo;
    demoAction(type.startsWith('continue') ? {type:'continue', target:+type.slice(8)} : {type});
    const focus = document.querySelector('[data-side], [data-demo="reset"]');
    if (focus) focus.focus();
  });
  $('restart-from-close').addEventListener('click', () => {demoAction({type:'reset'}); goTo('try-an-answer');});

  const journey = [
    {title:'Enter with a little curiosity.',copy:'Someone arrives with an answer, not a finished public identity.',measure:'Measure: accepted signup → first room entry.'},
    {title:'Find a moment of understanding.',copy:'A relevant response gives the first exchange a reason to continue.',measure:'Measure: first reciprocal conversation and voluntary experience feedback.'},
    {title:'Build the confidence to participate.',copy:'A useful room makes the next visit feel easier.',measure:'Measure: meaningful cohort return, alongside safety outcomes.'},
    {title:'Become a contributor.',copy:'Returning participants offer their own perspective and keep a conversation going.',measure:'Measure: returning contributors and reward-independent participation.'},
    {title:'Welcome the next person.',copy:'The person who once needed an opening now creates one for someone else.',measure:'Measure: member-led welcomes, reciprocal replies and founder-independent activity.'}
  ];
  function renderFlywheel() {
    $('flywheel-controls').innerHTML = journey.map((j,i) => `<button data-flywheel="${i}" aria-label="${i+1}. ${j.title}" aria-pressed="${i===state.flywheelStep}">${i+1}</button>`).join('');
    const item = journey[state.flywheelStep];
    $('flywheel-copy').innerHTML = `<h3>${item.title}</h3><p>${item.copy}</p><small>${item.measure}</small>`;
    const points = [[90,95],[218,57],[335,137],[278,272],[115,270],[205,170]];
    const edges = [[0,5],[1,5],[2,5],[3,5],[4,5],[0,1],[1,2],[2,3],[3,4]];
    let svg = '<title id="network-title">Conceptual contribution network. ' + escape(item.measure) + '</title>';
    edges.forEach(([a,b],i) => { if(i < state.flywheelStep + 1) svg += `<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" stroke="#F1C42D" stroke-width="1.5"/>`; });
    points.forEach(([x,y],i) => {svg += `<circle cx="${x}" cy="${y}" r="${i===5?35:23}" fill="#101010" stroke="${i<=state.flywheelStep||i===5?'#F1C42D':'#555'}"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="${i<=state.flywheelStep||i===5?'#F1C42D':'#999'}" font-size="${i===5?12:10}" font-family="Arial">${i===5?'YOU':String(i+1).padStart(2,'0')}</text>`;});
    $('contribution-network').innerHTML = svg;
  }
  $('flywheel-controls').addEventListener('click', event => {const b=event.target.closest('[data-flywheel]');if(b){state.flywheelStep=+b.dataset.flywheel;renderFlywheel();document.querySelector(`[data-flywheel="${state.flywheelStep}"]`).focus();}});

  const milestones = [
    {period:'M01–02',title:'Establish a trustworthy baseline.',copy:'Verify accepted writes across signup, avatar, answer, room and message. Reconcile live versus seeded poll counts, confirm consent and test the reporting path.',evidence:'Acceptance evidence: a reproducible end-to-end journey, production migration checks and reconciled events with failures visible.'},
    {period:'M03–05',title:'Observe three monthly cohorts.',copy:'Keep recruitment small and attributable. Describe windows and denominators; record first reciprocal conversations, return, room density and host effort.',evidence:'Acceptance evidence: three dated cohort readouts with sample sizes, event completeness and safety review.'},
    {period:'M06–08',title:'Test the doorway against a baseline.',copy:'Compare opt-in answer-based room routing with a simple directory. Track join, reciprocal response, later meaningful return and member contribution.',evidence:'Acceptance evidence: an interpretable comparison with cohort limits, founder involvement and quality feedback disclosed.'},
    {period:'M09–10',title:'Follow intent through to settled value.',copy:'Test one clear paid offer with secure payment and fulfillment. Separate earned tokens, requests, approvals and collected cash.',evidence:'Acceptance evidence: reconciled settlement, conversion denominator, refunds, repeat purchase and fulfillment costs.'},
    {period:'M11–12',title:'Decide whether the evidence earns expansion.',copy:'Review retention, conversation usefulness, moderation burden, acquisition effort and unit economics. Re-scope where needed; do not equate feature delivery with demand.',evidence:'Acceptance evidence: a documented proceed, iterate or pause decision, with mobile and next-market readiness assessed.'}
  ];
  function renderMilestone() {const item=milestones[state.milestone];$('milestone-copy').innerHTML=`<h3>${item.title}</h3><p>${item.copy}</p><p class="small gold">${item.evidence}</p>`;document.querySelectorAll('[data-milestone]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.milestone===state.milestone)));}
  document.querySelectorAll('[data-milestone]').forEach(b=>b.addEventListener('click',()=>{state.milestone=+b.dataset.milestone;renderMilestone();}));
  const business = [
    'Test an optional identity offer using the existing avatar/token-request foundation. Implemented but unverified in production; no cash revenue is established. Measure settled purchase, fulfillment cost, repeat demand and refunds.',
    'Planned: test one optional hosted or curated room experience while preserving the free social core. Measure voluntary purchase, attendance, useful conversations, support and moderation costs.',
    'Planned: test opt-in reflection on a person’s own participation, with clear consent and useful limits. Validate demand and rights first; no sale of identifiable answers or clinical interpretation is proposed.'
  ];
  function renderBusiness() {$('business-copy').textContent=business[state.business];document.querySelectorAll('[data-business]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.business===state.business)));}
  document.querySelectorAll('[data-business]').forEach(b=>b.addEventListener('click',()=>{state.business=+b.dataset.business;renderBusiness();}));

  function renderMarket() {
    const parsed = RawMath.parseMarket(state.marketDraft);
    for(const key of ['joinPct','payerPct','annualSpend']) {
      $(key).setAttribute('aria-invalid',String(!parsed.ok && !!parsed.errors[key]));
      $(key+'-error').textContent=parsed.ok?'':parsed.errors[key]||'';
    }
    if(!parsed.ok) {$('market-results').innerHTML='<p class="invalid-result">Correct the highlighted assumptions to calculate. Results are suspended.</p>';return;}
    const result=RawMath.calculateMarket(parsed.value);
    $('market-results').innerHTML=`<div><strong>${integer(result.members)}</strong><small>members · approximate</small></div><div><strong>${integer(result.payers)}</strong><small>payers · approximate</small></div><div><strong>${money(result.grossAnnualRevenue)}</strong><small>gross annually · assumed scenario</small></div>`;
  }
  for(const key of ['joinPct','payerPct','annualSpend']) $(key).addEventListener('input',()=>{state.marketDraft[key]=$(key).value;renderMarket();});
  $('market-reset').addEventListener('click',()=>{state.marketDraft={joinPct:'1',payerPct:'4',annualSpend:'24'};for(const [key,value]of Object.entries(state.marketDraft))$(key).value=value;renderMarket();});

  function renderFunding() {
    const scenario=data.funding.find(s=>s.id===state.fundingId);
    const summary=RawMath.summarizeFunding(scenario);
    $('funding-title').textContent=money(scenario.raise).replace(',000','K');
    document.querySelectorAll('[data-funding]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.funding===state.fundingId)));
    $('funding-content').innerHTML=`<div class="funding-layout"><div class="allocation-list">${scenario.allocations.map(a=>`<div class="allocation ${a.reserve?'reserve':''}"><span>${escape(a.label)}</span><span>${money(a.amount)}</span><div class="allocation-track" aria-hidden="true"><i style="width:${a.amount/scenario.raise*100}%"></i></div></div>`).join('')}</div><div class="funding-summary"><div class="funding-stats"><div><strong>${scenario.months}</strong><small>planning months</small></div><div><strong>~$${(summary.averageMonthlyOperatingSpend/1000).toFixed(1)}K</strong><small>average monthly<br>operating spend</small></div></div><p>${escape(scenario.team)}</p><h3>What this scenario aims to establish</h3><ul>${scenario.milestones.map(m=>`<li>${escape(m)}</li>`).join('')}</ul><p class="funding-math">${money(summary.total)} total − ${money(summary.reserve)} reserve = ${money(summary.operatingBudget)} operating budget.<br>${money(summary.operatingBudget)} / ${scenario.months} = $${summary.averageMonthlyOperatingSpend.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} per month.</p></div></div>`;
    $('gate-scenario').textContent=`${money(scenario.raise)} selected · ${scenario.months} planning months · ${scenario.id==='250k'?'$15,000 conditional MENA test allocation, after prior gates.':'No dedicated MENA test allocation. Validate the first community before expansion.'}`;
  }
  document.querySelectorAll('[data-funding]').forEach(b=>b.addEventListener('click',()=>{state.fundingId=b.dataset.funding;renderFunding();}));
  function expansionHTML(item) {
    return `<div class="expansion-detail"><div><span class="status planned">Planned</span><h3>${escape(item.title)}</h3><p class="muted">${escape(item.subtitle)}</p></div><dl>${[['Target participants','audience'],['Distribution','distribution'],['Localization','localization'],['Safety','safety'],['Evidence gate','gate']].map(([label,key])=>`<div class="${key==='gate'?'gate':''}"><dt>${label}</dt><dd>${escape(item[key])}</dd></div>`).join('')}</dl></div>`;
  }
  function renderExpansion() {$('expansion-content').innerHTML=expansionHTML(data.expansion[state.expansionStage]);document.querySelectorAll('[data-expansion]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.expansion===state.expansionStage)));}
  document.querySelectorAll('[data-expansion]').forEach(b=>b.addEventListener('click',()=>{state.expansionStage=+b.dataset.expansion;renderExpansion();}));
  function renderGeography() {
    const text={lebanon:'Lebanon: supplied research reports 2022 adult screening rates of 45.3% anxiety, 47.8% depression and 43.5% PTSD symptoms. Screening is not diagnosis; direct source check pending. These are not loneliness measures or product demand.',global:'Global: WHO’s 2025 report estimates approximately 1 in 6 experiencing loneliness, pooled 2014–2023. Historical source register; direct check pending. No like-for-like Lebanon comparison is available.',mena:'MENA: a comparable sourced loneliness series is unavailable in the supplied materials. No regional value, trend or interpolation is presented.'};
    $('geography-copy').textContent=text[state.geography];
  }
  $('geography').addEventListener('change',()=>{state.geography=$('geography').value;renderGeography();});

  // Print contains every interaction branch without mutating screen state or answers.
  function addPrintText(parentId,className,html) {const node=document.createElement('div');node.className='print-only '+className;node.innerHTML=html;$(parentId).appendChild(node);}
  addPrintText('product-loop','print-product',productSteps.map((p,i)=>`<h3>${i+1}. ${p.title}</h3><p>${p.text}</p>`).join(''));
  addPrintText('return-hypothesis','print-flywheel',journey.map((j,i)=>`<h3>${i+1}. ${j.title}</h3><p>${j.copy} ${j.measure}</p>`).join(''));
  addPrintText('validation-plan','print-milestones',milestones.map((m,i)=>`<div><h3>${m.period} · ${m.title}</h3><p>${m.copy} ${m.evidence}</p></div>`).join(''));
  addPrintText('business-model','print-business',business.map((b,i)=>`<p>${i+1}. ${b}</p>`).join(''));
  addPrintText('decision-gates','print-expansion',data.expansion.map(e=>`<div>${expansionHTML(e)}</div>`).join(''));
  let disclosureState=[];
  window.addEventListener('beforeprint',()=>{
    disclosureState=[...document.querySelectorAll('details')].map(d=>[d,d.open]);
    disclosureState.forEach(([d])=>{d.open=true;});
  });
  window.addEventListener('afterprint',()=>{disclosureState.forEach(([d,open])=>{d.open=open;});disclosureState=[];});

  renderProduct();renderDemo();renderFlywheel();renderMilestone();renderBusiness();
  renderMarket();renderFunding();renderExpansion();renderGeography();renderNavigation();
  if(location.hash !== '#'+state.chapterId) history.replaceState(null,'','#'+state.chapterId);
  if(state.chapterId!=='opening') requestAnimationFrame(()=>goTo(state.chapterId,{history:'replace'}));
})();
