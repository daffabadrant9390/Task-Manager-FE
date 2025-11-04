import { api } from './api/client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_id: string;
  username: string;
  message: string;
}

export const authService = {
  login: async(credentials: LoginRequest): Promise<LoginResponse> => {
    // Hash the password on the client for transit obfuscation
    async function hashPasswordSha256(input: string): Promise<string> {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      // Convert to hex string to avoid base64/url issues
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    const hashedPassword = await hashPasswordSha256(credentials?.password || '');

    const response = await api.post<LoginResponse>('/api/login', {
      username: credentials?.username || '',
      // Send the SHA-256 hash instead of the raw password
      password: hashedPassword,
    });

    // Store the token in localStorage
    if(typeof window !== 'undefined' && !!response?.token) {
      localStorage?.setItem('auth_token', response.token);
      localStorage?.setItem('user_id', response.user_id);
      localStorage?.setItem('username', response.username);
    }

    return response;
  },
  logout: () => {
    if(typeof window !== 'undefined') {
      localStorage?.removeItem('auth_token');
      localStorage?.removeItem('user_id');
      localStorage?.removeItem('username');
    }
  },

  getToken: (): Nullish<string> => {
    if(typeof window !== 'undefined') {
      return localStorage?.getItem('auth_token');
    }

    return null;
  },

  isAuthenticated: (): boolean => {
    if(typeof window !== 'undefined') {
      return !!localStorage?.getItem('auth_token');
    }

    return false;
  }
}