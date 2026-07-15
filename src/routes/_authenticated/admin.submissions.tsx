import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listServiceSubmissions, listJobApplications, listContactMessages, updateSubmissionStatus, deleteSubmission } from "@/lib/cms.functions";
import { toast } from "sonner";
import { Trash2, Download } from "lucide-react";
import { PageHeader, btnDanger, btnGhost, inp } from "@/components/admin/CrudHelpers";

export const Route = createFileRoute("/_authenticated/admin/submissions")({ component: Page });

type Tab = "service_submissions" | "job_applications" | "contact_messages";
const TABS: { key: Tab; label: string }[] = [
  { key: "service_submissions", label: "طلبات الخدمات" },
  { key: "job_applications", label: "طلبات التوظيف" },
  { key: "contact_messages", label: "رسائل التواصل" },
];
const STATUSES = ["new","contacted","scheduled","in_progress","completed","done","cancelled","archived"] as const;
const STATUS_LABEL: Record<string, string> = { new: "جديد", contacted: "تم التواصل", scheduled: "مجدول", in_progress: "قيد التنفيذ", completed: "مكتمل", done: "منجز", cancelled: "ملغى", archived: "مؤرشف" };

function Page() {
  const [tab, setTab] = useState<Tab>("service_submissions");
  const listSvc = useServerFn(listServiceSubmissions);
  const listJob = useServerFn(listJobApplications);
  const listMsg = useServerFn(listContactMessages);
  const upd = useServerFn(updateSubmissionStatus);
  const del = useServerFn(deleteSubmission);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const fn = tab === "service_submissions" ? listSvc : tab === "job_applications" ? listJob : listMsg;
      setRows((await fn()) as Record<string, unknown>[]);
    } catch (e) { toast.error((e as Error).message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, [tab]);

  async function setStatus(id: string, status: typeof STATUSES[number]) {
    try { await upd({ data: { table: tab, id, status } }); toast.success("تم التحديث"); load(); }
    catch (e) { toast.error((e as Error).message); }
  }
  async function remove(id: string) {
    if (!confirm("حذف نهائي؟")) return;
    try { await del({ data: { table: tab, id } }); toast.success("تم الحذف"); load(); }
    catch (e) { toast.error((e as Error).message); }
  }
  function exportCsv() {
    if (rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${tab}.csv`; a.click();
    URL.revokeObjectURL(url);
  }
  async function exportXlsx() {
    if (rows.length === 0) return;
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tab.slice(0, 30));
    XLSX.writeFile(wb, `${tab}.xlsx`);
  }

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="صندوق الوارد" desc="طلبات ورسائل الموقع." action={<div className="flex gap-2"><button onClick={exportCsv} className={btnGhost}><Download className="h-3 w-3" /> CSV</button><button onClick={exportXlsx} className={btnGhost}><Download className="h-3 w-3" /> Excel</button></div>} />
      <div className="flex gap-2 border-b">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <div className="text-muted-foreground text-sm">جارٍ التحميل...</div> :
       rows.length === 0 ? <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">لا توجد سجلات.</div> :
       <div className="space-y-2">
        {rows.map((r) => {
          const id = String(r.id);
          const status = String(r.status);
          return (
            <div key={id} className="bg-card border rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="space-y-1">
                  <div className="font-bold">{String(r.name ?? "")}</div>
                  <div className="text-xs text-muted-foreground" dir="ltr">
                    {r.phone ? `📞 ${r.phone} ` : ""}{r.email ? `✉ ${r.email}` : ""}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(String(r.created_at)).toLocaleString("ar-EG")}</div>
              </div>
              {tab === "service_submissions" && <div className="text-xs">القسم: {String(r.service_slug ?? "—")} / {String(r.sub_service ?? "—")}</div>}
              {tab === "job_applications" && <div className="text-xs">الوظيفة: {String(r.position ?? "—")}</div>}
              {tab === "contact_messages" && r.subject ? <div className="text-xs">الموضوع: {String(r.subject)}</div> : null}
              {(r.notes || r.message) ? <div className="text-xs bg-muted/40 rounded p-2 whitespace-pre-wrap">{String(r.notes ?? r.message)}</div> : null}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <select value={status} onChange={(e) => setStatus(id, e.target.value as typeof STATUSES[number])} className={inp + " w-auto"}>
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
                <button className={btnDanger} onClick={() => remove(id)}><Trash2 className="h-3 w-3" /> حذف</button>
              </div>
            </div>
          );
        })}
       </div>}
    </div>
  );
}
