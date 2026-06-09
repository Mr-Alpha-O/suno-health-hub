const logoAsset = { url: "/swnw-logo.png" };
import oxygen from "@/assets/p-oxygen.jpg";
import bed from "@/assets/p-bed.jpg";
import wheelchair from "@/assets/p-wheelchair.jpg";
import monitor from "@/assets/p-monitor.jpg";
import suction from "@/assets/p-suction.jpg";
import nebulizer from "@/assets/p-nebulizer.jpg";
import cpap from "@/assets/p-cpap.jpg";
import mattress from "@/assets/p-mattress.jpg";

export const site = {
  nameAr: "شركة سونو للخدمات الطبية",
  nameEn: "SWNW Medical Care",
  tagline: "خدمات طبية متكاملة على مدار الساعة",
  phone: "01222212683",
  phoneIntl: "+201222212683",
  whatsapp: "201222212683",
  email: "swnwmedicalcare@gmail.com",
  logo: logoAsset.url,
};

export const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/services", label: "خدماتنا" },
  { to: "/store", label: "المتجر الطبي" },
  { to: "/request", label: "اطلب خدمة" },
  { to: "/careers", label: "الوظائف" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export type Service = {
  slug: string;
  name: string;
  desc: string;
  category: "home" | "specialty" | "diagnostic" | "transport" | "equipment";
};

export type SubService = { name: string; featured?: boolean };
export type ServiceCategory = {
  slug: string;
  name: string;
  desc: string;
  icon: "nursing" | "doctor" | "lab" | "ambulance" | "equipment";
  subs: SubService[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "nursing",
    name: "الرعاية التمريضية المنزلية",
    desc: "فريق تمريض مؤهل لرعاية احترافية ومتواصلة في منزلك على مدار الساعة.",
    icon: "nursing",
    subs: [
      { name: "إعطاء الأدوية ومتابعة العلاج" },
      { name: "تركيب محاليل" },
      { name: "تركيب قسطرة" },
      { name: "تغيير على الجروح" },
      { name: "الحقن المنزلية" },
      { name: "متابعة ما بعد العمليات" },
      { name: "متابعة ورعاية كبار السن" },
      { name: "العلاج الطبيعي المنزلي" },
      { name: "أخرى" },
    ],
  },
  {
    slug: "home-visit",
    name: "الكشف الطبي المنزلي",
    desc: "نخبة من الاستشاريين والأطباء لزيارات منزلية في مختلف التخصصات.",
    icon: "doctor",
    subs: [
      { name: "باطنة" },
      { name: "أطفال" },
      { name: "قلب" },
      { name: "استشارات جراحية" },
      { name: "نساء وتوليد" },
      { name: "عظام" },
      { name: "أخرى" },
    ],
  },
  {
    slug: "diagnostic",
    name: "التحاليل والأشعة",
    desc: "خدمات تشخيصية متنقلة بأحدث الأجهزة ودقة عالية في النتائج.",
    icon: "lab",
    subs: [
      { name: "تحاليل منزلية" },
      { name: "اشعة منزلية" },
      { name: "سونار منزلي" },
      { name: "رسم قلب" },
      { name: "إيكو" },
      { name: "X-Ray" },
      { name: "أخرى" },
    ],
  },
  {
    slug: "ambulance",
    name: "الإسعاف والنقل الطبي",
    desc: "أسطول إسعاف مجهز وفريق طوارئ مدرب لاستجابة فورية وآمنة.",
    icon: "ambulance",
    subs: [
      { name: "سيارات إسعاف" },
      { name: "نقل المرضى بطبيب" },
      { name: "نقل المرضى بدون طبيب" },
      { name: "النقل بين المستشفيات" },
      { name: "تأمين وتغطية الفعاليات الطبية", featured: true },
      { name: "أخرى" },
    ],
  },
  {
    slug: "equipment",
    name: "الأجهزة الطبية",
    desc: "بيع وتأجير أجهزة طبية موثوقة بأسعار شفافة وضمان معتمد.",
    icon: "equipment",
    subs: [
      { name: "بيع أجهزة طبية" },
      { name: "إيجار أجهزة طبية" },
      { name: "أخرى" },
    ],
  },
];

export const OTHER_CATEGORY = { slug: "other", name: "أخرى — خدمة غير موجودة بالقائمة" };

// Legacy flat list (kept for backwards compatibility with deep links).
export const services: Service[] = [
  { slug: "nursing", name: "الرعاية التمريضية المنزلية", desc: "رعاية تمريضية احترافية على مدار الساعة في منزلك بأيدي فريق مؤهل.", category: "home" },
  { slug: "home-visit", name: "الكشف الطبي المنزلي", desc: "كشف طبي شامل في راحة منزلك من نخبة الأطباء.", category: "specialty" },
  { slug: "diagnostic", name: "التحاليل والأشعة", desc: "خدمات تشخيصية متنقلة بأحدث الأجهزة.", category: "diagnostic" },
  { slug: "ambulance", name: "الإسعاف والنقل الطبي", desc: "أسطول إسعاف مجهز وفريق طوارئ مدرب.", category: "transport" },
  { slug: "equipment", name: "الأجهزة الطبية", desc: "بيع وتأجير أحدث الأجهزة الطبية المنزلية بضمان.", category: "equipment" },
];

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  buy: number;
  rent: number;
  short: string;
  details: string[];
};

