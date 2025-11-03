import { create } from "zustand";
import { TaskStatus } from "@/lib/types/tasksData";

export type TaskFilter = {
  status: TaskStatus | null;
  assigneeId: string | null;
  title: string;
};

export type UseTaskFilterStore = {
  filters: TaskFilter;
  setStatusFilter: (status: TaskStatus | null) => void;
  setAssigneeFilter: (assigneeId: string | null) => void;
  setTitleFilter: (title: string) => void;
  clearFilters: () => void;
};

const defaultFilters: TaskFilter = {
  status: null,
  assigneeId: null,
  title: "",
};

export const useTaskFilterStore = create<UseTaskFilterStore>((set) => ({
  filters: defaultFilters,
  setStatusFilter: (status) =>
    set((state) => ({
      filters: { ...state.filters, status },
    })),
  setAssigneeFilter: (assigneeId) =>
    set((state) => ({
      filters: { ...state.filters, assigneeId },
    })),
  setTitleFilter: (title) =>
    set((state) => ({
      filters: { ...state.filters, title },
    })),
  clearFilters: () =>
    set({
      filters: defaultFilters,
    }),
}));
