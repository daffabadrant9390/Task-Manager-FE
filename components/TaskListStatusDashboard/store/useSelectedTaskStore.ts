import { create } from "zustand";

export type UseSelectedTaskStore = {
  selectedTaskId: Nullish<string>;
  setSelectedTaskId: (taskId: string) => void;
};

export const useSelectedTaskStore = create<UseSelectedTaskStore>((set) => ({
  selectedTaskId: null,
  setSelectedTaskId: (taskId: string) => set({ selectedTaskId: taskId }),
}));