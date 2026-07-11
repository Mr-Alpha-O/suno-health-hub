import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getHeroAdmin, upsertHero } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnDanger, btnGhost } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/hero")({ component: HeroPage });

type Stat = { value: string; label: string };
type Hero = {
  id?: string;
  badge: string | null; headline: string; headline_highlight: string | null;
  subheading: string | null; cta_primary_label: string | null; cta_primary_href: string | null;
  cta_secondary_label: string | null; cta_secondary_href: string | null;
  image_url: string | null; stats: Stat[]; is_active: boolean;
};

const EMPTY: Hero = {
  badge: "", headline: "", headline_highlight: "", subheading: "",
  cta_primary_label: "", cta_primary_href: "", cta_secondary_label: "", cta_secondary_href: "",
  image_url: "", stats: [], is_active: true,
};

function HeroPage() {
  const get = useServerFn(getHeroAdmin);
  const save = useServerFn(upsertHero);
  const [h, setH] = useState<Hero>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get().then((d) => {
      if (d) setH({ ...d, stats: (d.stats as unknown as Stat[]) ?? [] } as Hero);
    }).finally(() => setLoading(false));
  }, [get]);

  async function submit() {
    try { await save({ data: h }); toast.success("تم حفظ الهيرو"); }
    catch (e) { toast.error((e as Error).message); }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin" />;

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader title="القسم الرئيسي (Hero)" desc="عدّل محتوى قسم البداية بالصفحة الرئيسية." />

      <div className="bg-card border rounded-xl p-6 space-y-4">
        <Field label="شارة أعلى العنوان"><input className={inp} value={h.badge ?? ""} onChange={(e) => setH({ ...h, badge: e.target.value })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="العنوان الرئيسي"><input className={inp} value={h.headline} onChange={(e) => setH({ ...h, headline: e.target.value })} /></Field>
          <Field label="الكلمة المميزة"><input className={inp} value={h.headline_highlight ?? ""} onChange={(e) => setH({ ...h, headline_highlight: e.target.value })} /></Field>
        </div>
        <Field label="الوصف تحت العنوان"><textarea rows={3} className={inp} value={h.subheading ?? ""} onChange={(e) => setH({ ...h, subheading: e.target.value })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="نص زر أساسي"><input className={inp} value={h.cta_primary_label ?? ""} onChange={(e) => setH({ ...h, cta_primary_label: e.target.value })} /></Field>
          <Field label="رابط زر أساسي"><input className={inp} value={h.cta_primary_href ?? ""} onChange={(e) => setH({ ...h, cta_primary_href: e.target.value })} /></Field>
          <Field label="نص زر ثانوي"><input className={inp} value={h.cta_secondary_label ?? ""} onChange={(e) => setH({ ...h, cta_secondary_label: e.target.value })} /></Field>
          <Field label="رابط زر ثانوي (اكتب whatsapp لواتساب)"><input className={inp} value={h.cta_secondary_href ?? ""} onChange={(e) => setH({ ...h, cta_secondary_href: e.target.value })} /></Field>
        </div>
        <Field label="رابط صورة الهيرو (اختياري)"><input className={inp} value={h.image_url ?? ""} onChange={(e) => setH({ ...h, image_url: e.target.value })} /></Field>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold">الأرقام التعريفية (Stats)</div>
            <button className={btnGhost} onClick={() => setH({ ...h, stats: [...h.stats, { value: "", label: "" }] })}><Plus className="h-3 w-3" /> إضافة</button>
          </div>
          <div className="space-y-2">
            {h.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input className={inp} placeholder="القيمة (24/7)" value={s.value} onChange={(e) => { const st = [...h.stats]; st[i] = { ...s, value: e.target.value }; setH({ ...h, stats: st }); }} />
                <input className={inp} placeholder="التسمية" value={s.label} onChange={(e) => { const st = [...h.stats]; st[i] = { ...s, label: e.target.value }; setH({ ...h, stats: st }); }} />
                <button className={btnDanger} onClick={() => setH({ ...h, stats: h.stats.filter((_, j) => j !== i) })}><Trash2 className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={h.is_active} onChange={(e) => setH({ ...h, is_active: e.target.checked })} /> نشط</label>
        <button onClick={submit} className={btnPrimary}><Save className="h-3 w-3" /> حفظ</button>
      </div>
    </div>
  );
}
