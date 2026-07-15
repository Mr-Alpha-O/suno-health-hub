import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle, Stethoscope, Ambulance, ShieldCheck, Clock, MapPin, HeartPulse, Microscope, Package, Sparkles, ChevronDown, Phone, MessageSquareQuote, HelpCircle, BarChart3 } from "lucide-react";
import { Fragment, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";
import {
  heroQO, whyUsQO, serviceCategoriesQO, contactQO,
  doctorsQO, testimonialsQO, faqsQO, siteStatsQO, sectionsQO,
} from "@/lib/public-queries";
import { heroImageFallback, ambulanceImage, equipmentImage, waLinkFor } from "@/lib/media";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سونو للخدمات الطبية | رعاية صحية منزلية متكاملة 24 ساعة" },
      { name: "description", content: "احجز رعاية تمريضية منزلية، أطباء زيارات، تحاليل وأشعة، إسعاف وتأجير أجهزة طبية مع شركة سونو للخدمات الطبية." },
      { property: "og:title", content: "سونو للخدمات الطبية | خدمات طبية متكاملة" },
      { property: "og:description", content: "خدمات طبية احترافية في منزلك على مدار 24 ساعة." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(heroQO),
      context.queryClient.ensureQueryData(whyUsQO),
      context.queryClient.ensureQueryData(serviceCategoriesQO),
      context.queryClient.ensureQueryData(contactQO),
      context.queryClient.ensureQueryData(sectionsQO),
      context.queryClient.ensureQueryData(doctorsQO),
      context.queryClient.ensureQueryData(testimonialsQO),
      context.queryClient.ensureQueryData(faqsQO),
      context.queryClient.ensureQueryData(siteStatsQO),
    ]);
  },
  component: Index,
  errorComponent: ({ error }) => <div className="container mx-auto p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="container mx-auto p-8 text-center">لم يتم العثور على المحتوى.</div>,
});

const iconMap = {
  nursing: HeartPulse,
  doctor: Stethoscope,
  lab: Microscope,
  ambulance: Ambulance,
  equipment: Package,
} as const;
type IconKey = keyof typeof iconMap;
function iconFor(key: string | null | undefined): IconKey {
  return (key && key in iconMap ? key : "nursing") as IconKey;
}

