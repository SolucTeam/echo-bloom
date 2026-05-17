import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Calendar, User, ArrowRight } from "lucide-react";
import plastic from "@/assets/plastic.jpg";
import biodiv from "@/assets/biodiversity.jpg";
import climate from "@/assets/climate.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Green Ivory" },
      { name: "description", content: "Articles, décryptages et conseils éco-responsables sur la pollution plastique, la biodiversité et le climat en Côte d’Ivoire." },
      { property: "og:title", content: "Blog Green Ivory" },
    ],
  }),
  component: Blog,
});

const posts = [
  {
    title: "La pollution plastique en Côte d’Ivoire",
    excerpt: "Chiffres, causes et solutions concrètes pour réduire la pollution plastique sur nos littoraux.",
    date: "03 novembre 2024",
    author: "Green Ivory",
    image: plastic,
    slug: "la-pollution-plastique-en-cote-divoire",
  },
  {
    title: "La désertification en Côte d’Ivoire",
    excerpt: "Comprendre l’avancée de la désertification et les leviers d’action pour restaurer les sols.",
    date: "03 novembre 2024",
    author: "Green Ivory",
    image: climate,
    slug: "la-desertification-en-cote-divoire",
  },
  {
    title: "Protéger la biodiversité, un enjeu citoyen",
    excerpt: "Pourquoi la préservation de la biodiversité ivoirienne concerne chacun d’entre nous.",
    date: "12 octobre 2024",
    author: "Green Ivory",
    image: biodiv,
    slug: "proteger-la-biodiversite",
  },
];

function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Notre blog"
        title="Articles, décryptages, et engagement."
        intro="Découvrez des articles passionnants sur l’environnement, la lutte contre la pollution plastique, la biodiversité et le climat."
      />
      <section className="container-x py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.slug} className="bento group flex flex-col overflow-hidden">
            <div className="h-56 overflow-hidden">
              <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.date}</span>
                <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" /> {p.author}</span>
              </div>
              <h2 className="mt-3 text-xl font-bold leading-tight">{p.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground flex-1">{p.excerpt}</p>
              <Link to="/blog" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Lire l’article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
