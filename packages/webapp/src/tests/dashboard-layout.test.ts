import { describe, expect, it } from "vitest";
import { toSingleColumn } from "../lib/dashboardLayout";

describe("toSingleColumn", () => {
  it("stacks every slot full width in reading order, keeping its height", () => {
    const layout = [
      { i: "item-3", x: 0, y: 2, w: 3, h: 1 },
      { i: "item-2", x: 2, y: 0, w: 1, h: 1 },
      { i: "item-1", x: 0, y: 0, w: 2, h: 2 },
    ] as const;
    expect(toSingleColumn([...layout])).toEqual([
      { i: "item-1", x: 0, y: 0, w: 3, h: 2 },
      { i: "item-2", x: 0, y: 2, w: 3, h: 1 },
      { i: "item-3", x: 0, y: 3, w: 3, h: 1 },
    ]);
  });

  it("leaves the layout it receives untouched", () => {
    const layout = [{ i: "item-1" as const, x: 1, y: 0, w: 1, h: 1 }];
    toSingleColumn(layout);
    expect(layout[0]).toEqual({ i: "item-1", x: 1, y: 0, w: 1, h: 1 });
  });
});
