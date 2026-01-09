import { FieldDataType } from 'dataviz-components';
import { create } from 'zustand';
import * as api from "../../../lib/api";
import { KpiFormValues } from './components/kpi-form';

interface EditKpiGroupActions {
    load: (id: string) => void;
    reload: () => void;
    save: () => Promise<boolean>;
    addKpi: () => void;
    deleteKpi: (index: number) => void;
    closeFormModal: () => void;
    saveKpi: (data: KpiFormValues) => void;
}

const defaultKpiGroupData: FieldDataType = {
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
}

type EditKpiGroupVM = {
    name: string;
    description: string,
}

type EditKpiGroupState = {
    id?: string
    vm: EditKpiGroupVM;
    kpiGroup: FieldDataType;
    isLoading: boolean;
    loaded: boolean;
    error?: {
        message: string;
    };
    showFormModal?: boolean;
}

type EditKpiGroupStore = EditKpiGroupActions & EditKpiGroupState;

const useEditKpiGroupStore = create<EditKpiGroupStore>()((set, get) => ({
    vm: { name: '', description: '' },
    kpiGroup: defaultKpiGroupData,
    isLoading: true,
    loaded: false,
    addKpi: () => {
        console.log("add item");
        set({ showFormModal: true });
    },
    deleteKpi: (index: number) => {
        const { kpiGroup } = get();
        set({ kpiGroup: { ...kpiGroup, dataSource: kpiGroup.dataSource.filter((_: unknown, i: number) => i !== index) } });
    },
    saveKpi: (data: KpiFormValues) => {
        const { kpiGroup } = get();
        set({ kpiGroup: { ...kpiGroup, dataSource: [...kpiGroup.dataSource, data] } });
        console.log("KPI saved:", data);
    },
    closeFormModal: () => {
        set({ showFormModal: false });
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
                    loaded: true, id,
                    kpiGroup: { ...defaultKpiGroupData, config: { ...config }, dataSource }
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
            }
        });

        return response;
    },
}));

export default useEditKpiGroupStore;