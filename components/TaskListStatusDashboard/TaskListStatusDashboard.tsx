"use client"

import { Plus } from "lucide-react"
import TaskStatusColumn from "./TaskStatusColumn"
import TaskFilter from "./TaskFilter"
import { TasksData } from "@/lib/types/tasksData"
import { useTaskFilterStore } from "./store/useTaskFilterStore"
import { useShallow } from "zustand/shallow"
import { filterTasks } from "./lib/filterTasks"
import { useMemo } from "react"
import { useRouter } from "next/navigation"
import {TaskTable} from "./TaskTable"

interface DashboardProps {
  tasks: TasksData;
  onCreateTask: () => void
}

export const TaskListStatusDashboard = ({ tasks, onCreateTask }: DashboardProps) => {
  const router = useRouter()
  const { filters } = useTaskFilterStore(
    useShallow((state) => ({
      filters: state.filters,
    }))
  )

  // Get all tasks for filter component (to extract unique assignees)
  const allTasks = useMemo(() => {
    return [...tasks.todo, ...tasks.inProgress, ...tasks.done]
  }, [tasks])

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, filters)
  }, [tasks, filters])

  const filteredTasksFlat = useMemo(() => {
    return [
      ...filteredTasks.todo,
      ...filteredTasks.inProgress,
      ...filteredTasks.done,
    ]
  }, [filteredTasks])

  // Table pagination handled inside TaskTable

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Header with Title and New Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 shrink-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Boards</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateTask}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">New task</span>
            <span className="sm:hidden text-sm">New</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="shrink-0 mb-4 ">
        <TaskFilter allTasks={allTasks} />
      </div>

      {/* Table View (Pagination-ready) */}
      <TaskTable
        tasks={filteredTasksFlat}
        onView={(id) => router.push(`/task-detail/${id}`)}
      />
    </div>
  )
}
