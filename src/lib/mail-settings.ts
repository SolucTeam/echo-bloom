import { z } from 'zod';

const address = z.string().trim().max(255).email('Adresse e-mail invalide.');
const header = z.string().trim().min(1).max(120).refine(v => !/[\r\n]/.test(v), 'Texte invalide.');
const channel = z.object({
  enabled: z.boolean(),
  recipient: z.union([address, z.literal('')]),
  subject: header,
}).strict().refine(v => !v.enabled || v.recipient !== '', 'Renseignez le destinataire avant activation.');
export const mailSettingsSchema = z.object({
  senderName: header,
  senderEmail: z.union([address, z.literal('')]),
  contact: channel,
  benevole: channel,
  partenaire: channel,
}).strict().refine(v => !(v.contact.enabled || v.benevole.enabled || v.partenaire.enabled) || v.senderEmail !== '', 'Renseignez l’adresse d’expédition avant activation.');
export type MailSettings = z.infer<typeof mailSettingsSchema>;
export const DEFAULT_MAIL: MailSettings = {
  senderName: 'Green Ivory', senderEmail: '',
  contact: { enabled: false, recipient: '', subject: 'Nouveau message de contact' },
  benevole: { enabled: false, recipient: '', subject: 'Nouvelle candidature bénévole' },
  partenaire: { enabled: false, recipient: '', subject: 'Nouvelle demande de partenariat' },
};
export function readMailSettings(value: unknown): MailSettings {
  const result = mailSettingsSchema.safeParse(value);
  return result.success ? result.data : structuredClone(DEFAULT_MAIL);
}
export const mailKinds = ['contact', 'benevole', 'partenaire'] as const;
export function mailServerOnline(heartbeat: string | null | undefined, now = Date.now()) {
  // Fenêtre alignée sur un déclencheur périodique (ping toutes les 1 à 5 minutes).
  const time = heartbeat ? Date.parse(heartbeat) : NaN;
  return Number.isFinite(time) && time <= now && now - time < 600_000;
}