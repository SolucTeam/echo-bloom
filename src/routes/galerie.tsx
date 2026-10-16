import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import journees from "@/assets/journees.jpg";
import sentiers from "@/assets/sentiers.jpg";
import plastic from "@/assets/plastic.jpg";
import biodiv from "@/assets/biodiversity.jpg";
import climate from "@/assets/climate.jpg";
import hero from "@/assets/hero.jpg";
import { loadGallery } from '@/lib/site.functions';

export const Route = createFileRoute("/galerie")({
  loader:()=>loadGallery(),
  head: () => ({
    meta: [
      { title: "Galerie — Green Ivory" },
      { name: "description", content: "Photos et moments forts des actions de Green Ivory : dépollution, éco-ambassadeurs, agents de collecte, recyclage, formations." },
      { property: "og:title", content: "Galerie — Green Ivory" },
      { property: "og:description", content: "Photos et moments forts de nos actions sur le terrain." },
      { property: "og:url", content: "https://greenivory-reborn.lovable.app/galerie" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://greenivory-reborn.lovable.app/galerie" }],
  }),
  component: Gallery,
});

const collections = [
  {
    title: "Journées sans plastique",
    tags: ["Tous", "Journées de dépollution", "Éco-ambassadeurs", "Agents de collecte", "Recyclage", "Formation"],
    images: [
      { src: hero, tag: "Journées de dépollution" },
      { src: journees, tag: "Éco-ambassadeurs" },
      { src: plastic, tag: "Formation" },
      { src: hero, tag: "Recyclage" },
      { src: journees, tag: "Agents de collecte" },
      { src: plastic, tag: "Journées de dépollution" },
    ],
  },
  {
    title: "Sentiers verts",
    tags: ["Tous", "Journées carrières", "Éco-entrepreneurs", "Visites de terrain"],
    images: [
      { src: sentiers, tag: "Éco-entrepreneurs" },
      { src: biodiv, tag: "Visites de terrain" },
      { src: sentiers, tag: "Journées carrières" },
      { src: climate, tag: "Visites de terrain" },
      { src: sentiers, tag: "Éco-entrepreneurs" },
      { src: biodiv, tag: "Visites de terrain" },
    ],
  },
];

function Gallery() {
  const {photos:extra,imported}=Route.useLoaderData();
  const cols = imported?[...new Set(extra.map(p=>p.collection))].map(title=>({title,tags:['Tous',...new Set(extra.filter(p=>p.collection===title).map(p=>p.tag))],images:extra.filter(p=>p.collection===title).map(p=>({src:p.image_url,tag:p.tag,alt:p.alt,caption:p.caption}))})):collections.map((c) => ({
    ...c,
    images: [...extra.filter((e) => e.collection === c.title).map((e) => ({ src: e.image_url, tag: e.tag })), ...c.images],
  }));
  return (
    <>
      <PageHero
        eyebrow="Notre galerie"
        title="Des images qui racontent nos actions."
        intro="Plongez au cœur des moments forts de Green Ivory : terrain, formations, plaidoyer et rencontres."
      />
      {cols.map((c) => (
        <Collection key={c.title} {...c} />
      ))}
    </>
  );
}

function Collection({ title, tags, images }: { title: string; tags: string[]; images: { src: string; tag: string; alt?:string;caption?:string }[] }) {
  const [active, setActive] = useState("Tous");
  const filtered = active === "Tous" ? images : images.filter((i) => i.tag === active);
  return (
    <section className="container-x py-16">
      <h2 className="text-3xl lg:text-4xl font-bold">{title}</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-full px-4 py-2 text-xs font-semibold border transition ${
              active === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((img, i) => (
          <div key={i} className={`bento overflow-hidden ${i % 5 === 0 ? "md:row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}>
            <img src={img.src} alt={img.alt||img.tag} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition duration-500" />
            {img.caption&&<p className="p-3 text-sm">{img.caption}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
