import { axiosInstance } from '../api/axios';
import { MenuItem, Order, Notification, OrderStatus } from '../types';

export const api = {
  // Meals
  getMeals: async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get('catalog/menu-items/');
    return response.data;
  },
  getMeal: async (id: string): Promise<MenuItem> => {
    const response = await axiosInstance.get(`catalog/menu-items/${id}/`);
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
  }
};
