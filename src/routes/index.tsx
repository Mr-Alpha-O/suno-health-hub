import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Stethoscope, Ambulance, ShieldCheck, Clock, MapPin, HeartPulse, Microscope, Package, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero-care.jpg";
import ambulanceImg from "@/assets/ambulance.jpg";
import equipmentImg from "@/assets/equipment.jpg";
import { serviceCategories, whyUs, site, waLink, type ServiceCategory } from "@/lib/site";
import { SectionHeading } from "@/components/SectionHeading";

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
  component: Index,
});

const iconMap = {
  nursing: HeartPulse,
  doctor: Stethoscope,
  lab: Microscope,
  ambulance: Ambulance,
  equipment: Package,
} as const;

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-accent/20 blur-3xl" />
        <div className="container mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-white/70 backdrop-blur px-3 py-1.5 rounded-full mb-5 shadow-soft">
              <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse" />
              متاحون الآن على مدار 24 ساعة
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight text-balance">
              سونو للخدمات الطبية <span className="text-primary">المتكاملة</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-9 max-w-xl">
              نقدم خدمات الرعاية الصحية المنزلية والطبية بأعلى معايير الجودة والاحترافية على مدار الساعة بفريق طبي مؤهل وأحدث المعدات.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/request" className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-6 py-3.5 rounded-xl font-bold shadow-elegant hover:shadow-glow transition-smooth">
                اطلب خدمة الآن <ArrowLeft className="h-4 w-4" />
              </Link>
              <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-white text-primary border border-primary/20 px-6 py-3.5 rounded-xl font-bold shadow-soft hover:bg-secondary transition-smooth">
                <MessageCircle className="h-4 w-4" /> تواصل عبر واتساب
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: "24/7", l: "متاحون دائماً" },
                { v: "+50", l: "خدمة طبية" },
                { v: "+100", l: "كادر متخصص" },
              ].map((s) => (
                <div key={s.l} className="text-center bg-white/70 backdrop-blur rounded-xl py-3 shadow-soft">
                  <div className="text-2xl font-extrabold text-primary">{s.v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
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

      {/* SERVICES */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="خدماتنا"
          title="رعاية طبية تصل إلى باب منزلك"
          desc="من التمريض المنزلي إلى الإسعاف والأجهزة الطبية — نوفر منظومة متكاملة بأيدي متخصصين."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            عرض جميع الخدمات بالتفصيل <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section className="relative overflow-hidden bg-gradient-soft py-20">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="لماذا سونو" title="ثقتك هي عنوان نجاحنا" desc="نلتزم بأعلى معايير الجودة لنقدم خدمة طبية تستحقها أنت وعائلتك." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((w, i) => {
              const Icons = [ShieldCheck, Clock, MapPin, HeartPulse, Sparkles, Stethoscope];
              const Icon = Icons[i % Icons.length];
              return (
                <div key={w.title} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-smooth border border-border/50 hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-extrabold text-lg">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-7">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AMBULANCE BANNER */}
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
              <a href={`tel:${site.phoneIntl}`} className="bg-white text-primary px-5 py-3 rounded-xl font-bold hover:bg-secondary transition-smooth">اتصل الآن {site.phone}</a>
              <a href={waLink("🚑 أحتاج خدمة إسعاف عاجل")} target="_blank" rel="noopener" className="border border-white/40 text-white px-5 py-3 rounded-xl font-bold hover:bg-white/10 transition-smooth">طلب إسعاف</a>
            </div>
          </div>
          <div className="relative min-h-[300px]">
            <img src={ambulanceImg} alt="سيارة إسعاف" width={1200} height={800} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* STORE TEASER */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading center={false} eyebrow="المتجر الطبي" title="بيع وتأجير أجهزة طبية موثوقة" desc="من مولدات الأكسجين والأسرة الكهربائية إلى كراسي المتحركة وأجهزة المراقبة — بأسعار شراء وإيجار شفافة." />
            <Link to="/store" className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-soft hover:shadow-elegant transition-smooth">
              تصفح المتجر <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-elegant border-4 border-white">
            <img src={equipmentImg} alt="أجهزة طبية" width={1200} height={800} loading="lazy" className="w-full h-[400px] object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
