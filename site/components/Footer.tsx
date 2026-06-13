import { Link } from "next-view-transitions";
import { COPY } from "@/lib/copy";
import { CONTACT_EMAIL } from "@/lib/config";

/* Footer-colophon : la scène finale répond au héro — la décision est posée. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-20 sm:pb-10 sm:pt-28">
        <p className="font-display text-[clamp(2.4rem,8vw,7rem)] font-semibold leading-[0.95] tracking-tight">
          53 Questions
          <br />
          <span className="italic text-accent">Sur Mesure</span>
        </p>
        <p className="mt-6 font-display text-lg italic text-muted">Genève, Suisse</p>
        <div className="mt-14 space-y-4 border-t border-line pt-6 text-sm text-muted">
          <p className="max-w-3xl">{COPY.footer.disclaimer}</p>
          <p className="flex flex-wrap gap-x-2 gap-y-1">
            <span>
              Contact :{" "}
              <a className="link-anim text-ink" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </span>
            <span aria-hidden="true">·</span>
            {COPY.footer.liens.map((lien, i) => (
              <span key={lien.href}>
                <Link className="link-anim text-ink" href={lien.href}>
                  {lien.label}
                </Link>
                {i < COPY.footer.liens.length - 1 && <span aria-hidden="true"> ·</span>}
              </span>
            ))}
          </p>
          <p>{COPY.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
