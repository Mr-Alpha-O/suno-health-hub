import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ================= HERO ================= */
const HeroSchema = z.object({
  id: z.string().uuid().optional(),
  badge: z.string().nullable().optional(),
  headline: z.string().min(1),
  headline_highlight: z.string().nullable().optional(),
  subheading: z.string().nullable().optional(),
  cta_primary_label: z.string().nullable().optional(),
  cta_primary_href: z.string().nullable().optional(),
  cta_secondary_label: z.string().nullable().optional(),
  cta_secondary_href: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  is_active: z.boolean().default(true),
});
export const getHeroAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("hero_content").select("*").order("created_at").limit(1).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });
export const upsertHero = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(HeroSchema)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("hero_content").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ================= WHY US ================= */
const WhySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),

  icon: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});
export const listWhy = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("why_us_items").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});
export const upsertWhy = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(WhySchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("why_us_items").upsert(data);
  if (error) throw new Error(error.message);
  return { ok: true };
});
export const deleteWhy = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("why_us_items").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true };
});

/* ================= ABOUT ================= */
const AboutSchema = z.object({
  id: z.string().uuid().optional(),
  intro: z.string().nullable().optional(),
  mission: z.string().nullable().optional(),
  vision: z.string().nullable().optional(),
  story: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  values: z.array(z.object({ title: z.string(), desc: z.string() })).default([]),
  is_active: z.boolean().default(true),
});
export const getAboutAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("about_content").select("*").order("created_at").limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});
export const upsertAbout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(AboutSchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("about_content").upsert(data);
  if (error) throw new Error(error.message);
  return { ok: true };
});

/* ================= TEAM ================= */
const TeamSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  photo_url: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});
export const listTeam = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("team_members").select("*").order("sort_order");
  if (error) throw new Error(error.message); return data;
});
export const upsertTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(TeamSchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("team_members").upsert(data);
  if (error) throw new Error(error.message); return { ok: true };
});
export const deleteTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("team_members").delete().eq("id", data.id);
  if (error) throw new Error(error.message); return { ok: true };
});

/* ================= TESTIMONIALS ================= */
const TestSchema = z.object({
  id: z.string().uuid().optional(),
  author: z.string().min(1),
  role: z.string().nullable().optional(),
  quote: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  photo_url: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});
export const listTestimonials = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("testimonials").select("*").order("sort_order");
  if (error) throw new Error(error.message); return data;
});
export const upsertTestimonial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(TestSchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("testimonials").upsert(data);
  if (error) throw new Error(error.message); return { ok: true };
});
export const deleteTestimonial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("testimonials").delete().eq("id", data.id);
  if (error) throw new Error(error.message); return { ok: true };
});

/* ================= FAQS ================= */
const FaqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1),
  answer: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});
export const listFaqs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("faqs").select("*").order("sort_order");
  if (error) throw new Error(error.message); return data;
});
export const upsertFaq = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(FaqSchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("faqs").upsert(data);
  if (error) throw new Error(error.message); return { ok: true };
});
export const deleteFaq = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("faqs").delete().eq("id", data.id);
  if (error) throw new Error(error.message); return { ok: true };
});

/* ================= STATS ================= */
const StatSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1),
  value: z.string().min(1),
  icon: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});
export const listStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("site_stats").select("*").order("sort_order");
  if (error) throw new Error(error.message); return data;
});
export const upsertStat = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(StatSchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("site_stats").upsert(data);
  if (error) throw new Error(error.message); return { ok: true };
});
export const deleteStat = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("site_stats").delete().eq("id", data.id);
  if (error) throw new Error(error.message); return { ok: true };
});

/* ================= JOBS ================= */
const JobSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  department: z.string().nullable().optional(),
  employment_type: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  is_open: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});
export const listJobs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("jobs").select("*").order("sort_order");
  if (error) throw new Error(error.message); return data;
});
export const upsertJob = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(JobSchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("jobs").upsert(data);
  if (error) throw new Error(error.message); return { ok: true };
});
export const deleteJob = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("jobs").delete().eq("id", data.id);
  if (error) throw new Error(error.message); return { ok: true };
});

/* ================= CONTACT INFO ================= */
const ContactSchema = z.object({
  id: z.string().uuid().optional(),
  phone: z.string().nullable().optional(),
  phone_intl: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  hours: z.string().nullable().optional(),
  map_embed: z.string().nullable().optional(),
  socials: z.record(z.string(), z.string()).default({}),
  is_active: z.boolean().default(true),
});
export const getContactAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("contact_info").select("*").order("created_at").limit(1).maybeSingle();
  if (error) throw new Error(error.message); return data;
});
export const upsertContact = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(ContactSchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("contact_info").upsert(data);
  if (error) throw new Error(error.message); return { ok: true };
});

/* ================= NAV ================= */
const NavSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1),
  href: z.string().min(1),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});
export const listNav = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("nav_items").select("*").order("sort_order");
  if (error) throw new Error(error.message); return data;
});
export const upsertNav = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(NavSchema).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("nav_items").upsert(data);
  if (error) throw new Error(error.message); return { ok: true };
});
export const deleteNav = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("nav_items").delete().eq("id", data.id);
  if (error) throw new Error(error.message); return { ok: true };
});

/* ================= SUBMISSIONS ================= */
export const listServiceSubmissions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("service_submissions").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(error.message); return data;
});
export const listJobApplications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("job_applications").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(error.message); return data;
});
export const listContactMessages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(error.message); return data;
});
const StatusEnum = z.enum(["new","contacted","in_progress","done","archived"]);
const StatusUpdate = z.object({
  table: z.enum(["service_submissions","job_applications","contact_messages"]),
  id: z.string().uuid(),
  status: StatusEnum,
  admin_notes: z.string().max(2000).optional().nullable(),
});
export const updateSubmissionStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(StatusUpdate).handler(async ({ data, context }) => {
  const patch: { status: z.infer<typeof StatusEnum>; admin_notes?: string | null } = { status: data.status };
  if (data.admin_notes !== undefined) patch.admin_notes = data.admin_notes;
  const { error } = await context.supabase.from(data.table).update(patch).eq("id", data.id);
  if (error) throw new Error(error.message); return { ok: true };
});
const DeleteSubmission = z.object({
  table: z.enum(["service_submissions","job_applications","contact_messages"]),
  id: z.string().uuid(),
});
export const deleteSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(DeleteSubmission).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
  if (error) throw new Error(error.message); return { ok: true };
});

/* ================= DASHBOARD COUNTS ================= */
export const getDashboardCounts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const tables = [
    "service_submissions","job_applications","contact_messages",
    "products","service_categories","team_members","jobs","testimonials","faqs",
  ] as const;
  const results = await Promise.all(tables.map(async (t) => {
    const { count } = await context.supabase.from(t).select("*", { count: "exact", head: true });
    return [t, count ?? 0] as const;
  }));
  const newCounts = await Promise.all((["service_submissions","job_applications","contact_messages"] as const).map(async (t) => {
    const { count } = await context.supabase.from(t).select("*", { count: "exact", head: true }).eq("status", "new");
    return [t, count ?? 0] as const;
  }));
  return {
    totals: Object.fromEntries(results) as Record<(typeof tables)[number], number>,
    newInbox: Object.fromEntries(newCounts) as Record<"service_submissions"|"job_applications"|"contact_messages", number>,
  };
});
