import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listSettings, upsertSetting, deleteSetting } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

type Row = { key: string; value: any };

function SettingsPage() {
  const ls = useServerFn(listSettings);
  const up = useServerFn(upsertSetting);
  const del = useServerFn(deleteSetting);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  async function load() {
    setLoading(true);
    try { setRows((await ls()) as any); } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(key: string, value: any) {
    try { await up({ data: { key, value } }); toast.success("تم الحفظ"); load(); }
    catch (e: any) { toast.error(e.message); }
  }
  async function remove(key: string) {
    if (!confirm(`حذف الإعداد "${key}"؟`)) return;
    try { await del({ data: { key } }); toast.success("تم الحذف"); load(); }
    catch (e: any) { toast.error(e.message); }
  }
  async function add() {
    if (!newKey.trim()) return;
    let parsed: any = newVal;
    try { parsed = JSON.parse(newVal); } catch { /* keep as string */ }
    await save(newKey.trim(), parsed);
    setNewKey(""); setNewVal("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">إعدادات الموقع</h1>
        <p className="text-sm text-muted-foreground mt-1">مفاتيح إعدادات الموقع (JSON). أمثلة: <code>phone</code>, <code>whatsapp</code>, <code>email</code>, <code>seo_title</code>.</p>
      </div>

      <div className="bg-card border rounded-xl p-5 shadow-soft space-y-3">
        <h2 className="font-bold">إضافة إعداد</h2>
        <div className="grid md:grid-cols-3 gap-2">
          <input placeholder="المفتاح (مثال: phone)" value={newKey} onChange={(e) => setNewKey(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm" />
          <input placeholder='القيمة (نص أو JSON)' value={newVal} onChange={(e) => setNewVal(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        </div>
        <button onClick={add} className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-bold">
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </div>

      <div className="bg-card border rounded-xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-right">
            <tr><th className="p-3">المفتاح</th><th className="p-3">القيمة</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">جارٍ التحميل...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">لا توجد إعدادات</td></tr>
              : rows.map((r) => (
                <tr key={r.key} className="border-t">
                  <td className="p-3 font-mono text-xs">{r.key}</td>
                  <td className="p-3">
                    <SettingValueEditor row={r} onSave={(v) => save(r.key, v)} />
                  </td>
                  <td className="p-3">
                    <button onClick={() => remove(r.key)} className="text-destructive hover:bg-destructive/10 rounded p-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingValueEditor({ row, onSave }: { row: Row; onSave: (v: any) => void }) {
  const [val, setVal] = useState(typeof row.value === "string" ? row.value : JSON.stringify(row.value));
  return (
    <div className="flex gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} className="flex-1 rounded-md border px-3 py-1.5 text-sm" />
      <button onClick={() => {
        let parsed: any = val;
        try { parsed = JSON.parse(val); } catch { /* keep string */ }
        onSave(parsed);
      }} className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold">حفظ</button>
    </div>
  );
}
