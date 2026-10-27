import { createFileRoute, redirect } from '@tanstack/react-router';

/* Les programmes vivent désormais sous /programmes/<slug> ; l'ancienne adresse de détail redirige. */
export const Route = createFileRoute('/projets/$slug')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/programmes/$slug', params: { slug: params.slug }, replace: true });
  },
});
