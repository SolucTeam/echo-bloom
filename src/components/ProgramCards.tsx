import { Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Program } from '@/lib/program-schema';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/components/Language';

/** Lien image avec préparation de la transition de vue vers la page détail. */
function HeroLink({ p, className }: { p: Program; className?: string }) {
  return (
    <Link
      to="/programmes/$slug"
      params={{ slug: p.slug }}
      className={className}
      aria-label={p.title}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        document.querySelectorAll<HTMLElement>('[data-vt-hero]').forEach((el) => { el.style.viewTransitionName = ''; });
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.viewTransitionName = 'program-hero';
      }}
    >
      <img data-vt-hero src={p.hero} alt={p.title} className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
    </Link>
  );
}

/**
 * Catalogue des programmes, deux présentations :
 * - « grid » (défaut, page /programmes) : cartes verticales en grille régulière ;
 * - « row » (accueil) : liste horizontale, une rangée par programme avec la
 *   photo alternant gauche/droite (zigzag éditorial), entrée en cascade.
 * La transition de vue vers la page détail est conservée dans les deux cas.
 */
export function ProgramCards({ programs, layout = 'grid' }: { programs: Program[]; layout?: 'grid' | 'row' }) {
  const { t } = useLang();
  if (layout === 'row') {
    return (
      <div className="grid gap-10 lg:gap-12">
        {programs.map((p, i) => (
          <Reveal key={p.slug} delay={i * 100}>
            <article className="group grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
              {p.hero && (
                <div className={`relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg border border-border bg-card ${i % 2 ? 'md:order-2' : ''}`}>
                  <HeroLink p={p} className="block h-full w-full" />
                </div>
              )}
              <div className={p.hero && i % 2 ? 'md:order-1' : p.hero ? '' : 'md:col-span-2'}>
                <span className="eyebrow">{p.eyebrow}</span>
                <h3 className="mt-3 text-2xl lg:text-3xl font-bold break-words">
                  <Link to="/programmes/$slug" params={{ slug: p.slug }} className="py-1 -my-1">{p.title}</Link>
                </h3>
                <p className="mt-3 text-muted-foreground break-words">{p.tagline}</p>
                <Link to="/programmes/$slug" params={{ slug: p.slug }} className="mt-5 inline-flex items-center gap-2 py-2 -my-2 text-sm font-semibold text-primary">
                  {t('programs.discover')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    );
  }
  return <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{programs.map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full [&>.reveal-inner]:h-full"><article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
  {p.hero&&<HeroLink p={p} className="relative block aspect-[16/10] overflow-hidden"/>}
  <div className="flex flex-1 flex-col p-6 lg:p-8"><span className="eyebrow">{p.eyebrow}</span><h2 className="mt-3 text-2xl font-bold break-words"><Link to="/programmes/$slug" params={{slug:p.slug}} className="py-1 -my-1">{p.title}</Link></h2><p className="mt-3 flex-1 text-muted-foreground break-words">{p.tagline}</p><Link to="/programmes/$slug" params={{slug:p.slug}} className="mt-6 inline-flex items-center gap-2 py-2 -my-2 text-sm font-semibold text-primary">{t('programs.discover')}<ArrowUpRight className="h-4 w-4"/></Link></div>
 </article></Reveal>)}</div>;
}
