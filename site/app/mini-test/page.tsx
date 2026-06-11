import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Footer from "@/components/Footer";

// Le mini-test a été retiré (décision v4 : le site vend le rapport directement).
// Cette page reste pour ne casser aucun lien déjà partagé : elle renvoie vers l'offre.
export const metadata: Metadata = {
  title: "Votre rapport sur mesure",
  description:
    "Le mini-test a été remplacé : commandez directement votre rapport personnalisé — LE business à lancer selon vos 50 réponses, livré en 48 h.",
  robots: { index: false },
};

export default function MiniTest() {
  return (
    <main>
      <meta httpEquiv="refresh" content="4;url=/business-sur-mesure/#prix" />
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-32 text-center sm:pt-40">
        <h1 className="text-3xl font-bold">Cette page a changé</h1>
        <p className="mt-4 text-muted">
          Le mini-test a pris sa retraite : on va à l&apos;essentiel. Votre rapport sur mesure —
          LE business à lancer selon vos 50 réponses — se commande directement.
        </p>
        <p className="mt-8">
          <Link href="/#prix" className="font-semibold text-accent underline">
            Voir l&apos;offre (49.90 CHF, garantie 14 jours) →
          </Link>
        </p>
        <p className="mt-3 text-sm text-muted">Redirection automatique dans quelques secondes…</p>
      </div>
      <Footer />
    </main>
  );
}
