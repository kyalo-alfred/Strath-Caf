import { axiosInstance } from './axios';
import { MenuItem, Category } from '../types';

export const menuApi = {
  getMenu: async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get('menu/');
    return response.data;
  },
  getMenuItem: async (id: string): Promise<MenuItem> => {
    const response = await axiosInstance.get(`menu/${id}/`);
    return response.data;
  },
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('categories/');
    return response.data;
  },
  createMenuItem: async (data: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await axiosInstance.post('menu/', data);
    return response.data;
  },
  updateMenuItem: async (id: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await axiosInstance.patch(`menu/${id}/`, data);
    return response.data;
  },
  deleteMenuItem: async (id: string): Promise<void> => {
    await axiosInstance.delete(`menu/${id}/`);
  }
};
