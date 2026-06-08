import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { services, site, waLink } from "@/lib/site";
import { z } from "zod";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "اطلب خدمة | سونو للخدمات الطبية" },
      { name: "description", content: "اطلب خدمة طبية منزلية من سونو. املأ النموذج وسنتواصل معك خلال دقائق." },
      { property: "og:title", content: "اطلب خدمة | سونو" },
      { property: "og:description", content: "خدمة طبية منزلية بطلب واحد." },
    ],
    links: [{ rel: "canonical", href: "/request" }],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ service: typeof s.service === "string" ? s.service : "" }),
  component: RequestPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب").max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,20}$/, "رقم الهاتف غير صحيح"),
  address: z.string().trim().min(4, "العنوان مطلوب").max(200),
  service: z.string().min(1, "اختر الخدمة"),
  notes: z.string().max(800).optional(),
});

function RequestPage() {
  const { service: initialService } = Route.useSearch();
  const [form, setForm] = useState({ name: "", phone: "", address: "", service: initialService || "", notes: "" });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const svcName = services.find((s) => s.slug === form.service)?.name ?? form.service;
    const msg = `طلب خدمة جديد:%0A• الاسم: ${form.name}%0A• الهاتف: ${form.phone}%0A• العنوان: ${form.address}%0A• الخدمة: ${svcName}%0A• ملاحظات: ${form.notes || "—"}`;
    toast.success("تم إرسال طلبك! سنتواصل معك خلال دقائق.");
    setTimeout(() => {
      window.open(`https://wa.me/${site.whatsapp}?text=${msg}`, "_blank");
      setLoading(false);
      setForm({ name: "", phone: "", address: "", service: "", notes: "" });
    }, 600);
  };

  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">اطلب خدمة</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-8">املأ النموذج وسيتواصل فريقنا الطبي معك خلال دقائق.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <form onSubmit={submit} className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-border p-6 md:p-8 space-y-5">
          <Field label="الاسم بالكامل *">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} placeholder="مثال: أحمد محمد" />
          </Field>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="رقم الهاتف *">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" className={inp} placeholder="01XXXXXXXXX" />
            </Field>
            <Field label="نوع الخدمة *">
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inp}>
                <option value="">اختر الخدمة</option>
                {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="العنوان *">
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inp} placeholder="المنطقة، الشارع، رقم المبنى" />
          </Field>
          <Field label="ملاحظات">
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} className={inp} placeholder="تفاصيل إضافية عن الحالة..." />
          </Field>
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-hero text-primary-foreground py-3.5 rounded-xl font-bold shadow-soft hover:shadow-elegant transition-smooth disabled:opacity-60">
            <Send className="h-4 w-4" /> {loading ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </form>

        <aside className="bg-gradient-card rounded-2xl border border-border p-6 md:p-8 h-fit shadow-soft">
          <h3 className="font-extrabold text-lg">تفضل بالتواصل المباشر</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-7">نحن متاحون على مدار 24 ساعة لخدمتك.</p>
          <div className="mt-5 space-y-3">
            <a href={`tel:${site.phoneIntl}`} className="block bg-white border border-border rounded-xl px-4 py-3 font-bold text-primary hover:bg-secondary transition-smooth" dir="ltr">📞 {site.phone}</a>
            <a href={waLink()} target="_blank" rel="noopener" className="block bg-[#25D366] text-white rounded-xl px-4 py-3 font-bold text-center hover:opacity-90 transition-smooth">💬 واتساب</a>
            <a href={`mailto:${site.email}`} className="block bg-white border border-border rounded-xl px-4 py-3 font-bold text-foreground hover:bg-secondary transition-smooth break-all text-sm" dir="ltr">✉ {site.email}</a>
          </div>
        </aside>
      </section>
    </>
  );
}

const inp = "w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-smooth";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold mb-2 text-foreground">{label}</span>
      {children}
    </label>
  );
}
