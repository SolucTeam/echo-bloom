import { pageHead } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Recycle, Trees, ThermometerSun, Users, Sprout, Award, Globe2 } from "lucide-react";
import hero from "@/assets/hero.jpg";
import plastic from "@/assets/plastic.jpg";
import biodiversity from "@/assets/biodiversity.jpg";
import climate from "@/assets/climate.jpg";
import { ProjectCards } from '@/components/ProjectCards';
import { useSetting } from '@/components/ManagedSite';
import { readProjects } from '@/lib/projects';
import { visibleProjects } from '@/lib/project-schema';
import { PartnerLogos } from '@/components/PartnerLogos';
import { HOME_TEXT_FALLBACKS, DEFAULT_HOME_BIGSTATS, readHomeStats, readHomeTexts } from '@/data/home';

export const Route = createFileRoute("/")({
  loader:async()=>({cmsPage:await loadPage({data:'/'})}),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Green Ivory — Engageons-nous pour un avenir durable', 'ONG ivoirienne pour la promotion de l’emploi vert. Découvrez nos projets contre la pollution plastique, pour la biodiversité et le climat.', '/'),
  component: Home,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function Home() {
  const projects=visibleProjects(readProjects(useSetting('site.projects')));
  const texts=readHomeTexts(useSetting('home.texts'));
  const T=(key:string)=>texts[key]||HOME_TEXT_FALLBACKS[key]||'';
  const stats=readHomeStats(useSetting('site.stats'));
  const bigstats=readHomeStats(useSetting('home.bigstats'),DEFAULT_HOME_BIGSTATS);
  const heroImage = useSetting('home.hero.image') || hero;
  const axis1Image = useSetting('home.axis1.image') || plastic;
  const axis2Image = useSetting('home.axis2.image') || biodiversity;
  const axis3Image = useSetting('home.axis3.image') || climate;
  const aboutImage1 = useSetting('home.about.image1') || biodiversity;
  const aboutImage2 = useSetting('home.about.image2') || plastic;
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-40 pointer-events-none" aria-hidden />
        <div className="container-x pt-12 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="eyebrow">{T('home.hero.eyebrow')}</span>
            <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
              {T('home.hero.title') || (<>Engageons-nous pour <span className="text-secondary">un avenir</span> <span className="italic font-semibold" style={{ fontFamily: "Outfit" }}>durable.</span></>)}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">{T('home.hero.intro')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/faire-un-don" className="btn-primary">
                Soutenir nos projets <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/projets" className="btn-ghost">
                Découvrir nos projets
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {stats.map(s=><Stat key={s.label} value={s.value} label={s.label} />)}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-leaf/40 blur-3xl" />
              <div className="bento p-0 aspect-[4/5] sm:aspect-[5/4]">
                <img
                  src={heroImage}
                  alt="Volontaires Green Ivory nettoyant une plage en Côte d’Ivoire"
                  className="h-full w-full object-cover"
                  width={1600} height={1100}
                />
              </div>
              <div className="bento absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 px-5 py-4 max-w-[260px]">
                <span className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground inline-flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs text-muted-foreground">Reconnue</div>
                  <div className="text-sm font-semibold">Jeune Ambassadeur UNICEF Environnement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TROIS AXES — bento */}
      <section className="container-x py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow">{T('home.axis.eyebrow')}</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
              {T('home.axis.title')}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            {T('home.axis.intro')}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-6 lg:grid-rows-2 lg:auto-rows-fr">
          <AxisCard
            className="lg:col-span-3 lg:row-span-2"
            tag={T('home.axis1.tag')}
            icon={<Recycle className="h-5 w-5" />}
            title={T('home.axis1.title')}
            image={axis1Image}
            text={T('home.axis1.text')}
          />
          <AxisCard
            className="lg:col-span-3"
            tag={T('home.axis2.tag')}
            icon={<Trees className="h-5 w-5" />}
            title={T('home.axis2.title')}
            image={axis2Image}
            compact
            text={T('home.axis2.text')}
          />
          <AxisCard
            className="lg:col-span-3"
            tag={T('home.axis3.tag')}
            icon={<ThermometerSun className="h-5 w-5" />}
            title={T('home.axis3.title')}
            image={axis3Image}
            compact
            text={T('home.axis3.text')}
          />
        </div>
      </section>

      {/* Engagement climat */}
      <section className="container-x py-16 lg:py-24">
        <div className="bento p-8 lg:p-14 bg-primary text-primary-foreground border-0">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <span className="eyebrow !text-leaf">{T('home.climate.eyebrow')}</span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-bold leading-tight">
                {T('home.climate.title')}
              </h2>
              <p className="mt-5 opacity-85 max-w-xl">
                {T('home.climate.text')}
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Pillar icon={<Users className="h-5 w-5" />} title={T('home.climate.p1.title')} text={T('home.climate.p1.text')} />
              <Pillar icon={<Sprout className="h-5 w-5" />} title={T('home.climate.p2.title')} text={T('home.climate.p2.text')} />
              <Pillar icon={<Globe2 className="h-5 w-5" />} title={T('home.climate.p3.title')} text={T('home.climate.p3.text')} />
            </div>
          </div>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">{T('home.about.eyebrow')}</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight">
            {T('home.about.title')}
          </h2>
          <p className="mt-5 text-muted-foreground">
            {T('home.about.text1')}
          </p>
          <p className="mt-4 text-muted-foreground">
            {T('home.about.text2')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/a-propos" className="btn-primary">En savoir plus <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/devenir-benevole" className="btn-ghost">Devenir bénévole</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={aboutImage1} alt="Forêt ivoirienne" loading="lazy" className="bento h-72 w-full object-cover" />
          <img src={aboutImage2} alt="Sensibilisation jeunes" loading="lazy" className="bento h-72 w-full object-cover mt-10" />
        </div>
      </section>

      {/* Projets phares */}
      <section className="container-x py-16 lg:py-24">
        <div className="mb-10">
          <span className="eyebrow">{T('home.projects.eyebrow')}</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            {T('home.projects.title')}
          </h2>
        </div>
        <ProjectCards projects={projects}/>
        <Link to="/projets" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary">Tous nos projets <ArrowRight className="h-4 w-4"/></Link>
      </section>

      {/* Chiffres clés */}
      <section className="container-x py-16 lg:py-24">
        <div className="bento p-8 lg:p-12 bg-accent border-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {bigstats.map((s, i) => (
              <BigStat key={i} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires CTA */}
      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="eyebrow">{T('home.partners.eyebrow')}</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight">
            {T('home.partners.title')}
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl">
            {T('home.partners.text')}
          </p>
          <div className="mt-7">
            <Link to="/devenir-partenaire" className="btn-primary">
              Devenir partenaire <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <PartnerLogos />
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-5xl font-bold text-primary tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-foreground/70">{label}</div>
    </div>
  );
}

function AxisCard({
  tag, title, text, image, icon, className, compact,
}: {
  tag: string; title: string; text: string; image: string; icon: React.ReactNode;
  className?: string; compact?: boolean;
}) {
  return (
    <article className={`bento group relative overflow-hidden ${className ?? ""}`}>
      <div className={`relative ${compact ? "h-44" : "h-72"} overflow-hidden`}>
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold text-primary">
          {icon} {tag}
        </span>
      </div>
      <div className="p-6 lg:p-8">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{text}</p>
      </div>
    </article>
  );
}

function Pillar({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-background/10 p-5 border border-background/15">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-leaf text-primary">{icon}</span>
      <h4 className="mt-4 font-semibold">{title}</h4>
      <p className="mt-2 text-sm opacity-80">{text}</p>
    </div>
  );
}

