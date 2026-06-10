/* La gemme — l'identité du site (« la décision »). Réutilisée partout :
   favicon, héro fallback, coches, prix, footer, progression du quiz. */

export function Gem({
  size = 64,
  variant = "plein",
  className = "",
}: {
  size?: number;
  variant?: "plein" | "pale" | "or";
  className?: string;
}) {
  const fills =
    variant === "plein"
      ? { a: "#0e6b4f", b: "#10845f", c: "#0c5a43", d: "#0a4a37", e: "#0e6b4f", l: "#b88a2e" }
      : variant === "or"
        ? { a: "#b88a2e", b: "#cda04a", c: "#a07724", d: "#8a661f", e: "#b88a2e", l: "#faf9f6" }
        : { a: "#d9e5e0", b: "#e3ece8", c: "#cfdfd8", d: "#c5d8d0", e: "#d9e5e0", l: "#b88a2e" };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
    >
      <polygon points="32,8 54,22 54,44 32,56 10,44 10,22" fill={fills.a} />
      <polygon points="32,8 54,22 32,30" fill={fills.b} />
      <polygon points="32,8 10,22 32,30" fill={fills.c} />
      <polygon points="10,22 32,30 32,56 10,44" fill={fills.d} />
      <polygon points="54,22 32,30 32,56 54,44" fill={fills.e} />
      <polyline points="32,8 32,30 10,22" fill="none" stroke={fills.l} strokeWidth="1" opacity="0.85" />
      <polyline points="54,22 32,30 32,56" fill="none" stroke={fills.l} strokeWidth="1" opacity="0.85" />
    </svg>
  );
}

/* La gemme du quiz : 10 facettes — chaque réponse en taille une.
   À la 10e, la gemme complète scintille (classe .gem-complete). */
export function QuizGem({ taillees, size = 56 }: { taillees: number; size?: number }) {
  const C = 32;
  const R = 26;
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    return [C + R * Math.cos(a), C + R * Math.sin(a)] as const;
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={taillees >= 10 ? "gem-complete" : ""}
    >
      {pts.map((p, i) => {
        const q = pts[(i + 1) % 10];
        const pleine = i < taillees;
        return (
          <polygon
            key={i}
            points={`${C},${C} ${p[0]},${p[1]} ${q[0]},${q[1]}`}
            fill={pleine ? (i % 2 ? "#10845f" : "#0e6b4f") : "#e5e2db"}
            stroke="#faf9f6"
            strokeWidth="1"
            style={{ transition: "fill 0.4s cubic-bezier(0.22,1,0.36,1)" }}
          />
        );
      })}
    </svg>
  );
}

/* Coche dessinée (remplace les ✓ texte) — le tracé s'anime via la classe .check-draw */
export function Check({ className = "", or = false }: { className?: string; or?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={or ? "#b88a2e" : "#0e6b4f"}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="check-path" d="M4.5 12.5l5 5L19.5 7" pathLength={1} />
    </svg>
  );
}
