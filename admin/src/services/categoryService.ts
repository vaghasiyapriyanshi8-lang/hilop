import apiClient from './api';

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export const categoryService = {
  getCategories: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get('/products/categories/list', { params });
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await apiClient.get(`/products/categories/₹{id}`);
    return response.data;
  },

  createCategory: async (data: CreateCategoryData) => {
    const response = await apiClient.post('/products/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<CreateCategoryData>) => {
    const response = await apiClient.patch(`/products/categories/₹{id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    await apiClient.delete(`/products/categories/₹{id}`);
  },
};
