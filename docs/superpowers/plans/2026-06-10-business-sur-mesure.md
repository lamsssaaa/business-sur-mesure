# « Ton Business Sur Mesure » — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en ligne le tunnel complet du service « Ton Business Sur Mesure » : site one-page + mini-test intégré + pages légales, déployé sur GitHub Pages, avec le guide de branchement Tally/Stripe.

**Architecture:** Site statique Next.js (App Router, `output: 'export'`) dans `site/`, déployé sur GitHub Pages via GitHub Actions (`basePath /business-sur-mesure`). Le mini-test (10 questions → profil) est un composant client React DANS le site (pas dans Tally) : scoring instantané, zéro dépendance. Tally ne sert qu'au questionnaire 50 questions (post-achat) et à la capture d'email optionnelle. Stripe Payment Link pour le paiement. Tous les textes viennent de `contenu/site-copy.md` et `contenu/mini-test-10-questions.md`, transcrits VERBATIM dans `lib/copy.ts` et `lib/quiz.ts` (source de vérité = les fichiers `contenu/`).

**Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 (`@tailwindcss/postcss`) ; GitHub Pages + Actions ; gstack pour la QA ; Tally (formulaires) + Stripe Payment Link (paiement) côté externe.

---

## Déjà fait (ne pas refaire)

- Spec validée : `docs/superpowers/specs/2026-06-10-business-sur-mesure-design.md` (commit `ab7deea`)
- Contenu v1 rédigé + vérifié : 7 fichiers dans `contenu/` (commit `00dbe2e`) — **ces fichiers sont la source de vérité des textes.**

## Structure de fichiers cible

```
~/business-sur-mesure/
├── contenu/                      ← fait (7 fichiers, source de vérité des textes)
├── docs/superpowers/{specs,plans}/
├── .github/workflows/deploy.yml  ← Task 7
└── site/                         ← Tasks 1-6
    ├── package.json, tsconfig.json, next.config.ts, postcss.config.mjs, .gitignore
    ├── app/
    │   ├── layout.tsx, globals.css, page.tsx
    │   ├── mini-test/page.tsx
    │   ├── merci/page.tsx
    │   ├── confidentialite/page.tsx
    │   └── conditions/page.tsx
    ├── components/  (Section, CtaButton, Hero, Etapes, Recois, UnSeul, Qui, Prix, Faq, Footer, Quiz)
    └── lib/ (config.ts, copy.ts, quiz.ts)
```

Règle générale : après chaque task → `npm run build` doit passer → commit. Un build cassé ne se committe jamais.

---

### Task 1 : Scaffold du site Next.js statique

**Files:**
- Create: `site/package.json`, `site/tsconfig.json`, `site/next.config.ts`, `site/postcss.config.mjs`, `site/.gitignore`, `site/app/layout.tsx`, `site/app/globals.css`, `site/app/page.tsx` (provisoire)

- [ ] **Step 1 : Écrire `site/package.json`**

```json
{
  "name": "business-sur-mesure-site",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2 : Écrire `site/next.config.ts`** (basePath seulement pour GitHub Pages)

```ts
import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isPages ? "/business-sur-mesure" : "",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3 : Écrire `site/postcss.config.mjs`**

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

- [ ] **Step 4 : Écrire `site/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5 : Écrire `site/.gitignore`**

```
node_modules/
.next/
out/
next-env.d.ts
*.tsbuildinfo
```

- [ ] **Step 6 : Écrire `site/app/globals.css`** (thème : papier clair, encre sombre, accent vert profond — sobre et digne de confiance, pas de dégradés criards)

```css
@import "tailwindcss";

@theme {
  --color-paper: #faf9f6;
  --color-ink: #16181d;
  --color-muted: #5c6168;
  --color-accent: #0e6b4f;
  --color-accent-soft: #e7f2ee;
  --color-line: #e5e2db;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-paper);
  color: var(--color-ink);
}
```

- [ ] **Step 7 : Écrire `site/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ton Business Sur Mesure — LE business à lancer, selon TON profil",
  description:
    "Réponds à 50 questions sur ton expérience, tes compétences, ton budget et ton temps — on te dit LE business à lancer, et comment, en 30 jours. Rapport personnalisé, livré en 48 h.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8 : Écrire `site/app/page.tsx` provisoire** (remplacé en Task 4)

