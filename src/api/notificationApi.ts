import { axiosInstance } from './axios';
import { Notification } from '../types';

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await axiosInstance.get('notifications/');
    return response.data;
  },
  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.patch(`notifications/${id}/`, { is_read: true });
  },
  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.post('notifications/mark-all-read/');
  }
};
