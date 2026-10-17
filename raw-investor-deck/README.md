# raW — One honest answer

An independent, portable 24-chapter pre-seed presentation. The default is a self-guided reading document; **Present** displays one chapter at a time. The base proposal is $100,000, with selectable $150,000 and $250,000 scenarios.

## Open, present and print

Open `index.html` in a modern browser. Everything required to render and interact is embedded: styles, scripts, aggregate data, images and Michroma font with its full OFL license. The browser needs no account, backend, API, network-loaded asset or reference repository. Browser policies in this cloud environment block `file://` automation, so automated verification uses HTTP with every non-document request blocked.

For a local development session:

```sh
cd /workspace/InvDeck
python3 -m http.server 8010 --directory raw-investor-deck
```

- **Read:** ordinary scrolling through all 24 sections. Chapters provides direct links; hashes and browser Back/Forward work.
- **Present:** arrow keys, PageUp/PageDown, Home and End navigate when focus is outside controls. Buttons, links, inputs and disclosures retain native keys. Escape closes the menu first, then exits presentation. Next/previous buttons also work by touch.
- **Fullscreen:** optional; browser denial leaves the deck usable.
- **Demo:** select an answer, then explicitly advance. Five answered questions reaches the first pattern; continue with the same history to 10 or up to 23. Skip does not count as an answer. Pool exhaustion reports the actual count. Finish early and Restart are available. Answer sides change display order while keeping their semantic likelihood mapping.
- **Privacy:** answers exist only in memory. Restart or refresh clears them; nothing is transmitted, persisted in storage or written into the URL. The printed summary includes answer count and model probabilities, without answer content.
- **Funding:** scenario controls update allocation, reserve treatment, team assumptions, milestones and expansion context together.
- **Market arithmetic:** draft values remain editable. Invalid/blank/out-of-range values suspend outputs instead of leaving a stale result. Zero is valid. Reset restores 1%, 4% and $24.
- **Print / PDF:** prints the current document with all 24 chapters, all disclosures, all three funding scenarios, complete interaction branches, source URLs and font license. Screen mode, chapter, answers and disclosure state are restored. Use the browser’s PDF save option. Pagination depends on browser/paper settings; the supplied A4 verification PDF includes the complete diligence appendix.

## Meeting routes

A 25–30-minute founder-led route uses chapters **01–08, 11–14, 16, 19–21, 23–24**, including a short five-answer demo and discussion. Other chapters remain available for diligence.

For about 15 minutes use **01 → 03 → 05 → 06 → 07 → 11 → 12 → 13 → 16 → 19 → 21 → 23 → 24**. Limit the demo to 90 seconds or finish early. The complete rendered narrative and interaction branches are in `presentation-copy.md`; evidence registers remain in `evidence-status.md` and `research-sources.md`.

## Build and verify

Python standard library only; no dependency installation or main-app build is required.

```sh
python3 raw-investor-deck/build.py
python3 raw-investor-deck/build.py --check
node raw-investor-deck/check.cjs
```

The build reads only this directory. It safely embeds JSON, validates required question identities/probabilities/funding, inlines authorized assets and source/license registers, and fails on unresolved placeholders. Unchanged inputs produce byte-identical HTML. `--check` does not edit files.

The browser suite uses existing Playwright from the environment’s `NODE_PATH` and `/usr/bin/chromium`. Start the HTTP server above first. Set `DECK_URL` to override its URL. Groups can run independently with `--case fixture|math|model|navigation|demo|content|explorers|delivery`. Failures preserve a nonzero exit status. Screenshots, A4 PDF and supplementary inspection output are written to `/tmp/InvDeck-investor-check`.

Optional aggregate refresh:

```sh
python3 raw-investor-deck/prepare_data.py \
  --model /absolute/path/to/therawme/index.html
```

This parses only JSON after `const M = `, never executes source JavaScript or opens raw votes, and explicitly exports the reviewed question/prior fields. It requires the same eight cluster identities and all 24 reviewed question IDs; a missing ID fails with its name. Refresh does not automatically validate new evaluation metadata or consent: review source changes and update the pinned fixture digest in checks only after auditing them.

