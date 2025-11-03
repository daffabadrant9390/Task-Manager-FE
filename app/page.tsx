"use client"

import { useState } from "react"
import { useDeviceType } from "@/lib/hooks/useDeviceType"
import { TaskListStatusDashboard } from "@/components/TaskListStatusDashboard/TaskListStatusDashboard"
import { TaskModal } from "@/components/TaskModal/TaskModal"
import { TaskBottomsheet } from "@/components/TaskModal/TaskBottomsheet"
import { useTaskStore } from "@/lib/store/useTaskStore"
import { formatDateString } from "@/lib/utils/dateUtils"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<null>(null)
  const { isMobile } = useDeviceType()
  
  const { tasks, addTask } = useTaskStore()

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleSubmit = (taskData: any) => {
    // Convert dates from YYYY-MM-DD to "30 Oct 2025" format
    const formattedTask = {
      ...taskData,
      startDate: formatDateString(taskData.startDate),
      endDate: formatDateString(taskData.endDate),
      // For new tasks, set default values
      status: taskData.status || "todo",
      projectId: taskData.projectId || "AC-2015",
      effort: taskData.effort || 1,
      priority: taskData.priority || "medium",
    }

    // Create new task (edit is handled in task detail page)
    addTask(formattedTask)
  }

  return (
    <>
      <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6">
        <TaskListStatusDashboard
          tasks={tasks}
          onCreateTask={handleCreateTask}
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
