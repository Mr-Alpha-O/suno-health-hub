import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { useServerFn } from "@tanstack/react-start";
import { submitContactMessage } from "@/lib/public.functions";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | سونو للخدمات الطبية" },
      { name: "description", content: "تواصل مع سونو للخدمات الطبية عبر الهاتف، واتساب، أو البريد الإلكتروني — متاحون 24 ساعة." },
      { property: "og:title", content: "تواصل معنا | سونو" },
      { property: "og:description", content: "نحن في خدمتك على مدار الساعة." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,20}$/),
  message: z.string().trim().min(5).max(800),
});

function ContactPage() {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const submitFn = useServerFn(submitContactMessage);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) { toast.error("برجاء التأكد من البيانات"); return; }
    try { await submitFn({ data: { name: f.name, phone: f.phone, message: f.message } }); } catch (err) { console.error(err); }
    const msg = `رسالة تواصل:%0A• الاسم: ${f.name}%0A• الهاتف: ${f.phone}%0A• الرسالة: ${f.message}`;
    toast.success("تم إرسال رسالتك، سنرد عليك قريباً");
    window.open(`https://wa.me/${site.whatsapp}?text=${msg}`, "_blank");
    setF({ name: "", phone: "", message: "" });
  };

  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">تواصل معنا</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-8">نحن في خدمتك على مدار 24 ساعة — اختر وسيلة التواصل الأنسب لك.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Phone, title: "اتصل بنا", val: site.phone, href: `tel:${site.phoneIntl}` },
          { icon: MessageCircle, title: "واتساب", val: site.phone, href: waLink() },
          { icon: Mail, title: "البريد الإلكتروني", val: site.email, href: `mailto:${site.email}` },
          { icon: MapPin, title: "موقعنا", val: "القاهرة الكبرى", href: "#map" },
        ].map(({ icon: Icon, title, val, href }) => (
          <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="group bg-white rounded-2xl p-6 border border-border shadow-soft hover:shadow-elegant transition-smooth text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-hero text-white flex items-center justify-center group-hover:scale-110 transition-smooth">
              <Icon className="h-6 w-6" />
            </div>
            <div className="mt-4 font-extrabold">{title}</div>
            <div className="mt-1 text-sm text-muted-foreground break-all" dir="ltr">{val}</div>
          </a>
        ))}
      </section>

      <section className="container mx-auto px-4 pb-12 grid lg:grid-cols-2 gap-8">
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-soft border border-border p-6 md:p-8 space-y-5">
          <h3 className="text-xl font-extrabold">أرسل لنا رسالة</h3>
          <Field label="الاسم *"><input className={inp} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="رقم الهاتف *"><input dir="ltr" className={inp} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="الرسالة *"><textarea rows={5} className={inp} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></Field>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-gradient-hero text-primary-foreground py-3.5 rounded-xl font-bold shadow-soft hover:shadow-elegant transition-smooth">
            <Send className="h-4 w-4" /> إرسال
          </button>
        </form>

        <div id="map" className="rounded-2xl overflow-hidden shadow-soft border border-border min-h-[420px]">
          <iframe
            title="موقعنا على الخريطة"
            src="https://www.google.com/maps?q=Cairo,Egypt&output=embed"
            className="w-full h-full min-h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

const inp = "w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-smooth";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-bold mb-2">{label}</span>{children}</label>;
}