```tsx
export default function Home() {
  return <main className="p-10">Ton Business Sur Mesure — en construction</main>;
}
```

- [ ] **Step 9 : Installer et builder**

Run: `cd ~/business-sur-mesure/site && npm install && npm run build`
Expected: build réussi, dossier `out/` créé avec `index.html`.

- [ ] **Step 10 : Commit**

```bash
cd ~/business-sur-mesure && git add site/ && git commit -m "feat: scaffold site Next.js statique (export, Tailwind v4)"
```

---

### Task 2 : `lib/config.ts` — la configuration centrale du tunnel

**Files:**
- Create: `site/lib/config.ts`

- [ ] **Step 1 : Écrire `site/lib/config.ts`**

Les 3 URLs externes sont centralisées ICI et nulle part ailleurs. Les valeurs `A_REMPLACER` sont remplies via `contenu/guide-branchement.md` (Task 8) AVANT le lancement public (le site peut être déployé avant — personne ne le visite tant que les vidéos ne sont pas publiées).

```ts
export const LINKS = {
  // Formulaire Tally des 50 questions (envoyé après paiement) — voir contenu/guide-branchement.md
  questionnaire: "https://tally.so/r/A_REMPLACER_50Q",
  // Stripe Payment Link 49.90 CHF — voir contenu/guide-branchement.md
  paiement: "https://buy.stripe.com/A_REMPLACER",
  // Formulaire Tally de capture email sur le résultat du mini-test (optionnel v1)
  profilParEmail: "https://tally.so/r/A_REMPLACER_EMAIL",
};

// Adresse de contact affichée sur le site et dans les emails.
// v1 : adresse perso ; à remplacer par une adresse dédiée dès que le domaine est acheté.
export const CONTACT_EMAIL = "questions.53@outlook.com";

// Rempli après les 3 rapports offerts (prénom + autorisation obtenue). Tant que vide,
// la section témoignages n'apparaît pas — on n'invente JAMAIS de témoignage.
export const TEMOIGNAGES: { prenom: string; texte: string }[] = [];
```

- [ ] **Step 2 : Build + commit**

Run: `cd ~/business-sur-mesure/site && npm run build`
Expected: PASS.

```bash
cd ~/business-sur-mesure && git add site/lib/config.ts && git commit -m "feat: config centrale du tunnel (liens Tally/Stripe, contact, témoignages)"
```

---

### Task 3 : `lib/copy.ts` et `lib/quiz.ts` — transcription des contenus

**Files:**
- Create: `site/lib/copy.ts` — transcription VERBATIM de `contenu/site-copy.md`
- Create: `site/lib/quiz.ts` — transcription VERBATIM de `contenu/mini-test-10-questions.md`

- [ ] **Step 1 : Lire `contenu/site-copy.md` en entier** (8 sections : HERO, COMMENT ÇA MARCHE, CE QUE TU REÇOIS, POURQUOI UN SEUL BUSINESS, QUI EST DERRIÈRE, PRIX, FAQ ×7, FOOTER).

- [ ] **Step 2 : Écrire `site/lib/copy.ts`** dans cette structure exacte — chaque champ est rempli avec le texte EXACT du fichier source (aucune réécriture, aucune coupe) :

```ts
export const COPY = {
  hero: { titre: "", sousTitre: "", cta: "", reassurance: "" },
  etapes: [{ titre: "", texte: "" }, { titre: "", texte: "" }, { titre: "", texte: "" }],
  recois: { items: ["", "", "", "", ""], mention: "" },
  unSeul: { titre: "", texte: "" },
  qui: { titre: "", texte: "" },
  prix: { montant: "49.90 CHF", inclus: ["", "", ""], garantie: "" },
  faq: [{ q: "", r: "" }] as { q: string; r: string }[], // les 7 Q/R du fichier
  footer: { disclaimer: "", copyright: "" },
};
```

