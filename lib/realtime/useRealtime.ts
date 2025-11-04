"use client"

import { useEffect, useRef } from 'react'
import { mutate } from 'swr'
import { WebsocketClient } from './websocketClient'
import { getTokenFromLS } from '@/lib/services/api/client'

export function useRealtime(isAuthenticated: boolean) {
  const clientRef = useRef<WebsocketClient | null>(null)
  const debounceTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      clientRef.current?.close()
      clientRef.current = null
      return
    }

    const onMessage = () => {
      // Debounce revalidation to avoid flooding API on bursty events
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = window.setTimeout(async () => {
        await mutate(
          (key) => typeof key === 'string' && key.startsWith('/api/tasks'),
          undefined,
          { revalidate: true }
        )
        debounceTimerRef.current = null
      }, 800)
    }

    const client = new WebsocketClient(() => getTokenFromLS() || null, { onMessage })
    client.connect()
    clientRef.current = client

    return () => {
      client.close()
      clientRef.current = null
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [isAuthenticated])
}


