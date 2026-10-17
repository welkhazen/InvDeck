# raW — a new pre-seed investor deck

**Status: IMPLEMENTATION BRIEF — draft decisions, authorized to proceed.** Updated 17 October 2026 after the supplied “PROJECT: raW — The Next Social Wave” instructions and the research PDF. The user explicitly requests audit → plan → implement → test, with reasonable decisions and no repeated approval. This new 24-section presentation retains the earlier request for more than 14 sections; the pasted 12–14 outline is expanded, not copied verbatim. Older visual decks have not yet arrived; use the explicit brand direction now and incorporate later references when available. This is a separate artifact, not a change to production raW or InvDeck app behavior.

## Decision and brief

Build a 24-section, interactive investor narrative in `raw-investor-deck/index.html`, a standalone HTML file with embedded assets, CSS, data and JavaScript. Its job is to make a pre-seed investor understand the product, distinguish the evidence from the ambition, and see what a $100,000 round would fund. $150,000 and $250,000 are selectable expansion scenarios. The deck must work in a founder-led meeting and when forwarded without explanation.

**Narrative thesis:** raW starts a social experience with an honest answer, then aims to turn that answer into a relevant human conversation. The round funds the work to establish whether that transition produces repeat participation and a viable business.

**Proposed opening:** “One honest answer. A reason to connect.”

**Proposed closing:** “Fund the next proof: a community people come back to.”

These lines are editorial proposals; preserve the supplied founder language “From being seen to being understood” and “The helped become the helpers” as central motifs. The product is social discovery; no treatment, clinical benefit, validated personality assessment, or demonstrated retention uplift is claimed.

### Three approaches

| Approach | Investor experience | Tradeoff |
|---|---|---|
| **Answer → conversation → proof (recommended)** | Start with a relatable question; show the product within the first five sections; let the investor try a short experience; build toward a measurable funding case. | Requires disciplined evidence labels so the demo does not feel like proof of product success. |
| Documentary origin story | Lead with The Cumulative Mind, historical polls, and the founder's relationship with the community. | Strong human opening once biography, anecdotes, permissions, and historical decks are available; currently too dependent on unverified material. |
| Investment memo first | Lead with the ask, market, operating plan, and risks; offer the experience as an appendix. | Easy diligence, but understates the emotional reason this product should exist. |

Use the recommended structure, with the origin story and diligence depth inside it. Use the brand colors and typography supplied in the brief; later visual references can refine composition without blocking implementation.

## Reference intake and evidence policy

Inspect each supplied older deck page by page when it arrives; until then use the explicit written brand brief. Record filename/date/page, exact useful wording, source of numerical claims, recurring visual motifs, logo/font/color treatment, product screenshots, and image rights or provenance. Identify what still expresses the founder's intent and what is outdated. Compare contradictions by period, definition, denominator, and evidence quality; never select the more flattering number merely because it appears in a polished deck. Save this in `docs/investor-deck/reference-intake.md` during implementation or reference review. Original attachment paths remain provenance links; do not copy private raw histories into public assets.

Reuse the user-provided deck and repository assets as authorized by this task, preserving the logo identity and recording provenance. Respect any actual restrictions attached to a specific asset; do not introduce a separate permission gate for routine reuse. Local wordmark text and CSS/SVG diagrams are sufficient fallback assets. No fabricated biography, testimonials, logos of partners, traction, or revenue.

The inaccessible Claude session has not been read. Repository documents and supplied attachments are the available continuity sources. Reference repositories are now available at `/workspace/reference-repos/wzwznew` (snapshot `cd6d642`) and `/workspace/reference-repos/therawme` (snapshot `793b29b`); audit results must identify exact files and distinguish source implementation from production verification.

### Evidence statuses visible to the investor

