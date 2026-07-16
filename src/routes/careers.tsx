import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Briefcase, Send, Upload } from "lucide-react";
import { site } from "@/lib/site";
import { useServerFn } from "@tanstack/react-start";
import { submitJobApplication } from "@/lib/public.functions";
import { jobsQO, contactQO } from "@/lib/public-queries";
import { z } from "zod";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "الوظائف | انضم إلى فريق سونو الطبي" },
      { name: "description", content: "وظائف طبية شاغرة في سونو: أطباء، تمريض، فنيي أشعة وتحاليل، مسعفين، وخدمة عملاء." },
      { property: "og:title", content: "الوظائف | سونو للخدمات الطبية" },
      { property: "og:description", content: "تقدّم لشغل وظائف طبية في فريقنا." },
    ],
    links: [{ rel: "canonical", href: "https://www.swnwmedicalcare.com/careers" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(jobsQO),
      context.queryClient.ensureQueryData(contactQO),
    ]);
  },
  component: CareersPage,
  errorComponent: ({ error }) => <div className="container mx-auto p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="container mx-auto p-8 text-center">لم يتم العثور على وظائف.</div>,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,20}$/),
  email: z.string().trim().email(),
  position: z.string().min(1),
});

function CareersPage() {
  const { data: jobs } = useSuspenseQuery(jobsQO);
  const { data: contact } = useSuspenseQuery(contactQO);
  const whatsapp = contact?.whatsapp ?? site.whatsapp;
  const [form, setForm] = useState({ name: "", phone: "", email: "", position: "", cv: null as File | null });
  const submitFn = useServerFn(submitJobApplication);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error("برجاء التأكد من البيانات"); return; }
    try {
      await submitFn({ data: { name: form.name, phone: form.phone, email: form.email, position: form.position, notes: form.cv ? `CV file: ${form.cv.name}` : null } });
    } catch (err) { console.error(err); }
    const msg = `تقديم وظيفة:%0A• الاسم: ${form.name}%0A• الهاتف: ${form.phone}%0A• الإيميل: ${form.email}%0A• الوظيفة: ${form.position}%0A• السيرة الذاتية: ${form.cv ? form.cv.name : "سيتم إرسالها"}`;
    toast.success("تم استلام طلبك، سنتواصل معك قريباً");
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, "_blank");
    setForm({ name: "", phone: "", email: "", position: "", cv: null });
  };

  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">انضم إلى فريق سونو</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-8">نبحث دائماً عن كفاءات طبية لتقديم رعاية متميزة لمرضانا.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-extrabold mb-6">الوظائف المتاحة</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((j) => (
            <div key={j.id} className="bg-white rounded-2xl p-6 border border-border shadow-soft hover:shadow-elegant transition-smooth">
              <div className="h-12 w-12 rounded-xl bg-gradient-hero text-white flex items-center justify-center">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-extrabold text-lg">{j.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-7">{j.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-soft border border-border p-6 md:p-8 grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <h3 className="md:col-span-2 text-xl font-extrabold">تقديم طلب توظيف</h3>
          <Field label="الاسم *"><input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="رقم الهاتف *"><input dir="ltr" className={inp} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="البريد الإلكتروني *"><input dir="ltr" className={inp} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="الوظيفة المطلوبة *">
            <select className={inp} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
              <option value="">اختر الوظيفة</option>
              {jobs.map((j) => <option key={j.id} value={j.title}>{j.title}</option>)}
            </select>
          </Field>
          <Field label="السيرة الذاتية (PDF)">
            <label className="flex items-center gap-2 bg-secondary/40 hover:bg-secondary cursor-pointer border border-dashed border-primary/30 rounded-xl px-4 py-3 text-sm font-bold text-primary transition-smooth">
              <Upload className="h-4 w-4" />
              {form.cv ? form.cv.name : "ارفع ملف السيرة الذاتية"}
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setForm({ ...form, cv: e.target.files?.[0] || null })} />
            </label>
          </Field>
          <div className="md:col-span-2">
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-gradient-hero text-primary-foreground py-3.5 rounded-xl font-bold shadow-soft hover:shadow-elegant transition-smooth">
              <Send className="h-4 w-4" /> إرسال الطلب
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

const inp = "w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-smooth";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-bold mb-2">{label}</span>{children}</label>;
}
