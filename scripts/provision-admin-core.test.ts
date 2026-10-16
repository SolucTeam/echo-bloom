import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { assertPrivateSignup, provisionAdmin } from './provision-admin-core';

function fixture(existing = false) {
  const createUser = vi.fn().mockResolvedValue({ data: { user: { id: 'new-admin' } }, error: null });
  const updateUserById = vi.fn().mockResolvedValue({ error: null });
  const upsert = vi.fn().mockResolvedValue({ error: null });
  const db = {
    auth: { admin: { listUsers: vi.fn().mockResolvedValue({ data: { users: existing ? [{ id: 'existing-admin', email: 'admin@example.org' }] : [] }, error: null }), createUser, updateUserById } },
    from: vi.fn().mockReturnValue({ upsert }),
  };
  return { db: db as unknown as SupabaseClient, createUser, updateUserById, upsert };
}

describe('private first startup', () => {
  it('refuses public registration enabled', () => expect(() => assertPrivateSignup({ disable_signup: false })).toThrow());
  it('refuses unverified registration settings', () => expect(() => assertPrivateSignup({})).toThrow());
  it('accepts disabled public registration', () => expect(() => assertPrivateSignup({ disable_signup: true })).not.toThrow());
  it('creates the first administrator without public signup', async () => {
    const f = fixture();
    await provisionAdmin(f.db, 'admin@example.org', async () => 'test-password-123');
    expect(f.createUser).toHaveBeenCalledWith({ email: 'admin@example.org', password: 'test-password-123', email_confirm: true });
    expect(f.upsert).toHaveBeenCalledWith({ user_id: 'new-admin', role: 'admin' }, { onConflict: 'user_id,role' });
  });
  it('preserves the password on repeated startup without reading the secret', async () => {
    const f = fixture(true), password = vi.fn();
    await provisionAdmin(f.db, 'admin@example.org', password);
    expect(password).not.toHaveBeenCalled();
    expect(f.createUser).not.toHaveBeenCalled();
    expect(f.updateUserById).not.toHaveBeenCalled();
  });
  it('blocks startup when role assignment fails', async () => {
    const f = fixture(); f.upsert.mockResolvedValue({ error: { message: 'denied' } });
    await expect(provisionAdmin(f.db, 'admin@example.org', async () => 'test-password-123')).rejects.toThrow('Could not assign administrator rights.');
  });
  it('rejects a password shorter than 12 characters before creating an account', async () => {
    const f = fixture();
    await expect(provisionAdmin(f.db, 'admin@example.org', async () => '12345678901')).rejects.toThrow();
    expect(f.createUser).not.toHaveBeenCalled();
  });
});