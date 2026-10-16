# Evidence status: product claims, data, gaps and open questions

_Compiled 16 October 2026. It covers the claims in `deck.template.html` as the deck now words them. Figures and their external sources are in `research-sources.md`._

## Method

On 16 October 2026 we ran a code-level audit of the two raW repositories: `wzwznew` (the app at myraw.app) and `therawme` (the Tribe Test at theraw.me). Four auditors each covered one area: the model, the product, the business and compliance. A second reviewer then tried to disprove every finding, and a coverage check looked for claims the four had missed. The deck was corrected afterwards. Paths below are relative to the two repositories, except `build.py`, the deck's own build script in this folder.

**"Verified in code" means the code exists and is wired up.** It does not prove that the feature is deployed or used in production. No production database, analytics or deployment was inspected.

## 1. Product claims

### Verified in code

| Claim (as the deck now words it) | Where in the deck | Evidence | Notes |
|---|---|---|---|
| Question, Answer and Talk steps of the core journey | c01 | `wzwznew/src/components/polls/PremiumPollCard.tsx`; `wzwznew/api/chat/send.ts` | Match, Insight and Return are listed under their own statuses below. |
| raW starts with a question, not an image, a face or a follower count | c04 table | `wzwznew/api/auth/signup.ts` (no photo field); no follower feature in `wzwznew/src` or `wzwznew/api` | "Follower" appears only in marketing and pitch copy. |
| raW pairs pseudonymity with accounts, moderation, invite codes and admin-run rooms | c04 table | `wzwznew/api/auth/signup.ts`; `wzwznew/api/admin/moderate-user.ts`; `wzwznew/src/components/dashboard/CommunityRequestDialog.tsx` | New rooms go to admin review. Member-owned rooms are Planned. |
| raW connects people with other people | c04 table | `wzwznew/api/chat/send.ts`; `wzwznew/api/assistant/chat.ts` | The only AI is a help assistant, not a companion. |
| Other members see only your username and avatar: no real name, no photo | c05 step 1; c09 Built | `wzwznew/api/auth/signup.ts`; `wzwznew/src/lib/avatarCatalog.ts` | Scoped to what members see. The invite waitlist and the donation form do ask for a name and contact details. These are not shown to members. |
| Real avatars from the raW app | c05 phone | `wzwznew/public/avatars/landing/`; `build.py` inlines them | |
| Yes/No and this-or-that questions, one answer each | c05 step 2 | `wzwznew/src/components/polls/PremiumPollCard.tsx`; `wzwznew/supabase/migrations/20261001120000_poll_vote_change_answer.sql` | Since 1 October 2026 members can change an answer. It still counts once. |
| See how others answered the moment you vote | c05 step 3 | `wzwznew/src/components/polls/PremiumPollCard.tsx`; `wzwznew/supabase/migrations/20261008130000_poll_results_live_votes_only.sql` | In code, the feed counts live member votes only from the 8 October 2026 migration; its production state is unconfirmed. Onboarding polls show a fixed snapshot that includes Instagram-era votes (`wzwznew/src/components/onboarding/OnboardingJourney.tsx`). |
| Room names Late Night Talks and Is It Just Me? are real | c05 phone | `wzwznew/supabase/migrations/20260601100000_seed_admin_and_communities.sql`; `wzwznew/supabase/migrations/20260623120000_shorten_community_descriptions.sql` | Late Night Talks uses the shipped description. The Is It Just Me? line paraphrases the original seed text. The shipped text now reads "It's never just you." |
| In the app, other members see only the totals | c05 phone; c10 note | `wzwznew/src/components/polls/PremiumPollCard.tsx` | This holds for the interface only. Privacy hardening of vote-read permissions is still pending (see open questions). |
| Post, reply and like under your avatar; moderated | c05 step 5 | `wzwznew/api/chat/send.ts`; `wzwznew/api/chat/like.ts` | The server path is the only way to write messages. |
| Yes/No polls with the split shown after voting (live member votes in the feed since 8 October 2026), one vote per person enforced in the database | c09 Built; c07 "Live split after each vote" | `wzwznew/supabase/migrations/20260525072510_shared_poll_vote_guard.sql`; `wzwznew/supabase/migrations/20260820140000_lock_down_poll_tables.sql`; `wzwznew/src/components/polls/HoverGradientVoteButton.tsx` | Production state of the 8 October live-split migration is unconfirmed. Duplicate rows from a short August 2026 bug window were not cleaned up. |
| Interest communities with realtime group chat, likes and replies | c09 Built | `wzwznew/src/hooks/useCommunityMessagesRealtime.ts`; `wzwznew/api/chat/like.ts`; `wzwznew/api/chat/send.ts` | Pinned messages were removed on 1 July 2026 and are no longer claimed. All chat history was cleared on 2 October 2026. |
| Moderation: message reports, warnings, timeouts, bans and blocked words | c09 Built; c11 Lebanon | `wzwznew/api/chat/report.ts`; `wzwznew/api/admin/moderate-user.ts`; `wzwznew/api/admin/blocked-words.ts`; `wzwznew/supabase/migrations/20260703000000_chat_spam_auto_ban.sql` | Reports are stored. There is no in-app review queue yet (In progress). |
| Self-declared 18+ gate | c11 Lebanon | `wzwznew/supabase/migrations/20260824160000_onboarding_flow_enforcement.sql`; `wzwznew/src/components/onboarding/OnboardingJourney.tsx` | Self-declared, not ID-verified. |
| Avatar ranks, store and tokens, with spending checked on the server | c09 Built | `wzwznew/src/lib/avatarRarity.ts`; `wzwznew/src/components/dashboard/DashboardStore.tsx`; `wzwznew/supabase/migrations/20260829170000_reprice_r12.sql` | |
| Stage 1: a daily set of polls, open rooms and chat are free; extra polls, locked rooms and the in-app Tribe Test cost tokens, which members can also earn | c10 | `wzwznew/supabase/migrations/20261001120000_poll_vote_change_answer.sql`; `wzwznew/src/components/dashboard/DashboardPolls.tsx`; `wzwznew/supabase/migrations/20260924150000_admit_to_room_balance.sql`; `wzwznew/src/lib/tribeCheckout.ts`; `wzwznew/supabase/migrations/20260807135920_trusted_token_mint_and_daily_spin.sql` | Free in money terms. |
| Stage 2: rare avatars and ranks, built and priced in tokens; no in-app checkout for tokens | c10 | `wzwznew/src/components/dashboard/DashboardInventory.tsx`; `wzwznew/supabase/migrations/20260826120000_purchase_avatar_balance_contract.sql`; `wzwznew/supabase/migrations/20260829150000_reprice_rank_tiers.sql` | Tokens can also be requested in dollar-priced packs that an admin grants by hand (see Pricing, In progress). |
| raW will not sell identifiable responses | c10 note | `wzwznew/src/pages/Privacy.tsx` | A policy commitment in the privacy page, not a technical control. |
| Distribution: Instagram story polls that link to the same question in the app; WhatsApp sharing; invite codes | c11 Lebanon | `wzwznew/src/lib/pollShare.ts`; `wzwznew/src/components/polls/PremiumPollCard.tsx`; `wzwznew/src/pages/Index.tsx`; `wzwznew/src/components/landing/SignupModal.tsx` | The links exist in code. Posting the stories is founder practice. |
| Localization: Lebanese English first, with local topics and rooms | c11 Lebanon | `wzwznew/supabase/migrations/20260623120000_shorten_community_descriptions.sql`; `wzwznew/src/components/onboarding/OnboardingJourney.tsx` | English only. There is no translation library. |
| Shareable question pages | c11 International (listed as a plan) | `wzwznew/src/lib/pollShare.ts`; `wzwznew/src/pages/Index.tsx` | Already exists. The deck understates it. |
| Burn assumes existing infrastructure (Vercel, Supabase, PostHog) | c13 | `wzwznew/package.json`; `wzwznew/vercel.json`; `wzwznew/src/main.tsx` | |

