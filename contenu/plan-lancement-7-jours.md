# Plan de lancement 7 jours — premier franc au plus vite

> Issu de la recherche vérifiée du 2026-06-10 (`recherches/2026-06-10-gtm-vitesse.md`).
> Budget : ~2 h/jour (Sevae garde son créneau). Verdict des 3 juges, convergent :
> **encaissement d'abord, réseau chaud ensuite, ComeUp en filet, TikTok pas cette semaine.**

## Ce qui a changé vs le plan initial

1. **ComeUp entre dans le plan** (ex-5euros.com) : demande PROUVÉE (un service business plan
   y a 94 avis / 128 ventes, packs jusqu'à ~450 CHF), vendeurs suisses acceptés, mise en ligne
   le jour même, et AUCUN concurrent frontal sur « je trouve TON business ». Commission 20 %
   (ou abonnement Plus 8.99 €/mois → 1 €/commande dès que ça vend). ⚠️ Règle stricte : tout
   se passe SUR ComeUp, aucune redirection vers le site — c'est un canal d'encaissement et
   d'avis, parallèle au site.
2. **TikTok est repoussé après la semaine 1** : verrou des 1 000 abonnés pour mettre un lien
   en bio + 2-4 semaines de calibration algorithmique = hors fenêtre « premier franc ».
   Les vidéos restent le moteur de fond, pas le déclencheur.
3. **Offre fondateur** : « 29.90 CHF les 10 premiers rapports, contre un retour détaillé »
   — rareté réelle (relecture humaine limitée), légale, sans promesse de revenu.
   (Décision Farouk : à valider avant mise en ligne.)
4. **Reddit = interdit en promo** (bans quasi certains, vérifié dans les règles) et il
   n'existe AUCUN subreddit entrepreneuriat FR actif. On n'y va pas.

## Les interdits de la semaine (légal + survie)

- ❌ Cold DM de masse (LCD suisse : jusqu'à 100 000 CHF ; France : opt-in B2C)
- ❌ Lien brut dans un groupe/communauté modérée (ban documenté)
- ❌ Toute formulation qui promet un revenu
- ❌ TikTok/Reddit cette semaine ; Fiverr (Briefs IA favorisent les anciens)
- ❌ Annoncer « je lance » deux fois au même réseau — on n'a qu'une cartouche

## La semaine, jour par jour

### J1 — RÉPARER L'ENCAISSEMENT (rien d'autre avant) ~3 h
Constat vérifié par les juges sur le site EN LIGNE : tant que Stripe/Tally ne sont pas
branchés, les boutons retombent en mailto → le premier franc est impossible.
1. Créer le Payment Link Stripe (49.90 — et 29.90 « fondateur » si validé) → `contenu/guide-branchement.md` §3
2. Créer le formulaire Tally 50 questions (§1) + mini-form email (§2)
3. Coller les 3 URLs dans `site/lib/config.ts` → push (les CTA réels remplacent les mailto)
4. **Test d'achat réel de bout en bout** (carte test 4242…) → checklist §5
5. Le soir : lister 40-60 contacts du réseau élargi (proches, ex-collègues, connaissances)

### J2 — RÉSEAU CHAUD + FILET ComeUp ~2 h
- 20-30 messages INDIVIDUELS (modèles dans `assets-lancement.md`, à personnaliser une
  phrase par personne). Question relais clé : « tu connais quelqu'un qui veut se lancer
  sans savoir dans quoi ? »
- Créer le service ComeUp (texte prêt dans `assets-lancement.md`) — modéré en quelques
  heures, en ligne le soir même
- Demander l'adhésion à 3-4 groupes Facebook (reconversion, entraide auto/micro-entrepreneurs,
  Entrepreneurs Québec, indépendants Suisse romande)

### J3 — VISIBILITÉ ÉCRITE ~2 h
- Post LinkedIn n°1 (texte prêt) — lien du mini-test EN COMMENTAIRE, jamais dans le post
- Présentation sur le Forum Pragmatic Entrepreneurs (promo tolérée, vérifié actif) +
  Discord Entrepreneurs francophones (canal présentation)
- Relances douces J+2 du réseau chaud, closing des conversations ouvertes

### J4-J5 — LA ROUTINE QUI VEND ~1.5-2 h/jour
- Chercher (LinkedIn, X, groupes FB acceptés) les posts « je veux me lancer mais je ne
  sais pas dans quoi » → réponse utile EN PUBLIC sans lien → MP seulement à ceux qui
  répondent, mini-test comme accroche
- J5 : envoyer les 5 mails partenariats (newsletter Pose ta Dem' en n°1) — semis 30-90 j
- Livrer chaque rapport vendu en < 48 h (le délai EST l'argument)

### J6 — PREUVE SOCIALE ~1.5 h
- Post LinkedIn n°2 : premier témoignage fondateur si vente, sinon extrait anonymisé du rapport
- 10 DM à des coachs en reconversion (pack marque blanche / codes à prix coach) — pari 14-30 j

### J7 — COMPTER, PAS ESPÉRER ~1 h
Bilan chiffré : conversations réelles ouvertes / mini-tests complétés / ventes.
Repère vérifié : ~30-50 vraies conversations ≈ 1 vente (2-3 %).
- < 15 conversations → problème de VOLUME : semaine 2 = 100 % réseau chaud + warm DM
- > 30 conversations, 0 vente → problème de PITCH : changer le message, pas le canal
- 1 canal a produit des réponses → doubler dessus, couper le reste

## Et les 3 rapports offerts ?
Ils restent obligatoires AVANT toute vidéo (témoignages + rapport-exemple), mais ils se
font EN PARALLÈLE des ventes fondateur — pas avant. Une vente fondateur à 29.90 avec
retour détaillé vaut un rapport offert.
