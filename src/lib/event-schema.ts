import { z } from 'zod';
import { safeLink } from './cms-schema';
import { DEFAULT_EVENTS } from '@/data/events';

export const eventItemSchema = z.object({
  title: z.string().min(1, 'Chaque événement a besoin d’un titre.').max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.'),
  location: z.string().max(300).default(''),
  description: z.string().max(5000).default(''),
  url: safeLink.default(''),
});
export const eventItemsSchema = z.array(eventItemSchema).max(50);
export type EventItem = z.infer<typeof eventItemSchema>;

export function readEvents(raw: string): EventItem[] {
  if (!raw) return DEFAULT_EVENTS;
  try { return eventItemsSchema.parse(JSON.parse(raw)); } catch { return DEFAULT_EVENTS; }
}
