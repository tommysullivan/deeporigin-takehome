import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

// Get base URL for the app (works in dev, preview, and production)
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.VITE_BASE_URL || "http://localhost:3000";
};

const config = defineConfig({
  define: {
    // Embed base URL at build time for client-side access
    "import.meta.env.VITE_BASE_URL": JSON.stringify(getBaseUrl()),
  },
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),

    //nitro 3 bug intercepts 404s. fixed in nightly build but that breaks vercel deploys.
    //comment out to view 404s locally
    // nitro(),
  ],
});

export default config;
