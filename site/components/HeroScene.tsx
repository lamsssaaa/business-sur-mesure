"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COPY } from "@/lib/copy";

/**
 * Héro v6 — « centre de scène » (lisibilité d'abord, demande Farouk).
 * Les particules ne forment qu'UNE phrase à la fois, en grand au centre :
 * toutes les particules pour une seule phrase = lettres denses, lisibles.
 * Quand la phrase suivante arrive, la précédente se grave en HTML net dans
 * la pile au-dessus (Hero.tsx) : rien ne disparaît, tout reste lisible.
 * `progress` (0→1) est piloté par le scroll du héro, `pointer` par la souris.
 * onSegment(s) : s = phrase active (0..nb-1) ; s === nb → séquence terminée
 * (la dernière phrase est gravée, les particules se dispersent, le CTA sort).
 */

type SceneProps = {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  onSegment?: (segment: number) => void;
};

// Moins de particules sur mobile : même effet, fluidité garantie
const MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const N = MOBILE ? 12000 : 22000;
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
 * Échantillonne UNE phrase, centrée sur (0,0), la plus grande possible dans
 * largeurMonde × bandeMonde. Toutes les N particules lui sont affectées.
 * PAS ADAPTATIF : la grille s'élargit jusqu'à ce que le nombre de points
 * soit ≤ N — chaque point reçoit au moins une particule, lettres pleines.
 */
function construireCible(phrase: string, largeurMonde: number, bandeMonde: number): Float32Array {
  const cible = new Float32Array(N * 3);
  const c = document.createElement("canvas");
  c.width = 1400;
  c.height = 760;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return cible;

  const famille =
    getComputedStyle(document.documentElement).getPropertyValue("--font-fraunces").trim() ||
    "serif";
  const ppu = c.width / largeurMonde; // pixels canvas par unité monde
  const maxW = c.width - 100;
  const INTERLIGNE = 1.18;

  // Plus grande taille de police qui tient à la fois dans la bande monde et
  // dans le canvas. ⚠️ opsz de Fraunces : métriques non proportionnelles →
  // toujours re-mesurer après chaque ajustement.
  const mesure = (taille: number) => {
    ctx.font = `800 ${taille}px ${famille}`;
    const lignes = decouperEnLignes(ctx, phrase, maxW);
    const hPx = lignes.length * taille * INTERLIGNE;
    return { lignes, hPx, hMonde: hPx / ppu };
  };
  let bas = 40;
  let haut = 340;
  for (let i = 0; i < 9; i++) {
    const milieu = Math.floor((bas + haut) / 2);
    const m = mesure(milieu);
    if (m.hMonde <= bandeMonde && m.hPx <= c.height - 60) bas = milieu;
    else haut = milieu;
  }
  const taille = bas;
  const { lignes, hPx } = mesure(taille);

  ctx.font = `800 ${taille}px ${famille}`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.clearRect(0, 0, c.width, c.height);
  lignes.forEach((ligne, j) => {
    ctx.fillText(ligne, c.width / 2, c.height / 2 - hPx / 2 + (j + 0.5) * taille * INTERLIGNE);
  });
  const data = ctx.getImageData(0, 0, c.width, c.height).data;

  let points: number[] = [];
  for (let pas = 2; pas <= 9; pas++) {
    points = [];
    for (let y = 0; y < c.height; y += pas) {
      for (let x = 0; x < c.width; x += pas) {
        if (data[(y * c.width + x) * 4 + 3] > 140) {
          points.push(
            ((x - c.width / 2) / c.width) * largeurMonde,
            (-(y - c.height / 2) / c.width) * largeurMonde,
            0
          );
        }
      }
    }
    if (points.length / 3 <= N) break;
  }

  // Toutes les particules sur la phrase : i % M remplit chaque point au moins
  // une fois, les surnuméraires densifient. Jitter proportionnel à l'échelle
  // (un jitter fixe « moisissait » les lettres sur mobile, plus petites).
  const M = Math.max(points.length / 3, 1);
  const jit = 0.012 * (largeurMonde / LARGEUR_MONDE);
  for (let i = 0; i < N; i++) {
    const j = i % M;
    cible[i * 3] = points[j * 3] + (Math.random() - 0.5) * jit;
    cible[i * 3 + 1] = points[j * 3 + 1] + (Math.random() - 0.5) * jit;
    cible[i * 3 + 2] = (Math.random() - 0.5) * jit * 3;
  }
  return cible;
}

