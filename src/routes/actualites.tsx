import { pageHead, useSetting } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage, loadPosts, loadGallery } from '@/lib/site.functions';
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import type { BlogPost } from "@/data/blog-posts";
import { localizedBlogPost, localizedCategory } from "@/data/blog-posts";
import { PageHero } from "@/components/PageHero";
import { PressSection } from '@/components/PressSection';
import { EventsSection } from '@/components/EventsSection';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/components/Language';
import { Calendar, User, ArrowRight, Search, Tag, ChevronLeft, ChevronRight, X, Camera, Megaphone, CalendarDays } from "lucide-react";
import { POSTS, CATEGORIES, type BlogCategory } from "@/data/blog-posts";
import { readPress } from '@/lib/press-schema';
import { readEvents } from '@/lib/event-schema';
import { galleryCollections, galleryThumb, type GalleryImage } from '@/lib/gallery';
import { Button } from '@/components/ui/button';
import journees from "@/assets/journees.jpg";
import sentiers from "@/assets/sentiers.jpg";
import plastic from "@/assets/plastic.jpg";
import biodiv from "@/assets/biodiversity.jpg";
import climate from "@/assets/climate.jpg";
import depollution from "@/assets/depollution.jpg";

const TABS = [
  { id: 'articles', label: 'tab.articles', icon: Tag },
  { id: 'galerie', label: 'tab.photos', icon: Camera },
  { id: 'presse', label: 'tab.press', icon: Megaphone },
  { id: 'evenements', label: 'tab.events', icon: CalendarDays },
] as const;

type NewsTab = (typeof TABS)[number]['id'];

