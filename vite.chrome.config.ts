import { crx } from "@crxjs/vite-plugin";
import { defineConfig, mergeConfig, UserConfig, PluginOption } from "vite";
import manifest from "./manifest.chrome.config";
import baseConfig from "./vite.config";
import chalk from "chalk";

const browser = "chrome";
const outDir = "dist";
const browserOutDir = `${outDir}/${browser}`;

export default defineConfig((): UserConfig => {
  console.log(chalk.green(`Building for ${browser}...`));

  const browserPlugins: PluginOption[] = [
    crx({
      manifest,
      browser,
      contentScripts: { injectCss: true },
    }),
  ];

  const browserConfig: UserConfig = {
    build: {
      outDir: browserOutDir,
    },
    plugins: browserPlugins,
  };

  return mergeConfig(baseConfig(), browserConfig);
});
