import { create } from 'zustand';
import { deleteChart, findDashboardById, isPublishingEnabled, updateDashboard, updateSlots, upsertChart, type DashboardDetail } from '../api.ts';

type TChartRef = { id: string };
type TItem = `item-${number}`;

export interface ChartLookup extends TChartRef {
  name: string;
  description: string;
}

// A text block backed by a hidden chart of type "text" (content lives in the
// chart's config). chartId is set after the first save.
export interface TextLookup {
  chartId?: string;
  content: string;
}

type TChartMap = Record<TItem, ChartLookup>;
type TTextMap = Record<TItem, TextLookup>;

type TLayoutItem = {
  i: TItem;
  x: number;
  y: number;
  w: number;
  h: number;
};

interface DashboardEditSelectors {
  id?: string;
  name: string;
  description: string;
  publish: boolean;
  layout: TLayoutItem[];
  charts: TChartMap;
  texts: TTextMap;
  removedTextChartIds: string[];
  isLoading: boolean;
  loaded: boolean;
  error?: {
    message: string;
  };
  breakpoint: string;
  show: boolean;
  lastCreated?: string;
  selectedChart?: TChartRef;
}

interface DashboardEditActions {
  load: (id: string) => void;
  reload: () => void;
  save: () => Promise<boolean>;
  addItem: () => void;
  addTextItem: () => void;
  setTextContent: (id: string, content: string) => void;
  deleteItem: (id: string) => void;
  updateItemSize: (id: string, w: number, h: number) => void;
  updateItemPosition: (id: string, dx: number, dy: number) => void;
  showAddModal: (i: string) => void;
  closeAddModal: () => void;
  setBreakpoint: (breakpoint: string) => void;
  setSelectedChart: (selectedChart?: TChartRef) => void;
  setLayout: (layout: TLayoutItem[]) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setPublish: (publish: boolean) => void;
}

type DashboardEditState = DashboardEditSelectors & DashboardEditActions;

function* itemGenerator(
  layout: Array<TLayoutItem>
): Generator<TItem, never, void> {
  let index = 0;
  const itemsAlreadyUsed = new Set<TItem>(layout.map((l) => l.i));

  while (true) {
    const item = `item-${index}` as TItem;
    if (!itemsAlreadyUsed.has(item)) {
      itemsAlreadyUsed.add(item);
      yield item;
    }
    index++;
  }
}

