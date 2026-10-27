import { createFileRoute, redirect } from "@tanstack/react-router";

/* L'ancienne page Galerie vit désormais dans la page Actualités (onglet Photos). */
export const Route = createFileRoute("/galerie")({
  beforeLoad: () => {
    throw redirect({ to: "/actualites", search: { vue: "galerie" }, replace: true });
  },
});
