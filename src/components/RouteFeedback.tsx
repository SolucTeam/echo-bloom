import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { AnimatedLeaf } from '@/components/AnimatedLeaf';

export function RouteNotFound() {
  return <div className="container-x py-20 text-center space-y-4">
    <AnimatedLeaf className="mx-auto w-72 max-w-full h-auto text-primary/80 select-none" />
    <h1 className="text-3xl font-bold">Page introuvable</h1>
    <p className="text-muted-foreground">La page que vous cherchez n’a pas poussé ici — elle a peut-être été déplacée ou renommée.</p>
    <Button asChild><Link to="/">Retour à l’accueil</Link></Button>
  </div>;
}

export function RouteError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return <div className="container-x py-24 text-center space-y-4">
    <h1 className="text-2xl font-bold">Cette page n’a pas pu se charger</h1>
    <p className="text-muted-foreground">Une erreur est survenue. Réessayez ou revenez à l’accueil.</p>
    <div className="flex flex-wrap justify-center gap-3">
      <Button onClick={async () => { await router.invalidate(); reset(); }}>Réessayer</Button>
      <Button variant="outline" asChild><Link to="/">Accueil</Link></Button>
    </div>
  </div>;
}