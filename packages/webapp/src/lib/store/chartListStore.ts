import { create } from "zustand";
import type { FieldDataType, RemoteStoreStateType } from "../../types";

type CreateKpiGroupState = {
  setShowCreateKpiGroupModal: (value: boolean) => void;
  showCreateKpiGroupModal: boolean;
};

type CreateChartState = {
  setShowCreateChartModal: (value: boolean) => void;
  showCreateChartModal: boolean;
};

type ChartListStoreState = RemoteStoreStateType &
  CreateKpiGroupState &
  CreateChartState;

const useChartsStoreState = create<ChartListStoreState>()((set) => ({
  list: [],
  showCreateKpiGroupModal: false,
  showCreateChartModal: false,
  addItem: (item: FieldDataType) => {
    set((state) => ({ list: [...state.list, item] }));
  },
  removeItem: (id: string) => {
    set((state) => ({
      list: state.list.filter((i: FieldDataType) => i.id !== id),
    }));
  },
  updateItem: (newItem: FieldDataType) =>
    set((state) => ({
      list: state.list.map((i) => {
        if (i.id === newItem.id) {
          return newItem;
        }
        return i;
      }),
    })),
  setList: (items: FieldDataType[]) => {
    set(() => ({ list: [...items] }));
  },
  setShowCreateKpiGroupModal: (showCreateKpiGroupModal: boolean) => {
    set(() => ({ showCreateKpiGroupModal }));
  },
  setShowCreateChartModal: (showCreateChartModal: boolean) => {
    set(() => ({ showCreateChartModal }));
  },
}));
export default useChartsStoreState;
