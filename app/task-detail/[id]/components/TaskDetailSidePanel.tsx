import { TaskDataItem, TaskStatus } from "@/lib/types/tasksData";
import { TaskButtonConfig } from "../../types/types";
import { ChevronDown } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { getTaskStatusAvailableOptions } from "../helpers";
import { twMerge } from "tailwind-merge";
import { useTaskStore } from "@/lib/store/useTaskStore";

export interface TaskDetailSidePanelProps {
  selectedTaskData: TaskDataItem;
}

export const taskButtonStatusConfig: Record<TaskStatus, TaskButtonConfig> = {
  todo: { label: "To Do", bgColor: "bg-gray-400", hoverColor: "hover:bg-gray-500" },
  inProgress: { label: "In Progress", bgColor: "bg-blue-600", hoverColor: "hover:bg-blue-700" },
  done: { label: "Done", bgColor: "bg-green-500", hoverColor: "hover:bg-green-600" },
}

export const TaskDetailSidePanel = ({ selectedTaskData }: TaskDetailSidePanelProps) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const selectedConfig = taskButtonStatusConfig[selectedTaskData?.status || ''];
  const { updateTaskStatus } = useTaskStore();

  const availableStatusOptions = useMemo(() => {
    return getTaskStatusAvailableOptions(selectedTaskData?.status);
  }, [selectedTaskData?.status]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false)
      }
    }

    if (isStatusOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isStatusOpen])

  return (
    <div className="fixed right-0 top-0 bottom-0 md:relative md:bottom-auto md:top-auto z-40 w-full md:w-96 bg-white dark:bg-slate-800 md:bg-orange-50 md:dark:bg-slate-800 rounded-t-2xl md:rounded-xl border-t md:border border-border dark:border-slate-700 shadow-2xl md:shadow-none flex flex-col max-h-screen md:max-h-none overflow-hidden">
      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Status Dropdown */}
        <div className="p-4 md:p-6 border-b border-border dark:border-slate-700">
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => {
                if (availableStatusOptions && availableStatusOptions.length > 0) {
                  setIsStatusOpen(!isStatusOpen)
                }
              }}
              className={`
                w-full ${selectedConfig?.bgColor} ${selectedConfig?.hoverColor}
                text-white px-4 py-2.5 rounded-md font-medium text-sm
                transition-all duration-200
                flex items-center justify-between
                active:scale-[0.98]
                shadow-sm
                ${!availableStatusOptions || availableStatusOptions.length === 0 ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <span>{selectedConfig?.label}</span>
              {availableStatusOptions && availableStatusOptions.length > 0 && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {isStatusOpen && availableStatusOptions && availableStatusOptions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 shadow-xl z-50 overflow-hidden">
                {availableStatusOptions?.map((availableStatusItem, idx) => {
                  const optionConfig = taskButtonStatusConfig?.[availableStatusItem];
                  const isLastItem = idx === availableStatusOptions?.length - 1;
                  
                  return (
                    <button
                      key={idx}
                      onClick={async() => {
                        try {
                          await updateTaskStatus(selectedTaskData.id, availableStatusItem);
                        } finally {
                          setIsStatusOpen(false)
                        }
                      }}
                      className={twMerge(
                        "w-full px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 cursor-pointer",
                        "hover:bg-white dark:hover:bg-slate-600",
                        "flex items-center gap-2",
                        idx === 0 && "pt-2.5",
                        isLastItem && "pb-2.5",
                        !isLastItem && "border-b border-gray-200 dark:border-slate-600"
                      )}
                    >
                      <div className={`w-2 h-2 rounded-full ${optionConfig?.bgColor} shrink-0`} />
                      <span className="text-gray-700 dark:text-gray-200">{optionConfig?.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Task Content */}
        <div className="p-4 md:p-6">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground leading-tight wrap-break-word">
              {selectedTaskData?.title || ''}
            </h1>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Description
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedTaskData?.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4 mb-6">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Details
            </h2>
            
            {/* Assignee */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignee</span>
              <div className="flex items-center gap-2">
                {selectedTaskData?.assignee ? (
                  <>
                    <span className="text-sm text-foreground font-medium" title={selectedTaskData.assignee.name}>{selectedTaskData.assignee.name}</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500">Unassigned</span>
                )}
              </div>
            </div>

            {/* Dev Start Date */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dev Start Date</span>
              <span className="text-sm text-foreground font-medium">{selectedTaskData?.startDate || '—'}</span>
            </div>

            {/* Dev End Date */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dev End Date</span>
              <span className="text-sm text-foreground font-medium">{selectedTaskData?.endDate || '—'}</span>
            </div>

            {/* Dev Effort */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dev Effort</span>
              <span className="text-sm text-foreground font-medium">{selectedTaskData?.effort || 0} {selectedTaskData?.effort === 1 ? 'day' : 'days'}</span>
            </div>

            {/* Project ID (Parent Story) */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Project ID</span>
              <span className="text-sm text-foreground font-medium">{selectedTaskData?.projectId || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}