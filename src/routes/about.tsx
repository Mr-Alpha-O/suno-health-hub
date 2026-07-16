import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, Target, Eye, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";
import { aboutQO, teamQO } from "@/lib/public-queries";
import { heroImageFallback } from "@/lib/media";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | سونو للخدمات الطبية" },
      { name: "description", content: "تعرّف على شركة سونو للخدمات الطبية المتكاملة، رؤيتنا ورسالتنا في تقديم رعاية صحية منزلية احترافية." },
      { property: "og:title", content: "من نحن | سونو للخدمات الطبية" },
      { property: "og:description", content: "رؤيتنا ورسالتنا في تقديم رعاية صحية منزلية احترافية." },
    ],
    links: [{ rel: "canonical", href: "https://www.swnwmedicalcare.com/about" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(aboutQO),
      context.queryClient.ensureQueryData(teamQO),
    ]);
  },
  component: AboutPage,
  errorComponent: ({ error }) => <div className="container mx-auto p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="container mx-auto p-8 text-center">لم يتم العثور على المحتوى.</div>,
});

function AboutPage() {
  const { data: about } = useSuspenseQuery(aboutQO);
  const { data: team } = useSuspenseQuery(teamQO);
  const img = (about?.image_url && about.image_url.trim()) || heroImageFallback;
  const values = Array.isArray(about?.values) ? (about!.values as Array<{ title: string; desc: string }>) : [];

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
          <img src={img} alt="فريق سونو الطبي" width={1600} height={1100} loading="lazy" className="w-full h-[420px] object-cover" />
        </div>
        <div>
          <SectionHeading center={false} eyebrow="عن الشركة" title="رعاية متميزة في منزلك" desc="" />
          <p className="text-muted-foreground leading-9">
            {about?.intro ?? about?.story}
          </p>
          {values.length > 0 && (
            <ul className="mt-6 space-y-3">
              {values.map((v) => (
                <li key={v.title} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> <span className="font-bold">{v.title}:</span> <span className="text-muted-foreground">{v.desc}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: "رسالتنا", desc: about?.mission ?? "" },
          { icon: Eye, title: "رؤيتنا", desc: about?.vision ?? "" },
          { icon: Sparkles, title: "قيمنا", desc: values.map((v) => v.title).join("، ") },
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

      {team.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <SectionHeading eyebrow="فريقنا" title="خبراء يقودون رعايتك" desc="نخبة من الأطباء والممرضين والخبراء بخدمتك." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl p-6 border border-border shadow-soft hover:shadow-elegant transition-smooth text-center">
                {m.photo_url && <img src={m.photo_url} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover mb-4" />}
                <h4 className="font-extrabold">{m.name}</h4>
                <p className="text-xs text-primary font-bold mt-1">{m.role}</p>
                {m.bio && <p className="mt-2 text-xs text-muted-foreground leading-6">{m.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
