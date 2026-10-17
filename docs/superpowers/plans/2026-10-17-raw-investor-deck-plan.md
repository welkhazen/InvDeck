# raW Investor Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a new, independent, self-contained 24-section HTML investor presentation with a genuine local model demo, evidence provenance, transparent funding and business assumptions, and dependable reading/presenting/printing.

**Architecture:** Author semantic chapters in one HTML template with focused plain-JavaScript controllers and pure calculation/model helpers. A Python standard-library build inlines committed data, CSS, JavaScript and authorized local assets into one portable `index.html`; nothing in the final artifact requires a server, a source repository or a database. One state owner preserves interactions across modes and printing.

**Tech Stack:** HTML, CSS, SVG, plain JavaScript, Python standard library; existing Node/Playwright and system Chromium for verification. No dependency install is needed.

**Spec:** [Design brief](../specs/2026-10-17-raw-investor-deck-design.md); [strategy/evidence roadmap](../../investor-deck/strategy-evidence-plan.md).

## Global Constraints

- **Status: IMPLEMENTATION BRIEF — draft decisions, authorized to proceed.** The supplied user brief requests audit → plan → implement → test without repeated approval.
- Keep V1/V2, the existing 14-chapter deck and production code untouched.
- No fabricated biography, testimonials, logos of partners, traction, or revenue.
- Answer state remains in memory; refresh/restart clears it.
- All 24 appear in reading mode and print.
- Preserve current section and demo/calculator state when switching modes.
- No public deployment, push or production code change is authorized.
- The build operates on committed presentation inputs; optional data refresh can read the reference repos.

## Review Focus

1. Focused inputs/buttons/links/disclosures must retain native keys instead of changing chapters; Task 3/4/5 checks.
2. Unknown hashes, direct links and Back/Forward must select a real chapter; Task 3 checks.
3. Skips, repeated clicks, optional 10/23 continuation and pool exhaustion must not fabricate answers; Task 2/4 checks.
4. Invalid calculator values and reserved cash must not create misleading outputs; Task 2/5 checks.
5. Print from present mode must include every chapter/source/scenario and preserve screen state; Task 6 checks.

---

## File map and ownership

All presentation files are under **`raw-investor-deck/`** in `/workspace/InvDeck`. The existing app is not modified. Use the existing isolated checkout, no new worktree. Record reference repo snapshots `wzwznew@cd6d642` and `therawme@793b29b`; update those references if audits use later snapshots.

| Exact file | Responsibility |
|---|---|
| `raw-investor-deck/index.template.html` | All 24 semantic sections, headings, evidence disclosures and interaction mounts. |
| `raw-investor-deck/styles.css` | Supplied raW visual tokens, varied editorial composition, responsive/read/present/print/reduced-motion behavior. |
| `raw-investor-deck/calculations.js` | Pure market validation and funding math, published as `globalThis.RawMath`. |
| `raw-investor-deck/model.js` | Pure posterior, entropy selection and demo transitions, published as `globalThis.RawModel`. |
| `raw-investor-deck/deck.js` | Chapter navigation, rendering, interactive flows, funding/market/roadmap controls and in-memory shared state. |
| `raw-investor-deck/data.json` | Whitelisted aggregate model, question curation, dated source/provenance records, funding assumptions and chapter metadata. |
| `raw-investor-deck/assets/` | Selected repository logo/avatar/font files; exact filenames/provenance recorded in README. Only asset types actually used are copied. |
| `raw-investor-deck/prepare_data.py` | Optional controlled refresh from explicit reference model path; parse JSON only and whitelist aggregate fields. |
| `raw-investor-deck/build.py` | Deterministic dependency-free inliner reading only presentation inputs; validates missing placeholders/assets. |
| `raw-investor-deck/index.html` | Generated complete portable presentation; final artifact and direct-download deliverable. |
| `raw-investor-deck/check.cjs` | Targeted pure-function and browser checks; writes screenshots/PDF under `/tmp/InvDeck-investor-check`. |
| `raw-investor-deck/README.md` | Open/present/print/build instructions, asset provenance, limitations and verification record. |
| `raw-investor-deck/research-sources.md` | External research register with methods, dates, definitions, access/verification status and source links. |
| `raw-investor-deck/evidence-status.md` | Current code review findings, product statuses, unresolved claims, missing metrics and audit snapshot. |
| `raw-investor-deck/presentation-copy.md` | Complete narrative and spoken-path guide, matching visible claims. |
| `docs/investor-deck/reference-intake.md` | Supplied attachment/page provenance and later visual-reference decisions. |

