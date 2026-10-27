import { z } from 'zod';
import type { Lang } from './i18n';

const httpsUrl = z.string().trim().max(2000).refine(value => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !value.includes('\\');
  } catch { return false; }
}, 'Renseignez une adresse https:// complète.');

export const newsletterSchema = z.object({
  enabled: z.boolean(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  buttonLabel: z.string().trim().min(1).max(80),
  url: httpsUrl,
  embed: httpsUrl,
  /* Version anglaise optionnelle (bilingue) : renseignée, elle remplace le
   * texte français pour les visiteurs anglophones ; vide, repli français. */
  titleEn: z.string().trim().max(120).optional(),
  descriptionEn: z.string().trim().max(500).optional(),
  buttonLabelEn: z.string().trim().max(80).optional(),
}).refine(value => !value.enabled || Boolean(value.url) || Boolean(value.embed), {
  message: 'Ajoutez le lien d’inscription ou le formulaire intégré avant d’activer la newsletter.', path: ['url'],
});
export type NewsletterSettings = z.infer<typeof newsletterSchema>;
export const DEFAULT_NEWSLETTER: NewsletterSettings = {
  enabled: false, title: 'Newsletter',
  description: 'Recevez les nouvelles de Green Ivory.',
  descriptionEn: 'Get the latest news from Green Ivory.',
  buttonLabel: 'Je m’abonne', buttonLabelEn: 'Subscribe', url: '', embed: '',
};
export function readNewsletter(value: string): NewsletterSettings {
  try { return newsletterSchema.parse(JSON.parse(value)); }
  catch { return DEFAULT_NEWSLETTER; }
}

/** Texte anglais s'il est renseigné, sinon texte français (repli champ par champ). */
function pickEn(fr: string, en?: string) { const v = en?.trim(); return v ? v : fr; }

/** Vue localisée de la newsletter : textes EN renseignés, sinon repli français. */
export function localizedNewsletter(value: NewsletterSettings, lang: Lang): NewsletterSettings {
  if (lang !== 'en') return value;
  return {
    ...value,
    title: pickEn(value.title, value.titleEn),
    description: pickEn(value.description, value.descriptionEn),
    buttonLabel: pickEn(value.buttonLabel, value.buttonLabelEn),
  };
}