import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardCounts } from "@/lib/cms.functions";
import { Package, ListTree, Users, Briefcase, MessageSquareQuote, HelpCircle, Inbox, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Dashboard });

function Dashboard() {
  const fn = useServerFn(getDashboardCounts);
  const [d, setD] = useState<Awaited<ReturnType<typeof fn>> | null>(null);
  useEffect(() => { fn().then(setD).catch(() => {}); }, [fn]);

  const totals = d?.totals ?? ({} as Record<string, number>);
  const inbox = d?.newInbox ?? ({} as Record<string, number>);

  const stats = [
    { label: "طلبات خدمة جديدة", value: inbox.service_submissions ?? 0, icon: Inbox, href: "/admin/submissions", highlight: true },
    { label: "طلبات توظيف جديدة", value: inbox.job_applications ?? 0, icon: Briefcase, href: "/admin/submissions", highlight: true },
    { label: "رسائل جديدة", value: inbox.contact_messages ?? 0, icon: Mail, href: "/admin/submissions", highlight: true },
    { label: "المنتجات", value: totals.products ?? 0, icon: Package, href: "/admin/products" },
    { label: "أقسام الخدمات", value: totals.service_categories ?? 0, icon: ListTree, href: "/admin/services" },
    { label: "أعضاء الفريق", value: totals.team_members ?? 0, icon: Users, href: "/admin/team" },
    { label: "الوظائف", value: totals.jobs ?? 0, icon: Briefcase, href: "/admin/jobs" },
    { label: "الشهادات", value: totals.testimonials ?? 0, icon: MessageSquareQuote, href: "/admin/testimonials" },
    { label: "الأسئلة الشائعة", value: totals.faqs ?? 0, icon: HelpCircle, href: "/admin/faqs" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold">مرحباً بك في لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">نظرة عامة على محتوى الموقع.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((c) => (
          <Link key={c.label} to={c.href} className={`bg-card border rounded-xl p-5 shadow-soft hover:shadow-elegant transition-smooth ${c.highlight && c.value > 0 ? "border-primary/40 bg-primary/5" : ""}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-extrabold">{c.value}</div>
          </Link>
        ))}
      </div>
      <div className="bg-card border rounded-xl p-6 shadow-soft">
        <h2 className="font-bold mb-3">اختصارات سريعة</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          <Link to="/admin/hero" className="rounded border px-3 py-2 hover:bg-muted">تعديل قسم البداية</Link>
          <Link to="/admin/contact" className="rounded border px-3 py-2 hover:bg-muted">تعديل بيانات الاتصال</Link>
          <Link to="/admin/products" className="rounded border px-3 py-2 hover:bg-muted">إدارة المتجر</Link>
          <Link to="/admin/services" className="rounded border px-3 py-2 hover:bg-muted">إدارة الخدمات</Link>
          <Link to="/admin/submissions" className="rounded border px-3 py-2 hover:bg-muted">مراجعة الطلبات</Link>
          <Link to="/admin/seo" className="rounded border px-3 py-2 hover:bg-muted">إعدادات SEO</Link>
        </div>
      </div>
    </div>
  );
}
