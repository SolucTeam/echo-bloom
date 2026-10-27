import { Link } from "@tanstack/react-router";
import { Calendar, Building2, Rocket, Heart, Handshake, Users, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/components/Language';
import type { Program } from '@/lib/program-schema';

export interface ProgramInfo {
  eyebrow: string;
  title: string;
  tagline: string;
  org: string;
  launched: string;
  pilot: string;
  firstEdition: string;
  goal: string;
  goalDetail: string;
  hero: string;
  context: string;
  objectives: string[];
  outcomes: { label: string; value: string }[];
}

/**
 * Page détail d'un programme : bandeau d'identité sur fond accent, objectif + photo
 * de terrain, contexte et objectifs, résultats attendus en colonne collante, autres
 * programmes à explorer puis bandeau d'action. Entrées en cascade au défilement.
 */
export function ProgramLayout({ info, others = [] }: { info: ProgramInfo; others?: Program[] }) {
  const { t } = useLang();
  return (
    <>
      {/* Bandeau d'en-tête : retour, identité du programme et fiche descriptive */}
      <section className="border-b border-border bg-accent/40">
        <div className="container-x py-8 lg:py-12 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <div>
                <Link to="/programmes" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80">
                  <ArrowLeft className="h-4 w-4" /> {t('program.back')}
                </Link>
                <span className="eyebrow block">{info.eyebrow}</span>
                <h1 className="mt-4 text-4xl lg:text-6xl font-bold tracking-tight">{info.title}</h1>
                <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{info.tagline}</p>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/faire-un-don" className="btn-primary"><Heart className="h-4 w-4" /> {t('nav.donate')}</Link>
                <Link to="/devenir-partenaire" className="btn-ghost"><Handshake className="h-4 w-4" /> {t('program.sponsor')}</Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {info.org && <Meta icon={<Building2 className="h-4 w-4" />} label={t('meta.org')} value={info.org} />}
              {info.launched && <Meta icon={<Calendar className="h-4 w-4" />} label={t('meta.launch')} value={info.launched} />}
              {info.pilot && <Meta icon={<Rocket className="h-4 w-4" />} label={t('meta.pilot')} value={info.pilot} />}
              {info.firstEdition && <Meta icon={<Calendar className="h-4 w-4" />} label={t('meta.firstEdition')} value={info.firstEdition} />}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Objectif du programme et photo de terrain (cible de la transition de vue) */}
      <section className="container-x grid items-center gap-10 py-8 lg:grid-cols-2 lg:py-12">
        <Reveal>
          <div>
            <span className="eyebrow">{t('program.goal')}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">{info.goal}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{info.goalDetail}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          {info.hero && (
            <img
              src={info.hero}
              alt={info.title}
              loading="lazy"
              className="bento aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-[460px]"
              style={{ viewTransitionName: 'program-hero' } as React.CSSProperties}
            />
          )}
        </Reveal>
      </section>

      {/* Contexte, objectifs | résultats attendus en colonne collante */}
      <section className="container-x grid items-start gap-10 py-4 lg:grid-cols-3 lg:py-8">
        <div className="lg:col-span-2">
          <Reveal>
            <div>
              <span className="eyebrow">{t('program.context')}</span>
              <h3 className="mt-3 text-3xl font-bold">{t('program.why')}</h3>
              <p className="mt-5 whitespace-pre-line leading-relaxed text-muted-foreground">{info.context}</p>
            </div>
          </Reveal>
          {info.objectives.length > 0 && (
            <Reveal delay={120}>
              <div className="mt-12">
                <h3 className="text-2xl font-bold">{t('program.objectives')}</h3>
                <ul className="mt-5 space-y-3">
                  {info.objectives.map((o) => (
                    <li key={o} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                      <span className="text-foreground/90">{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>

        {/* Hors Reveal : le wrapper masquerait la position collante de la colonne */}
        <aside className="bento h-fit border-0 bg-primary p-7 text-primary-foreground lg:sticky lg:top-24">
          {info.outcomes.length > 0 && (
            <>
              <h4 className="text-lg font-semibold">{t('program.outcomes')}</h4>
              <div className="mt-5 space-y-5">
                {info.outcomes.map((o) => (
                  <div key={o.label} className="border-b border-primary-foreground/15 pb-4 last:border-0 last:pb-0">
                    <div className="font-display text-3xl font-bold">{o.value}</div>
                    <div className="mt-1 text-sm opacity-85">{o.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          <Link
            to="/faire-un-don"
            className={"inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-semibold text-primary transition hover:opacity-90" + (info.outcomes.length ? " mt-7" : "")}
          >
            {t('program.support')}
          </Link>
        </aside>
      </section>

      {/* Explorer les autres programmes */}
      {others.length > 0 && (
        <section className="container-x py-8 lg:py-12">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-bold lg:text-3xl">{t('program.others')}</h2>
              <Link to="/programmes" className="inline-flex items-center gap-2 py-1 -my-1 text-sm font-semibold text-primary">
                {t('program.seeAll')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80} className="h-full [&>.reveal-inner]:h-full">
                <Link to="/programmes/$slug" params={{ slug: p.slug }} className="bento group flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {p.hero && <img src={p.hero} alt={p.title} loading="lazy" className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="eyebrow">{p.eyebrow}</span>
                    <h3 className="mt-2 font-bold leading-snug">{p.title}</h3>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">{p.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Passer à l'action */}
      <section className="container-x pb-16 lg:pb-24">
        <Reveal>
          <div className="bento flex flex-col gap-8 border-0 bg-accent p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div>
              <h2 className="text-2xl font-bold lg:text-3xl">{t('program.actTitle')}</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">{t('program.actIntro', { title: info.title })}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/faire-un-don" className="btn-primary"><Heart className="h-4 w-4" /> {t('nav.donate')}</Link>
              <Link to="/devenir-benevole" className="btn-ghost"><Users className="h-4 w-4" /> {t('nav.volunteer')}</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/** Carte d'identité du programme (organisation, lancement, phase pilote, édition). */
function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bento p-4 lg:p-5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2.5 font-semibold leading-snug">{value}</div>
    </div>
  );
}
