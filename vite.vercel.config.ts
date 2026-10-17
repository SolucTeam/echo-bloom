// Configuration de déploiement Vercel — distincte de l'aperçu Lovable (Cloudflare)
// et de l'installation autonome (node-server). Ne pas remplacer les autres configs.
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { nitro } from 'nitro/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    // Réutilise le wrapper SSR de gestion d'erreurs (src/server.ts), comme l'aperçu Lovable.
    tanstackStart({ server: { entry: 'server' } }),
    nitro({ preset: 'vercel' }),
    react(),
  ],
});
