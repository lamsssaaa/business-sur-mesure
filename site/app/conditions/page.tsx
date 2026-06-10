import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Conditions — Ton Business Sur Mesure" };

export default function Conditions() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold">Conditions du service</h1>
        <div className="mt-6 space-y-4 text-muted">
          <p>
            <strong className="text-ink">Le service.</strong> « Ton Business Sur Mesure » est un service
            d&apos;orientation entrepreneuriale : à partir de tes réponses à un questionnaire de 50 questions, tu
            reçois un rapport personnalisé (PDF, 12-18 pages) recommandant UN business adapté à ton profil, avec
            un plan d&apos;action sur 30 jours, un budget de démarrage et des conseils concrets.
          </p>
          <p>
            <strong className="text-ink">Prix et paiement.</strong> 49.90 CHF, paiement unique via Stripe. Pas
            d&apos;abonnement, pas de frais cachés.
          </p>
          <p>
            <strong className="text-ink">Délai de livraison.</strong> 48 h au plus tard après réception de tes
            réponses complètes au questionnaire.
          </p>
          <p>
            <strong className="text-ink">Garantie.</strong> Satisfait ou remboursé pendant 14 jours après la
            livraison du rapport : un email suffit, sans justification. Si tu ne remplis pas le questionnaire
            dans les 14 jours malgré nos rappels, tu es remboursé automatiquement.
          </p>
          <p>
            <strong className="text-ink">Ce que le service n&apos;est pas.</strong> Ce rapport est une orientation
            entrepreneuriale. Il ne constitue pas un conseil financier, juridique, fiscal ou en investissement.
            Aucun revenu n&apos;est garanti : les résultats dépendent de ton travail, de ton marché et de ton
            contexte. Vérifie les exigences légales de ton pays avant de te lancer.
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
