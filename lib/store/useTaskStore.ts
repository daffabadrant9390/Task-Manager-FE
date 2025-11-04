import { create } from "zustand";
import { TasksData, TaskDataItem } from "@/lib/types/tasksData";
import { taskService } from "../services/task.service";

export type UseTaskStore = {
  tasksData: TasksData;
  isLoading: boolean;
  error: Nullish<string>;
  lastUpdatedAt: number;
  fetchAllTasks: () => Promise<void>;
  addNewTask: (task: TaskDataItem) => Promise<void>;
  updateTask: (taskId: string, updatedTask: Partial<TaskDataItem>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskDataItem['status']) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTaskById: (taskId: string) => Promise<TaskDataItem>;
};

export const useTaskStore = create<UseTaskStore>((set, get) => ({
  tasksData: {
    todo: [],
    inProgress: [],
    done: []
  },
  isLoading: false,
  error: null,
  lastUpdatedAt: 0,
  fetchAllTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getAllTasks();

      // Organize tasks by status with safe defaults to avoid undefined entries
      const source = response?.tasks ?? [];
      const organizedTasks: TasksData = {
        todo: source.filter((taskItem) => taskItem?.status === 'todo') ?? [],
        inProgress: source.filter((taskItem) => taskItem?.status === 'inProgress') ?? [],
        done: source.filter((taskItem) => taskItem?.status === 'done') ?? [],
      };

      set({ tasksData: organizedTasks, isLoading: false });
    } catch(error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false 
      });
    }
  },

  addNewTask: async (task: TaskDataItem) => {
    // Create then refresh current list to keep local state in sync with server
    try {
      await taskService.createTask({
        title: task?.title,
        description: task?.description,
        status: task?.status,
        projectId: task?.projectId,
        assignee: {
          id: task?.assignee?.id || '',
          name: task?.assignee?.name || '',
        },
        startDate: task?.startDate,
        endDate: task?.endDate,
        effort: task?.effort,
        priority: task?.priority,
        taskType: task.taskType,
      });
      
      // Refresh tasks after creating a new task
      await get().fetchAllTasks();
      set({ lastUpdatedAt: Date.now() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create task' });
      throw error;
    }
  },
  
  updateTask: async(taskId: string, updatedTask: Partial<TaskDataItem>) => {
    try {
      await taskService.updateTask(taskId, updatedTask);

      // Refresh tasks after updating a task
      await get().fetchAllTasks();
      set({ lastUpdatedAt: Date.now() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update task' });
      throw error;
    }
  },

  updateTaskStatus: async(taskId: string, status: TaskDataItem['status']) => {
    try {
      await taskService.updateTaskStatus(taskId, { status });

      // Refresh tasks after updating status
      await get().fetchAllTasks();
      set({ lastUpdatedAt: Date.now() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update task status' });
      throw error;
    }
  },

  deleteTask: async(taskId) => {
    try {
      await taskService.deleteTask(taskId);

      // Refresh tasks after deleting a task
      await get().fetchAllTasks();
      set({ lastUpdatedAt: Date.now() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete task' });
      throw error;
    }
  },
  
  getTaskById: async(taskId: string) => {
    try {
      const response = await taskService.getTaskById(taskId);
      return response;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get task' });
      throw error;
    }
  }
}));
