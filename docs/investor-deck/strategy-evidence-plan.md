# raW: what must be built and demonstrated to defend the investment thesis

**Working strategy, 17 October 2026.** The user has authorized the presentation's audit, plan, implementation and testing. The product experiments below are recommendations for the funding roadmap, not authorization to alter production and not achievements already established.

raW can credibly claim a distinctive starting point: historical questions, an implemented behavioral-cluster model, and implemented social product surfaces. Its strongest potential advantage is a community that repeatedly turns answers into useful human conversations. The current evidence does not yet demonstrate that advantage, product-market fit or a commercially viable acquisition loop.

## Evidence actually available

- Fresh read-only [product audit](/workspace/research/raW/product-audit.md), `welkhazen/wzwznew@cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0`. Real poll, community, chat, identity, rewards, moderation, invitation, token-request and analytics implementations exist. Their deployment, usage, retention and cash settlement were not verified.
- Fresh [model audit](/workspace/research/raW/model-audit.md), `welkhazen/therawme@793b29be07a2901268da3ee7df0a9f026a93bc64`. Eight clusters and 52 aggregate model questions are inspectable. 1,795 is a documentation-reported account count, not verified unique people or app users. 87.9% is historical same-corpus label recovery across 1,780 evaluated accounts under a previous 27-question cap, with no independent holdout; it is not a guaranteed floor or a current 23/five-question performance result.
- Supplied 25-page **The Rise of Anxiety and Mental-Health Need: Global and Lebanon Investor Research**, extracted at `/workspace/research/raW/anxiety-lebanon-investor-research.txt`, and existing `next-social-wave/research-sources.md`. They are source leads and supplied research, not fresh independent primary verification.
- Primary checks against WHO, IHME, Frontiers and Reddit were blocked by the session's proxy with CONNECT 403; see `/workspace/research/raW/network-source-checks.json`. A blocked request neither verifies nor disproves a claim. Preserve working URLs and mark direct verification pending. The PDF's “94% confidence” is not a reproducible statistical estimate and should not appear in the deck.
- Historical audit workbook/database/dashboard, live cohort export, verified cash ledger, founder biography, customer research, and promised visual decks remain unavailable. Do not manufacture substitutes.

## Use the research where it is relevant

| Candidate evidence | Appropriate role in raW's story | Limit and disposition |
|---|---|---|
| WHO Commission on Social Connection, approximately 1 in 6 global loneliness, pooled 2014–2023 | Primary candidate for the scale of unmet social need; one fact rather than many distress statistics. | Existing source register reports secondary verification. Link primary source, preserve period/definition, mark current direct check blocked. Does not establish raW demand or clinical efficacy. |
| Frontiers 2025 report of July–September 2022 Lebanon survey: 45.3% probable anxiety, 47.8% probable depression, 43.5% probable PTSD | Optional Lebanon context showing strain around the proposed initial community. | Screening, not diagnoses; pre-2024-war fieldwork; no trend against the unlike 2002–03 diagnostic survey. Use at most one compact panel after source review. |
| UNICEF January 2025 caregiver reports of child distress | Deeper contextual source, not target-market sizing. | Children are not the proposed 18+ audience; caregiver symptoms are not clinical diagnoses. Avoid using child distress to imply an adult product market. |
| PDF's 2026 WHO/IHME updated global disorder totals and Lifeline +55% call-volume comparison | Diligence leads for more recent context if original pages can be checked. | Publication date versus measurement year; call volume is service use, not prevalence; all currently supplied-summary claims. Do not crowd the main narrative with unverified novelty. |
| Lebanon internet access and payment account ownership | Distribution/payment constraints; dated context for explicitly illustrative arithmetic. | All-age internet users are not eligible audience or willing payers. Bank-account ownership is not a direct estimate of app-store payment access. |
| PDF's mental-health apps, telepsychiatry, clinical software CAGRs, care-capacity estimates and clinical financing totals | Keep in research notes only unless used to explain a clearly relevant constraint. | These define clinical businesses, not raW's TAM. Do not sum overlapping segments or transfer stepped-care business models to social discovery. |

The supplied report's conclusion favors clinician-capacity/stepped-care services. raW is a different business. Its answer is human social connection with commercial identity/community possibilities, not replacing clinicians. Distress prevalence cannot be multiplied by a subscription price to create raW's market.

## The argument that needs proof

**Social need → people choose raW → answers help a conversation start → the conversation makes return worthwhile → returning members contribute → some users pay for optional value → the system improves without proportionate operating cost.** Each transition requires its own observation. “The next social wave” is a coherent vision; it becomes a defensible investment thesis when these links are measured.

