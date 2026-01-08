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

type EditKpiGroupState = {
    id?: string
    vm: { name: string; description: string, kpis: KpiFormValues[] };
    isLoading: boolean;
    loaded: boolean;
    error?: {
        message: string;
    };
    showFormModal?: boolean;
}

type EditKpiGroupStore = EditKpiGroupActions & EditKpiGroupState;

const useEditKpiGroupStore = create<EditKpiGroupStore>()((set, get) => ({
    vm: { name: '', description: '', kpis: [] },
    isLoading: true,
    loaded: false,
    addKpi: () => {
        console.log("add item");
        set({ showFormModal: true });
    },
    saveKpi: (data: KpiFormValues) => {
        const { vm } = get();
        const kpis = [...vm.kpis, data];
        set({ vm: { ...vm, kpis } });
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
                set({ vm: { name, description, kpis: [] }, isLoading: false, loaded: true, id });
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