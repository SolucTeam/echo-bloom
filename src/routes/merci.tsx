import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { useSetting } from '@/components/ManagedSite';
import { readContact } from '@/lib/form-settings';

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://greenivory-reborn.lovable.app";

export const Route = createFileRoute("/merci")({
  head: () => ({
    meta: [
      { title: "Message reçu — Merci ! | Green Ivory" },
      { name: "description", content: "Merci de nous avoir écrit. L'équipe Green Ivory revient vers vous dans les 48 heures." },
      { property: "og:title", content: "Merci pour votre message — Green Ivory" },
      { property: "og:description", content: "Votre message a bien été reçu. Nous vous répondons sous 48h." },
      { property: "og:url", content: `${SITE_URL}/merci` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/merci` }],
  }),
  component: ThankYou,
});

function ThankYou() {
  const config=readContact(useSetting('site.contact'));
  return (
    <section className="container-x py-24 lg:py-32">
      <div className="bento p-10 lg:p-14 max-w-2xl mx-auto text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-3xl lg:text-4xl font-bold">Merci pour votre message !</h1>
        <p className="mt-4 text-muted-foreground">
          {config.successMessage}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-ghost">Retour à l'accueil</Link>
          <Link to="/blog" className="btn-primary">
            Découvrir nos articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid sm:grid-cols-3 gap-3 text-sm">
          <Link to="/projets/journees-sans-plastique" className="bento p-4 hover:bg-accent transition">Journées sans Plastique</Link>
          <Link to="/projets/sentiers-verts" className="bento p-4 hover:bg-accent transition">Sentiers Verts</Link>
          <Link to="/devenir-benevole" className="bento p-4 hover:bg-accent transition">Devenir bénévole</Link>
        </div>
      </div>
    </section>
  );
}