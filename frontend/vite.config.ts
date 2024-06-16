import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
      filename: "sw.ts",
      injectRegister: "inline",
      manifest: {
        description: "Sample project",
        icons: [
          {
            sizes: "64x64",
            src: "pwa-64x64.png",
            type: "image/png",
          },
          {
            sizes: "192x192",
            src: "pwa-192x192.png",
            type: "image/png",
          },
          {
            sizes: "512x512",
            src: "pwa-512x512.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "maskable-icon-512x512.png",
            type: "image/png",
          },
        ],
        name: "Sample project",
        short_name: "Sample project",
        theme_color: "#ffffff",
      },
      registerType: "autoUpdate",
      srcDir: "src",
      strategies: "injectManifest",
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      },
    }),
  ],
  test: {
    clearMocks: true,
    environment: "happy-dom",
    setupFiles: ["./src/testUtils/vitestSetup.ts"],
  },
});
