"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * « Du chaos à UNE décision » — un nuage de formes pâles dérive ;
 * au scroll, il converge et s'efface pendant qu'UNE forme émeraude
 * se cristallise au centre.
 * `progress` (0→1) est piloté par le scroll du héro, `pointer` par la souris.
 */

type SceneProps = {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
};

const COUNT = 26;
const PALETTE = ["#d8d4ca", "#cfd8d4", "#e3ddd0", "#c9d2cd", "#ded8cb"];

function ChaosCloud({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const one = useRef<THREE.Mesh>(null);
  const oneInner = useRef<THREE.Mesh>(null);

  const shapes = useMemo(() => {
    const rng = (seed: number) => {
      // déterministe : pas de Math.random pour un rendu stable
      const x = Math.sin(seed * 999) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 2;
      const radius = 2.2 + rng(i + 1) * 3.4;
      return {
        start: new THREE.Vector3(
          Math.cos(angle) * radius,
          (rng(i + 2) - 0.5) * 4.2,
          (rng(i + 3) - 0.5) * 3 - 1
        ),
        scale: 0.16 + rng(i + 4) * 0.4,
        speed: 0.2 + rng(i + 5) * 0.5,
        kind: i % 3,
        color: PALETTE[i % PALETTE.length],
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);
    const ease = p * p * (3 - 2 * p); // smoothstep

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        (pointer.current?.x ?? 0) * 0.22,
        0.05
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        (pointer.current?.y ?? 0) * -0.12,
        0.05
      );
      group.current.children.forEach((child, i) => {
        const s = shapes[i];
        if (!s) return;
        const mesh = child as THREE.Mesh;
        // dérive lente + convergence vers le centre au scroll
        const drift = Math.sin(t * s.speed + i) * 0.18;
        mesh.position.x = THREE.MathUtils.lerp(s.start.x + drift, 0, ease);
        mesh.position.y = THREE.MathUtils.lerp(
          s.start.y + Math.cos(t * s.speed * 0.8 + i * 2) * 0.22,
          0,
          ease
        );
        mesh.position.z = THREE.MathUtils.lerp(s.start.z, -0.5, ease);
        const sc = s.scale * (1 - ease * 0.92);
        mesh.scale.setScalar(Math.max(sc, 0.001));
        mesh.rotation.x = t * s.speed * 0.4 + i;
        mesh.rotation.y = t * s.speed * 0.3 + i * 0.7;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = 0.85 * (1 - ease);
      });
    }

    // LA décision : se cristallise au centre
    if (one.current) {
      const appear = THREE.MathUtils.clamp((ease - 0.25) / 0.75, 0, 1);
      one.current.scale.setScalar(0.001 + appear * 1.15);
      one.current.rotation.y = t * 0.35;
      one.current.rotation.z = Math.sin(t * 0.5) * 0.08;
      (one.current.material as THREE.MeshStandardMaterial).opacity = appear;
    }
    if (oneInner.current) {
      const appear = THREE.MathUtils.clamp((ease - 0.25) / 0.75, 0, 1);
      oneInner.current.scale.setScalar(0.001 + appear * 0.72);
      oneInner.current.rotation.y = -t * 0.5;
      (oneInner.current.material as THREE.MeshStandardMaterial).opacity = appear * 0.9;
    }
  });

  return (
    <group position={[1.9, 0.1, -0.4]}>
      <group ref={group}>
        {shapes.map((s, i) => (
          <mesh key={i} position={s.start}>
            {s.kind === 0 ? (
              <icosahedronGeometry args={[1, 0]} />
            ) : s.kind === 1 ? (
              <octahedronGeometry args={[1, 0]} />
            ) : (
              <dodecahedronGeometry args={[1, 0]} />
            )}
            <meshStandardMaterial
              color={s.color}
              roughness={0.35}
              metalness={0.05}
              transparent
              opacity={0.85}
              flatShading
            />
          </mesh>
        ))}
      </group>
      <mesh ref={one}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0e6b4f"
          roughness={0.25}
          metalness={0.35}
          transparent
          opacity={0}
          flatShading
        />
      </mesh>
      <mesh ref={oneInner}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#b88a2e"
          roughness={0.4}
          metalness={0.5}
          wireframe
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#e7f2ee" />
      <ChaosCloud {...props} />
    </Canvas>
  );
}
