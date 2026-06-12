"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COPY } from "@/lib/copy";

/**
 * Héro v5 — « les phrases s'accumulent » (demande Farouk : une phrase formée
 * ne disparaît JAMAIS). Chaque phrase de COPY.hero.sequence possède sa propre
 * tranche de particules : au scroll, la phrase suivante se forme SOUS les
 * précédentes, qui restent affichées.
 * `progress` (0→1) est piloté par le scroll du héro, `pointer` par la souris.
 */

type SceneProps = {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  /** Notifie la phrase visuellement active (pilote décors + apparition du CTA). */
  onSegment?: (segment: number) => void;
};

// Moins de particules sur mobile : même effet, fluidité garantie
const N = typeof window !== "undefined" && window.innerWidth < 768 ? 12000 : 22000;
// Pas d'échantillonnage : plus fin quand on a assez de particules pour le couvrir
const PAS = N > 12000 ? 2 : 3;
const LARGEUR_MONDE = 11; // largeur max de la zone texte en unités three

/** Découpe une phrase en lignes qui tiennent dans maxW pixels (police déjà réglée).
 *  Un "\n" dans la phrase force un retour à la ligne (ex. le « & » seul). */
function decouperEnLignes(ctx: CanvasRenderingContext2D, phrase: string, maxW: number): string[] {
  const lignes: string[] = [];
  for (const segment of phrase.split("\n")) {
    const mots = segment.split(" ");
    let courante = "";
    for (const mot of mots) {
      const essai = courante ? `${courante} ${mot}` : mot;
      if (ctx.measureText(essai).width > maxW && courante) {
        lignes.push(courante);
        courante = mot;
      } else {
        courante = essai;
      }
    }
    if (courante) lignes.push(courante);
  }
  return lignes;
}

/**
 * Échantillonne TOUTES les phrases, empilées verticalement, et répartit les N
 * particules en tranches contiguës (une par phrase, proportionnelle à son encre).
 * La taille de police est commune : la plus grande pour laquelle le bloc complet
 * (avec retours à la ligne) tient dans la bande verticale disponible.
 */