## Evidence and limitations

- Main app source snapshot **cd6d642** and model **793b29b**, audited 17 October 2026. Source implementation does not establish deployed operation, current users, active rooms, retention, reliable messaging, moderation effectiveness or cash revenue.
- The model fixture exactly matches the independently prepared aggregate export: **8 clusters, 24 questions, 192 likelihoods**, source theme bonus **0.05 nats** for 11 reviewed IDs. Full canonical fixture SHA-256: `d5c08a7071bf500fef1acdceb9563387cc4fdbeed7e70a345f3111422e61f542`. No account identifiers, answer histories or source tribe descriptions are copied.
- The historical **87.9%** is same-corpus recovery of data-defined labels from an earlier 27-question simulation. It is not held-out accuracy, current 23-question validation, social matching quality, five-answer performance or psychological validity. The curated demo has no validated accuracy.
- Production metrics are **Not yet verified**, rather than zero or a forecast. Manual token requests and approvals are implemented; automated cash checkout/native IAP and settled revenue are not established.
- WHO loneliness and internet population references come from the historical source register. New Lebanon screening context comes from supplied research. Direct publisher checks were blocked by the environment; none are upgraded to fresh primary verification. Screening is not diagnosis, clinical-market totals are excluded, and no invented comparable MENA number is shown.
- Initial audience, distribution access, costs, team coverage, milestones, paid offers, defensibility and expansion are proposals/assumptions. Founder biography, commitment, actual compensation, data rights/consent, direct-source checks and production evidence remain to confirm. No partner, testimonial, activity, traction or revenue is fabricated.
- `info@myraw.app` and `myraw.app` are supplied contact references to confirm before investor circulation. Product illustrations and example messages are labeled; avatars are art, not real member portraits.

## Asset provenance and licensing

Authorized raW assets copied from `welkhazen/wzwznew@cd6d642`:

| Local asset | Source |
| --- | --- |
| `raw-logo-192.png` | `public/raw-logo-192.png` |
| `neon-lynx.webp`, `blue-signal.webp`, `viozen.webp`, `pink-circuit.webp`, `solar-flame.webp`, `violet-mask.webp`, `blu-fifer.webp` | `public/avatars/landing/` |
| `michroma-latin-400-normal.woff2`, `OFL.txt` | `video/public/fonts/` |

The hero uses five authentic avatar artworks; the remaining two are retained presentation assets. Product assets are proprietary raW material used for this user-authorized investor artifact; this does not grant general redistribution rights. Michroma is licensed under SIL OFL 1.1. The full supplied copyright and license notice is both retained in `assets/OFL.txt` and embedded in the standalone HTML’s source appendix. Body text uses system sans; warm serif moments use Georgia/system serif. No unlicensed remote font or third-party image was added.

## Verification record

On 17 October 2026 the complete `check.cjs` run passed all eight groups: fixture, math, model, navigation, demo, content, explorers and delivery. Checks cover independent Bayesian math, source-theme selection, exact fixture digest, missing-ID rejection, exact funding/reserves, invalid/zero market values, all checkpoints/skips/reset, hash/history/menu/focus guards, shared scenario state, all four expansion stages, no outgoing runtime requests, 360px/768px/1440px widths, 200% CSS zoom reflow, reduced motion, denied fullscreen, all 24 print chapters, three printed scenarios and restored screen/disclosure state. The deterministic build and `--check` passed. A deliberate incorrect prior-only model failed the posterior test before implementation; browser tests also caught and drove fixes for invalid-hash normalization, tablet glow overflow, zoom reflow and print disclosure visibility.

Independent root review inspected desktop opening/product/demo/funding, mobile, print and evidence integrity. Final verification details and artifact paths are recorded in `/workspace/research/raW/implementation-report.md`. No dependency was installed and no production app, package manifest, lockfile or reference repository was edited by this implementation. Git integration and PR creation are handled by the parent agent.
