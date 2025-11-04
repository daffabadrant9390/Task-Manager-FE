'use client'

import { useEffect, useState } from 'react'
import { statsService, type StatsByStatusResponse } from '@/lib/services/stats.service'
import { useAuth } from '@/lib/context/AuthContext'

export default function StatsPage() {
  const { userData, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<StatsByStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (authLoading) return
        const userId = userData?.id || ''
        if (!userId) {
          throw new Error('User not found. Please login again.')
        }
        const data = await statsService.getByUserId(userId)
        if (mounted) setStats(data)
      } catch (e: unknown) {
        if (mounted) setError((e as Error)?.message || 'Failed to load stats')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [authLoading, userData?.id])

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">My Task Status</h1>
      {(loading || authLoading) && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Todo</div>
            <div className="text-2xl font-bold">{stats.todo}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">In Progress</div>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Done</div>
            <div className="text-2xl font-bold">{stats.done}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
        </div>
      )}
    </div>
  )
}