### Implemented but unverified

| Claim (as the deck now words it) | Where in the deck | Evidence | Notes |
|---|---|---|---|
| Matching runs through the Tribe Test | c01 | `therawme/index.template.html`; `therawme/build_model.py` | The Match step of the journey. |
| raW is live at myraw.app as a beta | c09 lede | `wzwznew/vercel.json` | Deployment is a production fact that code cannot confirm. |
| Signup needs an invite code, which the public Tribe Test hands out | c09 lede; c05 step 5 | `wzwznew/api/auth/signup.ts`; `wzwznew/supabase/migrations/20260808120000_unique_invite_redemption.sql` | The invite gate can be bypassed via the public Tribe Test flow (see open questions). |
| Tribe rooms opened by single-use invite codes from the Tribe Test | c09 Built; c05 phone ("Tribe room"); c07 "Locked tribe room invite" | `wzwznew/supabase/migrations/20260923120000_tribe_invite_codes.sql`; `wzwznew/supabase/migrations/20260924120000_locked_room_admission.sql`; `therawme/index.template.html` | Not verified in production. |
| Tribe Test: adaptive 23-question engine on theraw.me | c09 Built; c07 "Tribe estimate (Tribe Test)" | `therawme/build_model.py` (fixed length 23); `therawme/index.template.html`; `therawme/README.md` | Not verified in production. Data claims about the model are in section 2. |
| Each tribe has its own room | c04 table | `wzwznew/supabase/migrations/20260828130000_tribe_circle_communities.sql`; `wzwznew/supabase/migrations/20260924180846_relock_tribe_communities_for_invite_gate.sql` | |
| raW is built to route a person to a room from their own answers: today through the Tribe Test invite | c04 table (Reddit and Discord rows) | as for tribe rooms | Answer-based suggestions are Planned. |
| Pick an interest room, or take the Tribe Test to unlock your tribe's locked room | c05 step 4 | `wzwznew/src/components/onboarding/OnboardingJourney.tsx` (static interest list); tribe room evidence above | The interest-room pick is in code. The tribe-room path is unverified in production. |
| Through the Tribe Test, they reach the room of people who answered alike | c12 step 2 | as for tribe rooms | |
| What raW would measure: first-session poll answers, time to first answer | c12 step 1 | `wzwznew/src/store/usePolls.ts`; `wzwznew/src/lib/analytics/events.ts`; `wzwznew/src/main.tsx` | Events are sent only when the analytics key is configured. No figures were read. |
| What raW would measure: second-week return, replies received in the first week | c12 step 3 | `wzwznew/src/lib/analytics/events.ts`; `wzwznew/api/chat/send.ts` (replies are stored) | Derivable. There is no reply event. |
| What raW would measure: share of members who reply to others | c12 step 4 | `wzwznew/api/chat/send.ts` | Derivable from stored replies. |

