import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// In the Lovable sandbox we let the default Cloudflare preset run.
// For self-hosted deploys (e.g. Vercel from GitHub), force Nitro on with the
// `vercel` preset so the build emits `.vercel/output/` which Vercel auto-detects.
const isLovableSandbox = !!process.env.LOVABLE_SANDBOX || !!process.env.DEV_SERVER__PROJECT_PATH;

export default defineConfig({
  nitro: isLovableSandbox ? undefined : { preset: "vercel" },
});