Pure helpers use ordinary script globals so the same source works inline in browsers and inside a Node VM test context. No runtime module imports/fetches and no untrusted HTML execution during data extraction. The Node VM executes our authored helper code only.

## Shared contracts

Use these shapes consistently; JSDoc is sufficient. Chapter ids are the exact 24 ids in the design storyboard, in that order.

- `ModelData = { tribes: { name, share }[], questions: { id, text, a, b, n, pa: number[] }[], policy: { maxAnswers: 23, checkpoints: [5,10,23], themeBonus: 0.05, themedIds: string[], sameQuestionGroups: string[][] } }`. Preserve the audit's additional provenance/historical-evaluation metadata in `data.json`; controllers consume this subset.
- `DemoState = { answers: { questionId, side: 0|1 }[], skippedIds: string[], currentId: string|null, pendingSide: 0|1|null, target: 5|10|23, finished: boolean }`.
- `DeckState = { mode: 'read'|'present', chapterId: string, menuOpen: boolean, demo: DemoState, fundingId: '100k'|'150k'|'250k', marketDraft: { joinPct: string, payerPct: string, annualSpend: string }, productStep: number, flywheelStep: number, expansionStage: number }`.
- `FundingScenario = { id, raise, months, allocations: { label, amount, reserve?: true }[], team, milestones: string[] }`.
- `EvidenceRecord = { id, claim, status, sourceLabel, url?, repoPath?, sourceSnapshot?, publishedAt?, measuredPeriod?, unit?, limitations: string[], verificationNote }`. Product statuses use “Verified in code / Implemented but unverified in production / In progress / Planned”; external evidence, founder reports, simulation and assumptions remain distinct.

## Task 1: Finalize the audit inputs and portable build

**Files:** Create `data.json`, `prepare_data.py`, `build.py`, required source/evidence docs and minimal template/style/script inputs; create `check.cjs` fixture/build group.

**Interfaces:** `python3 raw-investor-deck/prepare_data.py --model /absolute/path/to/therawme/index.html` refreshes the whitelisted fixture; `python3 raw-investor-deck/build.py` builds without access to reference repos; `--check` verifies output freshness without edits.

- [ ] Consolidate fresh app/model audit findings with file/commit evidence, supplied PDF claims and primary-source checks. Record access failures precisely; source validity cannot be inferred from a PDF confidence score. Update evidence-status and research-sources before writing claim-heavy sections.
- [ ] Extract aggregate model JSON from current source, use the fresh model audit's 24-question allowlist and preserve raw probabilities, omit all identities/history/secrets. Record source hash, commit and extraction date; no inherited testimonial or tribe-interpretation copy without support.
- [ ] Add `fixture` assertions: 8 tribes, 24 audited curated questions, unique question ids, one finite probability per tribe per question, normalized positive priors, approved field whitelist and no individual identifiers. Verify an intentionally missing required question fails with its id.
- [ ] Build the deterministic inliner for CSS/scripts/data and approved assets; safely escape embedded JSON `</script` sequences. Do not read environment credentials. Final HTML has no runtime asset/module/database requests.
- [ ] Run `python3 raw-investor-deck/build.py`, `python3 raw-investor-deck/build.py --check` and `node raw-investor-deck/check.cjs --case fixture`; expect success. A repeat build is byte-identical for unchanged inputs. Record the audit/input version in the generated file. Reuse the fresh auditors' aggregate export and source registers rather than redoing their extraction or duplicating their concurrent documentation edits.

## Task 2: Implement and test the financial/model helpers

**Files:** `calculations.js`, `model.js`, `check.cjs`, funding inputs in `data.json`.

**Interfaces:** `RawMath.summarizeFunding(s)` returns `{total,reserve,operatingBudget,averageMonthlyOperatingSpend}`; `RawMath.parseMarket(draft)` returns `{ok:true,value}` or `{ok:false,errors}`; `RawMath.calculateMarket(inputs)` returns `{members,payers,grossAnnualRevenue}`. `RawModel.posterior(model,answers)`, `RawModel.nextQuestion(model,state)`, `RawModel.initialState(model)`, `RawModel.transition(model,state,action)` are pure. Actions are `select(side)`, `submit`, `skip`, `finish`, `continue(target)`, `reset`.

