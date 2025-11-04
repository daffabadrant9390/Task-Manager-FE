import { renderHook, act, waitFor } from '@testing-library/react'
import { useRealtime } from '@/lib/realtime/useRealtime'

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

// Mock WebsocketClient class to simulate message callback
jest.mock('@/lib/realtime/websocketClient', () => {
  return {
    WebsocketClient: class {
      private callbacks: any
      constructor(_: any, cbs: any) {
        this.callbacks = cbs
      }
      connect() {
        // Simulate one message arrival
        this.callbacks.onMessage?.({ type: 'task_created', taskId: 't1', userId: 'u1', version: 1 })
      }
      close() {}
    },
  }
})

describe('useRealtime', () => {
  it('connects when authenticated and triggers SWR mutate on message', async () => {
    const { result, rerender } = renderHook(({ auth }: { auth: boolean }) => useRealtime(auth), {
      initialProps: { auth: false },
    })
    expect(result).toBeDefined()

    // Activate
    rerender({ auth: true })
    // If no errors thrown, hook subscribed and processed a message via mocked client
    // SWR mutate is invoked by the hook; assertion occurs via mock call count
    const { mutate } = jest.requireMock('swr') as { mutate: jest.Mock }
    await waitFor(() => expect(mutate).toHaveBeenCalled())
  })
})


