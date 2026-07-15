import { useMemo, useState, type ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight, Trash2, Eye, EyeOff, X } from "lucide-react";

export type SortDir = "asc" | "desc";
export type SortKey<T> = keyof T & string;

export type ToolkitState<T> = {
  query: string;
  setQuery: (q: string) => void;
  sortKey: SortKey<T> | null;
  setSortKey: (k: SortKey<T> | null) => void;
  sortDir: SortDir;
  setSortDir: (d: SortDir) => void;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  filter: string;
  setFilter: (v: string) => void;
  selected: Set<string>;
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  selectAllOnPage: (ids: string[]) => void;
  filtered: T[];
  paged: T[];
  totalPages: number;
  total: number;
};

export function useListToolkit<T extends { id?: string }>(
  items: T[],
  opts: {
    searchIn?: (item: T) => string;
    initialSort?: SortKey<T>;
    initialDir?: SortDir;
    initialPageSize?: number;
    filterFn?: (item: T, filter: string) => boolean;
  } = {},
): ToolkitState<T> {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey<T> | null>(opts.initialSort ?? null);
  const [sortDir, setSortDir] = useState<SortDir>(opts.initialDir ?? "asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(opts.initialPageSize ?? 20);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let out = items;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((it) => {
        if (opts.searchIn) return opts.searchIn(it).toLowerCase().includes(q);
        return JSON.stringify(it).toLowerCase().includes(q);
      });
    }
    if (filter !== "all" && opts.filterFn) {
      out = out.filter((it) => opts.filterFn!(it, filter));
    }
    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      out = [...out].sort((a, b) => {
        const av = a[sortKey] as unknown;
        const bv = b[sortKey] as unknown;
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av).localeCompare(String(bv), "ar") * dir;
      });
    }
    return out;
  }, [items, query, filter, sortKey, sortDir, opts.searchIn, opts.filterFn]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  return {
    query, setQuery,
    sortKey, setSortKey,
    sortDir, setSortDir,
    page: safePage, setPage,
    pageSize, setPageSize,
    filter, setFilter,
    selected,
    toggleSelected: (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }),
    clearSelected: () => setSelected(new Set()),
    selectAllOnPage: (ids) => setSelected((prev) => {
      const n = new Set(prev);
      const allIn = ids.every((i) => n.has(i));
      if (allIn) ids.forEach((i) => n.delete(i));
      else ids.forEach((i) => n.add(i));
      return n;
    }),
    filtered, paged, totalPages, total,
  };
}

export function ListToolbar<T extends { id?: string }>({
  state, sortOptions, filterOptions, searchPlaceholder = "بحث...", right, onBulkDelete, onBulkShow, onBulkHide,
}: {
  state: ToolkitState<T>;
  sortOptions?: Array<{ key: SortKey<T>; label: string }>;
  filterOptions?: Array<{ value: string; label: string }>;
  searchPlaceholder?: string;
  right?: ReactNode;
  onBulkDelete?: (ids: string[]) => Promise<void> | void;
  onBulkShow?: (ids: string[]) => Promise<void> | void;
  onBulkHide?: (ids: string[]) => Promise<void> | void;
}) {
  const ids = Array.from(state.selected);
  const hasSel = ids.length > 0;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full rounded-md border pr-8 pl-3 py-2 text-sm bg-background"
            placeholder={searchPlaceholder}
            value={state.query}
            onChange={(e) => { state.setQuery(e.target.value); state.setPage(1); }}
          />
        </div>
        {filterOptions && (
          <select className="rounded-md border px-2 py-2 text-sm bg-background" value={state.filter} onChange={(e) => { state.setFilter(e.target.value); state.setPage(1); }}>
            <option value="all">الكل</option>
            {filterOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
        {sortOptions && (
          <>
            <select className="rounded-md border px-2 py-2 text-sm bg-background" value={state.sortKey ?? ""} onChange={(e) => state.setSortKey((e.target.value || null) as SortKey<T> | null)}>
              <option value="">ترتيب افتراضي</option>
              {sortOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
            <button className="rounded-md border px-2 py-2 text-sm" onClick={() => state.setSortDir(state.sortDir === "asc" ? "desc" : "asc")}>
              {state.sortDir === "asc" ? "▲" : "▼"}
            </button>
          </>
        )}
        <select className="rounded-md border px-2 py-2 text-sm bg-background" value={state.pageSize} onChange={(e) => { state.setPageSize(Number(e.target.value)); state.setPage(1); }}>
          {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}/صفحة</option>)}
        </select>
        <span className="text-xs text-muted-foreground">{state.total} سجل</span>
        {right}
      </div>
      {hasSel && (
        <div className="flex flex-wrap items-center gap-2 bg-muted/40 border rounded-md px-3 py-2 text-xs">
          <span className="font-bold">{ids.length} محدد</span>
          {onBulkShow && <button className="inline-flex items-center gap-1 rounded border px-2 py-1 hover:bg-background" onClick={() => onBulkShow(ids)}><Eye className="h-3 w-3" /> إظهار</button>}
          {onBulkHide && <button className="inline-flex items-center gap-1 rounded border px-2 py-1 hover:bg-background" onClick={() => onBulkHide(ids)}><EyeOff className="h-3 w-3" /> إخفاء</button>}
          {onBulkDelete && <button className="inline-flex items-center gap-1 rounded border px-2 py-1 text-destructive hover:bg-destructive/10" onClick={async () => { if (confirm(`حذف ${ids.length} عنصر؟`)) await onBulkDelete(ids); }}><Trash2 className="h-3 w-3" /> حذف</button>}
          <button className="ml-auto text-muted-foreground hover:text-foreground" onClick={state.clearSelected}><X className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

export function Pagination<T>({ state }: { state: ToolkitState<T> }) {
  if (state.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button className="rounded border px-2 py-1 text-sm disabled:opacity-40" disabled={state.page <= 1} onClick={() => state.setPage(state.page - 1)}>
        <ChevronRight className="h-4 w-4" />
      </button>
      <span className="text-xs">صفحة {state.page} من {state.totalPages}</span>
      <button className="rounded border px-2 py-1 text-sm disabled:opacity-40" disabled={state.page >= state.totalPages} onClick={() => state.setPage(state.page + 1)}>
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}

export function RowSelect({ id, state }: { id?: string; state: ToolkitState<{ id?: string }> }) {
  if (!id) return null;
  return (
    <input type="checkbox" checked={state.selected.has(id)} onChange={() => state.toggleSelected(id)} className="h-4 w-4" />
  );
}
