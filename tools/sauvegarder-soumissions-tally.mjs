// Sauvegarde locale des soumissions Tally (les réponses clients ne doivent pas
// vivre UNIQUEMENT chez Tally). À lancer régulièrement (ex. après chaque commande).
// Usage : TALLY_API_KEY=tly-xxx node tools/sauvegarder-soumissions-tally.mjs
// Sortie : sauvegardes/tally-<formId>-<date>.json (dossier gitignoré : données personnelles)

import { mkdirSync, writeFileSync } from "fs";

const KEY = process.env.TALLY_API_KEY;
if (!KEY) {
  console.error("TALLY_API_KEY manquante (crée une clé sur tally.so/settings/api-keys)");
  process.exit(1);
}

const FORMS = [
  { id: "NpOlEj", nom: "50-questions" },
  { id: "Ek6jxA", nom: "capture-email" },
];

mkdirSync(new URL("../sauvegardes", import.meta.url), { recursive: true });
const jour = new Date().toISOString().slice(0, 10);

for (const f of FORMS) {
  let page = 1;
  const toutes = [];
  for (;;) {
    const res = await fetch(`https://api.tally.so/forms/${f.id}/submissions?page=${page}`, {
      headers: { Authorization: `Bearer ${KEY}` },
    });
    if (!res.ok) {
      console.error(`${f.nom} : HTTP ${res.status}`);
      break;
    }
    const data = await res.json();
    toutes.push(...(data.submissions ?? []));
    if (!data.hasMore && page >= (data.totalPages ?? 1)) break;
    if (!(data.submissions ?? []).length) break;
    page++;
  }
  const chemin = new URL(`../sauvegardes/tally-${f.nom}-${jour}.json`, import.meta.url);
  writeFileSync(chemin, JSON.stringify(toutes, null, 2));
  console.log(`${f.nom} : ${toutes.length} soumission(s) → sauvegardes/tally-${f.nom}-${jour}.json`);
}
