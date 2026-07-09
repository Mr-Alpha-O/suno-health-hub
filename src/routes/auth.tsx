import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("تم تسجيل الدخول");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="rtl">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-card border rounded-xl p-6 shadow-soft space-y-4">
        <h1 className="text-xl font-bold text-center">لوحة الإدارة</h1>
        <p className="text-sm text-muted-foreground text-center">تسجيل دخول للمشرفين فقط</p>
        <div className="space-y-2">
          <label className="text-sm font-semibold">البريد الإلكتروني</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" dir="ltr" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">كلمة المرور</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" dir="ltr" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-bold hover:bg-primary/90 transition-smooth disabled:opacity-60">
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
