import Link from "next/link";
import { COPY } from "@/lib/copy";
import { CONTACT_EMAIL } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-10 text-sm text-muted">
        <p>{COPY.footer.disclaimer}</p>
        <p>
          Contact :{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          {" · "}
          <Link className="underline" href="/confidentialite/">
            {COPY.footer.liens[0]}
          </Link>
          {" · "}
          <Link className="underline" href="/conditions/">
            {COPY.footer.liens[1]}
          </Link>
        </p>
        <p>{COPY.footer.copyright}</p>
      </div>
    </footer>
  );
}
