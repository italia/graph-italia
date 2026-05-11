import { useEffect, type RefObject } from "react";

/**
 * Ensures the "Rows per page" <select> inside react-data-table-component is
 * openable from the keyboard.
 *
 * Native <select> elements open on Space or Alt+Down; behaviour for Enter
 * varies across browsers. This hook intercepts Enter while the pagination
 * select is focused and opens the picker programmatically, so keyboard users
 * get a consistent experience.
 */
export function usePaginationSelectKeyboard(
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      // Only handle the pagination select
      if (!target.closest(".rdt_Pagination")) return;
      if (event.key !== "Enter") return;
      event.preventDefault();
      // Prefer showPicker() where available (Chromium/Safari recent);
      // otherwise fall back to dispatching a mousedown which causes most
      // browsers to open the native dropdown.
      const selectWithPicker = target as HTMLSelectElement & {
        showPicker?: () => void;
      };
      if (typeof selectWithPicker.showPicker === "function") {
        try {
          selectWithPicker.showPicker();
          return;
        } catch {
          // ignore — fall through to the mousedown fallback
        }
      }
      target.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
      );
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef]);
}
