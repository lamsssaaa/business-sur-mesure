// Mini-test « Quel entrepreneur es-tu ? » — transcription VERBATIM de contenu/mini-test-10-questions.md
// (source de vérité). Toute modification de texte se fait d'abord dans le fichier markdown, jamais ici.

export type Lettre = "A" | "B" | "C" | "D";

// Accroche d'intro (page 1 du mini-test).
export const INTRO = {
  titre: "10 questions. 2 minutes. Découvre ton profil entrepreneur.",
  texte:
    "Pas de bla-bla, pas de bonne ou mauvaise réponse. Réponds avec ton instinct — tu découvres ton profil à la fin, gratuitement.",
};

// Chaque lettre correspond toujours au même profil :
// A = Le Bâtisseur 🧱, B = Le Sprinteur ⚡, C = L'Artisan 🎯, D = Le Connecteur 🤝.
export const QUESTIONS: { titre: string; question: string; options: Record<Lettre, string> }[] = [
  {
    titre: "Le risque",
    question: "On te propose un projet avec 50 % de chances de marcher. Tu fais quoi ?",
    options: {
      A: "Je vérifie tout, je calcule, et je n'avance que si je comprends chaque détail.",
      B: "Je fonce. On verra bien — au pire, j'aurai appris vite.",
      C: "Je teste d'abord en tout petit, à mon rythme, sans rien risquer de gros.",
      D: "J'en parle autour de moi : si des gens que je respecte y croient, j'y vais.",
    },
  },
  {
    titre: "La vente",
    question: "Tu dois convaincre quelqu'un d'acheter ce que tu proposes. Ta réaction honnête :",
    options: {
      A: "Je prépare un argumentaire solide à l'avance. Improviser, très peu pour moi.",
      B: "J'adore ça. Convaincre, c'est un jeu — et je veux gagner.",
      C: "Je préfère que la qualité de mon travail parle à ma place.",
      D: "Facile : je discute, je crée du lien, et la vente vient naturellement.",
    },
  },
  {
    titre: "Le temps disponible",
    question: "Combien de temps tu peux vraiment consacrer à un projet chaque semaine ?",
    options: {
      A: "Des créneaux fixes et réguliers. Je veux un planning, pas du chaos.",
      B: "Beaucoup, d'un coup. Je peux faire des grosses sessions intenses quand je suis lancé.",
      C: "Quelques heures, mais des heures de qualité, concentrées, sans interruption.",
      D: "Du temps morcelé : entre deux rendez-vous, le soir, dès qu'une occasion se présente.",
    },
  },
  {
    titre: "L'argent de départ",
    question: "Tu as un petit budget pour démarrer. Tu le mets où ?",
    options: {
      A: "Dans les fondations : les outils, le cadre légal, ce qui rend le projet solide.",
      B: "Dans la visibilité : pubs, tests, tout ce qui ramène des clients VITE.",
      C: "Dans le matériel ou les compétences pour faire un travail impeccable.",
      D: "Dans les rencontres : événements, cafés, tout ce qui élargit mon réseau.",
    },
  },
  {
    titre: "Ce qui te motive",
    question: "Qu'est-ce qui te ferait te lever un lundi matin avec le sourire ?",
    options: {
      A: "Voir quelque chose que J'AI construit tourner tout seul, proprement.",
      B: "L'adrénaline d'un nouveau défi, d'un nouveau marché à conquérir.",
      C: "La fierté d'un travail bien fait que les gens reconnaissent.",
      D: "Les gens : aider, échanger, faire partie d'une communauté.",
    },
  },
  {
    titre: "Manuel ou digital",
    question: "Entre tes mains et ton clavier, ton cœur penche où ?",
    options: {
      A: "Le digital, mais le sérieux : systèmes, process, automatisation.",
      B: "Le digital rapide : contenu, plateformes, tout ce qui scale vite.",
      C: "Le manuel et le concret : fabriquer, réparer, transformer de mes mains.",
      D: "Peu importe le support — ce qui compte, c'est qu'il y ait de l'humain en face.",
    },
  },
  {
    titre: "Seul ou en équipe",
    question: "Ta façon préférée de bosser :",
    options: {
      A: "Seul aux commandes, avec des règles claires si je délègue un jour.",
      B: "Seul pour décider vite, mais je recrute dès que ça décolle.",
      C: "Seul, tranquille, maître de mon art du début à la fin.",
      D: "En équipe ou en duo — l'énergie des autres me porte.",
    },
  },
  {
    titre: "En ligne ou terrain",
    question: "Ton terrain de jeu naturel :",
    options: {
      A: "Derrière mon écran, à construire quelque chose de durable.",
      B: "En ligne, là où tout va vite et où le monde entier est accessible.",
      C: "Sur le terrain, dans un atelier, un local, un lieu physique bien à moi.",
      D: "Dehors, au contact : marchés, événements, rendez-vous clients.",
    },
  },
  {
    titre: "Vitesse ou patience",
    question: "Ton rapport au temps qui passe :",
    options: {
      A: "Je préfère mettre 2 ans à bâtir du solide que 2 mois à bâtir du fragile.",
      B: "Si ça ne bouge pas en quelques semaines, je m'ennuie et je change.",
      C: "La qualité prend le temps qu'elle prend. Point.",
      D: "Ça dépend des gens autour : un bon partenaire et tout s'accélère.",
    },
  },
  {
    titre: "Plan ou impro",
    question: "On te donne un plan d'action détaillé étape par étape. Ta réaction :",
    options: {
      A: "Parfait. Je le suis à la lettre et je coche chaque case.",
      B: "Je lis la première page, je comprends l'idée, et j'improvise le reste.",
      C: "Je le suis, mais je l'adapte à ma façon de faire, sans me presser.",
      D: "Je le montre à quelqu'un de confiance avant de me lancer.",
    },
  },
];

