import { pageHead } from '@/components/ManagedSite';
import { useSetting } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { ABOUT_TEXT_FALLBACKS, readAboutTexts } from '@/data/about';
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import founder from "@/assets/founder.jpg";
import plastic from "@/assets/plastic.jpg";
import biodiv from "@/assets/biodiversity.jpg";

export const Route = createFileRoute("/a-propos")({
  loader:async()=>({cmsPage:await loadPage({data:'/a-propos'})}),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'À propos — Green Ivory', 'Découvrez l’histoire, la mission et la vision de Green Ivory, ONG ivoirienne fondée en 2017 pour la protection de l’environnement.', '/a-propos'),
  component: About,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function About() {
  const texts=readAboutTexts(useSetting('about.texts'));
  const T=(key:string)=>texts[key]||ABOUT_TEXT_FALLBACKS[key]||'';
  const imgPlastic=useSetting('about.plastic.image')||plastic;
  const imgFounder=useSetting('about.founder.image')||founder;
  const imgForest=useSetting('about.forest.image')||biodiv;
  return (
    <>
      <PageHero
        eyebrow={T('about.hero.eyebrow')}
        title={T('about.hero.title')}
        intro={T('about.hero.intro')}
      />

      <section className="container-x py-6 lg:py-10 grid lg:grid-cols-2 gap-12 items-center">
        <img src={imgPlastic} alt="Nettoyage" loading="lazy" className="bento h-[420px] w-full object-cover" />
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold">{T('about.plastic.title')}</h2>
          <p className="mt-5 text-muted-foreground">
            {T('about.plastic.text1')}
          </p>
          <h3 className="mt-8 text-xl font-semibold">{T('about.plastic.subtitle')}</h3>
          <p className="mt-3 text-muted-foreground">
            {T('about.plastic.text2')}
          </p>
        </div>
      </section>

      <section className="container-x py-16 grid md:grid-cols-3 gap-6">
        <ValueCard icon={<Target className="h-5 w-5" />} title={T('about.mission.title')} text={T('about.mission.text')} />
        <ValueCard icon={<Eye className="h-5 w-5" />} title={T('about.vision.title')} text={T('about.vision.text')} />
        <ValueCard icon={<Heart className="h-5 w-5" />} title={T('about.values.title')} text={T('about.values.text')} />
      </section>

      <section className="container-x py-6 lg:py-10 grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-2">
          <img src={imgFounder} alt="Khérann YAO, Président" loading="lazy" className="bento h-[520px] w-full object-cover" />
        </div>
        <div className="lg:col-span-3">
          <span className="eyebrow">{T('about.history.eyebrow')}</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold">{T('about.history.title')}</h2>
          <p className="mt-5 text-muted-foreground">
            {T('about.history.text1')}
          </p>
          <p className="mt-4 text-muted-foreground">
            {texts['about.history.text2']
              ? texts['about.history.text2']
              : <>L’ONG est dirigée par <strong className="text-foreground">Khérann YAO</strong>, Jeune Ambassadeur de l’UNICEF pour l’Environnement (2018), entouré d’une équipe pluridisciplinaire et de bénévoles dévoués.</>}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/devenir-benevole" className="btn-primary">Devenir bénévole <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/nous-joindre" className="btn-ghost">Nous contacter</Link>
          </div>
        </div>
      </section>

      <section className="container-x py-6 lg:py-10">
        <div className="max-w-3xl">
          <span className="eyebrow">{T('about.board.eyebrow')}</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight">{T('about.board.title')}</h2>
          <p className="mt-5 text-muted-foreground">{T('about.board.intro')}</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <BoardCard name={T('about.board.name1')} role={T('about.board.role1')} />
          <BoardCard name={T('about.board.name2')} role={T('about.board.role2')} />
          <BoardCard name={T('about.board.name3')} role={T('about.board.role3')} />
          <BoardCard name={T('about.board.name4')} role={T('about.board.role4')} />
          <BoardCard name={T('about.board.name5')} role={T('about.board.role5')} />
          <BoardCard name={T('about.board.name6')} role={T('about.board.role6')} />
        </div>
      </section>

      <section className="container-x pb-16 lg:pb-24">
        <img src={imgForest} alt="Forêt" loading="lazy" className="bento h-[360px] w-full object-cover" />
      </section>
    </>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bento p-7">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">{icon}</span>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

/** Membre du Conseil d'administration (brochure 2026), textes modifiables en console. */
function BoardCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="bento p-7">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold">
        {name.split(/\s+/).filter(w => w.length > 1).map(w => w[0]).slice(-2).join('')}
      </span>
      <h3 className="mt-4 text-lg font-bold leading-snug">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{role}</p>
    </div>
  );
}
