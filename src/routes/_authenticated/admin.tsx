import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import { getDashboardCounts } from "@/lib/cms.functions";
import { logActivity } from "@/lib/activity-log.functions";
import { LayoutDashboard, Settings, Package, ListTree, Image as ImageIcon, LogOut, Loader2, Sparkles, Info, Users, MessageSquareQuote, HelpCircle, BarChart3, Briefcase, Phone, Menu, Inbox, Search, Stethoscope, LayoutList, Database, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "الرئيسية", icon: LayoutDashboard, exact: true },
  { to: "/admin/submissions", label: "صندوق الوارد", icon: Inbox, badgeKey: "inbox" as const },
  { to: "/admin/homepage", label: "أقسام الصفحة الرئيسية", icon: LayoutList },
  { to: "/admin/hero", label: "قسم البداية", icon: Sparkles },
  { to: "/admin/why-us", label: "لماذا نحن", icon: LayoutDashboard },
  { to: "/admin/about", label: "من نحن", icon: Info },
  { to: "/admin/doctors", label: "الأطباء", icon: Stethoscope },
  { to: "/admin/team", label: "الفريق", icon: Users },
  { to: "/admin/testimonials", label: "آراء العملاء", icon: MessageSquareQuote },
  { to: "/admin/faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
  { to: "/admin/stats", label: "الأرقام", icon: BarChart3 },
  { to: "/admin/services", label: "الخدمات", icon: ListTree },
  { to: "/admin/products", label: "المتجر", icon: Package },
  { to: "/admin/jobs", label: "الوظائف", icon: Briefcase },
  { to: "/admin/contact", label: "بيانات الاتصال", icon: Phone },
  { to: "/admin/nav", label: "روابط التنقل", icon: Menu },
  { to: "/admin/media", label: "الوسائط", icon: ImageIcon },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/backup", label: "النسخ الاحتياطي", icon: Database },
  { to: "/admin/logs", label: "سجل النشاط", icon: ScrollText },
  { to: "/admin/settings", label: "إعدادات عامة", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const check = useServerFn(checkIsAdmin);
  const countsFn = useServerFn(getDashboardCounts);
  const logFn = useServerFn(logActivity);
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");
  const [inboxCount, setInboxCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    check()
      .then((r) => {
        setStatus(r.isAdmin ? "ok" : "denied");
        if (r.isAdmin) { logFn({ data: { action: "login" } }).catch(() => {}); }
      })
      .catch(() => setStatus("denied"));
  }, [check, logFn]);

  useEffect(() => {
    if (status !== "ok") return;
    const refresh = () => countsFn().then((d) => {
      const inbox = d?.newInbox ?? {};
      setInboxCount((inbox.service_submissions ?? 0) + (inbox.job_applications ?? 0) + (inbox.contact_messages ?? 0));
    }).catch(() => {});
    refresh();
    const t = setInterval(refresh, 60_000);
    return () => clearInterval(t);
  }, [status, countsFn, pathname]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function signOut() {
    logFn({ data: { action: "logout" } }).catch(() => {});
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/auth" });
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (status === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-bold">لا تملك صلاحية الوصول</h1>
          <p className="text-sm text-muted-foreground">هذه اللوحة مخصصة للمشرفين فقط.</p>
          <button onClick={signOut} className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">تسجيل الخروج</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
      <aside className="w-64 shrink-0 bg-card border-l flex flex-col">
        <div className="p-4 border-b">
          <div className="text-sm font-bold">لوحة التحكم</div>
          <div className="text-xs text-muted-foreground">SWNW Admin</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to}
                className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-smooth",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={signOut} className="m-3 flex items-center justify-center gap-2 rounded-md border py-2 text-sm font-semibold hover:bg-muted">
          <LogOut className="h-4 w-4" /> تسجيل الخروج
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
