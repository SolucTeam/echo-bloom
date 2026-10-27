import { createFileRoute, redirect } from "@tanstack/react-router";

/* L'ancienne page Blog vit désormais dans la page Actualités (onglet Articles). */
export const Route = createFileRoute("/blog")({
  beforeLoad: () => {
    throw redirect({ to: "/actualites", search: { vue: "articles" }, replace: true });
  },
});
