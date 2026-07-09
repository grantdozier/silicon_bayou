#!/usr/bin/env node
/**
 * Re-skin a proposal package to the DTG brand, and put a DTG x Cox lockup on
 * every cover.
 *
 *   node _build/rebrand-proposals.mjs "<package folder>" [--dry]
 *
 * Three blues were fighting each other: the documents drew from their own
 * slate navy (#274B71) on warm paper (#F6F2EE), the reader shell drew from the
 * brand ramp, and the client's logo brings #006BAE. The fix is not to blend
 * them. It is to let DTG speak in exactly one navy, and to let Cox's blue
 * appear nowhere except inside Cox's own mark. On the navy covers both marks
 * are white, so on the page there is only ever one blue at a time.
 *
 * Only the .html is touched. The .docx are the copies the client redlines.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2];
const DRY = process.argv.includes('--dry');
const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), '..');

if (!DIR || !fs.existsSync(DIR)) {
  console.error('usage: node _build/rebrand-proposals.mjs "<package folder>" [--dry]');
  process.exit(1);
}

/* ---------- palette ----------
   Left: what the documents used. Right: the brand packet and its navy ramp,
   the same tokens css/dtg.css serves the website from. */
const COLOR = [
  // warm paper and rules -> the packet's cool Off White and Light Gray
  [/#f6f2ee/gi, '#f7f8fa'],
  [/#e2dad0/gi, '#e6e8ec'],
  [/rgba\(246,\s*242,\s*238/g, 'rgba(247,248,250'],
  // ink and muted -> Charcoal, and a cooler grey that also lifts the contrast
  [/#1c2733/gi, '#1e232b'],
  [/#8a97a6/gi, '#7b8798'],
  // the navies -> navy-900 and navy-700
  [/#1f436b/gi, '#0d1b3d'],
  [/#274b71/gi, '#1f4a86'],
  [/rgba\(39,\s*75,\s*113/g, 'rgba(31,74,134'],
  // the cover gradient's light end: one step above navy-700, still dark enough
  // to carry white body text
  [/#2e5680/gi, '#2557a0'],
  // sky and tint -> navy-300 and a faint navy wash
  [/#a9c2de/gi, '#a3c6ea'],
  [/rgba\(169,\s*194,\s*222/g, 'rgba(163,198,234'],
  [/#eef3f8/gi, '#eef2f9'],
];

/* ---------- assets ----------
   The client's marks live in images/_source/, which the deploy workflow strips
   from dist/. They belong inside the encrypted package, not on the public site,
   where they would advertise the relationship to anyone who guessed the path. */
const coxB64 = fs.readFileSync(path.join(SITE, 'images/_source/cox-wordmark-white.png')).toString('base64');
const COX = `<img class="cox-mark" src="data:image/png;base64,${coxB64}" alt="Cox Research and Technology, Inc." />`;

// The mark, drawn rather than linked, so each document stays self-contained.
// Butt caps and mitred joins: the real mark has square arm ends and sharp
// hexagon corners, and the gap in the D's stem is the mark, not a mistake.
const DTG = `<svg class="dtg-mark" viewBox="0 0 64 72" fill="none" stroke="#FFFFFF"
       stroke-linejoin="miter" stroke-miterlimit="10" role="img" aria-label="Dozier Tech Group">
    <path stroke-width="3.75" d="M32 2.06 L61.6 18.98 L61.6 52.82 L32 69.74 L2.4 52.82 L2.4 18.98 Z"/>
    <path stroke-width="6.7" stroke-linecap="butt"
          d="M16.25 23.9 L35.25 23.9 C41.65 23.9 46.85 28.7 46.85 35.9 C46.85 43.1 41.65 48.1 35.25 48.1 L19.6 48.1 L19.6 30.4"/>
  </svg>`;

const LOCK_X = `<span class="lock-x" aria-hidden="true">&#215;</span>`;

const MARKER = '/* ---- DTG x Cox lockup ---- */';

// `.head .mark img { background:var(--paper); padding:8px 11px; border-radius:6px }`
// was written for the old raster logo and still matches any <img> in that
// header, so the white Cox mark renders as a blank white pill. It is specificity
// (0,2,1), so `.head .mark .cox-mark` at (0,3,0) is what overrides it.
const CSS = `
  ${MARKER}
  .cover-mark, .head .mark { display:flex; align-items:center; gap:14px; }
  .dtg-mark, .cox-mark { width:auto; flex:none; }
  .cover-mark .cox-mark, .head .mark .cox-mark,
  .cover-mark .dtg-mark, .head .mark .dtg-mark {
    background:none; padding:0; border-radius:0;
  }
  .lock-x { font-size:17px; font-weight:400; line-height:1; opacity:0.4; margin:0 2px; }
  .cover-mark .dtg-mark { height:46px; }
  .cover-mark .cox-mark { height:36px; }
  .head .mark .dtg-mark { height:38px; }
  .head .mark .cox-mark { height:29px; }
  @media print {
    .dtg-mark, .cox-mark { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  }
`;

/* ---------- rewrite ---------- */
let failures = 0;

for (const f of fs.readdirSync(DIR).filter((x) => /\.html$/i.test(x))) {
  const p = path.join(DIR, f);
  const before = fs.readFileSync(p, 'utf8');
  let t = before;
  const note = [];

  // Re-runnable: strip a previously injected block before adding the new one.
  const done = t.includes('class="dtg-mark"');
  t = t.replace(new RegExp(MARKER.replace(/[*/]/g, '\\$&') + '[\\s\\S]*?(?=<\\/style>)'), '');

  // 1. palette
  let swapped = 0;
  for (const [re, to] of COLOR) {
    const n = (t.match(re) || []).length;
    swapped += n;
    t = t.replace(re, to);
  }
  note.push(`${swapped} colour(s)`);

  // 2. The cover gradient ran out to a blue brighter than anything else in the
  //    system, which is the collision this change exists to remove. Keep it
  //    inside the navy ramp: navy-900 -> navy-800 -> navy-700.
  const gradRe = /linear-gradient\((\d+deg),\s*var\(--deep-navy\)\s*0%,\s*var\(--navy\)\s*(\d+)%,\s*#2557a0\s*100%\)/gi;
  const grads = (t.match(gradRe) || []).length;
  t = t.replace(gradRe, (_m, deg, stop) => `linear-gradient(${deg},#0d1b3d 0%,#16305f ${stop}%,#1f4a86 100%)`);
  if (grads) note.push(`${grads} gradient(s)`);

  if (!done) {
    // 3. the old raster logo, and the paper chip it sat on
    const imgRe = /<img[^>]*alt="Dozier Tech Group"[^>]*\/?>/i;
    if (!imgRe.test(t)) { console.log(`  ${f}: NO LOGO IMG FOUND`); failures++; continue; }
    t = t.replace(imgRe, DTG);
    note.push('logo');

    // 4. the lockup: mark, wordmark, x, client mark
    if (/<span class="wordmark">/.test(t)) {
      t = t.replace(/(<span class="wordmark">[^<]*<\/span>)/, `$1\n    ${LOCK_X}\n    ${COX}`);
    } else if (/<span class="wm">/.test(t)) {
      // This one already read "Dozier Tech Group x Cox Research". With both
      // marks present the words duplicate them, so the wordmark keeps only DTG.
      t = t.replace(/<span class="wm">[^<]*<\/span>/, `<span class="wm">Dozier Tech Group</span>\n    ${LOCK_X}\n    ${COX}`);
    } else { console.log(`  ${f}: NO WORDMARK SPAN`); failures++; continue; }
    note.push('lockup');
  } else {
    note.push('lockup already present');
  }

  // 5. styles, into the first block so the print block can still override
  const close = t.indexOf('</style>');
  if (close === -1) { console.log(`  ${f}: NO <style>`); failures++; continue; }
  t = t.slice(0, close) + CSS + t.slice(close);

  // checks
  const stale = [...new Set([...t.matchAll(/#(?:f6f2ee|e2dad0|1c2733|8a97a6|1f436b|274b71|2e5680|a9c2de|eef3f8)/gi)].map((m) => m[0]))];
  const chip = /\.logo\s*\{[^}]*background:var\(--paper\)/.test(t);
  if (stale.length) { console.log(`  ${f}: STALE ${stale.join(' ')}`); failures++; }

  console.log(`  ${f.padEnd(58)} ${note.join(', ')}${chip ? '  (dead .logo rule left behind, harmless)' : ''}`);
  if (!DRY) fs.writeFileSync(p, t);
}

console.log(DRY ? '\ndry run, nothing written' : `\n${failures ? failures + ' FAILURE(S)' : 'done'}`);
process.exit(failures ? 1 : 0);
