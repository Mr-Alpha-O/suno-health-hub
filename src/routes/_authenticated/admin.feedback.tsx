import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listFeedback, markFeedbackReviewed, deleteFeedback } from "@/lib/feedback.functions";
import { toast } from "sonner";
import { Trash2, CheckCircle2, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const list = useServerFn(listFeedback);
  const review = useServerFn(markFeedbackReviewed);
  const del = useServerFn(deleteFeedback);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed">("new");

  async function load() {
    setLoading(true);
    try { setRows((await list()) as any); } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => filter === "all" ? true : filter === "new" ? !r.is_reviewed : r.is_reviewed);

  async function toggle(r: any) {
    try { await review({ data: { id: r.id, is_reviewed: !r.is_reviewed } }); load(); }
    catch (e: any) { toast.error(e.message); }
  }
  async function remove(id: string) {
    if (!confirm("حذف الرأي؟")) return;
    try { await del({ data: { id } }); load(); } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">آراء الزوار</h1>
          <p className="text-sm text-muted-foreground mt-1">تقييمات وتعليقات ومقترحات المنتجات من زوار الموقع.</p>
        </div>
        <div className="flex gap-2 text-xs">
          {[
            { k: "new", l: `الجديد (${rows.filter((r) => !r.is_reviewed).length})` },
            { k: "reviewed", l: "تمت المراجعة" },
            { k: "all", l: "الكل" },
          ].map((t) => (
            <button key={t.k} onClick={() => setFilter(t.k as any)} className={`px-3 py-1.5 rounded-full font-bold border ${filter === t.k ? "bg-primary text-primary-foreground border-transparent" : "bg-white text-foreground/70 border-border"}`}>{t.l}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="text-muted-foreground">جارٍ التحميل...</div>
        : filtered.length === 0 ? <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">لا توجد آراء.</div>
        : <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className={`bg-card border rounded-xl p-4 shadow-soft ${r.is_reviewed ? "opacity-70" : ""}`}>
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.rating && (
                        <div className="flex text-yellow-500">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                      )}
                      {r.name && <span className="text-sm font-bold">{r.name}</span>}
                      <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("ar-EG")}</span>
                    </div>
                    {r.comment && <p className="mt-2 text-sm leading-7">{r.comment}</p>}
                    {r.requested_product && <div className="mt-2 text-xs"><span className="font-bold text-primary">منتج مطلوب:</span> {r.requested_product}</div>}
                    {r.page_url && <div className="mt-1 text-[11px] text-muted-foreground truncate" dir="ltr">{r.page_url}</div>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggle(r)} className="inline-flex items-center gap-1 text-xs border rounded-md px-2 py-1 hover:bg-muted"><CheckCircle2 className="h-3.5 w-3.5" /> {r.is_reviewed ? "غير مراجَع" : "تمت المراجعة"}</button>
                    <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1 text-xs border rounded-md px-2 py-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
}
