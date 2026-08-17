import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { extractMediaPath, isHttpUrl } from "@/lib/media-url";

function anonClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const phoneRe = /^[0-9+\s\-()]{6,30}$/;

// URL signer: converts an array of stored values (paths or full URLs) into displayable URLs.
// Batches all storage-bucket paths into a single createSignedUrls call for performance.
async function signMediaValues(sb: ReturnType<typeof anonClient>, values: Array<string | null | undefined>): Promise<Record<string, string>> {
  const paths = new Set<string>();
  for (const v of values) {
    if (!v) continue;
    if (isHttpUrl(v)) continue;
    const p = extractMediaPath(v);
    if (p) paths.add(p);
  }
  const map: Record<string, string> = {};
  if (paths.size === 0) return map;
  const arr = Array.from(paths);
  const { data } = await sb.storage.from("media").createSignedUrls(arr, 60 * 60 * 24 * 7);
  for (const row of data ?? []) {
    if (row.path && row.signedUrl) map[row.path] = row.signedUrl;
  }
  return map;
}

function resolveOne(v: string | null | undefined, map: Record<string, string>): string | null {
  if (!v) return null;
  if (isHttpUrl(v)) return v;
  const p = extractMediaPath(v);
  if (p && map[p]) return map[p];
  return v ?? null;
}

// ============ READ FUNCTIONS ============

export const getHero = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("hero_content").select("*").eq("is_active", true).limit(1).maybeSingle();
  return data;
});

export const getWhyUs = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("why_us_items").select("*").eq("is_visible", true).order("sort_order");
  return data ?? [];
});

export const getServiceCategoriesPublic = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const [cats, subs] = await Promise.all([
    sb.from("service_categories").select("*").eq("is_visible", true).order("sort_order"),
    sb.from("service_subs").select("*").eq("is_visible", true).order("sort_order"),
  ]);
  const list = (cats.data ?? []).map((c) => ({
    ...c,
    subs: (subs.data ?? []).filter((s) => s.category_id === c.id),
  }));
  return list;
});

export const getAllProductsPublic = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  // Single request: products + visible badges nested. RLS filters to visible only.
  const { data } = await (sb as any)
    .from("products")
    .select("*, product_badges(*)")
    .eq("is_visible", true)
    .order("sort_order");
  const rows = (data ?? []) as Array<any>;
  const map = await signMediaValues(sb, rows.map((r) => r.image));
  return rows.map((r) => {
    const badges = ((r.product_badges ?? []) as Array<any>)
      .filter((b) => b.is_visible !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return { ...r, image: resolveOne(r.image, map), badges };
  });
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const sb = anonClient();
    const { data: product } = await (sb as any)
      .from("products")
      .select("*, product_badges(*)")
      .eq("slug", data.slug)
      .eq("is_visible", true)
      .maybeSingle();
    if (!product) return null;
    const { data: images } = await sb.from("product_images").select("*").eq("product_id", product.id).order("sort_order");
    const values = [product.image, ...((images ?? []).map((i: any) => i.url))];
    const map = await signMediaValues(sb, values);
    const badges = ((product.product_badges ?? []) as Array<any>)
      .filter((b) => b.is_visible !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return {
      ...product,
      image: resolveOne(product.image, map),
      badges,
      images: (images ?? []).map((i: any) => ({ ...i, url: resolveOne(i.url, map) ?? i.url })),
    };
  });

export const getAbout = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("about_content").select("*").eq("is_active", true).limit(1).maybeSingle();
  return data;
});

export const getTeam = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("team_members").select("*").eq("is_visible", true).order("sort_order");
  return data ?? [];
});

export const getDoctors = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await (sb as any).from("doctors").select("*").eq("is_visible", true).order("sort_order");
  const rows = (data ?? []) as Array<any>;
  const map = await signMediaValues(sb, rows.map((r) => r.photo_url));
  return rows.map((r) => ({ ...r, photo_url: resolveOne(r.photo_url, map) }));
});

