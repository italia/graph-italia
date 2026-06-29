import { create } from "zustand";
import type { MatrixType } from "../../types";

type DatasourceEditState = {
  id: string | null;
  data: MatrixType | null;
  rawData: MatrixType | null;
  isRemote: boolean;
  remoteUrl: string | null;
  isTrasposed: boolean;
  setId: (value: string) => void;
  setData: (value: MatrixType | null) => void;
  setRawData: (value: MatrixType | null) => void;
  setIsRemote: (value: boolean) => void;
  setRemoteUrl: (value: string | null) => void;
  setIsTrasposed: (value: boolean) => void;
  loadItem: (value: any) => void;
  resetItem: () => void;
};

const useDatasourceEditStore = create<DatasourceEditState>()((set) => ({
  id: null,
  data: null,
  rawData: null,
  isRemote: false,
  remoteUrl: null,
  isTrasposed: false,

  setId: (id) => set({ id }),
  setData: (data) => set({ data }),
  setRawData: (rawData) => set({ rawData }),
  setIsRemote: (isRemote) => set({ isRemote }),
  setRemoteUrl: (remoteUrl) => set({ remoteUrl }),
  setIsTrasposed: (isTrasposed) => set({ isTrasposed }),

  loadItem: (value) =>
    set({
      id: value.id ?? null,
      data: value.data ?? null,
      rawData: value.data ?? null,
      isRemote: value.isRemote ?? false,
      remoteUrl: value.remoteUrl ?? null,
      isTrasposed: value.isTrasposed ?? false,
    }),

  resetItem: () =>
    set({
      id: null,
      data: null,
      rawData: null,
      isRemote: false,
      remoteUrl: null,
      isTrasposed: false,
    }),
}));

export default useDatasourceEditStore;
