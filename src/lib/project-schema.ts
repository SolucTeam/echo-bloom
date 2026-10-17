import { z } from 'zod';
import { safeLink } from './cms-schema';
const short = z.string().trim().max(300);
export const projectSlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Adresse : lettres minuscules, chiffres et tirets uniquement.');
export const projectSchema = z.object({
  slug: projectSlugSchema,
  visible: z.boolean(), title: short.refine(v=>v.length>0,'Le titre est requis.'), eyebrow: short,
  tagline: z.string().trim().max(2000), org: short, launched: short, pilot: short, firstEdition: short,
  goal: short, goalDetail: z.string().trim().max(5000), hero: safeLink, context: z.string().trim().max(20000),
  objectives: z.array(z.string().trim().min(1).max(1000)).max(30),
  outcomes: z.array(z.object({label:short,value:short})).max(20),
});
export const projectsSchema=z.array(projectSchema).max(50).refine(items=>new Set(items.map(p=>p.slug)).size===items.length,'Chaque projet doit avoir une adresse différente.');
export type Project=z.infer<typeof projectSchema>;
export function visibleProjects(items: Project[]) { return items.filter(p=>p.visible); }
export function findVisibleProject(items: Project[], slug: string) {
  if (!projectSlugSchema.safeParse(slug).success) return null;
  return items.find(p=>p.slug===slug && p.visible) ?? null;
}
export function isPublicProjectPath(path: string, items: Project[]) {
  return !path.startsWith('/projets/') || findVisibleProject(items, path.slice('/projets/'.length)) !== null;
}
