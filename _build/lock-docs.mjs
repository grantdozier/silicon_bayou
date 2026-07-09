#!/usr/bin/env node
/**
 * Package a folder of documents into ONE self-contained, password-locked page.
 *
 *   DOC_PASSWORD='…' node _build/lock-docs.mjs "<source folder>" [folder-name]
 *
 * Why the payload is encrypted rather than just hidden behind a JS password
 * check: this site deploys to a PUBLIC repo. Every file is served verbatim by
 * raw.githubusercontent.com, with no password, forever — deleting it later does
 * not remove it, because the blob stays reachable by commit SHA. A password
 * that only hides a <div> protects nothing; anyone can read the source.
 *
 * So the password derives an AES-GCM key (PBKDF2-SHA256, 250k iterations) and
 * the documents are ciphertext on disk. Without the password the page is a wall
 * of base64. With it, everything decrypts in the browser. No server, no keys in
 * this repo, nothing to deploy.
 *
 * GCM is authenticated, so a wrong password fails to decrypt rather than
 * producing garbage — the page can say "wrong password" honestly.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const ITERATIONS = 250_000;
const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), '..');

const [srcArg, folderArg] = process.argv.slice(2);
const password = process.env.DOC_PASSWORD;

if (!srcArg || !password) {
  console.error('usage: DOC_PASSWORD=… node _build/lock-docs.mjs "<source folder>" [folder-name]');
  console.error('       (the password is read from the environment so it never lands in this repo)');
  process.exit(1);
}
if (!fs.existsSync(srcArg)) {
  console.error(`no such folder: ${srcArg}`);
  process.exit(1);
}

/* ---------- collect ---------- */

// Reading order. Match on the filename, never the path: a path like
// "DTG Proposal Package/…_MSA.html" contains "proposal" in a parent segment,
// which would score every document as the proposal and sort the MSA to the top.
const ORDER = ['proposal', 'system-design', 'msa', 'sow'];
const rank = (name) => {
  const i = ORDER.findIndex((w) => name.toLowerCase().includes(w));
  return i === -1 ? ORDER.length : i;
};

// What the client should see, rather than the filename.
const titleOf = (name) => {
  const n = name.toLowerCase();
  if (n.includes('system-design')) return 'System Design';
  if (n.includes('msa')) return 'Master Services Agreement';
  if (n.includes('sow')) return 'Statement of Work — Conference Sprint';
  if (n.includes('proposal')) return 'Proposal';
  return name.replace(/\.[a-z]+$/i, '');
};

const files = fs.readdirSync(srcArg);
const htmlFiles = files.filter((f) => /\.html$/i.test(f)).sort((a, b) => rank(a) - rank(b));
if (!htmlFiles.length) {
  console.error(`no .html documents in ${srcArg}`);
  process.exit(1);
}

const docs = htmlFiles.map((f) => {
  const stem = f.replace(/\.html$/i, '');
  const docx = files.find((x) => x.toLowerCase() === `${stem.toLowerCase()}.docx`);
  return {
    title: titleOf(f),
    // The MSA and the SOW are the two they sign.
    sign: /msa|sow/i.test(f),
    html: fs.readFileSync(path.join(srcArg, f), 'utf8'),
    docxName: docx || null,
    docx: docx ? fs.readFileSync(path.join(srcArg, docx)).toString('base64') : null,
  };
});

/* ---------- compress, then encrypt ---------- */

const plain = zlib.gzipSync(Buffer.from(JSON.stringify(docs), 'utf8'), { level: 9 });
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([cipher.update(plain), cipher.final(), cipher.getAuthTag()]);

const folder = folderArg || `proposal-${crypto.randomBytes(6).toString('hex')}`;
if (!/^proposal-[a-z0-9-]+$/.test(folder)) {
  console.error('folder name must match /^proposal-[a-z0-9-]+$/ — the deploy allowlist globs proposal-*');
  process.exit(1);
}

const b64 = (b) => b.toString('base64');
const page = PAGE({ salt: b64(salt), iv: b64(iv), ct: b64(ct), iterations: ITERATIONS });

