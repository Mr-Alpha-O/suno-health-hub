import React from "react";

export type BadgeColor = "green" | "blue" | "orange" | "purple" | "red" | "gray" | "gold";

const styles: Record<BadgeColor, { chip: string; dot: string }> = {
  green:  { chip: "bg-emerald-100 text-emerald-800 ring-emerald-200", dot: "bg-emerald-500" },
  blue:   { chip: "bg-sky-100 text-sky-800 ring-sky-200",             dot: "bg-sky-500" },
  orange: { chip: "bg-amber-100 text-amber-800 ring-amber-200",       dot: "bg-amber-500" },
  purple: { chip: "bg-violet-100 text-violet-800 ring-violet-200",    dot: "bg-violet-500" },
  red:    { chip: "bg-rose-100 text-rose-800 ring-rose-200",          dot: "bg-rose-500" },
  gray:   { chip: "bg-slate-100 text-slate-700 ring-slate-200",       dot: "bg-slate-500" },
  gold:   { chip: "bg-yellow-100 text-yellow-800 ring-yellow-200",    dot: "bg-yellow-500" },
};

export function ProductBadge({ color, children, size = "md" }: { color: BadgeColor; children: React.ReactNode; size?: "sm" | "md" }) {
  const s = styles[color] ?? styles.gray;
  const pad = size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-sm";
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ring-1 ${s.chip} ${pad}`}>
      <span className={`rounded-full ${dotSize} ${s.dot}`} />
      {children}
    </span>
  );
}

export function ProductBadgeList({ badges, size = "md" }: { badges: Array<{ id: string; text: string; color_variant: string; is_visible?: boolean }>; size?: "sm" | "md" }) {
  const visible = (badges ?? []).filter((b) => b.is_visible !== false);
  if (visible.length === 0) return null;
  return (
    <div className={`flex flex-wrap ${size === "sm" ? "gap-1.5" : "gap-2"}`}>
      {visible.map((b) => (
        <ProductBadge key={b.id} color={(b.color_variant as BadgeColor) || "gray"} size={size}>
          {b.text}
        </ProductBadge>
      ))}
    </div>
  );
}
