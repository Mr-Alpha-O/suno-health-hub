import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listDoctors, upsertDoctor, deleteDoctor } from "@/lib/doctors-sections.functions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, EmptyState } from "@/components/admin/CrudHelpers";
import { useListToolkit, ListToolbar, Pagination, RowSelect } from "@/components/admin/ListToolkit";
import { useEditableRow, RowActions } from "@/components/admin/RowActions";

export const Route = createFileRoute("/_authenticated/admin/doctors")({ component: Page });

type Row = {
  id?: string; name: string; specialty: string | null; description: string | null;
  qualifications: string | null; experience: string | null; photo_url: string | null;
  phone: string | null; whatsapp: string | null;
  is_available: boolean; sort_order: number; is_visible: boolean;
};

function Page() {
  const l = useServerFn(listDoctors);
  const u = useServerFn(upsertDoctor);
  const d = useServerFn(deleteDoctor);
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); }
  }
  useEffect(() => { load(); }, []);

  async function save(r: Row) {
    if (!r.name?.trim()) { toast.error("اسم الطبيب مطلوب"); return; }
    try { await u({ data: r }); toast.success("تم الحفظ"); load(); } catch (e) { toast.error((e as Error).message); }
  }
  async function remove(id?: string) {
    if (!id) return;
    try { await d({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e) { toast.error((e as Error).message); }
  }
  async function duplicate(r: Row) {
    const { id, ...rest } = r;
    void id;
    try { await u({ data: { ...rest, name: `${rest.name} (نسخة)`, sort_order: rows.length } }); toast.success("تم النسخ"); load(); } catch (e) { toast.error((e as Error).message); }
  }
  async function add() {
    const name = prompt("اسم الطبيب");
    if (!name?.trim()) return;
    await save({
      name: name.trim(), specialty: "", description: "", qualifications: "", experience: "",
      photo_url: "", phone: "", whatsapp: "", is_available: true,
      sort_order: rows.length, is_visible: true,
    });
  }

  const state = useListToolkit<Row>(rows, {
    searchIn: (r) => `${r.name} ${r.specialty ?? ""} ${r.experience ?? ""}`,
    initialSort: "sort_order",
    filterFn: (r, f) => f === "visible" ? r.is_visible : f === "hidden" ? !r.is_visible : f === "available" ? r.is_available : true,
  });

  async function bulk(ids: string[], fn: (id: string) => Promise<void>) {
    try { for (const id of ids) await fn(id); state.clearSelected(); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader
        title="الأطباء"
        desc="أدِر قائمة الأطباء التي تظهر على الموقع."
        action={<button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> طبيب جديد</button>}
      />
      <ListToolbar
        state={state}
        searchPlaceholder="بحث بالاسم أو التخصص..."
        sortOptions={[
          { key: "sort_order", label: "الترتيب" },
          { key: "name", label: "الاسم" },
          { key: "specialty", label: "التخصص" },
        ]}
        filterOptions={[
          { value: "visible", label: "ظاهر فقط" },
          { value: "hidden", label: "مخفي فقط" },
          { value: "available", label: "متاح للحجز" },
        ]}
        onBulkDelete={(ids) => bulk(ids, (id) => d({ data: { id } }).then(() => undefined))}
        onBulkShow={(ids) => bulk(ids, async (id) => { const r = rows.find((x) => x.id === id); if (r) await u({ data: { ...r, is_visible: true } }); })}
        onBulkHide={(ids) => bulk(ids, async (id) => { const r = rows.find((x) => x.id === id); if (r) await u({ data: { ...r, is_visible: false } }); })}
      />
      {state.paged.length === 0
        ? <EmptyState text="لا يوجد أطباء مطابقون." />
        : state.paged.map((r) => (
          <DocRow key={r.id} row={r} state={state} onSave={save} onRemove={() => remove(r.id)}
            onDuplicate={() => duplicate(r)}
            onToggleVisible={async () => { await u({ data: { ...r, is_visible: !r.is_visible } }); load(); }}
          />
        ))
      }
      <Pagination state={state} />
    </div>
  );
}

function DocRow({ row, state, onSave, onRemove, onDuplicate, onToggleVisible }: {
  row: Row;
  state: ReturnType<typeof useListToolkit<Row>>;
  onSave: (r: Row) => Promise<void>;
  onRemove: () => Promise<void>;
  onDuplicate: () => Promise<void>;
  onToggleVisible: () => Promise<void>;
}) {
  const [r, setR, dirty, clean] = useEditableRow(row);
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <RowSelect id={r.id} state={state as never} />
        {!r.is_visible && <span className="text-[10px] rounded-full bg-muted px-2 py-0.5">مخفي</span>}
      </div>
      <div className="grid md:grid-cols-4 gap-2">
        <Field label="الاسم *"><input className={inp} value={r.name} onChange={(e) => setR({ ...r, name: e.target.value })} /></Field>
        <Field label="التخصص"><input className={inp} value={r.specialty ?? ""} onChange={(e) => setR({ ...r, specialty: e.target.value })} /></Field>
        <Field label="الخبرة"><input className={inp} value={r.experience ?? ""} onChange={(e) => setR({ ...r, experience: e.target.value })} /></Field>
        <Field label="الترتيب"><input type="number" className={inp} value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></Field>
      </div>
      <Field label="المؤهلات"><input className={inp} value={r.qualifications ?? ""} onChange={(e) => setR({ ...r, qualifications: e.target.value })} /></Field>
      <Field label="نبذة"><textarea rows={2} className={inp} value={r.description ?? ""} onChange={(e) => setR({ ...r, description: e.target.value })} /></Field>
      <div className="grid md:grid-cols-3 gap-2">
        <Field label="رابط الصورة">
          <input className={inp} value={r.photo_url ?? ""} onChange={(e) => setR({ ...r, photo_url: e.target.value })} />
          {r.photo_url && <img src={r.photo_url} alt="" className="mt-2 h-16 w-16 rounded-lg object-cover border" onError={(e) => (e.currentTarget.style.display = "none")} />}
        </Field>
        <Field label="هاتف (اختياري)"><input className={inp} value={r.phone ?? ""} onChange={(e) => setR({ ...r, phone: e.target.value })} dir="ltr" /></Field>
        <Field label="واتساب (اختياري)"><input className={inp} value={r.whatsapp ?? ""} onChange={(e) => setR({ ...r, whatsapp: e.target.value })} dir="ltr" /></Field>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-1"><input type="checkbox" checked={r.is_available} onChange={(e) => setR({ ...r, is_available: e.target.checked })} /> متاح للحجز</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={r.is_visible} onChange={(e) => setR({ ...r, is_visible: e.target.checked })} /> ظاهر</label>
        <div className="ml-auto">
          <RowActions row={r} dirty={dirty} onSave={async () => { await onSave(r); clean(); }} onDelete={onRemove} onDuplicate={onDuplicate} onToggleVisible={onToggleVisible} />
        </div>
      </div>
    </div>
  );
}
