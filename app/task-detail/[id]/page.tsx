"use client";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { TaskDetailSidePanel } from "./components/TaskDetailSidePanel";
import { TaskDetailContent } from "./components/TaskDetailContent";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/lib/store/useTaskStore";
import { TaskModal } from "@/components/TaskModal/TaskModal";
import { TaskBottomsheet } from "@/components/TaskModal/TaskBottomsheet";
import { useDeviceType } from "@/lib/hooks/useDeviceType";
import { formatDateString } from "@/lib/utils/dateUtils";

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isMobile } = useDeviceType();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { getTaskById, updateTask, deleteTask } = useTaskStore();

  // Get task from store
  const selectedTaskData = useMemo(() => {
    if (!id || typeof id !== "string") return undefined;
    return getTaskById(id);
  }, [id, getTaskById]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedTaskData) return;
    
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      deleteTask(selectedTaskData.id);
      router.push("/");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (taskData: any) => {
    if (!selectedTaskData) return;

    // Convert dates from YYYY-MM-DD to "30 Oct 2025" format
    const formattedTask = {
      ...taskData,
      startDate: formatDateString(taskData.startDate),
      endDate: formatDateString(taskData.endDate),
      // Preserve existing task properties
      status: selectedTaskData.status,
      projectId: selectedTaskData.projectId,
      effort: selectedTaskData.effort,
      priority: selectedTaskData.priority,
    };

    // Update existing task
    updateTask(selectedTaskData.id, formattedTask);
  };

  if (!selectedTaskData) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-2xl font-bold text-foreground">Task Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">Task with ID &quot;{id}&quot; does not exist.</p>
        <button
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer bg-gray-100 dark:bg-slate-700 rounded-lg px-4 py-2"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Boards</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="w-full h-full flex sm:flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 lg:justify-between">
        <div className="flex flex-col flex-1 gap-6">
          {/* Header with Back Button and Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer bg-gray-100 dark:bg-slate-700 rounded-lg px-4 py-2 w-max"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Boards</span>
            </button>

            {/* Edit and Delete Buttons - Very Visible */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
                aria-label="Edit task"
              >
                <Edit2 className="w-5 h-5" />
                <span className="hidden sm:inline">Edit Task</span>
                <span className="sm:hidden">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
                aria-label="Delete task"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">Delete Task</span>
                <span className="sm:hidden">Delete</span>
              </button>
            </div>
          </div>

          {/* Main Task Content */}
          <TaskDetailContent taskData={selectedTaskData} />
        </div>

        {/* Side Panel */}
        <TaskDetailSidePanel selectedTaskData={selectedTaskData} />
      </section>

      {/* Edit Modal */}
      <TaskModal 
        isOpen={isModalOpen && !isMobile} 
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialTask={selectedTaskData}
      />
      <TaskBottomsheet 
        isOpen={isModalOpen && isMobile} 
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialTask={selectedTaskData}
      />
    </>
  )
}