### In progress

| Claim (as the deck now words it) | Where in the deck | Evidence | Notes |
|---|---|---|---|
| Fuller insights are in progress (Insight step of the journey) | c01 | see opt-in insights below | |
| Return step of the journey | c01; c09 "Return trigger" | `wzwznew/api/notifications/send.ts`; `wzwznew/src/hooks/useNotificationConsent.ts` | No caller of the send function was found. |
| Activation and retention baseline: signup, onboarding and poll-answer events are instrumented; room-join and message events are defined but not yet sent | c09 Being validated | `wzwznew/src/lib/analytics/events.ts`; `wzwznew/src/store/usePolls.ts`; `wzwznew/src/components/onboarding/OnboardingJourney.tsx` | No retention figures are verified. |
| iOS app: Capacitor build and App Store preparation | c09 Being validated; c13 base milestone | `wzwznew/ios/App`; `wzwznew/codemagic.yaml` | Not on the App Store as far as the code shows. |
| Tribe Test to tribe room funnel: link and invite flow built, conversion not yet measured | c09 Being validated | `therawme/index.template.html` (link with campaign parameters) | |
| Pricing: placeholder prices only (token packs $5 to $90 and a $5-a-month plan granted by hand on request; $1 and $2.99 on the Tribe Test site; $12 and $19 on an older reports preview); no payment processor or checkout; a public donation page collects contact details | c09 Being validated | `wzwznew/src/lib/wallet-packages.ts`; `wzwznew/src/components/dashboard/DashboardWallet.tsx`; `wzwznew/src/components/dashboard/RequestTokensModal.tsx`; `therawme/index.template.html`; `wzwznew/src/features/mirrors/TierGate.tsx`; `wzwznew/src/pages/WhyDonate.tsx` | Code cannot show whether any money changed hands outside the app (see open questions). |
| Opt-in personal insights built from your own answers: engine, catalog and preview built; reports not generated and purchases switched off | c09 Next; c10 Stage 4 | `wzwznew/src/features/insights/insights-engine.ts`; `wzwznew/api/users/[userId]/insights.ts`; `wzwznew/src/components/dashboard/PersonalityInsightsInventory.tsx`; `wzwznew/supabase/migrations/20261008120000_personality_tests.sql` | Nothing is sold. |
| Stage 3: locked tribe rooms are built and can charge tokens on entry; member-run rooms and cash payment are not built | c10 | `wzwznew/supabase/migrations/20260924120000_locked_room_admission.sql`; `wzwznew/supabase/migrations/20260924150000_admit_to_room_balance.sql`; `wzwznew/src/components/dashboard/CommunityRequestDialog.tsx` | Labeled a revenue hypothesis in the deck. |
| Stage 1 Lebanon is under way | c11 | all Lebanon rows in this file | Only stage one carries this status. |
| Reports are stored for review; an in-app review queue is not built yet | c11 Lebanon | `wzwznew/api/chat/report.ts` | |
| What raW would measure: poll answer to room action within 24 hours (north-star candidate) | c12 step 2; c13 base milestone | `wzwznew/src/lib/analytics/events.ts` | The room-action events are defined but not sent. |

