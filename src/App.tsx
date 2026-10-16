import { Link, Navigate, Route, Routes } from "react-router-dom";
import PitchV2 from "./pages/PitchV2";

function openPrintableDeck(path: string) {
  const win = window.open(path, "_blank", "noopener,noreferrer");
  if (!win) return;
  const triggerPrint = () => {
    win.focus();
    win.print();
  };
  win.addEventListener("load", triggerPrint, { once: true });
  setTimeout(triggerPrint, 1200);
}

function DeckPage({ title, summary }: { title: string; summary: string }) {
  return (
    <main className="layout">
      <section className="card">
        <p className="eyebrow">raW pitch deck hub</p>
        <h1>{title}</h1>
        <p className="subtext">{summary}</p>
        <p className="tip">
          Next step: replace this placeholder with an embedded PDF, image slides, or a live presentation component.
        </p>
        <Link className="button" to="/">
          ← Back to selector
        </Link>
      </section>
    </main>
  );
}

function PitchSelector() {
  return (
    <main className="layout">
      <section className="card">
        <p className="eyebrow">raW pitch deck hub</p>
        <h1>Choose deck version</h1>
        <p className="subtext">Use this screen during founder/investor reviews so nobody needs to remember URLs.</p>

        <div className="grid">
          <a href="/wave/" className="button primary">
            Open The Next Social Wave
          </a>
          <Link to="/pitch-v1" className="button ghost">
            Open V1
          </Link>
          <Link to="/pitch-v2" className="button ghost">
            Open V2
          </Link>
          <button onClick={() => openPrintableDeck("/pitch-v2")} className="button ghost" type="button">
            Print PDF
          </button>
        </div>

        <p className="tip">The Next Social Wave is the current 14-chapter deck. V1 and V2 are kept for comparison.</p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PitchSelector />} />
      <Route path="/pitch-v1" element={<DeckPage title="Pitch Deck — V1" summary="Legacy baseline for comparison." />} />
      <Route path="/pitch-v2" element={<PitchV2 />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
