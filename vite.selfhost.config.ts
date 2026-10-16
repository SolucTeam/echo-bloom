import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { nitro } from 'nitro/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins:[tailwindcss(),tsconfigPaths({projects:['./tsconfig.json']}),tanstackStart(),nitro({preset:'node-server'})],
});