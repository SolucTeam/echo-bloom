import { z } from 'zod';
import { safeLink } from './cms-schema';
import { DEFAULT_EVENTS } from '@/data/events';
import type { Lang } from './i18n';

export const eventItemSchema = z.object({
  title: z.string().min(1, 'Chaque événement a besoin d’un titre.').max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.'),
  location: z.string().max(300).default(''),
  description: z.string().max(5000).default(''),
  url: safeLink.default(''),
  /* Version anglaise optionnelle (bilingue) : renseignée, elle remplace le
   * texte français pour les visiteurs anglophones ; vide, repli français. */
  titleEn: z.string().trim().max(300).optional(),
  locationEn: z.string().trim().max(300).optional(),
  descriptionEn: z.string().trim().max(5000).optional(),
});
export const eventItemsSchema = z.array(eventItemSchema).max(50);
export type EventItem = z.infer<typeof eventItemSchema>;

export function readEvents(raw: string): EventItem[] {
  if (!raw) return DEFAULT_EVENTS;
  try { return eventItemsSchema.parse(JSON.parse(raw)); } catch { return DEFAULT_EVENTS; }
}

/** Texte anglais s'il est renseigné, sinon texte français (repli champ par champ). */
function pickEn(fr: string, en?: string) { const v = en?.trim(); return v ? v : fr; }

/** Vue localisée des événements : titres, lieux et descriptions EN renseignés, sinon repli français. */
export function localizedEvents(items: EventItem[], lang: Lang): EventItem[] {
  if (lang !== 'en') return items;
  return items.map((item) => ({
    ...item,
    title: pickEn(item.title, item.titleEn),
    location: pickEn(item.location, item.locationEn),
    description: pickEn(item.description, item.descriptionEn),
  }));
}
