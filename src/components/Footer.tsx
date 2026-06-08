import { Link } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { nav, site, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-b from-background to-secondary/40 border-t border-border">
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src={site.logo} alt={site.nameEn} width={56} height={56} className="h-14 w-14 rounded-full" />
            <div>
              <div className="font-extrabold text-primary text-lg">{site.nameAr}</div>
              <div className="text-xs text-muted-foreground">{site.nameEn}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-7 max-w-md">
            شركة سونو للخدمات الطبية المتكاملة — رعاية صحية منزلية وخدمات طبية مساندة بأعلى معايير الجودة على مدار الساعة.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 text-foreground">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted-foreground hover:text-primary transition-smooth">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 text-foreground">تواصل معنا</h4>
          <ul className="space-y-3 text-sm">
            <li><a href={`tel:${site.phoneIntl}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth" dir="ltr"><Phone className="h-4 w-4" />{site.phone}</a></li>
            <li><a href={waLink()} target="_blank" rel="noopener" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth" dir="ltr"><MessageCircle className="h-4 w-4" />WhatsApp</a></li>
            <li><a href={`mailto:${site.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth break-all" dir="ltr"><Mail className="h-4 w-4" />{site.email}</a></li>
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> القاهرة الكبرى وامتداداتها</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.nameAr}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
