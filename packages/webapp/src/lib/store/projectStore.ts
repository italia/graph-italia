import { create } from "zustand";
import type { Project } from "../api";

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProjectId: (id: string | null) => void;
  init: () => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProjectId: localStorage.getItem("currentProjectId"),
  setProjects: (projects) => set({ projects }),
  setCurrentProjectId: (id) => {
    if (id) {
      localStorage.setItem("currentProjectId", id);
    } else {
      localStorage.removeItem("currentProjectId");
    }
    set({ currentProjectId: id });
  },
  init: () => {
    set({ currentProjectId: localStorage.getItem("currentProjectId") });
  },
}));

export default useProjectStore;
