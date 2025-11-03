import { create } from "zustand";
import { TasksData, TaskDataItem } from "@/lib/types/tasksData";
import { MockTasksData } from "@/lib/mocks/MockTasksData";

export type UseTaskStore = {
  tasks: TasksData;
  addTask: (task: TaskDataItem) => void;
  updateTask: (taskId: string, updatedTask: Partial<TaskDataItem>) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => TaskDataItem | undefined;
};

export const useTaskStore = create<UseTaskStore>((set, get) => ({
  tasks: MockTasksData,
  
  addTask: (task) =>
    set((state) => {
      const newTasks = { ...state.tasks };
      newTasks[task.status] = [...newTasks[task.status], task];
      return { tasks: newTasks };
    }),
  
  updateTask: (taskId, updatedTask) =>
    set((state) => {
      const newTasks: TasksData = {
        todo: [...state.tasks.todo],
        inProgress: [...state.tasks.inProgress],
        done: [...state.tasks.done],
      };
      
      // Find and update the task in the appropriate status array
      const statuses: Array<keyof TasksData> = ["todo", "inProgress", "done"];
      for (const status of statuses) {
        const taskIndex = newTasks[status].findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          const oldTask = newTasks[status][taskIndex];
          const updatedTaskData = { ...oldTask, ...updatedTask };
          
          // If status changed, move task to new status array
          if (updatedTask.status && updatedTask.status !== oldTask.status) {
            newTasks[status].splice(taskIndex, 1);
            newTasks[updatedTask.status].push(updatedTaskData);
          } else {
            newTasks[status][taskIndex] = updatedTaskData;
          }
          break;
        }
      }
      
      return { tasks: newTasks };
    }),
  
  deleteTask: (taskId) =>
    set((state) => {
      const newTasks: TasksData = {
        todo: state.tasks.todo.filter((t) => t.id !== taskId),
        inProgress: state.tasks.inProgress.filter((t) => t.id !== taskId),
        done: state.tasks.done.filter((t) => t.id !== taskId),
      };
      return { tasks: newTasks };
    }),
  
  getTaskById: (taskId) => {
    const state = get();
    const allTasks = [
      ...state.tasks.todo,
      ...state.tasks.inProgress,
      ...state.tasks.done,
    ];
    return allTasks.find((t) => t.id === taskId);
  },
}));
