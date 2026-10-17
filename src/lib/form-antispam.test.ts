import { describe, expect, it } from 'vitest';
import { formSpamResponse } from './form-antispam';

describe('Form anti-spam', () => {
  it('does not confirm a fast submission that was not saved', async () => {
    const response = formSpamResponse({ startedAt: 1000 }, 2999);
    expect(response?.status).toBe(429);
    expect(await response?.json()).toMatchObject({ ok: false });
  });
  it('allows saving at the existing two-second boundary', () => {
    expect(formSpamResponse({ startedAt: 1000 }, 3000)).toBeNull();
  });
  it('blocks future client timestamps without claiming success', () => {
    expect(formSpamResponse({ startedAt: 4000 }, 3000)?.status).toBe(429);
  });
  it('keeps honeypot submissions out of persistence', () => {
    expect(formSpamResponse({ website: 'spam', startedAt: 1000 }, 5000)?.status).toBe(200);
  });
});