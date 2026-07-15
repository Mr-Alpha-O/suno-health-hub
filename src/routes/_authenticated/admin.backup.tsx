import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listServiceSubmissions, listJobApplications, listContactMessages, listJobs } from "@/lib/cms.functions";
import { listProducts, listCategories } from "@/lib/admin.functions";
import { listDoctors } from "@/lib/doctors-sections.functions";
import { getContactCollections, getContactInfo } from "@/lib/public.functions";
import { PageHeader, btnPrimary } from "@/components/admin/CrudHelpers";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/backup")({ component: Page });

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
function toCsv(rows: any[]) {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  return [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
}
async function toXlsx(name: string, sheets: Record<string, any[]>) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  for (const [sheet, rows] of Object.entries(sheets)) {
    const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{}]);
    XLSX.utils.book_append_sheet(wb, ws, sheet.slice(0, 30));
  }
  XLSX.writeFile(wb, name);
}

function Page() {
  const svc = useServerFn(listServiceSubmissions);
  const jobs = useServerFn(listJobApplications);
  const msgs = useServerFn(listContactMessages);
  const products = useServerFn(listProducts);
  const cats = useServerFn(listCategories);
  const doctors = useServerFn(listDoctors);
  const jobsL = useServerFn(listJobs);
  const contact = useServerFn(getContactInfo);
  const collections = useServerFn(getContactCollections);
  const [busy, setBusy] = useState<string | null>(null);

  async function run(key: string, fn: () => Promise<void>) {
    setBusy(key);
    try { await fn(); toast.success("تم التنزيل"); }
    catch (e) { toast.error((e as Error).message); }
    setBusy(null);
  }

  const items: { key: string; label: string; desc: string; run: () => Promise<void> }[] = [
    { key: "all", label: "نسخة كاملة (Excel)", desc: "كل الجداول في ملف Excel واحد.", run: async () => {
      const [a,b,c,d,e,f,g,h,i] = await Promise.all([svc(), jobs(), msgs(), products(), cats(), doctors(), jobsL(), contact(), collections()]);
      await toXlsx("swnw-backup.xlsx", {
        service_submissions: a, job_applications: b, contact_messages: c,
        products: d, service_categories: e, doctors: f, jobs: g,
        contact_info: h ? [h] : [], contact_phones: i.phones, contact_whatsapps: i.whatsapps,
        contact_emails: i.emails, contact_branches: i.branches,
      });
    }},
    { key: "products", label: "المنتجات (CSV)", desc: "قائمة المنتجات.", run: async () => download("products.csv", new Blob(["\ufeff" + toCsv(await products())], { type: "text/csv" })) },
    { key: "services", label: "الخدمات (CSV)", desc: "أقسام الخدمات.", run: async () => download("services.csv", new Blob(["\ufeff" + toCsv(await cats())], { type: "text/csv" })) },
    { key: "doctors", label: "الأطباء (CSV)", desc: "قائمة الأطباء.", run: async () => download("doctors.csv", new Blob(["\ufeff" + toCsv(await doctors())], { type: "text/csv" })) },
    { key: "contact", label: "بيانات الاتصال (Excel)", desc: "الهواتف والواتساب والإيميلات والفروع.", run: async () => {
      const [h, i] = await Promise.all([contact(), collections()]);
      await toXlsx("contact.xlsx", { contact_info: h ? [h] : [], phones: i.phones, whatsapps: i.whatsapps, emails: i.emails, branches: i.branches });
    }},
    { key: "submissions", label: "طلبات الخدمة (CSV)", desc: "كل طلبات الخدمة.", run: async () => download("service_submissions.csv", new Blob(["\ufeff" + toCsv(await svc())], { type: "text/csv" })) },
    { key: "messages", label: "رسائل التواصل (CSV)", desc: "رسائل صفحة تواصل.", run: async () => download("contact_messages.csv", new Blob(["\ufeff" + toCsv(await msgs())], { type: "text/csv" })) },
    { key: "applications", label: "طلبات التوظيف (CSV)", desc: "طلبات المتقدمين للوظائف.", run: async () => download("job_applications.csv", new Blob(["\ufeff" + toCsv(await jobs())], { type: "text/csv" })) },
  ];

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader title="النسخ الاحتياطي" desc="تنزيل بيانات الموقع بصيغة Excel أو CSV." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.key} className="bg-card border rounded-xl p-4 space-y-2">
            <div className="font-bold">{it.label}</div>
            <div className="text-xs text-muted-foreground">{it.desc}</div>
            <button className={btnPrimary} disabled={busy === it.key} onClick={() => run(it.key, it.run)}>
              {busy === it.key ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
              تنزيل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
