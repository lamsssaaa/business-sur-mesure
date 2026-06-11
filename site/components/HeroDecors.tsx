"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Décors du héro : un paysage par phrase de la séquence, en fondu-enchaîné.
 * La qualité s'adapte au réseau (Network Information API) :
 *  - wifi / 5G / 4G        → HD (1280p)
 *  - 3G ou petit écran     → version légère (640p)
 *  - 2G / économiseur de données / mouvement réduit → pas de vidéo (fond uni)
 * Seul le décor actif joue ; le suivant est préchargé ; les autres sont en pause.
 */

const DECORS = Array.from({ length: 6 }, (_, i) => ({
  hd: `videos/decor-${i + 1}-hd.mp4`,
  low: `videos/decor-${i + 1}-low.mp4`,
}));

type Qualite = "hd" | "low" | "off";

interface InfosReseau {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  saveData?: boolean;
}

function choisirQualite(): Qualite {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  const conn = (navigator as Navigator & { connection?: InfosReseau }).connection;
  if (conn?.saveData) return "off";
  const et = conn?.effectiveType;
  if (et === "slow-2g" || et === "2g") return "off";
  if (et === "3g") return "low";
  return window.matchMedia("(min-width: 768px)").matches ? "hd" : "low";
}

export default function HeroDecors({ segment }: { segment: number }) {
  const [qualite, setQualite] = useState<Qualite>("off"); // off avant hydratation : zéro téléchargement inutile
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => setQualite(choisirQualite()), []);

  useEffect(() => {
    if (qualite === "off") return;
    DECORS.forEach((d, i) => {
      const el = refs.current[i];
      if (!el) return;
      // Charge le décor actif et précharge le suivant ; les autres attendent leur tour
      if ((i === segment || i === segment + 1) && !el.src) el.src = d[qualite];
      if (i === segment) el.play().catch(() => {});
      else el.pause();
    });
  }, [segment, qualite]);

  if (qualite === "off") return null;

  return (
    <>
      {DECORS.map((d, i) => (
        <video
          key={d.hd}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === segment ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      ))}
    </>
  );
}
