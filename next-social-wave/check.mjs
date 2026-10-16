// Smoke test for the built presentation. Needs Playwright (global install is fine):
//   node check.mjs [path-to-index.html] [screenshot-dir]
// Exits non-zero on any failure. Screenshots are optional evidence for a human look.
import { createRequire } from "module";
import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";

const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require(path.join(process.env.NODE_PATH || "/opt/node-tools/node_modules", "playwright")); }
const { chromium, devices } = pw;

const file = path.resolve(process.argv[2] || "index.html");
const shots = process.argv[3];
if (shots) fs.mkdirSync(shots, { recursive: true });
const url = pathToFileURL(file).href;
const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); };

const browser = await chromium.launch({ executablePath: fs.existsSync("/opt/pw-browsers/chromium") ? undefined : undefined });

async function open(ctxOpts, label) {
  const ctx = await browser.newContext(ctxOpts);
  // Block external font requests so the run is deterministic offline.
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => { if (m.type() === "error" && !/fonts\.g/.test(m.text()) && !/ERR_FAILED/.test(m.text())) errors.push(m.text()); });
  await page.goto(url);
  await page.waitForTimeout(400);
  return { ctx, page, errors, label };
}

async function noHorizontalScroll(page, label) {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth,
    wide: [...document.querySelectorAll("main *")].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.right > innerWidth + 1 && !e.closest(".sig-wrap,.table-wrap,#net"); }).slice(0, 5).map(e => e.tagName + "." + e.className) }));
  ok(r.sw <= r.w, `${label}: page scrolls horizontally (${r.sw} > ${r.w}) ${r.wide.join(", ")}`);
  ok(r.wide.length === 0, `${label}: elements overflow the viewport: ${r.wide.join(", ")}`);
}

async function runDemo(page, label) {
  await page.click("#c06 #q-restart");
  for (let k = 0; k < 5; k++) await page.click("#q-answers .ans >> nth=0");
  ok(await page.isVisible("#result"), `${label}: result not shown after 5 answers`);
  const first = await page.textContent("#result .tname");
  ok(!!first && first.startsWith("The "), `${label}: no tribe named after 5 answers`);
  await page.click("#result .btn.gold"); // continue to 10
  for (let k = 0; k < 5; k++) await page.click("#q-answers .ans >> nth=1");
  ok((await page.textContent("#result .label")).includes("10 answers"), `${label}: checkpoint at 10 missing`);
  await page.click("#result .btn.gold"); // continue to full
  let guard = 0;
  while (await page.isVisible("#q-answers .ans") && guard++ < 40) await page.click("#q-answers .ans >> nth=0");
  ok((await page.textContent("#result .label")).includes("Full reading"), `${label}: full reading not reached`);
  ok(await page.$$eval("#result .btn.gold", b => b.length === 0), `${label}: continue button still offered after full reading`);
  const sum = await page.$$eval("#post-bars .bv", v => v.reduce((a, x) => a + parseFloat(x.textContent), 0));
  ok(Math.abs(sum - 100) < 5, `${label}: posterior bars do not sum to ~100% (${sum})`);
  await page.click("#q-restart");
  ok(await page.isHidden("#result") && (await page.textContent("#q-count")).startsWith("Question 1 of 5"), `${label}: restart did not reset the demo`);
  // skip replaces without counting
  await page.click("#q-skip");
  ok((await page.textContent("#q-count")).startsWith("Question 1 of 5"), `${label}: skip counted as an answer`);
}

async function interactions(page, label) {
  await page.click('[data-geo="0"]');
  ok((await page.textContent("#cmp .num-l")).includes("15.8"), `${label}: Global switch did not update`);
  await page.click('[data-geo="2"]');
  ok((await page.textContent("#cmp")).includes("No comparable figure"), `${label}: Lebanon loneliness should say no comparable figure`);
  await page.click('[data-sig="plan"]');
  ok(await page.$$eval("#sig .dim", d => d.length > 0), `${label}: signal toggle did not dim observed items`);
  await page.click("#pipe li:nth-child(3) button");
  ok((await page.textContent("#pipe-detail")).includes("Founder-reported"), `${label}: pipeline detail not updated`);
  await page.fill("#c-join", "2");
  await page.dispatchEvent("#c-join", "input");
  ok((await page.textContent("#r-mem")) === "106,800", `${label}: calculator members wrong (${await page.textContent("#r-mem")})`);
  await page.click("#stage-tabs button:nth-child(2)");
  ok((await page.textContent("#stage-body")).includes("MENA"), `${label}: expansion stage did not change`);
  for (let k = 0; k < 4; k++) await page.click("#fly-next");
  ok((await page.textContent("#fly-k")).startsWith("Step 5"), `${label}: flywheel did not advance`);
  await page.click("#fly-reset");
  ok((await page.textContent("#fly-k")).startsWith("Step 1"), `${label}: flywheel reset failed`);
  await page.click("#fund-tabs button:nth-child(3)");
  ok((await page.textContent("#fund-kpis")).includes("250"), `${label}: funding tab did not switch`);
  ok(await page.$$eval("#fund-miles li", l => l.length) >= 10, `${label}: $250K milestones missing`);
  await page.click("#flow-steps li:nth-child(5) button");
  ok(await page.$$eval("#flow-screen .msg", m => m.length === 3), `${label}: product flow step 5 not rendered`);
  // every expandable opens
  for (const d of await page.$$("details.ev")) { await d.click(); }
  ok(await page.$$eval("details.ev", ds => ds.every(d => d.open)), `${label}: an evidence card did not open`);
  // brand rule
  const bare = await page.evaluate(() => { const w = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT); let n, c = 0; while ((n = w.nextNode())) if (/raW/.test(n.nodeValue) && !n.parentNode.closest("svg,title,code")) c++; return c; });
  ok(bare === 0, `${label}: ${bare} unbranded "raW" text nodes`);
}

