import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listCategories, upsertCategory, deleteCategory, upsertSub, deleteSub } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Trash2, Plus, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesPage,
});

function ServicesPage() {
  const lc = useServerFn(listCategories);
  const upC = useServerFn(upsertCategory);
  const delC = useServerFn(deleteCategory);
  const upS = useServerFn(upsertSub);
  const delS = useServerFn(deleteSub);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setCats((await lc()) as any); } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function saveCat(c: any) {
    try {
      await upC({ data: {
        id: c.id, slug: c.slug, name: c.name, description: c.description, icon: c.icon,
        sort_order: Number(c.sort_order) || 0, is_visible: !!c.is_visible,
      }});
      toast.success("تم الحفظ"); load();
    } catch (e: any) { toast.error(e.message); }
  }
  async function removeCat(id: string) {
    if (!confirm("حذف القسم وكل خدماته الفرعية؟")) return;
    try { await delC({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function saveSub(s: any) {
    try {
      await upS({ data: {
        id: s.id, category_id: s.category_id, name: s.name, featured: !!s.featured,
        sort_order: Number(s.sort_order) || 0, is_visible: !!s.is_visible,
      }});
      toast.success("تم الحفظ"); load();
    } catch (e: any) { toast.error(e.message); }
  }
  async function removeSub(id: string) {
    if (!confirm("حذف الخدمة الفرعية؟")) return;
    try { await delS({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e: any) { toast.error(e.message); }
  }

  async function addCat() {
    const slug = prompt("Slug (مثال: nursing)")?.trim();
    const name = prompt("اسم القسم")?.trim();
    if (!slug || !name) return;
    await saveCat({ slug, name, sort_order: cats.length, is_visible: true });
  }
  async function addSub(catId: string) {
    const name = prompt("اسم الخدمة الفرعية")?.trim();
    if (!name) return;
    await saveSub({ category_id: catId, name, sort_order: 0, is_visible: true, featured: false });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">الخدمات</h1>
          <p className="text-sm text-muted-foreground mt-1">أدِر الأقسام والخدمات الفرعية.</p>
        </div>
        <button onClick={addCat} className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-bold">
          <Plus className="h-4 w-4" /> قسم جديد
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">جارٍ التحميل...</div>
        : cats.length === 0 ? <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">لا توجد أقسام بعد.</div>
        : cats.map((c) => <CategoryCard key={c.id} cat={c} onSaveCat={saveCat} onRemoveCat={removeCat} onSaveSub={saveSub} onRemoveSub={removeSub} onAddSub={addSub} />)}
    </div>
  );
}

function CategoryCard({ cat, onSaveCat, onRemoveCat, onSaveSub, onRemoveSub, onAddSub }: any) {
  const [c, setC] = useState(cat);
  useEffect(() => setC(cat), [cat]);
  return (
    <div className="bg-card border rounded-xl p-5 shadow-soft space-y-4">
      <div className="grid md:grid-cols-6 gap-2">
        <input value={c.slug ?? ""} onChange={(e) => setC({ ...c, slug: e.target.value })} placeholder="slug" className="rounded-md border px-3 py-2 text-sm" />
        <input value={c.name ?? ""} onChange={(e) => setC({ ...c, name: e.target.value })} placeholder="الاسم" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={c.icon ?? ""} onChange={(e) => setC({ ...c, icon: e.target.value })} placeholder="icon" className="rounded-md border px-3 py-2 text-sm" />
        <input type="number" value={c.sort_order ?? 0} onChange={(e) => setC({ ...c, sort_order: e.target.value })} placeholder="ترتيب" className="rounded-md border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!c.is_visible} onChange={(e) => setC({ ...c, is_visible: e.target.checked })} /> ظاهر
        </label>
      </div>
      <textarea value={c.description ?? ""} onChange={(e) => setC({ ...c, description: e.target.value })} placeholder="الوصف" className="w-full rounded-md border px-3 py-2 text-sm" rows={2} />
      <div className="flex gap-2">
        <button onClick={() => onSaveCat(c)} className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold"><Save className="h-3 w-3" /> حفظ القسم</button>
        <button onClick={() => onRemoveCat(cat.id)} className="inline-flex items-center gap-1 rounded-md border text-destructive px-3 py-1.5 text-xs font-bold hover:bg-destructive/10"><Trash2 className="h-3 w-3" /> حذف القسم</button>
        <button onClick={() => onAddSub(cat.id)} className="ml-auto inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-bold"><Plus className="h-3 w-3" /> خدمة فرعية</button>
      </div>

      <div className="border-t pt-3 space-y-2">
        {(cat.service_subs ?? []).map((s: any) => <SubRow key={s.id} sub={s} onSave={onSaveSub} onRemove={onRemoveSub} />)}
      </div>
    </div>
  );
}

function SubRow({ sub, onSave, onRemove }: any) {
  const [s, setS] = useState(sub);
  useEffect(() => setS(sub), [sub]);
  return (
    <div className="grid md:grid-cols-6 gap-2 items-center bg-muted/30 rounded p-2">
      <input value={s.name ?? ""} onChange={(e) => setS({ ...s, name: e.target.value })} className="rounded-md border px-2 py-1.5 text-sm md:col-span-2" />
      <input type="number" value={s.sort_order ?? 0} onChange={(e) => setS({ ...s, sort_order: e.target.value })} className="rounded-md border px-2 py-1.5 text-sm" />
      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!s.featured} onChange={(e) => setS({ ...s, featured: e.target.checked })} /> مميز</label>
      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!s.is_visible} onChange={(e) => setS({ ...s, is_visible: e.target.checked })} /> ظاهر</label>
      <div className="flex gap-1 justify-end">
        <button onClick={() => onSave(s)} className="rounded bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">حفظ</button>
        <button onClick={() => onRemove(sub.id)} className="text-destructive p-1"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}
