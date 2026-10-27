import { z } from 'zod';
import { safeLink } from './cms-schema';
import type { Lang } from './i18n';
const short = z.string().trim().max(300);
export const programSlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Adresse : lettres minuscules, chiffres et tirets uniquement.');
export const programSchema = z.object({
  slug: programSlugSchema,
  visible: z.boolean(), title: short.refine(v=>v.length>0,'Le titre est requis.'), eyebrow: short,
  tagline: z.string().trim().max(2000), org: short, launched: short, pilot: short, firstEdition: short,
  goal: short, goalDetail: z.string().trim().max(5000), hero: safeLink, context: z.string().trim().max(20000),
  objectives: z.array(z.string().trim().min(1).max(1000)).max(30),
  outcomes: z.array(z.object({label:short,value:short})).max(20),
  /* Version anglaise optionnelle (phase 2 bilingue) : chaque champ EN renseigné
   * remplace son homologue français pour les visiteurs anglophones ; laissé vide,
   * le texte français s'affiche tel quel (repli champ par champ). */
  titleEn: short.optional(), eyebrowEn: short.optional(), taglineEn: z.string().trim().max(2000).optional(),
  orgEn: short.optional(), launchedEn: short.optional(), pilotEn: short.optional(), firstEditionEn: short.optional(),
  goalEn: short.optional(), goalDetailEn: z.string().trim().max(5000).optional(), contextEn: z.string().trim().max(20000).optional(),
  objectivesEn: z.array(z.string().trim().max(1000)).max(30).optional(),
  outcomesEn: z.array(z.object({label:short,value:short})).max(20).optional(),
});
export const programsSchema=z.array(programSchema).max(50).refine(items=>new Set(items.map(p=>p.slug)).size===items.length,'Chaque programme doit avoir une adresse différente.');
export type Program=z.infer<typeof programSchema>;
export function visiblePrograms(items: Program[]) { return items.filter(p=>p.visible); }

/** Texte anglais s'il est renseigné, sinon texte français (repli champ par champ). */
function pickEn(fr:string,en?:string){const v=en?.trim();return v?v:fr;}
/** Liste anglaise nettoyée de ses entrées vides ; si rien d'exploitable, liste française. */
function pickListEn(fr:string[],en?:string[]){const cleaned=en?.map(v=>v.trim()).filter(Boolean)??[];return cleaned.length?cleaned:fr;}

/**
 * Vue localisée d'un programme (phase 2 bilingue) : en anglais, chaque champ EN
 * renseigné remplace son homologue français, sinon repli français. La forme du
 * programme est conservée (même slug, mêmes images) — drop-in dans les routes.
 */
export function localizedProgram(p:Program,lang:Lang):Program{
  if(lang!=='en')return p;
  return {
    ...p,
    eyebrow:pickEn(p.eyebrow,p.eyebrowEn), title:pickEn(p.title,p.titleEn), tagline:pickEn(p.tagline,p.taglineEn),
    org:pickEn(p.org,p.orgEn), launched:pickEn(p.launched,p.launchedEn), pilot:pickEn(p.pilot,p.pilotEn), firstEdition:pickEn(p.firstEdition,p.firstEditionEn),
    goal:pickEn(p.goal,p.goalEn), goalDetail:pickEn(p.goalDetail,p.goalDetailEn), context:pickEn(p.context,p.contextEn),
    objectives:pickListEn(p.objectives,p.objectivesEn),
    outcomes:p.outcomesEn?.some(o=>o.label.trim()||o.value.trim())?p.outcomesEn:p.outcomes,
  };
}
export function findVisibleProgram(items: Program[], slug: string) {
  if (!programSlugSchema.safeParse(slug).success) return null;
  return items.find(p=>p.slug===slug && p.visible) ?? null;
}
/** Public pour le sitemap : détail /programmes/<slug> si le programme est visible ; les anciennes adresses /projets* redirigent et ne sont jamais listées. */
export function isPublicProgramPath(path: string, items: Program[]) {
  if (path.startsWith('/programmes/')) return findVisibleProgram(items, path.slice('/programmes/'.length)) !== null;
  return !path.startsWith('/projets');
}
