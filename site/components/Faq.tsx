import { COPY } from "@/lib/copy";

/* FAQ en index éditorial : filets sur le papier, numéros Q.01…, zéro carte. */
export default function Faq() {
  return (
    <div className="border-b border-line">
      {COPY.faq.map((item, i) => (
        <details key={item.q} className="group border-t border-line">
          <summary className="flex cursor-pointer items-baseline gap-5 py-6 transition-colors hover:text-accent sm:gap-8">
            <span className="kicker shrink-0 tabular-nums">Q.{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 font-display text-xl font-medium leading-snug sm:text-2xl">
              {item.q}
            </span>
            <span
              aria-hidden="true"
              className="faq-plus shrink-0 self-center font-sans text-2xl font-light leading-none text-accent"
            >
              +
            </span>
          </summary>
          <div className="faq-reponse pb-8 pl-[3.25rem] sm:pl-[4.5rem]">
            <p className="max-w-2xl whitespace-pre-line border-l-2 border-accent pl-5 leading-relaxed text-muted">
              {item.r}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
