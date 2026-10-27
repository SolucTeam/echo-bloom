import { createFileRoute, Link } from '@tanstack/react-router';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { PageHero } from '@/components/PageHero';
import { pageHead, useSetting } from '@/components/ManagedSite';
import { loadPage } from '@/lib/site.functions';
import { ProgramCards } from '@/components/ProgramCards';
import { Reveal } from '@/components/Reveal';
import { readPrograms } from '@/lib/programs';
import { visiblePrograms, localizedProgram } from '@/lib/program-schema';
import { useLang } from '@/components/Language';
import { Heart } from "lucide-react";
export const Route=createFileRoute('/programmes/')({
 loader:async()=>({cmsPage:await loadPage({data:'/programmes'})}),
 head:({loaderData})=>pageHead(loaderData?.cmsPage??null,'Nos programmes — Green Ivory','Découvrez tous les programmes de Green Ivory : Journées Sans Plastique, Sentiers Verts et nos actions pour l’environnement en Côte d’Ivoire.','/programmes',{title:'Our programs — Green Ivory',description:'Discover all the Green Ivory programs: Plastic-Free Days, Green Trails and our actions for the environment in Côte d’Ivoire.'}),
 component:Programs,
 errorComponent:RouteError,
 notFoundComponent:RouteNotFound,
});
function Programs(){
 const { t, lang } = useLang();
 const programs=visiblePrograms(readPrograms(useSetting('site.programs')||useSetting('site.projects'))).map(p=>localizedProgram(p,lang));
 return (
  <>
   <PageHero eyebrow={t('programs.eyebrow')} title={t('programs.title')} intro={t('programs.intro')} />
   <section data-program-collection className="container-x py-10 lg:py-14">
    {programs.length ? (
     <>
      <p className="mb-8 text-sm font-medium text-muted-foreground">
       {programs.length > 1 ? t('programs.countMany', { n: programs.length }) : t('programs.countOne')}
      </p>
      <ProgramCards programs={programs} />
     </>
    ) : (
     <p className="text-muted-foreground">{t('programs.empty')}</p>
    )}
   </section>
   {/* Passer à l'action */}
   <section className="container-x pb-16 lg:pb-24">
    <Reveal>
     <div className="bento flex flex-col gap-8 border-0 bg-accent p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
      <div>
       <h2 className="text-2xl lg:text-3xl font-bold">{t('programs.ctaTitle')}</h2>
       <p className="mt-2 max-w-xl text-muted-foreground">{t('programs.ctaIntro')}</p>
      </div>
      <div className="flex flex-wrap gap-3">
       <Link to="/faire-un-don" className="btn-primary"><Heart className="h-4 w-4" /> {t('nav.donate')}</Link>
       <Link to="/devenir-benevole" className="btn-ghost">{t('nav.volunteer')}</Link>
      </div>
     </div>
    </Reveal>
   </section>
  </>
 );
}
