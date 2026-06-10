"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { QUESTIONS, PROFILS, calculerProfil, type Lettre } from "@/lib/quiz";
import { LINKS, CONTACT_EMAIL } from "@/lib/config";
import { CTA_CLASSES } from "@/components/CtaButton";

const STORAGE_KEY = "bsm-quiz-v1";
const pret = (url: string) => !url.includes("A_REMPLACER");

function NouvelOnglet() {
  return <span className="sr-only"> (s'ouvre dans une nouvelle fenêtre)</span>;
}

export default function Quiz() {
  const [reponses, setReponses] = useState<Lettre[]>([]);
  const [resultatVisible, setResultatVisible] = useState(false);
  const [restaure, setRestaure] = useState(false);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const resultatRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  const etape = reponses.length;
  const fini = etape >= QUESTIONS.length;
  const emailPret = pret(LINKS.profilParEmail);
  const paiementPret = pret(LINKS.paiement);

  // Restaure la progression (un refresh ne doit pas effacer 10 réponses)
  useEffect(() => {
    try {
      const brut = sessionStorage.getItem(STORAGE_KEY);
      if (brut) {
        const data = JSON.parse(brut) as { reponses?: Lettre[]; resultatVisible?: boolean };
        if (Array.isArray(data.reponses)) setReponses(data.reponses.slice(0, QUESTIONS.length));
        if (data.resultatVisible) setResultatVisible(true);
      }
    } catch {
      /* stockage indisponible : le quiz fonctionne quand même */
    }
    setRestaure(true);
  }, []);

  useEffect(() => {
    if (!restaure) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ reponses, resultatVisible }));
    } catch {
      /* idem */
    }
  }, [reponses, resultatVisible, restaure]);

  // Capture email : révèle le résultat dès que le formulaire Tally embarqué est soumis
  useEffect(() => {
    if (!fini || resultatVisible) return;
    const onMessage = (e: MessageEvent) => {
      if (typeof e.origin === "string" && !e.origin.endsWith("tally.so")) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "Tally.FormSubmitted") setResultatVisible(true);
      } catch {
        /* message non-Tally : ignorer */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [fini, resultatVisible]);

  // Focus sur le titre du résultat quand il apparaît
  useEffect(() => {
    if (fini && (resultatVisible || !emailPret)) resultatRef.current?.focus();
  }, [fini, resultatVisible, emailPret]);

  const repondre = useCallback((l: Lettre, etapeAuClic: number) => {
    // Garde par index : un double-clic/double-Entrée ne peut JAMAIS répondre à la question suivante
    setReponses((prev) => (prev.length === etapeAuClic ? [...prev, l] : prev));
  }, []);

  const recommencer = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignorer */
    }
    setReponses([]);
    setResultatVisible(false);
  };

  if (!restaure) {
    return <div className="h-64" aria-hidden="true" />;
  }

  /* ── ÉCRAN RÉSULTAT ─────────────────────────────────────────── */
  if (fini && (resultatVisible || !emailPret)) {
    const lettre = calculerProfil(reponses);
    const p = PROFILS[lettre];
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[2rem] border border-line bg-white p-8 shadow-lift sm:p-10"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Ton profil</p>
        <h2 ref={resultatRef} tabIndex={-1} className="mt-3 text-4xl font-semibold">
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
              data-goatcounter-click="clic-achat"
              className={`${CTA_CLASSES} w-full`}
            >
              Reçois TON business sur mesure — rapport complet 49.90 CHF
              <NouvelOnglet />
            </a>
          ) : (
            <a
              href={`${LINKS.profilParEmail}?profil=${encodeURIComponent(p.nom)}&intent=commande`}
              target="_blank"
              rel="noopener noreferrer"
              data-goatcounter-click="clic-achat-prelancement"
              className={`${CTA_CLASSES} w-full`}
            >
              Commander mon rapport (49.90 CHF)
              <NouvelOnglet />
            </a>
          )}
          <p className="text-center text-sm text-muted">
            {paiementPret
              ? "Satisfait ou remboursé 14 jours · Rapport livré en 48 h · Paiement sécurisé Stripe"
              : "Tu reçois ton lien de paiement par email (réponse en quelques heures) · Satisfait ou remboursé 14 jours"}
          </p>
          <button
            onClick={recommencer}
            className="mt-4 block w-full py-2 text-center text-sm text-muted underline"
          >
            Refaire le test
          </button>
        </div>
      </motion.div>
    );
  }

  /* ── ÉCRAN CAPTURE EMAIL (entre la 10e réponse et le résultat) ── */
  if (fini) {
    const lettre = calculerProfil(reponses);
    const p = PROFILS[lettre];
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[2rem] border border-line bg-white p-8 shadow-lift sm:p-10"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Analyse terminée</p>
        <h2 className="mt-3 text-3xl font-semibold">Ton profil est prêt 🎉</h2>
        <p className="mt-4 text-muted">
          Laisse ton email : on t'envoie ton profil complet pour le garder — et tu vois ton
          résultat tout de suite.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-line">
          <iframe
            src={`https://tally.so/embed/${LINKS.profilParEmail.split("/r/")[1]}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&profil=${encodeURIComponent(p.nom)}`}
            title="Reçois ton profil par email"
            className="h-64 w-full"
            loading="lazy"
          />
        </div>
        <button
          onClick={() => setResultatVisible(true)}
          className="mt-5 block w-full py-2 text-center text-sm text-muted underline"
        >
          Voir mon résultat sans laisser d'email →
        </button>
      </motion.div>
    );
  }

  /* ── ÉCRAN QUESTIONS ───────────────────────────────────────── */
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
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-muted" aria-live="polite">
          Question {etape + 1} / {QUESTIONS.length} — {q.titre}
        </p>
        {etape > 0 && (
          <button
            onClick={() => setReponses((prev) => prev.slice(0, -1))}
            className="shrink-0 text-sm text-muted underline"
          >
            ← Précédent
          </button>
        )}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={etape}
          initial={reduced ? false : { opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -28 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={(definition) => {
            // Focus posé quand la NOUVELLE question a fini d'entrer (sinon il part sur le nœud sortant)
            if (definition !== "exit" && etape > 0) h2Ref.current?.focus();
          }}
        >
          <h2 ref={h2Ref} tabIndex={-1} className="mt-2 text-2xl font-semibold outline-none sm:text-3xl">
            {q.question}
          </h2>
          <div className="mt-6 space-y-3">
            {(Object.keys(q.options) as Lettre[]).map((l) => (
              <button
                key={l}
                onClick={() => repondre(l, etape)}
                {...(etape === 0 && l === "A" ? { "data-goatcounter-click": "quiz-demarre" } : {})}
                className="block w-full rounded-2xl border border-line bg-white p-4 text-left shadow-float transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft"
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
