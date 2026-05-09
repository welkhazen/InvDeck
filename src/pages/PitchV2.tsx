import { useEffect, useMemo, useState } from "react";

type SlideTheme = "sunrise" | "dusk" | "midnight";

type Slide = {
  kicker: string;
  title: string;
  body: string;
  footer: string;
  visual?: string;
  theme: SlideTheme;
};

const slides: Slide[] = [
  {
    kicker: "Why now",
    title: "People want honest feedback without social risk.",
    body: "raW starts from anonymous honesty, then gradually reveals identity and community as trust increases.",
    footer: "Anonymous honesty → identity → community",
    visual: "Brand signal + opening promise",
    theme: "sunrise",
  },
  {
    kicker: "Problem",
    title: "Current social apps reward performance over truth.",
    body: "Users avoid asking real questions because responses are tied to public identity and social consequences.",
    footer: "Result: low-signal interactions, shallow engagement",
    theme: "dusk",
  },
  {
    kicker: "Product",
    title: "Prompt-based loops generate meaningful signals.",
    body: "Structured polls, fast reactions, and private insights create repeat behavior while staying emotionally safe.",
    footer: "Utility first, social graph second",
    visual: "Token + product preview",
    theme: "midnight",
  },
  {
    kicker: "Moat",
    title: "Identity progression creates defensibility.",
    body: "As users move from anonymous to identified contributors, their reputation history compounds into community trust.",
    footer: "Data + behavior graph strengthens over time",
    visual: "Progression badges + avatar collage",
    theme: "sunrise",
  },
  {
    kicker: "Go to market",
    title: "Start with high-expression communities.",
    body: "Campus, creators, and niche fandoms already seek fast peer feedback and naturally seed collaborative rituals.",
    footer: "Community-led adoption before paid acquisition",
    visual: "Hero avatars",
    theme: "dusk",
  },
  {
    kicker: "Ask",
    title: "Fund product depth and growth loops.",
    body: "Raise a concrete 18-month round to accelerate core loop quality, retention systems, and creator-led distribution.",
    footer: "Set final round size + use-of-funds before external sharing",
    theme: "midnight",
  },
];

export default function PitchV2() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        setIndex((value) => Math.min(value + 1, slides.length - 1));
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        setIndex((value) => Math.max(value - 1, 0));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const themeClass = useMemo(() => `slide-theme-${slide.theme}`, [slide.theme]);

  return (
    <main className={`pitch-layout ${themeClass}`}>
      <article className="pitch-card">
        <div className="pitch-content">
          <section>
            <p className="pitch-kicker">{slide.kicker}</p>
            <h1>{slide.title}</h1>
            <p className="pitch-body">{slide.body}</p>
            <p className="pitch-footer">{slide.footer}</p>
          </section>

          <aside className="pitch-visual" aria-label="slide visual">
            {slide.visual ? (
              <>
                <div className="visual-chip">Visual evidence</div>
                <p>{slide.visual}</p>
              </>
            ) : (
              <div className="avatar-mosaic" aria-hidden>
                {Array.from({ length: 9 }).map((_, cellIndex) => (
                  <span key={cellIndex} />
                ))}
              </div>
            )}
          </aside>
        </div>

        <footer className="pitch-nav">
          <button type="button" onClick={() => setIndex((v) => Math.max(v - 1, 0))} disabled={index === 0}>
            Previous
          </button>
          <p>
            Slide {index + 1} / {slides.length}
          </p>
          <button type="button" onClick={() => setIndex((v) => Math.min(v + 1, slides.length - 1))} disabled={index === slides.length - 1}>
            Next
          </button>
        </footer>
      </article>
    </main>
  );
}
