# Guide de branchement — du site déployé au tunnel qui encaisse

> Le site est EN LIGNE : https://lamsssaaa.github.io/business-sur-mesure/
> Personne ne le visite tant que les vidéos ne sont pas publiées. Mais AUCUNE vidéo
> ne se publie avant que la checklist finale de ce guide soit 100 % verte.
> Tant que les liens ne sont pas branchés, le bouton « 49.90 CHF » du mini-test
> bascule automatiquement sur un email de contact (garde pré-lancement intégrée).

## 1. Tally — le questionnaire 50 questions (post-achat)

1. Crée un compte gratuit sur tally.so (avec l'email de contact du service).
2. « Create form » → recopie les 50 questions depuis `contenu/intake-50-questions.md`,
   section par section (A à G), avec l'en-tête d'introduction du fichier.
   Types de champs : texte long pour les questions ouvertes, choix multiple pour les
   questions à options (A/B/C/D...). Question email OBLIGATOIRE en premier
   (« Quel email as-tu utilisé pour payer ? » — c'est la clé de croisement avec Stripe).
3. Settings → notifications email : activer « Email me on new submission ».
4. Publie le formulaire → copie l'URL (format https://tally.so/r/XXXXXX).

## 2. Tally — le mini-formulaire « profil par email » (optionnel mais recommandé)

1. Nouveau formulaire, 1 champ email + 1 champ caché nommé EXACTEMENT `profil`
   (Tally : ajouter un « Hidden field » — il se remplit tout seul via
   l'URL `?profil=...` que le site envoie depuis l'écran de résultat du mini-test).
2. Publie → copie l'URL.

## 3. Stripe — le lien de paiement 49.90 CHF

1. Sur dashboard.stripe.com : Produits → « Ajouter un produit » :
   nom « Ton Business Sur Mesure — rapport personnalisé », prix unique 49.90 CHF.
2. « Créer un lien de paiement » (Payment Link) avec ce produit.
3. Dans les options du lien → « Page de confirmation » → rediriger vers une URL :
   `https://lamsssaaa.github.io/business-sur-mesure/merci/`
   (c'est CETTE redirection qui envoie le client vers les 50 questions après paiement).
4. Copie l'URL du lien (format https://buy.stripe.com/XXXXXX).

## 4. Brancher les 3 URLs dans le site

1. Ouvre `site/lib/config.ts` et remplace les 3 valeurs A_REMPLACER :
   - `questionnaire` → URL du formulaire 50 questions (étape 1)
   - `paiement` → URL du Payment Link Stripe (étape 3)
   - `profilParEmail` → URL du mini-formulaire (étape 2)
2. Commit + push → le déploiement se relance tout seul :
   `cd ~/business-sur-mesure && git add site/lib/config.ts && git commit -m "feat: branchement Tally + Stripe" && git push`

## 5. Checklist finale AVANT de publier la moindre vidéo

- [ ] Mini-test complet sur le site en ligne → profil affiché → le bouton 49.90 CHF
      ouvre bien Stripe (plus le mailto de secours)
- [ ] Paiement TEST réel de bout en bout (Stripe en mode test, carte 4242 4242 4242 4242) →
      redirection vers /merci/ → le bouton « Répondre aux 50 questions » ouvre le bon Tally
- [ ] Soumission test du questionnaire 50 questions → notification email reçue
- [ ] Stripe repassé en mode LIVE, lien de paiement re-testé (montant affiché : 49.90 CHF)
- [ ] Remboursement test effectué dans Stripe (savoir le faire AVANT le premier vrai client)
- [ ] `grep -rn "A_REMPLACER" site/lib/config.ts` → zéro résultat
- [ ] Les 3 rapports OFFERTS sont livrés (proches/early users) et au moins 1 témoignage
      avec autorisation est dans `TEMOIGNAGES` (site/lib/config.ts)
- [ ] Le rapport-exemple anonymisé existe (base du SCRIPT 2 de contenu/scripts-video.md)

## 6. Ensuite, le lancement

1. Tourner les 3 vidéos de `contenu/scripts-video.md` (CapCut, voix off + captures écran).
2. Lien en bio (TikTok/Instagram/YouTube) → https://lamsssaaa.github.io/business-sur-mesure/
3. Publier, noter les chiffres chaque semaine : vues → clics mini-test → emails → achats.
