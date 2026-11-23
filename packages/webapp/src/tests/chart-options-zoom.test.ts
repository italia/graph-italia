import { describe, it, expect } from "vitest";
import { getFields } from "../lib/constants";

// Same grouping as ChartOptions: fields are filtered by chart type and each
// one belongs to the last "label" field before it.
function sectionOf(chart: string, name: string): string | undefined {
  let section: string | undefined;
  for (const field of getFields([], "theme").filter((f) => f.chartType.includes(chart))) {
    if (field.type === "label") section = field.name;
    else if (field.name === name) return section;
  }
  return undefined;
}

describe("zoom option in the chart configuration", () => {
  it("is offered for bar charts, in the bar chart section", () => {
    expect(sectionOf("bar", "zoom")).toBe("Bar Chart");
  });

  it("is still offered for line charts, in the line chart section", () => {
    expect(sectionOf("line", "zoom")).toBe("Line Chart");
  });

  it("is not offered for pies and maps", () => {
    expect(sectionOf("pie", "zoom")).toBeUndefined();
    expect(sectionOf("map", "zoom")).toBeUndefined();
  });
});
