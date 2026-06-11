"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CtaButton from "@/components/CtaButton";
import { COPY } from "@/lib/copy";
import { Gem } from "@/components/Gem";

/** Fallback léger : blobs CSS (mobile, reduced-motion, sans WebGL, ou 3D en cours de chargement). */
function HeroFallback() {
  // Le concept, lisible sans WebGL : des fragments dispersés, UNE gemme.
  const fragments = [
    { right: "34%", top: "16%", size: 30, rot: -18 },
    { right: "12%", top: "11%", size: 44, rot: 12 },
    { right: "6%", top: "34%", size: 24, rot: 40 },
    { right: "40%", top: "42%", size: 20, rot: -30 },
    { right: "30%", top: "66%", size: 36, rot: 22 },
    { right: "9%", top: "72%", size: 28, rot: -8 },
    { right: "22%", top: "85%", size: 18, rot: 55 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="blob absolute left-[8%] top-[18%] h-40 w-40 rounded-[38%_62%_55%_45%/55%_40%_60%_45%] bg-line/60 blur-[2px]" />
      <div className="blob absolute bottom-[20%] left-[16%] h-24 w-24 rounded-[45%_55%_60%_40%/60%_45%_55%_40%] bg-[#e3ddd0]" />
      {fragments.map((f, i) => (
        <div
          key={i}
          className="blob absolute hidden sm:block"
          style={{ right: f.right, top: f.top, transform: `rotate(${f.rot}deg)`, opacity: 0.8 }}
        >
          <Gem size={f.size} variant="pale" />
        </div>
      ))}
      <div className="blob absolute hidden sm:right-[18%] sm:top-[38%] sm:block">
        <Gem size={120} variant="plein" className="drop-shadow-xl" />
      </div>
      <div className="blob absolute bottom-[16%] right-[7%] sm:hidden">
        <Gem size={56} variant="plein" className="drop-shadow-lg" />
      </div>
    </div>
  );
}

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null, // le fallback reste affiché derrière pendant le chargement
});

const titleWords = COPY.hero.titre.split(" ");

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [use3D, setUse3D] = useState(false);
  const [enVue, setEnVue] = useState(true);
  const [masqueHint, setMasqueHint] = useState(false);

  useEffect(() => {
    const onScroll = () => setMasqueHint(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setUse3D(Boolean(wide && webgl && !reduced));
  }, []);

  // La scène 3D ne tourne que quand le héro est (presque) à l'écran — zéro GPU au-delà
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
    if (!use3D) return;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      progress.current = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
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
    // Hauteurs 100 % CSS (identiques avant/après hydratation) : zéro décalage de mise en page
    <section ref={sectionRef} className="relative md:h-[130vh]">
      <div className="relative flex min-h-[92vh] items-center overflow-hidden md:sticky md:top-0 md:h-screen">
        <div className="hero-aura absolute inset-0" aria-hidden="true" />
        <HeroFallback />
        {use3D && enVue && (
          <div className="absolute inset-0" aria-hidden="true">
            <HeroScene progress={progress} pointer={pointer} />
          </div>
        )}

        <div className="relative mx-auto w-full max-w-6xl px-6 pt-24 sm:pt-20">
          <div className="max-w-2xl">
            {/* Entrée animée en pur CSS : le texte est visible même sans JavaScript */}
            <h1 className="text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold leading-[0.98] tracking-tight">
              {titleWords.map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
                  <span
                    className={`rise inline-block whitespace-pre ${
                      word.includes("TON") || word.includes("business") ? "text-accent italic" : ""
                    }`}
                    style={{ animationDelay: `${0.08 + i * 0.055}s` }}
                  >
                    {word}{" "}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="rise-soft mt-7 max-w-xl text-lg text-muted sm:text-xl"
              style={{ animationDelay: "0.55s" }}
            >
              {COPY.hero.sousTitre}
            </p>
            <div className="rise-soft mt-10" style={{ animationDelay: "0.72s" }}>
              <CtaButton href="/mini-test/">{COPY.hero.cta}</CtaButton>
              <p className="mt-4 text-sm text-muted">{COPY.hero.reassurance}</p>
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-muted transition-opacity duration-300 ${
            masqueHint ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          scroll
          <span className="scroll-ligne block h-7 w-px bg-ink/30" />
        </div>
      </div>
    </section>
  );
}
