import { createFileRoute, redirect } from '@tanstack/react-router';

/* Les programmes vivent désormais sous /programmes ; l'ancienne adresse listing redirige. */
export const Route = createFileRoute('/projets/')({
  beforeLoad: () => {
    throw redirect({ to: '/programmes', replace: true });
  },
});