- [ ] **Step 3 : Lire `contenu/mini-test-10-questions.md` en entier** (10 questions × 4 options A/B/C/D, 4 profils, règle d'égalité : la Q5 tranche, puis la Q1).

- [ ] **Step 4 : Écrire `site/lib/quiz.ts`** — questions et profils transcrits VERBATIM, plus la fonction de scoring :

```ts
export type Lettre = "A" | "B" | "C" | "D";

export const QUESTIONS: { titre: string; question: string; options: Record<Lettre, string> }[] = [
  // ...les 10 questions du fichier, textes exacts
];

export const PROFILS: Record<
  Lettre,
  { nom: string; emoji: string; description: string; categories: string[]; rapportFeraitQuoi: string }
> = {
  A: { nom: "Le Bâtisseur", emoji: "🧱", description: "", categories: [], rapportFeraitQuoi: "" },
  B: { nom: "Le Sprinteur", emoji: "⚡", description: "", categories: [], rapportFeraitQuoi: "" },
  C: { nom: "", emoji: "", description: "", categories: [], rapportFeraitQuoi: "" },
  D: { nom: "", emoji: "", description: "", categories: [], rapportFeraitQuoi: "" },
};

// Majorité de A/B/C/D → profil. Égalité : la réponse à la Q5 (index 4) tranche ;
// si l'égalité persiste, la réponse à la Q1 (index 0) tranche.
export function calculerProfil(reponses: Lettre[]): Lettre {
  const score: Record<Lettre, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const r of reponses) score[r]++;
  const max = Math.max(...Object.values(score));
  const exAequo = (Object.keys(score) as Lettre[]).filter((l) => score[l] === max);
  if (exAequo.length === 1) return exAequo[0];
  if (exAequo.includes(reponses[4])) return reponses[4];
  if (exAequo.includes(reponses[0])) return reponses[0];
  return exAequo[0];
}
```

- [ ] **Step 5 : Vérification de transcription** — comparer ligne à ligne avec les fichiers `contenu/` : 7 entrées FAQ, 10 questions, 4 profils complets, aucun texte tronqué.

- [ ] **Step 6 : Build + commit**

Run: `cd ~/business-sur-mesure/site && npm run build`
Expected: PASS.

```bash
cd ~/business-sur-mesure && git add site/lib/ && git commit -m "feat: textes du site et données du mini-test (transcription contenu/)"
```

---

### Task 4 : La page de vente (composants + page d'accueil)

**Files:**
- Create: `site/components/Section.tsx`, `site/components/CtaButton.tsx`, `site/components/Faq.tsx`, `site/components/Footer.tsx`
- Modify: `site/app/page.tsx` (remplace le provisoire)

- [ ] **Step 1 : Écrire `site/components/Section.tsx`**

```tsx
export default function Section({
  id,
  children,
  alt = false,
}: {
  id?: string;
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section id={id} className={alt ? "bg-accent-soft" : ""}>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2 : Écrire `site/components/CtaButton.tsx`**

```tsx
import Link from "next/link";

export default function CtaButton({
  href,
  children,
  externe = false,
}: {
  href: string;
  children: React.ReactNode;
  externe?: boolean;
}) {
  const cls =
    "inline-block rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:opacity-90";
  return externe ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 3 : Écrire `site/components/Faq.tsx`** (accordéon natif `<details>`, zéro JS)

```tsx
import { COPY } from "@/lib/copy";

export default function Faq() {
  return (
    <div className="space-y-3">
      {COPY.faq.map((item) => (
        <details key={item.q} className="rounded-lg border border-line bg-white p-4">
          <summary className="cursor-pointer font-medium">{item.q}</summary>
          <p className="mt-3 whitespace-pre-line text-muted">{item.r}</p>
        </details>
      ))}
    </div>
  );
}
```

- [ ] **Step 4 : Écrire `site/components/Footer.tsx`**

```tsx
import Link from "next/link";
import { COPY } from "@/lib/copy";
import { CONTACT_EMAIL } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-10 text-sm text-muted">
        <p>{COPY.footer.disclaimer}</p>
        <p>
          Contact : <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {" · "}
          <Link className="underline" href="/confidentialite/">Confidentialité</Link>
          {" · "}
          <Link className="underline" href="/conditions/">Conditions</Link>
        </p>
        <p>{COPY.footer.copyright}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5 : Écrire `site/app/page.tsx`** — assemble tout, dans l'ordre du fichier site-copy. La section témoignages ne s'affiche que si `TEMOIGNAGES.length > 0`.

```tsx
import Section from "@/components/Section";
import CtaButton from "@/components/CtaButton";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { COPY } from "@/lib/copy";
import { TEMOIGNAGES } from "@/lib/config";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <Section>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{COPY.hero.titre}</h1>
        <p className="mt-5 text-xl text-muted">{COPY.hero.sousTitre}</p>
        <div className="mt-8">
          <CtaButton href="/mini-test/">{COPY.hero.cta}</CtaButton>
          <p className="mt-3 text-sm text-muted">{COPY.hero.reassurance}</p>
        </div>
      </Section>

      {/* COMMENT ÇA MARCHE */}
      <Section alt id="comment">
        <h2 className="text-3xl font-bold">Comment ça marche</h2>
        <ol className="mt-8 space-y-6">
          {COPY.etapes.map((e, i) => (
            <li key={e.titre} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold">{e.titre}</h3>
                <p className="text-muted">{e.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* CE QUE TU REÇOIS */}
      <Section id="rapport">
        <h2 className="text-3xl font-bold">Ce que tu reçois</h2>
        <ul className="mt-8 space-y-3">
          {COPY.recois.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="text-accent">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-medium text-accent">{COPY.recois.mention}</p>
      </Section>

      {/* POURQUOI UN SEUL BUSINESS */}
      <Section alt>
        <h2 className="text-3xl font-bold">{COPY.unSeul.titre}</h2>
        <p className="mt-5 whitespace-pre-line text-lg text-muted">{COPY.unSeul.texte}</p>
      </Section>

      {/* TÉMOIGNAGES — seulement quand il y en a de VRAIS */}
      {TEMOIGNAGES.length > 0 && (
        <Section id="temoignages">
          <h2 className="text-3xl font-bold">Ils ont reçu leur rapport</h2>
          <div className="mt-8 space-y-6">
            {TEMOIGNAGES.map((t) => (
              <blockquote key={t.prenom} className="rounded-lg border border-line bg-white p-5">
                <p>« {t.texte} »</p>
                <cite className="mt-2 block text-sm text-muted">— {t.prenom}</cite>
              </blockquote>
            ))}
          </div>
        </Section>
      )}

      {/* QUI EST DERRIÈRE */}
      <Section>
        <h2 className="text-3xl font-bold">{COPY.qui.titre}</h2>
        <p className="mt-5 whitespace-pre-line text-lg text-muted">{COPY.qui.texte}</p>
      </Section>

      {/* PRIX */}
      <Section alt id="prix">
        <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
          <p className="text-5xl font-bold">{COPY.prix.montant}</p>
          <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
            {COPY.prix.inclus.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="text-accent">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">{COPY.prix.garantie}</p>
          <div className="mt-8">
            <CtaButton href="/mini-test/">Commence par le mini-test gratuit</CtaButton>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <h2 className="text-3xl font-bold">Questions fréquentes</h2>
        <div className="mt-8">
          <Faq />
        </div>
      </Section>

      <Footer />
    </main>
  );
}
```

- [ ] **Step 6 : Build + vérification visuelle rapide**

Run: `cd ~/business-sur-mesure/site && npm run build`
Expected: PASS, pas d'avertissement de page manquante.

- [ ] **Step 7 : Commit**

```bash
cd ~/business-sur-mesure && git add site/ && git commit -m "feat: page de vente one-page complète"
```

---

### Task 5 : Le mini-test intégré (quiz client)

**Files:**
- Create: `site/components/Quiz.tsx`
- Create: `site/app/mini-test/page.tsx`

- [ ] **Step 1 : Écrire `site/components/Quiz.tsx`** — composant client : une question à la fois, barre de progression, résultat instantané avec le profil + CTA achat + lien « reçois ton profil par email ».

```tsx
"use client";

import { useState } from "react";
import { QUESTIONS, PROFILS, calculerProfil, type Lettre } from "@/lib/quiz";
import { LINKS } from "@/lib/config";

export default function Quiz() {
  const [reponses, setReponses] = useState<Lettre[]>([]);
  const etape = reponses.length;
  const fini = etape >= QUESTIONS.length;

  if (fini) {
    const lettre = calculerProfil(reponses);
    const p = PROFILS[lettre];
    return (
      <div className="rounded-2xl border border-line bg-white p-8">
        <p className="text-sm uppercase tracking-wide text-muted">Ton profil</p>
        <h2 className="mt-2 text-3xl font-bold">
          {p.emoji} {p.nom}
        </h2>
        <p className="mt-4 whitespace-pre-line text-muted">{p.description}</p>
        <h3 className="mt-6 font-semibold">Les catégories qui te conviennent en général :</h3>
        <ul className="mt-2 list-disc pl-6 text-muted">
          {p.categories.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="mt-6 font-medium">{p.rapportFeraitQuoi}</p>
        <div className="mt-8 space-y-3">
          <a
            href={LINKS.paiement}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl bg-accent px-8 py-4 text-center text-lg font-semibold text-white"
          >
            Reçois TON business sur mesure — rapport complet 49.90 CHF
          </a>
          <a
            href={`${LINKS.profilParEmail}?profil=${encodeURIComponent(p.nom)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-muted underline"
          >
            📩 Reçois ton profil détaillé par email
          </a>
          <button onClick={() => setReponses([])} className="block w-full text-center text-sm text-muted underline">
            Refaire le test
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[etape];
  return (
    <div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-accent transition-all" style={{ width: `${(etape / QUESTIONS.length) * 100}%` }} />
      </div>
      <p className="text-sm text-muted">
        Question {etape + 1} / {QUESTIONS.length} — {q.titre}
      </p>
      <h2 className="mt-2 text-2xl font-bold">{q.question}</h2>
      <div className="mt-6 space-y-3">
        {(Object.keys(q.options) as Lettre[]).map((l) => (
          <button
            key={l}
            onClick={() => setReponses([...reponses, l])}
            className="block w-full rounded-xl border border-line bg-white p-4 text-left transition hover:border-accent hover:bg-accent-soft"
          >
            {q.options[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Écrire `site/app/mini-test/page.tsx`**

```tsx
import type { Metadata } from "next";
import Quiz from "@/components/Quiz";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mini-test gratuit (2 min) — Quel entrepreneur es-tu ?",
};

export default function MiniTest() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <h1 className="text-3xl font-bold">Quel entrepreneur es-tu ?</h1>
        <p className="mt-2 text-muted">10 questions, 2 minutes, résultat immédiat. Gratuit, sans engagement.</p>
        <div className="mt-10">
          <Quiz />
        </div>
      </div>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3 : Build + test manuel du scoring**

Run: `cd ~/business-sur-mesure/site && npm run build`
Expected: PASS. Puis vérifier la logique : 10 réponses « A » → profil A ; 5 A + 5 B avec Q5=B → profil B (la Q5 tranche).

- [ ] **Step 4 : Commit**

```bash
cd ~/business-sur-mesure && git add site/ && git commit -m "feat: mini-test intégré (10 questions, 4 profils, scoring instantané)"
```

---

### Task 6 : Pages merci, confidentialité, conditions

**Files:**
- Create: `site/app/merci/page.tsx`, `site/app/confidentialite/page.tsx`, `site/app/conditions/page.tsx`

- [ ] **Step 1 : Écrire `site/app/merci/page.tsx`** (page de retour après paiement Stripe)

```tsx
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { LINKS, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Merci ! Dernière étape : tes 50 questions" };

export default function Merci() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Merci, ton paiement est bien reçu ✅</h1>
        <p className="mt-4 text-lg text-muted">
          Dernière étape : réponds aux 50 questions (20-30 minutes, au calme). Ton rapport personnalisé
          arrive par email <strong>sous 48 h</strong> après réception de tes réponses.
        </p>
        <a
          href={LINKS.questionnaire}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white"
        >
          Répondre aux 50 questions
        </a>
        <p className="mt-6 text-sm text-muted">
          Un souci, une question ? Écris à <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          Garantie satisfait ou remboursé 14 jours.
        </p>
      </div>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2 : Écrire `site/app/confidentialite/page.tsx`** avec ce contenu exact :

```tsx
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Confidentialité — Ton Business Sur Mesure" };

export default function Confidentialite() {
  return (
    <main>
      <div className="prose mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold">Confidentialité</h1>
        <div className="mt-6 space-y-4 text-muted">
          <p>
            <strong className="text-ink">Ce qu'on collecte.</strong> Ton adresse email et tes réponses aux
            questionnaires (mini-test et questionnaire de 50 questions). Rien d'autre — pas de cookies
            publicitaires, pas de traqueurs.
          </p>
          <p>
            <strong className="text-ink">Pourquoi.</strong> Uniquement pour produire ton rapport personnalisé et
            te l'envoyer. Tes réponses sont analysées avec l'aide d'une intelligence artificielle (Claude,
            d'Anthropic), puis relues et validées par un humain.
          </p>
          <p>
            <strong className="text-ink">Ce qu'on ne fait jamais.</strong> Vendre, louer ou partager tes données.
            Elles ne servent à rien d'autre qu'à ton rapport.
          </p>
          <p>
            <strong className="text-ink">Combien de temps.</strong> Tes réponses sont conservées le temps de
            produire et garantir ton rapport (90 jours), puis supprimées. Tu peux demander leur suppression à
            tout moment, avant comme après.
          </p>
          <p>
            <strong className="text-ink">Tes droits.</strong> Accès, rectification, suppression : un email à{" "}
            <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> suffit. Service basé à
            Genève, Suisse (LPD) ; les clients de l'UE bénéficient des droits équivalents du RGPD.
          </p>
          <p>
            <strong className="text-ink">Prestataires techniques.</strong> Paiement : Stripe. Formulaires : Tally.
            Analyse : Anthropic (Claude). Chacun ne reçoit que le strict nécessaire à sa fonction.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3 : Écrire `site/app/conditions/page.tsx`** avec ce contenu exact :

```tsx
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Conditions — Ton Business Sur Mesure" };

export default function Conditions() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold">Conditions du service</h1>
        <div className="mt-6 space-y-4 text-muted">
          <p>
            <strong className="text-ink">Le service.</strong> « Ton Business Sur Mesure » est un service
            d'orientation entrepreneuriale : à partir de tes réponses à un questionnaire de 50 questions, tu
            reçois un rapport personnalisé (PDF, 12-18 pages) recommandant UN business adapté à ton profil, avec
            un plan d'action sur 30 jours, un budget de démarrage et des conseils concrets.
          </p>
          <p>
            <strong className="text-ink">Prix et paiement.</strong> 49.90 CHF, paiement unique via Stripe. Pas
            d'abonnement, pas de frais cachés.
          </p>
          <p>
            <strong className="text-ink">Délai de livraison.</strong> 48 h au plus tard après réception de tes
            réponses complètes au questionnaire.
          </p>
          <p>
            <strong className="text-ink">Garantie.</strong> Satisfait ou remboursé pendant 14 jours après la
            livraison du rapport : un email suffit, sans justification. Si tu ne remplis pas le questionnaire
            dans les 14 jours malgré nos rappels, tu es remboursé automatiquement.
          </p>
          <p>
            <strong className="text-ink">Ce que le service n'est pas.</strong> Ce rapport est une orientation
            entrepreneuriale. Il ne constitue pas un conseil financier, juridique, fiscal ou en investissement.
            Aucun revenu n'est garanti : les résultats dépendent de ton travail, de ton marché et de ton
            contexte. Vérifie les exigences légales de ton pays avant de te lancer.
          </p>
          <p>
            <strong className="text-ink">Droit applicable.</strong> Droit suisse. Service exploité depuis Genève,
            Suisse. Contact : <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4 : Build + commit**

Run: `cd ~/business-sur-mesure/site && npm run build`
Expected: PASS — `out/` contient `index.html`, `mini-test/`, `merci/`, `confidentialite/`, `conditions/`.

```bash
cd ~/business-sur-mesure && git add site/ && git commit -m "feat: pages merci, confidentialité et conditions"
```

---

### Task 7 : QA locale avec gstack

**Files:** aucun nouveau (corrections éventuelles dans `site/`).

- [ ] **Step 1 : Servir le build statique**

Run: `cd ~/business-sur-mesure/site && npm run build && npx serve out -l 3210` (en arrière-plan)

- [ ] **Step 2 : Invoquer la skill gstack** et vérifier sur `http://localhost:3210` :
  1. La home charge ; le `<h1>` contient le titre du hero de `lib/copy.ts`.
  2. Le CTA hero pointe vers `/mini-test/`.
  3. Le mini-test fonctionne : cliquer 10 réponses « A » → le profil A s'affiche avec le bouton 49.90 CHF.
  4. `/merci/`, `/confidentialite/`, `/conditions/` chargent sans 404.
  5. Le footer affiche le disclaimer + les 2 liens légaux sur toutes les pages.
  6. Capture d'écran en 390 px de large (mobile) : rien ne déborde, le quiz est utilisable au pouce.

- [ ] **Step 3 : Corriger tout problème trouvé, re-builder, re-vérifier** (boucle jusqu'à zéro problème).

- [ ] **Step 4 : Commit** (si corrections)

```bash
cd ~/business-sur-mesure && git add site/ && git commit -m "fix: corrections QA locale (gstack)"
```

---

### Task 8 : Déploiement GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml` (à la racine du repo)

- [ ] **Step 1 : Écrire `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      GITHUB_PAGES: "true"
    defaults:
      run:
        working-directory: site
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: site/package-lock.json
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site/out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2 : Vérifier l'authentification GitHub**

Run: `gh auth status`
Expected: connecté (compte `lamsssaaa`). Sinon : `gh auth login` (action utilisateur).

- [ ] **Step 3 : Créer le repo et pousser**

```bash
cd ~/business-sur-mesure
git branch -M main
git add -A && git commit -m "feat: workflow de déploiement GitHub Pages" 
gh repo create business-sur-mesure --public --source . --push
```

- [ ] **Step 4 : Activer Pages en mode workflow**

Run: `gh api repos/lamsssaaa/business-sur-mesure/pages -X POST -f build_type=workflow`
Expected: HTTP 201 (ou 409 si déjà activé — OK). Puis relancer le workflow si besoin : `gh workflow run deploy.yml && gh run watch`

- [ ] **Step 5 : QA live avec gstack** sur `https://lamsssaaa.github.io/business-sur-mesure/` — rejouer les 6 vérifications de la Task 7 (le basePath change les chemins : vérifier que CSS et navigation interne fonctionnent).

---

### Task 9 : Guide de branchement (Tally + Stripe + lancement)

**Files:**
- Create: `contenu/guide-branchement.md`

- [ ] **Step 1 : Écrire `contenu/guide-branchement.md`** avec ce contenu exact :

```markdown
# Guide de branchement — du site déployé au tunnel qui encaisse

> Le site peut être EN LIGNE avant ce branchement (personne ne le visite tant que les
> vidéos ne sont pas publiées). Mais AUCUNE vidéo ne se publie avant que la checklist
> finale de ce guide soit 100 % verte.

## 1. Tally — le questionnaire 50 questions (post-achat)

1. Crée un compte gratuit sur tally.so (avec l'email de contact du service).
2. « Create form » → recopie les 50 questions depuis `contenu/intake-50-questions.md`,
   section par section (A à G), avec l'en-tête d'introduction du fichier.
   Types de champs : texte long pour les questions ouvertes, choix multiple pour les
   questions à options (A/B/C/D...). Question email OBLIGATOIRE en premier
   (« Quel email as-tu utilisé pour payer ? » — c'est la clé de croisement avec Stripe).
3. Settings → notifications email : activer « Email me on new submission ».
4. Publie le formulaire → copie l'URL (format https://tally.so/r/XXXXXX).

## 2. Tally — le mini-formulaire « profil par email » (optionnel mais recommandé)

1. Nouveau formulaire, 1 champ email + 1 champ caché `profil`
   (Tally : ajouter un « Hidden field » nommé profil — il se remplit tout seul via
   l'URL `?profil=...` envoyée par le site).
2. Publie → copie l'URL.

## 3. Stripe — le lien de paiement 49.90 CHF

1. Sur dashboard.stripe.com : Produits → « Ajouter un produit » :
   nom « Ton Business Sur Mesure — rapport personnalisé », prix unique 49.90 CHF.
2. « Créer un lien de paiement » (Payment Link) avec ce produit.
3. Dans les options du lien → « Page de confirmation » → rediriger vers une URL :
   `https://lamsssaaa.github.io/business-sur-mesure/merci/`
   (c'est CETTE redirection qui envoie le client vers les 50 questions après paiement).
4. Copie l'URL du lien (format https://buy.stripe.com/XXXXXX).

## 4. Brancher les 3 URLs dans le site

1. Ouvre `site/lib/config.ts` et remplace les 3 valeurs A_REMPLACER :
   - `questionnaire` → URL du formulaire 50 questions (étape 1)
   - `paiement` → URL du Payment Link Stripe (étape 3)
   - `profilParEmail` → URL du mini-formulaire (étape 2)
2. Commit + push → le déploiement se relance tout seul :
   `cd ~/business-sur-mesure && git add site/lib/config.ts && git commit -m "feat: branchement Tally + Stripe" && git push`

## 5. Checklist finale AVANT de publier la moindre vidéo

- [ ] Mini-test complet sur le site en ligne → profil affiché → bouton 49.90 CHF cliquable
- [ ] Paiement TEST réel de bout en bout (Stripe en mode test, carte 4242 4242 4242 4242) →
      redirection vers /merci/ → le bouton « Répondre aux 50 questions » ouvre le bon Tally
- [ ] Soumission test du questionnaire 50 questions → notification email reçue
- [ ] Stripe repassé en mode LIVE, lien de paiement re-testé (montant affiché : 49.90 CHF)
- [ ] Remboursement test effectué dans Stripe (savoir le faire AVANT le premier vrai client)
- [ ] `grep -rn "A_REMPLACER" site/lib/config.ts` → zéro résultat
- [ ] Les 3 rapports OFFERTS sont livrés (proches/early users) et au moins 1 témoignage
      avec autorisation est dans `TEMOIGNAGES` (site/lib/config.ts)
- [ ] Le rapport-exemple anonymisé existe (base du SCRIPT 2 de contenu/scripts-video.md)

## 6. Ensuite, le lancement

1. Tourner les 3 vidéos de `contenu/scripts-video.md` (CapCut, voix off + captures écran).
2. Lien en bio (TikTok/Instagram/YouTube) → https://lamsssaaa.github.io/business-sur-mesure/
3. Publier, noter les chiffres chaque semaine : vues → clics mini-test → emails → achats.
```

- [ ] **Step 2 : Commit**

```bash
cd ~/business-sur-mesure && git add contenu/guide-branchement.md && git commit -m "docs: guide de branchement Tally/Stripe + checklist de lancement" && git push
```

---

## Hors périmètre de ce plan (rappel YAGNI)

Paliers premium (appel 30 min, suivi), domaine personnalisé, automatisation des emails (manuels au début, modèles dans `contenu/emails.md`), génération PDF automatisée (export manuel au début), analytics. Tout ça attend les premiers clients payants.
