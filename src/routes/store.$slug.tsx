import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, MessageCircle, ShoppingCart, Repeat, Phone, Share2, Copy, Heart } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";
import { productBySlugQO, contactQO, productsQO } from "@/lib/public-queries";
import { productImage, waLinkFor } from "@/lib/media";
import { Lightbox } from "@/components/Lightbox";
import { useFavorites } from "@/lib/favorites";
import { ProductBadgeList } from "@/components/ProductBadge";

export const Route = createFileRoute("/store/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `منتج ${params.slug} | متجر سونو الطبي` },
      { name: "description", content: "منتج طبي من سونو." },
      { property: "og:title", content: "منتج | متجر سونو" },
      { property: "og:description", content: "منتج طبي من سونو." },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: `https://www.swnwmedicalcare.com/store/${params.slug}` }],
  }),
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(productBySlugQO(params.slug));
    if (!data) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(contactQO),
      context.queryClient.ensureQueryData(productsQO),
    ]);
  },
  component: ProductPage,
  errorComponent: ({ error }) => <div className="container mx-auto p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">المنتج غير موجود</h1>
      <Link to="/store" className="mt-6 inline-block text-primary font-bold">العودة للمتجر</Link>
    </div>
  ),
});

const unitLabel: Record<string, string> = { hour: "ساعة", day: "يوم", week: "أسبوع", month: "شهر", year: "سنة", negotiable: "" };

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productBySlugQO(slug));
  const { data: contact } = useSuspenseQuery(contactQO);
  const { data: allProducts } = useSuspenseQuery(productsQO);
  const fav = useFavorites();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!p) return null;

  const whatsapp = contact?.whatsapp ?? site.whatsapp;
  const phoneIntl = contact?.phone_intl ?? site.phoneIntl;
  const mainImg = productImage(p.slug ?? "", p.image);
  const gallery = [mainImg, ...((p as any).images ?? []).map((i: any) => i.url as string)].filter(Boolean);
  const buy = p.buy_price == null ? null : Number(p.buy_price);
  const rent = p.rent_price == null ? null : Number(p.rent_price);
  const details = Array.isArray(p.details) ? (p.details as string[]) : [];
  const rentalUnit = ((p as any).rental_unit as string) ?? "day";
  const showBuy = (p as any).show_buy_price !== false && buy != null && buy > 0;
  const showRent = (p as any).show_rent_price !== false && rent != null && rent > 0;
  const forSale = (p as any).available_for_sale !== false;
  const forRent = (p as any).available_for_rent !== false;
  const rentSuffix = rentalUnit === "negotiable" || !unitLabel[rentalUnit] ? "" : ` / ${unitLabel[rentalUnit]}`;
  const isFav = fav.has(p.id as string);

  const productUrl = `https://www.swnwmedicalcare.com/store/${p.slug}`;
  const shareTitle = p.name;
  const shareText = [p.name, p.short].filter(Boolean).join(" — ");
  const enquiryLines = [`استفسار عن: ${p.name}`];
  if (forSale && forRent) enquiryLines.push("مهتم بـ (الشراء / الإيجار).");
  else if (forSale) enquiryLines.push("مهتم بالشراء.");
  else if (forRent) enquiryLines.push("مهتم بالإيجار.");
  enquiryLines.push(productUrl);
  const enquiryMsg = enquiryLines.join("\n");

  const onShare = async () => {
    const url = productUrl;
    const shareData = { title: shareTitle, text: shareText, url };
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try { await (navigator as any).share(shareData); return; } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(productUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  const shareWa = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${productUrl}`)}`;

  const others = allProducts.filter((x) => x.id !== p.id);
  const related = [
    ...others.filter((x) => x.category && x.category === p.category),
    ...others.filter((x) => !x.category || x.category !== p.category),
  ].slice(0, 4);




  return (
    <section className="container mx-auto px-4 py-12">
      <Link to="/store" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-smooth">
        <ArrowRight className="h-4 w-4" /> العودة للمتجر
      </Link>
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <button
            onClick={() => setLightbox(true)}
            aria-label="عرض الصورة بحجم أكبر"
            className="group w-full rounded-3xl overflow-hidden bg-secondary/30 border border-border shadow-elegant aspect-square flex items-center justify-center cursor-zoom-in"
          >
            <img
              src={gallery[active] ?? mainImg}
              alt={p.name}
              width={800}
              height={800}
              className="w-full h-full object-contain transition-transform duration-500 md:group-hover:scale-110"
            />
          </button>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {gallery.map((g, i) => (
                <button
                  key={g + i}
                  onClick={() => setActive(i)}
                  aria-label={`صورة ${i + 1}`}
                  className={`rounded-lg overflow-hidden aspect-square border-2 bg-secondary/30 flex items-center justify-center transition-smooth ${active === i ? "border-primary shadow-soft" : "border-transparent hover:border-primary/40"}`}
                >
                  <img src={g} alt="" loading="lazy" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              {p.category && <div className="text-sm text-primary font-bold">{p.category}</div>}
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">{p.name}</h1>
              {((p as any).badges?.length ?? 0) > 0 && (
                <div className="mt-3">
                  <ProductBadgeList badges={(p as any).badges} />
                </div>
              )}
            </div>
            <button
              onClick={() => fav.toggle(p.id as string)}
              aria-label={isFav ? "إزالة من المفضلة" : "أضف للمفضلة"}
              className={`shrink-0 h-11 w-11 rounded-full border border-border bg-white flex items-center justify-center transition-smooth ${isFav ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
            >
              <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
            </button>
          </div>
          {p.short && <p className="mt-4 text-muted-foreground leading-8">{p.short}</p>}

          {(forSale || forRent) && (
            <div className={`mt-6 grid gap-3 ${forSale && forRent ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {forSale && (
                <a
                  href={waLinkFor(whatsapp, `أرغب في شراء: ${p.name}\n${productUrl}`)}
                  target="_blank"
                  rel="noopener"
                  className="group flex flex-col items-center justify-center gap-1 bg-gradient-hero text-primary-foreground rounded-2xl px-5 py-4 font-bold shadow-soft hover:shadow-elegant transition-smooth"
                >
                  <span className="inline-flex items-center gap-2 text-base">
                    <ShoppingCart className="h-5 w-5" /> شراء
                  </span>
                  {showBuy && (
                    <span className="text-xl font-extrabold tracking-tight">{buy!.toLocaleString("ar-EG")} ج.م</span>
                  )}
                </a>
              )}
              {forRent && (
                <a
                  href={waLinkFor(whatsapp, `أرغب في إيجار: ${p.name}\n${productUrl}`)}
                  target="_blank"
                  rel="noopener"
                  className="group flex flex-col items-center justify-center gap-1 bg-white text-primary border border-primary/30 rounded-2xl px-5 py-4 font-bold hover:bg-secondary hover:shadow-soft transition-smooth"
                >
                  <span className="inline-flex items-center gap-2 text-base">
                    <Repeat className="h-5 w-5" /> إيجار
                  </span>
                  {showRent && (
                    <span className="text-xl font-extrabold tracking-tight">
                      {rent!.toLocaleString("ar-EG")} ج.م<span className="text-xs font-bold text-muted-foreground">{rentSuffix}</span>
                    </span>
                  )}
                </a>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <a href={waLinkFor(whatsapp, enquiryMsg)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-primary hover:bg-secondary transition-smooth border border-transparent hover:border-primary/20">
              <MessageCircle className="h-4 w-4" /> واتساب
            </a>
            <a href={`tel:${phoneIntl}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-primary hover:bg-secondary transition-smooth border border-transparent hover:border-primary/20">
              <Phone className="h-4 w-4" /> اتصل
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <button onClick={onShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-secondary text-foreground/80 hover:bg-secondary/70 transition-smooth">
              <Share2 className="h-4 w-4" /> مشاركة
            </button>
            <a href={shareWa} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#25D366]/10 text-[#128C4A] hover:bg-[#25D366]/20 transition-smooth">
              <MessageCircle className="h-4 w-4" /> واتساب
            </a>
            <button onClick={copyLink} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-secondary text-foreground/80 hover:bg-secondary/70 transition-smooth">
              <Copy className="h-4 w-4" /> {copied ? "تم النسخ" : "نسخ الرابط"}
            </button>
          </div>

          {details.length > 0 && (
            <div className="mt-8">
              <h3 className="font-extrabold text-lg mb-3">المميزات</h3>
              <ul className="space-y-2">
                {details.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">منتجات مشابهة</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => {
              const rSlug = r.slug ?? "";
              const rImg = productImage(rSlug, r.image);
              const rBuy = r.buy_price == null ? null : Number(r.buy_price);
              const rRent = r.rent_price == null ? null : Number(r.rent_price);
              const rShowBuy = (r as any).show_buy_price !== false && rBuy != null && rBuy > 0;
              const rShowRent = (r as any).show_rent_price !== false && rRent != null && rRent > 0;
              return (
                <Link to="/store/$slug" params={{ slug: rSlug }} key={r.id} className="group bg-white rounded-2xl border border-border shadow-soft hover:shadow-elegant overflow-hidden transition-smooth hover:-translate-y-1 block">
                  <div className="aspect-square overflow-hidden bg-secondary/30 flex items-center justify-center">
                    <img src={rImg} alt={r.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-105 transition-smooth" />
                  </div>
                  <div className="p-4">
                    {r.category && <div className="text-xs text-primary font-bold mb-1">{r.category}</div>}
                    <div className="font-extrabold text-base line-clamp-1">{r.name}</div>
                    {(rShowBuy || rShowRent) && (
                      <div className="mt-2 text-xs text-primary font-bold">
                        {rShowBuy && <>شراء: {rBuy!.toLocaleString("ar-EG")} ج.م</>}
                        {rShowBuy && rShowRent && " · "}
                        {rShowRent && <>إيجار: {rRent!.toLocaleString("ar-EG")} ج.م</>}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {lightbox && (
        <Lightbox images={gallery} startIndex={active} onClose={() => setLightbox(false)} alt={p.name} />
      )}
    </section>
  );
}



