import { createFileRoute } from "@tanstack/react-router";
import { ProjectLayout } from "@/components/ProjectLayout";
import sentiers from "@/assets/sentiers.jpg";

export const Route = createFileRoute("/projets/sentiers-verts")({
  head: () => ({
    meta: [
      { title: "Sentiers Verts — Green Ivory" },
      { name: "description", content: "Le programme Sentiers Verts Jobs forme et accompagne 50 jeunes éco-entrepreneurs pour la transition durable en Côte d’Ivoire." },
      { property: "og:title", content: "Sentiers Verts — Green Ivory" },
    ],
  }),
  component: () => (
    <ProjectLayout
      info={{
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
        ],
      }}
    />
  ),
});
