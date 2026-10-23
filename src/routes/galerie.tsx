import { pageHead } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryCollections } from '@/lib/gallery';
import { Button } from '@/components/ui/button';
import { PageHero } from "@/components/PageHero";
import journees from "@/assets/journees.jpg";
import sentiers from "@/assets/sentiers.jpg";
import plastic from "@/assets/plastic.jpg";
import biodiv from "@/assets/biodiversity.jpg";
import climate from "@/assets/climate.jpg";
import hero from "@/assets/hero.jpg";
import { loadGallery } from '@/lib/site.functions';

export const Route = createFileRoute("/galerie")({
  loader:async()=>{const [content,cmsPage]=await Promise.all([loadGallery(),loadPage({data:'/galerie'})]);return {...content,cmsPage};},
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Galerie — Green Ivory', 'Photos et moments forts des actions de Green Ivory : dépollution, éco-ambassadeurs, agents de collecte, recyclage, formations.', '/galerie'),
  component: Gallery,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

const collections = [
  {
    title: "Journées sans plastique",
    tags: ["Tous", "Journées de dépollution", "Agents de collecte"],
    images: [
      { src: hero, tag: "Journées de dépollution" },
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

function Gallery() {
  const {photos:extra,imported}=Route.useLoaderData();
  const cols = galleryCollections(collections, extra, imported);
  return (
    <>
      <PageHero
        eyebrow="Notre galerie"
        title="Des images qui racontent nos actions."
        intro="Plongez au cœur des moments forts de Green Ivory : terrain, formations, plaidoyer et rencontres."
      />
      {cols.length===0?<section className="container-x py-16"><p className="text-center text-muted-foreground">Aucune photo pour le moment — revenez bientôt.</p></section>:cols.map((c) => (
        <Collection key={c.title} {...c} />
      ))}
    </>
  );
}

type GalleryImage = { src: string; tag: string; alt?: string; caption?: string };

/* Aperçu plein écran : taille réelle (sans recadrage), fermeture ✕/Échap/clic dehors, navigation ‹ › */
function Lightbox({ images, index, onClose, onNavigate }: { images: GalleryImage[]; index: number; onClose: () => void; onNavigate: (next: number) => void }) {
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
      aria-label="Aperçu de la photo en plein écran"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        autoFocus
        aria-label="Fermer l'aperçu"
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={go(-1)}
            aria-label="Photo précédente"
            className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={go(1)}
            aria-label="Photo suivante"
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

function Collection({ title, tags, images }: { title: string; tags: string[]; images: GalleryImage[] }) {
  const [active, setActive] = useState("Tous");
  const [open, setOpen] = useState<number | null>(null);
  const filtered = active === "Tous" ? images : images.filter((i) => i.tag === active);

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

  return (
    <section className="container-x py-16">
      <h2 className="text-3xl lg:text-4xl font-bold">{title}</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((t) => (
          <Button
            variant="outline"
            aria-pressed={active === t}
            key={t}
            onClick={() => { setActive(t); setOpen(null); }}
            className={`rounded-full px-4 py-2.5 text-xs font-semibold border transition ${
              active === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-accent"
            }`}
          >
            {t}
          </Button>
        ))}
      </div>
      {/* Grille uniforme : toutes les photos au même format carré, cliquables pour l'aperçu */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Agrandir la photo : ${img.alt || img.tag}`}
            className="bento group relative aspect-square overflow-hidden cursor-zoom-in focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <img src={img.src} alt={img.alt || img.tag} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            {img.caption && <span className="absolute inset-x-0 bottom-0 line-clamp-2 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs text-white">{img.caption}</span>}
          </button>
        ))}
      </div>
      {open !== null && <Lightbox images={filtered} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />}
    </section>
  );
}
