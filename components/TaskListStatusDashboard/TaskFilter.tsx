"use client"

import { useState, useRef, useEffect } from "react"
import { Filter, X, ChevronDown, Search } from "lucide-react"
import { useTaskFilterStore } from "./store/useTaskFilterStore"
import { useShallow } from "zustand/shallow"
import { TaskStatus, TaskDataItem, Assignee } from "@/lib/types/tasksData"
import { useUsers } from "@/lib/hooks/useUsers"
import { AnimatedDropdown } from "../AnimatedDropdown"
import { ServerPaginationMeta } from "./TaskTable"

interface TaskFilterProps {
  allTasks: TaskDataItem[];
  serverMeta?: ServerPaginationMeta;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "inProgress", label: "In progress" },
  { value: "done", label: "Done" },
]

export default function TaskFilter({ allTasks, serverMeta }: TaskFilterProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false)
  const { users: fetchedUsers } = useUsers()
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const assigneeDropdownRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const { filters, setStatusFilter, setAssigneeFilter, setTitleFilter, clearFilters } =
    useTaskFilterStore(
      useShallow((state) => ({
        filters: state.filters,
        setStatusFilter: state.setStatusFilter,
        setAssigneeFilter: state.setAssigneeFilter,
        setTitleFilter: state.setTitleFilter,
        clearFilters: state.clearFilters,
      }))
    )

  // Derive unique assignees from currently provided tasks as a fallback
  const fallbackAssignees: Assignee[] = Array.from(
    new Map<string, Assignee>(
      allTasks
        .filter((task): task is TaskDataItem & { assignee: Assignee } => !!task.assignee)
        .map((task) => [task.assignee.id, task.assignee])
    ).values()
  )

  // Prefer fetched users; fall back to current-page assignees when unavailable
  const allAssignees: Assignee[] = (fetchedUsers && fetchedUsers.length > 0)
    ? [...fetchedUsers].sort((a, b) => a.name.localeCompare(b.name))
    : fallbackAssignees

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false)
      }
      if (assigneeDropdownRef.current && !assigneeDropdownRef.current.contains(event.target as Node)) {
        setIsAssigneeOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedStatus = statusOptions.find((opt) => opt.value === filters.status)
  const selectedAssignee = allAssignees.find((assignee) => assignee?.id === filters.assigneeId)

  const hasActiveFilters = filters.status || filters.assigneeId || filters.title.trim()

  return (
    <div className="mb-4" ref={filterRef}>
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
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
        {/* Filter Label */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Status Filter */}
          <div className="relative shrink-0" ref={statusDropdownRef}>
            <button
              onClick={() => {
                setIsStatusOpen(!isStatusOpen)
                setIsAssigneeOpen(false)
              }}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                flex items-center gap-2 cursor-pointer
                ${
                  filters.status
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                    : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"
                }
              `}
            >
              <span>{selectedStatus?.label || "Status"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
              {filters.status && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setStatusFilter(null)
                  }}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </button>

            {isStatusOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 shadow-lg z-50 min-w-[150px] w-max">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(filters.status === option.value ? null : option.value)
                      setIsStatusOpen(false)
                    }}
                    className={`
                      w-full px-3 py-2 text-left text-sm transition-colors whitespace-nowrap cursor-pointer
                      ${option.value === statusOptions[0].value ? "rounded-t-lg" : ""}
                      ${option.value === statusOptions[statusOptions.length - 1].value ? "rounded-b-lg" : ""}
                      ${
                        filters.status === option.value
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assignee Filter */}
          <div className="relative shrink-0" ref={assigneeDropdownRef}>
            <button
              onClick={() => {
                setIsAssigneeOpen(!isAssigneeOpen)
                setIsStatusOpen(false)
              }}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                flex items-center gap-2 cursor-pointer
                ${
                  filters.assigneeId
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                    : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"
                }
              `}
            >
              <span>{selectedAssignee?.name || "Assignee"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isAssigneeOpen ? "rotate-180" : ""}`} />
              {filters.assigneeId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setAssigneeFilter(null)
                  }}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </button>

            {isAssigneeOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 shadow-lg z-50 min-w-[200px] w-max max-w-[calc(100vw-2rem)] max-h-[300px] overflow-y-auto scrollbar-hide">
                {allAssignees.length > 0 ? (
                  allAssignees.map((assignee) => (
                    <button
                      key={assignee.id}
                      onClick={() => {
                        setAssigneeFilter(filters.assigneeId === assignee.id ? null : assignee.id)
                        setIsAssigneeOpen(false)
                      }}
                      className={`
                        w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center gap-3 cursor-pointer
                        ${
                          filters.assigneeId === assignee.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"
                        }
                      `}
                    >
                      <span className="font-medium truncate">{assignee.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No assignees</div>
                )}
              </div>
            )}
          </div>

          {/* Title Search Filter */}
          <div className="relative flex-1 min-w-0 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.title}
              onChange={(e) => setTitleFilter(e.target.value)}
              className={`
                w-full pl-10 pr-8 py-1.5 rounded-lg text-sm
                bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300
                border ${
                  filters.title.trim()
                    ? "border-blue-300 dark:border-blue-700"
                    : "border-gray-300 dark:border-slate-600"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                placeholder-gray-400 dark:placeholder-gray-500
              `}
            />
            {filters.title.trim() && (
              <button
                onClick={() => setTitleFilter("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
