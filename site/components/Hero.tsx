"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CtaButton from "@/components/CtaButton";
import HeroDecors from "@/components/HeroDecors";
import { COPY } from "@/lib/copy";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Héro v6 — scène sombre épinglée : les particules 3D forment UNE phrase à la
 * fois, en grand au centre ; chaque phrase passée se grave en HTML net dans la
 * pile du haut (lisibilité d'abord — rien ne disparaît). segment ∈ 0..nb :
 * nb = séquence terminée (pile complète, particules dispersées, CTA visible).
 * Fallback sans 3D (reduced-motion, sans WebGL) : phrases HTML, CTA immédiat.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [use3D, setUse3D] = useState(false);
  const [enVue, setEnVue] = useState(true);
  const [finale, setFinale] = useState(false); // bloc CTA visible (fin de séquence)
  const [masqueHint, setMasqueHint] = useState(false);
  const [segment, setSegment] = useState(0); // phrase en scène (nb = terminé) → décor + pile
  const nb = COPY.hero.sequence.length;
  // La pile affichée suit `segment` avec retard au RECUL : la ligne qui sort
  // joue d'abord son animation de descente (.degraver) avant d'être retirée —
  // le scroll inverse rejoue les étapes du début, à l'envers.
  const [pile, setPile] = useState(0);
  useEffect(() => {
    const cible = Math.min(segment, nb);
    if (cible >= pile) {
      setPile(cible);
      return;
    }
    const t = setTimeout(() => setPile(cible), 650);
    return () => clearTimeout(t);
  }, [segment, pile, nb]);

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
      className={`relative bg-[#072a1f] text-paper md:h-[500vh] ${use3D ? "h-[500vh]" : ""}`}
    >
      <div
        className={`relative flex min-h-[100svh] items-center justify-center overflow-hidden md:sticky md:top-0 md:h-screen ${
          use3D ? "sticky top-0 h-screen" : ""
        }`}
      >
        {/* Décors immersifs : un paysage par phrase (fondu-enchaîné), qualité
            adaptée au réseau de l'utilisateur (HD / léger / coupé) */}
        <div className="absolute inset-0" aria-hidden="true">
          <HeroDecors segment={Math.min(segment, nb - 1)} />
          {/* Voile neutre : le texte reste lisible sur tout paysage */}
          <div className="absolute inset-0 bg-black/55" />
        </div>
        {use3D && enVue && (
          <div className="absolute inset-0" aria-hidden="true">
            <HeroScene
              progress={progress}
              pointer={pointer}
              onSegment={(s) => {
                setSegment(s);
                setFinale(s === nb); // CTA quand la dernière phrase est gravée
              }}
            />
          </div>
        )}

        {/* La pile : chaque phrase passée se grave ici en texte NET (elle monte
            du centre — là où les particules viennent de la former). C'est ce
            bloc qui garantit la lisibilité, les particules font le spectacle. */}
        {use3D && (
          <div
            className="pointer-events-none absolute inset-x-0 top-[11vh] z-10 px-6 text-center"
            aria-hidden="true"
          >
            {COPY.hero.sequence.slice(0, pile).map((phrase, i) => (
              <span
                key={phrase}
                className={`${i < Math.min(segment, nb) ? "graver" : "degraver"} ${
                  // Hiérarchie typographique : l'accroche (0-3) en retrait, puis
                  // l'appel monte en puissance — « & » calligraphique, finale en
                  // grand italique. Sept lignes identiques étaient plates.
                  i <= 3
                    ? "text-[clamp(1.1rem,3.1vw,1.8rem)] font-medium leading-[1.4] text-paper/75"
                    : i === 4
                      ? "mt-[1.2em] text-[clamp(1.5rem,4.4vw,2.7rem)] font-semibold leading-[1.2] text-paper"
                      : i === 5
                        ? "text-[clamp(1.6rem,4.8vw,3rem)] italic leading-[1.05] text-paper/90"
                        : "text-[clamp(1.7rem,5.2vw,3.3rem)] font-semibold italic leading-[1.15] tracking-tight text-paper"
                } block whitespace-pre-line font-display drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]`}
              >
                {phrase}
              </span>
            ))}
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
                    className="rise block whitespace-pre-line text-[clamp(2.6rem,9vw,6rem)] font-semibold leading-[1.04]"
                    style={{ animationDelay: `${0.15 + i * 0.18}s` }}
                  >
                    {phrase}
                  </span>
                ))}
              </span>
            )}
          </h1>

          {/* Bloc final sans 3D : sous-titre + CTA dans le flux */}
          {!use3D && (
            <div className="mx-auto mt-10 max-w-2xl">
              <p className="text-lg leading-relaxed text-paper/80 sm:text-xl">{COPY.hero.sousTitre}</p>
              <div className="mt-8">
                <CtaButton href="#prix">{COPY.hero.cta}</CtaButton>
                <p className="mt-4 text-sm text-paper/60">{COPY.hero.reassurance}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bloc final 3D : ancré en bas de l'écran, SOUS le bloc de phrases
            (les 6 phrases restent affichées — il ne doit jamais les recouvrir).
            Apparaît à la fin de la séquence. */}
        {use3D && (
          <div
            className={`absolute inset-x-0 bottom-[15vh] z-10 mx-auto max-w-2xl px-6 text-center transition-all duration-700 md:bottom-[4vh] ${
              finale ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
            }`}
          >
            <CtaButton href="#prix">{COPY.hero.cta}</CtaButton>
            <p className="mt-4 text-sm text-paper/60">{COPY.hero.reassurance}</p>
          </div>
        )}

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
