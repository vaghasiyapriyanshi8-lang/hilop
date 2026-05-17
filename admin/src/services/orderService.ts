import apiClient from './api';

export const orderService = {
  getOrders: async (page: number = 1, limit: number = 10, paymentStatus?: string) => {
    const response = await apiClient.get('/orders/admin/all', {
      params: { page, limit, paymentStatus }
    });
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
  resolveReturn: async (id: string, payload: { status: 'approved' | 'rejected'; adminNote?: string }) => {
    const response = await apiClient.patch(`/orders/${id}/return/resolve`, payload);
    return response.data;
  },
  getReturnRequests: async () => {
    // Fetch all orders and filter those with returnRequest
    const response = await apiClient.get('/orders/admin/all', { params: { limit: 200 } });
    const orders = response.data?.data || [];
    return orders.filter((o: any) => o.returnRequest);
  },
};
