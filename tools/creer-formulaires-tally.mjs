// Crée les formulaires Tally du tunnel par API, depuis contenu/intake-53-questions.md.
// Usage : TALLY_API_KEY=tly-xxx node tools/creer-formulaires-tally.mjs
// La clé n'est JAMAIS écrite dans le repo.

import { randomUUID as u } from "crypto";
import { readFileSync } from "fs";

const KEY = process.env.TALLY_API_KEY;
if (!KEY) {
  console.error("TALLY_API_KEY manquante");
  process.exit(1);
}

const md = readFileSync(new URL("../contenu/intake-53-questions.md", import.meta.url), "utf8");

// --- mini-conversion markdown → html inline (gras/italique uniquement) ---
const html = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\*([^*]+)\*/g, "<i>$1</i>");

// --- parsing du fichier source ---
const lines = md.split("\n");
const blocks = [];
const text = (t) =>
  blocks.push({ uuid: u(), type: "TEXT", groupUuid: u(), groupType: "TEXT", payload: { html: html(t) } });
const heading = (t) =>
  blocks.push({ uuid: u(), type: "HEADING_2", groupUuid: u(), groupType: "HEADING_2", payload: { html: html(t) } });
const question = (t) =>
  blocks.push({ uuid: u(), type: "TITLE", groupUuid: u(), groupType: "QUESTION", payload: { html: html(t) } });
const textarea = (requis = true, placeholder = "Ta réponse…") =>
  blocks.push({
    uuid: u(),
    type: "TEXTAREA",
    groupUuid: u(),
    groupType: "TEXTAREA",
    payload: { isRequired: requis, placeholder },
  });
// Choix unique (MULTIPLE_CHOICE) ou multiple (CHECKBOXES) si la question
// annonce « plusieurs réponses possibles » / « coche tout ».
const choices = (options, multi = false) => {
  const g = u();
  const type = multi ? "CHECKBOX" : "MULTIPLE_CHOICE_OPTION";
  const groupType = multi ? "CHECKBOXES" : "MULTIPLE_CHOICE";
  options.forEach((opt, i) =>
    blocks.push({
      uuid: u(),
      type,
      groupUuid: g,
      groupType,
      payload: { index: i, text: opt, isFirst: i === 0, isLast: i === options.length - 1, isRequired: !multi },
    })
  );
};

blocks.push({
  uuid: u(),
  type: "FORM_TITLE",
  groupUuid: u(),
  groupType: "TEXT",
  payload: { title: "53 Questions Sur Mesure — Les 53 questions", html: "53 Questions Sur Mesure — Les 53 questions" },
});

// État du parseur
let i = 0;
let enIntro = true;
let questionEnCours = null; // texte de la question en construction
let optionsEnCours = [];
let suiviEnCours = null; // ligne « ↳ … » : champ de précision facultatif après les choix

const flushQuestion = () => {
  if (!questionEnCours) return;
  if (optionsEnCours.length > 0) {
    const multi = /plusieurs réponses possibles|coche tout/i.test(questionEnCours);
    question(questionEnCours);
    choices(optionsEnCours, multi);
    if (suiviEnCours) {
      question(suiviEnCours + " (facultatif)");
      textarea(false, "Ta précision…");
    }
  } else {
    question(questionEnCours);
    textarea();
  }
  questionEnCours = null;
  optionsEnCours = [];
  suiviEnCours = null;
};

for (; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith("# ")) continue; // titre du doc (déjà en FORM_TITLE)
  if (line === "---") continue;

  const section = line.match(/^## (.+)$/);
  if (section) {
    flushQuestion();
    // L'intro ne se termine qu'à la première VRAIE section (A., B., ...)
    if (enIntro && /^[A-G]\./.test(section[1])) {
      enIntro = false;
      // L'email de croisement Stripe vient AVANT la section A
      question("Quel email as-tu utilisé pour payer ? (c'est la clé qui relie ta commande à tes réponses)");
      blocks.push({
        uuid: u(),
        type: "INPUT_EMAIL",
        groupUuid: u(),
        groupType: "INPUT_EMAIL",
        payload: { isRequired: true, placeholder: "ton@email.com" },
      });
    }
    heading(section[1]);
    continue;
  }

  const debutQuestion = line.match(/^\*\*(\d+[a-z]?)\.\*\*\s*(.*)$/);
  if (debutQuestion) {
    flushQuestion();
    questionEnCours = `${debutQuestion[1]}. ${debutQuestion[2]}`;
    continue;
  }

  // Options « - A. … » à « - H. … » et échelles numériques « - 1. … » à « - 9. … »
  const option = line.match(/^- ([A-H]|[1-9])[.)]\s+(.*)$/);
  if (option && questionEnCours) {
    optionsEnCours.push(`${option[1]}. ${option[2]}`);
    continue;
  }

  // « ↳ Si oui : … » → champ de précision facultatif rattaché à la question à choix
  const suivi = line.match(/^↳\s*(.*)$/);
  if (suivi && questionEnCours) {
    suiviEnCours = suivi[1];
    continue;
  }

  if (line === "") continue;

  if (questionEnCours && optionsEnCours.length === 0) {
    // suite du texte de la question (ligne enroulée)
    questionEnCours += " " + line;
  } else if (enIntro) {
    text(line);
  }
  // les lignes après options ou hors structure sont ignorées
}
flushQuestion();

text("Merci ! Clique sur « Envoyer » — ton rapport personnalisé arrive par email sous 48 h.");

const creer = async (payload) => {
  const res = await fetch("https://api.tally.so/forms", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (res.status !== 201) {
    console.error("ERREUR", res.status, JSON.stringify(body).slice(0, 500));
    process.exit(1);
  }
  return body;
};

// --- Formulaire 1 : les 53 questions ---
const nbQuestions = blocks.filter((b) => b.groupType === "QUESTION").length;
const f1 = await creer({
  status: "PUBLISHED",
  blocks,
  settings: { language: "fr", hasSelfEmailNotifications: true },
});
console.log(`50Q : https://tally.so/r/${f1.id} (${nbQuestions} questions, ${blocks.length} blocs)`);

// --- Formulaire 2 : profil par email (mini-test) ---
if (process.env.SKIP_EMAIL_FORM === "1") { process.exit(0); }
const b2 = [
  {
    uuid: u(),
    type: "FORM_TITLE",
    groupUuid: u(),
    groupType: "TEXT",
    payload: { title: "Votre profil entrepreneur — par email", html: "Votre profil entrepreneur — par email" },
  },
  {
    uuid: u(),
    type: "TEXT",
    groupUuid: u(),
    groupType: "TEXT",
    payload: {
      html: "Laisse ton email : tu reçois ton profil détaillé et les catégories de business qui correspondent à ta situation. Pas de spam, jamais.",
    },
  },
  { uuid: u(), type: "TITLE", groupUuid: u(), groupType: "QUESTION", payload: { html: "Ton email" } },
  {
    uuid: u(),
    type: "INPUT_EMAIL",
    groupUuid: u(),
    groupType: "INPUT_EMAIL",
    payload: { isRequired: true, placeholder: "ton@email.com" },
  },
  {
    uuid: u(),
    type: "HIDDEN_FIELDS",
    groupUuid: u(),
    groupType: "HIDDEN_FIELDS",
    payload: { hiddenFields: [{ uuid: u(), name: "profil" }] },
  },
];
const f2 = await creer({
  status: "PUBLISHED",
  blocks: b2,
  settings: { language: "fr", hasSelfEmailNotifications: true },
});
console.log(`EMAIL : https://tally.so/r/${f2.id}`);
