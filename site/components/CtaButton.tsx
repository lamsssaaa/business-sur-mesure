import Link from "next/link";

// Style partagé du CTA principal — réutilisable sur <a>/<button> (ex. mini-test).
export const CTA_CLASSES =
  "inline-block rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

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
    </a>
  ) : (
    <Link href={href} className={CTA_CLASSES}>
      {children}
    </Link>
  );
}
