import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import { LayoutDashboard, Settings, Package, ListTree, Image as ImageIcon, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "الرئيسية", icon: LayoutDashboard, exact: true },
  { to: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
  { to: "/admin/services", label: "الخدمات", icon: ListTree },
  { to: "/admin/products", label: "المتجر", icon: Package },
  { to: "/admin/media", label: "مكتبة الوسائط", icon: ImageIcon },
];

function AdminLayout() {
  const navigate = useNavigate();
  const check = useServerFn(checkIsAdmin);
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    check()
      .then((r) => setStatus(r.isAdmin ? "ok" : "denied"))
      .catch(() => setStatus("denied"));
  }, [check]);

  async function signOut() {
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
