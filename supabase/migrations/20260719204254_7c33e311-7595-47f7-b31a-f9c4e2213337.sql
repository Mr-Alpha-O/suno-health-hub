
-- Phase 4: relocate has_role out of the API-exposed public schema.
-- PostgREST only exposes functions in schemas listed in db-schema (public);
-- moving to a "private" schema removes it as an RPC without breaking RLS,
-- because RLS policies reference the function by OID.

CREATE SCHEMA IF NOT EXISTS private;

-- Move the function.
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;

-- Harden search_path (already set to public) and re-declare grants explicitly.
ALTER FUNCTION private.has_role(uuid, public.app_role) SET search_path = public;

-- Lock down direct execution: only roles that must evaluate RLS get EXECUTE.
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- Keep a thin public wrapper ONLY if application code calls it as RPC.
-- Current codebase does not RPC-call has_role, so no wrapper is created.
