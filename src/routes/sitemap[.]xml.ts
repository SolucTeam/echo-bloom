import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { POSTS } from "@/data/blog-posts";
import { readPrograms } from '@/lib/programs';
import { isPublicProgramPath } from '@/lib/program-schema';
import { publicClient } from '@/lib/public-client.server';

const BASE_URL = import.meta.env.VITE_SITE_URL || "https://green-ivory-tan.vercel.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const db=publicClient();
        const [pages,posts,setting,programsSetting]=await Promise.all([db.from('cms_pages').select('path').eq('published',true),db.from('blog_posts').select('slug').eq('published',true),db.from('site_content').select('value').eq('key','cms.posts.imported').maybeSingle(),db.from('site_content').select('key,value').in('key',['site.programs','site.projects'])]);
        if(pages.error||posts.error||setting.error||programsSetting.error)return new Response('Sitemap indisponible',{status:503});
        // Compatibilité : la nouvelle clé site.programs prime sur l'ancienne site.projects.
        const programsRaw=programsSetting.data?.find(r=>r.key==='site.programs')?.value||programsSetting.data?.find(r=>r.key==='site.projects')?.value||'';
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/a-propos", priority: "0.8", changefreq: "monthly" as const },
          { path: "/programmes", priority: "0.8", changefreq: "monthly" as const },
          ...readPrograms(programsRaw).filter(p=>p.visible).map(p=>({path:'/programmes/'+p.slug,priority:'0.8',changefreq:'monthly' as const})),
          { path: "/actualites", priority: "0.7", changefreq: "weekly" as const },
          { path: "/nous-joindre", priority: "0.6", changefreq: "yearly" as const },
          { path: "/devenir-partenaire", priority: "0.7", changefreq: "monthly" as const },
          { path: "/faire-un-don", priority: "0.7", changefreq: "monthly" as const },
          { path: "/devenir-benevole", priority: "0.7", changefreq: "monthly" as const },
          ...[...(posts.data??[]),...(setting.data?.value==='true'?[]:POSTS.filter(p=>!posts.data?.some(d=>d.slug===p.slug)))].map((p) => ({
            path: `/blog/${p.slug}`,
            priority: "0.6",
            changefreq: "monthly" as const,
          })),
        ];
        for(const page of pages.data??[])if(isPublicProgramPath(page.path,readPrograms(programsRaw))&&!entries.some(e=>e.path===page.path))entries.push({path:page.path,priority:'0.6',changefreq:'monthly'});
        const escapeXml=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            `  <url><loc>${escapeXml(BASE_URL+e.path)}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
