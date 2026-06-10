"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** Compteur animé à l'entrée à l'écran.
 *  Le HTML statique contient la VALEUR FINALE (SEO, lecteurs d'écran, sans-JS) ;
 *  l'animation 0 → valeur ne se joue que côté client, hors reduced-motion. */
export default function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const raw = useMotionValue(value);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (!inView || reduced) return;
    spring.jump(0);
    raw.set(value);
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(Math.round(v));
    });
    return unsub;
  }, [inView, reduced, value, raw, spring]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
