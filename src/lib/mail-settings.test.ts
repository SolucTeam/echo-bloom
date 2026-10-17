import { describe, it, expect } from 'vitest';
import { DEFAULT_MAIL, mailSettingsSchema, readMailSettings, mailServerOnline } from './mail-settings';
import { notificationMessage } from '../../scripts/mail-message';

describe('private server mail configuration', () => {
  it('does not activate emails by default', () => {
    expect(readMailSettings({})).toEqual(DEFAULT_MAIL);
    expect(DEFAULT_MAIL.contact.enabled).toBe(false);
    expect(DEFAULT_MAIL.benevole.enabled).toBe(false);
    expect(DEFAULT_MAIL.partenaire.enabled).toBe(false);
  });
  it('requires a recipient for an active form', () => {
    expect(mailSettingsSchema.safeParse({...DEFAULT_MAIL, senderEmail:'sender@example.org', contact:{...DEFAULT_MAIL.contact, enabled:true}}).success).toBe(false);
  });
  it('requires a sender before activation', () => {
    expect(mailSettingsSchema.safeParse({...DEFAULT_MAIL, benevole:{...DEFAULT_MAIL.benevole, enabled:true, recipient:'team@example.org'}}).success).toBe(false);
  });
  it('accepts independent recipients without secret fields', () => {
    const config={...DEFAULT_MAIL,senderEmail:'sender@example.org',contact:{...DEFAULT_MAIL.contact,enabled:true,recipient:'contact@example.org'},benevole:{...DEFAULT_MAIL.benevole,enabled:true,recipient:'volunteers@example.org'}};
    expect(mailSettingsSchema.parse(config).benevole.recipient).toBe('volunteers@example.org');
    expect(mailSettingsSchema.safeParse({...config,password:'secret'}).success).toBe(false);
  });
  it('rejects header injection', () => {
    expect(mailSettingsSchema.safeParse({...DEFAULT_MAIL,senderName:'Name\r\nBcc: other@example.org'}).success).toBe(false);
  });
  it('does not call an absent or stale server connected', () => {
    expect(mailServerOnline(null)).toBe(false);
    expect(mailServerOnline(new Date(0).toISOString(),90_001)).toBe(false);
    expect(mailServerOnline(new Date(1000).toISOString(),2000)).toBe(true);
  });
  it('sends the specific form notification to one configured team recipient', () => {
    const config={...DEFAULT_MAIL,senderEmail:'sender@example.org',benevole:{...DEFAULT_MAIL.benevole,recipient:'team@example.org'}};
    const message=notificationMessage(config,'benevole',{email:'visitor@example.org',name:'Visitor',message:'My application'});
    expect(message.to).toBe('team@example.org');
    expect(message.text).toContain('My application');
    expect(message.from.address).toBe('sender@example.org');
  });
});