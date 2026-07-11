import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listJobs, upsertJob, deleteJob } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Save, Trash2, Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnDanger, EmptyState } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/jobs")({ component: Page });
type Row = { id?: string; title: string; description: string; department: string | null; employment_type: string | null; location: string | null; is_open: boolean; sort_order: number };

function Page() {
  const l = useServerFn(listJobs); const u = useServerFn(upsertJob); const d = useServerFn(deleteJob);
  const [rows, setRows] = useState<Row[]>([]);
  async function load() { try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); } }
  useEffect(() => { load(); }, []);
  async function save(r: Row) { try { await u({ data: r }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function remove(id?: string) { if (!id || !confirm("حذف؟")) return; try { await d({ data: { id } }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function add() { const title = prompt("عنوان الوظيفة"); const description = prompt("الوصف"); if (!title || !description) return; await save({ title, description, department: "", employment_type: "", location: "", is_open: true, sort_order: rows.length }); }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="الوظائف" action={<button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> إضافة</button>} />
      {rows.length === 0 ? <EmptyState text="لا توجد وظائف." /> :
        rows.map((r) => <Row key={r.id} row={r} onSave={save} onRemove={() => remove(r.id)} />)}
    </div>
  );
}
function Row({ row, onSave, onRemove }: { row: Row; onSave: (r: Row) => void; onRemove: () => void }) {
  const [r, setR] = useState(row); useEffect(() => setR(row), [row]);
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="grid md:grid-cols-4 gap-2">
        <Field label="المسمى"><input className={inp} value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} /></Field>
        <Field label="القسم"><input className={inp} value={r.department ?? ""} onChange={(e) => setR({ ...r, department: e.target.value })} /></Field>
        <Field label="نوع العمل"><input className={inp} value={r.employment_type ?? ""} onChange={(e) => setR({ ...r, employment_type: e.target.value })} /></Field>
        <Field label="المكان"><input className={inp} value={r.location ?? ""} onChange={(e) => setR({ ...r, location: e.target.value })} /></Field>
      </div>
      <Field label="الوصف"><textarea rows={2} className={inp} value={r.description} onChange={(e) => setR({ ...r, description: e.target.value })} /></Field>
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={r.is_open} onChange={(e) => setR({ ...r, is_open: e.target.checked })} /> مفتوحة</label>
        <label className="flex items-center gap-2">الترتيب <input type="number" className="w-20 rounded border px-2 py-1" value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></label>
      </div>
      <div className="flex gap-2">
        <button className={btnPrimary} onClick={() => onSave(r)}><Save className="h-3 w-3" /> حفظ</button>
        <button className={btnDanger} onClick={onRemove}><Trash2 className="h-3 w-3" /> حذف</button>
      </div>
    </div>
  );
}
