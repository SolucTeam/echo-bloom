export const HOME_HERO_INTRO_FALLBACK = "Green Ivory est une ONG ivoirienne fondée en 2017. Nous formons les jeunes, dépolluons les plages et plaidons pour des politiques climatiques ambitieuses en Côte d’Ivoire.";

export type HomeStat = { value: string; label: string };

export const DEFAULT_HOME_STATS: HomeStat[] = [
  { value: "15k+", label: "Jeunes sensibilisés" },
  { value: "2 500", label: "Arbres plantés" },
  { value: "7 ans", label: "d’engagement" },
];

/** Réglages stockés en base (site.stats) avec repli sur les valeurs d'origine. */
export function readHomeStats(raw: string | undefined): HomeStat[] {
  try {
    const v = JSON.parse(raw || "null");
    return Array.isArray(v) && v.length ? v : DEFAULT_HOME_STATS;
  } catch {
    return DEFAULT_HOME_STATS;
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
