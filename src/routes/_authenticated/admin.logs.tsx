import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listActivityLog } from "@/lib/activity-log.functions";
import { PageHeader, EmptyState, inp } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/logs")({ component: Page });

const ACTION_LABEL: Record<string, string> = {
  login: "تسجيل دخول", logout: "تسجيل خروج", create: "إنشاء", update: "تعديل",
  delete: "حذف", hide: "إخفاء", show: "إظهار", export: "تصدير",
};

function Page() {
  const listFn = useServerFn(listActivityLog);
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [action, setAction] = useState<string>("");

  useEffect(() => { listFn({ data: { limit: 500 } }).then(setRows).catch(() => {}); }, [listFn]);

  const filtered = rows.filter((r) => {
    if (action && r.action !== action) return false;
    if (!q) return true;
    const needle = q.toLowerCase();
    return (r.user_email ?? "").toLowerCase().includes(needle) ||
      (r.object_type ?? "").toLowerCase().includes(needle) ||
      (r.object_id ?? "").toLowerCase().includes(needle);
  });

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="سجل النشاط" desc="سجل عمليات المشرفين." />
      <div className="flex flex-wrap gap-2">
        <input placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} className={inp + " max-w-xs"} />
        <select value={action} onChange={(e) => setAction(e.target.value)} className={inp + " w-auto"}>
          <option value="">كل العمليات</option>
          {Object.entries(ACTION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? <EmptyState text="لا توجد سجلات." /> : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs">
              <tr>
                <th className="p-2 text-right">التاريخ</th>
                <th className="p-2 text-right">المستخدم</th>
                <th className="p-2 text-right">العملية</th>
                <th className="p-2 text-right">النوع</th>
                <th className="p-2 text-right">المعرف</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2 whitespace-nowrap text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("ar-EG")}</td>
                  <td className="p-2 text-xs">{r.user_email ?? "—"}</td>
                  <td className="p-2 text-xs font-bold">{ACTION_LABEL[r.action] ?? r.action}</td>
                  <td className="p-2 text-xs">{r.object_type ?? "—"}</td>
                  <td className="p-2 text-xs text-muted-foreground truncate max-w-[220px]" dir="ltr">{r.object_id ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