const useDashboardEditStore = create<DashboardEditState>()((set, get) => ({
  name: '',
  description: '',
  publish: isPublishingEnabled(),
  breakpoint: 'lg',
  layout: [],
  show: false,
  lastCreated: undefined,
  selectedChart: undefined,
  charts: {},
  texts: {},
  removedTextChartIds: [],
  isLoading: true,
  loaded: false,
  setBreakpoint: (breakpoint) => set({ breakpoint }),
  setSelectedChart: (selectedChart) => set({ selectedChart }),
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setPublish: (publish) => set({ publish }),
  setLayout: (layout) => set({ layout }),
  addItem: () => {
    const { layout } = get();
    const xMax = 0;
    const yMax = layout.reduce((acc, cur) => (cur.y > acc ? cur.y : acc), 0);
    const generator = itemGenerator(layout);
    const i = generator.next().value;
    const l = { i, x: xMax, y: yMax, w: 1, h: 1 };
    const newLayout = [...layout, l] as typeof layout;
    set({
      show: true,
      lastCreated: i,
      layout: newLayout,
    });
  },
  addTextItem: () => {
    const { layout, texts } = get();
    const yMax = layout.reduce((acc, cur) => (cur.y > acc ? cur.y : acc), 0);
    const generator = itemGenerator(layout);
    const i = generator.next().value;
    set({
      layout: [...layout, { i, x: 0, y: yMax, w: 1, h: 1 }],
      texts: { ...texts, [i]: { content: '' } },
    });
  },
  setTextContent: (id: string, content: string) => {
    const { texts } = get();
    const current = texts[id as TItem];
    if (!current) return;
    set({ texts: { ...texts, [id as TItem]: { ...current, content } } });
  },
  updateItemSize: (id: string, w: number, h: number) => {
    const { layout } = get();
    set({ layout: layout.map((item) => item.i === id ? { ...item, w, h } : item) });
  },
  updateItemPosition: (id: string, dx: number, dy: number) => {
    const { layout } = get();
    set({
      layout: layout.map((item) =>
        item.i === id
          ? { ...item, x: Math.max(0, item.x + dx), y: Math.max(0, item.y + dy) }
          : item
      ),
    });
  },
  deleteItem: (id: string) => {
    console.log('delete', id);
    const { layout, charts, texts, removedTextChartIds } = get();
    // A removed text slot leaves its backing "text" chart orphaned: remember
    // the id so save() can delete it once the slot row is gone.
    const removedText = texts[id as TItem];
    const nextTexts = { ...texts };
    delete nextTexts[id as TItem];
    set({
      layout: layout.filter((i) => i.i !== id),
      charts: (Object.keys(charts) as Array<TItem>).reduce<TChartMap>(
        (p, c) => {
          if (c === id) {
            return { ...p };
          } else {
            return { ...p, [c]: charts[c] };
          }
        },
        {}
      ),
      texts: nextTexts,
      removedTextChartIds: removedText?.chartId
        ? [...removedTextChartIds, removedText.chartId]
        : removedTextChartIds,
    });
  },
  showAddModal: (i: string) => {
    set({ show: true, lastCreated: i });
  },
  closeAddModal: () => {
    const { charts, lastCreated, selectedChart } = get();

    set({
      // Closing without picking a chart must not write an undefined entry
      charts:
        lastCreated && selectedChart
          ? { ...charts, [lastCreated]: selectedChart as ChartLookup }
          : charts,
      show: false,
      lastCreated: undefined,
      selectedChart: undefined,
    });
  },
  load: async (id: string) => {
    try {
      const data = (await findDashboardById(id)) as DashboardDetail;

      if (data) {
        const layout = data.slots.map(
          ({ settings }: { settings: TLayoutItem }) => ({
            ...settings,
          })
        );

        // Split slots between real charts and "text" pseudo-charts (markdown
        // blocks persisted as charts, see save()).
        const charts: TChartMap = {};
        const texts: TTextMap = {};
        for (const slot of data.slots) {
          const chart = slot.chart as ChartLookup & {
            chart?: string;
            config?: { content?: string };
          };
          const key = (slot.settings as TLayoutItem).i;
          if (chart?.chart === 'text') {
            texts[key] = { chartId: chart.id, content: chart.config?.content ?? '' };
          } else {
            charts[key] = chart;
          }
        }

        const { name, description, publish } = data;

        set({
          charts,
          texts,
          removedTextChartIds: [],
          layout,
          name,
          description,
          publish: isPublishingEnabled() ? publish : false,
          isLoading: false,
          loaded: true,
          id,
        });
      }
    } catch (error) {
      set({ error: { message: (error as Error).message }, isLoading: false });
    }
  },
  reload: async () => {
    const { id, load } = get();
    if (id) {
      await load(id);
    }
  },
  save: async () => {

    const { layout, charts, texts, removedTextChartIds, id, name, description, publish } = get();
    const publishValue = isPublishingEnabled() ? publish : false;

    // Persist text blocks first: each one is stored as a chart of type "text"
    // (markdown in config.content), so updateSlots below can reference a real
    // chartId and server/schema stay untouched.
    const nextTexts: TTextMap = { ...texts };
    for (const l of layout) {
      const text = texts[l.i];
      if (!text) continue;
      const result = await upsertChart(
        {
          name: `dashboard-text-${l.i}`,
          chart: 'text',
          config: { content: text.content },
          publish: publishValue,
        },
        text.chartId,
      );
      const chartId = text.chartId ?? result?.id;
      if (!chartId) return false;
      nextTexts[l.i] = { ...text, chartId };
    }
    set({ texts: nextTexts });

    await updateDashboard(id!, { name, description, publish: publishValue });

    const body = {
      // A slot row requires a chartId: slots still without content stay in
      // the editor but are skipped here instead of failing the whole save.
      slots: layout
        .filter((l) => nextTexts[l.i]?.chartId ?? charts[l.i]?.id)
        .map((l) => ({
          chartId: nextTexts[l.i]?.chartId ?? charts[l.i]?.id,
          settings: { i: l.i, w: l.w, h: l.h, x: l.x, y: l.y },
        })),
    };
    const ok = await updateSlots(id!, body).then((r) => Boolean(r));

    // Text charts of deleted slots can only be removed after updateSlots has
    // dropped the slot rows that reference them.
    if (ok && removedTextChartIds.length > 0) {
      await Promise.all(
        removedTextChartIds.map((chartId) => deleteChart(chartId).catch(() => null)),
      );
      set({ removedTextChartIds: [] });
    }
    return ok;
  },
}));

export type { TChartRef, TLayoutItem };
export default useDashboardEditStore;
