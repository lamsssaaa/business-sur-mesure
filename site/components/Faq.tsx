import { COPY } from "@/lib/copy";

export default function Faq() {
  return (
    <div className="space-y-3">
      {COPY.faq.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-line bg-white px-6 py-5 shadow-float transition hover:border-accent/40"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-medium">
            {item.q}
            <span
              aria-hidden="true"
              className="faq-plus flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xl font-semibold leading-none text-accent"
            >
              +
            </span>
          </summary>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{item.r}</p>
        </details>
      ))}
    </div>
  );
}
