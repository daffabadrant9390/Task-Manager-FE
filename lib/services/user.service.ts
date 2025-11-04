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
    return api.get<UsersResponse>('/api/users');
  }
}