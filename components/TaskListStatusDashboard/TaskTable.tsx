"use client"

import { useEffect, useMemo, useState } from "react"
import { TaskDataItem } from "@/lib/types/tasksData"
import { taskButtonStatusConfig } from "@/app/task-detail/[id]/components/TaskDetailSidePanel"
import { AnimatedDropdown } from "@/components/AnimatedDropdown"

interface ServerPaginationMeta {
  page: number
  limit: number
  total: number
  sort?: 'asc' | 'desc'
  onPageChange: (nextPage: number) => void
  onSortChange?: (sort: 'asc' | 'desc') => void
}

interface TaskTableProps {
  tasks: TaskDataItem[]
  onView: (taskId: string) => void
  pageSize?: number
  serverMeta?: ServerPaginationMeta
}

export const TaskTable = ({ tasks, onView, pageSize = 2, serverMeta }: TaskTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalItems = serverMeta ? serverMeta.total : tasks.length
  const totalPages = Math.max(1, Math.ceil(totalItems / (serverMeta ? serverMeta.limit : pageSize)))

  // Reset to page 1 when tasks change (e.g., filters applied)
  useEffect(() => {
    if (!serverMeta) {
      setCurrentPage(1)
    }
  }, [tasks, serverMeta])

  const paginatedTasks = useMemo(() => {
    if (serverMeta) return tasks
    const start = (currentPage - 1) * pageSize
    return tasks.slice(start, start + pageSize)
  }, [tasks, currentPage, pageSize, serverMeta])

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Tasks</h2>
        <div className="flex items-center gap-2">
          {serverMeta && (
            <div className="min-w-[180px]">
              <AnimatedDropdown
                label="Sort by"
                value={serverMeta.sort || 'desc'}
                placeholder="Select sort"
                options={[
                  { value: 'desc', label: 'Newest' },
                  { value: 'asc', label: 'Oldest' },
                ]}
                onSelect={(value) => serverMeta.onSortChange?.((value as 'asc' | 'desc') || 'desc')}
                variant="compact"
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="min-w-full text-left align-middle">
          <thead className="bg-gray -50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            <tr>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">taskId</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Title</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Assignee</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">taskType</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-slate-700 text-foreground">
            {totalItems === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No tasks
                </td>
              </tr>
            )}
            {paginatedTasks.map((task) => {

              const selectedConfig = taskButtonStatusConfig[task?.status || ''];

              return  (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-4 py-3 align-top text-sm text-gray-700 dark:text-gray-300">{task?.id}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700 dark:text-gray-300">
                    <div className={`
                      w-full ${selectedConfig?.bgColor} ${selectedConfig?.hoverColor}
                      text-white px-4 py-2.5 rounded-md font-medium text-sm
                      transition-all duration-200
                      flex items-center justify-between
                      active:scale-[0.98]
                      shadow-sm
                    `}>
                      <span>{selectedConfig?.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base font-medium line-clamp-2">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm truncate max-w-[120px] sm:max-w-none">{task.assignee?.name ?? '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 capitalize">
                      {task.taskType}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <button
                      onClick={() => onView(task.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm transition-all"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3">
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          {serverMeta ? (
            <>Showing {totalItems === 0 ? 0 : (serverMeta.page - 1) * serverMeta.limit + 1}-{Math.min(serverMeta.page * serverMeta.limit, totalItems)} of {totalItems}</>
          ) : (
            <>Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems}</>
          )}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => serverMeta ? serverMeta.onPageChange(Math.max(1, serverMeta.page - 1)) : setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={serverMeta ? serverMeta.page === 1 : currentPage === 1}
            className="px-3 py-1.5 rounded-md border border-border dark:border-slate-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700/40"
          >
            Previous
          </button>
          <div className="text-sm tabular-nums">
            {serverMeta ? serverMeta.page : currentPage} / {totalPages}
          </div>
          <button
            onClick={() => serverMeta ? serverMeta.onPageChange(Math.min(totalPages, (serverMeta.page + 1))) : setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={serverMeta ? serverMeta.page === totalPages : currentPage === totalPages}
            className="px-3 py-1.5 rounded-md border border-border dark:border-slate-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700/40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}


