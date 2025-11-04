import { api } from './api/client';
import { TaskDataItem } from '@/lib/types/tasksData';

export interface CreateTaskRequest {
  title: string;
  description: string;
  status?: 'todo' | 'inProgress' | 'done';
  projectId?: string;
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
  projectId?: string;
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
}

export const taskService = {
  // Get all the tasks without filter
  getAllTasks: async(): Promise<TasksResponse> => {
    return api.get<TasksResponse>('/api/tasks');
  },

  // Get single task by ID (directly from BE)
  getTaskById: async(id: string): Promise<TaskDataItem> => {
    return api.get<TaskDataItem>(`/api/tasks/${id}`);
  },

  // Create a new task
  createTask: async(taskRequestParams: CreateTaskRequest): Promise<TaskDataItem> => {
    return api.post<TaskDataItem>('/api/tasks', taskRequestParams)
  },

  // Update task
  updateTask: async (id: string, task: UpdateTaskRequest): Promise<TaskDataItem> => {
    return api.put<TaskDataItem>(`/api/tasks/${id}`, task);
  },

  // Update only task status
  updateTaskStatus: async (id: string, payload: UpdateTaskStatusRequest): Promise<TaskDataItem> => {
    return api.patch<TaskDataItem>(`/api/tasks/${id}/status`, payload);
  },

  // Delete task
  deleteTask: async (id: string): Promise<{ message: string; id: string }> => {
    return api.delete<{ message: string; id: string }>(`/api/tasks/${id}`);
  },
}