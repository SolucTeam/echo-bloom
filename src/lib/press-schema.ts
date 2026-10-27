import { z } from 'zod';
import { safeLink } from './cms-schema';
import { DEFAULT_PRESS } from '@/data/press';

export const pressItemSchema = z.object({
  title: z.string().min(1, 'Chaque communiqué a besoin d’un titre.').max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.'),
  summary: z.string().max(2000).default(''),
  url: safeLink.default(''),
});
export const pressItemsSchema = z.array(pressItemSchema).max(30);
export type PressItem = z.infer<typeof pressItemSchema>;

export function readPress(raw: string): PressItem[] {
  if (!raw) return DEFAULT_PRESS;
  try { return pressItemsSchema.parse(JSON.parse(raw)); } catch { return DEFAULT_PRESS; }
}
