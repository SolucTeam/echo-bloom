import { z } from 'zod';

const short = z.string().trim().min(1, 'Ce champ est requis.').max(200);
const text = z.string().trim().max(2000);
const common = z.object({
  enabled: z.boolean(), title: short, intro: text, formTitle: short, description: text,
  buttonLabel: short, successMessage: short, closedMessage: short,
});
export const contactSettingsSchema = common;
export const volunteerSettingsSchema = common.extend({
  missions: z.array(short).max(20), showPhone: z.boolean(), showCity: z.boolean(), showMessage: z.boolean(),
  messageLabel: short,
});
export type ContactSettings = z.infer<typeof contactSettingsSchema>;
export type VolunteerSettings = z.infer<typeof volunteerSettingsSchema>;
export const DEFAULT_CONTACT: ContactSettings = {
  enabled: true, title: 'Nos infos et contacts.', intro: "Par courriel ou par téléphone, vous pouvez nous joindre en tout temps. N'hésitez pas !",
  formTitle: 'Restons en contact', description: 'Une question, un partenariat, une idée de projet ? Écrivez-nous — nous revenons vers vous sous 48h.',
  buttonLabel: 'Envoyer le message', successMessage: "Nous avons bien reçu votre demande. Notre équipe revient vers vous dans les 48 heures à l’adresse e-mail que vous avez indiquée.",
  closedMessage: 'Le formulaire de contact est momentanément fermé.',
};
export const DEFAULT_VOLUNTEER: VolunteerSettings = {
  enabled: true, title: 'Voulez-vous rejoindre notre équipe ?', intro: 'Envie d’agir pour l’environnement ? Rejoignez Green Ivory et participez à nos missions. Chaque geste compte.',
  formTitle: 'Inscription bénévole', description: '', buttonLabel: 'Je m’inscris', successMessage: 'Merci ! Nous reviendrons vers vous très vite.',
  closedMessage: 'Les inscriptions bénévoles sont momentanément fermées.',
  missions: ['Nettoyages de plages et opérations de dépollution', 'Sensibilisation dans les écoles et quartiers', 'Reboisement et entretien d’espaces verts', 'Logistique d’événements éco-responsables', 'Communication et création de contenu'],
  showPhone: true, showCity: true, showMessage: true, messageLabel: 'Pourquoi voulez-vous nous rejoindre ?',
};
export function readContact(raw: string): ContactSettings { try { return contactSettingsSchema.parse(JSON.parse(raw)); } catch { return DEFAULT_CONTACT; } }
export function readVolunteer(raw: string): VolunteerSettings { try { return volunteerSettingsSchema.parse(JSON.parse(raw)); } catch { return DEFAULT_VOLUNTEER; } }
export const contactDetailsSchema = z.object({
  'site.address': z.string().trim().max(500), 'site.phone': z.string().trim().max(50),
  'site.email': z.string().trim().email('Adresse e-mail invalide.').max(255).or(z.literal('')),
  'site.recruitment': z.string().trim().email('Adresse e-mail invalide.').max(255).or(z.literal('')),
});
export const contactSubmissionSchema = z.object({
  name: z.string().trim().max(100).optional(), email: z.string().trim().email('E-mail invalide.').max(255),
  subject: z.string().trim().min(2, 'Objet trop court.').max(200), message: z.string().trim().min(10, 'Message trop court (10 caractères minimum).').max(5000),
  website: z.string().max(200).default(''), startedAt: z.number().int().nonnegative(),
});
export const volunteerSubmissionSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.').max(200), email: z.string().trim().email('E-mail invalide.').max(255),
  phone: z.string().trim().max(50).default(''), city: z.string().trim().max(100).default(''), message: z.string().trim().max(5000).default(''),
  website: z.string().max(200).default(''), startedAt: z.number().int().nonnegative(),
});
export function volunteerApplication(input: unknown, config: VolunteerSettings) {
  if (!config.enabled) throw new Error(config.closedMessage);
  const data = volunteerSubmissionSchema.parse(input);
  return { kind: 'benevole', name: data.name, email: data.email, phone: config.showPhone ? data.phone || null : null, city: config.showCity ? data.city || null : null, message: config.showMessage ? data.message || null : null, handled: false };
}
