import { pageHead, useSetting } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { readHomeStats, DEFAULT_HOME_BIGSTATS } from '@/data/home';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { DEFAULT_DONATIONS } from '@/data/donations';
import { Button } from '@/components/ui/button';
import { ImpactTree } from '@/components/ImpactTree';
import { leafBurst } from '@/components/leafCelebration';
import { useLang } from '@/components/Language';
import { useRef, useState } from 'react';
import { ArrowUpRight, GraduationCap, Globe, Handshake, Heart, Sprout, Waves } from 'lucide-react';

export const Route = createFileRoute("/faire-un-don")({
  loader: async () => ({ cmsPage: await loadPage({ data: '/faire-un-don' }) }),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Faire un don — Green Ivory', 'Soutenez les collectes de Green Ivory : dépollution des plages, reboisement, éducation environnementale. Chaque don finance une action de terrain.', '/faire-un-don', { title: 'Donate — Green Ivory', description: 'Support Green Ivory collections: beach clean-ups, tree planting, environmental education. Every donation funds action on the ground.' }),
  component: Donations,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function hostnameOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

const IMPACTS = [
  { icon: Waves, key: 'donate.impactCleanup' },
  { icon: Sprout, key: 'donate.impactTrees' },
  { icon: GraduationCap, key: 'donate.impactEducation' },
] as const;

// Paliers illustratifs de l'arbre d'impact (FCFA) : chaque palier fait pousser un peu plus l'arbre.
const TREE_PRESETS = [
  { amount: '5 000 F', growth: 0.25 },
  { amount: '25 000 F', growth: 0.55 },
  { amount: '100 000 F', growth: 0.8 },
  { amount: '250 000 F', growth: 1 },
];

function Donations() {
  const { t } = useLang();
  const donationsValue = useSetting('site.donations');
  let donations: { label: string; url: string }[] = [];
  try { const parsed = JSON.parse(donationsValue || 'null'); if (Array.isArray(parsed)) donations = parsed.filter((d): d is { label: string; url: string } => !!d && !!d.label && !!d.url); } catch {}
  if (donations.length === 0) donations = DEFAULT_DONATIONS;
  // Chiffres clés éditables dans la console (même source que la page d'accueil), repli sur les originaux.
  const impactStats = readHomeStats(useSetting('home.bigstats'), DEFAULT_HOME_BIGSTATS);
  const [treePreset, setTreePreset] = useState(1);
  const treeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PageHero
        eyebrow={t('partner.eyebrow')}
        title={t('nav.donate')}
        intro={t('donate.intro')}
      />

      <section className="container-x py-6 lg:py-10" data-donation-collections>
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-primary text-sm font-semibold">
            <Heart className="size-5" aria-hidden="true" />
            {t('donate.gestureImpact')}
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">{t('donate.pickTitle')}</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            {t('donate.pickIntro')}
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          {IMPACTS.map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-3 rounded-lg border bg-accent/40 px-4 py-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">{t(key)}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 bento p-6 lg:p-8 bg-accent border-0" data-impact-stats>
          <p className="eyebrow">{t('donate.statsEyebrow')}</p>
          <dl className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-sm text-foreground/70">{s.label}</dt>
                <dd className="order-1 text-2xl lg:text-3xl font-bold text-primary tracking-tight"><AnimatedNumber value={s.value} /></dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Votre don fait grandir une forêt — arbre réactif au palier choisi */}
        <div className="mt-10 bento p-8 lg:p-10 bg-accent border-0" data-impact-tree>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="eyebrow">{t('donate.treeEyebrow')}</span>
              <h2 className="mt-4 text-3xl lg:text-4xl font-bold tracking-tight">{t('donate.treeTitle')}</h2>
              <p className="mt-4 text-muted-foreground max-w-md">
                {t('donate.treeText')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label={t('donate.tierAria')}>
                {TREE_PRESETS.map((p, i) => (
                  <Button
                    key={p.amount}
                    variant={treePreset === i ? 'default' : 'outline'}
                    aria-pressed={treePreset === i}
                    onClick={() => {
                      setTreePreset(i);
                      const rect = treeRef.current?.getBoundingClientRect();
                      if (rect) leafBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.35, 12);
                    }}
                  >
                    {p.amount}
                  </Button>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {t('donate.selectedTier')} <span className="font-semibold text-primary">{TREE_PRESETS[treePreset].amount}</span> {t('donate.selectedTierTail')}
              </p>
            </div>
            <div ref={treeRef} className="flex justify-center">
              <ImpactTree growth={TREE_PRESETS[treePreset].growth} className="h-64 w-auto lg:h-72" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {donations.map((d, i) => (
            <article
              key={`${d.url}-${i}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border bg-card p-7 sm:p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="pointer-events-none absolute right-6 top-4 select-none text-6xl font-bold tracking-tight text-primary/10" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="eyebrow">{t('donate.collection', { n: String(i + 1).padStart(2, '0') })}</span>
              <h3 className="mt-3 max-w-[80%] text-2xl font-bold tracking-tight break-words transition-colors group-hover:text-primary">{d.label}</h3>
              {hostnameOf(d.url) && (
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="break-all">{hostnameOf(d.url)}</span>
                </p>
              )}
              <Button asChild className="mt-6 h-auto min-h-11 w-full justify-between whitespace-normal text-left py-3">
                <a href={d.url} target="_blank" rel="noopener noreferrer" aria-label={t('donate.contributeAria', { label: d.label })} onClick={(e) => leafBurst(e.clientX, e.clientY)}>
                  <span>{t('donate.contribute')}</span>
                  <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x pb-16 lg:pb-24">
        <div className="bento p-8 lg:p-10 bg-primary border-0 text-primary-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                <Handshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight">{t('donate.companyTitle')}</h2>
                <p className="mt-2 text-sm text-primary-foreground/80 max-w-xl">{t('donate.companyText')}</p>
              </div>
            </div>
            <Link
              to="/devenir-partenaire"
              className="shrink-0 rounded-full bg-background text-primary px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
            >
              {t('nav.partner')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
