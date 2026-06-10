"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CtaButton from "@/components/CtaButton";
import { COPY } from "@/lib/copy";

/** Fallback léger : blobs CSS (mobile, reduced-motion, sans WebGL, ou 3D en cours de chargement). */
function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="blob absolute left-[8%] top-[18%] h-40 w-40 rounded-[38%_62%_55%_45%/55%_40%_60%_45%] bg-line/70 blur-[2px]" />
      <div className="blob absolute right-[12%] top-[12%] h-28 w-28 rounded-[55%_45%_40%_60%/45%_60%_40%_55%] bg-accent-soft" />
      <div className="blob absolute bottom-[22%] left-[18%] h-24 w-24 rounded-[45%_55%_60%_40%/60%_45%_55%_40%] bg-[#e3ddd0]" />
      <div className="blob absolute bottom-[14%] right-[20%] h-36 w-36 rounded-[60%_40%_45%_55%/40%_55%_45%_60%] bg-accent/15" />
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
    <section ref={sectionRef} className="relative md:h-[170vh]">
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
            <h1 className="text-5xl font-semibold leading-[1.04] sm:text-7xl">
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

        {use3D && (
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-muted"
            aria-hidden="true"
          >
            scroll
          </div>
        )}
      </div>
    </section>
  );
}
