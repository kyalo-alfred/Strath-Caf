import axios from 'axios';
import { mockMeals, mockOrders, mockNotifications, mockUsers } from './mockData';
import { Meal, Order, Notification, User, OrderStatus } from '../types';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Placeholder for Django backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  login: async (email: string, password: string):Promise<{user: User, token: string}> => {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return { user, token: 'mock-jwt-token' };
  },

  // Meals
  getMeals: async (): Promise<Meal[]> => {
    await delay(500);
    return mockMeals;
  },
  getMeal: async (id: string): Promise<Meal> => {
    await delay(300);
    const meal = mockMeals.find(m => m.id === id);
    if (!meal) throw new Error('Meal not found');
    return meal;
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    await delay(600);
    return mockOrders;
  },
  getOrder: async (id: string): Promise<Order> => {
    await delay(400);
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    await delay(1000);
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      estimatedReadyTime: new Date(Date.now() + 20 * 60000).toISOString(),
    } as Order;
    mockOrders.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await delay(500);
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    order.status = status;
    return order;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(400);
    return mockNotifications;
  },
};
