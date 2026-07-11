import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAboutAdmin, upsertAbout } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Field, PageHeader, inp, btnPrimary, btnDanger, btnGhost } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/about")({ component: AboutPage });

type Value = { title: string; desc: string };
type About = {
  id?: string; intro: string | null; mission: string | null; vision: string | null;
  story: string | null; image_url: string | null; values: Value[]; is_active: boolean;
};

const EMPTY: About = { intro: "", mission: "", vision: "", story: "", image_url: "", values: [], is_active: true };

function AboutPage() {
  const g = useServerFn(getAboutAdmin); const u = useServerFn(upsertAbout);
  const [a, setA] = useState<About>(EMPTY);
  const [loading, setLoading] = useState(true);
  useEffect(() => { g().then((d) => { if (d) setA({ ...d, values: (d.values as unknown as Value[]) ?? [] } as About); }).finally(() => setLoading(false)); }, [g]);
  async function save() { try { await u({ data: a }); toast.success("تم الحفظ"); } catch (e) { toast.error((e as Error).message); } }
  if (loading) return <Loader2 className="h-6 w-6 animate-spin" />;
  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="من نحن" desc="محتوى صفحة عنّا." />
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <Field label="مقدمة"><textarea rows={3} className={inp} value={a.intro ?? ""} onChange={(e) => setA({ ...a, intro: e.target.value })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="الرسالة"><textarea rows={3} className={inp} value={a.mission ?? ""} onChange={(e) => setA({ ...a, mission: e.target.value })} /></Field>
          <Field label="الرؤية"><textarea rows={3} className={inp} value={a.vision ?? ""} onChange={(e) => setA({ ...a, vision: e.target.value })} /></Field>
        </div>
        <Field label="القصة"><textarea rows={4} className={inp} value={a.story ?? ""} onChange={(e) => setA({ ...a, story: e.target.value })} /></Field>
        <Field label="رابط صورة"><input className={inp} value={a.image_url ?? ""} onChange={(e) => setA({ ...a, image_url: e.target.value })} /></Field>
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold">القيم</div>
            <button className={btnGhost} onClick={() => setA({ ...a, values: [...a.values, { title: "", desc: "" }] })}><Plus className="h-3 w-3" /> إضافة</button>
          </div>
          <div className="space-y-2">
            {a.values.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                <input className={inp} placeholder="العنوان" value={v.title} onChange={(e) => { const arr = [...a.values]; arr[i] = { ...v, title: e.target.value }; setA({ ...a, values: arr }); }} />
                <input className={inp} placeholder="الوصف" value={v.desc} onChange={(e) => { const arr = [...a.values]; arr[i] = { ...v, desc: e.target.value }; setA({ ...a, values: arr }); }} />
                <button className={btnDanger} onClick={() => setA({ ...a, values: a.values.filter((_, j) => j !== i) })}><Trash2 className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={a.is_active} onChange={(e) => setA({ ...a, is_active: e.target.checked })} /> نشط</label>
        <button onClick={save} className={btnPrimary}><Save className="h-3 w-3" /> حفظ</button>
      </div>
    </div>
  );
}
