import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { POSTS } from "@/data/blog-posts";

const BASE_URL = "https://greenivory-reborn.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/a-propos", priority: "0.8", changefreq: "monthly" as const },
          { path: "/projets/journees-sans-plastique", priority: "0.8", changefreq: "monthly" as const },
          { path: "/projets/sentiers-verts", priority: "0.8", changefreq: "monthly" as const },
          { path: "/galerie", priority: "0.6", changefreq: "monthly" as const },
          { path: "/blog", priority: "0.7", changefreq: "weekly" as const },
          { path: "/nous-joindre", priority: "0.6", changefreq: "yearly" as const },
          { path: "/devenir-partenaire", priority: "0.7", changefreq: "monthly" as const },
          { path: "/devenir-benevole", priority: "0.7", changefreq: "monthly" as const },
          ...POSTS.map((p) => ({
            path: `/blog/${p.slug}`,
            priority: "0.6",
            changefreq: "monthly" as const,
          })),
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
