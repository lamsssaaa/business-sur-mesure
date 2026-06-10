import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Confidentialité — Ton Business Sur Mesure" };

export default function Confidentialite() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-32">
        <h1 className="text-3xl font-bold">Confidentialité</h1>
        <div className="mt-6 space-y-4 text-muted">
          <p>
            <strong className="text-ink">Ce qu&apos;on collecte.</strong> Ton adresse email et tes réponses aux
            questionnaires (mini-test et questionnaire de 50 questions). Rien d&apos;autre — pas de cookies
            publicitaires, pas de traqueurs.
          </p>
          <p>
            <strong className="text-ink">Pourquoi.</strong> Uniquement pour produire ton rapport personnalisé et
            te l&apos;envoyer. Tes réponses sont analysées avec l&apos;aide d&apos;une intelligence artificielle (Claude,
            d&apos;Anthropic), puis relues et validées par un humain.
          </p>
          <p>
            <strong className="text-ink">Ce qu&apos;on ne fait jamais.</strong> Vendre, louer ou partager tes données.
            Elles ne servent à rien d&apos;autre qu&apos;à ton rapport.
          </p>
          <p>
            <strong className="text-ink">Combien de temps.</strong> Tes réponses sont conservées le temps de
            produire et garantir ton rapport (90 jours), puis supprimées. Tu peux demander leur suppression à
            tout moment, avant comme après.
          </p>
          <p>
            <strong className="text-ink">Tes droits.</strong> Accès, rectification, suppression : un email à{" "}
            <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> suffit. Service basé à
            Genève, Suisse (LPD) ; les clients de l&apos;UE bénéficient des droits équivalents du RGPD.
          </p>
          <p>
            <strong className="text-ink">Prestataires techniques.</strong> Paiement : Stripe. Formulaires : Tally.
            Analyse : Anthropic (Claude). Chacun ne reçoit que le strict nécessaire à sa fonction.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
