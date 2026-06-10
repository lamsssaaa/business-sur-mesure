"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import CtaButton from "@/components/CtaButton";
import { COPY } from "@/lib/copy";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

/** Fallback léger : blobs CSS + UNE forme émeraude (mobile, reduced-motion, sans WebGL). */
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

const titleWords = COPY.hero.titre.split(" ");

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setUse3D(Boolean(wide && webgl && !reduced));
  }, [reduced]);

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
    <section ref={sectionRef} className={use3D ? "relative h-[170vh]" : "relative"}>
      <div
        className={
          use3D
            ? "sticky top-0 flex h-screen items-center overflow-hidden"
            : "relative flex min-h-[92vh] items-center overflow-hidden"
        }
      >
        <div className="hero-aura absolute inset-0" aria-hidden="true" />
        {use3D ? (
          <div className="absolute inset-0">
            <HeroScene progress={progress} pointer={pointer} />
          </div>
        ) : (
          <HeroFallback />
        )}

        <div className="relative mx-auto w-full max-w-6xl px-6 pt-24 sm:pt-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-semibold leading-[1.04] sm:text-7xl">
              {titleWords.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className={`inline-block whitespace-pre ${
                    word.includes("TON") || word.includes("business") ? "text-accent italic" : ""
                  }`}
                  initial={reduced ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.08 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="mt-7 max-w-xl text-lg text-muted sm:text-xl"
              initial={reduced ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {COPY.hero.sousTitre}
            </motion.p>
            <motion.div
              className="mt-10"
              initial={reduced ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <CtaButton href="/mini-test/">{COPY.hero.cta}</CtaButton>
              <p className="mt-4 text-sm text-muted">{COPY.hero.reassurance}</p>
            </motion.div>
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
