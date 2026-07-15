import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Kind = z.enum(["contact_phones", "contact_whatsapps", "contact_emails", "contact_branches"]);
type KindT = z.infer<typeof Kind>;

const PhoneRow = z.object({
  id: z.string().uuid().optional(),
  label: z.string().nullable().optional(),
  value: z.string().min(1),
  value_intl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  is_primary: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});
const SimpleRow = z.object({
  id: z.string().uuid().optional(),
  label: z.string().nullable().optional(),
  value: z.string().min(1),
  notes: z.string().nullable().optional(),
  is_primary: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});
const BranchRow = z.object({
  id: z.string().uuid().optional(),
  name: z.string().nullable().optional(),
  address: z.string().min(1),
  phone: z.string().nullable().optional(),
  hours: z.string().nullable().optional(),
  map_embed: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  is_primary: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const listContactCollections = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase as any;
    const [phones, whatsapps, emails, branches] = await Promise.all([
      sb.from("contact_phones").select("*").order("sort_order"),
      sb.from("contact_whatsapps").select("*").order("sort_order"),
      sb.from("contact_emails").select("*").order("sort_order"),
      sb.from("contact_branches").select("*").order("sort_order"),
    ]);
    return {
      phones: phones.data ?? [],
      whatsapps: whatsapps.data ?? [],
      emails: emails.data ?? [],
      branches: branches.data ?? [],
    };
  });

const UpsertInput = z.object({
  kind: Kind,
  row: z.record(z.string(), z.any()),
});
export const upsertContactItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(UpsertInput)
  .handler(async ({ data, context }) => {
    const sb = context.supabase as any;
    const parsed =
      data.kind === "contact_phones" ? PhoneRow.parse(data.row) :
      data.kind === "contact_branches" ? BranchRow.parse(data.row) :
      SimpleRow.parse(data.row);
    // Enforce single primary per collection
    if (parsed.is_primary) {
      await sb.from(data.kind).update({ is_primary: false }).eq("is_primary", true);
    }
    const { error } = await sb.from(data.kind).upsert(parsed);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteContactItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ kind: Kind, id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const sb = context.supabase as any;
    const { error } = await sb.from(data.kind).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderContactItems = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    kind: Kind,
    items: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int() })),
  }))
  .handler(async ({ data, context }) => {
    const sb = context.supabase as any;
    for (const it of data.items) {
      const { error } = await sb.from(data.kind).update({ sort_order: it.sort_order }).eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const setPrimaryContactItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ kind: Kind, id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const sb = context.supabase as any;
    await sb.from(data.kind).update({ is_primary: false }).eq("is_primary", true);
    const { error } = await sb.from(data.kind).update({ is_primary: true }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type ContactCollectionKind = KindT;
