/* Coche dessinée (remplace les ✓ texte) — le tracé s'anime via la classe .check-draw.
   (Les anciens composants Gem/QuizGem ont été supprimés avec le logo gemme.) */
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
