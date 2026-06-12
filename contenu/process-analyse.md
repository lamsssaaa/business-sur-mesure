# PROCESS INTERNE — D'une commande à un rapport livré en 48 h

**Document opérateur (Farouk). Usage interne uniquement.**
Objectif : zéro rapport en retard, zéro rapport bâclé, zéro violation des règles absolues.

---

## Vue d'ensemble du délai

| Moment | Action | Temps de travail |
|---|---|---|
| H0 | Soumission Tally reçue | — |
| H0 → H2 | Étape 1 (réception) + Étape 2 (contrôle) | ~15 min |
| H2 → H24 | Étape 3 (analyse IA) | ~45-60 min |
| H24 → H40 | Étape 4 (relecture humaine) | ~30-45 min |
| H40 → H48 | Étape 5 (export PDF + envoi) | ~15 min |
| J+14 | Étape 6 (demande de témoignage) | ~5 min |

Le chrono des 48 h démarre à la **réception des réponses complètes et exploitables** (pas à la réception d'une soumission incomplète en attente de clarification).

---

## Étape 1 — Réception et vérification du paiement

1. Une nouvelle soumission arrive dans **Tally** (formulaire 50 questions). Notification par email.
2. Ouvre **Stripe** → Paiements → cherche l'**email exact** de la soumission.
3. Vérifie les trois points :
   - un paiement de **49.90 CHF** existe pour cet email ;
   - statut **« Réussi »** (pas « en attente », pas « contesté ») ;
   - le paiement date de **moins de 7 jours** (sinon, vérifier qu'il n'a pas déjà été consommé par un autre rapport).
4. **Si tout correspond** → marque la commande « Payée ✓ » dans le tableau de bord (Étape 6) et passe à l'Étape 2.
5. **Si aucun paiement ne correspond** (email différent, paiement absent, paiement échoué) :
   - **N'analyse RIEN.** Aucune ligne de travail tant que le paiement n'est pas confirmé.
   - Envoie l'email « Clarification paiement » (voir `contenu/emails.md`) : on demande poliment l'email utilisé au paiement ou une preuve de paiement, on explique que le rapport part dès que c'est réglé.
   - Statut tableau de bord : « En attente paiement ». Relance unique à J+3, clôture à J+7 sans réponse.

> Cas fréquent : le client paie avec un email et remplit Tally avec un autre. La clarification règle 90 % des cas en un échange.

---

## Étape 2 — Contrôle qualité des réponses (AVANT toute analyse)

Lis les 50 réponses en diagonale (5 minutes). Tu cherches deux choses : des réponses **inexploitables** et des **profils sensibles**.

### 2a. Réponses inexploitables

Déclencheurs :
- plus de 10 questions vides ou « je sais pas » ;
- réponses contradictoires majeures (ex. : budget « 0 CHF » mais veut ouvrir un local ; « 2 h/semaine » mais veut un commerce physique) ;
- réponses d'un mot partout (formulaire rempli en 4 minutes, aucun détail exploitable) ;
- texte incompréhensible ou copié-collé visiblement généré.

Action : **email de clarification AVANT d'analyser** (modèle dans `contenu/emails.md`). On précise les 3-5 questions exactes à compléter, on explique que c'est dans SON intérêt (le rapport est construit sur ses réponses), et que le délai de 48 h démarre à réception des compléments. Statut : « En attente clarification ».

**Ne jamais « deviner » à la place du client.** Un rapport construit sur du vide produit une recommandation générique — c'est exactement ce qu'on a promis de ne pas vendre.

### 2b. Profils sensibles — arbitrage humain obligatoire

| Signal détecté | Action |
|---|---|
| **Mineur** (âge déclaré < 18 ans ou indices clairs) | Remboursement intégral immédiat + email bienveillant. On ne vend pas d'orientation entrepreneuriale à un mineur. |
| **Surendettement évoqué** (dettes, poursuites, « je dois absolument rembourser ») | Continuer, MAIS : recommandation à budget quasi nul, AUCUNE dépense engageante dans le plan 30 j, et ajouter dans le rapport le disclaimer « orientation entrepreneuriale — pas un conseil financier ou juridique, aucun revenu garanti » + suggestion de consulter une structure de désendettement de son pays. Si la détresse domine les réponses → proposer le remboursement plutôt que forcer un rapport. |
| **Secteur réglementé exigeant un diplôme** (santé, finance, droit, psychothérapie…) | Deux options, dans cet ordre : (1) orienter la recommandation vers une **variante 100 % légale sans diplôme** du même univers (ex. : pas « nutritionniste » mais un service périphérique non réglementé dans son pays — à vérifier à l'Étape 3d) ; (2) si aucune variante honnête n'existe ou si le client veut EXPLICITEMENT le métier réglementé et rien d'autre → email transparent + **proposition de remboursement**. |

Règle de fond : **un remboursement coûte 49.90 CHF ; une recommandation illégale ou irresponsable coûte la réputation du service.** Dans le doute, rembourse.

---

## Étape 3 — Le prompt d'analyse (à coller dans Claude)

Préparation (5 min) :
1. Exporte les 50 réponses depuis Tally (question + réponse, dans l'ordre).
2. Ouvre `contenu/modele-rapport.md` et garde-le sous la main : il sera collé dans le prompt.
3. Ouvre une **nouvelle conversation Claude** (jamais réutiliser une conversation d'un autre client — confidentialité + pas de contamination entre profils).

Colle le prompt ci-dessous **intégralement**, en remplaçant les deux emplacements `[COLLER ICI ...]`.

    Tu es l'analyste du service « 53 Questions Sur Mesure ». Un client a payé 49.90 CHF
    pour recevoir UNE recommandation de business personnalisée, avec un plan d'action
    sur 30 jours. Ton travail sera relu et validé par un humain avant envoi.

    RÈGLES ABSOLUES (toute violation rend le travail inutilisable) :
    - JAMAIS de promesse de revenu, de chiffre de gains, ni de vocabulaire de gourou
      (« gagne X par mois », « revenu passif », « liberté financière », « devenir
      riche », « quitte ton job »). La promesse du service, c'est la clarté et un
      plan d'action — rien d'autre.
    - UN SEUL business recommandé au final. Jamais de « top 5 », jamais de liste
      d'idées laissée au choix du client.
    - Ton : tutoiement, direct, chaleureux, concret. Zéro jargon, zéro hype.
    - Français standard, compréhensible en Suisse, France, Belgique et Québec.
      Adapte le vocabulaire et les références au PAYS du client (déduis-le de ses
      réponses). Tous les montants liés au service sont en CHF ; les budgets et
      coûts du client sont exprimés dans SA monnaie.
    - Reste STRICTEMENT dans le budget de départ et les heures par semaine que le
      client a déclarés. Ne lui invente ni argent ni temps.
    - Le business recommandé doit être légal SANS diplôme dans le pays du client.
    - Si une information manque, dis-le explicitement plutôt que d'inventer.

    VOICI LES 50 RÉPONSES DU CLIENT :

    [COLLER ICI LES 50 RÉPONSES]

    TRAVAILLE DANS CET ORDRE, sans sauter d'étape, en affichant chaque étape :

    ÉTAPE A — SYNTHÈSE DU PROFIL (10 lignes maximum).
    Résume : situation actuelle, expérience et compétences réelles (prouvées par
    ses réponses, pas supposées), budget de départ déclaré, heures par semaine
    déclarées, pays, contraintes dures (famille, santé, mobilité…), appétences et
    rejets exprimés. Termine par une phrase : « Ce que cette personne cherche
    vraiment, c'est… ».

    ÉTAPE B — 4 PISTES DE BUSINESS CANDIDATES.
    Propose exactement 4 pistes adaptées à CE profil. Chaque piste = un business
    PRÉCIS (qui est le client final, qu'est-ce qu'on lui vend, comment on le
    trouve), pas une catégorie vague. « Service de X pour Y dans la région Z »
    = bon. « Le e-commerce » ou « le coaching » = interdit. 3-4 lignes par piste,
    avec le lien explicite vers ses réponses.

    ÉTAPE C — LE DUEL.
    Note chaque piste de 1 à 5 sur ces 5 critères, dans cet ordre :
    1. Match avec ses compétences et son expérience réelles ;
    2. Budget de départ inférieur ou égal au budget qu'il a déclaré ;
    3. Demande réelle et solvable du marché (des gens paient déjà pour ça) ;
    4. Légalité SANS diplôme dans le pays du client ;
    5. Vitesse vers le premier franc (ou euro/dollar) encaissé.
    Présente un tableau de scores (4 pistes × 5 critères + total sur 25).
    Justifie en une phrase chaque note inférieure ou égale à 2. Désigne la piste
    gagnante. En cas d'égalité, le critère 5 (vitesse vers le premier encaissement)
    départage. Si la gagnante a 1 ou 2 en légalité, elle est ÉLIMINÉE : prends la
    suivante.

    ÉTAPE D — VÉRIFICATION EN LIGNE DE LA PISTE GAGNANTE.
    Avant de rédiger quoi que ce soit, vérifie en ligne (recherche web) les 2-3
    points critiques de la piste gagnante :
    - la demande est réelle AUJOURD'HUI dans le pays/la région du client (offres
      existantes, gens qui paient, plateformes actives) ;
    - la réglementation du pays du client : autorisations, statut, seuils, et
      confirmation que c'est exerçable SANS diplôme ;
    - tout point dont tu n'es pas certain (prix pratiqués, fournisseurs, saison…).
    Cite tes sources (nom du site + ce que tu y as vérifié). Si la vérification
    CONTREDIT un point clé, retourne à l'Étape C et prends la piste suivante,
    puis re-vérifie.

    ÉTAPE E — RÉDACTION DU RAPPORT.
    Remplis le modèle de rapport ci-dessous SECTION PAR SECTION, dans l'ordre,
    sans en sauter ni en ajouter. Remplace TOUTES les variables {{...}}. Intègre
    4 à 6 citations exactes tirées de ses réponses (entre guillemets). Le plan
    30 jours doit tenir dans SES heures par semaine, et le total des dépenses du
    plan doit rester sous SON budget déclaré (affiche le total). La première
    action du plan doit être faisable demain matin en 1 heure.

    VOICI LE MODÈLE DE RAPPORT À REMPLIR :

    [COLLER ICI LE CONTENU DE contenu/modele-rapport.md]

Pendant que Claude travaille :
- Vérifie qu'il a bien fait les étapes **dans l'ordre** et qu'il a réellement effectué les recherches web de l'étape D (sources citées). S'il a sauté l'étape D : « Tu as sauté l'étape D. Fais les vérifications en ligne maintenant, avec sources, avant de continuer. »
- Si la piste gagnante te semble mauvaise malgré le tableau (tu connais le profil mieux que la machine), challenge : « Justifie pourquoi la piste X bat la piste Y sur le critère 3 » — et tranche toi-même. **C'est toi qui décides, pas le prompt.**

---

## Étape 4 — Relecture humaine : checklist qualité (10 points)

Relis le rapport EN ENTIER, comme si tu étais le client. Aucun envoi tant que les 10 cases ne sont pas cochées :

- [ ] **1. Aucune promesse de revenu** ni vocabulaire de gourou, nulle part (cherche aussi : « passif », « riche », « liberté », chiffres de gains).
- [ ] **2. Budget total du plan ≤ budget déclaré** par le client (additionne toi-même les dépenses du plan 30 j).
- [ ] **3. Plan 30 jours réaliste avec SES heures/semaine** (additionne les heures de la semaine la plus chargée et compare à sa réponse).
- [ ] **4. Légalité vérifiée pour SON pays** (les sources de l'étape D existent vraiment — ouvre au moins la source réglementaire).
- [ ] **5. 4 à 6 citations exactes de ses réponses**, entre guillemets, fidèles au texte original de Tally.
- [ ] **6. UN business précis**, pas une catégorie vague (test : peux-tu dire en une phrase QUI paie, POUR QUOI, et COMMENT on le trouve ?).
- [ ] **7. La première action de demain matin est faisable en 1 h**, sans achat préalable, sans compétence non possédée.
- [ ] **8. Orthographe et grammaire** irréprochables (relecture complète, pas seulement le correcteur).
- [ ] **9. Toutes les variables {{...}} remplacées** (recherche littérale de « {{ » dans le document : zéro résultat).
- [ ] **10. PDF lisible sur mobile** (ouvre le PDF sur ton téléphone : titres lisibles, tableaux non coupés, 12-18 pages).

Un point qui coince → retour dans la conversation Claude pour corriger LA section concernée (pas de régénération complète, tu perdrais les bonnes parties), puis re-vérifie le point. Deux allers-retours infructueux → tu corriges à la main.

---

## Étape 5 — Export PDF et envoi

1. Exporte en **PDF** (nom de fichier : `Rapport-TonBusinessSurMesure-{Prénom}.pdf`).
2. Re-contrôle final 60 secondes : page de garde au bon prénom, 12-18 pages, point 10 de la checklist refait sur le fichier final.
3. Envoie avec l'**email de livraison** (modèle dans `contenu/emails.md`) : PDF en pièce jointe, rappel de la garantie satisfait ou remboursé 14 jours, invitation à répondre s'il a une question sur SON rapport.
4. **Délai impératif : 48 h maximum après réception des réponses exploitables.** Si un imprévu rend les 48 h intenables : email proactif AVANT l'échéance, excuse simple + nouvelle échéance précise (max +24 h). Un retard annoncé se pardonne ; un silence, non.
5. Confidentialité : les réponses du client servent **uniquement** à produire son rapport. Pas de revente, pas de réutilisation dans d'autres contenus, suppression sur simple demande. La conversation Claude du client n'est jamais partagée.

---

## Étape 6 — Suivi et témoignage

1. Immédiatement après l'envoi, complète la ligne du **tableau de bord** :

| Date commande | Prénom | Email | Business recommandé | Statut | Date livraison | Retour client |
|---|---|---|---|---|---|---|
| | | | | Payée / En attente paiement / En attente clarification / En analyse / Livré / Remboursé | | |

2. **J+14 après livraison** : email de demande de témoignage (modèle dans `contenu/emails.md`). Une seule question : « Tu en es où, deux semaines après ? » + demande d'accord explicite avant toute publication (prénom + pays uniquement, jamais l'email).
3. Note le retour dans la colonne « Retour client », même négatif — c'est la matière première pour améliorer le prompt et le modèle de rapport.
4. Demande de remboursement sous 14 jours : rembourse sous 48 h, sans interrogatoire, et note la raison invoquée dans le tableau de bord.

---

## Rappels permanents

- **Jamais d'analyse sans paiement confirmé** (Étape 1) et **jamais d'envoi sans les 10 cases cochées** (Étape 4). Ce sont les deux verrous du process.
- L'IA produit, **l'humain décide**. Cette relecture humaine est un argument de vente assumé : elle doit être réelle à chaque rapport, sans exception.
- Dans le doute (légalité, profil sensible, qualité) : clarifie ou rembourse. Jamais « on envoie quand même ».
