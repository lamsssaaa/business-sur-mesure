"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { QUESTIONS, PROFILS, calculerProfil, type Lettre } from "@/lib/quiz";
import { LINKS, CONTACT_EMAIL } from "@/lib/config";
import { CTA_CLASSES } from "@/components/CtaButton";

export default function Quiz() {
  const [reponses, setReponses] = useState<Lettre[]>([]);
  const etape = reponses.length;
  const fini = etape >= QUESTIONS.length;
  const lastClick = useRef(0);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fini && etape > 0) h2Ref.current?.focus();
  }, [etape, fini]);

  if (fini) {
    const lettre = calculerProfil(reponses);
    const p = PROFILS[lettre];
    const paiementPret = !LINKS.paiement.includes("A_REMPLACER");
    const emailPret = !LINKS.profilParEmail.includes("A_REMPLACER");
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[2rem] border border-line bg-white p-8 shadow-lift sm:p-10"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Ton profil</p>
        <h2 className="mt-3 text-4xl font-semibold">
          <span aria-hidden="true">{p.emoji}</span> {p.nom}
        </h2>
        <p className="mt-5 whitespace-pre-line leading-relaxed text-muted">{p.description}</p>
        <h3 className="mt-7 text-lg font-semibold">
          Les catégories qui te conviennent en général :
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-muted">
          {p.categories.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="mt-7 font-medium">{p.rapportFeraitQuoi}</p>
        <div className="mt-9 space-y-3">
          {paiementPret ? (
            <a
              href={LINKS.paiement}
              target="_blank"
              rel="noopener noreferrer"
              className={`${CTA_CLASSES} w-full`}
            >
              Reçois TON business sur mesure — rapport complet 49.90 CHF
            </a>
          ) : (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Rapport Business Sur Mesure")}`}
              className={`${CTA_CLASSES} w-full`}
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
      </motion.div>
    );
  }

  const q = QUESTIONS[etape];
  return (
    <div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <motion.div
          className="h-full bg-accent"
          animate={{ width: `${(etape / QUESTIONS.length) * 100}%` }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 20 }}
        />
      </div>
      <p className="text-sm text-muted" aria-live="polite">
        Question {etape + 1} / {QUESTIONS.length} — {q.titre}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={etape}
          initial={reduced ? false : { opacity: 0, x: 36, rotateY: 6 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -28, rotateY: -4 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 900 }}
        >
          <h2 ref={h2Ref} tabIndex={-1} className="mt-2 text-2xl font-semibold sm:text-3xl">
            {q.question}
          </h2>
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
                className="block w-full rounded-2xl border border-line bg-white p-4 text-left shadow-float transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {q.options[l]}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
