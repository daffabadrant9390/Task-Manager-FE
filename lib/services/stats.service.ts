import { api } from './api/client';

export interface StatsByStatusResponse {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

export const statsService = {
  getByUserId: async(userId: string): Promise<StatsByStatusResponse> => {
    try {
      const res = await api.get<StatsByStatusResponse>(`/api/stats/${userId}`);
      return {
        todo: res?.todo ?? 0,
        inProgress: res?.inProgress ?? 0,
        done: res?.done ?? 0,
        total: res?.total ?? ((res?.todo ?? 0) + (res?.inProgress ?? 0) + (res?.done ?? 0)),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stats';
      throw new Error(message);
    }
  },
};


