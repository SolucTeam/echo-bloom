// Sauvegarde du contenu éditable (console admin) vers le dépôt, pour versionnage Git.
// Exclut volontairement les données personnelles (messages, candidatures) et les secrets.
// Usage : SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/export-content.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant.');
  process.exit(1);
}

const tables = ['cms_pages', 'blog_posts', 'gallery_photos', 'cms_media', 'site_content', 'mail_settings'];
const outDir = new URL('../content-snapshot/', import.meta.url);
mkdirSync(outDir, { recursive: true });

let failure = false;
for (const table of tables) {
  try {
    const response = await fetch(`${url}rest/v1/${table}?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = await response.json();
    const sorted = [...rows].sort((a, b) => String(a.id ?? a.key ?? a.path ?? '').localeCompare(String(b.id ?? b.key ?? b.path ?? '')));
    writeFileSync(new URL(`${table}.json`, outDir), JSON.stringify(sorted, null, 2) + '\n');
    console.log(`${table}: ${rows.length} ligne(s)`);
  } catch (error) {
    failure = true;
    console.error(`${table}: échec (${error.message})`);
  }
}
process.exit(failure ? 1 : 0);
