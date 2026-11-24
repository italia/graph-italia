import { create } from 'zustand';
import { readDashboardForDisplay } from "../api.ts";

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
  // Not a public page: publishing is off, or the dashboard is private and the
  // viewer reads it as a project member (see readDashboardForDisplay).
  preview: boolean;
  /** Every chart shown with its ChartWrapper (Dashboard.wrapCharts). */
  wrapCharts: boolean;
  /** One slot per row, full width, in reading order (Dashboard.singleColumn). */
  singleColumn: boolean;
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
  preview: false,
  wrapCharts: false,
  singleColumn: false,
  layout: [],
  charts: {},
  load: async (id: string) => {
    try {
      const { data, preview } = await readDashboardForDisplay(id);

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
          preview,
          wrapCharts: data.wrapCharts === true,
          singleColumn: data.singleColumn === true,
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
