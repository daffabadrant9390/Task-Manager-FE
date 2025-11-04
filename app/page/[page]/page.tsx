"use client"

import { useEffect, useState } from "react"
import { useDeviceType } from "@/lib/hooks/useDeviceType"
import { TaskListStatusDashboard } from "@/components/TaskListStatusDashboard/TaskListStatusDashboard"
import { TaskModal } from "@/components/TaskModal/TaskModal"
import { TaskBottomsheet } from "@/components/TaskModal/TaskBottomsheet"
import { useTaskStore } from "@/lib/store/useTaskStore"
import { formatDateString } from "@/lib/utils/dateUtils"
import { TaskDataItem } from "@/lib/types/tasksData"
import { useTasks } from "@/lib/hooks/useTasks"
import { Loader2 } from "lucide-react"
import { generateProjectId } from "@/lib/utils/projectIdGenerator"
import { useParams, useRouter, useSearchParams } from "next/navigation"

export default function PagedHome() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<null>(null)
  const { isMobile } = useDeviceType()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const pageNum = Number(params?.page ?? 1) || 1
  const sort = (searchParams.get('sort') as 'asc' | 'desc') || 'desc'
  
  // Use SWR hook for fetching tasks for current page
  const { tasks, isLoading, mutate, meta } = useTasks({ page: pageNum, limit: 5, sort })
  const { addNewTask } = useTaskStore();

  // Fetch the tasks on mount and when mutate is called
  useEffect(() => {
    mutate();
  }, [mutate])

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleSubmit = async(taskData: TaskDataItem) => {
    try {
      const formattedTaskData: TaskDataItem = {
        ...taskData,
        startDate: formatDateString(taskData.startDate),
        endDate: formatDateString(taskData.endDate),
        status: taskData?.status || "todo",
        projectId: taskData?.projectId || generateProjectId(),
        effort: taskData?.effort || 0,
        priority: taskData?.priority || "low",
      }

      await addNewTask(formattedTaskData);
      mutate();
      handleModalClose();
    } catch (error) {
      console.error("Failed to create new task:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6">
        <TaskListStatusDashboard
          tasks={tasks}
          onCreateTask={handleCreateTask}
          serverMeta={{
            page: meta.page,
            limit: meta.limit,
            total: meta.total,
            sort: meta.sort,
            onPageChange: (nextPage) => router.push(`/page/${nextPage}?sort=${meta.sort}`),
            onSortChange: (nextSort) => router.push(`/page/${meta.page}?sort=${nextSort}`)
          }}
        />
      </div>
      <TaskModal 
        isOpen={isModalOpen && !isMobile} 
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialTask={editingTask}
      />
      <TaskBottomsheet 
        isOpen={isModalOpen && isMobile} 
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialTask={editingTask}
      />
    </>
  )
}


