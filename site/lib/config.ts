export const LINKS = {
  // Formulaire Tally des 50 questions (envoyé après paiement) — voir contenu/guide-branchement.md
  questionnaire: "https://tally.so/r/NpOlEj",
  // Stripe Payment Link 49.90 CHF — voir contenu/guide-branchement.md
  paiement: "https://buy.stripe.com/A_REMPLACER",
  // Formulaire Tally de commande (email) — utilisé tant que Stripe n'est pas branché
  profilParEmail: "https://tally.so/r/Ek6jxA",
};

// Lien de commande effectif : Stripe dès qu'il est branché, sinon le formulaire
// Tally de commande (Farouk reçoit la demande par email et envoie le lien de paiement).
export const LIEN_COMMANDE = LINKS.paiement.includes("A_REMPLACER")
  ? `${LINKS.profilParEmail}?intent=commande`
  : LINKS.paiement;

// Mesure du tunnel (GoatCounter) — vide = totalement désactivé. Voir components/Analytics.tsx.
export const GOATCOUNTER_CODE = "";

// Adresse de contact affichée sur le site et dans les emails.
// v1 : adresse perso ; à remplacer par une adresse dédiée dès que le domaine est acheté.
export const CONTACT_EMAIL = "ahmed.salam@hotmail.ch";

// Lien de commande pour l'Audit de croissance 299 CHF
// Même logique que LIEN_COMMANDE : Stripe si branché, sinon formulaire Tally de commande.
export const LIEN_AUDIT = LINKS.profilParEmail.includes("A_REMPLACER")
  ? `${LINKS.profilParEmail}?intent=audit`
  : "https://buy.stripe.com/A_REMPLACER_AUDIT";

// Rempli après les 3 rapports offerts (prénom + autorisation obtenue). Tant que vide,
// la section témoignages n'apparaît pas — on n'invente JAMAIS de témoignage.
export const TEMOIGNAGES: { prenom: string; texte: string }[] = [];
