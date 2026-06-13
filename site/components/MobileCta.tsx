"use client";

import { useEffect, useState } from "react";
import { Link } from "next-view-transitions";

const STORAGE_KEY = "bsm-cta-mobile-fermee";

/**
 * Barre d'action collante, mobile uniquement (le trafic social arrive sur tel).
 * Apparaît une fois le héro passé, se referme d'une croix (choix mémorisé pour
 * la session). Desktop : jamais affichée (le CTA est toujours visible à l'écran).
 */
export default function MobileCta() {
  const [visible, setVisible] = useState(false);
  const [fermee, setFermee] = useState(true); // true par défaut : zéro flash avant hydratation

  useEffect(() => {
    try {
      setFermee(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setFermee(false);
    }
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fermer = () => {
    setFermee(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* stockage indisponible : la croix ferme quand même */
    }
  };

  if (fermee) return null;

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] transition-all duration-300 sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border border-line bg-white/95 p-2 pl-5 shadow-lift backdrop-blur">
        <p className="min-w-0 flex-1 truncate text-sm font-medium">
          VOTRE business, taillé sur mesure
        </p>
        <Link
          href="/#prix"
          className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
        >
          Mon rapport — 49.90
        </Link>
        <button
          onClick={fermer}
          aria-label="Fermer cette barre"
          className="shrink-0 rounded-full p-2 text-muted"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
