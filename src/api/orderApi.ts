import { axiosInstance } from './axios';
import { Order } from '../types';

export const orderApi = {
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('orders/');
    return response.data;
  },
  getOrder: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get(`orders/${id}/`);
    return response.data;
  },
  createOrder: async (data: Partial<Order>): Promise<Order> => {
    const response = await axiosInstance.post('orders/', data);
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await axiosInstance.patch(`orders/${id}/`, { status });
    return response.data;
  }
};
