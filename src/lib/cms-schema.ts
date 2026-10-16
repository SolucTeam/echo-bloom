import { z } from 'zod';

export const safeLink = z.string().max(2000).refine(v => !/[\\\u0000-\u0020]/.test(v) && (!v || (v.startsWith('/') && !v.startsWith('//')) || /^https:\/\//i.test(v) || /^(mailto:|tel:)/i.test(v)), 'Lien non autorisé');
export const blockSchema = z.object({
  id: z.string().min(1), type: z.enum(['text', 'image', 'callout']), title: z.string().max(500),
  body: z.string().max(50000), image: safeLink, alt: z.string().max(500),
  link: safeLink, linkLabel: z.string().max(200), visible: z.boolean(),
});
export type CmsBlock = z.infer<typeof blockSchema>;
export const pageSchema = z.object({
  path: z.string().regex(/^\/(?:[a-z0-9-]+\/?)*$/), title: z.string().min(1).max(300),
  description: z.string().max(1000), share_image: safeLink, blocks: z.array(blockSchema).max(100), published: z.boolean(),
});
export type CmsPageData = z.infer<typeof pageSchema>;
export const postSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().min(1).max(500),
  excerpt: z.string().max(5000), content: z.string().max(200000), category: z.string().min(1).max(100),
  image_url: safeLink.nullable(), author: z.string().max(200), published: z.boolean(),
  published_at: z.string().datetime(), content_format: z.enum(['text', 'html']).default('text'),
});
export const gallerySchema = z.object({collection: z.string().min(1).max(200), tag: z.string().max(200), image_url: safeLink, caption: z.string().max(1000).default(''), alt: z.string().max(500).default('')});
export const mediaSchema = z.object({url: safeLink, name: z.string().max(300), alt: z.string().max(500)});
export const settingSchema = z.object({key: z.string().min(1).max(200), label: z.string().max(200).default(''), value: z.string().max(100000)});
export const partnerSchema = z.object({ name: z.string().min(1).max(200), image: safeLink.min(1) });
export const partnersSchema = z.array(partnerSchema).max(30);
export type Partner = z.infer<typeof partnerSchema>;
export const adminEntitySchema = z.enum(['pages', 'posts', 'gallery', 'media', 'settings', 'messages', 'applications']);
export type AdminEntity = z.infer<typeof adminEntitySchema>;
export function canProvisionAdmin(existing: boolean, reset: boolean) { return !existing || reset; }