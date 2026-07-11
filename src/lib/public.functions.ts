import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function anonClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const phoneRe = /^[0-9+\s\-()]{6,30}$/;

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