- **External research:** publisher, publication date, measured period, definition, URL, and whether directly checked in this work. Existing `research-sources.md` records secondary verification; do not upgrade it to a fresh primary-source check. Current primary HTTPS attempts to WHO, IHME, Frontiers and Reddit were proxy-blocked (CONNECT 403); retain supplied-research/source-note status and direct-check-pending labels.
- **Repository artifact:** a fact directly inspectable in this checkout, with file and snapshot reference. This does not establish live product operation.
- **Product status:** use the user-requested “Verified in code / Implemented but unverified in production / In progress / Planned” classifications with file paths and snapshot. “Verified in code” supports the implementation claim only; it never establishes active usage, live configuration or deployed operation. Older review documents remain prior observations until inspected against current source.
- **Founder-reported:** historical reach, community anecdotes, or other founder claims without independently inspectable support.
- **Internal simulation:** explicit population, task, evaluation conditions, and limitations; never relabel as user success or current accuracy.
- **Assumption / proposed experiment / planned capability:** distinguish arithmetic inputs, experiments, and product roadmap from observations.
- **Not yet measured:** a meaningful data gap, rendered as words rather than zero, an invented curve, or an empty decorative chart.

A compact status sits beside the claim; a native disclosure provides detail and source. Labels use words and shapes as well as color. Main-stage facts should be few and legible. Full URLs and limitations are available in reading mode and print.

### Research synthesis requested by the founder

The supplied mental-health research should strengthen the problem context only where its measures support the claim. It cannot establish demand for this product, answer-to-room conversion, improved well-being, retention, defensibility or willingness to pay. Review the PDF for original sources, fieldwork dates, geography, age/population, survey wording and comparability before selecting two or three main-stage facts. Recent publication dates do not make old fieldwork recent, and forecast market totals are not measured demand. Additional prior-chat research is unavailable unless supplied.

Build the investment case as an explicit chain: **documented social need → proposed audience and job → demonstrable product mechanism → observed repeated conversation → consented accumulated learning → paid value**. Each arrow needs separate evidence. The build priorities are event instrumentation and cohort definitions, reliable answer-to-room/reply flows, moderation operations, consent/data-rights review, and a bounded checkout experiment. Broader matching, insight reports and expansion follow only where the first evidence supports them.

Defensibility must be earned through a specific loop: sufficiently dense communities produce useful conversations; consented outcomes help refine question/room choices; better choices must improve measured return without compromising safety. The current historical dataset and local demo demonstrate an artifact, not that loop. Compare answer-based routing with a simple interest-room baseline, quantify founder-seeding dependence, and evaluate learning on held-out or later cohorts. A plausible business model needs payment intent followed by real checkout, repeat purchase or subscription retention, contribution margin including moderation/payment costs, and acquisition economics. The plan must distinguish required product builds from experiments and source research.

### Known conflicts to resolve, not silently inherit

1. The archived 1,795 count refers to voter accounts used for clustering, not verified unique people or current raW users. Different vote counts describe pipeline stages and cannot be summed.
2. The archived 87.9% result concerns an internal historical evaluation with a 27-question cap; the shipped test described in the old documents is 23 questions. It does not validate a five-question demo, matching quality, psychological traits, or retention. If discussed, include the task and both uniform 12.5% and largest-tribe approximately 27.6% baselines; keep it in methodological detail pending fresh verification.
3. Legacy copy's approximately 65% social-media “Bad” result is a smoothed model estimate; a reverted audit describes a 144/234 raw reconstruction. Do not substitute the latter without revalidation. Omit this disputed percentage from the new main narrative.
4. “Invite-only,” “live,” moderation workflow, payment availability, and automatic recommendations need current product evidence. Existing artifacts are evidence of a deck and model, not production operation.
5. Historical WHO links, internet-use editions, and regional comparisons need source checks. WHO Eastern Mediterranean, MENA, Arab States, and Lebanon are not interchangeable geographies. Screening outcomes, life evaluation, and loneliness are not interchangeable metrics.
6. Existing funding allocations already reconcile. Their displayed burns are rounded, not a proven defect. New presentation derives burn from the allocations and separates reserve consistently.
7. Team biography, distribution commitments, testimonials/permissions, active users, cohort retention, payment conversion, revenue, CAC, and data rights remain unavailable or unverified.

## Storyboard: 24 purposeful sections

“Live” identifies the 18-section primary path, appropriate for a 25–30-minute meeting including the demo and brief questions. For a 15-minute pitch, use **01 → 03 → 05 → 06 → 07 → 11 → 12 → 13 → 16 → 19 → 21 → 23 → 24**; cap the demo at 90 seconds or finish early. The remaining sections support questions and self-guided diligence. “Deep” sections remain in the deck and chapter menu. All 24 appear in reading mode and print. Headlines below express the proposed message; evidence can change their precise wording.

