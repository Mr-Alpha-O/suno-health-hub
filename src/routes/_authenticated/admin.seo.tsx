import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listSettings, upsertSetting } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/seo")({ component: Page });

type Seo = { site_title: string; site_description: string; og_image: string; keywords: string; robots: string };
const EMPTY: Seo = { site_title: "", site_description: "", og_image: "", keywords: "", robots: "index,follow" };

function Page() {
  const l = useServerFn(listSettings); const u = useServerFn(upsertSetting);
  const [s, setS] = useState<Seo>(EMPTY);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    l().then((rows) => {
      const settings = rows as unknown as { key: string; value: unknown }[];
      const seo = settings.find((r) => r.key === "seo")?.value as Partial<Seo> | undefined;
      if (seo) setS({ ...EMPTY, ...seo });
    }).finally(() => setLoading(false));
  }, [l]);
  async function save() {
    try { await u({ data: { key: "seo", value: s } }); toast.success("تم الحفظ"); }
    catch (e) { toast.error((e as Error).message); }
  }
  if (loading) return <Loader2 className="h-6 w-6 animate-spin" />;
  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="إعدادات SEO" desc="افتراضيات SEO للموقع بالكامل." />
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <Field label="عنوان الموقع الافتراضي"><input className={inp} value={s.site_title} onChange={(e) => setS({ ...s, site_title: e.target.value })} /></Field>
        <Field label="وصف الموقع الافتراضي"><textarea rows={3} className={inp} value={s.site_description} onChange={(e) => setS({ ...s, site_description: e.target.value })} /></Field>
        <Field label="رابط صورة OG (مشاركة اجتماعية)"><input className={inp} value={s.og_image} onChange={(e) => setS({ ...s, og_image: e.target.value })} /></Field>
        <Field label="كلمات مفتاحية (مفصولة بفواصل)"><input className={inp} value={s.keywords} onChange={(e) => setS({ ...s, keywords: e.target.value })} /></Field>
        <Field label="Robots"><input dir="ltr" className={inp} value={s.robots} onChange={(e) => setS({ ...s, robots: e.target.value })} /></Field>
        <button onClick={save} className={btnPrimary}><Save className="h-3 w-3" /> حفظ</button>
      </div>
    </div>
  );
}
