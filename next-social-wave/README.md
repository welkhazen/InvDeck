# raW — The Next Social Wave

An interactive, single-file investor presentation for raW's pre-seed raise. The deck has 14 chapters with expandable evidence. It also includes a working demo of the real Tribe Test model.

## Files

| File | What it is |
|---|---|
| `index.html` | **The presentation.** One self-contained file: open it in a browser, present from it, or send it as an attachment. It never connects to a live database. |
| `deck.template.html` | The source to edit. `build.py` turns it into `index.html`. |
| `build.py` | Inlines the Tribe Test model, the logo, avatars and the Michroma font. Stdlib Python only. |
| `check.mjs` | Smoke test (Playwright): desktop, iPhone, reduced motion, every interaction. |
| `dist/artifact.html` | The same page without the `<html>` wrapper, for publishing as a claude.ai artifact. It is not committed and the build regenerates it. |
| `presentation-copy.md` | The full investor-facing narrative, chapter by chapter. |
| `research-sources.md` | Source register, methods and the claim audit: where every number comes from. |
| `evidence-status.md` | Product claims by status (verified, in progress, planned), assumptions, missing evidence and open questions. |

## Open it

Double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

**Fonts.** Michroma is embedded in the file. Instrument Serif and Raleway load from Google Fonts. When you're offline, the deck falls back to Georgia and the system sans-serif, and the layout still holds.

## Present it

- **Scroll mode** is the default. It suits reading, sending or a phone. Use ← and → to jump between chapters, or the **Chapters** menu to go straight to one.
- **Presentation mode** shows one chapter per screen. Press **Present** to enter it.
  - It goes fullscreen where the browser allows.
  - Move between chapters with → / Space / PageDown and ← / PageUp, or swipe on a phone.
  - **Home** and **End** jump to the first and last chapter.
  - **Esc** exits.
- **Reduce motion** stops the hero network and the loop animations. It follows the system setting by default, and the choice is remembered in this browser.
- **Restart** puts the deck back to chapter 1 and resets the demo, the flywheel and the product flow. You'll find it in the Chapters menu and in chapter 14.
- **Deep links** such as `index.html#c06` open a specific chapter.

**Suggested live flow** (about 15 minutes):
1. Chapters 01–05.
2. Hand the laptop over for chapter 06 (five questions, about 60 seconds).
3. Chapter 07 then redraws using their own answers.
4. Chapters 08–14. Open the evidence cards only when someone asks "where did this come from?".

## Maintain it

```bash
# After editing deck.template.html, or when the Tribe Test model is rebuilt in therawme:
python3 build.py                     # defaults: ../../therawme and ../../wzwznew
python3 build.py --therawme PATH --wzwznew PATH
node check.mjs index.html [screenshot-dir]   # needs Playwright: npm i -g playwright
```

- **Model data** comes from the inlined `const M = {...}` in `therawme/index.html`. Nothing else is read from that repo.
  - Only aggregate model parameters are included: tribe shares, per-question P(answer | tribe), and answer counts.
  - No voter, username or individual answer is ever included.
- **The demo question pool** is `DEMO_POOL` in `build.py`. It holds 38 everyday questions. The 14 excluded questions are listed there with reasons: mental health, childhood violence, religion, sexuality, gender identity, death, a gender stereotype, disability framing, age, and one duplicate wording.
  - If the model drops a question, the build fails and tells you which one.
- **Figures** are written into the template. When a source updates, change the template and `research-sources.md` together.
- **Brand rule:** the deck renders every "raW" with its W in gold, automatically, through `brand()` in the script.
  - In display spots that hold the brand on its own (header, hero), it is written as `ra<span class="W">W</span>`.
  - In running copy, just write "raW".

## Hosting (not done)

Nothing has been deployed. To put the deck online, here are two options:
- **InvDeck's Vercel project:** copy `index.html` into InvDeck's `public/` folder, for example as `public/wave.html`.
- **claude.ai artifact:** publish `dist/artifact.html` as a private artifact.

Decide who should see it before you make it public.
