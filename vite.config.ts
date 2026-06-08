import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// In the Lovable sandbox keep the default (Cloudflare) preset and output layout.
// For self-hosted deploys (Vercel from GitHub), force Nitro on with the
// `vercel` preset and emit the Vercel Build Output API layout
// (.vercel/output/{static,functions/__server.func}) which Vercel auto-detects.
const isLovableSandbox =
  !!process.env.LOVABLE_SANDBOX || !!process.env.DEV_SERVER__PROJECT_PATH;

export default defineConfig({
  nitro: isLovableSandbox
    ? undefined
    : {
        preset: "vercel",
        output: {
          dir: ".vercel/output",
          publicDir: "static",
          serverDir: "functions/__server.func",
        },
      },
});
