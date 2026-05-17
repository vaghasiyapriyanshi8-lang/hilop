import apiClient from './api';

export const userService = {
  getUsers: async (params: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.patch('/users/me', data);
    return response.data;
  },
  blockUser: async (id: string, blocked: boolean) => {
    const response = await apiClient.patch(`/users/${id}/block`, { blocked });
    return response.data;
  },
  deleteUser: async (id: string) => {
    await apiClient.delete(`/users/${id}`);
  },
  sendEmail: async (id: string, subject: string, message: string) => {
    const response = await apiClient.post(`/users/${id}/email`, { subject, message });
    return response.data;
  },
};
