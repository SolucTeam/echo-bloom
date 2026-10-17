import { describe, expect, it } from 'vitest';
import { DEFAULT_NEWSLETTER, newsletterSchema, readNewsletter } from './newsletter';

describe('newsletter configuration', () => {
  it('accepts an external subscription page', () => {
    expect(newsletterSchema.safeParse({...DEFAULT_NEWSLETTER, enabled: true, url: 'https://example.org/inscription'}).success).toBe(true);
  });
  it('requires a subscription link before activation', () => {
    expect(newsletterSchema.safeParse({...DEFAULT_NEWSLETTER, enabled: true}).success).toBe(false);
  });
  it('rejects executable subscription links', () => {
    expect(newsletterSchema.safeParse({...DEFAULT_NEWSLETTER, url: 'javascript:alert(1)'}).success).toBe(false);
  });
  it('rejects insecure subscription links', () => {
    expect(newsletterSchema.safeParse({...DEFAULT_NEWSLETTER, url: 'http://example.org'}).success).toBe(false);
  });
  it('keeps an unconfigured newsletter hidden', () => {
    expect(readNewsletter('').enabled).toBe(false);
  });
});