export const products: Product[] = [
  { slug: "oxygen", name: "جهاز توليد الأكسجين", category: "أجهزة أكسجين", image: oxygen, buy: 28500, rent: 1500, short: "5 لتر/دقيقة، تشغيل صامت ومتواصل.", details: ["تدفق حتى 5 لتر/دقيقة", "شاشة LCD رقمية", "تنبيهات ذكية للأعطال", "ضمان سنة كاملة"] },
  { slug: "bed", name: "سرير مستشفى كهربائي", category: "أسرّة طبية", image: bed, buy: 18900, rent: 950, short: "تحكم كهربائي بثلاث حركات، يأتي بمرتبة.", details: ["3 موتورات كهربائية", "حواجز جانبية للحماية", "عجلات بفرامل", "مرتبة طبية مرفقة"] },
  { slug: "wheelchair", name: "كرسي متحرك قابل للطي", category: "كراسي متحركة", image: wheelchair, buy: 3200, rent: 250, short: "هيكل خفيف، عجلات كبيرة، مريح للاستخدام اليومي.", details: ["إطار من الألومنيوم", "وزن خفيف 12 كجم", "قابل للطي بسهولة", "وسادة مريحة"] },
  { slug: "monitor", name: "جهاز مراقبة العلامات الحيوية", category: "مراقبة المرضى", image: monitor, buy: 22500, rent: 1100, short: "مراقبة ECG، ضغط، أكسجين، نبض، حرارة.", details: ["شاشة ملونة كبيرة", "5 مؤشرات حيوية", "تنبيهات قابلة للتخصيص", "بطارية احتياطية"] },
  { slug: "suction", name: "جهاز شفط طبي", category: "أجهزة شفط", image: suction, buy: 4500, rent: 350, short: "شفط قوي وآمن مع وعاء معقم.", details: ["قدرة شفط عالية", "وعاء قابل للتعقيم", "هادئ التشغيل", "محمول وخفيف"] },
  { slug: "nebulizer", name: "جهاز استنشاق (نيبولايزر)", category: "أجهزة استنشاق", image: nebulizer, buy: 1450, rent: 120, short: "للأطفال والكبار، تشغيل هادئ وفعّال.", details: ["مناسب لكل الأعمار", "كمامتين كبير وصغير", "تشغيل صامت", "سهل التنظيف"] },
  { slug: "cpap", name: "جهاز ضغط هواء (CPAP)", category: "أجهزة CPAP", image: cpap, buy: 16800, rent: 850, short: "علاج توقف التنفس أثناء النوم بكفاءة.", details: ["شاشة لمس", "ترطيب مدمج", "اتصال WiFi", "تقارير نوم تفصيلية"] },
  { slug: "mattress", name: "مرتبة هوائية ضد التقرحات", category: "مراتب طبية", image: mattress, buy: 2700, rent: 200, short: "تمنع قرح الفراش لكبار السن والمرضى.", details: ["مضخة هواء صامتة", "نظام تبديل ضغط", "قابلة للغسيل", "تتحمل حتى 130 كجم"] },
];

export const productCategories = [
  "أجهزة أكسجين",
  "أسرّة طبية",
  "كراسي متحركة",
  "مراقبة المرضى",
  "أجهزة شفط",
  "أجهزة استنشاق",
  "أجهزة CPAP",
  "مراتب طبية",
];

export const whyUs = [
  { title: "فريق طبي مؤهل", desc: "نخبة من الأطباء والممرضين بخبرات معتمدة." },
  { title: "خدمة سريعة", desc: "استجابة فورية خلال دقائق من تأكيد الطلب." },
  { title: "تغطية واسعة", desc: "نخدم القاهرة والجيزة وامتدادات المحافظات المجاورة." },
  { title: "أسعار مناسبة", desc: "باقات شفافة بدون رسوم خفية تناسب جميع الفئات." },
  { title: "متابعة مستمرة", desc: "متابعة دقيقة بعد الزيارة لضمان أفضل النتائج." },
  { title: "خدمة 24 ساعة", desc: "متواجدون لخدمتك ليلاً ونهاراً طوال أيام الأسبوع." },
];

export const jobs = [
  { title: "أطباء", desc: "تخصصات متنوعة بدوام كامل أو جزئي." },
  { title: "تمريض", desc: "ممرضين/ممرضات بخبرة في الرعاية المنزلية." },
  { title: "فني أشعة", desc: "بخبرة في الأجهزة المتنقلة." },
  { title: "فني تحاليل", desc: "خبرة في سحب العينات والمعامل." },
  { title: "مسعفين", desc: "بخبرة في الإسعاف ونقل المرضى." },
  { title: "خدمة عملاء", desc: "للعمل بنظام شيفتات على مدار الساعة." },
];

export const waLink = (msg = "مرحباً، أرغب في الاستفسار عن خدماتكم.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
