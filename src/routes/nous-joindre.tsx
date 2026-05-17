import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/nous-joindre")({
  head: () => ({
    meta: [
      { title: "Contact — Green Ivory" },
      { name: "description", content: "Contactez Green Ivory : nos adresses, téléphones et formulaire pour échanger avec notre équipe." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Nos infos et contacts."
        intro="Par courriel ou par téléphone, vous pouvez nous joindre en tout temps. N’hésitez pas !"
      />

      <section className="container-x py-16 grid lg:grid-cols-3 gap-6">
        <InfoCard icon={<MapPin className="h-5 w-5" />} label="Notre adresse" lines={["Côte d’Ivoire", "Abidjan / Bingerville / Bassam"]} />
        <InfoCard icon={<Phone className="h-5 w-5" />} label="Nos contacts" lines={["+225 01 03 05 83 63"]} />
        <InfoCard icon={<Mail className="h-5 w-5" />} label="Nos emails" lines={["info@greenivory.com", "recrutement@greenivory.com"]} />
      </section>

      <section className="container-x py-10 lg:py-16 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold">Restons en contact</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Une question, un partenariat, une idée de projet ? Écrivez-nous —
            nous revenons vers vous sous 48h.
          </p>
          <div className="mt-8 bento p-6 bg-accent border-0">
            <h3 className="font-semibold text-lg">Devenir bénévole</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Envie d’agir pour l’environnement ? Rejoignez Green Ivory et participez
              activement à nos actions : nettoyages, sensibilisation, reboisement, événements éco-responsables.
            </p>
            <Link to="/devenir-benevole" className="mt-5 btn-primary"><ArrowRight className="h-4 w-4" /> Devenir bénévole</Link>
          </div>
        </div>

        <form
          className="bento p-7 space-y-4"
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        >
          <Field label="Email" name="email" type="email" required />
          <Field label="Objet" name="subject" required />
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea name="message" required rows={6} className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="btn-primary w-full justify-center">Soumettre</button>
          {sent && <p className="text-sm text-secondary font-medium">Merci, votre message a bien été envoyé.</p>}
        </form>
      </section>
    </>
  );
}

function InfoCard({ icon, label, lines }: { icon: React.ReactNode; label: string; lines: string[] }) {
  return (
    <div className="bento p-7">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">{icon}</span>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      {lines.map((l) => <div key={l} className="font-semibold">{l}</div>)}
    </div>
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