### Planned

| Claim (as the deck now words it) | Where in the deck | Evidence | Notes |
|---|---|---|---|
| Member-owned rooms | c04 table; c13 $150K and $250K | none in code | Rooms are admin-run today. |
| Answer-based room suggestions; community recommendations from answer patterns | c04 table; c07; c09 Next | none in `wzwznew/src`; onboarding list is static | |
| Insight report in the app | c07 | see opt-in insights (In progress) | The Tribe Test already shows a tribe report on theraw.me. Its payment is a placeholder. |
| People you would relate to | c07 | none in code | |
| The four signals (interests, perspectives, common ground, community fit) are categories, not computed scores | c07 | `therawme/build_model.py` computes only the tribe estimate | The deck draws these edges as planned, except community fit. |
| Real checkout for premium identity and private rooms | c09 Next; c13 base milestone | no payment SDK in either repo; `wzwznew/src/features/mirrors/TierGate.tsx` buttons are inert | |
| Arabic language and right-to-left interface; Arabic onboarding | c09 Next; c11 Lebanon and MENA; c13 $150K and $250K | no Arabic strings or right-to-left code in `wzwznew` | |
| Android release | c09 Next; c13 $150K and $250K | `@capacitor/android` in `wzwznew/package.json`, no Android project folder | |
| University communities as a distribution channel | c11 Lebanon | none | |
| Stages 2 to 4: MENA, International, Global | c11 | none | Gated by evidence from the stage before. |
| What raW would measure: newcomer second-week return when welcomed by a member versus not | c12 step 5 | no definition of "welcomed" in `wzwznew/src/lib/analytics/events.ts` | A comparison, not proof of cause. |
| The flywheel as a whole | c12 | none | The mission and a product hypothesis, not a measured outcome. |
| Base milestones: two-week funnel baseline, week-four retention across three monthly cohorts, weekly moderation metrics, legal and privacy review including data rights | c13 | none | Labeled as goals, not commitments. |
| $150K additions: Android, rooms run by member owners, Arabic onboarding and question set. $250K adds a full-time engineer, a second monetization test and a MENA test market only if Lebanon meets its expansion gate | c13 | none | |
| A feedback loop in which new answers improve the questions and rooms | c08 note | `therawme/build_model.py` reads only historical extraction files | The deck says this loop is not built yet. |

