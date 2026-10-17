import { pageHead } from '@/components/ManagedSite';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute } from "@tanstack/react-router";
import { ProjectLayout } from '@/components/ProjectLayout';
import { loadProject } from '@/lib/site.functions';
import { notFound } from '@tanstack/react-router';
export const Route=createFileRoute('/projets/sentiers-verts')({
 loader:async()=>{const project=await loadProject({data:"sentiers-verts"});if(!project)throw notFound();return {project,cmsPage:await loadPage({data:'/projets/sentiers-verts'})};},
 head:({loaderData})=>pageHead(loaderData?.cmsPage??null,loaderData?loaderData.project.title+' — Green Ivory':'Projet indisponible — Green Ivory',loaderData?.project.tagline||'Découvrez les projets Green Ivory.','/projets/sentiers-verts'),
 component:()=>{const {project}=Route.useLoaderData();return <ProjectLayout info={project}/>;},
});
