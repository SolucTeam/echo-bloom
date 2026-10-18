export const HOME_HERO_INTRO_FALLBACK = "Green Ivory est une ONG ivoirienne fondée en 2017. Nous formons les jeunes, dépolluons les plages et plaidons pour des politiques climatiques ambitieuses en Côte d’Ivoire.";

export type HomeStat = { value: string; label: string };

export const DEFAULT_HOME_STATS: HomeStat[] = [
  { value: "15k+", label: "Jeunes sensibilisés" },
  { value: "2 500", label: "Arbres plantés" },
  { value: "7 ans", label: "d’engagement" },
];

export const DEFAULT_HOME_BIGSTATS: HomeStat[] = [
  { value: "15 000+", label: "Jeunes et adolescents sensibilisés" },
  { value: "800+", label: "Jeunes formés à l’économie verte et bleue" },
  { value: "2 500+", label: "Arbres plantés" },
  { value: "45+", label: "Éco-entreprises accompagnées" },
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
