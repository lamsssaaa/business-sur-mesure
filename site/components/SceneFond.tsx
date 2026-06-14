"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Fond immersif PERSISTANT — un seul canvas WebGL fixe, derrière tout le site.
 * On « traverse » un champ de particules 3D au scroll (la caméra avance), avec
 * une dérive organique continue + parallaxe souris. C'est ce qui donne au site
 * entier l'univers du héro, section après section.
 *
 * Perf : N réduit, additive blending, dpr plafonné, animation coupée hors écran
 * jamais (le fond est toujours visible) mais throttlée. Reduced-motion / absence
 * de WebGL → rien (le dégradé CSS sombre du body sert de repli).
 */

const MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const N = MOBILE ? 2600 : 6000;
const PROFONDEUR = 60; // étendue z du tunnel de particules

function Champ({
  progress,
  pointer,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<THREE.Points>(null);
  const groupe = useRef<THREE.Group>(null);

  const { positions, couleurs, vitz } = useMemo(() => {
    const positions = new Float32Array(N * 3);
    const couleurs = new Float32Array(N * 3);
    const vitz = new Float32Array(N);
    // Trois teintes de la marque : papier (majorité), émeraude clair, or (rare)
    const papier = new THREE.Color("#eef2ec");
    const emer = new THREE.Color("#3fae86");
    const or = new THREE.Color("#d9b25e");
    for (let i = 0; i < N; i++) {
      // réparti dans un large cône autour de l'axe z
      const r = 2 + Math.random() * 26;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r * 0.7;
      positions[i * 3 + 2] = -Math.random() * PROFONDEUR;
      vitz[i] = 0.6 + Math.random() * 0.9;
      const d = Math.random();
      const c = d > 0.92 ? or : d > 0.6 ? emer : papier;
      const lum = 0.65 + Math.random() * 0.5;
      couleurs[i * 3] = c.r * lum;
      couleurs[i * 3 + 1] = c.g * lum;
      couleurs[i * 3 + 2] = c.b * lum;
    }
    return { positions, couleurs, vitz };
  }, []);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const dt = Math.min(delta, 0.05);
    const p = Math.min(Math.max(progress.current ?? 0, 0), 1);
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    // flux vers la caméra : avance continue + accélération douce au scroll
    const flux = (4 + p * 14) * dt;
    for (let i = 0; i < N; i++) {
      const z = i * 3 + 2;
      arr[z] += vitz[i] * flux;
      if (arr[z] > 6) {
        // recyclage au fond du tunnel quand la particule dépasse la caméra
        arr[z] = -PROFONDEUR;
        const r = 2 + Math.random() * 26;
        const a = Math.random() * Math.PI * 2;
        arr[i * 3] = Math.cos(a) * r;
        arr[i * 3 + 1] = Math.sin(a) * r * 0.7;
      }
    }
    pts.geometry.attributes.position.needsUpdate = true;

    // dérive lente + parallaxe souris
    const g = groupe.current;
    if (g) {
      const t = state.clock.elapsedTime;
      g.rotation.z = Math.sin(t * 0.05) * 0.08;
      g.rotation.y += ((pointer.current?.x ?? 0) * 0.18 - g.rotation.y) * 0.03;
      g.rotation.x += (-(pointer.current?.y ?? 0) * 0.1 - g.rotation.x) * 0.03;
    }
  });

  return (
    <group ref={groupe}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[couleurs, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={MOBILE ? 0.07 : 0.06}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function SceneFond() {
  const [actif, setActif] = useState(false);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    // Économie de données / connexion lente → on coupe le 3D de fond
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const lente = conn?.saveData || /2g/.test(conn?.effectiveType ?? "");
    setActif(Boolean(webgl && !reduced && !lente));
  }, []);

  useEffect(() => {
    if (!actif) return;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
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
  }, [actif]);

  if (!actif) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <Champ progress={progress} pointer={pointer} />
      </Canvas>
    </div>
  );
}
