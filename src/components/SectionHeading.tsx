export function SectionHeading({ eyebrow, title, desc, center = true }: { eyebrow?: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto mb-12" : "max-w-2xl mb-10"}>
      {eyebrow && <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full mb-4">{eyebrow}</div>}
      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance">{title}</h2>
      {desc && <p className="mt-4 text-muted-foreground leading-8">{desc}</p>}
    </div>
  );
}
