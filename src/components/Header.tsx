import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { nav, site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-smooth border-b",
      scrolled ? "glass border-border/60 shadow-soft" : "bg-background border-transparent"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={site.logo} alt={site.nameEn} width={56} height={56} className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover shadow-soft transition-smooth group-hover:scale-105" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm md:text-base font-extrabold text-primary">{site.nameAr}</span>
            <span className="text-[10px] md:text-xs text-muted-foreground tracking-wide">{site.nameEn}</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary bg-secondary" }}
              inactiveProps={{ className: "text-foreground/80 hover:text-primary hover:bg-secondary/60" }}
              className="px-3 py-2 rounded-lg text-sm font-semibold transition-smooth"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a href={`tel:${site.phoneIntl}`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-primary hover:bg-secondary transition-smooth" dir="ltr">
            <Phone className="h-4 w-4" /> {site.phone}
          </a>
          <a href={waLink()} target="_blank" rel="noopener" className="hidden xl:inline-flex bg-gradient-hero text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-soft hover:shadow-elegant transition-smooth">
            احجز الآن
          </a>
        </div>

        <button onClick={() => setOpen((v) => !v)} aria-label="القائمة" className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-smooth">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-up">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "bg-secondary text-primary" }}
                inactiveProps={{ className: "text-foreground/80" }}
                className="px-3 py-3 rounded-lg font-semibold"
              >
                {n.label}
              </Link>
            ))}
            <a href={`tel:${site.phoneIntl}`} className="mt-2 flex items-center justify-center gap-2 bg-gradient-hero text-primary-foreground py-3 rounded-lg font-bold">
              <Phone className="h-4 w-4" /> اتصل الآن {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
