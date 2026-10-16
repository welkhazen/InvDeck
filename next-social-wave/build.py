"""Build the raW investor presentation from deck.template.html.

Stdlib only. Inlines the real Tribe Test model (curated question pool), the raW logo,
avatars and the Michroma font, then writes two files:

  index.html          standalone, self-contained page (open it directly, send it as a file)
  dist/artifact.html  the same page without the <!doctype>/<html> wrapper (for claude.ai artifacts)

Usage:
  python3 build.py [--therawme ../../therawme] [--wzwznew ../../wzwznew]
"""
import argparse
import base64
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

# Everyday questions only. Excluded from the investor demo, with the reason:
#   P05 life satisfaction (thin sample, n=81)   P13, P84 ways/knowledge of dying
#   P60, P108 mental health                     P80 childhood violence
#   P89 religion                                P69, P121 gender identity / sexuality
#   P76 sexual connotation                      P79 age bracket (demographic, not opinion)
#   P119 gender stereotype                      P138 disability framing
#   P112 same question as P15 (the model's SAME_QUESTION rule keeps P15)
DEMO_POOL = [
    "P01", "P03", "P04", "P06", "P11", "P15", "P17", "P18", "P19", "P20", "P21", "P25",
    "P31", "P32", "P35", "P36", "P53", "P55", "P58", "P61", "P66", "P68", "P73", "P78",
    "P83", "P85", "P86", "P87", "P90", "P91", "P93", "P94", "P95", "P96", "P97", "P110",
    "P116", "P118",
]

AVATARS = ["neon-lynx", "blue-signal", "viozen", "pink-circuit", "solar-flame", "violet-mask", "blu-fifer"]
BADGES = ["lvl-1", "lvl-5", "lvl-10"]


def data_uri(path: Path, mime: str) -> str:
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


def load_model(therawme: Path) -> dict:
    html = (therawme / "index.html").read_text(encoding="utf-8")
    start = html.index("const M = ") + len("const M = ")
    end = html.index(";\n\nconst $ = ", start)
    return json.loads(html[start:end])


# Clauses in the shipped tribe copy that the model's own parameters contradict
# (Storm: 97% of labeled Storm answerers chose "Religious" on P89; Calm: not the
# strongest single answer). Dropped here until therawme's tribes_v2.json is fixed.
DESCRIPTION_FIXES = {
    "The Storm": ("Not religious, not softened,", "Not softened,"),
    "The Calm": ("Doesn't overthink - the strongest single answer in the whole community.", "Doesn't overthink."),
}


def fix_description(name, text):
    old, new = DESCRIPTION_FIXES.get(name, (None, None))
    if old is None:
        return text
    if old not in text:
        sys.exit(f"DESCRIPTION_FIXES for {name} no longer matches the model; review the tribe copy")
    return text.replace(old, new)


def curate(m: dict) -> dict:
    tribes = m["tribes"]
    names = [t["name"] for t in tribes]
    by_id = {q["poll_id"]: q for q in m["questions"]}
    missing = [p for p in DEMO_POOL if p not in by_id]
    if missing:
        raise SystemExit(f"demo pool ids missing from the model: {missing}")
    questions = []
    for pid in DEMO_POOL:
        q = by_id[pid]
        pa = [q["pa"][n] for n in names]
        # Share-weighted P(side a): the labeled community's lean, as the model sees it
        # (Laplace-smoothed, labeled voters only). Shown as an estimate, never as a poll result.
        lean = sum(t["share"] * p for t, p in zip(tribes, pa))
        questions.append({"id": pid, "text": q["text"], "a": q["a"], "b": q["b"],
                          "n": q["n"], "pa": pa, "lean": round(lean, 3)})
    quiz = m["quizzes"][0]
    return {
        "tribes": [{"name": t["name"], "description": fix_description(t["name"], t["description"]), "share": t["share"]} for t in tribes],
        "questions": questions,
        "meta": {
            "full_pool": len(m["questions"]),
            "demo_pool": len(questions),
            "fixed_len": m["fixed_len"],
            "confirmed_votes": m["corpus_voters"],  # named corpus_voters in the model, but it counts confirmed votes
            "bridge": m["bridge"],
            "validated_accuracy": quiz["validated_accuracy"],
            "validated_on": quiz["validated_on"],
            "avg_length": quiz["avg_length"],
        },
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--therawme", default=str(HERE.parent.parent / "therawme"))
    ap.add_argument("--wzwznew", default=str(HERE.parent.parent / "wzwznew"))
    args = ap.parse_args()
    therawme, app = Path(args.therawme), Path(args.wzwznew)

    tpl = (HERE / "deck.template.html").read_text(encoding="utf-8")
    font = re.search(r"@font-face\{font-family:Michroma;[^}]*\}",
                     (therawme / "index.template.html").read_text(encoding="utf-8")).group(0)
    images = {"logo": data_uri(app / "public/raw-logo-192.png", "image/png")}
    for a in AVATARS:
        images[f"av_{a}"] = data_uri(app / f"public/avatars/landing/{a}.webp", "image/webp")
    for b in BADGES:
        images[f"badge_{b}"] = data_uri(app / f"src/assets/{b}.webp", "image/webp")

    data = curate(load_model(therawme))
    out = (tpl.replace("/*__MICHROMA__*/", font)
              .replace("/*__DATA__*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":")))
              .replace("/*__IMAGES__*/null", json.dumps(images, separators=(",", ":"))))
    for key, uri in images.items():
        out = out.replace(f"__IMG_{key}__", uri)
    left = re.findall(r"__IMG_[a-z0-9_-]+__|/\*__[A-Z]+__\*/", out)
    if left:
        raise SystemExit(f"unreplaced placeholders: {sorted(set(left))}")

    (HERE / "dist").mkdir(exist_ok=True)
    (HERE / "dist/artifact.html").write_text(out, encoding="utf-8")
    standalone = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
                  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                  + out + "\n</html>\n")
    (HERE / "index.html").write_text(standalone, encoding="utf-8")
    print(f"index.html {len(standalone)/1e3:.0f} KB | demo pool {len(data['questions'])} of "
          f"{data['meta']['full_pool']} questions | {len(images)} images inlined")


if __name__ == "__main__":
    main()
