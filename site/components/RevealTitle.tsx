"use client";

import { motion, useReducedMotion } from "motion/react";

/* Titre de section : chaque mot monte de sa fenêtre en cascade (même langage que le héro).
   `pivot` : le mot à composer en italique émeraude — la signature typographique du site. */
export default function RevealTitle({
  texte,
  pivot,
  as: Tag = "h2",
  className = "text-4xl font-semibold sm:text-6xl",
}: {
  texte: string;
  pivot?: string;
  as?: "h2" | "h3" | "p";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const mots = texte.split(" ");
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={className}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
    >
      {mots.map((mot, i) => (
        <span key={`${mot}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block whitespace-pre ${
              pivot && mot.replace(/[.,!?]/g, "") === pivot ? "italic text-accent" : ""
            }`}
            variants={{
              visible: { y: "0%", opacity: 1 },
            }}
            initial={reduced ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{ duration: 0.65, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            {mot}{" "}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
