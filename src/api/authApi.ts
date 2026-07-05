import { axiosInstance } from './axios';
import { User } from '../types';

export const authApi = {
  login: async (email: string, pass: string): Promise<{ user: User, access: string, refresh: string }> => {
    const response = await axiosInstance.post('auth/login/', { email, password: pass });
    return response.data;
  },
  registerCustomer: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await axiosInstance.post('auth/register/', data);
    return response.data;
  },
  registerServer: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await axiosInstance.post('auth/register/', data);
    return response.data;
  },
  logout: async (): Promise<void> => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};
