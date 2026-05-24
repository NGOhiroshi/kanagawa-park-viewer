import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /\/parks\.json$/,
            handler: "CacheFirst",
            options: { cacheName: "parks-data", expiration: { maxAgeSeconds: 60 * 60 * 24 * 7 } },
          },
          {
            urlPattern: /^https:\/\/cyberjapandata\.gsi\.go\.jp\//,
            handler: "CacheFirst",
            options: { cacheName: "gsi-tiles", expiration: { maxEntries: 500 } },
          },
        ],
      },
      manifest: {
        name: "神奈川公園ビューワー",
        short_name: "公園ビューワー",
        description: "神奈川県の公園をニッチ条件で絞り込める検索PWA",
        theme_color: "#22c55e",
        background_color: "#f0fdf4",
        display: "standalone",
        lang: "ja",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@schema": path.resolve(__dirname, "./scripts/schema.ts"),
    },
  },
});
