import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useUnsavedWarning } from "@/hooks/use-unsaved-warning";
import { Save, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { btnPrimary, btnDanger, btnGhost } from "@/components/admin/CrudHelpers";

/**
 * Hook that manages a single editable row: local state + dirty tracking + unsaved warning.
 */
export function useEditableRow<T>(initial: T): [T, Dispatch<SetStateAction<T>>, boolean, () => void] {
  const [state, setState] = useState<T>(initial);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { setState(initial); setDirty(false); }, [initial]);
  useUnsavedWarning(dirty);
  const set: Dispatch<SetStateAction<T>> = (u) => {
    setDirty(true);
    setState(u);
  };
  return [state, set, dirty, () => setDirty(false)];
}

/**
 * Compact action bar for a row: save / duplicate / toggle-visibility / delete
 */
export function RowActions<T extends { id?: string; is_visible?: boolean }>({
  row, dirty, onSave, onDelete, onDuplicate, onToggleVisible,
}: {
  row: T;
  dirty: boolean;
  onSave: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  onDuplicate?: () => void | Promise<void>;
  onToggleVisible?: () => void | Promise<void>;
}) {
  const [busy, setBusy] = useState<null | "save" | "del" | "dup" | "vis">(null);
  async function run(kind: "save" | "del" | "dup" | "vis", fn: () => void | Promise<void>) {
    try { setBusy(kind); await fn(); } finally { setBusy(null); }
  }
  return (
    <div className="flex flex-wrap gap-2">
      <button disabled={busy !== null} className={btnPrimary} onClick={() => run("save", onSave)}>
        <Save className="h-3 w-3" /> {busy === "save" ? "جارٍ الحفظ..." : dirty ? "حفظ *" : "حفظ"}
      </button>
      {onToggleVisible && (
        <button disabled={busy !== null} className={btnGhost} onClick={() => run("vis", onToggleVisible)}>
          {row.is_visible ? <><EyeOff className="h-3 w-3" /> إخفاء</> : <><Eye className="h-3 w-3" /> إظهار</>}
        </button>
      )}
      {onDuplicate && row.id && (
        <button disabled={busy !== null} className={btnGhost} onClick={() => run("dup", onDuplicate)}>
          <Copy className="h-3 w-3" /> نسخ
        </button>
      )}
      <button disabled={busy !== null} className={btnDanger} onClick={() => { if (confirm("تأكيد الحذف؟")) run("del", onDelete); }}>
        <Trash2 className="h-3 w-3" /> حذف
      </button>
    </div>
  );
}
