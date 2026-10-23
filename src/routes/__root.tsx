import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { SiteContext, ManagedContent } from '@/components/ManagedSite';
import { loadSite } from '@/lib/site.functions';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RouteError } from '@/components/RouteFeedback';
import { ErrorScene, NotFoundScene, MaintenancePage } from '@/components/StatusPages';

function NotFoundComponent() {
  return (
    <div className="grid min-h-svh place-items-center bg-background px-4 py-16">
      <NotFoundScene />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="grid min-h-svh place-items-center bg-background px-4 py-16">
      <ErrorScene onRetry={() => { router.invalidate(); reset(); }} />
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => loadSite(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Green Ivory — Le pouvoir citoyen pour l’environnement" },
      { name: "description", content: "ONG ivoirienne engagée contre la pollution plastique, pour la biodiversité et le climat. Découvrez nos projets et soutenez l’action." },
      { name: "author", content: "Green Ivory" },
      { property: "og:title", content: "Green Ivory — Le pouvoir citoyen pour l’environnement" },
      { property: "og:description", content: "ONG ivoirienne engagée contre la pollution plastique, pour la biodiversité et le climat. Découvrez nos projets et soutenez l’action." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Green Ivory — Le pouvoir citoyen pour l’environnement" },
      { name: "twitter:description", content: "ONG ivoirienne engagée contre la pollution plastique, pour la biodiversité et le climat. Découvrez nos projets et soutenez l’action." },
      { property: "og:site_name", content: "Green Ivory" },
      { property: "og:locale", content: "fr_FR" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Figtree:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
   errorComponent: RouteError,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const site=Route.useLoaderData();
  const router=useRouter();
  // Maintenance : réglage éditable dans la console (site.maintenance).
  // La console (/admin) et la page de connexion restent accessibles,
  // tout comme le site pour une session connectée (prévisualisation).
  const [authed,setAuthed]=useState(false);
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setAuthed(Boolean(data.user)));
    const {data}=supabase.auth.onAuthStateChange(event=>{
      if(event==='SIGNED_IN')setAuthed(true);
      if(event==='SIGNED_OUT'){setAuthed(false);router.invalidate();queryClient.invalidateQueries();}
      else if(['USER_UPDATED'].includes(event)){router.invalidate();queryClient.invalidateQueries();}
    });
    return ()=>data.subscription.unsubscribe();
  },[router,queryClient]);
  const maintenance=site.settings['site.maintenance']==='true';
  const path=router.state.location.pathname;
  const showMaintenance=maintenance&&!authed&&!path.startsWith('/admin')&&!path.startsWith('/auth');
  return (
    <QueryClientProvider client={queryClient}>
      <SiteContext.Provider value={site}>
      {showMaintenance?<MaintenancePage/>:<>
      <SiteHeader />
      <main className="min-h-[60vh]">
        <ManagedContent><Outlet /></ManagedContent>
      </main>
      <SiteFooter />
      </>}
      </SiteContext.Provider>
    </QueryClientProvider>
  );
}
