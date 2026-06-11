"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CtaButton from "@/components/CtaButton";
import HeroDecors from "@/components/HeroDecors";
import { COPY } from "@/lib/copy";
import { Gem } from "@/components/Gem";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Héro v4 — scène sombre épinglée sur 400vh : les particules 3D forment les
 * phrases de COPY.hero.sequence au scroll, la dernière reste, puis le bloc
 * CTA apparaît. Fallback sans 3D (mobile, reduced-motion, sans WebGL) :
 * les phrases en HTML, CTA visible immédiatement.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [use3D, setUse3D] = useState(false);
  const [enVue, setEnVue] = useState(true);
  const [finale, setFinale] = useState(false); // bloc CTA visible (fin de séquence)
  const [masqueHint, setMasqueHint] = useState(false);
  const [segment, setSegment] = useState(0); // phrase courante → pilote le décor

  useEffect(() => {
    // 3D partout, mobile compris (demande Farouk) — seuls reduced-motion et
    // l'absence de WebGL basculent sur le fallback HTML
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setUse3D(Boolean(webgl && !reduced));
  }, []);

  // La scène ne tourne que quand le héro est (presque) à l'écran
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !use3D) return;
    const io = new IntersectionObserver(([entry]) => setEnVue(entry.isIntersecting), {
      rootMargin: "300px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [use3D]);

  useEffect(() => {
    if (!use3D) {
      setFinale(true); // sans 3D, le CTA est visible d'emblée
      return;
    }
    // La 3D vient de s'activer : le CTA attend la fin de la séquence
    setFinale(false);
    setSegment(0);
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
      progress.current = p;
      setMasqueHint(p > 0.04);
      // segment et finale sont pilotés par le verrou séquentiel de la scène
      // (onSegment) : un scroll rapide ne peut pas sauter une phrase.
    };
    const onMove = (e: MouseEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [use3D]);

  return (
    // Desktop : hauteurs 100 % CSS (zéro décalage). Mobile : le pinning s'active
    // avec la 3D après hydratation (le visiteur est encore en haut de page).
    <section
      ref={sectionRef}
      className={`relative bg-[#072a1f] text-paper md:h-[400vh] ${use3D ? "h-[400vh]" : ""}`}
    >
      <div
        className={`relative flex min-h-[100svh] items-center justify-center overflow-hidden md:sticky md:top-0 md:h-screen ${
          use3D ? "sticky top-0 h-screen" : ""
        }`}
      >
        {/* Décors immersifs : un paysage par phrase (fondu-enchaîné), qualité
            adaptée au réseau de l'utilisateur (HD / léger / coupé) */}
        <div className="absolute inset-0" aria-hidden="true">
          <HeroDecors segment={segment} />
          {/* Voile neutre : le texte de particules reste lisible sur tout paysage */}
          <div className="absolute inset-0 bg-black/45" />
        </div>
        {/* Atmosphère : la lumière de la pierre dans le noir */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 38rem at 50% 42%, rgb(14 107 79 / 0.35), transparent 70%), radial-gradient(34rem 22rem at 72% 70%, rgb(184 138 46 / 0.10), transparent 65%)",
          }}
        />

        {use3D && enVue && (
          <div className="absolute inset-0" aria-hidden="true">
            <HeroScene
              progress={progress}
              pointer={pointer}
              onSegment={(s) => {
                setSegment(s);
                setFinale(s === COPY.hero.sequence.length - 1);
              }}
            />
          </div>
        )}

        {/* H1 réel : lu par les moteurs et les lecteurs d'écran ; visible quand pas de 3D */}
        <div className="relative mx-auto w-full max-w-5xl px-6 text-center">
          <h1 className={use3D ? "sr-only" : "font-display"}>
            {use3D ? (
              COPY.hero.titre
            ) : (
              <span className="block space-y-2 pt-40">
                {COPY.hero.sequence.map((phrase, i) => (
                  <span
                    key={phrase}
                    className={`rise block text-[clamp(2.6rem,9vw,6rem)] font-semibold leading-[1.04] ${
                      i === COPY.hero.sequence.length - 1 ? "text-gold" : ""
                    }`}
                    style={{ animationDelay: `${0.15 + i * 0.18}s` }}
                  >
                    {phrase}
                  </span>
                ))}
              </span>
            )}
          </h1>

          {/* Bloc final : sous-titre + CTA — apparaît à la fin de la séquence */}
          <div
            className={`mx-auto max-w-2xl transition-all duration-700 ${
              use3D ? "mt-[34vh]" : "mt-10"
            } ${
              finale ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
            }`}
          >
            {/* Sur mobile, les phrases 3D viennent d'être lues : le sous-titre
                complet serait une redite qui chevauche la scène — desktop only */}
            <p className={`text-lg leading-relaxed text-paper/80 sm:text-xl ${use3D ? "hidden md:block" : ""}`}>
              {COPY.hero.sousTitre}
            </p>
            <div className="mt-8">
              <CtaButton href="#prix">{COPY.hero.cta}</CtaButton>
              <p className="mt-4 text-sm text-paper/60">{COPY.hero.reassurance}</p>
            </div>
          </div>
        </div>

        {/* Petit cartouche de marque, en haut de la scène */}
        <div className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2">
          <Gem size={42} variant="plein" className="mx-auto opacity-90" />
        </div>

        <div
          className={`absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-paper/50 transition-opacity duration-300 ${
            masqueHint ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          scroll
          <span className="scroll-ligne block h-7 w-px bg-paper/30" />
        </div>
      </div>
    </section>
  );
}
