import { create } from "zustand";
import { defaultConfig } from "./constants";
import { MatrixType, StoreStateType } from "../types";
// import { persist } from "zustand/middleware";
// import { immer } from 'zustand/middleware/immer';

const useStoreState = create<StoreStateType>()(
  // persist(
  (set) => ({
    data: null,
    dataSource: undefined,
    chart: "bar",
    config: defaultConfig,
    rawData: null,
    description: "",
    publish: false,
    remoteUrl: null,
    isRemote: false,
    name: "",
    preview: "",
    id: null,
    setPreview: (value: string) => set(() => ({ preview: value })),
    setId: (value: string) => set(() => ({ id: value })),
    setName: (value: string) => set(() => ({ name: value })),
    setConfig: (value: object) => set(() => ({ config: value })),
    setChart: (value: string) => set(() => ({ chart: value })),
    setRawData: (value: any) => set(() => ({ rawData: value })),
    setData: (value: MatrixType | null) => set(() => ({ data: value })),
    setDataSource: (value: object[] | []) => set(() => ({ dataSource: value })),
    setRemoteUrl: (value: string | null) => set(() => ({ remoteUrl: value })),
    setIsRemote: (value: boolean) => set(() => ({ isRemote: value })),
    loadItem: (value: any) =>
      set((state) => ({
        chart: value.chart,
        config: value.config,
        rawData: null,
        data: value.data,
        dataSource: value.dataSource,
        description: value.description,
        publish: value.publish,
        name: value.name,
        remoteUrl: value.remoteUrl,
        isRemote: value.isRemote,
        id: value.id,
        preview: value.preview,
      })),
    resetItem: () =>
      set(() => ({
        id: null,
        name: "",
        description: "",
        chart: "bar",
        data: null,
        dataSource: undefined,
        config: defaultConfig,
        rawData: null,
        publish: true,
        preview: "",
        // remoteUrl: null,
        // isRemote: false,
      })),
  })
  // { name: "persistedStore" }
  // )
);
export default useStoreState;
