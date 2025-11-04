import { authService } from '@/lib/services/auth.service'
import { api } from '@/lib/services/api/client'

jest.mock('@/lib/services/api/client', () => {
  const actual = jest.requireActual('@/lib/services/api/client')
  return {
    __esModule: true,
    ...actual,
    api: {
      post: jest.fn(),
    },
  }
})

describe('authService.login', () => {
  const originalCrypto = global.crypto as unknown

  beforeEach(() => {
    // Stub subtle.digest to return predictable bytes: [0xaa, 0xbb]
    const subtle = { digest: async () => new Uint8Array([0xaa, 0xbb]).buffer }
    // @ts-expect-error test setup
    global.crypto = { subtle }
    // Ensure window.crypto matches
    // @ts-expect-error test setup
    global.window = (global.window || {}) as Window
    ;(global.window as any).crypto = { subtle }
    // Also ensure globalThis points to the same crypto
    // @ts-expect-error test setup
    if (!(global as any).globalThis) {
      // @ts-expect-error test setup
      ;(global as any).globalThis = global
    }
    ;(global as any).globalThis.crypto = { subtle }
    // Ensure window exists for spies
    // @ts-expect-error test setup
    global.window = (global.window || {}) as Window
  })

  afterEach(() => {
    // @ts-expect-error teardown
    global.crypto = originalCrypto
    if ((global as any).window) {
      // @ts-expect-error teardown
      delete (global as any).window.crypto
    }
    jest.resetAllMocks()
  })

  it('hashes the password and stores token/user info', async () => {
    ;(api.post as jest.Mock).mockResolvedValue({
      token: 'tkn',
      user_id: 'uid-1',
      username: 'alice',
      message: 'ok',
    })
    // Override localStorage with a mock that we can assert against
    const lsMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    }
    Object.defineProperty(window as any, 'localStorage', { value: lsMock, configurable: true })

    await authService.login({ username: 'alice', password: 'secret' })

    // Password should be a lowercase hex string derived from hashing
    expect(api.post).toHaveBeenCalledWith(
      '/api/login',
      expect.objectContaining({
        username: 'alice',
        password: expect.stringMatching(/^[0-9a-f]+$/),
      })
    )
    expect(lsMock.setItem).toHaveBeenCalledWith('auth_token', 'tkn')
    expect(lsMock.setItem).toHaveBeenCalledWith('user_id', 'uid-1')
    expect(lsMock.setItem).toHaveBeenCalledWith('username', 'alice')
  })
})


