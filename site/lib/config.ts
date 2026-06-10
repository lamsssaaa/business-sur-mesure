export const LINKS = {
  // Formulaire Tally des 50 questions (envoyé après paiement) — voir contenu/guide-branchement.md
  questionnaire: "https://tally.so/r/rjYNoX",
  // Stripe Payment Link 49.90 CHF — voir contenu/guide-branchement.md
  paiement: "https://buy.stripe.com/A_REMPLACER",
  // Formulaire Tally de capture email sur le résultat du mini-test (optionnel v1)
  profilParEmail: "https://tally.so/r/Ek6jxA",
};

// Mesure du tunnel (GoatCounter) — vide = totalement désactivé. Voir components/Analytics.tsx.
export const GOATCOUNTER_CODE = "";

// Adresse de contact affichée sur le site et dans les emails.
// v1 : adresse perso ; à remplacer par une adresse dédiée dès que le domaine est acheté.
export const CONTACT_EMAIL = "ahmed.salam@hotmail.ch";

// Rempli après les 3 rapports offerts (prénom + autorisation obtenue). Tant que vide,
// la section témoignages n'apparaît pas — on n'invente JAMAIS de témoignage.
export const TEMOIGNAGES: { prenom: string; texte: string }[] = [];