- [ ] Add failing `math` checks for exact allocations totaling $100K/$150K/$250K, reserves $5K/$10K/$10K, operating budgets $95K/$140K/$240K and months 12/15/18. Monthly spends are 7916.6667/9333.3333/13333.3333 within $0.005. Default market outputs are 53,400 members, 2,136 payers and $51,264 gross annually.
- [ ] Add failing `model` checks with an independent two-cluster fixture: [0.5,0.5] prior × [0.8,0.2] likelihood yields [0.8,0.2] posterior; deterministic tie order; no repeated question; skips do not count; no duplicate submission; checkpoints 5/10/23; exhausted pools finish at actual count; reset restores prior.
- [ ] Implement reserve-excluding math and full validation: percentages 0–100; annual spend $0–$1000; blanks/nonfinite/negative/out-of-range are errors, zero is valid. Keep draft strings and unrounded intermediate values.
- [ ] Implement genuine normalized likelihood updates and expected-entropy selection from remaining curated questions, subtracting the source 0.05-nat theme bonus for `policy.themedIds` and excluding duplicate-wording groups. Preserve semantic answer mapping if displayed sides are shuffled. This is an adapted policy because the pool differs. `submit` consumes only a current question with a selected answer and then clears selection; continuation uses the same answer history. Reject malformed probabilities at fixture validation.
- [ ] Run `node raw-investor-deck/check.cjs --case math` and `--case model`; all assertions pass. No helper claims the demo validates personality or matching success. Include a test where the 0.05-nat theme preference changes a near-tied question selection, and a duplicate-wording exclusion test.

## Task 3: Build the 24-section shell and navigation

**Files:** `index.template.html`, `styles.css`, `deck.js`, chapter metadata, navigation checks.

**Interfaces:** `deck.js` owns `DeckState`; `goTo(id, {history:'push'|'replace'})`, `setMode(mode)`, `renderNavigation()` and `renderState()` preserve one state object. Each template chapter has the design id, `data-chapter`, an H2 and an accessible label; one document H1.

- [ ] Add failing `navigation` checks for default read mode, 24 chapter ids, direct `#funding`, invalid-hash fallback, Back/Forward, presentation next/previous/Home/End, chapter-menu focus restoration and Escape priority.
- [ ] Implement the semantic shell, source disclosures, toolbar, visible focus and skip link. Include full metadata and chapter titles rather than generic placeholders. Hash changes/reloads select actual chapters; explicit jumps push history and passive reading replaces it.
- [ ] Guard presentation shortcuts whenever focus is in controls, links, disclosures, editable content or dialogs, a modifier is held, or a menu needs the key. Read mode keeps native scrolling. Fullscreen is optional and denial does not interrupt presenting.
- [ ] Run `--case navigation` over HTTP using the independent HTML. Assert mode switches preserve active chapter and state, and all navigation is operable without swiping or dragging.

## Task 4: Compose the narrative and working human experience

**Files:** `index.template.html`, `deck.js`, `styles.css`, `presentation-copy.md`, evidence/source docs; `demo`/`content` checks.

**Interfaces:** `renderDemo()` consumes `RawModel` and `state.demo`; `renderProductStep(n)`, `renderFlywheelStep(n)` and `renderAnswerNetwork()` share state without creating fake users or chats.

- [ ] Write the 24 storyboard sections, with the supplied visual system and human language. Integrate the fresh audit, primary-source findings and strategy memo. Show code verification separately from production, and missing user/retention/revenue metrics as “Not yet verified.” Keep section 08's helped-become-helpers journey central.
- [ ] Build varied editorial compositions: oversized opener, research fact, product stage, model bars/network, origin timeline, provenance pipeline, qualitative competition matrix, validation ribbon and funding close. Use real branded assets; label recreated interactions/messages. Apply exact supplied colors and selective Michroma without a remote font dependency.
- [ ] Add failing `demo` checks for five answers, continue to ten/23, skip/early finish, reset, double click, state across mode switch, answer keys not navigating and refresh clearing data.
- [ ] Wire genuine local demo controls and evolving SVG/text outputs. Keep model-belief and no-diagnosis limitations visible. Wire product steps and the contribution journey; show proposed signal categories rather than invented computed personality scores. Neutral state works when the demo is skipped.
- [ ] Run `--case demo` and `--case content`; verify all 24 sections, no unresolved source ids, no invented biography/traction, no unsupported clinical/accuracy claims, and no answer storage or outgoing answer traffic. Read the document without narration and record source gaps instead of filling them.

