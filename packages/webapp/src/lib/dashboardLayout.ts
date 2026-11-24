import type { TLayoutItem } from "./store/dashboard-edit.store";

/**
 * Single-column layout (Dashboard.singleColumn), as the singleColumn prop of
 * the components library: every slot full width, one below the other in
 * reading order, keeping its height.
 */
export function toSingleColumn(layout: TLayoutItem[]): TLayoutItem[] {
  const sorted = [...layout].sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x));
  let y = 0;
  return sorted.map((item) => {
    const out = { ...item, x: 0, y, w: 3 };
    y += item.h;
    return out;
  });
}
