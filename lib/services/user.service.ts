import { api } from './api/client';

export interface AppUser {
  id: string;
  username: string;
}

export interface UsersResponse {
  users: AppUser[];
  count: number;
}

export const userService = {
  getAllUsers: async(): Promise<UsersResponse> => {
    try {
      const res = await api.get<UsersResponse>('/api/users');
      return {
        users: res?.users ?? [],
        count: res?.count ?? (res?.users?.length ?? 0),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      throw new Error(message);
    }
  }
}