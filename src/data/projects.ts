import journees from '@/assets/journees.jpg';
import sentiers from '@/assets/sentiers.jpg';
import type { Project } from '@/lib/project-schema';
export const DEFAULT_PROJECTS: Project[] = [
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
          "La pollution plastique est l’un des défis environnementaux majeurs de la Côte d’Ivoire. Plages, lagunes, rivières et villes sont envahis par le plastique à usage unique. Ce projet propose une réponse intégrée : sensibilisation massive, collecte structurée, valorisation par le recyclage, et création d’emplois durables pour la jeunesse.",
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
          "Sentiers Verts Jobs est un projet innovant et ambitieux qui mise sur la jeunesse comme moteur de la transition écologique. Le programme combine formation, mentorat, accompagnement à la création d’entreprise et mise en réseau, pour bâtir une nouvelle génération d’éco-entrepreneurs ivoiriens capables d’imaginer et de déployer des solutions durables.",
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
