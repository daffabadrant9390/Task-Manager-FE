export type TaskStatus = "todo" | "inProgress" | "done";
export type TaskPriority = "high" | "medium" | "low";
export type TaskType = "story" | "subtask" | "defect";

export type Assignee = {
  id: string;
  name: string;
}

export type TaskDataItem = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  assignee: Assignee;
  startDate: string;
  endDate: string;
  effort: number;
  priority: TaskPriority;
  taskType: TaskType;
}


export type TasksData = Record<TaskStatus, TaskDataItem[]>;