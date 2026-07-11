import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listTestimonials, upsertTestimonial, deleteTestimonial } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Save, Trash2, Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnDanger, EmptyState } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({ component: Page });
type Row = { id?: string; author: string; role: string | null; quote: string; rating: number; photo_url: string | null; sort_order: number; is_visible: boolean };

function Page() {
  const l = useServerFn(listTestimonials); const u = useServerFn(upsertTestimonial); const d = useServerFn(deleteTestimonial);
  const [rows, setRows] = useState<Row[]>([]);
  async function load() { try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); } }
  useEffect(() => { load(); }, []);
  async function save(r: Row) { try { await u({ data: r }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function remove(id?: string) { if (!id || !confirm("حذف؟")) return; try { await d({ data: { id } }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function add() { const author = prompt("اسم العميل"); const quote = prompt("الشهادة"); if (!author || !quote) return; await save({ author, role: "", quote, rating: 5, photo_url: "", sort_order: rows.length, is_visible: true }); }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="آراء العملاء" action={<button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> إضافة</button>} />
      {rows.length === 0 ? <EmptyState text="لا توجد شهادات بعد." /> :
        rows.map((r) => <Row key={r.id} row={r} onSave={save} onRemove={() => remove(r.id)} />)}
    </div>
  );
}
function Row({ row, onSave, onRemove }: { row: Row; onSave: (r: Row) => void; onRemove: () => void }) {
  const [r, setR] = useState(row); useEffect(() => setR(row), [row]);
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="grid md:grid-cols-4 gap-2">
        <Field label="الاسم"><input className={inp} value={r.author} onChange={(e) => setR({ ...r, author: e.target.value })} /></Field>
        <Field label="الوصف/الجهة"><input className={inp} value={r.role ?? ""} onChange={(e) => setR({ ...r, role: e.target.value })} /></Field>
        <Field label="التقييم (1-5)"><input type="number" min={1} max={5} className={inp} value={r.rating} onChange={(e) => setR({ ...r, rating: Number(e.target.value) })} /></Field>
        <Field label="الترتيب"><input type="number" className={inp} value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></Field>
      </div>
      <Field label="الشهادة"><textarea rows={2} className={inp} value={r.quote} onChange={(e) => setR({ ...r, quote: e.target.value })} /></Field>
      <Field label="رابط الصورة"><input className={inp} value={r.photo_url ?? ""} onChange={(e) => setR({ ...r, photo_url: e.target.value })} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.is_visible} onChange={(e) => setR({ ...r, is_visible: e.target.checked })} /> ظاهر</label>
      <div className="flex gap-2">
        <button className={btnPrimary} onClick={() => onSave(r)}><Save className="h-3 w-3" /> حفظ</button>
        <button className={btnDanger} onClick={onRemove}><Trash2 className="h-3 w-3" /> حذف</button>
      </div>
    </div>
  );
}