function Index() {
  const { data: hero } = useSuspenseQuery(heroQO);
  const { data: whyUs } = useSuspenseQuery(whyUsQO);
  const { data: categories } = useSuspenseQuery(serviceCategoriesQO);
  const { data: contact } = useSuspenseQuery(contactQO);
  const { data: sections } = useSuspenseQuery(sectionsQO);
  const { data: doctors } = useSuspenseQuery(doctorsQO);
  const { data: testimonials } = useSuspenseQuery(testimonialsQO);
  const { data: faqs } = useSuspenseQuery(faqsQO);
  const { data: stats } = useSuspenseQuery(siteStatsQO);

  const phone = contact?.phone ?? site.phone;
  const phoneIntl = contact?.phone_intl ?? site.phoneIntl;
  const whatsapp = contact?.whatsapp ?? site.whatsapp;
  const heroImg = (hero?.image_url && hero.image_url.trim()) || heroImageFallback;
  const heroStats = Array.isArray(hero?.stats) ? (hero!.stats as Array<{ value: string; label: string }>) : [];

  // Renderers keyed by section key. Original markup preserved exactly.
  const renderers: Record<string, () => React.ReactNode> = {
    hero: () => (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-accent/20 blur-3xl" />
        <div className="container mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="animate-fade-up">
            {hero?.badge && (
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-white/70 backdrop-blur px-3 py-1.5 rounded-full mb-5 shadow-soft">
                <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse" />
                {hero.badge}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight text-balance">
              {hero?.headline ?? site.nameAr} {hero?.headline_highlight && <span className="text-primary">{hero.headline_highlight}</span>}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-9 max-w-xl">
              {hero?.subheading}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={(hero?.cta_primary_href as string) || "/request"} className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-6 py-3.5 rounded-xl font-bold shadow-elegant hover:shadow-glow transition-smooth">
                {hero?.cta_primary_label ?? "اطلب خدمة الآن"} <ArrowLeft className="h-4 w-4" />
              </Link>
              <a href={waLinkFor(whatsapp)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-white text-primary border border-primary/20 px-6 py-3.5 rounded-xl font-bold shadow-soft hover:bg-secondary transition-smooth">
                <MessageCircle className="h-4 w-4" /> {hero?.cta_secondary_label ?? "تواصل عبر واتساب"}
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {heroStats.map((s) => (
                <div key={s.label} className="text-center bg-white/70 backdrop-blur rounded-xl py-3 shadow-soft">
                  <div className="text-2xl font-extrabold text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 rounded-[2rem] blur-2xl" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-elegant border-4 border-white">
              <img src={heroImg} alt="رعاية تمريضية منزلية" width={1600} height={1100} className="w-full h-[460px] md:h-[560px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-elegant p-4 flex items-center gap-3 animate-float">
              <div className="h-12 w-12 rounded-xl bg-gradient-hero flex items-center justify-center text-white">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-extrabold">رعاية مستمرة</div>
                <div className="text-xs text-muted-foreground">متابعة بعد الزيارة</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-elegant p-4 flex items-center gap-3 animate-float" style={{ animationDelay: "1s" }}>
              <img src={site.logo} alt="SWNW" width={48} height={48} className="h-12 w-12 rounded-full" />
              <div>
                <div className="text-sm font-extrabold text-primary">SWNW</div>
                <div className="text-xs text-muted-foreground">ثقة طبية معتمدة</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    services: () => (
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="خدماتنا"
          title="رعاية طبية تصل إلى باب منزلك"
          desc="من التمريض المنزلي إلى الإسعاف والأجهزة الطبية — نوفر منظومة متكاملة بأيدي متخصصين."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            عرض جميع الخدمات بالتفصيل <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    ),

    why_us: () => (
      <section className="relative overflow-hidden bg-gradient-soft py-20">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="لماذا سونو" title="ثقتك هي عنوان نجاحنا" desc="نلتزم بأعلى معايير الجودة لنقدم خدمة طبية تستحقها أنت وعائلتك." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((w, i) => {
              const Icons = [ShieldCheck, Clock, MapPin, HeartPulse, Sparkles, Stethoscope];
              const Icon = Icons[i % Icons.length];
              return (
                <div key={w.id} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-smooth border border-border/50 hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-extrabold text-lg">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-7">{w.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    ambulance: () => (
      <section className="container mx-auto px-4 py-20">
        <div className="relative rounded-3xl overflow-hidden shadow-elegant grid lg:grid-cols-2 bg-gradient-hero">
          <div className="p-10 md:p-14 text-primary-foreground flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold w-fit">
              <Ambulance className="h-4 w-4" /> خدمة الإسعاف
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-extrabold leading-tight">
              أسطول إسعاف مجهز جاهز للاستجابة الفورية
            </h2>
            <p className="mt-4 text-white/90 leading-8">
              نقل آمن للمرضى بين المستشفيات وتغطية طبية للفعاليات بفريق طوارئ مدرب وأحدث المعدات.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`tel:${phoneIntl}`} className="bg-white text-primary px-5 py-3 rounded-xl font-bold hover:bg-secondary transition-smooth">اتصل الآن {phone}</a>
              <a href={waLinkFor(whatsapp, "🚑 أحتاج خدمة إسعاف عاجل")} target="_blank" rel="noopener" className="border border-white/40 text-white px-5 py-3 rounded-xl font-bold hover:bg-white/10 transition-smooth">طلب إسعاف</a>
            </div>
          </div>
          <div className="relative min-h-[300px]">
            <img src={ambulanceImage} alt="سيارة إسعاف" width={1200} height={800} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>
    ),

    store: () => (
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading center={false} eyebrow="المتجر الطبي" title="بيع وتأجير أجهزة طبية موثوقة" desc="من مولدات الأكسجين والأسرة الكهربائية إلى كراسي المتحركة وأجهزة المراقبة — بأسعار شراء وإيجار شفافة." />
            <Link to="/store" className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-soft hover:shadow-elegant transition-smooth">
              تصفح المتجر <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-elegant border-4 border-white">
            <img src={equipmentImage} alt="أجهزة طبية" width={1200} height={800} loading="lazy" className="w-full h-[400px] object-cover" />
          </div>
        </div>
      </section>
    ),

    doctors: () => doctors.length === 0 ? null : (
      <section className="container mx-auto px-4 py-20">
        <SectionHeading eyebrow="فريقنا الطبي" title="أطباء بخبرة تثق بها" desc="نخبة من الأطباء لخدمتك في المنزل أو عبر الاستشارة." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl p-6 border border-border shadow-soft hover:shadow-elegant transition-smooth text-center">
              {d.photo_url ? (
                <img src={d.photo_url} alt={d.name} className="mx-auto h-24 w-24 rounded-full object-cover mb-4" loading="lazy" />
              ) : (
                <div className="mx-auto h-24 w-24 rounded-full bg-secondary text-primary flex items-center justify-center mb-4"><Stethoscope className="h-10 w-10" /></div>
              )}
              <h4 className="font-extrabold">{d.name}</h4>
              {d.specialty && <p className="text-xs text-primary font-bold mt-1">{d.specialty}</p>}
              {d.experience && <p className="mt-2 text-xs text-muted-foreground leading-6">{d.experience}</p>}
              {d.whatsapp && (
                <a href={waLinkFor(d.whatsapp, `أرغب في حجز استشارة مع د. ${d.name}`)} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                  <MessageCircle className="h-3 w-3" /> احجز استشارة
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    stats: () => stats.length === 0 ? null : (
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-6 text-center shadow-soft border border-border/60">
              <BarChart3 className="mx-auto h-6 w-6 text-primary mb-2" />
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    ),

    testimonials: () => testimonials.length === 0 ? null : (
      <section className="bg-gradient-soft py-20">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="آراء العملاء" title="ماذا قال عنّا مرضانا" desc="" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-soft border border-border/60">
                <MessageSquareQuote className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm text-foreground leading-7">"{t.quote}"</p>
                <div className="mt-4 text-sm font-extrabold">{t.author}</div>
                {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    faqs: () => faqs.length === 0 ? null : (
      <section className="container mx-auto px-4 py-20">
        <SectionHeading eyebrow="أسئلة شائعة" title="أجوبة سريعة عن أهم استفساراتك" desc="" />
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f) => (
            <details key={f.id} className="bg-white rounded-xl border border-border p-4 shadow-soft group">
              <summary className="cursor-pointer flex items-center justify-between gap-3 font-bold text-foreground">
                <span className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> {f.question}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-7">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
    ),

    contact: () => (
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl bg-white border border-border shadow-elegant p-8 md:p-12 grid md:grid-cols-3 gap-6 text-center">
          <a href={`tel:${phoneIntl}`} className="flex flex-col items-center gap-2 hover:text-primary transition-smooth">
            <Phone className="h-6 w-6 text-primary" />
            <div className="font-extrabold">{phone}</div>
            <div className="text-xs text-muted-foreground">اتصل بنا مباشرة</div>
          </a>
          <a href={waLinkFor(whatsapp)} target="_blank" rel="noopener" className="flex flex-col items-center gap-2 hover:text-primary transition-smooth">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div className="font-extrabold">واتساب</div>
            <div className="text-xs text-muted-foreground">{whatsapp}</div>
          </a>
          <Link to="/contact" className="flex flex-col items-center gap-2 hover:text-primary transition-smooth">
            <MapPin className="h-6 w-6 text-primary" />
            <div className="font-extrabold">صفحة التواصل</div>
            <div className="text-xs text-muted-foreground">العنوان وساعات العمل</div>
          </Link>
        </div>
      </section>
    ),
  };

  const defaultKeys = ["hero","services","why_us","ambulance","store","doctors","stats","testimonials","faqs","contact"];
  const configured = (sections ?? []).length > 0
    ? sections.filter((s) => s.is_visible).map((s) => s.key)
    : defaultKeys;

  return (
    <>
      {configured.map((key) => {
        const R = renderers[key];
        return R ? <Fragment key={key}>{R()}</Fragment> : null;
      })}
    </>
  );
}

type CategoryWithSubs = {
  slug: string | null;
  name: string;
  description: string | null;
  icon: string | null;
  subs: Array<{ id: string; name: string; featured: boolean | null }>;
};


function CategoryCard({ cat }: { cat: CategoryWithSubs }) {
  const [open, setOpen] = useState(false);
  const Icon = iconMap[iconFor(cat.icon)];
  return (
    <div className="group relative bg-gradient-card rounded-2xl p-6 border border-border hover:border-primary/40 shadow-soft hover:shadow-elegant transition-smooth overflow-hidden flex flex-col">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-smooth" />
      <div className="relative flex-1">
        <div className="h-14 w-14 rounded-2xl bg-gradient-hero flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-smooth">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-extrabold text-foreground">{cat.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-7">{cat.description}</p>
        <div
          className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2 border-t border-border/60 pt-4">
              {cat.subs.map((s) => (
                <li
                  key={s.id}
                  className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
                    s.featured
                      ? "bg-gradient-hero text-primary-foreground font-bold shadow-soft"
                      : "bg-white/60 text-foreground"
                  }`}
                >
                  {s.featured ? <Sparkles className="h-4 w-4 shrink-0" /> : <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  <span>{s.name}</span>
                  {s.featured && <span className="ms-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">مميز</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="relative mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
          aria-expanded={open}
        >
          {open ? "إخفاء التفاصيل" : "عرض التفاصيل"}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <Link
          to="/request"
          search={{ service: cat.slug } as never}
          className="ms-auto inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:shadow-elegant transition-smooth"
        >
          اطلب الآن <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
