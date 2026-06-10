import { COPY } from "@/lib/copy";

export default function Faq() {
  return (
    <div className="space-y-3">
      {COPY.faq.map((item) => (
        <details key={item.q} className="rounded-lg border border-line bg-white p-4">
          <summary className="cursor-pointer font-medium">{item.q}</summary>
          <p className="mt-3 whitespace-pre-line text-muted">{item.r}</p>
        </details>
      ))}
    </div>
  );
}
