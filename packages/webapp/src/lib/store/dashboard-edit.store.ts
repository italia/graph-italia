import { create } from 'zustand';
import { findDashboardById, isPublishingEnabled, updateDashboard, updateSlots, type DashboardDetail } from '../api.ts';

type TChartRef = { id: string };
type TItem = `item-${number}`;

export interface ChartLookup extends TChartRef {
  name: string;
  description: string;
}

type TChartMap = Record<TItem, ChartLookup>;

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
    const { layout, charts } = get();
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
    });
  },
  showAddModal: (i: string) => {
    set({ show: true, lastCreated: i });
  },
  closeAddModal: () => {
    const { charts, lastCreated, selectedChart } = get();

    set({
      charts: {
        ...charts,
        [lastCreated as string]: selectedChart as ChartLookup,
      },
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

        const charts = data.slots.reduce<TChartMap>(
          (p, c) => ({ ...p, [c.settings.i]: c.chart as ChartLookup }),
          {}
        );

        const { name, description, publish } = data;

        set({
          charts,
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

    const { layout, charts, id, name, description, publish } = get();

    await updateDashboard(id!, { name, description, publish: isPublishingEnabled() ? publish : false });

    const body = {
      slots: layout.map((l) => ({
        chartId: charts[l.i]?.id,
        settings: { i: l.i, w: l.w, h: l.h, x: l.x, y: l.y },
      })),
    };
    return await updateSlots(id!, body).then((r) => Boolean(r));
  },
}));

export type { TChartRef, TLayoutItem };
export default useDashboardEditStore;
