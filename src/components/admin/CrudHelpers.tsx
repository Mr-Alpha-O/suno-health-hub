import { useEffect, useState } from "react";

export const inp = "w-full rounded-md border px-3 py-2 text-sm bg-background";
export const btn = "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold";
export const btnPrimary = `${btn} bg-primary text-primary-foreground`;
export const btnGhost = `${btn} border hover:bg-muted`;
export const btnDanger = `${btn} border text-destructive hover:bg-destructive/10`;

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold mb-1 text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function useEditable<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  useEffect(() => setState(initial), [initial]);
  return [state, setState] as const;
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">{text}</div>;
}
