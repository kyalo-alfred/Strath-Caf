import { axiosInstance } from './axios';
import { User } from '../types';

export const authApi = {
  loginCustomer: async (email: string, pass: string): Promise<{ user: User, access: string, refresh: string }> => {
    // Expected endpoint: POST /api/auth/student/login/
    const response = await axiosInstance.post('auth/student/login/', { email, password: pass });
    return response.data;
  },
  loginStaff: async (email: string, pass: string): Promise<{ user: User, access: string, refresh: string }> => {
    // Expected endpoint: POST /api/auth/staff/login/
    const response = await axiosInstance.post('auth/staff/login/', { email, password: pass });
    return response.data;
  },
  loginAdmin: async (email: string, pass: string): Promise<{ user: User, access: string, refresh: string }> => {
    // Expected endpoint: POST /api/auth/admin/login/
    const response = await axiosInstance.post('auth/admin/login/', { email, password: pass });
    return response.data;
  },
  registerCustomer: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await axiosInstance.post('auth/student/register/', data);
    return response.data;
  },
  registerStaff: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await axiosInstance.post('auth/staff/register/', data);
    return response.data;
  },
  logout: async (): Promise<void> => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      await axiosInstance.post('auth/logout/', { refresh });
    }
  }
};
