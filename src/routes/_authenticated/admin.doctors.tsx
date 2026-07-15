import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listDoctors, upsertDoctor, deleteDoctor } from "@/lib/doctors-sections.functions";
import { toast } from "sonner";
import { Save, Trash2, Plus } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnDanger, EmptyState } from "@/components/admin/CrudHelpers";

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
  const [q, setQ] = useState("");

  async function load() {
    try { setRows((await l()) as Row[]); } catch (e) { toast.error((e as Error).message); }
  }
  useEffect(() => { load(); }, []);

  async function save(r: Row) {
    try { await u({ data: r }); toast.success("تم الحفظ"); load(); } catch (e) { toast.error((e as Error).message); }
  }
  async function remove(id?: string) {
    if (!id || !confirm("حذف الطبيب؟")) return;
    try { await d({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e) { toast.error((e as Error).message); }
  }
  async function add() {
    const name = prompt("اسم الطبيب");
    if (!name) return;
    await save({
      name, specialty: "", description: "", qualifications: "", experience: "",
      photo_url: "", phone: "", whatsapp: "", is_available: true,
      sort_order: rows.length, is_visible: true,
    });
  }

  const filtered = rows.filter((r) => !q || (r.name + " " + (r.specialty ?? "")).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader
        title="الأطباء"
        desc="أدِر قائمة الأطباء التي تظهر على الموقع."
        action={
          <div className="flex gap-2">
            <input placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
            <button onClick={add} className={btnPrimary}><Plus className="h-3 w-3" /> طبيب جديد</button>
          </div>
        }
      />
      {filtered.length === 0
        ? <EmptyState text="لا يوجد أطباء. أضف أول طبيب ليظهر قسم الأطباء على الموقع." />
        : filtered.map((r) => <DocRow key={r.id} row={r} onSave={save} onRemove={() => remove(r.id)} />)
      }
    </div>
  );
}

function DocRow({ row, onSave, onRemove }: { row: Row; onSave: (r: Row) => void; onRemove: () => void }) {
  const [r, setR] = useState(row);
  useEffect(() => setR(row), [row]);
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="grid md:grid-cols-4 gap-2">
        <Field label="الاسم"><input className={inp} value={r.name} onChange={(e) => setR({ ...r, name: e.target.value })} /></Field>
        <Field label="التخصص"><input className={inp} value={r.specialty ?? ""} onChange={(e) => setR({ ...r, specialty: e.target.value })} /></Field>
        <Field label="الخبرة"><input className={inp} value={r.experience ?? ""} onChange={(e) => setR({ ...r, experience: e.target.value })} /></Field>
        <Field label="الترتيب"><input type="number" className={inp} value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} /></Field>
      </div>
      <Field label="المؤهلات"><input className={inp} value={r.qualifications ?? ""} onChange={(e) => setR({ ...r, qualifications: e.target.value })} /></Field>
      <Field label="نبذة"><textarea rows={2} className={inp} value={r.description ?? ""} onChange={(e) => setR({ ...r, description: e.target.value })} /></Field>
      <div className="grid md:grid-cols-3 gap-2">
        <Field label="رابط الصورة"><input className={inp} value={r.photo_url ?? ""} onChange={(e) => setR({ ...r, photo_url: e.target.value })} /></Field>
        <Field label="هاتف (اختياري)"><input className={inp} value={r.phone ?? ""} onChange={(e) => setR({ ...r, phone: e.target.value })} dir="ltr" /></Field>
        <Field label="واتساب (اختياري)"><input className={inp} value={r.whatsapp ?? ""} onChange={(e) => setR({ ...r, whatsapp: e.target.value })} dir="ltr" /></Field>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-1"><input type="checkbox" checked={r.is_available} onChange={(e) => setR({ ...r, is_available: e.target.checked })} /> متاح للحجز</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={r.is_visible} onChange={(e) => setR({ ...r, is_visible: e.target.checked })} /> ظاهر</label>
        <div className="ml-auto flex gap-2">
          <button className={btnPrimary} onClick={() => onSave(r)}><Save className="h-3 w-3" /> حفظ</button>
          <button className={btnDanger} onClick={onRemove}><Trash2 className="h-3 w-3" /> حذف</button>
        </div>
      </div>
    </div>
  );
}
