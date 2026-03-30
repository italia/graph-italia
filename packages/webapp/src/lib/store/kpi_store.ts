import type { ChartConfigType, FieldDataType } from "dataviz-components";
import type { KpiFormValues } from "../../pages/private/EditKpiGroupOld/kpi-form";
import { create } from "zustand";
import * as api from "../api";

type KpiGroupConfigType = Pick<ChartConfigType,
    | "direction"
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
        h: 500,
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
        background: "",
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
    addKpiFormModalVisible?: boolean;
    configModalVisible?: boolean;
    editKpiGroupFormModalVisible?: boolean;
    deleteModalVisible?: boolean;
    pendingChanges: boolean;
    selectedKpi?: KpiFormValues;
    selectedKpiIndex?: number;
};

interface EditKpiGroupActions {
    // server ops
    load: (id: string) => void;
    reload: () => void;
    save: () => Promise<boolean>;
    // add modal
    showAddKpiFormModal: () => void;
    closeKpiGroupFormModal: () => void;
    // edit modal
    showEditKpiFormModal: (index: number) => void;
    closeEditKpiFormModal: () => void;
    // config modal
    showConfigFormModal: () => void;
    closeConfigFormModal: (config?: KpiGroupConfigType) => void;
    // delete modal
    confirmDeleteModal: () => void;
    cancelDeleteModal: () => void;
    showDeleteKpiModal: (index: number) => void;
    // add or update KPIs to the state
    addKpi: (data: KpiFormValues) => void;
    updateKpi: (data: KpiFormValues) => void;
}

type EditKpiGroupStore = EditKpiGroupActions & EditKpiGroupState;

const useEditKpiGroupStore = create<EditKpiGroupStore>()((set, get) => ({
    vm: { name: "", description: "" },
    kpiGroup: defaultKpiGroupData,
    isLoading: true,
    loaded: false,
    pendingChanges: false,
    showConfigFormModal: () => {
        set({ configModalVisible: true });
    },
    closeConfigFormModal: (config) => {
        // Implement the logic to change the configuration
        if (config) {
            const { kpiGroup } = get();
            set({
                configModalVisible: false,
                kpiGroup: { ...kpiGroup, config: { ...defaultKpiGroupData.config, ...config } },
                pendingChanges: true,
            });
        } else {
            set({ configModalVisible: false });
        }
    },
    showAddKpiFormModal: () => {
        console.log("add item");
        set({ addKpiFormModalVisible: true });
    },
    addKpi: (data: KpiFormValues) => {
        const { kpiGroup } = get();
        set({
            kpiGroup: { ...kpiGroup, dataSource: [...kpiGroup.dataSource, data] },
            pendingChanges: true,
            addKpiFormModalVisible: false,
        });
        console.log("KPI saved:", data);
    },
    updateKpi: (data: KpiFormValues) => {
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
            editKpiGroupFormModalVisible: false,
            selectedKpi: undefined,
            selectedKpiIndex: undefined,
        });
    },
    showEditKpiFormModal: (selectedKpiIndex: number) => {
        const { kpiGroup } = get();
        const selectedKpi = kpiGroup.dataSource[selectedKpiIndex];

        set({
            editKpiGroupFormModalVisible: true,
            selectedKpi,
            selectedKpiIndex,
        });
    },
    showDeleteKpiModal: (selectedKpiIndex: number) => {
        const { kpiGroup } = get();
        const selectedKpi = kpiGroup.dataSource[selectedKpiIndex];
        set({
            deleteModalVisible: true,
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
            deleteModalVisible: false,
            selectedKpi: undefined,
            selectedKpiIndex: undefined,
        });
    },
    cancelDeleteModal: () => {
        set({
            deleteModalVisible: false,
            selectedKpi: undefined,
            selectedKpiIndex: undefined,
        });
    },
    closeKpiGroupFormModal: () => {
        set({ addKpiFormModalVisible: false });
    },
    closeEditKpiFormModal: () => {
        set({
            editKpiGroupFormModalVisible: false,
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