| Investment question | Source-backed foundation today | Specific build or operational work | Evidence that would change an investor's view |
|---|---|---|---|
| Does the entry mechanism work reliably? | Authenticated vote APIs, community join, realtime chat and tribe-room invitation code. | Validate a deployed end-to-end signup → avatar → accepted answer → room admission → accepted message journey; reconcile seeded versus live poll counts; monitor failures. | Reconciled funnel with source, dates, eligible denominator, failure rates and time to first reciprocal conversation. |
| Do people return for people? | Chat/reward implementations; typed analytics. | Emit accepted community join/send events; distinguish opening a page, claiming rewards and meaningful conversation; add reply linkage and first-response latency without exporting message contents. | Cohort D7/week-four meaningful return, contributors and two-way conversations; retained behavior after incentives/founder prompting diminish. |
| Does answer-based routing outperform simpler discovery? | Real cluster likelihoods and tribe invite routing; current room search is phrase/text rules. | Instrument routing exposure and accepted join; compare answer/tribe routing with an interest-room directory among similarly available rooms. Version the policy and record exposure before outcomes. | Incremental reciprocal conversation and later return versus baseline with sample sizes and uncertainty; safety and room-load guardrails. Quiz completion alone is insufficient. |
| Does the community sustain itself? | Invite/share/referral code, no measured repeatable distribution. | Attribute invitations; record member welcomes, response supply and founder-seeded activity; give room stewards clear tools/expectations after role validation. | Multiple cohorts/rooms sustain replies without founder rescue; retained invitees and acquisition cost remain acceptable when founder attention is included. |
| Will optional value generate cash? | Avatar ownership, token economy, manual package requests and cross-site test credits. | Reconcile cash settlement, token fulfillment, refunds and earned versus purchased tokens. Test cosmetics first; private-room benefits only with dependable room supply. Add proper payment/IAP integration for channels actually tested. | Verified cash transactions, payer conversion, repeat purchase, refunds and positive contribution after transaction/support/moderation cost; manual requests are not revenue. |
| Can learning compound defensibly? | Historical aggregate dataset and source code. | Resolve data rights/consent, version question/routing policies, collect consented downstream outcomes and evaluate on later or held-out cohorts. Track question coverage and bias; avoid inferring clinical traits. | Improvement over a simple baseline attributable to proprietary outcome feedback, reproducible in a later cohort, with retained users and operational efficiency. More answers alone are not proof. |

### A practical measurement contract

Start with a two-week instrumentation/quality baseline; its purpose is to validate event coverage, not to declare retention success. Existing `src/lib/analytics/events.ts` contains community event declarations, but the fresh audit found no non-test emissions for `community_joined`/`community_message_sent`. Poll success/failure emission exists. Do not say analytics are absent; complete and reconcile the relevant path.

Proposed definitions, fixed before comparing cohorts:

- **Answer-to-room activation:** share of newly enrolled eligible accounts with a first accepted answer that make an accepted room action within 24 hours. Report joins and sent messages separately so a join does not masquerade as a conversation.
- **Reciprocal conversation:** account sends a message and receives a reply from another non-staff account in the same room within a declared 24-hour window. Validate reply attribution; do not count bot/system messages as human replies. Keep staff-assisted and unassisted results separate.
- **Week-four meaningful return:** share of an enrolled/activated cohort completing the chosen accepted conversation action on days 22–28 after the defined start. Show enrolled and activated denominators; include only cohorts old enough to observe the window.
- **Contribution:** share of active non-staff members responding to another member, plus newcomers welcomed by existing members. Association between welcome and return is not automatically causal.
- **Safety and operating cost:** report/incident count with exposure denominator, response-time distribution and staffed coverage, appeal/error indicators, and moderator/support minutes per active member or conversation. More reports may reflect better reporting, so do not interpret the rate alone as safety.

No invented performance targets. After the baseline, set a minimum meaningful effect and feasible sample size before the routing test; report intervals and room/cohort variation. Account for network spillovers, founder moderation and room availability—randomizing routing into differently staffed rooms is not a clean matching test. A practical first comparison can use balanced cohorts/rooms and transparent limitations; successful results should be repeated in a later cohort.

## Business model: test value in the order it can be delivered

1. **Premium identity/cosmetics.** Closest to an existing implemented value exchange. Show an optional offer, a genuine price, actual fulfillment and refund path. Test prices sequentially or with a predefined experiment; do not invent willingness-to-pay figures. Track whether purchasers return without further rewards.
2. **Private/hosted community value.** Charge only for a clear, reliable optional benefit—access, hosting capability or enhanced room tools—with active supply. A room price field and token admission are implementation evidence, not recurring revenue. Measure host/member retention and moderation workload.
3. **Opt-in reflective insights.** Later and conditional: useful explanations based on actual answers, clear limits, consent, and user comprehension. Source `src/features/insights/insights.config.ts` contains preset scoring/“confidence” copy and example poll mappings; do not promote those scores as validated insight quality. Avoid clinical or sensitive trait inferences.

