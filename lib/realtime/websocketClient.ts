const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export type RealtimeEvent = {
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'task_status_changed'
  taskId: string
  userId: string
  version: number
  payload?: unknown
}

export type RealtimeCallbacks = {
  onMessage?: (evt: RealtimeEvent) => void
  onOpen?: () => void
  onClose?: (ev: CloseEvent) => void
  onError?: (ev: Event) => void
}

const toWsUrl = (httpUrl: string) => httpUrl.replace(/^http/, 'ws')

export class WebsocketClient {
  private ws: WebSocket | null = null
  private tokenProvider: () => string | null
  private callbacks: RealtimeCallbacks
  private reconnectAttempts = 0
  private closedByUser = false
  private channel = typeof window !== 'undefined' ? new BroadcastChannel('tm-updates') : null

  constructor(tokenProvider: () => string | null, callbacks: RealtimeCallbacks = {}) {
    this.tokenProvider = tokenProvider
    this.callbacks = callbacks
  }

  connect() {
    if (typeof window === 'undefined') return
    const token = this.tokenProvider()
    if (!token) return
    const wsUrl = toWsUrl(API_BASE_URL) + '/api/ws'
    // Browser WebSocket cannot set headers; use token via subprotocol is not ideal; rely on server JWT middleware on upgrade with header is not possible
    // So we pass token as query param for browsers
    const q = `?token=${encodeURIComponent(token)}`
    const finalUrl = wsUrl + q

    try {
      this.ws = new WebSocket(finalUrl)
    } catch {
      this.scheduleReconnect()
      return
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.callbacks.onOpen?.()
    }

    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as RealtimeEvent
        this.callbacks.onMessage?.(data)
        this.channel?.postMessage(data)
      } catch {
        // ignore bad payloads
      }
    }

    this.ws.onclose = (ev) => {
      this.callbacks.onClose?.(ev)
      this.ws = null
      if (!this.closedByUser) this.scheduleReconnect()
    }

    this.ws.onerror = (ev) => {
      this.callbacks.onError?.(ev)
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts += 1
    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts))
    setTimeout(() => this.connect(), delay)
  }

  close() {
    this.closedByUser = true
    this.ws?.close()
    this.ws = null
  }
}


