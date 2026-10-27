import journees from '@/assets/journees.jpg';
import sentiers from '@/assets/sentiers.jpg';
import biodiversity from '@/assets/biodiversity.jpg';
import hero from '@/assets/hero.jpg';
import founder from '@/assets/founder.jpg';
import type { Program } from '@/lib/program-schema';

const PROGRAMMES_ORIGINE: Program[] = [
{slug:'journees-sans-plastique', visible:true,
        eyebrow: "Emploi vert",
        title: "Journées Sans Plastique",
        tagline: "Promouvoir la sensibilisation à l’environnement et les efforts de conservation pour un avenir durable.",
        org: "Green Ivory",
        launched: "2021",
        pilot: "2022",
        firstEdition: "2024",
        goal: "Sensibiliser 3 millions de personnes au défi de la pollution plastique.",
        goalDetail:
          "Réduire drastiquement la pollution plastique dans la ville de Grand-Bassam à travers un momentum autour des enjeux de la pollution plastique sur l’environnement, d’avril 2024 à mars 2027.",
        hero: journees,
        context:
          "La pollution plastique est l’un des défis environnementaux majeurs de la Côte d’Ivoire. Plages, lagunes, rivières et villes sont envahis par le plastique à usage unique. Ce programme propose une réponse intégrée : sensibilisation massive, collecte structurée, valorisation par le recyclage, et création d’emplois durables pour la jeunesse.",
        objectives: [
          "Sensibiliser les populations aux dangers du plastique à usage unique.",
          "Mettre en place un dispositif de collecte et de tri dans la ville de Grand-Bassam.",
          "Former et employer des jeunes éco-ambassadeurs et agents de collecte.",
          "Promouvoir des alternatives durables (gourdes, sacs réutilisables, contenants).",
          "Plaider auprès des autorités locales pour des politiques publiques ambitieuses.",
        ],
        outcomes: [
          { value: "3M", label: "Personnes sensibilisées" },
          { value: "200T", label: "Plastique collecté et valorisé" },
          { value: "150+", label: "Emplois verts créés" },
        ],},
{slug:'sentiers-verts', visible:true,
        eyebrow: "Éco-entrepreneuriat",
        title: "Sentiers Verts",
        tagline: "Promouvoir l’employabilité des jeunes, la citoyenneté active et la transition vers des modèles économiques durables.",
        org: "Green Ivory",
        launched: "2023",
        pilot: "2021",
        firstEdition: "2023",
        goal: "Former 50 jeunes éco-entrepreneurs.",
        goalDetail:
          "Avec 50 bénéficiaires principaux et 200 secondaires, le programme vise à toucher un large public de jeunes, notamment grâce à une portée en ligne de +200 000 personnes et une communauté de 3 000 000 de U-reporters en Côte d’Ivoire.",
        hero: sentiers,
        context:
          "Sentiers Verts Jobs est un programme innovant et ambitieux qui mise sur la jeunesse comme moteur de la transition écologique. Le programme combine formation, mentorat, accompagnement à la création d’entreprise et mise en réseau, pour bâtir une nouvelle génération d’éco-entrepreneurs ivoiriens capables d’imaginer et de déployer des solutions durables.",
        objectives: [
          "Former 50 jeunes aux métiers de l’économie verte et bleue.",
          "Accompagner la création et le développement d’éco-entreprises.",
          "Renforcer la citoyenneté active et l’engagement communautaire.",
          "Toucher 200 000 jeunes en ligne et mobiliser la communauté U-Report.",
          "Documenter les bonnes pratiques pour essaimage régional.",
        ],
        outcomes: [
          { value: "50", label: "Jeunes éco-entrepreneurs formés" },
          { value: "200k+", label: "Jeunes touchés en ligne" },
          { value: "3M", label: "U-reporters mobilisés" },
        ],}];
