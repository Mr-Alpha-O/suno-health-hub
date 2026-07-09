import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listCategories, listProducts, listSettings } from "@/lib/admin.functions";
import { Package, ListTree, Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const lc = useServerFn(listCategories);
  const lp = useServerFn(listProducts);
  const ls = useServerFn(listSettings);
  const [stats, setStats] = useState({ cats: 0, subs: 0, products: 0, settings: 0 });

  useEffect(() => {
    Promise.all([lc(), lp(), ls()]).then(([cats, prods, sets]) => {
      const subs = (cats ?? []).reduce((n: number, c: any) => n + (c.service_subs?.length ?? 0), 0);
      setStats({ cats: cats?.length ?? 0, subs, products: prods?.length ?? 0, settings: sets?.length ?? 0 });
    }).catch(() => {});
  }, [lc, lp, ls]);

  const cards = [
    { label: "الأقسام", value: stats.cats, icon: ListTree },
    { label: "الخدمات الفرعية", value: stats.subs, icon: ListTree },
    { label: "المنتجات", value: stats.products, icon: Package },
    { label: "الإعدادات", value: stats.settings, icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">مرحباً بك</h1>
        <p className="text-sm text-muted-foreground mt-1">نظرة عامة على محتوى الموقع.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-extrabold">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-card border rounded-xl p-6 shadow-soft">
        <h2 className="font-bold mb-2">ابدأ من هنا</h2>
        <ul className="text-sm text-muted-foreground list-disc mr-5 space-y-1">
          <li>أضِف الأقسام والخدمات الفرعية من صفحة "الخدمات".</li>
          <li>أدِر منتجات المتجر من صفحة "المتجر".</li>
          <li>ارفع الصور والشعارات من "مكتبة الوسائط".</li>
          <li>عدّل بيانات الاتصال والشعار من "إعدادات الموقع".</li>
        </ul>
      </div>
    </div>
  );
}
