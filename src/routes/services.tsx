import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, HeartPulse, Stethoscope, Microscope, Ambulance, Package, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { serviceCategoriesQO } from "@/lib/public-queries";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدماتنا | سونو للخدمات الطبية" },
      { name: "description", content: "تصفح خدمات سونو الطبية: تمريض منزلي، كشف طبي منزلي، تحاليل وأشعة، إسعاف ونقل مرضى، وأجهزة طبية." },
      { property: "og:title", content: "خدماتنا | سونو للخدمات الطبية" },
      { property: "og:description", content: "خدمات طبية متكاملة لمنزلك وعائلتك." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(serviceCategoriesQO),
  component: ServicesPage,
  errorComponent: ({ error }) => <div className="container mx-auto p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="container mx-auto p-8 text-center">لم يتم العثور على الخدمات.</div>,
});

const iconMap = {
  nursing: HeartPulse,
  doctor: Stethoscope,
  lab: Microscope,
  ambulance: Ambulance,
  equipment: Package,
} as const;
type IconKey = keyof typeof iconMap;
function iconFor(k: string | null | undefined): IconKey {
  return (k && k in iconMap ? k : "nursing") as IconKey;
}

function ServicesPage() {
  const { data: categories } = useSuspenseQuery(serviceCategoriesQO);
  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">خدماتنا الطبية</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-8">
            خمس مجموعات خدمية متكاملة لتلبية كل احتياجاتك الصحية بأعلى معايير الجودة.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <SectionHeading eyebrow="فئاتنا" title="استعرض جميع الفئات والخدمات الفرعية" desc="كل فئة تضم باقة كاملة من الخدمات المتخصصة." />
        <div className="space-y-6">
          {categories.map((cat) => (
            <CategoryBlock key={cat.slug} cat={cat} />
          ))}
        </div>
      </section>
    </>
  );
}

type CategoryBlockProps = {
  cat: {
    slug: string;
    name: string;
    description: string | null;
    icon: string | null;
    subs: Array<{ id: string; name: string; featured: boolean | null }>;
  };
};

function CategoryBlock({ cat }: CategoryBlockProps) {
  const Icon = iconMap[iconFor(cat.icon)];
  return (
    <article className="bg-gradient-card rounded-3xl border border-border shadow-soft hover:shadow-elegant transition-smooth overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_2fr]">
        <div className="p-6 md:p-8 bg-gradient-hero text-primary-foreground flex flex-col justify-between gap-4">
          <div>
            <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Icon className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight">{cat.name}</h2>
            <p className="mt-2 text-sm text-white/90 leading-7">{cat.description}</p>
          </div>
          <Link
            to="/request"
            search={{ service: cat.slug } as never}
            className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-xl font-bold text-sm hover:shadow-elegant transition-smooth w-fit"
          >
            اطلب من هذه الفئة <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="p-6 md:p-8">
          <h3 className="text-sm font-bold text-muted-foreground mb-4">الخدمات الفرعية</h3>
          <ul className="grid sm:grid-cols-2 gap-3">
            {cat.subs.map((s) => (
              <li
                key={s.id}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                  s.featured
                    ? "bg-gradient-hero text-primary-foreground font-extrabold shadow-soft"
                    : "bg-white border border-border/60 text-foreground hover:border-primary/30 transition-smooth"
                }`}
              >
                {s.featured ? (
                  <Sparkles className="h-4 w-4 shrink-0" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                )}
                <span>{s.name}</span>
                {s.featured && <span className="ms-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">خدمة مميزة</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