export const PROFILS: Record<
  Lettre,
  { nom: string; emoji: string; description: string; categories: string[]; rapportFeraitQuoi: string }
> = {
  A: {
    nom: "Le Bâtisseur",
    emoji: "🧱",
    description:
      "Tu construis. Pas pour épater la galerie — pour que ça tienne. Là où d'autres se lancent tête baissée, toi tu poses des fondations : tu vérifies, tu structures, tu veux comprendre avant d'agir. Ta force, c'est la fiabilité : quand tu livres quelque chose, ça marche, et ça continue de marcher. Tu es fait pour les projets qui se développent brique par brique, avec des systèmes et des process clairs. Ton risque n°1 ? La paralysie de la préparation : tu peux passer des mois à peaufiner les plans… sans jamais poser la première brique. Ton vrai défi n'est pas de mieux préparer — c'est de démarrer.",
    categories: [
      "Services en ligne structurés (administration, organisation, support aux entreprises)",
      "E-commerce de niche bien construit",
      "Création de systèmes et d'outils pour d'autres entrepreneurs",
      "Activités à abonnement ou récurrence",
    ],
    rapportFeraitQuoi:
      "Il transforme ta préparation en action : UN business précis adapté à ton profil de bâtisseur, et un plan sur 30 jours qui t'oblige à poser la première brique dès la semaine 1.",
  },
  B: {
    nom: "Le Sprinteur",
    emoji: "⚡",
    description:
      "Toi, tu avances. Pendant que les autres réfléchissent, tu as déjà testé trois trucs. Ta force, c'est la vitesse d'exécution et le goût du risque : tu apprends en faisant, tu encaisses les échecs sans drame, et tu repars. Tu es taillé pour les terrains qui bougent vite, où celui qui teste le premier prend l'avantage. Vendre ne te fait pas peur — au contraire, ça t'amuse. Ton risque n°1 ? La dispersion : à force de sprinter dans toutes les directions, tu peux abandonner un projet prometteur juste avant qu'il décolle, pour courir après le suivant. Ton vrai défi, ce n'est pas de démarrer — c'est de tenir une direction.",
    categories: [
      "Création de contenu et audiences en ligne",
      "Vente directe et négoce (achat-revente, offres flash)",
      "Services à lancement rapide testables en quelques semaines",
      "Tout marché émergent où la vitesse compte plus que la perfection",
    ],
    rapportFeraitQuoi:
      "Il canalise ton énergie sur UNE seule cible : LE business où ta vitesse est un avantage décisif, avec un plan 30 jours assez intense pour ne jamais t'ennuyer — et assez cadré pour t'empêcher de zapper.",
  },
  C: {
    nom: "L'Artisan",
    emoji: "🎯",
    description:
      "Pour toi, un travail mérite d'être bien fait — ou pas fait du tout. Ta force, c'est la maîtrise : tu creuses, tu perfectionnes, tu livres une qualité que les gens remarquent et dont ils parlent. Tu n'as pas besoin de crier pour vendre : ton travail est ta meilleure publicité. Tu préfères un projet à ta main, à ton rythme, où tu contrôles le résultat du début à la fin. Ton risque n°1 ? L'invisibilité : tu peux faire le meilleur travail de ta région… que personne ne connaît, parce que tu détestes te mettre en avant. Ton vrai défi n'est pas la qualité — c'est de la faire savoir.",
    categories: [
      "Artisanat, fabrication et produits faits main",
      "Services d'expertise et de précision (réparation, technique, savoir-faire pointu)",
      "Prestations haut de gamme à petit volume",
      "Transmission de savoir-faire (cours, accompagnement)",
    ],
    rapportFeraitQuoi:
      "Il identifie LE business où ton exigence devient ta marque, et te donne un plan 30 jours qui règle ton point faible à ta place : comment te rendre visible sans te trahir.",
  },
  D: {
    nom: "Le Connecteur",
    emoji: "🤝",
    description:
      "Ton super-pouvoir, ce sont les gens. Tu crées du lien naturellement, tu inspires confiance, et les opportunités viennent souvent à toi par les autres : un contact, une recommandation, une conversation au bon moment. Ta force, c'est ce réseau vivant que tu nourris sans même y penser — et cette capacité rare à vendre sans donner l'impression de vendre. Tu es fait pour les business où la relation EST le produit. Ton risque n°1 ? La dépendance aux autres : à attendre le bon partenaire, le bon avis, la bonne validation, tu peux repousser ton lancement indéfiniment. Ton vrai défi, c'est de décider seul, au moins une fois.",
    categories: [
      "Services de proximité et relation client directe",
      "Mise en relation, courtage, apport d'affaires",
      "Événementiel et animation de communautés",
      "Vente conseil et accompagnement de personnes",
    ],
    rapportFeraitQuoi:
      "Il choisit pour toi LE business où ton réseau devient ton moteur, avec un plan 30 jours qui te fait passer du « j'en parle autour de moi » au « c'est lancé » — sans attendre la permission de personne.",
  },
};

// Majorité de A/B/C/D → profil. Égalité : la réponse à la Q5 (index 4) tranche ;
// si l'égalité persiste, la réponse à la Q1 (index 0) tranche.
export function calculerProfil(reponses: Lettre[]): Lettre {
  const score: Record<Lettre, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const r of reponses) score[r]++;
  const max = Math.max(...Object.values(score));
  const exAequo = (Object.keys(score) as Lettre[]).filter((l) => score[l] === max);
  if (exAequo.length === 1) return exAequo[0];
  if (exAequo.includes(reponses[4])) return reponses[4];
  if (exAequo.includes(reponses[0])) return reponses[0];
  return exAequo[0];
}
