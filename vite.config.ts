import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Force Nitro on for self-hosted deploys (Vercel) and use the vercel preset
  // so the build emits `.vercel/output/` which Vercel auto-detects.
  nitro: {
    preset: "vercel",
  },
});
