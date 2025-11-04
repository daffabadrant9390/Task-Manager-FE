"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTaskForm } from "../../lib/hooks/useTaskForm";
import { AnimatedDropdown } from "../AnimatedDropdown";
import { TaskType, TaskDataItem } from "@/lib/types/tasksData";
import { useUsers } from "@/lib/hooks/useUsers";
import { useTaskStore } from "@/lib/store/useTaskStore";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (taskData: TaskDataItem) => void;
  initialTask?: TaskDataItem | null;
}

const TASK_TYPE_OPTIONS: Array<{ value: TaskType; label: string }> = [
  { value: "story", label: "Story" },
  { value: "subtask", label: "Subtask" },
  { value: "defect", label: "Defect" },
];

export const TaskModal = ({ isOpen, onClose, onSubmit, initialTask }: TaskModalProps) => {
  const isEditMode = !!initialTask;

  const { users: assignableUsers } = useUsers();
  const { tasksData, fetchAllTasks } = useTaskStore();
  
  const {
    formData,
    errors,
    touched,
    updateField,
    markFieldAsTouched,
    resetForm,
    getFormDataForSubmission,
  } = useTaskForm(initialTask);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure stories are loaded when the modal opens so Parent Story has options
  useEffect(() => {
    if (isOpen) {
      fetchAllTasks().catch(() => {});
    }
  }, [isOpen, fetchAllTasks]);

  const assigneeOptions = assignableUsers?.map((userItem) => ({
    value: userItem?.id || '',
    label: userItem?.name || '',
  }))

  // Get all story tasks for parent selection (only for subtask/defect)
  const storyOptions = [
    ...tasksData.todo,
    ...tasksData.inProgress,
    ...tasksData.done,
  ]
    .filter((t) => t.taskType === 'story')
    .map((t) => ({ value: t.id, label: `${t.id} · ${t.title}` }))

  // Reset form when modal closes (only if not in edit mode or when closing)
  useEffect(() => {
    if (!isOpen) {
      if (!isEditMode) {
        resetForm();
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSubmitting(false);
    }
  }, [isOpen, resetForm, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    Object.keys(formData).forEach((key) => {
      markFieldAsTouched(key as keyof typeof errors);
    });

    const submissionData = getFormDataForSubmission(isEditMode);
    
    if (submissionData) {
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit({
          id: submissionData?.id || '',
          title: submissionData?.title || '',
          description: submissionData?.description || '',
          assignee: {
            id: submissionData?.assignee?.id || '',
            name: submissionData?.assignee?.name || '',
          },
          startDate: submissionData?.startDate || '',
          endDate: submissionData?.endDate || '',
          taskType: submissionData?.taskType || '',
          status: submissionData?.status || 'todo',
          projectId: submissionData?.projectId ?? null,
          effort: submissionData?.effort || 0,
          priority: submissionData?.priority || 'low',
        });
      } else {
        // Default behavior: log to console
        console.log(isEditMode ? "Task updated:" : "Task created:", submissionData);
      }
      
      // Close modal and reset form
      setTimeout(() => {
        onClose();
        if (!isEditMode) {
          resetForm();
        }
        setIsSubmitting(false);
      }, 300);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with animation */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`
            bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] 
            overflow-hidden flex flex-col pointer-events-auto transform transition-all duration-300
            ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-700 bg-white dark:bg-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isEditMode ? "Edit Task" : "Create New Task"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isEditMode 
                  ? "Update the task details below" 
                  : "Fill in the details to create a new task"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Title
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  onBlur={() => markFieldAsTouched("title")}
                  className={`
                    w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-700 
                    text-foreground placeholder-gray-400 dark:placeholder-gray-500 
                    focus:outline-none transition-all duration-200
                    ${errors.title && touched.title
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "border-border dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }
                  `}
                />
                {errors.title && touched.title && (
                  <p className="mt-1.5 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Type Dropdown */}
              <AnimatedDropdown
                label="Type"
                value={formData.type}
                placeholder="Select task type"
                options={TASK_TYPE_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
                error={touched.type ? errors.type : undefined}
                onSelect={(value) => {
                  const newType = value as TaskType;
                  updateField("type", newType);
                  // Clear projectId when switching to story
                  if (newType === "story") {
                    updateField("projectId", null);
                  }
                  markFieldAsTouched("type");
                }}
                onBlur={() => markFieldAsTouched("type")}
              />

              {/* Parent Story (only for Subtask/Defect) */}
              {(formData.type === 'subtask' || formData.type === 'defect') && (
                <AnimatedDropdown
                  label="Parent Story"
                  value={formData.projectId || null}
                  placeholder="Select parent story"
                  options={storyOptions}
                  error={touched.projectId ? errors.projectId : undefined}
                  onSelect={(value) => {
                    updateField("projectId", (value as string) || null);
                    markFieldAsTouched("projectId");
                  }}
                  onBlur={() => markFieldAsTouched("projectId")}
                />
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Description
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  placeholder="Enter task description..."
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  onBlur={() => markFieldAsTouched("description")}
                  rows={4}
                  className={`
                    w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-700 
                    text-foreground placeholder-gray-400 dark:placeholder-gray-500 
                    focus:outline-none transition-all duration-200 resize-none
                    ${errors.description && touched.description
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "border-border dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }
                  `}
                />
                {errors.description && touched.description && (
                  <p className="mt-1.5 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Assignee Dropdown */}
              <AnimatedDropdown
                label="Assignee"
                value={formData.assignee?.id || null}
                placeholder="Select assignee"
                options={assigneeOptions}
                error={touched.assignee ? errors.assignee : undefined}
                onSelect={(value) => {
                  const assignee = assignableUsers?.find((assigneeItem) => assigneeItem?.id === value);
                  if (!!assignee) {
                    updateField("assignee", {
                      id: assignee?.id || '',
                      name: assignee?.name || '',
                    });
                    markFieldAsTouched("assignee");
                  }
                }}
                onBlur={() => markFieldAsTouched("assignee")}
              />

              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Start Date
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      updateField("startDate", e.target.value);
                      // Clear end date error if start date is set
                      if (errors.endDate && formData.endDate >= e.target.value) {
                        const newErrors = { ...errors };
                        delete newErrors.endDate;
                      }
                    }}
                    onBlur={() => markFieldAsTouched("startDate")}
                    min={new Date().toISOString().split("T")[0]}
                    className={`
                      w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-700 
                      text-foreground focus:outline-none transition-all duration-200
                      ${errors.startDate && touched.startDate
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-border dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }
                    `}
                  />
                  {errors.startDate && touched.startDate && (
                    <p className="mt-1.5 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    End Date
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      updateField("endDate", e.target.value);
                      // Clear error if end date is after start date
                      if (errors.endDate && formData.startDate && e.target.value >= formData.startDate) {
                        const newErrors = { ...errors };
                        delete newErrors.endDate;
                      }
                    }}
                    onBlur={() => markFieldAsTouched("endDate")}
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                    className={`
                      w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-700 
                      text-foreground focus:outline-none transition-all duration-200
                      ${errors.endDate && touched.endDate
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-border dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }
                    `}
                  />
                  {errors.endDate && touched.endDate && (
                    <p className="mt-1.5 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-border dark:border-slate-600 rounded-lg 
                  bg-white dark:bg-slate-700 text-foreground font-semibold 
                  hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                  disabled:cursor-not-allowed text-white font-semibold rounded-lg 
                  transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
              >
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update Task" : "Create Task")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