The brief rules out monetizing identifiable private responses. Keep core safety/reporting available regardless of payment. Do not assume employers, NGOs, insurers or a clinical reimbursement model simply because the supplied research recommends those channels for health services.

**Required unit-economics view:** gross collected cash → refunds/chargebacks → payment/store fees and applicable taxes → net receipts → variable hosting, support, moderation and fulfillment cost → contribution. Separate variable contribution from fixed product/team burn. Acquisition cost includes paid spend plus a separately disclosed founder/community-labor estimate; compare cost per activated and retained member, not cost per signup alone. Use observed repeat payments before deriving lifetime value; no speculative LTV/CAC headline.

## What could become the moat—and what would weaken it

- **Community density and social relationships:** hard to copy if people return for each other. Weakened by empty rooms, staff-only replies, incentive farming or one charismatic founder doing all the work.
- **Consented outcome-linked learning:** answer patterns plus downstream conversation quality could improve routing. Weakened if a topic-directory baseline performs equally well, if data rights are unclear, or if the signal does not generalize beyond the historical audience.
- **Repeatable distribution and localized trust:** productive invite networks, room stewards and operational knowledge may lower acquisition and moderation cost. Weakened by paid registrations that do not activate, unstaffed expansion, or inconsistent safety.
- **Identity investment:** avatars, reputation and contribution history could increase value with participation. Weakened if monetization displaces conversation or switching costs depend on withholding user data.

Use “potential compounding advantage” until observed. The model can be copied; a demonstrated, improving network of returning people is the stronger claim. Eight clusters are a design choice, not an uncopiable scientific discovery.

## Funded sequence and decision gates

| Proposed stage | Work | Gate and investment interpretation |
|---|---|---|
| First 2 weeks | Validate deployed funnel, events, count provenance, consent and safety operations; recruit a bounded cohort through known channels. | Trustworthy baseline and operational readiness; no scale declaration. |
| Weeks 3–8 | Improve first reciprocal conversation; run room/answer-routing comparison; track cohort maturity and staff assistance. | Evidence of relevant conversation and manageable safety work before broader acquisition. |
| Months 2–4 | Observe at least three monthly cohorts as they mature; test welcome/contribution and lower founder-seeding dependence. | Repeated meaningful return; revise product/channel if gains rely on novelty or rewards. |
| Months 4–9 | Test one real cosmetic/payment offer, then a second optional value proposition if justified; reconcile cash and contribution. | Willingness to pay plus acceptable fulfillment/moderation cost, not merely pricing clicks. |
| By month 12 and larger scenarios | Assess mobile/localization readiness, owner-led rooms and a bounded second market where funded. | Expansion requires retained conversation, safety coverage, payment viability and credible unit economics; extra funding buys experiments, not guaranteed scale. |

Timing is a planning sequence, not a forecast. $100K's proposed $95K operating envelope plus $5K reserve funds proof work. $150K/$250K add capacity and optional breadth as defined in the deck; do not promise every experiment or app-store approval within those budgets without staffing/cost validation.

## Investor objections and accountable answers

| Objection | Honest answer and next evidence |
|---|---|
| “This is another personality quiz.” | The quiz is an entry mechanism; the business depends on conversation and return. Show the routing baseline comparison and reciprocal-conversation cohorts. |
| “Discord or Reddit can build this.” | They can copy features. raW must earn an advantage in community density, outcome-linked learning and distribution; no monopoly claim today. |
| “Your 87.9% proves little about matching.” | Correct: same-corpus label recovery is not interpersonal fit. Keep it methodological; evaluate actual conversation outcomes independently. |
| “Where is traction?” | No verified cohort/revenue export is available. Show source-backed implementation and the funded measurement plan, without relabeling poll records as users. |
| “Lebanon need does not mean ability to pay.” | Correct. Use it as a close learning environment; test actual payment access and optional value, and gate geographic expansion on local evidence. |
| “Pseudonymity creates moderation costs.” | Code contains controls, but effective operations and cost are unproven. Measure incident handling and variable cost alongside growth. |
| “Is the data yours to use?” | Historical rights/consent require documented review. Export aggregates only; prospective learning needs clear consent and deletion/retention rules. |

## Translation into the deck

Keep research sparse in sections 02–03; show the answer/conversation experience in 05–08; distinguish implementation and missing metrics in 10–12; translate experiments into 13–14; explain the optional-value model and illustrative economics in 16–17; show the conditional moat in 18; make safety/cost and staffing concrete in 19–20; tie the ask and expansion gates to evidence in 21–22. Close with a bounded investment case, not a claim that a crisis guarantees a business.
