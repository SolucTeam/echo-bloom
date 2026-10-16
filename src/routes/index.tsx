import { pageHead } from '@/components/ManagedSite';
import { loadPage } from '@/lib/site.functions';
import { useSiteText } from "@/lib/cms";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Recycle, Trees, ThermometerSun, Users, Sprout, Award, Globe2 } from "lucide-react";
import hero from "@/assets/hero.jpg";
import plastic from "@/assets/plastic.jpg";
import biodiversity from "@/assets/biodiversity.jpg";
import climate from "@/assets/climate.jpg";
import journees from "@/assets/journees.jpg";
import sentiers from "@/assets/sentiers.jpg";
import { PartnerLogos } from '@/components/PartnerLogos';

export const Route = createFileRoute("/")({
  loader:async()=>({cmsPage:await loadPage({data:'/'})}),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Green Ivory — Engageons-nous pour un avenir durable', 'ONG ivoirienne pour la promotion de l’emploi vert. Découvrez nos projets contre la pollution plastique, pour la biodiversité et le climat.', '/'),
  component: Home,
});

function Home() {
  const heroTitle = useSiteText("home.hero.title", "");
  const heroIntro = useSiteText("home.hero.intro", "Green Ivory est une ONG ivoirienne fondée en 2017. Nous formons les jeunes, dépolluons les plages et plaidons pour des politiques climatiques ambitieuses en Côte d’Ivoire.");
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-40 pointer-events-none" aria-hidden />
        <div className="container-x pt-12 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="eyebrow">La promotion de l’emploi vert</span>
            <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
              {heroTitle || (<>Engageons-nous pour <span className="text-secondary">un avenir</span> <span className="italic font-semibold" style={{ fontFamily: "Outfit" }}>durable.</span></>)}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">{heroIntro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/devenir-partenaire" className="btn-primary">
                Soutenir nos projets <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/projets/journees-sans-plastique" className="btn-ghost">
                Découvrir nos projets
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat value="15k+" label="Jeunes sensibilisés" />
              <Stat value="2 500" label="Arbres plantés" />
              <Stat value="7 ans" label="d’engagement" />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-leaf/40 blur-3xl" />
              <div className="bento p-0 aspect-[4/5] sm:aspect-[5/4]">
                <img
                  src={hero}
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
            <span className="eyebrow">Notre intervention</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
              3 axes clés qui orientent nos actions
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Chez Green Ivory, notre engagement repose sur trois piliers stratégiques qui guident
            chacune de nos actions sur le terrain et au plaidoyer.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-6 lg:grid-rows-2 lg:auto-rows-fr">
          <AxisCard
            className="lg:col-span-3 lg:row-span-2"
            tag="Axe 1"
            icon={<Recycle className="h-5 w-5" />}
            title="La pollution plastique"
            image={plastic}
            text="Un fléau qui impacte gravement nos écosystèmes, nos océans et notre santé. En Côte d’Ivoire, il engorge les villes et dégrade plages et cours d’eau. Nous menons des campagnes de sensibilisation, des nettoyages et déployons des solutions de collecte et de recyclage."
          />
          <AxisCard
            className="lg:col-span-3"
            tag="Axe 2"
            icon={<Trees className="h-5 w-5" />}
            title="La perte de la biodiversité"
            image={biodiversity}
            compact
            text="Déforestation, urbanisation et pollution menacent les écosystèmes. Nous agissons par le reboisement, la protection des forêts et la sensibilisation à la conservation."
          />
          <AxisCard
            className="lg:col-span-3"
            tag="Axe 3"
            icon={<ThermometerSun className="h-5 w-5" />}
            title="Changement climatique"
            image={climate}
            compact
            text="Élévation des températures, érosion côtière, précipitations irrégulières. Nous portons la voix des jeunes aux COP et promouvons l’économie verte."
          />
        </div>
      </section>

      {/* Engagement climat */}
      <section className="container-x py-16 lg:py-24">
        <div className="bento p-8 lg:p-14 bg-primary text-primary-foreground border-0">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <span className="eyebrow !text-leaf">Face à la crise climatique</span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-bold leading-tight">
                Green Ivory s’engage avec et pour la jeunesse.
              </h2>
              <p className="mt-5 opacity-85 max-w-xl">
                Montée des températures, érosion côtière, déforestation accélérée, raréfaction
                des ressources en eau. Ces impacts menacent notre environnement et nos communautés.
                Nous agissons sur trois fronts complémentaires.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Pillar icon={<Users className="h-5 w-5" />} title="Sensibilisation & éducation" text="Programmes Journées Sans Plastique et Sentiers Verts pour former jeunes et communautés." />
              <Pillar icon={<Sprout className="h-5 w-5" />} title="Actions terrain" text="Nettoyages, recyclage et promotion de l’économie circulaire." />
              <Pillar icon={<Globe2 className="h-5 w-5" />} title="Plaidoyer" text="Portage de la voix des jeunes auprès des décideurs et instances COP." />
            </div>
          </div>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">Qui sommes-nous ?</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight">
            Une équipe passionnée, un impact mesurable.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Green Ivory est une ONG fondée en 2017, basée en Côte d’Ivoire. Nous œuvrons pour la
            protection de l’environnement à travers des actions contre la pollution plastique,
            le changement climatique et la perte de biodiversité — avec une attention particulière
            à l’éducation environnementale des jeunes et des enfants.
          </p>
          <p className="mt-4 text-muted-foreground">
            L’ONG est dirigée par <strong className="text-foreground">Khérann YAO</strong>,
            Président du Conseil d’Administration, nommé Jeune Ambassadeur de l’UNICEF pour
            l’Environnement en 2018.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/a-propos" className="btn-primary">En savoir plus <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/devenir-benevole" className="btn-ghost">Devenir bénévole</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={biodiversity} alt="Forêt ivoirienne" loading="lazy" className="bento h-72 w-full object-cover" />
          <img src={plastic} alt="Sensibilisation jeunes" loading="lazy" className="bento h-72 w-full object-cover mt-10" />
        </div>
      </section>

      {/* Projets phares */}
      <section className="container-x py-16 lg:py-24">
        <div className="mb-10">
          <span className="eyebrow">Nos projets</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            Nos projets au cœur de l’actualité.
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <ProjectCard
            to="/projets/journees-sans-plastique"
            tag="Emploi vert"
            title="Les Journées Sans Plastique"
            text="Une initiative majeure pour combattre la pollution plastique en Côte d’Ivoire. Réduction du plastique à usage unique, gestion des déchets, création d’emplois durables."
            image={journees}
          />
          <ProjectCard
            to="/projets/sentiers-verts"
            tag="Éco-entrepreneuriat"
            title="Les Sentiers Verts"
            text="Programme pour promouvoir l’employabilité des jeunes, la citoyenneté active et la transition vers des modèles économiques durables."
            image={sentiers}
          />
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="container-x py-16 lg:py-24">
        <div className="bento p-8 lg:p-12 bg-accent border-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <BigStat value="15 000+" label="Jeunes et adolescents sensibilisés" />
            <BigStat value="800+" label="Jeunes formés à l’économie verte et bleue" />
            <BigStat value="2 500+" label="Arbres plantés" />
            <BigStat value="45+" label="Éco-entreprises accompagnées" />
          </div>
        </div>
      </section>

      {/* Partenaires CTA */}
      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="eyebrow">Devenir partenaire</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight">
            Soutenez notre organisation, nos missions et nos actions.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl">
            Entreprises, institutions, ONG, collectivités — rejoignez-nous pour développer des
            solutions durables face aux défis environnementaux.
          </p>
          <div className="mt-7">
            <Link to="/devenir-partenaire" className="btn-primary">
              Faire un don <ArrowRight className="h-4 w-4" />
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

function ProjectCard({ to, tag, title, text, image }: { to: string; tag: string; title: string; text: string; image: string }) {
  return (
    <Link to={to} className="bento group block overflow-hidden">
      <div className="relative h-72 overflow-hidden">
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute top-4 left-4 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold text-primary">
          <Leaf className="h-3.5 w-3.5 inline mr-1" /> {tag}
        </span>
      </div>
      <div className="p-7">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{text}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          En savoir plus <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
