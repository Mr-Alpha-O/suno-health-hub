import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCart, Repeat, Search, X, Heart } from "lucide-react";
import { site } from "@/lib/site";
import { productsQO, contactQO } from "@/lib/public-queries";
import { productImage, waLinkFor } from "@/lib/media";
import { useFavorites } from "@/lib/favorites";

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

type SortKey = "default" | "newest" | "name" | "buy_asc" | "buy_desc" | "rent_asc" | "rent_desc";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "") // Arabic diacritics
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

function StorePage() {
  const { data: products } = useSuspenseQuery(productsQO);
  const { data: contact } = useSuspenseQuery(contactQO);
  const whatsapp = contact?.whatsapp ?? site.whatsapp;
  const fav = useFavorites();

  const [cat, setCat] = useState<string>("الكل");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const [onlySale, setOnlySale] = useState(false);
  const [onlyRent, setOnlyRent] = useState(false);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [products]);

  const list = useMemo(() => {
    const nq = normalize(q);
    let arr = products.slice();
    if (cat !== "الكل") arr = arr.filter((p) => p.category === cat);
    if (onlySale) arr = arr.filter((p: any) => p.available_for_sale !== false);
    if (onlyRent) arr = arr.filter((p: any) => p.available_for_rent !== false);
    if (onlyAvail) arr = arr.filter((p: any) => p.is_available !== false);
    if (onlyFav) arr = arr.filter((p) => fav.has(p.id as string));
    if (nq) {
      arr = arr.filter((p: any) => {
        const hay = normalize([p.name, p.short, p.category, ...(Array.isArray(p.details) ? p.details : [])].filter(Boolean).join(" "));
        return hay.includes(nq);
      });
    }
    const pricedFirst = (v: number | null | undefined) => (v == null || Number(v) <= 0 ? 1 : 0);
    const num = (v: any) => (v == null ? 0 : Number(v));
    switch (sort) {
      case "newest":
        arr.sort((a: any, b: any) => (b.created_at ?? "").localeCompare(a.created_at ?? "")); break;
      case "name":
        arr.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "ar")); break;
      case "buy_asc":
        arr.sort((a: any, b: any) => pricedFirst(a.buy_price) - pricedFirst(b.buy_price) || num(a.buy_price) - num(b.buy_price)); break;
      case "buy_desc":
        arr.sort((a: any, b: any) => pricedFirst(a.buy_price) - pricedFirst(b.buy_price) || num(b.buy_price) - num(a.buy_price)); break;
      case "rent_asc":
        arr.sort((a: any, b: any) => pricedFirst(a.rent_price) - pricedFirst(b.rent_price) || num(a.rent_price) - num(b.rent_price)); break;
      case "rent_desc":
        arr.sort((a: any, b: any) => pricedFirst(a.rent_price) - pricedFirst(b.rent_price) || num(b.rent_price) - num(a.rent_price)); break;
    }
    return arr;
  }, [products, cat, q, sort, onlySale, onlyRent, onlyAvail, onlyFav, fav]);

  const anyFilter = q || cat !== "الكل" || sort !== "default" || onlySale || onlyRent || onlyAvail || onlyFav;
  const reset = () => { setQ(""); setCat("الكل"); setSort("default"); setOnlySale(false); setOnlyRent(false); setOnlyAvail(false); setOnlyFav(false); };

  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">المتجر الطبي</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-8">أجهزة طبية أصلية بضمان — متاحة للبيع أو الإيجار اليومي.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto] items-center">
          <div className="relative">
            <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج، فئة، وصف..."
              className="w-full rounded-full border border-border bg-white pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-bold text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="newest">الأحدث</option>
            <option value="name">الاسم</option>
            <option value="buy_asc">سعر الشراء: من الأقل للأعلى</option>
            <option value="buy_desc">سعر الشراء: من الأعلى للأقل</option>
            <option value="rent_asc">سعر الإيجار: من الأقل للأعلى</option>
            <option value="rent_desc">سعر الإيجار: من الأعلى للأقل</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 justify-center">
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

        <div className="flex flex-wrap gap-2 mb-8 justify-center items-center text-xs">
          <FilterChip active={onlySale} onClick={() => setOnlySale((v) => !v)}>للبيع</FilterChip>
          <FilterChip active={onlyRent} onClick={() => setOnlyRent((v) => !v)}>للإيجار</FilterChip>
          <FilterChip active={onlyAvail} onClick={() => setOnlyAvail((v) => !v)}>متاح فقط</FilterChip>
          <FilterChip active={onlyFav} onClick={() => setOnlyFav((v) => !v)}>
            <Heart className={`h-3.5 w-3.5 inline -mt-0.5 ml-1 ${onlyFav ? "fill-current" : ""}`} /> المفضلة {fav.ids.length > 0 && `(${fav.ids.length})`}
          </FilterChip>
          {anyFilter && (
            <button onClick={reset} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-muted-foreground hover:text-primary">
              <X className="h-3.5 w-3.5" /> مسح الفلاتر
            </button>
          )}
        </div>

        {list.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            لا توجد نتائج مطابقة.
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((p) => {
            const slug = p.slug ?? "";
            const img = productImage(slug, p.image);
            const buy = p.buy_price == null ? null : Number(p.buy_price);
            const rent = p.rent_price == null ? null : Number(p.rent_price);
            const rentalUnit = ((p as any).rental_unit as string) ?? "day";
            const showBuy = (p as any).show_buy_price !== false && buy != null && buy > 0;
            const showRent = (p as any).show_rent_price !== false && rent != null && rent > 0;
            const forSale = (p as any).available_for_sale !== false;
            const forRent = (p as any).available_for_rent !== false;
            const unitLabel: Record<string, string> = { hour: "ساعة", day: "يوم", week: "أسبوع", month: "شهر", year: "سنة", negotiable: "" };
            const rentSuffix = rentalUnit === "negotiable" || !unitLabel[rentalUnit] ? "" : ` / ${unitLabel[rentalUnit]}`;
            const isFav = fav.has(p.id as string);
            const saleOnly = forSale && !forRent;
            const rentOnly = forRent && !forSale;
            const isNegotiable = rentalUnit === "negotiable";
            return (
              <div key={p.id ?? slug} className="group bg-white rounded-2xl border border-border shadow-soft hover:shadow-elegant overflow-hidden transition-smooth hover:-translate-y-1 relative flex flex-col">
                <button
                  onClick={(e) => { e.preventDefault(); fav.toggle(p.id as string); }}
                  aria-label={isFav ? "إزالة من المفضلة" : "أضف للمفضلة"}
                  className={`absolute top-2 left-2 z-10 h-9 w-9 rounded-full flex items-center justify-center backdrop-blur bg-white/80 hover:bg-white shadow-soft transition-smooth ${isFav ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                >
                  <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                </button>
                <Link to="/store/$slug" params={{ slug }} className="block aspect-square overflow-hidden bg-secondary/30 flex items-center justify-center">
                  <img src={img} alt={p.name} width={800} height={800} loading="lazy" className="w-full h-full object-contain group-hover:scale-105 transition-smooth" />
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  {p.category && <div className="text-xs text-primary font-bold mb-1">{p.category}</div>}
                  <Link to="/store/$slug" params={{ slug: p.slug }} className="font-extrabold text-lg hover:text-primary transition-smooth line-clamp-1">{p.name}</Link>
                  {p.short && <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-6">{p.short}</p>}
                  {(saleOnly || rentOnly || isNegotiable) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {saleOnly && <CardBadge tone="emerald">للبيع فقط</CardBadge>}
                      {rentOnly && <CardBadge tone="sky">للإيجار فقط</CardBadge>}
                      {isNegotiable && <CardBadge tone="amber">قابل للتفاوض</CardBadge>}
                    </div>
                  )}
                  {(forSale || forRent) && (
                    <div className={`mt-auto pt-4 grid gap-2 ${forSale && forRent ? "grid-cols-2" : "grid-cols-1"}`}>
                      {forSale && (
                        <a href={waLinkFor(whatsapp, `أرغب في شراء: ${p.name}`)} target="_blank" rel="noopener" className="flex flex-col items-center justify-center gap-0.5 bg-gradient-hero text-primary-foreground py-2.5 px-2 rounded-xl font-bold hover:shadow-elegant transition-smooth">
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <ShoppingCart className="h-3.5 w-3.5" /> شراء
                          </span>
                          {showBuy && <span className="text-sm font-extrabold">{buy!.toLocaleString("ar-EG")} ج.م</span>}
                        </a>
                      )}
                      {forRent && (
                        <a href={waLinkFor(whatsapp, `أرغب في إيجار: ${p.name}`)} target="_blank" rel="noopener" className="flex flex-col items-center justify-center gap-0.5 bg-white text-primary border border-primary/30 py-2.5 px-2 rounded-xl font-bold hover:bg-secondary transition-smooth">
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <Repeat className="h-3.5 w-3.5" /> إيجار
                          </span>
                          {showRent && (
                            <span className="text-sm font-extrabold whitespace-nowrap">
                              {rent!.toLocaleString("ar-EG")} ج.م<span className="text-[10px] text-muted-foreground">{rentSuffix}</span>
                            </span>
                          )}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>
    </>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full font-bold border transition-smooth ${active ? "bg-primary text-primary-foreground border-transparent" : "bg-white text-foreground/70 border-border hover:bg-secondary"}`}
    >
      {children}
    </button>
  );
}

function CardBadge({ tone, children }: { tone: "emerald" | "sky" | "amber"; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    sky: "bg-sky-100 text-sky-800 ring-sky-200",
    amber: "bg-amber-100 text-amber-800 ring-amber-200",
  };
  const dot: Record<string, string> = { emerald: "bg-emerald-500", sky: "bg-sky-500", amber: "bg-amber-500" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${styles[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[tone]}`} />
      {children}
    </span>
  );
}
