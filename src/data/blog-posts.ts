// Chemins publics stables : identiques en dev et en production, insensibles aux hash de build.
import type { Lang } from '../lib/i18n';
const plastic = "/images/plastic.jpg";
const biodiv = "/images/biodiversity.jpg";
const climate = "/images/climate.jpg";
const journees = "/images/journees.jpg";
const sentiers = "/images/sentiers.jpg";

export type BlogCategory =
  | "Pollution plastique"
  | "Biodiversité"
  | "Climat"
  | "Initiatives"
  | "Éducation";

export const CATEGORIES: BlogCategory[] = [
  "Pollution plastique",
  "Biodiversité",
  "Climat",
  "Initiatives",
  "Éducation",
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  dateLabel: string;
  author: string;
  category: BlogCategory;
  image: string;
  readingTime: string;
  /** Markdown-ish paragraphs (rendered as <p>) */
  content: string[];
  /** Version anglaise optionnelle (phase 2 bilingue) : repli français champ par champ. */
  titleEn?: string;
  excerptEn?: string;
  /** Paragraphes anglais (articles au format texte) ; les articles HTML passent par htmlEn. */
  contentEn?: string[];
  htmlEn?: string | null;
};

export const POSTS: BlogPost[] = [
  {
    slug: "la-pollution-plastique-en-cote-divoire",
    title: "La pollution plastique en Côte d'Ivoire : état des lieux",
    excerpt:
      "Chaque jour, des tonnes de déchets plastiques finissent dans nos rues, nos lagunes et l'océan. Comprendre l'ampleur du problème pour mieux agir.",
    date: "2024-11-03",
    dateLabel: "3 novembre 2024",
    author: "Green Ivory",
    category: "Pollution plastique",
    image: plastic,
    readingTime: "6 min",
    content: [
      "La Côte d'Ivoire produit chaque année près de 400 000 tonnes de déchets plastiques, dont moins de 5 % sont recyclés. Le reste s'accumule dans les décharges sauvages, les caniveaux et finit en grande partie dans la lagune Ébrié puis dans l'océan Atlantique.",
      "À Abidjan, les emballages à usage unique — sachets, bouteilles, gobelets — représentent la majorité des déchets visibles dans l'espace public. Ils obstruent les systèmes d'assainissement, aggravent les inondations en saison des pluies, et menacent directement la santé publique.",
      "Sur les littoraux de Grand-Bassam et de Port-Bouët, nos équipes de bénévoles ramassent en moyenne 1,2 tonne de plastique par opération de nettoyage. Ces collectes ne sont qu'un pansement : la vraie bataille se joue en amont, sur la production et la consommation.",
      "C'est précisément la mission des Journées sans Plastique : sensibiliser les commerces, les écoles et les administrations pour faire reculer le plastique à usage unique, communauté par communauté.",
    ],
  },
  {
    slug: "la-desertification-en-cote-divoire",
    title: "La désertification en Côte d'Ivoire : comprendre et restaurer",
    excerpt:
      "L'avancée du désert n'est pas réservée au Sahel. Comment la déforestation accélère la perte de fertilité des sols ivoiriens, et quelles solutions s'offrent à nous.",
    date: "2024-10-28",
    dateLabel: "28 octobre 2024",
    author: "Green Ivory",
    category: "Climat",
    image: climate,
    readingTime: "7 min",
    content: [
      "En soixante ans, la Côte d'Ivoire a perdu plus de 80 % de sa couverture forestière. Cette déforestation massive, liée à l'agriculture extensive et à l'exploitation du bois, expose les sols à l'érosion et à la baisse de fertilité — premier symptôme de la désertification.",
      "Le nord du pays est particulièrement vulnérable : raréfaction des pluies, baisse des nappes phréatiques, exode rural. Mais le centre et le sud ne sont pas épargnés, avec des microclimats qui s'assèchent et des cultures qui rendent moins.",
      "Les solutions existent : agroforesterie, reboisement d'essences locales, restauration de bassins versants, fixation des dunes. Notre projet Sentiers Verts contribue à reconstituer des corridors écologiques et à former les communautés à l'entretien des plantations.",
      "Restaurer un hectare de forêt prend des années — mais chaque arbre planté est une victoire sur l'avancée du désert.",
    ],
  },
  {
    slug: "proteger-la-biodiversite",
    title: "Protéger la biodiversité ivoirienne, un enjeu citoyen",
    excerpt:
      "Forêts classées, lagunes, mangroves : la biodiversité ivoirienne est exceptionnelle, mais fragile. Pourquoi sa préservation nous concerne tous.",
    date: "2024-10-12",
    dateLabel: "12 octobre 2024",
    author: "Green Ivory",
    category: "Biodiversité",
    image: biodiv,
    readingTime: "5 min",
    content: [
      "La Côte d'Ivoire abrite plus de 1 200 espèces animales et 16 000 espèces végétales recensées. Le parc national de Taï, classé au patrimoine mondial de l'UNESCO, est l'un des derniers refuges pour le chimpanzé d'Afrique de l'Ouest et l'hippopotame pygmée.",
      "Mais cette richesse est sous pression : braconnage, conversion agricole, urbanisation. Sur le littoral, les mangroves — véritables nurseries pour la faune marine — ont reculé de plus de 40 % en trente ans.",
      "Protéger la biodiversité, ce n'est pas seulement protéger des animaux. C'est sécuriser les services écosystémiques dont dépendent l'agriculture, la pêche, le tourisme, et la résilience climatique du pays.",
      "Chacun peut agir : refuser les produits issus du braconnage, soutenir les aires protégées, planter des espèces locales, signaler les atteintes à l'environnement. La citoyenneté écologique commence dans nos gestes quotidiens.",
    ],
  },
  {
    slug: "journees-sans-plastique-bilan",
    title: "Journées sans Plastique : le bilan de notre dernière édition",
    excerpt:
      "Plus de 300 bénévoles, 12 communes mobilisées et près de 4 tonnes de plastique collectées : retour sur une édition record.",
    date: "2024-09-22",
    dateLabel: "22 septembre 2024",
    author: "Green Ivory",
    category: "Initiatives",
    image: journees,
    readingTime: "4 min",
    content: [
      "La huitième édition des Journées sans Plastique s'est tenue dans douze communes du district d'Abidjan. Pendant trois jours, 312 bénévoles se sont relayés sur les plages, les marchés et les abords des écoles.",
      "Au total : 3,8 tonnes de plastique collectées, 47 commerces engagés à remplacer leurs emballages à usage unique, et plus de 2 000 élèves sensibilisés à travers des ateliers ludiques.",
      "Le succès de cette édition tient à un réseau de partenaires de plus en plus dense : municipalités, écoles, entreprises, associations locales. Sans cette mobilisation collective, rien ne serait possible.",
      "Rendez-vous l'année prochaine pour aller encore plus loin — et toujours plus de communes engagées dans la transition.",
    ],
  },
  {
    slug: "eduquer-a-lenvironnement-des-le-plus-jeune-age",
    title: "Éduquer à l'environnement dès le plus jeune âge",
    excerpt:
      "Pourquoi l'éducation environnementale à l'école primaire est l'investissement le plus rentable pour la planète, et comment Green Ivory s'y engage.",
    date: "2024-08-15",
    dateLabel: "15 août 2024",
    author: "Green Ivory",
    category: "Éducation",
    image: sentiers,
    readingTime: "5 min",
    content: [
      "Les comportements pro-environnementaux se construisent tôt. Les enfants exposés dès l'école primaire à des notions de tri, de consommation responsable et de respect du vivant deviennent des adultes plus engagés — et influencent leurs parents.",
      "Green Ivory intervient dans une trentaine d'écoles publiques chaque année. Au programme : ateliers ludiques sur le cycle des déchets, plantations participatives, visites de sites naturels et création de clubs verts gérés par les élèves.",
      "L'éducation à l'environnement n'est pas un supplément d'âme : c'est une compétence vitale du XXIe siècle. Elle outille les jeunes générations pour faire face aux défis climatiques qui les attendent.",
      "Soutenir nos programmes éducatifs, c'est investir dans la prochaine génération de citoyens engagés pour la planète.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Texte anglais s'il est renseigné, sinon texte français (repli champ par champ). */
function pickEn(fr: string, en?: string) { const v = en?.trim(); return v ? v : fr; }

/**
 * Vue localisée d'un article (phase 2 bilingue) : en anglais, le titre, le
 * résumé et le contenu EN renseignés remplacent leurs homologues français,
 * sinon repli français. Le temps de lecture et la date affichée suivent la
 * langue. Accepte les articles des loaders (avec `html`/`htmlEn`) comme les
 * articles d'origine statiques.
 */
export function localizedBlogPost(p: BlogPost & { html?: string | null; htmlEn?: string | null }, lang: Lang): BlogPost & { html?: string | null } {
  if (lang !== 'en') return p;
  // Article rendu en HTML : le contenu EN est la version HTML anglaise (sanitizée au chargement).
  if (typeof p.html === 'string') {
    const enHtml = p.htmlEn?.trim();
    const html = enHtml ? enHtml : p.html;
    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return {
      ...p, html,
      title: pickEn(p.title, p.titleEn), excerpt: pickEn(p.excerpt, p.excerptEn),
      readingTime: enHtml ? `${Math.max(1, Math.round(words / 200))} min` : p.readingTime,
      dateLabel: new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
  }
  // Article en paragraphes : le contenu EN est la version texte anglaise.
  const paragraphs = (p.contentEn ?? []).map((s) => s.trim()).filter(Boolean);
  const words = paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
  return {
    ...p,
    title: pickEn(p.title, p.titleEn), excerpt: pickEn(p.excerpt, p.excerptEn),
    content: paragraphs.length ? paragraphs : p.content,
    readingTime: paragraphs.length ? `${Math.max(1, Math.round(words / 200))} min` : p.readingTime,
    dateLabel: new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return POSTS.slice(0, limit);
  return POSTS.filter((p) => p.slug !== slug)
    .sort((a, b) => (a.category === current.category ? -1 : 1))
    .slice(0, limit);
}