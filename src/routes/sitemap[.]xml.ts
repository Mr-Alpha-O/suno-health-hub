import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BASE_URL = "https://www.swnwmedicalcare.com";

const toAbsoluteUrl = (path: string) => new URL(path, BASE_URL).toString();

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const sb = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
        );
        const [{ data: products }, { data: cats }] = await Promise.all([
          sb.from("products").select("slug").eq("is_visible", true),
          sb.from("service_categories").select("slug").eq("is_visible", true),
        ]);
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/services", changefreq: "weekly", priority: "0.9" },
          { path: "/store", changefreq: "weekly", priority: "0.9" },
          { path: "/request", changefreq: "monthly", priority: "0.8" },
          { path: "/careers", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          ...(products ?? []).map((p) => ({ path: `/store/${p.slug}`, changefreq: "monthly", priority: "0.7" })),
          ...(cats ?? []).map(() => null).filter(Boolean) as never[],
        ];
        const urls = entries.map((e) => `  <url>\n    <loc>${toAbsoluteUrl(e.path)}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
