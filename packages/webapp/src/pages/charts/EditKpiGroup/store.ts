import { FieldDataType } from 'dataviz-components';
import { create } from 'zustand';
import * as api from "../../../lib/api";
import { KpiFormValues } from './components/kpi-form';

interface EditKpiGroupActions {
    load: (id: string) => void;
    reload: () => void;
    save: () => Promise<boolean>;
    addKpi: () => void;
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
                const { name, description } = response.data;
                set({ vm: { name, description }, isLoading: false, loaded: true, id });
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
        return true;
    },
}));

export default useEditKpiGroupStore;