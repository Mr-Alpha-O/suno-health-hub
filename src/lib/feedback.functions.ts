import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function anonClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

const FeedbackInput = z.object({
  rating: z.number().int().min(1).max(5).nullable().optional(),
  name: z.string().trim().max(80).nullable().optional(),
  comment: z.string().trim().max(2000).nullable().optional(),
  requested_product: z.string().trim().max(200).nullable().optional(),
  page_url: z.string().trim().max(500).nullable().optional(),
  user_agent: z.string().trim().max(500).nullable().optional(),
  device_type: z.string().trim().max(30).nullable().optional(),
});

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => FeedbackInput.parse(d))
  .handler(async ({ data }) => {
    if (!data.rating && !(data.comment && data.comment.trim()) && !(data.requested_product && data.requested_product.trim())) {
      throw new Error("يرجى إضافة تقييم أو تعليق أو منتج مقترح");
    }
    const sb = anonClient() as any;
    const { error } = await sb.from("visitor_feedback").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listFeedback = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any)
      .from("visitor_feedback")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const markFeedbackReviewed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), is_reviewed: z.boolean() }))
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any)
      .from("visitor_feedback")
      .update({ is_reviewed: data.is_reviewed })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteFeedback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).from("visitor_feedback").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
