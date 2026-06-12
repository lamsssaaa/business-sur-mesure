import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Conditions — Ton Business Sur Mesure",
  description: "Prix unique 49.90 CHF, livraison en 48 h. Les conditions complètes du service, en clair.",
};

export default function Conditions() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-32">
        <h1 className="text-3xl font-bold">Conditions du service</h1>
        <div className="mt-6 space-y-4 text-muted">
          <p>
            <strong className="text-ink">Le service.</strong> « Ton Business Sur Mesure » est un service
            d&apos;orientation entrepreneuriale : à partir de vos réponses à un questionnaire de 50 questions, vous
            recevez un rapport personnalisé (PDF, 12-18 pages) recommandant UN business adapté à votre profil, avec
            un plan d&apos;action sur 30 jours, un budget de démarrage et des conseils concrets.
          </p>
          <p>
            <strong className="text-ink">Prix et paiement.</strong> 49.90 CHF, paiement unique via Stripe. Pas
            d&apos;abonnement, pas de frais cachés.
          </p>
          <p>
            <strong className="text-ink">Délai de livraison.</strong> 48 h au plus tard après réception de vos
            réponses complètes au questionnaire.
          </p>
          <p>
            <strong className="text-ink">Ce que le service n&apos;est pas.</strong> Ce rapport est une orientation
            entrepreneuriale. Il ne constitue pas un conseil financier, juridique, fiscal ou en investissement.
            Aucun revenu n&apos;est garanti : les résultats dépendent de votre travail, de votre marché et de votre
            contexte. Vérifiez les exigences légales de votre pays avant de vous lancer.
          </p>
          <p>
            <strong className="text-ink">Droit applicable.</strong> Droit suisse. Service exploité depuis Genève,
            Suisse. Contact : <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
