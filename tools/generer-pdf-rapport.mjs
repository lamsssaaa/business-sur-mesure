// Markdown → HTML de marque, prêt pour le PDF (via gstack).
// Usage : node tools/generer-pdf-rapport.mjs contenu/rapport-exemple.md /tmp/rapport.html
// Puis : $B load-html /tmp/rapport.html --wait-until networkidle && $B pdf sortie.pdf --format a4 --print-background --page-numbers --margins 16mm

import { readFileSync, writeFileSync } from "fs";
import { execFileSync } from "child_process";

const [, , entree, sortie] = process.argv;
if (!entree || !sortie) {
  console.error("Usage : node tools/generer-pdf-rapport.mjs <entree.md> <sortie.html>");
  process.exit(1);
}

const corps = execFileSync("npx", ["-y", "marked", "--gfm", "-i", entree], {
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
});

const page = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Hanken+Grotesk:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
  :root { --paper:#faf9f6; --ink:#16181d; --muted:#5c6168; --accent:#0e6b4f; --soft:#e7f2ee; --line:#e5e2db; --gold:#b88a2e; }
  * { box-sizing:border-box; }
  body { font-family:'Hanken Grotesk',sans-serif; color:var(--ink); background:#fff; font-size:11.5pt; line-height:1.55; margin:0; padding:0 4mm; }
  h1,h2,h3,h4 { font-family:'Fraunces',serif; letter-spacing:-0.01em; line-height:1.15; page-break-after:avoid; }
  h1 { font-size:26pt; color:var(--ink); margin:14mm 0 4mm; }
  h2 { font-size:17pt; color:var(--accent); margin:10mm 0 3mm; border-bottom:2px solid var(--soft); padding-bottom:2mm; }
  h3 { font-size:13pt; margin:7mm 0 2mm; }
  p { margin:0 0 3.2mm; }
  em { color:var(--muted); }
  strong { color:var(--ink); }
  a { color:var(--accent); }
  blockquote { margin:4mm 0; padding:4mm 5mm; background:var(--soft); border-left:3px solid var(--accent); border-radius:2mm; page-break-inside:avoid; }
  blockquote p { margin:0 0 2mm; }
  table { width:100%; border-collapse:collapse; margin:4mm 0; font-size:10.5pt; page-break-inside:avoid; }
  th { background:var(--accent); color:#fff; text-align:left; padding:2.4mm 3mm; font-weight:600; }
  td { padding:2.2mm 3mm; border-bottom:1px solid var(--line); vertical-align:top; }
  tr:nth-child(even) td { background:#f6f5f1; }
  ul,ol { margin:0 0 3.5mm; padding-left:6mm; }
  li { margin-bottom:1.4mm; }
  hr { border:none; border-top:1px solid var(--line); margin:8mm 0; }
  code { background:var(--soft); padding:0.4mm 1.5mm; border-radius:1mm; font-size:10pt; }
</style></head>
<body>
${corps}
</body></html>`;

writeFileSync(sortie, page);
console.log(`HTML prêt : ${sortie} (${Math.round(page.length / 1024)} Ko)`);
