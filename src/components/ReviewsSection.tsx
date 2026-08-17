import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

export type PublicReview = {
  id: string;
  name: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`تقييم ${rating} من 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-primary fill-current" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: PublicReview[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const items = reviews.slice(0, 6);
  if (items.length === 0) return null;

  function scrollBy(dir: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.9, 420), behavior: "smooth" });
  }

  return (
    <section className="bg-gradient-soft py-20" dir="rtl">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="آراء العملاء" title="آراء عملائنا" desc="ثقتكم هي دافعنا للاستمرار وتطوير خدماتنا دائمًا." />

        <div className="relative">
          <div
            ref={scroller}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((r) => (
              <article
                key={r.id}
                className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-white rounded-2xl p-6 shadow-soft border border-border/60"
              >
                <MessageSquareQuote className="h-6 w-6 text-primary" />
                {r.rating ? <div className="mt-3"><Stars rating={r.rating} /></div> : null}
                {r.comment && <p className="mt-3 text-sm text-foreground leading-7">"{r.comment}"</p>}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm font-extrabold">{r.name?.trim() || "عميل"}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long" })}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="السابق"
                className="h-10 w-10 rounded-full bg-white border border-border shadow-soft flex items-center justify-center text-primary hover:bg-secondary transition-smooth"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="التالي"
                className="h-10 w-10 rounded-full bg-white border border-border shadow-soft flex items-center justify-center text-primary hover:bg-secondary transition-smooth"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
