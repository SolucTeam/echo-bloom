import type { SupabaseClient } from '@supabase/supabase-js';
import { canProvisionAdmin } from '../src/lib/cms-schema';

export async function provisionAdmin(db: SupabaseClient, email: string, password: () => Promise<string>, reset = false) {
  let existing;
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error('Could not inspect administrator accounts.');
    existing = data.users.find(user => user.email?.toLowerCase() === email.toLowerCase());
    if (existing || data.users.length < 1000) break;
  }
  let id = existing?.id;
  if (canProvisionAdmin(Boolean(existing), reset)) {
    const value = await password();
    if (value.length < 12) throw new Error('Administrator password must contain at least 12 characters.');
    if (existing) {
      const { error } = await db.auth.admin.updateUserById(existing.id, { password: value });
      if (error) throw new Error('Password reset failed.');
    } else {
      const { data, error } = await db.auth.admin.createUser({ email, password: value, email_confirm: true });
      if (error || !data.user) throw new Error('Administrator creation failed.');
      id = data.user.id;
    }
  }
  if (!id) throw new Error('Administrator identifier is missing.');
  const { error } = await db.from('user_roles').upsert({ user_id: id, role: 'admin' }, { onConflict: 'user_id,role' });
  if (error) throw new Error('Could not assign administrator rights.');
  return existing ? (reset ? 'Administrator password reset.' : 'Existing administrator preserved.') : 'Administrator created.';
}

export function assertPrivateSignup(settings: unknown) {
  if (!settings || typeof settings !== 'object' || !('disable_signup' in settings) || settings.disable_signup !== true) {
    throw new Error('Public registration must be disabled in the authentication service before starting the site.');
  }
}