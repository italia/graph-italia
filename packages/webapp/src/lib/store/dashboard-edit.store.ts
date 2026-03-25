import { create } from 'zustand';
import { findDashboardById, updateSlots, type DashboardDetail } from '../api.ts';

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
  showAddModal: (i: string) => void;
  closeAddModal: () => void;
  setBreakpoint: (breakpoint: string) => void;
  setSelectedChart: (selectedChart?: TChartRef) => void;
  setLayout: (layout: TLayoutItem[]) => void;
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
  setLayout: (layout) => set({ layout }),
  addItem: () => {
    const { layout } = get();
    const xMax = 0;
    const yMax = layout.reduce((acc, cur) => (cur.y > acc ? cur.y : acc), 0);
    const generator = itemGenerator(layout);
    const i = generator.next().value;
    const l = { i, x: xMax, y: yMax, w: 4, h: 1 };
    const newLayout = [...layout, l] as typeof layout;

    set({
      show: true,
      lastCreated: i,
      layout: newLayout,
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

        const { name, description } = data;

        set({
          charts,
          layout,
          name,
          description,
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
    const { layout, charts, id } = get();
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
