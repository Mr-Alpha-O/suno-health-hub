import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Target, Eye, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-care.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | سونو للخدمات الطبية" },
      { name: "description", content: "تعرّف على شركة سونو للخدمات الطبية المتكاملة، رؤيتنا ورسالتنا في تقديم رعاية صحية منزلية احترافية." },
      { property: "og:title", content: "من نحن | سونو للخدمات الطبية" },
      { property: "og:description", content: "رؤيتنا ورسالتنا في تقديم رعاية صحية منزلية احترافية." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">من نحن</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-8">قصة {site.nameAr} ورسالتنا في خدمة المرضى وذويهم.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-elegant border-4 border-white">
          <img src={heroImg} alt="فريق سونو الطبي" width={1600} height={1100} loading="lazy" className="w-full h-[420px] object-cover" />
        </div>
        <div>
          <SectionHeading center={false} eyebrow="عن الشركة" title="رعاية متميزة في منزلك" desc="" />
          <p className="text-muted-foreground leading-9">
            شركة سونو للخدمات الطبية المتكاملة هي شركة متخصصة في تقديم خدمات الرعاية الصحية المنزلية والخدمات الطبية المساندة بهدف توفير رعاية آمنة ومتميزة للمرضى داخل منازلهم أو أثناء التنقل من خلال فريق طبي مؤهل وأحدث الوسائل الطبية.
          </p>
          <ul className="mt-6 space-y-3">
            {["كادر طبي معتمد ومدرب", "أحدث الأجهزة والمعدات الطبية", "تغطية على مدار 24 ساعة", "خصوصية واحترام كامل للمريض"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: "رسالتنا", desc: "تقديم خدمات طبية منزلية بمعايير المستشفيات لتوفير راحة وأمان المريض وذويه." },
          { icon: Eye, title: "رؤيتنا", desc: "أن نكون الشركة الرائدة في الخدمات الطبية المنزلية والمساندة في مصر والمنطقة." },
          { icon: Sparkles, title: "قيمنا", desc: "الاحترافية، الأمانة، الالتزام، الجودة، والاحترام الإنساني الكامل." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-7 shadow-soft border border-border/60 hover:shadow-elegant transition-smooth">
            <div className="h-12 w-12 rounded-xl bg-gradient-hero flex items-center justify-center text-white">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-7">{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
