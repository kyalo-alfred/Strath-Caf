import { axiosInstance } from '../api/axios';
import { MenuItem, Order, Notification, OrderStatus, User, Category } from '../types';

export const api = {
  // Meals & Categories
  getMeals: async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get('catalog/menu-items/');
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
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('catalog/categories/');
    return response.data;
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('orders/');
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
  getNotifications: async (): Promise<Notification[]> => {
    const response = await axiosInstance.get('notifications/');
    return response.data;
  },
  markNotificationRead: async (id: number | string): Promise<void> => {
    await axiosInstance.patch(`notifications/${id}/mark_read/`);
  },
  markAllNotificationsRead: async (): Promise<void> => {
    await axiosInstance.patch('notifications/mark_all_read/');
  },

  // Users (Admin)
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('auth/users/');
    return response.data;
  },
  deactivateUser: async (id: number | string): Promise<void> => {
    await axiosInstance.patch(`auth/users/${id}/deactivate/`);
  }
};
