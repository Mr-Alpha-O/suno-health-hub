import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ================= DOCTORS ================= */
const DoctorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  specialty: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  qualifications: z.string().nullable().optional(),
  experience: z.string().nullable().optional(),
  photo_url: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  is_available: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const listDoctors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any).from("doctors").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data as Array<z.infer<typeof DoctorSchema>>;
  });

export const upsertDoctor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(DoctorSchema)
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).from("doctors").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteDoctor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).from("doctors").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ================= HOMEPAGE SECTIONS ================= */
const SectionSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  label: z.string(),
  sort_order: z.number().int(),
  is_visible: z.boolean(),
});

export const listSections = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any).from("homepage_sections").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data as Array<z.infer<typeof SectionSchema>>;
  });

export const saveSections = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ sections: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int(), is_visible: z.boolean() })) }))
  .handler(async ({ data, context }) => {
    for (const s of data.sections) {
      const { error } = await (context.supabase as any)
        .from("homepage_sections")
        .update({ sort_order: s.sort_order, is_visible: s.is_visible })
        .eq("id", s.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/* ================= PRODUCT IMAGES ================= */
const ImageSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  url: z.string().min(1),
  alt: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const listProductImages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ product_id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase.from("product_images").select("*").eq("product_id", data.product_id).order("sort_order");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const addProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(ImageSchema)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("product_images").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("product_images").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderProductImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ items: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int() })) }))
  .handler(async ({ data, context }) => {
    for (const it of data.items) {
      const { error } = await context.supabase.from("product_images").update({ sort_order: it.sort_order }).eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/* ================= DASHBOARD RECENT ================= */
export const getDashboardRecent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const [svc, jobs, msgs, doctorsCount] = await Promise.all([
      sb.from("service_submissions").select("id,name,phone,service_slug,sub_service,status,created_at").order("created_at", { ascending: false }).limit(10),
      sb.from("job_applications").select("id,name,phone,position,status,created_at").order("created_at", { ascending: false }).limit(10),
      sb.from("contact_messages").select("id,name,email,subject,status,created_at").order("created_at", { ascending: false }).limit(10),
      (sb as any).from("doctors").select("*", { count: "exact", head: true }),
    ]);
    return {
      recentServiceRequests: svc.data ?? [],
      recentJobApplications: jobs.data ?? [],
      recentContactMessages: msgs.data ?? [],
      doctorsCount: doctorsCount.count ?? 0,
    };
  });
