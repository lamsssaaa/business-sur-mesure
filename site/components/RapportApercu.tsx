"use client";

import Reveal from "@/components/Reveal";
import { COPY } from "@/lib/copy";

/* Trois « pages » du rapport-exemple (contenu réel de contenu/rapport-exemple.md),
   empilées comme des feuilles posées sur la table. Chacune prouve une chose :
   1) un vrai rapport personnalisé, 2) LE business recommandé (concret, désirable),
   3) la preuve que chaque ligne sort de SES réponses. */

function Page({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-72 shrink-0 rounded-xl border border-line bg-white p-6 shadow-float transition duration-500 hover:-translate-y-2 hover:rotate-0 hover:shadow-lift sm:w-80 ${className}`}
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
          <p className="kicker">La preuve</p>
          <h2 className="mt-4 text-4xl font-semibold sm:text-6xl">{COPY.apercu.titre}</h2>
          <p className="mt-5 max-w-2xl text-lg text-muted">{COPY.apercu.intro}</p>
        </Reveal>
        <div className="mt-14 flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:justify-center">
          {/* 1 — Page de garde : l'identité + la portée du rapport */}
          <Reveal delay={0.1} y={48}><Page className="lg:-rotate-2">
            <p className="kicker">Rapport personnalisé</p>
            <p className="mt-6 font-display text-2xl font-semibold leading-snug">
              53 Questions <span className="italic text-accent">Sur Mesure</span>
            </p>
            <p className="mt-2 font-display text-lg text-muted">— Karim, 34 ans · Lyon</p>
            <p className="mt-8 text-sm leading-snug text-ink/80">
              LE business à lancer, et comment, en 30 jours.
            </p>
            <p className="mt-10 border-t border-line pt-4 text-xs leading-relaxed text-muted">
              17 pages · 6 parties · livré en 48 h
              <br />
              Construit à partir de ses 53 réponses.
            </p>
          </Page></Reveal>
          {/* 2 — LE business recommandé : concret, réel, désirable */}
          <Reveal delay={0.22} y={48}><Page className="lg:translate-y-3">
            <p className="kicker">Partie 1 — Sa recommandation</p>
            <p className="mt-5 font-display text-xl font-semibold leading-snug text-accent">
              Cuisinier de batch cooking à domicile
            </p>
            <p className="mt-4 font-display text-base italic leading-snug">
              « Il ne vend pas de la cuisine. Il vend une semaine de tranquillité. »
            </p>
            <p className="mt-4 text-sm leading-snug text-muted">
              Un marché qui existe déjà, un démarrage à ~510 €, et son seul créneau libre — le
              dimanche — qui se trouve être le jour le plus demandé du métier.
            </p>
          </Page></Reveal>
          {/* 3 — Pourquoi lui : la preuve que chaque ligne sort de SES réponses */}
          <Reveal delay={0.34} y={48}><Page className="lg:rotate-2">
            <p className="kicker">Partie 1.2 — Pourquoi lui</p>
            <blockquote className="mt-5 rounded-lg bg-accent-soft p-3 text-sm italic leading-snug">
              « J'ai réorganisé toute la mise en place d'une cuisine de 40 couverts. »
              <span className="mt-1 block text-xs not-italic text-muted">
                — sa réponse à la question 9
              </span>
            </blockquote>
            <p className="mt-3 text-sm leading-snug text-muted">
              C'est exactement la compétence cœur du métier recommandé : produire beaucoup,
              vite, proprement.
            </p>
            <div aria-hidden="true" className="mt-3 space-y-2 blur-[3px] select-none">
              <div className="h-2.5 rounded bg-line" />
              <div className="h-2.5 w-5/6 rounded bg-line" />
              <div className="h-2.5 w-4/6 rounded bg-line" />
            </div>
            <p className="mt-3 text-xs leading-snug text-ink/70">
              Chaque recommandation du rapport est rattachée à l'une de ses 53 réponses.
            </p>
          </Page></Reveal>
        </div>
        <Reveal delay={0.2}>
          <p className="mt-12 text-center">
            <a
              href="rapport-exemple.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-goatcounter-click="pdf-exemple"
              className="link-anim font-semibold text-accent"
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
