import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const LogSchema = z.object({
  action: z.string().min(1),
  object_type: z.string().nullable().optional(),
  object_id: z.string().nullable().optional(),
  details: z.any().optional(),
});

export const logActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(LogSchema)
  .handler(async ({ data, context }) => {
    const email = (context.claims as { email?: string } | null)?.email ?? null;
    const { error } = await (context.supabase as any).from("activity_log").insert({
      user_id: context.userId,
      user_email: email,
      action: data.action,
      object_type: data.object_type ?? null,
      object_id: data.object_id ?? null,
      details: data.details ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listActivityLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ limit: z.number().int().min(1).max(1000).default(200) }).default({ limit: 200 }))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await (context.supabase as any)
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
