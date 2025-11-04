import { WebsocketClient } from '@/lib/realtime/websocketClient'

describe('WebsocketClient', () => {
  const OriginalWS = (global as any).WebSocket
  let createdUrl: string | null

  beforeEach(() => {
    createdUrl = null
    ;(global as any).WebSocket = class {
      onopen?: () => void
      onmessage?: (ev: MessageEvent) => void
      onerror?: (ev: Event) => void
      onclose?: (ev: CloseEvent) => void
      constructor(url: string) {
        createdUrl = url
      }
      close() {}
    }
  })

  afterEach(() => {
    ;(global as any).WebSocket = OriginalWS
  })

  it('appends JWT as query string when connecting', () => {
    const client = new WebsocketClient(() => 'abc.jwt.token')
    // @ts-expect-error jsdom environment
    Object.defineProperty(global, 'window', { value: {}, configurable: true })
    client.connect()
    expect(createdUrl).toMatch(/\/api\/ws\?token=.+/) // token present
  })
})


