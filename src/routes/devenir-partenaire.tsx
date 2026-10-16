import { pageHead } from '@/components/ManagedSite';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/devenir-partenaire")({
  loader:async()=>({cmsPage:await loadPage({data:'/devenir-partenaire'})}),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Devenir partenaire / Faire un don — Green Ivory', 'Soutenez Green Ivory en devenant partenaire ou en faisant un don. Ensemble, accélérons la transition écologique.', '/devenir-partenaire'),
  component: Partner,
});

function Partner() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero
        eyebrow="Devenez partenaire"
        title="La sauvegarde de notre planète est l’affaire de tous."
        intro="Entreprises, institutions, ONG, collectivités… Rejoignez Green Ivory pour développer des solutions durables face aux défis environnementaux."
      />
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
          <div className="bento p-7 bg-primary text-primary-foreground border-0">
            <h3 className="text-xl font-bold">Faire un don</h3>
            <p className="mt-2 text-sm opacity-85">Chaque contribution finance directement nos actions de terrain.</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["10 €", "25 €", "50 €"].map((v) => (
                <button key={v} className="rounded-full bg-background/15 hover:bg-background/25 px-4 py-3 text-sm font-semibold transition">{v}</button>
              ))}
            </div>
            <button className="mt-4 w-full rounded-full bg-leaf text-primary px-5 py-3 text-sm font-semibold">Donner maintenant</button>
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
