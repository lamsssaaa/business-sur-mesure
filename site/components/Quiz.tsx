"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { QUESTIONS, PROFILS, calculerProfil, type Lettre } from "@/lib/quiz";
import { LINKS, CONTACT_EMAIL } from "@/lib/config";
import { CTA_CLASSES } from "@/components/CtaButton";
import { QuizGem } from "@/components/Gem";

const STORAGE_KEY = "bsm-quiz-v1";
const pret = (url: string) => !url.includes("A_REMPLACER");

// Écran « analyse » entre la 10e réponse et le résultat (transparence
// opérationnelle : on montre le travail réellement effectué — Buell & Norton).
// Chaque étape décrit une opération qui a vraiment lieu.
const ETAPES_ANALYSE = [
  "Lecture de tes 10 réponses",
  "Calcul de ton profil entrepreneur",
  "Préparation de ton aperçu",
];

function NouvelOnglet() {
  return <span className="sr-only"> (s'ouvre dans une nouvelle fenêtre)</span>;
}

export default function Quiz() {
  const [reponses, setReponses] = useState<Lettre[]>([]);
  const [resultatVisible, setResultatVisible] = useState(false);
  const [restaure, setRestaure] = useState(false);
  const [choix, setChoix] = useState<Lettre | null>(null);
  const [analyseEtape, setAnalyseEtape] = useState(0);
  const [analyseFinie, setAnalyseFinie] = useState(false);
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
        if (data.resultatVisible) {
          setResultatVisible(true);
          setAnalyseFinie(true); // l'analyse ne se rejoue pas après un refresh
        }
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

  // Séquence de l'écran « analyse » : les étapes se cochent l'une après l'autre.
  // En mouvement réduit, on passe directement (le théâtre est optionnel, pas le résultat).
  useEffect(() => {
    if (!fini || analyseFinie || resultatVisible) return;
    if (reduced) {
      setAnalyseFinie(true);
      return;
    }
    const timers = ETAPES_ANALYSE.map((_, i) =>
      window.setTimeout(() => setAnalyseEtape(i + 1), 500 + i * 1200)
    );
    timers.push(
      window.setTimeout(() => setAnalyseFinie(true), 500 + ETAPES_ANALYSE.length * 1200 + 600)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [fini, analyseFinie, resultatVisible, reduced]);

  const avancer = useCallback((l: Lettre, etapeAuClic: number) => {
    // Garde par index : un double-clic/double-Entrée ne peut JAMAIS répondre à la question suivante
    setReponses((prev) => (prev.length === etapeAuClic ? [...prev, l] : prev));
    setChoix(null);
  }, []);

  const repondre = useCallback(
    (l: Lettre, etapeAuClic: number) => {
      if (choix !== null) return; // un beat à la fois
      if (reduced) {
        avancer(l, etapeAuClic);
        return;
      }
      // Beat de reconnaissance : la réponse est « accusée réception » avant d'avancer
      setChoix(l);
      window.setTimeout(() => avancer(l, etapeAuClic), 300);
    },
    [choix, reduced, avancer]
  );

  const recommencer = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignorer */
    }
    setReponses([]);
    setResultatVisible(false);
    setAnalyseEtape(0);
    setAnalyseFinie(false);
  };

  if (!restaure) {
    return <div className="h-64" aria-hidden="true" />;
  }

  /* ── ÉCRAN ANALYSE (entre la 10e réponse et la suite) ─────────── */
  if (fini && !analyseFinie && !resultatVisible) {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[2rem] border border-line bg-white p-8 shadow-lift sm:p-10"
      >
        <div className="flex items-center gap-4">
          <QuizGem taillees={QUESTIONS.length} size={52} />
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Analyse en cours</p>
        </div>
        <h2 className="mt-5 text-3xl font-semibold">On taille ton profil…</h2>
        <ul className="mt-7 space-y-4" role="status" aria-live="polite">
          {ETAPES_ANALYSE.map((etapeTexte, i) => {
            const faite = analyseEtape > i;
            const enCours = analyseEtape === i;
            return (
              <li
                key={etapeTexte}
                className={`flex items-center gap-3 transition-opacity duration-500 ${
                  faite || enCours ? "opacity-100" : "opacity-35"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs transition-colors duration-300 ${
                    faite ? "bg-accent text-white" : "border border-line text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className={faite ? "" : "text-muted"}>
                  {etapeTexte}
                  {enCours && <span className="quiz-pulse" aria-hidden="true">…</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </motion.div>
    );
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
        {/* Le « delta » : ce que l'aperçu gratuit ne dit pas encore — structure
            teaser → complet (la valeur gratuite est réelle, la suite est nommée) */}
        <div className="mt-7 rounded-2xl border border-line p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Ton aperçu gratuit s&apos;arrête ici
          </p>
          <p className="mt-2 text-sm text-muted">Ton rapport complet (50 questions) ajoute :</p>
          <ul className="mt-4 space-y-2.5">
            {[
              "LE business précis — un seul, nommé, choisi pour ta situation",
              "Pourquoi celui-là — et les pistes écartées, avec les raisons",
              "Ton plan des 30 premiers jours, budget réel inclus",
              "Les pièges connus de CE business précis",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-[0.95rem]">
                <span aria-hidden="true" className="mt-0.5 text-accent">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-7 space-y-3">
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
          {/* La preuve au moment du doute : voir un rapport réel avant de payer */}
          <div className="mt-6 rounded-2xl bg-accent-soft/70 p-5 text-center">
            <p className="text-sm text-muted">
              Ton profil est un aperçu. Le rapport, lui, croise tes <b>50 réponses</b> — ta
              combinaison n&apos;existe qu&apos;une fois, ta recommandation non plus.
            </p>
            <a
              href="../rapport-exemple.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-goatcounter-click="pdf-exemple-resultat"
              className="link-anim mt-3 inline-block text-sm font-semibold text-accent"
            >
              Feuilleter un rapport réel anonymisé (PDF, 12 pages) →<NouvelOnglet />
            </a>
          </div>
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
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <QuizGem taillees={etape} size={52} />
          <p className="text-sm text-muted" aria-live="polite">
            Question {etape + 1} / {QUESTIONS.length} — {q.titre}
            <span className="mt-0.5 block text-xs text-muted/70">
              Chaque réponse taille ta gemme.
            </span>
          </p>
        </div>
        {etape > 0 && (
          <button
            onClick={() => {
              setChoix(null);
              setReponses((prev) => prev.slice(0, -1));
            }}
            className="link-anim shrink-0 text-sm text-muted"
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
          <h2 ref={h2Ref} tabIndex={-1} className="mt-2 text-3xl font-semibold leading-tight outline-none sm:text-4xl">
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