export const Route = createFileRoute("/actualites")({
  validateSearch: (search: Record<string, unknown>): { vue: NewsTab } => ({
    vue: TABS.some((t) => t.id === search.vue) ? (search.vue as NewsTab) : "articles",
  }),
  loader: async () => {
    const [posts, gallery, cmsPage] = await Promise.all([loadPosts(), loadGallery(), loadPage({ data: '/actualites' })]);
    return { posts: posts.posts, postsImported: posts.imported, photos: gallery.photos, galleryImported: gallery.imported, cmsPage };
  },
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Actualités — Green Ivory', "Toute l'actualité de Green Ivory : articles, photos, communiqués de presse et événements à venir.", '/actualites', { title: 'News — Green Ivory', description: 'All the latest news from Green Ivory: articles, photos, press releases and upcoming events.' }),
  component: Actualites,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

const collections = [
  {
    title: "Journées sans plastique",
    tags: ["Tous", "Journées de dépollution", "Agents de collecte"],
    images: [
      { src: depollution, tag: "Journées de dépollution" },
      { src: journees, tag: "Agents de collecte" },
      { src: plastic, tag: "Journées de dépollution" },
    ],
  },
  {
    title: "Sentiers verts",
    tags: ["Tous", "Éco-entrepreneurs", "Visites de terrain"],
    images: [
      { src: sentiers, tag: "Éco-entrepreneurs" },
      { src: biodiv, tag: "Visites de terrain" },
      { src: climate, tag: "Visites de terrain" },
    ],
  },
];

function Actualites() {
  const { vue } = Route.useSearch();
  const { t, lang } = useLang();
  const { posts, postsImported, photos, galleryImported } = Route.useLoaderData();
  // Vue localisée de la galerie (phase 2 bilingue) : catégorie EN renseignée, sinon catégorie française.
  const localizedPhotos = lang === 'en' ? photos.map((p) => (p.tag_en?.trim() ? { ...p, tag: p.tag_en } : p)) : photos;
  const cols = useMemo(() => galleryCollections(collections, localizedPhotos, galleryImported), [localizedPhotos, galleryImported]);
  const pressItems = readPress(useSetting('site.press'));
  const eventItems = readEvents(useSetting('site.events'));
  const articleCount = [...posts, ...(postsImported ? [] : POSTS.filter((p) => !posts.some((d) => d.slug === p.slug)))].length;
  const counts: Record<NewsTab, number> = {
    articles: articleCount,
    galerie: cols.reduce((n, c) => n + c.images.length, 0),
    presse: pressItems.length,
    evenements: eventItems.length,
  };

  // Changer de section ramène au début du contenu (jamais au premier affichage de la page).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const el = document.getElementById('actualites-contenu');
    if (el) el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }, [vue]);

  return (
    <>
      <PageHero
        eyebrow={t('news.eyebrow')}
        title={t('news.title')}
        intro={t('news.intro')}
      />

      {/* Navigation des sections — barre collante sous l'en-tête, avec compteurs, toujours accessible au défilement */}
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <nav className="container-x flex items-center gap-1.5 overflow-x-auto py-2.5" role="tablist" aria-label={t('news.sectionsAria')}>
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = vue === id;
            return (
              <Link
                key={id}
                to="/actualites"
                search={{ vue: id }}
                role="tab"
                aria-selected={active}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(label)}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-accent text-primary'}`}>
                  {counts[id]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div id="actualites-contenu" className="scroll-mt-36">
        {vue === 'articles' && <ArticlesSection posts={posts} imported={postsImported} />}
        {vue === 'galerie' && <GallerySection cols={cols} />}
        {vue === 'presse' && <PressSection />}
        {vue === 'evenements' && <EventsSection />}
      </div>
    </>
  );
}

/* ── Onglet Articles ── */
function ArticlesSection({ posts: dbPosts, imported }: { posts: BlogPost[]; imported: boolean }) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BlogCategory | "Tous">("Tous");
  const categories = [...new Set([...CATEGORIES, ...dbPosts.map((p) => p.category)])];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Vue localisée (phase 2 bilingue) : champs EN renseignés, sinon repli français.
    return [...dbPosts, ...(imported ? [] : POSTS.filter((p) => !dbPosts.some((d) => d.slug === p.slug)))]
      .map((p) => localizedBlogPost(p, lang))
      .filter((p) => (category === "Tous" ? true : p.category === category))
      .filter((p) =>
        !q
          ? true
          : p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.content.join(" ").toLowerCase().includes(q),
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [query, category, dbPosts, imported, lang]);

  return (
    <>
      {/* Recherche et filtres par catégorie, en fila aérienne au-dessus de la liste */}
      <section className="container-x pt-8 pb-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('news.searchPlaceholder')}
              aria-label={t('news.searchAria')}
              className="w-full rounded-full border border-input bg-background pl-11 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Tous", ...categories]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c as BlogCategory | "Tous")}
                className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold transition ${
                  category === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-foreground hover:bg-accent/70"
                }`}
              >
                {c === "Tous" ? t('common.all') : localizedCategory(c, lang)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-8 lg:py-10">
        {!filtered[0] ? (
          <div className="bento p-10 text-center text-muted-foreground">
            {t('news.noResults')}
          </div>
        ) : (
          <div className="space-y-10">
            {/* À la une — l'article le plus récent de la sélection, en grand format éditorial */}
            <Reveal>
              <article className="bento group grid overflow-hidden lg:grid-cols-2">
                <div className="relative h-64 sm:h-72 lg:h-full lg:min-h-[400px] overflow-hidden">
                  <Link to="/blog/$slug" params={{ slug: filtered[0].slug }} className="block h-full w-full">
                    <img
                      src={filtered[0].image}
                      alt={filtered[0].title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm">
                    {t('news.featured')}
                  </span>
                </div>
                <div className="flex flex-col p-7 lg:p-10">
                  <span className="eyebrow">{localizedCategory(filtered[0].category, lang)}</span>
                  <h2 className="mt-4 text-2xl lg:text-3xl font-bold leading-tight break-words">
                    <Link to="/blog/$slug" params={{ slug: filtered[0].slug }} className="hover:text-primary">
                      {filtered[0].title}
                    </Link>
                  </h2>
                  <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{filtered[0].excerpt}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {filtered[0].dateLabel}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> {filtered[0].author}
                    </span>
                  </div>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: filtered[0].slug }}
                    className="mt-6 inline-flex w-fit items-center gap-2 py-1 -my-1 text-sm font-semibold text-primary"
                  >
                    {t('news.readArticle')} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>

            {filtered.length > 1 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.slice(1).map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full [&>.reveal-inner]:h-full">
                    <article className="bento group flex h-full flex-col overflow-hidden">
                      <div className="relative h-52 overflow-hidden">
                        <Link to="/blog/$slug" params={{ slug: p.slug }} className="block h-full w-full">
                          <img
                            src={p.image}
                            alt={p.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Link>
                        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm">
                          {localizedCategory(p.category, lang)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> {p.dateLabel}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3.5 w-3.5" /> {p.author}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-bold leading-snug">
                          <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary">
                            {p.title}
                          </Link>
                        </h3>
                        <p className="mt-2.5 line-clamp-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                        <Link
                          to="/blog/$slug"
                          params={{ slug: p.slug }}
                          className="mt-4 inline-flex items-center gap-1 py-1 -my-1 text-sm font-semibold text-primary"
                        >
                          {t('news.readArticle')} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

/* ── Onglet Photos ── */
const GALLERY_PAGE = 24;

/** Galerie unifiée : filtres par collection et par thème, maçonnerie légère (vignettes), aperçu plein écran et pagination. */
function GallerySection({ cols }: { cols: ReturnType<typeof galleryCollections> }) {
  const { t, lang } = useLang();
  const [col, setCol] = useState('Tous');
  const [tag, setTag] = useState('Tous');
  const [limit, setLimit] = useState(GALLERY_PAGE);
  const [open, setOpen] = useState<number | null>(null);

  const all = useMemo(() => cols.flatMap((c) => c.images.map((img) => ({ ...img, collection: c.title }))), [cols]);
  const tags = useMemo(() => {
    const pool = col === 'Tous' ? all : all.filter((i) => i.collection === col);
    return ['Tous', ...new Set(pool.map((i) => i.tag).filter((x) => x && x !== 'Tous'))];
  }, [all, col]);
  const filtered = useMemo(() => all.filter((i) => (col === 'Tous' || i.collection === col) && (tag === 'Tous' || i.tag === tag)), [all, col, tag]);
  const shown = filtered.slice(0, limit);

  // Échap ferme l'aperçu, ←/→ passent d'une photo à l'autre, et le défilement est verrouillé tant qu'il est ouvert.
  useEffect(() => {
    if (open === null) return;
    const count = filtered.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight" && count > 1) setOpen((o) => (o === null ? o : (o + 1) % count));
      else if (e.key === "ArrowLeft" && count > 1) setOpen((o) => (o === null ? o : (o - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open, filtered.length]);

  if (cols.length === 0) {
    return (
      <section className="container-x py-16">
        <p className="text-center text-muted-foreground">{t('gallery.empty')}</p>
      </section>
    );
  }

  const pickCol = (name: string) => { setCol(name); setTag('Tous'); setLimit(GALLERY_PAGE); setOpen(null); };

  return (
    <section className="container-x py-14 lg:py-16">
      <Reveal>
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold">{t('gallery.heading')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{all.length} {t('gallery.photo')}{all.length > 1 ? 's' : ''}</p>
        </div>
      </Reveal>

      {/* Collections : un filtre par programme, avec le nombre de photos */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          variant="outline"
          aria-pressed={col === 'Tous'}
          onClick={() => pickCol('Tous')}
          className={`rounded-full px-4 py-2.5 text-xs font-semibold border transition ${
            col === 'Tous' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-accent'
          }`}
        >
          {t('gallery.allCollections')}
        </Button>
        {cols.map((c) => (
          <Button
            key={c.title}
            variant="outline"
            aria-pressed={col === c.title}
            onClick={() => pickCol(c.title)}
            className={`rounded-full px-4 py-2.5 text-xs font-semibold border transition ${
              col === c.title ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-accent'
            }`}
          >
            {localizedCollectionTitle(c.title, lang)}
            <span className="ml-1.5 text-[10px] font-normal opacity-70">{c.images.length}</span>
          </Button>
        ))}
      </div>

      {/* Thèmes : affinage par activité au sein de la sélection courante */}
      {tags.length > 2 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tg) => (
            <button
              key={tg}
              type="button"
              aria-pressed={tag === tg}
              onClick={() => { setTag(tg); setLimit(GALLERY_PAGE); setOpen(null); }}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                tag === tg ? 'border-primary bg-accent font-semibold text-primary' : 'border-border text-muted-foreground hover:bg-accent/60'
              }`}
            >
              {tg === 'Tous' ? t('gallery.allThemes') : tg}
            </button>
          ))}
        </div>
      )}

      {/* Maçonnerie : hauteurs naturelles (pas de recadrage), vignettes légères, aperçu plein écran au clic */}
      <div className="mt-8 columns-2 gap-4 md:columns-3 xl:columns-4">
        {shown.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={t('gallery.enlarge', { img: img.alt || img.tag })}
            className="bento group relative mb-4 block w-full cursor-zoom-in overflow-hidden break-inside-avoid focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <img src={galleryThumb(img.src)} alt={img.alt || img.tag} loading="lazy" className="w-full transition duration-500 group-hover:scale-105" />
            {img.caption && <span className="absolute inset-x-0 bottom-0 line-clamp-2 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs text-white">{img.caption}</span>}
          </button>
        ))}
      </div>

      {filtered.length > shown.length && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => setLimit((l) => l + GALLERY_PAGE)} className="rounded-full px-6 py-3 text-sm font-semibold">
            {t('gallery.showMore')} (+{Math.min(GALLERY_PAGE, filtered.length - shown.length)})
          </Button>
        </div>
      )}

      {open !== null && <Lightbox images={filtered} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />}
    </section>
  );
}

