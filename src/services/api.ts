import { axiosInstance } from '../api/axios';
import { MenuItem, Order, Notification, OrderStatus, User, Category, PaginatedResponse } from '../types';

export const api = {
  // Auth & Profile
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get('auth/me/');
    return response.data;
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.patch('auth/me/', data);
    return response.data;
  },
  updatePassword: async (data: any): Promise<{ message: string }> => {
    const response = await axiosInstance.post('auth/me/password/', data);
    return response.data;
  },

  // Meals & Categories
  getMeals: async (params?: any): Promise<PaginatedResponse<MenuItem>> => {
    const response = await axiosInstance.get('catalog/menu-items/', { params });
    return response.data;
  },
  getMeal: async (id: string): Promise<MenuItem> => {
    const response = await axiosInstance.get(`catalog/menu-items/${id}/`);
    return response.data;
  },
  createMeal: async (data: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await axiosInstance.post('catalog/menu-items/', data);
    return response.data;
  },
  updateMeal: async (id: number | string, data: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await axiosInstance.patch(`catalog/menu-items/${id}/`, data);
    return response.data;
  },
  softDeleteMeal: async (id: number | string): Promise<MenuItem> => {
    const response = await axiosInstance.patch(`catalog/menu-items/${id}/`, { is_available: false });
    return response.data;
  },
  getCategories: async (params?: any): Promise<PaginatedResponse<Category>> => {
    const response = await axiosInstance.get('catalog/categories/', { params });
    return response.data;
  },
  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.post('catalog/categories/', data);
    return response.data;
  },
  updateCategory: async (id: number | string, data: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.patch(`catalog/categories/${id}/`, data);
    return response.data;
  },
  deleteCategory: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`catalog/categories/${id}/`);
  },

  // Orders
  getOrders: async (params?: any): Promise<PaginatedResponse<Order>> => {
    const response = await axiosInstance.get('orders/', { params });
    return response.data;
  },
  getOrder: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get(`orders/${id}/`);
    return response.data;
  },
  createOrder: async (orderData: any): Promise<Order> => {
    const response = await axiosInstance.post('orders/', orderData);
    return response.data;
  },
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await axiosInstance.patch(`orders/${id}/update_status/`, { status });
    return response.data;
  },

  // Payments
  initiatePayment: async (orderId: number | string, phoneNumber: string) => {
    const response = await axiosInstance.post('payments/stk_push/', {
      order_id: orderId,
      phone_number: phoneNumber
    });
    return response.data;
  },

  // Notifications
  getNotifications: async (params?: any): Promise<PaginatedResponse<Notification>> => {
    const response = await axiosInstance.get('notifications/', { params });
    return response.data;
  },
  markNotificationRead: async (id: number | string): Promise<void> => {
    await axiosInstance.patch(`notifications/${id}/mark_read/`);
  },
  markAllNotificationsRead: async (): Promise<void> => {
    await axiosInstance.patch('notifications/mark_all_read/');
  },
  deleteNotification: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`notifications/${id}/`);
  },

  // Users (Admin)
  getUsers: async (params?: any): Promise<PaginatedResponse<User>> => {
    const response = await axiosInstance.get('auth/users/', { params });
    return response.data;
  },
  deactivateUser: async (id: number | string): Promise<void> => {
    await axiosInstance.patch(`auth/users/${id}/deactivate/`);
  },

  // Reports
  getReports: async (): Promise<any> => {
    const response = await axiosInstance.get('admin/reports/');
    return response.data;
  }
};
