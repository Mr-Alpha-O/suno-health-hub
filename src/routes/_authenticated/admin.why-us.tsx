import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listWhy, upsertWhy, deleteWhy } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Save, Trash2, Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnDanger, btnGhost, EmptyState } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/why-us")({ component: WhyPage });

type Row = { id?: string; title: string; description: string; icon: string | null; sort_order: number; is_visible: boolean };

function WhyPage() {
  const l = useServerFn(listWhy); const u = useServerFn(upsertWhy); const d = useServerFn(deleteWhy);
  const [rows, setRows] = useState<Row[]>([]);
  async function load() { try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); } }
  useEffect(() => { load(); }, []);

  async function save(r: Row) { try { await u({ data: r }); toast.success("تم الحفظ"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function remove(id?: string) { if (!id || !confirm("حذف؟")) return; try { await d({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function add() {
    const title = prompt("العنوان"); const description = prompt("الوصف");
    if (!title || !description) return;
    await save({ title, description, icon: "shield-check", sort_order: rows.length, is_visible: true });
  }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="لماذا نحن" desc="بطاقات مزايا الشركة." action={<button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> إضافة</button>} />
      {rows.length === 0 ? <EmptyState text="لا توجد بطاقات." /> :
        rows.map((r) => <Card key={r.id} row={r} onSave={save} onRemove={() => remove(r.id)} />)}
    </div>
  );
}

function Card({ row, onSave, onRemove }: { row: Row; onSave: (r: Row) => void; onRemove: () => void }) {
  const [r, setR] = useState(row);
  useEffect(() => setR(row), [row]);
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="grid md:grid-cols-4 gap-2">
        <Field label="العنوان"><input className={inp} value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} /></Field>
        <Field label="الأيقونة"><input className={inp} value={r.icon ?? ""} onChange={(e) => setR({ ...r, icon: e.target.value })} placeholder="shield-check" /></Field>
        <Field label="الترتيب"><input type="number" className={inp} value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></Field>
        <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={r.is_visible} onChange={(e) => setR({ ...r, is_visible: e.target.checked })} /> ظاهر</label>
      </div>
      <Field label="الوصف"><textarea rows={2} className={inp} value={r.description} onChange={(e) => setR({ ...r, description: e.target.value })} /></Field>
      <div className="flex gap-2">
        <button className={btnPrimary} onClick={() => onSave(r)}><Save className="h-3 w-3" /> حفظ</button>
        <button className={btnDanger} onClick={onRemove}><Trash2 className="h-3 w-3" /> حذف</button>
      </div>
    </div>
  );
}
