import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCart, Repeat } from "lucide-react";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/SectionHeading";
import { productsQO, contactQO } from "@/lib/public-queries";
import { productImage, waLinkFor } from "@/lib/media";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "المتجر الطبي | بيع وتأجير الأجهزة الطبية | سونو" },
      { name: "description", content: "تسوق أو استأجر أجهزة طبية معتمدة: أكسجين، أسرّة كهربائية، كراسي متحركة، أجهزة مراقبة، CPAP، نيبولايزر والمزيد." },
      { property: "og:title", content: "المتجر الطبي | سونو للخدمات الطبية" },
      { property: "og:description", content: "أجهزة طبية للبيع والإيجار بأسعار شفافة وضمان." },
    ],
    links: [{ rel: "canonical", href: "https://www.swnwmedicalcare.com/store" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQO),
      context.queryClient.ensureQueryData(contactQO),
    ]);
  },
  component: StorePage,
  errorComponent: ({ error }) => <div className="container mx-auto p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="container mx-auto p-8 text-center">لا توجد منتجات.</div>,
});

function StorePage() {
  const { data: products } = useSuspenseQuery(productsQO);
  const { data: contact } = useSuspenseQuery(contactQO);
  const whatsapp = contact?.whatsapp ?? site.whatsapp;
  const [cat, setCat] = useState<string>("الكل");
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [products]);
  const list = cat === "الكل" ? products : products.filter((p) => p.category === cat);

  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">المتجر الطبي</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-8">أجهزة طبية أصلية بضمان — متاحة للبيع أو الإيجار اليومي.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {["الكل", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-smooth border ${cat === c ? "bg-gradient-hero text-primary-foreground border-transparent shadow-soft" : "bg-white text-foreground/80 border-border hover:bg-secondary"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((p) => {
            const slug = p.slug ?? "";
            const img = productImage(slug, p.image);
            const buy = Number(p.buy_price ?? 0);
            const rent = Number(p.rent_price ?? 0);
            return (
              <div key={p.id ?? slug} className="group bg-white rounded-2xl border border-border shadow-soft hover:shadow-elegant overflow-hidden transition-smooth hover:-translate-y-1">
                <Link to="/store/$slug" params={{ slug }} className="block aspect-square overflow-hidden bg-secondary/30">
                  <img src={img} alt={p.name} width={800} height={800} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                </Link>
                <div className="p-5">
                  <div className="text-xs text-primary font-bold mb-1">{p.category}</div>
                  <Link to="/store/$slug" params={{ slug: p.slug }} className="font-extrabold text-lg hover:text-primary transition-smooth line-clamp-1">{p.name}</Link>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-6">{p.short}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-secondary/60 rounded-lg py-2">
                      <div className="text-[10px] text-muted-foreground">سعر الشراء</div>
                      <div className="font-extrabold text-primary text-sm">{buy.toLocaleString("ar-EG")} ج.م</div>
                    </div>
                    <div className="bg-secondary/60 rounded-lg py-2">
                      <div className="text-[10px] text-muted-foreground">سعر الإيجار/يوم</div>
                      <div className="font-extrabold text-primary text-sm">{rent.toLocaleString("ar-EG")} ج.م</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a href={waLinkFor(whatsapp, `أرغب في شراء: ${p.name}`)} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1.5 bg-gradient-hero text-primary-foreground py-2 rounded-lg text-xs font-bold hover:shadow-elegant transition-smooth">
                      <ShoppingCart className="h-3.5 w-3.5" /> شراء
                    </a>
                    <a href={waLinkFor(whatsapp, `أرغب في إيجار: ${p.name}`)} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1.5 bg-white text-primary border border-primary/30 py-2 rounded-lg text-xs font-bold hover:bg-secondary transition-smooth">
                      <Repeat className="h-3.5 w-3.5" /> إيجار
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
