# SWNW Medical Care — Website + Admin Dashboard

Public marketing site (Arabic, RTL) plus a hidden admin dashboard backed by Lovable Cloud (Supabase) for managing content.

## Stack
- TanStack Start (React 19 + Vite 7)
- Tailwind v4 + shadcn/ui
- Lovable Cloud (Supabase Postgres + Auth + Storage)

## Environment variables

Auto-populated by Lovable Cloud in `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_PROJECT_ID=...
```

For Vercel: copy these into the project's Environment Variables (Production + Preview).

## Database (already migrated)

Tables created in `public`:
- `user_roles` — user↔role mapping (`app_role` enum: `admin`, `editor`).
- `site_settings` — key/JSON store for global settings (phone, whatsapp, seo, etc.).
- `service_categories` + `service_subs` — hierarchical services.
- `products` — store catalog (buy/rent/old prices, stock, featured, visibility).

Security definer function `public.has_role(uuid, app_role)` powers RLS admin checks.

RLS policies:
- Public tables (`site_settings`, `service_categories`, `service_subs`, `products`): anyone can `SELECT` visible rows; only admins can write.
- `user_roles`: users can read their own; only admins can modify.

## Storage bucket

- `media` (private) — RLS allows public read, admin-only writes.

## Admin access

1. Register the admin user account (email/password) via the Users page in Lovable Cloud.
2. Grant admin role by running this SQL in the Cloud → SQL editor:

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'YOUR_ADMIN_EMAIL';
   ```

3. Visit `/auth` on the site, log in, and you'll be redirected to `/admin`.

The admin area (`/admin`, `/auth`) is hidden from public navigation, sitemap, and robots (`noindex`).

### Admin pages
- `/admin` — dashboard with counts
- `/admin/settings` — key/value site settings
- `/admin/services` — categories + sub-services CRUD
- `/admin/products` — store catalog CRUD
- `/admin/media` — upload/copy/delete files

## Local development

```bash
bun install
bun run dev
```

## Deployment (Vercel)

- Framework: Other / Vite
- Build command: `bun run build` (or `npm run build`)
- Output directory: `.vercel/output` (auto, TanStack Start)
- Environment variables: copy from `.env` (see above)

## Notes
- The public website reads from the hardcoded `src/lib/site.ts` — DB-driven public pages will be wired up in the next phase; for now, the admin CRUD manages a parallel DB copy without changing public visuals.
- All auth uses email/password. Social sign-in is not enabled.
