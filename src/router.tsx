import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { RouteError, RouteNotFound } from './components/RouteFeedback';

// Après un redéploiement, un onglet déjà ouvert demande d'anciens fichiers JS (hash obsolète) -> 404.
// Vite émet 'vite:preloadError' : on recharge la page pour récupérer les nouveaux fichiers.
// Garde anti-boucle : 3 rechargements maximum par tranche de 30 secondes.
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", () => {
    const key = "gi:preloadReloads";
    const now = Date.now();
    const recent: number[] = JSON.parse(sessionStorage.getItem(key) ?? "[]").filter((t: number) => now - t < 30_000);
    if (recent.length >= 3) return;
    recent.push(now);
    sessionStorage.setItem(key, JSON.stringify(recent));
    window.location.reload();
  });
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    defaultErrorComponent: RouteError,
    defaultNotFoundComponent: RouteNotFound,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Crossfade entre les routes via la View Transitions API (styles dans styles.css).
    // Les navigateurs sans l'API ignorent l'option : navigation identique à avant.
    defaultViewTransition: true,
  });

  return router;
};
