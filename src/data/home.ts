export const HOME_HERO_INTRO_FALLBACK = "Green Ivory est une ONG ivoirienne fondée en 2017. Nous formons les jeunes, dépolluons les plages et plaidons pour des politiques climatiques ambitieuses en Côte d’Ivoire.";

export type HomeStat = { value: string; label: string };

export const DEFAULT_HOME_STATS: HomeStat[] = [
  { value: "200 000+", label: "Personnes sensibilisées" },
  { value: "5 000+", label: "Arbres plantés" },
  { value: "9 ans", label: "d’engagement" },
];

/** Chiffres d'impact officiels — brochure Green Ivory 2026. */
export const DEFAULT_HOME_BIGSTATS: HomeStat[] = [
  { value: "200 000+", label: "Personnes sensibilisées à la pollution plastique et au changement climatique" },
  { value: "5", label: "Projets d’éco-entreprises accompagnés (assistance technique, incubation, financement)" },
  { value: "120+", label: "Jeunes formés aux emplois verts (économies verte et bleue)" },
  { value: "30+", label: "Emplois verts créés" },
  { value: "20+", label: "Tonnes de déchets plastiques collectés et recyclés" },
  { value: "5 000+", label: "Arbres plantés" },
];

/** Textes de la page d'accueil : clé → valeur d'origine (repli si non personnalisée en base). */
export const HOME_TEXT_FALLBACKS: Record<string, string> = {
  "home.hero.eyebrow": "La promotion de l’emploi vert",
  "home.hero.title": "",
  "home.hero.intro": HOME_HERO_INTRO_FALLBACK,
  "home.axis.eyebrow": "Notre intervention",
  "home.axis.title": "3 axes clés qui orientent nos actions",
  "home.axis.intro": "Chez Green Ivory, notre engagement repose sur trois piliers stratégiques qui guident chacune de nos actions sur le terrain et au plaidoyer.",
  "home.axis1.tag": "Axe 1",
  "home.axis1.title": "La pollution plastique",
  "home.axis1.text": "Un fléau qui impacte gravement nos écosystèmes, nos océans et notre santé. En Côte d’Ivoire, il engorge les villes et dégrade plages et cours d’eau. Nous menons des campagnes de sensibilisation, des nettoyages et déployons des solutions de collecte et de recyclage.",
  "home.axis2.tag": "Axe 2",
  "home.axis2.title": "La perte de la biodiversité",
  "home.axis2.text": "Déforestation, urbanisation et pollution menacent les écosystèmes. Nous agissons par le reboisement, la protection des forêts et la sensibilisation à la conservation.",
  "home.axis3.tag": "Axe 3",
  "home.axis3.title": "Changement climatique",
  "home.axis3.text": "Élévation des températures, érosion côtière, précipitations irrégulières. Nous portons la voix des jeunes aux COP et promouvons l’économie verte.",
  "home.climate.eyebrow": "Face à la crise climatique",
  "home.climate.title": "Green Ivory s’engage avec et pour la jeunesse.",
  "home.climate.text": "Montée des températures, érosion côtière, déforestation accélérée, raréfaction des ressources en eau. Ces impacts menacent notre environnement et nos communautés. Nous agissons sur trois fronts complémentaires.",
  "home.climate.p1.title": "Sensibilisation & éducation",
  "home.climate.p1.text": "Programmes Journées Sans Plastique et Sentiers Verts pour former jeunes et communautés.",
  "home.climate.p2.title": "Actions terrain",
  "home.climate.p2.text": "Nettoyages, recyclage et promotion de l’économie circulaire.",
  "home.climate.p3.title": "Plaidoyer",
  "home.climate.p3.text": "Portage de la voix des jeunes auprès des décideurs et instances COP.",
  "home.about.eyebrow": "Qui sommes-nous ?",
  "home.about.title": "Une équipe passionnée, un impact mesurable.",
  "home.about.text1": "Green Ivory est une ONG fondée en 2017, basée en Côte d’Ivoire. Nous œuvrons pour la protection de l’environnement à travers des actions contre la pollution plastique, le changement climatique et la perte de biodiversité — avec une attention particulière à l’éducation environnementale des jeunes et des enfants.",
  "home.about.text2": "L’ONG est dirigée par Khérann YAO, Président du Conseil d’Administration, nommé Jeune Ambassadeur de l’UNICEF pour l’Environnement en 2018.",
  "home.projects.eyebrow": "Nos projets",
  "home.projects.title": "Nos projets au cœur de l’actualité.",
  "home.partners.eyebrow": "Devenir partenaire",
  "home.partners.title": "Soutenez notre organisation, nos missions et nos actions.",
  "home.partners.text": "Entreprises, institutions, ONG, collectivités — rejoignez-nous pour développer des solutions durables face aux défis environnementaux.",
  "home.values.eyebrow": "Nos valeurs",
  "home.values.title": "Ce qui nous anime.",
  "home.values.intro": "Cinq valeurs portent chaque action de Green Ivory, sur le terrain comme dans le plaidoyer.",
  "home.value1.label": "Passion",
  "home.value1.text": "Une énergie qui se transmet : chaque membre agit avec enthousiasme et conviction.",
  "home.value2.label": "Agilité",
  "home.value2.text": "Des équipes réactives, adaptées aux réalités du terrain et aux urgences climatiques.",
  "home.value3.label": "Intégrité",
  "home.value3.text": "Transparence et exemplarité dans la gestion de nos ressources et de nos projets.",
  "home.value4.label": "Collaboration",
  "home.value4.text": "Agir avec les communautés, les partenaires et les institutions — ensemble, jamais seuls.",
  "home.value5.label": "Humanisme",
  "home.value5.text": "L’humain au centre : chaque action sert d’abord les communautés et le vivant.",
};

export type HomeTexts = Record<string, string>;

/** Réglages stockés en base (home.texts) : ne retient que les clés connues, non vides. */
export function readHomeTexts(raw: string | undefined): HomeTexts {
  try {
    const v = JSON.parse(raw || "{}");
    const out: HomeTexts = {};
    if (v && typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        if (k in HOME_TEXT_FALLBACKS && typeof val === "string" && val.trim()) out[k] = val;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** Réglages stockés en base (site.stats / home.bigstats) avec repli sur les valeurs d'origine. */
export function readHomeStats(raw: string | undefined, fallback: HomeStat[] = DEFAULT_HOME_STATS): HomeStat[] {
  try {
    const v = JSON.parse(raw || "null");
    return Array.isArray(v) && v.length ? v : fallback;
  } catch {
    return fallback;
  }
}

/** Images de la page d'accueil remplaçables depuis la console (clés de réglages site_content). */
export const HOME_IMAGES: { key: string; label: string }[] = [
  { key: "home.hero.image", label: "Grande image d’accueil" },
  { key: "home.axis1.image", label: "Axe 1 — pollution plastique" },
  { key: "home.axis2.image", label: "Axe 2 — biodiversité" },
  { key: "home.axis3.image", label: "Axe 3 — climat" },
  { key: "home.about.image1", label: "Qui sommes-nous — image gauche" },
  { key: "home.about.image2", label: "Qui sommes-nous — image droite" },
];
