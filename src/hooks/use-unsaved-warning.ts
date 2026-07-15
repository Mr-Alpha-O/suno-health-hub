import { useEffect } from "react";

/**
 * Warn user before leaving the page if there are unsaved changes.
 */
export function useUnsavedWarning(dirty: boolean, message = "لديك تغييرات غير محفوظة. هل تريد المغادرة؟") {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, message]);
}
