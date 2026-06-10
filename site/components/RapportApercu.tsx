"use client";

import Reveal from "@/components/Reveal";
import { COPY } from "@/lib/copy";

/* Trois « pages » du rapport-exemple (contenu réel de contenu/rapport-exemple.md),
   empilées comme des feuilles posées sur la table. */

const SOMMAIRE = [
  "TON business : c'est quoi, pourquoi toi, et ce qu'on a écarté",
  "Ton plan des 30 premiers jours — semaine par semaine",
  "Ton budget de démarrage — poste par poste",
  "Tes 3 premiers clients — où ils sont, message prêt à copier",
  "Les pièges de ce secteur — et comment les éviter",
  "Ta toute première action demain matin",
];

function Page({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-72 shrink-0 rounded-xl border border-line bg-white p-6 shadow-float sm:w-80 ${className}`}
    >
      {children}
    </div>
  );
}

export default function RapportApercu() {
  return (
    <section id="apercu" className="overflow-hidden border-y border-line bg-white/60">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <h2 className="text-4xl font-semibold sm:text-5xl">{COPY.apercu.titre}</h2>
          <p className="mt-5 max-w-2xl text-lg text-muted">{COPY.apercu.intro}</p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-14 flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:justify-center">
            {/* Page de garde */}
            <Page className="lg:-rotate-2">
              <p className="font-display text-xs uppercase tracking-[0.2em] text-muted">
                Rapport personnalisé
              </p>
              <p className="mt-6 font-display text-2xl font-semibold leading-snug">
                Ton Business <span className="italic text-accent">Sur Mesure</span>
              </p>
              <p className="mt-2 font-display text-lg text-muted">— Karim</p>
              <p className="mt-8 text-sm text-muted">
                LE business à lancer, et comment, en 30 jours.
              </p>
              <p className="mt-10 border-t border-line pt-4 text-xs text-muted">
                Basé sur ses 50 réponses · 17 pages · livré en 48 h
              </p>
            </Page>
            {/* Sommaire */}
            <Page className="lg:translate-y-3">
              <p className="font-display text-lg font-semibold">Sommaire</p>
              <ol className="mt-4 space-y-2.5">
                {SOMMAIRE.map((item, i) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-snug text-muted">
                    <span className="font-display font-semibold text-accent">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </Page>
            {/* Extrait « Pourquoi TOI » */}
            <Page className="lg:rotate-2">
              <p className="font-display text-lg font-semibold">
                1.2 — Pourquoi <span className="italic text-accent">TOI</span>
              </p>
              <blockquote className="mt-4 rounded-lg bg-accent-soft p-3 text-sm italic leading-snug">
                « J'ai réorganisé toute la mise en place d'une cuisine de 40 couverts. »
                <span className="mt-1 block text-xs not-italic text-muted">
                  — sa réponse à la question 9
                </span>
              </blockquote>
              <p className="mt-3 text-sm leading-snug text-muted">
                C'est exactement la compétence cœur du métier recommandé : produire beaucoup,
                vite, proprement…
              </p>
              <div aria-hidden="true" className="mt-3 space-y-2 blur-[3px] select-none">
                <div className="h-2.5 rounded bg-line" />
                <div className="h-2.5 w-5/6 rounded bg-line" />
                <div className="h-2.5 w-4/6 rounded bg-line" />
              </div>
              <p className="mt-3 text-xs text-muted">
                La suite est dans le rapport — chaque rapport est rédigé pour son destinataire.
              </p>
            </Page>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-12 text-center">
            <a
              href="rapport-exemple.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-goatcounter-click="pdf-exemple"
              className="font-semibold text-accent underline underline-offset-4 hover:text-accent-deep"
            >
              {COPY.apercu.cta}
              <span className="sr-only"> (PDF, s'ouvre dans une nouvelle fenêtre)</span>
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
