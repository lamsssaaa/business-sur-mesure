import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CTA_CLASSES } from "@/components/CtaButton";
import { LINKS, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Merci ! Dernière étape : vos 53 questions",
  description: "Paiement reçu — répondez aux 53 questions pour recevoir votre rapport personnalisé sous 48 h.",
  robots: { index: false, follow: false },
};

export default function Merci() {
  const questionnairePret = !LINKS.questionnaire.includes("A_REMPLACER");
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-32 text-center">
        <h1 className="text-3xl font-bold">Merci, votre paiement est bien reçu ✅</h1>
        <p className="mt-4 text-lg text-muted">
          Dernière étape : répondez aux 53 questions (20-30 minutes, au calme). Votre rapport personnalisé
          arrive par email <strong>sous 48 h</strong> après réception de vos réponses.
        </p>
        {questionnairePret ? (
          <a
            href={LINKS.questionnaire}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 ${CTA_CLASSES}`}
          >
            Répondre aux 53 questions
          </a>
        ) : (
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Mes 53 questions — 53 Questions Sur Mesure")}`}
            className={`mt-8 ${CTA_CLASSES}`}
          >
            Recevoir mes 53 questions par email
          </a>
        )}
        <p className="mt-6 text-sm text-muted">
          Un souci, une question ? Écrivez à <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
      <Footer />
    </main>
  );
}