## 2. Data claims

| Figure in the deck | Where | Status | Source | Notes |
|---|---|---|---|---|
| "Social media: good, or bad?": 144 of 234 labeled answerers chose Bad (62%) | c04 | Verified (code) | Tribe Test model, question P94 (`therawme/index.html`, `therawme/build_model.py`) | Recovered by inverting the model's Laplace smoothing on the eight per-tribe values. With tribe sizes fixed, this is the only solution. raW's own audience, not a representative survey. The deck used to show the model's smoothed lean (≈65%). |
| Trust or respect?: 953 tribe-labeled historical answers; 68% / 32% split | c05 phone | Verified (code) | Model question P31; `build.py` | The split is the model's estimate, and the deck labels it so. The question is a Mirrors quiz item in the app, not a feed poll. |
| "Community lean" in the demo feedback | c06 | Verified (code) | `build.py` | Share-weighted, smoothed model estimate, labeled as such. |
| 8 tribes; 1,795 voters (Instagram accounts) with at least eight answers | c06; c08 Tribes | Verified (code) for 1,795; Documented, not re-run for the fit | Tribe shares in the shipped model; `therawme/EXPLAINER.md` | 1,795 is the only count that reproduces all eight shipped shares exactly. Accounts, not verified distinct people. |
| k-modes, best of 12 restarts, no tribe under 3%, on the 30 August 2026 corpus, then refit | c08 Tribes | Documented, not re-run | `therawme/EXPLAINER.md`; `therawme/README.md` | The restart and refit code is not in the repository. |
| Five-tribe fit 92.0% vs eight-tribe 89.0%, 30 August 2026 | c08 Tribes | Internal simulation (documented, not re-run) | `therawme/EXPLAINER.md` | Eight ships by product choice. |
| 87.9% recovery on 1,780 voters; average 11.5 questions; 27-question cap | c06; c08 Tribe Test | Internal simulation | Shipped model fields; `therawme/build_model.py` | Labels and training share one corpus. The replay asks every recorded answer, so it tests classification, not question order. The shipped test asks 23. See open questions. |
| Uniform chance 12.5%; always guessing the largest tribe about 28% | c06; c08 Tribe Test | Verified (code) | 1 in 8; largest shipped tribe share 27.6% | |
| Demo pool of 38 everyday questions; checkpoints at 5, 10 and 23 | c06 | Verified (code) | `build.py` (demo pool); `therawme/build_model.py` (fixed length 23) | The 87.9% does not transfer to the demo. |
| 52 of the 122 quiz questions have enough labeled answers | c08 Tribe Test | Verified (code) | Shipped model | |
| ~11K followers; up to ~3,000 votes on one question | c08 Story polls | Founder-reported | `wzwznew/src/pages/PitchV2.tsx` | |
| 33,486 confirmed votes in the extraction set | c08 Extraction | Verified (code) | Shipped model field; `therawme/build_model.py` | Vote records, not people. The original extraction code was not available. |
| 105 poll instances, 95 trusted, 10 awaiting review, 37,302 trusted user-vote records | c08 Audit | Founder-reported | Founder brief | The audit source files were not available. |
| 23,424 answers bridged across 31 polls (25,168 master votes considered) | c08 Bridge | Verified (code) | Bridge note in the shipped model; `therawme/build_model.py` | Matching uses agreement where evidence exists and wording where it does not. Two polls were matched by hand. The `therawme` README still shows older counts. |
| Calculator: 1% join, 4% pay, $24 a year give 53,400 members, 2,136 paying, $51,264 a year | c10 | Assumption | Deck script | The arithmetic was recomputed and is correct. The base of 5.34 million internet users (early 2025, all ages) is an external figure tracked in `research-sources.md`. |
| Funding scenarios: $100K / $150K / $250K; about 12 / 15 / 18 months; burn about $7.9K / $9.3K / $13.3K a month | c13 | Assumption | Deck script (`FUND`) | Allocations sum to each raise. Runway is (raise minus reserve) divided by burn. Planning assumptions for discussion. |

