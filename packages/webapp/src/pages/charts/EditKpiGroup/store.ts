import { ChartConfigType, FieldDataType } from "dataviz-components";
import { create } from "zustand";
import * as api from "../../../lib/api";
import { KpiGroupFormValues } from "./components/kpi-group-form";

interface EditKpiGroupActions {
    load: (id: string) => void;
    reload: () => void;
    save: () => Promise<boolean>;
    addKpi: () => void;
    editKpi: (index: number) => void;
    deleteKpi: (index: number) => void;
    closeFormModal: () => void;
    closeEditKpiFormModal: () => void;
    showConfigFormModal: () => void;
    closeConfigFormModal: (config?: KpiGroupConfigType) => void;
    saveKpi: (data: KpiGroupFormValues) => void;
    updateKpi: (data: KpiGroupFormValues) => void;
    confirmDeleteModal: () => void;
    cancelDeleteModal: () => void;
    showDeleteKpiModal: (index: number) => void;
}

type KpiGroupConfigType = Pick<
    ChartConfigType,
    | "direction"
    | "h"
    | "labeLine"
    | "legend"
    | "legendPosition"
    | "palette"
    | "tooltip"
    | "tooltipFormatter"
    | "valueFormatter"
    | "totalLabel"
    | "tooltipTrigger"
    | "colors"
    | "background"
>;

type KpiGroupFieldDataType = FieldDataType & {
    config: KpiGroupConfigType;
};

const defaultKpiGroupData: KpiGroupFieldDataType = {
    id: "kpi-group2",
    dataSource: [],
    chart: "kpi",
    config: {
        direction: "vertical",
        h: 0,
        labeLine: false,
        legend: false,
        legendPosition: "",
        palette: [],
        tooltip: false,
        tooltipFormatter: "",
        valueFormatter: "",
        totalLabel: "",
        tooltipTrigger: "",
        colors: [],
        background: "skyblue",
    },
    data: null,
};

type EditKpiGroupVM = {
    name: string;
    description: string;
};

type EditKpiGroupState = {
    id?: string;
    vm: EditKpiGroupVM;
    kpiGroup: KpiGroupFieldDataType;
    isLoading: boolean;
    loaded: boolean;
    error?: {
        message: string;
    };
    showFormModal?: boolean;
    showConfigModal?: boolean;
    showEditKpiGroupFormModal?: boolean;
    showDeleteModal?: boolean;
    pendingChanges: boolean;
    selectedKpi?: KpiGroupFormValues;
    selectedKpiIndex?: number;
};

type EditKpiGroupStore = EditKpiGroupActions & EditKpiGroupState;

const useEditKpiGroupStore = create<EditKpiGroupStore>()((set, get) => ({
    vm: { name: "", description: "" },
    kpiGroup: defaultKpiGroupData,
    isLoading: true,
    loaded: false,
    pendingChanges: false,
    showConfigFormModal: () => {
        set({ showConfigModal: true });
    },
    closeConfigFormModal: (config) => {
        // Implement the logic to change the configuration
        if (config) {
            const { kpiGroup } = get();
            set({
                showConfigModal: false,
                kpiGroup: { ...kpiGroup, config: { ...config } },
                pendingChanges: true,
            });
        } else {
            set({ showConfigModal: false });
        }
    },
    addKpi: () => {
        console.log("add item");
        set({ showFormModal: true });
    },
    deleteKpi: (index: number) => {
        const { kpiGroup } = get();
        set({
            kpiGroup: {
                ...kpiGroup,
                dataSource: kpiGroup.dataSource.filter(
                    (_: unknown, i: number) => i !== index,
                ),
            },
            pendingChanges: true,
        });
    },
    saveKpi: (data: KpiGroupFormValues) => {
        const { kpiGroup } = get();
        set({
            kpiGroup: { ...kpiGroup, dataSource: [...kpiGroup.dataSource, data] },
            pendingChanges: true,
        });
        console.log("KPI saved:", data);
    },
    updateKpi: (data: KpiGroupFormValues) => {
        const { kpiGroup, selectedKpiIndex } = get();

        if (isNaN(Number(selectedKpiIndex))) {
            throw new Error();
        }

        const dataSource = kpiGroup.dataSource;

        set({
            kpiGroup: {
                ...kpiGroup,
                dataSource: [
                    ...dataSource.slice(0, selectedKpiIndex),
                    data,
                    ...dataSource.slice(selectedKpiIndex! + 1),
                ],
            },
            showEditKpiGroupFormModal: false,
            selectedKpi: undefined,
            selectedKpiIndex: undefined,
        });
    },
    editKpi: (selectedKpiIndex: number) => {
        const { kpiGroup } = get();
        const selectedKpi = kpiGroup.dataSource[selectedKpiIndex];

        set({
            showEditKpiGroupFormModal: true,
            selectedKpi,
            selectedKpiIndex,
        });
    },
    showDeleteKpiModal: (selectedKpiIndex: number) => {
        const { kpiGroup } = get();
        const selectedKpi = kpiGroup.dataSource[selectedKpiIndex];
        set({
            showDeleteModal: true,
            selectedKpi,
            selectedKpiIndex,
        });
    },
    confirmDeleteModal: () => {
        const { kpiGroup, selectedKpiIndex } = get();
        set({
            kpiGroup: {
                ...kpiGroup,
                dataSource: kpiGroup.dataSource.filter(
                    (_: unknown, i: number) => i !== selectedKpiIndex,
                ),
            },
            pendingChanges: true,
            showDeleteModal: false,
            selectedKpi: undefined,
            selectedKpiIndex: undefined,
        });
    },
    cancelDeleteModal: () => {
        set({
            showDeleteModal: false,
            selectedKpi: undefined,
            selectedKpiIndex: undefined,
        });
    },
    closeFormModal: () => {
        set({ showFormModal: false });
    },
    closeEditKpiFormModal: () => {
        set({
            showEditKpiGroupFormModal: false,
            selectedKpi: undefined,
            selectedKpiIndex: undefined,
        });
    },
    load: async (id: string) => {
        try {
            const response = await api.getKpiGroup({ id });
            if (response && response.data) {
                console.log(response.data);
                const { name, description, config, dataSource } = response.data;
                set({
                    vm: { name, description },
                    isLoading: false,
                    loaded: true,
                    id,
                    pendingChanges: false,
                    kpiGroup: {
                        ...defaultKpiGroupData,
                        config: { ...config },
                        dataSource,
                    },
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
        console.log("save kpi group");
        const { id, kpiGroup } = get();
        if (!id) {
            throw new Error("ID is undefined");
        }
        const response = await api.saveKpiGroup({
            id,
            payload: {
                config: kpiGroup.config,
                dataSource: kpiGroup.dataSource,
            },
        });

        set({ pendingChanges: false });

        return response;
    },
}));

export default useEditKpiGroupStore;
