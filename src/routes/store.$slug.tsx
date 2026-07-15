import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, MessageCircle, ShoppingCart, Repeat } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";
import { productBySlugQO, contactQO } from "@/lib/public-queries";
import { productImage, waLinkFor } from "@/lib/media";

export const Route = createFileRoute("/store/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `منتج ${params.slug} | متجر سونو الطبي` },
      { name: "description", content: "منتج طبي من سونو." },
      { property: "og:title", content: "منتج | متجر سونو" },
      { property: "og:description", content: "منتج طبي من سونو." },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: `/store/${params.slug}` }],
  }),
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(productBySlugQO(params.slug));
    if (!data) throw notFound();
    await context.queryClient.ensureQueryData(contactQO);
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

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productBySlugQO(slug));
  const { data: contact } = useSuspenseQuery(contactQO);
  if (!p) return null;
  const whatsapp = contact?.whatsapp ?? site.whatsapp;
  const mainImg = productImage(p.slug, p.image);
  const gallery = [mainImg, ...((p as any).images ?? []).map((i: any) => i.url as string)].filter(Boolean);
  const [active, setActive] = useState(0);
  const buy = Number(p.buy_price ?? 0);
  const rent = Number(p.rent_price ?? 0);
  const details = Array.isArray(p.details) ? (p.details as string[]) : [];

  return (
    <section className="container mx-auto px-4 py-12">
      <Link to="/store" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-smooth">
        <ArrowRight className="h-4 w-4" /> العودة للمتجر
      </Link>
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="rounded-3xl overflow-hidden bg-secondary/30 border border-border shadow-elegant aspect-square">
            <img src={gallery[active] ?? mainImg} alt={p.name} width={800} height={800} className="w-full h-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {gallery.map((g, i) => (
                <button key={g + i} onClick={() => setActive(i)} className={`rounded-lg overflow-hidden aspect-square border-2 ${active === i ? "border-primary" : "border-transparent"}`}>
                  <img src={g} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="text-sm text-primary font-bold">{p.category}</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">{p.name}</h1>
          <p className="mt-4 text-muted-foreground leading-8">{p.short}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-card rounded-2xl p-5 border border-border">
              <div className="text-xs text-muted-foreground">سعر الشراء</div>
              <div className="mt-1 text-2xl font-extrabold text-primary">{buy.toLocaleString("ar-EG")} ج.م</div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-5 border border-border">
              <div className="text-xs text-muted-foreground">سعر الإيجار / يوم</div>
              <div className="mt-1 text-2xl font-extrabold text-primary">{rent.toLocaleString("ar-EG")} ج.م</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={waLinkFor(whatsapp, `أرغب في شراء: ${p.name}`)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-soft hover:shadow-elegant transition-smooth">
              <ShoppingCart className="h-4 w-4" /> اشترِ الآن
            </a>
            <a href={waLinkFor(whatsapp, `أرغب في إيجار: ${p.name}`)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-white text-primary border border-primary/30 px-5 py-3 rounded-xl font-bold hover:bg-secondary transition-smooth">
              <Repeat className="h-4 w-4" /> استأجر
            </a>
            <a href={waLinkFor(whatsapp, `استفسار عن: ${p.name}`)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-primary hover:bg-secondary transition-smooth">
              <MessageCircle className="h-4 w-4" /> استفسر
            </a>
          </div>

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
        </div>
      </div>
    </section>
  );
}
