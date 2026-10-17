import { pageHead, useSetting } from '@/components/ManagedSite';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { DEFAULT_DONATIONS } from '@/data/donations';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Handshake, Sprout } from 'lucide-react';

export const Route = createFileRoute("/faire-un-don")({
  loader: async () => ({ cmsPage: await loadPage({ data: '/faire-un-don' }) }),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Faire un don — Green Ivory', 'Soutenez les collectes de Green Ivory : dépollution des plages, reboisement, éducation environnementale. Chaque don finance une action de terrain.', '/faire-un-don'),
  component: Donations,
});

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
      <section className="bg-primary text-primary-foreground py-12 sm:py-16" data-donation-collections>
        <div className="container-x">
          <div className="flex items-center gap-2 text-leaf text-sm font-semibold"><Sprout className="size-5" aria-hidden="true" />Un geste, un impact</div>
          <div className="mt-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-normal">Soutenez une collecte qui vous tient à cœur.</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl">Dépollution des plages, reboisement, éducation environnementale : contribuons à un avenir plus durable.</p>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {donations.map((d, i) => (
              <article key={`${d.url}-${i}`} className="rounded-lg bg-card text-card-foreground p-6 sm:p-7 flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-4 mb-5"><span className="text-xs text-muted-foreground">Collecte {String(i + 1).padStart(2, '0')}</span></div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-normal break-words">{d.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground break-all">{(() => { try { return new URL(d.url).hostname.replace(/^www\./, ''); } catch { return ''; } })()}</p>
                <Button asChild className="mt-6 h-auto min-h-11 w-full justify-between whitespace-normal text-left py-3">
                  <a href={d.url} target="_blank" rel="noopener noreferrer" aria-label={`Contribuer à ${d.label} (nouvel onglet)`}><span>Contribuer à cette collecte</span><ArrowUpRight aria-hidden="true" /></a>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x py-16">
        <div className="bento p-8 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Handshake className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <h2 className="text-xl font-bold">Vous représentez une entreprise ou une institution ?</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">Devenez partenaire de Green Ivory et co-construisez des projets terrain avec nos équipes.</p>
            </div>
          </div>
          <Link to="/devenir-partenaire" className="btn-ghost shrink-0">Devenir partenaire</Link>
        </div>
      </section>
    </>
  );
}