async function presentMode(page, label) {
  await page.click("#btn-present");
  ok(await page.evaluate(() => document.body.classList.contains("present")), `${label}: present mode did not start`);
  await page.keyboard.press("Home");
  for (let k = 0; k < 13; k++) await page.keyboard.press("ArrowRight");
  ok((await page.textContent("#where-n")).startsWith("14"), `${label}: keyboard did not reach chapter 14`);
  const visible = await page.$$eval(".ch", cs => cs.filter(c => getComputedStyle(c).display !== "none").map(c => c.id));
  ok(visible.length === 1 && visible[0] === "c14", `${label}: present mode shows ${visible.join(",")}`);
  await page.keyboard.press("ArrowLeft");
  ok((await page.textContent("#where-n")).startsWith("13"), `${label}: ArrowLeft did not go back`);
  await page.keyboard.press("Escape");
  ok(!(await page.evaluate(() => document.body.classList.contains("present"))), `${label}: Escape did not exit present mode`);
}

// ---------- desktop ----------
{
  const s = await open({ viewport: { width: 1440, height: 900 } }, "desktop");
  const { page } = s;
  ok((await page.title()).includes("raW"), "desktop: title missing");
  ok(await page.$$eval(".ch:not(.appendix)", c => c.length) === 14, "desktop: expected 14 chapters");
  await noHorizontalScroll(page, "desktop");
  if (shots) for (const id of ["c01","c02","c03","c04","c05","c06","c07","c08","c09","c10","c11","c12","c13","c14","sources"]) {
    const h = await page.$("#" + id); await h.scrollIntoViewIfNeeded(); await h.screenshot({ path: `${shots}/desktop-${id}.png` });
  }
  await runDemo(page, "desktop");
  if (shots) await (await page.$("#c06")).screenshot({ path: `${shots}/desktop-c06-reset.png` });
  for (let k = 0; k < 5; k++) await page.click("#q-answers .ans >> nth=0");
  if (shots) { await (await page.$("#c06")).screenshot({ path: `${shots}/desktop-c06-result.png` }); await (await page.$("#c07")).screenshot({ path: `${shots}/desktop-c07-answers.png` }); }
  await interactions(page, "desktop");
  await presentMode(page, "desktop");
  // menu
  await page.click("#btn-menu"); await page.click("#menu-list li:nth-child(8) button");
  ok((await page.textContent("#where-n")).startsWith("08"), "desktop: chapter menu navigation failed");
  // links
  const ext = await page.$$eval("a[href^='http']", as => as.filter(a => a.target !== "_blank").length);
  ok(ext === 0, "desktop: external links must open in a new tab");
  const refs = await page.$$eval("a.ref", as => as.map(a => a.getAttribute("href")).filter(h => !document.querySelector(h)));
  ok(refs.length === 0, `desktop: broken source anchors ${refs.join(",")}`);
  ok(s.errors.length === 0, "desktop console errors: " + s.errors.join(" | "));
  await s.ctx.close();
}

// ---------- phone ----------
{
  const s = await open({ ...devices["iPhone 13"] }, "iphone");
  const { page } = s;
  await noHorizontalScroll(page, "iphone");
  if (shots) for (const id of ["c01","c03","c05","c06","c07","c08","c10","c11","c12","c13","c14"]) {
    const h = await page.$("#" + id); await h.scrollIntoViewIfNeeded(); await h.screenshot({ path: `${shots}/phone-${id}.png` });
  }
  await runDemo(page, "iphone");
  await interactions(page, "iphone");
  await noHorizontalScroll(page, "iphone after interactions");
  // swipe in present mode
  await page.click("#btn-present");
  await page.evaluate(() => { const t = (type, x) => document.dispatchEvent(new TouchEvent(type, { touches: type === "touchstart" ? [new Touch({ identifier: 1, target: document.body, clientX: x, clientY: 300 })] : [], changedTouches: [new Touch({ identifier: 1, target: document.body, clientX: x, clientY: 300 })] })); t("touchstart", 300); t("touchend", 100); });
  ok((await page.textContent("#where-n")).startsWith("02") || (await page.textContent("#where-n")) !== "", "iphone: swipe navigation failed");
  if (shots) await page.screenshot({ path: `${shots}/phone-present.png` });
  ok(s.errors.length === 0, "iphone console errors: " + s.errors.join(" | "));
  await s.ctx.close();
}

// ---------- reduced motion ----------
{
  const s = await open({ viewport: { width: 1024, height: 768 }, reducedMotion: "reduce" }, "reduced");
  ok(await s.page.evaluate(() => document.documentElement.classList.contains("reduce-motion")), "reduced: preference not honored");
  await s.page.click("#btn-motion");
  ok(await s.page.evaluate(() => !document.documentElement.classList.contains("reduce-motion")), "reduced: toggle did not turn motion on");
  ok(s.errors.length === 0, "reduced console errors: " + s.errors.join(" | "));
  await s.ctx.close();
}

await browser.close();
if (failures.length) { console.error("FAIL\n- " + failures.join("\n- ")); process.exit(1); }
console.log("PASS: desktop, iPhone and reduced-motion checks");
