import { create } from 'zustand';
import { findDashboardById, type DashboardDetail } from "../api.ts";

type TChartRef = { id: string };

interface ChartLookup extends TChartRef {
  name: string;
  description: string;
}

type TChartMap = Record<string, ChartLookup>;

type TLayoutItem = {
  i: `item-${number}`;
  x: number;
  y: number;
  w: number;
  h: number;
};

interface DashboardViewActions {
  load: (id: string) => void;
}

interface DashboardViewSelectors {
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
}

type DashboardViewState = DashboardViewActions & DashboardViewSelectors;

const useDashboardViewStore = create<DashboardViewState>((set) => ({
  name: '',
  description: '',
  isLoading: true,
  loaded: false,
  layout: [],
  charts: {},
  load: async (id: string) => {
    try {
      const data = (await findDashboardById(id)) as DashboardDetail;

      if (data) {
        const layout = data.slots.map(
          ({ settings }: { settings: TLayoutItem }) => ({
            ...settings,
            static: true,
            resizeHandlers: undefined,
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
}));

export type { TChartRef as TChart, TLayoutItem };
export default useDashboardViewStore;
