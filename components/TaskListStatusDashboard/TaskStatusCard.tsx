"use client"

import { TaskDataItem } from "@/lib/types/tasksData"
import Image from "next/image"

const priorityDotColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-blue-500",
  low: "bg-green-500",
}

interface TaskCardProps {
  task: TaskDataItem;
  isSelected: boolean
  onSelect: () => void
}

export default function TaskCard({ task, isSelected, onSelect }: TaskCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 rounded-lg bg-white dark:bg-slate-700 border-2 text-left
        transition-all duration-200 ease-out
        hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500
        active:scale-95 cursor-pointer
        ${isSelected ? "border-blue-500 shadow-lg dark:border-blue-400" : "border-border dark:border-slate-600"}
      `}
    >
      {/* Project ID and Assignees */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${priorityDotColors[task.priority]}`} />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{task.projectId}</span>
        </div>
        {!!task?.assignee && (
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300" title={task?.assignee?.name}>
            {task?.assignee?.name}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-sm md:text-base">{task.title}</h3>

      {/* Description */}
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{task.description}</p>
    </button>
  )
}
