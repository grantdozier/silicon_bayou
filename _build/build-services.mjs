/**
 * Generate the ten service pages, the homepage services rail, sitemap.xml and
 * robots.txt from services.data.mjs.
 *
 *   node _build/build-services.mjs
 *
 * Nothing in _build/ is deployed — the deploy workflow copies an explicit
 * allowlist. Commit the generated HTML.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { services } from './services.data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.doziertechgroup.com';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The mark, inline, so a service page needs no extra request for it.
const MARK = `<svg viewBox="0 0 64 72" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" stroke-linejoin="miter" stroke-miterlimit="10">
          <path stroke-width="3.75" d="M32 2.06 L61.6 18.98 L61.6 52.82 L32 69.74 L2.4 52.82 L2.4 18.98 Z"/>
          <path stroke-width="6.7" stroke-linecap="butt" d="M16.25 23.9 L35.25 23.9 C41.65 23.9 46.85 28.7 46.85 35.9 C46.85 43.1 41.65 48.1 35.25 48.1 L19.6 48.1 L19.6 30.4"/>
        </g>
      </svg>`;

const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

const nav = (up) => `<header class="nav">
  <div class="container">
    <a class="brand" href="${up}index.html" aria-label="Dozier Tech Group, home">
      ${MARK}
      <span class="brand-word"><b>DOZIER</b><span>TECH GROUP</span></span>
    </a>
    <nav aria-label="Primary">
      <ul class="nav-links" id="nav-links">
        <li><a href="${up}index.html#services">Services</a></li>
        <li><a href="${up}index.html#ontology">Approach</a></li>
        <li><a href="${up}index.html#integrations">Integrations</a></li>
        <li><a href="${up}index.html#work">Work</a></li>
        <li><a href="${up}index.html#clients">Case studies</a></li>
        <li><a href="${up}index.html#contact">Contact</a></li>
      </ul>
    </nav>
    <a class="btn btn--primary" href="${up}index.html#contact">Start a conversation</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;

const footer = (up) => `<div class="band band--dark">
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="${up}index.html" aria-label="Dozier Tech Group, home">
            ${MARK}
            <span class="brand-word"><b>DOZIER</b><span>TECH GROUP</span></span>
          </a>
          <p>
            AI systems, business ontologies, and custom platforms for engineering-led companies —
            where the work is complex, regulated, and unforgiving.
          </p>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
${services.slice(0, 5).map((s) => `            <li><a href="${up}services/${s.slug}.html">${esc(s.title.split(' & ')[0])}</a></li>`).join('\n')}
          </ul>
        </div>
        <div>
          <h4>More services</h4>
          <ul>
${services.slice(5).map((s) => `            <li><a href="${up}services/${s.slug}.html">${esc(s.title.split(' & ')[0])}</a></li>`).join('\n')}
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="${up}index.html#work">Selected work</a></li>
            <li><a href="${up}index.html#clients">Case studies</a></li>
            <li><a href="${up}index.html#contact">Contact</a></li>
            <li><a href="${up}privacy-policy.html">Privacy policy</a></li>
            <li><a href="${up}terms-and-conditions.html">Terms of service</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© <span id="year">2026</span> Dozier Tech Group. All rights reserved.</p>
        <nav aria-label="Legal">
          <a href="${up}privacy-policy.html">Privacy</a>
          <a href="${up}terms-and-conditions.html">Terms</a>
        </nav>
      </div>
    </div>
  </footer>
</div>`;

// ── service page ────────────────────────────────────────────────────────────
function page(s, prev, next) {
  const up = '../';
  const metrics = s.practice.metrics
    ? `<dl class="case-metrics">
${s.practice.metrics.map(([v, l]) => `            <div><dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join('\n')}
          </dl>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(s.title)} — Dozier Tech Group</title>
<meta name="description" content="${esc(s.meta)}">
<link rel="canonical" href="${SITE}/services/${s.slug}.html">
<meta name="theme-color" content="#0D1B3D">

<meta property="og:type" content="article">
<meta property="og:url" content="${SITE}/services/${s.slug}.html">
<meta property="og:title" content="${esc(s.title)} — Dozier Tech Group">
<meta property="og:description" content="${esc(s.meta)}">
<meta property="og:image" content="${SITE}/images/brand/og-image.png">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${up}css/dtg.css">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": ${JSON.stringify(s.title)},
  "description": ${JSON.stringify(s.meta)},
  "url": "${SITE}/services/${s.slug}.html",
  "provider": { "@type": "ProfessionalService", "name": "Dozier Tech Group", "url": "${SITE}/" },
  "areaServed": "US"
}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

${nav(up)}

<main id="main">

<!-- ─────────────────── hero ─────────────────── -->
<div class="band band--dark">
  <section class="section page-hero">
    <div class="grid-paper" aria-hidden="true"></div>
    <div class="bloom" aria-hidden="true"></div>
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="${up}index.html">Home</a>
        <span aria-hidden="true">/</span>
        <a href="${up}index.html#services">Services</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${esc(s.title)}</span>
      </nav>
      <p class="eyebrow">Service ${s.num}</p>
      <h1>${esc(s.title)}</h1>
      <p class="lede">${esc(s.lede)}</p>
      <div class="hero-actions">
        <a class="btn btn--primary" href="${up}index.html#contact">Start a conversation ${ARROW}</a>
        <a class="btn btn--ghost" href="${up}index.html#services">All ten services</a>
      </div>
    </div>
  </section>
</div>

<!-- ─────────────────── what it is / what you get ─────────────────── -->
<div class="band band--light">
  <section class="section">
    <div class="container">
      <div class="split">
        <div>
          <h2>What it is</h2>
          <div class="prose">
${s.what.map((p) => `            <p>${esc(p)}</p>`).join('\n')}
          </div>
        </div>
        <div>
          <h2>What you get</h2>
          <ul class="feature-list">
${s.get.map((g) => `            <li>${esc(g)}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </div>
  </section>
</div>

<!-- ─────────────────── how it works ─────────────────── -->
<div class="band band--dark">
  <section class="section">
    <div class="bloom" aria-hidden="true"></div>
    <div class="container">
      <div class="section-head" data-reveal>
        <p class="eyebrow">How it works</p>
        <h2>${esc(s.how.length)} steps, in order.</h2>
      </div>
      <ol class="steps" data-reveal-stagger>
${s.how.map(([t, d], i) => `        <li class="step" data-reveal>
          <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(t)}</h3>
          <p>${esc(d)}</p>
        </li>`).join('\n')}
      </ol>
    </div>
  </section>
</div>

<!-- ─────────────────── in practice ─────────────────── -->
<div class="band band--light">
  <section class="section">
    <div class="container">
      <div class="practice" data-reveal>
        <p class="eyebrow">In practice</p>
        <h2>${esc(s.practice.title)}</h2>
        <p class="lede">${esc(s.practice.body)}</p>
        ${metrics}
      </div>
    </div>
  </section>
</div>

<!-- ─────────────────── pager + CTA ─────────────────── -->
<div class="band band--dark">
  <section class="section">
    <div class="container">
      <nav class="pager" aria-label="More services">
        <a class="pager-link" href="${prev.slug}.html">
          <span>Previous</span>
          <strong>${esc(prev.title)}</strong>
        </a>
        <a class="pager-link pager-link--next" href="${next.slug}.html">
          <span>Next</span>
          <strong>${esc(next.title)}</strong>
        </a>
      </nav>
      <div class="cta-strip">
        <h2>Tell us about your project.</h2>
        <a class="btn btn--primary" href="${up}index.html#contact">Start a conversation ${ARROW}</a>
      </div>
    </div>
  </section>
</div>
</main>

${footer(up)}

<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
<script src="${up}js/site.js" defer></script>
</body>
</html>
`;
}

// ── homepage rail fragment ──────────────────────────────────────────────────
function rail() {
  const cards = services.map((s) => `        <article class="svc-card">
          <p class="svc-num">${s.num}</p>
          <h3 class="svc-title">${esc(s.title)}</h3>
          <p class="svc-short">${esc(s.short)}</p>
          <a class="svc-link" href="services/${s.slug}.html">
            Read more<span class="sr-only"> about ${esc(s.title)}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </article>`).join('\n');

  return `      <div class="svc-carousel">
        <div class="svc-railhead">
          <p class="svc-count"><strong>${services.length}</strong> services</p>
          <div class="svc-nav" hidden>
            <button class="svc-arrow" type="button" data-dir="-1" aria-label="Scroll services left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <button class="svc-arrow" type="button" data-dir="1" aria-label="Scroll services right">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>

        <div class="svc-rail" id="svc-rail" tabindex="0" role="group" aria-label="Services, scrollable">
${cards}
        </div>

        <ol class="svc-dots" hidden></ol>
      </div>`;
}

// ── write everything ────────────────────────────────────────────────────────
const outDir = path.join(ROOT, 'services');
fs.mkdirSync(outDir, { recursive: true });

services.forEach((s, i) => {
  const prev = services[(i - 1 + services.length) % services.length];
  const next = services[(i + 1) % services.length];
  fs.writeFileSync(path.join(outDir, `${s.slug}.html`), page(s, prev, next));
});
console.log(`services/  ${services.length} pages`);

// inject the rail into index.html
const idxPath = path.join(ROOT, 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');
const B = '<!--#svc:rail:begin-->';
const E = '<!--#svc:rail:end-->';
if (!idx.includes(B)) throw new Error(`index.html is missing the ${B} marker`);
const re = new RegExp(`${B}[\\s\\S]*?${E}`);
idx = idx.replace(re, `${B}\n${rail()}\n      ${E}`);
fs.writeFileSync(idxPath, idx);
console.log('index.html  rail injected');

// sitemap + robots
const urls = [
  ['/', '1.0'],
  ...services.map((s) => [`/services/${s.slug}.html`, '0.8']),
  ['/privacy-policy.html', '0.2'],
  ['/terms-and-conditions.html', '0.2'],
];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>${SITE}${u}</loc><priority>${p}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
`User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
console.log('sitemap.xml, robots.txt');
