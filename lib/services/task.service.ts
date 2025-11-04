import { api } from './api/client';
import { TaskDataItem } from '@/lib/types/tasksData';

export interface CreateTaskRequest {
  title: string;
  description: string;
  status?: 'todo' | 'inProgress' | 'done';
  projectId?: string | null;
  assignee: {
    id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  effort?: number;
  priority?: 'high' | 'medium' | 'low';
  taskType: 'story' | 'subtask' | 'defect';
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'inProgress' | 'done';
  projectId?: string | null;
  assignee?: {
    id: string;
    name: string;
  };
  startDate?: string;
  endDate?: string;
  effort?: number;
  priority?: 'high' | 'medium' | 'low';
  taskType?: 'story' | 'subtask' | 'defect';
}

export interface UpdateTaskStatusRequest {
  status: 'todo' | 'inProgress' | 'done';
}

export interface TasksResponse {
  tasks: TaskDataItem[];
  count: number;
  total?: number;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
}

export const taskService = {
  // Get all the tasks without filter
  getAllTasks: async(params?: { page?: number; limit?: number; sort?: 'asc' | 'desc' }): Promise<TasksResponse> => {
    // Build query string defensively to avoid undefined values
    const qp = new URLSearchParams();
    if (params?.page) qp.set('page', String(params.page));
    if (params?.limit) qp.set('limit', String(params.limit));
    if (params?.sort) qp.set('sort', params.sort);
    const qs = qp.toString();
    const endpoint = `/api/tasks${qs ? `?${qs}` : ''}`;
    try {
      const res = await api.get<TasksResponse>(endpoint);
      // Normalize nullable/optional fields with safe defaults
      return {
        tasks: res?.tasks ?? [],
        count: res?.count ?? (res?.tasks?.length ?? 0),
        total: res?.total ?? res?.count ?? (res?.tasks?.length ?? 0),
        page: res?.page ?? params?.page ?? 1,
        limit: res?.limit ?? params?.limit ?? 5,
        sort: res?.sort ?? params?.sort ?? 'desc',
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      throw new Error(message);
    }
  },

  // Get single task by ID (directly from BE)
  getTaskById: async(id: string): Promise<TaskDataItem> => {
    try {
      return await api.get<TaskDataItem>(`/api/tasks/${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch task';
      throw new Error(message);
    }
  },

  // Create a new task
  createTask: async(taskRequestParams: CreateTaskRequest): Promise<TaskDataItem> => {
    try {
      return await api.post<TaskDataItem>('/api/tasks', taskRequestParams)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      throw new Error(message);
    }
  },

  // Update task
  updateTask: async (id: string, task: UpdateTaskRequest): Promise<TaskDataItem> => {
    try {
      return await api.put<TaskDataItem>(`/api/tasks/${id}`, task);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      throw new Error(message);
    }
  },

  // Update only task status
  updateTaskStatus: async (id: string, payload: UpdateTaskStatusRequest): Promise<TaskDataItem> => {
    try {
      return await api.patch<TaskDataItem>(`/api/tasks/${id}/status`, payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task status';
      throw new Error(message);
    }
  },

  // Delete task
  deleteTask: async (id: string): Promise<{ message: string; id: string }> => {
    try {
      return await api.delete<{ message: string; id: string }>(`/api/tasks/${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      throw new Error(message);
    }
  },
}