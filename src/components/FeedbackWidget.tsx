import { useState } from "react";
import { MessageSquarePlus, X, Star, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitFeedback } from "@/lib/feedback.functions";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [requested, setRequested] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const submit = useServerFn(submitFeedback);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating && !comment.trim() && !requested.trim()) {
      toast.error("يرجى إضافة تقييم أو تعليق أو منتج مقترح");
      return;
    }
    setSending(true);
    try {
      await submit({ data: {
        rating,
        name: name.trim() || null,
        comment: comment.trim() || null,
        requested_product: requested.trim() || null,
        page_url: typeof window !== "undefined" ? window.location.href.slice(0, 500) : null,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
        device_type: typeof window !== "undefined" && window.matchMedia?.("(max-width: 640px)")?.matches ? "mobile" : "desktop",
      } });
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); setRating(null); setName(""); setComment(""); setRequested(""); }, 1800);
    } catch (err: any) {
      toast.error(err.message ?? "تعذر إرسال الرأي");
    }
    setSending(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="شارك رأيك"
        className="fixed bottom-24 left-4 z-40 h-11 rounded-full bg-white text-primary border border-primary/30 shadow-elegant px-4 flex items-center gap-2 text-sm font-bold hover:bg-secondary transition-smooth"
        style={{ direction: "rtl" }}
      >
        <MessageSquarePlus className="h-4 w-4" /> شارك رأيك
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-end sm:items-center justify-center p-3" onClick={() => setOpen(false)} dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-elegant p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold">شارك رأيك أو اقترح منتجاً</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            {done ? (
              <div className="py-8 text-center">
                <div className="text-4xl mb-2">🌟</div>
                <p className="text-foreground font-bold">شكراً على رأيك — تم الاستلام.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <div>
                  <div className="text-xs font-bold text-muted-foreground mb-1">التقييم</div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} type="button" onClick={() => setRating(n === rating ? null : n)} aria-label={`تقييم ${n}`} className={`h-9 w-9 rounded-full flex items-center justify-center transition-smooth ${rating != null && n <= rating ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}>
                        <Star className={`h-6 w-6 ${rating != null && n <= rating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك (اختياري)" maxLength={80} className="w-full rounded-lg border px-3 py-2 text-sm" />
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="تعليقك أو اقتراحك للتطوير..." rows={3} maxLength={2000} className="w-full rounded-lg border px-3 py-2 text-sm" />
                <input value={requested} onChange={(e) => setRequested(e.target.value)} placeholder="منتج أو خدمة تريدها ولم تجدها (اختياري)" maxLength={200} className="w-full rounded-lg border px-3 py-2 text-sm" />
                <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-hero text-primary-foreground rounded-lg py-2.5 font-bold hover:shadow-elegant transition-smooth disabled:opacity-60">
                  <Send className="h-4 w-4" /> {sending ? "جارٍ الإرسال..." : "إرسال"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
