import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-paper via-paper/85 to-transparent pb-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-ink"
        >
          Ton Business <span className="text-accent italic">Sur Mesure</span>
        </Link>
        <Link
          href="/mini-test/"
          className="rounded-full border border-ink/15 bg-paper/70 px-5 py-2 text-sm font-semibold backdrop-blur-md transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Mini-test gratuit
        </Link>
      </div>
    </header>
  );
}
