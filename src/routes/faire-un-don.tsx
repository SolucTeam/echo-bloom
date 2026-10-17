import { pageHead, useSetting } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { DEFAULT_DONATIONS } from '@/data/donations';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, GraduationCap, Globe, Handshake, Heart, Sprout, Waves } from 'lucide-react';

export const Route = createFileRoute("/faire-un-don")({
  loader: async () => ({ cmsPage: await loadPage({ data: '/faire-un-don' }) }),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Faire un don — Green Ivory', 'Soutenez les collectes de Green Ivory : dépollution des plages, reboisement, éducation environnementale. Chaque don finance une action de terrain.', '/faire-un-don'),
  component: Donations,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function hostnameOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

const IMPACTS = [
  { icon: Waves, label: 'Dépollution des plages' },
  { icon: Sprout, label: 'Reboisement' },
  { icon: GraduationCap, label: 'Éducation environnementale' },
];

function Donations() {
  const donationsValue = useSetting('site.donations');
  let donations: { label: string; url: string }[] = [];
  try { const parsed = JSON.parse(donationsValue || 'null'); if (Array.isArray(parsed)) donations = parsed.filter((d): d is { label: string; url: string } => !!d && !!d.label && !!d.url); } catch {}
  if (donations.length === 0) donations = DEFAULT_DONATIONS;

  return (
    <>
      <PageHero
        eyebrow="Agir avec Green Ivory"
        title="Faire un don"
        intro="Soutenez les actions de Green Ivory en contribuant à une collecte. Ensemble, protégeons notre environnement."
      />

      <section className="container-x py-14 lg:py-20" data-donation-collections>
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-primary text-sm font-semibold">
            <Heart className="size-5" aria-hidden="true" />
            Un geste, un impact
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Soutenez une collecte qui vous tient à cœur.</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Dépollution des plages, reboisement, éducation environnementale : chaque contribution finance directement une action de terrain.
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          {IMPACTS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg border bg-accent/40 px-4 py-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
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
              <span className="eyebrow">Collecte {String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 max-w-[80%] text-2xl font-bold tracking-tight break-words transition-colors group-hover:text-primary">{d.label}</h3>
              {hostnameOf(d.url) && (
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="break-all">{hostnameOf(d.url)}</span>
                </p>
              )}
              <Button asChild className="mt-6 h-auto min-h-11 w-full justify-between whitespace-normal text-left py-3">
                <a href={d.url} target="_blank" rel="noopener noreferrer" aria-label={`Contribuer à ${d.label} (nouvel onglet)`}>
                  <span>Contribuer à cette collecte</span>
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
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Vous représentez une entreprise ou une institution ?</h2>
                <p className="mt-2 text-sm text-primary-foreground/80 max-w-xl">Devenez partenaire de Green Ivory et co-construisez des projets terrain avec nos équipes.</p>
              </div>
            </div>
            <Link
              to="/devenir-partenaire"
              className="shrink-0 rounded-full bg-background text-primary px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
            >
              Devenir partenaire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