| # / stable id / role | Investor takeaway and proposed headline | Visual and purposeful interaction | Evidence requirement |
|---|---|---|---|
| 01 `opening` · Live | **One honest answer. A reason to connect.** Understand the product's emotional promise and that this is a pre-seed raise. | A large question on one side, a restrained avatar-to-conversation diagram on the other; $100K base ask in the footer. Start reading / Present controls. | Founder positioning; ask is a planning assumption. No user-count ticker. |
| 02 `human-need` · Live | **Being connected is not always feeling understood.** There is a recognizable human need. | One research-led typographic fact, preferably WHO's approximately 1 in 6 with period/method; a plain-language problem vignette clearly marked illustrative. Source disclosure. | Validate source details; no mortality spectacle, causal link to social media, or claim that raW treats loneliness. |
| 03 `first-community` · Live | **Start where we can learn closely.** The initial wedge is specific enough to test. | A proposed initial audience: adults 18–29 in founder-accessible Lebanese communities seeking low-pressure conversation; one journey from existing audience to invited cohort. | Target is a proposal, not measured demographics. Confirm founder access; no campus partnership logos without support. |
| 04 `experience-gap` · Live | **Expression is abundant. Starting a relevant conversation is harder.** State the job raW chooses to solve. | Editorial split: a familiar discovery path versus the proposed answer-to-room path. No generic platform takedown. | Design hypothesis; qualitative alternatives; no claim that competitors cannot offer relevant conversation. |
| 05 `product-loop` · Live | **Answer. Discover. Enter a conversation. Return.** Understand the product in seconds. | One large product storyboard; step buttons change a phone-sized scene with a matching explanatory sentence. Recreated interface and sample messages labeled. | Current screenshots if provided; otherwise “illustrative product walkthrough.” Distinguish interest-room selection from proposed recommendation and unverified tribe invite operation. |
| 06 `try-an-answer` · Live | **Try the starting point.** Experience the answer-led interaction. | Five-question local demo using the existing aggregate model; eight compact posterior bars, skip, restart, and finish early. Separate Next question button prevents double answers. | Extract only aggregate fixture from the current HTML. Model belief ≠ accuracy or personality diagnosis; no storage or transmission of answers. |
| 07 `from-answer-to-room` · Live | **The product bet happens after the result.** A classification is useful only if a conversation follows. | The investor's last answer/leading cluster connects to an illustrative room doorway, then a conversation. Neutral sample if demo skipped. | No fake live match, compatibility score, real person, or auto-created room. Room choice is a product concept unless demonstrated elsewhere. |
| 08 `return-hypothesis` · Live | **The helped become the helpers.** Retention and contribution hypotheses are observable. | A five-step interactive journey: enter → find understanding → build confidence → contribute → welcome the next person; an SVG network adds a contribution edge at each step and shows the proposed measure. Return is the commercial implication. | Hypothesis, not a measured causal flywheel. Notification and reply behavior need current verification. |
| 09 `origin` · Deep | **The idea grew from people answering questions.** Explain founder insight without manufacturing founder authority. | A dated editorial strip of historical question artifacts if supplied; a short, attributed origin account. | Founder-reported history. Historical followers/votes may appear with dates and labels, never as app traction; no testimonial without provenance and permission. |
| 10 `signal-and-limits` · Deep | **The dataset is a starting point, not the outcome.** Understand technical differentiation and limits. | Three-stage pipeline: historical answers → aggregate clusters → local demo; expandable methodology. Keep vote records and accounts visually separate. | Current aggregate artifact and fresh model audit; historical audit remains a lead rather than proof of current activity. Detailed internal simulation caveat if retained. No unseen individual data. |
| 11 `product-status` · Live | **Separate what exists from what comes next.** Investors can judge execution honestly. | A product map with status annotations: source-verified app capabilities, implemented but production-unverified paths, in-progress capabilities and next work. | Direct checks for current claims. Use current reference-repository file/commit citations and explicit production verification limits. |
| 12 `proof-to-earn` · Live | **The next proof is repeated participation.** Missing traction is explicit and the investment is aimed at resolving it. | Four measurement slots: activation, week-four return, conversation participation, paid conversion. Each currently says “Not yet verified” plus the evidence needed. | No fake chart, zero users, or forecast disguised as actuals. Specify denominators and cohort windows in details. |
| 13 `distribution` · Live | **Build density before breadth.** There is a bounded way to acquire and activate a first community. | Three proposed channels: founder audience invitations, small hosted groups, member invitations. Each has experiment, cost bucket, and learning question. | Hypotheses, not signed channels. No CAC claim until campaign cost and activated cohort size exist. |
| 14 `validation-plan` · Live | **Make expansion an evidence decision.** Show the near-term learning sequence. | A 12-month ribbon with early baseline, three monthly cohorts, repeat-participation review, checkout test, and expansion decision. Click a milestone for its acceptance evidence. | Dates relative to funding; targets set after baseline; iOS is a goal subject to readiness and review, not promised approval. |
| 15 `alternatives` · Deep | **Our wedge is the entry point.** Explain a defensible distinction without a fictitious monopoly. | Qualitative comparison of feeds, topic communities, social discovery, self-discovery and raW's proposed entry-to-conversation path. | Cite vendor materials when asserting current features. No unexplained score grid, unsupported checkmarks, or “only platform.” |
| 16 `business-model` · Live | **Participation first; payment tested deliberately.** Understand who might pay and why. | A free-to-paid value ladder: premium identity, optional room experiences, opt-in insights; precise status beside each. Select a hypothesis to show the proposed experiment. | Current payment status unverified; placeholder prices do not establish revenue. No identifiable-response sales claim presented as existing policy without confirmation. |
| 17 `market-arithmetic` · Deep | **A transparent beachhead, not a borrowed TAM.** Show the sensitivity of a small starting market. | Editable assumptions with a horizontal arithmetic equation and reset. Show members, payers, annual gross revenue scenario. | Reference denominator 5.34M all-age internet users in early 2025 is context, not eligible 18+ TAM. Defaults 1% × 4% × $24 yield $51,264. Explicitly excludes churn, tax, fees and acquisition costs. |
| 18 `defensibility` · Deep | **A returning community could compound the advantage.** Identify a plausible moat and the condition for it. | A three-layer diagram: consented answer signals, healthy conversation context, returning community. Dotted future feedback connection. | Potential advantage only. No claim that data volume creates a moat or that continuous learning is live. Rights unresolved. |
| 19 `trust-and-safety` · Live | **Trust is part of the operating model.** Show operational maturity about pseudonymous conversation. | Member journey with proposed prevention, report, response, appeal checkpoints and named role requirements. | Separate historically documented controls from verified operations. Self-declared 18+ is not verified age. Current response times/coverage unknown. |
| 20 `team-and-gaps` · Live | **A lean team with explicit coverage needs.** Investors understand who must deliver the plan. | Role-based operating diagram: founder, engineering, community/moderation, specialist legal/privacy. Founder biography slot omitted until supplied; role text remains honest. | Founder name, experience, commitment and staffing are requested evidence, not invented. Expanded scenario staffing is a proposed budget assumption. |
| 21 `funding` · Live | **$100K funds the next proof.** See exactly how capital maps to work. | Accessible $100K/$150K/$250K segmented buttons; allocation bars, reserve separated, arithmetic and milestone changes visible together. All scenarios printable. | Existing amounts carried as proposed allocations, not validated quotes or committed spend. Formula and values below. |
| 22 `decision-gates` · Deep | **More capital earns more options, not guaranteed scale.** Larger scenarios have conditional scope. | Three funding lanes plus an interactive four-stage map: Lebanon → MENA → international communities → global network. Each stage exposes target users, distribution, localization, safety and an evidence gate. Only supported current activity is marked current; all expansion remains planned. | Same scenario state as §21. No numerical success targets invented. Expansion requires retention, safety, unit-economics evidence and founder-independent room activity. |
| 23 `investment-case` · Live | **A clear product bet, a bounded proof round.** Summarize why invest and the two biggest unknowns. | Three short investment reasons, then two open questions: repeat participation and willingness to pay. No feature collage. | Every reason traceable to a previous section; no new unsupported claim at the close. |
| 24 `next-conversation` · Live | **Let's fund the work to find out.** Make the next step concrete. | Re-state $100K base; link $150K/$250K options back to §21. Founder contact, product link, sources, and restart demo. | Existing info@myraw.app and myraw.app are proposed contact references to confirm. No valuation, terms or committed investors. Sources include all claim details. |