// Initiatives complémentaires décrites dans la brochure Green Ivory 2026.
const INITIATIVES_BROCHURE: Program[] = [
{slug:'we-plant', visible:true,
        eyebrow: "Reboisement",
        title: "We Plant",
        tagline: "Contribuer à la restauration des écosystèmes à travers le reboisement et la mobilisation citoyenne en faveur de la protection des espaces naturels.",
        org: "Green Ivory",
        launched: "", pilot: "", firstEdition: "",
        goal: "Reboiser et protéger les espaces naturels avec les communautés.",
        goalDetail:
          "We Plant mobilise les citoyens autour du reboisement et de la protection des espaces naturels : chaque arbre planté restaure un écosystème, ancre une conscience écologique et rapproche les communautés de leur environnement.",
        hero: biodiversity,
        context:
          "La déforestation et la dégradation des écosystèmes menacent la biodiversité, les sols et les moyens de subsistance des communautés ivoiriennes. We Plant répond à cette urgence par des campagnes de plantation d’espèces locales et par la mobilisation citoyenne pour la protection durable des espaces naturels — forêts urbaines, côtes et zones rurales.",
        objectives: [
          "Planter des arbres d’espèces locales dans les zones dégradées.",
          "Mobiliser les citoyens, les écoles et les entreprises autour du reboisement.",
          "Protéger les espaces naturels existants aux côtés des communautés.",
          "Suivre la survie des plants pour garantir un impact durable.",
        ],
        outcomes: [
          { value: "5 000+", label: "Arbres plantés" },
        ],},
{slug:'green-schools', visible:true,
        eyebrow: "Éducation environnementale",
        title: "Green Schools",
        tagline: "Éveiller les plus jeunes aux enjeux environnementaux et développer, dès l’école, les connaissances et les réflexes nécessaires à une citoyenneté écologique.",
        org: "Green Ivory",
        launched: "", pilot: "", firstEdition: "",
        goal: "Ancrer la citoyenneté écologique dès l’école.",
        goalDetail:
          "Green Schools forme la génération montante aux enjeux environnementaux : sessions de sensibilisation dans les établissements, clubs environnementaux et projets pédagogiques pour faire des élèves des ambassadeurs du changement.",
        hero: hero,
        context:
          "La protection de l’environnement se construit dès l’enfance. Green Schools intervient dans les écoles pour éveiller les plus jeunes à l’écologie : compréhension des enjeux climatiques, gestes du quotidien, gestion des déchets et amorçage d’une citoyenneté écologique durable, en lien avec les enseignants et les familles.",
        objectives: [
          "Éveiller les plus jeunes aux enjeux environnementaux dès l’école.",
          "Développer les connaissances et les réflexes d’une citoyenneté écologique.",
          "Accompagner les enseignants et les établissements dans une démarche durable.",
          "Créer des clubs environnementaux pérennes dans les écoles partenaires.",
        ],
        outcomes: [
          { value: "Écoles", label: "Partenaires d’une éducation environnementale durable" },
        ],},
{slug:'plaidoyer-environnemental', visible:true,
        eyebrow: "Influence & politiques publiques",
        title: "Plaidoyer environnemental",
        tagline: "Contribuer au dialogue et à la promotion de politiques publiques favorables à une gestion durable de l’environnement.",
        org: "Green Ivory",
        launched: "", pilot: "", firstEdition: "",
        goal: "Faire monter les priorités environnementales des jeunes dans le débat public.",
        goalDetail:
          "Green Ivory contribue au dialogue avec les décideurs et à la promotion de politiques publiques favorables à une gestion durable de l’environnement, en portant la voix des jeunes jusqu’aux instances nationales et internationales.",
        hero: founder,
        context:
          "Face à l’urgence environnementale, les politiques publiques sont un levier décisif. Green Ivory fédère la jeunesse ivoirienne pour porter des propositions concrètes auprès des autorités et des partenaires institutionnels, et participe aux grandes rendez-vous internationaux comme les COP pour faire résonner les priorités climatiques de la jeunesse africaine.",
        objectives: [
          "Contribuer au dialogue avec les décideurs publics et institutionnels.",
          "Promouvoir des politiques favorables à une gestion durable de l’environnement.",
          "Porter la voix des jeunes dans les instances internationales (COP).",
          "Fédérer les organisations de jeunesse autour de priorités climatiques communes.",
        ],
        outcomes: [
          { value: "COP", label: "La voix des jeunes portée auprès des décideurs" },
        ],}];

/** Catalogue complet : programmes détaillés d'origine + initiatives complémentaires de la brochure 2026. */
export const DEFAULT_PROGRAMS: Program[] = [...PROGRAMMES_ORIGINE, ...INITIATIVES_BROCHURE];
