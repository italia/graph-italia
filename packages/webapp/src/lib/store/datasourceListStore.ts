import { create } from "zustand";
import type { DatasourceItem } from "../api";

type DatasourceListState = {
  list: DatasourceItem[];
  setList: (items: DatasourceItem[]) => void;
  addItem: (item: DatasourceItem) => void;
  removeItem: (id: string) => void;
};

const useDatasourceListStore = create<DatasourceListState>()((set) => ({
  list: [],
  setList: (items) => set({ list: [...items] }),
  addItem: (item) => set((state) => ({ list: [...state.list, item] })),
  removeItem: (id) =>
    set((state) => ({ list: state.list.filter((i) => i.id !== id) })),
}));

export default useDatasourceListStore;
