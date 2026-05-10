import apiClient from './api';

export const orderService = {
  getOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },
  getOrder: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};
