import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/api.ts", () => ({
  isPublishingEnabled: () => true,
  findDashboardById: vi.fn(),
  updateDashboard: vi.fn().mockResolvedValue(true),
  updateSlots: vi.fn().mockResolvedValue(true),
  upsertChart: vi.fn().mockResolvedValue({ id: "text-chart-new" }),
  deleteChart: vi.fn().mockResolvedValue({}),
}));

import * as api from "../lib/api.ts";
import useDashboardEditStore from "../lib/store/dashboard-edit.store";

const initialState = useDashboardEditStore.getState();

describe("dashboard-edit store — text slots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardEditStore.setState(initialState, true);
    useDashboardEditStore.setState({
      id: "dash-1",
      name: "Dash",
      description: "",
      publish: true,
      layout: [],
      charts: {},
      texts: {},
      removedTextChartIds: [],
    });
  });

  it("addTextItem adds a layout item with an empty text entry (no chart modal)", () => {
    useDashboardEditStore.getState().addTextItem();
    const { layout, texts, show } = useDashboardEditStore.getState();
    expect(layout).toHaveLength(1);
    expect(texts[layout[0].i]).toEqual({ content: "" });
    expect(show).toBe(false);
  });

  it("save() persists a new text slot as a 'text' chart and references it in slots", async () => {
    useDashboardEditStore.setState({
      layout: [
        { i: "item-0", x: 0, y: 0, w: 1, h: 1 },
        { i: "item-1", x: 0, y: 1, w: 1, h: 1 },
      ],
      charts: { "item-0": { id: "chart-9", name: "c", description: "" } },
      texts: { "item-1": { content: "# Ciao" } },
    });

    const ok = await useDashboardEditStore.getState().save();
    expect(ok).toBe(true);

    expect(api.upsertChart).toHaveBeenCalledWith(
      expect.objectContaining({
        chart: "text",
        config: { content: "# Ciao" },
        publish: true,
      }),
      undefined,
    );

    expect(api.updateSlots).toHaveBeenCalledWith("dash-1", {
      slots: [
        expect.objectContaining({ chartId: "chart-9" }),
        expect.objectContaining({ chartId: "text-chart-new" }),
      ],
    });

    // The created chart id is stored back so re-saves update instead of recreate
    expect(
      useDashboardEditStore.getState().texts["item-1"].chartId,
    ).toBe("text-chart-new");
  });

  it("save() updates an existing text chart instead of creating a new one", async () => {
    useDashboardEditStore.setState({
      layout: [{ i: "item-0", x: 0, y: 0, w: 1, h: 1 }],
      texts: { "item-0": { chartId: "text-chart-7", content: "aggiornato" } },
    });

    await useDashboardEditStore.getState().save();

    expect(api.upsertChart).toHaveBeenCalledWith(
      expect.objectContaining({ config: { content: "aggiornato" } }),
      "text-chart-7",
    );
  });

  it("deleteItem on a saved text slot defers chart deletion to save()", async () => {
    useDashboardEditStore.setState({
      layout: [{ i: "item-0", x: 0, y: 0, w: 1, h: 1 }],
      texts: { "item-0": { chartId: "text-chart-7", content: "x" } },
    });

    useDashboardEditStore.getState().deleteItem("item-0");
    const state = useDashboardEditStore.getState();
    expect(state.layout).toHaveLength(0);
    expect(state.texts).toEqual({});
    expect(state.removedTextChartIds).toEqual(["text-chart-7"]);
    expect(api.deleteChart).not.toHaveBeenCalled();

    await useDashboardEditStore.getState().save();
    expect(api.deleteChart).toHaveBeenCalledWith("text-chart-7");
    expect(useDashboardEditStore.getState().removedTextChartIds).toEqual([]);
  });
});
