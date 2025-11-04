import { apiClient } from '@/lib/services/api/client'

describe('apiClient', () => {
  const originalFetch = global.fetch as unknown

  beforeEach(() => {
    // Ensure window exists in JSDOM tests
    global.window = {} as Window & typeof globalThis
    global.fetch = jest.fn()
    const ls = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    } as unknown as Storage
    // Provide mock via window only; global.localStorage may be readonly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.defineProperty(global.window as any, 'localStorage', { value: ls, configurable: true })
  })

  afterEach(() => {
    // @ts-expect-error test teardown - restoring original fetch
    global.fetch = originalFetch
    // no-op restore for window.localStorage; jest resets between tests
    jest.resetAllMocks()
  })

  it('calls fetch with base URL and JSON headers', async () => {
    // @ts-expect-error mock - jest mock type
    global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) })
    const res = await apiClient<{ ok: boolean }>('/health')
    expect(res).toEqual({ ok: true })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^http:\/\/localhost:8008\/health$/),
      expect.objectContaining({ headers: expect.objectContaining({ 'Content-Type': 'application/json' }) })
    )
  })

  it('surfaces API error message from JSON payload', async () => {
    // @ts-expect-error mock - jest mock type
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid or expired token' }),
    })
    await expect(apiClient('/api/tasks')).rejects.toThrow('Invalid or expired token')
  })
})


