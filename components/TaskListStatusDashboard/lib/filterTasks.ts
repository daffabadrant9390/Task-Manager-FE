import { TasksData, TaskDataItem, TaskStatus } from "@/lib/types/tasksData";
import { TaskFilter } from "../store/useTaskFilterStore";

export function filterTasks(tasks: TasksData, filters: TaskFilter): TasksData {
  const { status, assigneeId, title } = filters;

  // If no filters are active, return original tasks
  if (!status && !assigneeId && !title.trim()) {
    return tasks;
  }

  const filterTask = (task: TaskDataItem): boolean => {
    // Status filter
    if (status && task.status !== status) {
      return false;
    }

    // Assignee filter
    if (assigneeId && task.assignee?.id !== assigneeId) {
      return false;
    }

    // Title filter (case-insensitive partial match)
    if (title.trim() && !task.title.toLowerCase().includes(title.toLowerCase().trim())) {
      return false;
    }

    return true;
  };

  // Filter each status array
  return {
    todo: tasks.todo.filter(filterTask),
    inProgress: tasks.inProgress.filter(filterTask),
    done: tasks.done.filter(filterTask),
  };
}
