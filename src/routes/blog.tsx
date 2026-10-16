import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchPublishedPosts } from "@/lib/cms";
import type { BlogPost } from "@/data/blog-posts";
import { PageHero } from "@/components/PageHero";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { POSTS, CATEGORIES, type BlogCategory } from "@/data/blog-posts";
import { loadPosts } from '@/lib/site.functions';

const SITE_URL = "https://greenivory-reborn.lovable.app";

export const Route = createFileRoute("/blog")({
  loader: () => loadPosts(),
  head: () => ({
    meta: [
      { title: "Blog — Green Ivory | Pollution plastique, biodiversité, climat" },
      { name: "description", content: "Articles, décryptages et conseils éco-responsables sur la pollution plastique, la biodiversité et le climat en Côte d'Ivoire." },
      { property: "og:title", content: "Blog Green Ivory" },
      { property: "og:description", content: "Articles et décryptages sur l'environnement en Côte d'Ivoire." },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
  component: Blog,
});

function Blog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BlogCategory | "Tous">("Tous");
  const {posts:dbPosts,imported}=Route.useLoaderData();
  const categories=[...new Set([...CATEGORIES,...dbPosts.map(p=>p.category)])];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...dbPosts, ...(imported?[]:POSTS.filter((p) => !dbPosts.some((d) => d.slug === p.slug)))].filter((p) => (category === "Tous" ? true : p.category === category))
      .filter((p) =>
        !q
          ? true
          : p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.content.join(" ").toLowerCase().includes(q),
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [query, category, dbPosts,imported]);

  return (
    <>
      <PageHero
        eyebrow="Notre blog"
        title="Articles, décryptages, et engagement."
        intro="Découvrez des articles passionnants sur l'environnement, la lutte contre la pollution plastique, la biodiversité et le climat."
      />

      <section className="container-x pt-10 pb-4">
        <div className="bento p-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un article…"
              aria-label="Rechercher un article"
              className="w-full rounded-full border border-input bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Tous", ...categories]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c as BlogCategory | "Tous")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-foreground hover:bg-accent/70"
                }`}
              >
                <Tag className="h-3 w-3" />
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-10">
        {filtered.length === 0 ? (
          <div className="bento p-10 text-center text-muted-foreground">
            Aucun article ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <article key={p.slug} className="bento group flex flex-col overflow-hidden">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="block h-56 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {p.dateLabel}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> {p.author}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {p.category}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-tight">
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground flex-1">{p.excerpt}</p>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                  >
                    Lire l'article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