export const getTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("testimonials").select("*").eq("is_visible", true).order("sort_order");
  return data ?? [];
});

export const getFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("faqs").select("*").eq("is_visible", true).order("sort_order");
  return data ?? [];
});

export const getSiteStats = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("site_stats").select("*").eq("is_visible", true).order("sort_order");
  return data ?? [];
});

export const getJobsPublic = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("jobs").select("*").eq("is_open", true).order("sort_order");
  return data ?? [];
});

export const getContactInfo = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("contact_info").select("*").eq("is_active", true).limit(1).maybeSingle();
  return data;
});

export const getContactCollections = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient() as any;
  const [phones, whatsapps, emails, branches] = await Promise.all([
    sb.from("contact_phones").select("*").eq("is_visible", true).order("sort_order"),
    sb.from("contact_whatsapps").select("*").eq("is_visible", true).order("sort_order"),
    sb.from("contact_emails").select("*").eq("is_visible", true).order("sort_order"),
    sb.from("contact_branches").select("*").eq("is_visible", true).order("sort_order"),
  ]);
  return {
    phones: (phones.data ?? []) as Array<{ id: string; label: string | null; value: string; value_intl: string | null; is_primary: boolean; sort_order: number }>,
    whatsapps: (whatsapps.data ?? []) as Array<{ id: string; label: string | null; value: string; is_primary: boolean; sort_order: number }>,
    emails: (emails.data ?? []) as Array<{ id: string; label: string | null; value: string; is_primary: boolean; sort_order: number }>,
    branches: (branches.data ?? []) as Array<{ id: string; name: string | null; address: string; phone: string | null; hours: string | null; map_embed: string | null; is_primary: boolean; sort_order: number }>,
  };
});

export const getNavItems = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("nav_items").select("*").eq("is_visible", true).order("sort_order");
  return data ?? [];
});

export const getHomepageSections = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await (sb as any).from("homepage_sections").select("*").order("sort_order");
  return (data ?? []) as Array<{ id: string; key: string; label: string; sort_order: number; is_visible: boolean }>;
});

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | { [k: string]: JsonValue } | JsonValue[];

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data } = await sb.from("site_settings").select("*");
  return (data ?? []) as Array<{ key: string; value: JsonValue }>;
});

// ============ SUBMIT FUNCTIONS ============

const ServiceReq = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(phoneRe),
  service_slug: z.string().trim().max(120).optional().nullable(),
  sub_service: z.string().trim().max(200).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const submitServiceRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ServiceReq.parse(d))
  .handler(async ({ data }) => {
    const sb = anonClient();
    const { error } = await sb.from("service_submissions").insert({
      name: data.name,
      phone: data.phone,
      service_slug: data.service_slug ?? null,
      sub_service: data.sub_service ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const JobApp = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(phoneRe),
  email: z.string().trim().email().max(255).optional().nullable(),
  position: z.string().trim().max(200).optional().nullable(),
  cv_url: z.string().trim().url().max(500).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const submitJobApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => JobApp.parse(d))
  .handler(async ({ data }) => {
    const sb = anonClient();
    const { error } = await sb.from("job_applications").insert({
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      position: data.position ?? null,
      cv_url: data.cv_url ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const ContactMsg = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  subject: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().min(2).max(5000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ContactMsg.parse(d))
  .handler(async ({ data }) => {
    const sb = anonClient();
    const { error } = await sb.from("contact_messages").insert({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      subject: data.subject ?? null,
      message: data.message,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Public customer reviews: only admin-published feedback, minimal public fields.
export const getPublishedReviews = createServerFn({ method: "GET" }).handler(async () => {
  const sb = anonClient();
  const { data, error } = await (sb as any)
    .from("visitor_feedback")
    .select("id,name,rating,comment,created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(error.message);
  return (data ?? []) as Array<{ id: string; name: string | null; rating: number | null; comment: string | null; created_at: string }>;
});
