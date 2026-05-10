import apiClient from './api';

export const analyticsService = {
  getOverview: async () => {
    const response = await apiClient.get('/analytics/overview');
    return response.data;
  },
};
