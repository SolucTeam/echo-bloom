import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Opt in against a real backend after minting an administrator session.
describe.skipIf(process.env.RUN_MEDIA_SECURITY_TESTS !== '1')('private media access', () => {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const path = `security-verification-${crypto.randomUUID()}.png`;
  let token = '';
  let signedUrl = '';
  let uploaded = false;

  function request(endpoint: string, authenticated = false, init: RequestInit = {}) {
    if (!base || !key) throw new Error('Backend test configuration missing');
    return fetch(`${base}${endpoint}`, {
      ...init,
      headers: { apikey: key, Authorization: `Bearer ${authenticated ? token : key}`, ...init.headers },
    });
  }

  beforeAll(async () => {
    const session = JSON.parse(readFileSync(`${homedir()}/.cache/lovable-auth/session.json`, 'utf8'));
    token = session.session.access_token;
    if (!token) throw new Error('Mint an administrator test session first');
    const response = await request(`/storage/v1/object/media/${path}`, true, {
      method: 'POST', headers: { 'Content-Type': 'image/png' },
      body: Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')),
    });
    expect(response.ok, 'Administrator upload succeeds').toBe(true);
    uploaded = true;
  });

  afterAll(async () => {
    if (uploaded) {
      const response = await request('/storage/v1/object/media', true, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: [path] }),
      });
      expect(response.ok, 'Test image cleanup succeeds').toBe(true);
    }
  });

  it('denies anonymous direct downloads of a known private file', async () => {
    const response = await request(`/storage/v1/object/authenticated/media/${path}`);
    expect(response.ok).toBe(false);
  });

  it('denies anonymous file enumeration and signed-link creation', async () => {
    const list = await request('/storage/v1/object/list/media', false, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefix: '', search: path, limit: 100 }),
    });
    expect(await list.json()).toEqual([]);
    const sign = await request(`/storage/v1/object/sign/media/${path}`, false, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 60 }),
    });
    expect(sign.ok).toBe(false);
  });

  it('allows administrators to sign images that visitors can display', async () => {
    const response = await request(`/storage/v1/object/sign/media/${path}`, true, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 60 }),
    });
    expect(response.ok).toBe(true);
    const result = await response.json();
    signedUrl = `${base}/storage/v1${result.signedURL}`;
    const image = await fetch(signedUrl);
    expect(image.status).toBe(200);
    expect(image.headers.get('content-type')).toContain('image/png');
  });

  it('denies anonymous access to unpublished media-library metadata', async () => {
    const response = await request('/rest/v1/cms_media?select=id&limit=1');
    expect(response.ok).toBe(false);
    const admin = await request('/rest/v1/cms_media?select=id&limit=1', true);
    expect(admin.status).toBe(200);
  });
});