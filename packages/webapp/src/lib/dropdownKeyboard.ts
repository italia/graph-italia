import type { KeyboardEvent } from "react";

/** Visible, focusable items inside the dropdown list. The list is the
    wrapper's direct <ul> child: a descendant query would also match the
    trigger, whose own ancestors include the surrounding nav list. */
function menuItems(wrapper: HTMLElement): HTMLElement[] {
  const list = wrapper.querySelector<HTMLElement>(":scope > ul");
  if (!list) return [];
  return [
    ...list.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
  ].filter((el) => el.offsetParent !== null);
}

/**
 * Keyboard support for the hand-rolled disclosure dropdowns (nav submenus,
 * user menu, project switcher), aligned with the language switcher
 * (WCAG 2.1.1):
 *  - ArrowDown/ArrowUp open the closed dropdown and cycle its items
 *  - Home/End jump to the first/last item
 *  - Escape closes and returns focus to the trigger
 *
 * Attach to the wrapper element containing both the trigger button
 * (identified by aria-expanded) and the list.
 */
export function handleDropdownKeyDown(
  event: KeyboardEvent<HTMLElement>,
  isOpen: boolean,
  setOpen: (open: boolean) => void,
) {
  const wrapper = event.currentTarget as HTMLElement;
  const trigger = wrapper.querySelector<HTMLElement>("button[aria-expanded]");

  const focusItem = (index: number, attempts = 0) => {
    const items = menuItems(wrapper);
    if (!items.length) {
      // The list may not be visible yet right after opening: React commits
      // the re-render asynchronously, so retry shortly after (setTimeout
      // rather than requestAnimationFrame, which can be throttled on
      // occluded tabs).
      if (attempts < 5) {
        setTimeout(() => focusItem(index, attempts + 1), 30);
      }
      return;
    }
    items[((index % items.length) + items.length) % items.length]?.focus();
  };

  switch (event.key) {
    case "Escape":
      if (isOpen) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        trigger?.focus();
      }
      break;
    case "ArrowDown":
    case "ArrowUp": {
      event.preventDefault();
      const forward = event.key === "ArrowDown";
      if (!isOpen) {
        setOpen(true);
        focusItem(forward ? 0 : -1);
        break;
      }
      const items = menuItems(wrapper);
      const current = items.indexOf(document.activeElement as HTMLElement);
      if (current === -1) focusItem(forward ? 0 : -1);
      else focusItem(current + (forward ? 1 : -1));
      break;
    }
    case "Home":
      if (isOpen) {
        event.preventDefault();
        focusItem(0);
      }
      break;
    case "End":
      if (isOpen) {
        event.preventDefault();
        focusItem(-1);
      }
      break;
  }
}
