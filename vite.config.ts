import fs from "node:fs"
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { relative, dirname } from 'path'
import { fileURLToPath } from 'url'
import Components from 'unplugin-vue-components/vite'

const isDev = process.env.NODE_ENV !== 'production'

export default function baseConfig(): UserConfig {
  return defineConfig({
    base: isDev ? '/' : "",
    css: {
      postcss: './postcss.config.js',
    },
    build: {
      watch: isDev ? {} : undefined,
      sourcemap: isDev ? "inline" : false,
      terserOptions: { mangle: false },
    },
    plugins: [
      {
        name: "ensure-output-dir",
        buildStart() {
          ["dist/chrome", "dist/firefox"].forEach((dir) => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
          })
        },
      },

      vue(),

      Components({
        dirs: ['src/components'],
        deep: true,
        extensions: ['vue'],
        dts: 'src/types/components.d.ts',
        directoryAsNamespace: false,
        importPathTransform: undefined,
      }),

      {
        name: "assets-rewrite",
        enforce: "post",
        apply: "build",
        transformIndexHtml(html, { path }) {
          return html.replace(
            /"\/assets\//g,
              `"${relative(dirname(path), "/assets")}/`,
          )
        },
      },
    ],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL(".", import.meta.url)),
        "@": fileURLToPath(new URL("src", import.meta.url)),
        src: fileURLToPath(new URL("src", import.meta.url)),
        "@assets": fileURLToPath(new URL("src/assets", import.meta.url)),
      },
    },
  })
}
