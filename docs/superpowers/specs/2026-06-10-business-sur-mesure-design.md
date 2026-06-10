# Design — « Ton Business Sur Mesure »

**Date :** 2026-06-10 · **Statut :** validé par Farouk · **Dossier projet :** `~/business-sur-mesure`

## 1. Contexte & objectif

Farouk veut un nouveau projet : démarrage < 100 CHF, sans diplôme, construit avec Claude (Fable 5), objectif = **revenu rapide** (premiers francs en semaines). Cible : **francophonie entière**, vente en ligne à des particuliers, acquisition par **vidéos voix off** (visage non montré).

Critère de succès du lancement : **1er client payant**. KPI du tunnel : vues vidéo → clics mini-test → emails collectés → achats.

## 2. Promesse & positionnement

> « Réponds à 50 questions sur ton expérience, tes compétences, ton budget et ton temps — je te dis LE business à lancer, et comment, en 30 jours. »

- **Un seul business par client** — le bon, pas un « top 5 ». Le produit vendu = la clarté + un plan, pas une liste d'idées.
- **Interdit absolu : toute promesse de revenu** (« tu vas gagner X €/mois »). Référence : bannissement Air AI par la FTC, opération AI Comply. La crédibilité est le produit.
- Différenciation vs ChatGPT gratuit : intake structuré de 50 questions + process d'analyse vérifié (match profil, alternatives écartées et pourquoi, plan d'action) + un humain responsable du livrable.

## 3. Offre & prix

**Une seule offre au lancement : 49.90 CHF** — rapport personnalisé PDF de 12 à 18 pages, livré sous 48 h :

1. **LE business adapté** + le « pourquoi toi » (match explicite avec ses réponses : expérience, compétences, budget, temps disponible)
2. **Plan des 30 premiers jours**, semaine par semaine
3. **Budget réel de démarrage** + outils concrets
4. **Comment trouver les 3 premiers clients**
5. **Les pièges du secteur** choisi

Garantie **satisfait ou remboursé 14 jours** (levier de confiance, coût marginal faible).

Hors périmètre au lancement (viendra après les premiers clients) : paliers premium (appel 30 min, suivi 30 jours), espace membre, automatisation complète, pub payante.

## 4. Tunnel de vente

```
Vidéo (voix off + écran) → mini-test GRATUIT (10 questions)
  → page résultat « ton profil entrepreneur » + email collecté
  → offre du rapport complet à 49.90 CHF (Stripe Payment Link)
  → page merci → formulaire 50 questions (Tally)
  → analyse Farouk + Claude → rapport PDF par email sous 48 h
```

- La vidéo ne vend jamais l'achat en direct : elle amène au **mini-test gratuit** (l'aimant). Le mini-test vend le rapport.
- Cas d'erreur géré : paiement reçu mais formulaire 50 questions non rempli → email de relance à J+2 et J+5 ; remboursement si silence à J+14.

## 5. Stack technique (coût ≈ 0 CHF)

| Brique | Outil | Coût |
|---|---|---|
| Page de vente | Site statique Next.js → GitHub Pages (comme portfolio/Eclipse Gold) | 0 |
| Mini-test 10 Q + formulaire 50 Q | Tally (gratuit) | 0 |
| Paiement | Stripe Payment Link (commission par transaction uniquement) | 0 fixe |
| Livraison | PDF par email, manuel au début | 0 |
| Vidéos | CapCut + capture écran ; TikTok, YouTube Shorts, Reels | 0 |
| QA du tunnel | gstack (navigateur headless) — test de bout en bout avant mise en ligne | 0 |
| Domaine (optionnel, plus tard) | Infomaniak | ~15 CHF/an |

## 6. Production d'un rapport (process interne)

1. Réception des 50 réponses (Tally → email/export)
2. Session Claude : analyse du profil → duel de 3-4 pistes → choix du business + vérifications (demande réelle, budget, légalité du secteur)
3. Remplissage du **modèle de rapport** standard (structure en 5 parties, §3)
4. Relecture humaine par Farouk → export PDF → envoi par email
5. Temps cible : **1-2 h par client** au début ; J+0 → J+2 max

## 7. Première preuve (avant de vendre)

- **3 rapports offerts** (proches ou premiers abonnés) contre témoignage écrit/audio
- **1 rapport-exemple anonymisé** → devient le contenu des vidéos (on montre le livrable réel, pas des promesses)

## 8. Garde-fous légaux & éthiques

- Disclaimer visible : « orientation entrepreneuriale — pas un conseil financier, juridique ou fiscal ; aucun revenu garanti »
- Les 50 réponses = **données personnelles** (LPD/RGPD) : mention de confidentialité sur le formulaire, pas de revente, suppression sur demande, conservation limitée
- Droit de rétractation/remboursement 14 jours affiché

## 9. Composants à construire (périmètre v1)

1. **Les 10 questions** du mini-test + grille de « profils » pour la page résultat
2. **Les 50 questions** de l'intake (expérience, compétences, budget, temps, contraintes, goûts/dégoûts, réseau, langues, situation géo)
3. **Le modèle de rapport** (template 5 parties) + process d'analyse documenté
4. **La page de vente** one-page (héros, comment ça marche, extrait du rapport-exemple, témoignages, FAQ, garde-fous, CTA mini-test)
5. **3 scripts vidéo** voix off (formats courts) pointant vers le mini-test
6. **Tunnel branché** : Tally + Stripe + emails — testé de bout en bout (gstack)

## 10. Contrainte planning

Le sprint en cours reste **Sevae (jusqu'au 16/06)**. Ce projet se construit en sessions du soir ou prend la place du Sprint 2 (agence IA) — décision de Farouk au moment du plan du jour. Jamais les trois de front (règle : 1 projet principal/jour).
