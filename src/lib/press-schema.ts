import { z } from 'zod';
import { safeLink } from './cms-schema';
import { DEFAULT_PRESS } from '@/data/press';
import type { Lang } from './i18n';

export const pressItemSchema = z.object({
  title: z.string().min(1, 'Chaque communiqué a besoin d’un titre.').max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.'),
  summary: z.string().max(2000).default(''),
  url: safeLink.default(''),
  /* Version anglaise optionnelle (bilingue) : renseignée, elle remplace le
   * texte français pour les visiteurs anglophones ; vide, repli français. */
  titleEn: z.string().trim().max(300).optional(),
  summaryEn: z.string().trim().max(2000).optional(),
});
export const pressItemsSchema = z.array(pressItemSchema).max(30);
export type PressItem = z.infer<typeof pressItemSchema>;

export function readPress(raw: string): PressItem[] {
  if (!raw) return DEFAULT_PRESS;
  try { return pressItemsSchema.parse(JSON.parse(raw)); } catch { return DEFAULT_PRESS; }
}

/** Texte anglais s'il est renseigné, sinon texte français (repli champ par champ). */
function pickEn(fr: string, en?: string) { const v = en?.trim(); return v ? v : fr; }

/** Vue localisée des communiqués : titres et résumés EN renseignés, sinon repli français. */
export function localizedPress(items: PressItem[], lang: Lang): PressItem[] {
  if (lang !== 'en') return items;
  return items.map((item) => ({ ...item, title: pickEn(item.title, item.titleEn), summary: pickEn(item.summary, item.summaryEn) }));
}
