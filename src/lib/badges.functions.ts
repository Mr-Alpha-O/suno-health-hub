import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const BADGE_COLORS = ["green", "blue", "orange", "purple", "red", "gray", "gold"] as const;

const BadgeSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  text: z.string().trim().min(1).max(50),
  color_variant: z.enum(BADGE_COLORS).default("gray"),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const listProductBadges = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { product_id: string }) => z.object({ product_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await (context.supabase as any)
      .from("product_badges")
      .select("*")
      .eq("product_id", data.product_id)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const upsertProductBadge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(BadgeSchema)
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).from("product_badges").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProductBadge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).from("product_badges").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderProductBadges = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ items: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int() })) }))
  .handler(async ({ data, context }) => {
    for (const it of data.items) {
      const { error } = await (context.supabase as any)
        .from("product_badges")
        .update({ sort_order: it.sort_order })
        .eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
