import { TASK_STATUS_AVAILABLE_OPTIONS } from "@/lib/constant";
import { TaskStatus } from "@/lib/types/tasksData";

export const getTaskStatusAvailableOptions = (selectedTaskDataStatus: TaskStatus): TaskStatus[] => {
  // If task is done, no status changes are allowed
  if (selectedTaskDataStatus === 'done') {
    return [];
  }

  // If task is in progress, can only move to done
  if (selectedTaskDataStatus === 'inProgress') {
    return [TASK_STATUS_AVAILABLE_OPTIONS.DONE];
  }

  // If task is todo, can move to inProgress or done
  if (selectedTaskDataStatus === 'todo') {
    return [TASK_STATUS_AVAILABLE_OPTIONS.IN_PROGRESS, TASK_STATUS_AVAILABLE_OPTIONS.DONE];
  }

  // Fallback (should never reach here with proper types)
  return [];
}