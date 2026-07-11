import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listFaqs, upsertFaq, deleteFaq } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Save, Trash2, Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnDanger, EmptyState } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/faqs")({ component: Page });
type Row = { id?: string; question: string; answer: string; category: string | null; sort_order: number; is_visible: boolean };

function Page() {
  const l = useServerFn(listFaqs); const u = useServerFn(upsertFaq); const d = useServerFn(deleteFaq);
  const [rows, setRows] = useState<Row[]>([]);
  async function load() { try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); } }
  useEffect(() => { load(); }, []);
  async function save(r: Row) { try { await u({ data: r }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function remove(id?: string) { if (!id || !confirm("حذف؟")) return; try { await d({ data: { id } }); toast.success("تم"); load(); } catch (e) { toast.error((e as Error).message); } }
  async function add() { const question = prompt("السؤال"); const answer = prompt("الإجابة"); if (!question || !answer) return; await save({ question, answer, category: "", sort_order: rows.length, is_visible: true }); }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="الأسئلة الشائعة" action={<button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> إضافة</button>} />
      {rows.length === 0 ? <EmptyState text="لا توجد أسئلة." /> :
        rows.map((r) => <Row key={r.id} row={r} onSave={save} onRemove={() => remove(r.id)} />)}
    </div>
  );
}
function Row({ row, onSave, onRemove }: { row: Row; onSave: (r: Row) => void; onRemove: () => void }) {
  const [r, setR] = useState(row); useEffect(() => setR(row), [row]);
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="grid md:grid-cols-3 gap-2">
        <Field label="التصنيف"><input className={inp} value={r.category ?? ""} onChange={(e) => setR({ ...r, category: e.target.value })} /></Field>
        <Field label="الترتيب"><input type="number" className={inp} value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></Field>
        <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={r.is_visible} onChange={(e) => setR({ ...r, is_visible: e.target.checked })} /> ظاهر</label>
      </div>
      <Field label="السؤال"><input className={inp} value={r.question} onChange={(e) => setR({ ...r, question: e.target.value })} /></Field>
      <Field label="الإجابة"><textarea rows={3} className={inp} value={r.answer} onChange={(e) => setR({ ...r, answer: e.target.value })} /></Field>
      <div className="flex gap-2">
        <button className={btnPrimary} onClick={() => onSave(r)}><Save className="h-3 w-3" /> حفظ</button>
        <button className={btnDanger} onClick={onRemove}><Trash2 className="h-3 w-3" /> حذف</button>
      </div>
    </div>
  );
}
