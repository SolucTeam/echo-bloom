import { createFileRoute } from '@tanstack/react-router';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { PageHero } from '@/components/PageHero';
import { pageHead, useSetting } from '@/components/ManagedSite';
import { loadPage } from '@/lib/site.functions';
import { ProjectCards } from '@/components/ProjectCards';
import { readProjects } from '@/lib/projects';
import { visibleProjects } from '@/lib/project-schema';
export const Route=createFileRoute('/projets/')({
 loader:async()=>({cmsPage:await loadPage({data:'/projets'})}),
 head:({loaderData})=>pageHead(loaderData?.cmsPage??null,'Nos projets — Green Ivory','Découvrez tous les projets de Green Ivory : Journées Sans Plastique, Sentiers Verts et nos actions pour l’environnement en Côte d’Ivoire.','/projets'),
 component:Projects,
 errorComponent:RouteError,
 notFoundComponent:RouteNotFound,
});
function Projects(){
 const projects=visibleProjects(readProjects(useSetting('site.projects')));
 return <><PageHero eyebrow="Sur le terrain" title="Nos projets" intro="Des initiatives concrètes pour protéger l’environnement et accompagner la jeunesse en Côte d’Ivoire."/><section data-project-collection className="container-x py-12 lg:py-16">{projects.length?<ProjectCards projects={projects}/>:<p className="text-muted-foreground">Nos prochains projets seront présentés ici.</p>}</section></>;
}
