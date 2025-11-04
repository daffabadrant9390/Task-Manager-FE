"use client"

import { useState } from "react"
import { TaskDataItem } from "@/lib/types/tasksData"
import TaskStatusCard from "./TaskStatusCard"
import { useSelectedTaskStore } from "./store/useSelectedTaskStore"
import { useShallow } from "zustand/shallow"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"


interface TaskStatusColumnProps {
  title: string
  count: number
  tasks: TaskDataItem[]
  columnColor: string
  badgeColor: string
}

export default function TaskStatusColumn({
  title,
  count,
  tasks,
  columnColor,
  badgeColor,
}: TaskStatusColumnProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  const { selectedTaskId, setSelectedTaskId } = useSelectedTaskStore(useShallow((state) => ({
    selectedTaskId: state.selectedTaskId,
    setSelectedTaskId: state.setSelectedTaskId,
  })));

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    router.push(`/task-detail/${taskId}`);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full ${columnColor} rounded-xl p-3 sm:p-4 md:p-5 flex flex-col ${isExpanded ? 'min-h-[400px]' : 'h-auto'}`}>
      {/* Column Header */}
      <button
        onClick={toggleExpand}
        className="flex items-center justify-between mb-3 sm:mb-4 shrink-0 w-full group hover:opacity-80 transition-opacity"
        aria-label={isExpanded ? `Collapse ${title} column` : `Expand ${title} column`}
      >
        <div className="flex items-center gap-2 min-w-0 cursor-pointer">
          <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">{title}</h2>
          <span className={`${badgeColor} px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium shrink-0`}>{count}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isExpanded ? (
            <ChevronUp className="cursor-pointerw-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
          ) : (
            <ChevronDown className="cursor-pointer w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
          )}
        </div>
      </button>

      {/* Tasks Container */}
      {isExpanded && (
        <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto overflow-x-hidden min-h-0 max-h-[calc(100vh-300px)] scrollbar-hide">
          {tasks?.length > 0 ? (
            tasks.map((task) => (
            <TaskStatusCard
              key={task?.id}
              task={task}
              isSelected={selectedTaskId === task?.id}
              onSelect={() => handleTaskSelect(task?.id)}
            />
            ))
          ) : (
            <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
              No tasks
            </div>
          )}
        </div>
      )}
    </div>
  )
}
