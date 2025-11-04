import { useState, useCallback, useEffect } from "react";
import { TaskType, Assignee, TaskDataItem } from "@/lib/types/tasksData";
import { generateTaskId } from "@/lib/utils/taskIdGenerator";
import { parseDateString } from "@/lib/utils/dateUtils";

export interface TaskFormData {
  title: string;
  description: string;
  assignee: Assignee | null;
  startDate: string;
  endDate: string;
  type: TaskType | "";
  projectId: string | null;
}

export interface FormErrors {
  title?: string;
  description?: string;
  assignee?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  projectId?: string;
}

export function useTaskForm(initialData?: TaskDataItem | null) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    assignee: initialData?.assignee || null,
    startDate: initialData ? parseDateString(initialData.startDate) : "",
    endDate: initialData ? parseDateString(initialData.endDate) : "",
    type: initialData?.taskType || "",
    projectId: initialData?.projectId ?? null,
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        assignee: initialData.assignee || null,
        startDate: parseDateString(initialData.startDate),
        endDate: parseDateString(initialData.endDate),
        type: initialData.taskType || "",
        projectId: initialData.projectId ?? null,
      });
    } else {
      // Reset form when initialData becomes null/undefined (switching from edit to create)
      setFormData({
        title: "",
        description: "",
        assignee: null,
        startDate: "",
        endDate: "",
        type: "",
        projectId: null,
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = "Task type is required";
    }

    // projectId validation: required only for subtask/defect
    if (formData.type === "subtask" || formData.type === "defect") {
      if (!formData.projectId || !String(formData.projectId).trim()) {
        newErrors.projectId = "Parent story is required";
      }
    }

    // Assignee validation
    if (!formData.assignee) {
      newErrors.assignee = "Assignee is required";
    }

    // Start date validation
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    // End date validation
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const updateField = useCallback(<K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[field as keyof FormErrors]) {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const markFieldAsTouched = useCallback((field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      assignee: null,
      startDate: "",
      endDate: "",
      type: "",
      projectId: null,
    });
    setErrors({});
    setTouched({});
  }, []);

  const getFormDataForSubmission = useCallback((isEdit: boolean = false) => {
    if (!validate()) {
      return null;
    }

    return {
      id: isEdit && initialData ? initialData.id : generateTaskId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignee: formData.assignee!,
      startDate: formData.startDate,
      endDate: formData.endDate,
      taskType: formData.type as TaskType,
      projectId: (formData.type === "story") ? null : (formData.projectId ? String(formData.projectId) : null),
      ...(isEdit && initialData ? {
        status: initialData.status,
        effort: initialData.effort,
        priority: initialData.priority,
      } : {}),
    };
  }, [formData, validate, initialData]);

  return {
    formData,
    errors,
    touched,
    updateField,
    markFieldAsTouched,
    validate,
    resetForm,
    getFormDataForSubmission,
  };
}

