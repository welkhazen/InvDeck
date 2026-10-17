# raW — evidence status

Prepared 17 October 2026. This appendix separates inspected implementation, historical records, supplied research and future hypotheses. It does not certify a production release. See [research sources](research-sources.md) for provenance and limitations.

## How to read the labels

- **Verified in code:** directly inspected source or an aggregate runtime model value; no implication of deployment or usage.
- **Implemented but unverified in production:** traced implementation exists, but the complete live experience and applied database migrations were not checked.
- **In progress:** a partial integration or measurement gap is identifiable.
- **Planned:** future capability, commercial scenario or outcome hypothesis.
- **Supplied / inherited evidence:** reported in the brief, supplied PDF or earlier research register; underlying external evidence was not independently re-opened in this session.

## Product claims

All app links below point to inspected commit `cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0`.

| Claim | Status | Evidence and boundary |
|---|---|---|
| Poll participation and results | Implemented but unverified in production | [Vote API](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/polls/%5BpollId%5D/vote.ts#L44) authenticates and calls a voting RPC. [Client](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/store/usePolls.ts#L240) handles success, failure and authoritative tallies. Daily limits are implemented; deployment and reliability remain unverified. |
| Communities and group conversations | Implemented but unverified in production | [Room admission](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/communities/join.ts#L50), [message sending](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/hooks/useCommunityChat.ts#L589) and [realtime updates](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/hooks/useCommunityMessagesRealtime.ts#L53) are implemented. No verified room activity or response-rate metric. |
| Avatars and selectable private aliases | Implemented but unverified in production | [Private alias API](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/me/private-alias.ts#L22) and [avatar ownership checks](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/me/avatar-equip.ts#L36). Pseudonymous social presentation does not mean anonymity from the operator or end-to-end encryption. |
| Challenges, XP, streaks and rewards | Implemented but unverified in production | [Progress implementation](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/store/useUserProgress.ts#L55). Incentives are not proof of enduring belonging or reward-independent return. |
| Tokens and premium identity foundation | Implemented but unverified in production | [Token requests](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/token-requests.ts#L100) use catalog packages and a pending approval queue. This is a manual request flow; no revenue or automated cash-settlement evidence. [Native purchase access is disabled](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/components/dashboard/RequestTokensModal.tsx#L24) pending StoreKit. |
| Tribe outcome to room routing | Implemented but unverified in production | [Tribe invite API](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/tribe-invite.ts#L16) mints room invites. [Prepaid test credit](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/tribe/test-credit.ts#L19) connects tokens to an external test. No demonstrated interpersonal compatibility or retention lift. |
| Personalized social discovery | In progress / planned | [Current community search](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/lib/communitySearch.ts#L30) uses phrases and text. Richer answer-based recommendations and their incremental value have not been established. |
| Trust and moderation foundation | Implemented but unverified in production | [Server content rules](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/chat/send.ts#L145), [member reporting](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/chat/report.ts#L28), and [moderator actions](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/api/admin/moderate-user.ts#L39) exist. Staffing, language coverage, false positives, incident response and safety effectiveness remain unmeasured. |
| Acquisition tools | Implemented but unverified in production | [Poll share links](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/lib/pollShare.ts#L26), referrals and Tribe links exist. No verified CAC, invitation conversion or repeatable growth. |
| Analytics infrastructure | Verified in code; collection unverified | [Optional PostHog setup](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/main.tsx#L65) and typed events exist. Poll success/failure calls were traced. `community_joined` and `community_message_sent` were found only as event declarations in non-test app source; declaring an event does not emit it. |
| “The helped become the helpers” | Planned, measurable mission hypothesis | No measured transition from receiving support to helping others, causal impact, clinical benefit or relationship outcome is established. |

**Do not treat preset UI content as evidence.** [Landing results and seed comments](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/src/components/landing/LandingPollsSection.tsx#L17) are hardcoded. A [later migration](https://github.com/welkhazen/wzwznew/blob/cd6d642bdb6ba7b881513d89afb1e8fc79a2b9a0/supabase/migrations/20261008130000_poll_results_live_votes_only.sql#L1) explicitly replaces seeded in-app baselines with live vote counts; it says landing/onboarding render their own numbers. No such percentages or comments establish historical responses, current activity or traction.

## Behavioral model and historical evidence

Model sources were inspected at commit [`793b29be07a2901268da3ee7df0a9f026a93bc64`](https://github.com/welkhazen/therawme/tree/793b29be07a2901268da3ee7df0a9f026a93bc64).

| Item | Evidence status | Required qualification |
|---|---|---|
| Eight named behavioral clusters | Verified in aggregate runtime payload | Flame, Stone, Storm, Tide, Frost, Calm, Dawn, Root. These are data-defined clusters, not independently validated personality types. |
| 1,795 clustered accounts | Documentation-reported historical count | Not a fresh corpus recount, unique-person verification, active-user count or customer count. |
| 1,780 evaluated accounts; 87.9% label recovery | Verified as historical runtime metadata | Same corpus contributed labels, fitting and simulation. No held-out test or independent ground truth. Measured under an earlier 27-question cap; not current 23-question validation, psychometric validity or five-question accuracy. |
| Current maximum 23 answered questions | Verified in code and runtime metadata | A full question cap, not a promise of confidence. The investor demo's curated question pool changes the policy and has no validated recovery score. |
| 33,486 confirmed vote records | Verified aggregate runtime value | The field is misleadingly named `corpus_voters`; records are not people. Not additive to a separate historical audit total. |
| 31 mapped polls; 23,424 newly added answers | Verified runtime bridge metadata | Supersedes stale documentation saying 28 mapped polls / about 21,220 answers. Overlap and coverage must be reconciled before combining datasets. |
| 105 audited poll instances; 95 trusted; 37,302 trusted user-vote records; 10 awaiting review | Supplied historical assertion, unverified | Named workbook, SQLite, CSV and Poll Data Hub audit artifacts were not located in accessible files. No claim that all historical polling is audited. Records are not unique individuals; date and authoritative snapshot remain missing. |

Demo posterior percentages describe model probabilities conditional on answers and the model. They are not independently calibrated confidence, accuracy or percentages of other people. Any aggregate estimated answer share is a smoothed model estimate, not an observed poll denominator. Do not fabricate other participants, comments or responses. Do not expose usernames, account mappings or individual answer histories.

## Human and commercial evidence boundaries

The supplied research supports context and research leads. External primary-page attempts in this session returned HTTP 403. Existing research-register claims and the supplied PDF were read; newer WHO/IHME assertions were not independently validated. No unsupported “94% research confidence” or similar score is adopted.

Loneliness, social isolation and clinical disorders are different constructs. Lebanon's 2022 anxiety/depression/PTSD percentages are **screen-positive results**, not diagnoses, and cannot form a prevalence-growth curve against the 2002–03 diagnostic survey. Social-media associations do not establish a single causal explanation. raW is a social discovery product and does not claim treatment or clinical efficacy.

The business opportunity is participation, communities, identity customization and optional self-discovery. Mental-health spending, clinician scarcity, pharmaceutical sales and therapy-market forecasts do not define raW's TAM. No verified market share, valuation, committed investor, current revenue, conversion, CAC or retention number is available. Expansion is a plan. The $100,000 base raise is provisional; alternative funding amounts, allocations, runway and market calculators are illustrative assumptions until supported by an operating budget and measured inputs.

## Priorities for the raise

1. **Reliability and safety:** verify the deployed signup → answer → room → accepted message journey, migration state, privacy boundaries and moderation response. Collect real failure rates and response times.
2. **Measure activation and return:** emit accepted join/message events; define first reciprocal conversation and meaningful return. Report dated cohorts, sample sizes, denominators and D1/D7/D30 action-based retention, distinguishing rewards from voluntary contribution.
3. **Test discovery value:** record recommendation exposure, join, response and return; compare answer-based routing against a simple room-directory baseline. Historical data becomes defensibility only with lawful access, consent, coverage and demonstrated product improvement.
4. **Test willingness to pay:** reconcile package request, approval, cash settlement, token spend and refunds; separate earned and purchased tokens. Validate native billing before treating mobile purchases as ready.
5. **Prove a distribution wedge:** test community-host invitations and Tribe Test-to-room entry with source attribution and cost per retained participant. Validate Arabic/English localization, moderation, payment access and operations before geographic expansion.

Source audits were read-only; no runtime test or live production database access underlies this appendix. The independent presentation should remain offline and isolated from production.