## Task 5: Wire investment, market and expansion exploration

**Files:** `deck.js`, `index.template.html`, `styles.css`, source data; `explorers` checks.

**Interfaces:** `renderFunding()` and `renderDecisionGates()` share `fundingId`; `renderMarket()` uses `marketDraft` and `RawMath`; `renderExpansion(stage)` presents target users, distribution, localization, safety and gate for four stages.

- [ ] Add failing checks for all funding allocations, reserve and scenario-dependent milestones; input typing without chapter changes; invalid inputs hiding results; zero results; reset and state preservation; expansion stage content changes and planned labels.
- [ ] Implement accessible funding buttons and arithmetic details. Display approximately $7.9K/$9.3K/$13.3K with exact derivation. Show spending as a planning assumption, not measured burn. Expansion work remains gated even in the $250K scenario.
- [ ] Implement market controls and clear limits: the dated 5.34M reference is all-age internet users, not eligible audience or TAM; defaults are assumptions and gross revenue excludes churn, fees, tax and acquisition. Add the four-stage expansion interaction and source-aware geographic context only for comparable measures; never manufacture a MENA value.
- [ ] Run `--case explorers` and `--case math`; confirm valid/invalid boundaries, consistent scenarios and readable keyboard/touch controls.

## Task 6: Finish print, portability, accessibility and handoff

**Files:** `styles.css`, `deck.js`, `README.md`, generated `index.html`, full `check.cjs`.

**Interfaces:** `node raw-investor-deck/check.cjs [--case fixture|math|model|navigation|demo|content|explorers|delivery]`; default runs all. Use `DECK_URL` for the HTTP test URL, system Chromium `/usr/bin/chromium`, existing platform Playwright. No runtime third-party request is permitted.

- [ ] Add `delivery` checks for 360px mobile, desktop, 200% zoom, reduced motion and fullscreen denial. No page overflow or unreachable controls; visible focus, clear source details, text equivalents and 44px touch targets.
- [ ] Implement print styles revealing all chapters and disclosures regardless of mode, all three funding scenarios, source URLs/qualifications and current or unplayed demo summaries. Use light paper, avoid fixed-height clipping, and call current-document print without opening another window.
- [ ] Build; serve with `python3 -m http.server 8000 --directory raw-investor-deck`; run the focused suite against `http://127.0.0.1:8000/index.html`. Generate screenshots and PDF under `/tmp/InvDeck-investor-check`; inspect complete PDF flow and representative mobile/product/evidence/funding pages. Browser policy may prohibit `file://`; test standalone dependency absence by blocking all non-document requests over HTTP and auditing the export, and document that testing constraint honestly.
- [ ] Verify source links through available network access; distinguish publisher errors, proxy blocks and unverified URLs. Check each visible figure against the register, and no secret/user data appears in data/export.
- [ ] Document open/present/read/print/reset/build/refresh commands; 25–30-minute main path and 15-minute selected route; source and model limitations; missing evidence; actual check results. Confirm InvDeck app/production sources unchanged. Deliver the HTML and supporting docs without deploying or pushing.

## Self-review and execution handoff

**Coverage:** Every storyboard id maps to Task 4; product and contribution interactions to Task 4, source-aware geography/expansion/funding to Task 5, all modes/accessibility/print to Tasks 3/6, audit/build portability to Task 1, pure arithmetic/model behavior to Task 2. Required deliverables are explicit files. The strategy memo describes future product work; this plan implements only the presentation.

**Consistency:** One state owner; helpers' names and consumers match; print reuses the same data; JSON-only extraction cannot execute reference HTML. Required repository inspection is no longer described as unavailable. Runtime and normal build are independent of reference repositories.

**Review focus:** All five listed risks have owning checks. Evidence confidence and attribution receive editorial review, not only browser assertions. Larger-scenario budgets are already consistent and are clarified rather than falsely “fixed.”

**Proportion:** Six focused delivery tasks; no framework, database, production feature work, broad refactor or dependency install. Reuse fresh audit reports; do not re-run unrelated app test suites.

**Proceed now:** The user has authorized implementation following this plan, so no new design approval question is needed. Root can delegate independent audit/content/verification work and coordinate the shared template/state implementation, or use native execution where continuity is faster. Use models and effort according to the user's explicit effectiveness preference. Incorporate remaining audits before publishing claims; later visual decks refine the result rather than blocking this authorized build. No commit, push or public deployment unless separately instructed.
