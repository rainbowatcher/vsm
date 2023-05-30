/// <reference types="vitest" />
import path from "node:path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

// const __dirname = encodeURI(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig(() => ({
  resolve: {
    alias: {
      "@components/": `${path.resolve(__dirname, "src/components")}/`,
      "@composables/": `${path.resolve(__dirname, "src/composables")}/`,
      "@store/": `${path.resolve(__dirname, "src/store")}/`,
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        "vue-router",
        "pinia",
      ],
      resolvers: [ElementPlusResolver()],
      dirs: ["src/components/**", "src/composables/**", "src/store/**"],
      vueTemplate: true,
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: "src/components.d.ts",
    }),
    unocss(),
  ],

  test: {
    globals: true,
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}))
