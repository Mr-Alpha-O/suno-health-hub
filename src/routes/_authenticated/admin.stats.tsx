import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listStats, upsertStat, deleteStat } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, EmptyState } from "@/components/admin/CrudHelpers";
import { useListToolkit, ListToolbar, Pagination, RowSelect } from "@/components/admin/ListToolkit";
import { useEditableRow, RowActions } from "@/components/admin/RowActions";

export const Route = createFileRoute("/_authenticated/admin/stats")({ component: Page });
type Row = { id?: string; label: string; value: string | null; icon: string | null; sort_order: number; is_visible: boolean };

function Page() {
  const l = useServerFn(listStats); const u = useServerFn(upsertStat); const d = useServerFn(deleteStat);
  const [rows, setRows] = useState<Row[]>([]);
  async function load() { try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); } }
  useEffect(() => { load(); }, []);
  async function save(r: Row) {
    if (!r.label?.trim()) { toast.error("التسمية مطلوبة"); return; }
    try { await u({ data: r }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); }
  }
  async function remove(id?: string) { if (!id) return; try { await d({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function duplicate(r: Row) { const { id: _id, ...rest } = r; void _id; try { await u({ data: { ...rest, sort_order: rows.length } }); toast.success("تم النسخ"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function add() { const label = prompt("التسمية"); if (!label?.trim()) return; await save({ label: label.trim(), value: "", icon: "", sort_order: rows.length, is_visible: true }); }

  const state = useListToolkit<Row>(rows, {
    searchIn: (r) => `${r.label} ${r.value ?? ""}`,
    initialSort: "sort_order",
    filterFn: (r, f) => f === "visible" ? r.is_visible : f === "hidden" ? !r.is_visible : true,
  });
  async function bulk(ids: string[], fn: (id: string) => Promise<void>) {
    try { for (const id of ids) await fn(id); state.clearSelected(); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="الأرقام والإحصائيات" action={<button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> إضافة</button>} />
      <ListToolbar state={state} searchPlaceholder="بحث..." sortOptions={[{ key: "sort_order", label: "الترتيب" }, { key: "label", label: "التسمية" }]} filterOptions={[{ value: "visible", label: "ظاهر" }, { value: "hidden", label: "مخفي" }]}
        onBulkDelete={(ids) => bulk(ids, (id) => d({ data: { id } }).then(() => undefined))}
        onBulkShow={(ids) => bulk(ids, async (id) => { const r = rows.find((x) => x.id === id); if (r) await u({ data: { ...r, is_visible: true } }); })}
        onBulkHide={(ids) => bulk(ids, async (id) => { const r = rows.find((x) => x.id === id); if (r) await u({ data: { ...r, is_visible: false } }); })} />
      {state.paged.length === 0 ? <EmptyState text="لا توجد أرقام مطابقة." /> :
        <div className="grid gap-3">
          {state.paged.map((r) => <StatRow key={r.id} row={r} state={state} onSave={save} onRemove={() => remove(r.id)} onDuplicate={() => duplicate(r)} onToggleVisible={async () => { await u({ data: { ...r, is_visible: !r.is_visible } }); load(); }} />)}
        </div>}
      <Pagination state={state} />
    </div>
  );
}
function StatRow({ row, state, onSave, onRemove, onDuplicate, onToggleVisible }: { row: Row; state: ReturnType<typeof useListToolkit<Row>>; onSave: (r: Row) => Promise<void>; onRemove: () => Promise<void>; onDuplicate: () => Promise<void>; onToggleVisible: () => Promise<void>; }) {
  const [r, setR, dirty, clean] = useEditableRow(row);
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2"><RowSelect id={r.id} state={state as never} />{!r.is_visible && <span className="text-[10px] rounded-full bg-muted px-2 py-0.5">مخفي</span>}</div>
      <div className="grid md:grid-cols-5 gap-2">
        <Field label="القيمة"><input className={inp} value={r.value ?? ""} onChange={(e) => setR({ ...r, value: e.target.value })} /></Field>
        <Field label="التسمية *"><input className={inp} value={r.label} onChange={(e) => setR({ ...r, label: e.target.value })} /></Field>
        <Field label="أيقونة"><input className={inp} value={r.icon ?? ""} onChange={(e) => setR({ ...r, icon: e.target.value })} /></Field>
        <Field label="ترتيب"><input type="number" className={inp} value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></Field>
        <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={r.is_visible} onChange={(e) => setR({ ...r, is_visible: e.target.checked })} /> ظاهر</label>
      </div>
      <RowActions row={r} dirty={dirty} onSave={async () => { await onSave(r); clean(); }} onDelete={onRemove} onDuplicate={onDuplicate} onToggleVisible={onToggleVisible} />
    </div>
  );
}
