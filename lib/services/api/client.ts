const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

// Get token from localStorage
export const getTokenFromLS = (): Nullish<string> => {
  if(typeof window !== 'undefined') {
    return localStorage?.getItem('auth_token');
  }

  return null;
}

// API client function
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Centralized API client with defensive guards and consistent errors
  const token = getTokenFromLS();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle non-2xx responses with payload-aware message when possible
    if (!response.ok) {
      const errorPayload = await response
        .json()
        .catch(() => ({ error: `HTTP ${response.status}` }));
      const message = (errorPayload as { error?: string; message?: string })?.error
        || (errorPayload as { message?: string })?.message
        || `HTTP error! status: ${response.status}`;
      throw new Error(message);
    }

    // Some endpoints may return 204 No Content
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    // Parse JSON safely; normalize empty body
    const data = await response
      .json()
      .catch(() => ({}));
    return data as T;
  } catch (err) {
    // Network or parsing failures normalized to a consistent Error
    const message = err instanceof Error ? err.message : 'Network request failed';
    throw new Error(message);
  }
} 

// Helper functions for different HTTP methods
export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'DELETE' }),
};