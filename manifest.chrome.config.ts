import { defineManifest } from "@crxjs/vite-plugin"
import baseManifest from "./manifest.config"

// @ts-expect-error ManifestConfig provides all required fields
export default defineManifest((env) => ({
  ...baseManifest,
  key: env["CHROME_ADDON_KEY"],
}))
