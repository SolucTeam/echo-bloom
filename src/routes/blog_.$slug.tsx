import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { useLang } from "@/components/Language";
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Clock, ChevronRight } from "lucide-react";
import { getPostBySlug, getRelatedPosts, type BlogPost } from "@/data/blog-posts";
import { localizedBlogPost } from "@/data/blog-posts";
import { loadPosts } from '@/lib/site.functions';

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://green-ivory-tan.vercel.app";

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
        /* Phase 3 bilingue : version anglaise optionnelle, appliquée côté client par Language.tsx. */
        ...(post.titleEn?.trim()?[{ name: "x-title-en", content: `${post.titleEn.trim()} — Blog Green Ivory` }]:[]),
        ...(post.excerptEn?.trim()?[{ name: "x-description-en", content: post.excerptEn.trim() }]:[]),
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
  notFoundComponent: () => {
    const { t } = useLang();
    return (
    <div className="container-x py-32 text-center">
      <h1 className="text-3xl font-bold">{t('blog.notFoundTitle')}</h1>
      <p className="mt-3 text-muted-foreground">
        {t('blog.notFoundText')}
      </p>
      <Link to="/actualites" search={{ vue: 'articles' }} className="btn-primary mt-6 inline-flex">
        <ArrowLeft className="h-4 w-4" /> {t('blog.backNews')}
      </Link>
    </div>
    );
  },
  errorComponent: ({ error }) => {
    const { t } = useLang();
    return (
    <div className="container-x py-32 text-center">
      <h1 className="text-2xl font-bold">{t('blog.errorTitle')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      <Link to="/actualites" search={{ vue: 'articles' }} className="btn-primary mt-6 inline-flex">
        <ArrowLeft className="h-4 w-4" /> {t('blog.backNews')}
      </Link>
    </div>
    );
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { post, related } = Route.useLoaderData();
  const { t, lang } = useLang();
  // Vue localisée (phase 2 bilingue) : champs EN renseignés, sinon repli français.
  const L = localizedBlogPost(post, lang);
  const others = related.map((r) => localizedBlogPost(r, lang));

  return (
    <>
      <PageHero eyebrow={L.category} title={L.title} intro={L.excerpt} />

      <article className="container-x py-10 lg:py-14 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {/* Fil d'Ariane : chemin clair depuis l'accueil jusqu'à l'article */}
          <nav aria-label={t('blog.breadcrumbAria')} className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/actualites" search={{ vue: 'articles' }} className="hover:text-primary">{t('nav.news')}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="max-w-xs truncate font-medium text-foreground sm:max-w-md">{L.title}</span>
          </nav>

          <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {L.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" /> {L.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {L.readingTime} {t('blog.readTime')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
              <Tag className="h-3 w-3" /> {L.category}
            </span>
          </div>

          <div className="mt-8 rounded-3xl overflow-hidden">
            <img src={L.image} alt={L.title} className="w-full h-auto object-cover" />
          </div>

          <div className="prose prose-lg max-w-none mt-10 space-y-6 text-base lg:text-lg leading-relaxed text-foreground/90">
            {'html' in L && typeof L.html==='string'?<div className="cms-editor" dangerouslySetInnerHTML={{__html:L.html}}/>:L.content.map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/actualites" search={{ vue: 'articles' }} className="btn-ghost">
              <ArrowLeft className="h-4 w-4" /> {t('blog.allNews')}
            </Link>
            <Link to="/devenir-benevole" className="btn-primary">
              {t('nav.volunteer')} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/devenir-partenaire" className="btn-ghost">
              {t('blog.supportProgram')}
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bento p-6 bg-accent border-0">
            <h3 className="font-semibold text-lg">{t('blog.actTitle')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('blog.actText')}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/devenir-benevole" className="btn-primary w-full justify-center">{t('blog.volunteer')}</Link>
              <Link to="/devenir-partenaire" className="btn-ghost w-full justify-center">{t('blog.partner')}</Link>
            </div>
          </div>

          <div className="bento p-6">
            <h3 className="font-semibold text-lg">{t('blog.alsoRead')}</h3>
            <ul className="mt-4 space-y-4">
              {others.map((r: BlogPost) => (
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