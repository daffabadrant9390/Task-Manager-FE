import { api } from './api/client';

export interface StatsByStatusResponse {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

export const statsService = {
  getByUserId: async(userId: string): Promise<StatsByStatusResponse> => {
    return api.get<StatsByStatusResponse>(`/api/stats/${userId}`);
  },
};


