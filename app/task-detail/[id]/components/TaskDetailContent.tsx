import { TaskDataItem, TaskStatus, TaskType } from "@/lib/types/tasksData";

const statusConfig: Record<TaskStatus, { label: string; bgColor: string }> = {
  todo: { label: "To Do", bgColor: "bg-gray-500" },
  inProgress: { label: "In Progress", bgColor: "bg-blue-500" },
  done: { label: "Done", bgColor: "bg-green-500" },
};

const taskTypeConfig: Record<TaskType, { label: string; bgColor: string }> = {
  story: { label: "Story", bgColor: "bg-blue-600" },
  defect: { label: "Defect", bgColor: "bg-red-600" },
  subtask: { label: "Subtask", bgColor: "bg-teal-600" },
};

export interface TaskDetailContentProps {
  taskData: TaskDataItem;
}

export const TaskDetailContent = ({ taskData }: TaskDetailContentProps) => {
  const currentStatus = statusConfig[taskData.status];
  const currentTaskType = taskTypeConfig[taskData.taskType];

  return (
    <div className="flex flex-col flex-1 gap-6 max-w-4xl">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        {/* Task Key, Type, and Status Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {taskData.projectId}
          </span>
          <span
            className={`px-2 py-1 rounded text-sm font-semibold text-white ${currentTaskType.bgColor}`}
          >
            {currentTaskType.label}
          </span>
          <span
            className={`px-2.5 py-1 rounded text-sm font-semibold text-white ${currentStatus.bgColor}`}
          >
            {currentStatus.label}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-foreground leading-tight">
          {taskData.title}
        </h1>
      </div>

      {/* Description Section */}
      <div className="flex flex-col gap-3 w-full h-full">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Description
        </h2>
        <div className="w-full h-full bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {taskData.description || "No description provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

