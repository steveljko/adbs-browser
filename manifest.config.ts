import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "adbs-browser",
  description: "",
  version: "0.0.0",
  action: {
    default_popup: "src/popup/index.html",
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  host_permissions: ["<all_urls>"],
  permissions: ["bookmarks", "storage", "tabs", "background"],
});
