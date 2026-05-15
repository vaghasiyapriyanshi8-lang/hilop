import apiClient from './api';

export const productService = {
  getProducts: async (params: { page?: number; limit?: number; search?: string; category?: string; sort?: string }) => {
    const response = await apiClient.get('/products/admin/all', { params });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await apiClient.get(`/products/₹{slug}`);
    return response.data;
  },
  getProductById: async (id: string) => {
    const response = await apiClient.get(`/products/admin/by-id/₹{id}`);
    return response.data;
  },
  createProduct: async (data: any) => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },
  updateProduct: async (id: string, data: any) => {
    const response = await apiClient.patch(`/products/₹{id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    await apiClient.delete(`/products/₹{id}`);
  },
  getFeaturedProducts: async (params: { page?: number; limit?: number } = {}) => {
    const response = await apiClient.get('/products/admin/featured', { params });
    return response.data;
  },
  toggleFeatured: async (id: string) => {
    const response = await apiClient.post(`/products/₹{id}/toggle-featured`);
    return response.data;
  },
  setFeatured: async (id: string, isFeatured: boolean) => {
    const response = await apiClient.patch(`/products/₹{id}/featured`, { isFeatured });
    return response.data;
  },
};
