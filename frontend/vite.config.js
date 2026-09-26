import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
  }
})