## 3. Corrections made after the audit

| Chapter | The deck used to say | It now says |
|---|---|---|
| Page description | "find people you relate to, start talking" | "see how others answered, and find a room to talk" |
| c01 | Match and Insight shown with no status | A line says matching runs through the Tribe Test (implemented but unverified) and fuller insights are in progress |
| c02 | 871,000 deaths with no period; "access to each other is no longer the gap" | Period 2014–2019; "for most people, access is no longer the gap" |
| c03 | Lebanon's January 2022 youth unemployment survey and DataReportal's early 2025 internet figure on the same scale as ILO and ITU estimates; "same source and method" | The Lebanon cards show "No comparable figure": youth unemployment points to the panel above, and internet use names DataReportal's different method. The method caveats are spelled out. A line says raW is not a mental-health service |
| c04 | "≈65%, about two in three of 234 labeled answerers leaned Bad" (model estimate) | "62%, 144 of 234 labeled answerers chose Bad", recovered from the model's counts |
| c04 | Reddit "proves"; "raW routes a person to a room from their own answers"; "rooms that have owners"; Yubo and Wizz both monetized; "each tribe opens a room" | "Shows"; "built to route … today through the Tribe Test invite"; "admin-run rooms, with member-owned rooms planned"; monetization attributed to Yubo only; "has its own room (implemented but unverified)" |
| c05 | "No real name, no photo"; "see the live split"; "rooms where people who think alike are already talking"; "invite-only for now" | Scoped to what other members see; "see how others answered"; "pick an interest room, or take the Tribe Test"; "signup needs an invite code for now" |
| c05 phone | "Today's question"; "953 labeled answers in raW's history"; "Nobody sees your answer, only the totals"; "Rooms for you" with an unshipped "I'm Bored" room | "A raW question"; "953 tribe-labeled historical answers"; "In the app, other members see only the totals"; "Rooms" with shipped room names |
| c06 | "1,795 people"; "chance is 12.5%"; "Full reading"; "How the data describes" the tribe | "1,795 voters (Instagram accounts)"; uniform chance plus about 28% for the largest tribe, and the 27-question cap; "Demo reading"; "How raW describes" the tribe |
| c07 | "Observed today" and "Shipped or measured" for the Tribe Test and tribe invite; signals drawn as computed | "Built today" and "Verified in code or implemented but unverified"; a note says the signals are categories, not computed scores |
| c08 | Usernames in "one private file that never leaves the founder's machine"; the two-frame OCR rule, the 90% bridge rule and best-of-12 clustering all under "Verified in code"; "ships today"; "stable clusters"; a moat stated as fact | "Private files on the founder's computer"; the OCR rule is attributed to the current pipeline; the bridge rule is described in full; the Tribes step is "Documented, not re-run" and 92.0% vs 89.0% is marked as simulation; "built into the Tribe Test … live use not yet verified"; tribe centres held steady but boundary voters moved; the feedback loop is "not built yet" |
| c09 | "Invite-only beta"; "pinned messages"; "Built, not verified in production"; "events are defined and instrumented"; "$1, $2.99 and $3.99 appear as placeholders. Nobody is charged today"; insights Planned | Signup needs an invite code, which the public Tribe Test hands out; pinned messages removed; "Implemented but unverified"; only some events are sent; the full list of placeholder prices, no processor or checkout, and the donation page disclosed; insights In progress |
| c10 | Tags "Live, free", "Built, no checkout", "Revenue hypothesis" and "Planned"; "polls, rooms and chat stay free"; "buying tokens with money is not live"; "answers are shown to others only as totals"; an undated 5.34M | Tags Verified in code, Verified in code, In progress and In progress; token costs disclosed; "no in-app checkout for tokens"; "in the app"; dated and scoped to all ages |
| c11 | Arabic onboarding copy under the in-progress Lebanon stage; "human review of reports"; stages 2–4 tagged "Plan" | Arabic onboarding is planned; reports are stored and the review queue is not built; the 18+ gate is self-declared; stages 2–4 tagged "Planned" |
| c12 | "What raW measures"; "they enter the room where people who answered alike are talking" | "What raW would measure"; "through the Tribe Test"; the step 5 comparison is not proof of cause |
| c13 | "It buys the evidence"; "Founder assumptions"; "Measurable milestones"; an unconditional MENA test market | "Funds the work to measure"; "Planning assumptions for discussion"; "Target milestones (goals, not commitments)"; MENA only if Lebanon meets its gate |
| Sources | "Checked against the publisher"; a broken WHO link; this file did not exist | "Checked through search results and press coverage; source pages were not opened directly"; the WHO link corrected; this file added |

