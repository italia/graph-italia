import { create } from "zustand";
import type { FieldDataType, RemoteStoreStateType } from "../types";

const useDashboardsStoreState = create<RemoteStoreStateType>()((set) => ({
  list: [],
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
    set(() => ({ list: [...items] }));
  },
}));
export default useDashboardsStoreState;
