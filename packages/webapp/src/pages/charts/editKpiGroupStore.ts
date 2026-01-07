import { create } from 'zustand';
import * as api from "../../lib/api";

interface EditKpyGroupActions {
    load: (id: string) => void;
    reload: () => void;
    save: () => Promise<boolean>;
}

type EditKpyGroupState = {
    vm: { name: string; description: string };
    isLoading: boolean;
    loaded: boolean;
    error?: {
        message: string;
    };
}

type EditKpiGroupStore = EditKpyGroupActions & EditKpyGroupState;

const useEditKpiGroupStore = create<EditKpiGroupStore>()((set, get) => ({
    vm: { name: '', description: '' },
    isLoading: true,
    loaded: false,
    load: async (id: string) => {
        try {
            const response = await api.getKpiGroup({ id });
            if (response && response.data) {
                console.log(response.data);
                const { name, description } = response.data;
                set({ vm: { name, description }, isLoading: false, loaded: true });
            }
        } catch (error) { }
    },
    reload: async () => { },
    save: async () => {
        return true;
    },
}));

export default useEditKpiGroupStore;