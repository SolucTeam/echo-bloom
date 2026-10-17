import { createFileRoute, notFound } from '@tanstack/react-router';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { pageHead } from '@/components/ManagedSite';

export const Route=createFileRoute('/$')({
  loader:async({params})=>{const page=await loadPage({data:'/'+(params._splat||'')});if(!page)throw notFound();return page;},
  head:({loaderData,params})=>pageHead(loaderData??null,'Page indisponible — Green Ivory','Cette page Green Ivory n’est pas disponible.','/'+(params._splat||'')),
  component:()=>null,
  errorComponent:RouteError,
  notFoundComponent:RouteNotFound,
});