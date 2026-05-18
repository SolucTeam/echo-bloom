import { createFileRoute } from "@tanstack/react-router";
import { ProjectLayout } from "@/components/ProjectLayout";
import journees from "@/assets/journees.jpg";

export const Route = createFileRoute("/projets/journees-sans-plastique")({
  head: () => ({
    meta: [
      { title: "Journées Sans Plastique — Green Ivory" },
      { name: "description", content: "Le projet phare de Green Ivory pour réduire la pollution plastique en Côte d’Ivoire : sensibilisation, collecte, recyclage et emplois verts." },
      { property: "og:title", content: "Journées Sans Plastique — Green Ivory" },
      { property: "og:description", content: "Sensibilisation, collecte et recyclage pour faire reculer le plastique à usage unique." },
      { property: "og:url", content: "https://greenivory-reborn.lovable.app/projets/journees-sans-plastique" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://greenivory-reborn.lovable.app/projets/journees-sans-plastique" }],
  }),
  component: () => (
    <ProjectLayout
      info={{
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
        ],
      }}
    />
  ),
});
