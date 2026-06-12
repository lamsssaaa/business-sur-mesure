"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COPY } from "@/lib/copy";

/**
 * Héro v5 — « les phrases s'accumulent » (demande Farouk : une phrase formée
 * ne disparaît JAMAIS). Chaque phrase de COPY.hero.sequence possède sa propre
 * tranche de particules : au scroll, la phrase suivante se forme SOUS les
 * précédentes, qui restent affichées. La dernière (en or) complète le tableau.
 * `progress` (0→1) est piloté par le scroll du héro, `pointer` par la souris.
 */

type SceneProps = {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  /** Notifie la phrase visuellement active (pilote décors + apparition du CTA). */
  onSegment?: (segment: number) => void;
};

// Moins de particules sur mobile : même effet, fluidité garantie
const N = typeof window !== "undefined" && window.innerWidth < 768 ? 9000 : 16000;
const LARGEUR_MONDE = 11; // largeur max de la zone texte en unités three

/** Découpe une phrase en lignes qui tiennent dans maxW pixels (police déjà réglée). */
function decouperEnLignes(ctx: CanvasRenderingContext2D, phrase: string, maxW: number): string[] {
  const mots = phrase.split(" ");
  const lignes: string[] = [];
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
    ctx.font = `600 ${taille}px ${famille}`;
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

  // Échantillonner chaque phrase (avec ses retours à la ligne) à sa place dans la pile
  ctx.font = `600 ${taille}px ${famille}`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let yCurseur = hautTotal / 2; // haut du bloc, centré sur 0
  const pointsParPhrase: number[][] = [];
  for (const lignes of parPhrase) {
    ctx.clearRect(0, 0, c.width, c.height);
    const hPx = lignes.length * taille * 1.32;
    lignes.forEach((ligne, j) => {
      ctx.fillText(ligne, c.width / 2, c.height / 2 - hPx / 2 + (j + 0.5) * taille * 1.32);
    });
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    const points: number[] = [];
    const pas = 3;
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
    yCurseur -= lignes.length * interligne + ecartBloc;
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
      cibles[gi * 3] = points[j * 3] + (Math.random() - 0.5) * 0.02;
      cibles[gi * 3 + 1] = points[j * 3 + 1] + (Math.random() - 0.5) * 0.02;
      cibles[gi * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    tranches[k] = { debut, fin: debut + compte };
    debut += compte;
  });
  return { cibles, tranches };
}

/**
 * Le logo en 3D : une gemme taillée (couronne + pavillon à 8 facettes),
 * émeraude vernie aux arêtes d'or, en rotation lente au-dessus du message.
 */
function GemmeLogo() {
  const g = useRef<THREE.Group>(null);

  const { geoCouronne, geoPavillon, aretesC, aretesP, matPierre, matOr } = useMemo(() => {
    const geoCouronne = new THREE.CylinderGeometry(0.26, 0.46, 0.2, 8, 1);
    const geoPavillon = new THREE.CylinderGeometry(0.46, 0.001, 0.5, 8, 1);
    const aretesC = new THREE.EdgesGeometry(geoCouronne);
    const aretesP = new THREE.EdgesGeometry(geoPavillon);
    const matPierre = new THREE.MeshPhysicalMaterial({
      color: "#0e6b4f",
      flatShading: true,
      roughness: 0.16,
      metalness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      emissive: new THREE.Color("#06301f"),
    });
    const matOr = new THREE.LineBasicMaterial({ color: "#d8a948", transparent: true, opacity: 0.9 });
    return { geoCouronne, geoPavillon, aretesC, aretesP, matPierre, matOr };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const gr = g.current;
    if (!gr) return;
    gr.rotation.y = t * 0.45; // rotation joaillière, lente
    gr.position.y = 3.05 + Math.sin(t * 0.9) * 0.07; // flottement
  });

  return (
    <group ref={g} position={[0, 3.05, 0]}>
      <mesh geometry={geoCouronne} material={matPierre} position={[0, 0.1, 0]} />
      <mesh geometry={geoPavillon} material={matPierre} position={[0, -0.25, 0]} />
      <lineSegments geometry={aretesC} material={matOr} position={[0, 0.1, 0]} />
      <lineSegments geometry={aretesP} material={matOr} position={[0, -0.25, 0]} />
    </group>
  );
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
    // Papier lumineux pour la masse, émeraude clair pour les accents…
    const couleurs = new Float32Array(N * 3);
    const papier = new THREE.Color("#f2efe7");
    const or = new THREE.Color("#d8a948");
    const orClair = new THREE.Color("#e8c87a");
    const emeraude = new THREE.Color("#7fc3a8");
    const derniere = tranches[tranches.length - 1];
    for (let i = 0; i < N; i++) {
      const t = Math.random();
      // …et la phrase FINALE entièrement en or (c'est elle qui reste avec le CTA)
      const enOr = i >= derniere.debut && i < derniere.fin;
      const c = enOr ? (t < 0.55 ? or : orClair) : t < 0.06 ? or : t < 0.22 ? emeraude : papier;
      couleurs[i * 3] = c.r;
      couleurs[i * 3 + 1] = c.g;
      couleurs[i * 3 + 2] = c.b;
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
    if (segVisuel.current !== segCible && t - dernierPas.current > TENUE) {
      const avant = segVisuel.current;
      segVisuel.current += Math.sign(segCible - avant);
      dernierPas.current = t;
      onSegment?.(segVisuel.current);
      // Impulsion de dispersion SEULEMENT sur la tranche qui change d'état
      // (celle qui se forme en avançant, celle qui se dissout en reculant) :
      // les phrases déjà posées ne bougent pas.
      const ch = tranches[Math.max(avant, segVisuel.current)];
      for (let i = ch.debut * 3; i < ch.fin * 3; i++) v[i] = (Math.random() - 0.5) * 0.22;
    }

    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    // Chaque tranche vise sa phrase si elle est atteinte, sinon le nuage —
    // ressort amorti vers la cible + inertie de l'impulsion
    const seg = segVisuel.current;
    for (let k = 0; k < tranches.length; k++) {
      const src = k <= seg ? cibles : nuage;
      const { debut, fin } = tranches[k];
      for (let i = debut * 3; i < fin * 3; i++) {
        v[i] = v[i] * 0.84 + (src[i] - arr[i]) * 0.06;
        arr[i] += v[i];
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
      {/* Éclairage de la gemme uniquement (les particules additives n'y réagissent pas) */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.7} />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#d8a948" />
      <GemmeLogo />
      <Particules {...props} />
    </Canvas>
  );
}
