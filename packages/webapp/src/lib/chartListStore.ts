import { create } from "zustand";
import { FieldDataType, RemoteStoreStateType } from "../types";

type CreateKpiGroupState = {
  setShowCreateKpiGroupModal: (value: boolean) => void;
  showCreateKpiGroupModal: boolean;
}

type ChartListStoreState = RemoteStoreStateType & CreateKpiGroupState

const useChartsStoreState = create<ChartListStoreState>()((set) => ({
  list: [],
  showCreateKpiGroupModal: false,
  addItem: (item: FieldDataType) => {
    set((state) => ({ list: [...state.list, item] }));
  },
  removeItem: (id: string) => {
    set((state) => ({
      list: state.list.filter((i) => i.id !== id),
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
    set((state) => ({ list: [...items] }));
  },
  setShowCreateKpiGroupModal: (showCreateKpiGroupModal: boolean) => {
    set(state => ({ ...state, showCreateKpiGroupModal }))
  }
}));
export default useChartsStoreState;
