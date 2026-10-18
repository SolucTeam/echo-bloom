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