## 4. Missing evidence

| Gap | Why it matters | What would close it |
|---|---|---|
| Retention | No cohort retention figure exists for this deck. | The two-week baseline and the week-four cohort report (c13 milestones). |
| Activation | Room-join and message events are defined but not sent, so the north-star candidate cannot be computed. | Send the room events and publish the funnel baseline. |
| Acquisition cost (CAC) | Never measured. | Small tracked acquisition tests. |
| Conversion | Neither app-to-paying nor Tribe Test-to-room conversion has been measured. | The first real-checkout test and funnel tracking. |
| Revenue | No revenue figure is shown, and code cannot show whether money was received outside the app. | Founder confirmation (see open questions). |
| Production verification of the Tribe Test and tribe rooms | The code exists, but live use was not checked. | A production check of the test, the invite flow and the room entry. |
| Poll audit source files | The 105 / 95 / 10 / 37,302 audit figures cannot be checked. | Share the poll source-of-truth files and the Poll Data Hub. |
| Original OCR extraction code | The 33,486 votes and the training data come from an extraction whose code is not in the repository. | Add the original extraction code, or re-run the current pipeline on the same recordings. |
| Tribe restart and refit code | Best-of-12 k-modes and the refit to 1,795 voters are documented but cannot be re-run. | Commit the fitting code and re-run it. |
| Data rights for Instagram poll answers | The historical answers already ship in the Tribe Test and the demo. | The legal and privacy review in the base milestones. |
| External link click-tests | No source page was opened from the build environment. | Click every link in the Sources appendix once before sending. |

## 5. Open questions for the founder

1. **Money received.** Has any money been received through manually granted token packs or through the donation page? If so, the deck should state the amount. Until this is answered, the deck makes no claim either way.
2. **Live split in production.** Is the 8 October 2026 live-split migration applied in production? Until then, the feed split cannot be called live in production.
3. **Privacy hardening of vote-read permissions.** This needs to ship and be verified before stronger wording such as "nobody sees your answer" can return. Until then, the deck says only that other members see totals in the app.
4. **Invite gate.** The invite gate can be bypassed via the public Tribe Test flow. Decide whether to close it or to describe signup as open through the Tribe Test.
5. **Tribe copy in therawme.** The Storm's "Not religious" contradicts the model. The Calm's "strongest single answer" is false. `build.py` strips both clauses for now. Fix the source descriptions, then rebuild.
6. **87.9% measurement.** It was measured at a 27-question cap, while the shipped test asks 23. Re-run the measurement on the current 23-question build and update the figure.
7. **Cumulative Mind data.** Confirm the right to publish data derived from The Cumulative Mind's Instagram polls, including in this deck, the Tribe Test and the demo.