function construireCibles(
  phrases: string[],
  largeurMonde: number,
  bandeMonde: number
): { cibles: Float32Array; tranches: { debut: number; fin: number }[] } {
  const tranches = phrases.map(() => ({ debut: 0, fin: 0 }));
  const cibles = new Float32Array(N * 3);
  const c = document.createElement("canvas");
  c.width = 1400;
  c.height = 760;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { cibles, tranches };

  // Fraunces si elle est chargée (next/font expose la famille via la CSS var)
  const famille =
    getComputedStyle(document.documentElement).getPropertyValue("--font-fraunces").trim() ||
    "serif";
  const ppu = c.width / largeurMonde; // pixels canvas par unité monde
  const maxW = c.width - 100;

  // Hauteur monde du bloc complet pour une taille de police donnée.
  // ⚠️ opsz de Fraunces : métriques non proportionnelles → toujours re-mesurer.
  const hauteurBloc = (taille: number): { h: number; parPhrase: string[][] } => {
    ctx.font = `800 ${taille}px ${famille}`;
    const parPhrase = phrases.map((p) => decouperEnLignes(ctx, p, maxW));
    const interligne = (taille * 1.32) / ppu;
    const ecartBloc = (taille * 0.52) / ppu;
    const totalLignes = parPhrase.reduce((a, l) => a + l.length, 0);
    return { h: totalLignes * interligne + (phrases.length - 1) * ecartBloc, parPhrase };
  };

  // Taille commune par dichotomie : le bloc entier doit tenir dans la bande
  let bas = 36;
  let haut = 150;
  for (let i = 0; i < 8; i++) {
    const milieu = Math.floor((bas + haut) / 2);
    if (hauteurBloc(milieu).h <= bandeMonde) bas = milieu;
    else haut = milieu;
  }
  const taille = bas;
  const { h: hautTotal, parPhrase } = hauteurBloc(taille);
  const interligne = (taille * 1.32) / ppu;
  const ecartBloc = (taille * 0.52) / ppu;

  // Échantillonner chaque phrase (avec ses retours à la ligne) à sa place dans
  // la pile. PAS ADAPTATIF : on élargit la grille jusqu'à ce que le nombre de
  // points soit ≤ N — chaque point reçoit alors AU MOINS une particule, les
  // lettres sont pleines (une grille régulière clairsemée laissait des stries
  // illisibles quand les particules manquaient).
  ctx.font = `800 ${taille}px ${famille}`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let pointsParPhrase: number[][] = [];
  for (let pas = PAS; pas <= 8; pas++) {
    pointsParPhrase = [];
    let total = 0;
    let yCurseur = hautTotal / 2; // haut du bloc, centré sur 0
    for (const lignes of parPhrase) {
      ctx.clearRect(0, 0, c.width, c.height);
      const hPx = lignes.length * taille * 1.32;
      lignes.forEach((ligne, j) => {
        ctx.fillText(ligne, c.width / 2, c.height / 2 - hPx / 2 + (j + 0.5) * taille * 1.32);
      });
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      const points: number[] = [];
      const centreY = yCurseur - (lignes.length * interligne) / 2;
      for (let y = 0; y < c.height; y += pas) {
        for (let x = 0; x < c.width; x += pas) {
          if (data[(y * c.width + x) * 4 + 3] > 140) {
            points.push(
              ((x - c.width / 2) / c.width) * largeurMonde,
              (-(y - c.height / 2) / c.width) * largeurMonde + centreY,
              0
            );
          }
        }
      }
      pointsParPhrase.push(points);
      total += points.length / 3;
      yCurseur -= lignes.length * interligne + ecartBloc;
    }
    if (total <= N) break;
  }

  // Répartir les N particules proportionnellement à l'encre de chaque phrase
  const totaux = pointsParPhrase.map((p) => p.length / 3);
  const total = totaux.reduce((a, b) => a + b, 0) || 1;
  let debut = 0;
  pointsParPhrase.forEach((points, k) => {
    const nb = totaux[k];
    let compte =
      k === phrases.length - 1 ? N - debut : Math.round((N * nb) / total);
    compte = Math.max(0, Math.min(compte, N - debut));
    for (let i = 0; i < compte; i++) {
      const gi = debut + i;
      // Enjambée sur TOUS les points (jamais i % nb : si la tranche a moins de
      // particules que la phrase n'a de points, seul le HAUT serait couvert —
      // les 2es lignes disparaissaient sur mobile)
      const j = compte < nb ? Math.floor((i * nb) / compte) % nb : i % Math.max(nb, 1);
      // Jitter minimal : les lettres restent nettes (la vie vient de l'oscillation)
      cibles[gi * 3] = points[j * 3] + (Math.random() - 0.5) * 0.012;
      cibles[gi * 3 + 1] = points[j * 3 + 1] + (Math.random() - 0.5) * 0.012;
      cibles[gi * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    tranches[k] = { debut, fin: debut + compte };
    debut += compte;
  });
  return { cibles, tranches };
}

function Particules({ progress, pointer, onSegment }: SceneProps) {
  const ref = useRef<THREE.Points>(null);
  const groupe = useRef<THREE.Group>(null);
  // Verrou séquentiel : la phrase affichée ne peut avancer (ou reculer) que d'UN
  // pas à la fois, avec un temps de tenue minimum — un scroll rapide ne peut
  // JAMAIS sauter une phrase, la séquence se joue toujours en entier.
  const segVisuel = useRef(0);
  const dernierPas = useRef(0);
  // Largeur du monde visible à z=0 : le bloc est échantillonné pour toujours
  // tenir dans ~90 % de l'écran. L'échelle est intégrée AUX DONNÉES
  // (cibles + nuage), recalculées au resize.
  const viewport = useThree((s) => s.viewport);
  const largeurCible = Math.min(LARGEUR_MONDE, viewport.width * 0.9);
  // Bande verticale réservée au bloc de phrases (le bas reste au CTA)
  const bandeMonde = viewport.height * 0.52;
  const vitesses = useRef<Float32Array | null>(null);
  if (!vitesses.current) vitesses.current = new Float32Array(N * 3);

  // Vie des particules : chaque point oscille en permanence autour de sa cible
  // (phase, fréquence et amplitude propres → respiration organique, jamais figée)
  const anim = useMemo(() => {
    const phases = new Float32Array(N);
    const freqs = new Float32Array(N);
    const amps = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      phases[i] = Math.random() * Math.PI * 2;
      freqs[i] = 0.6 + Math.random() * 1.1;
      // Amplitude FINE sur le texte (frémissement, pas de brouillage des lettres)
      amps[i] = 0.005 + Math.random() * 0.007;
    }
    return { phases, freqs, amps };
  }, []);

  const { positions, couleurs, cibles, nuage, tranches } = useMemo(() => {
    const { cibles, tranches } = construireCibles(
      COPY.hero.sequence,
      largeurCible,
      bandeMonde
    );
    // État initial : nuage ample, légèrement aplati, proportionnel à l'écran.
    // Sert aussi de cible aux phrases pas encore formées.
    const ampleur = largeurCible / LARGEUR_MONDE;
    const nuage = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = (4.5 + Math.random() * 4.5) * ampleur;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nuage[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      nuage[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      nuage[i * 3 + 2] = r * Math.cos(phi) * 0.5 - 1;
    }
    const positions = new Float32Array(nuage);
    // Phrase 0 : part du centre (Y≈0) comme les phrases suivantes → effet "remonte"
    const ch0 = tranches[0];
    for (let i = ch0.debut; i < ch0.fin; i++) {
      positions[i * 3]     = cibles[i * 3]     + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = cibles[i * 3 + 2] + (Math.random() - 0.5) * 0.1;
    }
    // Blanc papier UNIFORME (légère variation de luminance seulement) : des
    // accents colorés DANS les lettres les rendaient sales — lisibilité d'abord
    const couleurs = new Float32Array(N * 3);
    const papier = new THREE.Color("#f6f3ea");
    for (let i = 0; i < N; i++) {
      const lum = 0.88 + Math.random() * 0.12;
      couleurs[i * 3] = papier.r * lum;
      couleurs[i * 3 + 1] = papier.g * lum;
      couleurs[i * 3 + 2] = papier.b * lum;
    }
    return { positions, couleurs, cibles, nuage, tranches };
  }, [largeurCible, bandeMonde]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const p = Math.min(Math.max(progress.current ?? 0, 0), 1);
    const t = state.clock.elapsedTime;

    // Phrase demandée par le scroll…
    const nb = COPY.hero.sequence.length;
    const segCible = Math.min(nb - 1, Math.floor(p * nb));

    // …mais la phrase AFFICHÉE n'avance que d'un pas à la fois, jamais avant
    // TENUE secondes : chaque phrase est vue, quel que soit le rythme du scroll.
    const TENUE = 1.1;
    const v = vitesses.current!;

    // arr déclaré ici pour être accessible dans le bloc segment (téléportation)
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;

    if (segVisuel.current !== segCible && t - dernierPas.current > TENUE) {
      const avant = segVisuel.current;
      segVisuel.current += Math.sign(segCible - avant);
      dernierPas.current = t;
      onSegment?.(segVisuel.current);

      const nouvSeg = segVisuel.current;
      if (nouvSeg > avant) {
        // Nouvelle phrase → téléporter ses particules au centre de l'écran (Y≈0)
        // Le ressort les fera monter vers leur position finale dans la pile.
        const ch = tranches[nouvSeg];
        for (let i = ch.debut; i < ch.fin; i++) {
          const i3 = i * 3;
          arr[i3]     = cibles[i3]     + (Math.random() - 0.5) * 0.2;
          arr[i3 + 1] = (Math.random() - 0.5) * 0.3;
          arr[i3 + 2] = cibles[i3 + 2] + (Math.random() - 0.5) * 0.1;
          v[i3] = v[i3 + 1] = v[i3 + 2] = 0;
        }
      } else {
        // Scroll arrière : impulsion de dispersion sur la tranche qui perd sa forme
        const ch = tranches[avant];
        for (let i = ch.debut * 3; i < ch.fin * 3; i++) v[i] = (Math.random() - 0.5) * 0.22;
      }
    }
    // Chaque tranche vise sa phrase si elle est atteinte, sinon le nuage —
    // ressort amorti vers la cible + inertie de l'impulsion + oscillation
    // permanente (les points « respirent » autour des lettres, le nuage
    // dérive plus largement)
    const seg = segVisuel.current;
    const { phases, freqs, amps } = anim;
    for (let k = 0; k < tranches.length; k++) {
      const forme = k <= seg;
      const src = forme ? cibles : nuage;
      const ampli = forme ? 1 : 9;
      const { debut, fin } = tranches[k];
      for (let idx = debut; idx < fin; idx++) {
        const i3 = idx * 3;
        const a = amps[idx] * ampli;
        const ox = Math.sin(t * freqs[idx] + phases[idx]) * a;
        const oy = Math.cos(t * freqs[idx] * 1.27 + phases[idx]) * a;
        v[i3] = v[i3] * 0.84 + (src[i3] + ox - arr[i3]) * 0.06;
        v[i3 + 1] = v[i3 + 1] * 0.84 + (src[i3 + 1] + oy - arr[i3 + 1]) * 0.06;
        v[i3 + 2] = v[i3 + 2] * 0.84 + (src[i3 + 2] - arr[i3 + 2]) * 0.06;
        arr[i3] += v[i3];
        arr[i3 + 1] += v[i3 + 1];
        arr[i3 + 2] += v[i3 + 2];
      }
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
    // Légèrement au-dessus du centre : le bloc CTA vit dans le bas de l'écran
    <group ref={groupe} position={[0, 0.45, 0]}>
      <points ref={ref} key={`${largeurCible}-${bandeMonde}`}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[couleurs, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.96}
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
