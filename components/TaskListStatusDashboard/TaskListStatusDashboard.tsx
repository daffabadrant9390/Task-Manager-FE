"use client"

import { Plus } from "lucide-react"
import TaskStatusColumn from "./TaskStatusColumn"
import TaskFilter from "./TaskFilter"
import { TasksData, TaskDataItem } from "@/lib/types/tasksData"
import { useTaskFilterStore } from "./store/useTaskFilterStore"
import { useShallow } from "zustand/shallow"
import { filterTasks } from "./lib/filterTasks"
import { useMemo } from "react"

interface DashboardProps {
  tasks: TasksData;
  onCreateTask: () => void
}

export const TaskListStatusDashboard = ({ tasks, onCreateTask }: DashboardProps) => {
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
      <div className="shrink-0 mb-4">
        <TaskFilter allTasks={allTasks} />
      </div>



      {/* Kanban Board */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 scrollbar-hide">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          <TaskStatusColumn
            title="To do"
            count={filteredTasks.todo.length}
            tasks={filteredTasks.todo}
            columnColor="bg-blue-50 dark:bg-slate-800"
            badgeColor="bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300"
          />
          <TaskStatusColumn
            title="In progress"
            count={filteredTasks.inProgress.length}
            tasks={filteredTasks.inProgress}
            columnColor="bg-amber-50 dark:bg-slate-800"
            badgeColor="bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-amber-300"
          />
          <TaskStatusColumn
            title="Done"
            count={filteredTasks.done.length}
            tasks={filteredTasks.done}
            columnColor="bg-green-50 dark:bg-slate-800"
            badgeColor="bg-green-100 dark:bg-slate-700 text-green-700 dark:text-green-300"
          />
        </div>
      </div>
    </div>
  )
}
