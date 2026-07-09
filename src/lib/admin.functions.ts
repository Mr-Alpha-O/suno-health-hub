import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Check current user is admin
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
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
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

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
    const { error } = await context.supabase.from("service_categories").upsert(data);
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
  slug: z.string().min(1),
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
});

export const listProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("products").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(ProductSchema)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").upsert(data);
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
