import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Home, Stethoscope, FlaskConical, Ambulance, Package } from "lucide-react";
import { services, type Service } from "@/lib/site";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدماتنا | سونو للخدمات الطبية" },
      { name: "description", content: "تصفح جميع خدمات سونو الطبية: تمريض منزلي، أطباء زيارات، تحاليل وأشعة، إسعاف ونقل مرضى، وأجهزة طبية." },
      { property: "og:title", content: "خدماتنا | سونو للخدمات الطبية" },
      { property: "og:description", content: "خدمات طبية متكاملة لمنزلك وعائلتك." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const groups: { key: Service["category"]; label: string; icon: typeof Home }[] = [
  { key: "home", label: "الخدمات المنزلية", icon: Home },
  { key: "specialty", label: "التخصصات الطبية", icon: Stethoscope },
  { key: "diagnostic", label: "التحاليل والأشعة", icon: FlaskConical },
  { key: "transport", label: "الإسعاف والنقل", icon: Ambulance },
  { key: "equipment", label: "الأجهزة الطبية", icon: Package },
];

function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">خدماتنا الطبية</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-8">
            مجموعة شاملة من الخدمات الطبية لتلبية كافة احتياجاتك الصحية بأعلى معايير الجودة.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 space-y-16">
        {groups.map(({ key, label, icon: Icon }) => {
          const list = services.filter((s) => s.category === key);
          return (
            <div key={key}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-11 w-11 rounded-xl bg-gradient-hero text-white flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                <h2 className="text-2xl font-extrabold">{label}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((s) => (
                  <div key={s.slug} className="group bg-gradient-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth">
                    <h3 className="font-extrabold text-lg">{s.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-7">{s.desc}</p>
                    <Link
                      to="/request"
                      search={{ service: s.slug } as never}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary"
                    >
                      اطلب الخدمة <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-smooth" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
