"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTaskForm } from "./hooks/useTaskForm";
import { AnimatedDropdown } from "./components/AnimatedDropdown";
import { AVAILABLE_ASSIGNEES } from "@/lib/constants/assignees";
import { TaskType } from "@/lib/types/tasksData";

interface CreateTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (taskData: any) => void;
}

const TASK_TYPE_OPTIONS: Array<{ value: TaskType; label: string }> = [
  { value: "story", label: "Story" },
  { value: "subtask", label: "Subtask" },
  { value: "defect", label: "Defect" },
];

export const CreateNewTaskBottomsheet = ({ isOpen, onClose, onSubmit }: CreateTaskSheetProps) => {
  const {
    formData,
    errors,
    touched,
    updateField,
    markFieldAsTouched,
    validate,
    resetForm,
    getFormDataForSubmission,
  } = useTaskForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when bottomsheet closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setIsSubmitting(false);
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    Object.keys(formData).forEach((key) => {
      markFieldAsTouched(key as keyof typeof errors);
    });

    const submissionData = getFormDataForSubmission();
    
    if (submissionData) {
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(submissionData);
      } else {
        // Default behavior: log to console
        console.log("Task created:", submissionData);
      }
      
      // Close bottomsheet and reset form
      setTimeout(() => {
        onClose();
        resetForm();
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

  const assigneeOptions = AVAILABLE_ASSIGNEES.map((assignee) => ({
    value: assignee.id,
    label: assignee.name,
    avatar: assignee.avatar,
  }));

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

      {/* Bottom Sheet */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 rounded-t-3xl 
          shadow-2xl max-h-[95vh] overflow-hidden flex flex-col transform transition-transform duration-300
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-border dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">Create New Task</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Fill in the details to create a new task
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 ml-4 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4 pb-24">
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
                  w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 
                  text-foreground placeholder-gray-400 dark:placeholder-gray-500 
                  focus:outline-none transition-all duration-200 text-sm
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
                updateField("type", value as TaskType);
                markFieldAsTouched("type");
              }}
              onBlur={() => markFieldAsTouched("type")}
              variant="compact"
            />

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
                rows={3}
                className={`
                  w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 
                  text-foreground placeholder-gray-400 dark:placeholder-gray-500 
                  focus:outline-none transition-all duration-200 resize-none text-sm
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
                const assignee = AVAILABLE_ASSIGNEES.find((a) => a.id === value);
                if (assignee) {
                  updateField("assignee", assignee);
                  markFieldAsTouched("assignee");
                }
              }}
              onBlur={() => markFieldAsTouched("assignee")}
              variant="compact"
            />

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-3">
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
                    w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 
                    text-foreground focus:outline-none transition-all duration-200 text-sm
                    ${errors.startDate && touched.startDate
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "border-border dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }
                  `}
                />
                {errors.startDate && touched.startDate && (
                  <p className="mt-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-200">
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
                    w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 
                    text-foreground focus:outline-none transition-all duration-200 text-sm
                    ${errors.endDate && touched.endDate
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "border-border dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }
                  `}
                />
                {errors.endDate && touched.endDate && (
                  <p className="mt-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-200">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Sticky */}
          <div className="sticky bottom-0 p-4 border-t border-border dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-3 shadow-lg">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border dark:border-slate-600 rounded-lg 
                bg-white dark:bg-slate-700 text-foreground font-semibold text-sm
                hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm
                transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
