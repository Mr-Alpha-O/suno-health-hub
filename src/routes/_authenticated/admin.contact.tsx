import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getContactAdmin, upsertContact } from "@/lib/cms.functions";
import {
  listContactCollections,
  upsertContactItem,
  deleteContactItem,
  reorderContactItems,
  setPrimaryContactItem,
  type ContactCollectionKind,
} from "@/lib/contact-collections.functions";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnGhost, btnDanger, EmptyState } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/contact")({ component: Page });

type Info = { id?: string; phone: string | null; phone_intl: string | null; whatsapp: string | null; email: string | null; address: string | null; hours: string | null; map_embed: string | null; socials: Record<string, string>; is_active: boolean };
const EMPTY: Info = { phone: "", phone_intl: "", whatsapp: "", email: "", address: "", hours: "", map_embed: "", socials: {}, is_active: true };

type Item = Record<string, unknown> & { id?: string; is_primary?: boolean; is_visible?: boolean; sort_order?: number };
type Collections = { phones: Item[]; whatsapps: Item[]; emails: Item[]; branches: Item[] };

function Page() {
  const g = useServerFn(getContactAdmin);
  const u = useServerFn(upsertContact);
  const listAll = useServerFn(listContactCollections);
  const [c, setC] = useState<Info>(EMPTY);
  const [coll, setColl] = useState<Collections>({ phones: [], whatsapps: [], emails: [], branches: [] });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [info, all] = await Promise.all([g(), listAll()]);
      if (info) setC({ ...info, socials: (info.socials as Record<string, string>) ?? {} } as Info);
      setColl(all as Collections);
    } catch (e) { toast.error((e as Error).message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function saveInfo() {
    try { await u({ data: c }); toast.success("تم الحفظ"); } catch (e) { toast.error((e as Error).message); }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin" />;

  const socialKeys = ["facebook","instagram","twitter","linkedin","youtube","tiktok"];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader title="بيانات الاتصال" desc="أرقام هواتف، واتساب، بريد، وفروع متعددة — كلها تظهر في الفوتر وصفحة تواصل معنا." />

      <Collection
        title="أرقام الهواتف"
        kind="contact_phones"
        rows={coll.phones}
        onReload={load}
        fields={[
          { key: "label", label: "الاسم/الوصف", placeholder: "مثل: خدمة العملاء" },
          { key: "value", label: "الرقم *", ltr: true, required: true },
          { key: "value_intl", label: "بصيغة دولية (اختياري)", ltr: true, placeholder: "+201..." },
        ]}
      />

      <Collection
        title="أرقام واتساب"
        kind="contact_whatsapps"
        rows={coll.whatsapps}
        onReload={load}
        fields={[
          { key: "label", label: "الاسم/الوصف" },
          { key: "value", label: "الرقم (أرقام فقط) *", ltr: true, required: true, placeholder: "201..." },
        ]}
      />

      <Collection
        title="عناوين البريد الإلكتروني"
        kind="contact_emails"
        rows={coll.emails}
        onReload={load}
        fields={[
          { key: "label", label: "الاسم/الوصف" },
          { key: "value", label: "البريد *", ltr: true, required: true },
        ]}
      />

      <Collection
        title="الفروع / العناوين"
        kind="contact_branches"
        rows={coll.branches}
        onReload={load}
        fields={[
          { key: "name", label: "اسم الفرع" },
          { key: "address", label: "العنوان *", required: true },
          { key: "phone", label: "هاتف الفرع", ltr: true },
          { key: "hours", label: "ساعات العمل" },
          { key: "map_embed", label: "رابط خريطة (embed)", ltr: true },
        ]}
      />

      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="text-sm font-bold text-muted-foreground">إعدادات إضافية</div>
        <Field label="ساعات العمل العامة (احتياطي)"><input className={inp} value={c.hours ?? ""} onChange={(e) => setC({ ...c, hours: e.target.value })} /></Field>
        <div>
          <div className="text-sm font-bold mb-2">روابط التواصل الاجتماعي</div>
          <div className="grid md:grid-cols-2 gap-2">
            {socialKeys.map((k) => (
              <Field key={k} label={k}>
                <input dir="ltr" className={inp} value={c.socials[k] ?? ""} onChange={(e) => setC({ ...c, socials: { ...c.socials, [k]: e.target.value } })} />
              </Field>
            ))}
          </div>
        </div>
        <button onClick={saveInfo} className={btnPrimary}><Save className="h-3 w-3" /> حفظ الإعدادات</button>
      </div>
    </div>
  );
}

type FieldSpec = { key: string; label: string; placeholder?: string; ltr?: boolean; required?: boolean };

function Collection({ title, kind, rows, fields, onReload }: {
  title: string; kind: ContactCollectionKind; rows: Item[]; fields: FieldSpec[]; onReload: () => void;
}) {
  const up = useServerFn(upsertContactItem);
  const del = useServerFn(deleteContactItem);
  const reorder = useServerFn(reorderContactItems);
  const setPrimary = useServerFn(setPrimaryContactItem);

  async function save(row: Item) {
    try {
      const requiredKey = fields.find((f) => f.required)?.key;
      if (requiredKey && !String(row[requiredKey] ?? "").trim()) { toast.error("املأ الحقول المطلوبة"); return; }
      await up({ data: { kind, row } });
      toast.success("تم"); onReload();
    } catch (e) { toast.error((e as Error).message); }
  }
  async function remove(id?: string) {
    if (!id || !confirm("حذف؟")) return;
    try { await del({ data: { kind, id } }); toast.success("تم الحذف"); onReload(); } catch (e) { toast.error((e as Error).message); }
  }
  async function move(idx: number, delta: number) {
    const j = idx + delta;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[idx], next[j]] = [next[j], next[idx]];
    const items = next.map((r, i) => ({ id: String(r.id), sort_order: i }));
    try { await reorder({ data: { kind, items } }); onReload(); } catch (e) { toast.error((e as Error).message); }
  }
  async function makePrimary(id?: string) {
    if (!id) return;
    try { await setPrimary({ data: { kind, id } }); toast.success("تم التعيين"); onReload(); } catch (e) { toast.error((e as Error).message); }
  }
  async function addNew() {
    const empty: Item = { is_primary: rows.length === 0, is_visible: true, sort_order: rows.length };
    for (const f of fields) empty[f.key] = "";
    await save(empty);
  }

  return (
    <div className="bg-card border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-bold">{title} <span className="text-xs text-muted-foreground">({rows.length})</span></div>
        <button className={btnPrimary} onClick={addNew}><Plus className="h-3 w-3" /> إضافة</button>
      </div>
      {rows.length === 0 ? <EmptyState text="لا توجد عناصر بعد." /> :
        rows.map((row, i) => (
          <Row
            key={String(row.id)}
            row={row}
            fields={fields}
            isFirst={i === 0}
            isLast={i === rows.length - 1}
            onSave={save}
            onRemove={() => remove(row.id)}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            onPrimary={() => makePrimary(row.id)}
          />
        ))
      }
    </div>
  );
}

