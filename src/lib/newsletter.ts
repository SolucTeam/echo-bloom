import { z } from 'zod';

const subscriptionUrl = z.string().trim().max(2000).refine(value => {
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
  url: subscriptionUrl,
}).refine(value => !value.enabled || Boolean(value.url), {
  message: 'Ajoutez le lien d’inscription avant d’activer la newsletter.', path: ['url'],
});
export type NewsletterSettings = z.infer<typeof newsletterSchema>;
export const DEFAULT_NEWSLETTER: NewsletterSettings = {
  enabled: false, title: 'Newsletter',
  description: 'Recevez les nouvelles de Green Ivory.',
  buttonLabel: 'Je m’abonne', url: '',
};
export function readNewsletter(value: string): NewsletterSettings {
  try { return newsletterSchema.parse(JSON.parse(value)); }
  catch { return DEFAULT_NEWSLETTER; }
}