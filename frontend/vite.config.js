import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Use automatic JSX runtime (React 17+)
      jsxRuntime: 'automatic',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'UIUC Bus Tracker',
        short_name: 'UIUCBus',
        description: 'Real-time bus tracking for UIUC campus',
        theme_color: '#3B82F6',
        background_color: '#FAFAFA',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/developer\.cumtd\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  base: '/',
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@headlessui/react', 'sonner'],
          'query-vendor': ['@tanstack/react-query'],
          'map-vendor': ['react-geolocated'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@styles': resolve(__dirname, './src/styles'),
      '@util': resolve(__dirname, './src/util'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
