import { Link, Navigate, Route, Routes } from "react-router-dom";

function openPrintableDeck(path: string) {
  const win = window.open(path, "_blank");
  if (!win) return;

  let didPrint = false;
  const startedAt = Date.now();
  const maxWaitMs = 10000;

  const printOnce = () => {
    if (didPrint) return;
    didPrint = true;
    win.focus();
    win.print();
  };

  const tryPrintWhenReady = () => {
    if (didPrint || win.closed) return;

    const isReady = win.document?.readyState === "complete";
    if (isReady) {
      printOnce();
      return;
    }

    if (Date.now() - startedAt >= maxWaitMs) {
      printOnce();
      return;
    }

    window.setTimeout(tryPrintWhenReady, 250);
  };

  win.addEventListener("load", printOnce, { once: true });
  window.setTimeout(tryPrintWhenReady, 250);
}

function DeckPage({
  title,
  summary,
  canonicalPath
}: {
  title: string;
  summary: string;
  canonicalPath: string;
}) {
  return (
    <main className="layout">
      <section className="card">
        <p className="eyebrow">raW pitch deck</p>
        <h1>{title}</h1>
        <p className="subtext">{summary}</p>

        <div className="grid">
          <Link to="/pitch-v2" className="button primary">
            Open current deck (V2)
          </Link>
          <Link to="/pitch-v1" className="button ghost">
            Open legacy deck (V1)
          </Link>
          <button onClick={() => openPrintableDeck(canonicalPath)} className="button ghost" type="button">
            Print this version
          </button>
        </div>

        <p className="tip">Next step: replace this placeholder with embedded slides (PDF or viewer) for a smoother investor experience.</p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pitch-v2" replace />} />
      <Route
        path="/pitch-v1"
        element={<DeckPage title="Pitch Deck — V1" summary="Legacy baseline for comparison and archived messaging." canonicalPath="/pitch-v1" />}
      />
      <Route
        path="/pitch-v2"
        element={<DeckPage title="Pitch Deck — V2" summary="Primary deck to share with investors and partners." canonicalPath="/pitch-v2" />}
      />
      <Route path="*" element={<Navigate to="/pitch-v2" replace />} />
    </Routes>
  );
}
