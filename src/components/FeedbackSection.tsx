import { useState } from "react";
import { Star } from "lucide-react";
import { FeedbackWidget } from "./FeedbackWidget";

export function FeedbackSection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <section dir="rtl" className="border-t border-border/60 bg-secondary/30">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-center md:text-right">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground">قولنا رأيك</h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground leading-7">
              إذا كان لديك اقتراح أو ملاحظة أو تبحث عن منتج غير موجود، يسعدنا سماع رأيك.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-primary border border-primary/30 rounded-full px-5 py-2.5 text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-smooth shadow-soft mx-auto md:mx-0"
          >
            <Star className="h-4 w-4" /> قولنا رأيك
          </button>
        </div>
      </section>
      <FeedbackWidget open={open} onOpenChange={setOpen} />
    </>
  );
}
