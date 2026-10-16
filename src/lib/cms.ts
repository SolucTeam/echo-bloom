import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, BlogCategory } from "@/data/blog-posts";

export type DbPost = {
  id: string; slug: string; title: string; excerpt: string; content: string;
  category: string; image_url: string | null; author: string; published: boolean; published_at: string;
};

export function dbPostToBlogPost(p: DbPost): BlogPost {
  const d = new Date(p.published_at);
  const words = p.content.split(/\s+/).length;
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.published_at.slice(0, 10),
    dateLabel: d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    author: p.author,
    category: p.category as BlogCategory,
    image: p.image_url || "",
    readingTime: `${Math.max(1, Math.round(words / 200))} min`,
    content: p.content.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
  };
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const { data } = await supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false });
  return (data ?? []).map((p) => dbPostToBlogPost(p as DbPost));
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return data ? dbPostToBlogPost(data as DbPost) : null;
}

/** Editable site texts with built-in fallback. */
export const EDITABLE_TEXTS: { key: string; label: string; fallback: string }[] = [
  { key: "home.hero.title", label: "Accueil — grand titre", fallback: "" },
  { key: "home.hero.intro", label: "Accueil — texte d'introduction", fallback: "" },
  { key: "footer.tagline", label: "Pied de page — phrase de présentation", fallback: "" },
];

let cache: Record<string, string> | null = null;
let pending: Promise<Record<string, string>> | null = null;
function loadTexts() {
  if (cache) return Promise.resolve(cache);
  pending ??= Promise.resolve(supabase.from("site_content").select("key,value")).then(({ data }) => {
    cache = Object.fromEntries((data ?? []).filter((r) => r.value.trim()).map((r) => [r.key, r.value]));
    return cache;
  });
  return pending;
}

export function useSiteText(key: string, fallback: string) {
  const [text, setText] = useState(fallback);
  useEffect(() => {
    let alive = true;
    loadTexts().then((t) => alive && t[key] && setText(t[key]));
    return () => { alive = false; };
  }, [key]);
  return text;
}

export async function uploadMedia(file: File): Promise<string> {
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]+/g, "-")}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2 ?? new Error("URL");
  return data.signedUrl;
}