/** Titres anglais des collections d'origine (bilingue) ; collection inconnue → titre affiché tel quel. */
const COLLECTION_EN: Record<string, string> = {
  'Journées sans plastique': 'Plastic-Free Days',
  'Sentiers verts': 'Green Trails',
  'Plaidoyer environnemental': 'Environmental advocacy',
  'We Plant': 'We Plant',
  'Green Schools': 'Green Schools',
};
function localizedCollectionTitle(title: string, lang: string): string {
  if (lang !== 'en') return title;
  return COLLECTION_EN[title] ?? title;
}

/* Aperçu plein écran : taille réelle (sans recadrage), fermeture ✕/Échap/clic dehors, navigation ‹ › */
function Lightbox({ images, index, onClose, onNavigate }: { images: GalleryImage[]; index: number; onClose: () => void; onNavigate: (next: number) => void }) {
  const { t } = useLang();
  const img = images[index];
  if (!img) return null;
  const count = images.length;
  const go = (delta: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onNavigate((index + delta + count) % count);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={t('lightbox.openAria')}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        autoFocus
        aria-label={t('lightbox.close')}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={go(-1)}
            aria-label={t('lightbox.prev')}
            className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={go(1)}
            aria-label={t('lightbox.next')}
            className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <figure className="flex max-h-full flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <img
          src={img.src}
          alt={img.alt || img.tag}
          className="max-h-[76vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
        />
        <figcaption className="max-w-[80vw] text-center text-sm text-white/85">
          {img.caption || img.alt || img.tag}
          {count > 1 && <span className="mt-1 block text-xs text-white/60">{index + 1} / {count}</span>}
        </figcaption>
      </figure>
    </div>
  );
}
