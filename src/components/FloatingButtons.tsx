import { Phone, MessageCircle, Ambulance } from "lucide-react";
import { site, waLink } from "@/lib/site";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-3">
      <a
        href={`tel:${site.phoneIntl}`}
        aria-label="اتصل الآن"
        className="group flex items-center gap-2 bg-primary text-primary-foreground h-12 w-12 hover:w-auto hover:px-4 rounded-full shadow-elegant transition-smooth overflow-hidden whitespace-nowrap justify-center animate-pulse-ring"
      >
        <Phone className="h-5 w-5 shrink-0" />
        <span className="hidden group-hover:inline font-bold text-sm">اتصل الآن</span>
      </a>
      <a
        href={waLink()}
        target="_blank" rel="noopener"
        aria-label="واتساب"
        className="group flex items-center gap-2 bg-[#25D366] text-white h-12 w-12 hover:w-auto hover:px-4 rounded-full shadow-elegant transition-smooth overflow-hidden whitespace-nowrap justify-center"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="hidden group-hover:inline font-bold text-sm">واتساب</span>
      </a>
      <a
        href={waLink("🚑 طلب إسعاف عاجل — برجاء التواصل فوراً")}
        target="_blank" rel="noopener"
        aria-label="اطلب إسعاف"
        className="group flex items-center gap-2 bg-destructive text-destructive-foreground h-12 w-12 hover:w-auto hover:px-4 rounded-full shadow-elegant transition-smooth overflow-hidden whitespace-nowrap justify-center"
      >
        <Ambulance className="h-5 w-5 shrink-0" />
        <span className="hidden group-hover:inline font-bold text-sm">اطلب إسعاف</span>
      </a>
    </div>
  );
}