const outDir = path.join(SITE, folder);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), page);

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
console.log(`${docs.length} document(s) locked into ${folder}/index.html  (${kb(page.length)})\n`);
for (const d of docs) {
  console.log(`  ${d.title}${d.sign ? '  [to sign]' : ''}${d.docx ? '  + .docx' : ''}`);
}
console.log(`\n  plaintext ${kb(JSON.stringify(docs).length)} → gzip ${kb(plain.length)} → +base64 ${kb(ct.length * 1.34)}`);
console.log(`\nShare:  https://www.doziertechgroup.com/${folder}/`);
console.log('Give them the password by text or a call — not in the same email as the link.');

/* ---------- the page ---------- */

function PAGE({ salt, iv, ct, iterations }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<title>Dozier Tech Group — Confidential</title>
<style>
  :root { --navy-900:#0d1b3d; --navy-700:#1f4a86; --navy-400:#6fa6de; --bg:#0b1220; }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin:0; background:var(--bg); color:#fff;
         font:16px/1.6 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

  .gate { min-height:100%; display:grid; place-items:center; padding:24px; }
  .card { width:min(420px,100%); text-align:center; }
  .mark { width:60px; height:60px; color:var(--navy-400); margin-bottom:28px; }
  h1 { font-size:1.4rem; letter-spacing:-0.02em; margin:0 0 6px; }
  .sub { color:rgba(255,255,255,.55); font-size:.92rem; margin:0 0 28px; }
  form { display:flex; gap:8px; }
  input { flex:1; padding:13px 15px; border-radius:9px; background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.14); color:#fff; font-size:1rem; }
  input:focus { outline:none; border-color:var(--navy-400); background:rgba(255,255,255,.08); }
  button { padding:13px 20px; border:0; border-radius:9px; background:var(--navy-700); color:#fff;
           font-size:1rem; font-weight:600; cursor:pointer; }
  button:hover { background:#2c67ae; }
  button:disabled { opacity:.55; cursor:default; }
  .msg { min-height:1.4em; margin:16px 0 0; font-size:.88rem; color:#ff9b9b; }

  /* ---- unlocked ---- */
  .shell { display:none; height:100%; grid-template-rows:auto 1fr; }
  body.open .gate { display:none; }
  body.open .shell { display:grid; }
  header { display:flex; align-items:center; gap:18px; padding:12px 20px;
           background:var(--navy-900); border-bottom:1px solid rgba(255,255,255,.1); }
  header .mark { width:26px; height:26px; margin:0; flex:none; }
  nav { display:flex; gap:4px; flex-wrap:wrap; flex:1; }
  nav button { background:transparent; color:rgba(255,255,255,.6); font-weight:500;
               font-size:.88rem; padding:7px 12px; border-radius:7px; }
  nav button:hover { color:#fff; background:rgba(255,255,255,.07); }
  nav button[aria-current="true"] { color:#fff; background:rgba(255,255,255,.12); }
  .badge { font-size:.62rem; letter-spacing:.06em; text-transform:uppercase;
           color:var(--navy-400); margin-left:7px; }
  .dl { font-size:.82rem; color:var(--navy-400); background:transparent; padding:7px 12px;
        border:1px solid rgba(255,255,255,.16); border-radius:7px; font-weight:500; }
  .dl[hidden] { display:none; }
  iframe { width:100%; height:100%; border:0; background:#fff; }
</style>
</head>
<body>

<template id="mark">
  <svg class="mark" viewBox="0 0 64 72" fill="none" stroke="currentColor"
       stroke-linejoin="miter" stroke-miterlimit="10" aria-hidden="true">
    <path stroke-width="3.75" d="M32 2.06 L61.6 18.98 L61.6 52.82 L32 69.74 L2.4 52.82 L2.4 18.98 Z"/>
    <path stroke-width="6.7" stroke-linecap="butt"
          d="M16.25 23.9 L35.25 23.9 C41.65 23.9 46.85 28.7 46.85 35.9 C46.85 43.1 41.65 48.1 35.25 48.1 L19.6 48.1 L19.6 30.4"/>
  </svg>
</template>

<div class="gate">
  <div class="card">
    <div id="gate-mark"></div>
    <h1>Confidential documents</h1>
    <p class="sub">Prepared by Dozier Tech Group. Enter the password you were given.</p>
    <form id="f">
      <input id="pw" type="password" autocomplete="current-password"
             placeholder="Password" aria-label="Password" autofocus required>
      <button id="go" type="submit">Open</button>
    </form>
    <p class="msg" id="msg" role="status" aria-live="polite"></p>
  </div>
</div>

<div class="shell">
  <header>
    <div id="head-mark"></div>
    <nav id="tabs"></nav>
    <button class="dl" id="dl" hidden>Download .docx</button>
  </header>
  <iframe id="view" sandbox="allow-same-origin allow-popups allow-modals" title="Document"></iframe>
</div>

<script>
(function () {
  'use strict';
  var SALT = "${salt}", IV = "${iv}", CT = "${ct}", ITER = ${iterations};

  // The mark twice, from one template.
  [ 'gate-mark', 'head-mark' ].forEach(function (id) {
    document.getElementById(id).appendChild(
      document.getElementById('mark').content.cloneNode(true));
  });

  var b64 = function (s) {
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  };

  var form = document.getElementById('f'),
      pw   = document.getElementById('pw'),
      go   = document.getElementById('go'),
      msg  = document.getElementById('msg');

  if (!window.crypto || !window.crypto.subtle || !window.DecompressionStream) {
    msg.textContent = 'This browser is too old to open these documents. Please use a current Chrome, Edge, Firefox or Safari.';
    go.disabled = true;
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    go.disabled = true;
    msg.style.color = 'rgba(255,255,255,.55)';
    msg.textContent = 'Decrypting…';   // PBKDF2 at 250k iterations takes a moment.

    // Yield a frame so the message paints before the key derivation blocks.
    setTimeout(function () {
      unlock(pw.value).catch(function () {
        msg.style.color = '#ff9b9b';
        msg.textContent = 'That password did not open these documents.';
        go.disabled = false;
        pw.select();
      });
    }, 30);
  });

  function unlock(password) {
    var enc = new TextEncoder();
    return crypto.subtle
      .importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt: b64(SALT), iterations: ITER, hash: 'SHA-256' },
          base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      })
      .then(function (key) {
        // AES-GCM is authenticated: a wrong password rejects here rather than
        // handing back plausible garbage.
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(IV) }, key, b64(CT));
      })
      .then(function (gz) {
        var stream = new Blob([gz]).stream().pipeThrough(new DecompressionStream('gzip'));
        return new Response(stream).text();
      })
      .then(function (json) { render(JSON.parse(json)); });
  }

  function render(docs) {
    var tabs = document.getElementById('tabs'),
        view = document.getElementById('view'),
        dl   = document.getElementById('dl'),
        current = null;

    var show = function (i) {
      current = docs[i];
      Array.prototype.forEach.call(tabs.children, function (b, n) {
        b.setAttribute('aria-current', String(n === i));
      });
      view.srcdoc = current.html;
      dl.hidden = !current.docx;
      dl.textContent = current.sign ? 'Download to sign' : 'Download .docx';
    };

    docs.forEach(function (d, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = d.title;
      if (d.sign) {
        var s = document.createElement('span');
        s.className = 'badge';
        s.textContent = 'to sign';
        b.appendChild(s);
      }
      b.addEventListener('click', function () { show(i); });
      tabs.appendChild(b);
    });

    dl.addEventListener('click', function () {
      if (!current || !current.docx) return;
      var url = URL.createObjectURL(new Blob([b64(current.docx)], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
      var a = document.createElement('a');
      a.href = url; a.download = current.docxName;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });

    document.body.classList.add('open');
    show(0);
  }
})();
</script>
</body>
</html>
`;
}
