import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import { useServerFn } from "@tanstack/react-start";
import { submitServiceRequest } from "@/lib/public.functions";
import { serviceCategoriesQO, contactQO } from "@/lib/public-queries";
import { waLinkFor } from "@/lib/media";
import { z } from "zod";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "اطلب خدمة | سونو للخدمات الطبية" },
      { name: "description", content: "اطلب خدمة طبية منزلية من سونو. اختر الفئة ثم الخدمة وسنتواصل معك خلال دقائق." },
      { property: "og:title", content: "اطلب خدمة | سونو" },
      { property: "og:description", content: "خدمة طبية منزلية بطلب واحد." },
    ],
    links: [{ rel: "canonical", href: "/request" }],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ service: typeof s.service === "string" ? s.service : "" }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(serviceCategoriesQO),
      context.queryClient.ensureQueryData(contactQO),
    ]);
  },
  component: RequestPage,
  errorComponent: ({ error }) => <div className="container mx-auto p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="container mx-auto p-8 text-center">لم يتم العثور على المحتوى.</div>,
});

const OTHER = "أخرى";
const OTHER_SLUG = "other";
const OTHER_NAME = "أخرى — خدمة غير موجودة بالقائمة";

const schema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب").max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,20}$/, "رقم الهاتف غير صحيح"),
  address: z.string().trim().min(4, "العنوان مطلوب").max(200),
  category: z.string().min(1, "اختر الفئة الرئيسية"),
  subService: z.string().min(1, "اختر الخدمة"),
  otherService: z.string().trim().max(200).optional(),
  notes: z.string().max(800).optional(),
});

function RequestPage() {
  const { service: initialService } = Route.useSearch();
  const { data: categories } = useSuspenseQuery(serviceCategoriesQO);
  const { data: contact } = useSuspenseQuery(contactQO);
  const phone = contact?.phone ?? site.phone;
  const phoneIntl = contact?.phone_intl ?? site.phoneIntl;
  const whatsapp = contact?.whatsapp ?? site.whatsapp;
  const email = contact?.email ?? site.email;
  const submitFn = useServerFn(submitServiceRequest);
  const initialCategory = categories.find((c) => c.slug === initialService)?.slug ?? "";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    category: initialCategory,
    subService: "",
    otherService: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.slug === form.category),
    [form.category, categories],
  );
  const isOtherCategory = form.category === OTHER_SLUG;
  const isOtherSub = form.subService === OTHER || isOtherCategory;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (isOtherSub && !form.otherService.trim()) {
      toast.error("يرجى كتابة الخدمة المطلوبة");
      return;
    }
    setLoading(true);

    const categoryName = isOtherCategory
      ? OTHER_NAME
      : selectedCategory?.name ?? form.category;
    const subName = isOtherCategory ? "—" : form.subService;
    const finalSub = isOtherSub ? form.otherService : subName;

    try {
      await submitFn({
        data: {
          name: form.name,
          phone: form.phone,
          service_slug: form.category || null,
          sub_service: finalSub || null,
          notes: `العنوان: ${form.address}${form.notes ? `\nملاحظات: ${form.notes}` : ""}`,
        },
      });
    } catch (err) {
      console.error(err);
    }

    const lines = [
      "🩺 طلب خدمة جديد من موقع سونو",
      "—————————————",
      `• الاسم: ${form.name}`,
      `• رقم الهاتف: ${form.phone}`,
      `• العنوان: ${form.address}`,
      `• القسم الرئيسي: ${categoryName}`,
      `• الخدمة المطلوبة: ${subName}`,
    ];
    if (isOtherSub) lines.push(`• الخدمة المكتوبة من العميل: ${form.otherService}`);
    lines.push(`• ملاحظات العميل: ${form.notes || "—"}`);

    const msg = lines.join("\n");
    toast.success("تم إرسال طلبك! سنتواصل معك خلال دقائق.");
    setTimeout(() => {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
      setLoading(false);
      setForm({ name: "", phone: "", address: "", category: "", subService: "", otherService: "", notes: "" });
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
            <Field label="العنوان *">
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inp} placeholder="المنطقة، الشارع، رقم المبنى" />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Field label="القسم الرئيسي *">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, subService: "", otherService: "" })}
                className={inp}
              >
                <option value="">اختر القسم</option>
                {categories.filter((c) => c.slug).map((c) => (
                  <option key={c.slug!} value={c.slug!}>{c.name}</option>
                ))}

                <option value={OTHER_SLUG}>{OTHER_NAME}</option>
              </select>
            </Field>
            <Field label="الخدمة المطلوبة *">
              <select
                value={form.subService}
                onChange={(e) => setForm({ ...form, subService: e.target.value })}
                className={inp}
                disabled={!form.category || isOtherCategory}
              >
                <option value="">
                  {isOtherCategory ? "اكتب الخدمة بالأسفل" : form.category ? "اختر الخدمة" : "اختر القسم أولاً"}
                </option>
                {selectedCategory?.subs.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}{s.featured ? " ⭐" : ""}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {isOtherSub && (
            <Field label="يرجى كتابة الخدمة المطلوبة *">
              <input
                value={form.otherService}
                onChange={(e) => setForm({ ...form, otherService: e.target.value })}
                className={inp}
                placeholder="اكتب اسم الخدمة التي تحتاجها"
              />
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                نقدم العديد من الخدمات غير المدرجة بالقائمة — اكتب احتياجك وسنتواصل معك.
              </p>
            </Field>
          )}

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
            <a href={`tel:${phoneIntl}`} className="block bg-white border border-border rounded-xl px-4 py-3 font-bold text-primary hover:bg-secondary transition-smooth" dir="ltr">📞 {phone}</a>
            <a href={waLinkFor(whatsapp)} target="_blank" rel="noopener" className="block bg-[#25D366] text-white rounded-xl px-4 py-3 font-bold text-center hover:opacity-90 transition-smooth">💬 واتساب</a>
            <a href={`mailto:${email}`} className="block bg-white border border-border rounded-xl px-4 py-3 font-bold text-foreground hover:bg-secondary transition-smooth break-all text-sm" dir="ltr">✉ {email}</a>
          </div>
        </aside>
      </section>
    </>
  );
}

const inp = "w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-smooth disabled:opacity-60 disabled:cursor-not-allowed";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold mb-2 text-foreground">{label}</span>
      {children}
    </label>
  );
}
