import { pageHead, useSetting } from '@/components/ManagedSite';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PartnerLogos } from '@/components/PartnerLogos';
import { DEFAULT_DONATIONS } from '@/data/donations';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Heart, Sprout } from 'lucide-react';

export const Route = createFileRoute("/devenir-partenaire")({
  loader:async()=>({cmsPage:await loadPage({data:'/devenir-partenaire'})}),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Devenir partenaire / Faire un don — Green Ivory', 'Soutenez Green Ivory en devenant partenaire ou en faisant un don. Ensemble, accélérons la transition écologique.', '/devenir-partenaire'),
  component: Partner,
});

function Partner() {
  const [sent, setSent] = useState(false);
  const donationsValue=useSetting('site.donations');
  let donations:{label:string,url:string}[]=[];
  try{const parsed=JSON.parse(donationsValue||'null');if(Array.isArray(parsed))donations=parsed.filter((d):d is {label:string,url:string}=>!!d&&!!d.label&&!!d.url);}catch{}
  if(donations.length===0)donations=DEFAULT_DONATIONS;
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
            {donations.map((d,i) => (
              <article key={`${d.url}-${i}`} className="rounded-lg bg-card text-card-foreground p-6 sm:p-7 flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-4 mb-5"><Heart className="size-6 text-secondary" aria-hidden="true" /><span className="text-xs text-muted-foreground">Collecte {String(i+1).padStart(2,'0')}</span></div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-normal break-words">{d.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground break-all">{(() => { try { return new URL(d.url).hostname.replace(/^www\./,''); } catch { return ''; } })()}</p>
                <Button asChild className="mt-6 h-auto min-h-11 w-full justify-between whitespace-normal text-left py-3">
                  <a href={d.url} target="_blank" rel="noopener noreferrer" aria-label={`Contribuer à ${d.label} (nouvel onglet)`}><span>Contribuer à cette collecte</span><ArrowUpRight aria-hidden="true" /></a>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x pt-12" data-partner-logos>
        <h2 className="text-2xl font-bold mb-6">Ils soutiennent nos actions</h2>
        <PartnerLogos />
      </section>
      <section className="container-x py-16 grid lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bento p-7">
            <h3 className="text-xl font-bold">Pourquoi nous rejoindre ?</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Donner un impact mesurable à votre engagement RSE.</li>
              <li>Soutenir l’éducation environnementale de la jeunesse ivoirienne.</li>
              <li>Co-construire des projets terrain (dépollution, reboisement, formation).</li>
              <li>Bénéficier d’une visibilité auprès d’une communauté engagée.</li>
            </ul>
          </div>
        </div>

        <form
          className="lg:col-span-3 bento p-8 grid sm:grid-cols-2 gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            const g = (k: string) => String(f.get(k) ?? "").trim().slice(0, 5000) || null;
            const name = [g("firstname"), g("lastname")].filter(Boolean).join(" ");
            const msg = [g("country") && `Pays : ${g("country")}`, g("message")].filter(Boolean).join("\n\n");
            const { error } = await supabase.from("applications").insert({ kind: "partenaire", name, email: g("email") ?? "", phone: g("phone"), organization: g("org"), message: msg || null });
            if (!error) { setSent(true); form.reset(); } else alert("Envoi impossible, réessayez.");
          }}
        >
          <h3 className="sm:col-span-2 text-2xl font-bold">Formulaire de partenariat</h3>
          <Field label="Nom" name="lastname" required />
          <Field label="Prénoms" name="firstname" required />
          <Field label="E-mail" name="email" type="email" required />
          <Field label="Téléphone" name="phone" />
          <Field label="Pays de résidence" name="country" />
          <Field label="Organisation" name="org" />
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Votre message</label>
            <textarea name="message" maxLength={5000} required rows={5} className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="sm:col-span-2 btn-primary justify-center">Envoyer ma demande</button>
          {sent && <p className="sm:col-span-2 text-sm text-secondary font-medium">Merci, nous vous recontactons rapidement.</p>}
        </form>
      </section>
    </>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...props} className="mt-2 w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
