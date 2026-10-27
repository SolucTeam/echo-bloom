import { createFileRoute, notFound } from '@tanstack/react-router';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadProgram, loadPage } from '@/lib/site.functions';
import { pageHead, useSetting } from '@/components/ManagedSite';
import { ProgramLayout } from '@/components/ProgramLayout';
import { readPrograms } from '@/lib/programs';
import { visiblePrograms, localizedProgram } from '@/lib/program-schema';
import { useLang } from '@/components/Language';
export const Route=createFileRoute('/programmes/$slug')({
 loader:async({params})=>{const program=await loadProgram({data:params.slug});if(!program)throw notFound();return {program,cmsPage:await loadPage({data:'/programmes/'+params.slug})};},
 head:({loaderData,params})=>{
  const program=loaderData?.program;
  const head=pageHead(loaderData?.cmsPage??null,program?program.title+' — Green Ivory':'Programme indisponible — Green Ivory',program?.tagline||'Découvrez les programmes Green Ivory.','/programmes/'+params.slug,program?{title:program.titleEn?.trim()?program.titleEn+' — Green Ivory':undefined,description:program.taglineEn?.trim()||undefined}:undefined);
  const image=loaderData?.program.hero;
  return {...head,meta:[...head.meta.filter(m=>!('property' in m && m.property==='og:image')&&!('name' in m && m.name==='twitter:image')),...(image?.startsWith('https://')?[{property:'og:image',content:image},{name:'twitter:image',content:image}]:[]),...(!loaderData?[{name:'robots',content:'noindex,follow'}]:[])]};
 },
 component:ProgramDetail,
  errorComponent:RouteError,
  notFoundComponent:RouteNotFound,
});

/** Détail d'un programme + suggestions des autres programmes visibles. */
function ProgramDetail(){
  const {program}=Route.useLoaderData();
  const {lang}=useLang();
  const info=localizedProgram(program,lang);
  const others=visiblePrograms(readPrograms(useSetting('site.programs')||useSetting('site.projects'))).filter(p=>p.slug!==program.slug).slice(0,3).map(p=>localizedProgram(p,lang));
  return <ProgramLayout info={info} others={others}/>;
}
