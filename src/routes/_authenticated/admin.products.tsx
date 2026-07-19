import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listProducts, upsertProduct, deleteProduct } from "@/lib/admin.functions";
import { listProductImages, addProductImage, deleteProductImage, reorderProductImages } from "@/lib/doctors-sections.functions";
import { listProductBadges, upsertProductBadge, deleteProductBadge, BADGE_COLORS } from "@/lib/badges.functions";
import { compressImage } from "@/lib/image-compress";
import { toast } from "sonner";
import { Trash2, Plus, Save, Upload, ArrowUp, ArrowDown } from "lucide-react";

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
        rental_unit: p.rental_unit || "day",
        show_buy_price: p.show_buy_price !== false,
        show_rent_price: p.show_rent_price !== false,
        available_for_sale: p.available_for_sale !== false,
        available_for_rent: p.available_for_rent !== false,
      }});
      toast.success("تم الحفظ"); load();
    } catch (e: any) { toast.error(e.message); }
  }
  async function remove(id: string) {
    if (!confirm("حذف المنتج؟")) return;
    try { await del({ data: { id } }); toast.success("تم الحذف"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function addNew() {
    const name = prompt("اسم المنتج (الحقل الوحيد المطلوب)")?.trim();
    if (!name) return;
    await save({ name, details: [], is_available: true, is_visible: true, sort_order: items.length });
  }

  const filtered = items.filter((i) => !q || (i.name + " " + i.slug + " " + (i.category ?? "")).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">المتجر</h1>
          <p className="text-sm text-muted-foreground mt-1">أدِر المنتجات وأسعارها وصورها وحالتها.</p>
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
        <input value={p.image ?? ""} onChange={(e) => setP({ ...p, image: e.target.value })} placeholder="رابط الصورة الرئيسية" className="rounded-md border px-3 py-2 text-sm md:col-span-4" dir="ltr" />
        <input value={p.short ?? ""} onChange={(e) => setP({ ...p, short: e.target.value })} placeholder="وصف قصير" className="rounded-md border px-3 py-2 text-sm md:col-span-4" />
      </div>
      <div className="grid md:grid-cols-4 gap-2">
        <input type="number" step="0.01" value={p.buy_price ?? ""} onChange={(e) => setP({ ...p, buy_price: e.target.value })} placeholder="سعر البيع" className="rounded-md border px-3 py-2 text-sm" />
        <input type="number" step="0.01" value={p.rent_price ?? ""} onChange={(e) => setP({ ...p, rent_price: e.target.value })} placeholder="سعر الإيجار" className="rounded-md border px-3 py-2 text-sm" />
        <input type="number" step="0.01" value={p.old_price ?? ""} onChange={(e) => setP({ ...p, old_price: e.target.value })} placeholder="السعر القديم" className="rounded-md border px-3 py-2 text-sm" />
        <input type="number" value={p.stock ?? ""} onChange={(e) => setP({ ...p, stock: e.target.value })} placeholder="المخزون" className="rounded-md border px-3 py-2 text-sm" />
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground min-w-[110px]">وحدة الإيجار</span>
          <select value={p.rental_unit ?? "day"} onChange={(e) => setP({ ...p, rental_unit: e.target.value })} className="rounded-md border px-2 py-1.5 text-sm flex-1">
            <option value="hour">ساعة</option>
            <option value="day">يوم</option>
            <option value="week">أسبوع</option>
            <option value="month">شهر</option>
            <option value="year">سنة</option>
            <option value="negotiable">حسب الاتفاق</option>
          </select>
        </label>
      </div>
      <textarea value={p.details ?? ""} onChange={(e) => setP({ ...p, details: e.target.value })} placeholder="مواصفات (سطر لكل ميزة)" rows={3} className="w-full rounded-md border px-3 py-2 text-sm" />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1"><input type="checkbox" checked={p.show_buy_price !== false} onChange={(e) => setP({ ...p, show_buy_price: e.target.checked })} /> إظهار سعر البيع</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={p.show_rent_price !== false} onChange={(e) => setP({ ...p, show_rent_price: e.target.checked })} /> إظهار سعر الإيجار</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={p.available_for_sale !== false} onChange={(e) => setP({ ...p, available_for_sale: e.target.checked })} /> متاح للبيع</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={p.available_for_rent !== false} onChange={(e) => setP({ ...p, available_for_rent: e.target.checked })} /> متاح للإيجار</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.is_available} onChange={(e) => setP({ ...p, is_available: e.target.checked })} /> غير نافد</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.is_featured} onChange={(e) => setP({ ...p, is_featured: e.target.checked })} /> مميز</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.is_visible} onChange={(e) => setP({ ...p, is_visible: e.target.checked })} /> ظاهر</label>
        <input type="number" value={p.sort_order ?? 0} onChange={(e) => setP({ ...p, sort_order: e.target.value })} placeholder="ترتيب" className="rounded-md border px-2 py-1 text-sm w-24" />
        <div className="ml-auto flex gap-2">
          <button onClick={() => onSave(p)} className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold"><Save className="h-3 w-3" /> حفظ</button>
          <button onClick={() => onRemove(product.id)} className="inline-flex items-center gap-1 rounded-md border text-destructive px-3 py-1.5 text-xs font-bold hover:bg-destructive/10"><Trash2 className="h-3 w-3" /> حذف</button>
        </div>
      </div>

      {product.id && <ImagesGallery productId={product.id} />}
      {product.id && <BadgesEditor productId={product.id} />}
    </div>
  );
}

function BadgesEditor({ productId }: { productId: string }) {
  const list = useServerFn(listProductBadges);
  const up = useServerFn(upsertProductBadge);
  const del = useServerFn(deleteProductBadge);
  const [rows, setRows] = useState<any[]>([]);
  const [draft, setDraft] = useState<{ text: string; color_variant: string }>({ text: "", color_variant: "green" });

  async function load() {
    try { setRows((await list({ data: { product_id: productId } })) as any); } catch (e: any) { toast.error(e.message); }
  }
  useEffect(() => { load(); }, [productId]);

  async function addBadge() {
    const text = draft.text.trim();
    if (!text) return;
    try {
      await up({ data: { product_id: productId, text, color_variant: draft.color_variant as any, sort_order: rows.length, is_visible: true } });
      setDraft({ text: "", color_variant: "green" });
      load();
    } catch (e: any) { toast.error(e.message); }
  }
  async function toggleVisible(b: any) {
    try { await up({ data: { id: b.id, product_id: productId, text: b.text, color_variant: b.color_variant, sort_order: b.sort_order ?? 0, is_visible: !b.is_visible } }); load(); }
    catch (e: any) { toast.error(e.message); }
  }
  async function remove(id: string) {
    if (!confirm("حذف الشارة؟")) return;
    try { await del({ data: { id } }); load(); } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div className="border-t pt-3 mt-2">
      <div className="text-xs font-bold text-muted-foreground mb-2">شارات المنتج ({rows.length})</div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {rows.map((b) => (
          <span key={b.id} className={`inline-flex items-center gap-1.5 rounded-full ring-1 px-2.5 py-0.5 text-[11px] font-bold ${b.is_visible === false ? "opacity-40" : ""} ${colorClass(b.color_variant)}`}>
            {b.text}
            <button onClick={() => toggleVisible(b)} title={b.is_visible === false ? "إظهار" : "إخفاء"} className="opacity-60 hover:opacity-100">{b.is_visible === false ? "👁️" : "🚫"}</button>
            <button onClick={() => remove(b.id)} className="text-red-600 opacity-70 hover:opacity-100">✕</button>
          </span>
        ))}
        {rows.length === 0 && <span className="text-xs text-muted-foreground">لا توجد شارات — أضف شارة أدناه.</span>}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <input value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} placeholder="نص الشارة (مثال: خصم 20%)" maxLength={50} className="rounded-md border px-2 py-1.5 text-sm flex-1 min-w-[180px]" />
        <select value={draft.color_variant} onChange={(e) => setDraft({ ...draft, color_variant: e.target.value })} className="rounded-md border px-2 py-1.5 text-sm">
          {BADGE_COLORS.map((c) => <option key={c} value={c}>{colorLabel(c)}</option>)}
        </select>
        <button onClick={addBadge} className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold"><Plus className="h-3 w-3" /> إضافة</button>
      </div>
    </div>
  );
}

function colorLabel(c: string) {
  return ({ green: "أخضر", blue: "أزرق", orange: "برتقالي", purple: "بنفسجي", red: "أحمر", gray: "رمادي", gold: "ذهبي" } as any)[c] ?? c;
}
function colorClass(c: string) {
  return ({
    green: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    blue: "bg-sky-100 text-sky-800 ring-sky-200",
    orange: "bg-amber-100 text-amber-800 ring-amber-200",
    purple: "bg-violet-100 text-violet-800 ring-violet-200",
    red: "bg-rose-100 text-rose-800 ring-rose-200",
    gray: "bg-slate-100 text-slate-700 ring-slate-200",
    gold: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  } as any)[c] ?? "bg-slate-100 text-slate-700 ring-slate-200";
}

function ImagesGallery({ productId }: { productId: string }) {
  const list = useServerFn(listProductImages);
  const add = useServerFn(addProductImage);
  const del = useServerFn(deleteProductImage);
  const reorder = useServerFn(reorderProductImages);
  const [rows, setRows] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    try { setRows((await list({ data: { product_id: productId } })) as any); } catch (e: any) { toast.error(e.message); }
  }
  useEffect(() => { load(); }, [productId]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      let sort = rows.length;
      for (const f of Array.from(files)) {
        const { main, mime } = await compressImage(f);
        const ext = mime === "image/png" ? "png" : "jpg";
        const path = `products/${productId}/${Date.now()}-${f.name.replace(/[^\w.\-]+/g, "_")}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(path, main, { contentType: mime });
        if (error) throw error;
        const { data: signed } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365);
        await add({ data: { product_id: productId, url: signed?.signedUrl ?? path, alt: f.name, sort_order: sort++ } });
      }
      toast.success("تم إضافة الصور");
      load();
    } catch (err: any) { toast.error(err.message); }
    setUploading(false);
    e.target.value = "";
  }

  async function remove(id: string) {
    if (!confirm("حذف الصورة؟")) return;
    try { await del({ data: { id } }); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function move(idx: number, delta: number) {
    const j = idx + delta;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[idx], next[j]] = [next[j], next[idx]];
    const items = next.map((r, i) => ({ id: r.id, sort_order: i }));
    setRows(next.map((r, i) => ({ ...r, sort_order: i })));
    try { await reorder({ data: { items } }); } catch (e: any) { toast.error(e.message); load(); }
  }

  return (
    <div className="border-t pt-3 mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-muted-foreground">صور إضافية ({rows.length})</span>
        <label className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-bold cursor-pointer">
          <Upload className="h-3 w-3" /> {uploading ? "..." : "إضافة صور"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={upload} disabled={uploading} />
        </label>
      </div>
      {rows.length === 0 ? (
        <div className="text-xs text-muted-foreground">لا توجد صور إضافية.</div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {rows.map((r, i) => (
            <div key={r.id} className="relative group border rounded overflow-hidden">
              <img src={r.url} alt={r.alt ?? ""} className="w-full aspect-square object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => move(i, -1)} className="text-white p-0.5"><ArrowUp className="h-3 w-3" /></button>
                <button onClick={() => move(i, 1)} className="text-white p-0.5"><ArrowDown className="h-3 w-3" /></button>
                <button onClick={() => remove(r.id)} className="text-red-300 p-0.5"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
