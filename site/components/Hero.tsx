"use client";

import { useEffect, useRef, useState } from "react";
import CtaButton from "@/components/CtaButton";
import HeroDecors from "@/components/HeroDecors";
import { Gem } from "@/components/Gem";
import { COPY } from "@/lib/copy";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [segment, setSegment] = useState(0);
  const [masqueHint, setMasqueHint] = useState(false);
  const n = COPY.hero.sequence.length;
  const finale = segment >= n - 1;

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
      setSegment(Math.min(Math.floor(p * n), n - 1));
      setMasqueHint(p > 0.04);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [n]);

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-[#072a1f] text-paper">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">

        {/* Fond vidéo par phrase */}
        <div className="absolute inset-0" aria-hidden="true">
          <HeroDecors segment={segment} />
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60rem 38rem at 50% 42%, rgb(14 107 79 / 0.30), transparent 70%)",
            }}
          />
        </div>

        {/* Logo gemme */}
        <div className="pointer-events-none absolute left-1/2 top-7 -translate-x-1/2">
          <Gem size={36} variant="plein" className="mx-auto opacity-90" />
        </div>

        {/* Phrases qui s'accumulent */}
        <div className="relative mx-auto w-full max-w-4xl px-6 text-center">
          <h1 className="font-display">
            {COPY.hero.sequence.map((phrase, i) => (
              <span
                key={phrase}
                className={`block font-semibold leading-[1.12] transition-all duration-700 ease-out ${
                  i === n - 1
                    ? "text-gold text-[clamp(2rem,4.5vw,4rem)]"
                    : "text-paper text-[clamp(1.7rem,4vw,3.5rem)]"
                } ${
                  i <= segment
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-5 opacity-0"
                }`}
                style={{ transitionDelay: `${i <= segment ? "0ms" : "0ms"}` }}
              >
                {phrase}
              </span>
            ))}
          </h1>

          {/* CTA — apparaît après la dernière phrase */}
          <div
            className={`mt-10 transition-all duration-700 ease-out ${
              finale
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-5 opacity-0"
            }`}
          >
            <CtaButton href="#prix">{COPY.hero.cta}</CtaButton>
            <p className="mt-4 text-sm text-paper/60">{COPY.hero.reassurance}</p>
          </div>
        </div>

        {/* Hint de scroll */}
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
