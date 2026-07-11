import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listStats, upsertStat, deleteStat } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Save, Trash2, Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnDanger, EmptyState } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/stats")({ component: Page });
type Row = { id?: string; label: string; value: string; icon: string | null; sort_order: number; is_visible: boolean };

function Page() {
  const l = useServerFn(listStats); const u = useServerFn(upsertStat); const d = useServerFn(deleteStat);
  const [rows, setRows] = useState<Row[]>([]);
  async function load() { try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); } }
  useEffect(() => { load(); }, []);
  async function save(r: Row) { try { await u({ data: r }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function remove(id?: string) { if (!id || !confirm("حذف؟")) return; try { await d({ data: { id } }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function add() { const label = prompt("التسمية"); const value = prompt("القيمة"); if (!label || !value) return; await save({ label, value, icon: "", sort_order: rows.length, is_visible: true }); }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="الأرقام والإحصائيات" action={<button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> إضافة</button>} />
      {rows.length === 0 ? <EmptyState text="لا توجد أرقام." /> :
        <div className="grid gap-3">
          {rows.map((r) => <Row key={r.id} row={r} onSave={save} onRemove={() => remove(r.id)} />)}
        </div>}
    </div>
  );
}
function Row({ row, onSave, onRemove }: { row: Row; onSave: (r: Row) => void; onRemove: () => void }) {
  const [r, setR] = useState(row); useEffect(() => setR(row), [row]);
  return (
    <div className="bg-card border rounded-xl p-4 grid md:grid-cols-6 gap-2 items-end">
      <Field label="القيمة"><input className={inp} value={r.value} onChange={(e) => setR({ ...r, value: e.target.value })} /></Field>
      <Field label="التسمية"><input className={inp} value={r.label} onChange={(e) => setR({ ...r, label: e.target.value })} /></Field>
      <Field label="أيقونة"><input className={inp} value={r.icon ?? ""} onChange={(e) => setR({ ...r, icon: e.target.value })} /></Field>
      <Field label="ترتيب"><input type="number" className={inp} value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.is_visible} onChange={(e) => setR({ ...r, is_visible: e.target.checked })} /> ظاهر</label>
      <div className="flex gap-1">
        <button className={btnPrimary} onClick={() => onSave(r)}><Save className="h-3 w-3" /></button>
        <button className={btnDanger} onClick={onRemove}><Trash2 className="h-3 w-3" /></button>
      </div>
    </div>
  );
}
