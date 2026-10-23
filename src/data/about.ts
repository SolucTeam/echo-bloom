/** Textes de la page « À propos » : clé → valeur d'origine (repli si non personnalisée en base). */
export const ABOUT_TEXT_FALLBACKS: Record<string, string> = {
  "about.hero.eyebrow": "Tout savoir de nous",
  "about.hero.title": "Nous sommes engagés contre la pollution plastique.",
  "about.hero.intro": "Plus de 9 ans d’action environnementale en Côte d’Ivoire, au service des jeunes, des communautés et de la planète.",
  "about.plastic.title": "Protéger l’environnement et réduire la pollution plastique",
  "about.plastic.text1": "Nous œuvrons pour diminuer l’impact des déchets plastiques et promouvoir des modes de vie respectueux de la planète. En Côte d’Ivoire, nous menons des opérations de nettoyage, de tri et de recyclage.",
  "about.plastic.subtitle": "Sensibiliser et éduquer les communautés",
  "about.plastic.text2": "À travers des programmes scolaires, ateliers et événements publics, nous encourageons chaque citoyen, des plus jeunes aux plus âgés, à adopter des comportements écoresponsables.",
  "about.mission.title": "Notre mission",
  "about.mission.text": "Protéger l’environnement à travers des actions concrètes contre la pollution plastique, la perte de biodiversité et le changement climatique.",
  "about.vision.title": "Notre vision",
  "about.vision.text": "Une Côte d’Ivoire — et une Afrique — où la jeunesse est actrice d’une économie verte, juste et durable.",
  "about.values.title": "Nos valeurs",
  "about.values.text": "Engagement citoyen, transparence, inclusion des jeunes, respect du vivant, et collaboration.",
  "about.history.eyebrow": "Notre histoire",
  "about.history.title": "De la passion à l’action.",
  "about.history.text1": "Fondée en 2017 par un collectif de jeunes ivoiriens passionnés par l’environnement, Green Ivory est née d’un constat simple : la pollution plastique et la dégradation des écosystèmes menacent notre avenir commun. Depuis, nous avons formé des milliers de jeunes, organisé des centaines d’opérations de terrain et porté la voix de la jeunesse ivoirienne jusque dans les grandes conférences internationales (COP).",
  "about.history.text2": "L’ONG est dirigée par Khérann YAO, Jeune Ambassadeur de l’UNICEF pour l’Environnement (2018), entouré d’une équipe pluridisciplinaire et de bénévoles dévoués.",
  "about.board.eyebrow": "Gouvernance",
  "about.board.title": "Le Conseil d’administration",
  "about.board.intro": "Green Ivory s’appuie sur un Conseil d’administration et un Bureau exécutif composés de professionnels hautement qualifiés, aux expertises complémentaires. Ensemble, ils conjuguent vision stratégique, excellence opérationnelle et capacité d’innovation au service des communautés et de la planète.",
  "about.board.name1": "M. Kherann YAO",
  "about.board.role1": "Président du Conseil d’Administration — ASHOKA Fellow",
  "about.board.name2": "Dr. Jean-Phillipe AKPOUE",
  "about.board.role2": "Vice-Président, Administrateur en charge des Programmes",
  "about.board.name3": "M. Kalifa KONE",
  "about.board.role3": "Directeur Administratif et Financier",
  "about.board.name4": "Mme Angèle LUH",
  "about.board.role4": "Conseillère Spéciale — Ex-Représentante du Programme des Nations Unies pour l’Environnement (UNEP) en Afrique de l’Ouest",
  "about.board.name5": "M. Joel KOUADIO",
  "about.board.role5": "Administrateur en charge de la croissance",
  "about.board.name6": "Mlle Lynda EMIEME",
  "about.board.role6": "Secrétaire Générale",
};

export type AboutTexts = Record<string, string>;

/** Réglages stockés en base (about.texts) : ne retient que les clés connues, non vides. */
export function readAboutTexts(raw: string | undefined): AboutTexts {
  try {
    const v = JSON.parse(raw || "{}");
    const out: AboutTexts = {};
    if (v && typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        if (k in ABOUT_TEXT_FALLBACKS && typeof val === "string" && val.trim()) out[k] = val;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** Images de la page « À propos » remplaçables depuis la console (clés de réglages site_content). */
export const ABOUT_IMAGES: { key: string; label: string }[] = [
  { key: "about.plastic.image", label: "Section pollution plastique" },
  { key: "about.founder.image", label: "Portrait — Khérann YAO" },
  { key: "about.forest.image", label: "Forêt (bas de page)" },
];
