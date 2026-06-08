import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MessageCircle, ShoppingCart, Repeat } from "lucide-react";
import { products, waLink } from "@/lib/site";

export const Route = createFileRoute("/store/$slug")({
  head: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: p ? `${p.name} | متجر سونو الطبي` : "منتج | متجر سونو" },
        { name: "description", content: p?.short ?? "منتج طبي من سونو." },
        { property: "og:title", content: p?.name ?? "منتج" },
        { property: "og:description", content: p?.short ?? "" },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: `/store/${params.slug}` }],
    };
  },
  loader: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">المنتج غير موجود</h1>
      <Link to="/store" className="mt-6 inline-block text-primary font-bold">العودة للمتجر</Link>
    </div>
  ),
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  return (
    <section className="container mx-auto px-4 py-12">
      <Link to="/store" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-smooth">
        <ArrowRight className="h-4 w-4" /> العودة للمتجر
      </Link>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="rounded-3xl overflow-hidden bg-secondary/30 border border-border shadow-elegant aspect-square">
          <img src={p.image} alt={p.name} width={800} height={800} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-sm text-primary font-bold">{p.category}</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">{p.name}</h1>
          <p className="mt-4 text-muted-foreground leading-8">{p.short}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-card rounded-2xl p-5 border border-border">
              <div className="text-xs text-muted-foreground">سعر الشراء</div>
              <div className="mt-1 text-2xl font-extrabold text-primary">{p.buy.toLocaleString("ar-EG")} ج.م</div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-5 border border-border">
              <div className="text-xs text-muted-foreground">سعر الإيجار / يوم</div>
              <div className="mt-1 text-2xl font-extrabold text-primary">{p.rent.toLocaleString("ar-EG")} ج.م</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={waLink(`أرغب في شراء: ${p.name}`)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-soft hover:shadow-elegant transition-smooth">
              <ShoppingCart className="h-4 w-4" /> اشترِ الآن
            </a>
            <a href={waLink(`أرغب في إيجار: ${p.name}`)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-white text-primary border border-primary/30 px-5 py-3 rounded-xl font-bold hover:bg-secondary transition-smooth">
              <Repeat className="h-4 w-4" /> استأجر
            </a>
            <a href={waLink(`استفسار عن: ${p.name}`)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-primary hover:bg-secondary transition-smooth">
              <MessageCircle className="h-4 w-4" /> استفسر
            </a>
          </div>

          <div className="mt-8">
            <h3 className="font-extrabold text-lg mb-3">المميزات</h3>
            <ul className="space-y-2">
              {p.details.map((d) => (
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
