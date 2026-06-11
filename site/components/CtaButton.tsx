import { Link } from "next-view-transitions";

// Style partagé du CTA principal — réutilisable sur <a>/<button> (ex. mini-test).
// Pas d'utilitaire de display concurrent : ajouter "w-full" au besoin, jamais "block".
export const CTA_CLASSES =
  "group inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-4 text-base font-semibold sm:px-9 sm:text-lg text-white shadow-lift transition duration-300 hover:-translate-y-0.5 hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const ARROW = (
  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
);

export default function CtaButton({
  href,
  children,
  externe = false,
}: {
  href: string;
  children: React.ReactNode;
  externe?: boolean;
}) {
  return externe ? (
    <a href={href} className={CTA_CLASSES} target="_blank" rel="noopener noreferrer">
      {children}
      {ARROW}
    </a>
  ) : (
    <Link href={href} className={CTA_CLASSES}>
      {children}
      {ARROW}
    </Link>
  );
}
