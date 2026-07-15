import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardCounts } from "@/lib/cms.functions";
import { getDashboardRecent } from "@/lib/doctors-sections.functions";
import { Package, ListTree, Users, Briefcase, MessageSquareQuote, HelpCircle, Inbox, Mail, Stethoscope, CalendarClock, CalendarDays, CalendarRange } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Dashboard });

function fmt(d: string) { try { return new Date(d).toLocaleString("ar-EG"); } catch { return d; } }

function Dashboard() {
  const countsFn = useServerFn(getDashboardCounts);
  const recentFn = useServerFn(getDashboardRecent);
  const [d, setD] = useState<Awaited<ReturnType<typeof countsFn>> | null>(null);
  const [r, setR] = useState<Awaited<ReturnType<typeof recentFn>> | null>(null);

  useEffect(() => {
    countsFn().then(setD).catch(() => {});
    recentFn().then(setR).catch(() => {});
  }, [countsFn, recentFn]);

  const totals = d?.totals ?? ({} as Record<string, number>);
  const inbox = d?.newInbox ?? ({} as Record<string, number>);
  const req = d?.requests ?? { today: 0, week: 0, month: 0 };

  const inboxCards = [
    { label: "طلبات خدمة جديدة", value: inbox.service_submissions ?? 0, icon: Inbox, href: "/admin/submissions" },
    { label: "طلبات توظيف جديدة", value: inbox.job_applications ?? 0, icon: Briefcase, href: "/admin/submissions" },
    { label: "رسائل جديدة", value: inbox.contact_messages ?? 0, icon: Mail, href: "/admin/submissions" },
  ];

  const timeCards = [
    { label: "طلبات اليوم", value: req.today, icon: CalendarClock },
    { label: "طلبات الأسبوع", value: req.week, icon: CalendarDays },
    { label: "طلبات الشهر", value: req.month, icon: CalendarRange },
  ];

  const totalCards = [
    { label: "المنتجات", value: totals.products ?? 0, icon: Package, href: "/admin/products" },
    { label: "الخدمات", value: totals.service_categories ?? 0, icon: ListTree, href: "/admin/services" },
    { label: "الأطباء", value: totals.doctors ?? r?.doctorsCount ?? 0, icon: Stethoscope, href: "/admin/doctors" },
    { label: "الوظائف", value: totals.jobs ?? 0, icon: Briefcase, href: "/admin/jobs" },
    { label: "الفريق", value: totals.team_members ?? 0, icon: Users, href: "/admin/team" },
    { label: "رسائل التواصل", value: totals.contact_messages ?? 0, icon: Mail, href: "/admin/submissions" },
    { label: "طلبات الخدمة", value: totals.service_submissions ?? 0, icon: Inbox, href: "/admin/submissions" },
    { label: "الشهادات", value: totals.testimonials ?? 0, icon: MessageSquareQuote, href: "/admin/testimonials" },
    { label: "الأسئلة الشائعة", value: totals.faqs ?? 0, icon: HelpCircle, href: "/admin/faqs" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold">مرحباً بك في لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">نظرة عامة على محتوى الموقع.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {inboxCards.map((c) => (
          <Link key={c.label} to={c.href} className={`bg-card border rounded-xl p-5 shadow-soft hover:shadow-elegant transition-smooth ${c.value > 0 ? "border-primary/40 bg-primary/5" : ""}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <div className="relative">
                <c.icon className="h-5 w-5 text-primary" />
                {c.value > 0 && <span className="absolute -top-1 -left-2 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">{c.value}</span>}
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {timeCards.map((c) => (
          <div key={c.label} className="bg-card border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-extrabold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {totalCards.map((c) => (
          <Link key={c.label} to={c.href} className="bg-card border rounded-xl p-5 shadow-soft hover:shadow-elegant transition-smooth">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-extrabold">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <RecentCard title="آخر 10 طلبات خدمة" href="/admin/submissions" empty="لا توجد طلبات بعد.">
          {(r?.recentServiceRequests ?? []).map((s: any) => (
            <RecentRow key={s.id} title={s.name} sub={`${s.service_slug ?? ""} ${s.sub_service ? "• " + s.sub_service : ""}`} meta={fmt(s.created_at)} status={s.status} />
          ))}
        </RecentCard>
        <RecentCard title="آخر 10 رسائل تواصل" href="/admin/submissions" empty="لا توجد رسائل بعد.">
          {(r?.recentContactMessages ?? []).map((s: any) => (
            <RecentRow key={s.id} title={s.name} sub={s.subject ?? s.email ?? ""} meta={fmt(s.created_at)} status={s.status} />
          ))}
        </RecentCard>
        <RecentCard title="آخر 10 طلبات توظيف" href="/admin/submissions" empty="لا توجد طلبات توظيف بعد.">
          {(r?.recentJobApplications ?? []).map((s: any) => (
            <RecentRow key={s.id} title={s.name} sub={s.position ?? ""} meta={fmt(s.created_at)} status={s.status} />
          ))}
        </RecentCard>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-soft">
        <h2 className="font-bold mb-3">اختصارات سريعة</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
          <Link to="/admin/homepage" className="rounded border px-3 py-2 hover:bg-muted">ترتيب أقسام الصفحة الرئيسية</Link>
          <Link to="/admin/hero" className="rounded border px-3 py-2 hover:bg-muted">تعديل قسم البداية</Link>
          <Link to="/admin/doctors" className="rounded border px-3 py-2 hover:bg-muted">إدارة الأطباء</Link>
          <Link to="/admin/products" className="rounded border px-3 py-2 hover:bg-muted">إدارة المتجر</Link>
          <Link to="/admin/services" className="rounded border px-3 py-2 hover:bg-muted">إدارة الخدمات</Link>
          <Link to="/admin/contact" className="rounded border px-3 py-2 hover:bg-muted">تعديل بيانات الاتصال</Link>
          <Link to="/admin/backup" className="rounded border px-3 py-2 hover:bg-muted">النسخ الاحتياطي</Link>
          <Link to="/admin/logs" className="rounded border px-3 py-2 hover:bg-muted">سجل النشاط</Link>
        </div>
      </div>
    </div>
  );
}

function RecentCard({ title, href, empty, children }: { title: string; href: string; empty: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children : [children];
  const nonEmpty = items.filter(Boolean);
  return (
    <div className="bg-card border rounded-xl shadow-soft">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-bold">{title}</h3>
        <Link to={href} className="text-xs text-primary font-bold">عرض الكل</Link>
      </div>
      <div className="divide-y">
        {nonEmpty.length === 0 ? <div className="p-6 text-center text-sm text-muted-foreground">{empty}</div> : children}
      </div>
    </div>
  );
}

function RecentRow({ title, sub, meta, status }: { title: string; sub?: string; meta: string; status?: string }) {
  return (
    <div className="p-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-bold truncate">{title}</div>
        {sub && <div className="text-xs text-muted-foreground truncate">{sub}</div>}
      </div>
      <div className="text-xs text-muted-foreground shrink-0 text-left">
        {status && <span className="inline-block bg-muted rounded px-2 py-0.5 mb-1">{status}</span>}
        <div>{meta}</div>
      </div>
    </div>
  );
}