function Row({ row, fields, isFirst, isLast, onSave, onRemove, onUp, onDown, onPrimary }: {
  row: Item; fields: FieldSpec[]; isFirst: boolean; isLast: boolean;
  onSave: (r: Item) => void; onRemove: () => void; onUp: () => void; onDown: () => void; onPrimary: () => void;
}) {
  const [r, setR] = useState<Item>(row);
  useEffect(() => setR(row), [row]);

  return (
    <div className="border rounded-lg p-3 bg-muted/20 space-y-2">
      <div className="grid md:grid-cols-3 gap-2">
        {fields.map((f) => (
          <Field key={f.key} label={f.label}>
            <input
              dir={f.ltr ? "ltr" : undefined}
              placeholder={f.placeholder}
              className={inp}
              value={String(r[f.key] ?? "")}
              onChange={(e) => setR({ ...r, [f.key]: e.target.value })}
            />
          </Field>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!r.is_visible} onChange={(e) => setR({ ...r, is_visible: e.target.checked })} /> ظاهر</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!r.is_primary} onChange={(e) => setR({ ...r, is_primary: e.target.checked })} /> رئيسي</label>
        {r.is_primary ? <span className="text-primary font-bold flex items-center gap-1"><Star className="h-3 w-3 fill-current" /> رئيسي</span> : null}
        <div className="ml-auto flex gap-1">
          <button className={btnGhost} disabled={isFirst} onClick={onUp}><ArrowUp className="h-3 w-3" /></button>
          <button className={btnGhost} disabled={isLast} onClick={onDown}><ArrowDown className="h-3 w-3" /></button>
          {!r.is_primary && r.id && <button className={btnGhost} onClick={onPrimary}><Star className="h-3 w-3" /> جعله رئيسي</button>}
          <button className={btnPrimary} onClick={() => onSave(r)}><Save className="h-3 w-3" /> حفظ</button>
          <button className={btnDanger} onClick={onRemove}><Trash2 className="h-3 w-3" /> حذف</button>
        </div>
      </div>
    </div>
  );
}
