import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listMedia, deleteMedia } from "@/lib/admin.functions";
import { compressImage } from "@/lib/image-compress";
import { toast } from "sonner";
import { Trash2, Upload, Copy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaPage,
});

function MediaPage() {
  const lm = useServerFn(listMedia);
  const del = useServerFn(deleteMedia);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try { setItems((await lm()) as any); } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const stamp = Date.now();
        const safe = file.name.replace(/[^\w.\-]+/g, "_");
        const { main, thumb, mime } = await compressImage(file);
        const ext = mime === "image/png" ? "png" : "jpg";
        const baseName = safe.replace(/\.[^.]+$/, "");
        const mainPath = `${stamp}-${baseName}.${ext}`;
        const { error: e1 } = await supabase.storage.from("media").upload(mainPath, main, { contentType: mime, upsert: false });
        if (e1) throw e1;
        if (thumb) {
          const thumbPath = `thumbs/${stamp}-${baseName}.${ext}`;
          await supabase.storage.from("media").upload(thumbPath, thumb, { contentType: mime, upsert: false });
        }
      } catch (err: any) {
        toast.error(`${file.name}: ${err.message ?? err}`);
      }
    }
    setUploading(false);
    e.target.value = "";
    toast.success("تم الرفع");
    load();
  }

  async function remove(name: string) {
    if (!confirm(`حذف ${name}؟`)) return;
    try {
      await del({ data: { name } });
      // best-effort: also remove matching thumb
      await del({ data: { name: `thumbs/${name}` } }).catch(() => {});
      toast.success("تم الحذف"); load();
    } catch (e: any) { toast.error(e.message); }
  }

  const filtered = items.filter((f) => !q || f.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">مكتبة الوسائط</h1>
          <p className="text-sm text-muted-foreground mt-1">ارفع الصور — يتم ضغطها تلقائياً وإنشاء صور مصغرة. انسخ الرابط لاستخدامه.</p>
        </div>
        <div className="flex gap-2">
          <input placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
          <label className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-bold cursor-pointer">
            <Upload className="h-4 w-4" /> {uploading ? "جارٍ الرفع..." : "رفع ملفات"}
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {loading ? <div className="text-muted-foreground">جارٍ التحميل...</div>
        : filtered.length === 0 ? <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">لا توجد ملفات بعد</div>
        : <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filtered.map((f) => (
              <div key={f.name} className="bg-card border rounded-xl overflow-hidden shadow-soft group">
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {f.url ? <img src={f.url} alt={f.name} className="w-full h-full object-cover" loading="lazy" /> : <span className="text-xs text-muted-foreground">لا معاينة</span>}
                </div>
                <div className="p-2 space-y-1">
                  <div className="text-xs truncate" title={f.name}>{f.name}</div>
                  <div className="flex gap-1">
                    <button onClick={() => { navigator.clipboard.writeText(f.name); toast.success("تم نسخ المسار"); }} className="flex-1 inline-flex items-center justify-center gap-1 text-xs bg-muted rounded p-1.5"><Copy className="h-3 w-3" /> نسخ المسار</button>
                    <button onClick={() => remove(f.name)} className="text-destructive rounded p-1.5 hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
}
