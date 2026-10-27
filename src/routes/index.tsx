import { pageHead } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Recycle, Trees, ThermometerSun, Users, Sprout, Globe2, Flame, Zap, ShieldCheck, Handshake, Heart } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import accueil2 from "@/assets/accueil2.jpg";
import accueil3 from "@/assets/accueil3.jpg";
import accueil4 from "@/assets/accueil4.jpg";
import axe2 from "@/assets/axe2.jpg";
import axe3 from "@/assets/axe3.jpg";
import { ProgramCards } from '@/components/ProgramCards';
import { useSetting } from '@/components/ManagedSite';
import { useLang } from '@/components/Language';
import { readPrograms } from '@/lib/programs';
import { visiblePrograms, localizedProgram } from '@/lib/program-schema';
import { PartnerLogos } from '@/components/PartnerLogos';
import { LEAF_LIMBE, LEAF_NERVURE } from '@/components/FloatingLeaves';
import { HOME_TEXT_FALLBACKS, DEFAULT_HOME_BIGSTATS, readHomeStats, readHomeTexts, localizedHomeTexts, localizedHomeStats } from '@/data/home';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute("/")({
  loader:async()=>({cmsPage:await loadPage({data:'/'})}),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Green Ivory — Engageons-nous pour un avenir durable', 'ONG ivoirienne pour la promotion de l’emploi vert. Découvrez nos programmes contre la pollution plastique, pour la biodiversité et le climat.', '/', { title: 'Green Ivory — Commit to a sustainable future', description: 'Ivorian NGO promoting green jobs. Discover our programs against plastic pollution, for biodiversity and the climate.' }),
  component: Home,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function Home() {
  const { t, lang } = useLang();
  const programs=visiblePrograms(readPrograms(useSetting('site.programs')||useSetting('site.projects'))).map(p=>localizedProgram(p,lang));
  const texts=readHomeTexts(useSetting('home.texts'));
  const L=localizedHomeTexts(texts,readHomeTexts(useSetting('home.textsEn')),lang);
  const T=(key:string)=>L[key]||HOME_TEXT_FALLBACKS[key]||'';
  const heroTitle = T('home.hero.title');
  const heroFallbackWords = t('home.hero.titleFallback').split(' ').filter(Boolean);
  const stats=localizedHomeStats(readHomeStats(useSetting('site.stats')),lang);
  const bigstats=localizedHomeStats(readHomeStats(useSetting('home.bigstats'),DEFAULT_HOME_BIGSTATS),lang);
  const heroImage = useSetting('home.hero.image') || hero;
  const axis1Image = useSetting('home.axis1.image') || accueil3;
  const axis2Image = useSetting('home.axis2.image') || axe2;
  const axis3Image = useSetting('home.axis3.image') || axe3;
  const aboutImage1 = useSetting('home.about.image1') || accueil2;
  const aboutImage2 = useSetting('home.about.image2') || accueil4;
  return (
    <>
      {/* HERO — photo plein cadre en fond, titre posé dessus, contenu en carte chevauchant le bas du visuel */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-bg-in" aria-hidden="true">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/25 to-primary/90" />
          <div className="absolute inset-0 grain opacity-10 pointer-events-none" />
        </div>
        <div className="container-x relative pt-16 sm:pt-20 lg:pt-24 pb-44 sm:pb-48 lg:pb-56">
          <div className="hero-stagger max-w-3xl">
            <span className="eyebrow eyebrow-light">{T('home.hero.eyebrow')}</span>
            <h1 aria-label={heroTitle || t('home.hero.titleFallback')} className="hero-words mt-5 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight text-background">
              {heroTitle
                ? heroTitle.split(' ').filter(Boolean).map((word, i) => <W key={i} delay={i}>{word}</W>)
                : heroFallbackWords.map((word, i) => (
                  <W key={i} delay={i} className={HERO_FALLBACK_WORD_STYLES[i]?.className} style={HERO_FALLBACK_WORD_STYLES[i]?.style}>{word}</W>
                ))}
            </h1>
          </div>
        </div>
      </section>

      {/* Sous l'image — carte chevauchant le bas du visuel : introduction, actions et chiffres clés */}
      <section className="container-x relative z-10 -mt-10 sm:-mt-12 lg:-mt-16 pb-10 lg:pb-14">
        <div className="hero-media-in">
          <div className="bento p-7 sm:p-9 lg:p-11">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <p className="lg:col-span-7 text-lg lg:text-xl leading-relaxed text-muted-foreground">{T('home.hero.intro')}</p>
              <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
                <Link to="/faire-un-don" className="btn-primary">
                  {t('home.ctaSupport')} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/programmes" className="btn-ghost">
                  {t('home.ctaDiscover')}
                </Link>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-7 grid grid-cols-3 gap-4 sm:gap-6">
              {stats.map(s=><Stat key={s.label} value={s.value} label={s.label} />)}
            </div>
          </div>
        </div>
      </section>

      {/* TROIS AXES — parcours animé : cartes échelonnées reliées par une liane dessinée au défilement */}
      <section className="container-x py-6 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <Reveal>
            <div>
              <span className="eyebrow">{T('home.axis.eyebrow')}</span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
                {T('home.axis.title')}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-muted-foreground max-w-md">
              {T('home.axis.intro')}
            </p>
          </Reveal>
        </div>

        <AxesTrail
          axes={[
            { tag: T('home.axis1.tag'), icon: <Recycle className="h-4 w-4" />, title: T('home.axis1.title'), text: T('home.axis1.text'), image: axis1Image },
            { tag: T('home.axis2.tag'), icon: <Trees className="h-4 w-4" />, title: T('home.axis2.title'), text: T('home.axis2.text'), image: axis2Image },
            { tag: T('home.axis3.tag'), icon: <ThermometerSun className="h-4 w-4" />, title: T('home.axis3.title'), text: T('home.axis3.text'), image: axis3Image },
          ]}
        />
      </section>

      {/* NOS VALEURS — brochure 2026 */}
      <section className="container-x py-6 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <Reveal>
            <div>
              <span className="eyebrow">{T('home.values.eyebrow')}</span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
                {T('home.values.title')}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-muted-foreground max-w-md">
              {T('home.values.intro')}
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <ValueCard icon={<Flame className="h-5 w-5" />} label={T('home.value1.label')} text={T('home.value1.text')} />
          <ValueCard icon={<Zap className="h-5 w-5" />} label={T('home.value2.label')} text={T('home.value2.text')} />
          <ValueCard icon={<ShieldCheck className="h-5 w-5" />} label={T('home.value3.label')} text={T('home.value3.text')} />
          <ValueCard icon={<Handshake className="h-5 w-5" />} label={T('home.value4.label')} text={T('home.value4.text')} />
          <ValueCard icon={<Heart className="h-5 w-5" />} label={T('home.value5.label')} text={T('home.value5.text')} />
        </div>
      </section>

      {/* Engagement climat */}
      <section className="container-x py-6 lg:py-10">
        <div className="bento p-8 lg:p-14 bg-primary text-primary-foreground border-0">
          <div className="grid lg:grid-cols-2 gap-10">
            <Reveal>
              <div>
                <span className="eyebrow !text-leaf">{T('home.climate.eyebrow')}</span>
                <h2 className="mt-4 text-4xl lg:text-5xl font-bold leading-tight">
                  {T('home.climate.title')}
                </h2>
                <p className="mt-5 opacity-85 max-w-xl">
                  {T('home.climate.text')}
                </p>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-4">
              <Pillar icon={<Users className="h-5 w-5" />} title={T('home.climate.p1.title')} text={T('home.climate.p1.text')} />
              <Pillar icon={<Sprout className="h-5 w-5" />} title={T('home.climate.p2.title')} text={T('home.climate.p2.text')} />
              <Pillar icon={<Globe2 className="h-5 w-5" />} title={T('home.climate.p3.title')} text={T('home.climate.p3.text')} />
            </div>
          </div>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="container-x py-6 lg:py-10 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal>
            <div>
              <span className="eyebrow">{T('home.about.eyebrow')}</span>
              <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight">
                {T('home.about.title')}
              </h2>
            </div>
          </Reveal>
          <p className="mt-5 text-muted-foreground">
            {T('home.about.text1')}
          </p>
          <p className="mt-4 text-muted-foreground">
            {T('home.about.text2')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/a-propos" className="btn-primary">{t('common.learnMore')} <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/devenir-benevole" className="btn-ghost">{t('nav.volunteer')}</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={aboutImage1} alt={t('home.about.imgForest')} loading="lazy" className="bento h-72 w-full object-cover" />
          <img src={aboutImage2} alt={t('home.about.imgYouth')} loading="lazy" className="bento h-72 w-full object-cover mt-10" />
        </div>
      </section>

      {/* Programmes phares */}
      <section className="container-x py-6 lg:py-10">
        <Reveal className="mb-10">
          <div>
            <span className="eyebrow">{T('home.programs.eyebrow')}</span>
            <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
              {T('home.programs.title')}
            </h2>
          </div>
        </Reveal>
        {/* 3 programmes maximum sur l'accueil, en liste horizontale — la grille complète vit sur /programmes */}
        <ProgramCards programs={programs.slice(0,3)} layout="row"/>
        <Button asChild className="mt-8 h-11 rounded-full px-7 text-sm font-semibold shadow-md">
          <Link to="/programmes">{t('home.allPrograms')} <ArrowRight className="h-4 w-4"/></Link>
        </Button>
      </section>

      {/* Chiffres clés */}
      <section className="container-x py-6 lg:py-10">
        <div className="bento p-8 lg:p-12 bg-accent border-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {bigstats.map((s, i) => (
              <BigStat key={i} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires CTA */}
      <section className="container-x py-6 lg:py-10 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <Reveal>
            <div>
              <span className="eyebrow">{T('home.partners.eyebrow')}</span>
              <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight">
                {T('home.partners.title')}
              </h2>
            </div>
          </Reveal>
          <p className="mt-5 text-muted-foreground max-w-xl">
            {T('home.partners.text')}
          </p>
          <div className="mt-7">
            <Link to="/devenir-partenaire" className="btn-primary">
              {t('nav.partner')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <PartnerLogos />
      </section>
    </>
  );
}

/** Repli du titre du héros : habillage par position des mots venant du dictionnaire (même rendu que le repli FR d'origine). */
const HERO_FALLBACK_WORD_STYLES: { className?: string; style?: CSSProperties }[] = [
  {},
  {},
  { className: 'text-leaf' },
  { className: 'text-leaf' },
  { className: 'italic font-semibold', style: { fontFamily: 'Outfit' } },
];

/** Un mot du titre du hero, révélé derrière son propre masque (délais en cascade). */
function W({ children, className, style, delay = 0 }: { children: ReactNode; className?: string; style?: CSSProperties; delay?: number }) {
  return (
    <>
      {' '}
      <span className="hero-word">
        <span className={className} style={{ ...style, animationDelay: `${140 + delay * 55}ms` }}>{children}</span>
      </span>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap tabular-nums"><AnimatedNumber value={value} /></div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-5xl font-bold text-primary tracking-tight"><AnimatedNumber value={value} /></div>
      <div className="mt-2 text-sm text-foreground/70">{label}</div>
    </div>
  );
}

/**
 * Parcours des trois axes — plus de carrousel : les trois cartes sont toujours
 * visibles côte à côte et arrivent en cascade au défilement (Reveal décalé).
 * Au-dessus d'elles, une liane de marque se dessine d'elle-même (trait
 * progressif normalisé par pathLength) et porte une feuille par axe qui se
 * déploie depuis sa tige puis se balance doucement. « Réduire les
 * animations » : la composition s'affiche directement en état final, sans
 * dessin ni balancement ; sans JS, la liane reste simplement invisible
 * (décor pur, cartes intactes).
 */
function AxesTrail({ axes }: { axes: { tag: string; icon: ReactNode; title: string; text: string; image: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDrawn(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { setDrawn(true); io.disconnect(); }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref}>
      {/* Liane connectrice : le trait traverse les centres des trois colonnes. */}
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        fill="none"
        className={`mb-2 hidden h-20 w-full lg:block ${drawn ? 'axes-drawn' : ''}`}
      >
        <path
          d="M -20 62 C 80 55 140 48 200 38 C 340 14 460 52 600 34 C 740 16 860 44 1000 30 C 1090 21 1160 34 1220 50"
          pathLength={1}
          className="axes-line stroke-primary/40"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {[
          { x: 200, y: 38, r: -16, s: 0.15, delay: '0.9s', sway: '-1.2s', cls: 'text-primary/50' },
          { x: 600, y: 34, r: 8, s: 0.18, delay: '1.4s', sway: '-3s', cls: 'text-leaf' },
          { x: 1000, y: 30, r: -4, s: 0.16, delay: '1.9s', sway: '-2s', cls: 'text-secondary/70' },
        ].map((n, i) => (
          <g key={i} transform={`translate(${n.x} ${n.y}) rotate(${n.r}) scale(${n.s})`}>
            <g className="axes-pop" style={{ transitionDelay: n.delay }}>
              <g className="axes-sway" style={{ '--sway-d': n.sway } as CSSProperties}>
                <path d={LEAF_LIMBE} transform="translate(-141 -70)" className={`fill-current ${n.cls}`} stroke="none" />
                <path d={LEAF_NERVURE} transform="translate(-141 -70)" className="stroke-current text-primary/60" strokeWidth={16} strokeLinecap="round" />
              </g>
            </g>
          </g>
        ))}
      </svg>
      <div className="relative grid gap-8 md:grid-cols-3">
        {axes.map((axis, i) => (
          <Reveal key={i} delay={i * 130} className="h-full [&>.reveal-inner]:h-full">
            <AxisCard index={i} tag={axis.tag} icon={axis.icon} title={axis.title} text={axis.text} image={axis.image} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** Carte d'un axe : photo avec numéro en filigrane, pastille d'icône, titre et texte. */
function AxisCard({ index, tag, title, text, image, icon }: { index: number; tag: string; icon: ReactNode; title: string; text: string; image: string }) {
  return (
    <article className="bento group h-full overflow-hidden transition duration-500 hover:-translate-y-1.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
        />
        <span aria-hidden="true" className="absolute bottom-2 right-4 font-display text-5xl font-extrabold text-white drop-shadow-md">{'0' + (index + 1)}</span>
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {icon} {tag}
        </span>
      </div>
      <div className="p-6 lg:p-7">
        <h3 className="text-xl font-bold lg:text-2xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
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

/** Carte des cinq valeurs de la marque (brochure 2026), textes modifiables en console. */
function ValueCard({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="bento p-6">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">{icon}</span>
      <h3 className="mt-4 text-lg font-bold">{label}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

