import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CTA_CLASSES } from "@/components/CtaButton";
import { LINKS, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Merci ! Dernière étape : tes 50 questions" };

export default function Merci() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Merci, ton paiement est bien reçu ✅</h1>
        <p className="mt-4 text-lg text-muted">
          Dernière étape : réponds aux 50 questions (20-30 minutes, au calme). Ton rapport personnalisé
          arrive par email <strong>sous 48 h</strong> après réception de tes réponses.
        </p>
        <a
          href={LINKS.questionnaire}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-8 ${CTA_CLASSES}`}
        >
          Répondre aux 50 questions
        </a>
        <p className="mt-6 text-sm text-muted">
          Un souci, une question ? Écris à <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          Garantie satisfait ou remboursé 14 jours.
        </p>
      </div>
      <Footer />
    </main>
  );
}
