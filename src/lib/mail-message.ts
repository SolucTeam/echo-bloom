import { mailSettingsSchema, type MailSettings } from './mail-settings';

export type Source = { name?: string | null; email?: string; subject?: string; message?: string | null; phone?: string | null; city?: string | null; organization?: string | null };
export function notificationMessage(config: MailSettings, kind: 'contact' | 'benevole' | 'partenaire' | 'test', source: Source) {
  const settings = mailSettingsSchema.parse(config);
  const channel = settings[kind === 'test' ? 'contact' : kind];
  if (!settings.senderEmail || !channel.recipient) throw new Error('missing_address');
  return {
    from: { name: settings.senderName, address: settings.senderEmail },
    to: channel.recipient,
    subject: kind === 'test' ? 'Test de messagerie — Green Ivory' : channel.subject,
    text: kind === 'test' ? 'La connexion de messagerie de votre serveur Green Ivory fonctionne.' : [
      channel.subject, '',
      source.name && `Nom : ${source.name}`,
      source.email && `E-mail : ${source.email}`,
      source.subject && `Sujet : ${source.subject}`,
      source.phone && `Téléphone : ${source.phone}`,
      source.city && `Ville : ${source.city}`,
      source.organization && `Organisation : ${source.organization}`,
      '', source.message || '',
    ].filter(v => v !== undefined && v !== null).join('\n'),
  };
}