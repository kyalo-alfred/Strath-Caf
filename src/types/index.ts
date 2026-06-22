export type Role = 'customer' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  studentNumber?: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Drinks';
  imageUrl: string;
  isAvailable: boolean;
  prepTimeMinutes: number;
  ingredients?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Collected' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  estimatedReadyTime: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
