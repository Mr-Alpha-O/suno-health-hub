import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listSections, saveSections } from "@/lib/doctors-sections.functions";
import { toast } from "sonner";
import { Save, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical } from "lucide-react";
import { PageHeader, btnPrimary } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/homepage")({ component: Page });

type Section = { id: string; key: string; label: string; sort_order: number; is_visible: boolean };

function Page() {
  const l = useServerFn(listSections);
  const s = useServerFn(saveSections);
  const [rows, setRows] = useState<Section[]>([]);
  const [dirty, setDirty] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  async function load() {
    try {
      const data = (await l()) as Section[];
      setRows([...data].sort((a, b) => a.sort_order - b.sort_order));
      setDirty(false);
    } catch (e) { toast.error((e as Error).message); }
  }
  useEffect(() => { load(); }, []);

  function move(idx: number, delta: number) {
    const j = idx + delta;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[idx], next[j]] = [next[j], next[idx]];
    setRows(next.map((r, i) => ({ ...r, sort_order: i })));
    setDirty(true);
  }
  function toggle(idx: number) {
    const next = [...rows];
    next[idx] = { ...next[idx], is_visible: !next[idx].is_visible };
    setRows(next);
    setDirty(true);
  }
  function onDragStart(id: string) { setDragId(id); }
  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = rows.findIndex((r) => r.id === dragId);
    const to = rows.findIndex((r) => r.id === targetId);
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setRows(next.map((r, i) => ({ ...r, sort_order: i })));
    setDragId(null);
    setDirty(true);
  }
  async function persist() {
    try {
      await s({ data: { sections: rows.map((r) => ({ id: r.id, sort_order: r.sort_order, is_visible: r.is_visible })) } });
      toast.success("تم حفظ الترتيب");
      setDirty(false);
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader
        title="أقسام الصفحة الرئيسية"
        desc="أعِد ترتيب الأقسام بالسحب أو الأسهم، وتحكم في إظهار/إخفاء كل قسم."
        action={<button disabled={!dirty} onClick={persist} className={btnPrimary + (dirty ? "" : " opacity-50 cursor-not-allowed")}><Save className="h-3 w-3" /> حفظ الترتيب</button>}
      />
      <div className="bg-card border rounded-xl divide-y">
        {rows.map((r, i) => (
          <div
            key={r.id}
            draggable
            onDragStart={() => onDragStart(r.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(r.id)}
            className={`flex items-center gap-3 p-3 ${dragId === r.id ? "opacity-50" : ""}`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <span className="text-xs w-8 text-muted-foreground">{i + 1}</span>
            <span className="font-bold flex-1">{r.label}</span>
            <span className="text-xs text-muted-foreground font-mono">{r.key}</span>
            <button onClick={() => toggle(i)} className="border rounded px-2 py-1 text-xs inline-flex items-center gap-1">
              {r.is_visible ? <><Eye className="h-3 w-3" /> ظاهر</> : <><EyeOff className="h-3 w-3" /> مخفي</>}
            </button>
            <button onClick={() => move(i, -1)} className="border rounded p-1"><ArrowUp className="h-3 w-3" /></button>
            <button onClick={() => move(i, 1)} className="border rounded p-1"><ArrowDown className="h-3 w-3" /></button>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">ملاحظة: أقسام "الأطباء / الشهادات / الأسئلة الشائعة / الأرقام" تظهر فقط عندما يكون هناك محتوى مرتبط بها.</p>
    </div>
  );
}
