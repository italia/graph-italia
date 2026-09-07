import { useEffect, type RefObject } from "react";

/**
 * Focus management for a disclosure-style mobile menu (#120):
 * - when it opens, focus moves to its first link so screen-reader and
 *   keyboard users land inside the navigation they just revealed instead of
 *   having to traverse the rest of the header first (WCAG 2.4.3);
 * - Escape closes it and returns focus to the button that opened it.
 */
export function useMobileMenuFocus(
  open: boolean,
  menuRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  close: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
      triggerRef.current?.focus();
    };
    const el = menuRef.current;
    el?.addEventListener("keydown", onKeyDown);
    return () => el?.removeEventListener("keydown", onKeyDown);
  }, [open, menuRef, triggerRef, close]);
}
