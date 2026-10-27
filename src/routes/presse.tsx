import { createFileRoute, redirect } from "@tanstack/react-router";

/* L'ancienne page Espace presse vit désormais dans la page Actualités (onglet Presse). */
export const Route = createFileRoute("/presse")({
  beforeLoad: () => {
    throw redirect({ to: "/actualites", search: { vue: "presse" }, replace: true });
  },
});
