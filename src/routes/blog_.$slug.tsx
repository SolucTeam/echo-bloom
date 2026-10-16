import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Clock } from "lucide-react";
import { getPostBySlug, getRelatedPosts, type BlogPost } from "@/data/blog-posts";
import { loadPosts } from '@/lib/site.functions';

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://greenivory-reborn.lovable.app";

export const Route = createFileRoute("/blog_/$slug")({
  loader: async ({ params }) => {
    const {posts,imported}=await loadPosts();
    const post=posts.find(p=>p.slug===params.slug) ?? (imported?undefined:getPostBySlug(params.slug));
    if (!post) throw notFound();
    return { post, related: imported?posts.filter(p=>p.slug!==params.slug).slice(0,3):getRelatedPosts(params.slug,3) };
  },
  head: ({ params, loaderData }) => {
    const post = loaderData?.post;
    const url = `${SITE_URL}/blog/${params.slug}`;
    if (!post) {
      return {
        meta: [{ title: "Article introuvable — Green Ivory" },{name:'description',content:'Cet article Green Ivory n’est pas disponible.'},{property:'og:title',content:'Article introuvable — Green Ivory'},{property:'og:description',content:'Cet article n’est pas disponible.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex'}],
      };
    }
    return {
      meta: [
        { title: `${post.title} — Blog Green Ivory` },
        { name: "description", content: post.excerpt },
        { name: "author", content: post.author },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(post.image.startsWith('https://')?[{property:'og:image',content:post.image},{name:'twitter:image',content:post.image}]:[]),
        { property: "article:published_time", content: post.date },
        { property: "article:section", content: post.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: [post.image],
            datePublished: post.date,
            author: { "@type": "Organization", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "Green Ivory",
              url: SITE_URL,
            },
            mainEntityOfPage: url,
            articleSection: post.category,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <h1 className="text-3xl font-bold">Article introuvable</h1>
      <p className="mt-3 text-muted-foreground">
        Cet article n'existe pas ou a été déplacé.
      </p>
      <Link to="/blog" className="btn-primary mt-6 inline-flex">
        <ArrowLeft className="h-4 w-4" /> Retour au blog
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-x py-32 text-center">
      <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
      <p className="mt-2 text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      <Link to="/blog" className="btn-primary mt-6 inline-flex">
        <ArrowLeft className="h-4 w-4" /> Retour au blog
      </Link>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { post, related } = Route.useLoaderData();

  return (
    <>
      <PageHero eyebrow={post.category} title={post.title} intro={post.excerpt} />

      <article className="container-x py-10 lg:py-14 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {post.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingTime} de lecture
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
              <Tag className="h-3 w-3" /> {post.category}
            </span>
          </div>

          <div className="mt-8 rounded-3xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
          </div>

          <div className="prose prose-lg max-w-none mt-10 space-y-6 text-base lg:text-lg leading-relaxed text-foreground/90">
            {'html' in post && typeof post.html==='string'?<div className="cms-editor" dangerouslySetInnerHTML={{__html:post.html}}/>:post.content.map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/blog" className="btn-ghost">
              <ArrowLeft className="h-4 w-4" /> Tous les articles
            </Link>
            <Link to="/devenir-benevole" className="btn-primary">
              Devenir bénévole <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/devenir-partenaire" className="btn-ghost">
              Soutenir un projet
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bento p-6 bg-accent border-0">
            <h3 className="font-semibold text-lg">Agissez avec nous</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Soutenez Green Ivory en rejoignant nos équipes de bénévoles ou en devenant partenaire.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/devenir-benevole" className="btn-primary w-full justify-center">Bénévole</Link>
              <Link to="/devenir-partenaire" className="btn-ghost w-full justify-center">Partenaire</Link>
            </div>
          </div>

          <div className="bento p-6">
            <h3 className="font-semibold text-lg">À lire aussi</h3>
            <ul className="mt-4 space-y-4">
              {related.map((r: BlogPost) => (
                <li key={r.slug} className="flex gap-3">
                  <Link to="/blog/$slug" params={{ slug: r.slug }} className="shrink-0">
                    <img src={r.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: r.slug }}
                      className="text-sm font-semibold leading-snug hover:text-primary line-clamp-2"
                    >
                      {r.title}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">{r.dateLabel}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </article>
    </>
  );
}