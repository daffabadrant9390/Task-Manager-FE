import useSWR from "swr";
import { taskService, TasksResponse } from "../services/task.service";
import { TasksData, TaskDataItem } from "../types/tasksData";

function makeKey(page?: number, limit?: number, sort?: 'asc' | 'desc') {
  const qp = new URLSearchParams();
  if (page) qp.set('page', String(page));
  if (limit) qp.set('limit', String(limit));
  if (sort) qp.set('sort', sort);
  const qs = qp.toString();
  return `/api/tasks${qs ? `?${qs}` : ''}`;
}

export const useTasks = (params?: { page?: number; limit?: number; sort?: 'asc' | 'desc' }) => {
  const key = makeKey(params?.page, params?.limit, params?.sort);
  const { data, error, isLoading, mutate } = useSWR<TasksResponse>(
    key,
    () => taskService.getAllTasks(params),
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
    meta: {
      total: data?.total ?? 0,
      count: data?.count ?? 0,
      page: data?.page ?? params?.page ?? 1,
      limit: data?.limit ?? params?.limit ?? 5,
      sort: data?.sort ?? params?.sort ?? 'desc',
    },
    error,
    isLoading,
    mutate, // Use this to refresh tasks after mutation
  };
}