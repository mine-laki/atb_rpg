import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sounds/**', 'pwa-icon.svg'],
      manifest: {
        name: 'EmojiParadigm',
        short_name: 'EmojiParadigm',
        description: 'FF13スタイルATBパラダイムシフトRPG',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/atb_rpg/',
        start_url: '/atb_rpg/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // ゲームアセット（JS/CSS/音声など）をキャッシュしてオフライン動作
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        navigateFallback: '/atb_rpg/',
        navigateFallbackDenylist: [/^\/api/],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  base: '/atb_rpg/',
  build: { outDir: 'dist' },
})
