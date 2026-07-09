import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listProducts, upsertProduct, deleteProduct } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Trash2, Plus, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const lp = useServerFn(listProducts);
  const up = useServerFn(upsertProduct);
  const del = useServerFn(deleteProduct);
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setItems((await lp()) as any); } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(p: any) {
    try {
      await up({ data: {
        id: p.id, slug: p.slug, name: p.name, category: p.category, image: p.image, short: p.short,
        details: Array.isArray(p.details) ? p.details : String(p.details ?? "").split("\n").filter(Boolean),
        buy_price: p.buy_price === "" || p.buy_price == null ? null : Number(p.buy_price),
        rent_price: p.rent_price === "" || p.rent_price == null ? null : Number(p.rent_price),
        old_price: p.old_price === "" || p.old_price == null ? null : Number(p.old_price),
        stock: p.stock === "" || p.stock == null ? null : Number(p.stock),
        is_available: !!p.is_available, is_featured: !!p.is_featured, is_visible: !!p.is_visible,
        sort_order: Number(p.sort_order) || 0,
      }});
      toast.success("تم الحفظ"); load();
    } catch (e: any) { toast.error(e.message); }
  }
  async function remove(id: string) {
    if (!confirm("حذف المنتج؟")) return;
    try { await del({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function addNew() {
    const slug = prompt("Slug فريد (بالإنجليزية)")?.trim();
    const name = prompt("اسم المنتج")?.trim();
    if (!slug || !name) return;
    await save({ slug, name, details: [], is_available: true, is_visible: true, sort_order: items.length });
  }

  const filtered = items.filter((i) => !q || (i.name + " " + i.slug + " " + (i.category ?? "")).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">المتجر</h1>
          <p className="text-sm text-muted-foreground mt-1">أدِر المنتجات وأسعارها وحالتها.</p>
        </div>
        <div className="flex gap-2">
          <input placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
          <button onClick={addNew} className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-bold">
            <Plus className="h-4 w-4" /> منتج جديد
          </button>
        </div>
      </div>

      {loading ? <div className="text-muted-foreground">جارٍ التحميل...</div>
        : filtered.length === 0 ? <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">لا توجد منتجات</div>
        : <div className="space-y-3">{filtered.map((p) => <ProductRow key={p.id} product={p} onSave={save} onRemove={remove} />)}</div>}
    </div>
  );
}

function ProductRow({ product, onSave, onRemove }: any) {
  const [p, setP] = useState({ ...product, details: (product.details ?? []).join("\n") });
  useEffect(() => setP({ ...product, details: (product.details ?? []).join("\n") }), [product]);

  return (
    <div className="bg-card border rounded-xl p-4 shadow-soft space-y-3">
      <div className="grid md:grid-cols-4 gap-2">
        <input value={p.slug ?? ""} onChange={(e) => setP({ ...p, slug: e.target.value })} placeholder="slug" className="rounded-md border px-3 py-2 text-sm" />
        <input value={p.name ?? ""} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="الاسم" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={p.category ?? ""} onChange={(e) => setP({ ...p, category: e.target.value })} placeholder="الفئة" className="rounded-md border px-3 py-2 text-sm" />
        <input value={p.image ?? ""} onChange={(e) => setP({ ...p, image: e.target.value })} placeholder="رابط الصورة" className="rounded-md border px-3 py-2 text-sm md:col-span-4" dir="ltr" />
        <input value={p.short ?? ""} onChange={(e) => setP({ ...p, short: e.target.value })} placeholder="وصف قصير" className="rounded-md border px-3 py-2 text-sm md:col-span-4" />
      </div>
      <div className="grid md:grid-cols-4 gap-2">
        <input type="number" step="0.01" value={p.buy_price ?? ""} onChange={(e) => setP({ ...p, buy_price: e.target.value })} placeholder="سعر البيع" className="rounded-md border px-3 py-2 text-sm" />
        <input type="number" step="0.01" value={p.rent_price ?? ""} onChange={(e) => setP({ ...p, rent_price: e.target.value })} placeholder="سعر الإيجار" className="rounded-md border px-3 py-2 text-sm" />
        <input type="number" step="0.01" value={p.old_price ?? ""} onChange={(e) => setP({ ...p, old_price: e.target.value })} placeholder="السعر القديم" className="rounded-md border px-3 py-2 text-sm" />
        <input type="number" value={p.stock ?? ""} onChange={(e) => setP({ ...p, stock: e.target.value })} placeholder="المخزون" className="rounded-md border px-3 py-2 text-sm" />
      </div>
      <textarea value={p.details ?? ""} onChange={(e) => setP({ ...p, details: e.target.value })} placeholder="مواصفات (سطر لكل ميزة)" rows={3} className="w-full rounded-md border px-3 py-2 text-sm" />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.is_available} onChange={(e) => setP({ ...p, is_available: e.target.checked })} /> متاح</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.is_featured} onChange={(e) => setP({ ...p, is_featured: e.target.checked })} /> مميز</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.is_visible} onChange={(e) => setP({ ...p, is_visible: e.target.checked })} /> ظاهر</label>
        <input type="number" value={p.sort_order ?? 0} onChange={(e) => setP({ ...p, sort_order: e.target.value })} placeholder="ترتيب" className="rounded-md border px-2 py-1 text-sm w-24" />
        <div className="ml-auto flex gap-2">
          <button onClick={() => onSave(p)} className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold"><Save className="h-3 w-3" /> حفظ</button>
          <button onClick={() => onRemove(product.id)} className="inline-flex items-center gap-1 rounded-md border text-destructive px-3 py-1.5 text-xs font-bold hover:bg-destructive/10"><Trash2 className="h-3 w-3" /> حذف</button>
        </div>
      </div>
    </div>
  );
}
