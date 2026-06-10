"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { Check } from "@/components/Gem";

/* Coche qui se dessine quand elle entre à l'écran. */
export default function DrawnCheck({
  delay = 0.2,
  or = false,
  className = "h-5 w-5",
}: {
  delay?: number;
  or?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <span
      ref={ref}
      className={`check-draw inline-block shrink-0 ${inView ? "est-visible" : ""}`}
      style={{ "--check-delay": `${delay}s` } as React.CSSProperties}
      aria-hidden="true"
    >
      <Check className={className} or={or} />
    </span>
  );
}
