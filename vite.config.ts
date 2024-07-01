import path from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import generateSitemap from "vite-ssg-sitemap";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import VueMacros from "unplugin-vue-macros/vite";
import { VitePWA } from "vite-plugin-pwa";
import WebfontDownload from "vite-plugin-webfont-dl";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },

  define: {
    VITE_APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },

  // https://vitejs.dev/config/dep-optimization-options#optimizedeps-include
  optimizeDeps: {
    include: ["@fortawesome/fontawesome-free", "vuetify"],
  },

  plugins: [
    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.md$/],
        }),
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        "vue",
        "@vueuse/head",
        "@vueuse/core",
        {
          // add any other imports you were relying on
          "vue-router/auto": ["useLink"],
        },
      ],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/composables", "src/stores"],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load components under `./src/components/`
      extensions: ["vue"],
      // allow auto import and register components
      include: [/\.vue$/, /\.vue\?vue/],
      dts: "src/components.d.ts",
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "safari-pinned-tab.svg"],
      manifest: {
        name: "Vitesse",
        short_name: "Vitesse",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),

    // https://github.com/feat-agency/vite-plugin-webfont-dl
    WebfontDownload(),

    vuetify({
      styles: { configFile: "src/assets/css/settings.scss" },
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: "async",
    formatting: "minify",
    onFinished() {
      generateSitemap();
    },
    format: "esm", // default
  },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ["workbox-window"],
  },

  server: {
    host: true,
    port: 8080,
    proxy: {
      "/sockjs-node": {
        target: "ws://127.0.0.1:8081",
        ws: true,
      },
    },
    hmr: {
      path: "/sockjs-node",
      port: 8081,
      clientPort: 443,
    },
  },
});
