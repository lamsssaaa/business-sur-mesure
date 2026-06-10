import Link from "next/link";

export default function CtaButton({
  href,
  children,
  externe = false,
}: {
  href: string;
  children: React.ReactNode;
  externe?: boolean;
}) {
  const cls =
    "inline-block rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:opacity-90";
  return externe ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
