"use client";

import { useState, useRef, useEffect } from "react";
import { QUESTIONS, PROFILS, calculerProfil, type Lettre } from "@/lib/quiz";
import { LINKS, CONTACT_EMAIL } from "@/lib/config";
import { CTA_CLASSES } from "@/components/CtaButton";

export default function Quiz() {
  const [reponses, setReponses] = useState<Lettre[]>([]);
  const etape = reponses.length;
  const fini = etape >= QUESTIONS.length;
  const lastClick = useRef(0);
  const h2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!fini && etape > 0) h2Ref.current?.focus();
  }, [etape, fini]);

  if (fini) {
    const lettre = calculerProfil(reponses);
    const p = PROFILS[lettre];
    const paiementPret = !LINKS.paiement.includes("A_REMPLACER");
    const emailPret = !LINKS.profilParEmail.includes("A_REMPLACER");
    return (
      <div className="rounded-2xl border border-line bg-white p-8">
        <p className="text-sm uppercase tracking-wide text-muted">Ton profil</p>
        <h2 className="mt-2 text-3xl font-bold">
          <span aria-hidden="true">{p.emoji}</span> {p.nom}
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
          {paiementPret ? (
            <a
              href={LINKS.paiement}
              target="_blank"
              rel="noopener noreferrer"
              className={`${CTA_CLASSES} block w-full text-center`}
            >
              Reçois TON business sur mesure — rapport complet 49.90 CHF
            </a>
          ) : (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Rapport Business Sur Mesure")}`}
              className={`${CTA_CLASSES} block w-full text-center`}
            >
              Reçois TON business sur mesure — rapport complet 49.90 CHF
            </a>
          )}
          {emailPret && (
            <a
              href={`${LINKS.profilParEmail}?profil=${encodeURIComponent(p.nom)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-center text-sm text-muted underline"
            >
              📩 Reçois ton profil détaillé par email
            </a>
          )}
          <button
            onClick={() => setReponses([])}
            className="mt-6 block w-full py-2 text-center text-sm text-muted underline"
          >
            Refaire le test
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[etape];
  return (
    <div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${(etape / QUESTIONS.length) * 100}%` }}
        />
      </div>
      <p className="text-sm text-muted" aria-live="polite">
        Question {etape + 1} / {QUESTIONS.length} — {q.titre}
      </p>
      <h2 ref={h2Ref} tabIndex={-1} className="mt-2 text-2xl font-bold">{q.question}</h2>
      <div className="mt-6 space-y-3">
        {(Object.keys(q.options) as Lettre[]).map((l) => (
          <button
            key={l}
            onClick={() => {
              const now = Date.now();
              if (now - lastClick.current < 300) return;
              lastClick.current = now;
              setReponses((prev) => (prev.length >= QUESTIONS.length ? prev : [...prev, l]));
            }}
            className="block w-full rounded-xl border border-line bg-white p-4 text-left transition hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {q.options[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
