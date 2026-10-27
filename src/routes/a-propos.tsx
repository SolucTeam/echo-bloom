import { pageHead, useSetting } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { ABOUT_TEXT_FALLBACKS, readAboutTexts, localizedAboutTexts } from '@/data/about';
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/components/Language';
import { Fragment } from "react";
import { ArrowRight, Target, Eye, Heart, Award, Recycle } from "lucide-react";
import founder from "@/assets/founder.jpg";
import plastic from "@/assets/plastic.jpg";
import biodiv from "@/assets/biodiversity.jpg";

export const Route = createFileRoute("/a-propos")({
  loader:async()=>({cmsPage:await loadPage({data:'/a-propos'})}),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'À propos — Green Ivory', 'Découvrez l’histoire, la mission et la vision de Green Ivory, ONG ivoirienne fondée en 2017 pour la protection de l’environnement.', '/a-propos', { title: 'About us — Green Ivory', description: 'Discover the story, mission and vision of Green Ivory, an Ivorian NGO founded in 2017 to protect the environment.' }),
  component: About,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function About() {
  const { t, lang } = useLang();
  const L=localizedAboutTexts(readAboutTexts(useSetting('about.texts')),readAboutTexts(useSetting('about.textsEn')),lang);
  const T=(key:string)=>L[key]||ABOUT_TEXT_FALLBACKS[key]||'';
  const [hist2Before,hist2After]=t('about.history.text2Strong').split('{name}');
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

      {/* Histoire — portrait éditorial du fondateur et récit, arrivée en cascade */}
      <section className="container-x py-6 lg:py-10 grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        <Reveal className="lg:col-span-5">
          <div className="relative pb-6">
            <img src={imgFounder} alt={t('about.founder.alt')} loading="lazy" className="bento h-[440px] lg:h-[540px] w-full object-cover" />
            <div className="absolute bottom-0 left-6 flex items-center gap-3 rounded-2xl border border-border bg-background/95 p-4 pr-6 shadow-lg backdrop-blur">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Award className="h-5 w-5" /></span>
              <div>
                <div className="text-xs text-muted-foreground">{t('about.badge.recognized')}</div>
                <div className="text-sm font-semibold leading-snug">{t('about.badge.ambassador').split('\n').map((line, i, arr) => <Fragment key={i}>{line}{i < arr.length - 1 && <br />}</Fragment>)}</div>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <Reveal>
            <div>
              <span className="eyebrow">{T('about.history.eyebrow')}</span>
              <h2 className="mt-3 text-3xl lg:text-5xl font-bold tracking-tight">{T('about.history.title')}</h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-base lg:text-lg leading-relaxed text-muted-foreground">{T('about.history.text1')}</p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-muted-foreground">
              {L['about.history.text2']
                ? L['about.history.text2']
                : <>{hist2Before}<strong className="text-foreground">Khérann YAO</strong>{hist2After}</>}
            </p>
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/devenir-benevole" className="btn-primary">{t('nav.volunteer')} <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/nous-joindre" className="btn-ghost">{t('footer.contactUs')}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gouvernance — annuaire du Conseil d'administration */}
      <section className="container-x py-6 lg:py-10">
        <Reveal>
          <div className="max-w-3xl">
            <span className="eyebrow">{T('about.board.eyebrow')}</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight">{T('about.board.title')}</h2>
            <p className="mt-5 text-muted-foreground">{T('about.board.intro')}</p>
          </div>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <Reveal key={n} delay={i * 80} className="h-full [&>.reveal-inner]:h-full">
              <BoardCard name={T('about.board.name' + n)} role={T('about.board.role' + n)} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pollution plastique — bandeau accent, texte et photo côte à côte */}
      <section className="container-x py-6 lg:py-10">
        <div className="bento border-0 bg-accent p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Reveal>
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-primary"><Recycle className="h-5 w-5" /></span>
                  <h2 className="mt-5 text-3xl lg:text-4xl font-bold tracking-tight">{T('about.plastic.title')}</h2>
                  <p className="mt-5 text-muted-foreground">{T('about.plastic.text1')}</p>
                </div>
              </Reveal>
              <Reveal delay={140}>
                <div className="mt-8 rounded-2xl border border-border/60 bg-background/70 p-5">
                  <h3 className="font-semibold">{T('about.plastic.subtitle')}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{T('about.plastic.text2')}</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <img src={imgPlastic} alt={t('about.plastic.alt')} loading="lazy" className="bento aspect-[4/3] h-auto w-full object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission, vision, valeurs — cartes posées sur la forêt (image de bas de page) */}
      <section className="container-x pb-16 lg:pb-24">
        <div className="bento relative overflow-hidden border-0">
          <img src={imgForest} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="relative grid gap-5 p-8 md:grid-cols-3 lg:p-14">
            <ValueCard icon={<Target className="h-5 w-5" />} title={T('about.mission.title')} text={T('about.mission.text')} />
            <ValueCard icon={<Eye className="h-5 w-5" />} title={T('about.vision.title')} text={T('about.vision.text')} delay={120} />
            <ValueCard icon={<Heart className="h-5 w-5" />} title={T('about.values.title')} text={T('about.values.text')} delay={240} />
          </div>
        </div>
      </section>
    </>
  );
}

/** Carte Mission / Vision / Valeurs : verre dépoli sur le fond forêt, entrée décalée. */
function ValueCard({ icon, title, text, delay = 0 }: { icon: React.ReactNode; title: string; text: string; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full [&>.reveal-inner]:h-full">
      <div className="flex h-full flex-col rounded-2xl border border-white/20 bg-background/95 p-6 shadow-lg backdrop-blur">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">{icon}</span>
        <h3 className="mt-4 text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </Reveal>
  );
}

/** Membre du Conseil d'administration (brochure 2026), textes modifiables en console. */
function BoardCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="bento flex h-full items-center gap-4 p-5 transition duration-300 hover:border-primary/40 hover:shadow-md motion-reduce:transition-none">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary font-display font-bold">
        {name.split(/\s+/).filter(w => w.length > 1).map(w => w[0]).slice(-2).join('')}
      </span>
      <div className="min-w-0">
        <h3 className="font-bold leading-snug">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
