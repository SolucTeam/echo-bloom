import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/devenir-benevole")({
  head: () => ({
    meta: [
      { title: "Devenir bénévole — Green Ivory" },
      { name: "description", content: "Rejoignez la communauté des bénévoles Green Ivory et passez à l’action pour l’environnement en Côte d’Ivoire." },
    ],
  }),
  component: Volunteer,
});

function Volunteer() {
  const [sent, setSent] = useState(false);
  const missions = [
    "Nettoyages de plages et opérations de dépollution",
    "Sensibilisation dans les écoles et quartiers",
    "Reboisement et entretien d’espaces verts",
    "Logistique d’événements éco-responsables",
    "Communication et création de contenu",
  ];
  return (
    <>
      <PageHero
        eyebrow="Devenir bénévole"
        title="Voulez-vous rejoindre notre équipe ?"
        intro="Envie d’agir pour l’environnement ? Rejoignez Green Ivory et participez à nos missions. Chaque geste compte."
      />
      <section className="container-x py-16 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl font-bold">Vos missions possibles</h2>
          <ul className="mt-6 space-y-3">
            {missions.map((m) => (
              <li key={m} className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" /> {m}</li>
            ))}
          </ul>
        </div>
        <form
          className="bento p-8 grid sm:grid-cols-2 gap-4"
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        >
          <h3 className="sm:col-span-2 text-2xl font-bold">Inscription bénévole</h3>
          <Field label="Nom complet" required />
          <Field label="E-mail" type="email" required />
          <Field label="Téléphone" />
          <Field label="Ville" />
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Pourquoi voulez-vous nous rejoindre ?</label>
            <textarea rows={5} className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="sm:col-span-2 btn-primary justify-center">Je m’inscris</button>
          {sent && <p className="sm:col-span-2 text-sm text-secondary font-medium">Merci ! Nous reviendrons vers vous très vite.</p>}
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
