import { defineManifest } from "@crxjs/vite-plugin";
import baseManifest from "./manifest.config";

// @ts-expect-error ManifestConfig provides all required fields
export default defineManifest((env) => ({
  ...baseManifest,
  browser_specific_settings: {
    gecko: {
      id: env["FIREFOX_ADDON_ID"],
    },
  },
  background: {
    scripts: ["src/background/index.ts"],
    type: "module",
    persistent: false,
  },
  permissions: [
    ...baseManifest.permissions.filter(
      (permission) => permission !== "background",
    ),
  ],
}));