## Visual direction from the supplied brand brief

Use dark metallic editorial technology with warmth and purposeful changes of composition. Preserve the recognizable gold W. Exact brief tokens: background `#080808`, primary text `#EBEBEB`, silver `#D9D9D9`, gold `#F1C42D`, border `#1A1A1A`, restrained periwinkle `#818CF8`. Status meaning must never depend on this palette.

Use Michroma sparingly for the wordmark and short openers, a highly legible body face for reading, and tabular numerals for arithmetic. Default to local/system fonts; embed an existing font with its provenance recorded. No remote font dependency. Desktop title scale approximately 48–80px, mobile 32–44px; body 18–22px in reading mode. Source detail can be 14–16px with sufficient contrast; presenter details open at readable size rather than shrinking the whole slide.

Composition alternates: oversized thesis, single evidence figure, product stage, five-question interaction, conversation timeline, source-aware pipeline, qualitative matrix, milestone ribbon, arithmetic equation, and funding allocation. Avoid enclosing every sentence in a rounded card. Show one main takeaway per section and reserve detail for disclosures. Product imagery should clarify the journey rather than imitate unverified screenshots. Motion is limited to short transitions and direct feedback; no ambient animated network, autoplay, or forced scroll choreography.

## Reading, presenting, printing

- Default is a continuous reading document with all 24 sections, short self-contained explanations, and expandable evidence. No information depends on narration.
- Present mode shows one section at a time, with local scrolling when necessary. It must not crop content to maintain a slide ratio. Preserve current section and demo/calculator state when switching modes. Fullscreen is optional and may fail without preventing presentation.
- Hash deep links use stable ids, e.g. `index.html#funding`; reload and browser Back/Forward preserve meaningful navigation. Unknown hashes return to the opening. Read mode uses ordinary scrolling and does not hijack Space or arrow keys.
- In present mode, arrows/PageUp/PageDown/Home/End navigate only when focus is outside inputs, buttons, links, selects, textareas, editable content, sliders, disclosures and dialogs, and no modifier key is held. Escape closes an open menu first; otherwise it exits present mode. Never advance the deck while answering or changing a number.
- Chapter navigation is a button with expanded state and a plain list of links; returning focus is explicit. Visible focus, skip link, one H1, ordered H2 section headings, labeled form controls, status announcements, text alternatives to diagrams, and 44px touch targets are required. Interaction works without dragging or swiping.
- At 360px width and at 200% zoom there is no page-level horizontal overflow; wide comparisons become stacked rows. Respect `prefers-reduced-motion`; no smooth scrolling or animated chart transitions in that mode.
- Print invokes `window.print()` on the current document. Print CSS reveals all sections and disclosures regardless of present mode, hides controls, prints textual demo state or an unplayed explanation, and prints all three funding scenarios plus calculator assumptions. Use light paper styles and deliberate page breaks, allow long evidence to continue, and avoid fixed-height clipping. Source URLs print in full. Print never changes on-screen state.
- Answer state remains in memory; refresh/restart clears it. No backend, analytics, network requests, URL parameters, or persistent storage of answers. Only an intentional external source/product/contact link may leave the deck.

