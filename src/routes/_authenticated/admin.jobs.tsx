import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listJobs, upsertJob, deleteJob } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, EmptyState } from "@/components/admin/CrudHelpers";
import { useListToolkit, ListToolbar, Pagination, RowSelect } from "@/components/admin/ListToolkit";
import { useEditableRow, RowActions } from "@/components/admin/RowActions";

export const Route = createFileRoute("/_authenticated/admin/jobs")({ component: Page });
type Row = { id?: string; title: string; description: string | null; department: string | null; employment_type: string | null; location: string | null; is_open: boolean; sort_order: number; is_visible?: boolean };

function Page() {
  const l = useServerFn(listJobs); const u = useServerFn(upsertJob); const d = useServerFn(deleteJob);
  const [rows, setRows] = useState<Row[]>([]);
  async function load() { try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); } }
  useEffect(() => { load(); }, []);
  async function save(r: Row) {
    if (!r.title?.trim()) { toast.error("عنوان الوظيفة مطلوب"); return; }
    try { await u({ data: r }); toast.success("تم الحفظ"); load(); } catch (e) { toast.error((e as Error).message); }
  }
  async function remove(id?: string) { if (!id) return; try { await d({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function duplicate(r: Row) {
    const { id: _id, ...rest } = r; void _id;
    try { await u({ data: { ...rest, title: `${rest.title} (نسخة)`, sort_order: rows.length } }); toast.success("تم النسخ"); load(); } catch (e) { toast.error((e as Error).message); }
  }
  async function add() { const title = prompt("عنوان الوظيفة"); if (!title?.trim()) return; await save({ title: title.trim(), description: "", department: "", employment_type: "", location: "", is_open: true, sort_order: rows.length }); }

  const state = useListToolkit<Row>(rows, {
    searchIn: (r) => `${r.title} ${r.department ?? ""} ${r.location ?? ""}`,
    initialSort: "sort_order",
    filterFn: (r, f) => f === "open" ? r.is_open : f === "closed" ? !r.is_open : true,
  });

  async function bulk(ids: string[], fn: (id: string) => Promise<void>) {
    try { for (const id of ids) await fn(id); state.clearSelected(); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="الوظائف" desc="أدِر الوظائف المفتوحة." action={<button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> إضافة</button>} />
      <ListToolbar
        state={state}
        searchPlaceholder="بحث بالمسمى أو القسم..."
        sortOptions={[{ key: "sort_order", label: "الترتيب" }, { key: "title", label: "المسمى" }]}
        filterOptions={[{ value: "open", label: "مفتوحة" }, { value: "closed", label: "مغلقة" }]}
        onBulkDelete={(ids) => bulk(ids, (id) => d({ data: { id } }).then(() => undefined))}
        onBulkShow={(ids) => bulk(ids, async (id) => { const r = rows.find((x) => x.id === id); if (r) await u({ data: { ...r, is_open: true } }); })}
        onBulkHide={(ids) => bulk(ids, async (id) => { const r = rows.find((x) => x.id === id); if (r) await u({ data: { ...r, is_open: false } }); })}
      />
      {state.paged.length === 0 ? <EmptyState text="لا توجد وظائف مطابقة." /> :
        state.paged.map((r) => <JobRow key={r.id} row={r} state={state} onSave={save} onRemove={() => remove(r.id)} onDuplicate={() => duplicate(r)} onToggleVisible={async () => { await u({ data: { ...r, is_open: !r.is_open } }); load(); }} />)}
      <Pagination state={state} />
    </div>
  );
}
function JobRow({ row, state, onSave, onRemove, onDuplicate, onToggleVisible }: {
  row: Row; state: ReturnType<typeof useListToolkit<Row>>;
  onSave: (r: Row) => Promise<void>; onRemove: () => Promise<void>; onDuplicate: () => Promise<void>; onToggleVisible: () => Promise<void>;
}) {
  const [r, setR, dirty, clean] = useEditableRow(row);
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2"><RowSelect id={r.id} state={state as never} />{!r.is_open && <span className="text-[10px] rounded-full bg-muted px-2 py-0.5">مغلقة</span>}</div>
      <div className="grid md:grid-cols-4 gap-2">
        <Field label="المسمى *"><input className={inp} value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} /></Field>
        <Field label="القسم"><input className={inp} value={r.department ?? ""} onChange={(e) => setR({ ...r, department: e.target.value })} /></Field>
        <Field label="نوع العمل"><input className={inp} value={r.employment_type ?? ""} onChange={(e) => setR({ ...r, employment_type: e.target.value })} /></Field>
        <Field label="المكان"><input className={inp} value={r.location ?? ""} onChange={(e) => setR({ ...r, location: e.target.value })} /></Field>
      </div>
      <Field label="الوصف"><textarea rows={2} className={inp} value={r.description ?? ""} onChange={(e) => setR({ ...r, description: e.target.value })} /></Field>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={r.is_open} onChange={(e) => setR({ ...r, is_open: e.target.checked })} /> مفتوحة</label>
        <label className="flex items-center gap-2">الترتيب <input type="number" className="w-20 rounded border px-2 py-1" value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></label>
        <div className="ml-auto">
          <RowActions row={{ ...r, is_visible: r.is_open }} dirty={dirty} onSave={async () => { await onSave(r); clean(); }} onDelete={onRemove} onDuplicate={onDuplicate} onToggleVisible={onToggleVisible} />
        </div>
      </div>
    </div>
  );
}
