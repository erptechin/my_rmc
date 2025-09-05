import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
  // Load env variables based on `mode` (dev/build)
  const env = loadEnv(mode, process.cwd(), '');

  // Set base path dynamically
  const base = command === 'serve' ? '/' : '/assets/my_rmc/dist/';

  return {
    base,
    plugins: [react(), jsconfigPaths(), svgr(),
    eslint(), tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'robots.txt', 'icons/*'],
      manifest: {
        name: 'RMC APP',
        short_name: 'RMC',
        start_url: '/rmc',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#e34444',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    ]
  };
});