## Calculations and honest inputs

### Funding: carry the existing proposal with explicit reserve treatment

| Allocation (USD) | $100K | $150K | $250K |
|---|---:|---:|---:|
| Product reliability and safety | 30,000 | 45,000 | 75,000 |
| Community activation | 25,000 | 35,000 | 55,000 |
| Legal, privacy and operations | 15,000 | 20,000 | 30,000 |
| Analytics and retention evidence | 10,000 | 15,000 | 20,000 |
| Mobile readiness | 10,000 | 15,000 | 25,000 |
| Early monetization tests | 5,000 | 10,000 | 20,000 |
| MENA test market | 0 | 0 | 15,000 |
| Reserve | 5,000 | 10,000 | 10,000 |
| **Total** | **100,000** | **150,000** | **250,000** |
| Planning months | 12 | 15 | 18 |
| Operating budget excluding reserve | 95,000 | 140,000 | 240,000 |
| Derived average monthly operating spend | 7,916.67 | 9,333.33 | 13,333.33 |

`operatingBudget = raise - reserve`; `averageMonthlyOperatingSpend = operatingBudget / plannedMonths`. Display approximately $7.9K/$9.3K/$13.3K, with exact formula in details. These are average planning rates, not measured burn or a cash-flow forecast. Reserve is not included in both burn and runway. Base team: founder full time, part-time engineering, part-time community/moderation. Larger scenarios add coverage; confirm actual compensation, one-time costs and operating costs before investor distribution. Milestones are goals; additional-market spend is conditional on prior gates.

