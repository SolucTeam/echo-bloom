import { createFileRoute, redirect } from "@tanstack/react-router";

/* L'ancienne page Événements vit désormais dans la page Actualités (onglet Événements). */
export const Route = createFileRoute("/evenements")({
  beforeLoad: () => {
    throw redirect({ to: "/actualites", search: { vue: "evenements" }, replace: true });
  },
});
