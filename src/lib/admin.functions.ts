import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Check current user is admin
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: !!data, userId: context.userId };
  });

// ---------- Site settings ----------
export const listSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("site_settings").select("*").order("key");
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ key: z.string().min(1), value: z.any() }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("site_settings")
      .upsert({ key: data.key, value: data.value }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ key: z.string() }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("site_settings").delete().eq("key", data.key);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Service categories ----------
const CategorySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().nullable().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

function slugify(input: string): string {
  return (input || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || `cat-${Date.now().toString(36)}`;
}

export const listCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("service_categories")
      .select("*, service_subs(*)")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(CategorySchema)
  .handler(async ({ data, context }) => {
    const payload = { ...data, slug: (data.slug && data.slug.trim()) ? data.slug.trim() : slugify(data.name) };
    const { error } = await context.supabase.from("service_categories").upsert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("service_categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Service subs ----------
const SubSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string().uuid(),
  name: z.string().min(1),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const upsertSub = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(SubSchema)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("service_subs").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSub = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("service_subs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Products ----------
const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().nullable().optional(),
  name: z.string().min(1),
  category: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  short: z.string().nullable().optional(),
  details: z.array(z.string()).default([]),
  buy_price: z.number().nullable().optional(),
  rent_price: z.number().nullable().optional(),
  old_price: z.number().nullable().optional(),
  stock: z.number().int().nullable().optional(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  rental_unit: z.enum(["hour","day","week","month","year","negotiable"]).default("day"),
  show_buy_price: z.boolean().default(true),
  show_rent_price: z.boolean().default(true),
  available_for_sale: z.boolean().default(true),
  available_for_rent: z.boolean().default(true),
});

function slugifyName(name: string): string {
  const base = name.trim().toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return (base || "item") + "-" + Math.random().toString(36).slice(2, 7);
}

export const listProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any)
      .from("products")
      .select("*, product_badges(*)")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: any) => ({
      ...r,
      badges: ((r.product_badges ?? []) as Array<any>).sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    }));
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(ProductSchema)
  .handler(async ({ data, context }) => {
    const row: Record<string, unknown> = { ...data };
    // Auto-generate slug when not provided (uniqueness enforced by DB retry)
    if (!data.id && (!data.slug || !data.slug.trim())) {
      let attempt = slugifyName(data.name);
      for (let i = 0; i < 5; i++) {
        const { data: existing } = await context.supabase.from("products").select("id").eq("slug", attempt).maybeSingle();
        if (!existing) break;
        attempt = slugifyName(data.name);
      }
      row.slug = attempt;
    } else if (data.slug === "" || data.slug === null) {
      delete row.slug;
    }
    const { error } = await context.supabase.from("products").upsert(row as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Media (Storage) ----------
export const listMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.storage.from("media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (error) throw new Error(error.message);
    const withUrls = await Promise.all(
      (data ?? []).filter((f) => f.name && !f.name.startsWith(".")).map(async (f) => {
        const { data: signed } = await context.supabase.storage.from("media").createSignedUrl(f.name, 60 * 60);
        return { name: f.name, url: signed?.signedUrl ?? null, size: f.metadata?.size, created_at: f.created_at };
      })
    );
    return withUrls;
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ name: z.string() }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.storage.from("media").remove([data.name]);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
