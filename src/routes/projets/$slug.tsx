import { createFileRoute, notFound } from '@tanstack/react-router';
import { loadProject, loadPage } from '@/lib/site.functions';
import { pageHead } from '@/components/ManagedSite';
import { ProjectLayout } from '@/components/ProjectLayout';
export const Route=createFileRoute('/projets/$slug')({
 loader:async({params})=>{const project=await loadProject({data:params.slug});if(!project)throw notFound();return {project,cmsPage:await loadPage({data:'/projets/'+params.slug})};},
 head:({loaderData,params})=>pageHead(loaderData?.cmsPage??null,loaderData?loaderData.project.title+' — Green Ivory':'Projet indisponible — Green Ivory',loaderData?.project.tagline||'Découvrez les projets Green Ivory.','/projets/'+params.slug),
 component:()=>{const {project}=Route.useLoaderData();return <ProjectLayout info={project}/>;},
});
