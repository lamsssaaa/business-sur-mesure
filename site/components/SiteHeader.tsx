"use client";

import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/* Header vivant : se condense au scroll, fond papier net (fini le texte qui passe
   derrière), barre de progression de lecture émeraude. */
export default function SiteHeader() {
  const [scrolle, setScrolle] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolle(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-400 ${
        scrolle
          ? "border-b border-line bg-paper/90 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-paper via-paper/85 to-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-400 ${
          scrolle ? "py-2.5" : "py-4"
        }`}
      >
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink">
          Ton Business <span className="italic text-accent">Sur Mesure</span>
        </Link>
        <Link
          href="/mini-test/"
          className="rounded-full border border-ink/15 bg-paper/70 px-5 py-2 text-sm font-semibold backdrop-blur-md transition hover:border-accent hover:text-accent"
        >
          Mini-test gratuit
        </Link>
      </div>
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-accent"
        style={{ scaleX: reduced ? scrollYProgress : progress }}
      />
    </header>
  );
}
