import useSWR from "swr";
import { taskService } from "../services/task.service";
import { TasksData, TaskDataItem } from "../types/tasksData";

function fetcher() {
  return taskService.getAllTasks();
}

export const useTasks = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/tasks',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Organize tasks by status
  const tasks: TasksData = !!data ? {
    todo: data?.tasks?.filter((taskItem: TaskDataItem) => taskItem?.status === 'todo'),
    inProgress: data?.tasks?.filter((taskItem: TaskDataItem) => taskItem?.status === 'inProgress'),
    done: data?.tasks?.filter((taskItem: TaskDataItem) => taskItem?.status === 'done'),
  } : {
    todo: [],
    inProgress: [],
    done: [],
  };

  return {
    tasks,
    error,
    isLoading,
    mutate, // Use this to refresh tasks after mutation
  };
}