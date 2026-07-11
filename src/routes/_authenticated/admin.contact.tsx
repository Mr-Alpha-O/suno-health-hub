import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getContactAdmin, upsertContact } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/contact")({ component: Page });
type Row = { id?: string; phone: string | null; phone_intl: string | null; whatsapp: string | null; email: string | null; address: string | null; hours: string | null; map_embed: string | null; socials: Record<string, string>; is_active: boolean };
const EMPTY: Row = { phone: "", phone_intl: "", whatsapp: "", email: "", address: "", hours: "", map_embed: "", socials: {}, is_active: true };

function Page() {
  const g = useServerFn(getContactAdmin); const u = useServerFn(upsertContact);
  const [c, setC] = useState<Row>(EMPTY);
  const [loading, setLoading] = useState(true);
  useEffect(() => { g().then((d) => { if (d) setC({ ...d, socials: (d.socials as Record<string, string>) ?? {} } as Row); }).finally(() => setLoading(false)); }, [g]);
  async function save() { try { await u({ data: c }); toast.success("تم الحفظ"); } catch (e) { toast.error((e as Error).message); } }
  if (loading) return <Loader2 className="h-6 w-6 animate-spin" />;
  const socialKeys = ["facebook","instagram","twitter","linkedin","youtube","tiktok"];
  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="بيانات الاتصال" desc="تظهر في الفوتر وصفحة تواصل معنا." />
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="الهاتف المحلي"><input dir="ltr" className={inp} value={c.phone ?? ""} onChange={(e) => setC({ ...c, phone: e.target.value })} /></Field>
          <Field label="الهاتف الدولي"><input dir="ltr" className={inp} value={c.phone_intl ?? ""} onChange={(e) => setC({ ...c, phone_intl: e.target.value })} /></Field>
          <Field label="واتساب (أرقام فقط)"><input dir="ltr" className={inp} value={c.whatsapp ?? ""} onChange={(e) => setC({ ...c, whatsapp: e.target.value })} /></Field>
          <Field label="البريد الإلكتروني"><input dir="ltr" className={inp} value={c.email ?? ""} onChange={(e) => setC({ ...c, email: e.target.value })} /></Field>
        </div>
        <Field label="العنوان"><input className={inp} value={c.address ?? ""} onChange={(e) => setC({ ...c, address: e.target.value })} /></Field>
        <Field label="ساعات العمل"><input className={inp} value={c.hours ?? ""} onChange={(e) => setC({ ...c, hours: e.target.value })} /></Field>
        <Field label="رابط خريطة (embed src)"><input className={inp} value={c.map_embed ?? ""} onChange={(e) => setC({ ...c, map_embed: e.target.value })} /></Field>
        <div>
          <div className="text-sm font-bold mb-2">روابط التواصل الاجتماعي</div>
          <div className="grid md:grid-cols-2 gap-2">
            {socialKeys.map((k) => (
              <Field key={k} label={k}>
                <input dir="ltr" className={inp} value={c.socials[k] ?? ""} onChange={(e) => setC({ ...c, socials: { ...c.socials, [k]: e.target.value } })} />
              </Field>
            ))}
          </div>
        </div>
        <button onClick={save} className={btnPrimary}><Save className="h-3 w-3" /> حفظ</button>
      </div>
    </div>
  );
}
