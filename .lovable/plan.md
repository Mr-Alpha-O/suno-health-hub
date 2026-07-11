## Phase 2 — Full CMS on managed backend

Goal: every public page reads from the database, the admin dashboard manages every piece of content, and the rendered UI stays byte-identical to what's live now.

### Ground rules
- No visual changes. All existing Tailwind classes, layouts, animations, colors, RTL behavior, hero image, and icon set stay exactly as they are.
- `src/lib/site.ts` becomes the seed source, not the runtime source. Public pages call `createServerFn` + TanStack Query in loaders; markup is unchanged.
- Public reads use a server publishable client (anon key, narrow `SELECT TO anon` policies) — no service role, no auth required.
- Admin writes stay under `_authenticated/admin` with `requireSupabaseAuth` + `has_role('admin')`.
- Every new public table gets a seed migration populated from current `site.ts` values so the site looks identical the moment we cut over.

### Step 1 — Schema + seed migration
New tables (RLS on, GRANTs, `TO anon` SELECT on visible rows only, admin writes):
- `hero_content` (single-row): eyebrow badge, headline parts, subheading, primary CTA, secondary CTA, hero image URL, stats array (JSONB).
- `why_us_items`: title, desc, sort_order, is_visible.
- `about_content` (single-row JSONB): intro, mission, vision, values, story sections.
- `team_members`: name, role, photo URL, bio, sort_order, is_visible.
- `testimonials`: author, role/location, quote, rating, is_visible, sort_order.
- `faqs`: question, answer, category, sort_order, is_visible.
- `stats`: label, value, icon, sort_order (for site-wide counters).
- `jobs`: title, desc, department, employment_type, is_open, sort_order.
- `contact_info` (single-row): phone, phone_intl, whatsapp, email, address, hours, map_embed, socials JSONB.
- `nav_items`: label, to, sort_order, is_visible.
- `service_submissions`: name, phone, service_slug, sub_service, notes, status (`new`/`contacted`/`done`), created_at.
- `job_applications`: name, phone, position, cv_url, notes, status, created_at.
- `contact_messages`: name, email, phone, subject, message, status, created_at.
- Extend `products` with `product_images` child table (url, alt, sort_order).

Existing `service_categories` / `service_subs` / `site_settings` / `products` stay as-is.

One combined migration file per table with grants + RLS + policies + a data-seed `INSERT` from current `site.ts`.

### Step 2 — Public data layer (`src/lib/public.functions.ts`)
Server functions that use the server publishable client, no auth:
- `getHero`, `getWhyUs`, `getServiceCategoriesPublic`, `getFeaturedProducts`, `getAllProductsPublic`, `getProductBySlug`, `getAbout`, `getTeam`, `getTestimonials`, `getFaqs`, `getJobsPublic`, `getContactInfo`, `getNavItems`, `getSiteSettings`.
- Public submission fns: `submitServiceRequest`, `submitJobApplication`, `submitContactMessage` (validated with zod, insert into log tables, no auth).

TanStack Query wiring: `queryOptions` per fetcher, loaders call `ensureQueryData`, components call `useSuspenseQuery`. Existing routes swap their static imports for hooks — markup untouched.

### Step 3 — Rewire public routes (no UI change)
- `index.tsx`: hero, services grid, why-us, ambulance banner, store teaser all from DB.
- `about.tsx`: from `about_content` + `team_members` + `stats`.
- `services.tsx`: from `service_categories` + `service_subs`.
- `store.tsx` + `store.$slug.tsx`: from `products` + `product_images`.
- `request.tsx`: category list from DB; form submits via `submitServiceRequest`.
- `careers.tsx`: jobs from `jobs`; application form submits via `submitJobApplication`.
- `contact.tsx`: contact info from `contact_info`; form submits via `submitContactMessage`.
- `__root.tsx` head: SEO defaults from `site_settings` (title, description, og). Contact/nav loaded once and threaded through `Header`/`Footer`.
- `sitemap[.]xml.ts`: URLs from DB (products, service categories) instead of static list.

Everything keeps its existing images (imported assets stay unless the admin uploads a replacement) and its exact class strings.

### Step 4 — Admin CMS pages
Add pages under `_authenticated/admin/`:
- `admin.hero.tsx` — hero editor (image picker → media bucket).
- `admin.why-us.tsx` — CRUD table.
- `admin.about.tsx` — long-form editor with sections.
- `admin.team.tsx` — CRUD + image upload.
- `admin.testimonials.tsx` — CRUD.
- `admin.faqs.tsx` — CRUD with category grouping.
- `admin.stats.tsx` — CRUD.
- `admin.jobs.tsx` — CRUD.
- `admin.contact.tsx` — single-form editor.
- `admin.nav.tsx` — reorderable list.
- `admin.submissions.tsx` — three tabs (service requests, job applications, contact messages) with status updates and CSV export.
- `admin.seo.tsx` — global SEO settings (title suffix, default description, og image, robots overrides).
- Extend `admin.products.tsx` with the image gallery editor tied to `product_images`.
- Sidebar in `admin.tsx` gets the new links; dashboard index shows counts + latest submissions.

All CRUD via `createServerFn` + `requireSupabaseAuth` + `has_role` check, TanStack Query mutations, sonner toasts, confirm dialogs on delete.

### Step 5 — Media + SEO + hardening
- Media library gets folder support (`hero/`, `team/`, `products/`, `about/`) and an image-picker component reused across admin editors.
- SEO settings surface into `__root.tsx` head and per-route heads via loader data (public route heads read from `getSiteSettings`).
- Add indexes on `sort_order` and `is_visible` for read-heavy tables.
- Robots: keep `/admin` and `/auth` disallowed.
- Run linter + typecheck; fix any warnings tied to new code.

### Step 6 — Verify
- Load every public route in the preview and diff against current visual state (spot-check hero, services grid, store card, request form default service).
- Sign in to `/admin`, exercise CRUD on every new page, confirm public site reflects changes without redeploy.
- Submit one contact / service / job entry from the public site, confirm it appears in `admin.submissions.tsx`.

### Technical details (for reference)
- All new public tables get: `id uuid pk`, `created_at`, `updated_at`, `is_visible boolean default true` where relevant, `sort_order int default 0`.
- Policies: `SELECT TO anon USING (is_visible OR has_role(auth.uid(),'admin'))` for content tables; submissions get `INSERT TO anon` + `SELECT/UPDATE TO authenticated` (admin only via `has_role`).
- Public server fns instantiate `createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } })` inside the handler — never at module scope, never `supabaseAdmin`.
- Loaders on public routes call `context.queryClient.ensureQueryData(...)`; components use `useSuspenseQuery`. Route `errorComponent` + `notFoundComponent` added where missing.
- `src/lib/site.ts` is kept as fallback constants only for values not yet moved (e.g. static asset URLs); rewired consumers stop importing it once migrated.

### Delivery order (across turns)
1. Migration + public data layer + rewire index/services/store (largest chunk).
2. Rewire about/careers/contact/request + submissions tables + submit fns.
3. Admin CMS pages for all new tables + submissions inbox + SEO editor.
4. Media picker upgrade + final SEO wiring + linter/typecheck pass + verification.

Each turn ships a working state; the site stays visually identical throughout.