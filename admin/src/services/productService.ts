import apiClient from './api';

export const productService = {
  getProducts: async (params: { page?: number; limit?: number; search?: string; category?: string; sort?: string }) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  },
  createProduct: async (data: any) => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },
  updateProduct: async (id: string, data: any) => {
    const response = await apiClient.patch(`/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    await apiClient.delete(`/products/${id}`);
  },
};