function Particules({ progress, pointer, onSegment }: SceneProps) {
  const ref = useRef<THREE.Points>(null);
  const groupe = useRef<THREE.Group>(null);
  // Verrou séquentiel : la phrase affichée ne peut avancer (ou reculer) que
  // d'UN pas à la fois, avec un temps de tenue minimum — un scroll rapide ne
  // peut JAMAIS sauter une phrase, la séquence se joue toujours en entier.
  const segVisuel = useRef(0);
  const dernierPas = useRef(0);
  const fini = useRef(false);
  const initialise = useRef(false);
  const viewport = useThree((s) => s.viewport);
  const largeurCible = Math.min(LARGEUR_MONDE, viewport.width * 0.92);
  // Bande verticale de la phrase en scène (la pile HTML vit au-dessus)
  const bandeMonde = viewport.height * 0.3;
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
      amps[i] = 0.004 + Math.random() * 0.006;
    }
    return { phases, freqs, amps };
  }, []);

  const { positions, couleurs, cibles, nuage } = useMemo(() => {
    // Une cible par phrase : N positions chacune (la phrase entière en scène)
    const cibles = COPY.hero.sequence.map((ph) =>
      construireCible(ph, largeurCible, bandeMonde)
    );
    // État initial + état final : nuage ample proportionnel à l'écran
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
    // Blanc papier uniforme (légère variation de luminance) : lisibilité d'abord
    const couleurs = new Float32Array(N * 3);
    const papier = new THREE.Color("#f6f3ea");
    for (let i = 0; i < N; i++) {
      const lum = 0.88 + Math.random() * 0.12;
      couleurs[i * 3] = papier.r * lum;
      couleurs[i * 3 + 1] = papier.g * lum;
      couleurs[i * 3 + 2] = papier.b * lum;
    }
    return { positions, couleurs, cibles, nuage };
  }, [largeurCible, bandeMonde]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const p = Math.min(Math.max(progress.current ?? 0, 0), 1);
    const t = state.clock.elapsedTime;
    const nb = COPY.hero.sequence.length;

    // Toutes les phrases passent en scène dans les premiers 80 % du parcours :
    // la fin du héro sert à LIRE la pile complète, pas à attendre.
    const segCible = Math.min(nb - 1, Math.floor((p / 0.8) * nb));
    const TENUE = 1.0; // chaque phrase reste en scène au moins 1 s
    const v = vitesses.current!;

    // REPRISE : la scène se démonte quand le héro sort de l'écran (perf) ; au
    // remontage elle doit reprendre LÀ OÙ LE SCROLL EN EST — pas rejouer la
    // séquence depuis 0 pendant que la pile HTML affiche déjà tout (bug vu par
    // Farouk : pile complète + particules sur la phrase 1).
    if (!initialise.current) {
      initialise.current = true;
      segVisuel.current = segCible;
      fini.current = segCible === nb - 1 && p > 0.93;
      dernierPas.current = t;
      onSegment?.(fini.current ? nb : segVisuel.current);
      if (segCible > 0 || fini.current) {
        // Mi-parcours : poser les particules directement sur leur cible
        // (le vol nuage→texte n'a de sens qu'à l'arrivée sur la page)
        const arr0 = (pts.geometry.attributes.position as THREE.BufferAttribute)
          .array as Float32Array;
        const src0 = fini.current ? nuage : cibles[segVisuel.current];
        arr0.set(src0);
        v.fill(0);
      }
    }

    if (segVisuel.current !== segCible && t - dernierPas.current > TENUE) {
      segVisuel.current += Math.sign(segCible - segVisuel.current);
      dernierPas.current = t;
      fini.current = false;
      onSegment?.(segVisuel.current);
      // Impulsion : la phrase en scène éclate, la suivante se reforme dessus
      for (let i = 0; i < N * 3; i++) v[i] += (Math.random() - 0.5) * 0.2;
    }

    // Fin de séquence : la dernière phrase a été tenue et le scroll touche au
    // but → elle se grave dans la pile (HTML net), les particules se libèrent.
    if (
      !fini.current &&
      segVisuel.current === nb - 1 &&
      p > 0.93 &&
      t - dernierPas.current > TENUE
    ) {
      fini.current = true;
      onSegment?.(nb);
    } else if (fini.current && p < 0.88) {
      fini.current = false;
      onSegment?.(nb - 1);
    }

    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    // Ressort amorti vers la cible (phrase en scène, ou nuage une fois fini)
    // + oscillation permanente — fine sur le texte, ample dans le nuage
    const src = fini.current ? nuage : cibles[segVisuel.current];
    const ampli = fini.current ? 9 : 1;
    const { phases, freqs, amps } = anim;
    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      const a = amps[i] * ampli;
      const ox = Math.sin(t * freqs[i] + phases[i]) * a;
      const oy = Math.cos(t * freqs[i] * 1.27 + phases[i]) * a;
      v[i3] = v[i3] * 0.84 + (src[i3] + ox - arr[i3]) * 0.06;
      v[i3 + 1] = v[i3 + 1] * 0.84 + (src[i3 + 1] + oy - arr[i3 + 1]) * 0.06;
      v[i3 + 2] = v[i3 + 2] * 0.84 + (src[i3 + 2] - arr[i3 + 2]) * 0.06;
      arr[i3] += v[i3];
      arr[i3 + 1] += v[i3 + 1];
      arr[i3 + 2] += v[i3 + 2];
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
    // Sous le centre : la pile de phrases gravées vit dans le haut de l'écran
    <group ref={groupe} position={[0, -0.8, 0]}>
      <points ref={ref} key={`${largeurCible}-${bandeMonde}`}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[couleurs, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={MOBILE ? 0.026 : 0.04}
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
