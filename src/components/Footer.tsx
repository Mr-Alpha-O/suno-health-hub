import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { navQO, contactQO, contactCollectionsQO } from "@/lib/public-queries";
import { waLinkFor } from "@/lib/media";

export function Footer() {
  const { data: navItems } = useQuery(navQO);
  const { data: contact } = useQuery(contactQO);
  const { data: coll } = useQuery(contactCollectionsQO);
  const nav = (navItems ?? []).map((n) => ({ to: n.href, label: n.label }));

  const phones = coll?.phones ?? [];
  const whatsapps = coll?.whatsapps ?? [];
  const emails = coll?.emails ?? [];
  const branches = coll?.branches ?? [];

  const primaryPhone = phones.find((p) => p.is_primary) ?? phones[0];
  const primaryWa = whatsapps.find((p) => p.is_primary) ?? whatsapps[0];
  const primaryEmail = emails.find((p) => p.is_primary) ?? emails[0];
  const primaryBranch = branches.find((p) => p.is_primary) ?? branches[0];

  const phoneDisplay = primaryPhone?.value ?? contact?.phone ?? site.phone;
  const phoneTel = primaryPhone?.value_intl ?? primaryPhone?.value ?? contact?.phone_intl ?? site.phoneIntl;
  const waNumber = primaryWa?.value ?? contact?.whatsapp ?? site.whatsapp;
  const emailValue = primaryEmail?.value ?? contact?.email ?? site.email;
  const addressValue = primaryBranch?.address ?? contact?.address ?? "القاهرة الكبرى وامتداداتها";

  const extraPhones = phones.filter((p) => p.id !== primaryPhone?.id);
  const extraWa = whatsapps.filter((p) => p.id !== primaryWa?.id);
  const extraEmails = emails.filter((p) => p.id !== primaryEmail?.id);
  const extraBranches = branches.filter((p) => p.id !== primaryBranch?.id);

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
            <li><a href={`tel:${phoneTel}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth" dir="ltr"><Phone className="h-4 w-4" />{phoneDisplay}</a></li>
            {extraPhones.map((p) => (
              <li key={p.id}><a href={`tel:${p.value_intl ?? p.value}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth" dir="ltr"><Phone className="h-4 w-4 opacity-60" />{p.value}{p.label ? <span className="text-xs opacity-70">({p.label})</span> : null}</a></li>
            ))}
            <li><a href={waLinkFor(waNumber)} target="_blank" rel="noopener" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth" dir="ltr"><MessageCircle className="h-4 w-4" />WhatsApp</a></li>
            {extraWa.map((w) => (
              <li key={w.id}><a href={waLinkFor(w.value)} target="_blank" rel="noopener" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth" dir="ltr"><MessageCircle className="h-4 w-4 opacity-60" />WhatsApp{w.label ? <span className="text-xs opacity-70">({w.label})</span> : null}</a></li>
            ))}
            <li><a href={`mailto:${emailValue}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth break-all" dir="ltr"><Mail className="h-4 w-4" />{emailValue}</a></li>
            {extraEmails.map((e) => (
              <li key={e.id}><a href={`mailto:${e.value}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth break-all" dir="ltr"><Mail className="h-4 w-4 opacity-60" />{e.value}</a></li>
            ))}
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {addressValue}</li>
            {extraBranches.map((b) => (
              <li key={b.id} className="flex items-center gap-2 text-muted-foreground text-xs"><MapPin className="h-4 w-4 opacity-60" /> {b.name ? `${b.name}: ` : ""}{b.address}</li>
            ))}
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