### Beachhead calculator

Inputs: reference population 5,340,000 fixed and dated; join share default 1%; payer share default 4%; annual spend per payer default $24. Percentages allow 0–100 inclusive; spend allows $0–$1,000 inclusive. Step sizes 0.1 percentage point and $1. Show draft input values without snapping while typing. Blank, nonfinite, negative or out-of-range values produce an inline error and suspend calculated outputs until corrected; no stale result, NaN, or Infinity. Do not silently coerce invalid input into zero.

`members = population × joinPct / 100`; `payers = members × payerPct / 100`; `grossAnnualRevenue = payers × annualSpend`. Preserve decimals internally; rounded member/payer counts are display approximations. State that the all-age denominator overstates an eligible initial audience and the result is arithmetic on assumptions, not TAM, ARR, a forecast, or a valuation.

### Demo

Use a new whitelisted aggregate fixture from the inspected current `therawme/index.html`, using the fresh model audit's stricter 24-question allowlist. The legacy 38-question selection includes intimate/distressing items and is superseded for this investor experience. Parse JSON without evaluating the HTML's JavaScript. Snapshot source commit/hash and extraction date. Five answered questions reach the first result; offer optional continuation to 10 and 23 within the curated pool, labeled a demo rather than a validated full assessment. Skip replaces a question and never counts as an answer. Pick the next question by expected entropy from unasked, unskipped items, preserving the current model's 0.05-nat raw-mind theme preference where the selected question belongs to that source theme; use fixture order for deterministic ties. The curated pool changes the policy, so call this an adapted model demo, not the historical validated policy. Update posterior by normalized prior × answer likelihood. When the pool is exhausted, end honestly with the actual answered count. Do not persist answers. Provide explicit result advance, restart and exit controls. Show neutral cluster labels/descriptions unless historical naming interpretations are confirmed. All outputs are “model belief from historical answer patterns.” The simulated 87.9% is not a badge on this experience.

## Scope and completion

Implement a separate `raw-investor-deck/` directory with semantic HTML, CSS, native SVG and plain JavaScript. A standard-library Python builder inlines checked-in aggregate data, local brand assets, font, styles and scripts into `index.html`. The final HTML needs no backend, framework runtime, database, network-loaded asset or external source repository. The build operates on committed presentation inputs; optional data refresh can read the reference repos. Keep V1/V2, the existing 14-chapter deck and production code untouched.

The reviewable result comprises the 24-section document, live/read/print behavior, local demo, transparent calculators, provenance notes, and a short operator guide. Completion requires build success, targeted calculation/model checks, and browser verification of navigation, interactions, printing, mobile and reduced motion. Missing evidence must remain visible. Continue the authorized implementation and testing now; later attachments and factual updates refine the artifact without a repeat approval gate. No public deployment, push or production code change is authorized.

The companion [strategy and evidence plan](../../investor-deck/strategy-evidence-plan.md) defines which product builds and experiments would substantiate the new-wave thesis, potential moat and business model. These are future product work, separate from implementing this presentation.

## Fresh audit integration (17 October 2026)

The [main-app audit](/workspace/research/raW/product-audit.md) establishes implementation evidence for polls, communities, realtime chat, pseudonymous identity, progression, moderation, token purchase requests and tribe-to-room invites. It does not establish production state, active usage or cash revenue. In particular, token requests are a manual approval flow, landing poll percentages are preset presentation content, current community search is text/rule-based, and key community analytics events are declared but not emitted in inspected non-test source. Use these distinctions in sections 11–12/16/19 rather than generic “live” claims.

The [model audit](/workspace/research/raW/model-audit.md) establishes an aggregate 52-question payload, 23-question current cap, historical 27-cap same-corpus evaluation, source/profile disagreements and a safer 24-question presentation subset. Its allowlist is `P04 P21 P25 P31 P35 P36 P93 P95 P96 P06 P03 P53 P58 P91 P116 P97 P87 P68 P78 P94 P66 P73 P18 P118`. It provides no independent matching/retention validity. Preserve Michroma's accompanying SIL OFL notice when embedding the locally available font.
