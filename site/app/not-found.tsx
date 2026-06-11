import { Link } from "next-view-transitions";
import Footer from "@/components/Footer";
import { CTA_CLASSES } from "@/components/CtaButton";

export default function NotFound() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-32 text-center">
        <h1 className="text-3xl font-bold">Page introuvable</h1>
        <p className="mt-4 text-lg text-muted">
          Cette page n&apos;existe pas (ou plus). Ton rapport sur mesure, lui, est toujours là.
        </p>
        <Link href="/" className={`mt-8 ${CTA_CLASSES}`}>
          Retour à l&apos;accueil
        </Link>
      </div>
      <Footer />
    </main>
  );
}
