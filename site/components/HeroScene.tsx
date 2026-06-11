"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COPY } from "@/lib/copy";

/**
 * Héro v4 — « les particules forment le message ».
 * Un nuage de ~16 000 particules se reforme, au scroll, en chacune des phrases
 * de COPY.hero.sequence (échantillonnées depuis un canvas 2D), avec une
 * dispersion entre chaque phrase. La dernière reste à l'écran.
 * `progress` (0→1) est piloté par le scroll du héro, `pointer` par la souris.
 */

type SceneProps = {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
};

const N = 16000;
const LARGEUR_MONDE = 11; // largeur de la zone texte en unités three

/** Rend chaque phrase sur un canvas offscreen et échantillonne ses pixels opaques. */
function echantillonner(phrases: string[]): Float32Array[] {
  const c = document.createElement("canvas");
  c.width = 1400;
  c.height = 320;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return phrases.map(() => new Float32Array(N * 3));

  // Fraunces si elle est chargée (next/font expose la famille via la CSS var)
  const famille =
    getComputedStyle(document.documentElement).getPropertyValue("--font-fraunces").trim() ||
    "serif";

  return phrases.map((phrase) => {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Taille adaptée à la largeur (les phrases longues rétrécissent)
    let taille = 190;
    ctx.font = `600 ${taille}px ${famille}`;
    const mesure = ctx.measureText(phrase).width;
    if (mesure > c.width - 80) {
      taille = Math.floor((taille * (c.width - 80)) / mesure);
      ctx.font = `600 ${taille}px ${famille}`;
    }
    ctx.fillText(phrase, c.width / 2, c.height / 2);

    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    const points: number[] = [];
    const pas = 3;
    for (let y = 0; y < c.height; y += pas) {
      for (let x = 0; x < c.width; x += pas) {
        if (data[(y * c.width + x) * 4 + 3] > 140) {
          points.push(
            ((x - c.width / 2) / c.width) * LARGEUR_MONDE,
            (-(y - c.height / 2) / c.width) * LARGEUR_MONDE,
            0
          );
        }
      }
    }
    // Distribue les N particules sur les points du texte (modulo + bruit léger)
    const cibles = new Float32Array(N * 3);
    const nb = points.length / 3;
    for (let i = 0; i < N; i++) {
      if (nb === 0) break;
      const j = i % nb;
      cibles[i * 3] = points[j * 3] + (Math.random() - 0.5) * 0.02;
      cibles[i * 3 + 1] = points[j * 3 + 1] + (Math.random() - 0.5) * 0.02;
      cibles[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    return cibles;
  });
}

function Particules({ progress, pointer }: SceneProps) {
  const ref = useRef<THREE.Points>(null);
  const groupe = useRef<THREE.Group>(null);
  const segmentCourant = useRef(-2);
  const vitesses = useRef<Float32Array | null>(null);
  if (!vitesses.current) vitesses.current = new Float32Array(N * 3);

  const { positions, couleurs, cibles, nuage } = useMemo(() => {
    const cibles = echantillonner(COPY.hero.sequence);
    // État initial : nuage ample, légèrement aplati
    const nuage = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 4.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nuage[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      nuage[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      nuage[i * 3 + 2] = r * Math.cos(phi) * 0.5 - 1;
    }
    const positions = new Float32Array(nuage);
    // Papier lumineux pour la masse, émeraude clair et or pour les accents
    const couleurs = new Float32Array(N * 3);
    const papier = new THREE.Color("#f2efe7");
    const or = new THREE.Color("#d8a948");
    const emeraude = new THREE.Color("#7fc3a8");
    for (let i = 0; i < N; i++) {
      const t = Math.random();
      const c = t < 0.12 ? or : t < 0.3 ? emeraude : papier;
      couleurs[i * 3] = c.r;
      couleurs[i * 3 + 1] = c.g;
      couleurs[i * 3 + 2] = c.b;
    }
    return { positions, couleurs, cibles, nuage };
  }, []);

  useFrame(() => {
    const pts = ref.current;
    if (!pts) return;
    const p = Math.min(Math.max(progress.current ?? 0, 0), 1);

    // La première phrase est la cible dès l'arrivée (les particules convergent
    // depuis le nuage en ~1 s) ; ensuite, un segment par phrase au scroll.
    const nb = COPY.hero.sequence.length;
    const seg = Math.min(nb - 1, Math.floor(p * nb));

    // Impulsion de dispersion à chaque changement de phrase
    const v = vitesses.current!;
    if (seg !== segmentCourant.current) {
      segmentCourant.current = seg;
      for (let i = 0; i < N * 3; i++) v[i] = (Math.random() - 0.5) * 0.22;
    }

    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    const cible = seg < 0 ? nuage : cibles[seg];
    // Ressort amorti vers la cible + inertie de l'impulsion
    for (let i = 0; i < N * 3; i++) {
      v[i] = v[i] * 0.86 + (cible[i] - arr[i]) * 0.045;
      arr[i] += v[i];
    }
    pts.geometry.attributes.position.needsUpdate = true;

    // Parallaxe pointeur, très douce
    const g = groupe.current;
    if (g) {
      g.rotation.y += ((pointer.current?.x ?? 0) * 0.12 - g.rotation.y) * 0.04;
      g.rotation.x += (-(pointer.current?.y ?? 0) * 0.07 - g.rotation.x) * 0.04;
    }
  });

  return (
    // Légèrement au-dessus du centre : le bloc sous-titre + CTA vit dans le tiers bas
    <group ref={groupe} position={[0, 1.1, 0]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[couleurs, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function HeroScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Particules {...props} />
    </Canvas>
  );
}
