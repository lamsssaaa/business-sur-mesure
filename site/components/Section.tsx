export default function Section({
  id,
  children,
  alt = false,
}: {
  id?: string;
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section id={id} className={alt ? "bg-accent-soft" : ""}>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">{children}</div>
    </section>
  );
}
